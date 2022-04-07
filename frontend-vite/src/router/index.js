import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      // ログインが必要な画面には「requiresAuth」フラグを付けておく
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
  ],
});

/**
 * Routerで画面遷移する際に毎回実行されるナビゲーションガード
 */
router.beforeEach((to) => {
  const authStore = useAuthStore();

  const isLoggedIn = authStore.isLoggedIn;
  const token = localStorage.getItem("access");
  console.log("to.path=", to.path);
  console.log("isLoggedIn=", isLoggedIn);

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // ログインしていない場合
    if (!isLoggedIn) {
      console.log("User is not logged in.");
      // まだ認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        console.log("Try to renew user info.");
        authStore.renew().catch(() => {
          // 再取得できなければログイン画面へ
          forceToLoginPage(to);
        });
      } else {
        // 認証用トークンが無い場合は、ログイン画面へ
        forceToLoginPage(to);
      }
    }
  }
});

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage(to) {
  console.log("Force to login page.");
  router.push({
    path: "/login",
    // 遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath },
  });
}

export default router;

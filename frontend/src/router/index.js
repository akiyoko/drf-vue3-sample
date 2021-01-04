import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: "/",
    component: Home,
    // ログインが必要な画面には「requiresAuth」フラグを付けておく
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

/**
 * Routerで画面遷移する際に毎回実行されるナビゲーションガード
 */
router.beforeEach(to => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const token = localStorage.getItem("access");
  console.log("to.path=", to.path);
  console.log("isLoggedIn=", isLoggedIn);

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // ログインしていない場合
    if (!isLoggedIn) {
      console.log("User is not logged in.");
      // まだ認証用トークンが残っていればユーザー情報を再取得
      if (token != null) {
        console.log("Trying to reload again.");
        store.dispatch("auth/reload").catch(() => {
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
    query: { next: to.fullPath }
  });
}

export default router;

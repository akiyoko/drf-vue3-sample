import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // ログイン画面
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      // ホーム画面
      path: "/",
      name: "home",
      component: HomeView,
      // ログインが必要な画面には「requiresAuth」フラグを付けておく
      meta: { requiresAuth: true },
    },
    {
      // 定義外のパスをリダイレクト
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

/**
 * ルーターによる画面遷移の直前に実行されるナビゲーションガード
 */
router.beforeEach((to) => {
  // ログイン状態を取得
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  // 未ログイン状態で、且つログインが必要な画面に遷移しようとした場合
  if (!isLoggedIn && to.meta.requiresAuth) {
    // ユーザー情報を再取得
    authStore.renew().catch(() => {
      // 再取得できなければログイン画面に強制送還
      forceToLoginPage(to);
    });
  }
});

/**
 * ログイン画面に強制送還
 */
function forceToLoginPage(to) {
  router.replace({
    name: "login",
    // 遷移しようとしたURLをクエリ文字列として付与
    query: { next: to.fullPath },
  });
}

export default router;

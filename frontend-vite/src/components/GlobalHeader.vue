<template>
  <!-- ヘッダナビゲーション -->
  <div id="header">
    <b-navbar type="dark" variant="dark">
      <a class="navbar-brand" href="/">DRF Sample</a>
      <b-navbar-nav class="ml-auto" v-if="$route.meta.requiresAuth">
        <b-nav-item-dropdown right v-if="isLoggedIn">
          <template v-slot:button-content>{{ username }}</template>
          <b-dropdown-item href="#" @click="clickLogout">
            ログアウト
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="#" @click="clickLogin" v-else>ログイン</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useMessageStore } from "../stores/message.js";

export default {
  setup() {
    // ストアオブジェクトを取得
    const authStore = useAuthStore();
    const messageStore = useMessageStore();
    // ルーターオブジェクトを取得
    const router = useRouter();

    // リアクティビティを損なわずに分割代入するにはstoreToRefs()を利用する
    const { username, isLoggedIn } = storeToRefs(authStore);

    /**
     * ログインボタン押下
     */
    const clickLogin = () => {
      // メッセージをクリア
      messageStore.clear();
      // ログイン画面に遷移
      router.replace({ name: "login" });
    };
    /**
     * ログアウトリンク押下
     */
    const clickLogout = () => {
      // メッセージをクリア
      messageStore.clear();
      // ログアウト
      authStore.logout();
      // インフォメーションメッセージを表示
      messageStore.showInfoMessage("ログアウトしました。");
      // ログイン画面に遷移
      router.replace({ name: "login" });
    };

    // テンプレートに公開
    return {
      username,
      isLoggedIn,
      clickLogin,
      clickLogout,
    };
  },
};
</script>

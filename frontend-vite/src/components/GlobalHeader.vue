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
import { useMessageStore } from "@/stores/message.js";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const messageStore = useMessageStore();

    const { username, isLoggedIn } = storeToRefs(authStore);

    // ログインボタン押下
    const clickLogin = () => {
      messageStore.clear();
      router.replace("/login");
    };
    // ログアウトリンク押下
    const clickLogout = () => {
      authStore.logout();
      messageStore.setInfoMessage("ログアウトしました。");
      router.replace("/login");
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

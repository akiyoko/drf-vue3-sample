<template>
  <!-- ヘッダ -->
  <v-app-bar id="header" color="grey-darken-4">
    <v-app-bar-title>
      <v-btn href="/">DRF Sample</v-btn>
    </v-app-bar-title>
    <template v-slot:append v-if="$route.meta.requiresAuth">
      <v-btn v-if="isLoggedIn">
        {{ username }}
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn variant="flat" href="#" @click="clickLogout"
                  >ログアウト
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn href="#" @click="clickLogin" v-else>ログイン</v-btn>
    </template>
  </v-app-bar>
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
    // リアクティビティを損なわずに分割代入するにはstoreToRefs関数を利用する
    const { username, isLoggedIn } = storeToRefs(authStore);
    // ルーターオブジェクトを取得
    const router = useRouter();

    /**
     * ログインリンク押下
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
      messageStore.setInfoMessage("ログアウトしました。");
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

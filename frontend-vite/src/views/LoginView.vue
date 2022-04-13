<template>
  <main>
    <GlobalHeader />
    <GlobalMessage />

    <form @submit.prevent="submitLogin">
      <div>
        <h1>ログイン</h1>
      </div>
      <div>
        <input v-model="username" label="ユーザー名" required />
        <input type="password" v-model="password" label="パスワード" required />
      </div>
      <div>
        <button color="primary" type="submit">ログイン</button>
      </div>
    </form>

    <!-- デバッグエリア -->
    <pre>username: {{ username }}</pre>
    <pre>password: {{ password }}</pre>
    <pre>authStore: {{ authStore }}</pre>
    <pre>messageStore: {{ messageStore }}</pre>
  </main>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth.js";
import { useMessageStore } from "../stores/message.js";
import GlobalHeader from "../components/GlobalHeader.vue";
import GlobalMessage from "../components/GlobalMessage.vue";

export default {
  name: "LoginView",
  components: {
    GlobalHeader,
    GlobalMessage,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const messageStore = useMessageStore();

    // 入力フォームの内容をリアクティブにする
    // ユーザー名
    const username = ref("");
    // パスワード
    const password = ref("");

    /**
     * ログインボタン押下
     */
    const submitLogin = () => {
      // メッセージをクリア
      messageStore.clear();
      // ログイン実行
      authStore
        .login(username.value, password.value)
        .then(() => {
          // インフォメーションメッセージを表示
          messageStore.showInfoMessage("ログインしました。");
          // ホーム画面に遷移（クエリ文字列「next」が指定されていれば指定画面に遷移）
          const next = route.query.next || "/";
          router.replace(next);
        })
        .catch((error) => {
          // エラー発生時はエラーメッセージを表示
          messageStore.showMessage(error);
        });
    };

    // テンプレートに公開
    return {
      username,
      password,
      submitLogin,
      // デバッグ用
      authStore: storeToRefs(authStore),
      messageStore: storeToRefs(messageStore),
    };
  },
};
</script>

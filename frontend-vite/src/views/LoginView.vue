<template>
  <main id="login-view">
    <GlobalHeader />
    <GlobalMessage />

    <form @submit.prevent="submitLogin">
      <div>
        <h1>ログイン</h1>
      </div>
      <div>
        <input v-model="data.username" label="ユーザー名" required />
        <input
          type="password"
          v-model="data.password"
          label="パスワード"
          required
        />
      </div>
      <div>
        <button color="primary" type="submit">ログイン</button>
      </div>
    </form>
  </main>

  <pre>data: {{ data }}</pre>
  <pre>authStore: {{ authStore }}</pre>
  <pre>messageStore: {{ messageStore }}</pre>
</template>

<script>
import { reactive } from "vue";
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
    const data = reactive({
      username: "",
      password: "",
    });

    // ログインボタン押下
    const submitLogin = () => {
      // メッセージをクリア
      messageStore.clear();
      // ログイン実行
      authStore
        .login(data.username, data.password)
        .then(() => {
          console.log("Login succeeded.");
          messageStore.showInfoMessage("ログインしました。");
          // クエリ文字列に「next」がなければ、ホーム画面へ
          const next = route.query.next || "/";
          router.replace(next);
        })
        .catch((error) => {
          // TODO: 必要？
          // authStore.logout();
          // TODO
          console.log("error=", error);
          messageStore.showMessage(error);
        });
    };

    // テンプレートに公開
    return {
      data,
      submitLogin,
      authStore: storeToRefs(authStore),
      messageStore: storeToRefs(messageStore),
    };
  },
};
</script>

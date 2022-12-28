<template>
  <v-app>
    <GlobalHeader />

    <v-main>
      <GlobalMessage />

      <!-- 入力フォーム -->
      <v-container id="form">
        <v-card class="mx-auto pa-8" elevation="4" width="600">
          <v-card-title class="mb-8">ログイン</v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field
                v-model="username"
                label="ユーザー名"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="パスワード"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              variant="elevated"
              color="success"
              class="mx-auto"
              @click="submitLogin"
            >
              ログイン
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <!-- デバッグ -->
      <v-container id="debug">
        <pre>
username: {{ username }}
password: {{ password }}
authStore: {{ authStore }}
messageStore: {{ messageStore }}
        </pre>
      </v-container>
    </v-main>
  </v-app>
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
    // ストアオブジェクトを取得
    const authStore = useAuthStore();
    const messageStore = useMessageStore();
    // ルーターオブジェクトを取得
    const router = useRouter();
    // 現在のパスに対応するルートを取得
    const route = useRoute();

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
          messageStore.setInfoMessage("ログインしました。");
          // ホーム画面に遷移（クエリ文字列「next」が指定されていれば指定画面に遷移）
          const next = route.query.next || "/";
          router.replace(next);
        })
        .catch((error) => {
          // エラー発生時はエラーメッセージを表示
          console.log("error", error);
          messageStore.setError(error);
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

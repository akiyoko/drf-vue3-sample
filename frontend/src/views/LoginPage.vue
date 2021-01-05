<template>
  <div id="login-page">
    <GlobalHeader />
    <GlobalMessage />

    <!-- メインエリア -->
    <main class="container">
      <p class="h5 mb-4">ログイン</p>
      <form @submit.prevent="submitLogin">
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">ユーザー名</label>
          <div class="col-sm-8">
            <input type="text" v-model="form.username" required />
          </div>
        </div>
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">パスワード</label>
          <div class="col-sm-8">
            <input type="password" v-model="form.password" required />
          </div>
        </div>
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <button type="submit" variant="primary">ログイン</button>
          </div>
        </div>
      </form>
    </main>
  </div>

  <pre>form: {{ form }}</pre>
  <pre>state: {{ this.$store.state }}</pre>
</template>

<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalMessage from "@/components/GlobalMessage.vue";

export default {
  components: {
    GlobalHeader,
    GlobalMessage
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    // data
    // 入力フォームの内容
    const form = reactive({
      username: "",
      password: ""
    });

    // methods
    // ログインボタン押下
    const submitLogin = () => {
      // ログイン実行
      store
        .dispatch("auth/login", {
          username: form.username,
          password: form.password
        })
        .then(() => {
          console.log("Login succeeded.");
          store.dispatch("message/setInfoMessage", {
            message: "ログインしました。"
          });
          // クエリ文字列に「next」がなければ、ホーム画面へ
          const next = route.query.next || "/";
          router.replace(next);
        });
    };

    return {
      form,
      submitLogin
    };
  }
};
</script>

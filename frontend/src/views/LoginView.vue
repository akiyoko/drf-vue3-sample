<template>
  <v-container>
    <v-card class="mx-auto" max-width="600">
      <v-form @submit.prevent="submitLogin">
        <v-card-header>
          <v-row>
            <div class="text-h6 mb-1">Headline</div>
          </v-row>
          <v-row>
            <v-text-field
              v-model="data.username"
              label="ユーザー名"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="data.password"
              label="パスワード"
              required
            ></v-text-field>
          </v-row>
        </v-card-header>
        <v-card-actions>
          <v-row align="center" justify="space-around">
            <v-btn variant="outlined" color="primary">aaa</v-btn>
            <v-btn color="primary" type="submit">ログイン</v-btn>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>

  <v-container id="login-page">
    <v-row class="text-center">
      <p class="h5 mb-4">ログイン</p>
      <v-form @submit.prevent="submitLogin">
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">ユーザー名</label>
          <div class="col-sm-8">
            <v-text-field type="text" v-model="data.username" required />
          </div>
        </div>
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">パスワード</label>
          <div class="col-sm-8">
            <v-text-field type="password" v-model="data.password" required />
          </div>
        </div>
        <div class="row text-center mt-5">
          <div class="col-sm-12">
            <button type="submit" variant="primary">ログイン</button>
          </div>
        </div>
      </v-form>
    </v-row>
  </v-container>

  <pre>data: {{ data }}</pre>
  <pre>state: {{ this.$store.state }}</pre>
</template>

<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
// import GlobalHeader from "@/components/GlobalHeader.vue";
// import GlobalMessage from "@/components/GlobalMessage.vue";

export default {
  name: "LoginView",
  // components: {
  //   GlobalHeader,
  //   GlobalMessage
  // },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    // 入力フォームの内容をリアクティブにする
    const data = reactive({
      username: "",
      password: "",
    });

    // ログインボタン押下
    const submitLogin = () => {
      // ログイン実行
      store
        .dispatch("auth/login", {
          username: data.username,
          password: data.password,
        })
        .then(() => {
          console.log("Login succeeded.");
          store.dispatch("message/setInfoMessage", {
            message: "ログインしました。",
          });
          // クエリ文字列に「next」がなければ、ホーム画面へ
          const next = route.query.next || "/";
          router.replace(next);
        });
    };

    return {
      data,
      submitLogin,
    };
  },
};
</script>

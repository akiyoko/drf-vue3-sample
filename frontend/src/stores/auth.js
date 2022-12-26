import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // ユーザー名
    username: "",
    // ログイン状態
    isLoggedIn: false,
  }),
  actions: {
    /**
     * ログイン
     */
    login(username, password) {
      // ログインAPIにPOSTリクエスト
      return api
        .post("/auth/login/", {
          username: username,
          password: password,
        })
        .then((response) => {
          // 認証用トークンをlocalStorageに保存
          localStorage.setItem("access", response.data.access_token);
          // ストアのユーザー情報を更新
          this.username = response.data.user.username;
          this.isLoggedIn = true;
        });
    },
    /**
     * ログアウト
     */
    logout() {
      // 認証用トークンをlocalStorageから削除
      localStorage.removeItem("access");
      // ストアのユーザー情報をクリア
      this.username = "";
      this.isLoggedIn = false;
    },
    /**
     * ユーザー情報更新
     */
    renew() {
      // ユーザー情報取得APIにGETリクエスト
      return api.get("/auth/user/").then((response) => {
        // ストアのユーザー情報を更新
        this.username = response.data.username;
        this.isLoggedIn = true;
      });
    },
  },
});

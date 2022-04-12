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
      return api
        .post("/auth/jwt/create/", {
          username: username,
          password: password,
        })
        .then((response) => {
          // 認証用トークンをlocalStorageに保存
          localStorage.setItem("access", response.data.access);
          // ユーザー情報を取得してストアを更新
          this.renew();
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
      return api.get("/auth/users/me/").then((response) => {
        const user = response.data;
        // ストアのユーザー情報を更新
        this.username = user.username;
        this.isLoggedIn = true;
      });
    },
  },
});

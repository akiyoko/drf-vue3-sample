import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    username: "",
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
          // ユーザー情報を取得してstoreのユーザー情報を更新
          this.renew();
        });
    },
    /**
     * ログアウト
     */
    logout() {
      // 認証用トークンをlocalStorageから削除
      localStorage.removeItem("access");
      // storeのユーザー情報をクリア
      this.username = "";
      this.isLoggedIn = false;
    },
    /**
     * ユーザー情報更新
     */
    renew() {
      return api.get("/auth/users/me/").then((response) => {
        const user = response.data;
        // storeのユーザー情報を更新
        this.username = user.username;
        this.isLoggedIn = true;
      });
    },
  },
});
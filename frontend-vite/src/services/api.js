import axios from "axios";
// import store from "@/store";
// import { useAuthStore } from "@/stores/auth.js";

// const authStore = useAuthStore();

const api = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 共通前処理
api.interceptors.request.use(
  (config) => {
    // 認証用トークンがあればリクエストヘッダに加える
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = "JWT " + token;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 共通エラー処理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error.response=", error.response);
    // エラーの内容に応じた処理をする
    switch (error.response?.status) {
      // バリデーションNG
      case 400: {
        console.log("error.response.data=", error.response.data);
        // TODO: 入れ子の配列をフラットな配列にする
        const messages = Object.values(error.response.data).flat();
        console.log("messages=", messages);
        return Promise.reject({ level: "warning", messages: messages });
      }
      // 認証エラー
      case 401: {
        const token = localStorage.getItem("access");
        const message = token == null ? "認証エラー" : "ログイン有効期限切れ";
        // 必要？
        // authStore.logout();
        return Promise.reject({ level: "error", message: message });
      }
      case 403: // 権限エラー
        // return Promise.reject(new Error("権限エラーです。"));
        return Promise.reject({ level: "error", message: "権限エラーです。" });
      // その他のエラー
      default:
        console.log("error.message=", error.message);
        return Promise.reject(new Error("想定外のエラーです。"));
    }

    // let message;
    // if (status === 400) {
    //   // バリデーションNG
    //   const messages = [].concat.apply([], Object.values(error.response.data));
    //   store.dispatch("message/setWarningMessages", { messages: messages });
    // } else if (status === 401) {
    //   // 認証エラー
    //   const token = localStorage.getItem("access");
    //   if (token != null) {
    //     message = "ログイン有効期限切れ";
    //   } else {
    //     message = "認証エラー";
    //   }
    //   store.dispatch("auth/logout");
    //   store.dispatch("message/setErrorMessage", { message: message });
    // } else if (status === 403) {
    //   // 権限エラー
    //   message = "権限エラーです。";
    //   store.dispatch("message/setErrorMessage", { message: message });
    // } else {
    //   // その他のエラー
    //   message = "想定外のエラーです。";
    //   store.dispatch("message/setErrorMessage", { message: message });
    // }
    // return Promise.reject(error);
  }
);

export default api;

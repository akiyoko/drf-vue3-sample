import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API,
  timeout: import.meta.env.VITE_TIMEOUT_MS || 5000,
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
  }
  // TODO: 不要？
  // (error) => {
  //   return Promise.reject(error);
  // }
);

// 共通後処理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error=", error);
    // エラーの内容に応じた処理をする
    switch (error.response?.status) {
      // バリデーションNG
      case 400: {
        // TODO: 入れ子の配列をフラットな配列にする
        const messages = Object.values(error.response.data).flat();
        return Promise.reject({ level: "warning", messages: messages });
      }
      // 認証エラー
      case 401: {
        // return Promise.reject({ level: "error", message: "認証エラー" });
        return Promise.reject(new Error("認証エラーです。"));
      }
      // 権限エラー
      case 403:
        // return Promise.reject({ level: "error", message: "権限エラー" });
        return Promise.reject(new Error("権限エラーです。"));
      // その他のエラー
      default:
        return Promise.reject(new Error("想定外のエラーが発生しました。"));
    }
  }
);

export default api;

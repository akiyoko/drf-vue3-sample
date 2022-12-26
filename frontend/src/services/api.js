import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_ROOT_URL,
  timeout: import.meta.env.VITE_TIMEOUT_MS || 5000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 共通前処理
api.interceptors.request.use((config) => {
  // 認証用トークンがあればリクエストヘッダに加える
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = "JWT " + token;
  }
  return config;
});

// 共通後処理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // エラーの種類に応じたハンドリングをおこなう
    switch (error.response?.status) {
      // バリデーションNG
      case 400: {
        // オブジェクトのプロパティの値（メッセージの配列）をフラットな配列に変換
        const messages = Object.values(error.response.data).flat();
        return Promise.reject({ level: "warning", messages: messages });
      }
      // 認証エラー
      case 401: {
        const token = localStorage.getItem("access");
        if (token) {
          // 認証用トークンをlocalStorageから削除
          localStorage.removeItem("access");
          return Promise.reject(new Error("ログイン有効期限切れです。"));
        } else {
          return Promise.reject(new Error("認証エラーです。"));
        }
      }
      // 権限エラー
      case 403:
        return Promise.reject(new Error("権限エラーです。"));
      // その他のエラー
      default:
        return Promise.reject(new Error("想定外のエラーが発生しました。"));
    }
  }
);

export default api;

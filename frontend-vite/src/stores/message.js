import { defineStore } from "pinia";

export const useMessageStore = defineStore({
  id: "message",
  state: () => ({
    // メッセージレベル
    level: null,
    // メッセージ（複数表示できるように管理）
    messages: [],
  }),
  actions: {
    /**
     * エラーオブジェクトからメッセージ表示
     */
    showMessage(error) {
      this.level = error.level || "error";
      this.messages = error.messages || [error.message];
    },
    /**
     * エラーメッセージ表示
     */
    showErrorMessage(message) {
      this.level = "error";
      this.messages = [message];
    },
    /**
     * 警告メッセージ（複数）表示
     */
    showWarningMessages(messages) {
      this.level = "warning";
      this.messages = messages;
    },
    /**
     * インフォメーションメッセージ表示
     */
    showInfoMessage(message) {
      this.level = "info";
      this.messages = [message];
    },
    /**
     * 全メッセージ非表示
     */
    clear() {
      this.level = null;
      this.messages = [];
    },
  },
});

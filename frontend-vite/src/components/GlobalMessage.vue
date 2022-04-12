<template>
  <!-- メッセージエリア -->
  <div id="messages">
    <div variant="danger" v-show="isError" show class="mb-0">
      <span class="error">{{ messages[0] }}</span>
    </div>
    <div variant="warning" v-show="isWarning" show class="mb-0">
      <p v-for="message in messages" :key="message" class="mb-0">
        <span>{{ message }}</span>
      </p>
    </div>
    <div variant="info" v-show="isInfo" show class="mb-0">
      <span>{{ messages[0] }}</span>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useMessageStore } from "../stores/message.js";

export default {
  setup() {
    const messageStore = useMessageStore();

    // リアクティビティを損なわずに分割代入するにはstoreToRefs()を利用する
    const { messages, isError, isWarning, isInfo } = storeToRefs(messageStore);

    // テンプレートに公開
    return {
      messages,
      isError,
      isWarning,
      isInfo,
    };
  },
};
</script>

<style>
.error {
  color: red;
  font-weight: bold;
}
</style>

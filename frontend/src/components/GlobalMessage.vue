<template>
  <!-- メッセージ -->
  <v-container id="message">
    <v-alert type="error" density="comfortable" v-show="isError">
      {{ messages[0] }}
    </v-alert>
    <v-alert type="warning" density="comfortable" v-show="isWarning">
      <p v-for="message in messages" :key="message">
        {{ message }}
      </p>
    </v-alert>
    <v-alert type="info" density="comfortable" v-show="isInfo">
      {{ messages[0] }}
    </v-alert>
  </v-container>
</template>

<script>
import { storeToRefs } from "pinia";
import { useMessageStore } from "../stores/message.js";

export default {
  setup() {
    // ストアオブジェクトを取得
    const messageStore = useMessageStore();
    // リアクティビティを損なわずに分割代入するにはstoreToRefs関数を利用する
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

<style scoped>
#message {
  min-height: 110px;
}
</style>

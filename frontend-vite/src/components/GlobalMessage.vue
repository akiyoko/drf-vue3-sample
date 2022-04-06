<template>
  <!-- メッセージエリア -->
  <div id="messages">
    <div variant="danger" v-show="level === 'error'" show class="mb-0">
      {{ messages[0] }}
    </div>
    <div variant="warning" v-show="level === 'warning'" show class="mb-0">
      <p v-for="message in messages" :key="message" class="mb-0">
        {{ message }}
      </p>
    </div>
    <div variant="info" v-show="level === 'info'" show class="mb-0">
      {{ messages[0] }}
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useMessageStore } from "@/stores/message.js";

export default {
  setup() {
    const messageStore = useMessageStore();

    const { level, messages } = storeToRefs(messageStore);

    // テンプレートに公開
    return {
      level,
      messages,
    };
  },
};
</script>

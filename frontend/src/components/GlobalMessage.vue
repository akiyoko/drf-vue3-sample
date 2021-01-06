<template>
  <!-- メッセージエリア -->
  <div id="messages">
    <b-alert variant="danger" v-show="message.error" show class="mb-0">
      {{ message.error }}
    </b-alert>
    <b-alert
      variant="warning"
      v-show="message.warnings.length > 0"
      show
      class="mb-0"
    >
      <p v-for="warning in message.warnings" :key="warning" class="mb-0">
        {{ warning }}
      </p>
    </b-alert>
    <b-alert variant="info" v-show="message.info" show class="mb-0">
      {{ message.info }}
    </b-alert>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const message = computed(() => {
      return store.state.message;
    });
    return {
      message
    };
  }
};
</script>

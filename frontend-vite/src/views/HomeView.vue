<template>
  <main id="home-view">
    <GlobalHeader />
    <GlobalMessage />

    <h1>ホーム</h1>
    <form @submit.prevent="submitSave">
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">タイトル</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="data.book.title" />
        </div>
      </div>
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">価格</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="data.book.price" />
        </div>
      </div>
      <div class="row text-center mt-5">
        <div class="col-sm-12">
          <button type="submit" variant="primary">
            {{ isCreated ? "更新" : "登録" }}
          </button>
        </div>
      </div>
    </form>
  </main>

  <pre>data: {{ data }}</pre>
  <pre>authStore: {{ authStore }}</pre>
  <pre>messageStore: {{ messageStore }}</pre>
</template>

<script>
import { computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.js";
import { useMessageStore } from "@/stores/message.js";
import api from "@/services/api";
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalMessage from "@/components/GlobalMessage.vue";

export default {
  components: {
    GlobalHeader,
    GlobalMessage,
  },

  setup() {
    const authStore = useAuthStore();
    const messageStore = useMessageStore();

    // 入力フォームの内容をリアクティブにする
    const data = reactive({
      book: {
        title: "",
        price: 0,
      },
    });

    // 本が登録済みかどうか
    const isCreated = computed(() => {
      return data.book.id !== undefined;
    });

    // 登録・更新ボタン押下
    const submitSave = () => {
      // 本の登録・更新を実行
      api({
        // 登録済みかどうかでHTTPメソッドとエンドポイントを切り替える
        method: isCreated.value ? "put" : "post",
        url: isCreated.value ? "/books/" + data.book.id + "/" : "/books/",
        data: {
          id: data.book.id,
          title: data.book.title,
          price: data.book.price,
        },
      })
        .then((response) => {
          const message = isCreated.value ? "更新しました。" : "登録しました。";
          messageStore.showInfoMessage(message);
          data.book = response.data;
        })
        .catch((error) => {
          // TODO
          console.log("error=", error);
          messageStore.showMessage(error);
        });
    };

    // テンプレートに公開
    return {
      data,
      isCreated,
      submitSave,
      authStore: storeToRefs(authStore),
      messageStore: storeToRefs(messageStore),
    };
  },
};
</script>

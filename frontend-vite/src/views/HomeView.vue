<template>
  <main>
    <GlobalHeader />
    <GlobalMessage />

    <h1>ホーム</h1>
    <form @submit.prevent="submitSave">
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">タイトル</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="bookTitle" />
        </div>
      </div>
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">価格</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="bookPrice" />
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

    <!-- デバッグエリア -->
    <pre>bookTitle: {{ bookTitle }}</pre>
    <pre>bookPrice: {{ bookPrice }}</pre>
    <pre>bookId: {{ bookId }}</pre>
    <pre>isCreated: {{ isCreated }}</pre>
    <pre>authStore: {{ authStore }}</pre>
    <pre>messageStore: {{ messageStore }}</pre>
  </main>
</template>

<script>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth.js";
import { useMessageStore } from "../stores/message.js";
import api from "../services/api";
import GlobalHeader from "../components/GlobalHeader.vue";
import GlobalMessage from "../components/GlobalMessage.vue";

export default {
  name: "HomeView",
  components: {
    GlobalHeader,
    GlobalMessage,
  },

  setup() {
    const authStore = useAuthStore();
    const messageStore = useMessageStore();

    // 入力フォームの内容をリアクティブにする
    // タイトル
    const bookTitle = ref("");
    // 価格
    const bookPrice = ref(0);
    // 更新時に利用する本のID（デフォルト値はundefined）
    const bookId = ref();

    // 本が登録済みかどうか
    const isCreated = computed(() => {
      return bookId.value !== undefined;
    });

    /**
     * 登録・更新ボタン押下
     */
    const submitSave = () => {
      // メッセージをクリア
      messageStore.clear();
      // 本の登録・更新を実行
      api({
        // 登録済みかどうかでHTTPメソッドとエンドポイントを切り替える
        method: isCreated.value ? "put" : "post",
        url: isCreated.value ? "/books/" + bookId.value + "/" : "/books/",
        data: {
          id: bookId.value,
          title: bookTitle.value,
          price: bookPrice.value,
        },
      })
        .then((response) => {
          // レスポンスのデータでリアクティブなデータを更新する
          bookId.value = response.data.id;
          // インフォメーションメッセージを表示
          messageStore.setInfoMessage(
            isCreated.value ? "更新しました。" : "登録しました。"
          );
        })
        .catch((error) => {
          // エラー発生時はエラーメッセージを表示
          messageStore.setError(error);
        });
    };

    // テンプレートに公開
    return {
      bookTitle,
      bookPrice,
      isCreated,
      submitSave,
      // デバッグ用
      bookId,
      authStore: storeToRefs(authStore),
      messageStore: storeToRefs(messageStore),
    };
  },
};
</script>

<template>
  <main>
    <GlobalHeader />
    <GlobalMessage />

    <h1>ホーム</h1>
    <form @submit.prevent="submitSave">
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">タイトル</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="bookForm.title" />
        </div>
      </div>
      <div class="row form-group">
        <label class="col-sm-3 col-form-label">価格</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="bookForm.price" />
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
    <pre>bookForm: {{ bookForm }}</pre>
    <pre>authStore: {{ authStore }}</pre>
    <pre>messageStore: {{ messageStore }}</pre>
  </main>
</template>

<script>
import { computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth.js";
import { useMessageStore } from "../stores/message.js";
import api from "../services/api";
import GlobalHeader from "../components/GlobalHeader.vue";
import GlobalMessage from "../components/GlobalMessage.vue";

export default {
  components: {
    GlobalHeader,
    GlobalMessage,
  },

  setup() {
    const authStore = useAuthStore();
    const messageStore = useMessageStore();

    // 入力フォームの内容をリアクティブにする
    const bookForm = reactive({
      // タイトル
      title: "",
      // 価格
      price: 0,
    });

    // 本が登録済みかどうか
    const isCreated = computed(() => {
      return bookForm.id !== undefined;
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
        url: isCreated.value ? "/books/" + bookForm.id + "/" : "/books/",
        data: {
          id: bookForm.id,
          title: bookForm.title,
          price: bookForm.price,
        },
      })
        .then((response) => {
          // レスポンスのデータでリアクティブなデータを書き換える
          // Object.assign(bookForm, response.data)
          bookForm.id = response.data.id;
          // インフォメーションメッセージを表示
          messageStore.showInfoMessage(
            isCreated.value ? "更新しました。" : "登録しました。"
          );
        })
        .catch((error) => {
          // エラー発生時はエラーメッセージを表示
          messageStore.showMessage(error);
        });
    };

    // テンプレートに公開
    return {
      bookForm,
      isCreated,
      submitSave,
      // デバッグ用
      authStore: storeToRefs(authStore),
      messageStore: storeToRefs(messageStore),
    };
  },
};
</script>

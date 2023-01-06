<template>
  <v-app>
    <GlobalHeader />

    <v-main>
      <GlobalMessage />

      <!-- 入力フォーム -->
      <v-container id="form">
        <v-card class="mx-auto pa-8" elevation="4" width="600">
          <v-card-title class="mb-8">ホーム</v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field v-model="bookTitle" label="タイトル"></v-text-field>
              <v-text-field v-model="bookPrice" label="価格"></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn
              variant="elevated"
              color="success"
              class="mx-auto"
              @click="submitSave"
            >
              {{ isCreated ? "更新" : "登録" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <!-- デバッグ -->
      <v-container id="debug">
        <pre>
bookTitle: {{ bookTitle }}
bookPrice: {{ bookPrice }}
bookId: {{ bookId }}
isCreated: {{ isCreated }}
authStore: {{ authStore }}
messageStore: {{ messageStore }}
        </pre>
      </v-container>
    </v-main>
  </v-app>
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
    // ストアオブジェクトを取得
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
          // インフォメーションメッセージを表示
          messageStore.setInfoMessage(
            isCreated.value ? "更新しました。" : "登録しました。"
          );
          // レスポンスのデータでリアクティブなデータを更新する
          bookId.value = response.data.id;
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

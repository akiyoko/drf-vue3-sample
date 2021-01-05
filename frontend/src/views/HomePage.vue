<template>
  <div id="home-page">
    <GlobalHeader />
    <GlobalMessage />

    <!-- メインエリア -->
    <main class="container">
      <p class="h5 mb-4">ホーム</p>
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
  </div>

  <pre>data: {{ data }}</pre>
  <pre>state: {{ this.$store.state }}</pre>
</template>

<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import api from "@/services/api";
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalMessage from "@/components/GlobalMessage.vue";

export default {
  components: {
    GlobalHeader,
    GlobalMessage
  },

  setup() {
    const store = useStore();

    // data
    // 入力フォームの内容をリアクティブにする
    const data = reactive({
      book: {
        title: "",
        price: 0
      }
    });

    // computed
    // 本が登録済みかどうか
    const isCreated = computed(() => {
      return data.book.id !== undefined;
    });

    // methods
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
          price: data.book.price
        }
      }).then(response => {
        const message = isCreated.value ? "更新しました。" : "登録しました。";
        store.dispatch("message/setInfoMessage", { message: message });
        data.book = response.data;
      });
    };

    return {
      data,
      isCreated,
      submitSave
    };
  }
};
</script>

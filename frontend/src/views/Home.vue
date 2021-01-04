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
            <input type="text" class="form-control" v-model="form.book.title" />
          </div>
        </div>
        <div class="row form-group">
          <label class="col-sm-3 col-form-label">価格</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="form.book.price" />
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

  <pre>form: {{ form }}</pre>
  <pre>message: {{ message }}</pre>
  <pre>{{ this.$store.getters["auth/username"] }}</pre>
</template>

<script>
import { reactive, computed } from "vue";
import store from "@/store";
import api from "@/services/api";
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalMessage from "@/components/GlobalMessage.vue";

export default {
  components: {
    GlobalHeader,
    GlobalMessage
  },

  setup() {
    // data
    const form = reactive({
      book: {
        title: "",
        price: 0
      }
    });

    // computed
    const isCreated = computed(() => {
      return form.book.id !== undefined;
    });

    // methods
    // 登録・更新ボタン押下
    const submitSave = () => {
      api({
        // 登録済みかどうかでHTTPメソッドとエンドポイントを切り替える
        method: isCreated.value ? "put" : "post",
        url: isCreated.value ? "/books/" + form.book.id + "/" : "/books/",
        data: {
          id: form.book.id,
          title: form.book.title,
          price: form.book.price
        }
      }).then(response => {
        const message = isCreated.value ? "更新しました。" : "登録しました。";
        store.dispatch("message/setInfoMessage", { message: message });
        form.book = response.data;
      });
    };

    return {
      form,
      isCreated,
      submitSave
    };
  }
};
</script>

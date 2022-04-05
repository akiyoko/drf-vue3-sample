import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

// // TODO
// import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";
// const vuetify = createVuetify({
//   components,
//   directives,
// });

createApp(App).use(router).use(store).use(vuetify).mount("#app");

// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";
// // TODO: See https://next.vuetifyjs.com/en/getting-started/installation/#usage
// import "vuetify/styles"; // Global CSS has to be imported
// import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";
//
// const app = createApp(App);
// app.use(router).use(store);
//
// // Vuetify
// const vuetify = createVuetify({
//   components,
//   directives,
// });
// app.use(vuetify);
//
// app.mount("#app");

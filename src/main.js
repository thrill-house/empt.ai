import { createApp } from "vue";
// import VueBem from "@verstaerker/vue-bem";

import App from "./App.vue";
import store from "./store";
import i18n from "./i18n";
import uid from "./mixins/uid";
import format from "./directives/format";
import "./styles/default.scss";

const app = createApp(App);

app.use(store);
app.use(i18n);

app.mixin(uid);
app.directive("format", format);

app.mount("#app");

import { createApp } from "vue";

import App from "./App.vue";
import store from "./store";
import i18n from "./i18n";
import uid from "./mixins/uid";
import bem from "./directives/bem";
import format from "./directives/format";

import "./styles/default.scss";

const app = createApp(App);

// Install plugins
app.use(store);
app.use(i18n);

// Add global mixins
app.mixin(uid);

// Add custom directives
app.directive("bem", bem);
app.directive("format", format);

// Mount up
app.mount("#app");

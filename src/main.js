import Vue from "vue";
import App from "./app";
import filters from "./filters";
import i18n from "./i18n";

new Vue({
  el: "#app",
  render: h => h(App),
  i18n
});

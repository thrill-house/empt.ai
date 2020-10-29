import { createApp } from "vue";
// import VueLocalStorage from "vue-localstorage";

import { createI18n } from "vue-i18n";
import _ from "lodash-es";
// import VueBem from "@verstaerker/vue-bem";
import { chain } from "mathjs";
import dayjs from "dayjs";
import numeral from "numeral";

import messages from "./i18n";
import App from "./App.vue";
import VuexStore from "./store";
import "./styles/default.scss";

const app = createApp(App);

app.use(VuexStore);

// app.use(VueBem, {
//   blockSource: "blockName",
// });

// app.use(VueLocalStorage, {
//   bind: true,
// });

const i18n = createI18n({
  legacy: false,
  locale: "en",
  silentTranslationWarn: true,
  messages,
});

app.use(i18n);

app.config.globalProperties.$filters = {
  duration: (str) => dayjs().subtract(str / 1000, "seconds"),
  // .fromNow(true),

  percentage: (str) =>
    str
      ? chain(str)
          .subtract(1)
          .multiply(100)
          .format(4).value + "%"
      : 0,

  data: (str) =>
    numeral(str)
      .multiply(1000)
      .format("0.00b"),

  bandwidth: (str) => app.config.globalProperties.$filters.data(str) + "/s",

  confidence: (str) => numeral(str).format("0.[00]a") + "❤",

  influence: (str) =>
    numeral(str)
      .multiply(1000)
      .format("0.[00]a") + "★/s",

  science: (str) => app.config.globalProperties.$filters.percentage(str),

  economy: (str) => app.config.globalProperties.$filters.percentage(str),

  society: (str) => app.config.globalProperties.$filters.percentage(str),

  neutral: (str) => app.config.globalProperties.$filters.percentage(str),
};

app.mixin({
  props: {
    uid: {
      type: String,
      default: () => `uid-${_.uniqueId()}`,
    },
  },
});

app.mount("#app");

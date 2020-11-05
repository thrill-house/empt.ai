import { createI18n } from "vue-i18n";
import en from "./lang/en";

export default createI18n({
  legacy: false,
  locale: "en",
  silentTranslationWarn: true,
  messages: { en },
});

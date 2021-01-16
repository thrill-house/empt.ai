import { createI18n } from "vue-i18n";
import en from "./locales/en";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  silentTranslationWarn: true,
  formatFallbackMessages: true,
  messages: { en },
});

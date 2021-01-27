import { createI18n } from "vue-i18n";
import en from "./locales/en";
import de from "./locales/de-DE";

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  formatFallbackMessages: true,
  silentTranslationWarn: true,
  messages: { en, de },
});

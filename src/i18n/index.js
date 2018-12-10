import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './messages';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'en',
  silentTranslationWarn: true,
  missing: (locale, key, vm) => {
    console.log(key + ': "",');
  },
  messages,
});

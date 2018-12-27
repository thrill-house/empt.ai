import abilities from './modules/abilities';
import eras from './modules/eras';
import options from './modules/options';
import scores from './modules/scores';
import session from './modules/session';
import sockets from './modules/sockets';
import time from './modules/time';
import Vue from 'vue';
import vueBem from '@verstaerker/vue-bem';
import VueLocalStorage from 'vue-localstorage';
import Vuex from 'vuex';

Vue.use(Vuex);

Vue.use(vueBem, {
  blockSource: 'blockName',
});

Vue.use(VueLocalStorage, {
  bind: true,
});

Vue.mixin({
  props: {
    uid: {
      type: String,
      default() {
        return `uid-${this._uid}`;
      },
    },
  },
});

export default new Vuex.Store({
  modules: {
    abilities,
    eras,
    options,
    scores,
    session,
    sockets,
    time,
  },
});

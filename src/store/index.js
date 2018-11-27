import Vue from "vue";
import Vuex from "vuex";
import session from "./modules/session";
import scores from "./modules/scores";
import options from "./modules/options";
import eras from "./modules/eras";
import sockets from "./modules/sockets";
import slots from "./modules/slots";
import abilities from "./modules/abilities";

Vue.use(Vuex);

Vue.mixin({
  props: {
    uid: {
      type: String,
      default: function() {
        return "uid-" + this._uid;
      }
    }
  }
});

export default new Vuex.Store({
  modules: {
    session,
    scores,
    options,
    eras,
    sockets,
    slots,
    abilities
  }
});

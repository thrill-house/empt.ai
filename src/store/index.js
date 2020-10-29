import abilities from "./modules/abilities";
import eras from "./modules/eras";
import options from "./modules/options";
import scores from "./modules/scores";
import session from "./modules/session";
import sockets from "./modules/sockets";
import time from "./modules/time";
import Vuex from "vuex";

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

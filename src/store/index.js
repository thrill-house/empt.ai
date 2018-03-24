import Vue from 'vue'
import Vuex from 'vuex'
import session from './modules/session'
import scores from './modules/scores'
import options from './modules/options'
import eras from './modules/eras'
import sockets from './modules/sockets'
import slots from './modules/slots'
import abilities from './modules/abilities'

Vue.use(Vuex);

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
})
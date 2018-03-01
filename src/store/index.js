import Vue from 'vue'
import Vuex from 'vuex'
import gameSession from './modules/game-session'
import factors from './modules/factors'
import scores from './modules/scores'
import options from './modules/options'
import eras from './modules/eras'
import dataSockets from './modules/data-sockets'
import abilities from './modules/abilities'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
    gameSession,
    factors,
    scores,
    options,
    eras,
    dataSockets,
    abilities
  }
})
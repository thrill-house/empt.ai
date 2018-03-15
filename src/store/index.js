import Vue from 'vue'
import Vuex from 'vuex'
import gameSession from './modules/game-session'
import scores from './modules/scores'
import options from './modules/options'
import eras from './modules/eras'
import dataSockets from './modules/data-sockets'
import abilities from './modules/abilities'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
    gameSession,
    scores,
    options,
    eras,
    dataSockets,
    abilities
  }
})
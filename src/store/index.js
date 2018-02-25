import Vue from 'vue'
import Vuex from 'vuex'
import gameSession from './modules/game-session'
import options from './modules/options'
import eras from './modules/eras'
import dataSources from './modules/data-sources'
import abilities from './modules/abilities'
import events from './modules/events'
import factors from './modules/factors'
import scores from './modules/scores'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
    gameSession,
    options,
    eras,
    dataSources,
    abilities,
    events,
    factors,
    scores,
  }
})
import Vue from 'vue'
import Vuex from 'vuex'
import options from './modules/options'
import dataSources from './modules/data-sources'
import abilities from './modules/abilities'
import events from './modules/events'

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
    options,
    dataSources,
    abilities,
    events
  }
})
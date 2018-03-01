<docs>
---
### Game time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<game-time></game-time>`
---
</docs>

<template>
  <div id="game-time">
	  <h5>Elapsed: <output>{{ elapsed|duration }}</output></h5>
  </div>
</template>

<script>
	import moment from 'moment'
	import math from 'mathjs'
	import { mapState, mapGetters, mapMutations } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-time',
	  store,
	  filters: {
		  duration: function (value) {
			  return math.unit(_.round(value / 1000), 's').splitUnit(['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toString();
			},
	  },
	  computed: {
		  elapsed: function() {
			  return this.now - this.start;
		  },
		  ...mapState({
			  start: state => state.gameSession.start,
			  now: state => state.gameSession.now
			})
		},
		methods: mapMutations(['setStart', 'setNow'])
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-time {
	}
</style>

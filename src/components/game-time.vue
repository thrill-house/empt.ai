<docs>
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
	import { mapState, mapGetters, mapMutations } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-time',
	  store,
	  computed: {
		  elapsed: function() {
			  return this.now - this.start;
		  },
		  ...mapState({
			  start: state => state.session.start,
			  now: state => state.session.now
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

<docs>
### Game events

The component lists all events associated with the game that are stored in the global data store. This is a helper component that won't be used as an interface element.

</docs>

<template>
  <div id="game-events">
    <div class="events" v-for="(event, index) in events">
	    {{ event }}
    </div>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-events',
	  store,
	  computed: mapState(['events']),
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-events {
	}
</style>

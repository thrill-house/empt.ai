<docs>
### Game events

The component lists all events associated with the game that are stored in the global data store. This is a helper component that won't be used as an interface element.
</docs>

<template>
  <div id="game-events">
    <div class="event" v-for="(event, index) in gameSession.events" v-if="index < gameSession.now">
	    <output>{{ index }}</output>
	    <pre>{{ event }}</pre>
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
	  computed: mapState(['gameSession'])
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-events {
		.event {
			display: grid;
			width: 50%;
			padding: 1rem 0;
			grid-template-columns: 1fr 1fr;
			grid-gap: 2rem;
			align-items: start;
			
			& + .event {
				border-top: 1px solid $sky;
			}
		}
	}
</style>

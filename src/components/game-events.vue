<docs>
### Game events
The component lists all events associated with the game that are stored in the global data store. This is a helper component used for testing and balancing that won't be used as an interface element in the game.

##### Instantiation
`<game-events></game-events>`

---
</docs>

<template>
  <div id="game-events">
    <div v-if="events">
	    <div class="event" v-for="(event) in events" v-if="event.timestamp < now">
		    <pre>{{ event }}</pre>
	    </div>
	    <div v-else>Not a valid event</div>
    </div>
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import _ from 'lodash'
	import store from '../store'
	
	export default {
	  name: 'game-events',
	  store,
	  computed: {
		  start: function() {
			  return this.gameSession.start;
		  },
		  now: function() {
			  return this.gameSession.now;
		  },
		  events: function() {
			  return this.getEvents();
		  },
		  ...mapState(['gameSession']),
		  ...mapGetters(['getEvents'])
		}
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#game-events {
		max-height: 500px;
		overflow: auto;
		
		.event {
			padding: 1rem 0;
			
			& + .event {
				border-top: 1px solid $sky;
			}
		}
	}
</style>

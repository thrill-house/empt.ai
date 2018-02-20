<documentation>
	The ability socket is a space attached to 0 or 1 data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.
	
	Properties
	model: An ability socket model, that may or may not have abilities assigned to it.
</documentation>

<template>
  <div id="ability-socket">
	  <div v-if="!event">
		  --- no ability ---
	  </div>
	  <enabled-ability v-if="event"
	    :model="ability">
	  </enabled-ability>
  </div>
</template>

<script>
	import { mapState } from 'vuex'
	import EnabledAbility from './enabled-ability.vue'
	import store from '../store'
		
	export default {
	  name: 'ability-socket',
	  store,
	  components: {
	    EnabledAbility
	  },
	  props: {
	    model: Object
	  },
	  computed: {
		  ability: function() {
		    return this.event? _.find(this.abilities, { id: this.event.abilitiesId }): {};
	    },
	  	event: function() {
		    return _.find(this.events, { type: 'abilities', dataSourcesSlotId: this.model.id, active: true });
	    },
		  ...mapState(['abilities', 'events']),
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#ability-socket {
	  background: $socket;
	}
</style>

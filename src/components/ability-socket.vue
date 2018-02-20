<documentation>
	The ability socket is a space attached to 0 or 1 data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.
	
	Properties
	model: An ability socket model, that may or may not have abilities assigned to it.
</documentation>

<template id="ability-socket">
  <enabled-ability
    :model="ability">
  </enabled-ability>
</template>

<script>
	import app from '../app.vue'
	import EnabledAbility from './enabled-ability.vue'
		
	export default {
	  name: 'ability-socket',
	  components: {
	    EnabledAbility
	  },
	  props: {
	    model: Object
	  },
	  computed: {
		  ability: function() {
		    return this.event? _.find(app.abilities, { id: this.event.abilitiesId }): {};
	    },
	  	event: function() {
		  	console.log(app.abilities);
		    return _.find(app.events, { type: 'abilities', dataSourcesSlotId: this.model.id, active: true });
	    },
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#ability-socket {
	  background: $socket;
	}
</style>

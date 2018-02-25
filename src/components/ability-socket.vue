<docs>
### Ability socket

The ability socket is a space attached to 0 or 1 data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Attributes

- `label` — An ability socket model, that may or may not have abilities assigned to it
</docs>

<template>
  <div id="ability-socket">
	  <enabled-ability v-if="event"
	    :label="abilityLabel">
	  </enabled-ability>
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	import EnabledAbility from './enabled-ability.vue'
		
	export default {
	  name: 'ability-socket',
	  store,
	  components: {
	    EnabledAbility
	  },
	  props: {
	    label: String
	  },
	  computed: {
		  event: function() {
		    return _.find(this.getEvents('data-source'), { dataSourceSlot: this.label });
	    },
		  abilityLabel: function() {
		    return this.event? this.event.ability: '';
	    },
		  ...mapGetters(['getEvents'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#ability-socket {
	  background: $socket;
	}
</style>

<docs>
### Ability slot
The ability slot is a space attached to a data sources. When an ability is assigned to the socket, it's multipliers will be included in the score calculation.

##### Properties
- `label` — An ability slot label, which by definition is connected to a data socket in the global store. The slot may also have abilities assigned to it by virtue of a matching event.

##### Instantiation
`<ability-slot label="data-socket-slot-label"></ability-slot>`

---
</docs>

<template>
  <div id="ability-socket">
	  <enabled-ability v-if="event" :label="abilityLabel"></enabled-ability>
	  <div v-else>No ability assigned.</div>
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	import EnabledAbility from './8-enabled-ability.vue'
		
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
		    return _.find(this.getEvents(), { type: 'ability', dataSocketSlot: this.label });
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
	  position: relative;
	  width: 215px; 
	  height: 240px;
	  padding: 60px 10px;
	  background: $peach;
	  box-shadow: inset 0 0 20px rgba($orange, 0.6);
	  color: $light;
	  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
	}
</style>

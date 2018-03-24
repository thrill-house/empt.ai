<docs>
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="data-socket-slot-label"></enabled-ability>`

---
</docs>

<template>
  <div v-if="event" class="ability enabled">
    {{ ability.name }}
    <em v-if="ability.type">— {{ ability.type }}</em>
    <div class="adders">
	    <output v-for="(value, factor) in factors">
		    +{{ prettyUnit(value, factor) }}
	    </output>
    </div>
  </div>
  <div v-else class="ability disabled">
    No valid event for "{{ instance }}".
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    instance: String,
	  },
	  store,
	  computed: {
		  ability: function() {
		    return this.getAbility(this.event.label);
	    },
	    factors: function() {
		    return _.merge({}, this.ability.adders, this.ability.multipliers);
	    },
	  	event: function() {
		    return this.getEventOfType(this.instance, 'ability', 'instance');
	    },
		  ...mapGetters(['getEventOfType', 'getAbility', 'prettyUnit'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	.ability {
	  position: relative;
		text-align: center;
	  width: 162px; 
	  height: 187px;
	  padding: 60px 10px;
	  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
	  
	  &.enabled {
		  background: radial-gradient($peach, $orange);
		  color: $light;
		}
		
		&.disabled {
		  background: radial-gradient($sky, $light);
		  color: $dark;
		}
	}
</style>

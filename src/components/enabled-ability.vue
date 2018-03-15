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
  <div class="ability enabled" v-if="event">
    {{ ability.name }}
    <em v-if="ability.type">— {{ ability.type }}</em>
    <div class="adders">
	    <template v-for="(value, adder) in ability.adders">
		    {{ adder }}: <strong>{{ value }}</strong>
	    </template>
    </div>
  </div>
  <div class="ability disabled" v-else>
    No valid event for "{{ label }}".
  </div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import store from '../store'
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    label: String
	  },
	  store,
	  computed: {
		  ability: function() {
		    return this.getAbility(this.label);
	    },
	  	event: function() {
		    return this.getEventOfType(this.label, 'ability');
	    },
		  ...mapGetters(['getEventOfType', 'getAbility'])
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
		  background: radial-gradient($sky, $purple);
		  color: $light;
		}
		
		&.disabled {
		  background: radial-gradient($sky, $light);
		  color: $dark;
		}
	}
</style>

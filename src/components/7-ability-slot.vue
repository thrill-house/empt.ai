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
	  <div class="ability-socket">
		  <enabled-ability v-if="event" :label="abilityLabel"></enabled-ability>
		  <div v-else>No ability assigned.</div>
	  </div>
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
	  height: 124.13px;
	  background-color: $peach;
	  color: $light;
	  margin: 62.07px 0;
	  box-sizing: content-box;
	  border-left: solid 2px #333333;
	  border-right: solid 2px #333333;
		
		&:before, &:after {
		  content: "";
		  position: absolute;
		  z-index: 1;
		  width: 152.03px;
		  height: 152.03px;
		  transform: scaleY(0.5774) rotate(-45deg);
		  background-color: inherit;
		  left: 29.4860px;
		  box-sizing: content-box;
		}
		
		&:before {
		  top: -76.0140px;
		  border-top: solid 2.8284px #333333;
		  border-right: solid 2.8284px #333333;
		}
		
		&:after {
		  bottom: -76.0140px;
		  border-bottom: solid 2.8284px #333333;
		  border-left: solid 2.8284px #333333;
		}
		
		.ability-socket {
		  display: block;
		  position: absolute;
		  top: 0;
		  left: 0;
		  width:215px;
		  height:124.1303px;
		  z-index: 2;
		  //background: inherit;
		}
	}
</style>

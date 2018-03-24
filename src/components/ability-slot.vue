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
  <enabled-ability v-if="event" :instance="abilityInstance"></enabled-ability>
  <div v-else class="ability-slot">
	  <select v-if="!selectedLabel" v-model="selectedLabel">
			<option disabled value="">Choose</option>
		  <option v-for="abilityEvent in abilityEvents" :value="abilityEvent.instance">
		  	{{ abilityEvent.instance }}
		  </option>
		</select>
  </div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import EnabledAbility from './enabled-ability.vue'
		
	export default {
	  name: 'ability-slot',
	  store,
	  components: {
	    EnabledAbility
	  },
	  props: {
	    label: String
	  },
	  data: function () {
		  return {
		    selectedLabel: ''
		  }
		},
	  computed: {
		  socket: function() {
			  return this.getSocketForSlot(this.label);
		  },
		  event: function() {
		    return this.getEventOfType(this.label, 'slot');
	    },
		  abilityInstance: function() {
		    return this.event? this.event.instance: '';
	    },
		  abilityEvents: function() {
		    return this.getAbilityEvents();
	    },
		  ...mapGetters(['getEventOfType', 'getAbilityEvents', 'getSocketForSlot'])
	  },
	  methods: mapActions(['addSlotEvent']),
	  watch: {
		  selectedLabel: function() {
			  var event = {
		      type: 'slot',
		      label: this.label,
		      instance: this.selectedLabel
		    };
		    
		    this.addSlotEvent(event);
		  }
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	.ability-slot {
	  position: relative;
		text-align: center;
	  width: 162px; 
	  height: 187px;
	  padding: 30px 10px;
	  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
		background: radial-gradient($light, $sky);
	  color: $dark;
	}
	.green {
		background: green;
	}
	.red {
		background: red;
	}
	.yellow {
		background: yellow;
	}
</style>

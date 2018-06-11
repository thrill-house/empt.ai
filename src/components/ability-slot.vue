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
  <div class="ability-slot">
	  <enabled-ability v-if="event && abilityInstance" :instance="abilityInstance"></enabled-ability>
	  <template v-else>
		  <select v-model="selectedAbility">
				<option disabled value="">Choose</option>
			  <option v-for="(ability, index) in abilities" :value="index">
			  	{{ ability.name }}
			  </option>
			</select>
		  <select v-if="selectedAbility" v-model="selectedInstance">
				<option disabled value="">Choose</option>
			  <option v-for="abilityEvent in abilityEvents" :value="abilityEvent.instance">
			  	{{ abilityEvent.instance }}
			  </option>
			</select>
	  </template>
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
		    selectedAbility: '',
		    selectedInstance: ''
		  }
		},
	  computed: {
		  socket: function() {
			  return this.getSocketForSlot(this.label);
		  },
		  event: function() {
			  var event = this.getEventOfType(this.label, 'slot');
		    return event && event.positive? event: false;
	    },
		  abilityInstance: function() {
		    if(this.event) {
			    var instance = this.getEventOfType(this.event.instance, 'slot', 'instance');
			    if(instance.timestamp <= this.event.timestamp) {
				    return this.event.instance;
			    }
		    }
		    
		    return '';
	    },
		  abilityEvents: function() {
		    return this.getAbilityEvents(this.selectedAbility);
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getEventOfType', 'getAbilityEvents', 'getSocketForSlot'])
	  },
	  methods: mapActions(['addSlotEvent']),
	  watch: {
		  selectedInstance: function(newInstance, oldInstance) {
			  if(newInstance !== '') {
				  this.addSlotEvent({
					  label: this.label,
					  ability: this.selectedAbility,
					  newInstance: newInstance,
					  oldInstance: oldInstance
					});
					
					this.selectedAbility = '';
					this.selectedInstance = '';
			  }
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
	  
	  .ability.enabled {
		  position: absolute;
		  top: 0;
		  left: 0;
		  z-index: -1;
	  }
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

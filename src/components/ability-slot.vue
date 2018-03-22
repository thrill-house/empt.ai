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
  <enabled-ability v-if="event" :label="abilityLabel"></enabled-ability>
  <div v-else class="ability-socket">
	  No ability assigned to this slot.
	  <select v-model="selectedLabel">
			<option disabled value="">Choose</option>
		  <option v-for="(ability, index) in abilities" :value="index">
		  	{{ ability.name }}
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
		  dataSocket: function() {
			  return this.getSocketForSlot(this.label);
		  },
		  event: function() {
		    return this.getEventOfType(this.label, 'ability', 'dataSocketSlot');
	    },
		  abilityLabel: function() {
		    return this.event? this.event.label: '';
	    },
		  ...mapState(['abilities']),
		  ...mapGetters(['getEventOfType', 'getSlots', 'getSocketForSlot'])
	  },
	  methods: {
		  ...mapActions(['addEvent', 'activateInitFactor'])
	  },
	  watch: {
		  selectedLabel: function(newLabel) {
	      var event = {
		      type: 'ability',
		      label: newLabel,
		      dataSocket: this.dataSocket.label,
		      dataSocketSlot: this.label
		    };
		    
		    if(this.addEvent(event)) {
				  this.activateInitFactor('influence');
			  }
	    }
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	.ability-socket {
	  position: relative;
		text-align: center;
	  width: 162px; 
	  height: 187px;
	  padding: 60px 10px;
	  -webkit-clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
		background: radial-gradient($light, $sky);
	  color: $dark;
	}
</style>

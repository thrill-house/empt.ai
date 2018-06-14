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
  <div v-if="event && slotEvent" class="ability enabled">
    <h4>{{ ability.name }} <output v-if="ability.type" :class="[treeMatch? 'text-purple': 'text-orange']" class="output bg-grey">{{ ability.type }}</output></h4>
    <emotion-diagram
		  :happiness="event.happiness"
		  :sadness="event.sadness"
		  :excitement="event.excitement"
		  :fear="event.fear"
		  :tenderness="event.tenderness"
		  :anger="event.anger"
		  class="w-16 mt-2"></emotion-diagram>
    <div class="mt-2">
	    <output class="output" v-for="(value, adder) in adders">
		    +{{ prettyUnit(value, adder) }}
	    </output>
	    <output class="output" v-for="(value, multiplier) in multipliers">
		    +{{ prettyUnit(value, multiplier) }}
	    </output>
    </div>
    <div class="mt-2">
	    <button class="button orange" @click="clearSlotEvent()">Unslot</button>
    </div>
  </div>
  <div v-else class="ability disabled">
    No valid event for "{{ instance }}".
  </div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex';
	import store from '../store';
	import EmotionDiagram from './emotion-diagram.vue';
	
	export default {
	  name: 'enabled-ability',
	  props: {
	    instance: String,
	  },
	  store,
	  components: {
	    EmotionDiagram
	  },
	  computed: {
		  ability: function() {
		    return this.getAbility(this.event.label);
	    },
	    adders: function() {
		    return this.ability.adders;
	    },
	    multipliers: function() {
		    return this.ability.multipliers;
	    },
	  	event: function() {
		    return this.getEventOfType(this.instance, 'ability', 'instance');
	    },
	  	slotEvent: function() {
		    return this.getEventOfType(this.instance, 'slot', 'instance');
	    },
	  	socket: function() {
		    return this.getSocketForSlot(this.slotEvent.label);
	    },
	    treeMatch: function() {
		    return this.ability.type === this.socket.type;
	    },
		  ...mapGetters(['getEventOfType', 'getAbility', 'getSocketForSlot', 'prettyUnit'])
	  },
	  methods: {
		  clearSlotEvent: function() {
			  this.addSlotEvent({
				  label: this.slotEvent.label,
				  ability: this.slotEvent.ability,
				  instance: ''
				});
		  },
		  ...mapActions(['addSlotEvent'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
</style>

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
  <div v-if="event && slotEvent">
    <header class="flex items-center mb-2">
	    <h5 class="mr-2">{{ ability.name }}</h5>
		  <output v-if="ability.type" :class="[!treeMatch? 'bg-sky': '']" class="output">{{ ability.type }}</output>
		  <output :class="[bonus != socket.type? 'bg-sky': '']" class="output" v-for="(value, bonus) in bonuses">
		    +{{ prettyUnit(value, bonus) }}
	    </output>
    </header>
    <div class="flex items-center align-center">
	    <div v-if="boosters" class="mr-2 outputs">
		    <output :class="[!getValidSlotEvents(booster).length? 'bg-sky': '']" class="output" v-for="(value, booster) in boosters">
			  	+{{ value|percentage }} with {{ getAbility(booster).name }}
		    </output>
	    </div>
	    <div>
		    <emotion-diagram
				  :happiness="event.happiness"
				  :sadness="event.sadness"
				  :excitement="event.excitement"
				  :fear="event.fear"
				  :tenderness="event.tenderness"
				  :anger="event.anger"
				  class="w-16 mt-2"></emotion-diagram>
				<div class="mt-2 outputs">
			    <output class="output" v-for="(value, adder) in adders">
				    +{{ prettyUnit(value, adder) }}
			    </output>
			    <output class="output" v-for="(value, multiplier) in multipliers">
				    ×{{ prettyUnit(value, multiplier) }}
			    </output>
		    </div>
	    </div>
	    <div v-if="boostedBy" class="ml-2 outputs">
		    <output :class="[!getValidSlotEvents(boosted).length? 'bg-sky': '']" class="output" v-for="(value, boosted) in boostedBy">
			  	{{ getAbility(boosted).name }} gains +{{ value|percentage }}
		    </output>
	    </div>
    </div>
    <div class="mt-2 text-center">
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
		  abilityLabel: function() {
		    return this.event.label;
	    },
	    ability: function() {
		    return this.getAbility(this.abilityLabel);
	    },
	    adders: function() {
		    return this.ability.adders;
	    },
	    multipliers: function() {
		    return this.ability.multipliers;
	    },
	    bonuses: function() {
		    return this.ability.bonuses;
	    },
	    boosters: function() {
		    return this.ability.boosters;
	    },
	    boostedBy: function() {
		    //var abilitySlotEvents = this.getValidAbilitySlotEvents(this.abilityLabel);
		    var boostedBy = _.pickBy(this.abilities, (value) => {
			    return _.includes(_.keys(value.boosters), this.abilityLabel);
			  });
			  
		    return _.mapValues(boostedBy, (value) => {
			    return value.boosters[this.abilityLabel];
			  });
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
	    ...mapState(['abilities']),
		  ...mapGetters(['getEventOfType', 'getEventObjects', 'getAbility', 'getValidSlotEvents', 'getSocketForSlot', 'prettyUnit'])
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

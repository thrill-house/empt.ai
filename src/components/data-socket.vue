<docs>
### Data socket
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<data-socket label="data-socket-label"></data-socket>`

---
</docs>

<template>
  <div class="data-socket flex items-start">
    <article>
	    <header class="flex items-center mb-2">
		    <h4 class="mr-2">{{ socket.name }}</h4>
		    <output class="output">{{ socket.type }}</output>
		    <output class="output bg-orange text-peach">{{ socket.era }}</output>
	    </header>
	    <div class="mb-2 body">
		    <template v-for="(value, factor) in factors" v-if="value.base">
			    <output :class="[{'bg-sky': !event}]" class="output">+{{ prettyUnit(value.base, factor) }}</output>
		    </template>
	    </div>
	    <button v-if="event" class="button orange">Mini game</button>
	    <button v-else @click="activate" :class="{'cursor-wait': (!affordable)}" class="button bg-peach text-light relative w-full" :disabled="!affordable">
				<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-orange rounded z-0"></span>
				<span class="relative z-10">
					<template v-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
					<template v-else>Activate</template>
				</span>
			</button>
    </article>
    <ability-slot
			v-if="event"
	    v-for="(slot, index) in slots"
	    :key="index"
	    :label="index"
	    :class="[slot.position, index]"
	    class="mx-2 p-2 bg-light">
	  </ability-slot>
  </div>
</template>

<script>
	import _ from 'lodash'
	import { mapState, mapGetters, mapActions } from 'vuex'
	import store from '../store'
	import AbilitySlot from './ability-slot.vue'
	
	export default {
	  name: 'data-socket',
	  store,
	  components: {
	    AbilitySlot
	  },
	  props: {
	    label: String
	  },
	  computed: {
	    socket: function() {
		    return this.getSocket(this.label);
	    },
	    slots: function() {
		    return this.getSlotsForSocket(this.label);
	    },
	    affordability: function() {
		    return _.clamp((this.scores.confidence / this.costs.confidence * 100), 0, 100);
	    },
	    affordable: function() {
		    return this.affordability === 100;
	    },
	    factors: function() {
		    return this.socket.factors;
	    },
	    costs: function() {
		    return this.getSocketCosts(this.newEvent);
	    },
	    scores: function() {
		    return this.getScores();
	    },
	  	event: function() {
		    return this.getEventOfType(this.label, 'socket');
	    },
	    newEvent: function() {
		    return {
		      type: 'socket',
		      label: this.label
		    };
	    },
		  ...mapGetters(['getScores', 'getEventOfType', 'getSocket', 'prettyUnit', 'getSocketCosts', 'getSlotsForSocket'])
	  },
	  methods: {
		  activate: function() {
	      this.addSocketEvent(this.newEvent);
	    },
	    ...mapActions(['addSocketEvent'])
	  }
	}
</script>

<style lang="scss">
	@import '../assets/scss/default';
	
	/*.data-socket {
		display: grid;
		grid-template-rows: repeat(6, 70px);
		grid-template-columns: repeat(6, 81px);
		grid-row-gap: -35px;
		grid-template-areas:
		". a a b b ."
		". a a b b ."
		"c c d d e e"
		"c c d d e e"
		". f f g g ."
		". f f g g .";
		margin-bottom: 47px;
		
	  .details {
		  grid-area: d;
		  width: 162px;
			height: 187px;
			padding: 2px 0 0 36px;
		  
		  .name, .multipliers, .actions {
			  width: 90px;
			  height: 90px;
			  padding: 20px 5px;
			  color: $light;
			  position: absolute;
			  text-align: center;
			  box-shadow: inset 0 0 20px rgba($purple, 0.6);
		  }
		  
		  .name {
			  background: darken($sky, 15%);
			  transform: rotate(-45deg) skew(15deg, 15deg);
		  }
		  
		  .multipliers {
			  text-transform: capitalize;
			  background: darken($sky, 10%);
			  transform: rotate(15deg) skew(15deg, 15deg) translate(-50%, 100%);
		  }
		  
		  .actions {
			  border: none;
			  border-radius: 0;
			  outline: none;
			  cursor: pointer;
			  background: darken($sky, 5%);
			  transform: rotate(-15deg) skew(-15deg, -15deg) translate(50%, 100%);
		  }
	  }
	  
	  &.enabled {
		  .details {
			  .name, .multipliers, .actions {
				  box-shadow: inset 0 0 20px rgba($orange, 0.6);
			  }
			  
			  .name {
				  background: lighten($orange, 15%);
			  }
			  
			  .multipliers {
				  background: lighten($orange, 10%);
			  }
			  
			  .actions {
				  background: lighten($orange, 5%);
			  }
		  }
	  }
	  
	  .top-left {
		  grid-area: a;
	  }
	  
	  .top-right {
		  grid-area: b;
	  }
	  
	  .left {
		  grid-area: c;
	  }
	  
	  .right {
		  grid-area: e;
	  }
	  
	  .bottom-left {
		  grid-area: f;
	  }
	  
	  .bottom-right {
		  grid-area: g;
	  }
	}*/
</style>

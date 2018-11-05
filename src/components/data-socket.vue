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
  <div class="data-socket-field">
    <div :class="'bg-' + socket.type" class="data-socket hexagon w-48 h-hex*48 text-center">
	    <header class="my-2">
		    <svg class="w-8 h-8 my-2"><use :xlink:href="'#' + socket.type"></use></svg>
		    <h4 class="mr-2">{{ socket.name }}</h4>
		    <output>{{ socket.era }}</output>
	    </header>
	    <div class="mb-2 body">
		    <template v-for="(value, factor) in factors" v-if="value.base">
			    <output>+{{ prettyUnit(value.base, factor) }}</output>
		    </template>
	    </div>
	    <button v-if="event" class="bg-light p-2 rounded">Mini game</button>
	    <button v-else @click="activate" :class="{'cursor-wait': (!affordable)}" class="bg-light relative p-2 rounded" :disabled="!affordable">
  			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-dark rounded z-0"></span>
  			<span class="relative z-10">
  				<template v-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
  				<template v-else>Activate</template>
  			</span>
  		</button>
    </div>
    <ability-slot
      v-if="event"
	    v-for="(slot, index) in slots"
	    :key="index"
	    :label="index"
	    :class="[slot.position, index]"
	    class="bg-grey w-48 h-hex*48">
    </ability-slot>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import store from "../store";
import svg from "../assets/img/svg";
import AbilitySlot from "./ability-slot.vue";

export default {
  name: "data-socket",
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
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
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
      return this.getEventOfType(this.label, "socket");
    },
    newEvent: function() {
      return {
        type: "socket",
        label: this.label
      };
    },
    ...mapGetters([
      "getScores",
      "getEventOfType",
      "getSocket",
      "prettyUnit",
      "getSocketCosts",
      "getSlotsForSocket"
    ])
  },
  methods: {
    activate: function() {
      this.addSocketEvent(this.newEvent);
    },
    ...mapActions(["addSocketEvent"])
  }
};
</script>

<style lang="scss">
.data-socket-field {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    ". a a b b ."
    ". a a b b ."
    "c c d d e e"
    "c c d d e e"
    ". f f g g ."
    ". f f g g .";

  .data-socket {
    grid-area: d;

    &:before {
      @apply bg-grey opacity-75;
      top: 2px;
      left: 2px;
      bottom: 2px;
      right: 2px;
    }
  }
}
</style>

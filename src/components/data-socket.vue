<docs>
### Data socket
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<data-socket label="data-socket-label"></data-socket>`
</docs>

<template>
  <div class="data-socket-field py-8">
    <div :class="'bg-' + socket.type" class="data-socket hexagon bg-tile-overlay w-48 h-hex*48 px-2 py-6 text-center flex flex-col justify-between items-center" @mouseover="showChallenge = true" @mouseout="showChallenge = false">
	    <header class="flex items-center justify-center text-center bg-grey-25 p-2 w-2/3 h-12 order-2">
		    <h4 class="title text-light text-sm uppercase">{{ socket.name }}</h4>
	    </header>
	    <div class="flex w-full h-12 flex-wrap justify-center items-center pl-3 order-2">
  	    <template v-if="event">
    		  <factor-value
  		    v-show="!showChallenge"
  		    v-for="(value, factor) in factors"
    	    :key="factor"
  		    :label="factor"
  		    :value="value.base"
  		    class="w-1/2"></factor-value>
  		    <button v-show="showChallenge" class="bg-blue-light text-xs text-light uppercase font-bold p-2 mr-3 button">Challenge</button>
  	    </template>
  	    <button v-else @click.once="activate" :class="{ 'cursor-wait bg-grey-50': (!affordable) }" class="relative text-xs text-light uppercase font-bold p-2 mr-3 button" :disabled="!affordable">
    			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-blue-light z-0"></span>
    			<span class="relative z-10">
    				<template v-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
    				<template v-else>Connect</template>
    			</span>
    		</button>
	    </div>
	    <icon :label="socket.type" :class="'text-' + socket.type" class="w-8 h-8 text-light mb-2 order-1"></icon>
	    <era-stage :label="socket.era" class="mt-1 order-4 w-2"></era-stage>
    </div>
    <ability-slot
      v-if="event"
	    v-for="(slot, index) in slots"
	    :key="index"
	    :label="index"
	    :class="[slot.position, index]">
    </ability-slot>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import store from "../store";
import Icon from "./icon.vue";
import EraStage from "./era-stage.vue";
import FactorValue from "./factor-value.vue";
import AbilitySlot from "./ability-slot.vue";

export default {
  name: "data-socket",
  store,
  components: {
    Icon,
    EraStage,
    FactorValue,
    AbilitySlot
  },
  props: {
    label: String
  },
  data: function() {
    return {
      showChallenge: false
    };
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
@import "../scss/$variables";

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
      top: 0.5rem;
      left: 0.5rem;
      bottom: 0.5rem;
      right: 0.5rem;
    }

    &:after {
      background-image: map-get($backgrounds, dots-h),
        map-get($backgrounds, dots-v);
      background-position: center center;
      background-size: 2px 2px;
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
}
</style>

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
    <div :class="'bg-' + socket.type" class="data-socket hexagon w-48 h-hex*48 p-3 text-center">
	    <header class="flex flex-col items-center py-2 text-center">
		    <svg class="icon w-8 h-8 my-2"><use :xlink:href="'#' + socket.type" :class="'fill-current text-' + socket.type"></use></svg>
		    <h4 class="title p-2 w-2/3 text-light text-sm uppercase">{{ socket.name }}</h4>
		    <!--output>{{ socket.era }}</output-->
	    </header>
	    <div v-if="event" class="py-2 body">
		    <template v-for="(value, factor) in factors" v-if="value.base">
			    <output class="inline-flex items-center mx-2 text-xs font-bold text-light">
			      <svg class="icon w-4 h-4 mr-1"><use :xlink:href="'#' + factor" :class="'fill-current text-' + factor"></use></svg>
			      {{ prettyUnit(value.base, factor) }}
          </output>
		    </template>
		    <div class="w-full mt-2">
  		    <button class="bg-blue-light text-xs text-light uppercase font-bold p-2 button">Challenge</button>
		    </div>
	    </div>
	    <div v-else class="actions py-2">
  	    <button @click="activate" :class="{'cursor-wait bg-grey': (!affordable)}" class="relative bg-blue-light- text-xs text-light uppercase font-bold p-2 opacity-50 button" :disabled="!affordable">
    			<span :style="{width: affordability + '%'}" class="absolute block pin h-full bg-blue-light z-0"></span>
    			<span class="relative z-10">
    				<template v-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
    				<template v-else>Connect</template>
    			</span>
    		</button>
	    </div>
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
import svg from "../svg";
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

    header {
      .title {
        background: rgba(map-get($colors, light), 0.1666);
      }
    }

    &:before {
      background-position: left top, left top, center top;
      background-repeat: repeat, repeat, no-repeat;
      background-size: auto, auto, cover;
      background-attachment: fixed, fixed, fixed;
      top: 0.5rem;
      left: 0.5rem;
      bottom: 0.5rem;
      right: 0.5rem;
      z-index: -1;
    }

    &:after {
      @apply absolute pin;
      content: "";
      z-index: -2;
      background-image: map-get($backgrounds, dots-h),
        map-get($backgrounds, dots-v);
      background-position: center center;
      background-size: 2px 2px;
    }

    @each $c, $color in $colors {
      &.bg-#{$c} {
        &:before {
          background-image: linear-gradient(
              rgba($color, 0.1666) 0%,
              rgba($color, 0.1666) 100%
            ),
            map-get($backgrounds, tile), map-get($backgrounds, gradient);
        }
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
}
</style>

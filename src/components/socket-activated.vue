<docs>
### Socket activated
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

> **TODO**: Refactor to **socket**, **socket-inactive** & **socket-activated**.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-activated label.string="socket-activated-label"></socket-activated>`
</docs>

<script>
import _ from "lodash";
import store from "../store";
import { mapState, mapGetters, mapActions } from "vuex";

import BaseEra from "./base-era";
import BaseFactor from "./base-factor";
import BaseIcon from "./base-icon";
import SocketSlot from "./socket-slot";

export default {
  name: "socket-activated",
  store,
  components: {
    BaseEra,
    BaseFactor,
    BaseIcon,
    SocketSlot
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

<template>
  <div class="socket-activated-field py-8">
    <div
      class="socket-activated hexagon bg-tile-overlay w-48 h-hex*48 px-2 py-6 text-center flex flex-col justify-between items-center"
      :class="'bg-' + socket.type"
      @mouseover="showChallenge = true"
      @mouseout="showChallenge = false"
    >
      <header class="flex items-center justify-center text-center bg-grey-25 p-2 w-2/3 h-12 order-2">
        <h4 class="title text-light text-sm uppercase">{{ socket.name }}</h4>
      </header>
      <div class="flex w-full h-12 flex-wrap justify-center items-center pl-3 order-2">
        <template v-if="event">
          <base-factor
            v-for="(value, factor) in factors"
            v-show="!showChallenge"
            class="w-1/2"
            :key="factor"
            :label="factor"
            :value="value.base"
          ></base-factor>
          <button
            v-show="showChallenge"
            class="bg-sky text-xs text-light uppercase font-bold p-2 mr-3 button"
          >{{ $t('Challenge') }}</button>
        </template>
        <button
          v-else
          class="relative text-xs text-light uppercase font-bold p-2 mr-3 button"
          :class="{ 'cursor-wait bg-grey-50': (!affordable) }"
          :disabled="!affordable"
          @click.once="activate()"
        >
          <span
            class="absolute block pin h-full bg-sky z-0"
            :style="{width: affordability + '%'}"
          ></span>
          <span class="relative z-10">
            <template v-if="costs.confidence > scores.confidence">Costs {{ costs.confidence|confidence }}</template>
            <template v-else>{{ $t('Connect') }}</template>
          </span>
        </button>
      </div>
      <base-icon
        class="w-8 h-8 text-light mb-2 order-1"
        :label="socket.type"
        :class="'text-' + socket.type"
      ></base-icon>
      <base-era
        class="mt-1 order-4 w-2"
        :label="socket.era"
      ></base-era>
    </div>
    <socket-slot
      v-if="event"
      v-for="(slot, index) in slots"
      :key="index"
      :label="index"
      :class="[slot.position, index]">
    </socket-slot>
  </div>
</template>

<style lang="scss">
@import "../scss/$variables";

.socket-activated-field {
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

  .socket-activated {
    grid-area: d;

    &:before {
      top: 0.5rem;
      left: 0.5rem;
      bottom: 0.5rem;
      right: 0.5rem;
    }

    &:after {
      background-image: map-get($backgrounds, dotted-horizontal),
        map-get($backgrounds, dotted-vertical);
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

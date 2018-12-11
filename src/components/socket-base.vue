<docs>
### Socket base
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-base label.string="socket-label"></socket-base>`
</docs>

<script>
import _ from 'lodash';
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import BaseEra from './base-era';
import BaseIcon from './base-icon';
import BaseHexagon from './base-hexagon';
import SocketSlot from './socket-slot';

export default {
  name: 'socket-base',
  store,
  components: {
    BaseEra,
    BaseHexagon,
    BaseIcon,
    SocketSlot,
  },
  props: {
    label: String,
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
      return this.getEventOfType(this.label, 'socket');
    },
    newEvent: function() {
      return {
        type: 'socket',
        label: this.label,
      };
    },
    ...mapGetters([
      'getScores',
      'getEventOfType',
      'getSocket',
      'getSocketCosts',
      'getSlotsForSocket',
    ]),
  },
  methods: {
    activate: function() {
      this.addSocketEvent(this.newEvent);
    },
    ...mapActions(['addSocketEvent']),
  },
};
</script>

<template>
  <base-hexagon
    class="socket-base hexagon--tile"
    :class="[`socket-base--${socket.type}`, `hexagon--${socket.type}`]"
  >
    <header
      class="flex items-center justify-center text-center bg-grey-25 p-2 w-2/3 h-12 order-2"
    >
      <h4 class="title text-light text-sm uppercase">{{ socket.name }}</h4>
    </header>
    <div class="flex w-full h-12 flex-wrap justify-center items-center order-2">
      <slot>
        <button
          class="relative text-xs text-light uppercase font-bold p-2 button"
          :class="{ 'cursor-wait bg-grey-50': !affordable }"
          :disabled="!affordable"
          @click.once="activate()"
        >
          <span
            class="absolute block pin h-full bg-sky z-0"
            :style="{ width: affordability + '%' }"
          ></span>
          <span class="relative z-10">
            <template v-if="costs.confidence > scores.confidence">
              Costs {{ costs.confidence | confidence }}
            </template>
            <template v-else>{{ $t('Connect') }}</template>
          </span>
        </button>
      </slot>
    </div>
    <base-icon
      class="w-8 h-8 text-light mb-2 order-1"
      :label="socket.type"
      :class="'text-' + socket.type"
    ></base-icon>
    <base-era class="mt-1 order-4 w-2" :label="socket.era"></base-era>
  </base-hexagon>
</template>

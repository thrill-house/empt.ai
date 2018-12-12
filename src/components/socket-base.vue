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

import BaseButton from './base-button';
import BaseEra from './base-era';
import BaseIcon from './base-icon';
import BaseHexagon from './base-hexagon';

export default {
  name: 'socket-base',
  store,
  components: {
    BaseButton,
    BaseEra,
    BaseHexagon,
    BaseIcon,
  },
  props: {
    label: String,
  },
  computed: {
    socket: function() {
      return this.getSocket(this.label);
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
    class="socket-base socket-base--light hexagon--tile hexagon--grey"
  >
    <header class="socket-base__header">
      <h4 class="socket-base__title">{{ socket.name }}</h4>
    </header>
    <div class="socket-base__content">
      <slot>
        <base-button
          class="button--medium button--bold"
          :class="[affordable ? 'button--sky' : 'button--navy']"
          :disabled="!affordable"
          @click.once="activate()"
        >
          <span
            class="button__progress button__progress--sky"
            :style="{ width: affordability + '%' }"
          ></span>
          <!-- <span class="relative z-10"> -->
          <template v-if="costs.confidence > scores.confidence">
            {{ $t('Costs') }} {{ costs.confidence | confidence }}
          </template>
          <template v-else>{{ $t('Connect') }}</template>
          <!-- </span> -->
        </base-button>
      </slot>
    </div>
    <base-icon
      class="icon--medium socket-base__icon"
      :label="socket.tree"
      :class="`icon--${socket.tree}`"
    ></base-icon>
    <base-era class="mt-1 order-4 w-2" :label="socket.era"></base-era>
  </base-hexagon>
</template>

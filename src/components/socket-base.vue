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
  blockName: 'socket-base',
  store,
  components: {
    BaseButton,
    BaseEra,
    BaseHexagon,
    BaseIcon,
  },
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: 'grey',
    },
  },
  computed: {
    socket() {
      return this.getSocket(this.label);
    },
    affordability() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable() {
      return this.affordability === 100;
    },
    factors() {
      return this.socket.factors;
    },
    costs() {
      return this.getSocketCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    event() {
      return this.getEventOfType(this.label, 'socket');
    },
    newEvent() {
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
    activate() {
      this.addSocketEvent(this.newEvent);
    },
    ...mapActions(['addSocketEvent']),
  },
};
</script>

<template>
  <base-hexagon v-bem="{ color }" :tile="true" :color="color">
    <header v-bem:header>
      <h4 v-bem:title>{{ socket.name }}</h4>
    </header>
    <div v-bem:content>
      <slot>
        <base-button
          v-bem:connect
          size="medium"
          :progress="affordability"
          :color="affordable ? 'sky' : 'navy'"
          :disabled="!affordable"
          @click.native.once="activate()"
        >
          <template v-if="affordable">
            {{ $t('Costs') }} {{ costs.confidence | confidence }}
          </template>
          <template v-else>{{ $t('Connect') }}</template>
        </base-button>
      </slot>
    </div>
    <base-icon
      v-bem:icon
      size="medium"
      :color="socket.tree"
      :label="socket.tree"
    ></base-icon>
    <base-era v-bem:era :label="socket.era"></base-era>
  </base-hexagon>
</template>

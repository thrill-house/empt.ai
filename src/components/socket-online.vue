<docs>
### Socket online
The data socket is the base component that abilities are attached to. When enabled, their multipliers are applied to the score calculation.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-online label.string="socket-online-label"></socket-online>`
</docs>

<script>
import _ from 'lodash';
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import BaseButton from './base-button';
import BaseFactor from './base-factor';
import SocketBase from './socket-base';

export default {
  name: 'socket-online',
  blockName: 'socket-base',
  store,
  components: {
    BaseButton,
    BaseFactor,
    SocketBase,
  },
  props: {
    label: String,
  },
  computed: {
    socket() {
      return this.getSocket(this.label);
    },
    event() {
      return this.getSocketEvent(this.label);
    },
    slotEvents() {
      return this.getSocketSlotEvents(this.label);
    },
    factors() {
      return this.socket.factors;
    },
    calculatedFactors() {
      return this.getCalculatedFactors(this.event);
    },
    cumulativeFactors() {
      return this.getEventsFactors(this.slotEvents, this.calculatedFactors);
    },
    ...mapGetters([
      'getSocket',
      'getSocketEvent',
      'getSocketSlotEvents',
      'getCalculatedFactors',
      'getEventsFactors',
    ]),
  },
};
</script>

<template>
  <socket-base v-bem.online :color="socket.tree" :label="label">
    <div v-bem:factors>
      <base-factor
        v-for="(value, factor) in cumulativeFactors"
        :key="factor"
        :label="factor"
        :value="value"
        :accumulating="true"
      ></base-factor>
    </div>
    <base-button v-bem:challenge> {{ $t('Challenge') }} </base-button>
  </socket-base>
</template>

<style lang="scss"></style>

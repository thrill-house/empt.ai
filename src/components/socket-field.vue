<docs>
### Socket field
Helper component for sockets to extend, defining the socket and its slots locations.

##### Properties
- `label` — A label referring to a data socket in the global store.

##### Instantiation
`<socket-field label.string="socket-label"></socket-field>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

import SocketBase from './socket-base';
import SocketOnline from './socket-online';
import SocketSlot from './socket-slot';

export default {
  name: 'socket-field',
  store,
  components: {
    SocketBase,
    SocketOnline,
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
    event: function() {
      return this.getEventOfType(this.label, 'socket');
    },
    ...mapGetters(['getSocket', 'getEventOfType', 'getSlotsForSocket']),
  },
};
</script>

<template>
  <div class="socket-field">
    <socket-online v-if="event" :label="label"></socket-online>
    <socket-base v-else :label="label"></socket-base>
    <socket-slot
      v-for="(slot, index) in slots"
      :key="index"
      :label="index"
    ></socket-slot>
  </div>
</template>

<style lang="scss">
.socket-field {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    '. a a b b .'
    '. a a b b .'
    'c c d d e e'
    'c c d d e e'
    '. f f g g .'
    '. f f g g .';
}
</style>

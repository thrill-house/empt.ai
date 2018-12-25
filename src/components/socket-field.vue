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
import SocketSlotter from './socket-slotter';

export default {
  name: 'socket-field',
  store,
  components: {
    SocketBase,
    SocketOnline,
    SocketSlotter,
  },
  props: {
    label: String,
  },
  computed: {
    socket() {
      return this.getSocket(this.label);
    },
    slots() {
      return _.each(this.socket.slots, (slot, label) => {
        let event = this.getSlotEvents(label);
        _.set(slot, 'event', _.head(event));
      });
    },
    event() {
      return this.getEventOfType(this.label, 'socket');
    },
    ...mapGetters([
      'getSocket',
      'getSocketSlots',
      'getSlotEvents',
      'getEventsOfType',
      'getEventOfType',
      'getSlotEvents',
      'getSlotsForSocket',
      'getInteraction',
    ]),
  },
  methods: {},
};
</script>

<template>
  <div v-if="socket" class="socket-field">
    <socket-online v-if="event" :label="label"></socket-online>
    <socket-base v-else :label="label"></socket-base>
    <socket-slotter
      v-for="(slot, index) in slots"
      :key="index"
      :slotter="slot"
    ></socket-slotter>
  </div>
</template>

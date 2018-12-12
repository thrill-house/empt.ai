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

import AbilitySlotted from './ability-slotted';
//import AbilitySlotting from './ability-slotting';
import SocketBase from './socket-base';
import SocketOnline from './socket-online';
import SocketSlot from './socket-slot';

export default {
  name: 'socket-field',
  store,
  components: {
    AbilitySlotted,
    //AbilitySlotting,
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
      return this.socket.slots;
    },
    slotted: function() {
      return _.pickBy(this.slots, (slot, label) => {
        var event = this.getSlotEvents(label);
        _.set(slot, 'event', _.head(event));
        return event.length || false;
      });
    },
    unslotted: function() {
      return _.omit(this.slots, _.keys(this.slotted));
    },
    event: function() {
      return this.getEventOfType(this.label, 'socket');
    },
    slotEvents: function() {
      return this.getEventsOfType(this.label, 'ability', 'instance');
    },
    ...mapGetters([
      'getSocket',
      'getSocketSlots',
      'getSlotEvents',
      'getEventsOfType',
      'getEventOfType',
      'getSlotEvents',
      'getSlotsForSocket',
    ]),
  },
  methods: {},
};
</script>

<template>
  <div class="socket-field">
    <socket-online v-if="event" :label="label"></socket-online>
    <socket-base v-else :label="label"></socket-base>
    <template v-if="true">
      <ability-slotted
        v-for="(slot, index) in slotted"
        :key="index"
        :instance="slot.event.instance"
        :slotObject="slot"
      ></ability-slotted>
      <socket-slot
        v-for="(slot, index) in unslotted"
        :key="index"
        :slotObject="slot"
      ></socket-slot>
    </template>
    <!-- <template v-for="(slot, index) in slots">
      <ability-slotting
        v-if="false"
        :key="index"
        :slot="index"
      ></ability-slotting>
      <ability-slotted
        v-if=""
        :slotLabel="index"
      ></ability-slotted>
      
    </template> -->
  </div>
</template>

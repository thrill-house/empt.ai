<docs>
### Socket slotter
Determine what, if anything should be slotted into the socket slot.

##### Properties
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<socket-slotter slotter="{ slot }"></socket-slotter>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySlot from './ability-slot';
import BaseButton from './base-button';
import SocketSlot from './socket-slot';

export default {
  name: 'socket-slotter',
  store,
  components: {
    AbilitySlot,
    BaseButton,
    SocketSlot,
  },
  props: {
    slotter: Object,
  },
  data: () => ({
    hover: false,
  }),
  computed: {
    // Label of the slot
    label() {
      return this.slotter.label;
    },

    // Get event in slot, if there is one.
    event() {
      return this.getSlotEvent(this.label) || false;
    },
    instance() {
      return this.event.instance || false;
    },
    abilityLabel() {
      return this.event.ability || false;
    },

    // See if we're previewing an slotting event.
    portal() {
      return this.hover ? 'slotter' : this.label;
    },

    // See if there's an event or slotting preview going on.
    component() {
      return this.event ? 'ability-slot' : 'socket-slot';
    },
    ...mapState({
      abilities: (state) => state.abilities.list,
    }),
    ...mapGetters([
      'getFactors',
      'getEra',
      'getEventOfType',
      'getEventObjects',
      'getStage',
      'getAbility',
      'getAbilityDependants',
      'getSlotEvent',
      'getAbilitySlotEvent',
      'getSocketForSlot',
      'getPrettyUnit',
    ]),
  },
  methods: {
    over() {
      this.hover = true;
    },
    out() {
      this.hover = false;
    },
  },
};
</script>

<template>
  <portal-target
    :name="portal"
    :slot-props="{ slotLabel: label, slotter: slotter }"
    @mouseover.native="over()"
    @mouseout.native="out()"
    slim
  >
    <keep-alive>
      <component
        :is="component"
        :slotter="slotter"
        :abilityInstance="instance"
        :abilityLabel="abilityLabel"
      />
    </keep-alive>
  </portal-target>
</template>

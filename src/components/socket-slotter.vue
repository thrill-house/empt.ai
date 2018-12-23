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
  blockName: 'socket-slotter',
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
    label: function() {
      return this.slotter.label;
    },

    // Get our interaction, if there is one.
    interaction: function() {
      return this.getInteraction('slot');
    },
    interactionInstance: function() {
      return this.interaction.instance || false;
    },
    interactionLabel: function() {
      return this.interaction.label || false;
    },

    // Get event in slot, if there is one.
    event: function() {
      return this.getSlotEvent(this.label) || false;
    },
    eventInstance: function() {
      return this.event.instance || false;
    },
    eventLabel: function() {
      return this.event.ability || false;
    },

    // See if we're previewing an slotting event.
    previewing: function() {
      return this.interaction && this.hover;
    },

    // See if there's an event or slotting preview going on.
    component: function() {
      return this.previewing || this.event ? 'ability-slot' : 'socket-slot';
    },

    // Figure out our ability details depending on if we’re installing or if there is already an event.
    abilityLabel: function() {
      return this.previewing ? this.interactionLabel : this.eventLabel;
    },
    abilityInstance: function() {
      return this.previewing ? this.interactionInstance : this.eventInstance;
    },

    // Placeholder for a new slotting event
    slotEvent: function() {
      return {
        label: this.label,
        ability: this.interactionLabel,
        instance: this.interactionInstance,
      };
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
      'getInteraction',
      'getSlotEvent',
      'hasValidSlotEvents',
      'getSocketForSlot',
      'prettyUnit',
    ]),
  },
  methods: {
    addEvent: function() {
      if (this.previewing && this.addSlotEvent(this.slotEvent)) {
        this.resetInteraction('slot');
      }
    },
    ...mapActions(['addSlotEvent', 'resetInteraction']),
  },
};
</script>

<template>
  <keep-alive>
    <component
      :is="component"
      :slotter="slotter"
      :abilityInstance="abilityInstance"
      :abilityLabel="abilityLabel"
      :installing="previewing"
      @mouseenter.native="hover = true"
      @mouseleave.native="hover = false"
      @click.native="addEvent()"
    ></component>
  </keep-alive>
</template>

<docs>
### Ability slotting
Previews an ability to be installed in a socket slot.

##### Properties
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<ability-slotted instance.string="ability-instance-id"></ability-slotted>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySlotted from './ability-slotted';
import BaseButton from './base-button';
import SocketSlot from './socket-slot';

export default {
  name: 'ability-slotting',
  blockName: 'ability-slotting',
  store,
  components: {
    AbilitySlotted,
    BaseButton,
    SocketSlot,
  },
  props: {
    abilityLabel: String,
    instance: String,
    slotObject: Object,
  },
  data: () => ({
    hover: false,
  }),
  computed: {
    label: function() {
      return this.slotObject.label;
    },
    component: function() {
      return this.hover || this.slotEvent ? 'ability-slotted' : 'socket-slot';
    },
    component: function() {
      return this.hover || this.slotEvent ? 'ability-slotted' : 'socket-slot';
    },
    slotEvent: function() {
      return this.slotObject.event || false;
    },
    slotInstance: function() {
      return this.hover
        ? this.instance
        : this.slotEvent
        ? this.slotEvent.instance
        : false;
    },
    newEvent: function() {
      return {
        label: this.label,
        ability: this.abilityLabel,
        instance: this.instance,
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
      'hasValidSlotEvents',
      'getSocketForSlot',
      'prettyUnit',
    ]),
  },
  methods: {
    addEvent: function() {
      console.log(this.newEvent);
      if (this.addSlotEvent(this.newEvent)) {
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
      :abilityLabel="abilityLabel"
      :slotObject="slotObject"
      :instance="slotInstance"
      :installing="hover"
      @mouseenter.native="hover = true"
      @mouseleave.native="hover = false"
      @click.native="addEvent(abilityLabel, instance)"
    ></component>
  </keep-alive>
</template>

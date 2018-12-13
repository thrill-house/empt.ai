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
import SocketSlot from './socket-slot';

export default {
  name: 'ability-slotting',
  blockName: 'ability-slotting',
  store,
  components: {
    AbilitySlotted,
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
    clearSlotEvent: function() {
      this.addSlotEvent({
        label: this.slotEvent.label,
        ability: this.slotEvent.ability,
        instance: '',
      });
    },
    ...mapActions(['addSlotEvent']),
  },
};
</script>

<template>
  <ability-slotted
    v-if="hover"
    :abilityLabel="abilityLabel"
    :slotObject="slotObject"
    :instance="instance"
  ></ability-slotted>
  <ability-slotted
    v-else-if="slotObject.event"
    :abilityLabel="abilityLabel"
    :slotObject="slotObject"
    :instance="slotObject.event.instance"
  ></ability-slotted>
  <socket-slot v-else :slotObject="slotObject"></socket-slot>
</template>

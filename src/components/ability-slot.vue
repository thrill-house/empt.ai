<docs>
### Ability slot
The enabled or installing ability is shown within a socket slot.

##### Properties
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<ability-slot abilityInstance.string="instance" abilityLabel.string="label"></ability-slot>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySymbioses from './ability-symbioses';
import BaseBadge from './base-badge';
import BaseEra from './base-era';
import BaseFactor from './base-factor';
import BaseIcon from './base-icon';
import EmotionDiagram from './emotion-diagram';
import SocketSlot from './socket-slot';

export default {
  name: 'ability-slot',
  blockName: 'ability-slot',
  store,
  props: {
    abilityLabel: String,
    abilityInstance: [String, Boolean],
    slotter: Object,
    installing: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AbilitySymbioses,
    BaseBadge,
    BaseEra,
    BaseFactor,
    BaseIcon,
    EmotionDiagram,
    SocketSlot,
  },
  computed: {
    slot: function() {
      return this.slotter;
    },
    label: function() {
      return this.slot.label;
    },
    ability: function() {
      return this.getAbility(this.abilityLabel);
    },
    tree: function() {
      return this.ability.tree;
    },
    factors: function() {
      return this.ability.factors;
    },
    calculatedFactors: function() {
      return this.getFactors(this.slotEvent);
    },
    influence: function() {
      return this.factors.influence || {};
    },
    trees: function() {
      return this.influence.trees || {};
    },
    dependencies: function() {
      return this.influence.dependencies || {};
    },
    dependants: function() {
      return this.getAbilityDependants(this.abilityLabel);
    },
    event: function() {
      return this.getEventOfType(this.abilityInstance, 'ability', 'instance');
    },
    slotEvent: function() {
      return this.slot.event;
    },
    socket: function() {
      return this.getSocket(this.slot.socketLabel);
    },
    treeMatch: function() {
      return this.ability.tree === this.socket.tree;
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
      'getAbilitySlotEvent',
      'getSocket',
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
  <socket-slot
    v-bem="{ color: treeMatch ? tree : 'light', installing: installing }"
    color="grey"
    :slotter="slotter"
  >
    <div v-bem:content>
      <base-badge v-bem:content-badge size="large" :color="tree">
        <slot name="badge">
          <base-icon size="large" color="light" :label="abilityLabel" />
        </slot>
      </base-badge>
      <ability-symbioses
        v-bem:content-dependencies
        type="dependency"
        :symbiotes="dependencies"
      ></ability-symbioses>
      <ability-symbioses
        v-bem:content-dependants
        type="dependant"
        :symbiotes="dependants"
      ></ability-symbioses>
    </div>
    <base-badge v-bem:tree size="small" :color="treeMatch ? tree : 'grey'">
      <base-icon size="small" :color="tree" :label="tree" />
    </base-badge>
    <base-era v-bem:era :label="ability.era" />
  </socket-slot>
</template>

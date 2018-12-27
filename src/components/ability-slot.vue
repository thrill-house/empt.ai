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
    abilityLabel: [String, Boolean],
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
    slot() {
      return this.slotter;
    },
    label() {
      return this.slot.label;
    },
    ability() {
      return this.getAbility(this.abilityLabel) || {};
    },
    tree() {
      return this.ability.tree || {};
    },
    factors() {
      return this.ability.factors || {};
    },
    calculatedFactors() {
      return this.calculateFactors(this.slotEvent);
    },
    influence() {
      return this.factors.influence || {};
    },
    trees() {
      return this.influence.trees || {};
    },
    dependencies() {
      return this.influence.dependencies || {};
    },
    dependants() {
      return this.getAbilityDependants(this.ability.label) || {};
    },
    event() {
      return this.getEventOfType(this.abilityInstance, 'ability', 'instance');
    },
    slotEvent() {
      return this.slot.event;
    },
    socket() {
      return this.getSocket(this.slot.socketLabel);
    },
    treeMatch() {
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
};
</script>

<template>
  <socket-slot
    v-bem="{ color: treeMatch ? tree : 'light', installing: installing }"
    color="grey"
    :slotter="slotter"
  >
    <div v-bem:content>
      <base-badge v-bem:content-badge size="large" :fade="tree">
        <slot name="badge">
          <base-icon size="large" color="light" :label="abilityLabel" />
        </slot>
      </base-badge>
      <ability-symbioses
        v-bem:content-dependencies
        type="dependency"
        :source="ability"
        :minimum="3"
        :symbiotes="dependencies"
      ></ability-symbioses>
      <ability-symbioses
        v-bem:content-dependants
        type="dependant"
        :source="ability"
        :minimum="3"
        :symbiotes="dependants"
      ></ability-symbioses>
    </div>
    <base-badge v-bem:tree size="tiny" :fade="treeMatch ? tree : 'grey'">
      <base-icon size="tiny" :color="tree" :label="tree" />
    </base-badge>
    <base-era v-bem:era :label="ability.era" />
  </socket-slot>
</template>

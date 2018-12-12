<docs>
### Ability slotted
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<ability-slotted instance.string="ability-instance-id"></ability-slotted>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySymbiosis from './ability-symbiosis';
import BaseEra from './base-era';
import BaseFactor from './base-factor';
import BaseIcon from './base-icon';
import EmotionDiagram from './emotion-diagram';
import SocketSlot from './socket-slot';

export default {
  name: 'ability-slotted',
  props: {
    instance: String,
    slotObject: Object,
  },
  store,
  components: {
    AbilitySymbiosis,
    BaseEra,
    BaseFactor,
    BaseIcon,
    EmotionDiagram,
    SocketSlot,
  },
  computed: {
    slot: function() {
      return this.slotObject;
    },
    label: function() {
      return this.slot.label;
    },
    abilityLabel: function() {
      console.log(this.slot);
      return this.event.label;
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
      return this.getEventOfType(this.instance, 'ability', 'instance');
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
      'hasValidSlotEvents',
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
    class="ability-slotted hexagon--grey"
    :class="[`ability-slotted--${treeMatch ? tree : 'light'}`]"
    :slotObject="slotObject"
  >
    <div class="ability-slotted__content">
      <div
        class="ability-slotted__content-icon icon-container icon-container--large icon-container--light"
        :class="[`icon-container--${tree}`]"
      >
        <!-- <div
        :class="[
          'ability-slotted' | el('content-icon'),
          'icon' | dash('container') | mod(['large', 'light', tree]),
        ]"
      > -->
        <base-icon
          class="icon--large icon--light"
          :label="abilityLabel"
        ></base-icon>
      </div>
      <div class="ability-slotted__content-dependencies">
        <ability-symbiosis
          v-for="(value, dependency, index) in dependencies"
          class="border-2"
          :class="[
            'border-' + (hasValidSlotEvents(dependency) ? 'sky' : 'light'),
            { 'mt-1': index > 0 },
          ]"
          :key="dependency"
          :label="dependency"
        ></ability-symbiosis>
      </div>
      <div class="ability-slotted__content-dependants">
        <ability-symbiosis
          v-for="(value, dependant, index) in dependants"
          :class="[
            'bg-' + (hasValidSlotEvents(dependant) ? 'sky' : 'grey-50'),
            { 'mt-1': index > 0 },
          ]"
          :key="dependant"
          :label="dependant"
        ></ability-symbiosis>
      </div>
    </div>
    <div
      class="ability-slotted__tree icon-container icon-container--small"
      :class="[`icon-container--${treeMatch ? tree : 'grey'}`]"
    >
      <base-icon
        class="icon--small"
        :class="`icon--${tree}`"
        :label="tree"
      ></base-icon>
    </div>
    <base-era class="ability-slotted__era" :label="ability.era"></base-era>
  </socket-slot>
</template>

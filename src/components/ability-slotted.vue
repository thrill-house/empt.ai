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
      return this.event.label;
    },
    ability: function() {
      return this.getAbility(this.abilityLabel);
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
      return this.getEventOfType(this.instance, 'slot', 'instance');
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
  <socket-slot :slotObject="slotObject">
    <div class="flex justify-between items-center w-full order-2">
      <div
        class="w-24 h-24 rounded-full inline-flex flex-no-shrink items-center justify-center order-2"
        :class="['bg-' + ability.tree + '-25']"
      >
        <base-icon
          class="w-16 h-16 text-light"
          :label="abilityLabel"
        ></base-icon>
      </div>
      <!-- <div class="w-8 flex-no-shrink outputs order-1 ml-px">
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
      <div class="w-8 flex-no-shrink outputs order-3 mr-px">
        <ability-symbiosis
          v-for="(value, dependant, index) in dependants"
          :class="[
            'bg-' + (hasValidSlotEvents(dependant) ? 'sky' : 'grey-50'),
            { 'mt-1': index > 0 },
          ]"
          :key="dependant"
          :label="dependant"
        ></ability-symbiosis>
      </div> -->
    </div>
    <div
      class="w-8 h-8 rounded-full inline-flex items-center justify-center mb-2 order-1"
      :class="['bg-' + (treeMatch ? ability.type : 'grey') + '-25']"
    >
      <base-icon
        class="w-4 h-4"
        :label="ability.type"
        :class="'text-' + ability.type"
      ></base-icon>
    </div>
    <base-era :label="ability.era" class="mt-2 w-2 order-3"></base-era>
  </socket-slot>
</template>

<style lang="scss">
.ability-slotted {
  &:before {
    top: 0.1666rem;
    left: 0.1666rem;
    bottom: 0.1666rem;
    right: 0.1666rem;
  }

  &:not(.tree-match) {
    &:after {
      @apply bg-light;
    }
  }
}
</style>

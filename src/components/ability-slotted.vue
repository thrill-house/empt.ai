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
import BaseBadge from './base-badge';
import BaseEra from './base-era';
import BaseFactor from './base-factor';
import BaseIcon from './base-icon';
import EmotionDiagram from './emotion-diagram';
import SocketSlot from './socket-slot';

export default {
  name: 'ability-slotted',
  blockName: 'ability-slotted',
  store,
  props: {
    abilityLabel: String,
    instance: [String, Boolean],
    slotObject: Object,
  },
  components: {
    AbilitySymbiosis,
    BaseBadge,
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
    v-bem="{ color: treeMatch ? tree : 'light' }"
    color="grey"
    :slotObject="slotObject"
  >
    <div v-bem:content>
      <base-badge v-bem:content-badge size="large" :color="tree">
        <base-icon size="large" color="light" :label="abilityLabel" />
      </base-badge>
      <div v-bem:content-dependencies>
        <ability-symbiosis
          v-bem:symbiosis
          v-for="(value, dependency, index) in dependencies"
          :color="false"
          :iconColor="hasValidSlotEvents(dependency) ? 'sky' : 'light'"
          :borderColor="hasValidSlotEvents(dependency) ? 'sky' : 'light'"
          borderSize="medium"
          :key="dependency"
          :label="dependency"
        ></ability-symbiosis>
      </div>
      <div v-bem:content-dependants>
        <ability-symbiosis
          v-bem:symbiosis
          v-for="(value, dependant, index) in dependants"
          :color="hasValidSlotEvents(dependant) ? 'sky' : 'grey'"
          :key="dependant"
          :label="dependant"
        ></ability-symbiosis>
      </div>
    </div>
    <base-badge v-bem:tree size="small" :color="treeMatch ? tree : 'grey'">
      <base-icon size="small" :color="tree" :label="tree" />
    </base-badge>
    <base-era v-bem:era :label="ability.era" />
  </socket-slot>
</template>

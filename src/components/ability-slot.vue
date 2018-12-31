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
import BaseHover from './base-hover';
import BaseIcon from './base-icon';
import EmotionDiagram from './emotion-diagram';
import SocketSlot from './socket-slot';
import TheTooltip from './the-tooltip';

export default {
  name: 'ability-slot',
  blockName: 'ability-slot',
  store,
  extends: BaseHover,
  components: {
    AbilitySymbioses,
    BaseBadge,
    BaseEra,
    BaseFactor,
    BaseIcon,
    EmotionDiagram,
    SocketSlot,
    TheTooltip,
  },
  props: {
    abilityLabel: [String, Boolean],
    abilityInstance: [String, Boolean],
    slotter: Object,
    installing: {
      type: Boolean,
      default: false,
    },
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
      return this.getCalculatedFactors(this.slotEvent);
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
      return this.getEventOfType(this.abilityInstance, 'slot', 'instance');
    },
    socket() {
      return this.getSocket(this.slot.socketLabel);
    },
    color() {
      return this.treeMatch ? this.tree : 'light';
    },
    stain() {
      return this.treeMatch ? this.tree : 'grey';
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
      'getCalculatedFactors',
      'getSocket',
      'getPrettyUnit',
    ]),
  },
};
</script>

<template>
  <socket-slot
    v-bem="{ color, installing }"
    :stain="stain"
    :color="false"
    :slotter="slotter"
  >
    <div v-bem:content>
      <base-badge
        v-bem:content-badge
        size="large"
        :fade="tree"
        :pulse="true"
        @mouseover.native="over"
        @mouseout.native="out"
        @mousemove.native="move"
      >
        <slot name="badge">
          <base-icon size="large" color="light" :label="abilityLabel" />
        </slot>
        <slot name="tooltip">
          <portal v-if="hover" to="tooltips">
            <the-tooltip v-bem:tooltip :position="position">
              <div v-bem:tooltip-factors>
                <base-factor
                  v-for="(value, factor) in calculatedFactors"
                  v-bem:factors-base
                  :key="factor"
                  :label="factor"
                  :value="value"
                  :accumulating="true"
                ></base-factor>
                <base-factor
                  v-for="(value, tree) in trees"
                  v-bem:factors-tree
                  :key="tree"
                  :label="tree"
                  :value="value"
                ></base-factor>
              </div>
            </the-tooltip>
          </portal>
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

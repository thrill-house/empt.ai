<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-available label.string="ability-label"></ability-available>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilityInstallable from './ability-installable';
import AbilityResearchable from './ability-researchable';
import AbilitySymbioses from './ability-symbioses';
import BaseBadge from './base-badge';
import BaseEra from './base-era';
import BaseFactor from './base-factor';
import BaseIcon from './base-icon';

export default {
  name: 'ability-available',
  blockName: 'ability-available',
  store,
  components: {
    AbilityInstallable,
    AbilityResearchable,
    AbilitySymbioses,
    BaseBadge,
    BaseEra,
    BaseFactor,
    BaseIcon,
  },
  props: {
    label: String,
  },
  created() {
    this.$on('research', this.researchDialog);
    this.$on('install', this.installDialog);
  },
  computed: {
    enabled() {
      return this.ability && this.eraActive;
    },
    ability() {
      return this.getAbility(this.label);
    },
    factors() {
      return this.ability.factors;
    },
    influence() {
      return this.factors.influence;
    },
    trees() {
      return this.influence.trees;
    },
    tree() {
      return this.ability.tree;
    },
    dependencies() {
      return this.influence.dependencies || {};
    },
    dependants() {
      return this.getAbilityDependants(this.label) || {};
    },
    era() {
      return this.ability.era;
    },
    eraActive() {
      return this.getIsEraActive(this.era);
    },
    install() {
      return this.getInteraction('installingAbility');
    },
    installLabel() {
      return this.install ? this.install.label : '';
    },
    research() {
      return this.getInteraction('researchingAbility');
    },
    researchLabel() {
      return this.research ? this.research.label : '';
    },
    interaction() {
      return (
        this.researchLabel === this.label || this.installLabel === this.label
      );
    },
    ...mapState({
      abilities: (state) => state.abilities.list,
    }),
    ...mapGetters([
      'getAbility',
      'getIsEraActive',
      'getAbilityDependants',
      'getInteraction',
      'prettyUnit',
    ]),
  },
  methods: {
    researchDialog() {
      this.$refs.research.startResearching();
    },
    installDialog() {
      this.$refs.install.startInstalling();
    },
  },
};
</script>

<template>
  <div v-if="enabled" v-bem>
    <header v-bem:header>
      <h4 v-bem:header-title>{{ ability.name }}</h4>
    </header>
    <div v-bem:factors>
      <base-factor
        v-for="(value, factor) in factors"
        v-bem:factors-base
        :key="factor"
        :label="factor"
        :value="value.base"
      ></base-factor>
      <base-factor
        v-for="(value, tree) in trees"
        v-bem:factors-tree
        :key="tree"
        :label="tree"
        :value="value"
      ></base-factor>
    </div>
    <div v-bem:content>
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
    <div v-bem:actions>
      <ability-installable
        v-bem:actions-installable
        ref="install"
        :label="label"
      ></ability-installable>
      <ability-researchable
        v-bem:actions-researchable
        ref="research"
        :label="label"
      ></ability-researchable>
    </div>
    <base-badge
      v-bem:icon
      size="large"
      stain="ash"
      borderColor="light"
      borderSize="small"
    >
      <base-icon size="large" color="light" :label="label" />
    </base-badge>
    <base-badge
      v-bem:tree
      size="small"
      stain="ash"
      borderColor="light"
      borderSize="small"
    >
      <base-icon size="small" :color="tree" :label="tree" />
    </base-badge>
    <base-badge
      v-bem:tree-background
      size="medium"
      borderColor="light"
      borderSize="small"
    />
    <base-badge
      v-bem:icon-background
      size="larger"
      borderColor="light"
      borderSize="small"
    >
      <base-era v-bem:era :label="ability.era"></base-era>
    </base-badge>
  </div>
</template>

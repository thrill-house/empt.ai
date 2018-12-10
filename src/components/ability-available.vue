<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-available label.string="ability-label"></ability-available>`
</docs>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import BaseIcon from "./base-icon";
import BaseEra from "./base-era";
import BaseFactor from "./base-factor";
import AbilitySymbiosis from "./ability-symbiosis";
import AbilityResearchable from "./ability-researchable";
import AbilityInstallable from "./ability-installable";

export default {
  name: "ability-available",
  store,
  components: {
    BaseIcon,
    BaseEra,
    BaseFactor,
    AbilitySymbiosis,
    AbilityResearchable,
    AbilityInstallable
  },
  props: {
    label: String
  },
  data: function() {
    return {
      hover: false
    };
  },
  created: function() {
    this.$on("research", this.researchDialog);
    this.$on("install", this.installDialog);
  },
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    factors: function() {
      return this.ability.factors;
    },
    influence: function() {
      return this.factors.influence;
    },
    trees: function() {
      return this.influence.trees;
    },
    dependencies: function() {
      return this.influence.dependencies;
    },
    dependants: function() {
      return this.getAbilityDependants(this.label);
    },
    era: function() {
      return this.ability.era;
    },
    eraActive: function() {
      return this.isEraActive(this.era);
    },
    install: function() {
      return this.getInteraction("installingAbility");
    },
    installLabel: function() {
      return this.install ? this.install.label : "";
    },
    research: function() {
      return this.getInteraction("researchingAbility");
    },
    researchLabel: function() {
      return this.research ? this.research.label : "";
    },
    interaction: function() {
      return (
        this.researchLabel === this.label || this.installLabel === this.label
      );
    },
    ...mapState({
      abilities: state => state.abilities.list
    }),
    ...mapGetters([
      "getAbility",
      "isEraActive",
      "getAbilityDependants",
      "getInteraction",
      "prettyUnit"
    ])
  },
  methods: {
    researchDialog: function() {
      this.$refs.research.startResearching();
    },
    installDialog: function() {
      this.$refs.install.startInstalling();
    }
  }
};
</script>

<template>
  <div
    v-if="ability && eraActive"
    class="ability-available relative w-80 h-32 bg-tile-overlay bg-light m-4"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <header class="flex py-1 pl-10 h-6 relative w-full z-10">
      <h4 class="uppercase mr-2">{{ ability.name }}</h4>
    </header>
    <div
      v-show="!hover"
      class="flex flex-wrap content-start relative z-10 pl-16 ml-16 py-1 h-16"
    >
      <base-factor
        v-for="(value, factor) in factors"
        :key="factor"
        :label="factor"
        :value="value.base"
        class="w-1/2 h-4 mb-1"
      ></base-factor>
      <base-factor
        v-for="(value, tree) in trees"
        :key="tree"
        :label="tree"
        :value="value"
        class="w-1/2 h-4 mb-1"
      ></base-factor>
    </div>
    <div
      v-show="hover"
      class="flex relative z-10 py-1 pl-16 pr-2 ml-16 h-16"
    >
      <div class="flex flex-wrap justify-between w-1/2 pr-1">
        <ability-symbiosis
          v-for="(value, dependency, index) in dependencies"
          :key="dependency"
          :label="dependency"
          :class="{ 'mx-auto -mt-2': (index == 2) }"
          class="border-2 border-sky"
        ></ability-symbiosis>
      </div>
      <div class="flex flex-wrap justify-between content-start w-1/2 pl-1">
        <ability-symbiosis
          v-for="(value, dependant, index) in dependants"
          :key="dependant"
          :label="dependant"
          :class="{'mx-auto -mt-2': index == 2}"
          class="bg-sky"
        ></ability-symbiosis>
      </div>
    </div>
    <div class="flex items-start justify-end pl-16 pr-2 pb-2 ml-16 h-10">
      <ability-installable
        class="w-1/2 mr-1"
        ref="install"
        :label="label"
      ></ability-installable>
      <ability-researchable
        class="w-1/2 ml-1"
        ref="research"
        :label="label"
      ></ability-researchable>
    </div>
    <div class="w-24 h-24 bg-tile-overlay bg-light overflow-hidden border border-light rounded-full inline-flex flex-no-shrink items-center justify-center absolute pin-l pin-t ml-3 mt-6 z-20 order-2">
      <base-icon
        class="w-16 h-16 text-light"
        :label="label"
      ></base-icon>
    </div>
    <div class="w-12 h-12 bg-tile-overlay bg-light overflow-hidden border border-light rounded-full inline-flex items-center justify-center mb-2 order-1 absolute pin-t pin-l -mt-1 -ml-3">
      <base-icon
        class="w-6 h-6"
        :label="ability.type"
        :class="'text-' + ability.type"
      ></base-icon>
    </div>
    <span class="circle-a"></span>
    <div class="circle-b overflow-hidden">
      <base-era
        class="order-3 absolute pin-l pin-b w-3 mb-10 z-10 items-start"
        :label="ability.era"
      ></base-era>
    </div>
  </div>
</template>

<style lang="scss">
.ability-available {
  background: none;

  &:before,
  &:after {
    @apply clip-parallelogram;
  }

  &:before {
    @apply absolute;
    top: 1px;
    left: 3px;
    bottom: 1px;
    right: 1px;
    z-index: 1;
  }

  &:after {
    @apply bg-light;
    z-index: 0;
  }

  .circle-a,
  .circle-b {
    @apply absolute block border border-grey rounded-full pin-l pin-t;
  }

  .circle-a {
    @apply h-16 w-16 -ml-5 -mt-3;
    z-index: 0;
  }

  .circle-b {
    @apply bg-tile h-28 w-28 ml-1 mt-4;
    z-index: 0;
  }
}
</style>

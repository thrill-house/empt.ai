<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Instantiation
`<available-ability label="ability-label"></available-ability>`
</docs>

<template>
  <div v-if="ability && eraActive" class="available-ability relative w-80 h-32 mimic-tile bg-light m-4" @mouseover="hover = true" @mouseout="hover = false">
	  <header class="flex py-1 pl-10 h-6 relative w-full z-10">
	    <h4 class="uppercase mr-2">{{ ability.name }}</h4>
    </header>
    <div v-show="!hover" class="flex flex-wrap content-start relative z-10 pl-16 ml-16 py-1 h-16">
	    <factor-value
	    v-for="(value, factor) in factors"
	    :key="factor"
	    :label="factor"
	    :value="value.base"
	    class="w-1/2 h-4 mb-1"></factor-value>
	    <factor-value
	    v-for="(value, tree) in trees"
	    :key="tree"
	    :label="tree"
	    :value="value"
	    class="w-1/2 h-4 mb-1"></factor-value>
    </div>
    <div v-show="hover" class="flex relative z-10 pl-16 pr-4 ml-16 h-16">
	    <div class="flex flex-wrap justify-between w-1/2 pr-3">
  	    <symbiotic-ability
  	  	v-for="(value, dependency, index) in dependencies"
  	    :key="dependency"
  	  	:label="dependency"
  	  	:class="{'mx-auto': index == 2}"
  	  	class="border-2 border-blue-light"></symbiotic-ability>
	    </div>
	    <div class="flex flex-wrap justify-between content-start w-1/2 pl-3">
  	    <symbiotic-ability
  	  	 v-for="(value, dependant, index) in dependants"
  	    :key="dependant"
  	  	:label="dependant"
  	  	:class="{'mx-auto': index == 2}"
  	  	class="bg-blue-light"></symbiotic-ability>
	    </div>
	  </div>
    <div class="flex items-center justify-end z-10 pl-16 pr-1 py-1 ml-16 h-10">
			<install-ability :label="label" class="w-1/2 mr-1 border-r border-light"></install-ability>
			<research-ability :label="label" class="w-1/2 ml-1"></research-ability>
    </div>
    <div class="w-24 h-24 mimic-tile bg-light overflow-hidden border border-light rounded-full inline-flex flex-no-shrink items-center justify-center absolute pin-l pin-t ml-3 mt-6 z-20 order-2">
	    <icon :label="label" class="w-16 h-16 text-light"></icon>
    </div>
    <div class="w-12 h-12 mimic-tile bg-light overflow-hidden border border-light rounded-full inline-flex items-center justify-center mb-2 order-1 absolute pin-t pin-l -mt-1 -ml-3">
	    <icon :label="ability.type" :class="'text-' + ability.type" class="w-6 h-6"></icon>
    </div>
    <span class="circle-a"></span>
    <div class="circle-b overflow-hidden">
      <era-stage :label="ability.era" class="order-3 absolute pin-l pin-b w-3 mb-10 z-10 items-start"></era-stage>
    </div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import EraStage from "./era-stage.vue";
import FactorValue from "./factor-value.vue";
import SymbioticAbility from "./symbiotic-ability.vue";
import ResearchAbility from "./research-ability.vue";
import InstallAbility from "./install-ability.vue";

export default {
  name: "available-ability",
  store,
  components: {
    Icon,
    EraStage,
    FactorValue,
    SymbioticAbility,
    ResearchAbility,
    InstallAbility
  },
  props: {
    label: String
  },
  data: function() {
    return {
      hover: false
    };
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
    ...mapState(["abilities"]),
    ...mapGetters([
      "getAbility",
      "isEraActive",
      "getAbilityDependants",
      "prettyUnit"
    ])
  }
};
</script>

<style lang="scss">
.available-ability {
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
    @apply absolute block border border-light rounded-full pin-l pin-t;
  }

  .circle-a {
    @apply h-16 w-16 -ml-5 -mt-3;
    z-index: 0;
  }

  .circle-b {
    @apply tile h-28 w-28 ml-1 mt-4;
    z-index: 0;
  }
}
</style>

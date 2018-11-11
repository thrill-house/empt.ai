<docs>
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="ability-label"></enabled-ability>`
</docs>

<template>
  <div v-if="event && slotEvent" :class="[('bg-' + ability.type), { 'tree-match': treeMatch }]" class="enabled-ability mimic-tile hexagon w-48 h-hex*48 px-2 py-6 flex flex-col justify-between items-center">
	    <div class="flex justify-between items-center w-full order-2">
  	    <div :class="['bg-' + ability.type + '-25']" class="w-24 h-24 rounded-full inline-flex flex-no-shrink items-center justify-center order-2">
    	    <icon :label="abilityLabel" class="w-16 h-16 text-light"></icon>
  	    </div>
  	    <div class="w-8 flex-no-shrink outputs order-1 ml-px">
			  	<symbiotic-ability
			  	v-for="(value, dependency, index) in dependencies"
    	    :key="dependency"
			  	:label="dependency" 
			  	:class="['border-' + (hasValidSlotEvents(dependency)? 'blue-light': 'light'), { 'mt-1': (index > 0) }]"
			  	class="border-2"></symbiotic-ability>
  	    </div>
  	    <div class="w-8 flex-no-shrink outputs order-3 mr-px">
		      <symbiotic-ability
			  	 v-for="(value, dependant, index) in dependants"
    	    :key="dependant"
			  	:label="dependant" 
			  	:class="['bg-' + (hasValidSlotEvents(dependant)? 'blue-light': 'grey-50'), { 'mt-1': (index > 0) }]"></symbiotic-ability>
	      </div>
	    </div>
	    <div :class="['bg-' + (treeMatch? ability.type: 'grey') + '-25']" class="w-8 h-8 rounded-full inline-flex items-center justify-center mb-2 order-1">
  	    <icon :label="ability.type" :class="'text-' + ability.type" class="w-4 h-4"></icon>
	    </div>
      <era-stage :label="ability.era" class="mt-2 order-3"></era-stage>
  </div>
  <div v-else class="ability disabled">
    No valid event for "{{ instance }}".
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import Icon from "./icon.vue";
import EraStage from "./era-stage.vue";
import FactorValue from "./factor-value.vue";
import SymbioticAbility from "./symbiotic-ability.vue";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "enabled-ability",
  props: {
    instance: String
  },
  store,
  components: {
    Icon,
    EraStage,
    FactorValue,
    SymbioticAbility,
    EmotionDiagram
  },
  computed: {
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
      return this.calculateFactors(this.slotEvent);
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
      return this.getAbilityDependants(this.abilityLabel);
    },
    event: function() {
      return this.getEventOfType(this.instance, "ability", "instance");
    },
    slotEvent: function() {
      return this.getEventOfType(this.instance, "slot", "instance");
    },
    socket: function() {
      return this.getSocketForSlot(this.slotEvent.label);
    },
    treeMatch: function() {
      return this.ability.type === this.socket.type;
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "calculateFactors",
      "getEra",
      "getEventOfType",
      "getEventObjects",
      "getStage",
      "getAbility",
      "getAbilityDependants",
      "hasValidSlotEvents",
      "getSocketForSlot",
      "prettyUnit"
    ])
  },
  methods: {
    clearSlotEvent: function() {
      this.addSlotEvent({
        label: this.slotEvent.label,
        ability: this.slotEvent.ability,
        instance: ""
      });
    },
    ...mapActions(["addSlotEvent"])
  }
};
</script>

<style lang="scss">
@import "../scss/$variables";

.enabled-ability {
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

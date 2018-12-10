<docs>
### Enabled ability
The enabled ability is an ability that is currently enabled within a socket.

##### Properties
- `label` — A label referring to an ability in the global store. Determining whether the ability is displayed is whether a corresponding valid event exists. 

##### Instantiation
`<enabled-ability label="ability-label"></enabled-ability>`
</docs>

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
      return this.getEventOfType(this.instance, "ability", "instance");
    },
    slotEvent: function() {
      return this.getEventOfType(this.instance, "slot", "instance");
    },
    socket: function() {
      return this.getSocketForSlot(this.slotEvent.label);
    },
    treeMatch: function() {
      return this.ability.tree === this.socket.tree;
    },
    ...mapState({
      abilities: state => state.abilities.list
    }),
    ...mapGetters([
      "getFactors",
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

<template>
  <div
    v-if="event && slotEvent"
    class="enabled-ability bg-tile-overlay hexagon w-48 h-hex*48 px-2 py-6 flex flex-col justify-between items-center"
    :class="[('bg-' + ability.tree), { 'tree-match': treeMatch }]"
  >
      <div class="flex justify-between items-center w-full order-2">
        <div
          class="w-24 h-24 rounded-full inline-flex flex-no-shrink items-center justify-center order-2"
          :class="['bg-' + ability.tree + '-25']"
        >
          <icon
            class="w-16 h-16 text-light"
            :label="abilityLabel"
          ></icon>
        </div>
        <div class="w-8 flex-no-shrink outputs order-1 ml-px">
          <symbiotic-ability
            v-for="(value, dependency, index) in dependencies"
            class="border-2"
            :class="['border-' + (hasValidSlotEvents(dependency)? 'sky': 'light'), { 'mt-1': (index > 0) }]"
            :key="dependency"
            :label="dependency"
          ></symbiotic-ability>
        </div>
        <div class="w-8 flex-no-shrink outputs order-3 mr-px">
          <symbiotic-ability
             v-for="(value, dependant, index) in dependants"
            :class="['bg-' + (hasValidSlotEvents(dependant)? 'sky': 'grey-50'), { 'mt-1': (index > 0) }]"
            :key="dependant"
            :label="dependant"
          ></symbiotic-ability>
        </div>
      </div>
      <div
        class="w-8 h-8 rounded-full inline-flex items-center justify-center mb-2 order-1"
        :class="['bg-' + (treeMatch? ability.type: 'grey') + '-25']"
      >
        <icon
          class="w-4 h-4"
          :label="ability.type"
          :class="'text-' + ability.type"
        ></icon>
      </div>
      <era-stage
        :label="ability.era"
        class="mt-2 w-2 order-3"
      ></era-stage>
  </div>
  <div
    v-else
    class="ability disabled"
  >
    {{ $t("No valid event for “{instance}”.", {instance: instance}) }}
  </div>
</template>

<style lang="scss">
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

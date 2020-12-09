<docs>
### Ability researchable
Displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-researchable label.string="ability-label"></ability-researchable>`
</docs>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash-es";

import AbilityResearch from "./ability-research";

export default {
  name: "ability-researchable",

  components: {
    AbilityResearch,
  },
  props: {
    id: String,
  },
  data: () => ({
    showModal: false,
  }),
  computed: {
    ability() {
      return this.getAbility(this.id);
    },
    affordability() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable() {
      return this.affordability === 100;
    },
    costs() {
      return this.getAbilityCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    newEvent() {
      return {
        type: "ability",
        label: this.label,
        target: false,
        emotions: this.emotions,
      };
    },
    ...mapState(["abilities"]),
    ...mapGetters({
      // "getEventsOfType",
      getAbility: "inventory/getAbility",
      // "getAbilityCosts",
      // "getScores",
      // "getIsEraActive",
    }),
  },
  methods: {
    open() {
      this.showModal = true;
    },
    close() {
      this.showModal = false;
    },
    ...mapActions(["addAbilityEvent"]),
  },
};
</script>

<template>
  <button
    v-if="ability"
    class="ability-researchable button bg-sky text-light text-left text-xs px-3 py-px relative w-full"
    :class="{ 'cursor-wait': !affordable }"
    :disabled="!affordable"
    @click="open()"
  >
    <!--span
      class="absolute block inset-0 h-full bg-sky bg-opacity-50 rounded z-0"
       :style="{width: affordability + '%'}"
    ></span-->
    <span class="relative z-10">
      {{ $t("Research") }} <br />
      <span
        class="font-bold filter-grayscale"
        v-format:confidence="costs.confidence"
      />
    </span>
    <portal to="modals" v-if="showModal">
      <ability-research :label="label" @close="close()" />
    </portal>
  </button>
</template>

<style lang="scss">
@import "../styles/util";
</style>

<docs>
### Ability researchable
Displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-researchable label.string="ability-label"></ability-researchable>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ability-researchable',
  store,
  props: {
    label: String,
  },
  data: () => ({
    show: false,
  }),
  computed: {
    ability() {
      return this.getAbility(this.label);
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
        type: 'ability',
        label: this.label,
        target: false,
        emotions: this.emotions,
      };
    },
    ...mapState(['abilities']),
    ...mapGetters([
      'getEventsOfType',
      'getAbility',
      'getAbilityCosts',
      'getScores',
      'getIsEraActive',
    ]),
  },
  methods: {
    research() {
      this.setInteraction({
        interaction: 'research',
        label: this.label,
      });
    },
    ...mapActions(['addAbilityEvent', 'setInteraction', 'resetInteraction']),
  },
};
</script>

<template>
  <button
    v-if="ability"
    class="ability-researchable button bg-sky text-light text-left text-xs px-3 py-px relative w-full"
    :class="{ 'cursor-wait': !affordable }"
    :disabled="!affordable"
    @click="research()"
  >
    <!--span
      class="absolute block pin h-full bg-sky-50 rounded z-0"
       :style="{width: affordability + '%'}"
    ></span-->
    <span class="relative z-10">
      {{ $t('Research') }} <br />
      <span class="font-bold filter-grayscale">{{
        costs.confidence | confidence
      }}</span>
    </span>
  </button>
</template>

<style lang="scss"></style>

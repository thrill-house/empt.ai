<docs>
### Ability research
Displays a modal dialog for researching an ability.

##### Instantiation
`<ability-research></ability-research>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilityDialog from './ability-dialog';
import EmotionDiagram from './emotion-diagram';

export default {
  name: 'ability-research',
  store,
  components: {
    AbilityDialog,
    EmotionDiagram,
  },
  props: {
    label: String,
  },
  data: () => ({
    emotions: {
      excitement: 0,
      happiness: 0,
      tenderness: 0,
      fear: 0,
      sadness: 0,
      anger: 0,
    },
    complements: {
      excitement: 'fear',
      happiness: 'sadness',
      tenderness: 'anger',
      fear: 'excitement',
      sadness: 'happiness',
      anger: 'tenderness',
    },
    sides: {
      excitement: 1,
      happiness: 1,
      tenderness: 1,
      fear: -1,
      sadness: -1,
      anger: -1,
    },
    requiredEmotions: 4,
  }),
  computed: {
    ability() {
      return this.getAbility(this.label);
    },
    sumEmotions() {
      return _.sum(_.values(this.emotions));
    },
    enoughEmotions() {
      return this.sumEmotions === this.requiredEmotions;
    },
    maxEmotion() {
      return _.max(_.values(this.emotions));
    },
    maximums() {
      return this.getMaxEmotions(this.emotions);
    },
    emotionProfile() {
      return this.getEmotions();
    },
    emotionalPreview() {
      return _.mergeWith(
        { color: 'sky' },
        this.emotionProfile,
        this.emotions,
        _.add
      );
    },
    emotionValues() {
      return [
        this.emotionalPreview,
        _.merge({ color: 'light' }, this.emotionProfile),
      ];
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
    submittable() {
      return this.affordable && this.enoughEmotions;
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
      'getEmotions',
      'getIsEraActive',
    ]),
  },
  methods: {
    adjust(emotion, amount) {
      let complement = this.getComplement(emotion);

      if (
        !this.isEmotionValue(complement) &&
        this.isEmotionAdjustable(emotion, amount)
      ) {
        this.emotions[emotion] += amount;
      } else if (this.isEmotionAdjustable(complement, amount * -1)) {
        this.adjust(complement, amount * -1);
      }
    },
    confirm() {
      if (this.sumEmotions === this.requiredEmotions) {
        let event = _.defaults(this.newEvent, {
          instance: `${this.label}-${_.now()}`,
        });

        this.addAbilityEvent(event);
        this.cancel();
      } else {
        alert('Fill in all emotions');
      }
    },
    resetEmotions() {
      this.emotions = _.mapValues(this.emotions, () => 0);
    },
    cancel() {
      //this.dialog = false;
      this.$emit('close');
      this.resetEmotions();
    },
    getComplement(emotion) {
      return this.complements[emotion];
    },
    getMaxEmotion(emotion) {
      let value = this.emotions[emotion],
        complement = this.emotions[this.complements[emotion]];

      return complement > 0
        ? 0
        : value === this.requiredEmotions / 2 ||
          (this.sumEmotions - value <= this.requiredEmotions / 2 &&
            this.maxEmotion < this.requiredEmotions / 2)
        ? this.requiredEmotions / 2
        : 1;
    },
    getMaxEmotions(emotions) {
      let self = this;

      return _.mapValues(emotions, function(value, emotion) {
        return self.getMaxEmotion(emotion);
      });
    },
    emotionSide(emotion) {
      return this.sides[emotion];
    },
    isEmotionMax(emotion) {
      return this.emotions[emotion] === this.maximums[emotion];
    },
    isEmotionMin(emotion) {
      return this.emotions[emotion] === 0;
    },
    isEmotionInRange(emotion) {
      return (
        this.emotions[emotion] >= 0 &&
        this.emotions[emotion] <= this.maximums[emotion]
      );
    },
    isEmotionIncrementable(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMax(emotion);
    },
    isEmotionDecrementable(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMin(emotion);
    },
    isEmotionAdjustable(emotion, amount) {
      return (
        (amount > 0 && this.isEmotionIncrementable(emotion)) ||
        (amount < 0 && this.isEmotionDecrementable(emotion))
      );
    },
    isEmotionValue(emotion) {
      return this.isEmotionDecrementable(emotion);
    },
    ...mapActions(['addAbilityEvent']),
  },
};
</script>

<template>
  <ability-dialog class="ability-research" :label="label" :costs="costs">
    <span
      slot="researchToggle"
      class="button text-lg uppercase font-bold px-4 py-2 text-navy bg-light"
      >{{ $t('Researching') }}</span
    >

    <button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      slot="confirm"
      :disabled="!submittable"
      :class="{ 'opacity-10': !submittable }"
      @click="confirm()"
    >
      {{ $t('Research') }}
    </button>

    <button
      class="button uppercase bg-blue px-4 py-2 font-bold text-light"
      slot="cancel"
      @click="cancel()"
    >
      {{ $t('Cancel') }}
    </button>

    <template slot="emotions">
      <emotion-diagram
        class="w-64 h-64"
        :values="emotionValues"
        :labels="false"
      >
        <span
          v-for="(value, emotion) in emotions"
          class="inline-flex"
          :key="emotion"
          :slot="emotion"
          :class="[emotionSide(emotion) > 0 ? 'order-first mr-1' : 'ml-1']"
        >
          <button
            class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-l-full border-r border-navy"
            @click="adjust(emotion, emotionSide(emotion) * -1)"
          >
            ❮
          </button>
          <button
            class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-r-full"
            @click="adjust(emotion, emotionSide(emotion))"
          >
            ❯
          </button>
        </span>
      </emotion-diagram>
    </template>

    <template slot="buttons">
      <emotion-diagram
        class="m-1 w-24 h-24 border border-light"
        :values="emotions"
        :scale.number="2"
      ></emotion-diagram>
    </template>
  </ability-dialog>
</template>

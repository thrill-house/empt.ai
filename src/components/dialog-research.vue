<docs>
### Dialog research
Displays a modal dialog for researching an ability.

##### Instantiation
`<dialog-research label="ability-label" emotions="{}" costs="{}"></dialog-research>`
</docs>

<template>
  <ability-dialog
    :label="label"
    :emotions="emotions"
    :costs="costs"
    :show="show"
  >
    <span
      slot="researchToggle"
      class="button text-lg uppercase font-bold px-4 py-2 text-navy bg-light"
    >{{ $t('Research') }}</span>
    <button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      slot="submit"
      :disabled="!submittable"
      :class="{ 'opacity-10': !submittable }"
      @click="$parent.$emit('confirm')"
    >{{ $t('Research') }}</button>

    <!--button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      :disabled="sumEmotions !== requiredEmotions"
      :class="{ 'opacity-10': sumEmotions !== requiredEmotions }"
      @click="engageResearch(label)"
    >{{ $t('Confirm') }}</button-->

    <template slot="emotions">
      <emotion-diagram
        class="w-64 h-64"
        :values="emotions"
        :hideLabels="false"
        :scale="2"
      >
        <span
          v-for="(value, emotion) in emotions"
          class="inline-flex"
          :key="emotion"
          :slot="emotion"
          :class="[ emotionSide(emotion) > 0? 'order-first mr-1': 'ml-1' ]"
        >
          <button
            class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-l-full border-r border-navy"
            @click="adjust(emotion, emotionSide(emotion) * -1)"
          >❮</button>
          <button
            class="bg-light text-navy p-px text-2xs text-center h-3 w-3 block font-bold uppercase rounded-r-full"
            @click="adjust(emotion, emotionSide(emotion))"
          >❯</button>
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

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import AbilityDialog from "./ability-dialog";
import EmotionDiagram from "./emotion-diagram";

export default {
  name: "dialog-research",
  store,
  components: {
    AbilityDialog,
    EmotionDiagram
  },
  data: () => ({
    emotions: {
      excitement: 0,
      happiness: 0,
      tenderness: 0,
      fear: 0,
      sadness: 0,
      anger: 0
    },
    complements: {
      excitement: "fear",
      happiness: "sadness",
      tenderness: "anger",
      fear: "excitement",
      sadness: "happiness",
      anger: "tenderness"
    },
    sides: {
      excitement: 1,
      happiness: 1,
      tenderness: 1,
      fear: -1,
      sadness: -1,
      anger: -1
    },
    requiredEmotions: 4
  }),
  computed: {
    label: function() {
      return this.getInteraction("research").label;
    },
    show: function() {
      return this.label !== false;
    },
    ability: function() {
      return this.getAbility(this.label);
    },
    sumEmotions: function() {
      return _.sum(_.values(this.emotions));
    },
    enoughEmotions: function() {
      return this.sumEmotions === this.requiredEmotions;
    },
    maxEmotion: function() {
      return _.max(_.values(this.emotions));
    },
    maximums: function() {
      return this.getMaxEmotions(this.emotions);
    },
    affordability: function() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getAbilityCosts(this.newEvent);
    },
    scores: function() {
      return this.getScores();
    },
    submittable: () => {
      return this.affordable && this.enoughEmotions;
    },
    newEvent: function() {
      return {
        type: "ability",
        label: this.label,
        target: false,
        emotions: this.emotions
      };
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getEventsOfType",
      "getAbility",
      "getAbilityCosts",
      "getScores",
      "isEraActive",
      "getInteraction"
    ])
  },
  methods: {
    open: label => {
      this.label = label;
      this.show = true;
    },
    close: () => {
      this.label = "";
      this.show = false;
    },
    adjust: function(emotion, amount) {
      var complement = this.getComplement(emotion);

      if (
        !this.isEmotionValue(complement) &&
        this.isEmotionAdjustable(emotion, amount)
      ) {
        this.emotions[emotion] += amount;
      } else if (this.isEmotionAdjustable(complement, amount * -1)) {
        this.adjust(complement, amount * -1);
      }
    },
    startResearching: function() {
      this.dialog = true;
      this.setInteraction({
        interaction: "researchingAbility",
        label: this.label,
        ability: this.getAbility(this.label)
      });
    },
    endResearching: function() {
      this.dialog = false;
      this.resetInteraction("researchingAbility");
    },
    engageResearch: function(label) {
      if (this.sumEmotions === this.requiredEmotions) {
        var event = _.defaults(this.newEvent, {
          instance: this.label + "-" + _.now()
        });

        this.dialog = false;
        this.emotions = _.mapValues(this.emotions, () => 0);

        this.addAbilityEvent(event);

        this.endResearching();
        this.setInteraction({
          interaction: "slottingAbility",
          label: label,
          ability: this.getAbility(label),
          instance: event.instance
        });
      } else {
        alert("Fill in all emotions");
      }
    },
    getComplement: function(emotion) {
      return this.complements[emotion];
    },
    getMaxEmotion: function(emotion) {
      var value = this.emotions[emotion],
        complement = this.emotions[this.complements[emotion]];

      return complement > 0
        ? 0
        : value == this.requiredEmotions / 2 ||
          (this.sumEmotions - value <= this.requiredEmotions / 2 &&
            this.maxEmotion < this.requiredEmotions / 2)
          ? this.requiredEmotions / 2
          : 1;
    },
    getMaxEmotions: function(emotions) {
      var self = this;

      return _.mapValues(emotions, function(value, emotion) {
        return self.getMaxEmotion(emotion);
      });
    },
    emotionSide: function(emotion) {
      return this.sides[emotion];
    },
    isEmotionMax: function(emotion) {
      return this.emotions[emotion] === this.maximums[emotion];
    },
    isEmotionMin: function(emotion) {
      return this.emotions[emotion] === 0;
    },
    isEmotionInRange: function(emotion) {
      return (
        this.emotions[emotion] >= 0 &&
        this.emotions[emotion] <= this.maximums[emotion]
      );
    },
    isEmotionIncrementable: function(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMax(emotion);
    },
    isEmotionDecrementable: function(emotion) {
      return this.isEmotionInRange(emotion) && !this.isEmotionMin(emotion);
    },
    isEmotionAdjustable: function(emotion, amount) {
      return (
        (amount > 0 && this.isEmotionIncrementable(emotion)) ||
        (amount < 0 && this.isEmotionDecrementable(emotion))
      );
    },
    isEmotionValue: function(emotion) {
      return this.isEmotionDecrementable(emotion);
    },
    ...mapActions(["addAbilityEvent", "setInteraction", "resetInteraction"])
  }
};
</script>

<style lang="scss">
.research-ability {
  .emotions {
    @apply .relative .block;

    .emotion-diagram {
      @apply .absolute .pin .w-full .h-full;
    }

    .axis {
      @apply .absolute .-mt-1;
      left: 50%;
      top: 50%;
      transform-origin: center left;

      &.axis-excitement {
        transform: rotate(90deg - 30deg);
      }

      &.axis-happiness {
        transform: rotate(90deg - 90deg);
      }

      &.axis-tenderness {
        transform: rotate(90deg - 150deg);
      }

      &.axis-fear {
        transform: rotate(90deg - 210deg);
      }

      &.axis-sadness {
        transform: rotate(90deg - 270deg);
      }

      &.axis-anger {
        transform: rotate(90deg - 330deg);
      }

      input {
        @apply .block .w-full .h-2 .rounded-full .bg-dark .opacity-25;
        -webkit-appearance: none;

        &:focus {
          outline: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        &::-ms-track {
          @apply .w-full .cursor-pointer .bg-transparent .text-transparent .border-transparent;
        }

        @mixin thumb {
          @apply .bg-transparent .h-4 .w-4 .rounded-full .cursor-pointer;
        }

        &::-webkit-slider-thumb {
          @include thumb;
        }

        &::-moz-range-thumb {
          @include thumb;
        }

        &::-ms-thumb {
          @include thumb;
        }

        &.max-1 {
          @apply .w-1/2;
        }

        &.max-0 {
          @apply .w-4;
        }
      }

      label {
        @apply .absolute .pin-b .pin-r .mb-2 .-mr-4 .text-xs;
        transform-origin: bottom right;
        transform: scale(0.75);
      }
    }
  }
}
</style>

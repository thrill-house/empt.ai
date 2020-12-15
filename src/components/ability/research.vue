<script>
import { mapState, mapGetters, mapActions } from "vuex";
import {
  add,
  capitalize,
  clamp,
  mapValues,
  max,
  merge,
  mergeWith,
  reduce,
  sum,
  values,
} from "lodash-es";

import EmotionDiagram from "../emotion/diagram";
import UtilDialog from "../util/dialog";

export default {
  name: "ability-research",
  components: {
    UtilDialog,
    EmotionDiagram,
  },
  inject: ["id", "ability", "title"],
  data: () => ({
    researching: false,
    emotions: {
      happiness: 0,
      sadness: 0,
      tenderness: 0,
      anger: 0,
      excitement: 0,
      fear: 0,
    },
    complements: {
      happiness: "sadness",
      sadness: "happiness",
      tenderness: "anger",
      anger: "tenderness",
      excitement: "fear",
      fear: "excitement",
    },
    requiredEmotions: 4,
  }),
  computed: {
    researchCost() {
      return this.getAbilityConfidenceCosts(this.id);
    },
    sumEmotions() {
      return sum(values(this.emotions));
    },
    enoughEmotions() {
      return this.sumEmotions === this.requiredEmotions;
    },
    maxEmotion() {
      return max(values(this.emotions));
    },
    maximums() {
      return this.getMaxEmotions(this.emotions);
    },
    emotionProfile() {
      return this.feelings;
    },
    emotionalPreview() {
      return mergeWith(
        { color: "sky" },
        this.emotionProfile,
        this.emotions,
        add
      );
    },
    emotionValues() {
      return [
        this.emotionalPreview,
        merge({ color: "light" }, this.emotionProfile),
      ];
    },
    affordability() {
      return clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable() {
      return this.affordability === 100;
    },
    costs() {
      return this.getAbilityConfidenceCosts(this.id);
    },
    scores() {
      return { data: 0, confidence: 0 };
    },
    submittable() {
      return this.affordable && this.enoughEmotions;
    },
    ...mapState(["gameId"]),
    ...mapGetters({
      getAbilityConfidenceCosts: "inventory/abilityConfidenceCosts",
      feelings: "score/feelings",
      getEmotionByTitle: "labels/emotionByTitle",
    }),
  },
  methods: {
    showDialog() {
      this.$refs?.dialog?.show();
    },
    cancelDialog() {
      this.$refs?.dialog?.close();
      this.resetEmotions();
    },
    async research() {
      this.researching = true;

      const payload = {
        gameId: this.gameId,
        abilityId: this.id,
        feelings: reduce(
          this.emotions,
          (accum, emotion, label) => {
            if (emotion > 0) {
              accum.push({
                emotionId: this.getEmotionByTitle(capitalize(label))?.$id,
                value: emotion,
              });
            }

            return accum;
          },
          []
        ),
      };

      this.cancelDialog();

      await this.researchModel(payload);

      this.researching = false;
    },
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
    resetEmotions() {
      this.emotions = mapValues(this.emotions, () => 0);
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
      return mapValues(emotions, function (value, emotion) {
        return self.getMaxEmotion(emotion);
      });
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
    //   ...mapActions(["addAbilityEvent"]),
    ...mapActions({
      researchModel: "Game/Models/create",
    }),
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    v-bem:trigger.confidence="{ researching }"
    v-format:confidence="researchCost"
    :title="researching ? $t('Researching') : $t('Research')"
    :disabled="researching"
    @click="showDialog()"
  />
  <util-dialog ref="dialog">
    <template v-slot:title>
      {{ $t("Researching a new {title} model", { title }) }}
    </template>
    <template v-slot:default>
      <div v-bem:emotions>
        <emotion-diagram v-bem:emotionsModel :values="emotions" :scale="2">
          <template
            v-for="(value, emotion) in emotions"
            v-slot:[emotion]
            :key="emotion"
          >
            <button
              v-bem:emotionsModelTrigger.increment
              @click="adjust(emotion, 1)"
            >
              ＋
            </button>
          </template>
        </emotion-diagram>

        <!-- <emotion-diagram
          v-bem:emotionsPreview
          :values="emotionValues"
          :labels="false"
        /> -->
      </div>

      <div v-bem:actions>
        <button
          v-bem:actionsButton.confirm="{ valid }"
          @click="research"
          :disabled="!submittable"
        >
          {{ $t("Research") }}
        </button>
        <button v-bem:actionsButton.cancel @click="cancelDialog">
          {{ $t("Cancel") }}
        </button>
      </div>
    </template>
  </util-dialog>
</template>

<style lang="scss">
@import "../../styles/components";
@import "../../styles/mixins";

.ability-research {
  &__trigger {
    @apply button button-xs button-title button-icon;
    @apply w-1/2 ml-px;

    &::before {
      @apply bg-confidence;
    }

    @include icons("::before", confidence);

    &--researching {
      @apply bg-opacity-50;

      &::before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }
  }

  &__emotions {
    @apply self-center;

    &-model {
      @apply w-96 h-96;

      &-trigger {
        @apply flex items-center justify-center;
        @apply h-4 w-4;
        @apply text-xl font-bold uppercase;
        @apply leading-4;
        @apply bg-light text-navy;
        @apply rounded-full;
      }
    }

    // &-preview {
    //   @apply w-64 h-64;
    // }
  }

  &__actions {
    @apply flex flex-row-reverse;
    @apply self-end;
    @apply mt-8;

    &-button {
      @apply button;

      &--confirm {
        @apply button-lg button-confirm;
        @apply ml-2;
      }

      &--cancel {
        @apply button-cancel;
      }
    }
  }
}
</style>

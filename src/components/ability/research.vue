<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { mapValues, max, reduce, sum, values } from "lodash-es";

import EmotionDiagram from "../emotion/diagram";
import UtilDialog from "../util/dialog";
import UtilProgress from "../util/progress";

export default {
  name: "ability-research",
  components: {
    EmotionDiagram,
    UtilDialog,
    UtilProgress,
  },
  inject: ["id", "ability", "title"],
  data: () => ({
    loading: false,
    open: false,
    affordable: false,
    emotions: {
      Happiness: 0,
      Sadness: 0,
      Tenderness: 0,
      Anger: 0,
      Excitement: 0,
      Fear: 0,
    },
    complements: {
      Happiness: "Sadness",
      Sadness: "Happiness",
      Tenderness: "Anger",
      Anger: "Tenderness",
      Excitement: "Fear",
      Fear: "Excitement",
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
    feelings() {
      return reduce(
        this.emotions,
        (accum, emotion, label) => {
          if (emotion > 0) {
            accum.push({
              emotionId: this.getEmotionByTitle(label)?.$id,
              value: emotion,
            });
          }

          return accum;
        },
        []
      );
    },
    cost() {
      return Math.abs(this.researchCost);
    },
    submittable() {
      return this.affordable && this.enoughEmotions;
    },
    ...mapState(["gameId"]),
    ...mapGetters({
      getAbilityConfidenceCosts: "inventory/abilityConfidenceCosts",
      getEmotionByTitle: "labels/emotionByTitle",
    }),
  },
  methods: {
    showDialog() {
      this.open = true;
    },
    cancelDialog() {
      this.open = false;
      this.resetEmotions();
    },
    updateAffordability(payload) {
      this.affordable = payload;
    },
    async research() {
      this.loading = true;

      const payload = {
        gameId: this.gameId,
        abilityId: this.id,
        feelings: this.feelings,
      };

      this.cancelDialog();

      await this.researchModel(payload);

      this.loading = false;
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
    ...mapActions({
      researchModel: "Game/Models/create",
    }),
  },
};
</script>

<template>
  <div v-bem>
    <button
      v-bind="$attrs"
      v-bem:trigger.confidence="{ loading }"
      v-format:confidence="researchCost"
      :title="!loading ? $t('Research') : $t('Researching')"
      :disabled="loading || !affordable"
      @click="showDialog()"
    />
    <util-progress
      v-bem:affordability
      :cost="cost"
      resource="confidence"
      @updateAffordability="updateAffordability"
    />
  </div>
  <util-dialog :open="open" ref="dialog">
    <template v-slot:title>
      {{ $t("Researching a new {title} model", { title }) }}
    </template>
    <template v-slot:default>
      <div v-bem:emotions>
        <emotion-diagram v-bem:emotionsModel :sets="feelings" :scale="2">
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
      </div>

      <div v-bem:actions>
        <button
          v-bem:actionsButton.confirm
          :disabled="!submittable"
          @click="research()"
        >
          {{ $t("Research") }}
        </button>
        <button v-bem:actionsButton.cancel @click="cancelDialog()">
          {{ $t("Cancel") }}
        </button>
      </div>
    </template>
  </util-dialog>
</template>

<style lang="scss">
@import "../../styles/helper";

.ability-research {
  @apply relative;
  @apply w-1/2 ml-px;
  @apply clip-corners;

  &__trigger {
    @apply button button-xs button-title button-icon;
    @apply w-full;

    &::before {
      @apply bg-confidence;
    }

    @include icons("::before", confidence);

    &--loading {
      @apply bg-opacity-50;

      &::before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }
  }

  &__affordability {
    @apply absolute;
    @apply inset-x-1 bottom-0;
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

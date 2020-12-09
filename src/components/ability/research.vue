<script>
import { mapGetters } from "vuex";
// import _ from "lodash-es";

// import AbilityDialog from "./ability-dialog";
// import EmotionDiagram from "./emotion/diagram";
import UtilDialog from "../util/dialog";

export default {
  name: "ability-research",
  components: {
    UtilDialog,
    // AbilityDialog,
    // EmotionDiagram,
  },
  // props: {
  //   label: String,
  // },
  inject: ["id", "ability", "title"],
  data() {
    return {
      dialog: false,
      dialogRef: null,
      emotions: {
        excitement: 0,
        happiness: 0,
        tenderness: 0,
        fear: 0,
        sadness: 0,
        anger: 0,
      },
      complements: {
        excitement: "fear",
        happiness: "sadness",
        tenderness: "anger",
        fear: "excitement",
        sadness: "happiness",
        anger: "tenderness",
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
    };
  },
  computed: {
    researchCost() {
      return this.getAbilityConfidenceCosts(this.id);
    },
    // ability() {
    //   return this.getAbility(this.label);
    // },
    // sumEmotions() {
    //   return _.sum(_.values(this.emotions));
    // },
    // enoughEmotions() {
    //   return this.sumEmotions === this.requiredEmotions;
    // },
    // maxEmotion() {
    //   return _.max(_.values(this.emotions));
    // },
    // maximums() {
    //   return this.getMaxEmotions(this.emotions);
    // },
    // emotionProfile() {
    //   return this.getEmotions();
    // },
    // emotionalPreview() {
    //   return _.mergeWith(
    //     { color: "sky" },
    //     this.emotionProfile,
    //     this.emotions,
    //     _.add
    //   );
    // },
    // emotionValues() {
    //   return [
    //     this.emotionalPreview,
    //     _.merge({ color: "light" }, this.emotionProfile),
    //   ];
    // },
    // affordability() {
    //   return _.clamp(
    //     (this.scores.confidence / this.costs.confidence) * 100,
    //     0,
    //     100
    //   );
    // },
    // affordable() {
    //   return this.affordability === 100;
    // },
    // costs() {
    //   return this.getAbilityCosts(this.newEvent);
    // },
    // scores() {
    //   return this.getScores();
    // },
    // submittable() {
    //   return this.affordable && this.enoughEmotions;
    // },
    // newEvent() {
    //   return {
    //     type: "ability",
    //     label: this.label,
    //     target: false,
    //     emotions: this.emotions,
    //   };
    // },
    // ...mapState(["abilities"]),
    // ...mapGetters([
    //   "getEventsOfType",
    //   "getAbility",
    //   "getAbilityCosts",
    //   "getScores",
    //   "getEmotions",
    //   "getIsEraActive",
    // ]),
    ...mapGetters({
      getAbilityConfidenceCosts: "inventory/getAbilityConfidenceCosts",
    }),
  },
  methods: {
    setDialogRef(el) {
      this.dialogRef = el;
    },
    showDialog() {
      this.dialog = true;
      // this.$refs.dialog.$el.showModal();
    },
    cancelDialog() {
      this.dialog = false;
      // this.$refs.dialog.$el.close();
      // this.resetEmotions();
    },
    //   adjust(emotion, amount) {
    //     let complement = this.getComplement(emotion);
    //     if (
    //       !this.isEmotionValue(complement) &&
    //       this.isEmotionAdjustable(emotion, amount)
    //     ) {
    //       this.emotions[emotion] += amount;
    //     } else if (this.isEmotionAdjustable(complement, amount * -1)) {
    //       this.adjust(complement, amount * -1);
    //     }
    //   },
    //   confirm() {
    //     if (this.sumEmotions === this.requiredEmotions) {
    //       let event = _.defaults(this.newEvent, {
    //         instance: `${this.label}-${_.now()}`,
    //       });
    //       this.addAbilityEvent(event);
    //       this.cancel();
    //     } else {
    //       alert("Fill in all emotions");
    //     }
    //   },
    //   resetEmotions() {
    //     this.emotions = _.mapValues(this.emotions, () => 0);
    //   },
    //   cancel() {
    //     //this.dialog = false;
    //     this.$emit("close");
    //     this.resetEmotions();
    //   },
    //   getComplement(emotion) {
    //     return this.complements[emotion];
    //   },
    //   getMaxEmotion(emotion) {
    //     let value = this.emotions[emotion],
    //       complement = this.emotions[this.complements[emotion]];
    //     return complement > 0
    //       ? 0
    //       : value === this.requiredEmotions / 2 ||
    //         (this.sumEmotions - value <= this.requiredEmotions / 2 &&
    //           this.maxEmotion < this.requiredEmotions / 2)
    //       ? this.requiredEmotions / 2
    //       : 1;
    //   },
    //   getMaxEmotions(emotions) {
    //     let self = this;
    //     return _.mapValues(emotions, function (value, emotion) {
    //       return self.getMaxEmotion(emotion);
    //     });
    //   },
    //   emotionSide(emotion) {
    //     return this.sides[emotion];
    //   },
    //   isEmotionMax(emotion) {
    //     return this.emotions[emotion] === this.maximums[emotion];
    //   },
    //   isEmotionMin(emotion) {
    //     return this.emotions[emotion] === 0;
    //   },
    //   isEmotionInRange(emotion) {
    //     return (
    //       this.emotions[emotion] >= 0 &&
    //       this.emotions[emotion] <= this.maximums[emotion]
    //     );
    //   },
    //   isEmotionIncrementable(emotion) {
    //     return this.isEmotionInRange(emotion) && !this.isEmotionMax(emotion);
    //   },
    //   isEmotionDecrementable(emotion) {
    //     return this.isEmotionInRange(emotion) && !this.isEmotionMin(emotion);
    //   },
    //   isEmotionAdjustable(emotion, amount) {
    //     return (
    //       (amount > 0 && this.isEmotionIncrementable(emotion)) ||
    //       (amount < 0 && this.isEmotionDecrementable(emotion))
    //     );
    //   },
    //   isEmotionValue(emotion) {
    //     return this.isEmotionDecrementable(emotion);
    //   },
    //   ...mapActions(["addAbilityEvent"]),
  },
  watch: {
    dialogRef(dialog) {
      dialog.$el.showModal();
    },
  },
};
</script>

<template>
  <button
    v-bind="$attrs"
    v-bem:trigger.confidence
    v-format:confidence="researchCost"
    :title="$t('Research')"
    @click="showDialog()"
  />
  <teleport to="#app" v-if="dialog">
    <util-dialog :ref="setDialogRef" tag="dialog" v-if="dialog" v-bem:dialog>
      <template v-slot:title>
        {{ $t("Researching a new {title} model", { title }) }}
      </template>
    </util-dialog>
  </teleport>
  <!-- <ability-dialog class="ability-research" :label="label" :costs="costs">
    <span
      class="button text-lg uppercase font-bold px-4 py-2 text-navy bg-light"
    >
      <slot name="researchToggle">
        {{ $t("Researching") }}
      </slot>
    </span>

    <button
      class="button uppercase bg-sky px-4 py-2 mb-4 font-bold text-light"
      :disabled="!submittable"
      :class="{ 'opacity-10': !submittable }"
      @click="confirm()"
    >
      <slot name="confirm">
        {{ $t("Research") }}
      </slot>
    </button>

    <button
      class="button uppercase bg-blue px-4 py-2 font-bold text-light"
      @click="cancel()"
    >
      <slot name="cancel">
        {{ $t("Cancel") }}
      </slot>
    </button>

    <template v-slot:emotions>
      <emotion-diagram
        class="w-64 h-64"
        :values="emotionValues"
        :labels="false"
      >
        <span
          v-for="(value, emotion) in emotions"
          class="inline-flex"
          :key="emotion"
          :class="[emotionSide(emotion) > 0 ? 'order-first mr-1' : 'ml-1']"
        >
          <slot :name="emotion">
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
          </slot>
        </span>
      </emotion-diagram>
    </template>

    <template v-slot:buttons>
      <emotion-diagram
        class="m-1 w-24 h-24 border border-light"
        :values="emotions"
        :scale="2"
      ></emotion-diagram>
    </template>
  </ability-dialog> -->
</template>

<style lang="scss">
@import "../../styles/util";

.ability-research {
  &__trigger {
    @extend %button;
    @extend %button-title;
    @extend %button-icon;

    @apply w-1/2 ml-px;

    &::before {
      @apply bg-confidence;
    }

    @include icons("::before", confidence);
  }
}
</style>

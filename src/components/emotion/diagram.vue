<script>
import { each, has, head, join, map, max, pick, transform } from "lodash-es";

import EmotionValues from "./values";

export default {
  name: "emotion-diagram",

  components: {
    EmotionValues,
  },
  props: {
    sets: {
      type: Array,
      default: () => [[]],
    },
    scale: Number,
    color: {
      type: String,
      default: "light",
    },
    labels: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      calculateRatio: this.calculateRatio,
      createPairs: this.createPairs,
      createCoordinates: this.createCoordinates,
      joinCoordinates: this.joinCoordinates,
    };
  },
  computed: {
    setsList() {
      return has(head(this.sets), "emotionId") ? [this.sets] : this.sets;
    },
    maxAll() {
      return map(this.setsList, (set) => max(map(set, "value")));
    },
    max() {
      return max(this.maxAll) || 1;
    },
    maxScale() {
      return this.scale || this.max || 1;
    },
    axisPositions() {
      return {
        Excitement: this.calculateRatio(this.maxScale, 30),
        Happiness: this.calculateRatio(this.maxScale, 90),
        Tenderness: this.calculateRatio(this.maxScale, 150),
        Fear: this.calculateRatio(this.maxScale, 210),
        Sadness: this.calculateRatio(this.maxScale, 270),
        Anger: this.calculateRatio(this.maxScale, 330),
      };
    },
    axes() {
      const HappinessSadness = this.createPairs(
        pick(this.axisPositions, ["Happiness", "Sadness"])
      );
      const ExcitementFear = this.createPairs(
        pick(this.axisPositions, ["Excitement", "Fear"])
      );
      const TendernessAnger = this.createPairs(
        pick(this.axisPositions, ["Tenderness", "Anger"])
      );

      return { ...HappinessSadness, ...ExcitementFear, ...TendernessAnger };
    },
  },
  methods: {
    calculateRatio(emotion, degree) {
      const degreeUnit = degree * (Math.PI / 180);
      const circleSin = Math.sin(degreeUnit);
      const circleCos = Math.cos(degreeUnit);
      const maxRatio = this.maxScale > 0 ? this.max / this.maxScale : 0;
      const emotionRatio = emotion > 0 ? emotion / this.max : 0;
      const axisX = 50 * circleSin;
      const axisY = 50 * circleCos;
      const x = axisX * maxRatio * emotionRatio + 50;
      const y = axisY * maxRatio * emotionRatio + 50;

      return {
        x: x,
        y: y,
        ratio: emotionRatio,
      };
    },
    createPairs(positions) {
      const paired = transform(
        positions,
        function (result, value, position) {
          each(positions, function (val, pos) {
            if (position !== pos) {
              const label = join([position, pos].sort(), "-");
              if (!result[label]) {
                result[label] = { from: value, to: val };
              }
            }
          });
        },
        {}
      );

      return paired;
    },
    createCoordinates(positions, x = "x", y = "y") {
      return map(positions, function (value) {
        return [value[x], value[y]];
      });
    },
    joinCoordinates(
      coordinates,
      postFix = "",
      pointsJoin = ",",
      coordinatesJoin = " "
    ) {
      return join(
        map(coordinates, function (value) {
          return join(
            map(value, function (val) {
              return val + postFix;
            }),
            pointsJoin
          );
        }),
        coordinatesJoin
      );
    },
  },
};
</script>

<template>
  <div v-bem="{ labels }">
    <svg v-bem:axes viewBox="0 0 100 100">
      <polyline
        v-for="(value, axis) in axes"
        :key="axis"
        :points="joinCoordinates(createCoordinates([value.from, value.to]))"
        v-bem:axes.line
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.25"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <template v-if="labels">
      <label
        v-for="(value, axisPosition) in axisPositions"
        v-bem:label="{
          [axisPosition]: true,
          Emotionless: false, // TODO: determine if label is shown based on corresponding ability
          top: value.y < 33,
          left: value.x < 33,
          bottom: value.y > 66,
          right: value.x > 66,
        }"
        :key="axisPosition"
        :style="{ left: value.x + '%', top: value.y + '%' }"
        :title="$t(axisPosition)"
      >
        <slot :name="axisPosition" />
      </label>
    </template>
    <emotion-values
      v-for="(values, index) in setsList"
      :key="index"
      :values="values"
      :color="color"
      :scale="maxScale"
      v-bem:values
    />
    <slot />
  </div>
</template>

<style lang="scss">
@use "sass:math";
@import "../../styles/helper";

.emotion-diagram {
  @apply relative;
  @apply bg-sky bg-opacity-25;
  @apply border-sky border;
  @apply rounded-full;

  &:before,
  &:after {
    content: "";
    @apply absolute;
    @apply block;
    @apply bg-sky bg-opacity-25;
  }

  &:before {
    @apply w-2/3 h-2/3;
    left: math.div(1, 6) * 100%;
    top: math.div(1, 6) * 100%;
  }

  &:after {
    @apply w-1/3 h-1/3;
    left: math.div(1, 3) * 100%;
    top: math.div(1, 3) * 100%;
  }

  &__axes {
    @apply absolute inset-0;
    @apply block;
    @apply w-full h-full;
  }

  &__label {
    @apply absolute;
    @apply flex items-center;
    @apply h-4;
    @apply -mt-2;
    @apply transform;
    @apply text-light;
    @apply z-30;

    &::before {
      content: "";
      @apply flex;
      @apply w-4 h-4;
      @apply bg-light;
      @apply z-30;
    }

    @include icons(
      "::before",
      Happiness,
      Sadness,
      Tenderness,
      Anger,
      Excitement,
      Fear,
      Emotionless
    );

    &--Emotionless {
      &::before {
        @apply bg-opacity-50;
        // @apply animate-pulse;
      }
    }

    &--left {
      @apply -translate-x-full;

      &::before {
        @apply mx-1;
        @apply order-last;
      }
    }

    &--right {
      &::before {
        @apply mx-1;
        @apply order-first;
      }
    }

    &--top {
      @apply -translate-y-1/2;
      @apply px-px;
    }

    &--bottom {
      @apply translate-y-1/2;
      @apply px-px;
    }
  }

  &__values {
    @apply z-20;
  }
}
</style>

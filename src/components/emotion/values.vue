<script>
import { mapGetters } from "vuex";
import { every, has, keyBy, map, max, partial, reduce } from "lodash-es";

export default {
  name: "emotion-values",
  props: {
    values: {
      type: Array,
      validator(values) {
        return every(["emotionId", "value"], partial(has, values));
      },
      default: () => [],
    },
    color: {
      type: String,
      default: "light",
    },
    scale: Number,
  },
  inject: [
    "calculateRatio",
    "createPairs",
    "createCoordinates",
    "joinCoordinates",
  ],
  computed: {
    max() {
      console.log({ v: map(this.values, "value") });
      return max(map(this.values, "value"));
    },
    maxScale() {
      return this.scale || this.max;
    },
    positions() {
      const values = keyBy(this.values, "emotionId");
      const normalized = reduce(
        this.emotions,
        (accum, emotion, e) => {
          if (values[e] !== undefined) {
            accum[emotion.title] = values[e].value;
          }

          return accum;
        },
        {}
      );

      return {
        excitement: this.calculateRatio(normalized.Excitement || 0.1, 30),
        happiness: this.calculateRatio(normalized.Happiness || 0.1, 90),
        tenderness: this.calculateRatio(normalized.Tenderness || 0.1, 150),
        fear: this.calculateRatio(normalized.Fear || 0.1, 210),
        sadness: this.calculateRatio(normalized.Sadness || 0.1, 270),
        anger: this.calculateRatio(normalized.Anger || 0.1, 330),
      };
    },
    pairs() {
      return this.createPairs(this.positions);
    },
    coordinates() {
      return this.createCoordinates(this.positions);
    },
    coordinatesPoints() {
      return this.joinCoordinates(this.coordinates);
    },
    ...mapGetters({
      emotions: "labels/emotions",
    }),
  },
};
</script>

<template>
  <div class="emotion-values absolute block inset-0 w-full h-full">
    <svg class="w-full h-full" viewBox="0 0 100 100">
      <defs>
        <clipPath :id="uid + '-points'">
          <polygon :points="coordinatesPoints"></polygon>
        </clipPath>
      </defs>
      <polygon
        :points="coordinatesPoints"
        :class="`text-${color}`"
        fill="currentColor"
        fill-opacity="0.25"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.5"
        vector-effect="non-scaling-stroke"
      />
      <polyline
        v-for="(value, pair) in pairs"
        :key="pair"
        :points="joinCoordinates(createCoordinates([value.from, value.to]))"
        :class="`text-${color}`"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.5"
        vector-effect="non-scaling-stroke"
        :style="{ 'clip-path': `url(#${uid}-points)` }"
      />
    </svg>
    <span
      v-for="(value, position) in positions"
      :key="position"
      class="absolute block w-2 h-2 -ml-1 -mt-1 rounded-full"
      :class="[position, `bg-${color}`]"
      :style="{
        left: value.x + '%',
        top: value.y + '%',
        transform: `scale(${value.ratio})`,
      }"
    ></span>
  </div>
</template>

<style lang="scss">
.emotion-diagram {
  &:before,
  &:after {
    @apply rounded-full block absolute bg-sky bg-opacity-25;
    content: "";
  }

  &:before {
    @apply w-2/3 h-2/3;
    left: 1/6 * 100%;
    top: 1/6 * 100%;
  }

  &:after {
    @apply w-1/3 h-1/3;
    left: 1/3 * 100%;
    top: 1/3 * 100%;
  }

  .emotion-values {
    @apply z-20;
  }
}
</style>

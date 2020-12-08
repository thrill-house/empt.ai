<docs>
### Emotion values
Displays the provided values within an emotion diagram. 

##### Properties
- `color` — Color of the emotion values. Default light.
- `scale` — Scale of the values provided. Default calculated based on values provided.
- `values` — An object or array of objects of emotion values.

##### Instantiation
```
<emotion-values
  color.string="light"
  scale.number="10"
  values.object="{object}"
></emotion-values>
```
</docs>

<script>
// TODO: Refactor
import _ from "lodash-es";

// import { mapState, mapGetters } from 'vuex';

export default {
  name: "emotion-values",

  props: {
    emotions: {
      type: Object,
      validator(value) {
        return _.every(
          ["happiness", "sadness", "excitement", "fear", "tenderness", "anger"],
          _.partial(_.has, value)
        );
      },
      default: () => ({
        happiness: 1,
        sadness: 1,
        excitement: 1,
        fear: 1,
        tenderness: 1,
        anger: 1,
      }),
    },
    color: {
      type: String,
      default: "light",
    },
    scale: Number,
  },
  computed: {
    max() {
      return _.max(_.filter(_.values(this.emotions), _.isFinite));
    },
    maxScale() {
      return this.scale || this.max;
    },
    positions() {
      let emotions = this.emotions;
      return {
        excitement: this.calculateRatio(emotions.excitement, 30),
        happiness: this.calculateRatio(emotions.happiness, 90),
        tenderness: this.calculateRatio(emotions.tenderness, 150),
        fear: this.calculateRatio(emotions.fear, 210),
        sadness: this.calculateRatio(emotions.sadness, 270),
        anger: this.calculateRatio(emotions.anger, 330),
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
  },
  methods: {
    calculateRatio(emotion, degree) {
      let degreeUnit = degree * (Math.PI / 180),
        circleSin = Math.sin(degreeUnit),
        circleCos = Math.cos(degreeUnit),
        // degreeUnit = unit(degree, "deg"),
        //   circleSin = sin(degreeUnit),
        //   circleCos = cos(degreeUnit),
        maxRatio = this.maxScale > 0 ? this.max / this.maxScale : 0,
        emotionRatio = emotion > 0 ? emotion / this.max : 0,
        axisX = 50 * circleSin,
        axisY = 50 * circleCos,
        x = axisX * maxRatio * emotionRatio + 50,
        y = axisY * maxRatio * emotionRatio + 50;

      return {
        x: x,
        y: y,
        ratio: emotionRatio,
      };
    },
    createPairs(positions) {
      let paired = _.transform(
        positions,
        function (result, value, position) {
          _.each(positions, function (val, pos) {
            if (position !== pos) {
              let label = _.join([position, pos].sort(), "-");
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
      return _.map(positions, function (value) {
        return [value[x], value[y]];
      });
    },
    joinCoordinates(
      coordinates,
      postFix = "",
      pointsJoin = ",",
      coordinatesJoin = " "
    ) {
      return _.join(
        _.map(coordinates, function (value) {
          return _.join(
            _.map(value, function (val) {
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
      ></polygon>
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
      ></polyline>
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

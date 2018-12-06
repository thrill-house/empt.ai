<docs>
### Emotion values
Displays the provided values within an emotion diagram. 

##### Instantiation
```
<emotion-values
  :scale.number="10"
  :values.object="{
    happiness: 1,
    sadness: 2,
    excitement: 3,
    fear: 4,
    tenderness: 5,
    anger: 6
  }"></emotion-values>
```
</docs>

<template>
  <div class="emotion-values absolute block pin w-full h-full">
	  <svg class="w-full h-full" viewBox="0 0 100 100">
      <defs>
        <clipPath :id="uid + '-points'">
          <polygon :points="coordinatesPoints"></polygon>
        </clipPath>
      </defs>
      <polygon :points="coordinatesPoints"
        :class="'text-' + color"
        fill="currentColor"
        fill-opacity="0.25"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.5"
        vector-effect="non-scaling-stroke"></polygon>
      <polyline v-for="(value, pair) in pairs"
        :points="joinCoordinates(createCoordinates([value.from, value.to]))"
        :class="'text-' + color"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.5"
        vector-effect="non-scaling-stroke"
        :style="{ 'clip-path': 'url(#' + uid + '-points)' }"></polyline>
    </svg>
    <span v-for="(value, position) in positions"
      class="absolute block w-2 h-2 -ml-1 -mt-1 rounded-full"
      :class="[position, 'bg-' + color]"
      :style="{ left: value.x + '%', top: value.y + '%', transform: 'scale(' + value.ratio + ')' }"></span>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import store from "../store";
import _ from "lodash";
import math from "mathjs";

export default {
  name: "emotion-values",
  store,
  props: {
    emotions: {
      type: Object,
      validator: function(value) {
        return _.every(
          ["happiness", "sadness", "excitement", "fear", "tenderness", "anger"],
          _.partial(_.has, value)
        );
      },
      default: {
        happiness: 1,
        sadness: 1,
        excitement: 1,
        fear: 1,
        tenderness: 1,
        anger: 1
      }
    },
    color: {
      type: String,
      default: "light"
    },
    scale: Number
  },
  computed: {
    max: function() {
      return _.max(_.filter(_.values(this.emotions), _.isFinite));
    },
    maxScale: function() {
      return this.scale || this.max;
    },
    positions: function() {
      var emotions = this.emotions;
      return {
        excitement: this.calculateRatio(emotions.excitement, 30),
        happiness: this.calculateRatio(emotions.happiness, 90),
        tenderness: this.calculateRatio(emotions.tenderness, 150),
        fear: this.calculateRatio(emotions.fear, 210),
        sadness: this.calculateRatio(emotions.sadness, 270),
        anger: this.calculateRatio(emotions.anger, 330)
      };
    },
    pairs: function() {
      return this.createPairs(this.positions);
    },
    coordinates: function() {
      return this.createCoordinates(this.positions);
    },
    coordinatesPoints: function() {
      return this.joinCoordinates(this.coordinates);
    }
  },
  methods: {
    calculateRatio: function(emotion, degree) {
      var degreeUnit = math.unit(degree, "deg"),
        circleSin = math.sin(degreeUnit),
        circleCos = math.cos(degreeUnit),
        maxRatio = this.maxScale > 0 ? this.max / this.maxScale : 0,
        emotionRatio = emotion > 0 ? emotion / this.max : 0,
        axisX = 50 * circleSin,
        axisY = 50 * circleCos,
        x = axisX * maxRatio * emotionRatio + 50,
        y = axisY * maxRatio * emotionRatio + 50;

      return {
        x: x,
        y: y,
        ratio: emotionRatio
      };
    },
    createPairs: function(positions) {
      var paired = _.transform(
        positions,
        function(result, value, position) {
          _.each(positions, function(val, pos) {
            if (position != pos) {
              var label = _.join([position, pos].sort(), "-");
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
    createCoordinates: function(positions, x = "x", y = "y") {
      return _.map(positions, function(value, position) {
        return [value[x], value[y]];
      });
    },
    joinCoordinates: function(
      coordinates,
      postFix = "",
      pointsJoin = ",",
      coordinatesJoin = " "
    ) {
      return _.join(
        _.map(coordinates, function(value, coordinate) {
          return _.join(
            _.map(value, function(val) {
              return val + postFix;
            }),
            pointsJoin
          );
        }),
        coordinatesJoin
      );
    }
  }
};
</script>

<style lang="scss">
@import "../scss/placeholders";

.emotion-diagram {
  &:before,
  &:after {
    @extend %bg-sky-25;
    @apply rounded-full block absolute;
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

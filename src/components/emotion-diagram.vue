<docs>
### Emotion diagram
Displays the player's emotional status as a result of their currently enabled abilities on the playing field. 

##### Instantiation
`<emotion-diagram :happiness.number="1" :sadness.number="2" :excitement.number="3" :fear.number="4" :tenderness.number="5" :anger.number="6" :scale.number="10"></emotion-diagram>`
</docs>

<template>
  <div class="emotion-diagram relative block bg-sky-25 rounded-full">
	  <div class="emotion-values absolute block pin w-full h-full" style="clipPathStyle">
  	  <svg class="w-full h-full" viewBox="0 0 100 100">
        <polygon :points="coordinatesPoints" class="text-light" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"></polygon>
        <polyline v-for="(value, pair) in pairs"
        :points="value.from.x + ',' + value.from.y + ' ' + value.to.x + ',' + value.to.y" fill="none" stroke="white" stroke-width="1" vector-effect="non-scaling-stroke" ></polyline>
      </svg>
    </div>
	  <span v-for="(value, position) in positions"
    :key="position"
    :class="position"
    class="absolute block w-2 h-2 -ml-1 -mt-1 rounded-full bg-light text-grey"
    :style="{ left: value.x + '%', top: value.y + '%', transform: 'scale(' + value.ratio + ')' }"></span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";
import _ from "lodash";
import math from "mathjs";

export default {
  name: "emotion-diagram",
  store,
  props: {
    happiness: Number,
    sadness: Number,
    excitement: Number,
    fear: Number,
    tenderness: Number,
    anger: Number,
    scale: Number
  },
  computed: {
    max: function() {
      return _.max([
        this.happiness,
        this.sadness,
        this.excitement,
        this.fear,
        this.tenderness,
        this.anger
      ]);
    },
    maxScale: function() {
      return this.scale || this.max;
    },
    positions: function() {
      return {
        excitement: this.calculateRatio(this.excitement, 30),
        happiness: this.calculateRatio(this.happiness, 90),
        tenderness: this.calculateRatio(this.tenderness, 150),
        fear: this.calculateRatio(this.fear, 210),
        sadness: this.calculateRatio(this.sadness, 270),
        anger: this.calculateRatio(this.anger, 330)
      };
    },
    pairs: function() {
      return this.createPairs(this.positions);
    },
    coordinates: function() {
      return _.map(this.positions, function(value, position) {
        return [value.x, value.y];
      });
    },
    coordinatesPoints: function() {
      return this.joinCoordinates(this.coordinates, "", ",", " ");
    },
    clipPath: function() {
      return (
        "polygon(" + this.joinCoordinates(this.coordinates, "%", " ", ",") + ")"
      );
    },
    clipPathStyle: function() {
      return {
        "clip-path": this.clipPath,
        "-webkit-clip-path": this.clipPath
      };
    }
  },
  methods: {
    calculateRatio: function(emotion, degree) {
      var degreeUnit = math.unit(degree, "deg"),
        circleSin = math.sin(degreeUnit),
        circleCos = math.cos(degreeUnit),
        maxRatio = this.max / this.maxScale,
        emotionRatio = emotion / this.max,
        halfScale = this.maxScale / 2,
        maxX = 50 * circleSin,
        maxY = 50 * circleCos,
        posX = 50 + maxX * maxRatio * emotionRatio,
        posY = 50 + maxY * maxRatio * emotionRatio;

      return { x: posX, y: posY, ratio: emotionRatio };
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
    joinCoordinates: function(
      coordinates,
      postFix = "",
      pointsJoin,
      coordinatesJoin
    ) {
      return _.join(
        _.map(this.coordinates, function(value, coordinate) {
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

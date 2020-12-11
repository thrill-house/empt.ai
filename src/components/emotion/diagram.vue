<docs>
### Emotion diagram
Displays the a diagram of emotions, given a single or set of value sets 

##### Properties
- `labels` — Boolean, if labels should be displayed for emotions. Default true.
- `color` — Color of the emotion values. Default light.
- `scale` — Scale of the values provided. Default calculated based on values provided.
- `values` — An object or array of objects of emotion values.

##### Instantiation
```html
<emotion-diagram
  labels.boolean="true"
  color.string="light"
  scale.number="10"
  values.object="{object}" OR values.array="[{object},...]"
>Optional label</emotion-diagram>
```
</docs>

<script>
// TODO: Refactor
import _ from "lodash-es";

import EmotionValues from "./values";

export default {
  name: "emotion-diagram",

  components: {
    EmotionValues,
  },
  props: {
    values: {
      type: [Object, Array],
      validator(value) {
        let valuesArray = !_.isArray(value) ? [value] : value,
          required = [
            "happiness",
            "sadness",
            "excitement",
            "fear",
            "tenderness",
            "anger",
          ],
          valid = true;

        _.each(valuesArray, function (values) {
          if (!_.every(required, _.partial(_.has, values))) {
            return (valid = false);
          }
        });

        return valid;
      },
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
  computed: {
    valuesList() {
      return !_.isArray(this.values) ? [this.values] : this.values;
    },
    allMax() {
      return _.map(this.valuesList, function (values) {
        return _.max(_.filter(_.values(values), _.isFinite));
      });
    },
    max() {
      return _.max(this.allMax) || 1;
    },
    maxScale() {
      return this.scale || this.max || 1;
    },
    axisPositions() {
      return {
        happiness: this.calculateRatio(this.maxScale, 90),
        sadness: this.calculateRatio(this.maxScale, 270),
        tenderness: this.calculateRatio(this.maxScale, 150),
        anger: this.calculateRatio(this.maxScale, 330),
        excitement: this.calculateRatio(this.maxScale, 30),
        fear: this.calculateRatio(this.maxScale, 210),
      };
    },
    axes() {
      let happinessSadness = this.createPairs(
          _.pick(this.axisPositions, ["happiness", "sadness"])
        ),
        excitementFear = this.createPairs(
          _.pick(this.axisPositions, ["excitement", "fear"])
        ),
        tendernessAnger = this.createPairs(
          _.pick(this.axisPositions, ["tenderness", "anger"])
        );
      return _.merge({}, happinessSadness, excitementFear, tendernessAnger);
    },
    showLabels() {
      return true;
      // return false;
      // return this.getLabelsEnabled() && !this.labels;
    },
    // ...mapGetters(["getLabelsEnabled"]),
  },
  methods: {
    calculateRatio(emotion, degree) {
      let degreeUnit = degree * (Math.PI / 180),
        circleSin = Math.sin(degreeUnit),
        circleCos = Math.cos(degreeUnit),
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
    label(label) {
      return this.labels ? (this.showLabels ? label : "🤔") : "";
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
          top: value.y < 33,
          left: value.x < 33,
          bottom: value.y > 66,
          right: value.x > 66,
        }"
        :key="axisPosition"
        :style="{ left: value.x + '%', top: value.y + '%' }"
        :title="label(axisPosition)"
      >
        <slot :name="axisPosition" />
      </label>
    </template>
    <emotion-values
      v-for="(value, index) in valuesList"
      :key="index"
      :emotions="value"
      :color="value.color || color"
      :scale="maxScale"
      v-bem:values
    />
    <slot />
  </div>
</template>

<style lang="scss">
@import "../../styles/components";
@import "../../styles/mixins";

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
    left: 1/6 * 100%;
    top: 1/6 * 100%;
  }

  &:after {
    @apply w-1/3 h-1/3;
    left: 1/3 * 100%;
    top: 1/3 * 100%;
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
      happiness,
      sadness,
      tenderness,
      anger,
      excitement,
      fear
    );

    &--left {
      @apply -translate-x-full;

      &::before {
        @apply ml-1;
        @apply order-last;
      }
    }

    &--right {
      &::before {
        @apply mr-1;
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

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
import _ from 'lodash-es';
import {unit, sin, cos} from 'mathjs';
import store from '../store';
import { mapGetters } from 'vuex';

import EmotionValues from './emotion-values';

export default {
  name: 'emotion-diagram',
  store,
  components: {
    EmotionValues,
  },
  props: {
    values: {
      type: [Object, Array],
      validator(value) {
        let valuesArray = !_.isArray(value) ? [value] : value,
          required = [
            'happiness',
            'sadness',
            'excitement',
            'fear',
            'tenderness',
            'anger',
          ],
          valid = true;

        _.each(valuesArray, function(values) {
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
      default: 'light',
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
      return _.map(this.valuesList, function(values) {
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
        excitement: this.calculateRatio(this.maxScale, 30),
        happiness: this.calculateRatio(this.maxScale, 90),
        tenderness: this.calculateRatio(this.maxScale, 150),
        fear: this.calculateRatio(this.maxScale, 210),
        sadness: this.calculateRatio(this.maxScale, 270),
        anger: this.calculateRatio(this.maxScale, 330),
      };
    },
    axes() {
      let happinessSadness = this.createPairs(
          _.pick(this.axisPositions, ['happiness', 'sadness'])
        ),
        excitementFear = this.createPairs(
          _.pick(this.axisPositions, ['excitement', 'fear'])
        ),
        tendernessAnger = this.createPairs(
          _.pick(this.axisPositions, ['tenderness', 'anger'])
        );
      return _.merge({}, happinessSadness, excitementFear, tendernessAnger);
    },
    showLabels() {
      return this.getLabelsEnabled() && !this.labels;
    },
    ...mapGetters(['getLabelsEnabled']),
  },
  methods: {
    calculateRatio(emotion, degree) {
      let degreeUnit = unit(degree, 'deg'),
        circleSin = sin(degreeUnit),
        circleCos = cos(degreeUnit),
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
        function(result, value, position) {
          _.each(positions, function(val, pos) {
            if (position !== pos) {
              let label = _.join([position, pos].sort(), '-');
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
    createCoordinates(positions, x = 'x', y = 'y') {
      return _.map(positions, function(value) {
        return [value[x], value[y]];
      });
    },
    joinCoordinates(
      coordinates,
      postFix = '',
      pointsJoin = ',',
      coordinatesJoin = ' '
    ) {
      return _.join(
        _.map(coordinates, function(value) {
          return _.join(
            _.map(value, function(val) {
              return val + postFix;
            }),
            pointsJoin
          );
        }),
        coordinatesJoin
      );
    },
    label(label) {
      return !this.labels ? (this.showLabels ? label : '??????') : '';
    },
  },
};
</script>

<template>
  <div
    class="emotion-diagram relative block bg-sky-25 rounded-full"
    :class="{ 'mx-16': !labels }"
  >
    <div class="absolute block inset-0 w-full h-full">
      <svg class="w-full h-full" viewBox="0 0 100 100">
        <polyline
          v-for="(value, axis) in axes"
          :key="axis"
          :points="joinCoordinates(createCoordinates([value.from, value.to]))"
          class="text-light"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-opacity="0.25"
          vector-effect="non-scaling-stroke"
        ></polyline>
      </svg>
    </div>
    <div class="absolute block inset-0 w-full h-full z-50">
      <div
        v-for="(value, axisPosition) in axisPositions"
        :key="axisPosition"
        class="absolute block h-4 flex -mt-2 px-2 text-light text-xs uppercase font-bold"
        :class="[axisPosition, { '-translate-x-full': value.x < 50 }]"
        :style="{ left: value.x + '%', top: value.y + '%' }"
      >
        <span>{{ label(axisPosition) }}</span>
        <slot :name="axisPosition"></slot>
      </div>
    </div>
    <emotion-values
      v-for="(value, index) in valuesList"
      :key="index"
      :emotions="value"
      :color="value.color || color"
      :scale="maxScale"
    ></emotion-values>
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '../styles/mixins';

.emotion-diagram {
  &:before,
  &:after {
    @apply rounded-full block absolute bg-sky-25;
    content: '';
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

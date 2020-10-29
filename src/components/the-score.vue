<docs>
### The score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<the-score></the-score>`
</docs>

<script>
import store from '../store';
import {  mapGetters } from 'vuex';

export default {
  name: 'the-score',
  store,
  computed: {
    factors() {
      return this.getFactors();
    },
    scores() {
      return this.getScores();
    },
    ...mapGetters(['getScores', 'getFactors']),
  },
};
</script>

<template>
  <div class="the-score body text-light">
    <label class="label">{{ $t('Data') }}</label
    >: <output class="output">{{ $filters.data(scores.data) }}</output> —
    <output class="output">+{{ $filters.bandwidth(factors.bandwidth) }}</output>
    <hr />
    <label class="label">{{ $t('Confidence') }}</label
    >: <output class="output">{{ $filters.confidence(scores.confidence) }}</output> —
    <output class="output">+{{ $filters.influence(factors.influence) }}</output>
  </div>
</template>

<style lang="scss">
.the-score {
}
</style>

<docs>
### The factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<the-factors></the-factors>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

export default {
  name: 'the-factors',
  store,
  computed: {
    factors() {
      return this.getFactors();
    },
    ...mapGetters(['getFactors']),
  },
};
</script>

<template>
  <div class="the-factors body">
    <template v-if="factors.bandwidth > 0">
      <label class="label">{{ $t('Bandwidth') }}</label>
      <output class="output">+{{ $filters.bandwidth(factors.bandwidth) }}</output>
    </template>
    <template v-if="factors.influence > 0">
      <hr />
      <label class="label">{{ $t('Influence') }}</label>
      <output class="output">+{{ $filters.influence(factors.influence) }}</output>
    </template>
    <template v-if="factors.boosts > 0">
      <hr />
      <label class="label">{{ $t('Dependency boosts') }}</label>
      <output class="output">+{{ $filters.percentage(factors.boosts) }}</output>
    </template>
    <template
      v-if="factors.science > 0 || factors.economy > 0 || factors.society > 0"
    >
      <hr />
      <label class="label">{{ $t('Not a valid event') }}Tree boosts</label>
      <output class="output" v-if="factors.science > 0"
        >+{{ $filters.percentage(factors.science) }}</output
      >
      <output class="output" v-if="factors.economy > 0"
        >+{{ $filters.percentage(factors.economy) }}</output
      >
      <output class="output" v-if="factors.society > 0"
        >+{{ $filters.percentage(factors.society) }}</output
      >
    </template>
  </div>
</template>

<style lang="scss">
.the-factors {
}
</style>

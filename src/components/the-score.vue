<docs>
  ### The score
  The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.
  
  ##### Instantiation
  `<the-score></the-score>`
</docs>

<script>
import _ from "lodash";
import store from "../store";
import { mapState, mapGetters } from "vuex";

export default {
  name: "the-score",
  store,
  computed: {
    factors: function() {
      return this.getFactors();
    },
    scores: function() {
      return this.getScores();
    },
    ...mapGetters(["getScores", "getFactors"])
  }
};
</script>

<template>
  <div class="the-score body text-light">
    <label class="label">{{ $t('Data') }}</label>:
    <output class="output">{{ scores.data|data }}</output> —
    <output class="output">+{{ factors.bandwidth|bandwidth }}</output>
    <hr>
    <label class="label">{{ $t('Confidence') }}</label>:
    <output class="output">{{ scores.confidence|confidence }}</output> —
    <output class="output">+{{ factors.influence|influence }}</output>
  </div>
</template>

<style lang="scss">
.the-score {
}
</style>

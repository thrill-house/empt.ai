<docs>
### The score
The component provides a representation of the player's current game score, meaning the number of **data** and **confidence** resources it has currently accumulated.

##### Instantiation
`<the-score></the-score>`
</docs>

<script>
import store from "../store";
import { mapGetters } from "vuex";

export default {
  name: "the-score",
  store,
  computed: {
    factors() {
      return this.getFactors();
    },
    scores() {
      return this.getScores();
    },
    ...mapGetters(["getScores", "getFactors"]),
  },
};
</script>

<template>
  <div class="the-score body text-light">
    <label class="label">{{ $t("Data") }}</label>
    : <output class="output" v-format:data="scores.data" /> —
    <output class="output" v-format:bandwidth.+="factors.bandwidth" />
    <hr />
    <label class="label">{{ $t("Confidence") }}</label>
    : <output class="output" v-format:confidence="scores.confidence" /> —
    <output class="output" v-format:influence.+="factors.influence" />
  </div>
</template>

<style lang="scss">
.the-score {
}
</style>

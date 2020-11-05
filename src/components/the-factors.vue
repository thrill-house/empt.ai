<docs>
### The factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<the-factors></the-factors>`
</docs>

<script>
import store from "../store";
import { mapGetters } from "vuex";

export default {
  name: "the-factors",
  store,
  computed: {
    factors() {
      return this.getFactors();
    },
    ...mapGetters(["getFactors"]),
  },
};
</script>

<template>
  <div class="the-factors body">
    <template v-if="factors.bandwidth > 0">
      <label class="label">{{ $t("Bandwidth") }}</label>
      <output class="output" v-format:bandwidth.+="factors.bandwidth" />
    </template>
    <template v-if="factors.influence > 0">
      <hr />
      <label class="label">{{ $t("Influence") }}</label>
      <output class="output" v-format:influence.+="factors.influence" />
    </template>
    <template v-if="factors.boosts > 0">
      <hr />
      <label class="label">{{ $t("Dependency boosts") }}</label>
      <output class="output" v-format:percentage.+="factors.boosts" />
    </template>
    <template
      v-if="factors.science > 0 || factors.economy > 0 || factors.society > 0"
    >
      <hr />
      <label class="label">{{ $t("Not a valid event") }}Tree boosts</label>
      <output
        class="output"
        v-if="factors.science > 0"
        v-format:percentage.+="factors.science"
      />
      <output
        class="output"
        v-if="factors.economy > 0"
        v-format:percentage.+="factors.economy"
      />
      <output
        class="output"
        v-if="factors.society > 0"
        v-format:percentage.+="factors.society"
      />
    </template>
  </div>
</template>

<style lang="scss">
.the-factors {
}
</style>

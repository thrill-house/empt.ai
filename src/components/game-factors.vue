<docs>
### Game factors
The component displays the current values for multipliers used to calculate the score at the given moment.

##### Instantiation
`<game-factors></game-factors>`

---
</docs>

<template>
  <div id="game-factors" class="body">
    <template v-if="factors.bandwidth > 0">
	    <label class="label">Bandwidth</label><output class="output">+{{ factors.bandwidth|bandwidth }}</output>
    </template>
    <template v-if="factors.influence > 0">
	    <hr>
	    <label class="label">Influence</label><output class="output">+{{ factors.influence|influence }}</output>
    </template>
    <template v-if="factors.boosts > 0">
	    <hr>
	    <label class="label">Dependency boosts</label><output class="output">+{{ factors.boosts|percentage }}</output>
    </template>
    <template v-if="factors.science > 0 || factors.economy > 0 || factors.society > 0">
	    <hr>
	    <label class="label">Tree boosts</label>
	    <output class="output" v-if="factors.science > 0">+{{ factors.science|science }}</output>
	    <output class="output" v-if="factors.economy > 0">+{{ factors.economy|economy }}</output>
	    <output class="output" v-if="factors.society > 0">+{{ factors.society|society }}</output>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import store from "../store";

export default {
  name: "game-factors",
  store,
  computed: {
    factors: function() {
      return this.getFactors();
    },
    ...mapGetters(["getFactors"])
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables";

#game-factors {
}
</style>

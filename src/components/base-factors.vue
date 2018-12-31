<docs>
### Base factors
A representation of a factor with a corresponding base-icon and value.

##### Properties
- `bases` — Object of base factors
- `trees` — Object of tree

##### Instantiation
`<base-factors
  bases.object="{}"
  trees.object="{}"
  :accumulating.boolean="false"
></base-factors>`
</docs>

<script>
import { mapState } from 'vuex';

import BaseFactor from './base-factor';

export default {
  name: 'base-factors',
  blockName: 'factors',
  components: {
    BaseFactor,
  },
  props: {
    bases: {
      type: Object,
      default: () => ({}),
    },
    trees: {
      type: Object,
      default: () => ({}),
    },
    accumulating: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    adjustedBases() {
      return _.defaults({}, this.bases, this.FACTORS_INIT);
    },
    adjustedTrees() {
      return _.defaults({}, this.trees, this.TREES_INIT);
    },
    ...mapState({
      FACTORS_INIT: (state) => state.scores.FACTORS_INIT,
      TREES_INIT: (state) => state.scores.TREES_INIT,
    }),
  },
};
</script>

<template>
  <div v-bem>
    <base-factor
      v-for="(value, base) in adjustedBases"
      v-bem:factor
      :key="base"
      :label="base"
      :value="value"
      :minimum="2"
      :accumulating="accumulating"
    ></base-factor>
    <base-factor
      v-for="(value, tree) in adjustedTrees"
      v-bem:factor
      :key="tree"
      :label="tree"
      :value="value"
      :minimum="4"
    ></base-factor>
  </div>
</template>

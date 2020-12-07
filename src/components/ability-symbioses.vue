<docs>
### Ability symbioses
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-symbioses abilities.object="{ abilities }"></ability-symbioses>`
</docs>

<script>
// import store from '../store';
import _ from "lodash-es";

import AbilitySynergy from "./ability-synergy";
// import BaseBadge from './base-badge';
// import BaseIcon from './base-icon';

export default {
  name: "ability-symbioses",
  components: {
    AbilitySynergy,
    // BaseBadge,
    // BaseIcon,
  },
  props: {
    type: String,
    synergies: Object,
    source: {
      type: [Object, Boolean],
      default: false,
    },
    minimum: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    length() {
      return _.keys(this.synergies).length || 0;
    },
    remainder() {
      return this.minimum - this.length;
    },
  },
};
</script>

<template>
  <div v-bem>
    <ability-synergy
      v-for="(synergy, index) in synergies"
      :type="type"
      :source="source"
      :key="index"
      :label="index"
    />
    <ability-synergy
      v-for="remain in remainder"
      :type="type"
      :source="false"
      :key="remain"
      :label="false"
    />
  </div>
</template>

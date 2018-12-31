<docs>
### Ownable factor
A representation of a factor with a corresponding base-icon and value.

##### Properties
- `label` — A label referring to the factor.
- `value` — The numerical value of the factor.
- `accumulating` — Boolean indicating if the numbers should appear to be accumulating.

##### Instantiation
`<base-factor
  label.string="factor-label"
  :value.number="123"
  :accumulating.boolean="true"
></base-factor>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

import BaseIcon from './base-icon';

export default {
  name: 'base-factor',
  blockName: 'factor',
  store,
  components: {
    BaseIcon,
  },
  props: {
    label: String,
    value: Number,
    accumulating: Boolean,
  },
  computed: {
    isEmpty() {
      return !this.value ? true : false;
    },
    ...mapGetters(['getPrettyUnit']),
  },
};
</script>

<template>
  <output v-bem>
    <base-icon v-bem:icon size="tiny" :color="label" :label="label" />
    <span v-if="!isEmpty" v-bem:label="{ accumulating }">
      +{{ getPrettyUnit(value, label) }}
    </span>
    <span v-else v-bem:label="{ empty: isEmpty }"> — — — </span>
  </output>
</template>

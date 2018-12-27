<docs>
### Ownable factor
A representation of a factor with a corresponding base-icon and value.

##### Properties
- `label` — A label referring to the factor.
- `value` — The numerical value of the factor.

##### Instantiation
`<base-factor
  label.string="factor-label"
  value.number="123"
></base-factor>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

import BaseIcon from './base-icon';

export default {
  name: 'base-factor',
  store,
  components: {
    BaseIcon,
  },
  props: {
    label: String,
    value: Number,
  },
  computed: {
    ...mapGetters(['prettyUnit']),
  },
};
</script>

<template>
  <output
    v-if="value"
    class="base-factor inline-flex items-center text-xs font-bold text-light"
  >
    <base-icon
      class="w-4 h-4 mr-1"
      :label="label"
      :class="`text-${label}`"
    ></base-icon>
    <span class="filter-grayscale">+{{ prettyUnit(value, label) }}</span>
  </output>
</template>

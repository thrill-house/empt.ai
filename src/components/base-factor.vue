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
    ...mapGetters(['getPrettyUnit']),
  },
};
</script>

<template>
  <output v-bem v-if="value">
    <base-icon v-bem:icon size="tiny" :color="label" :label="label"></base-icon>
    <span v-bem:label="{ accumulating }">
      +{{ getPrettyUnit(value, label) }}
    </span>
  </output>
</template>

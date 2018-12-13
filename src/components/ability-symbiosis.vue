<docs>
### Ability symbiosis
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-symbiosis label.string="ability-label"></ability-symbiosis>`
</docs>

<script>
import store from '../store';

import BaseBadge from './base-badge';
import BaseIcon from './base-icon';

export default {
  name: 'ability-symbiosis',
  blockName: 'ability-symbiosis',
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: false,
    },
    iconColor: {
      type: [String, Boolean],
      default: 'light',
    },
    borderColor: {
      type: [String, Boolean],
      default: false,
    },
    borderSize: {
      type: [String, Boolean],
      default: false,
    },
  },
  components: {
    BaseBadge,
    BaseIcon,
  },
};
</script>

<template>
  <base-badge
    v-bem
    size="small"
    :color="color"
    :borderColor="borderColor"
    :borderSize="borderSize"
  >
    <base-icon
      v-bem:icon
      :color="iconColor"
      size="small"
      :label="label"
    ></base-icon>
  </base-badge>
</template>

<style lang="scss">
.ability-symbiosis {
}
</style>

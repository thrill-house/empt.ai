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

import BaseIcon from './base-icon';

export default {
  name: 'ability-symbiosis',
  components: {
    BaseIcon,
  },
  props: {
    label: String,
  },
};
</script>

<template>
  <div
    class="ability-symbiosis w-8 h-8 rounded-full inline-flex items-center justify-center"
  >
    <base-icon
      class="w-4 h-4 text-light"
      :label="label"
      :class="['text-' + label]"
    ></base-icon>
  </div>
</template>

<style lang="scss">
.ability-symbiosis {
  @apply fixed
  pin
  flex justify-center items-center
  z-50;

  //@extend %bg-navy-75;
}
</style>

<docs>
### Ability symbioses
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-symbioses abilities.object="{ abilities }"></ability-symbioses>`
</docs>

<script>
import store from '../store';

import AbilitySymbiote from './ability-symbiote';
import BaseBadge from './base-badge';
import BaseIcon from './base-icon';

export default {
  name: 'ability-symbioses',
  blockName: 'ability-symbioses',
  components: {
    AbilitySymbiote,
    BaseBadge,
    BaseIcon,
  },
  props: {
    type: String,
    symbiotes: Object,
  },
};
</script>

<template>
  <div v-bem>
    <ability-symbiote
      v-for="(symbiote, index) in symbiotes"
      :type="type"
      :key="index"
      :label="index"
    ></ability-symbiote>
  </div>
</template>

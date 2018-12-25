<docs>
### Ability symbiote
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-symbiote label.string="ability-label" type.string="dependency || dependant"></ability-symbiote>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

import BaseBadge from './base-badge';
import BaseIcon from './base-icon';

export default {
  name: 'ability-symbiote',
  blockName: 'ability-symbiote',
  components: {
    BaseBadge,
    BaseIcon,
  },
  props: {
    label: String,
    type: String,
  },
  computed: {
    isSlotted: function() {
      return this.getAbilitySlotEvent(this.label).length ? true : false;
    },
    isDependency: function() {
      return this.type === 'dependency';
    },
    isDependant: function() {
      return this.type === 'dependant';
    },
    color: function() {
      return this.isDependant ? (this.isSlotted ? 'sky' : 'grey') : false;
    },
    iconColor: function() {
      return this.isDependency && this.isSlotted ? 'sky' : 'light';
    },
    borderColor: function() {
      return this.isDependency ? (this.isSlotted ? 'sky' : 'light') : false;
    },
    borderSize: function() {
      return this.borderColor ? 'medium' : false;
    },
    ...mapGetters(['getAbilitySlotEvent']),
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
    <base-icon v-bem:icon color="light" size="small" :label="label"></base-icon>
  </base-badge>
</template>

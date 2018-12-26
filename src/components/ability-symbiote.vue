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
    label: [String, Boolean],
    type: String,
  },
  computed: {
    empty() {
      return !this.label;
    },
    ability() {
      return !this.empty ? this.getAbility(this.label) : false;
    },
    isSlotted() {
      return this.event.length ? true : false;
    },
    isDependency() {
      return this.type === 'dependency';
    },
    isDependant() {
      return this.type === 'dependant';
    },
    eraActive() {
      return !this.empty ? this.isEraActive(this.ability.era) : false;
    },
    inactive() {
      return !this.eraActive && !this.empty;
    },
    event() {
      return this.getAbilitySlotEvent(this.label);
    },
    icon() {
      return !this.empty ? (this.eraActive ? this.label : 'unknown') : 'empty';
    },
    color() {
      return this.isDependant ? (this.isSlotted ? 'sky' : 'grey') : false;
    },
    iconColor() {
      return this.isDependency && this.isSlotted ? 'sky' : 'light';
    },
    borderColor() {
      return this.isDependency ? (this.isSlotted ? 'sky' : 'light') : false;
    },
    borderSize() {
      return this.borderColor ? 'medium' : false;
    },
    ...mapGetters(['getAbility', 'getAbilitySlotEvent', 'isEraActive']),
  },
};
</script>

<template>
  <base-badge
    v-bem
    size="tiny"
    :empty="empty"
    :inactive="inactive"
    :color="color"
    :borderColor="borderColor"
    :borderSize="borderSize"
  >
    <base-icon v-bem:icon color="light" size="tiny" :label="icon"></base-icon>
  </base-badge>
</template>

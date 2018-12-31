<docs>
### Ability slotter
Previews an ability to be installed.

##### Properties
- `label` — A label referring to an owned ability in the global store.
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<ability-slotter label.string="label" instance.string="instance"></ability-slotter>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilitySlot from './ability-slot';

export default {
  name: 'ability-slotter',
  blockName: 'ability-slotter',
  store,
  components: {
    AbilitySlot,
  },
  props: {
    label: String,
    instance: String,
    slotter: Object,
  },
  computed: {
    slotEvent() {
      return {
        label: this.slotter.label,
        ability: this.label,
        instance: this.instance,
      };
    },
  },
  methods: {
    click() {
      this.addSlotEvent(this.slotEvent);
      this.$emit('cancel');
    },
    ...mapActions(['addSlotEvent']),
  },
};
</script>

<template>
  <ability-slot
    :abilityLabel="label"
    :abilityInstance="instance"
    :slotter="slotter"
    :installing="true"
    @click.native="click()"
  >
    <span slot="tooltip"></span>
  </ability-slot>
</template>

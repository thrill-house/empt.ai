<docs>
### The abilities
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<the-abilities></the-abilities>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters, mapActions } from 'vuex';

import AbilityAvailable from './ability-available';

export default {
  name: 'the-abilities',
  store,
  components: {
    AbilityAvailable,
  },
  computed: {
    selectedAbility() {
      return this.getInteraction('selectedAbility');
    },
    selectedLabel() {
      return this.selectedAbility ? this.selectedAbility.label : '';
    },
    selectedInstance() {
      return this.selectedAbility ? this.selectedAbility.instance : '';
    },
    ...mapState({
      abilities: (state) => state.abilities.list,
    }),
    ...mapGetters(['getInteraction']),
  },
  methods: {
    selectAbility(label, instance) {
      this.setInteraction({
        interaction: 'selectedAbility',
        label: label,
        instance: instance,
      });
    },
    ...mapActions(['setInteraction']),
  },
};
</script>

<template>
  <div class="the-abilities flex flex-wrap w-full">
    <ability-available
      v-for="(ability, index) in abilities"
      :label="index"
      :key="index"
    ></ability-available>
  </div>
</template>

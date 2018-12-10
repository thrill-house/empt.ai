<docs>
### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`
</docs>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";
import AvailableAbility from "./available-ability.vue";

export default {
  name: "ability-library",
  store,
  components: {
    AvailableAbility
  },
  computed: {
    selectedAbility: function() {
      return this.getInteraction("selectedAbility");
    },
    selectedLabel: function() {
      return this.selectedAbility ? this.selectedAbility.label : "";
    },
    selectedInstance: function() {
      return this.selectedAbility ? this.selectedAbility.instance : "";
    },
    ...mapState({
      abilities: state => state.abilities.list
    }),
    ...mapGetters(["getInteraction"])
  },
  methods: {
    selectAbility: function(label, instance) {
      this.setInteraction({
        interaction: "selectedAbility",
        label: label,
        instance: instance
      });
    },
    ...mapActions(["setInteraction"])
  }
};
</script>

<template>
  <div class="ability-library flex flex-wrap w-full">
    <available-ability
      v-for="(ability, index) in abilities"
      class="w-64 text-light"
      :label="index"
      :key="index"
    ></available-ability>
  </div>
</template>

<style lang="scss">
.ability-library {
}
</style>

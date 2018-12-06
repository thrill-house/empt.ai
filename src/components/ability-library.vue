<docs>
### Ability library
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<ability-library></ability-library>`
</docs>

<template>
  <div id="ability-library" class="flex flex-wrap w-full">
	  <available-ability v-for="(ability, index) in abilities"
    :label="index"
    :key="index"
    class="w-64 text-light"></available-ability>
  </div>
</template>

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

<style lang="scss">
#ability-library {
}
</style>

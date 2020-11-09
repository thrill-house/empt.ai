<docs>
### The abilities
The component displays abilities that are available to the player to research or enable within the playing field.

##### Instantiation
`<the-abilities></the-abilities>`
</docs>

<script>
import { mapGetters } from "vuex";

import AbilityProfile from "../ability/profile";

export default {
  name: "game-inventory",
  components: {
    AbilityProfile,
  },
  computed: {
    ...mapGetters({
      abilities: "inventory/getAbilities",
    }),
  },
};
</script>

<template>
  <section v-bem>
    <ability-profile
      v-bem:profile
      v-for="(ability, a) in abilities"
      :id="a"
      :key="a"
    />
  </section>
</template>

<style lang="scss">
.game-inventory {
}
</style>
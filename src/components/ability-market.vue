<docs>
### Ability market
Lists all abilities that are available on the marketplace for the player to purchase.

##### Instantiation
`<ability-market></ability-market>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "ability-market",
  store
};
</script>

<template>
  <div class="ability-market">
	  ...
  </div>
</template>

<style lang="scss">
.ability-market {
}
</style>

<docs>
### Ability market
Lists all abilities that are available on the marketplace for the player to purchase.

##### Instantiation
`<ability-market></ability-market>`
</docs>

<template>
  <div id="ability-market">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "ability-market",
  store
};
</script>

<style lang="scss">
#ability-market {
}
</style>

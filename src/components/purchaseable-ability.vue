<docs>
### Purchaseable ability
Displays an ability that is listed on the marketplace and is available for purchase by the player.

##### Instantiation
`<purchaseable-ability></purchaseable-ability>`
</docs>

<template>
  <div id="purchaseable-ability">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "purchaseable-ability",
  store
};
</script>

<style lang="scss">
#purchaseable-ability {
}
</style>

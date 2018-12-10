<docs>
### The menu
Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation
`<the-menu></the-menu>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "the-menu",
  store
};
</script>

<template>
  <div class="the-menu">
	  ...
  </div>
</template>

<style lang="scss">
.the-menu {
}
</style>

<docs>
### Primary navigation
Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation
`<primary-navigation></primary-navigation>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "primary-navigation",
  store
};
</script>

<template>
  <div class="primary-navigation">
	  ...
  </div>
</template>

<style lang="scss">
.primary-navigation {
}
</style>

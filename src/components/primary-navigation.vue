<docs>
### Primary navigation
Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation
`<primary-navigation></primary-navigation>`

---
</docs>

<template>
  <div id="primary-navigation">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "primary-navigation",
  store
};
</script>

<style lang="scss">
@import "../assets/scss/variables";

#primary-navigation {
}
</style>

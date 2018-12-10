<docs>
### The player
Displays information pertaining to the player's profile.

##### Instantiation
`<the-player></the-player>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "the-player",
  store
};
</script>

<template>
  <div class="the-player">
	  ...
  </div>
</template>

<style lang="scss">
.the-player {
}
</style>

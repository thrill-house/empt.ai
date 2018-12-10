<docs>
### Mini-game
Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation
`<mini-game></mini-game>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "mini-game",
  store
};
</script>

<template>
  <div class="mini-game">
	  ...
  </div>
</template>

<style lang="scss">
.mini-game {
}
</style>

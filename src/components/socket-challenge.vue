<docs>
### Socket challenge
Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation
`<socket-challenge></socket-challenge>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "socket-challenge",
  store
};
</script>

<template>
  <div class="socket-challenge">
	  ...
  </div>
</template>

<style lang="scss">
.socket-challenge {
}
</style>

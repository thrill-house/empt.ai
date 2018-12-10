<docs>
### Socket challenge
Displays a mini-game to the user that can be completed to receive a score bonus in the game.

##### Instantiation
`<socket-challenge></socket-challenge>`
</docs>

<script>
import store from '../store';
import { mapState } from 'vuex';

export default {
  name: 'socket-challenge',
  store,
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

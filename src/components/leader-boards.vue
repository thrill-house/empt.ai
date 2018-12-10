<docs>
### Leader boards
Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation
`<leader-boards></leader-boards>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "leader-boards",
  store
};
</script>

<template>
  <div class="leader-boards">
	  ...
  </div>
</template>

<style lang="scss">
.leader-boards {
}
</style>

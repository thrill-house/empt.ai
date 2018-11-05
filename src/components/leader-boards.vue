<docs>
### Leader boards
Displays a players progress in relation to other players of the game, based on a variety of different criteria.

##### Instantiation
`<leader-boards></leader-boards>`

---
</docs>

<template>
  <div id="leader-boards">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "leader-boards",
  store
};
</script>

<style lang="scss">
#leader-boards {
}
</style>

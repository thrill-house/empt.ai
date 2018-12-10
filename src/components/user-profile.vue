<docs>
### User profile
Displays information pertaining to the player's profile.

##### Instantiation
`<user-profile></user-profile>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "user-profile",
  store
};
</script>

<template>
  <div class="user-profile">
	  ...
  </div>
</template>

<style lang="scss">
.user-profile {
}
</style>

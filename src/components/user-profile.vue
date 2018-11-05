<docs>
### User profile
Displays information pertaining to the player's profile.

##### Instantiation
`<user-profile></user-profile>`

---
</docs>

<template>
  <div id="user-profile">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "user-profile",
  store
};
</script>

<style lang="scss">
#user-profile {
}
</style>

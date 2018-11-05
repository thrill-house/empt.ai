<docs>
### Narrative output
Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation
`<narrative-output></narrative-output>`

---
</docs>

<template>
  <div id="narrative-output">
	  ...
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "narrative-output",
  store
};
</script>

<style lang="scss">
#narrative-output {
}
</style>

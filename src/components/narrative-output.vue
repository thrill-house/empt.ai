<docs>
### Narrative output
Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation
`<narrative-output></narrative-output>`
</docs>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "narrative-output",
  store
};
</script>

<template>
  <div class="narrative-output">
	  ...
  </div>
</template>

<style lang="scss">
.narrative-output {
}
</style>

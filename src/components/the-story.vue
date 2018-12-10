<docs>
### The story
Displays story elements that occur throughout the course of the narrative as a result of in-game events.

##### Instantiation
`<the-story></the-story>`
</docs>

<script>
import store from '../store';
import { mapState } from 'vuex';

export default {
  name: 'the-story',
  store,
};
</script>

<template>
  <div class="the-story">
	  ...
  </div>
</template>

<style lang="scss">
.the-story {
}
</style>

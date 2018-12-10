<docs>
### The menu
Provides a method to navigate between the different primary screens of the game interface.

##### Instantiation
`<the-menu></the-menu>`
</docs>

<script>
import store from '../store';
import { mapState } from 'vuex';

export default {
  name: 'the-menu',
  store,
};
</script>

<template>
  <div class="the-menu">...</div>
</template>

<style lang="scss">
.the-menu {
}
</style>

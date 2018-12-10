<docs>
### Ability purchaseable
Displays an ability that is listed on the marketplace and is available for purchase by the player.

##### Instantiation
`<ability-purchaseable></ability-purchaseable>`
</docs>

<script>
import store from '../store';
import { mapState } from 'vuex';

export default {
  name: 'ability-purchaseable',
  store,
};
</script>

<template>
  <div class="ability-purchaseable">...</div>
</template>

<style lang="scss">
.ability-purchaseable {
}
</style>

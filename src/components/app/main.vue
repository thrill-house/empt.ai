
<script>
import GameSystem from "../game/system";

export default {
  name: "app-main",
  components: { GameSystem },
};
</script>

<template>
  <main v-bem>
    <game-system />
  </main>
</template>

<style lang="scss">
.app-main {
  @apply fixed inset-0;
  @apply w-screen h-screen;
  @apply flex items-center justify-center;
  @apply overflow-auto;
}
</style>


<script>
import GameStart from "../game/start";
import GameSystem from "../game/system";

export default {
  name: "app-main",
  components: { GameStart, GameSystem },
};
</script>

<template>
  <main v-bem>
    <game-start />
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

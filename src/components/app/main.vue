
<script>
import GameStart from "../game/start";
import GameSystem from "../game/system";
import GameWallet from "../game/wallet";

export default {
  name: "app-main",
  components: { GameStart, GameSystem, GameWallet },
};
</script>

<template>
  <main v-bem>
    <game-start />
    <game-system />
    <game-wallet />
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

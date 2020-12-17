
<script>
import EmotionProfile from "../emotion/profile";
import GameInstalling from "../game/installing";
import GameScore from "../game/score";

export default {
  name: "app-header",
  components: { EmotionProfile, GameInstalling, GameScore },
};
</script>

<template>
  <header v-bem>
    <emotion-profile />
    <game-score />
    <game-installing />
  </header>
</template>

<style lang="scss">
.app-header {
  @apply fixed top-0 left-0;
  @apply flex items-start;
  @apply z-10;
}
</style>

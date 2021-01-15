
<script>
import EmotionProfile from "../emotion/profile";
import GameScore from "../game/score";
import GameDuration from "../game/duration";
import GameInstalling from "../game/installing";

export default {
  name: "app-header",
  components: { EmotionProfile, GameScore, GameDuration, GameInstalling },
};
</script>

<template>
  <header v-bem>
    <emotion-profile />
    <div v-bem:values>
      <game-score />
      <game-duration />
    </div>
    <game-installing />
  </header>
</template>

<style lang="scss">
.app-header {
  @apply fixed top-0 left-0;
  @apply flex items-start;
  @apply z-10;

  &__values {
  }
}
</style>

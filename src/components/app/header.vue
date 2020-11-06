
<script>
import EmotionProfile from "../emotion/profile";
import GameScore from "../game/score";

export default {
  name: "app-header",
  components: { EmotionProfile, GameScore },
};
</script>

<template>
  <header v-bem>
    <emotion-profile />
    <game-score />
  </header>
</template>

<style lang="scss">
.app-header {
  @apply absolute top-0 left-0;
  @apply flex items-start;
}
</style>

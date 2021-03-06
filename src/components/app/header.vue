
<script>
import { mapGetters, mapActions } from "vuex";

import EmotionProfile from "../emotion/profile";
import GameScore from "../game/score";
import GameDuration from "../game/duration";
import GameInstalling from "../game/installing";
import GameWallet from "../game/wallet";

export default {
  name: "app-header",
  components: {
    EmotionProfile,
    GameScore,
    GameDuration,
    GameInstalling,
    GameWallet,
  },
  computed: {
    ...mapGetters({
      getSlotView: "system/slotView",
    }),
  },
  methods: {
    ...mapActions({
      slotView: "system/slotView",
    }),
  },
};
</script>

<template>
  <header v-bem>
    <emotion-profile />
    <div v-bem:values>
      <game-score />
      <game-duration />
      <button
        v-bem:toggle.emotionless
        v-if="getSlotView === `values`"
        @click="slotView('emotions')"
      >
        <label v-bem:toggleLabel>{{ $t(`Show ability emotions`) }}</label>
      </button>
      <button
        v-bem:toggle.attributes
        v-if="getSlotView === `emotions`"
        :title="$t(`Show values`)"
        @click="slotView('values')"
      >
        <label v-bem:toggleLabel>{{ $t(`Show ability badges`) }}</label>
      </button>
      <game-wallet />
    </div>
    <game-installing />
  </header>
</template>

<style lang="scss">
@import "../../styles/helper";

.app-header {
  @apply fixed top-0 left-0;
  @apply flex items-start;
  @apply z-10;

  &__values {
    @apply flex flex-wrap items-stretch;
    @apply w-96;
  }

  &__toggle {
    @apply flex items-center justify-center;
    @apply bg-grout bg-grout-sky bg-opacity-50;
    @apply w-6 h-6 mx-2;

    &::before {
      content: "";
      @apply block w-3.5 h-3.5;
      @apply bg-light;
    }

    @include icons("::before", emotionless, attributes);

    &-label {
      @apply hidden absolute right-0;
      @apply whitespace-nowrap;
      @apply -mr-2;
      @apply transform translate-x-full;
      @apply uppercase;
    }

    &:hover &-label {
      @apply block;
    }
  }
}
</style>

<docs>
### Emotion profile
Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation
`<emotion-profile></emotion-profile>`
</docs>

<script>
import { mapGetters } from "vuex";

import EmotionDiagram from "./diagram";

export default {
  name: "emotion-profile",

  components: {
    EmotionDiagram,
  },
  data() {
    return {
      labels: false,
      color: "light",
    };
  },
  computed: {
    ...mapGetters({
      emotions: "score/emotions",
    }),
  },
};
</script>

<template>
  <div v-bem @mouseover="labels = true" @mouseout="labels = false">
    <emotion-diagram v-bem:diagram :labels="labels" :values="emotions" />
  </div>
</template>

<style lang="scss">
.emotion-profile {
  @apply relative block;
  @apply bg-tile;
  @apply p-2 m-2 ml-4;
  @apply z-30;
  @apply rounded-full;

  &__diagram {
    @apply h-48 w-48;
  }
}
</style>

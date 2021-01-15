<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default {
  name: "game-duration",
  computed: {
    since() {
      return dayjs.duration(this.elapsed, "seconds");
    },
    sinceDateTime() {
      return this.since.toISOString();
    },
    sinceHuman() {
      return this.since.format(
        this.$t(
          "Y [years], M [months], D [days], H [hrs], m [mins], s [secs] [since inception]"
        )
      );
    },
    ...mapGetters({
      currentEra: "score/currentEra",
      elapsed: "score/elapsed",
    }),
  },
};
</script>

<template>
  <time v-bem :datetime="sinceDateTime">{{ sinceHuman }}</time>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-duration {
  @apply block;
  @apply w-auto;
  @apply -mt-2 mr-2 p-2;
  @apply text-xs italic;
  @apply bg-grout bg-grout-sky bg-opacity-50;
}
</style>

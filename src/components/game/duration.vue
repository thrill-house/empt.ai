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
      const $t = this.$t;
      return this.since.format(
        `Y [${$t("years")}], M [${$t("months")}], D [${$t("days")}], H [${$t(
          "hrs"
        )}], m [${$t("mins")}], s [${$t("secs")}] [${$t("since inception")}]`
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
  @apply relative;
  @apply block self-stretch;
  @apply w-auto;
  @apply py-2 pr-1;
  @apply text-2xs italic;
  @apply bg-grout bg-grout-sky bg-opacity-50;

  &::before {
    content: "";
    @apply absolute block top-0 left-0;
    @apply transform -translate-x-full;
    @apply h-8 w-28;
    @apply bg-grout bg-grout-sky bg-opacity-50;
  }
}
</style>

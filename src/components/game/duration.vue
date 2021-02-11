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
        )}], m [${$t("mins")}], s [${$t("secs")}]`
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
  <time
    v-bem
    :datetime="sinceDateTime"
    :title="$t(`Time elapsed since inception`)"
    :data-label="$t(`Age`)"
  >
    {{ sinceHuman }}
  </time>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-duration {
  @apply relative;
  @apply block self-stretch;
  @apply w-auto;
  @apply py-1 pr-2;
  @apply text-xs;
  @apply bg-grout bg-grout-sky bg-opacity-50;

  &::before {
    content: attr(data-label);
    @apply absolute top-0 left-0;
    @apply flex items-center justify-end;
    @apply transform -translate-x-full;
    @apply text-2xs text-grey;
    @apply h-6 w-28;
    @apply pr-1;
    @apply bg-grout bg-grout-sky bg-opacity-50;
  }
}
</style>

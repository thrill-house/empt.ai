<script>
import { mapGetters } from "vuex";
import { sortBy } from "lodash-es";

export default {
  name: "util-era",
  props: {
    era: Number,
  },
  computed: {
    eras() {
      return sortBy(this.getEras, "stage");
    },
    ...mapGetters({
      getEras: "labels/eras",
    }),
  },
};
</script>

<template>
  <ol v-bem>
    <li
      v-for="(eraItem, e) in eras"
      v-bem:item="{ active: eraItem.stage <= era }"
      :key="e"
    >
      <span v-bem:label>{{ eraItem }}</span>
    </li>
  </ol>
</template>

<style lang="scss">
@import "../../styles/helper";

.util-era {
  @apply flex flex-col-reverse;
  @apply w-2;
  @apply z-10;

  &__item {
    @apply w-full h-0.5 mt-1;
    @apply bg-grey;

    &:first-child {
      @apply mb-1;
    }

    &--active {
      @apply bg-sky;
    }
  }

  &__label {
    @apply sr-only;
  }
}
</style>

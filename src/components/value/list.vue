<script>
import { isFinite, map, sortBy } from "lodash-es";
import ValueOutput from "./output";

export default {
  name: "value-list",
  components: {
    ValueOutput,
  },
  props: {
    items: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    normalizedItems() {
      return sortBy(
        map(this.items, (value, key) => {
          if (!isFinite(key)) {
            return { type: key, value };
          }

          return value;
        }),
        ({ type }) => {
          switch (type) {
            case "influence":
              return 1;
            case "confidence":
              return 2;
            case "bandwidth":
              return 3;
            case "data":
              return 4;
          }
        }
      );
    },
  },
};
</script>

<template>
  <dl v-bem>
    <value-output
      v-for="({ type, factor, base, value }, i) in normalizedItems"
      :key="i"
      :type="type"
      :base="base"
      :factor="factor"
      :value="value"
    />
  </dl>
</template>

<style lang="scss">
.value-list {
  @apply relative;
  @apply flex flex-wrap;
  @apply content-start;
  @apply w-auto;
}
</style>

<script>
import { clone, isFinite, map, sortBy } from "lodash-es";
import ValueOutput from "./output";

const COUNTERPARTS = {
  influence: "bandwidth",
  confidence: "data",
  bandwidth: "influence",
  data: "confidence",
};

export default {
  name: "value-list",
  components: {
    ValueOutput,
  },
  props: {
    type: {
      type: String,
      default: "value",
    },
    items: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    normalizedItems() {
      return sortBy(this.paddedItems, ({ type }) => {
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
      });
    },
    paddedItems() {
      const items = map(this.items, (value, key) => {
        if (!isFinite(key)) {
          return { type: key, [this.type]: value };
        }

        return value;
      });

      if (items.length === 0) {
        return [];
      }

      if (items.length === 1) {
        const copy = clone(items[0]);

        copy.type = COUNTERPARTS[copy.type];
        copy[this.type] = 0;

        items.push(copy);
      }

      return items;
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

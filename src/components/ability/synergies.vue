<script>
import { keys } from "lodash-es";
import AbilitySynergy from "./synergy";

export default {
  name: "ability-synergies",
  components: {
    AbilitySynergy,
  },
  props: {
    type: {
      type: String,
      default: "dependants",
    },
    source: {
      type: [Object, Boolean],
      default: false,
    },
    synergies: {
      type: Array,
      default: () => [],
    },
    minimum: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    remainder() {
      return this.minimum - keys(this.synergies).length;
    },
  },
};
</script>

<template>
  <div v-bem>
    <ability-synergy
      v-for="(synergy, s) in synergies"
      :type="type"
      :source="source"
      :key="s"
      :id="s"
    />
    <ability-synergy
      v-for="remain in remainder"
      :type="type"
      :key="remain"
      :id="null"
    />
  </div>
</template>

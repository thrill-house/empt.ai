<script>
import { keys } from "lodash-es";
import AbilitySymbiote from "./symbiote";

export default {
  name: "ability-symbiotes",
  components: {
    AbilitySymbiote,
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
    symbiotes: {
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
      return this.minimum - keys(this.symbiotes).length;
    },
  },
};
</script>

<template>
  <div v-bem>
    <ability-symbiote
      v-for="(symbiote, s) in symbiotes"
      :type="type"
      :source="source"
      :key="s"
      :id="s"
    />
    <ability-symbiote
      v-for="remain in remainder"
      :type="type"
      :key="remain"
      :id="null"
    />
  </div>
</template>

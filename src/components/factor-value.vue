<docs>
### Factor value
A representation of a factor with a corresponding icon and value.

##### Properties
- `label` — A label referring to the factor.
- `value` — The numerical value of the factor.

##### Instantiation
`<factor-value label="factor-label" value="123"></factor-value>`
</docs>

<template>
  <output v-if="value" class="factor-value inline-flex items-center text-xs font-bold text-light">
    <icon :label="label" :class="'text-' + label" class="w-4 h-4 mr-1"></icon>
    <span class="filter-grayscale">+{{ prettyUnit(value, label) }}</span>
  </output>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
import Icon from "./icon.vue";

export default {
  name: "factor-value",
  store,
  components: {
    Icon
  },
  props: {
    label: String,
    value: Number
  },
  computed: {
    ...mapGetters(["prettyUnit"])
  }
};
</script>

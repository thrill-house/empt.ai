<docs>
### Symbiotic ability
An ability that has some sort of relationship (depends on or is depended on) with another ability.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<symbiotic-ability label="ability-label"></symbiotic-ability>`
</docs>

<template>
  <div class="w-8 h-8 rounded-full inline-flex items-center justify-center">
    <icon :label="label" :class="['text-' + label]" class="w-4 h-4 text-light"></icon>
  </div>
</template>

<script>
import store from "../store";
import Icon from "./icon.vue";

export default {
  name: "symbiotic-ability",
  components: {
    Icon
  },
  props: {
    label: String
  }
};
</script>

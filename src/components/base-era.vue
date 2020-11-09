<docs>
### Ownable era
Representation of an element's era relative to the total number of eras.

##### Properties
- `label` — A label referring to the era.

##### Instantiation
`<base-era label.string="era-label"></base-era>`
</docs>

<script>
import "../svg";
import { mapGetters } from "vuex";

export default {
  name: "base-era",
  blockName: "era",
  props: {
    label: String,
  },
  computed: {
    stage() {
      return this.getStage(this.label);
    },
    total() {
      return this.getStages();
    },
    ...mapGetters(["getStage", "getStages"]),
  },
};
</script>

<template>
  <div v-bem>
    <!-- <span
      v-for="n in total"
      v-bem:stage="{ color: stage >= n ? 'sky' : 'grey' }"
      :key="n"
    ></span> -->
  </div>
</template>

<style lang="scss">
@import "../styles/mixins";

.era {
  @apply flex flex-col-reverse
  items-center
  min-w-2;

  &__stage {
    @apply w-full h-1 my-px inline-block;

    @include --colors;
  }
}
</style>

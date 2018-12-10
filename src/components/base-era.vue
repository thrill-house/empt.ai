<docs>
### Ownable era
Representation of an element's era relative to the total number of eras.

##### Properties
- `label` — A label referring to the era.

##### Instantiation
`<base-era label.string="era-label"></base-era>`
</docs>

<script>
import { mapGetters } from "vuex";
import svg from "../svg";

export default {
  name: "base-era",
  props: {
    label: String
  },
  computed: {
    stage: function() {
      return this.getStage(this.label);
    },
    total: function() {
      return this.getStages();
    },
    ...mapGetters(["getStage", "getStages"])
  }
};
</script>

<template>
  <div class="flex flex-col-reverse items-center">
    <span
      v-for="n in total"
      class="w-full h-1 my-px inline-block"
      :class="[ 'bg-' + (stage >= n? 'sky': 'grey-50')  ]"
    ></span>
  </div>
</template>

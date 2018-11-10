<docs>
### Era stage
Representation of an elements era relative to the total number of era's

##### Properties
- `label` — A label referring to the era.

##### Instantiation
`<era-stage label="era-label"></era-stage>`
</docs>

<template>
  <div class="flex flex-col-reverse items-center">
    <span v-for="n in total" :class="[ 'bg-' + (stage >= n? 'blue-light': 'grey-50')  ]" class="w-2 h-1 my-px inline-block"></span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import svg from "../svg";

export default {
  name: "era-stage",
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
    ...mapGetters([
      "getStage",
      "getStages"
    ])
  }
};
</script>

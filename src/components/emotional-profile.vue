<docs>
### Emotional profile
Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation
`<emotional-profile></emotional-profile>`
</docs>

<template>
  <div class="emotional-profile relative block">
	  <emotion-diagram class="w-full h-full"
  	  :hideLabels="hideLabels"
  	  :values="emotions"></emotion-diagram>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../store";
import EmotionDiagram from "./emotion-diagram.vue";

export default {
  name: "emotional-profile",
  store,
  components: {
    EmotionDiagram
  },
  props: {
    hideLabels: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "light"
    }
  },
  computed: {
    emotions: function() {
      return _.merge({ color: this.color }, this.getEmotions());
    },
    ...mapGetters(["getEmotions"])
  }
};
</script>

<style lang="scss">
</style>

<docs>
### Emotional profile
Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation
`<emotional-profile></emotional-profile>`

---
</docs>

<template>
  <div class="emotional-profile relative block">
	  <emotion-diagram
	  :happiness="happiness"
	  :sadness="sadness"
	  :excitement="excitement"
	  :fear="fear"
	  :tenderness="tenderness"
	  :anger="anger"
	  :scale="scale"
	  class="w-full h-full"></emotion-diagram>
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
  computed: {
    scale: function() {
      return _.max([
        this.happiness,
        this.sadness,
        this.excitement,
        this.fear,
        this.tenderness,
        this.anger
      ]);
    },
    emotions: function() {
      return this.getEmotions();
    },
    happiness: function() {
      return this.emotions.happiness;
    },
    excitement: function() {
      return this.emotions.excitement;
    },
    anger: function() {
      return this.emotions.anger;
    },
    sadness: function() {
      return this.emotions.sadness;
    },
    fear: function() {
      return this.emotions.fear;
    },
    tenderness: function() {
      return this.emotions.tenderness;
    },
    ...mapGetters(["getEmotions"])
  }
};
</script>

<style lang="scss">
</style>

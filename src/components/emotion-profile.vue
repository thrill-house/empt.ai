<docs>
### Emotion profile
Aggregates the player's current emotional profile based on currently slotted abilities.

##### Instantiation
`<emotion-profile></emotion-profile>`
</docs>

<script>
import store from '../store';
import { mapGetters } from 'vuex';

import EmotionDiagram from './emotion-diagram';

export default {
  name: 'emotion-profile',
  store,
  components: {
    EmotionDiagram,
  },
  props: {
    labels: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'light',
    },
  },
  computed: {
    emotions: function() {
      return _.merge({ color: this.color }, this.getEmotions());
    },
    ...mapGetters(['getEmotions']),
  },
};
</script>

<template>
  <div class="emotion-profile relative block">
    <emotion-diagram class="w-full h-full"
      :labels="labels"
      :values="emotions"></emotion-diagram>
  </div>
</template>

<style lang="scss">
.emotion-profile {
}
</style>

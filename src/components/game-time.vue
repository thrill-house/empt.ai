<docs>
### Game time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<game-time></game-time>`
</docs>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import store from "../store";
import _ from "lodash";

export default {
  name: "game-time",
  store,
  computed: {
    elapsed: function() {
      return this.now - this.start;
    },
    ...mapState({
      start: state => state.session.start,
      now: state => state.session.now
    })
  },
  methods: mapMutations(["setStart", "setNow"])
};
</script>

<template>
  <div class="game-time">
    <label class="label">Elapsed</label>
    <output class="output">{{ elapsed|duration }}</output>
  </div>
</template>

<style lang="scss">
.game-time {
}
</style>

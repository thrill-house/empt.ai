<docs>
### The time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<the-time></the-time>`
</docs>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import store from "../store";
import _ from "lodash";

export default {
  name: "the-time",
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
  <div class="the-time">
    <label class="label">Elapsed</label>
    <output class="output">{{ elapsed|duration }}</output>
  </div>
</template>

<style lang="scss">
.the-time {
}
</style>

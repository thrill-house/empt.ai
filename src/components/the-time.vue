<docs>
### The time
The component displays how much time has elapsed between the first event and the current time.

##### Instantiation
`<the-time></the-time>`
</docs>

<script>
import store from "../store";
import { mapState, mapMutations } from "vuex";

export default {
  name: "the-time",
  store,
  computed: {
    elapsed() {
      return this.now - this.start;
    },
    ...mapState({
      start: (state) => state.session.start,
      now: (state) => state.session.now,
    }),
  },
  methods: mapMutations(["setStart", "setNow"]),
};
</script>

<template>
  <div class="the-time">
    <label class="label">Elapsed</label>
    <output class="output" v-format:duration="elapsed" />
  </div>
</template>

<style lang="scss">
.the-time {
}
</style>

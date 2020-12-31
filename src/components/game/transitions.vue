<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  name: "game-transitions",
  computed: {
    transitions() {
      return this.getTransitioned();
    },
    ...mapGetters({
      getTransitioned: "score/transitioned",
    }),
  },
  methods: {
    clipboard(data) {
      navigator.clipboard.writeText(data);
    },
    dayjs,
  },
};
</script>

<template>
  <section v-bem>
    <ol>
      <li
        v-for="(transition, t) in transitions"
        :key="t"
        @click="clipboard(JSON.stringify(transition))"
      >
        {{ transition.document }}
        {{ dayjs(transition.transition.$createdAt).format() }}
      </li>
    </ol>
  </section>
</template>

<style lang="scss">
@import "../../styles/helper";

.game-transitions {
  @apply w-full;
}
</style>
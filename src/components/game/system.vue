
<script>
import { mapGetters } from "vuex";

import SocketSource from "../socket/source";

export default {
  name: "game-system",
  components: {
    SocketSource,
  },
  props: {
    label: String,
  },
  computed: {
    ...mapGetters({
      sockets: "inventory/sockets",
    }),
  },
};
</script>

<template>
  <section v-bem>
    <socket-source v-for="(socket, s) in sockets" :key="s" :id="s" />
  </section>
</template>

<style lang="scss">
.game-system {
  @apply flex flex-wrap;
  @apply py-16 px-4;
}
</style>

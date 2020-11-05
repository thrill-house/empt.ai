<docs>
### The sockets
The component displays all **sockets**, and by extension all **slots** and **abilities** on the field in their correct locations.

##### Instantiation
`<the-sockets></the-sockets>`
</docs>

<script>
import { mapState } from "vuex";

import SocketField from "./socket-field";

export default {
  name: "the-sockets",

  components: {
    SocketField,
  },
  props: {
    label: String,
  },
  computed: {
    ...mapState({
      sockets: (state) => state.sockets.list,
    }),
  },
};
</script>

<template>
  <div class="the-sockets flex flex-wrap w-full">
    <socket-field
      v-for="(socket, index) in sockets"
      :key="index"
      :label="index"
    ></socket-field>
  </div>
</template>

<style lang="scss">
.the-sockets {
}
</style>

<docs>
### Playing field
The component displays all **data sockets**, **socket slots** and **enabled abilities** on the field in their correct locations.

##### Instantiation
`<playing-field></playing-field>`
</docs>

<script>
import { mapState, mapGetters } from "vuex";
import store from "../store";
import DataSocket from "./data-socket.vue";

export default {
  name: "playing-field",
  components: {
    DataSocket
  },
  props: {
    label: String
  },
  store,
  computed: mapState(["sockets"])
};
</script>

<template>
  <div class="playing-field flex flex-wrap w-full">
    <data-socket
      v-for="(socket, index) in sockets"
      :key="index"
      :label="index">
    </data-socket>
  </div>
</template>

<style lang="scss">
.playing-field {
}
</style>

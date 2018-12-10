<docs>
### The sockets
The component displays all **sockets**, and by extension all **slots** and **abilities** on the field in their correct locations.

##### Instantiation
`<the-sockets></the-sockets>`
</docs>

<script>
import store from '../store';
import { mapState, mapGetters } from 'vuex';

import SocketActivated from './socket-activated';

export default {
  name: 'the-sockets',
  components: {
    SocketActivated,
  },
  props: {
    label: String,
  },
  store,
  computed: mapState(['sockets']),
};
</script>

<template>
  <div class="the-sockets flex flex-wrap w-full">
    <socket-activated
      v-for="(socket, index) in sockets"
      :key="index"
      :label="index">
    </socket-activated>
  </div>
</template>

<style lang="scss">
.the-sockets {
}
</style>

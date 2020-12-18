<script>
import { mapGetters } from "vuex";

import SocketSource from "./source";
import SocketSlot from "./slot";

export default {
  name: "socket-component",
  components: { SocketSource, SocketSlot },
  props: {
    id: String,
  },
  provide() {
    return {
      id: this.id,
      socket: this.socket,
      title: this.title,
      tree: this.tree,
      era: this.era,
      source: this.source,
      online: this.online,
      slots: this.slots,
    };
  },
  computed: {
    socket() {
      return this.getSocket(this.id);
    },
    title() {
      return this.socket?.title;
    },
    tree() {
      return this.getTree(this.socket.treeId)?.title;
    },
    era() {
      return this.getEra(this.socket.eraId)?.stage || 0;
    },
    source() {
      return this.getSocketSource(this.id);
    },
    online() {
      return this.source ? true : false;
    },
    slots() {
      return this.socket.slots;
    },
    ...mapGetters({
      getSocket: "inventory/socket",
      getSocketSource: "inventory/socketSource",
      getTree: "labels/tree",
      getEra: "labels/era",
    }),
  },
};
</script>

<template>
  <article v-bem="{ [title]: true }">
    <socket-source />
    <template v-if="online">
      <socket-slot
        v-for="$i in slots"
        v-bem:slot="{ [$i - 1]: true }"
        :key="$i"
        :slotIndex="$i - 1"
      />
    </template>
  </article>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-component {
  @apply grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    ". a a b b ."
    ". a a b b ."
    "c c d d e e"
    "c c d d e e"
    ". f f g g ."
    ". f f g g .";

  &--Root &__slot {
    &--0 {
      grid-area: c;
    }
    &--1 {
      grid-area: b;
    }
    &--2 {
      grid-area: g;
    }
  }
}
</style>

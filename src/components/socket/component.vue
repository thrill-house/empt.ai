<script>
import { mapGetters } from "vuex";

import SocketSource from "./source";
import SocketSlot from "./slot";

export default {
  name: "socket-component",
  components: { SocketSource, SocketSlot },
  props: {
    id: String,
    tempTitle: String,
    tempTree: String,
    tempSlots: Number,
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
      //return this.socket?.title;
      return this.tempTitle || this.socket?.title;
    },
    tree() {
      //return this.getTree(this.socket?.treeId)?.title;
      return this.tempTree || this.getTree(this.socket?.treeId)?.title;
    },
    era() {
      return this.getEra(this.socket?.eraId)?.stage || 0;
    },
    source() {
      return this.getSocketSource(this.id);
    },
    online() {
      return true;
      // return this.source ? true : false;
    },
    slots() {
      // return this.socket.slots;
      return this.tempSlots || this.socket?.slots;
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
  <article v-bem="{ [title.replace(` `, ``)]: true }">
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
  @apply w-144 h-hex/144;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    ". a a b b ."
    ". a a b b ."
    "c c d d e e"
    "c c d d e e"
    ". f f g g ."
    ". f f g g .";

  &::before {
    content: "";
    @apply self-center;
    @apply w-48 h-8;
    @apply transform;
    @apply bg-dots;
    animation: connect 1s linear infinite;

    @at-root {
      @keyframes connect {
        0% {
          background-position-x: 0;
        }

        100% {
          background-position-x: 1rem;
        }
      }
    }
  }

  // Era 1
  &--Root &__slot {
    &--0 {
      grid-area: b;
    }
    &--1 {
      grid-area: c;
    }
    &--2 {
      grid-area: g;
    }
  }

  &--Root {
    &::before {
      @apply hidden;
    }
  }

  // Era 2
  &--ScienceJournals &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: f;
    }
  }

  &--ScienceJournals {
    &::before {
      @apply bg-dots-science bg-opacity-40;
      grid-area: c;
    }
  }

  &--StockMarket &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: e;
    }
  }

  &--StockMarket {
    &::before {
      @apply bg-dots-economy bg-opacity-40 rotate-120;
      grid-area: b;
    }
  }

  &--CrowdKnowledge &__slot {
    &--0 {
      grid-area: e;
    }
    &--1 {
      grid-area: f;
    }
  }

  &--CrowdKnowledge {
    &::before {
      @apply bg-dots-society bg-opacity-40 rotate-240;
      grid-area: g;
    }
  }

  // Era 3
  &--SmartDevices &__slot {
    &--0 {
      grid-area: e;
    }
    &--1 {
      grid-area: f;
    }
    &--2 {
      grid-area: g;
    }
  }

  &--SmartDevices {
    &::before {
      @apply bg-dots-science bg-opacity-40;
      grid-area: c;
    }
  }

  &--PurchaseData &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: c;
    }
    &--2 {
      grid-area: f;
    }
  }

  &--PurchaseData {
    &::before {
      @apply bg-dots-economy bg-opacity-40 rotate-120;
      grid-area: b;
    }
  }

  &--SocialMedia &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: b;
    }
    &--2 {
      grid-area: e;
    }
  }

  &--SocialMedia {
    &::before {
      @apply bg-dots-society bg-opacity-40 rotate-240;
      grid-area: g;
    }
  }

  // Era 4
  &--BioImplants &__slot {
    &--0 {
      grid-area: b;
    }
    &--1 {
      grid-area: c;
    }
    &--2 {
      grid-area: e;
    }
    &--3 {
      grid-area: f;
    }
  }

  &--BioImplants {
    &::before {
      @apply bg-dots-science bg-opacity-40 rotate-240;
      grid-area: g;
    }
  }

  &--GovernmentBudget &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: b;
    }
    &--2 {
      grid-area: f;
    }
    &--3 {
      grid-area: g;
    }
  }

  &--GovernmentBudget {
    &::before {
      @apply bg-dots-economy bg-opacity-40;
      grid-area: c;
    }
  }

  &--CensusData &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: c;
    }
    &--2 {
      grid-area: e;
    }
    &--3 {
      grid-area: g;
    }
  }

  &--CensusData {
    &::before {
      @apply bg-dots-society bg-opacity-40 rotate-120;
      grid-area: b;
    }
  }

  // Era 5
  &--ClusterComputing &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: b;
    }
    &--2 {
      grid-area: c;
    }
    &--3 {
      grid-area: e;
    }
    &--4 {
      grid-area: f;
    }
  }

  &--ClusterComputing {
    &::before {
      @apply bg-dots-science bg-opacity-40 rotate-240;
      grid-area: g;
    }
  }

  &--FinancialBlockchain &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: b;
    }
    &--2 {
      grid-area: e;
    }
    &--3 {
      grid-area: f;
    }
    &--4 {
      grid-area: g;
    }
  }

  &--FinancialBlockchain {
    &::before {
      @apply bg-dots-economy bg-opacity-40;
      grid-area: c;
    }
  }

  &--PublicSurveillance &__slot {
    &--0 {
      grid-area: a;
    }
    &--1 {
      grid-area: c;
    }
    &--2 {
      grid-area: e;
    }
    &--3 {
      grid-area: f;
    }
    &--4 {
      grid-area: g;
    }
  }

  &--PublicSurveillance {
    &::before {
      @apply bg-dots-society bg-opacity-40 rotate-120;
      grid-area: b;
    }
  }
}
</style>

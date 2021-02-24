<script>
import { mapGetters } from "vuex";
import { map, omit } from "lodash-es";

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
  data: () => ({
    slotValues: {},
  }),
  provide() {
    return {
      socket: this.socket,
      socketId: this.id,
      socketTitle: this.title,
      socketDescription: this.description,
      socketTree: this.tree,
      socketEra: this.era,
      slots: this.slots,
    };
  },
  computed: {
    slotBases() {
      return map(this.slotValues, "bases");
    },
    slotTreeFactors() {
      return map(this.slotValues, "treeFactors");
    },
    slotEraFactors() {
      return map(this.slotValues, "eraFactors");
    },
    socket() {
      return this.getSocket(this.id);
    },
    title() {
      return this.socket?.title;
    },
    description() {
      return this.socket?.description;
    },
    tree() {
      return this.getTree(this.socket?.treeId)?.title;
    },
    era() {
      return this.getEra(this.socket?.eraId)?.stage || 0;
    },
    source() {
      return this.getSocketSource(this.id);
    },
    online() {
      return !!this.source?.$id;
    },
    installing() {
      return !!(this.getInstalling?.abilityId && this.getInstalling?.modelId);
    },
    slots() {
      return this.socket.slots;
    },
    ...mapGetters({
      getInstalling: "system/slotting",
      getSocket: "inventory/socket",
      getSocketSource: "inventory/socketSource",
      getTree: "labels/tree",
      getEra: "labels/era",
      currentEra: "score/currentEra",
    }),
  },
  methods: {
    updateSlotValues(payload) {
      const { id, bases, treeFactors, eraFactors } = payload;

      if ((bases, treeFactors, eraFactors)) {
        this.slotValues[id] = { bases, treeFactors, eraFactors };
      } else {
        this.slotValues = omit(this.slotValues, [id]);
      }
    },
  },
};
</script>

<template>
  <article
    v-if="era <= currentEra + 1"
    v-bem="{ [title.replace(` `, ``)]: true, online, installing }"
  >
    <socket-source
      :slotBases="slotBases"
      :slotTreeFactors="slotTreeFactors"
      :slotEraFactors="slotEraFactors"
    />
    <template v-if="online">
      <socket-slot
        v-for="$i in slots"
        v-bem:slot="{ [$i - 1]: true }"
        :key="$i"
        :slotIndex="$i - 1"
        @updateSlotValues="updateSlotValues"
      />
    </template>
  </article>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-component {
  @apply relative;
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
    content: ".....";
    @apply self-center;
    @apply w-48 h-32;
    @apply font-mono underline;
    @apply text-9xl text-light text-opacity-0;
    @apply transform;
    @apply overflow-hidden;
    @apply opacity-50;
    text-decoration-style: dashed;
    text-decoration-skip-ink: none;
    text-decoration-thickness: 4px;
    text-underline-offset: calc(-0.5em + 14px);
  }

  &::after {
    content: "";
    @apply hidden;
    @apply absolute inset-x-0 -inset-y-hex*6;
    @apply -z-10;
  }

  &:not(&--online) {
    &::before {
      text-decoration-color: theme("colors.light") !important;
    }
    &::after {
      @apply hidden;
    }
  }

  &--online:hover {
    &::after {
      @apply block;
    }
  }

  &--online::before {
    text-decoration-style: wavy;
    animation: connect 4s linear infinite;

    @at-root {
      @keyframes connect {
        0% {
          text-indent: -0.25rem;
        }

        100% {
          text-indent: -8.125rem;
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
    @include hex-path(
      0 42,
      24 30,
      48 42,
      72 30,
      72 6,
      96 -6,
      120 6,
      120 30,
      96 42,
      96 66,
      120 78,
      120 102,
      96 114,
      72 102,
      72 78,
      48 66,
      24 78,
      0 66
    );

    &::before {
      @apply hidden;
    }
    &::after {
      @apply bg-neutral bg-opacity-25;
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      72 30,
      96 42,
      96 66,
      72 78,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      text-decoration-color: theme("colors.science");
      grid-area: c;
    }
    &::after {
      @apply bg-science bg-opacity-25;
      @include hex-path(
        48 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        96 48,
        96 72,
        72 84,
        72 108,
        48 122,
        24 108,
        24 84,
        48 72
      );
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
    @include hex-path(
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      96 66,
      72 78,
      48 66,
      48 42,
      24 30
    );

    &::before {
      @apply rotate-120;
      text-decoration-color: theme("colors.economy");
      grid-area: b;
    }

    &::after {
      @apply bg-economy bg-opacity-25;
      @include hex-path(
        24 12,
        48 0,
        72 12,
        72 36,
        96 48,
        120 36,
        144 48,
        144 72,
        120 84,
        96 72,
        72 84,
        48 72,
        48 48,
        24 36
      );
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
    @include hex-path(
      48 42,
      72 30,
      96 42,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      48 66
    );

    &::before {
      @apply rotate-240;
      text-decoration-color: theme("colors.society");
      grid-area: g;
    }

    &::after {
      @apply bg-society bg-opacity-25;
      @include hex-path(
        48 48,
        72 36,
        96 48,
        120 36,
        144 48,
        144 72,
        120 84,
        96 72,
        72 84,
        72 108,
        48 120,
        24 108,
        24 84,
        48 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      48 42,
      72 30,
      96 42,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      text-decoration-color: theme("colors.science");
      grid-area: c;
    }

    &::after {
      @apply bg-science bg-opacity-25;
      @include hex-path(
        48 48,
        72 36,
        96 48,
        120 36,
        144 48,
        144 72,
        120 84,
        120 108,
        96 120,
        72 108,
        48 120,
        24 108,
        24 84,
        48 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      96 42,
      96 66,
      72 78,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      @apply rotate-120;
      text-decoration-color: theme("colors.economy");
      grid-area: b;
    }

    &::after {
      @apply bg-economy bg-opacity-25;
      @include hex-path(
        0 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        96 48,
        96 72,
        72 84,
        72 108,
        48 120,
        24 108,
        24 84,
        0 72
      );
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
    @include hex-path(
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      72 78,
      48 66,
      48 42,
      24 30
    );

    &::before {
      @apply rotate-240;
      text-decoration-color: theme("colors.society");
      grid-area: g;
    }

    &::after {
      @apply bg-society bg-opacity-25;
      @include hex-path(
        24 12,
        48 0,
        72 12,
        96 0,
        120 12,
        120 36,
        144 48,
        144 72,
        120 84,
        96 72,
        72 84,
        48 72,
        48 48,
        24 36
      );
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
    @include hex-path(
      0 42,
      24 30,
      48 42,
      72 30,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      @apply rotate-240;
      text-decoration-color: theme("colors.science");
      grid-area: g;
    }

    &::after {
      @apply bg-science bg-opacity-25;
      @include hex-path(
        0 48,
        24 36,
        48 48,
        72 36,
        72 12,
        96 0,
        120 12,
        120 36,
        144 48,
        144 72,
        120 84,
        96 66,
        72 78,
        72 108,
        48 120,
        24 108,
        24 84,
        0 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      72 30,
      72 6,
      96 -6,
      120 6,
      120 30,
      96 42,
      96 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      text-decoration-color: theme("colors.economy");
      grid-area: c;
    }

    &::after {
      @apply bg-economy bg-opacity-25;
      @include hex-path(
        48 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        72 12,
        96 0,
        120 12,
        120 36,
        96 48,
        96 72,
        120 84,
        120 108,
        96 120,
        72 108,
        48 120,
        24 108,
        24 84,
        48 722
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      72 78,
      48 66,
      24 78,
      0 66
    );

    &::before {
      @apply rotate-120;
      text-decoration-color: theme("colors.society");
      grid-area: b;
    }

    &::after {
      @apply bg-society bg-opacity-25;
      @include hex-path(
        0 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        96 48,
        120 36,
        144 48,
        144 72,
        120 84,
        120 108,
        96 120,
        72 108,
        72 84,
        48 72,
        24 84,
        0 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      72 30,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      @apply rotate-240;
      text-decoration-color: theme("colors.science");
      grid-area: g;
    }

    &::after {
      @apply bg-science bg-opacity-25;
      @include hex-path(
        0 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        72 12,
        96 0,
        120 12,
        120 36,
        144 48,
        144 72,
        120 84,
        96 72,
        72 84,
        72 108,
        48 120,
        24 108,
        24 84,
        0 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      text-decoration-color: theme("colors.economy");
      grid-area: c;
    }

    &::after {
      @apply bg-economy bg-opacity-25;
      @include hex-path(
        48 48,
        24 36,
        24 12,
        48 0,
        72 12,
        96 0,
        120 12,
        120 36,
        144 48,
        144 72,
        120 84,
        120 108,
        96 120,
        72 108,
        48 120,
        24 108,
        24 84,
        48 72
      );
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
    @include hex-path(
      0 42,
      24 30,
      24 6,
      48 -6,
      72 6,
      96 -6,
      120 6,
      120 30,
      144 42,
      144 66,
      120 78,
      120 102,
      96 114,
      72 102,
      48 114,
      24 102,
      24 78,
      0 66
    );

    &::before {
      @apply rotate-120;
      text-decoration-color: theme("colors.society");
      grid-area: b;
    }

    &::after {
      @apply bg-society bg-opacity-25;
      @include hex-path(
        0 48,
        24 36,
        24 12,
        48 0,
        72 12,
        72 36,
        96 48,
        120 36,
        144 48,
        144 72,
        120 84,
        120 108,
        96 120,
        72 108,
        48 120,
        24 108,
        24 84,
        0 72
      );
    }
  }
}
</style>

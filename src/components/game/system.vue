
<script>
import { mapGetters } from "vuex";

import SocketComponent from "../socket/component";

export default {
  name: "game-system",
  components: {
    SocketComponent,
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
    <socket-component
      v-for="(socket, s) in sockets"
      v-bem:component="{ [socket.title.replace(` `, ``)]: true }"
      :key="s"
      :id="s"
    />
  </section>
</template>

<style lang="scss">
.game-system {
  @apply absolute top-0 left-0 2xl:left-unset;
  @apply grid;

  grid-template-rows: repeat(24, calc(6rem / var(--hex-ratio)));
  grid-template-columns: repeat(24, 6rem);
  grid-template-areas:
  // 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 1
    ". . . . . t t . . . . . . p p . . . . . . . . ." // 2
    ". . . . . t t . . . . . . p p . . . . . . . . ." // 3
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 4
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 5
    ". . . q q . . w w . . . . . . s s . . . . . . ." // 6
    ". . . q q . . w w . . . . . . s s . . . . . . ." // 7
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 8
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 9
    ". n n . . . . . . z z . . y y . . v v . . . . ." // 10
    ". n n . . . . . . z z . . y y . . v v . . . . ." // 11
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 12
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 13
    ". . . . . . . x x . . . . . . . . . . . . . . ." // 14
    ". . . . . . . x x . . . . . . . . . . . . . . ." // 15
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 16
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 17
    ". . . . . u u . . r r . . o o . . . . . . . . ." // 18
    ". . . . . u u . . r r . . o o . . . . . . . . ." // 19
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 20
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 21
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 22
    ". . . . . . . . . . . . . . . . . . . . . . . ." // 23
    ". . . . . . . . . . . . . . . . . . . . . . . ."; //24

  &__component {
    // Era 1
    &--Root {
      grid-area: z;
    }

    // Era 2
    &--ScienceJournals {
      grid-area: y;
    }

    &--StockMarket {
      grid-area: x;
    }

    &--CrowdKnowledge {
      grid-area: w;
    }

    // Era 3
    &--SmartDevices {
      grid-area: v;
    }

    &--PurchaseData {
      grid-area: u;
    }

    &--SocialMedia {
      grid-area: t;
    }

    // Era 4
    &--BioImplants {
      grid-area: s;
    }

    &--GovernmentBudget {
      grid-area: r;
    }

    &--CensusData {
      grid-area: q;
    }

    // Era 5
    &--ClusterComputing {
      grid-area: p;
    }

    &--FinancialBlockchain {
      grid-area: o;
    }

    &--PublicSurveillance {
      grid-area: n;
    }
  }
}
</style>

<script>
import { mapGetters } from "vuex";
// import _ from "lodash-es";

export default {
  name: "socket-source",
  components: {},
  props: {
    id: String,
    color: {
      type: [String, Boolean],
      default: "grey",
    },
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
    // affordability() {
    //   return _.clamp(
    //     (this.scores.confidence / this.costs.confidence) * 100,
    //     0,
    //     100
    //   );
    // },
    affordable() {
      // return this.affordability === 100;
      return true;
    },
    // factors() {
    //   return this.socket.factors;
    // },
    costs() {
      return this.getSocketCosts(this.id);
    },
    // scores() {
    //   return this.getScores();
    // },
    // event() {
    //   return this.getEventOfType(this.label, "socket");
    // },
    // newEvent() {
    //   return {
    //     type: "socket",
    //     label: this.label,
    //   };
    // },
    ...mapGetters({
      // "getScores",
      // "getEventOfType",
      getSocket: "inventory/socket",
      getSocketCosts: "inventory/socketCosts",
      getTree: "labels/tree",
      getEra: "labels/era",
      // "getSlotsForSocket",
    }),
  },
  methods: {
    activate() {
      this.addSocketEvent(this.newEvent);
    },
    // ...mapActions(["addSocketEvent"]),
  },
  emits: ["activate"],
};
</script>

<template>
  <article v-bem="{ [tree]: true }">
    <header v-bem:header>
      <h4 v-bem:title>{{ title }}</h4>
    </header>
    <div v-bem:content>
      <slot>
        <button
          v-bem:connect
          size="medium"
          :progress="affordability || 30"
          :color="affordable ? 'sky' : 'navy'"
          :disabled="!affordable"
          @click.once="activate"
        >
          <template v-if="affordable">
            {{ $t("Costs") }} <span v-format:confidence="costs.confidence" />
          </template>
          <template v-else>{{ $t("Connect") }}</template>
        </button>
      </slot>
    </div>
    <i v-bem:icon size="medium" :color="tree" :label="tree" />
    <i v-bem:era :label="era" />
  </article>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-source {
  @apply hexagon hexagon-grout;
  @apply flex flex-col;
  @apply justify-between items-center;
  @apply px-2 py-6;
  @apply mx-1 -mt-hex/16;
  @apply text-center;
  grid-area: d;

  &::after {
    content: "";
    @apply absolute inset-0 -top-1/2 -left-1/2;
    @apply w-full*2 h-full*2;
    @apply bg-dots;
    @apply animate-spin;
    animation-duration: 13s;
  }

  &--Neutral {
    &::before {
      @apply bg-grout-neutral bg-opacity-25;
    }
    &::after {
      @apply bg-dots-neutral;
    }
  }

  &--Science {
    &::before {
      @apply bg-grout-science bg-opacity-25;
    }
    &::after {
      @apply bg-dots-science;
    }
  }

  &--Economy {
    &::before {
      @apply bg-grout-economy bg-opacity-25;
    }
    &::after {
      @apply bg-dots-economy;
    }
  }

  &--Society {
    &::before {
      @apply bg-grout-society bg-opacity-25;
    }
    &::after {
      @apply bg-dots-society;
    }
  }

  // @include --colors;

  &__header {
    @apply flex;
    @apply items-center justify-center;
    @apply text-center;
    @apply bg-ash bg-opacity-25;
    @apply p-2;
    @apply w-2/3 h-12;
    @apply order-2;
  }

  &__title {
    @apply text-light text-sm uppercase;
  }

  &__content {
    @apply flex flex-wrap;
    @apply justify-center items-center;
    @apply w-full h-12;
    @apply order-2;
  }

  &__icon {
    @apply mb-2 order-1;
  }

  &__era {
    @apply mt-1 order-4 w-2;
  }
}
</style>

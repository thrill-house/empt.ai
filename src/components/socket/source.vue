<script>
import _ from "lodash-es";

import { mapGetters, mapActions } from "vuex";

import BaseButton from "./base-button";
import BaseEra from "./base-era";
import BaseIcon from "./base-icon";
import BaseHexagon from "./base-hexagon";

export default {
  name: "socket-base",

  components: {
    BaseButton,
    BaseEra,
    BaseHexagon,
    BaseIcon,
  },
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: "grey",
    },
  },
  computed: {
    socket() {
      return this.getSocket(this.label);
    },
    affordability() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable() {
      return this.affordability === 100;
    },
    factors() {
      return this.socket.factors;
    },
    costs() {
      return this.getSocketCosts(this.newEvent);
    },
    scores() {
      return this.getScores();
    },
    event() {
      return this.getEventOfType(this.label, "socket");
    },
    newEvent() {
      return {
        type: "socket",
        label: this.label,
      };
    },
    ...mapGetters([
      "getScores",
      "getEventOfType",
      "getSocket",
      "getSocketCosts",
      "getSlotsForSocket",
    ]),
  },
  methods: {
    activate() {
      this.addSocketEvent(this.newEvent);
    },
    ...mapActions(["addSocketEvent"]),
  },
  emits: ["activate"],
};
</script>

<template>
  <base-hexagon v-bem="{ color }" :tile="true" :color="color">
    <header v-bem:header>
      <h4 v-bem:title>{{ socket.name }}</h4>
    </header>
    <div v-bem:content>
      <slot>
        <base-button
          v-bem:connect
          size="medium"
          :progress="affordability"
          :color="affordable ? 'sky' : 'navy'"
          :disabled="!affordable"
          @click.once="activate"
        >
          <template v-if="affordable">
            {{ $t("Costs") }} <span v-format:confidence="costs.confidence" />
          </template>
          <template v-else>{{ $t("Connect") }}</template>
        </base-button>
      </slot>
    </div>
    <base-icon
      v-bem:icon
      size="medium"
      :color="socket.tree"
      :label="socket.tree"
    ></base-icon>
    <base-era v-bem:era :label="socket.era"></base-era>
  </base-hexagon>
</template>

<style lang="scss">
@import "../styles/util";

.socket-base {
  @apply flex flex-col;
  @apply justify-between items-center;
  @apply bg-neutral;
  @apply px-2 py-6
  @apply mx-1 -mt-hex/16;
  @apply text-center;
  grid-area: d;

  &:before {
    @apply m-2;
  }

  &:after {
    @apply absolute inset-0;
    @apply w-full*2 h-full*2;
    @apply bg-dots;
    @apply z-10;
    @apply rotate-45;
    content: "";
    left: -50%;
    top: -50%;
  }

  // @include --colors;

  &__header {
    @apply flex;
    @apply items-center justify-center;
    @apply text-center;
    @apply bg-grey-25;
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

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { capitalize, flatten, head } from "lodash-es";
import { extractValues } from "../../api";

import hover from "../../mixins/hover";
import ValueList from "../value/list";
import UtilEra from "../util/era";
import UtilTooltip from "../util/tooltip";

export default {
  name: "socket-source",
  components: { ValueList, UtilEra, UtilTooltip },
  mixins: [hover],
  props: {
    slotBases: Array,
    slotTreeFactors: Array,
    slotEraFactors: Array,
  },
  data: () => ({
    loading: false,
    training: false,
  }),
  inject: [
    "socket",
    "socketId",
    "socketTitle",
    "socketDescription",
    "socketTree",
    "socketEra",
  ],
  computed: {
    source() {
      return this.getSocketSource(this.socketId);
    },
    id() {
      return this.source?.$id;
    },
    online() {
      return !!this.id;
    },
    installing() {
      return !!(this.getInstalling?.abilityId && this.getInstalling?.modelId);
    },

    bases() {
      const bases = this.getSocketCoreBases(this.socketId);
      const slotBases = this.slotBases;
      const cumulativeBases = extractValues({
        values: [...bases, ...flatten(slotBases)],
        type: "base",
        compare: false,
      });

      // console.log({ cumulativeBases });

      return cumulativeBases;
    },
    treeFactors() {
      const treeFactors = this.getSocketTreeFactors(this.socketId);
      const slotTreeFactors = this.slotTreeFactors;
      const cumulativeTreeFactors = extractValues({
        values: [...treeFactors, ...flatten(slotTreeFactors)],
        type: "factor",
        compare: false,
      });

      // console.log({ cumulativeTreeFactors, slotTreeFactors, treeFactors });

      return cumulativeTreeFactors;
    },
    eraFactors() {
      const eraFactors = this.getSocketEraFactors(this.socketId);
      const slotEraFactors = this.slotEraFactors;
      const cumulativeEraFactors = extractValues({
        values: [...eraFactors, ...flatten(slotEraFactors)],
        type: "factor",
        compare: false,
      });

      // console.log({ eraFactors, slotEraFactors, cumulativeEraFactors });

      return cumulativeEraFactors;
    },
    sortedAttributes() {
      return {
        base: this.bases,
        trees: this.treeFactors,
        eras: this.eraFactors,
      };
    },

    bonus() {
      return head(this.socket?.bonuses)?.bonus;
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
    costs() {
      return this.getSocketConfidenceCosts(this.socketId);
    },

    ...mapState(["gameId"]),
    ...mapGetters({
      getInstalling: "system/slotting",
      getSocket: "inventory/socket",
      getSocketSource: "inventory/socketSource",
      getSocketBases: "inventory/socketBases",
      getSocketCoreBases: "inventory/socketCoreBases",
      getSocketFactors: "inventory/socketFactors",
      getSocketTreeFactors: "inventory/socketTreeFactors",
      getSocketEraFactors: "inventory/socketEraFactors",
      getSocketConfidenceCosts: "inventory/socketConfidenceCosts",
      getAbility: "inventory/ability",
    }),
  },
  methods: {
    async connect() {
      this.loading = true;

      const payload = {
        gameId: this.gameId,
        socketId: this.socketId,
        eraId: this.socket.eraId,
        treeId: this.socket.treeId,
      };

      await this.connectSource(payload);

      this.loading = false;
    },
    async train() {
      this.training = true;

      const payload = {
        gameId: this.gameId,
        socketId: this.socketId,
        sourceId: this.source.$id,
        answer: { question: "The question is...", value: "My answer is..." },
      };

      await this.trainSource(payload);

      this.training = false;
    },
    // async disconnect() {
    //   this.loading = true;

    //   await this.removeSource({ $id: this.source?.$id });

    //   this.loading = false;
    // },
    ...mapActions({
      connectSource: "Game/Sources/create",
      trainSource: "Game/Trainings/create",
      removeSource: "Game/Sources/delete",
    }),
    capitalize,
  },
};
</script>

<template>
  <div v-bem="{ online, [socketTree]: online, loading, training, installing }">
    <header
      v-bem:header
      @mouseenter="enter"
      @mouseleave="leave"
      @mousemove="move"
    >
      <h4 v-bem:headerTitle>{{ socketTitle }}</h4>
    </header>
    <dl v-bem:attributes="{ active: toggle === 'attributes' }">
      <template
        v-for="(attributes, attribute) in sortedAttributes"
        :key="attribute"
      >
        <dt
          v-bem:attributesType="{ [attribute]: true }"
          :title="
            $t('{attribute} {target} {type}', {
              attribute: capitalize(attribute),
              target: attribute === 'base' ? $t('rate') : $t('match'),
              type: attribute === 'base' ? $t('boost') : $t('bonus'),
            })
          "
        />
        <dd v-bem:attributesValues="{ [attribute]: true }">
          <value-list
            v-bem:attributesList="{ [attribute]: true }"
            :items="attributes"
          />
        </dd>
      </template>
    </dl>
    <button
      v-if="online && !installing"
      v-bem:bonus.confidence="{ loading: training }"
      v-format:confidence.⇧="bonus"
      :title="$t(`Training bonus`)"
      @click="train()"
    />
    <button
      v-else-if="!installing"
      v-bem:connect.confidence="{ loading }"
      v-format:confidence="costs"
      :disabled="!affordable"
      :title="$t(`Bring online`)"
      @click="connect()"
    />
    <i v-bem:tree="{ [socketTree]: true }" />
    <util-era v-bem:era :era="socketEra" />
    <teleport to="#app" v-if="!empty && hover">
      <util-tooltip v-bem:tooltip :position="position">
        <h3>{{ socketTitle }}</h3>
        <p>{{ socketDescription }}</p>
      </util-tooltip>
    </teleport>
  </div>
  <div v-for="$i in slots" :key="$i">{{ $i }}</div>
</template>

<style lang="scss">
@import "../../styles/helper";

.socket-source {
  @apply relative;
  @apply flex flex-col;
  @apply justify-between items-center;
  @apply w-48 h-hex*48;
  @apply text-center;
  @apply px-2 py-4;
  @apply -mt-hex*6;
  @apply overflow-hidden;
  @apply clip-hexagon;
  grid-area: d;

  &::before {
    content: "";
    @apply absolute inset-0;
    @apply m-2;
    @apply bg-grout;
    @apply bg-grout-light bg-opacity-25;
    @apply z-10;
    @apply clip-hexagon;
  }

  &::after {
    content: "";
    @apply absolute -inset-1/4;
    @apply bg-dots;
    @apply bg-dots-light bg-opacity-50;
    @apply z-0;
  }

  > * {
    @apply relative;
    @apply z-20;
  }

  &--online {
    &::after {
      @apply animate-spin;
      animation-duration: 13s;
    }
  }

  @include trees using ($tree) {
    &::before {
      @apply bg-grout-#{$tree} bg-opacity-25;
    }
    &::after {
      @apply bg-dots-#{$tree};
    }
  }

  &__header {
    @apply flex;
    @apply items-center justify-center;
    @apply text-center;
    @apply bg-light bg-opacity-25;
    @apply p-1 my-1;
    @apply w-2/3 h-10;
    @apply order-2;

    &-title {
      @apply text-light text-sm uppercase;
    }
  }

  &:not(&--installing):hover &__attributes,
  &--training &__attributes,
  &--loading &__attributes {
    @apply hidden;
  }

  &__attributes {
    @apply relative;
    @apply flex flex-col flex-wrap justify-between;
    @apply h-16 w-full;
    @apply px-2;
    @apply z-10;
    @apply order-3;

    &--active {
      @apply flex;
    }

    &-type {
      @apply flex items-center justify-end;
      @apply h-4;
      @apply text-sm leading-none;

      &:before {
        content: "";
        @apply inline-block;
        @apply w-4 h-4 mr-1;
        @apply bg-light;
      }

      @include icons("::before", base, trees, eras);
    }

    &-label {
      @apply sr-only;
    }

    &-values {
      @apply flex justify-end;
      @apply h-10;
    }

    &-list {
      @apply flex flex-col items-end justify-between;

      &--base {
        @apply items-stretch self-stretch;

        > dd {
          @apply justify-between;

          &::before {
            @apply mr-2;
          }
        }
      }

      &--trees,
      &--eras {
        > dd {
          &::before {
            @apply hidden;
          }
        }
      }

      &--trees {
        @apply justify-end;
        &:before {
        }
      }

      &--eras {
        @apply justify-start;
      }
    }
  }

  &:hover &__connect,
  &:hover &__bonus,
  &--loading &__connect,
  &--training &__bonus {
    @apply flex;
  }

  &__connect,
  &__bonus {
    @apply button button-title button-icon;
    @apply hidden;
    @apply w-28;
    @apply my-3;
    @apply order-3;

    &::before {
      @apply bg-confidence;
    }

    @include icons("::before", confidence);

    &--loading {
      @apply bg-opacity-50;

      &::before {
        @apply mask-loading;
        @apply animate-spin;
        animation-direction: reverse;
      }
    }
  }

  &__tree {
    @apply w-6 h-6;
    @apply mt-1;
    @apply order-1;

    @include trees using ($tree) {
      @apply bg-#{$tree};
    }

    @include icons("", Neutral, Science, Economy, Society);
  }

  &__era {
    @apply mt-1;
    @apply order-4;
  }

  &__tooltip {
    @apply w-48;

    h3 {
      @apply font-bold uppercase;
    }
    p {
      @apply text-xs;
    }
  }
}
</style>

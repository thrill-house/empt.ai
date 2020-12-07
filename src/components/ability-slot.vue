<docs>
### Ability slot
The enabled or installing ability is shown within a socket slot.

##### Properties
- `instance` — An instance ID referring to an owned ability in the global store.

##### Instantiation
`<ability-slot abilityInstance.string="instance" abilityLabel.string="label"></ability-slot>`
</docs>

<script>
import { mapState, mapGetters } from "vuex";

import AbilitySymbioses from "./ability-symbioses";
import BaseBadge from "./base-badge";
import BaseEra from "./base-era";
import BaseFactors from "./base-factors";
import BaseHover from "./base-hover";
import BaseIcon from "./base-icon";
// import EmotionDiagram from './emotion-diagram';
import SocketSlot from "./socket-slot";
import TheTooltip from "./the-tooltip";

export default {
  name: "ability-slot",

  extends: BaseHover,
  components: {
    AbilitySymbioses,
    BaseBadge,
    BaseEra,
    BaseFactors,
    BaseIcon,
    // EmotionDiagram,
    SocketSlot,
    TheTooltip,
  },
  props: {
    abilityLabel: [String, Boolean],
    abilityInstance: [String, Boolean],
    slotter: Object,
    installing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    slot() {
      return this.slotter;
    },
    label() {
      return this.slot.label;
    },
    ability() {
      return this.getAbility(this.abilityLabel) || {};
    },
    name() {
      return this.ability.name;
    },
    description() {
      return this.ability.description;
    },
    tree() {
      return this.ability.tree || {};
    },
    factors() {
      return this.ability.factors || {};
    },
    calculatedFactors() {
      return this.getCalculatedFactors(this.slotEvent);
    },
    influence() {
      return this.factors.influence || {};
    },
    trees() {
      return this.influence.trees || {};
    },
    dependencies() {
      return this.influence.dependencies || {};
    },
    dependants() {
      return this.getAbilityDependants(this.ability.label) || {};
    },
    event() {
      return this.getEventOfType(this.abilityInstance, "ability", "instance");
    },
    slotEvent() {
      return this.getEventOfType(this.abilityInstance, "slot", "instance");
    },
    socket() {
      return this.getSocket(this.slot.socketLabel);
    },
    color() {
      return this.treeMatch ? this.tree : "light";
    },
    stain() {
      return this.treeMatch ? this.tree : "grey";
    },
    treeMatch() {
      return this.ability.tree === this.socket.tree;
    },
    ...mapState({
      abilities: (state) => state.abilities.list,
    }),
    ...mapGetters([
      "getFactors",
      "getEra",
      "getEventOfType",
      "getEventObjects",
      "getStage",
      "getAbility",
      "getAbilityDependants",
      "getAbilitySlotEvent",
      "getCalculatedFactors",
      "getSocket",
      // 'getPrettyUnit',
    ]),
  },
  emits: ["over", "out", "move"],
};
</script>

<template>
  <socket-slot
    v-bem="{ color, installing }"
    :stain="stain"
    :color="false"
    :slotter="slotter"
  >
    <div v-bem:content>
      <base-badge
        v-bem:content-badge
        size="large"
        :fade="tree"
        :pulse="true"
        @mouseover="over"
        @mouseout="out"
        @mousemove="move"
      >
        <slot name="badge">
          <base-icon size="large" color="light" :label="abilityLabel" />
        </slot>
        <slot name="tooltip">
          <portal v-if="hover" to="tooltips">
            <the-tooltip v-bem:tooltip :position="position">
              <header v-bem:tooltip-header>
                <h4 v-bem:tooltip-header-title>{{ name }}</h4>
                <p v-bem:tooltip-header-description>{{ description }}</p>
              </header>
              <base-factors
                v-bem:tooltip-factors
                :bases="calculatedFactors"
                :trees="trees"
                :accumulating="true"
              />
            </the-tooltip>
          </portal>
        </slot>
      </base-badge>
      <ability-symbioses
        v-bem:content-dependencies
        type="dependency"
        :source="ability"
        :minimum="3"
        :synergies="dependencies"
      ></ability-symbioses>
      <ability-symbioses
        v-bem:content-dependants
        type="dependant"
        :source="ability"
        :minimum="3"
        :synergies="dependants"
      ></ability-symbioses>
    </div>
    <base-badge v-bem:tree size="tiny" :fade="treeMatch ? tree : 'grey'">
      <base-icon size="tiny" :color="tree" :label="tree" />
    </base-badge>
    <base-era v-bem:era :label="ability.era" />
  </socket-slot>
</template>

<style lang="scss">
@import "../styles/mixins";

.ability-slot {
  @apply flex flex-col
  justify-center items-center
  px-2;

  // @include --colors($property: "bg", $pseudo: "after", $postfix: "-75");

  &:before {
    @apply m-1;
  }

  &:after {
    @apply absolute inset-0;
  }

  &__content {
    @apply flex
    justify-between items-center
    w-full
    order-2;

    &-badge {
      @apply order-2;
      animation: pulse 3s infinite;
    }

    &-dependencies,
    &-dependants {
      @apply flex flex-col
        justify-center
        flex-shrink-0
        w-8;

      * + * {
        @apply mt-1;
      }
    }

    &-dependencies {
      @apply ml-px
        order-1;
    }

    &-dependants {
      @apply mr-px
        order-3;
    }
  }

  &__tooltip {
    &-header {
      @apply mb-2;

      &-title {
        @apply uppercase;
      }

      &-description {
      }
    }

    &-factors {
      @apply flex flex-wrap
      w-auto max-w-48;
    }
  }

  &__factors {
    &-base,
    &-tree {
      @apply w-1/2
      pl-1
      mb-1;
    }
  }

  &__tree {
    @apply mb-2 order-1;
  }

  &__era {
    @apply mt-2 order-3;
  }

  &--installing &__content-badge {
    animation: tada 1.5s infinite;
  }

  // &:hover {
  //   .ability-slot {
  //     &__content {
  //       &-badge {
  //         @apply hidden;
  //       }

  //       &-factors {
  //         @apply flex;
  //       }
  //     }
  //   }
  // }
}
</style>

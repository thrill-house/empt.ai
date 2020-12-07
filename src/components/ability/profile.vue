<script>
import { mapGetters } from "vuex";
import { capitalize, sortBy } from "lodash-es";

// import AbilityInstallable from "./ability-installable";
// import AbilityResearchable from "./ability-researchable";
import AbilitySymbiotes from "./symbiotes";

import ValueList from "../value/list";
// import BaseBadge from "./base-badge";
// import BaseEra from "./base-era";
// import BaseFactors from "./base-factors";
// import BaseIcon from "./base-icon";

export default {
  name: "ability-profile",
  components: {
    AbilitySymbiotes,
    ValueList,
    // AbilityInstallable,
    // AbilityResearchable,
    // BaseBadge,
    // BaseEra,
    // BaseFactors,
    // BaseIcon,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  // created() {
  //   this.$on('research', this.researchDialog);
  //   this.$on('install', this.installDialog);
  // },
  data() {
    return {
      toggle: "attributes",
    };
  },
  computed: {
    ability() {
      return this.getAbility(this.id);
    },
    title() {
      return this.ability?.title;
    },
    // factors() {
    //   return this.ability?.factors;
    // },
    bases() {
      return this.ability?.bases;
    },
    // influence() {
    //   return this.factors.influence;
    // },
    // trees() {
    //   console.log(this.getAbilitySymbiotes(this.id));
    //   // return this.influence.trees;
    //   return [];
    // },

    tree() {
      return this.getTree(this.ability.treeId)?.title;
    },

    dependees() {
      return this.getAbilityDependees(this.id);
    },
    dependants() {
      return this.getAbilityDependants(this.id);
    },
    symbiotes() {
      return { receives: this.dependees, provides: this.dependants };
    },

    treeFactors() {
      return this.getAbilityTreeFactors(this.id);
    },
    eraFactors() {
      return this.getAbilityEraFactors(this.id);
    },
    sortedAttributes() {
      return {
        base: this.bases,
        tree: this.treeFactors,
        era: this.eraFactors,
      };
    },

    eras() {
      return sortBy(this.getEras, "stage");
    },
    era() {
      return this.getEra(this.ability.eraId)?.stage || 0;
    },
    // eraActive() {
    //   return this.getIsEraActive(this.era);
    // },
    // install() {
    //   return this.getInteraction("installingAbility");
    // },
    // installLabel() {
    //   return this.install ? this.install.label : "";
    // },
    // research() {
    //   return this.getInteraction("researchingAbility");
    // },
    // researchLabel() {
    //   return this.research ? this.research.label : "";
    // },
    // interaction() {
    //   return (
    //     this.researchLabel === this.label || this.installLabel === this.label
    //   );
    // },
    // ...mapState({
    //   abilities: (state) => state.abilities.list,
    // }),
    ...mapGetters({
      getAbility: "inventory/getAbility",
      getAbilityDependants: "inventory/getAbilityDependants",
      getAbilityDependees: "inventory/getAbilityDependees",
      getAbilityBaseFactors: "inventory/getAbilityBaseFactors",
      getAbilityTreeFactors: "inventory/getAbilityTreeFactors",
      getAbilityEraFactors: "inventory/getAbilityEraFactors",
      getTree: "app/Trees/one",
      getEras: "app/Eras/all",
      getEra: "app/Eras/one",
      // getIsEraActive,
      // getAbilityDependants,
      // getInteraction,
    }),
  },
  methods: {
    capitalize,
    viewToggle(view) {
      this.toggle = view;
    },
    // researchDialog() {
    //   this.$refs.research.startResearching();
    // },
    // installDialog() {
    //   this.$refs.install.startInstalling();
    // },
  },
};
</script>

<template>
  <article v-bem>
    <header v-bem:header>
      <h4 v-bem:headerTitle>{{ title }}</h4>
      <nav v-bem:headerNav>
        <button
          v-bem:headerToggle="{ active: toggle === 'attributes' }"
          @click="toggle = 'attributes'"
        >
          {{ $t("Attributes") }}
        </button>
        <button
          v-bem:headerToggle="{ active: toggle === 'symbiotes' }"
          @click="toggle = 'symbiotes'"
        >
          {{ $t("Symbiotes") }}
        </button>
      </nav>
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
    <div v-bem:symbiotes="{ active: toggle === 'symbiotes' }">
      <ability-symbiotes
        v-for="(symbiotes, symbiote) in symbiotes"
        v-bem:symbiotesList="{ [symbiote]: true }"
        :type="symbiote"
        :source="ability"
        :minimum="3"
        :symbiotes="symbiotes"
        :key="symbiote"
      />
    </div>
    <div v-bem:badge>
      <i v-bem:badgeIcon="{ [title]: true }" />
    </div>
    <div v-bem:tree>
      <i v-bem:treeIcon="{ [tree]: true }" />
    </div>
    <div v-bem:eras>
      <ol v-bem:erasList>
        <li
          v-for="(eraItem, e) in eras"
          v-bem:erasItem="{ active: eraItem.stage <= era }"
          :key="e"
        >
          <span v-bem:erasLabel>{{ eraItem }}</span>
        </li>
      </ol>
    </div>
  </article>
</template>

<style lang="scss">
.ability-profile {
  @apply relative;
  @apply w-80 h-32 my-8 ml-10 mr-6;
  @apply text-light;

  &:before {
    content: "";
    @apply absolute inset-0;
    @apply bg-grout;
    @apply bg-grout-sky bg-opacity-50;
    @apply clip-parallelogram;
    @apply z-10;
  }

  &:after {
    content: "";
    @apply absolute top-0 left-0;
    @apply w-16 h-16 -ml-5 -mt-3;
    @apply bg-tile;
    @apply border;
    @apply rounded-full;
    @apply overflow-hidden;
    @apply -z-10;
  }

  &__header {
    @apply relative flex items-center justify-between;
    @apply w-full h-6 pt-2 pl-10 pr-8 ml-1;
    @apply font-bold;
    @apply z-10;

    &-title {
      @apply uppercase;
    }

    &-nav {
      @apply flex;
      @apply text-xs;

      &::before {
        content: "|";
        @apply mx-1;
        @apply order-2;
      }
    }

    &-toggle {
      @apply order-first;

      & + & {
        @apply order-last;
      }

      &--active {
        @apply underline;
      }
    }
  }

  &__attributes {
    @apply relative hidden;
    @apply flex-col flex-wrap justify-between;
    @apply h-16 ml-16 mt-2 pl-16 pr-6 pb-2;
    @apply z-10;

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

      &--base {
        &:before {
          @apply mask-base;
        }
      }

      &--tree {
        &:before {
          @apply mask-tree;
        }
      }

      &--era {
        &:before {
          @apply mask-era;
        }
      }
    }

    &-label {
      @apply sr-only;
    }

    &-values {
      @apply flex justify-end;
      @apply h-10;
    }

    &-list {
      @apply flex flex-col items-end justify-evenly;

      &--base {
        @apply items-stretch self-stretch;

        > dt {
          // @apply mr-4;
        }

        > dd {
          @apply justify-between;

          &::before {
            @apply mr-2;
          }
        }
      }

      &--tree,
      &--era {
        > dd {
          &::before {
            @apply hidden;
          }
        }
      }
    }
  }

  &__symbiotes {
    @apply relative hidden;
    @apply h-16 ml-16 mt-1 pl-12 pr-2;
    @apply z-10;

    &--active {
      @apply flex;
    }

    &-list {
      @apply flex flex-wrap justify-between content-center;
      @apply w-1/2 mx-1;

      > * {
        @apply -my-1 order-3 mx-auto;

        &:first-child {
          @apply order-1 mx-0;
        }

        &:last-child {
          @apply mx-0 order-2;
        }
      }

      &--receives {
        @apply pr-1;
      }

      &--provides {
        @apply flex-wrap-reverse pl-1;
      }
    }
  }

  // &__actions {
  //   @apply relative;
  //   @apply flex items-start justify-end;
  //   @apply h-10  ml-16  pl-16 pr-2 pb-2;
  //   @apply z-10;

  //   &-installable,
  //   &-researchable {
  //     @apply flex-grow-0;
  //     @apply w-1/2;
  //   }

  //   &-installable {
  //     @apply mr-1;
  //   }

  //   &-researchable {
  //     @apply ml-1;
  //   }
  // }

  &__badge {
    @apply absolute top-0 left-0;
    @apply flex justify-center items-center;
    @apply w-24 h-24 ml-3 mt-8;
    @apply bg-tile;
    @apply rounded-full;
    @apply z-20;

    &:before {
      content: "";
      @apply w-full h-full;
      @apply bg-sky bg-opacity-50;
      @apply rounded-full;
      @apply border;
      @apply z-10;
    }

    &-icon {
      @apply absolute;
      @apply block;
      @apply w-12 h-12;
      @apply bg-light;
      @apply z-30;

      // TODO: Get all icons in here automatically somehow.
      &--Buzzie {
        @apply mask-buzzie;
      }

      &--Gamebryo {
        @apply mask-gamebryo;
      }
    }
  }

  &__tree {
    @apply absolute top-0 left-0;
    @apply flex justify-center items-center;
    @apply h-12 w-12 -ml-3 -mt-1;
    @apply bg-tile;
    @apply rounded-full;
    @apply z-20;

    &:before {
      content: "";
      @apply w-full h-full;
      @apply bg-sky bg-opacity-50;
      @apply rounded-full;
      @apply border;
      @apply z-10;
    }

    &-icon {
      @apply absolute;
      @apply block;
      @apply w-6 h-6;
      @apply z-30;

      &--Neutral {
        @apply mask-neutral bg-neutral;
      }

      &--Science {
        @apply mask-science bg-science;
      }

      &--Economy {
        @apply mask-economy bg-economy;
      }

      &--Society {
        @apply mask-society bg-society;
      }
    }
  }

  &__eras {
    @apply absolute top-0 left-0;
    @apply w-28 h-28 ml-1 mt-6;
    @apply bg-tile;
    @apply border;
    @apply rounded-full;
    @apply overflow-hidden;
    @apply z-0;

    &-list {
      @apply absolute bottom-0 left-0;
      @apply flex flex-col-reverse;
      @apply w-3 mb-8;
      @apply z-10;
    }

    &-item {
      @apply w-full h-1 mt-1;
      @apply bg-grey;

      &:first-child {
        @apply mb-1;
      }

      &--active {
        @apply bg-sky;
      }
    }

    &-label {
      @apply sr-only;
    }
  }
}
</style>

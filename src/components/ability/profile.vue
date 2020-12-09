<script>
import { mapGetters } from "vuex";
import { capitalize, keys, sortBy } from "lodash-es";

import AbilitySynergies from "./synergies";
import AbilityResearch from "./research";
import AbilityInstall from "./install";
import ValueList from "../value/list";

export default {
  name: "ability-profile",
  components: {
    AbilitySynergies,
    AbilityResearch,
    AbilityInstall,
    ValueList,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  provide() {
    return {
      id: this.id,
      ability: this.ability,
      title: this.title,
      tree: this.tree,
      era: this.era,
    };
  },
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
    tree() {
      return this.getTree(this.ability.treeId)?.title;
    },
    era() {
      return this.getEra(this.ability.eraId)?.stage || 0;
    },

    dependees() {
      return this.getAbilityDependees(this.id);
    },
    dependants() {
      return this.getAbilityDependants(this.id);
    },
    synergies() {
      return { receives: this.dependees, provides: this.dependants };
    },

    bases() {
      return this.ability?.bases;
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
        trees: this.treeFactors,
        eras: this.eraFactors,
      };
    },

    eras() {
      return sortBy(this.getEras, "stage");
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
      getModels: "inventory/getModels",
      getAbility: "inventory/getAbility",
      getAbilityDependants: "inventory/getAbilityDependants",
      getAbilityDependees: "inventory/getAbilityDependees",
      // getAbilityBaseFactors: "inventory/getAbilityBaseFactors", // Not using this currently, maybe later?
      getAbilityTreeFactors: "inventory/getAbilityTreeFactors",
      getAbilityEraFactors: "inventory/getAbilityEraFactors",
      getTree: "App/Trees/one",
      getEras: "App/Eras/all",
      getEra: "App/Eras/one",
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
    // async research() {
    //   const payload = {
    //     gameId: "5JzFvZqxS7CkDte98qfsMamDqQPzgwYUuLwQggDximZj",
    //     abilityId: "5JzFvZqxS7CkDte98qfsMamDqQPzgwYUuLwQggDximZj",
    //     feelings: [
    //       {
    //         emotionId: "5JzFvZqxS7CkDte98qfsMamDqQPzgwYUuLwQggDximZj",
    //         value: 2,
    //       },
    //       {
    //         emotionId: "5JzFvZqxS7CkDte98qfsMamDqQPzgwYUuLwQggDximZj",
    //         value: 1,
    //       },
    //       {
    //         emotionId: "5JzFvZqxS7CkDte98qfsMamDqQPzgwYUuLwQggDximZj",
    //         value: 1,
    //       },
    //     ],
    //   };

    //   await this.researchModel(payload);
    // },
    // ...mapActions({
    //   researchModel: "Game/Models/create",
    // }),
  },
};
</script>

<template>
  <article v-bem>
    <header v-bem:header>
      <h4 v-bem:headerTitle>{{ title }}</h4>
      <nav v-bem:headerNav>
        <button
          v-for="(viewLabel, view) in {
            attributes: $t('Attributes'),
            synergies: $t('Synergies'),
          }"
          v-bem:headerToggle="{ active: toggle === view }"
          @click="toggle = view"
          :key="view"
        >
          {{ viewLabel }}
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
    <div v-bem:synergies="{ active: toggle === 'synergies' }">
      <ability-synergies
        v-for="(synergies, synergy) in synergies"
        v-bem:synergiesList="{ [synergy]: true }"
        :type="synergy"
        :source="ability"
        :minimum="3"
        :synergies="synergies"
        :key="synergy"
      />
    </div>
    <div v-bem:actions>
      <ability-research />
      <ability-install />
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
@import "../../styles/util";

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
    @apply h-16 ml-16 mt-1 pl-16 pr-4 py-1;
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
      @apply flex flex-col items-end justify-evenly;

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
    }
  }

  &__synergies {
    @apply relative hidden;
    @apply h-16 ml-16 mt-1 pl-12 pr-1 pb-1;
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

  &__actions {
    @apply relative;
    @apply flex flex-row-reverse items-start justify-between;
    @apply h-10 ml-16 pl-16 pr-2 pb-2;
    @apply z-10;
  }

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

      @include icons("", Buzzie, Gamebryo);
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
        @apply bg-neutral;
      }

      &--Science {
        @apply bg-science;
      }

      &--Economy {
        @apply bg-economy;
      }

      &--Society {
        @apply bg-society;
      }

      @include icons("", Neutral, Science, Economy, Society);
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

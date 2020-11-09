<docs>
### Available ability
The component displays an ability that is defined within the global data store. If the player is not determined to be past the ability threshold, it will not be shown in any form to the player. If they are, depending on the whether a corresponding **research** or **purchase** event exists for the ability, it either displays options to enable it within the playing field, or to research it using in-game resources.

##### Properties
- `label` — A label referring to an ability in the global store.

##### Instantiation
`<ability-available label.string="ability-label"></ability-available>`
</docs>

<script>
import { mapGetters } from "vuex";

// import AbilityInstallable from "./ability-installable";
// import AbilityResearchable from "./ability-researchable";
// import AbilitySymbioses from "./ability-symbioses";
import AbilitySymbiotes from "./symbiotes";
// import BaseBadge from "./base-badge";
// import BaseEra from "./base-era";
// import BaseFactors from "./base-factors";
// import BaseIcon from "./base-icon";

export default {
  name: "ability-profile",
  components: {
    AbilitySymbiotes,
    // AbilityInstallable,
    // AbilityResearchable,
    // AbilitySymbioses,
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
  computed: {
    ability() {
      return this.getAbility(this.id);
    },
    title() {
      return this.ability?.title;
    },
    factors() {
      return this.ability?.factors;
    },
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
      // this.ability.treeId;
      return this.ability?.tree;
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
    era() {
      // this.ability.eraId;
      return this.ability?.era;
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
      // getIsEraActive,
      // getAbilityDependants,
      // getInteraction,
    }),
  },
  methods: {
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
    </header>
    <!-- <base-factors v-bem:factors :bases="bases" :trees="trees"></base-factors> -->
    <div v-bem:symbiotes>
      <ability-symbiotes
        v-for="(symbiote, s) in symbiotes"
        v-bem:symbiote="{ [s]: true }"
        :type="s"
        :source="ability"
        :minimum="3"
        :symbiotes="symbiote"
        :key="s"
      />
    </div>
    <!-- <div v-bem:actions>
      <ability-installable
        v-bem:actions-installable
        ref="install"
        :label="label"
      />
      <ability-researchable
        v-bem:actions-researchable
        ref="research"
        :label="label"
      />
    </div>
    <base-badge
      v-bem:icon
      size="large"
      stain="ash"
      borderColor="light"
      borderSize="small"
    >
      <base-icon size="large" color="light" :label="label" />
    </base-badge>
    <base-badge
      v-bem:tree
      size="small"
      stain="ash"
      borderColor="light"
      borderSize="small"
    >
      <base-icon size="small" :color="tree" :label="tree" />
    </base-badge>
    <base-badge
      v-bem:tree-background
      size="medium"
      borderColor="light"
      borderSize="small"
    />
    <base-badge
      v-bem:icon-background
      size="larger"
      borderColor="light"
      borderSize="small"
    >
      <base-era v-bem:era :label="ability.era"></base-era>
    </base-badge> -->
  </article>
</template>

<style lang="scss">
.ability-profile {
  @apply relative;
  @apply w-80 h-32 m-4;
  @apply text-light;

  &:before,
  &:after {
  }

  &:before {
    content: "";
    @apply absolute inset-0;
    @apply bg-sky-50;
    @apply clip-parallelogram;
  }

  &__header {
    @apply relative;
    @apply w-full h-6  py-1 pl-10;
    @apply z-10;

    &-title {
      @apply uppercase;
    }
  }

  &__factors {
    @apply h-16 ml-16 pl-16 pb-2;
    @apply z-10;
  }

  &__symbiotes {
    // @apply relative hidden;
    @apply relative flex;
    @apply h-16 ml-16 pl-16 pr-2 pb-2;
    @apply z-10;
  }
  &__symbiote {
    @apply flex flex-wrap  justify-between content-center;
    @apply w-1/2;

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

  &__actions {
    @apply relative;
    @apply flex items-start justify-end;
    @apply h-10  ml-16  pl-16 pr-2 pb-2;
    @apply z-10;

    &-installable,
    &-researchable {
      @apply flex-grow-0;
      @apply w-1/2;
    }

    &-installable {
      @apply mr-1;
    }

    &-researchable {
      @apply ml-1;
    }
  }

  &__icon {
    @apply absolute top-0 left-0;
    @apply ml-3 mt-6;
    @apply z-20;

    &-background {
      @apply absolute top-0 left-0;
      @apply ml-1 mt-4;
      @apply bg-tile;
    }
  }

  &__tree {
    @apply absolute top-0 left-0;
    @apply -ml-3 -mt-1 mb-2;
    @apply z-10;

    &-background {
      @apply absolute  top-0 left-0;
      @apply -ml-5 -mt-3;
    }
  }

  &__era {
    @apply absolute  bottom-0 left-0;
    @apply w-3  mb-10;
    @apply z-10;
  }

  &:hover &__factors {
    @apply hidden;
  }

  &:hover &__symbiotes {
    @apply flex;
  }
}
</style>

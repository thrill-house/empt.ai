<docs>
### Research ability
The component displays options for researching an ability, when available. A button is displayed that triggers a modal to select emotion values and confirm the ability research.

##### Instantiation
`<research-ability label="ability-label"></research-ability>`
</docs>

<template>
  <button
    v-if="ability"
    class="research-ability button bg-sky-25 text-light text-left text-xs px-3 py-px relative w-full"
    :class="{'cursor-wait': (!affordable)}"
    :disabled="!affordable"
    @click="research()"
  >
		<!--span
      class="absolute block pin h-full bg-sky-50 rounded z-0"
       :style="{width: affordability + '%'}"
    ></span-->
		<span class="relative z-10">
			{{ $t('Research') }}
      <br>
			<span class="font-bold filter-grayscale">{{ costs.confidence|confidence }}</span>
		</span>
	</button>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import store from "../store";

export default {
  name: "research-ability",
  store,
  props: {
    label: String
  },
  data: () => ({
    show: false
  }),
  computed: {
    ability: function() {
      return this.getAbility(this.label);
    },
    affordability: function() {
      return _.clamp(
        (this.scores.confidence / this.costs.confidence) * 100,
        0,
        100
      );
    },
    affordable: function() {
      return this.affordability === 100;
    },
    costs: function() {
      return this.getAbilityCosts(this.newEvent);
    },
    scores: function() {
      return this.getScores();
    },
    newEvent: function() {
      return {
        type: "ability",
        label: this.label,
        target: false,
        emotions: this.emotions
      };
    },
    ...mapState(["abilities"]),
    ...mapGetters([
      "getEventsOfType",
      "getAbility",
      "getAbilityCosts",
      "getScores",
      "isEraActive"
    ])
  },
  methods: {
    research: function() {
      this.setInteraction({
        interaction: "research",
        label: this.label
      });
    },
    openDialog: function() {
      this.show = true;
      console.log("openDialog");
      /*this.setInteraction({
        interaction: "researchingAbility",
        label: this.label,
        ability: this.getAbility(this.label)
      });*/
    },
    closeDialog: function() {
      this.show = false;
      //this.resetInteraction("researchingAbility");
    },
    ...mapActions(["addAbilityEvent", "setInteraction", "resetInteraction"])
  }
};
</script>

<style lang="scss">
.research-ability {
  .emotions {
    @apply .relative .block;

    .emotion-diagram {
      @apply .absolute .pin .w-full .h-full;
    }

    .axis {
      @apply .absolute .-mt-1;
      left: 50%;
      top: 50%;
      transform-origin: center left;

      &.axis-excitement {
        transform: rotate(90deg - 30deg);
      }

      &.axis-happiness {
        transform: rotate(90deg - 90deg);
      }

      &.axis-tenderness {
        transform: rotate(90deg - 150deg);
      }

      &.axis-fear {
        transform: rotate(90deg - 210deg);
      }

      &.axis-sadness {
        transform: rotate(90deg - 270deg);
      }

      &.axis-anger {
        transform: rotate(90deg - 330deg);
      }

      input {
        @apply .block .w-full .h-2 .rounded-full .bg-dark .opacity-25;
        -webkit-appearance: none;

        &:focus {
          outline: none;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        &::-ms-track {
          @apply .w-full .cursor-pointer .bg-transparent .text-transparent .border-transparent;
        }

        @mixin thumb {
          @apply .bg-transparent .h-4 .w-4 .rounded-full .cursor-pointer;
        }

        &::-webkit-slider-thumb {
          @include thumb;
        }

        &::-moz-range-thumb {
          @include thumb;
        }

        &::-ms-thumb {
          @include thumb;
        }

        &.max-1 {
          @apply .w-1/2;
        }

        &.max-0 {
          @apply .w-4;
        }
      }

      label {
        @apply .absolute .pin-b .pin-r .mb-2 .-mr-4 .text-xs;
        transform-origin: bottom right;
        transform: scale(0.75);
      }
    }
  }
}
</style>

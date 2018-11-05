<docs>
### Emotion diagram
Displays the player's emotional status as a result of their currently enabled abilities on the playing field. 

##### Instantiation
`<emotion-diagram :happiness.number="1" :sadness.number="2" :excitement.number="3" :fear.number="4" :tenderness.number="5" :anger.number="6" :scale.number="10"></emotion-diagram>`

---
</docs>

<template>
  <div class="emotion-diagram relative block bg-grey">
	  <div class="emotion-values absolute block pin w-full h-full bg-emotions" :style="clipPathStyle"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "emotion-diagram",
  store,
  props: {
    happiness: Number,
    sadness: Number,
    excitement: Number,
    fear: Number,
    tenderness: Number,
    anger: Number,
    scale: Number
  },
  computed: {
    max: function() {
      return _.max([
        this.happiness,
        this.sadness,
        this.excitement,
        this.fear,
        this.tenderness,
        this.anger,
        this.scale
      ]);
    },
    happinessRatio: function() {
      return this.calculateRatio(50, 0, this.happiness);
    },
    excitementRatio: function() {
      return this.calculateRatio(100, 25, this.excitement);
    },
    angerRatio: function() {
      return this.calculateRatio(100, 75, this.anger);
    },
    sadnessRatio: function() {
      return this.calculateRatio(50, 100, this.sadness);
    },
    fearRatio: function() {
      return this.calculateRatio(0, 75, this.fear);
    },
    tendernessRatio: function() {
      return this.calculateRatio(0, 25, this.tenderness);
    },
    clipPath: function() {
      return (
        "polygon(" +
        this.happinessRatio +
        ", " +
        this.excitementRatio +
        ", " +
        this.angerRatio +
        ", " +
        this.sadnessRatio +
        ", " +
        this.fearRatio +
        ", " +
        this.tendernessRatio +
        ")"
      );
    },
    clipPathStyle: function() {
      return {
        "clip-path": this.clipPath,
        "-webkit-clip-path": this.clipPath
      };
    }
  },
  methods: {
    calculateRatio: function(maxX, maxY, emotion) {
      var minX = 50 + (maxX - 50) * 0.1;
      var minY = 50 + (maxY - 50) * 0.1;
      var ratio = emotion / this.max;
      var differenceX = maxX - minX;
      var differenceY = maxY - minY;
      var distanceX = differenceX * ratio;
      var distanceY = differenceY * ratio;
      var valueX = minX + distanceX;
      var valueY = minY + distanceY;

      return valueX + "% " + valueY + "%";
    }
  }
};
</script>

<style lang="scss">
.emotion-diagram {
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  transform: translate3d(0, 0, 0);

  .emotion-values {
    transform: translate3d(0, 0, 0);
    animation: hue-rotate 8s linear infinite;
  }
}

@keyframes hue-rotate {
  from {
    -webkit-filter: hue-rotate(0);
    -moz-filter: hue-rotate(0);
    -ms-filter: hue-rotate(0);
    filter: hue-rotate(0);
  }
  to {
    -webkit-filter: hue-rotate(360deg);
    -moz-filter: hue-rotate(360deg);
    -ms-filter: hue-rotate(360deg);
    filter: hue-rotate(360deg);
  }
}
</style>

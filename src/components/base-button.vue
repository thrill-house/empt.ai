<docs>
### Base button
Buttons!

##### Instantiation
`<base-button></base-button>`
</docs>

<script>
export default {
  name: 'base-button',
  blockName: 'button',
  props: {
    label: String,
    color: {
      type: [String, Boolean],
      default: function() {
        return this.showProgress ? 'navy' : 'sky';
      },
    },
    size: {
      type: [String, Boolean],
      default: 'medium',
    },
    font: {
      type: [String, Boolean],
      default: 'bold',
    },
    progressColor: {
      type: [String, Boolean],
      default: function() {
        return 'sky';
      },
    },
    progress: {
      type: [Number, Boolean],
      default: false,
    },
  },
  computed: {
    showProgress: function() {
      return _.isFinite(this.progress) && this.progress < 100;
    },
  },
};
</script>

<template>
  <button v-bem="{ color, size, font }">
    <span
      v-if="showProgress"
      v-bem:progress="{ color: progressColor }"
      :style="{ width: progress + '%' }"
    ></span>
    <slot></slot>
  </button>
</template>

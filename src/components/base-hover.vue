<docs>
### Base hover
Helper component for hover methods
</docs>

<script>
export default {
  name: 'base-hover',
  data: () => ({
    hover: false,
    position: { top: 0, left: 0 },
  }),
  methods: {
    over() {
      this.hover = true;
    },
    out() {
      this.hover = false;
    },
    move(event) {
      this.position = { top: event.pageY, left: event.pageX };
    },
  },
};
</script>

<template></template>

export default {
  data: () => ({
    hover: false,
    position: {
      top: 0,
      left: 0,
    },
  }),
  methods: {
    enter() {
      this.hover = true;
    },
    leave() {
      this.hover = false;
    },
    move(event) {
      this.position = {
        top: event.pageY,
        left: event.pageX,
      };
    },
  },
};

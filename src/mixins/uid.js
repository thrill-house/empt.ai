import { uniqueId } from "lodash-es";

export default {
  props: {
    uid: {
      type: String,
      default: () => `uid-${uniqueId()}`,
    },
  },
};

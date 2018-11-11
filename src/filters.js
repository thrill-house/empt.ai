import Vue from "vue";
import math from "mathjs";
import numeral from "numeral";
import moment from "moment";

Vue.filter("duration", str =>
  moment()
    .subtract(str / 1000, "seconds")
    .fromNow(true)
);

Vue.filter(
  "percentage",
  str =>
    str
      ? math
          .chain(str)
          .subtract(1)
          .multiply(100)
          .format(4).value + "%"
      : 0
);

Vue.filter("data", str =>
  numeral(str)
    .multiply(1000)
    .format("0.[00] b")
);

Vue.filter("bandwidth", str => Vue.filter("data")(str));

Vue.filter(
  "confidence",
  str => numeral(str).format("0.[000] a") + " followers"
);

Vue.filter("persuasion", str => numeral(str).format("0.[000] a") + "👍");
Vue.filter("influence", str => Vue.filter("persuasion")(str));
Vue.filter("science", str => Vue.filter("percentage")(str) + " science");
Vue.filter("economy", str => Vue.filter("percentage")(str) + " economy");
Vue.filter("society", str => Vue.filter("percentage")(str) + " society");

import { keys } from "lodash-es";
import { chain } from "mathjs";
import dayjs from "dayjs";
import numeral from "numeral";

export default (el, { arg, value, modifiers }) => {
  const duration = (milliseconds) =>
    dayjs().subtract(milliseconds / 1000, "seconds");

  const percentage = (number) =>
    number
      ? `${
          chain(number)
            .multiply(100)
            .format(4).value
        }%`
      : 0;

  const data = (bytes) =>
    numeral(bytes)
      .multiply(1024)
      .format("0.00b");

  const bandwidth = (bytes) => `${data(bytes)}/sec`;

  const confidence = (trust) => `${numeral(trust).format("0.[00]a")}`;

  const influence = (likes) => `${numeral(likes).format("0.[00]a")}/sec`;

  const formatters = {
    duration,
    percentage,
    data,
    bandwidth,
    confidence,
    influence,
  };

  const [pre = "", post = ""] = keys(modifiers);

  if (formatters[arg] && value !== undefined) {
    el.innerText = `${pre}${formatters[arg](value)}${post}`;
  }
};

import { chain } from "mathjs";
import dayjs from "dayjs";
import numeral from "numeral";

export default (el, { arg, value }) => {
  const duration = (milliseconds) =>
    dayjs().subtract(milliseconds / 1000, "seconds");

  const percentage = (number) =>
    number
      ? `${
          chain(number)
            .subtract(1)
            .multiply(100)
            .format(4).value
        }%`
      : 0;

  const data = (bytes) =>
    numeral(bytes)
      .multiply(1000)
      .format("0.00b");

  const bandwidth = (bytes) => `${data(bytes)}/s`;

  const confidence = (loves) => `${numeral(loves).format("0.[00]a")}❤`;

  const influence = (likes) =>
    `${numeral(likes)
      .multiply(1000)
      .format("0.[00]a")}★/s`;

  const formatters = {
    duration,
    percentage,
    data,
    bandwidth,
    confidence,
    influence,
  };

  if (formatters[arg] && value !== undefined) {
    el.innerText = formatters[arg](value);
  }
};

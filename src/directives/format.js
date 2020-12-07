import { endsWith, keys, reduce } from "lodash-es";
import { chain } from "mathjs";
import dayjs from "dayjs";
import numeral from "numeral";

numeral.register("format", "likes", {
  regexps: {
    format: /(\/likes)/,
    unformat: /(\/likes)/,
  },
  format: (value, format, roundingFunction) => {
    const space = endsWith(format, " /likes") ? " " : "";
    const newFormat = format.replace(/\s?\/likes/, "");
    const newValue = reduce(
      { day: 7, hour: 24, min: 60, sec: 60 },
      (accum, duration, label) => {
        const check = accum.value / duration;
        if (check > 1) {
          accum = { value: check, label };
        }

        return accum;
      },
      { value, label: "week" }
    );

    const output = numeral._.numberToFormat(
      newValue.value,
      newFormat,
      roundingFunction
    );

    return `${output}${space}/${newValue.label}`;
  },
  unformat: (string) => {
    return numeral._.stringToNumber(string) * 0.01;
  },
});

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

  const bandwidth = (bytes) => `${data(bytes)}`;

  const confidence = (trust) => `${numeral(trust).format("0.[00]a")}`;

  const influence = (likes) => `${numeral(likes).format("0.[00]a/likes")}`;

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

const withAlphaVariable = require("tailwindcss/lib/util/withAlphaVariable");
const path = require("path");
const glob = require("glob");
const hexRatio = Math.sqrt(3 / 2);
console.log(hexRatio);

module.exports = {
  purge: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    /* Colors */
    colors: {
      transparent: "transparent",
      dark: "#000",
      ash: "#666",
      grey: "#bbb",
      light: "#fff",
      sky: "#68abe7",
      blue: "#353d77",
      navy: "#20364b",
      midnight: "#122356",
      science: "#74ebcf",
      society: "#f4838e",
      economy: "#fbeb69",
      influence: "#76a5ff",
      confidence: "#76a5ff",
      bandwidth: "#94e4f8",
      data: "#94e4f8",
      neutral: "#a6d3ff",
    },

    /* Font families */
    fontFamily: {
      primary: ["Titillium Web", "Helvetica", "Arial", "sans-serif"],
      mono: [
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      opacity: {
        "10": "0.1",
        "90": "0.9",
      },
      fontSize: {
        "3xs": ".5rem",
        "2xs": ".625rem",
      },
      inset: {
        unset: "unset",
      },
      spacing: {
        "28": "7rem",
        "48": "12rem",
        "80": "20rem",
        "96": "24rem",
        "128": "32rem",
        "132": "33rem",
        "144": "36rem",
        "160": "40rem",
        "192": "48rem",
        "1/2": "50%",
        "1/3": "33.33333%",
        "2/3": "66.66667%",
        "1/4": "25%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.66667%",
        "5/6": "83.33333%",
        "hex*1": `${0.25 * hexRatio}rem`,
        "hex*2": `${0.5 * hexRatio}rem`,
        "hex*3": `${0.75 * hexRatio}rem`,
        "hex*4": `${1 * hexRatio}rem`,
        "hex*6": `${1.5 * hexRatio}rem`,
        "hex*8": `${2 * hexRatio}rem`,
        "hex*10": `${2.5 * hexRatio}rem`,
        "hex*12": `${3 * hexRatio}rem`,
        "hex*16": `${4 * hexRatio}rem`,
        "hex*24": `${6 * hexRatio}rem`,
        "hex*32": `${8 * hexRatio}rem`,
        "hex*48": `${12 * hexRatio}rem`,
        "hex*64": `${16 * hexRatio}rem`,
        "full*2": "200%",
      },
      minWidth: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        "16": "4rem",
        "24": "6rem",
        "28": "7rem",
        "32": "8rem",
        "48": "12rem",
        "80": "20rem",
        "96": "24rem",
      },
      maxWidth: {
        "48": "12rem",
        "80": "20rem",
        "96": "24rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
  // TODO: Remove this in place of doing it the TW 2.0 way: https://tailwindcss.com/docs/functions-and-directives#layer
  plugins: [
    function({ addComponents, addBase, theme }) {
      const backgroundComponents = {};

      // TODO: Move these into a css import — NEED TO BE TW COMPONENTS BECAUSE OF SPECIFICITY ISSUES
      Object.keys(theme("colors")).forEach((color) => {
        backgroundComponents[`.bg-grout-${color}`] = {
          ...withAlphaVariable.default({
            color: theme(`colors.${color}`),
            property: "--grout-color",
            variable: "--tw-bg-opacity",
          }),
        };
        backgroundComponents[`.bg-dots-${color}`] = {
          ...withAlphaVariable.default({
            color: theme(`colors.${color}`),
            property: "--dots-color",
            variable: "--tw-bg-opacity",
          }),
        };
      });

      const imageBases = { ":root": {} };
      const maskComponents = {};

      glob.sync("src/assets/**/*.svg").forEach((file) => {
        const image = path.basename(file, ".svg");

        imageBases[":root"][`--image-${image}`] = `url(${path.relative(
          "./src/styles",
          file
        )})`;
        maskComponents[`.mask-${image}`] = {
          "mask-image": `var(--image-${image})`,
          "mask-size": "contain",
          "mask-repeat": "no-repeat",
          "mask-position": "center center",
        };
      });

      addBase([imageBases]);

      addComponents([backgroundComponents, maskComponents], {
        variants: ["responsive"],
      });
    },
  ],
};

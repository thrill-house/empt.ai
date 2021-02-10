const withAlphaVariable = require("tailwindcss/lib/util/withAlphaVariable");
const path = require("path");
const glob = require("glob");
const hexRatio = 1 / (Math.sqrt(3) / 2);

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
      stop: "#DC2626",
      wait: "#F59E0B",
      go: "#34D399",
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
      fontSize: {
        "3xs": ".5rem",
        "2xs": ".625rem",
      },
      inset: {
        unset: "unset",
      },
      spacing: {
        "144": "36rem",
        "192": "48rem",
        "hex*6": "calc(1.5rem * var(--hex-ratio))",
        "hex*14": "calc(3.5rem * var(--hex-ratio))",
        "hex*16": "calc(4rem * var(--hex-ratio))",
        "hex*48": "calc(12rem * var(--hex-ratio))",
        "hex/144": "calc(36rem / var(--hex-ratio))",
      },
      zIndex: {
        "-10": "-10",
      },
      rotate: {
        // 0 / 360
        "60": "60deg",
        "120": "120deg",
        "180": "180deg",
        "240": "240deg",
        "300": "300deg",
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

      const imageBases = { ":root": { "--hex-ratio": `${hexRatio}` } };
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

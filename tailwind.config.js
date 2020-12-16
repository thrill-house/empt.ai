const withAlphaVariable = require("tailwindcss/lib/util/withAlphaVariable");

const hexRatio = Math.sqrt(3 / 2);

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
      spacing: {
        "28": "7rem",
        "48": "12rem",
        "80": "20rem",
        "96": "24rem",
        "128": "32rem",
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
        "hex/16": `${4 / hexRatio}rem`,
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
    function({ addComponents, theme }) {
      // TODO: Move these into a css import
      const clipUtilities = {
        ".clip-corners": {
          "clip-path":
            "polygon(0.333rem 0%, calc(100% - 0.333rem) 0%, 100% 0.333rem, 100% calc(100% - 0.333rem), calc(100% - 0.333rem) 100%, 0.333rem 100%, 0% calc(100% - 0.333rem), 0% 0.333rem)",
        },
        ".clip-2-corners": {
          "clip-path":
            "polygon(0.666rem 0%, 100% 0%, 100% calc(100% - 0.666rem), calc(100% - 0.666rem) 100%, 0% 100%, 0% 0.666rem)",
        },
        ".clip-hexagon": {
          "clip-path":
            "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
        },
        ".clip-parallelogram": {
          "clip-path":
            "polygon(calc(100% - 1.5rem) 0, 100% 1.5rem, 100% 100%, 40% 100%, 0 0)",
        },
        ".clip-1-corner": {
          "clip-path": "polygon(0 0%, 75% 0%, 100% 100%, 0 100%)",
        },
      };

      // TODO: Move these into a css import
      const backgroundUtilities = {
        ".bg-dots": {
          "background-image": "var(--dots-x), var(--dots-y)",
          "background-position": "center center",
          "background-size": "2px 2px",
        },
        ".bg-tile": {
          "background-image": `var(--image-tile), radial-gradient(circle at 50% 100%, var(--tw-gradient-stops))`,
          "background-position": "left top, center top",
          "background-repeat": "repeat, no-repeat",
          "background-size": "auto, cover",
          "background-attachment": "fixed, fixed",
        },
        ".bg-grout": {
          "--grout": `linear-gradient(var(--grout-color) 0%, var(--grout-color) 100%)`,
          "background-image": `var(--grout), var(--image-tile), radial-gradient(circle at 50% 100%, var(--tw-gradient-stops))`,
          "background-position": "left top, left top, center top",
          "background-repeat": "repeat, repeat, no-repeat",
          "background-size": "auto, auto, cover",
          "background-attachment": "fixed, fixed, fixed",
        },
      };

      // TODO: Move these into a css import — NEED TO BE TW COMPONENTS BECAUSE OF SPECIFICITY ISSUES
      Object.keys(theme("colors")).forEach((color) => {
        backgroundUtilities[`.bg-grout-${color}`] = {
          ...withAlphaVariable.default({
            color: theme(`colors.${color}`),
            property: "--grout-color",
            variable: "--tw-bg-opacity",
          }),
        };
      });

      // TODO: Move these into a css import
      const maskUtilities = [
        // Util
        "loading",
        "installing",

        // Values
        "base",
        "factor",
        "data",
        "confidence",
        "bandwidth",
        "influence",

        // Trees
        "trees",
        "neutral",
        "science",
        "economy",
        "society",

        // Eras
        "eras",
        "hobbyist",
        "university",
        "business",
        "government",
        "consciousness",

        // Emotions
        "happiness",
        "sadness",
        "excitement",
        "fear",
        "tenderness",
        "anger",

        // Nav
        "inventory",
        "settings",

        // Abilities
        "empty",
        "unknown",
        "view",
        "attributes",
        "synergies",
        "buzzie",
        "gamebryo",
      ].reduce((result, mask) => {
        result[`.mask-${mask}`] = {
          "mask-image": `var(--image-${mask})`,
          "mask-size": "contain",
          "mask-repeat": "no-repeat",
          "mask-position": "center center",
        };

        return result;
      }, {});

      addComponents([clipUtilities, backgroundUtilities, maskUtilities], {
        variants: ["responsive"],
      });
    },
  ],
};

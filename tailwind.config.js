const _ = require("lodash");
const α = require("color-alpha");

const hexRatio = Math.sqrt(3 / 2);

const colorList = {
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
};

const opacities = {
  "0": 0,
  "10": 0.1,
  "25": 0.25,
  "50": 0.5,
  "75": 0.75,
  "90": 0.9,
  "100": 1,
};

module.exports = {
  colorList,
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    /* Colors */
    colors: _.reduce(
      colorList,
      function(result, color, c) {
        result[c] = color;

        if (color !== "transparent") {
          _.each(opacities, (opacity, o) => {
            if (opacity > 0 && opacity < 1) {
              result[`${c}-${o}`] = α(color, opacity);
            }
          });
        }

        return result;
      },
      {}
    ),

    opacity: opacities,

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

    /* Font sizes */
    fontSize: {
      "3xs": ".5625rem",
      "2xs": ".625rem",
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    extend: {
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
      },
      maxWidth: {
        "48": "12rem",
        "96": "24rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
  variants: {},
  plugins: [
    function({ addUtilities, theme }) {
      let clipUtilities = {
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
      };

      let bg = {
        dotsX: `linear-gradient(to right, ${theme(
          "colors.dark"
        )} 1px, transparent 1%)`,
        dotsY: `linear-gradient(to bottom, ${theme(
          "colors.dark"
        )} 1px, transparent 1%)`,
        tile: "url(/assets/img/tile.svg)",
        gradient: `radial-gradient(closest-side at 50% 100%, ${theme(
          "colors.blue"
        )} 2%, ${theme("colors.midnight")} 42%, ${theme("colors.dark")} 100%)`,
      };

      let backgroundUtilities = {
        ".bg-dots": {
          "background-image": `${bg.dotsX}, ${bg.dotsY}`,
          "background-position": "center center",
          "background-size": "2px 2px",
        },
        ".bg-tile": {
          "background-image": `${bg.tile}, ${bg.gradient}`,
          "background-position": "left top, center top",
          "background-repeat": "repeat, no-repeat",
          "background-size": "auto, cover",
          "background-attachment": "fixed, fixed",
        },
        ".bg-stain": {
          "background-position": "left top, left top, center top",
          "background-repeat": "repeat, repeat, no-repeat",
          "background-size": "auto, auto, cover",
          "background-attachment": "fixed, fixed, fixed",
        },
      };

      _.each(theme("colors"), (color, label) => {
        backgroundUtilities[`.bg-stain-${label}`] = {
          "background-image": `linear-gradient(${color} 0%, ${color} 100%), ${bg.tile}, ${bg.gradient}`,
        };
      });

      addUtilities([clipUtilities, backgroundUtilities], {
        variants: ["responsive"],
      });
    },
  ],
};

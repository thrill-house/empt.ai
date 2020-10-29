/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.


|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// let defaultConfig = require('tailwindcss/defaultConfig')()

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

const _ = require("lodash");
const α = require("color-alpha");

let hexRatio = Math.sqrt(3 / 2);

let colorList = {
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

let opacities = {
  "0": 0,
  "10": 0.1,
  "25": 0.25,
  "50": 0.5,
  "75": 0.75,
  "90": 0.9,
  "100": 1,
};

module.exports = {
  theme: {
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

    screens: {
      //'sm': '576px',
      md: "768px",
      //'lg': '992px',
      xl: "1200px",
    },

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

    fontSize: {
      "3xs": ".5625rem", // 9px
      "2xs": ".625rem", // 10px
      xs: ".75rem", // 12px
      sm: ".875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },

    fontWeight: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      loose: 2,
    },

    letterSpacing: {
      tight: "-0.05em",
      normal: "0",
      wide: "0.05em",
    },

    textColor: (theme) => theme("colors"),

    backgroundColor: (theme) => theme("colors"),

    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
    },

    borderWidth: {
      default: "1px",
      "0": "0",
      "2": "2px",
      "4": "4px",
      "8": "8px",
    },

    borderColor: (theme) => ({
      default: theme("colors.grey-light"),
      ...theme("colors"),
    }),

    borderRadius: {
      none: "0",
      sm: ".125rem",
      default: ".25rem",
      lg: ".5rem",
      full: "9999px",
    },

    width: {
      auto: "auto",
      px: "1px",
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
      "64": "16rem",
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
      full: "100%",
      "full*2": "200%",
      screen: "100vw",
    },

    height: {
      auto: "auto",
      px: "1px",
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
      "64": "16rem",
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
      full: "100%",
      "full*2": "200%",
      screen: "100vh",
    },

    minWidth: {
      "0": "0",
      px: "1px",
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
      "64": "16rem",
      "80": "20rem",
      "96": "24rem",
      "128": "32rem",
      "160": "40rem",
      "192": "48rem",
      full: "100%",
    },

    minHeight: {
      "0": "0",
      full: "100%",
      screen: "100vh",
    },

    maxWidth: {
      px: "1px",
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
      "64": "16rem",
      "80": "20rem",
      "96": "24rem",
      "128": "32rem",
      "160": "40rem",
      "192": "48rem",
      full: "100%",
    },

    maxHeight: {
      full: "100%",
      screen: "100vh",
    },

    padding: {
      px: "1px",
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "16": "4rem",
    },

    margin: {
      auto: "auto",
      px: "1px",
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "16": "4rem",
      "hex/16": `${4 / hexRatio}rem`,
      "-px": "1px",
      "-1": "0.25rem",
      "-2": "0.5rem",
      "-3": "0.75rem",
      "-4": "1rem",
      "-5": "1.25rem",
      "-6": "1.5rem",
      "-8": "2rem",
      "-10": "2.5rem",
      "-12": "3rem",
      "-16": "4rem",
      "-hex/16": `${4 / hexRatio}rem`,
    },

    boxShadow: {
      default: "0 2px 4px 0 rgba(0,0,0,0.10)",
      md: "0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)",
      lg: "0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)",
      inner: "inset 0 2px 4px 0 rgba(0,0,0,0.06)",
      none: "none",
    },

    zIndex: {
      auto: "auto",
      "-1": -1,
      "0": 0,
      "1": 1,
      "2": 2,
      "10": 10,
      "20": 20,
      "30": 30,
      "40": 40,
      "50": 50,
    },

    opacity: opacities,

    fill: {
      current: "currentColor !important",
    },

    stroke: {
      current: "currentColor !important",
    },
  },

  variants: {
    accessibility: ["responsive", "focus"],
    alignContent: ["responsive"],
    alignItems: ["responsive"],
    alignSelf: ["responsive"],
    appearance: ["responsive"],
    backgroundAttachment: ["responsive"],
    backgroundClip: ["responsive"],
    backgroundColor: ["responsive", "hover", "focus"],
    backgroundImage: ["responsive"],
    gradientColorStops: ["responsive", "hover", "focus"],
    backgroundOpacity: ["responsive", "hover", "focus"],
    backgroundPosition: ["responsive"],
    backgroundRepeat: ["responsive"],
    backgroundSize: ["responsive"],
    borderCollapse: ["responsive"],
    borderColor: ["responsive", "hover", "focus"],
    borderOpacity: ["responsive", "hover", "focus"],
    borderRadius: ["responsive"],
    borderStyle: ["responsive"],
    borderWidth: ["responsive"],
    boxShadow: ["responsive", "hover", "focus"],
    boxSizing: ["responsive"],
    container: ["responsive"],
    cursor: ["responsive"],
    display: ["responsive"],
    divideColor: ["responsive"],
    divideOpacity: ["responsive"],
    divideStyle: ["responsive"],
    divideWidth: ["responsive"],
    fill: ["responsive"],
    flex: ["responsive"],
    flexDirection: ["responsive"],
    flexGrow: ["responsive"],
    flexShrink: ["responsive"],
    flexWrap: ["responsive"],
    float: ["responsive"],
    clear: ["responsive"],
    fontFamily: ["responsive"],
    fontSize: ["responsive"],
    fontSmoothing: ["responsive"],
    fontVariantNumeric: ["responsive"],
    fontStyle: ["responsive"],
    fontWeight: ["responsive", "hover", "focus"],
    height: ["responsive"],
    inset: ["responsive"],
    justifyContent: ["responsive"],
    justifyItems: ["responsive"],
    justifySelf: ["responsive"],
    letterSpacing: ["responsive"],
    lineHeight: ["responsive"],
    listStylePosition: ["responsive"],
    listStyleType: ["responsive"],
    margin: ["responsive"],
    maxHeight: ["responsive"],
    maxWidth: ["responsive"],
    minHeight: ["responsive"],
    minWidth: ["responsive"],
    objectFit: ["responsive"],
    objectPosition: ["responsive"],
    opacity: ["responsive", "hover", "focus"],
    order: ["responsive"],
    outline: ["responsive", "focus"],
    overflow: ["responsive"],
    overscrollBehavior: ["responsive"],
    padding: ["responsive"],
    placeContent: ["responsive"],
    placeItems: ["responsive"],
    placeSelf: ["responsive"],
    placeholderColor: ["responsive", "focus"],
    placeholderOpacity: ["responsive", "focus"],
    pointerEvents: ["responsive"],
    position: ["responsive"],
    resize: ["responsive"],
    space: ["responsive"],
    stroke: ["responsive"],
    strokeWidth: ["responsive"],
    tableLayout: ["responsive"],
    textAlign: ["responsive"],
    textColor: ["responsive", "hover", "focus"],
    textOpacity: ["responsive", "hover", "focus"],
    textDecoration: ["responsive", "hover", "focus"],
    textTransform: ["responsive"],
    userSelect: ["responsive"],
    verticalAlign: ["responsive"],
    visibility: ["responsive"],
    whitespace: ["responsive"],
    width: ["responsive"],
    wordBreak: ["responsive"],
    zIndex: ["responsive"],
    gap: ["responsive"],
    gridAutoFlow: ["responsive"],
    gridTemplateColumns: ["responsive"],
    gridAutoColumns: ["responsive"],
    gridColumn: ["responsive"],
    gridColumnStart: ["responsive"],
    gridColumnEnd: ["responsive"],
    gridTemplateRows: ["responsive"],
    gridAutoRows: ["responsive"],
    gridRow: ["responsive"],
    gridRowStart: ["responsive"],
    gridRowEnd: ["responsive"],
    transform: ["responsive"],
    transformOrigin: ["responsive"],
    scale: ["responsive", "hover", "focus"],
    rotate: ["responsive", "hover", "focus"],
    translate: ["responsive", "hover", "focus"],
    skew: ["responsive", "hover", "focus"],
    transitionProperty: ["responsive"],
    transitionTimingFunction: ["responsive"],
    transitionDuration: ["responsive"],
    transitionDelay: ["responsive"],
    animation: ["responsive"],
  },

  plugins: [
    // require("tailwindcss-transitions")({
    //   properties: {
    //     none: "none",
    //     all: "all",
    //     opacity: "opacity",
    //     transform: "transform",
    //     z: "z-index",
    //     modal: ["opacity", "z-index"],
    //   },
    //   durations: {
    //     none: "0ms",
    //     fast: "300ms",
    //     default: "600ms",
    //     slow: "1200ms",
    //   },
    //   timingFunctions: {
    //     default: "linear",
    //     ease: "ease",
    //     "ease-in-out": "ease-in-out",
    //   },
    //   delays: {
    //     none: "0ms",
    //     short: "300ms",
    //     medium: "600ms",
    //     long: "1200ms",
    //   },
    //   willChange: {
    //     opacity: "opacity",
    //     transform: "transform",
    //   },
    //   variants: ["responsive"],
    // }),
    // require("tailwindcss-transforms")({
    //   translate: {
    //     "0": "0",
    //     "1": "0.25rem",
    //     "2": "0.5rem",
    //     "3": "0.75rem",
    //     "4": "1rem",
    //     full: "100%",
    //     screen: "100vh",
    //   },
    //   negativeTranslate: {
    //     "0": "0",
    //     "1": "0.25rem",
    //     "2": "0.5rem",
    //     "3": "0.75rem",
    //     "4": "1rem",
    //     full: "100%",
    //     screen: "100vh",
    //   },
    //   scale: {
    //     "0": "0",
    //     "90": "0.9",
    //     "100": "1",
    //     "110": "1.1",
    //     button: "1.05",
    //   },
    //   rotate: {
    //     "0": "0deg",
    //     "45": "45deg",
    //     "90": "90deg",
    //     "180": "180deg",
    //     "360": "360deg",
    //   },
    //   negativeRotate: {
    //     "45": "45deg",
    //     "90": "90deg",
    //     "180": "180deg",
    //   },
    //   skew: false,
    //   negativeSkew: false,
    //   origins: false,
    //   variants: ["responsive", "hover"],
    // }),
    require("tailwindcss-filters")({
      variants: ["responsive"],
      filters: {
        none: "none",
        grayscale: "grayscale(100%)",
        shadow: `drop-shadow(0 2px 4px ${theme["colors.dark-10"]})`,
        "shadow-md": `drop-shadow(0 4px 8px ${theme["colors.dark-25"]})`,
      },
      backdropFilters: {},
    }),
    require("tailwindcss-layout")({
      aspectRatio: {
        full: 1,
        "4/3": 4 / 3,
        "16/9": 16 / 9,
      },
      variants: ["responsive"],
    }),
    function({ addComponents, addUtilities, config }) {
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
        dotsX: `linear-gradient(to right, ${config(
          "colors.dark"
        )} 1px, transparent 1%)`,
        dotsY: `linear-gradient(${config("colors.dark")} 1px, transparent 1%)`,
        tile: "url(/assets/img/tile.svg)",
        gradient: `radial-gradient(50% 100%, ${config(
          "colors.blue"
        )} 2%, ${config("colors.midnight")} 42%, ${config(
          "colors.dark"
        )} 100%)`,
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

      _.each(config("colors"), (color, label) => {
        backgroundUtilities[`.bg-stain-${label}`] = {
          "background-image": `linear-gradient(${color} 0%, ${color} 100%), ${bg.tile}, ${bg.gradient}`,
        };
      });

      addUtilities([clipUtilities, backgroundUtilities], {
        variants: ["responsive"],
      });
    },
  ],

  experiments: {
    shadowLookup: true,
  },
};

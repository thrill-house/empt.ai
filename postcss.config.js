const _ = require("lodash");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const fs = require("fs");
const path = require("path");
const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config.js");

module.exports = {
  plugins: [
    function() {
      let vars = ["colorList"],
        tailwind = resolveConfig(tailwindConfig),
        outputPath = path.join(__dirname, "src/styles/_$variables.scss"),
        current = fs.readFileSync(outputPath).toString(),
        content = "",
        sassify = function(variable) {
          let lines = [`$${variable}: (`];
          let valueLines = [];

          _.each(tailwind.theme.colors, function(value, key) {
            valueLines.push(`  ${key}: ${value}`);
          });
          lines.push(_.join(valueLines, ",\n"));
          lines.push(");\n");

          return _.join(lines, "\n");
        };

      _.each(vars, function(value) {
        content += sassify(value);
      });

      if (content !== current) {
        fs.writeFileSync(outputPath, content);
      }
    },
    tailwindcss,
    autoprefixer,
  ],
};

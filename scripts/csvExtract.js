const yargs = require("yargs");
const fs = require("fs").promises;
const parse = require("csv-parse/lib/sync");
const ejs = require("ejs");
const zipObject = require("lodash/zipObject");

const argv = yargs
  .option("input", {
    alias: "i",
    description: "Provide a file path to a CSV you want to convert.",
  })
  .option("output", {
    alias: "o",
    description: "Provide a location to output the converted file.",
  })
  .option("template", {
    alias: "t",
    description: "Which template should be used to convert this CSV.",
  })
  .demandOption(
    ["input"],
    "Please provide an input file to work with this tool."
  )
  .help()
  .alias("help", "h").argv;

const { input, output, template } = argv;

(async function() {
  const content = await fs.readFile(input);
  const records = parse(content);

  const items = [];
  const keys = records[0];

  await records.splice(1).map(async (record) => {
    const data = zipObject(keys, record);

    if (data.ID) {
      const result = await ejs.renderFile(template, { data });
      items.push(result);
    }
  });

  await fs.writeFile(`${output}/output.json`, `[${items.join(",")}]`);
})();

const yargs = require("yargs");
const fs = require("fs").promises;
const parse = require("csv-parse/lib/sync");
const zipObject = require("lodash.zipobject");
const find = require("lodash.find");

const argv = yargs
  .option("input", {
    alias: "i",
    description:
      "Provide a file path to a JSON file you want to extract IDs from.",
  })
  .option("output", {
    alias: "o",
    description: "Provide a file path to a CSV that you'd like to update.",
  })
  .demandOption(
    ["input", "output"],
    "Please provide an input and output file to work with this tool."
  )
  .help()
  .alias("help", "h").argv;

const { input, output } = argv;

(async function() {
  const updates = JSON.parse(await fs.readFile(input));
  const content = await fs.readFile(output);
  let records = parse(content);
  const items = [];

  const keys = records[0];

  await records.splice(1).map(async (record) => {
    const data = zipObject(keys, record);
    const update = find(updates, { title: data["Title"] });

    if (update) {
      record[1] = update["$id"];
    }

    items.push(record);
  });

  // console.log(items);

  await fs.writeFile(
    `/Users/Mike/Desktop/Balancing/output2.csv`,
    `${items.join("\n")}`
  );
})();

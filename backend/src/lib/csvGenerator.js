const stripCommas = string => string && String(string).replace(/, */g, ' ');

const arraysToCsv = lines => lines.map(line => line.map(stripCommas).join(',')).join('\n');

const generateCsv = (fields, objects) => (
  arraysToCsv(
    [fields].concat(objects.map(object => (
      fields.map(field => object[field])
    )))
  )
);

module.exports = { generateCsv };

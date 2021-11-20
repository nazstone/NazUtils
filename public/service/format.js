const prettier = require('prettier');
const xmlformat = require('xml-formatter');
const { format: sqlFormatter } = require('sql-formatter');

const prettierFormat = ['json', 'html', 'yaml', 'css', 'scss', 'less', 'graphql', 'markdown', 'babel'];

const format = (kind, input, col = 80) => {
  if (prettierFormat.includes(kind)) {
    return prettier.format(input, {
      parser: kind,
      printWidth: col,
    });
  }
  if (kind === 'xml') {
    return xmlformat(input);
  }
  if (kind === 'sql') {
    return sqlFormatter(input);
  }
  return null;
};

module.exports = {
  format,
};

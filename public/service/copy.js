// eslint-disable-next-line import/no-extraneous-dependencies
const { clipboard } = require('electron');

const copyWriteSync = (text) => {
  clipboard.writeText(text);
};

module.exports = { copyWriteSync };

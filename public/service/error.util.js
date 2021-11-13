const pattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
].join('|');
const regex = new RegExp(pattern, 'g');
const stripAnsi = (msg) => {
  return msg.replace(regex, '');
};

const extractErrorMsg = (error) => {
  if (error.constructor.name === 'SyntaxError') {
    return stripAnsi(error.message);
  }
  if (error.message) {
    return stripAnsi(error.message);
  }
  return null;
};

module.exports = { extractErrorMsg };

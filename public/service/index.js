const highlight = require('./highlight');
const encodeDecode = require('./encode.decode');
const { extractErrorMsg } = require('./error.util');
const { format } = require('./format');
const { signPayload, extractHeaderPayloadSignature, mapAlgo } = require('./jwt');
const loremIpsum = require('./loremipsum');

const formatEntrypoint = (input, kind, extra) => {
  let result;
  if (extra && extra.highlight) {
    result = format(kind, input);
    result = highlight(result, kind);
  } else if (extra && extra.indent) {
    result = format(kind, input, extra.indent);
  } else {
    result = format(kind, input);
  }
  return result;
};

const jwtEntrypoint = (input, kind) => {
  let result;

  if (kind === 'sign') {
    const obj = JSON.parse(input);
    result = signPayload(obj.header, obj.payload, obj.secret, obj.privateKey);
  } else if (kind === 'extract') {
    result = extractHeaderPayloadSignature(input);
  } else {
    result = mapAlgo;
  }
  return result;
};

const encodeEntrypoint = (key, input, kind) => {
  return encodeDecode(key === 'encode', kind, input);
};

const loremEntrypoint = (kind, input) => {
  return loremIpsum(kind, input);
};

const mapResult = (fn) => {
  try {
    const result = fn();
    return {
      result,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      error: extractErrorMsg(error),
    };
  }
};

const main = (ipcMain) => {
  ipcMain.on('query.format', (event, arg) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = mapResult(() => formatEntrypoint(arg.value, arg.kind, arg.extra));
  });

  ipcMain.on('query.jwt', (event, arg) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = mapResult(() => jwtEntrypoint(arg.value, arg.kind));
  });

  ipcMain.on('query.encode', (event, arg) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = mapResult(() => encodeEntrypoint(arg.key, arg.value, arg.kind));
  });

  ipcMain.on('query.lorem', (event, arg) => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = mapResult(() => loremEntrypoint(arg.kind, arg.value));
  });
};

module.exports = {
  main,
};

const highlight = require('./highlight');
const encodeDecode = require('./encode.decode');
const { extractErrorMsg } = require('./error.util');
const { format } = require('./format');
const { signPayload, extractHeaderPayloadSignature, mapAlgo } = require('./jwt');
const loremIpsum = require('./loremipsum');

const map = (key, input, kind, extra) => {
  try {
    let result;
    if (key === 'format' && kind) {
      if (extra && extra.highlight) {
        result = format(kind, input);
        result = highlight(result, kind);
      } else if (extra && extra.indent) {
        result = format(kind, input, extra.indent);
      } else {
        result = format(kind, input);
      }
    } else if (key === 'jwt') {
      if (kind === 'sign') {
        const obj = JSON.parse(input);
        result = signPayload(obj.header, obj.payload, obj.secret, obj.privateKey);
      } else if (kind === 'extract') {
        result = extractHeaderPayloadSignature(input);
      } else {
        result = mapAlgo;
      }
    } else if (key === 'encode' || key === 'decode') {
      result = encodeDecode(key === 'encode', kind, input);
    } else if (key === 'lorem') {
      result = loremIpsum(kind, input);
    }
    return {
      result,
      error: null,
    };
  } catch (error) {
    console.error('map service action', error);

    const errMsg = extractErrorMsg(error);

    return {
      result: null,
      error: errMsg,
    };
  }
};

module.exports = map;

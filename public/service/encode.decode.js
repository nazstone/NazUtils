const { encode: encodeHtml, decode: decodeHtml } = require('html-entities');

const encodeBase64 = (val) => {
  const buf = Buffer.from(val, 'utf-8');
  return buf.toString('base64');
};

const decodeBase64 = (val, buffer = false) => {
  const buf = Buffer.from(val, 'base64');
  if (buffer) {
    return buf;
  }
  return buf.toString('utf-8');
};

const encodeUrl = (val) => {
  return encodeURI(val);
};

const decodeUrl = (val) => {
  return decodeURI(val);
};

const encodeHtmlEntities = (val) => {
  return encodeHtml(val);
};
const decodeHtmlEntities = (val) => {
  return decodeHtml(val);
};

const encodeDecode = (encode, kind, val) => {
  const result = {
    type: 'text',
    value: null,
  };
  if (encode) {
    if (kind === 'uri') {
      result.value = encodeUrl(val);
    }
    if (kind === 'base64') {
      result.value = encodeBase64(val);
    }
    if (kind === 'html') {
      result.value = encodeHtmlEntities(val);
    }
  } else {
    if (kind === 'uri') {
      result.value = decodeUrl(val);
    }
    if (kind === 'base64') {
      result.value = decodeBase64(val);
    }
    if (kind === 'html') {
      result.value = decodeHtmlEntities(val);
    }
  }

  return result;
};

module.exports = encodeDecode;

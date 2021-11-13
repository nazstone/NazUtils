const { encode: encodeHtml, decode: decodeHtml } = require('html-entities');

const encodeBase64 = (val) => {
  const buf = Buffer.from(val, 'utf-8');
  return buf.toString('base64');
};

const decodeBase64 = (val) => {
  const buf = Buffer.from(val, 'base64');
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
  if (encode) {
    if (kind === 'uri') {
      return encodeUrl(val);
    }
    if (kind === 'base64') {
      return encodeBase64(val);
    }
    if (kind === 'html') {
      return encodeHtmlEntities(val);
    }
  }

  if (kind === 'uri') {
    return decodeUrl(val);
  }
  if (kind === 'base64') {
    return decodeBase64(val);
  }
  if (kind === 'html') {
    return decodeHtmlEntities(val);
  }
  return '';
};

module.exports = encodeDecode;

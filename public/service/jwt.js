const jwt = require('jsonwebtoken');
const { format } = require('./format');

// map algo name secret
const mapAlgo = {
  HS256: { name: 'HS256', type: 'jwt', alg: 'HMACSHA256', secret: true },
  HS384: { name: 'HS384', type: 'jwt', alg: 'HMACSHA384', secret: true },
  HS512: { name: 'HS512', type: 'jwt', alg: 'HMACSHA512', secret: true },
  RS256: { name: 'RS256', type: 'jwt', alg: 'RSASHA256', secret: false },
  RS384: { name: 'RS384', type: 'jwt', alg: 'RSASHA384', secret: false },
  RS512: { name: 'RS512', type: 'jwt', alg: 'RSASHA512', secret: false },
  ES256: { name: 'ES256', type: 'jwt', alg: 'ECDSASHA256', secret: false },
  ES384: { name: 'ES384', type: 'jwt', alg: 'ECDSASHA384', secret: false },
  ES512: { name: 'ES512', type: 'jwt', alg: 'ECDSASHA512', secret: false },
  PS256: { name: 'PS256', type: 'jwt', alg: 'RSAPSSSHA256', secret: false },
  PS384: { name: 'PS384', type: 'jwt', alg: 'RSAPSSSHA384', secret: false },
  PS512: { name: 'PS512', type: 'jwt', alg: 'RSAPSSSHA512', secret: false },
  NONE: { name: 'NONE', type: 'none' },
};

const prettier = (e) => {
  return format('json', JSON.stringify(e), 1);
};

const extractHeaderPayloadSignature = (val) => {
  const { jwtObj, secretKey } = JSON.parse(val);

  // decode the jwt
  const decoded = jwt.decode(jwtObj, { complete: true });
  let sign = true;

  // verify the secret
  try {
    jwt.verify(jwtObj, secretKey);
  } catch (error) {
    sign = false;
  }

  return {
    header: prettier(decoded.header),
    payload: prettier(decoded.payload),
    signature: mapAlgo[decoded.header.alg],
    sign,
  };
};

const signPayload = (header, payload, secret, privateKey) => {
  return jwt.sign(payload, secret || privateKey, { header: JSON.parse(header), noTimestamp: true });
};

module.exports = {
  extractHeaderPayloadSignature,
  signPayload,
  mapAlgo,
};

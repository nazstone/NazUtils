/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import Editor from '../components/editor';

import ErrorFormat from '../components/error.format';

const color = ['text-red-500', 'text-blue-500', 'text-green-500'];

// default jwtObject
const jwtObjDefault = {
  header: '',
  payload: '',
  signature: 'MySecretPassword',
  public: `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKVUHlZBKZEi2x4Z/oDbByoOf1Yh3PM1
0Y5aa87Uuo6yxZ6eFM8rCB2QvwYnixmDQiwwMhmKicLhoAXRvT5JmjkCAwEAAQ==
-----END PUBLIC KEY-----`,
  private: `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKVUHlZBKZEi2x4Z/oDbByoOf1Yh3PM10Y5aa87Uuo6yxZ6eFM8r
CB2QvwYnixmDQiwwMhmKicLhoAXRvT5JmjkCAwEAAQJAMmaJdQwaaudwWyXbg1bC
QVz4Dr72B6LRho8kLIKHePajeIJ/zNbeMTWEhHaav/cVWiqbeba9mA+bycqHxsyx
jQIhANHfD6PuyxoRivRQenXWM9vypYl4RyzSBXPVAzLskPVDAiEAyaq/bDvQ13Sz
DxHXeuRWxpq4KfO3BrIv1WZmwcJBfNMCIQCHB5OSj/NRJHRY2ObRpi3bl/T1y9NP
fRlQ+36BZz+k7QIgL/HtUrEh5Kd1DqciQLBaxRrxn9+2atwgLS8MTRJ++UsCIG46
jGFzsBTiTVRvjEdISr7P+TQNXpKP+YqghQgbvGpn
-----END RSA PRIVATE KEY-----`,
  verified: false,
  dirty: false,
};

const JWTView = () => {
  const [jwtString, setJwtString] = useState({ jwt: '', dirty: false });
  const [alg, setAlg] = useState([]);
  const [algFound, setAlgFound] = useState();
  const [jwtObj, setJwtObj] = useState(jwtObjDefault);
  const [error, setError] = useState('');

  // extract the jwt
  const sendExtract = () => {
    if (!jwtString.jwt) {
      setError('');
      return;
    }

    const secretKey = (algFound && algFound.secret && jwtObj.signature) || jwtObj.public;
    const res = window.electron.ipcRenderer.sendSync('query', {
      key: 'jwt',
      kind: 'extract',
      value: JSON.stringify({
        jwtObj: jwtString.jwt,
        secretKey,
      }),
    });

    if (res.error) {
      setError(res.error);
    } else {
      setError('');
      // set data extracted to field
      setJwtObj({
        ...jwtObj,
        header: res.result.header,
        payload: res.result.payload,
        verified: res.result.sign,
        dirty: false,
      });
      if (res.result.header) {
        const f = alg[JSON.parse(res.result.header).alg];
        setAlgFound(f);
      }
    }
  };

  const sendSignToIpc = () => {
    if (!jwtObj.payload || !jwtObj.header) {
      return;
    }

    // sign the data to have a jwt string
    let res;
    try {
      res = window.electron.ipcRenderer.sendSync('query', {
        key: 'jwt',
        kind: 'sign',
        value: JSON.stringify({
          payload: (jwtObj.payload && JSON.parse(jwtObj.payload)) || {},
          header: jwtObj.header,
          secret: (algFound.secret && jwtObj.signature) || null,
          privateKey: (!algFound.secret && jwtObj.private) || null,
        }),
      });
    } catch (err) {
      res = {
        error: err.message,
      };
    }

    if (res.error) {
      setError(res.error);
    } else {
      setError('');
      setJwtString({ jwt: res.result, dirty: false });
      setJwtObj({
        ...jwtObj,
        verified: true,
        dirty: false,
      });
    }
  };

  // on change for jwt string
  const onChangeJwt = (e) => {
    setJwtString({ jwt: e.target.value, dirty: true });
  };
  // on change for header
  const onChangeHeader = (e) => {
    setJwtObj({
      ...jwtObj,
      header: e.target.value,
      dirty: true,
    });

    const h = JSON.parse(e.target.value);
    if (h) {
      const f = alg[h.alg];
      if (f) {
        setAlgFound(f);
      }
    }
  };

  // on change for payload
  const onChangePayload = (e) => {
    setJwtObj({
      ...jwtObj,
      payload: e.target.value,
      dirty: true,
    });
  };

  // on change for signature
  const onChangeSignature = (e) => {
    setJwtObj({
      ...jwtObj,
      signature: e.target.value,
      dirty: true,
    });
  };

  // on change for public key
  const onChangePublic = (e) => {
    setJwtObj({
      ...jwtObj,
      public: e.target.value,
      dirty: true,
    });
  };
  // on change for private key
  const onChangePrivate = (e) => {
    setJwtObj({
      ...jwtObj,
      private: e.target.value,
      dirty: true,
    });
  };
  // on change for algo
  const onChangeAlgo = (e) => {
    const algFoundTmp = alg[e.target.value];

    if (!algFoundTmp) {
      console.error('No alg found');
      return;
    }

    setAlgFound(algFoundTmp);
    if (!jwtObj || !jwtObj.header) {
      return;
    }

    const jwtHeaderTmp = { ...JSON.parse(jwtObj.header), alg: algFoundTmp.name };

    // pretty print
    const returned = window.electron.ipcRenderer.sendSync('query', {
      key: 'format',
      kind: 'json',
      value: JSON.stringify(jwtHeaderTmp),
      extra: {
        indent: 1,
      },
    });

    if (returned.error) {
      setError(returned.error);
      return;
    }

    setJwtObj({
      ...jwtObj,
      header: returned.result,
      dirty: true,
    });
  };

  const onClickClear = () => {
    setJwtString({ jwt: '', dirty: true });
  };

  const onClickCopy = () => {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(jwtValue);
  };

  const onClickSample = () => {
    setJwtString({
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0YWRhIiwibmFtZSI6InRhZGEifQ.B5h2p7JIzod1opXE51wMPu2v5k5nmB1NgEugkzKtZgM',
      dirty: true,
    });
  };

  useEffect(() => {
    if (jwtObj.dirty) {
      sendSignToIpc();
    }
  }, [jwtObj]);

  useEffect(() => {
    if (jwtString.dirty) {
      if (jwtString.jwt) {
        sendExtract();
      } else {
        setJwtObj(jwtObjDefault);
      }
    } else {
      setError('');
    }
  }, [jwtString]);

  useEffect(() => {
    const res = window.electron.ipcRenderer.sendSync('query', {
      key: 'jwt',
      kind: 'alg',
    });
    setAlg(res.result);
    setAlgFound(res.result[Object.keys(res.result)[0]]);
  }, []);

  const transform = (v) => {
    const vArr = v.split('.');
    return vArr.map((e, i) => (
      <span key={color[i]}>
        {(i > 0 && '.') || ''}
        <span className={color[i]}>{e}</span>
      </span>
    ));
  };

  let algInputSignInput;

  if (algFound && algFound.secret) {
    algInputSignInput = (
      <input
        type="text"
        id="signature"
        style={{ marginLeft: '-7rem' }}
        onChange={onChangeSignature}
        value={jwtObj.signature || ''}
      />
    );
  } else {
    algInputSignInput = (
      <div className="flex flex-col">
        <textarea type="text" id="public" value={jwtObj.public || ''} onChange={onChangePublic} />
        <textarea type="text" id="private" value={jwtObj.private || ''} onChange={onChangePrivate} />
      </div>
    );
  }

  return (
    <div className="flex flex-grow v-full h-full">
      <div className="flex-1 w-0 flex flex-col v-full p-2">
        <div className="pb-2">
          <button type="button" className="btn mr-3" onClick={onClickClear}>
            Clear
          </button>
          <button type="button" className="btn mr-3" onClick={onClickCopy}>
            Copy
          </button>
          <select type="button" className="btn mr-3" onChange={onChangeAlgo}>
            {Object.keys(alg).map((e) => (
              <option key={e} value={e} selected={(algFound && algFound.name === e) || ''}>
                {e}
              </option>
            ))}
          </select>
          <button type="button" className="btn" onClick={onClickSample}>
            Sample
          </button>
        </div>
        <ErrorFormat error={error} setError={setError} />
        {/* <div className="h-full flex">
          <textarea className="w-full flex1" height="100%" onChange={onChangeJwt} value={jwtString.jwt} />
        </div> */}
        <Editor
          className="w-full flex-1"
          onChange={onChangeJwt}
          value={jwtString.jwt}
          transform={(v) => transform(v)}
        />
        <span className={jwtObj.verified ? 'text-green-600' : 'text-red-600'}>
          {jwtObj.verified ? 'Valid signature' : 'Invalid signature'}
        </span>
      </div>
      <div className="w-108 flex flex-col">
        <div className="bg-red-200 flex-1 p-2 flex flex-col">
          <h1>Header</h1>
          <textarea onChange={onChangeHeader} value={jwtObj.header} className="w-full flex-1" />
        </div>
        <div className="bg-yellow-200 flex-1 p-2 flex flex-col">
          <h1>Payload</h1>
          <textarea onChange={onChangePayload} value={jwtObj.payload} className="w-full flex-1" />
        </div>
        <div className="bg-blue-200 flex-1 p-2">
          <h1>Signature</h1>
          <pre>
            {`
${(algFound && algFound.alg) || ''}(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
              `}
            {algInputSignInput}
            {`
)
            `}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JWTView;

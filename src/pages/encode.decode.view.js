/* eslint-disable no-undef */
import React, { useRef, useState } from 'react';
import ErrorFormat from '../components/error.format';
import { buttonBar, tab } from '../styles/common';

const kinds = [
  { name: 'base64', label: 'Base64' },
  { name: 'uri', label: 'URI' },
  { name: 'html', label: 'HTML Entities' },
];

const EncodeDecodeView = () => {
  const encodeRef = useRef(null);
  const decodeRef = useRef(null);

  const [kind, setKind] = useState(kinds[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [textToEncode, setTextToEncode] = useState('');
  const [textToDecode, setTextToDecode] = useState('');

  const encodeAction = () => {
    setTextToEncode(encodeRef.current.value);
    const { result, error } = window.electron.ipcRenderer.sendSync('query', {
      key: 'encode',
      kind: kind.name,
      value: encodeRef.current.value,
    });
    if (error) {
      setErrorMsg(error);
    } else {
      setErrorMsg('');
      setTextToDecode(result);
    }
  };
  const decodeAction = () => {
    setTextToDecode(decodeRef.current.value);
    const { result, error } = window.electron.ipcRenderer.sendSync('query', {
      key: 'decode',
      kind: kind.name,
      value: decodeRef.current.value,
    });

    if (error) {
      setErrorMsg(error);
    } else {
      setErrorMsg('');
      setTextToEncode(result);
    }
  };

  const clearButton = () => {
    setTextToEncode('');
    setTextToDecode('');
  };

  const copyEncodeButton = () => {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(textToEncode);
  };
  const copyDecodeButton = () => {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(textToDecode);
  };

  const onChangeEncode = (e) => {
    setTextToEncode(e.target.value);
  };
  const onChangeDecode = (e) => {
    setTextToDecode(e.target.value);
  };
  const onChangeKind = (e) => {
    setKind(kinds.filter((k) => k.name === e.target.value)[0]);
  };

  const onKeyPressEncode = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      encodeAction();
    }
  };
  const onKeyPressDecode = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      decodeAction();
    }
  };

  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex flex-col flex-grow">
        <ErrorFormat error={errorMsg} setError={setErrorMsg} />
        <div className={`${tab} bg-green-300`}>
          <h1>Encode to {kind.label}</h1>
          <div className={buttonBar}>
            <button type="button" className="btn" onClick={encodeAction}>
              Encode
            </button>
            <button type="button" className="btn" onClick={copyEncodeButton}>
              Copy
            </button>
            <div className="flex-grow" />
            <button type="button" className="btn" onClick={clearButton}>
              Clear
            </button>
            <select className="btn" onChange={onChangeKind}>
              {kinds.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="v-full h-full p-2"
            placeholder="Text to encode"
            ref={encodeRef}
            onChange={onChangeEncode}
            onKeyPress={onKeyPressEncode}
            value={textToEncode}
          />
        </div>
        <div className={`${tab} bg-blue-300`}>
          <h1>Decode from {kind.label}</h1>
          <div className={buttonBar}>
            <button type="button" className="btn" onClick={decodeAction}>
              Decode
            </button>
            <button type="button" className="btn" onClick={copyDecodeButton}>
              Copy
            </button>
          </div>
          <textarea
            className="v-full h-full p-2"
            placeholder="Text to decode"
            ref={decodeRef}
            onChange={onChangeDecode}
            onKeyPress={onKeyPressDecode}
            value={textToDecode}
          />
        </div>
      </div>
    </div>
  );
};

export default EncodeDecodeView;

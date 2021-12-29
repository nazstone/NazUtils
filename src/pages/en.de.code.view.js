/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import ErrorFormat from '../components/error.format';
import { buttonBar, tab } from '../styles/common';

const kinds = [
  { name: 'base64', label: 'Base64' },
  { name: 'uri', label: 'URI' },
  { name: 'html', label: 'HTML Entities' },
];

const EncodeDecodeView = () => {
  const inputRef = useRef(null);

  const [kind, setKind] = useState(kinds[0]);
  const [encode, setEncode] = useState(true);
  const [result, setResult] = useState('');
  const [focusInput, setFocusInput] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const encodeAction = () => {
    /* eslint-disable no-undef */
    const { result: res, error } = window.electron.ipcRenderer.sendSync('query.encode', {
      key: (encode && 'encode') || 'decode',
      kind: kind.name,
      value: inputRef.current.value,
    });

    if (error) {
      setErrorMsg(error);
      setResult('');
    } else {
      setErrorMsg('');
      setResult(res);
    }
    setFocusInput(false);
  };
  const clearButton = () => {
    setResult({});
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
    }
    setFocusInput(true);
  };
  const onClickCopy = () => {
    window.electron.ipcRenderer.sendSync('query.copy', result.value);
  };
  const onClickSave = () => {
    window.electron.ipcRenderer.send('query.download', result.value);
  };
  const fileButton = () => {
    const r = window.electron.ipcRenderer.sendSync('query.encode.file', { encode });
    if (r.error) {
      setErrorMsg(r.error);
      setResult('');
    } else {
      setErrorMsg('');
      setResult(r.result);
      setFocusInput(false);
    }
  };
  const onChangeKind = (e) => {
    setKind(kinds.filter((k) => k.name === e.target.value)[0]);
  };
  const onChangeToggle = () => {
    setEncode(!encode);
  };
  const onFocusInput = () => {
    setFocusInput(true);
  };
  const onFocusInputInverse = () => {
    setFocusInput(false);
  };
  const onKeyPressInput = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      encodeAction();
    }
  };

  return (
    <div className="flex flex-grow h-full flex-col">
      <div className={tab}>
        <h1>
          {encode ? 'Encode' : 'Decode'} to {kind.label}
        </h1>
        <div className={buttonBar}>
          <label htmlFor="toogleA" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                id="toogleA"
                type="checkbox"
                className="hidden toggle-input-purple-800"
                onChange={onChangeToggle}
              />
              <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
              <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -top-1/4 -left-1/4 transition duration-300 ease-in-out">
                {' '}
              </div>
            </div>
            <div className="mx-3 text-gray-700 font-medium">{encode ? 'Encode' : 'Decode'}</div>
            <button type="button" className="btn" onClick={encodeAction}>
              Go
            </button>
          </label>
          <div className="flex-grow" />
          <button type="button" className="btn" onClick={clearButton}>
            Clear
          </button>
          {kind.name === 'base64' && (
            <button type="button" className="btn" onClick={fileButton}>
              File
            </button>
          )}
          <select className="btn" onChange={onChangeKind}>
            {kinds.map((e) => (
              <option key={e.name} value={e.name}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ErrorFormat error={errorMsg} setError={setErrorMsg} />
      <div className={`h-full mx-2 mt-2 ${!focusInput && 'flex-1'}`}>
        {!result.input && (
          <textarea
            className="w-full h-full p-2 outline-none"
            placeholder={(encode && 'Text to encode') || 'Text to decode'}
            onKeyPress={onKeyPressInput}
            onFocus={onFocusInput}
            ref={inputRef}
          />
        )}
        {result.input && <div className="w-full h-full p-2 border-dashed border-2 border-black">{result.input}</div>}
      </div>
      <div className="flex space-x-1 mx-2 mt-2 justify-end">
        <button type="button" className="btn" onClick={onClickSave}>
          Download file
        </button>
        {result.type === 'text' && (
          <button type="button" className="btn" onClick={onClickCopy}>
            Copy
          </button>
        )}
      </div>
      <div className={`h-full m-2 ${focusInput && 'flex-1'}`}>
        {(result.type === 'text' || !result.type) && (
          <textarea
            className="w-full h-full p-2 outline-none"
            readOnly
            value={result.value || ''}
            onFocus={onFocusInputInverse}
          />
        )}
        {result.type === 'img' && <img src={`data:image/gif;base64,${result.imgValue}`} alt="Base64 file transform" />}
        {result.type === 'unknown' && <div>File of type {result.mime}</div>}
      </div>
    </div>
  );
};

export default EncodeDecodeView;

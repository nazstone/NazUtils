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
    setResult('');
    inputRef.current.value = '';
    setFocusInput(true);
  };
  const onClickCopy = () => {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(result);
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

  console.log('focus:', focusInput, 'result:', !result);

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
          <button type="button" className="btn" onClick={onClickCopy}>
            Copy
          </button>
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
      </div>
      <ErrorFormat error={errorMsg} setError={setErrorMsg} />
      <div className={`h-full m-2 ${!focusInput && 'flex-1'}`}>
        <textarea
          className="w-full h-full p-2 outline-none"
          placeholder={(encode && 'Text to encode') || 'Text to decode'}
          onKeyPress={onKeyPressInput}
          onFocus={onFocusInput}
          ref={inputRef}
        />
      </div>
      <div className={`h-full m-2 ${focusInput && 'flex-1'}`}>
        <textarea className="w-full h-full p-2 outline-none" readOnly value={result} onFocus={onFocusInputInverse} />
      </div>
    </div>
  );
};

export default EncodeDecodeView;

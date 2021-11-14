import React, { useState } from 'react';
import ErrorFormat from '../components/error.format';
import { buttonBar } from '../styles/common';
// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

const LoremIpsumView = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [loremIpsum, setLoremIpsum] = useState('');

  const sendIpcLorem = (type = 'sentence') => {
    const { result, error } = ipcRenderer.sendSync('query', {
      key: 'lorem',
      kind: type,
      value: 3,
    });
    if (error) {
      setErrorMsg(error);
    } else {
      setErrorMsg('');
      setLoremIpsum(result);
    }
  };
  const onClickSentence = () => {
    sendIpcLorem();
  };
  const onClickParagraph = () => {
    sendIpcLorem('paragraph');
  };
  const onClickClear = () => {
    setErrorMsg('');
    setLoremIpsum('');
  };
  const onClickCopy = () => {
    // eslint-disable-next-line no-undef
    navigator.clipboard.writeText(loremIpsum);
  };
  return (
    <div className="flex flex-col flex-grow h-full flex-col">
      <div className="flex-0 bg-green-300 p-2">
        <h1>Lorem Ipsum</h1>
        <div className={buttonBar}>
          <button type="button" className="btn" onClick={onClickSentence}>
            Sentence
          </button>
          <button type="button" className="btn" onClick={onClickParagraph}>
            Paragraph
          </button>
          <div className="flex-grow" />
          <button type="button" className="btn" onClick={onClickClear}>
            Clear
          </button>
          <button type="button" className="btn" onClick={onClickCopy}>
            Copy
          </button>
        </div>
        <ErrorFormat error={errorMsg} setError={setErrorMsg} />
      </div>
      <div className="p-2 bg-blue-200 flex-1 overflow-auto">
        <h1>Generated</h1>
        <p className="break-all whitespace-pre-wrap">{loremIpsum}</p>
      </div>
    </div>
  );
};

export default LoremIpsumView;

/* eslint-disable no-undef */
import React, { useState, useContext } from 'react';
import ErrorFormat from '../components/error.format';
import GlobalContext from '../context/context';
import { buttonBar } from '../styles/common';

const LoremIpsumView = () => {
  const [errorMsg, setErrorMsg] = useState('');

  const globalContext = useContext(GlobalContext);
  const { lorem, setLorem } = globalContext;

  const sendIpcLorem = (type = 'sentence') => {
    const number = document.getElementById('number').value;
    const { result, error } = window.electron.ipcRenderer.sendSync('query.lorem', {
      kind: type,
      value: number,
    });
    if (error) {
      setErrorMsg(error);
    } else {
      setErrorMsg('');
      setLorem({ ...lorem, text: result });
    }
  };
  const onChange = () => {
    const number = document.getElementById('number').value;
    setLorem({ ...lorem, number });
  };
  const onClickSentence = () => {
    sendIpcLorem();
  };
  const onClickParagraph = () => {
    sendIpcLorem('paragraph');
  };
  const onClickClear = () => {
    setErrorMsg('');
    setLorem({ ...lorem, text: '' });
  };
  const onClickCopy = () => {
    // eslint-disable-next-line no-undef
    window.electron.ipcRenderer.sendSync('query.copy', lorem.text);
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
          <div className="self-center">
            Number of:{' '}
            <input
              id="number"
              type="number"
              max="100"
              className="w-12"
              defaultValue={lorem.number}
              onChange={onChange}
            />
          </div>
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
        <p className="break-all whitespace-pre-wrap">{lorem.text}</p>
      </div>
    </div>
  );
};

export default LoremIpsumView;

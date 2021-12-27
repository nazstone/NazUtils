/* eslint-disable no-undef */
import React, { useState } from 'react';

import ErrorFormat from '../components/error.format';
import { headerBar, title } from '../styles/common';

import 'highlight.js/styles/stackoverflow-light.css';

const formats = [
  { label: 'JavaScript', kind: 'babel', placeholder: 'const hello = () => { console.log("world"); }' },
  { label: 'JSON', kind: 'json', placeholder: '{"json": true}' },
  { label: 'HTML', kind: 'html', placeholder: '<div>Tada</div>' },
  {
    label: 'YAML',
    kind: 'yaml',
    placeholder: `date:        2012-08-06
  customer:
      given:   Dorothy
      family:  Gale`,
  },
  {
    label: 'CSS',
    kind: 'css',
    placeholder: ' body { background-color: #CCCCCC; } ',
  },
  { label: 'SCSS', kind: 'scss' },
  { label: 'LESS', kind: 'less' },
  {
    label: 'XML',
    kind: 'xml',
    placeholder: '<content><<obj>tada</obj></content>',
  },
  { label: 'GraphQL', kind: 'graphql' },
  { label: 'SQL', kind: 'sql', placeholder: 'SELECT * FROM TADA' },
  { label: 'Markdown', kind: 'markdown', placeholder: '# Title\n## SubTitle' },
];

const FormatterView = () => {
  const [minus, setMinus] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [format, setFormatter] = useState(formats[0]);

  const clickCompute = () => {
    const returned = window.electron.ipcRenderer.sendSync('query.format', {
      kind: format.kind,
      // eslint-disable-next-line no-undef
      value: document.getElementById('textareaInput').value,
      extra: {
        highlight: true,
      },
    });

    setResult(returned.result);
    setError(returned.error);
  };
  const clickClear = () => {
    // eslint-disable-next-line no-undef
    document.getElementById('textareaInput').value = '';
    setResult();
    setError();
  };

  const selectOnChange = (e) => {
    const arrRes = formats.filter((f) => f.kind === e.target.value);
    if (arrRes && arrRes.length > 0) {
      setFormatter(arrRes[0]);
      setResult();
      setError();
    }
  };

  const onClickReduce = () => {
    setMinus(!minus);
  };

  const divTop = `flex flex-col p-2 ${minus ? 'h-40' : 'flex-1'}`;
  return (
    <div className="flex flex-grow h-full flex-col">
      <div className={divTop}>
        <div className={headerBar}>
          <div className="flex flex-1 items-center">
            <button type="button" className="btn mr-3" onClick={clickCompute}>
              Compute
            </button>
            <select className="btn mr-3" id="formatKind" onChange={selectOnChange}>
              {formats.map((f) => (
                <option key={f.kind} value={f.kind}>
                  {f.label}
                </option>
              ))}
            </select>
            <button type="button" className="btn" onClick={clickClear}>
              Clear
            </button>
          </div>
          <button className="btn w-12" type="button" onClick={onClickReduce}>
            {minus ? '+' : '-'}
          </button>
          <div className={title}>Input to format</div>
        </div>
        <ErrorFormat error={error} setError={setError} />
        <textarea className="flex-1 p-2" placeholder={format.placeholder} id="textareaInput" />
      </div>
      <div className="bg-blue-300 flex flex-col p-2 flex-1 min-h-0">
        <div className={headerBar}>
          <div className="flex ">
            <button
              type="button"
              className="btn"
              onClick={() => {
                // eslint-disable-next-line no-undef
                window.electron.ipcRenderer.sendSync('query.copy', result);
              }}
            >
              Copy
            </button>
          </div>
          <div className="flex-1">&nbsp;</div>
          <div className={title}>{format.label} formatted</div>
        </div>
        <div className="bg-white flex-1 p-2 overflow-auto">
          <p className="whitespace-pre-wrap break-normal" dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </div>
    </div>
  );
};

export default FormatterView;

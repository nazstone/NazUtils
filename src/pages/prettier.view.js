import React, { useState } from 'react';

import ErrorFormat from '../components/error.format';
import { headerBar, tab, title } from '../styles/common';
// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

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
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [format, setFormatter] = useState(formats[0]);

  const clickCompute = () => {
    const returned = ipcRenderer.sendSync('query', {
      key: 'format',
      kind: format.kind,
      // eslint-disable-next-line no-undef
      value: document.getElementById('textareaInput').value,
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
      clickClear();
    }
  };

  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex flex-col flex-grow">
        <div className={`${tab} bg-green-300`}>
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
            <div className={title}>Input to format</div>
          </div>
          <ErrorFormat error={error} setError={setError} />
          <textarea className="h-full v-full p-2" placeholder={format.placeholder} id="textareaInput" />
        </div>
        <div className={`${tab} bg-blue-300`}>
          <div className={headerBar}>
            <div className={`${title} flex-1`}>{format.label} formatted</div>
            <div className="flex items-center">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  // eslint-disable-next-line no-undef
                  navigator.clipboard.writeText(result);
                }}
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-white h-full v-full p-2">
            <pre>{result}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatterView;

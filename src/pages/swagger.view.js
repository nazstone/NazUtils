import React, { useContext } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import GlobalContext from '../context/context';

const SwaggerView = () => {
  const globalContext = useContext(GlobalContext);

  const { swagger, setSwagger } = globalContext;

  const onClickGo = () => {
    // eslint-disable-next-line no-undef
    setSwagger({ url: document.getElementById('url').value });
  };

  const localFileClick = () => {
    // eslint-disable-next-line no-undef
    const res = window.electron.ipcRenderer.sendSync('query.local.swagger');
    setSwagger({ url: res.url });
    // eslint-disable-next-line no-undef
    document.getElementById('url').value = res.url;
  };

  const onKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onClickGo();
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 w-full h-full">
      <div className="flex w-full p-2 bg-green-300">
        <span className="pr-2 self-center">Swagger URL:</span>
        <input
          className="flex-1 mr-2"
          type="text"
          id="url"
          placeholder="https://petstore.swagger.io/v2/swagger.json"
          onKeyPress={onKeyPress}
          onChange={(e) => {
            console.log(e);
            setSwagger({
              url: e.target.value,
            });
          }}
          value={swagger.url}
        />
        <span className="mx-2 self-center">
          or <b onClick={localFileClick}>local file</b>
        </span>
        <button type="button" className="btn" onClick={onClickGo}>
          Go
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <SwaggerUI url={swagger.url} />
      </div>
    </div>
  );
};

export default SwaggerView;

import React, { useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerView = () => {
  const [url, setUrl] = useState('');

  const onClickGo = () => {
    // eslint-disable-next-line no-undef
    setUrl(document.getElementById('url').value);
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
        />
        <button type="button" className="btn" onClick={onClickGo}>
          Go
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <SwaggerUI url={url} />
      </div>
    </div>
  );
};

export default SwaggerView;

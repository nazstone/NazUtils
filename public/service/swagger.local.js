/* eslint-disable no-param-reassign */
const http = require('http');
const portFinder = require('portfinder');
const fs = require('fs');

let server = null;

const swaggerLocal = (dialog, mainWindow) => async (event) => {
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
  });
  if (!files || !files.length) {
    console.info('no file to query');
    event.returnValue = {};
    return;
  }

  // create server tmp to serve file
  const port = await portFinder.getPortPromise({
    port: 30000,
  });

  if (server) {
    // stopping server
    await server.close();
  }

  server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.indexOf('/api-docs') >= 0) {
      const body = fs.readFileSync(files[0]);
      res.writeHead(200, { 'Content-Length': Buffer.byteLength(body), 'Access-Control-Allow-Origin': '*' }).end(body);
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  server.listen(port);
  // starting server on port ${port}

  event.returnValue = { url: `http://localhost:${port}/api-docs` };
};

module.exports = swaggerLocal;

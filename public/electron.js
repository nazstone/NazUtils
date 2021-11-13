/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const { ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const service = require('./service');

const { app } = electron;
const { BrowserWindow } = electron;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: `${__dirname}/.png`,
    width: 1400,
    height: 880,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  if (isDev) {
    console.log('debug on eletron enabled');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('query', (event, arg) => {
  // eslint-disable-next-line no-param-reassign
  event.returnValue = service(arg.key, arg.value, arg.kind);
});

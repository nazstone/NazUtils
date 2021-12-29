/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const { ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const { main } = require('./service');

const { app } = electron;
const { BrowserWindow } = electron;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: `${__dirname}/../icon.png`,
    width: 1400,
    height: 880,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`);

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

main(ipcMain, dialog, mainWindow);

const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
let win;

const {createWindow,buildPath} = require('./core/start');

ipcMain.on('test', () => {
    console.log('test');
});

app.on('ready', () =>{
    createWindow(buildPath("index.ejs"));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

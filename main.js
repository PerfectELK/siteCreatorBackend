const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

const {createWindow,buildPath} = require('./core/start');





app.on('ready', () =>{
    createWindow(buildPath("index.ejs"),(win) => {
        require('./modules/ipc/ipcMain')(win);
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


const ipcMain = require('electron').ipcMain;

module.exports = (win) => {

    ipcMain.on('turnAppWindow',() => {
        win.minimize();
    });

    ipcMain.on('fullResizeWindow',() => {
        win.maximize()
    })

    ipcMain.on('closeApp',() => {
        win.close();
    })

    require('./sites/sites')(win);


}
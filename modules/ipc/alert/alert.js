const ipcMain = require('electron').ipcMain;

module.exports = (win,message) => {

    ipcMain.on('closeWindow',(e) => {
        win.close();
    })

    ipcMain.on('getMessage',(e) => {
        e.sender.send('message',message);
    })

}
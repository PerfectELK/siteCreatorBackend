const fs =require('fs');
const {BrowserWindow} = require('electron');
const ipcMain = require('electron').ipcMain;
const crypto = require('crypto');
const path = require('path');

class alertWin{

    constructor(file,msg){
        this.file = file;
        this.msg = msg;
        this.msg.hash = crypto.randomBytes(20).toString('hex');
    }

    init(){
        let conf = JSON.parse(fs.readFileSync(`${global.appRoot}/config.json`));
        let width = 450;
        let height = 110;


        this.win = new BrowserWindow({
            width: width,
            height: height,
            resizable:false,
            frame: false ,
            x:conf.width - width,
            y:(conf.height - height) - (height * global.windowAlertOffset),
            icon:path.join(global.appRoot,'/resources/static/img/icon_warning.png'),
        });
        this.win.setMenu(null);
        this.win.loadURL('file://' + __dirname + `/../../../resources/views/${this.file}`);
        this.win.show();
        this.win.webContents.on('dom-ready', () => {
            this.ipcRenderEvent();
        })
        global.windowAlertOffset++;
    }

    ipcRenderEvent(){

        ipcMain.on(`closeWindow${this.msg.hash}`,(e) => {
            this.win.close();
            global.windowAlertOffset--;
        });

        this.win.webContents.send('message',this.msg);

    }

}

module.exports = alertWin;
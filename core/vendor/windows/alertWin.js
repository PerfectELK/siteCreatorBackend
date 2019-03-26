const fs =require('fs');
const {BrowserWindow} = require('electron');
const ipcMain = require('electron').ipcMain;
const crypto = require('crypto');
const path = require('path');

class alertWin{

    constructor(file,msg,offset = 0){
        this.file = file;
        this.msg = msg;
        this.offset = offset;
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
            y:(conf.height - height) - (height * this.offset),
            icon:path.join(global.appRoot,'/resources/static/img/icon_warning.png'),
        });
        this.win.setMenu(null);
        this.win.loadURL('file://' + __dirname + `/../../../resources/views/${this.file}`);
        this.win.show();
        this.win.webContents.on('dom-ready', () => {
            this.ipcRenderEvent();
        })

    }

    ipcRenderEvent(){

        ipcMain.on(`closeWindow${this.msg.hash}`,(e) => {
            this.win.close();
        });

        this.win.webContents.send('message',this.msg);

    }

}

module.exports = alertWin;
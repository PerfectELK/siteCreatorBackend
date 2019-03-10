const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const ejse = require('ejs-electron');


module.exports ={

    createWindow: function(view){

            win = new BrowserWindow({
                width: 1150,
                height: 720,
                resizable: true,
                autoHideMenuBar: true,
                frame: false,
            });

            win.setMenu(null);

            const viewPath =  `${__dirname}${path.join('','..','resources','resources','views')}`;

            win.loadURL('file://' + __dirname + `/../resources/views/${view}`);

            win.webContents.openDevTools();


            win.on('closed', () => {
                win = null
            })
        },
    buildPath:function (p) {
        return p.replace(/\//g,path.sep).replace(/\\/g,path.sep);
    }
};
const {BrowserWindow} = require('electron');
const fs = require('fs');

module.exports = (view,message) => {
    let conf = JSON.parse(fs.readFileSync(`${global.appRoot}/config.json`));
    let width = 450;
    let height = 110;
    let win = new BrowserWindow({ width: width, height: height,resizable:false, frame: false ,x:conf.width - width,y:conf.height - height});
    win.setMenu(null);
    win.loadURL('file://' + __dirname + `/../../resources/views/${view}`);
   // win.openDevTools();
    win.show();
    require(`${global.appRoot}/modules/ipc/alert/alert.js`)(win,message);
}
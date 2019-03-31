const {app, BrowserWindow} = require('electron');
const path = require('path');


global.appRoot = path.resolve(__dirname);
global.windowAlertOffset = 0;

const url = require('url');
const electron = require('electron');
const {createWindow,buildPath} = require('./core/start');
const fs = require('fs');




const db = require('./core/vendor/sqlite/sqlite');

db.checkTableExist("presets",(res) => {
    if(res == 0){
        require('./core/vendor/sqlite/patch/patch_presets')();
    }
})






// let where = {
//     and:[
//         ["kek","=","'cheburek'"],
//         ["lol","=","'arbidol'"],
//     ],
//     orderby:[
//         ["kek","ASC"],
//         ["lol","DESC"],
//     ],
//     join: {
//         type:"INNER JOIN",
//         table:"kekuashvilli",
//         and:[
//             ["kek","=","kekcheburek"],
//             ["lul","=","lolarbidol"],
//         ]
//     },
// };



let win;

app.on('ready', () =>{
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    fs.writeFileSync('./config.json',JSON.stringify({width:width,height:height}));
    createWindow(buildPath("index.ejs"),(win) => {
        require('./modules/ipc/ipcMain')(win);
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


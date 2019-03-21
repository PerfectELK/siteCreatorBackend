const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const {createWindow,buildPath} = require('./core/start');

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
    createWindow(buildPath("index.ejs"),(win) => {
        require('./modules/ipc/ipcMain')(win);
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});


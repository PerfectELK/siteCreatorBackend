const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let win;

const {createWindow,buildPath} = require('./core/start');

const db = require('./core/vendor/sqlite/sqlite');


// db.createTable("test",["id INTEGER PRIMARY KEY AUTOINCREMENT","name TEXT","content TEXT"]);
// db.insertDataInTable('test',{name:"test",content:"text"});
// db.selectRowsAll('test',(data) => {
//     db_res = data;
//     console.log(db_res);
// });
//db.__adapter().close();
let where = {
    and:[
        ["kek","=","'cheburek'"],
        ["lol","=","'arbidol'"],
    ],
    orderby:[
        ["kek","ASC"],
        ["lol","DESC"],
    ],
    join: {
        type:"INNER JOIN",
        table:"kekuashvilli",
        and:[
            ["kek","=","kekcheburek"],
            ["lul","=","lolarbidol"],
        ]
    },

};
db.selectRowsWhere("test",where,function (data) {
    console.log(1);
});

// app.on('ready', () =>{
//     createWindow(buildPath("index.ejs"),(win) => {
//         require('./modules/ipc/ipcMain')(win);
//     });
//
// });
//
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// });


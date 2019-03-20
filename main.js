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


// db.insertDataInTable("presets",{
//    name:"test1",
//    site_path:"/var/www/sites",
//    apache2_path:"/etc/apache2",
//    nginx_path:"/etc/nginx",
//    apache2_template:"lol kek cheburek",
//    nginx_template:"kek lol arbidol",
// });


let presets = require('./modules/entities/presets/entity');


let preset = new presets({});

preset.getSimpleItems([],presets,(collection) => {
    let items = collection.getItems();
    let item = items[1];
    item.nginx_path = "kekarbidol";
    console.log(item);
})




// preset.load(1,obj => {
//    console.log(obj.getItem());
// });


//let collection = require('./modules/collections/collection');

// let presetsCollections = new collection(presets);
//
// presetsCollections.getSimpleItems({},(items) => {
//
// });











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


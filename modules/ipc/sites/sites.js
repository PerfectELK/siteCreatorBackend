const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const presets = require('./../../entities/presets/entity');

module.exports = (win) => {

    ipcMain.on('createSite',(e,input)=>{
        console.log(input);
    });

    ipcMain.on('createSiteConfig',(e) => {
        let config = new presets({});
        config.name = "Новый пресет";
        config.apache2_path = "/etc/apache/";
        config.nginx_path = "/etc/nginx";
        config.apache2_template = "{{ apache2 }}";
        config.nginx_template = "{{ nginx }}";
        config.site_path = "/var/www/";
        config.save();
        e.sender.send('siteWasCreated');
    });

    ipcMain.on('getSiteConfigs',(e) => {
       console.log('geted');
        let configs = new presets({});
        configs.getSimpleItems({},(collection) => {
            console.log(collection);
        })
    });

}
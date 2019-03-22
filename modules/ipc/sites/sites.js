const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const presets = require('./../../entities/presets/entity');

module.exports = (win) => {

    ipcMain.on('createSite',(e,input)=>{

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
        let configs = new presets({});
        configs.getSimpleItems({},(collection) => {
            e.sender.send('putSiteConfigs',collection.items);
        })
    });

    ipcMain.on('deleteSiteConfig',(e,id) => {
        let config = new presets({});
        config.load(id,(config) => {
            config.delete();
            e.sender.send('siteWasCreated');
        })
    })

    ipcMain.on('saveSiteConfig',(e,item) => {
       let config = new presets({});
       config.load(item.id,(config) => {
          config.name = item.name;
          config.site_path = item.sitePath;
          config.apache2_path = item.apache2Path;
          config.nginx_path = item.nginxPath;
          config.apache2_template = item.apache2Template;
          config.nginx_template = item.nginxTemplate;

          config.save();
           e.sender.send('siteWasCreated');
       });
    });

}
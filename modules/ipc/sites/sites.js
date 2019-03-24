const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const presets = require('./../../entities/presets/entity');
const fs = require('fs');

const {BrowserWindow} = require('electron');


module.exports = (win) => {

    ipcMain.on('createSite',(e,input)=>{
        let config = new presets({});
        config.load(1,'active',config => {

            let apache2Template = config.apache2_template;
            let nginxTemplate = config.nginx_template;
            let sitesPath = config.site_path;
            let siteName = input;

            apache2Template = apache2Template.replace(/{{site}}/g,siteName);
            apache2Template = apache2Template.replace(/{{sitesPath}}/g,sitesPath);

            nginxTemplate = nginxTemplate.replace(/{{site}}/g,siteName);
            nginxTemplate = nginxTemplate.replace(/{{sitesPath}}/g,sitesPath);

            fs.writeFileSync(`./${input}-apache2.conf`,apache2Template);
            fs.writeFileSync(`./${input}-nginx.conf`,nginxTemplate);

            let message = `Конфиг файлы для сайта ${siteName} успешно созданы`;

            require('../../../core/windows/alertWindow')('alert.ejs',{data:message,type:'success'});

        });
    });

    ipcMain.on('createSiteConfig',(e) => {
        let config = new presets({});
        config.name = "Новый пресет";
        config.apache2_path = "/etc/apache/";
        config.nginx_path = "/etc/nginx";
        config.apache2_template = "<VirtualHost *:17080>\n" +
            "              ServerName {{site}}\n" +
            "              ServerAlias www.{{site}}\n" +
            "\n" +
            "              ServerAdmin perfect-elk@perfect-elk.ru\n" +
            "              DocumentRoot {{sitesPath}}{{site}}/html\n" +
            "              DirectoryIndex index.php index.html index.htm\n" +
            "\n" +
            "               <Directory {{sitesPath}}{{site}}/html>\n" +
            "                    Options FollowSymLinks MultiViews\n" +
            "                    AllowOverride All\n" +
            "                    Order allow,deny\n" +
            "                    allow from all\n" +
            "                    </Directory>\n" +
            "\n" +
            "                  <Files xmlrpc.php>\n" +
            "                  Order deny,allow\n" +
            "                  deny from all\n" +
            "                 </Files>\n" +
            "                 LogLevel notice\n" +
            "                 ErrorLog /var/www/log/{{site}}/apache2-error-october.localhost.log\n" +
            "                 CustomLog /var/www/log/{{site}}/apache2-access-october.localhost.log combined\n" +
            "</VirtualHost>\n" +
            "                  #AzbnAutoConfig";
        config.nginx_template = "server {\n" +
            "\n" +
            "                                    listen 80;\n" +
            "                                    server_name {{site}} www.{{site}};\n" +
            "\n" +
            "\n" +
            "                                    index index.php index.html index.htm;\n" +
            "                                    root {{sitesPath}}{{site}}/html;\n" +
            "\n" +
            "                                    access_log /var/www/log/{{site}}/nginx-access-{{site}}.log;\n" +
            "                                    error_log /var/www/log/{{site}}/nginx-error-{{site}}.log;\n" +
            "\n" +
            "\n" +
            "                                    location / {\n" +
            "                                        proxy_pass http://127.0.0.1:17080/;\n" +
            "                                        proxy_set_header Host $host;\n" +
            "                                        proxy_set_header X-Real-IP $remote_addr;\n" +
            "                                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n" +
            "                                        proxy_connect_timeout 120;\n" +
            "                                        proxy_send_timeout 120;\n" +
            "                                        proxy_read_timeout 180;\n" +
            "                                        proxy_buffering off;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                                    location ~* \\.(jpg|jpeg|gif|png|ico|icon|css|less|scss|bmp|swf|js|doc|docx|xls|xlsx|tiff|tar.gz|txt|pdf|psd|zip|rar|mp4|mpeg4|webm|mov|mp3|mkv|woff|woff2|ttf|svg|eot|otf|ttf)$ {\n" +
            "                                        root /var/www/{{site}}/html;\n" +
            "                                        expires 30d;\n" +
            "                                        access_log off;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                                    location /favicon.ico {\n" +
            "                                        access_log off;\n" +
            "                                        log_not_found off;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                                    location /robots.txt {\n" +
            "                                        access_log off;\n" +
            "                                        log_not_found off;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                                    location ~ /get8db0s {\n" +
            "                                        deny all;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                                    location ~ /\\.ht {\n" +
            "                                        deny all;\n" +
            "                                    }\n" +
            "\n" +
            "\n" +
            "                            }\n" +
            "\n" +
            "                            #need https:\n" +
            "\n" +
            "                            #AzbnAutoConfig";
        config.site_path = "/var/www/sites/";
        config.active = 0;
        config.save();
        e.sender.send('siteWasCreated');
    });

    ipcMain.on('getSiteConfigs', (e) => {
        let configs = new presets({});
        configs.getSimpleItems({}, (collection) => {
            e.sender.send('putSiteConfigs', collection.items);
        })
    });

    ipcMain.on('deleteSiteConfig', (e, id) => {
        let config = new presets({});
        config.load(id, (config) => {
            config.delete();
            e.sender.send('siteWasCreated');
        })
    })

    ipcMain.on('saveSiteConfig', (e, item) => {
        let config = new presets({});
        config.load(item.id, (config) => {

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

    ipcMain.on('setActiveSiteConfig',(e,id) => {

        let config = new presets({});
        config.getSimpleItems({
            and:[
                ["active","=",'1']
            ]
        },(collection) => {
            let items = collection.getItems();
            for(let i = 0; i < items.length; i++){
               items[i].active = 0;
               items[i].save();
            }
            let config = new presets({});
            config.load(id,(config) => {
                config.active = 1;
                config.save();
                e.sender.send('siteWasCreated');
            })

        })

    })

}
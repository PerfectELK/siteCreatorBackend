
var ipcRenderer = require('electron').ipcRenderer;
var ipcMain = require('electron').ipcMain;

var modalDelete = Vue.component('modal-body',{
    data:function(){
        return{

        }
    },
    props:['siteName'],
    methods:{
        quit: function () {
            this.$emit('quit');
        },
        deleteSite: function () {
            ipcRenderer.send('deleteSite',this.siteName);
        }
    },
    template:'<div class="modal-body__delete">\n' +
    '        <div class="delete-container">\n' +
    '            <h1>Удалить сайт {{ siteName }}?</h1>\n' +
    '            <div class="delete-btn__container">\n' +
    '                <button class="btn-yes" v-on:click="deleteSite">\n' +
    '                    Да\n' +
    '                </button>\n' +
    '                <button class="btn-no" v-on:click="quit">\n' +
    '                    Нет\n' +
    '                </button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>'
});

var modalChange = Vue.component('modal-body',{
    data:function(){
        return{
            siteNameModel:this.siteName,
            nginx:"",
            apache2:"",
        }
    },
    props:['siteName'],
    methods:{
        change:function(){
            site = {
                name:this.siteName,
                newName:this.siteNameModel,
                nginx:this.nginx,
                apache2:this.apache2,
            };
            ipcRenderer.send('changeSite',site);
        },
        quit:function(){
            this.$emit('quit');
        },
        getSiteConfigs:function(){
            ipcRenderer.send("getSiteConfigsMain", this.siteName);
        }
    },
    created: function () {
        this.getSiteConfigs();
        ipcRenderer.on('takeSiteConfigs',(e,data) => {
            this.nginx = data.nginx;
            this.apache2 = data.apache2;
        })
    },
    watch:{
        siteName:function(){
            this.siteNameModel = this.siteName;
            this.getSiteConfigs();
        }
    },
    template:' <div class="modal-body__change">\n' +
    '        <div class="change-container">\n' +
    '            <h1>Изменение сайта </h1>\n' +
    '            <div class="input-container">\n' +
    '                <label for="name">Название:</label>\n' +
    '                <input type="text" id="name" v-model="siteNameModel">\n' +
    '                <label for="apache">Конфиг apache2:</label>\n' +
    '                <textarea name="" id="apache" cols="30" rows="10" v-model="apache2">\n' +
    '                    \n' +
    '                </textarea>\n' +
    '                <label for="nginx">Конфиг nginx:</label>\n' +
    '                <textarea name="" id="nginx" cols="30" rows="10" v-model="nginx">\n' +
    '                   \n' +
    '                </textarea>\n' +
    '                <div class="btn-container">\n' +
    '                    <button class="save-btn" v-on:click="change">\n' +
    '                        Сохранить\n' +
    '                    </button>\n' +
    '                    <button class="cancel-btn" v-on:click="quit">\n' +
    '                        Отмена\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>',
});



var main = Vue.component('main-c',{
    data:function () {
        return{
            modalClose:true,
            currentModal:'modalDelete',
            create:{
                input:"",
            },
            sites:[],
            chooseSite:"",
        }
    },
    components:{
        'modalDelete':modalDelete,
        'modalChange':modalChange,
    },
    methods:{
        getModal:function(){
            this.modalClose = false;
        },
        changeSiteModal:function(siteName){
            this.currentModal = 'modalChange';
            this.chooseSite = siteName;
            this.getModal();
        },
        deleteSiteModal:function(siteName){
            this.currentModal = 'modalDelete';
            this.chooseSite = siteName;
            this.getModal();
        },
        createSite:function(){
            console.log(this.create.input);
            ipcRenderer.send('createSite',this.create.input);
        },
        getSites:function(){
            ipcRenderer.send("getSites");
        },
        takeSites:function(data){
            this.sites = data;
        },
        reloadApache2:function(){
            ipcRenderer.send('reloadApache2');
        },
        reloadNginx:function(){
            ipcRenderer.send('reloadNginx');
        },
        reloadMysql:function(){
            ipcRenderer.send('reloadMysql');
        }
    },
    created:function(){
        ipcRenderer.on("getedSites",(e,data) => {
            this.takeSites(data);
        })
        this.getSites();
    },
    destroyed:function(){
        ipcRenderer.removeAllListeners("getedSites");
    },
    computed:{
        deleteSite:function(){
            this.modalClose = !this.modalClose;
        },
    },
    template:"#main"
});





var presetsBtn = Vue.component('preset-btn', {
    data: function () {
        return {}
    },
    props: ['item'],
    methods: {
        selectPreset:function(){
            this.$emit('select',this.item.item);
        }
    },
    template: '<div class="preset-list__item"><button class="preset-item" v-on:click="selectPreset(item.item)">{{ item.item.name }}</button></div>'
});


var options = Vue.component('options-c',{

    data:function(){
        return{
            configFields:{
                id:"",
                name:"",
                sitePath:"",
                apache2Path:"",
                nginxPath:"",
                apache2Template:"",
                nginxTemplate:"",
                rootAndGroup:"",
                logsDirectory:"",
            },
            configs:[],
        }
    },
    methods:{
        saveSiteConfig:function(){
            ipcRenderer.send('saveSiteConfig',this.configFields);
        },
        createSiteConfig:function(){
            console.log('create begin');
            ipcRenderer.send('createSiteConfig');
        },
        deleteSiteConfig:function(){
            ipcRenderer.send('deleteSiteConfig',this.configFields.id);
        },
        selectPreset:function(item){
            this.configFields.id = item.id;
            this.configFields.name = item.name;
            this.configFields.sitePath = item.site_path;
            this.configFields.apache2Path = item.apache2_path;
            this.configFields.nginxPath = item.nginx_path;
            this.configFields.apache2Template = item.apache2_template;
            this.configFields.nginxTemplate = item.nginx_template;
            this.configFields.rootAndGroup = item.root_and_group;
            this.configFields.logsDirectory = item.logs_dir;
        },
        checkActivePreset:function(){
          for(var i = 0; i < this.configs.length; i++){
              if(this.configs[i].item.active){
                  return this.configs[i].item;
              }
          }
        },
        setActiveSiteConfig:function(){
            ipcRenderer.send('setActiveSiteConfig',this.configFields.id);
        }
    },
    components:{
        presetsBtn:presetsBtn,
    },
    created:function(){


        ipcRenderer.send('getSiteConfigs');
        ipcRenderer.on('siteWasCreated',() => {
            ipcRenderer.send('getSiteConfigs');
        });
        ipcRenderer.on('putSiteConfigs',(e,data) => {
            this.configs = data;
            this.selectPreset(this.checkActivePreset());
        });
    },
    mounted: function () {

    },
    destroyed:function(){
        ipcRenderer.removeAllListeners('getSiteConfigs');
        ipcRenderer.removeAllListeners('putSiteConfigs');
    },
    template:"#options"
});




var routes = [
    { path: '/', component: main },
    { path: '/options', component: options },
];

var router = new VueRouter({
    routes
});

var app = new Vue({
    router,
    data:{
        isActiveMain:true,
        isActiveOpts:false,
    },
    methods:{
        turnAppWindow:function(){
            console.log('свернуть');
            ipcRenderer.send('turnAppWindow');
        },
        fullResizeWindow:function(){
            console.log('Развернуть');
            ipcRenderer.send('fullResizeWindow');
        },
        closeApp:function(){
            console.log('Закрыть');
            ipcRenderer.send('closeApp');
        },
        setActiveMain:function(){
            this.isActiveMain = true;
            this.isActiveOpts = false;
        },
        setActiveOpts:function(){
            this.isActiveMain = false;
            this.isActiveOpts = true;
        }
    }
}).$mount('#app');
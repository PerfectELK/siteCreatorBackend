
var ipcRenderer = require('electron').ipcRenderer;
var ipcMain = require('electron').ipcMain;

var modalDelete = Vue.component('modal-body',{
    data:function(){
        return{

        }
    },
    props:['siteName'],
    methods:{
      delete:function(){
          console.log('site was deleted');
      },
      quit:function(){
          this.$emit('quit');
      }
    },
    template:'<div class="modal-body__delete">\n' +
    '        <div class="delete-container">\n' +
    '            <h1>Удалить сайт {{ siteName }}?</h1>\n' +
    '            <div class="delete-btn__container">\n' +
    '                <button class="btn-yes">\n' +
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
            nginx:"",
            apache2:"",
        }
    },
    props:['siteName'],
    methods:{
        change:function(){
            console.log('site was changed');
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
    updated: function () {
        this.getSiteConfigs();
    },
    template:' <div class="modal-body__change">\n' +
    '        <div class="change-container">\n' +
    '            <h1>Изменение сайта </h1>\n' +
    '            <div class="input-container">\n' +
    '                <label for="name">Название:</label>\n' +
    '                <input type="text" id="name" v-bind:value="this.siteName">\n' +
    '                <label for="apache">Конфиг apache2:</label>\n' +
    '                <textarea name="" id="apache" cols="30" rows="10">\n' +
    '                    {{ this.apache2 }}\n' +
    '                </textarea>\n' +
    '                <label for="nginx">Конфиг nginx:</label>\n' +
    '                <textarea name="" id="nginx" cols="30" rows="10">\n' +
    '                    {{ this.nginx }}\n' +
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






var exit = Vue.component('exit-c',{
    data:() =>{
        return{

        }
    },
    template:"#exit"
});


var routes = [
    { path: '/', component: main },
    { path: '/options', component: options },
    { path: '/exit', component: exit }
]

var router = new VueRouter({
    routes
});

var app = new Vue({
    router,
    data:{

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
        }
    }
}).$mount('#app');




const scrollbar = document.getElementById('scrollbar');
const scrollItem = document.getElementById('scrollItem');

let windowHeight = window.innerHeight;
let contentHeight = Math.max(document.body.scrollHeight);
let scrollItemLenght = Math.ceil(windowHeight * windowHeight/contentHeight);

scrollInit();

function scrollInit(){
    windowHeight = window.innerHeight;
    contentHeight = Math.max(document.body.scrollHeight);
    scrollItemLenght = Math.ceil(windowHeight * windowHeight/contentHeight);
    setScrollItemlenght();
}

function getScrollItemHeight(){
    let windowHeight = window.innerHeight;
    let contentHeight = Math.max(document.body.scrollHeight);
    return Math.ceil(windowHeight * windowHeight/contentHeight)
}

function setScrollItemlenght(){
    scrollItem.style.height = getScrollItemHeight() + "px";
}

function checkBody(e){
    let scrollheight = parseInt((e.deltaY > 0) ? parseInt(document.body.style.top) - Math.abs(e.deltaY) : parseInt(document.body.style.top) + Math.abs(e.deltaY)) || 0;


    let bodyOffset = parseInt(document.body.style.top) || 0;
    let scrolled = (e.deltaY > 0) ? bodyOffset - Math.abs(e.deltaY) : bodyOffset + Math.abs(e.deltaY);

    if(scrollheight >= 0 && e.deltaY < 0){
        document.body.style.top = "0px";
        scrollItem.style.top = "0%";
        return false;
    }
    let scrollWithWindowHeight = Math.abs(scrollheight) + window.innerHeight;

    if(scrollWithWindowHeight >= contentHeight + 50){
        document.body.style.top = -contentHeight + windowHeight - 50 + 'px';
        moveScrollBar(scrolled);
        return false;
    }

    return true
}

function moveScrollBar(scrolled){

    let scrolledHeight = Math.ceil(((Math.abs(scrolled)) / contentHeight) * 100);
    scrollItem.style.top = scrolledHeight + "%";
}

function scroll(e){
    if(!checkBody(e))return false
    let bodyOffset = parseInt(document.body.style.top) || 0;
    let scrolled = (e.deltaY > 0) ? bodyOffset - Math.abs(e.deltaY) : bodyOffset + Math.abs(e.deltaY);
    document.body.style.top = (e.deltaY > 0) ? bodyOffset - Math.abs(e.deltaY) + "px" : bodyOffset + Math.abs(e.deltaY) + "px";
    moveScrollBar(scrolled);
}


window.onresize = function(){
    scrollInit();
}

document.body.addEventListener('click',function(){
    scrollInit();
})

document.body.addEventListener('wheel',function (e) {
    if(windowHeight >= contentHeight)return false

    let ev = {
        deltaY:35 * Math.sign(e.deltaY)
    }
    scroll(ev)
})

let scrollItemDown = false;
let clickCoordY = 0;

console.log(window.innerHeight);


document.body.onmousemove = function(e){
    if(scrollItemDown){
        let deltaY = (e.y - clickCoordY) * 2
        let ev = {
            deltaY:deltaY
        };
        clickCoordY = e.y
        scroll(ev)
    }
}

document.body.onmouseup = function(e){
    scrollItemDown = false;
}

scrollItem.onmousedown = function(e){
    e.preventDefault()
    scrollItemDown = true;
    clickCoordY = e.y;
}
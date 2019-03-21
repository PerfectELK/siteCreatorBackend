
var ipcRenderer = require('electron').ipcRenderer;
var ipcMain = require('electron').ipcMain;

var modalDelete = Vue.component('modal-body',{
    data:function(){
        return{

        }
    },
    methods:{
      delete:function(){
          console.log('site was deleted');
      },
      quit:function(){
          this.$emit('quit');
      }
    },
    template:'#siteDeleteForm'
});

var modalChange = Vue.component('modal-body',{
    data:function(){
        return{

        }
    },
    methods:{
        change:function(){
            console.log('site was changed');
        },
        quit:function(){
            this.$emit('quit');
        }
    },
    template:'#siteChangeForm',
});



var main = Vue.component('main-c',{
    data:function () {
        return{
            modalClose:true,
            currentModal:'modalDelete',
            create:{
                input:"",
            }
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
            this.getModal();
        },
        deleteSiteModal:function(siteName){
            this.currentModal = 'modalDelete';
            this.getModal();
        },
        createSite:function(){
            console.log(this.create.input);
            ipcRenderer.send('createSite',this.create.input);
        }
    },
    computed:{
        deleteSite:function(){
            this.modalClose = !this.modalClose;
        },
    },
    template:"#main"
});


var options = Vue.component('options-c',{
    data:() =>{
        return{
            configFields:{
                id:"",
                name:"",
                sitePath:"",
                apache2Path:"",
                nginxPath:"",
                apache2Template:"",
                nginxTemplate:"",
            },
            configs:[],
        }
    },
    methods:{
        saveSiteConfig:function(){
            ipcRenderer.send('saveSiteConfig',this.configFields);
        },
        createSiteConfig:function(){
            ipcRenderer.send('createSiteConfig');
        },
        deleteSiteConfig:function(){
            ipcRenderer.send('deleteSiteConfig',this.configFields.id);
        }
    },
    mounted: function () {
        ipcRenderer.on('siteWasCreated',() => {
            ipcRenderer.send('getSiteConfig');
        });
        ipcRenderer.on('putSiteConfigs',(e,data) => {
            this.configs = data;
        });
    },
    destroyed: function () {
        ipcRenderer.removeListener('siteWasCreated',() => {});
        ipcRenderer.removeListener('getSiteConfig',() => {});

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
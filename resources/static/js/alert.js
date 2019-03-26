let close = document.querySelector('.close');
let ipcRenderer = require('electron').ipcRenderer;
let message = document.getElementById('message');

let mainBlock = document.querySelector('.alert-main__block');
let nav = document.querySelector('.navbar');

ipcRenderer.send('getMessage');

let h;

ipcRenderer.on('message',(e,data) => {
    h = data.hash;
    if(data.type == 'success'){
        mainBlock.classList.add('success');
        nav.classList.add('success');
    }else{
        mainBlock.classList.add('error');
        nav.classList.add('error');
    }
    message.innerHTML = data.data;
});

setTimeout(() => {
    ipcRenderer.send(`closeWindow${h}`);
},6000);

close.onclick = function(){
    ipcRenderer.send(`closeWindow${h}`);
}
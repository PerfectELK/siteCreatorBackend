let close = document.querySelector('.close');
let ipcRenderer = require('electron').ipcRenderer;
let message = document.getElementById('message');

let mainBlock = document.querySelector('.alert-main__block');
let nav = document.querySelector('.navbar');

ipcRenderer.send('getMessage');
ipcRenderer.on('message',(e,data) => {
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
    ipcRenderer.send('closeWindow');
},7000);

close.onclick = function(){
    ipcRenderer.send('closeWindow');
}
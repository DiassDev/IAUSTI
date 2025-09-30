var menu2 = document.querySelector('.menu2');
var ul = document.querySelector(',ul');
menu2.addEventListener('click',()=>{
    
    if (ul.classList.contains('ativo')) {
        ul.classList.remove('ativo');
    }else{
        ul.classList.add('ativo')
    }

})
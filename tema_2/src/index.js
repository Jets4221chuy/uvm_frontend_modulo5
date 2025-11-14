import _ from 'lodash';

function componente (){
    const elemento = document.createElement('div');
    //mostrar mensaje con lodash
    elemento.innerHTML = _.join(['hola','Webpack'],' ');
    return elemento;
}

document.body.appendChild(componente())
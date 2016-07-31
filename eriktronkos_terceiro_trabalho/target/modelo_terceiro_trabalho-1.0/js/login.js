
window.onload = mainLogin;
//------------------------------------------------------------------------------
function mainLogin(){
    dialogoBusca = new ObjDialogo('idRespAutorizacao');
    document.getElementById('idCurrentTime').innerHTML = getCurrentDateTimeISO8601();
    document.getElementById('menuEntrar').addEventListener(
            'mouseover', function () {
                mudarCorItemMenu('menuEntrar', 'green', 'white');
            });
    document.getElementById('menuEntrar').addEventListener(
            'mouseout', function () {
                mudarCorItemMenu('menuEntrar', 'none', 'white');
            });
    document.getElementById('menuEntrar').addEventListener(
            'click', function () {
                document.getElementById('idForm').submit();
            });
}
//------------------------------------------------------------------------------
function mudarCorItemMenu(idMenu, bg, col) {
    if(bg==='none'){
        document.getElementById(idMenu).style.setProperty('background', 'rgba(100, 100, 100, 0.0)');
    }else{
        document.getElementById(idMenu).style.setProperty('background-color', bg);
    }
    document.getElementById(idMenu).style.setProperty('color', col);
}
//------------------------------------------------------------------------------
function getCurrentDateTimeISO8601() {
    var currentdate = new Date();
    var datetime =
        currentdate.getFullYear() + "-" +
        leftZeroPadded2digits((currentdate.getMonth() + 1).toString()) + "-" +
        leftZeroPadded2digits(currentdate.getDate().toString()) + "T" +
        leftZeroPadded2digits(currentdate.getHours().toString()) + ":" +
        leftZeroPadded2digits(currentdate.getMinutes().toString()) + ":" +
        leftZeroPadded2digits(currentdate.getSeconds().toString());
    return datetime;
}
//------------------------------------------------------------------------------
function leftZeroPadded2digits(s) {
    if (s.length < 2)
        s = "0" + s;
    return s;
}
//------------------------------------------------------------------------------
var ObjDialogo = function (id) {
    this.elementoDialogo = document.getElementById(id);
    this.escreverMensagem = function (classeDaCor, texto) {
        this.elementoDialogo.innerHTML = texto;
        if(classeDaCor===null){
            this.elementoDialogo.removeAttribute('class');
        }else{
            this.elementoDialogo.setAttribute('class', classeDaCor);
        }
    };
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

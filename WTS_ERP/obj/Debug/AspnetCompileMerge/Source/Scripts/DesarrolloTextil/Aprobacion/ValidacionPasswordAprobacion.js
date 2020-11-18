var app = new Framework7({ root: '#appAprobacion', theme: 'auto' });
var opar = { par: '', id: '',tela:'' }
function urlBase() { var url = document.getElementById("urlBase").value; return url; }
function getParameterByName(_name) { var name = _name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"); var regexS = "[\\?&]" + name + "=([^&#]*)"; var regex = new RegExp(regexS); var results = regex.exec(window.location.href); if (results == null) return ""; else return decodeURIComponent(results[1].replace(/\+/g, " ")); }
function Get(url, metodo) { var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("get", url, !0); xhr.onreadystatechange = function (e) { if (xhr.readyState == 4) { if (xhr.status == 200) { metodo(xhr.responseText); } } }; xhr.send(); }
function Post(url, frm, metodo) { var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("post", url, !0); xhr.send(frm); xhr.onreadystatechange = function () { if (xhr.readyState == 4) { if (xhr.status == 200) { metodo(xhr.responseText); setTimeout(function () { }, 0 | Math.random() * 500); } } } }
function ConfirmarPassword() {
    var txt = document.getElementById('password').value,
        comentario = document.getElementById('comentario').value;
    if (txt.trim().length > 0 && opar.par !== '' && comentario.trim().length > 0) {
        var obj = {
            pass: txt,
            params: opar.par,
            coment: comentario,
            id:opar.id
        }
        var frm = new FormData();
        frm.append('par', JSON.stringify(obj));
        Post('DesarrolloTextil/Aprobacion/validarCredencialesAprobacion', frm, exitoAprobacion)
    } else {
        var amensaje = [];
        if (txt.trim().length == 0) { amensaje.push('* Ingrese Contraseña   ') }//+ '\n'  <br>
        if (comentario.trim().length == 0) { amensaje.push('* Ingrese Comentario') }
        swal({
            title: 'Error!',            
            text: amensaje.join('\n'),
            type: 'error'
        })
    }
}
function exitoAprobacion(respuesta) {
    var orespuesta = respuesta !== '' ? JSON.parse(respuesta)[0] : null;
    if (orespuesta !== null) {
        swal({
            title: 'Mensaje',
            text: orespuesta.mensaje,
            type: orespuesta.estado
        })
    }
}
(function () {
    opar.par = getParameterByName('par');
    opar.id = getParameterByName('id');
    opar.tela = getParameterByName('tela');
    document.getElementById('tituloapp').innerHTML = 'Consignar Tela: #' + opar.tela;
})();
var app = new Framework7({ root: '#appTermino', theme: 'auto' });
var opar = { par: '', id: '', numero: '' }
function urlBase() { var url = document.getElementById("urlBase").value; return url; }
function getParameterByName(_name) { var name = _name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"); var regexS = "[\\?&]" + name + "=([^&#]*)"; var regex = new RegExp(regexS); var results = regex.exec(window.location.href); if (results == null) return ""; else return decodeURIComponent(results[1].replace(/\+/g, " ")); }
function Get(url, metodo) {
    var xhr = new XMLHttpRequest();
    url = urlBase() + url;
    xhr.open("get", url, !0);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                metodo(xhr.responseText);
            }
        }
    }; xhr.send();
}

function Post(url, frm, metodo) {
    var xhr = new XMLHttpRequest();
    url = urlBase() + url;
    xhr.open("post", url, !0);
    xhr.send(frm); xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                metodo(xhr.responseText);
                setTimeout(function () { }, 0 | Math.random() * 500);
            }
        }
    }
}

function obtenervalor(ctrl) {

    for (i = 0; i < ctrl.length; i++)
        if (ctrl[i].checked)
            return ctrl[i].value;
}

function ConfirmarPassword() {
    var txt = document.getElementById('password').value,
        comentario = document.getElementById('observacion').value,
        valorizacion = parseInt(obtenervalor(document.formvalorizacion.gender));
    if (txt.trim().length > 0 && opar.par !== '') {
        var obj = {
            pass: txt,
            params: opar.par,
            coment: comentario,
            valor: valorizacion,
        }
        var frm = new FormData();
        frm.append('par', JSON.stringify(obj));
        Post('TecnologiaInformacion/TicketConfirmacion/Ticket_Validar_Terminar', frm, exitoAprobacion)
    } else {
        swal({
            title: 'Error!',
            text: 'Ingrese Contraseña',
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
    else {
        swal({
            title: 'Mensaje',
            text: 'Credenciales Invalidas..',
            type: 'warning'
        })
    }
}

(function () {
    opar.par = getParameterByName('par');
    opar.id = getParameterByName('id');
    opar.numero = getParameterByName('numero');
    document.getElementById('tituloapp').innerHTML = 'Terminar Ticket: # ' + opar.numero;

})();
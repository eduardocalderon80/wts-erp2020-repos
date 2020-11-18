var app = new Framework7({root: '#appAprobacion',theme: 'auto'});
var opar = { par: '', id: '' }
function urlBase() { var url = document.getElementById("urlBase").value; return url; }
function getParameterByName(_name) { var name = _name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"); var regexS = "[\\?&]" + name + "=([^&#]*)"; var regex = new RegExp(regexS); var results = regex.exec(window.location.href); if (results == null) return ""; else return decodeURIComponent(results[1].replace(/\+/g, " ")); }
function Get(url, metodo){ var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("get", url, !0); xhr.onreadystatechange = function (e) { if (xhr.readyState == 4) { if (xhr.status == 200) { metodo(xhr.responseText); } } }; xhr.send(); }
function Post(url, frm, metodo) { var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("post", url, !0); xhr.send(frm); xhr.onreadystatechange = function () { if (xhr.readyState == 4) { if (xhr.status == 200) { metodo(xhr.responseText); setTimeout(function () { }, 0 | Math.random() * 500); } } } }
function ConfirmarPassword() {    
    var txt = document.getElementById('password').value;    
    if (txt.trim().length > 0 && opar.par !== '') {

        let radios = document.getElementsByName("rbaprobar"), value= '';
        for (var i = 0, length = radios.length; i < length; i++)
        {
            if (radios[i].checked) {
                value = radios[i].value;
                break;
            }
        }

        var obj = {
            pass: txt,
            params: opar.par,
            value:value
        }
        var frm = new FormData();
        frm.append('par', JSON.stringify(obj));        
        Post('DesarrolloTextil/SolicitudDesarrolloTela/validarCredencialesAprobacion', frm, exitoAprobacion)
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
        });
        if (orespuesta.estado === "success") {
            let btn = document.getElementById("btnSave"), pwd = document.getElementById("password"), rb = document.getElementsByName("rbaprobar"), mensaje = document.getElementById("mensaje");
            btn.setAttribute('disabled', true), pwd.setAttribute('disabled', true);
            btn.style.cursor = 'not-allowed', pwd.style.cursor = 'not-allowed';
            btn.style.backgroundColor = "#DDD", pwd.style.backgroundColor = "#DDD";
            btn.style.color = "#999", pwd.style.color = "#999";
            rb.forEach(x => {
                x.disabled = true;
            });           
        }
        mensaje.innerHTML = orespuesta.mensaje;
    }
}
(function () {
    opar.par = getParameterByName('par');
    opar.id = getParameterByName('id');
    document.getElementById('tituloapp').innerHTML = 'Solicitud: #' + opar.id;
})();
var app = new Framework7({ root: '#appAprobacion', theme: 'auto' });
var opar = { id: '' }
var variables = { arrinfo: [] }

function urlBase() { var url = document.getElementById("urlBase").value; return url; }

function getParameterByName(_name) {
    var name = _name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function Get(url, metodo) {
    var xhr = new XMLHttpRequest();
    url = urlBase() + url;
    xhr.open("get", url, !0);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) { if (xhr.status == 200) { metodo(xhr.responseText); } }
    }; xhr.send();
}

function Post(url, frm, metodo) {
    var xhr = new XMLHttpRequest();
    url = urlBase() + url;
    xhr.open("post", url, !0);
    xhr.send(frm);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) { metodo(xhr.responseText); setTimeout(function () { }, 0 | Math.random() * 500); }
        }
    }
}

function _(id) { return document.getElementById(id); }

function load() {
    _('linkdecargarreporte').addEventListener('click', fn_export_test);
    _('btnSave').addEventListener('click', req_concesionar);
}

function req_concesionar() {
    let contrasena = _('password').value;

    if (contrasena != '') {
        let arrinfo = JSON.parse(variables.arrinfo);
        let urlaccion = `Laboratorio/Partida/Laboratorio_Consesionar_Insert`;
        let reportecnico = arrinfo[0].reporte_tecnico;
        partida = _('numero_partida').innerHTML;
        idclienteerp = arrinfo[0].idcliente_erp;
        idproveedor = arrinfo[0].idproveedor_erp;
        status = _('status_final').innerHTML;
        status_tono = _('status_tono').innerHTML;
        cliente = _('cliente').innerHTML;
        fabrica = _('fabrica').innerHTML;

        let par = JSON.stringify({
            cod_partida: opar.id, contrasena: contrasena, reportecnico: reportecnico, partida: partida,
            idclienteerp: idclienteerp, idproveedor: idproveedor, status: status, status_tono: status_tono,
            cliente: cliente, fabrica: fabrica
        });
        var frm = new FormData();
        frm.append('par', par);
        Post(urlaccion, frm, res_concesionar);
    }
    else {
        swal({
            title: 'Error!',
            text: 'Ingrese Contraseña',
            type: 'warning'
        })
    }
}

function res_concesionar(response) {
    let orpta = response != null ? JSON.parse(response)[0] : null;
    if (orpta != null)
    {
        swal({
            title: 'Mensaje!',
            text: orpta.mensaje,
            type: orpta.estado
        });
    }
    else {
        swal({
            title: 'Mensaje',
            text: 'Credenciales Invalidas..',
            type: 'warning'
        });
    }
}

function fn_export_test() {

    let urlaccion = urlBase() + "Laboratorio/Partida/ReportePartida/" + opar.id;
    window.location.href = urlaccion;
    //var link = document.createElement("a");
    //link.href = urlaccion;
    //document.body.appendChild(link);
    //link.click();
    //document.body.removeChild(link);
    //delete link;
    //return;
}

function req_ini() {
    let par = JSON.stringify({ cod_partida: opar.id });
    let urlaccion = `Laboratorio/Partida/Laboratorio_Concesionar_Get?par=` + par;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].info != '') { variables.arrinfo = orpta[0].info; }
        fn_load_info();
    }
}

function fn_load_info() {
    let arrinfo = JSON.parse(variables.arrinfo);
    _('tituloapp').innerHTML = 'Concesionar: # ' + arrinfo[0].reporte_tecnico;
    _('cliente').innerHTML = arrinfo[0].cliente;
    _('fabrica').innerHTML = arrinfo[0].fabrica;
    _('numero_partida').innerHTML = arrinfo[0].numero_partida;
    _('status_final').innerHTML = arrinfo[0].status_final;
    _('status_tono').innerHTML = arrinfo[0].status_tono;
    _('tipo_prueba').innerHTML = arrinfo[0].tipo_prueba;
    _('pos').innerHTML = arrinfo[0].pos;
    _('estilos').innerHTML = arrinfo[0].estilos;     

}

(function () {
    opar.id = getParameterByName('id');   
    load();
    req_ini();
})();
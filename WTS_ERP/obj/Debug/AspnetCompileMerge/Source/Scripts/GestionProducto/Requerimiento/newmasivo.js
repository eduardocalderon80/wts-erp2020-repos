var ovariables = {
    accion: '',
    idgrupocomercial: ''
}

function load() {
  
    let par = _('txtpar').value;
    if (!_isEmpty(par)) {
        ovariables.accion = _par(par, 'accion');
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');       
    }

    _modal('addestilomasivo', 1000);
    $('#modal_addestilomasivo').on('show.bs.modal', ejecutarmodaladdestilomasivo);
    _('btn_addestilomasivo').addEventListener('click', addestilomasivo);

    _modal('enviarcorreomasivo', 1000);
    $('#modal_enviarcorreomasivo').on('show.bs.modal', ejecutarmodalcorreomasivo);
    _('btnSendMail').addEventListener('click', correomasivo);
}

function ejecutarmodaladdestilomasivo() {
    let modal = $(this);

    modal.find('.modal-title').text('Search style');

    let urlaccion = 'GestionProducto/Requerimiento/_AddEstiloMasivo';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyaddestilomasivo').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Requerimiento/_AddEstiloMasivo');
    });
}

function addestilomasivo() {
    //let idcliente = _('cboCliente').value;
    //if (idcliente == '' || parseInt(idcliente) <= 0) {
    //    _swal({ estado: 'error', mensaje: 'Seleccione el cliente.' });
    //    return false;
    //}
    $('#modal_addestilomasivo').modal('show');
}

function ejecutarmodalcorreomasivo() {
    let modal = $(this);
    modal.find('.modal-title').text('Send Mail');
    let urlaccion = 'GestionProducto/Requerimiento/_EnviarCorreoMasivo';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyenviarcorreomasivo').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Requerimiento/_EnviarCorreoMasivo');
    });
}

function correomasivo() {
    //let idcliente = _('cboCliente').value;
    //if (idcliente == '' || parseInt(idcliente) <= 0) {
    //    _swal({ estado: 'error', mensaje: 'Seleccione el cliente.' });
    //    return false;
    //}
    $('#modal_enviarcorreomasivo').modal('show');
}

function res_ini(respuesta) {
  
}

function req_ini() {
    let urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosNew', par = JSON.stringify({ xd: 1 });

    urlaccion = urlaccion + '?par=' + par;
    Get(urlaccion, res_ini);
}

(
    function ini() {
        load();
        //req_ini();
    }
)();
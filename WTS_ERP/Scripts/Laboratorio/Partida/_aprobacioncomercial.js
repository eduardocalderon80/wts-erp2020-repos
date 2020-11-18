function load() {
    _('_btn_aprobar_comercial').addEventListener('click', fn_aprobacioncomercial_partida);
    _('_btn_rechazar_comercial').addEventListener('click', fn_rechazocomercial_partida);
}

function res_ini(respuesta) {
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null;
    if (orpta !== null) {
        _('_txta_comentario_aprobarcomercial').value = orpta[0].comentarioaprobadocomercial;
    }
}

function fn_aprobacioncomercial_partida(e) {
    if (_('_txta_comentario_aprobarcomercial').value === '') {
        _('div_grupo_comentario_aprobarrechazar').classList.add('has-error');
        _('div_grupo_comentario_aprobarrechazar').focus();
        return false;
    }

    let idpartida = _('hf_idpartida_index').value;
    let parametro = { comentarioaprobadocomercial: _('_txta_comentario_aprobarcomercial').value, aprobadocomercial: true, idpartida: idpartida };
    let frmdata = new FormData();
    frmdata.append('par', JSON.stringify(parametro));
    Post('Laboratorio/Partida/PartidaAprobadoComercialActualizar', frmdata, res_aprobacion_comercial);
}

function fn_rechazocomercial_partida(e) {
    if (_('_txta_comentario_aprobarcomercial').value === '') {
        _('div_grupo_comentario_aprobarrechazar').classList.add('has-error');
        _('div_grupo_comentario_aprobarrechazar').focus();
        return false;
    }

    let idpartida = _('hf_idpartida_index').value;
    let parametro = { comentarioaprobadocomercial: _('_txta_comentario_aprobarcomercial').value, aprobadocomercial: false, idpartida: idpartida };
    let frmdata = new FormData();
    frmdata.append('par', JSON.stringify(parametro));
    Post('Laboratorio/Partida/PartidaAprobadoComercialActualizar', frmdata, res_rechazo_comercial);
}

function res_aprobacion_comercial(respuesta) {
    debugger;
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null, par = _('txtpar_aprobarcomercial').value, idpartida = orpta.id, estado = _par(par, 'estado');
    let tipo = orpta.estado ? 'success' : 'error', mensaje = orpta.mensaje;
    if (tipo === 'success') {
        ////req_load_menu_response(estado, idpartida);
        recargabandeja_partidaxid();
    }
    //mensaje
    swal({
        title: "Message",
        text: mensaje,
        type: tipo
    }, function (accion) {
        //oculta mensaje
        if (accion) {
            $('#modal__AprobacionComercial').modal('hide');
        }
    });
}

function res_rechazo_comercial(respuesta) {
    debugger;
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null, par = _('txtpar_aprobarcomercial').value, idpartida = orpta.id, estado = _par(par, 'estado');
    let tipo = orpta.estado ? 'success' : 'error', mensaje = orpta.mensaje;
    if (tipo === 'success') {
        req_load_menu_response(estado, idpartida);
    }
    //mensaje
    swal({
        title: "Message",
        text: mensaje,
        type: tipo
    }, function (accion) {
        //oculta mensaje
        if (accion) {
            $('#modal__AprobacionComercial').modal('hide');
        }
    });
}

function req_ini() {
    let idpartida = _('hf_idpartida_index').value;
    Get('Laboratorio/Partida/GetData_PartidaAprobadoComercialObtener_JSON?par=' + idpartida, res_ini);
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'div_float_aprobarcomercial', clase: '_enty' });
    }
)();
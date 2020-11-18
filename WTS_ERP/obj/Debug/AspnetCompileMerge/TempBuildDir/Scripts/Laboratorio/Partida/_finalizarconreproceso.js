function load() {
    _('_btn_save_finalizarrechazado_partida').addEventListener('click', _fn_finalizarpartida_rechazado);
    _('_btn_save_finalizaraprobado_partida').addEventListener('click', _fn_finalizarpartida_aprobado);
}

function res_ini(respuesta) {
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null, estadopartida = -1, nombre_estadocolor_seleccionado = '', valorestadocolor = -1,
        comentariocolor = '', comentariotesting = '', aprobacioncomercial = -1, nombreestadopartida = '', nombreestadocomercial = '';

    if (orpta !== null) {
        let partida = JSON.parse(orpta[0].partida);
        estadopartida = partida[0].estadopartida;
        nombre_estadocolor_seleccionado = partida[0].nombreestadocolor;
        valorestadocolor = partida[0].estadocolor;
        comentariocolor = partida[0].comentariocolor;
        comentariotesting = partida[0].comentariotesting;
        aprobacioncomercial = partida[0].aprobadocomercial;
        nombreestadopartida = partida[0].nombreestadopartida;
        nombreestadocomercial = partida[0].nombreestadocomercial;

        if (estadopartida === 1) {
            // APROBADO
            let htmlestadocomercial = '', htmlestadopartida = '';
            if (aprobacioncomercial === 1) {
                htmlestadocomercial = `<label class='control-label'><strong style='color: #FFA746;'>${nombreestadocomercial} <span class='fa fa-thumbs-o-up' style='color: #FFA746;'></span></strong></label>`;
            } else if (aprobacioncomercial === 0) {
                htmlestadocomercial = `<label class='control-label'><strong class='text-danger'>${nombreestadocomercial} <span class='fa fa-thumbs-o-down' style='color:red;'></span></strong></label>`;
            } else {
                htmlestadocomercial = `<label class='control-label'>none <span class='fa fa-minus-square-o'></span></label>`;
            }
            
            htmlestadopartida = `<label class='control-label'><strong style='color: #39EB7F;'>${nombreestadopartida} <span class='fa fa-thumbs-o-up' style='color: #39EB7F;'></span></strong></label>`;
            
            _('div_finalizarconaprobacion').classList.remove('hide');
            _('_btn_save_finalizaraprobado_partida').classList.remove('hide');
            _('_div_estado_aprobacioncomercial').innerHTML = htmlestadocomercial;
            _('_div_section_estadopartidalaboratorio').innerHTML = htmlestadopartida;
            _('_div_comentariofinalizarpartida').classList.add('hide');
        } else if (estadopartida === 2) {
            // RECHAZADO
            let html_estadocolor = '';
            _('div_finalizarconrechazo').classList.remove('hide');
            if (valorestadocolor === 1) {
                html_estadocolor = `<label class='control-label'><strong style='color: #39EB7F;'>${nombre_estadocolor_seleccionado} <span class='fa fa-thumbs-o-up' style='color: #39EB7F;'></span></strong></label>`;
            } else if (valorestadocolor === 2) {
                html_estadocolor = `<label class='control-label'><strong class='text-danger'>${nombre_estadocolor_seleccionado} <span class='fa fa-thumbs-o-down' style='color:red;'></span></strong></label>`;
            } else if (valorestadocolor === 3) {
                html_estadocolor = `<label class='control-label'><strong class='text-warning'>${nombre_estadocolor_seleccionado} <span class='fa fa-thumbs-o-down text-warning'></span></strong></label>`;
            }
            _('div_section_estadocolor').innerHTML = html_estadocolor;

            _('_txt_comentariocolor_finalizar').value = comentariocolor;
            _('_txt_comentariotesting_finalizar').value = comentariotesting;
            _('_btn_save_finalizarrechazado_partida').classList.remove('hide');
        } else if (estadopartida === 3) {
            // PENDIENTE
            let htmlestadocomercial = '', htmlestadopartida = '';
            if (aprobacioncomercial === 1) {
                htmlestadocomercial = `<label class='control-label'><strong style='color: #FFA746;'>${nombreestadocomercial} <span class='fa fa-thumbs-o-up' style='color: #FFA746;'></span></strong></label>`;
            } else if (aprobacioncomercial === 0) {
                htmlestadocomercial = `<label class='control-label'><strong class='text-danger'>${nombreestadocomercial} <span class='fa fa-thumbs-o-down' style='color:red;'></span></strong></label>`;
            } else {
                htmlestadocomercial = `<label class='control-label'>none <span class='fa fa-minus-square-o'></span></label>`;
            }
            htmlestadopartida = `<label class='control-label text-warning'><strong>${nombreestadopartida} <span class='fa fa-thumbs-o-up'></span></strong></label>`;
            _('div_finalizarconaprobacion').classList.remove('hide');
            _('_btn_save_finalizaraprobado_partida').classList.remove('hide');
            _('_div_estado_aprobacioncomercial').innerHTML = htmlestadocomercial;
            _('_div_section_estadopartidalaboratorio').innerHTML = htmlestadopartida;
        }
    }
}

function _fn_finalizarpartida_rechazado() {
    let validacion = _required({ id: 'panelEncabezado_finalizarconreproceso', clase: '_enty' }), par = _('txtpar_reprocesopartida').value, 
        idpartida = _par(par, 'idpartida');
    if (validacion) {
        let parametro_reproceso = _getParameter({ id: 'panelEncabezado_finalizarconreproceso', clase: '_enty' });
        let _err = function (__error) { console.log("error", __error) };
        _Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida)
            .then((odata_respuesta) => {
                res_getDataPartida_Parafinalizar(odata_respuesta, parametro_reproceso);
            }, (p) => { _err(p) });
        //Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida, res_getDataPartida_Parafinalizar);
    }
}

function _fn_finalizarpartida_aprobado() {
    let validacion = _required({ id: 'panelEncabezado_finalizarconreproceso', clase: '_enty' }), par = _('txtpar_reprocesopartida').value,
        idpartida = _par(par, 'idpartida'), estadopartida = _par(par, 'estado');

    _('_div_comentariofinalizarpartida').classList.remove('has-error');
    if (validacion) {
        if (estadopartida === 'pending') {
            if (_('_txt_comentariofinalizacion').value.trim() === '') {
                _('_div_comentariofinalizarpartida').classList.add('has-error');
                _('_txt_comentariofinalizacion').focus();
                return false;
            }
        }

        let parametro_reproceso = _getParameter({ id: 'panelEncabezado_finalizarconreproceso', clase: '_enty' });
        let _err = function (__error) { console.log("error", __error) };
        _Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida)
            .then((odata_respuesta) => {
                res_getDataPartida_Parafinalizar(odata_respuesta, parametro_reproceso);
            }, (p) => { _err(p) });
        //Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida, res_getDataPartida_Parafinalizar);
    }
}

function req_ini() {
    let par = _('txtpar_reprocesopartida').value, idpartida = _par(par, 'idpartida');
    Get('Laboratorio/Partida/GetDataFinalizarConReproceso_Index?par=' + idpartida, res_ini);
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'panelEncabezado_finalizarconreproceso', clase: '_enty' });
    }
)();
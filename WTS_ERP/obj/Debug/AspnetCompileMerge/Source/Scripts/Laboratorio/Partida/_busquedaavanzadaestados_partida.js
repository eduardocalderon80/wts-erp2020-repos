var __ovariables_busquedaavanzada_partida = {
    lstclientecolor: []
}

function load() {
    $('#div_group_fechainicio_busquedaavanzadapartida .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    $('#div_group_fechafin_busquedaavanzadapartida .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    _('_btnBuscar_busquedaavanzada_partida').addEventListener('click', _fn_buscar_busquedaavanzada_partida);
    _('_cbo_cliente_busquedaavanzadapartida').addEventListener('change', _fn_change_filterclientecolor);
}

function _fn_buscar_busquedaavanzada_partida() {
    let validacion = _required({ id: 'panelEncabezado_busquedaavanzada_partida', clase: '_enty' });
    if (validacion) {
        let pasavalidacion = validacionesextras_partida();
        if (!pasavalidacion) {
            return false;
        }

        let par = _getParameter({ id: 'panelEncabezado_busquedaavanzada_partida', clase: '_enty' });
        par['esfiltroavanzado_sino'] = 'si';
        //par['nombreperfil'] = __opartida.perfil;
        let estadopartida_cadena = _('_cbo_estado_busquedaavanzadapartida').value, estado_str = estadopartida_cadena.split('|')[1];  // 1|approved; 2|rejected; 3|pending
        par['estado'] = estado_str;
                
        req_load_menu_filteravanzado_partida(par);
    }
}

function res_ini(rpta) {
    let orpta = rpta !== '' ? JSON.parse(rpta) : null;
    if (orpta !== null) {
        _('_cbo_proveedor_busquedaavanzadapartida').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromCSV(orpta[0].proveedor);
        _('_cbo_cliente_busquedaavanzadapartida').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromCSV(orpta[0].cliente);
        //_('_cbo_color_busquedaavanzadapartida').innerHTML = _comboItem({ value: '', text: 'Select' }) + _combo; clientecolor
        _('_cbo_estado_busquedaavanzadapartida').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].estados);
        __ovariables_busquedaavanzada_partida.lstclientecolor = CSVtoJSON(orpta[0].clientecolor);
    }
}

function validacionesextras_partida() {
    let pasavalidacion = true;
    let fecini = _('txtfecha_inicio_busquedaavanzadapartida').value, fecfin = _('txtfecha_fin_busquedaavanzadapartida').value;
    _('div_grupo_padre_fechas_partida').classList.remove('has-error');
    if (fecini !== '' && fecfin === '') {
        _('div_grupo_padre_fechas_partida').classList.add('has-error');
        pasavalidacion = false;
    }
    else if (fecini === '' && fecfin !== '') {
        _('div_grupo_padre_fechas_partida').classList.add('has-error');
        pasavalidacion = false;
    }

    return pasavalidacion;
}

function _fn_change_filterclientecolor(e) {
    let o = e.target, idcliente = o.value;
    let filtrocolor = __ovariables_busquedaavanzada_partida.lstclientecolor.filter(x => x.idcliente == idcliente);
    _('_cbo_color_busquedaavanzadapartida').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(filtrocolor, 'idclientecolor', 'nombreclientecolor');
}

function req_ini() {
    let parametro = JSON.stringify({ xd: 1 });
    
    //getData_combosIndex_BusquedaAvanzada
    Get('Laboratorio/Partida/getData_combosIndex_BusquedaAvanzada_partida?par=' + parametro, res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
function load() {
    $('#div_group_fechainicio_busquedaavanzada .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    $('#div_group_fechafin_busquedaavanzada .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    let midate = new Date();
    let anio = midate.getFullYear();
    _('_txt_numeroserie_busquedaavanzada').value = 'SP' + anio.toString().substr(2, 2);

    _('_btnBuscar_busquedaavanzada').addEventListener('click', _fn_buscar_busquedaavanzada);
}

function _fn_buscar_busquedaavanzada() {
    let validacion = _required({ id: 'panelEncabezado_busquedaavanzada', clase: '_enty' });
    if (validacion) {
        let pasavalidacion = validacionesextras();
        if (!pasavalidacion) {
            return false;
        }

        let par = _getParameter({ id: 'panelEncabezado_busquedaavanzada', clase: '_enty' });
        par['esfiltroavanzado_sino'] = 'si';
        par['numerosolicitudpartida'] = '';
        //par['nombreperfil'] = __osolicitudpartida.perfil;

        if (_('_txt_numero_buwquedaavanzada').value.trim() !== '') {
            let numerosp = '00000' + _('_txt_numero_buwquedaavanzada').value, strnumero = numerosp.slice(-5);  // -5 obtiene los caracteres de derecha a izquierda los ultimos 5 caracteres
            par['numerosolicitudpartida'] = _('_txt_numeroserie_busquedaavanzada').value + '-' + strnumero
        }
        
        req_load_menu_filteravanzado(par);
    }
}

function validacionesextras() {
    let pasavalidacion = true;
    let fecini = _('txtfecha_inicio_busquedaavanzada').value, fecfin = _('txtfecha_fin_busquedaavanzada').value;
    _('div_grupo_padre_fechas').classList.remove('has-error');
    if (fecini !== '' && fecfin === '') {
        _('div_grupo_padre_fechas').classList.add('has-error');
        pasavalidacion = false;
    }
    else if (fecini === '' && fecfin !== '') {
        _('div_grupo_padre_fechas').classList.add('has-error');
        pasavalidacion = false;
    }

    return pasavalidacion;
}

function res_ini(rpta) {
    let orpta = rpta !== '' ? JSON.parse(rpta) : null;
    if (orpta !== null) {
        _('_cbo_proveedor_busquedaavanzada').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromCSV(orpta[0].proveedor);
        _('_cbo_cliente_busquedaavanzada').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromCSV(orpta[0].cliente);
        _('_cbo_familia_busquedaavanzada').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromCSV(orpta[0].familia);
        _('_cbo_estado_busquedaavanzada').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].estados);
    }
}

function req_ini() {
    let parametro = JSON.stringify({ xd: 1 });
    Get('Laboratorio/SolicitudPartida/getData_combosIndex_BusquedaAvanzada?par=' + parametro, res_ini);
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'panelEncabezado_busquedaavanzada', clase:'_enty' });
    }
)();
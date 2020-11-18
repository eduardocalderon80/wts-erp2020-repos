function load() {
    let par = _('txtpar_editarpartida').value;
    _('hf_idpartida').value = _par(par, 'idpartida')

    _('_btn_save_edit_partida').addEventListener('click', save_editar_partida);
    _('_btnreturn_partida').addEventListener('click', function () {
        recargabandeja_partidaxid();
        _('div_filtro_bandeja_partida').classList.remove('hide');
    });

    // RADIO CONCLUSION
    $('.i-checks._group_conclusion').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    // SUMARY
    $('.i-checks._group_encongimientoestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('.i-checks._group_reviradoestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $('.i-checks._group_aparienciaestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('.i-checks._group_densidadestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $('.i-checks._group_solidezfroteestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('.i-checks._group_solidezlavadoestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('.i-checks._group_resistenciapillingestado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    let divprincipal = _('div_cuerpoprincipal_partida'), arrhildren = [...divprincipal.getElementsByClassName('_enty')];
    arrhildren.forEach(x => {
        let datatype = x.getAttribute('data-type'), id = x.getAttribute('id');
        if (datatype === 'dec') {
            $('#'+id).autoNumeric('init', { mDec:2 });
        }
    });

    _('txt_dtdensidad').addEventListener('keyup', fn_calculardesviacion);
}

function res_ini(respuesta) {
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null;

    if (orpta !== null) {
        let partida = JSON.parse(orpta[0].partida);
        _('cbo_edevaluacionapariencia').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].combo_evaluacionapariencia);
        _('cbo_idtestmetodo').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].combo_testmetodo);
        _('cbo_estadocolor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].combo_estadocolor);

        _('txt_reportetecnico').value = partida[0].reportetecnico;
        _('txt_nombrecliente').value = partida[0].cliente;
        _('txt_nombreproveedor').value = partida[0].proveedor;
        _('txt_partida').value = partida[0].partida;
        _('txt_descripciontela').value = partida[0].tela;
        _('txt_comentariocolor').value = partida[0].comentariocolor;
        _('txt_composicionporcentajetela').value = partida[0].telacomposicion;
        _('txt_nombreclientecolor').value = partida[0].color;
        _('txt_fechasolicitudpartida').value = partida[0].fechasolicitudpartida;
        _('txt_comentariotesting').value = partida[0].comentariotesting;
        _('txt_edencogimientolargo').value = partida[0].edencogimientolargo;
        _('txt_edrevirado').value = partida[0].edrevirado;
        _('txt_edaparienciacambiocolor').value = partida[0].edaparienciacambiocolor;
        _('txt_edencogimientoancho').value = partida[0].edencogimientoancho;
        _('txt_edpilling').value = partida[0].edpilling;
        _('cbo_edevaluacionapariencia').value = partida[0].edevaluacionapariencia;
        _('cbo_idtestmetodo').value = partida[0].idtestmetodo;
        _('txt_dtdensidad').value = partida[0].dtdensidad;
        _('txt_dtdesviacion').value = partida[0].dtdesviacion;
        _('txt_dtanchoacabado').value = partida[0].dtanchoacabado;
        _('txt_sfseco').value = partida[0].sfseco;
        _('txt_sfhumedo').value = partida[0].sfhumedo;
        _('txt_slcambiocolor').value = partida[0].slcambiocolor;
        _('txt_slacetato').value = partida[0].slacetato;
        _('txt_slalgodon').value = partida[0].slalgodon;
        _('txt_slnylon').value = partida[0].slnylon;
        _('txt_slviscosa').value = partida[0].slviscosa;
        _('txt_slpoliester').value = partida[0].slpoliester;
        _('txt_slacrilico').value = partida[0].slacrilico;
        _('txt_sllana').value = partida[0].sllana;
        _('txt_slsilk').value = partida[0].slsilk;
        _('txt_rpresultado').value = partida[0].rpresultado;
        _('txt_rpmin').value = partida[0].rpmin;
        _('cbo_estadocolor').value = partida[0].estadocolor;
        // ESTE DATO ES PARA CALCULAR LA DESVIACION
        _('hf_densidad_gramaje').value = partida[0].gramajeacabado;
        
        cargar_radiobutton_load(partida[0]);

        _('strong_tituloestado_partida').innerText = partida[0].nombre_estado;
        switch (partida[0].estado_partida) {
            case 1:  // APROVADO
                _('h2_tituloestado_partida').classList.add('label-primary');
                break;
            case 2:
                _('h2_tituloestado_partida').classList.add('label-danger');
                break;
            case 3:
                _('h2_tituloestado_partida').classList.add('label-info');
                break;
        }

        //let divconclusion = _('div_conclusion'), arrcheck_coclusion = [...divconclusion.getElementsByClassName('_cls_radio_conclusion')],
        //    estado_partida = partida[0].estado_partida;
        //arrcheck_coclusion.some(x => {
        //    if (x.value == estado_partida) {
        //        x.parentNode.classList.add('checked');
        //        x.checked = true;
        //        return true;
        //    }
        //});
    }
}

function cargar_radiobutton_load(data_partida) {
    let arrchck_encongimientoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_encongimientoestado')],
        arrchck_reviradoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_reviradoestado')],
        arrchck_aparienciaestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_aparienciaestado')],
        arrchck_densidadestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_densidadestado')],
        arrchck_solidezfroteestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_solidezfroteestado')],
        arrchck_solidezlavadoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_solidezlavadoestado')],
        arrchck_resistenciapillingestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_resistenciapillingestado')],
        arrchck_estadopartida = [..._('div_conclusion').getElementsByClassName('_clschk_estadopartida')];

    arrchck_encongimientoestado.some(x => {
        if (x.value == data_partida.encongimientoestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_reviradoestado.some(x => {
        if (x.value == data_partida.reviradoestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_aparienciaestado.some(x => {
        if (x.value == data_partida.aparienciaestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_densidadestado.some(x => {
        if (x.value == data_partida.densidadestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_solidezfroteestado.some(x => {
        if (x.value == data_partida.solidezfroteestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_solidezlavadoestado.some(x => {
        if (x.value == data_partida.solidezlavadoestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_resistenciapillingestado.some(x => {
        if (x.value == data_partida.resistenciapillingestado) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
    arrchck_estadopartida.some(x => {
        if (x.value == data_partida.estado_partida) {
            x.parentNode.classList.add('checked');
            x.checked = true;
            return true;
        }
    });
}

function save_editar_partida() {
    let requeridos = _required({ id: 'div_cuerpoprincipal_partida', clase: '_enty' });
    if (requeridos) {
        let validacion_otros = validacion_antesgrabar_otros();
        if (validacion_otros === false) {
            return false;
        }

        let frmdata = new FormData(), arrdata_partida_grabar = _getParameter({ id: 'div_cuerpoprincipal_partida', clase: '_enty' });
        let arrchck_encongimientoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_encongimientoestado')],
            arrchck_reviradoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_reviradoestado')],
            arrchck_aparienciaestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_aparienciaestado')],
            arrchck_densidadestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_densidadestado')],
            arrchck_solidezfroteestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_solidezfroteestado')],
            arrchck_solidezlavadoestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_solidezlavadoestado')],
            arrchck_resistenciapillingestado = [..._('div_ibox_resumen').getElementsByClassName('_clschk_resistenciapillingestado')],
            arrchck_estadopartida = [..._('div_conclusion').getElementsByClassName('_clschk_estadopartida')];
    
        arrdata_partida_grabar['encongimientoestado'] = arrfilter_radio(arrchck_encongimientoestado);
        arrdata_partida_grabar['reviradoestado'] = arrfilter_radio(arrchck_reviradoestado);
        arrdata_partida_grabar['aparienciaestado'] = arrfilter_radio(arrchck_aparienciaestado);
        arrdata_partida_grabar['densidadestado'] = arrfilter_radio(arrchck_densidadestado);
        arrdata_partida_grabar['solidezfroteestado'] = arrfilter_radio(arrchck_solidezfroteestado);
        arrdata_partida_grabar['solidezlavadoestado'] = arrfilter_radio(arrchck_solidezlavadoestado);
        arrdata_partida_grabar['resistenciapillingestado'] = arrfilter_radio(arrchck_resistenciapillingestado);
        arrdata_partida_grabar['estado'] = arrfilter_radio(arrchck_estadopartida);
    
        frmdata.append('par', JSON.stringify(arrdata_partida_grabar));

        Post('Laboratorio/Partida/Save_Edit_Partida', frmdata, res_saveeditarpartida);
    }
}

function res_saveeditarpartida(respuesta) {
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null;
    
    swal({
        title: "Message",
        text: orpta.mensaje, ///orespuesta.mensaje,
        type: orpta.estado
    }, function (result) {
        if (result) {
            //_group_conclusion = data-bandeja
            let estado_bandeja = '';
            let arrchck_estadopartida = Array.from(_('div_conclusion').getElementsByClassName('_clschk_estadopartida'));
            arrchck_estadopartida.some(x => {
                if (x.checked) {
                    estado_bandeja = x.getAttribute('data-bandeja');
                    return true;
                }
            });
            
            __opartida.parametro.estado = estado_bandeja;
            recargabandeja_partidaxid();
        }
    });

    //_swal(orpta)
}

function arrfilter_radio(_arr) {
    return _arr.some(x => x.checked) ? _arr.filter(x=>x.checked)[0].value : "0";
}

function fn_calculardesviacion(e) {
    let desviacion = 0;
    desviacion = ((_('txt_dtdensidad').value - _('hf_densidad_gramaje').value) / (_('hf_densidad_gramaje').value) * 100);
    _('txt_dtdesviacion').value = desviacion.toFixed(2);
}

function validacion_antesgrabar_otros() {
    let estadocolor = _('cbo_estadocolor').value, resumen_estadoinfo_tecnico = true, arr_estadotecnico = Array.from(_('div_ibox_resumen').getElementsByClassName('_group_reviradoestado')),
        estado_conclusion_seleccionado = -1, arr_estadoconclusion = Array.from(_('div_conclusion').getElementsByClassName('_clschk_estadopartida')), mensaje = '', pasavalidacion = true;

    arr_estadotecnico.some(x => {
        if (x.checked) {
            if (x.value == 2 || x.value == 3) {
                resumen_estadoinfo_tecnico = false;
                return true;
            }
        }
    });
    if (estadocolor === '2') {
        resumen_estadoinfo_tecnico = false;
    }

    arr_estadoconclusion.some(x => {
        if (x.checked) {
            if (x.value == 2) {
                estado_conclusion_seleccionado = false;
            } else if (x.value == 1) {
                estado_conclusion_seleccionado = true;
            }
            return true;
        }
    });
    if (resumen_estadoinfo_tecnico === false && estado_conclusion_seleccionado === true) {  // CON EL ESTADOCOLOR RECHAZADO
        mensaje += 'Can not approve if technical data is rejected';
        pasavalidacion = false;
    } else if (resumen_estadoinfo_tecnico === true && estado_conclusion_seleccionado === false) {  // CON EL ESTADOCOLOR APROBADO
        mensaje += 'Can not refuse if there is technical data approved';
        pasavalidacion = false;
    }

    _('grupo_comentariocolor').classList.remove('has-error');
    if (estadocolor === '2') {
        if (_('txt_comentariocolor').value === '') {
            _('grupo_comentariocolor').classList.add('has-error');
            pasavalidacion = false;
        }
    }

    if (mensaje !== '') {
        _swal({ estado: 'error', mensaje: mensaje });
    }

    return pasavalidacion;
}

function req_ini() {
    let par = _('txtpar_editarpartida').value, idpartida = _par(par, 'idpartida');
    Get('Laboratorio/Partida/getData_editar_partida_load?par=' + idpartida, res_ini);
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'div_cuerpoprincipal_partida', clase: '_enty' });
    }
)();
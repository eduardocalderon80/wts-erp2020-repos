var ovariables_newhilado = {
    lstsistematitulacion: [],
    lsttitulohilado: [],
    lstformahilado: [],
    lstmateriaprima: [],
    lstestado: [],
    lstcolor: []
}

function load() {
    _('_cbo_sistema_newhilado').addEventListener('change', fn_change_sistema_new_hilado);
    _('_btn_add_item_materiaprima_newhilado').addEventListener('click', fn_addmateriaprima_newhilado);
    _('_btnSave_newhilado').addEventListener('click', save_new_hilado);
}

function fn_change_sistema_new_hilado(e) {
    let idsistematitulacion = e.currentTarget.value;
    llenar_combotitulo_newhilado(idsistematitulacion);
}

function llenar_combotitulo_newhilado(idsistematitulacion) {
    let listatitulos = ovariables_newhilado.lsttitulohilado.filter(x => x.idsistematitulacion == idsistematitulacion);
    _('_cbo_titulo_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listatitulos, 'idtitulo', 'nombretitulo');
}

function fn_addmateriaprima_newhilado() {
    let html = '';
    html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_materiaprima_newhilado'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>
                <td>
                    <select class='_cls_cbo_materiaprima_newhilado form-control'></select>
                </td>
                <td>
                    <input type='text' class ='_cls_porcentaje_newhilado form-control' onkeypress='return DigitimosDecimales(event, this)' />
                </td>
                <td>
                    <select class ='_cls_cbo_estado_newhilado form-control'></select>
                </td>
                <td>
                    <select class ='_cls_cbo_color_newhilado form-control'></select>
                </td>
        </tr>`;
    _('tbody_newhilado').insertAdjacentHTML('beforeend', html);
    let ultimafila = _('tbody_newhilado').rows.length;
    handler_tbl_materiaprima_newhilado_alagregaritem(ultimafila - 1);
    llenarcombos_al_agregaritem_newhilado(ultimafila - 1);
}

function llenarcombos_al_agregaritem_newhilado(indexfila) {
    let fila = _('tbody_newhilado').rows[indexfila];
    let cbomateriaprima = fila.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0];
    cbomateriaprima.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_newhilado.lstmateriaprima, 'idmateriaprima', 'nombremateriaprima');

    let cboestado = fila.getElementsByClassName('_cls_cbo_estado_newhilado')[0];
    cboestado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_newhilado.lstestado, 'idestado', 'nombreestado');

    let cbocolor = fila.getElementsByClassName('_cls_cbo_color_newhilado')[0];
    cbocolor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_newhilado.lstcolor, 'idcolor', 'nombrecolor');
}

function save_new_hilado() {
    let req = _required({ id: 'panelEncabezado_newhilado', clase: '_enty' }), indextituloseleccionado = _('_cbo_titulo_newhilado').selectedIndex, titulo = _('_cbo_titulo_newhilado').options[indextituloseleccionado].text;
    if (req) {
        let validacion = validarantesgrabar_newhilado();
        if (validacion === false) {
            return false;
        }

        let datahilado = _getParameter({ id: 'panelEncabezado_newhilado', clase:'_enty' });
        datahilado['CodigoHilado'] = '';
        
        let contenido = generarcontenidohilado();
        datahilado['NombreHilado'] = titulo + '  ' + contenido.contenido_sin_coma;
        datahilado['Composicion'] = titulo + '  ' + contenido.contenido_sin_coma;
        datahilado['contenido'] = contenido.contenido_con_coma;
        let arrmateriaprima = getarr_materiaprima_newhilado();
        
        let idsistema = _('_cbo_sistema_newhilado').value == '' ? 0 : _('_cbo_sistema_newhilado').value, 
            idtitulo = _('_cbo_titulo_newhilado').value == '' ? 0 : _('_cbo_titulo_newhilado').value, 
            idformahilado = _('_cbo_formahilado_newhilado').value == '' ? 0 : _('_cbo_formahilado_newhilado').value;
        
        let par_validacion = JSON.stringify({ sistema_titulo_formahilado: idsistema + '¬' + idtitulo + '¬' + idformahilado, contenido: contenido.contenido_sin_coma.replace(/%/g, 'xd'), tipohilo_color: contenido.estado_color });

        Get('Laboratorio/SolicitudPartida/validarsiexistehilado?par=' + par_validacion, function (rpta) {
            let orpta_validacion = rpta != '' ? rpta : null;

            if (orpta_validacion == 0) {
                let frmData = new FormData();
                frmData.append('par', JSON.stringify(datahilado));
                frmData.append('pardetail', JSON.stringify(arrmateriaprima));
                Post('Laboratorio/SolicitudPartida/save_new_hilado', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? CSVtoJSON(orpta.data) : null;
                    if (odata !== null) {
                        // ACTUALIZAR DATASET HILADO 
                        ovariable_partida.lsthilado = odata;
                        _mensaje(orpta);
                        $('#modal__NewHilado').modal('hide');
                    }
                });
            } else {
                _swal({ mensaje: 'The fabric already exists', estado: 'Error' });
                return false;
            }
        });

    }
}

function getarr_materiaprima_newhilado() {
    let tblbody = _('tbody_newhilado'), arrfilas = [...tblbody.rows], arrpodata = [];
    arrfilas.forEach(x => {
        let porcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0].value, indextituloseleccionado = _('_cbo_titulo_newhilado').selectedIndex, titulo = _('_cbo_titulo_newhilado').options[indextituloseleccionado].text,
            cbomateriaprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0], cbotipohilado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0], cbocolor = x.getElementsByClassName('_cls_cbo_color_newhilado')[0];
        let obj = {
            idmateriaprima: cbomateriaprima.value,
            porcentajecomposicion: porcentaje,
            idtipohilo: cbotipohilado.value,
            idcolortextilhilado: cbocolor.value
        }
        arrpodata.push(obj);
    });

    return arrpodata;
}

function generarcontenidohilado() {
    let tblbody = _('tbody_newhilado'), arrfilas = [...tblbody.rows], arrpodata = [], objretorno = {};
    arrfilas.forEach(x => {
        let porcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0].value, 
            cbomateriaprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0], 
            indexmateriaprimaseleccionado = cbomateriaprima.selectedIndex, 
            materiaprima = cbomateriaprima.options[indexmateriaprimaseleccionado].text, 
            cboestado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0],
            cbocolor = x.getElementsByClassName('_cls_cbo_color_newhilado')[0];

        let idestado = cboestado.value == '' ? 0 : cboestado.value, idcolor = cbocolor.value == '' ? 0 : cbocolor.value;

        let obj = {
            porcentaje: porcentaje,
            materiaprima: materiaprima,
            idestado: idestado,
            idcolor: idcolor
        }
        arrpodata.push(obj);
    });

    let arrordenado = arrpodata.sort((x, y) => { return y.porcentaje - x.porcentaje });
    let retorno = arrordenado.map(x=>`${x.porcentaje.toString()}%${x.materiaprima}  `).join('');
    let retorno2 = arrordenado.map(x=>`${x.porcentaje.toString()}%${x.materiaprima},`).join('');
    let estado_color = arrordenado.map(x => `${x.idestado}${x.idcolor}¬`).join('');
    objretorno.contenido_sin_coma = retorno;
    objretorno.contenido_con_coma = retorno2.substr(0, retorno2.length - 1);
    objretorno.estado_color = estado_color.substr(0, estado_color.length - 1);

    return objretorno;
}

function validarantesgrabar_newhilado() {
    let tblbody = _('tbody_newhilado'), mensaje = '', pasalavalidacion = true, tienemateriaprima = true, totalfilasmateriaprima = tblbody.rows.length, totalporcentaje = 0;

    if (totalfilasmateriaprima <= 0) {
        pasalavalidacion = false;
        tienemateriaprima = false;
        mensaje += '- Missing add raw material \n';
    }

    if (tienemateriaprima) {
        let arrfilas = [...tblbody.rows];
        arrfilas.forEach(x => {
            let cbomateriapprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0];
            if (cbomateriapprima.value == '') {
                mensaje += '- Missing the raw material \n';
                pasalavalidacion = false;
            }

            let cboestado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0];
            if (cboestado.value == '') {
                mensaje += '- Need to select the type of yarn \n';
                pasalavalidacion = false;
            }

            let txtporcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0];
            totalporcentaje += parseFloat(txtporcentaje.value)
        });

        totalporcentaje = parseFloat(totalporcentaje).toFixed(2)

        if (totalporcentaje != 100) {
            mensaje += '- The raw material must be 100%. \n';
            pasalavalidacion = false;
        }
    }

    if (pasalavalidacion == false) {
        _swal({ mensaje: mensaje, estado: 'error' });
    }

    return pasalavalidacion;
}

function handler_tbl_materiaprima_newhilado_alagregaritem(indexfila) {
    let tblbody = _('tbody_newhilado'), fila = tblbody.rows[indexfila];
    let btndelete = fila.getElementsByClassName('_cls_delete_materiaprima_newhilado')[0];
    btndelete.addEventListener('click', _fn_deletemateriaprima_newhilado);
}

function _fn_deletemateriaprima_newhilado(e) {
    let o = e.currentTarget, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }
    if (fila !== null) {
        fila.parentNode.removeChild(fila);
    }
}

function res_ini(rpta) {
    let orpta = rpta != '' ? JSON.parse(rpta) : null, html = '';

    if (orpta != null) {
        ovariables_newhilado.lstsistematitulacion = CSVtoJSON(orpta[0].sistematitulacion);
        ovariables_newhilado.lsttitulohilado = CSVtoJSON(orpta[0].titulohilado);
        ovariables_newhilado.lstformahilado = CSVtoJSON(orpta[0].formahilado);
        ovariables_newhilado.lstmateriaprima = CSVtoJSON(orpta[0].materiaprima);
        ovariables_newhilado.lstestado = CSVtoJSON(orpta[0].estado);
        ovariables_newhilado.lstcolor = CSVtoJSON(orpta[0].colorMateriaPrima);
        
        _('_cbo_sistema_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_newhilado.lstsistematitulacion, 'idsistematitulacion', 'nombresistematitulacion');
        _('_cbo_formahilado_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_newhilado.lstformahilado, 'idformahilado', 'nombreformahilado');

    }
}

function req_ini() {
    //let parametro = '1';
    Get('Laboratorio/SolicitudPartida/getData_newhilado', res_ini)
}

(
    function ini() {
        req_ini();
        load();
        _rules({ id: 'panelEncabezado_newhilado', clase: '_enty' });
    }
)();
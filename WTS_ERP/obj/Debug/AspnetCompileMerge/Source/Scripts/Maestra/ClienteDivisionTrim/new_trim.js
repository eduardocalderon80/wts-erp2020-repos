var ovariables_trim_new = {
    data_clientedivision: '',
    data_cliente: '',
    data_lstestados: '',
    accion: '',
    idgrupocomercial: '',
    filtro_index: '',
    idtrim_edit_pamarcar_tablaindex: ''
}

function load() {
    let par = _('txtpar_index_trims_new').value;
    ovariables_trim_new.accion = _par(par, 'accion');
    ovariables_trim_new.idgrupocomercial = _par(par, 'idgrupocomercial');
    ovariables_trim_new.filtro_index = _par(par, 'filtro_index');

    _('cbo_cliente_new_trim').addEventListener('change', fn_change_cliente_new_trim);
    _('_btn_save_new_trims').addEventListener('click', save_new_trims);
    _('btn_add_color_trim').addEventListener('click', addcolor_newtrim);
    _('btnretornar_newtrim').addEventListener('click', retornar_index_trim);
}

function fn_change_cliente_new_trim(event) {
    let id = event.currentTarget.value;
    let arr = ovariables_trim_new.data_clientedivision.filter(x => x.idcliente == id);

    _('cbo_clientedivision_new_trim').innerHTML = '';
    _('cbo_clientedivision_new_trim').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromJSON(arr, 'idclientedivision', 'nombredivision');
}

function save_new_trims() {
    let req = _required({ clase: '_enty', id: 'div_cuerpoprincipal_newtrim' }), form = new FormData();

    if (req) {
        let par = _getParameter({ id: 'div_cuerpoprincipal_newtrim', clase: '_enty' });
        par['colores'] = getParameter_color();

        form.append('par', JSON.stringify(par));

        switch (ovariables_trim_new.accion) {
            case 'new':
                save_new_trim(form);
                break;
            case 'edit':
                save_edit_trim();
                break;
            case 'copy':
                save_new_trim(form);
                break;
        }

    }
}

function save_new_trim(form) {
    let err = function (__err) { console.log('err', __err) };
    _Post('Maestra/ClienteDivisionTrim/Save_new_trim', form, true)
            .then((odata_rpta) => {
                let rpta = JSON.parse(odata_rpta);
                swal({
                    title: 'Message',
                    text: rpta.mensaje,
                    type: rpta.estado
                }, function (result) {
                    if (result) {
                        /// hacer algo
                        if (rpta.id > 0) {
                            ovariables_trim_new.idtrim_edit_pamarcar_tablaindex = rpta.id;
                            _ruteo_masgeneral('Maestra/ClienteDivisionTrim/Index')
                                .then((rpta) => {
                                    if (rpta) {
                                        // pasar parametros a la vista devuelta
                                    }
                                }).catch(function (e) {
                                    console.log(e);
                                });
                        }
                    }
                });
            }, (p) => { err(p); });
}

function save_edit_trim() {
    let par_ventana = _('txtpar_index_trims_new').value, idtrim = _par(par_ventana, 'idtrim');
    _promise()
        .then(inicio => {
            idtrim = idtrim;
            let parametro = { idtrim: idtrim, idestilo: 0 };
            return _Get('Maestra/ClienteDivisionTrim/ValidarTrimSiAfecta_OtrosEstilos?par=' + JSON.stringify(parametro));
        }).then(odatarpta => {
            let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null, pasavalidacion = true;
            if (rpta !== null) {
                if (rpta[0].afectaaotrosestilos === 'si') {
                    pasavalidacion = false;
                    // MOSATRAR MODAL PARA SELECCIONAR A LOS ESTILOS AFECTADOS
                    _modalBody({
                        url: 'Maestra/ClienteDivisionTrim/_EstilosAfectadosCambioTrim',
                        ventana: '_EstilosAfectadosCambioTrim',
                        titulo: 'Affected styles',
                        parametro: `idtrim:${idtrim}`,
                        ancho: '800',
                        alto: ''
                    });
                }
                return pasavalidacion;
            }
        }).then(validacion => {
            if (!validacion) {
                return false;
            }

            save_edit_trim_aceptados([]);
        });
}

function save_edit_trim_aceptados(lstidestilos_afectados_seleccionados, ejecutadodesdemodal_estilosafectados) {
    let par = _getParameter({ id: 'div_cuerpoprincipal_newtrim', clase: '_enty' }), form = new FormData();
    par['colores'] = getParameter_color();
    // AQUI VALIDAR SI AFECTA A OTROS ESTILOS 
    let par_ventana = _('txtpar_index_trims_new').value, idtrim = _par(par_ventana, 'idtrim');

    form.append('par', JSON.stringify(par));
    form.append('pardetail', JSON.stringify(lstidestilos_afectados_seleccionados));

    let err = function (__err) { console.log('err', __err) };
    _Post('Maestra/ClienteDivisionTrim/Save_edit_trim', form, true)
        .then((odata_rpta) => {
            let rpta = JSON.parse(odata_rpta);
            swal({
                title: 'Message',
                text: rpta.mensaje,
                type: rpta.estado
            }, function (result) {
                if (result) {
                    /// hacer algo
                    if (rpta.id > 0) {
                        if (ejecutadodesdemodal_estilosafectados !== undefined) {
                            if (ejecutadodesdemodal_estilosafectados === 'si') {
                                $('#modal__EstilosAfectadosCambioTrim').modal('hide');
                            }
                        }
                        // EDU: OBTENER FILTRO DESDE EL INDEX Y LUEGO DEVOLVERLO PARA EL FILTRO
                        ////let par_newtrim = _('txtpar_index_trims_new').value;
                        ovariables_trim_new.idtrim_edit_pamarcar_tablaindex = rpta.id;
                        _ruteo_masgeneral('Maestra/ClienteDivisionTrim/Index')
                            .then((rpta) => {
                                // nada

                            }).catch(function (e) {
                                console.log(e);
                            });
                    }
                }
            });
        }, (p) => { err(p); });
}

function getParameter_color() {
    let tbl = _('tbody_trim_color'), arr_row = Array.from(tbl.rows), lstcolor = [];

    arr_row.forEach((f, i) => {
        let datapar = f.getAttribute('data-par'), idtrimcolor = _par(datapar, 'idtrimcolor');
        let color = {
            idtrimcolor: idtrimcolor === '' ? 0 : idtrimcolor,
            color: f.cells[1].children[0].value,
            status: f.cells[2].children[0].value,
            comentario: f.cells[3].children[0].value
        }
        lstcolor.push(color);
    });

    return lstcolor;
}

function addcolor_newtrim() {
    let tbl = _('tbody_trim_color'), html = '';
    html = `
            <tr data-par='idtrimcolor:0'>
                <td class='text-center'>
                    <button type='button' class='btn btn-xs btn-outline btn-danger cls_btn_delete_newtrim'>
                        <span class ='fa fa-trash-o'></span>
                    </button>
                </td>
                <td>
                    <input class='form-control cls_color_tbl_trim' type='text' value='' />
                </td>
                <td>
                    <select class='form-control cls_estado_tbl_trim'></select>
                </td>
                <td>
                    <input class='form-control cls_comentario_tbl_trim' />
                </td>
            </tr>
        `;

    tbl.insertAdjacentHTML('beforeend', html);
    let fila = tbl.rows.length - 1;
    cargarcombos_tblcolor_cuandoesnew(fila);
    handler_tblcolor_cuandoesnew(fila);
}

function cargarcombos_tblcolor_cuandoesnew(fila) {
    let tbl = _('tbody_trim_color'), estados = ovariables_trim_new.data_lstestados;

    tbl.rows[fila].getElementsByClassName('cls_estado_tbl_trim')[0].innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(estados, 'valorestado', 'nombreestado');
}

function handler_tblcolor_cuandoesnew(fila) {
    let tbl = _('tbody_trim_color');

    tbl.rows[fila].getElementsByClassName('cls_btn_delete_newtrim')[0].addEventListener('click', delete_trim_color);


}

function delete_trim_color(e) {
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

function res_ini(odata) {
    let par = _('txtpar_index_trims_new').value, accion = _par(par, 'accion');
    if (odata !== null) {
        let estados = JSON.parse(odata[0].estados),
            unidadmedidas = JSON.parse(odata[0].unidadmedidas),
            monedas = JSON.parse(odata[0].monedas);

        ovariables_trim_new.data_lstestados = estados;
        ovariables_trim_new.data_clientedivision = odata[0].clientedivision !== '' ? CSVtoJSON(odata[0].clientedivision) : null;
        ovariables_trim_new.data_cliente = odata[0].clientes !== '' ? CSVtoJSON(odata[0].clientes) : null;

        _('cbo_Status_Trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(estados, 'valorestado', 'nombreestado');
        _('cbo_unidadmedida_trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(unidadmedidas, 'idunidadmedida', 'simbolo');
        _('cbo_moneda_trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(monedas, 'idmoneda', 'codigo');
        _('cbo_cliente_new_trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_trim_new.data_cliente, 'idcliente', 'nombrecliente');

        switch (accion) {
            case 'new':

                break;
            case 'edit':
                load_edit(odata);
                break;
            case 'copy':
                load_edit(odata);
                break;
        }
    }
}

function load_edit(odata) {
    let otrim = JSON.parse(odata[0].trim);
    let lst_division = ovariables_trim_new.data_clientedivision.filter(x => x.idcliente == otrim[0].idcliente);
    if (ovariables_trim_new.accion == 'edit') {
        _('hf_idtrim').value = otrim[0].idtrim;
    } else {
        _('hf_idtrim').value = 0;
    }
    
    _('cbo_clientedivision_new_trim').innerHTML = _comboItem({ value: ' ', text: 'Select' }) + _comboFromJSON(lst_division, 'idclientedivision', 'nombredivision');
    _('cbo_cliente_new_trim').value = otrim[0].idcliente;
    _('cbo_clientedivision_new_trim').value = otrim[0].idclientedivision;
    _('txta_descripcion_trim').value = otrim[0].descripcion;
    _('txta_codigo_trim').value = otrim[0].codigo;
    _('txt_placement_trim').value = otrim[0].placement;
    _('txt_proveedor_trim').value = otrim[0].proveedor;
    _('cbo_tipoproveedor').value = otrim[0].tipoproveedor;
    _('cbo_Status_Trim').value = otrim[0].status;
    _('txt_incoterm_trim').value = otrim[0].incoterm;
    _('txt_comentario_trim').value = otrim[0].comment;
    _('txt_costo_trim').value = otrim[0].costo;
    _('cbo_unidadmedida_trim').value = otrim[0].costouom;
    _('cbo_moneda_trim').value = otrim[0].costomoneda;

    load_edit_tbl_color_trim(odata);
}

function load_edit_tbl_color_trim(odata) {
    let html = '';
    if (odata !== null) {
        let otrim = odata[0].trimcolor !== '' ? CSVtoJSON(odata[0].trimcolor) : null;
        if (otrim !== null) {
            otrim.forEach(x => {
                html += `
                        <tr data-par='idtrimcolor:${x.idtrimcolor}'>
                            <td class='text-center' style='vertical-align: middle;'>
                                <button type='button' class='btn btn-xs btn-outline btn-danger cls_btn_delete_newtrim'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_color_tbl_trim' value='${x.color}' />
                            </td>
                            <td data-idstatus='${x.status}'>
                                <select class ='form-control cls_estado_tbl_trim' value=''></select>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_comentario_tbl_trim' value='${x.comentario}' />
                            </td>
                        </tr>
                    `;
            });

            _('tbody_trim_color').innerHTML = html;
            cargarcombos_tblcolor_load();
            handler_tblcolor_load();
        }
    }
}

function cargarcombos_tblcolor_load() {
    let tbl = _('tbody_trim_color'), arr_rows = Array.from(tbl.rows);

    arr_rows.forEach((f, i) => {
        let idstatus = f.cells[2].getAttribute('data-idstatus');
        f.cells[2].children[0].innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_trim_new.data_lstestados, 'valorestado', 'nombreestado');
        f.cells[2].children[0].value = idstatus;
    });
}

function handler_tblcolor_load() {
    let tbl = _('tbody_trim_color'), arr_rows = Array.from(tbl.getElementsByClassName('cls_btn_delete_newtrim'));
    arr_rows.forEach(x => {
        x.addEventListener('click', delete_trim_color);
    });
}

function retornar_index_trim() {
    _ruteo_masgeneral('Maestra/ClienteDivisionTrim/Index')
        .then((rpta) => {
            // nada
        }).catch(function (e) {
            console.log(e);
        });
}

function req_ini() {
    let err = function (__err) { console.log("err", __err) };
    let par = _('txtpar_index_trims_new').value, idtrim = '', parametro = '';
    switch (ovariables_trim_new.accion) {
        case 'new':
            _Get('Maestra/ClienteDivisionTrim/GetData_NewTrim_Ini?par=' + ovariables_trim_new.idgrupocomercial)
                .then((odata_rpta) => {
                    let odata = odata_rpta !== '' ? JSON.parse(odata_rpta) : null;
                    res_ini(odata);
                }, (p) => { err(p); });
            break;
        case 'edit':
            idtrim = _par(par, 'idtrim');
            parametro = JSON.stringify({ idgrupocomercial: ovariables_trim_new.idgrupocomercial, idtrim: idtrim });
            _Get(`Maestra/ClienteDivisionTrim/GetData_EditTrim_Ini?par=${parametro}`)
                .then((odata_rpta) => {
                    let odata = odata_rpta !== '' ? JSON.parse(odata_rpta) : null;
                    res_ini(odata);
                }, (p) => { err(p); });
            break;
        case 'copy':
            idtrim = _par(par, 'idtrim');
            parametro = JSON.stringify({ idgrupocomercial: ovariables_trim_new.idgrupocomercial, idtrim: idtrim });
            _Get(`Maestra/ClienteDivisionTrim/GetData_EditTrim_Ini?par=${parametro}`)
                .then((odata_rpta) => {
                    let odata = odata_rpta !== '' ? JSON.parse(odata_rpta) : null;
                    res_ini(odata);
                }, (p) => { err(p); });
            break;
        default:
            break;
    }


}

(
    function init() {
        load();
        req_ini();
        _rules({ id: 'div_cuerpoprincipal_newtrim', clase: '_enty' });
    }
)();
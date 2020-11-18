var appInventarioMotivo_new = (
    function (d, idpadre) {
        var ovariables = {
            lstmotivo: []
        }

        function load() {
            _('hf_accion_new_motivo').value = 'new';
            _('_filtro_tipo').addEventListener('change', fn_change_filtro_movimiento, false);
            _('_btnSave_new_motivo_movimiento').addEventListener('click', fn_save_motivo, false);
        }

        function fn_save_motivo() {
            let parametro = _getParameter({ clase: '_enty', id: 'panelEncabezado_new_motivo_movimiento' }),
                req_enty = _required({ clase: '_enty', id: 'panelEncabezado_new_motivo_movimiento' }),
                frm = new FormData(), url = 'DesarrolloTextil/InventarioColgador/SaveData_Motivo';

            if (req_enty) {
                _('_filtro_tipo').value = _('_cbo_movimiento_new_motivo').value;
                let pasa_validacion = validar_antes_grabar();
                if (!pasa_validacion) {
                    return false;
                }
                frm.append('par', JSON.stringify(parametro));

                _Post(url, frm)
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        if (odata.id > 0) {
                            despues_eliminar_motivo(odata);
                            _swal({
                                mensaje: odata.mensaje,
                                estado: 'success'
                            });
                        } else {
                            _swal({
                                mensaje: odata.mensaje,
                                estado: 'success'
                            });
                        }
                    });
            }
        }

        function validar_antes_grabar() {
            let accion = _('hf_accion_new_motivo').value, idtipomovimiento = _('_cbo_movimiento_new_motivo').value, motivo = _('txtmotivo_new_motivo').value.trim(),
                pasa_validacion = true;
            let lstfilter = ovariables.lstmotivo.filter(x => { return (x.idtipomovimiento === idtipomovimiento && x.motivo.toLowerCase() === motivo.toLowerCase()) });
            if (lstfilter.length > 0) {
                pasa_validacion = false;
                _swal({ mensaje: 'Ya existe el motivo', estado: 'error' });
            }

            return pasa_validacion;
        }

        function fn_change_filtro_movimiento(e) {
            pintar_tabla();
        }

        function res_ini(odata) {
            if (odata) {
                let arr_tipomovimientos = odata[0].lsttipomovimientos !== '' ? CSVtoJSON(odata[0].lsttipomovimientos) : [],
                    arr_lstmotivos = odata[0].lstmotivo !== '' ? CSVtoJSON(odata[0].lstmotivo) : [];

                _('_cbo_movimiento_new_motivo').innerHTML = _comboFromJSON(arr_tipomovimientos, 'idtipomovimiento', 'tipomovimiento');
                _('_filtro_tipo').innerHTML = _comboFromJSON(arr_tipomovimientos, 'idtipomovimiento', 'tipomovimiento');
                ovariables.lstmotivo = arr_lstmotivos;
                pintar_tabla();
            }
        }

        function pintar_tabla() {
            let tbody = _('_tbody_new_motivo_movimiento'), idfiltro_tipo_movimiento = _('_filtro_tipo').value,
                html = '', idtipomovimiento_select = _('_filtro_tipo').value,
                arr_motivos_filtrado = ovariables.lstmotivo.filter(x => x.idtipomovimiento === idtipomovimiento_select);

            arr_motivos_filtrado.forEach(x => {
                html += `
                    <tr data-par='idtipomotivo:${x.idtipomotivo},idtipomovimiento:${x.idtipomovimiento},motivo:${x.motivo}'>
                        <td class="text-center">
                            <button class="btn btn-xs btn-info _cls_btn_editar" title="Editar Motivo">
                                <span class="fa fa-edit" style="cursor:pointer;"></span>
                            </button>
                            <button class="btn btn-xs btn-danger _cls_btn_eliminar" title="Eliminar Motivo">
                                <span class="fa fa-trash" style="cursor:pointer;"></span>
                            </button>
                        </td>
                        <td>${x.tipomovimiento}</td>
                        <td>${x.motivo}</td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
            handler_tbl_ini();
        }

        function handler_tbl_ini() {
            let arr_btn_editar = Array.from(_('_tbody_new_motivo_movimiento').getElementsByClassName('_cls_btn_editar')),
                arr_btn_eliminar = Array.from(_('_tbody_new_motivo_movimiento').getElementsByClassName('_cls_btn_eliminar'));

            arr_btn_editar.forEach(x => x.addEventListener('click', e => { fn_editar_motivo(e); }), false);
            arr_btn_eliminar.forEach(x => x.addEventListener('click', e => { fn_eliminar_motivo(e) }), false);
        }

        function fn_editar_motivo(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                idtipomotivo = _par(datapar, 'idtipomotivo'), idtipomovimiento = _par(datapar, 'idtipomovimiento'),
                motivo = _par(datapar, 'motivo');

            _('hf_accion_new_motivo').value = 'edit';
            _('_cbo_movimiento_new_motivo').value = idtipomovimiento;
            _('txtmotivo_new_motivo').value = motivo;
            _('hf_idtipomotivo').value = idtipomotivo;
        }

        function fn_eliminar_motivo(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                idtipomotivo = _par(datapar, 'idtipomotivo');

            swal({
                title: "Eliminar Datos",
                text: "¿Estas seguro/a que deseas eliminar el motivo?",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No"
            }, function (rpta) {
                if (rpta) {
                    async_eliminar_motivo(idtipomotivo);   
                }
                return;
            });
            
        }

        function async_eliminar_motivo(idtipomotivo) {
            let parametro = { idmotivo: idtipomotivo }, frm = new FormData(), url = 'DesarrolloTextil/InventarioColgador/DeleteData_Motivo';
            frm.append('par', JSON.stringify(parametro));
            _Post(url, frm)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata.id > 0) {
                        despues_eliminar_motivo(odata);
                        _swal({
                            mensaje: odata.mensaje,
                            estado: 'success'
                        });
                    } else {
                        _swal({
                            mensaje: odata.mensaje,
                            estado: 'error'
                        });
                    }
                });
        }

        function despues_eliminar_motivo(odata) {
            if (odata) {
                let data_motivo = odata.data !== '' ? CSVtoJSON(odata.data) : null;
                if (data_motivo) {
                    ovariables.lstmotivo = data_motivo
                    pintar_tabla();
                    fn_LimpiarCampos();
                    appNewInventarioColgador.ovariables.lsttipomotivos = [];
                    appNewInventarioColgador.ovariables.lsttipomotivos = data_motivo;
                    let idtipomovimiento = _('_cbo_movimiento').value, lstmotivos_filter_cbo = appNewInventarioColgador.ovariables.lsttipomotivos.filter(x => parseInt(x.idtipomovimiento) === parseInt(idtipomovimiento));
                    _('_cbo_motivo').innerHTML = '';
                    _('_cbo_motivo').innerHTML = _comboFromJSON(lstmotivos_filter_cbo, 'idtipomotivo', 'motivo');
                }
            }
        }

        function fn_LimpiarCampos() {
            _('_cbo_movimiento_new_motivo').value = '';
            _('txtmotivo_new_motivo').value = "";
            _('hf_idtipomotivo').value = '0';
            _('hf_accion_new_motivo').value = 'new';
        }

        function req_ini() {
            let url = 'DesarrolloTextil/InventarioColgador/GetData_Motivo';
            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    res_ini(odata);
                });
        }

        return {
            load: load,
            req_ini: req_ini,
        }
    }
)(document, 'panelEncabezado_inventarioMotivo');
(
    function ini() {
        appInventarioMotivo_new.load();
        appInventarioMotivo_new.req_ini();
        _rules({ clase: '_enty', id: 'panelEncabezado_new_motivo_movimiento'});
    }
)();
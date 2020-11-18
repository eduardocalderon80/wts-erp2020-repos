var appSeleccionarOP_FacturacionSample = (
    function (d, idpadre) {
        var ovariables = {
            idprograma: '',
            idcliente: '',
            idproveedor: '',
            arr_idordenpedido_from_facturacliente: []
        }

        function load() {
            let parametro = _('txtpar_SeleccionarOrdenPedido').value;
            ovariables.idprograma = _par(parametro, 'idprograma');
            ovariables.idcliente = _par(parametro, 'idcliente');
            ovariables.idproveedor = _par(parametro, 'idproveedor');
            let cadena_idordenpedido = _par(parametro, 'cadena_idordenpedido');
            ovariables.arr_idordenpedido_from_facturacliente = cadena_idordenpedido !== '' ? cadena_idordenpedido.split('¬') : [];

            _('hf_idprograma_selectop').value = ovariables.idprograma;
            $("#txtfechageneracion_selectop").datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).on('changeDate', function (e) { }).next().on('click', function () {
                $(this).prev().focus();
            });

            _('btn_Save_SelectOP').addEventListener('click', e => { fn_save_edit_ordenpedido(e); }, false);
            _('cbo_op_selectop').addEventListener('change', e => { fn_get_ordenpedido_detalle(e.currentTarget); }, false);
            _('btn_SelectOP_SelectOP').addEventListener('click', fn_seleccionar_ordenpedido, false);
            
        }

        function res_ini(odata) {
            if (odata) {
                let listaproveedores = odata.ProveedorCSV !== '' ? CSVtoJSON(odata.ProveedorCSV) : [];
                let listaOP = odata.ListaOrdenPedidoCSV !== '' ? CSVtoJSON(odata.ListaOrdenPedidoCSV) : [];
                _('cbo_proveedor_selectop').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listaproveedores, 'IdProveedor', 'NombreProveedor');
                _('txt_cliente_selectop').value = odata.NombreCliente;

                _('cbo_proveedor_selectop').value = ovariables.idproveedor;
                let html_cbo_ordenpedido = listaOP.map(x => {
                    return `
                        <option value='${x.IdOrdenPedido}' data-montototal='${x.TotalOrdenPedido}'>${x.Numero_OP_Total}</option>
                    `;
                });

                _('cbo_op_selectop').innerHTML = _comboItem({ value: '', text: 'Select' }) + html_cbo_ordenpedido;
                _('cbo_op_selectop').addEventListener('change', e => { fn_change_ordenpedido(e.currentTarget) }, false);
            }
        }

        function fn_seleccionar_ordenpedido() {
            let idordenpedido = _('cbo_op_selectop').value;
            if (idordenpedido === '') {
                _swal({ mensaje: 'The Purchase Order must be selected', esta: 'error' }, 'Validation');
                return false;
            }

            if (ovariables.arr_idordenpedido_from_facturacliente.length > 0) {
                if (ovariables.arr_idordenpedido_from_facturacliente.filter(x => parseInt(x) === parseInt(idordenpedido)).length > 0) {
                    _swal({ mensaje: 'The order form is already selected', estado: 'error' });
                    return false;
                }
            }

            let obj_ordenpedido = {
                IdOrdenPedido: idordenpedido,
                NumeroOrdenPedido: _('hf_numeroordenpedido_selectop').value,
                FechaCreacionOP: _('hf_fechacreacion_op_selectop').value,
                TotalOrdenPedido: _('txt_total_selectop').value
            }
            appFacturaClienteFacturacionSample.fn_pintar_tbl_ordenpedido_seleccionado_add(obj_ordenpedido);
            $('#modal__SeleccionarOrdenPedido').modal('hide');
        }

        function fn_get_ordenpedido_detalle(o) {
            if (o.value !== '') {
                let idordenpedido = o.value;
                let montototal = o.options[o.selectedIndex].getAttribute('data-montototal');
                let totalfilas = _('tbody_selectop_fsample').rows.length;
                if (totalfilas <= 0) {
                    o.setAttribute('data-idordenpedido-temporal', idordenpedido);
                    fn_getdata_ordenpedido(idordenpedido, montototal);
                } else {
                    swal({
                        html: true,
                        title: 'Are you sure to change the Purchase Order?...!',
                        text: '',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#1c84c6',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        closeOnConfirm: true
                    }, function (result) {
                        if (result) {
                            o.setAttribute('data-idordenpedido-temporal', idordenpedido);
                            fn_getdata_ordenpedido(idordenpedido, montototal);
                        } else {
                            let idordenpedido_anterior = o.getAttribute('data-idordenpedido-temporal');
                            o.value = idordenpedido_anterior;
                        }

                    });
                }
            } else {
                swal({
                    html: true,
                    title: 'Are you sure to change the Purchase Order?...!',
                    text: '',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#1c84c6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: true
                }, function (result) {
                    if (result) {
                        o.setAttribute('data-idordenpedido-temporal', '');
                        _('tbody_selectop_fsample').innerHTML = '';
                        _('txt_total_ff').value = '';
                    } else {
                        let idordenpedido_anterior = o.getAttribute('data-idordenpedido-temporal');
                        o.value = idordenpedido_anterior;
                    }

                });
            }
        }

        function fn_save_edit_ordenpedido() {
            let pasavalidacion = fn_validarantesgrabar();
            if (!pasavalidacion) {
                return false;
            }

            let form = new FormData();
            let ordenPedido = {
                Comentario: _('txta_comentario_selectop').value,
                IdOrdenPedido: _('cbo_op_selectop').value
            }

            form.append('OrdenPedidoJSON', JSON.stringify(ordenPedido));

            _Post('Requerimiento/FacturacionSampleOrdenPedido/SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON', form, true)
                .then((rpta) => {
                    let orpta = JSON.parse(rpta);
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado }, 'Good Job');

                });
        }

        function fn_validarantesgrabar() {
            let txta_comentario = _('txta_comentario_selectop');
            let cbo_ordenpedido = _('cbo_op_selectop');
            let comentario = txta_comentario.value.trim();
            let idordenpedido = cbo_ordenpedido.value;
            let pasavalidacion = true;
            let mensaje = '';

            Array.from(_('panelEncabezado_SeleccionarOrdenPedido').getElementsByClassName('_cls_group_validar'))
                .forEach(x => {
                    x.classList.remove('has-error');
                });

            if (comentario === '') {
                pasavalidacion = false;
                let divgrupo_comentario = _('div_group_txtcomentario');
                divgrupo_comentario.classList.add('has-error');
                mensaje += '- Missing enter comment \n'
            }
            if (idordenpedido === '') {
                pasavalidacion = false;
                let divgrupo_ordenpedido = _('div_group_cboordenpedido');
                divgrupo_ordenpedido.classList.add('has-error');
                mensaje += '- The Purchase Order must be selected \n';
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Validation');
            }

            return pasavalidacion;
        }
        
        function fn_change_ordenpedido(o) {
            if (o.value !== '') {
                let idordenpedido = o.value;
                let montototal = o.options[o.selectedIndex].getAttribute('data-montototal');
                let totalfilas = _('tbody_selectop_fsample').rows.length;
                if (totalfilas <= 0) {
                    o.setAttribute('data-idordenpedido-temporal', idordenpedido);
                    fn_getdata_ordenpedido(idordenpedido, montototal);
                } else {
                    swal({
                        html: true,
                        title: 'Are you sure to change the Purchase Order?...!',
                        text: '',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#1c84c6',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        closeOnConfirm: true
                    }, function (result) {
                        if (result) {
                            o.setAttribute('data-idordenpedido-temporal', idordenpedido);
                            fn_getdata_ordenpedido(idordenpedido, montototal);
                        } else {
                            let idordenpedido_anterior = o.getAttribute('data-idordenpedido-temporal');
                            o.value = idordenpedido_anterior;
                        }

                    });
                }
            } else {
                swal({
                    html: true,
                    title: 'Are you sure to change the Purchase Order?...!',
                    text: '',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#1c84c6',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: true
                }, function (result) {
                    if (result) {
                        o.setAttribute('data-idordenpedido-temporal', '');
                        _('tbody_selectop_fsample').innerHTML = '';
                        _('txt_total_selectop').value = '';
                    } else {
                        let idordenpedido_anterior = o.getAttribute('data-idordenpedido-temporal');
                        o.value = idordenpedido_anterior;
                    }

                });
            }
        }

        function fn_getdata_ordenpedido(idordenpedido, montototal) {
            _Get('Requerimiento/FacturacionSampleOrdenPedido/GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON?IdOrdenPedido=' + idordenpedido)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata) {
                        _('txt_serie_selectop').value = odata.Serie_FacturaFabrica;
                        _('txt_numero_selectop').value = odata.Numero_FacturaFabrica;
                        _('txta_comentario_selectop').value = odata.Comentario;
                        _('txtfechageneracion_selectop').value = odata.FechaCreacionOP;
                        _('hf_numeroordenpedido_selectop').value = odata.NumeroOrdenPedido;
                        _('hf_fechacreacion_op_selectop').value = odata.FechaCreacionOP;

                        let ordenPedidoDetalle = odata.OrdenPedido.OrdenPedidoDetalleCSV !== '' ? CSVtoJSON(odata.OrdenPedido.OrdenPedidoDetalleCSV) : [];
                        fn_pintar_tbl_ordenpedido(ordenPedidoDetalle);

                        _('txt_total_selectop').value = montototal;
                    }
                });
        }

        function fn_pintar_tbl_ordenpedido(odata) {
            let html = odata.map((x, indice) => {
                let cadena_sefactura_contramuestra = x.EsContramuestraFacturableCliente === '1' ? 'checked' : '';
                return `
                        <tr data-par='idordenpedido:${x.IdOrdenPedido},idordenpedidodetalle:${x.IdOrdenPedidoDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle}'>
                            <td>${x.CodigoEstilo}</td>
                            <td>${x.NombreTipoMuestra}</td>
                            <td>${x.Version}</td>
                            <td>${x.NombreClienteColor}</td>
                            <td>${x.NombreClienteTalla}</td>
                            <td>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_cm_esfacturable_${indice}' class='_cls_cm_esfacturable' ${cadena_sefactura_contramuestra} disabled />
                                    <label for='chk_cm_esfacturable_${indice}'></label>
                                </div>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_q_afacturar_selectop' value='${x.CantidadMuestraFacturable}' onkeypress="return DigitosEnteros(event, this)" disabled />
                                <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_factcliente_selectop' value='${x.PrecioMuestra}' onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_qcm_se_factura_selectop' value='${x.CantidadContraMuestraFacturable}' disabled onkeypress="return DigitosEnteros(event, this)" disabled/>
                                <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_cm_factcliente_selectop' value='${x.PrecioContraMuestra}' disabled onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                            </td>
                        </tr>
                `
            }).join('');

            _('tbody_selectop_fsample').innerHTML = html;
            
        }

        function req_ini() {
            //ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            
            _Get('Requerimiento/FacturacionSampleOrdenPedido/GetOrdenPedidoLoadSeleccionarOP_JSON?IdPrograma=' + ovariables.idprograma + '&IdCliente=' + ovariables.idcliente + '&IdProveedor=' + ovariables.idproveedor)
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
)(document, 'panelEncabezado_OrdenPedidoFacturacionSample');
(
    function ini() {
        appSeleccionarOP_FacturacionSample.load();
        appSeleccionarOP_FacturacionSample.req_ini();
    }
)();
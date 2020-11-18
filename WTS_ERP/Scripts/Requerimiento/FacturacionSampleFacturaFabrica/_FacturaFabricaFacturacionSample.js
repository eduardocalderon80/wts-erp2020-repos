var appFacturaFabrica_FacturacionSample = (
    function (d, idpadre) {
        var ovariables = {
            idprograma: '',
            idcliente: '',
            accion: ''
        }

        function load() {
            let parametro = _('txtpar_FacturaFabricaFacturacionSample').value;
            ovariables.idprograma = _par(parametro, 'idprograma');
            ovariables.idcliente = _par(parametro, 'idcliente');
            ovariables.accion = _par(parametro, 'accion');
            _('hf_idfacturafabrica').value = _par(parametro, 'idfacturafabrica');

            _('hf_idprograma_ff').value = ovariables.idprograma;
            $("#txtfechageneracion_ff").datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).on('changeDate', function (e) { }).next().on('click', function () {
                $(this).prev().focus();
            });

            _('btn_SaveFacturaFabrica').addEventListener('click', e => {
                if (ovariables.accion === 'new') {
                    fn_save_new_facturafabrica(e.currentTarget);
                } else {
                    fn_save_edit_facturafabrica(e.currentTarget);
                }
                
            }, false);
            _('cbo_op_ff').addEventListener('change', e => { fn_change_ordenpedido(e.currentTarget) }, false);
            _('btnFacturaFabrica_Cancel').addEventListener('click', fn_cancel, false);
            _rules({ id: 'panelEncabezado_FacturaFabricaFacturacionSample', clase: '_enty' });
        }

        function res_ini(odata) {
            if (odata) {
                let listaproveedores = odata.ProveedorCSV !== '' ? CSVtoJSON(odata.ProveedorCSV) : [];
                let listaOP = odata.ListaOrdenPedidoCSV !== '' ? CSVtoJSON(odata.ListaOrdenPedidoCSV) : [];
                _('cbo_proveedor_ff').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listaproveedores, 'IdProveedor', 'NombreProveedor');
                _('txt_cliente_ff').value = odata.NombreCliente;

                let html_cbo_ordenpedido = listaOP.map(x => {
                    return `
                        <option value='${x.IdOrdenPedido}' data-montototal='${x.TotalOrdenPedido}'>${x.Numero_OP_Total}</option>
                    `;
                });

                _('cbo_op_ff').innerHTML = _comboItem({ value: '', text: 'Select' }) + html_cbo_ordenpedido;
                
            }
        }

        function fn_cancel() {
            swal({
                html: true,
                title: 'Are you sure to cancel?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, function (result) {
                    if (result) {
                        $("#modal__FacturaFabricaFacturacionSample").modal('hide');
                    }
            });
        }

        function res_ini_edit(odata) {
            if (odata) {
                let listaproveedores = odata.ProveedorCSV !== '' ? CSVtoJSON(odata.ProveedorCSV) : [];
                let listaOP = odata.ListaOrdenPedidoCSV !== '' ? CSVtoJSON(odata.ListaOrdenPedidoCSV) : [];
                let arr_facturafabricadetalle = odata.FacturaFabricaDetalleCSV !== '' ? CSVtoJSON(odata.FacturaFabricaDetalleCSV) : [];
                _('cbo_proveedor_ff').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listaproveedores, 'IdProveedor', 'NombreProveedor');
                _('cbo_proveedor_ff').value = odata.IdProveedor;
                _('txt_cliente_ff').value = odata.NombreCliente;
                _('txt_serie_ff').value = odata.Serie_FacturaFabrica;
                _('txt_numero_ff').value = odata.Numero_FacturaFabrica;
                _('txtfechageneracion_ff').value = odata.FechaGeneracion;
                _('txta_comentario_ff').value = odata.Observacion;
                _('txt_total_ff').value = odata.TotalFacturaFabrica;

                let html_cbo_ordenpedido = listaOP.map(x => {
                    return `
                        <option value='${x.IdOrdenPedido}' data-montototal='${x.TotalOrdenPedido}'>${x.Numero_OP_Total}</option>
                    `;
                });

                _('cbo_op_ff').innerHTML = _comboItem({ value: '', text: 'Select' }) + html_cbo_ordenpedido;
                _('cbo_op_ff').value = odata.IdOrdenPedido;
                fn_pintar_tbl_ordenpedido_ini_edit(arr_facturafabricadetalle);
                fn_disabled_inputs_ini_edit();
            }
        }

        function fn_disabled_inputs_ini_edit() {
            Array.from(_('panelEncabezado_FacturaFabricaFacturacionSample').getElementsByClassName('_cls_disabled_edit'))
                .forEach(x => {
                    x.disabled = true;
                });
        }

        function fn_save_new_facturafabrica() {
            let req = _required({ id: 'panelEncabezado_FacturaFabricaFacturacionSample', clase: '_enty' });
            if (req) {
                let pasavalidacion = fn_validar_antesgrabar();

                if (!pasavalidacion) {
                    return false;
                }

                let factura_fabrica = _getParameter({ id: 'panelEncabezado_FacturaFabricaFacturacionSample', clase:'_enty' });
                let arr_facturafabrica_detalle = fn_get_arr_facturafabrica_detalle();
                let form = new FormData();

                form.append('FacturaFabricaJSON', JSON.stringify(factura_fabrica));
                form.append('FacturaFabricaDetalleJSON', JSON.stringify(arr_facturafabrica_detalle));

                _Post('Requerimiento/FacturacionSampleFacturaFabrica/SaveNewFacturaFabrica_JSON', form, true)
                    .then((rpta) => {
                        let orpta = JSON.parse(rpta);
                        _swal({ mensaje: orpta.mensaje, estado: orpta.estado }, 'Good Job');
                        if (orpta.estado === 'success') {
                            $("#modal__FacturaFabricaFacturacionSample").modal('hide');
                            fn_despuesgrabar();
                        }
                    });
            }
        }

        function fn_save_edit_facturafabrica() {
            let req = _required({ id: 'panelEncabezado_FacturaFabricaFacturacionSample', clase: '_enty' });
            if (req) {
                let pasavalidacion = fn_validar_antesgrabar();

                if (!pasavalidacion) {
                    return false;
                }

                let factura_fabrica = _getParameter({ id: 'panelEncabezado_FacturaFabricaFacturacionSample', clase: '_enty' });
                //let arr_facturafabrica_detalle = fn_get_arr_facturafabrica_detalle();
                let form = new FormData();

                form.append('FacturaFabricaJSON', JSON.stringify(factura_fabrica));
                form.append('FacturaFabricaDetalleJSON', '');  //// JSON.stringify(arr_facturafabrica_detalle)

                _Post('Requerimiento/FacturacionSampleFacturaFabrica/SaveEditFacturaFabrica_JSON', form, true)
                    .then((rpta) => {
                        let orpta = JSON.parse(rpta);
                        _swal({ mensaje: orpta.mensaje, estado: orpta.estado }, 'Good Job');
                        if (orpta.estado === 'success') {
                            $("#modal__FacturaFabricaFacturacionSample").modal('hide');
                            fn_despuesgrabar();
                        }
                    });
            }
        }

        function fn_despuesgrabar() {
            appFacturacionSampleInicial.req_ini();
            let arr_li_tabs = Array.from(_('panelEncabezado_FacturacionSampleInicial').getElementsByClassName('_cls_li_tab_inicial'));
            let arr_tab_content = Array.from(_('panelEncabezado_FacturacionSampleInicial').getElementsByClassName('_cls_tab_inicial'));

            arr_li_tabs.some(x => {
                if (x.classList.value.indexOf('active') >= 0) {
                    x.classList.remove('active');
                    return true;
                }
            });

            arr_li_tabs.some(x => {
                if (x.classList.value.indexOf('_cls_li_inicial_facturafabrica') >= 0) {
                    x.classList.add('active');
                    return true;
                }
            });

            //
            arr_tab_content.some(x => {
                if (x.classList.value.indexOf('active') >= 0) {
                    x.classList.remove('active');
                    return true;
                }
            });
            arr_tab_content.some(x => {
                if (x.classList.value.indexOf('_cls_div_tab_inicial_principal_facturafabrica') >= 0) {
                    x.classList.add('active');
                    return true;
                }
            });
        }

        function fn_get_arr_facturafabrica_detalle() {
            let arr = Array.from(_('tbody_facturafabrica_fsample').rows)
                .map(x => {
                    let datapar = x.getAttribute('data-par');
                    let idordenpedidodetalle = _par(datapar, 'idordenpedidodetalle');
                    let idrequerimiento = _par(datapar, 'idrequerimiento');
                    let idrequerimientodetalle = _par(datapar, 'idrequerimientodetalle');
                    let cantidadmuestrafacturable = x.getElementsByClassName('_cls_txt_q_afacturar_ff')[0].value;
                    let preciomuestra = x.getElementsByClassName('_cls_txt_precio_factcliente_ff')[0].value;
                    let cantidadcontramuestrafacturable = x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0].value;
                    let preciocontramuestra = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0].value;
                    let escontramuestrafacturablecliente = x.getElementsByClassName('_cls_cm_esfacturable')[0].checked;

                    return {
                        IdOrdenPedidoDetalle: idordenpedidodetalle,
                        IdRequerimiento: idrequerimiento,
                        IdRequerimientoDetalle: idrequerimientodetalle,
                        EsContramuestraFacturableCliente: escontramuestrafacturablecliente ? 1 : 0,
                        CantidadMuestraFacturable: cantidadmuestrafacturable,
                        PrecioMuestra: preciomuestra,
                        CantidadContraMuestraFacturable: cantidadcontramuestrafacturable,
                        PrecioContraMuestra: preciocontramuestra
                    }
                });
            return arr;
        }

        function fn_change_ordenpedido(o) {
            if (o.value !== '') {
                let idordenpedido = o.value;
                let montototal = o.options[o.selectedIndex].getAttribute('data-montototal');
                let totalfilas = _('tbody_facturafabrica_fsample').rows.length;
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
                            _('tbody_facturafabrica_fsample').innerHTML = '';
                            _('txt_total_ff').value = '';
                        } else {
                            let idordenpedido_anterior = o.getAttribute('data-idordenpedido-temporal');
                            o.value = idordenpedido_anterior;
                        }
                        
                });
            }
        }

        function fn_getdata_ordenpedido(idordenpedido, montototal) {
            _Get('Requerimiento/FacturacionSampleOrdenPedido/GetOrdenPedidoByIdForFacturaFabricaSave_CSV?IdOrdenPedido=' + idordenpedido)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : [];
                    fn_pintar_tbl_ordenpedido(odata);

                    //_('txt_total_ff').value = montototal;
                });
        }

        function fn_pintar_tbl_ordenpedido(odata) {
            let html = odata.map((x, indice) => {
                let cadena_sefactura_contramuestra = x.EsContramuestraFacturableCliente === '1' ? 'checked' : '';
                return `
                        <tr data-par='idordenpedido:${x.IdOrdenPedido},idordenpedidodetalle:${x.IdOrdenPedidoDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle},cantidadmuestrafacturable_op_original:${x.CantidadMuestraFacturable_OP_Original},cantidadcontramuestrafacturable_op_original:${x.CantidadContraMuestraFacturable_OP_Original}'>
                            <td>${x.CodigoEstilo}</td>
                            <td>${x.NombreTipoMuestra}</td>
                            <td>${x.Version}</td>
                            <td>${x.NombreClienteColor}</td>
                            <td>${x.NombreClienteTalla}</td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_cm_esfacturable_${indice}' class='_cls_cm_esfacturable' ${cadena_sefactura_contramuestra} disabled />
                                    <label for='chk_cm_esfacturable_${indice}'></label>
                                </div>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_q_afacturar_ff' value='${x.CantidadMuestraFacturable}' onkeypress="return DigitosEnteros(event, this)" />
                                <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_factcliente_ff' value='${x.PrecioMuestra}' onkeypress="return DigitimosDosDecimales(event, this)" />
                                <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_qcm_se_factura_ff' value='${x.CantidadContraMuestraFacturable}' disabled onkeypress="return DigitosEnteros(event, this)"/>
                                <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_cm_factcliente_ff' value='${x.PrecioContraMuestra}' disabled onkeypress="return DigitimosDosDecimales(event, this)" />
                                <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                            </td>
                        </tr>
                `
            }).join('');

            _('tbody_facturafabrica_fsample').innerHTML = html;
            fn_calcular_total_factura_load();
            fn_handler_tbl_facturafabricadetalle();
        }

        function fn_pintar_tbl_ordenpedido_ini_edit(odata) {
            let html = odata.map((x, indice) => {
                let cadena_sefactura_contramuestra = x.EsContramuestraFacturableCliente === '1' ? 'checked' : '';
                return `
                        <tr data-par='idordenpedido:${x.IdOrdenPedido},idordenpedidodetalle:${x.IdOrdenPedidoDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle},cantidadmuestrafacturable_op_original:${x.CantidadMuestraFacturable_OP_Original},cantidadcontramuestrafacturable_op_original:${x.CantidadContraMuestraFacturable_OP_Original}'>
                            <td>${x.CodigoEstilo}</td>
                            <td>${x.NombreTipoMuestra}</td>
                            <td>${x.Version}</td>
                            <td>${x.NombreClienteColor}</td>
                            <td>${x.NombreClienteTalla}</td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_cm_esfacturable_${indice}' class='_cls_cm_esfacturable' ${cadena_sefactura_contramuestra} disabled />
                                    <label for='chk_cm_esfacturable_${indice}'></label>
                                </div>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_q_afacturar_ff' value='${x.CantidadMuestraFacturable}' onkeypress="return DigitosEnteros(event, this)" disabled />
                                <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_factcliente_ff' value='${x.PrecioMuestra}' onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_qcm_se_factura_ff' value='${x.CantidadContraMuestraFacturable}' disabled onkeypress="return DigitosEnteros(event, this)" disabled/>
                                <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                            </td>
                            <td>
                                <input type='text' class='form-control _cls_txt_precio_cm_factcliente_ff' value='${x.PrecioContraMuestra}' disabled onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                            </td>
                        </tr>
                `
            }).join('');

            _('tbody_facturafabrica_fsample').innerHTML = html;
            fn_handler_tbl_facturafabricadetalle();
        }

        function fn_handler_tbl_facturafabricadetalle() {
            if (ovariables.accion === 'new') {
                Array.from(_('tbody_facturafabrica_fsample').rows).forEach(x => {
                    let chk_checked_se_factura_cm = x.getElementsByClassName('_cls_cm_esfacturable')[0].checked;
                    let txt_q_cm = x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0];
                    let txtprecio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0];
                    if (chk_checked_se_factura_cm) {
                        txtprecio_cm.disabled = false;
                        txt_q_cm.disabled = false;
                    } else {
                        txtprecio_cm.disabled = true;
                        txt_q_cm.disabled = true;
                    }
                });
            } else {
                //// PARA EDIT TODO SE DESHABILITA
                Array.from(_('tbody_facturafabrica_fsample').rows).forEach(x => {
                    let chk_checked_se_factura_cm = x.getElementsByClassName('_cls_cm_esfacturable')[0].checked;
                    let txt_q_cm = x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0];
                    let txtprecio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0];
                    txtprecio_cm.disabled = true;
                    txt_q_cm.disabled = true;
                });
            }
            

            Array.from(_('tbody_facturafabrica_fsample').rows)
                .forEach(x => {
                    x.getElementsByClassName('_cls_txt_q_afacturar_ff')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_factcliente_ff')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_cm_esfacturable')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                });
        }

        function fn_change_inputtext_tbl_requerimientodetalle(o) {
            fn_calcular_total_factura_load();
        }

        function fn_calcular_total_factura_load() {
            let total = 0;
            Array.from(_('tbody_facturafabrica_fsample').rows)
                .forEach(x => {
                    let txt_q_muestra = x.getElementsByClassName('_cls_txt_q_afacturar_ff')[0];
                    let txt_precio_muesta = x.getElementsByClassName('_cls_txt_precio_factcliente_ff')[0];
                    let txt_qcm = x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0];
                    let txt_precio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0];
                    let chk_cm_sefacura = x.getElementsByClassName('_cls_cm_esfacturable')[0];

                    let subtotal_muestra = parseInt(txt_q_muestra.value) * parseFloat(txt_precio_muesta.value);
                    subtotal_muestra = isNaN(subtotal_muestra) ? 0 : subtotal_muestra;
                    let subtotal_cmuestra = 0;
                    if (chk_cm_sefacura.checked) {
                        subtotal_cmuestra = parseInt(txt_qcm.value) * parseFloat(txt_precio_cm.value);
                        subtotal_cmuestra = isNaN(subtotal_cmuestra) ? 0 : subtotal_cmuestra;
                    }
                    let subtotal_fila = subtotal_muestra + subtotal_cmuestra;
                    total += subtotal_fila;
                });
            _('txt_total_ff').value = parseFloat(total).toFixed(2);
        }

        function fn_validar_antesgrabar() {
            let arr_filas = Array.from(_('tbody_facturafabrica_fsample').rows);
            let pasavalidacion = true;
            let mensaje = '';

            //// SETEAR A DEAFAULT
            Array.from(_('tbody_facturafabrica_fsample').getElementsByClassName('has-error'))
                .forEach(x => {
                    x.classList.add('hide');
                });

            if (arr_filas.length <= 0) {
                pasavalidacion = false;
                mensaje += '- The Purchase Order must be selected. \n';

            } else {
                arr_filas.forEach((x, indice) => {
                    let chk_checked_cm_sefactura = x.getElementsByClassName('_cls_cm_esfacturable')[0].checked;
                    let txt_q_muestra = x.getElementsByClassName('_cls_txt_q_afacturar_ff')[0];
                    let txt_precio_muestra = x.getElementsByClassName('_cls_txt_precio_factcliente_ff')[0];
                    let txt_qcm = x.getElementsByClassName('_cls_txt_qcm_se_factura_ff')[0];
                    let txt_precio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_ff')[0];
                    let datapar = x.getAttribute('data-par');
                    let cantidad_requerimiento = _par(datapar, 'cantidadmuestrafacturable_op_original'); //// SON VALORES QUE VIENE DE LA OP
                    let cantidad_cm_requerida = _par(datapar, 'cantidadcontramuestrafacturable_op_original'); //// SON VALORES QUE VIENE DE LA OP

                    if (chk_checked_cm_sefactura) {
                        let spn_error_q_muestras_afacturar = null;
                        if ((txt_q_muestra.value === '' || txt_q_muestra.value === '0') && (txt_qcm.value === '' || txt_qcm.value === '0')) {
                            pasavalidacion = false;
                            spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                            spn_error_q_muestras_afacturar.classList.remove('hide');
                            spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else { //// EN ESTE BLOQUE ME PRECUPO QUE LA CANTIDAD DE MUESTRA A FACTURAR NO SEA MAYOR 
                            //// A LA CANTIDAD REQUERIDA DE LA OP
                            if (parseInt(txt_q_muestra.value) > parseInt(cantidad_requerimiento)) {
                                pasavalidacion = false;
                                spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                                spn_error_q_muestras_afacturar.classList.remove('hide');
                                spn_error_q_muestras_afacturar.innerText = '- Quantity is greater than required quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' Quantity is greater than required quantity \n';
                            }
                        }

                        if (txt_precio_muestra.value === '' || txt_precio_muestra.value === '0') {
                            pasavalidacion = false;
                            let spn_error_precio_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_afacturar_error')[0];
                            spn_error_precio_muestras_afacturar.classList.remove('hide');
                            spn_error_precio_muestras_afacturar.innerText = '- Enter the price';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                        }
                    } else {
                        if (txt_q_muestra.value === '' || txt_q_muestra.value === '0') {
                            pasavalidacion = false;
                            let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                            spn_error_q_muestras_afacturar.classList.remove('hide');
                            spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {
                            if (parseInt(txt_q_muestra.value) > parseInt(cantidad_requerimiento)) {
                                pasavalidacion = false;
                                spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                                spn_error_q_muestras_afacturar.classList.remove('hide');
                                spn_error_q_muestras_afacturar.innerText = '- Quantity is greater than required quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' Quantity is greater than required quantity \n';
                            }
                        }

                        if (txt_precio_muestra.value === '' || txt_precio_muestra.value === '0') {
                            pasavalidacion = false;
                            let spn_error_precio_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_afacturar_error')[0];
                            spn_error_precio_muestras_afacturar.classList.remove('hide');
                            spn_error_precio_muestras_afacturar.innerText = '- Enter the price';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                        }
                    }
                    
                    if (chk_checked_cm_sefactura) {
                        let spn_error_qcm_afacturar = null;
                        if ((txt_qcm.value === '' || txt_qcm.value === '0') && (txt_q_muestra.value === '' || txt_q_muestra.value === '0')) {
                            pasavalidacion = false;
                            spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                            spn_error_qcm_afacturar.classList.remove('hide');
                            spn_error_qcm_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {
                            if (parseInt(txt_qcm.value) > parseInt(cantidad_cm_requerida)) {
                                pasavalidacion = false;
                                spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                                spn_error_qcm_afacturar.classList.remove('hide');
                                spn_error_qcm_afacturar.innerText = '- Quantity counter sample is greater than required quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' Quantity counter sample is greater than required quantity \n';
                            }
                        }

                        if (txt_precio_cm.value === '' || txt_precio_cm.value === '0') {
                            pasavalidacion = false;
                            let spn_error_precio_cm_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_cm_afacturar_error')[0];
                            spn_error_precio_cm_muestras_afacturar.classList.remove('hide');
                            spn_error_precio_cm_muestras_afacturar.innerText = '- Enter the price';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                        }
                    }
                });
                //// VALIDAR EL MONTO TOTAL
                let cbo_op = _('cbo_op_ff');
                let valor_montototaa_ff = parseFloat(_('txt_total_ff').value).toFixed(2);
                let montototal_op = parseFloat(cbo_op.options[cbo_op.selectedIndex].getAttribute('data-montototal')).toFixed(2);
                if (valor_montototaa_ff > montototal_op) {
                    pasavalidacion = false;
                    mensaje += '- The total amount is greater than the purchase order \n';
                }
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Validation');
            }

            return pasavalidacion;
        }

        function req_ini() {
            //ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            if (ovariables.accion === 'new') {
                _Get('Requerimiento/FacturacionSampleFacturaFabrica/GetFacturaFabricaLoadNew_JSON?IdPrograma=' + ovariables.idprograma + '&IdCliente=' + ovariables.idcliente)
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini(odata);
                    });
            } else {
                let parametro = { IdFacturaFabrica: _('hf_idfacturafabrica').value };
                _Get('Requerimiento/FacturacionSampleFacturaFabrica/GetFacturaFabricaLoadEdit_JSON?par=' + JSON.stringify(parametro))
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini_edit(odata);
                    });
                res_ini_edit
            }
            
        }

        return {
            load: load,
            req_ini: req_ini,

        }
    }
)(document, 'panelEncabezado_OrdenPedidoFacturacionSample');
(
    function ini() {
        appFacturaFabrica_FacturacionSample.load();
        appFacturaFabrica_FacturacionSample.req_ini();
    }
)();
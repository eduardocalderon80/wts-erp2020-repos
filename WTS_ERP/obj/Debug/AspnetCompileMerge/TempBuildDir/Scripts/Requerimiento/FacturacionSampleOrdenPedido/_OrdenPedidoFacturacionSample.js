
var appOrdenPedidoFacturacionSample = (
    function (d, idpadre) {
        var ovariables = {
            idprograma: '',
            lstEstadosFacturacionSample: [],
            idcliente: '',
            accion: '',
            bool_ctrl_seleccionado: false,
            bool_shift_seleccionado: false,
            contador_click_shift: 0,
            numerofila_seleccionado_inicio_shift: 0,
            numerofila_seleccionado_fin_shift: 0
        }

        var oUtil = {
            adata: [],
            adataresult: [],
            indiceactualpagina: 0,
            registrospagina: 10,
            paginasbloques: 3,
            indiceactualbloque: 0
        }

        function load() {
            let parametro = _('txtpar_OrdenPedidoFacturacionSample').value;
            ovariables.idprograma = _par(parametro, 'idprograma');
            ovariables.idcliente = _par(parametro, 'idcliente');
            ovariables.accion = _par(parametro, 'accion');
            _('hf_idordenpedido').value = _par(parametro, 'idordenpedido');

            _('btnGenerarOP_Next').addEventListener('click', function (e) { let o = e.currentTarget; fn_next_tab(o); }, false);
            _('btnGenerarOP_Previous').addEventListener('click', function (e) { let o = e.currentTarget; fn_previous_tab(o); }, false);
            _('btnGenerarOP_Previous').disabled = true;
            _('btnGenerarOP_Save').disabled = true;
            _('file_archivo_op').addEventListener('change', fn_change_new_file_op, false);
            _('btnGenerarOP_Save').addEventListener('click', e => {
                if (ovariables.accion === 'new') {
                    fn_SaveNewOrdenPedido(e.currentTarget);
                } else {
                    fn_SaveEditOrdenPedido(e.currentTarget);
                }
                
            }, false);
            _('btn_updateprecio').addEventListener('click', fn_actualizarprecio, false);
            _('btnGenerarOP_Return').addEventListener('click', fn_return, false);

            //// NOTA: PARA QUE FUNCIONE EL EVENTO KEYDOWN EN UN DIV TIENE QUE ESTAR CONFIGURACO EL TABINDEX = 0; 
            //// Y EL OUTLINE ES OPCIONAL SOLO PARA QUE NO SE MUESTRA LA LINEA CONTORNO
            document.getElementById('panelEncabezado_OrdenPedidoFacturacionSample').addEventListener('keydown', handlerkeydown, false);
            document.getElementById('panelEncabezado_OrdenPedidoFacturacionSample').addEventListener('keyup', handlerkeyup, false);

            filter_header();
        }

        function res_ini(odata) {
            if (odata) {
                let arr_requerimientos = odata.RequerimientosCSV !== '' ? CSVtoJSON(odata.RequerimientosCSV) : [];
                ovariables.lstEstadosFacturacionSample = odata.EstadosFacturacionSampleCSV !== '' ? CSVtoJSON(odata.EstadosFacturacionSampleCSV) : [];

                let arr_proveedor = odata.ProveedoresCSV !== '' ? CSVtoJSON(odata.ProveedoresCSV) : [];
                _('cbo_proveedor_op').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_proveedor, 'IdProveedor', 'NombreProveedor');
                _('txt_cliente_op').value = odata.NombreCliente;

                //// IMPLEMENTAR FILTRO BUSCADOR
                oUtil.adata = arr_requerimientos;
                oUtil.adataresult = oUtil.adata;
                pintar_tabla_requerimiento_ini(arr_requerimientos);
            }
        }

        function fn_return() {
            swal({
                html: true,
                title: 'Are you sure to return?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, function (result) {
                    if (result) {
                        $("#modal__OrdenPedidoFacturacionSample").modal('hide');
                    }
            });
        }

        function res_ini_edit(odata) {
            if (odata) {
                let arr_requerimientos = odata.RequerimientosCSV !== '' ? CSVtoJSON(odata.RequerimientosCSV) : [];
                let arr_requerimiento_detalle = odata.OrdenPedidoDetalleCSV !== '' ? CSVtoJSON(odata.OrdenPedidoDetalleCSV) : [];
                let arr_archivosadjuntos = odata.ArchivosAdjuntosCSV !== '' ? CSVtoJSON(odata.ArchivosAdjuntosCSV) : [];
                ovariables.lstEstadosFacturacionSample = odata.EstadosFacturacionSampleCSV !== '' ? CSVtoJSON(odata.EstadosFacturacionSampleCSV) : [];

                let arr_proveedor = odata.ProveedoresCSV !== '' ? CSVtoJSON(odata.ProveedoresCSV) : [];
                _('cbo_proveedor_op').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_proveedor, 'IdProveedor', 'NombreProveedor');
                _('txt_cliente_op').value = odata.NombreCliente;

                _('txta_comentario_op').value = odata.Comentario;
                _('cbo_proveedor_op').value = odata.IdProveedor;

                //// IMPLEMENTAR FILTRO BUSCADOR
                oUtil.adata = arr_requerimientos;
                oUtil.adataresult = oUtil.adata;
                pintar_tabla_requerimiento_ini(arr_requerimientos);

                llenar_tbl_detallerequerimiento_ini_edit(arr_requerimiento_detalle);
                llenar_tbl_archivosadjuntos_ini_edit(arr_archivosadjuntos);
                fn_disabled_inputs_ini_edit();
                //// OCULTAR BOTONES
                _('btnGenerarOP_Previous').classList.add('hide');
                _('btnGenerarOP_Next').classList.add('hide');
                _('btnGenerarOP_Save').disabled = false;
                
            }
        }

        function fn_disabled_inputs_ini_edit() {
            Array.from(_('panelEncabezado_OrdenPedidoFacturacionSample').getElementsByClassName('_cls_disabled_edit'))
                .forEach(x => {
                    x.disabled = true;
                });
        }

        function fn_actualizarprecio() {
            let txtprecio = _('txt_updateprecio');
            let precio = txtprecio.value;

            if (precio === '' || precio === 0) {
                _swal({ mensaje: 'Enter the price', estado: 'error' }, 'Validation');
                txtprecio.focus();
                return false;
            }

            let totalfilas = _('tbody_RequerimientoDetalle_op').rows.length;
            if (totalfilas > 1) {
                let total_selected = Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('_cls_row_selected')).length;
                if (total_selected <= 0) {
                    _swal({ mensaje: 'Select at least one row', estado: 'error' }, 'Validation');
                    return false;
                }
            }

            ////Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('_cls_txt_precio_factcliente_op'))
            if (totalfilas > 1) {
                Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('_cls_row_selected'))
                    .forEach(x => {
                        x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0].value = precio;
                        //x.value = precio;
                    });
            } else {
                _('tbody_RequerimientoDetalle_op').rows[0].getElementsByClassName('_cls_txt_precio_factcliente_op')[0].value = precio;
            }
            
            txtprecio.value = '';
            fn_calcular_total_factura_load();
            fn_limpiar_variables_shift_ctrl();
        }

        function fn_change_new_file_op(e) {

            let nombre = e.target.files[0].name, html = '';
            let file = e.target.files;
            //<button class='btn btn-info btn-sm _downloadfile'>
            //    <span class='fa fa-download'></span>
            //</button>
            html = `<tr data-par='idordenpedidoarchivohojadecostos:0,modificado:1'>
                        <td class='hide'></td>
                        <td class='text-center'>
                            <div class ='btn-group'>
                                <a class='btn btn-sm btn-info _downloadfile' style='cursor:pointer;'>
                                    <i class='fa fa-download'></i>
                                </a>
                                <button class ='btn btn-danger btn-sm _deletefile' style='cursor:pointer;'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td class='_cls_td_nombrearchivo_original'>${nombre}</td>
                        <td class='text-center'></td>
                        <td class='text-center'></td>
                </tr>
            `;
            _('tbody_adjuntararchivo_op').insertAdjacentHTML('beforeend', html);

            let tbl = _('tbody_adjuntararchivo_op'), total = tbl.rows.length;
            let filexd = _('file_archivo_op').cloneNode(true);
            filexd.setAttribute('id', 'file_op' + (total - 1));
            filexd.classList.add('_cls_file_op');
            tbl.rows[total - 1].cells[0].appendChild(filexd);
            handlerAccionTblArchivos_op_add(total);
        }

        function handlerAccionTblArchivos_op_add(indice) {
            let tbody = _('tbody_adjuntararchivo_op');
            tbody.getElementsByClassName('_downloadfile')[0].addEventListener('click', function (e) { fn_download_archivo(e.currentTarget); }, false);
            tbody.getElementsByClassName('_deletefile')[0].addEventListener('click', function (e) { fn_delete_temporal_archivo_adjunto(e.currentTarget); }, false);
        }

        function fn_delete_temporal_archivo_adjunto(o) {
            let fila = o.parentNode.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function fn_download_archivo(o) {
            let fila = o.parentNode.parentNode.parentNode;

            let inputfile = fila.getElementsByClassName('_cls_file_op')[0];
            let file = inputfile.files[0];
            let filename = inputfile.files[0].name;
            var blob = new Blob([file]);
            var url = URL.createObjectURL(blob);

            //$(o).attr({ 'download': filename, 'href': url });
            o.setAttribute('href', url);
            o.setAttribute('download', filename);
            filename = "";
        }

        function fn_next_tab(o) {
            let pasavalidacion = true;
            let ul_tag = _('ul_tabs_generarordenpedido').getElementsByClassName('active')[0].getAttribute('data-tag');
            let li_requerimiento = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_requerimientomuestra')[0];
            let li_detalle = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_detalle')[0];
            let li_datosadicionales = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_datosadicionales')[0];

            // los tab content
            let tab_requerimiento = d.getElementById('tab-samplelist_op');
            let tab_detalle = d.getElementById('tab-ordenpedidodetalle_op');
            let tab_datosadicionales = d.getElementById('tab-datosadicionales_op');

            _('btnGenerarOP_Previous').disabled = false;
            switch (ul_tag) {
                case 'op_requerimientomuestra':

                    //// VALIDAR ANTES DE CONTINUAR
                    pasavalidacion = fn_validar_next(ul_tag);
                    if (!pasavalidacion) {
                        return false;
                    }

                    li_requerimiento.classList.remove('active');
                    tab_requerimiento.classList.remove('active');
                    li_detalle.classList.add('active');
                    tab_detalle.classList.add('active');

                    let listacadena_reqmuestra_seleccionados = fn_getlistacadena_requerimientosmuestra_seleccionados();
                    llenar_tbl_detallerequerimiento(listacadena_reqmuestra_seleccionados);

                    break;
                case 'op_detalle':
                    //// VALIDAR ANTES DE CONTINUAR
                    pasavalidacion = fn_validar_next(ul_tag);
                    if (!pasavalidacion) {
                        return false;
                    }

                    li_detalle.classList.remove('active');
                    tab_detalle.classList.remove('active');
                    li_datosadicionales.classList.add('active');
                    tab_datosadicionales.classList.add('active');
                    o.disabled = true;
                    _('btnGenerarOP_Save').disabled = false;
                    break;
                case 'op_datosadicionales':

                    break;
                default:
            }
        }

        function fn_validar_next(nametab) {
            let pasavalidacion = true;
            let mensaje = '';
            //// SETEAR A DEAFAULT
            Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('has-error'))
                .forEach(x => {
                    x.classList.add('hide');
                });
            switch (nametab) {
                case 'op_requerimientomuestra':
                    //// VALIDAR ANTES DE CONTINUAR
                    let idproveedor = _('cbo_proveedor_op').value;
                    if (idproveedor === '') {
                        pasavalidacion = false;
                        mensaje += '- Need to select the provider \n';
                        _('div_grupo_proveedor').classList.add('has-error');
                    }
                    let listacadena_reqmuestra_seleccionados = fn_getlistacadena_requerimientosmuestra_seleccionados();
                    if (listacadena_reqmuestra_seleccionados === '') {
                        pasavalidacion = false;
                        mensaje += '- At least one sample needs to be selected \n';

                    }
                    break;
                case 'op_detalle':
                    let arr_rows_detalle = Array.from(_('tbody_RequerimientoDetalle_op').rows);
                    if (arr_rows_detalle.length <= 0) {
                        pasavalidacion = false;
                        mensaje += '- At least one sample needs to be selected \n';
                    } else {
                        arr_rows_detalle.forEach((x, indice) => {
                            let txtcolor = x.getElementsByClassName('_cls_txt_clientecolor')[0];
                            let txtq_muestras = x.getElementsByClassName('_cls_txt_q_afacturar_op')[0];
                            let txtprecio_muestra = x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0];
                            let chk_qcm_se_factura = x.getElementsByClassName('_cls_chk_cm_se_factura_op')[0];
                            let txtqcm_afacturar = x.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0];
                            let txtprecio_cm_afacturar = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0];

                            if (txtcolor.value.trim() === '') {
                                pasavalidacion = false;
                                let spn_color_error = x.getElementsByClassName('_cls_spn_color_error')[0];
                                spn_color_error.classList.remove('hide');
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the color \n';
                            }

                            if (txtq_muestras.value === '' || txtq_muestras.value === '0') {
                                pasavalidacion = false;
                                let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                                spn_error_q_muestras_afacturar.classList.remove('hide');
                                spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                            }

                            if (txtprecio_muestra.value === '' || txtprecio_muestra.value === '0') {
                                pasavalidacion = false;
                                let spn_error_precio_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_afacturar_error')[0];
                                spn_error_precio_muestras_afacturar.classList.remove('hide');
                                spn_error_precio_muestras_afacturar.innerText = '- Enter the price';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                            }

                            if (chk_qcm_se_factura.checked) {
                                if (txtqcm_afacturar.value === '' || txtqcm_afacturar.value === '0') {
                                    pasavalidacion = false;
                                    let spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                                    spn_error_qcm_afacturar.classList.remove('hide');
                                    spn_error_qcm_afacturar.innerText = '- Enter the quantity';
                                    mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                                }

                                if (txtprecio_cm_afacturar.value === '' || txtprecio_cm_afacturar.value === '0') {
                                    pasavalidacion = false;
                                    let spn_error_precio_cm_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_cm_afacturar_error')[0];
                                    spn_error_precio_cm_muestras_afacturar.classList.remove('hide');
                                    spn_error_precio_cm_muestras_afacturar.innerText = '- Enter the price';
                                    mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                                }
                            }
                        });
                    }
                    break;
                case 'op_datosadicionales':

                    break;

            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Validation');
            }

            return pasavalidacion;
        }

        function fn_getlistacadena_requerimientosmuestra_seleccionados() {
            let arr = Array.from(_('tbody_requerimientosample_op').getElementsByClassName('_cls_rb_select_op'))
                .filter(x => x.checked === true)
                .map(x => {
                    let fila = x.parentNode.parentNode.parentNode;
                    let datapar = fila.getAttribute('data-par');
                    let idrequerimiento = _par(datapar, 'idrequerimiento');
                    return idrequerimiento;
                }).join(',');
            return arr;
        }

        function llenar_tbl_detallerequerimiento(listaRequerimientosSeleccionados) {
            _Get('Requerimiento/FacturacionSampleOrdenPedido/GetRequerimientoMuestraDetalle_JSON?listaRequerimientosSeleccionados=' + listaRequerimientosSeleccionados)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : null;
                    if (odata) {
                        let html = odata.map((x, indice) => {
                            return `
                                <tr data-par='idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle},cantidadcm:${x.CantidadCM}'>
                                    <td>${x.CodigoEstilo}</td>
                                    <td>${x.NombreTipoMuestra}</td>
                                    <td>${x.Version}</td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_clientecolor' value='${x.NombreClienteColor.trim()}' data-nombrecolor-original='${x.NombreClienteColor.trim()}' />
                                    </td>
                                    <td>${x.NombreClienteTalla}</td>
                                    <td class='_cls_td_cantidad_requerimiento'>${x.Cantidad}</td>
                                    <td class='text-center'>
                                        <div class='checkbox checkbox-green'>
                                            <input type='checkbox' id='chk_cm_se_factura${indice}' class='_cls_chk_cm_se_factura_op' />
                                            <label for='chk_cm_se_factura${indice}'></label>
                                        </div>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_q_afacturar_op' value='${x.CantidadMuestrasAFacturar}' onkeypress="return DigitosEnteros(event, this)" />
                                        <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_factcliente_op' value='${x.PrecioEstilo}' onkeypress="return DigitimosDosDecimales(event, this)" />
                                        <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_qcm_se_factura_op' value='${x.CantidadCMAFacturar}' disabled  onkeypress="return DigitosEnteros(event, this)"/>
                                        <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_cm_factcliente_op' value='${x.PrecioEstiloCM}' disabled onkeypress="return DigitimosDosDecimales(event, this)" />
                                        <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                                    </td>
                                </tr>
                            `;
                        }).join('');

                        _('tbody_RequerimientoDetalle_op').innerHTML = html;
                        fn_calcular_total_factura_load();
                        fn_handler_tbl_requerimientodetalle();
                    }
                });
        }

        function llenar_tbl_detallerequerimiento_ini_edit(odata) {
            if (odata) {
                let html = odata.map((x, indice) => {
                    return `
                                <tr data-par='idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle},cantidadcm:${x.CantidadCM}'>
                                    <td>${x.CodigoEstilo}</td>
                                    <td>${x.NombreTipoMuestra}</td>
                                    <td>${x.Version}</td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_clientecolor' value='${x.NombreClienteColor.trim()}' data-nombrecolor-original='${x.NombreClienteColor.trim()}' disabled />
                                    </td>
                                    <td>${x.NombreClienteTalla}</td>
                                    <td class='_cls_td_cantidad_requerimiento'>${x.Cantidad}</td>
                                    <td class='text-center'>
                                        <div class='checkbox checkbox-green'>
                                            <input type='checkbox' id='chk_cm_se_factura${indice}' class='_cls_chk_cm_se_factura_op' ${x.EsContramuestraFacturableCliente === '1' ? 'checked' : '' } disabled />
                                            <label for='chk_cm_se_factura${indice}'></label>
                                        </div>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_q_afacturar_op' value='${x.CantidadMuestrasAFacturar}' onkeypress="return DigitosEnteros(event, this)" disabled />
                                        <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_factcliente_op' value='${x.PrecioEstilo}' onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                        <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_qcm_se_factura_op' value='${x.CantidadCMAFacturar}' disabled  onkeypress="return DigitosEnteros(event, this)" disabled />
                                        <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_cm_factcliente_op' value='${x.PrecioEstiloCM}' disabled onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                        <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                                    </td>
                                </tr>
                            `;
                }).join('');

                _('tbody_RequerimientoDetalle_op').innerHTML = html;
                fn_calcular_total_factura_load();
                fn_handler_tbl_requerimientodetalle();
            }
        }

        function llenar_tbl_archivosadjuntos_ini_edit(odata) {
            if (odata) {
                let html = odata.map(x => {
                    return `
                        <tr data-par='idordenpedidoarchivohojadecostos:${x.IdOrdenPedidoArchivoHojaDeCostos},nombrearchivogenerado:${x.NombreArchivoGenerado}'>
                            <td class="hide"></td><!--COLUMNA OCULTA PARA EL INPUT FILE OCULTO-->
                            <td class='text-center'>
                                <div class ='btn-group'>
                                    <a class='btn btn-sm btn-info _downloadfile' style='cursor:pointer;'>
                                        <i class='fa fa-download'></i>
                                    </a>
                                    <button class ='btn btn-danger btn-sm _deletefile' style='cursor:pointer;' >
                                        <span class ='fa fa-trash-o'></span>
                                    </button>
                                </div>
                            </td>
                            <td class='_cls_td_nombrearchivooriginal'>${x.NombreArchivoOriginal}</th>
                            <td>${x.UsuarioActualizacion}</th>
                            <td>${x.FechaActualizacion}</th>

                        </tr>
                    `;
                }).join('');

                _('tbody_adjuntararchivo_op').innerHTML = html;
                fn_handler_tbl_archivosadjuntos_ini_edit();
            }
        }

        function fn_handler_tbl_archivosadjuntos_ini_edit() {
            Array.from(_('tbody_adjuntararchivo_op').rows)
                .forEach(x => {
                    x.getElementsByClassName('_downloadfile')[0].addEventListener('click', e => { fn_download_file_hojacosto_edit(e.currentTarget) }, false);
                    x.getElementsByClassName('_deletefile')[0].addEventListener('click', function (e) { fn_delete_temporal_archivo_adjunto(e.currentTarget); }, false);
                });
        }

        function fn_download_file_hojacosto_edit(o) {
            let fila = o.parentNode.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let nombrearchivogenerado = _par(datapar, 'nombrearchivogenerado');
            let nombrearchivooriginal = fila.getElementsByClassName('_cls_td_nombrearchivooriginal')[0].innerText.trim();
            let link = document.createElement('a');
            link.href = urlBase() + 'Requerimiento/FacturacionSampleOrdenPedido/DownloadFileHojaCosto?NombreArchivoGenerado=' + nombrearchivogenerado + '&NombreArchivoOriginal=' + nombrearchivooriginal;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function fn_calcular_total_factura_load() {
            let total = 0;
            Array.from(_('tbody_RequerimientoDetalle_op').rows)
                .forEach(x => {
                    let txt_q_muestra = x.getElementsByClassName('_cls_txt_q_afacturar_op')[0];
                    let txt_precio_muesta = x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0];
                    let txt_qcm = x.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0];
                    let txt_precio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0];
                    let chk_cm_sefacura = x.getElementsByClassName('_cls_chk_cm_se_factura_op')[0];

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
            _('txt_total_op').value = parseFloat(total).toFixed(2);
        }

        function fn_handler_tbl_requerimientodetalle() {
            Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('_cls_chk_cm_se_factura_op'))
                .forEach(x => {
                    x.addEventListener('click', (e) => { fn_checked_contramuestra_se_factura(e.currentTarget); }, false);
                });

            Array.from(_('tbody_RequerimientoDetalle_op').rows)
                .forEach(x => {
                    x.getElementsByClassName('_cls_txt_q_afacturar_op')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_chk_cm_se_factura_op')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.addEventListener('mousedown', handlermousedown, false);
                });
        }

        function fn_change_inputtext_tbl_requerimientodetalle(o) {
            fn_calcular_total_factura_load();
        }

        function fn_checked_contramuestra_se_factura(o) {
            let fila = o.parentNode.parentNode.parentNode;
            if (o.checked) {
                fila.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0].disabled = false;
                fila.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0].disabled = false;
            } else {
                fila.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0].disabled = true;
                fila.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0].disabled = true;
            }
        }

        function fn_previous_tab(o) {
            let ul_tag = _('ul_tabs_generarordenpedido').getElementsByClassName('active')[0].getAttribute('data-tag');
            let li_requerimiento = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_requerimientomuestra')[0];
            let li_detalle = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_detalle')[0];
            let li_datosadicionales = _('ul_tabs_generarordenpedido').getElementsByClassName('cls_li_op_datosadicionales')[0];

            // los tab content
            let tab_requerimiento = d.getElementById('tab-samplelist_op');
            let tab_detalle = d.getElementById('tab-ordenpedidodetalle_op');
            let tab_datosadicionales = d.getElementById('tab-datosadicionales_op');

            _('btnGenerarOP_Next').disabled = false;
            switch (ul_tag) {
                case 'op_requerimientomuestra':

                    break;
                case 'op_detalle':
                    li_detalle.classList.remove('active');
                    tab_detalle.classList.remove('active');
                    li_requerimiento.classList.add('active');
                    tab_requerimiento.classList.add('active');
                    o.disabled = true;
                    break;
                case 'op_datosadicionales':
                    li_datosadicionales.classList.remove('active');
                    tab_datosadicionales.classList.remove('active');
                    li_detalle.classList.add('active');
                    tab_detalle.classList.add('active');
                    break;
                default:
            }
        }

        function pintar_tabla_requerimiento_ini(arr_requerimientos) {
            if (arr_requerimientos) {
                let class_novisible_edit = '';
                if (ovariables.accion === 'edit') {
                    class_novisible_edit = 'hide'
                }
                let html = arr_requerimientos.map((x, indice) => {
                    let cadena_esfacturablecliente = x.EsFacturableCliente === '1' ? 'checked' : '';
                    let cadena_esfacturablefabrica = x.EsFacturableFabrica === '1' ? 'checked' : '';
                    let cadena_checked_select = '';
                    if (ovariables.accion === 'new') { //// SOLO CUANDO ES NUEVO SE USA EL CHECK PARA SELECCIONAR
                        cadena_checked_select = parseInt(x.ChkSelect) === 1 ? 'checked' : '';
                    }
                    
                    return `
                        <tr data-par='idrequerimiento:${x.IdRequerimiento},esfacturablecliente:${x.EsFacturableCliente},esfacturablefabrica:${x.EsFacturableFabrica},idcatalogo_estadofacturacion:${x.IdCatalogo_EstadoFacturacion}'>
                            <td class='text-center'>
                                <div class='checkbox checkbox-primary ${class_novisible_edit}'>
                                    <input type='checkbox' id='rb_select_${indice}' class='_cls_rb_select_op' ${cadena_checked_select} />
                                    <label for='rb_select_${indice}'></label>
                                </div>
                            </td>
                            <td>${x.CodigoEstilo}</td>
                            <td>${x.FechaCreacion}</td>
                            <td>${x.NombreTipoMuestra}</td>
                            <td>${x.Version}</td>
                            <td>${x.ExFactoryInicial}</td>
                            <td>${x.FechaInDC}</td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_esfacturablecliente_${indice}' class='_cls_chk_esfacturablecliente' ${cadena_esfacturablecliente} disabled />
                                    <label for='chk_esfacturablecliente_${indice}'></label>
                                </div>
                                
                            </td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_esfacturablefabrica_${indice}' class='_cls_chk_esfacturablefabrica' ${cadena_esfacturablefabrica} disabled />
                                    <label for='chk_esfacturablefabrica_${indice}'></label>
                                </div>
                                
                            </td>
                            <td>${x.PoNumber}</td>
                            <td>
                                <select class='form-control _cls_cbo_estadofacturacion' disabled></select>
                            </td>
                        </tr>
                        
                    `;
                }).join('');

                _('tbody_requerimientosample_op').innerHTML = html;
                fn_handler_tbl_requerimiento_ini();
                fn_actualizarinputs_tbl_requerimiento_ini();
            }
        }

        function fn_handler_tbl_requerimiento_ini() {
            let arr_fila = Array.from(_('tbody_requerimientosample_op').rows);
            arr_fila.forEach(x => {
                x.getElementsByClassName('_cls_rb_select_op')[0].addEventListener('click', e => { fn_chk_change_select_requerimiento(e.currentTarget) }, false);
            });
        }

        function fn_chk_change_select_requerimiento(o) {
            let checked = o.checked;
            let fila = o.parentNode.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idrequerimiento = _par(datapar, 'idrequerimiento');
            let odataFilter = oUtil.adata.filter(x => x.IdRequerimiento === idrequerimiento);
            if (odataFilter.length > 0) {
                odataFilter[0]["ChkSelect"] = checked ? 1 : 0;
            }
        }

        function fn_actualizarinputs_tbl_requerimiento_ini() {
            // PARA LOS COMBOS
            let arr_fila = Array.from(_('tbody_requerimientosample_op').rows);
            arr_fila.forEach(x => {
                //x.getElementsByClassName('_cls_cbo_estadofacturacion')[0].innerHTML = _comboFromJSON(ovariables.lstEstadosFacturacionSample, 'CodCatalogo', 'NombreCatalogo');

                let datapar = x.getAttribute('data-par');
                let idestadofacturacion = _par(datapar, 'idcatalogo_estadofacturacion');
                let cbo_estadofacturacion = x.getElementsByClassName('_cls_cbo_estadofacturacion')[0];
                cbo_estadofacturacion.innerHTML = _comboItem({ value: '', text: '-' }) + _comboFromJSON(ovariables.lstEstadosFacturacionSample, 'CodCatalogo', 'NombreCatalogo');
                cbo_estadofacturacion.value = idestadofacturacion;
            });
        }

        function fn_SaveNewOrdenPedido() {
            let validacion = fn_ValidarAntesGrabar();
            if (!validacion) {
                return false;
            }

            let form = new FormData();
            let comentario = _('txta_comentario_op').value;
            let arr_OP_detalle = fn_GetListaOrdenPedidoDetalle();
            let arr_archivos = fn_GetListaArchivos();
            let arr_colores_modificados = fn_GetListaColores_a_Mofificar();

            let ordenPedidoJson = {
                Comentario: comentario, IdPrograma: ovariables.idprograma,
                IdCliente: ovariables.idcliente,
                IdProveedor: _('cbo_proveedor_op').value
            }
            
            form.append('OrdenPedidoJSON', JSON.stringify(ordenPedidoJson));
            form.append('OrdenPedidoDetalleJSON', JSON.stringify(arr_OP_detalle));
            form.append('ListaArchivosJSON', JSON.stringify(arr_archivos));
            form.append('ListaColoresModificadosJSON', JSON.stringify(arr_colores_modificados));

            /// ARRAY DE ARCHIVOS
            Array.from(_('tbody_adjuntararchivo_op').getElementsByClassName('_cls_file_op'))
                .forEach((inputfile, indice) => {
                    /// si piden que haya files multiseleccion, hay que recorrer el array del file
                    //// osea; Array.from(inputfile)
                    form.append('fileaddfile' + indice, inputfile.files[0]);
                });
            
            _Post('Requerimiento/FacturacionSampleOrdenPedido/SaveNewOrdenPedido_JSON', form, true)
                .then((rpta) => {
                    let orpta = JSON.parse(rpta);
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                    if (orpta.estado === 'success') {
                        $("#modal__OrdenPedidoFacturacionSample").modal('hide');
                        fn_despuesgrabar();
                    }
                });
        }

        function fn_SaveEditOrdenPedido() {
            let validacion = fn_ValidarAntesGrabar();
            if (!validacion) {
                return false;
            }

            let form = new FormData();
            let comentario = _('txta_comentario_op').value;
            //let arr_OP_detalle = fn_GetListaOrdenPedidoDetalle();
            let arr_archivos = fn_GetListaArchivos();
            //let arr_colores_modificados = fn_GetListaColores_a_Mofificar();

            let ordenPedidoJson = {
                IdOrdenPedido: _('hf_idordenpedido').value,
                Comentario: comentario, IdPrograma: ovariables.idprograma,
                IdCliente: ovariables.idcliente,
                IdProveedor: _('cbo_proveedor_op').value
            }

            form.append('OrdenPedidoJSON', JSON.stringify(ordenPedidoJson));
            form.append('OrdenPedidoDetalleJSON', ''); //// JSON.stringify(arr_OP_detalle)
            form.append('ListaArchivosJSON', JSON.stringify(arr_archivos)); //// JSON.stringify(arr_archivos)
            form.append('ListaColoresModificadosJSON', ''); //// JSON.stringify(arr_colores_modificados)

            ///// ARRAY DE ARCHIVOS
            Array.from(_('tbody_adjuntararchivo_op').getElementsByClassName('_cls_file_op'))
                .forEach((inputfile, indice) => {
                    /// si piden que haya files multiseleccion, hay que recorrer el array del file
                    //// osea; Array.from(inputfile)
                    form.append('fileaddfile' + indice, inputfile.files[0]);
                });

            _Post('Requerimiento/FacturacionSampleOrdenPedido/SaveEditOrdenPedido_JSON', form, true)
                .then((rpta) => {
                    let orpta = JSON.parse(rpta);
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                    if (orpta.estado === 'success') {
                        $("#modal__OrdenPedidoFacturacionSample").modal('hide');
                        fn_despuesgrabar();
                    }
                });
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
                if (x.classList.value.indexOf('_cls_li_inicial_ordenpedidodetalle') >= 0) {
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
                if (x.classList.value.indexOf('_cls_div_tab_inicial_principal_ordenpedidodetalle') >= 0) {
                    x.classList.add('active');
                    return true;
                }
            });
        }

        function fn_GetListaColores_a_Mofificar() {
            let arr = Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('_cls_txt_clientecolor'))
                .filter(x => {
                    let nombrecolor_original = x.getAttribute('data-nombrecolor-original');
                    let nombrecolor_nuevo = x.value;
                    return nombrecolor_original.trim() !== nombrecolor_nuevo.trim();
                })
                .map(x => {
                    let fila = x.parentNode.parentNode;
                    let datapar = fila.getAttribute('data-par');
                    let idrequerimientodetalle = _par(datapar, 'idrequerimientodetalle');
                    let nombrecolor_nuevo = x.value;
                    return {
                        NombreClienteColor: nombrecolor_nuevo.trim(),
                        IdRequerimientoDetalle: idrequerimientodetalle
                    }
                });

            return arr;
        }

        function fn_ValidarAntesGrabar() {
            let mensaje = '';
            let pasavalidacion = true;
            let pasavalidacion_totalfilas = true;
            let arr_rows_detalle = Array.from(_('tbody_RequerimientoDetalle_op').rows);

            let cboproveedor = _('cbo_proveedor_op');
            let valor_proveedor = cboproveedor.value;
            let div_grupo_proveedor = _('div_grupo_proveedor');
            div_grupo_proveedor.classList.remove('has-error');
            if (valor_proveedor === '') {
                pasavalidacion = false;
                mensaje += '- Falta seleccionar el proveedor. \n'
                div_grupo_proveedor.classList.add('has-error');
            }

            let totalfilas_detalle = arr_rows_detalle.length;
            if (totalfilas_detalle === 0) {
                pasavalidacion = false;
                pasavalidacion_totalfilas = false;
                mensaje += '- Missing the detail \n'
            }

            //// SETEAR A DEAFAULT
            Array.from(_('tbody_RequerimientoDetalle_op').getElementsByClassName('has-error'))
                .forEach(x => {
                    x.classList.add('hide');
                });

            if (pasavalidacion_totalfilas) {
                arr_rows_detalle.forEach((x, indice) => {
                    let txtq_muestras = x.getElementsByClassName('_cls_txt_q_afacturar_op')[0];
                    let txtprecio_muestra = x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0];
                    let chk_qcm_se_factura = x.getElementsByClassName('_cls_chk_cm_se_factura_op')[0];
                    let txtqcm_afacturar = x.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0];
                    let txtprecio_cm_afacturar = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0];
                    let cantidad_requerimiento = parseInt(x.getElementsByClassName('_cls_td_cantidad_requerimiento')[0].innerText);

                    let spn_error_q_muestras_afacturar = null;
                    if (txtq_muestras.value === '' || txtq_muestras.value === '0') {
                        pasavalidacion = false;
                        spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                        spn_error_q_muestras_afacturar.classList.remove('hide');
                        spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                        mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                    } else {
                        if (parseInt(txtq_muestras.value) > cantidad_requerimiento) {
                            pasavalidacion = false;
                            spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                            spn_error_q_muestras_afacturar.classList.remove('hide');
                            spn_error_q_muestras_afacturar.innerText = '- Quantity is greater than required quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' Quantity is greater than required quantity \n';
                        }
                    }

                    if (txtprecio_muestra.value === '' || txtprecio_muestra.value === '0') {
                        pasavalidacion = false;
                        let spn_error_precio_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_afacturar_error')[0];
                        spn_error_precio_muestras_afacturar.classList.remove('hide');
                        spn_error_precio_muestras_afacturar.innerText = '- Enter the price';
                        mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                    }

                    if (chk_qcm_se_factura.checked) {
                        let datapar = x.getAttribute('data-par');
                        let cantidad_cm_requerida = _par(datapar, 'cantidadcm');
                        let spn_error_qcm_afacturar = null;
                        
                        if (txtqcm_afacturar.value === '' || txtqcm_afacturar.value === '0') {
                            pasavalidacion = false;
                            spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                            spn_error_qcm_afacturar.classList.remove('hide');
                            spn_error_qcm_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {
                            if (parseInt(txtqcm_afacturar.value) > parseInt(cantidad_cm_requerida)) {
                                pasavalidacion = false;
                                spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                                spn_error_qcm_afacturar.classList.remove('hide');
                                spn_error_qcm_afacturar.innerText = '- Quantity counter sample is greater than required quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' The quantity counter sample is greater than the quantity required \n';
                            }
                            
                        }

                        if (txtprecio_cm_afacturar.value === '' || txtprecio_cm_afacturar.value === '0') {
                            pasavalidacion = false;
                            let spn_error_precio_cm_muestras_afacturar = x.getElementsByClassName('_cls_spn_precio_cm_afacturar_error')[0];
                            spn_error_precio_cm_muestras_afacturar.classList.remove('hide');
                            spn_error_precio_cm_muestras_afacturar.innerText = '- Enter the price';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the price \n';
                        }
                    }
                });
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Validation');
            }

            return pasavalidacion;
        }

        function fn_GetListaOrdenPedidoDetalle() {
            let arr = Array.from(_('tbody_RequerimientoDetalle_op').rows)
                .map(x => {
                    let datapar = x.getAttribute('data-par');
                    let idrequerimiento = _par(datapar, 'idrequerimiento');
                    let idrequerimientodetalle = _par(datapar, 'idrequerimientodetalle');
                    let chk_se_factura_contramuestra = x.getElementsByClassName('_cls_chk_cm_se_factura_op')[0];
                    let escontramuestrafacturablecliente = chk_se_factura_contramuestra.checked ? 1 : 0;
                    let txtcantidadmuestra = x.getElementsByClassName('_cls_txt_q_afacturar_op')[0];
                    let cantidadmuestrafacturable = txtcantidadmuestra.value === '' ? 0 : txtcantidadmuestra.value;
                    let txtpreciomuestra = x.getElementsByClassName('_cls_txt_precio_factcliente_op')[0];
                    let preciomuestra = txtpreciomuestra.value === '' ? 0 : txtpreciomuestra.value;
                    let txtcantidadcontramuestrafacturable = x.getElementsByClassName('_cls_txt_qcm_se_factura_op')[0];
                    let cantidadcontramuestrafacturable = txtcantidadcontramuestrafacturable.value === '' ? 0 : txtcantidadcontramuestrafacturable.value;
                    let txtpreciocontramuestra = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_op')[0];
                    let preciocontramuestra = txtpreciocontramuestra.value === '' ? 0 : txtpreciocontramuestra.value;

                    return {
                        IdOrdenPedidoDetalle: 0
                        , IdRequerimiento: idrequerimiento
                        , IdRequerimientoDetalle: idrequerimientodetalle
                        , EsContramuestraFacturableCliente: escontramuestrafacturablecliente
                        , CantidadMuestraFacturable: cantidadmuestrafacturable
                        , PrecioMuestra: preciomuestra
                        , CantidadContraMuestraFacturable: cantidadcontramuestrafacturable
                        , PrecioContraMuestra: preciocontramuestra
                    }
                });

            return arr;
        }

        function fn_GetListaArchivos() {
            let arr = Array.from(_('tbody_adjuntararchivo_op').rows)
                .map(x => {
                    let nombrearchivooriginal = x.getElementsByClassName('_cls_td_nombrearchivo_original')[0].innerText;
                    return {
                        IdOrdenPedidoArchivoHojaDeCostos: 0,
                        NombreArchivoOriginal: nombrearchivooriginal,
                        NombreArchivoGenerado: ''
                    }
                });

            return arr;
        }

        //// FUNCIONES PARA TRABAJAR CON CTROL, SHIFT Y MOUSE
        function handlermousedown(e) {
            let fila = e.currentTarget;
            if (e.button === 0 && ovariables.bool_ctrl_seleccionado) {
                fila.classList.toggle('_cls_row_selected');
            } else if (e.button === 0 && ovariables.bool_shift_seleccionado) {
                ovariables.contador_click_shift++;
                if (ovariables.contador_click_shift === 1) {
                    fila.classList.toggle('_cls_row_selected');
                    ovariables.numerofila_seleccionado_inicio_shift = fila.rowIndex;
                } else {
                    ovariables.numerofila_seleccionado_fin_shift = fila.rowIndex;

                    if (ovariables.numerofila_seleccionado_fin_shift > ovariables.numerofila_seleccionado_inicio_shift) {
                        //// ASCENDENTE
                        for (let i = ovariables.numerofila_seleccionado_inicio_shift + 1; i <= ovariables.numerofila_seleccionado_fin_shift; i++) {
                            _('tbody_RequerimientoDetalle_op').rows[i - 1].classList.toggle('_cls_row_selected');
                        }
                    } else if (ovariables.numerofila_seleccionado_fin_shift < ovariables.numerofila_seleccionado_inicio_shift) {
                        //// DESCENDENTE
                        for (let i = ovariables.numerofila_seleccionado_fin_shift; i < ovariables.numerofila_seleccionado_inicio_shift; i++) {
                            _('tbody_RequerimientoDetalle_op').rows[i - 1].classList.toggle('_cls_row_selected');
                        }
                    } else if (ovariables.numerofila_seleccionado_fin_shift === ovariables.numerofila_seleccionado_inicio_shift) {
                        fila.classList.toggle('_cls_row_selected');
                    }

                    ovariables.contador_click_shift = 0;
                    ovariables.numerofila_seleccionado_inicio_shift = 0;
                    ovariables.numerofila_seleccionado_fin_shift = 0;
                }
            }
        }

        function handlerkeydown(e) {
            if (e.keyCode === 17) { //// CTRL
                ovariables.bool_ctrl_seleccionado = true;
            } else if (e.keyCode === 16) { //// SHIFT
                ovariables.bool_shift_seleccionado = true;
            }
        }

        function handlerkeyup(e) {
            ovariables.bool_ctrl_seleccionado = false;
            ovariables.bool_shift_seleccionado = false;
        }

        function fn_limpiar_variables_shift_ctrl() {
            ovariables.bool_ctrl_seleccionado = false;
            ovariables.bool_shift_seleccionado = false;
            ovariables.contador_click_shift = 0;
            ovariables.numerofila_seleccionado_inicio_shift = 0;
            ovariables.numerofila_seleccionado_fin_shift = 0;
            Array.from(_('tbody_RequerimientoDetalle_op').rows)
                .forEach(x => {
                    x.classList.remove('_cls_row_selected');
                });
        }

        /* : EDU TODO SOBRE PAGINAR INICIO*/
        //// CUANDO NO HAY PAGINACION NO ES NECESARIO LAS FUNCIONES : page_result, paginar
        function event_header_filter(fields_input) {
            let adataResult = [], adata = oUtil.adata;
            oUtil.indiceactualpagina = 0;
            oUtil.indiceactualbloque = 0;
            if (adata.length > 0) {
                var fields = _('panelEncabezado_OrdenPedidoFacturacionSample').getElementsByClassName(fields_input);
                if (fields != null && fields.length > 0) {
                    var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
                    var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
                    var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
                    var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

                    acampos_name = _oreflector.getProperties(adata[0]);

                    for (i = 0; i < nreg; i++) {
                        exito = true;
                        for (x = 0; x < nfields; x++) {
                            ofield = fields[x];
                            value = ofield.value.toLowerCase();
                            field = ofield.getAttribute("data-field");

                            if (ofield.type == "text") {
                                //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);

                                if (exito) {
                                    if (value !== '') {
                                        valor = adata[i][field];
                                        _y = adata[i][field].toLowerCase().indexOf(value);
                                        exito = (y > -1);
                                    }
                                }
                                exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
                            }
                            else {
                                exito = exito && (value == "" || value == adata[i][field]);
                            }
                            if (!exito) break;
                        }
                        if (exito) {
                            acampos_value = _oreflector.getValues(adata[i]);
                            adataResult[c] = _setfield(acampos_name, acampos_value);
                            c++;
                        }
                    }
                }
            }
            return adataResult;
        }

        function filter_header() {
            var name_filter = "_clsfilter";
            var filters = _('panelEncabezado_OrdenPedidoFacturacionSample').getElementsByClassName(name_filter);
            var nfilters = filters.length, filter = {};

            for (let i = 0; i < nfilters; i++) {
                filter = filters[i];
                if (filter.type == "text") {
                    filter.value = '';
                    filter.onkeyup = function () {
                        oUtil.adataresult = event_header_filter(name_filter);
                        pintar_tabla_requerimiento_ini(oUtil.adataresult, oUtil.indiceactualpagina);
                    }
                }
            }
        }
        /**/

        function req_ini() {
            //ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            let parametro = {};
            if (ovariables.accion === 'new') {
                parametro = { IdPrograma: ovariables.idprograma, IdCliente: ovariables.idcliente }
                _Get('Requerimiento/FacturacionSampleOrdenPedido/GetOrdenPedidoLoadNew_JSON?par=' + JSON.stringify(parametro))
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini(odata);
                    });
            } else {
                let idordenpedido = _('hf_idordenpedido').value;
                parametro = { IdOrdenPedido: idordenpedido }
                _Get('Requerimiento/FacturacionSampleOrdenPedido/GetOrdenPedidoLoadEdit_JSON?par=' + JSON.stringify(parametro))
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini_edit(odata);
                    });
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
        appOrdenPedidoFacturacionSample.load();
        appOrdenPedidoFacturacionSample.req_ini();
    }
)();
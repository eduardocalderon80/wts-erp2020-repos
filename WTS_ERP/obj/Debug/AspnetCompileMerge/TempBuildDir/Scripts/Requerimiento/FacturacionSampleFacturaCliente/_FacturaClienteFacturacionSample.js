var appFacturaClienteFacturacionSample = (
    function (d, idpadre) {
        var ovariables = {
            idprograma: '',
            lstEstadosFacturacionSample: [],
            lstClienteDireccion: [],
            idcliente: '',
            actualizararchivo_packinglist: 0,
            actualizararchivo_guiaaerea: 0,
            actualizararchivo_declaracionjurada: 0,
            actualizararchivo_certificadoorigen: 0,
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
            let parametro = _('txtpar_FacturaClienteFacturacionSample').value;
            ovariables.idprograma = _par(parametro, 'idprograma');
            ovariables.idcliente = _par(parametro, 'idcliente');
            ovariables.accion = _par(parametro, 'accion');
            _('hf_idprograma_fc').value = ovariables.idprograma;
            _('hf_idcliente_fc').value = ovariables.idcliente;
            _('hf_idfacturacliente').value = _par(parametro, 'idfacturacliente');

            _('btnGenerarFC_Next').addEventListener('click', function (e) { let o = e.currentTarget; fn_next_tab(o); }, false);
            _('btnGenerarFC_Previous').addEventListener('click', function (e) { let o = e.currentTarget; fn_previous_tab(o); }, false);
            _('btnGenerarFC_Previous').disabled = true;
            _('btnGenerarFC_Save').disabled = true;
            _('btnGenerarFC_Save').addEventListener('click', e => {
                if (ovariables.accion === 'new') {
                    fn_SaveNewFacturaCliente(e.currentTarget)
                } else {
                    fn_SaveEditFacturaCliente(e.currentTarget);
                }
            }, false);
            _('btn_updateprecio_fc').addEventListener('click', fn_actualizarprecio, false);
            _('filearchivo_packinglist').addEventListener('change', e => { fn_change_add_archivo(e.currentTarget); }, false);
            _('filearchivo_declaracion_jurada').addEventListener('change', e => { fn_change_add_archivo(e.currentTarget); }, false);
            _('filearchivo_guiaaerea').addEventListener('change', e => { fn_change_add_archivo(e.currentTarget); }, false);
            _('filearchivo_certificadoorigen').addEventListener('change', e => { fn_change_add_archivo(e.currentTarget); }, false);

            _('btn_eliminararchivo_packginlist').addEventListener('click', e => { fn_eliminar_archivo(e.currentTarget); }, false); 
            _('btn_eliminararchivo_declaracionjurada').addEventListener('click', e => { fn_eliminar_archivo(e.currentTarget); }, false); 
            _('btn_eliminararchivo_guiaaerea').addEventListener('click', e => { fn_eliminar_archivo(e.currentTarget); }, false); 
            _('btn_eliminararchivo_certificadoorigen').addEventListener('click', e => { fn_eliminar_archivo(e.currentTarget); }, false); 
            _('btn_add_op').addEventListener('click', fn_ver_seleccionar_ordenpedido, false);
            _('btnGenerarFC_Return').addEventListener('click', fn_return, false);
            _('_cbo_billto_direccion').addEventListener('change', e => { fn_change_billtodireccion(e.currentTarget) }, false);
            _('_cbo_shipto_direccion').addEventListener('change', e => { fn_change_shiptodireccion(e.currentTarget) }, false);

            _('btn_download_packinglist').addEventListener('click', e => { fn_download_file_adjuntos_dataadicional(e.currentTarget) }, false);
            _('btn_download_declaracionjurada').addEventListener('click', e => { fn_download_file_adjuntos_dataadicional(e.currentTarget) }, false);
            _('btn_download_guiaaerea').addEventListener('click', e => { fn_download_file_adjuntos_dataadicional(e.currentTarget) }, false);
            _('btn_download_certificadoorigen').addEventListener('click', e => { fn_download_file_adjuntos_dataadicional(e.currentTarget) }, false);

            $("#txtfechaembaque_fc").datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).on('changeDate', function (e) { }).next().on('click', function () {
                $(this).prev().focus();
            });

            //// PARA EL FITRO DE LA GRILLA
            filter_header();

            //// NOTA: PARA QUE FUNCIONE EL EVENTO KEYDOWN EN UN DIV TIENE QUE ESTAR CONFIGURACO EL TABINDEX = 0; 
            //// Y EL OUTLINE ES OPCIONAL SOLO PARA QUE NO SE MUESTRA LA LINEA CONTORNO
            document.getElementById('panelEncabezado_FacturaClienteFacturacionSample').addEventListener('keydown', handlerkeydown, false);
            document.getElementById('panelEncabezado_FacturaClienteFacturacionSample').addEventListener('keyup', handlerkeyup, false);
        }

        function res_ini(odata) {
            if (odata) {
                let arr_requerimientos = odata.RequerimientosCSV !== '' ? CSVtoJSON(odata.RequerimientosCSV) : [];
                ovariables.lstEstadosFacturacionSample = odata.EstadosFacturacionSampleCSV !== '' ? CSVtoJSON(odata.EstadosFacturacionSampleCSV) : [];

                let arr_proveedor = odata.ProveedoresCSV !== '' ? CSVtoJSON(odata.ProveedoresCSV) : [];
                let arr_tipoembarque = odata.TipoEmbarqueCSV !== '' ? CSVtoJSON(odata.TipoEmbarqueCSV) : [];
                let arr_formaenvio = odata.FormaEnvioCSV !== '' ? CSVtoJSON(odata.FormaEnvioCSV) : [];
                let arr_quienasume = odata.QuienAsumeCSV !== '' ? CSVtoJSON(odata.QuienAsumeCSV) : [];
                let sellerJSON = odata.SellerJSON !== '' ? JSON.parse(odata.SellerJSON) : null;
                let bankJSON = odata.BankJSON !== '' ? JSON.parse(odata.BankJSON) : null;
                let termsJSON = odata.TermsJSON !== '' ? JSON.parse(odata.TermsJSON) : null;
                let originJSON = odata.OriginJSON !== '' ? JSON.parse(odata.OriginJSON) : null;
                let billToJSON = odata.BillToJSON !== '' ? JSON.parse(odata.BillToJSON) : null;
                let consigneeJSON = odata.ConsigneeJSON !== '' ? JSON.parse(odata.ConsigneeJSON) : null;
                let shipmodeJSON = odata.ShipmodeJSON !== '' ? JSON.parse(odata.ShipmodeJSON) : null;
                let otherreferenceJSON = odata.OtherreferenceJSON !== '' ? JSON.parse(odata.OtherreferenceJSON) : null;
                ovariables.lstClienteDireccion = odata.ClienteDireccionCSV !== '' ? CSVtoJSON(odata.ClienteDireccionCSV) : null;

                _('cbo_proveedor_fc').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_proveedor, 'IdProveedor', 'NombreProveedor');
                _('txt_cliente_fc').value = odata.NombreCliente;
                _('cbo_tipoembarque_fc').innerHTML = _comboFromJSON(arr_tipoembarque, 'CodCatalogo', 'NombreCatalogo');
                _('cbo_formaenvio_fc').innerHTML = _comboFromJSON(arr_formaenvio, 'CodCatalogo', 'NombreCatalogo');
                _('cbo_quienasume_flete_fc').innerHTML = _comboFromJSON(arr_quienasume, 'CodCatalogo', 'NombreCatalogo');
                
                _('txta_seller_fc').value = sellerJSON ? sellerJSON.Descripcion : '';
                _('txta_bank_fc').value = bankJSON ? bankJSON.Descripcion : '';
                _('txta_terms_fc').value = termsJSON ? termsJSON.Descripcion : '';
                _('txta_origininvoice_fc').value = originJSON ? originJSON.Descripcion : '';
                _('txta_billto_fc').value = billToJSON ? billToJSON.Descripcion : '';
                _('txta_consignee_fc').value = consigneeJSON ? consigneeJSON.Descripcion : '';
                _('txta_shipmode_fc').value = shipmodeJSON ? shipmodeJSON.Descripcion : '';
                _('txta_otherreference_fc').value = otherreferenceJSON ? otherreferenceJSON.Descripcion : '';
                //// BILL TO
                let arr_clientedireccion_billto = ovariables.lstClienteDireccion.filter(x => x.NombreTipoDireccion.toLowerCase() === 'bill to');
                if (arr_clientedireccion_billto) {
                    _('_cbo_billto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_clientedireccion_billto, 'IdClienteDireccion', 'DireccionConcatenada');
                } else {
                    _('_cbo_billto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' });
                }
                //// SHIP TO
                let arr_clientedireccion_shipto = ovariables.lstClienteDireccion.filter(x => x.NombreTipoDireccion.toLowerCase() === 'ship to');
                if (arr_clientedireccion_shipto) {
                    _('_cbo_shipto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_clientedireccion_shipto, 'IdClienteDireccion', 'DireccionConcatenada');
                } else {
                    _('_cbo_shipto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' });
                }

                //// IMPLEMENTAR FILTRO BUSCADOR
                oUtil.adata = arr_requerimientos;
                oUtil.adataresult = oUtil.adata;
                pintar_tabla_requerimiento_ini(arr_requerimientos);
            }
        }

        function fn_change_billtodireccion(o) {
            let filter = ovariables.lstClienteDireccion.filter(x => x.IdClienteDireccion === o.value);
            let cadena_direccion = '';
            if (filter.length > 0) {
                cadena_direccion = `Bill To:\n\n${filter[0].Linea1}\n${filter[0].Linea2}\n${filter[0].Linea3}`;
            }

            _('txta_billto_fc').value = cadena_direccion;
        }

        function fn_change_shiptodireccion(o) {
            let filter = ovariables.lstClienteDireccion.filter(x => x.IdClienteDireccion === o.value);
            let cadena_direccion = '';
            if (filter.length > 0) {
                cadena_direccion = `Condignee:\n\n${filter[0].Linea1}\n${filter[0].Linea2}\n${filter[0].Linea3}`;
            }

            _('txta_consignee_fc').value = cadena_direccion;
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
                        $("#modal__FacturaClienteFacturacionSample").modal('hide');
                    }
            });
        }

        function res_ini_edit(odata) {
            if (odata) {
                let arr_requerimientos = odata.RequerimientosCSV !== '' ? CSVtoJSON(odata.RequerimientosCSV) : [];
                let arr_facturaclientedetalle = odata.FacturaClienteDetalleCSV !== '' ? CSVtoJSON(odata.FacturaClienteDetalleCSV) : [];
                let arr_ordenpedido = odata.ListaFacturaCliente_OrdenPedidoCSV !== '' ? CSVtoJSON(odata.ListaFacturaCliente_OrdenPedidoCSV) : [];
                ovariables.lstEstadosFacturacionSample = odata.EstadosFacturacionSampleCSV !== '' ? CSVtoJSON(odata.EstadosFacturacionSampleCSV) : [];

                let arr_proveedor = odata.ProveedoresCSV !== '' ? CSVtoJSON(odata.ProveedoresCSV) : [];
                let arr_tipoembarque = odata.TipoEmbarqueCSV !== '' ? CSVtoJSON(odata.TipoEmbarqueCSV) : [];
                let arr_formaenvio = odata.FormaEnvioCSV !== '' ? CSVtoJSON(odata.FormaEnvioCSV) : [];
                let arr_quienasume = odata.QuienAsumeCSV !== '' ? CSVtoJSON(odata.QuienAsumeCSV) : [];
                ovariables.lstClienteDireccion = odata.ClienteDireccionCSV !== '' ? CSVtoJSON(odata.ClienteDireccionCSV) : null;
                _('cbo_proveedor_fc').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_proveedor, 'IdProveedor', 'NombreProveedor');
                _('cbo_proveedor_fc').value = odata.IdProveedor;

                _('txt_cliente_fc').value = odata.NombreCliente;
                _('cbo_tipoembarque_fc').innerHTML = _comboFromJSON(arr_tipoembarque, 'CodCatalogo', 'NombreCatalogo');
                _('cbo_tipoembarque_fc').value = odata.IdCatalogo_Boarding;
                _('cbo_formaenvio_fc').innerHTML = _comboFromJSON(arr_formaenvio, 'CodCatalogo', 'NombreCatalogo');
                _('cbo_formaenvio_fc').value = odata.IdCatalogo_FormaEnvio;
                _('cbo_quienasume_flete_fc').innerHTML = _comboFromJSON(arr_quienasume, 'CodCatalogo', 'NombreCatalogo');
                _('cbo_quienasume_flete_fc').value = odata.IdCatalogo_QuienAsumeFlete;
                _('txtfechaembaque_fc').value = odata.BoardingDate;
                _('txt_numeroguia_fc').value = odata.NumeroGuia;
                _('txta_comentario_fc').value = odata.Comentario;
                //// ARCHIVOS ADJUNTOS
                let txtarchivo_packinglist = _('txt_archivo_packinglist');
                txtarchivo_packinglist.value = odata.NombreArchivoPackingListOriginal;
                txtarchivo_packinglist.setAttribute('data-nombrearchivogenerado', odata.NombreArchivoPackingListGenerado)
                _('btn_download_packinglist').classList.remove('hide');

                let txtarchivo_guiaaerea = _('txt_ArchivoGuiaAerea');
                txtarchivo_guiaaerea.value = odata.NombreArchivoGuiaAereaOriginal;
                txtarchivo_guiaaerea.setAttribute('data-nombrearchivogenerado', odata.NombreArchivoGuiaAereaGenerado);
                _('btn_download_guiaaerea').classList.remove('hide');

                let txtarchivo_declaracionjurada = _('txt_archivo_declaracion_jurada');
                txtarchivo_declaracionjurada.value = odata.NombreArchivoDeclaracionJuradaOriginal;
                txtarchivo_declaracionjurada.setAttribute('data-nombrearchivogenerado', odata.NombreArchivoDeclaracionJuradaGenerado);
                _('btn_download_declaracionjurada').classList.remove('hide');

                let txtaarchivo_certificadoorigen = _('txt_archivo_cerficadoorigen');
                txtaarchivo_certificadoorigen.value = odata.NombreArchivoCerfiticadoOrigenOriginal;
                txtaarchivo_certificadoorigen.setAttribute('data-nombrearchivogenerado', odata.NombreArchivoCerfiticadoOrigenGenerado);
                _('btn_download_certificadoorigen').classList.remove('hide');
                //// HEADERS INVOICE
                //// BILL TO
                let arr_clientedireccion_billto = ovariables.lstClienteDireccion.filter(x => x.NombreTipoDireccion.toLowerCase() === 'bill to');
                if (arr_clientedireccion_billto) {
                    _('_cbo_billto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_clientedireccion_billto, 'IdClienteDireccion', 'DireccionConcatenada');
                } else {
                    _('_cbo_billto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' });
                }
                //// SHIP TO
                let arr_clientedireccion_shipto = ovariables.lstClienteDireccion.filter(x => x.NombreTipoDireccion.toLowerCase() === 'ship to');
                if (arr_clientedireccion_shipto) {
                    _('_cbo_shipto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr_clientedireccion_shipto, 'IdClienteDireccion', 'DireccionConcatenada');
                } else {
                    _('_cbo_shipto_direccion').innerHTML = _comboItem({ value: '', text: 'Select' });
                }

                _('txta_seller_fc').value = odata.CabeceraFacturaClienteSeller;
                _('txta_bank_fc').value = odata.CabeceraFacturaClienteBank;
                _('txta_terms_fc').value = odata.CabeceraFacturaClienteTerms;
                _('txta_origininvoice_fc').value = odata.CabeceraFacturaClienteOrigin;
                _('txta_billto_fc').value = odata.CabeceraFacturaClienteBillTo;
                _('txta_consignee_fc').value = odata.CabeceraFacturaClienteConsignee;
                _('txta_shipmode_fc').value = odata.CabeceraFacturaClienteShipMode;
                _('txta_otherreference_fc').value = odata.CabeceraFacturaClienteOtherReference;
                _('_cbo_billto_direccion').value = odata.IdClienteDireccion_BillTo;
                _('_cbo_shipto_direccion').value = odata.IdClienteDireccion_ShipTo;

                //// IMPLEMENTAR FILTRO BUSCADOR
                oUtil.adata = arr_requerimientos;
                oUtil.adataresult = oUtil.adata;
                pintar_tabla_requerimiento_ini(arr_requerimientos);

                llenar_tbl_detallerequerimiento_ini_edit(arr_facturaclientedetalle);
                fn_pintar_tbl_ordenpedido_seleccionado_ini_edit(arr_ordenpedido);
                fn_disabled_inputs_ini_edit();
                //// OCULTAR BOTONES
                _('btnGenerarFC_Previous').classList.add('hide');
                _('btnGenerarFC_Next').classList.add('hide');
                _('btnGenerarFC_Save').disabled = false;
            }
        }

        function fn_disabled_inputs_ini_edit() {
            Array.from(_('panelEncabezado_FacturaClienteFacturacionSample').getElementsByClassName('_cls_disabled_edit'))
                .forEach(x => {
                    x.disabled = true;
                });
        }

        function fn_ver_seleccionar_ordenpedido() {
            let idproveedor = _('cbo_proveedor_fc').value;
            let cadena_idordenpedido = Array.from(_('tbody_ordenpedido_fc').rows).map(x => {
                let datapar = x.getAttribute('data-par');
                let idordenpedido = _par(datapar, 'idordenpedido');
                return idordenpedido;
            }).join('¬');
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleOrdenPedido/_SeleccionarOrdenPedido',
                idmodal: '_SeleccionarOrdenPedido',
                title: 'Select Purchase Order',
                paremeter: `idprograma:${ovariables.idprograma},idcliente:${ovariables.idcliente},idproveedor:${idproveedor},cadena_idordenpedido:${cadena_idordenpedido}`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_eliminar_archivo(o) {
            let data_file = o.getAttribute('data-file');
            switch (data_file) {
                case 'packinglist':
                    _('txt_archivo_packinglist').value = "";
                    _('filearchivo_packinglist').value = "";
                    ovariables.actualizararchivo_packinglist = 0;
                    break;
                case 'guiaaerea':
                    _('txt_ArchivoGuiaAerea').value = "";
                    _('filearchivo_guiaaerea').value = "";
                    ovariables.actualizararchivo_guiaaerea = 0;
                    break;
                case 'declaracionjurada':
                    _('txt_archivo_declaracion_jurada').value = "";
                    _('filearchivo_declaracion_jurada').value = "";
                    ovariables.actualizararchivo_declaracionjurada = 0;
                    break;
                case 'certificadoorigen':
                    _('txt_archivo_cerficadoorigen').value = "";
                    _('filearchivo_certificadoorigen').value = "";
                    ovariables.actualizararchivo_certificadoorigen = 0;
                    break;

            }
        }

        function fn_download_file_adjuntos_dataadicional(o) {
            let data_file = o.getAttribute('data-file');
            let url = urlBase() + 'Requerimiento/FacturacionSampleFacturaCliente/DownlaodFileAdjuntoDataAdcional';
            let nombre_archivo_original = '';
            let nombre_archivo_generado = '';
            switch (data_file) {
                case 'packinglist':
                    let txtpackinglist = _('txt_archivo_packinglist');
                    if (txtpackinglist.value !== '') {
                        nombre_archivo_original = txtpackinglist.value;
                        nombre_archivo_generado = txtpackinglist.getAttribute('data-nombrearchivogenerado');
                        let linkpl = document.createElement('a');
                        linkpl.href = url + `?NombreArchivoOriginal=${nombre_archivo_original}&NombreArchivoGenerado=${nombre_archivo_generado}`;
                        document.body.appendChild(linkpl);
                        linkpl.click();
                        document.body.removeChild(linkpl);
                        delete linkpl;
                    } 
                    break;
                case 'guiaaerea':
                    let txtguiaaerea = _('txt_ArchivoGuiaAerea');
                    if (txtguiaaerea.value !== '') {
                        nombre_archivo_original = txtguiaaerea.value;
                        nombre_archivo_generado = txtguiaaerea.getAttribute('data-nombrearchivogenerado');
                        let linkga = document.createElement('a');
                        linkga.href = url + `?NombreArchivoOriginal=${nombre_archivo_original}&NombreArchivoGenerado=${nombre_archivo_generado}`;
                        document.body.appendChild(linkga);
                        linkga.click();
                        document.body.removeChild(linkga);
                        delete linkga;
                    } 
                    break;
                case 'declaracionjurada':
                    let txtdeclaracionjurada = _('txt_archivo_declaracion_jurada');
                    if (txtdeclaracionjurada.value !== '') {
                        nombre_archivo_original = txtdeclaracionjurada.value;
                        nombre_archivo_generado = txtdeclaracionjurada.getAttribute('data-nombrearchivogenerado');
                        let linkdj = document.createElement('a');
                        linkdj.href = url + `?NombreArchivoOriginal=${nombre_archivo_original}&NombreArchivoGenerado=${nombre_archivo_generado}`;
                        document.body.appendChild(linkdj);
                        linkdj.click();
                        document.body.removeChild(linkdj);
                        delete linkdj;
                    } 
                    break;
                case 'certificadoorigen':
                    let txtcertificadoorigen = _('txt_archivo_cerficadoorigen');
                    if (txtcertificadoorigen.value !== '') {
                        nombre_archivo_original = txtcertificadoorigen.value;
                        nombre_archivo_generado = txtcertificadoorigen.getAttribute('data-nombrearchivogenerado');
                        let linkco = document.createElement('a');
                        linkco.href = url + `?NombreArchivoOriginal=${nombre_archivo_original}&NombreArchivoGenerado=${nombre_archivo_generado}`;
                        document.body.appendChild(linkco);
                        linkco.click();
                        document.body.removeChild(linkco);
                        delete linkco;
                    } 
                    break; 
            }
        }

        function fn_change_add_archivo(o) {
            let data_file = o.getAttribute('data-file');
            let nombre_archivo = o.files[0].name;
            switch (data_file) {
                case 'packinglist':
                    _('txt_archivo_packinglist').value = nombre_archivo;
                    ovariables.actualizararchivo_packinglist = 1;
                    break;
                case 'guiaaerea':
                    _('txt_ArchivoGuiaAerea').value = nombre_archivo;
                    ovariables.actualizararchivo_guiaaerea = 1;
                    break;
                case 'declaracionjurada':
                    _('txt_archivo_declaracion_jurada').value = nombre_archivo;
                    ovariables.actualizararchivo_declaracionjurada = 1;
                    break;
                case 'certificadoorigen':
                    _('txt_archivo_cerficadoorigen').value = nombre_archivo;
                    ovariables.actualizararchivo_certificadoorigen = 1;
                    break;
                
            }
        }

        function fn_actualizarprecio() {
            let txtprecio = _('txt_updateprecio_fc');
            let precio = txtprecio.value;

            if (precio === '' || precio === 0) {
                _swal({ mensaje: 'Enter the price', estado: 'error' }, 'Validation');
                txtprecio.focus();
                return false;
            }

            //Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('_cls_txt_precio_factcliente_fc'))
            //    .forEach(x => {
            //        x.value = precio;
            //    });

            let totalfilas = _('tbody_RequerimientoDetalle_fc').rows.length;
            if (totalfilas > 1) {
                let total_selected = Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('_cls_row_selected')).length;
                if (total_selected <= 0) {
                    _swal({ mensaje: 'Select at least one row', estado: 'error' }, 'Validation');
                    return false;
                }
            }

            if (totalfilas > 1) {
                Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('_cls_row_selected'))
                    .forEach(x => {
                        x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0].value = precio;
                    });
            } else {
                _('tbody_RequerimientoDetalle_fc').rows[0].getElementsByClassName('_cls_txt_precio_factcliente_fc')[0].value = precio;
            }

            fn_calcular_total_factura_load();
            txtprecio.value = '';
            fn_limpiar_variables_shift_ctrl();
        }

        function handlerAccionTblArchivos_fc_add(indice) {
            let tbody = _('tbody_adjuntararchivo_fc');
            tbody.getElementsByClassName('_downloadfile')[0].addEventListener('click', function (e) { fn_download_archivo(e.currentTarget); }, false);
            tbody.getElementsByClassName('_deletefile')[0].addEventListener('click', function (e) { fn_delete_temporal_archivo_adjunto(e.currentTarget); }, false);
        }

        function fn_delete_temporal_archivo_adjunto(o) {
            let fila = o.parentNode.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function fn_download_archivo(o) {
            let fila = o.parentNode.parentNode.parentNode;

            let inputfile = fila.getElementsByClassName('_cls_file_fc')[0];
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
            let ul_tag = _('ul_tabs_generarfacturacliente').getElementsByClassName('active')[0].getAttribute('data-tag');
            let li_requerimiento = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_requerimientomuestra')[0];
            let li_detalle = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_detalle')[0];
            let li_datosadicionales = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_datosadicionales')[0];
            let li_headersinvoice = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_headersinvoice')[0];

            // los tab content
            let tab_requerimiento = d.getElementById('tab-samplelist_fc');
            let tab_detalle = d.getElementById('tab-facturaclientedetalle_fc');
            let tab_datosadicionales = d.getElementById('tab-datosadicionales_fc');
            let tab_headersinvoice = d.getElementById('tab-headers_invoice_fc');

            _('btnGenerarFC_Previous').disabled = false;
            switch (ul_tag) {
                case 'fc_requerimientomuestra':

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
                case 'fc_detalle':
                    //// VALIDAR ANTES DE CONTINUAR
                    pasavalidacion = fn_validar_next(ul_tag);
                    if (!pasavalidacion) {
                        return false;
                    }

                    li_detalle.classList.remove('active');
                    tab_detalle.classList.remove('active');
                    li_datosadicionales.classList.add('active');
                    tab_datosadicionales.classList.add('active');
                    break;
                case 'fc_datosadicionales':
                    li_datosadicionales.classList.remove('active');
                    tab_datosadicionales.classList.remove('active');
                    li_headersinvoice.classList.add('active');
                    tab_headersinvoice.classList.add('active');
                    o.disabled = true;
                    _('btnGenerarFC_Save').disabled = false;
                    break;
                default:
            }
        }

        function fn_validar_next(nametab) {
            let pasavalidacion = true;
            let mensaje = '';
            //// SETEAR A DEAFAULT
            Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('has-error'))
                .forEach(x => {
                    x.classList.add('hide');
                });
            switch (nametab) {
                case 'fc_requerimientomuestra':
                    //// VALIDAR ANTES DE CONTINUAR
                    let idproveedor = _('cbo_proveedor_fc').value;
                    if (idproveedor === '') {
                        pasavalidacion = false;
                        mensaje += '- Need to select the provider \n';
                        _('div_grupo_proveedor_fc').classList.add('has-error');
                    }
                    let listacadena_reqmuestra_seleccionados = fn_getlistacadena_requerimientosmuestra_seleccionados();
                    if (listacadena_reqmuestra_seleccionados === '') {
                        pasavalidacion = false;
                        mensaje += '- At least one sample needs to be selected \n';
                        
                    }
                    break;
                case 'fc_detalle':
                    let arr_rows_detalle = Array.from(_('tbody_RequerimientoDetalle_fc').rows);
                    if (arr_rows_detalle.length <= 0) {
                        pasavalidacion = false;
                        mensaje += '- At least one sample needs to be selected \n';
                    } else {
                        arr_rows_detalle.forEach((x, indice) => {
                            let txtcolor = x.getElementsByClassName('_cls_txt_clientecolor')[0];
                            let txtq_muestras = x.getElementsByClassName('_cls_txt_q_afacturar_fc')[0];
                            let txtprecio_muestra = x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0];
                            let chk_qcm_se_factura = x.getElementsByClassName('_cls_chk_cm_se_factura_fc')[0];
                            let txtqcm_afacturar = x.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0];
                            let txtprecio_cm_afacturar = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0];

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
                case 'fc_datosadicionales':
                    
                    break;
                
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Validation');
            }

            return pasavalidacion;
        }

        function fn_getlistacadena_requerimientosmuestra_seleccionados() {
            let arr = Array.from(_('tbody_requerimientosample_fc').getElementsByClassName('_cls_rb_select_fc'))
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
            _Get('Requerimiento/FacturacionSampleFacturaCliente/GetRequerimientoMuestraDetalle_JSON?listaRequerimientosSeleccionados=' + listaRequerimientosSeleccionados)
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
                                        <span class='has-error _cls_spn_color_error hide'>The color needs to be entered</span>
                                    </td>
                                    <td>${x.NombreClienteTalla}</td>
                                    <td class='_cls_td_cantidad_requerimiento'>${x.Cantidad}</td>
                                    <td class='text-center'>
                                        <div class='checkbox checkbox-green'>
                                            <input type='checkbox' id='chk_cm_se_factura${indice}' class='_cls_chk_cm_se_factura_fc' />
                                            <label for='chk_cm_se_factura${indice}'></label>
                                        </div>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_q_afacturar_fc' value='${x.CantidadMuestrasAFacturar}' onkeypress="return DigitosEnteros(event, this)" />
                                        <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_factcliente_fc' value='${x.PrecioEstilo}' onkeypress="return DigitimosDosDecimales(event, this)" />
                                        <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_qcm_se_factura_fc' value='${x.CantidadCMAFacturar}' disabled onkeypress="return DigitosEnteros(event, this)" />
                                        <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_cm_factcliente_fc' value='${x.PrecioEstiloCM}' disabled onkeypress="return DigitimosDosDecimales(event, this)" />
                                        <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                                    </td>
                                </tr>
                            `;
                        }).join('');

                        _('tbody_RequerimientoDetalle_fc').innerHTML = html;
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
                                        <span class='has-error _cls_spn_color_error hide'>The color needs to be entered</span>
                                    </td>
                                    <td>${x.NombreClienteTalla}</td>
                                    <td class='_cls_td_cantidad_requerimiento'>${x.Cantidad}</td>
                                    <td class='text-center'>
                                        <div class='checkbox checkbox-green'>
                                            <input type='checkbox' id='chk_cm_se_factura${indice}' class='_cls_chk_cm_se_factura_fc' disabled />
                                            <label for='chk_cm_se_factura${indice}'></label>
                                        </div>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_q_afacturar_fc' value='${x.CantidadMuestrasAFacturar}' onkeypress="return DigitosEnteros(event, this)" disabled />
                                        <span class='has-error _cls_spn_q_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_factcliente_fc' value='${x.PrecioEstilo}' onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                        <span class='has-error _cls_spn_precio_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_qcm_se_factura_fc' value='${x.CantidadCMAFacturar}' disabled onkeypress="return DigitosEnteros(event, this)" disabled />
                                        <span class='has-error _cls_spn_qcm_afacturar_error hide'></span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control _cls_txt_precio_cm_factcliente_fc' value='${x.PrecioEstiloCM}' disabled onkeypress="return DigitimosDosDecimales(event, this)" disabled />
                                        <span class='has-error _cls_spn_precio_cm_afacturar_error hide'></span>
                                    </td>
                                </tr>
                            `;
                }).join('');

                _('tbody_RequerimientoDetalle_fc').innerHTML = html;
                fn_calcular_total_factura_load();
                fn_handler_tbl_requerimientodetalle();
            }
        }

        function fn_handler_tbl_requerimientodetalle() {
            Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('_cls_chk_cm_se_factura_fc'))
                .forEach(x => {
                    x.addEventListener('click', (e) => { fn_checked_contramuestra_se_factura(e.currentTarget); }, false);
                    
                });

            Array.from(_('tbody_RequerimientoDetalle_fc').rows)
                .forEach(x => {
                    x.getElementsByClassName('_cls_txt_q_afacturar_fc')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_chk_cm_se_factura_fc')[0].addEventListener('change', e => { fn_change_inputtext_tbl_requerimientodetalle(e.currentTarget); }, false);
                    x.addEventListener('mousedown', handlermousedown, false);
                });
            
        }

        function fn_change_inputtext_tbl_requerimientodetalle(o) {
            fn_calcular_total_factura_load();
        }

        function fn_checked_contramuestra_se_factura(o) {
            let fila = o.parentNode.parentNode.parentNode;
            if (o.checked) {
                fila.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0].disabled = false;
                fila.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0].disabled = false;
            } else {
                fila.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0].disabled = true;
                fila.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0].disabled = true;
            }
        }

        function fn_previous_tab(o) {
            let ul_tag = _('ul_tabs_generarfacturacliente').getElementsByClassName('active')[0].getAttribute('data-tag');
            let li_requerimiento = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_requerimientomuestra')[0];
            let li_detalle = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_detalle')[0];
            let li_datosadicionales = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_datosadicionales')[0];
            let li_headersinvoice = _('ul_tabs_generarfacturacliente').getElementsByClassName('cls_li_fc_headersinvoice')[0];

            // los tab content
            let tab_requerimiento = d.getElementById('tab-samplelist_fc');
            let tab_detalle = d.getElementById('tab-facturaclientedetalle_fc');
            let tab_datosadicionales = d.getElementById('tab-datosadicionales_fc');
            let tab_headersinvoice = d.getElementById('tab-headers_invoice_fc');

            _('btnGenerarFC_Next').disabled = false;
            switch (ul_tag) {
                case 'fc_requerimientomuestra':

                    break;
                case 'fc_detalle':
                    li_detalle.classList.remove('active');
                    tab_detalle.classList.remove('active');
                    li_requerimiento.classList.add('active');
                    tab_requerimiento.classList.add('active');
                    o.disabled = true;
                    break;
                case 'fc_datosadicionales':
                    li_datosadicionales.classList.remove('active');
                    tab_datosadicionales.classList.remove('active');
                    li_detalle.classList.add('active');
                    tab_detalle.classList.add('active');
                    break;
                case 'fc_datosadicionales':
                    li_datosadicionales.classList.remove('active');
                    tab_datosadicionales.classList.remove('active');
                    li_detalle.classList.add('active');
                    tab_detalle.classList.add('active');
                    break;
                case 'fc_headersinvoice':
                    li_headersinvoice.classList.remove('active');
                    tab_headersinvoice.classList.remove('active');
                    li_datosadicionales.classList.add('active');
                    tab_datosadicionales.classList.add('active');

                    break;
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
                                    <input type='checkbox' id='rb_select_${indice}' class='_cls_rb_select_fc' ${cadena_checked_select} />
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
                            <td>
                                <select class='form-control _cls_cbo_estadofacturacion' disabled></select>
                            </td>
                        </tr>
                        
                    `;
                }).join('');

                _('tbody_requerimientosample_fc').innerHTML = html;
                fn_handler_tbl_requerimiento_ini();
                fn_actualizarinputs_tbl_requerimiento_ini();
            }
        }

        function fn_handler_tbl_requerimiento_ini() {
            let arr_fila = Array.from(_('tbody_requerimientosample_fc').rows);
            arr_fila.forEach(x => {
                x.getElementsByClassName('_cls_rb_select_fc')[0].addEventListener('click', e => { fn_chk_change_select_requerimiento(e.currentTarget) }, false);
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
            let arr_fila = Array.from(_('tbody_requerimientosample_fc').rows);
            arr_fila.forEach(x => {
                let datapar = x.getAttribute('data-par');
                let idestadofacturacion = _par(datapar, 'idcatalogo_estadofacturacion');
                let cbo_estadofacturacion = x.getElementsByClassName('_cls_cbo_estadofacturacion')[0];
                cbo_estadofacturacion.innerHTML = _comboItem({ value: '', text: '-' }) + _comboFromJSON(ovariables.lstEstadosFacturacionSample, 'CodCatalogo', 'NombreCatalogo');
                cbo_estadofacturacion.value = idestadofacturacion;
            });
        }

        function fn_SaveNewFacturaCliente() {
            
            let validacion = fn_ValidarAntesGrabar();
            let req = _required({ clase: '_enty', id: 'panelEncabezado_FacturaClienteFacturacionSample' });
            if (!validacion || !req) {
                return false;
            }

            let form = new FormData();
            let ordenPedidoJson = _getParameter({ clase: '_enty', id: 'panelEncabezado_FacturaClienteFacturacionSample' });
            ordenPedidoJson["IdClienteDireccion_BillTo"] = _('_cbo_billto_direccion').value === '' ? 0 : ordenPedidoJson["IdClienteDireccion_BillTo"];
            ordenPedidoJson["IdClienteDireccion_ShipTo"] = _('_cbo_shipto_direccion').value === '' ? 0 : ordenPedidoJson["IdClienteDireccion_ShipTo"];
            let arr_FC_detalle = fn_GetListaFacturaClienteDetalle();
            
            let arr_colores_modificados = fn_GetListaColores_a_Mofificar();

            form.append('FacturaClienteDetalleJSON', JSON.stringify(arr_FC_detalle));
            form.append('ListaColoresModificadosJSON', JSON.stringify(arr_colores_modificados));
            //// AGREGAR POST PARA LOS ARCHIVOS
            if (ovariables.actualizararchivo_certificadoorigen === 1) {
                ordenPedidoJson['Actualizar_File_CertificadoOrigen'] = 1
                form.append('File_CertificadoOrigen', _('filearchivo_certificadoorigen').files[0]);
            }
            if (ovariables.actualizararchivo_declaracionjurada === 1) {
                ordenPedidoJson['Actualizar_File_DeclaracionJurada'] = 1
                form.append('File_DeclaracionJurada', _('filearchivo_declaracion_jurada').files[0]);
            }
            if (ovariables.actualizararchivo_guiaaerea === 1) {
                ordenPedidoJson['Actualizar_File_GuiaAerea'] = 1
                form.append('File_GuiaAerea', _('filearchivo_guiaaerea').files[0]);
            }
            if (ovariables.actualizararchivo_packinglist === 1) {
                ordenPedidoJson['Actualizar_File_PackingList'] = 1
                form.append('File_Packinglist', _('filearchivo_packinglist').files[0]);
            }

            /// LISTA CADENA DE ORDENES DE PEDIDOS SELECCIONADOS
            ordenPedidoJson['CadenaListaOrdenPedido'] = fn_get_cadenalista_ordenpedido();

            form.append('FacturaClienteJSON', JSON.stringify(ordenPedidoJson));
            
            _Post('Requerimiento/FacturacionSampleFacturaCliente/SaveNewFacturaCliente_JSON', form, true)
                .then((rpta) => {
                    let orpta = JSON.parse(rpta);
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                    if (orpta.estado === 'success') {
                        $("#modal__FacturaClienteFacturacionSample").modal('hide');
                        fn_despuesgrabar();
                    }
                });
        }

        function fn_SaveEditFacturaCliente() {

            let validacion = fn_ValidarAntesGrabar();
            let req = _required({ clase: '_enty', id: 'panelEncabezado_FacturaClienteFacturacionSample' });
            if (!validacion || !req) {
                return false;
            }

            let form = new FormData();
            let ordenPedidoJson = _getParameter({ clase: '_enty', id: 'panelEncabezado_FacturaClienteFacturacionSample' });
            ordenPedidoJson["IdClienteDireccion_BillTo"] = _('_cbo_billto_direccion').value === '' ? 0 : ordenPedidoJson["IdClienteDireccion_BillTo"];
            ordenPedidoJson["IdClienteDireccion_ShipTo"] = _('_cbo_shipto_direccion').value === '' ? 0 : ordenPedidoJson["IdClienteDireccion_ShipTo"];
            let arr_listaordenpedido = fn_get_cadenalista_ordenpedido();
            //let arr_FC_detalle = fn_GetListaFacturaClienteDetalle();
            //let arr_colores_modificados = fn_GetListaColores_a_Mofificar();

            form.append('FacturaClienteDetalleJSON', ''); //// JSON.stringify(arr_FC_detalle)
            form.append('ListaColoresModificadosJSON', ''); //// JSON.stringify(arr_colores_modificados)
            //// AGREGAR POST PARA LOS ARCHIVOS
            if (ovariables.actualizararchivo_certificadoorigen === 1) {
                ordenPedidoJson['Actualizar_File_CertificadoOrigen'] = 1
                form.append('File_CertificadoOrigen', _('filearchivo_certificadoorigen').files[0]);
            }
            if (ovariables.actualizararchivo_declaracionjurada === 1) {
                ordenPedidoJson['Actualizar_File_DeclaracionJurada'] = 1
                form.append('File_DeclaracionJurada', _('filearchivo_declaracion_jurada').files[0]);
            }
            if (ovariables.actualizararchivo_guiaaerea === 1) {
                ordenPedidoJson['Actualizar_File_GuiaAerea'] = 1
                form.append('File_GuiaAerea', _('filearchivo_guiaaerea').files[0]);
            }
            if (ovariables.actualizararchivo_packinglist === 1) {
                ordenPedidoJson['Actualizar_File_PackingList'] = 1
                form.append('File_Packinglist', _('filearchivo_packinglist').files[0]);
            }

            /// LISTA CADENA DE ORDENES DE PEDIDOS SELECCIONADOS
            //ordenPedidoJson['CadenaListaOrdenPedido'] = fn_get_cadenalista_ordenpedido();
            form.append('FacturaClienteJSON', JSON.stringify(ordenPedidoJson));
            //// PARA EDITAR DEVUELVO ARRAY Y NO CADENA
            form.append('ListaOrdenesPedidosJSON', JSON.stringify(arr_listaordenpedido));
            
            _Post('Requerimiento/FacturacionSampleFacturaCliente/SaveEditFacturaCliente_JSON', form, true)
                .then((rpta) => {
                    let orpta = JSON.parse(rpta);
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                    if (orpta.estado === 'success') {
                        $("#modal__FacturaClienteFacturacionSample").modal('hide');
                        fn_despuesgrabar();
                    }
                });
        }

        function fn_get_cadenalista_ordenpedido() {
            let cadenalista = '';
            if (ovariables.accion === 'new') {
                //// DEVUELVE CADENA
                cadenalista = Array.from(_('tbody_ordenpedido_fc').rows)
                    .map(x => {
                        let datapar = x.getAttribute('data-par');
                        let idordenpedido = _par(datapar, 'idordenpedido');
                        return idordenpedido;
                    }).join(',');
            } else {
                //// DEVUELVE ARRAY
                cadenalista = Array.from(_('tbody_ordenpedido_fc').rows)
                    .map(x => {
                        let datapar = x.getAttribute('data-par');
                        let idordenpedido = _par(datapar, 'idordenpedido');
                        let idfacturaclienteordenpedido = _par(datapar, 'idfacturaclienteordenpedido');
                        
                        return { IdFacturaClienteOrdenPedido: idfacturaclienteordenpedido, IdOrdenPedido: idordenpedido };
                    });
            }
            
            return cadenalista;
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
                if (x.classList.value.indexOf('_cls_li_inicial_facturaclientedetalle') >= 0) {
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
                if (x.classList.value.indexOf('_cls_div_tab_inicial_principal_facturaclientedetalle') >= 0) {
                    x.classList.add('active');
                    return true;
                }
            });
        }

        function fn_GetListaColores_a_Mofificar() {
            let arr = Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('_cls_txt_clientecolor'))
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
            let arr_rows_detalle = Array.from(_('tbody_RequerimientoDetalle_fc').rows);

            let cboproveedor = _('cbo_proveedor_fc');
            let valor_proveedor = cboproveedor.value;
            let div_grupo_proveedor = _('div_grupo_proveedor_fc');
            if (valor_proveedor === '') {
                pasavalidacion = false;
                mensaje += '- Falta seleccionar el proveedor. \n'
            }

            let totalfilas_detalle = arr_rows_detalle.length;
            if (totalfilas_detalle === 0) {
                pasavalidacion = false;
                pasavalidacion_totalfilas = false;
                mensaje += '- Missing the detail \n'
            }

            //// SETEAR A DEAFAULT
            Array.from(_('tbody_RequerimientoDetalle_fc').getElementsByClassName('has-error'))
                .forEach(x => {
                    x.classList.add('hide');
                });

            if (pasavalidacion_totalfilas) {
                arr_rows_detalle.forEach((x, indice) => {
                    let txtcolor = x.getElementsByClassName('_cls_txt_clientecolor')[0];
                    let txtq_muestras = x.getElementsByClassName('_cls_txt_q_afacturar_fc')[0];
                    let txtprecio_muestra = x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0];
                    let chk_qcm_se_factura = x.getElementsByClassName('_cls_chk_cm_se_factura_fc')[0];
                    let txtqcm_afacturar = x.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0];
                    let txtprecio_cm_afacturar = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0];
                    let cantidad_requerimiento = parseInt(x.getElementsByClassName('_cls_td_cantidad_requerimiento')[0].innerText);
                    let datapar = x.getAttribute('data-par');
                    let cantidad_cm_requerida = _par(datapar, 'cantidadcm');

                    if (txtcolor.value.trim() === '') {
                        pasavalidacion = false;
                        let spn_color_error = x.getElementsByClassName('_cls_spn_color_error')[0];
                        spn_color_error.classList.remove('hide');
                        mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the color \n';
                    }

                    if (chk_qcm_se_factura.checked) {
                        if ((txtq_muestras.value === '' || txtq_muestras.value === '0') && (txtqcm_afacturar.value === '' || txtqcm_afacturar.value === '0')) {
                            pasavalidacion = false;
                            let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                            spn_error_q_muestras_afacturar.classList.remove('hide');
                            spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {  //// EN ESTE BLOQUE ME PRECUPO QUE LA CANTIDAD DE MUESTRA A FACTURAR NO SEA MAYOR 
                            //// A LA CANTIDAD REQUERIDA
                            if (parseInt(txtq_muestras.value) > parseInt(cantidad_requerimiento)) {
                                pasavalidacion = false;
                                let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
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
                    } else {
                        if (txtq_muestras.value === '' || txtq_muestras.value === '0') {
                            pasavalidacion = false;
                            let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
                            spn_error_q_muestras_afacturar.classList.remove('hide');
                            spn_error_q_muestras_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {
                            if (parseInt(txtq_muestras.value) > parseInt(cantidad_requerimiento)) {
                                pasavalidacion = false;
                                let spn_error_q_muestras_afacturar = x.getElementsByClassName('_cls_spn_q_afacturar_error')[0];
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
                    }
                    

                    if (chk_qcm_se_factura.checked) {
                        if ((txtqcm_afacturar.value === '' || txtqcm_afacturar.value === '0') && (txtq_muestras.value === '' || txtq_muestras.value === '0')) {
                            pasavalidacion = false;
                            let spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                            spn_error_qcm_afacturar.classList.remove('hide');
                            spn_error_qcm_afacturar.innerText = '- Enter the quantity';
                            mensaje += '- In row #' + (parseInt(indice) + 1) + ' enter the quantity \n';
                        } else {
                            if (parseInt(txtqcm_afacturar.value) > parseInt(cantidad_cm_requerida)) {
                                pasavalidacion = false;
                                let spn_error_qcm_afacturar = x.getElementsByClassName('_cls_spn_qcm_afacturar_error')[0];
                                spn_error_qcm_afacturar.classList.remove('hide');
                                spn_error_qcm_afacturar.innerText = '- Quantity counter sample is greater than required quantity';
                                mensaje += '- In row #' + (parseInt(indice) + 1) + ' Quantity counter sample is greater than required quantity \n';
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

        function fn_GetListaFacturaClienteDetalle() {
            let arr = Array.from(_('tbody_RequerimientoDetalle_fc').rows)
                .map(x => {
                    let datapar = x.getAttribute('data-par');
                    let idrequerimiento = _par(datapar, 'idrequerimiento');
                    let idrequerimientodetalle = _par(datapar, 'idrequerimientodetalle');
                    let chk_se_factura_contramuestra = x.getElementsByClassName('_cls_chk_cm_se_factura_fc')[0];
                    let escontramuestrafacturablecliente = chk_se_factura_contramuestra.checked ? 1 : 0;
                    let txtcantidadmuestra = x.getElementsByClassName('_cls_txt_q_afacturar_fc')[0];
                    let cantidadmuestrafacturable = txtcantidadmuestra.value === '' ? 0 : txtcantidadmuestra.value;
                    let txtpreciomuestra = x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0];
                    let preciomuestra = txtpreciomuestra.value === '' ? 0 : txtpreciomuestra.value;
                    let txtcantidadcontramuestrafacturable = x.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0];
                    let cantidadcontramuestrafacturable = txtcantidadcontramuestrafacturable.value === '' ? 0 : txtcantidadcontramuestrafacturable.value;
                    let txtpreciocontramuestra = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0];
                    let preciocontramuestra = txtpreciocontramuestra.value === '' ? 0 : txtpreciocontramuestra.value;

                    return {
                        IdFacturaClienteDetalle: 0
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

        function fn_pintar_tbl_ordenpedido_seleccionado_add(obj_ordenpedido) {
            let x = obj_ordenpedido;
            if (obj_ordenpedido) {
                let html = `
                    <tr data-par='idfacturaclienteordenpedido:0,idordenpedido:${x.IdOrdenPedido}'>
                        <td class='text-center'>
                            <button class='btn btn-xs btn-danger _cls_delete_op_fc' title='Remove Purchase Order'>
                                <span class='fa fa-trash'></span>
                            </button>
                        </td>
                        <td>${x.NumeroOrdenPedido}</td>
                        <td>${x.FechaCreacionOP}</td>
                        <td>${x.TotalOrdenPedido}</td>
                    </tr>
                `;
                _('tbody_ordenpedido_fc').insertAdjacentHTML('beforeend', html);
                let indice_fila = _('tbody_ordenpedido_fc').rows.length - 1;
                fn_handler_tbl_ordenpedido_seleccionados_add(indice_fila);
            }
        }

        function fn_pintar_tbl_ordenpedido_seleccionado_ini_edit(odata) {
            
            if (odata) {
                let html = odata.map(x => {
                    return `
                        <tr data-par='idfacturaclienteordenpedido:${x.IdFacturaClienteOrdenPedido},idordenpedido:${x.IdOrdenPedido}'>
                            <td class='text-center'>
                                <button class='btn btn-xs btn-danger _cls_delete_op_fc' title='Remove Purchase Order'>
                                    <span class='fa fa-trash'></span>
                                </button>
                            </td>
                            <td>${x.NumeroOrdenPedido}</td>
                            <td>${x.FechaActualizacion}</td>
                            <td>${x.TotalOrdenPedido}</td>
                        </tr>
                    `;
                }).join('');

                _('tbody_ordenpedido_fc').innerHTML = html;
                //// COMENTADO POR EL MOMENTO PORQUE NO SE VA A EDITAR
                //fn_handler_tbl_ordenpedido_seleccionados_ini_edit();
            }
        }

        //function fn_handler_tbl_ordenpedido_seleccionados_ini_edit() {
        //    Array.from(_('tbody_ordenpedido_fc').rows)
        //        .forEach(x => {
        //            x.getElementsByClassName('_cls_delete_op_fc')[0].addEventListener('click', e => { fn_delete_op_fc(e.currentTarget) }, false);
        //        });
        //}

        function fn_handler_tbl_ordenpedido_seleccionados_add(indice_fila) {
            _('tbody_ordenpedido_fc').rows[indice_fila].getElementsByClassName('_cls_delete_op_fc')[0].addEventListener('click', e => { fn_delete_op_fc(e.currentTarget) }, false);
        }

        function fn_delete_op_fc(o) {
            let fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function fn_calcular_total_factura_load() {
            let total = 0;
            Array.from(_('tbody_RequerimientoDetalle_fc').rows)
                .forEach(x => {
                    let txt_q_muestra = x.getElementsByClassName('_cls_txt_q_afacturar_fc')[0];
                    let txt_precio_muesta = x.getElementsByClassName('_cls_txt_precio_factcliente_fc')[0];
                    let txt_qcm = x.getElementsByClassName('_cls_txt_qcm_se_factura_fc')[0];
                    let txt_precio_cm = x.getElementsByClassName('_cls_txt_precio_cm_factcliente_fc')[0];
                    let chk_cm_sefacura = x.getElementsByClassName('_cls_chk_cm_se_factura_fc')[0];

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
            _('txt_total_fc').value = parseFloat(total).toFixed(2);
        }

        /* INICIO: EDU TODO SOBRE PAGINAR INICIO*/
        //// CUANDO NO HAY PAGINACION NO ES NECESARIO LAS FUNCIONES : page_result, paginar
        function event_header_filter(fields_input) {
            let adataResult = [], adata = oUtil.adata;
            oUtil.indiceactualpagina = 0;
            oUtil.indiceactualbloque = 0;
            if (adata.length > 0) {
                var fields = _('panelEncabezado_FacturaClienteFacturacionSample').getElementsByClassName(fields_input);
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
            var filters = _('panelEncabezado_FacturaClienteFacturacionSample').getElementsByClassName(name_filter);
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
    /*FIN*/

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
                            _('tbody_RequerimientoDetalle_fc').rows[i - 1].classList.toggle('_cls_row_selected');
                        }
                    } else if (ovariables.numerofila_seleccionado_fin_shift < ovariables.numerofila_seleccionado_inicio_shift) {
                        //// DESCENDENTE
                        for (let i = ovariables.numerofila_seleccionado_fin_shift; i < ovariables.numerofila_seleccionado_inicio_shift; i++) {
                            _('tbody_RequerimientoDetalle_fc').rows[i - 1].classList.toggle('_cls_row_selected');
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
            Array.from(_('tbody_RequerimientoDetalle_fc').rows)
                .forEach(x => {
                    x.classList.remove('_cls_row_selected');
                });
        }

        function req_ini() {
            let parametro = {};
            //ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            if (ovariables.accion === 'new') {
                parametro = { IdPrograma: ovariables.idprograma, IdCliente: ovariables.idcliente }
                _Get('Requerimiento/FacturacionSampleFacturaCliente/GetFacturaClienteLoadNew_JSON?par=' + JSON.stringify(parametro))
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini(odata);
                    });
            } else { //// EDIT
                parametro = { IdFacturaCliente: _('hf_idfacturacliente').value }
                _Get('Requerimiento/FacturacionSampleFacturaCliente/GetFacturaClienteLoadEdit_JSON?par=' + JSON.stringify(parametro))
                    .then((data) => {
                        let odata = data !== '' ? JSON.parse(data) : null;
                        res_ini_edit(odata);
                    });
            }
            
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_pintar_tbl_ordenpedido_seleccionado_add: fn_pintar_tbl_ordenpedido_seleccionado_add

        }
    }
)(document, 'panelEncabezado_FacturaClienteFacturacionSample');
(
    function ini() {
        appFacturaClienteFacturacionSample.load();
        appFacturaClienteFacturacionSample.req_ini();
    }
)();
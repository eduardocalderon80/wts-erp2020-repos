//import { json } from "d3";

var appFacturacionSampleInicial = (
    function (d, idpadre) {
        var ovariables = {
            idprograma: '',
            lstEstadosFacturacionSample: [],
            idcliente: ''
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
            let parametro = _('txtpar_facturacionsampleinicial').value;
            ovariables.idprograma = _par(parametro, 'idprograma');
            ovariables.idcliente = _par(parametro, 'idcliente');

            _('btnVerOrdenPedido').addEventListener('click', fn_ver_ordenpedido, false);
            _('btnVerFacturaFabrica').addEventListener('click', fn_ver_facturafabrica, false);
            _('btnVerFacturaCliente').addEventListener('click', fn_ver_facturacliente, false);
            _('btnUpdateRequerimiento_inicial').addEventListener('click', fn_save_update_requerimiento, false);

            filter_header();
            //// CARGAR LOS JS PARA LAS PESTAÑAS OP, FC, FF

            let url_op = 'Requerimiento/FacturacionSample/_Inicio_Pestania_OrdenPedido';
            _Getjs(url_op);
            let url_ff = 'Requerimiento/FacturacionSample/_Inicio_Pestania_FacturaFabrica';
            _Getjs(url_ff);
            let url_fc = 'Requerimiento/FacturacionSample/_Inicio_Pestania_FacturaCliente';
            _Getjs(url_fc);
        }

        async function res_ini(odata) {
            if (odata) {
                await _promise()
                    .then(() => {
                        let arr_requerimientos = odata.RequerimientosCSV !== '' ? CSVtoJSON(odata.RequerimientosCSV) : [];
                        let arr_ordenpedido_detalle = odata.OrdenPedidoDetalleCSV !== '' ? CSVtoJSON(odata.OrdenPedidoDetalleCSV) : [];
                        let arr_facturafabrica_detalle = odata.FacturaFabricaDetalleCSV !== '' ? CSVtoJSON(odata.FacturaFabricaDetalleCSV) : [];
                        let arr_facturacliente_detalle = odata.FacturaClienteDetalleCSV !== '' ? CSVtoJSON(odata.FacturaClienteDetalleCSV) : [];
                        ovariables.lstEstadosFacturacionSample = odata.EstadosFacturacionSampleCSV !== '' ? CSVtoJSON(odata.EstadosFacturacionSampleCSV) : [];

                        //// IMPLEMENTAR FILTRO BUSCADOR
                        oUtil.adata = arr_requerimientos;
                        oUtil.adataresult = oUtil.adata;
                        pintar_tabla_requerimiento_ini(arr_requerimientos);

                        //// IMPLEMENTAR FILTRO PARA PESTAÑA DE ORDEN DE PEDIDO
                        appFacturacionSampleInicial_Pestania_OP.oUtil.adata = arr_ordenpedido_detalle;
                        appFacturacionSampleInicial_Pestania_OP.oUtil.adataresult = appFacturacionSampleInicial_Pestania_OP.oUtil.adata;
                        fn_pintar_tabla_ordenpedido_detale_ini(arr_ordenpedido_detalle);

                        //// IMPLEMENTAR FILTRO PARA PESTAÑA DE FACTURA FABRICA
                        appFacturacionSampleInicial_Pestania_ff.oUtil.adata = arr_facturafabrica_detalle;
                        appFacturacionSampleInicial_Pestania_ff.oUtil.adataresult = appFacturacionSampleInicial_Pestania_ff.oUtil.adata;
                        fn_pintar_tbl_facturafabrica_detalle_ini(arr_facturafabrica_detalle);

                        //// IMPLEMENTAR FILTRO PARA PESTAÑA DE FACTURA CLIENTE
                        appFacturacionSampleInicial_Pestania_fc.oUtil.adata = arr_facturacliente_detalle;
                        appFacturacionSampleInicial_Pestania_fc.oUtil.adataresult = appFacturacionSampleInicial_Pestania_fc.oUtil.adata;
                        fn_pintar_tabla_facturacliente_detale_ini(arr_facturacliente_detalle);
                    });
            }
        }

        function fn_save_update_requerimiento() {
            swal({
                html: true,
                title: 'Are you sure to update?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, function (result) {
                    if (result) {
                        let form = new FormData();
                        let arr = Array.from(_('tbody_requerimientosample').rows)
                            .map(x => {
                                let datapar = x.getAttribute('data-par');
                                let idrequerimiento = _par(datapar, 'idrequerimiento');
                                let chkesfacturacliente = x.getElementsByClassName('_cls_chk_esfacturablecliente')[0];
                                let chkesfacturablefabrica = x.getElementsByClassName('_cls_chk_esfacturablefabrica')[0];
                                let cbo_estado = x.getElementsByClassName('_cls_cbo_estadofacturacion')[0];

                                return {
                                    IdRequerimiento: idrequerimiento,
                                    EsFacturableCliente: chkesfacturacliente.checked ? 1 : 0,
                                    EsFacturableFabrica: chkesfacturablefabrica.checked ? 1 : 0,
                                    IdCatalogo_EstadoFacturacion: cbo_estado.value
                                }
                            });

                        form.append('RequerimientosJSON', JSON.stringify(arr));
                        _Post('Requerimiento/FacturacionSample/SaveUpdateRequerimientoMuestraFacturacionInicialJSON', form, true)
                            .then((rpta) => {
                                let orpta = JSON.parse(rpta);
                                _swal({ mensaje: orpta.mensaje, estado: orpta.estado }, 'Good Job');
                            });
                    }
            });
        }

        function fn_pintar_tbl_facturafabrica_detalle_ini(odata, indice) {
            let html = '', tbody = _('tbody_facturafabrica_detalle_inicial');
            /* :edu inicio funcionalidad de paginacion*/
            if (indice == undefined) {
                indice = 0;
            }

            appFacturacionSampleInicial_Pestania_ff.oUtil.adataresult = odata;
            let inicio = appFacturacionSampleInicial_Pestania_ff.oUtil.indiceactualpagina * appFacturacionSampleInicial_Pestania_ff.oUtil.registrospagina;
            let fin = inicio + appFacturacionSampleInicial_Pestania_ff.oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `<tr data-par='idfacturafabrica:${odata[i].IdFacturaFabrica},idfacturafabricadetalle:${odata[i].IdFacturaFabricaDetalle},idrequerimiento:${odata[i].IdRequerimiento},idrequerimientodetalle:${odata[i].IdRequerimientoDetalle}'>
                                    <td>
                                        <button class='btn btn-xs btn-primary _cls_edit_ff'>
                                            <span class='fa fa-pencil'></span>
                                        </button>
                                        <button class='btn btn-xs btn-danger _cls_cancelar_ff'>
                                            <span class='fa fa-ban'></span>
                                        </button>
                                    </td>
                                    <td >${odata[i].NombreProveedor}</td>
                                    <td >${odata[i].CodigoEstilo}</td>
                                    <td >${odata[i].NombreTipoMuestra}</td>
                                    <td >${odata[i].Version}</td>
                                    <td >${odata[i].NombreClienteColor}</td>
                                    <td >${odata[i].NombreClienteTalla}</td>
                                    <td >${odata[i].CantidadMuestraFacturable}</td>
                                    <td >${odata[i].PrecioMuestra}</td>
                                    <td >${odata[i].SubTotal}</td>
                                    <td >${odata[i].NumeroOrdenPedido}</td>
                                    <td >${odata[i].FechaGeneracion}</td>
                                    <td >${odata[i].NumeroFacturaFabrica}</td>
                                </tr>`;
                    }
                }

                tbody.innerHTML = html;
                let htmlfoot = appFacturacionSampleInicial_Pestania_ff.page_result(odata, indice);
                _('foot_paginacion_ini_facturafabrica').innerHTML = appFacturacionSampleInicial_Pestania_ff.page_result(odata, indice);
                fn_handler_tbl_facturafabrica_detalle();
            }

            //if (odata) {
            //    let html = odata.map(x => {
            //        return `
            //            <tr data-par='idfacturafabrica:${x.IdFacturaFabrica},idfacturafabricadetalle:${x.IdFacturaFabricaDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle}'>
            //                <td>
            //                    <button class='btn btn-xs btn-primary _cls_edit_ff'>
            //                        <span class='fa fa-pencil'></span>
            //                    </button>
            //                    <button class='btn btn-xs btn-danger _cls_cancelar_ff'>
            //                        <span class='fa fa-ban'></span>
            //                    </button>
            //                </td>
            //                <td >${x.NombreProveedor}</td>
            //                <td >${x.CodigoEstilo}</td>
            //                <td >${x.NombreTipoMuestra}</td>
            //                <td >${x.Version}</td>
            //                <td >${x.NombreClienteColor}</td>
            //                <td >${x.NombreClienteTalla}</td>
            //                <td >${x.CantidadMuestraFacturable}</td>
            //                <td >${x.PrecioMuestra}</td>
            //                <td >${x.SubTotal}</td>
            //                <td >${x.NumeroOrdenPedido}</td>
            //                <td >${x.FechaGeneracion}</td>
            //                <td >${x.NumeroFacturaFabrica}</td>
            //            </tr>
            //        `;
            //    }).join('');

            //    _('tbody_facturafabrica_detalle_inicial').innerHTML = html;
            //    fn_handler_tbl_facturafabrica_detalle();
            //}
        }

        function fn_ver_facturacliente() {
            let idprograma = ovariables.idprograma;
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleFacturaCliente/_FacturaClienteFacturacionSample',
                idmodal: '_FacturaClienteFacturacionSample',
                title: 'Client Invoice',
                paremeter: `idprograma:${idprograma},idcliente:${ovariables.idcliente},accion:new,idfacturacliente:0`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_ver_facturafabrica() {
            let idprograma = ovariables.idprograma;
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleFacturaFabrica/_FacturaFabricaFacturacionSample',
                idmodal: '_FacturaFabricaFacturacionSample',
                title: 'Factory Invoice',
                paremeter: `idprograma:${idprograma},idcliente:${ovariables.idcliente},accion:new,idfacturafabrica:0`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_pintar_tabla_ordenpedido_detale_ini(odata, indice) {
            let html = '', tbody = _('tbody_ordenpedidodetalle_inicial');
            /* :edu inicio funcionalidad de paginacion*/
            if (indice == undefined) {
                indice = 0;
            }

            appFacturacionSampleInicial_Pestania_OP.oUtil.adataresult = odata;
            let inicio = appFacturacionSampleInicial_Pestania_OP.oUtil.indiceactualpagina * appFacturacionSampleInicial_Pestania_OP.oUtil.registrospagina;
            let fin = inicio + appFacturacionSampleInicial_Pestania_OP.oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `<tr data-par='idordenpedido:${odata[i].IdOrdenPedido},idordenpedidodetalle:${odata[i].IdOrdenPedidoDetalle},idrequerimiento:${odata[i].IdRequerimiento},idrequerimientodetalle:${odata[i].IdRequerimientoDetalle}'>
                                <td>
                                    <button class='btn btn-xs btn-primary _cls_edit_op'>
                                        <span class='fa fa-pencil'></span>
                                    </button>
                                    <button class='btn btn-xs btn-danger _cls_cancelar_op'>
                                        <span class='fa fa-ban'></span>
                                    </button>
                                    <button class='btn btn-xs btn-success _cls_print_op'>
                                        <span class='fa fa-file-pdf-o'></span>
                                    </button>
                                </td>
                                <td >${odata[i].NombreProveedor}</td>
                                <td >${odata[i].CodigoEstilo}</td>
                                <td >${odata[i].NombreTipoMuestra}</td>
                                <td >${odata[i].Version}</td>
                                <td >${odata[i].NombreClienteColor}</td>
                                <td >${odata[i].NombreClienteTalla}</td>
                                <td >${odata[i].CantidadMuestraFacturable}</td>
                                <td >${odata[i].PrecioMuestra}</td>
                                <td >${odata[i].SubTotal}</td>
                                <td class='_cls_td_numerofacturafabrica'>${odata[i].NumeroFacturaFabrica}</td>
                                <td class='_cls_numerofacturacliente'>${odata[i].NumeroFacturaCliente}</td>
                                <td >${odata[i].FechaCreacionOP}</td>
                                <td >${odata[i].NumeroOrdenPedido}</td>
                            </tr>`;
                    }
                }

                tbody.innerHTML = html;
                let htmlfoot = appFacturacionSampleInicial_Pestania_OP.page_result(odata, indice);
                _('foot_paginacion_ini_ordenpedido').innerHTML = appFacturacionSampleInicial_Pestania_OP.page_result(odata, indice);
                fn_handler_tbl_ordenpedido_detalle();
            }

            //if (odata) {
            //    let html = odata.map(x => {
            //        return `
            //            <tr data-par='idordenpedido:${x.IdOrdenPedido},idordenpedidodetalle:${x.IdOrdenPedidoDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle}'>
            //                <td>
            //                    <button class='btn btn-xs btn-primary _cls_edit_op'>
            //                        <span class='fa fa-pencil'></span>
            //                    </button>
            //                    <button class='btn btn-xs btn-danger _cls_cancelar_op'>
            //                        <span class='fa fa-ban'></span>
            //                    </button>
            //                    <button class='btn btn-xs btn-success _cls_print_op'>
            //                        <span class='fa fa-file-pdf-o'></span>
            //                    </button>
            //                </td>
            //                <td >${x.NombreProveedor}</td>
            //                <td >${x.CodigoEstilo}</td>
            //                <td >${x.NombreTipoMuestra}</td>
            //                <td >${x.Version}</td>
            //                <td >${x.NombreClienteColor}</td>
            //                <td >${x.NombreClienteTalla}</td>
            //                <td >${x.CantidadMuestraFacturable}</td>
            //                <td >${x.PrecioMuestra}</td>
            //                <td >${x.SubTotal}</td>
            //                <td >${x.NumeroFacturaFabrica}</td>
            //                <td >${x.NumeroFacturaCliente}</td>
            //                <td >${x.FechaCreacionOP}</td>
            //                <td >${x.NumeroOrdenPedido}</td>
            //            </tr>
            //        `;
            //    }).join('');

            //    _('tbody_ordenpedidodetalle_inicial').innerHTML = html;
            //    fn_handler_tbl_ordenpedido_detalle();
            //}
        }

        function fn_pintar_tabla_facturacliente_detale_ini(odata, indice) {
            let html = '', tbody = _('tbody_facturaclientedetalle_inicial');
            /* :edu inicio funcionalidad de paginacion*/
            if (indice == undefined) {
                indice = 0;
            }

            appFacturacionSampleInicial_Pestania_fc.oUtil.adataresult = odata;
            let inicio = appFacturacionSampleInicial_Pestania_fc.oUtil.indiceactualpagina * appFacturacionSampleInicial_Pestania_fc.oUtil.registrospagina;
            let fin = inicio + appFacturacionSampleInicial_Pestania_fc.oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `<tr data-par='idfacturacliente:${odata[i].IdFacturaCliente},idfacturaclientedetalle:${odata[i].IdFacturaClienteDetalle},idrequerimiento:${odata[i].IdRequerimiento},idrequerimientodetalle:${odata[i].IdRequerimientoDetalle}'>
                                    <td>
                                        <button class='btn btn-xs btn-primary _cls_edit_fc'>
                                            <span class='fa fa-pencil'></span>
                                        </button>
                                        <button class='btn btn-xs btn-danger _cls_cancelar_fc'>
                                            <span class='fa fa-ban'></span>
                                        </button>
                                        <button class='btn btn-xs btn-success _cls_print_fc'>
                                            <span class='fa fa-file-pdf-o'></span>
                                        </button>
                                    </td>
                                    <td >${odata[i].CodigoEstilo}</td>
                                    <td >${odata[i].NombreTipoMuestra}</td>
                                    <td >${odata[i].Version}</td>
                                    <td >${odata[i].NombreClienteColor}</td>
                                    <td >${odata[i].NombreClienteTalla}</td>
                                    <td >${odata[i].CantidadMuestraFacturable}</td>
                                    <td >${odata[i].PrecioMuestra}</td>
                                    <td >${odata[i].SubTotal}</td>
                                    <td >${odata[i].NumeroOrdenPedido}</td>
                                    <td >${odata[i].FechaCreacionFC}</td>
                                    <td >${odata[i].NumeroFacturaCliente}</td>
                                </tr>`;
                    }
                }

                tbody.innerHTML = html;
                let htmlfoot = appFacturacionSampleInicial_Pestania_fc.page_result(odata, indice);
                _('foot_paginacion_ini_facturacliente').innerHTML = appFacturacionSampleInicial_Pestania_fc.page_result(odata, indice);
                fn_handler_tbl_facturacliente_detalle();
            }
            //if (odata) {
            //    let html = odata.map(x => {
            //        return `
            //            <tr data-par='idfacturacliente:${x.IdFacturaCliente},idfacturaclientedetalle:${x.IdFacturaClienteDetalle},idrequerimiento:${x.IdRequerimiento},idrequerimientodetalle:${x.IdRequerimientoDetalle}'>
            //                <td>
            //                    <button class='btn btn-xs btn-primary _cls_edit_fc'>
            //                        <span class='fa fa-pencil'></span>
            //                    </button>
            //                    <button class='btn btn-xs btn-danger _cls_cancelar_fc'>
            //                        <span class='fa fa-ban'></span>
            //                    </button>
            //                    <button class='btn btn-xs btn-success _cls_print_fc'>
            //                        <span class='fa fa-file-pdf-o'></span>
            //                    </button>
            //                </td>
            //                <td >${x.CodigoEstilo}</td>
            //                <td >${x.NombreTipoMuestra}</td>
            //                <td >${x.Version}</td>
            //                <td >${x.NombreClienteColor}</td>
            //                <td >${x.NombreClienteTalla}</td>
            //                <td >${x.CantidadMuestraFacturable}</td>
            //                <td >${x.PrecioMuestra}</td>
            //                <td >${x.SubTotal}</td>
            //                <td >${x.NumeroOrdenPedido}</td>
            //                <td >${x.FechaCreacionFC}</td>
            //                <td >${x.NumeroFacturaCliente}</td>
            //            </tr>
            //        `;
            //    }).join('');

            //    _('tbody_facturaclientedetalle_inicial').innerHTML = html;
            //    fn_handler_tbl_facturacliente_detalle();
            //}
        }

        function fn_handler_tbl_ordenpedido_detalle() {
            Array.from(_('tbody_ordenpedidodetalle_inicial').rows)
                .forEach((x, indice) => {
                    x.getElementsByClassName('_cls_cancelar_op')[0].addEventListener('click', e => { fn_cancelar_ordenpedido(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_edit_op')[0].addEventListener('click', e => { fn_ver_op_edit(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_print_op')[0].addEventListener('click', e => { fn_print_op(e.currentTarget); }, false);
                });
        }

        function fn_handler_tbl_facturacliente_detalle() {
            Array.from(_('tbody_facturaclientedetalle_inicial').rows)
                .forEach((x, indice) => {
                    x.getElementsByClassName('_cls_cancelar_fc')[0].addEventListener('click', e => { fn_cancelar_facturacliente(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_edit_fc')[0].addEventListener('click', e => { fn_ver_facturacliente_edit(e.currentTarget) }, false);
                    x.getElementsByClassName('_cls_print_fc')[0].addEventListener('click', e => { fn_print_op_facturacliente(e.currentTarget); }, false);
                });
        }

        function fn_handler_tbl_facturafabrica_detalle() {
            Array.from(_('tbody_facturafabrica_detalle_inicial').rows)
                .forEach((x, indice) => {
                    x.getElementsByClassName('_cls_cancelar_ff')[0].addEventListener('click', e => { fn_cancelar_facturafabrica(e.currentTarget); }, false);
                    x.getElementsByClassName('_cls_edit_ff')[0].addEventListener('click', e => { fn_ver_facturafabrica_edit(e.currentTarget); }, false);
                });
        }

        function fn_print_op(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idordenpedido = _par(datapar, 'idordenpedido');

            let url = urlBase() + `Requerimiento/FacturacionSampleOrdenPedido/GeneratePO_PDF?IdOrdenPedido=${idordenpedido}`;
            let link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
            //_Get('Requerimiento/FacturacionSampleOrdenPedido/test_ordenpedido?IdOrdenPedido=' + idordenpedido)
            //    .then((data) => {
            //        let odata = JSON.parse(data);
            //        console.log(odata);
            //    });
        }

        function fn_print_op_facturacliente(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idfacturacliente = _par(datapar, 'idfacturacliente');

            let url = urlBase() + `Requerimiento/FacturacionSampleFacturaCliente/GeneratePO_PDF?IdFacturaCliente=${idfacturacliente}`;
            let link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function fn_ver_facturacliente_edit(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idfacturacliente = _par(datapar, 'idfacturacliente');

            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleFacturaCliente/_FacturaClienteFacturacionSample',
                idmodal: '_FacturaClienteFacturacionSample',
                title: 'Client Invoice',
                paremeter: `idprograma:${ovariables.idprograma},idcliente:${ovariables.idcliente},accion:edit,idfacturacliente:${idfacturacliente}`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_ver_facturafabrica_edit(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idfacturafabrica = _par(datapar, 'idfacturafabrica');

            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleFacturaFabrica/_FacturaFabricaFacturacionSample',
                idmodal: '_FacturaFabricaFacturacionSample',
                title: 'Factory Invoice',
                paremeter: `idprograma:${ovariables.idprograma},idcliente:${ovariables.idcliente},accion:edit,idfacturafabrica:${idfacturafabrica}`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_ver_op_edit(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idordenpedido = _par(datapar, 'idordenpedido');

            let idprograma = ovariables.idprograma;
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleOrdenPedido/_OrdenPedidoFacturacionSample',
                idmodal: '_OrdenPedidoFacturacionSample',
                title: 'Purchase Order',
                paremeter: `idprograma:${idprograma},idcliente:${ovariables.idcliente},accion:edit,idordenpedido:${idordenpedido}`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function fn_cancelar_ordenpedido(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idordenpedido = _par(datapar, 'idordenpedido');
            let nrofacturafabrica = fila.getElementsByClassName('_cls_td_numerofacturafabrica')[0].innerText.trim();
            let nrofacturacliente = fila.getElementsByClassName('_cls_numerofacturacliente')[0].innerText.trim()
            let mensaje = '';
            if (nrofacturafabrica !== '' || nrofacturacliente !== '') {
                if (nrofacturafabrica !== '') {
                    mensaje += 'factory invoices';
                }
                if (nrofacturacliente !== '') {
                    if (mensaje !== '') {
                        mensaje += ' and client';
                    } else {
                        mensaje += 'client invoices';
                    }
                }
                _swal({ mensaje: `The purchase order has associated ${mensaje}`, estado: 'error' }, 'Validation');
                return false;
            }

            swal({
                html: true,
                title: 'Are you sure to cancel the Purchase Order?...!',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: false
            }, function (result) {
                if (result) {
                    let form = new FormData();
                    form.append('IdOrdenPedido', idordenpedido);
                    _Post('Requerimiento/FacturacionSampleOrdenPedido/SaveCancelarOrdenPedido_JSON', form, true)
                        .then((data) => {
                            let odata = JSON.parse(data);
                            _swal({ mensaje: odata.mensaje, estado: odata.estado }, 'Nice job');
                            if (odata.estado === 'success') {
                                req_ini();
                            }
                        });
                }
            });
        }

        function fn_cancelar_facturacliente(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idfacturacliente = _par(datapar, 'idfacturacliente');
            swal({
                html: true,
                title: 'Are you sure to cancel the Client Invoice?...!',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: true
            }, function (result) {
                if (result) {
                    let form = new FormData();
                    form.append('IdFacturaCliente', idfacturacliente);
                    _Post('Requerimiento/FacturacionSampleFacturaCliente/SaveCancelarFacturaCliente_JSON', form, true)
                        .then((data) => {
                            let odata = JSON.parse(data);
                            _swal({ mensaje: odata.mensaje, estado: odata.estado }, 'Nice job');
                            if (odata.estado === 'success') {
                                req_ini();
                            }
                        });
                }
            });
        }

        function fn_cancelar_facturafabrica(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idfacturafabrica = _par(datapar, 'idfacturafabrica');
            swal({
                html: true,
                title: 'Are you sure to cancel the Factory Invoice?...!',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                closeOnConfirm: false
            }, function (result) {
                if (result) {
                    let form = new FormData();
                    form.append('IdFacturaFabrica', idfacturafabrica);
                    _Post('Requerimiento/FacturacionSampleFacturaFabrica/SaveCancelarFacturaFabrica_JSON', form, true)
                        .then((data) => {
                            let odata = JSON.parse(data);
                            _swal({ mensaje: odata.mensaje, estado: odata.estado }, 'Nice job');
                            if (odata.estado === 'success') {
                                req_ini();
                            }
                        });
                }
                
            });
        }

        function fn_ver_ordenpedido() {
            let idprograma = ovariables.idprograma;
            _modalBody_Backdrop({
                url: 'Requerimiento/FacturacionSampleOrdenPedido/_OrdenPedidoFacturacionSample',
                idmodal: '_OrdenPedidoFacturacionSample',
                title: 'Purchase Order',
                paremeter: `idprograma:${idprograma},idcliente:${ovariables.idcliente},accion:new,idordenpedido:0`,
                width: '',
                height: '570',
                responsive: 'width-modal-req',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });
        }

        function pintar_tabla_requerimiento_ini(odata, indice) {
            let html = '', tbody = _('tbody_requerimientosample');
            /* :edu inicio funcionalidad de paginacion*/
            if (indice == undefined) {
                indice = 0;
            }

            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        let cadena_esfacturablecliente = odata[i].EsFacturableCliente === '1' ? 'checked' : '';
                        let cadena_esfacturablefabrica = odata[i].EsFacturableFabrica === '1' ? 'checked' : '';
                        let disabled_check_facturacliente = odata[i].TieneFacturaCliente === '1' ? 'disabled' : '';
                        let disabled_check_facturafabrica = odata[i].TieneOrdenPedido === '1' ? 'disabled' : '';

                        html += `<tr data-par='idrequerimiento:${odata[i].IdRequerimiento},esfacturablecliente:${odata[i].EsFacturableCliente},esfacturablefabrica:${odata[i].EsFacturableFabrica},idcatalogo_estadofacturacion:${odata[i].IdCatalogo_EstadoFacturacion}'>
                            <td></td>
                            <td>${odata[i].CodigoEstilo}</td>
                            <td>${odata[i].FechaCreacion}</td>
                            <td>${odata[i].NombreTipoMuestra}</td>
                            <td>${odata[i].Version}</td>
                            <td>${odata[i].ExFactoryInicial}</td>
                            <td>${odata[i].FechaInDC}</td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_esfacturablecliente_${i}' class='_cls_chk_esfacturablecliente' ${cadena_esfacturablecliente} ${disabled_check_facturacliente} />
                                    <label for='chk_esfacturablecliente_${i}'></label>
                                </div>

                            </td>
                            <td class='text-center'>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_esfacturablefabrica_${i}' class='_cls_chk_esfacturablefabrica' ${cadena_esfacturablefabrica} ${disabled_check_facturafabrica} />
                                    <label for='chk_esfacturablefabrica_${i}'></label>
                                </div>

                            </td>
                            <td>${odata[i].PoNumber}</td>
                            <td>
                                <select class='form-control _cls_cbo_estadofacturacion' ${disabled_check_facturacliente}></select>
                            </td>
                        </tr>`;
                    }
                }

                tbody.innerHTML = html;
                let htmlfoot = page_result(odata, indice);
                _('foot_paginacion_ini_req').innerHTML = page_result(odata, indice);
                fn_actualizarinputs_tbl_requerimiento_ini();
            }
            //if (odata) {
            //    let html = odata.map((x, indice) => {
            //        let cadena_esfacturablecliente = odata[i].EsFacturableCliente === '1' ? 'checked' : '';
            //        let cadena_esfacturablefabrica = odata[i].EsFacturableFabrica === '1' ? 'checked' : '';
            //        let disabled_check_facturacliente = odata[i].TieneFacturaCliente === '1' ? 'disabled' : '';
            //        let disabled_check_facturafabrica = odata[i].TieneOrdenPedido === '1' ? 'disabled' : '';
            //        return `
            //            <tr data-par='idrequerimiento:${odata[i].IdRequerimiento},esfacturablecliente:${odata[i].EsFacturableCliente},esfacturablefabrica:${odata[i].EsFacturableFabrica},idcatalogo_estadofacturacion:${odata[i].IdCatalogo_EstadoFacturacion}'>
            //                <td></td>
            //                <td>${odata[i].CodigoEstilo}</td>
            //                <td>${odata[i].FechaCreacion}</td>
            //                <td>${odata[i].NombreTipoMuestra}</td>
            //                <td>${odata[i].Version}</td>
            //                <td>${odata[i].ExFactoryInicial}</td>
            //                <td>${odata[i].FechaInDC}</td>
            //                <td class='text-center'>
            //                    <div class='checkbox checkbox-green'>
            //                        <input type='checkbox' id='chk_esfacturablecliente_${indice}' class='_cls_chk_esfacturablecliente' ${cadena_esfacturablecliente} ${disabled_check_facturacliente} />
            //                        <label for='chk_esfacturablecliente_${indice}'></label>
            //                    </div>
                                
            //                </td>
            //                <td class='text-center'>
            //                    <div class='checkbox checkbox-green'>
            //                        <input type='checkbox' id='chk_esfacturablefabrica_${indice}' class='_cls_chk_esfacturablefabrica' ${cadena_esfacturablefabrica} ${disabled_check_facturafabrica} />
            //                        <label for='chk_esfacturablefabrica_${indice}'></label>
            //                    </div>
                                
            //                </td>
            //                <td>${odata[i].PoNumber}</td>
            //                <td>
            //                    <select class='form-control _cls_cbo_estadofacturacion' ${disabled_check_facturacliente}></select>
            //                </td>
            //            </tr>
                        
            //        `;
            //    }).join('');

            //    _('tbody_requerimientosample').innerHTML = html;
            //    fn_actualizarinputs_tbl_requerimiento_ini();
            //}
        }

        function fn_actualizarinputs_tbl_requerimiento_ini() {
            // PARA LOS COMBOS
            let arr_fila = Array.from(_('tbody_requerimientosample').rows);
            arr_fila.forEach(x => {
                let datapar = x.getAttribute('data-par');
                let idestadofacturacion = _par(datapar, 'idcatalogo_estadofacturacion');
                let cbo_estadofacturacion = x.getElementsByClassName('_cls_cbo_estadofacturacion')[0];
                cbo_estadofacturacion.innerHTML = _comboItem({ value: '', text: '-' }) + _comboFromJSON(ovariables.lstEstadosFacturacionSample, 'CodCatalogo', 'NombreCatalogo');
                cbo_estadofacturacion.value = idestadofacturacion;
            });
        }

        /* : EDU TODO SOBRE PAGINAR INICIO*/
        function page_result(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
            var contenido = "";
            if (padata != null && padata.length > 0) {
                var nregistros = padata.length;
                var indiceultimapagina = Math.floor(nregistros / oUtil.registrospagina);
                if (nregistros % oUtil.registrospagina == 0) indiceultimapagina--;

                var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;

                contenido += "<ul class='pagination'>";
                if (oUtil.indiceactualbloque > 0) {
                    contenido += "<li data-indice='-1'> <a onclick='appFacturacionSampleInicial.paginar(-1, appFacturacionSampleInicial.pintar_tabla_requerimiento_ini);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appFacturacionSampleInicial.paginar(-2, appFacturacionSampleInicial.pintar_tabla_requerimiento_ini);' > < </a></li>";
                }
                var inicio = oUtil.indiceactualbloque * oUtil.paginasbloques;
                var fin = inicio + oUtil.paginasbloques;
                let clsactivo = '';
                for (let i = inicio; i < fin; i++) {
                    if (i <= indiceultimapagina) {
                        if (indice == i) {
                            clsactivo = 'active_paginacion'
                        } else {
                            clsactivo = ''
                        }
                        if (indice == -1) {
                            if (i == 0) {
                                clsactivo = 'active_paginacion';
                            }
                        } else if (indice == -4) {
                            if (i == indiceultimapagina) {
                                clsactivo = 'active_paginacion';
                            }
                        } else if (indice == -2 || indice == -3) {
                            if (i == inicio) {
                                clsactivo = 'active_paginacion'
                            }
                        }
                        contenido += `<li class='${clsactivo}' data-indice='${i}'>`;
                        contenido += `<a class='${clsactivo}' onclick='appFacturacionSampleInicial.paginar(`;
                        contenido += i.toString();
                        contenido += `, appFacturacionSampleInicial.pintar_tabla_requerimiento_ini);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appFacturacionSampleInicial.paginar(-3, appFacturacionSampleInicial.pintar_tabla_requerimiento_ini);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appFacturacionSampleInicial.paginar(-4, appFacturacionSampleInicial.pintar_tabla_requerimiento_ini);' > >> </a></li>";
                }
            }

            let foot = `<nav>
                    ${contenido}
                </nav>
        `;
            return foot;
        }

        function paginar(indice, callback_pintartabla) {
            if (indice > -1) {
                oUtil.indiceactualpagina = indice;
            }
            else {
                switch (indice) {
                    case -1:
                        oUtil.indiceactualbloque = 0;
                        oUtil.indiceactualpagina = 0;
                        break;
                    case -2:
                        oUtil.indiceactualbloque--;
                        oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                        break;
                    case -3:
                        oUtil.indiceactualbloque++;
                        oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                        break;
                    case -4:
                        var nregistros = oUtil.adataresult.length;
                        var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                        if (nregistros % registrosbloque == 0) indiceultimobloque--;
                        oUtil.indiceactualbloque = indiceultimobloque;
                        oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                        break;
                }
            }

            ////pintartablaindex(oUtil.adataresult, indice);
            callback_pintartabla(oUtil.adataresult, indice);
        }

        function event_header_filter(fields_input) {
            let adataResult = [], adata = oUtil.adata;
            oUtil.indiceactualpagina = 0;
            oUtil.indiceactualbloque = 0;
            if (adata.length > 0) {
                var fields = _('panelEncabezado_FacturacionSampleInicial').getElementsByClassName(fields_input);
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
            var filters = _('panelEncabezado_FacturacionSampleInicial').getElementsByClassName(name_filter);
            var nfilters = filters.length, filter = {};

            for (let i = 0; i < nfilters; i++) {
                filter = filters[i];
                if (filter.type == "text") {
                    filter.value = '';
                    filter.onkeyup = function () {
                        oUtil.adataresult = event_header_filter(name_filter);
                        //pintartablaindex(oUtil.adataresult, 0); //:desactivate                
                        pintar_tabla_requerimiento_ini(oUtil.adataresult, oUtil.indiceactualpagina);
                    }
                }
            }
        }
        /* : FIN*/

        function req_ini() {
            //ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            _Get('Requerimiento/FacturacionSample/GetRequerimientoMuestraFacturacionInicial_JSON?idprograma=' + ovariables.idprograma)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    res_ini(odata);
                });
        }

        return {
            load: load,
            req_ini: req_ini,
            pintar_tabla_requerimiento_ini: pintar_tabla_requerimiento_ini,
            fn_pintar_tabla_ordenpedido_detale_ini: fn_pintar_tabla_ordenpedido_detale_ini,
            fn_pintar_tbl_facturafabrica_detalle_ini: fn_pintar_tbl_facturafabrica_detalle_ini,
            fn_pintar_tabla_facturacliente_detale_ini: fn_pintar_tabla_facturacliente_detale_ini
        }
    }
)(document, 'panelEncabezado_FacturacionSampleInicial');
(
    function ini() {
        appFacturacionSampleInicial.load();
        appFacturacionSampleInicial.req_ini();
    }
)();
var appHistorialCotizar = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud: 0,
            idcotizar: 0,
            lstVigente: [],
            lstHistorial: []
        }

        function load() {
            _('btnReturn').addEventListener('click', fn_return);

            // Scroll top
            _scrollTo(0);

            let par = _('txtparametro').value;
            if (!_isEmpty(par)) {
                ovariables.idsolicitud = _parseInt(_par(par, 'idsolicitud'));
                ovariables.idcotizar = _parseInt(_par(par, 'idcotizar'));
                _('_title').innerHTML = "Historial de Cotizacion #" + ovariables.idsolicitud;
            }
        }

        function fn_return() {
            let urlAccion = 'DesarrolloTextil/Solicitud/Index';
            _Go_Url(urlAccion, urlAccion);
        }

        function req_ini() {
            if (_isnotEmpty(ovariables.idcotizar)) {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idcotizar: ovariables.idcotizar };
                _Get('DesarrolloTextil/CotizarTela/GetData_CotizarTelaHistorial?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lstVigente = rpta[0].lstVigente !== '' ? JSON.parse(rpta[0].lstVigente) : [];
                            ovariables.lstHistorial = rpta[0].lstHistorial !== '' ? JSON.parse(rpta[0].lstHistorial) : [];
                            fn_CrearTabla(ovariables.lstVigente);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            }
        }

        function fn_CrearTabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_historial" class ="table table-bordered table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th></th>
                                <th>N° Cotizacion</th>
                                <th>Estado</th>
                                <th>Fecha de Cotizacion</th>
                                <th>Cliente</th>
                                <th>Temporada</th>
                                <th>Titulo</th>
                                <th>N° ATX</th>   
                                <th>Codigo Tela</th>   
                                <th>Familia</th>
                                <th>Densidad (oz./Yd.²)</th>
                                <th>Ancho Util</th>
                                <th>Modalidad</th>
                                <th>RENDIMIENTO m/Kg</th>
                                <th>RENDIMIENTO Yd/Kg</th>
                                <th>PRECIO RESULTANTE US$/Kg.</th>
                                <th>PRECIO RESULTANTE $/m</th>
                                <th>PRECIO RESULTANTE $/Yd</th>
                                <th>Dias</th>
                                <th>CANTIDAD MÍNIMA / ORDEN Kg</th>
                                <th>CANTIDAD MÍNIMA / ORDEN m</th>
                                <th>CANTIDAD MÍNIMA/ ORDEN Yd</th>
                                <th>CANTIDAD MÍNIMA / COLOR Kg</th>
                                <th>CANTIDAD MÍNIMA/ COLOR m</th>
                                <th>CANTIDAD MÍNIMA / COLOR Yd</th>
                                <th>Observaciones</th>
                                <th>Recordar</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `
                        <tr>
                            <td class="details-control">
                                <button class="btn btn-info dim" data-id="${x.IdOrden}">
                                    <i class="fa fa-plus"></i> 
                                </button>
                            </td>
                            <td>${x.IdSolicitudDetalle}</td>
                            <td>${fn_ReturnEstado(x.Estado)}</td>
                            <td>${x.FechaCotizacion}</td>
                            <td>${x.NombreCliente}</td>
                            <td>${x.CodigoClienteTemporada}</td>
                            <td>${x.Titulo}</td>
                            <td>${x.ATX}</td>
                            <td>${x.CodigoTela}</td>
                            <td>${x.Familia}</td>   
                            <td>${x.DensidadOzYd}</td>
                            <td>${x.AnchoUtil}</td>
                            <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                            <td>${x.RendimientoMKG}</td>
                            <td>${x.RendimientoYdKg}</td>
                            <td>${x.PrecioResultanteKg}</td>
                            <td>${x.PrecioResultanteM}</td>
                            <td>${x.PrecioResultanteYd}</td>
                            <td>${x.Dias}</td>
                            <td>${x.CantidadMinimaOrdenKg}</td>
                            <td>${x.CantidadMinimaOrdenM}</td>
                            <td>${x.CantidadMinimaOrdenYd}</td>
                            <td>${x.CantidadMinimaColorKg}</td>
                            <td>${x.CantidadMinimaColorM}</td>   
                            <td>${x.CantidadMinimaColorYd}</td>
                            <td>${x.Observaciones}</td>   
                            <td>${x.Recordar}</td>
                        </tr>
                    `;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_historial').innerHTML = html;

            fn_FormatTreeView();
        }

        function fn_ReturnEstado(estado) {
            let html = '';
            if (estado === 0) {
                html = '<span class="badge badge-warning">PROCESO</span>';
            } else {
                html = '<span class="badge badge-success">FINALIZADO</span>'
            }
            return html
        }

        function fn_FormatTreeView() {
            var table = $('#tbl_historial').DataTable({
                info: false,
                scrollY: false,
                scrollX: true,
                scrollCollapse: true,
                "lengthMenu": [20, 30, 50, 80],
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar"
                }
            });

            $('#tbl_historial tbody').on('click', 'td.details-control button', function () {
                let IdOrden = $(this).data('id');
                let tr = $(this).closest('tr');
                let tdi = tr.find("i.fa");
                let row = table.row(tr);
                let filterData = ovariables.lstHistorial.filter(x => x.IdOrden == IdOrden);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                    // Font Awesome
                    tdi.first().removeClass('fa-minus');
                    tdi.first().addClass('fa-plus');
                } else {
                    // Open this row
                    row.child(fn_CreateTreeView(filterData)).show();
                    //console.log(fn_CreateTreeView(filterData));
                    tr.addClass('shown');
                    // Font Awesome
                    tdi.first().removeClass('fa-plus');
                    tdi.first().addClass('fa-minus');
                }
            });
        }

        function fn_CreateTreeView(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table class ="table table-bordered table-hover" style="width:100%; margin-bottom: 0px;">
                        <thead>
                            <tr>
                                <th>N° Historial</th>
                                <th>Fecha de Cotizacion</th>
                                <th>Cliente</th>
                                <th>Temporada</th>
                                <th>Titulo</th>
                                <th>N° ATX</th>   
                                <th>Codigo Tela</th>   
                                <th>Familia</th>
                                <th>Densidad (oz./Yd.²)</th>
                                <th>Ancho Util</th>
                                <th>Modalidad</th>
                                <th>RENDIMIENTO m/Kg</th>
                                <th>RENDIMIENTO Yd/Kg</th>
                                <th>PRECIO RESULTANTE US$/Kg.</th>
                                <th>PRECIO RESULTANTE $/m</th>
                                <th>PRECIO RESULTANTE $/Yd</th>
                                <th>Dias</th>
                                <th>CANTIDAD MÍNIMA / ORDEN Kg</th>
                                <th>CANTIDAD MÍNIMA / ORDEN m</th>
                                <th>CANTIDAD MÍNIMA/ ORDEN Yd</th>
                                <th>CANTIDAD MÍNIMA / COLOR Kg</th>
                                <th>CANTIDAD MÍNIMA/ COLOR m</th>
                                <th>CANTIDAD MÍNIMA / COLOR Yd</th>
                                <th>Observaciones</th>
                                <th>Recordar</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `
                        <tr>
                            <td>${x.IdOrdenHistorial}</td>
                            <td>${x.FechaCotizacion}</td>
                            <td>${x.NombreCliente}</td>
                            <td>${x.CodigoClienteTemporada}</td>
                            <td>${x.Titulo}</td>
                            <td>${x.ATX}</td>
                            <td>${x.CodigoTela}</td>
                            <td>${x.Familia}</td>   
                            <td>${x.DensidadOzYd}</td>
                            <td>${x.AnchoUtil}</td>
                            <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                            <td>${x.RendimientoMKG}</td>
                            <td>${x.RendimientoYdKg}</td>
                            <td>${x.PrecioResultanteKg}</td>
                            <td>${x.PrecioResultanteM}</td>
                            <td>${x.PrecioResultanteYd}</td>
                            <td>${x.Dias}</td>
                            <td>${x.CantidadMinimaOrdenKg}</td>
                            <td>${x.CantidadMinimaOrdenM}</td>
                            <td>${x.CantidadMinimaOrdenYd}</td>
                            <td>${x.CantidadMinimaColorKg}</td>
                            <td>${x.CantidadMinimaColorM}</td>   
                            <td>${x.CantidadMinimaColorYd}</td>
                            <td>${x.Observaciones}</td>   
                            <td>${x.Recordar}</td>
                        </tr>
                    `;
                });
            } else {
                htmlbody += `<tr>
                                <td colspan="27" align="center">No se encontraron datos</td>
                             </tr>`;
            }
            return html += htmlbody + '</tbody></table>';
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_Historial_Cotizacion');
(
    function ini() {
        appHistorialCotizar.load();
        appHistorialCotizar.req_ini();
    }
)();
var appBuscadorCotizacion = (
    function (d, idpadre) {
        var ovariables = {
            lstDetalle: [],
            lstAgregar: []
        }

        function load() {
            _('btnSearch').addEventListener('click', req_ini);
            _('btnDuplicar').addEventListener('click', fn_Duplicar);
            _('btnReporteExcel').addEventListener('click', fn_CrearReporte);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    codigotela: _('txtcodigotela').value,
                    nroatx: _('txtatx').value,
                    familia: _('txtfamilia').value
                };
            _Get('DesarrolloTextil/CotizarTela/GetData_DetallesCotizacion?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstDetalle = rpta;
                        fn_CrearTabla(rpta);
                    }
                }, (p) => { err(p); });
        }

        function fn_CrearTabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_buscarcotizacion" class ="table table-bordered table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Cliente</th>
                                <th>Cliente Temporada</th>
                                <th>Codigo Tela</th>
                                <th>N° ATX</th>
                                <th>Descripción</th>
                                <th>% Tela</th>
                                <th>Densidad</th>
                                <th>Lavado</th>
                                <th>Familia</th>
                                <th>Trade Name</th>
                                <th>Division</th>   
                                <th>Rango</th>   
                                <th>Modalidad</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td>${x.IdSolicitudDetalle}</td>
                                    <td>${x.NombreCliente}</td>
                                    <td>${x.CodigoClienteTemporada}</td>
                                    <td>${x.CodigoTela}</td>
                                    <td>${x.NroATX}</td>
                                    <td>${x.Descripcion}</td>
                                    <td>${x.PorcentajeTela}</td>
                                    <td>${x.Densidad}</td>
                                    <td>${x.Lavado}</td>   
                                    <td>${x.Familia}</td>
                                    <td>${x.TradeName}</td>
                                    <td>${x.Division}</td>
                                    <td>${x.Rango}</td>
                                    <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td>${x.Comentario}</td>
                                </tr>`;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_buscarcotizacion').innerHTML = html;

            fn_FormatTable();
        }

        function fn_FormatTable() {
            // Crea footer
            _('tbl_buscarcotizacion').createTFoot();
            _('tbl_buscarcotizacion').tFoot.innerHTML = _('tbl_buscarcotizacion').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_buscarcotizacion tfoot th').each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                $(this).addClass("no-sort");
                let element = $(this).data("search");
                if (element !== false) {
                    $(this).html('<input type="text" placeholder="Buscar" />');
                }
            });

            // DataTable
            var table = $('#tbl_buscarcotizacion').DataTable({
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar"
                },
                "drawCallback": function () {
                    // Para duplicar
                    fn_iCheckDuplicar();
                },
                info: false,
                lengthChange: false,
                pageLength: 10,
            });

            // Buscar en keyup
            table.columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });

            $("#tbl_buscarcotizacion tfoot tr").appendTo("#tbl_buscarcotizacion thead");
            $("#tbl_buscarcotizacion tfoot").remove();

            // Hide table general search
            $('#tbl_buscarcotizacion_filter').hide();  
        }

        function fn_Cancelar() {
            $('#tbl_buscarcotizacion').DataTable().destroy();
            $('#tbl_buscarcotizacion thead tr').eq(1).remove();

            _('btnCancelar').remove();
            _('btnAceptar').remove();

            _('btnDuplicar').disabled = false;

            $('.no-need').remove();

            // Se limpia arreglo
            ovariables.lstAgregar = [];

            fn_FormatTable();
        }

        function fn_Aceptar() {
            if (ovariables.lstAgregar.length > 0) {
                swal({
                    html: true,
                    title: "Duplicar Solicitud",
                    text: "¿Estas seguro/a que deseas Duplicar los registros seleccionados? <br /> <span style='font-weight: 400; font-size: 14px;'>Al duplicar los registros, se creara una nueva solicitud tomando como base los seleccionados</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let arreglo = 'id';
                    ovariables.lstAgregar.forEach(x => {
                        arreglo += `^${x.id}`;
                    });

                    swal({ title: "¡Buen Trabajo!", text: "Se duplico con exito", type: "success" });

                    let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
                    _Go_Url(urlAccion, urlAccion, 'accion:duplicate,vista:2,lista:' + arreglo);
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar al menos un registro", type: "warning" });
            }
        }

        function fn_Duplicar() {
            $('#tbl_buscarcotizacion').DataTable().destroy();
            $('#tbl_buscarcotizacion thead tr').eq(1).remove();

            let rowsLength = _('tbl_buscarcotizacion').children[1].rows.length;
            let thead = _('tbl_buscarcotizacion').children[0];
            let tbody = _('tbl_buscarcotizacion').children[1];

            _('content_header').children[1].insertAdjacentHTML('afterbegin', `<button id="btnCancelar" class="btn btn-sm btn-danger" onclick="appBuscadorCotizacion.fn_Cancelar()" title="Cancelar">
                                                                <span class="fa fa-ban"></span>
                                                               </button>
                                                               <button id="btnAceptar" class="btn btn-sm btn-warning" onclick="appBuscadorCotizacion.fn_Aceptar()" title="Aceptar" style="margin-right: 5px;">
                                                                <span class="fa fa-check"></span>
                                                               </button>`);
            _('btnDuplicar').disabled = true;

            thead.children[0].insertAdjacentHTML('afterbegin', '<th class="no-need no-sort" data-search="false"></th>');
            for (let i = 0; i < rowsLength; i++) {
                let id = tbody.children[i].children[0].textContent;
                tbody.children[i].insertAdjacentHTML('afterbegin', `<td class="text-center no-need">
                                                                        <div>
                                                                            <input class="i-check" type="checkbox" data-id="${id}" name="check_duplicar" />
                                                                        </div>
                                                                    </td>`);
            }

            fn_FormatTable();
        }

        function fn_iCheckDuplicar() {
            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                console.log($(this).data('id'));
                let bool = ovariables.lstAgregar.filter(x => x.id === $(this).data('id')).length;
                if (bool === 0) {
                    let IdHidden = { id: $(this).data('id') };
                    ovariables.lstAgregar.push(IdHidden);
                } else {
                    let filter = ovariables.lstAgregar.filter(x => x.id !== $(this).data('id'));
                    ovariables.lstAgregar = filter;
                }
            });
        }

        function fn_CrearReporte() {
            let html = '';
            html = `<table border="1">
                        <thead>
                            <tr>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N°</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cliente</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cliente Temporada</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Codigo Tela</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N° ATX</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Descripción</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">% Tela</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Densidad (oz./Yd.²)</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Lavado (BW/AW)</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Familia</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Trade Name</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Division</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Rango</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Modalidad</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Comentario</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (ovariables.lstDetalle.length > 0) {
                let aux = 0;
                ovariables.lstDetalle.forEach(x => {
                    if (aux === 0) {
                        aux++;
                        html += `<tr>
                                    <td align="center" style="background: #ffffff;">${x.IdSolicitudDetalle}</td>
                                    <td align="center" style="background: #ffffff;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #ffffff;">${x.NroATX}</td>
                                    <td align="left" style="background: #ffffff;">${x.Descripcion}</td>
                                    <td align="left" style="background: #ffffff;">${x.PorcentajeTela}</td>
                                    <td align="left" style="background: #ffffff;">${x.Densidad}</td>   
                                    <td align="left" style="background: #ffffff;">${x.Lavado}</td>
                                    <td align="left" style="background: #ffffff;">${x.Familia}</td>
                                    <td align="left" style="background: #ffffff;">${x.TradeName}</td>
                                    <td align="left" style="background: #ffffff;">${x.Division}</td>
                                    <td align="left" style="background: #ffffff;">${x.Rango}</td>
                                    <td align="left" style="background: #ffffff;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #ffffff;">${x.Comentario}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td align="center" style="background: #d9d9d9;">${x.IdSolicitudDetalle}</td>
                                    <td align="center" style="background: #d9d9d9;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.NroATX}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Descripcion}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.PorcentajeTela}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Densidad}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.Lavado}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Familia}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.TradeName}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Division}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Rango}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Comentario}</td>
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Cotizaciones',
                style: '',
                table: html,
                filename: 'Reporte Cotizaciones'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_Cancelar: fn_Cancelar,
            fn_Aceptar: fn_Aceptar
        }
    }
)(document, 'panelEncabezado_BuscadorCotizacion');
(
    function ini() {
        appBuscadorCotizacion.load();
        appBuscadorCotizacion.req_ini();
    }
)();
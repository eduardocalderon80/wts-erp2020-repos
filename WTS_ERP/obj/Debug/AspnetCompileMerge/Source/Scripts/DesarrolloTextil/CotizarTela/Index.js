var appCotizadorTela = (
    function (d, idpadre) {
        var ovariables = {
            lstOrdenes: [],
            decimales: 2,
            lstSolicitud: [],
            lstDetalle: [],
            idorder: 0,
            habilitado: 0
        }

        function load() {
            //_('btnSearch').addEventListener('click', fn_buscar);
            _('btnSearch').onclick = function () {
                if (ovariables.idorder === 0) {
                    fn_buscarSolicitud();
                } else {
                    fn_buscar();
                }
            }
            _('btnCrearOrdenCotizacion').addEventListener('click', fn_new);
            _('btnSolicitudCotizacion').addEventListener('click', fn_nuevasolicitud);
            _('btnReporteExcel').addEventListener('click', fn_exportToExcel);
            _('tabSolicitud').addEventListener('click', fn_tabChange);
            _('tabCotizacion').addEventListener('click', fn_tabChange);

            // Datepicker
            _initializeDatepicker();
            $('.date-es').eq(0).datepicker('setDate', moment().subtract(1, 'months').format('DD/MM/YYYY'));
            $('.date-es').eq(1).datepicker('setDate', moment().format('DD/MM/YYYY'));

            $('.date-es').eq(2).datepicker('setDate', moment().subtract(1, 'months').format('DD/MM/YYYY'));
            $('.date-es').eq(3).datepicker('setDate', moment().format('DD/MM/YYYY'));

            // Add 1 day moment().add(1, 'days').format('DD/MM/YYYY')
        }

        function req_ini() {
            //fn_buscar();
            fn_buscarSolicitud();
            //fn_treeView_Tbl();
        }

        function fn_nuevasolicitud() {
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function fn_tabChange() {
            if (this.id == 'tabSolicitud') {
                _('divCotizacion').style.display = 'none';
                _('divSolicitud').style.display = 'block';

                //_('btnCrearOrdenCotizacion').style.display = 'none';
                _('btnReporteExcel').style.display = 'none';
                _('btnSolicitudCotizacion').style.display = 'initial';

                // Cambia order
                ovariables.idorder = 0;

                // Se llena tabla solicitud
                fn_buscarSolicitud();
            } else {
                _('divCotizacion').style.display = 'block';
                _('divSolicitud').style.display = 'none';

                //_('btnCrearOrdenCotizacion').style.display = 'initial';
                _('btnReporteExcel').style.display = 'initial';
                _('btnSolicitudCotizacion').style.display = 'none';

                // Cambia order
                ovariables.idorder = 1;

                // Se llena tabla cotizacion
                fn_buscar();
            }
        }

        function fn_buscarSolicitud() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { fechainicio: _('txtFechaInicioSolicitud').value, fechafin: _('txtFechaFinSolicitud').value, estado: _('cboEstadoSolicitud').value };
            _Get('DesarrolloTextil/CotizarTela/GetData_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstSolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud) : '';
                        ovariables.lstDetalle = rpta[0].detalle !== '' ? JSON.parse(rpta[0].detalle) : '';
                        ovariables.habilitado = rpta[0].habilitado;
                        //ovariables.habilitado = 0
                        fn_CrearTablaSolicitud(ovariables.lstSolicitud);
                    }
                }, (p) => { err(p); });
        }

        function fn_CrearTablaSolicitud(_json) {
            let data = _json, html = '', htmlbody = '', boton = '';
            html = `
                <table id="tbl_solicitud" class ="table table-bordered table-hover" style="width:100%">
                    <thead>
                        <tr>
                            <th></th>
                            <th>N°</th>
                            <th>Fecha Creacion</th>
                            <th>Observaciones</th>
                            <th>Total Cotizaciones</th>
                            <th>Usuario Creacion</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (data.length > 0) {
                data.forEach(x => {
                    if (x.Enviar === 1) {
                        boton = `<button class="btn btn-info btn-lightblue dim" onclick="appCotizadorTela.fn_SendTreeViewAll(${x.IdSolicitudCotizar})" style="margin-left: 4px;">
                                    <span class="fa fa-send"></span>
                                </button>`;
                    } else {
                        boton = '';
                    }
                    htmlbody += `
                        <tr>
                            <td class="details-control">
                                <button class="btn btn-info dim" data-id="${x.IdSolicitudCotizar}">
                                    <i class="fa fa-plus"></i> 
                                </button>
                            </td>
                            <td class="pt-15">${x.IdSolicitudCotizar}</td>
                            <td class="pt-15">${x.FechaCreacion}</td>
                            <td class="pt-15">${x.Observaciones}</td>
                            <td class="pt-15">${x.TotalCotizaciones}</td>
                            <td class="pt-15">${x.UsuarioCreacion}</td>
                            <td class="text-center">
                                <button class="btn btn-info dim" onclick="appCotizadorTela.fn_NuevoDetalle(${x.IdSolicitudCotizar})">
                                    <span class="fa fa-edit"></span>
                                </button>
                                <button class="btn btn-danger dim" data-type="0" data-id="${x.IdSolicitudCotizar}" onclick="appCotizadorTela.fn_DeleteTreeView(this)">
                                    <span class="fa fa-trash-o"></span>
                                </button>`+ boton +`
                            </td>
                        </tr>
                    `;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_solicitud').innerHTML = html;

            fn_FormatTreeView_Tbl();
        }

        function fn_CreateTreeView(json) {
            let html = '', htmlbody = '', botones = '';
            html = `<table class ="table table-bordered table-hover" style="width:100%; margin-bottom: 0px;">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Cliente</th>
                                <th>Cliente Temporada</th>
                                <th>Codigo Tela</th>
                                <th>N° ATX</th>
                                <th>Descripción</th>
                                <th>Trade Name</th>
                                <th>Division</th>
                                <th>Rango</th>
                                <th>Modalidad</th>
                                <th>Comentario</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (json.length > 0) {
                json.forEach(x => {

                    if (x.Estado === 0) {
                        botones = `<div style="display: flex; width: 110px; margin: 0 auto 0 auto;">
                                        <button class="btn btn-sm btn-info" style="margin-right: 5px;" onclick="appCotizadorTela.fn_EditTreeView(${x.IdSolicitudDetalle})">
                                            <span class="fa fa-edit"></span>
                                        </button>
                                        <button class="btn btn-sm btn-danger" style="margin-right: 5px;" data-type="1" data-id="${x.IdSolicitudDetalle}" onclick="appCotizadorTela.fn_DeleteTreeView(this)">
                                            <span class="fa fa-trash-o"></span>
                                        </button>
                                        <button class="btn btn-sm btn-lightblue custom-tooltip" onclick="appCotizadorTela.fn_SendTreeView(${x.IdSolicitudDetalle})">
                                            <span class="data-placement">Enviar detalle</span>
                                            <span class="fa fa-send"></span>
                                        </button>
                                   </div>`;
                    } else if (x.Estado === 1) {
                        if (ovariables.habilitado === 1) {
                            botones = `<div style="display: flex; width: 110px; margin: 0 auto 0 auto;">
                                            <button class="btn btn-sm btn-info" style="margin-right: 5px;" disabled>
                                                <span class="fa fa-edit"></span>
                                            </button>
                                            <button class="btn btn-sm btn-danger" style="margin-right: 5px;" disabled>
                                                <span class="fa fa-trash-o"></span>
                                            </button>
                                            <button class="btn btn-sm btn-primary custom-tooltip" onclick="appCotizadorTela.fn_SendTreeView(${x.IdSolicitudDetalle})">
                                                <span class="data-placement">Por procesar</span>
                                                <span class="fa fa-play"></span>
                                            </button>
                                       </div>`;
                        } else {
                            botones = `<div style="display: flex; width: 110px; margin: 0 auto 0 auto;">
                                            <button class="btn btn-sm btn-info" style="margin-right: 5px;" disabled>
                                                <span class="fa fa-edit"></span>
                                            </button>
                                            <button class="btn btn-sm btn-danger" style="margin-right: 5px;" disabled>
                                                <span class="fa fa-trash-o"></span>
                                            </button>
                                            <button class="btn btn-sm btn-primary custom-tooltip" disabled>
                                                <span class="data-placement">Por procesar</span>
                                                <span class="fa fa-play"></span>
                                            </button>
                                       </div>`;
                        }
                    } else if (x.Estado === 2) {
                        if (ovariables.habilitado === 1) {
                            botones = `<div>
                                            <button class="btn btn-sm btn-warning custom-tooltip" onclick="appCotizadorTela.fn_edit(this)" data-idorden="${x.IdOrden}">
                                                <span class="data-placement">En proceso</span>
                                                <span class="fa fa-play"></span>
                                            </button>
                                       </div>`;
                        } else {
                            botones = `<div>
                                            <button class="btn btn-sm btn-warning custom-tooltip" disabled>
                                                <span class="data-placement">En proceso</span>
                                                <span class="fa fa-play"></span>
                                            </button>
                                       </div>`;
                        }
                    } else {
                        botones = `<div style="display: flex; width: 70px; margin: 0 auto 0 auto;">
                                        <button class="btn btn-sm btn-default" style="margin-right: 5px;" onclick="appCotizadorTela.fn_view(this)" data-idorden="${x.IdOrden}">
                                            <span class="fa fa-eye"></span>
                                        </button>
                                        <button class="btn btn-sm btn-success custom-tooltip" disabled>
                                            <span class="data-placement">Finalizado</span>
                                            <span class="fa fa-play"></span>
                                        </button>
                                   </div>`;
                    }

                    htmlbody += `<tr>
                                    <td>${x.IdSolicitudDetalle}</td>
                                    <td>${x.NombreCliente}</td>
                                    <td>${x.CodigoClienteTemporada}</td>
                                    <td>${x.CodigoTela}</td>
                                    <td>${x.NroATX}</td>
                                    <td>${x.Descripcion}</td>
                                    <td>${x.TradeName}</td>
                                    <td>${x.Division}</td>
                                    <td>${x.Rango}</td>
                                    <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td>${x.Comentario}</td>
                                    <td class="text-center">${botones}</td>
                                 </tr>`;
                });
            }

            return html += htmlbody + '</tbody></table>';
        }

        function fn_EditTreeView(id) {
            let filter = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === id)[0];
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,id:' + id + ',idaux:' + filter.IdSolicitudCotizar);
        }

        function fn_NuevoDetalle(id) {
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:new,id:' + id);
        }

        function fn_DeleteTreeView(button) {
            let type = button.getAttribute("data-type");
            let id = button.getAttribute("data-id");
            let title = "", text = "";
            if (_parseInt(type) === 1) {
                title = "Eliminar Detalle";
                text = "¿Estas seguro/a que deseas eliminar Detalle N°"+ id +"?";
            } else {
                title = "Eliminar Solicitud";
                text = "¿Estas seguro/a que deseas eliminar Solicitud N°"+ id +"? <br /> <span style='font-weight: 400; font-size: 14px;'>Al eliminar la solicitud, tambien eliminaras todos los detalles relacionados</span>";
            }
            swal({
                html: true,
                title: title,
                text: text,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idsolicitud: id, tipo: type };
                _Get('DesarrolloTextil/CotizarTela/Delete_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });
                            fn_buscarSolicitud();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_SendTreeViewAll(id) {
            swal({
                html: true,
                title: "Enviar Detalles",
                text: "¿Estas seguro/a que deseas enviar TODOS los Detalle de la Solicitud N°" + id + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al enviar los detalles, estos no podran ser editados o eliminados</span>",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const url = 'DesarrolloTextil/CotizarTela/SaveData_SolicitudCotizarTela';
                const parametro = { accion: 'update', idsolicitud: id, tipo: 1 };
                const form = new FormData();
                form.append('par', JSON.stringify(parametro));
                Post(url, form, function (rpta) {
                    if (rpta !== '') {
                        swal({ title: "¡Buen Trabajo!", text: "Haz enviado los Detalles de Cotizacion con exito", type: "success" });
                        fn_buscarSolicitud();
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                });
            });
        }

        function fn_SendTreeView(id) {
            let estado = appCotizadorTela.ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === id)[0].Estado
            if (estado === 1) {
                let filter = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === id)[0];
                let urlAccion = 'DesarrolloTextil/CotizarTela/New';
                _Go_Url(urlAccion, urlAccion, 'accion:new2,id:' + id + ',idaux:' + filter.IdSolicitudCotizar);
            } else {
                swal({
                    html: true,
                    title: "Enviar Detalle",
                    text: "¿Estas seguro/a que deseas enviar el Detalle N°"+ id +"? <br /> <span style='font-weight: 400; font-size: 14px;'>Al enviar el detalle, este no podra ser editado o eliminado</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    const url = 'DesarrolloTextil/CotizarTela/SaveData_SolicitudCotizarTela';
                    const parametro = { accion: 'update', idsolicitud: id, tipo: 0 };
                    const form = new FormData();
                    form.append('par', JSON.stringify(parametro));
                    Post(url, form, function (rpta) {
                        if (rpta !== '') {
                            swal({ title: "¡Buen Trabajo!", text: "Haz enviado el Detalle de Cotizacion con exito", type: "success" });
                            fn_buscarSolicitud();
                            //let urlAccion = 'DesarrolloTextil/CotizarTela/New';
                            //_Go_Url(urlAccion, urlAccion, 'accion:new2,id:' + id);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    });
                });
            }
        }

        function fn_FormatTreeView_Tbl() {
            var table = $('#tbl_solicitud').DataTable({
                info: false,
                "lengthMenu": [5, 10, 25, 50],
                "order": [[1, "desc"]],
                "columnDefs": [
                    { "orderable": false, "targets": 0 },
                    { "orderable": false, "targets": 5 }
                ],
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

            $('#tbl_solicitud tbody').on('click', 'td.details-control button', function () {
                let idSolicitudCotizar = $(this).data('id');
                let tr = $(this).closest('tr');
                let tdi = tr.find("i.fa");
                let row = table.row(tr);
                let filterData = ovariables.lstDetalle.filter(x => x.IdSolicitudCotizar == idSolicitudCotizar);

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

        function fn_buscar() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { fechainicio: _('txtFI').value, fechafin: _('txtFF').value, estado: _('cboEstado').value };
            _Get('DesarrolloTextil/CotizarTela/GetAll_Cotizar_Tela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let ordencotizacion = rpta[0].ordencotizacion !== '' ? CSVtoJSON(rpta[0].ordencotizacion) : null;
                        ovariables.habilitado = rpta[0].habilitado;
                        //ovariables.habilitado = 0
                        ovariables.lstOrdenes = ordencotizacion;
                        fn_cargartabla(ovariables.lstOrdenes);
                    }
                }, (p) => { err(p); });
        }

        function fn_cargartabla(data) {
            let div = _('div_tbl_orden'), html = '', modalidad = '', semaforo = '', codigo = '', botones = '';
            div.innerHTML = "";
            html = `
                        <table id="tbl_index_orden" class ="table table-bordered table-hover" style="width: 100%;">                            
                                    <thead>
                                        <tr>
                                            <th class="align-middle"></th>
                                            <th class="align-middle">N°</th>
                                            <th class="align-middle">Estado</th>
                                            <th class="align-middle">Fecha de Cotizacion</th>
                                            <th class="align-middle">Cliente</th>
                                            <th class="align-middle">Temporada</th>
                                            <th class="align-middle">Código</th>
                                            <th class="align-middle">Código Tela</th>   
                                            <th class="align-middle">Familia</th>   
                                            <th class="align-middle">Densidad<br/> (oz./Yd.²)</th>
                                            <th class="align-middle">Ancho Util</th>
                                            <th class="align-middle">Modalidad</th>
                                            <th class="align-middle">Semaforo</th>
                                            <th class="align-middle">RENDIMIENTO<br/> m/Kg</th>
                                            <th class="align-middle">RENDIMIENTO<br/> Yd/Kg</th>
                                            <th class="align-middle">PRECIO <br/>RESULTANTE US$/Kg.</th>
                                            <th class="align-middle">PRECIO <br/>RESULTANTE $/m</th>
                                            <th class="align-middle">PRECIO <br/>RESULTANTE $/Yd</th>
                                            <th class="align-middle">Dias</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/> ORDEN Kg</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/> ORDEN m</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/> ORDEN Yd</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/> COLOR Kg</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/> COLOR m</th>
                                            <th class="align-middle">CANTIDAD MÍNIMA/<br/>COLOR Yd</th>
                                            <th class="align-middle">STOCK COLOR</th>
                                            <th class="align-middle">STOCK Kg</th>
                                            <th class="align-middle">STOCK m</th>
                                            <th class="align-middle">STOCK Yd</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tb_index_orden">
                        `;
            if (data !== null) {
                data.forEach(x => {
                    modalidad = x.modalidad === "M" ? 'Muestra' : 'Produccion';

                    switch (x.semaforo) {
                        case 'V':
                            semaforo = '<span class="badge badge-primary">VERDE</span>';
                            break;
                        case 'A':
                            semaforo = '<span class="badge badge-warning">AMARILLO</span>';
                            break;
                        case 'R':
                            semaforo = '<span class="badge badge-danger">ROJO</span>';
                            break;
                    }

                    codigo = x.codigo.trim();

                    // Condicional Estado
                    if (_parseInt(x.estado) === 0) {
                        if (ovariables.habilitado === 1) {
                            if (_parseInt(x.historial) === 1) {
                                botones = `<div style="display: flex; margin-top: 10px;">
                                                <button class="btn btn-sm btn-info" onclick="appCotizadorTela.fn_edit(this)" data-idorden="${x.idorden}" title="Informacion Colgador" style="margin-right: 5px;">
                                                    <span class="fa fa-edit"></span>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="appCotizadorTela.fn_cambiar_estado(this)" data-idorden="${x.idorden}" title="Dar de baja Colgador" style="margin-right: 5px;">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                                <button class="btn btn-sm btn-default" onclick="appCotizadorTela.fn_Historial(${x.idorden})" title="Ver Historial">
                                                    <span class="fa fa-list"></span>
                                                </button>
                                            </div>`;
                            } else {
                                botones = `<div style="display: flex; width: 70px; margin: 10px auto 0 auto;">
                                                <button class="btn btn-sm btn-info" onclick="appCotizadorTela.fn_edit(this)" data-idorden="${x.idorden}" title="Informacion Colgador" style="margin-right: 5px;">
                                                    <span class="fa fa-edit"></span>
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="appCotizadorTela.fn_cambiar_estado(this)" data-idorden="${x.idorden}" title="Dar de baja Colgador">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                            </div>`;
                            }
                        } else {
                            botones = `<div style="display: flex; width: 70px; margin: 10px auto 0 auto;">
                                            <button class="btn btn-sm btn-info" title="Informacion Colgador" style="margin-right: 5px;" disabled>
                                                <span class="fa fa-edit"></span>
                                            </button>
                                            <button class="btn btn-sm btn-danger" title="Dar de baja Colgador" disabled>
                                                <span class="fa fa-trash"></span>
                                            </button>
                                        </div>`;
                        }
                    } else {
                        if (ovariables.habilitado === 1) {
                            botones = `<div style="display: flex; margin-top: 10px;">
                                            <button class="btn btn-sm btn-default" onclick="appCotizadorTela.fn_view(this)" data-idorden="${x.idorden}" title="Ver Colgador" style="margin-right: 5px;">
                                                <span class="fa fa-eye"></span>
                                            </button>
                                            <button class="btn btn-sm btn-default" onclick="appCotizadorTela.fn_Historial(${x.idorden})" title="Ver Historial" style="margin-right: 5px;">
                                                <span class="fa fa-list"></span>
                                            </button>
                                            <button class="btn btn-sm btn-default" onclick="appCotizadorTela.fn_ReprocesarOrden(${x.idorden})" title="Reprocesar Colgador">
                                                <span class="fa fa-refresh"></span>
                                            </button>
                                        </div>`;
                        } else {
                            botones = `<div style="margin-top: 10px;">
                                            <button class="btn btn-sm btn-default" onclick="appCotizadorTela.fn_view(this)" data-idorden="${x.idorden}" title="Ver Colgador">
                                                <span class="fa fa-eye"></span>
                                            </button>
                                        </div>`;
                        }
                    }  

                    html += `<td class="text-center">${botones}</td>
                             <td>${x.idorden}</td>
                             <td class="text-center">${fn_ReturnEstado(_parseInt(x.estado))}</td>
                             <td>${x.fecha}</td>
                             <td>${x.nombrecliente}</td>
                             <td class="text-center">${x.codigoclientetemporada}</td>
                             <td>${codigo}</td>
                             <td>${x.codigotela}</td>         
                             <td>${x.nombrefamilia}</td>         
                             <td class="text-center">${x.densidadozyd}</td>
                             <td class="text-center">${x.anchoutil}</td>
                             <td class="text-center">${modalidad}</td>
                             <td class="text-center">${semaforo}</td>
                             <td>${x.rendimientomkg}</td>
                             <td>${x.rendimientoydkg}</td>
                             <td>${x.precioresultantekg}</td>
                             <td>${x.precioresultantem}</td>
                             <td>${x.precioresultanteyd}</td>     
                             <td>${x.dias}</td>     
                             <td>${x.cantidadminimaordenkg}</td>     
                             <td>${x.cantidadminimaordenm}</td>     
                             <td>${x.cantidadminimaordenyd}</td>    
                             <td>${x.cantidadminimacolorkg}</td>    
                             <td>${x.cantidadminimacolorm}</td>    
                             <td>${x.cantidadminimacoloryd}</td>    
                             <td>${x.stockcolor}</td>     
                             <td>${x.stockcolorkg}</td>     
                             <td>${x.stockcolorm}</td>     
                             <td>${x.stockcoloryd}</td>        
                         </tr>
                    `;
                });

                html += "</tbody></table>";
                div.innerHTML = html;
                formatTable();
                _('div_tbl_orden').style.overflowX = '';
            } else {
                html += "<tr><td colspan='29' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                div.innerHTML = html;
                _('div_tbl_orden').style.overflowX = 'auto';
                //formatTable();      
            }
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

        function formatTable() {           

            let iListLength = (jQuery.fn.dataTableExt.oPagination.iFullNumbersShowPage < 6 ? jQuery.fn.dataTableExt.oPagination.iFullNumbersShowPage : 6);

            $('#tbl_index_orden thead tr').clone(true).appendTo('#tbl_index_orden thead');
            $('#tbl_index_orden thead tr:eq(1) th').each(function (i) {
                var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Search ' + title + '" />');
                i == 0 ? "" : $(this).html('<input type="text" placeholder="Buscar" style="width:100%" data-index="' + i +'"/>');

                //$('input', this).on('keyup change', function () {
                //    if (table.column(i).search() !== this.value) {
                //        table
                //            .column(i)                            
                //            .search(this.value)
                //            .draw();
                //    }
                //});                
            });

            //var table = $('#tbl_index_orden').DataTable({          
            //    //bDestroy: true,
            //    //info: false,
            //    //bLengthChange: false,
            //    //retrieve: true,
            //    //orderCellsTop: true,
            //    //fixedHeader: true,
            //    pageLength: 7,
            //    scrollY: "500px",
            //    scrollX: true,
            //    scrollCollapse: true,
            //    //paging: false,
            //    searching: false,
            //    lengthChange: false,
            //    ordering: false,
            //    info: false,
            //    fixedColumns: {
            //        leftColumns: 7,
            //       // rightColumns: 1
            //    },
            //    "language": {
            //        "lengthMenu": "Mostrar _MENU_ registros",
            //        "zeroRecords": "No se encontraron registros",
            //        "info": "Pagina _PAGE_ de _PAGES_",
            //        "infoEmpty": "No se encontraron registros",
            //        "paginate": {
            //            "next": "&#8250;",
            //            "previous": "&#8249;",
            //            "first": "&#171;",
            //            "last": "&#187;"
            //        },
            //    }
            //});

            var table = $('#tbl_index_orden').DataTable({
                pageLength: 7,
                scrollY: "500px",
                scrollX: true,
                scrollCollapse: true,
                searching: true,
                lengthChange: false,
                ordering: false,
                info: false,
                fixedColumns: {
                    leftColumns: 8
                },
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
                }
            });

            //$('#tbl_index_orden').DataTable().columns.adjust().draw();

            $(table.table().container()).on('keyup change', 'thead input', function () {
                console.log(this.value);
                table
                    .column($(this).data('index'))
                    .search(this.value)
                    .draw();
            });

            //table.columns().every(function () {
            //    var that = this;
            //    $('input').on('keyup change', function () {
            //        //if (that.search() == this.value) {
            //        //    that.search(this.value).draw();
            //        //}
            //        console.log($(this).val());
            //        table
            //            .column($(this).data('index'))
            //            .search(this.value)
            //            .draw();
            //    });
            //});

            $('#tbl_index_orden').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_index_orden_filter').hide();           
            $('#tbl_index_orden_length').hide();                       
        }

        function fn_edit(e) {
            let idorden = e.getAttribute("data-idorden");
            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,idorden:' + idorden);
        }

        function fn_view(e) {
            let idorden = e.getAttribute("data-idorden");
            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,idorden:' + idorden + ',estado:1');
        }

        function fn_Historial(id) {
            swal({
                title: "Ver Historial",
                text: "¿Deseas ver el historial de la Orden de Cotizacion N°" + id + "?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idorden: id };
                _Get('DesarrolloTextil/CotizarTela/GetData_CotizarTelaHistorial?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        if (resultado !== '') {
                            swal.close();
                            let urlAccion = 'DesarrolloTextil/CotizarTela/Historial';
                            _Go_Url(urlAccion, urlAccion, 'idorden:' + id);
                        } else {
                            swal({ title: "Sin Resultados", text: "No se encontraron resultados para la Orden de Cotizacion N°" + id, type: "warning" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_ReprocesarOrden(id) {
            swal({
                html: true,
                title: "Reprocesar Orden",
                text: "¿Estas seguro/a que deseas Reprocesar la Orden de Cotizacion N°" + id +"? <br /> <span style='font-weight: 400; font-size: 14px;'>Al reprocesar la orden, esta cambiara de estado FINALIZADO a PROCESO y pasara como historico</span>",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                //let err = function (__err) { console.log('err', __err) },
                //    parametro = { idorden: id };
                //_Get('DesarrolloTextil/CotizarTela/EditData_CotizarTelaReprocesar?par=' + JSON.stringify(parametro))
                //    .then((resultado) => {
                //        if (resultado !== '') {
                //            swal({ title: "¡Buen Trabajo!", text: "Haz reprocesado la Orden de Cotizacion N°"+ id, type: "success" });

                //            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
                //            _Go_Url(urlAccion, urlAccion, 'accion:edit,idorden:' + resultado);
                //        } else {
                //            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                //        }
                //    }, (p) => { err(p); });
            });
        }

        function fn_cambiar_estado(button) {
            let idorden = button.getAttribute('data-idorden');
            swal({
                title: "Esta seguro que desea eliminar este registro?",
                text: " ",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
            }, function (isConfirm) {
                if (isConfirm) {
                    let form = new FormData();
                    let urlaccion = 'DesarrolloTextil/CotizarTela/Eliminar_OrdenCotizacion', parametro = { idorden: idorden };
                    form.append('par', JSON.stringify(parametro));
                    Post(urlaccion, form, function (rpta) {
                        if (rpta !== '') {
                            _swal({ estado: 'success', mensaje: 'OK' });
                            fn_buscar();
                            return;
                        }
                        else {
                            _swal({ estado: 'error', mensaje: 'Could not delete' });
                        }
                    });
                    return;
                } else {

                }
            });
        }

        function fn_new(e) {
            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function fn_createHtmlExcel() {
            let html = '', modalidad = '', semaforo = '', codigo = '';
            html = `<thead>
                        <tr>
                            <th x:autofilter="all" rowspan="2" class="th-text">N°</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Estado</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Fecha de Cotizacion</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Cliente</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Temporada</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Código</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Código Tela</th>   
                            <th x:autofilter="all" rowspan="2" class="th-text">Familia</th>   
                            <th x:autofilter="all" rowspan="2" class="th-text">Densidad (oz./Yd.²)</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Ancho Util</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Modalidad</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Semaforo</th>
                            <th x:autofilter="all"rowspan="2" class="th-text">RENDIMIENTO m/Kg</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">RENDIMIENTO Yd/Kg</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">PRECIO RESULTANTE US$/Kg.</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">PRECIO RESULTANTE $/m</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">PRECIO RESULTANTE $/Yd</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">Dias</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / ORDEN Kg</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / ORDEN m</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / ORDEN Yd</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / COLOR Kg</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / COLOR m</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">CANTIDAD MÍNIMA / COLOR Yd</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">STOCK COLOR</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">STOCK Kg</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">STOCK m</th>
                            <th x:autofilter="all" rowspan="2" class="th-text">STOCK Yd</th>
                            <th rowspan="1" colspan="2" class="th-text">COMENTARIOS</th>
                        </tr>
                        <tr>
                            <th rowspan="1" class="th-text">OBSERVACIONES</th>
                            <th rowspan="1" class="th-text">RECORDAR</th>
                        </tr>
                    </thead>
                    <tbody>`;
            if (ovariables.lstOrdenes.length > 0) {
                ovariables.lstOrdenes.forEach(x => {
                    modalidad = x.modalidad === "M" ? 'Muestra' : 'Produccion';
                    codigo = x.codigo.trim();

                    html += `<td align="left">${x.idorden}</td>`;

                    if (x.estado == 0) {
                        html += `<td align="center" class="yellow">PROCESO</td>`;
                    } else {
                        html += `<td align="center" class="blue">FINALIZADO</td>`;
                    }

                    html += `<td align="center">${x.fecha}</td>
                             <td align="left">${x.nombrecliente}</td>
                             <td align="center">${x.codigoclientetemporada}</td>
                             <td align="left">${codigo}</td>
                             <td align="left">${x.codigotela}</td>         
                             <td align="left">${x.nombrefamilia}</td>         
                             <td align="left">${x.densidadozyd}</td>
                             <td align="left">${x.anchoutil}</td>
                             <td align="left">${modalidad}</td>`;

                    switch (x.semaforo) {
                        case 'V':
                            html += `<td align="left" class="green">VERDE</td>`;
                            break;
                        case 'A':
                            html += `<td align="left" class="yellow">AMARILLO</td>`;
                            break;
                        case 'R':
                            html += `<td align="left" class="red">ROJO</td>`;
                            break;
                    }

                    html += `<td align="left">${x.rendimientomkg}</td>
                             <td align="left">${x.rendimientoydkg}</td>
                             <td align="left">${x.precioresultantekg}</td>
                             <td align="left">${x.precioresultantem}</td>
                             <td align="left">${x.precioresultanteyd}</td>     
                             <td align="left">${x.dias}</td>     
                             <td align="left">${x.cantidadminimaordenkg}</td>     
                             <td align="left">${x.cantidadminimaordenm}</td>     
                             <td align="left">${x.cantidadminimaordenyd}</td>    
                             <td align="left">${x.cantidadminimacolorkg}</td>    
                             <td align="left">${x.cantidadminimacolorm}</td>    
                             <td align="left">${x.cantidadminimacoloryd}</td>    
                             <td align="left">${x.stockcolor}</td>     
                             <td align="left">${x.stockcolorkg}</td>     
                             <td align="left">${x.stockcolorm}</td>     
                             <td align="left">${x.stockcoloryd}</td>
                             <td align="left">${x.observaciones}</td>
                             <td align="left">${x.recordar}</td>
                         </tr>
                    `;
                });
            }

            return html + '</tbody>';
        }

        function fn_exportToExcel() {
            var uri = 'data:application/vnd.ms-excel;base64,';
            var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><style>{style}</style><table border="1">{table}</table></body></html>';
            var base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            };

            var format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };

            var ctx = {
                worksheet: 'Reporte Orden Cotizacion',
                style: '.th-text {background-color: #000000; color: white;} .blue{background-color: #2f74b5; color: white;} .green {background-color: #34b050; color: white;} .yellow{background-color: #ffff03;} .red{background-color: #f80200; color: white;}',
                table: fn_createHtmlExcel()
            }

            var link = document.createElement("a");
            link.download = "Reporte Orden Cotizacion.xls";
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_edit: fn_edit,
            fn_view: fn_view,
            fn_ReprocesarOrden: fn_ReprocesarOrden,
            fn_cambiar_estado: fn_cambiar_estado,
            ovariables: ovariables,
            fn_EditTreeView: fn_EditTreeView,
            fn_DeleteTreeView: fn_DeleteTreeView,
            fn_NuevoDetalle: fn_NuevoDetalle,
            fn_SendTreeView: fn_SendTreeView,
            fn_SendTreeViewAll: fn_SendTreeViewAll,
            fn_createHtmlExcel: fn_createHtmlExcel,
            fn_Historial: fn_Historial
        }
    }
)(document, 'panelEncabezado_index_IC');
(
    function ini() {
        appCotizadorTela.load();
        appCotizadorTela.req_ini();
    }
)();
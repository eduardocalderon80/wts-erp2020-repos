var appProgramaIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            permitir: false,
            lstprogramas: [],
            lstgrupos: [],
            lstestado: []
        }
        
        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();
    
            // Se añade focus para evitar abrir nuevo modal con enter
            $("#divContenido").focus();

            // Collapse Menu
            _collapseMenu();

            _initializeIboxTools();

            // Events
            _('btnNew').addEventListener('click', fn_new);
            _('btnUpdate').addEventListener('click', fn_update);
            _('cboGroup').addEventListener('change', fn_change );
            _('cboEstado').addEventListener('change', fn_change);
            _('btnMailbox').addEventListener('click', fn_mailbox);

            // Events Table
            _('btnEdit').addEventListener('click', fn_edit);
            _('btnDelete').addEventListener('click', fn_delete);

            $(".option-link").change(function () {
                $(".no-need").addClass("hide");
                if ($(this).data("id") === '#tab-1') {
                    $(".no-need").removeClass("hide");
                }
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { IdCatalogo_IdEstado: 48 };
            _Get('Requerimiento/Programa/GetListaProgramaIndex_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstprogramas = rpta.ListaProgramasCSV !== '' ? CSVtoJSON(rpta.ListaProgramasCSV) : [];
                        ovariables.lstgrupos = rpta.ListaGrupoPersonalCSV !== '' ? CSVtoJSON(rpta.ListaGrupoPersonalCSV) : [];
                        ovariables.lstestado = rpta.ListaEstadosProgramaCSV !== '' ? CSVtoJSON(rpta.ListaEstadosProgramaCSV) : [];

                        const cboEstado = ovariables.lstestado.map(x => {
                            return `<option value="${x.IdCatalogo}">${_capitalizeWord(x.NombreCatalogo)}</option>`
                        }).join('');
                        _('cboEstado').innerHTML = `<option value="">All</option>${cboEstado}`;

                        // PARA PERMISOS
                        _applyPermissions();
                        const info = _applyTable(ovariables.lstprogramas);
                        // Crear tabla
                        fn_createtable(info);
                    }
                }, (p) => { err(p); });
        }

        function fn_change() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    IdGrupoPersonal: _('cboGroup').value !== '' ? _('cboGroup').value : 0,
                    IdCatalogo_IdEstado: _('cboEstado').value !== '' ? _('cboEstado').value: 0
                };
            _Get('Requerimiento/Programa/GetListaProgramaIndexFilter_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? CSVtoJSON(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstprogramas = rpta;

                        // PARA PERMISOS
                        const info = _applyTable(ovariables.lstprogramas);
                        // Crear tabla
                        fn_createtable(info);
                    }
                }, (p) => { err(p); });
        }

        function fn_update() {
            $('.ibox').children('.ibox-content').prepend(`<div class="sk-spinner sk-spinner-double-bounce">
                                                            <div class="sk-double-bounce1"></div>
                                                            <div class="sk-double-bounce2"></div>
                                                        </div>`);
            $('.ibox').children('.ibox-content').toggleClass('sk-loading');
            req_ini();
            $('.ibox').children('.ibox-content').toggleClass('sk-loading');
        }

        function fn_new() {
            if (_isnotEmpty(_getUserInfo().IdGrupoPersonal)) {
                _modalBody_Backdrop({
                    url: 'Requerimiento/Programa/_NewProgram',
                    idmodal: 'NewProgram',
                    paremeter: 'accion:new,id:0',
                    title: 'New Program',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: '',
                    bloquearteclado: false,
                });
            } else {
                swal({ title: "Error", text: "You dont have an assigned commercial group", type: "error" });
            }
        }

        function fn_edit() {
            if ($("#tbl_programs tbody tr").hasClass("row-selected")) {
                const id = _par($(".row-selected").data("par"), 'id');
                const obj = ovariables.lstprogramas.filter(x => x.IdPrograma === id)[0];
                const rules = _checkRowInfo(id, obj, 'EDIT');
                if (rules) {
                    _modalBody_Backdrop({
                        url: 'Requerimiento/Programa/_NewProgram',
                        idmodal: 'NewProgram',
                        paremeter: `accion:edit,id:${id}`,
                        title: 'Edit Program',
                        width: '',
                        height: '',
                        backgroundtitle: 'bg-green',
                        animation: 'none',
                        responsive: '',
                        bloquearteclado: false,
                    });
                } else {
                    swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
                }
            } else {
                swal({
                    title: "Info",
                    text: "Select a row",
                    type: "info",
                    timer: 2000,
                    showCancelButton: false,
                    showConfirmButton: false
                });
            }
        }

        function fn_validacionAccion(accion, idPrograma) {

            let parametro = {
                Accion: accion,
                IdPrograma: idPrograma
            };

           
            let title = '';
            let text = '';
            let type = '';          
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));
            _Post('Requerimiento/Programa/GetValidarModificarPrograma_JSON', frm)
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        ovariables.permitir = rpta.Permiso == 1 ? true : false;
                        text = rpta.Descripcion;
                        type = rpta.Tipo;
                        title = rpta.Titulo;
                       
                        if (!(ovariables.permitir)) {

                            swal({
                                title: title,
                                text: text,
                                type: type,
                                timer: 5000,
                                showCancelButton: false,
                                confirmButtonColor: "#1c84c6",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        } else {

                            if (accion === 'Delete') { EliminarPrograma() };

                        }

                    }
                }, (p) => { err(p); });         

        }

        function fn_delete() {
            if ($("#tbl_programs tbody tr").hasClass("row-selected")) {
                const id = _par($(".row-selected").data("par"), 'id');
                const obj = ovariables.lstprogramas.filter(x => x.IdPrograma === id)[0];
                const rules = _checkRowInfo(id, obj, 'DELE');
                if (rules) {
                    let accion = 'Delete'
                    _promise()
                        .then(fn_validacionAccion(accion, id))
                } else {
                    swal({ title: "Error", text: "You dont have permission to do this", type: "error" });
                }
            } else {
                swal({
                    title: "Info",
                    text: "Select a row",
                    type: "info",
                    timer: 2000,
                    showCancelButton: false,
                    showConfirmButton: false
                });
            }
        }

        function EliminarPrograma() {
            const id = _par($(".row-selected").data("par"), 'id');
            const bpermiso = ovariables.permitir;
            if (bpermiso) {
                swal({
                    title: "Are you sure you want to delete this program?",
                    text: "Once deteled, It cannot be recovered.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = { IdPrograma: id },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Programa/DeleteProgramaById_JSON', frm)
                        .then((resultado) => {
                            let orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                swal({
                                    title: "Good job!",
                                    text: "The program was deleted successfully",
                                    type: "success",
                                    timer: 5000,
                                    showCancelButton: false,
                                    confirmButtonColor: "#1c84c6",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });
                                // Refresh
                                _('btnUpdate').click();
                            } else {
                                swal({
                                    title: "The data you are trying to add already exists in the list",
                                    text: "Please check the list",
                                    type: "error",
                                    timer: 5000,
                                    showCancelButton: false,
                                    confirmButtonColor: "#1c84c6",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_createtable(data) {
            let tbody = '';
            const thead = `<thead>
                                <tr>
                                    <th>Creation Date</th>
                                    <th>Update Date</th>
                                    <th>Program Name</th>
                                    <th>Group</th>
                                    <th>Client</th>
                                    <th>Brand</th>
                                    <th>Season</th>
                                    <th>Division</th>
                                    <th># Styles</th>
                                    <th># Fabrics</th>
                                    <th>Program Status</th>
                                </tr>
                            </thead>`;
            if (data.length > 0) {
                tbody = data.map(x => {
                    return `<tr data-par="id:${x.IdPrograma},nombre:${x.Nombre},idcliente:${x.IdCliente},cliente:${x.NombreCliente},temporada:${x.NombreTemporada},division:${x.NombreDivision},marca:${x.NombreMarca},idgrupopersonal:${x.IdGrupoPersonal}">
                                <td>${x.FechaCreacion}</td>
                                <td>${x.FechaActualizacion}</td>
                                <td class="text-left">${x.Nombre}</td>
                                <td>${x.CodigoGrupoPersonal}</td>
                                <td class="text-left">${x.NombreCliente}</td>
                                <td class="text-left">${x.NombreMarca}</td>
                                <td>${x.NombreTemporada}</td>
                                <td>${x.NombreDivision}</td>
                                <td>${x.TotalEstilosxPrograma}</td>
                                <td>${x.TotalTelasxPrograma}</td>
                                <td>${fn_labelstatus(x.NombreCatalogo_Estado)}</td>
                            </tr>`;
                }).join('');
            }

            const table = `<table class="table table-center table-striped table-hover" id="tbl_programs">${thead}<tbody>${tbody}</tbody></table>`;
            _('tab-1').innerHTML = table;

            fn_formattable();
        }

        function fn_labelstatus(status) {
            let html = ``;
            if (status === 'Active') {
                html = `<span class="label label-warning">Active</span>`;
            } else if (status === 'Dropped') {
                html = `<span class="label label-default">Dropped</span>`;
            } else if (status === 'Finished') {
                html = `<span class="label label-success">Finished</span>`;
            }
            return html;
        }

        function fn_formattable() {
            let table = $('#tbl_programs').DataTable({
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
                info: false,
                lengthChange: false,
                //lengthMenu: [4, 10],
                pageLength: 4,
                order: [1, 'desc'],
                columnDefs: [
                    { targets: 'no-sort', orderable: false }
                ],
                ordering: true,
                drawCallback: function () {
                    // Row Selected
                    $("#tbl_programs tbody tr").css("cursor", "pointer");
                    $("#tbl_programs tbody tr").removeClass("row-selected");
                    $("#tbl_programs tbody tr").click(function (e) {
                        if ($(this).hasClass("row-selected")) {
                            const par = $(this).data("par");
                            const id = _par(par, 'id');
                            const nombre = _par(par, 'nombre');
                            const idcliente = _par(par, 'idcliente');
                            const cliente = _par(par, 'cliente');
                            const temporada = _par(par, 'temporada');
                            const division = _par(par, 'division');
                            const marca = _par(par, 'marca');
                            const idgrupopersonal = _par(par, 'idgrupopersonal');
                            fn_viewstages(id, nombre, idcliente, cliente, temporada, division, marca, idgrupopersonal);
                        } else {
                            $("#tbl_programs tbody tr").removeClass("row-selected");
                            $(this).addClass("row-selected");
                        }
                        e.stopImmediatePropagation();
                    });

                    // Disable empty
                    $(".dataTables_empty").css("pointer-events", "none");
                }
            });

            // Move paginate
            $("#tbl_programs tfoot tr td").children().remove();
            $("#tbl_programs_paginate").appendTo("#tbl_programs tfoot tr td");

            // Custom Search
            $('#txtBuscar').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_programs_filter').hide();

            //// Filter by default
            //table.column(2).search($('#cboGroup').val()).draw();
            //table.column(9).search($('#cboEstado').val()).draw();

            //// Filter change
            //$('#cboGroup').on('change', function () {
            //    table.column(2).search($(this).val()).draw();
            //});
            //$('#cboEstado').on('change', function () {
            //    table.column(9).search($(this).val()).draw();
            //});

            // Change length
            $('.fullscreen-link').on('click', function () {
                let icon = $(this).children().eq(0).attr("class");
                if (icon === 'fa fa-compress') {
                    table.page.len(10).draw();
                } else {
                    table.page.len(4).draw();
                }
            });

            // Fix Padding
            $('#tbl_programs_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_programs").parent().css("overflow-x", 'auto');
        }

        function fn_viewstages(id, nombre, idcliente, cliente, temporada, division, marca, idgrupopersonal) {
            const urlAccion = 'Requerimiento/Programa/Stages';
            _Go_Url(urlAccion, urlAccion, `accion:edit,id:${id},nombre:${nombre},idcliente:${idcliente},cliente:${cliente},temporada:${temporada},division:${division},marca:${marca},idgrupopersonal:${idgrupopersonal}`);
        }

        function fn_mailbox() {
            const urlAccion = 'Mailbox/Inbox/Index';
            _Go_Url(urlAccion, urlAccion);
        }

        /* PARA PERMISOS */
        function _applyTable(data) {
            let output = [];
            if (data !== null) {
                const pers = _getUserPermissions();
                const user = _getUserInfo();
                if (pers !== null) {
                    pers.forEach(x => {
                        if (x.Tipo === 'OWNGROUP') {
                            output.push(...data.filter(z => z.IdGrupoPersonal === user.IdGrupoPersonal.toString()));
                        } else if (x.Tipo === 'OTHERGROUP') {
                            output.push(...data.filter(z => z.IdGrupoPersonal === x.IdGrupoPersonal.toString()));
                        }
                    });
                } else {
                    output.push(...data.filter(z => z.IdGrupoPersonal === user.IdGrupoPersonal.toString()));
                }
            }
            return output;
        }
        function _applyPermissions() {
            const data = _getUserPermissions();
            if (data !== null) {
                let arr = [];
                const user = _getUserInfo();
                data.forEach(x => {
                    if (x.Tipo === 'OWNGROUP') {
                        ovariables.lstgrupos.filter(z => z.IdGrupoPersonal === user.IdGrupoPersonal.toString())[0] !== undefined ?
                            arr.push(ovariables.lstgrupos.filter(z => z.IdGrupoPersonal === user.IdGrupoPersonal.toString())[0]) : null;
                    } else if (x.Tipo === 'OTHERGROUP') {
                        ovariables.lstgrupos.filter(z => z.IdGrupoPersonal === x.IdGrupoPersonal.toString())[0] !== undefined ?
                            arr.push(ovariables.lstgrupos.filter(z => z.IdGrupoPersonal === x.IdGrupoPersonal.toString())[0]) : null;
                    }
                });

                const cboGrupos = arr.map(x => {
                    return `<option value="${x.IdGrupoPersonal}">${x.Codigo}</option>`
                }).join('');
                _('cboGroup').innerHTML = `<option value="">All</option>${cboGrupos}`;

                // Por defecto primera vez filtra solo ACTIVOS
                _('cboEstado').value = 48;
                _('cboGroup').value = user.IdGrupoPersonal;
                if (_isEmpty(_('cboGroup').value)) {
                    _('cboGroup').value = "";
                    _dispatchEvent('cboGroup', 'change');
                }
            } else {
                const user = _getUserInfo();
                const arr = ovariables.lstgrupos.filter(x => x.IdGrupoPersonal === user.IdGrupoPersonal.toString());

                const cboGrupos = arr.map(x => {
                    return `<option value="${x.IdGrupoPersonal}">${x.Codigo}</option>`
                }).join('');
                _('cboGroup').innerHTML = `<option value="">All</option>${cboGrupos}`;

                // Por defecto primera vez filtra solo ACTIVOS
                _('cboEstado').value = 48;
                _('cboGroup').value = user.IdGrupoPersonal;
                if (_isEmpty(_('cboGroup').value)) {
                    _('cboGroup').value = "";
                    _dispatchEvent('cboGroup', 'change');
                }
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            _applyPermissions: _applyPermissions,
            _applyTable: _applyTable
        }
    }
)(document, 'panelEncabezado_ProgramasIndex');
(
    function ini() {
        appProgramaIndex.load();
        appProgramaIndex.req_ini();
    }
)();
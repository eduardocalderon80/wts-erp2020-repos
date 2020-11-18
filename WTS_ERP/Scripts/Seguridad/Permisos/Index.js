var appPermisosIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lstpermisos: [],
            lstacciones: []
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
            _('btnPermisoNew').addEventListener('click', fn_new);
            _('btnPermisoRefresh').addEventListener('click', req_ini);

            // Events Table
            _('btnTblPermisoEdit').addEventListener('click', fn_edit);
            _('btnTblPermisoDelete').addEventListener('click', fn_delete);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { Id: '' };
            _Get('Seguridad/Permisos/GetAll_Permisos?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstpermisos = rpta.lstpermisos !== '' ? JSON.parse(rpta.lstpermisos) : [];

                        let lstacciones = rpta.lstacciones !== '' ? JSON.parse(rpta.lstacciones) : [];
                        let json_acciones = {};
                        lstacciones.forEach(x => {
                            json_acciones[x.codcatalogo] = x.codigo;
                        });
                        ovariables.lstacciones = json_acciones;

                        // Crear tabla
                        fn_createtable(ovariables.lstpermisos);
                    }
                }, (p) => { err(p); });
        }

        function fn_format_action(data) {
            let html = "";
            if (data.length > 0) {
                data.forEach(x => {
                    html += `<span class="label label-primary" style="margin-right: 2px;">${ovariables.lstacciones[x.codigo]}</span>`;
                });
            }
            return html;
        }

        function fn_createtable(data) {
            let tbody = '';
            const thead = `<thead>
                                <tr>
                                    <th>Rol</th>
                                    <th>Person</th>
                                    <th>Window/Method</th>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Group</th>
                                </tr>
                            </thead>`;
            if (data.length > 0) {
                tbody = data.map(x => {
                    return `<tr data-id="${x.idpermiso}">
                                <td>${x.nombrerol}</td>
                                <td>${_capitalizePhrase(x.nombrepersonal)}</td>
                                <td>${x.funcion}</td>
                                <td>${fn_format_action(x.accion !== '' ? JSON.parse(x.accion) : [])}</td>
                                <td>${x.descripcion}</td>
                                <td>${x.tipo}</td>
                                <td>${x.grupo}</td>
                            </tr>`;
                }).join('');
            }

            const table = `<table class="table table-center table-striped table-hover" id="tbl_permisos">${thead}<tbody id="tbody_tbl_permisos">${tbody}</tbody></table>`;
            _('div_tbl_permisos').innerHTML = table;
            fn_formattable();
        }

        function fn_formattable() {
            let table = $('#tbl_permisos').DataTable({
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
                pageLength: 20,
                order: [0, 'desc'],
                columnDefs: [
                    { targets: 'no-sort', orderable: false }
                ],
                ordering: true,
                drawCallback: function () {
                    // Row Selected
                    $("#tbl_permisos tbody tr").css("cursor", "pointer");
                    $("#tbl_permisos tbody tr").removeClass("row-selected");
                    $("#tbl_permisos tbody tr").click(function (e) {
                        if ($(this).hasClass("row-selected")) {
                            const id = $(this).data("id");
                            //fn_edit(id);
                            $(this).removeClass("row-selected");
                        } else {
                            $("#tbl_permisos tbody tr").removeClass("row-selected");
                            $(this).addClass("row-selected");
                        }
                        e.stopImmediatePropagation();
                    });

                    // Disable empty
                    $(".dataTables_empty").css("pointer-events", "none");
                }
            });

            // Move paginate
            $("#tbl_permisos tfoot tr td").children().remove();
            $("#tbl_permisos_paginate").appendTo("#tbl_permisos tfoot tr td");

            // Custom Search
            $('#txtBuscar').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_permisos_filter').hide();

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
            $('#tbl_permisos_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_permisos").parent().css("overflow-x", 'auto');
        }

        function fn_new() {
            _modalBody_Backdrop({
                url: 'Seguridad/Permisos/_New',
                idmodal: 'NewPermission',
                paremeter: 'accion:new,id:0',
                title: 'New Permission',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'modal-750',
                bloquearteclado: false,
            });
        }

        function fn_edit() {
            if ($("#tbl_permisos tbody tr").hasClass("row-selected")) {
                const id = $(".row-selected").data("id");
                _modalBody_Backdrop({
                    url: 'Seguridad/Permisos/_New',
                    idmodal: 'NewPermission',
                    paremeter: `accion:edit,id:${id}`,
                    title: 'New Permission',
                    width: '',
                    height: '',
                    backgroundtitle: 'bg-green',
                    animation: 'none',
                    responsive: 'modal-750',
                    bloquearteclado: false,
                });
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

        function fn_delete() {
            if ($("#tbl_permisos tbody tr").hasClass("row-selected")) {
                const id = $(".row-selected").data("id");
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will delete this permission",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    //$(".row-selected").remove();
                    let err = function (__err) { console.log('err', __err) },
                        parametro = { IdPermiso: id },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Seguridad/Permisos/Delete_Permisos', frm)
                        .then((resultado) => {
                            let orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                req_ini();
                                swal({ title: "Good job!", text: "The permission was deleted successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
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

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_PermisosIndex');
(
    function ini() {
        appPermisosIndex.load();
        appPermisosIndex.req_ini();
    }
)();
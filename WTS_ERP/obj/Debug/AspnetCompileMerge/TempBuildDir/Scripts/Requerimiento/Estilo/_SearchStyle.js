var app_SearchStyle = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstcarryover: [],
            datatable: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnSearchStyleCopy').addEventListener('click', fn_copy);

            let par = _('searchstyle_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idprograma = _par(par, 'idprograma') !== '' ? _parseInt(_par(par, 'idprograma')) : 0;
            }
        }

        function fn_formattable(id) {
            // Crea footer
            _(`${id}`).createTFoot();
            _(`${id}`).tFoot.innerHTML = _(`${id}`).tHead.innerHTML;

            // Añade input text en footer por cada celda
            $(`#${id} tfoot th`).each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                $(this).addClass("no-sort");
                let element = $(this).data("search");
                if (element !== false) {
                    $(this).html('<input type="text" placeholder="Search" class="datatable-input" />');
                }
            });

            var table = $(`#${id}`).DataTable({
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
                pageLength: 5,
                ordering: false,
                "drawCallback": function () {
                    // Para duplicar
                    fn_icheck_select();
                },
            });

            ovariables.datatable = table;

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

            // Move custom search
            $(`#${id} tfoot tr`).appendTo(`#${id} thead`);
            $(`#${id} tfoot`).remove();

            // Hide table general search
            $(`#${id}_filter`).hide();

            // Remove form inline
            $(`#${id}_wrapper`).removeClass('form-inline');

            // Remove css
            $(`#${id}`).removeAttr("style");
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdPrograma: ovariables.idprograma };
            _Get('Requerimiento/Estilo/GetAllStylesCarryOverNew?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcarryover = rpta;
                        fn_createtable(ovariables.lstcarryover);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_style_copy');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.IdRequerimiento}">
                                <td class="text-center"><input class="i-check-style" type="radio" data-id="${x.IdRequerimiento}" name="input_search_style" /></td>
                                <td>${x.CodigoEstilo}</td>
                                <td>${x.CodigoTelaWTS}</td>
                                <td>${x.NombreProveedor}</td>
                                <td>${x.NombrePrograma}</td>
                                <td>${x.NombreCliente}</td>
                                <td>${x.NombreMarca}</td>
                                <td>${x.NombreTemporada}</td>
                                <td>${x.NombreDivision}</td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            }

            // DataTable
            fn_formattable('tbl_style_copy');
        }

        function fn_icheck_select() {
            $('.i-check-style').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                const id = $(this).data('id');
                const rows = ovariables.datatable.rows({ 'search': 'applied' }).nodes();
                $('.i-check-style', rows).prop('checked', false);
                $(`.i-check-style[data-id="${id}`).prop("checked", true)
                $('.i-check-style').iCheck('update');
            });
        }

        function fn_copy() {
            const rows = ovariables.datatable.rows({ 'search': 'applied' }).nodes();
            if ($('.i-check-style:checked', rows).length > 0) {
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will copy the selected style",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true
                }, function () {
                    const id = $('.i-check-style:checked', rows)[0].getAttribute("data-id");
                    fn_copy_modal(id);
                });
            } else {
                swal({ title: "Warning", text: "You have to select at least 1 row", type: "warning", timer: 5000 });
            }
        }

        function fn_copy_modal(id) {
            _modalBody_Backdrop({
                url: 'Requerimiento/Estilo/_CopyStyle',
                idmodal: 'CopyStyle',
                paremeter: `id:${id},accion:new,idcliente:${ovariables.idcliente},idprograma:${ovariables.idprograma}`,
                title: 'Copy Style',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_SearchStyle');
(
    function ini() {
        app_SearchStyle.load();
        app_SearchStyle.req_ini();
    }
)();
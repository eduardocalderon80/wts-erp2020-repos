var app_DisenoEdit = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            _('btnRegresar').addEventListener('click', fn_return);

            fn_formattable();
        }

        function fn_formattable() {
            var table = $('#tbl_movements').DataTable({
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
                order: [0, 'asc'],
                columnDefs: [
                    { targets: 'no-sort', orderable: false }
                ],
                ordering: true
            });

            // Move paginate
            $("#tbl_movements tfoot tr td").children().remove();
            $("#tbl_movements_paginate").appendTo("#tbl_movements tfoot tr td");

            // Hide table general search
            $('#tbl_movements_filter').hide();

            // Fix Padding
            $('#tbl_movements_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_movements").parent().css("overflow-x", 'auto');
        }

        function req_ini() {

        }

        function fn_return() {
            const urlAccion = 'Diseno/InventarioPrenda/Index';
            _Go_Url(urlAccion, urlAccion);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_DisenoEdit');
(
    function ini() {
        app_DisenoEdit.load();
        app_DisenoEdit.req_ini();
    }
)();
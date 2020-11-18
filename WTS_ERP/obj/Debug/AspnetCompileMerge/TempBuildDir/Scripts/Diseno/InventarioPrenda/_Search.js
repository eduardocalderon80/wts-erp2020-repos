var app_Search = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            fn_formattable();

            $('.i-check-style').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            });
        }

        function fn_formattable() {
            var table = $('#tbl_search').DataTable({
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
            $("#tbl_search tfoot tr td").children().remove();
            $("#tbl_search_paginate").appendTo("#tbl_search tfoot tr td");

            // Hide table general search
            $('#tbl_search_filter').hide();

            // Fix Padding
            $('#tbl_search_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_search").parent().css("overflow-x", 'auto');
        }

        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_Search');
(
    function ini() {
        app_Search.load();
        app_Search.req_ini();
    }
)();
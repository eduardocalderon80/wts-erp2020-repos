var app_Period = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            _('btnRegresar').addEventListener('click', fn_return);
            [...document.querySelectorAll("#tbl_close input")].forEach(x => {
                x.addEventListener('keyup', fn_calculate_balance);
            });
            fn_formattable();
        }

        function fn_formattable() {
            var table = $('#tbl_close').DataTable({
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
            $("#tbl_close tfoot tr td").children().remove();
            $("#tbl_close_paginate").appendTo("#tbl_close tfoot tr td");

            // Hide table general search
            $('#tbl_close_filter').hide();

            // Fix Padding
            $('#tbl_close_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_close").parent().css("overflow-x", 'auto');
        }

        function fn_calculate_balance(e) {
            const input = e.currentTarget;
            const stockcontado = input.value;
            const tr = input.parentNode.parentNode;
            const stockfecha = tr.children[9].innerHTML;
            const stockcierre = tr.children[11];
            stockcierre.innerHTML = stockcontado !== '' ? stockcontado : 0;

            const diferencia = tr.children[12];
            const resultdiferencia = (stockcontado * 1) - (stockfecha * 1);
            const spancierrre = resultdiferencia < 0 ? `<span style='color:red'>${resultdiferencia}</span>` : resultdiferencia;
            diferencia.innerHTML = spancierrre;
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
)(document, 'panelEncabezado_Period');
(
    function ini() {
        app_Period.load();
        app_Period.req_ini();
    }
)();
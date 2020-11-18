var app_DisenoIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            _('btnReporte').addEventListener('click', fn_report);
            _('btnRegistrarMovimiento').addEventListener('click', fn_new);
            _('btnCerrarPeriodo').addEventListener('click', fn_close);
            _('btnDelete').addEventListener('click', fn_delete);

            fn_formattable();
            _initializeIboxTools();
        }

        function fn_formattable() {
            // Crea footer
            _('tbl_samples').createTFoot();
            _('tbl_samples').tFoot.innerHTML = _('tbl_samples').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_samples tfoot th').each(function () {
                $(this).addClass("no-sort");
                let element = $(this).data("search");
                if (element !== false) {
                    $(this).html('<input type="text" placeholder="Search" />');
                } else {
                    $(this).html('');
                }
            });

            var table = $('#tbl_samples').DataTable({
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
                ordering: true,
                drawCallback: function () {
                    // Row Selected
                    $("#tbl_samples tbody tr").css("cursor", "pointer");
                    $("#tbl_samples tbody tr").removeClass("row-selected");
                    $("#tbl_samples tbody tr").click(function (e) {
                        if (!$(this).hasClass("row-selected")) {
                            $("#tbl_samples tbody tr").removeClass("row-selected");
                            $(this).addClass("row-selected");
                        } else {
                            fn_edit();
                        }
                        e.stopImmediatePropagation();
                    });
                }
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

            $("#tbl_samples tfoot tr").appendTo("#tbl_samples thead");
            $("#tbl_samples tfoot").remove();

            // Move paginate
            $("#tbl_samples tfoot tr td").children().remove();
            $("#tbl_samples_paginate").appendTo("#tbl_samples tfoot tr td");

            // Hide table general search
            $('#tbl_samples_filter').hide();

            // Fix Padding
            $('#tbl_samples_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_samples").parent().css("overflow-x", 'auto');
        }

        function req_ini() {
            
        }

        function fn_report() {

        }

        function fn_edit() {
            const urlAccion = 'Diseno/InventarioPrenda/Edit';
            _Go_Url(urlAccion, urlAccion);
        }

        function fn_delete() {
            if ($("#tbl_samples tbody tr").hasClass("row-selected")) {
                swal({
                    title: "Are you sure you want to delete this sample?",
                    text: "Once deteled, It cannot be recovered.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes",
                    closeOnConfirm: false
                }, function () {
                    $("#tbl_samples tbody .row-selected").remove();
                    swal({
                        title: "Good job!",
                        text: "The sample was deleted successfully",
                        type: "success",
                        timer: 5000
                    });
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

        function fn_new() {
            const urlAccion = 'Diseno/InventarioPrenda/New';
            _Go_Url(urlAccion, urlAccion);
        }

        function fn_close() {
            const urlAccion = 'Diseno/InventarioPrenda/Period';
            _Go_Url(urlAccion, urlAccion);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_DisenoIndex');
(
    function ini() {
        app_DisenoIndex.load();
        app_DisenoIndex.req_ini();
    }
)();
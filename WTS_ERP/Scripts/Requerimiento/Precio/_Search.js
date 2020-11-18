var app_PriceSearch = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: '',
            lstsearch: [],
            lstflash: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnSearchPriceAdd').addEventListener('click', fn_add);

            const par = _('pricesearch_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idprograma = _par(par, 'idprograma');
            }
        }

        function fn_formattable() {
            // Crea footer
            _('tbl_price_search').createTFoot();
            _('tbl_price_search').tFoot.innerHTML = _('tbl_price_search').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_price_search tfoot th').each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                $(this).addClass("no-sort");
                let element = $(this).data("search");
                if (element !== false) {
                    $(this).html('<input type="text" placeholder="Search" class="datatable-input" />');
                }
            });

            var table = $('#tbl_price_search').DataTable({
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
            $("#tbl_price_search tfoot tr").appendTo("#tbl_price_search thead");
            $("#tbl_price_search tfoot").remove();

            // Hide table general search
            $('#tbl_price_search_filter').hide();

            // Remove form inline
            $('#tbl_price_search_wrapper').removeClass('form-inline');

            // Remove css
            $("#tbl_price_search").removeAttr("style");
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdCliente: ovariables.idcliente };
            _Get('Requerimiento/Precio/GetAllFlashCost_New?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstsearch = rpta;
                        fn_createtable(ovariables.lstsearch);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_price_search');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.idflashcost}">
                                <td><input class="i-check" type="checkbox" data-id="${x.idflashcost}" name="input_search_select" /></td>
                                <td>${x.tipoflashcost}</td>
                                <td>${x.fechacreacion}</td>
                                <td>${x.lider}</td>
                                <td>${x.estilo}</td> 
                                <td>${x.numeroEstiloCliente}</td>
                                <td>${x.cantidadtela}</td>
                                <td>${x.cantidadcolor}</td>
                                <td>${x.cantidadestilo}</td>
                                <td>${x.codigoTela}</td>
                                <td>${x.descripcionTela}</td>
                                <td>${parseFloat(x.pricefactoryfob).toFixed(2)}</td>
                                <td>${parseFloat(x.totalcostwts).toFixed(2)}</td>
                                <td>${parseFloat(x.pricewtsddp).toFixed(2)}</td>
                                <td>${parseFloat(x.adjustment).toFixed(2)}</td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            }

            // DataTable
            fn_formattable();
        }

        function fn_icheck_select() {
            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let bool = ovariables.lstflash.filter(x => x.IdFlashCost === $(this).data('id')).length;
                if (bool === 0) {
                    let IdHidden = { IdFlashCost: $(this).data('id') };
                    ovariables.lstflash.push(IdHidden);
                } else {
                    let filter = ovariables.lstflash.filter(x => x.IdFlashCost !== $(this).data('id'));
                    ovariables.lstflash = filter;
                }
            });
        }

        function fn_add() {
            if (ovariables.lstflash.length > 0) {
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will save the quotations entered",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                    let parametro = {
                        JSONInfo: ovariables.lstflash,
                        IdCliente: ovariables.idcliente,
                        IdPrograma: ovariables.idprograma
                    }
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Precio/InsertRequerimientoFlashCost', frm, true)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                $("#modal_SearchPrices").modal('hide');
                                swal({ title: "Good job!", text: "The prices was saved successfully", type: "success", timer: 5000 });
                                // Refresh
                                _('btnUpdate').click();
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Warning", text: "You have to select at least 1 row", type: "warning", timer: 5000 });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_SearchPrices');
(
    function ini() {
        app_PriceSearch.load();
        app_PriceSearch.req_ini();
    }
)();
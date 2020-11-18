
var app_searchtrim =
    (
        function (d, idpadre) {
            var ovariables = {
                id: 0,
                accion: '',
                idcliente: '',
                idprograma: '',
                aRows: [],
                aRowsSelected: [],
                idTable: 'tbl_searchtrim',
                isCheckBox: false, // [true: CheckBox, false: Radio]
                numPagina: 5,
                idTxtParametro: 'txtpar_searchtrim',
                urlGet: 'Requerimiento/Avio/GetAvioSearchAll_csv',
                tipoGetResult: 'CSV' //JSON,CSV
            }

            function cargaParameter() {

                const par = _(ovariables.idTxtParametro).value;
                if (!_isEmpty(par)) {
                    ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                    ovariables.accion = _par(par, 'accion');
                    ovariables.idcliente = _par(par, 'idcliente');
                    ovariables.idprograma = _par(par, 'idprograma');
                }
            }

            function DataTableTemplate(arr) {
                const html = arr.map(x => {
                    return `<tr data-par="idavios:${x.IdAvios},idrequerimiento:${x.IdRequerimiento}">
                                <td><input class="i-check" type="radio" data-id="${x.IdAvios}" name="input_search_select" /></td>
                                <td>${x.CodigoAvio}</td>
                                <td>${x.NombreProveedor}</td>
                                <td>${x.NombrePrograma}</td>
                                <td>${x.NombreCliente}</td>
                                <td>${x.NombreMarca}</td>
                                <td>${x.NombreTemporada}</td>
                                <td>${x.NombreDivision}</td>
                            </tr>`;
                }).join('');
                return html;
            }


            function load() {
                // Disable autocomplete by default
                _disableAutoComplete();
                // Events
                _('btnsearchtrimAdd').addEventListener('click', fn_copiar_trim, false);
                // Parameter
                cargaParameter();
            }

            function fn_copiar_trim() {
                let arr_chk_select = Array.from(_('tbl_searchtrim').getElementsByClassName('cls_chk_select')).filter(x => x.classList.value.indexOf('checked') >= 0);
                if (arr_chk_select.length > 0) {
                    let datapar = arr_chk_select[0].parentNode.parentNode.getAttribute('data-par');
                    let idrequerimiento = _par(datapar, 'idrequerimiento');
                    $("#modal_SearchTrim").modal('hide');
                    appStages.fn_copiartrim(idrequerimiento);
                } else {
                    _swal({ mensaje: 'Seleccione el avio porfavor...!', estado: 'error' });
                }
            }

            function DataTableIcheck(isCheckBox, cls_chk) {
                let classChecked = isCheckBox && isCheckBox === true ? `icheckbox_square-green ${cls_chk}` : `iradio_square-green ${cls_chk}`;
                $('.i-check').iCheck({
                    checkboxClass: classChecked,
                    radioClass: classChecked
                }).on('ifChanged', function (event) {
                    let isChecked = event.currentTarget.checked;
                    let IdRow = $(this).data('id');
                    let isRemoved = true;

                    if (isChecked) {
                        let existeIdRow = ovariables.aRowsSelected.some(x => x === IdRow);
                        if (!existeIdRow) {
                            isRemoved = false;
                        }
                        ovariables.aRowsSelected.push(IdRow);
                    }
                    if (isRemoved) {
                        let filterRowsSelected = ovariables.aRowsSelected.filter(x => x !== IdRow);
                        ovariables.aRowsSelected = filterRowsSelected;
                    }
                });

            }


            function DataTableFormat(IdTable) {
                // Crea footer
                _(IdTable).createTFoot();
                _(IdTable).tFoot.innerHTML = _(IdTable).tHead.innerHTML;

                // Añade input text en footer por cada celda

                $(`#${IdTable} tfoot th`).each(function () {
                    $(this).addClass("no-sort");
                    let element = $(this).data("search");
                    if (element !== false) {
                        $(this).html('<input type="text" placeholder="Search" class="datatable-input" />');
                    }
                });

                var table = $(`#${IdTable}`).DataTable({
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
                    pageLength: ovariables.numPagina,
                    ordering: false,
                    "drawCallback": function () {
                        // Para duplicar
                        DataTableIcheck(ovariables.isCheckBox, 'cls_chk_select');
                    },
                });

                // Buscar en keyup
                table.columns().every(function () {
                    var that = this;
                    $('input', this.footer()).on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value)
                                .draw();
                        }
                    });
                });


                // Move custom search
                $(`#${IdTable} tfoot tr`).appendTo(`#${IdTable} thead`);
                $(`#${IdTable} tfoot`).remove();

                // Hide table general search
                $(`#${IdTable}_filter`).hide();

                // Remove form inline
                $(`#${IdTable}_wrapper`).removeClass('form-inline');

                // Remove css
                $(`#${IdTable}`).removeAttr("style");
            }

            function DaTableLoad(aData, IdTable, CallTemplate) {
                let html = CallTemplate(aData);

                _(IdTable).tBodies[0].innerHTML = html;

                // DataTable
                DataTableFormat(IdTable);
            }


            function req_ini() {
                const parametro = { IdCliente: ovariables.idcliente, IdPrograma: ovariables.idprograma };// => searchtrim : obtener los parametros
                //const url = ovariables.urlGet?par=' + JSON.stringify(parametro)';
                const tipoGetResult = ovariables.tipoGetResult || 'JSON';
                _Get('Requerimiento/Avio/GetAvioSearchAll_csv?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let arr = resultado !== '' ? (tipoGetResult === 'JSON' ? JSON.parse(resultado) : CSVtoJSON(resultado)) : null;
                        if (arr !== null) {
                            ovariables.aRows = arr;
                            DaTableLoad(arr, ovariables.idTable,DataTableTemplate);
                        }
                    }).catch((e) => { console.error('error'); })
            }



            return {
                load: load,
                req_ini: req_ini,
                ovariables: ovariables
            }
        }
    )(document, 'panelEncabezado_searchtrim');

(
    function ini() {
        app_searchtrim.load();
        app_searchtrim.req_ini();
    }
)();

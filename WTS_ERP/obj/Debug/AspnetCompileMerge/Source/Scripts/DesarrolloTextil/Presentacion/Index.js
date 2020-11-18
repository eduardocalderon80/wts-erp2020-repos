var appPresentacion = (
    function (d, idpadre) {
        var ovariables = {
            lstPresentacion: [],
        }

        function load() {
            _('btnSearch').addEventListener('click', fn_buscar);
            _('btnRegistrarPresentacion').addEventListener('click', fn_new);

            $("#dtFI .input-group.date").datepicker({                
                format: 'mm/dd/yyyy',
                autoclose: true,                
            });
            
            $("#dtFF .input-group.date").datepicker({                
                format: 'mm/dd/yyyy',
                autoclose: true
            });

            $('#dtFI .input-group.date').datepicker('update', moment().subtract(1, 'month').format('MM/DD/YYYY'));            
            $('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('MM/DD/YYYY'));
        }

        function req_ini() {
            fn_buscar();
        }

        function fn_return(e) {
            let urlAccion = 'DesarrolloTextil/Presentacion/New';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function fn_buscar(e) {
            let err = function (__err) { console.log('err', __err) },
                parametro = { fechainicio: _('txtFI').value, fechafin: _('txtFF').value, estado: _('cboEstado').value };
            _Get('DesarrolloTextil/Presentacion/GetDataPresentaciones_CSV?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let lstpresentacion = rpta[0].lstPresentacion !== '' ? CSVtoJSON(rpta[0].lstPresentacion) : null;
                        ovariables.lstPresentacion = lstpresentacion;
                        fn_cargartabla(ovariables.lstPresentacion);
                    }
                }, (p) => { err(p); });
        }

        function fn_cargartabla(data) {
            let div = _('div_tbl_presentaciones'), html = '', estado = "";
            div.innerHTML = "";
            html = `
                        <table id="tbl_presentacion" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                                    <thead>
                                        <tr>
                                            <th style="width:2%">N°</th>
                                            <th style="width:10%">Presentacion</th>
                                            <th style="width:5%">Fecha Inicio</th>
                                            <th style="width:5%">Fecha Fin</th>
                                            <th style="width:15%">Descripcion</th>
                                            <th style="width:5%">Estado</th>      
                                            <th style="width:5%">Fecha Creacion</th>
                                            <th class="text-center no-sort" style="width:3%"></th>                                            
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_indexinventario">
                        `;
            if (data !== null) {
                data.forEach(x => {
                    switch (x.estado) {
                        case 'CRE':
                            estado = '<span class="badge badge-warning">CREADO</span>';
                            break;
                        case 'CAN':
                            estado = '<span class="badge badge-danger">CANCELADO</span>';
                            break;
                        case 'CER':
                            estado = '<span class="badge badge-primary">CERRADO</span>';
                            break;
                    }

                    html += `
                                <tr>                                                                      
                                    <td>${x.idpresentacion}</td>
                                    <td>${x.evento}</td>
                                    <td>${x.fechainicio}</td>
                                    <td>${x.fechafin}</td>
                                    <td>${x.descripcion}</td>
                                    <td class="text-center">${estado}</td>
                                    <td>${x.fechacreacion}</td>
                                    <td class="text-center">
                                        <div style="display: flex; width: 70px; margin: 0 auto 0 auto;">
                                            <button class="btn btn-sm btn-info" data-toggle="tooltip" name='ver_movimientos' onclick="appPresentacion.fn_edit(this)" data-idpresentacion='${x.idpresentacion}' title='Informacion Colgador' style="margin-right: 5px;">
                                                <span class="fa fa-edit" style="cursor:pointer;"></span>
                                            </button>
                                            <button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' onclick="appPresentacion.fn_eliminar(this)" data-idpresentacion='${x.idpresentacion}' title='Dar de baja Colgador'>
                                                <span class="fa fa-trash" style="cursor:pointer;"></span>
                                            </button>
                                        </div>
                                    </td>                                    
                                </tr>
                            `;
                });

                html += "</tbody></table>";
                div.innerHTML = html;
                formatTable();
            } else {
                html += "<tr><td colspan='13' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                div.innerHTML = html;             
            }
        }

        function formatTable() {

            $('#tbl_presentacion thead tr').clone(true).appendTo('#tbl_presentacion thead');
            $('#tbl_presentacion thead tr:eq(1) th').each(function (i) {
                var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Search" />');
                i == 7 ? "" : $(this).html('<input type="text" placeholder="Buscar" />');

                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                });
            });

            var table = $('#tbl_presentacion').DataTable({
                sPaginationType: "full_numbers",
                iDisplayLength: 10,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,
                "order": [[0, "desc"]],
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

            $('#tbl_presentacion').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_presentacion_filter').hide();
        }

        function fn_edit(e) {            
            let idpresentacion = e.getAttribute("data-idpresentacion");
            let urlAccion = 'DesarrolloTextil/Presentacion/Edit';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,idpresentacion:' + idpresentacion);
        }

        function fn_eliminar(button) {
            let idpresentacion = button.getAttribute('data-idpresentacion');
            swal({
                title: "Esta seguro que desea eliminar esta presentacion?",
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
                    let urlaccion = 'DesarrolloTextil/Presentacion/Eliminar_Presentacion', parametro = { idpresentacion: idpresentacion };
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
            let idpresentacion = 0;
            let urlAccion = 'DesarrolloTextil/Presentacion/Edit';
            _Go_Url(urlAccion, urlAccion, 'accion:new,idpresentacion:' + idpresentacion);
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_edit: fn_edit,
            fn_eliminar: fn_eliminar,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_index_IC');
(
    function ini() {
        appPresentacion.load();
        appPresentacion.req_ini();
    }
)();


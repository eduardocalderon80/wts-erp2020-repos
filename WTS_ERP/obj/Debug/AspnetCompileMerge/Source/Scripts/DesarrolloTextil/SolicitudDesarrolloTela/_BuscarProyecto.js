var appBuscarProyecto = (
    function (d, idpadre) {
        var ovariables = {
            lstProyectos: [],
            idproyecto: ''
        }

        function load() {
            ovariables.lstProyectos = appNewSDT.ovariables.lstproyectos;
            fn_creartabla(ovariables.lstProyectos);

            _('btnAgregarProyecto').addEventListener('click', fn_agregarproyecto_modal);
        }

        function fn_agregarproyecto_modal() {
            if (ovariables.idproyecto !== '') {
                let filter = ovariables.lstProyectos.filter(x => x.IdProyecto === ovariables.idproyecto)[0];
                // Agrega datos
                appNewSDT.ovariables.lstproyectos = filter;
                _('txtcodigopry').value = filter.Codigo;
                _('txtproyecto').innerHTML = filter.Codigo;
                _('txtdescripcionpry').value = filter.Descripcion;
                _('txtclientepry').value = filter.NombreCliente;
                _('txtaprobacionpry').value = filter.FechaAprobacion;
                _('txtestadopry').value = filter.Estado;
                appNewSDT.ovariables.idproyecto = filter.IdProyecto;
                // Cierra modal
                $('#modal__BuscarProyecto').modal('hide');
            } else {
                swal({ title: "Advertencia", text: "Tienes que seleccionar un proyecto", type: "warning" });
            }
        }

        function fn_creartabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_Proyectos" class ="table table-bordered table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th data-width="20px" data-search="false"></th>
                                <th data-width="120px">N° Proyecto</th>
                                <th data-width="180px">Descripcion</th>
                                <th data-width="120px">Cliente</th>
                                <th data-width="110px">Fecha Aprobación</th>
                                <th data-width="110px">Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <input class="i-check" type="radio" data-id='${x.IdProyecto}' name="codigo_agregar" />
                                    </td>
                                    <td>${x.Codigo}</td>
                                    <td>${x.Descripcion}</td>
                                    <td>${x.NombreCliente}</td>
                                    <td>${x.FechaAprobacion}</td>
                                    <td>${x.Estado}</td>
                                </tr>`;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_Proyectos').innerHTML = html;

            fn_formatotabla();
        }

        function fn_formatotabla() {
            // Crea footer
            _('tbl_Proyectos').createTFoot();
            _('tbl_Proyectos').tFoot.innerHTML = _('tbl_Proyectos').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_Proyectos tfoot th').each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                let element = $(this).data("search");
                let width = $(this).data("width");
                if (element === false) {
                    $(this).html('');
                } else {
                    $(this).html(`<input type="text" placeholder="Buscar" ${width !== undefined ? 'style="width:' + width + '"' : ''} />`);
                }
            });

            // DataTable
            var table = $('#tbl_Proyectos').DataTable({
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
                drawCallback: function () {
                    $('.i-check').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    }).on('ifChanged', function () {
                        ovariables.idproyecto = $(this).data('id');
                    });
                },
                info: false,
                lengthChange: false,
                pageLength: 5,
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

            $("#tbl_Proyectos tfoot tr").appendTo("#tbl_Proyectos thead");
            $("#tbl_Proyectos tfoot").remove();

            // Hide table general search
            $('#tbl_Proyectos_filter').hide();
        }

        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezadoBuscarProyecto');
(
    function ini() {
        appBuscarProyecto.load();
        appBuscarProyecto.req_ini();
    }
)();
var appGuia = (
    function (d, idpadre) {
        var oVariables = {
            lstSubResponsables: '',
            lstGuias: '',
        }

        function load() {
            /* Settings Plugins */
            $.fn.datepicker.dates['es'] = {
                days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                today: "Hoy",
                clear: "Limpiar",
                format: "dd/mm/yyyy",
            };
            // Asigna configuracion a etiquetas
            $('.date').datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true,
                language: "es"
            });
            // Asigna fecha actual
            let date = new Date();
            $('.date').eq(0).datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), 1));
            $('.date').eq(1).datepicker('setDate', new Date());

            /* Botones Eventos */
            _("btnReturn").onclick = function () {
                const urlaccion = 'Administration/GuiaCourier/Assign',
                      urljs = 'Administration/GuiaCourier/Assign';
                _Go_Url(urlaccion, urljs);
                removejscssfile("Add", "js");
            }
            _('btnAdd').onclick = function () {
                $('#AgregarSubRes').modal('show');
            }
            _('btnAgregarSubRes').addEventListener('click', fn_AgregarSubTabla);
            _('btnGrabarSubRes').addEventListener('click', fn_ValidarDatos);
            _('btnSearch').addEventListener('click', req_Inicio);
            _('txtNumeroGuia').addEventListener('keyup', fn_filtrado);

            /* Modal Events */
            $('#AgregarSubRes').on('hidden.bs.modal', function () {
                // Limpia Sub Tabla
                _("tbodySubResponsable").innerHTML = "";
                // Limpia Nro Guia
                _("txtNroGuia").value = "";
                $('#cboSubResponsable option').prop('disabled', false);
                $("#cboSubResponsable").select2({
                    containerCssClass: "CustomSizeSelect2"
                });
            });
        }

        /* FUNCTIONS */
        function fn_ObtenerFecha(fecha) {
            let hoy;
            if (fecha == null) {
                hoy = new Date();
            } else {
                hoy = new Date(fecha);
            }
            let dia = String(hoy.getDate()).padStart(2, '0');
            let mes = String(hoy.getMonth() + 1).padStart(2, '0');
            let anio = hoy.getFullYear();

            hoy = dia + '/' + mes + '/' + anio;
            return hoy;
        }
        function fn_formatTable() {
            $('#tablaGuiaCourier').DataTable({
                scrollY: "455px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                //"pageLength": 25,
                bPaginate: false,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros",
                    "paginate": {
                        "next": "Siguiente",
                        "previous": "Anterior"
                    },
                }
            });

            // Fix datatable bug
            //setTimeout(function () {
            //    //alert("adjust!");
            //    $('#tablaGuiaCourier').DataTable().columns.adjust().draw();
            //}, 1000);
        }
        function fn_CrearTabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `
                <table id="tablaGuiaCourier" class ="table table-bordered" style="width:100%">
                    <thead>
                        <tr>
                            <th></th>
                            <th>No. Guia</th>
                            <th>Responsable</th>
                            <th>Sub Responsable</th>
                            <th>Fecha Registro</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `
                        <tr>
                            <td class="text-center">
                                <button class="btn btn-sm btn-danger" onclick="appGuia.req_EliminarDatos(${x.NroGuia})">
                                    <span class="fa fa-trash-o"></span>
                                </button>
                            </td>
                            <td>${x.NroGuia}</td>
                            <td>${x.Responsable}</td>
                            <td>${x.SubResponsable}</td>
                            <td>${fn_ObtenerFecha(x.FechaCreacion)}</td>
                        </tr>
                    `;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('divGuiaCourier').innerHTML = html;
            
            fn_formatTable();
        }
        function fn_filtrado(e) {
            let code = e.which;
            let NroGuia = _('txtNumeroGuia').value;
            if (code == 13) {
                let resultado = oVariables.lstGuias.filter(x =>
                    (NroGuia === '' || x.NroGuia.indexOf(NroGuia) > -1)
                );
                fn_CrearTabla(resultado);
            }
        }
        function fn_CrearCombos() {
            let htmlSubResponsable = `<option value='0'>Asignar Sub Responsable</option>`;
            if (cboSubResponsable.length > 0) {
                cboSubResponsable.forEach(x => { htmlSubResponsable += `<option value ='${x.IdResponsable}'>${x.NombrePersonal}</option>`; });
            }
            _('cboSubResponsable').innerHTML = htmlSubResponsable;
            // Bind select2
            $("#cboSubResponsable").select2({
                containerCssClass: "CustomSizeSelect2"
            });
        }
        function fn_AgregarSubTabla() {
            let cboValue = _("cboSubResponsable").value, html = '', filterValue;
            if (cboValue != 0) {
                filterValue = oVariables.lstSubResponsables.filter(x => x.IdResponsable == cboValue)[0];
                html = `<tr>
                    <input class="inputId" type="hidden" value="${filterValue.IdResponsable}">
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger" onclick="fn_EliminarCampo(this)">
                            <span class="fa fa-trash-o"></span>
                        </button>
                    </td>
                    <td>${filterValue.NombrePersonal}</td>
                </tr>`;
                _('tbodySubResponsable').innerHTML += html;

                // Setea value 0 luego de haber seleccionado
                _("cboSubResponsable").value = 0;
                // Deshabilita opcion agregada
                $('#cboSubResponsable option[value="' + cboValue + '"]').prop('disabled', true);
                // Bind select2
                $("#cboSubResponsable").select2({
                    containerCssClass: "CustomSizeSelect2"
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar un Sub Responsable", type: "warning" });
            }
        }
        function fn_EliminarCampo(element) {
            let cboValue = $(element).parent().prev(".inputId").val();
            $(element).parent().parent().remove();

            // Setea value 0 por defecto
            _("cboSubResponsable").value = 0;
            // Habilita opcion eliminada
            $('#cboSubResponsable option[value="' + cboValue + '"]').prop('disabled', false);
            // Bind select2
            $("#cboSubResponsable").select2({
                containerCssClass: "CustomSizeSelect2"
            });
        }
        function fn_ValidarDatos() {
            let nroGuia = _('txtNroGuia').value, inputId = document.getElementsByClassName("inputId");
            if (_isnotEmpty(nroGuia)) {
                let campos = [], data;
                for (let i = 0; i < inputId.length; i++) {
                    campos.push(inputId[i].value);
                }
                if (campos.length > 0) {
                    data = nroGuia + "¬";
                    data += campos.join("|");
                    req_GrabarDatos(data);
                } else {
                    swal({ title: "Advertencia", text: "Debes agregar 1 Sub Responsable como minimo", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "El campo N° Guia no puede estar vacio", type: "warning" });
            }
        }

        /* REQUESTS */
        function req_Inicio() {
            oVariables.lstGuias = '';
            let fechaDesde = _("txtFechaDesde").value, fechaHasta = _("txtFechaHasta").value;
            if (_isEmpty(fechaDesde) || _isEmpty(fechaHasta)) {
                swal({ title: "Advertencia", text: "Debes seleccionar un rango de fechas", type: "warning" });
            } else {
                _("txtNumeroGuia").value = "";
                const par = fechaDesde + "|" + fechaHasta;
                const urlaccion = 'Administration/GuiaCourier/GetData_GuiasTemp?par=' + par;
                Get(urlaccion, res_Inicio);
            }
        }
        function req_GrabarDatos(data) {
            swal({
                title: "Grabar Datos",
                text: "¿Estas seguro/a que deseas guardar estos datos?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const urlaccion = 'Administration/GuiaCourier/SaveData_GuiasTemp';
                const form = new FormData();
                form.append("par", data);
                Post(urlaccion, form, res_GrabarDatos);
            });
        }
        function req_EliminarDatos(data) {
            swal({
                title: "Eliminar Datos",
                text: "¿Estas seguro/a que deseas eliminar estos datos?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const urlaccion = 'Administration/GuiaCourier/DeleteData_GuiasTemp';
                const form = new FormData();
                form.append("par", data);
                Post(urlaccion, form, res_EliminarDatos);
            });
        }

        /* RESPONSES */
        function res_Inicio(respuesta) {
            if (respuesta != "") {
                oVariables.lstSubResponsables = JSON.parse(respuesta.split("_")[0]);
                if (respuesta.split("_")[1] != "") {
                    oVariables.lstGuias = JSON.parse(respuesta.split("_")[1]);
                }
                fn_CrearTabla(oVariables.lstGuias);
                fn_CrearCombos();
            }
        }
        function res_GrabarDatos(respuesta) {
            if (respuesta != 0) {
                if (respuesta == 2) {
                    swal({ title: "¡Advertencia!", text: "El Nro de Guia ya existe", type: "warning" });
                } else {
                    swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });
                }
                // Hide Modal after save
                $('#AgregarSubRes').modal('hide');
                req_Inicio();
            } else {
                swal({ title: "¡Ha surgido un problema!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
            }
        }
        function res_EliminarDatos(respuesta) {
            if (respuesta != 0) {
                swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });                
                req_Inicio();
            } else {
                swal({ title: "¡Ha surgido un problema!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
            }
        }

        return {
            load: load,
            req_Inicio: req_Inicio,
            oVariables: oVariables,
            req_EliminarDatos: req_EliminarDatos
        }
    }
)(document, 'panelEncabezadoGuia');
(
    function ini() {
        appGuia.load();
        appGuia.req_Inicio();
    }
)();
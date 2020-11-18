var appPermisosNew = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            ruta: '',
            modal_title: '',
            modal_callback: '',
            esgerentegeneral: (parseInt(window.utilindex.idpersonal, 10) === 14) ? '1' : '0',
            lstsolicitud: [],
            lsthistorial: [],
            lstbotones: [],
            lstarchivo: [],
            cbotipo: [],
            estados: [],
            configuracion_permisos: [],
            configuracion_permiso_horaminimo: 0,
            configuracion_permiso_horamaximo: 0,
            lstferiados: []
        }

        function load() {
            //_("cboTipo").addEventListener("change", fn_selectcombotipo);

            // Inicia IboxTools
            _initializeIboxTools();

            // Inicia datepicker
            _initializeDatepicker();

            // Crea modal
            _modal('solicitud', 'auto', '', null, 'bg-success');
            $('#modal_solicitud').on('show.bs.modal', fn_crearmodalsolicitud);

            // Se obtiene parametro si tuviera
            let par = _('txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.ruta = _par(par, 'ruta');
            }

            // Evento para agregar archivo
            _('fileuser').addEventListener('change', fn_change_file_user);

            $('#txtFechaInicio').datepicker({
                autoclose: true,
                //clearBtn: true,
                todayHighlight: true,
                language: "es",
                daysOfWeekDisabled: [0],
                weekStart: 1,
                multidate: false
            }).next().on('click', function (e) {
                $(this).prev().focus();
            });
            
        }

        function fn_selectcombotipo() {            
            let combo = _("cboTipo");
            _("txtOtros").value = "";
            if (combo.value === "5") {
                _("divOtros").classList.remove("hide");               
            } else {
                _("divOtros").classList.add("hide");                
            }
        }

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
                _('txtHoraInicio').value = _par(par, 'horainicio').replace('.', ':');
                _('txtHoraFin').value = _par(par, 'horafin').replace('.', ':');
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/Permisos/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud)[0] : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.lstarchivo = rpta[0].archivo !== '' ? JSON.parse(rpta[0].archivo) : [];
                        ovariables.configuracionpermisos = rpta[0].configuracionpermisos !== '' ? JSON.parse(rpta[0].configuracionpermisos) : [];
                        ovariables.cbotipo = rpta[0].tipo !== '' ? JSON.parse(rpta[0].tipo) : [];

                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        let obj_feriados = rpta[0].lstferiados !== '' ? JSON.parse(rpta[0].lstferiados) : [];
                        obj_feriados.forEach(x => {
                            ovariables.lstferiados.push(moment(x.fecha, 'DD/MM/YYYY').toDate());
                        });

                        //cargando en variables la configuracion de permisos
                        ovariables.configuracion_permiso_horaminimo = (ovariables.configuracionpermisos.hora_minimo === '') ? 0 : ovariables.configuracionpermisos.hora_minimo;
                        ovariables.configuracion_permiso_horamaximo = (ovariables.configuracionpermisos.hora_maximo === '') ? 0 : ovariables.configuracionpermisos.hora_maximo;

                        //_("divrecordatorio").innerHTML = " Recordatorio: Puedes solicitar como máximo " + ovariables.configuracion_permiso_horamaximo + " horas en un permiso, se recomienda informar al jefe directo en primera instancia luego ingresar la solicitud."

                        // Llenamos combo
                        let cboTipo = '';
                        ovariables.cbotipo.forEach(x => {
                            cboTipo += `<option value ='${x.idtipo}'>${x.nombre}</option>`;
                        });
                        _('cboTipo').innerHTML = cboTipo;


                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appPermisosNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
                                                <span class="${x.Icono}"> </span>
                                                ${x.Titulo}
                                            </button>`
                                });
                            }
                            return html;
                        }
                        _('div_botones').innerHTML = botones(ovariables.lstbotones);


                        if (ovariables.accion !== "edit") {
                            // Llenamos valores
                            _('txtFechaSolicitud').value = _getDate103();
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('txtComentario').value = "";
                            $('.date.date-es').datepicker("setDate", moment(new Date()).format('DD/MM/YYYY'));

                            // Tabla Aprobador
                            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = `<button class="btn btn-sm btn-outline btn-warning">
                                                                                                            <span class="fa fa-check"></span>
                                                                                                        </button>`;
                            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = ovariables.lstsolicitud.nombrejefe;
                            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = ovariables.lstsolicitud.correojefe;


                        } else {
                            // Llenamos valores
                            _('txtFechaSolicitud').value = ovariables.lstsolicitud.fechasolicitud;
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('cboTipo').value = ovariables.lstsolicitud.idtipo;
                            _("txtOtros").value = ovariables.lstsolicitud.otros;
                            _("txtDescripcion_si-aprobar").value = ovariables.lstsolicitud.otros;
                            _("txtTipo_si-aprobar").value = ovariables.lstsolicitud.tipo;
                            //if (_('cboTipo').value === "5") {
                            //    _("divOtros").classList.remove('hide'); 
                            //} else {
                            //    _("divOtros").classList.add('hide');
                            //}                            
                            let dateini = _strToDate(ovariables.lstsolicitud.fechainicio + ' 0:00');
                            _('txtFechaInicio').value = ovariables.lstsolicitud.fechainicio;
                            $("#txtFechaInicio").datepicker("setDate", dateini);
                            //$(".date.date-es").datepicker("setDate", dateini);
                            _('txtHoraInicio').value = ovariables.lstsolicitud.horainicio;
                            _('txtHoraFin').value = ovariables.lstsolicitud.horafin;
                            _('txtComentario').value = ovariables.lstsolicitud.comentario;
                            let codigo = ovariables.lstsolicitud.codigo;
                            let btnhtml = '';

                            if (codigo === ovariables.estados.PORAPROBAR || codigo === ovariables.estados.CANCELADO) {
                                btnhtml = `<button class="btn btn-sm btn-outline btn-warning">
                                              <span class="fa fa-check"></span>
                                           </button>`;
                            } else if (codigo === ovariables.estados.APROBADO) {
                                btnhtml = `<button class="btn btn-sm btn-outline btn-primary">
                                              <span class="fa fa-check"></span>
                                           </button>`;
                            } else if (codigo === ovariables.estados.RECHAZADO) {
                                btnhtml = `<button class="btn btn-sm btn-outline btn-danger">
                                              <span class="fa fa-check"></span>
                                           </button>`;
                            }

                            // Se deshabilita todo
                            _("spanfileuser").style.display = "none";
                            $("#tab-registro :input").prop("disabled", true);
                            $("#tab-registro .input-group-addon").attr("style", "pointer-events:none;cursor:not-allowed");

                            // Si es rechazado y es usuario creador
                            ovariables.lstbotones.forEach(x => {
                                if (x.Funcion === 'fn_update') {
                                    _("spanfileuser").style.display = "";
                                    $("#tab-registro :input").prop("disabled", false);

                                    _('txtFechaSolicitud').disabled = true;
                                    _('txtNombre').disabled = true;
                                    _('txtCargo').disabled = true;
                                    _('txtJefe').disabled = true;
                                    _('txtArea').disabled = true;
                                    $("#tab-registro .input-group-addon").removeAttr("style");
                                }
                            });

                            // Se añade tabla
                            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = btnhtml;
                            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = ovariables.lstsolicitud.nombrejefe;
                            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = ovariables.lstsolicitud.correojefe;

                            // Se crea tabla historial
                            fn_creartabla(ovariables.lsthistorial);

                            //se crea la tabla archivo
                            fn_load_file_user();
                        }

                        // Si solicitud viene de calendario
                        fn_fechacalendario();

                        if (ovariables.lstsolicitud.codigo === 'PAP' && $("button[title='Aprobar']").length > 0) {
                            $(".no-aprobar").addClass("hide");
                            $(".si-aprobar").removeClass("hide").addClass("show");

                            _("spnIdSolicitud").innerText = ovariables.lstsolicitud.idsolicitud
                            _("txtNombre_si-aprobar").value = ovariables.lstsolicitud.nombrepersonal;
                            fn_cargartablafechas(ovariables.lstsolicitud);
                            fn_creartablaadvertenciafechascoincidentes(((ovariables.lstsolicitud.fechas !== "") ? '1' : '2'), ovariables.lstsolicitud.fechainicio, ovariables.lstsolicitud.fechafin, ovariables.lstsolicitud.fechas);
                        } else {
                            $(".no-aprobar").removeClass("hide").addClass("show");
                            $(".si-aprobar").addClass("hide");
                        }

                        Disabled_FeriadosDatePicker(ovariables.lstferiados);
                    }
                }, (p) => { err(p); });
        }

        function Disabled_FeriadosDatePicker(lstferiados) {
            $("#txtFechaInicio").datepicker("setDatesDisabled", lstferiados);            
        }

        function fn_cargartablafechas(_json) {
            let data = _json, htmlbody = '';


            htmlbody = `<tr>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechainicio + ' ' + data.horainicio}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechafin + ' ' + data.horafin}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.cantidadhoras}</td>
                                </tr>`;



            _('tbody_tablafechas').innerHTML = htmlbody;
        }

        function fn_crearlabel(codigo) {
            let html = '';
            if (codigo === ovariables.estados.PORAPROBAR) {
                html = '<span class="label label-warning">Por Aprobar</span>';
            } else if (codigo === ovariables.estados.APROBADO) {
                html = '<span class="label label-primary">Aprobado</span>';
            } else if (codigo === ovariables.estados.CANCELADO) {
                html = '<span class="label label-default">Cancelado</span>';
            } else if (codigo === ovariables.estados.RECHAZADO) {
                html = '<span class="label label-danger">Rechazado</span>';
            }
            return html;
        }

        function fn_creartablaadvertenciafechascoincidentes(opcionfechas, fechainicio, fechafin, fechas) {
            let parametro = {
                fechainicio: fechainicio,
                fechafin: fechafin,
                fechas: fechas,
                rdfechas: '1',
                idsolicitud: ovariables.id
            };
            let tablaini = '', tablafin = '', tr = '';
            ovariables.tablacoincidenciasfechas = '';
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));

            _Post('RecursosHumanos/Permisos/GetAllData_FechasCoincidentes_Permisos', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        let lstresultado = JSON.parse(resultado);
                        let lsttodos, existenfechas;
                        if (lstresultado.length > 0) {
                            lsttodos = lstresultado[0].lsttodos;
                            if (lsttodos !== "") {
                                lsttodos = JSON.parse(lsttodos);
                                tablaini = `<div><span><strong>Información: </strong>La Solicitud que intenta aprobar tiene coincidencias de fechas con otras solicitudes. <a href="javascript:void(0);" class="btn btn-success btn-sm pull-right" onclick='_Go_Url("RecursosHumanos/Calendario/Index", "RecursosHumanos/Calendario/Index");'><i class='fa fa-calendar'></i> Ir al calendario</a></span></div>                                            
                                                <table id='tbl_coincidencias' style='font-size:9pt!important' class='table table-hover table-bordered table-condensed'>
                                                    <thead>
                                                         <tr>
                                                            <th class='text-center'>Fecha Solicitud</th>
                                                            <th class='text-center'>Solicitud</th>
                                                            <th class='text-center'>Nombre Personal</th>
                                                            <th class='text-center'>Coincidencias</th>
                                                            <th class='text-center'>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>`;
                                lsttodos.forEach((x) => {
                                    tr += `<tr><td class='text-center'>${x.fechasolicitud}</td>
                                                <td class='text-center'>${x.categoria}</td>
                                                <td class='text-center'>${x.nombrepersonal}</td>
                                                <td class='text-center'>${(x.fechascoincidentes.replace(/,/g, "<br />"))}</td>
                                                <td class='text-center'>${fn_crearlabel(x.codigoestado)}</td></tr>`;
                                });
                                tablafin = "</tbody></table>";
                                if (tr !== undefined) {
                                    ovariables.tablacoincidenciasfechas = tablaini + tr + tablafin;
                                    _("divFechasCoincidentes_si-aprobar").innerHTML = ovariables.tablacoincidenciasfechas;
                                    ////////////////////
                                    let tablecoincidencias = $('#tbl_coincidencias').DataTable({
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
                                        pageLength: 5,
                                        //order: [1, 'asc'],
                                        ordering: false
                                    });

                                    // Move paginate
                                    $("#tbl_coincidencias tfoot tr td").children().remove();
                                    $("#tbl_coincidencias_paginate").appendTo("#tbl_coincidencias tfoot tr td");

                                    // Custom Search
                                    //$('#txtBuscarCoincidencias').on('keyup', function () {
                                    //    tablecoincidencias.search(this.value).draw();
                                    //});

                                    // Hide table general search
                                    $('#tbl_coincidencias_filter').hide();

                                    ///////////////////
                                }


                            } else {
                                tablaini = `<div><span><strong>Información: </strong>La Solicitud que intenta aprobar no tiene coincidencias en fechas. </span></div>                                            
                                                <table id='tbl_coincidencias' style='font-size:9pt!important' class='table table-hover table-bordered table-condensed'>
                                                    <thead>
                                                         <tr>
                                                            <th>Fecha Solicitud</th>
                                                            <th>Solicitud</th>
                                                            <th>Nombre Personal</th>
                                                            <th>Coinciden con las Fechas</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>`;
                                tr += `<tr><td class='text-center' colspan="5">No existen coincidencias en fechas con otras solicitudes</td></tr>`;
                                tablafin = "</tbody></table>";
                                ovariables.tablacoincidenciasfechas = tablaini + tr + tablafin;
                                _("divFechasCoincidentes_si-aprobar").innerHTML = ovariables.tablacoincidenciasfechas;
                            }
                        }
                        //swal({ title: "¡Buen Trabajo!", text: "Haz enviado tu solicitud de vacaciones correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                        //fn_return();
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_creartabla(_json) {
            let data = _json, htmlbody = '';
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">${x.fechacreacion}</td>
                                    <td class="text-center">${x.horacreacion}</td>
                                    <td>${x.estado}</td>
                                    <td>${x.usuario}</td>
                                    <td>${fn_textoacccion(x.codigoestado)}</td>
                                    <td>${x.comentario}</td>
                                </tr>`;
                });
            }
            _('tbody_historial').innerHTML = htmlbody;
        }

        function fn_textoacccion(codigo) {
            let texto = '';
            if (codigo === ovariables.estados.PORAPROBAR) {
                texto = 'ENVIAR SOLICITUD';
            } else if (codigo === ovariables.estados.APROBADO) {
                texto = 'APROBAR SOLICITUD';
            } else if (codigo === ovariables.estados.CANCELADO) {
                texto = 'CANCELAR SOLICITUD';
            } else if (codigo === ovariables.estados.RECHAZADO) {
                texto = 'RECHAZAR SOLICITUD';
            }
            return texto;
        }

        function fn_crearmodalsolicitud() {
            let modal = $(this);
            let modal_title = modal.find('.modal-title');
            let modal_body = modal.find('.modal-body').children(0);

            modal_title.text(ovariables.modal_title);

            let html = `<div class="ibox white-bg">
                            <div class="ibox-title">
                                <div class="form-horizontal">
                                    <div id="divBotones" class="text-right">
                                        <button type="button" class="btn btn-info" onclick="appPermisosNew.${ovariables.modal_callback}()">
                                            <span class="fa fa-save"></span>
                                            Guardar
                                        </button>
                                        <button type="button" class="btn btn-default" data-dismiss="modal">
                                            <span class="fa fa-sign-out"></span>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="ibox-content">
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <div class="col-sm-12">
                                            <label class="control-label">Observaciones: </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <div class="col-sm-12">
                                            <textarea id="txtComentarioModal" class="form-control col-sm-12 _enty" name="Descripcion" rows="6" style="resize:none" placeholder="Ingresar comentarios" data-min="1" data-max="200" maxlength="200"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            modal_body.html(html);
        }

        // Valida rango de horas menor a 0, mayor a 4
        let ValidaHorasPermiso = (fechahoraini, fechahorafin) => {
            let bool = true;
            let DateIni = _strToDate(fechahoraini);
            let DateFin = _strToDate(fechahorafin);

            let horaEnMils = (1000 * 60 * 60);
            let tiempodepermiso = ((DateFin.getTime() - DateIni.getTime()) / horaEnMils);
            if (tiempodepermiso < ovariables.configuracion_permiso_horaminimo) {
                swal({ title: "Advertencia", text: "El permiso no puede ser menor a " + fn_convertir_decimal_to_horas(ovariables.configuracion_permiso_horaminimo), type: "warning" });
                bool = false;
            } else if (tiempodepermiso > ovariables.configuracion_permiso_horamaximo) {
                swal({ title: "Advertencia", text: "El permiso no puede ser mayor a " + fn_convertir_decimal_to_horas(ovariables.configuracion_permiso_horamaximo), type: "warning" });
                bool = false;
            }
            return bool;
        }

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/Permisos/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_save() {
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
            let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
            if (json.otros.trim() === '') {
                swal({ title: "Advertencia", text: "El campo Descripción es obligatorio.", type: "warning" });
                return false;
            }
            if (req_enty) {
                let validar_horas = ValidaHorasPermiso(_("txtFechaInicio").value + ' ' + _("txtHoraInicio").value, _("txtFechaInicio").value + ' ' + _("txtHoraFin").value);
                if (validar_horas) {                    
                    let comentario = json.comentario_nuevo;                    
                    swal({
                        html: true,
                        title: "Guardar Solicitud",
                        text: "¿Estas seguro/a que deseas guardar la Solicitud de Permiso?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "SI",
                        cancelButtonText: "NO",
                        closeOnConfirm: false
                    }, function () {
                        let tablaaprobador = [];
                        tablaaprobador = fn_get_aprobador('detalleTablaAprobador');
                        let arrAprobador = JSON.stringify(tablaaprobador);
                        arrfileUser = JSON.stringify(fn_getfileuser('tblfileuser'));
                        tabla = _('tblfileuser').tBodies[0];
                        let totalarchivos = tabla.rows.length, arrFile = [];
                        
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                fechainicio: json.fechainicio + ' ' + json.horainicio,
                                fechafin: json.fechainicio + ' ' + json.horafin,
                                comentario: json.comentario_nuevo,
                                codigoestado: (ovariables.esgerentegeneral === '0') ? ovariables.estados.PORAPROBAR : ovariables.estados.APROBADO,
                                idtipo: json.idtipo,
                                accion: ovariables.accion,
                                otros: json.otros
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));

                        frm.append('pararraprobador', arrAprobador);
                        frm.append('pararrfileuser', arrfileUser);

                        for (let i = 0; i < totalarchivos; i++) {
                            let row = tabla.rows[i];
                            let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
                            if (estamodificado == 1 && clsrow == undefined) {
                                let archivo = tabla.rows[i].cells[3].children[0].files[0];
                                archivo.modificado = 1;
                                frm.append('file' + i, archivo);
                            }
                        }

                        _Post('RecursosHumanos/Permisos/InsertData_Permiso', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    if (resultado === "0") {
                                        swal({ title: "¡Advertencia!", text: "No se puede guardar!. Hay una solicitud con el mismo periodo o fechas.", type: "warning", showCancelButton: false, showConfirmButton: true });
                                        return false;
                                    } else {
                                        swal({ title: "¡Solicitud Generada!", text: "Se guardo correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                        fn_return();
                                    }
                                } else {
                                    swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                }
            }
        }

        function fn_update() {
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Actualizar Solicitud",
                    text: "¿Estas seguro/a que deseas actualizar la Solicitud de Permiso?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            fechainicio: json.fechainicio + ' ' + json.horainicio,
                            fechafin: json.fechainicio + ' ' + json.horafin,
                            comentario: json.comentario_nuevo,
                            codigoestado: ovariables.estados.PORAPROBAR,
                            idtipo: json.idtipo,
                            accion: ovariables.accion,
                            idsolicitud: ovariables.id,
                            otros: (json.idtipo === "5") ? json.otros : ''
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Permisos/InsertData_Permiso', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Solicitud Actualizada!", text: "Haz enviado tu permiso correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_aprobar() {
            //ovariables.modal_title = 'Aprobar Solicitud';
            //ovariables.modal_callback = 'fn_aprobar_grabar';
            //$('#modal_solicitud').modal('show');
            fn_aprobar_grabar();
        }

        function fn_aprobar_grabar() {
            swal({
                html: true,
                title: "Aprobar Solicitud",
                text: "¿Seguro de Aprobar la Solicitud?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.APROBADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Permisos/UpdateData_Permiso', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Aprobada!", text: "Se actualizo el permiso correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_cancelar() {
            ovariables.modal_title = 'Cancelar Solicitud';
            ovariables.modal_callback = 'fn_cancelar_grabar';
            $('#modal_solicitud').modal('show');
        }

        function fn_cancelar_grabar() {
            swal({
                html: true,
                title: "Cancelar Solicitud",
                text: "¿Estas seguro/a que deseas Cancelar tu Permiso?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario:json.comentario,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Permisos/UpdateData_Permiso', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Cancelada!", text: "Se cancelo tu permiso correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_rechazar() {
            //ovariables.modal_title = 'Rechazar Solicitud';
            //ovariables.modal_callback = 'fn_rechazar_grabar';
            //$('#modal_solicitud').modal('show');
            fn_rechazar_grabar();
        }

        function fn_rechazar_grabar() {
            swal({
                html: true,
                title: "Rechazar Solicitud",
                text: "¿Estas seguro/a que deseas Rechazar el permiso?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_PermisosNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.RECHAZADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Permisos/UpdateData_Permiso', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Rechazada!", text: "Se rechazo el permiso correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        // Archivo        
        function fn_load_file_user() {
            let array = ovariables.lstarchivo;
            let tabla = _('tblfileuser').tBodies[0], html = '';
            if (array.length > 0) {
                //let result = array.filter(x=>x.TipoArchivo === 1);
                let result = array;
                if (result.length > 0) {
                    _('divfiluser_desactive').classList.remove('hide');
                    _('divfiluser_active').classList.add('hide');
                    _('tblfileuser').classList.remove('hide');
                    result.forEach(x => {
                        html += `<tr data-par='idarchivo:${x.idarchivo},modificado:0,nombrearchivo:${x.nombrearchivo}'>
                    <td class ='text-center' style='vertical-align:middle'>
                        <div class ='btn-group'>
                            <button class ='btn btn-outline btn-warning btn-sm _download'>
                                <span class ='fa fa-download'></span>
                            </button>
                        </div>
                    </td>
                    <td style='vertical-align:middle'>${x.nombrearchivooriginal}</td>
                    <td class ='text-center'></td>
                    <td class ='hide'></td>
                </tr>`;
                    });

                    tabla.innerHTML = html;
                    handlerTblFileUser_edit();
                }
            }
        }

        function fn_change_file_user(e) {
            let archivo = this.value;
            if (archivo != '') {
                let contador = fn_getfileuser('tblfileuser');
                if (contador.length < 2) {
                    let ultimopunto = archivo.lastIndexOf(".");
                    let ext = archivo.substring(ultimopunto + 1);
                    ext = ext.toLowerCase();
                    let nombre = e.target.files[0].name, html = '';
                    let file = e.target.files;

                    html = `<tr data-par='idarchivo:0,modificado:1'>
                        <td class ='text-center'  style='vertical-align:middle'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _deletefile'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td style='vertical-align:middle'>${nombre}</td>
                        <td class ='text-center' style='vertical-align:middle'>
                            <div class='btn-group'>
                                <button type='button' class ='btn btn-link _download hide'>Download</button>
                            </div>
                        </td>
                        <td class='hide'></td>
                    </tr>`;

                    _('tblfileuser').tBodies[0].insertAdjacentHTML('beforeend', html);

                    let tbl = _('tblfileuser').tBodies[0], total = tbl.rows.length;
                    let filexd = _('fileuser').cloneNode(true);
                    filexd.setAttribute('id', 'file' + (total - 1));
                    tbl.rows[total - 1].cells[3].appendChild(filexd);
                    handlerTblFileUser_add(total);
                }
                else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning' }); }
            }
        }

        function handlerTblFileUser_add(indice) {
            let tbl = _('tblfileuser'), rows = tbl.rows[indice];
            rows.getElementsByClassName('_deletefile')[0].addEventListener('click', e => { controladortblfileuser_add(e, 'drop'); });
            rows.getElementsByClassName('_download')[0].addEventListener('click', e => { controladortblfileuser_add(e, 'download'); });
        }

        function handlerTblFileUser_edit() {
            let tbl = _('tblfileuser'),
                arrayDelete = _Array(tbl.getElementsByClassName('_delete')),
                arrayDownload = _Array(tbl.getElementsByClassName('_download'));
            arrayDownload.forEach(x => x.addEventListener('click', e => { controladortblfileuser_edit(e, 'download'); }));
            arrayDelete.forEach(x => x.addEventListener('click', e => { controladortblfileuser_edit(e, 'delete'); }));
        }
        function controladortblfileuser_add(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                eventtblfileuser_add(par, accion, fila);
            }
        }
        function controladortblfileuser_edit(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                eventtblfileuser_edit(par, accion, fila);
            }
        }

        function eventtblfileuser_add(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    _("fileuser").value = "";
                    fila.classList.add('hide');
                    break;
                case 'download':
                    downloadfileuser(fila);
                    break;
            }
        }
        function eventtblfileuser_edit(par, accion, fila) {
            switch (accion) {
                case 'delete':
                    deletefileuser(fila);
                    break;
                case 'download':
                    downloadfileuser(fila);
                    break;
            }
        }

        function downloadfileuser(_fila) {
            let par = _fila.getAttribute('data-par');
            let nombrearchivooriginal = _fila.cells[1].innerText.replace(' ', ''), nombrearchivo = _par(par, 'nombrearchivo');

            let urlaccion = '../RecursosHumanos/Permisos/Download_Permiso?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

            var link = document.createElement('a');
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function deletefileuser(_fila) {
            swal({
                title: "Esta seguro de eliminar este archivo?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function () {
                _fila.classList.add('hide');
                _("#fileuser")
                return;
            });
        }

        function fn_getfileuser(table) {
            let tbl = _(table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

            for (let i = 0; i < totalfilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

                if (estamodificado == 1 && clsrow == undefined) {
                    let obj = {
                        idarchivo: parseInt(_par(par, 'idarchivo')),
                        //tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                        nombrearchivooriginal: row.cells[1].innerText,
                        modificado: parseInt(_par(par, 'modificado'))
                    }
                    arr.push(obj);
                }
            }
            return arr;
        }

        function fn_get_aprobador(_idtable) {
            let table = _(_idtable), array = [...table.tBodies[0].rows], arrayresult = [], obj = {};
            if (array.length > 0) {
                array.forEach(x => {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    if (par != null) {
                        IdAprobador = _par(par, 'IdAprobador'),
                        EstadoFirma = _par(par, 'EstadoFirma');
                        obj.IdAprobador = IdAprobador;
                        obj.EstadoFirma = EstadoFirma;
                        arrayresult.push(obj);
                    }
                });
            }

            if (arrayresult.length == 1) {
                let x = arrayresult.some(z => { if (z.EstadoFirma.toString() === "1") { return true } });
                if (x) { ovariables.idestado = 2 } else { ovariables.idestado = 1; }
            }
            return arrayresult;
        }

        function fn_convertir_decimal_to_horas(strtiempo) {
            var decimalTimeString = strtiempo;
            var decimalTime = parseFloat(decimalTimeString);
            decimalTime = decimalTime * 60 * 60;
            var hours = Math.floor((decimalTime / (60 * 60)));
            decimalTime = decimalTime - (hours * 60 * 60);
            var minutes = Math.floor((decimalTime / 60));
            decimalTime = decimalTime - (minutes * 60);
            var seconds = Math.round(decimalTime);
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            return ("" + ((hours !== "00") ? hours + " hor, " : "") + ((minutes !== "00") ? minutes + " min, " : "") + ((seconds !== "00") ? seconds + " seg" : ""));
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_return: fn_return,
            fn_save: fn_save,
            fn_update: fn_update,
            fn_aprobar: fn_aprobar,
            fn_cancelar: fn_cancelar,
            fn_rechazar: fn_rechazar,
            fn_aprobar_grabar: fn_aprobar_grabar,
            fn_cancelar_grabar: fn_cancelar_grabar,
            fn_rechazar_grabar: fn_rechazar_grabar,
            fn_convertir_decimal_to_horas: fn_convertir_decimal_to_horas
        }
    }
)(document, 'panelEncabezado_PermisosNew');
(
    function ini() {
        appPermisosNew.load();
        appPermisosNew.req_ini();
    }
)();
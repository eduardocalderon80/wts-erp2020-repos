var appCumpleanosNew = (
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
            estados: [],
            fechanacimiento: '',
            existe_estado_apr_actual: '',
            configuracioncumpleanios: [],
            configuracioncumpleanios_diasminimo: 0,
            configuracioncumpleanios_diasmaximo: 0,
            lstferiados: []
        }

        function load() {
            _initializeIboxTools();

            // Datepicker
            _initializeDatepicker();

            // Se obtiene parametro si tuviera
            let par = _('txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.ruta = _par(par, 'ruta');
            }

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

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
                //fn_calculardias();
            }
        }

        function fn_calculardias() {
            let txtFechaInicio = _('txtFechaInicio').value;

            let date1 = new Date(txtFechaInicio.split("/")[2], txtFechaInicio.split("/")[1] - 1, txtFechaInicio.split("/")[0]);
            //let date2 = new Date(txtFechaFin.split("/")[2], txtFechaFin.split("/")[1] - 1, txtFechaFin.split("/")[0]);

            let Difference_In_Time = date2.getTime() - date1.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            // Se agrega 1 ya que en calculo no se considera el ultimo dia
            let total_days = Difference_In_Days + 1;
            if (total_days < 0) {
                swal({ title: "Advertencia", text: "La fecha final no puede ser menor a la inicial", type: "warning" });
                _('txtFechaInicio').value = '';
            } else {
                _('txtDias').value = total_days;
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/Cumpleanos/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud)[0] : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.existe_estado_apr_actual = rpta[0].existeestadoapr !== '' ? JSON.parse(rpta[0].existeestadoapr) : [];
                        ovariables.configuracioncumpleanios = rpta[0].configuracioncumpleanios !== '' ? JSON.parse(rpta[0].configuracioncumpleanios) : [];

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

                        //cargando configuracion de cumpleaños
                        ovariables.configuracioncumpleanios_diasminimo = parseInt(ovariables.configuracioncumpleanios.dias_minimo, 10);
                        ovariables.configuracioncumpleanios_diasmaximo = parseInt(ovariables.configuracioncumpleanios.dias_maximo, 10);

                        //_("divrecordatorio").innerHTML = "Recordatorio: La solicitud de cumpleaños puede ser solicitada -" + ovariables.configuracioncumpleanios_diasminimo + " a +" + ovariables.configuracioncumpleanios_diasmaximo + " días de la fecha de cumpleaños.";
                        // Llenamos combo                        

                        //let cboPersonal = '';
                        //ovariables.lstsolicitud.forEach(x => {
                        //    cboPersonal += `<option value ='${x.idpersonal}'>${x.nombrepersonal}</option>`
                        //});
                        //_('cboNombre').innerHTML = cboPersonal;
                        //_('cboNombre').addEventListener('change', fn_change_personal);

                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appCumpleanosNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
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
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtFechaSolicitud').value = ovariables.lstsolicitud.fechasolicitud;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('txtFechaCumpleanos').value = ovariables.lstsolicitud.fechanacimiento;
                            ovariables.fechanacimiento = new Date(new Date().getFullYear(), parseInt(ovariables.lstsolicitud.fechanacimiento.substring(3, 5), 10) - 1, ovariables.lstsolicitud.fechanacimiento.substring(0, 2));
                            _('txtFechaSolicitud').value = _getDate103();

                        } else {
                            // Setea 1 solicitud
                            //ovariables.lstsolicitud = ovariables.lstsolicitud[0];

                            // Llenamos valores
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtFechaSolicitud').value = ovariables.lstsolicitud.fechasolicitud;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('txtFechaCumpleanos').value = ovariables.lstsolicitud.fechanacimiento;
                            _('txtFechaInicio').disabled = true;
                            // Fechas
                            let dateini = _strToDate(ovariables.lstsolicitud.fechainicio + ' 0:00');
                            
                            $("#txtFechaInicio").datepicker("setDate", dateini);

                            // Calcular dias
                            //fn_calculardias();

                            let codigo = ovariables.lstsolicitud.codigo;
                            let btnhtml = '';

                            if (codigo === ovariables.estados.PORAPROBAR || codigo === ovariables.estados.CANCELADO) {
                                btnhtml = `<button class="btn btn-xs btn-outline btn-warning">
                                              <span class="fa fa-check-circle"></span>
                                           </button>`;
                            } else if (codigo === ovariables.estados.APROBADO) {
                                btnhtml = `<button class="btn btn-xs btn-outline btn-primary">
                                              <span class="fa fa-check-circle"></span>
                                           </button>`;
                            } else if (codigo === ovariables.estados.RECHAZADO) {
                                btnhtml = `<button class="btn btn-xs btn-outline btn-danger">
                                              <span class="fa fa-check-circle"></span>
                                           </button>`;
                            }

                            // Se deshabilita todo                           
                            $("#tab-registro :input").prop("disabled", true);
                            $("#tab-registro .input-group-addon").attr("style", "pointer-events:none;cursor:not-allowed");

                            // Si es rechazado y es usuario creador
                            ovariables.lstbotones.forEach(x => {
                                if (x.Funcion === 'fn_update') {

                                    $("#tab-registro :input").prop("disabled", false);

                                    _('txtFechaSolicitud').disabled = true;
                                    _('txtCargo').disabled = true;
                                    _('txtJefe').disabled = true;
                                    _('txtArea').disabled = true;
                                    _('txtSubArea').disabled = true;
                                    _('txtEquipo').disabled = true;
                                    $("#tab-registro .input-group-addon").removeAttr("style");
                                }
                            });

                            // Se añade tabla
                            //_('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = btnhtml;
                            //_('detalleTablaAprobador').children[1].children[0].children[1].textContent = ovariables.lstsolicitud.nombrejefe;
                            //_('detalleTablaAprobador').children[1].children[0].children[2].textContent = ovariables.lstsolicitud.correojefe;

                            // Se crea tabla historial
                            fn_creartabla(ovariables.lsthistorial);

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
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechainicio}</td>                                    
                                </tr>`;



            _('tbody_tablafechas').innerHTML = htmlbody;
        }

        function fn_creartablaadvertenciafechascoincidentes(opcionfechas, fechainicio, fechafin, fechas) {
            let parametro = {
                fechainicio: fechainicio,
                fechafin: fechafin,
                fechas: fechas,
                rdfechas: '0',
                idsolicitud: ovariables.id
            };
            let tablaini = '', tablafin = '', tr = '';
            ovariables.tablacoincidenciasfechas = '';
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));

            _Post('RecursosHumanos/Cumpleanos/GetAllData_FechasCoincidentes_Cumpleanos', frm)
                .then((resultado) => {
                    if (resultado !== null && resultado !== '') {
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
                                                <td class='text-center'>${x.categoria}</td><td>${x.nombrepersonal}</td>
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
                        tablaini = `<div><span><strong>Información: </strong>La Solicitud que intenta aprobar no tiene coincidencias en fechas. <a href="javascript:void(0);" class="btn btn-success btn-xs pull-right" onclick='_Go_Url("RecursosHumanos/Calendario/Index", "RecursosHumanos/Calendario/Index");'><i class='fa fa-calendar'></i> Ir al calendario</a></span></div>                                            
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
                        //swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
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
                                    <td>${fn_textoacccion(x.iddetalle, x.codigoestado)}</td>
                                    <td>${x.comentario}</td>
                                </tr>`;
                });
            }
            _('tbody_historial').innerHTML = htmlbody;
        }

        function fn_textoacccion(id, codigo) {
            let texto = '';
            let idhistorial = ovariables.lsthistorial[0].iddetalle;
            if (codigo === ovariables.estados.APROBADO && id === idhistorial) {
                texto = 'GUARDAR SOLICITUD';
            } else if (codigo === ovariables.estados.APROBADO) {
                texto = 'ACTUALIZAR SOLICITUD';
            } else if (codigo === ovariables.estados.CANCELADO) {
                texto = 'CANCELAR SOLICITUD';
            }
            return texto;
        }

        function fn_valida30dias() {
            debugger;
            let bool = true;
            //(moment($("#txtFechaInicio").datepicker("getDate")).year()
            ovariables.fechanacimiento = new Date(parseInt(new Date().getFullYear(),10),parseInt(ovariables.lstsolicitud.fechanacimiento.substring(3, 5), 10) - 1, parseInt(ovariables.lstsolicitud.fechanacimiento.substring(0, 2),10));
            let fechanacimiento = ovariables.fechanacimiento;
            let fechahoy = new Date();

            let fecha;
            fecha = _strToDate(_('txtFechaInicio').value + ' 0:00');

            let fechainicio = moment(fechanacimiento).subtract('days', (ovariables.configuracioncumpleanios_diasminimo)).toDate();
            let fechafin = moment(fechanacimiento).add('days', (ovariables.configuracioncumpleanios_diasmaximo)).toDate();



            if (fechahoy === fechainicio) {
                swal({
                    title: "Advertencia", text: "La fecha de permiso de cumpleaños debe ser mayor a la fecha de hoy.", type: "warning"
                });
                bool = false;
            } else if (fecha < fechainicio || fecha > fechafin) {
                swal({
                    title: "Advertencia", text: "La fecha de permiso de cumpleaños debe ser solicitada como mínimo " + (ovariables.configuracioncumpleanios_diasminimo) + " día/s antes y como máximo " + (ovariables.configuracioncumpleanios_diasmaximo) + " día/s después de la fecha de cumpleaños.", type: "warning"
                });
                bool = false;
            }// else if (fechahoy > fechafin) {
            //    swal({
            //        title: "Advertencia", text: "La fecha de permiso de cumpleaños ha caducado, comuniquese con Recursos Humanos", type: "warning"
            //    });
            //    bool = false;
            //}
            return bool;
        }

        function fn_totalsolicitud_cumpleanos() {
            let res = false;
            let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_CumpleanosNew' });
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    fechainicio: json.fechainicio,
                    codigoestado: (ovariables.esgerentegeneral === '0') ? ovariables.estados.PORAPROBAR : ovariables.estados.APROBADO,
                    accion: ovariables.accion
                }, frm = new FormData();
            frm.append('par', JSON.stringify(parametro));

            _Post('RecursosHumanos/Cumpleanos/GetTotalSolicitudes_Cumpleanos', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        let totalSol = JSON.parse(resultado)[0].total_solicitudes;
                        if (totalSol < 1 && (ovariables.existe_estado_apr_actual === 0)) {
                            if (fn_valida30dias()) {
                                swal({
                                    html: true,
                                    title: "Guardar Solicitud",
                                    text: "¿Estas seguro/a que deseas guardar la solicitud de cumpleaños?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#1c84c6",
                                    confirmButtonText: "SI",
                                    cancelButtonText: "NO",
                                    closeOnConfirm: false
                                }, function () {
                                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_CumpleanosNew' });
                                    let err = function (__err) { console.log('err', __err) },
                                        parametro = {
                                            fechainicio: json.fechainicio,
                                            codigoestado: (ovariables.esgerentegeneral === '0') ? ovariables.estados.PORAPROBAR : ovariables.estados.APROBADO,
                                            accion: ovariables.accion
                                        }, frm = new FormData();
                                    frm.append('par', JSON.stringify(parametro));

                                    _Post('RecursosHumanos/Cumpleanos/InsertData_Cumpleanos', frm)
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
                        } else {
                            swal({ title: "Advertencia", text: "Solo se puede registrar una solicitud de cumpleaños por año.", type: "warning" });
                        }
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/Cumpleanos/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_save() {
            if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaInicio').value)) {
                fn_totalsolicitud_cumpleanos();
            } else {
                swal({ title: "Advertencia", text: "Debe seleccionar una fecha de permiso de cumpleaños válida.", type: "warning" });
            }
        }

        function fn_update() {
            if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaInicio').value)) {
                if (fn_valida30dias()) {
                    swal({
                        html: true,
                        title: "Actualizar Solicitud",
                        text: "¿Estas seguro/a que deseas actualizar la solicitud de cumpleaños?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_CumpleanosNew' });
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                idsolicitud: ovariables.id,
                                idpersonal: _('cboNombre').value,
                                fechainicio: json.fechainicio,
                                codigoestado: ovariables.estados.APROBADO,
                                accion: ovariables.accion
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('RecursosHumanos/Cumpleanos/InsertData_Cumpleanos', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    swal({
                                        title: "¡Solicitud Actualizada!", text: "Se actualizo correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false
                                    });
                                    fn_return();
                                } else {
                                    swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                }
            } else {
                swal({ title: "Advertencia", text: "La fecha de inicio y fin no pueden estar vacias", type: "warning" });
            }
        }

        function fn_cancelar() {
            swal({
                html: true,
                title: "Cancelar Solicitud",
                text: "¿Estas seguro/a que deseas Cancelar la solicitud de cumpleaños?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Cumpleanos/UpdateData_Cumpleanos', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Cancelada!", text: "Se cancelo correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
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
                text: "¿Estas seguro/a que deseas Rechazar la solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_CumpleanosNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.RECHAZADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Cumpleanos/UpdateData_Cumpleanos', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Rechazada!", text: "Se rechazo la solicitud correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
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
                text: "¿Estas seguro/a que deseas Aprobar la Solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_CumpleanosNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idsolicitud: ovariables.id,
                            comentario: json.comentario,
                            codigoestado: ovariables.estados.APROBADO
                        }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                        _Post('RecursosHumanos/Cumpleanos/UpdateData_Cumpleanos', frm)
                    .then((resultado) => {
                            if (resultado !== null) {
                                $('#modal_solicitud').modal('hide');
                                swal({ title: "¡Solicitud Aprobada!", text: "Se actualizo la solicitud correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                    });

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_return: fn_return,
            fn_save: fn_save,
            fn_update: fn_update,
            fn_cancelar: fn_cancelar,
            fn_rechazar: fn_rechazar,
            fn_aprobar: fn_aprobar
        }
    }
)(document, 'panelEncabezado_CumpleanosNew');
(
    function ini() {
        appCumpleanosNew.load();
        appCumpleanosNew.req_ini();
    }
)();
var appDescansoMedicoNew = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            ruta: '',
            modal_title: '',
            modal_callback: '',
            lstsolicitud: [],
            lsthistorial: [],
            lstbotones: [],
            lstarchivo: [],
            cbotipo: [],
            cboespecialidad: [],
            cbolugaratencion: [],
            estados: [],
            verdiagnostico: 0,
            configuraciondescansomedico: [],
            configuraciondescansomedico_diasminimo: 0
            
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
                weekStart: 1,
                multidate: false
            }).on('changeDate', function (e) {
                let fechafin = $('#txtFechaFin').datepicker("getDate");
                $('#txtFechaFin').datepicker("setStartDate", e.date);
                if (fechafin < e.date) {
                    $('#txtFechaFin').datepicker("setDate", e.date);
                }
                fn_calculardiasacumuladossubsidio();
            })
                .next().on('click', function (e) {
                    $(this).prev().focus();
                });

            $('#txtFechaFin').datepicker({
                autoclose: true,
                //clearBtn: true,
                todayHighlight: true,
                language: "es",                
                weekStart: 1,
                multidate: false
            }).on('changeDate', function (e) {
                if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaFin').value)) {
                    // Calcular dias
                    fn_calculardias();
                }
            })
                .next().on('click', function (e) {
                    $(this).prev().focus();
                });
            //_('txtFechaFin').onchange = function () {
            //    if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaFin').value)) {                    
            //        // Calcular dias
            //        fn_calculardias();
            //    }
            //}

            // Cargar Archivo
            _('fileuser').addEventListener('change', fn_change_file_user);
        }

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
                $("#txtfechaInicio").datepicker("setDate", moment(_par(par, 'fechainicio'), 'dd/MM/yyyy').toDate());
                _('txtFechaFin').value = _par(par, 'fechafin');
                $("#txtfechaFin").datepicker("setDate", moment(_par(par, 'fechafin'), 'dd/MM/yyyy').toDate());
                fn_calculardias();
            }
        }

        function fn_calculardias() {
            $("#txtfechaInicio").datepicker("setDate", moment(_('txtFechaInicio').value, 'dd/MM/yyyy').toDate());
            $("#txtfechaFin").datepicker("setDate", moment(_('txtFechaFin').value, 'dd/MM/yyyy').toDate());
            let txtFechaInicio = _('txtFechaInicio').value;
            let txtFechaFin = _('txtFechaFin').value;

            let date1 = new Date(txtFechaInicio.split("/")[2], txtFechaInicio.split("/")[1] - 1, txtFechaInicio.split("/")[0]);
            let date2 = new Date(txtFechaFin.split("/")[2], txtFechaFin.split("/")[1] - 1, txtFechaFin.split("/")[0]);

            let Difference_In_Time = date2.getTime() - date1.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            // Se agrega 1 ya que en calculo no se considera el ultimo dia
            let total_days = Difference_In_Days + 1;
            if (total_days < 0) {
                swal({ title: "Advertencia", text: "La fecha final no puede ser menor a la inicial", type: "warning" });
                _('txtFechaInicio').value = '';
                $('#txtFechaInicio').datepicker("setDate",null);
                _('txtFechaFin').value = '';
                $('#txtFechaFin').datepicker("setDate", null);
                _('txtDias').value = 0;
            } else {
                _('txtDias').value = total_days;
                let diasacumuladossubsidio = (ovariables.configuraciondescansomedico_diasminimo - ((parseInt(_("txtDiasAcumulados").value, 10) + total_days)));
                _("txtDiasAcumuladosInsert").value = (diasacumuladossubsidio < 0) ? (diasacumuladossubsidio * (-1)) : 0;
            }
        }

        function fn_calculardiasacumuladossubsidio() {
            if (_isnotEmpty(_('txtFechaInicio').value)) {
                let err = function (__err) { console.log('err', __err) },
                    json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_DescansoMedicoNew' });

                let fechainicio = json.fechainicio.split('/')[2] + '-' + json.fechainicio.split('/')[1] + '-' + json.fechainicio.split('/')[0];


                let parametro = {
                    idpersonal: _('cboNombre').value,
                    fechainicio: fechainicio
                }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/DescansoMedico/GetData_TotalDescansoMedicoxFechaInicio', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            _("txtDiasAcumulados").value = resultado;
                            if (parseInt(resultado, 10) > ovariables.configuraciondescansomedico_diasminimo) {
                                $("#lblEsSubSidio").text("SI");
                            } else {
                                $("#lblEsSubSidio").text("NO");
                            }
                        } else {
                            _("txtDiasAcumulados").value = "0";
                            $("#lblEsSubSidio").text("NO");
                        }
                    }, (p) => { err(p); });
            } else {
                if (parseInt(_("txtDiasAcumulados").value) > ovariables.configuraciondescansomedico_diasminimo) {
                    $("#lblEsSubSidio").text("SI");
                } else {
                    $("#lblEsSubSidio").text("NO");
                }
            }

        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/DescansoMedico/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud) : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.lstarchivo = rpta[0].archivo !== '' ? JSON.parse(rpta[0].archivo) : [];
                        ovariables.cbotipo = rpta[0].tipo !== '' ? JSON.parse(rpta[0].tipo) : [];
                        ovariables.cboespecialidad = rpta[0].especialidad !== '' ? JSON.parse(rpta[0].especialidad) : [];
                        ovariables.cbolugaratencion = rpta[0].lugaratencion !== '' ? JSON.parse(rpta[0].lugaratencion) : [];
                        ovariables.verdiagnostico = rpta[0].descansomedico_verdiagnostico;
                        ovariables.configuraciondescansomedico = rpta[0].configuraciondescansomedico !== '' ? JSON.parse(rpta[0].configuraciondescansomedico) : [];

                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;
                                                
                        //cargar configuracion descanso medico
                        ovariables.configuraciondescansomedico_diasminimo = (ovariables.configuraciondescansomedico !== '') ? parseInt(ovariables.configuraciondescansomedico.dias_minimo, 10) : 0;

                        // Llenamos combo
                        let cboContingencia = '';
                        ovariables.cbotipo.forEach(x => {
                            cboContingencia += `<option value ='${x.idtipo}'>${x.nombre}</option>`;
                        });
                        _('cboContingencia').innerHTML = cboContingencia;

                        let cboEspecialidad = '';
                        ovariables.cboespecialidad.forEach(x => {
                            cboEspecialidad += `<option value ='${x.idespecialidad}'>${x.nombre}</option>`;
                        });
                        _('cboEspecialidad').innerHTML = cboEspecialidad;

                        let cboLugarAtencion = '';
                        ovariables.cbolugaratencion.forEach(x => {
                            cboLugarAtencion += `<option value ='${x.idlugaratencion}'>${x.nombre}</option>`;
                        });
                        _('cboLugarAtencion').innerHTML = cboLugarAtencion;

                        let cboPersonal = '';
                        ovariables.lstsolicitud.forEach(x => {
                            cboPersonal += `<option value ='${x.idpersonal}'>${x.nombrepersonal}</option>`
                        });
                        _('cboNombre').innerHTML = cboPersonal;
                        _('cboNombre').addEventListener('change', fn_change_personal);


                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appDescansoMedicoNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
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
                            fn_change_personal();

                            _('txtFechaSolicitud').value = _getDate103();
                            _('txtComentario').value = "";
                            _("txtDias").value = "0";
                            if (ovariables.lstsolicitud.length !== undefined) {
                                if (parseInt(ovariables.lstsolicitud.find(x => x.idpersonal === parseInt(_("cboNombre").value)).totaldescansomedico, 10) < ovariables.configuraciondescansomedico_diasminimo) {
                                    _("lblEsSubSidio").innerText = "NO";
                                }
                                else {
                                    _("lblEsSubSidio").innerText = "SI";
                                }
                            }
                        } else {
                            // Setea 1 solicitud
                            ovariables.lstsolicitud = ovariables.lstsolicitud[0];

                            // Llenamos valores
                            _('txtFechaSolicitud').value = ovariables.lstsolicitud.fechasolicitud;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('cboContingencia').value = ovariables.lstsolicitud.idtipo;
                            if (ovariables.verdiagnostico === 1) {
                                _('txtDiagnostico').value = ovariables.lstsolicitud.diagnostico;
                            }

                            _('cboEspecialidad').value = ovariables.lstsolicitud.idespecialidad;
                            _('cboLugarAtencion').value = ovariables.lstsolicitud.idlugaratencion;
                            _('txtComentario').value = ovariables.lstsolicitud.comentario;
                            _("txtDiasAcumulados").value = ovariables.lstsolicitud.totaldescansomedico;
                            if (parseInt(ovariables.lstsolicitud.totaldescansomedico, 10) < ovariables.configuraciondescansomedico_diasminimo) {
                                _("lblEsSubSidio").innerText = "NO";
                            }
                            else {
                                _("lblEsSubSidio").innerText = "SI";
                            }                            

                            // Fechas
                            let dateini = _strToDate(ovariables.lstsolicitud.fechainicio + ' 0:00');
                            let datefin = _strToDate(ovariables.lstsolicitud.fechafin + ' 0:00');
                            $('.date.date-es').eq(0).datepicker("setDate", dateini);
                            $('.date.date-es').eq(1).datepicker("setDate", datefin);

                            // Calcular dias
                            fn_calculardias();

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
                            _("spanfileuser").style.display = "none";
                            $("#tab-registro :input").prop("disabled", true);
                            $("#tab-registro .input-group-addon").attr("style", "pointer-events:none;cursor:not-allowed");

                            // Si es rechazado y es usuario creador
                            ovariables.lstbotones.forEach(x => {
                                if (x.Funcion === 'fn_update') {
                                    _("spanfileuser").style.display = "";
                                    $("#tab-registro :input").prop("disabled", false);

                                    _('txtFechaSolicitud').disabled = true;
                                    _('txtCargo').disabled = true;
                                    _('txtJefe').disabled = true;
                                    _('txtArea').disabled = true;
                                    _('txtSubArea').disabled = true;
                                    _('txtEquipo').disabled = true;
                                    _('txtDias').disabled = true;
                                    _('txtDiasAcumulados').disabled = true;
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

                        
                    }
                }, (p) => { err(p); });
        }               

        function fn_cargartablafechas(_json) {
            let data = _json, htmlbody = '';
                           
                htmlbody = `<tr>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>1</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.idsolicitud}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechainicio}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechafin}</td>
                                </tr>`;
            _('tbody_tablafechas').innerHTML = htmlbody;
        }

        function fn_creartablaadvertenciafechascoincidentes(opcionfechas, fechainicio, fechafin, fechas) {
            let parametro = {
                fechainicio: fechainicio,
                fechafin: fechafin,
                fechas: fechas,
                rdfechas: opcionfechas,
                idsolicitud: ovariables.id
            };
            let tablaini = '', tablafin = '', tr = '';
            ovariables.tablacoincidenciasfechas = '';
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));

            _Post('RecursosHumanos/Vacaciones/GetAllData_FechasCoincidentes_DescansoMedico', frm)
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

        function fn_change_personal() {
            let idpersonal = _parseInt(_('cboNombre').value);
            let json = ovariables.lstsolicitud.filter(x => x.idpersonal === idpersonal)[0];
            _('txtCargo').value = json.nombrecargo;
            _('txtJefe').value = json.nombrejefe;
            _('txtArea').value = json.nombrearea;
            _('txtSubArea').value = json.nombresubarea;
            _('txtEquipo').value = json.nombreequipo;
            _("txtDiasAcumulados").value = json.totaldescansomedico;

            fn_calculardiasacumuladossubsidio();

            // Tabla Aprobador
            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = `<button class="btn btn-xs btn-outline btn-warning">
                                                                                                            <span class="fa fa-check-circle"></span>
                                                                                                        </button>`;
            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = json.nombrejefe;
            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = json.correojefe;
        }

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/DescansoMedico/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_save() {
            let fi = moment($("#txtFechaInicio").val(), 'DD/MM/YYYY');
            let ff = moment($("#txtFechaFin").val(), 'DD/MM/YYYY');
            if (fi.isValid() === false || ff.isValid() === false) {
                swal({ title: "Advertencia", text: "El rango de fechas no es válido.", type: "warning" });
                bool = false;
                return bool;
            }

            if (_isnotEmpty(_('txtFechaInicio').value) || _isnotEmpty(_('txtFechaInicio').value)) {
                swal({
                    html: true,
                    title: "Guardar Solicitud",
                    text: "¿Estas seguro/a que deseas guardar el Descanso Medico?",
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

                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_DescansoMedicoNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idpersonal: _('cboNombre').value,
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            comentario: json.comentario,
                            codigoestado: ovariables.estados.APROBADO,
                            idtipo: json.idtipo,
                            diagnostico: json.diagnostico,
                            idespecialidad: json.idespecialidad,
                            idlugaratencion: json.idlugaratencion,
                            accion: ovariables.accion,
                            cantidad: json.numdias,
                            diasacumulados: json.diasacumulados
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

                    _Post('RecursosHumanos/DescansoMedico/InsertData_DescansoMedico', frm)
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
            } else {
                swal({ title: "Advertencia", text: "La fecha de inicio y/o la fecha fin no pueden estar vacias.", type: "warning" });
            }
        }

        function fn_update() {
            if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaInicio').value)) {
                swal({
                    html: true,
                    title: "Actualizar Solicitud",
                    text: "¿Estas seguro/a que deseas actualizar el Descanso Medico?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_DescansoMedicoNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idsolicitud: ovariables.id,
                            idpersonal: _('cboNombre').value,
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            comentario: json.comentario,
                            codigoestado: ovariables.estados.APROBADO,
                            idtipo: json.idtipo,
                            diagnostico: json.diagnostico,
                            idespecialidad: json.idespecialidad,
                            idlugaratencion: json.idlugaratencion,
                            accion: ovariables.accion,
                            cantidad: json.numdias
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/DescansoMedico/InsertData_DescansoMedico', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                if (resultado === "0") {
                                    swal({ title: "¡Advertencia!", text: "La solicitud que estas intentando ingresar ya existe, favor de validar nuevamente sus datos.", type: "warning", showCancelButton: false, showConfirmButton: true });
                                    return false;
                                } else {
                                    swal({ title: "¡Solicitud Actualizada!", text: "Se guardo correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                    fn_return();
                                }   
                                //swal({
                                //    title: "¡Buen Trabajo!", text: "Se actualizo correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false
                                //});
                                //fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "La fecha de inicio y fin no pueden estar vacias", type: "warning" });
            }
        }

        function fn_cancelar() {
            swal({
                html: true,
                title: "Cancelar Solicitud",
                text: "¿Estas seguro/a que deseas Cancelar el Descanso Medico?",
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
                        idpersonal: _('cboNombre').value,
                        comentario: _('txtComentario').value,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/DescansoMedico/UpdateData_DescansoMedico', frm)
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

        // Funciones para archivo
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

            let urlaccion = '../RecursosHumanos/DescansoMedico/Download_DescansoMedico?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

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

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_return: fn_return,
            fn_save: fn_save,
            fn_update: fn_update,
            fn_cancelar: fn_cancelar
        }
    }
)(document, 'panelEncabezado_DescansoMedicoNew');
(
    function ini() {
        appDescansoMedicoNew.load();
        appDescansoMedicoNew.req_ini();
    }
)();
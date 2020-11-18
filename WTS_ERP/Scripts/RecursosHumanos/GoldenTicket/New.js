var appGoldenTicketNew = (
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
            estados: [],
            lstfechas: [],
            idsubarea: '',
            lstferiados: []
        }

        function load() {
            _initializeIboxTools();

            fn_crearcheckbox();

            // Datepicker
            _initializeDatepicker();

            // Events
            _('btnAgregar').addEventListener('click', fn_agregar_fecha);

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

            $('#txtFechaInicio').datepicker({
                autoclose: true,
                //clearBtn: true,
                startDate: '+1d',
                todayHighlight: true,
                language: "es",
                daysOfWeekDisabled: [0],
                weekStart: 1,
                multidate: false
            }).next().on('click', function (e) {
                $(this).prev().focus();
            });
        }

        function fn_agregar_fecha() {
            let fecha = _('txtFechaInicio').value, hora_inicio = _('txtHoraInicio').value, hora_fin = _('txtHoraFin').value;
            if (_isnotEmpty(fecha)) {
                if (_isnotEmpty(hora_inicio) && _isnotEmpty(hora_fin)) {
                    let golden_disponible = _parseInt(_('txtGoldenDisponibles').value);
                    if (golden_disponible > 0) {
                        let total_golden = ovariables.lstfechas;
                        if (total_golden.length > 0) {
                            total_golden = total_golden.map(x => x.cantidad).reduce((a, b) => a + b);
                        }
                        let string_fecha = `${fecha} ${hora_inicio} - ${hora_fin}`;
                        let tipo = $('.i-check:checked').data("id");
                        let cantidad = 0;
                        if (tipo === 0) {
                            cantidad = 1;
                        } else if (tipo === 1) {
                            cantidad = 1;
                        } else if (tipo === 2) {
                            cantidad = 2;
                        }
                        if ((total_golden + cantidad) <= golden_disponible) {
                            let existente = ovariables.lstfechas.filter(x => x.fecha.split(' ')[0] === fecha).length
                            if (existente === 0) {
                                _('txtGoldenUsar').value = total_golden + cantidad;
                                ovariables.lstfechas.push({ fecha: string_fecha, cantidad: cantidad });
                                _('taginputspan').insertAdjacentHTML('beforeend', `<div class="col-lg-6 no-padding">
                                                                                        <div class="input-group">
                                                                                            <input value="${string_fecha}" class="form-control no-pointer-events" type="text">
                                                                                            <span class="input-group-addon cursor" onclick="appGoldenTicketNew.fn_remove_fecha(this)">
                                                                                                <span class="fa fa-trash"></span>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>`);
                                // Limpia campos
                                _('txtFechaInicio').value = '';
                                _('txtHoraInicio').value = '';
                                _('txtHoraFin').value = '';
                                $("#txtFechaInicio").datepicker("setDate", null);
                                $('.i-check').prop('checked', false).iCheck('update');
                            } else {
                                swal({ title: "Advertencia", text: "La fecha ya existe", type: "warning" });
                            }
                        } else {
                            swal({ title: "Advertencia", text: "La cantidad excede el monto de Golden's disponibles", type: "warning" });
                        }
                    } else {
                        swal({ title: "Advertencia", text: "Debes tener por lo menos 1 Golden Ticket", type: "warning" });
                    }
                } else {
                    swal({ title: "Advertencia", text: "Debes seleccionar las horas (Mañana/Tarde/Todo el Dia)", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "La fecha no puede estar vacia", type: "warning" });
            }
        }

        function fn_remove_fecha(button) {
            let fecha = button.previousElementSibling.value;
            let div_col = button.parentElement.parentElement;
            // Elimina col
            div_col.remove();

            $("#txtFechaInicio").datepicker("setDate", null);
            // Actualiza ovariables
            ovariables.lstfechas = ovariables.lstfechas.filter(x => x.fecha !== fecha);
            // Se actualiza cantidad
            let total_golden = ovariables.lstfechas.length < 1 ? 0
                : ovariables.lstfechas.length < 2 ? ovariables.lstfechas[0].cantidad
                    : ovariables.lstfechas.reduce((a, b) => { return a.cantidad + b.cantidad });
            _('txtGoldenUsar').value = total_golden;
        }

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/GoldenTicket/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud)[0] : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.lstarchivo = rpta[0].archivo !== '' ? JSON.parse(rpta[0].archivo) : [];
                        ovariables.idsubarea = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud)[0].idsubarea : '';

                        let obj_feriados = rpta[0].lstferiados !== '' ? JSON.parse(rpta[0].lstferiados) : [];
                        obj_feriados.forEach(x => {
                            ovariables.lstferiados.push(moment(x.fecha, 'DD/MM/YYYY').toDate());
                        });

                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appGoldenTicketNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
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
                            _('txtGoldenDisponibles').value = ovariables.lstsolicitud.goldenticket;
                            _('txtComentario').value = "";
                            _('txtGoldenUsar').value = "0";
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
                            _('txtGoldenDisponibles').value = ovariables.lstsolicitud.goldenticket;
                            _('txtComentario').value = (ovariables.lstsolicitud.comentario !== undefined) ? ovariables.lstsolicitud.comentario : '';

                            // Fechas agregar
                            let btns_fecha = '';
                            let fechas = JSON.parse(ovariables.lstsolicitud.fechas);
                            fechas.forEach(x => {
                                btns_fecha += `<div class="col-lg-6 no-padding">
                                                <div class="input-group">
                                                    <input value="${x.fecha}" class="form-control no-pointer-events" type="text">
                                                    <span class="input-group-addon cursor" onclick="appGoldenTicketNew.fn_remove_fecha(this)">
                                                        <span class="fa fa-trash"></span>
                                                    </span>
                                                </div>
                                            </div>`;
                            });
                            _('taginputspan').innerHTML = btns_fecha;

                            // Cantidad golden calcular
                            _('txtGoldenUsar').value = fechas.map(x => x.cantidad).reduce((a, b) => a + b);

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
                            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = btnhtml;
                            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = ovariables.lstsolicitud.nombrejefe;
                            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = ovariables.lstsolicitud.correojefe;

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

            let datafechas = JSON.parse(data.fechas);
            let tr = datafechas.map(x => {
                let fecha = x.fecha.replace(' - ', '-').split(' ');
                let solofecha = fecha[0];
                let horaini = fecha[1].split('-')[0];
                let horafin = fecha[1].split('-')[1];
                return `<tr>                                    
                            <td class ='col-sm-3 text-center' style='vertical-align:middle'>${solofecha}</td>
                            <td class ='col-sm-3 text-center' style='vertical-align:middle'>${horaini}</td>
                            <td class ='col-sm-3 text-center' style='vertical-align:middle'>${horafin}</td>
                        </tr>`;
            }).join('');
            htmlbody = tr;
            //htmlbody = `<tr>                                    
            //                <td class ='col-sm-3 text-center' style='vertical-align:middle'>${''}</td>
            //                <td class ='col-sm-3 text-center' style='vertical-align:middle'>${''}</td>
            //                <td class ='col-sm-3 text-center' style='vertical-align:middle'>${''}</td>
            //            </tr>`;



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

            _Post('RecursosHumanos/GoldenTicket/GetAllData_FechasCoincidentes_GoldenTicket', frm)
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
                                        <button type="button" class="btn btn-info" onclick="appGoldenTicketNew.${ovariables.modal_callback}()">
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
                                            <textarea id="txtComentarioModal" class="form-control col-sm-12 _enty" name="Descripcion" rows="6" style="resize:none" placeholder="Ingresar comentarios" data-id="Comentario" data-min="1" data-max="200" maxlength="200"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            modal_body.html(html);
        }

        function fn_crearcheckbox() {
            $('.i-check').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                if ($(this).prop("checked")) {
                    let id = $(this).data("id");
                    if (id === 0) {
                        _('txtHoraInicio').value = '08:30';
                        _('txtHoraFin').value = '13:00';
                    } else if (id === 1) {
                        _('txtHoraInicio').value = '13:00';
                        _('txtHoraFin').value = '18:30';
                    } else if (id === 2) {
                        _('txtHoraInicio').value = '08:30';
                        _('txtHoraFin').value = '18:30';
                    }
                }
            });
        }

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/GoldenTicket/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_validarcantidadgoldens() {
            let goldensDisponibles = ovariables.lstsolicitud.goldenticket;
            let goldensSolicitados = JSON.parse(ovariables.lstsolicitud.fechas);
            if (goldensSolicitados > 0) {
                goldensSolicitados = goldensSolicitados.map(x => x.cantidad).reduce((a, b) => a + b);
            } else {
                goldensSolicitados = goldensSolicitados.length;
            }

            if (goldensDisponibles < goldensSolicitados) {
                swal({
                    title: "Advertencia",
                    text: "El colaborador solo tiene " + goldensDisponibles + " Goldens Tickets disponibles",
                    type: "warning"
                }, function () {
                    return false;
                });
            } else {
                return true;
            }
            return false;
        }

        function fn_validarconcideraciones(lstfechas) {
            let bool = false;
            let goldenfechaingresado = [];
            let goldenaprob = [];
            if (lstfechas.length === 0) {
                swal({ title: "Advertencia", text: "Debes agregar por lo menos una fecha.", type: "warning" });
                return bool;
            } else {
                goldenfechaingresado = lstfechas.map(x => {
                    let mes = moment(x.fecha.split(' ')[0], "DD/MM/YYYY").toDate().getMonth();
                    return mes;
                });
            }
            if (goldenfechaingresado.length > 0) {
                goldenfechaingresado.map(mes => {
                    if (ovariables.idsubarea != '4' && ovariables.idsubarea != '35') {
                        if ((mes === 11 || mes === 0 || mes === 1 || mes === 2)) {
                            goldenaprob.push(mes);
                        }
                    } else {
                        goldenaprob.push(mes);
                    }
                });
            } else {
                return bool;
            }
            if (goldenaprob.length !== goldenfechaingresado.length) {
                swal({ title: "Advertencia", text: "Revise las fechas ingresadas!. Puedes disfrutar tus Golden Tickets desde el 1° de Diciembre hasta el 31° de Marzo del siguiente año", type: "warning" });
                return bool;
            } else {
                bool = true;
                return bool;
            }
            return bool;
        }

        function fn_save() {
            if (fn_validarconcideraciones(ovariables.lstfechas)) {
                swal({
                    html: true,
                    title: "Guardar Solicitud",
                    text: "¿Estas seguro/a que deseas guardar tu Solicitud de Golden Ticket? <br /> <span style='font-weight: 400; font-size: 14px;'>Esta solicitud se enviara de forma automatica a tu Jefe directo para su Aprobación</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO",
                    closeOnConfirm: false
                }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_GoldenTicketNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            fechas: ovariables.lstfechas,
                            comentario: json.comentario_nuevo,
                            codigoestado: (ovariables.esgerentegeneral === '0') ? ovariables.estados.PORAPROBAR : ovariables.estados.APROBADO,
                            accion: ovariables.accion
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/GoldenTicket/InsertData_GoldenTicket', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                if (resultado === '-1') {
                                    swal({ title: "¡Advertencia!", text: "No se puede guardar!. Hay una solicitud con el mismo periodo o fechas.", type: "warning", showCancelButton: false, showConfirmButton: true });
                                    return false;
                                } else {
                                    swal({ title: "¡Solicitud Generada!", text: "Haz enviado tu solicitud de vacaciones correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                    fn_return();
                                }
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
            //else {
            //    swal({ title: "Advertencia", text: "Debes agregar por lo menos una fecha", type: "warning" });
            //}
        }

        function fn_update() {
            if (ovariables.lstfechas.length > 0) {
                swal({
                    html: true,
                    title: "Guardar Solicitud",
                    text: "¿Estas seguro/a que deseas guardar tu Solicitud de Golden Ticket? <br /> <span style='font-weight: 400; font-size: 14px;'>Esta solicitud se enviara de forma automatica a tu Jefe directo para su Aprobación</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO",
                    closeOnConfirm: false
                }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_GoldenTicketNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            fechas: ovariables.lstfechas,
                            comentario: json.comentario_nuevo,
                            codigoestado: ovariables.estados.PORAPROBAR,
                            accion: ovariables.accion,
                            idsolicitud: ovariables.id
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/GoldenTicket/InsertData_GoldenTicket', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Solicitud Actualizada!", text: "Haz enviado tu solicitud correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "Debes agregar por lo menos una fecha", type: "warning" });
            }
        }

        function fn_aprobar() {
            if (!fn_validarcantidadgoldens()) {
                return false;
            }

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
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_GoldenTicketNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.APROBADO,
                        cantidad: _('txtGoldenUsar').value,
                        cantidad_calculada: parseInt(_('txtGoldenDisponibles').value) - parseInt(_('txtGoldenUsar').value)
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/GoldenTicket/UpdateData_GoldenTicket', frm)
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

        function fn_cancelar() {
            ovariables.modal_title = 'Cancelar Solicitud';
            ovariables.modal_callback = 'fn_cancelar_grabar';
            $('#modal_solicitud').modal('show');
        }

        function fn_cancelar_grabar() {
            swal({
                html: true,
                title: "Cancelar Solicitud",
                text: "¿Estas seguro/a que deseas tu Solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_GoldenTicketNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/GoldenTicket/UpdateData_GoldenTicket', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Cancelada!", text: "Se cancelo la solicitud correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
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
                text: "¿Estas seguro/a que deseas Rechazar la solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_GoldenTicketNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.RECHAZADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/GoldenTicket/UpdateData_GoldenTicket', frm)
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
            fn_remove_fecha: fn_remove_fecha
        }
    }
)(document, 'panelEncabezado_GoldenTicketNew');
(
    function ini() {
        appGoldenTicketNew.load();
        appGoldenTicketNew.req_ini();
    }
)();
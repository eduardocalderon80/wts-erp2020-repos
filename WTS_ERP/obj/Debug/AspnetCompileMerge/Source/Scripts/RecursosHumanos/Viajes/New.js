var appViajesNew = (
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
            estados: [],
            rangofechas: [],
            rangofechasdates: [],
            seleccionfechas: new Array(),
            esjefe: '',
            esgerentegeneral : (parseInt(window.utilindex.idpersonal,10) === 14) ? '1':'0',
            tablacoincidenciasfechas: '',
            configuracionvacaciones: [],
            configuracionvacaciones_plazominimomes: 0,
            configuracionvacaciones_usominimo: 0,
            configuracionvacaciones_condiciondiasminimo: 0,
            configuracionvacaciones_plazominimonormal: 0,
            configuracionvacaciones_plazominimoespecial: 0,
            fecha_incorporacion: ''
        }

        function load() {
            // Inicia IboxTools
            _initializeIboxTools();

            // Inicia datepicker
            _initializeDatepicker();

            // Init Datepicker
            $('#rangecalendario .input-daterange').datepicker({
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true,
                todayHighlight: true,
                language: "es",                
                weekStart: 1
            });

            fn_rangecalendario();

            $('#txtFechas').datepicker({
                autoclose: false,
                //clearBtn: true,
                todayHighlight: true,
                language: "es",                
                weekStart: 1,
                multidate: true
            }).on('changeDate', function (e) {
                //$('#txtFechas').importTags('');

                ovariables.seleccionfechas = null;
                ovariables.seleccionfechas = new Array();
                $("#taginputspan").empty();
                _("hdnFechas").value = "";
                e.dates.forEach((x) => {
                    let fecha = fn_convertirDateToStringFormat_ddMMyyyy(x);
                    //$('#txtFechas').addTag(fecha);
                    ovariables.seleccionfechas.push(fecha);
                    //$("#taginputspan").append(`<span class='${fecha.split('/').join('')} col-lg-3 col-md-6 col-sm-6 col-xs-12 border-left-right border-top border-bottom padding zoomtags text-center' style="font-size:13px; padding:5px 5px 5px 5px; word-break:break-all">${fecha}<a id="${fecha.split('/').join('')}" href='javascript:void(0);' class="pull-right padding" style="font-size:14px; font-wight:bolder; color:red;" onclick='appViajesNew.removetag("${fecha.split('/').join('')}","${fecha}")'>x</a></span>`);
                    $("#taginputspan").append(`<div class="col-xs-12 col-lg-4 col-sm-6 col-md-6 no-padding">
                                                       <div class="input-group">
                                                           <input value="${fecha}" class="form-control no-pointer-events" type="text" title="${fecha}">
                                                           <span class="input-group-addon cursor" onclick='appViajesNew.removetag("${fecha}")'>
                                                               <span class="fa fa-trash"></span>
                                                           </span>
                                                       </div>
                                                   </div>`);
                    $('#txtFechas').val("");
                    //e.date = null;

                    if (_("hdnFechas").value === "") {
                        _("hdnFechas").value = fecha;
                    } else {
                        _("hdnFechas").value += "," + fecha;
                    }
                });

                _("txtDias").value = e.dates.length;

                //e.date = null;
            })
                .next().on('click', function (e) {
                    $(this).prev().focus();
                });

            

            fn_calculardias();
            $("#rangofechas1,#rangofechas2").on("change", function () {
                fn_crearoptions(this);
            });

            // Crea modal ,funcion en archivo Util.js
            _modal('solicitud', 'auto', '', null, 'bg-success', '', 'modal-lg');

            $('#modal_solicitud').on('show.bs.modal', fn_crearmodalsolicitud);

            // Se obtiene parametro si tuviera
            let par = _('txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.ruta = _par(par, 'ruta');
            }

        }

        function fn_rangecalendario() {
            $('#rangecalendario .input-daterange input').each(function () {
                $(this)
                    .datepicker().on("changeDate", function (e) {

                        if ($(this).attr("id") === "txtFechaInicio") {
                            ovariables.rangofechasdates[0] = e.date;
                            ovariables.rangofechas[0] = (fn_convertirDateToStringFormat_ddMMyyyy(e.date));
                            $("#txtFechaFin").datepicker("setStartDate", ovariables.rangofechasdates[0]);
                        }
                        if ($(this).attr("id") === "txtFechaFin") {
                            ovariables.rangofechasdates[1] = e.date;
                            ovariables.rangofechas[1] = (fn_convertirDateToStringFormat_ddMMyyyy(e.date));
                        }
                        if (ovariables.rangofechasdates[0] !== undefined && ovariables.rangofechasdates[0] !== "") {
                            if (ovariables.rangofechasdates[1] !== undefined && ovariables.rangofechasdates[1] !== "") {
                                //let cont_domsab = cuentaFindes(ovariables.rangofechasdates[0], ovariables.rangofechasdates[1]);
                                _("txtDias").value = ((ovariables.rangofechasdates[1] - ovariables.rangofechasdates[0]) / (1000 * 3600 * 24)) + 1;
                                if (parseInt(_("txtDias").value) < 1) {
                                    _("txtDias").value = 0;
                                    _("txtFechaInicio").value = "";
                                    _("txtFechaFin").value = "";
                                    //swal({ title: "Advertencia", text: "La fecha fin no puede ser menor a la fecha inicio", type: "warning" });
                                }
                            } else {
                                _("txtDias").value = "0";
                            }
                        }
                    })
                    .next().on('click', function () {
                        $(this).prev().focus();
                    });
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
                

        function cuentaFindes(inicio, fin) {
            let ini = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
            var timeDiff = Math.abs(fin.getTime() - inicio.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //Días entre las dos fechas
            var cuentaFinde = 0; //Número de Sábados y Domingos            

            for (var i = 0; i < diffDays; i++) {
                //0 => Domingo - 6 => Sábado
                if (ini.getDay() == 0 || ini.getDay() == 6) {
                    cuentaFinde++;
                }
                ini.setDate(ini.getDate() + 1)
            }

            return cuentaFinde;
        }

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
                _('txtFechaFin').value = _par(par, 'fechafin');
                fn_calculardias();
            }
        }

        function fn_convertirDateToStringFormat_ddMMyyyy(date) {
            let dia, mes, ano;
            if (date.getDate() < 10) {
                dia = "0" + date.getDate();
            } else {
                dia = date.getDate();
            }
            if ((date.getMonth() + 1) < 10) {
                mes = "0" + (date.getMonth() + 1);
            } else {
                mes = (date.getMonth() + 1);
            }
            ano = date.getFullYear();
            return dia + "/" + mes + "/" + ano;
        }

        function fn_crearoptions(e) {
            if ($(e).attr("id") === "rangofechas2") {
                $("div.calendario").addClass("hide");
                $("div.rangecalendario").removeClass("hide");
                _("hdnRdFechas").value = "2";
                if (ovariables.rangofechasdates.length === 2) {
                    //let cont_domsab = cuentaFindes(ovariables.rangofechasdates[0], ovariables.rangofechasdates[1]);
                    _("txtDias").value = ((ovariables.rangofechasdates[1] - ovariables.rangofechasdates[0]) / (1000 * 3600 * 24)) + 1;
                }
            }
            if ($(e).attr("id") === "rangofechas1") {
                $("div.calendario").removeClass("hide");
                $("div.rangecalendario").addClass("hide");
                _("hdnRdFechas").value = "1";
                _("txtDias").value = $("#txtFechas").datepicker("getDates").length;
            }
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
                                        <button type="button" class="btn btn-info" onclick="appViajesNew.${ovariables.modal_callback}()">
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
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <div class="col-sm-12">
                                           <div id='divFechasCoincidentes' class='table-responsive'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

            modal_body.html(html);

            let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
            let err = function (__err) { console.log('err', __err) }

            fn_creartablaadvertenciafechascoincidentes(json.rdfechas, json.fechainicio, json.fechafin, json.fechas);
        }

        function fn_calculardias() {
            let txtFechaInicio = _('txtFechaInicio').value;
            let txtFechaFin = _('txtFechaFin').value;

            let date1 = new Date(txtFechaInicio.split("/")[2], txtFechaInicio.split("/")[1] - 1, txtFechaInicio.split("/")[0]);
            let date2 = new Date(txtFechaFin.split("/")[2], txtFechaFin.split("/")[1] - 1, txtFechaFin.split("/")[0]);

            let Difference_In_Time = date2.getTime() - date1.getTime();
            let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            // Se agrega 1 ya que en calculo no se considera el ultimo dia
            if (isNaN(Difference_In_Days)) {
                _('txtDias').value = "0";
            } else {
                _('txtDias').value = Difference_In_Days + 1;
            }
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

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/Viajes/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        // Validacion para condiciones vacaciones
        function fn_Check_All_Conditions() {
            let fechaincor = moment(ovariables.fecha_incorporacion, 'DD/MM/YYYY');
            let fechaini = moment(_("txtFechaSolicitud").value, 'DD/MM/YYYY');

            let mesesDif = fechaini.diff(fechaincor, 'months', true);


            let bool = true;
            let cantidad_dias = parseInt(_('txtDias').value);
            let dias_disponibles = parseInt(_('txtDiasAcumulados').value);
            if (mesesDif < ovariables.configuracionvacaciones_plazominimomes) {  //if (ovariables.lstsolicitud.totalmeses < 6) {
                swal({ title: "Advertencia", text: "Debes tener como minimo " + ovariables.configuracionvacaciones_plazominimomes + " meses laborando para solicitar tus vacaciones", type: "warning" });
                bool = false;
            } else if (cantidad_dias > dias_disponibles) {
                swal({ title: "Advertencia", text: "La cantidad de dias no puede ser mayor a la disponible", type: "warning" });
                bool = false;
            } else if (cantidad_dias < ovariables.configuracionvacaciones_usominimo) {   //} else if (cantidad_dias < 1) {
                let tipo = parseInt(_('hdnRdFechas').value);
                if (tipo === 1) {
                    if (_isEmpty(_('hdnFechas').value)) {
                        swal({ title: "Advertencia", text: "Debes seleccionar como minimo 1 fecha", type: "warning" });
                        bool = false;
                    }
                } else {
                    let fi = moment($("#txtFechaInicio").val(), 'DD/MM/YYYY');
                    let ff = moment($("#txtFechaFin").val(), 'DD/MM/YYYY');
                    if (fi.isValid() === false || ff.isValid() === false) {
                        swal({ title: "Advertencia", text: "El rango de fechas no es válido.", type: "warning" });
                        bool = false;
                        return bool;
                    }

                    if (_isEmpty(_('txtFechaInicio').value) && _isEmpty(_('txtFechaFin').value)) {
                        swal({ title: "Advertencia", text: "Debes seleccionar un rango de fechas", type: "warning" });
                        bool = false;
                    }
                }
            } else if (cantidad_dias >= 1 && cantidad_dias <= 2) {
                let tipo = parseInt(_('hdnRdFechas').value);
                if (tipo === 1) {
                    let arreglo = _('hdnFechas').value.split(',');
                    arreglo = arreglo.map(x => (_strToDate(x + ' 0:00')));
                    arreglo = arreglo.sort((a, b) => a - b);
                    let fechainicio = arreglo[0];
                    let date = new Date();
                    //date.setDate(date.getDate() + 7);
                    // cuando la cantidad de dias es igual a 1 se dara como plazo minimo 24 horas o 1 dia para registrar la solicitud
                    date = moment(date).add(ovariables.configuracionvacaciones_usominimo, 'days').toDate();  //date.setDate(date.getDate() + 2);
                    if (fechainicio < date) {
                        swal({ title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " dia/s, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_usominimo + " día de anticipacion como mínimo.", type: "warning" });
                        bool = false;
                    }
                } else {
                    let fi = moment($("#txtFechaInicio").val(), 'DD/MM/YYYY');
                    let ff = moment($("#txtFechaFin").val(), 'DD/MM/YYYY');
                    if (fi.isValid() === false || ff.isValid() === false) {
                        swal({ title: "Advertencia", text: "El rango de fechas no es válido.", type: "warning" });
                        bool = false;
                        return bool;
                    }

                    let fechainicio = _strToDate(_('txtFechaInicio').value + ' 0:00');
                    let date = new Date();
                    date = moment(date).add(ovariables.configuracionvacaciones_usominimo, 'days').toDate();  ////date.setDate(date.getDate() + 2);
                    if (fechainicio < date) {
                        swal({
                            title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " dia/s, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_usominimo + " día de anticipacion como mínimo.", type: "warning"
                        });
                        bool = false;
                    }
                }
            } else if (cantidad_dias >= 3 && cantidad_dias <= ovariables.configuracionvacaciones_plazominimoespecial) {   //} else if (cantidad_dias > 2 && cantidad_dias < 8) {
                let tipo = parseInt(_('hdnRdFechas').value);
                if (tipo === 1) {
                    let arreglo = _('hdnFechas').value.split(',');
                    arreglo = arreglo.map(x => (_strToDate(x + ' 0:00')));
                    arreglo = arreglo.sort((a, b) => a - b);
                    let fechainicio = arreglo[0];
                    let date = new Date();
                    date = moment(date).add(ovariables.configuracionvacaciones_plazominimoespecial, 'days').toDate();  // date.setDate(date.getDate() + 7);
                    if (fechainicio < date) {
                        swal({ title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " día/s, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_plazominimoespecial + " dias de anticipacion como mínimo.", type: "warning" });
                        bool = false;
                    }
                } else {
                    let fi = moment($("#txtFechaInicio").val(), 'DD/MM/YYYY');
                    let ff = moment($("#txtFechaFin").val(), 'DD/MM/YYYY');
                    if (fi.isValid() === false || ff.isValid() === false) {
                        swal({ title: "Advertencia", text: "El rango de fechas no es válido.", type: "warning" });
                        bool = false;
                        return bool;
                    }

                    let fechainicio = _strToDate(_('txtFechaInicio').value + ' 0:00');
                    let date = new Date();
                    date = moment(date).add(ovariables.configuracionvacaciones_plazominimoespecial, 'days').toDate();  //date.setDate(date.getDate() + 7);
                    if (fechainicio < date) {
                        swal({ title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " día/s, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_plazominimoespecial + " dias de anticipacion como mínimo.", type: "warning" });
                        bool = false;
                    }
                }
            } else if (cantidad_dias > ovariables.configuracionvacaciones_plazominimoespecial) {  // } else if (cantidad_dias > 7) {
                let tipo = parseInt(_('hdnRdFechas').value);
                if (tipo === 1) {
                    let arreglo = _('hdnFechas').value.split(',');
                    arreglo = arreglo.map(x => (_strToDate(x + ' 0:00')));
                    arreglo = arreglo.sort((a, b) => a - b);
                    let fechainicio = arreglo[0];
                    let date = new Date();
                    date = moment(date).add(ovariables.configuracionvacaciones_plazominimonormal, 'days').toDate();  //date.setDate(date.getDate() + 14);
                    if (fechainicio < date) {
                        swal({ title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " dias, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_plazominimonormal + " dias de anticipacion como mínimo.", type: "warning" });
                        bool = false;
                    }
                } else {
                    let fi = moment($("#txtFechaInicio").val(), 'DD/MM/YYYY');
                    let ff = moment($("#txtFechaFin").val(), 'DD/MM/YYYY');
                    if (fi.isValid() === false || ff.isValid() === false) {
                        swal({ title: "Advertencia", text: "El rango de fechas no es válido.", type: "warning" });
                        bool = false;
                        return bool;
                    }

                    let fechainicio = _strToDate(_('txtFechaInicio').value + ' 0:00');
                    let date = new Date();
                    date = moment(date).add(ovariables.configuracionvacaciones_plazominimonormal, 'days').toDate();  //date.setDate(date.getDate() + 14);
                    if (fechainicio < date) {
                        swal({ title: "Advertencia", text: "Estas solicitando " + _("txtDias").value + " dias, por lo tanto debes registrar tu solicitud con " + ovariables.configuracionvacaciones_plazominimonormal + " dias de anticipacion como minimo.", type: "warning" });
                        bool = false;
                    }
                }
            }
            return bool;
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

            _Post('RecursosHumanos/Viajes/GetAllData_FechasCoincidentes_Viajes', frm)
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
                                tr += `<tr><td class='text-center' colspan="6">No existen coincidencias en fechas con otras solicitudes</td></tr>`;
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

        function fn_save() {
            if (true) {
                let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                if (req_enty) {
                    swal({
                        html: true,
                        title: "Guardar Solicitud",
                        text: "¿Estas seguro/a que deseas guardar tu Solicitud de Viajes?.",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "SI",
                        cancelButtonText: "NO",
                        closeOnConfirm: false
                    }, function () {
                        let tablaaprobador = [];
                        tablaaprobador = fn_get_aprobador('detalleTablaAprobador');
                        let arrAprobador = JSON.stringify(tablaaprobador);

                            let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                        let err = function (__err) { console.log('err', __err) };

                        let parametro = {
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            fechas: fn_ordenarfechas_seleccionadas(json.fechas),
                            cantidad: json.numdias,
                            comentario: (json.comentario === undefined) ? '' : json.comentario,
                            rdfechas: json.rdfechas,
                            codigoestado: (ovariables.esgerentegeneral === '0') ? ovariables.estados.PORAPROBAR : ovariables.estados.APROBADO,
                            accion: ovariables.accion
                        };

                        let frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));

                        frm.append('pararraprobador', arrAprobador);

                        _Post('RecursosHumanos/Viajes/InsertData_Viajes', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    if (resultado === '-1') {
                                        swal({ title: "¡Advertencia!", text: "No se puede guardar!. Hay una solicitud con el mismo periodo o fechas.", type: "warning", showCancelButton: false, showConfirmButton: true });
                                        return false;
                                    } else {
                                        swal({ title: "¡Solicitud Generada!", text: "Haz enviado tu solicitud de viajes correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
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
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Actualizar Solicitud",
                    text: "¿Estas seguro/a que deseas actualizar tu solicitud de Viaje?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "SI",
                    cancelButtonText: "NO",
                    closeOnConfirm: false
                }, function () {
                        let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            fechas: fn_ordenarfechas_seleccionadas(json.fechas),
                            cantidad: _('txtDias').value,
                            comentario: (json.comentario === undefined) ? '' : json.comentario,
                            rdfechas: json.rdfechas,
                            codigoestado: ovariables.estados.PORAPROBAR,
                            accion: ovariables.accion,
                            idsolicitud: ovariables.id
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Viajes/InsertData_Viajes', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Solicitud Actualizada!", text: "Haz enviado tus viajes correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_aprobar() {
            //let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_VacacionesNew' });
            //let err = function (__err) { console.log('err', __err) }

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
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                let err = function (__err) { console.log('err', __err) }
                let parametro = {
                    idsolicitud: ovariables.id,
                    comentario: json.comentario,
                    codigoestado: ovariables.estados.APROBADO
                };
                let frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Viajes/UpdateData_Viajes', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Aprobada!", text: "Se actualizo las viajes correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
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
                text: "¿Estas seguro/a que deseas Cancelar tus viajes?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Viajes/UpdateData_Viajes', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Cancelada!", text: "Se cancelo tus viajes correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
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
                text: "¿Estas seguro/a que deseas Rechazar las viajes?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ViajesNew' });
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.id,
                        comentario: json.comentario,
                        codigoestado: ovariables.estados.RECHAZADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Viajes/UpdateData_Viajes', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Rechazada!", text: "Se rechazaron las viajes correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/Viajes/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud)[0] : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.configuracionvacaciones = rpta[0].configuracionvacaciones !== '' ? JSON.parse(rpta[0].configuracionvacaciones) : [];
                        //ovariables.lstarchivo = rpta[0].archivo !== '' ? JSON.parse(rpta[0].archivo) : [];
                        ovariables.fecha_incorporacion = ovariables.lstsolicitud.fechaincorporacion;
                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        //cargar variables de configuracion de vacaciones
                        ovariables.configuracionvacaciones_plazominimomes = ovariables.configuracionvacaciones.plazo_minimo;
                        ovariables.configuracionvacaciones_usominimo = ovariables.configuracionvacaciones.uso_minimo;
                        ovariables.configuracionvacaciones_condiciondiasminimo = ovariables.configuracionvacaciones.condicion_dias_minimo;
                        ovariables.configuracionvacaciones_plazominimonormal = ovariables.configuracionvacaciones.plazo_minimo_normal;
                        ovariables.configuracionvacaciones_plazominimoespecial = ovariables.configuracionvacaciones.plazo_minimo_especial;

                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appViajesNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
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
                            _('txtFechaIncorporacion').value = ovariables.lstsolicitud.fechaincorporacion;
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('txtDiasAcumulados').value = ovariables.lstsolicitud.cantidadvacaciones;

                            // Tabla Aprobador
                            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = `<button class="btn btn-sm btn-outline btn-warning">
                                                                                                            <span class="fa fa-check"></span>
                                                                                                        </button>`;
                            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = ovariables.lstsolicitud.nombrejefe;
                            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = ovariables.lstsolicitud.correojefe;
                        } else {
                            // Llenamos valores
                            _('txtFechaSolicitud').value = ovariables.lstsolicitud.fechasolicitud;
                            _('txtFechaIncorporacion').value = ovariables.lstsolicitud.fechaincorporacion;
                            _('txtNombre').value = ovariables.lstsolicitud.nombrepersonal;
                            _('txtCargo').value = ovariables.lstsolicitud.nombrecargo;
                            _('txtJefe').value = ovariables.lstsolicitud.nombrejefe;
                            _('txtArea').value = ovariables.lstsolicitud.nombrearea;
                            _('txtSubArea').value = ovariables.lstsolicitud.nombresubarea;
                            _('txtEquipo').value = ovariables.lstsolicitud.nombreequipo;
                            _('txtDiasAcumulados').value = ovariables.lstsolicitud.cantidadvacaciones;

                            if (ovariables.lstsolicitud.fechas !== "") {
                                $("#rangofechas1").prop("checked", true);
                                $("#hdnRdFechas").val("1");
                                $("div.calendario").removeClass("hide");
                                $("div.rangecalendario").addClass("hide");
                                let arrFechas = ovariables.lstsolicitud.fechas.split(',');
                                if (arrFechas.length > 0) {
                                    let items = "";
                                    arrFechas.forEach(x => {
                                        //items += `<span class='${x.split('/').join('')} col-lg-3 col-md-6 col-sm-6 col-xs-12 border-left-right border-top border-bottom padding zoomtags text-center' style="font-size:13px; padding:5px 5px 5px 5px; word-break:break-all">${x}</span>`
                                        items += `<div class="col-xs-12 col-lg-4 col-sm-6 col-md-6 no-padding">
                                                       <div class="input-group">
                                                           <input value="${x}" class="form-control no-pointer-events" type="text">
                                                           <span class="input-group-addon cursor" onclick='appViajesNew.removetag("${x}")'>
                                                               <span class="fa fa-trash"></span>
                                                           </span>
                                                       </div>
                                                   </div>`
                                    });
                                    $('#txtFechas').datepicker("setDates", ovariables.lstsolicitud.fechas.split(','));
                                    _('txtFechas').value = "";
                                    _("taginputspan").innerHTML = items
                                }
                            } else {
                                $("#rangofechas2").prop("checked", true);
                                $("#hdnRdFechas").val("2");
                                //_('txtFechaInicio').value = ovariables.lstsolicitud.fechainicio;
                                //_('txtFechaFin').value = ovariables.lstsolicitud.fechafin;
                                //_('txtComentario').value = ovariables.lstsolicitud.comentario;

                                $("div.calendario").addClass("hide");
                                $("div.rangecalendario").removeClass("hide");

                                let dateini = _strToDate(ovariables.lstsolicitud.fechainicio + ' 0:00');
                                let datefin = _strToDate(ovariables.lstsolicitud.fechafin + ' 0:00');

                                $("#txtFechaInicio").datepicker("setDate", dateini);
                                $("#txtFechaFin").datepicker("setDate", datefin);

                                //let cont_domsab = cuentaFindes(dateini, datefin);
                                _("txtDias").value = ((datefin - dateini) / (1000 * 3600 * 24)) + 1;
                            }

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
                            $("#taginputspan :input").prop("disabled", false);
                            $("#tab-registro .input-group-addon").attr("style", "pointer-events:none;cursor:not-allowed");

                            // Si es rechazado y es usuario creador
                            ovariables.lstbotones.forEach(x => {
                                if (x.Funcion === 'fn_update') {
                                    _("spanfileuser").style.display = "";
                                    $("#tab-registro :input").prop("disabled", false);
                                    //_("txtDias").disabled = true;
                                    //_("txtDiasAcumulados").disabled = true;
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


                            $("#txtFechaInicio").removeClass("border-left-right border-top border-bottom");
                            _('txtFechaInicio').style = "background-color:#eee!important;border-top: 0px; border-bottom:0px; border-left:0px; border-right:0px";
                            _('txtFechaInicio').border = 1;
                            $("#txtFechaFin").removeClass("border-left-right border-top border-bottom");
                            _('txtFechaFin').style = "background-color:#eee!important;border-top: 0px; border-bottom:0px; border-left:0px; border-right:0px";
                            _('txtFechaFin').border = 1;

                            $("#txtFechas").removeClass("border-left-right border-top border-bottom");
                            _('txtFechas').style = "background-color:#eee!important; border-top: 0px; border-bottom:0px; border-left:0px; border-right:0px";
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

            if (data.fechas === "") {
                let dateini = _strToDate(data.fechainicio + ' 0:00');
                let datefin = _strToDate(data.fechafin + ' 0:00');

                //let cont_domsab = cuentaFindes(dateini, datefin);
                let dias = ((datefin - dateini) / (1000 * 3600 * 24)) + 1;
                htmlbody = `<tr>                                    
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>Por Periodo</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechainicio}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${data.fechafin}</td>
                                    <td class ='col-sm-3 text-center font-bold' style='vertical-align:middle'>${data.cantidaddias}</td>
                                </tr>`;
            } else {
                let arrfechas = data.fechas.split(',');
                let tr = '<tr>';
                let count = 0;
                let totaldias = 0;
                let t = '';
                htmlbody = arrfechas.map(x => {
                    count++;
                    totaldias = x.cantidaddias;
                    return `<tr>                                   
                                    
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>Por día</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${x}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${x}</td>
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>1</td>
                             </tr>`;

                }).join('');
                htmlbody += `<tr>                                   
                                    
                                    <td class ='col-sm-3 text-center font-bold' colspan='3' style='vertical-align:middle; text-align:right'>Total</td>                                    
                                    <td class ='col-sm-3 text-center' style='vertical-align:middle'>${count}</td>
                             </tr>`;
            }


            _('tbody_tablafechas').innerHTML = htmlbody;
        }

        function fn_creartabla(_json) {
            let data = _json, htmlbody = '';
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class ='text-center' style='vertical-align:middle'>${x.fechacreacion}</td>
                                    <td class ='text-center' style='vertical-align:middle'>${x.horacreacion}</td>
                                    <td style='vertical-align:middle'>${x.estado}</td>
                                    <td style='vertical-align:middle'>${x.usuario}</td>
                                    <td style='vertical-align:middle'>${fn_textoacccion(x.codigoestado)}</td>
                                    <td style='vertical-align:middle'>${x.comentario}</td>
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

        function fn_ordenarfechas_seleccionadas(stringfechas) {
            let fechas = [];
            //convirtiendo fechas string en fechas Date y agregarla a la coleccion fechas
            let splitfechas = stringfechas.split(',');
            splitfechas.forEach((x) => {
                fechas.push(new Date(parseInt(x.split('/')[2], 10), parseInt((x.split('/')[1] - 1), 10), parseInt(x.split('/')[0]), 10));
            });

            fechas.sort((a, b) => a.valueOf() - b.valueOf());
            return fechas.map((x) => {
                return moment(x).format('DD/MM/YYYY');
            }).join(',');
        }

        function FechasEntreRangoFechas(desde, hasta) {
            var fechaInicio = new Date(desde);
            var fechaFin = new Date(hasta);
            var fechas = [];

            let dia, mes;
            //(fechaFin.getTime() >= fechaInicio.getTime())

            while (fechaFin.getTime() >= fechaInicio.getTime()) {

                if (fechaInicio.getDay() !== 0 && fechaInicio.getDay() !== 6) {
                    if (fechaInicio.getDate().toString().length === 1) {
                        dia = (fechaInicio.getDate().length < 10) ? '0' + (fechaInicio.getDate().toString()) : fechaInicio.getDate().toString();
                    } else {
                        dia = (fechaInicio.getDate().toString());
                    }

                    if (fechaInicio.getMonth().toString().length === 1) {
                        mes = mes = (fechaInicio.getMonth().length < 10) ? '0' + (fechaInicio.getMonth() + 1).toString() : (fechaInicio.getMonth() + 1).toString();
                    } else {
                        mes = (fechaInicio.getMonth() + 1).toString()
                    }

                    if (fechaFin.getTime() >= fechaInicio.getTime()) {
                        fechas.push(dia + '/' + mes + '/' + fechaInicio.getFullYear().toString());
                    }
                    fechaInicio.setDate(fechaInicio.getDate() + 1);

                } else {
                    fechaInicio.setDate(fechaInicio.getDate() + 1);
                }
                //console.log(fechaInicio.getFullYear() + '/' + (fechaInicio.getMonth() + 1) + '/' + fechaInicio.getDate());
            }

            return fechas;

            //var dia_actual = desde;
            //var fechas = [];
            //while (dia_actual.isSameOrBefore(hasta)) {
            //    fechas.push(dia_actual.format('dd/mm/yyyy'));
            //    dia_actual.add(1, 'days');
            //}
            //return fechas;
        }

        //var desde = moment("2017-11-29");
        //var hasta = moment("2017-12-05");
        //var results = diasEntreFechas(desde, hasta);
        //console.log(results);

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
            fn_ordenarfechas_seleccionadas: fn_ordenarfechas_seleccionadas
        }
    }
)(document, 'panelEncabezado_ViajesNew');
(
    function ini() {
        appViajesNew.load();
        appViajesNew.req_ini();
    }
)();
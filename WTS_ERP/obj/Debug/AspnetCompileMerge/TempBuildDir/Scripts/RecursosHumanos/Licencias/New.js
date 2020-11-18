var appLicenciasNew = (
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
            cbosubtipo: [],
            lugar: '',
            arrlugar: ['LIMA','PROVINCIA','EXTRANJERO'],
            estados: [],
            rangofechas: [],
            rangofechasdates: [],
            configuracionlicencias: [],
            configuracionlicencias_paternidad: 0,
            configuracionlicencias_maternidad: 0,
            configuracionlicencias_maternidadespecial: 0,
            configuracionlicencias_fallecimientolima: 0,
            configuracionlicencias_fallecimientoprovincia: 0,
            configuracionlicencias_estadograve: 0
        }

        function load() {
            //funcion en archivo Util.js, para dar funcionalidad a los botones en el toolbox del ibox
            _initializeIboxTools();

            // Crea Checkbox y su funcionalidad con relacion con la fecha de inicio y fin 
            fn_crearcheckbox();

            // Datepicker
            _initializeDatepicker();

            // Init
            $('#rangecalendario .input-daterange').datepicker({
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true,
                todayHighlight: true,
                language: "es",
                //daysOfWeekDisabled: [0, 6],
                weekStart: 1
            });


            _('txtFechaInicio').onchange =
                _('txtFechaFin').onchange = function () {
                    if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaFin').value)) {
                        // Calcular dias                        
                        fn_calculardias();
                    }
                }

            // Crea modal ,funcion en archivo Util.js
            _modal('solicitud', 'auto', '', null, 'bg-success');
            $('#modal_solicitud').on('show.bs.modal', fn_crearmodalsolicitud);

            // Se obtiene parametro si tuviera
            let par = _('txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.ruta = _par(par, 'ruta');
            }

            // Cargar Archivo
            _('fileuser').addEventListener('change', fn_change_file_user);

            _('txtFechaInicio').onchange = function () {
                fn_calcular_fechafin();
            }
        }

        function fn_calculardias() {
            let txtFechaInicio = _('txtFechaInicio').value;
            let txtFechaFin = _('txtFechaFin').value;

            if (txtFechaInicio !== "" && txtFechaFin !== "") {
                let date1 = new Date(txtFechaInicio.split("/")[2], txtFechaInicio.split("/")[1] - 1, txtFechaInicio.split("/")[0]);
                let date2 = new Date(txtFechaFin.split("/")[2], txtFechaFin.split("/")[1] - 1, txtFechaFin.split("/")[0]);

                let Difference_In_Time = date2.getTime() - date1.getTime();
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                // Se agrega 1 ya que en calculo no se considera el ultimo dia
                let total_days = Difference_In_Days + 1;
                if (total_days < 0) {
                    swal({ title: "Advertencia", text: "La fecha final no puede ser menor a la inicial", type: "error" });
                    _('txtFechaInicio').value = '';
                    _('txtFechaFin').value = '';
                    _('txtDias').value = 0;
                } else {
                    _('txtDias').value = total_days;
                }

            } else {
                _('txtDias').value = "0";
            }
        }

        function fn_fechacalendario() {
            if (ovariables.ruta === 'calendario') {
                let par = _('txtpar').value;
                _('txtFechaInicio').value = _par(par, 'fechainicio');
                _('txtFechaFin').value = _par(par, 'fechafin');
                fn_calculardias();
            }
        }

        function fn_calcular_fechafin() {
            let currentDate = _strToDate(_('txtFechaInicio').value + ' 0:00');
            if (_("cboTipo").value === "9") {
                currentDate = moment(currentDate).add((parseInt(ovariables.configuracionlicencias_estadograve, 10) - 1), 'days').toDate();
                //currentDate.setDate(currentDate.getDate() + 6);
                _('txtFechaFin').value = _getDate103(currentDate);
                //if ($(".i-check").eq(0).prop("checked")) {
                //    currentDate.setDate(currentDate.getDate() + 3);
                //    _('txtFechaFin').value = _getDate103(currentDate);
                //} else if ($(".i-check").eq(1).prop("checked")) {
                //    currentDate.setDate(currentDate.getDate() + 4);
                //    _('txtFechaFin').value = _getDate103(currentDate);
                //}

                let ff = $(".input-daterange").find('#txtFechaFin');
                ff.datepicker('setDate', currentDate);
            } else if (_("cboTipo").value === "8") {
                if ($(".i-check").eq(0).prop("checked")) {
                    currentDate = moment(currentDate).add((parseInt(ovariables.configuracionlicencias_fallecimientolima, 10) - 1), 'days').toDate();
                    //currentDate.setDate(currentDate.getDate() + 3);
                    _('txtFechaFin').value = _getDate103(currentDate);

                    let ff = $(".input-daterange").find('#txtFechaFin');
                    ff.datepicker('setDate', currentDate);

                } else if ($(".i-check").eq(1).prop("checked")) {
                    currentDate = moment(currentDate).add((parseInt(ovariables.configuracionlicencias_fallecimientoprovincia, 10) - 1), 'days').toDate();
                    //currentDate.setDate(currentDate.getDate() + 4);
                    _('txtFechaFin').value = _getDate103(currentDate);

                    let ff = $(".input-daterange").find('#txtFechaFin');
                    ff.datepicker('setDate', currentDate);
                }
            }

            fn_calculardias();
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };
            _Get('RecursosHumanos/Licencias/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstsolicitud = rpta[0].solicitud !== '' ? JSON.parse(rpta[0].solicitud) : [];
                        ovariables.lsthistorial = rpta[0].historial !== '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables.lstbotones = rpta[0].botones !== '' ? JSON.parse(rpta[0].botones) : [];
                        ovariables.lstarchivo = rpta[0].archivo !== '' ? JSON.parse(rpta[0].archivo) : [];
                        ovariables.cbotipo = rpta[0].tipo !== '' ? JSON.parse(rpta[0].tipo) : [];
                        ovariables.cbosubtipo = rpta[0].tipo !== '' ? JSON.parse(rpta[0].subtipo) : [];
                        ovariables.configuracionlicencias = rpta[0].configuracionlicencias !== '' ? JSON.parse(rpta[0].configuracionlicencias) : [];
                        ovariables.lugar = ovariables.lstsolicitud[0].lugar !== '' ? ovariables.lstsolicitud[0].lugar : '';


                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        //cargar configuracion de licencias
                        ovariables.configuracionlicencias_paternidad = ovariables.configuracionlicencias.paternidad;
                        ovariables.configuracionlicencias_maternidad = ovariables.configuracionlicencias.maternidad;
                        ovariables.configuracionlicencias_maternidadespecial = ovariables.configuracionlicencias.maternidad_especial;
                        ovariables.configuracionlicencias_fallecimientolima = ovariables.configuracionlicencias.fallecimiento_lima;
                        ovariables.configuracionlicencias_fallecimientoprovincia = ovariables.configuracionlicencias.fallecimiento_provincia;
                        ovariables.configuracionlicencias_estadograve = ovariables.configuracionlicencias.estadograve;

                        // Llenamos combo
                        let cboSubTipo = '';
                        ovariables.cbosubtipo.forEach(x => {
                            cboSubTipo += `<option value ='${x.idsubtipo}'>${x.nombre}</option>`;
                        });
                        _('cboSubTipo').innerHTML = cboSubTipo;

                        // Llenamos combo
                        let cboTipo = '';
                        ovariables.cbotipo.forEach(x => {
                            cboTipo += `<option value ='${x.idtipo}'>${x.nombre}</option>`;
                        });
                        _('cboTipo').innerHTML = cboTipo;
                        _('cboTipo').addEventListener("change", function (e) {
                            if (_("cboTipo").value === "8") {
                                _("divSubTipo").classList.remove("hide");
                                _("divLugar").classList.remove("hide");
                                _('txtFechaFin').style = "background-color: #eee!important";
                                _('txtFechaFin').disabled = true;

                                $(".i-check").prop("checked", false).iCheck("update");
                                $(".i-check[data-id='0']").prop("checked", true).iCheck("update");
                                if (_('txtFechaInicio').value !== "") {
                                    fn_calcular_fechafin();
                                }
                            } else if (_("cboTipo").value === "9") {
                                _("divSubTipo").classList.add("hide");
                                _("divLugar").classList.add("hide");
                                _('txtFechaFin').style = "background-color: #eee!important";
                                _('txtFechaFin').disabled = true;
                                _("hdnLugar").value = '';
                            } else {
                                _("divSubTipo").classList.add("hide");
                                _("divLugar").classList.add("hide");
                                _('txtFechaFin').style = "";
                                _('txtFechaFin').disabled = false;
                                _("hdnLugar").value = '';
                            }

                            if (_('txtFechaInicio').value !== "") {
                                fn_calcular_fechafin();
                            }
                        });

                        // Creamos botones
                        let botones = (_json) => {
                            let html = '';
                            if (_json.length > 0) {
                                _json.forEach(x => {
                                    html += `<button type="button" class="${x.Clase}" onclick="appLicenciasNew.${x.Funcion}()" title="${x.Titulo}" style="margin-right: 5px;">
                                                <span class="${x.Icono}"> </span>
                                                ${x.Titulo}
                                            </button>`
                                });
                            }
                            return html;
                        }
                        _('div_botones').innerHTML = botones(ovariables.lstbotones);

                        // Para que de opcion multiple
                        let cboPersonal = '';
                        ovariables.lstsolicitud.forEach(x => {
                            cboPersonal += `<option value ='${x.idpersonal}'>${x.nombrepersonal}</option>`
                        });
                        _('cboNombre').innerHTML = cboPersonal;
                        _('cboNombre').addEventListener('change', fn_change_personal);

                        if (ovariables.accion !== "edit") {
                            // Llenamos valores
                            fn_change_personal();

                            _('txtFechaSolicitud').value = _getDate103();
                            _('txtComentario').value = "";
                            _("txtDias").value = "0";
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
                            _('cboTipo').value = ovariables.lstsolicitud.idtipo;
                            if (ovariables.lstsolicitud.idsubtipo !== "" && ovariables.lstsolicitud.idtipo === 8) {
                                _("divSubTipo").classList.remove("hide");
                                _("cboSubTipo").value = ovariables.lstsolicitud.idsubtipo;
                            }
                            _('txtFechaInicio').value = ovariables.lstsolicitud.fechainicio;
                            _('txtFechaFin').value = ovariables.lstsolicitud.fechafin;

                            let diaini = ovariables.lstsolicitud.fechainicio.split('/')[0];
                            let mesini = ovariables.lstsolicitud.fechainicio.split('/')[1];
                            let anoini = ovariables.lstsolicitud.fechainicio.split('/')[2];

                            let diafin = ovariables.lstsolicitud.fechafin.split('/')[0];
                            let mesfin = ovariables.lstsolicitud.fechafin.split('/')[1];
                            let anofin = ovariables.lstsolicitud.fechafin.split('/')[2];

                            $("#txtFechaInicio").datepicker("setDate", new Date(anoini, mesini - 1, diaini));
                            $("#txtFechaFin").datepicker("setDate", new Date(anofin, mesfin - 1, diafin));

                            let cont_domsab = cuentaFindes(new Date(anoini, mesini - 1, diaini), new Date(anofin, mesfin - 1, diafin));
                            _("txtDias").value = ((new Date(anofin, mesfin - 1, diafin) - new Date(anoini, mesini - 1, diaini)) / (1000 * 3600 * 24)) + 1;

                            //_('txtHoraInicio').value = ovariables.lstsolicitud.horainicio;
                            //_('txtHoraFin').value = ovariables.lstsolicitud.horafin;
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
                                    _('txtCargo').disabled = true;
                                    _('txtJefe').disabled = true;
                                    _('txtArea').disabled = true;
                                    _('txtSubArea').disabled = true;
                                    _('txtEquipo').disabled = true;
                                    _('txtDias').disabled = true;
                                    $("#tab-registro .input-group-addon").removeAttr("style");
                                                                      
                                   
                                    // Activar checkbox
                                    _('divLugar').classList.remove('hide');
                                    $(".i-check").prop("checked", false).iCheck("update");
                                    if (ovariables.lugar === 'LIMA' && _("cboTipo").value === "8") {
                                        _('txtFechaFin').disabled = true;
                                        $('#txtFechaFin').removeAttr("readonly");
                                        _("hdnLugar").value = "0";
                                        $('.i-check[data-id="0"]').prop("checked", true).iCheck('update');
                                    } else if (ovariables.lugar === 'PROVINCIA' && _("cboTipo").value === "8") {
                                        _('txtFechaFin').disabled = true;
                                        $('#txtFechaFin').removeAttr("readonly");
                                        _("hdnLugar").value = "1";
                                        $('.i-check[data-id="1"]').prop("checked", true).iCheck('update');
                                    } else {
                                        _("hdnLugar").value = "";
                                        _('divLugar').classList.add('hide');                                        
                                        _('txtFechaFin').disabled = false;
                                        $('#txtFechaFin').removeAttr("readonly");
                                    }
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

                            //$("#txtFechaInicio").removeClass("border-left-right border-top border-bottom");
                            //_('txtFechaInicio').style = "background-color:#eee!important;border-top: 0px; border-bottom:0px; border-left:0px; border-right:0px";
                            //_('txtFechaInicio').border = 1;
                            //$("#txtFechaFin").removeClass("border-left-right border-top border-bottom");
                            //_('txtFechaFin').style = "background-color:#eee!important;border-top: 0px; border-bottom:0px; border-left:0px; border-right:0px";
                            //_('txtFechaFin').border = 1;                           
                        }

                        // Si solicitud viene de calendario
                        fn_fechacalendario();
                    }
                }, (p) => { err(p); });
        }

        function fn_change_personal() {
            let idpersonal = _parseInt(_('cboNombre').value);
            let json = ovariables.lstsolicitud.filter(x => x.idpersonal === idpersonal)[0];
            _('txtCargo').value = json.nombrecargo;
            _('txtJefe').value = json.nombrejefe;
            _('txtArea').value = json.nombrearea;
            _('txtSubArea').value = json.nombresubarea;
            _('txtEquipo').value = json.nombreequipo;

            // Tabla Aprobador
            _('detalleTablaAprobador').children[1].children[0].children[0].innerHTML = `<button class="btn btn-outline btn-warning">
                                                                                            <span class="fa fa-check"></span>
                                                                                        </button>`;
            _('detalleTablaAprobador').children[1].children[0].children[1].textContent = json.nombrejefe;
            _('detalleTablaAprobador').children[1].children[0].children[2].textContent = json.correojefe;
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
                                        <button type="button" class="btn btn-info" onclick="appLicenciasNew.${ovariables.modal_callback}()">
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

        function fn_crearcheckbox() {
            $('.i-check').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                if (_("txtFechaInicio").value !== "") {
                    fn_calcular_fechafin();
                }
                if (_("cboTipo").value === "8") {
                    _("hdnLugar").value = $(this).attr("data-id");
                } else {
                    _("hdnLugar").value = '';
                }
            });
        }

        function fn_return() {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (ovariables.ruta === 'calendario') {
                let urlAccion = 'RecursosHumanos/Calendario/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'RecursosHumanos/Licencias/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_validartipos() {

            let txtFechaInicio = _('txtFechaInicio').value;
            let txtFechaFin = _('txtFechaFin').value;

            if (txtFechaInicio !== "" && txtFechaFin !== "") {
                let date1 = new Date(txtFechaInicio.split("/")[2], txtFechaInicio.split("/")[1] - 1, txtFechaInicio.split("/")[0]);
                let date2 = new Date(txtFechaFin.split("/")[2], txtFechaFin.split("/")[1] - 1, txtFechaFin.split("/")[0]);
                let Difference_In_Time = date2.getTime() - date1.getTime();
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                // Se agrega 1 ya que en calculo no se considera el ultimo dia
                let total_days = Difference_In_Days + 1;

                if (_("cboTipo").value === "6") {
                    if (total_days !== ovariables.configuracionlicencias_paternidad) {
                        swal({
                            html: true,
                            title: "Información",
                            text: "La Licencia establecida para Paternidad son " + ovariables.configuracionlicencias_paternidad + " día/s.",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        }, function () {
                            fn_save();
                        });
                    }
                    else {
                        fn_save();
                    }
                } else if (_("cboTipo").value === "7") {
                    if (total_days !== ovariables.configuracionlicencias_maternidad) {
                        swal({
                            title: "Información",
                            text: "La Licencia establecida para Maternidad son " + ovariables.configuracionlicencias_maternidad + " día/s, en caso de parto múltiple o niño con discapacidad se considera " + ovariables.configuracionlicencias_maternidadespecial + " días adicionales.",
                            type: "info",
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        }, function () {
                            fn_save();
                        });
                    } else {
                        fn_save();
                    }
                } else {
                    fn_save();
                }
            }
            else {
                if (_("txtFechaInicio").value === "" || _("txtFechaFin").value === "") {
                    $(".rangecalendario").addClass("has-error");
                    swal({
                        title: "Datos Requeridos",
                        text: "Favor de ingresar los datos marcados en rojo.",
                        type: "warning",
                    },
                        function () {
                            return false;
                        });
                    //return false;
                } else {
                    $(".input-daterange").removeClass("has-error");
                }
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

            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_LicenciasNew' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Solicitud",
                    text: "¿Estas seguro/a que deseas guardar la Solicitud de Licencia?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let tablaaprobador = [];
                    tablaaprobador = fn_get_aprobador('detalleTablaAprobador');
                    let arrAprobador = JSON.stringify(tablaaprobador);
                    arrfileUser = JSON.stringify(fn_getfileuser('tblfileuser'));
                    tabla = _('tblfileuser').tBodies[0];
                    let totalarchivos = tabla.rows.length, arrFile = [];

                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_LicenciasNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idpersonal: _('cboNombre').value,
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            comentario: json.comentario,
                            codigoestado: ovariables.estados.APROBADO,
                            idtipo: json.idtipo,
                            idsubtipo: (json.idtipo === '8') ? json.idsubtipo : '',
                            lugar: ovariables.arrlugar[_("hdnLugar").value],
                            accion: ovariables.accion
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

                    _Post('RecursosHumanos/Licencias/InsertData_Licencia', frm)
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

        function fn_update() {
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_LicenciasNew' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Actualizar Solicitud",
                    text: "¿Estas seguro/a que deseas actualizar la Solicitud de Licencia?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_LicenciasNew' });
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idpersonal: _('cboNombre').value,
                            fechainicio: json.fechainicio,
                            fechafin: json.fechafin,
                            comentario: json.comentario,
                            codigoestado: ovariables.estados.APROBADO,
                            idtipo: json.idtipo,
                            idsubtipo: (json.idtipo === '8') ? json.idsubtipo : '',
                            accion: ovariables.accion,
                            idsolicitud: ovariables.id,
                            lugar: ovariables.arrlugar[_("hdnLugar").value]
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Licencias/InsertData_Licencia', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Solicitud Actualizada!", text: "Haz enviado tu licencia correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
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
                text: "¿Estas seguro/a que deseas Cancelar tu Licencia?",
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
                        comentario: _('txtComentarioModal').value,
                        codigoestado: ovariables.estados.CANCELADO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Licencias/UpdateData_Licencia', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_solicitud').modal('hide');
                            swal({ title: "¡Solicitud Cancelada!", text: "Se cancelo tu licencia correctamente", type: "success", timer: 1000, showCancelButton: false, showConfirmButton: false });
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
                    <td class ='text-center' style="vertical-align:middle">
                        <div class ='btn-group'>
                            <button class ='btn btn-outline btn-warning btn-sm _download'>
                                <span class ='fa fa-download'></span>
                            </button>
                        </div>
                    </td>
                    <td style="vertical-align:middle">${x.nombrearchivooriginal}</td>
                    <td class ='text-center' style="vertical-align:middle"></td>
                    <td class ='hide' style="vertical-align:middle"></td>
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
                        <td class='text-center' style="vertical-align:middle">
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _deletefile'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td style="vertical-align:middle">${nombre}</td>
                        <td class ='text-center' style="vertical-align:middle">
                            <div class='btn-group'>
                                <button type='button' class ='btn btn-link _download hide'>Download</button>
                            </div>
                        </td>
                        <td class='hide' style="vertical-align:middle"></td>
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

            let urlaccion = '../RecursosHumanos/Licencias/Download_Licencia?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

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
            fn_validartipos: fn_validartipos,
            fn_update: fn_update,
            fn_cancelar: fn_cancelar,
            fn_cancelar_grabar: fn_cancelar_grabar
        }
    }
)(document, 'panelEncabezado_LicenciasNew');
(
    function ini() {
        appLicenciasNew.load();
        appLicenciasNew.req_ini();
    }
)();
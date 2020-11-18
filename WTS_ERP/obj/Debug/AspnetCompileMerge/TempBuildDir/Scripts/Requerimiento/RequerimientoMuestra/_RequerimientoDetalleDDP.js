//import { json } from "d3-request";

//// :sa
var app_RequerimientoDetalleDDP = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            odelimitador: {
                col: '¬',
                row: '^'
            },
            formatoEspanol:'DD/MM/YYYY',
            Requerimiento: {},
            ListaEsReorden: [],
            ListaRequerimiento: [],
            ListaActividadesDespachoByEstilo: [],
            ListaArchivos: [],
            ListaTipoArchivo: [],
            ListaActividadAll: [],
            ListaRequerimientoComentarios: [],
            CrearComboTipo: '',
            CrearComboActividades: '',
            ListaEstadosActividad: [],
            ListaEstadosMuestra: [],
            IdRequerimientoSeleccionadoDblClickMuestra: 0,
            actualizararchivo: 0,
            rutaFileServer: '',
            objTmpedit: {}
        }

        const _crearComboTipo_tabDetalle = (_obj) => {
            
            const combotipo = ovariables.ListaTipoArchivo.map((x) => { return `<option value='${x.IdTipoArchivo}'>${x.NombreTipoArchivo}</option>` }).join('');
            return `<select id='cbotipoadj_${_obj.IdEstilo}' class='form-control no-borders no-margins no-paddings'><option value='0'>seleccione</option>${combotipo}</select>`;
        }
        const _crearComboActividades_tabDetalle = (_obj) => {
            
            const comboactividad = ovariables.ListaActividadAll.map((x) => { return `<option value='${x.IdActividad}'>${x.NombreActividad}</option>` }).join('');
            return `<select id='cboactividad_${_obj.IdEstilo}' class='form-control no-borders no-margins no-paddings _enty_required'  data-required='true' data-min='1' data-max='100'><option value=''>seleccione</option>${comboactividad}</select>`;
        }
        const Set_OptionsEsReorden = () => {            
            let optionsEsReorden =  ovariables.ListaEsReorden.map(x => `<option value ='${x.IdCatalogo}'>${x.EsReordenSiNo}</option>`).join('');
            return optionsEsReorden;            
        }

        const CargarActividadesEditMuestra = (idactividad) => {
            let objdetalle = ovariables.ListaActividadAll;
            let options_actividad_muestra = "";
            options_actividad_muestra = objdetalle.map((obj) => {
                let nombreactividad = obj.actividad;
                return `<option value='${obj.IdActividad}' ${(obj.IdActividad === idactividad) ? 'selected' : ''}>${NombreActividad}</option>`
            }).join('');
            return options_actividad_muestra;
        }

        const load = () => {
            moment.locale('es');

            $('.iboxlistamuestras,.iboxlistaprogramacion,.iboxlistaarchivos').children('.ibox-content').prepend(`<div class="sk-spinner sk-spinner-double-bounce">
                                                            <div class="sk-double-bounce1"></div>
                                                            <div class="sk-double-bounce2"></div>
                                                        </div>`);

            // Select2
            $("#cboCorreos").select2({
                width: '100%'
            });

            $(".summernote").summernote({
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['table', ['table']]
                    // ['insert', ['link', 'picture', 'hr']],
                    //['view', ['fullscreen', 'codeview']],
                    //['help', ['help']]
                ]
            });

            // Functions
            fn_scroll();

            $("#inputImageDetalle").change(function () {
                readURL(this);
            });
            //_('inputImageDetalle').addEventListener('change', fn_change_file_user);
            ////_('inputFileSampleDetails').addEventListener('change', fn_uploadfile);
            _('inputFileSampleDetails').addEventListener('change', fn_uploadfile);

            _("tabGeneral").addEventListener('click', function () {                
                _("divBotones").innerHTML = `<button type="button" class="btn btn-primary" id="btnGuardarReq" onclick='app_RequerimientoDetalleDDP.SaveDetalleRequerimientoDespacho_JSON();'>
                    <span class="fa fa-save"></span>
                    Guardar
                </button>`;
            });
            _("tabCalificaciones").addEventListener('click', function () {                
                _("divBotones").innerHTML = `<button type="button" class="btn btn-primary" id="btnGuardarReqCal" onclick='app_RequerimientoDetalleDDP.SaveDetalleRequerimientoDespacho_JSON();'>
                    <span class="fa fa-save"></span>
                    Guardar
                </button>`;
            });
            _("tabDetalle").addEventListener('click', function () {
                _("divBotones").innerHTML = '';
            });
            _("tabCorreos").addEventListener('click', function () {
                _("divBotones").innerHTML = '';
            });
            _("tabSeguimiento").addEventListener('click', function () {
                _("divBotones").innerHTML = '';
            });
            _("tabComentarios").addEventListener('click', function () {
                _("divBotones").innerHTML = '';
            });

            _("btnGuardarReq").addEventListener('click', SaveDetalleRequerimientoDespacho_JSON);
            _("btnCargarComentario").addEventListener("click", _agregar_comentario_tabComentario);
            const parDetalle = _('sampledetails_txtpar').value;
            ovariables.id = _par(parDetalle, 'id');

            _('btnActualizarDespacho').addEventListener("click", actualizarDespacho);
            _('btnActualizarDespachoHide').addEventListener("click", actualizarDespachoHide);

            $("#div_grupo_fechateladisponible ._fechateladisponible").datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true                
            }).on('changeDate', function (e) {
                let fecha = e.target.value;
                $('#txtfechateladisponible').val(fecha).datepicker('update');
            }).next().on('click', function () {
                $(this).prev().focus();
            });

            // Validate file return false
            $("#inputFileSampleDetails").click(function () {
                if (parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra) === 0) {
                    swal({ title: "Advertencia", text: "Seleccione la Muestra primero para poder agregar un archivo...!", type: "warning", timer: 5000 });
                    return false;
                }
            });

            //// HANDLER PARA EL TAB DE CORREO
            $("#btnArchivosExistentes").click(function (e) {
                if (_('tabcomentario_cboMuestra').value === '') {
                    swal({ title: "Advertencia", text: "Falta seleccionar el tipo de muestra...!", type: "warning", timer: 5000 });
                    return false;
                }
            });
            _('btnArchivosExistentes').addEventListener('click', fn_modal_archivos_existentes_byestilo, false);
            $('#file_archivo_correo_ddp').click(function () {
                let idrequerimiento_seleccionado_combo = _('tabcomentario_cboMuestra').value;
                if (_('tabcomentario_cboTipo').value === '') {
                    swal({ title: "Advertencia", text: "Falta seleccionar el tipo de archivo...!", type: "warning", timer: 5000 });
                    return false;
                }
                if (idrequerimiento_seleccionado_combo === '') {
                    swal({ title: "Advertencia", text: "Seleccione la Muestra primero para poder agregar un archivo...!", type: "warning", timer: 5000 });
                    return false;
                }
            });
            _('file_archivo_correo_ddp').addEventListener('change', fn_change_new_file_correo_ddp, false);
            _('btn_enviar_correo_ddp').addEventListener('click', fn_enviar_correo_ddp, false);
        }

        function fn_enviar_correo_ddp() {
            let pasavalidacion = fn_validar_antes_enviar_correo();
            if (!pasavalidacion) {
                return false;
            }

            let correo_to = $('#cboCorreos').val().join(';');
            let correo_copia = _('txtcorreo_copia').value;
            let arr_archivos = Array.from(_('tabcorreos_tblarchivos_tbody').rows).map(x => {
                let datapar = x.getAttribute('data-par');
                let nombrearchivooriginal = _par(datapar, 'nombrearchivooriginal');
                let nombrearchivo = _par(datapar, 'nombrearchivo');
                return { nombrearchivo: nombrearchivo, nombrearchivooriginal: nombrearchivooriginal }
            });

            let cuerpo = _('div_contenido_cuerpo_correo').getElementsByClassName('note-editable')[0].innerHTML;
            cuerpo = escape(cuerpo.replace(/"/g, '~').replace(/\+/g, '¬'));

            let obj_correo = {
                correo_to: correo_to,
                correo_cc: correo_copia,
                correo_bcc: '',
                correoarchivo: arr_archivos,
                cuerpo: cuerpo,
                IdEstilo: _('lblCodWTS').value
            }
            
            let form = new FormData();
            form.append('CorreoJSON', JSON.stringify(obj_correo));

            _Post('Requerimiento/RequerimientoMuestra/SaveSendEmail_DDP_Muestras', form, true)
                .then((data) => {
                    let odata = JSON.parse(data);
                    if (odata.estado === 'success') {
                        //// LIMPIAR
                        fn_limpiar_inputs_desues_enviarcorreo();
                    }
                    _swal({ mensaje: odata.mensaje, estado: odata.estado }, 'Mensaje');
                });
        }

        function fn_limpiar_inputs_desues_enviarcorreo() {
            Array.from(_('panelEncabezado_RequerimientoDetalleDDP').getElementsByClassName('cls_limpiar_correo'))
                .forEach(x => {
                    let datatypeinput = x.getAttribute('data-type-input');
                    if (datatypeinput === 'text') {
                        x.value = '';
                    } else if (datatypeinput === 'combo') {
                        //x.value = '0';
                        x.selectedIndex = 0;
                    } else if (datatypeinput === 'combomultiple') {
                        $(x).val(null).trigger("change");
                    } else if (datatypeinput === 'table') {
                        let id = x.getAttribute('id');
                        _(id).innerHTML = '';
                    } else if (datatypeinput === 'html') {
                        let id = x.getAttribute('id');
                        _(id).getElementsByClassName('note-editable')[0].innerHTML = '';
                    }
                });
        }

        function fn_validar_antes_enviar_correo() {
            let arr_correo_to = $('#cboCorreos').val();
            arr_correo_to = arr_correo_to === null ? '' : arr_correo_to;
            let pasavalidacion = true;
            let mensaje = '';
            let validacionFormatoCorreo = false;
            if (arr_correo_to.length <= 0) {
                pasavalidacion = false;
                mensaje += '- Falta ingresar los correos Para. \n';
            }

            let arr_inputs_correos = Array.from(_('tab-correos').getElementsByClassName('cls_validarCorreo'));
            arr_inputs_correos.forEach(x => {
                //let idCampo = x.getAttribute('id');
                x.parentNode.parentNode.classList.remove('has-error');
                let valorInput = x.value;
                let datalabel = x.getAttribute('data-label');
                if (valorInput !== '') {
                    valorInput = valorInput.replace(/,/g, ';');

                    let arrayCorreos = valorInput.split(';');
                    let totalArray = arrayCorreos.length;
                    arrayCorreos.some(y => {
                        valorInput = $.trim(y);
                        validacionFormatoCorreo = _validateEmail(valorInput);  // ESTA FUNCION validateEmail ESTA EN UTIL.JS
                        if (validacionFormatoCorreo == false) {
                            pasavalidacion = false;
                            //let idspan = '_span_error' + idCampo;
                            //$('#' + idspan).removeClass('hide');
                            mensaje += `- Error de formato de correo ${datalabel} \n`;
                            x.parentNode.parentNode.classList.add('has-error');
                            return true;
                        }
                    });
                }

            });

            //// VALIDAR LOS ARCHIVOS SI FUERON MODIFICADOS
            let pasavalidacion_archivos_modificados = true;
            Array.from(_('tabcorreos_tblarchivos_tbody').rows).forEach(x => {
                let valor_cbo_idtipoarchivo = x.getElementsByClassName('_cls_cbo_tbl_tipoarchivo_correo')[0].value;
                let valor_cbo_idrequerimiento = x.getElementsByClassName('_cls_cbo_tbl_tipomuestra_correo')[0].value;
                let data_idtipoarchivo = x.getAttribute('data-idtipoarchivo');
                let data_idrequerimiento = x.getAttribute('data-idrequerimiento');
                if (valor_cbo_idtipoarchivo !== data_idtipoarchivo) {
                    pasavalidacion_archivos_modificados = false;
                    x.classList.add('has-error');
                }

                if (valor_cbo_idrequerimiento !== data_idrequerimiento) {
                    pasavalidacion_archivos_modificados = false;
                    x.classList.add('has-error');
                }
            });

            if (pasavalidacion_archivos_modificados === false) {
                pasavalidacion = false;
                mensaje += `- Antes de enviar, faltan grabar los archivos modificados. \n`;
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Advertencia');
            }

            return pasavalidacion;
        }

        function fn_change_new_file_correo_ddp(e) {
            //let archivo = this.value;
            //let ultimopunto = archivo.lastIndexOf(".");
            //let ext = archivo.substring(ultimopunto + 1);
            //ext = ext.toLowerCase();
            //let nombre = e.target.files[0].name, html = '';
            //// GRABAR EL ARCHIVO
            

            let file = e.target.files;
            if (file.length > 0) {
                //// idarchivo: 0 VA CERO PARA INSERTAR UN NUEVO ARCHIVO
                let obj_datos_basicos_para_grabar = {
                    idtipoarchivo: _('tabcomentario_cboTipo').value,
                    idarchivo: 0,
                    actualizar_archivo: 1,
                    idrequerimiento: _('tabcomentario_cboMuestra').value,
                    accion: 'new'
                }
                fn_save_archivo_from_correo_ddp(obj_datos_basicos_para_grabar);
            }
        }

        function fn_save_archivo_from_correo_ddp(obj_datos_basicos_para_grabar) {
            let err = function (__err) { console.log('err', __err) }, frm = new FormData();
            let idrequerimiento_seleccionado_combo = obj_datos_basicos_para_grabar.idrequerimiento;  //_('tabcomentario_cboMuestra').value;

            //if (_('tabcomentario_cboTipo').value === '') {
            //    //swal({ title: "Advertencia", text: "Falta seleccionar el tipo de archivo...!", type: "warning", timer: 5000 });
            //    return false;
            //}
            //if (idrequerimiento_seleccionado_combo === '') {
            //    //swal({ title: "Advertencia", text: "Seleccione la Muestra primero para poder agregar un archivo...!", type: "warning", timer: 5000 });
            //    return false;
            //}

            //let idtipomuestraxcliente = ListaRequerimiento.filter(x => parseInt(x.IdTipoMuestraxCliente) === parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra))[0].IdTipoMuestraxCliente;
            let idtipoarchivo = 0;
            idtipoarchivo = obj_datos_basicos_para_grabar.idtipoarchivo; //_('tabcomentario_cboTipo').value; ////ovariables.ListaTipoArchivo.filter(x => x.NombreTipoArchivo === 'Call Out')[0].IdTipoArchivo;

            let idestilo = _('lblCodWTS').value;
            let idarchivo = obj_datos_basicos_para_grabar.idarchivo; //0;
            let actualizar_archivo = obj_datos_basicos_para_grabar.actualizar_archivo; //1;
            //// NOTA: idarchivo = 0 = AL AGREGAR; > 0 SI YA EXISTE

            let RequerimientoArchivoJSON = {
                IdArchivo: idarchivo,
                IdRequerimiento: idrequerimiento_seleccionado_combo,
                IdTipoArchivo: idtipoarchivo,
                IdEstilo: idestilo,
                ActualizarArchivo: actualizar_archivo
            };

            frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
            frm.append('ArchivoTechPack', _("file_archivo_correo_ddp").files[0]);
            _Post('Requerimiento/RequerimientoMuestra/SaveArchivoRequerimiento_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {
                        swal({
                            title: "Buen Trabajo",
                            text: "The file was added successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });

                        //// ACTUALIZAMOS LA LISTA DE ARCHIVOS
                        ovariables.ListaArchivos = CSVtoJSON(orpta.data)
                        //// HAGO UNA COPIA DE LA LISTA DE ARCHIVOS TAL CUAL
                        let listaarchivos_copy = ovariables.ListaArchivos.slice();
                        
                        if (obj_datos_basicos_para_grabar.accion === 'new') {
                            //// TOMO EL ULTIMO DE LA LISTA
                            let obj_archivo_agregado = listaarchivos_copy.pop();
                            fn_pintar_tabla_archivo_correo_ddp_add(obj_archivo_agregado);
                        } else {
                            //// ACA CUANDO ES EDITAR
                            let obj_archivo_edit = ovariables.ListaArchivos.filter(x => parseInt(x.IdArchivo) === parseInt(idarchivo))[0];
                            fn_actualizar_fila_archivo_correo_despues_grabar_edit(obj_archivo_edit);
                            
                        }
                        
                        ////fn_loadfilessampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaArchivosCSV));
                        //_crearTableDetalle_Adjuntos(ovariables.IdRequerimientoSeleccionadoDblClickMuestra);

                        //ovariables.actualizararchivo = 0;
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error", timer: 5000 });
                    }
                }, (p) => { err(p); });
        }

        function fn_actualizar_fila_archivo_correo_despues_grabar_edit(obj_archivo) {
            if (obj_archivo) {
                Array.from(_('tabcorreos_tblarchivos_tbody').rows).some(x => {
                    let datapar = x.getAttribute('data-par');
                    let idarchivo = _par(datapar, 'idarchivo');
                    if (idarchivo === obj_archivo.IdArchivo) {
                        //// SET IDTIPO ARCHIVO
                        x.getElementsByClassName('_cls_cbo_tbl_tipoarchivo_correo')[0].value = obj_archivo.IdTipoArchivo;
                        x.setAttribute('data-idtipoarchivo', obj_archivo.IdTipoArchivo);

                        //// SET IDREQUERIMIENTO
                        x.getElementsByClassName('_cls_cbo_tbl_tipomuestra_correo')[0].value = obj_archivo.IdRequerimiento;
                        x.setAttribute('data-idrequerimiento', obj_archivo.IdRequerimiento);

                        x.classList.remove('has-error');
                        return true;
                    }
                });
            }
        }

        function fn_pintar_tabla_archivo_correo_ddp_add(obj_archivo) {
            let x = obj_archivo;
            //${ x.NombreTipoArchivo } ; ${x.NombreTipoMuestra}
            let html = `
                        <tr data-par='idarchivo:${x.IdArchivo},nombrearchivooriginal:${x.NombreArchivoOriginal},nombrearchivo:${x.NombreArchivo}' 
                            data-idtipoarchivo='${x.IdTipoArchivo}' data-idrequerimiento='${x.IdRequerimiento}'>
                            <td class='text-center'>
                                <button class="btn btn-danger btn-xs cls_btn_delete_file_correo" style="cursor:pointer!important"><i class="fa fa-trash"></i></button>
                                <button class="btn btn-success btn-xs cls_btn_save_file_correo" style="cursor:pointer!important"><i class="fa fa-save"></i></button>
                                <button class="btn btn-default btn-xs cls_btn_download_file_correo" style="cursor:pointer!important"><i class="fa fa-download"></i></button>
                            </td>
                            <td class='text-center'>
                                ${x.NombreArchivoOriginal}
                            </td>
                            <td class='text-center'>
                                ${x.Usuario_Area}
                            </td>
                            <td class='text-center'>
                                <select class='form-control _cls_cbo_tbl_tipoarchivo_correo'></select>
                            </td>
                            <td class='text-center'>
                                <select class='form-control _cls_cbo_tbl_tipomuestra_correo'></select>
                            </td>
                            <td class='text-center'>
                                ${x.FechaActualizacion}
                            </td>
                        </tr>
                    `;
            _('tabcorreos_tblarchivos_tbody').insertAdjacentHTML('beforeend', html);
            let index_fila = _('tabcorreos_tblarchivos_tbody').rows.length - 1;
            cargar_combos_tbl_correo_add(index_fila);
            fn_handler_tbl_archivocorreo();
        }

        function cargar_combos_tbl_correo_add(index_fila) {
            let fila = _('tabcorreos_tblarchivos_tbody').rows[index_fila];
            let cbo_tipoarchivo = _('tabcorreos_tblarchivos_tbody').rows[index_fila].getElementsByClassName('_cls_cbo_tbl_tipoarchivo_correo')[0];
            let cbo_tipomuestra = _('tabcorreos_tblarchivos_tbody').rows[index_fila].getElementsByClassName('_cls_cbo_tbl_tipomuestra_correo')[0];
            let idtipoarchivo = fila.getAttribute('data-idtipoarchivo');
            let idrequerimiento = fila.getAttribute('data-idrequerimiento');

            //// TIPO ARCHIVO
            cbo_tipoarchivo.innerHTML = _comboFromJSON(ovariables.ListaTipoArchivo, 'IdTipoArchivo', 'NombreTipoArchivo');
            cbo_tipoarchivo.value = idtipoarchivo;

            //// TIPOMUESTRA
            let html_combo_muestra_mas_version = ovariables.ListaRequerimiento.map(x => {
                let text_cbo = x.NombreTipoMuestra + ' / Ver. ' + x.Version;
                return `
                    <option value='${x.IdRequerimiento}'>${text_cbo}</option>
                `
            }).join('');
            cbo_tipomuestra.innerHTML = html_combo_muestra_mas_version;
            cbo_tipomuestra.value = idrequerimiento;
        }

        function fn_handler_tbl_archivocorreo() {
            Array.from(_('tabcorreos_tblarchivos_tbody').rows).forEach(x => {
                try {
                    x.getElementsByClassName('cls_btn_delete_file_correo')[0].removeEventListener('click', myFuncion);
                    x.getElementsByClassName('cls_btn_download_file_correo')[0].removeEventListener('click', myFuncion);
                    x.getElementsByClassName('cls_btn_save_file_correo')[0].removeEventListener('click', myFuncion);
                } catch (e) {

                }
                x.getElementsByClassName('cls_btn_delete_file_correo')[0].addEventListener('click', myFuncion = function (e) { fn_delete_archivo_correo(e.currentTarget); }, false);
                x.getElementsByClassName('cls_btn_download_file_correo')[0].addEventListener('click', myFuncion = function (e) { fn_download_archivo_correo(e.currentTarget); }, false);
                x.getElementsByClassName('cls_btn_save_file_correo')[0].addEventListener('click', myFuncion = function (e) { fn_save_edit_archivo_correo(e.currentTarget); }, false);
            });
            
        }

        function fn_save_edit_archivo_correo(o) {
            let fila = o.parentNode.parentNode;
            let idtipoarchivo = fila.getElementsByClassName('_cls_cbo_tbl_tipoarchivo_correo')[0].value;
            let datapar = fila.getAttribute('data-par');
            let idarchivo = _par(datapar, 'idarchivo');
            let idrequerimiento = fila.getElementsByClassName('_cls_cbo_tbl_tipomuestra_correo')[0].value;

            let obj_datos_basicos_para_grabar = {
                idtipoarchivo: idtipoarchivo,
                idarchivo: idarchivo,
                actualizar_archivo: 0,
                idrequerimiento: idrequerimiento,
                accion: 'edit'
            }

            swal({
                html: true,
                title: 'Está seguro de grabar...!',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1c84c6',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                closeOnConfirm: false
            }, function () {
                    fn_save_archivo_from_correo_ddp(obj_datos_basicos_para_grabar);    
            });

        }

        function fn_download_archivo_correo(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let nombrearchivo = _par(datapar, 'nombrearchivo');
            let nombrearchivooriginal = _par(datapar, 'nombrearchivooriginal');
            var link = document.createElement("a");
            link.href = urlBase() + `Requerimiento/RequerimientoMuestra/DownLoadFileTechkPack?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function fn_delete_archivo_correo(o) {
            //let fila = o.parentNode.parentNode;
            //fila.parentNode.removeChild(fila);

            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idarchivo = _par(datapar, 'idarchivo');

            let idestilo = _('lblCodWTS').value;
            swal({
                html: true,
                title: "Está sguro de eliminar el archivo...!",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdArchivo: idarchivo,
                        IdRequerimiento: 0,
                        IdEstilo: idestilo
                    }, frm = new FormData();
                frm.append('ArchivoJSON', JSON.stringify(parametro));
                _Post('Requerimiento/RequerimientoMuestra/DeleteArchivoRequerimientoById_JSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            ovariables.ListaArchivos = CSVtoJSON(orpta.data)
                            fila.parentNode.removeChild(fila);
                            //swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                            swal({ title: "Buen Trabajo!", text: "Actualizado con éxito", type: "success", timer: 5000 });
                        }
                        let titulomensaje = orpta.estado === 'success' ? 'Buen Trabajo!' : 'Error';
                    }, (p) => { err(p); });
            });
        }

        function fn_modal_archivos_existentes_byestilo() {
            let idrequerimiento = _('tabcomentario_cboMuestra').value;
            //let idtipomuestraxcliente = ovariables.ListaRequerimiento.filter(x => parseInt(x.IdRequerimiento) === parseInt(idrequerimiento));
            let cadena_idarchivos = fn_get_listaarchivos_tbl_ya_seleccionados();
            _modalBody_Backdrop({
                url: 'Requerimiento/RequerimientoMuestra/_SeleccionarArchivosByMuestra',
                idmodal: '_SeleccionarArchivosByMuestra',
                title: 'Buscar Archivos Existentes',
                paremeter: `idestilo:${ovariables.id},idrequerimiento:${idrequerimiento},cadena_idarchivos:${cadena_idarchivos}`,
                width: '',
                height: '',
                responsive: 'modal-lg',
                backgroundtitle: 'bg-green',
                animation: 'none',
                bloquearteclado: false
            });

            //_modalBody({
            //    url: 'Requerimiento/RequerimientoMuestra/_SeleccionarArchivosByMuestra',
            //    ventana: '_SeleccionarArchivosByMuestra',
            //    titulo: 'Seleccionar',
            //    parametro: `idestilo:${ovariables.id},idrequerimiento:${idrequerimiento},cadena_idarchivos:${cadena_idarchivos}`,
            //    ancho: '',
            //    alto: '',
            //    responsive: 'modal-lg'
            //});
        }

        function fn_get_listaarchivos_tbl_ya_seleccionados() {
            let arr_cadena_idarchivos = Array.from(_('tabcorreos_tblarchivos_tbody').rows).map(x => {
                let datapar = x.getAttribute('data-par');
                let idarchivo = _par(datapar, 'idarchivo');
                return idarchivo;
            }).join('~');

            return arr_cadena_idarchivos;
        }

        function fn_llenar_tbl_archivos_seleccionados_from_modal(lista_archivos_seleccionados) {
            if (lista_archivos_seleccionados.length > 0) {
                //${ x.NombreTipoArchivo } ; ${x.NombreTipoMuestra}
                let html = lista_archivos_seleccionados.map(x => {
                    return `
                        <tr data-par='idarchivo:${x.IdArchivo},nombrearchivooriginal:${x.NombreArchivoOriginal},nombrearchivo:${x.NombreArchivo}'
                            data-idtipoarchivo='${x.IdTipoArchivo}' data-idrequerimiento='${x.IdRequerimiento}'>
                            <td class='text-center'>
                                <button class="btn btn-danger btn-xs cls_btn_delete_file_correo" style="cursor:pointer!important"><i class="fa fa-trash"></i></button>
                                <button class="btn btn-success btn-xs cls_btn_save_file_correo" style="cursor:pointer!important"><i class="fa fa-save"></i></button>
                                <button class="btn btn-default btn-xs cls_btn_download_file_correo" style="cursor:pointer!important"><i class="fa fa-download"></i></button>
                            </td>
                            <td class='text-center'>
                                ${x.NombreArchivoOriginal}
                            </td>
                            <td class='text-center'>
                                ${x.Usuario_Area}
                            </td>
                            <td class='text-center'>
                                <select class='form-control _cls_cbo_tbl_tipoarchivo_correo'></select>
                            </td>
                            <td class='text-center'>
                                <select class='form-control _cls_cbo_tbl_tipomuestra_correo'></select>
                            </td>
                            <td class='text-center'>
                                ${x.FechaActualizacion}
                            </td>
                        </tr>
                    `
                }).join('');
                _('tabcorreos_tblarchivos_tbody').insertAdjacentHTML('beforeend', html);
                cargar_combos_tbl_correo_frommodal_varios();
                fn_handler_tbl_archivocorreo();
            }
        }

        function cargar_combos_tbl_correo_frommodal_varios() {
            Array.from(_('tabcorreos_tblarchivos_tbody').getElementsByClassName('_cls_cbo_tbl_tipoarchivo_correo'))
                .forEach(x => {
                    let fila = x.parentNode.parentNode;
                    if (x.options.length <= 0) {
                        let idtipoarchivo = fila.getAttribute('data-idtipoarchivo');
                        x.innerHTML = _comboFromJSON(ovariables.ListaTipoArchivo, 'IdTipoArchivo', 'NombreTipoArchivo');
                        x.value = idtipoarchivo;
                    }
                });

            Array.from(_('tabcorreos_tblarchivos_tbody').getElementsByClassName('_cls_cbo_tbl_tipomuestra_correo'))
                .forEach(x => {
                    let fila = x.parentNode.parentNode;
                    if (x.options.length <= 0) {
                        let idrequerimiento = fila.getAttribute('data-idrequerimiento');

                        let html_combo_muestra_mas_version = ovariables.ListaRequerimiento.map(x => {
                            let text_cbo = x.NombreTipoMuestra + ' / Ver. ' + x.Version;
                            return `
                                <option value='${x.IdRequerimiento}'>${text_cbo}</option>`
                        }).join('');

                        x.innerHTML = html_combo_muestra_mas_version;
                        x.value = idrequerimiento;
                    }
                });
        }

        function fn_uploadfile() {
            ovariables.actualizararchivo = 1;
            const archivo = this.value;
            const ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            ext = ext.toLowerCase();
            ovariables.actualizararchivo = 1;
            let objArchivo = { IdArchivo: 0, IdTipoArchivo: 0 }
            fn_savefile(objArchivo);
        }

        function fn_savefile(objArchivo) {
            let err = function (__err) { console.log('err', __err) }, frm = new FormData();
            //const row = document.querySelectorAll(`#tbl_samples tbody tr[${ovariables.id !== 0 ? 'data-id' : 'data-guid'}="${ovariables.id !== 0 ? ovariables.id : ovariables.guid}"]`)[0];
            if (parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra) === 0) {
                swal({ title: "Advertencia", text: "Seleccione la Muestra primero para poder agregar un archivo...!", type: "warning", timer: 5000 });
                return false;
            }

            //let idtipomuestraxcliente = ListaRequerimiento.filter(x => parseInt(x.IdTipoMuestraxCliente) === parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra))[0].IdTipoMuestraxCliente;
            let idtipoarchivo = 0;
            if (objArchivo.IdArchivo === 0) {
                idtipoarchivo = ovariables.ListaTipoArchivo.filter(x => x.NombreTipoArchivo === 'Call Out')[0].IdTipoArchivo;
            } else {
                idtipoarchivo = objArchivo.IdTipoArchivo;
            }
            
            let idestilo = _('lblCodWTS').value;
            //// NOTA: idarchivo = 0 = AL AGREGAR; > 0 SI YA EXISTE

            let RequerimientoArchivoJSON = {
                IdArchivo: objArchivo.IdArchivo,
                IdRequerimiento: ovariables.IdRequerimientoSeleccionadoDblClickMuestra,
                IdTipoArchivo: idtipoarchivo,
                IdEstilo: idestilo,
                ActualizarArchivo: ovariables.actualizararchivo
            };
            
            frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
            frm.append('ArchivoTechPack', $("#inputFileSampleDetails")[0].files[0]);
            _Post('Requerimiento/RequerimientoMuestra/SaveArchivoRequerimiento_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {
                        swal({
                            title: "Buen Trabajo",
                            text: "The file was added successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });

                        //// ACTUALIZAMOS LA LISTA DE ARCHIVOS
                        ovariables.ListaArchivos = CSVtoJSON(orpta.data)
                        
                        //fn_loadfilessampledetails(CSVtoJSON(JSON.parse(orpta.data).ListaArchivosCSV));
                        _crearTableDetalle_Adjuntos(ovariables.IdRequerimientoSeleccionadoDblClickMuestra);
                        
                        ovariables.actualizararchivo = 0;
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error", timer: 5000 });
                    }
                }, (p) => {
                        err(p);
                        _swal({ mensaje: p, estado: 'Error' }, 'Error al intentar grabar el archivo');
                });
        }

        function obtenerDespacho() {
            const arr = Array.from(_('tabdetalle_tblprogramacion').tBodies[0].rows);
            const IdRequerimiento = _('tabdetalle_tblprogramacion').tHead.getAttribute('data-idrequerimiento').trim();
            const aresult = arr.map(x => {
                const EsCopia = x.getAttribute('data-escopia').trim();
                const [IdDespachoDetalle, IdRequerimientoDetalle] = x.getAttribute('data-par').split('¬');
                const fechaDespacho = x.querySelector('._fechadespacho').value.trim();

                const Cantidad = x.querySelector('._cmdespacho').value.trim();
                const CantidadCM = x.querySelector('._ccmdespacho').value.trim();

                const Cantidad_Saldo = x.querySelector('.cls_td_q_saldo').innerText.trim(); //q Requerida
                const CantidadCM_Saldo = x.querySelector('.cls_td_qcm_saldo').innerText.trim(); //q Requerida CM
                const EsInputHabilitado = !x.querySelector('._cmdespacho').disabled;

                return ({
                    IdRequerimiento: IdRequerimiento,
                    IdDespachoDetalle: parseInt(IdDespachoDetalle),
                    IdRequerimientoDetalle: IdRequerimientoDetalle,

                    Cantidad_Saldo: Cantidad_Saldo.length > 0 ? parseInt(Cantidad_Saldo) :0, //q Requerida
                    CantidadCM_Saldo: CantidadCM_Saldo.length > 0 ? parseInt(CantidadCM_Saldo):0, //q Requerida CM

                    Cantidad: Cantidad.length > 0 ? parseInt(Cantidad) : 0, // q Despachada
                    CantidadCM: CantidadCM.length > 0 ? parseInt(CantidadCM) : 0, // q  Despachada CM

                    ActualDate: fechaDespacho.length > 0 ? _convertDate_ANSI(fechaDespacho, ovariables.formatoEspanol) : '',
                    EsCopia: EsCopia,
                    EsInputHabilitado: EsInputHabilitado
                });

            });
            return aresult;
        }
        
        function actualizarDespachoHide() {
            const arrDespacho = obtenerDespacho();
            console.table(arrDespacho);
            const arrDespachoCondicion = obtenerDespachosCondicion(arrDespacho);
            console.table(arrDespachoCondicion);

        }
        
        function actualizarDespacho() {
            let pasavalidacion = fn_validar_antesactualizardespacho();
            if (!pasavalidacion) {
                return false;
            }

            const arrDespacho = obtenerDespacho();
            const arrDespachoCondicion = obtenerDespachosCondicion(arrDespacho);
            const frm = new FormData();
            frm.append('DespachoDetalleJSON', JSON.stringify(arrDespachoCondicion));

            _Post('Requerimiento/RequerimientoMuestra/SaveDespachoDetalle_BotonActualizar_JSON', frm)
                .then((rpta) => {                    
                    const oRespuesta = oJSON(rpta);                    
                    const aData = CSVtoJSON(oRespuesta.data);
                    const tableHTML = cargarProgramacion(aData);                     
                    _('tabdetalle_tblprogramacion').tBodies[0].innerHTML = tableHTML;
                    return { estado: oRespuesta.estado, mensaje: oRespuesta.mensaje };
                })
                .then((oRespuesta) => {
                    const aBotonesDrop = Array.from(_('tabdetalle_tblprogramacion').getElementsByClassName('_dropcopia'));
                    setArrayEvent(aBotonesDrop, 'click', eliminarItemProgramacion);
                                        
                    $("#tabdetalle_tblprogramacion ._fechadespacho").datepicker({
                        autoclose: true,
                        clearBtn: true,
                        todayHighlight: true
                    }).on('changeDate', function (e) { }).next().on('click', function () {
                        $(this).prev().focus();
                    });

                    return oRespuesta;
                })
                .then((oRespuesta) => {
                    //_swal({ estado: oRespuesta.estado, mensaje: oRespuesta.mensaje }, 'Buen Trabajo');
                    swal({ title: "Buen Trabajo!", text: "Actualizado con éxito", type: "success", timer: 5000 });
                })
        }

        function fn_validar_antesactualizardespacho() {
            let tbody_despachodetalle = _('tblprogramacion_tbody');
            let arrfilas = Array.from(tbody_despachodetalle.rows);
            let pasavalidacion = true;
            let mensaje = '';
            let totalfilas = arrfilas.length;

            if (parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra) <= 0) {
                pasavalidacion = false;
                mensaje += '- Seleccione la muestra antes de actualizar el despacho. \n'
            }

            arrfilas.forEach((x, indice) => {
                //// SI EXISTE AL MENOS UN INPUT ENTONCES EXISTE FILAS
                if (x.querySelector('._cmdespacho') !== null) {
                    let q = x.querySelector('._cmdespacho').value;
                    let qcm = x.querySelector('._ccmdespacho').value;
                    let qsaldo = x.querySelector('.cls_td_q_saldo').innerText.trim();
                    let qcmsaldo = x.querySelector('.cls_td_qcm_saldo').innerText.trim();
                    q = q === '' ? 0 : q;
                    qcm = qcm === '' ? 0 : qcm;
                    //// VALIDACION NEGATIVOS
                    if (parseInt(q) < 0 || parseInt(qcm) < 0) {
                        mensaje += '- En la fila #' + (indice + 1) + ' no se puede ingresar cantidades negativas. \n';
                        pasavalidacion = false;
                    }
                    //// VALIDACION POSITIVOS
                    if (parseInt(q) > 0 || parseInt(qcm) > 0) {
                        if (parseInt(q) > parseInt(qsaldo)) {
                            mensaje += '- En la fila #' + (indice + 1) + ' la cantidad es mayor al saldo. \n';
                            pasavalidacion = false;
                        }

                        if (parseInt(qcm) > parseInt(qcmsaldo)) {
                            mensaje += '- En la fila #' + (indice + 1) + ' la cantidad Contramuestra es mayor al saldo. \n';
                            pasavalidacion = false;
                        }

                        if (x.querySelector('._fechadespacho').value === '') {
                            pasavalidacion = false;
                            if ((indice + 1) === totalfilas) {
                                mensaje += '- En la fila #' + (indice + 1) + ' falta ingresar la fecha de despacho';
                            } else {
                                mensaje += '- En la fila #' + (indice + 1) + ' falta ingresar la fecha de despacho \n';
                            }
                        }
                    }
                }
            });

            if (!pasavalidacion) {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Advertencia');
            }

            return pasavalidacion;
        }

        function oJSON(respuesta) {
            if (!_isEmpty(respuesta)) {
                if (JSON.parse(respuesta)){
                    return JSON.parse(respuesta);
                } else {
                    console.warn('respuesta error convert JSON =>' + respuesta)
                    return null;
                }
            } else {
                return null;
                console.warn('empty Respuesta');
            }
        }
                        
        
        function obtenerDespachosCondicion(arr) {
            const arrCopia = [];

            arr.forEach(x => {
                arrCopia.push(x);
                const Copiar = x.EsInputHabilitado && (x.Cantidad > 0 || x.CantidadCM > 0);
                if (Copiar) {
                    
                    arrCopia.forEach(y => {
                        if (y.IdDespachoDetalle === x.IdDespachoDetalle) {
                            if (parseInt(x.Cantidad_Saldo - x.Cantidad) === 0 && parseInt(x.CantidadCM_Saldo - x.CantidadCM) === 0) {
                                y.EsCopiaUltima = 'si';
                                y.EsCopia = 'si';
                            } else {
                                y.EsCopiaUltima = '';
                            }
                            
                        }
                    });

                    if (parseInt(x.Cantidad_Saldo - x.Cantidad) !== 0 || parseInt(x.CantidadCM_Saldo - x.CantidadCM) !== 0) {
                        const NewCopia = { ...x };
                        NewCopia.IdDespachoDetalle = 0;
                        NewCopia.Cantidad_Saldo = (x.Cantidad_Saldo - x.Cantidad);
                        NewCopia.CantidadCM_Saldo = (x.CantidadCM_Saldo - x.CantidadCM);
                        NewCopia.Cantidad = 0;
                        NewCopia.CantidadCM = 0;
                        NewCopia.EsCopia = 'si';
                        NewCopia.EsCopiaUltima = 'si';
                        NewCopia.ActualDate = '';

                        arrCopia.push(NewCopia);
                    }
                }
            })
            return arrCopia;
        }


        const fn_scroll = () => {
            $('.chat-discussion').slimScroll({
                height: '300px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#chat-discussion-comentario').slimScroll({
                height: '200px',
                width: '100%',
                railOpacity: 0.9
            });
            $('.feed-activity-list').slimScroll({
                height: '300px',
                width: '100%',
                railOpacity: 0.2
            });
            $('#scroll_ddp').slimScroll({
                height: '405px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        const req_ini = () => {
            ovariables.rutaFileServer = _('rutaFileServerEstilo').value;
            CargarDatosModal(ovariables.id);
        }

        function c(err) { console.log(err); }

        const CargarDatosModal = (id) => {
            $('#panelEncabezado_RequerimientoDetalleDDP').children('.ibox-content').toggleClass('sk-loading');
            
            _Get('Requerimiento/RequerimientoMuestra/GetLoadDetalleRequerimientoDespachoDDP_JSON?IdEstilo=' + id)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? JSON.parse(resultado) : {};
                    if (rpta !== null) {

                        ovariables.Requerimiento = rpta !== '' ? rpta : {};
                        if (ovariables.Requerimiento.IdEstilo !== undefined) {
                            ovariables.ListaEsReorden = CSVtoJSON(rpta.Reorden.ListaEsReordenCSV);
                            ovariables.ListaRequerimiento = CSVtoJSON(rpta.RequerimientoMuestra.ListaRequerimientoCSV);
                            ovariables.ListaActividadesDespachoByEstilo = CSVtoJSON(rpta.RequerimientoMuestra.ListaActividadesDespachoByEstiloCSV);
                            ovariables.ListaArchivos = CSVtoJSON(rpta.RequerimientoMuestra.ListaArchivosCSV);
                            ovariables.ListaTipoArchivo = CSVtoJSON(rpta.RequerimientoMuestra.ListaTipoArchivoCSV);
                            ovariables.ListaActividadAll = CSVtoJSON(rpta.RequerimientoMuestra.ListaActividadAllCSV);
                            ovariables.CrearComboTipo = _crearComboTipo_tabDetalle(rpta);
                            ovariables.CrearComboActividades = _crearComboActividades_tabDetalle(rpta);
                            ovariables.ListaEstadosActividad = CSVtoJSON(rpta.RequerimientoMuestra.ListaEstadosActividadCSV);
                            ovariables.ListaEstadosMuestra = CSVtoJSON(rpta.RequerimientoMuestra.ListaEstadosMuestraCSV);

                            _cargarDetalle_tabGeneral(rpta);
                            _cargarDetalle_tabCalificacion(rpta);
                            _cargarDetalle_tabDetalle(rpta);
                            _cargarDetalle_tabComentarios(rpta);
                            fn_cargar_tab_correo_ini(rpta);
                        }
                    }
                })
                .catch(err => c(err));

            $('#panelEncabezado_RequerimientoDetalleDDP').children('.ibox-content').toggleClass('sk-loading');
        }

        function fn_cargar_tab_correo_ini(odata) {
            let listamuestras = odata.RequerimientoMuestra.ListaRequerimientoCSV !== '' ? CSVtoJSON(odata.RequerimientoMuestra.ListaRequerimientoCSV) : [];
            let listatipoarchivos = odata.RequerimientoMuestra.ListaTipoArchivoCSV !== '' ? CSVtoJSON(odata.RequerimientoMuestra.ListaTipoArchivoCSV) : [];

            _('tabcomentario_cboTipo').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listatipoarchivos, 'IdTipoArchivo', 'NombreTipoArchivo');

            let html_combo_muestra_mas_version = listamuestras.map(x => {
                let text_cbo = x.NombreTipoMuestra + ' / Ver. ' + x.Version;
                return `
                    <option value='${x.IdRequerimiento}'>${text_cbo}</option>
                `
            }).join('');
            
            if (listamuestras.length > 1) {
                _('tabcomentario_cboMuestra').innerHTML = _comboItem({ value: '', text: 'Select' }) + html_combo_muestra_mas_version; ////_comboFromJSON(listamuestras, 'IdRequerimiento', 'NombreTipoMuestra');
            } else if (listamuestras.length === 1) {
                _('tabcomentario_cboMuestra').innerHTML = html_combo_muestra_mas_version; //_comboFromJSON(listamuestras, 'IdRequerimiento', 'NombreTipoMuestra');
            }

        }

        function fn_obtener_data_estadosactividad(nombreactividad) {
            let obj = ovariables.ListaEstadosActividad.filter(x => x.NombreCatalogo.toLowerCase() === nombreactividad.toLowerCase());
            return obj;
        }

        const _cargarDetalle_tabGeneral = (_obj) => {
            if (_obj !== {}) {
                let datos_tela = _obj.RequerimientoMuestra.TelaJSON !== '' ? JSON.parse(_obj.RequerimientoMuestra.TelaJSON) : null;

                _("lblCodWTS").value = _obj.IdEstilo;
                _("lblCliente").value = _obj.NombreCliente.toUpperCase();
                _("lblEquipo").value = _obj.NombreGrupoComercial.toUpperCase();
                _("lblDivision").value = _obj.NombreDivision.toUpperCase();
                _("lblFabrica").value = _obj.NombreProveedor.toUpperCase();
                _("lblTemporada").value = _obj.NombreTemporada.toUpperCase();
                _("lblTipoFabrica").value = _obj.NombreTipoProveedor.toUpperCase();
                _("lblEstilo").value = _obj.CodigoEstilo.toUpperCase();
                _("lblEstado").value = _obj.EstadoEstilo.toUpperCase();
                _("lblEstadoReqDDP").value = _obj.EstadoActividad.toUpperCase();
                _("lblCategoria").value = datos_tela[0].CategoriaTela;  ////_obj.CategoriaTela.toUpperCase();
                _('div_nombretela').innerHTML = datos_tela[0].NombreTela;
                _('div_contenidotela').innerHTML = datos_tela[0].DescripcionPorcentajeContenidoTela;

                _("lblActividad").value = _obj.Actividad.toUpperCase();
                //_("lblFechaTelaDisponible").value = _obj.FechaTelaDisponible.toUpperCase();
                //$(".cls_grupo_fechateladisponible").datepicker("update", _obj.FechaTelaDisponible);
                $("#txtfechateladisponible").val(_obj.FechaTelaDisponible).datepicker('update');
                _("lblMuestra").value = _obj.Muestra.toUpperCase();
                _('lblVersion').value = _obj.Version;
                _('lblMarca').value = _obj.NombreMarca;

                $("#radioCal" + _obj.CalificacionFabrica).prop("checked", true);
                $("#radio" + _obj.CalificacionNivelDificultad).prop("checked", true);               

                ovariables.ListaEsReorden = CSVtoJSON(_obj.Reorden.ListaEsReordenCSV);
                _("cboReorden").innerHTML = Set_OptionsEsReorden();
                _("cboReorden").value = _obj.EsReorden;
                //// CUADO EL DOMINIO ES HTTPS PARA LAS IMAGENERS SE PONDRA HTTP POR EL FILESERVER
                _("imageDetalle").setAttribute("src", 'http:' + ovariables.rutaFileServer + _obj.ImagenNombre);
            }
        }
        const _cargarDetalle_tabDetalle = (_obj) => {
            if (_obj !== {}) {
                //_crearTableDetalle_Muestras(_obj);
                fn_pintartabla_requerimientomuestra_despuesgrabar();
                //// -1 PARA CREAR EL HANDLER PARA TODAS LAS FILAS
                handler_table_muestra_actividad_despuesgrabar(-1);
            }
        }
        const _cargarDetalle_tabComentarios = (_obj) => {
            if (_obj !== {}) {
                _crearTableComentarios_Muestra(_obj);
            }
        }
        const _cargarDetalle_tabCalificacion = (_obj) => {
            if (_obj !== {}) {
                if (_obj.CalificacionFabrica > 0) {
                    _("radioCal" + _obj.CalificacionFabrica).value = _obj.CalificacionFabrica;
                }
                if (_obj.CalificacionNivelDificultad > 0) {
                    _("radio" + _obj.CalificacionNivelDificultad).value = _obj.CalificacionNivelDificultad;
                }
            }
        }
        

        function fn_creartabla_muestra_add(control) {
            let fila_tr = control.parentNode.parentNode;
            let datapar = fila_tr.getAttribute("data-par");
            let idRequerimiento = _par(datapar, 'IdRequerimiento');
            let verion_muestra = _par(datapar, 'version');

            Array.from(_('tblmuestras_thead').getElementsByClassName('oculto')).forEach((x) => {
                x.classList.remove('hide');
            });

            let data_estado_actividad = fn_obtener_data_estadosactividad('PENDIENTE');
            let idEstadoActividad = data_estado_actividad[0].IdCatalogo;
            let nombreEstadoActividad = data_estado_actividad[0].NombreCatalogo;

            let trnuevo = `<tr class='cls_tr_actividad cls_tr_filaagregando cls_tr_oculto' data-par='IdRequerimientoxActividad:0,IdRequerimiento:${idRequerimiento}' data-idestadoactividad='${idEstadoActividad}'>
                            <td class='no-padding'></td>
                            <td class='no-padding text-center'>
                                <button class='btn btn-danger btn-xs cls_btn_eliminaractividad' style="margin-left:3px;cursor:pointer!ipmportant"  data-operation='delete' title='Eliminar registro'>
                                    <i class='fa fa-trash'></i>
                                </button>
                                <button class='btn btn-success btn-xs cls_btn_save_actividad' style="margin-left:3px;cursor:pointer!ipmportant" data-operation='edit' title='Editar registro'>
                                    <i class='fa fa-save'></i>
                                </button>
                            </td>
                            <td class='no-padding oculto'>
                                <select class='form-control cls_cbo_actividad'></select>
                                <span class='cls_spn_error_actividad has-error hide'>Seleccione la actividad</span>
                            </td>
                            <td class='text-center no-padding oculto'>
                                <div class="input-group date cls_div_fechaprogramada_actividad">
                                    <input type="text" class="form-control cls_fechaprogramada_actividad" data-type="date" data-date-format="dd/mm/yyyy" value="" style="height:auto!important; background-color: white;" data-mask="99/99/9999">
                                        <span class="input-group-addon disabled" ><i class="fa fa-calendar"></i></span>
                                </div>
                            </td>
                            <td class='text-center no-padding oculto'>
                                <div class="input-group date cls_div_fechareal_actividad">
                                    <input type="text" class="form-control cls_fechareal_actividad" data-type="date" data-date-format="dd/mm/yyyy" value="" style="height:auto!important; background-color: white;" data-mask="99/99/9999">
                                        <span class="input-group-addon disabled"><i class="fa fa-calendar"></i></span>
                                </div>
                            </td>
                            <td class='no-padding oculto cls_td_comentario_actividad' contenteditable="true">
                                <textarea class='form-control cls_txta_comentario_actividad hide' style='resize: none;' rows="2"></textarea>
                            </td>
                            <td class='text-center no-padding cls_td_estadoactividad'>${nombreEstadoActividad}</td>
                            <td class='text-center no-padding'></td>
                            <td class='text-center no-padding cls_td_version_actividad'>${verion_muestra}</td>
                           </tr>`;
            let html = '';
            let filas = ovariables.ListaRequerimiento.map((x, indice) => {
                let idtr = `${x.IdRequerimiento}_${x.IdTipoMuestraxCliente}`;
                //// COMO ACA ES AGREGAR A UNA MUESTRA ENTONCES VISUALIZAR
                let ocultar = true;
                if (x.IdRequerimiento === idRequerimiento) {
                    ocultar = false;
                }
                let actividadesxrequerimiento = subfn_getactividades_html(x.IdRequerimiento, ocultar);
                return `<tr id="trMuestra_${idtr}" class='alert alert-info cls_tr_muestra' ondblclick='app_RequerimientoDetalleDDP._cargar_programacion_y_adjuntos("${x.IdRequerimiento}");' data-par='IdRequerimiento:${x.IdRequerimiento},version:${x.Version}'>
                    <td>
                        <div class="text-center">
                            <button id='a_${idtr}' class='btn btn-default btn-xs btncircle cls_btn_veractividad' style="cursor:pointer!ipmportant" 
                                data-operation='detail' title='Mostrar las actividades de la Muestra'>
                            <i class='fa fa-angle-right'></i></button>
                        </div>
                    </td>
                    <td class='text-center' style="width: 5%">${x.NombreTipoMuestra}
                        <button id='btnNuevo_${ x.IdTipoMuestraxCliente}' class='btn btn-default btn-xs btncircle pull-right' style="margin-left:3px;cursor:pointer!ipmportant" onclick="app_RequerimientoDetalleDDP._nuevo_tabdetalle_subdetalle_muestra(this,${x.IdRequerimiento},${x.IdTipoMuestraxCliente},'a_${idtr}');" data-operation='new' title='Nuevo registro en detalle'>
                        <i class='fa fa-plus'></i></button>
                    </td>
                    <td class="hd oculto" style="width: 10%"></td>
                    <td class="hd oculto" style="width: 10%; text-align:center!important;"></td>
                    <td class="hd oculto" style="width: 10%; text-align:center!important;"></td>
                    <td class="hd oculto" style="width: 10%; text-align:center!important;"></td>
                    <td style="width: 5%; text-align:center!important;" class='cls_td_estadomuestra'>${x.NombreEstado}</td>
                    <td class='text-center' style="width: 5%; text-align:center!important;"></td>
                    <td class='text-center' style="width: 5%; text-align:center!important;">${x.Version}</td>
                </tr>
                ${actividadesxrequerimiento}
                ${ (x.IdRequerimiento === idRequerimiento) ? trnuevo : ''}
                `;
            }).join('');

            _('tblmuestras_tbody').innerHTML = '';
            _('tblmuestras_tbody').innerHTML = filas;
            let index_ultima_fila_actividad = fn_getultimafila_actividad_agregada(idRequerimiento);
            
            handler_table_muestra_actividad_despuesgrabar(index_ultima_fila_actividad);
            handler_table_muestra_actividad_add(index_ultima_fila_actividad);
        }

        function fn_getultimafila_actividad_agregada(pidrequerimiento) {
            let indexfila = -1;
            let arrfilas_actividad = fn_getarray_requerimientoactividad_by_idrequerimiento(pidrequerimiento);
            
            arrfilas_actividad.forEach(x => {
                indexfila = x.rowIndex;
            });
            
            return indexfila - 1;
        }

        function fn_getarray_requerimientoactividad_by_idrequerimiento(pidrequerimiento) {
            let arrfilas_actividad = Array.from(_('tblmuestras_tbody').getElementsByClassName('cls_tr_actividad')).filter(x => {
                let datapar = x.getAttribute('data-par');
                let idrequerimiento = _par(datapar, 'IdRequerimiento');
                return parseInt(pidrequerimiento) === parseInt(idrequerimiento)
            });

            return arrfilas_actividad;
        }

        function handler_table_muestra_actividad_add(index_ultima_fila_actividad) {
            let arrfilas = Array.from(_('tblmuestras_tbody').rows);
            let fila = arrfilas[index_ultima_fila_actividad];

            let cboactividad = fila.getElementsByClassName('cls_cbo_actividad')[0];
            let date_fechaprogramada = fila.getElementsByClassName('cls_fechaprogramada_actividad')[0];
            let date_fechareal = fila.getElementsByClassName('cls_fechareal_actividad')[0];
            let btnsave_actividad = fila.getElementsByClassName('cls_btn_save_actividad')[0];
            let btndelete_actividad = fila.getElementsByClassName('cls_btn_eliminaractividad')[0];
            let btnedit_actividad = fila.getElementsByClassName('cls_btn_edit_actividad')[0];
            //let tdcomentario_actividad = fila.getElementsByClassName('cls_td_comentario_actividad')[0];

            if (cboactividad) {
                cboactividad.innerHTML = _comboItem({ value: '', text: 'Seleccione' }) + _comboFromJSON(ovariables.ListaActividadAll, 'IdActividad', 'NombreActividad');
            }
            if (date_fechaprogramada) {                
                $(date_fechaprogramada).datepicker({
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true
                }).on('changeDate', function (e) {
                    let o = e.currentTarget;
                    fn_change_datefechaprogramada(o);
                }).next().on('click', function (e) {
                    $(this).prev().focus();                    
                });
            }
            if (date_fechareal) {                
                $(date_fechareal).datepicker({
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true
                }).on('changeDate', function (e) {
                    let o = e.currentTarget;
                    fn_change_datefechareal(o);
                }).next().on('click', function (e) {
                    $(this).prev().focus();
                });
            }
            if (btnsave_actividad) {
                btnsave_actividad.addEventListener('click', fn_save_actividadmuestra, false);
            }
            if (btndelete_actividad) {
                btndelete_actividad.addEventListener('click', function (e) { let o = e.currentTarget; fn_delete_actividadmuestra(o) }, false);
            }
            if (btnedit_actividad) {
                btnedit_actividad.addEventListener('click', function (e) { let o = e.currentTarget; fn_edit_actividadmuestra(o); }, false);
            }
        }

        function fn_edit_actividadmuestra(o) {
            let fila = o.parentNode.parentNode;
            let cboactividad = fila.getElementsByClassName('cls_cbo_actividad')[0];
            let date_fechaprogramada = fila.getElementsByClassName('cls_fechaprogramada_actividad')[0];
            let date_fechareal = fila.getElementsByClassName('cls_fechareal_actividad')[0];
            let btnsave_actividad = fila.getElementsByClassName('cls_btn_save_actividad')[0];
            let txta_comentario = fila.getElementsByClassName('cls_txta_comentario_actividad')[0];
            let btncancelaractividad = fila.getElementsByClassName('cls_btn_cancelaractividad')[0];
            let btneliminaractividad = fila.getElementsByClassName('cls_btn_eliminaractividad')[0];
            let estadoactividad = fila.getElementsByClassName('cls_td_estadoactividad')[0];
            let arrinputs_actividad = [];
            let tdcomentario = fila.getElementsByClassName('cls_td_comentario_actividad')[0];

            //// PASAR A UN ARRAY DE INPUTS
            arrinputs_actividad.push(cboactividad)
            arrinputs_actividad.push(date_fechaprogramada)
            arrinputs_actividad.push(date_fechareal)
            arrinputs_actividad.push(txta_comentario)
            arrinputs_actividad.push(tdcomentario);

            ovariables.objTmpedit.cboactividad = cboactividad.value;
            ovariables.objTmpedit.date_fechaprogramada = date_fechaprogramada.value;
            ovariables.objTmpedit.date_fechareal = date_fechareal.value;
            ovariables.objTmpedit.txta_comentario = txta_comentario.value; 
            ovariables.objTmpedit.txtTd_comentario = tdcomentario.innerHTML; 
            ovariables.objTmpedit.estado = fila.getAttribute('data-idestadoactividad');
            ovariables.objTmpedit.estadoDesc = estadoactividad.innerText; 

            //cboactividad.disabled = false;
            //date_fechaprogramada.disabled = false;
            //date_fechareal.disabled = false;
            //txta_comentario.disabled = false;
            fn_activar_desactivar_inputs_actividad_byrequerimiento(arrinputs_actividad, false);
            btnsave_actividad.classList.remove('hide');
            o.classList.add('hide');
            btncancelaractividad.classList.remove('hide');
            btneliminaractividad.classList.add('hide');
        }

        function fn_activar_desactivar_inputs_actividad_byrequerimiento(arrinputs_actividad, disabled) {
            arrinputs_actividad.forEach(x => {
                x.disabled = disabled;
                if (x.tagName === 'TD' && disabled === true) {
                    x.contentEditable = "false";
                } else {
                    x.contentEditable = "true";
                }
            });
            
        }

        function fn_delete_actividadmuestra(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idrequerimientoxactividad = _par(datapar, 'IdRequerimientoxActividad');
            let IdRequerimiento = _par(datapar, 'IdRequerimiento');
            swal({
                title: "Esta seguro de eliminar la actividad?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: true
            }, function (rpta) {
                    if (rpta) {
                        if (idrequerimientoxactividad > 0) {
                            let form = new FormData();
                            let obj = { IdRequerimientoxActividad: idrequerimientoxactividad };
                            form.append("requerimientoxActividadJSON", JSON.stringify(obj));
                            _Post('Requerimiento/RequerimientoMuestra/DeleteRequerimientoxActividadById_JSON', form, true)
                                .then((rpta) => {
                                    let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                                    if (orpta.estado === 'success') {
                                        _swal({ mensaje: 'Se eliminó correctamente', estado: 'success' }, 'Buen Trabajo');                                        
                                        _Get('Requerimiento/RequerimientoMuestra/GetRequerimientoMuestraWithActividadesByEstilo_JSON?IdEstilo=' + ovariables.Requerimiento.IdEstilo)
                                            .then((data) => {
                                                respuesta_despues_grabar_actividadrequerimiento(data);
                                                handler_table_muestra_actividad_despuesgrabar();
                                                let btnFlechaVerActividad = fn_obtenerBotonFlechaVerActividad_by_IdRequerimiento(IdRequerimiento);
                                                if (btnFlechaVerActividad) {
                                                    fn_flecha_ver_actividades(btnFlechaVerActividad);
                                                }
                                            });
                                    }
                                });
                        } else {
                            sub_fn_delete_fila_actividad(fila);
                        }
                    }
            });

            let sub_fn_delete_fila_actividad = (fila) => {
                fila.parentNode.removeChild(fila);
            }
        }



        function handler_table_muestra_actividad_despuesgrabar(indice_fila_agregada) {            
            let arrfilas = Array.from(_('tblmuestras_tbody').rows);
            arrfilas.forEach((x, indice) => {
                if (parseInt(indice) !== parseInt(indice_fila_agregada)) {
                    let datapar = x.getAttribute('data-par');
                    let idactividad = _par(datapar, 'IdActividad');
                    let cboactividad = x.getElementsByClassName('cls_cbo_actividad')[0];
                    let date_fechaprogramada = x.getElementsByClassName('cls_fechaprogramada_actividad')[0];
                    let date_fechareal = x.getElementsByClassName('cls_fechareal_actividad')[0];
                    let btnsave_actividad = x.getElementsByClassName('cls_btn_save_actividad')[0];
                    let btndelete_actividad = x.getElementsByClassName('cls_btn_eliminaractividad')[0];
                    let btnflecha_ver_actividades = x.getElementsByClassName('cls_btn_veractividad')[0];
                    let btnedit_actividad = x.getElementsByClassName('cls_btn_edit_actividad')[0];
                    let btncancelaractividad = x.getElementsByClassName('cls_btn_cancelaractividad')[0];

                    if (cboactividad) {
                        cboactividad.innerHTML = _comboItem({ value: '', text: 'Seleccione' }) + _comboFromJSON(ovariables.ListaActividadAll, 'IdActividad', 'NombreActividad');
                        cboactividad.value = idactividad;
                    }

                    if (date_fechaprogramada) {                        
                        $(date_fechaprogramada).datepicker({
                            autoclose: true,
                            clearBtn: true,
                            todayHighlight: true
                        }).on('changeDate', function (e) {
                            let o = e.currentTarget;
                            fn_change_datefechaprogramada(o);
                        }).next().on('click', function (e) {
                            $(this).prev().focus();                            
                        });
                    }
                    if (date_fechareal) {                        
                        $(date_fechareal).datepicker({
                            autoclose: true,
                            clearBtn: true,
                            todayHighlight: true
                        }).on('changeDate', function (e) {
                            let o = e.currentTarget;
                            fn_change_datefechareal(o);
                        }).next().on('click', function (e) {
                            $(this).prev().focus();
                        });
                    }
                    if (btnsave_actividad) {
                        btnsave_actividad.addEventListener('click', fn_save_actividadmuestra, false);
                    }

                    if (btndelete_actividad) {
                        btndelete_actividad.addEventListener('click', function (e) { let o = e.currentTarget; fn_delete_actividadmuestra(o) }, false);
                    }

                    if (btnflecha_ver_actividades) {
                        btnflecha_ver_actividades.addEventListener('click', function (e) { let o = e.currentTarget; fn_flecha_ver_actividades(o); }, false);
                    }
                    if (btnedit_actividad) {
                        btnedit_actividad.addEventListener('click', function (e) { let o = e.currentTarget; fn_edit_actividadmuestra(o); }, false);
                    }
                    if (btncancelaractividad) {
                        btncancelaractividad.addEventListener('click', function (e) { let o = e.currentTarget; fn_cancelar_actividadmuestra(o); }, false);
                    }
                }
            });
        }

        function fn_cancelar_actividadmuestra(o) {
            let fila = o.parentNode.parentNode;

            (fila.getElementsByClassName('cls_cbo_actividad')[0]).value = ovariables.objTmpedit.cboactividad;
            (fila.getElementsByClassName('cls_fechaprogramada_actividad')[0]).value = ovariables.objTmpedit.date_fechaprogramada;
            (fila.getElementsByClassName('cls_fechareal_actividad')[0]).value = ovariables.objTmpedit.date_fechareal;
            (fila.getElementsByClassName('cls_txta_comentario_actividad')[0]).value = ovariables.objTmpedit.txta_comentario;
            (fila.getElementsByClassName('cls_td_comentario_actividad')[0]).innerHTML = ovariables.objTmpedit.txtTd_comentario;
            fila.setAttribute('data-idestadoactividad', ovariables.objTmpedit.estado);
            (fila.getElementsByClassName('cls_td_estadoactividad')[0]).innerText = ovariables.objTmpedit.estadoDesc;

            let btneliminaractividad = fila.getElementsByClassName('cls_btn_eliminaractividad')[0];
            let btnsave_actividad = fila.getElementsByClassName('cls_btn_save_actividad')[0];
            let cboactividad = fila.getElementsByClassName('cls_cbo_actividad')[0];
            let date_fechaprogramada = fila.getElementsByClassName('cls_fechaprogramada_actividad')[0];
            let date_fechareal = fila.getElementsByClassName('cls_fechareal_actividad')[0];
            let txta_comentario = fila.getElementsByClassName('cls_txta_comentario_actividad')[0];
            let btneditar_actividad = fila.getElementsByClassName('cls_btn_edit_actividad')[0];
            let tdcomentario = fila.getElementsByClassName('cls_td_comentario_actividad')[0];
            let arrinputs_actividad = [];
            o.classList.add('hide');

            btneliminaractividad.classList.remove('hide');
            btnsave_actividad.classList.add('hide');
            btneditar_actividad.classList.remove('hide');

            arrinputs_actividad.push(cboactividad)
            arrinputs_actividad.push(date_fechaprogramada)
            arrinputs_actividad.push(date_fechareal)
            arrinputs_actividad.push(txta_comentario)
            arrinputs_actividad.push(tdcomentario);         
                      
                        
            fn_activar_desactivar_inputs_actividad_byrequerimiento(arrinputs_actividad, true);
        }

        function fn_flecha_ver_actividades(o) {
            let arr_allboton_flecha = Array.from(_('tabdetalle_tblmuestras').getElementsByClassName('cls_btn_veractividad'));

            let flecharight = o.getElementsByClassName("fa-angle-right")[0];
            let flechadown = o.getElementsByClassName("fa-angle-down")[0];
            let fila = o.parentNode.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idrequerimiento = _par(datapar, 'IdRequerimiento');
            let arrfilas_actividad = fn_getarray_requerimientoactividad_by_idrequerimiento(idrequerimiento);
            let arrcolumnas_ocultas = Array.from(_('tabdetalle_tblmuestras').getElementsByClassName('oculto'));
            let arrtodaslasfilas_actividades = Array.from(_('tabdetalle_tblmuestras').getElementsByClassName('cls_tr_actividad'));

            arr_allboton_flecha.forEach(x => {
                x.getElementsByTagName('i')[0].classList.remove('fa-angle-down');
                x.getElementsByTagName('i')[0].classList.add('fa-angle-right');
            });
            arrcolumnas_ocultas.forEach(x => {
                x.classList.add('hide');
            });
            arrtodaslasfilas_actividades.forEach(x => {
                x.classList.add('hide');
            });

            if (flecharight) {
                flecharight.classList.remove('fa-angle-right');
                flecharight.classList.add('fa-angle-down');
                arrfilas_actividad.forEach(x => {
                    x.classList.remove('hide');
                });
                arrcolumnas_ocultas.forEach(x => {
                    x.classList.remove('hide');
                });
            } else if (flechadown) {
                flechadown.classList.remove('fa-angle-down');
                flechadown.classList.add('fa-angle-right');
                arrfilas_actividad.forEach(x => {
                    x.classList.add('hide');
                });
                arrcolumnas_ocultas.forEach(x => {
                    x.classList.add('hide');
                });
                //// QUITAR LAS FILAS QUE SE ESTAN AGREGANDO
                let fila_agregando = arrfilas_actividad.filter(x => { return x.classList.value.indexOf('cls_tr_filaagregando') >= 0 });
                if (fila_agregando.length > 0) {
                    let fila = fila_agregando[0].rowIndex;
                    _('tblmuestras_tbody').deleteRow(fila_agregando[0].rowIndex - 1);
                     
                }
            }
        }

        function fn_save_actividadmuestra(e) {

            //// LO REAL
            let o = e.currentTarget;
            let fila = o.parentNode.parentNode;
            let rowIndex = fila.rowIndex;
            let datapar = fila.getAttribute('data-par');
            let IdRequerimientoxActividad = _par(datapar, 'IdRequerimientoxActividad');
            let IdRequerimiento = _par(datapar, 'IdRequerimiento');
            let obj = fn_getobj_actividad_muestra(fila);
            let urlsave = '';
            let form = new FormData();
            let nombreestadoactividad = fila.getElementsByClassName('cls_td_estadoactividad')[0].innerText.trim();
            let cboactividad = fila.getElementsByClassName('cls_cbo_actividad')[0];
            let nombreactividad = cboactividad.options[cboactividad.selectedIndex].text;

            let arr_requerimiento_por_id = ovariables.ListaRequerimiento.filter(x => parseInt(x.IdRequerimiento) === parseInt(IdRequerimiento));
            let nombreestado_muestra = arr_requerimiento_por_id[0].NombreEstado;

            let pasavalidacion = fn_validar_actividad_antesgrabar(fila);

            if (!pasavalidacion) {
                return false;
            }

            if (IdRequerimientoxActividad === '0') {                
                urlsave = 'Requerimiento/RequerimientoMuestra/SaveNewActividadxRequerimiento_JSON';
            } else {                
                urlsave = 'Requerimiento/RequerimientoMuestra/SaveEditActividadxRequerimiento_JSON';
            }

            form.append("RequerimientoxActividadJSON", JSON.stringify(obj));

            if (nombreestadoactividad.toLowerCase() === 'finalizado' && nombreestado_muestra.toLowerCase() === 'pending' && nombreactividad.toLowerCase() === 'revision de comentarios') {
                //// LLAMAR A LA VENTANA PARA GRABAR
                //// pasar la fila
                _modalBody({
                    url: 'Requerimiento/RequerimientoMuestra/_ConfirmarAprobarRechazarMuestraFromActividad',
                    ventana: '_ConfirmarRechazaApruebaMuestra',
                    titulo: 'Confirmar',
                    parametro: `rowindex:${rowIndex},url:${_parameterEncodeJSON(urlsave)}`,
                    ancho: '',
                    alto: '',
                    responsive: 'modal-lg'
                });
            } else {
                form.append("RequerimientoAprobadoRechazadoJSON", '');
                _Post(urlsave, form, true)
                    .then((rpta) => {
                        let obj_rpta = rpta !== '' ? JSON.parse(rpta) : null
                        let titulomensaje = obj_rpta.estado === 'success' ? 'Buen Trabajo' : 'Error';
                        _swal({ estado: obj_rpta.estado, mensaje: obj_rpta.mensaje }, titulomensaje);
                        if (obj_rpta.estado === 'success') {
                            _Get('Requerimiento/RequerimientoMuestra/GetRequerimientoMuestraWithActividadesByEstilo_JSON?IdEstilo=' + ovariables.Requerimiento.IdEstilo)
                                .then((data) => {
                                    respuesta_despues_grabar_actividadrequerimiento(data);
                                    handler_table_muestra_actividad_despuesgrabar();
                                    let btnFlechaVerActividad = fn_obtenerBotonFlechaVerActividad_by_IdRequerimiento(IdRequerimiento);
                                    if (btnFlechaVerActividad) {
                                        fn_flecha_ver_actividades(btnFlechaVerActividad);
                                    }
                                });
                        }
                    });
            }
        }

        function fn_save_actividadmuestra_from_confirmar_aprueba_rechaza_muestra(obj_parametros_form_padre, obj_datos_apruebarechaza) {
            let fila = _('tblmuestras_tbody').rows[parseInt(obj_parametros_form_padre.rowindex) - 1];
            let datapar = fila.getAttribute('data-par');
            let obj = fn_getobj_actividad_muestra(fila), form = new FormData();
            let IdRequerimiento = _par(datapar, 'IdRequerimiento');
            let urlsave = obj_parametros_form_padre.url;

            let obj_requerimiento = {
                FechaAprobacionRechazo: obj_datos_apruebarechaza.fecha_aprueba_rechaza_ansi,
                IdEstado: obj_datos_apruebarechaza.valorestado,
                NombreEstado: obj_datos_apruebarechaza.nombreestado,
                IdRequerimiento: IdRequerimiento
            }

            form.append("RequerimientoxActividadJSON", JSON.stringify(obj));
            form.append("RequerimientoAprobadoRechazadoJSON", JSON.stringify(obj_requerimiento));
            _Post(urlsave, form, true)
                .then((rpta) => {
                    let obj_rpta = rpta !== '' ? JSON.parse(rpta) : null
                    let titulomensaje = obj_rpta.estado === 'success' ? 'Buen Trabajo' : 'Error';
                    _swal({ estado: obj_rpta.estado, mensaje: obj_rpta.mensaje }, titulomensaje);
                    if (obj_rpta.estado === 'success') {
                        _Get('Requerimiento/RequerimientoMuestra/GetRequerimientoMuestraWithActividadesByEstilo_JSON?IdEstilo=' + ovariables.Requerimiento.IdEstilo)
                            .then((data) => {
                                respuesta_despues_grabar_actividadrequerimiento(data);
                                handler_table_muestra_actividad_despuesgrabar();
                                let btnFlechaVerActividad = fn_obtenerBotonFlechaVerActividad_by_IdRequerimiento(IdRequerimiento);
                                if (btnFlechaVerActividad) {
                                    fn_flecha_ver_actividades(btnFlechaVerActividad);
                                }
                            });
                        //// CERRAR MODAL
                        $('#modal__ConfirmarRechazaApruebaMuestra').modal('hide');
                    }
                });
        }

        function fn_obtenerBotonFlechaVerActividad_by_IdRequerimiento(idrequerimiento) {
            let arrfilas_muestra = Array.from(_('tabdetalle_tblmuestras').rows).filter(x => {
                let datapar = x.getAttribute('data-par');
                let datapar_idrequerimiento = _par(datapar, 'IdRequerimiento');
                return datapar_idrequerimiento === idrequerimiento
            });
            let btnFlechaVerActividad = null;
            if (arrfilas_muestra.length > 0) {
                btnFlechaVerActividad = arrfilas_muestra[0].getElementsByClassName('cls_btn_veractividad')[0];
            }
            return btnFlechaVerActividad;
        }

        function fn_validar_actividad_antesgrabar(fila) {
            let cboactividad = fila.getElementsByClassName('cls_cbo_actividad')[0];
            let spnerror_actividad = fila.getElementsByClassName('cls_spn_error_actividad')[0];
            let pasavalidacion = true;
            spnerror_actividad.classList.add('hide');
            if (cboactividad.value === '') {
                spnerror_actividad.classList.remove('hide');
                pasavalidacion = false;
            }

            return pasavalidacion;
        }

        function respuesta_despues_grabar_actividadrequerimiento(data) {
            let odata = data !== '' ? JSON.parse(data) : null;
            if (odata) {
                ovariables.ListaRequerimiento = odata.ListaRequerimientoCSV !== '' ? CSVtoJSON(odata.ListaRequerimientoCSV) : [];
                ovariables.ListaActividadesDespachoByEstilo = odata.ListaActividadesDespachoByEstiloCSV !== '' ? CSVtoJSON(odata.ListaActividadesDespachoByEstiloCSV) : [];
                fn_pintartabla_requerimientomuestra_despuesgrabar();
            }
        }

        function fn_pintartabla_requerimientomuestra_despuesgrabar() {
            _('tblmuestras_thead').innerHTML = '';
            _('tblmuestras_tbody').innerHTML = '';
            let thead = `<tr>
                        <th class='text-center' style="width: 1%">
                        </th>
                        <th class='text-center' style="width: 10%">
                            Muestra
                        </th>
                        <th class="hd text-center oculto hide" style="width: 15%">Actividad
                        </th >
                        <th class="hd text-center oculto hide" style="width: 8%">Fecha
                                                Programada
                        </th>
                        <th class="hd text-center oculto hide" style="width: 8%">Fecha
                            Real
                        </th>
                        <th class="hd text-center oculto hide" style="width: 8%">Comentario
                        </th>
                        <th class='text-center'>Estado
                        </th>
                        <th class='text-center'>Fecha
                            Aprobación
                        </th>
                        <th class='text-center'># Versiones
                        </th>
                    </tr>`;

            $("#tblmuestras_thead").append(thead).fadeIn('slow');
            

            let filas = ovariables.ListaRequerimiento.map((x) => {
                let idtr = `${x.IdRequerimiento}_${x.IdTipoMuestraxCliente}`;
                let actividadesxrequerimiento = subfn_getactividades_html(x.IdRequerimiento, true);
                return `<tr class='alert alert-info cls_tr_muestra' ondblclick='app_RequerimientoDetalleDDP._cargar_programacion_y_adjuntos("${x.IdRequerimiento}");' data-par='IdRequerimiento:${x.IdRequerimiento},version:${x.Version}'>
                    <td>
                        <div class="text-center">
                            <button class='btn btn-default btn-xs btncircle cls_btn_veractividad' style="cursor:pointer!ipmportant" 
                                data-operation='detail' title='Mostrar las actividades de la Muestra'>
                            <i class='fa fa-angle-right'></i></button>
                        </div>
                    </td>
                    <td class='' style="width: 5%">${x.NombreTipoMuestra}
                        <button id='btnNuevo_${ x.IdTipoMuestraxCliente}' class='btn btn-default btn-xs btncircle pull-right' style="margin-left:3px;cursor:pointer!ipmportant" onclick="app_RequerimientoDetalleDDP._nuevo_tabdetalle_subdetalle_muestra(this,${x.IdRequerimiento},${x.IdTipoMuestraxCliente},'a_${idtr}');" data-operation='new' title='Nuevo registro en detalle'>
                        <i class='fa fa-plus'></i></button>
                    </td>
                    <td class="hd oculto hide" style="width: 10%"></td>
                    <td class="hd oculto hide" style="width: 10%; text-align:center!important;"></td>
                    <td class="hd oculto hide" style="width: 10%; text-align:center!important;"></td>
                    <td class="hd oculto hide" style="width: 10%; text-align:center!important;"></td>
                    <td style="width: 5%; text-align:center!important;" class='cls_td_estadomuestra'>${x.NombreEstado}</td>
                    <td class='text-center' style="width: 5%; text-align:center!important;">${x.FechaAprobacionRechazoMuestra}</td>
                    <td class='text-center' style="width: 5%; text-align:center!important;">${x.Version}</td>
                </tr>
                ${ actividadesxrequerimiento }
                `
            }).join('');

            _('tblmuestras_tbody').innerHTML = filas;
        }

        function subfn_getactividades_html(idrequerimiento, ocultar) {
            let requerimientoactividad = ovariables.ListaActividadesDespachoByEstilo.filter(x => x.IdRequerimiento === idrequerimiento);
            let classHide = ocultar === true ? 'hide' : '';
            
            let html = requerimientoactividad.map(x => {
                return `<tr class='cls_tr_actividad cls_tr_oculto ${classHide}' data-par='IdRequerimientoxActividad:${x.IdRequerimientoxActividad},IdRequerimiento:${x.IdRequerimiento},IdActividad:${x.IdActividad}' data-idestadoactividad='${x.IdEstadoActividad}'>
                            <td class='no-padding'></td>
                            <td class='no-padding text-center'>
                                <button class='btn btn-danger btn-xs cls_btn_eliminaractividad' style="margin-left:3px;cursor:pointer!ipmportant"  data-operation='delete' title='Eliminar registro'>
                                    <i class='fa fa-trash'></i>
                                </button>
                                <button class='btn btn-danger btn-xs cls_btn_cancelaractividad hide' style="margin-left:3px;cursor:pointer!ipmportant"  data-operation='delete' title='Cancelar registro'>
                                    <i class='fa fa-undo'></i>
                                </button>
                                <button class='btn btn-success btn-xs cls_btn_save_actividad hide' style="margin-left:3px;cursor:pointer!ipmportant" data-operation='edit' title='Grabar registro'>
                                    <i class='fa fa-save'></i>
                                </button>
                                <button class='btn btn-default btn-xs cls_btn_edit_actividad' style="margin-left:3px;cursor:pointer!ipmportant" data-operation='edit' title='Editar registro'>
                                    <i class='fa fa-pencil'></i>
                                </button>
                            </td>
                            <td class='no-padding oculto ${classHide}'>
                                <select class='form-control cls_cbo_actividad' style='background-color: white;' disabled></select>
                                <span class='cls_spn_error_actividad has-error hide'>Seleccione la actividad</span>
                            </td>
                            <td class='text-center no-padding oculto ${classHide}'>
                                <div class="input-group date cls_div_fechaprogramada_actividad">
                                    <input type="text" class="form-control cls_fechaprogramada_actividad" data-date-format="dd/mm/yyyy" data-type="date" value="${x.FechaProgramada}" disabled style="height:auto!important; background-color: white;" data-mask="99/99/9999">
                                        <span class="input-group-addon disabled"><i class="fa fa-calendar"></i></span>
                                </div>
                            </td>
                            <td class='text-center no-padding oculto ${classHide}'>
                                <div class="input-group date cls_div_fechareal_actividad">
                                    <input type="text" class="form-control cls_fechareal_actividad" data-date-format="dd/mm/yyyy" data-type="date" value="${x.FechaReal}" disabled style="height:auto!important; background-color: white;" data-mask="99/99/9999">
                                        <span class="input-group-addon disabled"><i class="fa fa-calendar"></i></span>
                                </div>
                            </td>
                            <td class='no-padding oculto cls_td_comentario_actividad ${classHide}'>
                                ${x.Comentario}
                                <textarea class='form-control cls_txta_comentario_actividad hide' style='resize: none; background-color: white;' rows="2" disabled>${x.Comentario}</textarea>
                            </td>
                            <td class='text-center no-padding cls_td_estadoactividad'>${x.EstadoActividad_Catalogo}</td>
                            <td class='text-center no-padding'>${x.FechaAprobacionCliente}</td>
                            <td class='text-center no-padding cls_td_version_actividad'>${x.Version}</td>
                           </tr>`;
            }).join('');

            return html;
        }

        function fn_getobj_actividad_muestra(fila) {
            let idactividad = fila.getElementsByClassName('cls_cbo_actividad')[0].value;
            let datapar = fila.getAttribute('data-par');
            let idestado_actividad = fila.getAttribute('data-idestadoactividad');
            let idrequerimiento = _par(datapar, 'IdRequerimiento');
            let txtfechaprogramada = fila.getElementsByClassName('cls_fechaprogramada_actividad')[0];
            let txtfechareal = fila.getElementsByClassName('cls_fechareal_actividad')[0];
            let fechaprogramada = txtfechaprogramada.value !== '' ? _convertDate_ANSI(txtfechaprogramada.value, ovariables.formatoEspanol) : '';
            let fechareal = txtfechareal.value !== '' ? _convertDate_ANSI(txtfechareal.value, ovariables.formatoEspanol) : '';
            let comentario = fila.getElementsByClassName('cls_td_comentario_actividad')[0].innerText.trim(); //fila.getElementsByClassName('cls_txta_comentario_actividad')[0].value;
            let version_actividad = fila.getElementsByClassName('cls_td_version_actividad')[0].innerText;
            let idrequerimientoxactividad = _par(datapar, 'IdRequerimientoxActividad');

            let obj = {
                IdRequerimientoxActividad: idrequerimientoxactividad,
                IdActividad: idactividad,
                IdRequerimiento: idrequerimiento,
                FechaProgramada: fechaprogramada,
                FechaReal: fechareal,
                Comentario: comentario,
                IdEstado_IdCatalogo: idestado_actividad,
                Version: version_actividad
            }

            return obj;
        }

        function fn_change_datefechaprogramada(o) {            
            let fila_actividad = o.parentNode.parentNode.parentNode;
            let data_estadoactividad = fn_obtener_data_estadosactividad('TRABAJANDO');
            fila_actividad.getElementsByClassName('cls_td_estadoactividad')[0].innerText = data_estadoactividad[0].NombreCatalogo;
            fila_actividad.setAttribute('data-idestadoactividad', data_estadoactividad[0].IdCatalogo);
        }

        function fn_change_datefechareal(o) {            
            let fila_actividad = o.parentNode.parentNode.parentNode;
            let data_estadoactividad = fn_obtener_data_estadosactividad('FINALIZADO');
            fila_actividad.getElementsByClassName('cls_td_estadoactividad')[0].innerText = data_estadoactividad[0].NombreCatalogo;
            fila_actividad.setAttribute('data-idestadoactividad', data_estadoactividad[0].IdCatalogo);
        }

        const _crearTableDetalle_Programacion = (idrequerimiento) => {
            $('.iboxlistarequerimientos').children('.ibox-content').toggleClass('sk-loading');
            
            let url = `Requerimiento/RequerimientoMuestra/GetListaDespachoDetalleByIdRequerimientoForSave_JSON?IdRequerimiento=${idrequerimiento}`;
            _Get(url)
                .then((resultado) => {
                    return CSVtoJSON(resultado);
                })
                .then((adata) => {
                    const table = cargarProgramacion(adata);
                    _('tabdetalle_tblprogramacion').tBodies[0].innerHTML = table;
                    _('tabdetalle_tblprogramacion').tHead.setAttribute('data-idrequerimiento', idrequerimiento);
                    
                    const aBotonesDrop = Array.from(_('tabdetalle_tblprogramacion').getElementsByClassName('_dropcopia'));
                    setArrayEvent(aBotonesDrop, 'click', eliminarItemProgramacion );
                    
                })
                .then(() => {
                    $("#tabdetalle_tblprogramacion ._fechadespacho").datepicker({
                        autoclose: true,
                        clearBtn: true,
                        todayHighlight: true
                    }).on('changeDate', function (e) { }).next().on('click', function () {
                        $(this).prev().focus();
                    });
                })
        }

        function _isFunction(x) {
            return Object.prototype.toString.call(x) == '[object Function]';
        }

        function setArrayEvent(arr, evento, callBack) {
            if (_isFunction(callBack) && !_isEmpty(evento)) {
                arr.forEach(x => {
                    x.addEventListener(evento, callBack);
                });
            }
        }


        function obtenerDataFilaAnterior(row,IdRequerimientoDetallePadre) {
            const esCopia = row.getAttribute("data-escopia") === 'si';
            const esCopiaUltima = esCopia ? 'si' : '';
            const [IdDespachoDetalle,] = row.getAttribute('data-par').split('¬');            
            const oParametro = { IdDespachoDetalle: IdDespachoDetalle, IdRequerimiento: IdRequerimientoDetallePadre, EsCopiaUltima: esCopiaUltima };
            return oParametro;
        }

        function eliminarItemProgramacion(event) {
            const btn = event.currentTarget;            
            const esCopia = btn.getAttribute("data-escopia").trim() === 'si';
            if (esCopia) {
                const fila = btn.parentNode.parentNode;                
                const indexFila = fila.rowIndex;
                const [IdDespachoDetalle,] = fila.getAttribute('data-par').split('¬');
                
                const tblProgramacionPadre = _('tabdetalle_tblprogramacion');                
                const filaAnterior = tblProgramacionPadre.rows[indexFila - 1];
                const IdRequerimientoDetallePadre = tblProgramacionPadre.tHead.getAttribute('data-idrequerimiento');

                const oParametroEsCopiaUltima = obtenerDataFilaAnterior(filaAnterior, IdRequerimientoDetallePadre);
                const oParametro = { IdDespachoDetalle: IdDespachoDetalle, IdRequerimiento: IdRequerimientoDetallePadre, EsCopiaUltima: '' };
                
                const frm = new FormData();
                frm.append("DespachoDetalleJSON", JSON.stringify(oParametro));
                frm.append("DespachoDetalleUltimoJSON", JSON.stringify(oParametroEsCopiaUltima));

                _Post('Requerimiento/RequerimientoMuestra/DeleteDespachoDetalleById_JSON', frm)
                    .then((rpta) => {
                        const oRespuesta = oJSON(rpta);
                        const aData = CSVtoJSON(oRespuesta.data);
                        const tableHTML = cargarProgramacion(aData);
                        _('tabdetalle_tblprogramacion').tBodies[0].innerHTML = tableHTML;
                        return { estado: oRespuesta.estado, mensaje: oRespuesta.mensaje };
                    })
                    .then((oRespuesta) => {
                        const aBotonesDrop = Array.from(_('tabdetalle_tblprogramacion').getElementsByClassName('_dropcopia'));
                        setArrayEvent(aBotonesDrop, 'click', eliminarItemProgramacion);
                        return oRespuesta;
                    })
                    .then((oRespuesta) => {
                        $("#tabdetalle_tblprogramacion ._fechadespacho").datepicker({
                            autoclose: true,
                            clearBtn: true,
                            todayHighlight: true
                        }).on('changeDate', function (e) { }).next().on('click', function () {
                            $(this).prev().focus();
                        });
                        return oRespuesta;
                    })
                    .then((oRespuesta) => {
                        let titulomensaje = oRespuesta.estado === 'success' ? 'Buen Trabajo' : 'Error';
                        _swal({ estado: oRespuesta.estado, mensaje: oRespuesta.mensaje }, titulomensaje);
                    })
                    .catch(err => c(err));
            }
        }

        
        function cargarProgramacion(aData) {
            
            const result = aData.map((x, index) => {
                //// CUANTOS REGISTROS POR IDREQUERIMIENTODETALLE
                let total_x_requerimientodetalle = aData.filter(y => y.IdRequerimientoDetalle === x.IdRequerimientoDetalle).length;
                const esTextoBloqueado = parseInt(x.IdDespachoDetalle) > 0 && ((parseInt(x.CantidadDespacho) > 0 || parseInt(x.CantidadCMDespacho) > 0) && parseInt(total_x_requerimientodetalle) > 1);
                const canDespacho = (x.EsCopiaUltima === 'si' || !esTextoBloqueado) ? `<input type="number" class="form-control no-borders no-margin no-padding text-center _cmdespacho" style="height:auto!important" value="${x.CantidadDespacho}" min="1">` : `<input type="text" class="form-control no-borders no-margin no-padding text-center _cmdespacho" disabled value="${x.CantidadDespacho}">`;
                const canCMDespacho = (x.EsCopiaUltima === 'si' || !esTextoBloqueado) ? `<input type="number" class="form-control no-borders no-margin no-padding text-center _ccmdespacho" style="height:auto!important" value="${x.CantidadCMDespacho}" min="1">` : `<input type="text" class="form-control no-borders no-margin no-padding text-center _ccmdespacho" disabled value="${x.CantidadCMDespacho}" >`;
                const buttonEliminar = `<button class="btn btn-xs btn-danger cancel-prog _dropcopia${((x.EsCopiaUltima === 'si' || !esTextoBloqueado) && x.EsCopia) ? '' : ' hide'}" data-escopia="${x.EsCopia}" data-escopiaultima="${x.EsCopiaUltima}"> <i class="fa fa-close"></i> </button>`;

                return `<tr data-par='${x.IdDespachoDetalle}¬${x.IdRequerimientoDetalle}' data-escopia='${x.EsCopia}' data-escopiaultima="${x.EsCopiaUltima}">
                            <td>${index + 1}</td>
                            <td class="text-center">${x.NombreClienteColor}</td>
                            <td class="text-center">${x.NombreClienteTalla}</td>
                            <td class="text-center">${x.Linea1}</td>
                            <td class="text-center cls_td_q_saldo" style="widtd: 11%">                               
                                ${x.Cantidad}                                
                            </td>
                            <td class="text-center cls_td_qcm_saldo" style="widtd: 11%">                                
                                ${x.CantidadCM}
                            </td>
                            <td class="text-center">${x.FechaFTY}</td>
                            <td class="text-center">${x.FechaFTYUpdate}</td>
                            <td class="text-center">${x.FechaCliente}</td>
                            <td class="text-center" style="widtd: 11%">
                                ${canDespacho}
                            </td>
                            <td class="text-center" style="widtd: 11%">                               
                                ${canCMDespacho}
                            </td>
                            <td class="text-center" style="widtd: 15%">
                                <div id="divfechadespacho_2" >
                                    <div class="input-group date">
                                            <input type="text" class="form-control no-margin no-padding no-borders _fechadespacho" data-date-format="dd/mm/yyyy" data-type="date" value="${x.FechaDespacho}" style="height:auto!important" data-mask="99/99/9999"><span class="input-group-addon no-borders no-margin no-padding disabled"><i class="fa fa-calendar"></i></span>
                                    </div>
                                    </div>                              
                            </td>
                            <td class="text-center" style="widtd: 2%">                                
                                ${buttonEliminar}
                            </td>
                        </tr>`;
            }).join('');
            return result;

        }

        const _crearTableDetalle_Adjuntos = (idrequerimiento) => {
            $('.iboxlistaarchivos').children('.ibox-content').toggleClass('sk-loading');
            $("#tblarchivos_tbodydetalle tr").remove();

            let trDetalleArchivos = ovariables.ListaArchivos.filter(x => x.IdRequerimiento === idrequerimiento).map((x) => {
                return `
                    <tr data-par='IdArchivo:${x.IdArchivo},IdRequerimiento:${x.IdRequerimiento},IdTipoArchivo:${x.IdTipoArchivo},NombreArchivoOriginal:${x.NombreArchivoOriginal},NombreArchivo:${x.NombreArchivo}'>
                        <td class='text-center'>
                            <button class='btn btn-xs btn-danger cls_btn_deletearchivo'>
                                <span class='fa fa-trash'></span>
                            </button>
                            <button class='btn btn-xs btn-success cls_btn_savearchivo'>
                                <span class='fa fa-save'></span>
                            </button>
                            <button class='btn btn-xs btn-info cls_btn_downloadarchivo'>
                                <span class='fa fa-download'></span>
                            </button>
                        </td>
                        <td>${x.NombreArchivoOriginal}</td>
                        <td>${x.Usuario_Area}</td>
                        <td>
                            <select class='cls_cbo_tipoarchivo form-control'></select>
                        </td>
                        <td>${x.NombreTipoMuestra}</td>
                        <td>${x.Version}</td>
                        <td>${x.FechaActualizacion}</td>
                    </tr>
                `

            }).join('');
            _('tblarchivos_tbodydetalle').innerHTML = trDetalleArchivos;
            fn_handler_tblarchivos_detalle();
            //$("#tblarchivos_tbodydetalle").append(trDetalleArchivos);
            //$('.iboxlistaarchivos').children('.ibox-content').toggleClass('sk-loading');
        }

        function fn_handler_tblarchivos_detalle() {
            let arrfilas = Array.from(_('tblarchivos_tbodydetalle').rows);
            arrfilas.forEach(x => {
                let datapar = x.getAttribute('data-par');
                let idtipoarchivo = _par(datapar, 'IdTipoArchivo');
                //// PRIMERO ELIMINAR LOS EVENTOS ASOCIADOS
                //// INICIALMENTE NO EXISTEN LOS EVENTOS POR ESO SE PONE EL TRY CATCH PARA CONTROLAR EL ERROR
                try {
                    x.getElementsByClassName('cls_btn_deletearchivo')[0].removeEventListener('click', myFuncion);
                    x.getElementsByClassName('cls_btn_savearchivo')[0].removeEventListener('click', myFuncion);
                    x.getElementsByClassName('cls_btn_downloadarchivo')[0].removeEventListener('click', myFuncion);
                } catch (e) {

                }
                
                x.getElementsByClassName('cls_btn_deletearchivo')[0].addEventListener('click', myFuncion = function (e) { let o = e.currentTarget; fn_delete_archivo_muestra(o); }, false);
                x.getElementsByClassName('cls_btn_savearchivo')[0].addEventListener('click', myFuncion = function (e) { let o = e.currentTarget; fn_save_archivo_editar_muestra(o); }, false);
                x.getElementsByClassName('cls_btn_downloadarchivo')[0].addEventListener('click', myFuncion = function (e) { let o = e.currentTarget; fn_download_archivo_muestra(o); }, false);

                //// LLENAR COMBO TIPO ARCHIVO
                let cboTipoArchivo = x.getElementsByClassName('cls_cbo_tipoarchivo')[0];
                cboTipoArchivo.innerHTML = _comboFromJSON(ovariables.ListaTipoArchivo, 'IdTipoArchivo', 'NombreTipoArchivo');
                cboTipoArchivo.value = idtipoarchivo;
            });
        }

        function fn_download_archivo_muestra(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let nombrearchivo = _par(datapar, 'NombreArchivo');
            let nombrearchivooriginal = _par(datapar, 'NombreArchivoOriginal');
            var link = document.createElement("a");
            link.href = urlBase() + `Requerimiento/RequerimientoMuestra/DownLoadFileTechkPack?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function fn_delete_archivo_muestra(o) {
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idarchivo = _par(datapar, 'IdArchivo');

            let idestilo = _('lblCodWTS').value;
            swal({
                html: true,
                title: "Está sguro de eliminar el archivo...!",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdArchivo: idarchivo,
                        IdRequerimiento: 0,
                        IdEstilo: idestilo
                    }, frm = new FormData();
                frm.append('ArchivoJSON', JSON.stringify(parametro));
                _Post('Requerimiento/RequerimientoMuestra/DeleteArchivoRequerimientoById_JSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            ovariables.ListaArchivos = CSVtoJSON(orpta.data)
                            fila.parentNode.removeChild(fila);
                            //swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                            swal({ title: "Buen Trabajo!", text: "Actualizado con éxito", type: "success", timer: 5000 });
                        } 
                        let titulomensaje = orpta.estado === 'success' ? 'Buen Trabajo!' : 'Error';
                        //_swal({ estado: orpta.estado, mensaje: orpta.mensaje }, titulomensaje)
                    }, (p) => { err(p); });
            });
        }

        function fn_save_archivo_editar_muestra(o) {
            ovariables.actualizararchivo = 0;
            let fila = o.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let idarchivo = _par(datapar, 'IdArchivo');
            let idtipoarchivo = fila.getElementsByClassName('cls_cbo_tipoarchivo')[0].value;
            let objArchivo = { IdArchivo: idarchivo, IdTipoArchivo: idtipoarchivo }
            
            swal({
                html: true,
                title: "Está sguro de grabar...!",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                fn_savefile(objArchivo);
            });
        }
        
        const _crearTableComentarios_Muestra = (_obj) => {
            $("#tblcomentario_tbody tr").remove();

            let filas = ovariables.ListaRequerimiento.map((x) => {
                let idtr = `${x.IdRequerimiento}`;
                return `<tr id="trComentarioMuestra_${idtr}" class='' onclick='app_RequerimientoDetalleDDP._cargar_tabcomentarios_comentarios("${x.IdRequerimiento}");'>                    
                    <td class='text-center' style="width: 5%">${x.NombreTipoMuestra}</td>                    
                    <td style="width: 5%; text-align:center!important;">${x.NombreEstado}</td>
                    <td class='text-center' style="width: 5%; text-align:center!important;">${x.FechaCreacion}</td>
                    <td class='text-center' style="width: 5%; text-align:center!important;">${x.Version}</td>
                </tr>`
            }).join('');

            $("#tblcomentario_tbody").append(filas);
        }

        const readURL = (input) => {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#imageDetalle').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            } else {
                $('#imageDetalle').attr('src', '');
            }
        }

        
        //function fn_change_file_user(e) {
        //    if (parseInt(ovariables.IdRequerimientoSeleccionadoDblClickMuestra) === 0) {
        //        _swal({ mensaje: 'Seleccione la Muestra primero para poder agregar una imagen...!', estado:'error' });
        //        return false;
        //    }

        //    let archivo = this.value;
        //    if (archivo != '') {
        //        let contador = fn_getfileuser('tabdetalle_tblarchivos');
        //        if (contador.length < 100) {
        //            let ultimopunto = archivo.lastIndexOf(".");
        //            let ext = archivo.substring(ultimopunto + 1);
        //            ext = ext.toLowerCase();
        //            let nombre = e.target.files[0].name, html = '';
        //            let file = e.target.files;
        //            //onclick = "appRequerimientosDDPIndex.fn_tabdetalle_descargar_archivo('trAdjuntos_new',0);"
        //            html = `<tr data-par='idarchivo:0,modificado:1'>
        //                <td class ='text-center' style='vertical-align:middle'>
        //                    <div class ='btn-group'>
        //                       <button class="btn btn-success btn-xs cls_btn_save_archivo" 
        //                        title = "Guardar" style = "cursor:pointer!important" data-toggle="tooltip" data-placement="right" title = "Actualizar Datos" data-original-title="Guardar" >
        //                            <i class="fa fa-save"></i>
        //                        </button>
        //                        <button
        //                            class="btn btn-default btn-xs"
        //                            onclick = "appRequerimientosDDPIndex.fn_tabdetalle_descargar_archivo('trAdjuntos_new',0);"
        //                            title = "Descargar"
        //                            style = "cursor:pointer!important" data-toggle="tooltip" data-placement="right" title = "Descargar archivo" data-original-title="Descargar archivo" >
        //                                <i class="fa fa-download"></i>
        //                        </button>
        //                    </div>
        //                </td>
        //                <td style='vertical-align:middle'>${nombre}</td>
        //                <td class='text-center' style='vertical-align:middle'>${window.utilindex.usuario}</td>
        //                <td class='text-center' style='vertical-align:middle'>${ovariables.CrearComboTipo}</td>
        //                <td style='vertical-align:middle'></td>
        //                <td class='text-center' style='vertical-align:middle'>${ moment().format('MM/DD/YYYY HH:mm:ss')}</td>                                          
        //            </tr>`;

        //            _('tabdetalle_tblarchivos').tBodies[0].insertAdjacentHTML('beforebegin', html);

        //            let tbl = _('tabdetalle_tblarchivos').tBodies[0], total = tbl.rows.length;
        //            let filexd = _('inputImageDetalle').cloneNode(true);
        //            filexd.setAttribute('id', 'file' + (total - 1));
        //            tbl.rows[total - 1].cells[3].appendChild(filexd);
        //            handlerTblFileUser_add(total);
        //        }
        //        else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 100 archivos', type: 'warning' }); }
        //    }
        //}
        function handlerTblFileUser_add(indice) {
            let tbl = _('tabdetalle_tblarchivos');
            let fila = tbl.rows[indice];
            let btnBotonSaveArchivo = fila.getElementsByClassName('cls_btn_save_archivo')[0];
            if (btnBotonSaveArchivo) {
                btnBotonSaveArchivo.addEventListener('click', function (e) { let o = e.currentTarget; fn_save_archivo_muestra(o) }, false);
            }
            
        }

        function fn_save_archivo_muestra(o) {

        }

        function handlerTblFileUser_edit() {
            let tbl = _('tabdetalle_tblarchivos'),
                arrayDelete = _Array(tbl.getElementsByClassName('_delete')),
                arrayDownload = _Array(tbl.getElementsByClassName('_download'));
            arrayDownload.forEach(x => x.addEventListener('click', e => { controladortblfileuser_edit(e, 'download'); }));
            arrayDelete.forEach(x => x.addEventListener('click', e => { controladortblfileuser_edit(e, 'delete'); }));
        }
        //function controladortblfileuser_add(event, accion) {
        //    let o = event.target, tag = o.tagName, fila = null, par = '';

        //    switch (tag) {
        //        case 'BUTTON':
        //            fila = o.parentNode.parentNode.parentNode;
        //            break;
        //        case 'SPAN':
        //            fila = o.parentNode.parentNode.parentNode.parentNode;
        //            break;
        //    }

        //    if (fila != null) {
        //        par = fila.getAttribute('data-par');
        //        eventtblfileuser_add(par, accion, fila);
        //    }
        //}
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
        //function eventtblfileuser_add(par, accion, fila) {
        //    switch (accion) {
        //        case 'drop':
        //            _("inputImageDetalle").value = "";
        //            fila.classList.add('hide');
        //            break;
        //        case 'download':
        //            downloadfileuser(fila);
        //            break;
        //    }
        //}
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
                cancelButtonText: "Cancel",
                closeOnConfirm: true
            }, function () {
                _fila.classList.add('hide');
                _("inputImageDetalle")
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
                        nombrearchivooriginal: row.cells[1].innerText,
                        modificado: parseInt(_par(par, 'modificado'))
                    }
                    arr.push(obj);
                }
            }
            return arr;
        }
        

        const SaveDetalleRequerimientoDespacho_JSON = () => {
            swal({
                html: true,
                title: "Guardar Solicitud",
                text: "¿Estas seguro/a que deseas actualizar el Requerimiento?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "SI",
                cancelButtonText: "NO",
                closeOnConfirm: false
            }, function () {
                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_RequerimientoDetalleDDP' });
                let err = function (__err) { console.log('err', __err) };

                const calificacionfabrica = Array.from(document.getElementsByName('rdcalificacion')).filter(x => x.checked).map(x => x.value).join('');
                let calificacionnivel = Array.from(document.getElementsByName('rdnivel')).filter(x => x.checked).map(x => x.value).join('');

                let parametro = {
                    CodigoEstilo: '',
                    IdEstilo: parseInt(json.IdEstilo, 10),
                    Descripcion: '',
                    IdPrograma: 0,
                    Estatus: json.Status,
                    TipoSolicitudEstilo_IdCatalogo_EsReorden: parseInt(json.EsReorden, 10),
                    CalificacionFabrica: calificacionfabrica!=='' ? parseInt(calificacionfabrica) :0,
                    CalificacionNivelDificultad: calificacionnivel!=='' ? parseInt(calificacionnivel):0,
                    ActualizarImagenEstilo: (_("inputImageDetalle").files[0] !== undefined) ? 1 : 0,
                    FechaTelaDisponible: json.FechaTelaDisponible
                };

                let frm = new FormData();
                frm.append('EstiloJSON', JSON.stringify(parametro));
                frm.append('ImagenEstilo', (_("inputImageDetalle").files[0] !== null) ? _("inputImageDetalle").files[0] : null);

                _Post('Requerimiento/RequerimientoMuestra/SaveDetalleRequerimientoDespacho_JSON', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            let rpta = (resultado !== '') ? JSON.parse(resultado) : {};
                            swal({ title: 'Buen Trabajo', text: rpta.mensaje, type: rpta.estado });
                            return;
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });

        }
        
        const _nuevo_tabdetalle_subdetalle_muestra = (control, idrequerimiento, idtipomuestra, linkmostrardetallemuestras) => {
    

            fn_creartabla_muestra_add(control);

            $(`#txtfecprogNew_${idrequerimiento}_${idtipomuestra},#txtfecrealNew_${idrequerimiento}_${idtipomuestra}`).datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).on("changeDate", function (e) {
                let id = $(this).attr("id");
                let fechaprog, fechareal;
                if (id.indexOf("txtfecprogNew_") === 0) {
                    fechaprog = (!moment(e.date).isValid || e.date === undefined) ? null : e.date;
                    fechareal = (!moment($(`#txtfecrealNew_${idrequerimiento}_${idtipomuestra}`).datepicker("getDate")).isValid()) ? null : $(`#txtfecrealNew_${idrequerimiento}_${idtipomuestra}`).datepicker("getDate");
                } else if (id.indexOf("txtfecrealNew_") === 0) {
                    fechareal = (!moment(e.date).isValid || e.date === undefined) ? null : e.date;
                    fechaprog = (!moment($(`#txtfecprogNew_${idrequerimiento}_${idtipomuestra}`).datepicker("getDate")).isValid()) ? null : $(`#txtfecprogNew_${idrequerimiento}_${idtipomuestra}`).datepicker("getDate");
                }
                if (fechaprog !== null && fechareal !== null) {
                    _(`${idhtmlspnestado}`).innerHTML = 'FINALIZADO';
                    _(`${idhtmlhdnestado}`).value = '57';
                } else if (fechaprog !== null && fechareal === null) {
                    _(`${idhtmlspnestado}`).innerHTML = 'TRABAJANDO';
                    _(`${idhtmlhdnestado}`).value = '56';
                } else if (fechaprog === null && fechareal !== null) {
                    _(`${idhtmlspnestado}`).innerHTML = 'FINALIZADO';
                    _(`${idhtmlhdnestado}`).value = '57';
                } else if (fechaprog === null && fechareal === null) {
                    _(`${idhtmlspnestado}`).innerHTML = 'PENDIENTE';
                    _(`${idhtmlhdnestado}`).value = '55';
                }
            });
        }

        const _eliminar_tabdetalle_detalle_muestra_new = (controlinvocacion, botonNuevaActividad, idtreliminar, idtreliminarall, linkmostrardetallemuestras) => {
            swal({
                title: "Esta seguro de eliminar la nueva Actividad?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: true
            }, function () {
                $("#" + idtreliminar).remove();
                $(`#${botonNuevaActividad}`).prop("disabled", false);
                let trs = $(`#tblmuestras_tbody > tr[class='rowdetallemuestra']`).length;
                if (trs === 0) {
                    $("#tblmuestras_thead > tr > th.hd").addClass("ocultar");
                    $("#tblmuestras_tbody > tr > td.hd").addClass("ocultar");
                }
                $(`#${linkmostrardetallemuestras}`).children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                $(`#${linkmostrardetallemuestras}`).prop("disabled", false);
                return;
            });

        }
        const _grabar_tabdetalle_detalle_muestra_new = (controlinvocacion, botonNuevaActividad, idtrgrabar, linkmostrardetallemuestras) => {
            let required = _required({ clase: '_enty_required', id: 'divdetallemuestras' });
            if (required) {
                swal({
                    title: "Esta seguro de guardar esta actividad?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true
                }, function () {
                    let err = function (__err) { console.log('err', __err) };

                    let idact = ($(`#${idtrgrabar}`).children("td").eq(2).children("select").val() !== '') ? parseInt($(`#${idtrgrabar}`).children("td").eq(2).children("select").val(), 10) : 0;
                    let Idreq = parseInt($(`#${idtrgrabar}`).attr("data-idreq"), 10);
                    let fecprog = (moment($(`#${idtrgrabar}`).children("td").eq(3).children("input").val()).isValid()) ? moment($(`#${idtrgrabar}`).children("td").eq(3).children("input").val()).format("DD/MM/YYYY") : '';
                    let fecreal = (moment($(`#${idtrgrabar}`).children("td").eq(4).children("input").val()).isValid()) ? moment($(`#${idtrgrabar}`).children("td").eq(4).children("input").val()).format("DD/MM/YYYY") : '';
                    let comen = $(`#${idtrgrabar}`).children("td").eq(5).children("input").val();
                    let idestcat = $(`#${idtrgrabar}`).children("td").eq(6).children("input").val();

                    let parametro = {
                        IdActividad: idact,
                        IdRequerimiento: Idreq,
                        FechaProgramada: fecprog,
                        FechaReal: fecreal,
                        Comentario: comen,
                        IdEstado_IdCatalogo: idestcat
                    };

                    let frm = new FormData();
                    frm.append('RequerimientoxActividadJSON', JSON.stringify(parametro));

                    _Post('Requerimiento/RequerimientoMuestra/SaveNewActividadxRequerimiento_JSON', frm)
                        .then((resultado) => {
                            $(`#${botonNuevaActividad}`).prop("disabled", false);
                            $(`#${linkmostrardetallemuestras}`).children("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                            $(`#${linkmostrardetallemuestras}`).prop("disabled", false);

                        }, (p) => { err(p); });

                    return;
                });
            } else {
                swal({ title: 'Advertencia', text: 'Favor de seleccionar una Actividad!', type: 'warning' });
            }

        }

        const _cargar_programacion_y_adjuntos = (idrequerimiento) => {
            ovariables.IdRequerimientoSeleccionadoDblClickMuestra = idrequerimiento;
            _crearTableDetalle_Programacion(idrequerimiento);
            _crearTableDetalle_Adjuntos(idrequerimiento);
        }
        


        function _cargar_tabcomentarios_comentarios(idrequerimiento){
            $('.iboxlistarequerimientos').children('.ibox-content').toggleClass('sk-loading');
            let err = function (__err) { console.log('err', __err) },
                parametro = idrequerimiento;

            _Get('Requerimiento/RequerimientoMuestra/GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON?IdRequerimiento=' + parametro)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? resultado : {};
                    if (rpta !== null) {                        
                        ovariables.ListaRequerimientoComentarios = (rpta !== '') ? CSVtoJSON(rpta, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        _cargarDetalle_ComentariosxIdRequerimiento(idrequerimiento, ovariables.ListaRequerimientoComentarios);
                        _("hdnIdRequerimientoComentario").value = parametro;
                    }
                }, (p) => { err(p); });
            $('.iboxlistarequerimientos').children('.ibox-content').toggleClass('sk-loading');
        }
        function _cargarDetalle_ComentariosxIdRequerimiento(idrequerimiento, _obj){
            let com;
            let comentarios = '';
            if (_obj.length === 0) {
                com = `<div class="chat-message right">
                        <div class="message">
                            <a class="message-author" href="#">
                                ERP escribió: 
                                        </a>
                            <span class="message-date">
                                ${ moment(new Date()).format('dddd MMM YYYY HH:MM:SS')}
                                        </span>
                            <span class="message-content">
                                No se encontro ningún mensaje para la muestra seleccionada.
                                        </span>
                        </div>
                    </div>`;
            } else {
                com = _obj.map((x) => {
                    return `<div class="chat-message left">
                            <div class="message">
                                <a class="message-author" href="#">
                                    ${x.Usuario_Area}
                                            </a>
                                <span class="message-date">
                                    ${moment(x.FechaRegistro).format('dddd DD MMMM YYYY HH:mm:ss')}
                                            </span>
                                <span class="message-content">
                                    ${x.Comentario}
                                            </span>
                            </div>
                        </div>`;
                }).join('');

                let objcomentario = _obj[0];
                
                comentarios = `<div class="ibox-title">
                                    <small class="pull-right text-muted">
                                        Last
                                        message: ${moment(objcomentario.FechaRegistro).format('dddd DD MMM YYYY HH:mm:ss')}
                                    </small>
                               </div>                
                                <div class="ibox-content">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div id="chat-discussion-comentario" class="chat-discussion">
                                                ${ com }
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            }

            

            $(".iboxcomentarioschatview").html(comentarios);
            $(".cargarcomentario").removeClass("hide");
        }

        function _agregar_comentario_tabComentario(){
            let hdnIdRequerimientoComentario = _("hdnIdRequerimientoComentario").value;
            let comentario = _("txtTabComentario_Comentario").value.trim();

            if (comentario === '') {
                _swal({ mensaje: 'Ingrese un comentario...!', estado: 'error' });
                return false;
            }

            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    IdRequerimiento: hdnIdRequerimientoComentario,
                    Comentario: comentario
                };
            let frm = new FormData();
            frm.append("RequerimientoComentarioJSON", JSON.stringify(parametro));

            _Post('Requerimiento/RequerimientoMuestra/SaveNewRequerimientoMuestraComentario_JSON', frm)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? JSON.parse(resultado) : {};
                    ovariables.ListaRequerimientoComentarios = (rpta.data !== '') ? CSVtoJSON(rpta.data, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                    _cargarDetalle_ComentariosxIdRequerimiento(hdnIdRequerimientoComentario, ovariables.ListaRequerimientoComentarios);
                    _('txtTabComentario_Comentario').value = '';

                    swal({ title: 'Buen Trabajo', text: rpta.mensaje, type: 'success' });
                }, (p) => { err(p); });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,        
            _nuevo_tabdetalle_subdetalle_muestra: _nuevo_tabdetalle_subdetalle_muestra,
            _eliminar_tabdetalle_detalle_muestra_new: _eliminar_tabdetalle_detalle_muestra_new,
            _grabar_tabdetalle_detalle_muestra_new: _grabar_tabdetalle_detalle_muestra_new,
            _cargar_programacion_y_adjuntos: _cargar_programacion_y_adjuntos,
            _cargar_tabcomentarios_comentarios: _cargar_tabcomentarios_comentarios,
            SaveDetalleRequerimientoDespacho_JSON: SaveDetalleRequerimientoDespacho_JSON,
            fn_save_actividadmuestra_from_confirmar_aprueba_rechaza_muestra: fn_save_actividadmuestra_from_confirmar_aprueba_rechaza_muestra,
            fn_llenar_tbl_archivos_seleccionados_from_modal: fn_llenar_tbl_archivos_seleccionados_from_modal
        }
    }
)(document, 'panelEncabezado_RequerimientoDetalleDDP');
(
    function ini() {
        app_RequerimientoDetalleDDP.load();
        app_RequerimientoDetalleDDP.req_ini();
    }
)();
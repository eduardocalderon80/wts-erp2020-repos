var appNewSDT = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial: '',
            accion: '',
            lstClienteTemporada: '',
            lstproveedor: '',
            idsolicituddesarrollotela: '',
            idproveedor: '',
            perfiles: [],
            solicituddesarrollotela: '',
            escomplemento_paracrear: '',
            opcion_seleccionado_paracomplemento: '',
            idproyecto: '', // Jacob
            lstproyectos: [],
            auxorden: 0,
            procesorutatela: []
            //JSONGuardar: [],
            
        }
        function load() {
            let par = _('txtpar_newsdt').value;
            if (!_isEmpty(par)) {
                ovariables.accion = _par(par, 'accion');
                ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
                ovariables.idsolicituddesarrollotela = $.trim(_par(par, 'idsolicituddesarrollotela'));
                _('hf_idsolicituddesarrollotela').value = $.trim(_par(par, 'idsolicituddesarrollotela'));
                ovariables.escomplemento_paracrear = _par(par, 'escomplemento_paracrear') === '' ? '0' : _par(par, 'escomplemento_paracrear');
                _('hf_idsolicituddesarrollotela_padre').value = _par(par, 'idsolicituddesarrollotela_telaprincipal');
                //// ESTOS PARAMETROS VIENEN LA VENTANA PREGUNTA ANTES DE CREAR NUEVO COMPLEMENTO
                _('hf_escomplemento').value = _par(par, 'escomplemento_paracrear') === '' ? '0' : _par(par, 'escomplemento_paracrear');
                _('hf_escomplemento_peroreferenciapadremuyantiguo').value = _par(par, 'escomplemento_peroreferenciapadremuyantiguo') === '' ? 0 : _par(par, 'escomplemento_peroreferenciapadremuyantiguo');
                ovariables.opcion_seleccionado_paracomplemento = _par(par, 'opcion_seleccionado_paracomplemento');
                _('hf_escomplemento_peroreferenciapadrehistorico').value = _par(par, 'escomplemento_peroreferenciapadrehistorico');
            }

            $('#div_grupofecharequerida .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                let fecha = e.target.value;
                $('#txtfecharequerida').val(fecha).datepicker('update');
            });

            $('#div_grupofecharequerimientocliente .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                let fecha = e.target.value;
                $('#txt_fecharequerimientocliente').val(fecha).datepicker('update');
            });

            _('txtCorrelativo').addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    buscaratx();
                }
            }, false);

            MostrarBtn(ovariables.accion)

            if (ovariables.accion === 'new') {
                _('hf_tieneatx').value = "1";
            }
            //// HABILITAR ESTO PARA SWATCH
            //else if (ovariables.accion === 'edit') {
            //    //// DESHABILITAR LOS CHECK DE TIPO DE PRODUCTO DE DESARROLLO
            //    let arr_chk_tipoproducto_desarrollo = Array.from(_('panelEncabezado_SDT').getElementsByClassName('_clschk_tipo_desarrollo'));
            //    arr_chk_tipoproducto_desarrollo.forEach(x => {
            //        x.disabled = true;
            //    });
            //}

            _('_title').innerText = 'SOLICITUD DESAROLLO #' + ovariables.idsolicituddesarrollotela;
            _('btnreturn_newsdt').addEventListener('click', returnIndex);
            _('btnBuscarAtx').addEventListener('click', buscaratx);
            _('btn_save_newsdt').addEventListener('click', save_new);
            _('btn_save_updatesdt').addEventListener('click', save_update);
            _('btnaddfabrica').addEventListener('click', addfabrica);
            _('btn_enviar_sdt').addEventListener('click', verificar_enviocorreo_fabrica);
            _('btn_save_leadtime').addEventListener('click', fn_save_leadtime_telaprincipal_complementos, false); // ANTES fn_save_leadtime
            //_('btnpdfatx').addEventListener('click', fn_imprimiratx);
            _('cbocliente').addEventListener('change', function (e) { let o = e.currentTarget; fn_cargartemporadaxcliente(o); }, false);

            //// VALIDAR SI SIRVE ESTE BOTON
            //_('btn_buscardesarrollotelapadre').addEventListener('click', fn_buscar_referenciacomplemento, false);

            _('btn_addfile').addEventListener('change', fn_change_addfile, false);
            _('link_ver_atx').addEventListener('click', fn_imprimiratx, false);
            _('btnnuevocomplemento').addEventListener('click', fn_nuevocomplemento, false);
            _('btn_cancelar_sdt').addEventListener('click', function (e) { let o = e.currentTarget; fn_cancelar_edicioncomplemento(o) }, false);
            _('btn_buscartela_y_buscartelaprincipal').addEventListener('click', fn_buscarcodigotela_o_buscartelaprincipal, false);

            let arrcollapse = Array.from(d.getElementsByClassName('collapse-link'));
            arrcollapse.forEach(x => x.addEventListener('click', e => { fn_colapsardivs(e) }));

            //// PARA LOS CHECKBOX - I-CHECKS
            $("#divcomparacion .i-checks._clscheck_criterio_cabecera").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), estado = dom.checked;
                seleccionar_all_chk_criterio(estado);
            });

            $("#chk_correo_consignacion").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            })

            $("#chk_requiereanalisis").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                if (e.currentTarget.checked === true) {
                    _('txta_comentario_analisis_laboratorio').disabled = false;
                    _('cbotipoprueba').value = 0;
                    _('cbotipoprueba').disabled = false;
                } else {
                    _('txta_comentario_analisis_laboratorio').disabled = true;
                    _('cbotipoprueba').value = 0;
                    _('cbotipoprueba').disabled = true;
                }
            });

            $("#divATX ._clscheck_conatx").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                const dom = e.currentTarget, estado = dom.checked;
                change_conatx(estado);
            });

            $("#divrbmuestrafisica ._clschk_muestrafisica").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            //// HABILITAR ESTO PARA SWATCH
            //$("#panelEncabezado_SDT ._clschk_tipo_desarrollo").iCheck({
            //    checkboxClass: 'icheckbox_square-green',
            //    radioClass: 'iradio_square-green'
            //}).on("ifChanged", function (e) {
            //    let dom = e.currentTarget;
            //    if (dom.checked) {
            //        fn_setear_valores_segun_tipo_producto_a_desarrollar(dom.value);
            //    }
            //});

            $("#tbody_quienasumedesarrollo ._cls_chk_quienasume").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            if (ovariables.escomplemento_paracrear === '1') {
                let arr_tab = Array.from(_('tab_principal').getElementsByClassName('cls_tab_principal')),
                    arr_div_nuevocomplementos = Array.from(_('tab_principal').getElementsByClassName('cls_nuevo_complemento'));

                //_('div_chk_contela').classList.remove('hide');
                arr_tab.forEach((x, index) => {
                    if (index > 0) {
                        x.classList.add('hide');
                    }
                });

                arr_div_nuevocomplementos.forEach(x => {
                    x.classList.add('hide');
                });

                _('div_grupo_cantidadcomplementos').classList.add('hide');
                _('div_grupo_total_registro_complementos').classList.add('hide');
                _('tab_a_solicitante').innerText = "Complemento";

                if (ovariables.opcion_seleccionado_paracomplemento === 'contelaprincipal_historico') {
                    _('tab_principal').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.remove('hide')
                    _('lbl_codigotela_o_codigotelaprincipal').innerText = "Nombre Tela Cliente Historico";
                } else if (ovariables.opcion_seleccionado_paracomplemento === 'concodigotela') {
                    _('tab_principal').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.remove('hide')
                    _('lbl_codigotela_o_codigotelaprincipal').innerText = "Código Tela";
                }
            }

            _('btnNewColor').addEventListener('click', fn_NewColor); // Jacob
            _('btnBuscarPry').addEventListener('click', fn_BuscarPry); // Jacob
        }

        function setear_default_ini_edit_cuandoescomplemento(obj_sdt) {
            if (obj_sdt.escomplemento === 1) {
                let arr_tab = Array.from(_('tab_principal').getElementsByClassName('cls_tab_principal'));

                if (_parseInt(obj_sdt.idsolicituddesarrollotela_padre) > 0) {
                    _('_title').innerText = `Solicitud Desarrollo Tela #${obj_sdt.idsolicituddesarrollotela_padre}`;
                    _('tab_a_solicitante').innerText = `Complemento ${obj_sdt.isolicituddesarrollotela}`;
                    _('btn_cancelar_sdt').classList.remove('hide');
                } else {
                    _('_title').innerText = `Solicitud Desarrollo Tela #${obj_sdt.isolicituddesarrollotela}`;
                    _('tab_a_solicitante').innerText = `Complemento ${obj_sdt.isolicituddesarrollotela}`;
                    _('btn_cancelar_sdt').classList.add('hide');
                }

                //arr_tab.forEach((x, index) => {
                //    if (index > 0) {
                //        x.classList.add('hide');
                //    }
                //});

                _('tab_principal').getElementsByClassName('cls_tabli_complementos')[0].classList.add('hide');

                _('div_grupo_cantidadcomplementos').classList.add('hide');
                _('div_grupo_total_registro_complementos').classList.add('hide');
            }

        }

        function fn_nuevocomplemento() {
            if (_parseInt(appNewSDT.ovariables.idsolicituddesarrollotela) > 0) {
                // CAMBIAR A VENTANA COMPLEMENTO
                let urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT', idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value;
                _Go_Url(urlAccion, urlAccion, `accion:new,idgrupocomercial:${ovariables.idgrupocomercial},idsolicituddesarrollotela_telaprincipal:${idsolicituddesarrollotela},escomplemento_paracrear:1`);
            } else {
                _modalBody({
                    url: 'DesarrolloTextil/SolicitudDesarrolloTela/_PreguntarAntesCrearNuevoComplemento',
                    ventana: '_PreguntarAntesCrearNuevoComplemento',
                    titulo: 'Complementos',
                    parametro: '',
                    ancho: '',
                    alto: '',
                    responsive: 'modal-lg'
                });
            }

        }

        function fn_buscarcodigotela_o_buscartelaprincipal() {
            if (ovariables.opcion_seleccionado_paracomplemento === 'contelaprincipal_historico') {
                let codigotelacliente = _('txtnombretelacliente_telaprincipal').value;

                _modalBody({
                    url: 'DesarrolloTextil/SolicitudDesarrolloTela/_BuscarDesarrolloReferenciaComplemento',
                    ventana: '_BuscarDesarrollo',
                    titulo: 'Buscar Tela Principal Histórico',
                    parametro: 'codigotelacliente:' + codigotelacliente,
                    ancho: '',
                    alto: '',
                    responsive: 'modal-lg'
                });
            } else if (ovariables.opcion_seleccionado_paracomplemento === 'concodigotela') {
                fn_buscaratx();
            }
        }

        function fn_buscaratx() {
            _modalBody({
                url: 'DesarrolloTextil/SolicitudDesarrolloTela/_BuscarAtx',
                ventana: '_BuscarAtx',
                titulo: 'Buscar Código de Tela',
                parametro: ``,
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function fn_change_addfile(e) {
            let files = Array.from(e.currentTarget.files), html = '', fila = null, tblbody = _('tbody_addfile'),
                inputfile = null, pasavalidacion = true, mensaje = '', arrrows = Array.from(tblbody.rows), lstfiles_tbl = [];

            arrrows.forEach(x => {
                if (x.classList.value.indexOf('hide') < 0) {  // las filas solo visibles
                    let file = x.getElementsByClassName('cls_nombrefile')[0].innerText.trim(), obj = { file: file };
                    lstfiles_tbl.push(obj);
                }
            });

            // VALIDAR SI EXISTE ARCHIVO
            files.forEach(x => {
                let filter = lstfiles_tbl.filter(f => f.file === x.name);
                if (filter.length > 0) {
                    pasavalidacion = false;
                    mensaje += 'El ' + x.name + ' archivo ya existe en la lista. \n';
                }
            });

            if (mensaje !== '') {
                _swal({
                    estado: 'error',
                    mensaje: mensaje,
                    titulo: 'Message'
                });
                return false;
            }

            files.forEach((x, i) => {
                fila = null;
                if (i === 0) {
                    inputfile = _('btn_addfile').cloneNode(true);
                    inputfile.classList.add('cls_tbl_addfile_file');
                    inputfile.classList.add('hide');
                }

                html = `
                    <tr data-par='accion:new,idsolicituddesarrollotelaarchivos:0' data-estado='edit'>
                        <td class='text-center cls_td_addfile_botones' style='vertical-align: middle;'>
                            <button class ='btn btn-xs btn-danger cls_delete_addfile'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td class='text-center cls_nombrefile' style='vertical-align: middle;'>${x.name}</td>
                        <td><textarea class='cls_txta_comentario form-control' style='resize:none;'></textarea></td>
                    </tr>
                `;
                tblbody.insertAdjacentHTML('beforeend', html);
                fila = tblbody.rows.length - 1;
                if (fila !== null) {
                    handler_tbladdfile_add(fila);
                }
            });
            fila = null;
            fila = tblbody.rows.length - 1;
            if (fila !== null) {
                if (inputfile !== null) {
                    let td = tblbody.rows[fila].getElementsByClassName('cls_td_addfile_botones')[0];
                    td.appendChild(inputfile);
                }
            }
        }

        function handler_tbladdfile_add(fila) {
            let tblbody = _('tbody_addfile');
            tblbody.rows[fila].getElementsByClassName('cls_delete_addfile')[0].addEventListener('click', e => { fn_delete_addfile_file(e); });
        }

        function fn_delete_addfile_file(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            if (fila !== null) {
                fila.classList.add('hide');
                fila.setAttribute('data-estado', 'delete');
            }
        }

        //function fn_change_chkescomplemento(estado) {
        //    if (estado) {
        //        _('div_grupo_telacuerpo_referencia').classList.remove('hide');
        //        _('div_noexistedesarrollotela').classList.remove('hide');
        //    } else {
        //        _('div_grupo_telacuerpo_referencia').classList.add('hide');
        //        _('div_noexistedesarrollotela').classList.add('hide');
        //    }
        //}

        //function fn_change_chknoexistebddesarrollotela(estado) {
        //    if (estado) {
        //        _('txtnombretelacliente_cuandonohaydesarrollo').disabled = false;
        //        _('txtnombretelacliente').value = '';
        //        _('hf_idsolicituddesarrollotela_padre').value = '';
        //    } else {
        //        _('txtnombretelacliente_cuandonohaydesarrollo').disabled = true;
        //        _('txtnombretelacliente_cuandonohaydesarrollo').value = '';
        //    }
        //}

        //function fn_buscar_referenciacomplemento() {
        //    let codigotelacliente = _('txtnombretelacliente').value;

        //    _modalBody({
        //        url: 'DesarrolloTextil/SolicitudDesarrolloTela/_BuscarDesarrolloReferenciaComplemento',
        //        ventana: '_BuscarDesarrollo',
        //        titulo: 'Search',
        //        parametro: 'codigotelacliente:' + codigotelacliente,
        //        ancho: '',
        //        alto: '',
        //        responsive: 'modal-lg'
        //    });
        //}

        function fn_cargartemporadaxcliente(o, idclientetemporada) {
            let cbocliente = o; //event.target;

            let isSelect = cbocliente.value.trim().length > 0;
            if (isSelect) {
                // :aby
                let par = { idcliente: cbocliente.value };
                let url = 'DesarrolloTextil/SolicitudDesarrolloTela/GetDataProveedorxCliente?par=' + JSON.stringify(par);
                Get(url, function (rpta) {
                    if (!_isEmpty(rpta))
                        _('cbocliente_temporada').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta);

                    if (idclientetemporada !== undefined) {
                        _('cbocliente_temporada').value = idclientetemporada;
                    }
                });
            } else {
                _('cbocliente_temporada').innerHTML = '';
            }
        }

        function seleccionar_all_chk_criterio(estado) {
            let tbody = _('tblbodychk'), arr_rows = Array.from(tbody.rows);

            arr_rows.forEach(x => {
                let chk = x.getElementsByClassName('_clscheck_criterio')[0];
                chk.checked = estado;
                if (estado === true) {
                    chk.parentNode.classList.add('checked');
                } else {
                    chk.parentNode.classList.remove('checked');
                }
            });
        }


        function fn_imprimiratx() {
            let idatx = _('hf_idanalisistextil').value;
            if (idatx !== "") {
                let parametro = `idatx:${idatx}`,
                    url = urlBase() + 'DesarrolloTextil/Atx/AnalisisTextilImprimir?par=' + parametro;
                window.open(url);
            } else {
                _swal({ mensaje: "Ingrese un ATX", estado: "error" });
            }
        }

        function mostrardatosproveedor() {
            _('divFabrica').classList.add('hide');
            _('txtanio').disabled = true;
            _('txtCorrelativo').disabled = true;
            _('txtnombretela').disabled = true;
            //_('txtfecharequerida').disabled = true;
            //_('txtcolor').disabled = true;
            _('txtcomplemento').disabled = true;
            _('txta_comentario').disabled = true;
            _('txtCorrelativo').disabled = true;
            _('txtacabados_especiales').disabled = true;
            _('txta_requerimientos_del_cliente').disabled = true;
            _('txta_recomendaciones_tecnicas').disabled = true;
            _('txta_instruccionescuidado').disabled = true;
            _('cbocliente_temporada').disabled = true;

            $('#div_groupdate > .form-control').prop('disabled', true);
            $('#div_groupdate').datepicker('remove');

            $(".rbmuestrafisica").prop("disabled", true);
            _('btn_save_updatesdt').classList.add('hide');
            _('btn_enviar_sdt').classList.add('hide');

            $('#divcomparacion > .form-control').prop('disabled', true);

            for (let i = 0; i < document.getElementsByClassName('clstblchkdescripcion').length; i++) {
                document.getElementsByClassName('clstblchkdescripcion')[i].disabled = true;
            }

            _('cbocliente').disabled = true

            _('txta_comentario_analisis_laboratorio').disabled = true;
            _('cbotipoprueba').disabled = true;
            _('chk_requiereanalisis').disabled = true;
        }

        function fn_colapsardivs(e) {
            let o = e.currentTarget;
            let divpadre = o.parentNode.parentNode.parentNode, divcontent = divpadre.getElementsByClassName('ibox-content')[0], spntools = o.getElementsByClassName('icono_collapse')[0];
            let estaoculto = divcontent.classList.value.indexOf('hide');
            if (estaoculto < 0) {
                divcontent.classList.add('hide');
                spntools.classList.remove('fa-chevron-up');
                spntools.classList.add('fa-chevron-down');
            } else {
                divcontent.classList.remove('hide');
                spntools.classList.remove('fa-chevron-down');
                spntools.classList.add('fa-chevron-up');
            }
        }

        function MostrarBtn(accion) {
            switch (accion) {
                case 'new':
                    _('btn_save_updatesdt').classList.add('hide');
                    _('btn_save_leadtime').classList.add('hide');
                    _('btn_enviar_sdt').classList.add('hide');
                    break;
                case 'edit':
                    _('btn_save_newsdt').classList.add('hide');
                    _('btn_save_updatesdt').classList.remove('hide');
                    //_('btn_save_leadtime').classList.remove('hide');
                    _('btn_save_leadtime').classList.add('hide');
                    _('btn_enviar_sdt').classList.remove('hide');
                    break;
            }
        }

        function validarantesenviar() {
            let arrfilas = Array.from(_('tblbodyfabrica').rows), totalfilas = arrfilas.length, existefabrica = true, pasavalidacion = true, contadorfaltaenviar = 0, mensaje = '', obj = {};

            if (totalfilas === 0) {
                mensaje = '- Debe registrar al menos una fabrica \n';
                existefabrica = false;
                pasavalidacion = false;
            }

            if (existefabrica) {
                arrfilas.forEach((x, indice) => {
                    let par = x.getAttribute('data-par'), estado = _par(par, 'estado'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'),
                        existen_proveedores_singrabar = false;
                    if (idsolicituddetalledesarrollotela === '' || idsolicituddetalledesarrollotela === '0') {
                        existen_proveedores_singrabar = true;
                        let nombre_proveedor = x.getElementsByClassName('cls_td_proveedor')[0].innerText;
                        mensaje += `- Falta grabar el proveedor ${nombre_proveedor} recien ingresado. \n`;
                        pasavalidacion = false;
                    }

                    if (estado === "" || estado === "CRE" || estado === "REC") {
                        contadorfaltaenviar++
                    }
                });

                if (contadorfaltaenviar === 0) {
                    mensaje += '- NO existen fabricas pendientes de enviar aprobación \n';
                    pasavalidacion = false;
                }
            }


            let idcliente_datosnuevodesarrollo = _('cbocliente').value.trim();
            if (idcliente_datosnuevodesarrollo === '') {
                mensaje += '- Seleccione Cliente de Desarrollo \n';
                pasavalidacion = false;
            }


            obj.mensaje = mensaje;
            obj.pasavalidacion = pasavalidacion;

            return obj;
        }


        function fn_enviar() {
            let mensaje = '';
            let validar = validarantesenviar();

            if (validar.pasavalidacion == true) {
                let enviar = () => {
                    let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value,
                        par = { idsolicituddesarrollotela: idsolicituddesarrollotela },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(par));
                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/Enviar', frm)
                        .then((odata) => {
                            let rpta = odata !== '' ? JSON.parse(odata) : null;

                            _swal({ mensaje: rpta.mensaje, estado: rpta.estado });

                            if (rpta.estado === "success") {
                                parametro = `idsolicituddesarrollotela:${idsolicituddesarrollotela},accion:edit`,
                                    url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                                _Go_Url(url, url, parametro);
                            }
                        }, (p) => {
                            err(p);
                        });
                }
                swal({
                    title: "¿Estás seguro de enviar la solicitud para la aprobación?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"

                }, function (rpta) {
                    if (rpta) {
                        enviar()
                    }
                    return;
                });
            } else {
                mensaje += validar.mensaje;
            }

            if (mensaje.length > 0) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }
        }


        function buscaratx() {
            LimpiarCampos()
            let anio = _('txtanio').value, contador = _('txtCorrelativo').value, parametro = { anio: anio, contador: contador }, mensaje = "";

            if (anio === "" || contador === "") {
                mensaje = "Debe ingresar el año y correlativo del ATX"
                _swal({ mensaje: mensaje, estado: 'error' });
                return false;
            }

            urlaccion = 'DesarrolloTextil/SolicitudDesarrolloTela/Getdataatx?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((odata) => {
                    LLenarSolicitud(odata);
                }, (p) => {
                    err(p);
                });
        }

        function LLenarSolicitud(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {
                let rpta_mensaje_se_encontro_atx = rpta[0].respuesta_validacion_existeatx;

                if (rpta_mensaje_se_encontro_atx !== '') {
                    _swal({ mensaje: rpta_mensaje_se_encontro_atx, estado: 'error' });
                    return false;
                }

                atx = rpta[0].atx !== '' ? JSON.parse(rpta[0].atx) : null;
                if (atx !== null) {
                    _('txtestructura').value = atx[0].familia;
                    _('txtcomposicion').value = atx[0].contenido;
                    _('txttitulo').value = atx[0].titulo;
                    _('txtdensidad').value = atx[0].densidad;
                    _('hf_idanalisistextil').value = atx[0].idanalisistextil;
                    _('hf_idsolicitud').value = atx[0].idsolicitud;
                    _('link_ver_atx').innerText = atx[0].codigo;

                    appNewSDT.ovariables.lstClienteTemporada = rpta[0].clientetemporada;
                    comboclientetemporada()
                } else {
                    let mensaje = 'No existe el ATX';
                    _swal({ mensaje: mensaje, estado: 'error' });
                }
            }
        }

        function comboclientetemporada() {
            let lst = appNewSDT.ovariables.lstClienteTemporada;
            _('cbocliente_temporada').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(lst);
        }

        function comboproveedor() {
            let lst = appNewSDT.ovariables.lstproveedor, filas = lst.length, html = '';
            for (var i = 0; i < filas; i++) {
                html += `<option data-value="${lst[i].idproveedor}" value="${lst[i].nombreproveedor}"></option>`
            }
            _('listproveedor').innerHTML = html;
        }

        function addfabrica() {
            let proveedor = _('txtfabrica').value;
            if (proveedor !== "") {
                let dl = _('listproveedor'), id = dl.options[dl.selectedIndex];
                let idproveedor = document.querySelector("#listproveedor option[value='" + proveedor + "']").dataset.value,
                    tbody = _('divtblfabrica').getElementsByClassName('clstblbodyfabrica')[0],
                    arrfilas = Array.from(tbody.rows);

                let fn_validar_siexiste_proveedor = (id, arrfilas) => {
                    let existe = false, mensaje = '';
                    arrfilas.some(x => {
                        let par = x.getAttribute('data-par'), idproveedor = _par(par, 'idproveedor');
                        if (idproveedor === id) {
                            existe = true;
                            mensaje = 'Ya se agregó!';
                            return true;
                        }
                    });
                    if (mensaje !== '') {
                        _swal({ mensaje: mensaje, estado: 'error' });
                    }
                    return existe;
                }

                if (!fn_validar_siexiste_proveedor(idproveedor, arrfilas)) {
                    let html = `<tr data-par='idproveedor:${idproveedor},idsolicituddetalledesarrollotela:0,estado:CRE'>
                                <td class="text-center">
                                    <button class='btn btn-xs btn-danger cls_btn_deleteproveedor'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td class='cls_td_proveedor'>${proveedor}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                    `;
                    tbody.insertAdjacentHTML('beforeend', html);
                    let indiceadd = tbody.rows.length - 1

                    setear_cargar_datos_tblproveedor_add();
                    handler_tblproveedor_add(indiceadd);
                }

                // Jacob - Es Desarrollo WTS
                //if (_parseInt(idproveedor) === 5) { 
                //    fn_AgregarProyecto();
                //}
            } else {
                let mensaje = 'Debe seleccionar un proveedor';
                _swal({ mensaje: mensaje, estado: 'error' });
            }
            _('txtfabrica').value = '';
        }

        function handler_tblproveedor_add(indicefila) {
            let tbody = _('divtblfabrica').getElementsByClassName('clstblbodyfabrica')[0];
            let btn = tbody.rows[indicefila].getElementsByClassName('cls_btn_deleteproveedor')[0];
            btn.addEventListener('click', fn_delete_proveedor, false);
        }

        function fn_delete_proveedor(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
            setear_cargar_datos_tblproveedor_add();
            // Jacob - Se elimina proyecto si es Desarrollo WTS
            //let attr = fila.getAttribute('data-par');
            //let idproveedor = _par(attr, 'idproveedor');
            //if (_parseInt(idproveedor) === 5) {
            //    _('div_proyecto') !== null ? _('div_proyecto').remove() : null;
            //    ovariables.idproyecto = '';
            //}
        }

        function validarantesguardar() {
            let tbl = _('tblbodychk'), arr_rows_criterio = Array.from(tbl.rows), pasavalidacion = true,
                mensaje = '', contador = 0, chkcomparacion = _('divcomparacion').querySelector('._cls_criterio_cabecera').checked,
                arr_filas_fabricas = Array.from(_('tblbodyfabrica').rows), totalfabricas = arr_filas_fabricas.length,
                valor_chk_conatx = _('chk_conatx').checked, arr_criterios = _('tblbodychk').querySelectorAll('.checked'),
                total_criterios_seleccionados = arr_criterios.length, haycriterios_seleccionados = true;

            
            if (valor_chk_conatx) {
                if (total_criterios_seleccionados <= 0) {
                    mensaje += '- Falta seleccionar al menos un criterio de comparación ' + '\n';
                    pasavalidacion = false;
                    haycriterios_seleccionados = false;
                }

                if (haycriterios_seleccionados) {
                    arr_rows_criterio.forEach(x => {
                        let chk = x.getElementsByClassName('_clscheck_criterio')[0];
                        let datapar = x.getAttribute('data-par');
                        let nombrecriterio = _par(datapar, 'nombrecriterio');

                        if (chk.checked === true) {
                            contador++;
                            let desc = x.getElementsByClassName('clstblchkdescripcion')[0].value;
                            if (desc.trim().length === 0) {
                                mensaje += '- Debe agregar una descripcion en el criterio ' + nombrecriterio + '\n';
                                pasavalidacion = false;
                            }
                        }
                    });
                }
            } else {
                //// SI NO TIENE ATX; Y SI HAY SELECCIONADOS OBLIGAR A PONER COMENTARIOS
                arr_rows_criterio.forEach(x => {
                    let chk = x.getElementsByClassName('_clscheck_criterio')[0];
                    let datapar = x.getAttribute('data-par');
                    let nombrecriterio = _par(datapar, 'nombrecriterio');

                    if (chk.checked === true) {
                        contador++;
                        let desc = x.getElementsByClassName('clstblchkdescripcion')[0].value;
                        if (desc.trim().length === 0) {
                            mensaje += '- Debe agregar una descripcion en el criterio ' + nombrecriterio + '\n';
                            pasavalidacion = false;
                        }
                    }
                });
            }

            let hf_referenciadesarrollotela_padre = _('hf_idsolicituddesarrollotela_padre'),
                div_grupo_nombretelaclientepadre = _('div_grupo_nombretelacliente_padre_referencia'),
                txtnombretelacliente_telaprincipal = _('txtnombretelacliente_telaprincipal');

            div_grupo_nombretelaclientepadre.classList.remove('has-error');

            //// VALIDAR TABLA DE FABRICAS
            if (totalfabricas <= 0) {
                mensaje += '- Falta agregar la fabrica. \n';
                pasavalidacion = false;
            }

            if (ovariables.escomplemento_paracrear === '1') {
                if (ovariables.opcion_seleccionado_paracomplemento === 'contelaprincipal_historico') {
                    if (hf_referenciadesarrollotela_padre.value === "") {
                        div_grupo_nombretelaclientepadre.classList.add('has-error');
                        mensaje += '- Falta seleccionar o agregar la referencia de desarrollo padre del complemento. \n';
                        pasavalidacion = false;
                    }
                } else if (ovariables.opcion_seleccionado_paracomplemento === 'concodigotela') {
                    if (txtnombretelacliente_telaprincipal.value === '') {
                        div_grupo_nombretelaclientepadre.classList.add('has-error');
                        mensaje += '- Falta seleccionar el codigo de la tela. \n';
                        pasavalidacion = false;
                    }
                }
            }

            if (mensaje.length > 0) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }
            return pasavalidacion;
        }

        function GetChkSelected(clasechk) {
            let divprincipal = _('div_cuerpoprincipal'), chk = divprincipal.getElementsByClassName(clasechk)[0];

            return chk.checked;
        }

        function getchkbox() {
            let tbl = _('tblbodychk'), total = tbl.rows.length, valorseleccionado = 0, arr = [],
                arr_rows = Array.from(tbl.rows);

            arr_rows.forEach(x => {
                let datapar = x.getAttribute('data-par'), chk = x.getElementsByClassName('_clscheck_criterio')[0],
                    comentario_para_criterio = x.getElementsByClassName('clstblchkdescripcion')[0].value, idvalorestado = _par(datapar, 'idvalorestado');
                if (chk.checked === true) {
                    obj = {
                        campo: idvalorestado,
                        descripcion: comentario_para_criterio
                    }

                    arr.push(obj);
                }
            });
            return arr;
        }

        function getarray_addfile() {
            let tbody = _('tbody_addfile'), arr_rows = Array.from(tbody.rows), arr = [];
            arr_rows.forEach((x) => {
                let datapar = x.getAttribute('data-par'), idsolicituddesarrollotelaarchivos = _par(datapar, 'idsolicituddesarrollotelaarchivos'),
                    dataestado = x.getAttribute('data-estado'), nombreoriginal = x.getElementsByClassName('cls_nombrefile')[0].innerText.trim(),
                    comentario = x.getElementsByClassName('cls_txta_comentario')[0].value;

                let obj = { idsolicituddesarrollotelaarchivos: idsolicituddesarrollotelaarchivos, nombrearchivooriginal: nombreoriginal, comentario: comentario, estado: dataestado };
                arr.push(obj);
            });

            return arr;
        }

        function save_new() {
            let req_enty = _required({ clase: '_enty', id: 'panelEncabezado_SDT' });
            if (req_enty && validarantesguardar()) {
                let save = () => {
                    let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_SDT' }), arraddfile = getarray_addfile();
                    let frm = new FormData();
                    parhead['incluyemuestrafisica'] = getmuestrafisica();
                    parhead['fechaestado'] = _convertDate_ANSI(_('txtfecharequerida').value);
                    parhead['idgrupopersonal'] = appNewSDT.ovariables.idgrupocomercial;
                    parhead['enviarcorreo'] = _('chk_correo_consignacion').checked == true ? "1" : "0";
                    parhead['requiereanalisis'] = _('chk_requiereanalisis').checked == true ? "1" : "0";
                    parhead['estado_desarrolloasumefabrica'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumefabrica')[0].checked ? 1 : 0;
                    parhead['estado_desarrolloasumewts'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumewts')[0].checked ? 1 : 0;
                    parhead['estado_desarrolloasumecliente'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumecliente')[0].checked ? 1 : 0;
                    parhead['idproyecto'] = ovariables.idproyecto; // Jacob
                    parhead['json_color'] = get_array_color_para_grabar(); //ovariables.JSONGuardar; // Jacob
                    //// HABILITAR ESTO PARA SWATCH
                    //parhead["tipo_producto_a_desarrollar"] = fn_gettipoproducto_a_desarrollar();

                    frm.append('par', JSON.stringify(parhead));
                    frm.append('pardetalle', JSON.stringify(getfabrica()));
                    frm.append('parsubdetail', JSON.stringify(getchkbox()));
                    frm.append('parfoot', JSON.stringify(arraddfile));

                    //// PASAR LOS ARCHIVOS
                    let tblbody_addfile = _('tbody_addfile'), arrrows_addfile = Array.from(tblbody_addfile.rows), contador = 0;
                    arrrows_addfile.forEach(x => {
                        if (x.classList.value.indexOf('hide') < 0) {
                            let inputfile = x.getElementsByClassName('cls_tbl_addfile_file')[0], arrfiles = inputfile !== undefined ? Array.from(inputfile.files) : null;
                            if (arrfiles !== null) {
                                arrfiles.forEach(f => {
                                    contador++;
                                    frm.append('fileaddfile' + contador, f);
                                });
                            }
                        }
                    });

                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/Save_New', frm)
                        .then((odata) => {
                            let rpta = odata !== '' ? JSON.parse(odata) : null;
                            _swal({ mensaje: rpta.mensaje, estado: rpta.estado });
                            if (rpta.estado === "success") {
                                parametro = `idsolicituddesarrollotela:${rpta.id},accion:edit`,
                                    url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                                _Go_Url(url, url, parametro);
                            }
                        }, (p) => {
                            err(p);
                        });
                }

                swal({
                    title: "¿Estás seguro de guardar la solicitud?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"

                }, function (rpta) {
                    if (rpta) {
                        save()
                    }
                    return;
                });

            }
        }

        function fn_update() {
            let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_SDT' }), frm = new FormData(), estadoretornar = false,
                arraddfile = getarray_addfile();
            //arraddfile = getarray_addfile('edit'), arraddfile_delete = getarray_addfile('delete');

            parhead['incluyemuestrafisica'] = getmuestrafisica();
            parhead['fechaestado'] = _convertDate_ANSI(_('txtfecharequerida').value);
            parhead['enviarcorreo'] = _('chk_correo_consignacion').checked == true ? "1" : "0";
            parhead['requiereanalisis'] = _('chk_requiereanalisis').checked == true ? "1" : "0";
            parhead['estado_desarrolloasumefabrica'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumefabrica')[0].checked ? 1 : 0;
            parhead['estado_desarrolloasumewts'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumewts')[0].checked ? 1 : 0;
            parhead['estado_desarrolloasumecliente'] = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumecliente')[0].checked ? 1 : 0;

            parhead['idproyecto'] = ovariables.idproyecto; // Jacob
            parhead['json_color'] = get_array_color_para_grabar(); //ovariables.JSONGuardar; // Jacob
            parhead['idgrupopersonal'] = appNewSDT.ovariables.idgrupocomercial; // Jacob

            frm.append('par', JSON.stringify(parhead));
            frm.append('pardetalle', JSON.stringify(getfabrica()));
            frm.append('parsubdetail', JSON.stringify(getchkbox()));
            frm.append('parfoot', JSON.stringify(arraddfile));

            //// PASAR LOS ARCHIVOS
            let tblbody_addfile = _('tbody_addfile'), arrrows_addfile = Array.from(tblbody_addfile.rows), contador = 0;
            arrrows_addfile.forEach(x => {
                if (x.classList.value.indexOf('hide') < 0) {
                    let inputfile = x.getElementsByClassName('cls_tbl_addfile_file')[0], arrfiles = inputfile !== undefined ? Array.from(inputfile.files) : null;
                    if (arrfiles !== null) {
                        arrfiles.forEach(f => {
                            contador++;
                            frm.append('fileaddfile' + contador, f);
                        });
                    }
                }
            });

            _Post('DesarrolloTextil/SolicitudDesarrolloTela/Save_Update', frm)
                .then((odata) => {
                    let rpta = odata !== '' ? JSON.parse(odata) : null;
                    _swal({
                        mensaje: rpta.mensaje, estado: rpta.estado
                    });
                    if (rpta.estado === "success") {
                        //_('hf_idsolicituddesarrollotela').value = rpta.id;
                        estadoretornar = true;
                        parametro = `idsolicituddesarrollotela:${rpta.id},accion:edit`,
                            url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                        _Go_Url(url, url, parametro);
                    }
                }, (p) => {
                    err(p);
                });
            return estadoretornar;
        }

        function save_update() {
            let req_enty = _required({ clase: '_enty', id: 'panelEncabezado_SDT' });
            if (req_enty && validarantesguardar()) {
                let update = () => {
                    fn_update()
                }
                swal({
                    title: "¿Estás seguro de actualizar la solicitud?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"

                }, function (rpta) {
                    if (rpta) {
                        update()
                    }
                    return;
                });
            }
        }

        function getfabrica() {
            let tbl = _('tblbodyfabrica'), totalFilas = tbl.rows.length, arr = [];
            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), idproveedor = _par(par, 'idproveedor'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'),
                    obj = {
                        idproveedor: idproveedor,
                        idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela
                    }
                arr[i] = obj;
            }
            return arr;
        }

        function getmuestrafisica() {
            let arr = Array.from(_('divrbmuestrafisica').getElementsByClassName('rbmuestrafisica')), valorseleccionado = null;
            arr.some(x => {
                if (x.checked) {
                    valorseleccionado = x.value;
                }
            });
            return valorseleccionado;
        }

        function LimpiarCampos() {
            _('txtestructura').value = '',
                _('txtcomposicion').value = '',
                _('txttitulo').value = '',
                _('txtdensidad').value = '',
                _('hf_idanalisistextil').value = '',
                //_('hf_idcliente').value = '',
                _('hf_idsolicitud').value = '',
                //_('txtcliente').value = '',
                _('cbocliente_temporada').innerHTML = '';
        }

        function returnIndex() {
            _ruteo_masgeneral('DesarrolloTextil/SolicitudDesarrolloTela/IndexSDT')
                .then((rpta) => {
                    // nada
                }).catch(function (e) {
                    console.log(e);
                });
        }

        function req_ini() {
            let accion = ovariables.accion, urlaccion = '', parametro = {};
            switch (accion) {
                case 'new':
                    let idsolicituddesarrollotela_telaprincipal = _('hf_idsolicituddesarrollotela_padre').value, escomplemento_paracrear = ovariables.escomplemento_paracrear;
                    parametro = {
                        idgrupocomercial: appNewSDT.ovariables.idgrupocomercial,
                        escomplemento_paracrear: escomplemento_paracrear,
                        idsolicituddesarrollotela_telaprincipal: idsolicituddesarrollotela_telaprincipal
                    }, urlaccion = 'DesarrolloTextil/SolicitudDesarrolloTela/GetDataNew?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_ini);
                    break;
                case 'edit':
                    parametro = {
                        idsolicituddesarrollotela: appNewSDT.ovariables.idsolicituddesarrollotela
                    };
                    urlaccion = 'DesarrolloTextil/SolicitudDesarrolloTela/GetDataforedit?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_ini_edit);
                    break;
                default:
            }
        }

        function res_ini(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {
                appNewSDT.ovariables.lstproveedor = CSVtoJSON(rpta[0].proveedor);
                ovariables.perfiles = rpta[0].perfil_usuario.split('¬');
                comboproveedor();
                //fn_AgregarProyecto(); // Jacob
                llenar_tabla_criterio_new(CSVtoJSON(rpta[0].check));
                _('cbocliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientes);
                let pruebalaboratorio = CSVtoJSON("idprueba¬prueba^" + rpta[0].paquetepruebalaboratorio);
                let cbotipoprueba = `<option value='0'>Seleccione...</option>`;

                pruebalaboratorio.forEach(x => {
                    cbotipoprueba += `<option value='${x.idprueba}'>${x.prueba}</option>`;
                });

                _('cbotipoprueba').innerHTML = cbotipoprueba;

                if (rpta[0].telaprincipal !== '') {
                    let datos_telaprincipal = rpta[0].telaprincipal !== '' ? CSVtoJSON(rpta[0].telaprincipal) : null;
                    if (datos_telaprincipal !== null) {
                        _('txtnombretela').value = datos_telaprincipal[0].nombretela;
                        _('cbocliente').value = datos_telaprincipal[0].idcliente;
                        appNewSDT.ovariables.lstClienteTemporada = rpta[0].clientetemporada;
                        comboclientetemporada()
                        _('cbocliente_temporada').value = datos_telaprincipal[0].idclientetemporada;
                        $('#txtfecharequerida').val(datos_telaprincipal[0].fecharequerida).datepicker('update');
                    }
                }

                //// POR EL MOMENTO NO VA
                //setear_default_res_ini(ovariables.accion);
            }
        }

        function llenar_tabla_criterio_new(data) {
            let filas = data.length, html = '', tbody = _('tblbodychk');

            data.forEach(x => {
                html += `
                        <tr data-par='idvalorestado:${x.valor},nombrecriterio:${x.nombre}'>
                            <td>
                                <label>
                                    <div class ='icheckbox_square-green _clsdiv_chk_criterio' style='position: relative;'>
                                        <input type='checkbox' class ='i-checks _clscheck_criterio _cls_criterio' style='position: absolute; opacity: 0;' name='_chk_criterio' value="" data-valor="" />&nbsp
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                    </div>
                                    ${x.nombre}
                                </label>
                            </td>
                            <td>
                                <textarea class ="form-control clstblchkdescripcion"></textarea>
                            </td>
                        </tr>
                    `;
            });
            tbody.innerHTML = html;
            handler_tbl_criterios_aprobacion();
            if (appNewSDT.ovariables.idproveedor > 0 && appNewSDT.ovariables.idproveedor !== "") {
                mostrardatosproveedor()
            }

        }

        function handler_tbl_criterios_aprobacion() {
            //// PARA LOS CHECKBOX - I-CHECKS
            $("#divcomparacion .i-checks._clscheck_criterio").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let chk = e.currentTarget;
                if (!chk.checked) {
                    let chkcomparacion = _('divcomparacion').querySelector('._cls_criterio_cabecera');
                    if (chkcomparacion.checked) {
                        chkcomparacion.checked = false;
                        chkcomparacion.parentNode.classList.remove('checked');
                    }
                }
            });
        }

        function llenar_tabla_criterio_edit(data, data_criterios_seleccionada) {
            let filas = data.length, html = '', tbody = _('tblbodychk');

            llenar_tabla_criterio_new(data);

            if (data_criterios_seleccionada !== null) {
                let arr_rows = Array.from(tbody.rows);
                let count_rows = arr_rows.length;
                let noselect = false;
                arr_rows.forEach(x => {
                    let datapar = x.getAttribute('data-par'), idvalorestado = _par(datapar, 'idvalorestado'),
                        comentario_criterio = x.getElementsByClassName('clstblchkdescripcion')[0];
                    let datafilter = data_criterios_seleccionada.filter(x => x.valor === idvalorestado);
                    if (datafilter.length > 0) {
                        let chk = x.getElementsByClassName('_clscheck_criterio')[0];
                        chk.checked = true;
                        chk.parentNode.classList.add('checked');
                        comentario_criterio.value = datafilter[0].descripcion;
                    } else {
                        noselect = true;
                    }
                });

                if (!noselect && count_rows > 0) {
                    let chkcomparacion = _('divcomparacion').querySelector('._cls_criterio_cabecera');
                    chkcomparacion.checked = true;
                    chkcomparacion.parentNode.classList.add('checked');
                }
            }
        }

        function getEstado_SolicitudDesarrolloTela(estado) {
            let aestado = estado.length > 0 ? estado.split(',') : [];
            let visible = true;
            if (aestado.length > 0) {
                let contiene = aestado.indexOf('APR') >= 0 || aestado.indexOf('ENV') >= 0;
                if (contiene) visible = false;
            }
            return visible;
        }



        function res_ini_edit(data) {
            let rpta = data != null ? JSON.parse(data) : null, html = '';
            if (rpta != null) {
                let osoldt = JSON.parse(rpta[0].soldt);
                ovariables.perfiles = rpta[0].perfil_usuario.split('¬');

                //// HABILITAR ESTO PARA SWATCH
                //fn_seleccionar_tipo_producto_a_desarrollar(osoldt.tipo_producto_a_desarrollar);
                //fn_setear_valores_segun_tipo_producto_a_desarrollar(osoldt.tipo_producto_a_desarrollar);

                if (osoldt.idproyecto !== 0) { // Jacob - lista proyecto si existe
                    //fn_AgregarProyecto();
                    _('txtcodigopry').value = osoldt.codigopry;
                    _('txtproyecto').innerHTML = osoldt.codigopry;
                    _('txtdescripcionpry').value = osoldt.descripcionpry;
                    _('txtclientepry').value = osoldt.clientepry;
                    _('txtaprobacionpry').value = osoldt.fechapry;
                    _('txtestadopry').value = osoldt.estadopry;
                    ovariables.idproyecto = osoldt.idproyecto !== 0 ? osoldt.idproyecto : '';
                }

                // Agregar colores existentes -- Jacob
                if (osoldt.json_color !== '') {
                    fn_ColoresAgregar(JSON.parse(osoldt.json_color));
                }

                // Guarda todos los procesos
                ovariables.procesorutatela = CSVtoJSON(rpta[0].procesorutatela);

                //// CODIGO DE SAMI VERIFICAR SI VA O NO
                //let mostrar_LeadTimeyEnviar = getEstado_SolicitudDesarrolloTela(osoldt.estado);
                //if (!mostrar_LeadTimeyEnviar) {                    
                //    _('btn_enviar_sdt').classList.add("hide");
                //}

                if (osoldt.estado.toUpperCase().indexOf('APR') >= 0) {
                    _('btn_save_leadtime').classList.remove("hide");
                }

                ovariables.idgrupocomercial = osoldt.idgrupocomercial;
                ovariables.solicituddesarrollotela = osoldt;

                _('hf_idsolicituddesarrollotela').value = osoldt.isolicituddesarrollotela;
                _('txtanio').value = osoldt.anio;
                _('txtCorrelativo').value = osoldt.Contador;
                _('txtestructura').value = osoldt.familia;
                _('txtcomposicion').value = osoldt.contenido;
                _('txttitulo').value = osoldt.titulo;
                _('txtdensidad').value = osoldt.densidad;
                _('hf_idanalisistextil').value = osoldt.idanalisistextil;
                _('hf_idsolicitud').value = osoldt.idsolicitud;
                $('#txtfecharequerida').val(osoldt.fecharequerida).datepicker('update');
                $('#txt_fecharequerimientocliente').val(osoldt.fecharequerimientocliente).datepicker('update');
                _('txtnombretela').value = osoldt.nombretela;
                //_('txtcolor').value = osoldt.color;
                _('txtcomplemento').value = osoldt.complementos;
                _('txta_comentario').value = osoldt.comentarios;
                _('txtacabados_especiales').value = osoldt.acabadosespeciales;
                _('txta_requerimientos_del_cliente').value = osoldt.requerimientoscliente;
                _('txta_recomendaciones_tecnicas').value = osoldt.recomendacionestecnica;
                _('txta_instruccionescuidado').value = osoldt.instruccionescuidado;
                osoldt.enviarcorreo == 1 ? $('#chk_correo_consignacion').prop('checked', true).iCheck('update') : $('#chk_correo_consignacion').prop('checked', false).iCheck('update');
                _('link_ver_atx').innerText = osoldt.codigo;
                $("input[name=rbmuestrafisica][value='" + osoldt.incluyemuestrafisica + "']").prop("checked", true);
                _('hf_idsolicituddesarrollotela_padre').value = osoldt.idsolicituddesarrollotela_padre;
                //// HABILITAR ESTO PARA SWATCH
                //_('txtgalga').value = osoldt.numero_galgas;

                fn_setear_chk_asume(osoldt.estado_desarrolloasumefabrica, osoldt.estado_desarrolloasumewts, osoldt.estado_desarrolloasumecliente);
                
                //// NOTA: TODA ESTA INFORMACION TAMBIEN ESTA EN EL LOAD, PERO SOLO CUANDO ES PASADA PARA CREAR UN NUEVO COMPLEMENTO
                _('hf_escomplemento').value = osoldt.escomplemento;
                _('hf_tieneatx').value = osoldt.tieneatx;
                _('hf_escomplemento_peroreferenciapadremuyantiguo').value = osoldt.escomplemento_peroreferenciapadremuyantiguo;
                _('hf_codigotelaclientepadremuyantiguo_referencia').value = osoldt.codigotelaclientepadremuyantiguo_referencia;
                _('hf_escomplemento_peroreferenciapadrehistorico').value = osoldt.escomplemento_peroreferenciapadrehistorico;
                _('txttotalcomplementos').value = osoldt.total_complementos;

                let checked_conatx = false;
                if (osoldt.tieneatx === 1) {
                    checked_conatx = true;
                }
                change_conatx_ini_edit(checked_conatx);

                if (osoldt.escomplemento === 1) {
                    if (osoldt.escomplemento_peroreferenciapadremuyantiguo === 1) {
                        _('txtnombretelacliente_telaprincipal').value = osoldt.codigotelaclientepadremuyantiguo_referencia
                        _('div_grupo_nombretelacliente_padre_referencia').classList.remove('hide');
                        _('lbl_codigotela_o_codigotelaprincipal').innerText = "Código Tela";
                        ovariables.opcion_seleccionado_paracomplemento = 'concodigotela';
                    } else if (osoldt.escomplemento_peroreferenciapadrehistorico === 1) {
                        _('txtnombretelacliente_telaprincipal').value = osoldt.nombretelacliente_referenciapadre;
                        _('div_grupo_nombretelacliente_padre_referencia').classList.remove('hide');
                        _('lbl_codigotela_o_codigotelaprincipal').innerText = "Nombre Tela Cliente Historico";
                        ovariables.opcion_seleccionado_paracomplemento = 'contelaprincipal_historico';
                    }
                } else {
                    //// LLENAR TABLA DE TOTAL COMPLEMENTOS
                    llenar_tabla_totalcomplementos(osoldt.registro_complementos);
                }

                //set_chk_icheck('_clscheck_escomplemento', osoldt.escomplemento === 1 ? true : false);
                //set_chk_icheck('_clscheck_noexistebddesarrollotela', osoldt.escomplemento_peroreferenciapadremuyantiguo === 1 ? true : false);
                //_('txtnombretelacliente').value = osoldt.nombretelacliente_referenciapadre;
                //_('txtnombretelacliente_cuandonohaydesarrollo').value = osoldt.codigotelaclientepadremuyantiguo_referencia;
                //_('txtproveedor_tela').value = osoldt.proveedortela;
                //fn_change_chkescomplemento(osoldt.escomplemento === 1 ? true : false);
                //fn_change_chknoexistebddesarrollotela(osoldt.escomplemento_peroreferenciapadremuyantiguo === 1 ? true : false);

                let cbocliente = _('cbocliente');
                cbocliente.innerHTML = _comboItem({ text: '--seleccione--', value: '' }) + _comboFromCSV(rpta[0].clientes, { col: '¬', row: '^' });    // :add  :sarone :arone
                cbocliente.value = osoldt.idcliente;  // idcliente_datosnuevodesarrollo                

                let pruebalaboratorio = CSVtoJSON("idprueba¬prueba^" + rpta[0].paquetepruebalaboratorio);
                let cbotipoprueba = `<option value='0'>Seleccione...</option>`;

                pruebalaboratorio.forEach(x => {
                    cbotipoprueba += `<option value='${x.idprueba}'>${x.prueba}</option>`;
                });

                _('cbotipoprueba').innerHTML = cbotipoprueba;

                _('cbotipoprueba').value = osoldt.idpaquetepruebalaboratorio === '' ? 0 : osoldt.idpaquetepruebalaboratorio;

                osoldt.requiereanalisis == "0" ? $('#chk_requiereanalisis').iCheck('uncheck') : $('#chk_requiereanalisis').iCheck('check');

                _('txta_comentario_analisis_laboratorio').value = osoldt.comentarioanalisislaboratorio;

                appNewSDT.ovariables.lstClienteTemporada = rpta[0].clientetemporada;
                comboclientetemporada()
                _('cbocliente_temporada').value = osoldt.idclientetemporada;

                appNewSDT.ovariables.lstproveedor = CSVtoJSON(rpta[0].proveedor);
                comboproveedor()

                appNewSDT.ovariables.idproveedor = rpta[0].idproveedor;

                if (appNewSDT.ovariables.idproveedor > 0 && appNewSDT.ovariables.idproveedor !== "") {
                    mostrardatosproveedor()
                }

                let data_criterio = rpta[0].check !== '' ? CSVtoJSON(rpta[0].check) : null, data_criterio_seleccionado = rpta[0].checkmarcado !== '' ? CSVtoJSON(rpta[0].checkmarcado) : null;
                llenar_tabla_criterio_edit(data_criterio, data_criterio_seleccionado);

                if (rpta[0].detalle !== "") {
                    let detalle = CSVtoJSON(rpta[0].detalle)
                    cargardetalle(detalle)

                    //// COMENTADO POR EL MOMENTO PARA PROBA LOS SUB TABS DINAMICOS
                    let complementos = rpta[0].complementos !== '' ? rpta[0].complementos : [];
                    let detalleproveedor_complementos = rpta[0].detalleproveedor_complementos !== '' ? rpta[0].detalleproveedor_complementos : [];
                    let leadtime = rpta[0].leadtime !== '' ? rpta[0].leadtime : [];
                    cargar_tab_fabrica_complementos_ini_edit(complementos, detalleproveedor_complementos, leadtime);
                }

                let odata_archivos = rpta[0].archivos !== '' ? CSVtoJSON(rpta[0].archivos) : null;
                llenartablaarchivos_ini(odata_archivos);

                //let odata_statusfinal = rpta[0].statusfinalxfabrica !== '' ? CSVtoJSON(rpta[0].statusfinalxfabrica) : null;

                //// FUNCION REEMPLAZADO POR cargar_tab_estadofinal_complementos_ini_edit
                //crear_cargar_html_statusfinal(odata_statusfinal);
                let completos_final = rpta[0].complementos !== '' ? rpta[0].complementos : [];
                let detalleproveedor_final = rpta[0].detalleproveedor_complementos !== '' ? rpta[0].detalleproveedor_complementos : [];
                let statusfinalxfabrica = rpta[0].statusfinalxfabrica !== '' ? rpta[0].statusfinalxfabrica : [];
                cargar_tab_estadofinal_complementos_ini_edit(completos_final, detalleproveedor_final, statusfinalxfabrica);

                cargar_timeline_ini_edit(rpta[0].complementos);

                setear_default_res_ini(ovariables.accion, osoldt);
            }
        }

        function fn_setear_chk_asume(valor_chk_asume_fabrica, valor_chk_asume_wts, valor_chk_asume_cliente) {
            let chk_asume_fabrica = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumefabrica')[0],
                chk_asume_wts = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumewts')[0],
                chk_asume_cliente = _('tbody_quienasumedesarrollo').getElementsByClassName('_clscheck_asumecliente')[0],
                div_contenedor_asumefabrica = chk_asume_fabrica.parentNode, div_contenedor_asumewts = chk_asume_wts.parentNode,
                div_contenedor_asumecliente = chk_asume_cliente.parentNode;

            if (valor_chk_asume_fabrica === 1) {
                chk_asume_fabrica.checked = true;
                div_contenedor_asumefabrica.classList.add('checked');
            } 
            if (valor_chk_asume_wts === 1) {
                chk_asume_wts.checked = true;
                div_contenedor_asumewts.classList.add('checked');
            }
            if (valor_chk_asume_cliente === 1) {
                chk_asume_cliente.checked = true;
                div_contenedor_asumecliente.classList.add('checked');
            }

            
        }

        function llenar_tabla_totalcomplementos(data) {
            let fila = data !== '' ? data.split('^') : null, html = '';

            if (fila !== null) {
                let tbody = _('tbody_totalcomplementos');
                for (var i = 0; i < fila.length; i++) {
                    html += `
                        <tr>
                    `;
                    let columnas = fila[i].split('¬');
                    if (columnas.length > 0) {
                        html += `
                            <td>${i + 1}</td>
                            <td>${columnas[0]}</td>
                            <td>${columnas[1]}</td>
                        `;
                    }
                    html += `</tr>`;
                }
                tbody.innerHTML = html;
            }
        }

        function cargar_timeline_ini_edit(data_timeline) {
            let data = data_timeline !== '' ? CSVtoJSON(data_timeline) : null,
                html = '', class_color = '', class_icono = '', texto_titulo_cuerpo = '', nombre_tela = '',
                fechaactualizacion = '', class_hide_botonedit = '', quees = '', escomplemento = 0;
            if (data !== null) {
                data.forEach((x) => {
                    if (x.tipo === 'telaprincipal') {
                        class_color = 'navy-bg';
                        class_icono = 'fa fa-home';
                        class_hide_botonedit = 'hide';
                        quees = 'TELA PRINCIPAL';
                        nombre_tela = x.nombretela;
                        escomplemento = 0;
                    } else {
                        class_color = 'blue-bg';
                        class_icono = 'fa fa-briefcase';
                        class_hide_botonedit = '';
                        quees = 'COMPLEMENTO';
                        nombre_tela = x.nombretela_mas_id;
                        escomplemento = 1;
                    }

                    fechaactualizacion = x.fechaactualizacion;

                    html += `
                        <div class="vertical-timeline-block">
                            <div class="vertical-timeline-icon ${class_color}">
                                <i class="${class_icono}"></i>
                            </div>

                            <div class="vertical-timeline-content" data-par='idsolicituddesarrollotela:${x.idsolicituddesarrollotela},escomplemento:${escomplemento}'>
                                <h2>${quees}: <strong>${nombre_tela}</strong></h2>
                                <p>${texto_titulo_cuerpo}</p>
                                <a href="#" class="btn btn-sm btn-primary cls_edit_complemento ${class_hide_botonedit}">Edit</a>
                                <span class="vertical-date">
                                    ${nombre_tela} <br>
                                    <small>${fechaactualizacion}</small>
                                </span>
                            </div>
                        </div>
                    `;
                });

                _('vertical-timeline').innerHTML = html;
                handler_timeline_image_ini_edit_complementos();
            }
        }

        function handler_timeline_image_ini_edit_complementos() {
            let arr_btn_edit = Array.from(_('vertical-timeline').getElementsByClassName('cls_edit_complemento'));
            arr_btn_edit.forEach(x => { x.addEventListener('click', e => { fn_edit_complemento_from_timeline(e); }) });
        }

        function fn_edit_complemento_from_timeline(e) {
            let o = e.currentTarget, div_contenedor_del_boton = o.parentNode, datapar = div_contenedor_del_boton.getAttribute('data-par'),
                idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';

            _Go_Url(urlAccion, urlAccion, `accion:edit,idgrupocomercial:${ovariables.idgrupocomercial},idsolicituddesarrollotela:${idsolicituddesarrollotela}`);
        }

        function setear_default_res_ini(accion, obj_sdt ) {
            //div_escomplemento = _('div_escomplemento')
            
            let perfiles = ovariables.perfiles.filter(x => x.toLowerCase() === 'fabrica');
            if (perfiles.length > 0) { // ES FABRICA
                let tbody_criterios = _('tblbodychk'), arr_chk_criterios = Array.from(tbody_criterios.getElementsByClassName('_cls_criterio')),
                    arr_inputs_content_datosatxoriginal = Array.from(_('div_content_datosatxoriginal').getElementsByClassName('_cls_datosoriginalatx')),
                    arr_inputs_disabled_porproveedor = Array.from(_('div_cuerpoprincipal').getElementsByClassName('cls_disabled_por_proveedor'));
                    
                _('btn_enviar_sdt').classList.add('hide');
                _('btnBuscarAtx').disabled = true;
                _('btn_addfile').disabled = true;

                arr_inputs_content_datosatxoriginal.forEach(x => {
                    x.disabled = true;
                });
                
                //// CHECKS CRITERIOS
                arr_chk_criterios.forEach((x) => {
                    x.disabled = true;
                });

                arr_inputs_disabled_porproveedor.forEach(x => {
                    let tipo = x.getAttribute('data-type');
                    if (tipo) {
                        if (tipo === 'btnfecha_inspinia') {
                            x.classList.add('hide');
                        } else {
                            x.disabled = true;
                        }
                    } else {
                        x.disabled = true;
                    }
                    
                });

                ////  CHECK CABECERA CRITERIO
                _('divcomparacion').getElementsByClassName('table')[0].getElementsByClassName('_cls_criterio_cabecera')[0].disabled = true;
            }

            //// VALIDAR CUAMDO SEA COMPLEMENTO
            if (accion === 'edit') {
                setear_default_ini_edit_cuandoescomplemento(obj_sdt);
            }
        }

        function crear_cargar_html_statusfinal(odata) {
            let html = '', perfil = '';
            if (odata !== null) {
                let arr = ovariables.perfiles.filter(x => x.toLowerCase() !== 'fabrica'), habilitado_comercial = '', habilitado_fabrica = '',
                    hide_comercial = '', hide_fabrica = '', quienes = '';

                if (arr.length > 0) {  //// ENTRA AQUI CUANDO ES COMERCIAL O DESARROLLO TEXTIL
                    // FABRICA
                    habilitado_fabrica = 'disabled="disabled"';
                    hide_fabrica = 'hide';
                    quienes = 'comercial_desarrollotextil';
                } else {
                    habilitado_comercial = 'disabled="disabled"';
                    hide_comercial = 'hide';
                    quienes = 'fabrica';
                }

                odata.forEach((x, index) => {
                    let hideboton_reproceso = 'hide', hideboton_rehacer = 'hide', habilitar_btn_reproceso = '',
                        habilitar_btn_rehacer = '', habilitado_fabrica_segunestado = '', hide_fabrica_segunestado = '';
                    if (quienes !== 'fabrica') {
                        if (x.estadofinal_rechazofabrica === 'REPROCESO') {
                            hideboton_reproceso = '';
                        } else if (x.estadofinal_rechazofabrica === 'REHACER') {
                            hideboton_rehacer = '';
                        }
                        if (x.sehizosolicitudreproceso === '1') {
                            habilitar_btn_reproceso = 'disabled="disabled"';
                        }
                        if (x.sehizosolicitudrehacer === '1') {
                            habilitar_btn_rehacer = 'disabled="disabled"';
                        }
                        habilitado_fabrica_segunestado = habilitado_fabrica;
                        hide_fabrica_segunestado = hide_fabrica;
                    } else {
                        if (x.estado === 'FINALIZADO' || x.estado === 'FINALIZADO_CONCOMENTARIOS') {
                            habilitado_fabrica_segunestado = 'disabled="disabled"';
                            hide_fabrica_segunestado = 'hide';
                        } else if (x.estado === 'FINALIZADO_RECHAZADO') {
                            habilitado_fabrica_segunestado = habilitado_fabrica;
                            hide_fabrica_segunestado = hide_fabrica;
                        } else {  //// APROBADO O PENDING O CREADO
                            hide_fabrica_segunestado = 'hide';
                            habilitado_fabrica_segunestado = 'disabled="disabled"';
                        }
                    }
                    //<option value='FINALIZADO_CONCOMENTARIOS'>APROBADO CON COMENTARIOS</option>
                    html += `
                            <div class="ibox cls_subdiv_statusfinal" id='div_fabrica_statusfinal_${index}' data-par='idsolicituddetalledesarrollotela:${x.idsolicituddetalledesarrollotela},idproveedor:${x.idproveedor}'>
                                    <div class="ibox-title">
                                        <h5 class="text-navy bold">${x.nombreproveedor}</h5>
                                        <div class="ibox-tools text-right">
                                            <a class="collapse-link">
                                                <span class="fa fa-chevron-up icono_collapse"></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="ibox-content">
                                        <div class='ibox'>
                                            <div class='ibox-title'>
                                                <div class='row'>
                                                    <div class='col-sm-6'>
                                                        <h5 class="text-info bold">Comercial</h5>
                                                    </div>
                                                    <div class='col-sm-6 text-right'>
                                                        <button type='button' class='btn btn-sm btn-info cls_enviar_comercial ${hide_comercial}'>Notificar</button>
                                                        <button type='button' class='btn btn-sm btn-warning cls_reprocesar ${hideboton_reproceso}' ${habilitar_btn_reproceso}>Solicitar Reproceso</button>
                                                        <button type='button' class='btn btn-sm btn-success cls_rehacer ${hideboton_rehacer}' ${habilitar_btn_rehacer}>Solicitar Rehacer</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='ibox-content'>
                                                <div class="form-horizontal">
                                                    <div class="form-group">
                                                        <div class="col-sm-12" id="">
                                                            <label class='control-label col-sm-2'>Estado</label>
                                                            <div class='col-sm-4'>
                                                                <select class='form-control cls_cbo_estado_finalizado_comercial' ${habilitado_comercial} data-par='estado:${x.estado}'>
                                                                    <option value=''>Select</option>
                                                                    <option value='FINALIZADO_WTS'>APROBADO WTS</option>
                                                                    <option value='FINALIZADO_CLIENTE'>APROBADO CLIENTE</option>
                                                                    <option value='FINALIZADO_ENVIADOALCLIENTE'>ENVIADO AL CLIENTE</option>
                                                                    <option value='FINALIZADO_RECHAZADO'>RECHAZADO</option>
                                                                    <option value='FINALIZADO_CANCELADO'>CANCELADO</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-sm-12" id="">
                                                            <label class='control-label col-sm-2'>Comentario</label>
                                                            <div class='col-sm-10'>
                                                                <textarea class='form-control cls_comentario_finalizado_comercial' ${habilitado_comercial} rows='2' style='resize:none;'>${x.comentarioestadofinal_comercial}</textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='ibox'>
                                            <div class='ibox-title'>
                                                <div class='row'>
                                                    <div class='col-sm-6'>
                                                        <h5 class="text-info bold">Fábrica</h5>
                                                    </div>
                                                    <div class='col-sm-6 text-right'>
                                                        <button type='button' class='btn btn-sm btn-info cls_enviar_fabrica ${hide_fabrica_segunestado}'>Enviar</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='ibox-content'>
                                                <div class="form-horizontal">
                                                    <div class="form-group">
                                                        <div class="col-sm-12" id="">
                                                            <label class='control-label col-sm-2'>Estado</label>
                                                            <div class='col-sm-4'>
                                                                <select class='form-control cls_cbo_estado_finalizado_fabrica' ${habilitado_fabrica_segunestado} data-par='estado:${x.estadofinal_rechazofabrica}'>
                                                                    <option value=''>Select</option>
                                                                    <option value='REPROCESO'>REPROCESO</option>
                                                                    <option value='REHACER'>REHACER</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="col-sm-12" id="">
                                                            <label class='control-label col-sm-2'>Comentario</label>
                                                            <div class='col-sm-10'>
                                                                <textarea class='form-control cls_comentario_finalizado_fabrica' ${habilitado_fabrica_segunestado} rows='2' style='resize:none;'>${x.comentarioestadofinal_rechazofabrica}</textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    `;
                });

                _('div_principal_statusfinal').innerHTML = html;
                cargarcombos_estadofinal();
                handler_tbl_estadofinal();
            }
        }

        function cargar_tab_estadofinal_complementos_ini_edit(complementos, detalleproveedor_complementos, estadofinal) {
            let data_complementos = complementos !== '' ? CSVtoJSON(complementos) : null,
                data_detalleproveedor_complementos = detalleproveedor_complementos !== '' ? CSVtoJSON(detalleproveedor_complementos) : null,
                data_estadofinal_complementos = estadofinal !== '' ? CSVtoJSON(estadofinal) : null,
                html_li_tab = '', html_tabcontent = '', titulotab = '', class_active = '', id_tab_href = '',
                class_hide_depende_siescomplemento_o_no = '';

            let arr = ovariables.perfiles.filter(x => x.toLowerCase() !== 'fabrica'), habilitado_comercial = '', habilitado_fabrica = '',
                hide_comercial = '', hide_fabrica = '', quienes = '';

            if (arr.length > 0) {  //// ENTRA AQUI CUANDO ES COMERCIAL O DESARROLLO TEXTIL
                // FABRICA
                habilitado_fabrica = 'disabled="disabled"';
                hide_fabrica = 'hide';
                quienes = 'comercial_desarrollotextil';
            } else {
                habilitado_comercial = 'disabled="disabled"';  //// NO SE SI ESTO ES NECESARIO QUE ESTE ACA
                hide_comercial = 'hide';
                quienes = 'fabrica';

            }

            if (data_complementos !== null) {
                data_complementos.forEach((x, indice) => {
                    let lista_detalleproveedor_complementos = [], html_proveedor_porcomplemento = '', lista_estadofinal_complementos = [];
                    if (data_detalleproveedor_complementos !== null) {
                        lista_detalleproveedor_complementos = data_detalleproveedor_complementos.filter(y => y.idsolicituddesarrollotela === x.idsolicituddesarrollotela);
                        lista_estadofinal_complementos = data_estadofinal_complementos.filter(y => y.idsolicituddesarrollotela === x.idsolicituddesarrollotela);
                    }
                    if (indice === 0) {
                        class_active = 'active'
                    } else {
                        class_active = ''
                    }
                    if (x.tipo === 'telaprincipal') {
                        titulotab = 'Tela Principal';
                        class_hide_depende_siescomplemento_o_no = 'hide';
                    } else if (x.tipo === 'complementos') {
                        titulotab = `Complemento ${x.idsolicituddesarrollotela}`;
                        class_hide_depende_siescomplemento_o_no = '';
                    }

                    id_tab_href = `tab_desarrollo_estadofinal_cuerpo_${x.idsolicituddesarrollotela}`;

                    html_li_tab += `<li class="${class_active}">
                                        <a data-toggle="tab" href="#${id_tab_href}">${titulotab}</a>
                                    </li>
                    `;

                    //// PONER DENTRO DEL DIV
                    lista_detalleproveedor_complementos.forEach((x) => {
                        let html_estadofinal_proveedor = '', lista_sub_estadofinal = [], html_combo_estado_comercial = '',
                            html_combo_estado_fabrica = '';

                        lista_sub_estadofinal = lista_estadofinal_complementos.filter(y => y.idproveedor === x.idproveedor);

                        lista_sub_estadofinal.forEach((y) => {
                            let hideboton_reproceso = 'hide', hideboton_rehacer = 'hide', habilitar_btn_reproceso = '',
                                habilitar_btn_rehacer = '', habilitado_fabrica_segunestado = '', hide_fabrica_segunestado = '',
                                cadena_chk_tienecomentarios_comercial = '', habilita_comentario_comercial = '';

                            if (y.tienecomentarioestadofinal_comercial === '1') {
                                cadena_chk_tienecomentarios_comercial = 'checked="checked"';
                            }

                            if (quienes !== 'fabrica') {
                                if (y.estadofinal_rechazofabrica === 'REPROCESO') {
                                    hideboton_reproceso = '';
                                } else if (y.estadofinal_rechazofabrica === 'REHACER') {
                                    hideboton_rehacer = '';
                                }
                                if (y.sehizosolicitudreproceso === '1') {
                                    habilitar_btn_reproceso = 'disabled="disabled"';
                                }
                                if (x.sehizosolicitudrehacer === '1') {
                                    habilitar_btn_rehacer = 'disabled="disabled"';
                                }
                                habilitado_fabrica_segunestado = habilitado_fabrica;
                                hide_fabrica_segunestado = hide_fabrica;
                                if (y.tienecomentarioestadofinal_comercial === '0') {
                                    habilita_comentario_comercial = 'disabled="disabled"';
                                }
                            } else {
                                if (y.estado === 'FINALIZADO' || y.estado === 'FINALIZADO_CONCOMENTARIOS') {
                                    habilitado_fabrica_segunestado = 'disabled="disabled"';
                                    hide_fabrica_segunestado = 'hide';
                                } else if (y.estado === 'FINALIZADO_RECHAZADO') {
                                    habilitado_fabrica_segunestado = habilitado_fabrica;
                                    hide_fabrica_segunestado = hide_fabrica;
                                } else {  //// APROBADO O PENDING O CREADO
                                    hide_fabrica_segunestado = 'hide';
                                    habilitado_fabrica_segunestado = 'disabled="disabled"';
                                }
                                habilita_comentario_comercial = habilitado_comercial;
                            }

                            html_combo_estado_comercial += `
                                <select class='form-control cls_cbo_estado_finalizado_comercial' ${habilitado_comercial} data-par='estado:${y.estado}'>
                                    <option value=''>Select</option>
                                    <option value='FINALIZADO_WTS'>APROBADO WTS</option>
                                    <option value='FINALIZADO_CLIENTE'>APROBADO CLIENTE</option>
                                    <option value='FINALIZADO_ENVIADOALCLIENTE'>ENVIADO AL CLIENTE</option>
                                    <option value='FINALIZADO_RECHAZADO'>RECHAZADO</option>
                                    <option value='FINALIZADO_CANCELADO'>CANCELADO</option>
                                </select>
                            `;

                            html_combo_estado_fabrica += `
                                <select class="form-control cls_cbo_estado_finalizado_fabrica" ${habilitado_fabrica_segunestado} data-par="estado:${y.estadofinal_rechazofabrica}">
                                    <option value="">Select</option>
                                    <option value="REPROCESO">REPROCESO</option>
                                    <option value="REHACER">REHACER</option>
                                </select>
                            `;
                            //<label class="control-label col-sm-2">Comentario</label>
                            html_estadofinal_proveedor += `<div class="ibox">
                                                                <div class="ibox-title">
                                                                    <div class="row">
                                                                        <div class="col-sm-6">
                                                                            <h5 class="text-info bold">Comercial</h5>
                                                                        </div>
                                                                        <div class="col-sm-6 text-right">
                                                                            <button type="button" class="btn btn-sm btn-info cls_enviar_comercial ${hide_comercial}">Notificar</button>
                                                                            <button type="button" class="btn btn-sm btn-warning cls_reprocesar ${hideboton_reproceso}" ${habilitar_btn_reproceso}>Solicitar Reproceso</button>
                                                                            <button type="button" class="btn btn-sm btn-success cls_rehacer ${hideboton_rehacer}" ${habilitar_btn_rehacer}>Solicitar Rehacer</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="ibox-content">
                                                                    <div class="form-horizontal">
                                                                        <div class="form-group">
                                                                            <div class="col-sm-12" id="">
                                                                                <label class="control-label col-sm-2">Estado</label>
                                                                                <div class="col-sm-4">
                                                                                    ${html_combo_estado_comercial}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="form-group">
                                                                            <div class="col-sm-12" id="">
                                                                                <label class="control-label col-sm-2 cls_chk_aprobadoconcomentarios id="div_chk_aprobadoconcomentarios">
                                                                                    <div class='icheckbox_square-green _clsdiv_chk_aprobadoconcomentarios' style='position: relative;'>
                                                                                        <input type='checkbox' class='i-checks _clscheck_aprobadoconcomentarios _cls_aprobadoconcomentarios' ${habilitado_comercial} style='position: absolute; opacity: 0;' name='_chk_aprobadoconcomentarios' value="" data-valor="" ${cadena_chk_tienecomentarios_comercial} />&nbsp
                                                                                        <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                                                                    </div>
                                                                                    Comentario
                                                                                </label>
                                                                                <div class="col-sm-10">
                                                                                    <textarea class="form-control cls_comentario_finalizado_comercial" ${habilita_comentario_comercial} rows="2" style="resize:none;">${y.comentarioestadofinal_comercial}</textarea>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="ibox">
                                                                <div class="ibox-title">
                                                                    <div class="row">
                                                                        <div class="col-sm-6">
                                                                            <h5 class="text-info bold">Fábrica</h5>
                                                                        </div>
                                                                        <div class="col-sm-6 text-right">
                                                                            <button type="button" class="btn btn-sm btn-info cls_enviar_fabrica ${hide_fabrica_segunestado}">Enviar</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="ibox-content">
                                                                    <div class="form-horizontal">
                                                                        <div class="form-group">
                                                                            <div class="col-sm-12" id="">
                                                                                <label class="control-label col-sm-2">Estado</label>
                                                                                <div class="col-sm-4">
                                                                                    ${html_combo_estado_fabrica}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="form-group">
                                                                            <div class="col-sm-12" id="">
                                                                                <label class="control-label col-sm-2">Comentario</label>
                                                                                <div class="col-sm-10">
                                                                                    <textarea class="form-control cls_comentario_finalizado_fabrica" ${habilitado_fabrica_segunestado} rows="2" style="resize:none;">${y.comentarioestadofinal_rechazofabrica}</textarea>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                    </div>
                            `;
                        });

                        html_proveedor_porcomplemento += `
                            <div class="ibox cls_subdiv_statusfinal" data-par="idsolicituddetalledesarrollotela:${x.idsolicituddetalledesarrollotela},idproveedor:${x.idproveedor},idsolicituddesarrollotela:${x.idsolicituddesarrollotela}">
                                <div class="ibox-title">
                                    <h5 class="text-navy bold">${x.nombreproveedor}</h5>
                                    <div class="ibox-tools text-right">
                                        <a class="collapse-link">
                                            <span class="fa fa-chevron-up icono_collapse"></span>
                                        </a>
                                    </div>
                                </div>
                                <div class="ibox-content">
                                    ${html_estadofinal_proveedor}
                                </div>
                            </div>
                        `;
                    });

                    html_tabcontent += `<div id="${id_tab_href}" class="tab-pane ${class_active}">
                                            <div class='col-sm-12'>
                                                <div class='form-horizontal'>
                                                    <div class='form-group'>
                                                        ${html_proveedor_porcomplemento}
                                                    </div>    
                                                </div>
                                            </div>
                                        </div>
                    `;
                });

                _('tab_ul_estadofinal_complementos').innerHTML = html_li_tab;
                _('tab_content_estadofinal_complementos').innerHTML = html_tabcontent;
                cargarcombos_estadofinal();
                handler_tbl_estadofinal();
            }
        }

        function cargarcombos_estadofinal() {
            let divprincipal_statusfinal = _('div_principal_statusfinal'),
                arr_combos_comercial = Array.from(divprincipal_statusfinal.getElementsByClassName('cls_cbo_estado_finalizado_comercial')),
                arr_combos_fabrica = Array.from(divprincipal_statusfinal.getElementsByClassName('cls_cbo_estado_finalizado_fabrica'));
            arr_combos_comercial.forEach((x) => {
                let datapar = x.getAttribute('data-par'), estado = _par(datapar, 'estado');
                x.value = estado;
            });

            arr_combos_fabrica.forEach((x) => {
                let datapar = x.getAttribute('data-par'), estado = _par(datapar, 'estado');
                x.value = estado;
            });
        }

        function handler_tbl_estadofinal() {
            let divprincipal_statusfinal = _('div_principal_statusfinal'), arr_subdivs_statusfinal = Array.from(divprincipal_statusfinal.getElementsByClassName('cls_subdiv_statusfinal')),
                arr_collapse_divs = Array.from(divprincipal_statusfinal.getElementsByClassName('collapse-link'));
            arr_subdivs_statusfinal.forEach((x) => {
                x.getElementsByClassName('cls_enviar_comercial')[0].addEventListener('click', fn_finalizar_porcomercial, false);
                x.getElementsByClassName('cls_enviar_fabrica')[0].addEventListener('click', fn_finalizar_respuestafabrica, false);
                x.getElementsByClassName('cls_reprocesar')[0].addEventListener('click', fn_solicitarreprocesar, false);
                x.getElementsByClassName('cls_rehacer')[0].addEventListener('click', fn_solicitarrehacer, false);
            });

            arr_collapse_divs.forEach(x => { x.addEventListener('click', e => { fn_colapsardivs(e) }) });

            $("#div_principal_statusfinal .i-checks._clscheck_aprobadoconcomentarios").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), estado = dom.checked,
                    div_contenedor = dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    txta_comentario = div_contenedor.getElementsByClassName('cls_comentario_finalizado_comercial')[0];
                if (estado) {
                    txta_comentario.disabled = false;
                } else {
                    txta_comentario.disabled = true;
                }
            });

        }

        function fn_solicitarreprocesar(e) {
            let o = e.currentTarget, divprincipal = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                datapar = divprincipal.getAttribute('data-par'), idcliente = _('cbocliente').value, idproveedor = _par(datapar, 'idproveedor');

            let parvalidacion = { idcliente: idcliente, idproveedor: idproveedor, idgrupocomercial: ovariables.idgrupocomercial },
                url_validacion = 'DesarrolloTextil/SolicitudDesarrolloTela/ValidarSiExistenCorreosFabrica?par=' + JSON.stringify(parvalidacion);

            swal({
                title: "Estas seguro de solicitar reproceso?",
                text: '',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (rpta_confirmacion) {
                if (rpta_confirmacion) {
                    let url = 'DesarrolloTextil/SolicitudDesarrolloTela/SolicitarReproceso', frm = new FormData(),
                        idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                        idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                        par = { idsolicituddesarrollotela: idsolicituddesarrollotela, idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela };

                    frm.append("parhead", JSON.stringify(par));

                    _Post(url, frm)
                        .then((rpta) => {
                            let orpta = JSON.parse(rpta);
                            _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                            let parametro = `idsolicituddesarrollotela:${ovariables.idsolicituddesarrollotela},accion:edit`;

                            if (orpta.id > 0) {
                                url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                                _Go_Url(url, url, parametro);
                            }
                        });
                }
                return true;
            });

        }

        function fn_solicitarrehacer(e) {
            let o = e.currentTarget, divprincipal = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                datapar = divprincipal.getAttribute('data-par');
            swal({
                title: "Estas seguro de solicitar REHACER?",
                text: '',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (rpta_confirmacion) {
                if (rpta_confirmacion) {
                    let url = 'DesarrolloTextil/SolicitudDesarrolloTela/SolicitudRehacer', frm = new FormData(),
                        idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                        idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                        par = { idsolicituddesarrollotela: idsolicituddesarrollotela, idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela };

                    frm.append("parhead", JSON.stringify(par));

                    _Post(url, frm)
                        .then((rpta) => {
                            let orpta = JSON.parse(rpta);
                            _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                            //// orpta.id PARA PODER VER LA NUEVA SOLICITUD DE DESARROLLO DE TELA PARA REHACER
                            let parametro = `idsolicituddesarrollotela:${orpta.id},accion:edit`;

                            if (orpta.id > 0) {
                                url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                                _Go_Url(url, url, parametro);
                            }
                        });
                }
                return true;
            });
        }

        var fn_finalizar_porcomercial = async (e) => {
            let o = e.currentTarget, divprincipal = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                datapar = divprincipal.getAttribute('data-par'), idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                idproveedor = _par(datapar, 'idproveedor'),
                idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                url = 'DesarrolloTextil/SolicitudDesarrolloTela/Save_EstadoFinalizado', frm = new FormData(),
                cboestado = divprincipal.getElementsByClassName('cls_cbo_estado_finalizado_comercial')[0],
                cbotemporada = _('cbocliente_temporada'),
                estado = cboestado.value,
                comentario = divprincipal.getElementsByClassName('cls_comentario_finalizado_comercial')[0].value,
                nombre_estado_cara = cboestado.selectedIndex >= 0 ? cboestado.options[cboestado.selectedIndex].text : '',
                idcliente = _('cbocliente').value,
                nombretemporada = cbotemporada.selectedIndex >= 0 ? cbotemporada.options[cbotemporada.selectedIndex].text : '',
                tienecomentario_comercial = divprincipal.getElementsByClassName('_clscheck_aprobadoconcomentarios')[0].checked,
                valor_tienecomentario_comercial = tienecomentario_comercial ? 1 : 0;

            par = {
                idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                perfil: ovariables.perfiles.join(''),
                estado: estado,
                comentario: comentario,
                nombre_estado_cara: nombre_estado_cara,
                idcliente: idcliente,
                idproveedor: idproveedor,
                idgrupocomercial: ovariables.idgrupocomercial,
                nombretemporada: nombretemporada,
                idsolicituddesarrollotela: idsolicituddesarrollotela, //ovariables.idsolicituddesarrollotela
                tienecomentarioestadofinal_comercial: valor_tienecomentario_comercial
            };

            if (validar_antes_enviar_finalizardesarrollo('comercial', divprincipal) === false) {
                return false;
            }

            let parvalidacion = { idcliente: idcliente, idproveedor: idproveedor, idgrupocomercial: ovariables.idgrupocomercial },
                url_validacion = 'DesarrolloTextil/SolicitudDesarrolloTela/ValidarSiExistenCorreosFabrica?par=' + JSON.stringify(parvalidacion),
                parvalidacion_sitieneatx = { idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela },
                url_validacion_atx = 'DesarrolloTextil/SolicitudDesarrolloTela/ValidarSiLaSolicitudTieneAtx?par=' + JSON.stringify(parvalidacion_sitieneatx);

            //// VALIDAR SI TIENE ATX
            let enviar_notificacion = async () => {
                const validarsiexistecorreofabrica = await _Get(url_validacion);
                if (validarsiexistecorreofabrica !== '') {
                    frm.append('par', JSON.stringify(par));
                    _Post(url, frm)
                        .then((data) => {
                            let odata = data !== '' ? JSON.parse(data) : null;
                            _swal({
                                mensaje: odata.mensaje,
                                estado: odata.estado
                            });
                        });
                } else {
                    _swal({ mensaje: 'No existen correos de fabrica, porfavor configure las cuentas de correo para fabrica...!', estado: 'error' });
                }
            }

            if (estado === 'FINALIZADO_CANCELADO') {
                enviar_notificacion();
            } else {
                const idatx = await _Get(url_validacion_atx);  //// ME DEVUELVE EL IDATX
                if (idatx !== '0') {
                    enviar_notificacion();
                } else {
                    _swal({ mensaje: 'No existen ATX registrados para esta solicitud...!', estado: 'error' });
                }
            }
            
        }

        function validar_antes_enviar_finalizardesarrollo(quienes, divprincipal) {
            let combo = '', pasavalidacion = true;
            if (quienes !== 'fabrica') {
                combo = divprincipal.getElementsByClassName('cls_cbo_estado_finalizado_comercial')[0],
                    comentario = divprincipal.getElementsByClassName('cls_comentario_finalizado_comercial')[0],
                    div_group_combo = combo.parentNode.parentNode.parentNode, div_group_comentario = comentario.parentNode.parentNode.parentNode,
                    chk_tienecomentario = divprincipal.getElementsByClassName('_clscheck_aprobadoconcomentarios')[0];



                div_group_combo.classList.remove('has-error');
                div_group_comentario.classList.remove('has-error');
                if (combo.value === '') {
                    div_group_combo.classList.add('has-error');
                    div_group_comentario.classList.add('has-error');
                    pasavalidacion = false;
                }
                if (combo.value === 'FINALIZADO_RECHAZADO' || combo.value === 'FINALIZADO_CANCELADO') {
                    if (comentario.value === '') {
                        div_group_comentario.classList.add('has-error');
                        pasavalidacion = false;
                    }
                } else {
                    if (chk_tienecomentario.checked) {
                        if (comentario.value.trim() === '') {
                            div_group_comentario.classList.add('has-error');
                            pasavalidacion = false;
                        }
                    }
                }
            } else {
                combo = divprincipal.getElementsByClassName('cls_cbo_estado_finalizado_fabrica')[0],
                    comentario = divprincipal.getElementsByClassName('cls_comentario_finalizado_fabrica')[0],
                    div_group_combo = combo.parentNode.parentNode.parentNode, div_group_comentario = comentario.parentNode.parentNode.parentNode;

                div_group_combo.classList.remove('has-error');
                div_group_comentario.classList.remove('has-error');
                if (combo.value === '') {
                    div_group_combo.classList.add('has-error');
                    pasavalidacion = false;
                }
                if (comentario.value === '') {
                    div_group_comentario.classList.add('has-error');
                    pasavalidacion = false;
                }
            }

            return pasavalidacion;
        }

        function fn_finalizar_respuestafabrica(e) {
            let o = e.currentTarget, divprincipal = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode, datapar = divprincipal.getAttribute('data-par'),
                idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                url = 'DesarrolloTextil/SolicitudDesarrolloTela/Save_EstadoFinalizado', frm = new FormData(),
                cboestado = divprincipal.getElementsByClassName('cls_cbo_estado_finalizado_fabrica')[0],
                estado = cboestado.value,
                comentario = divprincipal.getElementsByClassName('cls_comentario_finalizado_fabrica')[0].value,
                nombre_estado_cara = cboestado.selectedIndex >= 0 ? cboestado.options[cboestado.selectedIndex].text : '',
                cbotemporada = _('cbocliente_temporada'),
                nombretemporada = cbotemporada.selectedIndex >= 0 ? cbotemporada.options[cbotemporada.selectedIndex].text : '',
                nombretelacliente = _('txtnombretela').value,
                nombretelacliente_complemento = nombretelacliente + ' - ' + idsolicituddetalledesarrollotela,
                idcliente = _('cbocliente').value,
                par = {
                    idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                    perfil: ovariables.perfiles.join(','),
                    estado: estado,
                    comentario: comentario,
                    idgrupocomercial: ovariables.idgrupocomercial,
                    idsolicituddesarrollotela: idsolicituddesarrollotela, //ovariables.idsolicituddesarrollotela,
                    nombre_estado_cara: nombre_estado_cara,
                    nombretemporada: nombretemporada,
                    nombretelacliente: nombretelacliente,
                    nombretelacliente_complemento: nombretelacliente_complemento,
                    idcliente: idcliente,
                };

            if (validar_antes_enviar_finalizardesarrollo('fabrica', divprincipal) === false) {
                return false;
            }

            frm.append('par', JSON.stringify(par));
            _Post(url, frm)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    _swal({
                        mensaje: odata.mensaje,
                        estado: odata.estado
                    });
                });
        }

        function llenartablaarchivos_ini(odata) {
            let tbody = _('tbody_addfile'), html = '';
            if (odata !== null) {
                odata.forEach((x) => {
                    html += `
                                <tr data-par='accion:edit,idsolicituddesarrollotelaarchivos:${x.idsolicituddesarrollotelaarchivos},nombrearchivogenerado:${x.nombrearchivogenerado},nombrearchivooriginal:${x.nombrearchivooriginal}' data-estado='edit'>
                                    <td class='text-center cls_td_addfile_botones' style='vertical-align: middle;'>
                                        <button class ='btn btn-xs btn-danger cls_delete_addfile cls_disabled_por_proveedor'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </td>
                                    <td class='text-center cls_nombrefile' style='vertical-align: middle;'>
                                        <div class='input-group'>
                                            ${x.nombrearchivooriginal}
                                            <span class='btn btn-sm bg-success input-group-addon cls_btn_addfile_download' title='download'>
                                                <span class='fa fa-download'></span>
                                            </span>
                                        </div>
                                        
                                    </td>
                                    <td><textarea class='cls_txta_comentario form-control cls_disabled_por_proveedor' style='resize:none;'>${x.comentario}</textarea></td>
                                </tr>
                        `;
                });

                tbody.innerHTML = html;
                handler_tbl_addfile_ini();
            }
        }

        function handler_tbl_addfile_ini() {
            let tbody = _('tbody_addfile'), arrrows = Array.from(tbody.rows);
            arrrows.forEach((x) => {
                let btndownload = x.getElementsByClassName('cls_btn_addfile_download')[0];
                btndownload.addEventListener('click', fn_download_addfile, false);

                let btndelete = x.getElementsByClassName('cls_delete_addfile')[0];
                btndelete.addEventListener('click', fn_delete_addfile_file, false);
            });
        }

        function fn_download_addfile(e) {
            let link = document.createElement('a'), o = e.currentTarget, fila = o.parentNode.parentNode.parentNode,
                par = fila.getAttribute('data-par'), nombrearchivooriginal = _par(par, 'nombrearchivooriginal'), nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
            link.href = urlBase() + 'DesarrolloTextil/SolicitudDesarrolloTela/DownloadFile?nombrearchivogenerado=' + nombrearchivogenerado + '&nombrearchivooriginal=' + nombrearchivooriginal;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function chkmarcado(data) {
            let tbl = _('tblbodychk'), total = tbl.rows.length;
            data.forEach(x => {
                let val = x.valor, id = x.id;
                for (i = 0; i < total; i++) {
                    row = tbl.rows[i];
                    let chk = row.cells[0].children[0].children[0],
                        desc = row.cells[1].children[0];
                    let value = chk.value;
                    if (val === value) {
                        chk.checked = 1;
                        chk.setAttribute('data-idsolcomp', id);
                        desc.value = x.descripcion;
                    }
                }
            });
        }

        function cargardetalle(data) {
            let tbody = _('divtblfabrica').getElementsByClassName('clstblbodyfabrica')[0],
                html = '';

            if (data != null && data.length > 0) {
                let totalfilas = data.length;

                for (var i = 0; i < totalfilas; i++) {
                    let msg = data[i].cerrarleadtime === "0" ? 'Cerrar' : 'Aperturar', color = data[i].cerrarleadtime === "0" ? 'warning' : 'success';
                    html += `<tr data-par='idproveedor:${data[i].idproveedor},idsolicituddetalledesarrollotela:${data[i].idsolicituddetalledesarrollotela},estado:${data[i].estado},cerrarleadtime:${data[i].cerrarleadtime}'>
                                    <td class="text-center">
                                        <button class='btn btn-xs btn-danger cls_btn_deleteproveedor'>
                                            <span class='fa fa-trash-o'></span>
                                        </button>
                                    </td>
                                    <td class='cls_td_proveedor'>${data[i].nombreproveedor}</td>
                                    <td>${data[i].fechasolicitud}</td>
                                    <td>${data[i].estado}</td>
                                    <td class ="text-center">
                                         <button class ='btn btn-xs btn-${color} cls_btn_leadtime'>
                                            ${msg} LeadTime
                                        </button>
                                    </td>
                        `;
                }
                tbody.innerHTML = html;
                setear_cargar_datos_tblproveedor_ini();
                handlertblfabrica_edit();
            }
        }
        function handlertblfabrica_edit() {
            let tbody = _('divtblfabrica').getElementsByClassName('clstblbodyfabrica')[0], arrfilas = Array.from(tbody.rows);
            arrfilas.forEach(x => {
                let btn = x.getElementsByClassName('cls_btn_deleteproveedor')[0], btnleadtime = x.getElementsByClassName('cls_btn_leadtime')[0];

                btn.addEventListener('click', fn_delete_proveedor, false);
                let par = x.getAttribute('data-par'), estado = _par(par, 'estado'), cerrarleadtime = _par(par, 'cerrarleadtime'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela');
                if (estado === "ENV" || estado === "APR") {
                    btn.disabled = true;
                } else {
                    btnleadtime.disabled = true;
                }
                if (estado === 'REC') btn.disabled = false;

                btnleadtime.addEventListener('click', function () { fn_leadtime(cerrarleadtime, idsolicituddetalledesarrollotela) }, false);
            });
        }

        function setear_cargar_datos_tblproveedor_add() {
            let tbl_fabrica = _('tblbodyfabrica'), arr_rows = Array.from(tbl_fabrica.rows), existe_proveedores_pendientes = false,
                btn_enviar = _('btn_enviar_sdt');
            arr_rows.some((x) => {
                let datapar = x.getAttribute('data-par'), estado = _par(datapar, 'estado');
                if (estado === 'CRE') {
                    existe_proveedores_pendientes = true;
                    return true;
                }
            });

            if (existe_proveedores_pendientes) {
                btn_enviar.classList.remove('hide');
            } else {
                btn_enviar.classList.add('hide');
            }
        }

        function setear_cargar_datos_tblproveedor_ini() {
            let tbl_fabrica = _('tblbodyfabrica'), arr_rows = Array.from(tbl_fabrica.rows), existe_proveedores_pendientes = false,
                btn_enviar = _('btn_enviar_sdt');
            arr_rows.some((x) => {
                let datapar = x.getAttribute('data-par'), estado = _par(datapar, 'estado');
                if (estado === 'CRE') {
                    existe_proveedores_pendientes = true;
                    return true;
                }
            });

            if (existe_proveedores_pendientes) {
                btn_enviar.classList.remove('hide');
            } else {
                btn_enviar.classList.add('hide');
            }
        }

        function fn_leadtime(cerrarleadtime, idsolicituddetalledesarrollotela) {
            let msg = cerrarleadtime === "0" ? 'Cerrar' : 'Aperturar', idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value,
                valor = cerrarleadtime === "0" ? 1 : 0;
            let mensaje = 'Está seguro de ' + msg + ' el leadtime?';

            let cambiarestadoleadtime = () => {
                let parhead = { idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela, valor: valor }, frm = new FormData();

                frm.append('par', JSON.stringify(parhead));

                _Post('DesarrolloTextil/SolicitudDesarrolloTela/Bloquearleadtime', frm)
                    .then((odata) => {
                        let rpta = odata !== '' ? JSON.parse(odata) : null;
                        _swal({
                            mensaje: rpta.mensaje, estado: rpta.estado
                        });

                        if (rpta.estado === "success") {
                            parametro = `idsolicituddesarrollotela:${idsolicituddesarrollotela},accion:edit`,
                                url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                            _Go_Url(url, url, parametro);
                        }
                    }, (p) => {
                        err(p);
                    });
            }

            swal({
                title: mensaje,
                text: "",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No"

            }, function (rpta) {
                if (rpta) {
                    cambiarestadoleadtime()
                }
                return;
            });
        }

        function cargar_tab_fabrica_complementos_ini_edit(complementos, detalleproveedor_complementos, leadtime_procesos) {
            // NOTA: let estado = x.estado; VALIDAR LUEGO CON EL ESTADO DE CRE ENV Y APR PARA VISUALIZAR LOS LEADTIME EN EL PROCESO DE TELAS

            let data_complementos = complementos !== '' ? CSVtoJSON(complementos) : null,
                data_detalleproveedor_complementos = detalleproveedor_complementos !== '' ? CSVtoJSON(detalleproveedor_complementos) : null,
                data_leadtime_procesos = leadtime_procesos !== '' ? CSVtoJSON(leadtime_procesos) : null,
                html = '',
                html_li_tab = '', html_tabcontent = '', titulotab = '', class_active = '', id_tab_href = '',
                class_hide_depende_siescomplemento_o_no = '', class_hide_depende_si_tipo_swatch = '', class_hide_depende_si_tipo_tela = '';
            if (data_complementos !== null) {
                data_complementos.forEach((x, indice) => {
                    let lista_detalleproveedor_complementos = [], html_proveedor_porcomplemento = '',
                        lista_leadtime_porproveedor_complementos = [], tipo_telaprincipal_complemento = '';
                    if (data_detalleproveedor_complementos !== null) {
                        lista_detalleproveedor_complementos = data_detalleproveedor_complementos.filter(y => y.idsolicituddesarrollotela === x.idsolicituddesarrollotela);
                        lista_leadtime_porproveedor_complementos = data_leadtime_procesos.filter(y => y.idsolicituddesarrollotela === x.idsolicituddesarrollotela);
                    }
                    if (indice === 0) {
                        class_active = 'active'
                    } else {
                        class_active = ''
                    }
                    if (x.tipo === 'telaprincipal') {
                        titulotab = 'Tela Principal';
                        class_hide_depende_siescomplemento_o_no = 'hide';
                    } else if (x.tipo === 'complementos') {
                        titulotab = `Complemento ${x.idsolicituddesarrollotela}`;
                        class_hide_depende_siescomplemento_o_no = '';
                    }
                    tipo_telaprincipal_complemento = x.tipo;
                    //// HABILITAR ESTO PARA SWATCH
                    //if (x.tipo_producto_a_desarrollar === 'TELA') {
                    //    class_hide_depende_si_tipo_tela = '';
                    //    class_hide_depende_si_tipo_swatch = 'hide';
                    //} else if (x.tipo_producto_a_desarrollar === 'SWATCH') {
                    //    class_hide_depende_si_tipo_tela = 'hide';
                    //    class_hide_depende_si_tipo_swatch = '';
                    //}

                    id_tab_href = `tab_desarrollo_cuerpopadre_${x.idsolicituddesarrollotela}`;

                    html_li_tab += `<li class="${class_active}">
                                        <a data-toggle="tab" href="#${id_tab_href}">${titulotab}</a>
                                    </li>
                    `;

                    //// PONER DENTRO DEL DIV
                    lista_detalleproveedor_complementos.forEach((x) => {
                        let nombreproveedor_detalle_complemento = x.nombreproveedor, lista_sub_leadtime = [], html_leadtime_procesos = '',
                            isCerrarLeadTime = x.cerrarleadtime.toString() === "1", restricciontecnica = x.restricciontecnica,
                            estado_finalizado = '', disabled_cabecera_leadtime = '', disabled_leadtime_cuandoestacerrado = '';

                        if (x.estado === 'FINALIZADO_CANCELADO') {
                            estado_finalizado = 'finalizado';
                            disabled_cabecera_leadtime = 'disabled';
                        }

                        if (x.estado !== 'CRE' && x.estado !== 'ENV' || appNewSDT.ovariables.idgrupocomercial === 11) {
                            lista_sub_leadtime = lista_leadtime_porproveedor_complementos.filter(y => y.idproveedor === x.idproveedor);

                            if (ovariables.idgrupocomercial !== 11) { // Jacob - Si la solicitud no fue creada por desarrollo textil
                                html_leadtime_procesos += `<div class='col-sm-12'>
                                              <div class='form-group'>
                                                 <div class='col-sm-12'>  
                                                     <div class='table-responsive'>
                                                        <table class="table table-bordered table-hover" id="${x.idsolicituddetalledesarrollotela}" data-idproveedor="${x.idproveedor}">
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th class="text-center">Operador</th>
                                                                    <th class="text-center">Fabrica</th>
                                                                    <th class="text-center">Proceso</th>
                                                                    <th class="text-center">Fecha Fin Proceso</th>
                                                                    <th class="text-center">No Aplica</th>
                                                                    <th class="text-center">Completado</th>
                                                                    <th class="text-center">Fecha Fin Completado</th>
                                                                    <th class="text-center">Observación</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="clstblbody_leadtime" data-id="1">`;

                                lista_sub_leadtime.forEach((y) => {
                                    let disabled = y.noaplica === "1" ? 'disabled' : '',
                                        disabled_leadtime_cuandoestacerrado = isCerrarLeadTime ? 'disabled' : '',
                                        attributoCompletado = `${y.completado === '1' ? 'checked' : ''} ${y.noaplica === '1' ? ' disabled' : ''}`,
                                        attributoNoAplica = `${y.noaplica === '1' ? ' checked' : ''} ${isCerrarLeadTime ? ' disabled' : ''}`,
                                        deshabilitadosicompletado = y.completado === "1" ? 'disabled' : '';
                                    html_leadtime_procesos += `
                                                        <tr class='cls_row_proceso_${y.nombreproceso}' data-par="idsolicituddesarrollotela:${y.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${y.idsolicituddetalledesarrollotela},idsolicituddesarrollotelaLeadtimes:${y.idsolicituddesarrollotelaLeadtimes},idproveedor:${y.idproveedor},fechafinproceso:${y.fechafinproceso}">
                                                            <td class="text-center">
                                                                ${fn_CrearBotonDesarrolloWTS(y.estadowts, y.idprocesorutatela, y.nombreproceso, y.idsolicituddesarrollotelaLeadtimes)}
                                                            </td>
                                                            <td class="text-center">${y.nombreoperador}</td>
                                                            <td class="text-center">
                                                                ${fn_CrearSelectProveedor(y.idfabricadesarrollowts !== '0' ? y.idfabricadesarrollowts : y.idproveedor)}
                                                            </td>
                                                            <td class='_cls_td_proceso'>${y.nombreproceso}</td>
                                                            <td class="text-center">
                                                                <input type="date" class="_datepicker" data-date="Invalid date" data-date-format="MM/DD/YYYY" id="${y.nombreproceso}-${y.idproveedor}" value="${y.fechafinproceso}" ${disabled} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/>
                                                            </td>
                                                            <td>
                                                                <label>
                                                                    <div class="icheckbox_square-green _div_chkNoAplica" style="position: relative;">
                                                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkNoAplica" style="position: absolute; opacity: 0;" ${deshabilitadosicompletado} ${attributoNoAplica} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                                                    </div>
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <label>
                                                                    <div class="icheckbox_square-green _div_chkCompletado" style="position: relative;">
                                                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkCompletado" style="position: absolute; opacity: 0;" ${deshabilitadosicompletado} ${attributoCompletado} ${disabled} ${disabled_cabecera_leadtime}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                                                    </div>
                                                                </label>
                                                            </td>
                                                            <td class="text-center">
                                                                <input type="date" class="_datepicker_completado" data-date="" data-date-format="MM/DD/YYYY" value="${y.fechafincompletado}" ${disabled} ${disabled_cabecera_leadtime}>
                                                            </td>
                                                            <td>
                                                                <textarea class="form-control _txt_comentario" style="resize:none;" ${disabled} ${disabled_cabecera_leadtime}>${y.observacion}</textarea>
                                                            </td>
                                                        </tr>
                                                    `;
                                });

                                html_leadtime_procesos += `         </tbody >
                                                        </table >
                                                </div>
                                             </div>
                                        </div>
                                     </div>`;
                            } else {
                                //html_leadtime_procesos += `<div class='col-sm-12'>
                                //              <div class='form-group'>
                                //                 <div class='col-sm-12'>  
                                //                     <div class='table-responsive'>
                                //                        <table class="table table-bordered table-hover" id="${x.idsolicituddetalledesarrollotela}" data-idproveedor="${x.idproveedor}">
                                //                            <thead>
                                //                                <tr>
                                //                                    <th></th>
                                //                                    <th class="text-center">Proceso</th>
                                //                                    <th class="text-center">Fecha Fin Proceso</th>
                                //                                    <th class="text-center">No Aplica</th>
                                //                                    <th class="text-center">Completado</th>
                                //                                    <th class="text-center">Fecha Fin Completado</th>
                                //                                    <th class="text-center">Observación</th>
                                //                                </tr>
                                //                            </thead>
                                //                            <tbody class="clstblbody_leadtime" data-id="1">`;

                                //lista_sub_leadtime.forEach((y) => {
                                //    let disabled = y.noaplica === "1" ? 'disabled' : '',
                                //        disabled_leadtime_cuandoestacerrado = isCerrarLeadTime ? 'disabled' : '',
                                //        attributoCompletado = `${y.completado === '1' ? 'checked' : ''} ${y.noaplica === '1' ? ' disabled' : ''}`,
                                //        attributoNoAplica = `${y.noaplica === '1' ? ' checked' : ''} ${isCerrarLeadTime ? ' disabled' : ''}`;
                                //    html_leadtime_procesos += `
                                //                        <tr class='cls_row_proceso_${y.nombreproceso}' data-par="idsolicituddesarrollotela:${y.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${y.idsolicituddetalledesarrollotela},idsolicituddesarrollotelaLeadtimes:${y.idsolicituddesarrollotelaLeadtimes},idproveedor:${y.idproveedor},fechafinproceso:${y.fechafinproceso}">
                                //                            <td class="text-center"></td>
                                //                            <td class='_cls_td_proceso'>${y.nombreproceso}</td>
                                //                            <td class="text-center">
                                //                                <input type="date" class="_datepicker" data-date="Invalid date" data-date-format="MM/DD/YYYY" id="${y.nombreproceso}-${y.idproveedor}" value="${y.fechafinproceso}" ${disabled} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/>
                                //                            </td>
                                //                            <td>
                                //                                <label>
                                //                                    <div class="icheckbox_square-green _div_chkNoAplica" style="position: relative;">
                                //                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkNoAplica" style="position: absolute; opacity: 0;" ${attributoNoAplica} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                //                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                //                                    </div>
                                //                                </label>
                                //                            </td>
                                //                            <td>
                                //                                <label>
                                //                                    <div class="icheckbox_square-green _div_chkCompletado" style="position: relative;">
                                //                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkCompletado" style="position: absolute; opacity: 0;" ${attributoCompletado} ${disabled} ${disabled_cabecera_leadtime}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                //                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                //                                    </div>
                                //                                </label>
                                //                            </td>
                                //                            <td class="text-center">
                                //                                <input type="date" class="_datepicker_completado" data-date="" data-date-format="MM/DD/YYYY" value="${y.fechafincompletado}" ${disabled} ${disabled_cabecera_leadtime}>
                                //                            </td>
                                //                            <td>
                                //                                <textarea class="form-control _txt_comentario" style="resize:none;" ${disabled} ${disabled_cabecera_leadtime}>${y.observacion}</textarea>
                                //                            </td>
                                //                        </tr>
                                //                    `;
                                //});

                                //html_leadtime_procesos += `         </tbody >
                                //                        </table >
                                //                </div>
                                //             </div>
                                //        </div>
                                //     </div>`;

                                html_leadtime_procesos += `<div class='col-sm-12'>
                                              <div class='form-group'>
                                                 <div class='col-sm-12'>  
                                                     <div class='table-responsive'>
                                                        <table class="table table-bordered table-hover" id="${x.idsolicituddetalledesarrollotela}" data-idproveedor="${x.idproveedor}">
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th class="text-center">Operador</th>
                                                                    <th class="text-center">Fabrica</th>
                                                                    <th class="text-center">Proceso</th>
                                                                    <th class="text-center">Fecha Fin Proceso</th>
                                                                    <th class="text-center">No Aplica</th>
                                                                    <th class="text-center">Completado</th>
                                                                    <th class="text-center">Fecha Fin Completado</th>
                                                                    <th class="text-center">Observación</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="clstblbody_leadtime" data-id="1">`;

                                lista_sub_leadtime.forEach((y) => {
                                    let disabled = y.noaplica === "1" ? 'disabled' : '',
                                        disabled_leadtime_cuandoestacerrado = isCerrarLeadTime ? 'disabled' : '',
                                        attributoCompletado = `${y.completado === '1' ? 'checked' : ''} ${y.noaplica === '1' ? ' disabled' : ''}`,
                                        attributoNoAplica = `${y.noaplica === '1' ? ' checked' : ''} ${isCerrarLeadTime ? ' disabled' : ''}`,
                                        deshabilitadosicompletado = y.completado === "1" ? 'disabled' : '';
                                    html_leadtime_procesos += `
                                                        <tr class='cls_row_proceso_${y.nombreproceso}' data-par="idsolicituddesarrollotela:${y.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${y.idsolicituddetalledesarrollotela},idsolicituddesarrollotelaLeadtimes:${y.idsolicituddesarrollotelaLeadtimes},idproveedor:${y.idproveedor},fechafinproceso:${y.fechafinproceso},idprocesorutatela:${y.idprocesorutatela}">
                                                            <td class="text-center">
                                                                ${fn_CrearBotonDesarrolloWTS(y.estadowts, y.idprocesorutatela, y.nombreproceso, y.idsolicituddesarrollotelaLeadtimes)}
                                                                <button class="btn btn-sm btn-danger" onclick="appNewSDT.fn_EliminarLeadtime(this)" data-id="${y.idsolicituddesarrollotelaLeadtimes}">
                                                                    <span class="fa fa-trash"></span>
                                                                </button>
                                                            </td>
                                                            <td class="text-center">${y.nombreoperador}</td>
                                                            <td class="text-center">
                                                                ${fn_CrearSelectProveedor(y.idfabricadesarrollowts)}
                                                            </td>
                                                            <td class='_cls_td_proceso'>${y.nombreproceso}</td>
                                                            <td class="text-center">
                                                                <input type="date" class="_datepicker" data-date="Invalid date" data-date-format="MM/DD/YYYY" id="${y.nombreproceso}-${y.idproveedor}" value="${y.fechafinproceso}" ${disabled} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/>
                                                            </td>
                                                            <td>
                                                                <label>
                                                                    <div class="icheckbox_square-green _div_chkNoAplica" style="position: relative;">
                                                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkNoAplica" style="position: absolute; opacity: 0;" ${deshabilitadosicompletado} ${attributoNoAplica} ${disabled_cabecera_leadtime} ${disabled_leadtime_cuandoestacerrado}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                                                    </div>
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <label>
                                                                    <div class="icheckbox_square-green _div_chkCompletado" style="position: relative;">
                                                                        <div class="icheckbox_square-green" style="position: relative;"><input type="checkbox" class="i-checks _chkCompletado" style="position: absolute; opacity: 0;" ${deshabilitadosicompletado} ${attributoCompletado} ${disabled} ${disabled_cabecera_leadtime}/><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                                                                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                                                                    </div>
                                                                </label>
                                                            </td>
                                                            <td class="text-center">
                                                                <input type="date" class="_datepicker_completado" data-date="" data-date-format="MM/DD/YYYY" value="${y.fechafincompletado}" ${disabled} ${disabled_cabecera_leadtime}>
                                                            </td>
                                                            <td>
                                                                <textarea class="form-control _txt_comentario" style="resize:none;" ${disabled} ${disabled_cabecera_leadtime}>${y.observacion}</textarea>
                                                            </td>
                                                        </tr>
                                                    `;
                                });

                                html_leadtime_procesos += `         </tbody >
                                                        </table >
                                                </div>
                                             </div>
                                        </div>
                                     </div>`;
                            }

                            //// ACA HAY COSAS PARA SWATCH; LUEGO VOLVERLO A PONER COMO LOS INPUTS TIPO MAQUINA Y COMENTARIO DE FABRICA
                            html_proveedor_porcomplemento += `<div class="ibox cls_subdiv_leadtime cls_subdiv_leadtime_${x.idproveedor}" data-par='idsolicituddetalledesarrollotela:${x.idsolicituddetalledesarrollotela},idsolicituddesarrollotela:${x.idsolicituddesarrollotela},tipo:${tipo_telaprincipal_complemento}'> 
                                                                <div class='ibox-title'>
                                                                    <div class='ibox-tools'>
                                                                        <h5 class='text-navy'>${nombreproveedor_detalle_complemento}</h5>
                                                                        <a class='collapse-link'>
                                                                            <span class="fa fa-chevron-up icono_collapse"></span>
                                                                        </a>
                                                                    </div>
                                                                    
                                                                </div>
                                                                <div class="ibox-content">
                                                                    <div class='form-horizontal'>
                                                                        <div class='form-group'>
                                                                            <div class="col-sm-12">
                                                                                <div class='form-group'>
                                                                                    <div class='col-sm-12'>
                                                                                        <button class="btn btn-success btn-sm col-sm-2 ${class_hide_depende_siescomplemento_o_no}" ${disabled_cabecera_leadtime} data-idproveedor="1" data-idsolicituddesarrollotela_padre="${x.idsolicituddesarrollotela_padre}" title="leadtime" onclick="appNewSDT.fn_replicar_leadtime_solicitudpadre(this)">
                                                                                            <span class="fa fa-copy"></span>
                                                                                            Replicar Lead Time - Solicitud Padre
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-6">
                                                                                <div class="form-group cls_div_para_tipo_tela ${class_hide_depende_si_tipo_tela}">
                                                                                    <label class="control-label col-sm-3">Proveedor de Tela</label>
                                                                                    <div class="col-sm-9">
                                                                                        <input type="text" class="form-control _proveedortela" value="${x.proveedortela}" data-id="proveedortela" data-idproveedor="${x.idproveedor}" ${disabled_cabecera_leadtime}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-sm-6">
                                                                                <div class="form-group">
                                                                                    <label class="control-label col-sm-3">Fecha Entrega</label>
                                                                                    <div class="col-sm-9">
                                                                                        <input type="date" class="form-control _datepicker_fechaentrega" data-date="" data-idproveedor="${x.idproveedor}" data-date-format="MM/DD/YYYY" data-idsoldetalledtela="${x.idsolicituddetalledesarrollotela}" value="${x.fechaentrega}" ${disabled_cabecera_leadtime}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            ${fn_AgregarLeadtime(x)}
                                                                            ${html_leadtime_procesos}
                                                                            <div class='col-sm-12 cls_tabfabrica_complementos_restricciontecnica'>
                                                                                <div class='form-group'>
                                                                                    <div class='col-sm-12'>
                                                                                        <div class='col-sm-4'>
                                                                                            <input type="checkbox" class="js-switch _restricciontecnica" ${restricciontecnica === '0' ? ' ' : 'checked'} name="_restricciontecnica" ${disabled_cabecera_leadtime}/>
                                                                                            <label class="text-navy bold">Restricciones Técnicas</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class='form-group'>
                                                                                    <div class='col-sm-12'>
                                                                                        <textarea class="form-control _comentario_restricciontecnica" ${restricciontecnica === '0' ? 'disabled' : ''} ${disabled_cabecera_leadtime}>${x.comentariorestricciontecnica}</textarea>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class='col-sm-12 cls_tabfabrica_complementos_instruccionescuidado'>
                                                                                <div class='form-group'>
                                                                                    <div class='col-sm-12'>
                                                                                        <label class="text-navy col-sm-2">Instrucciones de Cuidado</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div class='form-group'>
                                                                                    <div class='col-sm-12'>
                                                                                        <textarea class="form-control _comentario_instruccionescuidado" ${disabled_cabecera_leadtime}>${x.comentarioinstruccionescuidado}</textarea>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                
                                                                </div>
                                                            </div>`;
                        }
                    });

                    html_tabcontent += `<div id="${id_tab_href}" class="tab-pane ${class_active} cls_tabpane_fabrica">
                                            <div class='col-sm-12'>
                                                <div class='form-horizontal'>
                                                    <div class='form-group'>
                                                        ${html_proveedor_porcomplemento}
                                                    </div>    
                                                </div>
                                            </div>
                                        </div>
                    `;
                });
            }

            // ANTERIOR CODIGO PROVEEDOR Y FECHA ENTREGA
            //<div class="col-sm-12">
            //    <div class='form-group'>
            //        <div class='col-sm-4'>
            //            <label class='control-label'>Proveedor de Tela</label>
            //            <input type="text" class="_proveedortela" value="${x.proveedortela}" data-id="proveedortela" data-idproveedor="${x.idproveedor}" ${disabled_cabecera_leadtime} />
            //        </div>
            //        <div class='col-sm-4'>
            //            <label class='control-label'>Fecha Entrega</label>
            //            <input type="date" class="_datepicker_fechaentrega" data-date="" data-idproveedor="${x.idproveedor}" data-date-format="MM/DD/YYYY" data-idsoldetalledtela="${x.idsolicituddetalledesarrollotela}" value="${x.fechaentrega}" ${disabled_cabecera_leadtime} />
            //        </div>
            //    </div>
            //</div>

            _('tab_ul_fabrica_complementos').innerHTML = html_li_tab;
            _('tab_content_fabrica_complementos').innerHTML = html_tabcontent;

            $(".listaProveedores").select2({ // Jacob - filtrado para fabrica
                placeholder: "Seleccionar Fabrica",
                allowClear: true,
                width: 300
            });

            handler_div_leadtime_ini_edit();
        }

        // :sarone
        
        function handler_div_leadtime_ini_edit() {
            handlertblbodyleadtime();

            let arrcolapsedivs = Array.from(_('tab_content_fabrica_complementos').getElementsByClassName('collapse-link'));
            arrcolapsedivs.forEach((x) => { x.addEventListener('click', e => { fn_colapsardivs(e) }) });

            let elems = Array.from(_('tab_content_fabrica_complementos').getElementsByClassName('_restricciontecnica'));

            elems.forEach(function (el) {
                let init = new Switchery(el, { color: '#1ab394', size: 'small' });
                el.onchange = function () {
                    let div_grupo = el.parentNode.parentNode.parentNode.parentNode, txtcomentario = div_grupo.getElementsByClassName('_comentario_restricciontecnica')[0];
                    if (el.checked === true) {
                        //el.parentNode.parentNode.parentNode.children[1].children[0].children[0].children[0].children[0].disabled = false;
                        txtcomentario.disabled = false;
                    } else {
                        txtcomentario.disabled = true;
                        txtcomentario.value = '';
                        //el.parentNode.parentNode.parentNode.children[1].children[0].children[0].children[0].children[0].disabled = true;
                        //el.parentNode.parentNode.parentNode.children[1].children[0].children[0].children[0].children[0].value = "";
                    }
                };
            });

            // :chk No Aplica
            $("#tab_content_fabrica_complementos .i-checks._chkNoAplica").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, ischecked = dom.checked, fila = dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    celdaFecha = fila.getElementsByClassName('_datepicker')[0],
                    celdaObservacion = fila.getElementsByClassName('_txt_comentario')[0],
                    chkCompletado = fila.getElementsByClassName('_chkCompletado')[0],
                    input_fechafincompletado = fila.getElementsByClassName('_datepicker_completado')[0];

                if (ischecked) {
                    celdaFecha.value = '';
                    celdaFecha.disabled = true;
                    celdaObservacion.disabled = true;
                    chkCompletado.checked = false;
                    chkCompletado.disabled = true;
                    chkCompletado.parentNode.classList.add("disabled")
                    chkCompletado.parentNode.classList.remove('checked');
                    input_fechafincompletado.disabled = true;
                } else {
                    celdaFecha.disabled = false;
                    celdaObservacion.disabled = false;
                    chkCompletado.disabled = false;
                    chkCompletado.parentNode.classList.remove("disabled")
                    input_fechafincompletado.disabled = false;
                }
            });

            // :chk Completado
            $("#tab_content_fabrica_complementos .i-checks._chkCompletado").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let date = new Date(), day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear(),
                    dom = e.currentTarget, ischecked = dom.checked, fila = dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    input_fechafincompletado = fila.getElementsByClassName('_datepicker_completado')[0], div_grupofecha_completado = dom.parentNode.parentNode;

                if (ischecked) {
                    //fila.cells[5].children[0].disabled = false;
                    input_fechafincompletado.disabled = false;
                    if (month < 10) {
                        //fila.cells[5].children[0].value = `${year}-0${month}-${day}`;
                        input_fechafincompletado.value = `${year}-0${month}-${day}`;
                    } else {
                        //fila.cells[5].children[0].value = `${year}-${month}-${day}`;
                        input_fechafincompletado.value = `${year}-${month}-${day}`
                    }
                    div_grupofecha_completado.classList.add('checked');
                } else {
                    //fila.cells[5].children[0].disabled = true;
                    input_fechafincompletado.disabled = true;
                    //fila.cells[5].children[0].value = "";
                    input_fechafincompletado.value = '';
                    div_grupofecha_completado.classList.remove('checked');
                }
            });
        }

        function handlertblbodyleadtime() {
            $("._datepicker").on("change", function () {
                this.setAttribute(
                    "data-date",
                    moment(this.value, "MM/DD/YYYY")
                        .format(this.getAttribute("data-date-format"))
                )
            }).trigger("change");
        }

        function converdatetoansi(fecha) {
            let fecharetorno = '';
            if (fecha !== null && fecha.length > 0) {
                let arrfecha = fecha.split("-");
                fecharetorno = arrfecha[0] + arrfecha[1] + arrfecha[2]
            }
            return fecharetorno;
        }

        function validarleadtime() {
            //divleadtime // CAMBIAR ESTO tab_desarrollo_cuerpopadre_93 X OTRA LOGICA // tab_desarrollo_cuerpopadre_93
            let arrtbody = _('divleadtime').getElementsByClassName('clstblbody_leadtime'), existefilas = true, pasavalidacion = true, contarfecha = 0, mensaje = '', obj = {}, totaltablas = 0;
            fechaactual = new Date(), anio = fechaactual.getFullYear(), mes = fechaactual.getMonth(), dia = fechaactual.getDate(), strfechaActual = anio.toString() + ('0' + (mes + 1).toString()).slice(-2) + ('0' + dia.toString()).slice(-2),
                idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value;

            if (idsolicituddesarrollotela !== "") {
                totaltablas = arrtbody.length;
                if (totaltablas > 0) {
                    // head
                    for (i = 0; i < totaltablas; i++) {
                        tbody = arrtbody[i];
                        let arrfilas = Array.from(tbody.rows), arr = [], totalfilas = arrfilas.length
                        if (totalfilas === 0) {
                            mensaje += '- No existen registros \n';
                            existefilas = false;
                            pasavalidacion = false;
                        }
                        // :retirado No habra validacion de fecha vs la fecha hoy
                        //if (existefilas) {
                        //    arrfilas.forEach((x, indice) => {
                        //        fecha = x.cells[2].children[0].value;
                        //        if (fecha === "") {
                        //            contarfecha++;
                        //        }
                        //        let afecha = converdatetoansi(fecha);

                        //        if (afecha !== "") {
                        //            if (afecha < strfechaActual) {
                        //                let numerofila = indice + 1
                        //                mensaje += "- En la fila " + numerofila + ", la fecha es menor que la del día de hoy \n";
                        //                pasavalidacion = false;
                        //            }
                        //        }

                        //        //if (contarfecha !== 0) {
                        //        //    mensaje += '- Debe agregar las fechas \n';
                        //        //    pasavalidacion = false;
                        //        //}
                        //    });
                        //}
                    }

                    // details
                    if (appNewSDT.ovariables.idproveedor > 0 && appNewSDT.ovariables.idproveedor !== "") {
                        let arrdiv = _('divleadtime').getElementsByClassName('_datepicker_fechaentrega'), totaldiv = arrdiv.length;
                        if (arrdiv !== "") {
                            for (i = 0; i < totaldiv; i++) {
                                let div = arrdiv[i]
                                    , fechaentrega = div.value
                                    , idsolicituddetalledesarrollotela = div.getAttribute('data-idsoldetalledtela')
                                    , afechaentrega = converdatetoansi(fechaentrega);
                                if (fechaentrega !== "") {

                                    // :retirado => la fecha fin de Proceso <= fecha Entrega
                                    //if (afechaentrega < strfechaActual) {
                                    //    mensaje += "- la fecha de entrega  es menor que la del día de hoy \n";
                                    //    pasavalidacion = false;
                                    //}

                                    // :sarone5                                    
                                    let fechaMayor_LeadTime = fn_getFechaMayor_leadtime(idsolicituddetalledesarrollotela);
                                    if (afechaentrega < fechaMayor_LeadTime) {
                                        mensaje += "- la fecha de entrega es menor a la fecha Fin de Proceso \n";
                                        pasavalidacion = false;
                                    }
                                } else {
                                    mensaje += "- la fecha de entrega  está vacía \n";
                                    pasavalidacion = false;
                                }
                            }
                        }
                    }
                } else {
                    pasavalidacion = false;
                    mensaje += "- No existen registros para guardar \n"
                }
            } else {
                pasavalidacion = false;
                mensaje += "- No existe la solicitud \n"
            }

            obj.mensaje = mensaje;
            obj.pasavalidacion = pasavalidacion;
            return obj;
        }

        function fn_getFechaMayor_leadtime(idsolicituddetalledesarrollotela) {
            let atxt = [..._(idsolicituddetalledesarrollotela).getElementsByClassName('_datepicker')];
            let afechas = [...new Set(atxt.map(x => x.value).filter(x => x.trim()))];
            let fechaMayor = afechas.sort((a, b) => {
                if (a > b) {
                    return -1;;
                } else if (b > a) {
                    return 1;;
                } else {
                    return 0;
                }
            })[0];
            return _isEmpty(fechaMayor) ? '' : converdatetoansi(fechaMayor);
        }


        // :sarone2
        //// YA NO SE VA A USAR
        function fn_save_leadtime() {
            let mensaje = '', validar = validarleadtime();

            if (validar.pasavalidacion == true) {
                let save = () => {
                    let frm = new FormData();
                    let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value;
                    let par = { idsolicituddesarrollotela: idsolicituddesarrollotela };

                    frm.append('par', JSON.stringify(par));
                    frm.append('pardetalle', JSON.stringify(getdetalle()));
                    frm.append('parsubdetalle', JSON.stringify(getleadtime()));

                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/Save_leadtime', frm)
                        .then((odata) => {
                            let rpta = odata !== '' ? JSON.parse(odata) : null;
                            _swal({ mensaje: rpta.mensaje, estado: rpta.estado });

                            if (rpta.estado === "success") {
                                parametro = `idsolicituddesarrollotela:${idsolicituddesarrollotela},accion:edit`,
                                    url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                                _Go_Url(url, url, parametro);
                            }

                        }, (p) => {
                            err(p);
                        });
                }

                swal({
                    title: "¿Estás seguro de registrar leadtime?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"

                }, function (rpta) {
                    if (rpta) {
                        save()
                    }
                    return;
                });
            } else {
                mensaje += validar.mensaje;
            }
            if (mensaje.length > 0) {
                _swal({
                    mensaje: mensaje, estado: 'error'
                });
            }
        }

        function fn_save_leadtime_telaprincipal_complementos() {
            let save = () => {
                let frm = new FormData();
                let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value,
                    perfil = ovariables.perfiles.join(''), cbocliente = _('cbocliente'),
                    nombrecliente = cbocliente.selectedIndex > 0 ? cbocliente.options[cbocliente.selectedIndex].text : '',
                    cbotemporada = _('cbocliente_temporada'), temporada = cbotemporada.selectedIndex > 0 ? cbotemporada.options[cbotemporada.selectedIndex].text.trim() : '',
                    nombretelacliente = _('txtnombretela').value;

                let arr = getdetalle_leadtime_telaprincipal_complementos(),
                    par = {
                        perfil: perfil,
                        idgrupocomercial: ovariables.idgrupocomercial,
                        nombrecliente: nombrecliente,
                        temporada: temporada,
                        nombretelacliente: nombretelacliente, detalle: arr.arr_detalle, leadtime: arr.arr_leadtime
                    };

                frm.append('par', JSON.stringify(par));

                _Post('DesarrolloTextil/SolicitudDesarrolloTela/Save_leadtime', frm)
                    .then((odata) => {
                        let rpta = odata !== '' ? JSON.parse(odata) : null;
                        _swal({ mensaje: rpta.mensaje, estado: rpta.estado });

                        if (rpta.estado === "success") {
                            parametro = `idsolicituddesarrollotela:${idsolicituddesarrollotela},accion:edit`,
                                url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                            _Go_Url(url, url, parametro);
                        }

                    }, (p) => {
                        err(p);
                    });
            }

            swal({
                title: "¿Estás seguro de registrar leadtime?",
                text: "",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No"

            }, function (rpta) {
                if (rpta) {
                    save();
                }
                return;
            });
        }

        // :sarone4 :subdetalle
        function getleadtime() {
            // divleadtime // tab_desarrollo_cuerpopadre_93
            let arrtbody = _('divleadtime').getElementsByClassName('clstblbody_leadtime'), totaltablas = arrtbody.length, arr = [], arrtbl = {}, indicetotal = 0;
            let ocolum = {
                fechaFinProceso: 2,
                NoAplica: 3,
                Completado: 4,
                fechafincompletado: 5,
                Observacion: 6,
            }
            if (arrtbody !== "") {
                for (i = 0; i < totaltablas; i++) {
                    tbody = arrtbody[i];
                    let arrfilas = Array.from(tbody.rows), totalfilas = arrfilas.length;
                    arrfilas.forEach((x, indice) => {
                        let par = x.getAttribute('data-par'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'), idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes'), idproveedor = _par(par, 'idproveedor'),
                            fecha = x.cells[2].children[0].value, fechafincompletado = x.cells[5].children[0].value;

                        let obj = {
                            idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                            idsolicituddesarrollotelaLeadtimes: idsolicituddesarrollotelaLeadtimes,
                            idproveedor: idproveedor,
                            fecha: converdatetoansi(fecha),

                            noaplica: x.cells[ocolum.NoAplica].querySelector('input').checked ? '1' : '0',
                            completado: x.cells[ocolum.Completado].querySelector('input').checked ? '1' : '0',
                            fechafincompletado: converdatetoansi(fechafincompletado),
                            observacion: x.cells[ocolum.Observacion].childNodes[1].value.trim()
                        }

                        arr.push(obj);
                        indicetotal++;
                    });

                }
            }
            return arr;
        }

        // :sarone3
        function getdetalle() {
            // divleadtime DESPUES REEMPLAZAR tab_desarrollo_cuerpopadre_93 ESTO POR OTRA LOGICA // tab_desarrollo_cuerpopadre_93
            let arrdiv = _('divleadtime').getElementsByClassName('_datepicker_fechaentrega');
            //divleadtime // tab_desarrollo_cuerpopadre_93
            let arrdiv_proveedortela = _('divleadtime').getElementsByClassName('_proveedortela');
            //divleadtime  // tab_desarrollo_cuerpopadre_93
            let arrdiv_restricciontecnica = _('divleadtime').getElementsByClassName('_restricciontecnica');
            //divleadtime // tab_desarrollo_cuerpopadre_93
            let arrdiv_restriccioncomentario = _('divleadtime').getElementsByClassName('_comentario_restricciontecnica');
            // divleadtime // tab_desarrollo_cuerpopadre_93
            let arrdiv_comentario_instruccionescuidado = _('divleadtime').getElementsByClassName('_comentario_instruccionescuidado');
            let totaldiv = arrdiv.length;
            let arr = [];

            if (arrdiv.length > 0) {
                for (i = 0; i < totaldiv; i++) {
                    let div = arrdiv[i];
                    let div_proveedortela = arrdiv_proveedortela[i];
                    let div_arrdiv_restricciontecnica = arrdiv_restricciontecnica[i];
                    let div_arrdiv_restriccioncomentario = arrdiv_restriccioncomentario[i];
                    let div_arrdiv_comentario_instruccionescuidado = arrdiv_comentario_instruccionescuidado[i];
                    let fechaentrega = div.value;
                    let proveedortela = div_proveedortela.value;
                    let restricciontecnica = div_arrdiv_restricciontecnica.checked === true ? 1 : 0;
                    let comentariorestricciontecnica = div_arrdiv_restriccioncomentario.value;
                    let comentarioinstruccionescuidado = div_arrdiv_comentario_instruccionescuidado.value;
                    let idsolicituddetalledesarrollotela = div.getAttribute('data-idsoldetalledtela');
                    let obj = {
                        //fechaentrega: converdatetoansi(fechaentrega),
                        fechaentrega: fechaentrega,
                        idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                        proveedortela: proveedortela,
                        restricciontecnica: restricciontecnica,
                        comentariorestricciontecnica: comentariorestricciontecnica,
                        comentarioinstruccionescuidado: comentarioinstruccionescuidado
                    }
                    arr[i] = obj;
                }
            }
            return arr;
        }

        function getdetalle_leadtime_telaprincipal_complementos() {
            let arr_tabpane_fabrica = Array.from(_('tab_content_fabrica_complementos').getElementsByClassName('cls_tabpane_fabrica')),
                arr_detalle = [], arr_leadtime = [], obj_return = {};
            arr_tabpane_fabrica.forEach((x) => {
                let arr_subdivs_leadtime = Array.from(x.getElementsByClassName('cls_subdiv_leadtime'));
                arr_subdivs_leadtime.forEach((y) => {
                    let datapar = y.getAttribute('data-par'), fechaentrega = y.getElementsByClassName('_datepicker_fechaentrega')[0].value,
                        idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                        proveedortela = y.getElementsByClassName('_proveedortela')[0].value,
                        chk_restricciontecnica = y.getElementsByClassName('_restricciontecnica')[0],
                        restricciontecnica = chk_restricciontecnica.checked ? 1 : 0,
                        comentariorestricciontecnica = y.getElementsByClassName('_comentario_restricciontecnica')[0].value,
                        comentarioinstruccionescuidado = y.getElementsByClassName('_comentario_instruccionescuidado')[0].value,
                        idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela')
                        //// ACTIVAR LUEGO PARA SWATCH
                        //tipomaquina = y.getElementsByClassName('_cls_txt_tipomaquina')[0].value,
                        //comentario_fabrica_swatch = y.getElementsByClassName('_txtcomentario_swatch_fabrica')[0].value;
                    let obj = {
                        fechaentrega: fechaentrega,
                        idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                        proveedortela: proveedortela,
                        restricciontecnica: restricciontecnica,
                        comentariorestricciontecnica: comentariorestricciontecnica,
                        comentarioinstruccionescuidado: comentarioinstruccionescuidado,
                        idsolicituddesarrollotela: idsolicituddesarrollotela
                        //// ACTIVAR LUEGO PARA SWATCH
                        //tipomaquina: tipomaquina,
                        //comentariofabrica: comentario_fabrica_swatch
                    }
                    arr_detalle.push(obj);

                    //// TABLAS LEADTIME
                    let tbody_leadtime = y.getElementsByClassName('clstblbody_leadtime')[0], arr_filas_leadtime = Array.from(tbody_leadtime.rows);
                    arr_filas_leadtime.forEach((z, indice) => {
                        let par = z.getAttribute('data-par'), idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes'),
                            idproveedor = _par(par, 'idproveedor'),
                            fecha = z.getElementsByClassName('_datepicker')[0].value, fechafincompletado = z.getElementsByClassName('_datepicker_completado')[0].value,
                            chk_noaplica = z.getElementsByClassName('_chkNoAplica')[0], noaplica = chk_noaplica.checked ? 1 : 0,
                            chk_completado = z.getElementsByClassName('_chkCompletado')[0], completado = chk_completado.checked ? 1 : 0,
                            comentario = z.getElementsByClassName('_txt_comentario')[0].value, proceso = z.getElementsByClassName('_cls_td_proceso')[0].innerText.trim(),
                            div_contenedor = z.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                            datapar_div_contenedor = div_contenedor.getAttribute('data-par'), tipo_telaprincipal_complemento = _par(datapar_div_contenedor, 'tipo'),
                            idsolicituddesarrollotela = _par(par, 'idsolicituddesarrollotela'),
                            idfabricadesarrollowts = $(".listaProveedores").eq(z.rowIndex - 1).select2('val'); // Jacob - Obtiene fabrica

                        let obj = {
                            idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                            idsolicituddesarrollotelaLeadtimes: idsolicituddesarrollotelaLeadtimes,
                            idproveedor: idproveedor,
                            fecha: fecha,
                            noaplica: noaplica,
                            completado: completado,
                            fechafincompletado: fechafincompletado,
                            observacion: comentario.trim(),
                            proceso: proceso,
                            escomplemento: tipo_telaprincipal_complemento === 'telaprincipal' ? '0' : '1',
                            idsolicituddesarrollotela: idsolicituddesarrollotela,
                            idfabricadesarrollowts: idfabricadesarrollowts
                        }

                        arr_leadtime.push(obj);
                    });
                });


            });

            obj_return.arr_detalle = arr_detalle;
            obj_return.arr_leadtime = arr_leadtime;

            return obj_return;
        }

        //function set_chk_icheck(clasechk, valor) {
        //    let divprincipal = _('div_cuerpoprincipal'), chk = divprincipal.getElementsByClassName(clasechk)[0], divchkpadre = chk.parentNode;
        //    chk.checked = valor;
        //    if (valor) {
        //        divchkpadre.classList.add('checked');
        //    } else {
        //        divchkpadre.classList.remove('checked');
        //    }
        //}

        function fn_replicar_leadtime_solicitudpadre(e) {
            let idsolicituddesarrollotelapadre = e.getAttribute("data-idsolicituddesarrollotela_padre");
            let idproveedor = e.getAttribute("data-idproveedor"), div_contenedor_tblleadtime = e.parentNode.parentNode.parentNode.parentNode,
                tbody_leadtime_procesos = div_contenedor_tblleadtime.getElementsByClassName('clstblbody_leadtime')[0];
            //cls_td_proceso_
            let frm = new FormData();
            let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value;
            let par = { idsolicituddesarrollotela: idsolicituddesarrollotelapadre, idproveedor: idproveedor };

            frm.append('par', JSON.stringify(par));

            _Post('DesarrolloTextil/SolicitudDesarrolloTela/Get_Buscar_LeadTime_SolicitudPadrexProveedor', frm)
                .then((odata) => {
                    let rpta = odata !== '' ? JSON.parse(odata) : null, solicitudxproveedor = JSON.parse(rpta[0].solicitud), solicitudleadtime = JSON.parse(rpta[0].leadtime),
                        input_proveedortela = document.getElementsByClassName('_proveedortela'), input_fechaentrega = document.getElementsByClassName('_datepicker_fechaentrega'),
                        arr_filas_tbody_procesos = Array.from(tbody_leadtime_procesos.rows);

                    for (let i = 0; i < input_proveedortela.length; i++) {
                        if (input_proveedortela[i].getAttribute('data-idproveedor') == solicitudxproveedor[0].idproveedor) {
                            input_proveedortela[i].value = solicitudxproveedor[0].proveedortela;
                            input_fechaentrega[i].value = solicitudxproveedor[0].fechaentrega !== '1900-01-01' ? solicitudxproveedor[0].fechaentrega : '';
                        }
                    }

                    solicitudleadtime.forEach(x => {
                        arr_filas_tbody_procesos.some(y => {
                            let class_proceso = 'cls_row_proceso_' + x.nombre;
                            if (y.classList.value.indexOf(x.nombre) !== -1) {  //// EXISTE PROCESO
                                let chk_noaplica = y.getElementsByClassName('_chkNoAplica')[0], div_contenedor_chknoaplica = chk_noaplica.parentNode,
                                    fecha_finproceso = y.getElementsByClassName('_datepicker')[0];
                                if (x.noaplica === 1) {
                                    chk_noaplica.checked = true;
                                    div_contenedor_chknoaplica.classList.add('checked');
                                } else {
                                    chk_noaplica.checked = false;
                                    div_contenedor_chknoaplica.classList.remove('checked');
                                }
                                
                                fecha_finproceso.value = x.fechafinproceso;
                                return true;
                            }
                        });
                        //if (_(x.nombre + '-' + x.idproveedor) !== undefined) {
                        //    _(x.nombre + '-' + x.idproveedor).value = x.fechafinproceso;
                        //}
                    });


                }, (p) => {
                    err(p);
                });
        }

        function verificar_enviocorreo_fabrica() {
            let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value, idgrupocomercial = ovariables.idgrupocomercial;
            _modalBody({
                url: 'DesarrolloTextil/SolicitudDesarrolloTela/_EnviarCorreoFabricaSolicitudDesarrollotela',
                ventana: '_EnviarCorreoFabricaSolicitudDesarrollotela',
                titulo: 'Enviar Correo',
                parametro: `idsolicituddesarrollotela:${idsolicituddesarrollotela},idgrupocomercial:${idgrupocomercial}`,
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });

            /*
            let mensaje = '';
            let validar = validarantesenviar();

            if (validar.pasavalidacion == true) {
                let idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value,
                    par = { idsolicituddesarrollotela: idsolicituddesarrollotela },
                    frm = new FormData();
                frm.append('par', JSON.stringify(par));

                _Post('DesarrolloTextil/SolicitudDesarrolloTela/VerificarEnvioCorreoFabrica', frm)
                    .then((odata) => {
                        let rpta = odata !== '' ? JSON.parse(odata) : null;
                        //let correo_fabrica = JSON.parse(rpta[0].correofabrica);
                        let mensaje = '';
                        if (rpta !== null) {
                            rpta.forEach(x => {
                                if (x.correo === '') {
                                    mensaje += '- ' + x.nombreproveedor + ' no cuenta con correo. \n';
                                }
                            })

                            if (mensaje === '') {
                                fn_enviar();
                            } else {
                                _swal({ mensaje: mensaje });
                            }
                        }
                    }, (p) => {
                        err(p);
                    });
            } else {
                _swal({ mensaje: validar.mensaje, error: 'error' });
            }
            */
        }

        function fn_cancelar_edicioncomplemento(o) {
            let escomplemento = _('hf_escomplemento').value, idsdt_telaprincipal = _('hf_idsolicituddesarrollotela_padre').value;

            if (escomplemento === '1') {
                if (_parseInt(idsdt_telaprincipal) > 0) {
                    let urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                    _Go_Url(urlAccion, urlAccion, `accion:edit,idgrupocomercial:${ovariables.idgrupocomercial},idsolicituddesarrollotela:${idsdt_telaprincipal},escomplemento_paracrear:0`);
                } else {

                }
            }
        }

        function change_conatx(conatx) {
            let arr_inputs_grupo_datosatx = Array.from(_('tab_usu_comercial').getElementsByClassName('cls_dato_atx')),
                txtanio = _('txtanio'), txtnumero = _('txtCorrelativo'), btnbuscaratx = _('btnBuscarAtx'), lnk_codigoatx = _('link_ver_atx'),
                hf_tieneatx = _('hf_tieneatx'), arr_input_conatx = Array.from(_('divATX').getElementsByClassName('_cls_conatx'));
            if (conatx) {
                arr_inputs_grupo_datosatx.forEach(x => {
                    let tipoinput = x.getAttribute('type');
                    if (tipoinput === 'text') {
                        x.disabled = true;
                        x.value = "";
                    }
                });
                txtanio.disabled = false;
                txtnumero.disabled = false;
                btnbuscaratx.classList.remove('hide');
                hf_tieneatx.value = "1";

                arr_input_conatx.forEach((x) => {
                    x.setAttribute('data-required', 'true');
                });
            } else {
                arr_inputs_grupo_datosatx.forEach(x => {
                    let tipoinput = x.getAttribute('type');
                    if (tipoinput === 'text') {
                        x.disabled = false;
                        x.value = "";
                    }
                });
                txtanio.disabled = true;
                txtnumero.disabled = true;
                txtanio.value = "";
                txtnumero.value = "";
                lnk_codigoatx.innerText = "";
                btnbuscaratx.classList.add('hide');
                hf_tieneatx.value = "0";
                _('hf_idanalisistextil').value = '';
                _('hf_idsolicitud').value = '';

                arr_input_conatx.forEach((x) => {
                    x.setAttribute('data-required', 'false');
                });
            }
        }

        function change_conatx_ini_edit(conatx) {
            let arr_inputs_grupo_datosatx = Array.from(_('tab_usu_comercial').getElementsByClassName('cls_dato_atx')),
                txtanio = _('txtanio'), txtnumero = _('txtCorrelativo'), btnbuscaratx = _('btnBuscarAtx'), lnk_codigoatx = _('link_ver_atx'),
                hf_tieneatx = _('hf_tieneatx'), arr_input_conatx = Array.from(_('divATX').getElementsByClassName('_cls_conatx')),
                chk_conatx = _('chk_conatx'), div_contenedor_chkconatx = chk_conatx.parentNode;

            chk_conatx.checked = conatx;
            if (conatx) {
                div_contenedor_chkconatx.classList.add('checked');
                arr_inputs_grupo_datosatx.forEach(x => {
                    let tipoinput = x.getAttribute('type');
                    if (tipoinput === 'text') {
                        x.disabled = true;
                    }
                });
                txtanio.disabled = false;
                txtnumero.disabled = false;
                btnbuscaratx.classList.remove('hide');
                hf_tieneatx.value = "1";

                arr_input_conatx.forEach((x) => {
                    x.setAttribute('data-required', 'true');
                });
            } else {
                div_contenedor_chkconatx.classList.remove('checked');
                arr_inputs_grupo_datosatx.forEach(x => {
                    let tipoinput = x.getAttribute('type');
                    if (tipoinput === 'text') {
                        x.disabled = false;
                    }
                });
                txtanio.disabled = true;
                txtnumero.disabled = true;
                btnbuscaratx.classList.add('hide');
                hf_tieneatx.value = "0";

                arr_input_conatx.forEach((x) => {
                    x.setAttribute('data-required', 'false');
                });
            }
        }

        /*/////////////////////////////////*/
        /*// Jacob - Funciones agregadas //*/
        /*/////////////////////////////////*/

        function fn_ColoresAgregar(_json) {
            if (_json.length > 0) {
                let html = '';
                //ovariables.JSONGuardar = _json;
                //ovariables.auxorden = _json[_json.length - 1].id;
                //<button class="btn btn-sm btn-danger cls_disabled_por_proveedor" onclick="appNewSDT.fn_EliminarColor(${x.id})">
                _json.forEach(x => {
                    html += `<tr>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-danger cls_disabled_por_proveedor" onclick="appNewSDT.fn_EliminarColor(this)">
                                        <span class="fa fa-trash-o"></span>
                                    </button>
                                </td>
                                <td class='cls_td_nroorden_color'>${x.id}</td>
                                <td class='cls_td_color'>${x.color}</td>
                                <td class='cls_td_peso'>${x.peso}</td>
                                <td class='cls_td_discharge'>${x.discharge}</td>
                        </tr>`;
                });
                _('tbody_colornew').innerHTML = html;
            }
        }

        function fn_set_nroorden_tbl_color(tbody) {
            let arrfilas = Array.from(tbody.rows);
            arrfilas.forEach((x, index) => {
                x.getElementsByClassName('cls_td_nroorden_color')[0].innerText = (index + 1);
            });
        }

        function fn_NewColor() {
            let req_enty = _required({ clase: '_enty_color_json', id: 'panelEncabezado_SDT' });

            if (req_enty) {
                let tbody_color = _('tbody_colornew'), color = _('txtcolornew').value, peso = _('txtpesonew').value, discharge = _('txtdischargenew').value;
                //ovariables.auxorden++;
                //let json = { id: ovariables.auxorden, color: _('txtcolornew').value, peso: _('txtpesonew').value, discharge: _('txtdischargenew').value }
                //ovariables.JSONGuardar.push(json);
                //<button class="btn btn-sm btn-danger cls_disabled_por_proveedor" onclick="appNewSDT.fn_EliminarColor(${json.id})">
                let html = `<tr>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-danger cls_disabled_por_proveedor" onclick="appNewSDT.fn_EliminarColor(this)">
                                        <span class="fa fa-trash-o"></span>
                                    </button>
                                </td>
                                <td class='cls_td_nroorden_color'></td>
                                <td class='cls_td_color'>${color}</td>
                                <td class='cls_td_peso'>${peso}</td>
                                <td class='cls_td_discharge'>${discharge}</td>
                        </tr>`;
                tbody_color.insertAdjacentHTML('beforeend', html);
                fn_set_nroorden_tbl_color(tbody_color);

                // Limpia campos
                _('txtcolornew').value = '';
                _('txtpesonew').value = '';
            }
        }

        function get_array_color_para_grabar() {
            let tbody_color = _('tbody_colornew'), arr_filas = Array.from(tbody_color.rows),
                arr_return = [];

            arr_filas.forEach(x => {
                let nroorden = x.getElementsByClassName('cls_td_nroorden_color')[0].innerText.trim(),
                    color = x.getElementsByClassName('cls_td_color')[0].innerText.trim(),
                    peso = x.getElementsByClassName('cls_td_peso')[0].innerText.trim(),
                    discharge = x.getElementsByClassName('cls_td_discharge')[0].innerText.trim(),
                    obj = {
                        id: nroorden,
                        color: color,
                        peso: peso,
                        discharge: discharge
                    };

                arr_return.push(obj);
            });
            return arr_return;
        }

        function fn_EliminarColor(o) {
            let fila = o.parentNode.parentNode, tbody_color = _('tbody_colornew');
            fila.parentNode.removeChild(fila);
            fn_set_nroorden_tbl_color(tbody_color);

            //for (var i = 0; i < _('tbody_colornew').rows.length; i++) {
            //    let idrow = _('tbody_colornew').children[i].children[0].textContent
            //    if (idrow == id) {
            //        let rowindex = _('tbody_colornew').children[i].rowIndex - 1;
            //        ovariables.JSONGuardar = ovariables.JSONGuardar.filter(x => x.id !== _parseInt(idrow))
            //        _('tbody_colornew').deleteRow(rowindex);
            //    }
            //}
        }

        function fn_AgregarLeadtime(odata_detalleproveedor) {
            let html = '';
            if (ovariables.idgrupocomercial === 11) {
                let select_html = '';
                let _jsonProceso = ovariables.procesorutatela;
                _jsonProceso.forEach(x => {
                    select_html += `<option value="${x.idprocesorutatela}">${x.nombre}</option>`;
                });

                html = `<div class="col-sm-6">
                            <div class="form-group">
                                <label class="control-label col-sm-3">Agregar Proceso</label>
                                <div class="col-sm-9">
                                    <div class="input-group">
                                        <select class="form-control _cbo_proceso_rutatela_leadtime" id="cboNuevoProveedorLeadtime" data-idproveedor='${odata_detalleproveedor.idproveedor}'>
                                            ${select_html}
                                        </select>
                                        <span class="btn btn-sm btn-success input-group-addon" onclick="appNewSDT.fn_NewLeadtime(this)">
                                            <span class="fa fa-plus-circle"></span>
                                        </span>
                                        <span class="btn btn-sm btn-primary input-group-addon" data-idproveedor='${odata_detalleproveedor.idproveedor}' onclick="appNewSDT.fn_AddLeadtime(this)">
                                            <span class="fa fa-check"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 hide">
                            <div class="form-group">
                                <div class="col-sm-12">
                                    <div class="input-group">
                                        <input type="text" class="form-control" style="text-transform: uppercase;">
                                        <span class="btn btn-sm btn-success input-group-addon" onclick="appNewSDT.fn_SaveLeadtime(this)">
                                            <span class="fa fa-save"></span>
                                            Grabar
                                        </span>
                                        <span class="btn btn-sm btn-danger input-group-addon" onclick="appNewSDT.fn_CloseLeadtime(this)">
                                            <span class="fa fa-close"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            }
            return html;
        }

        function fn_NewLeadtime(button) {
            let div_col = button.parentElement.parentElement.parentElement.parentElement;
            let div_oculto = div_col.nextElementSibling;
            div_oculto.classList.remove('hide');
        }

        function fn_CloseLeadtime(button) {
            let div_col = button.parentElement.parentElement.parentElement.parentElement;
            div_col.classList.add('hide');
        }

        function fn_AddLeadtime(button) {
            // General
            //let table = button.parentElement.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0].children[0].children[0].children[0];
            //let tbody = table.children[1];
            //let select_tag = button.previousElementSibling.previousElementSibling;
            //let proceso = select_tag.options[select_tag.selectedIndex].textContent;

            // Para json
            let idproveedor = button.getAttribute('data-idproveedor'); //table.getAttribute("data-idproveedor");
            let div_contenedor_padre = _('tab_content_fabrica_complementos').getElementsByClassName('cls_subdiv_leadtime_' + idproveedor)[0],
                datapar = div_contenedor_padre.getAttribute('data-par'), idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'), cbo_proceso_rutatela = div_contenedor_padre.getElementsByClassName('_cbo_proceso_rutatela_leadtime')[0],
                tbody_leadtime = div_contenedor_padre.getElementsByClassName('clstblbody_leadtime')[0], arr_filas = Array.from(tbody_leadtime.rows);

            //idsolicituddetalledesarrollotela:48,idsolicituddesarrollotela:33,tipo:telaprincipal
            let idproceso = cbo_proceso_rutatela.value; //select_tag.value;
            let proceso = cbo_proceso_rutatela.options[cbo_proceso_rutatela.selectedIndex].text;
           
            // Validar si existe proceso en tabla
            let bool_segregoproceso = false;
            arr_filas.forEach(x => {
                let datapar_row = x.getAttribute('data-par'), par_idproceso = _par(datapar_row, 'idprocesorutatela');
                if (par_idproceso === idproceso) {
                    bool_segregoproceso = true;
                }
            });
            
            if (!bool_segregoproceso) {
                swal({
                    html: true,
                    title: "Agregar Proceso a Leadtime",
                    text: "¿Estas seguro/a que añadir el proceso " + proceso + " al Leadtime?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idsolicituddesarrollotela: idsolicituddesarrollotela,
                            idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                            idproceso: idproceso,
                            idproveedor: idproveedor
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/SaveData_AgregarProceso', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "El proceso ya existe en el Leadtime", type: "warning" });
            }
        }

        function fn_SaveLeadtime(button) {
            let nuevoproceso = button.previousElementSibling.value;
            if (_isnotEmpty(nuevoproceso)) {
                swal({
                    html: true,
                    title: "Crear Nuevo Proceso",
                    text: "¿Estas seguro/a que deseas crear el nuevo proceso " + nuevoproceso + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            nuevoproceso: nuevoproceso
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/SaveData_CrearProceso', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "El campo no puede estar vacio", type: "warning" });
            }
        }

        function fn_EliminarLeadtime(button) {
            let row = button.parentElement.parentElement;
            let proceso = row.children[3].textContent;
            let idleadtime = button.getAttribute("data-id");
            swal({
                html: true,
                title: "Eliminar Proceso",
                text: "¿Estas seguro/a que deseas eliminar el proceso " + proceso + "?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idleadtime: idleadtime };
                _Get('DesarrolloTextil/SolicitudDesarrolloTela/DeleteData_BorrarProceso?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        if (resultado !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });
                            req_ini();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_CrearBotonDesarrolloWTS(estadowts, idprocesorutatela, nombreproceso, idsolicituddesarrollotelaLeadtimes) {
            let html = '';
            // Solo si es desarrollo textil puede ver botones
            if (ovariables.perfiles.includes('Desarrollo Textil')) {
                if (estadowts === 'CREADO') {
                    html = `<button class="btn btn-sm btn-white" title="Asignar" onclick="appNewSDT.fn_AsignarOperador(this)" data-par="idprocesorutatela:${idprocesorutatela},nombreproceso:${nombreproceso},idsolicituddesarrollotelaLeadtimes:${idsolicituddesarrollotelaLeadtimes}">
                            <span class="fa fa-street-view"></span>
                        </button>`;
                } else if (estadowts === 'PENDIENTE') {
                    html = `<button class="btn btn-sm btn-warning" title="Pendiente" onclick="appNewSDT.fn_TerminarOperador(this)" data-par="idprocesorutatela:${idprocesorutatela},nombreproceso:${nombreproceso},idsolicituddesarrollotelaLeadtimes:${idsolicituddesarrollotelaLeadtimes}">
                            <span class="fa fa-check"></span>
                        </button>`;
                } else if (estadowts === 'COMPLETADO') {
                    html = `<button class="btn btn-sm btn-success" title="Completado" style="pointer-events: none;">
                            <span class="fa fa-check"></span>
                        </button>`;
                }
            }

            return html;
        }

        function fn_CrearSelectProveedor(idfabricadesarrollowts) {
            let proveedores = ovariables.lstproveedor;
            let html = '<select class="form-control listaProveedores"><option></option>';
            proveedores.forEach(x => {
                if (x.idproveedor === idfabricadesarrollowts) {
                    html += `<option value="${x.idproveedor}" selected>${x.nombreproveedor}</option>`;
                } else {
                    html += `<option value="${x.idproveedor}">${x.nombreproveedor}</option>`;
                }
            });

            return html + '</select>';
        }

        function fn_TerminarOperador(button) {
            let rowIndex = button.parentElement.parentElement.rowIndex - 1;
            let fabrica = $(".listaProveedores").eq(rowIndex).val();
            //let fabrica = $(".listaProveedores").eq(rowIndex).select2('val');
            if (fabrica !== null && fabrica !== '') {
                let parentRow = button.parentElement.parentElement;
                let texto = parentRow.children[8].children[0].value;

                let par = button.getAttribute('data-par');
                let idprocesorutatela = _par(par, 'idprocesorutatela');
                let nombreproceso = _par(par, 'nombreproceso');
                let idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes');

                _modalBody({
                    url: 'DesarrolloTextil/SolicitudDesarrolloTela/_TerminarProcesoLeadTime',
                    ventana: '_TerminarProcesoLeadTime',
                    titulo: 'Terminar Proceso',
                    parametro: `idprocesorutatela:${idprocesorutatela},nombreproceso:${nombreproceso},idsolicituddesarrollotelaLeadtimes:${idsolicituddesarrollotelaLeadtimes},estadowts:COMPLETADO,texto:${texto},fabrica:${fabrica}`,
                    ancho: '',
                    alto: '',
                    responsive: 'modal-lg'
                });
            } else {
                swal({ title: "Advertencia", text: "Tienes que seleccionar una fabrica", type: "warning" });
            }
        }

        function fn_AsignarOperador(button) {
            let rowIndex = button.parentElement.parentElement.rowIndex - 1;
            let fabrica = $(".listaProveedores").eq(rowIndex).val();
            if (fabrica !== null && fabrica !== '') {
                let par = button.getAttribute('data-par');
                let idprocesorutatela = _par(par, 'idprocesorutatela');
                let nombreproceso = _par(par, 'nombreproceso');
                let idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes');

                _modalBody({
                    url: 'DesarrolloTextil/CotizarTela/_AsignarCotizacion',
                    ventana: '_AsignarCotizacion',
                    titulo: 'Asignar Solicitud',
                    parametro: `idprocesorutatela:${idprocesorutatela},nombreproceso:${nombreproceso},idsolicituddesarrollotelaLeadtimes:${idsolicituddesarrollotelaLeadtimes},estadowts:PENDIENTE,fabrica:${fabrica}`,
                    ancho: '',
                    alto: '',
                    responsive: 'modal-md'
                });
            } else {
                swal({ title: "Advertencia", text: "Tienes que seleccionar una fabrica", type: "warning" });
            }
        }

        //function fn_AgregarProyecto() {
        //    // Valores iniciales
        //    _('div_proyecto') !== null ? _('div_proyecto').remove() : null;
        //    ovariables.idproyecto = '';

        //    let datosnuevosdesarrollo = _('tab_usu_comercial').children[0].children[3];

        //    let html = `<div class="ibox" id="div_proyecto">
        //                    <div class="ibox-title">
        //                        <div class="ibox-tools">
        //                            <h5 class="text-navy bold">Datos Proyecto</h5>
        //                            <a class="collapse-link">
        //                                <span class="fa fa-chevron-up icono_collapse"></span>
        //                            </a>
        //                        </div>
        //                    </div>
        //                    <div class="ibox-content">
        //                        <div class="form-horizontal">
        //                            <div class="form-group">
        //                                <div class="col-sm-12">
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">N° Proyecto</label>
        //                                            <div class="col-sm-8">
        //                                                <div class="input-group">
        //                                                    <input type="text" class="form-control" id="txtcodigopry" style="text-transform: uppercase;">
        //                                                    <div class="input-group-btn">
        //                                                        <button type="button" class="btn btn-primary" id="btnBuscarPry">
        //                                                            <span class="fa fa-search"></span>
        //                                                        </button>
        //                                                    </div>
        //                                                </div>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">Proyecto</label>
        //                                            <div class="col-sm-8">
        //                                                <label class="control-label" id="txtproyecto" style="color: #337ab7;"></label>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                </div>
        //                                <div class="col-sm-12">
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">Descripcion</label>
        //                                            <div class="col-sm-8">
        //                                                <input type="text" class="form-control _enty" id="txtdescripcionpry" data-min="1" data-max="2000" data-required="true" data-id="txtcodigopry" disabled>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">Cliente</label>
        //                                            <div class="col-sm-8">
        //                                                <input type="text" class="form-control _enty" id="txtclientepry" data-min="1" data-max="2000" data-required="true" data-id="txtcodigopry" disabled>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                </div>
        //                                <div class="col-sm-12">
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">Fecha Aprobación</label>
        //                                            <div class="col-sm-8">
        //                                                <input type="text" class="form-control _enty" id="txtaprobacionpry" data-min="1" data-max="2000" data-required="true" data-id="txtcodigopry" disabled>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                    <div class="col-sm-4">
        //                                        <div class="form-group">
        //                                            <label class="control-label col-sm-4">Estado</label>
        //                                            <div class="col-sm-8">
        //                                                <input type="text" class="form-control _enty" id="txtestadopry" data-min="1" data-max="2000" data-required="true" data-id="txtcodigopry" disabled>
        //                                            </div>
        //                                        </div>
        //                                    </div>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </div>
        //                </div>`;

        //    datosnuevosdesarrollo.insertAdjacentHTML('afterend', html);
        //    _('btnBuscarPry').addEventListener('click', fn_BuscarPry);
        //}

        function fn_BuscarPry() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { codigo: _('txtcodigopry').value };
            _Get('DesarrolloTextil/SolicitudDesarrolloTela/GetData_Proyecto?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstproyectos = rpta;
                        if (ovariables.lstproyectos.length === 1) {
                            rpta = rpta[0];
                            ovariables.lstproyectos = rpta;
                            _('txtproyecto').innerHTML = rpta.Codigo;
                            _('txtdescripcionpry').value = rpta.Descripcion;
                            _('txtclientepry').value = rpta.NombreCliente;
                            _('txtaprobacionpry').value = rpta.FechaAprobacion;
                            _('txtestadopry').value = rpta.Estado;
                            ovariables.idproyecto = rpta.IdProyecto;
                        } else {
                            _('txtproyecto').innerHTML = '';
                            _('txtdescripcionpry').value = '';
                            _('txtclientepry').value = '';
                            _('txtaprobacionpry').value = '';
                            _('txtestadopry').value = '';
                            ovariables.idproyecto = '';

                            // Se crea modal
                            _modalBody({
                                url: 'DesarrolloTextil/SolicitudDesarrolloTela/_BuscarProyecto',
                                ventana: '_BuscarProyecto',
                                titulo: 'Buscar Proyecto',
                                parametro: ``,
                                ancho: '',
                                alto: '',
                                responsive: 'modal-lg'
                            });
                        }
                    } else {
                        swal({ title: "Advertencia", text: "El Codigo no existe o no se encuentra Aprobado", type: "warning" });
                    }
                }, (p) => { err(p); });
        }
        /*  //// ACTIVAR LUEGO ESTE BLOQUE PARA SWATCH
        function fn_seleccionar_tipo_producto_a_desarrollar(tipo_tela_o_swatch) {
            let arr_opt_tipo = Array.from(_('panelEncabezado_SDT').getElementsByClassName('_clschk_tipo_desarrollo'));

            arr_opt_tipo.some(x => {
                x.parentNode.classList.remove('checked');
                if (x.value === tipo_tela_o_swatch) {
                    x.checked = true;
                    x.parentNode.classList.add('checked');
                    return true;
                }
            });
        }

        function fn_gettipoproducto_a_desarrollar() {
            let arr_opt_tipo = Array.from(_('panelEncabezado_SDT').getElementsByClassName('_clschk_tipo_desarrollo')),
                tipo = '';

            arr_opt_tipo.some(x => {
                if (x.checked) {
                    tipo = x.value;
                    return true;
                }
            });

            return tipo;
        }

        function fn_setear_valores_segun_tipo_producto_a_desarrollar(tipo) {
            let arr_div_swatch = Array.from(_('tab_usu_comercial').getElementsByClassName('cls_div_dato_swatch')),
                txt_numero_galga = _('txtgalga'), arr_divs_telaprincipal = Array.from(_('tab_usu_comercial').getElementsByClassName('cls_divs_tab_telaprincipal')),
                arr_divs_complementos = Array.from(_('tab_usu_comercial').getElementsByClassName('cls_div_complementos')),
                arr_inputs_div_requiereanalisis = Array.from(_('div_analisis_laboratorio').getElementsByClassName('cls_input_div_requiereanalisis_disabled')),
                chk_requiereanalisis = _('chk_requiereanalisis'), arr_divs_color_para_ocultar = Array.from(_('div_color').getElementsByClassName('cls_div_color_hide')),
                arr_inputs_color_required = Array.from(_('div_color').getElementsByClassName('cls_input_color_required'));

            arr_divs_telaprincipal.forEach(x => {
                x.classList.remove('hide');
            });

            if (tipo === 'TELA') {
                arr_div_swatch.forEach(x => {
                    x.classList.add('hide');
                });
                _('lbl_estructura_punto').innerText = 'Estructura';
                txt_numero_galga.setAttribute('data-required', false)
                chk_requiereanalisis.checked = true;
                chk_requiereanalisis.parentNode.classList.add('checked');

                arr_inputs_div_requiereanalisis.forEach(x => {
                    x.disabled = false;
                });

                arr_divs_complementos.forEach(x => {
                    x.classList.remove('hide');
                });
                _('div_proyecto').classList.remove('hide');
                arr_divs_color_para_ocultar.forEach(x => {
                    x.classList.remove('hide');
                });
                arr_inputs_color_required.forEach(x => {
                    x.setAttribute('data-required', true);
                });
            } else if (tipo === 'SWATCH') {
                change_conatx_ini_edit(false);

                arr_div_swatch.forEach(x => {
                    x.classList.remove('hide');
                });
                _('lbl_estructura_punto').innerText = 'Punto';
                txt_numero_galga.setAttribute('data-required', true)
                chk_requiereanalisis.checked = false;
                chk_requiereanalisis.parentNode.classList.remove('checked');

                arr_inputs_div_requiereanalisis.forEach(x => {
                    x.disabled = true;
                });

                arr_divs_complementos.forEach(x => {
                    x.classList.add('hide');
                });
                _('div_proyecto').classList.add('hide');
                arr_divs_color_para_ocultar.forEach(x => {
                    x.classList.add('hide');
                });
                arr_inputs_color_required.forEach(x => {
                    x.setAttribute('data-required', false);
                });
            }
        }
        */

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            //fn_change_chknoexistebddesarrollotela: fn_change_chknoexistebddesarrollotela,
            //set_chk_icheck: set_chk_icheck,
            fn_replicar_leadtime_solicitudpadre: fn_replicar_leadtime_solicitudpadre,
            fn_cargartemporadaxcliente: fn_cargartemporadaxcliente,
            fn_AsignarOperador: fn_AsignarOperador,
            fn_TerminarOperador: fn_TerminarOperador,
            getdetalle_leadtime_telaprincipal_complementos: getdetalle_leadtime_telaprincipal_complementos,
            // Jacob
            fn_EliminarColor: fn_EliminarColor,
            fn_EliminarLeadtime: fn_EliminarLeadtime,
            fn_NewLeadtime: fn_NewLeadtime,
            fn_AddLeadtime: fn_AddLeadtime,
            fn_SaveLeadtime: fn_SaveLeadtime,
            fn_CloseLeadtime: fn_CloseLeadtime
        }
    }
)(document, 'panelEncabezado_SDT');

(
    function ini() {
        appNewSDT.load();
        appNewSDT.req_ini();
    }
)();
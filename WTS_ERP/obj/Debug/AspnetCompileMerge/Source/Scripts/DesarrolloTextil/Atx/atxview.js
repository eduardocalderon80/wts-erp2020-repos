/// <reference path="atxview.js" />

var appAtxView = (
    function (d, idpadre) {
        var ovariables = {
            accion: '',
            idsolicitud: '',
            idatx: '',
            idanalisistextilsolicitud: '',
            lstcbotitulo: [],
            lstcbohilado: [],
            lstcboformahilado: [],
            lstcbosystem: [],
            lstligamentos: [],
            lstestados_tipocolor_materiaprima: [],
            dragSrcEl: null,
            lstobjarrastrar: [],
            bool_ctrl_seleccionado: false,
            bool_shift_seleccionado: false,
            lstcbo_posicionligamento: [],
            lst_pobuycolor_materiaprima: [],
            lst_cbo_diametrogalga: [],
            lstmateriaprima: [],
            contador_click_shift: 0,
            numerocolumna_seleccionado_inicio_shift: 0,
            numerocolumna_seleccionado_fin_shift: 0,
            filapasada_seleccionado_shift: [],  //// ACA VOY A REGISTRAR TANTO EL INICIO COMO EL FIN DE LA SELECCION
            //pista_seleccionado_shift: [],      //// ACA VOY A REGISTRAR TANTO EL INICIO COMO EL FIN DE LA SELECCION
            filageneral_pasada_seleccionado_shift: [], //// ACA VOY A REGISTRAR TANTO EL INICIO COMO EL FIN DE LA SELECCION
            estadoactual_btn_editaatx: '',
            lstacabadofisico: [],
            lstacabadoquimico: [],
            lstunidadmedida: [],
            lstpretratamiento: [],
            lsttipotenido: [],
            finalizaratx: '',
            estado_actual_solicitud: '',
            estados_enum_retorno: { POR: 'atx_por_operar', EN: 'atx_en_proceso', F: 'finalizado' },
            obj_a_version: {},
            obj_b_version: {},
            obj_a_correlativo: {},
            obj_b_correlativo: {},
            enums_acabadofisico_validcodigotela: { Esmerilado: 3, Perchado: 5, Tundido: 6 },
            //// ESTAS VARIABLES SON PARA COMPARAR SI HUBO CAMBIO EN LA EDICION
            obj_actual_version: {},
            obj_actual_correlativo: {},
            escolgador: '',
            codigoabrevfamilia_codigotela: '',
            lstfamilia: [],
            nombrefamilia: '',
            idservicio: ''
        }

        function load() {
            let par = _('txtpar_editatx').value, conhilado = '';
            _('_title').innerText = 'ATX';
            if (!_isEmpty(par)) {
                ovariables.accion = _par(par, 'accion');
                ovariables.idsolicitud = $.trim(_par(par, 'idsolicitud'));
                ovariables.idanalisistextilsolicitud = $.trim(_par(par, 'idanalisistextilsolicitud'));
                ovariables.estadoactual_btn_editaatx = _par(par, 'estadoactual');
                ovariables.finalizaratx = _par(par, 'finalizaratx');
                ovariables.estado_actual_solicitud = _par(par, 'estadoactual');
                _('hf_idatx').value = _par(par, 'idanalisistextil');
                ovariables.idatx = _par(par, 'idanalisistextil');
                if (ovariables.finalizaratx === 'si') {
                    _('_title').innerText = 'ATX - FINALIZAR';
                }
                _('hf_escolgador').value = _par(par, 'escolgador');
                ovariables.escolgador = _par(par, 'escolgador');
                _('hf_idcolgadorsolicituddetalle_codigogenerado').value = _par(par, 'idcolgadorsolicituddetalle_codigogenerado');
                _('hf_idservicio').value = _par(par, 'idservicio');
                ovariables.idservicio = _par(par, 'idservicio');
            }

            if (ovariables.idatx !== '' && ovariables.idatx !== '0') {
                _('_btn_print_atx').classList.remove('hide');
            }

            if (ovariables.accion === 'new') {
                _('_btn_save_new_atx').classList.remove('hide');

                $("#txtanalisiscomentario").kendoEditor({
                    resizable: {
                        content: true,
                    },
                    tools: [
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "justifyLeft",
                        "justifyCenter",
                        "justifyRight",
                        "justifyFull",
                        "insertUnorderedList",
                        "insertOrderedList",
                        "indent",
                        "outdent",
                        "subscript",
                        "superscript",
                        "formatting",
                        "fontName",
                        "fontSize",
                        "foreColor",
                        "backColor",
                        "cleanFormatting"
                    ]
                });
                if (ovariables.escolgador === 'escolgador') {
                    seleccionar_radio_conhilado(1);
                    conhilado = '1';
                    _('lbl_conhilado_conanalisis').classList.add('hide');
                } else if (ovariables.escolgador === 'escotizacion'){
                    seleccionar_radio_conhilado(0);
                    conhilado = '0';
                } else {
                    seleccionar_radio_conhilado(0);
                    conhilado = '0';
                }
                fn_visualizar_ocultar_segun_conhilado_seleccionado(conhilado);
            } else if (ovariables.accion === 'edit') {
                _('_btn_save_update_atx').classList.remove('hide');

                if (ovariables.escolgador === 'escolgador') {
                    seleccionar_radio_conhilado(1);
                    conhilado = '1';
                    _('lbl_conhilado_conanalisis').classList.add('hide');
                } else if (ovariables.escolgador === 'escotizacion') {
                    seleccionar_radio_conhilado(0);
                    conhilado = '0';
                } else {
                    seleccionar_radio_conhilado(0);
                    conhilado = '0';
                }
                fn_visualizar_ocultar_segun_conhilado_seleccionado(conhilado);
            }

            let arrcollapse = Array.from(d.getElementsByClassName('collapse-link'));
            arrcollapse.forEach(x => x.addEventListener('click', e => { fn_colapsardivs(e) }));

            _('btnaddyarndetail').addEventListener('click', fn_addyarndetail);
            _('btn_addligamentos').addEventListener('click', fn_verligamentos);
            _('btn_crearacabadofisico').addEventListener('click', fn_crearacabadofisico);
            _('btn_crearacabadoquimico').addEventListener('click', fn_crearacabadoquimico);
            _('btn_creargalga').addEventListener('click', fn_creargalga);
            _('btn_creargalgadiametro').addEventListener('click', fn_creargalgadiametro);
            _('btn_crearpretatamiento').addEventListener('click', fn_crearpretratamiento);
            _('btn_creartipotenido').addEventListener('click', fn_creartipotenido);

            _('_btnreturn_atx').addEventListener('click', returnIndex, false);
            _('_btn_print_atx').addEventListener('click', function (e) { let idsolicitud = ovariables.idsolicitud, idatx = _('hf_idatx').value; print_atx(idsolicitud, idatx); }, false);
            _('btn_print_atxestandar').addEventListener('click', function (e) { let o = e.currentTarget; datapar = o.getAttribute('data-par'); idsolicitud = _par(datapar, 'idsolicitud'), idatx = _par(datapar, 'idatx'); print_atx(idsolicitud, idatx); });

            /*:CTRL - MOUSE*/
            document.addEventListener('keydown', handlerkeydown, false);
            document.addEventListener('keyup', handlerkeyup, false);
            _('btn_generarmatrizligamentos').addEventListener('click', generarMatriz_new, false);
            _('_lnk_view_crearhilado').addEventListener('click', fn_view_crearhilado)

            // RADIO BUTTON
            $('.i-checks._group_wash_lavado').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget;
            });

            // RADIO BUTTON
            $('.i-checks._group_conhilado').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valorconhilado');
                //// QUITAR 
                seleccionar_radio_conhilado(valor);
                fn_visualizar_ocultar_segun_conhilado_seleccionado(valor);
            });

            _('cbometododensidad').addEventListener('change', function (e) { let o = e.currentTarget; fn_change_metododensidad(o) }, false);
            _('txtAnalisisPeso').addEventListener('keyup', calculardensidad, false);
            _('_btn_save_new_atx').addEventListener('click', (e) => { let o = e.currentTarget; fn_save_new_atx(o); }, false);
            _('_btn_save_update_atx').addEventListener('click', fn_save_edit_atx, false);
            _('_btn_reenviar_atx').addEventListener('click', (e) => {
                let o = e.currentTarget;

                //// AL REENVIAR SE DEBE FINALIZAR EL ATX Y OBLIGAR LOS DATOS OBLIGATORIOS
                ovariables.finalizaratx = 'si';
                fn_ini_finalizaratx();
                fn_save_new_atx(o);
            }, false);
            _('btnadd_titulo_sinhilado').addEventListener('click', fn_add_titulo_sinhilado, false);
            _('btnadd_contenido_sinhilado').addEventListener('click', fn_add_contenido_sinhilado, false);

            _('fupArchivo').addEventListener('change', fn_change_file_imagenestructura, false);
            _('fupimagenmuestra').addEventListener('change', fn_change_file_imagenmuestra_fisica, false);
            _('btnImagenEliminar').addEventListener('click', fn_eliminar_imagenestructura, false);
            _('btnImagenMuestraEliminar').addEventListener('click', fn_eliminar_imagenmuestrafisica, false);
            _('cbogalga').addEventListener('change', fn_change_cbogalga, false);
            _('btn_combinar_descombinar_pasadas').addEventListener('click', fn_combinar_descombinar_pasadas, false);
            _('cboacabadofisico').addEventListener('change', fn_change_cbo_acabadofisico, false);
            _('cboacabadoquimico').addEventListener('change', fn_change_cbo_acabadoquimico, false);
            _('cbofamilia').addEventListener('change', fn_change_cbo_familia, false);
            _('txtanalisisarea').addEventListener('keyup', calculardensidad, false);
            //// PARA EL CALCULO DE ANCHO UTIL
            _('cbodiameter').addEventListener('change', fn_change_cbodiametro, false);
            _('cbounidad').addEventListener('change', handler_calculo_anchocuttable, false);
            _('cbometodoancho').addEventListener('change', function (e) { let o = e.currentTarget; fn_change_cbometodoancho_textilfinish(o) }, false);
            _('txtcolumnasporpulgada').addEventListener('keyup', handler_calculo_anchocuttable, false);
            _('btn_buscarxreportelaboratorio').addEventListener('click', handler_obtenercamposxreportelaboratorio, false);

            if (ovariables.finalizaratx === 'si') {
                fn_ini_finalizaratx();
            }

            if (ovariables.estado_actual_solicitud === 'POR') {  // POR OPERAR CON RECHAZO; 
                _('_btn_reenviar_atx').classList.remove('hide');
            }

            setallinputs_onfocus('_enty');

            $("#txtcolumnasporpulgada").autoNumeric('init', { mDec: 2 });
            $("#txtcursasporpulgada").autoNumeric('init', { mDec: 2 });
            $("#txtanchoabiertototal").autoNumeric('init', { mDec: 2 });
            $("#txtanchoabiertoutil").autoNumeric('init', { mDec: 2 });

            $("#chk_correo_consignacion").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            if (ovariables.idservicio === '12') {
                //// SOLICITUD DE COLGADOR
                fn_ini_finalizaratx();
            }
        }

        function fn_ini_finalizaratx() {
            let arrinput_required = Array.from(_('panelEncabezado_atx').getElementsByClassName('cls_input_obligatorio'));
            arrinput_required.forEach(x => {
                x.setAttribute('data-required', 'true');
            });
            _rules({ id: 'panelEncabezado_atx', clase: '_enty' });
        }

        function fn_change_cbometodoancho_textilfinish(o) {
            let txtnumeroagujas = _('txtnumeroaguja'), numeroagujas = txtnumeroagujas.value !== '' ? txtnumeroagujas.value : 0,
                idunidadmedida = _('cbounidad').value, mensaje = '', pasavalidacion_nroagujas = true,
                pasavalidacion_unidadmedida = true, idancho = o.value, txtanchoabierto_total = _('txtanchoabiertototal'),  //o = e.currentTarget
                txtanchoabiertoutil = _('txtanchoabiertoutil'); 

            if (idancho === "2") { // CALCULO DE ANCHO APROXIMADO; ES AUTOMATICO
                txtanchoabierto_total.disabled = true;
                txtanchoabiertoutil.disabled = true;
                if (numeroagujas === "0" || numeroagujas === 0) {
                    mensaje = 'Seleccione el diametro para obtener el número de agujas...! \n';
                    pasavalidacion_nroagujas = false;
                }

                if (idunidadmedida === '') {
                    mensaje = 'Seleccione la unidad de medida...! \n';
                    pasavalidacion_unidadmedida = false;
                }

                if (mensaje !== '') {
                    _swal({ mensaje: mensaje, estado: 'error' });
                    return false;
                }

                handler_calculo_anchocuttable();
            } else if (idancho === "1") {
                _('txtanchoabiertototal').value = 0;
                _('txtanchoabiertoutil').value = 0;
                txtanchoabierto_total.disabled = false;
                txtanchoabiertoutil.disabled = false;
            }

        }

        function handler_calculo_anchocuttable() {
            let idunidadmedida = _('cbounidad').value, txtnumeroagujas = _('txtnumeroaguja'), numeroagujas = txtnumeroagujas.value !== '' ? txtnumeroagujas.value : 0,
                txtcolumnasporpulgada = _('txtcolumnasporpulgada'), columnasporpulgada = txtcolumnasporpulgada.value !== '' ? txtcolumnasporpulgada.value.replace(/,/g, '') : 0,
                idmetodo = _('cbometodoancho').value;

            if (idmetodo === "2") {  // APROXIMADO
                let anchoabierto_util_cuttablewidth = calcularanchocuttablewidth(numeroagujas, columnasporpulgada, idunidadmedida);  // CALCULO DEL ANCHO ABIERTO UTIL
                _('txtanchoabiertoutil').value = anchoabierto_util_cuttablewidth;
                _('txtanchoabiertototal').value = 0;
            } else if (idmetodo == "1") {
                _('txtanchoabiertototal').value = 0;
                _('txtanchoabiertoutil').value = 0;
            }

        }

        function fn_change_cbodiametro(e) {
            let o = e.currentTarget, idgalgadiametro = o.value;
            let lst = ovariables.lst_cbo_diametrogalga.filter(x => x.idgalgadiametro === idgalgadiametro);
            if (lst.length > 0) {
                _('txtnumeroaguja').value = lst[0].agujas;

            } else {
                _('txtnumeroaguja').value = 0;
            }

            handler_calculo_anchocuttable();
        }

        function fn_change_cbo_familia(e) {
            let o = e.currentTarget;
            _('txtdescfamilia').value = o.selectedIndex > 0 ? o.options[o.selectedIndex].text : '';
        }

        function fn_change_cbo_acabadoquimico(e) {
            let o = e.currentTarget, tbody = _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0],
                arrfilas = Array.from(tbody.rows), idaf = o.value, nombre = o.options[o.selectedIndex].text;

            let fn_validar_siexiste_aq = (id, arrfilas) => {
                let existe = false, mensaje = '';
                arrfilas.some(x => {
                    let par = x.getAttribute('data-par'), idaf = _par(par, 'idacabadoquimico');
                    if (idaf === id) {
                        existe = true;
                        mensaje = 'Ya se agregó...!';
                        return true;
                    }
                });
                if (mensaje !== '') {
                    _swal({ mensaje: mensaje, estado: 'error' });
                }
                return existe;
            }

            if (!fn_validar_siexiste_aq(o.value, arrfilas)) {
                // agregar 
                let html = `<tr data-par='idacabadoquimico:${idaf}'>
                                <td>
                                    <button class='btn btn-xs btn-danger cls_btn_delete_acabadoquimico'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td>${nombre}</td>
                    `;
                tbody.insertAdjacentHTML('beforeend', html);
                let indiceadd = tbody.rows.length - 1
                handler_tbl_acabadoquimico_add(indiceadd);
                o.value = '';
            }
        }

        function handler_tbl_acabadoquimico_add(indicefila) {
            let tbody = _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0];
            let btn = tbody.rows[indicefila].getElementsByClassName('cls_btn_delete_acabadoquimico')[0];
            btn.addEventListener('click', fn_delete_acabadoquimico, false);
        }

        function fn_change_cbo_acabadofisico(e) {
            let o = e.currentTarget, tbody = _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0],
                arrfilas = Array.from(tbody.rows), idaf = o.value, nombre = o.options[o.selectedIndex].text;

            let fn_validar_siexiste_af = (id, arrfilas) => {
                let existe = false, mensaje = '';
                arrfilas.some(x => {
                    let par = x.getAttribute('data-par'), idaf = _par(par, 'idacabadofisico');
                    if (idaf === id) {
                        existe = true;
                        mensaje = 'Ya se agregó...!';
                        return true;
                    }
                });
                if (mensaje !== '') {
                    _swal({ mensaje: mensaje, estado: 'error' });
                }
                return existe;
            }

            if (!fn_validar_siexiste_af(o.value, arrfilas)) {
                // agregar 
                let html = `<tr data-par='idacabadofisico:${idaf}'>
                                <td>
                                    <button class='btn btn-xs btn-danger cls_btn_delete_acabadofisico'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td>${nombre}</td>
                    `;
                tbody.insertAdjacentHTML('beforeend', html);
                let indiceadd = tbody.rows.length - 1
                handler_tbl_acabadofisico_add(indiceadd);
                o.value = '';
            }
        }

        function handler_tbl_acabadofisico_ini_edit() {
            let tbody = _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0], arrfilas = Array.from(tbody.rows);
            arrfilas.forEach(x => {
                let btn = x.getElementsByClassName('cls_btn_delete_acabadofisico')[0];
                btn.addEventListener('click', fn_delete_acabadofisico, false);
            });
        }

        function handler_tbl_acabadoquimico_ini_edit() {
            let tbody = _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0], arrfilas = Array.from(tbody.rows);
            arrfilas.forEach(x => {
                let btn = x.getElementsByClassName('cls_btn_delete_acabadoquimico')[0];
                btn.addEventListener('click', fn_delete_acabadoquimico, false);
            });
        }

        function handler_tbl_acabadofisico_add(indicefila) {
            let tbody = _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0];
            let btn = tbody.rows[indicefila].getElementsByClassName('cls_btn_delete_acabadofisico')[0];
            btn.addEventListener('click', fn_delete_acabadofisico, false);
        }

        function fn_delete_acabadofisico(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function fn_delete_acabadoquimico(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function setallinputs_onfocus(clase) {
            let arrinputs = Array.from(_('panelEncabezado_atx').getElementsByClassName(clase));
            arrinputs.forEach(x => {
                let tipoinput = x.getAttribute('type');
                if (tipoinput === 'text') {
                    x.addEventListener('focus', setfocus_inputtext, false);
                }
            });
        }

        function setallpinputs_onfocus_add(clase, indice_fila) {
            let tbody = _('tbody_yarndetail'), fila = tbody.rows[indice_fila], arrinputs = Array.from(fila.getElementsByClassName(clase));
            arrinputs.forEach(x => {
                let tipoinput = x.getAttribute('type');
                if (tipoinput === 'text') {
                    x.addEventListener('focus', setfocus_inputtext, false);
                }
            });
        }

        function setfocus_inputtext(e) {
            let o = e.currentTarget, datatype = o.getAttribute('data-type');
            if (datatype === 'int' || datatype === 'dec') {
                o.select();
            }

        }

        function fn_combinar_descombinar_pasadas(e) {
            let o = e.currentTarget, dataestacombinado = o.getAttribute('data-estacombinado'),
                filaindex_paradescombinar = o.getAttribute('data-indexfila');


            if (dataestacombinado === 'no' || dataestacombinado === null) {
                fn_combinarpasadas();
            } else if (dataestacombinado === 'si') {
                fn_descombinarpasadas(parseInt(filaindex_paradescombinar));
            }


        }

        function fn_descombinarpasadas(filaindex_paradescombinar) {
            let tbl = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0];

            let cadena_filas_combinadas = tbl.rows[filaindex_paradescombinar].getAttribute('data-filascombinadas'),
                lst_split = cadena_filas_combinadas.split(','), totalfilascombinadas = lst_split.length,
                totalfilas_a_insertar = totalfilascombinadas - 1, fila_inicio_index = filaindex_paradescombinar + 1;

            // CAMBIAR VALORES
            tbl.rows[filaindex_paradescombinar].removeAttribute('data-filascombinadas');
            tbl.rows[filaindex_paradescombinar].style.height = "80px";
            tbl.rows[filaindex_paradescombinar].getElementsByClassName('cls_txta_nrorepeticiones')[0].value = 1;
            let clase_selected_combinar = tbl.rows[filaindex_paradescombinar].getElementsByClassName('cls_td_repeticiones')[0].classList.value.indexOf('cls_selected_combinar');
            if (clase_selected_combinar > 0) {
                tbl.rows[filaindex_paradescombinar].getElementsByClassName('cls_td_repeticiones')[0].classList.remove('cls_selected_combinar');
            }

            for (let i = 0; i < totalfilas_a_insertar; i++) {
                tbl.insertRow(fila_inicio_index);
                tbl.rows[fila_inicio_index].style.height = "80px";
                tbl.rows[fila_inicio_index].setAttribute('data-par', 'idanalisistextilestructuranumrepeticiones:0');
                let html = `
                        <td class="cls_td_repeticiones">
                            <input type="text" class="form-control cls_txta_nrorepeticiones" style="width:80px; height:100%;">
                        </td>
                `;
                tbl.rows[fila_inicio_index].innerHTML = html;
                tbl.rows[fila_inicio_index].getElementsByClassName('cls_txta_nrorepeticiones')[0].addEventListener('dblclick', fn_dblclick_seleccionarpasadas_combinar, false);
                tbl.rows[fila_inicio_index].getElementsByClassName('cls_txta_nrorepeticiones')[0].addEventListener('click', fn_click_seleccionarpasadas, false);
                fila_inicio_index++;
            }
        }

        function fn_combinarpasadas() {
            let arrselected_combinar = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_selected_combinar')),
                            totalfilas_combinar = arrselected_combinar.length, totalfilas_a_quitar = totalfilas_combinar - 1;

            let pasavalidacion = validar_antes_de_combinar(totalfilas_combinar);
            if (pasavalidacion === false) {
                return false;
            }

            let fn_get_filainicio_combinacion = () => {
                let indice_fila = null;
                arrselected_combinar.some((x, indice) => {
                    if (indice === 0) {
                        let fila = x.parentNode;
                        indice_fila = fila.rowIndex - 1;
                        return true;
                    }
                });
                return indice_fila;
            };
            //// NOTA: ESTE CAMBIO YA SE PASO A PRODUCCION; QUE CORRIGE LAS REPETICIONES
            let fn_eliminar_filas_combinacion = (indicefilainicio) => {
                let temp = indicefilainicio + 1;
                let tbl_repeticiones = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0], contador = 0;
                for (let i = 0; i < totalfilas_a_quitar; i++) {
                    contador++
                    indicefilainicio++;
                    //let fila = tbl_repeticiones.rows[indicefilainicio];
                    //if (fila !== undefined) {
                    //    tbl_repeticiones.removeChild(fila);
                    //}
                    //// SE HACE ESTO PORQUE CUANDO SE ESTA ELIMINANDO FILAS DE REPETICIONES, LLEGA AL FINAL Y NO ENCUENTRA LA ULTIMA FILA 
                    //// ENTONCES LO QUE SE HACE ES A LA ULTIMA FILA AL CONTADOR LE RESTAMOS 1 Y SE ELIMINA LA FILA
                    if ((i + 1) === totalfilas_a_quitar) {
                        let fila = tbl_repeticiones.rows[temp];
                        if (fila !== undefined) {
                            tbl_repeticiones.removeChild(fila);
                        }
                        //if (fila === undefined) {
                        //    indicefilainicio = indicefilainicio - 1;
                        //    //fila = tbl_repeticiones.rows[indicefilainicio];
                        //    fila = tbl_repeticiones.rows[temp];
                        //    tbl_repeticiones.removeChild(fila);
                        //} 
                    } else {
                        let fila = tbl_repeticiones.rows[temp];
                        if (fila !== undefined) {
                            tbl_repeticiones.removeChild(fila);
                        }
                    }
                }
            }
            let fn_get_cadena_filas_combinadas = (indicefilainicio) => {
                let cadena = '', contador = 0, lst = [];
                for (let i = 0; i < totalfilas_combinar; i++) {
                    indicefilainicio++;
                    lst.push(indicefilainicio);
                }
                cadena = lst.join();
                return cadena;
            }
            let indicefila_inicio_combinacion = fn_get_filainicio_combinacion(), cadena_filas_combinadas = fn_get_cadena_filas_combinadas(indicefila_inicio_combinacion),
                tbl_repeticiones = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0],
                heighttotal = (80 * totalfilas_combinar), fila_combinada_editar = tbl_repeticiones.rows[indicefila_inicio_combinacion];
            fila_combinada_editar.style.height = `${heighttotal}px`;
            fila_combinada_editar.setAttribute('data-filascombinadas', cadena_filas_combinadas);
            //// ELIMINAR LAS FILAS
            fn_eliminar_filas_combinacion(indicefila_inicio_combinacion);
            arrselected_combinar.forEach(x => {
                //x.style.background = "white";
                x.classList.remove('bg-primary');
                x.getElementsByClassName('cls_txta_nrorepeticiones')[0].value = 2;
                x.classList.remove('cls_selected_combinar');

            });
        }

        function validar_antes_de_combinar(totalfilas_combinar) {
            let mensaje = '', pasavalidacion = true, pasavalidacion_de_cantidad_seleccionados = true, pasavalidacion_correlativo_seleccionado = true;
            if (totalfilas_combinar <= 1) {
                pasavalidacion_de_cantidad_seleccionados = false;
                mensaje += 'Para combinar se necesita mas de una pasada seleccionada.';
                pasavalidacion = false;
            }

            if (pasavalidacion_de_cantidad_seleccionados) {
                //// VALIDAR DE COMBINACION SOLO FILAS CORRELATIVAS
                let arrseleccionados = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_selected_combinar')),
                    rowindex_inicio = 0;
                arrseleccionados.some((x, indice) => {
                    if (indice == 0) {
                        let fila = x.parentNode;
                        rowindex_inicio = fila.rowIndex
                        return true;
                    }
                });

                arrseleccionados.forEach((x, indice) => {
                    let fila = x.parentNode, rowindex_contador = fila.rowIndex;
                    if (indice > 0) { // OBVIAMOS LA PRIMERA FIAL
                        rowindex_inicio++;
                        if (rowindex_inicio !== rowindex_contador) {
                            pasavalidacion_correlativo_seleccionado = false;
                            pasavalidacion = false;
                            mensaje += 'No se pueden combinar filas no correlativas';
                        }
                    }
                });
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return pasavalidacion;
        }

        function fn_change_cbogalga(e) {
            let valor = e.currentTarget.value;
            let lst = ovariables.lst_cbo_diametrogalga.filter(x => x.idgalga === valor);
            if (lst.length > 0) {
                _('cbodiameter').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idgalgadiametro', 'diametro');
            }
        }

        function fn_eliminar_imagenmuestrafisica() {
            let imagen = _('fupimagenmuestra').files[0];
            if (imagen) {
                _('fupimagenmuestra').value = '';
                _('txtimagendemuestra').value = '';
            } else {
                _('txtimagendemuestra').value = '';
            }
        }

        function fn_change_file_imagenmuestra_fisica(e) {
            let archivo = e.target.files[0], nombrearchivo = archivo.name;
            if (archivo.type.match('image.*')) {
                _('txtimagendemuestra').value = nombrearchivo;
            } else {
                _('fupimagenmuestra').value = '';
                _('txtimagendemuestra').value = '';
                _swal({ estado: 'error', mensaje: 'Seleccione solo imagenes...!' });
            }
        }

        function fn_change_file_imagenestructura(e) {
            let archivo = e.target.files[0], nombrearchivo = archivo.name;
            if (archivo.type.match('image.*')) {
                _('txtimagenestructura').value = nombrearchivo;
            } else {
                _('fupArchivo').value = '';
                _('txtimagenestructura').value = '';
                _swal({ estado: 'error', mensaje: 'Seleccione solo imagenes...!' });
            }

        }

        function fn_eliminar_imagenestructura() {
            let imagenestructura = _('fupArchivo').files[0];
            if (imagenestructura) {
                _('fupArchivo').value = '';
                _('txtimagenestructura').value = '';
            } else {
                _('txtimagenestructura').value = '';
            }
        }

        // :sarone
        function handler_obtenercamposxreportelaboratorio() {
            //txtanchoabiertoutil: B
            //txtdensidad: A

            let txttestingcode = _("txttestingcode");
            let codigoReporteLaboratorio = txttestingcode.value.trim();
            let urlaccion = 'DesarrolloTextil/Atx/GetData_PartidaTest_by_CodPartida?par=' + codigoReporteLaboratorio;
            _Get(urlaccion)
                .then((result) => {
                    if (_isEmpty(result)) {
                        swal({
                            title: 'Message',
                            text: 'El reporte tecnico no existe',
                            type: 'error'
                        })
                        txttestingcode.value = '';

                    } else {                        
                        let obj = JSON.parse(result)[0];                        
                        let cboDensidad = _('cbometododensidad'), cbometodoacabado = _('cbometodoancho');
                        cboDensidad.value = "1";
                        cbometodoacabado.value = "1";
                        fn_change_metododensidad(cboDensidad);
                        fn_change_cbometodoancho_textilfinish(cbometodoacabado);

                        _('txtdensidad').value = obj.Densidad;// :A
                        _('txtanchoabiertoutil').value = obj.AnchoAcabado; // :B
                        _('txtAnalisisPeso').value = parseFloat(parseFloat(obj.Densidad) / parseFloat(100)).toFixed(3);
                        _('txtencogimientolargo').value = obj.encogimientolargo;
                        _('txtencogimientoancho').value = obj.encogimientoancho;
                        _('txtreviradoskewness').value = obj.revirado;
                    }
                })
                                

        }



        /*:MODALS*/
        function fn_verligamentos(e) {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_VerLigamentos',
                ventana: '_VerLigamentos',
                titulo: 'Ligaments',
                parametro: '',
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_crearacabadofisico(e) {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_CrearAcabadoFisico',
                ventana: '_CrearAcabadoFisico',
                titulo: 'Acabado Fisico',
                parametro: '',
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_crearacabadoquimico(e) {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_CrearAcabadoQuimico',
                ventana: '_CrearAcabadoQuimico',
                titulo: 'Acabado Quimico',
                parametro: '',
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_creargalga(e) {
            let par = { idgalga: 0, galga: "" }, parJSON = _parameterEncodeJSON(JSON.stringify(par));
            _modalBody({
                url: 'DesarrolloTextil/Atx/_CrearGalgaDiametro',
                ventana: '_CrearGalgaDiametro',
                titulo: 'Crear Galga ',
                parametro: parJSON,
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_creargalgadiametro(e) {
            let cbogalga = $("#cbogalga").val();
            if (cbogalga !== "") {
                let texto = $("#cbogalga option:selected").html(), par = { idgalga: cbogalga, galga: texto }, parJSON = _parameterEncodeJSON(JSON.stringify(par));
                _modalBody({
                    url: 'DesarrolloTextil/Atx/_CrearGalgaDiametro',
                    ventana: '_CrearGalgaDiametro',
                    titulo: 'Crear Diametro',
                    parametro: parJSON,
                    ancho: '900',
                    alto: '',
                    fondotitulo: 'none',
                    efecto: 'none',
                    responsive: '',
                    colocarmodalenestediv: 'panelEncabezado_atx',
                    bloquearpantallaprincipal: false
                });
            } else {
                _swal({ estado: 'error', mensaje: 'Seleccionar una galga!' });
            }
        }

        function fn_crearpretratamiento(e) {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_CrearPretratamiento',
                ventana: '_CrearPretratamiento',
                titulo: 'Pretratamiento',
                parametro: '',
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_creartipotenido(e) {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_Creartipotenido',
                ventana: '_Creartipotenido',
                titulo: 'Tipo Teñido',
                parametro: '',
                ancho: '900',
                alto: '',
                fondotitulo: 'none',
                efecto: 'none',
                responsive: '',
                colocarmodalenestediv: 'panelEncabezado_atx',
                bloquearpantallaprincipal: false
            });
        }

        function fn_view_crearhilado() {
            //let sistema = $('.cls_system').val(),  titulo = $('.cls_title').val() , shapedyarn = $('.cls_shapedyarn').val();
            let filaseleccionada = _('tbody_yarndetail').getElementsByClassName('rowselected')[0];

            if (filaseleccionada === undefined) {
                _swal({ estado: 'success', mensaje: 'Falta seleccionar la fila del hilado' });
                return false;
            }

            let sistema = filaseleccionada.getElementsByClassName('cls_system')[0].value,
                titulo = _getValueDataList(filaseleccionada.getElementsByClassName('cls_title')[0].value, filaseleccionada.getElementsByClassName('cls_title')[1]), //filaseleccionada.getElementsByClassName('cls_title')[0].value,
                shapedyarn = _getValueDataList(filaseleccionada.getElementsByClassName('cls_shapedyarn')[0].value, filaseleccionada.getElementsByClassName('cls_shapedyarn')[1]); //// ARRAY 0 = INPUT DEL DATALIST; 1 = EL DATALIST //filaseleccionada.getElementsByClassName('cls_shapedyarn')[0].value;

            _modalBody({
                url: 'DesarrolloTextil/Atx/_NewHilado_FromAtx',
                ventana: '_NewHilado',
                titulo: 'New yarn',
                parametro: `accion:new,sistema:${sistema},titulo:${titulo},shapedyarn:${shapedyarn}`,
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function fn_viewmateriaprima_hilado(e) {
            let o = e.currentTarget, tag = o.tagName, fila = null, par_hilado = '', idhilado = null,
                datatable = '', parametro_datatable = '';

            if (tag === 'A' || tag === 'SPAN') {
                fila = o.parentNode.parentNode.parentNode;
            }

            if (fila !== null) {
                let guid_hilado = '';
                par_hilado = fila.getAttribute('data-par'), cbohilado = fila.getElementsByClassName('cls_yarn')[0];
                //idhilado = _par(par_hilado, 'idhilado');
                idhilado = '';
                guid_hilado = _par(par_hilado, 'guid_hilado');
                datatable = fila.getAttribute('data-table');
                //if (idhilado == '') {
                //    idhilado = fila.getElementsByClassName('cls_yarn')[0].value;
                //}
                idhilado = cbohilado.selectedIndex > 0 ? cbohilado.value : ''; //fila.getElementsByClassName('cls_yarn')[0].value;

                let p1 = {
                    idhilado: idhilado,
                    fila: fila.rowIndex - 1,
                    guid_hilado: guid_hilado,
                    tabla: `${datatable}`
                }

                let parametroencode = _parameterEncodeJSON(JSON.stringify(p1));

                _modalBody({
                    url: 'DesarrolloTextil/Atx/_ViewMateriaPrima_Hilado_FromAtx',
                    ventana: '_ViewMateriaPrima_Hilado',
                    titulo: 'View raw material',
                    parametro: parametroencode,
                    ancho: '',
                    alto: '',
                    responsive: 'modal-lg'
                });
            }
        }

        function _parameterEncodeJSON(par) {
            let p1 = par.replace(/{/g, "~").replace(/}/g, "┬");
            let p2 = p1.replace(/\"/g, "┼");  //alt + 197 = ┼
            return p2;
        }

        function _parameterUncodeJSON(par) {
            let p1 = par.replace(/~/g, "{").replace(/┬/g, "}");
            let p2 = p1.replace(/┼/g, "\""); //alt + 197 = ┼
            return p2;
        }

        function fn_viewhiladoporpasada(e) {
            let o = e.currentTarget, fila = null, indexfila = null, datatabla = '';

            fila = o.parentNode.parentNode.parentNode.parentNode;
            indexfila = fila.rowIndex - 1;
            datatabla = fila.getAttribute('data-table');

            //,tabla:${datatabla}
            //let p1 = `{"fila":"${indexfila}","tabla":${datatabla}}`;
            let p1 = {
                fila: indexfila,
                tabla: `${datatabla}`
            }

            let parametroencode = _parameterEncodeJSON(JSON.stringify(p1));

            _modalBody({
                url: 'DesarrolloTextil/Atx/_ViewHiladoPorPasada',
                ventana: '_ViewHiladoPorPasada',
                titulo: 'Yarns',
                parametro: parametroencode,
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function fn_colapsardivs(e) {
            let o = e.currentTarget, nivel_div = o.getAttribute('data-nivel'), divpadre = null;
            if (nivel_div !== '') {
                nivel_div = parseInt(nivel_div);
                if (nivel_div === 4){
                    divpadre = o.parentNode.parentNode.parentNode.parentNode;
                }
            } else {
                divpadre = o.parentNode.parentNode.parentNode;
            }
            let divcontent = divpadre.getElementsByClassName('ibox-content')[0], spntools = o.getElementsByClassName('icono_collapse')[0];
            let estaoculto = divcontent.classList.value.indexOf('hide');
            if (estaoculto < 0) {  //  ESTA VISIBLE
                divcontent.classList.add('hide');
                spntools.classList.remove('fa-chevron-up');
                spntools.classList.add('fa-chevron-down');
            } else { // ESTA OCULTO
                divcontent.classList.remove('hide');
                spntools.classList.remove('fa-chevron-down');
                spntools.classList.add('fa-chevron-up');
            }
        }

        function fn_addyarndetail(e) {
            let html = '', tblbody = _('tbody_yarndetail'), totalfilas = tblbody.rows.length + 1, guid_hilado = crearCodigoGuid();

            //// <select class ='cls_title form-control'></select>
            //// <select class ='cls_shapedyarn form-control'></select>
            html = `
                    <tr data-par='idanalisistextilhilado:0,guid_hilado:${guid_hilado}' data-table=''>
                        <td class='text-center' style='vertical-align: middle;'>
                            <button class ='btn btn-xs btn-danger cls_btn_delete_hilado'>
                                <span class='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td class='text-center cls_hilado_nro' style='vertical-align: middle;'>${totalfilas}</td>
                        <td class='text-center'>
                            <input type='text' class ='cls_length form-control _cls_inputs_tbl_hilado' placeholder='0.0' data-type='dec' />
                        </td>
                        <td class='text-center'>
                            <input type='text' class ='cls_samples form-control _cls_inputs_tbl_hilado' placeholder='0' onkeypress='return DigitosEnteros(event, this)' data-type='int' />
                        </td>
                        <td class ='text-center cls_lenghttotal'></td>
                        <td>
                            <input type='text' class ='cls_weight form-control _cls_inputs_tbl_hilado' placeholder='0.0' data-type='dec' />
                        </td>
                        <td class='text-center'>
                            <select class='cls_system form-control'></select>
                            <span class='spn_error_sistemahilado hide has-error'>Falta seleccionar el sistema</span>
                        </td>
                        <td class ='text-center cls_titleexacto'></td>
                        <td class='text-center'>
                            <input type='text' class ='cls_title form-control' list='_dl_titulo_hilado_${totalfilas}' value='' />
                            <datalist id='_dl_titulo_hilado_${totalfilas}' class ='cls_title'></datalist>
                            <span class='spn_error_titulohilado hide has-error'>Falta seleccionar el título</span>
                        </td>
                        <td class='text-center'>
                            <select class ='cls_yarn form-control'></select>
                            <span class='spn_error_yarnhilado hide has-error'>Falta seleccionar el hilado</span>
                        </td>
                        <td class ='text-center'>
                            <input type='text' class ='cls_shapedyarn form-control' list='_dl_formahilado_${totalfilas}' value='' />
                            <datalist class ='cls_shapedyarn' id='_dl_formahilado_${totalfilas}'></datalist>
                        </td>
                        <td class ='cls_fiberyarn text-center'>
                            <div class ='input-group'>
                                <a class ='cls_linkfiberyarn'></a>
                                <span type='button' class ='btn btn-sm bg-info cls_iconofiberyarn input-group-addon'>
                                    <span class ='fa fa-eye'></span>
                                </span>
                            </div>
                        </td>
                        <td class ='text-center'>
                            <input type='text' class ='cls_porcentaje form-control _cls_inputs_tbl_hilado' placeholder='0.0' data-type='dec' />
                            <span class='spn_error_porcentajehilado hide has-error'>Falta ingresar el porcentaje</span>
                        </td>
                    </tr>
                `;
            tblbody.insertAdjacentHTML('beforeend', html);

            let indicefila = tblbody.rows.length - 1;
            cargarcombos_tblyarnhilado(indicefila);
            handler_tbl_yarnhilado_add(indicefila);
            setallpinputs_onfocus_add('_cls_inputs_tbl_hilado', indicefila);
        }

        function cargarcombos_tblyarnhilado(index) {
            let fila = _('tbody_yarndetail').rows[index],
                cbosystem = fila.getElementsByClassName('cls_system')[0],
                cboformahilado = fila.getElementsByClassName('cls_shapedyarn')[1],  //// ARRAY 1 = EL DATALIST
                options_formahilado = _comboDataListFromJSON(ovariables.lstcboformahilado, 'idformahilado', 'nombreformahilado');

            cbosystem.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcbosystem, 'idsistematitulacion', 'nombresistema');
            cboformahilado.innerHTML = options_formahilado; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcboformahilado, 'idformahilado', 'nombreformahilado');
        }

        function handler_tbl_yarnhilado_add(index) {
            let fila = _('tbody_yarndetail').rows[index],
                cbosystem = fila.getElementsByClassName('cls_system')[0],
                cbotitle = fila.getElementsByClassName('cls_title')[0],
                cbohilado = fila.getElementsByClassName('cls_yarn')[0],
                cboformahilado = fila.getElementsByClassName('cls_shapedyarn')[0],
                btnvermateriaprima = fila.getElementsByClassName('cls_iconofiberyarn')[0],
                btndelete = fila.getElementsByClassName('cls_btn_delete_hilado')[0],
                txtlongitud = fila.getElementsByClassName('cls_length')[0], txtnromuestras = fila.getElementsByClassName('cls_samples')[0],
                txtpeso = fila.getElementsByClassName('cls_weight')[0], txtporcentaje = fila.getElementsByClassName('cls_porcentaje')[0];

            cbosystem.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_system(o); }, false);
            cbotitle.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_title(o); }, false);
            cbohilado.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_hilado(o); }, false);
            btnvermateriaprima.addEventListener('click', fn_viewmateriaprima_hilado, false);
            cboformahilado.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_formahilado(o); }, false);
            btndelete.addEventListener('click', fn_delete_hilado, false);

            fila.addEventListener('click', fn_seleccionar_fila_hilado, false);

            //// TEXTOS PARA FORMULAS
            txtlongitud.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(fila) }, false);
            txtnromuestras.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(fila) }, false);
            txtpeso.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(fila) }, false);
            $(txtlongitud).autoNumeric('init', { mDec: 3 });
            $(txtpeso).autoNumeric('init', { mDec: 4 });
            $(txtporcentaje).autoNumeric('init', { mDec: 2 });
        }

        function fn_delete_hilado(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;

            // ANTES DE ELIMINAR EL HILADO; ACTUALIZAR EN LOS HILADOS POR PASADA
            fn_quitar_hiladoporpasada_li(fila);

            fila.parentNode.removeChild(fila);
        }

        function fn_quitar_hiladoporpasada_li(fila_hilado) {
            let div_matriz4 = _('tbl_matriz4_hiladoporpasada'), arrli = div_matriz4 !== null ? Array.from(_('tbl_matriz4_hiladoporpasada').getElementsByClassName('cls_li_nombrehilado_completo')) : [],
                par_tbl_hilado = fila_hilado.getAttribute('data-par'), guid_hilado = _par(par_tbl_hilado, 'guid_hilado');
            //nroorden_hilado = fila_hilado.getElementsByClassName('cls_hilado_nro')[0].innerText.trim();
            if (arrli.length > 0) {
                arrli.forEach(x => {
                    let par = x.getAttribute('data-par'), guid_hilado_li = _par(par, 'guid_hilado'),
                        fila_hiladopasada = x.parentNode.parentNode.parentNode.parentNode;
                    if (guid_hilado === guid_hilado_li) {
                        x.parentNode.removeChild(x);
                    }
                    let datatabla = fila_hiladopasada.getAttribute('data-table'), tabla_parse = JSON.parse(datatabla);
                    let arrindices = [];
                    tabla_parse.some((f, i) => {
                        if (f.guid_hilado === guid_hilado) {
                            arrindices.push(i);
                            return true;
                        }
                    });
                    //let arrindices = tabla_parse.filter(f => f.guid_hilado === guid_hilado)
                    //         .map((x, index, arr) => {
                    //             return index;
                    //         });

                    if (arrindices.length > 0) {
                        let arrfilterdelete = removeMany(tabla_parse, arrindices);
                        if (arrfilterdelete.length > 0) {
                            fila_hiladopasada.setAttribute('data-table', JSON.stringify(arrfilterdelete));
                        } else {
                            fila_hiladopasada.setAttribute('data-table', '');
                        }
                    }
                });
            }
        }

        function removeMany(array, indexes) {
            return array.filter((_, idx) => indexes.indexOf(idx) === -1)
        }

        function fn_change_formahilado(o) {
            //let o = e.currentTarget
            let fila = o.parentNode.parentNode;
            fn_actualizar_hiladoporpasada_descripcionhilado(fila);
        }

        function fn_change_system(o) {
            // let o = e.currentTarget
            let valor = o.value,
                titulosfiltrados = ovariables.lstcbotitulo.filter(x => x.idsistematitulacion == valor), fila = o.parentNode.parentNode,
                cbotitulo = fila.getElementsByClassName('cls_title')[0], dl_titulo = fila.getElementsByClassName('cls_title')[1]; // array 1 para el datalist //fila.getElementsByClassName('cls_title')[0];

            cbotitulo.value = '';
            dl_titulo.innerHTML = '';
            //cbotitulo.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(titulosfiltrados, 'idtitulo', 'nombretitulo');
            let cadena_options = _comboDataListFromJSON(titulosfiltrados, 'idtitulo', 'nombretitulo');
            dl_titulo.insertAdjacentHTML('beforeend', cadena_options);

            fn_actualizar_hiladoporpasada_descripcionhilado(fila);
            fn_calculo_hilado_longitudtotal_tituloexacto_porfila(fila);
        }

        function fn_change_title(o) {
            //// let o = e.currentTarget
            let txtvalor_titulo = o.value, fila = o.parentNode.parentNode, dl_titulo = fila.getElementsByClassName('cls_title')[1], valor = _getValueDataList(txtvalor_titulo, dl_titulo), 
                cbohilado = fila.getElementsByClassName('cls_yarn')[0], valorsistema = fila.getElementsByClassName('cls_system')[0].value,
                div_contenidohilado = fila.getElementsByClassName('cls_linkfiberyarn')[0],
                hiladofiltrado = appAtxView.ovariables.lstcbohilado.filter(x => x.idtitulo === valor && x.idsistematitulacion === valorsistema);

            div_contenidohilado.innerHTML = '';
            cbohilado.innerHTML = '';
            cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(hiladofiltrado, 'idhilado', 'hilado');
            fn_actualizar_hiladoporpasada_descripcionhilado(fila);
        }

        function fn_change_hilado(o) {
            ////let o = e.currentTarget
            let valor = o.value, fila = o.parentNode.parentNode,
                cboformahilado = fila.getElementsByClassName('cls_shapedyarn')[0], div_contenidohilado = fila.getElementsByClassName('cls_linkfiberyarn')[0],
                hiladofiltrado = appAtxView.ovariables.lstcbohilado.filter(x => x.idhilado === valor), datapar = fila.getAttribute('data-par'),
                    idhilado_par = _par(datapar, 'idhilado'), dl_formahilado = fila.getElementsByClassName('cls_shapedyarn')[1];

            ///cboformahilado.value = hiladofiltrado.length > 0 ? _setValueDataList(hiladofiltrado[0].idformahilado, dl_formahilado, cboformahilado) : ''; //hiladofiltrado.length > 0 ? hiladofiltrado[0].idformahilado : '';
            cboformahilado.value = '';
            if (hiladofiltrado.length > 0) {
                _setValueDataList(hiladofiltrado[0].idformahilado, dl_formahilado, cboformahilado)
            }

            div_contenidohilado.innerHTML = hiladofiltrado.length > 0 ? hiladofiltrado[0].contenido : '';

            fn_actualizar_hiladoporpasada_descripcionhilado(fila);

            if (valor !== idhilado_par) {
                fila.setAttribute('data-table', '');
            } else if (valor === idhilado_par) {
                let datatableini = fila.getAttribute('data-tableini');
                fila.setAttribute('data-table', datatableini);
            }
        }

        function fn_actualizar_hiladoporpasada_descripcionhilado(fila_hilado) {
            let div_matriz4 = _('tbl_matriz4_hiladoporpasada'), arrspnli_hiladopasada = div_matriz4 !== null ? Array.from(_('tbl_matriz4_hiladoporpasada').getElementsByClassName('cls_spn_nombrehilado_li')) : [];
            if (arrspnli_hiladopasada.length > 0) {
                let cboformahilado = fila_hilado.getElementsByClassName('cls_shapedyarn')[0],
                descripcionformahilado = cboformahilado.value, //cboformahilado.selectedIndex > 0 ? cboformahilado.options[cboformahilado.selectedIndex].text : '',
                td_nrohilado = fila_hilado.getElementsByClassName('cls_hilado_nro')[0].innerText.trim(),
                cbotitulo = fila_hilado.getElementsByClassName('cls_title')[0],
                descripciontitulo = cbotitulo.value; //cbotitulo.options[cbotitulo.selectedIndex].text,
                cbosistema = fila_hilado.getElementsByClassName('cls_system')[0],
                descripcionsistema = cbosistema.options[cbosistema.selectedIndex].text,
                contenido = fila_hilado.getElementsByClassName('cls_linkfiberyarn')[0].innerText;

                let strhilado = descripciontitulo + ' ' + descripcionsistema + ' ' + contenido + ' ' + descripcionformahilado;

                arrspnli_hiladopasada.forEach(x => {
                    let li = x.parentNode, par_li = li.getAttribute('data-par'), li_nrohilado = _par(par_li, 'nrohilado');
                    if (li_nrohilado === td_nrohilado) {
                        x.innerText = strhilado;
                    }
                });
            }
        }

        function res_ini(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {
                // PASAR A UNA FUNCIO DE CARGA DE COMBOS
                _('hf_analisisarea').value = '';
                cargar_combos_ysetearvariablesglobales_ini(rpta);

                //// PARA LA GENERACION DE CODIGO DE TELA
                let analisistextil = CSVtoJSON(rpta[0].atx), hilados = rpta[0].tblhilados !== '' ? CSVtoJSON(rpta[0].tblhilados) : null,
                    hiladocontenido = rpta[0].tbl_hilado_contenido !== '' ? CSVtoJSON(rpta[0].tbl_hilado_contenido) : null,
                    tblpasadas = rpta[0].tblpasadas !== '' ? CSVtoJSON(rpta[0].tblpasadas) : null,
                    tblimg_ligamentos = rpta[0].tblimg_ligamentos !== '' ? CSVtoJSON(rpta[0].tblimg_ligamentos) : null,
                    tblrepeticiones = rpta[0].tblrepeticiones !== '' ? CSVtoJSON(rpta[0].tblrepeticiones) : null,
                    tblhiladoporpasada = rpta[0].tblhiladoporpasada !== '' ? CSVtoJSON(rpta[0].tblhiladoporpasada) : null,
                    atx_acabadofisico = rpta[0].analisistextil_acabadofisico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadofisico) : null,
                    atx_acabadoquimico = rpta[0].analisistextil_acabadoquimico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadoquimico) : null;

                let idmotivosolicitud = _('hf_idmotivosolicitud').value;
                if (idmotivosolicitud === '2') {
                    //// POR EL MOMENTO NO SE VA A USAR POR ATX SIN SDT
                    ////visualizar_div_criterio_evaluacion();
                    crear_objeto_cambiaversion_correlativo_ini(analisistextil, hilados, hiladocontenido, tblpasadas, tblimg_ligamentos, tblrepeticiones, tblhiladoporpasada, atx_acabadofisico, atx_acabadoquimico, 'estandar');

                    let criterioaprobacion = rpta[0].criterios_comparacion !== '' ? CSVtoJSON(rpta[0].criterios_comparacion) : null;

                    cargar_tabla_criterio_aprobacion_new(criterioaprobacion);
                }
            }
        }

        function visualizar_div_criterio_evaluacion() {
            _('div_criterio_aprobacion').classList.remove('hide');
        }

        function cargar_combos_ysetearvariablesglobales_ini(rpta) {
            let solicitud = CSVtoJSON(rpta[0].solicitud), sistema = CSVtoJSON(rpta[0].sistema), titulo = CSVtoJSON(rpta[0].titulo),
                    hilado = CSVtoJSON(rpta[0].hilado), formahilado = CSVtoJSON(rpta[0].formahilado), materiaprima = CSVtoJSON(rpta[0].materiaprima),
                    estadomateriaprima = CSVtoJSON(rpta[0].estadomateriaprima), color = rpta[0].color !== '' ? CSVtoJSON(rpta[0].color) : null, tipotela = CSVtoJSON(rpta[0].tipotela),
                    tipofontura = CSVtoJSON(rpta[0].tipofontura), galga = CSVtoJSON(rpta[0].galga), diametrogalga = CSVtoJSON(rpta[0].diametrogalga),
                    pretratamiento = CSVtoJSON(rpta[0].pretratamiento), metodotenido = CSVtoJSON(rpta[0].metodotenido),
                    tipotenido = CSVtoJSON(rpta[0].tipotenido),
                    unidadmedida = CSVtoJSON(rpta[0].unidadmedida), tipoancho = CSVtoJSON(rpta[0].tipoancho), metododensidad = CSVtoJSON(rpta[0].metododensidad),
                    proveedor = CSVtoJSON(rpta[0].proveedor), ligamentos = CSVtoJSON(rpta[0].ligamentos), cboposicionligamento = CSVtoJSON(rpta[0].posicionligamento),
                    cboposition = CSVtoJSON(rpta[0].position), acabadofisico = CSVtoJSON(rpta[0].acabadofisico), acabadoquimico = CSVtoJSON(rpta[0].acabadoquimico),
                    cbotipocolgador_basico_intermedio = CSVtoJSON(rpta[0].tipocolgador_basico_intermedio), cbotipomaquina = CSVtoJSON(rpta[0].tipomaquina);

            ovariables.lstfamilia = CSVtoJSON(rpta[0].familia); //// familia
            ovariables.lstligamentos = ligamentos;
            ovariables.lstcbo_posicionligamento = cboposicionligamento;
            ovariables.lst_cbo_diametrogalga = diametrogalga;
            ovariables.lstunidadmedida = unidadmedida;
            if (color !== null) {
                ovariables.lst_pobuycolor_materiaprima = color;
            }
            ovariables.lstestados_tipocolor_materiaprima = estadomateriaprima;
            ovariables.lstmateriaprima = materiaprima;

            _('hf_idcliente').value = solicitud[0].idcliente;
            _('hf_idmotivosolicitud').value = solicitud[0].idmotivosolicitud !== undefined ? solicitud[0].idmotivosolicitud : '';  // CON ESTE VALOR DETERMINO SI ES COMPARAR O NO EL ATX(1 = SOLO ANALIZAR LA TELA; 2 ANALIZAR Y COMPARAR LA TELA)
            _('txtnumerosolicitud').value = solicitud[0].idsolicitud;
            _('txtfechasolicitud').value = solicitud[0].fechasolicitud;
            _('txtsolicitante').value = solicitud[0].solicitante;
            _('txtorigendemuestra').value = solicitud[0].nombretipomuestra !== undefined ? solicitud[0].nombretipomuestra : '';
            _('lbl_tituloorigenmuestra').innerText = solicitud[0].nombretipomuestra !== undefined ? solicitud[0].nombretipomuestra : '';
            _('txtnombrecliente_proveedor_colgador').value = solicitud[0].tipomuestraseguncondicion !== undefined ? solicitud[0].tipomuestraseguncondicion : '';
            _('txtproveedor_de_fabrica').value = solicitud[0].proveedordefabrica !== undefined ? solicitud[0].proveedordefabrica : '';
            _('txttestingcode').value = solicitud[0].reportetecnico !== undefined ? solicitud[0].reportetecnico : '';

            // Jacob - Desactiva Tabla sin Hilado - Ficha de inspiracion
            if (solicitud[0].idmotivosolicitud === "3") {
                //$('.i-checks._group_conhilado').children().eq(1).iCheck('disable');
                $('.i-checks._group_conhilado').children().eq(1).css("display", "none");
                $('.i-checks._group_conhilado').children().eq(0).click();
            }

            if (ovariables.accion === 'new') {
                _('txtcodigoatx').value = solicitud[0].codigo_atx_fromsolicitud !== undefined ? solicitud[0].codigo_atx_fromsolicitud : '';
            }
            
            _('lbl_tituloproveedorfabrica').innerText = "Proveedor Fabrica";
            
            _('cbotipotela').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(tipotela, 'idtipotela', 'nombretipotela');
            _('cbotipofontura').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(tipofontura, 'idtipofontura', 'nombretipofontura');
            _('cbogalga').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(galga, 'idgalga', 'nombregalga');
            //_('cbodiameter').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(diametrogalga, 'idgalgadiametro', 'diametro');
            _('cbofamilia').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstfamilia, 'idfamilia', 'familia');
            _('cbopretratamiento').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(pretratamiento, 'idpretratamiento', 'nombrepretratamiento');
            _('cbometodotenido').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(metodotenido, 'idmetodotenido', 'nombremetodotenido');
            _('cbotipotenido').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(tipotenido, 'idtipotenido', 'nombretipotenido');
            _('cboacabadofisico').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(acabadofisico, 'idacabadofisico', 'nombreacabadofisico');
            _('cboacabadoquimico').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(acabadoquimico, 'idacabadoquimico', 'nombreacabadoquimico');
            _('cbounidad').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(unidadmedida, 'idunidadmedida', 'nombreunidadmedida');
            _('cbometodoancho').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(tipoancho, 'idtipoancho', 'nombretipoancho');
            _('cbometododensidad').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(metododensidad, 'idmetododensidad', 'nombremetododensidad');
            _('cboproveedor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(proveedor, 'idproveedor', 'nombreproveedor');
            _('cboposition').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cboposition, 'idposicion', 'nombreposicion');
            _('cbotipocolgador').innerHTML = _comboFromJSON(cbotipocolgador_basico_intermedio, 'valorestado', 'nombreestado');
            _('cbotipomaquina').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cbotipomaquina, 'idtipomaquina', 'nombretipomaquina');

            let cbotitulo = rpta[0].titulo !== '' ? CSVtoJSON(rpta[0].titulo) : null,
                cbohilado = rpta[0].hilado !== '' ? CSVtoJSON(rpta[0].hilado) : null,
                cboformahilado = rpta[0].formahilado !== '' ? CSVtoJSON(rpta[0].formahilado) : null,
                cbosystem = rpta[0].sistema !== '' ? CSVtoJSON(rpta[0].sistema) : null;
            ovariables.lstcbotitulo = cbotitulo;
            ovariables.lstcbohilado = cbohilado;
            ovariables.lstcboformahilado = cboformahilado;
            ovariables.lstcbosystem = cbosystem;

            if (ovariables.accion === 'new') {
                let osolicitud = solicitud[0];
                if (osolicitud !== null && osolicitud !== undefined) {
                    _('cboproveedor').value = osolicitud.idproveedor !== undefined ? (osolicitud.idproveedor.trim() === "0" ? '' : osolicitud.idproveedor) : '';
                    _('txtbatch').value = osolicitud.partidalote !== undefined ? osolicitud.partidalote.trim() : '';
                    _('txtmillcode').value = osolicitud.codigofabrica !== undefined ? osolicitud.codigofabrica : '';
                }
            }

            _('div_criterio_aprobacion').getElementsByClassName('cls_text_codigoatxestandar')[0].innerText = solicitud.length > 0 ? solicitud[0].codigoreporte_atxestandar : '';
            let datos_ids_atxestandar = solicitud.length > 0 ? (solicitud[0].ids_analisistextil_estandar !== undefined ? solicitud[0].ids_analisistextil_estandar : '') : '',
                arr_ids_atxestandar = datos_ids_atxestandar !== '' ? datos_ids_atxestandar.split('|') : '',
                idsolicitud_estandar = arr_ids_atxestandar.length > 0 ? arr_ids_atxestandar[0] : '', idatx_estandar = arr_ids_atxestandar.length > 0 ? arr_ids_atxestandar[1] : '';
            _('btn_print_atxestandar').setAttribute('data-par', `idsolicitud:${idsolicitud_estandar},idatx:${idatx_estandar}`);
        }

        /*:KEYBOAR - MOUSE*/
        function handlermousedown(e) {
            let o = e.currentTarget, numerocolumna = o.getAttribute('data-numerocolumna'), tbl = o.parentNode.parentNode,
                nropasada = tbl.rows[0].getAttribute('data-nropasada'), pista = tbl.rows[0].getAttribute('data-filadivision'), 
                filageneral_pasada = tbl.rows[0].getAttribute('data-numerofilageneral');
            if (e.button === 0 && ovariables.bool_ctrl_seleccionado) {
                o.classList.add('seleccionado_ctrl_mousedown_atx');
                let obj = { tipo: 'text/html', html: o.outerHTML };
                ovariables.lstobjarrastrar.push(obj);
            } else if (e.button === 0 && ovariables.bool_shift_seleccionado) {
                ovariables.contador_click_shift++;
                ovariables.filapasada_seleccionado_shift.push(nropasada);
                //ovariables.pista_seleccionado_shift.push(pista);
                ovariables.filageneral_pasada_seleccionado_shift.push(filageneral_pasada);
                
                if (ovariables.contador_click_shift > 1) {
                    //o.classList.add('seleccionado_ctrl_mousedown_atx');
                    //let obj = { tipo: 'text/html', html: o.outerHTML };
                    ovariables.lstobjarrastrar = [];
                    ovariables.numerocolumna_seleccionado_fin_shift = numerocolumna;
                    
                    //// SABER SI ES SELECCION HORIZONTA O VERTICAL
                    let pasada_inicio = parseInt(ovariables.filapasada_seleccionado_shift[0]), pasada_fin = parseInt(ovariables.filapasada_seleccionado_shift[ovariables.filapasada_seleccionado_shift.length - 1]),
                        filageneral_inicio = parseInt(ovariables.filageneral_pasada_seleccionado_shift[0]), filageneral_fin = parseInt(ovariables.filageneral_pasada_seleccionado_shift[ovariables.filageneral_pasada_seleccionado_shift.length - 1]);
                    if (pasada_inicio === pasada_fin) {  // LA MISMA FILA
                        for (let i = ovariables.numerocolumna_seleccionado_inicio_shift; i <= ovariables.numerocolumna_seleccionado_fin_shift; i++) {
                            let i_col = i - 1, td = tbl.rows[0].cells[i_col];
                            td.classList.add('seleccionado_ctrl_mousedown_atx');
                            let obj = { tipo: 'text/html', html: td.outerHTML };
                            ovariables.lstobjarrastrar.push(obj);
                        }
                    } else {
                        let arr_tbl = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos'));
                        if (filageneral_inicio > filageneral_fin) {
                            arr_tbl.forEach((x, i) => {
                                let filageneral = parseInt(x.rows[0].getAttribute('data-numerofilageneral')),
                                    //pista = x.rows[0].getAttribute('data-filadivision'),
                                    arr_columnas = Array.from(x.rows[0].getElementsByClassName('cls_columntblmatriz')), columna_marcada = '';
                                if (filageneral >= filageneral_fin && filageneral <= filageneral_inicio) {
                                    if (filageneral_inicio === filageneral) {  // EL FINAL
                                        arr_columnas[ovariables.numerocolumna_seleccionado_inicio_shif - 1].classList.add('seleccionado_ctrl_mousedown_atx');
                                        columna_marcada = ovariables.numerocolumna_seleccionado_inicio_shif - 1;
                                    } else {
                                        arr_columnas[ovariables.numerocolumna_seleccionado_fin_shift - 1].classList.add('seleccionado_ctrl_mousedown_atx');
                                        columna_marcada = ovariables.numerocolumna_seleccionado_fin_shift - 1;
                                    }
                                    let td = arr_columnas[columna_marcada], obj = { tipo: 'text/html', html: td.outerHTML };
                                    ovariables.lstobjarrastrar.push(obj);
                                }
                            });
                        } else if (filageneral_fin > filageneral_inicio) {
                            arr_tbl.forEach((x, i) => {
                                let filageneral = parseInt(x.rows[0].getAttribute('data-numerofilageneral')),
                                    //pista = x.rows[0].getAttribute('data-filadivision'),
                                    arr_columnas = Array.from(x.rows[0].getElementsByClassName('cls_columntblmatriz')), columna_marcada = '';
                                if (filageneral >= filageneral_inicio && filageneral <= filageneral_fin) {
                                    if (filageneral_fin === filageneral) {  // EL FINAL
                                        arr_columnas[ovariables.numerocolumna_seleccionado_fin_shift - 1].classList.add('seleccionado_ctrl_mousedown_atx');
                                        columna_marcada = ovariables.numerocolumna_seleccionado_fin_shift - 1;
                                    } else {
                                        arr_columnas[ovariables.numerocolumna_seleccionado_inicio_shift - 1].classList.add('seleccionado_ctrl_mousedown_atx');
                                        columna_marcada = ovariables.numerocolumna_seleccionado_inicio_shift - 1;
                                    }
                                    let td = arr_columnas[columna_marcada], obj = { tipo: 'text/html', html: td.outerHTML };
                                    ovariables.lstobjarrastrar.push(obj);
                                }
                            });
                        }
                    }
                } else if (ovariables.contador_click_shift === 1) {
                    o.classList.add('seleccionado_ctrl_mousedown_atx');
                    let obj = { tipo: 'text/html', html: o.outerHTML };
                    ovariables.lstobjarrastrar.push(obj);
                    ovariables.numerocolumna_seleccionado_inicio_shift = numerocolumna;
                }
            }
        }

        function handlerkeydown(e) {
            if (e.keyCode === 17) { //// CTRL
                ovariables.bool_ctrl_seleccionado = true;
            } else if (e.keyCode === 16) {
                ovariables.bool_shift_seleccionado = true;
            }
        }

        function handlerkeyup(e) {
            ovariables.bool_ctrl_seleccionado = false;
            ovariables.bool_shift_seleccionado = false;
        }

        /*:DRAG AND DROP*/
        function handleDragStart(e) {
            // Target (this) element is the source node.
            //this.style.opacity = '0.4';

            appAtxView.ovariables.dragSrcEl = this;

            e.dataTransfer.effectAllowed = 'move';
            if (ovariables.lstobjarrastrar.lenth <= 0) {
                e.dataTransfer.setData('text/html', this.outerHTML);
            }
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

            return false;
        }

        function handleDragEnter(e) {
            // this / e.target is the current hover target.
            this.classList.add('over');
        }

        function handleDragLeave(e) {
            this.classList.remove('over');  // this / e.target is previous target element.
        }

        function handleDrop(e) {
            // this/e.target is current target element.
            let o = e.currentTarget, tbl = o.parentNode.parentNode, numerocolumna_destino = o.getAttribute('data-numerocolumna');

            if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            // Don't do anything if dropping the same column we're dragging.
            if (appAtxView.ovariables.dragSrcEl != this) {
                // Set the source column's HTML to the HTML of the columnwe dropped on.
                //dragSrcEl.innerHTML = this.innerHTML;  // ESTO NO ES NECESARIO
                let html = '', i = parseInt(numerocolumna_destino) - 1;

                //_oisEmpty('app_verligamentos')
                if (typeof app_verligamentos !== 'undefined') {
                    if (app_verligamentos.ovariables.lstobjarrastrar.length > 0) {
                        app_verligamentos.ovariables.lstobjarrastrar.forEach(x => {
                            if (tbl.rows[0].cells[i] !== undefined) {
                                tbl.rows[0].cells[i].innerHTML = x.html.replace(/img-thumbnail/i, "").replace(/bg-primary/g, "");
                            }
                            i++;
                        });
                        app_verligamentos.ovariables.lstobjarrastrar = [];
                        let arrligamentos = Array.from(_('panelencabezado_verligamentos').getElementsByClassName('seleccionado_ctrl_mousedown'));
                        arrligamentos.forEach(x => {
                            x.classList.remove('seleccionado_ctrl_mousedown');
                            x.getElementsByClassName('cls_ligamentodraggable')[0].classList.remove('bg-primary');
                        });
                        app_verligamentos.ovariables.contador_seleccionados = 0;
                        return false;
                    }
                }

                if (appAtxView.ovariables.lstobjarrastrar.length > 0) {
                    if (ovariables.filapasada_seleccionado_shift[0] === ovariables.filapasada_seleccionado_shift[ovariables.filapasada_seleccionado_shift.length - 1]) {
                        //// ES EN LA MISMA FILA
                        appAtxView.ovariables.lstobjarrastrar.forEach(x => {
                            if (tbl.rows[0].cells[i] !== undefined) {
                                if (x.html.indexOf('cls_ligamentodraggable') >= 0) {
                                    tbl.rows[0].cells[i].innerHTML = x.html.replace(/img-thumbnail/i, '');
                                }
                            }
                            i++;
                        });
                        
                    } else if (ovariables.filapasada_seleccionado_shift[0] !== ovariables.filapasada_seleccionado_shift[ovariables.filapasada_seleccionado_shift.length - 1]) {
                        //// DIFERENTES FILAS
                        let filageneral_inicio = tbl.rows[0].getAttribute('data-numerofilageneral'), 
                            arr_tbl = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos')),
                            columna_donde_soltar = parseInt(numerocolumna_destino) - 1;
                        appAtxView.ovariables.lstobjarrastrar.forEach(x => {
                            let arr_columnas = Array.from(arr_tbl[filageneral_inicio - 1].getElementsByClassName('cls_columntblmatriz'));
                            if (x.html.indexOf('cls_ligamentodraggable') >= 0) {
                                arr_columnas[columna_donde_soltar].innerHTML = x.html.replace(/img-thumbnail/i, '');
                            }
                            
                            //i++;
                            filageneral_inicio++;
                        });
                    }

                    appAtxView.ovariables.lstobjarrastrar = [];
                    let arrligamentos = Array.from(_('div_principal_matrizligamentos').getElementsByClassName('seleccionado_ctrl_mousedown_atx'));
                    arrligamentos.forEach(x => {
                        x.classList.remove('seleccionado_ctrl_mousedown_atx');
                    });
                    
                    //// SETEAR VALORES INICIALES A VARIABLES GLOBALES
                    //// TODO ESTO LO PASE A UNA FUNCION
                    limpiar_variables_temporales_pa_arrastrar_ligamentos();
                    //ovariables.contador_click_shift = 0;
                    //ovariables.numerocolumna_seleccionado_inicio_shift = 0;
                    //ovariables.numerocolumna_seleccionado_fin_shift = 0;
                    //ovariables.filapasada_seleccionado_shift = [];
                    //ovariables.filageneral_pasada_seleccionado_shift = [];
                }
                else {
                    html = e.dataTransfer.getData('text/html').replace(/img-thumbnail/i, '').replace(/bg-primary/g, "");
                    this.innerHTML = html;
                }

            }

            return false;
        }

        function handleDragEnd(e) {

        }

        function generarMatriz_new(e) {
            let html = '', filas = _('txt_matriz_filas').value === '' ? 0 : parseInt(_('txt_matriz_filas').value),
                columnas = _('txt_matriz_columnas').value === '' ? 0 : parseInt(_('txt_matriz_columnas').value);

            let pasa_validacion = validar_antes_generar_matriz();
            if (pasa_validacion === false) {
                return false;
            }

            let tblpasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0];
            if (tblpasadas === undefined) {
                generarmatriz_por_primeravez();
            } else {
                let totalpasadas = tblpasadas.rows.length, div_first_imgligamentos = _('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tblpista')[0],
                tbl_img_ligamentos = div_first_imgligamentos.getElementsByClassName('cls_tbl_matriz_imagenesligamentos')[0], total_columnas_img_ligamentos = tbl_img_ligamentos.rows[0].cells.length;
                if (filas > totalpasadas) {
                    // AGREGAR FILAS Y COLUMNAS PARA LAS FILAS EXISTENTES
                    agregarfilas_matriz_add();
                } else if (filas < totalpasadas) {
                    // QUITAR FILAS
                    let totalfilas_quitar = (filas - totalpasadas) * -1;
                    quitarfilas_matriz_remove(totalfilas_quitar);
                }

                //// ESTA PARTE ES SOLO SI AGREGA SOLO COLUMNAS
                let html_columnas = '';
                if (columnas > total_columnas_img_ligamentos && filas === totalpasadas) {
                    // AGREGAR COLUMNAS
                    agregar_columnas_img_ligamentos(columnas, total_columnas_img_ligamentos);
                    handler_matriz_columnas_img_ligamentos_add(columnas, total_columnas_img_ligamentos);
                } else if (columnas < total_columnas_img_ligamentos) {
                    // QUITAR COLUMNAS
                    quitar_columnas_img_ligamentos(columnas, total_columnas_img_ligamentos);
                }
            }
        }

        function validar_antes_generar_matriz() {
            let filas = _('txt_matriz_filas').value === '' ? 0 : parseInt(_('txt_matriz_filas').value),
                columnas = _('txt_matriz_columnas').value === '' ? 0 : parseInt(_('txt_matriz_columnas').value), pasa_validacion = true;

            if (filas <= 0 && columnas <= 0) {
                let div_matriz_1 = _('div_tblmatriz1_pasadas'), contenido = div_matriz_1.innerHTML;
                if (contenido !== '') {
                    // Desea eliminar toda la matriz?
                    swal({
                        title: "Desea eliminar toda la matriz?",
                        text: "",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: true
                    }, function (rpta_confirmacion) {
                        //// LIMPIAR MATRIZ
                        if (rpta_confirmacion) {
                            let div_matriz_2 = _('div_tblmatriz2_imagenesligamentos'), div_matriz_3 = _('div_tblmatriz3_nrorepeticiones'),
                                div_matriz_4 = _('div_tblmatriz4_hiladoporpasada');
                            div_matriz_1.innerHTML = '';
                            div_matriz_2.innerHTML = '';
                            div_matriz_3.innerHTML = '';
                            div_matriz_4.innerHTML = '';
                        } else {
                            let obj = get_total_filas_columnas_matriz();
                            _('txt_matriz_filas').value = obj.filas;
                            _('txt_matriz_columnas').value = obj.columnas;
                        }
                        return;
                    });
                }
                pasa_validacion = false;
                return false;
            } else if (filas === 0 && columnas > 0) {
                swal({
                    title: "Message",
                    text: "Matriz incorrecta, ingrese las filas mayor a cero(0)",
                    type: 'error'
                }, function (result) {
                    if (result) {
                        let obj = get_total_filas_columnas_matriz();
                        _('txt_matriz_filas').value = obj.filas;
                        _('txt_matriz_columnas').value = obj.columnas;
                    }
                });

                pasa_validacion = false;
                return false;
            } else if (filas > 0 && columnas === 0) {
                swal({
                    title: "Message",
                    text: "Matriz incorrecta, ingrese las columnas mayor a cero(0)",
                    type: 'error'
                }, function (result) {
                    if (result) {
                        let obj = get_total_filas_columnas_matriz();
                        _('txt_matriz_filas').value = obj.filas;
                        _('txt_matriz_columnas').value = obj.columnas;
                    }
                });

                pasa_validacion = false;
                return false;
            } else if (filas > 19 && columnas > 14) {
                swal({
                    title: "Message",
                    text: "Matrix máxima 36 filas x 10 columnas.",
                    type: 'error'
                }, function (result) {
                    if (result) {
                        let obj = get_total_filas_columnas_matriz();
                        _('txt_matriz_filas').value = obj.filas;
                        _('txt_matriz_columnas').value = obj.columnas;
                    }
                });

                pasa_validacion = false;
                return false;
            } else if (filas > 36) {
                swal({
                    title: "Message",
                    text: "Matrix máxima 36 filas x 10 columnas.",
                    type: 'error'
                }, function (result) {
                    if (result) {
                        let obj = get_total_filas_columnas_matriz();
                        _('txt_matriz_filas').value = obj.filas;
                        _('txt_matriz_columnas').value = obj.columnas;
                    }
                });
                pasa_validacion = false;
                return false;
            } else if (filas < 19 && columnas > 70) {
                let mensaje_valid = 'Si va imprimir en vertical: Matrix máxima 18 filas x 48 columnas. \n';
                mensaje_valid += 'Si va imprimir en horizontal: Matrix máxima 9 filas x 70 columnas.';
                swal({
                    title: '',
                    text: mensaje_valid,
                    type: 'error'
                }, function (result) {
                    if (result) {
                        let obj = get_total_filas_columnas_matriz();
                        _('txt_matriz_filas').value = obj.filas;
                        _('txt_matriz_columnas').value = obj.columnas;
                    }
                });
                pasa_validacion = false;
                return false;
            }

            return pasa_validacion;
        }

        function get_total_filas_columnas_matriz() {
            let div_pasadas = _('div_tblmatriz1_pasadas'), tblpasadas = div_pasadas.getElementsByClassName('cls_tbl_pasadas')[0], totalfilas = tblpasadas !== undefined ? tblpasadas.rows.length : 0,
                tblimgligamento = _('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos')[0],
                totalcolumnas = tblimgligamento !== undefined ? tblimgligamento.rows[0].cells.length : 0,
                obj_return = {};
            obj_return.filas = totalfilas;
            obj_return.columnas = totalcolumnas;
            return obj_return;
        }

        function handler_matriz_columnas_img_ligamentos_add(set_total_columnas, actual_total_columnas_img_ligamentos) {
            let total_columnas_agregadas = set_total_columnas - actual_total_columnas_img_ligamentos;
            let arrtbl_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos')),
                indice_columna_inicio = actual_total_columnas_img_ligamentos, contador = null;

            arrtbl_ligamentos.forEach(t => {
                contador = indice_columna_inicio;
                for (let i = 0; i < total_columnas_agregadas; i++) {
                    let td = t.rows[0].cells[contador];

                    td.addEventListener('dragenter', handleDragEnter, false);
                    td.addEventListener('dragover', handleDragOver, false);
                    td.addEventListener('dragleave', handleDragLeave, false);
                    td.addEventListener('dragstart', handleDragStart, false);
                    td.addEventListener('drop', handleDrop, false);
                    td.addEventListener('dragend', handleDragEnd, false);
                    td.addEventListener('mousedown', handlermousedown, false);
                    td.addEventListener('dblclick', fn_dblclick_td_imagenligamento, false);

                    contador++;
                }
            });

        }

        function quitar_columnas_img_ligamentos(set_total_columnas, actual_total_columnas_img_ligamentos) {
            let total_columnas_a_quitar = (set_total_columnas - actual_total_columnas_img_ligamentos) * -1, indice_ultima_columna = null,
                arrtbl_img_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos'));

            arrtbl_img_ligamentos.forEach(t => {
                indice_ultima_columna = actual_total_columnas_img_ligamentos - 1;
                for (let i = 0; i < total_columnas_a_quitar; i++) {
                    let td = t.rows[0].cells[indice_ultima_columna];
                    t.rows[0].removeChild(td);
                    indice_ultima_columna--;
                }

            });
        }

        function agregar_columnas_img_ligamentos(set_total_columnas, actual_total_columnas_img_ligamentos) {
            let total_columnas_a_agregar = set_total_columnas - actual_total_columnas_img_ligamentos, html_columnas = '', contador = actual_total_columnas_img_ligamentos;
            for (let i = 0; i < total_columnas_a_agregar; i++) {
                contador++;
                html_columnas += `<td width="40" height="40" class="text-center cls_columntblmatriz" data-numerocolumna="${contador}" data-par="idanalisistextilestructuraporpasada:0">${contador}</td>`;
            }
            let arrtbl_img_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos'));
            arrtbl_img_ligamentos.forEach(x => {
                x.rows[0].insertAdjacentHTML('beforeend', html_columnas);
            });
        }

        function quitarfilas_matriz_remove(totalfilas_quitar) {
            // QUITAR PASADAS
            let fn_quitar_pasadas = () => {
                let tbl_pasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], total_filas = tbl_pasadas.rows.length,
                    index_fila_inicio_eliminar = total_filas - 1;
                for (let i = 0; i < totalfilas_quitar; i++) {
                    //tbl_pasadas.removeChild(tbl_pasadas.rows[index_fila_inicio_eliminar]);
                    tbl_pasadas.deleteRow(index_fila_inicio_eliminar);
                    index_fila_inicio_eliminar--;
                }
            }

            let fn_quitar_hiladoporpasada = () => {
                let tbl = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0], total_filas = tbl.rows.length,
                    index_fila_inicio_eliminar = total_filas - 1;
                for (let i = 0; i < totalfilas_quitar; i++) {
                    tbl.deleteRow(index_fila_inicio_eliminar);
                    index_fila_inicio_eliminar--;
                }
            }

            let fn_quitar_repeticiones = () => {
                let tbl = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0], arrfilas = Array.from(tbl.rows);
                // DESCOMBINAR
                arrfilas.forEach(x => {
                    let cadena_filas_combinadas = x.getAttribute('data-filascombinadas'), lst = cadena_filas_combinadas !== null ? cadena_filas_combinadas.split(',') : 0, total_filas_combinadas = lst.length;
                    if (total_filas_combinadas > 1) {
                        // DESCOMBINAR
                        let index_fila = x.rowIndex - 1;
                        fn_descombinarpasadas(index_fila);
                    }
                });

                // QUITAR FILAS
                let total_filas = tbl.rows.length, index_fila_inicio_eliminar = total_filas - 1;
                for (let i = 0; i < totalfilas_quitar; i++) {
                    tbl.deleteRow(index_fila_inicio_eliminar);
                    index_fila_inicio_eliminar--;
                }
            }

            let fn_quitar_filas_ligamentos = () => {
                let total_filas_quitar_ligamentos = totalfilas_quitar * 2;
                let arrdivs = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tblpista'));
                let indice_fila_inicio_a_qutar = arrdivs.length - 1;
                for (let i = 0; i < total_filas_quitar_ligamentos; i++) {
                    _('div_tblmatriz2_imagenesligamentos').removeChild(arrdivs[indice_fila_inicio_a_qutar]);
                    indice_fila_inicio_a_qutar--;
                }
            };

            fn_quitar_pasadas();
            fn_quitar_hiladoporpasada();
            fn_quitar_repeticiones();
            fn_quitar_filas_ligamentos();
        }

        function agregarfilas_matriz_add() {
            let tblpasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], html = '',
                setfilasmatriz = _('txt_matriz_filas').value, setcolumnasmatriz = _('txt_matriz_columnas').value, totalfilastblpasadas = tblpasadas.rows.length,
                filas_a_agregar = setfilasmatriz - totalfilastblpasadas;
            //nrofilas = totalfilastblpasadas;
            // PASADAS
            let fn_matriz_1 = (filas_a_agregar, totalfilastblpasadas) => {
                let nrofilas = totalfilastblpasadas, html = '';
                for (let i = 0; i < filas_a_agregar; i++) {
                    nrofilas++;
                    html += `<tr data-nropasada='${nrofilas}' data-par='idanalisistextilpasada:0'>
                            <td class="text-center" style="height:80px; vertical-align:middle;">${nrofilas}</td>
                        </tr>`;
                }
                return html;
            }

            // LIGAMENTOS
            let fn_matriz_2 = (filas_a_agregar, totalfilastblpasadas) => {
                let nrofilas = totalfilastblpasadas, html = '', contador = totalfilastblpasadas * 2; // CORRELATIVO DE LAS PISTAS
                //  ANTES QUE NADA AGREGAR LAS COLUMNAS DE LAS FILAS EXISTENTES
                let div_first_imgligamentos = _('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tblpista')[0],
                tbl_img_ligamentos = div_first_imgligamentos.getElementsByClassName('cls_tbl_matriz_imagenesligamentos')[0], total_columnas_img_ligamentos = tbl_img_ligamentos.rows[0].cells.length;

                if (setcolumnasmatriz > total_columnas_img_ligamentos) {
                    // AGREGAR COLUMNAS
                    agregar_columnas_img_ligamentos(setcolumnasmatriz, total_columnas_img_ligamentos);
                    handler_matriz_columnas_img_ligamentos_add(setcolumnasmatriz, total_columnas_img_ligamentos);
                }

                // AQUI PARA LAS FILAS NUEVAS CON SUS COLUMNAS
                for (let i = 1; i <= filas_a_agregar; i++) { // NRO DE PASADAS
                    nrofilas++;
                    let htmlestilo = '';
                    for (let k = 1; k <= 2; k++) {
                        // PISTAS: 1 Y 2
                        if (k === 1) {
                            if (i === 1) {
                                htmlestilo = '';  // border-top: 1px solid #ddd;
                            }
                        }
                        else {
                            htmlestilo = 'border-bottom: 1px solid #ddd;height:40px;'; // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                        }
                        contador++;
                        html += `<div class="cls_tblpista" style="">
                                    <div style="${htmlestilo}">
                                        <table cellspacing='0' cellpadding='0' class='cls_tbl_matriz_imagenesligamentos'>
                                            <tr data-numerofilageneral='${contador}' data-nropasada='${nrofilas}' data-filadivision='${k}'>
                        `;
                        for (let j = 1; j <= setcolumnasmatriz; j++) {
                            html += `<td width="40" height="40" class="text-center cls_columntblmatriz" data-numerocolumna='${j}' data-par='idanalisistextilestructuraporpasada:0'>${j}</td>`;
                        }
                        html += `</tr></table></div></div>`;
                    }
                }
                return html;
            }

            // REPETICIONES
            let fn_matriz_3 = (filas_a_agregar) => {
                let html = '';
                for (let i = 0; i < filas_a_agregar; i++) {

                    html += `<tr style="height:80px;" data-par='idanalisistextilestructuranumrepeticiones:0'>
                            <td class='cls_td_repeticiones'><input type='text' class ='form-control cls_txta_nrorepeticiones' style='width:80px; height:100%;' /></td>
                        </tr>`;
                }
                return html;
            }


            // HILADOS POR PASADA
            let fn_matriz_4 = (filas_a_agregar, totalfilastblpasadas) => {
                let nrofilas = totalfilastblpasadas, html = '';
                for (let i = 0; i < filas_a_agregar; i++) {
                    nrofilas++;
                    html += `<tr style="height:80px;" data-table='' data-nropasada='${nrofilas}'>
                                <td style='vertical-align: middle;'>
                                    <div class ='grid-columns-tdpasada'>
                                        <div class ='cls_pasada_col1' style='max-width:500px; overflow:auto; max-height:60px; margin-right:5px;'></div>
                                        <div class='cls_pasada_col2'>
                                            <button type='button' class ='btn btn-sm btn-info cls_btn_hiladoporpasada'>
                                                <span class ='fa fa-pencil'></span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                    `;
                }
                return html;
            }

            let html_matriz_1 = fn_matriz_1(filas_a_agregar, totalfilastblpasadas);
            tblpasadas.insertAdjacentHTML('beforeend', html_matriz_1);

            let html_matriz_2 = fn_matriz_2(filas_a_agregar, totalfilastblpasadas);
            let div_matriz_2 = _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz2')[0];
            div_matriz_2.insertAdjacentHTML('beforeend', html_matriz_2);

            let html_matriz_3 = fn_matriz_3(filas_a_agregar);
            let tbody_repeticiones = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0];
            tbody_repeticiones.insertAdjacentHTML('beforeend', html_matriz_3);

            let html_matriz_4 = fn_matriz_4(filas_a_agregar, totalfilastblpasadas);
            let tbody_hiladoporpasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0];
            tbody_hiladoporpasada.insertAdjacentHTML('beforeend', html_matriz_4);

            // HANDLER MATRIZ
            handlermatrizligamentos_add(filas_a_agregar, totalfilastblpasadas);
        }

        function handlermatrizligamentos_add(filas_a_agregar, totalfilastblpasadas) {
            let arrtbl_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos')),
                nrofilas = totalfilastblpasadas;
            for (let i = 0; i < filas_a_agregar; i++) {
                nrofilas++;
                arrtbl_ligamentos.forEach(t => {
                    let datanropasada_tbl = t.rows[0].getAttribute('data-nropasada');

                    if (parseInt(datanropasada_tbl) === nrofilas) {
                        let arrtdmatriz = Array.from(t.getElementsByClassName('cls_columntblmatriz'));
                        arrtdmatriz.forEach(x => {
                            x.addEventListener('dragstart', handleDragStart, false);
                            x.addEventListener('dragenter', handleDragEnter, false);
                            x.addEventListener('dragover', handleDragOver, false);
                            x.addEventListener('dragleave', handleDragLeave, false);
                            x.addEventListener('drop', handleDrop, false);
                            x.addEventListener('dragend', handleDragEnd, false);
                            x.addEventListener('mousedown', handlermousedown, false);
                            x.addEventListener('dblclick', fn_dblclick_td_imagenligamento, false);
                        });
                    }
                });
            }

            // PARA HILADO POR PASADAS
            nrofilas = totalfilastblpasadas;
            let tbody_hilado_por_pasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0];

            for (let i = 0; i < filas_a_agregar; i++) {
                let btn_hiladoporpasada = tbody_hilado_por_pasada.rows[nrofilas].getElementsByClassName('cls_btn_hiladoporpasada')[0];
                btn_hiladoporpasada.addEventListener('click', fn_viewhiladoporpasada, false);
                nrofilas++;
            }

            // PARA LA TABLA DE COMBINACIONES
            // ACA SE VA A CONTAR AL REVES
            let tbody_repeticiones = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0], ultima_fila_repeticiones = tbody_repeticiones.rows.length,
                ultimo_indice_inicio = ultima_fila_repeticiones - 1;

            for (let i = 0; i < filas_a_agregar; i++) {
                let txta_combinacionpasadas = tbody_repeticiones.rows[ultimo_indice_inicio].getElementsByClassName('cls_txta_nrorepeticiones')[0];
                txta_combinacionpasadas.addEventListener('dblclick', fn_dblclick_seleccionarpasadas_combinar, false);
                txta_combinacionpasadas.addEventListener('click', fn_click_seleccionarpasadas, false);
                ultimo_indice_inicio--;
            }
        }

        function generarmatriz_por_primeravez() {
            let filas = _('txt_matriz_filas').value, columnas = _('txt_matriz_columnas').value;
            let fn_matriz1 = () => {
                let html = `<div style="padding-top:40px;">
                                <table class="table table-bordered cls_tbl_pasadas" border='0' cellspacing='0' cellpadding='0'>
                           `;
                for (let i = 1; i <= filas; i++) {
                    html += `<tr data-nropasada='${i}' data-par='idanalisistextilpasada:0'>
                                <td class="text-center" style="height:80px; vertical-align:middle;">${i}</td>
                            </tr>
                    `;
                }
                html += `</table>`;
                return html;
            }

            let fn_matriz2 = () => {
                let html = '', htmlestilo = '', htmlestilo_divcontenedorpadre = 'padding-top:40px;', contador = 0;
                for (let i = 1; i <= filas; i++) { // NRO DE PASADAS

                    htmlestilo = '';
                    for (let k = 1; k <= 2; k++) {
                        // PISTAS: 1 Y 2
                        if (k === 1) {
                            if (i === 1) {
                                htmlestilo = 'border-top: 1px solid #ddd;';  // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            }
                        }
                        else {
                            htmlestilo = 'border-bottom: 1px solid #ddd;height:40px;'; // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                        }
                        contador++;
                        html += `<div class="cls_tblpista" style="${htmlestilo_divcontenedorpadre}">
                                    <div style="${htmlestilo}">
                                        <table cellspacing='0' cellpadding='0' class='cls_tbl_matriz_imagenesligamentos'>
                                            <tr data-numerofilageneral='${contador}' data-nropasada='${i}' data-filadivision='${k}'>
                        `;
                        for (let j = 1; j <= columnas; j++) {
                            html += `<td width="40" height="40" class="text-center cls_columntblmatriz" data-numerocolumna='${j}' data-par='idanalisistextilestructuraporpasada:0'>${j}</td>`;
                        }
                        html += `</tr></table></div></div>`;
                        htmlestilo_divcontenedorpadre = '';
                    }
                }
                return html;
            }

            let fn_matriz3 = () => {
                let html = `<table class="table table-bordered" border='0' cellspacing='0' cellpadding='0'>
                                <thead>
                                    <tr style="height:40px;">
                                        <th class='text-center'>Repetitions</th>
                                    </tr>
                                </thead>
                                <tbody class='cls_tbody_matriz3_repeticiones'>
                `;

                for (let i = 1; i <= filas; i++) {
                    html += `<tr style="height:80px;" data-par='idanalisistextilestructuranumrepeticiones:0'>
                                <td class='cls_td_repeticiones'><input type='text' class ='form-control cls_txta_nrorepeticiones' style='width:80px; height:100%;' /></td>
                            </tr>
                    `;
                }
                html += `</tbody></table>`;

                return html;
            }

            let fn_matriz4 = () => {
                let html = `<table class ="table table-bordered" border='0' cellspacing='0' cellpadding='0' id='tbl_matriz4_hiladoporpasada'>
                                <thead>
                                    <tr>
                                        <th class='text-center' style="height:40px;">Yarn</th>
                                    </tr>
                                </thead>
                                <tbody class='cls_tbody_matriz4_hiladoporpasada'>
                `;

                let partabla = [], objpartabla = { idanalisistextilhilado: 0, idhilado: 0 };
                partabla.push(objpartabla);
                let objpartablajson = JSON.stringify(partabla);
                for (let i = 1; i <= filas; i++) {
                    //data-table='[{"idanalisistextilhilado":"0", "idhilado":"0"}]'
                    html += `<tr style="height:80px;" data-table='' data-nropasada='${i}'>
                                <td style='vertical-align: middle;'>
                                    <div class ='grid-columns-tdpasada'>
                                        <div class ='cls_pasada_col1' style='max-width:500px; overflow:auto; max-height:60px; margin-right:5px;'></div>
                                        <div class='cls_pasada_col2'>
                                            <button type='button' class ='btn btn-sm btn-info cls_btn_hiladoporpasada'>
                                                <span class ='fa fa-pencil'></span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                    `;
                }
                html += `</tbody></table>`;
                return html;
            }

            let htmlmatriz1 = fn_matriz1(), htmlmatriz2 = fn_matriz2(), htmlmatriz3 = fn_matriz3(), htmlmatriz4 = fn_matriz4();
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz1')[0].innerHTML = htmlmatriz1;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz2')[0].innerHTML = htmlmatriz2;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz3')[0].innerHTML = htmlmatriz3;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz4')[0].innerHTML = htmlmatriz4;
            handlermatrizligamentos_new();
        }

        function handlermatrizligamentos_new() {
            /*PRUEBA PARA DRAG AND DROP*/
            let arrtdmatriz = Array.from(_('div_matrizligamentos').getElementsByClassName('cls_columntblmatriz')),
                arrbtnhiladoxpasada = Array.from(_('div_matrizligamentos').getElementsByClassName('cls_btn_hiladoporpasada')),
                arrtxta_combinarpasadas = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_txta_nrorepeticiones')),
                arrtd_combinarpasadas = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_td_repeticiones'));

            arrtdmatriz.forEach(x => {
                x.addEventListener('dragstart', handleDragStart, false);
                x.addEventListener('dragenter', handleDragEnter, false);
                x.addEventListener('dragover', handleDragOver, false);
                x.addEventListener('dragleave', handleDragLeave, false);
                x.addEventListener('drop', handleDrop, false);
                x.addEventListener('dragend', handleDragEnd, false);
                x.addEventListener('mousedown', handlermousedown, false);
                x.addEventListener('dblclick', fn_dblclick_td_imagenligamento, false);
            });
            arrbtnhiladoxpasada.forEach(x => {
                x.addEventListener('click', fn_viewhiladoporpasada, false);
            });
            arrtxta_combinarpasadas.forEach(x => {
                x.addEventListener('dblclick', fn_dblclick_seleccionarpasadas_combinar, false);
                x.addEventListener('click', fn_click_seleccionarpasadas, false);
            });

        }

        function generarMatriz_ini_edit(e) {
            let html = '', filas = _('txt_matriz_filas').value, columnas = _('txt_matriz_columnas').value;

            if (filas <= 0 && columnas <= 0) {
                return false;
            }

            let fn_matriz1 = () => {
                let html = `<div style="padding-top:40px;">
                                <table class="table table-bordered cls_tbl_pasadas" border='0' cellspacing='0' cellpadding='0'>
                           `;
                for (let i = 1; i <= filas; i++) {
                    html += `<tr data-nropasada='${i}' data-par='idanalisistextilpasada:0'>
                                <td class="text-center" style="height:80px; vertical-align:middle;">${i}</td>
                            </tr>
                    `;
                }
                html += `</table>`;
                return html;
            }

            let fn_matriz2 = () => {
                let html = '', htmlestilo = '', htmlestilo_divcontenedorpadre = 'padding-top:40px;', contador = 0;
                for (let i = 1; i <= filas; i++) { // NRO DE PASADAS

                    htmlestilo = '';
                    for (let k = 1; k <= 2; k++) {
                        // PISTAS: 1 Y 2
                        if (k === 1) {
                            if (i === 1) {
                                htmlestilo = 'border-top: 1px solid #ddd;';  // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            }
                        }
                        else {
                            htmlestilo = 'border-bottom: 1px solid #ddd;height:40px;'; // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                        }
                        contador++;
                        html += `<div class="cls_tblpista" style="${htmlestilo_divcontenedorpadre}">
                                    <div style="${htmlestilo}">
                                        <table cellspacing='0' cellpadding='0' class='cls_tbl_matriz_imagenesligamentos'>
                                            <tr data-numerofilageneral='${contador}' data-nropasada='${i}' data-filadivision='${k}'>
                        `;
                        for (let j = 1; j <= columnas; j++) {
                            html += `<td width="40" height="40" class="text-center cls_columntblmatriz" data-numerocolumna='${j}' data-par='idanalisistextilestructuraporpasada:0'>${j}</td>`;
                        }
                        html += `</tr></table></div></div>`;
                        htmlestilo_divcontenedorpadre = '';
                    }
                }
                return html;
            }

            let fn_matriz3 = () => {
                let html = `<table class="table table-bordered" border='0' cellspacing='0' cellpadding='0'>
                                <thead>
                                    <tr style="height:40px;">
                                        <th class='text-center'>Repetitions</th>
                                    </tr>
                                </thead>
                                <tbody class='cls_tbody_matriz3_repeticiones'>
                `;
                //<td><input type='text' class ='cls_txta_nrorepeticiones' style='' /></td>
                for (let i = 1; i <= filas; i++) {
                    html += `<tr style="height:80px;" data-par='idanalisistextilestructuranumrepeticiones:0'>
                                <td class='cls_td_repeticiones'><input type='text' class ='form-control cls_txta_nrorepeticiones' style='width:80px; height:100%;' /></td>
                            </tr>
                    `;
                }
                html += `</tbody></table>`;

                return html;
            }

            let fn_matriz4 = () => {
                let html = `<table class ="table table-bordered" border='0' cellspacing='0' cellpadding='0' id='tbl_matriz4_hiladoporpasada'>
                                <thead>
                                    <tr>
                                        <th class='text-center' style="height:40px;">Yarn</th>
                                    </tr>
                                </thead>
                                <tbody class='cls_tbody_matriz4_hiladoporpasada'>
                `;

                let partabla = [], objpartabla = { idanalisistextilhilado: 0, idhilado: 0 };
                partabla.push(objpartabla);
                let objpartablajson = JSON.stringify(partabla);
                for (let i = 1; i <= filas; i++) {
                    //data-table='[{"idanalisistextilhilado":"0", "idhilado":"0"}]'
                    html += `<tr style="height:80px;" data-table='' data-nropasada='${i}'>
                                <td style='vertical-align: middle;'>
                                    <div class ='grid-columns-tdpasada'>
                                        <div class ='cls_pasada_col1' style='max-width:500px; overflow:auto; max-height:60px; margin-right:5px;'></div>
                                        <div class='cls_pasada_col2'>
                                            <button type='button' class ='btn btn-sm btn-info cls_btn_hiladoporpasada'>
                                                <span class ='fa fa-pencil'></span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                    `;
                }
                html += `</tbody></table>`;
                return html;
            }

            let htmlmatriz1 = fn_matriz1(), htmlmatriz2 = fn_matriz2(), htmlmatriz3 = fn_matriz3(), htmlmatriz4 = fn_matriz4();
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz1')[0].innerHTML = htmlmatriz1;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz2')[0].innerHTML = htmlmatriz2;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz3')[0].innerHTML = htmlmatriz3;
            _('div_principal_matrizligamentos').getElementsByClassName('cls_tblmatriz4')[0].innerHTML = htmlmatriz4;
        }

        function handlermatrizligamentos_ini_edit() {
            /*PRUEBA PARA DRAG AND DROP*/
            let arrtdmatriz = Array.from(_('div_matrizligamentos').getElementsByClassName('cls_columntblmatriz')),
                arrbtnhiladoxpasada = Array.from(_('div_matrizligamentos').getElementsByClassName('cls_btn_hiladoporpasada')),
                arrtxta_combinarpasadas = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_txta_nrorepeticiones')),
                arrtd_combinarpasadas = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_td_repeticiones'));

            arrtdmatriz.forEach(x => {
                x.addEventListener('dragstart', handleDragStart, false);
                x.addEventListener('dragenter', handleDragEnter, false);
                x.addEventListener('dragover', handleDragOver, false);
                x.addEventListener('dragleave', handleDragLeave, false);
                x.addEventListener('drop', handleDrop, false);
                x.addEventListener('dragend', handleDragEnd, false);
                x.addEventListener('mousedown', handlermousedown, false);
                x.addEventListener('dblclick', fn_dblclick_td_imagenligamento, false);
            });
            arrbtnhiladoxpasada.forEach(x => {
                x.addEventListener('click', fn_viewhiladoporpasada, false);
            });
            arrtxta_combinarpasadas.forEach(x => {
                x.addEventListener('dblclick', fn_dblclick_seleccionarpasadas_combinar, false);
                x.addEventListener('click', fn_click_seleccionarpasadas, false);
            });
            //arrtd_combinarpasadas.forEach(x => {
            //    x.addEventListener('dblclick', fn_dblclick_seleccionarpasadas_combinar, false);
            //});
        }

        function fn_click_seleccionarpasadas(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode, altofila = fila.clientHeight, cadenafilas_combinadas = fila.getAttribute('data-filascombinadas');
            if (cadenafilas_combinadas !== null) {
                let lst = cadenafilas_combinadas.split(','), totalcombinaciones = lst.length;

                _('btn_combinar_descombinar_pasadas').setAttribute('data-indexfila', (fila.rowIndex - 1));
                if (totalcombinaciones > 1) {
                    _('btn_combinar_descombinar_pasadas').classList.add('btn-primary');
                    _('btn_combinar_descombinar_pasadas').classList.remove('btn-default');
                    _('btn_combinar_descombinar_pasadas').setAttribute('data-estacombinado', 'si');
                } else {
                    _('btn_combinar_descombinar_pasadas').classList.add('btn-default');
                    _('btn_combinar_descombinar_pasadas').classList.remove('btn-primary');
                    _('btn_combinar_descombinar_pasadas').setAttribute('data-estacombinado', 'no');
                }
            } else {
                _('btn_combinar_descombinar_pasadas').classList.add('btn-default');
                _('btn_combinar_descombinar_pasadas').classList.remove('btn-primary');
                _('btn_combinar_descombinar_pasadas').setAttribute('data-estacombinado', 'no');
            }
        }

        function fn_dblclick_seleccionarpasadas_combinar(e) {
            let o = e.currentTarget, td = o.parentNode;
            if (td.classList.value.indexOf('cls_selected_combinar') < 0) {
                td.classList.add('cls_selected_combinar');
                //td.style.background = 'blue';
                td.classList.add('bg-primary');
            } else {
                td.classList.remove('cls_selected_combinar');
                //td.style.background = 'white';
                td.classList.remove('bg-primary');
            }
        }

        function fn_dblclick_td_imagenligamento(e) {
            let o = e.currentTarget, numerocolumna = o.getAttribute('data-numerocolumna');
            o.innerHTML = '';
            o.innerText = numerocolumna;
            o.classList.remove('seleccionado_ctrl_mousedown_atx');
            let arr_seleccionados = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('seleccionado_ctrl_mousedown_atx'));
            if (arr_seleccionados <= 0) {
                limpiar_variables_temporales_pa_arrastrar_ligamentos();
            }
        }

        function limpiar_variables_temporales_pa_arrastrar_ligamentos() {
            ovariables.contador_click_shift = 0;
            ovariables.numerocolumna_seleccionado_inicio_shift = 0;
            ovariables.numerocolumna_seleccionado_fin_shift = 0;
            ovariables.filapasada_seleccionado_shift = [];
            ovariables.filageneral_pasada_seleccionado_shift = [];
        }

        function fn_change_metododensidad(o) {
            //let o = e.currentTarget;
            if (o.value === '1') {
                _('txtanalisisarea').disabled = true;
                _('txtanalisisarea').value = 100;
            } else if (o.value === '2') {
                _('txtanalisisarea').disabled = false;
                _('txtanalisisarea').value = '';
            }
            calculardensidad();
        }

        function calculardensidad() {
            let area = 0, peso = 0, densidad = 0;

            area = _('txtanalisisarea').value === '' ? 0 : parseFloat(_('txtanalisisarea').value);
            peso = _('txtAnalisisPeso').value === '' ? 0 : parseFloat(_('txtAnalisisPeso').value);

            // FORMULA CALCULO DE DENSIDAD
            if (area !== 0) {
                densidad = 10000 * peso / area;
            }

            densidad = densidad.toFixed(1);
            _('txtdensidad').value = densidad;
        }

        function getarraymatrizligamento() {
            let objreturn = {}, tblpasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], arrfilaspasadas = tblpasadas !== undefined ? Array.from(tblpasadas.rows) : null,
                lstpasadas = [], arr_tbl_imgligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_tbl_matriz_imagenesligamentos')),
                lstimgligamentos = [], arr_txta_repeticiones = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_txta_nrorepeticiones')),
                lstrepeticiones = [], tbl_matriz4_hiladoporpasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0],
                lsthiladoporpasada = [];

            //// PASADAS
            if (arrfilaspasadas !== null) {
                arrfilaspasadas.forEach((x, indice) => {
                    let datapar = x.getAttribute('data-par'), idanalisistextilpasada = _par(datapar, 'idanalisistextilpasada');
                    let obj = {
                        idanalisistextilpasada: idanalisistextilpasada,
                        numeropasada: (indice + 1)
                    }
                    lstpasadas.push(obj);
                });
            }
            objreturn.pasadas = lstpasadas;

            //// IMG - LIGAMENTOS
            arr_tbl_imgligamentos.forEach((t, indice) => {
                let arrcolumn_imgligamentos = Array.from(t.rows[0].getElementsByClassName('cls_columntblmatriz'));
                arrcolumn_imgligamentos.forEach(c => {
                    let datapar_tblelementoestructura = c.getAttribute('data-par'), idanalisistextilestructuraporpasada = _par(datapar_tblelementoestructura, 'idanalisistextilestructuraporpasada'),
                        fila = c.parentNode, nropasada = parseInt(fila.getAttribute('data-nropasada')), pista = fila.getAttribute('data-filadivision'),
                        columna = parseInt(c.getAttribute('data-numerocolumna'));
                    //data-nropasada="1" data-filadivision="1"
                    let xd = c.getElementsByClassName('cls_ligamentodraggable')[0];
                    if (c.getElementsByClassName('cls_ligamentodraggable')[0]) {
                        let objimgligamento = {
                            idanalisistextilestructuraporpasada: idanalisistextilestructuraporpasada,
                            filapasada: pista,  //pista
                            columnapasada: columna,
                            idelementoestructura: c.getElementsByClassName('cls_ligamentodraggable')[0].getAttribute('data-idelementoestructura'),
                            nropasada: nropasada
                        };
                        lstimgligamentos.push(objimgligamento);
                    }
                });
            });

            objreturn.img_elementos_ligamentos = lstimgligamentos;

            //// REPETICIONES
            arr_txta_repeticiones.forEach((x, indice) => {
                let nrorepeticiones = x.value === '' ? 1 : x.value, fila = x.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                    idanalisistextilestructuranumrepeticiones = _par(datapar, 'idanalisistextilestructuranumrepeticiones'), filascombinadas = fila.getAttribute('data-filascombinadas');
                let obj = {
                    idanalisistextilestructuranumrepeticiones: idanalisistextilestructuranumrepeticiones,
                    filas: filascombinadas,  // ESTO ES CANDENA; POR EJEMPLO PUEDE IR (1, 2) SIGINICA ESTA COMBINANDO PASADA 1 Y 2
                    orden: (indice + 1),
                    numerorepeticiones: nrorepeticiones
                };
                lstrepeticiones.push(obj);
            });
            objreturn.repeticiones = lstrepeticiones;

            //// HILADO POR PASADA
            let arrfilas_hiladoporpasada = tbl_matriz4_hiladoporpasada !== undefined ? Array.from(tbl_matriz4_hiladoporpasada.rows) : null;
            if (arrfilas_hiladoporpasada !== null) {
                arrfilas_hiladoporpasada.forEach((f, indice) => {
                    let lst = f.getAttribute('data-table') !== '' ? JSON.parse(f.getAttribute('data-table')) : {};
                    if (lst.length > 0) {
                        lst.forEach(obj => {
                            obj.filapasada = (indice + 1)  // ESTE DATO ES PARA CUANDO SE GRABA PASADA HILADO VACIO VA A SERVIR A QUE FILA PASADA PERTENECE
                            lsthiladoporpasada.push(obj);
                        });
                    }
                    //else {
                    //    [{idanalisistextilhilado:,idhilado:16,nrohilado:1,largomallacrudo:2,largomallaacabado:2,idposicion:1,guid_hilado:f242ba08-b16f-4340-9b88-34590b456698}]
                    //    let obj = {
                    //        idanalisistextilhilado: 0,
                    //        idhilado: 0,
                    //        nrohilado: 0,
                    //        largomallacrudo: 0,
                    //        largomallaacabado: 0,
                    //        idposicion: 0,
                    //        guid_hilado: '',
                    //        filapasada = (indice + 1) // ESTE DATO ES PARA CUANDO SE GRABA PASADA HILADO VACIO VA A SERVIR A QUE FILA PASADA PERTENECE
                    //    };
                    //    lsthiladoporpasada.push(obj);
                    //}
                });
            }
            objreturn.hiladoporpasada = lsthiladoporpasada;

            return objreturn;
        }

        function fn_save_new_atx(o, cambia_correlativo, cambia_version) {
            let req = _required({ clase: '_enty', id: 'panelEncabezado_atx' });
                
            if (req) {
                let pasavalidacion = validar_antes_grabar(true);
                if (pasavalidacion.pasavalidacion === false) {
                    if (pasavalidacion.mensaje_con_pregunta_sino === 'no') {
                        return false;
                    } else if (pasavalidacion.mensaje_con_pregunta_sino === 'si') {
                        swal({
                            title: "Deseas grabar de todas maneras?",
                            text: pasavalidacion.mensaje,
                            type: "error",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: true
                        }, function (rpta_confirmacion) {
                            if (rpta_confirmacion) {
                                //// SI EL USUARIO SELECCIONO SI ENTONCES SE PROCEDERA A GRABAR EL ATX
                                fn_submetodo_save_new_atx(o);
                            } else {  /// SI SELECCIONO NO SEGUIRA EN LA VENTANA HASTA CORREGIR LOS REQUERIDOS
                                return false;
                            }
                            return;
                        });
                    }
                } else {
                    fn_submetodo_save_new_atx(o);
                }
            }
        }

        function fn_submetodo_save_new_atx(o) {
            let obj_criterio_aprobacion = [], reenviar = o.getAttribute('data-reenviar'), cambio_correlativo_save = 0, 
                cambio_version_save = 0, conhilado_seleccionado = get_valor_conhilado_seleccionado(),
                par_editatx = _('txtpar_editatx').value, txtpar_solicitudatx_index = _par(par_editatx, 'txtpar_solicitudatx_index'),
                cambio_estado_y_datos_adicionales = '';

            let result_cambia_version_correlativo = null, idmotivosolicitud = _('hf_idmotivosolicitud').value;

            if (idmotivosolicitud === '2') {
                obj_criterio_aprobacion = getarray_criterioaprobacion_save();
            }

            if (reenviar === 'si') {
                if (idmotivosolicitud === '2') {
                    let obj_dondecambio = validar_si_hay_cambios_pa_validar_correlativo_o_version();

                    if (obj_dondecambio.cambia_correlativo !== 0 || obj_dondecambio.cambia_version !== 0) {
                        //// HAY CAMBIOS EN LA ESTRUCTURA DEL ATX
                        let result_cambia_version_correlativo = validar_siescambio_version_correlativo();
                        if (result_cambia_version_correlativo.cambia_correlativo === 1 || result_cambia_version_correlativo.cambia_version === 1) {
                            // ENTONCES LLAMAR A LA FUNCION SAVE_NEW
                            cambio_correlativo_save = result_cambia_version_correlativo.cambia_correlativo;
                            cambio_version_save = result_cambia_version_correlativo.cambia_version;
                        }
                    } else {
                        //// SIMPLEMENTE NO HAY CAMBIOS EN LA ESTRUCTURA DEL ATX, NI CORRELATIVO NI VERSION
                    }
                } else if (idmotivosolicitud === '1') {
                    ovariables.obj_b_correlativo.ofamilia = _('cbofamilia').value;
                    let cadena_ofamilia_correlativo_ini = JSON.stringify(ovariables.obj_actual_correlativo.ofamilia),
                        cadena_ofamilia_correlativo_save = JSON.stringify(ovariables.obj_b_correlativo.ofamilia);

                    if (cadena_ofamilia_correlativo_ini !== cadena_ofamilia_correlativo_save) {
                        cambio_correlativo_save = 1;
                        cambio_version_save = 0;
                    }
                    //// SI ES SOLICITUD DE ORIGEN COLGADOR WT; VOY A OBVIAR LA DIFERENCIA DE FAMILIAS
                    if (appSolicitudAtx.ovariables.origenmuestra === 3) {  //// SOLICITUD DE ORIGEN TIPO COLGADOR WTS
                        if (appSolicitudAtx.ovariables.codigotela_colgadorwts !== '') {  //// ESTE DATO LO SACO DE ATX; SI ESTA VACIO ES POR QUE NO EXISTE EL CODIGO DE TELA QUE PUSO COMERCIAL PARA UN COLGADOR WTS(ORIGEN DE LA MUESTRA)
                            //// ENTONCES SI NO EXISTE CODIGO DE TELA COLGADOR WTS; ENTONCES GENERAR EL CODIGO DE TELA NUEVO; EL CODIGO DEBERIA TENER LOS 13 DIGITOS
                            if (appSolicitudAtx.ovariables.origenmuestra_colgador_generarcodigotela === 'CAMBIAR_ESTADO') {
                                cambio_estado_y_datos_adicionales = 'CAMBIAR_ESTADO|' + appSolicitudAtx.ovariables.codigotela_colgadorwts;
                                cambio_correlativo_save = 0;
                            }
                        }
                    }
                }
            }

            //// SI ES DE UNA SOLICITUD DE COLGADOR ENTONCES GENERAR EL CODIGO DE TELA
            if (ovariables.escolgador === 'escolgador') {
                cambio_correlativo_save = 1;
                cambio_version_save = 0;
            }
            //// SI ES DE UNA SOLICITUD DE COTIZACION ENTONCES GENERAR EL CODIGO DE TELA
            if (ovariables.escolgador === 'escotizacion') {
                cambio_correlativo_save = 1;
                cambio_version_save = 0;
            }

            let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_atx' }), frm = new FormData(), cbodiametro = _('cbodiameter');
            let files_imagen_estructura = _('fupArchivo').files, fileestructura = files_imagen_estructura[0];
            let files_imagen_muestrafisica = _('fupimagenmuestra').files, filemuestrafisica = files_imagen_muestrafisica[0];
            parhead['lavado'] = getlavado_seleccionado();
            parhead['diametro'] = cbodiametro.selectedIndex > 0 ? cbodiametro.options[cbodiametro.selectedIndex].text : 0;
            parhead['titulo'] = get_cadena_hilado_grabar();
            parhead['descripciondensidad'] = get_descripcion_densidad_grabar();
            let comentario = $("#txtanalisiscomentario").data('kendoEditor').value().toString();
            //// AQUI COMENTARIO
            comentario = escape(comentario.replace(/"/g, '~').replace(/\+/g, '¬'));  //escape();  //// NOTA ~ EN EL HTML ES PARA LAS COMILLAS "" SE HACE ESTO PARA PODER GRABAR EN EL SQL
            parhead['comentario'] = comentario;

            if (files_imagen_estructura.length > 0) {
                parhead['actualizarimagenestructura'] = 1;
            } else {
                parhead['actualizarimagenestructura'] = 0;
            }

            if (files_imagen_muestrafisica.length > 0) {
                parhead['actualizarimagenmuestrafisica'] = 1;
            } else {
                parhead['actualizarimagenmuestrafisica'] = 0;
            }

            if (ovariables.estado_actual_solicitud === 'POR' && reenviar === 'si') {
                let parametro_finalizar = { finalizaratx: 'si', reenviaratx: reenviar }
                parhead['finalizaratx'] = JSON.stringify(parametro_finalizar);
            } else {
                parhead['finalizaratx'] = '';
            }

            parhead['cambio_correlativo'] = cambio_correlativo_save;
            parhead['cambio_version'] = cambio_version_save;
            let indexoptfamilia = _('cbofamilia').selectedIndex;
            parhead['nombrefamilia'] = indexoptfamilia > 0 ? _('cbofamilia').options[indexoptfamilia].text : '';
            parhead['conhilado'] = conhilado_seleccionado; ////get_valor_conhilado_seleccionado();
            parhead['reenviar'] = reenviar;  //// SOLO USAR PARA SABER EN EL CONTROLLER Y CONDICIONAR PARA TRAER EL CODIGO DE LA TELA

            if (Object.keys(obj_criterio_aprobacion).length > 0) {
                parhead['atxestado_aprobado_rechazado'] = obj_criterio_aprobacion.resultado_aprobacion;
            } else {
                parhead['atxestado_aprobado_rechazado'] = '';
            }

            parhead['cambio_estado_y_datos_adicionales'] = cambio_estado_y_datos_adicionales;
            parhead['envio_correo_consignacion'] = _('chk_correo_consignacion').checked == true ? "1" : "0";

            let arrmatrizligamento_grabar = [], arrhilados = [], arrhiladocontenido = [],
                obj_acabado_fisico_y_quimico = [], obj_sinhilado = [];

            if (conhilado_seleccionado === '0') {
                arrmatrizligamento_grabar = getarraymatrizligamento(), arrhilados = getarrhilados(), arrhiladocontenido = getarrhiladocontenido(),
                obj_acabado_fisico_y_quimico = get_arr_acabadofisico_y_quimico();
            } else if (conhilado_seleccionado === '1') {
                obj_sinhilado = get_titulos_sinhilado();
            }

            let pardetail = {};
            pardetail['nropasadas'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.pasadas) : '[]';
            pardetail['img_elementos_ligamentos'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.img_elementos_ligamentos) : '[]';
            pardetail['repeticiones'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.repeticiones) : '[]';
            pardetail['hiladoporpasada'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.hiladoporpasada) : '[]';
            pardetail['hilados'] = Object.keys(arrhilados).length > 0 ? JSON.stringify(arrhilados) : '[]';
            pardetail['atxcontenido_hilado'] = Object.keys(arrhiladocontenido).length > 0 ? JSON.stringify(arrhiladocontenido) : '[]';
            pardetail['acabadofisico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadofisico : '';
            pardetail['acabadoquimico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadoquimico : '';
            pardetail['titulos_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.titulos_sinhilado) : '[]';
            pardetail['contenido_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.contenido_sinhilado) : '[]';
            pardetail['criterio_aprobacion'] = Object.keys(obj_criterio_aprobacion).length > 0 ? JSON.stringify(obj_criterio_aprobacion.arr_criterio_aprobacion) : '[]';

            frm.append('parhead', JSON.stringify(parhead));
            frm.append('pardetail', JSON.stringify(pardetail));
            frm.append('imagenestructura', fileestructura);
            frm.append('imagenmuestrafisica', filemuestrafisica);

            _Post('DesarrolloTextil/Atx/save_new_atx', frm)
                .then((odata) => {
                    let rpta = odata !== '' ? JSON.parse(odata) : null, escolgador = ovariables.escolgador,
                        idcolgadorsolicituddetalle_codigogenerado = _('hf_idcolgadorsolicituddetalle_codigogenerado').value, idservicio = _('hf_idservicio').value
                    if (rpta !== null) {
                        let mensaje_rpta = rpta.mensaje;

                        if (ovariables.estado_actual_solicitud === 'POR' && reenviar === 'si') {  //// PARA MODIFICAR EL MENSAJE
                            let data_rpta = rpta.data !== '' ? JSON.parse(rpta.data) : '', codigotela = data_rpta !== '' ? data_rpta[0].codigotela : '';
                            mensaje_rpta = rpta.mensaje + '\n' + codigotela;
                        }

                        _swal({
                            estado: rpta.estado,
                            mensaje: mensaje_rpta ////rpta.mensaje
                        });
                        if (ovariables.estado_actual_solicitud === 'POR' && reenviar === 'si') {
                            //let url_index = 'DesarrolloTextil/Solicitud/Index'
                            //ruteo_bandejamodelo_correo(url_index, ovariables.idsolicitud, 'divcontenedor_breadcrum');
                            return_bandeja();
                        } else {
                            let variable_par_finalizar = '';
                            appSolicitudAtx.fn_open_view_editaratx('edit', ovariables.idsolicitud, ovariables.idanalisistextilsolicitud, rpta.id, ovariables.estadoactual_btn_editaatx, variable_par_finalizar, txtpar_solicitudatx_index, escolgador, idcolgadorsolicituddetalle_codigogenerado, idservicio);
                        }
                    }
                }, (p) => {
                    err(p);
                });
        }

        function fn_save_edit_atx() {
            //// :EDU TODO ESTE BLOQUE ERA PARA LA GENERACION DE CODIGO DE TELA
            //let codigotela_gen = _('txtcodigotela_generado').value.trim(), guardar_con_cambiocodigotela = false, cambio_correlativo_save = 0, cambio_version_save = 0,
            //    generarcodigotela_ensaveedit = false;
            ////if (codigotela_gen !== '') {
            ////    let result_cambia_version_correlativo = validar_siescambio_version_correlativo();
            ////    if (result_cambia_version_correlativo.cambia_correlativo === 1 || result_cambia_version_correlativo.cambia_version === 1) {
            ////        // ENTONCES LLAMAR A LA FUNCION SAVE_NEW
            ////        guardar_con_cambiocodigotela = true;
            ////    } 
            ////}

            //if ((ovariables.finalizaratx === 'si' && (codigotela_gen === '' || codigotela_gen.length <= 11) ) || (ovariables.finalizaratx !== 'si' && (codigotela_gen === '' || codigotela_gen.length <= 11))) {
            //    // GENERAR EL CODIGO DE TELA PERO EN EL MISMO EDIT; // codigotela_gen.length < 11 POR LA MIGRACION DE CODIGOTELA ANTERIOR DE 11 DIGITOS
            //    cambio_correlativo_save = 1;
            //    generarcodigotela_ensaveedit = true;
            //} else if (ovariables.finalizaratx !== 'si' && codigotela_gen !== '') {
            //    // ESTO PUEDE SER CUANDO EL USUARIO SOLICITA MODIFICAR EL ATX PERO NO POR QUE HA SIDO RECHAZADO SINO POR QUE MODIFICARON EL ESTADO DE LA SOLICITUD
            //    // O TAMBIEN CUANDO EL USUARIO SOLO ESTA MODIFICANDO CONSTATEMENTE EL ATX
            //    let result_cambia_version_correlativo = validar_siescambio_version_correlativo();
            //    if (result_cambia_version_correlativo.cambia_correlativo === 1 || result_cambia_version_correlativo.cambia_version === 1) {
            //        // ENTONCES LLAMAR A LA FUNCION SAVE_NEW
            //        cambio_correlativo_save = result_cambia_version_correlativo.cambia_correlativo;
            //        cambio_version_save = result_cambia_version_correlativo.cambia_version;
            //        guardar_con_cambiocodigotela = true;
            //    } 
            //} 

            //if (guardar_con_cambiocodigotela && generarcodigotela_ensaveedit === false) {
            //    let obtn = _('_btn_save_update_atx');
            //    fn_save_new_atx(obtn, cambio_correlativo_save, cambio_version_save);
            //    return false;
            //}

            let req = _required({ clase: '_enty', id: 'panelEncabezado_atx' });
                //, par_editatx = _('txtpar_editatx').value, txtpar_solicitudatx_index = _par(par_editatx, 'txtpar_solicitudatx_index'),
                //cambio_correlativo_save = 0, conhilado_seleccionado = get_valor_conhilado_seleccionado(), idmotivosolicitud = _('hf_idmotivosolicitud').value, obj_criterio_aprobacion = [],
                //cambio_estado_y_datos_adicionales = '';
            if (req) {
                let pasavalidacion = validar_antes_grabar(true);

                if (pasavalidacion.pasavalidacion === false) {
                    if (pasavalidacion.mensaje_con_pregunta_sino === 'no') {
                        return false;
                    } else if (pasavalidacion.mensaje_con_pregunta_sino === 'si') {
                        swal({
                            title: "Deseas grabar de todas maneras?",
                            text: pasavalidacion.mensaje,
                            type: "error",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "Si",
                            cancelButtonText: "No",
                            closeOnConfirm: true
                        }, function (rpta_confirmacion) {
                            if (rpta_confirmacion) {
                                //// SI EL USUARIO SELECCIONO SI ENTONCES SE PROCEDERA A GRABAR EL ATX
                                fn_submetodo_save_edit_atx();
                            } else {  /// SI SELECCIONO NO SEGUIRA EN LA VENTANA HASTA CORREGIR LOS REQUERIDOS
                                return false;
                            }
                            return;
                        });
                    }
                    return false;
                } else {
                    fn_submetodo_save_edit_atx();
                }

                //// TODO ESTO LO PASARE A UNA FUNCION
                //if (idmotivosolicitud === '2') {
                //    obj_criterio_aprobacion = getarray_criterioaprobacion_save();
                //}

                ////// SI SE FINALIZA EL ATX Y NO EXISTE CODIGO DE TELA; GENERAR EL CODIGO DE TELA
                //if (_('txtcodigotela_generado').value.trim() === '' || ovariables.finalizaratx === 'si') {
                //    cambio_correlativo_save = 1;

                //    //// SI ES SOLICITUD DE ORIGEN COLGADOR WT; VOY A OBVIAR LA DIFERENCIA DE FAMILIAS
                //    if (appSolicitudAtx.ovariables.origenmuestra === 3) {  //// SOLICITUD DE ORIGEN TIPO COLGADOR WTS
                //        if (appSolicitudAtx.ovariables.origenmuestra_colgador_generarcodigotela === 'CAMBIAR_ESTADO') {
                //            cambio_estado_y_datos_adicionales = 'CAMBIAR_ESTADO|' + appSolicitudAtx.ovariables.codigotela_colgadorwts;
                //            cambio_correlativo_save = 0;
                //        }
                //    }
                //}

                //let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_atx' }), frm = new FormData(), cbodiametro = _('cbodiameter');
                //let files_imagen_estructura = _('fupArchivo').files, fileestructura = files_imagen_estructura[0];
                //let files_imagen_muestrafisica = _('fupimagenmuestra').files, filemuestrafisica = files_imagen_muestrafisica[0];
                //parhead['lavado'] = getlavado_seleccionado();
                //parhead['diametro'] = cbodiametro.selectedIndex > 0 ? cbodiametro.options[cbodiametro.selectedIndex].text : 0;
                //parhead['titulo'] = get_cadena_hilado_grabar();
                //parhead['descripciondensidad'] = get_descripcion_densidad_grabar();
                //let comentario = $("#txtanalisiscomentario").data('kendoEditor').value().toString();
                ////// escape codifica
                ////// AQUI COMENTARIO
                //comentario = escape(comentario.replace(/"/g, '~').replace("+", '¬'));  //escape();  //// NOTA ~ EN EL HTML ES PARA LAS COMILLAS "" SE HACE ESTO PARA PODER GRABAR EN EL SQL
                //parhead['comentario'] = comentario;

                //if (files_imagen_estructura.length > 0) {
                //    parhead['actualizarimagenestructura'] = 1;
                //} else {
                //    // SI SE HA ELIMINAR LA IMAGEN SE TIENE QUE ACTUALIZAR EN EL ATX
                //    let txt_imagen_estructura = _('txtimagenestructura'), dataini_imagenestructura = _('txtimagenestructura').getAttribute('data-ini');
                //    if (txt_imagen_estructura.value !== dataini_imagenestructura) {
                //        parhead['actualizarimagenestructura'] = 1;
                //    } else {
                //        parhead['actualizarimagenestructura'] = 0;
                //    }
                //}

                //if (files_imagen_muestrafisica.length > 0) {
                //    parhead['actualizarimagenmuestrafisica'] = 1;
                //} else {
                //    // SI SE HA ELIMINAR LA IMAGEN SE TIENE QUE ACTUALIZAR EN EL ATX
                //    let txt_imagen_muestrafisica = _('txtimagendemuestra'), dataini_imagenmuestrafisica = _('txtimagendemuestra').getAttribute('data-ini');
                //    if (txt_imagen_muestrafisica.value !== dataini_imagenmuestrafisica) {
                //        parhead['actualizarimagenmuestrafisica'] = 1;
                //    } else {
                //        parhead['actualizarimagenmuestrafisica'] = 0;
                //    }
                //}
                //if (ovariables.finalizaratx === 'si') {
                //    parhead['finalizaratx'] = 'si';
                //} else {
                //    parhead['finalizaratx'] = '';
                //}

                //parhead['cambio_correlativo'] = cambio_correlativo_save; //cambio_correlativo_save; PARA ESTE CASO ES PORQUE SE FINALIZA CUANDO FALTARON DATOS Y SE EDITA Y SE FINALIZA; PERO PARA ESTE CASO SOLO PASARIA UNA VEZ
                //parhead['cambio_version'] = 0; //cambio_version_save;
                //let indexoptfamilia = _('cbofamilia').selectedIndex;
                //parhead['nombrefamilia'] = indexoptfamilia > 0 ? _('cbofamilia').options[indexoptfamilia].text : '';
                //parhead['conhilado'] = conhilado_seleccionado; ////get_valor_conhilado_seleccionado();

                //if (Object.keys(obj_criterio_aprobacion).length > 0) {
                //    parhead['atxestado_aprobado_rechazado'] = obj_criterio_aprobacion.resultado_aprobacion;
                //} else {
                //    parhead['atxestado_aprobado_rechazado'] = '';
                //}

                //parhead['cambio_estado_y_datos_adicionales'] = cambio_estado_y_datos_adicionales;
                //parhead['envio_correo_consignacion'] = _('chk_correo_consignacion').checked == true ? "1" : "0";
                //let arrmatrizligamento_grabar = [], arrhilados = [], arrhiladocontenido = [],
                //    obj_acabado_fisico_y_quimico = [], obj_sinhilado = [];

                //if (conhilado_seleccionado === '0') {
                //    arrmatrizligamento_grabar = getarraymatrizligamento(), arrhilados = getarrhilados(), arrhiladocontenido = getarrhiladocontenido(),
                //    obj_acabado_fisico_y_quimico = get_arr_acabadofisico_y_quimico();
                //} else if (conhilado_seleccionado === '1') {
                //    obj_sinhilado = get_titulos_sinhilado();
                //}

                //let pardetail = {};
                ////// Object.keys PROPIO DEL JAVASCRIPT PARA PODER OBTENER EL LENGTH DE UN OBJECTO {}
                //pardetail['nropasadas'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.pasadas) : '[]';
                //pardetail['img_elementos_ligamentos'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.img_elementos_ligamentos) : '[]';
                //pardetail['repeticiones'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.repeticiones) : '[]';
                //pardetail['hiladoporpasada'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.hiladoporpasada) : '[]';
                //pardetail['hilados'] = Object.keys(arrhilados).length > 0 ? JSON.stringify(arrhilados) : '[]';
                //pardetail['atxcontenido_hilado'] = Object.keys(arrhiladocontenido).length > 0 ? JSON.stringify(arrhiladocontenido) : '[]';
                //pardetail['acabadofisico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadofisico : '';
                //pardetail['acabadoquimico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadoquimico : '';
                //pardetail['titulos_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.titulos_sinhilado) : '[]';
                //pardetail['contenido_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.contenido_sinhilado) : '[]';
                //pardetail['criterio_aprobacion'] = Object.keys(obj_criterio_aprobacion).length > 0 ? JSON.stringify(obj_criterio_aprobacion.arr_criterio_aprobacion) : '[]';

                //frm.append('parhead', JSON.stringify(parhead));
                //frm.append('pardetail', JSON.stringify(pardetail));
                //frm.append('imagenestructura', fileestructura);
                //frm.append('imagenmuestrafisica', filemuestrafisica);

                //_Post('DesarrolloTextil/Atx/save_edit_atx', frm)
                //    .then((odata) => {
                //        let rpta = odata !== '' ? JSON.parse(odata) : null;
                //        if (rpta !== null) {
                //            let mensaje_rpta = rpta.mensaje;
                //            if (ovariables.finalizaratx === 'si') {  //// AL FINALIZAR EL ATX CUANDO FALTARON DATOS
                //                let data_rpta = rpta.data !== '' ? JSON.parse(rpta.data) : '', codigotela = data_rpta !== '' ? data_rpta[0].codigotela : '';
                //                mensaje_rpta = rpta.mensaje + '\n' + codigotela;
                //            }

                //            _swal({
                //                estado: rpta.estado,
                //                mensaje: mensaje_rpta ////rpta.mensaje
                //            });
                //            if (ovariables.finalizaratx === 'si') {
                //                //let url_index = 'DesarrolloTextil/Solicitud/Index'
                //                //ruteo_bandejamodelo_correo(url_index, ovariables.idsolicitud, 'divcontenedor_breadcrum');
                //                return_bandeja();
                //            } else {
                //                let variable_par_finalizar = '';
                //                appSolicitudAtx.fn_open_view_editaratx('edit', ovariables.idsolicitud, ovariables.idanalisistextilsolicitud, rpta.id, ovariables.estadoactual_btn_editaatx, variable_par_finalizar, txtpar_solicitudatx_index);
                //            }

                //        }
                //    }, (p) => {
                //        err(p);
                //    });
            }
        }

        function fn_submetodo_save_edit_atx(){
            let par_editatx = _('txtpar_editatx').value, txtpar_solicitudatx_index = _par(par_editatx, 'txtpar_solicitudatx_index'),
                cambio_correlativo_save = 0, conhilado_seleccionado = get_valor_conhilado_seleccionado(), idmotivosolicitud = _('hf_idmotivosolicitud').value, obj_criterio_aprobacion = [],
                cambio_estado_y_datos_adicionales = '', idservicio = _('hf_idservicio').value;

            if (idmotivosolicitud === '2') {
                obj_criterio_aprobacion = getarray_criterioaprobacion_save();
            }

            //// SI SE FINALIZA EL ATX Y NO EXISTE CODIGO DE TELA; GENERAR EL CODIGO DE TELA
            if (_('txtcodigotela_generado').value.trim() === '' || ovariables.finalizaratx === 'si') {
                cambio_correlativo_save = 1;

                //// SI ES SOLICITUD DE ORIGEN COLGADOR WT; VOY A OBVIAR LA DIFERENCIA DE FAMILIAS
                if (appSolicitudAtx.ovariables.origenmuestra === 3) {  //// SOLICITUD DE ORIGEN TIPO COLGADOR WTS
                    if (appSolicitudAtx.ovariables.codigotela_colgadorwts !== '') {  //// ESTE DATO LO SACO DE ATX; SI ESTA VACIO ES POR QUE NO EXISTE EL CODIGO DE TELA QUE PUSO COMERCIAL PARA UN COLGADOR WTS(ORIGEN DE LA MUESTRA)
                        //// ENTONCES SI NO EXISTE CODIGO DE TELA COLGADOR WTS; ENTONCES GENERAR EL CODIGO DE TELA NUEVO; EL CODIGO DEBERIA TENER LOS 13 DIGITOS
                        if (appSolicitudAtx.ovariables.origenmuestra_colgador_generarcodigotela === 'CAMBIAR_ESTADO') {
                            cambio_estado_y_datos_adicionales = 'CAMBIAR_ESTADO|' + appSolicitudAtx.ovariables.codigotela_colgadorwts;
                            cambio_correlativo_save = 0;
                        }
                    }
                }
            }

            if (idservicio === '12') {  //// ES ATX COLGADOR
                let cbofamilia = _('cbofamilia'), familia_seleccionada = cbofamilia.selectedIndex > 0 ? cbofamilia.options[cbofamilia.selectedIndex].text.trim() : '',
                    nombre_familia_anterior = ovariables.nombrefamilia;
                if (familia_seleccionada !== nombre_familia_anterior) {
                    //// cambiar la abreviatura de la familia
                    let txtcodigotela_generado = _('txtcodigotela_generado'), codigotela_anterior = txtcodigotela_generado.value,
                        idfamilia = cbofamilia.value,
                        arr_familia_filter = ovariables.lstfamilia.filter(x => x.idfamilia === idfamilia), codigoabreviadofamilia_nuevo_seleccionado = '';
                    if (arr_familia_filter.length > 0) {
                        codigoabreviadofamilia_nuevo_seleccionado = arr_familia_filter[0].codigoabrevfamilia_codigotela;

                        var reg = new RegExp(ovariables.codigoabrevfamilia_codigotela, 'gi');
                        let codigotela_modificado =codigotela_anterior.replace(reg, codigoabreviadofamilia_nuevo_seleccionado)

                        //codigotela_anterior.replace(ovariables.codigoabrevfamilia_codigotela/gi, codigoabreviadofamilia_nuevo_seleccionado);
                        txtcodigotela_generado.value = codigotela_modificado;
                    }
                }
            }

            let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_atx' }), frm = new FormData(), cbodiametro = _('cbodiameter');
            let files_imagen_estructura = _('fupArchivo').files, fileestructura = files_imagen_estructura[0];
            let files_imagen_muestrafisica = _('fupimagenmuestra').files, filemuestrafisica = files_imagen_muestrafisica[0];
            parhead['lavado'] = getlavado_seleccionado();
            parhead['diametro'] = cbodiametro.selectedIndex > 0 ? cbodiametro.options[cbodiametro.selectedIndex].text : 0;
            parhead['titulo'] = get_cadena_hilado_grabar();
            parhead['descripciondensidad'] = get_descripcion_densidad_grabar();
            let comentario = $("#txtanalisiscomentario").data('kendoEditor').value().toString();
            //// escape codifica
            //// AQUI COMENTARIO
            comentario = escape(comentario.replace(/"/g, '~').replace(/\+/g, '¬'));  //escape();  //// NOTA ~ EN EL HTML ES PARA LAS COMILLAS "" SE HACE ESTO PARA PODER GRABAR EN EL SQL
            parhead['comentario'] = comentario;

            if (files_imagen_estructura.length > 0) {
                parhead['actualizarimagenestructura'] = 1;
            } else {
                // SI SE HA ELIMINAR LA IMAGEN SE TIENE QUE ACTUALIZAR EN EL ATX
                let txt_imagen_estructura = _('txtimagenestructura'), dataini_imagenestructura = _('txtimagenestructura').getAttribute('data-ini');
                if (txt_imagen_estructura.value !== dataini_imagenestructura) {
                    parhead['actualizarimagenestructura'] = 1;
                } else {
                    parhead['actualizarimagenestructura'] = 0;
                }
            }

            if (files_imagen_muestrafisica.length > 0) {
                parhead['actualizarimagenmuestrafisica'] = 1;
            } else {
                // SI SE HA ELIMINAR LA IMAGEN SE TIENE QUE ACTUALIZAR EN EL ATX
                let txt_imagen_muestrafisica = _('txtimagendemuestra'), dataini_imagenmuestrafisica = _('txtimagendemuestra').getAttribute('data-ini');
                if (txt_imagen_muestrafisica.value !== dataini_imagenmuestrafisica) {
                    parhead['actualizarimagenmuestrafisica'] = 1;
                } else {
                    parhead['actualizarimagenmuestrafisica'] = 0;
                }
            }
            if (ovariables.finalizaratx === 'si') {
                parhead['finalizaratx'] = 'si';
            } else {
                parhead['finalizaratx'] = '';
            }

            parhead['cambio_correlativo'] = cambio_correlativo_save; //cambio_correlativo_save; PARA ESTE CASO ES PORQUE SE FINALIZA CUANDO FALTARON DATOS Y SE EDITA Y SE FINALIZA; PERO PARA ESTE CASO SOLO PASARIA UNA VEZ
            parhead['cambio_version'] = 0; //cambio_version_save;
            let indexoptfamilia = _('cbofamilia').selectedIndex;
            parhead['nombrefamilia'] = indexoptfamilia > 0 ? _('cbofamilia').options[indexoptfamilia].text : '';
            parhead['conhilado'] = conhilado_seleccionado; ////get_valor_conhilado_seleccionado();

            if (Object.keys(obj_criterio_aprobacion).length > 0) {
                parhead['atxestado_aprobado_rechazado'] = obj_criterio_aprobacion.resultado_aprobacion;
            } else {
                parhead['atxestado_aprobado_rechazado'] = '';
            }

            parhead['cambio_estado_y_datos_adicionales'] = cambio_estado_y_datos_adicionales;
            parhead['envio_correo_consignacion'] = _('chk_correo_consignacion').checked == true ? "1" : "0";
            let arrmatrizligamento_grabar = [], arrhilados = [], arrhiladocontenido = [],
                obj_acabado_fisico_y_quimico = [], obj_sinhilado = [];

            if (conhilado_seleccionado === '0') {
                arrmatrizligamento_grabar = getarraymatrizligamento(), arrhilados = getarrhilados(), arrhiladocontenido = getarrhiladocontenido(),
                obj_acabado_fisico_y_quimico = get_arr_acabadofisico_y_quimico();
            } else if (conhilado_seleccionado === '1') {
                obj_sinhilado = get_titulos_sinhilado();
            }

            let pardetail = {};
            //// Object.keys PROPIO DEL JAVASCRIPT PARA PODER OBTENER EL LENGTH DE UN OBJECTO {}
            pardetail['nropasadas'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.pasadas) : '[]';
            pardetail['img_elementos_ligamentos'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.img_elementos_ligamentos) : '[]';
            pardetail['repeticiones'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.repeticiones) : '[]';
            pardetail['hiladoporpasada'] = Object.keys(arrmatrizligamento_grabar).length > 0 ? JSON.stringify(arrmatrizligamento_grabar.hiladoporpasada) : '[]';
            pardetail['hilados'] = Object.keys(arrhilados).length > 0 ? JSON.stringify(arrhilados) : '[]';
            pardetail['atxcontenido_hilado'] = Object.keys(arrhiladocontenido).length > 0 ? JSON.stringify(arrhiladocontenido) : '[]';
            pardetail['acabadofisico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadofisico : '';
            pardetail['acabadoquimico'] = Object.keys(obj_acabado_fisico_y_quimico).length > 0 ? obj_acabado_fisico_y_quimico.arr_acabadoquimico : '';
            pardetail['titulos_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.titulos_sinhilado) : '[]';
            pardetail['contenido_sinhilado'] = Object.keys(obj_sinhilado).length > 0 ? JSON.stringify(obj_sinhilado.contenido_sinhilado) : '[]';
            pardetail['criterio_aprobacion'] = Object.keys(obj_criterio_aprobacion).length > 0 ? JSON.stringify(obj_criterio_aprobacion.arr_criterio_aprobacion) : '[]';

            frm.append('parhead', JSON.stringify(parhead));
            frm.append('pardetail', JSON.stringify(pardetail));
            frm.append('imagenestructura', fileestructura);
            frm.append('imagenmuestrafisica', filemuestrafisica);

            _Post('DesarrolloTextil/Atx/save_edit_atx', frm)
                .then((odata) => {
                    let rpta = odata !== '' ? JSON.parse(odata) : null;
                    if (rpta !== null) {
                        let mensaje_rpta = rpta.mensaje, escolgador = ovariables.escolgador,
                            idcolgadorsolicituddetalle_codigogenerado = _('hf_idcolgadorsolicituddetalle_codigogenerado').value;
                        if (ovariables.finalizaratx === 'si') {  //// AL FINALIZAR EL ATX CUANDO FALTARON DATOS
                            let data_rpta = rpta.data !== '' ? JSON.parse(rpta.data) : '', codigotela = data_rpta !== '' ? data_rpta[0].codigotela : '';
                            mensaje_rpta = rpta.mensaje + '\n Codigo Tela Generado: ' + codigotela;
                        }

                        _swal({
                            estado: rpta.estado,
                            mensaje: mensaje_rpta ////rpta.mensaje
                        });
                        if (ovariables.finalizaratx === 'si') {
                            //let url_index = 'DesarrolloTextil/Solicitud/Index'
                            //ruteo_bandejamodelo_correo(url_index, ovariables.idsolicitud, 'divcontenedor_breadcrum');
                            return_bandeja();
                        } else {
                            let variable_par_finalizar = '';
                            appSolicitudAtx.fn_open_view_editaratx('edit', ovariables.idsolicitud, ovariables.idanalisistextilsolicitud, rpta.id, ovariables.estadoactual_btn_editaatx, variable_par_finalizar, txtpar_solicitudatx_index, escolgador, idcolgadorsolicituddetalle_codigogenerado, idservicio);
                        }

                    }
                }, (p) => {
                    err(p);
                });
        }

        function validar_antes_grabar(mostrarmensaje) {
            // MATRIZ LIGAMENTOS
            let tbody = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0], arrfilas = tbody !== undefined ? Array.from(tbody.rows) : [],
                mensaje = '', pasavalidacion = true, arrchklavado = Array.from(_('div_grupo_chklavado').getElementsByClassName('_clschk_wash')), ischecked_lavado = false,
                obj_validar_hilado_y_estructura_tejido = {}, obj_return = {}, conhilado_seleccionado = '', valor_filas_ligamentos = _parseInt(_('txt_matriz_filas').value),
                valor_columnas_ligamentos = _parseInt(_('txt_matriz_columnas').value), div_pasada = _('div_tblmatriz1_pasadas'), tbl_pasadas = div_pasada.getElementsByClassName('cls_tbl_pasadas')[0],
                totalpasadas = 0, div_ligamentos = _('div_tblmatriz2_imagenesligamentos'), tbl_ligamentos_0 = div_ligamentos.getElementsByClassName('cls_tbl_matriz_imagenesligamentos')[0],
                totalcolumnas_ligamentos = 0;

            if (tbl_pasadas) {
                totalpasadas = tbl_pasadas.rows.length;
            }
            if (tbl_ligamentos_0) {
                totalcolumnas_ligamentos = tbl_ligamentos_0.rows[0].cells.length;
            }

            if (valor_filas_ligamentos !== totalpasadas || valor_columnas_ligamentos !== totalcolumnas_ligamentos) {
                mensaje += '- El número de filas o columnas no corresponde con la matriz de ligamentos. Porfavor seleccione [Generar] para actualizar la matriz de ligamentos. \n';
                pasavalidacion = false;
            }

            arrfilas.forEach((x, indice) => {
                let txta = x.getElementsByClassName('cls_txta_nrorepeticiones')[0];
                if (x.clientHeight > 80) {
                    if (txta.value <= 1 || txta.value === '') {
                        mensaje += '- En la repeticion ' + (indice + 1) + ' debe ser mayor a 1 \n';
                        pasavalidacion = false;
                    };
                }
            });



            //// VALIDAR CHKLAVADO
            if (ovariables.finalizaratx === 'si' || ovariables.idservicio === '12') {  //// 12 = SOLICITUD DE COLGADORES
                _('div_grupo_chklavado').classList.remove('has-error');
                arrchklavado.some(x => {
                    if (x.checked) {
                        ischecked_lavado = true;
                        return true;
                    }
                });

                if (ischecked_lavado === false) {
                    mensaje += '- Seleccione el tipo de lavado. \n';
                    _('div_grupo_chklavado').classList.add('has-error');
                    pasavalidacion = false;
                }

                //// VALIDAR HILADOS Y LIGAMENTOS
                conhilado_seleccionado = get_valor_conhilado_seleccionado();
                if (conhilado_seleccionado === '0') {
                    obj_validar_hilado_y_estructura_tejido = antesgrabar_validar_hilado_y_estructura_ligamento_finalizar();
                    if (obj_validar_hilado_y_estructura_tejido.pasavalidacion === false) {
                        mensaje += obj_validar_hilado_y_estructura_tejido.mensaje;
                        pasavalidacion = false;
                    }
                } else if (conhilado_seleccionado === '1') {
                    let obj_validar_titulos_contenidos_sinhilado = antesgrabar_validar_titulos_contenidos_sinhilado_finalizar();
                    if (obj_validar_titulos_contenidos_sinhilado.pasavalidacion === false) {
                        mensaje += obj_validar_titulos_contenidos_sinhilado.mensaje;
                        pasavalidacion = false;
                    }
                }

                //// VALIDACION CRITERIO APROBACION
                let tbody_aprobacion = _('tbody_criterio_aprobacion'), arr_rows_aprobacion = Array.from(tbody_aprobacion.rows);
                arr_rows_aprobacion.forEach(x => {
                    let arr_chk = Array.from(x.getElementsByClassName('_clscheck_aprobacion')),
                        valor_estado = get_criterioaprobacion_seleccionado(arr_chk), txtacomentario = x.getElementsByClassName('_cls_txta_comentario')[0];

                    //// ANTES DE VISUALIZAR LOS ERRORES
                    let arr_error_aprobacion = [];
                    arr_error_aprobacion = Array.from(x.getElementsByClassName('_cls_error_chk_criterioaprobacion'));
                    arr_error_aprobacion.forEach(x => {
                        x.classList.add('hide');
                    });
                    x.getElementsByClassName('_cls_error_comentario_criterioaprobacion')[0].classList.add('hide');

                    arr_error_aprobacion = [];
                    if (valor_estado === '') {
                        arr_error_aprobacion = Array.from(x.getElementsByClassName('_cls_error_chk_criterioaprobacion'));
                        arr_error_aprobacion.forEach(x => {
                            x.classList.remove('hide');
                        });
                        mensaje += 'Falta completar el criterio de aprobación \n';
                        pasavalidacion = false;
                    }
                    if (valor_estado === 'RECH') {
                        if (txtacomentario.value.trim() === '') {
                            mensaje += 'Los criterios de aprobación rechazados necesitan agregar comentarios \n';
                            x.getElementsByClassName('_cls_error_comentario_criterioaprobacion')[0].classList.remove('hide');
                            pasavalidacion = false;
                        }
                    }
                });
            } else {
                let obj_validacion_hilados = antesgrabar_validacion_simple_hilados();
                if (obj_validacion_hilados.pasavalidacion === false) {
                    pasavalidacion = false;
                }
            }

            if (mensaje !== '' && mostrarmensaje) {
                if (ovariables.finalizaratx === 'si') {
                    if (conhilado_seleccionado === '0') {
                        if (obj_validar_hilado_y_estructura_tejido.mensaje_con_pregunta_sino === 'si') {
                            //mensaje += obj_validar_hilado_y_estructura_tejido.mensaje;
                        } else {
                            _swal({ mensaje: mensaje, estado: 'error' });
                        }
                    } else {
                        _swal({ mensaje: mensaje, estado: 'error' });
                    }
                } else {
                    _swal({ mensaje: mensaje, estado: 'error' });
                }
            }

            obj_return.mensaje = mensaje;
            obj_return.pasavalidacion = pasavalidacion;
            obj_return.mensaje_con_pregunta_sino = obj_validar_hilado_y_estructura_tejido.mensaje_con_pregunta_sino !== undefined ? obj_validar_hilado_y_estructura_tejido.mensaje_con_pregunta_sino : 'no';
            //return pasavalidacion;
            return obj_return
        }

        function antesgrabar_validacion_simple_hilados() {
            let arrfilas = Array.from(_('tbody_yarndetail').rows), totalfilas = arrfilas.length, pasavalidacion = true, obj_return = {};
            if (totalfilas > 0) {
                arrfilas.forEach((x, indice) => {
                    x.getElementsByClassName('spn_error_sistemahilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_titulohilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_yarnhilado')[0].classList.add('hide');
                });

                arrfilas.forEach(x => {
                    let cbosistema = x.getElementsByClassName('cls_system')[0], cbotitulo = x.getElementsByClassName('cls_title')[0],
                        cbohilado = x.getElementsByClassName('cls_yarn')[0];
                    if (cbosistema.value === '') {
                        let spn_error_sistema = x.getElementsByClassName('spn_error_sistemahilado')[0];
                        spn_error_sistema.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (cbotitulo.value === '') {
                        let spn_error_titulo = x.getElementsByClassName('spn_error_titulohilado')[0];
                        spn_error_titulo.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (cbohilado.value === '') {
                        let spn_error_yarnhilado = x.getElementsByClassName('spn_error_yarnhilado')[0];
                        spn_error_yarnhilado.classList.remove('hide');
                        pasavalidacion = false;
                    }
                });
            }
            obj_return.mensaje = '';
            obj_return.pasavalidacion = pasavalidacion;
            return obj_return;
        }

        function antesgrabar_validar_hilado_y_estructura_ligamento_finalizar() {
            let arrfilas = Array.from(_('tbody_yarndetail').rows), totalfilas = arrfilas.length, mensaje = '', existenhilados = true,
                existenpasadas = true, lsthilados = [], lsthilados_pasadas = [], ningun_hilado_seestausando = false, lstpasadas = [],
                lst_img_ligamentos = [], pasavalidacion = true, obj_return = {}, totalporcentaje_hilado = 0, validacion_pasadas_ligamentos = '', validacion_pasadas_hilados = '',
                mensaje_con_pregunta_sino = 'no';

            if (totalfilas === 0) {
                mensaje = '- Debe registrar al menos un hilo \n';
                existenhilados = false;
            }

            if (existenhilados) {
                arrfilas.forEach((x, indice) => {
                    x.getElementsByClassName('spn_error_sistemahilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_titulohilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_yarnhilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_porcentajehilado')[0].classList.add('hide');
                });
                //// crear lst de hilados 
                arrfilas.forEach((x, indice) => {
                    let datapar_hilado = x.getAttribute('data-par'), guid_hilado = _par(datapar_hilado, 'guid_hilado');
                    let obj_hilado = { guid_hilado: guid_hilado, nrohilado: (indice + 1) }
                    lsthilados.push(obj_hilado);

                    let cbosistema = x.getElementsByClassName('cls_system')[0], cbotitulo = x.getElementsByClassName('cls_title')[0],
                        cbohilado = x.getElementsByClassName('cls_yarn')[0], txtporcentaje_hilo = x.getElementsByClassName('cls_porcentaje')[0];
                    if (cbosistema.value === '') {
                        let spn_error_sistema = x.getElementsByClassName('spn_error_sistemahilado')[0];
                        spn_error_sistema.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (cbotitulo.value === '') {
                        let spn_error_titulo = x.getElementsByClassName('spn_error_titulohilado')[0];
                        spn_error_titulo.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (cbohilado.value === '') {
                        let spn_error_yarnhilado = x.getElementsByClassName('spn_error_yarnhilado')[0];
                        spn_error_yarnhilado.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (txtporcentaje_hilo.value === '' || parseFloat(txtporcentaje_hilo.value) === 0) {
                        let spn_error_porcentajehilado = x.getElementsByClassName('spn_error_porcentajehilado')[0];
                        spn_error_porcentajehilado.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    totalporcentaje_hilado += txtporcentaje_hilo.value !== '' ? parseFloat(txtporcentaje_hilo.value) : 0;
                });

                if (totalporcentaje_hilado !== 100) {
                    mensaje += '- El total del porcentaje de hilado debe ser igual al 100% \n';
                }

                //// SI HAY IMAGEN DE ESTRUCTURA DE LIGAMENTOS NO ES OBLIGATORIO CREAR EL DISEÑO DE LA ESTRUCTURA DEL TEJIDO
                if (_('txtimagenestructura').value === '') {
                    //// VALIDAR SI HAY PASADAS
                    let tbl_pasadas = _('div_tblmatriz1_pasadas') !== null ? _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0] : null;
                    if (tbl_pasadas === null || tbl_pasadas === undefined) {
                        existenpasadas = false;
                        mensaje += '- Falta crear la matriz de diseño de ligamentos \n';
                    }
                    if (existenpasadas) {
                        let tblpasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0];
                        let arr_img_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_ligamentodraggable'));
                        let arrli_hilados_pasadas = Array.from(_('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_li_nombrehilado_completo'));
                        let arrpasadas = Array.from(tblpasadas.rows);
                        arrpasadas.forEach((x, indice) => {
                            let nropasada = (indice + 1);
                            lstpasadas.push(nropasada);
                        });

                        arr_img_ligamentos.forEach(x => {
                            let fila = x.parentNode.parentNode, nropasada = fila.getAttribute('data-nropasada'), obj_img_ligamentos = { nropasada: nropasada };
                            lst_img_ligamentos.push(obj_img_ligamentos);
                        });


                        arrli_hilados_pasadas.forEach(x => {
                            let datapar_li = x.getAttribute('data-par'), guid_hilado_pasada = _par(datapar_li, 'guid_hilado'), fila = x.parentNode.parentNode.parentNode.parentNode,
                                nropasada = fila.getAttribute('data-nropasada');
                            let obj_li_pasada = { guid_hilado: guid_hilado_pasada, nropasada: nropasada }
                            lsthilados_pasadas.push(obj_li_pasada);
                        });
                        if (lsthilados_pasadas.length > 0) {
                            //// VALIDAR QUE HILOS NO SE ESTAN USANDO
                            let contador = 0;
                            lsthilados.forEach(x => {
                                let lst = lsthilados_pasadas.filter(h => h.guid_hilado === x.guid_hilado);
                                if (lst.length === 0) {
                                    mensaje += '- El hilado N° ' + x.nrohilado + ' no se esta usando en la estructura del tejido';
                                }
                            });
                        } else {
                            //// HILOS SIN USAR
                            mensaje += '- Ningun hilado se esta usando en la estructura del tejido. \n';
                            ningun_hilado_seestausando = true;
                        }

                        //// VALIDAR SI HAY LIGAMENTOS POR PASADAS
                        lstpasadas.forEach(x => {
                            let lstfilter_ligamentos = lst_img_ligamentos.filter(f => parseInt(f.nropasada) === x);
                            if (lstfilter_ligamentos.length <= 0) {
                                //mensaje += `- En la pasada ${x} falta agregar ligamentos \n`;
                                validacion_pasadas_ligamentos += `- En la pasada ${x} falta agregar ligamentos \n`;
                                
                            }

                            let lstfilter_hiladoporpasada = lsthilados_pasadas.filter(f => parseInt(f.nropasada) === x);
                            if (lstfilter_hiladoporpasada.length <= 0) {
                                //mensaje += `- En la pasada ${x} falta agregar hilado(s) \n`;
                                validacion_pasadas_hilados += `- En la pasada ${x} falta agregar hilado(s) \n`;
                            }
                        });
                    }
                }
            }

            if (mensaje !== '') {
                pasavalidacion = false;
            } else {
                if (validacion_pasadas_ligamentos !== '' && validacion_pasadas_hilados !== '') {  //// SE PREGUNTARA SI DESEA GRABAR CON PASADAS VACIAS
                    mensaje += validacion_pasadas_ligamentos + validacion_pasadas_hilados;
                    pasavalidacion = false;
                    mensaje_con_pregunta_sino = 'si';
                } else if (validacion_pasadas_ligamentos !== '' || validacion_pasadas_hilados !== '') {
                    pasavalidacion = false;
                    mensaje += validacion_pasadas_ligamentos + validacion_pasadas_hilados;
                }
            }

            obj_return.mensaje = mensaje;
            obj_return.pasavalidacion = pasavalidacion;
            obj_return.mensaje_con_pregunta_sino = mensaje_con_pregunta_sino;

            return obj_return;
        }

        function antesgrabar_validar_titulos_contenidos_sinhilado_finalizar() {
            let arrfilas_titulos = Array.from(_('tbody_titulo_sinhilado').rows), totalfilas_titulos = arrfilas_titulos.length, mensaje = '', existentitulos = true,
                arrfilas_contenido = Array.from(_('tbody_contenido_sinhilado').rows), totalfilas_contenido = arrfilas_contenido.length, existen_contenidos = true, pasavalidacion = true,
                obj_return = {};

            if (totalfilas_titulos === 0) {
                mensaje = '- Debe registrar al menos un título \n';
                existentitulos = false;
                pasavalidacion = false;
            }

            if (totalfilas_contenido === 0) {
                mensaje += '- Debe registrar al menos un contenido \n';
                existen_contenidos = false;
                pasavalidacion = false;
            }

            if (existentitulos) {
                arrfilas_titulos.forEach(x => {
                    let cbosistema = x.getElementsByClassName('_cls_systema_sinhilado')[0], error_sistema = x.getElementsByClassName('spn_error_sistema')[0],
                        cbotitulo = x.getElementsByClassName('_cls_titulo_sinhilado')[0], error_titulo = x.getElementsByClassName('spn_error_titulo')[0];

                    error_sistema.classList.add('hide');
                    error_titulo.classList.add('hide');

                    if (cbosistema.selectedIndex === -1 || cbosistema.selectedIndex === 0) {
                        pasavalidacion = false;
                        error_sistema.classList.remove('hide');
                    }

                    if (cbotitulo.selectedIndex === -1 || cbotitulo.selectedIndex === 0) {
                        pasavalidacion = false;
                        error_titulo.classList.remove('hide');
                    }
                });
            }

            if (existen_contenidos) {
                let totalporcentaje = 0;
                arrfilas_contenido.forEach(x => {
                    let cbomateriaprima = x.getElementsByClassName('_cls_materiaprima_sinhilado')[0], error_materiaprima = x.getElementsByClassName('spn_error_materiaprima')[0],
                        txtporcentaje = x.getElementsByClassName('_cls_txt_porcentaje')[0], error_porcenteja = x.getElementsByClassName('spn_error_porcentaje')[0];

                    error_materiaprima.classList.add('hide');
                    error_porcenteja.classList.add('hide');

                    if (cbomateriaprima.selectedIndex === -1 || cbomateriaprima.selectedIndex === 0) {
                        error_materiaprima.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (txtporcentaje.value === '' || parseFloat(txtporcentaje.value) === 0) {
                        error_porcenteja.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (txtporcentaje.value === '') {
                        totalporcentaje += 0;
                    } else {
                        totalporcentaje += parseFloat(txtporcentaje.value);
                    }
                });

                if (parseInt(totalporcentaje) !== 100) {
                    mensaje += '- El porcentaje debe ser el 100% \n';
                    pasavalidacion = false;
                }
            }

            if (mensaje !== '') {
                pasavalidacion = false;
            }

            obj_return.mensaje = mensaje;
            obj_return.pasavalidacion = pasavalidacion;

            return obj_return;
        }

        function getarrhiladocontenido() {
            let tbody_hilado = _('tbody_yarndetail'), arrfilas = Array.from(tbody_hilado.rows), lst_grabar = [];
            arrfilas.forEach(x => {
                let datatable = x.getAttribute('data-table'), lst = datatable !== '' ? JSON.parse(datatable) : null;
                if (lst !== null) {
                    lst.forEach(item => {
                        lst_grabar.push(item);
                    });
                }
            });
            return lst_grabar;
        }

        function getarrhilados() {
            let tbl_hilado = _('tbody_yarndetail'), arrfilas = Array.from(tbl_hilado.rows), lsthilado = [];
            arrfilas.forEach((x, indice) => {
                let datapar = x.getAttribute('data-par'), guid_hilado = _par(datapar, 'guid_hilado'), idsistema = x.getElementsByClassName('cls_system')[0].value, nromuestras = x.getElementsByClassName('cls_samples')[0].value,
                    longitudtotal = x.getElementsByClassName('cls_lenghttotal')[0].innerText.trim(),
                    txtpeso = x.getElementsByClassName('cls_weight')[0],
                    peso = txtpeso.value !== '' ? txtpeso.value.replace(/,/g, '') : 0,
                    txtlongitud = x.getElementsByClassName('cls_length')[0],
                    longitud = txtlongitud.value !== '' ? txtlongitud.value.replace(/,/g, '') : 0,
                    tituloexacto = x.getElementsByClassName('cls_titleexacto')[0].innerText.trim(),
                    cbotitulo = x.getElementsByClassName('cls_title')[0], 
                    idtitulohiladotela = _getValueDataList(cbotitulo.value, x.getElementsByClassName('cls_title')[1]) // ARRAY 1 = DATALIST //cbotitulo.selectedIndex > 0 ? cbotitulo.value : ''
                    , titulo = cbotitulo.value //cbotitulo.options[cbotitulo.selectedIndex].text
                    , idhilado = x.getElementsByClassName('cls_yarn')[0].value,
                    idformahilado = _getValueDataList(x.getElementsByClassName('cls_shapedyarn')[0].value, x.getElementsByClassName('cls_shapedyarn')[1]) //x.getElementsByClassName('cls_shapedyarn')[0].value
                    , txtporcentaje = x.getElementsByClassName('cls_porcentaje')[0],
                    porcentaje = txtporcentaje.value !== '' ? txtporcentaje.value.replace(/,/g, '') : 0, orden = (indice + 1), contenido = x.getElementsByClassName('cls_linkfiberyarn')[0].innerText.trim(),
                    idanalisistextilhilado = _par(datapar, 'idanalisistextilhilado');

                obj = {
                    idanalisistextilhilado: idanalisistextilhilado,
                    idsistematitulacion: idsistema,
                    idhilado: idhilado,
                    longitud: longitud,
                    muestra: nromuestras,
                    longitudtotal: longitudtotal,
                    peso: peso,
                    tituloexacto: tituloexacto,
                    titulo: titulo,
                    porcentaje: porcentaje,
                    orden: orden,
                    contenido: contenido,
                    idformahilado: idformahilado,
                    idtitulohiladotela: idtitulohiladotela,
                    guid_hilado: guid_hilado
                };
                lsthilado.push(obj);
            });
            return lsthilado;
        }

        function err(__err) {
            console.log('err', __err);
        }

        function res_ini_edit(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {
                let analisistextil = CSVtoJSON(rpta[0].atx), hilados = rpta[0].tblhilados !== '' ? CSVtoJSON(rpta[0].tblhilados) : null,
                    tblpasadas = rpta[0].tblpasadas !== '' ? CSVtoJSON(rpta[0].tblpasadas) : null, tblimg_ligamentos = rpta[0].tblimg_ligamentos !== '' ? CSVtoJSON(rpta[0].tblimg_ligamentos) : null,
                    tblrepeticiones = rpta[0].tblrepeticiones !== '' ? CSVtoJSON(rpta[0].tblrepeticiones) : null, tblhiladoporpasada = rpta[0].tblhiladoporpasada !== '' ? CSVtoJSON(rpta[0].tblhiladoporpasada) : null,
                    hiladocontenido = rpta[0].tbl_hilado_contenido !== '' ? CSVtoJSON(rpta[0].tbl_hilado_contenido) : null, idgalga = analisistextil[0].idgalga, idgalgadiametro = analisistextil[0].idgalgadiametro,
                    atx_acabadofisico = rpta[0].analisistextil_acabadofisico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadofisico) : null,
                    atx_acabadoquimico = rpta[0].analisistextil_acabadoquimico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadoquimico) : null,
                    //// AQUI COMENTARIO
                    comentario_atx = rpta[0].comentario_atx.replace(/~/g, '"').replace(/¬/g, '+'),
                    conhilado = analisistextil[0].conhilado, titulos_sinhilado = rpta[0].titulos_sinhilado !== '' ? CSVtoJSON(rpta[0].titulos_sinhilado) : null,
                    contenido_sinhilado = rpta[0].contenido_sinhilado !== '' ? CSVtoJSON(rpta[0].contenido_sinhilado) : null, idmotivosolicitud = '', atxestado_aprobado_rechazado = analisistextil[0].atxestado_aprobado_rechazado;

                seleccionar_radio_conhilado(conhilado);
                fn_visualizar_ocultar_segun_conhilado_seleccionado(conhilado);
                _('hf_analisisarea').value = analisistextil[0].area;

                cargar_combos_ysetearvariablesglobales_ini(rpta);
                cargar_cbo_acabadofisico_y_quimico_ini_edit(atx_acabadofisico, atx_acabadoquimico);
                // SETEAR VALORES COMBO
                _('cbotipotela').value = analisistextil[0].idtipotejido;
                _('cbotipofontura').value = analisistextil[0].idtipofontura;
                _('cbogalga').value = analisistextil[0].idgalga;
                _('cbofamilia').value = analisistextil[0].idfamilia;
                _('cbopretratamiento').value = analisistextil[0].idpretratamiento;
                _('cbometodotenido').value = analisistextil[0].idmetodotenido;
                _('cbotipotenido').value = analisistextil[0].idtipotenido;
                _('cbounidad').value = analisistextil[0].idunidadmedida;
                _('cbometodoancho').value = analisistextil[0].idtipoancho;
                _('cbometododensidad').value = analisistextil[0].metodo;
                _('cboproveedor').value = analisistextil[0].idproveedor === "0" ? '' : analisistextil[0].idproveedor;
                _('cboposition').value = analisistextil[0].idposicionestructura;
                _('cbotipocolgador').value = analisistextil[0].idtipocolgador !== '' ? analisistextil[0].idtipocolgador : 1;  // 1 = basico
                _('cbotipomaquina').value = analisistextil[0].idtipomaquina;
                //// CARGAR COMBO DIAMETRO
                if (idgalga !== "0") {
                    let lst_galgadiametro = ovariables.lst_cbo_diametrogalga.filter(x => x.idgalga === idgalga);
                    _('cbodiameter').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst_galgadiametro, 'idgalgadiametro', 'diametro');
                    _('cbodiameter').value = idgalgadiametro;
                    if (idgalgadiametro !== '') {
                        let lstdiametro = ovariables.lst_cbo_diametrogalga.filter(x => x.idgalgadiametro === idgalgadiametro);
                        if (lstdiametro.length > 0) {
                            _('txtnumeroaguja').value = lstdiametro[0].agujas;

                        } else {
                            _('txtnumeroaguja').value = 0;
                        }
                    }
                } else {
                    _('cbodiameter').innerHTML = _comboItem({ value: '', text: 'Select' });
                }

                // INPUT TEXT
                _('txtcodigoatx').value = analisistextil[0].codigo;
                _('txtfechaedicionatx').value = analisistextil[0].fecha;
                _('txtoperadoratx').value = analisistextil[0].analista;
                _('txt_matriz_filas').value = analisistextil[0].filaestructura;
                _('txt_matriz_columnas').value = analisistextil[0].columnaestructura;
                _('txtcolumnasporpulgada').value = analisistextil[0].columnasporpulgada;
                _('txtcursasporpulgada').value = analisistextil[0].cursasporpulgada;
                let txtanchoabiertototal = _('txtanchoabiertototal'), txtanchoabiertoutil = _('txtanchoabiertoutil');
                txtanchoabiertototal.value = analisistextil[0].anchoabiertototal;
                txtanchoabiertoutil.value = analisistextil[0].anchoabiertoutil;
                if (analisistextil[0].idtipoancho === "2") {
                    txtanchoabiertototal.disabled = true;
                    txtanchoabiertoutil.disabled = true;
                }

                _('txtdescyarnsize').value = analisistextil[0].titulo.replace(/~/gi, '+');
                _('txtimagenestructura').value = analisistextil[0].imagenoriginal;
                _('txtimagenestructura').setAttribute('data-ini', analisistextil[0].imagenoriginal);
                _('txtimagendemuestra').value = analisistextil[0].imagenoriginalmuestrafisica;
                _('txtimagendemuestra').setAttribute('data-ini', analisistextil[0].imagenoriginalmuestrafisica);
                _('txtdescfamilia').value = analisistextil[0].nombrefamilia;
                _('txtdesccontent').value = analisistextil[0].descripcionporcentajecontenidotela;
                _('txtdescdensidad').value = analisistextil[0].descripciondensidad;
                _('txtanalisisarea').value = analisistextil[0].area;
                _('txtAnalisisPeso').value = analisistextil[0].peso;
                _('txtdensidad').value = analisistextil[0].densidad;
                _('txtcodigotela').value = analisistextil[0].codigotela_referencia_wts;  // ESTE HAY QUE CAMBIARLO POR EL CODIGO CLIENTE WTS
                _('txtcodigotela_generado').value = analisistextil[0].codigotela;  // ESTE ES EL CODIGO GENERADO
                _('txtmillcode').value = analisistextil[0].codigofabrica;
                _('txttestingcode').value = analisistextil[0].codigolaboratorio;
                _('txtbatch').value = analisistextil[0].partidalote;
                _('txttradename').value = analisistextil[0].nombrecomercial;
                _('txtanalisiscomentario').value = comentario_atx;
                //// DATOS ADICIONALES PARA FICHATECNICA
                _('txtcodigotelaorigen').value = analisistextil[0].codigotelaorigen;
                _('txtmarca').value = analisistextil[0].marca;
                _('txtnumerosistemas').value = analisistextil[0].numerosistemas;
                _('txttemperatura').value = analisistextil[0].temperatura;
                _('txtvelocidad').value = analisistextil[0].velocidad;
                _('txtpantone').value = analisistextil[0].pantone;
                _('txtestilocliente').value = analisistextil[0].estilocliente;
                _('txtcodigotelacliente').value = analisistextil[0].codigotelacliente;
                _('txtencogimientolargo').value = analisistextil[0].encogimientoporcentajelargo;
                _('txtencogimientoancho').value = analisistextil[0].encogimientoporcentajeancho;
                _('txtreviradoskewness').value = analisistextil[0].reviradoporcentajeskewness;
                _('txta_carelabel').value = analisistextil[0].carelabel;
                _('txta_comentario_final_criterioaprobacion').value = analisistextil[0].comentario_conclusion_atx_aprobado_rechazado;
                ovariables.codigoabrevfamilia_codigotela = analisistextil[0].codigoabrevfamilia_codigotela;
                ovariables.nombrefamilia = analisistextil[0].nombrefamilia;

                analisistextil[0].enviocorreoconsignacion == "1" ? $('#chk_correo_consignacion').prop('checked', true).iCheck('update') : $('#chk_correo_consignacion').prop('checked', false).iCheck('update'); 
                // DESHABILITAR AREA Y DENSIDAD
                if (analisistextil[0].metodo === '1') {
                    _('txtanalisisarea').disabled = true;
                }
                idmotivosolicitud = _('hf_idmotivosolicitud').value;

                // chk para lavado
                let arrchklavado = Array.from(_('div_grupo_chklavado').getElementsByClassName('_clschk_wash')), lavado = analisistextil[0].lavado;
                arrchklavado.forEach(x => {
                    if (x.value === lavado) {
                        x.checked = true;
                        x.parentNode.classList.add('checked');
                    }
                });

                llenar_tabla_hilado_ini_edit(hilados, hiladocontenido);
                if (conhilado === '0') {
                    generarMatriz_ini_edit();
                    cargar_datos_matriz_ligamentos_ini_edit(tblpasadas, tblimg_ligamentos, tblrepeticiones, tblhiladoporpasada);
                    handlermatrizligamentos_ini_edit();
                    setallinputs_onfocus('_cls_inputs_tbl_hilado');
                } else if (conhilado === '1') {
                    llenar_tbl_sinhilado_ini(titulos_sinhilado, contenido_sinhilado);
                }

                //// SE PONE AQUI ESTAS LINEAS DE CODIGO PARA KENDOEDITOR DESPUES DE LLENAR LA CAJA DE TEXTO Y LUEGO SE CONFIGURA CON EL KENDOEDITOR
                $("#txtanalisiscomentario").kendoEditor({
                    resizable: {
                        content: true,
                    },
                    tools: [
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "justifyLeft",
                        "justifyCenter",
                        "justifyRight",
                        "justifyFull",
                        "insertUnorderedList",
                        "insertOrderedList",
                        "indent",
                        "outdent",
                        "subscript",
                        "superscript",
                        "formatting",
                        "fontName",
                        "fontSize",
                        "foreColor",
                        "backColor",
                        "cleanFormatting"
                    ]
                });

                if (ovariables.estado_actual_solicitud === 'POR') {  // POR OPERAR CON RECHAZO; REENVIAR
                    //// PARA LA GENERACION DE CODIGO DE TELA; SOLO CUANDO SE REENVIA
                    //let idmotivosolicitud = _('hf_idmotivosolicitud').value;
                    if (idmotivosolicitud === '2') {  // CUANDO ES ATX COMPARATIVO
                        crear_objeto_cambiaversion_correlativo_ini(analisistextil, hilados, hiladocontenido, tblpasadas, tblimg_ligamentos, tblrepeticiones, tblhiladoporpasada, atx_acabadofisico, atx_acabadoquimico, 'actual');

                        let analisistextil_s = CSVtoJSON(rpta[0].atx_s), hilados_s = rpta[0].tblhilados_s !== '' ? CSVtoJSON(rpta[0].tblhilados_s) : null,
                        tblpasadas_s = rpta[0].tblpasadas_s !== '' ? CSVtoJSON(rpta[0].tblpasadas_s) : null, tblimg_ligamentos_s = rpta[0].tblimg_ligamentos_s !== '' ? CSVtoJSON(rpta[0].tblimg_ligamentos_s) : null,
                        tblrepeticiones_s = rpta[0].tblrepeticiones_s !== '' ? CSVtoJSON(rpta[0].tblrepeticiones_s) : null, tblhiladoporpasada_s = rpta[0].tblhiladoporpasada_s !== '' ? CSVtoJSON(rpta[0].tblhiladoporpasada_s) : null,
                        hiladocontenido_s = rpta[0].tbl_hilado_contenido_s !== '' ? CSVtoJSON(rpta[0].tbl_hilado_contenido_s) : null, atx_acabadofisico_s = rpta[0].analisistextil_acabadofisico_s !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadofisico_s) : null,
                        atx_acabadoquimico_s = rpta[0].analisistextil_acabadoquimico_s !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadoquimico_s) : null;

                        crear_objeto_cambiaversion_correlativo_ini(analisistextil_s, hilados_s, hiladocontenido_s, tblpasadas_s, tblimg_ligamentos_s, tblrepeticiones_s, tblhiladoporpasada_s, atx_acabadofisico_s, atx_acabadoquimico_s, 'estandar');
                    } else if (idmotivosolicitud === '1') { //// CUANDO ES ESTANDAR SOLO VALIDAR SI EN LA EDICION/REENVIO SE CAMBIO LA FAMILIA
                        ovariables.obj_actual_correlativo.ofamilia = analisistextil[0].idfamilia;
                    }
                }

                if (idmotivosolicitud === '2') {  // CUANDO ES ATX COMPARATIVO
                    //// POR EL MOMENTO NO SE VA A USAR POR ATX SIN SDT
                    ////visualizar_div_criterio_evaluacion();
                    let criterioaprobacion = rpta[0].criterios_comparacion !== '' ? CSVtoJSON(rpta[0].criterios_comparacion) : null,
                        criterioaprobacion_atx = rpta[0].aprobacion_atxcomparativo !== '' ? CSVtoJSON(rpta[0].aprobacion_atxcomparativo) : null;

                    cargar_tabla_criterio_aprobacion_edit(criterioaprobacion, criterioaprobacion_atx);
                    //// SE OCULTA TEMPORALMENTE POR SIN SDT
                    ////set_resumen_estado_aprobado_rechazado(atxestado_aprobado_rechazado);
                }

            }
        }

        function cargar_cbo_acabadofisico_y_quimico_ini_edit(atx_acabadofisico, atx_acabadoquimico) {
            let html = '';

            if (atx_acabadofisico !== null) {
                atx_acabadofisico.forEach(x => {
                    html += `<tr data-par='idacabadofisico:${x.idacabadofisico}'>
                                <td>
                                    <button class='btn btn-xs btn-danger cls_btn_delete_acabadofisico'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td>${x.nombreacabadofisico}</td>
                            </tr>
                        `;
                });

            }
            _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0].innerHTML = html;
            handler_tbl_acabadofisico_ini_edit();

            html = '';

            if (atx_acabadoquimico !== null) {
                atx_acabadoquimico.forEach(x => {
                    html += `<tr data-par='idacabadoquimico:${x.idacabadoquimico}'>
                                    <td>
                                        <button class='btn btn-xs btn-danger cls_btn_delete_acabadoquimico'>
                                            <span class='fa fa-trash-o'></span>
                                        </button>
                                    </td>
                                    <td>${x.nombreacabadoquimico}</td>
                                </tr>
                        `;
                });
            }
            _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0].innerHTML = html;
            handler_tbl_acabadoquimico_ini_edit();
        }



        function get_arr_acabadofisico_y_quimico() {
            let lst_af = [], lst_aq = [], obj_return = {}, tbody_af = _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0],
                arrfilas_af = Array.from(tbody_af.rows), cadena_id_af = '', tbody_aq = _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0],
                arrfilas_aq = Array.from(tbody_aq.rows), cadena_id_aq = '';

            arrfilas_af.forEach(x => {
                let par = x.getAttribute('data-par'), idaf = _par(par, 'idacabadofisico');
                lst_af.push(idaf);
            });
            cadena_id_af = lst_af.join(',');

            arrfilas_aq.forEach(x => {
                let par = x.getAttribute('data-par'), idaf = _par(par, 'idacabadoquimico');
                lst_aq.push(idaf);
            });
            cadena_id_aq = lst_aq.join(',');

            obj_return.arr_acabadofisico = cadena_id_af;
            obj_return.arr_acabadoquimico = cadena_id_aq;
            return obj_return;
        }

        function cargar_datos_matriz_ligamentos_ini_edit(data_tblpasadas, data_tblimg_ligamentos, data_tblrepeticiones, data_tblhiladoporpasada) {
            let tbl_pasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], arrfilas_pasadas = tbl_pasadas !== undefined ? Array.from(tbl_pasadas.rows) : null,
                arr_columnas_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_columntblmatriz')),
                tbl_hiladoporpasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0],
                arrfilas_hiladopasadas = tbl_hiladoporpasada !== undefined ? Array.from(tbl_hiladoporpasada.rows) : null;

            if (data_tblpasadas !== null) {
                arrfilas_pasadas.forEach((x, indice) => {
                    let data_nropasada = x.getAttribute('data-nropasada');
                    let lst = data_tblpasadas.filter(x => x.numeropasada === data_nropasada);
                    x.setAttribute('data-par', 'idanalisistextilpasada:' + lst[0].idanalisistextilpasada);
                });
            }

            if (data_tblimg_ligamentos !== null) {
                //// COLUMNAS
                arr_columnas_ligamentos.forEach((x, indice) => {
                    let nropasada_grid = x.parentNode.getAttribute('data-nropasada'), pista = x.parentNode.getAttribute('data-filadivision'),
                        columna_pista = x.getAttribute('data-numerocolumna');
                    let lst = data_tblimg_ligamentos.filter(d => {
                        return d.numeropasada === nropasada_grid && d.filapasada === pista && d.columnapasada === columna_pista
                    });

                    if (lst.length > 0) {
                        let ruta_img_ligamento = urlBase() + lst[0].rutaimagen + lst[0].imagenwebnombre, idelementoestructura = lst[0].idelementoestructura;
                        let html_img = `
                                <img src="${ruta_img_ligamento}" class="cls_ligamentodraggable" data-idelementoestructura="${idelementoestructura}" draggable="true">
                            `;
                        x.setAttribute('data-par', `idanalisistextilestructuraporpasada:${lst[0].idanalisistextilestructuraporpasada}`)
                        x.innerHTML = html_img;
                    }
                });
            }

            if (data_tblrepeticiones !== null) {
                let tbody_repeticiones = _('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_tbody_matriz3_repeticiones')[0], html_repeticiones = '';
                tbody_repeticiones.innerHTML = '';
                data_tblrepeticiones.forEach(x => {
                    let arr_filascombinadas = x.filas.split(',');

                    let totalcombinaciones = arr_filascombinadas.length, altofila = totalcombinaciones * 80, strhtml_height = `height:${altofila}px`;
                    html_repeticiones += `
                                <tr style="${strhtml_height};" data-par='idanalisistextilestructuranumrepeticiones:${x.idanalisistextilestructuranumrepeticiones}' data-filascombinadas='${x.filas}'>
                                    <td class='cls_td_repeticiones'><input type="text" class="form-control cls_txta_nrorepeticiones" value='${x.numerorepeticiones}' style="width:80px; height:100%;"></td>
                                </tr>
                        `;
                });
                tbody_repeticiones.innerHTML = html_repeticiones;
            }

            if (data_tblhiladoporpasada !== null) {

                arrfilas_hiladopasadas.forEach((x, indice) => {
                    let html_hiladoporpasada = '', nropasada_grid = x.getAttribute('data-nropasada');
                    let lst = data_tblhiladoporpasada.filter(x => x.numeropasada === nropasada_grid), arr_lst_hiladoporpasada = [];

                    if (lst.length > 0) {
                        lst.forEach(item => {
                            //// ARMAR OBJ HILADO POR PASADA
                            let obj_hiladoporpasada = {
                                idanalisistextilhiladoporpasada: item.idanalisistextilhiladoporpasada,
                                idanalisistextilhilado: item.idanalisistextilhilado,
                                largomallacrudo: item.largomallacrudo,
                                largomallaacabado: item.largomallaacabado,
                                idposicion: item.idposicion,
                                guid_hilado: item.guid_hilado,
                                filapasada: item.numeropasada,
                                idhilado: item.idhilado
                            };

                            arr_lst_hiladoporpasada.push(obj_hiladoporpasada);

                            html_hiladoporpasada += `
                                <li class="cls_li_nombrehilado_completo" data-par="guid_hilado:${item.guid_hilado}">
                                    <span class="cls_spn_nombrehilado_li">${item.descripcion_completo_hiladopasada}</span>LM. C=${item.largomallacrudo} LM. A=${item.largomallaacabado} (${item.nombreposicion})
                                </li>
                            `;
                        });
                        if (arr_lst_hiladoporpasada.length > 0) {
                            x.getElementsByClassName('cls_pasada_col1')[0].innerHTML = html_hiladoporpasada;
                            x.setAttribute('data-table', JSON.stringify(arr_lst_hiladoporpasada));
                        }
                    }
                });
            }
        }

        function llenar_tabla_hilado_ini_edit(data, data_hilado_contenido) {
            if (data !== null) {
                let html = '', tblbody = _('tbody_yarndetail');

                data.forEach((x, indice) => {
                    let materiaprima = [], json_materiaprima = '';
                    if (data_hilado_contenido !== null) {
                        materiaprima = data_hilado_contenido.filter(mp => mp.idanalisistextilhilado === x.idanalisistextilhilado);
                    }

                    if (materiaprima.length > 0) {
                        json_materiaprima = JSON.stringify(materiaprima);
                    }
                    //// onkeypress='return DigitimosDecimales(event, this)'
                    // <select class ='cls_title form-control'></select>  // SE REEMPLAZO POR EL DATALIST
                    //// <select class ='cls_shapedyarn form-control'></select>
                    html += `
                        <tr data-par='idanalisistextilhilado:${x.idanalisistextilhilado},guid_hilado:${x.guid_hilado},idsistematitulacion:${x.idsistematitulacion},idtitulohiladotela:${x.idtitulohiladotela},idhilado:${x.idhilado},idformahilado:${x.idformahilado}' data-table='${json_materiaprima}' data-tableini='${json_materiaprima}'>
                            <td class='text-center' style='vertical-align: middle;'>
                                <button class ='btn btn-xs btn-danger cls_btn_delete_hilado'>
                                    <span class='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td class='text-center cls_hilado_nro' style='vertical-align: middle;'>${(indice + 1)}</td>
                            <td class='text-center'>
                                <input type='text' class ='cls_length form-control _cls_inputs_tbl_hilado' value='${x.longitud}' placeholder='0.0' data-type='dec'  />
                            </td>
                            <td class='text-center'>
                                <input type='text' class ='cls_samples form-control _cls_inputs_tbl_hilado' value='${x.muestra}' placeholder='0' onkeypress='return DigitosEnteros(event, this)' data-type='int' />
                            </td>
                            <td class ='text-center cls_lenghttotal'>${x.longitudtotal}</td>
                            <td>
                                <input type='text' class ='cls_weight form-control _cls_inputs_tbl_hilado' value='${x.peso}' placeholder='0.0' data-type='dec' />
                            </td>
                            <td class='text-center'>
                                <select class='cls_system form-control'></select>
                                <span class='spn_error_sistemahilado hide has-error'>Falta seleccionar el sistema</span>
                            </td>
                            <td class ='text-center cls_titleexacto'>${x.tituloexacto}</td>
                            <td class='text-center'>
                                <input type='text' class ='cls_title form-control' list='_dl_titulo_hilado_${(indice + 1)}' value='' />
                                <datalist id='_dl_titulo_hilado_${(indice + 1)}' class ='cls_title'></datalist>
                                <span class='spn_error_titulohilado hide has-error'>Falta seleccionar el título</span>
                            </td>
                            <td class='text-center'>
                                <select class ='cls_yarn form-control'></select>
                                <span class='spn_error_yarnhilado hide has-error'>Falta seleccionar el hilado</span>
                            </td>
                            <td class ='text-center'>
                                <input type='text' class ='cls_shapedyarn form-control' list='_dl_formahilado_${(indice + 1)}' value='' />
                                <datalist class ='cls_shapedyarn' id='_dl_formahilado_${(indice + 1)}'></datalist>
                            </td>
                            <td class ='cls_fiberyarn text-center'>
                                <div class ='input-group'>
                                    <a class ='cls_linkfiberyarn'>${x.contenido}</a>
                                    <span type='button' class ='btn btn-sm bg-info cls_iconofiberyarn input-group-addon'>
                                        <span class ='fa fa-eye'></span>
                                    </span>
                                </div>
                            </td>
                            <td class ='text-center'>
                                <input type='text' class ='cls_porcentaje form-control _cls_inputs_tbl_hilado' value='${x.porcentaje}' placeholder='0.0' data-type='dec' />
                                <span class='spn_error_porcentajehilado hide has-error'>Falta Ingresar el porcentaje</span>
                            </td>
                    </tr>`;
                });
                tblbody.innerHTML = html;
                cargarcombos_tblyarnhilado_ini_edit();
                handler_tbl_yarnhilado_ini_edit();
            }
        }

        function cargarcombos_tblyarnhilado_ini_edit() {
            let arrfilas = Array.from(_('tbody_yarndetail').rows);
            arrfilas.forEach(x => {
                let datapar = x.getAttribute('data-par'), idsistema = _par(datapar, 'idsistematitulacion'), idtitulo = _par(datapar, 'idtitulohiladotela'),
                    idformahilado = _par(datapar, 'idformahilado'), idhilado = _par(datapar, 'idhilado'), cbosystem = x.getElementsByClassName('cls_system')[0],
                    cboformahilado = x.getElementsByClassName('cls_shapedyarn')[0], cbotitulo = x.getElementsByClassName('cls_title')[0], // ARRAY 0 = TEXTO DEL DATALIST
                    dl_titulo = x.getElementsByClassName('cls_title')[1],  // ARRAY 1 = EL DATALIST
                    cbohilado = x.getElementsByClassName('cls_yarn')[0], dl_formahilado = x.getElementsByClassName('cls_shapedyarn')[1];

                cbosystem.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcbosystem, 'idsistematitulacion', 'nombresistema');
                cbosystem.value = idsistema;

                let titulosfiltrados = ovariables.lstcbotitulo.filter(x => x.idsistematitulacion == idsistema),
                    options_titulo = _comboDataListFromJSON(titulosfiltrados, 'idtitulo', 'nombretitulo');

                dl_titulo.insertAdjacentHTML('beforeend', options_titulo);  //innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(titulosfiltrados, 'idtitulo', 'nombretitulo');
                //cbotitulo.value = idtitulo;
                _setValueDataList(idtitulo, dl_titulo, cbotitulo);

                let hiladofiltrado = ovariables.lstcbohilado.filter(x => x.idtitulo === idtitulo && x.idsistematitulacion === idsistema)
                cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(hiladofiltrado, 'idhilado', 'hilado');
                cbohilado.value = idhilado;

                let options_formahilado = _comboDataListFromJSON(ovariables.lstcboformahilado, 'idformahilado', 'nombreformahilado');
                dl_formahilado.innerHTML = options_formahilado; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcboformahilado, 'idformahilado', 'nombreformahilado');
                //cboformahilado.value = idformahilado;
                _setValueDataList(idformahilado, dl_formahilado, cboformahilado);
            });
        }

        function handler_tbl_yarnhilado_ini_edit() {
            let arrfilas = Array.from(_('tbody_yarndetail').rows);
            arrfilas.forEach(x => {
                let cbosystem = x.getElementsByClassName('cls_system')[0], cbotitle = x.getElementsByClassName('cls_title')[0], // ARRAY 0 = EL INPUT DEL DATALIST; SE APLICA EL EVENTO INPUT
                    cbohilado = x.getElementsByClassName('cls_yarn')[0], cboformahilado = x.getElementsByClassName('cls_shapedyarn')[0],
                    btnvermateriaprima = x.getElementsByClassName('cls_iconofiberyarn')[0], btndelete = x.getElementsByClassName('cls_btn_delete_hilado')[0],
                    txtlongitud = x.getElementsByClassName('cls_length')[0], txtnromuestras = x.getElementsByClassName('cls_samples')[0],
                    txtpeso = x.getElementsByClassName('cls_weight')[0], txtporcentaje = x.getElementsByClassName('cls_porcentaje')[0];

                cbosystem.addEventListener('change', function (e) {
                    let o = e.currentTarget;
                    fn_change_system(o);
                }, false);
                cbotitle.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_title(o); }, false);
                cbohilado.addEventListener('change', function (e) {
                    let o = e.currentTarget;
                    fn_change_hilado(o);
                }, false);
                btnvermateriaprima.addEventListener('click', fn_viewmateriaprima_hilado, false);
                cboformahilado.addEventListener('change', function (e) { let o = e.currentTarget; fn_change_formahilado(o); }, false);
                btndelete.addEventListener('click', fn_delete_hilado, false);
                //// PARA QUE LA FILA SELECCIONADA SE PINTE DE UN COLOR DIFERENTE
                x.addEventListener('click', fn_seleccionar_fila_hilado, false);

                //// TEXTOS PARA FORMULAS
                txtlongitud.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(x) }, false);
                txtnromuestras.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(x) }, false);
                txtpeso.addEventListener('keyup', function () { fn_calculo_hilado_longitudtotal_tituloexacto_porfila(x) }, false);
                $(txtlongitud).autoNumeric('init', { mDec: 3 });
                $(txtpeso).autoNumeric('init', { mDec: 4 });
                $(txtporcentaje).autoNumeric('init', { mDec: 2 });

            });
        }

        function fn_seleccionar_fila_hilado(e) {
            let o = e.currentTarget;
            let arrfilas = Array.from(_('tbody_yarndetail').rows);
            arrfilas.forEach(x => {
                x.bgColor = "white";
                x.classList.remove('rowselected');
            });
            o.bgColor = "#ccd1d9";
            o.classList.add('rowselected');
        }

        function fn_calculo_hilado_longitudtotal_tituloexacto_porfila(fila) {
            let txtlongitud = fila.getElementsByClassName('cls_length')[0], txtnromuestras = fila.getElementsByClassName('cls_samples')[0],
                longitud = txtlongitud.value !== '' ? txtlongitud.value.replace(/,/g, '') : 0,
                nromuestras = txtnromuestras.value.trim() !== '' ? txtnromuestras.value : 0,
                txtpeso = fila.getElementsByClassName('cls_weight')[0],
                peso = txtpeso.value !== '' ? txtpeso.value.replace(/,/g, '') : 0,
                cbosistema = fila.getElementsByClassName('cls_system')[0],
                sistema = cbosistema.value, td_longitudtotal = fila.getElementsByClassName('cls_lenghttotal')[0], td_tituloexacto = fila.getElementsByClassName('cls_titleexacto')[0];

            // CALCULO DE LONGITUD TOTAL : FORMULA LONGITUD TOTAL
            let longitudtotal = parseFloat(longitud * nromuestras).toFixed(3), tituloexacto = 0;
            if (longitudtotal > 0 && peso > 0) {
                // CALCULAR TITULO EXACTO: FORMULA TITULO EXACTO
                if (sistema == 1) {  // d - denier 
                    tituloexacto = (peso / longitudtotal) * 9000;
                } else if (sistema == 2) { // n - número ingles
                    tituloexacto = ((0.59 * longitudtotal) / peso);
                } else if (sistema == 3) { // m - número métrico
                    tituloexacto = (longitudtotal / peso);
                }
            } else {
                tituloexacto = 0
            }

            td_longitudtotal.innerText = longitudtotal;
            td_tituloexacto.innerText = parseFloat(tituloexacto).toFixed(1);
        }

        function req_ini() {
            let idsolicitud_cotizacion = _par(_('txtpar_editatx').value, 'idsolicitud_cotizacion') !== '' ? _par(_('txtpar_editatx').value, 'idsolicitud_cotizacion') : '';
            let idatx = _('hf_idatx').value, idservicio = _('hf_idservicio').value,
                parametro = { idsolicitud: ovariables.idsolicitud, idanalisistextilsolicitud: ovariables.idanalisistextilsolicitud, idposicion: 1, idanalisistextil: idatx, idservicio: idservicio, idsolicitud_cotizacion: idsolicitud_cotizacion },
                par = _('txtpar_editatx').value, accion = _par(par, 'accion'), urlaccion = '';

            //let err = (__err) => {
            //    console.log('err', __err);
            //}
            if (accion === 'new') {
                urlaccion = 'DesarrolloTextil/Atx/GetData?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                .then((odata) => {
                    res_ini(odata);
                }, (p) => {
                    err(p);
                });
            } else if (accion === 'edit') {
                urlaccion = 'DesarrolloTextil/Atx/get_atx_foredit_ini?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                    .then((odata) => {
                        res_ini_edit(odata);
                    }, (p) => {
                        err(p);
                    });
            }
        }

        function getlavado_seleccionado() {
            let arr = Array.from(_('div_grupo_chklavado').getElementsByClassName('_clschk_wash')), valorseleccionado = null;
            arr.some(x => {
                if (x.checked) {
                    valorseleccionado = x.value;
                }
            });
            return valorseleccionado;
        }

        function refrescar_combo_af_aq_despues_crear(idcbo, lst, tipo) {  // af = acabado fisico; aq = acabado quimico
            if (tipo === 'af') {
                _(idcbo).innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idacabadofisico', 'nombreacabadofisico');
            } else if (tipo === 'aq') {
                _(idcbo).innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idacabadoquimico', 'nombreacabadoquimico');
            } else if (tipo === 'pr') {
                _(idcbo).innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idpretratamiento', 'nombrepretratamiento');
            } else if (tipo === 'tt') {
                _(idcbo).innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idtipotenido', 'nombretipotenido');
            }
        }

        function get_cadena_hilado_grabar() {
            let conhilado_seleccionado = get_valor_conhilado_seleccionado(), cadena = '', lst = [];
            if (conhilado_seleccionado === '0') {
                let arrfilas = Array.from(_('tbody_yarndetail').rows);
                arrfilas.forEach(x => {
                    let cbo = x.getElementsByClassName('cls_title')[0]; // ARRAY 0 = EL INPUT DEL DATALIST
                    ////lst.push(cbo.options[cbo.selectedIndex].text);
                    lst.push(cbo.value);
                });
            } else if (conhilado_seleccionado === '1') {
                let arrfilas = Array.from(_('tbody_titulo_sinhilado').rows);
                arrfilas.forEach(x => {
                    let cbo = x.getElementsByClassName('_cls_titulo_sinhilado')[0];
                    lst.push(cbo.options[cbo.selectedIndex].text);
                });
            }

            cadena = lst.join('~')

            return cadena;
        }

        function get_descripcion_densidad_grabar() {
            let arrchk = Array.from(_('div_grupo_chklavado').getElementsByClassName('_clschk_wash')), cadena = '',
                valordensidad = _('txtdensidad').value, cadena_valor_densidad = '';

            let arrvalordensidad = valordensidad.length > 0 ? valordensidad.split('.') : [];

            if (arrvalordensidad.length > 0) {
                if (parseInt(arrvalordensidad[1]) > 0) {
                    cadena_valor_densidad = arrvalordensidad[0] + '.' + parseInt(arrvalordensidad[1]);
                } else {
                    cadena_valor_densidad = arrvalordensidad[0];
                }
            }

            arrchk.some(x => {
                if (x.checked) {
                    ////cadena = _('txtdensidad').value + ' ' + x.getAttribute('data-label');
                    cadena = cadena_valor_densidad + ' ' + x.getAttribute('data-label');
                }
            });
            return cadena;
        }

        function calcularanchocuttablewidth(valornumeroagujas, valornumerocolumnas, idunidadmedida) {
            let lst = ovariables.lstunidadmedida.filter(x => x.idunidadmedida === idunidadmedida), valorunidadmedida = 0;

            if (lst.length > 0) {
                valorunidadmedida = lst[0].valorunidadmedida;
            }

            let anchoresultado = 0;
            if (valornumerocolumnas > 0) {
                // FORMULA PARA ANCHO UTIL: ANCHOUTIL = NUMEROAGUJAS * VALOR DE UNIDAD DE MEDIDA(PULGADAS O CENTIMETROS) / NUMERO DE COLUMNAS(WALES PER)
                anchoresultado = (parseInt(valornumeroagujas) * parseFloat(valorunidadmedida)) / parseInt(valornumerocolumnas);
            }

            // MOSTRAR EN METROS
            anchoresultado = parseFloat(anchoresultado) / 100;
            anchoresultado = parseFloat(anchoresultado).toFixed(2);

            return anchoresultado;
        }

        function returnIndex() {
            return_bandeja();
            //let url = 'DesarrolloTextil/Solicitud/Index', par = _('txtpar_editatx').value, estadoactual = _par(par, 'estadoactual'), 
            //    txtpar_solicitudatx_index = _par(par, 'txtpar_solicitudatx_index'), estadoresumen = '', tieneestado_resumen = false;

            //txtpar_solicitudatx_index = txtpar_solicitudatx_index.replace(/~/g, ',').replace(/▼/g, ':');
            //let arrpar = txtpar_solicitudatx_index.split(',');
            //arrpar.some((x,indice) => {
            //    if (x.indexOf('estado_resumen') >= 0){
            //        tieneestado_resumen = true;
            //        return true;
            //    }
            //});

            //arrpar.some((x,indice) => {
            //    if (x.indexOf('idsolicitud') !== -1){
            //        arrpar.splice(indice, 1);
            //        return true;
            //    }
            //});

            //txtpar_solicitudatx_index = arrpar.join(',');

            ////// EL ESTADO NO LO VUELVO A PONER POR QUE EN LA BANDEJA LO SETEO CON LOS FILTROS DE ESTADO; AL IDSOLICITUD SI TENGO QUE QUITARLO Y VOLVERLO A SETEAR
            //if (tieneestado_resumen === false){
            //    txtpar_solicitudatx_index += ',estado_resumen:' + estados_enum_retorno[estadoactual]    
            //}

            //txtpar_solicitudatx_index += ',idsolicitud:' + ovariables.idsolicitud;

            ////ruteo_bandejamodelo_correo(url, ovariables.idsolicitud, 'divcontenedor_breadcrum');
            ////POR = atx_por_operar; EN = atx_en_proceso
            //fn_loadvista_index_bandeja(url, txtpar_solicitudatx_index, 'divcontenedor_breadcrum');
        }

        function return_bandeja(estado_a_retornar) {
            let url = 'DesarrolloTextil/Solicitud/Index', par = _('txtpar_editatx').value, estadoactual = _par(par, 'estadoactual'),
                txtpar_solicitudatx_index = _par(par, 'txtpar_solicitudatx_index'), estadoresumen = '', tieneestado_resumen = false;

            txtpar_solicitudatx_index = txtpar_solicitudatx_index.replace(/~/g, ',').replace(/▼/g, ':');
            let arrpar = txtpar_solicitudatx_index.split(',');
            arrpar.some((x, indice) => {
                if (x.indexOf('estado_resumen') >= 0) {
                    tieneestado_resumen = true;
                    return true;
                }
            });

            arrpar.some((x, indice) => {
                if (x.indexOf('idsolicitud') !== -1) {
                    arrpar.splice(indice, 1);
                    return true;
                }
            });

            txtpar_solicitudatx_index = arrpar.join(',');

            //// EL ESTADO NO LO VUELVO A PONER POR QUE EN LA BANDEJA LO SETEO CON LOS FILTROS DE ESTADO; AL IDSOLICITUD SI TENGO QUE QUITARLO Y VOLVERLO A SETEAR
            if (tieneestado_resumen === false && estado_a_retornar === undefined) {
                //txtpar_solicitudatx_index += ',estado_resumen:' + ovariables.estados_enum_retorno[estadoactual]
                txtpar_solicitudatx_index += ',estado_resumen:init';
            } else if (estado_a_retornar !== undefined && estado_a_retornar !== '') {
                // ACA NO ENTRA
                txtpar_solicitudatx_index += ',estado_resumen:' + ovariables.estados_enum_retorno[estado_a_retornar];
            }

            txtpar_solicitudatx_index += ',idsolicitud:' + ovariables.idsolicitud;

            //ruteo_bandejamodelo_correo(url, ovariables.idsolicitud, 'divcontenedor_breadcrum');
            //POR = atx_por_operar; EN = atx_en_proceso
            fn_loadvista_index_bandeja(url, txtpar_solicitudatx_index, 'divcontenedor_breadcrum');
        }

        function crear_objeto_cambiaversion_correlativo_ini(analisistextil, hilados, hiladocontenido, data_tblpasadas, data_tblimg_ligamentos, data_tblrepeticiones, data_tblhiladoporpasada, data_acabadofisico, data_acabadoquimico, es_estandar_o_es_atxactual) {
            ////  es_estandar_o_es_atxactual = estandar / actual
            let arrhilado_valid_correlativo = [], arrhiladocontenido = [];
            let obj_version = {
                idpretratamiento: analisistextil[0].idpretratamiento === '0' ? "" : analisistextil[0].idpretratamiento,
                idmetodotenido: analisistextil[0].idmetodotenido === '0' ? "" : analisistextil[0].idmetodotenido,
                idtipotenido: analisistextil[0].idtipotenido === '0' ? "" : analisistextil[0].idtipotenido,
                lavado: analisistextil[0].lavado === '0' ? "" : analisistextil[0].lavado,
                metodo: analisistextil[0].metodo === '0' ? "" : analisistextil[0].metodo,
                area: analisistextil[0].area,
                peso: analisistextil[0].peso,
                densidad: analisistextil[0].densidad,
                idtipofontura: analisistextil[0].idtipofontura === '0' ? "" : analisistextil[0].idtipofontura,
                idgalga: analisistextil[0].idgalga === '0' ? "" : analisistextil[0].idgalga,
                idgalgadiametro: analisistextil[0].idgalgadiametro === '0' ? "" : analisistextil[0].idgalgadiametro,
                numeroagujas: _('txtnumeroaguja').value,  //// ACA SE PONE ESTO POR QUE SE VE EL CAMPO EN LA VISTA
                idproveedor: analisistextil[0].idproveedor,
                idcliente: analisistextil[0].idcliente
            }

            let obj_correlativo = {
                idfamilia: analisistextil[0].idfamilia === '0' ? '' : analisistextil[0].idfamilia
            }

            if (es_estandar_o_es_atxactual === 'estandar') {
                ovariables.obj_a_version = obj_version;
            } else if (es_estandar_o_es_atxactual === 'actual') {
                ovariables.obj_actual_version = obj_version;
            }

            if (hilados !== null) {
                hilados.forEach((x, indice) => {
                    let obj = {
                        //idanalisistextilhilado: x.idanalisistextilhilado,
                        idtitulohiladotela: x.idtitulohiladotela,
                        idhilado: x.idhilado,
                        idformahilado: x.idformahilado === '0' ? '' : x.idformahilado,
                        porcentaje: x.porcentaje
                    };
                    arrhilado_valid_correlativo.push(obj);

                    //let obj = { hilado: x.concathilado }
                    //arrhilado_valid_correlativo.push(obj);
                });
            }

            if (es_estandar_o_es_atxactual === 'estandar') {
                ovariables.obj_a_correlativo.hilado = arrhilado_valid_correlativo;
            } else if (es_estandar_o_es_atxactual === 'actual') {
                ovariables.obj_actual_correlativo.hilado = arrhilado_valid_correlativo;
            }

            if (hiladocontenido !== null) {
                hiladocontenido.forEach(x => {
                    let obj = {
                        //idanalisistextilhiladocontenido: x.idanalisistextilhiladocontenido,
                        //idanalisistextilhilado: x.idanalisistextilhilado,
                        idhilado: x.idhilado,
                        idcolortextilhilado: x.idcolortextilhilado === '0' ? '' : x.idcolortextilhilado
                    }
                    arrhiladocontenido.push(obj);
                });
            }

            if (es_estandar_o_es_atxactual === 'estandar') {
                ovariables.obj_a_correlativo.hiladocontenido = arrhiladocontenido; //// OJO: EN LA FUNCION DE VALIDACION SI LO VALIDO POR VERSION    
            } else if (es_estandar_o_es_atxactual === 'actual') {
                ovariables.obj_actual_correlativo.hiladocontenido = arrhiladocontenido; //// OJO: EN LA FUNCION DE VALIDACION SI LO VALIDO POR VERSION
            }

            // PARA LOS LIGAMENTOS
            let tbl_pasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], arrfilas_pasadas = tbl_pasadas !== undefined ? Array.from(tbl_pasadas.rows) : null,
                arr_columnas_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_columntblmatriz')),
                tbl_hiladoporpasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0],
                arrfilas_hiladopasadas = tbl_hiladoporpasada !== undefined ? Array.from(tbl_hiladoporpasada.rows) : null;

            let arrpasadas = [], arrligamentos = [], arrepeticiones = [], arrhiladoporpasada = [], arrhiladoporpasada_solo_largomalla = [];
            //// NRO PASADAS
            if (data_tblpasadas !== null) {
                data_tblpasadas.forEach(x => {
                    let obj = { numeropasada: x.numeropasada };
                    arrpasadas.push(obj);
                });
            }
            //// IMG - LIGAMENTOS
            if (data_tblimg_ligamentos !== null) {
                //// COLUMNAS
                data_tblimg_ligamentos.forEach(x => {
                    let obj = {};
                    obj = { numeropasada: x.numeropasada, pista: x.filapasada, columnapasada: x.columnapasada, idelementoestructura: x.idelementoestructura };
                    arrligamentos.push(obj);
                });
                //arr_columnas_ligamentos.forEach((x, indice) => {
                //    let nropasada_grid = x.parentNode.getAttribute('data-nropasada'), pista = x.parentNode.getAttribute('data-filadivision'),
                //        columna_pista = x.getAttribute('data-numerocolumna');
                //    let lst = data_tblimg_ligamentos.filter(d => {
                //        return d.numeropasada === nropasada_grid && d.filapasada === pista && d.columnapasada === columna_pista
                //    });
                //    let obj = {};
                //    if (lst.length > 0) {
                //        obj = { numeropasada: nropasada_grid, idelementoestructura: lst[0].idelementoestructura };
                //    } else {
                //        obj = { numeropasada: nropasada_grid, idelementoestructura: '' }
                //    }
                //    arrligamentos.push(obj);
                //});
            }
            //// REPETICIONES
            if (data_tblrepeticiones !== null) {
                data_tblrepeticiones.forEach(x => {
                    let obj = {
                        //idanalisistextilestructuranumrepeticiones: x.idanalisistextilestructuranumrepeticiones,
                        orden: x.orden,
                        numerorepeticiones: x.numerorepeticiones,
                        filas: x.filas
                    };
                    arrepeticiones.push(obj);
                });
            }
            //// HILADO POR PASADA
            if (data_tblhiladoporpasada !== null) {
                arrpasadas.forEach((x, indice) => {
                    let numeropasada = x.numeropasada; //x.getAttribute('data-nropasada');
                    let lst = data_tblhiladoporpasada.filter(x => x.numeropasada === numeropasada);

                    if (lst.length > 0) {
                        lst.forEach(item => {
                            //// ARMAR OBJ HILADO POR PASADA
                            let obj_hiladoporpasada = {
                                idposicion: item.idposicion,
                                //guid_hilado: item.guid_hilado,
                                idhilado: item.idhilado,
                                filapasada: item.numeropasada
                            };

                            arrhiladoporpasada.push(obj_hiladoporpasada);

                            //let objlargomallas = { lmc: item.largomallacrudo, lma: item.largomallaacabado, guid_hilado: item.guid_hilado, filapasada: item.numeropasada, idanalisistextilhiladoporpasada: item.idanalisistextilhiladoporpasada };
                            let objlargomallas = { lmc: item.largomallacrudo, lma: item.largomallaacabado, idhilado: item.idhilado, filapasada: item.numeropasada, idposicion: item.idposicion };
                            arrhiladoporpasada_solo_largomalla.push(objlargomallas);
                        });
                    }
                });
            }

            //// ACABADO FISICO // NOTA - LOS ACABADOS FISICOS; SI CAMBIA CUALQUIERA DE ESTOS SE CAMBIA EL CORRELATIVO: Esmerilado, Perchado y Tundido
            let arr_idaf = [], arr_idaq = [];
            if (data_acabadofisico !== null) {
                data_acabadofisico.forEach(x => {
                    let obj = { id: x.idacabadofisico };
                    arr_idaf.push(obj);
                });
            }
            if (data_acabadoquimico !== null) {
                data_acabadoquimico.forEach(x => {
                    let obj = { id: x.idacabadoquimico };
                    arr_idaq.push(obj);
                });
            }

            if (es_estandar_o_es_atxactual === 'estandar') {
                ovariables.obj_a_correlativo.pasadas = arrpasadas;
                ovariables.obj_a_correlativo.ligamentos = arrligamentos;
                ovariables.obj_a_correlativo.repeticiones = arrepeticiones;
                ovariables.obj_a_correlativo.hiladoporpasada = arrhiladoporpasada;
                ovariables.obj_a_correlativo.hiladoporpasada_solo_largomalla = arrhiladoporpasada_solo_largomalla;
                ovariables.obj_a_correlativo.acabadofisico = arr_idaf;
                ovariables.obj_a_correlativo.acabadoquimico = arr_idaq;
                ovariables.obj_a_correlativo.ofamilia = obj_correlativo;
            } else if (es_estandar_o_es_atxactual === 'actual') {
                ovariables.obj_actual_correlativo.pasadas = arrpasadas;
                ovariables.obj_actual_correlativo.ligamentos = arrligamentos;
                ovariables.obj_actual_correlativo.repeticiones = arrepeticiones;
                ovariables.obj_actual_correlativo.hiladoporpasada = arrhiladoporpasada;
                ovariables.obj_actual_correlativo.hiladoporpasada_solo_largomalla = arrhiladoporpasada_solo_largomalla;
                ovariables.obj_actual_correlativo.acabadofisico = arr_idaf;
                ovariables.obj_actual_correlativo.acabadoquimico = arr_idaq;
                ovariables.obj_actual_correlativo.ofamilia = obj_correlativo;
            }
        }

        function crear_objeto_cambiarversion_correlativo_save() {
            let arrhilado = [], arrhiladocontenido = [];
            let obj_version = _getParameter({ clase: 'cls_version', id: 'panelEncabezado_atx' }),
                valor_selec_lavado = getlavado_seleccionado();
            obj_version["lavado"] = valor_selec_lavado === null ? "" : valor_selec_lavado;
            ovariables.obj_b_version = obj_version;

            let obj_correlativo = _getParameter({ clase: 'cls_correlativo', id: 'panelEncabezado_atx' });

            // PARA EL HILADO
            let tbody_hilado = _('tbody_yarndetail'), arrfilas_hilado = Array.from(tbody_hilado.rows);
            arrfilas_hilado.forEach((x, indice) => {
                let datapar = x.getAttribute('data-par'), idanalisistextilhilado = _par(datapar, 'idanalisistextilhilado'),
                    txtinput_dltitulo = x.getElementsByClassName('cls_title')[0], dl_titulo = x.getElementsByClassName('cls_title')[1],
                    idtitulohiladotela = _getValueDataList(txtinput_dltitulo.value, dl_titulo), 
                    txtinput_formahilado = x.getElementsByClassName('cls_shapedyarn')[0],  // ARRAY 0 = EL INPUT TEXT DEL DATALIST
                    dl_formahilado = x.getElementsByClassName('cls_shapedyarn')[1], // ARRAY 1 = EL DATALIST 
                    idformahilado = _getValueDataList(txtinput_formahilado.value, dl_formahilado);
                let obj = {
                    ////idanalisistextilhilado: idanalisistextilhilado,
                    idtitulohiladotela: idtitulohiladotela, //x.getElementsByClassName('cls_title')[0].value,
                    idhilado: x.getElementsByClassName('cls_yarn')[0].value,
                    idformahilado: idformahilado, //x.getElementsByClassName('cls_shapedyarn')[0].value,
                    porcentaje: x.getElementsByClassName('cls_porcentaje')[0].value
                };
                arrhilado.push(obj);

                // PARA EL CONTENIDO
                let datatable = x.getAttribute('data-table'), objcontenido = datatable !== '' ? JSON.parse(datatable) : null;
                if (objcontenido !== null) {
                    objcontenido.forEach(x => {
                        let objc = {
                            //idanalisistextilhiladocontenido: x.idanalisistextilhiladocontenido,
                            //idanalisistextilhilado: x.idanalisistextilhilado,
                            idhilado: x.idhilado,
                            idcolortextilhilado: x.idcolortextilhilado === '0' ? '' : x.idcolortextilhilado
                        }
                        arrhiladocontenido.push(objc);
                    });
                }
            });
            ovariables.obj_b_correlativo.hilado = arrhilado;
            ovariables.obj_b_correlativo.hiladocontenido = arrhiladocontenido;

            //// IMG - LIGAMENTOS
            let arrpasadas = [], arrligamentos = [], arrepeticiones = [], arrhiladoporpasada = [], arrhiladoporpasada_solo_largomalla = [];
            let tbl_pasadas = _('div_tblmatriz1_pasadas').getElementsByClassName('cls_tbl_pasadas')[0], arrfilas_pasadas = tbl_pasadas !== undefined ? Array.from(tbl_pasadas.rows) : null,
                arr_columnas_ligamentos = Array.from(_('div_tblmatriz2_imagenesligamentos').getElementsByClassName('cls_columntblmatriz')),
                arr_txta_repeticiones = Array.from(_('div_tblmatriz3_nrorepeticiones').getElementsByClassName('cls_txta_nrorepeticiones'));
            arrfilas_pasadas.forEach((x, indice) => {
                let obj = { numeropasada: (indice + 1).toString() };
                arrpasadas.push(obj);
            });

            arr_columnas_ligamentos.forEach((x, indice) => {
                let nropasada_grid = x.parentNode.getAttribute('data-nropasada'), pista = x.parentNode.getAttribute('data-filadivision'),
                    columna_pista = x.getAttribute('data-numerocolumna');

                let obj = {};
                if (x.getElementsByClassName('cls_ligamentodraggable')[0]) {
                    obj = {
                        numeropasada: nropasada_grid, pista: pista, columnapasada: columna_pista, idelementoestructura: x.getElementsByClassName('cls_ligamentodraggable')[0].getAttribute('data-idelementoestructura')
                    };
                    arrligamentos.push(obj);
                }
                //else {
                //    obj = {
                //        numeropasada: nropasada_grid, idelementoestructura: ''
                //    }
                //}
            });

            //// REPETICIONES
            arr_txta_repeticiones.forEach((x, indice) => {
                let nrorepeticiones = x.value === '' ? 1 : x.value, fila = x.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                    idanalisistextilestructuranumrepeticiones = _par(datapar, 'idanalisistextilestructuranumrepeticiones'), filascombinadas = fila.getAttribute('data-filascombinadas');

                let obj = {
                    //idanalisistextilestructuranumrepeticiones: idanalisistextilestructuranumrepeticiones,
                    orden: (indice + 1).toString(),
                    numerorepeticiones: nrorepeticiones,
                    filas: filascombinadas
                };
                arrepeticiones.push(obj);
            });

            //// HILADO POR PASADA
            let tbl_matriz4_hiladoporpasada = _('div_tblmatriz4_hiladoporpasada').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0]
            let arrfilas_hiladoporpasada = tbl_matriz4_hiladoporpasada !== undefined ? Array.from(tbl_matriz4_hiladoporpasada.rows) : null;

            if (arrfilas_hiladoporpasada !== null) {
                arrfilas_hiladoporpasada.forEach((f, indice) => {
                    let lst = f.getAttribute('data-table') !== '' ? JSON.parse(f.getAttribute('data-table')) : {};
                    if (lst.length > 0) {
                        lst.forEach(obj => {
                            //obj.filapasada = (indice + 1)  // ESTE DATO ES PARA CUANDO SE GRABA PASADA HILADO VACIO VA A SERVIR A QUE FILA PASADA PERTENECE
                            //lsthiladoporpasada.push(obj);

                            let obj_hiladoporpasada = {
                                idposicion: obj.idposicion,
                                //guid_hilado: obj.guid_hilado,
                                idhilado: obj.idhilado,
                                filapasada: (indice + 1).toString()
                            };
                            arrhiladoporpasada.push(obj_hiladoporpasada);

                            let objlargomallas = { lmc: obj.largomallacrudo, lma: obj.largomallaacabado, idhilado: obj.idhilado, filapasada: obj.filapasada, idposicion: obj.idposicion }
                            arrhiladoporpasada_solo_largomalla.push(objlargomallas);
                        });
                    }
                });
            }

            //// ACABADO FISICO Y QUIMICO
            let tbody_af = _('div_cbo_acabadofisico').getElementsByClassName('tbody_acabadofisico')[0], arr_filas_af = Array.from(tbody_af.rows), arr_idaf = [], arr_idaq = [];
            arr_filas_af.forEach(x => {
                let datapar = x.getAttribute('data-par'), idaf = _par(datapar, 'idacabadofisico');
                let obj = { id: idaf }
                arr_idaf.push(obj);
            });

            let tbody_aq = _('div_cbo_acabado_quimico').getElementsByClassName('tbody_acabadoquimico')[0], arr_filas_aq = Array.from(tbody_aq.rows);
            arr_filas_aq.forEach(x => {
                let datapar = x.getAttribute('data-par'), idaq = _par(datapar, 'idacabadoquimico');
                let obj = { id: idaq }
                arr_idaq.push(obj);
            });

            ovariables.obj_b_correlativo.pasadas = arrpasadas;
            ovariables.obj_b_correlativo.ligamentos = arrligamentos;
            ovariables.obj_b_correlativo.repeticiones = arrepeticiones;
            ovariables.obj_b_correlativo.hiladoporpasada = arrhiladoporpasada;
            ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla = arrhiladoporpasada_solo_largomalla;
            ovariables.obj_b_correlativo.acabadofisico = arr_idaf;
            ovariables.obj_b_correlativo.acabadoquimico = arr_idaq;
            ovariables.obj_b_correlativo.ofamilia = obj_correlativo;
        }

        function validar_siescambio_version_correlativo() {
            let obj = { cambia_version: 0, cambia_correlativo: 0 };

            crear_objeto_cambiarversion_correlativo_save();

            for (let x in ovariables.obj_a_version) {
                if (ovariables.obj_a_version[x] !== ovariables.obj_b_version[x]) {
                    obj.cambia_version = 1;
                    break;
                }
            }

            let hilado_ini = JSON.stringify(ovariables.obj_a_correlativo.hilado),
                hilado_vista = JSON.stringify(ovariables.obj_b_correlativo.hilado);

            if (hilado_ini !== hilado_vista) {
                obj.cambia_correlativo = 1;
            } else {
                // VALIDAR SI CAMBIA VERSION POR EL COLOR DEL HILO
                let hiladocontenido_ini = JSON.stringify(ovariables.obj_a_correlativo.hiladocontenido),
                    hiladocontenido_save = JSON.stringify(ovariables.obj_b_correlativo.hiladocontenido);

                if (hiladocontenido_ini !== hiladocontenido_save) {
                    obj.cambia_version = 1;
                }
            }

            let resultado_largomalla_cambiacorrelativo = false, resultado_largomalla_cambiaversion = false;
            ovariables.obj_a_correlativo.hiladoporpasada_solo_largomalla.forEach(x => {
                //let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.idanalisistextilhiladoporpasada === x.idanalisistextilhiladoporpasada);
                let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.filapasada === x.filapasada && y.idhilado === x.idhilado && y.idposicion === x.idposicion);
                if (filter.length > 0) {
                    filter.forEach(z => {
                        let diferencia_lmc = (z.lmc - x.lmc), diferencia_lma = (z.lma - x.lma);
                        diferencia_lmc = diferencia_lmc < 0 ? (diferencia_lmc * -1) : diferencia_lmc;
                        diferencia_lma = diferencia_lma < 0 ? (diferencia_lma * -1) : diferencia_lma
                        if (diferencia_lmc > 0 || diferencia_lma > 0) {
                            if (diferencia_lmc > 0.10 || diferencia_lma > 0.10) {
                                obj.cambia_correlativo = 1;
                                resultado_largomalla_cambiacorrelativo = true;
                            } else {
                                obj.cambia_version = 1;
                                resultado_largomalla_cambiaversion = true;
                            }
                        }
                    });
                }
            });

            if (resultado_largomalla_cambiacorrelativo === false) {
                //// si no paso el limite de 0.10mm en largo malla entonces validar por los demas campos del ligamento
                //// json
                let cadena_ligamentos_completo_ini = JSON.stringify(ovariables.obj_a_correlativo.pasadas) + JSON.stringify(ovariables.obj_a_correlativo.ligamentos) + JSON.stringify(ovariables.obj_a_correlativo.repeticiones) + JSON.stringify(ovariables.obj_a_correlativo.hiladoporpasada),
                    cadena_ligamentos_completo_save = JSON.stringify(ovariables.obj_b_correlativo.pasadas) + JSON.stringify(ovariables.obj_b_correlativo.ligamentos) + JSON.stringify(ovariables.obj_b_correlativo.repeticiones) + JSON.stringify(ovariables.obj_b_correlativo.hiladoporpasada);

                if (cadena_ligamentos_completo_ini !== cadena_ligamentos_completo_save) {
                    obj.cambia_correlativo = 1;
                }
            }

            //// VALIDAR SI EXISTE EN EL ACABADO FISICO LAS SIGUIENTES VARIABLES PARA VER SI SE MODIFICA CORRELATIVO O NO
            let existe_ini_af_enumaf = false, existe_save_af_enumaf = false;
            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_a_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_ini_af_enumaf = true;
                    break;
                }
            }

            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_b_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_save_af_enumaf = true;
                    break;
                }
            }

            if (existe_ini_af_enumaf || existe_save_af_enumaf) {
                let cadena_af = ovariables.obj_a_correlativo.acabadofisico.map(x => x.id).join(','), cadena_aq = ovariables.obj_b_correlativo.acabadofisico.map(x => x.id).join(',');
                if (cadena_af !== cadena_aq) {
                    obj.cambia_correlativo = 1;
                }
            }

            let cadena_aq_ini = ovariables.obj_a_correlativo.acabadoquimico.map(x => x.id).join(','), cadena_aq_save = ovariables.obj_b_correlativo.acabadoquimico.map(x => x.id).join(',');
            if (cadena_aq_ini !== cadena_aq_save) {
                obj.cambia_version = 1;
            }

            let cadena_ofamilia_correlativo_ini = JSON.stringify(ovariables.obj_a_correlativo.ofamilia),
                cadena_ofamilia_correlativo_save = JSON.stringify(ovariables.obj_b_correlativo.ofamilia);

            if (cadena_ofamilia_correlativo_ini !== cadena_ofamilia_correlativo_save) {
                obj.cambia_correlativo = 1;
            }

            return obj;
        }

        function validar_si_hay_cambios_pa_validar_correlativo_o_version() {
            let obj = { cambia_version: 0, cambia_correlativo: 0 };

            crear_objeto_cambiarversion_correlativo_save();

            for (let x in ovariables.obj_actual_version) {
                if (ovariables.obj_actual_version[x] !== ovariables.obj_b_version[x]) {
                    obj.cambia_version = 1;
                    break;
                }
            }

            let hilado_ini = JSON.stringify(ovariables.obj_actual_correlativo.hilado),
                hilado_vista = JSON.stringify(ovariables.obj_b_correlativo.hilado);

            if (hilado_ini !== hilado_vista) {
                obj.cambia_correlativo = 1;
            } else {
                // VALIDAR SI CAMBIA VERSION POR EL COLOR DEL HILO
                let hiladocontenido_ini = JSON.stringify(ovariables.obj_actual_correlativo.hiladocontenido),
                    hiladocontenido_save = JSON.stringify(ovariables.obj_b_correlativo.hiladocontenido);

                if (hiladocontenido_ini !== hiladocontenido_save) {
                    obj.cambia_version = 1;
                }
            }

            let resultado_largomalla_cambiacorrelativo = false, resultado_largomalla_cambiaversion = false;
            ovariables.obj_actual_correlativo.hiladoporpasada_solo_largomalla.forEach(x => {
                //let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.idanalisistextilhiladoporpasada === x.idanalisistextilhiladoporpasada);
                let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.filapasada === x.filapasada && y.idhilado === x.idhilado && y.idposicion === x.idposicion);
                if (filter.length > 0) {
                    filter.forEach(z => {
                        let diferencia_lmc = (z.lmc - x.lmc), diferencia_lma = (z.lma - x.lma);
                        diferencia_lmc = diferencia_lmc < 0 ? (diferencia_lmc * -1) : diferencia_lmc;
                        diferencia_lma = diferencia_lma < 0 ? (diferencia_lma * -1) : diferencia_lma
                        if (diferencia_lmc > 0 || diferencia_lma > 0) {
                            if (diferencia_lmc > 0.10 || diferencia_lma > 0.10) {
                                obj.cambia_correlativo = 1;
                                resultado_largomalla_cambiacorrelativo = true;
                            } else {
                                obj.cambia_version = 1;
                                resultado_largomalla_cambiaversion = true;
                            }
                        }
                    });
                }
            });

            if (resultado_largomalla_cambiacorrelativo === false) {
                //// si no paso el limite de 0.10mm en largo malla entonces validar por los demas campos del ligamento
                //// json
                let cadena_ligamentos_completo_ini = JSON.stringify(ovariables.obj_actual_correlativo.pasadas) + JSON.stringify(ovariables.obj_actual_correlativo.ligamentos) + JSON.stringify(ovariables.obj_actual_correlativo.repeticiones) + JSON.stringify(ovariables.obj_actual_correlativo.hiladoporpasada),
                    cadena_ligamentos_completo_save = JSON.stringify(ovariables.obj_b_correlativo.pasadas) + JSON.stringify(ovariables.obj_b_correlativo.ligamentos) + JSON.stringify(ovariables.obj_b_correlativo.repeticiones) + JSON.stringify(ovariables.obj_b_correlativo.hiladoporpasada);

                if (cadena_ligamentos_completo_ini !== cadena_ligamentos_completo_save) {
                    obj.cambia_correlativo = 1;
                }
            }

            //// VALIDAR SI EXISTE EN EL ACABADO FISICO LAS SIGUIENTES VARIABLES PARA VER SI SE MODIFICA CORRELATIVO O NO
            let existe_ini_af_enumaf = false, existe_save_af_enumaf = false;
            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_actual_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_ini_af_enumaf = true;
                    break;
                }
            }

            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_b_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_save_af_enumaf = true;
                    break;
                }
            }

            if (existe_ini_af_enumaf || existe_save_af_enumaf) {
                let cadena_af = ovariables.obj_actual_correlativo.acabadofisico.map(x => x.id).join(','), cadena_aq = ovariables.obj_b_correlativo.acabadofisico.map(x => x.id).join(',');
                if (cadena_af !== cadena_aq) {
                    obj.cambia_correlativo = 1;
                }
            }

            let cadena_aq_ini = ovariables.obj_actual_correlativo.acabadoquimico.map(x => x.id).join(','), cadena_aq_save = ovariables.obj_b_correlativo.acabadoquimico.map(x => x.id).join(',');
            if (cadena_aq_ini !== cadena_aq_save) {
                obj.cambia_version = 1;
            }

            let cadena_ofamilia_correlativo_ini = JSON.stringify(ovariables.obj_actual_correlativo.ofamilia),
                cadena_ofamilia_correlativo_save = JSON.stringify(ovariables.obj_b_correlativo.ofamilia);

            if (cadena_ofamilia_correlativo_ini !== cadena_ofamilia_correlativo_save) {
                obj.cambia_correlativo = 1;
            }

            return obj;
        }

        function print_atx(idsolicitud, idatx) {
            //idsolicitud = ovariables.idsolicitud, idatx = _('hf_idatx').value,
            let parametro = `idsolicitud:${idsolicitud},idatx:${idatx}`,
                url = urlBase() + 'DesarrolloTextil/Atx/AnalisisTextilImprimir?par=' + parametro;
            window.open(url);
        }

        function fn_add_titulo_sinhilado() {
            let tbody = _('tbody_titulo_sinhilado'), html = '';
            html = `
                    <tr data-par='idanalisistextiltitulosinhilado:0'>
                        <td class='text-center'>
                            <button type='button' class ='btn btn-xs btn-danger _cls_btn_delete_sinhilado'>
                                <span class='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>
                            <select class ='_cls_systema_sinhilado form-control'></select>
                            <span class='spn_error_sistema hide has-error'>Falta Seleccionar el sistema</span>
                        </td>
                        <td>
                            <select class ='_cls_titulo_sinhilado form-control'></select>
                            <span class ='spn_error_titulo hide has-error'>Falta Seleccionar el título</span>
                        </td>
                    </tr>
                `;

            tbody.insertAdjacentHTML('beforeend', html);
            let indicefila = parseInt(tbody.rows.length) - 1
            llenarcombo_add_tbl_titulo_sinhilado(indicefila);
            handler_add_tbl_titulo_sinhilado(indicefila);
        }

        function llenarcombo_add_tbl_titulo_sinhilado(indicefila) {
            let tbody = _('tbody_titulo_sinhilado'), fila = tbody.rows[indicefila],
                cbosistema = fila.getElementsByClassName('_cls_systema_sinhilado')[0];
            cbosistema.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcbosystem, 'idsistematitulacion', 'nombresistema');
        }

        function handler_add_tbl_titulo_sinhilado(indicefila) {
            let tbody = _('tbody_titulo_sinhilado'), fila = tbody.rows[indicefila], cbosistema = fila.getElementsByClassName('_cls_systema_sinhilado')[0];
                btndel = fila.getElementsByClassName('_cls_btn_delete_sinhilado')[0];
            cbosistema.addEventListener('change', fn_change_cbosistema_sinhilado, false);
            btndel.addEventListener('click', e => { fn_delete_sinhilado_ini_general(e); }, false);
        }

        function fn_delete_sinhilado_general(idtbody_tbl, indexfila) {
            let tbody = _(idtbody_tbl), fila = tbody.rows[indexfila];
            fila.parentNode.removeChild(fila);
        }

        function fn_change_cbosistema_sinhilado(e) {
            let o = e.currentTarget, idsistema = o.value, list = ovariables.lstcbotitulo.filter(x => x.idsistematitulacion === idsistema),
                fila = o.parentNode.parentNode, cbotitulo = fila.getElementsByClassName('_cls_titulo_sinhilado')[0];
            cbotitulo.innerHTML = '';
            cbotitulo.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(list, 'idtitulo', 'nombretitulo');
        }

        function fn_add_contenido_sinhilado() {
            let tbody = _('tbody_contenido_sinhilado'), html = '';
            html = `
                    <tr data-par='idanalisistextilcontenidosinhilado:0'>
                        <td class='text-center'>
                            <button type='button' class ='btn btn-xs btn-danger _cls_btn_delete_sinhilado'>
                                <span class='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>
                            <select class ='_cls_materiaprima_sinhilado form-control'></select>
                            <span class ='spn_error_materiaprima hide has-error'>Falta Seleccionar la materia prima</span>
                        </td>
                        <td>
                            <input type='text' class ='_cls_txt_porcentaje form-control' maxlength = '6' value='' />
                            <span class ='spn_error_porcentaje hide has-error'>Falta ingresar el porcentaje</span>
                        </td>
                    </tr>
                `;

            tbody.insertAdjacentHTML('beforeend', html);
            let indicefila = parseInt(tbody.rows.length) - 1
            llenarcombo_add_tbl_contenido_sinhilado(indicefila);
            handler_add_tbl_contenido_sinhilado(indicefila);
        }

        function llenarcombo_add_tbl_contenido_sinhilado(indicefila) {
            let tbody = _('tbody_contenido_sinhilado'), fila = tbody.rows[indicefila],
                cbomateriaprima = fila.getElementsByClassName('_cls_materiaprima_sinhilado')[0];
            cbomateriaprima.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstmateriaprima, 'idmateriaprima', 'nombremateriaprima');
        }

        function handler_add_tbl_contenido_sinhilado(indicefila) {
            let tbody = _('tbody_contenido_sinhilado'), fila = tbody.rows[indicefila], txtporcentaje = fila.getElementsByClassName('_cls_txt_porcentaje')[0];
                btndel = fila.getElementsByClassName('_cls_btn_delete_sinhilado')[0];
            $(txtporcentaje).autoNumeric('init', { mDec: 2 });

            btndel.addEventListener('click', e => { fn_delete_sinhilado_ini_general(e); }, false);
        }

        function seleccionar_radio_conhilado(valor) {
            let div_grupo = _('div_grupo_conhilado'), arr = Array.from(div_grupo.getElementsByClassName('_clschk_conhilado'));
            arr.some(x => {
                let datavalor = x.getAttribute('data-valorconhilado');
                x.parentNode.classList.remove('checked');
                x.parentNode.parentNode.classList.remove('checked');
                if (parseInt(datavalor) === parseInt(valor)) {
                    x.checked = true;
                    x.parentNode.classList.add('checked');
                    return true;
                }
            });
        }

        function get_valor_conhilado_seleccionado() {
            let div_grupo = _('div_grupo_conhilado'), arr = Array.from(div_grupo.getElementsByClassName('_clschk_conhilado')), val_chk = 0;
            arr.some(x => {
                let seleccionado = x.checked;
                if (seleccionado) {
                    val_chk = x.getAttribute('data-valorconhilado');
                    return true;
                }
            });
            return val_chk
        }

        function get_titulos_sinhilado() {
            let tbody_titulos = _('tbody_titulo_sinhilado'), arr_rows = Array.from(tbody_titulos.rows), lst_titulo = [], obj_return = {},
                tbody_contenido = _('tbody_contenido_sinhilado'), arr_rows_contenido = Array.from(tbody_contenido.rows), lst_contenido = [];
            arr_rows.forEach(x => {
                let par = x.getAttribute('data-par'), idanalisistextiltitulosinhilado = _par(par, 'idanalisistextiltitulosinhilado');
                let obj = {
                    idanalisistextiltitulosinhilado: idanalisistextiltitulosinhilado,
                    idsistematitulacion: x.getElementsByClassName('_cls_systema_sinhilado')[0].value,
                    idtitulohiladotela: x.getElementsByClassName('_cls_titulo_sinhilado')[0].value
                }

                lst_titulo.push(obj);
            });

            arr_rows_contenido.forEach(x => {
                let par = x.getAttribute('data-par'), idanalisistextilcontenidosinhilado = _par(par, 'idanalisistextilcontenidosinhilado');
                let obj = {
                    idanalisistextilcontenidosinhilado: idanalisistextilcontenidosinhilado,
                    idmateriaprima: x.getElementsByClassName('_cls_materiaprima_sinhilado')[0].value,
                    porcentaje: x.getElementsByClassName('_cls_txt_porcentaje')[0].value
                };

                lst_contenido.push(obj);
            });

            obj_return.titulos_sinhilado = lst_titulo;
            obj_return.contenido_sinhilado = lst_contenido;

            return obj_return;
        }

        function llenar_tbl_sinhilado_ini(titulos_sinhilado, contenido_sinhilado) {
            let html = '', tbody_titulo = _('tbody_titulo_sinhilado'), tbody_contenido = _('tbody_contenido_sinhilado');
            if (titulos_sinhilado !== null) {
                titulos_sinhilado.forEach(x => {
                    html += `
                            <tr data-par='idanalisistextiltitulosinhilado:${x.idanalisistextiltitulosinhilado},idsistematitulacion:${x.idsistematitulacion},idtitulohiladotela:${x.idtitulohiladotela}'>
                                <td class='text-center'>
                                    <button type='button' class ='btn btn-xs btn-danger _cls_btn_delete_sinhilado'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td>
                                    <select class ='_cls_systema_sinhilado form-control'></select>
                                    <span class ='spn_error_sistema hide has-error'>Falta Seleccionar el sistema</span>
                                </td>
                                <td>
                                    <select class ='_cls_titulo_sinhilado form-control'></select>
                                    <span class ='spn_error_titulo hide has-error'>Falta Seleccionar el título</span>
                                </td>
                            </tr>
                        `;
                });
                tbody_titulo.innerHTML = html;
                llenar_combos_tbl_titulos_sinhilado_ini();
            }

            html = '';
            if (contenido_sinhilado !== null) {
                contenido_sinhilado.forEach(x => {
                    html += `
                        <tr data-par='idanalisistextilcontenidosinhilado:${x.idanalisistextilcontenidosinhilado},idmateriaprima:${x.idmateriaprima},porcentaje:${x.porcentaje}'>
                            <td class='text-center'>
                                <button type='button' class ='btn btn-xs btn-danger _cls_btn_delete_sinhilado'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td>
                                <select class ='_cls_materiaprima_sinhilado form-control'></select>
                                <span class ='spn_error_materiaprima hide has-error'>Falta Seleccionar la materia prima</span>
                            </td>
                            <td>
                                <input type='text' class ='_cls_txt_porcentaje form-control' maxlength = '6' value='${x.porcentaje}' />
                                <span class ='spn_error_porcentaje hide has-error'>Falta ingresar el porcentaje</span>
                            </td>
                        </tr>
                    `;
                });

                tbody_contenido.innerHTML = html;
                llenar_combos_tbl_contenido_sinhilado_ini();
            }
        }

        function llenar_combos_tbl_titulos_sinhilado_ini() {
            let tbody_titulo = _('tbody_titulo_sinhilado'), arr_rows = Array.from(tbody_titulo.rows);
            arr_rows.forEach((x, indice) => {
                let par = x.getAttribute('data-par'), idsistema = _par(par, 'idsistematitulacion'), cbosistema = x.getElementsByClassName('_cls_systema_sinhilado')[0],
                    idtitulo = _par(par, 'idtitulohiladotela');

                x.getElementsByClassName('_cls_btn_delete_sinhilado')[0].addEventListener('click', e => { fn_delete_sinhilado_ini_general(e); })

                llenarcombo_add_tbl_titulo_sinhilado(indice);
                handler_add_tbl_titulo_sinhilado(indice);
                cbosistema.value = idsistema;

                let lsttitulo = ovariables.lstcbotitulo.filter(x => x.idsistematitulacion === idsistema),
                    cbotitulo = x.getElementsByClassName('_cls_titulo_sinhilado')[0];

                cbotitulo.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lsttitulo, 'idtitulo', 'nombretitulo');
                cbotitulo.value = idtitulo;
            });
        }

        function llenar_combos_tbl_contenido_sinhilado_ini() {
            let tbody_contenido = _('tbody_contenido_sinhilado'), arr_rows = Array.from(tbody_contenido.rows);
            arr_rows.forEach((x, indice) => {
                let par = x.getAttribute('data-par'), idmateriaprima = _par(par, 'idmateriaprima'), cbomateriaprima = x.getElementsByClassName('_cls_materiaprima_sinhilado')[0],
                    porcentaje = _par(par, 'porcentaje'), txtporcentaje = x.getElementsByClassName('_cls_txt_porcentaje')[0];

                x.getElementsByClassName('_cls_btn_delete_sinhilado')[0].addEventListener('click', e => { fn_delete_sinhilado_ini_general(e); });

                llenarcombo_add_tbl_contenido_sinhilado(indice);
                handler_add_tbl_contenido_sinhilado(indice);

                cbomateriaprima.value = idmateriaprima;
                txtporcentaje.value = porcentaje;
            });
        }

        function fn_delete_sinhilado_ini_general(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;

            fila.parentNode.removeChild(fila);
        }

        function fn_visualizar_ocultar_segun_conhilado_seleccionado(conhiladoseleccionado) {
            if (conhiladoseleccionado === '0') {
                _('div_tbl_hilado').classList.remove('hide');
                _('div_tbl_sinhilado').classList.add('hide');
                _('div_ligamentos_disenioestructura').classList.remove('hide');
                _('div_grupo_imagenestructura').classList.remove('hide');
                _('btnaddyarndetail').classList.remove('hide');
            } else if (conhiladoseleccionado === '1') {
                _('div_tbl_hilado').classList.add('hide');
                _('div_tbl_sinhilado').classList.remove('hide');
                _('div_ligamentos_disenioestructura').classList.add('hide');
                _('div_grupo_imagenestructura').classList.add('hide');
                _('btnaddyarndetail').classList.add('hide');
            }
        }

        function cargar_tabla_criterio_aprobacion_new(data) {
            let html = '', tbody = _('tbody_criterio_aprobacion');
            if (data !== null) {
                data.forEach(x => {
                    html += `
                            <tr data-par='idvalorestado:${x.idvalorestado}'>
                                <td class='_cls_nombre_criterio'>${x.nombreestado}</td>
                                <td>${x.descripcioncriterio}</td>
                                <td class='text-center bg-success'>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_aprobacion' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_aprobacion _cls_aprobado' style='position: absolute; opacity: 0;' name='_chk_aprobacion' value="APRO" data-valor="APRO" />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                    <span class ='has-error _cls_error_chk_criterioaprobacion hide'>Falta seleccionar el criterio de aprobación</span>
                                </td>
                                <td class ='text-center bg-danger'>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_aprobacion' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_aprobacion _cls_rechazado' style='position: absolute; opacity: 0;' name='_chk_aprobacion' value="RECH" data-valor="RECH" />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                    <span class ='has-error _cls_error_chk_criterioaprobacion hide'>Falta seleccionar el criterio de aprobación</span>
                                </td>
                                <td>
                                    <textarea class ='form-control _cls_txta_comentario' style='resize:none;'></textarea>
                                    <span class ='has-error _cls_error_comentario_criterioaprobacion hide'>Falta ingresar el comentario</span>
                                </td>
                            </tr>
                        `;
                });

                tbody.innerHTML = html;
                //// POR EL MOMENTO NO SE VA A USAR POR ATX SIN SDT
                //handler_tabla_criterio_aprobacion();
            }
        }

        function cargar_tabla_criterio_aprobacion_edit(data, data_aprobacion_atx) {
            let html = '', tbody = _('tbody_criterio_aprobacion');
            if (data !== null) {
                data.forEach(x => {
                    html += `
                            <tr data-par='idvalorestado:${x.idvalorestado}'>
                                <td class='_cls_nombre_criterio'>${x.nombreestado}</td>
                                <td>${x.descripcioncriterio}</td>
                                <td class='text-center bg-success'>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_aprobacion' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_aprobacion _cls_aprobado' style='position: absolute; opacity: 0;' name='_chk_aprobacion' value="APRO" data-valor="APRO" />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                    <span class ='has-error _cls_error_chk_criterioaprobacion hide'>Falta seleccionar el criterio de aprobación</span>
                                </td>
                                <td class ='text-center bg-danger'>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_aprobacion' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_aprobacion _cls_rechazado' style='position: absolute; opacity: 0;' name='_chk_aprobacion' value="RECH" data-valor="RECH" />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                    <span class ='has-error _cls_error_chk_criterioaprobacion hide'>Falta seleccionar el criterio de aprobación</span>
                                </td>
                                <td>
                                    <textarea class ='form-control _cls_txta_comentario' style='resize:none;'></textarea>
                                    <span class ='has-error _cls_error_comentario_criterioaprobacion hide'>Falta ingresar el comentario</span>
                                </td>
                            </tr>
                        `;
                });

                tbody.innerHTML = html;
                //// POR EL MOMENTO NO SE VA A USAR POR ATX SIN SDT
                //handler_tabla_criterio_aprobacion();

                //// ACTUALIZAR LOS DATOS - DE APROBACION DE TELA
                let arr_rows = Array.from(tbody.rows);
                arr_rows.forEach((x, indice) => {
                    let datapar = x.getAttribute('data-par'), idvalorestado = _par(datapar, 'idvalorestado'), txta_observacion_operador = x.getElementsByClassName('_cls_txta_comentario')[0];
                    if (data_aprobacion_atx !== null) {
                        let filter_aprob = data_aprobacion_atx.filter(x => x.idvalorestado === idvalorestado);
                        if (filter_aprob.length > 0) {
                            let estado_aprobacion = filter_aprob[0].estado_aprobrech;
                            seleccionar_chk_aprobacion_atx(indice, estado_aprobacion);  //// SELECCIONA EL CHECK DE ESTADO DE APROBACION
                            txta_observacion_operador.value = filter_aprob[0].observacion;
                        }
                    }
                });

            }
        }

        function seleccionar_chk_aprobacion_atx(indice_fila, valor_estado) {
            let tbody = _('tbody_criterio_aprobacion'), arr_chk = Array.from(tbody.rows[indice_fila].getElementsByClassName('_clscheck_aprobacion'));
            arr_chk.forEach(x => {
                let valor = x.getAttribute('data-valor');
                x.parentNode.classList.remove('checked');
                x.checked = false;
                if (valor === valor_estado) {
                    x.checked = true;
                    x.parentNode.classList.add('checked');
                }
            });
        }

        function getarray_criterioaprobacion_save() {
            let tbody = _('tbody_criterio_aprobacion'), arr_rows = Array.from(tbody.rows), obj_return = {}, lst = [], resultado_aprobacion = 'APRO',
                haycheck_criterio_marcados = false;

            arr_rows.forEach(x => {
                let par = x.getAttribute('data-par'), idvalorestado = _par(par, 'idvalorestado'), arr_chk = Array.from(x.getElementsByClassName('_clscheck_aprobacion')),
                    observacion = x.getElementsByClassName('_cls_txta_comentario')[0].value, nombre_criterio = x.getElementsByClassName('_cls_nombre_criterio')[0].innerText.trim();

                let valor_estado = get_criterioaprobacion_seleccionado(arr_chk); ////fn_getestado_seleccionado(arr_chk);
                if (valor_estado !== '') {
                    haycheck_criterio_marcados = true;
                }
                if (valor_estado === 'RECH') {
                    resultado_aprobacion = 'RECH';
                }
                let obj = {
                    idvalorestado: idvalorestado,
                    estado_aprobrech: valor_estado,
                    observacion: observacion
                }
                lst.push(obj);
            });

            if (haycheck_criterio_marcados === false) {
                resultado_aprobacion = '';
            }

            obj_return.arr_criterio_aprobacion = lst;
            obj_return.resultado_aprobacion = resultado_aprobacion;
            return obj_return;
        }

        function handler_tabla_criterio_aprobacion() {
            //// PARA LOS CHECKBOX - I-CHECKS
            $("#div_criterio_aprobacion .i-checks._clscheck_aprobacion").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), fila = dom.parentNode.parentNode.parentNode.parentNode.parentNode;
                //div_resumen = _('div_criterio_aprobacion');
                //// VISUALIZAR EL TEXTO DE RESUMEN
                //div_resumen.getElementsByClassName('cls_spn_resumen_criterioaprobacion')[0].classList.remove('hide');
                if (valor === 'APRO') {
                    let chk = fila.getElementsByClassName('_cls_rechazado')[0];
                    chk.checked = false;
                    chk.parentNode.classList.remove('checked');
                } else if (valor === 'RECH') {
                    let chk = fila.getElementsByClassName('_cls_aprobado')[0];
                    chk.checked = false;
                    chk.parentNode.classList.remove('checked');
                }
                let resumen = getarray_criterioaprobacion_save();
                //// POR EL MOMENTO NO SE VA A USAR POR ATX SIN SDT
                ////set_resumen_estado_aprobado_rechazado(resumen.resultado_aprobacion);
            });
        }

        function get_criterioaprobacion_seleccionado(arr_chk) {
            //let tbody = _('tbody_criterio_aprobacion'), fila = tbody.rows[indicefila], arr_chk = Array.from(fila.getElementsByClassName('_clscheck_aprobacion')),
            let valor = '';
            arr_chk.some(x => {
                if (x.checked) {
                    valor = x.getAttribute('data-valor');
                    return true;
                }
            });

            return valor;
        }

        function set_resumen_estado_aprobado_rechazado(estado) {
            let div_resumen = _('div_criterio_aprobacion'), strong = div_resumen.getElementsByClassName('cls_text_resumen_criterioaprobacion')[0];
            div_resumen.getElementsByClassName('cls_spn_resumen_criterioaprobacion')[0].classList.remove('hide');
            if (estado === 'RECH') {
                strong.innerText = 'RECHAZADO';
                strong.classList.add('text-danger');
            } else if (estado === 'APRO') {
                strong.innerText = 'APROBADO';
                strong.classList.remove('text-danger');
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            _parameterEncodeJSON: _parameterEncodeJSON,
            _parameterUncodeJSON: _parameterUncodeJSON,
            refrescar_combo_af_aq_despues_crear: refrescar_combo_af_aq_despues_crear,
            fn_change_system: fn_change_system,
            fn_change_title: fn_change_title,
            fn_change_hilado: fn_change_hilado,
            fn_change_formahilado: fn_change_formahilado
        }
    }

)(document, 'panelEncabezado_atx');

(
    function init() {
        appAtxView.load();
        appAtxView.req_ini();
    }
)();
var app_FabricReqs = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idrequerimiento: '',
            index1: '',
            index2: '',
        }

        var ovariables_info = {
            lst_paqueteprueba: []
            , lst_fabrica: []
            , lst_tintoreria: []
            , lst_cliente: []
            , lst_temporada: []
            , lst_color: []
            , lst_lavado: []
            , lst_proceso: []
            , lst_categoriainstruccioncuidado: []
            , lst_instruccioncuidado: []
            , obj_tela: ''
            , lst_solicitud_lab: []
            , lst_ic_checked: []
            , lst_sl_checked: []
        }

        function load() {
            const par = _('fabricreqs_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idclientetemporada = _par(par, 'idclientetemporada');
                ovariables.index1 = _par(par, 'index1');
                ovariables.index2 = _par(par, 'index2');
                ovariables.idrequerimiento = _('IdRequerimiento').value;
            }

            // EVENTS
            _('btn_guardar').addEventListener('click', fn_throw_request);

            // TABS INICIALES
            $("#ul_fa_reqs li").removeClass("active").addClass("hide");
            $("#tab_fa_reqs .tab-pane").removeClass("active");

            // MOSTRAR TABS
            $(`a[href=#tabfabr-${ovariables.index1}]`).parent().addClass("active");
            $(`a[href=#tabfabr-${ovariables.index1}]`).parent().removeClass("hide");
            $(`a[href=#tabfabr-${ovariables.index2}]`).parent().removeClass("hide");

            $(`#tabfabr-${ovariables.index1}`).addClass("active");


            /* Laboratorio */
            $('#div_formulario').slimScroll({
                height: '420px',
                width: '100%',
                railOpacity: 0.9
            });

            //$('#div_datos').slimScroll({
            //    height: '415px',
            //    width: '100%',
            //    railOpacity: 0.9
            //});

            $('#div_tbl_ic').slimScroll({
                height: '290px',
                width: '100%',
                railOpacity: 0.9
            });

            $('.footable').footable();
            $('.footable').trigger('footable_resize');

            _('cbo_tintoreria').addEventListener('change', fn_load_color);          
        }


        /* Inicio - Laboratorio */
        function clean_required_item() {
            var arr2 = [...document.getElementsByClassName('has-error')]
            arr2.forEach(x => x.classList.remove('has-error'));
        }

        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);

            let min = '', max = '', accion_min = true, accion_max = true, cls_hide=false;
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                cls_two_items = x.classList.contains('_two_items');
                cls_hide = x.parentNode.parentNode.parentNode.parentNode.classList.contains('hide');

                min = x.getAttribute("data-min");
                max = x.getAttribute("data-max");
                accion_min = false;
                accion_max = false;
                estadoenty = true;

                if (min !== null && min != '') { accion_min = _min(valor, min); }
                if (max !== null && max != '') { accion_max = _max(valor, max); }

                if (min != null && max != null) { if (!accion_min || !accion_max) { estadoenty = false; } }
                else if (min != null && max == null) { if (!accion_min) { estadoenty = false; } }
                else if (max != null && min == null) { if (!accion_max) { estadoenty = false; } }

                if (att) {
                    if ((valor == '') || (valor == '0' && cls_select2 == true)) {
                        if (cls_two_items == true && cls_hide == false) { x.parentNode.parentNode.classList.add('has-error'); resultado = false; }
                        if (cls_two_items == false && cls_hide == false) { x.parentNode.classList.add('has-error'); resultado = false; }
                    }
                    if (!estadoenty) { x.parentNode.classList.add('has-error'); resultado = false; }
                }
            })
            return resultado;
        }

        function required_radiobutton(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
            let array = Array.prototype.slice.apply(elementsselect2);
            array.forEach(x=> {
                valor = x.value, padre = x.parentNode;
                if (oenty.tipo == '0') { resultado = false; padre.classList.add('text-danger'); }
                else { padre.classList.remove('text-danger'); }

            });
            return resultado;
        }
        
        function fn_guardar() {
            
            clean_required_item();
            let reproceso_checked = 0, color = '';

            reproceso_checked = $("input[name='detail_reproceso']:checked").length;
            req_reproceso = required_radiobutton({ id: 'tabfabr-2', clase: '_rad', tipo: reproceso_checked });

            let chk_1 = $("input[name='detail_reproceso']").index($("input[name='detail_reproceso']:checked")[0])
            if (chk_1 == 1) { reproceso = 'NO'; }
            else { reproceso = 'SI'; }

            if (_('div_cbo_color').classList.contains('hide')) { color = _('txt_color').value; }
            else { color = _('cbo_color').value; }

            let required = required_item({ id: 'tabfabr-2', clase: '_enty_grabar' });
            let required_color = required_item({ id: 'tabfabr-2', clase: '_enty_grabar_color' });

            if (req_reproceso > 0) {
                if (required && required_color) {
                    if (reproceso == 'SI' && ovariables_info.lst_sl_checked.length == 0) {
                        swal({ title: "Advertencia!!", text: "Debe seleccionar las partidas a reprocesar", type: "warning" });
                    }
                    else {
                        swal({
                            title: "Esta seguro de guardar los datos ingresados?",
                            text: "",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false
                        }, function () {
                            req_new(reproceso);
                        });
                    }                   
                }
                else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_new(_reproceso) {
            let reproceso = _reproceso, color = '';

            if (_('div_cbo_color').classList.contains('hide')) { color = _('txt_color').value; }
            else { color = $("#cbo_color option:selected").text() }

            let osolicitud = _getParameter({ id: 'tabfabr-2', clase: '_enty_grabar' })
                , arr_ic = ovariables_info.lst_ic_checked
                , arr_sl = ovariables_info.lst_sl_checked;
            form = new FormData();
            osolicitud['idrequerimiento'] = ovariables.id;
            osolicitud['reproceso'] = reproceso;
            osolicitud['color'] = color;            
            form.append("parhead", JSON.stringify(osolicitud));
            form.append("pardetail", JSON.stringify(arr_ic));
            form.append("parsubdetail", JSON.stringify(arr_sl));

            _Post('Requerimiento/Tela/SaveInfo_TestLaboratorio', form, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            swal({
                                title: "Good job!",
                                text: "The style was created successfully",
                                type: "success",
                                timer: 5000,
                                showCancelButton: false,
                                confirmButtonColor: "#1c84c6",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });

                            $("#modal_FabricRequirements").modal("hide");
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });

        }

        function req_ini() {
            if (ovariables.index1 == '2') { req_info_test_laboratorio(); }
        }

        function req_info_test_laboratorio() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idrequerimiento: ovariables.id };

            _Get('Requerimiento/Tela/GetInfo_TestLaboratorio?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables_info.lst_paqueteprueba = rpta[0].paqueteprueba !== '' ? CSVtoJSON(rpta[0].paqueteprueba) : [];
                        ovariables_info.lst_fabrica = rpta[0].fabrica !== '' ? CSVtoJSON(rpta[0].fabrica) : [];
                        ovariables_info.lst_tintoreria = rpta[0].tintoreria !== '' ? CSVtoJSON(rpta[0].tintoreria) : [];
                        ovariables_info.lst_cliente = rpta[0].cliente !== '' ? CSVtoJSON(rpta[0].cliente) : [];
                        ovariables_info.lst_temporada = rpta[0].temporada !== '' ? CSVtoJSON(rpta[0].temporada) : [];
                        ovariables_info.lst_color = rpta[0].color !== '' ? CSVtoJSON(rpta[0].color) : [];
                        ovariables_info.lst_lavado = rpta[0].lavado !== '' ? CSVtoJSON(rpta[0].lavado) : [];
                        ovariables_info.lst_proceso = rpta[0].proceso !== '' ? CSVtoJSON(rpta[0].proceso) : [];
                        ovariables_info.lst_categoriainstruccioncuidado = rpta[0].categoriainstruccioncuidado !== '' ? CSVtoJSON(rpta[0].categoriainstruccioncuidado) : [];
                        ovariables_info.lst_instruccioncuidado = rpta[0].instruccioncuidado !== '' ? CSVtoJSON(rpta[0].instruccioncuidado) : [];
                        ovariables_info.obj_tela = rpta[0].tela !== '' ? CSVtoJSON(rpta[0].tela) : '';
                        ovariables_info.lst_solicitud_lab = rpta[0].solicitud_lab !== '' ? CSVtoJSON(rpta[0].solicitud_lab) : [];

                        fn_load_cbo('cbo_paqueteprueba', ovariables_info.lst_paqueteprueba);
                        fn_load_cbo('cbo_fabrica', ovariables_info.lst_fabrica);

                        if (ovariables_info.lst_tintoreria.length > 0) {
                            fn_load_cbo('cbo_tintoreria', ovariables_info.lst_tintoreria, 'Seleccione');
                            _('div_cbo_color').classList.remove('hide');
                            _('div_txt_color').classList.add('hide');
                            fn_load_color();
                        }
                        else {
                            fn_load_cbo('cbo_tintoreria', ovariables_info.lst_fabrica);
                            _('div_cbo_color').classList.add('hide');
                            _('div_txt_color').classList.remove('hide');
                        }
                       
                       
                        fn_load_cbo('cbo_cliente', ovariables_info.lst_cliente);
                        fn_load_cbo('cbo_temporada', ovariables_info.lst_temporada);
                        
                        fn_load_cbo('cbo_lavado', ovariables_info.lst_lavado);
                        fn_load_cbo('cbo_proceso', ovariables_info.lst_proceso, 'Seleccione');
                        fn_load_cbo('cbo_categoria_ic', ovariables_info.lst_categoriainstruccioncuidado, 'Todos');

                        _('txt_codigotela').value = ovariables_info.obj_tela[0].codigotela;
                        _('txt_descripcion_tela').value = ovariables_info.obj_tela[0].descripciontela;
                        _('txt_densidad').value = ovariables_info.obj_tela[0].densidad;

                        fn_load_tbl_instruccioncuidado(ovariables_info.lst_instruccioncuidado);
                        fn_load_tbl_solicitud_lab(ovariables_info.lst_solicitud_lab);


                    }
                }, (p) => { err(p); });
        }

        function fn_load_cbo(_iditem, _data, _adicional) {
            let cantidad = _data.length, cbo = '';
            if (_adicional != null) { cbo += `<option value='0'>${_adicional}</option>`; }
            _data.forEach(x=> { cbo += `<option value='${x.codigo}'>${x.descripcion}</option>`; });
            _(_iditem).innerHTML = cbo;
        }
        
        function fn_load_color() {
            let idtintoreria = _('cbo_tintoreria').value;
            let res_color = ovariables_info.lst_color.filter(x=>x.idtintoreria === idtintoreria);
            fn_load_cbo('cbo_color', res_color, 'Seleccione');
        }
        
        function fn_load_tbl_instruccioncuidado(_data) {
            let data = _data;

            const html = data.map(x => {
                return `<tr data-par='idinstruccioncuidado:${x.idinstruccioncuidado},idcategoriainstruccioncuidado:${x.idcategoriainstruccioncuidado},instruccioncuidado:${x.instruccioncuidado}'>
                            <td>
                                <div  class ='i-checks _item'>
                                    <div class ='icheckbox_square-green _chkitem_ic' style='position: relative;' >
                                        <label>
                                            <input type='checkbox' class ='i-checks' style='position: absolute; opacity: 0;'>
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td>${x.categoriainstruccioncuidado}</td>
                            <td>${x.instruccioncuidado}</td>
                        </tr>`;
            }).join('');
            _('tbl_instruccioncuidado').tBodies[0].innerHTML = html;
            $('.footable').trigger('footable_resize');
            
            handler_table();
        }

        function fn_load_tbl_solicitud_lab(_data) {
            let data = _data;

            const html = data.map(x => {
                return `<tr data-par='cod_partida:${x.cod_partida},reportetecnico:${x.reportetecnico},numeropartida:${x.numeropartida}'>
                            <td>
                                <div  class ='i-checks _item'>
                                    <div class ='icheckbox_square-green _chkitem_sol_lab' style='position: relative;' >
                                        <label>
                                            <input type='checkbox' class ='i-checks' style='position: absolute; opacity: 0;'>
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td>${x.reportetecnico}</td>
                            <td>${x.numeropartida}</td>
                            <td>${x.cliente}</td>
                            <td>${x.fabrica}</td>
                            <td>${x.estadofinal}</td>
                            <td>${x.estadolab}</td>
                            <td>${x.estadotono}</td>
                        </tr>`;
            }).join('');
            _('tbl_solicitud').tBodies[0].innerHTML = html;
            $('.footable').trigger('footable_resize');

            handler_table();
        }

        function handler_table() {
            $('.i-checks._item').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let obj = {}, arrchk = [];
                let x = e.currentTarget;
                let chk = x.checked;
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let tbl = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');

                if (tbl.id == 'tbl_instruccioncuidado') {
                    let idinstruccioncuidado = _par(par, 'idinstruccioncuidado');
                    let idcategoriainstruccioncuidado = _par(par, 'idcategoriainstruccioncuidado');
                    let instruccioncuidado = _par(par, 'instruccioncuidado');
                    obj.idinstruccioncuidado = parseInt(idinstruccioncuidado);
                    obj.idcategoriainstruccioncuidado = parseInt(idcategoriainstruccioncuidado);
                    obj.instruccioncuidado = instruccioncuidado;

                    if (chk) { ovariables_info.lst_ic_checked.push(obj); }
                    else {
                        arrchk = ovariables_info.lst_ic_checked.filter(y=>y.idinstruccioncuidado + '¬' + y.idcategoriainstruccioncuidado !== idinstruccioncuidado + '¬' + idcategoriainstruccioncuidado);
                        ovariables_info.lst_ic_checked = arrchk;
                    }

                    let text = '';
                    ovariables_info.lst_ic_checked.forEach(h=> { text += h.instruccioncuidado + ' / '; });
                    _('txt_instruccioncuidado').value = text.slice(0, -3);
                }
                else {
                    let cod_partida = _par(par, 'cod_partida');
                    let reportetecnico = _par(par, 'reportetecnico');
                    let numeropartida = _par(par, 'numeropartida');
                    obj.cod_partida = parseInt(cod_partida);
                    obj.reportetecnico = reportetecnico;
                    obj.numeropartida = numeropartida;

                    if (chk) { ovariables_info.lst_sl_checked.push(obj); }
                    else {
                        arrchk = ovariables_info.lst_sl_checked.filter(y=>y.cod_partida.toString() !== cod_partida);
                        ovariables_info.lst_sl_checked = arrchk;
                    }

                    let text = '';
                    ovariables_info.lst_sl_checked.forEach(h=> { text += h.reportetecnico + ' / '; });
                    _('txst_solicitud_lab').value = text.slice(0, -3);
                }

            });
        }

        /* Fin - Laboratorio */



        function fn_remove(e) {
            const tr = e.parentElement.parentElement;
            tr.remove();
        }

        function fn_add() {
            const tbl = _('tbl_cotizacion').children[1];
            const val = _('txtRQQuantity').value;
            tbl.innerHTML += `<tr>
                                    <td>
                                        <button type="button" class="btn btn-xs btn-danger" onclick="app_FabricReqs.fn_remove(this)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                    <td>${val}</td>
                                </tr>`;
            _('txtRQQuantity').value = '';
        }

        function fn_throw_request() {
            let idtipo = '';
            let tipomuestra = '';
            let idmotivosolicitud = '';
            let idservicio = '';
            [ovariables.index1, ovariables.index2].forEach(x => {
                const index = _parseInt(x);
                if (index === 1) {
                    idtipo = 'DT_SOL2'; // TIPO SOLICITUD
                    tipomuestra = 1; // ANALISIS TEXTIL
                    idmotivosolicitud = 1; // ANALIZAR LA MUESTRA FÍSICA A ENTREGAR
                    idservicio = 9 // IDSERVICIO - ANALISIS TEXTIL
                    fn_req_textile_analysis(idtipo, "Textile analysis", tipomuestra, idmotivosolicitud, idservicio);
                } else if (index === 2) {
                    // VACIO - LO HARA LUIS ROJAS
                    fn_guardar();
                } else if (index === 3) {
                    idtipo = 'DT_SOL4' // TIPO SOLIICTUD
                    idservicio = 12 // IDSERVICIO - COLGADORES WTS
                    fn_req_search_hangers(idtipo, "Search for hangers by fabric description", idservicio);
                } else if (index === 4) {
                    idtipo = 'DT_SOL5'; // TIPO SOLICITUD
                    tipomuestra = 5; // FICHA DE INSPIRACION
                    idmotivosolicitud = 3; // DESARROLLO
                    idservicio = 9 // IDSERVICIO - ANALISIS TEXTIL
                    fn_req_projected_textile_analysis(idtipo, "Projected textile analysis", tipomuestra, idmotivosolicitud, idservicio);
                } else if (index === 5) {
                    idtipo = 'DT_SOL6'; // TIPO SOLICITUD
                    idservicio = 13 // IDSERVICIO - COTIZACION TELA
                    fn_req_fabric_quotation(idtipo, "Fabric quotation", idservicio);
                } else if (index === 7) {
                    idtipo = 'DT_SOL8'; // TIPO SOLICITUD
                    tipomuestra = 4; // ANALISIS TEXTIL PASADO
                    idmotivosolicitud = 1; // ANALIZAR LA MUESTRA FÍSICA A ENTREGAR
                    idservicio = 9 // IDSERVICIO - ANALISIS TEXTIL
                    fn_search_for_past_analysis_report(idtipo, "Search for a past analysis report (2011 - 2016)", tipomuestra, idmotivosolicitud, idservicio);
                }
            });
        }

        function fn_req_search_hangers(IdTipo, Requirement, IdServicio) {
            swal({
                html: true,
                title: `Send the requirement "${Requirement}"?`,
                text: "Are you sure you want to send this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const err = function (__err) { console.log('err', __err) };
                let frm = new FormData();
                const par = {
                    idcolgadorsolicitud: "",
                    idsolicitud: "",
                    idcliente: "51",
                    comentario: "JACOB TEST DE DESCRIPCION DE TELA",
                    descripciontela: "JERSEY TEST 01",
                    // PARA 2DO INSERT
                    IdRequerimiento: ovariables.idrequerimiento,
                    Tipo: IdTipo
                };
                const parDetalle = [];
                const parSubDetalleJSON = {
                    arr_fotos_existentes: [],
                    arr_fotos_new: [],
                    arr_save_fotos_descripcion: []
                };
                const parEnviar = {
                    estadonuevo: "PAP",
                    estadoactual: "C",
                    idservicio: IdServicio
                };
                frm.append('par', JSON.stringify(par));
                frm.append('parDetalle', JSON.stringify(parDetalle));
                frm.append('parSubDetalleJSON', JSON.stringify(parSubDetalleJSON));
                frm.append('parEnviar', JSON.stringify(parEnviar));
                _Post('Requerimiento/Solicitud/Save_Colgadores', frm, true)
                    .then((resultado) => {
                        if (resultado != '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            $("#modal_FabricRequirements").modal("hide");
                            console.log(resultado);
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_req_textile_analysis(IdTipo, Requirement, Tipomuestra, IdMotivoSolicitud, IdServicio) {
            swal({
                html: true,
                title: `Send the requirement "${Requirement}"?`,
                text: "Are you sure you want to send this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const err = function (__err) { console.log('err', __err) };
                let frm = new FormData();
                const par = {
                    idsolicituddesarrollotela: 0,
                    idsolicituddetalledesarrollotela: 0,
                    tipomuestra: "1",
                    idmotivosolicitud: "1",
                    codigoreporte: "",
                    anio_atx_estandar: 0,
                    contador_atx_estandar: 0,
                    codigosolicitudestandar: "",
                    codigotela: "",
                    idcliente: "51",
                    densidad: "100",
                    color: "RED",
                    codigoreporteanalisistextilexistente: "",
                    estructura: "SADSAD",
                    anio: 0,
                    correlativo: 0,
                    titulo: "ASDSAD",
                    idproveedorfabrica: 0,
                    proveedorfabrica: "",
                    codigotelaproveedor: "",
                    partida: "",
                    comentario: "TEST DE COMENTARIO",
                    LavadoPanos: "0",
                    Evaluacion: "0",
                    desarrollotelarequiereanalisislaboratorio: 0,
                    NombreArchivo: "",
                    NombreWeb: "",
                    // PARA 2DO INSERT
                    IdRequerimiento: ovariables.idrequerimiento,
                    Tipo: IdTipo
                };
                const parDetalle = [
                    {
                        IdDetalle: "0",
                        IdMateriaPrima: "3",
                        PorcentajeComposicion: "100"
                    }
                ];
                const parEnviar = {
                    estadonuevo: "PAP",
                    estadoactual: "C",
                    idservicio: IdServicio
                };
                frm.append('par', JSON.stringify(par));
                frm.append('parDetalle', JSON.stringify(parDetalle));
                frm.append('parEnviar', JSON.stringify(parEnviar));
                _Post('Requerimiento/Solicitud/Save_ATX', frm, true)
                    .then((resultado) => {
                        if (resultado != '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            $("#modal_FabricRequirements").modal("hide");
                            console.log(resultado);
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_req_projected_textile_analysis(IdTipo, Requirement, Tipomuestra, IdMotivoSolicitud, IdServicio) {
            swal({
                html: true,
                title: `Send the requirement "${Requirement}"?`,
                text: "Are you sure you want to send this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const err = function (__err) { console.log('err', __err) };
                let frm = new FormData();
                const par = {
                    idsolicituddesarrollotela: 0,
                    idsolicituddetalledesarrollotela: 0,
                    tipomuestra: "5",
                    idmotivosolicitud: "3",
                    codigoreporte: "",
                    anio_atx_estandar: 0,
                    contador_atx_estandar: 0,
                    codigosolicitudestandar: "",
                    codigotela: "",
                    idcliente: "51",
                    densidad: "100",
                    color: "RED",
                    codigoreporteanalisistextilexistente: "",
                    estructura: "SADSAD",
                    anio: 0,
                    correlativo: 0,
                    titulo: "ASDSAD",
                    idproveedorfabrica: 0,
                    proveedorfabrica: "",
                    codigotelaproveedor: "",
                    partida: "",
                    comentario: "TEST DE COMENTARIO",
                    LavadoPanos: "0",
                    Evaluacion: "0",
                    desarrollotelarequiereanalisislaboratorio: 0,
                    NombreArchivo: "",
                    NombreWeb: "",
                    // PARA 2DO INSERT
                    IdRequerimiento: ovariables.idrequerimiento,
                    Tipo: IdTipo
                };
                const parDetalle = [
                    {
                        IdDetalle: "0",
                        IdMateriaPrima: "3",
                        PorcentajeComposicion: "100"
                    }
                ];
                const parEnviar = {
                    estadonuevo: "PAP",
                    estadoactual: "C",
                    idservicio: IdServicio
                };
                frm.append('par', JSON.stringify(par));
                frm.append('parDetalle', JSON.stringify(parDetalle));
                frm.append('parEnviar', JSON.stringify(parEnviar));
                _Post('Requerimiento/Solicitud/Save_ATX', frm, true)
                    .then((resultado) => {
                        if (resultado != '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            $("#modal_FabricRequirements").modal("hide");
                            console.log(resultado);
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_search_for_past_analysis_report(IdTipo, Requirement, Tipomuestra, IdMotivoSolicitud, IdServicio) {
            swal({
                html: true,
                title: `Send the requirement "${Requirement}"?`,
                text: "Are you sure you want to send this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const err = function (__err) { console.log('err', __err) };
                let frm = new FormData();
                const par = {
                    idsolicituddesarrollotela: 0,
                    idsolicituddetalledesarrollotela: 0,
                    tipomuestra: "4",
                    idmotivosolicitud: "1",
                    codigoreporte: "",
                    anio_atx_estandar: 0,
                    contador_atx_estandar: 0,
                    codigosolicitudestandar: "",
                    codigotela: "",
                    idcliente: "51",
                    densidad: "100",
                    color: "RED",
                    codigoreporteanalisistextilexistente: "",
                    estructura: "SADSAD",
                    anio: 0,
                    correlativo: 0,
                    titulo: "ASDSAD",
                    idproveedorfabrica: 0,
                    proveedorfabrica: "",
                    codigotelaproveedor: "",
                    partida: "",
                    comentario: "TEST DE COMENTARIO",
                    LavadoPanos: "0",
                    Evaluacion: "0",
                    desarrollotelarequiereanalisislaboratorio: 0,
                    NombreArchivo: "",
                    NombreWeb: "",
                    // PARA 2DO INSERT
                    IdRequerimiento: ovariables.idrequerimiento,
                    Tipo: IdTipo
                };
                const parDetalle = [
                    {
                        IdDetalle: "0",
                        IdMateriaPrima: "3",
                        PorcentajeComposicion: "100"
                    }
                ];
                const parEnviar = {
                    estadonuevo: "PAP",
                    estadoactual: "C",
                    idservicio: IdServicio
                };
                frm.append('par', JSON.stringify(par));
                frm.append('parDetalle', JSON.stringify(parDetalle));
                frm.append('parEnviar', JSON.stringify(parEnviar));
                _Post('Requerimiento/Solicitud/Save_ATX', frm, true)
                    .then((resultado) => {
                        if (resultado != '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            $("#modal_FabricRequirements").modal("hide");
                            console.log(resultado);
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_req_fabric_quotation(IdTipo, Requirement, IdServicio) {
            swal({
                html: true,
                title: `Send the requirement "${Requirement}"?`,
                text: "Are you sure you want to send this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                const err = function (__err) { console.log('err', __err) };
                let frm = new FormData();
                const par = {
                    solicitudes: [
                        {
                            "idcliente": "159",
                            "idclientetemporada": "1066",
                            "codigotela": "1900002DFA301",
                            "nroatx": "ATX19 - 00003",
                            "familia": "Double Face",
                            "contenido": "71.25% Cotton 12.5% Polyester 16.25% Modal ",
                            "densidad": "219", "tradename": "TRD999",
                            "division": "10",
                            "descripcion": "Double Face 71.25% Cotton 12.5% Polyester 16.25% Modal, 219 gr/m2 AW",
                            "comentario": "Encogimientos? No debería ofrecerse lavado? ",
                            "rango": "100", "auxorden": 1,
                            "idanalisistextil": 3086,
                            "lavado": "AW",
                            "modalidad": "M"
                        }],
                    observaciones: "",
                    id: "",
                    accion: "new",
                    // PARA 2DO INSERT
                    IdRequerimiento: ovariables.idrequerimiento,
                    Tipo: IdTipo
                };
                const parEnviar = {
                    estadonuevo: "PAP",
                    estadoactual: "C",
                    idservicio: IdServicio
                };
                frm.append('par', JSON.stringify(par));
                frm.append('parEnviar', JSON.stringify(parEnviar));
                _Post('Requerimiento/Solicitud/Save_Cotizacion', frm, true)
                    .then((resultado) => {
                        if (resultado != '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            $("#modal_FabricRequirements").modal("hide");
                            console.log(resultado);
                            app_NewFabric.req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_req_laboratory_testing() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_remove: fn_remove,
            fn_add: fn_add
        }
    }
)(document, 'panelEncabezado_FabricReqs');
(
    function ini() {
        app_FabricReqs.load();
        app_FabricReqs.req_ini();
    }
)();
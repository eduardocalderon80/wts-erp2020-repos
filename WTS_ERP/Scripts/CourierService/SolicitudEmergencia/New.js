var app_solicitud_emergencia_New = (
    function (d, idpadre) {

        var ovariables_informacion = {
            idtipoenvio: 3,
            fecha: '',
            informacion_usuario: '',
            idusuario: 0,
            idusuarioaprobador: 0,
            nivel: 0,
            informacion_horario: '',
            listado_usuarios: []
        }

        var ovariables_data = {
            arr_dias_total: [],
            arr_tablero_cabecera: [],
            arr_tablero_detalle: [],
            arr_tablero_contadores: [],
            arr_dias_disponibles: [],
            arr_destino_principal: [],
            arr_direccion_principal: []
        }

        var ovariables = {
            idservicio: 0,
            idtiposervicio:0,

            arr_servicio: [],
            arr_asistente: [],
            arr_cliente: [],
            arr_hora: [],
            arr_tiposervicio: [],
            arr_vehiculo: [],
            arr_destino: [],
            arr_direccion: [],

            cliente_courier_activo: 0,
            destino_courier_activo: 0,
            direccion_courier_activo: 0,

            cliente_reunion_activo: 0,
            destino_reunion_activo: 0,
            direccion_reunion_activo: 0
        }

        function load() {

            let date = new Date()
            ovariables_informacion.fecha = _convertDate(date);

            $("._select2").select2();
            $(".chosen-select").chosen({ width: "100%" });
            /* Fix */
            $(".chosen-container").css("pointer-events", "none");
            $(".chosen-choices").css("background-color", "#eee");
            $(".chosen-choices input").css("height", "28px");

            $('#cbo_solicitud_emergencia_reunion_asistente').chosen().change(function () {
                let asistente = $("#cbo_solicitud_emergencia_reunion_asistente").chosen().val() == null ? "0" : $("#cbo_solicitud_emergencia_reunion_asistente").chosen().val();
                ovariables.arr_asistente = asistente !== '0' ? asistente : [];
            });

            _('btn_return_emergencia').addEventListener('click', fn_return);
            _('btn_save_emergencia').addEventListener('click', fn_save);
            
            $('#cbo_servicio').on('change', req_change_cbo_servicio);
            $('#cbo_solicitud_emergencia_courier_turno').on('change', req_change_turno);
            $('#cbo_solicitud_emergencia_reunion_turno').on('change', req_change_turno);
            $('#cbo_solicitud_emergencia_courier_destino').on('change', req_change_destino);
            $('#cbo_solicitud_emergencia_reunion_destino').on('change', req_change_destino);

            // Visualizar Courier
            _('btn_solicitud_emergencia_courier_cliente_activo').addEventListener('click', fn_visualizar_courier_cliente);
            _('btn_solicitud_emergencia_courier_cliente_inactivo').addEventListener('click', fn_visualizar_courier_cliente);
            _('btn_solicitud_emergencia_courier_destino_activo').addEventListener('click', fn_visualizar_courier_destino);
            _('btn_solicitud_emergencia_courier_destino_inactivo').addEventListener('click', fn_visualizar_courier_destino);
            _('btn_solicitud_emergencia_courier_direccion_activo').addEventListener('click', fn_visualizar_courier_direccion);
            _('btn_solicitud_emergencia_courier_direccion_inactivo').addEventListener('click', fn_visualizar_courier_direccion);

            //Visualizar Reunion
            _('btn_solicitud_emergencia_reunion_cliente_activo').addEventListener('click', fn_visualizar_reunion_cliente);
            _('btn_solicitud_emergencia_reunion_cliente_inactivo').addEventListener('click', fn_visualizar_reunion_cliente);
            _('btn_solicitud_emergencia_reunion_destino_activo').addEventListener('click', fn_visualizar_reunion_destino);
            _('btn_solicitud_emergencia_reunion_destino_inactivo').addEventListener('click', fn_visualizar_reunion_destino);
            _('btn_solicitud_emergencia_reunion_direccion_activo').addEventListener('click', fn_visualizar_reunion_direccion);
            _('btn_solicitud_emergencia_reunion_direccion_inactivo').addEventListener('click', fn_visualizar_reunion_direccion);

        }
        
        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);

            let min = '', max = '', accion_min = true, accion_max = true;
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                cls_two_items = x.classList.contains('_two_items');
                cls_hide = cls_two_items ? x.parentNode.parentNode.classList.contains('hide') : false;

                min = x.getAttribute("data-min");
                max = x.getAttribute("data-max");
                accion_min = false;
                accion_max = false;
                estadoenty = true;

                if (min !== null && min != '') {
                    accion_min = _min(valor, min);
                }

                if (max !== null && max != '') {
                    accion_max = _max(valor, max);
                }

                if (min != null && max != null) {
                    if (!accion_min || !accion_max) {
                        estadoenty = false;
                    }
                } else if (min != null && max == null) {
                    if (!accion_min) {
                        estadoenty = false;
                    }
                } else if (max != null && min == null) {
                    if (!accion_max) {
                        estadoenty = false;
                    }
                }

                if (att) {
                    if ((valor == '') || (valor == '0' && cls_select2 == true)) {
                        if (cls_two_items == true && cls_hide == false) {
                            x.parentNode.parentNode.classList.add('has-error'); resultado = false;
                        }
                        if (cls_two_items == false && cls_hide == false) {
                            x.parentNode.classList.add('has-error'); resultado = false;
                        }
                    }
                    if (!estadoenty) {
                        x.parentNode.classList.add('has-error'); resultado = false;
                    }
                }
            })
            return resultado;
        }

        function clean_required_item() {
            var arr2 = [...document.getElementsByClassName('has-error')]
            arr2.forEach(x => x.classList.remove('has-error'));
        }

        /* Guardar*/
        function fn_save() {
            clean_required_item();
            let req_principal, req_detalle, req_asistente = 1;
            req_principal = required_item({ id: 'pnl_solicitud_emergencia_principal', clase: '_enty' });

            if (req_principal) {

                if (ovariables.idservicio == 1) { req_detalle = required_item({ id: 'pnl_solicitud_emergencia_courier', clase: '_enty' }); }
                else {
                    req_detalle = required_item({ id: 'pnl_solicitud_emergencia_reunion', clase: '_enty' });
                    req_asistente = fn_get_asistente().length;
                    if (req_asistente == 0) { _('div_asistente').classList.add('has-error'); }
                }

                if (req_detalle && req_asistente > 0) {
                    //swal({
                    //    title: "Esta seguro de guardar los datos ingresados?",
                    //    text: "",
                    //    type: "info",
                    //    showCancelButton: true,
                    //    confirmButtonColor: "#1c84c6",
                    //    confirmButtonText: "OK",
                    //    cancelButtonText: "Cancel",
                    //    closeOnConfirm: false
                    //}, function () {
                    //    ovariables.idtiposervicio = _('cbo_solicitud_emergencia_courier_tipo_servicio').value;
                    //    req_emergencia_insert_courier();
                    //});

                    _jquery_confirm('¡Advertencia!', '¿Esta seguro de guardar los datos ingresados?', function () {
                        ovariables.idtiposervicio = _('cbo_solicitud_emergencia_courier_tipo_servicio').value;
                        req_emergencia_insert_courier();
                    });
                }
                else {
                    //swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" });
                    _jquery_alert('¡Advertencia!', 'Debe ingresar los campos requeridos', 'warning');
                }
            }
            else {
                //swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" });
                _jquery_alert('¡Advertencia!', 'Debe ingresar los campos requeridos', 'warning');
            }
        }

        function req_emergencia_insert_courier() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Insert_Courier';
            let ocabecera = '', ocourier = '', oasistente = [];
                       
            ocabecera = _getParameter({ id: 'pnl_solicitud_emergencia_principal', clase: '_enty' });
            ocabecera['idusuario'] = ovariables_informacion.idusuario;
            ocabecera['idusuarioaprobador'] = ovariables_informacion.idusuarioaprobador;
            ocabecera['idtipoenvio'] = ovariables_informacion.idtipoenvio;
            ocabecera['idfecha'] = ovariables_informacion.fecha;

            if (ovariables.idservicio == 1) { ocourier = _getParameter({ id: 'pnl_solicitud_emergencia_courier', clase: '_enty' }); }
            else { ocourier = _getParameter({ id: 'pnl_solicitud_emergencia_reunion', clase: '_enty' }); }
            ocourier['idvehiculo'] = 0;

            oasistente = JSON.stringify(fn_get_asistente());

            form = new FormData();
            form.append('parhead', JSON.stringify(ocabecera));
            form.append('pardetail', JSON.stringify(ocourier));
            form.append('parsubdetail', oasistente);

            Post(urlaccion, form, res_insert);
        }

        function fn_get_asistente() {
            let arr_asistente = ovariables.arr_asistente;
            let arr_resultado = [], obj = {};
            if (arr_asistente.length > 0) {
                arr_asistente.forEach(x=> {
                    obj = {};
                    obj.idasistente = x;
                    arr_resultado.push(obj);
                });
            }
            return arr_resultado;
        }

        function res_insert(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    if (ovariables.idtiposervicio == '1') {
                        //swal({
                        //    title: "Buen Trabajo!",
                        //    text: "Usted ha registrado un nuevo registro correctamente",
                        //    type: "success",
                        //    confirmButtonText: "OK",
                        //    closeOnConfirm: false
                        //}, function () {
                        //    swal({ title: "Atención!", text: "Debe recordar que todo envio solo saldrá de WTS con un Rótulo", type: "success" });
                        //    fn_return();
                        //});

                        _jquery_alert_callback('¡Buen Trabajo!', 'Usted ha registrado un nuevo registro correctamente', 'success', function () {
                            _jquery_alert('¡Atención!', 'Debe recordar que todo envio solo saldrá de WTS con un Rótulo', 'success');
                            fn_return();
                        });
                    }
                    else {
                        //swal({ title: "Buen Trabajo!", text: "Usted ha registrado un nuevo registro correctamente", type: "success" });
                        _jquery_alert('¡Buen Trabajo!', 'Usted ha registrado un nuevo registro correctamente', 'success');
                        fn_return();
                    }
                };
                if (orpta.estado === 'error') {
                    //swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" });
                    _jquery_alert('¡Existe un problema!', 'Debe comunicarse con el administrador TIC', 'error');
                }
            }
        }
        
        /* General */
        function fn_return() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Index',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function fn_load_cbo_total(_iditem, _data) {
            _(_iditem).innerHTML = _data;
            $('#' + _iditem).select2();
        }
        
        function fn_clean_form(oenty) {
            let div_principal = _(oenty.idmain);
            let div_none = oenty.idnone == '' ? '' : _(oenty.idnone);
            let elementos_clase_principal = div_principal.getElementsByClassName(oenty.clasemain);
            let array_principal = Array.prototype.slice.apply(elementos_clase_principal);

            array_principal.forEach(x=> {
                if (x.id !== div_none.id) {
                    let elementos_clase = x.getElementsByClassName(oenty.clase);
                    let array = Array.prototype.slice.apply(elementos_clase);
                    array.forEach(y=> {
                        let id = y.id, class_select2 = y.classList.contains('_select2');
                        if (class_select2) {
                            $('#' + id).select2('val', '');
                            _(id).innerHTML = '';
                        }
                        else { y.value = ''; }
                    });
                }
            });
        }

        /* Informacion */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.informacion_horario = rpta[0].informacion_horario != '' ? JSON.parse(rpta[0].informacion_horario) : '';
                        ovariables_informacion.listado_usuarios = rpta[0].listado_usuarios != '' ? JSON.parse(rpta[0].listado_usuarios) : '';
                    }
                    fn_load_informacion();
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.idusuarioaprobador = informacion_usuario[0].idusuarioaprobador;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;
            _('txt_usuario').value = informacion_usuario[0].usuario;
            _('txt_aprobador').value = informacion_usuario[0].aprobador;
        }

        /* Tablero */
        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Dias?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_dias_total = rpta[0].resultado_dias_total != '' ? JSON.parse(rpta[0].resultado_dias_total) : '';
                        ovariables_data.arr_tablero_cabecera = rpta[0].tablero_cabecera != '' ? JSON.parse(rpta[0].tablero_cabecera) : '';
                        ovariables_data.arr_tablero_detalle = rpta[0].tablero_detalle != '' ? JSON.parse(rpta[0].tablero_detalle) : '';
                        ovariables_data.arr_tablero_contadores = rpta[0].tablero_contadores != '' ? JSON.parse(rpta[0].tablero_contadores) : '';
                        ovariables_data.arr_dias_disponibles = rpta[0].resultado_dias_disponibles != '' ? JSON.parse(rpta[0].resultado_dias_disponibles) : '';
                        ovariables_data.arr_destino_principal = rpta[0].destinoprincipal != '' ? JSON.parse(rpta[0].destinoprincipal) : '';
                        ovariables_data.arr_direccion_principal = rpta[0].direccionprincipal != '' ? JSON.parse(rpta[0].direccionprincipal) : '';
                    }
                    //fn_load_tablero();
                    //fn_load_dias_disponibles();
                    req_load_servicio();
                }, (p) => { err(p); });
        }

        function fn_load_tablero() {
            let arr_tablero_cabecera = ovariables_data.arr_tablero_cabecera,
                arr_tablero_detalle = ovariables_data.arr_tablero_detalle;
            let html = '', htmlheader = '', htmlbody = '';

            if (arr_tablero_cabecera.length > 0) {
                html = `<table id='tablero_principal' class='stripe row-border order-column _tablero_principal' style='width: 100%; max-width: 100%;  padding-right: 0px;'>
                                <thead><tr><th class ='text-center'>Fecha</th>`;

                arr_tablero_cabecera.forEach(x=> {
                    let turno = 'Turno - ' + x.turno;
                    htmlheader += `<th class='text-center'>${turno}</th>`;
                });

                html += htmlheader + `</tr></thead><tbody>`;

                let row = 0;
                arr_tablero_detalle.forEach(x=> {
                    row++;
                    let fecha = x.dia + ' - ' + x.formatofechapresentacion;
                    let td_id = x.turno1 + '_' + row;
                    let td1_value = x.turno1 == 'Closed' ? 'Cerrado' : x.turno1;
                    let td2_value = x.turno2 == 'Closed' ? 'Cerrado' : x.turno2;
                    let class_text1 = x.turno1 == 'Closed' ? 'font-bold' : '';
                    let class_text2 = x.turno2 == 'Closed' ? 'font-bold' : '';

                    htmlbody += `
                    <tr>
                        <td class ='text-center font-bold'>${fecha}</td>
                        <td id='${td_id}_1' data-par='${x.turno1}' class ='text-center  _item_counters ${class_text1}'>${td1_value}</td>
                        <td id='${td_id}_2' data-par='${x.turno2}' class ='text-center  _item_counters ${class_text2}'>${td2_value}</td>
                    </tr>
                        `;
                });

                html += htmlbody + `</tbody></table>`;
                _('tablero_principal').innerHTML = html;

                fn_load_item_counters('tablero_principal');
            }
        }

        function fn_load_item_counters(_id_div_tablero_principal) {
            let _arr_tablero_contadores = ovariables_data.arr_tablero_contadores;
            let idtablero_principal = _(_id_div_tablero_principal);

            if (idtablero_principal != null) {

                let fecha_actual = new Date();
                let hora_actual = fecha_actual.getHours(),
                    minuto_actual = fecha_actual.getMinutes(),
                    segundo_actual = fecha_actual.getSeconds();

                let arr_item_counters = Array.from(idtablero_principal.getElementsByClassName('_item_counters'));
                let arr_item_counters_filter = arr_item_counters.filter(m=> m.getAttribute('data-par') !== 'Closed' && m.getAttribute('data-par') !== '-');

                arr_item_counters_filter.forEach(x=> {
                    let id_item = x.id;
                    let resultado = _arr_tablero_contadores.filter(m=>m.horafaltante === x.getAttribute('data-par'));

                    if (resultado.length > 0) {
                        let horas = resultado[0].horas;
                        let minutos = resultado[0].minutos;
                        let segundos = resultado[0].segundos;

                        let horas_total = ((horas - 1) - Math.floor(hora_actual)) < 10 ? '0' + ((horas - 1) - Math.floor(hora_actual)) : ((horas - 1) - Math.floor(hora_actual));
                        let minutos_total = (minutos - Math.floor(minuto_actual)) < 10 ? '0' + (minutos - Math.floor(minuto_actual)) : (minutos - Math.floor(minuto_actual));
                        let segundos_total = (segundos - Math.floor(segundo_actual)) < 10 ? '0' + (segundos - Math.floor(segundo_actual)) : (segundos - Math.floor(segundo_actual));

                        let horas_resultado = horas_total + 'h : ' + minutos_total + 'm : ' + segundos_total + 'ss';

                        var existe_item = fn_validar_item(id_item);
                        if (existe_item) {
                            _(id_item).innerText = horas_resultado;
                        } else { clearTimeout(fn_load_item_counters); }
                    }
                });

                setTimeout(function () { fn_load_item_counters(_id_div_tablero_principal); }, 1000);
            }
        }
        
        /* Data */     

        // Servicio
        function req_load_servicio() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio, dia_programado: ovariables_informacion.fecha };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Servicio?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_servicio = rpta[0].servicio != '' ? JSON.parse(rpta[0].servicio) : '';
                        ovariables.arr_cliente = rpta[0].cliente != '' ? JSON.parse(rpta[0].cliente) : '';
                    }
                    else { ovariables.arr_servicio = []; ovariables.arr_cliente = []; }
                    fn_load_servicio();
                }, (p) => { err(p); });
        }

        function fn_load_servicio() {
            let arr_servicio = ovariables.arr_servicio,
                cbo_servicio = `<option value='0'>Seleccione un Servicio</option>`;
            if (arr_servicio.length > 0) { arr_servicio.forEach(x=> { cbo_servicio += `<option value='${x.idservicio}'>${x.servicio}</option>`; }); }

            fn_load_cbo_total('cbo_servicio', cbo_servicio);
            req_change_cbo_servicio();
        }

        function req_change_cbo_servicio() {
            ovariables.idservicio = _('cbo_servicio').value;

            // Courier
            clean_courier_item_activo();

            // Reunion
            clean_reunion_item_activo();

            if (ovariables.idservicio == 1) {

                fn_clean_form({ idmain: 'pnl_solicitud_emergencia_body', clasemain: '_enty_main', idnone: 'pnl_solicitud_emergencia_courier', clase: '_enty' });
                req_load_tipo_servicio('cbo_solicitud_emergencia_courier_tipo_servicio');
                fn_load_turno('cbo_solicitud_emergencia_courier_turno');
                fn_load_cliente('cbo_solicitud_emergencia_courier_cliente');
                req_load_destino('cbo_solicitud_emergencia_courier_destino');
                fn_load_asistente(0);
                
                _('pnl_solicitud_emergencia_courier').classList.remove('hide');
                _('pnl_solicitud_emergencia_reunion').classList.add('hide');
            }
            else if (ovariables.idservicio == 2) {
                fn_clean_form({ idmain: 'pnl_solicitud_emergencia_body', clasemain: '_enty_main', idnone: 'pnl_solicitud_emergencia_reunion', clase: '_enty' });
                req_load_tipo_servicio('cbo_solicitud_emergencia_reunion_tipo_servicio');
                fn_load_turno('cbo_solicitud_emergencia_reunion_turno');
                fn_load_cliente('cbo_solicitud_emergencia_reunion_cliente');
                req_load_destino('cbo_solicitud_emergencia_reunion_destino');
                fn_load_asistente(2);

                _('pnl_solicitud_emergencia_courier').classList.add('hide');
                _('pnl_solicitud_emergencia_reunion').classList.remove('hide');
            }
            else {
                fn_clean_form({ idmain: 'pnl_solicitud_emergencia_body', clasemain: '_enty_main', idnone: '', clase: '_enty' });
                req_load_tipo_servicio('');               
                fn_load_turno('');
                fn_load_cliente('');
                req_load_destino('cbo_solicitud_emergencia_reunion_destino');
                fn_load_asistente(0);

                _('pnl_solicitud_emergencia_courier').classList.add('hide');
                _('pnl_solicitud_emergencia_reunion').classList.add('hide');
            }
        }

        //Cliente
        function fn_load_cliente(_iditem) {
            let arr_cliente = ovariables.arr_cliente,
             cbo_cliente = `<option value='0'>Seleccione un Cliente</option>`;

            if (arr_cliente.length > 0) { arr_cliente.forEach(x=> { cbo_cliente += `<option value='${x.idcliente}'>${x.cliente}</option>`; }) }

            if (_iditem !== '') { fn_load_cbo_total(_iditem, cbo_cliente); }
        }

        // Tipo Servicio
        function req_load_tipo_servicio(_iditem) {
            let err = function (__err) { console.log('err', __err) };
            if (_iditem !== '') {
                let idservicio = _('cbo_servicio').value;
                let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio, dia_programado: ovariables_informacion.fecha, idservicio: idservicio };
                let urlaccion = 'CourierService/SolicitudEmergencia/Get_TipoServicio?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                    .then((response) => {
                        let rpta = response !== '' ? JSON.parse(response) : null;
                        if (rpta !== null) { ovariables.arr_tiposervicio = rpta[0].tiposervicio != '' ? JSON.parse(rpta[0].tiposervicio) : ''; }
                        else { ovariables.arr_tiposervicio = []; }
                        fn_load_tipo_servicio(_iditem);
                    }, (p) => { err(p); });
            }
        }

        function fn_load_tipo_servicio(_iditem) {
            let arr_tiposervicio = ovariables.arr_tiposervicio,
              cbo_tiposervicio = `<option value='0'>Seleccion un Tipo de Servicio</option>`;

            if (arr_tiposervicio.length > 0) { arr_tiposervicio.forEach(x=> { cbo_tiposervicio += `<option value='${x.idtiposervicio}'>${x.tiposervicio}</option>`; }); }

            if (_iditem !== '') { fn_load_cbo_total(_iditem, cbo_tiposervicio); }
        }
        
        // Turno
        function fn_load_turno(_iditem) {
            let cbo_turno = `<option value='0'>Selecciona un Turno</option>`,
            resultado = [];

            if (ovariables_data.arr_dias_total != '') { resultado = ovariables_data.arr_dias_total.filter(x=>x.fecha.toString() === ovariables_informacion.fecha && x.estado === 'Open'); }

            if (resultado.length > 0) { resultado.forEach(x=> { cbo_turno += `<option value='${x.idturno}'>${x.turno}</option>`; }); }

            if (_iditem !== '') { fn_load_cbo_total(_iditem, cbo_turno); }
        }

        function req_change_turno(e) {
            let _iditem = e.currentTarget;
            let idmain = _iditem.id, iditem = '';
            if (ovariables.idservicio == 1) { iditem = 'cbo_solicitud_emergencia_courier_hora'; }
            else if (ovariables.idservicio == 2) { iditem = 'cbo_solicitud_emergencia_reunion_hora'; }
            req_load_hora(idmain, iditem);
        }

        // Hora
        function req_load_hora(_idmain, _iditem) {
            let err = function (__err) { console.log('err', __err) };
            if (_iditem !== '') {
                let idturno = _(_idmain).value;
                let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio, idservicio: ovariables.idservicio, idtiposervicio: 0, idturno: idturno };
                let urlaccion = 'CourierService/SolicitudEmergencia/Get_Hora?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                   .then((response) => {
                       let rpta = response !== '' ? JSON.parse(response) : null;
                       if (rpta !== null) { ovariables.arr_hora = rpta[0].hora != '' ? JSON.parse(rpta[0].hora) : ''; }
                       else { ovariables.arr_hora = []; }
                       fn_load_hora(_iditem);
                   }, (p) => { err(p); });
            } else { fn_load_hora(_iditem); }
        }

        function fn_load_hora(_iditem) {
            let arr_hora = ovariables.arr_hora,
               cbo_hora = `<option value='0'>Seleccione una Hora</option>`;

            if (arr_hora.length > 0) { arr_hora.forEach(x=> { cbo_hora += `<option value='${x.idhora}'>${x.hora}</option>`; }); }

            if (_iditem !== '') { fn_load_cbo_total(_iditem, cbo_hora); }
        }
        
        // Destino
        function req_load_destino(_iditem) {
            let err = function (__err) { console.log('err', __err) };
            if (_iditem !== '') {
                
                let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio, dia_programado: ovariables_informacion.fecha, idvehiculo: 0 };
                let urlaccion = 'CourierService/SolicitudEmergencia/Get_Destino?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                    .then((response) => {
                        let rpta = response !== '' ? JSON.parse(response) : null;
                        if (rpta !== null) { ovariables.arr_destino = rpta[0].destinos != '' ? JSON.parse(rpta[0].destinos) : ''; }
                        else { ovariables.arr_destino = []; }
                        fn_load_destino(_iditem);
                    }, (p) => { err(p); });
            } else { fn_load_destino(_iditem); }


        }

        function fn_load_destino(_iditem) {
            let arr_destino = ovariables.arr_destino,
             cbo_destino = `<option value='0'>Seleccione un Destino</option>`;

            if (arr_destino.length > 0) { arr_destino.forEach(x=> { cbo_destino += `<option value='${x.iddestino}'>${x.destino}</option>`; }); }

            if (_iditem !== '') {
                fn_load_cbo_total(_iditem, cbo_destino);
                $('#' + _iditem).trigger("change")
            }

        }

        function req_change_destino(e) {
            let _iditem = e.currentTarget;
            let idmain = _iditem.id, iditem = '';
            if (ovariables.idservicio == 1) { iditem = 'cbo_solicitud_emergencia_courier_direccion'; }
            else if (ovariables.idservicio == 2) { iditem = 'cbo_solicitud_emergencia_reunion_direccion'; }

            req_load_direccion(idmain, iditem);
        }

        // Direccion
        function req_load_direccion(_idmain, _iditem) {
            let err = function (__err) { console.log('err', __err) };
            if (_iditem !== '') {
                let iddestino = _(_idmain).value;
                let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio, dia_programado: ovariables_informacion.fecha, idvehiculo: 0, iddestino: iddestino };
                let urlaccion = 'CourierService/SolicitudEmergencia/Get_Direccion?par=' + JSON.stringify(parametro);
                _Get(urlaccion)
                    .then((response) => {
                        let rpta = response !== '' ? JSON.parse(response) : null;
                        if (rpta !== null) { ovariables.arr_direccion = rpta[0].direccion != '' ? JSON.parse(rpta[0].direccion) : ''; }
                        else { ovariables.arr_direccion = []; }
                        fn_load_direccion(_iditem);
                    }, (p) => { err(p); });
            } else { fn_load_direccion(_iditem); }
        }

        function fn_load_direccion(_iditem) {
            let arr_direccion = ovariables.arr_direccion,
                cbo_direccion = `<option value='0'>Seleccione una Dirección</option>`;

            if (arr_direccion.length > 0) { arr_direccion.forEach(x=> { cbo_direccion += `<option value='${x.iddestinodireccion}'>${x.direccion}</option>`; }); }

            if (_iditem !== '') { fn_load_cbo_total(_iditem, cbo_direccion); }
        }

        // Asistentes
        function fn_load_asistente(_id) {
            let arr_asistente = ovariables_informacion.listado_usuarios,
                cbo_asistente = '';
            let resultado = arr_asistente.filter(x=>x.idpersonal !== 0);

            if (resultado.length > 0) {
                resultado.forEach(x=> { cbo_asistente += `<option value='${x.idusuario}'>${x.usuarioresumen}</option>`; });
            }

            if (_id == 2) {
                $(".chosen-container").css("pointer-events", "");
                $(".chosen-choices").css("background-color", "");
            } else {
                $(".chosen-container").css("pointer-events", "none");
                $(".chosen-choices").css("background-color", "#eee");
            }

            _('cbo_solicitud_emergencia_reunion_asistente').innerHTML = cbo_asistente;
            $(".chosen-select").trigger('chosen:updated');

        }

        // Courier
        function fn_visualizar_courier_cliente() {
            ovariables.cliente_courier_activo = ovariables.cliente_courier_activo === 0 ? 1 : 0;
            if (ovariables.cliente_courier_activo == 0) {
                _('div_cbo_solicitud_emergencia_courier_cliente').classList.remove('hide');
                _('txt_solicitud_emergencia_courier_cliente').value = '';
                _('div_txt_solicitud_emergencia_courier_cliente').classList.add('hide');
            }
            else {
                $('#cbo_solicitud_emergencia_courier_cliente').select2('val', '0');
                _('div_cbo_solicitud_emergencia_courier_cliente').classList.add('hide');
                _('div_txt_solicitud_emergencia_courier_cliente').classList.remove('hide');
            }
        }

        function fn_visualizar_courier_destino() {
            ovariables.destino_courier_activo = ovariables.destino_courier_activo === 0 ? 1 : 0;
            if (ovariables.destino_courier_activo == 0) {
                _('div_cbo_solicitud_emergencia_courier_destino').classList.remove('hide');
                _('div_cbo_solicitud_emergencia_courier_direccion').classList.remove('hide');

                _('txt_solicitud_emergencia_courier_destino').value = '';
                _('txt_solicitud_emergencia_courier_direccion').value = '';

                _('div_txt_solicitud_emergencia_courier_destino').classList.add('hide');
                _('div_txt_solicitud_emergencia_courier_direccion').classList.add('hide');
            }
            else {

                $('#cbo_solicitud_emergencia_courier_destino').select2('val', '0');
                $('#cbo_solicitud_emergencia_courier_direccion').select2('val', '0');

                _('div_cbo_solicitud_emergencia_courier_destino').classList.add('hide');
                _('div_cbo_solicitud_emergencia_courier_direccion').classList.add('hide');

                _('div_txt_solicitud_emergencia_courier_destino').classList.remove('hide');
                _('div_txt_solicitud_emergencia_courier_direccion').classList.remove('hide');
            }
        }

        function fn_visualizar_courier_direccion() {
            if (ovariables.destino_courier_activo == 0) {
                ovariables.direccion_courier_activo = ovariables.direccion_courier_activo === 0 ? 1 : 0;
                if (ovariables.direccion_courier_activo == 0) {
                    _('div_cbo_solicitud_emergencia_courier_direccion').classList.remove('hide');
                    _('txt_solicitud_emergencia_courier_direccion').value = '';
                    _('div_txt_solicitud_emergencia_courier_direccion').classList.add('hide');
                }
                else {
                    $('#cbo_solicitud_emergencia_courier_direccion').select2('val', '0');
                    _('div_cbo_solicitud_emergencia_courier_direccion').classList.add('hide');
                    _('div_txt_solicitud_emergencia_courier_direccion').classList.remove('hide');
                }
            }
        }

        function clean_courier_item_activo() {
            ovariables.cliente_courier_activo = 0;
            ovariables.destino_courier_activo = 0;
            ovariables.direccion_courier_activo = 0;
            _('div_cbo_solicitud_emergencia_courier_cliente').classList.remove('hide');
            _('div_txt_solicitud_emergencia_courier_cliente').classList.add('hide');
            _('div_cbo_solicitud_emergencia_courier_destino').classList.remove('hide');
            _('div_txt_solicitud_emergencia_courier_destino').classList.add('hide');
            _('div_cbo_solicitud_emergencia_courier_direccion').classList.remove('hide');
            _('div_txt_solicitud_emergencia_courier_direccion').classList.add('hide');
        }

        // Reunion
        function fn_visualizar_reunion_cliente() {
            ovariables.cliente_reunion_activo = ovariables.cliente_reunion_activo === 0 ? 1 : 0;
            if (ovariables.cliente_reunion_activo == 0) {
                _('div_cbo_solicitud_emergencia_reunion_cliente').classList.remove('hide');
                _('txt_solicitud_emergencia_reunion_cliente').value = '';
                _('div_txt_solicitud_emergencia_reunion_cliente').classList.add('hide');
            }
            else {
                $('#cbo_solicitud_emergencia_reunion_cliente').select2('val', '0');
                _('div_cbo_solicitud_emergencia_reunion_cliente').classList.add('hide');
                _('div_txt_solicitud_emergencia_reunion_cliente').classList.remove('hide');
            }
        }

        function fn_visualizar_reunion_destino() {
            ovariables.destino_reunion_activo = ovariables.destino_reunion_activo === 0 ? 1 : 0;
            if (ovariables.destino_reunion_activo == 0) {
                _('div_cbo_solicitud_emergencia_reunion_destino').classList.remove('hide');
                _('div_cbo_solicitud_emergencia_reunion_direccion').classList.remove('hide');

                _('txt_solicitud_emergencia_reunion_destino').value = '';
                _('txt_solicitud_emergencia_reunion_direccion').value = '';

                _('div_txt_solicitud_emergencia_reunion_destino').classList.add('hide');
                _('div_txt_solicitud_emergencia_reunion_direccion').classList.add('hide');
            }
            else {

                $('#cbo_solicitud_emergencia_reunion_destino').select2('val', '0');
                $('#cbo_solicitud_emergencia_reunion_direccion').select2('val', '0');

                _('div_cbo_solicitud_emergencia_reunion_destino').classList.add('hide');
                _('div_cbo_solicitud_emergencia_reunion_direccion').classList.add('hide');

                _('div_txt_solicitud_emergencia_reunion_destino').classList.remove('hide');
                _('div_txt_solicitud_emergencia_reunion_direccion').classList.remove('hide');
            }
        }

        function fn_visualizar_reunion_direccion() {
            if (ovariables.destino_reunion_activo == 0) {
                ovariables.direccion_reunion_activo = ovariables.direccion_reunion_activo === 0 ? 1 : 0;
                if (ovariables.direccion_reunion_activo == 0) {
                    _('div_cbo_solicitud_emergencia_reunion_direccion').classList.remove('hide');
                    _('txt_solicitud_emergencia_reunion_direccion').value = '';
                    _('div_txt_solicitud_emergencia_reunion_direccion').classList.add('hide');
                }
                else {
                    $('#cbo_solicitud_emergencia_reunion_direccion').select2('val', '0');
                    _('div_cbo_solicitud_emergencia_reunion_direccion').classList.add('hide');
                    _('div_txt_solicitud_emergencia_reunion_direccion').classList.remove('hide');
                }
            }
        }

        function clean_reunion_item_activo() {
            ovariables.cliente_reunion_activo = 0;
            ovariables.destino_reunion_activo = 0;
            ovariables.direccion_reunion_activo = 0;
            _('div_cbo_solicitud_emergencia_reunion_cliente').classList.remove('hide');
            _('div_txt_solicitud_emergencia_reunion_cliente').classList.add('hide');
            _('div_cbo_solicitud_emergencia_reunion_destino').classList.remove('hide');
            _('div_txt_solicitud_emergencia_reunion_destino').classList.add('hide');
            _('div_cbo_solicitud_emergencia_reunion_direccion').classList.remove('hide');
            _('div_txt_solicitud_emergencia_reunion_direccion').classList.add('hide');
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_solicitud_emergencia_new');


(function ini() {
    app_solicitud_emergencia_New.load();
    app_solicitud_emergencia_New.req_ini();
})();
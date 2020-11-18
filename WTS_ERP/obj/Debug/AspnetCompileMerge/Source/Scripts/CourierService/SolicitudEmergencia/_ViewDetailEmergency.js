var app_Solicitud_Emergencia_Detalle = (
    function (d, idpadre) {

        var ovariables_informacion = {
            idtipoenvio: 0,
            idsolicitud: 0,
            informacion_usuario: '',
            idusuario: '',
            nivel: 0
        }

        var ovariables_data = {
            solicitud: '',
            arr_asistente: [],
            detalle: [],
            arr_historial: [],
            arr_vehiculo: [],
            codigoestado: ''
        }

        function load() {
            let par = _('txtpar_solicitud_emergencia_detalle').value;
            if (!_isEmpty(par)) {
                ovariables_informacion.idsolicitud = _par(par, 'idsolicitud');
            }

            _('btn_visualizar_programar_solicitud_emergencia').addEventListener('click', fn_view_programar_solicitud_emergencia);
            _('btn_visualizar_agregar_costo_solicitud_emergencia').addEventListener('click', fn_view_agregar_costo_solicitud_emergencia);
            _('btn_visualizar_cancelar_solicitud_emergencia').addEventListener('click', fn_view_cancelar_solicitud_emergencia);
            _('btn_visualizar_terminar_solicitud_emergencia').addEventListener('click', fn_view_terminar_solicitud_emergencia);

            $('._retroceder_botones_detalle_solicitud_emergencia').click(function () { fn_view_botones_detalle_solicitud_emergencia(); });

            _('btn_programar_solicitud_emergencia').addEventListener('click', req_programar_solicitud_emergencia);
            _('btn_agregar_costo_solicitud_emergencia').addEventListener('click', req_agregar_costo_solicitud_emergencia);
            _('btn_cancelar_solicitud_emergencia').addEventListener('click', req_cancelar_solicitud_emergencia);
            _('btn_terminar_solicitud_emergencia').addEventListener('click', req_terminar_solicitud_emergencia);

            _('btn_print_solicitud_emergencia').addEventListener('click', req_imprimir_solicitud_emergencia);

        }

        function req_imprimir_solicitud_emergencia() {
            let urlaccion = urlBase() + `CourierService/Solicitud/Print_Solicitud?par=${JSON.stringify({ idsolicitud: ovariables_informacion.idsolicitud })}`;
            _getFile_emergencia(urlaccion, 100);
        }

        function _getFile_emergencia(_urlaccion, tiempo) {
            tiempo = tiempo || 100;
            _promise(tiempo)
            .then(() => {
                var link = document.createElement('a');
                link.href = _urlaccion;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                delete link;
            })
        }

        /*Informacion*/
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                    }
                    fn_load_informacion();
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;
        }
        
        /* Data */
        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idsolicitud: ovariables_informacion.idsolicitud };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Detalle?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : '';
                        ovariables_data.arr_asistente = rpta[0].asistente != '' ? JSON.parse(rpta[0].asistente) : [];
                        ovariables_data.detalle = rpta[0].detalle != '' ? JSON.parse(rpta[0].detalle) : '';
                        ovariables_data.arr_historial = rpta[0].historial != '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables_data.arr_vehiculo = rpta[0].vehiculo != '' ? JSON.parse(rpta[0].vehiculo) : [];
                    }
                    fn_load_item();
                    fn_load_solicitud();
                    fn_load_asistente();
                    fn_load_detalle();
                    fn_load_historial();
                    //fn_load_detalle();
                    //fn_load_historial();
                }, (p) => { err(p); });
        }

        function fn_load_item() {
            let programacion = ovariables_data.solicitud;
            ovariables_data.codigoestado = programacion[0].codigoestado;
            let vehiculo_solicitud = programacion[0].idvehiculo;
            let idtipoenvio = programacion[0].idtipoenvio;

            if (ovariables_informacion.nivel == 1 || ovariables_informacion.nivel == 2) {

                if (ovariables_data.codigoestado == 'CRE') {
                    _('btn_visualizar_programar_solicitud_emergencia').classList.remove('hide');
                    _('btn_print_solicitud_emergencia').classList.remove('hide');
                }
                if (ovariables_data.codigoestado == 'PEN') {
                    _('btn_visualizar_programar_solicitud_emergencia').classList.remove('hide');
                    _('btn_visualizar_cancelar_solicitud_emergencia').classList.remove('hide');
                    _('btn_visualizar_terminar_solicitud_emergencia').classList.remove('hide');
                    _('btn_print_solicitud_emergencia').classList.remove('hide');
                }

                if (vehiculo_solicitud == 5 || vehiculo_solicitud == 6) {
                    if (ovariables_data.codigoestado == 'PEN') {
                        _('btn_visualizar_agregar_costo_solicitud_emergencia').classList.remove('hide');
                      }

                    if (ovariables_data.codigoestado == 'TER') {
                        _('btn_visualizar_agregar_costo_solicitud_emergencia').classList.remove('hide');
                    }                    
                }
            }
            else {
                //if (idtipoenvio = 3) {
                    if (ovariables_informacion.idusuario === programacion[0].idusuario) {
                        if (ovariables_data.codigoestado == 'CRE' && programacion[0].idtiposervicio == 1) {
                            _('btn_print_solicitud_emergencia').classList.remove('hide');
                        }
                        if (ovariables_data.codigoestado == 'PEN' && programacion[0].idtiposervicio == 1) {
                            _('btn_print_solicitud_emergencia').classList.remove('hide');
                        }
                    }
                //}
            }
        }

        function fn_load_solicitud() {
            let programacion = ovariables_data.solicitud;

            _('txt_solicitud_emergencia_usuario').value = programacion[0].usuario;
            _('txt_solicitud_emergencia_usuarioaprobador').value = programacion[0].usuarioaprobador;
            _('txt_solicitud_emergencia_fecha').value = programacion[0].fecha;
            _('txt_solicitud_emergencia_servicio').value = programacion[0].tiposervicio;
            _('txt_solicitud_emergencia_turno').value = programacion[0].turno;
            _('txt_solicitud_emergencia_hora').value = programacion[0].hora;
            _('txt_solicitud_emergencia_vehiculo').value = programacion[0].vehiculo;
            _('txt_solicitud_emergencia_costo').value = programacion[0].costo;
            _('txt_solicitud_emergencia_cliente').value = programacion[0].cliente;
            _('txt_solicitud_emergencia_destino').value = programacion[0].destino;
            _('txt_solicitud_emergencia_direccion').value = programacion[0].direccion;
            _('txt_solicitud_emergencia_contacto').value = programacion[0].contacto;
            _('txt_solicitud_emergencia_numero_contacto').value = programacion[0].numerocontacto;
            _('txt_solicitud_emergencia_motivo').value = programacion[0].motivo;
        }

        function fn_load_asistente() {
            if (ovariables_data.arr_asistente.length > 0) {
                let txt_asistente = '';
                ovariables_data.arr_asistente.forEach(x=> { txt_asistente += `${x.asistente}` + ' - '; });

                _('txt_solicitud_emergencia_asistente').value = txt_asistente.slice(0, -3);
                _('div_row_solicitud_emergencia_asistente').classList.remove('hide');
            }
        }

        function fn_load_detalle() {
            if (ovariables_data.codigoestado == 'TER') {

                _('li_detalle_solicitud_emergencia').classList.remove('hide');

                if (ovariables_data.detalle != '') {
                    let detalle = ovariables_data.detalle;
                    _('txt_solicitud_emergencia_usuario_terminado').value = detalle[0].usuario;
                    _('txt_solicitud_emergencia_hora_terminado').value = detalle[0].hora;
                    _('txt_solicitud_emergencia_observacion_terminado').value = detalle[0].observacion;
                    _('txt_solicitud_emergencia_nombre_terminado').value = detalle[0].nombrereceptorr;
                    _('txt_solicitud_emergencia_dni_terminado').value = detalle[0].dnireceptor;
                    _('txt_solicitud_emergencia_tiempo_espera_terminado').value = detalle[0].tiempoespera;
                }
            }
        }

        function fn_load_historial() {
            let arr_historial = ovariables_data.arr_historial;
            if (arr_historial.length > 0) {
                let html_body = '';
                arr_historial.forEach(x=> {
                    html_body += `
                        <tr>
                            <td class ='input-sm m-b-xs'>${x.fecha}</td>
                            <td class ='input-sm m-b-xs'>${x.hora}</td>
                            <td class ='input-sm m-b-xs'>${x.estado}</td>
                            <td class ='input-sm m-b-xs'>${x.accion}</td>
                            <td class ='input-sm m-b-xs'>${x.usuario}</td>
                            <td class ='input-sm m-b-xs'>${x.observacion}</td>
                        <tr>
                        `;
                });

                _('tbl_historial_solicitud_emergencia').tBodies[0].innerHTML = html_body;
            }
        }

        function fn_load_vehiculo() {
            let programacion = ovariables_data.solicitud,
                arr_vehiculo = ovariables_data.arr_vehiculo,
                cbo_vehiculo = `<option value='0'>Seleccione una Movilidad</option>`;

            arr_vehiculo.forEach(x=> { cbo_vehiculo += `<option value='${x.idvehiculo}'>${x.vehiculo}</option>`; });

            _('cbo_vehiculo_solicitud_emergencia').innerHTML = cbo_vehiculo;
            _('cbo_vehiculo_solicitud_emergencia').value = programacion[0].idvehiculo;
            $('#cbo_vehiculo_solicitud_emergencia').select2();
        }

        /* Cancelar Solicitud */
        function fn_view_cancelar_solicitud_emergencia() {
            _('div_cancelar_solicitud_emergencia').classList.remove('hide');
            _('div_botones_detalle_solicitud_emergencia').classList.add('hide');
        }

        function req_cancelar_solicitud_emergencia() {
            let req = required_item({ id: 'div_cancelar_solicitud_emergencia', clase: '_enty' });
            if (req) {
                swal({
                    title: "Información",
                    text: "Esta seguro de cancelar esta solicitud?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_save_cancelar_solicitud_emergencia();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar un motivo para poder cancelar la solicitud", type: "warning" }); }
        }

        function fn_save_cancelar_solicitud_emergencia() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Cancel_Solicitud',
               motivo = _('txt_motivo_cancelar_solicitud_emergencia').value;
            let par = { idsolicitud: ovariables_informacion.idsolicitud, motivo: motivo };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_cancelar_solicitud_emergencia);
        }

        function res_save_cancelar_solicitud_emergencia(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_ViewDetail').modal('hide');
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Programar */
        function fn_view_programar_solicitud_emergencia() {
            fn_load_vehiculo();
            _('div_programar_solicitud_emergencia').classList.remove('hide');
            _('div_botones_detalle_solicitud_emergencia').classList.add('hide');
        }

        function req_programar_solicitud_emergencia() {
            //let req = required_item({ id: 'div_programar_solicitud_emergencia', clase: '_enty' });
            //if (req) {
                swal({
                    title: "Información",
                    text: "Esta seguro de programar esta movilidad a esta solicitud?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_save_programar_solicitud_emergencia();
                });
            //}
            //else { swal({ title: "Advertencia!!", text: "Debe ingresar un motivo para poder cancelar la solicitud", type: "warning" }); }
        }

        function fn_save_programar_solicitud_emergencia() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Program_Solicitud',
               idvehiculo = _('cbo_vehiculo_solicitud_emergencia').value;
            let par = { idsolicitud: ovariables_informacion.idsolicitud, idvehiculo: idvehiculo };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_programar_solicitud_emergencia);
        }

        function res_save_programar_solicitud_emergencia(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Agregar Costo */
        function fn_view_agregar_costo_solicitud_emergencia() {
            let programacion = ovariables_data.solicitud;
            _('txt_costo_solicitud_emergencia').value = programacion[0].costo;
            _('div_agregar_costo_solicitud_emergencia').classList.remove('hide');
            _('div_botones_detalle_solicitud_emergencia').classList.add('hide');
        }

        function req_agregar_costo_solicitud_emergencia() {
            let req = required_item({ id: 'div_agregar_costo_solicitud_emergencia', clase: '_enty' });
            if (req) {
                swal({
                    title: "Información",
                    text: "Esta seguro de agregar este costo a esta solicitud?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_save_agregar_costo_solicitud_emergencia();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar un motivo para poder cancelar la solicitud", type: "warning" }); }
        }

        function fn_save_agregar_costo_solicitud_emergencia() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Add_Costo',
               costo = _('txt_costo_solicitud_emergencia').value;
            let par = { idsolicitud: ovariables_informacion.idsolicitud, costo: costo };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_agregar_costo);
        }

        function res_save_agregar_costo(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Terminar Solicitud */
        function fn_view_terminar_solicitud_emergencia() {
            let programacion = ovariables_data.solicitud;
            _('txt_costo_terminar_solicitud_emergencia').value = programacion[0].costo;
            _('div_terminar_solicitud_observacion_solicitud_emergencia').classList.remove('hide');
            _('div_terminar_solicitud_campos_solicitud_emergencia').classList.remove('hide');
            _('div_terminar_solicitud_emergencia').classList.remove('hide');
            _('div_botones_detalle_solicitud_emergencia').classList.add('hide');
        }

        function req_terminar_solicitud_emergencia() {
            let req_observation = required_item({ id: 'div_terminar_solicitud_observacion_solicitud_emergencia', clase: '_enty' });
            let req_detalle = required_item({ id: 'div_terminar_solicitud_campos_solicitud_emergencia', clase: '_enty' });
            if (req_observation && req_detalle)
                swal({
                    title: "Información",
                    text: "Esta seguro de terminar la solicitud?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_save_terminar_solicitud_emergencia();
                });
            else { swal({ title: "Advertencia!!", text: "Debe ingresar estos campos requeridos para poder terminar la solicitud", type: "warning" }); }
        }

        function fn_save_terminar_solicitud_emergencia() {
            let urlaccion = 'CourierService/SolicitudEmergencia/Finish_Solicitud';
            let observacion = _('txt_observacion_terminar_solicitud_emergencia').value,
                nombre = _('txt_nombre_terminar_solicitud_emergencia').value,
                dni = _('txt_dni_terminar_solicitud_emergencia').value,
                costo = _('txt_costo_terminar_solicitud_emergencia').value
            tiempoespera = _('txt_tiempo_espera_terminar_solicitud_emergencia').value;
            let par = { idsolicitud: ovariables_informacion.idsolicitud, observacion: observacion, nombre: nombre, dni: dni, costo: costo, tiempoespera: tiempoespera };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_terminar_solicitud_emergencia);
        }

        function res_save_terminar_solicitud_emergencia(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }


        /* Funcion General */
        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = cls_select2 ? x.parentNode : x.parentNode;
                if (att) {
                    if ((valor == '') || (valor == '0' && cls_select2 == true))
                    { padre.classList.add('has-error'); resultado = false; }
                    else { padre.classList.remove('has-error'); }
                }
            })
            return resultado;
        }

        function fn_view_botones_detalle_solicitud_emergencia() {

            _('txt_motivo_cancelar_solicitud_emergencia').value = '';

            _('div_programar_solicitud_emergencia').classList.add('hide');
            _('div_agregar_costo_solicitud_emergencia').classList.add('hide');
            _('div_cancelar_solicitud_emergencia').classList.add('hide');
            _('div_terminar_solicitud_observacion_solicitud_emergencia').classList.add('hide');
            _('div_terminar_solicitud_campos_solicitud_emergencia').classList.add('hide');
            _('div_terminar_solicitud_emergencia').classList.add('hide');
            _('div_botones_detalle_solicitud_emergencia').classList.remove('hide');
        }

        function fn_return() {
            $('#modal_ViewDetailEmergency').modal('hide');
            let urlaccion = 'CourierService/SolicitudEmergencia/Index',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }


        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_solicitud_emergencia_detalle');

(function ini() {
    app_Solicitud_Emergencia_Detalle.load();
    app_Solicitud_Emergencia_Detalle.req_ini();
})();
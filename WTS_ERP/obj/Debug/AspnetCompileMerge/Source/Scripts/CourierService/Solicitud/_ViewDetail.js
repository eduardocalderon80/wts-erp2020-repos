var app_Ver_Detalle = (
    function (d, idpadre) {

        var ovariables_informacion = {
            idsolicitud: 0,
            informacion_usuario: '',
            idusuario: '',
            nivel: 0,
        }

        var ovariables_data = {
            solicitud: '',
            arr_asistente: [],
            detalle: [],
            arr_historial: [],
            arr_vehiculo: [],
            arr_turno: [],
            arr_hora: [],
            codigoestado: ''
        }

        function load() {
            let par = _('txtpar_viewdetail').value;
            if (!_isEmpty(par)) {
                ovariables_informacion.idsolicitud = _par(par, 'idsolicitud');
            }

            _('btn_visualizar_cambiar_vehiculo_solicitud').addEventListener('click', fn_view_cambiar_vehiculo_solicitud);
            _('btn_visualizar_cancelar_solicitud').addEventListener('click', fn_view_cancelar_solicitud);
            _('btn_visualizar_terminar_solicitud').addEventListener('click', fn_view_terminar_solicitud);
            _('btn_visualizar_reprogramar_solicitud').addEventListener('click', fn_view_reprogramar_solicitud);
            _('btn_visualizar_agregar_costo_solicitud').addEventListener('click', fn_view_agregar_costo_solicitud);


            $('._retroceder_botones_detalle_solicitud').click(function () { fn_view_botones_detalle_solicitud(); });
           
            _('btn_cambiar_vehiculo_solicitud').addEventListener('click', req_cambiar_vehiculo_solicitud);
            _('btn_cancelar_solicitud').addEventListener('click', req_cancelar_solicitud);
            _('btn_terminar_solicitud').addEventListener('click', req_terminar_solicitud);
            _('btn_eliminar_solicitud').addEventListener('click', req_eliminar_solicitud);
            _('btn_agregar_costo_solicitud').addEventListener('click', req_agregar_costo_solicitud);
            _('btn_reprogramar_solicitud').addEventListener('click', req_reprogramar_solicitud);
            _('btn_eliminar_solicitud_usuario').addEventListener('click', req_eliminar_solicitud_usuario);

            _('btn_print_solicitud').addEventListener('click', req_imprimir_solicitud);
            
            $('#div_fecha_desde_reprogramar_solicitud .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });

        }

        function req_imprimir_solicitud() {
            let urlaccion = urlBase() + `CourierService/Solicitud/Print_Solicitud?par=${JSON.stringify({ idsolicitud: ovariables_informacion.idsolicitud })}`;
            _getFile(urlaccion, 100);
        }

        function _getFile(_urlaccion, tiempo) {
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
            let parametro = { idtipoenvio: 1 };
            let urlaccion = 'CourierService/Solicitud/Get_Informacion?par=' + JSON.stringify(parametro);
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
            let urlaccion = 'CourierService/Solicitud/Get_Detalle?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : '';
                        ovariables_data.arr_asistente = rpta[0].asistente != '' ? JSON.parse(rpta[0].asistente) : [];
                        ovariables_data.detalle = rpta[0].detalle != '' ? JSON.parse(rpta[0].detalle) : '';
                        ovariables_data.arr_historial = rpta[0].historial != '' ? JSON.parse(rpta[0].historial) : [];
                        ovariables_data.arr_vehiculo = rpta[0].vehiculo != '' ? JSON.parse(rpta[0].vehiculo) : [];
                        ovariables_data.arr_turno = rpta[0].turno != '' ? JSON.parse(rpta[0].turno) : [];
                        ovariables_data.arr_hora = rpta[0].hora != '' ? JSON.parse(rpta[0].hora) : [];
                    }
                    fn_load_item();
                    fn_load_solicitud();
                    fn_load_asistente();
                    fn_load_detalle();
                    fn_load_historial();
                }, (p) => { err(p); });
        }
        
        function fn_load_item() {
            let programacion = ovariables_data.solicitud;
            ovariables_data.codigoestado = programacion[0].codigoestado;
            let vehiculo_solicitud = programacion[0].idvehiculo;
            let idtipoenvio = programacion[0].idtipoenvio;

            if (ovariables_informacion.nivel == 1 || ovariables_informacion.nivel == 2) {
                if (ovariables_data.codigoestado == 'PEN') {
                    _('btn_visualizar_cambiar_vehiculo_solicitud').classList.remove('hide');
                    _('btn_visualizar_reprogramar_solicitud').classList.remove('hide');
                    _('btn_visualizar_cancelar_solicitud').classList.remove('hide');
                    _('btn_visualizar_terminar_solicitud').classList.remove('hide');
                    _('btn_eliminar_solicitud').classList.remove('hide');
                    _('btn_print_solicitud').classList.remove('hide');
                }

                if (vehiculo_solicitud == 5 || vehiculo_solicitud == 6) {
                    if (ovariables_data.codigoestado == 'PEN') {
                        _('btn_visualizar_agregar_costo_solicitud').classList.remove('hide');
                    }

                    if (ovariables_data.codigoestado == 'TER') {
                        _('btn_visualizar_agregar_costo_solicitud').classList.remove('hide');
                    }
                }
            }
            else {
                //if (idtipoenvio < 3) {
                    if (ovariables_informacion.idusuario === programacion[0].idusuario) {

                        if (idtipoenvio < 3) {
                            _('btn_eliminar_solicitud_usuario').classList.remove('hide');
                        }
                        
                        if (ovariables_data.codigoestado == 'CRE' && programacion[0].idtiposervicio == 1) {
                            _('btn_print_solicitud').classList.remove('hide');
                        }
                        if (ovariables_data.codigoestado == 'PEN' && programacion[0].idtiposervicio == 1) {
                            _('btn_print_solicitud').classList.remove('hide');
                        }
                    }
                //}
            }
        }
        
        function fn_load_solicitud() {
            let programacion = ovariables_data.solicitud;

            _('txt_usuario').value = programacion[0].usuario;
            _('txt_fecha').value = programacion[0].fecha;
            _('txt_servicio').value = programacion[0].tiposervicio;
            _('txt_turno').value = programacion[0].turno;
            _('txt_hora').value = programacion[0].hora;
            _('txt_vehiculo').value = programacion[0].vehiculo;
            _('txt_costo').value = programacion[0].costo;
            _('txt_motivo').value = programacion[0].motivo;
            _('txt_cliente').value = programacion[0].cliente;
            _('txt_destino').value = programacion[0].destino;
            _('txt_direccion').value = programacion[0].direccion;
            _('txt_contacto').value = programacion[0].contacto;
            _('txt_numero_contacto').value = programacion[0].numerocontacto;
            _('txt_motivo').value = programacion[0].motivo;

        }
        
        function fn_load_asistente() {
            if (ovariables_data.arr_asistente.length > 0) {
                let txt_asistente = '';
                ovariables_data.arr_asistente.forEach(x=> { txt_asistente += `${x.asistente}` + ' - '; });

                _('txt_asistente').value = txt_asistente.slice(0, -3);
                _('div_row_asistente').classList.remove('hide');
            }            
        }

        function fn_load_detalle() {
            if (ovariables_data.codigoestado == 'TER') {

                _('li_detalle_solicitud').classList.remove('hide');

                if (ovariables_data.detalle!='') {
                    let detalle = ovariables_data.detalle;
                    _('txt_usuario_terminado').value = detalle[0].usuario;
                    _('txt_hora_terminado').value = detalle[0].hora;                    
                    _('txt_observacion_terminado').value = detalle[0].observacion;
                    _('txt_nombre_terminado').value = detalle[0].nombrereceptorr;
                    _('txt_dni_terminado').value = detalle[0].dnireceptor;
                    _('txt_tiempo_espera_terminado').value = detalle[0].tiempoespera;
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

                _('tbl_historial_solicitud').tBodies[0].innerHTML = html_body;
            }
        }
                
        function fn_load_vehiculo(_id) {
            let programacion = ovariables_data.solicitud,
                arr_vehiculo = ovariables_data.arr_vehiculo,
                cbo_vehiculo = '';

            arr_vehiculo.forEach(x=> { cbo_vehiculo += `<option value='${x.idvehiculo}'>${x.vehiculo}</option>`; });

            _(_id).innerHTML = cbo_vehiculo;
            _(_id).value = programacion[0].idvehiculo;
            $('#' + _id).select2();
        }

        function fn_load_turno() {
            let programacion = ovariables_data.solicitud,
               arr_turno = ovariables_data.arr_turno,
               cbo_turno = '';

            arr_turno.forEach(x=> { cbo_turno += `<option value='${x.idturno}'>${x.turno}</option>`; });

            _('cbo_turno_reprogramar_solicitud').innerHTML = cbo_turno;
            _('cbo_turno_reprogramar_solicitud').value = programacion[0].idturno;
            $('#cbo_turno_reprogramar_solicitud').select2();
        }

        function fn_load_hora() {
            let programacion = ovariables_data.solicitud,
               arr_hora = ovariables_data.arr_hora,
               cbo_hora = '';

            arr_hora.forEach(x=> { cbo_hora += `<option value='${x.idhora}'>${x.hora}</option>`; });

            _('cbo_hora_reprogramar_solicitud').innerHTML = cbo_hora;
            _('cbo_hora_reprogramar_solicitud').value = programacion[0].idhora;
            $('#cbo_hora_reprogramar_solicitud').select2();
        }

        /* Cambiar Vehiculo */
        function fn_view_cambiar_vehiculo_solicitud() {
            fn_load_vehiculo('cbo_vehiculo_solicitud');
            _('div_cambiar_vehiculo_solicitud').classList.remove('hide');
            _('div_botones_detalle_solicitud').classList.add('hide');
        }

        function req_cambiar_vehiculo_solicitud() {
            swal({
                title: "Información",
                text: "Esta seguro de cambiar de movilidad?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_save_cambiar_vehiculo_solicitud();
            });
        }

        function fn_save_cambiar_vehiculo_solicitud() {
            let urlaccion = 'CourierService/Solicitud/Change_Vehiculo',
                idvehiculo_nuevo = _('cbo_vehiculo_solicitud').value;
            let par = { idsolicitud: 0, idvehiculo: idvehiculo_nuevo };
            let obj = {}, arr_solicitud = [];

            obj.idsolicitud = ovariables_informacion.idsolicitud;
            arr_solicitud.push(obj);

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', JSON.stringify(arr_solicitud));
            Post(urlaccion, form, res_save_cambiar_vehiculo_solicitud);
        }

        function res_save_cambiar_vehiculo_solicitud(response) {
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
        
        /* Cancelar Solicitud */
        function fn_view_cancelar_solicitud() {
            _('div_cancelar_solicitud').classList.remove('hide');
            _('div_botones_detalle_solicitud').classList.add('hide');
        }        

        function req_cancelar_solicitud() {
            let req = required_item({ id: 'div_cancelar_solicitud', clase: '_enty' });
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
                    fn_save_cancelar_solicitud();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar un motivo para poder cancelar la solicitud", type: "warning" }); }
        }

        function fn_save_cancelar_solicitud() {
            let urlaccion = 'CourierService/Solicitud/Cancel_Solicitud'
                , motivo = _('txt_motivo_cancelar_solicitud').value;

            let par = { idsolicitud: 0, motivo: motivo };
            let obj = {}, arr_solicitud = [];
            obj.idsolicitud = ovariables_informacion.idsolicitud;
            arr_solicitud.push(obj);

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', JSON.stringify(arr_solicitud));
            Post(urlaccion, form, res_save_cancelar_solicitud);
        }

        function res_save_cancelar_solicitud(response) {
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

        /* Reprogramar Solicitud */
        function fn_view_reprogramar_solicitud() {
            fn_load_vehiculo('cbo_vehiculo_reprogramar_solicitud');
            fn_load_turno();
            fn_load_hora();
            let programacion = ovariables_data.solicitud;
            _('txt_fecha_desde_reprogramar_solicitud').value = programacion[0].fecha;

            _('div_reprogramar_solicitud_datos').classList.remove('hide');
            _('div_reprogramar_solicitud').classList.remove('hide');
            _('div_botones_detalle_solicitud').classList.add('hide');
        }

        function req_reprogramar_solicitud() {
            let req_detalle = required_item({ id: 'div_reprogramar_solicitud', clase: '_enty' });
            if (req_detalle)
                swal({
                    title: "Información",
                    text: "Esta seguro de reprogramar esta solicitud?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_save_reprogramar_solicitud();
                });
            else { swal({ title: "Advertencia!!", text: "Debe ingresar una fecha para poder reprogramar esta solicitud", type: "warning" }); }
        }

        function fn_save_reprogramar_solicitud() {
            let urlaccion = 'CourierService/Solicitud/ReProgram_Solicitud';
            let idvehiculo = _('cbo_vehiculo_reprogramar_solicitud').value,
                idturno = _('cbo_turno_reprogramar_solicitud').value,
                idhora = _('cbo_hora_reprogramar_solicitud').value,
                fecha = _convertDate_ANSI(_('txt_fecha_desde_reprogramar_solicitud').value);
            tiempoespera = _('txt_tiempo_espera_terminar_solicitud').value;
            let par = { idsolicitud: 0, idvehiculo: idvehiculo, idturno: idturno, idhora: idhora, fecha: fecha };

            let obj = {}, arr_solicitud = [];
            obj.idsolicitud = ovariables_informacion.idsolicitud;
            arr_solicitud.push(obj);

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', JSON.stringify(arr_solicitud));
            Post(urlaccion, form, res_save_terminar_solicitud);
        }

        function res_save_terminar_solicitud(response) {
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
        function fn_view_terminar_solicitud() {
            let programacion = ovariables_data.solicitud;
            _('txt_costo_terminar_solicitud').value = programacion[0].costo;
            _('div_terminar_solicitud_observacion_solicitud').classList.remove('hide');
            _('div_terminar_solicitud_campos_solicitud').classList.remove('hide');
            _('div_terminar_solicitud').classList.remove('hide');
            _('div_botones_detalle_solicitud').classList.add('hide');
        }

        function req_terminar_solicitud() {
            let req_observation = required_item({ id: 'div_terminar_solicitud_observacion_solicitud', clase: '_enty' });
            let req_detalle = required_item({ id: 'div_terminar_solicitud_campos_solicitud', clase: '_enty' });
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
                fn_save_terminar_solicitud();
            });
            else { swal({ title: "Advertencia!!", text: "Debe ingresar estos campos requeridos para poder terminar la solicitud", type: "warning" }); }
        }

        function fn_save_terminar_solicitud() {
            let urlaccion = 'CourierService/Solicitud/Finish_Solicitud';
            let observacion = _('txt_observacion_terminar_solicitud').value,
                nombre = _('txt_nombre_terminar_solicitud').value,
                dni = _('txt_dni_terminar_solicitud').value,
                costo = _('txt_costo_terminar_solicitud').value
            tiempoespera = _('txt_tiempo_espera_terminar_solicitud').value;
            let par = { idsolicitud: 0, observacion: observacion, nombre: nombre, dni: dni, costo: costo, tiempoespera: tiempoespera };

            let obj = {}, arr_solicitud = [];
            obj.idsolicitud = ovariables_informacion.idsolicitud;
            arr_solicitud.push(obj);

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', JSON.stringify(arr_solicitud));
            Post(urlaccion, form, res_save_terminar_solicitud);
        }

        function res_save_terminar_solicitud(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });                   
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Eliminar Solicitud */
        function req_eliminar_solicitud() {
            swal({
                title: "Información",
                text: "Esta seguro de eliminar esta solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_save_eliminar_solicitud();
            });
        }

        function fn_save_eliminar_solicitud() {
            let urlaccion = 'CourierService/Solicitud/Delete_Solicitud';
            let par = { idsolicitud: 0 };

            let obj = {}, arr_solicitud = [];
            obj.idsolicitud = ovariables_informacion.idsolicitud;
            arr_solicitud.push(obj);

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', JSON.stringify(arr_solicitud));
            Post(urlaccion, form, res_save_eliminar_solicitud);
        }

        function res_save_eliminar_solicitud(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha eliminado este registro correctamente", type: "success" });
                    $('#modal_ViewDetail').modal('hide');
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Eliminar Solicitud - USUARIO */
        function req_eliminar_solicitud_usuario() {
            swal({
                title: "Información",
                text: "Esta seguro de eliminar esta solicitud?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_save_eliminar_solicitud_usuario();
            });
        }

        function fn_save_eliminar_solicitud_usuario() {
            let urlaccion = 'CourierService/Solicitud/Delete_Solicitud_Usuario';

            let par = { idsolicitud: ovariables_informacion.idsolicitud };

            form = new FormData();
            form.append('par', JSON.stringify(par));
            Post(urlaccion, form, res_save_eliminar_solicitud_usuario);
        }

        function res_save_eliminar_solicitud_usuario(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                let cerrado = orpta[0].cerrado;
                let mensaje = orpta[0].mensaje;

                if (cerrado == 'NO') {
                    swal({ title: "Buen Trabajo!", text: mensaje, type: "success" });
                    $('#modal_ViewDetail').modal('hide');
                    fn_return();
                }
                if (cerrado === 'SI') {
                    swal({ title: "Alerta!", text: mensaje, type: "warning" });
                }
            }
            else { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
        }


        /* Agregar Costo */
        function fn_view_agregar_costo_solicitud() {
            let programacion = ovariables_data.solicitud;
            _('txt_costo_solicitud').value = programacion[0].costo;
            _('div_agregar_costo_solicitud').classList.remove('hide');
            _('div_botones_detalle_solicitud').classList.add('hide');
        }

        function req_agregar_costo_solicitud() {
            let req = required_item({ id: 'div_agregar_costo_solicitud', clase: '_enty' });
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
                    fn_save_agregar_costo_solicitud();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar un motivo para poder cancelar la solicitud", type: "warning" }); }
        }

        function fn_save_agregar_costo_solicitud() {
            let urlaccion = 'CourierService/Solicitud/Add_Costo',
               costo = _('txt_costo_solicitud').value;
            let par = { idsolicitud: ovariables_informacion.idsolicitud, costo: costo };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_agregar_costo_solicitud);
        }

        function res_save_agregar_costo_solicitud(response) {
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

        function fn_view_botones_detalle_solicitud() {

            _('txt_motivo_cancelar_solicitud').value = '';


            _('div_cambiar_vehiculo_solicitud').classList.add('hide');
            _('div_cancelar_solicitud').classList.add('hide');
            _('div_reprogramar_solicitud_datos').classList.add('hide');
            _('div_reprogramar_solicitud').classList.add('hide');
            _('div_terminar_solicitud_campos_solicitud').classList.add('hide');
            _('div_terminar_solicitud_observacion_solicitud').classList.add('hide');
            _('div_terminar_solicitud').classList.add('hide');
            _('div_agregar_costo_solicitud').classList.add('hide');            
            _('div_botones_detalle_solicitud').classList.remove('hide');
        }

        function fn_return() {
            $('#modal_ViewDetail').modal('hide');
            let urlaccion = 'CourierService/Solicitud/Index', urljs = 'CourierService/Solicitud/Index';
            _Go_Url(urlaccion, urljs);
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_view_detail');

(function ini() {
    app_Ver_Detalle.load();
    app_Ver_Detalle.req_ini();
})();
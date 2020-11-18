var app_Solicitud_Program = (

    function (d, idpadre) {

        var ovariables_informacion = {
            informacion_usuario: ''
            , arr_ruta: ''
            , idusuario: ''
            , nivel: 0
            , lst_vehiculo: []
            , lst_estado: []
            , lst_turno: []
            , lst_hora: []
        }

        var ovariables_data = {
            arr_solicitud: []
        }

        function load() {
            _('btn_return').addEventListener('click', fn_return);
            _('btn_search').addEventListener('click', req_data);            

            $('#div_fecha_desde .input-group.date, #div_fecha_hasta .input-group.date, #div_fecha_reprogramar .input-group.date').datepicker({
                autoclose: true,
                dateFormat: 'mm/dd/yyyy',
                todayHighlight: true
            });

            $('#div_fecha_desde .input-group.date, #div_fecha_hasta .input-group.date, #div_fecha_reprogramar .input-group.date').datepicker('update', moment().format('MM/DD/YYYY'));
           
            $('.footable').footable();
            $('.footable').trigger('footable_resize');

            _('btn_cambiar_vehiculo').addEventListener('click', fn_ejcutar_accion);
            _('btn_cancelar').addEventListener('click', fn_ejcutar_accion);
            _('btn_reprogramar').addEventListener('click', fn_ejcutar_accion);
            _('btn_terminar').addEventListener('click', fn_ejcutar_accion);
            _('btn_eliminar').addEventListener('click', fn_ejcutar_accion);

            _('btn_cambiar_vehiculo_accion').addEventListener('click', fn_cambiar_vehiculo_accion);
            _('btn_cancelar_accion').addEventListener('click', fn_cancelar_accion);
            _('btn_reprogramar_accion').addEventListener('click', fn_reprogramar_accion);
            _('btn_terminar_accion').addEventListener('click', fn_terminar_accion);
            _('btn_eliminar_accion').addEventListener('click', fn_eliminar_accion);

            
            $('._retroceder_accion').click(function () { fn_ocultar_acciones(); });

        }

        /* ACCION */
        function fn_ejcutar_accion(e) {
            let _iditem = e.currentTarget;
            let idmain = _iditem.id;
            clean_required_item();

            let lst_checked = fn_obtener_checked('tbl_solicitud');

            if (lst_checked.length > 0) {

                _('div_form_filter').classList.add('hide');
                _('div_form_data').classList.add('hide');
                _('div_form_cambiar_vehiculo').classList.add('hide');
                _('div_form_cancelar_solicitud').classList.add('hide');
                _('div_form_reprogramar_solicitud').classList.add('hide');
                _('div_form_terminar_solicitud').classList.add('hide');
                _('div_form_eliminar_solicitud').classList.add('hide');

                let div_contenedor_accion = '', tabla_accion = '';

                if (idmain == 'btn_cambiar_vehiculo') {
                    div_contenedor_accion = 'div_form_cambiar_vehiculo';
                    tabla_accion = 'tbl_cambiar_vehiculo';
                    fn_load_vehiculo_accion('cbo_vehiculo_cambiar');
                }
                else if (idmain == 'btn_cancelar') {
                    div_contenedor_accion = 'div_form_cancelar_solicitud';
                    tabla_accion = 'tbl_cancelar_solicitud';
                }
                else if (idmain == 'btn_reprogramar') {
                    div_contenedor_accion = 'div_form_reprogramar_solicitud';
                    tabla_accion = 'tbl_reprogramar_solicitud';
                    fn_load_vehiculo_accion('cbo_vehiculo_reprogramar');
                    fn_load_turno_accion();
                    fn_load_hora_accion();
                }
                else if (idmain == 'btn_terminar') {
                    div_contenedor_accion = 'div_form_terminar_solicitud';
                    tabla_accion = 'tbl_terminar_solicitud';
                }
                else if (idmain == 'btn_eliminar') {
                    div_contenedor_accion = 'div_form_eliminar_solicitud';
                    tabla_accion = 'tbl_eliminar_solicitud';
                }

                _(div_contenedor_accion).classList.remove('hide');

                let resultado = ovariables_data.arr_solicitud.filter(x=> { return lst_checked.some(y=>  y.idsolicitud.toString() === x.idsolicitud.toString()) });
                fn_load_solicitud_seleccionados(tabla_accion, resultado);

            }
            else { swal({ title: 'Alert', text: 'Debe seleccionar registros para poder realizar esta acción', type: "warning" }); }

        }

        /* ACCION - Cambiar Vehiculo */
        function fn_cambiar_vehiculo_accion() {
            clean_required_item();
            req_principal = required_item({ id: 'div_form_cambiar_vehiculo', clase: '_enty' });

            if (req_principal) {
                swal({
                    title: "Esta seguro de realizar esta acción?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    fn_guardar_cambiar_vehiculo_accion();
                });

            } else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_guardar_cambiar_vehiculo_accion() {
            let urlaccion = 'CourierService/Solicitud/Change_Vehiculo';
            let par = _getParameter({ id: 'div_form_cambiar_vehiculo', clase: '_enty' })
                , arr_solicitud = JSON.stringify(fn_obtener_checked('tbl_solicitud'));
            form = new FormData();
            par['idsolicitud'] = 0;
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arr_solicitud);
            Post(urlaccion, form, res_guardar);
        }
               
        /* ACCION - Cancelar Solicitud */
        function fn_cancelar_accion() {
            clean_required_item();
            req_principal = required_item({ id: 'div_form_cancelar_solicitud', clase: '_enty' });

            if (req_principal) {
                swal({
                    title: "Esta seguro de realizar esta acción?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    fn_guardar_cancelar_accion();
                });

            } else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_guardar_cancelar_accion() {
            let urlaccion = 'CourierService/Solicitud/Cancel_Solicitud';
            let par = _getParameter({ id: 'div_form_cancelar_solicitud', clase: '_enty' })
                , arr_solicitud = JSON.stringify(fn_obtener_checked('tbl_solicitud'));
            form = new FormData();
            par['idsolicitud'] = 0;
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arr_solicitud);
            Post(urlaccion, form, res_guardar);
        }

        /* ACCION - Reprogramar Solicitud */
        function fn_reprogramar_accion() {
            clean_required_item();
            req_principal = required_item({ id: 'div_form_reprogramar_solicitud', clase: '_enty' });

            if (req_principal) {
                swal({
                    title: "Esta seguro de realizar esta acción?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    fn_guardar_reprogramar_accion();
                });

            } else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_guardar_reprogramar_accion() {
            let urlaccion = 'CourierService/Solicitud/ReProgram_Solicitud';
            let par = _getParameter({ id: 'div_form_reprogramar_solicitud', clase: '_enty' })
                , arr_solicitud = JSON.stringify(fn_obtener_checked('tbl_solicitud'));
            form = new FormData();
            par['idsolicitud'] = 0;
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arr_solicitud);
            Post(urlaccion, form, res_guardar);
        }

        /* ACCION - Terminar Solicitud */
        function fn_terminar_accion() {
            clean_required_item();
            req_principal = required_item({ id: 'div_form_terminar_solicitud', clase: '_enty' });

            if (req_principal) {
                swal({
                    title: "Esta seguro de realizar esta acción?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    fn_guardar_terminar_accion();
                });

            } else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_guardar_terminar_accion() {
            let urlaccion = 'CourierService/Solicitud/Finish_Solicitud';
            let par = _getParameter({ id: 'div_form_terminar_solicitud', clase: '_enty' })
                , arr_solicitud = JSON.stringify(fn_obtener_checked('tbl_solicitud'));
            form = new FormData();
            par['idsolicitud'] = 0;
            par['costo'] = 0.00;
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arr_solicitud);
            Post(urlaccion, form, res_guardar);
        }

        /* ACCION - Eliminar Solicitud */

        function fn_eliminar_accion() {
            clean_required_item();
            swal({
                title: "Esta seguro de realizar esta acción?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                fn_guardar_terminar_accion();
            });
        }
        
        function fn_guardar_terminar_accion() {
            let urlaccion = 'CourierService/Solicitud/Delete_Solicitud';
            let par = { idsolicitud: 0 }
                , arr_solicitud = JSON.stringify(fn_obtener_checked('tbl_solicitud'));
            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arr_solicitud);
            Post(urlaccion, form, res_guardar);
        }

        
        /* ACCION - Eventos */
        function fn_ocultar_acciones() {
            _('div_form_filter').classList.remove('hide');
            _('div_form_data').classList.remove('hide');
            _('div_form_cambiar_vehiculo').classList.add('hide');
            _('div_form_cancelar_solicitud').classList.add('hide');
            _('div_form_reprogramar_solicitud').classList.add('hide');
            _('div_form_terminar_solicitud').classList.add('hide');
            _('div_form_eliminar_solicitud').classList.add('hide');

            _('tbl_cambiar_vehiculo').tBodies[0].innerHTML = '';
        }

        function fn_obtener_checked(_idtabla) {
            let table = _(_idtabla) == null ? '' : _(_idtabla);
            let arr_resultado = []
            if (table != '') {
                let tablebody = table.tBodies[0], arrchk = [...tablebody.getElementsByClassName('checked')], obj = {};
                if (arrchk.length > 0) {
                    arrchk.forEach(x=> {
                        obj = {};
                        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                        let par = fila.getAttribute('data-par');
                        obj.idsolicitud = _par(par, 'idsolicitud');
                        arr_resultado.push(obj);
                    })
                }
            }
            return arr_resultado;
        }

        function fn_load_vehiculo_accion(_id) {
            let lst_vehiculo = ovariables_informacion.lst_vehiculo
                , cbo_vehiculo = `<option value='0'>Seleccione una Movilidad</option>`;

            if (lst_vehiculo.length > 0) { lst_vehiculo.forEach(x=> { cbo_vehiculo += `<option value='${x.idvehiculo}'>${x.vehiculo}</option>`; }); }
            _(_id).innerHTML = cbo_vehiculo;
        }

        function fn_load_turno_accion() {
            let arr_turno = ovariables_informacion.lst_turno
               , cbo_turno = `<option value='0'>Seleccion Turno</option>`;

            arr_turno.forEach(x=> { cbo_turno += `<option value='${x.idturno}'>${x.turno}</option>`; });

            _('cbo_turno_reprogramar').innerHTML = cbo_turno;
        }

        function fn_load_hora_accion() {
            let arr_hora = ovariables_informacion.lst_hora,
               cbo_hora = `<option value='0'>Seleccion Hora</option>`;

            arr_hora.forEach(x=> { cbo_hora += `<option value='${x.idhora}'>${x.hora}</option>`; });

            _('cbo_hora_reprogramar').innerHTML = cbo_hora;
        }

        function fn_load_solicitud_seleccionados(_tabla, _data) {
            let resultado_data = _data,
               html = '', htmlheader = '', htmlbody = '';

            resultado_data.forEach(x=> {
                htmlbody +=
                    `<tr data-par='idsolicitud:${x.idsolicitud},codigoestado:${x.codigoestado},estado:${x.estado},clasecolor:${x.clasecolor}'>                             
                            <td>${x.destino}</td>
                            <td>${x.fecha}</td>
                            <td>${x.tiposervicio}</td>
                            <td>${x.turno}</td>
                            <td>${x.hora}</td>
                            <td>${x.usuario}</td>
                            <td>${x.vehiculo}</td>
                        </tr>`
                ;
            });

            _(_tabla).tBodies[0].innerHTML = htmlbody;
            $('.footable').trigger('footable_resize');
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

        function res_guardar(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    req_ini();
                    fn_ocultar_acciones();                    
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* GENERAL */
        function fn_getDate() {
            let odate = new Date();
            let mes = odate.getMonth() + 1;
            let day = odate.getDate();
            let anio = odate.getFullYear();
            if (day < 10) { day = '0' + day }
            if (mes < 10) { mes = '0' + mes }
            let fecha = `${mes}/${day}/${anio}`;
            _('txt_fecha_desde').value = fecha;
            _('txt_fecha_hasta').value = fecha;
        }

        function req_new() {
            let urlaccion = 'CourierService/Solicitud/New',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function fn_return() {
            let urlaccion = 'CourierService/Solicitud/Index',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }
        
        /* INICIAL */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: 0 };
            let urlaccion = 'CourierService/Solicitud/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.lst_vehiculo = rpta[0].vehiculo != '' ? JSON.parse(rpta[0].vehiculo) : '';
                        ovariables_informacion.lst_estado = rpta[0].estado != '' ? JSON.parse(rpta[0].estado) : '';
                        ovariables_informacion.lst_turno = rpta[0].turno != '' ? JSON.parse(rpta[0].turno) : '';
                        ovariables_informacion.lst_hora = rpta[0].hora != '' ? JSON.parse(rpta[0].hora) : '';
                    }
                    fn_load_informacion();
                    fn_load_vehiculo();                   
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;
        }

        function fn_load_vehiculo() {
            let lst_vehiculo = ovariables_informacion.lst_vehiculo
                , cbo_vehiculo = `<option value='0'>Todos</option>`;

            if (lst_vehiculo.length > 0) { lst_vehiculo.forEach(x=> { cbo_vehiculo += `<option value='${x.idvehiculo}'>${x.vehiculo}</option>`; }); }
            _('cbo_vehiculo').innerHTML = cbo_vehiculo;           
        }
        
        function fn_load_botones() {
            let estado = _('cbo_estado').value;
            if (estado == 'PEN') {
                _('btn_visualizar_cambiar_vehiculo_solicitud').classList.remove('hide');
                _('btn_visualizar_reprogramar_solicitud').classList.remove('hide');
                _('btn_visualizar_cancelar_solicitud').classList.remove('hide');
                _('btn_visualizar_terminar_solicitud').classList.remove('hide');
                _('btn_eliminar_solicitud').classList.remove('hide');
            }
        }
               

        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let idvehiculo = _('cbo_vehiculo').value, codigoestado = 'PEN'
            , fechadesde = _convertDate_ANSI(_('txt_fecha_desde').value), fechahasta = _convertDate_ANSI(_('txt_fecha_hasta').value);

            let parametro = { idvehiculo: idvehiculo, codigoestado: codigoestado, fechadesde: fechadesde, fechahasta: fechahasta };

            let urlaccion = 'CourierService/Solicitud/List_Solicitud?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : '';
                    }
                    req_load_solicitud();

                }, (p) => { err(p); });
        }

        function req_load_solicitud() {
            let arr_solicitud = ovariables_data.arr_solicitud, resultado_solicitud = [];

            if (arr_solicitud.length > 0) { resultado_solicitud = arr_solicitud; }
            fn_load_solicitud(resultado_solicitud);
        }

        function fn_load_solicitud(_resultado_solicitud) {
            let resultado_solicitud = _resultado_solicitud,
                html = '', htmlheader = '', htmlbody = '',
                btn_estado_solicitud = `<button type='button' class ='btn btn-outline btn-__clasecolor btn-sm btn-block _ver_detalle'>__estado</span></button>`;
            
            resultado_solicitud.forEach(x=> {
                let estado_solicitud = btn_estado_solicitud.replace('__clasecolor', x.clasecolor).replace('__estado', x.estado);

                htmlbody +=
                    `<tr data-par='idsolicitud:${x.idsolicitud},codigoestado:${x.codigoestado},estado:${x.estado},clasecolor:${x.clasecolor}'>
                             <td class ='text-center'>
                                <div  class ='i-checks _item'>
                                    <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                        <label>
                                            <input id='chk_idpersonal' data-idpersonal = '${x.idpersonal}' type='checkbox' class ='i-checks _clschk_personal' style='position: absolute; opacity: 0;'>
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td>${x.destino}</td>
                            <td>${x.fecha}</td>
                            <td>${x.tiposervicio}</td>
                            <td>${x.turno}</td>
                            <td>${x.hora}</td>
                            <td>${x.usuario}</td>
                            <td>${x.vehiculo}</td>
                            <td class ='text-center'>${estado_solicitud}</td>
                        </tr>`
                ;
            });
            
            _('tbl_solicitud').tBodies[0].innerHTML = htmlbody;
            $('.footable').trigger('footable_resize');

            //format_table_solicitud();

            let panel_data = _('pnl_solicitud_program');
            //Agregar evento de ver detalle
            let arr_item_ver_detalle = Array.from(panel_data.getElementsByClassName('_ver_detalle'));
            arr_item_ver_detalle.forEach(x => x.addEventListener('click', e => { fn_ver_detalle(e) }));

            handler_table();
        }

        function handler_table() {
            $('.i-checks._item').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        }

        function format_table_solicitud() {
            $('#tbl_solicitud_list').DataTable({
                scrollY: "450px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                bPaginate: false,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros"
                }
            });
        }

        /* Ver Detalle */
        function fn_ver_detalle(e) {
            let o = e.currentTarget;
            let tr = o.parentNode.parentNode;
            let par = tr.getAttribute('data-par');
            fn_view_modal_ver_detalle(par);
        }

        function fn_view_modal_ver_detalle(_parametro) {
            let estado = _getPar(_parametro, 'estado').toUpperCase();
            let clasecolor = 'bg-' + _getPar(_parametro, 'clasecolor');
            let urlaccion = 'CourierService/Solicitud/_ViewDetail';
            _modalBody_Opacity({
                url: urlaccion,
                idmodal: 'ViewDetail',
                paremeter: _parametro,
                title: estado,
                width: '',
                height: '',
                backgroundtitle: clasecolor,
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        /* Funcion Modal */
        function _modalBody_Opacity(oparametro) {
            let url = oparametro.url,
                idmodal = oparametro.idmodal,
                paremeter = oparametro.paremeter || '',
                title = oparametro.title,
                width = oparametro.width || '',
                height = oparametro.height || '',
                backgroundtitle = oparametro.backgroundtitle || '',
                classanimation = oparametro.animation || '',
                claseresponsive = oparametro.responsive || '',
                disabledmainscreen = oparametro.bloquearpantallaprincipal || '';
            if (!_isEmpty(idmodal)) {
                _promise().then(function () {
                    _modal_Opacity(idmodal, width, height, backgroundtitle, classanimation, claseresponsive, disabledmainscreen);
                }).then(function () {
                    let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                        modal_header = _(`modal_header_${idmodal}`),
                        modal_title = _(`modal_title_${idmodal}`),
                        modal_body = _(`modal_body_${idmodal}`),
                        _err = function (error) { console.log("error", error) }

                    //modal_header.classList.add(backgroundtitle);
                    modal_title.innerHTML = !_isEmpty(title) ? title : 'Titulo';
                    $(`#modal_${idmodal}`).modal({ show: true });

                    /*Para que sea arrastable*/
                    //$(`#modal_dialog_${idmodal}`).draggable({
                    //    handle: '.modal-content'
                    //});

                    _Get(url)
                        .then((vista) => {
                            let contenido = (paremeter !== '') ? vista.replace('DATA-PARAMETRO', paremeter) : vista;
                            modal_body.innerHTML = contenido;
                        }, (p) => { _err(p) })
                        .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
                })
            }
        }

        function _modal_Opacity(_idmodal, _width, _height, _backgroundtitle, _classanimation, _claseresponsive, _disabledmainscreen) {
            let classbackgroundtitle = _backgroundtitle || 'bg-primary';
            let html = '',
                classmodal = 'class' + _idmodal,
                width = !_isEmpty(_claseresponsive) ? '' : (!_isEmpty(_width) ? `width:${_width}px` : 'width:900px'), // ??
                claseresponsive = _claseresponsive || '',
                height = (!_isEmpty(_height)) ? _height.toString() + 'px;' : 'auto;', // ??
                heightbody = (!_isEmpty(_height)) ? (parseInt(_height) - 80) + 'px' : 'auto', // ??
                max_heightbody = heightbody,
                classtittle = classbackgroundtitle,
                classanimation = !_isEmpty(_classanimation) ? (_classanimation.trim() === 'none' ? '' : ' ' + ` animated ${_classanimation.trim()}`) : '';

            let modalinbody = document.getElementById(`modal_${_idmodal}`);
            if (modalinbody != null) {
                document.body.removeChild(modalinbody);
            }
            let defaulttitle = 'New';

            html += `<div id='modal_${_idmodal}' class='modal fade ${classmodal}' role='dialog' data-dismiss='modal' data-backdrop='static'>`;
            html += `   <div id='modal_dialog_${_idmodal}' class='modal-dialog ${claseresponsive}'>`; //falta clase responsiva
            html += `       <div id='modal_content_${_idmodal}' class='modal-content' style='height:${height}'>`; //falta estilo height            
            html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            //html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            //html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            html += `               <h4 id='modal_title_${_idmodal}' class='modal-title'>${defaulttitle}</h4>`;
            html += `           </div>`;
            html += `           <div id='modal_body_${_idmodal}' class='modal-body wrapper wrapper-content gray-bg'>`; //falta agregar class wrapper
            html += `           </div>`;
            html += `       </div>`;
            html += `   </div>`;
            html += `</div>`;

            $('body').append(html);
        }


        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_solicitud_program');

(function ini() {
    app_Solicitud_Program.load();
    app_Solicitud_Program.req_ini();
})();
var app_Ticket_Editar = (
    function (d, idpadre) {

        var ovariables_info = {
            informacion_usuario: [],
            arr_solicitante: [],
            arr_aprobadorarea: [],
            arr_aprobadormodulo: [],
            arr_equipotic: [],
            arr_tiposolicitud: [],
            arr_prioridad: [],
            arr_categoria: [],
            arr_sistema: [],
            arr_modulo: [],
            arr_estado: [],
            arr_tipoatencion: [],
            arr_tipovalorizacion: [],
            ticket: '',
            arr_ticketresponsable: [],
            arr_ticketaprobador: [],
            arr_ticketarchivo: [],
            arr_ticketarchivo_solicitante: [],
            arr_ticketarchivo_tic: [],
            arr_ticketcomentario: [],
            arr_ticketboton: []
        }

        var ovariables = {
            tipousuario: 'SOL'
            , idticket: 0
            , idsolicitante: 0
            , idareasolicitante: 0
            , codigoestado: ''
        }

        function load() {
            let par = _('txt_ticket_edit_par').value;
            if (!_isEmpty(par)) { ovariables.idticket = _par(par, 'idticket'); }

            $('#div_fecha_inicio_tentativo .input-group.date, #div_fecha_fin_tentativo .input-group.date, #div_fecha_inicio_real .input-group.date, #div_fecha_fin_real .input-group.date').datepicker({
                autoclose: true,
                clearBtn: true,
                dateFormat: 'dd/mm/yyyy',
                todayHighlight: true
            }).datepicker();

            _('btn_guardar_editar').addEventListener('click', req_guardar_editar);
            _('btn_regresar_editar').addEventListener('click', return_editar);

            _('cbo_equipotic').addEventListener('change', req_change_equipotic_editar);
            _('cbo_tiposolicitud').addEventListener('change', req_change_tiposolicitud_editar);
            _('cbo_categoria').addEventListener('change', req_change_categoria_editar);
            _('cbo_sistema').addEventListener('change', req_change_sistema_editar);
            _('cbo_modulo').addEventListener('change', req_change_modulo_editar);
        }

        /* General */

        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = x.parentNode.parentNode;
                if (!padre.classList.contains('hide')) {
                    if (att) {
                        if ((valor == '') || (valor == '0' && cls_select2 == true))
                        { padre.classList.add('has-error'); resultado = false; }
                        else { padre.classList.remove('has-error'); }
                    }
                }
            })
            return resultado;
        }

        function required_item_class(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, //att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = x.parentNode.parentNode.parentNode;
                //if (att) {
                if ((valor == '') || (valor == '0' && cls_select2 == true))
                { padre.classList.add('has-error'); resultado = false; }
                else { padre.classList.remove('has-error'); }
                //}
            })
            return resultado;
        }

        function fn_clean_required_item() {
            var arr_required = [...document.getElementsByClassName('has-error')];
            arr_required.forEach(x => x.classList.remove('has-error'));
        }

        function fn_clean_data() {
            //_('txt_responsable').value = '';
            _('div_titulo').innerHTML = '';
            _('div_ticket_botonera_principal').innerHTML = '';
            _('div_ticket_span_tic').innerHTML = '';
            _('div_ticket_botonera_comentario').innerHTML = '';
            
            _('txt_fecha_inicio_tentativo').value = '';
            _('txt_fecha_fin_tentativo').value = '';
            _('txt_hora_tentativo').value = '';
            _('txt_fecha_inicio_real').value = '';
            _('txt_fecha_fin_real').value = '';
            _('txt_hora_real').value = '';
            _('txt_informe').value = '';
            _('tbl_file_tic').tBodies[0].innerHTML = '';
            _('txt_comentario').value = '';
            _('tbl_file_comentario').tBodies[0].innerHTML = '';
        }

        function fn_tabla_validar_cantidad_archivos(_tabla) {
            let tbl = _(_tabla).tBodies[0], tbl_rows_total = tbl.rows.length, row = null, arr = [];

            for (let i = 0; i < tbl_rows_total; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

                if (clsrow == undefined) {
                    let obj = {
                        idarchivo: parseInt(_par(par, 'idarchivo')),
                        tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                        nombrearchivooriginal: row.cells[1].innerText,
                        modificado: parseInt(_par(par, 'modificado'))
                    }
                    arr.push(obj);
                }
            }
            return arr;
        }

        function fn_tabla_obtener_archivos(_table) {
            let tbl = _(_table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

            for (let i = 0; i < totalfilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

                if (estamodificado == 1 && clsrow == undefined) {
                    let obj = {
                        idarchivo: parseInt(_par(par, 'idarchivo')),
                        tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                        nombrearchivooriginal: row.cells[1].innerText,
                        modificado: parseInt(_par(par, 'modificado'))
                    }
                    arr.push(obj);
                }
            }
            return arr;
        }
      
        /* Ticket - Update */
        function req_ticket_evento(e) {
            let x = e.currentTarget;
            let data_par = x.getAttribute('data-par');
            let accion = _getPar(data_par, 'accion')
                , texto_accion = _getPar(data_par, 'texto')
                , requerido = false, texto_alerta = 'Debe ingresar los campos requeridos';
            fn_clean_required_item();

            switch (accion) {
                case 'aprobar':
                    requerido = true;
                    break;
                case 'evaluar'://fecha inicio tentativo / fecha fin tentativo / hora tentativo
                    //requerido = true;
                    requerido = required_item_class({ id: 'tab-tic', clase: '_evaluar' });
                    //texto_alerta = 'Debe ingresar los campos requeridos'
                    break;
                case 'procesar':
                    requerido = true;
                    //texto_alerta = 'Debe ingresar los campos requeridos'
                    break;
                case 'atender':
                    //requerido = true;
                    requerido = required_item_class({ id: 'tab-tic', clase: '_atender' });
                    //texto_alerta = 'Debe ingresar los campos requeridos'
                    break;
                case 'continuar':
                    requerido = true;
                    //texto_alerta = 'Debe ingresar los campos requeridos'
                    break;
            }

            if (requerido) {
                swal({
                    title: "Esta seguro de " + texto_accion + " este ticket?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_ticket_evento(accion);
                });
            }
            else {
                swal({ title: "Alert", text: texto_alerta, type: "warning" }); return;
            }
        }

        function fn_ticket_evento(_accion) {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Update';

            let oticket = _getParameter({ id: 'tab-tic', clase: '_enty' })
                , arr_file_tic = fn_tabla_obtener_archivos('tbl_file_tic');

            oticket['idticket'] = ovariables.idticket;
            oticket['accion'] = _accion;
            form = new FormData();
            form.append('par', JSON.stringify(oticket));
            form.append('parsubdetail', JSON.stringify(arr_file_tic));

            tabla = _('tbl_file_tic').tBodies[0];

            let totalarchivos = tabla.rows.length, arrFile = [];
            for (let i = 0; i < totalarchivos; i++) {
                let row = tabla.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
                if (estamodificado == 1 && clsrow == undefined) {
                    let archivo = tabla.rows[i].cells[3].children[0].files[0];
                    //archivo.modificado = 1;
                    form.append('file' + i, archivo);
                }
            }

            Post(urlaccion, form, res_ticket_evento);
        }
         
        function res_ticket_evento(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    req_info();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        /* Ticket - Update - Modal */
        function req_ticket_evento_modal(e) {
            let x = e.currentTarget;
            let data_par = x.getAttribute('data-par');
            let accion = _getPar(data_par, 'accion')
                , texto_accion = _getPar(data_par, 'texto')
                , vista = _getPar(data_par, 'vista')
                , titulo = _getPar(data_par, 'titulo')
                , clase_color = 'bg-' + _getPar(data_par, 'color');
            fn_clean_required_item();


            let urlaccion = 'TecnologiaInformacion/HelpDesk/_' + vista;
            let parametro = 'idticket:' + ovariables.idticket + ',accion:' + accion + ',idsolicitante:' + ovariables.idsolicitante;
            fn_ticket_view_modal(parametro, urlaccion, vista, titulo, clase_color);
        }

        function fn_ticket_view_modal(_parametro, _urlaccion, _vista, _titulo, _clasecolor) {
            _modalBody_Opacity({
                url: _urlaccion,
                idmodal: _vista,
                paremeter: _parametro,
                title: _titulo,
                width: '',
                height: '',
                backgroundtitle: _clasecolor,
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        /* Ticket - Editar */
        function req_ticket_editar(e) {
            _('txt_descripcion').disabled = false;
            _('div_ticket_botonera_principal').classList.add('hide');
            _('div_ticket_botonera_editar').classList.remove('hide');
            required_item_disabled({ id: 'tab-registro', visualizar: '_cbo', ocultar: '_text' });

            req_load_item_editar();
        }       

        function required_item_disabled(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let visualizar_item = divformulario.getElementsByClassName(oenty.visualizar);
            let ocultar_item = divformulario.getElementsByClassName(oenty.ocultar);            
            let arr_visualizar_item = Array.prototype.slice.apply(visualizar_item);
            let arr_ocultar_item = Array.prototype.slice.apply(ocultar_item);

            arr_ocultar_item.forEach(x=> { x.classList.add('hide'); });
            arr_visualizar_item.forEach(x=> { x.classList.remove('hide'); });
        }

        function return_editar() {            
            _('txt_descripcion').disabled = true;
            _('div_ticket_botonera_principal').classList.remove('hide');
            _('div_ticket_botonera_editar').classList.add('hide');
            required_item_disabled({ id: 'tab-registro', visualizar: '_text', ocultar: '_cbo' });
            req_info();
        }

        function req_load_item_editar() {

            let ticket = ovariables_info.ticket;
            let idequipotic = ticket[0].idequipotic
                , idtiposolicitud = ticket[0].idtiposolicitud
                , idprioridad = ticket[0].idprioridad
                , idcategoria = ticket[0].idcategoria
                , idsistema = ticket[0].idsistema
                , idmodulo = ticket[0].idmodulo;

            fn_load_equipotic_editar(idequipotic);
            fn_load_tiposolicitud_editar(idtiposolicitud);
            fn_load_prioridad_editar(idprioridad);
            fn_load_categoria_editar(idcategoria);
            fn_load_sistema_editar(idsistema);
            fn_load_modulo_editar(idmodulo);
        }

        function fn_load_equipotic_editar(_idequipotic) {
            let arr_equipotic = ovariables_info.arr_equipotic
                , resultado_equipotic = arr_equipotic.filter(x=>x.idequipotic === _idequipotic)
                , cbo_equipotic = `<option value='0'>Seleccione Equipo TIC</option>`;

            if (arr_equipotic.length > 0) { arr_equipotic.forEach(x=> { cbo_equipotic += `<option value='${x.idequipotic}'>${x.equipotic}</option>`; }); }

            _('cbo_equipotic').innerHTML = cbo_equipotic;
            
            if (resultado_equipotic.length > 0) { _('cbo_equipotic').value = _idequipotic; }

        }

        function fn_load_tiposolicitud_editar(_idtiposolicitud) {
            let arr_tiposolicitud = ovariables_info.arr_tiposolicitud
                , resultado_tiposolicitud = arr_tiposolicitud.filter(x=>x.idtiposolicitud === _idtiposolicitud)
               , cbo_tiposolicitud = `<option value='0'>Seleccione Tipo Solicitud</option>`;

            if (arr_tiposolicitud.length > 0) { arr_tiposolicitud.forEach(x=> { cbo_tiposolicitud += `<option value='${x.idtiposolicitud}'>${x.tiposolicitud}</option>`; }); }

            _('cbo_tiposolicitud').innerHTML = cbo_tiposolicitud;

            if (resultado_tiposolicitud.length > 0) { _('cbo_tiposolicitud').value = _idtiposolicitud; }

        }

        function fn_load_prioridad_editar(_idprioridad) {
            let arr_prioridad = ovariables_info.arr_prioridad
                , resultado_prioridad = arr_prioridad.filter(x=>x.idprioridad === _idprioridad)
                , cbo_prioridad = ``;

            if (arr_prioridad.length > 0) { arr_prioridad.forEach(x=> { cbo_prioridad += `<option value='${x.idprioridad}'>${x.prioridad}</option>`; }); }

            _('cbo_prioridad').innerHTML = cbo_prioridad;

            if (resultado_prioridad.length > 0) { _('cbo_prioridad').value = _idprioridad; }

        }

        function fn_load_categoria_editar(_idcategoria) {
            let arr_categoria = ovariables_info.arr_categoria
                , idequipotic = _('cbo_equipotic').value, idtiposolicitud = _('cbo_tiposolicitud').value
                , resultado_categoria = [], cbo_categoria = `<option value='0'>Seleccione Categoria</option>`;

            if (ovariables.idtiporol > 0 && ovariables.agrupador == 'N') { resultado_categoria = arr_categoria.filter(x=>x.idequipotic.toString() === idequipotic && x.idtiposolicitud.toString() === idtiposolicitud); }
            else { resultado_categoria = arr_categoria.filter(x=>x.idequipotic.toString() === idequipotic && x.idtiposolicitud.toString() === idtiposolicitud && x.visualizacion === 'S'); }

            if (resultado_categoria.length > 0) { resultado_categoria.forEach(x => { cbo_categoria += `<option value='${x.idcategoria}'>${x.categoria}</option>` }); }

            _('cbo_categoria').innerHTML = cbo_categoria;
            
            if (_idcategoria != 0) {
                let resultado_categoria_editar = resultado_categoria.filter(x=>x.idcategoria === _idcategoria);
                if (resultado_categoria_editar.length > 0) { _('cbo_categoria').value = _idcategoria; }
            }
            
        }

        function fn_load_sistema_editar(_idsistema) {
            let arr_sistema = ovariables_info.arr_sistema
                , cbo_sistema = ``;

            if (arr_sistema.length > 0) { arr_sistema.forEach(x=> { cbo_sistema += `<option value='${x.idsistema}'>${x.sistema}</option>`; }); }

            _('cbo_sistema').innerHTML = cbo_sistema;

            if (_idsistema != 0) {
                let resultado_sistema_editar = arr_sistema.filter(x=>x.idsistema === _idsistema);
                if (resultado_sistema_editar.length > 0) { _('cbo_sistema').value = _idsistema; }
            }

        }

        function fn_load_modulo_editar(_idmodulo) {
            let arr_modulo = ovariables_info.arr_modulo
                , idsistema = _('cbo_sistema').value, resultado_modulo = []
                , cbo_modulo = `<option value='0'>Seleccione Modulo</option>`;

            resultado_modulo = arr_modulo.filter(x=> x.idsistema.toString() === idsistema);
            if (resultado_modulo.length > 0) { resultado_modulo.forEach(x=> { cbo_modulo += `<option value='${x.idmodulo}'>${x.modulo}</option>`; }); }

            _('cbo_modulo').innerHTML = cbo_modulo;

            if (_idmodulo != 0) {
                let resultado_modulo_editar = resultado_modulo.filter(x=>x.idmodulo === _idmodulo);
                if (resultado_modulo_editar.length > 0) { _('cbo_modulo').value = _idmodulo; }
            }
        }
        
        function req_change_equipotic_editar() {
            let idequipotic = _('cbo_equipotic').value
                , idtiposolicitud = _('cbo_tiposolicitud').value;

            if (idequipotic == '1') {
                _('div_sistema').classList.remove('hide');
                _('div_modulo').classList.remove('hide');
            } else {
                _('div_sistema').classList.add('hide');
                _('div_modulo').classList.add('hide');
            }

            fn_load_categoria_editar(0);
            fn_load_sistema_editar(0);
            fn_load_aprobador_editar();
        }

        function req_change_tiposolicitud_editar() {
            fn_load_categoria_editar(0);
            fn_load_aprobador_editar();
        }

        function req_change_categoria_editar() {
            fn_load_aprobador_editar();
        }

        function req_change_sistema_editar() {
            fn_load_modulo_editar();
            fn_load_aprobador_editar();
        }

        function req_change_modulo_editar() {
            fn_load_aprobador_editar();
        }

        function fn_load_aprobador_editar() {
            let arr_aprobadorarea = ovariables_info.arr_aprobadorarea
                , arr_aprobadormodulo = ovariables_info.arr_aprobadormodulo
                , arr_categoria = ovariables_info.arr_categoria
                //, idsolicitante = _('cbo_solicitante').value
                //, idareasolicitante = _('cbo_area_solicitante').value
                , idequipotic = _('cbo_equipotic').value
                , idtiposolicitud = _('cbo_tiposolicitud').value
                , idcategoria = _('cbo_categoria').value
                , idmodulo = _('cbo_modulo').value
                , resultado_aprobador = [], resultado_categoria = [];

            let html = '', firmado, btn_estado = '';

            if (idequipotic == '1') {
                resultado_aprobador = arr_aprobadormodulo.filter(x=> x.idmodulo.toString() === idmodulo);
            }
            else {
                resultado_aprobador = arr_aprobadorarea.filter(x=> x.idarea === ovariables.idareasolicitante);
            }

            resultado_categoria = arr_categoria.filter(x=>x.idcategoria.toString() === idcategoria);
            categoriaaprobacion = resultado_categoria.length > 0 && idcategoria != '0' ? resultado_categoria[0].aprobacion : 'S';

            resultado_aprobador.forEach(x=> {
                if (x.idusuario == ovariables.idsolicitante || idtiposolicitud == '1' || categoriaaprobacion == 'N') {
                    firmado = 'S';
                    btn_estado = `<button class='btn btn-outline btn-primary'><span class ='fa fa-check-circle'></span></button>`
                }
                else {
                    firmado = 'N';
                    btn_estado = `<button class='btn btn-outline btn-danger'><span class ='fa fa-clock-o'></span></button>`;
                }

                html += `<tr data-par='idaprobador:${x.idaprobador},firmado:${firmado}'>
                        <td class ='cols-sm-2 text-center'>${btn_estado}</td>
                        <td class ='cols-sm-5'>${x.aprobador}</td>
                        <td class ='cols-sm-4'>${x.correoaprobador}</td>
                    <tr>`
            });

            _('tbl_aprobador').tBodies[0].innerHTML = html;

            if (idtiposolicitud == '2') {
                _('div_tabla_aprobador').classList.remove('hide');
            }
            else {
                _('div_tabla_aprobador').classList.add('hide');
            }

        }

        function req_guardar_editar() {
            let req = required_item({ id: 'tab-registro', clase: '_enty' });
            if (req) {
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
                    fn_guardar_editar();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function fn_guardar_editar() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Edit';

            let oticket = _getParameter({ id: 'tab-registro', clase: '_enty' })
                , arr_aprobador = fn_get_aprobador('tbl_aprobador');
            form = new FormData();
            oticket['codigoestado'] = ovariables.codigoestado;
            oticket['idticket'] = ovariables.idticket;
            oticket['idsolicitante'] = ovariables.idsolicitante;
            form.append('par', JSON.stringify(oticket));
            form.append('pardetail', JSON.stringify(arr_aprobador));

            tabla = _('tbl_file_user').tBodies[0];

            let totalarchivos = tabla.rows.length, arrFile = [];
            for (let i = 0; i < totalarchivos; i++) {
                let row = tabla.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
                if (estamodificado == 1 && clsrow == undefined) {
                    let archivo = tabla.rows[i].cells[3].children[0].files[0];
                    archivo.modificado = 1;
                    form.append('file' + i, archivo);
                }
            }

            Post(urlaccion, form, res_guardar_editar);
        }

        function res_guardar_editar(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    return_editar();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_get_aprobador(_idtable) {
            let table = _(_idtable), array = [...table.tBodies[0].rows], arr_result = [], obj = {};
            if (array.length > 0) {
                array.forEach(x=> {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    if (par != null) {
                        idaprobador = _par(par, 'idaprobador'),
                        firmado = _par(par, 'firmado');
                        obj.idaprobador = idaprobador;
                        obj.firmado = firmado;
                        arr_result.push(obj);
                    }
                });
            }

            if (arr_result.length > 0) {
                let codigoestado = arr_result.some(x=> { if (x.firmado === 'N') { return true } });
                if (codigoestado) { ovariables.codigoestado = 'PP'; } else { ovariables.codigoestado = ''; }
            }
            else { ovariables.codigoestado = ''; }

            return arr_result;
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

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { accion: 'editar' };
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Get_Usuario_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_info.arr_solicitante = rpta[0].solicitante != '' ? JSON.parse(rpta[0].solicitante) : '';
                        ovariables_info.arr_aprobadorarea = rpta[0].aprobadorarea != '' ? JSON.parse(rpta[0].aprobadorarea) : [];
                        ovariables_info.arr_aprobadormodulo = rpta[0].aprobadormodulo != '' ? JSON.parse(rpta[0].aprobadormodulo) : [];
                        ovariables_info.arr_equipotic = rpta[0].equipotic != '' ? JSON.parse(rpta[0].equipotic) : [];
                        ovariables_info.arr_tiposolicitud = rpta[0].tiposolicitud != '' ? JSON.parse(rpta[0].tiposolicitud) : [];
                        ovariables_info.arr_prioridad = rpta[0].prioridad != '' ? JSON.parse(rpta[0].prioridad) : [];
                        ovariables_info.arr_categoria = rpta[0].categoria != '' ? JSON.parse(rpta[0].categoria) : [];
                        ovariables_info.arr_sistema = rpta[0].sistema != '' ? JSON.parse(rpta[0].sistema) : [];
                        ovariables_info.arr_modulo = rpta[0].modulo != '' ? JSON.parse(rpta[0].modulo) : [];
                        ovariables_info.arr_estado = rpta[0].estado != '' ? JSON.parse(rpta[0].estado) : [];
                        ovariables_info.arr_tipoatencion = rpta[0].tipoatencion != '' ? JSON.parse(rpta[0].tipoatencion) : [];
                        ovariables_info.arr_tipovalorizacion = rpta[0].tipovalorizacion != '' ? JSON.parse(rpta[0].tipovalorizacion) : [];
                    }
                    fn_load_info_usuario();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_info_usuario() {
            let informacion_usuario = ovariables_info.informacion_usuario;
            ovariables.tipousuario = informacion_usuario[0].tipousuario;

            let arr_tipoatencion = ovariables_info.arr_tipoatencion
                , cbo_tipoatencion;

            if (arr_tipoatencion.length > 0) {
                arr_tipoatencion.forEach(x=> { cbo_tipoatencion += `<option value='${x.idtipoatencion}'>${x.tipoatencion}</option>`; });
                _('cbo_tipo_atencion').innerHTML = cbo_tipoatencion;
            }

            fn_load_view_items();
        }

        function fn_load_view_items() {
            if (ovariables.tipousuario == 'SOL') {
                _('cbo_tipo_atencion').disabled = true;
                _('div_hora_tentativa').classList.add('hide');
                _('div_hora_real').classList.add('hide');
                _('txt_informe').disabled = true;
            }
            else {
                _('cbo_tipo_atencion').disabled = false;
                _('div_hora_tentativa').classList.remove('hide');
                _('div_hora_real').classList.remove('hide');
                _('txt_informe').disabled = false;
            }
        }
       
        function req_info() {
            let err = function (__err) {
                console.log('err', __err)
            };
            let parametro = {
                idticket: ovariables.idticket
            }
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.ticket = rpta[0].ticket != '' ? JSON.parse(rpta[0].ticket) : [];
                        ovariables_info.arr_ticketresponsable = rpta[0].ticketresponsable != '' ? JSON.parse(rpta[0].ticketresponsable) : [];
                        ovariables_info.arr_ticketaprobador = rpta[0].ticketaprobador != '' ? JSON.parse(rpta[0].ticketaprobador) : [];
                        ovariables_info.arr_ticketarchivo = rpta[0].ticketarchivo != '' ? JSON.parse(rpta[0].ticketarchivo) : [];
                        ovariables_info.arr_ticketarchivo_solicitante = rpta[0].ticketarchivo_solicitante != '' ? JSON.parse(rpta[0].ticketarchivo_solicitante) : [];
                        ovariables_info.arr_ticketarchivo_tic = rpta[0].ticketarchivo_tic != '' ? JSON.parse(rpta[0].ticketarchivo_tic) : [];
                        ovariables_info.arr_ticketcomentario = rpta[0].ticketcomentario != '' ? JSON.parse(rpta[0].ticketcomentario) : [];
                        ovariables_info.arr_ticketboton = rpta[0].ticketboton != '' ? JSON.parse(rpta[0].ticketboton) : [];
                    }

                    fn_clean_data();
                    fn_clean_required_item();
                    fn_load_ticket_boton();
                    fn_load_ticket();
                    fn_load_ticket_responsable();
                    fn_load_ticket_aprobador();
                    fn_load_ticket_archivo_solicitante();
                    fn_load_ticket_archivo_tic();
                    fn_load_ticket_comentario();
                }, (p) => { err(p); });
        }

        function fn_load_ticket_boton() {
            let arr_ticketboton = ovariables_info.arr_ticketboton
                , div_ticket_botonera_principal = '';

            let arr_ubicacion_boton = Array.from(new Set(arr_ticketboton.filter(y=>y.tipoboton === 'button').map(x => x.ubicacion)))
            , arr_ubicacion_span = Array.from(new Set(arr_ticketboton.filter(y=>y.tipoboton === 'span').map(x => x.ubicacion)));

            if (arr_ticketboton.length > 0) {
                arr_ubicacion_boton.forEach(x=> {
                    document.getElementById(x).innerHTML =
                        arr_ticketboton.filter(y=>y.ubicacion === x && y.tipoboton === 'button').map(z=> {
                            return `<button id='${z.id}' type='button' title='${z.titulo}' class ='${z.clase}' onclick='app_Ticket_Editar.${z.funcion}(event)' data-par='accion:${z.accion},texto:${z.texto},vista:${z.vista},titulo:${z.titulo},color:${z.color}'>
                                        <span class ='${z.icono}'></span>
                                        ${z.nombre}
                                    </button>`;
                        }).join(' ');
                });
                arr_ubicacion_span.forEach(x=> {
                    document.getElementById(x).innerHTML =
                       arr_ticketboton.filter(y=>y.ubicacion === x && y.tipoboton === 'span').map(z=> {
                           return `<span class='${z.clase}' title='${z.titulo}'>
                                    <span class ='${z.icono}'></span>
                                    <input id='${z.id}' class ='text-right' type='file' onchange='app_Ticket_Editar.${z.funcion}(event)'/>
                                </span>`;
                       }).join(' ');
                });
            }
        }

        function fn_load_ticket() {
            let ticket = ovariables_info.ticket;

            fn_view_sistema_modulo(ticket[0].idequipotic);

            let titulo = ('TICKET N ° ' + ticket[0].numeroticket + ' : ' + ticket[0].estado).toUpperCase();
            let label_titulo = `<label class='form-control ${ticket[0].fondo}'>${titulo}</label>`;
            _('div_titulo').innerHTML = label_titulo;

            ovariables.idsolicitante = ticket[0].idsolicitante;
            ovariables.idareasolicitante = ticket[0].idareasolicitante
            _('txt_solicitante').value = ticket[0].solicitante;
            _('txt_area_solicitante').value = ticket[0].areasolicitante;
            _('txt_equipotic').value = ticket[0].equipotic;
            _('txt_tiposolicitud').value = ticket[0].tiposolicitud;
            _('txt_fecha_solicitud').value = ticket[0].fechasolicitud;
            _('txt_prioridad').value = ticket[0].prioridad;
            _('txt_categoria').value = ticket[0].categoria;
            _('txt_sistema').value = ticket[0].sistema;
            _('txt_modulo').value = ticket[0].modulo;
            _('txt_descripcion').value = ticket[0].descripcion;

            if (ticket[0].idtipoatencion != 0) {
                _('cbo_tipo_atencion').value = ticket[0].idtipoatencion;
            }
            
            $('#div_fecha_inicio_tentativo .input-group.date').datepicker('setDate', ticket[0].fechainiciotentativo);
            $('#div_fecha_fin_tentativo .input-group.date').datepicker('setDate', ticket[0].fechafintentativo);
            _('txt_hora_tentativo').value = ticket[0].horatentativo;
            _('txt_minuto_tentativo').value = ticket[0].minutotentativo;
            $('#div_fecha_inicio_real .input-group.date').datepicker('setDate', ticket[0].fechainicioreal);
            $('#div_fecha_fin_real .input-group.date').datepicker('setDate', ticket[0].fechafinreal);
            _('txt_hora_real').value = ticket[0].horareal;
            _('txt_minuto_real').value = ticket[0].minutoreal;

            _('txt_informe').value = ticket[0].informe;
        }

        function fn_load_ticket_responsable() {
            let arr_ticketresponsable = ovariables_info.arr_ticketresponsable;
            let responsable = arr_ticketresponsable.filter(x=>x.responsable === 'S')
                , arr_sub_responsable = arr_ticketresponsable.filter(x=>x.responsable === 'N')
                , html_sub_responsable = '';

            if (responsable.length > 0) { _('txt_responsable').value = responsable[0].nombreresponsable; }

            if (arr_sub_responsable.length > 0) {
                _('div_tabla_sub_responsable').classList.remove('hide');

                arr_sub_responsable.forEach(x=> { html_sub_responsable += `<tr><td></td><td>${x.nombreresponsable}</td></tr>`; });

                _('tbl_sub_responsable').tBodies[0].innerHTML = html_sub_responsable;
            }
            else { _('div_tabla_sub_responsable').classList.add('hide'); _('tbl_sub_responsable').tBodies[0].innerHTML = '' }

        }

        function fn_view_sistema_modulo(_idequipotic) {
            if (_idequipotic == 1) {
                _('div_sistema').classList.remove('hide');
                _('div_modulo').classList.remove('hide');
            }
            else {
                _('div_sistema').classList.add('hide');
                _('div_modulo').classList.add('hide');
            }
        }

        function fn_load_ticket_aprobador() {
            let ticket = ovariables_info.ticket;
            let arr_ticketaprobador = ovariables_info.arr_ticketaprobador
                , idtiposolicitud = ticket[0].idtiposolicitud
                , html = '';

            if (arr_ticketaprobador.length > 0) {
                
                arr_ticketaprobador.forEach(x=> {
                    if (x.firmado == 'S') { btn_estado = `<button class='btn btn-outline btn-primary'><span class ='fa fa-check-circle'></span></button>` }
                    else { btn_estado = `<button class='btn btn-outline btn-danger'><span class ='fa fa-clock-o'></span></button>`; }

                    html += `<tr data-par='idaprobador:${x.idaprobador},firmado:${x.firmado}'>
                                <td class ='cols-sm-2 text-center'>${btn_estado}</td>
                                <td class ='cols-sm-5'>${x.aprobador}</td>
                                <td class ='cols-sm-4'>${x.correoaprobador}</td>
                            <tr>`
                    ;
                });
            }

            _('tbl_aprobador').tBodies[0].innerHTML = html;

            if (idtiposolicitud == '2') {
                _('div_tabla_aprobador').classList.remove('hide');
            }
            else {
                _('div_tabla_aprobador').classList.add('hide');
            }

        }

        function fn_load_ticket_comentario() {
            let arr_ticketcomentario = ovariables_info.arr_ticketcomentario
                , arr_ticketarchivo = ovariables_info.arr_ticketarchivo
                , html = '';
            //<a href="http://www.example.com"><span>My span is a link !</span></a>
            if (arr_ticketcomentario.length > 0) {
                arr_ticketcomentario.forEach(x=> {
                    let html_archivo = ''
                        , resultado_archivo_comentario = arr_ticketarchivo.filter(y=>y.idticketcomentario === x.idticketcomentario);

                    if (resultado_archivo_comentario.length > 0) {
                        resultado_archivo_comentario.forEach(m=> {
                            html_archivo += `<a data-par='nombrearchivo:${m.nombrearchivo}'><span class ='message-content _download text-navy'><span class="fa fa-download"></span> ${m.nombrearchivooriginal}</span></a>`;
                        });
                    }

                    html += `<div class='chat-message ${x.posicion}'>
                            <div class ='message'>
                                 <a class ='message-author' href="#">${x.usuario}</a>
                                 <span class ='message-date'>${x.fecha}</span>
                                 <span class ='message-content'>${x.comentario}</span>
                                 ${html_archivo}
                            </div>
                        </div>`;
                });

                _('div_ticket_comentario').innerHTML = html;
                handler_load_ticket_comentario();
            }
        }

        function handler_load_ticket_comentario() {
            let tbl = _('div_ticket_comentario'), array_download = _Array(tbl.getElementsByClassName('_download'));
            array_download.forEach(x => x.addEventListener('click', e => { controlador_load_ticket_comentario(e, 'download'); }));
        }

        function controlador_load_ticket_comentario(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                event_load_ticket_comentario(par, accion, fila);
            }
        }

        function event_load_ticket_comentario(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    fila.classList.add('hide');
                    break;
                case 'download':
                    download_load_ticket_comentario(fila);
                    break;
            }
        }

        function download_load_ticket_comentario(fila) {
            let par = fila.getAttribute('data-par');
            let nombrearchivooriginal = fila.innerText.trim(), nombrearchivo = _par(par, 'nombrearchivo');
            let urlaccion = '../TecnologiaInformacion/HelpDesk/HelpDesk_Download?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

            var link = document.createElement('a');
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        /* Archivo - Solicitante */
        function fn_load_ticket_archivo_solicitante() {
            let arr_ticketarchivo_solicitante = ovariables_info.arr_ticketarchivo_solicitante
               , html = '';

            if (arr_ticketarchivo_solicitante.length > 0) {

                _('div_file_user').classList.remove('hide');

                arr_ticketarchivo_solicitante.forEach(x=> {

                    html += `<tr data-par='idarchivo:${x.idticketarchivo},tipoarchivo:${x.tipoarchivo},modificado:0,nombrearchivo:${x.nombrearchivo}'>
                                 <td class ='text-center'>
                                    <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-success btn-sm _download'>
                                            <span class ='fa fa-download'></span>
                                        </button>
                                    </div>
                                </td>
                                <td class ='cols-sm-2'>${x.nombrearchivooriginal}</td>
                                <td class ='text-center'></td>
                                <td class ='hide'></td>
                            </tr>`
                    ;
                });

                _('tbl_file_user').tBodies[0].innerHTML = html;
                handler_load_table_file_user();
            }
        }

        function handler_load_table_file_user() {
            let tbl = _('tbl_file_user'), array_download = _Array(tbl.getElementsByClassName('_download'));
            array_download.forEach(x => x.addEventListener('click', e => { controlador_load_table_file_user(e, 'download'); }));
        }

        function controlador_load_table_file_user(event, accion) {
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
                event_load_table_file_user(par, accion, fila);
            }
        }

        function event_load_table_file_user(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    fila.classList.add('hide');
                    break;
                case 'download':
                    download_load_file_user(fila);
                    break;
            }
        }

        function download_load_file_user(fila) {
            let par = fila.getAttribute('data-par');
            let nombrearchivooriginal = fila.cells[1].innerText, nombrearchivo = _par(par, 'nombrearchivo');
            let urlaccion = '../TecnologiaInformacion/HelpDesk/HelpDesk_Download?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

            var link = document.createElement('a');
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        /* Archivo - TIC */
        function fn_load_ticket_archivo_tic() {
            let arr_ticketarchivo_tic = ovariables_info.arr_ticketarchivo_tic,
               html = '', btn_drop = '', tabla = _('tbl_file_tic').tBodies[0];

            if (arr_ticketarchivo_tic.length > 0) {

                if (ovariables.tipousuario == 'TIC') {
                    btn_drop = ` <div class ='btn-group'>
                                        <button class ='btn btn-outline btn-danger btn-sm _delete'>
                                            <span class ='fa fa-trash-o'></span>
                                        </button>
                                    </div>`;
                }

                arr_ticketarchivo_tic.forEach(x=> {

                    html += `<tr data-par='idarchivo:${x.idticketarchivo},tipoarchivo:${x.tipoarchivo},modificado:0,nombrearchivo:${x.nombrearchivo}'>
                                <td class ='text-center'>${btn_drop}</td>
                                <td class ='cols-sm-2'>${x.nombrearchivooriginal}</td>
                                <td class ='text-center'>
                                    <div class ='btn-group'>
                                            <button class ='btn btn-outline btn-success btn-sm _download'>
                                                <span class ='fa fa-download'></span>
                                            </button>
                                    </div>
                                </td>
                                <td class ='hide'></td>
                            </tr>`
                    ;
                });

                tabla.innerHTML = html;
                handler_load_table_file_tic();
            }
        }

        function handler_load_table_file_tic() {
            let tbl = _('tbl_file_tic'), array_download = _Array(tbl.getElementsByClassName('_download'))
            , array_delete = _Array(tbl.getElementsByClassName('_delete'));
            array_download.forEach(x => x.addEventListener('click', e => { controlador_load_table_file_tic(e, 'download'); }));
            array_delete.forEach(x => x.addEventListener('click', e => { controlador_load_table_file_tic(e, 'delete'); }));
        }

        function controlador_load_table_file_tic(event, accion) {
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
                event_load_table_file_tic(par, accion, fila);
            }
        }

        function event_load_table_file_tic(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    fila.classList.add('hide');
                    break;
                case 'delete':
                    delete_load_file_tic(fila);
                    break;
                case 'download':
                    download_load_file_tic(fila);
                    break;
            }
        }

        function download_load_file_tic(_fila) {
            let par = _fila.getAttribute('data-par');
            let nombrearchivooriginal = _fila.cells[1].innerText, nombrearchivo = _par(par, 'nombrearchivo');
            let urlaccion = '../TecnologiaInformacion/HelpDesk/HelpDesk_Download?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivo=' + nombrearchivo;

            var link = document.createElement('a');
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function delete_load_file_tic(_fila) {
            swal({
                title: "Esta seguro de eliminar este archivo?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_delete_file_tic(_fila)
            });
        }

        function fn_delete_file_tic(_fila) {
            let par = _fila.getAttribute('data-par');
            let idticketarchivo = _par(par, 'idarchivo');

            let oticketarchivo = { idticketarchivo: idticketarchivo };
            form = new FormData();
            form.append('par', JSON.stringify(oticketarchivo));
            Post('TecnologiaInformacion/HelpDesk/Ticket_Delete_Archivo', form, function (response) {
                let orpta = response !== '' ? JSON.parse(response) : null;
                if (orpta != null) {
                    if (orpta.estado === 'success') {
                        swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                        _fila.classList.add('hide');
                        req_info();
                    };
                    if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
                }
            });
        }

        function req_ticket_cargar_archivo_tic(e) {
            let archivo = e.currentTarget.value,
               id = e.currentTarget.id;
            if (archivo != '') {
                let contador = fn_tabla_validar_cantidad_archivos('tbl_file_tic');
                if (contador.length < 2) {
                    let ultimopunto = archivo.lastIndexOf(".");
                    let ext = archivo.substring(ultimopunto + 1);
                    ext = ext.toLowerCase();
                    let nombre = e.target.files[0].name, html = '';
                    let file = e.target.files;

                    html = `<tr data-par='idarchivo:0,tipoarchivo:1,modificado:1'>
                        <td class='text-center'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td>${nombre}</td>
                        <td class ='text-center'></td>
                        <td class='hide'></td>
                    </tr>`;

                    _('tbl_file_tic').tBodies[0].insertAdjacentHTML('beforeend', html);

                    let tbl = _('tbl_file_tic').tBodies[0], total = tbl.rows.length;
                    let filexd = _(id).cloneNode(true);
                    filexd.setAttribute('id', 'file' + (total - 1));
                    tbl.rows[total - 1].cells[3].appendChild(filexd);
                    handler_table_file_tic(total);
                }
                else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning' }); }
            }
        }
        
        function handler_table_file_tic(indice) {
            let tbl = _('tbl_file_tic'), rows = tbl.rows[indice];
            rows.getElementsByClassName('_drop')[0].addEventListener('click', e => { controlador_load_table_file_tic(e, 'drop'); });
        }

        /* Ticket - Comentario */
        function req_ticket_cargar_archivo_comentario(e) {
            let archivo = e.currentTarget.value,
                id = e.currentTarget.id;
            if (archivo != '') {
                let contador = fn_tabla_validar_cantidad_archivos('tbl_file_comentario');
                if (contador.length < 2) {
                    let ultimopunto = archivo.lastIndexOf(".");
                    let ext = archivo.substring(ultimopunto + 1);
                    ext = ext.toLowerCase();
                    let nombre = e.target.files[0].name, html = '';
                    let file = e.target.files;

                    html = `<tr data-par='idarchivo:0,tipoarchivo:1,modificado:1'>
                        <td class='text-center'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _drop'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td>${nombre}</td>
                        <td class ='text-center'></td>
                        <td class='hide'></td>
                    </tr>`;

                    _('tbl_file_comentario').tBodies[0].insertAdjacentHTML('beforeend', html);

                    let tbl = 'tbl_file_comentario'
                        , tbl_body = _(tbl).tBodies[0]
                        , tbl_rows_total = tbl_body.rows.length;
                    let filexd = _(id).cloneNode(true);
                    filexd.setAttribute('id', 'file' + (tbl_rows_total - 1));
                    tbl_body.rows[tbl_rows_total - 1].cells[3].appendChild(filexd);
                    fn_tabla_agregar_evento(tbl, tbl_rows_total);
                }
                else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning' }); }
            }
        }
         
        function fn_tabla_agregar_evento(_tabla, _indice) {
            let tbl = _(_tabla), arr_download = _Array(tbl.getElementsByClassName('_download'))
                , arr_delete = _Array(tbl.getElementsByClassName('_delete')), arr_drop = _Array(tbl.getElementsByClassName('_drop'));

            if (arr_download.length > 0) { arr_download.forEach(x => x.addEventListener('click', e => { fn_tabla_controlar_eventos(e, 'download'); })); }
            if (arr_delete.length > 0) { arr_delete.forEach(x => x.addEventListener('click', e => { fn_tabla_controlar_eventos(e, 'delete'); })); }
            if (arr_drop.length > 0) { arr_drop.forEach(x => x.addEventListener('click', e => { fn_tabla_controlar_eventos(e, 'drop'); })); }

        }

        function fn_tabla_controlar_eventos(event, accion) {
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
                fn_tabla_ejecutar_eventos(par, accion, fila);
            }
        }

        function fn_tabla_ejecutar_eventos(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    fila.classList.add('hide');
                    break;
                    //case 'delete':
                    //    delete_load_file_tic(fila);
                    //    break;
                    //case 'download':
                    //    download_load_file_tic(fila);
                    //    break;
            }
        }

        function req_ticket_enviar_comentario() {
            let requerido = required_item_class({ id: 'tab-detalle', clase: '_comentar' });

            if (requerido) {
                swal({
                    title: "Esta seguro de enviar este comentario?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_ticket_enviar_comentario();
                });
            }
            else { swal({ title: 'Alert', text: 'Debe ingresar un comentario', type: 'warning' }); }
        }

        function fn_ticket_enviar_comentario() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Insert_Comentario'
           , comentario = _('txt_comentario').value;

            let ocomentario = { idticket: ovariables.idticket, idsolicitante: ovariables.idsolicitante, comentario: comentario }
            , arr_file_comentario = fn_tabla_obtener_archivos('tbl_file_comentario');
            form = new FormData();
            form.append('par', JSON.stringify(ocomentario));
            form.append('parsubdetail', JSON.stringify(arr_file_comentario));

            tbl = _('tbl_file_comentario').tBodies[0];

            let totalarchivos = tbl.rows.length, arrFile = [];
            for (let i = 0; i < totalarchivos; i++) {
                let row = tbl.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
                if (estamodificado == 1 && clsrow == undefined) {               
                    let archivo = tbl.rows[i].cells[3].children[0].files[0];
                    //archivo.modificado = 1;
                    form.append('file' + i, archivo);
                }
            }

            Post(urlaccion, form, res_ticket_enviar_comentario);
        }

        function res_ticket_enviar_comentario(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha registrado un nuevo comentario correctamente", type: "success" });
                    fn_clean_data();
                    req_info();
                };
                if (orpta.estado === 'error') {
                    swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" });
                }
            }
        }
     

        function req_ticket_regresar() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Inicio',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }
       
        return {
            load: load
            , req_ini: req_ini
            , req_ticket_evento: req_ticket_evento
            , req_ticket_evento_modal: req_ticket_evento_modal
            , req_ticket_editar: req_ticket_editar
            , req_ticket_enviar_comentario: req_ticket_enviar_comentario
            , req_ticket_regresar: req_ticket_regresar
            , req_ticket_cargar_archivo_tic: req_ticket_cargar_archivo_tic
            , req_ticket_cargar_archivo_comentario: req_ticket_cargar_archivo_comentario

        }

    }
)(document, 'pnl_ticket_editar');

(function ini() {
    app_Ticket_Editar.load();
    app_Ticket_Editar.req_ini();
})();
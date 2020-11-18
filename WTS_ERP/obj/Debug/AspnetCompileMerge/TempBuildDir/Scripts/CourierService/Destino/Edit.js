var app_Destino_Edit = (
function (d, idpadre) {

        var ovariables_informacion = {
            iddestino: 0,
            informacion_usuario: '',
            arr_ruta: '',
            arr_distrito: '',
            idusuario: '',
            nivel: 0
        }

        var ovariables_data = {
            informacion_destino: [],
            arr_direccion: 0
        }

        function load() {
            let par = _('txtpar_destino').value;
            if (!_isEmpty(par)) { ovariables_informacion.iddestino = _par(par, 'iddestino'); }

            _('btn_retornar').addEventListener('click', fn_return);
            _('btn_guardar').addEventListener('click', req_save);

            _('btn_direccion_nuevo').addEventListener('click', req_new);
            _('btn_direccion_agregar').addEventListener('click', req_add);
            _('btn_direccion_limpiar').addEventListener('click', req_clean);
        }
        

        function fn_return() {
            let urlaccion = 'CourierService/Destino/Index',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

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

        /* Principal */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: 0 };
            let urlaccion = 'CourierService/Destino/Destino_Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.arr_ruta = rpta[0].ruta != '' ? JSON.parse(rpta[0].ruta) : [];
                        ovariables_informacion.arr_distrito = rpta[0].distrito != '' ? JSON.parse(rpta[0].distrito) : [];
                    }
                    fn_load_informacion();
                    fn_load_ruta();
                    fn_load_distrito();
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;
        }

        function fn_load_ruta() {
            let arr_ruta = ovariables_informacion.arr_ruta,
              cbo_ruta = `<option value='0'>Seleccione una Ruta</option>`;
            if (arr_ruta.length > 0) { arr_ruta.forEach(x=> { cbo_ruta += `<option value='${x.idruta}'>${x.ruta}</option>`; }); }

            _('cbo_ruta').innerHTML = cbo_ruta;
            $('#cbo_ruta').select2();
        }

        function fn_load_distrito() {
            let arr_distrito = ovariables_informacion.arr_distrito,
              cbo_distrito = `<option value='0'>Seleccione un Distrito</option>`;
            if (arr_distrito.length > 0) { arr_distrito.forEach(x=> { cbo_distrito += `<option value='${x.iddistrito}'>${x.distrito}</option>`; }); }

            _('cbo_distrito').innerHTML = cbo_distrito;
            $('#cbo_distrito').select2();
        }

        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { iddestino: ovariables_informacion.iddestino };
            let urlaccion = 'CourierService/Destino/Destino_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.informacion_destino = rpta[0].informacion_destino != '' ? JSON.parse(rpta[0].informacion_destino) : '';
                        ovariables_data.arr_direccion = rpta[0].direccion != '' ? JSON.parse(rpta[0].direccion) : [];
                    }
                    fn_load_destino();
                    fn_load_direccion();
                }, (p) => { err(p); });
        }

        function fn_load_destino(){
            let informacion_destino = ovariables_data.informacion_destino;
            _('txt_destino').value = informacion_destino[0].destino;
            _('txt_resumido').value = informacion_destino[0].destinoresumido;
            _('txt_descripcion').value = informacion_destino[0].descripcion;
        }

        function fn_load_direccion() {
            let arr_direccion = ovariables_data.arr_direccion;
            if (arr_direccion.length > 0) {
                let html = ``;
                arr_direccion.forEach(x=> {
                    html +=
                        `<tr data-par='iddestino:${x.iddestino},iddestinodireccion:${x.iddestinodireccion},idruta:${x.idruta},iddistrito:${x.iddistrito}'>
                            <td class ='text-center' style='width:10%'>
                                <button title='Editar' type='button' class ='btn btn-outline btn-success _edit_direccion'>
                                    <span class ='fa fa-edit'></span>
                                </button>
                                <button title='Eliminar' type='button' class ='btn btn-outline btn-danger _delete_direccion'>
                                    <span class='fa fa-remove'></span>
                                </button>
                            </td>
                            <td style='width:20%'>${x.direccion}</td>
                            <td style='width:20%'>${x.referencia}</td>
                            <td style='width:20%'>${x.distrito}</td>
                            <td style='width:10%'>${x.ruta}</td>
                            <td style='width:10%'>${x.latitud}</td>
                            <td style='width:10%'>${x.longitud}</td>
                        </tr>`;
                });
               
                _('tbl_direccion').tBodies[0].innerHTML = html;

                let tbl = _('tbl_direccion').tBodies[0], total = tbl.rows.length;
                handler_table();
            }
        }
        
        /* Direccion */
        function req_new() {
            _('div_direccion_botonera_principal').classList.add('hide');
            _('div_direccion_botonera_secundario').classList.remove('hide');
            _('div_direccion_form').classList.remove('hide');
        }

        function req_clean() {
            clean_form();
            _('div_direccion_botonera_principal').classList.remove('hide');
            _('div_direccion_botonera_secundario').classList.add('hide');
            _('div_direccion_form').classList.add('hide');
        }

        function req_add() {

            let req = required_item({ id: 'div_direccion_form', clase: '_enty' });

            if (req) {

                let odireccion = _getParameter({ id: 'div_direccion_form', clase: '_enty' });
                let distrito = _('cbo_distrito').value !== '0' ? _('cbo_distrito').options[_('cbo_distrito').selectedIndex].text : '',
                    ruta = _('cbo_ruta').options[_('cbo_ruta').selectedIndex].text;

                let html =
                    `<tr data-par='iddestino:${ovariables_informacion.iddestino},iddestinodireccion:0,idruta:${odireccion.idruta},iddistrito:${odireccion.iddistrito}'>
                        <td class ='text-center' style='width:1%'>                          
                            <button title='Eliminar' type='button' class='btn btn-outline btn-danger _delete_direccion'>
                                <span class='fa fa-remove'></span>
                            </button>                           
                        </td>
                        <td>${odireccion.direccion}</td>
                        <td>${odireccion.referencia}</td>
                        <td>${distrito}</td>
                        <td>${ruta}</td>
                        <td>${odireccion.latitud}</td>
                        <td>${odireccion.longitud}</td>
                    </tr>`;

                _('tbl_direccion').tBodies[0].insertAdjacentHTML('beforeend', html);

                let tbl = _('tbl_direccion').tBodies[0], total = tbl.rows.length;
                handler_table();

                clean_form();
            }
            else {
                swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" });
            }

        }

        function handler_table_new(indice) {
            let tbl = _('tbl_direccion'), rows = tbl.rows[indice];
            rows.getElementsByClassName('_delete_direccion')[0].addEventListener('click', e => {
                control_accion(e, 'drop');
            });

            rows.getElementsByClassName('_edit_direccion')[0].addEventListener('click', e => {
                control_accion(e, 'edit');
            });
        }

        function clean_form() {
            _('txt_direccion').value = '';
            _('txt_referencia').value = '';
            $('#cbo_distrito').select2('val', '0');
            $('#cbo_ruta').select2('val', '0');
            _('txt_latitud').value = '';
            _('txt_longitud').value = '';
            var arr2 = [...document.getElementsByClassName('has-error')]
            arr2.forEach(x => x.classList.remove('has-error'));
        }

        /* Eventos Tabla */
        function handler_table() {
            let tbl = _('tbl_direccion'), arr_edit = _Array(tbl.getElementsByClassName('_edit_direccion')),
             arr_delete = _Array(tbl.getElementsByClassName('_delete_direccion'));

            arr_edit.forEach(x => x.addEventListener('click', e => { control_accion(e, 'edit'); }));
            arr_delete.forEach(x => x.addEventListener('click', e => { control_accion(e, 'delete'); }));          
        }

        function control_accion(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';
            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                control_event(par, accion, fila);
            }
        }

        function control_event(par, accion, fila) {
            let fila_delete = fila.rowIndex;
            switch (accion) {
                case 'delete':
                    _('tbl_direccion').deleteRow(fila_delete);
                    break;
                case 'edit':
                    req_direccion_edit(par);
                    break;
            }
        }

        function req_direccion_edit(_parametro) {
            _modalBody_Opacity({
                url: 'CourierService/Destino/_EditDireccion',
                idmodal: 'EditDireccion',
                paremeter: _parametro,
                title: 'Editar Dirección',
                width: '',
                height: '',
                backgroundtitle: 'bg-success',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        /* Guardar */
        function req_save() {
            let req = required_item({ id: 'div_destino_form', clase: '_enty' });
            if (req) {
                let tbl_direccion = _('tbl_direccion').tBodies[0].rows, tbl_activos;
                if (tbl_direccion.length > 0) {
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
                        req_update();
                    });
                }
                else { swal({ title: "Advertencia!!", text: "Debe ingresar una dirección a este destino", type: "warning" }); }
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_update() {
            let urlaccion = 'CourierService/Destino/Destino_Update';

            let odestino = _getParameter({ id: 'div_destino_form', clase: '_enty' }),                
                arr_direccion = fn_get_direccion('tbl_direccion');
            form = new FormData();
            odestino['iddestino'] = ovariables_informacion.iddestino;
            form.append('parhead', JSON.stringify(odestino));
            form.append('pardetail', JSON.stringify(arr_direccion));
            Post(urlaccion, form, res_update);
        }

        function fn_get_direccion(_idtable) {
            let table = _(_idtable), array = [...table.tBodies[0].rows], arrayresult = [], obj = {};
            if (array.length > 0) {
                array.forEach(x=> {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    if (par != null) {
                        obj.iddestinodireccion = _par(par, 'iddestinodireccion'),
                        obj.idruta = _par(par, 'idruta'),
                        obj.iddistrito = _par(par, 'iddistrito');
                        obj.direccion = x.cells[1].innerHTML;
                        obj.referencia = x.cells[2].innerHTML;
                        obj.latitud = x.cells[5].innerHTML;
                        obj.longitud = x.cells[6].innerHTML;
                        arrayresult.push(obj);
                    }
                });
            }
            return arrayresult;
        }

        function res_update(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
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
                        modal_title = _(`modal_title_${idmodal}`),
                        modal_body = _(`modal_body_${idmodal}`),
                        _err = function (error) { console.log("error", error) }

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
            
            let defaulttitle = 'New';

            html += `<div id='modal_${_idmodal}' class='modal fade ${classmodal}' role='dialog' data-dismiss='modal' data-backdrop='static'>`;
            html += `   <div id='modal_dialog_${_idmodal}' class='modal-dialog ${claseresponsive}'>`; //falta clase responsiva
            html += `       <div id='modal_content_${_idmodal}' class='modal-content' style='height:${height}'>`; //falta estilo height            
            html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>`;
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
    
)(document, 'pnl_destino_edit');

(function ini() {
    app_Destino_Edit.load();
    app_Destino_Edit.req_ini();
})();
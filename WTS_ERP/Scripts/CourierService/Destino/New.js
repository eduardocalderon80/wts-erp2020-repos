var app_Destino_New = (
    function (d, idpadre) {

        var ovariables_informacion = {
            informacion_usuario: '',
            arr_ruta: '',
            arr_distrito: '',
            idusuario: '',
            nivel: 0,
        }

        var ovariables_data = {
            arr_destino: []
        }

        function load() {
            _('btn_retornar').addEventListener('click', fn_return);
            _('btn_guardar').addEventListener('click', req_save);

            _('btn_direccion_agregar').addEventListener('click', req_add);
        }

        /* Destino */
        function req_save() {
            let req = required_item({ id: 'div_destino_form', clase: '_enty' });           
            if (req) {
                let tbl_direccion = _('tbl_direccion').tBodies[0].rows, tbl_activos;
                if (tbl_direccion.length > 0) {
                    //swal({
                    //    title: "Esta seguro de guardar los datos ingresados?",
                    //    text: "",
                    //    type: "info",
                    //    showCancelButton: true,
                    //    confirmButtonColor: "#1c84c6",
                    //    confirmButtonText: "OK",
                    //    cancelButtonText: "Cancelar",
                    //    closeOnConfirm: false
                    //}, function () {
                    //    req_new();
                    //});

                    _jquery_confirm('¡Advertencia!', '¿Esta seguro de guardar los datos ingresados?', function () {
                        req_new();
                    });
                }
                else {
                    //swal({ title: "Advertencia!!", text: "Debe ingresar una dirección a este destino", type: "warning" });
                    _jquery_alert('¡Advertencia!', 'DDebe ingresar una dirección a este destino', 'warning');
                }
            }
            else {
                //swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" });
                _jquery_alert('¡Advertencia!', 'Debe ingresar los campos requeridos', 'warning');
            }
        }

        function req_new() {
            let urlaccion = 'CourierService/Destino/Destino_Insert';

            let odestino = _getParameter({ id: 'div_destino_form', clase: '_enty' }),
                arr_direccion = fn_get_direccion('tbl_direccion');
            form = new FormData();
            form.append('parhead', JSON.stringify(odestino));
            form.append('pardetail', JSON.stringify(arr_direccion));
            Post(urlaccion, form, res_new);
        }
        
        function fn_get_direccion(_idtable) {
            let table = _(_idtable), array = [...table.tBodies[0].rows], arrayresult = [], obj = {};
            if (array.length > 0) {
                array.forEach(x=> {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    if (par != null) {
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

        function res_new(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    //swal({ title: "Buen Trabajo!", text: "Usted ha registrado un nuevo registro correctamente", type: "success" });
                    _jquery_alert('¡Buen Trabajo!', 'Usted ha registrado un nuevo registro correctamente', 'success');
                    fn_return();
                };
                if (orpta.estado === 'error') {
                    //swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" });
                    _jquery_alert('¡Existe un problema!', 'Debe comunicarse con el administrador TIC', 'error');
                }
            }
        }

        /* Direccion */
        function req_add() {

            let req = required_item({ id: 'div_direccion_form', clase: '_enty' });

            if (req) {

                let odireccion = _getParameter({ id: 'div_direccion_form', clase: '_enty' });
                let distrito = _('cbo_distrito').value !== '0' ? _('cbo_distrito').options[_('cbo_distrito').selectedIndex].text : '',
                    ruta = _('cbo_ruta').options[_('cbo_ruta').selectedIndex].text;

                let html =
                    `<tr data-par='idruta:${odireccion.idruta},iddistrito:${odireccion.iddistrito}'>
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
                handler_table(total);

                clean_form();
            }
            else {
                //swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" });
                _jquery_alert('¡Advertencia!', 'Debe ingresar los campos requeridos', 'warning');
            }
          
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

        function handler_table(indice) {
            let tbl = _('tbl_direccion'), rows = tbl.rows[indice];
            rows.getElementsByClassName('_delete_direccion')[0].addEventListener('click', e => {
                control_accion(e, 'drop');
            });
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
                case 'drop':
                    //fila.classList.add('hide');
                    _('tbl_direccion').deleteRow(fila_delete);
                    break;
            }
        }

        function clean_form() {
            _('txt_direccion').value = '';
            _('txt_referencia').value = '';
            $('#cbo_distrito').select2('val', '0');
            $('#cbo_ruta').select2('val', '0');
            _('txt_latitud').value = '';
            _('txt_longitud').value = '';
        }

        /* Principal */
        function req_ini() {

        }

        function fn_return() {
            let urlaccion = 'CourierService/Destino/Index',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

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
        
        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_destino_new');



    (function ini() {
        app_Destino_New.load();
        app_Destino_New.req_ini();
    })();
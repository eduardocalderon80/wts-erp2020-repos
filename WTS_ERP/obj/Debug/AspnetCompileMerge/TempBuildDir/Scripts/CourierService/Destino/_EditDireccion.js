var app_Direccion_Edit = (
    function (d, idpadre) {

         var ovariables_informacion = {
            iddestino: 0,
            iddestinodireccion: 0,
            idruta: 0,
            iddistrito: 0,
            informacion_usuario: '',
            arr_ruta: '',
            arr_distrito: '',
            idusuario: '',
            nivel: 0
         }

         var ovariables_data = {
             informacion_direccion: ''
         }

        function load() {
            let par = _('txtpar_direccion').value;
            if (!_isEmpty(par)) {
                ovariables_informacion.iddestino = _par(par, 'iddestino');
                ovariables_informacion.iddestinodireccion = _par(par, 'iddestinodireccion');
                ovariables_informacion.idruta = _par(par, 'idruta');
                ovariables_informacion.iddistrito = _par(par, 'iddistrito');
            }
            
            _('btn_edit_guardar').addEventListener('click', req_save);
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
                    fn_load_edit_ruta();
                    fn_load_edit_distrito();
                    req_edit_data();
                }, (p) => { err(p); });
        }

        function fn_load_edit_ruta() {
            let arr_ruta = ovariables_informacion.arr_ruta,
              cbo_ruta = `<option value='0'>Seleccione una Ruta</option>`;
            if (arr_ruta.length > 0) { arr_ruta.forEach(x=> { cbo_ruta += `<option value='${x.idruta}'>${x.ruta}</option>`; }); }

            _('cbo_edit_ruta').innerHTML = cbo_ruta;
            $('#cbo_edit_ruta').select2();
        }

        function fn_load_edit_distrito() {
            let arr_distrito = ovariables_informacion.arr_distrito,
              cbo_distrito = `<option value='0'>Seleccione un Distrito</option>`;
            if (arr_distrito.length > 0) { arr_distrito.forEach(x=> { cbo_distrito += `<option value='${x.iddistrito}'>${x.distrito}</option>`; }); }

            _('cbo_edit_distrito').innerHTML = cbo_distrito;
            $('#cbo_edit_distrito').select2();
        }

        function req_edit_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { iddestinodireccion: ovariables_informacion.iddestinodireccion };
            let urlaccion = 'CourierService/Destino/DestinoDireccion_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.informacion_direccion = rpta[0].direccion != '' ? JSON.parse(rpta[0].direccion) : [];
                    }
                    fn_load_edit_direccion();
                }, (p) => { err(p); });
        }

        function fn_load_edit_direccion() {
            let informacion_direccion = ovariables_data.informacion_direccion;
            _('txt_edit_direccion').value = informacion_direccion[0].direccion;
            _('txt_edit_referencia').value = informacion_direccion[0].referencia;
            _('txt_edit_latitud').value = informacion_direccion[0].latitud;
            _('txt_edit_longitud').value = informacion_direccion[0].longitud;
            $('#cbo_edit_distrito').select2('val', informacion_direccion[0].iddistrito);
            $('#cbo_edit_ruta').select2('val', informacion_direccion[0].idruta);
        }
       
        /* Guardar */
        function req_save() {
            let req = required_item({ id: 'div_direccion_edit_formulario', clase: '_enty' });
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
                    req_edit();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_edit() {
            let urlaccion = 'CourierService/Destino/DestinoDireccion_Update';

            let odestino = _getParameter({ id: 'div_direccion_edit_formulario', clase: '_enty' });
            form = new FormData();
            odestino['iddestino'] = ovariables_informacion.iddestino;
            odestino['iddestinodireccion'] = ovariables_informacion.iddestinodireccion;
            form.append('parhead', JSON.stringify(odestino));
            Post(urlaccion, form, res_edit);
        }
        
        function res_edit(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_EditDireccion').modal('hide');
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_return() {
            let urlaccion = 'CourierService/Destino/Edit', urljs = 'CourierService/Destino/Edit';
            _Go_Url(urlaccion, urljs, 'iddestino:' + ovariables_informacion.iddestino);
        }
             

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_direccion_edit');

    (function ini() {
        app_Direccion_Edit.load();
        app_Direccion_Edit.req_ini();
    })();
var app_Equipo_Edit = (
    function (d, idpadre) {

        var ovariables = {
            idequipo: 0,
            equipo: '',
            arr_personal: [],
            arr_area: [],
            arr_sub_area: []
        }

        function load() {
            let par = _('txt_equipo_edit_par').value;
            if (!_isEmpty(par)) { ovariables.idequipo = _par(par, 'idequipo'); }

            $('#cbo_edit_equipo_area').on('change', fn_load_sub_area);
            _('btn_edit_guardar').addEventListener('click', req_save);
        }

        /* General */
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

        function fn_return() {
            let urlaccion = 'RecursosHumanos/Equipo/Index',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { estado: 0 };
            let urlaccion = 'RecursosHumanos/Equipo/Equipo_GetDataCombos?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_personal = rpta[0].personal != '' ? JSON.parse(rpta[0].personal) : [];
                        ovariables.arr_area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : [];
                        ovariables.arr_sub_area = rpta[0].sub_area != '' ? JSON.parse(rpta[0].sub_area) : [];
                    }
                    fn_load_personal();
                    fn_load_area();
                    fn_load_sub_area();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_personal() {
            let arr_personal = ovariables.arr_personal,
                cbo_edit_equipo_personal = `<option value='0'>Seleccione un Responsable</option>`;

            if (arr_personal.length > 0) { arr_personal.forEach(x=> { cbo_edit_equipo_personal += `<option value='${x.idpersonal}'>${x.nombrepersonal}</option>`; }); }

            _('cbo_edit_equipo_personal').innerHTML = cbo_edit_equipo_personal;
            $('#cbo_edit_equipo_personal').select2();
        }

        function fn_load_area() {
            let arr_area = ovariables.arr_area,
                cbo_edit_equipo_area = `<option value='0'>Seleccione un Área</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_edit_equipo_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_edit_equipo_area').innerHTML = cbo_edit_equipo_area;
            $('#cbo_edit_equipo_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.arr_sub_area,
                idarea = _('cbo_edit_equipo_area').value,
                cbo_edit_equipo_sub_area = `<option value='0'>Seleccione un Sub Área</option>`;

            let resultado_sub_area = arr_sub_area.filter(x=> x.idarea === parseInt(idarea));

            if (resultado_sub_area.length > 0) { resultado_sub_area.forEach(x=> { cbo_edit_equipo_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`; }); }
            _('cbo_edit_equipo_sub_area').innerHTML = cbo_edit_equipo_sub_area;
            $('#cbo_edit_equipo_sub_area').select2();
        }

        function req_info() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idequipo: ovariables.idequipo };
            let urlaccion = 'RecursosHumanos/Equipo/Equipo_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.equipo = rpta[0].equipo != '' ? JSON.parse(rpta[0].equipo) : '';
                    }
                    fn_load_equipo();
                }, (p) => { err(p); });
        }

        function fn_load_equipo() {
            let equipo = ovariables.equipo;
            _('txt_edit_equipo').value = equipo[0].equipo;
            $('#cbo_edit_equipo_personal').select2('val', equipo[0].idpersonal);
            $('#cbo_edit_equipo_area').select2('val', equipo[0].idarea);
            fn_load_sub_area();
            $('#cbo_edit_equipo_sub_area').select2('val', equipo[0].idsubarea);
        }
        
        /* Insert */
        function req_save() {
            let req = required_item({ id: 'div_equipo_edit_formulario', clase: '_enty' });
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
                    req_update();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_update() {
            let urlaccion = 'RecursosHumanos/Equipo/Equipo_Update';
            let oequipo = _getParameter({ id: 'div_equipo_edit_formulario', clase: '_enty' });
            oequipo['idequipo'] = ovariables.idequipo;
            form = new FormData();
            form.append('parhead', JSON.stringify(oequipo));
            Post(urlaccion, form, res_update);
        }

        function res_update(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_EditEquipo').modal('hide');
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }
        
        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_equipo_edit');

(function ini() {
    app_Equipo_Edit.load();
    app_Equipo_Edit.req_ini();
})();

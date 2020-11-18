var app_Equipo_New = (
    function (d, idpadre) {

        var ovariables = {
            idequipo: 0,
            equipo: '',
            arr_personal: [],
            arr_area: [],
            arr_sub_area: []
        }

        function load() {         

            $('#cbo_new_area').on('change', fn_load_sub_area);
            _('btn_new_guardar').addEventListener('click', req_save);
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
                }, (p) => { err(p); });
        }

        function fn_load_personal() {
            let arr_personal = ovariables.arr_personal,
                cbo_new_personal = `<option value='0'>Seleccione un Responsable</option>`;

            if (arr_personal.length > 0) { arr_personal.forEach(x=> { cbo_new_personal += `<option value='${x.idpersonal}'>${x.nombrepersonal}</option>`; }); }

            _('cbo_new_personal').innerHTML = cbo_new_personal;
            $('#cbo_new_personal').select2();
        }

        function fn_load_area() {
            let arr_area = ovariables.arr_area,
                cbo_new_area = `<option value='0'>Seleccione un Área</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_new_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_new_area').innerHTML = cbo_new_area;
            $('#cbo_new_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.arr_sub_area,
                idarea = _('cbo_new_area').value,
                cbo_new_sub_area = `<option value='0'>Seleccione un Sub Área</option>`;

            let resultado_sub_area = arr_sub_area.filter(x=> x.idarea === parseInt(idarea));

            if (resultado_sub_area.length > 0) { resultado_sub_area.forEach(x=> { cbo_new_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`; }); }
            _('cbo_new_sub_area').innerHTML = cbo_new_sub_area;
            $('#cbo_new_sub_area').select2();
        }
        
        /* Insert */
        function req_save() {
            let req = required_item({ id: 'div_equipo_new_formulario', clase: '_enty' });
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
                    req_insert();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_insert() {
            let urlaccion = 'RecursosHumanos/Equipo/Equipo_Insert';
            let oequipo = _getParameter({ id: 'div_equipo_new_formulario', clase: '_enty' });
            form = new FormData();
            form.append('parhead', JSON.stringify(oequipo));
            Post(urlaccion, form, res_insert);
        }

        function res_insert(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha ingresado este registro correctamente", type: "success" });
                    $('#modal_NewEquipo').modal('hide');
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
)(document, 'pnl_equipo_new');

(function ini() {
    app_Equipo_New.load();
    app_Equipo_New.req_ini();
})();

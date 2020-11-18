var app_Cargo_Edit = (
    function (d, idpadre) {

        var ovariables = {
            idcargo: 0,
            cargo:'',
            arr_area: [],
            arr_sub_area: []
        }

        function load() {
            let par = _('txt_cargo_edit_par').value;
            if (!_isEmpty(par)) { ovariables.idcargo = _par(par, 'idcargo'); }

            $('#cbo_edit_cargo_area').on('change', fn_load_sub_area);
            _('btn_edit_cargo_guardar').addEventListener('click', req_save);
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
            let urlaccion = 'RecursosHumanos/Cargo/Index',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }
                
        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { estado: 0 };
            let urlaccion = 'RecursosHumanos/Cargo/Cargo_GetDataCombos?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : [];
                        ovariables.arr_sub_area = rpta[0].sub_area != '' ? JSON.parse(rpta[0].sub_area) : [];
                    }
                    fn_load_area();
                    fn_load_sub_area();
                }, (p) => { err(p); })
                .then(() =>{
                    req_info();
                });
        }

        function fn_load_area() {
            let arr_area = ovariables.arr_area,
                cbo_edit_cargo_area = `<option value='0'>Seleccione Área</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_edit_cargo_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_edit_cargo_area').innerHTML = cbo_edit_cargo_area;
            $('#cbo_edit_cargo_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.arr_sub_area,
                idarea = _('cbo_edit_cargo_area').value,
                cbo_edit_cargo_sub_area = `<option value='0'>Seleccione Sub Área</option>`;

            let resultado_sub_area = arr_sub_area.filter(x=> x.idarea === parseInt(idarea));
           
            if (resultado_sub_area.length > 0) { resultado_sub_area.forEach(x=> { cbo_edit_cargo_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`; }); }
            _('cbo_edit_cargo_sub_area').innerHTML = cbo_edit_cargo_sub_area;
            $('#cbo_edit_cargo_sub_area').select2();
        }

        function req_info() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idcargo: ovariables.idcargo };
            let urlaccion = 'RecursosHumanos/Cargo/Cargo_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.cargo = rpta[0].cargo != '' ? JSON.parse(rpta[0].cargo) : '';
                    }
                    fn_load_cargo();
                }, (p) => { err(p); });
        }

        function fn_load_cargo() {
            let cargo = ovariables.cargo;
            _('txt_edit_cargo').value = cargo[0].cargo;
            $('#cbo_edit_cargo_area').select2('val', cargo[0].idarea);
            fn_load_sub_area();
            $('#cbo_edit_cargo_sub_area').select2('val', cargo[0].idsubarea);
        }

        /* Insert */
        function req_save() {
            let req = required_item({ id: 'div_cargo_edit_formulario', clase: '_enty' });
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
            let urlaccion = 'RecursosHumanos/Cargo/Cargo_Update';
            let ocargo = _getParameter({ id: 'div_cargo_edit_formulario', clase: '_enty' });
            ocargo['idcargo'] = ovariables.idcargo;
            form = new FormData();
            form.append('parhead', JSON.stringify(ocargo));
            Post(urlaccion, form, res_update);
        }

        function res_update(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_EditCargo').modal('hide');
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
)(document, 'pnl_cargo_edit');

(function ini() {
    app_Cargo_Edit.load();
    app_Cargo_Edit.req_ini();
})();

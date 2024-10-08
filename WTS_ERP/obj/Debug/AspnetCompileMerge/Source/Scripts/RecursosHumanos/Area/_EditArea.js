﻿var app_Area_Edit = (
    function (d, idpadre) {

        var ovariables = {
            idarea: 0,
            area: '',
            arr_personal: [],
            arr_area: []
        }

        function load() {
            let par = _('txt_area_edit_par').value;
            if (!_isEmpty(par)) { ovariables.idarea = _par(par, 'idarea'); }

            handler_check();

            _('btn_edit_area_guardar').addEventListener('click', req_save);
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
            let urlaccion = 'RecursosHumanos/Area/Index',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function handler_check() {
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let x = e.currentTarget;
                let id = (x.parentNode.parentNode.parentNode.parentNode).id;
                if (id == 'id_rad_edit_subarea') { $('#cbo_edit_area_padre').prop('disabled', false); }
                else { $('#cbo_edit_area_padre').prop('disabled', true); $('#cbo_edit_area_padre').select2('val', '0'); }
            });
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { estado: 0 };
            let urlaccion = 'RecursosHumanos/Area/Area_GetDataCombos?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_personal = rpta[0].personal != '' ? JSON.parse(rpta[0].personal) : [];
                        ovariables.arr_area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : [];
                    }
                    fn_load_personal();
                    fn_load_area_padre();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_personal() {
            let arr_personal = ovariables.arr_personal,
                cbo_edit_area_personal = `<option value='0'>Seleccione Responsable</option>`;

            if (arr_personal.length > 0) { arr_personal.forEach(x=> { cbo_edit_area_personal += `<option value='${x.idpersonal}'>${x.nombrepersonal}</option>`; }); }

            _('cbo_edit_area_personal').innerHTML = cbo_edit_area_personal;
            $('#cbo_edit_area_personal').select2();
        }

        function fn_load_area_padre() {
            let arr_area = ovariables.arr_area,
                cbo_edit_area_padre = `<option value='0'>Seleccione Área Padre</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_edit_area_padre += `<option value='${x.idareapadre}'>${x.areapadre}</option>`; }); }

            _('cbo_edit_area_padre').innerHTML = cbo_edit_area_padre;
            $('#cbo_edit_area_padre').select2();
        }

        function req_info() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idarea: ovariables.idarea };
            let urlaccion = 'RecursosHumanos/Area/Area_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : '';
                    }
                    fn_load_area();
                }, (p) => { err(p); });
        }

        function fn_load_area() {
            let area = ovariables.area;
            _('txt_edit_area').value = area[0].area;
            $('#cbo_edit_area_personal').select2('val', area[0].idjefatura);

            if (area[0].bhijo) { _('id_rad_edit_subarea').children[0].children[0].children[0].classList.add('checked'); $('#cbo_edit_area_padre').prop('disabled', false); }
            else { _('id_rad_edit_area').children[0].children[0].children[0].classList.add('checked'); }
            
            $('#cbo_edit_area_padre').select2('val', area[0].idareapadre);
        }

        /* Insert */
        function req_save() {
            let req = required_item({ id: 'div_area_edit_formulario', clase: '_enty' });
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
            let urlaccion = 'RecursosHumanos/Area/Area_Update';
            let oarea = _getParameter({ id: 'div_area_edit_formulario', clase: '_enty' });
            oarea['idarea'] = ovariables.idarea;
            form = new FormData();
            form.append('parhead', JSON.stringify(oarea));
            Post(urlaccion, form, res_update);
        }

        function res_update(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_EditArea').modal('hide');
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
)(document, 'pnl_area_edit');

(function ini() {
    app_Area_Edit.load();
    app_Area_Edit.req_ini();
})();

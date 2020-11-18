var app_Personal_New = (
    function (d, idpadre) {

        var ovariables = {
            idpersonal: 0,
            personal: '',
            accion: '',
            estado: 0,
            arr_personal: '',
            arr_area: [],
            arr_sub_area: [],
            arr_cargo: [],
            arr_equipo: [],
            arr_id_sub_area: [],
            arr_id_sub_area_selection: []
        }

        function load() {

            let elem = document.querySelector('.js-switch');
            let init = new Switchery(elem);
            _('lusuarioasistencia').click();

            _('btn_retornar').addEventListener('click', fn_return);
            _('btn_guardar').addEventListener('click', req_save);
            
            $('#cbo_new_area').on('change', req_change_area);
            $('#cbo_new_sub_area').on('change', req_change_sub_area);

            /* Fechas */
            $.fn.datepicker.dates['es'] = {
                days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                today: "Hoy",
                clear: "Limpiar",
                format: "dd/mm/yyyy",
            };
            $('#div_new_fecha_nacimiento .input-group.date, #div_new_fecha_ingreso .input-group.date, #div_new_fecha_cese .input-group.date').datepicker({
                autoclose: true, dateFormat: 'mm/dd/yyyy',
                clearBtn: true,
                todayHighlight: true,
                language: "es"
            });

            $("#fupArchivo").change(function () {
                var archivo = this.value;
                var ultimopunto = archivo.lastIndexOf(".");
                var ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                switch (ext) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                        $('#uploadButton').attr('disabled', false);
                        MostrarImagen(this);
                        break;
                    default:
                        alert('Upload Images (png, jpg, jpeg).');
                        this.value = '';
                }
            });
            $('#btnImagenEliminar').click(function () {
                /* reset($('#fupArchivo'));
                 $('#imgEstilo').attr('src', '');
                 _('hf_estado_actualizarimagen').value = '1';
                 */
                let urlbase = urlBase();

                let ruta = urlbase + "Content/img/RRHH/personal/default.jpg";

                $("#imgPersonal").attr("src", ruta);
                $("#imgPersonal").attr("data-initial", ruta);
                _('hf_estado_actualizarimagen').value = '1';
            });
            _('pasteArea').onpaste = function (event) {

                var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                console.log(JSON.stringify(items));
                var blob = null;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") === 0) {
                        blob = items[i].getAsFile();
                    }
                }
                if (blob !== null) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        console.log(event.target.result);
                        _("imgPersonal").src = event.target.result;
                        _('hf_estado_actualizarimagen').value = '1';
                    };
                    reader.readAsDataURL(blob);
                }
                $('#pasteArea').val('');
            }

        }

        /* General */
        function soloNumeros(event) {
            charCode = (event.which) ? event.which : event.keyCode;
            exito = (charCode > 31 && (charCode < 48 || charCode > 57));
            if (exito) { return false; }
        }

        function MostrarImagen(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#imgPersonal').attr('src', e.target.result);
                    _('hf_estado_actualizarimagen').value = "1";
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function req_change_area() {
            fn_load_sub_area();
            fn_load_cargo();
            fn_load_equipo();
        }

        function req_change_sub_area() {
            fn_load_cargo();
            fn_load_equipo();
        }

        function fn_return() {
            let urlaccion = 'RecursosHumanos/Personal/Index',
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

        function converfecha_ingles(_id) {
            let valorfecha = _(_id).value, fecharesultado = '';
            if (valorfecha != '') {
                let fecha = valorfecha.split('/');
                fecharesultado = `${fecha[2]}${fecha[1]}${fecha[0]}`;
            }
            return fecharesultado;
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { estado: 0 };
            let urlaccion = 'RecursosHumanos/Personal/Personal_GetDataCombos?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_area = rpta[0].area != '' ? JSON.parse(rpta[0].area) : [];
                        ovariables.arr_sub_area = rpta[0].sub_area != '' ? JSON.parse(rpta[0].sub_area) : [];
                        ovariables.arr_cargo = rpta[0].cargo != '' ? JSON.parse(rpta[0].cargo) : [];
                        ovariables.arr_equipo = rpta[0].equipo != '' ? JSON.parse(rpta[0].equipo) : [];
                    }
                    fn_load_genero();
                    fn_load_imagen();
                    fn_load_area();
                    fn_load_sub_area();
                    fn_load_cargo();
                    fn_load_equipo();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_genero() {
            let cbo_new_genero = `<option value='0'>Seleccione Género</option><option value='M'>Masculino</option><option value='F'>Femenino</option>`;
            _('cbo_new_genero').innerHTML = cbo_new_genero;
            $('#cbo_new_genero').select2();
        }

        function fn_load_imagen() {
            let urlbase = urlBase();
            let ruta = urlbase + "Content/img/RRHH/personal/default.jpg";

            $("#imgPersonal").attr("src", ruta);
            $("#imgPersonal").attr("data-initial", ruta);
        }

        function fn_load_area() {
            let arr_area = ovariables.arr_area,
               cbo_new_area = `<option value='0'>Seleccione Área</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_new_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_new_area').innerHTML = cbo_new_area;
            $('#cbo_new_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.arr_sub_area, idarea = _('cbo_new_area').value,
                resultado_sub_area = [],
                cbo_new_sub_area = `<option value='0'>Seleccione Sub Área</option>`;

            resultado_sub_area = arr_sub_area.filter(x=> x.idarea.toString() === idarea);

            if (resultado_sub_area.length > 0) { resultado_sub_area.forEach(x=> { cbo_new_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`; }); }

            _('cbo_new_sub_area').innerHTML = cbo_new_sub_area;
            $('#cbo_new_sub_area').select2();
        }

        function fn_load_cargo() {
            let arr_cargo = ovariables.arr_cargo, idarea = _('cbo_new_area').value,
                idsubarea = _('cbo_new_sub_area').value,
                resultado_cargo = [], cbo_new_cargo = `<option value='0'>Seleccione Puesto de Trabajo</option>`;

            resultado_cargo = arr_cargo.filter(x =>
                (x.idarea.toString() === idarea) &&
                (x.idsubarea.toString() === idsubarea)
            );

            if (resultado_cargo.length > 0) { resultado_cargo.forEach(x=> { cbo_new_cargo += `<option value='${x.idcargo}'>${x.cargo}</option>`; }); }

            _('cbo_new_cargo').innerHTML = cbo_new_cargo;
            $('#cbo_new_cargo').select2();
        }

        function fn_load_equipo() {
            let arr_equipo = ovariables.arr_equipo, idarea = _('cbo_new_area').value,
                idsubarea = _('cbo_new_sub_area').value,
                resultado_equipo = [], cbo_new_equipo = `<option value='0'>Seleccione Equipo</option>`;

            resultado_equipo = arr_equipo.filter(x =>
                (x.idarea.toString() === idarea) &&
                (x.idsubarea.toString() === idsubarea)
            );

            if (resultado_equipo.length > 0) { resultado_equipo.forEach(x=> { cbo_new_equipo += `<option value='${x.idequipo}'>${x.equipo}</option>`; }); }

            _('cbo_new_equipo').innerHTML = cbo_new_equipo;
            $('#cbo_new_equipo').select2();
        }

        /* Actualizar */
        function req_save() {
            let req = required_item({ id: 'div_personal_new_formulario', clase: '_enty' });
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
            let urlaccion = 'RecursosHumanos/Personal/Personal_Insert';

            let fechanacimiento = converfecha_ingles('txt_new_fecha_nacimiento');
            let fechaingreso = converfecha_ingles('txt_new_fecha_ingreso');
            let fechacese = converfecha_ingles('txt_new_fecha_cese');

            let opersonal = _getParameter({ id: 'div_personal_new_formulario', clase: '_enty' });
            opersonal['fechanacimiento'] = fechanacimiento;
            opersonal['fechaingreso'] = fechaingreso;
            opersonal['fechacese'] = fechacese;
            opersonal['imagen'] = _('hf_estado_actualizarimagen').value;
            opersonal['lusuarioasistencia'] = _('lusuarioasistencia').checked;
            form = new FormData();
            form.append('par', JSON.stringify(opersonal));
            form.append('parimagen', $("#fupArchivo")[0].files[0]);
            
            Post(urlaccion, form, res_insert);
        }

        function res_insert(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
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
)(document, 'pnl_personal_new');

(function ini() {
    app_Personal_New.load();
    app_Personal_New.req_ini();
})();
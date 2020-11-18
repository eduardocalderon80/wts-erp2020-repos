var app_Asignar_Driver = (
    function (d, idpadre) {

        var ovariables_informacion = {
            idprogramacion: 0
        }

        var ovariables_data = {
            programacion: '',
            arr_chofer:[],
        }
        
        function load() {
            let par = _('txtpar_assigndriver').value;
            if (!_isEmpty(par)) { ovariables_informacion.idprogramacion = _par(par, 'idprogramacion'); }

            _('btn_guardar_asignar_chofer').addEventListener('click', req_save);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idprogramacion: ovariables_informacion.idprogramacion };
            let urlaccion = 'CourierService/Solicitud/Get_Programacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.programacion = rpta[0].programacion != '' ? JSON.parse(rpta[0].programacion) : '';
                        ovariables_data.arr_chofer = rpta[0].chofer != '' ? JSON.parse(rpta[0].chofer) : [];
                    }
                    fn_load_chofer();
                    fn_load_programacion();
                }, (p) => { err(p); });
        }

        function fn_load_chofer() {
            let arr_chofer = ovariables_data.arr_chofer,
                cbo_chofer = `<option value='0'>Seleccione un Chofer</option>`;

            if (arr_chofer.length > 0) {
                arr_chofer.forEach(x=> {
                    cbo_chofer += `<option value='${x.idchofer}'>${x.chofer}</option>`;
                });
            }

            _('cbo_chofer_asignar_chofer').innerHTML = cbo_chofer;
            $('#cbo_chofer_asignar_chofer').select2();
        }

        function fn_load_programacion() {
            let programacion = ovariables_data.programacion;
            _('txt_fecha_asignar_chofer').value = programacion[0].fecha;
            _('txt_vehiculo_asignar_chofer').value = programacion[0].vehiculo;
            $('#cbo_chofer_asignar_chofer').select2('val', programacion[0].idchofer);
        }

        function req_save() {
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
                save_data();
            });
        }

        function save_data() {
            let urlaccion = 'CourierService/Solicitud/Save_Asignar_Chofer',
                idchofer = _('cbo_chofer_asignar_chofer').value;
            let par = { idprogramacion: ovariables_informacion.idprogramacion, idchofer: idchofer };

            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            Post(urlaccion, form, res_save_data);
        }

        function res_save_data(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    $('#modal_AssignDriver').modal('hide');
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_return() {
            let urlaccion = 'CourierService/Solicitud/Index', urljs = 'CourierService/Solicitud/Index';
            _Go_Url(urlaccion, urljs);
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_assign_driver');

(function ini() {
    app_Asignar_Driver.load();
    app_Asignar_Driver.req_ini();
})();
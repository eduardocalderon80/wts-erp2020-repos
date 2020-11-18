var app_Destino_Index = (
    function (d, idpadre) {

        var ovariables_informacion = {
            informacion_usuario: '',            
            arr_ruta : '',
            idusuario: '',
            nivel: 0,
        }

        var ovariables_data = {
            arr_destino: [],
            iddestino: 0
        }

        function load() {
            _('btn_nuevo').addEventListener('click', req_new);
            _('btn_editar').addEventListener('click', req_edit);
            _('btn_eliminar').addEventListener('click', req_delete);
            _('btn_visualizar').addEventListener('click', req_view);

            $('#cbo_ruta').on('change', req_change_data);
            $('#cbo_distrito').on('change', req_change_data);

            _('txt_destino').addEventListener('keyup', event_load_destino);
            _('txt_direccion').addEventListener('keyup', event_load_destino);

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
            if (ovariables_informacion.nivel == 0) {
                _('div_botones_principal').classList.add('hide');
                _('div_botones_secundarios').classList.add('hide');
                _('div_botones_terciarios').classList.remove('hide');
            }
            else {
               _('div_botones_principal').classList.remove('hide');
               _('div_botones_secundarios').classList.remove('hide');
                _('div_botones_terciarios').classList.add('hide');
            }
        }

        function fn_load_ruta() {
            let arr_ruta = ovariables_informacion.arr_ruta,
              cbo_ruta = `<option value='0'>Todas las Rutas</option>`;

            if (arr_ruta.length>0) { arr_ruta.forEach(x=> { cbo_ruta += `<option value='${x.idruta}'>${x.ruta}</option>`; }); }

            _('cbo_ruta').innerHTML = cbo_ruta;
            $('#cbo_ruta').select2();
            req_change_data();
        }

        function fn_load_distrito() {
            let arr_distrito = ovariables_informacion.arr_distrito,
              cbo_distrito = `<option value='0'>Todos los Distritos</option>`;
            if (arr_distrito.length > 0) { arr_distrito.forEach(x=> { cbo_distrito += `<option value='${x.iddistrito}'>${x.distrito}</option>`; }); }

            _('cbo_distrito').innerHTML = cbo_distrito;
            $('#cbo_distrito').select2();
        }

        function req_change_data() {
            let err = function (__err) { console.log('err', __err) };
            let idruta = _('cbo_ruta').value, iddistrito = _('cbo_distrito').value;
            let parametro = { idruta: idruta, iddistrito: iddistrito };
            let urlaccion = 'CourierService/Destino/Destino_List?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_destino = rpta[0].destino != [] ? JSON.parse(rpta[0].destino) : [];
                    }
                    req_load_destino();
                }, (p) => { err(p); });
        }

        function event_load_destino() {
            event.preventDefault();
            if (event.keyCode === 13) {
                req_load_destino();
            }
        }

        function req_load_destino() {
            let arr_destino = ovariables_data.arr_destino, resultado_destino = [];
            let destino = _('txt_destino').value, direccion = _('txt_direccion').value;

            resultado_destino = arr_destino.filter(x=>
                (x.destino.toLowerCase().indexOf(destino.toLowerCase) > -1 || x.destino.toLowerCase().indexOf(destino.toLowerCase()) > -1) &&
                (x.direccion.toLowerCase().indexOf(direccion.toLowerCase) > -1 || x.direccion.toLowerCase().indexOf(direccion.toLowerCase()) > -1)
            );
            fn_load_destino(resultado_destino);
        }

        function fn_load_destino(_resultado_destino) {
            let resultado_destino = _resultado_destino,
                html = '', htmlheader = '', htmlbody = '';

            htmlheader = `
                <table id="tbl_destino" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>
                            <th style="width:25%">Destino</th>
                            <th style="width:40%">Dirección</th>
                            <th style="width:25%">Distrito</th>
                            <th style="width:10%">Ruta</th>
                        </tr>
                    </thead>
                    <tbody>
                `
            ;

            resultado_destino.forEach(x=> {
                htmlbody += `
                    <tr data-par='iddestino:${x.iddestino}'>
                        <td>${x.destino}</td>
                        <td>${x.direccion}</td>
                        <td>${x.distrito}</td>
                        <td>${x.ruta}</td>
                    </tr>
                `;
            });

            html += htmlheader + htmlbody + '</tbody></table>';
            _('div_tabla_destino').innerHTML = html;

            let tbl = _('tbl_destino').tBodies[0], total = tbl.rows.length;
            handlertable(total);

            format_table();
        }        

        function handlertable(indice) {
            let tbl = _('tbl_destino').tBodies[0], rows = tbl.rows, row = rows[indice];
            let array = Array.from(rows);
            array.forEach(x=> { x.addEventListener('click', event_rows); });
        }
        
        function event_rows(e) {
            let o = e.currentTarget, row = o, tbl = _('tbl_destino'), rows = tbl.rows;
            fn_clean_rows(rows);
            row.classList.add('row-selected');
            let par = row.getAttribute('data-par')
            ovariables_data.iddestino = parseInt(_getPar(par, 'iddestino'));
        }

        function fn_clean_rows(rows) {
            ovariables_data.iddestino = 0;
            let array = Array.from(rows);
            array.some(x=> {
                if (x.classList.contains('row-selected')) { x.classList.remove('row-selected'); return true; }
            });
        }
        
        function format_table() {
            $('#tbl_destino').DataTable({
                scrollY: "455px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                bPaginate: false,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros"
                }
            });
        }

        function req_new() {
            let urlaccion = 'CourierService/Destino/New',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function req_edit() {
            if (ovariables_data.iddestino != 0) {
                let urlaccion = 'CourierService/Destino/Edit', urljs = 'CourierService/Destino/Edit';
                _Go_Url(urlaccion, urljs, 'iddestino:' + ovariables_data.iddestino);
            }
            else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        function req_delete() {
            if (ovariables_data.iddestino != 0) {
                swal({
                    title: "Esta seguro de deshabilitar este registro?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    req_disabled();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        function req_disabled() {
            let urlaccion = 'CourierService/Destino/Destino_Enabled';

            let odestino = { iddestino: ovariables_data.iddestino, estado: 1 };
            form = new FormData();
            form.append('parhead', JSON.stringify(odestino));
            Post(urlaccion, form, res_disabled);
        }

        function res_disabled(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha deshabilitado este destino correctamente", type: "success" });
                    req_change_data();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function req_view() {
            if (ovariables_data.iddestino != 0) {
                let urlaccion = 'CourierService/Destino/Viewer', urljs = 'CourierService/Destino/Viewer';
                _Go_Url(urlaccion, urljs, 'iddestino:' + ovariables_data.iddestino);
            }
            else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_destino_index');

(function ini() {
    app_Destino_Index.load();
    app_Destino_Index.req_ini();
})();
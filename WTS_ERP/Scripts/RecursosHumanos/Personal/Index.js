var app_Personal_Index = (
    function (d, idpadre) {

        var app_Index = {
            controlador: 'Personal',
            ventana: 'Index'
        }

        function reglas_botoneras(_app) {
            let arrbotones = !_aisEmpty(window.utilindex.botones) ? window.utilindex.botones : [];
            let botones = arrbotones.filter(x => x.controlador.toLowerCase() === _app.controlador.toLowerCase() && x.ventana.toLowerCase() === _app.ventana.toLowerCase());
            if (!_aisEmpty(botones)) {
                let arrAgrupador = Array.from(new Set(botones.map(x => x.agrupador)));
                botones.forEach(x=> {
                    _(x.idboton).classList.remove('hide');
                });

                //arrAgrupador.forEach(y => {
                //    document.getElementById(y).innerHTML =
                //        botones.filter(z => z.agrupador === y).map(x => {
                //            return `
                //                <button type='button' title='${x.titulo}' class ='${x.clase}' id='${x.idboton}' onclick='${x.metodo}()'>
                //                <span class ='${x.icono}'></span>
                //                ${x.nombre}
                //                </button>
                //            `
                //        }).join('');
                //})
            }
        }

        var ovariables = {
            idpersonal: 0,
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
            $("._select2").select2();
            fn_load_estado();

            $(".chosen-select").chosen({ width: "100%", placeholder_text_multiple: 'Seleccione Sub Área' });
            /* Fix */
            $(".chosen-container").css("pointer-events", "none");
            $(".chosen-choices").css("background-color", "#eee");
            $(".chosen-choices input").css("height", "28px");

            _('txt_personal').addEventListener('keyup', event_load_personal);

            $('#cbo_area').on('change', req_change_area);
            $('#cbo_sub_area').chosen().change(function () {
                let cbo_sub_area = $("#cbo_sub_area").chosen().val() == null ? "0" : $("#cbo_sub_area").chosen().val();
                ovariables.arr_id_sub_area_selection = [];                

                if (cbo_sub_area != '0') {
                    cbo_sub_area.forEach(x=> {
                        obj = {},
                        obj.idsubarea = parseInt(x);
                        ovariables.arr_id_sub_area_selection.push(obj);
                    })
                    req_change_sub_area();
                }
                else {
                    ovariables.arr_id_sub_area_selection = ovariables.arr_id_sub_area;
                    fn_load_cargo();
                    fn_load_equipo();
                    req_load_personal();
                }
            });
            $('#cbo_equipo').on('change', req_load_personal);
            $('#cbo_cargo').on('change', req_load_personal);
            $('#cbo_estado').on('change', req_info);

            _('btn_print_pdf').addEventListener('click', req_print);
            _('btn_export_excel').addEventListener('click', req_export);

            _('btn_new').addEventListener('click', req_new);
            _('btn_edit').addEventListener('click', req_edit);
            _('btn_view').addEventListener('click', req_view);
            _('btn_delete').addEventListener('click', req_delete);
            _('btn_search').addEventListener('click', req_search);

        }

        /* General */
        function fn_load_estado() {
            let cbo_estado = `<option value=0>Activo</option><option value=1>Inactivo</option>`;
            _('cbo_estado').innerHTML = cbo_estado;
            $('#cbo_estado').select2();
        }

        function event_load_personal() {
            event.preventDefault();
            if (event.keyCode === 13) {
                req_load_personal();
            }
        }

        function req_print() {
            let idarea = _('cbo_area').value, idcargo = _('cbo_cargo').value, idestado = _('cbo_estado').value;
            let urlaccion = urlBase() + 'RecursosHumanos/Personal/Personal_ReportPDF?IdArea=' + idarea + '&IdCargo=' + idcargo + '&Estado=' + idestado;
            var link = document.createElement("a");
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function req_export() {
            let idarea = _('cbo_area').value, idcargo = _('cbo_cargo').value, idestado = _('cbo_estado').value;
            let urlaccion = urlBase() + 'RecursosHumanos/Personal/Personal_ReportExcel?IdArea=' + idarea + '&IdCargo=' + idcargo + '&Estado=' + idestado;
            $.ajax({
                type: 'GET',
                url: urlaccion,
                dataType: 'json',
                async: false,
            }).done(function (data) {
                if (data.Success) {
                    urlaccion = urlBase() + 'RecursosHumanos/Personal/descargarexcel_facturav';
                    window.location.href = urlaccion;
                }
            });
        }

        function req_new() {
            //let urlaccion = 'RecursosHumanos/Personal/New',
            //    urljs = urlaccion;
            //_Go_Url(urlaccion, urljs);
            let urlaccion = 'RecursosHumanos/Personal/Nuevo',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs, 'idpersonal:' + 0);
        }

         function req_edit() {
             //if (ovariables.idpersonal != 0) {
             //    let accion = 'edit';
             //    let urlaccion = 'RecursosHumanos/Personal/Edit', urljs = urlaccion;
             //    _Go_Url(urlaccion, urljs, 'idpersonal:' + ovariables.idpersonal);
             //}
             //else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
             if (ovariables.idpersonal != 0) {
                 let accion = 'edit';
                 let urlaccion = 'RecursosHumanos/Personal/Editar', urljs = urlaccion;
                 _Go_Url(urlaccion, urljs, 'idpersonal:' + ovariables.idpersonal);
             }
             else { swal({ title: "Advertencia!!", text: "Debe seleccionar un registro", type: "warning" }); }
        }
      
        function req_delete() {
            if (ovariables.idpersonal != 0) {
                if (ovariables.estado == '0') {
                    swal({
                        title: "Deshabilitar",
                        text: "¿Estás seguro de deshabilitar este registro?",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        req_status(ovariables.idpersonal);
                    });
                }
                else { swal({ title: "Advertencia", text: "Este registro esta deshabilitado", type: "warning" }); }
            } else { swal({ title: "Advertencia", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        function req_status(_idpersonal) {
            let urlaccion = 'RecursosHumanos/Personal/Personal_Delete';
            let par = { idpersonal: _idpersonal };
            frm = new FormData();
            frm.append('par', JSON.stringify(par));
            Post(urlaccion, frm, res_status);
        }

        function res_status(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "¡Buen trabajo!", text: "Haz deshabilitado el registro marcado", type: "success" });
                    req_ini();
                };
                if (orpta.estado === 'error') {
                    swal({ title: "¡Ha surgido un error!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                }
            }
        }

        function req_view() {           
            if (ovariables.idpersonal != 0) {
                let accion = 'view';
                let urlaccion = 'RecursosHumanos/Personal/Edit', urljs = 'RecursosHumanos/Personal/Edit';
                _Go_Url(urlaccion, urljs, 'idpersonal:' + ovariables.idpersonal + ',accion:' + accion);
            } else { swal({ title: "Advertencia", text: "Debe seleccionar un registro", type: "warning" }); }
        }

        function req_search() {
            req_info();
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
                    fn_load_area();
                    fn_load_sub_area();
                    fn_load_cargo();
                    fn_load_equipo();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
            _promise()
               .then(() => {
                   reglas_botoneras(app_Index);
               });
        }

        function fn_load_area() {
            let arr_area = ovariables.arr_area,
               cbo_area = `<option value='0'>Seleccione Área</option>`;

            if (arr_area.length > 0) { arr_area.forEach(x=> { cbo_area += `<option value='${x.idarea}'>${x.area}</option>`; }); }

            _('cbo_area').innerHTML = cbo_area;
            $('#cbo_area').select2();
        }

        function fn_load_sub_area() {
            let arr_sub_area = ovariables.arr_sub_area, idarea = _('cbo_area').value,
                resultado_sub_area = [],
                cbo_sub_area = ``;
                //cbo_sub_area = `<option value='0'>Seleccione un Sub Área</option>`;

            resultado_sub_area = arr_sub_area.filter(x=> idarea === '0' || x.idarea.toString() === idarea);
                      
            if (resultado_sub_area.length > 0) {
                resultado_sub_area.forEach(x=> {
                    obj = {},
                    obj.idsubarea = x.idsubarea;
                    ovariables.arr_id_sub_area.push(obj);
                    cbo_sub_area += `<option value='${x.idsubarea}'>${x.subarea}</option>`;
                });
                $(".chosen-container").css("pointer-events", "");
                $(".chosen-choices").css("background-color", "");
            }
            else {
                ovariables.arr_id_sub_area = [];
                $(".chosen-container").css("pointer-events", "none");
                $(".chosen-choices").css("background-color", "#eee");
            }
            ovariables.arr_id_sub_area_selection = ovariables.arr_id_sub_area;
            _('cbo_sub_area').innerHTML = cbo_sub_area;
            $(".chosen-select").trigger('chosen:updated');
        }

        function fn_load_cargo() {
            let arr_cargo = ovariables.arr_cargo, idarea = _('cbo_area').value,
                resultado_cargo = [],
               cbo_cargo = `<option value='0'>Seleccione Cargo</option>`;

            resultado_cargo = arr_cargo.filter(x => idarea === '0' || x.idarea.toString() === idarea);

            if (resultado_cargo.length > 0) { resultado_cargo.forEach(x=> { cbo_cargo += `<option value='${x.idcargo}'>${x.cargo}</option>`; }); }

            _('cbo_cargo').innerHTML = cbo_cargo;
            $('#cbo_cargo').select2();
        }

        function fn_load_equipo() {
            let arr_equipo = ovariables.arr_equipo, idarea = _('cbo_area').value,
                resultado_equipo = [],
               cbo_equipo = `<option value='0'>Seleccione Equipo</option>`;

            resultado_equipo = arr_equipo.filter(x => idarea === '0' || x.idarea.toString() === idarea);

            if (resultado_equipo.length > 0) { resultado_equipo.forEach(x=> { cbo_equipo += `<option value='${x.idequipo}'>${x.equipo}</option>`; }); }

            _('cbo_equipo').innerHTML = cbo_equipo;
            $('#cbo_equipo').select2();
        }

        function req_change_area() {
            fn_load_sub_area();
            fn_load_cargo();
            fn_load_equipo();
            req_load_personal();
        }

        function req_change_sub_area() {
            fn_load_sub_area_cargo();
            fn_load_sub_area_equipo();
            fn_load_sub_area_personal();
        }

        function fn_load_sub_area_cargo() {
            let arr_cargo = ovariables.arr_cargo, idarea = _('cbo_area').value,
                     resultado_cargo = [],
                     cbo_cargo = `<option value='0'>Seleccione un Cargo</option>`;

            if (ovariables.arr_id_sub_area_selection.length > 0) {
                resultado_cargo = arr_cargo.filter(m=> ovariables.arr_id_sub_area_selection.some(y=> { return (y.idsubarea.toString() === m.idsubarea.toString()) }));
            }

            if (resultado_cargo.length > 0) { resultado_cargo.forEach(x=> { cbo_cargo += `<option value='${x.idcargo}'>${x.cargo}</option>`; }); }

            _('cbo_cargo').innerHTML = cbo_cargo;
            $('#cbo_cargo').select2();
        }

        function fn_load_sub_area_equipo() {
            let arr_equipo = ovariables.arr_equipo, idarea = _('cbo_area').value,
                 resultado_equipo = [],
                cbo_equipo = `<option value='0'>Seleccione un Equipo</option>`;

            if (ovariables.arr_id_sub_area_selection.length > 0) { resultado_equipo = arr_equipo.filter(m=> ovariables.arr_id_sub_area_selection.some(y=> { return (y.idsubarea.toString() === m.idsubarea.toString()) })); }

            if (resultado_equipo.length > 0) { resultado_equipo.forEach(x=> { cbo_equipo += `<option value='${x.idequipo}'>${x.equipo}</option>`; }); }

            _('cbo_equipo').innerHTML = cbo_equipo;
            $('#cbo_equipo').select2();
        }

        function fn_load_sub_area_personal() {
            let arr_personal = ovariables.arr_personal;
            let resultado_personal = [], idarea = _('cbo_area').value,
                subarea = $("#cboSubArea").chosen().val() == null ? "0" : $("#cboSubArea").chosen().val(),
                idequipo = _('cbo_equipo').value, idcargo = _('cbo_cargo').value,
                personal = _('txt_personal').value;

            if (ovariables.arr_id_sub_area_selection.length > 0) {
                resultado_personal = arr_personal.filter(m=> ovariables.arr_id_sub_area_selection.some(y=> {
                    return (y.idsubarea.toString() === m.idsubarea.toString())
                }));
            }

            resultado_personal = resultado_personal.filter(x=> x.nombrepersonal.toLowerCase().indexOf(personal.toLowerCase) > -1 || x.nombrepersonal.toLowerCase().indexOf(personal.toLowerCase()) > -1);

            fn_load_personal(resultado_personal);
        }

        function req_info(){
            let err = function (__err) { console.log('err', __err) };
            let estado = _('cbo_estado').value;
            let parametro = { estado: estado };
            let urlaccion = 'RecursosHumanos/Personal/Personal_List?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_personal = rpta[0].personal != '' ? JSON.parse(rpta[0].personal) : [];
                    }
                    req_load_personal();
                }, (p) => { err(p); });
        }

        function req_load_personal() {
            let arr_personal = ovariables.arr_personal;
            let resultado_personal = [], idarea = _('cbo_area').value,
                subarea = $("#cboSubArea").chosen().val() == null ? "0" : $("#cboSubArea").chosen().val(),
                idequipo = _('cbo_equipo').value, idcargo = _('cbo_cargo').value,
                personal = _('txt_personal').value;

            resultado_personal = arr_personal.filter(x=>
                (idarea === '0' || x.idarea.toString() === idarea) &&
                (idequipo === '0' || x.idequipo.toString() === idequipo) &&
                (idcargo === '0' || x.idcargo.toString() === idcargo) &&
                (x.nombrepersonal.toLowerCase().indexOf(personal.toLowerCase) > -1 || x.nombrepersonal.toLowerCase().indexOf(personal.toLowerCase()) > -1)
            );

            fn_load_personal(resultado_personal);
        }

        function fn_load_personal(_resultado_personal) {
            ovariables.idpersonal = 0;
            ovariables.estado = 0;
            let resultado_personal = _resultado_personal,
             html = '', htmlheader = '', htmlbody = '';

            htmlheader = `
                <table id="tbl_personal" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>
                            <th style='width: 18%'>Colaborador</th>
                            <th style='width: 8%'>Fecha Ingreso</th>
                            <th style='width: 8%'>DNI</th>
                            <th style='width: 15%'>Área</th>
                            <th style='width: 17%'>Sub Área / Equipo</th>
                            <th style='width: 25%'>Puesto de Trabajo</th>
                            <th style='width: 8%'>Fecha Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                `
            ;

            resultado_personal.forEach(x=> {                
                htmlbody += `
                    <tr data-par='idpersonal:${x.idpersonal},estado:${x.estado}'>
                        <td>${x.nombrepersonal}</td>
                        <td>${x.fechainicio}</td>
                        <td>${x.dni}</td>
                        <td>${x.area}</td>
                        <td>${x.subarea_equipo}</td>
                        <td>${x.cargo}</td>
                        <td>${x.fechanacimiento}</td>
                    </tr>
                `;
            });

            html += htmlheader + htmlbody + '</tbody></table>';
            _('div_tabla_personal').innerHTML = html;

            let tbl = _('tbl_personal').tBodies[0], total = tbl.rows.length;
            handler_table(total);
            format_table();
        }

        function handler_table(indice) {
            let tbl = _('tbl_personal').tBodies[0], rows = tbl.rows, row = rows[indice];
            let array = Array.from(rows);
            array.forEach(x=> { x.addEventListener('click', event_rows); });
        }

        function event_rows(e) {
            let o = e.currentTarget, row = o, tbl = _('tbl_personal'), rows = tbl.rows;
            fn_clean_rows(rows);
            row.classList.add('row-selected');
            let par = row.getAttribute('data-par')
            ovariables.idpersonal = parseInt(_getPar(par, 'idpersonal'));
            ovariables.estado = parseInt(_getPar(par, 'estado'));
        }

        function fn_clean_rows(rows) {
            ovariables.idpersonal = 0;
            ovariables.estado = 0;
            let array = Array.from(rows);
            array.some(x=> { if (x.classList.contains('row-selected')) { x.classList.remove('row-selected'); return true; } });
        }

        function format_table() {
            $('#tbl_personal').DataTable({
                scrollY: "455px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                bPaginate: false
                //"pageLength": 50
            });
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_area_index');

(function ini() {
    app_Personal_Index.load();
    app_Personal_Index.req_ini();
})();
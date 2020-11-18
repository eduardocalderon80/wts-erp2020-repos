var appInventarioMotivo = (
    function (d, idpadre) {
        var oVariables = {
            lstMotivo: [],
            lstTipoMovimientos: [],
            IdMotivo: 0
        }

        function load() {
            _('_filtro_tipo').addEventListener('change', fn_filtrado);
            _('btnSave').addEventListener('click', req_GrabarDatos);
            _('btnReturn').addEventListener('click', fn_return);
        }

        function fn_LimpiarCampos() {
            _('_cbo_movimiento').value = 0;
            _('txtmotivo').value = "";
            oVariables.IdMotivo = 0;
        }
       
        function fn_CrearTabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `
                <table id="tbl_motivo" class ="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Movimiento</th>
                            <th>Motivo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `
                        <tr>
                            <td>${x.TipoMovimiento}</td>
                            <td>${x.Motivo}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-info" onclick="appInventarioMotivo.fn_EditarDatos(${x.IdTipoMotivo})" title="Editar Motivo">
                                    <span class="fa fa-edit" style="cursor:pointer;"></span>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="appInventarioMotivo.req_EliminarDatos(${x.IdTipoMotivo})" title="Eliminar Motivo">
                                    <span class="fa fa-trash" style="cursor:pointer;"></span>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_motivo').innerHTML = html;
        }
        function fn_filtrado() {
            let idtipo = _('_filtro_tipo').value;
            let resultado = oVariables.lstMotivo.filter(x =>
                (idtipo === '0' || x.IdTipoMovimiento.toString() === idtipo)
            );
            fn_CrearTabla(resultado);
        }
        function fn_CrearCombos() {
            let html = ``, html2 = `<option value='0'>Mostrar Todos</option>`;
            if (oVariables.lstTipoMovimientos.length > 0) {
                oVariables.lstTipoMovimientos.forEach(x => {
                    html += `<option value ='${x.IdTipoMovimiento}'>${x.TipoMovimiento}</option>`;
                    html2 += `<option value ='${x.IdTipoMovimiento}'>${x.TipoMovimiento}</option>`;
                });
            }
            _('_cbo_movimiento').innerHTML = html;
            _('_filtro_tipo').innerHTML = html2;
        }
        function fn_EditarDatos(data) {
            let filterData = oVariables.lstMotivo.filter(x => x.IdTipoMotivo == data)[0];
            _('_cbo_movimiento').value = filterData.IdTipoMovimiento;
            _('txtmotivo').value = filterData.Motivo;
            oVariables.IdMotivo = data;
        }
        function fn_return() {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/New';
            _Go_Url(urlAccion, urlAccion);
        }

        /* REQUESTS */
        function req_Inicio() {
            const urlaccion = 'DesarrolloTextil/InventarioColgador/GetData_Motivo';
            Get(urlaccion, res_Inicio);
        }
        function req_GrabarDatos() {
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_inventarioMotivo' });
            if (req_enty) {
                swal({
                    title: "Grabar Datos",
                    text: "¿Estas seguro/a que deseas guardar estos datos?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let data = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_inventarioMotivo' });
                    data.idmotivo = oVariables.IdMotivo;
                    const urlaccion = 'DesarrolloTextil/InventarioColgador/SaveData_Motivo';
                    const form = new FormData();
                    form.append("par", JSON.stringify(data));
                    Post(urlaccion, form, res_GrabarDatos);
                });
            }
        }
        function req_EliminarDatos(data) {
            swal({
                title: "Eliminar Datos",
                text: "¿Estas seguro/a que deseas eliminar estos datos?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let par = { idmotivo: data }
                const urlaccion = 'DesarrolloTextil/InventarioColgador/DeleteData_Motivo';
                const form = new FormData();
                form.append("par", JSON.stringify(par));
                Post(urlaccion, form, res_EliminarDatos);
            });
        }

        /* RESPONSES */
        function res_Inicio(resultado) {
            let rpta = resultado !== '' ? JSON.parse(resultado) : null;
            if (rpta !== null) {
                oVariables.lstMotivo = rpta[0].lstMotivo !== '' ? JSON.parse(rpta[0].lstMotivo) : null;
                oVariables.lstTipoMovimientos = rpta[0].lstTipoMovimientos !== '' ? JSON.parse(rpta[0].lstTipoMovimientos) : null;
                fn_CrearTabla(oVariables.lstMotivo);
                fn_CrearCombos();
            }
        }
        function res_GrabarDatos(resultado) {
            if (resultado != null) {
                if (resultado == 0) {
                    swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });
                } else if (resultado == 1) {
                    swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                }
                fn_LimpiarCampos();
                req_Inicio();
            } else {
                swal({ title: "¡Ha surgido un problema!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
            }
        }
        function res_EliminarDatos(resultado) {
            if (resultado != 0) {
                swal({ title: "¡Buen Trabajo!", text: "Se deshabilito motivo con exito", type: "success" });
                fn_LimpiarCampos();
                req_Inicio();
            } else {
                swal({ title: "¡Ha surgido un problema!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
            }
        }

        return {
            load: load,
            req_Inicio: req_Inicio,
            oVariables: oVariables,
            fn_EditarDatos: fn_EditarDatos,
            req_EliminarDatos: req_EliminarDatos
        }
    }
)(document, 'panelEncabezado_inventarioMotivo');
(
    function ini() {
        appInventarioMotivo.load();
        appInventarioMotivo.req_Inicio();
    }
)();
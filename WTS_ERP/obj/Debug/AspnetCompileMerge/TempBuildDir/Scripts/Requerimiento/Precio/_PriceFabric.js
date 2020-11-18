var app_PriceFabric = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstprecios: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnAddPriceFabric').addEventListener('click', fn_add);
            _('btnPriceTelaSave').addEventListener('click', fn_save);

            const par = _('pricefabric_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idprograma = _par(par, 'idprograma') !== '' ? _parseInt(_par(par, 'idprograma')) : 0;
            }
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdRequerimiento: ovariables.id };
            _Get('Requerimiento/Precio/GetPrecioTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstprecios = rpta;
                        fn_createtable(ovariables.lstprecios);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_fabric');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.IdPrecioTela}">
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="app_PriceFabric.fn_remove(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>${x.FechaCreacionUsuario}</td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Cantidad}">
                                </td>
                                <td>
                                    <select class="form-control input-sm input_readonly">
                                        <option value="kg" ${x.Unidad === 'kg' ? 'selected' : ''}>kilograms</option>
                                        <option value="m" ${x.Unidad === 'm' ? 'selected' : ''}>meters</option>
                                        <option value="yd" ${x.Unidad === 'yd' ? 'selected' : ''}>yards</option>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Muestra}">
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Produccion}">
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Comentario}">
                                </td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            }
        }

        function fn_add() {
            const tbody = _('tbody_tbl_prices_fabric');
            tbody.insertAdjacentHTML('beforeend', `<tr data-id="0">
                                                        <td>
                                                            <button type="button" class="btn btn-xs btn-danger" onclick="app_PriceFabric.fn_remove(this)">
                                                                <i class="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                        <td>${_getDate101()}</td>
                                                        <td>
                                                            <input type="text" class="form-control input-sm input_readonly">
                                                        </td>
                                                        <td>
                                                            <select class="form-control input-sm input_readonly">
                                                                <option value="kg">kilograms</option>
                                                                <option value="m">meters</option>
                                                                <option value="yd">yards</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control input-sm input_readonly">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control input-sm input_readonly">
                                                        </td>
                                                        <td>
                                                            <input type="text" class="form-control input-sm input_readonly">
                                                        </td>
                                                    </tr>`);
        }

        function fn_remove(e) {
            const tr = e.parentElement.parentElement;
            const id = e.parentElement.parentElement.getAttribute("data-id");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will save the prices entered",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                if (id !== '0') {
                    let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                    let parametro = { IdPrecioTela: id }
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Precio/DeletePrecioTela', frm, true)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                tr.remove();
                                swal({ title: "Good job!", text: "The price was deleted successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                } else {
                    tr.remove();
                    swal({ title: "Good job!", text: "The price was deleted successfully", type: "success", timer: 5000 });
                }
            });
        }

        function fn_val_table() {
            let bool = true;
            const fields = [...document.querySelectorAll("#tbody_tbl_prices_fabric .input_readonly")];
            fields.forEach(x => {
                if (x.value === '') {
                    bool = false;
                    x.style = 'border: 1px solid red !important;';
                } else {
                    x.style = '';
                }
            });
            return bool;
        }

        function fn_get_table() {
            let array = [];
            const rows = [..._('tbody_tbl_prices_fabric').children];
            if (rows.length > 0) {
                rows.forEach((x, y) => {
                    let json = {};
                    json["Id"] = y;
                    json["IdPrecioTela"] = x.getAttribute("data-id");
                    json["IdRequerimiento"] = ovariables.id;
                    json["FechaCreacionUsuario"] = x.children[1].textContent;
                    json["Cantidad"] = x.children[2].children[0].value;
                    json["Unidad"] = x.children[3].children[0].value;
                    json["Muestra"] = x.children[4].children[0].value;
                    json["Produccion"] = x.children[5].children[0].value;
                    json["Comentario"] = x.children[6].children[0].value;
                    array.push(json);
                });
            }
            return array;
        }

        function fn_save() {
            const rows = [..._('tbody_tbl_prices_fabric').children];
            if (rows.length > 0) {
                if (fn_val_table()) {
                    swal({
                        html: true,
                        title: "Are you sure?",
                        text: "You will save the prices entered",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                        let parametro = {
                            IdPrograma: ovariables.idprograma,
                            JSONInfo: fn_get_table()
                        }
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Precio/InsertPrecioTela', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The prices was saved successfully", type: "success", timer: 5000 });
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "You have to add at least 1 row", type: "warning", timer: 5000 });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_remove: fn_remove,
            fn_val_table: fn_val_table,
            fn_get_table: fn_get_table
        }
    }
)(document, 'panelEncabezado_PriceFabric');
(
    function ini() {
        app_PriceFabric.load();
        app_PriceFabric.req_ini();
    }
)();
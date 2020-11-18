var app_PriceTrim = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstavios: [],
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnPriceTrimSave').addEventListener('click', fn_save);
            _('btnPriceTrimExport').addEventListener('click', fn_export);

            const par = _('pricetrim_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                ovariables.idprograma = _par(par, 'idprograma') !== '' ? _parseInt(_par(par, 'idprograma')) : 0;
            }
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdPrograma: ovariables.idprograma };
            _Get('Requerimiento/Precio/GetPrecioAvios?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstavios = rpta;
                        fn_createtable(ovariables.lstavios);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_trim');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.IdRequerimiento}">
                                <td>${x.NombreProveedor}</td>
                                <td>${x.TipoAvioNombre}</td>
                                <td>${x.CodigoAvio}</td>
                                <td>${x.DescripcionName}</td>
                                <td>${x.TiempoEspera}</td>
                                <td>
                                    <input type="number" class="form-control input-sm input_readonly" value="${x.Costo}">
                                </td>
                                <td>
                                    <input type="number" class="form-control input-sm input_readonly" value="${x.Unidad}">
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Comentario}">
                                </td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            } else {
                tbody.innerHTML = `<tr><td colspan="9">No se encontro datos</td></tr>`;
            }
        }

        function fn_val_table() {

            //primera validacion
            let bool = true;
            const fields = [...document.querySelectorAll("#tbody_tbl_prices_trim .input_readonly")];
            fields.forEach(x => {
                if (x.value === '') {
                    bool = false;
                    x.style = 'border: 1px solid red !important;';
                } else {
                    x.style = '';
                }
            });

            //segunda validacion : numero validos de costo y unidad

            if (bool) {

                const rows = [..._('tbody_tbl_prices_trim').children];
                if (rows.length > 0) {

                    rows.forEach(x => {

                        let costo = parseFloat(x.children[5].children[0].value = '' ? 0 : x.children[5].children[0].value);
                        let unidad = parseFloat(x.children[6].children[0].value = '' ? 0 : x.children[6].children[0].value);

                        if (costo < 0 || unidad < 0)
                            bool = false;
                    });
                }
            }      

            return bool;
        }

        function fn_get_table() {
            let array = [];
            const rows = [..._('tbody_tbl_prices_trim').children];
            if (rows.length > 0) {
                rows.forEach(x => {
                    let json = {};
                    json["IdRequerimiento"] = x.getAttribute("data-id");
                    json["Costo"] = x.children[5].children[0].value;
                    json["Unidad"] = x.children[6].children[0].value;
                    json["Comentario"] = x.children[7].children[0].value;
                    array.push(json);
                });
            }
            return array;
        }

        function fn_save() {
            const rows = [..._('tbody_tbl_prices_trim').children];
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
                        _Post('Requerimiento/Precio/InsertPrecioAvio', frm, true)
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

        function fn_export() {
            const tbody = ovariables.lstavios.map(x => {
                return `<tr>
                            <td style="background: #ffffff;">${x.NombreProveedor}</td>
                            <td style="background: #ffffff;">${x.TipoAvioNombre}</td>
                            <td style="background: #ffffff;">${x.CodigoAvio}</td>
                            <td style="background: #ffffff;">${x.DescripcionName}</td>
                            <td style="background: #ffffff;">${x.TiempoEspera}</td>
                            <td style="background: #ffffff;">${x.Costo}</td>
                            <td style="background: #ffffff;">${x.Unidad}</td>
                            <td style="background: #ffffff;">${x.Comentario}</td>
                        </tr>`;
            }).join('');

            const table = `<table border="1" style="width: 1200px;">
                                <thead>                            
                                    <tr>                                
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Suplier Name</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Trim Type</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Trim Code</th>
                                        <th width="20%" x:autofilter="all" style="background-color: #000000; color: white;">Trim Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">LeadTime</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Cost $</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Unity</th>
                                        <th width="20%" x:autofilter="all" style="background-color: #000000; color: white;">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tbody}
                                </tbody>
                            </table>`;

            _createExcel({
                worksheet: 'Trim Prices Report',
                style: '',
                table: table,
                filename: 'Trim Prices Report'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_val_table: fn_val_table,
            fn_get_table: fn_get_table
        }
    }
)(document, 'panelEncabezado_PriceFabric');
(
    function ini() {
        app_PriceTrim.load();
        app_PriceTrim.req_ini();
    }
)();
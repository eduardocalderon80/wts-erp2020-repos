var app_PriceOrnament = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstartes: [],
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnPriceArteSave').addEventListener('click', fn_save);
            _('btnPriceArteExport').addEventListener('click', fn_export);

            const par = _('priceornament_txtpar').value;
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
            _Get('Requerimiento/Precio/GetPrecioArte?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstartes = rpta;
                        fn_createtable(ovariables.lstartes);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_ornament');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.IdRequerimiento}">
                                <td>${x.ArteCodigoWts}</td>
                                <td>${x.ArteTecnicaNombre}</td>
                                <td>${x.ArteDescripcion}</td>
                                <td>${x.CodigoTelaWTS}</td>
                                <td>${x.DescripcionTela}</td>
                                <td>${x.EstiloCodigoWts}</td>
                                <td>${x.EstiloDescripcion}</td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Costo}">
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Unidad}">
                                </td>
                                <td>
                                    <input type="text" class="form-control input-sm input_readonly" value="${x.Comentario}">
                                </td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            } else {
                tbody.innerHTML = `<tr><td colspan="10">No se encontro datos</td></tr>`;
            }
        }

        function fn_val_table() {
            let bool = true;
            const fields = [...document.querySelectorAll("#tbody_tbl_prices_ornament .input_readonly")];
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
            const rows = [..._('tbody_tbl_prices_ornament').children];
            if (rows.length > 0) {
                rows.forEach(x => {
                    let json = {};
                    json["IdRequerimiento"] = x.getAttribute("data-id");
                    json["Costo"] = x.children[7].children[0].value;
                    json["Unidad"] = x.children[8].children[0].value;
                    json["Comentario"] = x.children[9].children[0].value;
                    array.push(json);
                });
            }
            return array;
        }

        function fn_save() {
            const rows = [..._('tbody_tbl_prices_ornament').children];
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
                        _Post('Requerimiento/Precio/InsertPrecioArte', frm, true)
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
            const tbody = ovariables.lstartes.map(x => {
                return `<tr>
                            <td style="background: #ffffff;">${x.ArteCodigoWts}</td>
                            <td style="background: #ffffff;">${x.ArteTecnicaNombre}</td>
                            <td style="background: #ffffff;">${x.ArteDescripcion}</td>
                            <td style="background: #ffffff;">${x.CodigoTelaWTS}</td>
                            <td style="background: #ffffff;">${x.DescripcionTela}</td>
                            <td style="background: #ffffff;">${x.EstiloCodigoWts}</td>
                            <td style="background: #ffffff;">${x.EstiloDescripcion}</td>
                            <td style="background: #ffffff;">${x.Costo}</td>
                            <td style="background: #ffffff;">${x.Unidad}</td>
                            <td style="background: #ffffff;">${x.Comentario}</td>
                        </tr>`;
            }).join('');

            const table = `<table border="1" style="width: 1300px;">
                                <thead>                            
                                    <tr>                                
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Ornament Code</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Tecnhique</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Ornament Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Fabric Code</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Fabric Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Style Number</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Style Client Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Cost $</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Unit</th>
                                        <th width="20%" x:autofilter="all" style="background-color: #000000; color: white;">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tbody}
                                </tbody>
                            </table>`;

            _createExcel({
                worksheet: 'Ornament Prices Report',
                style: '',
                table: table,
                filename: 'Ornament Prices Report'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_PriceOrnament');
(
    function ini() {
        app_PriceOrnament.load();
        app_PriceOrnament.req_ini();
    }
)();
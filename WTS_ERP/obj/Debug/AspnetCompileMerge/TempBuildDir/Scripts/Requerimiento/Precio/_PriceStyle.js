var app_PriceStyle = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lstestilo: [],
            lstdetalle: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnPriceStyleSave').addEventListener('click', fn_save);
            _('btnPriceStyleExport').addEventListener('click', fn_export);

            const par = _('pricestyle_txtpar').value;
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
            _Get('Requerimiento/Precio/GetPrecioEstilo?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstestilo = rpta.lstestilo !== '' ? JSON.parse(rpta.lstestilo) : [];
                        ovariables.lstdetalle = rpta.lstdetalle !== '' ? JSON.parse(rpta.lstdetalle) : [];
                        fn_createtable(ovariables.lstestilo);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_style');
            if (data.length > 0) {
                let html = ``;
                data.forEach(x => {
                    html += `<tr data-id="${x.IdRequerimiento}" data-estilo="${x.IdEstilo}">
                                <td>${x.CodigoEstiloWts}</td>
                                <td>${x.CodigoEstiloCliente}</td>
                                <td>${x.DescripcionCliente}</td>
                                <td>${x.DescripcionTela}</td>
                                <td colspan="11" class="text-left">${x.DescripcionTelasEnlazadas}</td>
                            </tr>`
                    const detalle = x.MuestrasDetalle !== '' ? CSVtoJSON(x.MuestrasDetalle) : [];
                    if (detalle.length > 0) {
                        detalle.forEach(z => {
                            const array = ovariables.lstdetalle.filter(x => x.IdMuestraDetalle === parseInt(z.IdRequerimientoDetalle));
                            const detalle = array.length > 0 ? array[0] : [];
                            html += `<tr data-requerimiento="${x.IdRequerimiento}" data-muestra="${z.IdRequerimiento}" data-muestradetalle="${z.IdRequerimientoDetalle}" class="cls_req_detalle">
                                        <td colspan="6" class="text-right">${z.NombreTipoMuestra}</td>
                                        <td>${z.NombreClienteColor} - ${z.NombreClienteTalla}</td>
                                        <td><input type="number" class="form-control input-sm input_readonly" onkeyup="app_PriceStyle.fn_get_fobmargin(this)" value="${detalle.FOBFabrica}"></td>
                                        <td><input type="number" class="form-control input-sm input_readonly" onkeyup="app_PriceStyle.fn_get_fobmargin(this)" value="${detalle.FOBCliente}"></td>
                                        <td>0%</td>
                                        <td><input type="number" class="form-control input-sm input_readonly" value="${detalle.Flete}"></td>
                                        <td><input type="number" class="form-control input-sm input_readonly" onkeyup="app_PriceStyle.fn_get_ddpmargin(this)" value="${detalle.DDPWTS}"></td>
                                        <td><input type="number" class="form-control input-sm input_readonly" onkeyup="app_PriceStyle.fn_get_ddpmargin(this)" value="${detalle.DDPCliente}"></td>
                                        <td>0%</td>
                                        <td><input type="text" class="form-control input-sm input_readonly" value="${detalle.Comentario !== undefined ? detalle.Comentario : ''}"></td>
                                    </tr>`
                        });
                    }
                });
                tbody.innerHTML = html;

                // LUEGO QUE INSERTA PARA ACTIVAR EVENTO
                [...document.querySelectorAll('#tbody_tbl_prices_style .cls_req_detalle .input_readonly')].forEach(x => {
                    $(x).keyup();
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="15">No se encontro datos</td></tr>`;
            }
        }

        function fn_val_table() {
            let bool = true;
            const fields = [...document.querySelectorAll('#tbody_tbl_prices_style .cls_req_detalle .input_readonly')];
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
            const rows = [...document.querySelectorAll('#tbody_tbl_prices_style .cls_req_detalle')];
            if (rows.length > 0) {
                rows.forEach(x => {
                    let json = {};
                    json["IdRequerimiento"] = x.getAttribute("data-requerimiento");
                    json["IdMuestra"] = x.getAttribute("data-muestra");
                    json["IdMuestraDetalle"] = x.getAttribute("data-muestradetalle");
                    json["FOBFabrica"] = x.children[2].children[0].value;
                    json["FOBCliente"] = x.children[3].children[0].value;
                    json["Flete"] = x.children[5].children[0].value;
                    json["DDPWTS"] = x.children[6].children[0].value;;
                    json["DDPCliente"] = x.children[7].children[0].value;
                    json["Comentario"] = x.children[9].children[0].value;
                    array.push(json);
                });
            }
            return array;
        }

        function fn_get_fobmargin(e) {
            const tr = e.parentElement.parentElement;
            const resul = tr.children[4];
            const fabrica = parseFloat(tr.children[2].children[0].value);
            const cliente = parseFloat(tr.children[3].children[0].value);

            const rpta1 = (cliente - fabrica) / cliente;
            const rpta2 = rpta1 * 100;
            const rpta3 = Math.round(rpta2);

            if (isNaN(rpta3)) {
                resul.innerHTML = 0;
            } else if (rpta3 < 0) {
                resul.innerHTML = 0;
            } else {
                resul.innerHTML = `${rpta3}%`;
            }
        }

        function fn_get_ddpmargin(e) {
            const tr = e.parentElement.parentElement;
            const resul = tr.children[8];
            const ddpwts = parseFloat(tr.children[6].children[0].value);
            const ddpcliente = parseFloat(tr.children[7].children[0].value);

            const rpta1 = (ddpcliente - ddpwts) / ddpcliente;
            const rpta2 = rpta1 * 100;
            const rpta3 = Math.round(rpta2);

            if (isNaN(rpta3)) {
                resul.innerHTML = 0;
            } else if (rpta3 < 0) {
                resul.innerHTML = 0;
            } else {
                resul.innerHTML = `${rpta3}%`;
            }
        }

        function fn_save() {
            const rows = [...document.querySelectorAll('#tbody_tbl_prices_style .cls_req_detalle')];
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
                        _Post('Requerimiento/Precio/InsertPrecioEstilo', frm, true)
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
            let tbody = ``;
            ovariables.lstestilo.forEach(x => {
                tbody += `<tr data-id="${x.IdRequerimiento}" data-estilo="${x.IdEstilo}">
                                <td>${x.CodigoEstiloWts}</td>
                                <td>${x.CodigoEstiloCliente}</td>
                                <td>${x.DescripcionCliente}</td>
                                <td>${x.DescripcionTela}</td>
                                <td colspan="11" style="text-align: left;">${x.DescripcionTelasEnlazadas}</td>
                            </tr>`
                const detalle = x.MuestrasDetalle !== '' ? CSVtoJSON(x.MuestrasDetalle) : [];
                if (detalle.length > 0) {
                    detalle.forEach(z => {
                        const array = ovariables.lstdetalle.filter(x => x.IdMuestraDetalle === parseInt(z.IdRequerimientoDetalle));
                        const detalle = array.length > 0 ? array[0] : [];
                        tbody += `<tr data-requerimiento="${x.IdRequerimiento}" data-muestra="${z.IdRequerimiento}" data-muestradetalle="${z.IdRequerimientoDetalle}" class="cls_req_detalle">
                                        <td colspan="6" style="text-align: right;">${z.NombreTipoMuestra}</td>
                                        <td>${z.NombreClienteColor} - ${z.NombreClienteTalla}</td>
                                        <td>${detalle.FOBFabrica}</td>
                                        <td>${detalle.FOBCliente}</td>
                                        <td>0%</td>
                                        <td>${detalle.Flete}</td>
                                        <td>${detalle.DDPWTS}</td>
                                        <td>${detalle.DDPCliente}</td>
                                        <td>0%</td>
                                        <td>${detalle.Comentario}</td>
                                    </tr>`
                    });
                }
            });

            const table = `<table border="1" style="width: 1300px;">
                                <thead>                            
                                    <tr>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Style Code</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Client Style Number</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Client Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Fabric Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Fabric Complemetary Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Sample Type</th>
                                        <th width="6%" x:autofilter="all" style="background-color: #000000; color: white;">Color Combo</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">FOB Factory $</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">FOB Client $</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">FOB Margin WTS (%)</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Fleight $</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">DDP WTS</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">DDP Client</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">DDP Margin WTS (%)</th>
                                        <th width="10%" x:autofilter="all" style="background-color: #000000; color: white;">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tbody}
                                </tbody>
                            </table>`;

            _createExcel({
                worksheet: 'Fabric Prices Report',
                style: '',
                table: table,
                filename: 'Fabric Prices Report'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_get_fobmargin: fn_get_fobmargin,
            fn_get_ddpmargin: fn_get_ddpmargin,
            fn_val_table: fn_val_table,
            fn_get_table: fn_get_table
        }
    }
)(document, 'panelEncabezado_PriceStyle');
(
    function ini() {
        app_PriceStyle.load();
        app_PriceStyle.req_ini();
    }
)();
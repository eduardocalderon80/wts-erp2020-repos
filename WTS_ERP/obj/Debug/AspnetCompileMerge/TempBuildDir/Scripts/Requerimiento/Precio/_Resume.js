var app_PriceResume = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnResumePriceExport').addEventListener('click', fn_export);

            const par = _('pricesresume_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
            }
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdFlashCost: ovariables.id };
            _Get('Requerimiento/Precio/GetFlashCost?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        const lstfabric = rpta.csvfabric !== '' ? CSVtoJSON(rpta.csvfabric) : [];
                        const lstcost = rpta.costcsv !== '' ? CSVtoJSON(rpta.costcsv) : [];

                        const tbody_tbl_cost = _('tbody_tbl_cost');
                        let html = '';
                        lstfabric.forEach(x => {
                            html += `<tr>
                                        <td>${x.label}</td>
                                        <td>${x.valor !== '' ? parseFloat(x.valor).toFixed(2) : '0.00'}</td>
                                        <td>${x.unidad}</td>
                                    </tr>`;
                        });

                        lstcost.forEach(x => {
                            html += `<tr>
                                        <td>${x.label}</td>
                                        <td>${x.valor !== '' ? parseFloat(x.valor).toFixed(2) : '0.00'}</td>
                                        <td>${x.unidad}</td>
                                    </tr>`;
                        });

                        html += `<tr>
                                    <td>Production cost</td>
                                    <td style="border-top-color:black;border-top-width:2px;">${parseFloat(rpta.productioncost).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>
                                <tr>
                                    <td style="color:red">Factory margin (30%)</td>
                                    <td>${parseFloat(rpta.factorymargin).toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><b>Price factory (FOB)</b></td>
                                    <td style="border-top-color:red;border-top-width:2px;">${parseFloat(rpta.pricefactoryfob).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>

                                <tr>
                                    <td>Estimated freight</td>
                                    <td>${parseFloat(rpta.estimatedfreight).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>

                                <tr>
                                    <td><b>Total cost (WTS)</b></td>
                                    <td style="border-top-color:black;border-top-width:2px;">${parseFloat(rpta.totalcostwts).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>
                                <tr>
                                    <td style="color:red">Net margin (15%)</td>
                                    <td>${parseFloat(rpta.netmargin).toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Non-marginal cost</td>
                                    <td>${parseFloat(rpta.nonmargincost).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>
                                <tr>
                                    <td><b>Price WTS (DDP)</b></td>
                                    <td style="border-top-color:black;border-top-width:2px;">${parseFloat(rpta.pricewtsddp).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>
                                <tr>
                                    <td style="color:red"><b>Adjustment</b></td>
                                    <td>${parseFloat(rpta.adjustment).toFixed(2)}</td>
                                    <td>$/Garment</td>
                                </tr>`;

                        tbody_tbl_cost.innerHTML = html;
                    }
                }, (p) => { err(p); });
        }

        function fn_export() {
            const tbody = _('tbody_tbl_cost').innerHTML;

            const table = `<table border="1" style="width: 1000px;">
                                <thead>                            
                                    <tr>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Concept</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Value</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tbody}
                                </tbody>
                            </table>`;

            _createExcel({
                worksheet: 'Price Resume Report',
                style: '',
                table: table,
                filename: 'Price Resume Report'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_ResumePrices');
(
    function ini() {
        app_PriceResume.load();
        app_PriceResume.req_ini();
    }
)();
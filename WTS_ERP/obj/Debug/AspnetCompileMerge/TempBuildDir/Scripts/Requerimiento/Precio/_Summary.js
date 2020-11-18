var app_PriceSummary = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            lstsummary: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnSummaryPricesExport').addEventListener('click', fn_export);

            const par = _('pricesummary_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
            }
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdCliente: ovariables.idcliente };
            _Get('Requerimiento/Precio/GetAllFlashCost?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstsummary = rpta;
                        fn_createtable(ovariables.lstsummary);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_summary');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr data-id="${x.idflashcost}">
                                <td>${x.tipoflashcost}</td>
                                <td>${x.fechacreacion}</td>
                                <td>${x.lider}</td>
                                <td></td>
                                <td></td>
                                <td>${x.cantidadtela}</td>
                                <td>${x.cantidadcolor}</td>
                                <td>${x.cantidadestilo}</td>
                                <td></td>
                                <td></td>
                                <td>${parseFloat(x.pricefactoryfob).toFixed(2)}</td>
                                <td>${parseFloat(x.totalcostwts).toFixed(2)}</td>
                                <td>${parseFloat(x.pricewtsddp).toFixed(2)}</td>
                                <td>${parseFloat(x.adjustment).toFixed(2)}</td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            } else {
                tbody.innerHTML = `<tr><td colspan="14">No se encontro datos</td></tr>`;
            }
        }

        function fn_export() {
            const tbody = ovariables.lstsummary.map(x => {
                return `<tr>
                            <td style="background: #ffffff;">${x.tipoflashcost}</td>
                            <td style="background: #ffffff;">${x.fechacreacion}</td>
                            <td style="background: #ffffff;">${x.lider}</td>
                            <td style="background: #ffffff;"></td>
                            <td style="background: #ffffff;"></td>
                            <td style="background: #ffffff;">${x.cantidadtela}</td>
                            <td style="background: #ffffff;">${x.cantidadcolor}</td>
                            <td style="background: #ffffff;">${x.cantidadestilo}</td>
                            <td style="background: #ffffff;"></td>
                            <td style="background: #ffffff;"></td>
                            <td style="background: #ffffff;">${parseFloat(x.pricefactoryfob).toFixed(2)}</td>
                            <td style="background: #ffffff;">${parseFloat(x.totalcostwts).toFixed(2)}</td>
                            <td style="background: #ffffff;">${parseFloat(x.pricewtsddp).toFixed(2)}</td>
                            <td style="background: #ffffff;">${parseFloat(x.adjustment).toFixed(2)}</td>
                        </tr>`;
            }).join('');

            const table = `<table border="1" style="width: 1300px;">
                                <thead>                            
                                    <tr>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Flash Type</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Created Date</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Leader</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Style Code</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Client Style Number</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Qty Fabric</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Qty Color</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Qty Style</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Fabric Code</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Fabric Desription</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Price Factory FOB</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Total Cost WTS</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Price WTS DDP</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Adjustement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tbody}
                                </tbody>
                            </table>`;

            _createExcel({
                worksheet: 'Prices Report',
                style: '',
                table: table,
                filename: 'Prices Report'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_SummaryPrices');
(
    function ini() {
        app_PriceSummary.load();
        app_PriceSummary.req_ini();
    }
)();
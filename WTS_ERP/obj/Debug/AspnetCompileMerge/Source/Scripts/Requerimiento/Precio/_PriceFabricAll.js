var app_PriceFabricAll = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: '',
            idprograma: 0,
            lsttelas: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('btnPriceFabricAllExport').addEventListener('click', fn_export);

            const par = _('pricefabricall_txtpar').value;
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
            _Get('Requerimiento/Precio/GetAllPrecioTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lsttelas = rpta;
                        fn_createtable(ovariables.lsttelas);
                    }
                }, (p) => { err(p); });
        }

        function fn_createtable(data) {
            const tbody = _('tbody_tbl_prices_fabric_all');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<tr>
                                <td>${x.Origen}</td>
                                <td>${x.FechaCreacion}</td>
                                <td>${x.NombreProveedor}</td>
                                <td>${x.CodigoTelaWTS}</td>
                                <td>${x.DescripcionTela}</td>
                                <td>${x.Cantidad}</td>
                                <td>${x.Unidad}</td>
                                <td>${x.Muestra}</td>
                                <td>${x.Produccion}</td>
                                <td>${x.Comentario}</td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = html;
            } else {
                tbody.innerHTML = `<tr><td colspan="10">No se encontro datos</td></tr>`;
            }
        }

        function fn_export() {
            const tbody = ovariables.lsttelas.map(x => {
                return `<tr>
                            <td style="background: #ffffff;">${x.Origen}</td>
                            <td style="background: #ffffff;">${x.FechaCreacion}</td>
                            <td style="background: #ffffff;">${x.NombreProveedor}</td>
                            <td style="background: #ffffff;">${x.CodigoTelaWTS}</td>
                            <td style="background: #ffffff;">${x.DescripcionTela}</td>
                            <td style="background: #ffffff;">${x.Cantidad}</td>
                            <td style="background: #ffffff;">${x.Unidad}</td>
                            <td style="background: #ffffff;">${x.Muestra}</td>
                            <td style="background: #ffffff;">${x.Produccion}</td>
                            <td style="background: #ffffff;">${x.Comentario}</td>
                        </tr>`;
            }).join('');

            const table = `<table border="1" style="width: 1300px;">
                                <thead>                            
                                    <tr>                                
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Origin</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Created Date</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Supplier</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">WTS Fabric Code</th>
                                        <th width="18%" x:autofilter="all" style="background-color: #000000; color: white;">WTS Fabric Description</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Quantity</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Unit</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Sample</th>
                                        <th x:autofilter="all" style="background-color: #000000; color: white;">Productión</th>
                                        <th width="20%" x:autofilter="all" style="background-color: #000000; color: white;">Comments</th>
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
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_PriceFabricAll');
(
    function ini() {
        app_PriceFabricAll.load();
        app_PriceFabricAll.req_ini();
    }
)();
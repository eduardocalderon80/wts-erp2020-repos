//order with data: https://datatables.net/examples/plug-ins/dom_sort.html
//https://uxsolutions.github.io/bootstrap-datepicker/?markup=input&format=&weekStart=&startDate=&endDate=&startView=0&minViewMode=0&maxViewMode=4&todayBtn=false&clearBtn=false&language=en&orientation=auto&multidate=&multidateSeparator=&keyboardNavigation=on&forceParse=on#sandbox
var oAprobacion = (function (d,w) {
    var appAprobacion = {
        controller: 'Aprobacion/AprobacionFabrica',
        fabrica: ''
    }

    //function DatePicker() {
    //    $('.sandbox-container').datepicker({
    //        clearBtn: true,
    //        autoclose: true
    //    });
    //}
    /* :sarone
     * rightColumns: 1 // : si se coloca no mantiene el campo x ser una columna fija, [sino se mantiene funciona exacto]
     * "columns": [] // : aqui se ingresa todos los campos para mantener x el tipo, => { "orderDataType": "dom-text", type: 'string' }  // congelar columna para el input 
     * "fecha:" => <td> <div class='sandbox-container input-group date'><input type="text" class="form-control fecha"  value=''/><span class="input-group-addon"><i class="fa fa-calendar"></i></span> </div> </td>
     * */
    function DataTablesConfiguration() {
        $('#tblAprobacion').DataTable({
            scrollY: "500px",
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            stateSave: true,
            "order": [],
            "bFilter": true,
            fixedColumns: {
                leftColumns: 4,
                //rightColumns: 1
            },
            "columns": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                { "orderDataType": "dom-text", type: 'string' }
            ]
        });
    }

    async function ini() {        
        const parametro = getParameter('p'); //'MTIz';
        const accion = 'GetAprobacionOCxFabrica';
        const url = `${appAprobacion.controller}/${accion}?par=${parametro}`;
        const adata = await _Get(url, true)        
                        .then((respuestaJSONtext) => loadGrid(respuestaJSONtext));
    }

    function plantillaHTML(arrJSON) {
        const aRows = arrJSON.map(x => {
            return `<tr data-parJSON='CodCliente:${x.CodCliente};CodFabrica:${x.CodFabrica};CodEmpresa:${x.CodEmpresa};Lot:${x.Lot};PO:${x.PO};Estilo:${x.Estilo};Color:${x.CodColor}'>
                        <td>${x.NumeroDiasDeRetraso} </td>
                        <td>${x.Fecha_PO} </td> 
                        <td>${x.Cliente} </td>                       
                        <td>${x.TipoPO} </td>
                        <td>${x.PO} </td>

                        <td>${x.Estilo} </td>
                        <td>${x.Color} </td>
                        <td>${x.Articulo} </td>
                        <td>${x.Cantidad} </td>
                        <td><input type="text" class="form-control _octextil" maxlength="15"> </td>
                    </tr>`;
        });

        

        const tableHTML = `<table id="tblAprobacion" class="table table-bordered table-hover stripe row-border order-column" style="width:100%">
                        <thead>
                            <tr>
                                <th>Dias<br> Pendiente</th>
                                <th>Fecha <br> de <br>Ingreso <br />PO/BUY</th>
                                <th>Cliente</th>
                                <th>Tipo<br>PO</th>
                                <th>PO</th>

                                <th>Estilo</th>
                                <th>Color</th>
                                <th>Articulo</th>
                                <th>Qty</th>
                                <th>OC Textil</th>
                            </tr>
                        </thead>
                        <tbody>:trs</tbody>
                       </table>`;

        const body = aRows.join('');
        const table = `${tableHTML.replace(':trs', body)}`;
        return table;

    }

    function loadGrid(respuestaJSONtext) {
        const arr = respuestaJSONtext.trim().length > 0 ? JSON.parse(respuestaJSONtext) : [];
        if (arr.length > 0) {
            _Promise(100)
                .then(() => {
                    _('divContenedorAprobacion').innerHTML = plantillaHTML(arr);
                })
                .then(() => { DataTablesConfiguration() })
                //.then(() => { DatePicker() }) //:fecha se retira
        }
    }

    function grabarAprobacion() {
        const arr = Array.from(document.getElementById('tblAprobacion').tBodies[0].rows);
        const celdaOCTextil = 9;
        const data = arr.filter(x => x.cells[celdaOCTextil].querySelector('._octextil').value.length > 0)
                        .map(y => `${y.getAttribute('data-parJSON')};OCTextil:${y.cells[celdaOCTextil].querySelector('._octextil').value}`)
                        .map(x => (toObject(x)));        

        const form = new FormData();
        const parFabrica = getParameter('p');
        form.append('parJson', JSON.stringify(data));
        form.append('parFabrica', parFabrica);

        const accion = 'GrabarAprobacionOCxFabrica';
        const url = `${appAprobacion.controller}/${accion}`;
        _Post({ url: url, form: form}, true)
            .then((respuesta) => {
                let orespuesta = JSON.parse(respuesta);
                let estado = orespuesta.estado === "success";
                swal({ title: orespuesta.mensaje, text: '', type: orespuesta.estado }, function () {
                    if (estado) loadGrid(orespuesta.data);
                })
            });
    }

    function load() {
        d.getElementById('btnSave').addEventListener("click", grabarAprobacion);
    }

    return {
        ini: ini,
        load:load
    }

})(document,window);

oAprobacion.ini();
oAprobacion.load();
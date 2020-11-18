var ovariables = {
    arrfabrica: [],
    arcliente: [],
    arrpartidas: []
}

function load() {

    $('#divfechadesde .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#divfechahasta .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    fn_getDate();

    _('btnexport').addEventListener('click', fn_filtrar_reporte);

    $('#cbofabrica').on('change', req_get);
    $('#cbocliente').on('change', req_get);
    $('#cbostatusfinal').on('change', req_get);
    $('#cbotipoprueba').on('change', req_get);
    $('#txtfechadesde').on('change', req_get);
    $('#txtfechahasta').on('change', req_get);
   
}

function event_search(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        req_get();
    }
}


function fn_getDate() {
    let odate = new Date();
    let mes = odate.getMonth() + 1;
    let day = odate.getDate();
    let anio = odate.getFullYear();
    if (day < 10) { day = '0' + day }
    if (mes < 10) { mes = '0' + mes }
    let desde = `${mes}/01/${(anio)}`;
    _('txtfechadesde').value = desde;
    let hasta = `${mes}/${day}/${anio}`;
    _('txtfechahasta').value = hasta;
}

function fn_getparameter(_id) {
    if (_('txtfechadesde').value == '' || _('txtfechahasta').value == '') { fn_getDate(); }
    let fabrica = _('cbofabrica').value, cliente = _('cbocliente').value,
        fechadesde = _convertDate_ANSI(_('txtfechadesde').value), fechahasta = _convertDate_ANSI(_('txtfechahasta').value),
        statusfinal = _('cbostatusfinal').value, tipoprueba = _('cbotipoprueba').value,
        reportetecnico = _('txtreportetecnico').value, numeropartida = _('txtnumpartida').value;
    let par='';
    if (_id == 1) { par = JSON.stringify({ fabrica: fabrica, cliente: cliente, fechadesde: fechadesde, fechahasta: fechahasta, statusfinal: statusfinal, tipoprueba: tipoprueba, reportetecnico: reportetecnico, numeropartida: numeropartida }); }
    else { par = `fabrica:${fabrica},cliente:${cliente},fechadesde:${fechadesde},fechahasta:${fechahasta},statusfinal:${statusfinal},tipoprueba:${tipoprueba},reportetecnico:${reportetecnico},numeropartida:${numeropartida}`; }
    return par;
}

function fn_filtrar_reporte() {
    let _parametro = fn_getparameter(2);

    _modalBody({
        url: 'Laboratorio/Partida/FiltrarReporte',
        ventana: 'FiltrarReporte',
        titulo: 'Filtrar Reporte',
        parametro: `${_parametro}`,
        alto: '',
        ancho: '300px',
        responsive: 'modal-lg'
    });
}

function req_ini() {
    let urlaccion = `Laboratorio/Partida/Laboratorio_Reporte_List_Master`;
    Get(urlaccion,res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : '';
    if (orpta != '') {
        if (orpta[0].fabrica != '') { ovariables.arrfabrica = orpta[0].fabrica; }
        if (orpta[0].cliente != '') { ovariables.arrcliente = orpta[0].cliente; }
        fn_load_fabrica();
        fn_load_cliente();
        fn_load_status();
        fn_load_test();
        req_get();
    }
}

function fn_load_fabrica() {
    let arrfabrica = JSON.parse(ovariables.arrfabrica);
    let cbofabricahtml = `<option value='0'>All Factory</option>`;
    if (arrfabrica.length > 0) {
        arrfabrica.forEach(x=> { cbofabricahtml += `<option value='${x.codigofabrica}'>${x.nombrefabrica}</option>`; });
    }
    _('cbofabrica').innerHTML = cbofabricahtml;
    $('#cbofabrica').select2();
}

function fn_load_cliente() {
    let arrcliente = JSON.parse(ovariables.arrcliente);
    let cboclientehtml = `<option value='0'>All Client</option>`;
    if (arrcliente.length > 0) {
        arrcliente.forEach(x=> { cboclientehtml += `<option value='${x.codigocliente}'}>${x.nombrecliente}</option>`;});
    }
    _('cbocliente').innerHTML = cboclientehtml;
    $('#cbocliente').select2();
}

function fn_load_status() {
    let cbostatushtml = `<option value=0>All Status</option>
        <option value='Sent'>Sent</option>
        <option value='Received'>Received</option>
        <option value='Approved'>Approved</option>
        <option value='Approved with Comments'>Approved with Comments</option>
        <option value='Rejected'>Rejected</option>
        <option value='Pending'>Pending</option>
        `;
    _('cbostatusfinal').innerHTML = cbostatushtml;
    $('#cbostatusfinal').select2();
}

function fn_load_test() {
    let cbostatushtml = `<option value=0>All Test</option>
        <option value='d'>Fabric - Development</option>
        <option value='pp'>Fabric - First Batch Production</option>
        <option value='f'>Fabric - Full Test</option>
        <option value='p'>Fabric - Production</option>
        <option value='m'>Fabric - Sale Sample</option>
        <option value='a'>Fabric -Test Additional</option>
        <option value='gi'>Garment - Care Instruction</option>
        <option value='gf'>Garment - Full</option>
        <option value='gp'>Garment - Production</option>`;
    _('cbotipoprueba').innerHTML = cbostatushtml;
    $('#cbotipoprueba').select2();
}

function req_get() {
    let par = fn_getparameter(1);
    let urlaccion = 'Laboratorio/Partida/Laboratorio_Reporte_Get?par=' + par;
    Get(urlaccion, res_get);
}

function res_get(response) {
    let orpta = !_isEmpty(response) ? JSON.parse(response) : '';
    if (orpta !== '') {
        if (orpta[0].partidas != '') { ovariables.arrpartidas = orpta[0].partidas } else { ovariables.arrpartidas = [] }
        req_load_partidas();
    }
}

function req_load_partidas() {
    let arrpartidas = ovariables.arrpartidas.length > 0 ? JSON.parse(ovariables.arrpartidas) : [];
    let result = arrpartidas;
    if (result.length > 0) {
        _('datos').classList.add('hide');
        fn_load_partidas(result);
    }
    else {
        _('datos').classList.remove('hide');
        let divtabla = _('tablecontentpartidas'), tabla = divtabla.children[0];
        if (tabla != undefined) { divtabla.children[0].remove(divtabla); }
    }
}

function fn_load_partidas(_result) {
    let resultadolabdip = _result, html = '', htmlbody = '';

    html = ` <table id='tblpartidas' class='stripe row-border order-column theada' style='width: 100%; max-width: 100%;  padding-right: 0px;'>
         <thead>
            <tr>
                <th class ='text-center'>Status</th>
                <th class ='text-center'>Reporte Tecnico</th>
                <th class ='text-center'>Numero Partida</th>
                <th class ='text-center'>Fabrica</th>
                <th class ='text-center'>Cliente</th>
                <th class ='text-center'>Color</th>
                <th class ='text-center'>Tela</th>
                <th class ='text-center'>Prueba</th>
                <th class ='text-center'>Fecha Ingreso</th>
                <th class ='text-center'>Fecha Recibido</th>
                <th class ='text-center'>Fecha Entrega</th>
                <th class ='text-center'>Status Lab</th>
                <th class ='text-center'>Status Tono</th>
            </tr>
         </thead>
         <tbody>
        `;
        
    resultadolabdip.forEach(x=> {
        let status_final = ``;
        if (x.status_final == 'Approved') {
            status_final = `<button type='button' title='Approved' class ='btn btn-outline btn-primary'>
                                <span class ='fa fa-check'></span>
                            </button>`;
        }
        else if (x.status_final == 'Approved with Comments') {
            status_final = `<button type='button' title='Approved with Comments' class ='btn btn-outline btn-primary'>
                                <span class ='fa fa-check-square'></span>
                            </button>`;
        }
        else if (x.status_final == 'Rejected') {
            status_final = `<button type='button' title='Rejected' class ='btn btn-outline btn-danger'>
                                <span class ='fa fa-ban'></span>
                            </button>`;
        }
        else if (x.status_final == 'Pending') {
            status_final = `<button type='button' title='Pending' class ='btn btn-outline btn-warning'>
                                <span class ='fa fa-exclamation-circle'></span>
                            </button>`;
        }
        else if (x.status_final == 'Received') {
            status_final = `<button type='button' title='Received' class ='btn btn-outline btnrecibido'>
                                <span class ='fa fa-floppy-o'></span>
                            </button>`;
        }
        else if (x.status_final == 'Sent') {
            status_final = `<button type='button' title='Sent' class ='btn btn-outline btn-success'>
                                <span class ='fa fa-share'></span>
                            </button>`;
        }

        htmlbody += `
                <tr>
                    <td class ='text-center'>${status_final}</td>
                    <td class ='text-center'>${x.reporte_tecnico}</td>
                    <td class ='text-center'>${x.numero_partida}</td>
                    <td class ='text-center'>${x.fabrica}</td>
                    <td class ='text-center'>${x.cliente}</td>
                    <td class ='text-center'>${x.color}</td>
                    <td class ='text-center'>${x.codigo_tela}</td>
                    <td class ='text-center'>${x.tipo_prueba}</td>
                    <td class ='text-center'>${x.fecha_ingreso}</td>
                    <td class ='text-center'>${x.fecha_recibido}</td>
                    <td class ='text-center'>${x.fecha_entrega}</td>
                    <td class ='text-center'>${x.status_lab}</td>
                    <td class ='text-center'>${x.status_tono}</td>
                </tr>
                `;
    });
    

    html += htmlbody + '</tbody></table>';
    _('tablecontentpartidas').innerHTML = html;
    format_table();
}

function format_table() {
    $('#tblpartidas').DataTable({
        scrollY: "500px",
        scrollX: true,
        scrollCollapse: true,
        searching: false,
        ordering: false,
        info: false,
        "pageLength": 50
    });
}

(function ini() {
    load();
    req_ini();
})()
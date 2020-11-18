
var ovariables_guiacourier = {
    arrcourier: '',
    arrtipocourier: '',
    arrtipo: '',
    arrcliente: '',
    arrproveedor: '',
    arrotros: '',
    arrreponsable: '',
    arrasume: '',
    arrguiacourier: '',
}

function load() {
    $(".select2_courier").select2({
        placeholder: "Select Courier",
        allowClear: false
    });
    $(".select2_tipoenvio").select2({
        placeholder: "Select type Send",
        allowClear: false
    });
    $(".select2_tipo").select2({
        placeholder: "Select Tipo",
        allowClear: false
    });
    $(".select2_nombre").select2({
        placeholder: "Select Name",
        allowClear: false
    });
    $(".select2_responsable").select2({
        placeholder: "Select Responsible",
        allowClear: false
    });


    $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    ////$('#divfechahasta .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    fn_getDate();


    $('#cbotipo').on('change', load_nombre);
    _('btnnew').addEventListener('click', req_new);
    _('btnedit').addEventListener('click', req_edit);
    _('btnview').addEventListener('click', req_review);
}


function fn_getDate() {
    let odate = new Date();
    let mes = odate.getMonth() + 1;
    let day = odate.getDate();
    let anio = odate.getFullYear();
    if (day < 10) { day = '0' + day }
    if (mes < 10) { mes = '0' + mes }
    let desde = `01/01/${(anio - 1)}`;
    _('txtfechadesde').value = desde;
    let hasta = `${mes}/${day}/${anio}`;
    _('txtfechahasta').value = hasta;
}

function event_search(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        req_load_guia();
    }
}

function formatTable() {
    $('#tblpersonal').DataTable({
        scrollY: "455px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        searching: false,
        info: false,
        "pageLength": 50
    });
}

function req_load_guia() {
    let arrguiacourier = ovariables_guiacourier.arrguiacourier;
    let guia = _('txtnumeroguia').value, fechadesde = _('txtfechadesde').value, fechahasta = _('txtfechahasta').value;
    let idcourier = _('cbocourier').value, idtipoenvio = _('cbotipoenvio').value, idtipo = _('cbotipo').value,
        idtipodato = _('cbonombre').value, idresponsable = _('cboresponsable').value;

    let resultadoxcombos = arrguiacourier.filter(x =>
        (idcourier === '0' || x.IdCourier.toString() === idcourier) &&
        (idtipoenvio === '0' || x.IdTipoEnvio.toString() === idtipoenvio) &&
        (idtipo === '0' || x.IdTipo.toString() === idtipo) &&
        (idtipodato === '0' || x.IdTipoDato.toString() === idtipodato) &&
        (idresponsable === '0' || x.IdResponsable.toString() === idresponsable) &&
        (Date.parse(x.FechaEnvioEntrega) >= Date.parse(fechadesde) && Date.parse(x.FechaEnvioEntrega) <= Date.parse(fechahasta)) &&
        (x.NumeroGuia.indexOf(guia) > -1 || x.NumeroGuia.toLowerCase().indexOf(guia) > -1)
    );
    fn_load_guia(resultadoxcombos);
}

function fn_load_guia(_resultado) {
    let resultadoguiacourier = _resultado, html = '', htmlbody = '';

    html = `
        <table id="tblpersonal" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
            <thead>
                <tr>
                    <th>Courier</th>
                    <th>Guide</th>
                    <th>Type Send</th>
                    <th>Responsible</th>
                    <th>Date Send</th>
                    <th>Invoice</th>
                </tr>
            </thead>
            <tbody>
        `;

    if (resultadoguiacourier.length > 0) {
        resultadoguiacourier.forEach(x => {
            htmlbody += `
            <tr>
                <td>${x.NombreCourier}</td>
                <td>${x.NumeroGuia}</td>
                <td>${x.TipoEnvio}</td>
                <td>${x.Reponsable}</td>
                <td>${x.FechaEnvioEntrega}</td>
                <td>${x.Factura}</td>
            </tr>
            `;
        });
    }

    html += htmlbody + '</tbody></table>';

    _('tablaguiacourier').innerHTML = html;
    formatTable();
}

function req_search() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_Get';
    Get(urlaccion, res_search);
}

function res_search(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_guiacourier.arrguiacourier = JSON.parse(orpta[0]); }
        req_load_guia();
    }
}

function req_new() {
    let urlaccion = 'Administration/GuiaCourier/New',
        urljs = 'Administration/GuiaCourier/New';
    _Go_Url(urlaccion, urljs);
}

function req_edit() {
    let urlaccion = 'Administration/GuiaCourier/Edit',
        urljs = 'Administration/GuiaCourier/Edit';
    _Go_Url(urlaccion, urljs);
}

function req_review() {
    let urlaccion = 'Administration/GuiaCourier/Review',
        urljs = 'Administration/GuiaCourier/Review';
    _Go_Url(urlaccion, urljs);
}

function req_assign() {
    let urlaccion = 'Administration/GuiaCourier/Assign',
        urljs = 'Administration/GuiaCourier/Assign';
    _Go_Url(urlaccion, urljs);
    removejscssfile("Index", "js");
}

function req_assign() {
    let urlaccion = 'Administration/GuiaCourier/Assign',
        urljs = 'Administration/GuiaCourier/Assign';
    _Go_Url(urlaccion, urljs);
    removejscssfile("Index", "js");
}

function req_ini() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_List';
    Get(urlaccion, res_ini);
    req_Habilitado();
}

// Verificar si el usuario cuenta con la opcion "Asignar Sub Responsables" habilitado
function req_Habilitado() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_ObtenerPorId';
    Get(urlaccion, res_Habilitado);
}

function res_Habilitado(respuesta) {
    if (respuesta != 0) {
        let boton = '<button id="btnassign" type="button" title="Assign" class="btn btn-outline btn-warning"> <span class="fa fa-user"></span> </button>';
        _('divBotonesSecundarios').innerHTML = _('divBotonesSecundarios').innerHTML + boton;
        _('btnassign').addEventListener('click', req_assign);
    } else {
        console.log("Este usuario no tiene la opcion 'Asignar Sub Responsable' activada!");
    }
}

function fn_insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Verificar si el usuario cuenta con la opcion "Asignar Sub Responsables" habilitado
function req_Habilitado() {
    let urlaccion = 'Administration/GuiaCourier/GuiaCourier_ObtenerPorId';
    Get(urlaccion, res_Habilitado);
}

function res_Habilitado(respuesta) {
    if (respuesta != 0) {
        let boton = '<button id="btnassign" type="button" title="Assign" class="btn btn-outline btn-warning"> <span class="fa fa-user"></span> </button>';
        _('divBotonesSecundarios').innerHTML = _('divBotonesSecundarios').innerHTML + boton;
        _('btnassign').addEventListener('click', req_assign);
    } else {
        console.log("Este usuario no tiene la opcion 'Asignar Sub Responsable' activada!");
    }
}

function fn_insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_guiacourier.arrcourier = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables_guiacourier.arrtipocourier = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_guiacourier.arrtipo = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables_guiacourier.arrcliente = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables_guiacourier.arrproveedor = JSON.parse(orpta[4]); }
        if (JSON.parse(orpta[5] != '')) { ovariables_guiacourier.arrotros = JSON.parse(orpta[5]); }
        if (JSON.parse(orpta[6] != '')) { ovariables_guiacourier.arrreponsable = JSON.parse(orpta[6]); }
        if (JSON.parse(orpta[7] != '')) { ovariables_guiacourier.arrasume = JSON.parse(orpta[7]); }

        load_courier();
        load_tipoenvio();
        load_tipo();
        load_nombre();
        load_responsable();

    }
}

function load_courier() {
    let arrcourier = ovariables_guiacourier.arrcourier;
    let cbocourier = `<option value='0'>-- All Courier --</option>`;

    if (arrcourier.length > 0) {
        arrcourier.forEach(x => { cbocourier += `<option value ='${x.IdCourier}'>${x.NombreCourier}</option>`; });
    }
    _('cbocourier').innerHTML = cbocourier;
    $("#cbocourier").select2("val", "0");
}

function load_tipoenvio() {
    let arrtipoenvio = ovariables_guiacourier.arrtipocourier;
    let cbotipoenvio = `<option value='0'>-- All Type Send --</option>`;

    if (arrtipoenvio.length > 0) {
        arrtipoenvio.forEach(x => { cbotipoenvio += `<option value ='${x.IdTipoEnvio}'>${x.NombreEnvio}</option>`; });
    }
    _('cbotipoenvio').innerHTML = cbotipoenvio;
    $("#cbotipoenvio").select2("val", "0");
}

function load_tipo() {
    let arrtipo = ovariables_guiacourier.arrtipo;
    let cbotipo = `<option value='0'>-- All Type --</option>`;

    if (arrtipo.length > 0) {
        arrtipo.forEach(x => { cbotipo += `<option value ='${x.IdTipo}'>${x.Nombre}</option>`; });
    }
    _('cbotipo').innerHTML = cbotipo;
    $("#cbotipo").select2("val", "0");
}

function load_nombre() {
    let tipo = _('cbotipo').value;
    let cbonombre = `<option value='0'>-- All Name --</option>`;
    let arrnombre = '';

    if (tipo != '0') {
        if (tipo == '1') {
            arrnombre = ovariables_guiacourier.arrproveedor;
        }
        else if (tipo == '2') {
            arrnombre = ovariables_guiacourier.arrcliente;
        }
        else if (tipo == '3') {
            arrnombre = ovariables_guiacourier.arrotros;
        }

        if (arrnombre.length > 0) {
            arrnombre.forEach(x => { cbonombre += `<option value ='${x.IdTipoDato}'>${x.Descripcion}</option>`; });
        }
    }

    _('cbonombre').innerHTML = cbonombre;
    $("#cbonombre").select2("val", "0");
}

function load_responsable() {
    let arrreponsable = ovariables_guiacourier.arrreponsable;
    let cboresponsable = `<option value='0'>-- All Responsible --</option>`;

    if (arrreponsable.length > 0) {
        arrreponsable.forEach(x => { cboresponsable += `<option value ='${x.IdResponsable}'>${x.NombrePersonal}</option>`; });
    }
    _('cboresponsable').innerHTML = cboresponsable;
    $("#cboresponsable").select2("val", "0");
}

(function ini() {
    load();
    req_ini();
})()
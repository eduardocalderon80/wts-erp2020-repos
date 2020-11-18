//Luis
/// <reference path="../../Home/Util.js" />

var map1;
var oruta = { path: '' };
var startCount, startRefresh;
var latUser, lonUser, chofer;
var strRutas, strUser, strUserTextil;
var strOficina = '[{"Latitud":"-12.130514","Longitud":"-76.983499","NombreChofer":"Not Assigned","Ruta":"RUTA A","Estatus":"On Hold"}]' +
    '¬[{"Latitud":"-12.130514","Longitud":"-76.983499","NombreChofer":"Not Assigned","Ruta":"RUTA B","Estatus":"On Hold"}]' +
    '¬[{"Latitud":"-12.130514","Longitud":"-76.983499","NombreChofer":"Not Assigned","Ruta":"VAN","Estatus":"On Hold"}]' +
    '¬[{"Latitud":"-12.130514","Longitud":"-76.983499","NombreChofer":"Not Assigned","Ruta":"AUTO","Estatus":"On Hold"}]';

function viewMap() {

    if (verMap == "0") {
        $('#contentMap').hide();
        $('#flechaHoy').removeClass('fa fa-chevron-up').addClass('fa fa-chevron-down');
        verMap = "1";
    }
    else {
        $('#contentMap').show();
        $('#flechaHoy').removeClass('fa fa-chevron-down').addClass('fa fa-chevron-up');
        verMap = "0";
    }

}

function getValidUser() {

    //_validConexion();

    let url = "Administration/Ruta/valid_SaveUser",
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {

        let datos = sdata.split('¬');
        sdata = '';
        strUser = datos[0];
        strUserTextil = datos[1];


    });

}

function diaSemana(dia, mes, anio) {
    var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
    return dias[dt.getUTCDay()];
};

function getAllRouteControl() {

    //_validConexion();

    let hoy = new Date();
    let diaHoy = hoy.getDate();
    let MesHoy = hoy.getMonth() + 1;
    let AnioHoy = hoy.getFullYear();
    let horas = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    let cierre = "0";
    //let viernes = "0";
    let Dia = "1";
    let diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    if ((horas == 18 && minutos >= 30) || horas > 18)
        cierre = "1";

    if (diaStr == 'vie') { Dia = "3"; }
    if (diaStr == 'sab') { Dia = "2"; }
    if (diaStr == 'dom') { Dia = "1"; }


    let url = "Administration/Ruta/Load_RouteControl?Cierre=" + cierre + "&Dia=" + Dia,
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strRutas = sdata;
        sdata = '';
        getTableRoute();
        $('.footable').trigger('footable_resize');

    });
}

function getTableRoute() {

    if (strRutas == '')
        return;

    var datos = strRutas.split('¬');
    var datos1 = "";
    var datos2 = "";
    var datos3 = "";
    var datos4 = "";
    var datos5 = "";
    var datos6 = "";
    var datos7 = "";
    var datos8 = "";
    var datos9 = "";
    var choferA = "";
    var choferB = "";
    var choferVAN = "";
    var choferAUTO = "";

    if (datos[0] != '') {
        datos1 = JSON.parse(datos[0]);
        choferA = datos1[0]['NombreChofer'];
    }
    else {
        $("#btn_viewmap1").hide();
        $("#choferA").hide();
    }

    if (datos[1] != '') {
        datos2 = JSON.parse(datos[1]);
        choferB = datos2[0]['NombreChofer'];
    }
    else {
        $("#btn_viewmap2").hide();
        $("#choferB").hide();
    }

    if (datos[2] != '') {
        datos3 = JSON.parse(datos[2]);
        choferVAN = datos3[0]['NombreChofer'];
    }
    else {
        $("#btn_viewmap3").hide();
        $("#choferVAN").hide();
    }

    if (datos[3] != '') {
        datos4 = JSON.parse(datos[3]);
        choferAUTO = datos4[0]['NombreChofer'];
    }
    else {
        $("#btn_viewmap4").hide();
        $("#choferAUTO").hide();
    }

    if (datos[4] != '')
        datos5 = JSON.parse(datos[4]);
    else {
        $("#btn_viewmap5").hide();
    }

    if (datos[5] != '')
        datos6 = JSON.parse(datos[5]);
    if (datos[6] != '')
        datos7 = JSON.parse(datos[6]);
    if (datos[7] != '')
        datos8 = JSON.parse(datos[7]);
    if (datos[8] != '')
        datos9 = JSON.parse(datos[8]);
    if (datos[9] != '')
        strUser = datos[9];


    var strContentRouteA = '';
    var strContentModalRouteA = '';
    var strContentRouteB = "";
    var strContentModalRouteB = '';
    var strContentRouteC = '';
    var strContentModalRouteC = '';
    var strContentRouteD = "";
    var strContentModalRouteD = '';
    var strContentRouteE = "";
    var strContentModalRouteE = '';
    var i = 0;

    if (datos1.length != 0 && strUser == "OK")
        $("#choferA").show();

    if (datos2.length != 0 && strUser == "OK")
        $("#choferB").show();

    if (datos3.length != 0 && strUser == "OK")
        $("#choferVAN").show();

    if (datos4.length != 0 && strUser == "OK")
        $("#choferAUTO").show();

    for (i = 0; i < datos1.length; i++) {
        if (datos1[i]['esEmergencia'] == '1') {
            strContentRouteA = strContentRouteA + '<tr class="gradeX footable-even" style="display:table-row;color:indianred;">';
        }
        else {
            if (datos1[i]['IdTipoDestino'] == 1) {
                strContentRouteA = strContentRouteA + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(51, 102, 204)">';
            }
            else if (datos1[i]['IdTipoDestino'] == 2) {
                strContentRouteA = strContentRouteA + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(23, 165, 137)">';
            }
            else {
                //strContentRouteA = strContentRouteA + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(255, 153, 0)">';
            }
        }

        strContentRouteA = strContentRouteA +

            '   <td><span class="footable-toggle"></span>' + datos1[i]['Titulo'] + '</td>' +
            '   <td>' + datos1[i]['Contacto'] + '</td>' +
            '   <td>' + datos1[i]['Tipo'] + '</td>' +
            '   <td>' + datos1[i]['Hora'] + '</td>' +
            '   <td>' + datos1[i]['Envia'] + '</td>';

        if (datos1[i]['Estado'] == "Pending")
            strContentRouteA = strContentRouteA + '   <td><a href="#" class="btn btn-xs btn-outline btn-primary" data-toggle="modal" data-target="#myModa_routeA' + i + '">Pending..</a></td>';

        if (datos1[i]['Estado'] == "Delivered")
            strContentRouteA = strContentRouteA + '   <td><a href="#" class="btn btn-xs btn-outline btn-success" data-toggle="modal" data-target="#myModa_routeA' + i + '">Delivered</a></td>';

        if (datos1[i]['Estado'] == "Cancelled")
            strContentRouteA = strContentRouteA + "   <td><a href='#' class='btn btn-xs btn-outline btn-danger' data-toggle='modal' data-target='#myModa_routeA" + i + "'>Cancelled</a></td>";

        strContentRouteA = strContentRouteA +
            '</tr>';


        strContentModalRouteA = strContentModalRouteA + getModalRuta(i, datos1[i]['IdMensaje'], datos1[i]['Envia'], datos1[i]['Estado'], datos1[i]['Razon'], datos1[i]['Observacion'], datos1[i]['Contacto'], datos1[i]['Titulo'], datos1[i]['IdCliente'], datos1[i]['Tipo'], 'A', 'MOTO', datos1[i]['HoraEntrega'], datos1[i]['esEmergencia']);
    }

    for (i = 0; i < datos2.length; i++) {
        if (datos2[i]['esEmergencia'] == '1') {
            strContentRouteB = strContentRouteB + '<tr class="gradeX footable-even" style="display:table-row;color:indianred;">';
        }
        else {
            if (datos2[i]['IdTipoDestino'] == 1) {
                strContentRouteB = strContentRouteB + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(51, 102, 204)">';
            }
            else if (datos2[i]['IdTipoDestino'] == 2) {
                strContentRouteB = strContentRouteB + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(23, 165, 137)">';
            }
            else {
                //strContentRouteB = strContentRouteB + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(255, 153, 0)">';
            }
        }

        strContentRouteB = strContentRouteB +
            "   <td>" + datos2[i]['Titulo'] + "</td>" +
            "   <td>" + datos2[i]['Contacto'] + "</td>" +
            "   <td>" + datos2[i]['Tipo'] + "</td>" +
            "   <td>" + datos2[i]['Hora'] + "</td>" +
            "   <td>" + datos2[i]['Envia'] + "</td>";

        if (datos2[i]['Estado'] == "Pending")
            strContentRouteB = strContentRouteB + "   <td><a href='#' class='btn btn-xs btn-outline btn-primary' data-toggle='modal' data-target='#myModa_routeB" + i + "'>Pending..</a></td>";

        if (datos2[i]['Estado'] == "Delivered")
            strContentRouteB = strContentRouteB + "   <td><a href='#' class='btn btn-xs btn-outline btn-success' data-toggle='modal' data-target='#myModa_routeB" + i + "'>Delivered</a></td>";

        if (datos2[i]['Estado'] == "Cancelled")
            strContentRouteB = strContentRouteB + "   <td><a href='#' class='btn btn-xs btn-outline btn-danger' data-toggle='modal' data-target='#myModa_routeB" + i + "'>Cancelled</a></td>";

        strContentRouteB = strContentRouteB +
            "</tr>";

        strContentModalRouteB = strContentModalRouteB + getModalRuta(i, datos2[i]['IdMensaje'], datos2[i]['Envia'], datos2[i]['Estado'], datos2[i]['Razon'], datos2[i]['Observacion'], datos2[i]['Contacto'], datos2[i]['Titulo'], datos2[i]['IdCliente'], datos2[i]['Tipo'], 'B', 'MOTO', datos2[i]['HoraEntrega'], datos2[i]['esEmergencia']);
    }

    for (i = 0; i < datos3.length; i++) {
        if (datos3[i]['esEmergencia'] == '1') {
            strContentRouteC = strContentRouteC + '<tr class="gradeX footable-even" style="display:table-row;color:indianred;">';
        }
        else {
            if (datos3[i]['IdTipoDestino'] == 1) {
                strContentRouteC = strContentRouteC + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(51, 102, 204)">';
            }
            else if (datos3[i]['IdTipoDestino'] == 2) {
                strContentRouteC = strContentRouteC + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(23, 165, 137)">';
            }
            else {
                //strContentRouteC = strContentRouteC + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(255, 153, 0)">';
            }
        }
        strContentRouteC = strContentRouteC +
            //"<tr class='gradeX footable-even'>" +
            "   <td>" + datos3[i]['Titulo'] + "</td>" +
            "   <td>" + datos3[i]['Contacto'] + "</td>" +
            "   <td>" + datos3[i]['Tipo'] + "</td>" +
            "   <td>" + datos3[i]['Hora'] + "</td>" +
            "   <td>" + datos3[i]['Envia'] + "</td>";

        if (datos3[i]['Estado'] == "Pending")
            strContentRouteC = strContentRouteC + "   <td><a href='#' class='btn btn-xs btn-outline btn-primary' data-toggle='modal' data-target='#myModa_routeC" + i + "'>Pending..</a></td>";

        if (datos3[i]['Estado'] == "Delivered")
            strContentRouteC = strContentRouteC + "   <td><a href='#' class='btn btn-xs btn-outline btn-success' data-toggle='modal' data-target='#myModa_routeC" + i + "'>Delivered</a></td>";

        if (datos3[i]['Estado'] == "Cancelled")
            strContentRouteC = strContentRouteC + "   <td><a href='#' class='btn btn-xs btn-outline btn-danger' data-toggle='modal' data-target='#myModa_routeC" + i + "'>Cancelled</a></td>";

        strContentRouteC = strContentRouteC +
            "</tr>";

        strContentModalRouteC = strContentModalRouteC + getModalRuta(i, datos3[i]['IdMensaje'], datos3[i]['Envia'], datos3[i]['Estado'], datos3[i]['Razon'], datos3[i]['Observacion'], datos3[i]['Contacto'], datos3[i]['Titulo'], datos3[i]['IdCliente'], datos3[i]['Tipo'], 'C', 'VAN', datos3[i]['HoraEntrega'], datos3[i]['esEmergencia']);
    }

    for (i = 0; i < datos4.length; i++) {
        if (datos4[i]['esEmergencia'] == '1') {
            strContentRouteD = strContentRouteD + '<tr class="gradeX footable-even" style="display:table-row;color:indianred;">';
        }
        else {
            if (datos4[i]['IdTipoDestino'] == 1) {
                strContentRouteD = strContentRouteD + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(51, 102, 204)">';
            }
            else if (datos4[i]['IdTipoDestino'] == 2) {
                strContentRouteD = strContentRouteD + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(23, 165, 137)">';
            }
            else {
                //strContentRouteD = strContentRouteD + '<tr class="gradeX footable-even" style="display:table-row; color:rgb(255, 153, 0)">';
            }
        }
        strContentRouteD = strContentRouteD +
            //"<tr class='gradeX footable-even'>" +
            "   <td>" + datos4[i]['Titulo'] + "</td>" +
            "   <td>" + datos4[i]['Contacto'] + "</td>" +
            "   <td>" + datos4[i]['Tipo'] + "</td>" +
            "   <td>" + datos4[i]['Hora'] + "</td>" +
            "   <td>" + datos4[i]['Envia'] + "</td>";

        if (datos4[i]['Estado'] == "Pending")
            strContentRouteD = strContentRouteD + "   <td><a href='#' class='btn btn-xs btn-outline btn-primary' data-toggle='modal' data-target='#myModa_routeD" + i + "'>Pending..</a></td>";

        if (datos4[i]['Estado'] == "Delivered")
            strContentRouteD = strContentRouteD + "   <td><a href='#' class='btn btn-xs btn-outline btn-success' data-toggle='modal' data-target='#myModa_routeD" + i + "'>Delivered</a></td>";

        if (datos4[i]['Estado'] == "Cancelled")
            strContentRouteD = strContentRouteD + "   <td><a href='#' class='btn btn-xs btn-outline btn-danger' data-toggle='modal' data-target='#myModa_routeD" + i + "'>Cancelled</a></td>";

        strContentRouteD = strContentRouteD +
            "</tr>";

        strContentModalRouteD = strContentModalRouteD + getModalRuta(i, datos4[i]['IdMensaje'], datos4[i]['Envia'], datos4[i]['Estado'], datos4[i]['Razon'], datos4[i]['Observacion'], datos4[i]['Contacto'], datos4[i]['Titulo'], datos4[i]['IdCliente'], datos4[i]['Tipo'], 'D', 'AUTO', datos4[i]['HoraEntrega'], datos4[i]['esEmergencia']);
    }

    for (i = 0; i < datos5.length; i++) {
        strContentRouteE = strContentRouteE +
            "<tr class='gradeX footable-even'>" +
            "   <td>" + datos5[i]['Titulo'] + "</td>" +
            "   <td>" + datos5[i]['Contacto'] + "</td>" +
            "   <td>" + datos5[i]['Tipo'] + "</td>" +
            "   <td>" + datos5[i]['Hora'] + "</td>" +
            "   <td>" + datos5[i]['Envia'] + "</td>" +
            "   <td>" + datos5[i]['Aprueba'] + "</td>";


        if (datos5[i]['Programacion'] == "By Attending" && datos5[i]['Estado'] == "Pending")
            strContentRouteE = strContentRouteE + "   <td><a href='#' class='btn btn-xs btn-outline btn-primary' data-toggle='modal' data-target='#myModa_routeE" + i + "'>By Attending</a></td>";

        if (datos5[i]['Programacion'] == "Programmed" && datos5[i]['Estado'] == "Pending")
            strContentRouteE = strContentRouteE + "   <td><a href='#' class='btn btn-xs btn-outline btn-primary' data-toggle='modal' data-target='#myModa_routeE" + i + "'>Programmed</a></td>";

        if (datos5[i]['Programacion'] == "Cancelled" && datos5[i]['Estado'] == "Cancelled")
            strContentRouteE = strContentRouteE + "   <td><a href='#' class='btn btn-xs btn-outline btn-danger' data-toggle='modal' data-target='#myModa_routeE" + i + "'>Cancelled</a></td>";

        if (datos5[i]['Estado'] == "Delivered")
            strContentRouteE = strContentRouteE + "   <td><a href='#' class='btn btn-xs btn-outline btn-success' data-toggle='modal' data-target='#myModa_routeE" + i + "'>Delivered</a></td>";

        strContentRouteE = strContentRouteE +
            "</tr>";

        strContentModalRouteE = strContentModalRouteE + getModalRuta(i, datos5[i]['IdMensaje'], datos5[i]['Envia'], datos5[i]['Estado'], datos5[i]['Razon'], datos5[i]['Observacion'], datos5[i]['Contacto'], datos5[i]['Titulo'], datos5[i]['IdCliente'], datos5[i]['Tipo'], 'E', 'TAXI', datos5[i]['HoraEntrega'], datos5[i]['esEmergencia']);
    }

    document.getElementById('contentTableA').innerHTML = strContentRouteA;
    document.getElementById('modalesRouteA').innerHTML = strContentModalRouteA;
    document.getElementById('contentTableB').innerHTML = strContentRouteB;
    document.getElementById('modalesRouteB').innerHTML = strContentModalRouteB;
    document.getElementById('contentTableC').innerHTML = strContentRouteC;
    document.getElementById('modalesRouteC').innerHTML = strContentModalRouteC;
    document.getElementById('contentTableD').innerHTML = strContentRouteD;
    document.getElementById('modalesRouteD').innerHTML = strContentModalRouteD;
    document.getElementById('contentTableE').innerHTML = strContentRouteE;
    document.getElementById('modalesRouteE').innerHTML = strContentModalRouteE;
    document.getElementById('statusChoferA').innerHTML = getStatusChoferes('A');
    document.getElementById('statusChoferB').innerHTML = getStatusChoferes('B');
    document.getElementById('statusChoferC').innerHTML = getStatusChoferes('VAN');
    document.getElementById('statusChoferD').innerHTML = getStatusChoferes('AUTO');

    if (choferA != '') {
        $("#txtChoferA").show();
        $("#choferA").hide();
        document.getElementById('nomChoferA').innerHTML = '<b>' + choferA + '</b>';

        if (strUser == "OK") { _('spanchoferrutaa').classList.remove('hide'); }
    }

    if (choferB != '') {
        $("#txtChoferB").show();
        $("#choferB").hide();
        document.getElementById('nomChoferB').innerHTML = '<b>' + choferB + '</b>';

        if (strUser == "OK") { _('spanchoferrutab').classList.remove('hide'); }
    }

    if (choferVAN != '') {
        $("#txtChoferVAN").show();
        $("#choferVAN").hide();
        document.getElementById('nomChoferVAN').innerHTML = '<b>' + choferVAN + '</b>';

        if (strUser == "OK") { _('spanchofervan').classList.remove('hide'); }
    }

    if (choferAUTO != '') {
        $("#txtChoferAUTO").show();
        $("#choferAUTO").hide();
        document.getElementById('nomChoferAUTO').innerHTML = '<b>' + choferAUTO + '</b>';

        if (strUser == "OK") { _('spanchoferauto').classList.remove('hide'); }
    }

    getMaps();
}

function getModalRuta(count, idmensaje, sender, status, reason, observation, contact, provider, client, type, route, mobility, hora_entrega, esEmergencia) {

    var strModalWindow = '';
    var strResult = '';


    strModalWindow =
        '<div class="modal inmodal" id="myModa_route' + route + count + '" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content animated flipInY">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';

    if (esEmergencia == '0') {
        strModalWindow = strModalWindow +
            '<h4 class="modal-title">Shipping Details</h4>';
    }
    else {
        strModalWindow = strModalWindow +
            '<h4 class="modal-title">Shipping Details Emergency</h4>';
    }

    strModalWindow = strModalWindow +
        '</div>' +
        '<div class="modal-body">' +
        '<table class="table ">' +
        '<tbody>' +
        '<tr>' +
        '<td class="desc">' +
        '<h3>' +
        '<span class="text-navy">' +
        '<b>Send by :</b>&nbsp;' + sender +
        '</span>';
    if (status == "Pending")
        strModalWindow = strModalWindow + '    <span class="label label-primary" style="float:right;vertical-align:middle">' + status + '</span>';

    if (status == "Delivered")
        strModalWindow = strModalWindow + '    <span class="label label-success" style="float:right;vertical-align:middle">' + status + '</span>';


    if (status == "Cancelled")
        strModalWindow = strModalWindow + '    <span class="label label-danger" style="float:right;vertical-align:middle">' + status + '</span>';

    strModalWindow = strModalWindow + '   </h3>' +
        '<dl class="small">' +
        '<dt>Reason</dt>' +
        '<dd>' + reason +
        '</dd>' +
        '</dl>' +
        '<dl class="small">' +
        '<dt>Observations</dt>' +
        '<dd>' + observation +
        '</dd>' +
        '</dl>';
    if (status == "Delivered")
        strModalWindow = strModalWindow + ' <span class="text-success" style="float:right;vertical-align:middle;font-size:20px;"><b>Delivered ' + hora_entrega + '</b></span>';


    strModalWindow = strModalWindow + '     <dl class="small m-b-none">' +
        '<dd><b>Contact:&nbsp;</b> ' + contact + '</dd>' +
        '<dd><b>Provider:&nbsp;</b>' + provider + '</dd>' +
        '<dd><b>Client:&nbsp;</b>' + client + '</dd>' +
        '<dd><b>Type:&nbsp;</b>' + type + '</dd>' +
        '<dd><b>Type Mobility:&nbsp;</b>' + mobility + '</dd>' +
        '<dd></dd>' +
        '</dl>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<div id="reasonCancel' + route + count + '" style="display:none"><b>Reason Cancel:&nbsp;</b><textarea id="txtReasonCancel' + route + count + '" cols="12" rows="5" style="width:100%"></textarea></div>' +
        '</div>';

    if (strUser != "OK") {

        strModalWindow = strModalWindow + ' <div class="modal-footer">' +
            '<button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


    }
    else {

        if (status == "Pending" && mobility != "TAXI" && esEmergencia == '0') {
            strModalWindow = strModalWindow + ' <div class="modal-footer">';

            if (mobility == "MOTO" && route == "A")
                strModalWindow = strModalWindow + '<div class="input-group"><select id="cboMoveTo' + route + count + '" class="form-control" style="width:150px;"><option value="2">Route B</option><option value="3">VAN</option><option value="4">AUTO</option><option value="5">TAXI</option></select><span class="input-group-append"><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\',\'' + count + '\')">Move!</button></span></div>';//<button id="btnMoveMotoB" type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\')" >Move Route B</button>';

            if (mobility == "MOTO" && route == "B")
                strModalWindow = strModalWindow + '<div class="input-group"><select id="cboMoveTo' + route + count + '" class="form-control" style="width:150px;"><option value="1">Route A</option><option value="3">VAN</option><option value="4">AUTO</option></option><option value="5">TAXI</option></select><span class="input-group-append"><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\',\'' + count + '\')">Move!</button></span></div>'; // + '<button id="btnMoveMotoA" type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\')" >Move Route A</button>';

            if (mobility == "VAN")
                strModalWindow = strModalWindow + '<div class="input-group"><select id="cboMoveTo' + route + count + '" class="form-control" style="width:150px;"><option value="1">Route A</option><option value="2">Route B</option><option value="4">AUTO</option></option><option value="5">TAXI</option></select><span class="input-group-append"><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\',\'' + count + '\')">Move!</button></span></div>'; //+ '<button id="btnMoveAuto" type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\')" >Move Auto</button>';

            if (mobility == "AUTO")
                strModalWindow = strModalWindow + '<div class="input-group"><select id="cboMoveTo' + route + count + '" class="form-control" style="width:150px;"><option value="1">Route A</option><option value="2">Route B</option><option value="3">VAN</option></option><option value="5">TAXI</option></select><span class="input-group-append"><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\',\'' + count + '\')">Move!</button></span></div>';  //+ '<button id="btnMoveVan" type="button" class="btn btn-primary" data-dismiss="modal" onclick="moveMobility(\'' + idmensaje + '\',\'' + route + '\')" >Move VAN</button>';

            strModalWindow = strModalWindow + '<button id="btnCancelModal' + route + count + '" type="button" class="btn btn-success"  onclick="changeStatus(\'' + route + count + '\')">Cancel</button>' +
                '<button id="btnSaveModal' + route + count + '" type="button" class="btn btn-success" data-dismiss="modal" onclick="saveStatus(\'' + idmensaje + '\',\'' + route + count + '\',\'' + esEmergencia + '\')" style="display:none">Save</button>' +
                '<button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        else if (status == "Pending" && mobility == "TAXI") {
            strModalWindow = strModalWindow + ' <div class="modal-footer">' +
                '<button id="btnCancelModal' + route + count + '" type="button" class="btn btn-success"  onclick="changeStatus(\'' + route + count + '\')">Cancel</button>' +
                '<button id="btnSaveModal' + route + count + '" type="button" class="btn btn-success" data-dismiss="modal" onclick="saveStatus(\'' + idmensaje + '\',\'' + route + count + '\',\'' + esEmergencia + '\')" style="display:none">Save</button>' +
                '<button id="btnDelivered' + route + count + '" type="button" class="btn btn-primary" data-dismiss="modal" onclick="saveDelivered(\'' + idmensaje + '\',\'' + route + count + '\')" >Delivered</button>' +
                '<button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        else {
            strModalWindow = strModalWindow + ' <div class="modal-footer">' +
                '<button type="button" class="btn btn-warning" data-dismiss="modal">Close</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }


    return strModalWindow;
}

function validaFechaCierre() {
    let hoy = new Date();
    let diaHoy = hoy.getDate();
    let MesHoy = hoy.getMonth() + 1;
    let AnioHoy = hoy.getFullYear();
    let horas = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    let fechadia = strFechaFormato(diaHoy, MesHoy, AnioHoy);
    let diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    if ((horas == 18 && minutos >= 30) || horas > 18) {

        fechadia = strFechaFormato(diaHoy + 1, MesHoy, AnioHoy);

        if (diaStr == 'vie')
            fechadia = strFechaFormato(diaHoy + 3, MesHoy, AnioHoy);

        if (diaStr == 'sab')
            fechadia = strFechaFormato(diaHoy + 2, MesHoy, AnioHoy);

        if (diaStr == 'dom')
            fechadia = strFechaFormato(diaHoy + 1, MesHoy, AnioHoy);
    }

    return fechadia;
}

function moveMobility(_Id, _TipoMobility, count) {

    //_validConexion();

    let dateToday = validaFechaCierre();
    let tipoMobility = $("#cboMoveTo" + _TipoMobility + count).val();// '';

    //alert(tipoMobility);

    //if (_TipoMobility == "A") {
    //    tipoMobility = 2;
    //}
    //else if (_TipoMobility == "B") {
    //    tipoMobility = 1;
    //}
    //else if (_TipoMobility == "C") {
    //    tipoMobility = 4;
    //}
    //else if (_TipoMobility == "D") {
    //    tipoMobility = 3;
    //}


    let url = "Administration/Ruta/move_Route?mensaje=" + _Id + "&movilidad=" + tipoMobility + "&dia=" + dateToday,
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        getAllRouteControl();
    });

}

function asignaChofer(ruta) {

    //_validConexion();

    var idChofer;
    var nomChofer;
    var dia = "";

    let hoy = new Date();
    let horas = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    let cierre = "0";

    if ((horas == 18 && minutos >= 30) || horas > 18)
        cierre = "1";



    if (ruta == 'Ruta A') {
        $('#choferA').hide();
        $('#txtChoferA').show();
        idChofer = $("#cboChoferA").val();
        nomChofer = $("#cboChoferA option:selected").text();
        document.getElementById('nomChoferA').innerHTML = '<b>' + nomChofer + '</b>';
        //return;
    }

    if (ruta == 'Ruta B') {
        $('#choferB').hide();
        $('#txtChoferB').show();
        idChofer = $("#cboChoferB").val();
        nomChofer = $("#cboChoferB option:selected").text();
        document.getElementById('nomChoferB').innerHTML = '<b>' + nomChofer + '</b>';
        //return;
    }

    if (ruta == 'VAN') {
        $('#choferVAN').hide();
        $('#txtChoferVAN').show();
        idChofer = $("#cboChoferVAN").val();
        nomChofer = $("#cboChoferVAN option:selected").text();
        document.getElementById('nomChoferVAN').innerHTML = '<b>' + nomChofer + '</b>';
        //return;
    }

    if (ruta == 'AUTO') {
        $('#choferAUTO').hide();
        $('#txtChoferAUTO').show();
        idChofer = $("#cboChoferAUTO").val();
        nomChofer = $("#cboChoferAUTO option:selected").text();
        document.getElementById('nomChoferAUTO').innerHTML = '<b>' + nomChofer + '</b>';
        //return;
    }

    var strValidUser = "";

    let url = "Administration/Ruta/update_Chofer?ruta=" + ruta + "&idchofer=" + idChofer + "&nombre=" + nomChofer + "&cierre=" + cierre,
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strValidUser = sdata;

    });


}

function EliminarAsignacion(ruta) {

    //_validConexion();

    var idChofer;
    var nomChofer;
    var dia = "";

    let hoy = new Date();
    let horas = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    let cierre = "0";

    if ((horas == 18 && minutos >= 30) || horas > 18)
        cierre = "1";



    if (ruta == 'Ruta A') {
        $('#choferA').show();
        $('#txtChoferA').hide();
        document.getElementById('nomChoferA').innerHTML = '';
    }

    if (ruta == 'Ruta B') {
        $('#choferB').show();
        $('#txtChoferB').hide();
        document.getElementById('nomChoferB').innerHTML = '';

    }

    if (ruta == 'VAN') {
        $('#choferVAN').show();
        $('#txtChoferVAN').hide();
        document.getElementById('nomChoferVAN').innerHTML = '';
    }

    if (ruta == 'AUTO') {
        $('#choferAUTO').show();
        $('#txtChoferAUTO').hide();
        document.getElementById('nomChoferAUTO').innerHTML = '';
    }

    var strValidUser = "";

    let url = "Administration/Ruta/EliminarAsignacion?ruta=" + ruta + "&cierre=" + cierre,

        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strValidUser = sdata;

    });


}

function strFechaFormato(dia, mes, anio) {
    var newdia = "";
    var newMes = "";

    if (dia < 10)
        newdia = "0" + dia;
    else
        newdia = dia;

    if (mes < 10)
        newMes = "0" + mes;
    else
        newMes = mes;

    var fecha = anio.toString() + newMes.toString() + newdia.toString();

    return fecha;

}

function changeStatus(e) {

    $('#btnCancelModal' + e).hide();
    $('#btnSaveModal' + e).show();
    $('#reasonCancel' + e).show();
    //return;
}

function saveDelivered(e, f, g) {

    //_validConexion();

    let motivo = "";
    let url = "Administration/Ruta/Update_StatusMensaje?idmensaje=" + e + "&estado=1&mensaje=" + motivo + "&esemergencia=" + g,
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {

    });

    getAllRouteControl();

}

function saveStatus(e, f, g) {

    //_validConexion();

    let motivo = document.getElementById("txtReasonCancel" + f).value;
    let url = "Administration/Ruta/Update_StatusMensaje?idmensaje=" + e + "&estado=2&mensaje=" + motivo + "&esemergencia=" + g,
        frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {

    });

    getAllRouteControl();

}

$(document).ready(function () {


    //***************************************************************//

    //_validConexion();

    $('.footable').footable();
    $(".Select2_ADD_B1").select2();
    $('.clockpicker').clockpicker();

    $('#txtChoferA').hide();
    $('#choferA').hide();
    $('#choferB').hide();
    $('#txtChoferB').hide();
    $('#choferVAN').hide();
    $('#txtChoferVAN').hide();
    $('#choferAUTO').hide();
    $('#txtChoferAUTO').hide();

    getValidUser();
    countdown('contador');
    getAllRouteControl();

    $('.footable').trigger('footable_resize');

    _('btn_newroute1').addEventListener('click', function () {
        clearTimeout(startCount);
        clearTimeout(startRefresh);
        //_validConexion();
        var url = 'Administration/Ruta/NewRuta';
        _Go_Url(url, url, '');
        return;
    });

    _('btn_newroute2').addEventListener('click', function () {
        clearTimeout(startCount);
        clearTimeout(startRefresh);
        //_validConexion();
        var url = 'Administration/Ruta/NewRuta';
        _Go_Url(url, url, '');
        return;
    });

    _('btn_newroute3').addEventListener('click', function () {
        clearTimeout(startCount);
        clearTimeout(startRefresh);
        //_validConexion();
        var url = 'Administration/Ruta/NewRuta';
        _Go_Url(url, url, '');
        return;
    });

    _('btn_newroute4').addEventListener('click', function () {
        clearTimeout(startCount);
        clearTimeout(startRefresh);
        //_validConexion();
        var url = 'Administration/Ruta/NewRuta';
        _Go_Url(url, url, '');
        return;
    });

    _('btn_viewmap1').addEventListener('click', function () {
        //_validConexion();
        initMap('A', 16);
        return;
    });

    _('btn_viewmap2').addEventListener('click', function () {
        //_validConexion();
        initMap('B', 16);
        return;
    });

    _('btn_viewmap3').addEventListener('click', function () {
        //_validConexion();
        initMap('VAN', 16);
        return;
    });

    _('btn_viewmap4').addEventListener('click', function () {
        //_validConexion();
        initMap('AUTO', 16);
        return;
    });

    startRefresh = setTimeout(function () {
        var url = 'Administration/Ruta/Index';
        _Getjs(url);
    }, 300000);


});

function getMaps() {

    if (viewroute == '')
        viewroute = 'A';

    if (zoom_actual == '')
        zoom_actual = 15;
    else
        zoom_actual = map1.getZoom();


    initMap(viewroute, zoom_actual);

}

function getStatusChoferes(ruta) {

    var valores = strRutas.split('¬');
    var oficina = strOficina.split('¬');

    var choferA = '';
    var choferB = '';
    var choferVAN = '';
    var choferAUTO = '';

    if (valores[5] != "")
        choferA = JSON.parse(valores[5]);
    else
        choferA = JSON.parse(oficina[0]);

    if (valores[6] != "")
        choferB = JSON.parse(valores[6]);
    else
        choferB = JSON.parse(oficina[1]);

    if (valores[7] != "")
        choferVAN = JSON.parse(valores[7]);
    else
        choferVAN = JSON.parse(oficina[2]);

    if (valores[8] != "")
        choferAUTO = JSON.parse(valores[8]);
    else
        choferAUTO = JSON.parse(oficina[3]);

    var valor = '';

    switch (ruta) {
        case 'A':
            for (var e = 0; e < choferA.length; e++) {
                if (choferA[e]['Estatus'] == 'ON HOLD') {
                    valor = valor + '<span style="float:right" class="text-warning" ><b>' + choferA[e]['Estatus'] + '</b></span>';
                }
                else {
                    valor = valor + '<span style="float:right" class="text-navy" ><b>' + choferA[e]['Estatus'] + '</b></span>';
                }
            }
            break;
        case 'B':
            for (var e = 0; e < choferB.length; e++) {
                if (choferB[e]['Estatus'] == 'ON HOLD') {
                    valor = valor + '<span style="float:right" class="text-warning" ><b>' + choferB[e]['Estatus'] + '</b></span>';
                }
                else {
                    valor = valor + '<span style="float:right" class="text-navy" ><b>' + choferB[e]['Estatus'] + '</b></span>';
                }
            }
            break;

        case 'VAN':
            for (var e = 0; e < choferVAN.length; e++) {
                if (choferVAN[e]['Estatus'] == 'ON HOLD') {
                    valor = valor + '<span style="float:right" class="text-warning" ><b>' + choferVAN[e]['Estatus'] + '</b></span>';
                }
                else
                    valor = valor + '<span style="float:right" class="text-navy" ><b>' + choferVAN[e]['Estatus'] + '</b></span>';
            }
            break;


        case 'AUTO':
            for (var e = 0; e < choferAUTO.length; e++) {
                if (choferAUTO[e]['Estatus'] == 'ON HOLD') {
                    valor = valor + '<span style="float:right" class="text-warning" ><b>' + choferAUTO[e]['Estatus'] + '</b></span>';
                }
                else
                    valor = valor + '<span style="float:right" class="text-navy" ><b>' + choferAUTO[e]['Estatus'] + '</b></span>';
            }
            break;
    }

    return valor;


}

function getChoferes(ruta) {

    var valores = strRutas.split('¬');
    var oficina = strOficina.split('¬');

    var choferA = '';
    var choferB = '';
    var choferVAN = '';
    var choferAUTO = '';

    if (valores[5] != "")
        choferA = JSON.parse(valores[5]);
    else
        choferA = JSON.parse(oficina[0]);

    if (valores[6] != "")
        choferB = JSON.parse(valores[6]);
    else
        choferB = JSON.parse(oficina[1]);

    if (valores[7] != "")
        choferVAN = JSON.parse(valores[7]);
    else
        choferVAN = JSON.parse(oficina[2]);

    if (valores[8] != "")
        choferAUTO = JSON.parse(valores[8]);
    else
        choferAUTO = JSON.parse(oficina[3]);

    switch (ruta) {
        case 'A':
            var asignado = $("#nomChoferA").text();
            chofer = "Not Assigned";
            for (var e = 0; e < choferA.length; e++) {

                if (choferA[e]['Latitud'] != "")
                    latUser = parseFloat(choferA[e]['Latitud']);
                else
                    latUser = parseFloat('-12.130514');

                if (choferA[e]['Longitud'] != "")
                    lonUser = parseFloat(choferA[e]['Longitud']);
                else
                    lonUser = parseFloat('-76.983499');

                if (asignado != "")
                    chofer = asignado;
                return;
            }
            break;
        case 'B':
            var asignado = $("#nomChoferB").text();
            chofer = "Not Assigned";
            for (var e = 0; e < choferB.length; e++) {

                if (choferB[e]['Latitud'] != "")
                    latUser = parseFloat(choferB[e]['Latitud']);
                else
                    latUser = parseFloat('-12.130514');

                if (choferB[e]['Longitud'] != "")
                    lonUser = parseFloat(choferB[e]['Longitud']);
                else
                    lonUser = parseFloat('-76.983499');

                if (asignado != "")
                    chofer = asignado;
                return;
            }
            break;

        case 'VAN':
            var asignado = $("#nomChoferVAN").text();
            chofer = "Not Assigned";
            for (var e = 0; e < choferVAN.length; e++) {
                if (choferVAN[e]['Latitud'] != "")
                    latUser = parseFloat(choferVAN[e]['Latitud']);
                else
                    latUser = parseFloat('-12.130514');

                if (choferVAN[e]['Longitud'] != "")
                    lonUser = parseFloat(choferVAN[e]['Longitud']);
                else
                    lonUser = parseFloat('-76.983499');
                if (asignado != "")
                    chofer = asignado;
                return;
            }
            break;

        case 'AUTO':
            var asignado = $("#nomChoferAUTO").text();
            chofer = "Not Assigned";
            for (var e = 0; e < choferAUTO.length; e++) {
                if (choferAUTO[e]['Latitud'] != "")
                    latUser = parseFloat(choferAUTO[e]['Latitud']);
                else
                    latUser = parseFloat('-12.130514');

                if (choferAUTO[e]['Longitud'] != "")
                    lonUser = parseFloat(choferAUTO[e]['Longitud']);
                else
                    lonUser = parseFloat('-76.983499');
                if (asignado != "")
                    chofer = asignado;
                return;
            }
            break;
    }

}

function initMap(ruta, zoomMap) {

    var icono;
    var movil;
    var direccion;
    var img;
    var colormarker;
    var datos = '';
    var info = [];
    var marker = [];
    var uluru;
    var contentString = '';
    var i = 0;
    var valores = strRutas.split('¬');
    viewroute = ruta;

    if (ruta == 'A') {
        if (valores[0] != "")
            datos = JSON.parse(valores[0]);

        img = 'a1.jpg';
        colormarker = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        movil = 'Ruta A';
        icono = 'moto.png';
        getChoferes(ruta);

    }

    if (ruta == 'B') {
        if (valores[1] != "")
            datos = JSON.parse(valores[1]);

        img = 'a2.jpg';
        colormarker = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
        movil = 'Ruta B';
        icono = 'moto.png';
        getChoferes(ruta);
    }

    if (ruta == 'VAN') {
        if (valores[2] != "")
            datos = JSON.parse(valores[2]);

        img = 'a7.jpg';
        colormarker = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        movil = ruta;
        icono = 'van.png';
        getChoferes(ruta)
    }

    if (ruta == 'AUTO') {
        if (valores[3] != "")
            datos = JSON.parse(valores[3]);

        img = 'a4.jpg';
        colormarker = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
        movil = ruta;
        icono = 'auto.png';
        getChoferes(ruta)
    }

    if (zoom_actual != 15)
        zoom_actual = 16;


    map1 = new google.maps.Map(document.getElementById('map1'), {
        zoom: zoomMap,
        center: { lat: parseFloat(latUser), lng: parseFloat(lonUser) }
    });

    for (var n = 0; n < datos.length; n++) {

        Latitud = parseFloat(datos[n]["Latitud"]);
        Longitud = parseFloat(datos[n]["Longitud"]);
        Tipo = datos[n]["Tipo"];
        Envia = datos[n]["Envia"];
        Contacto = datos[n]["Contacto"];
        Estado = datos[n]["Estado"];
        Titulo = datos[n]["Titulo"];
        Direccion = datos[n]["Direccion"];
        hora = datos[n]["Hora"];

        i = i + 1;


        if (Estado == "Pending") {

            contentString = '<div id="content" style="width:380px;">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<div id="bodyContent">' +
                '<div style="width:100%">&nbsp;&nbsp;&nbsp;</div>' +
                '<span style="float:left"><br><br><img src="' + urlBase() + 'Content/img/' + img + '">&nbsp;&nbsp;</span>' +
                '<span style="float:right;"><br><b>' + movil + '</b></span><br>' +
                '<div style="width:100%;color:blue"><br><br><b>' + Titulo + '</b></div>' +
                '<div style="width:100%;color:blue">' + Direccion + '</div>' +
                '<div style="width:100%"><br><b>Contact</b> : ' + Contacto + '</div>' +
                '<div style="width:100%"><b>Pickup time</b> : ' + hora + '</div>' +
                '<div style="width:100%"><b>Service    </b> : ' + Tipo + '</div>' +
                '<div style="width:100%"><b>Ship to </b> : ' + Envia + '</div>' +
                '<div style="width:100%">&nbsp;&nbsp;&nbsp;</div>' +
                '<div style="width:100%">&nbsp;&nbsp;&nbsp;</div>' +
                '</div>' +
                '</div>';

            uluru = { lat: Latitud, lng: Longitud };


            window["info" + i] = new google.maps.InfoWindow({
                content: contentString
            });


            window["marker" + i] = new google.maps.Marker({
                position: uluru,
                map: map1,
                icon: colormarker

            });

            let info = window["info" + i];
            let marker = window["marker" + i];

            marker.addListener('click', function () {
                info.open(map1, marker);
            });
        }

    }

    var uluruser = { lat: parseFloat(latUser), lng: parseFloat(lonUser) };
    var markerUser = new google.maps.Marker({
        position: uluruser,
        map: map1,
        icon: urlBase() + 'Content/img/' + icono


    });

    var infoUser = new google.maps.InfoWindow({
        content: chofer
    });

    markerUser.addListener('click', function () {
        infoUser.open(map1, markerUser);
    });

    document.getElementById('routeTittle').innerHTML = ' - "Route ' + ruta + '"';
}

function isInPage(node) {
    var contador = document.getElementById('contador');
    return document.getElementById('content_header').contains(contador);
    //(node === document.body) ? false : document.body.contains(node);
}

function countdown(id) {
    var fecha = new Date();
    var hoy = new Date();
    var horas = hoy.getHours();
    var minutos = hoy.getMinutes();
    var segundos = hoy.getSeconds();
    var valorHoras;
    var valorSegundos;
    var valorMinutos;

    var horasManana = 12;
    var horasTarde = 18;
    var minutosTarde = 59;
    var segundosTarde = 59;

    var diferenciaHoras;

    var hora = horas + ":" + minutos + ":" + segundos;

    if ((horasManana - Math.floor(horas)) >= 0)
        diferenciaHoras = horasManana - Math.floor(horas);
    else
        diferenciaHoras = horasTarde - Math.floor(horas);

    var diferenciaMinutos = minutosTarde - Math.floor(minutos);
    var diferenciaSegundos = segundosTarde - Math.floor(segundos);


    if (diferenciaHoras < 10)
        valorHoras = "0" + diferenciaHoras;
    else
        valorHoras = diferenciaHoras;

    if (diferenciaMinutos < 10)
        valorMinutos = "0" + diferenciaMinutos;
    else
        valorMinutos = diferenciaMinutos;

    if (diferenciaSegundos < 10)
        valorSegundos = "0" + diferenciaSegundos;
    else
        valorSegundos = diferenciaSegundos;

    if (diferenciaHoras < 0) {
        document.getElementById(id).innerHTML = "Time is Over";
        clearTimeout(startCount);
    }
    else {
        var x = isInPage(id);
        if (x == true) {
            document.getElementById(id).innerHTML = valorHoras + "h :" + valorMinutos + "m :" + valorSegundos;
            startCount = setTimeout("countdown(\"" + id + "\")", 1000);
        }
        else
            clearTimeout(startCount);

    }


}




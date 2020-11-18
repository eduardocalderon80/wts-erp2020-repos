/// <reference path="../../Home/Util.js" />
/// <reference path="../../Home/Graph.js" />

var strUserValid = '';
var strJsonEmergency = '';


$(document).ready(function () {

    //_validConexion();
    
    $('#formulario').hide();
    _('btn_newroute').addEventListener('click', function () {
       
        $('#formulario').show();
        $('#btn_newroute').hide();
        return;
    });
   
    //***********************Objetos Form****************************//

    $('#txtDestino').hide();

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $('.clockpicker').clockpicker({ autoclose: true });

    $(".select2_Destination").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".select2_Client").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".select2_Shipto").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".select2_TypeMobility").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".select2_TypeService").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $('#chkOthers').on('ifChanged', function (e) {

        if (e.target.checked == true) {
            $('#txtDestino').show();
            $('#selectDestino').hide();
        }
        else {
            $('#txtDestino').hide();
            $('#selectDestino').show();
        }

    }).end();

    $('#chkTomorrow').on('ifChanged', function (e) {

        if (e.target.checked == true) 
            document.getElementById("txtHora").value = "08:30";
        else 
            document.getElementById("txtHora").value = "13:30";            
        
    }).end();

    
    $('#selectMobilidad').on('change', function () {
        var data = $(this).find("option:selected").val();
        if (data == "1" || data == "2") {
            GetComboDestino(data);
        }
        else {
            data = "Others";
            GetComboDestino(data);
        }
    });

    //****************************************************************//

    validUser();
    GetAprueba();
    loadRutaEmergencia();
    loadCostEmergency();

    document.getElementById("fechaUpdate").innerHTML = moment().format('MM/DD/YYYY');
    
    $('.footable').footable();
    $('.footable').trigger('footable_resize');

    //:Luis
    $('#select2_TypeService').on('change', selectTipo);
    selectTipo();
});

/*** Funciones Generales ***/

function validUser() {

    //_validConexion();

    let url = "Administration/Ruta/valid_SaveUser",
    frm = new FormData();

    _Post(url,frm).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        let datos = sdata.split('¬');
        strUserValid = datos[0];
        strUserTextil = datos[1];
        if (strUserValid != "OK")
            $('#ichkSinMovil').hide();            
    });

}

function cboMovilidades(e, ruta) {

    let strCombo = '<select id="select2_TypeService' + e + '" class="select2_TypeService form-control" name="servicio" style="width:100%">';

    
    if (ruta == '1')
        strCombo = strCombo + '<option value="Ruta A" selected>Ruta A</option>';
    else
        strCombo = strCombo + '<option value="Ruta A">Ruta A</option>';


    if (ruta == '2')
        strCombo = strCombo + '<option value="Ruta B" selected>Ruta B</option>';
    else
        strCombo = strCombo + '<option value="Ruta B">Ruta B</option>';

    strCombo = strCombo + '<option value="VAN">VAN</option>' +
                     '     <option value="AUTO">AUTO</option>' +
                     '     <option value="TAXI">TAXI</option>' +
                   '</select>';

    return strCombo;
}

function aMayusculas(e) {
    e.value = e.value.toUpperCase();
}

function hideFormulario() {
    $('#formulario').hide();
    $('#btn_newroute').show();
   
    fn_Limpiar();
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

function viewDatosTrimestre(datos) {

    let valor = '[';

    let hoy = new Date();
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1;
    let yyyy = hoy.getFullYear();
    let diasDelMesActual;
    let diaInicioMes;
    let diaFinMes;
    let mesesTrimestre;
    let semanaInicioMesActual;
    let semanaFinMesActual;
    let strJson = '['

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    hoy = dd + '/' + mm + '/' + yyyy;

    mesesTrimestre = ultimosTresMesesMesActual(mm).split('-');

    if (datos != "") {
        valor = valor + createJsonMes(datos, mesesTrimestre[0], yyyy) + ',';
        valor = valor + createJsonMes(datos, mesesTrimestre[1], yyyy) + ',';
        valor = valor + createJsonMes(datos, mesesTrimestre[2], yyyy) + ']';

        createGraph(valor);
    }
}

function createJsonMes(datos, mes, anio) {

    let strDatosMes = '{"mes":"' + _nombremes(mes) + '","datos":{';
    let strFechaMes = '01/' + mes + '/' + anio;
    let diasMesSearch = diasMes(strFechaMes).split('-');
    let count = 1;
    let exito = 0
    let diaInicioMes = diasMesSearch[0] + '/' + mes + '/' + anio;
    let semana = parseInt(_semanadelano(diaInicioMes));

    let objJson = JSON.parse(datos);
    for (var e = 0; e < 5; e++) {
        for (var i = 0; i < objJson.length; i++) {
            if (objJson[i]['MES'] == mes && objJson[i]['SEMANA'] == semana.toString() && objJson[i]['ANIO'] == anio) {
                strDatosMes = strDatosMes + '"dato' + count.toString() + '":"' + objJson[i]['MONTO'] + '",';
                exito = 1
            }
        }

        if (exito == 0)
            strDatosMes = strDatosMes + '"dato' + count.toString() + '":"0.00",';
        else
            exito = 0;

        if (count < 5)
            count++;
        else
            count = 1;

        semana++;

    }

    strDatosMes = strDatosMes.substring(0, strDatosMes.length - 1) + '}}';

    return strDatosMes;
}

function ultimosTresMesesMesActual(mes) {

    let mesesTrimestre = '';
    let mes1;
    let mes2;
    let mes3;
    let mesActual = parseInt(mes)

    if (mesActual == 1) {
        mes1 = 11;
        mes2 = 12;
        mes3 = 1;
    }
    else if (mesActual == 2) {
        mes1 = 12;
        mes2 = 1;
        mes3 = 2;
    }
    else {
        mes1 = mesActual - 2;
        mes2 = mesActual - 1;
        mes3 = mesActual;
    }

    mesesTrimestre = mes1.toString() + '-' + mes2.toString() + '-' + mes3.toString();

    return mesesTrimestre;
}

function diasMes(fecha) {
    let date = new Date(fecha);
    let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let dias = '';
    dias = dias + primerDia.getDate() + '-' + ultimoDia.getDate();
    return dias;
}

//:Luis
function selectTipo() {
    var valor = $("#select2_TypeService").val();

    if (valor == "1")
        document.getElementById("txtHora").value = "08:30";
    else
        document.getElementById("txtHora").value = "13:30";
}

function fn_Limpiar() {
    $('#chkOthers').iCheck('uncheck');
    $("#selectMobilidad").select2("val", "");
    $("#cboDestino").select2("val", "");

    $("#select2_TypeService").select2("val", "1");
    _('txtInputDestino').value = "";
    _('idcliente').value = "";
    _("txtContacto").value = "";
    _("txtMotivo").value = "";
    _("txtObservacion").value = "";
    $('#chkSinMovil').iCheck('uncheck');
}

function createGraph(valores) {

    let datosObj = JSON.parse(valores);
    let mes1 = datosObj[0]['mes'];
    let semana1mes1 = datosObj[0]['datos']['dato1'];
    let semana2mes1 = datosObj[0]['datos']['dato2'];
    let semana3mes1 = datosObj[0]['datos']['dato3'];
    let semana4mes1 = datosObj[0]['datos']['dato4'];
    let mes2 = datosObj[1]['mes'];
    let semana1mes2 = datosObj[1]['datos']['dato1'];
    let semana2mes2 = datosObj[1]['datos']['dato2'];
    let semana3mes2 = datosObj[1]['datos']['dato3'];
    let semana4mes2 = datosObj[1]['datos']['dato4'];
    let mes3 = datosObj[2]['mes'];
    let semana1mes3 = datosObj[2]['datos']['dato1'];
    let semana2mes3 = datosObj[2]['datos']['dato2'];
    let semana3mes3 = datosObj[2]['datos']['dato3'];
    let semana4mes3 = datosObj[2]['datos']['dato4'];


    c3.generate({
        bindto: '#lineChart',
        data: {
            columns: [
                [mes1, '0.00', semana1mes1, semana2mes1, semana3mes1, semana4mes1],
                [mes2, '0.00', semana1mes2, semana2mes2, semana3mes2, semana4mes2],
                [mes3, '0.00', semana1mes3, semana2mes3, semana3mes3, semana4mes3]
            ],
            colors: {
                data1: '#1ab394',
                data2: '#BABABA',
                data3: '#BABABA'
            }
        }
    });

}


/*** Carga Emergencia ***/

function loadRutaEmergencia() {

    //_validConexion();

    let url = "Administration/Ruta/Load_RouteEmergencyAll",
    frn = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        if (sdata != "")
            loadGridEmergency(sdata);
        else
            document.getElementById("contentTableEmergency").innerHTML = "";
        
    });

    $('.footable').trigger('footable_resize');
}

function loadGridEmergency(datos) {

    let valida = '';
    let valores = JSON.parse(datos);
    let strContentTablaA = '';
    let strContentModalEmergency = '';
    let strCosto;

    for (var i = 0; i < valores.length; i++) {

        strCosto = _number_format(valores[i]['Costo'], 2);

        strContentTablaA = strContentTablaA +
        '<tr class="gradeX footable-even">' +
        '   <td>' + valores[i]['Destino'] + '</td>' +
        '   <td>' + valores[i]['Servicio'] + '</td>' +
        '   <td>' + valores[i]['Hora'] + '</td>' +
        '   <td>' + valores[i]['UsuarioShip'] + '</td>' +
        '   <td>' + valores[i]['Aprobadopor'] + '</td>' +
        '   <td>' + valores[i]['Programacion'] + '</td>' +
        '   <td> S/.&nbsp;' + strCosto + '</td>';

        
        if (valores[i]['TipoMovilidad'] == "") {

            valida = '1';

            if (strUserValid == "OK") {
                strContentTablaA = strContentTablaA +
                    '   <td>' + cboMovilidades(i, valores[i]['Ruta']) + '</td>';
            }
            else
            {
                strContentTablaA = strContentTablaA +
                    '   <td></td>';
            }
        }
        else {

            valida = '';

            strContentTablaA = strContentTablaA +
               '   <td>' + valores[i]['TipoMovilidad'] + '</td>';
        }

        if (valores[i]['Estado'] == "Pending") {
            strContentTablaA = strContentTablaA +
            '   <td><a href="#" class="btn btn-xs btn-outline btn-primary" data-toggle="modal" data-target="#myModal_Emergency' + i + '">Pending..</a></td>';
        }
        else if (valores[i]['Estado'] == "Delivered") {
            strContentTablaA = strContentTablaA +
            '   <td><a href="#" class="btn btn-xs btn-outline btn-success" data-toggle="modal" data-target="#myModal_Emergency' + i + '">Delivered</a></td>';
        }

        else if (valores[i]['Estado'] == "Cancelled") {
            strContentTablaA = strContentTablaA +
            '   <td><a href="#" class="btn btn-xs btn-outline btn-danger" data-toggle="modal" data-target="#myModal_Emergency' + i + '">Cancelled</a></td>';
        }

        if (valida == '') {

            if (strUserValid == "OK") {
                if (valores[i]['Estado'] == "Cancelled" || valores[i]['Estado'] == "Delivered") {
                    strContentTablaA = strContentTablaA +
                  '    <th></th>' +
                     '</tr>';
                }
                else {
                    strContentTablaA = strContentTablaA +
               
               '    <th onclick="fn_DesprogramarEmergencia(\'' + valores[i]['IdEmergencia'] + '\',\'' + valores[i]['IdUsuarioShip'] + '\')"><i class="fa fa-trash"></i></th>' +
                  '</tr>';
                }
               
            }
            else {

                if (valores[i]['TipoMovilidad'] == ""){
                    strContentTablaA = strContentTablaA +
                    
                    '    <th onclick="fn_EliminarEmergencia(\'' + valores[i]['IdEmergencia'] + '\')"><i class="fa fa-trash"></i></th>' +
                       '</tr>';
                }
                else
                {
                    strContentTablaA = strContentTablaA +
                   '    <th></th>' +
                      '</tr>';
                }
            }
        }
        else
        {
            if (strUserValid == "OK") {
                strContentTablaA = strContentTablaA +
                
                '    <th onclick="fn_ProgramarEmergencia(\'' + valores[i]['IdEmergencia'] + '\',\'' + i + '\')"><i class="fa fa-save"></i></th>' +
                   '</tr>';
            }
            else {

                if (valores[i]['TipoMovilidad'] == "") {
                    strContentTablaA = strContentTablaA +
                    
                    '    <th onclick="fn_EliminarEmergencia(\'' + valores[i]['IdEmergencia'] + '\')"><i class="fa fa-trash"></i></th>' +
                       '</tr>';
                }
                else
                {
                    strContentTablaA = strContentTablaA +
                    '    <th></th>' +
                      '</tr>';
                }
            }
        }


        strContentModalEmergency = strContentModalEmergency + getModalRuta(i, valores[i]['Costo'], valores[i]['IdEmergencia'], valores[i]['UsuarioShip'], valores[i]['Estado'], valores[i]['Razon'], valores[i]['Observacion'], valores[i]['Contacto'], valores[i]['Destino'], valores[i]['IdCliente'], valores[i]['Servicio'], valores[i]['Programacion'], valores[i]['HoraEntrega'], valores[i]['TipoMovilidad']);

    }

    

    document.getElementById("contentTableEmergency").innerHTML = strContentTablaA;
    document.getElementById("modalEmergency").innerHTML = strContentModalEmergency;

}

function loadCostEmergency() {

   //_validConexion();

   let url = "Administration/Ruta/load_CostoEmergencia",
   frm = new FormData();

    _Post(url, frm).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        getGridCostEmergency(sdata);

    });


}

function getGridCostEmergency(datos) {

    let strGrid = '';
    let arrayDatos = '';
    let objJson = '';
    let objCost = '';
    let objCost2 = '';

    if (datos != "") {
        arrayDatos = datos.split('¬');
        objJson = JSON.parse(arrayDatos[2]);
        objCost = JSON.parse(arrayDatos[1]);
        objCost2 = JSON.parse(arrayDatos[0]);
        viewDatosTrimestre(arrayDatos[3]);
        for (var i = 0; i < objJson.length; i++) {
            strGrid = strGrid +
                       '<tr>' +
                          '<td>' +
                              '<small>' + objJson[i]['Jefatura'] + '</small>' +
                          '</td>' +
                          '<td style="text-align:center">' + objJson[i]['Cantidad_Sin_Costo'] + '</td>' +
                          '<td style="text-align:center">' + objJson[i]['Cantidad_Costo'] + '</td>' +
                          '<td style="text-align:right">' + _number_format(objJson[i]['CostoTotal'], 2) + '</td>' +
                        '</tr>'
        }

        document.getElementById("bodyGridCostEmergency").innerHTML = strGrid;
        document.getElementById("totalCostMes").innerHTML = "S/. &nbsp;" + _number_format(objCost[0]['COSTO_MES'], 2);
        document.getElementById("costAnnual").innerHTML = "S/. &nbsp;" + _number_format(objCost2[0]['COSTO_ANUAL'], 2);

    }
    else {
        viewDatosTrimestre("");
    }


    $('.footable').trigger('footable_resize');
}

function getModalRuta(count, costo, idmensaje, sender, status, reason, observation, contact, provider, client, type, programacion, hora_entrega, tipo_movilidad) {

    var strCosto = _number_format(costo, 2);
    var strModalWindow = '';
    var strResult = '';


    strModalWindow =
         '<div class="modal inmodal" id="myModal_Emergency' + count + '" tabindex="-1" role="dialog" aria-hidden="true">' +
               '<div class="modal-dialog">' +
                   '<div class="modal-content animated flipInY">' +
                       '<div class="modal-header">' +
                           '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                           '<h4 class="modal-title">Shipping Details Emergency</h4>' +
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


    strModalWindow = strModalWindow + '     <dl class="small m-b-none">   ' +
                                               '<dd><b>Contact:&nbsp;</b> ' + contact  + '</dd>' +
                                               '<dd><b>Destination:&nbsp;</b>' + provider + '</dd>' +
                                               '<dd><b>Client:&nbsp;</b>  ' + client   + '</dd>' +
                                               '<dd><b>Service:&nbsp;</b> ' + type     + '</dd>' +
                                               '<dd></dd>' +
                                           '</dl>' +
                                       '</td>' +
                                   '</tr>' +
                               '</tbody>' +
                           '</table>' +
                           '<div id="costMensaje' + count + '" style="display:none" ><b>Payment:&nbsp;</b><spam style="float:right"><input type="number" id="txtcostMensaje' + count + '" value="' + strCosto + '"></spam></div>' +
                       '</div>';

    if (programacion == "Programmed" && strUserValid == "OK" && tipo_movilidad == "TAXI") {
        strModalWindow = strModalWindow + ' <div class="modal-footer">' +
                                                '<button id="btnViewCost' + count + '" type="button" class="btn btn-success"  onclick="addCost(\'' + count + '\')">Add Cost</button>' +
                                                '<button id="btnSaveCost' + count + '" type="button" class="btn btn-success" data-dismiss="modal" onclick="saveCost(\'' + idmensaje + '\',\'' + count + '\')" style="display:none">Save</button>' +
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
    return strModalWindow;
}

/*** New Emergencia ***/

function GetAprueba() {

    //_validConexion();

    let url = "Administration/Ruta/Upload_Aprueba",
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        let datos = JSON.parse(sdata);
        document.getElementById("txtEnvia").innerHTML = datos[0]["NombreUsuario"];
        document.getElementById("txtAprueba").innerHTML = datos[0]["Jefe"];

    })
}

function GetCrearCombo(datos, select, value, text) {

    document.getElementById(select).innerHTML = '';

    let strJson = JSON.parse(datos);

    let strSelectUsers =
          '    <option></option>';
    for (var i = 0; i < strJson.length; i++) {
        strSelectUsers = strSelectUsers +
            '<option value="' + strJson[i][value] + '">' + strJson[i][text] + '</option>';
    }

    document.getElementById(select).innerHTML = strSelectUsers;
}

function GetComboDestino(valor) {

   // _validConexion();

    let url = "Administration/Ruta/Upload_ComboDestino?valor=" + valor,
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        GetCrearCombo(sdata, "cboDestino", "IdDestino", "Nombre");
    });

}

/*** Crear Emergencia ***/

function validInsert() {

    var valorChkOthers = $("#chkOthers").prop("checked");
    let a;

    a = $(".select2_TypeMobility").val();
    if (a == "") {
        swal({ title: "Missing data", text: "Select type of mobility", type: "warning" });
        return;
    }


    if (valorChkOthers == false)
        a = $(".select2_Destination").val();
    else
        a = document.getElementById("txtInputDestino").value;

    if (a == "") {

        swal({ title: "Missing data", text: "Select the destination", type: "warning" });
        return;
    }

    a = $(".select2_TypeService").val();
    if (a == "") {
        swal({ title: "Missing data", text: "Select type of service", type: "warning" });
        return;
    }

    let idtipomobilidad = $("#selectMobilidad").val();
    let strHora = document.getElementById("txtHora").value.split(':');
    let Time = strHora[0] + strHora[1];
    //let strHora = _getCleanedString(document.getElementById("txtHora").value);
    //let Time = parseInt(strHora);

    if ($(".select2_TypeService").val() == "1") {

        if (Time > 1259) {
            swal({ title: "Missing data", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
            return;
        }
    }
    else {
        if (Time <= 1259) {
            swal({ title: "Missing data", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
            return;
        }
    }

    let b = document.getElementById("idcliente").value
    if (b == "") {
        swal({ title: "Missing data", text: "Enter the Client", type: "warning" });
        return;
    }

    saveAddRoute();

}

function saveAddRoute() {

    swal({
        title: "Do you want to save the inserted values?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        fn_CrearRutaEmergencia();
        //crearRutaEmergencia();
        hideFormulario();
        return;

    });



}

function fn_CrearRutaEmergencia() {

    var f = new Date();
    var IdCliente = _("idcliente").value;
    var IdDestino = "";
    var Destino = "";
    var Hora = _("txtHora").value;
    var Dia = strFechaFormato(f.getDate(), (f.getMonth() + 1), f.getFullYear());
    var Contacto = _("txtContacto").value;
    var Razon = _("txtMotivo").value;
    var Observacion = _("txtObservacion").value;
    var Ruta = $("#selectMobilidad").val();
    var TipoMotivo = "";
    var TipoServicio = $('#select2_TypeService').val();

    var valorChkMotivo = $("#chkSinMovil").prop("checked");
    var valorChkOthers = $("#chkOthers").prop("checked");

    if (valorChkOthers == false) { IdDestino = $('#cboDestino').val(); }
    else { Destino = _("txtInputDestino").value; }

    if (valorChkMotivo == false) { TipoMotivo = "0"; }
    else { TipoMotivo = "1"; }

    fn_InsertData(IdCliente, IdDestino, Destino, Hora, Dia, Contacto, Razon, Observacion, Ruta, TipoMotivo, TipoServicio);

}

function fn_InsertData(_IdCliente, _IdDestino, _Destino, _Hora, _Dia, _Contacto, _Razon, _Observacion, _Ruta, _TipoMotivo, _TipoServicio) {

    //_validConexion();

    let url = "Administration/Ruta/Insert_NewEmergency?IdCliente=" + _IdCliente + "&IdDestino=" + _IdDestino + "&Destino=" + _Destino +
            "&Hora=" + _Hora + "&Dia=" + _Dia + "&Contacto=" + _Contacto + "&Razon=" + _Razon + "&Observacion=" + _Observacion + "&Ruta=" + _Ruta +
            "&TipoMotivo=" + _TipoMotivo + "&TipoServicio=" + _TipoServicio,
            frn = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1", reason);
    }).then(function (sdata) {
        loadRutaEmergencia();
        swal({ title: "Good job!", text: "You Have Created New Routes", type: "success" });
    });
}



/*** Desprogramar Emergencia ***/

function fn_DesprogramarEmergencia(_IdEmergencia, _IdUsuarioShip) {

    swal({
        title: "Do you want to deleted the scheduled route?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {

        $('#formulario').hide();
        $('#btnNew').show();
        $('#btnSave').hide();
        fn_GuardarChangeProgramacion(_IdEmergencia, _IdUsuarioShip);
        return;
    });
}

function fn_GuardarChangeProgramacion(_IdEmergencia, _IdUsuarioShip) {
    
    //_validConexion();

    let url = "Administration/Ruta/update_RouteEmergencyMobility?idemergencia=" + _IdEmergencia + "&IdUsuarioShip=" + _IdUsuarioShip,
    frn = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        loadRutaEmergencia();
        loadCostEmergency();
        swal({ title: "Good job!", text: "You Deleted the Programming", type: "success" });
    });

    $('.footable').trigger('footable_resize');

}




/*** Eliminar Emergencia ***/

function fn_EliminarEmergencia(_IdEmergencia) {

    //_validConexion();

    let url = "Administration/Ruta/delete_RouteEmergency?IdEmergencia=" + _IdEmergencia,
    frn = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        loadRutaEmergencia();
        
        swal({ title: "Good job!", text: "You Deleted the Route", type: "success" });
    });

    $('.footable').trigger('footable_resize');

}


/*** Programar Emergencia ***/

function fn_ProgramarEmergencia(_IdEmergencia, _TipoMovilidad) {

    swal({
        title: "Do you want to save the scheduled route?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {

        $('#formulario').hide();
        $('#btnNew').show();
        $('#btnSave').hide();
        fn_GuardarProgramacion(_IdEmergencia, _TipoMovilidad);
        return;
    });
}



function fn_GuardarProgramacion(_IdEmergencia, _TipoMovilidad) {

   //_validConexion();

    let TipoMovilidad = $("#select2_TypeService" + _TipoMovilidad).val();
    let url = "Administration/Ruta/Update_StatusEmergencia?IdEmergencia=" + _IdEmergencia + "&TipoMovilidad=" + TipoMovilidad,
    frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
    });

    swal({ title: "Good job!", text: "You have scheduled a new emergency", type: "success" });

    loadRutaEmergencia();
    loadCostEmergency();

   
}



function saveCost(e, f) {

    //_validConexion();

    let costo = document.getElementById("txtcostMensaje" + f).value;
    let strCosto = _number_format(costo, 2);
    let url = "Administration/Ruta/Update_CostoEmergencia?idemergencia=" + e + "&costo=" + strCosto,
    frm = new FormData();

    _Get(url, false).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {

    });


    swal({ title: "Good job!", text: "You have saved the cost of service", type: "success" });

    var page = 'Administration/Ruta/UrgentRuta';
    _Getjs(page);

}


function addCost(e) {

    $('#btnViewCost' + e).hide();
    $('#btnSaveCost' + e).show();
    $('#costMensaje' + e).show();
    
}








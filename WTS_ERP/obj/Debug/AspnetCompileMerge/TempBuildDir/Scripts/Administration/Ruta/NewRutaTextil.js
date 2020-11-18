/// <reference path="../../Home/Util.js" />

var oruta = { path: '' };
var timeHoyDia, timeHoyTarde, timeMananaDia, timeMananaTarde;
var verHoy = "0";
var verManana = "0";
var verLunes = "0";
var verFormulario = "0";
var strTablas = '';
var mensajeEdit = '';
var strUserValid = '';


/**************************Edicion***************************************/
function editarMananaHoy(id, turno) {
    showFormulario();
    mensajeEdit = '1';
    alert('Editar: ' + id + ', Turno: ' + turno);

}

function editarTardeHoy(id, turno) {
    showFormulario();
    alert('Editar: ' + id + ', Turno: ' + turno);

}

function editarMananaManana(id, turno) {
    showFormulario();
    alert('Editar: ' + id + ', Turno: ' + turno);

}

function editarTardeManana(id, turno) {
    showFormulario();
    alert('Editar: ' + id + ', Turno: ' + turno);

}

function viewFormularioEdit(id) {

}

/*************************Eliminar*************************************/
function eliminarMananaHoy(id, turno) {
    eliminarRoute(id);
}

function eliminarTardeHoy(id, turno) {
    eliminarRoute(id);
}

function eliminarMananaManana(id, turno) {
    eliminarRoute(id);
}

function eliminarTardeManana(id, turno) {
    eliminarRoute(id);
}

function eliminarRoute(id) {

    //_validConexion();

    let url = "Administration/Ruta/Delete_RouteID?idmensaje=" + id,
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strTablas = sdata;
        GetJsonAllTables();
        $('.footable').trigger('footable_resize');
    });

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

    //_validConexion();

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

function ClearFormNewRoute() {

    refreshForm();


}

/*************************GetJsonDB***********************************/
function GetJsonAllTables() {

    //_validConexion();

    let url = "Administration/Ruta/Upload_TableAllIniUser",
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strTablas = sdata;
        GetTablas();
        $('.footable').trigger('footable_resize');
    });


}

/*************************Refresh Formulario**************************/

function refreshForm() {
    var url = 'Administration/Ruta/NewRutaTextil';
    _Go_Url(url, url, '');

}

/*************************GatTablas***********************************/
function GetTablas() {

    var count = 0;
    var datos = strTablas.split('¬');
    var strTablaHoyDia = ''
    var strTablaHoyTarde = '';
    var strTablaMananaDia = '';
    var strTablaMananaTarde = '';
    var strTablaLunes = '';

    if (datos[0] != '')
        strTablaHoyDia = JSON.parse(datos[0]);

    if (datos[1] != '')
        strTablaHoyTarde = JSON.parse(datos[1]);

    if (datos[2] != '')
        strTablaMananaDia = JSON.parse(datos[2]);

    if (datos[3] != '')
        strTablaMananaTarde = JSON.parse(datos[3]);

    if (datos[4] != '')
        strTablaLunes = JSON.parse(datos[4]);


    var strContentTablaA = '';
    var strContentTablaB = '';
    var strContentTablaC = '';
    var strContentTablaD = '';
    var strContentTablaE = '';
    var strTurno = '';

    strTurno = 'hoy_dia';
    for (var i = 0; i < strTablaHoyDia.length; i++) {
        count++;
        strContentTablaA = strContentTablaA +
        '<tr class="gradeX footable-even">' +
        '   <td>' + count + '</td>' +
        '   <td>' + strTablaHoyDia[i]['fecha'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['Destino'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['IdCliente'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['NombrePersonal'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['TipoMobilidad'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['hora'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['Servicio'] + '</td>' +
        '   <td>' + strTablaHoyDia[i]['contacto'] + '</td>';

        if (document.getElementById("hoyDia").innerHTML == "Time is Over") {
            strContentTablaA = strContentTablaA +
            '   <th>&nbsp;</th>' +
            '</tr>';
        }
        else {
            strContentTablaA = strContentTablaA +
            '   <th onclick="eliminarMananaHoy(\'' + strTablaHoyDia[i]['IdMensaje'] + '\',\'' + strTurno + '\')"><i class="fa fa-trash"></i></th>' +
            '</tr>';
        }
    }

    count = 0;
    strTurno = 'hoy_tarde';
    for (var i = 0; i < strTablaHoyTarde.length; i++) {
        count++;
        strContentTablaB = strContentTablaB +
        '<tr class="gradeX footable-even">' +
        '   <td>' + count + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['fecha'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['Destino'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['IdCliente'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['NombrePersonal'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['TipoMobilidad'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['hora'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['Servicio'] + '</td>' +
        '   <td>' + strTablaHoyTarde[i]['contacto'] + '</td>';

        if (document.getElementById("hoyTarde").innerHTML == "Time is Over") {
            strContentTablaB = strContentTablaB +
            '   <th>&nbsp;</th>' +
            '</tr>';
        }
        else {
            strContentTablaB = strContentTablaB +
            '   <th onclick="eliminarTardeHoy(\'' + strTablaHoyTarde[i]['IdMensaje'] + '\',\'' + strTurno + '\')"><i class="fa fa-trash"></i></th>' +
            '</tr>';
        }
    }

    count = 0;
    strTurno = 'manana_dia';
    for (var i = 0; i < strTablaMananaDia.length; i++) {
        count++;
        strContentTablaC = strContentTablaC +
        '<tr class="gradeX footable-even">' +
        '   <td>' + count + '</td>' +
        '   <td>' + strTablaMananaDia[i]['fecha'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['Destino'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['IdCliente'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['NombrePersonal'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['TipoMobilidad'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['hora'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['Servicio'] + '</td>' +
        '   <td>' + strTablaMananaDia[i]['contacto'] + '</td>' +
        '   <th onclick="eliminarMananaManana(\'' + strTablaMananaDia[i]['IdMensaje'] + '\',\'' + strTurno + '\')"><i class="fa fa-trash"></i></th>' +
        '</tr>';
    }

    count = 0;
    strTurno = 'manana_tarde';
    for (var i = 0; i < strTablaMananaTarde.length; i++) {
        count++;
        strContentTablaD = strContentTablaD +
        '<tr class="gradeX footable-even">' +
        '   <td>' + count + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['fecha'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['Destino'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['IdCliente'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['NombrePersonal'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['TipoMobilidad'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['hora'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['Servicio'] + '</td>' +
        '   <td>' + strTablaMananaTarde[i]['contacto'] + '</td>' +
        '   <th onclick="eliminarTardeManana(\'' + strTablaMananaTarde[i]['IdMensaje'] + '\',\'' + strTurno + '\')"><i class="fa fa-trash"></i></th>' +
        '</tr>';
    }

    count = 0;
    strTurno = 'lunes';
    for (var i = 0; i < strTablaLunes.length; i++) {
        count++;
        strContentTablaE = strContentTablaE +
        '<tr class="gradeX footable-even">' +
        '   <td>' + count + '</td>' +
        '   <td>' + strTablaLunes[i]['fecha'] + '</td>' +
        '   <td>' + strTablaLunes[i]['Destino'] + '</td>' +
        '   <td>' + strTablaLunes[i]['IdCliente'] + '</td>' +
        '   <td>' + strTablaLunes[i]['NombrePersonal'] + '</td>' +
        '   <td>' + strTablaLunes[i]['TipoMobilidad'] + '</td>' +
        '   <td>' + strTablaLunes[i]['hora'] + '</td>' +
        '   <td>' + strTablaLunes[i]['Servicio'] + '</td>' +
        '   <td>' + strTablaLunes[i]['contacto'] + '</td>' +
        '   <th onclick="eliminarTardeManana(\'' + strTablaLunes[i]['IdMensaje'] + '\',\'' + strTurno + '\')"><i class="fa fa-trash"></i></th>' +
        '</tr>';
    }

    document.getElementById("contentMananaHoy").innerHTML = strContentTablaA;
    document.getElementById("contentTardeHoy").innerHTML = strContentTablaB;
    document.getElementById("contentMananaManana").innerHTML = strContentTablaC;
    document.getElementById("contentTardeManana").innerHTML = strContentTablaD;
    document.getElementById("contentLunesManana").innerHTML = strContentTablaE;
    $('.footable').trigger('footable_resize');
    //$('.footable').data('footable').redraw();



}

/****************Insertar Ruta******************************/
function crearRuta() {

    let destino = "";
    let iddestino = "";
    let hora = "";
    let dia = "";
    let contacto = "";
    let razon = "";
    let objetivos = "";
    let aprobado_por = "";

    let idcliente = _getCleanedString(document.getElementById("idcliente").value);
    let idusuario = $("#selectEnvia").val();
    let idtipomobilidad = 3;
    let valorChkOthers = $("#chkOthers").prop("checked");
    let valorChkTomorrow = $("#chkTomorrow").prop("checked");
    let valorChkMonday = $("#chkMonday").prop("checked");
    let idtiposervicio = "";
    let f = new Date();
    let diaHoy = f.getDate();
    let MesHoy = f.getMonth() + 1;
    let AnioHoy = f.getFullYear();
    let horas = f.getHours();
    let minutos = f.getMinutes();

    let diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    idtiposervicio = $('#select2_TypeService').val();

    if (valorChkTomorrow == true) {
        
        f = new Date(f.getTime() + (24 * 60 * 60 * 1000) * 1);
        diaHoy = f.getDate();
        MesHoy = f.getMonth() + 1;
        AnioHoy = f.getFullYear();
        
    }
    else {
        if (valorChkMonday == true) {
            if (diaStr == 'vie') {
                f = new Date(f.getTime() + (24 * 60 * 60 * 1000) * 3);
                diaHoy = f.getDate();
                MesHoy = f.getMonth() + 1;
                AnioHoy = f.getFullYear();
            }
                
            if (diaStr == 'sab') {
                f = new Date(f.getTime() + (24 * 60 * 60 * 1000) * 2);
                diaHoy = f.getDate();
                MesHoy = f.getMonth() + 1;
                AnioHoy = f.getFullYear();
            }

            if (diaStr == 'dom'){
                f = new Date(f.getTime() + (24 * 60 * 60 * 1000) * 1);
                diaHoy = f.getDate();
                MesHoy = f.getMonth() + 1;
                AnioHoy = f.getFullYear();
            }
        }
    }

    if (strUserValid != "OK") {
        //if (valorChkTomorrow == false) {
            //if (diaStr != 'vie' && diaStr != 'sab' && diaStr != 'dom') {
            //    idtiposervicio = "2";
            //}
            //else {
                if ($('#cboServicio').css('display') == 'none') {
                    if ($("txtTipoServicio").val() == "Morning") {
                        idtiposervicio = "1";
                    }
                    else {
                        idtiposervicio = "2";
                    }
                }
                else {

                    if ($(".select2_TypeService").val() == "1") {

                        idtiposervicio = "1";
                    }
                    else {
                        idtiposervicio = "2";
                    }
                }
            //}
            ////if (horas < 13 && horas > 9)
            ////    idtiposervicio = "2";
        //}
        //else {
        //    if ((horas == 18 && minutos >= 30) || horas > 18)
        //        idtiposervicio = "1";
        //}
    }

    if (valorChkOthers == false)
        iddestino = $('#cboDestino').val();
    else
        destino = _getCleanedString(document.getElementById("txtInputDestino").value);


    dia = strFechaFormato(diaHoy, MesHoy, AnioHoy);
    hora = document.getElementById("txtHora").value;
    contacto = _getCleanedString(document.getElementById("txtContacto").value);
    razon = _getCleanedString(document.getElementById("txtMotivo").value);
    objetivos = _getCleanedString(document.getElementById("txtObservacion").value);
    aprobado_por = _getCleanedString(document.getElementById("txtAprueba").value);

    insertData(idcliente, idusuario, idtipomobilidad, idtiposervicio, iddestino, destino, hora, dia, contacto, razon, objetivos, aprobado_por);

}

function diaSemana(dia, mes, anio) {
    var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
    return dias[dt.getUTCDay()];
};

function insertData(par_idcliente, par_idusuario, par_idtipomobilidad, par_idtiposervicio, par_iddestino, par_destino, par_hora, par_dia, par_contacto, par_razon, par_objetivos, par_aprobado_por) {

    //_validConexion();

    let url = "Administration/Ruta/Insert_NewRoute?idcliente=" + par_idcliente + "&idusuario=" + par_idusuario + "&idtipomobilidad=" + par_idtipomobilidad + "&dia=" + par_dia +
    "&idtiposervicio=" + par_idtiposervicio + "&iddestino=" + par_iddestino + "&destino=" + par_destino + "&hora=" + par_hora + "&contacto=" + par_contacto +
    "&razon=" + par_razon + "&objetivos=" + par_objetivos + '&aprobadopor=' + par_aprobado_por,
    frn = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        ClearFormNewRoute();
        swal({ title: "Good job!", text: "You Have Created New Routes", type: "success" });
    });


}

function validConexion() {

    if (navigator.onLine)
        return;
    else
        window.location.href = 'http://erp.wtsusa.us';

}

$(document).ready(function () {

    validConexion();

    _('btnMananaManana').addEventListener('click', function () {
        $('#tblMananaManana').show();
        $('#tblTardeManana').hide();

        $('#titleTablaMananaManana').show();
        $('#titleTablaTardeManana').hide();

        $('#tblMananaManana').data('footable').redraw();
        $('.footable').trigger('footable_resize');

        return;
    });

    _('btnMananaHoy').addEventListener('click', function () {
        $('#tblMananaHoy').show();
        $('#tblTardeHoy').hide();

        $('#titleTablaMananaHoy').show();
        $('#titleTablaTardeHoy').hide();

        $('#tblMananaHoy').data('footable').redraw();
        $('.footable').trigger('footable_resize');

        return;
    });

    _('btnTardeManana').addEventListener('click', function () {
        $('#tblMananaManana').hide();
        $('#tblTardeManana').show();

        $('#titleTablaMananaManana').hide();
        $('#titleTablaTardeManana').show();

        $('#tblTardeManana').data('footable').redraw();
        $('.footable').trigger('footable_resize');

        return;
    });

    _('btnTardeHoy').addEventListener('click', function () {
        $('#tblMananaHoy').hide();
        $('#tblTardeHoy').show();

        $('#titleTablaMananaHoy').hide();
        $('#titleTablaTardeHoy').show();

        $('#tblTardeHoy').data('footable').redraw();
        $('.footable').trigger('footable_resize');

        return;
    });

    _('btnViewQuery').addEventListener('click', function () {
        clearTimeout(timeHoyDia);
        clearTimeout(timeHoyTarde);
        clearTimeout(timeMananaDia);
        clearTimeout(timeMananaTarde);
        var url = 'Administration/Ruta/QueryRuta';
        _Go_Url(url, url, '');
        //return;
    });


    $('#btnViewQuery').hide();

    $('.footable').footable();

    GetCombos();
    GetJsonAllTables();

    $('#titleTablaMananaManana').show();
    $('#titleTablaTardeManana').hide();
    $('#titleTablaMananaHoy').show();
    $('#titleTablaTardeHoy').hide();

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



    $('#formulario').hide();
    $('#btnSave').hide();
    $('#tblTardeHoy').hide();
    $('#tblTardeManana').hide();
    $('#txtDestino').hide();
    $('#txtTipoServicio').hide();
    $('#txtAprobadoPor').hide();

    $('#chkOthers').on('ifChanged', function (e) {
        validConexion();
        if (e.target.checked == true) {
            $('#txtDestino').show();
            $('#selectDestino').hide();
        }
        else {
            $('#txtDestino').hide();
            $('#selectDestino').show();
        }

    }).end();


    $('#chkMonday').on('ifChanged', function (e) {
        validConexion();
        var hoy = new Date();
        var horas = hoy.getHours();
        var minutos = hoy.getMinutes();
        var segundos = hoy.getSeconds();


        if (e.target.checked == true) {
            $('#txtTipoServicio').hide();
            $('#cboServicio').show();
            fn_ValidarHora();
        }
        else {
            
            if (horas < 9) {
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();
                fn_ValidarHora();
            }
            else {
                $('#txtTipoServicio').show();
                $('#cboServicio').hide();
                fn_ValidarHora();
            }
            
        }

    }).end();

    $('#chkTomorrow').on('ifChanged', function (e) {

        validConexion();

        var hoy = new Date();
        var horas = hoy.getHours();
        var minutos = hoy.getMinutes();
        var segundos = hoy.getSeconds();

        

        if (e.target.checked == true) {
            $('#txtTipoServicio').hide();
            $('#cboServicio').show();
            fn_ValidarHora();
        }
        else {

            if (horas < 9) {
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();                
                fn_ValidarHora();
            }
            else {
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').show();
                $('#cboServicio').hide();
                fn_ValidarHora();
            }
            
        }

    }).end();


    GetComboDestino("3");
    validUser();


    $('.footable').trigger('footable_resize');


});

function fn_ValidarHora() {
    if ($('#cboServicio').css('display') == 'none') {
        if ($("txtTipoServicio").val() == "Morning") {
            document.getElementById("txtHora").value = "08:30";
        }
        else {
            document.getElementById("txtHora").value = "13:30";
        }
    }
    else {

        if ($(".select2_TypeService").val() == "1") {

            document.getElementById("txtHora").value = "08:30";
        }
        else {
            document.getElementById("txtHora").value = "13:30";
        }
    }

}

function GetCombos() {

    validConexion();

    let url = "Administration/Ruta/Upload_Combos",
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        var datos = sdata.split('¬');
        document.getElementById("txtEnvia").innerHTML = datos[0];
       
    })
}

function validInsert() {

    var valorChkOthers = $("#chkOthers").prop("checked");
    let a;
    let b = document.getElementById("idcliente").value
    if (b == "") {
        swal({ title: "Missing data", text: "Enter the Client", type: "warning" });
        return;
    }

    a = $(".select2_TypeMobility").val();
    if (a == "") {
        swal({ title: "Missing data", text: "Select type of mobility", type: "warning" });
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

    if ($('#cboServicio').css('display') == 'none') {
        if ($("txtTipoServicio").val() == "Morning") {

            if (Time > 1259) {
                swal({ title: "Change hours", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
                return;
            }
        }
        else {
            if (Time <= 1259) {
                swal({ title: "Change hours", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
                return;
            }
        }
    }
    else {

        if ($(".select2_TypeService").val() == "1") {

            if (Time > 1259) {
                swal({ title: "Change hours", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
                return;
            }
        }
        else {
            if (Time <= 1259) {
                swal({ title: "Change hours", text: "Delivery Time is Incorrect to Service, please put the correct Time", type: "warning" });
                return;
            }
        }
    }

    if (valorChkOthers == false)
        a = $(".select2_Destination").val();
    else
        a = document.getElementById("txtInputDestino").value;

    if (a == "") {

        swal({ title: "Missing data", text: "Select the destination", type: "warning" });
        return;
    }

    a = document.getElementById("txtContacto").value;

    if (a == "") {

        swal({ title: "Missing data", text: "Insert the contact", type: "warning" });
        return;
    }

    a = document.getElementById("txtMotivo").value;

    if (a == "") {

        swal({ title: "Missing data", text: "Insert the reason", type: "warning" });
        return;
    }

    a = document.getElementById("txtObservacion").value;

    if (a == "") {

        swal({ title: "Missing data", text: "Insert the Observations", type: "warning" });
        return;
    }

    saveAddRoute();

}

function validUser() {

    validConexion();

    let url = "Administration/Ruta/valid_SaveUser",
    frm = new FormData();
    validFormulario();
    countdownHoyMorning('hoyDia');
    countdownHoyAfternoom('hoyTarde');
    countdownTomorrowMorning('mananaDia');
    countdownTomorrowAfternoom('mananaTarde');
    

}

function diaSemana(dia, mes, anio) {
    var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var dt = new Date(mes + ' ' + dia + ', ' + anio + ' 12:00:00');
    return dias[dt.getUTCDay()];
};

function validFormulario() {

    validOtherUser();
    
}


function validOtherUser() {
    
    let hoy = new Date();
    let diaHoy = hoy.getDate();
    let MesHoy = hoy.getMonth() + 1;
    let AnioHoy = hoy.getFullYear();
    let horas = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    let diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    if ((horas == 18 && minutos >= 30) || horas > 18) {
        if (diaStr == 'vie' || diaStr == 'sab' || diaStr == 'dom') {
            document.getElementById("lblCountTomorrow").innerHTML = "<b>Monday</b>";
            document.getElementById("txtTipoServicio").innerHTML = "<b>Morning</b>";
            $('#chkTomorrow').prop('checked', false).iCheck('update');
            $('#chkMonday').prop('checked', true).iCheck('update');
            document.getElementById('chkTomorrow').disabled = true;
            document.getElementById('chkMonday').disabled = true;
            $('#txtTipoServicio').hide();
            $('#cboServicio').show();
            document.getElementById("txtHora").value = "08:30";
            $('#iBoxLunes').show();
        }
        else {
            document.getElementById("lblCountTomorrow").innerHTML = "<b>Tomorrow</b>";
            document.getElementById("txtTipoServicio").innerHTML = "<b>Morning</b>";
            $('#chkTomorrow').prop('checked', true).iCheck('update');
            document.getElementById('chkTomorrow').disabled = true;
            $('#ichkMonday').hide();
            $('#txtTipoServicio').hide();
            $('#cboServicio').show();
            document.getElementById("txtHora").value = "08:30";
            $('#iBoxLunes').hide();
        }
    }
    else {

        if (horas < 9) {

            if (diaStr == 'vie' || diaStr == 'sab' || diaStr == 'dom') {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Monday</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();
                $('#iBoxLunes').show();
                $('#chkTomorrow').prop('checked', false).iCheck('update');
                document.getElementById('chkTomorrow').disabled = true;
                document.getElementById("txtHora").value = "08:30";
            }
            else {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Tomorrow</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();
                $('#iBoxLunes').hide();
                $('#ichkMonday').hide();
                $('#chkTomorrow').prop('checked', false).iCheck('update');
                document.getElementById('chkTomorrow').disabled = false;
                document.getElementById("txtHora").value = "08:30";
            }


        }

        if (horas < 13 && horas >= 9) {
            if (diaStr == 'vie' || diaStr == 'sab' || diaStr == 'dom') {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Monday</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').show();
                $('#cboServicio').hide();
                $('#iBoxLunes').show();
                $('#chkTomorrow').prop('checked', false).iCheck('update');
                document.getElementById('chkTomorrow').disabled = true;
                document.getElementById("txtHora").value = "13:30";
            }
            else {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Tomorrow</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Afternoom</b>";
                $('#txtTipoServicio').show();
                $('#cboServicio').hide();
                $('#iBoxLunes').hide();
                $('#ichkMonday').hide();
                $('#chkTomorrow').prop('checked', false).iCheck('update');
                document.getElementById('chkTomorrow').disabled = false;
                document.getElementById("txtHora").value = "13:30";
            }
        }

        if (horas >= 13) {
            if (diaStr == 'vie' || diaStr == 'sab' || diaStr == 'dom') {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Monday</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Morning</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();
                $('#iBoxLunes').show();
                $('#chkTomorrow').prop('checked', false).iCheck('update');
                $('#chkMonday').prop('checked', true).iCheck('update');
                document.getElementById('chkMonday').disabled = true;
                document.getElementById('chkTomorrow').disabled = true;
                document.getElementById("txtHora").value = "08:30";
            }
            else {
                document.getElementById("lblCountTomorrow").innerHTML = "<b>Tomorrow</b>";
                document.getElementById("txtTipoServicio").innerHTML = "<b>Morning</b>";
                $('#txtTipoServicio').hide();
                $('#cboServicio').show();
                $('#iBoxLunes').hide();
                $('#ichkMonday').hide();
                $('#chkTomorrow').prop('checked', true).iCheck('update');
                document.getElementById('chkTomorrow').disabled = true;
                document.getElementById("txtHora").value = "08:30";
            }
        }


    }
}

function aMayusculas(e) {
    e.value = e.value.toUpperCase();
}

function viewHoy() {

    if (verHoy == "0") {
        $('#contentHoy').hide();
        $('#flechaHoy').removeClass('fa fa-chevron-up').addClass('fa fa-chevron-down');
        verHoy = "1";
        $('#tblMananaHoy').data('footable').redraw();
    }
    else {
        $('#contentHoy').show();
        $('#flechaHoy').removeClass('fa fa-chevron-down').addClass('fa fa-chevron-up');
        verHoy = "0";
        $('#tblTardeHoy').data('footable').redraw();
    }

    $('.footable').trigger('footable_resize');

}

function viewManana() {

    if (verManana == "0") {
        $('#contentManana').hide();
        $('#flechaManana').removeClass('fa fa-chevron-up').addClass('fa fa-chevron-down');
        verManana = "1";
        $('#tblMananaManana').data('footable').redraw();
    }
    else {
        $('#contentManana').show();
        $('#flechaManana').removeClass('fa fa-chevron-down').addClass('fa fa-chevron-up');
        verManana = "0";
        $('#tblTardeManana').data('footable').redraw();
    }
    $('.footable').trigger('footable_resize');

}


function viewLunes() {

    if (verLunes == "0") {
        $('#contentLunes').hide();
        $('#flechaLunes').removeClass('fa fa-chevron-up').addClass('fa fa-chevron-down');
        verLunes = "1";
        $('#tblLunesManana').data('footable').redraw();
    }
    else {
        $('#contentLunes').show();
        $('#flechaLunes').removeClass('fa fa-chevron-down').addClass('fa fa-chevron-up');
        verLunes = "0";
        $('#tblLunesManana').data('footable').redraw();
    }
    $('.footable').trigger('footable_resize');

}

function newAddRoute() {

    $('#formulario').show();
    $('#btnNew').hide();
    $('#btnSave').show();

    verFormulario = "1";

}

function hideFormulario() {
    $('#formulario').hide();
    $('#btnNew').show();
    $('#btnSave').hide();
}

function showFormulario() {
    $('#formulario').show();
    $('#btnNew').hide();
    $('#btnSave').show();
}

function cancelAddRoute() {
    clearTimeout(timeHoyDia);
    clearTimeout(timeHoyTarde);
    clearTimeout(timeMananaDia);
    clearTimeout(timeMananaTarde);
    var url = 'Administration/Ruta/Index';
    _Go_Url(url, url, '');
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

        $('#formulario').hide();
        $('#btnNew').show();
        $('#btnSave').hide();
        crearRuta();
        return;

    });

}


function selectTipo() {
    var valor = $("#select2_TypeService").val();
    if (valor == "1")
        document.getElementById("txtHora").value = "08:30";
    else
        document.getElementById("txtHora").value = "13:30";


}

function countdownTomorrowMorning(id) {
    var hoy = new Date();
    var diaHoy = hoy.getDate();
    var MesHoy = hoy.getMonth() + 1;
    var AnioHoy = hoy.getFullYear();
    var diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);
    var horasTarde = 24 + 8;

    if (diaStr == 'vie')
        //horasTarde = 72 + 12;
        horasTarde = 72 + 8;
    if (diaStr == 'sab')
        //horasTarde = 48 + 12;
        horasTarde = 72 + 8;

    var horas = hoy.getHours();
    var minutos = hoy.getMinutes();
    var segundos = hoy.getSeconds();
    var minutosTarde = 59;
    var segundosTarde = 59;

    
   

    var hora = horas + ":" + minutos + ":" + segundos;
    var diferenciaHoras = horasTarde - Math.floor(horas);
    var diferenciaMinutos = minutosTarde - Math.floor(minutos);
    var diferenciaSegundos = segundosTarde - Math.floor(segundos);

    var valorHoras;
    var valorSegundos;
    var valorMinutos;

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

    var x = InPageTextil(id);
    if (x == true) {
    document.getElementById(id).innerHTML = valorHoras + "h :" + valorMinutos + "m :" + valorSegundos + "s&nbsp;Remaining";
    timeMananaTarde = setTimeout("countdownTomorrowMorning(\"" + id + "\")", 1000);
    } else
        clearTimeout(timeMananaTarde);
}

function countdownTomorrowAfternoom(id) {

    var hoy = new Date();
    var diaHoy = hoy.getDate();
    var MesHoy = hoy.getMonth() + 1;
    var AnioHoy = hoy.getFullYear();
    var diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);
    var horasTarde = 24 + 12;

    if (diaStr == 'vie')
        horasTarde = 72 + 12;
    if (diaStr == 'sab')
        horasTarde = 48 + 12;

    var horas = hoy.getHours();
    var minutos = hoy.getMinutes();
    var segundos = hoy.getSeconds();
    var minutosTarde = 59;
    var segundosTarde = 59;




    var hora = horas + ":" + minutos + ":" + segundos;
    var diferenciaHoras = horasTarde - Math.floor(horas);
    var diferenciaMinutos = minutosTarde - Math.floor(minutos);
    var diferenciaSegundos = segundosTarde - Math.floor(segundos);

    var valorHoras;
    var valorSegundos;
    var valorMinutos;

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

    var x = InPageTextil(id);
    if (x == true) {
        document.getElementById(id).innerHTML = valorHoras + "h :" + valorMinutos + "m :" + valorSegundos + "s&nbsp;Remaining";
        timeMananaTarde = setTimeout("countdownTomorrowAfternoom(\"" + id + "\")", 1000);
    } else
        clearTimeout(timeMananaTarde);
}

function countdownHoyMorning(id) {
    var fecha = new Date();
    var hoy = new Date();
    var horas = hoy.getHours();
    var minutos = hoy.getMinutes();
    var segundos = hoy.getSeconds();
    var horasManana = 8;
    var minutosManana = 59;
    var segundosManana = 59;
    
    var diaHoy = hoy.getDate();
    var MesHoy = hoy.getMonth() + 1;
    var AnioHoy = hoy.getFullYear();
    var diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    var hora = horas + ":" + minutos + ":" + segundos;
    var diferenciaHoras = horasManana - Math.floor(horas);
    var diferenciaMinutos = minutosManana - Math.floor(minutos);
    var diferenciaSegundos = segundosManana - Math.floor(segundos);

    var valorHoras;
    var valorSegundos;
    var valorMinutos;

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
        clearTimeout(timeHoyDia);
        document.getElementById(id).innerHTML = "Time is Over";
        validOtherUser();

    }
    else {
        var x = InPageTextil(id);
        if (x == true) {
        document.getElementById(id).innerHTML = valorHoras + "h :" + valorMinutos + "m :" + valorSegundos + "s&nbsp;Remaining";
        timeHoyDia = setTimeout("countdownHoyMorning(\"" + id + "\")", 1000);
        } else
            clearTimeout(timeHoyDia);
    }

}

function countdownHoyAfternoom(id) {
    var fecha = new Date();
    var hoy = new Date();
    var horas = hoy.getHours();
    var minutos = hoy.getMinutes();
    var segundos = hoy.getSeconds();
    var horasTarde = 12;
    var minutosTarde = 59;
    var segundosTarde = 59;

    var diaHoy = hoy.getDate();
    var MesHoy = hoy.getMonth() + 1;
    var AnioHoy = hoy.getFullYear();
    var diaStr = diaSemana(diaHoy, MesHoy, AnioHoy);

    var hora = horas + ":" + minutos + ":" + segundos;
    var diferenciaHoras = horasTarde - Math.floor(horas);
    var diferenciaMinutos = minutosTarde - Math.floor(minutos);
    var diferenciaSegundos = segundosTarde - Math.floor(segundos);

    var valorHoras;
    var valorSegundos;
    var valorMinutos;

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
        clearTimeout(timeHoyTarde);
        document.getElementById(id).innerHTML = "Time is Over";
        validOtherUser();
    }
    else {
        var x = InPageTextil(id);
        if (x == true) {
            document.getElementById(id).innerHTML = valorHoras + "h :" + valorMinutos + "m :" + valorSegundos + "s&nbsp;Remaining";
            timeHoyTarde = setTimeout("countdownHoyAfternoom(\"" + id + "\")", 1000);
        }
        else
            clearTimeout(timeHoyTarde);
    }
}

function InPageTextil(node) {
    var contador = document.getElementById(node);
    if (contador != null)
        return document.getElementById('tabletextil').contains(contador);
    else {
        return false;
    }
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




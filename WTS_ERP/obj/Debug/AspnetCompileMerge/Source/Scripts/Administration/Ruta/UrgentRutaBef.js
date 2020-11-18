var strUserValid = '';
var strJsonEmergency = '';

var opersonal = {
    arrPersonal: []
}


$(document).ready(function () {


    $("#btnReturn").click(function () {
        let url = 'Administration/Ruta/QueryRuta';
        _Go_Url(url, url, "");
    });

    $("#dtFecha").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
    });

    $('#dtFecha').datepicker('update', moment().format('MM/DD/YYYY'));

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

    $(".select2_TypeMobility").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".select2_TypeService").select2({
        placeholder: "Select a state",
        allowClear: true
    });

    $(".shipby").select2({
        placeholder: "Select a Ship by",
        allowClear: true
    });

    $(".aprueba").select2({
        placeholder: "Select"       
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

    $('#shipby').on('change', cargaJefe);


    $('#select2_TypeService').on('change', selectTipo);
    selectTipo();
    validUser();

    //var par = $("#txtpar").val();
    //if (!isNaN(par)) {
    //    Get('Administration/Ruta/ObtenerEmergencia?par=' + par, LoadEmergency);
    //} else {
    //    GetAprueba();
    //}

    // :load2

});

function cargaJefe() {
    let idusuario = $('#shipby').val();
    let arrusuario = opersonal.arrPersonal.filter(x=>x.idusuario === idusuario);

    _promise(100)
    .then(function () {
        _('aprueba').innerHTML = '';
        if (arrusuario.length > 0) {
            _('aprueba').innerHTML = _comboFromJSON(arrusuario, 'idjefa', 'jefa');
        }
    })
    .then(function () {
        $(".aprueba").select2({
            placeholder: "Select Approved by"
            //allowClear: true
        });
    })

}

// :load
function LoadEmergency(data) {

    if (data != "") {
        var obj = JSON.parse(data)[0];

        if (obj != null) {

            $("#txtEnvia").html(obj.NombrePersonal);
            $("#selectMobilidad").select2("val", obj.Ruta);

            $("#txtFecha").val(obj.Dia);
            $("#select2_TypeService").select2("val", obj.TipoServicio);

            $("#idcliente").val(obj.IdCliente);
            $("#txtContacto").val(obj.Contacto);
            $("#txtMotivo").val(obj.Razon);

            $("#txtObservacion").val(obj.Observacion);
            $("#txtAprueba").html(obj.Jefe);

            if (obj.IdDestino == 0) {
                $("#txtInputDestino").val(obj.Destino);
                $('#chkOthers').iCheck('check');
            } else {
                GetComboDestinoEdit(obj.Ruta, obj.IdDestino);
            }

            $("#txtHora").val(obj.Hora);

            if (obj.TipoMotivo == 1) {
                $('#chkSinMovil').iCheck('check');
            }
            $("#txtCosto").val(obj.Costo);

            cargaCombos(obj);

        }
    }
}

/*** Funciones Generales ***/

function cargaCombos(_odata) {
    let apersonal = [];
    let shipby = $("#shipby");
    _promise()
    .then(function () {
        apersonal = _odata !== null && _odata.personal !== '' ? CSVtoJSON(_odata.personal) : [];
        opersonal.arrPersonal = apersonal;
    })
   .then(function () {
       _('shipby').innerHTML = _comboItem({ value: '0', text: 'None' }) + _comboFromJSON(apersonal, 'idusuario', 'nombrepersonal');
   })
    .then(function () {
        shipby.select2({
            placeholder: "Select a Ship by",
            allowClear: true
        });
    })
    .then(function () {
        shipby.select2("val", _odata.IdUsuarioShip);        
    })
    

}


function validUser() {

    //_validConexion();

    let url = "Administration/Ruta/valid_SaveUser",
        frm = new FormData();

    _Post(url, frm).then(function (value) {
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

    var fecha = anio + newMes + newdia;

    return fecha;
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
    _("txtCosto").value = "";
    $('#chkSinMovil').iCheck('uncheck');
}

// :disabled
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

function GetComboDestinoEdit(valor, destino) {

    // _validConexion();

    let url = "Administration/Ruta/Upload_ComboDestino?valor=" + valor,
        frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        GetCrearCombo(sdata, "cboDestino", "IdDestino", "Nombre");

        $("#cboDestino").select2("val", destino);

    });

}

/*** Crear Emergencia ***/

function validInsert() {

    var valorChkOthers = $("#chkOthers").prop("checked");
    let a;
    
    let idaprobador = $("#aprueba").val();
    if (_isEmpty(idaprobador)) {
        swal({ title: "Missing data", text: "Select Ship", type: "warning" });
        return;
    }

    let idusuario = $("#shipby").val();
    if (_isEmpty(idusuario)) {
        swal({ title: "Missing data", text: "Select Approved ", type: "warning" });
        return;
    }
    
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
        title: "Are you sure to save?",
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
        //hideFormulario();
        return;

    });
}

function fn_CrearRutaEmergencia() {

    var f = new Date();
    var IdCliente = _("idcliente").value;
    var IdDestino = "";
    var Destino = "";
    var Hora = _("txtHora").value;

    var Fecha = $("#txtFecha").val();
    var FechaArr = Fecha.split('/');

    var Dia = FechaArr[2] + FechaArr[0] + FechaArr[1];  // strFechaFormato(f.getDate(), (f.getMonth() + 1), f.getFullYear());
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

    let IdUsuarioShip = $("#shipby").val();
    let AprobadoPor = $("#aprueba").val();
    
    var Costo = $("#txtCosto").val();

    if (Costo == "" || Costo == "0") {
        Costo = "0.00";
    }

    fn_InsertData(IdCliente, IdDestino, Destino, Hora, Dia, Contacto, Razon, Observacion, Ruta, TipoMotivo, TipoServicio, Costo, IdUsuarioShip, AprobadoPor);
}

function fn_InsertData(_IdCliente, _IdDestino, _Destino, _Hora, _Dia, _Contacto, _Razon, _Observacion, _Ruta, _TipoMotivo, _TipoServicio, _Costo, _IdUsuarioShip, _AprobadoPor) {

    //_validConexion();

    var IdEmergencia = 0;

    var par = $("#txtpar").val();

    if (!isNaN(par)) {
        IdEmergencia = par;
    }

    let url = "Administration/Ruta/EmergenciaTaxiSave?IdCliente=" + _IdCliente + "&IdDestino=" + _IdDestino + "&Destino=" + _Destino +
        "&Hora=" + _Hora + "&Dia=" + _Dia + "&Contacto=" + _Contacto + "&Razon=" + _Razon + "&Observacion=" + _Observacion + "&Ruta=" + _Ruta +
        "&TipoMotivo=" + _TipoMotivo + "&TipoServicio=" + _TipoServicio + "&Costo=" + _Costo + "&IdEmergencia=" + IdEmergencia+
        "&IdUsuarioShip=" + _IdUsuarioShip + "&AprobadoPor=" + _AprobadoPor;

    frn = new FormData();

    _Post(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1", reason);
    }).then(function (sdata) {        
        let orespuesta = JSON.parse(sdata);
        orespuesta.mensaje = orespuesta.estado === 'success' ? 'Good job!' : '';
        _swal(orespuesta);
        if (orespuesta.estado === 'error') {
            fn_Limpiar();
        }        
    });
}

function cargaShipBy(_odata) {
    let apersonal = [];
    _promise()
    .then(function () {
        apersonal = _odata !== null && _odata.personal !== '' ? CSVtoJSON(_odata.personal) : [];
        opersonal.arrPersonal = apersonal;
    })
   .then(function () {
       _('shipby').innerHTML = _comboItem({ value: '0', text: 'None' }) + _comboFromJSON(apersonal, 'idusuario', 'nombrepersonal');
   })
    .then(function () {
        $("#shipby").select2({
            placeholder: "Select a Ship by",
            allowClear: true
        });
    })
}


function initRutaBef() {
    let url = 'Administration/Ruta/Load_Usuarios_ShipBy';
    _Get(url)
    .then(function (value) {
        return value !== '' ? JSON.parse(value)[0] : null;
    }, function (reason) {
        console.log("error 1", reason);
    })
    .then(function (odata) {
        cargaShipBy(odata);
    });
}


(function () {
    var par = _('txtpar').value;
    if (!isNaN(par)) {
        Get('Administration/Ruta/ObtenerEmergencia?par=' + par, LoadEmergency);
    } else {        
        initRutaBef();
    }

    
})()



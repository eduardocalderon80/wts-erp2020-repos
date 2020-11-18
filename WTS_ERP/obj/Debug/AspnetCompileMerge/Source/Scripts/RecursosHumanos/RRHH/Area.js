

var oVariables = {
    oruta: { path: '' },
    strJsnArea: "",
    verForm: "0",
}


function load() {

    let elem = document.querySelector('.js-switch');
    let init = new Switchery(elem);
    $('.footable').footable();

    $(".select2_Personal").select2({
        placeholder: "Selection LeaderShip",
        allowClear: false
    });

    $("#selectAreaPadre").select2({
        placeholder: "Selection Area Padre",
        allowClear: false
    });

    if (_('bHijo').checked == true) {
        _('bHijo').click();
    }

    _('btnNew').addEventListener('click', fn_NewArea);
    //_('bHijo').addEventListener('onchange', radioButton);

    LoadFormArea();
    hideForm();
}


/*** FUNCIONES GLOBALES ***/


function hideForm() {

    $('#formMante').hide();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnCancel').hide();
}

function ShowForm() {

    $('#formMante').show();
    //$('#formMante').fadeIn();
    $('#btnNew').hide();
    $('#btnSave').show();
    $('#btnCancel').show();

}

function ReturnForm() {

    $('#formMante').hide();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnCancel').hide();

    CleanData();
    CleanRequired();
}

function CleanData() {

    _("txtArea").value = "";

    $("#selectPersonal").select2("val", "");
    $("#selectAreaPadre").select2("val", "");
    //_("selectAreaPadre").innerHTML = '';
    _("selectAreaPadre").disabled = "true";
    if (document.getElementById("bHijo").checked == true) {
        _('bHijo').click();
    }
}

function SaveArea() {

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
        if (oVariables.verForm == "1") {
            InsertArea();
        }
        else {
            UpdateArea();
        }
        return;
    });

}

function CleanRequired() {

    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x => x.classList.remove('has-error'));

}

function aMayusculas(e) {

    e.value = e.value.toUpperCase();

}

/*** CARGAR EL LISTADO - AREA  ***/

function LoadFormArea() {

    let url = "RecursosHumanos/RRHH/Area_List";

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        oVariables.strJsnArea = sdata;
        res_LoadFormArea();
    });
}

function res_LoadFormArea() {

    let strDatos = oVariables.strJsnArea.split('¬');
    let oValoresAreas = JSON.parse(strDatos[0]);
    let strContentTable = '';
    let contenidoSubArea = "";

    for (var i = 0; i < oValoresAreas.length; i++) {
        contenidoSubArea = "";
        if (oValoresAreas[i]['IdPadre'] !== 0) {
            contenidoSubArea = "<div class='infont col-md-3 col-sm-4'><a href='#'><i class='fa fa-check'><span Style='Display: none;'>Si</span> </i></a></div>";
        }

        strContentTable = strContentTable +
            '<tr class="gradeX footable-even">' +
            '   <td>' + oValoresAreas[i]['NombreArea'] + '</td>' +
            '   <td>' + contenidoSubArea + '</td>' +
            '   <td>' + oValoresAreas[i]['NombrePersonal'] + '</td>' +
            '   <td onclick="EditArea(\'' + oValoresAreas[i]['IdArea'] + '\')"><i class="fa fa-pencil"></i></td>' +
            '</tr>';
    }

    document.getElementById("contentTableArea").innerHTML = strContentTable;

    $('.footable').trigger('footable_resize');
}

function getComboInfoPersonal() {

    _("selectPersonal").innerHTML = '';
    let strDatos = oVariables.strJsnArea.split('¬');
    let oValoresPersonal = JSON.parse(strDatos[1]);


    let strSelectPersonal = '<option></option>';

    for (var i = 0; i < oValoresPersonal.length; i++) {

        strSelectPersonal = strSelectPersonal +
            '<option value="' + oValoresPersonal[i]["IdPersonal"] + '">' + oValoresPersonal[i]["NombrePersonal"] + '</option>';

    }

    _("selectPersonal").innerHTML = strSelectPersonal;
}

function getComboAreasPadres() {

    _("selectAreaPadre").innerHTML = '';
    let strDatos = oVariables.strJsnArea.split('¬');
    let oValoresAreaPadres = JSON.parse(strDatos[0]);


    let strselectAreaPadre = '<option></option>';

    for (var i = 0; i < oValoresAreaPadres.length; i++) {

        if (oValoresAreaPadres[i]["IdPadre"] == 0) {
            strselectAreaPadre = strselectAreaPadre +
                '<option value="' + oValoresAreaPadres[i]["IdArea"] + '">' + oValoresAreaPadres[i]["NombreArea"] + '</option>';
        }
    }

    _("selectAreaPadre").innerHTML = strselectAreaPadre;
}


/*** INSERTAR PERSONAL ***/

function fn_NewArea() {
    //document.getElementById("divPadre").style.display = "block";

    ShowForm();
    getComboInfoPersonal();
    getComboAreasPadres();
    oVariables.verForm = "1";
}

function InsertArea() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Area_Insert?par=";
    let par = "";
    if (req) {

        let oArea = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdPersonal = $("#selectPersonal").val();
        oArea["IdJefatura"] = IdPersonal;
        if (_("bHijo").checked == true) {
            oArea["bHijo"] = 1;
            oArea["IdPadre"] = $("#selectAreaPadre").val();
        } else {
            oArea["IdPadre"] = 0;
            oArea["bHijo"] = 0;
        }

        let strJson = JSON.stringify(oArea);

        url = url + strJson;

        _Get(url).then(function (value) {
            return value;
        }, function (reason) {
            console.log("error 1 ", reason);
        }).then(function (sdata) {
            oVariables.strJsnArea = sdata;
            res_LoadFormArea();
            swal({ title: "Good job!", text: "You Have Created New Area", type: "success" });
            ReturnForm();
        });
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}



/*** ACTUALIZAR AREA ***/

function EditArea(_IdArea) {

    //document.getElementById("divPadre").style.display = "block";
    let strDatosArea = oVariables.strJsnArea.split('¬');
    let odata = JSON.parse(strDatosArea[0]);

    getComboInfoPersonal();
    getComboAreasPadres();

    for (var i = 0; i < odata.length; i++) {

        if (odata[i]['IdArea'] == _IdArea) {
            _("txtArea").value = odata[i]['NombreArea'];
            _("hf_IdArea").value = _IdArea;
            if (odata[i]['bHijo'] != _('bHijo').checked) {
                _('bHijo').click();
            }
            _("bHijo").checked = odata[i]['bHijo'];
            $('#selectPersonal').select2("val", odata[i]['IdJefatura'].toString());
            if (odata[i]['bHijo'] == true) {
                $('#selectAreaPadre').select2("val", odata[i]['IdPadre'].toString());
            } else {
                $('#selectAreaPadre').select2("val", 0);
            }
            break;
        }
    }

    oVariables.verForm = "2";
    ShowForm();
}


function UpdateArea() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Area_Update?par=";
    let par = "";
    var estado = "0";

    if (req) {

        let oArea = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdPersonal = $("#selectPersonal").val();
        oArea["IdJefatura"] = IdPersonal;

        if (_("bHijo").checked == true) {
            oArea["bHijo"] = 1;
            oArea["IdPadre"] = $("#selectAreaPadre").val();
        } else {
            oArea["IdPadre"] = 0;
            oArea["bHijo"] = 0;
        }


        let strJson = JSON.stringify(oArea);

        url = url + strJson;


        _Get(url).then(function (value) {
            return value;
        }, function (reason) {
            console.log("error 1 ", reason);
        }).then(function (sdata) {
            oVariables.strJsnArea = sdata;
            res_LoadFormArea();
            swal({ title: "Good job!", text: "You Have Update a Area", type: "success" });
            ReturnForm();
        });
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}


//function radioButton() {
//    if (_('bHijo').checked == true) {
//        _("selectAreaPadre").disabled = "false";
//    } else {
//        _("selectAreaPadre").disabled = "true";
//    }
//}

document.getElementById("bHijo").onchange = function () {
    if (_('bHijo').checked == true) {
        $('#selectAreaPadre').prop('disabled', false);
    } else {
        $('#selectAreaPadre').prop('disabled', 'disabled');
    }
};

(function ini() {
    load();
}
)();


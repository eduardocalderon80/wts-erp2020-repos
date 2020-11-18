

var oVariables = {
    oruta: { path: '' },
    strJsnCargo: "",
    verForm: "0",
    objSubArea: []
}


function load() {

    $('.footable').footable();

    $(".select2_Area").select2({
        placeholder: "Seleccione Area",
        allowClear: false,
        language: {
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando..";
            }
        }
    });

    $(".select2_SubArea").select2({
        placeholder: "Seleccione Sub Area",
        allowClear: false,
        language: {
            noResults: function () {
                return "No se encontraron resultados";
            },
            searching: function () {
                return "Buscando..";
            }
        }
    });

    _('btnNew').addEventListener('click', fn_NewCargo);


    LoadFormCargo();
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

    _("txtCargo").value = "";

    $("#selectArea").select2("val", "");

}

function SaveCargo() {

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
            InsertCargo();
        }
        else {
            UpdateCargo();
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

function LoadFormCargo() {

    let url = "RecursosHumanos/RRHH/Cargo_List";

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        oVariables.strJsnCargo = sdata;
        res_LoadFormCargo();
    });
}

function res_LoadFormCargo() {

    let strDatos = oVariables.strJsnCargo.split('¬');
    if (strDatos[0] != "") {
        let oValoresCargos = JSON.parse(strDatos[0]);
        let strContentTable = '';

        for (var i = 0; i < oValoresCargos.length; i++) {

            strContentTable = strContentTable +
                '<tr class="gradeX footable-even">' +
                '   <td>' + oValoresCargos[i]['NombreCargo'] + '</td>' +
                '   <td>' + oValoresCargos[i]['NombreArea'] + '</td>' +
                '   <td>' + oValoresCargos[i]['NombreSubArea'] + '</td>' +
                '   <td onclick="EditCargo(\'' + oValoresCargos[i]['IdCargo'] + '\')"><i class="fa fa-pencil"></i></td>' +
                '</tr>';
        }

        console.log(strContentTable);

        document.getElementById("contentTableCargo").innerHTML = strContentTable;

        $('.footable').trigger('footable_resize');
    }
}


function getComboInfoArea() {

    //_("selectArea").innerHTML = '';
    //let strDatos = oVariables.strJsnCargo.split('¬');
    //let oValoresAreas = JSON.parse(strDatos[1]);
    //let strSelectArea = '<option></option>';

    //for (var i = 0; i < oValoresAreas.length; i++) {
    //    strSelectArea = strSelectArea +
    //    '<option value="' + oValoresAreas[i]["IdArea"] + '">' + oValoresAreas[i]["NombreArea"] + '</option>';
    //}

    //Limpia object Sub Area
    oVariables.objSubArea = [];

    _("selectArea").innerhtml = '';
    _("selectSubArea").innerHTML = '';
    let arrarea = JSON.parse(oVariables.strJsnCargo.split("¬")[1]);
    let cboarea = `<option></option>`;
    if (arrarea.length > 0) {
        arrarea.forEach(x => {
            if (x.IdPadre == 0) {
                cboarea += `<option value='${x.IdArea}'>${x.NombreArea}</option>`
            } else {
                aObjeto = { "IdArea": x.IdArea, "NombreArea": x.NombreArea, "IdPadre": x.IdPadre }
                oVariables.objSubArea.push(aObjeto);
            }
        });
    }

    _('selectArea').innerHTML = cboarea;
}

_("selectArea").onchange = function () {
    _("selectSubArea").innerHTML = '';

    let cboaHijo = `<option></option>`;
    let IdPadre = _('selectArea').value;
    if (oVariables.objSubArea.length > 0) {
        oVariables.objSubArea.forEach(x => {
            if (x.IdPadre == IdPadre) {
                cboaHijo += `<option value='${x.IdArea}'>${x.NombreArea}</option>`
            }
        });
    }
    _('selectSubArea').innerHTML = cboaHijo;
}


/*** INSERTAR PERSONAL ***/

function fn_NewCargo() {

    $('#selectArea').select2("enable", true)
    ShowForm();
    getComboInfoArea();

    oVariables.verForm = "1";

}


function InsertCargo() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Cargo_Insert?par=";
    let par = "";
    if (req) {

        let oCargo = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdArea = $("#selectArea").val();
        oCargo["IdArea"] = IdArea;

        let strJson = JSON.stringify(oCargo);

        url = url + strJson;

        _Get(url).then(function (value) {
            return value;
        }, function (reason) {
            console.log("error 1 ", reason);
        }).then(function (sdata) {
            oVariables.strJsnCargo = sdata;
            res_LoadFormCargo();
            swal({ title: "¡Buen Trabajo!", text: "Creaste un nuevo Puesto de Trabajo", type: "success" });
            ReturnForm();
        });
    }
    else {

        swal({ title: "Advertencia", text: "Debes ingresar los campos requeridos", type: "warning" });
    }
    return;
}



/*** ACTUALIZAR CARGO ***/

function EditCargo(_IdCargo) {

    //let strDatosCargo = oVariables.strJsnCargo.split('¬');
    //let odata = JSON.parse(strDatosCargo[0]);

    ////$('#selectArea').select2("enable", false)
    //getComboInfoArea();

    //for (var i = 0; i < odata.length; i++) {

    //    if (odata[i]['IdCargo'] == _IdCargo) {
    //        _("txtCargo").value = odata[i]['NombreCargo'];
    //        _("hf_IdCargo").value = _IdCargo;
    //        if(odata[i]["IdArea"] !="0")
    //        $('#selectArea').select2("val", odata[i]['IdArea'].toString());
    //    }
    //}

    //oVariables.verForm = "2";
    //ShowForm();

    //Llena comboAreaSubArea
    getComboInfoArea();

    //Limpia campos
    $('#selectArea').select2("val", "");
    $('#selectSubArea').select2("val", "");

    let strDatosCargo = JSON.parse(oVariables.strJsnCargo.split('¬')[0]);
    let cargoFiltrado = strDatosCargo.filter(x => x.IdCargo == _IdCargo)[0]

    //Hide IdCargo
    _("hf_IdCargo").value = _IdCargo;

    if (cargoFiltrado.IdSubArea == 0) {
        _("txtCargo").value = cargoFiltrado.NombreCargo;
        $('#selectArea').select2("val", cargoFiltrado.IdArea);
    } else {
        _("txtCargo").value = cargoFiltrado.NombreCargo;
        $('#selectArea').select2("val", cargoFiltrado.IdArea);
        $('#selectSubArea').select2("val", cargoFiltrado.IdSubArea);
    }

    oVariables.verForm = "2";
    ShowForm();
}


function UpdateCargo() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Cargo_Update?par=";
    let par = "";
    var estado = "0";

    if (req) {

        let oCargo = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdArea = $("#selectArea").val();
        oCargo["IdArea"] = IdArea;

        let strJson = JSON.stringify(oCargo);

        url = url + strJson;

        _Get(url).then(function (value) {
            return value;
        }, function (reason) {
            console.log("error 1 ", reason);
        }).then(function (sdata) {
            oVariables.strJsnCargo = sdata;
            res_LoadFormCargo();
            swal({ title: "Good job!", text: "You Have Update Job Position", type: "success" });
            ReturnForm();
        });
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}

(function ini() {
    load();
}
)();

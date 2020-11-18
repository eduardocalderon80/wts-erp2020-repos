
/// <reference path="../../Home/Util.js" />

/**** Declaracion de Variables ****/

var oruta = { path: '' };
var verFormulario = "0";
var strRuta = 'Ruta A';


/**** Inicializador del JavaScript ****/

$(document).ready(function () {

    //_validConexion();

    $('.footable').footable();

    $(".select2_TypeMobility").select2({
        placeholder: "Select a Route",
        allowClear: true
    });    
    GetComboDestino();
    hideForm();
    LoadAllRouteTable(strRuta);

    _('select2_TypeService').addEventListener('change', fn_tiposervicio);
});

/**** Validaciones ****/

function hideForm() {

    var verFormulario = "0";

    $('#formulario').hide();
    $('#btnNew').show();
    $('#btnSave').hide();

    CleanData();
    CleanRequired();
}

function aMayusculas(e) {
    e.value = e.value.toUpperCase();
}

function showForm() {

    $('#formulario').show();
    $('#btnNew').hide();
    $('#btnSave').show();

}

function CleanData()
{
    _("txtInputDestino").value = "";
    _("txtDireccion").value = "";
    _("txtLatitud").value = "";
    _("txtLongitud").value = "";
    _("hf_iddestino").value = "";
}

function CleanRequired() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

function TitleMantenimiento()
{
    if (verFormulario == "1")
    {
        _("txtTituloMantenimiento").innerHTML = "New Destination";
    }
    else
    {
        _("txtTituloMantenimiento").innerHTML = "Edit Destination";
    }
}

function fn_tiposervicio(e) {
    let valor = e.target.value;
    let strTitulo = "List Destinations - " + valor;
    _("txtTituloTabla").innerHTML = strTitulo;
    LoadAllRouteTable(valor);
}

function getRuta(_idruta) {
    if (_idruta == "1")
        return "Ruta A";
    else
        return "Ruta B";
    
}

function SaveRoute() {

    if (verFormulario == "1") {
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
            InsertRoute();
            return;

        });
    }
    else if (verFormulario == "2") {
        swal({
            title: "Do you want to save the changes values?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            UpdateRoute();
            return;

        });
    }

}

/**** Cargar Listado en Tabla ****/

function LoadAllRouteTable(ruta) {

    //_validConexion();

    let url = "Administration/Ruta/loadAllRouteEdit?ruta=" + ruta;
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        GetTableRoute(sdata);
    });
}

function GetTableRoute(datos) {
    let strTablaDatos = JSON.parse(datos);
    let strContentTable = '';

    for (var i = 0; i < strTablaDatos.length; i++) {
        for (var e = 0; e < strTablaDatos[i]['b'].length; e++) {
            strContentTable = strContentTable +
            '<tr class="gradeX footable-even">' +
            '   <td>' + strTablaDatos[i]['Ruta'] + '</td>' +
            '   <td>' + strTablaDatos[i]['b'][e]['Destino'] + '</td>' +
            '   <td>' + strTablaDatos[i]['b'][e]['Direccion'] + '</td>' +
            '   <td>' + strTablaDatos[i]['b'][e]['Latitud'] + '</td>' +
            '   <td>' + strTablaDatos[i]['b'][e]['Longuitud'] + '</td>' +
            '   <td onclick="EditRoute(\'' + strTablaDatos[i]['IdDestino'] + '\')"><i class="fa fa-pencil"></i></td>' +
            '   <td onclick="DeleteRoute(\'' + strTablaDatos[i]['IdDestino'] + '\')"><i class="fa fa-trash"></i></td>' +
            '<tr>';
        }
    }

    document.getElementById("contentTableRoute").innerHTML = strContentTable;

    $('.footable').trigger('footable_resize');
}


/**** Insertar Nuevo Destino ****/

function NewRoute() {

    $('#formulario').show();
    $('#btnNew').hide();
    $('#btnSave').show();

    CleanRequired();

    verFormulario = "1";

    TitleMantenimiento();

}

function GetComboDestino(valor) {

    //_validConexion();

    let url = "Administration/Ruta/loadRoute",
    frm = new FormData();

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        getComboRoute(sdata);
    });

}

function getComboRoute(data) {

    document.getElementById("selectRoute").innerHTML = '';

    let strJson = JSON.parse(data);

    //x = _comboItem({ value: '', text: '-- Select a Route --' });

    //x strSelectRoute = '';

    let strSelectRoute = '    <option></option>';


    for (var i = 0; i < strJson.length; i++) {
        strSelectRoute = strSelectRoute +
            '<option value="' + strJson[i]["IdTipoDestino"] + '">' + strJson[i]["Nombre"] + '</option>';
    }
    
    document.getElementById("selectRoute").innerHTML = strSelectRoute;
}

function InsertRoute() {
    
    //_validConexion();

    let req = _required({ id: 'divdestination', clase: '_enty' });
    if (req) {

        let oRoute = _getParameter({ id: 'divdestination', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            idroute = $("#selectRoute").val(),
            valor_idroute = getRuta(idroute);

        oRoute["valor_idroute"] = valor_idroute;

        form.append('par', JSON.stringify(oRoute));

        Post('Administration/Ruta/Insert_NewDestination', form, function (rpta) {
            let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;

            if (orpta !== null) {
                _('select2_TypeService').value = valor_idroute;
                GetTableRoute(orpta.data);
                _('txtTituloTabla').innerHTML = 'List Destinations - ' + valor_idroute;
                hideForm();
            }
            _swal(orpta);
        });
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}



/**** Actualizar Destino ****/

function EditRoute(idDestino)
{
    showForm()
    verFormulario = "2";

    CleanRequired();
    TitleMantenimiento();

    //_validConexion();

    let url = "Administration/Ruta/LoadRouteDetails?iddestino=" + idDestino;
    
    Get(url, getFormRoute);
}

function getFormRoute(datos) {

    let odata = JSON.parse(datos)[0];

    _("txtInputDestino").value = odata.Destino;
    _("txtDireccion").value=odata.Direccion;
    _("txtLatitud").value = odata.Latitud;
    _("txtLongitud").value = odata.Longuitud;
    _("hf_iddestino").value = odata.IdDestino;
    
    var combo = $("#selectRoute");
    combo.val(odata.IdRuta.toString());
    combo.trigger("change");

}

function UpdateRoute()
{
    let req = _required({ id: 'divdestination', clase: '_enty' });
    if (req) {

        let oRoute = _getParameter({ id: 'divdestination', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            idroute = $("#selectRoute").val(),
            valor_idroute = getRuta(idroute);

            oRoute["valor_idroute"] = valor_idroute;
            form.append('par', JSON.stringify(oRoute));

        Post('Administration/Ruta/Update_Destination', form, function (rpta) {
            let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;

            if (orpta !== null) {

                _('select2_TypeService').value = valor_idroute;
                GetTableRoute(orpta.data);
                _('txtTituloTabla').innerHTML = 'List Destinations - ' + valor_idroute;
                hideForm();
            }
            _swal(orpta);
        });
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}


/**** Eliminar Destino ****/

function DeleteRoute(idDestino)
{
    swal({
        title: "Do you want to delete this register?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
    }, function () {
        $('#formulario').hide();
        $('#btnNew').show();
        $('#btnSave').hide();
        DeleteConfirmRoute(idDestino);
        return;

    });
}

function DeleteConfirmRoute(idDestino) {
    
    idroute = $("#select2_TypeService").val();
    let oRoute = JSON.stringify({ idDestino: idDestino, idroute:idroute }),
            form = new FormData(),
            urlaccion = '';

    form.append('par', oRoute);

    //_validConexion();

    Post('Administration/Ruta/Delete_Destination', form, function (rpta) {
        let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;

        if (orpta !== null) {
            _('select2_TypeService').value = idroute;
            LoadAllRouteTable(idroute);
            hideForm();
        }
        _swal(orpta);
    });

}

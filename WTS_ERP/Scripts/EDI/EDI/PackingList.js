$(document).ready(function () { 
    $(document).ajaxStart(function () {
        $('#myModalSpinner').modal('show');
    });

    $(document).ajaxStop(function () {
        $('#myModalSpinner').modal('hide');
    });
    $("#dtFI").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment().subtract(60, 'days'),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });
    $("#dtFF").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment().add(1, 'days'),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });

    $("#btnSearch").click(function () {
        var frm = new FormData();
        var dateFI = $('#dtFI').data('DateTimePicker').date();
        var dateFF = $('#dtFF').data('DateTimePicker').date();
        var dataFIstr = moment(dateFI).format('YYYYMMDD');
        var dataFFstr = moment(dateFF).format('YYYYMMDD');

        var par = "";
        par = $("#txtPackingList").val() + "," + $("#txtPo").val() + "," + dataFIstr + "," + dataFFstr;
        frm.append("par", par);
        Post('EDI/EDI/SearchPackingList', frm, SearchPackingList);
    });

    $("#btnChangeFactory").click(function () {
        var Fabrica = $("#cboFabrica").val();
        if (Fabrica == "") {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a factory', estado: 'error' };
            _mensaje(objmensaje);
            return false;
        }
        var par = "";
        par = $("#txtIdPackingList").val() + "," + Fabrica;
        var frm = new FormData();
        frm.append("par", par);
        Post('EDI/EDI/PackingListCambiarFabrica', frm, AlertaPLChange);
    });


    Get('EDI/EDI/PackingListObtenerFabrica', ObtenerDatosCarga);
});

function ObtenerDatosCarga(data) {
    if (data != "") {
        var Fabrica = JSON.parse(data);

        var htmlProveedor = _comboFromJSON(Fabrica, "Cod_Fabrica", "Nom_Fabrica");
        $("#cboFabrica").append(htmlProveedor);
    }
}
function AlertaPLChange(data) {
    var rpta = JSON.parse(data);

    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
        
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;


    if (objmensaje.estado != "error") {
        $('#mdPL').modal('hide');
        $("#btnSearch").trigger("click");
    }

    _mensaje(objmensaje);
    $("#btnSearch").click();
}

function SaveASN(IdPackingLit) {
    var frm = new FormData();
    frm.append("IdPackingList", IdPackingLit);
    Post('EDI/EDI/SendASN', frm, AlertaPL);

}
function ChangeFactory(IdPackingList) {
    $("#txtIdPackingList").val(IdPackingList);
    $('#mdPL').modal('show');
}
function AlertaPL(data) {
    var rpta = JSON.parse(data);

    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    _mensaje(objmensaje);
    $("#btnSearch").click();
}
function SearchPackingList(data) {
    $("#divTableContent").empty();
    if (data != "") {
        var dataJS = JSON.parse(data);
        var ndataJS = dataJS.length;
        if (ndataJS > 0) {
            var htmlTable = "";
            htmlTable += "<table class='table table-fixed text-center table-striped table-bordered table-hover dtr-inline stripe'>";
            htmlTable += "<tr>";
            htmlTable += "<th class='text-center'>IdPackingList</th>";
            htmlTable += "<th class='text-center'>PO</th>";
            htmlTable += "<th class='text-center'>Factory</th>";
            htmlTable += "<th class='text-center'>Client</th>";
            htmlTable += "<th class='text-center'>Date</th>";
            htmlTable += "<th class='text-center'>Shipped</th>";
            htmlTable += "<th class='text-center'>Change Factory</th>";
            htmlTable += "<th class='text-center'></th>";
            htmlTable += "</tr>";
            for (var i = 0; i < ndataJS; i++) {
                htmlTable += "<tr>";
                htmlTable += "<td>" + dataJS[i].IdPackingList + "</td>";
                htmlTable += "<td>" + dataJS[i].Po + "</td>";
                htmlTable += "<td>" + dataJS[i].Fabrica + "</td>";
                htmlTable += "<td>" + dataJS[i].Cliente + "</td>";
                htmlTable += "<td>" + dataJS[i].FechaRegistro + "</td>";
                htmlTable += "<td>" + dataJS[i].CantidadDespachada + "</td>";
                htmlTable += "<td><button class='success' onclick='ChangeFactory(" + dataJS[i].IdPackingList + ")'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></button></td>";
                htmlTable += "<td><button class='success' onclick='SaveASN(" + dataJS[i].IdPackingList + ")'><span class='glyphicon glyphicon-send' aria-hidden='true'></span></button></td>";
                htmlTable += "</tr>";

            }
            htmlTable += "</table>";
            $("#divTableContent").append(htmlTable);
        }
    }
}


$(document).ready(function () {


    var ArrayTest = new Array();

    //var obj1 = {
    //    Nombre: "Ricardo",
    //    Apellido: "Huaman",
    //}

    //for (x in obj1) {
    //    alert(x);//   document.getElementById("demo").innerHTML += x;
    //}

    //Object.keys(obj1).forEach(function (key) {
    //    alert(key);
    //    alert(obj1[key]);
        
    //});

    //alert(Object.keys(obj1));

    $("#btnSearch").click(function () {
        var par = $("#cboSeason").val();
        if (par == "") {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Season', estado: 'error' };
            _mensaje(objmensaje);
            return false;
        }
        Get('EDI/EDI/POFleteObtener?season=' + par, POFleteObtener);
    });


    $("#btnSave").click(function () {
        ActualizarPoFlete();
    });

    $("#btnExportar").click(function () {
        Exportar();
    });
    
    Get('EDI/EDI/PoFleteTemporadaObtener', ObtenerDatosCarga);
});


function POFleteObtener(data) {

    if (data != "") {
        var Po = JSON.parse(data);
        var nPo = Po.length;
        if (nPo > 0) {
            var html = "";
            html += "<table id='tblBusqueda' class='table table-bordered table-hover'><thead><tr><th>Po</th><th>Style</th><th>Lote</th><th>Fty</th><th>Units</th><th>Shipped</th><th>Freight</th><th>Total Freight</th><th>Via</th><th style='display:none;'></th></tr></thead><tbody id='tbodyConsulta'>";
            var par = "";
            for (var i = 0; i < nPo; i++) {
                html += "<tr>";
                //html += "<td>Marmaxx</td>";
                html += "<td>" + Po[i].Po + "</td>";
                html += "<td>" + Po[i].Style + "</td>";
                html += "<td>" + Po[i].Lote + "</td>";
                html += "<td>" + Po[i].Fabrica + "</td>";
                html += "<td>" + Po[i].Req + "</td>";
                html += "<td>" + Po[i].Shipped + "</td>";
                html += "<td><span style='display:none;'></span><input type='text' class='form-control' data-initial='" + Po[i].Flete + "' onkeypress='return DigitimosDecimales(event,this);' onkeyup='CalcularTotalFlete(this)' onblur='ValidarNumero(this)' value='" + Po[i].Flete + "' /></td>";
                html += "<td>" + (Po[i].Flete * Po[i].Shipped).toFixed(2) + "</td>";
                html += "<td>" + Po[i].ShipMode + "</td>";
                html += "<td style='display:none;'>" + Po[i].Cod_Fabrica + "</td>";
                html += "</tr>";
            }
            html += "</tbody></table>";
            $("#divContentTBL").empty();
            $("#divContentTBL").append(html);

            $('#tblBusqueda').DataTable({
                paging: false,
                "order": []
            });

        }
    }
}

function Exportar() {

    var par = $("#cboSeason").val();
    if (par == "") {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Season', estado: 'error' };
        _mensaje(objmensaje);
        return false;
    }

    var SeasonName = $("#cboSeason :selected").text();
    var url = urlBase() + "EDI/EDI/Exportar?season=" + par + "&seasonname=" + SeasonName;
    var link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;

}


function CalcularTotalFlete(obj) {
    var value = obj.value;
    var row = $(obj).closest("tr")[0];
    $(obj).closest("span").text(value);
    var Shipped = parseInt(row.cells[5].innerHTML);
    row.cells[7].innerHTML = (value * Shipped).toFixed(2);

}

function ActualizarPoFlete() {

    var PoArr = new Array();
    $("#tbodyConsulta tr").each(function () {
        var Po = this.cells[0].innerHTML;
        var Style = this.cells[1].innerHTML;
        var Lote = this.cells[2].innerHTML;
        var Fty = this.cells[3].innerHTML;
        var Units = parseInt(this.cells[4].innerHTML);
        var Shipped = parseInt(this.cells[5].innerHTML);
        var Flete = parseFloat($(this.cells[6]).find("input").val());
        var FleteInitial = parseFloat($(this.cells[6]).find("input").attr("data-initial"));
        var FleteTotal = (Units * Flete).toFixed(2);
        var Via = this.cells[8].innerHTML;
        var Fabrica = this.cells[9].innerHTML;

        if (Flete != FleteInitial) {
            var objPo = {
                Fabrica: Fabrica,
                Po: Po,
                Style: Style,
                Lote: Lote,
                Flete: Flete
            }

            PoArr.push(objPo);
        }
    });

    if (PoArr.length > 0) {
        var frm = new FormData();
        frm.append("Po", JSON.stringify(PoArr));
        Post('EDI/EDI/UpdatePoFlete', frm, Alerta);
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'No changes', estado: 'error' };
        _mensaje(objmensaje);
    }

}


function Alerta(data) {
    var rpta = JSON.parse(data);

    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;

    if (objmensaje.estado != "error") {
        $("#btnSearch").trigger("click");
    }

    _mensaje(objmensaje);
}


function ObtenerDatosCarga(data) {
    var Temporada = JSON.parse(data);
    var html = _comboFromJSON(Temporada, "Codigo", "Nombre");
    $("#cboSeason").append(html);

}

function ValidarNumero(obj) {
    var value = $(obj).val();
    if (isNaN(value)) {
        $(obj).val("0");
        return false;
    }
    return true;
}
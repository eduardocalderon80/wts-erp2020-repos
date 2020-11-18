var Po = null;
var Lote = null;
var LoteDetalle = null;

$(document).ready(function () {

    $("#btnSearch").click(function () {
        var par = $("#cboFabrica").val() + "," + $("#txtPo").val();
        var frm = new FormData();
        frm.append("par", par);
        Post('EDI/EDI/PoMarmaxxBuscar', frm, Buscar);
    });


    $("#btnSave").click(function () {
        ActualizarPo();
    });

    Get('EDI/EDI/PoMarmaxxFabrica', ObtenerDatosCarga);


});


function Buscar(data) {

    $("#tblBusqueda").remove();

    if (data != null) {
        var Po = JSON.parse(data);
        var nPo = Po.length;
        if (nPo > 0) {
            var html = "";
            html += "<table id='tblBusqueda' class='table table-bordered table-hover'><thead><tr><th>Client</th><th>Po</th><th>Supplier</th><th>Required QTY</th><th></th></tr></thead><tbody>";
            var par = "";
            for (var i = 0; i < nPo; i++) {
                var par = '"' + Po[i].Po.trim() + '"' + ',' + '"' + +Po[i].CodigoFabrica.trim() + '"';
                html += "<tr>";
                html += "<td>" + Po[i].Cliente + "</td>";
                html += "<td>" + Po[i].Po + "</td>";
                html += "<td>" + Po[i].Fabrica + "</td>";
                html += "<td>" + Po[i].CantidadRequerida + "</td>";
                html += "<td class='text-center'><span class='btn-group  btn-group-md pull-center'><button title='Edit' type='button' onclick='MostrarPo(" + par + ")' class='btn btn-default'><span class='glyphicon glyphicon-edit'></span></button></span></td>";
                html += "</tr>";
            }
            html += "</tbody></table>";
            $("#divContentTBL").empty();
            $("#divContentTBL").append(html);

        }
    }
}

function MostrarPo(po, fabrica) {

    var frm = new FormData();
    var par = po + "," + fabrica;
    frm.append("par", par);
    Post('EDI/EDI/PoMarmaxxObtener', frm, CargarPo);

}

function CargarPo(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        if (JSONdata[0].Po != "") {

            var Po = JSON.parse(JSONdata[0].Po)[0];
            var Lote = JSON.parse(JSONdata[0].Lote);
            var LoteDetalle = JSON.parse(JSONdata[0].LoteDetalle);

            var nLote = Lote.length;
            var nLoteDetalle = LoteDetalle.length;

            var htmlPo = "<tr>";
            htmlPo += "<td><input type='text' class='form-control' value='" + Po.Cod_PurOrd + "' readonly /></td>";
            htmlPo += "<td><input type='text' class='form-control'data-initial='" + Po.DepartmentCode + "' value='" + Po.DepartmentCode + "'  /> </td>";
            htmlPo += "<td><input type='text' class='form-control'data-initial='" + Po.VendorCode + "' value='" + Po.VendorCode + "'  /></td>";
            htmlPo += "<td><input type='text' class='form-control'data-initial='" + Po.Buyer + "' value='" + Po.Buyer + "'  /></td>";
            htmlPo += "<td><input type='text' class='form-control'data-initial='" + Po.AddressInformation + "' value='" + Po.AddressInformation + "'  /></td>";
            htmlPo += "<td><input type='text' class='form-control'data-initial='" + Po.DivisionCode + "' value='" + Po.DivisionCode + "'  /></td>";
            htmlPo += "</tr>";

            $("#tblPo tbody").empty();
            $("#tblLote tbody").empty();
            $("#tblLoteDetalle tbody").empty();

            var htmlLote = "";
            var cboStatus = "<select class='form-control' data-initial=''>" + $("#cboStatus").html() + "</select>";
            for (var i = 0; i < nLote; i++) {
                $("#cboStatus").val(Lote[i].PointEntryFlag);
                htmlLote += "<tr>";
                htmlLote += "<td><input type='text' class='form-control' value='" + Lote[i].Cod_PurOrd + "' readonly /></td>";
                htmlLote += "<td><input type='text' class='form-control' value='" + Lote[i].Cod_EstCli + "' readonly /></td>";
                htmlLote += "<td><input type='text' class='form-control' value='" + Lote[i].Cod_LotPurord + "' readonly /></td>";
                //htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].PointEntryFlag + "' value='" + Lote[i].PointEntryFlag + "' /></td>";
                htmlLote += "<td>" + cboStatus + "</td>";
                htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].DCNumber + "' value='" + Lote[i].DCNumber + "'  /></td>";
                //htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].PreTicket + "' value='" + Lote[i].PreTicket + "'  /></td>";
                htmlLote += "<td>" + cboStatus + "</td>";
                htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].InnerPerPack + "' onkeypress='return DigitosEnteros(event,this)' onblur='ValidarNumero(this);' value='" + Lote[i].InnerPerPack + "'  /></td>";
                //htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].StoreReadyFlag + "' value='" + Lote[i].StoreReadyFlag + "' /></td>";
                htmlLote += "<td>" + cboStatus + "</td>";
                htmlLote += "<td><input type='text' class='form-control' data-initial='" + Lote[i].PoDc + "' value='" + Lote[i].PoDc + "'  /></td>";
                htmlLote += "</tr>";
            }

            var htmlLoteDetalle = "";
            for (var i = 0; i < nLoteDetalle; i++) {
                htmlLoteDetalle += "<tr>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Cod_PurOrd + "' value='" + LoteDetalle[i].Cod_PurOrd + "' readonly /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Cod_EstCli + "' value='" + LoteDetalle[i].Cod_EstCli + "' readonly /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Cod_LotPurord + "' value='" + LoteDetalle[i].Cod_LotPurord + "' readonly /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Cod_ColorCliente + "' value='" + LoteDetalle[i].Cod_ColorCliente + "' readonly /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Cod_Talla + "' value='" + LoteDetalle[i].Cod_Talla + "' readonly /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' onkeypress='return DigitosEnteros(event,this)' onblur='ValidarNumero(this);' data-initial='" + LoteDetalle[i].Cant_Requerida + "' value='" + LoteDetalle[i].Cant_Requerida + "' /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].BuyerStyle + "' value='" + LoteDetalle[i].BuyerStyle + "' /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' onkeypress='return DigitosEnteros(event,this)' onblur='ValidarNumero(this);' data-initial='" + LoteDetalle[i].SizeRatio + "' value='" + LoteDetalle[i].SizeRatio + "' /></td>";
                htmlLoteDetalle += "<td><input type='text' class='form-control' data-initial='" + LoteDetalle[i].Category + "' value='" + LoteDetalle[i].Category + "' /></td>";
                htmlLoteDetalle += "</tr>";
            }

            $("#tblPo tbody").append(htmlPo);
            $("#tblLote tbody").append(htmlLote);
            $("#tblLoteDetalle tbody").append(htmlLoteDetalle);

            var contIndex = 0;
            $("#tblLote tbody tr").each(function () {

                $(this.cells[3]).find("select").val(Lote[contIndex].PointEntryFlag);
                $(this.cells[5]).find("select").val(Lote[contIndex].PreTicket);
                $(this.cells[7]).find("select").val(Lote[contIndex].StoreReadyFlag);

                $(this.cells[3]).find("select").attr("data-initial", Lote[contIndex].PointEntryFlag);
                $(this.cells[5]).find("select").attr("data-initial", Lote[contIndex].PreTicket);
                $(this.cells[7]).find("select").attr("data-initial", Lote[contIndex].StoreReadyFlag);

            });

            $('#mdPo').modal('show');

        }
    }

}


function ActualizarPo() {
    if (Validar()) {

        var PoJS = "";
        var LoteJS = "";
        var LoteDetalleJS = "";

        if (Po != null) {
            PoJS = JSON.stringify(Po);
        }

        if (Lote.length > 0) {
            LoteJS = JSON.stringify(Lote);
        }

        if (LoteDetalle.length > 0) {
            LoteDetalleJS = JSON.stringify(LoteDetalle);
        }

        $('#mdPo').modal('hide');

        var frm = new FormData();
        frm.append("po", PoJS);
        frm.append("lote", LoteJS);
        frm.append("lotedetalle", LoteDetalleJS);
        Post('EDI/EDI/PoMarmaxxUpdate', frm, Alerta);

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

function Validar() {

    Po = null;

    var cont = 0;
    var contErrores = 0;

    $("#tblPo tbody tr").each(function () {

        var Cod_PurOrd = $(this.cells[0]).find("input").val().trim();
        var DepartmentCode = $(this.cells[1]).find("input").val().trim();
        var VendorCode = $(this.cells[2]).find("input").val().trim();
        var Buyer = $(this.cells[3]).find("input").val().trim();
        var AddressInformation = $(this.cells[4]).find("input").val().trim();
        var DivisionCode = $(this.cells[5]).find("input").val().trim();


        var DepartmentCodeIV = $(this.cells[1]).find("input").attr("data-initial").trim();
        var VendorCodeIV = $(this.cells[2]).find("input").attr("data-initial").trim();
        var BuyerIV = $(this.cells[3]).find("input").attr("data-initial").trim();
        var AddressInformationIV = $(this.cells[4]).find("input").attr("data-initial").trim();
        var DivisionCodeIV = $(this.cells[5]).find("input").attr("data-initial").trim();

        if (DepartmentCode == "" || VendorCode == "" || Buyer == "" || AddressInformation == "" || DivisionCode == "") {
            contErrores++;
        }

        if ((DepartmentCode != DepartmentCodeIV) || (VendorCode != VendorCodeIV) || (Buyer != BuyerIV) || (AddressInformation != AddressInformationIV) || (DivisionCode != DivisionCodeIV)) {
            Po = {
                Cod_PurOrd: Cod_PurOrd,
                DepartmentCode: DepartmentCode,
                VendorCode: VendorCode,
                Buyer: Buyer,
                AddressInformation: AddressInformation,
                DivisionCode: DivisionCode
            }
            cont++;
        }

    });

    Lote = new Array();

    $("#tblLote tbody tr").each(function () {

        var Cod_PurOrd = $(this.cells[0]).find("input").val().trim();
        var Cod_EstCli = $(this.cells[1]).find("input").val().trim();
        var Cod_LotPurord = $(this.cells[2]).find("input").val().trim();
        var PointEntryFlag = $(this.cells[3]).find("select").val().trim();
        var DCNumber = $(this.cells[4]).find("input").val().trim();
        var PreTicket = $(this.cells[5]).find("select").val().trim();
        var InnerPerPack = $(this.cells[6]).find("input").val().trim();
        var StoreReadyFlag = $(this.cells[7]).find("select").val().trim();
        var PoDc = $(this.cells[8]).find("input").val().trim();


        var PointEntryFlagIV = $(this.cells[3]).find("select").attr("data-initial").trim();
        var DCNumberIV = $(this.cells[4]).find("input").attr("data-initial").trim();
        var PreTicketIV = $(this.cells[5]).find("select").attr("data-initial").trim();
        var InnerPerPackIV = $(this.cells[6]).find("input").attr("data-initial").trim();
        var StoreReadyFlagIV = $(this.cells[7]).find("select").attr("data-initial").trim();
        var PoDcIV = $(this.cells[8]).find("input").attr("data-initial").trim();

        if (PointEntryFlag == "" || DCNumber == "" || PreTicket == "" || InnerPerPack == "" || StoreReadyFlag == "" || PoDc == "") {
            contErrores++;
        }

        if ((PointEntryFlag != PointEntryFlagIV) || (DCNumber != DCNumberIV) || (PreTicket != PreTicketIV) || (InnerPerPack != InnerPerPackIV) || (StoreReadyFlag != StoreReadyFlagIV) || (StoreReadyFlag != StoreReadyFlagIV)) {


            var oLote = {
                Cod_PurOrd: Cod_PurOrd,
                Cod_LotPurord: Cod_LotPurord,
                Cod_EstCli: Cod_EstCli,
                PointEntryFlag: PointEntryFlag,
                DCNumber: DCNumber,
                PreTicket: PreTicket,
                InnerPerPack: InnerPerPack,
                StoreReadyFlag: StoreReadyFlag,
                PoDc: PoDc
            }

            Lote.push(oLote);

            cont++;

        }

    });

    LoteDetalle = new Array();

    $("#tblLoteDetalle tbody tr").each(function () {

        var Cod_PurOrd = $(this.cells[0]).find("input").val().trim();
        var Cod_EstCli = $(this.cells[1]).find("input").val().trim();
        var Cod_LotPurord = $(this.cells[2]).find("input").val().trim();
        var Cod_ColorCliente = $(this.cells[3]).find("input").val().trim();
        var Cod_Talla = $(this.cells[4]).find("input").val().trim();
        var Cant_Requerida = $(this.cells[5]).find("input").val().trim();
        var BuyerStyle = $(this.cells[6]).find("input").val().trim();
        var SizeRatio = $(this.cells[7]).find("input").val().trim();
        var Category = $(this.cells[8]).find("input").val().trim();

        var Cant_RequeridaIV = $(this.cells[5]).find("input").attr("data-initial").trim();
        var BuyerStyleIV = $(this.cells[6]).find("input").attr("data-initial").trim();
        var SizeRatioIV = $(this.cells[7]).find("input").attr("data-initial").trim();
        var CategoryIV = $(this.cells[8]).find("input").attr("data-initial").trim();

        if (Cant_Requerida == "" || Cant_Requerida == 0 || BuyerStyle == "" || SizeRatio == "" || Category == "") {
            contErrores++;
        }

        if ((Cant_Requerida != Cant_RequeridaIV) || (BuyerStyle != BuyerStyleIV) || (SizeRatio != SizeRatioIV) || (Category != CategoryIV)) {

            var oLoteDetalle = {
                Cod_PurOrd: Cod_PurOrd,
                Cod_LotPurord: Cod_LotPurord,
                Cod_EstCli: Cod_EstCli,
                Cod_ColorCliente: Cod_ColorCliente,
                Cod_Talla: Cod_Talla,
                Cant_Requerida: Cant_Requerida,
                BuyerStyle: BuyerStyle,
                SizeRatio: SizeRatio,
                Category: Category
            }

            LoteDetalle.push(oLoteDetalle);

            cont++;

        }

    });

    if (contErrores > 0) {

        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
        return false;

    }

    if (cont > 0) {

        return true;

    } else {

        var objmensaje = { titulo: 'Alerta', mensaje: 'No changes to save !!!', estado: 'error' };
        _mensaje(objmensaje);
        return false;

    }
}


function ObtenerDatosCarga(data) {
    var Fabrica = JSON.parse(data);
    var html = _comboFromJSON(Fabrica, "Codigo", "Nombre");
    $("#cboFabrica").append(html);

}

function ValidarNumero(obj) {
    var value = $(obj).val();
    if (isNaN(value)) {
        $(obj).val("");
        return false;
    }
    return true;
}
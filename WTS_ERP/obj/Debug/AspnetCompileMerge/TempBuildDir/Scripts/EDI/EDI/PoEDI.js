var DataEDI = null;

var EstiloEDI = null;
var TallaEDI = null;
var ColorEDI = null;

var EstiloERP = null;
var TallaERP = null;
var ColorERP = null;
var DireccionERP = null;

var Telas = null;

$(document).ready(function () {

    

    $("#btnSaveFtyPrice").click(function () {
        SaveFtyPrice();
        $("#btnCloseFtyPrice").click();
    });

    $("#cboFamilia").change(function () {

        Get('EDI/EDI/ObtenerTelaPorFamiliaERP?par=' + $(this).val(), LoadFabric);

    });

    $("#btnSaveStyle").click(function () {
        SaveStyle();
    });

    $("#dtFactoryDeliveryDate").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment(),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });

    $("#dtClientDeliveryDate").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment(),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });

    $("#btnEnviar").click(function () {
        SavePO();
    });

    $("#btnSaveColor").click(function () {
        SaveColor();
    });

    $("#btnSaveTalla").click(function () {
        SaveSize();
    });

    CargarDatos();

});
function CargarDatos() {
    Get('EDI/EDI/ObtenerDatosMarmaxxERP', ObtenerDatosMarmaxxERP);
}

function SaveColor() {

    var Color = new Array();
    var Cont = 1;
    var ContError = 0;
    $(".RowColor").each(function () {
        var Chk = $(this.cells[0]).find("input")[0];
        var Checked = $(Chk).is(':checked');
        if (Checked) {
            var Codigo = $(this.cells[1]).text();
            var Nombre = $(this.cells[2]).find("input").val();
            if (Nombre == "") {
                ContError++;
            }
            var obj = {
                Id: Cont,
                CodigoClienteColor: Codigo,
                NombreClienteColor: Nombre
            }
            Color.push(obj);
            Cont++;
        }

    });
    if (ContError > 0) {
        alert("Please enter Color Name");
    } else {
        $('#mdColor').modal('hide');
        var frm = new FormData();
        frm.append("Color", JSON.stringify(Color));
        Post('EDI/EDI/SaveColorERP', frm, Alerta);
    }
}

function SaveSize() {
    var Color = new Array();
    var Cont = 1;
    var ContError = 0;
    $(".RowSize").each(function () {
        var Chk = $(this.cells[0]).find("input")[0];
        var Checked = $(Chk).is(':checked');
        if (Checked) {
            var Codigo = $(this.cells[1]).text();
            var Nombre = $(this.cells[2]).find("input").val();
            if (Nombre == "") {
                ContError++;
            }
            var obj = {
                Id: Cont,
                CodigoClienteColor: Codigo,
                NombreClienteColor: Nombre
            }
            Color.push(obj);
            Cont++;
        }

    });
    if (ContError > 0) {
        alert("Please enter Color Name");
    } else {
        $('#mdTalla').modal('hide');
        var frm = new FormData();
        frm.append("Color", JSON.stringify(Color));
        Post('EDI/EDI/SaveColorERP', frm, Alerta);
    }
}

function SaveStyle() {
    var Style = new Array();

    var IdClienteTemporada = $("#cboSeason").val();
    if (IdClienteTemporada == "") {
        alert('Select a Season');
        return;
    }

    var IdClienteDivision = $("#cboDivision").val();
    if (IdClienteDivision == "") {
        alert('Select a Division');
        return;
    }

    var Usuario = $("#hfUsuario").val();
    var cont = 1;
    $(".RowStyle").each(function () {

        if ($(this.cells[0]).find("input").is(':checked')) {

            var CodigoEstilo = $(this.cells[1]).text();
            var Descripcion = $(this.cells[2]).find("textarea").val();
            var IdFichaTecnica = $(this.cells[3]).find("input").attr("data-value");

            if (Descripcion == "") {
                alert('Please add a description');
                return;
            }

            if (IdFichaTecnica != "" && IdFichaTecnica != "0") {
                var oStyle = {
                    IdEstilo: cont,
                    CodigoEstilo: CodigoEstilo,
                    Descripcion: Descripcion,
                    IdClienteTemporada: IdClienteTemporada,
                    IdDivision: IdClienteDivision,
                    IdFichaTecnica: IdFichaTecnica,
                    Usuario: Usuario
                }
                Style.push(oStyle);
            } else {
                alert('Select a Fabric');
                return;
            }
            cont++;
        }

    });

    if (Style.length) {
        $('#mdStyle').modal('hide');
        var frm = new FormData();
        frm.append("par", JSON.stringify(Style));
        Post('EDI/EDI/SaveStylesERP', frm, Alerta);

    } else {
        alert('Please select an Style');
    }

}

function Alerta(data) {

    var rpta = JSON.parse(data);
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    _mensaje(objmensaje);
   
    if (rpta.estado == "success") {
        LoadData();
    }
}

function SavePO() {

    var Fabrica = $("#cboFactory").val();
    var Divsion = $("#cboDivision").val();
    var Temporada = $("#cboSeason").val();
    var TipoPrecio = $("#cboPrice").val();
    var Freight = $("#cboFreight").val();
    var Shipment = $("#cboShipment").val();
    var Forwarder = $("#cboForwarder").val();
    var FactoryDate = $("#dtFactoryDeliveryDate").find("input").val();
    var ClientDate = $("#dtClientDeliveryDate").find("input").val();

    var MensajeCabecera = "";

    if (Fabrica == "") {
        MensajeCabecera += "<b>- Select Factory</b>";
    }
    if (Divsion == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select Division</b>";
    }
    if (Temporada == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select Season</b>";
    }
    if (TipoPrecio == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select Price Type</b>";
    }
    if (Freight == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select Freight</b>";
    }
    if (Shipment == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select Shipment</b>";
    }
    //if (Forwarder == "") {
    //    alert("Select Forwarder");
    //    return;
    //}
    if (FactoryDate == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select FactoryDate</b>";
    }
    if (ClientDate == "") {
        MensajeCabecera += "</br>"
        MensajeCabecera += "<b>- Select ClientDate</b>";
    }
    if (MensajeCabecera != "") {
        var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
        objmensaje.mensaje = MensajeCabecera;
        _mensaje(objmensaje);
        return;
    }

    var Pos = new Array();
    var oData = {};
    var Data = [];
    $("#tblPO .dataRow").each(function () {
        var ncells = this.cells.length;
        chk = this.cells[0].childNodes[0];
        var check = $(this.cells[0]).find("input");
        var checked = $(check).is(':checked');
        if (checked) {
            var Obj = {};
            for (var i = 0; i < ncells; i++) {
                if ($(this.cells[i]).hasClass("dataPO")) {
                    var NombreCampo = $(this.cells[i]).attr("data-name");
                    if ($(this.cells[i]).hasClass("text")) {
                        var valor = $(this.cells[i]).text();
                        Obj[NombreCampo] = valor;
                    } else if ($(this.cells[i]).hasClass("input")) {
                        var valor = $(this.cells[i]).find("input").val();
                        Obj[NombreCampo] = valor;
                    }
                }
            }
            Data.push(Obj);
        }
    });

    if (Data.length) {
        var contError = 0;
        var DataConTalla = new Array();
        var Index = 0;
        $(".Quantity").each(function () {
            let row = $(this).parent().parent()[0];
            let check = $(row.cells[0]).find("input");
            let checked = $(check).is(':checked');
            if (checked) {
                let size = $(this).attr("data-size");
                let color = $(this).attr("data-color");
                let PurchaseOrderId = $(this).attr("data-id");
                let ratio = $(this).attr("data-ratio");
                let vendorStyle = $(this).attr("data-style");
                let IdClienteTalla = $(this).attr("data-idclientetalla");
                let valor = $(this).val();
                if (parseInt(valor) <= 0) {
                    contError++;
                }

                let ObjNew = _filter_mulptile(Data, { PurchaseOrderId: PurchaseOrderId, BuyerColor: color, VendorStyle: vendorStyle })[0];

                var Obj = {
                    PurchaseOrderId: ObjNew.PurchaseOrderId,
                    Po: ObjNew.Po,
                    PoDc: ObjNew.PoDc,
                    VendorStyle: ObjNew.VendorStyle,
                    BuyerStyle: ObjNew.BuyerStyle,
                    Dc: ObjNew.Dc,
                    Label: ObjNew.Label,
                    ClientPrice: ObjNew.ClientPrice,
                    FactoryPrice: ObjNew.FactoryPrice,
                    PoOrderDate: ObjNew.PoOrderDate,
                    RequestShipDate: ObjNew.RequestShipDate,
                    CancelAfter: ObjNew.CancelAfter,
                    BuyerColor: ObjNew.BuyerColor,
                    Buyer: ObjNew.Buyer,
                    DepartmentCode: ObjNew.DepartmentCode,
                    DivisionCode: ObjNew.DivisionCode,
                    VendorCode: ObjNew.VendorCode,
                    InnerPerPack: ObjNew.InnerPerPack,
                    Size: size,
                    Qty: valor,
                    Ratio: ratio,
                    Fabrica: Fabrica,
                    Destino: "",
                    Category: ObjNew.Category,
                    FactoryDate: FactoryDate,
                    ClientDate: ClientDate,
                    PointEntryFlag: ObjNew.PointEntryFlag,
                    PreTicketFlag: ObjNew.PreTicketFlag,
                    StoreReadyFlag: ObjNew.StoreReadyFlag,
                    IdClienteTalla: IdClienteTalla,
                    IdClienteColor: ObjNew.IdClienteColor,
                    IdEstilo: ObjNew.IdEstilo,
                    IdClienteDireccion: ObjNew.IdClienteDireccion
                };
                DataConTalla.push(Obj);
            }
        });

        var nDataConTalla = DataConTalla.length;

        if (nDataConTalla > 0) {


            var StylesUnmapped = DataConTalla.filter(item=> { return (item.IdEstilo == 0) });
            var SizesUnmapped = DataConTalla.filter(item=> { return (item.IdClienteTalla == 0) });
            var ColorsUnmapped = DataConTalla.filter(item=> { return (item.IdClienteColor == 0) });
            var DireccionUnmapped = DataConTalla.filter(item=> { return (item.IdClienteDireccion == 0) });
            var PriceVal = DataConTalla.filter(item=> { return (item.FactoryPrice == 0) });

            var nStylesUnmapped = StylesUnmapped.length;
            var nSizesUnmapped = SizesUnmapped.length;
            var nColorsUnmapped = ColorsUnmapped.length;
            var nDireccionUnmapped = DireccionUnmapped.length;
            var nPriceVal = PriceVal.length;

            if (nStylesUnmapped > 0 || nSizesUnmapped > 0 || nColorsUnmapped > 0 || nDireccionUnmapped > 0 || nPriceVal > 0 || contError > 0) {

                var Mensaje = "";
                var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

                if (nPriceVal > 0) {
                    Mensaje += "<b>- Please enter Factory Price</b>";
                }

                if (contError > 0) {
                    Mensaje += "</br>";
                    Mensaje += "<b>- Please enter Qty</b>";
                }


                if (nStylesUnmapped > 0) {

                    Mensaje += "</br>";
                    var StylesInf = GroupBy(StylesUnmapped, "VendorStyle");
                    var nStylesInf = StylesInf.length;
                    var MensajeEstilo = "";

                    for (var i = 0; i < nStylesInf; i++) {
                        MensajeEstilo += StylesInf[i].VendorStyle + ", ";
                    }
                    Mensaje += "<b>- Please create styles not mapped: </b>" + MensajeEstilo.substring(0, MensajeEstilo.length - 2);
                }

                if (nSizesUnmapped > 0) {

                    Mensaje += "</br>";
                    var SizesInf = GroupBy(SizesUnmapped, "Size");
                    var nSizesInf = SizesInf.length;
                    var MensajeSize = "";

                    for (var i = 0; i < nSizesInf; i++) {
                        MensajeSize += SizesInf[i].Size + ", ";
                    }
                    Mensaje += "<b>- Please create sizes not mapped: </b>" + MensajeSize.substring(0, MensajeSize.length - 2);
                }

                if (nColorsUnmapped > 0) {

                    Mensaje += "</br>";
                    var ColorsInf = GroupBy(ColorsUnmapped, "BuyerColor");
                    var nColorsInf = ColorsInf.length;
                    var MensajeColor = "";

                    for (var i = 0; i < nColorsInf; i++) {
                        MensajeColor += ColorsInf[i].BuyerColor + ", ";
                    }
                    Mensaje += "<b>- Please create colors not mapped: </b> " + MensajeColor.substring(0, MensajeColor.length - 2);
                }

                if (nDireccionUnmapped > 0) {

                    Mensaje += "</br>";
                    var DireccionInf = GroupBy(DireccionUnmapped, "DC");
                    var nDireccionInf = DireccionInf.length;
                    var MensajeDireccion = "";

                    for (var i = 0; i < nDireccionInf; i++) {
                        MensajeDireccion += DireccionInf[i].DC + ", ";
                    }
                    Mensaje += "<b>Please create DC not mapped: </b>" + MensajeDireccion.substring(0, MensajeDireccion.length - 2);
                }
                objmensaje.mensaje = Mensaje;
                _mensaje(objmensaje);
                return;

            }

            var PoERP = GroupBy(DataConTalla, "Po");
            var nPoERP = PoERP.length;

            var IdPo = 0;
            var IdPoCliente = 0;
            var IdPoClienteEstilo = 0;
            var IdPoClienteEstiloDestino = 0;
            var IdPoClienteEstiloDestinoTallaColor = 0;

            var PoAr = new Array();
            var PoClienteAr = new Array();
            var PoClienteEstiloAr = new Array();
            var PoClienteEstiloDestinoAr = new Array();
            var PoClienteEstiloDestinoTallaColorAr = new Array();

            for (var i = 0; i < nPoERP; i++) {

                IdPo = i + 1;

                PoERP[i]["IdPo"] = IdPo;
                PoERP[i]["Monto"] = 0;
                PoERP[i]["Costo"] = 0;
                PoERP[i]["IdClienteTemporada"] = Temporada;

                var filterPoCliente = DataConTalla.filter(function (e) { return (e.Po.trim() == PoERP[i].Po.trim()) });
                var PoClienteERP = GroupBy(filterPoCliente, "Po,RequestShipDate,Label,DepartmentCode,DivisionCode,VendorCode,Buyer");
                var nPoClienteERP = PoClienteERP.length;

                for (var x = 0; x < nPoClienteERP; x++) {

                    IdPoCliente = x + 1;

                    PoClienteERP[x]["IdPoCliente"] = IdPoCliente;
                    PoClienteERP[x]["IdPo"] = IdPo;
                    PoClienteERP[x]["Monto"] = 0;
                    PoClienteERP[x]["Costo"] = 0;
                    PoClienteERP[x]["CantidadRequerida"] = 0;


                    var PoClienteEstiloERP = GroupBy(filterPoCliente, "Po,VendorStyle,IdEstilo,ClientPrice,FactoryPrice,PoOrderDate,RequestShipDate,CancelAfter,PointEntryFlag,PreTicketFlag,StoreReadyFlag");
                    var nPoClienteEstiloERP = PoClienteEstiloERP.length;

                    for (var z = 0; z < nPoClienteEstiloERP; z++) {

                        IdPoClienteEstilo = z + 1;

                        PoClienteEstiloERP[z].IdPoClienteEstilo = IdPoClienteEstilo;
                        PoClienteEstiloERP[z].IdPoCliente = IdPoCliente;
                        PoClienteEstiloERP[z].IdPo = IdPo;
                        PoClienteEstiloERP[z].IdProveedor = Fabrica;
                        PoClienteEstiloERP[z].IdFlete = Shipment;
                        PoClienteEstiloERP[z].IdFormaEnvio = Freight;
                        PoClienteEstiloERP[z].IdDivisionCliente = Divsion;
                        PoClienteEstiloERP[z].IdDivisionAsociado = 0;
                        PoClienteEstiloERP[z].FechaDespachoFabrica = FactoryDate;
                        PoClienteEstiloERP[z].FechaDespachoCliente = ClientDate;
                        PoClienteEstiloERP[z].Monto = 0;
                        PoClienteEstiloERP[z].Costo = 0;
                        PoClienteEstiloERP[z].CantidadRequerida = 0;
                        PoClienteEstiloERP[z].ComentarioFabrica = "";

                        var filterPoClienteEstiloDestino = filterPoCliente.filter(function (e) { return (e.Po.trim() == PoClienteEstiloERP[z].Po.trim() && e.VendorStyle.trim() == PoClienteEstiloERP[z].VendorStyle.trim()) });
                        var PoClienteEstiloDestinoERP = GroupBy(filterPoClienteEstiloDestino, "Dc,InnerPerPack,PoDc,IdClienteDireccion");
                        var nPoClienteEstiloDestinoERP = PoClienteEstiloDestinoERP.length;

                        for (var y = 0; y < nPoClienteEstiloDestinoERP; y++) {

                            IdPoClienteEstiloDestino = y + 1;

                            PoClienteEstiloDestinoERP[y].IdPoClienteEstiloDestino = IdPoClienteEstiloDestino;
                            PoClienteEstiloDestinoERP[y].IdPoClienteEstilo = IdPoClienteEstilo;
                            PoClienteEstiloDestinoERP[y].IdPoCliente = IdPoCliente;
                            PoClienteEstiloDestinoERP[y].IdPo = IdPo;
                            PoClienteEstiloDestinoERP[y].CantidadRequerida = 0;


                            var filterPoClienteEstiloDestinoTallaColor = filterPoClienteEstiloDestino.filter(function (e) { return (e.Po.trim() == PoClienteEstiloERP[z].Po.trim() && e.VendorStyle.trim() == PoClienteEstiloERP[z].VendorStyle.trim() && e.Dc.trim() == PoClienteEstiloDestinoERP[y].Dc.trim()) });
                            var PoClienteEstiloDestinoTallaColorERP = GroupBy(filterPoClienteEstiloDestinoTallaColor, "BuyerStyle,Ratio,Category,Size,IdClienteTalla,IdClienteColor,Qty,BuyerColor");
                            var nPoClienteEstiloDestinoTallaColorERP = PoClienteEstiloDestinoTallaColorERP.length;

                            for (var a = 0; a < nPoClienteEstiloDestinoTallaColorERP; a++) {

                                IdPoClienteEstiloDestinoTallaColor = a + 1;

                                PoClienteEstiloDestinoTallaColorERP[a].IdPoClienteEstiloDestinoTallaColor = IdPoClienteEstiloDestinoTallaColor;
                                PoClienteEstiloDestinoTallaColorERP[a].IdPoClienteEstiloDestino = IdPoClienteEstiloDestino;
                                PoClienteEstiloDestinoTallaColorERP[a].IdPoClienteEstilo = IdPoClienteEstilo;
                                PoClienteEstiloDestinoTallaColorERP[a].IdPoCliente = IdPoCliente;
                                PoClienteEstiloDestinoTallaColorERP[a].IdPo = IdPo;

                                PoClienteEstiloDestinoERP[y].CantidadRequerida += parseInt(PoClienteEstiloDestinoTallaColorERP[a].Qty);
                                PoClienteEstiloDestinoTallaColorAr.push(PoClienteEstiloDestinoTallaColorERP[a]);
                            }
                            var cajas = parseInt(PoClienteEstiloDestinoERP[y].CantidadRequerida / PoClienteEstiloDestinoERP[x].InnerPerPack);
                            PoClienteEstiloDestinoERP[y].ComentarioFabrica = "ESTA ORDEN PERTENECE A " + PoClienteERP[x].Buyer + " // EMPAQUE STORE READY: " + PoClienteEstiloDestinoERP[x].InnerPerPack + "x" + cajas + " // LLEVA ETIQUETA DE MARCA Y HANG TAG " + PoClienteERP[x].Label + ".";
                            IdPoClienteEstiloDestinoTallaColor = 0;
                            PoClienteEstiloERP[z].CantidadRequerida += parseInt(PoClienteEstiloDestinoERP[y].CantidadRequerida)
                            PoClienteEstiloDestinoAr.push(PoClienteEstiloDestinoERP[y]);

                        }

                        PoClienteEstiloERP[z].Monto += parseFloat(PoClienteEstiloERP[z].CantidadRequerida * PoClienteEstiloERP[z].ClientPrice);
                        PoClienteEstiloERP[z].Costo += parseFloat(PoClienteEstiloERP[z].CantidadRequerida * PoClienteEstiloERP[z].FactoryPrice);

                        PoClienteERP[x]["CantidadRequerida"] += parseInt(PoClienteEstiloERP[z].CantidadRequerida);
                        PoClienteERP[x]["Monto"] += parseFloat(PoClienteEstiloERP[z].Monto);
                        PoClienteERP[x]["Costo"] += parseFloat(PoClienteEstiloERP[z].Costo);

                        IdPoClienteEstiloDestino = 0;
                        PoClienteEstiloAr.push(PoClienteEstiloERP[z]);

                    }

                    PoERP[i]["Monto"] += parseFloat(PoClienteERP[x]["Monto"]);
                    PoERP[i]["Costo"] += parseFloat(PoClienteERP[x]["Costo"]);

                    IdPoClienteEstilo = 0;
                    PoClienteAr.push(PoClienteERP[x])
                }

                IdPoCliente = 0;
                PoAr.push(PoERP[i]);
            }
            IdPo = 0;

            if (PoAr.length > 0) {

                // Ids 

                var PosEdi = GroupBy(DataConTalla, "PurchaseOrderId");
                var nPosEdi = PosEdi.length;
                var poediStr = "";
                for (var i = 0; i < nPosEdi; i++) {
                    poediStr += PosEdi[i].PurchaseOrderId + ",";
                }
                poediStr = poediStr.substring(0, poediStr.length - 1);

                var frm = new FormData();
                frm.append("Po", JSON.stringify(PoAr));
                frm.append("PoCliente", JSON.stringify(PoClienteAr));
                frm.append("PoClienteEstilo", JSON.stringify(PoClienteEstiloAr));
                frm.append("PoClienteEstiloDestino", JSON.stringify(PoClienteEstiloDestinoAr));
                frm.append("PoClienteEstiloDestinoTallaColor", JSON.stringify(PoClienteEstiloDestinoTallaColorAr));
                frm.append("PoEdi", poediStr);
                Post('EDI/EDI/SavePoERP', frm, AlertaSavePO);

            }
        }
    }
}

function AlertaSavePO(data) {

    var rpta = JSON.parse(data);
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    _mensaje(objmensaje);

    if (rpta.estado == "success") {
        Get('EDI/EDI/POPendiente', LoadDataPOEDI);
    }
}

function LoadFabric(data) {
    var JSONdata = JSON.parse(data);
    Telas = null;
    Telas = JSONdata;
    var cboYarn = "";
    cboYarn += _comboFromJSON(Telas, "Tela", "Tela");

    $("#dtTelas").empty();
    $("#dtTelas").append(cboYarn);

    $(".TelasFilter").each(function () {
        $(this).on('input', function (e) {
            var input = $(e.target),
                datalist = input.attr('data-list');

            if (input.val().length < 6) {
                input.attr('list', '');
            } else {
                input.attr('list', datalist);
            }
        });
    });
}

function ValidateFabric(obj) {
    var value = $(obj).val();
    if (value != "") {
        if (Telas != null) {
            var item = Telas.filter(item => { return item.Tela.trim() === value.trim() });
            if (item.length == 0) {
                $(obj).val("");
                $(obj).attr('list', '');
                $(obj).attr("data-value", 0);
            } else {
                $(obj).attr("data-value", item[0].IdFichaTecnica);
            }
        } else {
            $(obj).val("");
            $(obj).attr('list', '');
            $(obj).attr("data-value", 0);
        }
    }
}

function ObtenerDatosMarmaxxERP(data) {

    var JSONdata = JSON.parse(data);
    var Fabrica = JSON.parse(JSONdata[0].Fabrica);
    var Temporada = JSON.parse(JSONdata[0].Temporada);
    var Division = JSON.parse(JSONdata[0].Division);
    var Direccion = JSON.parse(JSONdata[0].Direccion);
    var Familia = JSON.parse(JSONdata[0].Familia);

    var cboFabrica = "<option value=''>Select</option>" + _comboFromJSON(Fabrica, "IdProveedor", "NombreProveedor");
    var cboTemporada = "<option value=''>Select</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
    var cboDivision = "<option value=''>Select</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
    var cboFamilia = "<option value=''>Select</option>" + _comboFromJSON(Familia, "IdFamilia", "NombreFamilia");

    DireccionERP = Direccion;

    $("#cboFactory").empty();
    $("#cboSeason").empty();
    $("#cboDivision").empty();

    $("#cboFactory").append(cboFabrica);
    $("#cboSeason").append(cboTemporada);
    $("#cboDivision").append(cboDivision);
    $("#cboFamilia").append(cboFamilia);

    Get('EDI/EDI/POPendiente', LoadDataPOEDI);

}

function LoadDataPOEDI(data) {    
    DataEDI = JSON.parse(data);
    LoadData();
}

function SaveFtyPrice() {
    $(".FtyPrice").each(function () {
        var value = $(this).val();
        var style = $(this).attr("data-styletbl");
        var label = $(this).attr("data-labeltbl");
        if (value != "" || value >= 0) {
            console.log(style);
            //$("input[data-style='" + style + "']").each(function () {
            $(".Fty" + style).each(function () {
                var inputLabel = $(this).attr("data-label");
                if (inputLabel.trim() == label.trim()) {
                    $(this).val(value);
                }
            });
        }
    });
}

function GetEstiloTallaColor() {

    var nEstilo = EstiloEDI.length;
    var nTalla = TallaEDI.length;
    var nColor = ColorEDI.length;

    var EstiloStr = "";
    var TallaStr = "";
    var ColorStr = "";

    for (var i = 0; i < nEstilo; i++) {
        EstiloStr += EstiloEDI[i].Vendor_Style + ",";
    }

    for (var i = 0; i < nTalla; i++) {
        TallaStr += TallaEDI[i].Buyer_Size + ",";
    }

    for (var i = 0; i < nColor; i++) {
        ColorStr += ColorEDI[i].Buyer_Color + ",";
    }

    var obj = {
        Estilo: EstiloStr,
        Talla: TallaStr,
        Color: ColorStr
    };

    var frm = new FormData();
    frm.append("par", JSON.stringify(obj));
    var url = urlBase() + "EDI/EDI/ObtenerEstilloTallaColorMarmaxxERP";

    $.ajax({
        type: 'POST',
        data: frm,
        url: url,
        processData: false,
        contentType: false,
        async: false
    }).done(function (data) {
        LoadEstiloTallaColor(data);
    });

}

function LoadEstiloTallaColor(data) {

    if (data != "") {
        var JSONdata = JSON.parse(data);

        if (JSONdata[0].Estilo != "") {
            EstiloERP = JSON.parse(JSONdata[0].Estilo);
            var UnMappedStyles = EstiloERP.filter(item => { return item.IdEstilo === 0 });
            if (UnMappedStyles.length) {
                LoadUnMappedStyles(UnMappedStyles);
            }
        }

        if (JSONdata[0].Talla != "") {
            TallaERP = JSON.parse(JSONdata[0].Talla);
            var UnMappedSizes = TallaERP.filter(item => { return item.IdClienteTalla === 0 });
            if (UnMappedSizes.length) {
                LoadUnMappedSizes(UnMappedSizes);
            }
        }

        if (JSONdata[0].Color != "") {
            ColorERP = JSON.parse(JSONdata[0].Color);
            var UnMappedColors = ColorERP.filter(item => { return item.IdClienteColor === 0 });
            if (UnMappedColors.length) {
                LoadUnMappedColors(UnMappedColors);
            }
        }
    }

}

function LoadUnMappedSizes(Sizes) {

    var nSizes = Sizes.length;
    var htmlSize = "";
    htmlSize += "<table id='tblColor' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Code</th><th>Order</th></tr></thead>";
    htmlSize += "<tbody>";

    for (var i = 0; i < nSizes; i++) {
        htmlSize += "<tr class='RowSize'>";
        htmlSize += "<td><input type='checkbox' /></td>";
        htmlSize += "<td>" + Sizes[i].Talla + "</td>";
        htmlSize += "<td><input type='text' class='form-control' style='width=100px'/></td>";
        htmlSize += "</tr>";
    }

    htmlSize += "</tbody></table>";
    $("#divSize").empty();
    $("#divSize").append(htmlSize);

}

function LoadUnMappedColors(Colors) {

    var nColors = Colors.length;
    var htmlColor = "";
    htmlColor += "<table id='tblColor' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Code</th><th>Name</th></tr></thead>";
    htmlColor += "<tbody>";

    for (var i = 0; i < nColors; i++) {
        htmlColor += "<tr class='RowColor'>";
        htmlColor += "<td><input type='checkbox' /></td>";
        htmlColor += "<td>" + Colors[i].Color + "</td>";
        htmlColor += "<td><input type='text' class='form-control' style='width=150px'/></td>";
        htmlColor += "</tr>";
    }

    htmlColor += "</tbody></table>";
    $("#divColor").empty();
    $("#divColor").append(htmlColor);

}

function LoadUnMappedStyles(Styles) {

    var nStyles = Styles.length;

    var htmlStyles = "";
    htmlStyles += "<table id='tblStyle' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Style</th><th>Description</th><th>Fabric</th></tr></thead>";
    htmlStyles += "<tbody>";
    for (var i = 0; i < nStyles; i++) {
        htmlStyles += "<tr class='RowStyle'>";
        htmlStyles += "<td><input type='checkbox' /></td>";
        htmlStyles += "<td>" + Styles[i].Estilo + "</td>";
        htmlStyles += "<td><textarea class='form-control'></textarea></td>";
        htmlStyles += "<td><input type='text' class='form-control TelasFilter' id='txtTelas' data-list='dtTelas' name='txtTelas' data-value='0' onblur='ValidateFabric(this);' autocomplete='off' /></td>";//<input type="text" name="search" id="search"  placeholder="type 'r'" list="searchresults" autocomplete="off" />
        htmlStyles += "</tr>";
    }

    htmlStyles += "</tbody></table>";
    $("#cboFamilia")[0].selectedIndex = 0;
    $("#divStyle").empty();
    $("#divStyle").append(htmlStyles);

}

function LoadData() {

    var JSONdata = DataEDI;
    var Group = GroupBy(JSONdata, "Purchase_Order_ID,PO_Number,PO_Order_Date,Request_Ship_Date,Cancel_After_Date,ShipTo_Code,Vendor_Style,Buyer_Style,Buyer_Color,Unit_Price,Inner_Per_Pack,Nested_Alpha_Code,Address_Information,ShipTo_Name,Department_Code,Division_Code,Vendor_Code,Category,Point_Of_Entry_Flag,Store_Ready_Flag,Pre_Ticket_Flag");

    TallaEDI = GroupBy(JSONdata, "Buyer_Size");
    var nTalla = TallaEDI.length;
    EstiloEDI = GroupBy(Group, "Vendor_Style");
    ColorEDI = GroupBy(JSONdata, "Buyer_Color");

    //EstiloERP = new Array();
    //TallaERP = new Array();
    //ColorERP = new Array();
    //DireccionERP = new Array();

    GetEstiloTallaColor();

    var GroupPrices = GroupBy(JSONdata, "Vendor_Style,Address_Information");
    var nGroupPrices = GroupPrices.length;
    var htmlPrice = "";
    htmlPrice += "<table id='tblFtyPrice' class='table table-fixed table-striped table-bordered table-hover dataTables-example dataTable dtr-inline'><thead><tr><th>Style</th><th>Label</th><th>Fty Price</th></tr></thead>";
    htmlPrice += "<tbody>";
    for (var i = 0; i < nGroupPrices; i++) {
        htmlPrice += "<tr>";
        htmlPrice += "<td>" + GroupPrices[i].Vendor_Style + "</td>";
        htmlPrice += "<td>" + GroupPrices[i].Address_Information + "</td>";
        htmlPrice += "<td><input type='text' class='FtyPrice' style='width:70px;' data-styletbl='" + GroupPrices[i].Vendor_Style + "' data-labeltbl='" + GroupPrices[i].Address_Information + "' /></td>";
        htmlPrice += "</tr>";
    }
    htmlPrice += "</tbody></table>";
    $("#divFtyPrice").empty();
    $("#divFtyPrice").append(htmlPrice);

    $('#tblFtyPrice').DataTable({
        paging: false
    });

    var nGroup = Group.length;
    //<div id='dtCancelAfterDate' class='input-group date' style='width:150px;'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div>
    var html = "";
    var htmlHeader = "<table style='width:100%' id='tblPO' class='table table-fixed table-striped table-bordered table-hover dataTables-example dataTable dtr-inline stripe'><thead><tr class='dataHeader'><th><input type='checkbox' onclick='CheckAll(this)' data-check='chkRow' /></th><th>#</th><th class='sorting'>PO</th><th class='sorting'>PO DC</th><th>Vendor Style</th><th>Buyer Style</th><th>DC</th><th>Label</th><th>Price</th><th>Fty Price</th><th style='display:none;'><span>PO Order Date</span><div class='input-group date' id='dtPoOrderDate' style='width:150px;'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th class='sorting_asc' style='display:none;'><span>Request Ship Date</span><span class='footable-sort-indicator'></span><div id='dtRequestShipDate' style='width:150px;' class='input-group date'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th><span>Cancel Date</span></th><th style='display:none;'>DepartmentCode</th><th style='display:none;'>ShipTo</th><th style='display:none;'>DivisionCode</th><th style='display:none;'>VendorCode</th><th style='display:none;'>InnerPerPack</th><th style='display:none;'>Category</th><th style='display:none;'>BuyerStyle</th><th style='display:none;'>PointEntryFlag</th><th style='display:none;'>StoreReadyFlag</th><th style='display:none;'>PreTicketFlag</th><th style='display:none;'>IdEstilo</th><th style='display:none;'>IdClienteColor</th><th style='display:none;'>DC</th><th>Buyer Color</th>";
    //var htmlHeader = "<tr class='dataHeader'><th><input type='checkbox' onclick='CheckAll(this)' data-check='chkRow' /></th><th>#</th><th class='sorting'>PO</th><th class='sorting'>PO DC</th><th>Vendor Style</th><th>Buyer Style</th><th>DC</th><th>Label</th><th>Price</th><th>Fty Price</th><th style='display:none;'><span>PO Order Date</span><div class='input-group date' id='dtPoOrderDate' style='width:150px;'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th class='sorting_asc' style='display:none;'><span>Request Ship Date</span><span class='footable-sort-indicator'></span><div id='dtRequestShipDate' style='width:150px;' class='input-group date'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th><span>Cancel Date</span></th><th style='display:none;'>DepartmentCode</th><th style='display:none;'>ShipTo</th><th style='display:none;'>DivisionCode</th><th style='display:none;'>VendorCode</th><th style='display:none;'>InnerPerPack</th><th style='display:none;'>Category</th><th style='display:none;'>BuyerStyle</th><th style='display:none;'>PointEntryFlag</th><th style='display:none;'>StoreReadyFlag</th><th style='display:none;'>PreTicketFlag</th><th style='display:none;'>IdEstilo</th><th style='display:none;'>IdClienteColor</th><th style='display:none;'>DC</th><th>Buyer Color</th>";
    var htmlBody = "<tbody>";
    //htmlBody = "";
    for (var i = 0; i < nTalla; i++) {
        htmlHeader += "<th style='width:50px;'>" + TallaEDI[i].Buyer_Size + "</th>";
    }
    htmlHeader += "</tr>";

    //htmlHeader = "<tr><th>Col1</th><th>Col2</th><th>Col3</th><th>Col4</th><th>Col5</th><th>Col6</th><th>Col7</th></tr>";
    //htmlBody = "<tr><td>Col1</td><td>Col2</td><td>Col3</td><td>Col4</td><td>Col5</td><td>Col6</td><td>Col7</td></tr>";


    for (var i = 0; i < nGroup; i++) {

        var objEstilo = EstiloERP.filter(item => { return item.Estilo.trim() === Group[i].Vendor_Style.trim() });
        var objColor = ColorERP.filter(item => { return item.Color.trim() === Group[i].Buyer_Color.trim() });
        var objDireccion = DireccionERP.filter(item => { return item.DC.trim() === Group[i].ShipTo_Code.trim() });
        
        var IdEstilo = 0;
        var IdClienteColor = 0;
        var IdClienteDireccion = 0;

        if (objEstilo[0] != undefined) {
            IdEstilo = objEstilo[0].IdEstilo;
        }

        if (objColor[0] != undefined) {
            IdClienteColor = objColor[0].IdClienteColor;
        }

        if (objDireccion[0] != undefined) {
            IdClienteDireccion = objDireccion[0].IdClienteDireccion;
        }

        htmlBody += "<tr class='dataRow'>";
        htmlBody += "<td><input type='checkbox' class='chkRow' /></td>";
        htmlBody += "<td class='dataPO text' data-name='PurchaseOrderId'>" + Group[i].Purchase_Order_ID + "</td>";
        htmlBody += "<td class='dataPO text' data-name='Po'>" + Group[i].PO_Number.substring(2, Group[i].PO_Number.length) + "</td>";
        htmlBody += "<td class='dataPO text' data-name='PoDc'>" + Group[i].PO_Number + "</td>";
        htmlBody += "<td class='dataPO text' data-name='VendorStyle'>" + Group[i].Vendor_Style + "</td>";
        htmlBody += "<td class='dataPO text' data-name='BuyerStyle'>" + Group[i].Buyer_Style + "</td>";
        htmlBody += "<td class='dataPO text' data-name='Dc'>" + Group[i].ShipTo_Code + "</td>";
        htmlBody += "<td class='dataPO text' data-name='Label'>" + Group[i].Address_Information + "</td>";
        htmlBody += "<td class='dataPO text' data-name='ClientPrice'>" + Group[i].Unit_Price + "</td>";
        htmlBody += "<td class='dataPO input' data-name='FactoryPrice'><input type='text' class='Fty" + Group[i].Vendor_Style + "' onkeypress='return DigitimosDecimales(event,this);' style='width:70px;' data-style='" + Group[i].Vendor_Style + "' data-label='" + Group[i].Address_Information + "' value='0' ></td>";
        htmlBody += "<td class='dataPO text PoOrderDate' style='display:none;' data-name='PoOrderDate'>" + Group[i].PO_Order_Date + "</td>";
        htmlBody += "<td class='dataPO text RequestShipDate' style='display:none;' data-name='RequestShipDate'>" + Group[i].Request_Ship_Date + "</td>";
        htmlBody += "<td class='dataPO text CancelAfterDate' data-name='CancelAfter'>" + Group[i].Cancel_After_Date + "</td>";
        htmlBody += "<td class='dataPO text' data-name='BuyerColor'>" + Group[i].Buyer_Color + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='Buyer'>" + Group[i].ShipTo_Name + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='DepartmentCode'>" + Group[i].Department_Code + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='DivisionCode'>" + Group[i].Division_Code + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='VendorCode'>" + Group[i].Vendor_Code + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='InnerPerPack'>" + Group[i].Inner_Per_Pack + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='Category'>" + Group[i].Category + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='BuyerStyle'>" + Group[i].Buyer_Style + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='PointEntryFlag'>" + Group[i].Point_Of_Entry_Flag + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='StoreReadyFlag'>" + Group[i].Store_Ready_Flag + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='PreTicketFlag'>" + Group[i].Pre_Ticket_Flag + "</td>";

        htmlBody += "<td class='dataPO text' style='display:none;' data-name='IdEstilo'>" + IdEstilo + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='IdClienteColor'>" + IdClienteColor + "</td>";
        htmlBody += "<td class='dataPO text' style='display:none;' data-name='IdClienteDireccion'>" + IdClienteDireccion + "</td>";

        for (var x = 0; x < nTalla; x++) {
            var obj = JSONdata.filter(function (e) { return (e.Purchase_Order_ID === Group[i].Purchase_Order_ID && e.Vendor_Style === Group[i].Vendor_Style && e.Buyer_Color === Group[i].Buyer_Color && e.Buyer_Size === TallaEDI[x].Buyer_Size) });
            if (obj[0] != null) {

                var objTalla = TallaERP.filter(item => { return item.Talla.trim() === TallaEDI[x].Buyer_Size });
                var IdClienteTalla = 0;
                
                if (objTalla[0] != undefined) {
                    IdClienteTalla = objTalla[0].IdClienteTalla;
                }

                htmlBody += "<td><input class='Quantity' onkeypress='return DigitimosDecimales(event,this);' data-id='" + Group[i].Purchase_Order_ID + "' data-style='" + Group[i].Vendor_Style + "' data-color='" + Group[i].Buyer_Color + "' style='width:50px;' data-ratio='" + obj[0].Size_Ratio + "' data-size='" + TallaEDI[x].Buyer_Size + "' data-idclientetalla='" + IdClienteTalla + "' value='" + obj[0].Quantity_Ordered + "'  /></td>";
            } else {
                htmlBody += "<td>0</td>";
            }
        }
        htmlBody += "</tr>";
    }


    //$("#tblhdPOEDI").empty();
    //$("#tblhdPOEDI").append(htmlHeader);

    //$("#tblbdyPOEDI").empty();
    //$("#tblbdyPOEDI").append(htmlBody);
    //var TotalColumns = parseInt(26 + nTalla);
    //var htmlFoot = "<tr><td colspan='" + TotalColumns + "'><ul class='pagination pull-right'></ul></td></tr>";

    //$("#tblftPOEDI").empty();
    //$("#tblftPOEDI").append(htmlFoot);

    //$('.footable').footable();
    //$('.footable').trigger('footable_resize');

    htmlBody += "</tbody></table>";


    var html = htmlHeader + htmlBody;
    $("#divTableContent").empty();
    $("#divTableContent").append(html);

    //$('.footable').trigger('footable_resize');

    $('#tblPO').DataTable({
        paging: true,
        fixedHeader: true,
        "scrollY": 400,
        "scrollX": true,
        scrollCollapse: true//,
        //fixedColumns: {
        //    leftColumns: 5
        //}
    });

    $("#dtPoOrderDate").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });
    $("#dtPoOrderDate").on("dp.change", function (e) {
        var date = $(this).data("DateTimePicker").date();
        var date = moment(date).format('DD/MM/YYYY');
        $(".PoOrderDate").each(function () {
            if ($($(this).parent()[0].cells[0]).find("input").is(':checked')) {
                $(this).text(date);
            }
        });
    });

    $("#dtRequestShipDate").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });
    $("#dtRequestShipDate").on("dp.change", function (e) {
        //var chk = $($(this).parent().parent()[0].cells[0]).find("input").is(':checked');
        //alert(chk);
        var date = $(this).data("DateTimePicker").date();
        var date = moment(date).format('DD/MM/YYYY');
        $(".RequestShipDate").each(function () {
            if ($($(this).parent()[0].cells[0]).find("input").is(':checked')) {
                $(this).text(date);
            }
        });
    });
    $("#dtCancelAfterDate").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment(),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });
    $("#dtCancelAfterDate").on("dp.change", function (e) {
        var date = $(this).data("DateTimePicker").date();
        var date = moment(date).format('DD/MM/YYYY');
        $(".CancelAfterDate").each(function () {
            if ($($(this).parent()[0].cells[0]).find("input").is(':checked')) {
                $(this).text(date);
            }
        });
    });

}

function CheckAll(obj) {
    var checksClss = $(obj).attr("data-check");
    var checked = $(obj).is(':checked');
    $("." + checksClss).each(function () {
        if (checked) {
            $(this).prop('checked', true)
        } else {
            $(this).prop('checked', false)
        }
    });
}

function _filter_mulptile(alist, ofilter) {
    let x = 0, aresult = [],
     names = Object.keys(ofilter), count_filter = names != null ? names.length : 0, count_equal = 0;

    if (ofilter != null && (names != null && names.length > 0)) {
        alist.forEach(function (item) {
            count_equal = 0;
            names.some(function (name) {
                if (item[name].trim().toLowerCase() == ofilter[name].trim().toLowerCase()) {
                    count_equal++;
                    if (count_equal == count_filter) {
                        aresult.push(item);
                        return true;
                    }
                }
            });
        });
    }
    x = null; names = null; count_filter = null;
    return aresult;
}

function GroupBy(array, fields) {
    var Fields = fields.split(',');
    var FieldsLen = Fields.length;
    var ArrayLen = array.length;
    var Group = new Array();
    var GroupLen = 0;
    var Existe = false;
    var cont = 0;
    for (var i = 0; i < ArrayLen; i++) {

        var RowObj = array[i];
        var Obj = {}

        if (i == 0) {
            for (var x = 0; x < FieldsLen; x++) {
                Obj[Fields[x]] = RowObj[Fields[x]];
            }
            Group.push(Obj);

        } else {
            for (var x = 0; x < FieldsLen; x++) {
                Obj[Fields[x]] = RowObj[Fields[x]];
            }
            GroupLen = Group.length;

            for (var z = 0; z < GroupLen; z++) {
                var GroupRowObj = Group[z];
                cont = 0;
                for (var x = 0; x < FieldsLen; x++) {
                    if (Obj[Fields[x]] == GroupRowObj[Fields[x]]) {
                        Existe = true;
                        cont++;
                    } else {
                        Existe = false;
                    }
                }
                if (Existe && FieldsLen == cont) {
                    break;
                } else {
                    Existe = false;
                }
            }
            if (!Existe) {
                Group.push(Obj);
            }
        }

    }
    return Group;
}
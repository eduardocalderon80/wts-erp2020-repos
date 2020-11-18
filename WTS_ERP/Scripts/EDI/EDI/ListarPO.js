var Tallas = null;
var Styles = null;
var ColorNoMapeado = null;
var TallaNoMapeado = null;
var TallaCliente = null;
var ColorCliente = null;
var DireccionCliente = null;
var TelasDL = null;

$(document).ready(function () {
    $("#btnExportar").click(function () {
        var data = GetData();
        data = Tallas + "," + data;
        var frm = new FormData();
        frm.append("par", data);

        Post('EDI/EDI/BuildExcel', frm, DownloadPO);
    });
    $("#btnSaveFtyPrice").click(function () {
        SaveFtyPrice();
        $("#btnCloseFtyPrice").click();
    });
    $("#cboFamilia").change(function () {
        LoadYarn($(this).val());
    });
    $("#btnSaveStyle").click(function () {
        SaveBulkStyle();
        //$("#btnCloseStyle").click();
        //ValidarEstilos();
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

    $("#btnEnviarASN").click(function () {
        SaveASN();
    });

    $("#btnSaveColor").click(function () {
        SaveColor();
    });

    $("#btnSaveTalla").click(function () {
        SaveSize();
    });

    CargarDatos();

    //search.addEventListener('keyup', function handler(event) {
    //    while (results.children.length) results.removeChild(results.firstChild);
    //    var inputVal = new RegExp(search.value.trim(), 'i');
    //    var set = Array.prototype.reduce.call(templateContent.cloneNode(true).children, function searchFilter(frag, item, i) {
    //        if (inputVal.test(item.textContent) && frag.children.length < 6) frag.appendChild(item);
    //        return frag;
    //    }, document.createDocumentFragment());
    //    results.appendChild(set);
    //});

});
function CargarDatos() {
    Get('EDI/EDI/ObtenerDatosMarmaxx', ObtenerDatosMarmaxx);

}
function SaveASN() {
    var frm = new FormData();
    var IdPackingList = $("#txtPackingList").val();
    frm.append("IdPackingList", IdPackingList);
    Post('EDI/EDI/SendASN', frm, Alerta);
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
                Codigo: Codigo,
                Nombre: Nombre
            }
            Color.push(obj);
            Cont++;
        }

    });
    if (ContError > 0) {
        alert("Please enter Color Name");
    } else {
        var frm = new FormData();
        frm.append("Color", JSON.stringify(Color));
        Post('EDI/EDI/SaveColor', frm, Alerta);
    }
    //alert(JSON.stringify(Color));

}
function SaveSize() {

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

    if (Fabrica == "") {
        alert("Select Factory");
        return;
    }
    if (Divsion == "") {
        alert("Select Division");
        return;
    }
    if (Temporada == "") {
        alert("Select Season");
        return;
    }
    if (TipoPrecio == "") {
        alert("Select Price Type");
        return;
    }
    if (Freight == "") {
        alert("Select Freight");
        return;
    }
    if (Shipment == "") {
        alert("Select Shipment");
        return;
    }
    if (Forwarder == "") {
        alert("Select Forwarder");
        return;
    }
    if (FactoryDate == "") {
        alert("Select FactoryDate");
        return;
    }
    if (ClientDate == "") {
        alert("Select ClientDate");
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
            //Obj["Qty"] = 0;
            //Obj["Size"] = "";
            //Obj["Ratio"] = 0;
            //oData = Obj;
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
                let valor = $(this).val();
                if (parseInt(valor) <= 0) {
                    contError++;
                }



                let ObjNew = _filter_mulptile(Data, { PurchaseOrderId: PurchaseOrderId, BuyerColor: color, VendorStyle: vendorStyle })[0];
                ////var Obj = new Object(ObjNew);
                ////let Obj = Object.create(ObjNew);
                //let Obj = Object.assign(ObjNew);
                //Obj["Size"] = size;
                //Obj["Qty"] = valor;
                //Obj["Ratio"] = ratio;
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
                    BuyerStyle: ObjNew.BuyerStyle,
                    Category: ObjNew.Category,
                    FactoryDate: FactoryDate,
                    ClientDate: ClientDate
                };
                DataConTalla.push(Obj);
                //DataConTalla[Index]["Size"] = size;
                //DataConTalla[Index]["Qty"] = valor;
                //DataConTalla[Index]["Ratio"] = ratio;
                //ObjNew.Size = size;
                //ObjNew.Qty = valor;
                //ObjNew.Ratio = ratio;

            }
        });

        if (contError > 0) {
            alert('Please enter Qty');
            return;
        }

        var nDataConTalla = DataConTalla.length;

        if (nDataConTalla > 0) {
            var Pos = GroupBy(DataConTalla, "Po,RequestShipDate,Label,DepartmentCode,DivisionCode,VendorCode,Buyer");


            var nPos = Pos.length;
            if (nPos > 0) {

                var Lotes = GroupBy(DataConTalla, "Po,PoDc,VendorStyle,Dc,Label,ClientPrice,FactoryPrice,PoOrderDate,RequestShipDate,CancelAfter,Buyer");

                // Asignar IdPo Identity
                var cont = 1;
                for (var i = 0; i < nPos; i++) {
                    Pos[i]["IdPo"] = i + 1;
                    Pos[i]["Temporada"] = Temporada;
                    Pos[i]["Shipment"] = Shipment;
                    var lot = Lotes.filter(function (e) { return (e.Po === Pos[i].Po) });
                    var nlot = lot.length;
                    for (var x = 0; x < nlot; x++) {

                        var objDireccion = DireccionCliente.filter(function (e) { return (e.DC.trim() == lot[x].Dc.trim()) });
                        lot[x]["Lote"] = cont;
                        lot[x]["IdPo"] = i + 1;
                        lot[x]["Division"] = Divsion;
                        lot[x]["Fabrica"] = Fabrica;
                        lot[x]["TipoPrecio"] = TipoPrecio;
                        lot[x]["Freight"] = Freight;
                        lot[x]["Shipment"] = Shipment;
                        lot[x]["Forwarder"] = Forwarder;
                        lot[x]["FactoryDate"] = FactoryDate;
                        lot[x]["ClientDate"] = ClientDate;
                        lot[x]["Direccion"] = objDireccion[0].Cod_Direccion;
                        lot[x]["Destino"] = objDireccion[0].Cod_destino;
                        lot[x]["StoreReadyFlag"] = "Y";
                        lot[x]["PreTicket"] = "Y";
                        lot[x]["PointEntryFlag"] = "N";

                        cont++;
                        if (parseFloat(lot[x].FactoryPrice) <= 0) {
                            contError++;
                        }

                    }
                    Pos[i]["UltimoLote"] = cont - 1;
                    cont = 1;
                }
                if (contError > 0) {
                    alert('Please enter Factory Price');
                    return;
                }

                // Asignar IdPo a tabla Detalle Talla Color

                for (var i = 0; i < nDataConTalla; i++) {
                    var obj = Lotes.filter(function (e) { return (e.Po === DataConTalla[i].Po && e.Dc === DataConTalla[i].Dc && e.VendorStyle === DataConTalla[i].VendorStyle) });
                    DataConTalla[i]["IdPo"] = obj[0].IdPo;
                    DataConTalla[i]["Lote"] = obj[0].Lote;
                    DataConTalla[i]["Destino"] = obj[0].Destino;
                }

                var cantidadLote = 0;
                var innerperpack = 0;

                var nLotes = Lotes.length;

                for (var i = 0; i < nLotes; i++) {
                    var obj = DataConTalla.filter(function (e) { return (e.IdPo === Lotes[i].IdPo && e.Lote === Lotes[i].Lote) });
                    var nobj = obj.length;
                    for (var x = 0; x < nobj; x++) {
                        cantidadLote += parseInt(obj[x].Qty);
                        innerperpack += parseInt(obj[x].Ratio);
                    }
                    Lotes[i]["Qty"] = cantidadLote;
                    Lotes[i]["InnerPerPack"] = innerperpack;
                    var cajas = parseInt(cantidadLote / innerperpack);
                    Lotes[i]["Comentario"] = "ESTA ORDEN PERTENECE A " + Lotes[i].Buyer + " // EMPAQUE STORE READY: " + innerperpack + "x" + cajas + " // LLEVA ETIQUETA DE MARCA Y HANG TAG " + Lotes[i].Label + ".";
                    cantidadLote = 0;
                    innerperpack = 0;
                }


                // Ids 

                var PosEdi = GroupBy(DataConTalla, "PurchaseOrderId");
                var nPosEdi = PosEdi.length;
                var poediStr = "";
                for (var i = 0; i < nPosEdi; i++) {
                    poediStr += PosEdi[i].PurchaseOrderId + ",";
                }
                poediStr = poediStr.substring(0, poediStr.length - 1);


                //$("#divTexto").append(JSON.stringify(Pos));
                //$("#divTexto").append(JSON.stringify(Lotes));
                //$("#divTexto").append(JSON.stringify(DataConTalla));
                //$("#divTexto").append(JSON.stringify(poediStr));
                //return;

                var frm = new FormData();
                frm.append("po", JSON.stringify(Pos));
                frm.append("lote", JSON.stringify(Lotes));
                frm.append("tallacolor", JSON.stringify(DataConTalla));
                frm.append("poedi", poediStr);
                Post('EDI/EDI/SavePO', frm, AlertaSavePO);

            }


        }
    }



}
function SaveBulkStyle() {
    var Style = new Array();
    var oStyle = {
        cod_estcli: "",
        numverstyl: "",
        dest_estcli: "",
        cod_temcli: "",
        des_tela: "",
        cod_tela: ""
    }


    var cod_temcli = $("#cboSeason").val();
    if (cod_temcli == "") {
        alert('Select a Season');
        return;
    }

    var cod_famtela = $("#cboFamilia").val();
    if (cod_famtela == "") {
        alert('Select a Family');
        return;
    }


    $(".RowStyle").each(function () {
        if ($(this.cells[0]).find("input").is(':checked')) {
            var cod_tela = $(this.cells[3]).find("input").val();

            var item = TelasDL.filter(item => { return item.Cod_Tela.trim().toUpperCase() === cod_tela.trim().toUpperCase() });

            if (item.length > 0) {
                //var des_tela = $(this.cells[3]).find("select").find('option:selected').text();
                var oStyle = {
                    cod_estcli: $(this.cells[1]).text(),
                    numverstyl: "01",
                    dest_estcli: $(this.cells[2]).find("textarea").val(),
                    cod_temcli: cod_temcli,
                    des_tela: item[0].Des_Tela,
                    cod_tela: item[0].Cod_Tela//  cod_tela
                }
                Style.push(oStyle);
            }


        }
    });

    if (Style.length) {
        var frm = new FormData();
        frm.append("par", JSON.stringify(Style));
        Post('EDI/EDI/SaveStyles', frm, Alerta);

        $("#btnCloseStyle").click();
        ValidarEstilos();

    } else {
        alert('Please select an Style');
    }

}
function AlertaSavePO(data) {
    var rpta = JSON.parse(data);
    alert(rpta.mensaje);
    if (rpta.estado == "success") {
        CargarDatos();
    }
}

function Alerta(data) {
    var rpta = JSON.parse(data);
    alert(rpta.mensaje);
}

function LoadYarn(Familia) {
    var frm = new FormData();
    frm.append("par", Familia);
    Post('EDI/EDI/ObtenerTelaPorFamilia', frm, FillYarn);
}

function FillYarn(data) {
    var JSONdata = JSON.parse(data);
    TelasDL = null;
    TelasDL = JSONdata;
    var cboYarn = "";//"<option>Select</option>";
    cboYarn += _comboFromJSON(JSONdata, "Cod_Tela", "Des_Tela");

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

function ValidateTela(obj) {
    var value = $(obj).val();
    if (value != "") {
        if (TelasDL != null) {
            var item = TelasDL.filter(item => { return item.Cod_Tela.trim().toUpperCase() === value.trim().toUpperCase() });
            if (item.length == 0) {
                $(obj).val("");
                input.attr('list', '');
            }
        } else {
            $(obj).val("");
            input.attr('list', '');
        }
    }
}



function ObtenerDatosMarmaxx(data) {
    var JSONdata = JSON.parse(data);
    var Fabrica = JSON.parse(JSONdata[0].Fabrica);
    var Temporada = JSON.parse(JSONdata[0].Temporada);
    var Division = JSON.parse(JSONdata[0].Division);
    var Forwarder = JSON.parse(JSONdata[0].Forwarder);
    var Familia = JSON.parse(JSONdata[0].Familia);
    var Color = JSON.parse(JSONdata[0].Color);
    var Talla = JSON.parse(JSONdata[0].Talla);
    var Direccion = JSON.parse(JSONdata[0].Direccion);

    var cboFabrica = "<option value=''>Select</option>" + _comboFromJSON(Fabrica, "Cod_Fabrica", "Nom_Fabrica");
    var cboTemporada = "<option value=''>Select</option>" + _comboFromJSON(Temporada, "cod_temcli", "Nom_TemCli");
    var cboDivision = "<option value=''>Select</option>" + _comboFromJSON(Division, "cod_divcli", "Nom_divcli");
    var cboForwarder = "<option value=''>Select</option>" + _comboFromJSON(Forwarder, "idforwarder", "nombre");
    var cboFamilia = "<option value=''>Select</option>" + _comboFromJSON(Familia, "cod_famTela", "des_famtela");

    DireccionCliente = Direccion;
    TallaCliente = Talla;
    ColorCliente = Color;

    $("#cboFactory").empty();
    $("#cboSeason").empty();
    $("#cboDivision").empty();
    $("#cboForwarder").empty();
    $("#cboFamilia").empty();
    $("#cboFactory").append(cboFabrica);
    $("#cboSeason").append(cboTemporada);
    $("#cboDivision").append(cboDivision);
    $("#cboForwarder").append(cboForwarder);
    $("#cboFamilia").append(cboFamilia);

    Get('EDI/EDI/POPendiente', LoadData);

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
function DownloadPO(data) {
    var url = urlBase() + "EDI/EDI/DownloadPO?filename=" + data;
    var link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
function GetData() {
    var Data = "";
    var nCells = 0

    $(".dataHeader").each(function () {
        nCells = this.cells.length;
        for (var i = 1; i < nCells; i++) {
            if ($(this.cells[i]).has("span").length) {
                Data += $(this.cells[i]).find("span").text() + "|";
            } else {
                Data += this.cells[i].innerHTML + "|";
            }
        }
        Data += "*";
    });
    $(".dataRow").each(function () {
        nCells = this.cells.length;
        for (var i = 1; i < nCells; i++) {
            if ($(this.cells[i]).has("input").length) {
                Data += $(this.cells[i]).find("input").val() + "|";
            } else {
                Data += this.cells[i].innerHTML + "|";
            }
        }
        Data += "*";
    });
    Data = Data.substring(0, Data.length - 1);
    return Data;
}
function LoadStyles(data) {
    if (data != "" || data != null) {
        var JSONdata = JSON.parse(data);
        var nJSONdata = JSONdata.length;
        var nStyles = Styles.length;

        var StylesNoCreados = new Array();
        for (var i = 0; i < nStyles; i++) {
            var item = JSONdata.find(item => { return item.cod_estcli.trim() === Styles[i].Vendor_Style.trim() });
            if (item == undefined) {
                StylesNoCreados.push(Styles[i].Vendor_Style);
            }
        }
        if (StylesNoCreados.length) {
            var htmlStyles = "";
            htmlStyles += "<table id='tblStyle' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Style</th><th>Description</th><th>Fabric</th></tr></thead>";
            htmlStyles += "<tbody>";
            for (var i = 0; i < StylesNoCreados.length; i++) {
                htmlStyles += "<tr class='RowStyle'>";
                htmlStyles += "<td><input type='checkbox' /></td>";
                htmlStyles += "<td>" + StylesNoCreados[i] + "</td>";
                htmlStyles += "<td><textarea class='form-control'></textarea></td>";
                //htmlStyles += "<td><select class='form-control Yarn' style='width:150px;'><option value=''>Select</option></select></td>";
                htmlStyles += "<td><input type='text' class='form-control TelasFilter' id='txtTelas' data-list='dtTelas' name='txtTelas' onblur='ValidateTela(this);' autocomplete='off' /></td>";//<input type="text" name="search" id="search"  placeholder="type 'r'" list="searchresults" autocomplete="off" />
                htmlStyles += "</tr>";
            }
            htmlStyles += "</tbody></table>";
            $("#cboFamilia")[0].selectedIndex = 0;
            $("#divStyle").empty();
            $("#divStyle").append(htmlStyles);


            //$(".Yarn").each(function () {
            //    $(this).select2();
            //});
        }
    }
}
function ValidarEstilos() {

    var nStyles = Styles.length;
    var StrStyle = "";

    for (var i = 0; i < nStyles; i++) {
        StrStyle += Styles[i].Vendor_Style + ",";
    }

    StrStyle = StrStyle.substring(0, StrStyle.length - 1);

    var frm = new FormData();
    frm.append("par", StrStyle);

    Post('EDI/EDI/ObtenerEstilosCreados', frm, LoadStyles);
}
function ValidarColor(Color) {
    var nColor = Color.length;
    ColorNoMapeado = new Array();
    for (var i = 0; i < nColor; i++) {
        var item = ColorCliente.filter(item => { return item.Cod_ColCli.trim().toUpperCase() === Color[i].Buyer_Color.trim().toUpperCase() });
        if (item.length == 0) {
            ColorNoMapeado.push(Color[i].Buyer_Color.trim());
        }
    }
    var nColorNoMapeado = ColorNoMapeado.length;
    if (nColorNoMapeado > 0) {
        var htmlColor = "";
        htmlColor += "<table id='tblColor' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Code</th><th>Name</th></tr></thead>";
        htmlColor += "<tbody>";
        for (var i = 0; i < nColorNoMapeado; i++) {
            htmlColor += "<tr class='RowColor'>";
            htmlColor += "<td><input type='checkbox' /></td>";
            htmlColor += "<td>" + ColorNoMapeado[i] + "</td>";
            htmlColor += "<td><input type='text' class='form-control' style='width=150px'/></td>";
            htmlColor += "</tr>";
        }
        htmlColor += "</tbody></table>";
        $("#divColor").empty();
        $("#divColor").append(htmlColor);
    }

}
function ValidarTalla(Talla) {
    var nTalla = Talla.length;
    TallaNoMapeado = new Array();
    for (var i = 0; i < nTalla; i++) {
        var item = TallaCliente.filter(item => { return item.Cod_Talla.trim() === Talla[i].Buyer_Size.trim() });
        if (item.length == 0) {
            TallaNoMapeado.push(Color[i].Buyer_Color.trim());
        }
    }
    var nTallaNoMapeado = TallaNoMapeado.length;
    if (nTallaNoMapeado > 0) {
        var htmlSize = "";
        htmlSize += "<table id='tblColor' class='table table-fixed table-striped table-bordered table-hover'><thead><tr><th>Select</th><th>Code</th><th>Order</th></tr></thead>";
        htmlSize += "<tbody>";
        for (var i = 0; i < nTallaNoMapeado; i++) {
            htmlSize += "<tr class='RowSize'>";
            htmlSize += "<td><input type='checkbox' /></td>";
            htmlSize += "<td>" + TallaNoMapeado[i] + "</td>";
            htmlSize += "<td><input type='text' class='form-control' style='width=100px'/></td>";
            htmlSize += "</tr>";
        }
        htmlSize += "</tbody></table>";
        $("#divSize").empty();
        $("#divSize").append(htmlSize);
    }
}
function LoadData(data) {
    Tallas = "";
    var JSONdata = JSON.parse(data);
    var Talla = GroupBy(JSONdata, "Buyer_Size");
    var nTalla = Talla.length;
    var Group = GroupBy(JSONdata, "Purchase_Order_ID,PO_Number,PO_Order_Date,Request_Ship_Date,Cancel_After_Date,ShipTo_Code,Vendor_Style,Buyer_Style,Buyer_Color,Unit_Price,Inner_Per_Pack,Nested_Alpha_Code,Address_Information,ShipTo_Name,Department_Code,Division_Code,Vendor_Code,Category");
    var GroupStyle = GroupBy(JSONdata, "Vendor_Style");
    var nGroupStyle = GroupStyle.length;

    Styles = GroupStyle;

    var TallaEDI = Talla;
    var ColorEDI = GroupBy(JSONdata, "Buyer_Color");


    ValidarEstilos(GroupStyle);
    ValidarColor(ColorEDI);
    ValidarTalla(TallaEDI);


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
    var htmlHeader = "<table style='width:100%' id='tblPO' class='table table-fixed table-striped table-bordered table-hover dataTables-example dataTable dtr-inline stripe'><thead><tr class='dataHeader'><th><input type='checkbox' onclick='CheckAll(this)' data-check='chkRow' /></th><th>#</th><th class='sorting'>PO</th><th class='sorting'>PO DC</th><th>Vendor Style</th><th>Buyer Style</th><th>DC</th><th>Label</th><th>Price</th><th>Fty Price</th><th style='display:none;'><span>PO Order Date</span><div class='input-group date' id='dtPoOrderDate' style='width:150px;'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th class='sorting_asc' style='display:none;'><span>Request Ship Date</span><span class='footable-sort-indicator'></span><div id='dtRequestShipDate' style='width:150px;' class='input-group date'><span class='input-group-addon'><i class='fa fa-calendar'></i></span><input type='text' class='form-control'></div></th><th><span>Cancel Date</span></th><th style='display:none;'>DepartmentCode</th><th style='display:none;'>ShipTo</th><th style='display:none;'>DivisionCode</th><th style='display:none;'>VendorCode</th><th style='display:none;'>InnerPerPack</th><th style='display:none;'>Category</th><th style='display:none;'>BuyerStyle</th><th>Buyer Color</th>";
    var htmlBody = "<tbody>";
    for (var i = 0; i < nTalla; i++) {
        htmlHeader += "<th style='width:50px;'>" + Talla[i].Buyer_Size + "</th>";
        Tallas += Talla[i].Buyer_Size + "|";
    }
    for (var i = 0; i < nGroup; i++) {
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
        htmlBody += "<td class='dataPO input' data-name='FactoryPrice'><input type='text' class='Fty" + Group[i].Vendor_Style + "' style='width:70px;' data-style='" + Group[i].Vendor_Style + "' data-label='" + Group[i].Address_Information + "' value='0' ></td>";
        htmlBody += "<td  class='dataPO text PoOrderDate' style='display:none;' data-name='PoOrderDate'>" + Group[i].PO_Order_Date + "</td>";
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
        for (var x = 0; x < nTalla; x++) {
            var obj = JSONdata.filter(function (e) { return (e.Purchase_Order_ID === Group[i].Purchase_Order_ID && e.Vendor_Style === Group[i].Vendor_Style && e.Buyer_Color === Group[i].Buyer_Color && e.Buyer_Size === Talla[x].Buyer_Size) });
            if (obj[0] != null) {
                htmlBody += "<td><input class='Quantity' data-id='" + Group[i].Purchase_Order_ID + "' data-style='" + Group[i].Vendor_Style + "' data-color='" + Group[i].Buyer_Color + "' style='width:50px;' data-ratio='" + obj[0].Size_Ratio + "' data-size='" + Talla[x].Buyer_Size + "' value='" + obj[0].Quantity_Ordered + "'  /></td>";
            } else {
                htmlBody += "<td>0</td>";
            }
        }
        htmlBody += "</tr>";
    }
    htmlBody += "</tbody></table>";
    var html = htmlHeader + htmlBody;
    $("#divTableContent").empty();
    $("#divTableContent").append(html);

    $('#tblPO').DataTable({
        paging: false,
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
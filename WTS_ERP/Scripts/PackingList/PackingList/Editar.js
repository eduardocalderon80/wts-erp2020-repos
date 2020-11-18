var Data = null;
var PackingList = null;
var PackingListDetalle = null;
$(document).ready(function () {

    var id = parseInt($("#txtpar").val());
    
    Get('PackingList/PackingList/GetPL?par=' + id, LoadData);
    
    $("#btnSearch").click(function () {
        SearchPo();
    });
    $("#btnSave").click(function () {
        Save();
    });

});

function FillSelect(id, html) {
    $("#" + id).append(html);
}
function SearchPo() {
    var par = $("#cboFabrica").val() + "," + $("#cboCliente").val() + "," + $("#txtPo").val();
    var frm = new FormData();
    frm.append("par", par);
    Post('PackingList/PackingList/SearchPo', frm, LoadData);
}
function LoadData(data) {
    if (data != "") {

        Data = JSON.parse(data);
        PackingList = JSON.parse(Data[0].PackingList);
        PackingListDetalle = JSON.parse(Data[0].PackingListDetalle);

        if (PackingList != null && PackingListDetalle != null) {

            $("#txtCliente").val(PackingList[0].NombreCliente);
            $("#txtPo").val(PackingListDetalle[0].Codigo);
            $("#txtFabrica").val(PackingList[0].NombreProveedor);
            $("#hfIteracion").val(PackingList[0].Iteracion);
            $("#hfIdPackingList").val(PackingList[0].IdPackingList);
            $("#txtDestino").val(PackingList[0].Direccion);

            if (PackingList[0].IdTipo == "1") {
                LoadGarmentDetail(PackingListDetalle);
            } else {
                LoadOtherDetail(PackingListDetalle);
            }
        }
    }
}

function LoadGarmentDetail(data) {
            
        var nData = data.length;
        if (nData > 0) {

            var PoClienteEstiloColor = GroupBy(data, "IdPoClienteEstiloDestino,IdPoClienteEstilo,IdClienteColor,NombreClienteColor,Codigo,CodigoEstilo,NombreEstilo,Descripcion,IdEstilo,NombreEstado,IdTipoColor");
            var nPoClienteEstiloColor = PoClienteEstiloColor.length;
            var ClienteTalla = GroupBy(data, "IdClienteTalla,NombreClienteTalla");
            var nClienteTalla = ClienteTalla.length;
            var params = "";
            var htmlDetail = "<h4>Style:</h4>"
            htmlDetail += "<table class='table table-bordered'>";
            htmlDetail += "<thead>";
            htmlDetail += "<tr>";
            htmlDetail += "<th class='text-center'>Po</th>";
            htmlDetail += "<th class='text-center'>Style</th>";
            htmlDetail += "<th class='text-center'>Color Type</th>";
            htmlDetail += "<th class='text-center'>Color</th>";
            for (var i = 0; i < nClienteTalla; i++) {
                htmlDetail += "<th class='text-center'>" + ClienteTalla[i].NombreClienteTalla + "</th>";
            }
            htmlDetail += "</tr>";
            htmlDetail += "</thead>";
            htmlDetail += "<tbody>";

            for (var i = 0; i < nPoClienteEstiloColor; i++) {
                htmlDetail += "<tr>";
                htmlDetail += "<th class='text-center'>" + PoClienteEstiloColor[i].Codigo + "</th>";
                htmlDetail += "<th class='text-center'>" + PoClienteEstiloColor[i].CodigoEstilo + "</th>";
                htmlDetail += "<th class='text-center'>" + PoClienteEstiloColor[i].NombreEstado + "</th>";
                htmlDetail += "<th class='text-center'>" + PoClienteEstiloColor[i].NombreClienteColor + "</th>";
                for (var x = 0; x < nClienteTalla; x++) {
                    var obj = data.filter(function (e) { return (e.IdPoClienteEstiloDestino === PoClienteEstiloColor[i].IdPoClienteEstiloDestino && e.IdClienteColor === PoClienteEstiloColor[i].IdClienteColor && e.IdTipoColor === PoClienteEstiloColor[i].IdTipoColor && e.IdClienteTalla === ClienteTalla[x].IdClienteTalla) })[0];
                    if (obj != null) {
                        params = obj.IdCliente + "," + obj.IdProveedor + "," + obj.IdPoCliente + "," + obj.IdPoClienteEstilo + "," + obj.IdPoClienteEstiloDestino + ","
                            + obj.IdPoClienteEstiloDestinoTallaColor + "," + obj.IdClienteColor + ","
                            + obj.IdTipoColor + "," + obj.IdClienteTalla + "," + obj.Cantidad + "," + obj.IdClienteDireccion;
                        var qty = parseInt(obj.Cantidad) - parseInt(obj.CantidadDespachada);
                        htmlDetail += "<th class='text-center'><input type='text' class='form-control pkqty' data-params='" + params + "' value='" + parseInt(obj.CantidadDespachadaPL) + "' placeholder='" + parseInt(obj.CantidadDespachada) + "' onkeypress='return DigitimosDecimales(event,this);' /></th>";
                    } else {
                        htmlDetail += "<th class='text-center'></th>";
                    }
                }
                htmlDetail += "</tr>";
            }
            htmlDetail += "</tbody>";
            htmlDetail += "</table>";
            $("#divDetalle").empty();
            $("#divDetalle").append(htmlDetail);
        }
    
}

function LoadOtherDetail(data) {
    
    var nData = data.length;
        if (nData > 0) {
            var params = "";
            var htmlDetail = "<h4>Product:</h4>"
            htmlDetail += "<table class='table table-bordered'>";
            htmlDetail += "<thead>";
            htmlDetail += "<tr>";
            htmlDetail += "<th class='text-center'>Po</th>";
            htmlDetail += "<th class='text-center'>Code</th>";
            htmlDetail += "<th class='text-center'>Name</th>";
            htmlDetail += "<th class='text-center'>Description</th>";
            htmlDetail += "<th class='text-center'>Required Qty</th>";
            htmlDetail += "<th class='text-center'>Shipped Qty</th>";
            htmlDetail += "<th class='text-center'>Packing List Qty</th>";
            htmlDetail += "</tr>";
            htmlDetail += "</thead>";
            htmlDetail += "<tbody>";
            for (var i = 0; i < nData; i++) {
                params = data[i].IdPoClienteProductoDestino + "," + data[i].IdPoClienteProducto + "," + data[i].IdPoCliente + "," + data[i].IdCliente + "," + data[i].IdProducto + "," + data[i].IdClienteDireccion + "," + data[i].CantidadRequerida + "," + data[i].IdProveedor;
                htmlDetail += "<tr>";
                htmlDetail += "<td class='text-center'>" + data[i].Codigo + "</td>";
                htmlDetail += "<td class='text-center'>" + data[i].CodigoProducto + "</td>";
                htmlDetail += "<td class='text-center'>" + data[i].NombreProducto + "</td>";
                htmlDetail += "<td class='text-center'>" + data[i].DescripcionProducto + "</td>";
                htmlDetail += "<td class='text-center'>" + data[i].CantidadRequerida + "</td>";
                htmlDetail += "<td class='text-center'>" + data[i].CantidadDespachada + "</td>";
                htmlDetail += "<td class='text-center'><input type='text' class='form-control pkqty' value='" + data[i].CantidadDespachadaPL + "' data-params='" + params + "' onkeypress='return DigitimosDecimales(event,this);' /></td>";
                htmlDetail += "</tr>";
            }
            htmlDetail += "</tbody>";
            htmlDetail += "</table>";
            $("#divDetalle").empty();
            $("#divDetalle").append(htmlDetail);
        }
    
}

function Save() {
    if (PackingList != null) {
        if (PackingList[0].IdTipo == "1") {

            var contQty = 0;
            
            var IdPackingListPoClienteEstiloTallaColor = 1;
            var IdPackingListPoClienteEstilo = 1;
            var IdPackingListPoCliente = 1;


            var IdPoClienteEstilo = 0;
            var IdPoCliente = 0;

            var PackingListPoCliente = new Array();
            var PackingListPoClienteEstilo = new Array();
            var PackingListPoClienteEstiloTallaColor = new Array();

            $(".pkqty").each(function () {
                var valor = parseFloat($(this).val());
                var params = $(this).attr("data-params").split(',');
                
                //params = obj.IdCliente + "," + obj.IdProveedor + "," + obj.IdPoCliente + "," + obj.IdPoClienteEstilo + "," + obj.IdPoClienteEstiloDestino + ","
                //            + obj.IdPoClienteEstiloDestinoTallaColor + "," + obj.IdClienteColor + ","
                //            + obj.IdTipoColor + "," + obj.IdClienteTalla + "," + obj.Cantidad + "," + obj.IdClienteDireccion;

                if (valor > 0) {

                    if (IdPackingListPoClienteEstiloTallaColor == 1) {
                        IdPoCliente = parseInt(params[2]);
                        IdPoClienteEstilo = parseInt(params[3]);

                    } else {
                        if (IdPoCliente != parseInt(params[2])) {
                            IdPoCliente = parseInt(params[2]);
                            IdPackingListPoCliente++;
                        }
                        if (IdPoClienteEstilo != parseInt(params[3])) {
                            IdPoClienteEstilo = parseInt(params[3]);
                            IdPackingListPoClienteEstilo++;
                        }
                    }

                    contQty += valor;
                    var objPackingListPoClienteEstiloTallaColor = {
                        IdPackingList: 0,
                        IdPackingListPoCliente: IdPackingListPoCliente,
                        IdPackingListPoClienteEstilo: IdPackingListPoClienteEstilo,
                        IdPackingListPoClienteEstiloTallaColor: IdPackingListPoClienteEstiloTallaColor,
                        IdCliente: parseInt(params[0]),
                        IdProveedor : parseInt(params[1]),
                        IdPoCliente: parseInt(params[2]),
                        IdPoClienteEstilo: parseInt(params[3]),
                        IdPoClienteEstiloDestino: parseInt(params[4]),
                        IdPoClienteEstiloDestinoTallaColor: parseInt(params[5]),
                        IdClienteColor: parseInt(params[6]),
                        IdTipoColor: parseFloat(params[7]),
                        IdClienteTalla: parseInt(params[8]),
                        CantidadRequerida: parseFloat(params[9]),                        
                        IdClienteDireccion: parseInt(params[10]),                        
                        CantidadDespachada: valor
                    }
                    PackingListPoClienteEstiloTallaColor.push(objPackingListPoClienteEstiloTallaColor);
                    IdPackingListPoClienteEstiloTallaColor++;
                }
            });

            var nPackingListPoClienteEstiloTallaColor = PackingListPoClienteEstiloTallaColor.length;
            if (nPackingListPoClienteEstiloTallaColor > 0) {

                var IdPackingList = parseInt($("#hfIdPackingList").val());
                var Iteracion = parseInt($("#hfIteracion").val()) + 1;
                
                var objPackingList = {
                    IdPackingList: IdPackingList,
                    IdProveedor: PackingListPoClienteEstiloTallaColor[0].IdProveedor,
                    IdCliente: PackingListPoClienteEstiloTallaColor[0].IdCliente,
                    IdClienteDireccion: PackingListPoClienteEstiloTallaColor[0].IdClienteDireccion,
                    IdTipo: 1,
                    Cantidad: contQty,
                    Iteracion: Iteracion
                }

                var frm = new FormData();
                frm.append("packinglist", JSON.stringify(objPackingList));
                frm.append("packinglistpoclienteestilodestinotallacolor", JSON.stringify(PackingListPoClienteEstiloTallaColor));
                Post('PackingList/PackingList/SavePKG', frm, Alerta);

            }

            //alert(JSON.stringify(PackingListPoClienteEstiloTallaColor));



        } else {
            var PackingListPoCliente = new Array();
            var PackingListPoClienteProducto = new Array();
            var IdPackingListPoClienteProducto = 1;
            var IdPackingListPoCliente = 1;
            var IdPoCliente = 0;
            var contQty = 0;
            var contQtyPC = 0;

            $(".pkqty").each(function () {
                var valor = parseFloat($(this).val());
                var params = $(this).attr("data-params").split(',');


                if (valor > 0) {

                    if (IdPackingListPoClienteProducto == 1) {
                        IdPoCliente = parseInt(params[2]);
                    } else {
                        if (IdPoCliente != parseInt(params[2])) {
                            IdPoCliente = parseInt(params[2])
                            IdPackingListPoCliente++;
                        }
                    }
                    contQty += valor;
                    var objPackingListPoClienteProducto = {
                        IdPackingListPoClienteProducto: IdPackingListPoClienteProducto,
                        IdPackingListPoCliente: IdPackingListPoCliente,
                        IdPackingList: 0,
                        IdPoClienteProductoDestino: parseInt(params[0]),
                        IdPoClienteProducto: parseInt(params[1]),
                        IdPoCliente: parseInt(params[2]),
                        IdCliente: parseInt(params[3]),
                        IdProducto: parseInt(params[4]),
                        IdClienteDireccion: parseInt(params[5]),
                        CantidadRequerida: parseFloat(params[6]),
                        CantidadRequeridaPC: parseFloat(params[6]),
                        IdProveedor: parseFloat(params[7]),
                        CantidadDespachada: valor
                    }
                    PackingListPoClienteProducto.push(objPackingListPoClienteProducto);
                    IdPackingListPoClienteProducto++;
                }
            });

            var nPackingListPoClienteProducto = PackingListPoClienteProducto.length;
            if (nPackingListPoClienteProducto > 0) {
                PackingListPoCliente = GroupBy(PackingListPoClienteProducto, "IdPackingListPoCliente,IdPoCliente,IdCliente,IdProveedor,IdClienteDireccion");

                var nPackingListPoCliente = PackingListPoCliente.length;
                if (nPackingListPoCliente > 0) {

                    for (var i = 0; i < nPackingListPoCliente; i++) {
                        var dataFilter = PackingListPoClienteProducto.filter(function (e) { return (e.IdPoCliente === PackingListPoCliente[i].IdPoCliente) });
                        var ndataFilter = dataFilter.length;
                        if (ndataFilter > 0) {
                            for (var x = 0; x < ndataFilter; x++) {
                                contQtyPC += dataFilter[x].CantidadDespachada;
                            }
                            PackingListPoCliente[i]["CantidadDespachada"] = contQtyPC;
                            contQtyPC = 0;
                        }
                    }

                    var IdPackingList = parseInt($("#hfIdPackingList").val());
                    var Iteracion = parseInt($("#hfIteracion").val()) + 1;

                    var objPackingList = {
                        IdPackingList: IdPackingList,
                        IdProveedor: PackingListPoCliente[0].IdProveedor,
                        IdCliente: PackingListPoCliente[0].IdCliente,
                        IdClienteDireccion: PackingListPoCliente[0].IdClienteDireccion,
                        IdTipo: 2,
                        Cantidad: contQty,
                        Iteracion: Iteracion
                    }                    
                    var frm = new FormData();
                    frm.append("packinglist", JSON.stringify(objPackingList));
                    frm.append("packinglistpocliente", JSON.stringify(PackingListPoCliente));
                    frm.append("packinglistpoclienteproducto", JSON.stringify(PackingListPoClienteProducto));
                    Post('PackingList/PackingList/SavePK', frm, Alerta);

                }                
            } else {
                alert('Please add quantities');
            }
        }
    } else {
        alert('Error');
    }
}
function Alerta(data) {
    var rpta = JSON.parse(data);
    alert(rpta.mensaje);
    let urlaccion = 'PackingList/PackingList/Index',
        urljs = 'PackingList/PackingList/Index';
    _Go_Url(urlaccion, urljs);
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

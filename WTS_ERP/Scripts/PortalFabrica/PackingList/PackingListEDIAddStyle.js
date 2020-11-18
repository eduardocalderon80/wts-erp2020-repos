window.onload = function () {
   
    //if (document.getElementById('cboDestino').value != "") {
    //    Validar();
    //}
    document.getElementById("pageload").style.visibility = "hidden";
    //document.getElementById("myDiv").style.display = "block";

    //document.getElementById("cboDestino").addEventListener("change", function () {
    //    Validar();
    //});
    Validar();
}
function openCarton(idpk) {
    var url = appURL.erpnew + "PortalFabrica/PackingList/CartonLabelSS/" + idpk;
    window.open(url);
}
function MostrarFileDetail() {
    document.getElementById("divFile").style.display = "block";
}
function PrintCarton() {
    var frm = new FormData();
    frm.append("IdPackinglist", document.getElementById("hdnIdServicioPackingList").value);
    frm.append("NumeroPackingList", document.getElementById("hdnNumeroPackingList").value);
    frm.append("NumPackingList", document.getElementById("hdnPO").value);
    frm.append("Cliente", document.getElementById("hdnCodCliente").value);
    frm.append("Fabrica", document.getElementById("hdnCodFabrica").value);
    frm.append("Destino", document.getElementById("cboDestino").value);
    //frm.append("FechaDespacho", document.getElementById("txtFechaDespacho").value);
    Post("PortalFabrica/PackingList/GrabarPackingList", frm, RespuestaGrabar, false);
}
function GrabarPackingList(masDespachos) {
    if (document.getElementById('hdnCodFabrica').value == "") {
        swalAlert('warning', 'Mensaje', 'No se cargo correctamente la Fabrica!.', '');
        //alert('No se cargo correctamente la Fabrica');
        return false;
    }
    if (document.getElementById('hdnCodCliente').value == "") {
        swalAlert('warning', 'Mensaje', 'No se cargo correctamente El Cliente!.', '');
        //alert('No se cargo correctamente el Cliente');
        return false;
    }
    document.getElementById("cboDestino").value = "USA";
    if (document.getElementById('cboDestino').value == "") {
        swalAlert('warning', 'Mensaje', 'Por favor seleccione un Destino!.', '');
        //alert('Por favor seleccione un Destino');
        return false;
    }

    if (document.getElementById('hfNoGrabar').value == "1") {
        swalAlert('warning', 'Mensaje', 'Por favor revise el contenido del packing List. No todos los items han sido relacionados con el sistema!.', '');
        //alert('Por favor revise el contenido del packing List. No todos los items han sido relacionados con el sistema');
        return false;
    }
    if (document.getElementById('hfNoGrabar').value == "2") {
        swalAlert('warning', 'Mensaje', 'No se puede grabar, intentelo mas tarde!.', '');
        //alert('No se puede grabar. Intentelo mas tarde');
        return false;
    }

    document.getElementById("pageload").style.visibility = "visible";
    var frm = new FormData();
    frm.append("IdPackinglist", document.getElementById("hdnIdServicioPackingList").value);
    frm.append("NumeroPackingList", document.getElementById("hdnNumeroPackingList").value);
    frm.append("NumPackingList", document.getElementById("hdnPO").value);
    frm.append("Cliente", document.getElementById("hdnCodCliente").value);
    frm.append("Fabrica", document.getElementById("hdnCodFabrica").value);
    frm.append("Destino", document.getElementById("cboDestino").value);
    frm.append("MasDespachos", ((masDespachos) !== "" ? masDespachos : "1"));
    //frm.append("FechaDespacho", document.getElementById("txtFechaDespacho").value);
    Post("PortalFabrica/PackingList/GrabarPackingList", frm, RespuestaGrabar, false);

    return false;
}
function Validar() {
    document.getElementById("pageload").style.visibility = "visible";
    //if (document.getElementById('fupPK').value == "") {
    //    alert('Por favor seleccione un archivo');
    //    return false;
    //}      

    //console.log(document.getElementById("btnGrabarPackingList"));   
    document.getElementById("divDetail").classList.add("hidden");
    document.getElementById("divFile").classList.add("hidden");
    document.getElementById("divCarton").classList.add("hidden");
    //document.getElementById("formulario").classList.add("hidden");
    document.getElementById("btnGrabarPackingList").classList.add("hidden");
    document.getElementById('rptPrincipal').innerHTML = "";
    document.getElementById('rptDetalleSKU').innerHTML = "";
    document.getElementById('rptCarton').innerHTML = "";

    if (document.getElementById('hdnCodFabrica').value == "") {
        swalAlert('warning', 'Mensaje', 'No se cargo correctamente la Fabrica!.', '');
        //alert('No se cargo correctamente la Fabrica');
        return false;
    }
    if (document.getElementById('hdnCodCliente').value == "") {
        swalAlert('warning', 'Mensaje', 'No se cargo correctamente el Cliente!.', '');
        //alert('No se cargo correctamente el Cliente');
        return false;
    }
    document.getElementById("cboDestino").value = "USA";
    //if (document.getElementById('cboDestino').value == "") {
    //    alert('Por favor seleccione un Destino');
    //    return false;
    //}
    var frm = new FormData();
    frm.append("IdPackinglist", document.getElementById("hdnIdServicioPackingList").value);
    frm.append("NumeroPackingList", document.getElementById("hdnNumeroPackingList").value);
    frm.append("Cliente", document.getElementById("hdnCodCliente").value);
    frm.append("Fabrica", document.getElementById("hdnCodFabrica").value);
    frm.append("Destino", document.getElementById("cboDestino").value);
    frm.append("NPacking", document.getElementById("hfNPacking").value);
    //frm.append("FechaDespacho", document.getElementById("txtFechaDespacho").value);
    Post("PortalFabrica/PackingList/UploadPLCSV", frm, RespuestaValidar, false);

    return false;
}
function RespuestaValidar(res) {
    //document.getElementById("divDetail").classList.add("hidden");
    //document.getElementById("divFile").classList.add("hidden");
    //document.getElementById("formulario").classList.add("hidden");
    //document.getElementById("divCarton").classList.add("hidden");
    //document.getElementById("btnGrabarPackingList").classList.add("hidden");
    var boolGrabar = true;

    if (res != "" && res != "^") {
        if (res.split('^').length == 2) {

            CargarTablePrincipal(res.split('^')[0]);
            CargarTableDetalleSKU(res.split('^')[1]);

            document.getElementById("divDetail").classList.remove("hidden");
            document.getElementById("divFile").classList.remove("hidden");
            document.getElementById("formulario").classList.remove("hidden");
            document.getElementById("btnGrabarPackingList").classList.add("hidden");

        } else if (res.split('^').length == 3) {

            CargarTablePrincipal(res.split('^')[0]);
            CargarTableDetalleSKU(res.split('^')[1]);

            document.getElementById("divDetail").classList.remove("hidden");
            document.getElementById("divFile").classList.remove("hidden");
            document.getElementById("formulario").classList.remove("hidden");
            document.getElementById("btnGrabarPackingList").classList.add("hidden");

            if (res.split('^')[2] != "") {
                var datos = JSON.parse(res.split('^')[2]);
                document.getElementById("hfNoGrabar").value = datos[0].hfNoGrabar;
                var mensaje = datos[0].mensaje;
                if (mensaje != "") {
                    boolGrabar = false;
                    swalAlert('warning', 'Mensaje', mensaje , '');
                    //alert(mensaje);                    

                    window.parent.postMessage('btnBuscar_cerrarModal', appURL.erp);
                    return false;
                }
            }
        } else if (res.split('^').length == 1 && res.indexOf('^') > -1) {
            var datos = JSON.parse(res.split('^')[0]);

            document.getElementById("hfNoGrabar").value = datos[0].hfNoGrabar;

            var mensaje = datos[0].mensaje;
            if (mensaje != "") {
                boolGrabar = false;
                swalAlert('warning', 'Mensaje', mensaje, '');
                //alert(mensaje);
                window.parent.postMessage('btnBuscar_cerrarModal', appURL.erp);
                return false;
            }
        }
        else if (res == "^") {
            boolGrabar = false;
            var datos = JSON.parse(res);
            document.getElementById("hfNoGrabar").value = "3";
            CargarTableCarton(datos);

            document.getElementById("divDetail").classList.add("hidden");
            document.getElementById("divFile").classList.add("hidden");
            document.getElementById("formulario").classList.add("hidden");
            document.getElementById("divCarton").classList.add("hidden");
            document.getElementById("btnGrabarPackingList").classList.add("hidden");
        }
        else if (res.split('¬').length == 2) {
            boolGrabar = false;
            var datos = res.split('¬')[1];
            var datosJson = JSON.parse(datos);
            document.getElementById("hfNoGrabar").value = "3";
            CargarTableCarton(datosJson);

            document.getElementById("divDetail").classList.add("hidden");
            document.getElementById("divFile").classList.add("hidden");
            document.getElementById("formulario").classList.add("hidden");
            document.getElementById("divCarton").classList.remove("hidden");
            document.getElementById("btnGrabarPackingList").classList.add("hidden");
            window.parent.postMessage('btnBuscar_conCarton', appURL.erp);
        }
    }
    else {
        boolGrabar = false;
        document.getElementById("divDetail").classList.remove("hidden");
        document.getElementById("divFile").classList.remove("hidden");
        document.getElementById("formulario").classList.remove("hidden");
        document.getElementById("btnGrabarPackingList").classList.add("hidden");
        document.getElementById("divCarton").classList.add("hidden");
        TablaDetailVacia();
        TablaFileVacia();
        TablaCartonVacia();
        swalAlert('warning', 'Mensaje', 'No existe detalle disponible en la PO, Comuniquese con Soporte Tecnico!.', 'window.parent.postMessage("btnBuscar_cerrarModal", appURL.erp);');
        //window.parent.postMessage('btnBuscar_cerrarModal', appURL.erp);
    }
    document.getElementById("pageload").style.visibility = "hidden";
    if (boolGrabar) {
        VerificarpackingList(document.getElementById("hdnIdServicioPackingList").value, document.getElementById("hdnCodCliente").value, document.getElementById("hfIdUsuarioFabrica").value);
    }
}
function RespuestaGrabar(res) {
    if (res != "") {
        var res = res.split('¬');

        var datos = JSON.parse(res[0]);
        var datosCarton = JSON.parse(res[1]);

        var mensaje = datos[0].mensaje;
        var idPackinList = datos[0].hfIdPackingList;
        var bresult = datos[0].bresult;
        if (bresult == "True") {
            if (mensaje != "") {
                swalAlert('warning', 'Mensaje', mensaje, '');
                //alert(mensaje);
            }
            //parent.document.getElementById("myModalPackingList").style.display = "none";

            document.getElementById("divDetail").classList.add("hidden");
            document.getElementById("divFile").classList.add("hidden");
            document.getElementById("formulario").classList.add("hidden");
            document.getElementById("btnGrabarPackingList").classList.add("hidden");
            document.getElementById("divCarton").classList.remove("hidden");

            CargarTableCarton(datosCarton);
            document.getElementById("pageload").style.visibility = "hidden";
            return false;
        } else {
            swalAlert('warning', 'Mensaje', mensaje, '');
            //alert(mensaje);
            TablaCartonVacia();
            document.getElementById("pageload").style.visibility = "hidden";
            return false;
        }
    }
    document.getElementById("pageload").style.visibility = "hidden";
}

function TablaDetailVacia() {
    //document.getElementById("divDetail").classList.remove("hidden");
    var tableprincipal = "";
    tableprincipal += "<thead>";
    tableprincipal += "<tr>";
    tableprincipal += "<th>Cierre </th>";
    tableprincipal += "<th>PO </th>";
    tableprincipal += "<th>Lot </th>";
    tableprincipal += "<th>Estilo </th>";
    tableprincipal += "<th></th>";
    tableprincipal += "<th></th>";
    tableprincipal += "<th>Tienda </th>";
    tableprincipal += "<th>Hts </th>";
    tableprincipal += "<th>Qty Req</th>";
    tableprincipal += "<th>Q to Ship </th>";
    tableprincipal += "<th>Q Shipped </th>";
    tableprincipal += "<th>Mapped</th>";
    tableprincipal += "</tr>";
    tableprincipal += "</thead>";

    tableprincipal += "<tbody>";

    tableprincipal += "<tr>";
    tableprincipal += "<td colspan='12' style='text-align:center'>No existen datos que mostrar</td>";
    tableprincipal += "</tr>";
    tableprincipal += "</tbody>";
    document.getElementById("rptPrincipal").innerHTML = tableprincipal;
}
function TablaFileVacia() {
    //document.getElementById("divFile").classList.remove("hidden");
    var tableDetalleSKU = "";
    tableDetalleSKU += "<thead>";
    tableDetalleSKU += "<tr>";
    tableDetalleSKU += "<th>PO </th>";
    tableDetalleSKU += "<th>Style </th>";
    tableDetalleSKU += "<th>Lot </th>";
    tableDetalleSKU += "<th>Color </th>";
    tableDetalleSKU += "<th>Size</th>";
    tableDetalleSKU += "<th>ReqQty</th>";
    tableDetalleSKU += "<th>ShipQty </th>";
    tableDetalleSKU += "</tr>";
    tableDetalleSKU += "</thead>";
    tableDetalleSKU += "<tbody>";

    tableDetalleSKU += "<tr>";
    tableDetalleSKU += "<td colspan='7' style='text-align:center'>No existen datos que mostrar</td>";
    tableDetalleSKU += "</tr>";
    tableDetalleSKU += "</tbody>";
    document.getElementById("rptDetalleSKU").innerHTML = tableDetalleSKU;
}
function TablaCartonVacia() {
    //document.getElementById("divCarton").classList.remove("hidden");
    var tablecarton = "";
    tablecarton += "<thead style='background-color: #f5f5f5!important;'>";
    tablecarton += "<tr>";
    tablecarton += "<th style='text-align:center' class='k-header'>Id </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>EDI </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>N° Ref </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Factory </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Client </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Destination </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Delivery Date </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Qty Ship </th>";
    tablecarton += "<th style='text-align:center' class='k-header'></th>";
    tablecarton += "</tr>";
    tablecarton += "</thead>";

    tablecarton += "<tbody class='k-grid'>";
    tablecarton += "<td colspan='9' style='text-align:center'>No existen datos que mostrar</td>";
    tablecarton += "</tr>";
    tablecarton += "</tbody>";

    document.getElementById("rptCarton").innerHTML = tablecarton;
}

function CargarTablePrincipal(data) {
    if (data.split('¬').length > 1) {

        var datos = JSON.parse(data.split('¬')[0]);
        var datos_totales = JSON.parse(data.split('¬')[1]);

        if (datos.length > 0) {
            document.getElementById("divDetail").classList.remove("hidden");
        } else {
            document.getElementById("divDetail").classList.add("hidden");
        }

        var tableprincipal = "";
        tableprincipal += "<thead style='background-color: #f5f5f5!important;'>";
        tableprincipal += "<tr>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Cierre </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Po </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Lot </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Estilo </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'></th>";
        tableprincipal += "<th style='text-align:center' class='k-header'></th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Tienda </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Hts </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Qty Req</th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Q to Ship </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Q Shipped </th>";
        tableprincipal += "<th style='text-align:center' class='k-header'>Mapped</th>";
        tableprincipal += "</tr>";
        tableprincipal += "</thead>";

        tableprincipal += "<tbody  class='k-body'>";
        for (var x = 0; x < datos.length; x++) {
            tableprincipal += "<tr>";
            tableprincipal += (datos[x].cierre == '0') ? "<td style='text-align:center'>x</td>" : "<td></td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].CodPurord + "</td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].CodLotest + "</td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].CodEstilo + "</td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].Tienda + "</td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].Hts + "</td>";
            tableprincipal += "<td style='text-align:right'>" + datos[x].CantidadRequerida + "</td>";
            tableprincipal += "<td style='text-align:right'>" + datos[x].CantidadxDespachar + "</td>";
            tableprincipal += "<td style='text-align:right'>" + datos[x].CantidadDespachadas + "</td>";
            tableprincipal += "<td style='text-align:center'>" + datos[x].StrMapped + "</td>";
            tableprincipal += "</tr>";
        }
        tableprincipal += "</tbody>";
        if (datos.length > 0) {
            tableprincipal += "<tfoot>";
            tableprincipal += "<tr>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td></td>";
            tableprincipal += "<td style='text-align:right'>" + datos_totales[0].CantidadCarrito + "</td>";
            tableprincipal += "<td style='text-align:right'>" + datos_totales[0].CantidadCarritoDES + "</td>";
            tableprincipal += "<td></td>";
            tableprincipal += "</tr>";
            tableprincipal += "</tfoot>";
        }

        document.getElementById("rptPrincipal").innerHTML = tableprincipal;
    }


}
function CargarTableDetalleSKU(data) {
    var datos = JSON.parse(data);
    if (datos.length > 0) {
        document.getElementById("divFile").classList.remove("hidden");
    } else {
        document.getElementById("divFile").classList.add("hidden");
    }

    var tableDetalleSKU = "";
    tableDetalleSKU += "<thead style='background-color: #f5f5f5!important;'>";
    tableDetalleSKU += "<tr>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>Po </th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>Style </th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>Lot </th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>Color </th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>Size</th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>ReqQty</th>";
    tableDetalleSKU += "<th style='text-align:center' class='k-header'>ShipQty </th>";
    tableDetalleSKU += "</tr>";
    tableDetalleSKU += "</thead>";

    tableDetalleSKU += "<tbody  class='k-body'>";
    for (var x = 0; x < datos.length; x++) {
        tableDetalleSKU += "<tr>";
        tableDetalleSKU += "<td style='text-align:center'>" + (datos[x].Po) + "</td>";
        tableDetalleSKU += "<td style='text-align:center'>" + datos[x].Style + "</td>";
        tableDetalleSKU += "<td style='text-align:center'>" + datos[x].Lot + "</td>";
        tableDetalleSKU += "<td style='text-align:center'>" + datos[x].Color + "</td>";
        tableDetalleSKU += "<td style='text-align:center'>" + datos[x].Size + "</td>";
        tableDetalleSKU += "<td style='text-align:right'>" + datos[x].ReqQty + "</td>";
        tableDetalleSKU += "<td style='text-align:right'>" + datos[x].ShipQty + "</td>";
        tableDetalleSKU += "</tr>";
    }
    tableDetalleSKU += "</tbody>";


    document.getElementById("rptDetalleSKU").innerHTML = tableDetalleSKU;

}
function CargarTableCarton(datos) {

    if (datos.length > 0) {
        document.getElementById("divCarton").classList.remove("hidden");
    } else {
        document.getElementById("divCarton").classList.add("hidden");
    }

    var tablecarton = "";
    tablecarton += "<thead style='background-color: #f5f5f5!important;'>";
    tablecarton += "<tr>";
    tablecarton += "<th style='text-align:center' class='k-header'>Id </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>EDI </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>N° Ref </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Factory </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Client </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Destination </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Delivery Date </th>";
    tablecarton += "<th style='text-align:center' class='k-header'>Qty Ship </th>";
    tablecarton += "<th style='text-align:center' class='k-header'></th>";
    tablecarton += "</tr>";
    tablecarton += "</thead>";

    tablecarton += "<tbody class='k-body'>";
    for (var x = 0; x < datos.length; x++) {
        tablecarton += "<tr>";
        tablecarton += "<td style='text-align:center'>" + datos[x].IdPackingList + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].edi + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].NumeroPackingList + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].Nom_Fabrica + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].Nom_Cliente + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].CodigoDestino + "</td>";
        tablecarton += "<td style='text-align:center'>" + datos[x].FechaDespacho + "</td>";
        tablecarton += "<td style='text-align:right'>" + datos[x].CantidadDespachadas + "</td>";
        tablecarton += "<td><a style='cursor:pointer!important' title='Print Labels' href='#' onclick='openCarton(\"" + datos[x].IdPackingList + "\")'>Carton</a></td>";
        tablecarton += "</tr>";
    }

    document.getElementById("rptCarton").innerHTML = tablecarton;
    //window.parent.postMessage('btnBuscar_mostrarCartons', appURL.erp);
}

function RespuestaVerificarpackingList(response) {
    var r = false;
    var PO = "";
    rpta = JSON.parse(response);
    if (rpta.Success) {
        //console.log(rpta);
        var iObservacion = rpta.Data.split("_")[0];
        if (rpta.Data != "0" && rpta.Data != "0|0" && rpta.Data != "") {
            PO = rpta.Data.split("_")[3].split('|')[4];
        }
        if (PO != "") {
            if (PO.substring(0, 1) == "8") {
                if (iObservacion == "1") {
                    Swal.fire({
                        title: 'Mensaje',
                        text: "La PO tendra mas despachos?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si',
                        cancelButtonText: 'No',
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.value) {
                            GrabarPackingList(1);
                            window.parent.postMessage('btnBuscar_grabar|' + $("#hdnIdServicioPackingList").val(), appURL.erp);
                            //Swal.fire(
                            //    'Deleted!',
                            //    'Your file has been deleted.',
                            //    'success'
                            //)
                        } else {
                            GrabarPackingList(0);
                            window.parent.postMessage('btnBuscar_grabar|' + $("#hdnIdServicioPackingList").val(), appURL.erp);
                        }
                    })
                } else {
                    GrabarPackingList(0);
                    window.parent.postMessage('btnBuscar_grabar|' + $("#hdnIdServicioPackingList").val(), appURL.erp);
                }
            } else {
                r = true;
            }
        } else {
            r = true;
        }

        if (r) {
            GrabarPackingList(1);
            window.parent.postMessage('btnBuscar_grabar|' + $("#hdnIdServicioPackingList").val(), appURL.erp);
        }
        
        //console.log(response);
        return false;
    }
}
function VerificarpackingList(idServiciopackingList, codCliente, idUsuarioFabrica) {
    var frm = new FormData();
    frm.append("idServiciopackingList", idServiciopackingList);
    frm.append("codCliente", codCliente);
    frm.append("idUsuarioFabrica", idUsuarioFabrica);

    //frm.append("FechaDespacho", document.getElementById("txtFechaDespacho").value);
    Post("PortalFabrica/PackingList/VerificarpackingList", frm, RespuestaVerificarpackingList, false);

}
function swalAlert(tipo, titulo, mensaje, accion) {
    Swal.fire({
        type: tipo,
        title: titulo,
        text: mensaje,
        allowOutsideClick: false,
        //allowEscapeKey: false,
        onClose: () => {
            eval(accion);
        }
        //footer: '<a href>Why do I have this issue?</a>'
    }).then((result) => {
        eval(accion);        
        //if (result.value) {
        //    alert();
        //}
    });
}
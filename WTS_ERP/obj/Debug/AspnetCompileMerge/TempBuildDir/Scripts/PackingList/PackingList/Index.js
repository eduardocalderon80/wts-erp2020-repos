$(document).ready(function () {
    //datetimepicker({
    $("#dtFI .input-group.date").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
        //locale: 'es',
        //defaultDate: moment().add(-2, 'M'),
        //showTodayButton: true,
        //widgetPositioning: {
        //    vertical: 'bottom'
        //},
    });
    //datetimepicker({
    $("#dtFF .input-group.date").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
        //locale: 'es',
        //defaultDate: moment().add(1, 'M'),
        //showTodayButton: true,
        //widgetPositioning: {
        //    vertical: 'bottom'
        //},
    });

    let fechaactual = new Date(), fechaatras = fechaactual.addDays(-60), fechaadelante = fechaactual.addDays(30),
        anio = fechaatras.getFullYear(), mes = fechaatras.getMonth(), dia = fechaatras.getDate(),
        anioadelante = fechaadelante.getFullYear(), mesadelante = fechaadelante.getMonth(), diaadelante = fechaadelante.getDate(),
        fechadosmesesatras = ('0' + (mes + 1).toString()).slice(-2) + '/' + ('0' + dia.toString()).slice(-2) + '/' + anio,
        fechaunmesadelante = ('0' + (mesadelante + 1).toString()).slice(-2) + '/' + ('0' + diaadelante.toString()).slice(-2) + '/' + anioadelante;  //dia = fechaactual.getDate() - 16

        $('#dtFI .input-group.date').datepicker('update', fechadosmesesatras);
        $('#dtFF .input-group.date').datepicker('update', fechaunmesadelante);

    $("#btnSearch").click(function () {
        SearchPackingList();
    });
    $("#btnNewPL").click(function () {
        PackingListNew();
    });
    LoadInitialData();    
});
function SearchPackingList() {
    var IdProveedor = $("#cboFabrica").val();
    var IdCliente = $("#cboCliente").val();
    var CodigoPackingList = $("#txtCodigoPackingList").val();
    var Po = $("#txtPo").val();
    var FI = $("#txtFI").val();
    var FF = $("#txtFF").val();
    var par = IdProveedor + "," + IdCliente + "," + CodigoPackingList + "," + Po + "," + FI + "," + FF;
    var frm = new FormData();
    frm.append("par", par);
    Post('PackingList/PackingList/SearchPackingList', frm, LoadData);
}
function LoadData(data) {
    data = JSON.parse(data);
    ndata = data.length;
    if (ndata > 0) {
        var html = "<table class='table table-bordered'>";
        html += "<thead>";
        html += "<tr>";
        html += "<th class='text-center'></th>";
        html += "<th class='text-center'>Id</th>";
        html += "<th class='text-center'>Factory</th>";
        html += "<th class='text-center'>Customer</th>";
        html += "<th class='text-center'>PO #</th>";
        html += "<th class='text-center'>Qty</th>";
        html += "<th class='text-center'>Status</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        for (var i = 0; i < ndata; i++) {
            html += "<tr>";
            html += "<td class='text-center'><span class='input-group-btn'><button class='btn btn-primary btn-sm' type='button' title='edit' onclick='PackingListEdit(" + data[i].IdPackingList + ")'><i class='fa fa-pencil-square-o'></i></button></span></td>";
            html += "<td class='text-center'>" + data[i].IdPackingList + "</td>";
            html += "<td class='text-center'>" + data[i].NombreProveedor + "</td>";
            html += "<td class='text-center'>" + data[i].NombreCliente + "</td>";
            html += "<td class='text-center'>" + data[i].Codigo + "</td>";
            html += "<td class='text-center'>" + data[i].Cantidad + "</td>";
            html += "<td class='text-center'>" + data[i].Estado + "</td>";
            html += "</tr>";
        }
        html += "</tbody>";
        $("#divContent").empty();
        $("#divContent").append(html);
    }
}
function LoadInitialData() {
    Get('PackingList/PackingList/GetCustomer', LoadCustomer);
    Get('PackingList/PackingList/GetSupplier', LoadSupplier);
}
function LoadCustomer(data) {
    var html = "<option value=''>All</option>" + _comboFromJSON(JSON.parse(data), "IdCliente", "NombreCliente");
    FillSelect("cboCliente", html);
}
function LoadSupplier(data) {
    var html = "<option value=''>All</option>" + _comboFromJSON(JSON.parse(data), "IdProveedor", "NombreProveedor");
    FillSelect("cboFabrica", html);
}
function FillSelect(id, html) {
    $("#" + id).append(html);
}
function PackingListNew() {
    let urlaccion = 'PackingList/PackingList/Nuevo',
        urljs = 'PackingList/PackingList/Nuevo';
    _Go_Url(urlaccion, urljs, null);
}
function PackingListEdit(id) {
    let urlaccion = 'PackingList/PackingList/Editar',
        urljs = 'PackingList/PackingList/Editar';
    _Go_Url(urlaccion, urljs, id);
}
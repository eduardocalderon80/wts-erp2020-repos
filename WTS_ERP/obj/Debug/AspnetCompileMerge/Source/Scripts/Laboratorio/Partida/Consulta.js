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

    //let fechaactual = new Date(), fechaatras = fechaactual.addDays(-30), fechaadelante = fechaactual.addDays(30),
    //    anio = fechaatras.getFullYear(), mes = fechaatras.getMonth(), dia = fechaatras.getDate(),
    //    anioadelante = fechaadelante.getFullYear(), mesadelante = fechaadelante.getMonth(), diaadelante = fechaadelante.getDate(),
    //    fechadosmesesatras = ('0' + (mes + 1).toString()).slice(-2) + '/' + ('0' + dia.toString()).slice(-2) + '/' + anio,
    //    fechaunmesadelante = ('0' + (mesadelante + 1).toString()).slice(-2) + '/' + ('0' + diaadelante.toString()).slice(-2) + '/' + anioadelante;  //dia = fechaactual.getDate() - 16

    //('#dtFI').datepicker('update', moment().subtract(60, 'days').format('MM/DD/YYYY'));

    $('#dtFI .input-group.date').datepicker('update', moment().subtract(1, 'month').format('MM/DD/YYYY'));
    $('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('MM/DD/YYYY'));

    $("#btnSearch").click(function () {
        Search();
    });
    $("#btnNew").click(function () {
        New();
    });
    $("#btnExportarReporteLaboratorio").click(function () {
        ExportarReporteLaboratorio();
    });
    LoadInitialData();
});


function Search() {
    var IdProveedor = $("#cboFabrica").val();
    var IdCliente = $("#cboCliente").val();

    var txtCodigoReporteTecnico = $("#txtCodigoReporteTecnico").val();
    var txtPartida = $("#txtPartida").val();
    var FI = _convertDate_ANSI($("#txtFI").val());
    var FF = _convertDate_ANSI($("#txtFF").val());
    var codigotela = ''; //// PARA ESTA VISTA NO ES NECESARIO ESTE DATO YA QUE SE PIDIO PARA LA VISTA QUE USA DANAE: EN CONSULTAPARTIDA
    var par = IdProveedor + "," + IdCliente + "," + txtCodigoReporteTecnico + "," + txtPartida + "," + FI + "," + FF + "," + codigotela;
    Get('Laboratorio/Partida/Search?par=' + par, LoadData);

}

function fn_exportsolicitud(_id) {

    let urlaccion = urlBase() + "Laboratorio/Partida/Exportar_Solicitud/" + _id;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    return;
}

function LoadData(data) {

    if (data != "") {
        data = JSON.parse(data);
        ndata = data.length;
        if (ndata > 0) {

            var htmlhead = `<table id='tblconsulta' class='table table-bordered'  style='width: 100%; max-width: 100%;  padding-right: 0px;'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Reporte Tecnico</th>
                        <th>Cliente</th>
                        <th>Fabrica</th>
                        <th>Numero Partida</th>
                        <th>Color</th>
                        <th>Codigo Tela</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Recibido</th>
                        <th>Fecha Finalizacion</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Status Tono</th>
                        <th>Status Comercial</th>
                    </tr>
                </thead>                
                `;
            var htmlbody = `<tbody>`;
            //<td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-primary btn-sm' type='button' title='Editar Solicitud' onclick="Edit('${x.IdPartida}')"><i class ='fa fa-pencil-square-o'></i></button></span></td>
            //<td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-primary btn-sm' type='button' title='Pruebas' onclick="Pruebas('${x.IdPartida}')"><i class ='fa fa-list-alt'></i></button></span></td>
            //<td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-danger btn-sm' type='button' title='Eliminar' onclick="Eliminar('${x.IdPartida}')"><i class ='fa fa-times'></i></button></span></td>
            //<td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-outline btn-warning btn-sm' type='button' title='Exportar Solicitud' onclick="fn_exportsolicitud('${x.IdPartida}')"><i class ='fa fa-file-text-o'></i></button></span></td>
         
            data.forEach(x => {

                let exportar = ``;
                if (x.Status !== 'Received' && x.Status !== 'Sent') {                    
                    exportar = `
                         <button type='button' title='Exportar Test' class ='btn btn-outline btn-success' onclick="ExportarReporte('${x.IdPartida}')">
                            <span class ='fa fa-file-pdf-o'></span>
                        </button>
                    `;
                }

                let statuspartida = ``;
                if (x.Status == 'Approved' || x.Status == 'Approved with comments') { statuspartida = '<b><span style="color:green;">' + x.Status + '</span></b>' }
                else if (x.Status == "Rejected") { statuspartida = '<b><span style="color:red;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Pending') { statuspartida = '<b><span style="color:#FFD133;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Received') { statuspartida = '<b><span style="color:#A569BD;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Sent') { statuspartida = '<b><span style="color:#2874A6;">' + x.Status + '</span></b>'; }
                else { statuspartida = '<b><span>' + x.Status + '</span></b>'; }
                
                htmlbody += `
                    <tr>                        
                        <td class ='text-center'>
                            <button type='button' title='Editar' class ='btn btn-outline btn-info' onclick="Edit('${x.IdPartida}')">
                                <span class ='fa fa-edit'></span>
                            </button>
                        </td>                        
                        <td class ='text-center'>
                            <button type='button' title='Pruebas' class ='btn btn-outline btn-primary' onclick="Pruebas('${x.IdPartida}')">
                                <span class ='fa fa-list'></span>
                            </button>
                        </td>                        
                        <td class ='text-center'>
                            <button type='button' title='Eliminar' class ='btn btn-outline btn-danger' onclick="Eliminar('${x.IdPartida}')">
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td class ='text-center'>
                            <button type='button' title='Exportar Solicitud' class ='btn btn-outline btn-warning' onclick="fn_exportsolicitud('${x.IdPartida}')">
                                <span class ='fa fa-file-text-o'></span>
                            </button>
                        </td>                        
                        <td class ='text-center'>${exportar}</td>
                        <td class ='text-center'>${x.CodigoReporteTecnico}</td>
                        <td class ='text-center'>${x.NombreCliente}</td>
                        <td class ='text-center'>${x.NombreFabrica}</td>
                        <td class ='text-center'>${x.NumeroPartida}</td>
                        <td class ='text-center'>${x.NombreColor}</td>
                        <td class ='text-center'>${x.CodigoTela}</td>
                        <td class ='text-center'>${x.FechaIngreso}</td>
                        <td class ='text-center'>${x.FechaRecibido}</td>
                        <td class ='text-center'>${x.FechaFinalizacion}</td>
                        <td class ='text-center'>${x.Tipo}</td>
                        <td class ='text-center'>${statuspartida}</td>
                        <td class ='text-center'>${x.StatusTono}</td>
                        <td class ='text-center'>${x.StatusComercial}</td>
                    </tr>
                    `
                ;              
            });

            htmlbody += `</tbody></table>`;
            var htmltotal = htmlhead + htmlbody;
            _('divContent').innerHTML = htmltotal;

            $('#tblconsulta').DataTable({
                scrollY: "500px",
                scrollX: true,
                scrollCollapse: true,
                ordering: true,
                searching: false,
                info: false,
                "pageLength": 50
            });

            ////html += htmlbody + "</tbody>";
            ////_('divContent').innerHTML = html;
            //$('#tblconsulta').DataTable({
            //    "pageLength": 50
            //});

        } else {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
            _mensaje(objmensaje);
            return;
            $("#divContent").empty();
        }
    } else {
        $("#divContent").empty();
        var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
        _mensaje(objmensaje);
        return;

    }
}

/*
function LoadData(data) {

    if (data != "") {
        data = JSON.parse(data);
        ndata = data.length;
        if (ndata > 0) {
            var html = "<table id='tblconsulta' class='table table-bordered'>";
            html += "<thead>";
            html += "<tr>";
            html += "<th class='text-center'></th>";
            html += "<th class='text-center'></th>";
            html += "<th class='text-center'></th>";
            html += "<th class='text-center'></th>";
            html += "<th class='text-center'></th>";

            html += "<th class='text-center'>Id</th>";
            html += "<th class='text-center'>Reporte Tecnico</th>";
            html += "<th class='text-center'>Cliente</th>";
            html += "<th class='text-center'>Fabrica</th>";
            html += "<th class='text-center'>Numero Partida</th>";
            html += "<th class='text-center'>Color</th>";
            html += "<th class='text-center'>Codigo Tela</th>";
            html += "<th class='text-center'>Fecha Ingreso</th>";
            html += "<th class='text-center'>Fecha Recibido</th>";
            html += "<th class='text-center'>Fecha Finalizacion</th>";
            html += "<th class='text-center'>Tipo</th>";
            html += "<th class='text-center'>Status</th>";
            html += "<th class='text-center'>Status Tono</th>";
            html += "<th class='text-center'>Status Comercial</th>";
            html += "</tr>";
            html += "</thead>";
            html += "<tbody>";

            let htmlbody = '';
            data.forEach(x => {
                let exportar = '';
                let enviar = '';
                let StatusPartida = '';

                if (x.Status !== 'Received' && x.Status !== "Sent") {
                    exportar = `<span class='input-group-btn'><button class='btn btn-success btn-sm' type='button' title='Exportar Test' onclick="ExportarReporte('${x.IdPartida}')"><i class='fa fa-file-pdf-o'></i></button></span>`;
                }

                //if (x.Status != 'Sent' || x.Status != 'Received') {
                //    enviar = `<span class='input-group-btn'><button class='btn btn-success btn-sm' type='button' title='Enviar Reporte' onclick="EnviarReporte('${x.IdPartida}','${x.CodigoReporteTecnico}')"><i class='fa fa-paper-plane'></i></button></span>`;
                //}<td class ='text-center'>${enviar}</td>


                if (x.Status == "Approved" || x.Status == "Approved with comments") {
                    StatusPartida = '<b><span style="color:green;">' + x.Status + '</span></b>';
                } else if (x.Status == "Rejected") {
                    StatusPartida = '<b><span style="color:red;">' + x.Status + '</span></b>';
                } else if (x.Status == "Pending") {
                    StatusPartida = '<b><span style="color:#FFD133;">' + x.Status + '</span></b>';
                } else if (x.Status == "Received") {
                    StatusPartida = '<b><span style="color:#A569BD;">' + x.Status + '</span></b>';
                } else if (x.Status == "Sent") {
                    StatusPartida = '<b><span style="color:#2874A6;">' + x.Status + '</span></b>';
                } else {
                    StatusPartida = '<b><span>' + x.Status + '</span></b>';
                }


                htmlbody += `
                    <tr>
                        <td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-primary btn-sm' type='button' title='Editar Solicitud' onclick="Edit('${x.IdPartida}')"><i class ='fa fa-pencil-square-o'></i></button></span></td>
                        <td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-primary btn-sm' type='button' title='Pruebas' onclick="Pruebas('${x.IdPartida}')"><i class ='fa fa-list-alt'></i></button></span></td>
                        <td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-danger btn-sm' type='button' title='Eliminar' onclick="Eliminar('${x.IdPartida}')"><i class ='fa fa-times'></i></button></span></td>
                        <td class ='text-center'><span class ='input-group-btn'><button class ='btn btn-outline btn-warning btn-sm' type='button' title='Exportar Solicitud' onclick="fn_exportsolicitud('${x.IdPartida}')"><i class ='fa fa-file-text-o'></i></button></span></td>
                        <td class ='text-center'>${exportar}</td>                        
                        <td class ='text-center'>${x.IdPartida}</td>
                        <td class ='text-center'>${x.CodigoReporteTecnico}</td>
                        <td class ='text-center'>${x.NombreCliente}</td>
                        <td class ='text-center'>${x.NombreFabrica}</td>
                        <td class ='text-center'>${x.NumeroPartida}</td>
                        <td class ='text-center'>${x.NombreColor}</td>
                        <td class ='text-center'>${x.CodigoTela}</td>
                        <td class ='text-center'>${x.FechaIngreso}</td>
                        <td class ='text-center'>${x.FechaRecibido}</td>
                        <td class ='text-center'>${x.FechaFinalizacion}</td>
                        <td class ='text-center'>${x.Tipo}</td>
                        <td class ='text-center'>${StatusPartida}</td>
                        <td class ='text-center'>${x.StatusTono}</td>
                        <td class ='text-center'>${x.StatusComercial}</td>
                    </tr>
                `;
            });

            html += htmlbody + "</tbody>";
            _('divContent').innerHTML = html;
            $('#tblconsulta').DataTable({
                "pageLength": 50
            });

        } else {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
            _mensaje(objmensaje);
            return;
            $("#divContent").empty();
        }
    } else {
        $("#divContent").empty();
        var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
        _mensaje(objmensaje);
        return;

    }
}
*/

//function LoadData(data) {

//    if (data != "") {
//        data = JSON.parse(data);
//        ndata = data.length;
//        if (ndata > 0) {
//            var html = "<table id='tblconsulta' class='table table-bordered'>";
//            html += "<thead>";
//            html += "<tr>";
//            html += "<th class='text-center'></th>";
//            html += "<th class='text-center'></th>";
//            html += "<th class='text-center'></th>";
//            html += "<th class='text-center'></th>";
//            html += "<th class='text-center'>Id</th>";
//            html += "<th class='text-center'>Reporte Tecnico</th>";
//            html += "<th class='text-center'>Cliente</th>";
//            html += "<th class='text-center'>Fabrica</th>";
//            html += "<th class='text-center'>Numero Partida</th>";
//            html += "<th class='text-center'>Color</th>";
//            html += "<th class='text-center'>Codigo Tela</th>";
//            html += "<th class='text-center'>Fecha Ingreso</th>";
//            html += "<th class='text-center'>Fecha Finalizacion</th>";
//            html += "<th class='text-center'>Tipo</th>";
//            html += "<th class='text-center'>Status</th>";
//            html += "<th class='text-center'>Status Comercial</th>";
//            html += "</tr>";
//            html += "</thead>";
//            html += "<tbody>";
//            for (var i = 0; i < ndata; i++) {

//                var Status = data[i].Status ;
//                var Exportar = "<span class='input-group-btn'><button class='btn btn-success btn-sm' type='button' title='Exportar PDF' onclick='ExportarReporte(" + data[i].IdPartida + ")'><i class='fa fa-file-pdf-o'></i></button></span>";
//                if (Status == "Received") {
//                    Exportar = "";
//                }


//                html += "<tr>";
//                html += "<td class='text-center'><span class='input-group-btn'><button class='btn btn-primary btn-sm' type='button' title='Editar Solicitud' onclick='Edit(" + data[i].IdPartida + ")'><i class='fa fa-pencil-square-o'></i></button></span></td>";
//                html += "<td class='text-center'><span class='input-group-btn'><button class='btn btn-primary btn-sm' type='button' title='Pruebas' onclick='Pruebas(" + data[i].IdPartida + ")'><i class='fa fa-list-alt'></i></button></span></td>";
//                html += "<td class='text-center'><span class='input-group-btn'><button class='btn btn-danger btn-sm' type='button' title='Eliminar' onclick='Eliminar(" + data[i].IdPartida + ")'><i class='fa fa-times'></i></button></span></td>";
//                html += "<td class='text-center'>" + Exportar + "</td>";
//                html += "<td class='text-center'>" + data[i].IdPartida + "</td>";
//                html += "<td class='text-center'>" + data[i].CodigoReporteTecnico + "</td>";
//                html += "<td class='text-center'>" + data[i].NombreCliente + "</td>";
//                html += "<td class='text-center'>" + data[i].NombreFabrica + "</td>";
//                html += "<td class='text-center'>" + data[i].NumeroPartida + "</td>";
//                html += "<td class='text-center'>" + data[i].NombreColor + "</td>";
//                html += "<td class='text-center'>" + data[i].CodigoTela + "</td>";
//                html += "<td class='text-center'>" + data[i].FechaIngreso + "</td>";
//                html += "<td class='text-center'>" + data[i].FechaFinalizacion + "</td>";
//                html += "<td class='text-center'>" + data[i].Tipo + "</td>";
//                html += "<td class='text-center'>" + Status + "</td>";
//                html += "<td class='text-center'>" + data[i].StatusComercial + "</td>";
//                html += "</tr>";
//            }
//            html += "</tbody>";
//            $("#divContent").empty();
//            $("#divContent").append(html);
//            //$("#tblconsulta").dataTable();

//            $('#tblconsulta').DataTable({
//                "pageLength": 50
//            });


//        } else {
//            var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
//            _mensaje(objmensaje);
//            return;
//            $("#divContent").empty();
//        }
//    } else {
//        $("#divContent").empty();
//        var objmensaje = { titulo: 'Alerta', mensaje: 'Not found', estado: 'error' };
//        _mensaje(objmensaje);
//        return;

//    }
//}


function LoadInitialData() {
    Get('Laboratorio/Partida/GetDatosCarga', LoadClientSupplier);
}
function LoadClientSupplier(data) {
    var Data = JSON.parse(data);
    var Cliente = JSON.parse(Data[0].Cliente);
    var Proveedor = JSON.parse(Data[0].Fabrica);
    var html = "<option value=''>All</option>" + _comboFromJSON(Cliente, "CodigoCliente", "NombreCliente");
    FillSelect("cboCliente", html);
    html = "<option value=''>All</option>" + _comboFromJSON(Proveedor, "CodigoFabrica", "NombreFabrica");
    FillSelect("cboFabrica", html);
    Search();
}

function FillSelect(id, html) {
    $("#" + id).append(html);
}
function New() {
    let urlaccion = 'Laboratorio/Partida/Solicitud',
        urljs = 'Laboratorio/Partida/Solicitud';
    _Go_Url(urlaccion, urljs, "0");
}
function Edit(id) {
    let urlaccion = 'Laboratorio/Partida/Solicitud',
        urljs = 'Laboratorio/Partida/Solicitud';
    _Go_Url(urlaccion, urljs, id);
}
function Pruebas(id) {
    let urlaccion = 'Laboratorio/Partida/Pruebas',
        urljs = 'Laboratorio/Partida/Pruebas';
    _Go_Url(urlaccion, urljs, id);
}

function ExportarReporte(CodigoPartida) {

    let urlaccion = urlBase() + "Laboratorio/Partida/ReportePartida/" + CodigoPartida;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    return;

}

function ExportarReporteLaboratorio() {

    var IdProveedor = $("#cboFabrica").val();
    var IdCliente = $("#cboCliente").val();

    var txtCodigoReporteTecnico = $("#txtCodigoReporteTecnico").val();
    var txtPartida = $("#txtPartida").val();
    var FI = _convertDate_ANSI($("#txtFI").val());
    var FF = _convertDate_ANSI($("#txtFF").val());
    var par = IdProveedor + "," + IdCliente + "," + txtCodigoReporteTecnico + "," + txtPartida + "," + FI + "," + FF;

    let urlaccion = urlBase() + "Laboratorio/Partida/ReporteLaboratorio?par=" + par;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    return;

}


function BuscarOnEnter(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("btnSearch").click();
    }
}

function Eliminar(codigopartida) {
    swal({
        title: "Are you sure to delete?",
        text: "You will not be able to recover this information!",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        var frm = new FormData();
        frm.append("par", codigopartida);
        Post('Laboratorio/Partida/DeletePartida', frm, Alerta);
    });


    //swal({
    //    title: "Are you sure to delete?",
    //    text: "You will not be able to recover this information!",
    //    type: "warning",
    //    showCancelButton: true,
    //    confirmButtonColor: "#DD6B55",
    //    confirmButtonText: "Yes, delete it!",
    //    closeOnConfirm: true
    //}, function () {



    //});

}

function Alerta(data) {
    var rpta = JSON.parse(data);
    if (rpta.estado == "success") {
        swal({
            title: "Good job!",
            text: rpta.mensaje,
            type: "success",
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Ok',
            closeOnConfirm: true,
            allowEscapeKey: false
        },
            function (isConfirm) {
                let url = 'Laboratorio/Partida/Consulta';
                _Go_Url(url, url, "");
            });
    } else {
        swal("Alert!", rpta.mensaje, "warning");
    }

}


function EnviarReporte(codigopartida,reporte) {
    
    var frm = new FormData();
    frm.append("par", codigopartida);
    frm.append("reporte", reporte);
    Post('Laboratorio/Partida/EnviarReporte', frm, Alerta);
    
}
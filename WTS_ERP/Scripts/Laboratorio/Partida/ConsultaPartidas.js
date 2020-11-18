var ovariables = {
    permisos: [],
    concesionador: 0,
    aprobador: 0
}


$(document).ready(function () {

    //datetimepicker({
    $("#dtFI .input-group.date").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
    });

    //datetimepicker({
    $("#dtFF .input-group.date").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
    });


    req_permisos();

    $('#dtFI .input-group.date').datepicker('update', moment().subtract(1, 'month').format('MM/DD/YYYY'));
    $('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('MM/DD/YYYY'));

    $("#btnSearch").click(function () {
        Search();
    });
    $("#btnExportarReporteLaboratorio").click(function () {
        ExportarReporteLaboratorio();
    });

    LoadInitialData();
});

//Obtener Permisos
function req_permisos() {
    let usuario = $("#hfUsuario").val(), par = JSON.stringify({ usuario: usuario });
    let urlaccion = 'Laboratorio/Partida/Laboratorio_GetPermisos?par=' + par;
    Get(urlaccion, res_permisos);
}

//Mostrar Permisos
function res_permisos(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].permisos != '') {

            ovariables.permisos = JSON.parse(orpta[0].permisos);

            if (ovariables.permisos.length > 0) {
                ovariables.permisos.forEach(x=> {
                    if (x.TipoAprobacion == 1) { ovariables.concesionador = 1 }
                    if (x.TipoAprobacion == 2) { ovariables.aprobador = 1 }
                });
            }
        }
    }
}

//Obtener Datos Carga Inicial
function LoadInitialData() {
    Get('Laboratorio/Partida/GetDatosCarga', LoadClientSupplier);
}

//Distribuir Datos 
function LoadClientSupplier(data) {
    var Data = JSON.parse(data);
    var Cliente = JSON.parse(Data[0].Cliente);
    var Proveedor = JSON.parse(Data[0].Fabrica);
    var html = "<option value=''>All</option>" + _comboFromJSON(Cliente, "CodigoCliente", "NombreCliente");
    FillSelect("cboCliente", html);
    //html = "<option value=''>All</option>" + _comboFromJSON(Proveedor, "CodigoFabrica", "NombreFabrica");
    //FillSelect("cboFabrica", html);


    var IdProveedor = parseInt($("#hfIdProveedor").val());

    if (IdProveedor === 0) {
        html = "<option value=''>Seleccione</option>" + _comboFromJSON(Proveedor, "CodigoFabrica", "NombreFabrica");
        FillSelect("cboFabrica", html);
    } else {
        var ProveedorFilter = Proveedor.filter(x => x.IdProveedor === IdProveedor);

        html = _comboFromJSON(ProveedorFilter, "CodigoFabrica", "NombreFabrica");
        FillSelect("cboFabrica", html);
    }

    Search();
}

//Buscar Partida
function Search() {
    var IdProveedor = $("#cboFabrica").val();
    var IdCliente = $("#cboCliente").val();

    var txtCodigoReporteTecnico = $("#txtCodigoReporteTecnico").val();
    var txtPartida = $("#txtPartida").val();
    var FI = _convertDate_ANSI($("#txtFI").val());
    var FF = _convertDate_ANSI($("#txtFF").val());
    var codigotela = _('txtcodigotela').value;
    var par = IdProveedor + "," + IdCliente + "," + txtCodigoReporteTecnico + "," + txtPartida + "," + FI + "," + FF + "," + codigotela;
    Get('Laboratorio/Partida/Search?par=' + par, LoadData);
}

//Cargar Data - Index
function LoadData(data) {
    if (data != "") {       
        if (ovariables.aprobador == 1) { _('hfUsuarioComercial').value = ovariables.aprobador }
       
        data = JSON.parse(data);
        ndata = data.length;

        if (ndata > 0) {

            var htmlhead = `<table id='tblconsulta' class='table table-bordered'  style='width: 100%; max-width: 100%;  padding-right: 0px;'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                `;

            var htmlconsesion = ``, htmlaprobacion = ``, htmlstatustono = ``;
            if (ovariables.concesionador == 1) {
                htmlconsesion = `<th></th>`;
                htmlstatustono = `<th>Status Tono</th>`
            }

            if (ovariables.aprobador == 1) {
                htmlaprobacion = `<th></th>`;
                htmlstatustono = `<th>Status Tono</th>`;
            }

            htmlhead += htmlconsesion + htmlaprobacion;

            htmlhead += `
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
                `;
            htmlhead += htmlstatustono;
            htmlhead += `<th>Status Comercial</th>`;
            htmlhead += `</tr></thead>`;

            var htmlbody = `<tbody>`;

            data.forEach(x => {

                let exportar = ``;
                if (x.Status !== 'Received' && x.Status !== 'Sent') {                    
                    exportar = `
                         <button type='button' title='Exportar Test' class ='btn btn-outline btn-success' onclick="ExportarReporte('${x.IdPartida}')">
                            <span class ='fa fa-file-pdf-o'></span>
                        </button>
                    `;
                }

                let consesionar = ``;
                if (ovariables.concesionador == 1) {
                    consesionar += `<td class ='text-center'>`;
                    if (x.Status == 'Rejected' && x.StatusComercial == 'Pending') {                        
                        consesionar += `
                                <button type='button' title='Consesionar Partida' class ='btn btn-outline btn-primary' onclick="AprobarPartida('${x.IdPartida}','${x.StatusLit}','${x.CodigoReporteTecnico}','${x.NumeroPartida}','${x.IdProveedor}','${x.IdClienteERP}','${x.NombreCliente}','${x.NombreFabrica}')">
                                    <span class ='fa fa-thumbs-up'></span>
                                </button>
                        `;
                    }
                    consesionar += ` </td>`;
                }

                let aprobar = ``;
                if (ovariables.aprobador == 1) {
                    aprobar += `<td class ='text-center'>`;
                    if (x.Status == 'Pending' || (x.StatusLit == 'Z' && x.StatusTono == 'Pendiente') || (x.StatusLit == 'R' && x.StatusTono == 'Pendiente')) {
                        aprobar += `
                                <button type='button' title='Aprobar Tono' class ='btn btn-outline btn-info' onclick="MostrarVentaAprobarTono('${x.IdPartida}','${x.IdClienteERP}','${x.IdProveedor}','${x.StatusLit}','${x.CodigoReporteTecnico}','${x.ComentarioTono}')">
                                    <span class ='fa fa-check-circle'></span>
                                </button>
                            `;
                    }
                    aprobar += `</td>`;
                }

                let statuspartida = ``;
                if (x.Status == 'Approved' || x.Status == 'Approved with comments') { statuspartida = '<b><span style="color:green;">' + x.Status + '</span></b>' }
                else if (x.Status == "Rejected") { statuspartida = '<b><span style="color:red;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Pending') { statuspartida = '<b><span style="color:#FFD133;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Received') { statuspartida = '<b><span style="color:#A569BD;">' + x.Status + '</span></b>'; }
                else if (x.Status == 'Sent') { statuspartida = '<b><span style="color:#2874A6;">' + x.Status + '</span></b>'; }
                else { statuspartida = '<b><span>' + x.Status + '</span></b>'; }

                let statustono = ``;
                if (ovariables.concesionador == 1 || ovariables.aprobador == 1) {
                    statustono = `<td class ='text-center'>${x.StatusTono}</td>`;                    
                }

                htmlbody += `
                    <tr>                        
                        <td class ='text-center'>
                            <button type='button' title='Pruebas' class ='btn btn-outline btn-primary' onclick="Pruebas('${x.IdPartida}')">
                                <span class ='fa fa-list'></span>
                            </button>
                        </td>
                        <td class ='text-center'>
                            <button type='button' title='Exportar Solicitud' class ='btn btn-outline btn-warning' onclick="fn_exportsolicitud('${x.IdPartida}')">
                                <span class ='fa fa-file-text-o'></span>
                            </button>
                        </td>
                        <td class ='text-center'>${exportar}</td>
                        ${consesionar}
                        ${aprobar}
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
                        ${statustono}
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
                searching: true,
                info: false,
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

//Abrir Popup
function MostrarVentaAprobarTono(IdPartida, IdCliente, IdProveedor,Status, ReporteTecnico, ComentarioColor) {
    $("#hfIdPartidaTono").val(IdPartida);
    $("#lblReporteTecnicoTono").text(ReporteTecnico);
    $("#txt_reportetecnico").val(ReporteTecnico);
    $("#txtstatusfinal").val(Status);
    $("#txt_idcliente").val(IdCliente);
    $("#txt_idproveedor").val(IdProveedor);
    $("#txtComentarioColor").val(ComentarioColor);
    $("#mdAprobarTono").modal("show");
}

//Validar tono
function required_tono(oenty) {
    var divformulario = _(oenty.id);
    var elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    var array = Array.prototype.slice.apply(elementsselect2); //elementsselect2
    retorno = true;
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode.parentNode;
        if (valor == '' || valor == 'No Aplica') { padre.classList.add('has-error'); retorno = false; }
        else { padre.classList.remove('has-error');  }
    })
    return retorno;
}

//Consultar Aprobacion
function req_aprobar_tono() {
    let requerido = required_tono({ id: 'tono', clase: '_enty' });
    if (requerido) {
        swal({
            title: "Save Data",
            text: "Are you sure save these values?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            AprobarTono();
        });
    }
    else {
        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
}

//Aprobar Tono
function AprobarTono() {
    var frm = new FormData();
    frm.append("idpartida", $("#hfIdPartidaTono").val());
    frm.append("reportetecnico", $("#txt_reportetecnico").val());
    frm.append("idclienteerp", $("#txt_idcliente").val());
    frm.append("idproveedor", $("#txt_idproveedor").val());
    frm.append("status", $("#txtstatusfinal").val());
    frm.append("comentariocolor", $("#txtComentarioColorComercial").val());
    frm.append("estadotono", $("#cboestadotono").val());
    $("#mdAprobarTono").modal("hide");
    Post('Laboratorio/Partida/AprobarTono', frm, Alerta, false);
}

//Respuesta de Aprobar
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
                let url = 'Laboratorio/Partida/ConsultaPartidas';
                _Go_Url(url, url, "");
            });
    } else {
        swal("Alert!", rpta.mensaje, "warning");
    }
}

//Consultar Consesion
function AprobarPartida(IdPartida, Status, Reporte, Partida, IdProveedor, IdCliente, Cliente, Fabrica) {

    swal({
        title: "Save Data",
        text: "Are you sure confirm these change?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        var frm = new FormData();

        frm.append("idpartida", IdPartida);
        frm.append("reportetecnico", Reporte);
        frm.append("partida", Partida);
        frm.append("idclienteerp", IdCliente);
        frm.append("idproveedor", IdProveedor);
        frm.append("status", Status);
        frm.append("cliente", Cliente);
        frm.append("fabrica", Fabrica);

        Post('Laboratorio/Partida/AprobarPartidaRechazada', frm, Alerta, false);
    });
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


function FillSelect(id, html) {
    $("#" + id).append(html);
}

function Pruebas(id) {
    let urlaccion = 'Laboratorio/Partida/PruebasConsulta',
        urljs = 'Laboratorio/Partida/PruebasConsulta';
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
    let codigotela = _('txtcodigotela').value;
    var par = IdProveedor + "," + IdCliente + "," + txtCodigoReporteTecnico + "," + txtPartida + "," + FI + "," + FF + "," + codigotela;

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
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    }, function () {

        var frm = new FormData();
        frm.append("par", codigopartida);
        Post('Laboratorio/Partida/DeletePartida', frm, Alerta);

    });

}




//'${x.IdPartida}','${x.StatusLit}','${x.CodigoReporteTecnico}','${x.NumeroPartida}','${x.IdProveedor}','${x.IdClienteERP}



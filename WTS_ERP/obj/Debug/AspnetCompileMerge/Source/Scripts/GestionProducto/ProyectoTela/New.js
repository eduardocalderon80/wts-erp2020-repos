var LabDipStatus = null;
var LabDipStatusF = null;
var LabDip = null;
var FabricProject = null;

function load() {
    LabDipStatus = new Array();
    LabDipStatusF = new Array();
    LabDip = new Array();
    $("#btnSave").click(function () {
        Guardar();
    });
    $("#btnCancel").click(function () {
        let urlaccion = 'GestionProducto/ProyectoTela/Index',
            urljs = 'GestionProducto/ProyectoTela/Index';
        _Go_Url(urlaccion, urljs, '');
    });
    _('btn_addlabdip').addEventListener('click', AgregarLabDip);
    _('btn_addproceso').addEventListener('click', agregarproceso_proyecto);
    //$("#cboCliente").change(function () {
    //    var frm = new FormData();
    //    let par = { idcliente: $(this).val(), idgrupocomercial: ovariables.idgrupocomercial }
    //    //frm.append("par", $(this).val());
    //    frm.append("par", JSON.stringify(par));
    //    Get('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    //});

    _('cboCliente').addEventListener('change', GetDatabyClient);

    $("#dtLabDipStatus").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment(),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });


    $("#cboDyeProcess").change(function () {
        let Tipo = this.value;
        CargarTipoLabdip(Tipo);
    });

    $("#cboStatusLabDip").change(function () {
        let Tipo = this.value;
        if (Tipo == 4 || Tipo == 5) {            
            $('#_iddivApproval').removeClass('hide');
        } else {
            $('#_iddivApproval').addClass('hide');
        }
    });

};

function GetDatabyClient(event) {
    var frm = new FormData();
    let par = { idcliente: $("#cboCliente").val(), idgrupocomercial: ovariables.idgrupocomercial }
    //frm.append("par", JSON.stringify(par));
    //Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, ObtenerDatosCargaPorCliente);
}

function CargarTipoLabdip(Tipo) {
    if (Tipo == 1) {
        $('.TipoLabDip').val(3);        
       
    }
     if (Tipo == 2) {
        $('.TipoLabDip').val(2);
        
     }
     if (Tipo == 3) {
         $('.TipoLabDip').val(1);
        
     }
   
}
 
function EliminarProceso(obj) {
    $(obj).closest("tr").remove();
}

function ObtenerDatosCargaPorCliente(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);

        if (JSONdata[0].Temporada != null) {
            var Temporada = JSON.parse(JSONdata[0].Temporada);
            $("#cboSeason").empty();
            var htmlTemporada = "<option value=''>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
            $("#cboSeason").append(htmlTemporada);
        }

        if (JSONdata[0].Division != null) {
            var Division = JSON.parse(JSONdata[0].Division);
            $("#cboDivision").empty();
            var htmlDivision = "<option value=''>Select One</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
            $("#cboDivision").append(htmlDivision);
        }

        //_('cboFabricSupplier').innerHTML = '';
        ////_('cboFabricSupplier').innerHTML = _comboFromCSV(JSONdata[0].proveedor);
        //if (JSONdata[0].ProveedorTextil != null) {
        //    var ProveedorTextil = JSON.parse(JSONdata[0].ProveedorTextil);
            
        //    var htmlDivision =  _comboFromJSON(ProveedorTextil, "IdProveedor", "NombreProveedor");
        //    $("#cboDivision").append(htmlDivision);
        //}
        
        //$(".cboFabricSupplier").select2();
    }
}

function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var Proveedor = JSON.parse(JSONdata[0].Proveedor);
    //var Proceso = JSON.parse(JSONdata[0].Proceso);   
    var Status = JSON.parse(JSONdata[0].Status);
    var Tipo = JSON.parse(JSONdata[0].Tipo);
    var Aprobacion = JSON.parse(JSONdata[0].Aprobacion);

    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);

    var htmlProveedor = _comboItem({ value: '0', text: 'Select' }) + _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
    $("#cboDyeingHouse").append(htmlProveedor);

    _('cboFabricSupplier').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
    $(".cboFabricSupplier").select2();

    _('cbo_proceso_add').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(JSONdata[0].Proceso);
    _('cboDyeProcess').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(JSONdata[0].DyeingProcess);

    //var htmlProceso = _comboFromJSON(Proceso, "ValorEstado", "NombreEstado");
    //$("#cboProceso").append(htmlProceso);

    var htmlStatus = _comboFromJSON(Status, "ValorEstado", "NombreEstado");
    $("#cboStatusLabDip").append(htmlStatus);

    var htmlTipo = _comboFromJSON(Tipo, "ValorEstado", "NombreEstado");
    $("#cboTipo").append(htmlTipo);

    var htmlAprobacion = _comboFromJSON(Aprobacion, "ValorEstado", "NombreEstado");
    $("#cboAprobacion").append(htmlAprobacion);
}

//function AgregarLabDip(obj) {
//    var IdCliente = $("#cboCliente").val();
//    var IdTemporada = $("#cboTemporada").val();
//    if (IdCliente != "") {
//        var contador = parseInt($("#hfLabdipCont").val());
//        contador++
//        var htmlTipo = "<select class='form-control'>" + $("#cboTipo").html() + "</select>";
//        var htmlAprobacion = "<select class='form-control'>" + $("#cboAprobacion").html() + "</select>";
//        var htmlProceso = "<select class='form-control'>" + $("#cboProceso").html() + "</select>";
//        var htmlSeason = "<select class='form-control'>" + $("#cboSeason").html() + "</select>";
//        html = "<tr data-id='" + contador + "'>";
//        html += "<td><input type='text' class='form-control'></td>";
//        html += "<td><input type='text' class='form-control'></td>";        
//        html += "<td>" + htmlTipo + "</td>";
//        html += "<td>" + htmlAprobacion + "</td>";
//        //html += "<td><input type='text' class='form-control'></td>";
//        html += "<td><select class='form-control'>" + $('#cboDyeingHouse').html() + "</select></td>";
//        html += "<td class='hide'>" + htmlProceso + "</td>";
//        html += "<td>" + htmlSeason + "</td>";
//        html += "<td class='text-center'><span class='glyphicon glyphicon-th' style='cursor:pointer;font-size:15px;color:black;' data-id=" + contador + " onclick='MostrarLabdipStatus(this);'></span></td>";
//        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>";
//        html += "</tr>";
//        $("#tblLabDip tbody").append(html);
//        $("#hfLabdipCont").val(contador);
//        $("#cboCliente").prop('disabled', 'disabled');
//    } else {
//        var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Client !!', estado: 'error' };
//        _mensaje(objmensaje);
//    }
//}

function EliminarLabDip(obj) {
    $(obj).closest("tr").remove();
    var Len = $($(obj).closest("tbody")).length;
    if (Len == 0) {
        $("#cboCliente").prop('disabled', false);
    }
}

function MostrarLabdipStatus(obj) {
    $("#tblLabdipStatus tbody").empty();
    var row = $(obj).closest("tr")[0];
    var id = parseInt($(obj).attr("data-id"));
    var color = $(row.cells[0]).find("input").val();
    if (color.trim() != "") {
        $("#txtColor").val(color);
        CargarLabDipStatus(id);
        $("#hfLabdipCurrent").val(id);
        $('#mdStatus').modal('show');
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter a color (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function AgregarLabdipStatus() {
    var contador = parseInt($("#hfLabdipStatuspCont").val());
    contador++;
    var StatusId = $("#cboStatusLabDip").val();
    var StatusName = $("#cboStatusLabDip :selected").text();
    var IdLabdip = parseInt($("#hfLabdipCurrent").val());
    var Date = $("#dtLabDipStatus").find("input").val();
    var Alternativa = $("#txtAlternativa").val();
    var DyeingHouseCode = $("#txtDyeingCode").val();
    var Comment = $("#txtComment").val();

    if (!ExisteLabdipStatus(IdLabdip, StatusId)) {
        var objLabdipStatus = {
            Id: contador,
            IdLabdip: IdLabdip,
            StatusId: StatusId,
            StatusName: StatusName,
            Date: Date,
            Eliminado: 0,
            Alternativa: Alternativa,
            DyeingHouseCode: DyeingHouseCode,
            Comment: Comment
        }
        var row = "";
        row += "<tr><td>" + StatusName + "</td><td>" + Date + "</td><td>" + Alternativa + "</td><td>" + DyeingHouseCode + "</td><td>" + Comment + "</td><td><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' data-id='" + contador + "' onclick='EliminarLabDipStatus(this);'></span></td></tr>";
        LabDipStatus.push(objLabdipStatus);
        $("#tblLabdipStatus tbody").append(row);
        $("#hfLabdipStatuspCont").val(contador);
        $("#txtAlternativa").val('');
        $("#txtDyeingCode").val('');
        $("#txtComment").val('');
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Already exists status "' + StatusName + '" in the list below !!!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function EliminarLabDipStatus(obj) {
    var Id = parseInt($(obj).attr("data-id"));
    var LabDip = LabDipStatus.filter(function (e) { return (e.Id === Id) });
    if (LabDip[0] != null) {
        LabDip[0].Eliminado = 1;
    }
    $(obj).closest("tr").remove();
}

function CargarLabDipStatus(id) {
    if (LabDipStatus.length > 0) {
        var LabDip = LabDipStatus.filter(function (e) { return (e.IdLabdip === id && e.Eliminado === 0) });
        if (LabDip.length > 0) {
            var row = "";
            for (var i = 0; i < LabDip.length; i++) {
                row += "<tr><td>" + LabDip[i].StatusName + "</td><td>" + LabDip[i].Date + "</td><td>" + LabDip[i].Alternativa + "</td><td>" + LabDip[i].DyeingHouseCode + "</td><td>" +LabDip[i].Comment + "</td><td><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' data-id='" +LabDip[i].Id + "' onclick='EliminarLabDipStatus(this);'></span></td></tr>";
            }
            $("#tblLabdipStatus tbody").append(row);
        }
    }
}

function ExisteLabdipStatus(IdLabdip, StatusId) {
    if (LabDipStatus.length > 0) {
        var LabDip = LabDipStatus.filter(function (e) { return (e.IdLabdip === IdLabdip && e.StatusId === StatusId && e.Eliminado === 0) });
        if (LabDip.length > 0) {
            return true;
        }
        return false;
    }
    return false;
}

function Guardar() {
    if (ValidarCamposRequeridos()) {
        var frm = new FormData();
        var FabricProjectJSON = "";
        FabricProjectJSON = JSON.stringify(FabricProject);
        var LabDipJSON = "";
        var LabDipStatusJSON = "";
        var nLabDip = LabDip.length;
        if (nLabDip > 0) {
            LabDipJSON = JSON.stringify(LabDip);
            if (LabDipStatusF.length > 0) {
                LabDipStatusJSON = JSON.stringify(LabDipStatusF);
            }
        }
        // LISTA DE PROCESOS
        let procesos = JSON.stringify(generarListaProcesos());
        frm.append("Tipo", 1);
        frm.append("FabricProject", FabricProjectJSON);
        frm.append("Labdip", LabDipJSON);
        frm.append("LbadipStatus", LabDipStatusJSON);
        frm.append("LabdipEliminado", "");
        frm.append("LbadipStatusEliminado", "");
        frm.append("procesos", procesos);
        frm.append("procesos_eliminados", '');
        Post('GestionProducto/ProyectoTela/Save', frm, Alerta);
    }
}

function Alerta(data) {
    var rpta = JSON.parse(data);
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    if (objmensaje.estado != "error") {
        let urlaccion = 'gestionproducto/proyectotela/edit',
            urljs = 'gestionproducto/proyectotela/edit';
        let par = 'idtipotela:' + _('hfTipo').value + ',idtela:' + rpta.id + ',idgrupocomercial:' + ovariables.idgrupocomercial;
            //var par = $("#hfTipo").val() + "," + rpta.id;
            _Go_Url(urlaccion, urljs, par);
        return false;
    }
    _mensaje(objmensaje);
}

function ValidarCamposRequeridos() {
    var cont = 0;
    var IdCliente = $("#cboCliente").val();
    var IdTemporada = $("#cboSeason").val();
    var IdProveedor = $("#cboFabricSupplier").val();
    var Construction = $("#txtConstruction").val();
    var Yarn = $("#txtYarn").val();
    var Content = $("#txtContent").val();
    var Weight = $("#txtWeight").val();
    var Lavado = $("#cboLavado").val();
    var Status = $("#cboStatus").val();
    var Comments = $("#txtComents").val();
    var DyeProcess = _('cboDyeProcess').value;
    if (Weight == "") {
        Weight = 0
    }
    FabricProject = {
        IdProyectoTela: 0,
        IdCliente: IdCliente,
        IdTemporada: IdTemporada,
        IdProveedor: IdProveedor,
        Construction: Construction,
        Yarn: Yarn,
        Content: Content,
        Weight: Weight,
        Lavado: Lavado,
        Status: Status,
        Comments: Comments,
        Cambio: 0,
        DyeProcess: DyeProcess
    }
    if (FabricProject.IdCliente == "" || FabricProject.IdTemporada == "") {
        cont++;
    }

    var LabDipLen = $("#tblLabDip tbody").length;

    if (LabDipLen > 0) {
        LabDip = new Array();
        LabDipStatusF = new Array();
        var Id = 1;
        $("#tblLabDip tbody tr").each(function () {

            var IdLabdip = parseInt($(this).attr("data-id"));
            var Color = $(this.cells[0]).find("input").val();
            var Standard = $(this.cells[1]).find("input").val();
            var Tipo = $(this.cells[2]).find("select").val();
            var Aprobacion = $(this.cells[3]).find("select").val();
            //var DyingHouse = $(this.cells[3]).find("input").val();
            var DyeingHouse = $(this.cells[4]).find("select").val();
            var Proceso = $(this.cells[5]).find("select").val();
            var Temporada = $(this.cells[6]).find("select").val();

            var objLabDip = {
                Id: Id,
                IdLabdip: IdLabdip,
                Color: Color,
                Standard:Standard,
                Tipo: Tipo,
                Aprobacion: Aprobacion,
                DyeingHouse: DyeingHouse,
                Proceso: Proceso,
                Temporada: Temporada
            }

            var filtro = LabDipStatus.filter(function (e) { return (e.IdLabdip === IdLabdip && e.Eliminado === 0) });
            var nfiltro = filtro.length;
            if (nfiltro > 0) {
                for (var i = 0; i < nfiltro; i++) {
                    var objLabdipStatus = {
                        IdLabdip: Id,
                        StatusId: filtro[i].StatusId,
                        StatusName: filtro[i].StatusName,
                        Date: filtro[i].Date,
                        Alternativa: filtro[i].Alternativa,
                        DyeingHouseCode: filtro[i].DyeingHouseCode,
                        Comment: filtro[i].Comment
                    }
                    LabDipStatusF.push(objLabdipStatus);
                }
            }
            if (objLabDip.Color == "" || objLabDip.Temporada == "") {
                cont++;
            }
            LabDip.push(objLabDip);
            Id++;
        });
    }
    if (cont > 0) {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please fill all required fields !!! (*)', estado: 'error' };
        _mensaje(objmensaje);
        return false;
    }
    return true;
}

function ValidarNumero(obj) {
    var value = $(obj).val();
    if (isNaN(value)) {
        $(obj).val("");
        return false;
    }
    return true;
}

function agregarproceso_proyecto() {
    let html = '', combo = _('cbo_proceso_add'), valorproceso = combo.value, nombreproceso = combo.options[combo.selectedIndex].text;
    let mensaje = validar_agregarproceso();
    if (mensaje == false) {
        return false;
    }
    html = `<tr data-par='idproyectotelaxproceso:0,idproceso:${valorproceso}'>
            <td class='text-center'>
                <button class='btn btn-sm btn-danger cls_deleteproceso'>
                    <span class ='fa fa-trash-o'></span>
                </button></td>
            <td>${nombreproceso}</td>
            <td><input type='text' onkeyup='Mayus(this)' value='' class ='form-control cls_comentario_proceso' /></td>
        </tr>`;
    $('#tbody_process').append(html);
    handler_deleteproceso_alagregar();
}

function validar_agregarproceso() {
    let tbl = _('tbody_process'), combo = _('cbo_proceso_add'), valorproceso = combo.value, totalfilas = tbl.rows.length, mensaje = '', requerido = false,
        pasovalidacion = true;
    if (valorproceso == '') {
        _('div_grupocomboproceso').classList.add('has-error');
        requerido = true;
        pasovalidacion = false;
    }
    if (requerido == false) {
        for (let i = 0; i < totalfilas; i++) {
            let par = tbl.rows[i].getAttribute('data-par'), id = _par(par, 'idproceso');
            
            if (id == valorproceso) {
                mensaje += 'El proceso ya se agregó';
                break;
            }
        }
    }    
    if (mensaje != '') {
        pasovalidacion = false;
        _swal({ titulo: 'error', mensaje: mensaje });
    }    
    return pasovalidacion;
}

function handler_deleteproceso() {
    let tbl = _('tbody_process'), arraydelete = _Array(tbl.getElementsByClassName('cls_deleteproceso'));
    arraydelete.forEach(x => x.addEventListener('click', e => ejecutardeleteproceso(e)));
}

function ejecutardeleteproceso(event) {
    let o = event.target, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }
    if (fila != null) {
        fila.parentNode.removeChild(fila);
    }
}

function handler_deleteproceso_alagregar() {
    let tbl = _('tbody_process'), ultimafila = tbl.rows.length, arraydelete = _Array(tbl.getElementsByClassName('cls_deleteproceso')), contador = 0;

    for (let i = 0; i < ultimafila; i++) {
        contador++;
        if (contador == ultimafila) {
            arraydelete[i].addEventListener('click', ejecutardeleteproceso);
            break;
        }
    }
}

function generarListaProcesos() {
    let filas = _Array(_('tbody_process').rows), lista = [], obj = {};
    filas.forEach(x => {
        obj = {};
        let par = x.getAttribute('data-par'), idproyectotelaxproceso = _par(par, 'idproyectotelaxproceso'), idproceso = _par(par, 'idproceso');
       obj.idproyectotelaxproceso = idproyectotelaxproceso;
        obj.idproceso = idproceso;
        obj.comentario = x.cells[2].children[0].value;

        lista.push(obj);
    });
    return lista;
}

function AgregarLabDip(obj) {
    var IdCliente = $("#cboCliente").val();
    var Cliente = $("#txtCliente").val();
    var IdTemporada = $("#cboTemporada").val();
    if (IdCliente != "" || Cliente != "") {
        var contador = parseInt($("#hfLabdipCont").val());
        contador++;
        var htmlTipo = "<select class='form-control TipoLabDip' data-initial=''>" + $("#cboTipo").html() + "</select>";
        var htmlAprobacion = "<select class='form-control' data-initial=''>" + $("#cboAprobacion").html() + "</select>";
        var htmlProceso = ''; //"<select class='form-control' data-initial=''>" + $("#cboProceso").html() + "</select>";
        var htmlSeason = "<select class='form-control' data-initial=''>" + $("#cboSeason").html() + "</select>";
        html = "<tr data-id='" + contador + "' data-status='new'>";
        html += "<td><input type='text' onkeyup='Mayus(this)' class='form-control' data-initial=''></td>";
        html += "<td><input type='text' onkeyup='Mayus(this)'  class='form-control' data-initial=''></td>";
        html += "<td>" + htmlTipo + "</td>";
        html += "<td>" + htmlAprobacion + "</td>";
        //html += "<td><input type='text' class='form-control' data-initial=''></td>";
        html += "<td><select id='cboDyeingHouse" + contador + "' class='form-control'>" + $('#cboDyeingHouse').html() + "</select></td>";
        html += "<td class='hide'>" + htmlProceso + "</td>";
        html += "<td>" + htmlSeason + "</td>";
        html += "<td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id=" + contador + " onclick='MostrarLabdipStatus(this);'></span></td>";
        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>";
        html += "</tr>";
        $("#tblLabDip tbody").append(html);
        $("#hfLabdipCont").val(contador);
        $("#cboCliente").prop('disabled', 'disabled');
        $("#cboDyeingHouse" + contador).select2();
        $("#cboDyeProcess").trigger("change");
    } else {

        var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Client !!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function req_ini() {
    Get('GestionProducto/ProyectoTela/ObtenerDatosCarga', ObtenerDatosCarga);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
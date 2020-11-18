var LabDipStatus = null;
var LabDipStatusF = null;
var LabDip = null;
var FabricProject = null;
var StatusL = null;
var LabDipEliminado = null;
var LabDipStatusEliminado = null;
var TelaSTR = null;

var oEdit = {
    atipo: [],
    aaprobacion: [],
    atemporada:[]
}


function load() {
    LabDipStatus = new Array();
    LabDipStatusF = new Array();
    LabDip = new Array();
    StatusL = new Array();
    LabDipEliminado = new Array();
    LabDipStatusEliminado = new Array();
    TelaSTR = "";

    var par = _('txtpar').value;
    let Tipo = parseInt(_par(par, 'idtipotela'));
    if (Tipo == 1) {
        _('hfIdProyectoTela').value = _par(par, 'idtela');
    } else {
        _('hfIdTela').value = _par(par, 'idtela');
        _('div_principal_proceso').classList.add('hide');
    }

    $("#hfTipo").val(Tipo);

    $("#btnCancel").click(function () {
        let urlaccion = 'GestionProducto/ProyectoTela/Index',
            urljs = 'GestionProducto/ProyectoTela/Index';
        _Go_Url(urlaccion, urljs, '');
    });

    $("#btnSave").click(function () {
        Guardar();
    });

    // :sarone
    _('btnReporteResumenLabdip').addEventListener('click', function () {
        let cliente= _('txtCliente').value;
        let tela = _('txtCode').value;
        let _parametro = `cliente:${cliente},tela:${tela},${_('txtpar').value}`;

        _modalBody({
            url: 'GestionProducto/ProyectoTela/ReporteResumenLabdip',
            ventana: 'ReporteResumenLabdip',
            titulo: 'Resumen de Labdip Aprobados',
            parametro: `${_parametro}`,
            alto: '',
            ancho: '',
            responsive: 'modal-lg'
        });
    })

    $("#btnnFabricCode").click(function () {
        $('#mdFabricCode').modal('show');
    });

    _('btn_addlabdip').addEventListener('click', AgregarLabDip);
    _('btn_addproceso').addEventListener('click', agregarproceso_proyecto);
    _('btnsavelabdip').addEventListener('click', Guardar);
    
    $("#dtLabDipStatus").datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es',
        defaultDate: moment(),
        showTodayButton: true,
        widgetPositioning: {
            vertical: 'bottom'
        },
    });
    $(".cboFabricSupplier").select2();
    
    _('cboCliente').addEventListener('change', GetDatabyClient);

    $("#btnSearchTela").click(function () {
        var Codigo = $("#txtCodigoTela").val();
        var Familia = $("#cboFamilia").val();

        if (Familia == "") {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Family !!', estado: 'error' };
            _mensaje(objmensaje);
            return false;
        }

        var par = Familia + "," + Codigo;
        var frm = new FormData();
        frm.append("par", par);
        Post('GestionProducto/ProyectoTela/BuscarTela', frm, CargarTela);
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
            limpiarstatus();
        }
    });

        $("#cboFabricSupplier").hide();
        $("#txtProveedor").hide();

        //_('btn_addlabdip').addEventListener('click', fn_add_labdip);

}

function CargarTipoLabdip(Tipo) {
    //if (Tipo == 1) {
    //    $('.TipoLabDip').val(3);

    //}
    //if (Tipo == 2) {
    //    $('.TipoLabDip').val(2);

    //}
    //if (Tipo == 3) {
    //    $('.TipoLabDip').val(1);

    //}
}

function GetDatabyClient(event) {
    var frm = new FormData();
    let par = { idcliente: $("#cboCliente").val(), idgrupocomercial: ovariables.idgrupocomercial }    
    urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, ObtenerDatosCargaPorCliente);
}
 
function CargarTela(data) {
    $("#tblTela").remove();

    var Tela = JSON.parse(data);
    var nTela = Tela.length;
    if (nTela > 0) {
        var html = "";

        html += "<table id='tblTela' class='table table-bordered table-hover'><thead><tr><th>Id</th><th>Code</th><th>Factory</th><th>Family</th><th>Description</th><th></th></tr></thead><tbody>";
        for (var i = 0; i < nTela; i++) {
            html += "<tr>";
            html += "<td>" + Tela[i].IdFichaTecnica + "</td>";
            html += "<td>" + Tela[i].CodigoTela + "</td>";
            html += "<td>" + Tela[i].NombreProveedor + "</td>";
            html += "<td>" + Tela[i].NombreFamilia + "</td>";
            html += "<td>" + Tela[i].NombreTela + "</td>";
            html += "<td class='text-center'><span class='btn-group  btn-group-md pull-center'><button title='Check' type='button' onclick='ActualizarCodigoTela(" + Tela[i].IdFichaTecnica + ");' class='btn btn-default'><span class='fa fa-check'></span></button></span></td>";
            html += "</tr>";
        }
        html += "</tbody></table>";
        $("#divTela").empty();
        $("#divTela").append(html);

        $('#tblTela').DataTable({
            paging: true,
            "scrollY": 300
        });
    }
}

function ActualizarCodigoTela(id) {
    var IdProyectoTela = $("#hfIdProyectoTela").val();
    var par = IdProyectoTela + "," + id;
    var frm = new FormData();
    frm.append("par", par);
    Post('GestionProducto/ProyectoTela/ActualizarIdTela', frm, AlertaTela);
}

function AlertaTela(data) {
    var rpta = JSON.parse(data);
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    if (objmensaje.estado != "error") {
        $('#mdFabricCode').modal('hide');
    }
    _mensaje(objmensaje);
}

function ObtenerDatosCargaPorCliente(data) {

    if (data != "") {
        var JSONdata = JSON.parse(data);

        if (JSONdata[0].Temporada != null) {
            var Temporada = JSON.parse(JSONdata[0].Temporada);
            $("#cboSeason").empty();
            var htmlTemporada = "<option value='0'>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
            $("#cboSeason").append(htmlTemporada);
        }

    }
}

// :sarone
function ObtenerProyectoTela(data) {
    if (data != "") {
        var idtipo = _("hfTipo").value;
        var oTipo = {
            "1": "Fabric Project",
            "2": "Fabric Code"
        }
        var Tipo = typeof oTipo[`${idtipo}`] === 'undefined' ? '' : oTipo[`${idtipo}`];
        var JSONdata = JSON.parse(data);
        var LabDipMaxId = 0;
        var LabDipStatusMaxId = 0;

        if (Tipo === "Fabric Project") {

            $("#cboFabricSupplier").show();

            var ProyectoTela = null;
            var Labdip = [];
            var Temporada = null;
            var Familia = JSON.parse(JSONdata[0].Familia);
            var Status = JSON.parse(JSONdata[0].Status);
            StatusL = Status;

            var Tipo = JSON.parse(JSONdata[0].Tipo);
            var Aprobacion = JSON.parse(JSONdata[0].Aprobacion);

            var Proveedor = JSON.parse(JSONdata[0].DyeingHouse);
            var htmlProveedor = _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
            $("#cboFabricSupplier").append(htmlProveedor);
            
            _('cboDyeProcess').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(JSONdata[0].DyeingProcess);
            _('cbo_proceso_add').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(JSONdata[0].Proceso);

            var htmlStatus = _comboFromJSON(Status, "ValorEstado", "NombreEstado");
            $("#cboStatusLabDip").append(htmlStatus);

            var htmlTipo = _comboItem({ value: '0', text: 'Select One' }) + _comboFromJSON(Tipo, "ValorEstado", "NombreEstado");
            $("#cboTipo").append(htmlTipo);
            oEdit.atipo = Tipo;

            var htmlAprobacion =  _comboItem({ value: '0', text: 'Select One' }) + _comboFromJSON(Aprobacion, "ValorEstado", "NombreEstado");
            $("#cboAprobacion").append(htmlAprobacion);
            oEdit.aaprobacion = Aprobacion;

            var htmlFamilia = _comboFromJSON(Familia, "IdFamilia", "NombreFamilia");
            $("#cboFamilia").append(htmlFamilia);   //**

            var htmlProveedor = _comboItem({ value: '0', text: 'Select One' }) + _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
            $("#cboDyeingHouse").append(htmlProveedor);

            if (JSONdata[0].Temporada != "") {
                Temporada = JSON.parse(JSONdata[0].Temporada);
                $("#cboSeason").empty();
                var htmlTemporada = "<option value='0'>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
                $("#cboSeason").append(htmlTemporada);

                oEdit.atemporada = Temporada;
            }


            if (JSONdata[0].ProyectoTela != "") {
                ProyectoTela = JSON.parse(JSONdata[0].ProyectoTela);
                if (JSONdata[0].Labdip != "") {
                    Labdip = JSON.parse(JSONdata[0].Labdip);
                    if (JSONdata[0].LabdipStatus != "") {
                        LabDipStatus = JSON.parse(JSONdata[0].LabdipStatus);
                        var nLabDipStatus = LabDipStatus.length;
                        for (var i = 0; i < nLabDipStatus; i++) {
                            LabDipStatusMaxId = LabDipStatus[i].IdLabdipStatus;
                        }
                    }

                    // :comentado
                    var nLabdip = Labdip.length;
                    var cont = 1;

                    
                    for (var i = 0; i < nLabdip; i++) {

                        var idTipo = "cboTipo" + cont;
                        var idAprobacion = "cboAprobacion" + cont;
                        var idProceso = "cboProceso" + cont;
                        var idSeason = "cboSeason" + cont;
                        var idDyeingHouse = "cboDyeingHouse" + cont;

                        let btnchk = `<td class='text-center'><button id='btnplus type='button' title='Add' class='btn btn-outline btn-primary' onclick='fn_open_labdipdetail(${Labdip[i].IdLabdip},${Labdip[i].grupolabdip})'><span class='fa fa-plus-circle'></span></button></td>`;

                        let estadolaboratorio = Labdip[i].estadolab;
                        let habilitado = Labdip[i].habilitado;

                        if ((estadolaboratorio == 2 && habilitado == 1) ||estadolaboratorio == 3) {

                            var htmlTipo = "<select disabled id='" + idTipo + "' class='form-control TipoLabDip' data-initial='" + Labdip[i].Tipo + "' style='width:100%'>" + $("#cboTipo").html() + "</select>";
                            var htmlAprobacion = "<select disabled id='" + idAprobacion + "' class='form-control' data-initial='" + Labdip[i].EstadoAprobacion + "' style='width:100%'>" + $("#cboAprobacion").html() + "</select>";
                            var htmlProceso = ""; //"<select id='" + idProceso + "' class='form-control' data-initial='" + Labdip[i].IdProceso + "'>" + $("#cboProceso").html() + "</select>";
                            var htmlSeason = "<select disabled id='" + idSeason + "' class='form-control' data-initial='" + Labdip[i].IdTemporada + "' style='width:100%'>" + $("#cboSeason").html() + "</select>";
                            let DyeingHouse = "<select disabled id='" + idDyeingHouse + "' class='form-control' data-initial='" + Labdip[i].IdDyeingHouse + "' style='width:100%'>" + $("#cboDyeingHouse").html() + "</select>";

                            html = "<tr data-id='" + Labdip[i].IdLabdip + "' data-status='old' data-group='" + Labdip[i].grupolabdip + "' data-laboratorio='" + Labdip[i].estadolab + "'>";
                            html += `${btnchk}`;
                            html += "<td class='hide'><button type='button' class ='btn btn-xs btn-success hide' onclick='ConfColorName(this,4)' >Color Name</button></td>"
                            html += "<td><input disabled type='text'  onkeyup='Mayus(this)'  class='form-control' value='" + Labdip[i].Color + "' data-initial='" + Labdip[i].Color + "'></td>";
                            html += "<td><input disabled type='text'  onkeyup='Mayus(this)'  class='form-control' value='" +Labdip[i].Standard + "' data-initial='" +Labdip[i].Standard + "'></td>";
                            html += "<td>" + htmlTipo + "</td>";
                            html += "<td>" + htmlAprobacion + "</td>";
                            html += "<td>" + DyeingHouse + "</td>";
                            html += "<td class='hide'>" + htmlProceso + "</td>";
                            html += "<td>" + htmlSeason + "</td>";
                            html += "<td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id=" + Labdip[i].IdLabdip + " onclick='MostrarLabdipStatus(this);'></span></td>";
                            html += "<td class='text-center'></td>";
                            html += "</tr>";
                        }
                        else {
                            var htmlTipo = "<select id='" + idTipo + "' class='form-control TipoLabDip' data-initial='" + Labdip[i].Tipo + "' style='width:100%'>" + $("#cboTipo").html() + "</select>";
                            var htmlAprobacion = "<select id='" + idAprobacion + "' class='form-control' data-initial='" + Labdip[i].EstadoAprobacion + "' style='width:100%'>" + $("#cboAprobacion").html() + "</select>";
                            var htmlProceso = ""; //"<select id='" + idProceso + "' class='form-control' data-initial='" + Labdip[i].IdProceso + "'>" + $("#cboProceso").html() + "</select>";
                            var htmlSeason = "<select id='" + idSeason + "' class='form-control' data-initial='" + Labdip[i].IdTemporada + "' style='width:100%'>" + $("#cboSeason").html() + "</select>";
                            let DyeingHouse = "<select id='" + idDyeingHouse + "' class='form-control' data-initial='" + Labdip[i].IdDyeingHouse + "' style='width:100%'>" + $("#cboDyeingHouse").html() + "</select>";

                            html = "<tr data-id='" + Labdip[i].IdLabdip + "' data-status='old' data-group='" + Labdip[i].grupolabdip + "' data-laboratorio='" + Labdip[i].estadolab + "'>";
                            html += `${btnchk}`;
                            html += "<td class='hide'><button type='button' class ='btn btn-xs btn-success hide' onclick='ConfColorName(this,4)' >Color Name</button></td>"
                            html += "<td><input type='text'  onkeyup='Mayus(this)'  class='form-control' value='" + Labdip[i].Color + "' data-initial='" + Labdip[i].Color + "'></td>";
                            html += "<td><input type='text'  onkeyup='Mayus(this)'  class='form-control' value='" + Labdip[i].Standard + "' data-initial='" + Labdip[i].Standard + "'></td>";
                            html += "<td>" + htmlTipo + "</td>";
                            html += "<td>" + htmlAprobacion + "</td>";
                            html += "<td>" + DyeingHouse + "</td>";
                            html += "<td class='hide'>" + htmlProceso + "</td>";
                            html += "<td>" + htmlSeason + "</td>";
                            html += "<td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id=" + Labdip[i].IdLabdip + " onclick='MostrarLabdipStatus(this);'></span></td>";
                            html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>";
                            html += "</tr>";
                        }

                        

                        $("#tblLabDip tbody").append(html);

                        $("#" + idTipo).val(Labdip[i].Tipo);
                        $("#" + idAprobacion).val(Labdip[i].EstadoAprobacion);
                        $("#" + idProceso).val(Labdip[i].IdProceso);
                        $("#" + idSeason).val(Labdip[i].IdTemporada);
                        $("#" + idDyeingHouse).val(Labdip[i].IdDyeingHouse);
                        $("#" + idTipo).select2();
                        $("#" + idAprobacion).select2();
                        $("#" + idSeason).select2();
                        $("#" + idDyeingHouse).select2();


                        cont++;
                        LabDipMaxId = Labdip[i].IdLabdip;
                    } //fin de for

                    //var htmlTipo = _comboFromJSON(Tipo, "ValorEstado", "NombreEstado");            

                    //let html = Labdip.map(x => {                        
                    //    let btnchk = x.idstatuslabdip === 5 ? `<td><button id='btnplus' type='button' title='Add' class='btn btn-outline btn-primary' onclick='fn_open_labdipdetail(${x.IdLabdip})'><span class='fa fa-plus-circle'></span></button></td>` : '<td></td>';                        

                    //    let oTemporada = oEdit.atemporada.find(y => y.IdClienteTemporada === x.IdTemporada);
                    //    let temporada = (oTemporada !== null && typeof oTemporada !== "undefined") ? oTemporada.CodigoClienteTemporada : '';                        
                    //    let tipo = oEdit.atipo.find(y => y.ValorEstado === x.Tipo)["NombreEstado"]; 
                    //    let estadoaprobacion = oEdit.aaprobacion.find(y => y.ValorEstado === x.EstadoAprobacion)["NombreEstado"]; 

                    //    return `<tr data-id='${x.IdLabdip}' data-status='old'>
                    //    ${btnchk}
                    //    <td class='hide'><button type='button' class='btn btn-xs btn-success hide' onclick='ConfColorName(this,4)' >Color Name</button></td>
                    //    <td> ${x.Color}</td>
                    //    <td> ${x.Standard}</td>
                    //    <td> ${tipo}</td>
                    //    <td> ${estadoaprobacion}</td>
                    //    <td> DyeingHouse </td>
                    //    <td class='hide'> ${x.IdProceso} </td>
                    //    <td>${temporada}</td>
                    //    <td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id='${x.IdLabdip}' onclick='MostrarLabdipStatus(this)'></span></td>
                    //    <td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>
                    //    </tr>`
                    //}).join('');
                    //_("tblLabDip").tBodies[0].innerHTML = html;



                    //let html = Labdip.map(x => {
                    //    let btnchk = x.idstatuslabdip === 5 ? `<td><button id='btnplus' type='button' title='Add' class='btn btn-outline btn-primary' onclick='fn_open_labdipdetail(${x.IdLabdip})'><span class='fa fa-plus-circle'></span></button></td>` : '<td></td>';

                    //    //let oTemporada = oEdit.atemporada.find(y => y.IdClienteTemporada === x.IdTemporada);
                    //    //let temporada = (oTemporada !== null && typeof oTemporada !== "undefined") ? oTemporada.CodigoClienteTemporada : '';
                    //    //let tipo = oEdit.atipo.find(y => y.ValorEstado === x.Tipo)["NombreEstado"];
                    //    //let estadoaprobacion = oEdit.aaprobacion.find(y => y.ValorEstado === x.EstadoAprobacion)["NombreEstado"];

                    //    return `<tr data-id='${x.IdLabdip}' data-status='old'>
                    //    ${btnchk}
                    //    <td class='hide'><button type='button' class='btn btn-xs btn-success hide' onclick='ConfColorName(this,4)' >Color Name</button></td>
                    //    <td> ${x.Color}</td>
                    //    <td> ${x.Standard}</td>
                    //    <td> ${tipo}</td>
                    //    <td> ${estadoaprobacion}</td>
                    //    <td> DyeingHouse </td>
                    //    <td class='hide'> ${x.IdProceso} </td>
                    //    <td>${temporada}</td>
                    //    <td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id='${x.IdLabdip}' onclick='MostrarLabdipStatus(this)'></span></td>
                    //    <td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>
                    //    </tr>`
                    //}).join('');
                    //_("tblLabDip").tBodies[0].innerHTML = html;

                }

                // :comentado
                //if (ProyectoTela[0].IdTela > 0) {
                //    $("#btnnFabricCode").hide();
                //}

                $("#hfLabdipCont").val(LabDipMaxId);
                $("#hfLabdipStatuspCont").val(LabDipStatusMaxId);

                $("#hfIdProyectoTela").val(ProyectoTela[0].IdProyectoTela);
                $("#txtCliente").val(ProyectoTela[0].NombreCliente);
                $("#cboSeason").val(ProyectoTela[0].IdClienteTemporada);
                $("#cboSeason").attr("data-initial", ProyectoTela[0].IdClienteTemporada);
                $("#cboCliente").hide();
                $("#txtCode").val(ProyectoTela[0].Codigo);

                $("#cboFabricSupplier").val(ProyectoTela[0].IdProveedor).trigger('change');
                $("#cboFabricSupplier").attr("data-initial", ProyectoTela[0].IdProveedor);

                $("#cboDyeProcess").val(ProyectoTela[0].DyeingProcess);
                $("#cboDyeProcess").attr("data-initial", ProyectoTela[0].DyeingProcess);
     
                $("#txtConstruction").val(ProyectoTela[0].Construction);
                $("#txtConstruction").attr("data-initial", ProyectoTela[0].Construction);

                $("#txtYarn").val(ProyectoTela[0].Yarn);
                $("#txtYarn").attr("data-initial", ProyectoTela[0].Yarn);

                $("#txtContent").val(ProyectoTela[0].Content);
                $("#txtContent").attr("data-initial", ProyectoTela[0].Content);

                $("#txtWeight").val(ProyectoTela[0].Weight);
                $("#txtWeight").attr("data-initial", ProyectoTela[0].Weight);

                $("#cboLavado").val(ProyectoTela[0].Lavado);
                $("#cboLavado").attr("data-initial", ProyectoTela[0].Lavado);

                $("#cboStatus").val(ProyectoTela[0].Status);
                $("#cboStatus").attr("data-initial", ProyectoTela[0].Status);

                $("#txtComents").val(ProyectoTela[0].Comment);
                $("#txtComents").attr("data-initial", ProyectoTela[0].Comment);

                // LLENAR TABLA PROCESOS X TELA
                let odata_procesosxtela = JSONdata[0].procesoxtela != '' ? CSVtoJSON(JSONdata[0].procesoxtela) : null;
                if (odata_procesosxtela != null) {
                    llenartablaproceso_iniedit(odata_procesosxtela);
                }
            }

            // OCULTAR DIV COMBO PROVEEDOR
            _('div_cboProveedor').classList.remove('hide');
        } else {

            var Tela = null;
            var Labdip = null;
            var Temporada = null;

            $("#txtProveedor").show();

            var Status = JSON.parse(JSONdata[0].Status);
            var Cliente = JSON.parse(JSONdata[0].Cliente);
            StatusL = Status;

            var Tipo = JSON.parse(JSONdata[0].Tipo);
            var Aprobacion = JSON.parse(JSONdata[0].Aprobacion);

            var htmlStatus = _comboFromJSON(Status, "ValorEstado", "NombreEstado");
            $("#cboStatusLabDip").append(htmlStatus);

            var htmlTipo = _comboFromJSON(Tipo, "ValorEstado", "NombreEstado");            
            $("#cboTipo").append(htmlTipo); // :html
            oEdit.atipo = Tipo;

            var htmlAprobacion = _comboFromJSON(Aprobacion, "ValorEstado", "NombreEstado");
            $("#cboAprobacion").append(htmlAprobacion);
            oEdit.aaprobacion = Aprobacion;

            var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
            $("#cboCliente").append(htmlCliente);

            if (JSONdata[0].Temporada != "") {
                Temporada = JSON.parse(JSONdata[0].Temporada);
                $("#cboSeason").empty();
                var htmlTemporada = "<option value=''>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
                $("#cboSeason").append(htmlTemporada);
            }
            oEdit.atemporada = Temporada;



            if (JSONdata[0].Tela != "") {
                Tela = JSON.parse(JSONdata[0].Tela)[0];
                if (JSONdata[0].Labdip != "") {
                    Labdip = JSON.parse(JSONdata[0].Labdip);
                    if (JSONdata[0].LabdipStatus != "") {
                        LabDipStatus = JSON.parse(JSONdata[0].LabdipStatus);
                        var nLabDipStatus = LabDipStatus.length;
                        for (var i = 0; i < nLabDipStatus; i++) {
                            LabDipStatusMaxId = LabDipStatus[i].IdLabdipStatus;
                        }
                    }

                    var nLabdip = Labdip.length;
                    var cont = 1;

                    for (var i = 0; i < nLabdip; i++) {

                        var idTipo = "cboTipo" + cont;
                        var idAprobacion = "cboAprobacion" + cont;
                        var idProceso = "cboProceso" + cont;
                        var idSeason = "cboSeason" + cont;
                        let btnchk = `<td><button id='btnplus type='button' title='Add' class='btn btn-outline btn-primary' onclick='fn_open_labdipdetail(${Labdip[i].IdLabdip},${Labdip[i].grupolabdip})'><span class='fa fa-plus-circle'></span></button></td>`;
                        
                        var htmlTipo = "<select id='" + idTipo + "' class='form-control TipoLabDip' data-initial='" + Labdip[i].Tipo + "'>" + $("#cboTipo").html() + "</select>";
                        var htmlAprobacion = "<select id='" + idAprobacion + "' class='form-control' data-initial='" + Labdip[i].EstadoAprobacion + "'>" + $("#cboAprobacion").html() + "</select>";
                        var htmlProceso = "";
                        var htmlSeason = "<select id='" + idSeason + "' class='form-control' data-initial='" + Labdip[i].IdTemporada + "'>" + $("#cboSeason").html() + "</select>";


                        let estadolaboratorio = Labdip[i].estadolab;

                        if (estadolaboratorio == 2 || estadolaboratorio == 3) {
                            html = "<tr data-id='" + Labdip[i].IdLabdip + "' data-status='old' data-group='" + Labdip[i].grupolabdip + "' data-laboratorio='" + Labdip[i].estadolab + "' style='background-color:#fff4f2'>";
                        } else {
                            html = "<tr data-id='" + Labdip[i].IdLabdip + "' data-status='old' data-group='" + Labdip[i].grupolabdip + "' data-laboratorio='" + Labdip[i].estadolab + "'>";
                        }

                        html += `${btnchk}`;
                        html += "<td class='hide'><button type='button' class ='btn btn-xs  btn-success'>Color Name</button></td>"
                        html += "<td><input  onkeyup='Mayus(this)'  type='text' class='form-control' value='" + Labdip[i].Color + "' data-initial='" + Labdip[i].Color + "'></td>";

                        html += "<td>" + htmlTipo + "</td>";
                        html += "<td>" + htmlAprobacion + "</td>";                        
                        html += "<td class='hide'>" + htmlProceso + "</td>";
                        html += "<td>" + htmlSeason + "</td>";
                        html += "<td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id=" + Labdip[i].IdLabdip + " onclick='MostrarLabdipStatus(this);'></span></td>";
                        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>";
                        html += "</tr>";

                        $("#tblLabDip tbody").append(html);

                        $("#" + idTipo).val(Labdip[i].Tipo);
                        $("#" + idAprobacion).val(Labdip[i].EstadoAprobacion);
                        $("#" + idProceso).val(Labdip[i].IdProceso);
                        $("#" + idSeason).val(Labdip[i].IdTemporada);

                        cont++;
                        LabDipMaxId = Labdip[i].IdLabdip;
                    }

                    //let html = Labdip.map(x => {
                    //    let btnchk = x.idstatuslabdip === 5 ? `<td><button id='btnplus' type='button' title='Add' class='btn btn-outline btn-primary' onclick='fn_open_labdipdetail(${x.IdLabdip})'><span class='fa fa-plus-circle'></span></button></td>` : '<td></td>';

                    //    let oTemporada = oEdit.atemporada.find(y => y.IdClienteTemporada === x.IdTemporada);
                    //    let temporada = (oTemporada !== null && typeof oTemporada !== "undefined") ? oTemporada.CodigoClienteTemporada : '';
                    //    let tipo = oEdit.atipo.find(y => y.ValorEstado === x.Tipo)["NombreEstado"];
                    //    let estadoaprobacion = oEdit.aaprobacion.find(y => y.ValorEstado === x.EstadoAprobacion)["NombreEstado"];

                    //    return `<tr data-id='${x.IdLabdip}' data-status='old'>
                    //    ${btnchk}                        
                    //    <td class='hide'> ${x.Color}</td>
                    //    <td> ${x.Color} </td>                        
                    //    <td> ${tipo}</td>
                    //    <td> ${estadoaprobacion}</td>
                    //    <td class='hide'> ${x.IdProceso} </td>
                    //    <td>${temporada}</td>
                    //    <td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id='${x.IdLabdip}' onclick='MostrarLabdipStatus(this)'></span></td>
                    //    <td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>
                    //    </tr>`
                    //}).join('');
                    //_("tblLabDip").tBodies[0].innerHTML = html;

                }


                $("#hfLabdipCont").val(LabDipMaxId);
                $("#hfLabdipStatuspCont").val(LabDipStatusMaxId);

                $("#hfIdTela").val(Tela.IdFichaTecnica);

                if (Tela.IdCliente == 0) {
                    $("#cboCliente").show();
                    $("#txtCliente").hide();
                } else {
                    $("#txtCliente").show();
                    $("#cboCliente").hide();
                    $("#txtCliente").val(Tela.NombreCliente);
                    $("#cboSeason").val(Tela.IdTemporada);
                    $("#cboSeason").attr("data-initial", Tela.IdTemporada);
                }

                $("#txtCode").val(Tela.CodigoTela);
                $("#txtProveedor").val(Tela.NombreProveedor);
                $("#txtConstruction").val(Tela.NombreFamilia);
                $("#txtYarn").val(Tela.Titulo);
                $("#txtContent").val(Tela.DescripcionPorcentajeContenidoTela);
                $("#txtWeight").val(Tela.Weight);
                $("#cboLavado").val(Tela.Lavado);

                $("#txtCode").prop("disabled", true);
                $("#txtProveedor").prop("disabled", true);
                $("#txtConstruction").prop("disabled", true);
                $("#txtYarn").prop("disabled", true);
                $("#txtContent").prop("disabled", true);
                $("#cboLavado").prop("disabled", true);
                $("#txtWeight").prop("disabled", true);
                $("#cboStatus").prop("disabled", true);
                $("#txtComents").prop("disabled", true);
                _('div_cboProveedor').classList.add('hide');
            }
        }
    }
}

function ConfColorName(e, Tipo) {  
    swal({
        title: "Are you sure to save color to fabric project?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        ColorName(e, Tipo)
        return;
    });
}

function ColorName(e, Tipo) {
    let urlaccion = 'GestionProducto/Estilo/CrearColor', form = new FormData(), idestilo = _par(_('txtpar').value, 'idestilo');
    let color;
    if (Tipo == 4) {
        let tr = $(e).closest('tr');
        color = $(e).closest('td').next().text();
    }  
    var obj = { idestilo: idestilo, color: color.trim() };
    if (color.trim().length > 0) {
        form.append('par', JSON.stringify(obj));
        Post(urlaccion, form, function (rpta) {
            if (rpta > 0) {
                swal({ type: 'success', title: 'Se agregó el color al estilo', text: "" });
            }
            else {
                _swal({ estado: 'error', mensaje: 'No se guardó el color' });
            }
            $("#modalConfirm").modal('hide');
        });

    } else {
        _swal({ estado: 'error', mensaje: 'Color is empty' });
        $("#modalConfirm").modal('hide');
    }
}

function AgregarLabDip(obj) {

    var IdCliente = $("#cboCliente").val();
    var Cliente = $("#txtCliente").val();
    var IdTemporada = $("#cboTemporada").val();

    if (IdCliente != "" || Cliente != "") {
        var contador = parseInt($("#hfLabdipCont").val());
        contador++;

        var htmlTipo = "<select class='form-control TipoLabDip' data-initial='' id='cboTipo" + contador + "' style='width:100%'>" + $("#cboTipo").html() + "</select>";
        var htmlAprobacion = "<select class='form-control' data-initial='' id='cboAprobacion" + contador + "' style='width:100%'>" +$("#cboAprobacion").html() + "</select>";
        var htmlProceso = '';
        var htmlSeason = "<select class='form-control' data-initial=''  id='cboSeason" + contador + "' style='width:100%'>" + $("#cboSeason").html() + "</select>";

        html = "<tr data-id='" + contador + "' data-status='new' data-group='0' data-laboratorio='0'>";
        html += "<td></td>"
        html += "<td class='hide'><button type='button' class ='btn btn-xs  btn-success'>Color Name</button></td>"
        html += "<td><input  onkeyup='Mayus(this)'  type='text' class='form-control' data-initial=''></td>";
        html += "<td><input  onkeyup='Mayus(this)'  type='text' class='form-control' data-initial=''></td>";
        html += "<td>" + htmlTipo + "</td>";
        html += "<td>" + htmlAprobacion + "</td>";      
        html += "<td><select id='cboDyeingHouse" + contador + "' class='form-control' style='width:100%'>" + $('#cboDyeingHouse').html() + "</select></td>";
        html += "<td class='hide'>" + htmlProceso + "</td>";
        html += "<td>" + htmlSeason + "</td>";
        html += "<td class='text-center'><span class='fa fa-tasks' style='cursor:pointer;font-size:15px;color:black;' data-id=" + contador + " onclick='MostrarLabdipStatus(this);'></span></td>";
        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarLabDip(this);'></span></td>";
        html += "</tr>";

        $("#tblLabDip tbody").append(html);
        $("#hfLabdipCont").val(contador);

        $("#cboCliente").prop('disabled', 'disabled');
        $("#cboTipo" + contador).select2();
        $("#cboAprobacion" + contador).select2();
        $("#cboSeason" + contador).select2();
        $("#cboDyeingHouse" + contador).select2();

        $("#cboDyeProcess").trigger("change");

    } else {

        var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Client !!', estado: 'error' };
        _mensaje(objmensaje);

    }
}

function EliminarLabDip(obj) {
    swal({
        title: "Are you sure delete this register?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        
        var row = $(obj).closest("tr");
        var rowStatus = $(row).attr('data-status');
        var rowId = $(row).attr("data-id");
        var estadolaboratorio = $(row).attr("data-laboratorio");

        if (estadolaboratorio != '2') {
            if (rowStatus == "old") {
                var objLabDipEliminado = {
                    Id: rowId
                }
                LabDipEliminado.push(objLabDipEliminado);
            }
            $(row).remove();
            swal({ title: "Good Job!", text: "You have delete this Data", type: "success" });
        }
        else { swal({ title: 'Alert!', text: "You can't delete this register", type: "warning" }); }
    });
}

function MostrarLabdipStatus(obj) {
    $("#tblLabdipStatus tbody").empty();
    var row = $(obj).closest("tr")[0];
    var LabdipRef = $(row).attr("data-status");
    var id = parseInt($(obj).attr("data-id"));    

    //var color = $(row.cells[2]).find("input").val(); :anterior
    var color = row.cells[2].children[0].value;
    if (color.trim() != "") {
        $("#txtColor").val(color);
        CargarLabDipStatus(id);
        $("#hfLabdipCurrent").val(id);
        $('#mdStatus').modal('show');
        $("#hfLabdipRef").val(LabdipRef);

    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter a color (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function AgregarLabdipStatus() {
    var contador = parseInt($("#hfLabdipStatuspCont").val());
    contador++;
    var StatusId = parseInt($("#cboStatusLabDip").val());
    var StatusName = $("#cboStatusLabDip :selected").text();
    var IdLabdip = parseInt($("#hfLabdipCurrent").val());
    var Date = $("#dtLabDipStatus").find("input").val();
    var LabdipRef = $("#hfLabdipRef").val();
    var Alternativa = $("#txtAlternativa").val();
    var DyeingHouseCode = $("#txtDyeingCode").val();
    var Comment = $("#txtComment").val();
    var solidezluz = $("#txtsolidezluz").val();
    var solidezhumedo = $("#txtsolidezfrotehumedo").val();
    var solidezseco = $("#txtsolidezfroteseco").val();

    if (StatusId == '4' || StatusId == '5') {

        let req = required_select2({ id: 'modalstatus', clase: '_enty' });
        if (!req) {
            swal({ title: 'Alert!', text: 'You have to complete data required', type: 'warning' });
            return;
        }

    }

    if (!ExisteLabdipStatus(IdLabdip, StatusId)) {

        var objLabdipStatus = {
            IdLabdipStatus: contador,
            IdLabdip: IdLabdip,
            IdEstado: StatusId,
            NombreEstado: StatusName,
            Fecha: Date,
            Eliminado: 0,
            LabDipRef: LabdipRef,
            Nuevo: 1,
            Alternativa: Alternativa,
            DyeingHouseCode: DyeingHouseCode,
            Comment: Comment,
            solidezluz: solidezluz,
            solidezhumedo: solidezhumedo,
            solidezseco: solidezseco
        }

        var row = "";
        row += "<tr data-status='new' data-ref='" + LabdipRef + "' data-lab=0 data-habilitado=0><td>" + StatusName + "</td><td>" + Date + "</td><td>" + Alternativa + "</td><td>" + DyeingHouseCode + "</td><td>" + Comment + "</td> <td>" + solidezluz + "</td><td>" + solidezhumedo + "</td><td>" + solidezseco + "</td><td><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' data-id='" + contador + "' data-ref='" + LabdipRef + "' onclick='EliminarLabDipStatus(this);'></span></td></tr>";

        LabDipStatus.push(objLabdipStatus);

        $("#tblLabdipStatus tbody").append(row);
        $("#hfLabdipStatuspCont").val(contador);
        $("#txtAlternativa").val('');
        $("#txtDyeingCode").val('');
        $("#txtComment").val('');
        $("#txtsolidezluz").val('');
        $("#txtsolidezfrotehumedo").val('');
        $("#txtsolidezfroteseco").val('');
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Already exists status "' + StatusName + '" in the list below !!!', estado: 'error' };
        _mensaje(objmensaje);
    }

}

function EliminarLabDipStatus(obj) {
    var Id = parseInt($(obj).attr("data-id"));
    var estadolab = parseInt($(obj.parentNode.parentNode).attr("data-lab"));
    var habilitado = parseInt($(obj.parentNode.parentNode).attr("data-habilitado"));

    if (estadolab == 2 && habilitado == 1) {
        swal({ title: "Alert!", text: "You can't delete this register. Please comunicate with Laboratory", type: "warning" });
    }
    else {
        var LabDip = LabDipStatus.filter(function (e) { return (e.IdLabdipStatus === Id) });
        if (LabDip[0] != null) {
            LabDip[0].Eliminado = 1;
        }
        var row = $(obj).closest("tr");
        var rowStatus = $(row).attr('data-ref');
        if (rowStatus == "old" && LabDip[0].Nuevo == 0) {
            var objLabDipStatusEliminado = {
                Id: Id
            }
            LabDipStatusEliminado.push(objLabDipStatusEliminado);
        }
        $(row).remove();
    }
}

function CargarLabDipStatus(id) {
    limpiarstatus();
    if (LabDipStatus.length > 0) {
        var LabDip = LabDipStatus.filter(function (e) { return (e.IdLabdip === id && e.Eliminado === 0) });

        if (LabDip.length > 0) {
            var row = "";
            for (var i = 0; i < LabDip.length; i++) {
                var objStatus = StatusL.filter(function (e) { return e.ValorEstado === LabDip[i].IdEstado });
                let solidezluz = LabDip[i].solidezluz == 0.00 ? '-' : LabDip[i].solidezluz;
                let solidezseco = LabDip[i].solidezseco == 0.00 ? '-' : LabDip[i].solidezseco;
                let solidezhumedo = LabDip[i].solidezhumedo == 0.00 ? '-' : LabDip[i].solidezhumedo;
                row += "<tr data-id='" + LabDip[i].IdLabdipStatus + "' data-ref='" + LabDip[i].LabDipRef + "'data-lab='" + LabDip[i].estadolab + "'data-habilitado='" + LabDip[i].habilitado + "'><td>" + objStatus[0].NombreEstado + "</td><td>" + LabDip[i].Fecha + "</td><td>" + LabDip[i].Alternativa + "</td><td>" + LabDip[i].DyeingHouseCode + "</td><td>" + LabDip[i].Comment + "</td><td>" + solidezluz + "</td><td>" + solidezhumedo + "</td><td>" + solidezseco + "</td><td><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' data-id='" + LabDip[i].IdLabdipStatus + "' onclick='EliminarLabDipStatus(this);'></span></td></tr>";
            }
            $("#tblLabdipStatus tbody").append(row);
        }
    }
}

function ExisteLabdipStatus(IdLabdip, StatusId) {
    if (LabDipStatus.length > 0) {
        var LabDip = LabDipStatus.filter(function (e) { return (e.IdLabdip === IdLabdip && e.IdEstado === StatusId && e.Eliminado === 0) });
        if (LabDip.length > 0) {
            return true;
        }
        return false;
    }
    return false;
}

// :guardar
function Guardar() {

    if (ValidarCamposRequeridos()) {

        var frm = new FormData();
        var FabricProjectJSON = JSON.stringify(FabricProject);
        var LabDipJSON = "";
        var LabDipStatusJSON = "";
        var nLabDip = LabDip.length;

        if (nLabDip > 0) {
            LabDipJSON = JSON.stringify(LabDip);
        }

        if (LabDipStatusF.length > 0) {
            LabDipStatusJSON = JSON.stringify(LabDipStatusF);
        }

        var LabDipEliminadoJSON = "";
        var LabDipStatusEliminadoJSON = "";

        var nLabDipEliminado = LabDipEliminado.length;

        if (nLabDipEliminado > 0) {
            LabDipEliminadoJSON = JSON.stringify(LabDipEliminado);
        }

        var nLabDipStatusEliminado = LabDipStatusEliminado.length;

        if (nLabDipStatusEliminado > 0) {
            LabDipStatusEliminadoJSON = JSON.stringify(LabDipStatusEliminado);
        }

        var Tipo = parseInt($("#hfTipo").val());
        if (Tipo === 2) {
            FabricProjectJSON = TelaSTR;
        }

        // LISTA DE PROCESOS
        let procesos = JSON.stringify(generarListaProcesos_grabar());
        let procesoseliminados = JSON.stringify(generarListaProcesosEliminados_grabar());

        if (procesos == '[]') {
            procesos = '';
        }
        if (procesoseliminados == '[]') {
            procesoseliminados = '';
        }

        frm.append("Tipo", Tipo);
        frm.append("FabricProject", FabricProjectJSON);
        frm.append("Labdip", LabDipJSON);
        frm.append("LbadipStatus", LabDipStatusJSON);
        frm.append("LabdipEliminado", LabDipEliminadoJSON);
        frm.append("LbadipStatusEliminado", LabDipStatusEliminadoJSON);
        frm.append("procesos", procesos);
        frm.append("procesos_eliminados", procesoseliminados);

        Post('GestionProducto/ProyectoTela/Save', frm, Alerta);

    }
}

function Alerta(data) {
    var rpta = JSON.parse(data);

    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;

    if (objmensaje.estado != "error") {
        swal({ title: "Good Job!", text: "You have registered new Data", type: "success" });
        let urlaccion = 'gestionproducto/proyectotela/edit',
          urljs = 'gestionproducto/proyectotela/edit';        
        var par = 'idtipotela:' + _('hfTipo').value + ',idtela:' + rpta.id + ',idgrupocomercial:' + ovariables.idgrupocomercial;
        _Go_Url(urlaccion, urljs, par);
        return false;
    }

    _mensaje(objmensaje);
}

function ValidarCamposRequeridos() {
    var contCambio = 0;
    var cont = 0;
    var Tipo = parseInt($("#hfTipo").val());

    if (Tipo == 1) {

        var IdProyectoTela = $("#hfIdProyectoTela").val();

        var IdTemporada = $("#cboSeason").val();
        var IdTemporadaIV = $("#cboSeason").attr("data-initial");

        var IdProveedor = $("#cboFabricSupplier").val();
        var IdProveedorIV = $("#cboFabricSupplier").attr("data-initial");

        var Construction = $("#txtConstruction").val();
        var ConstructionIV = $("#txtConstruction").attr("data-initial");

        var Yarn = $("#txtYarn").val();
        var YarnIV = $("#txtYarn").attr("data-initial");

        var Content = $("#txtContent").val();
        var ContentIV = $("#txtContent").attr("data-initial");

        var Weight = $("#txtWeight").val();
        var WeightIV = $("#txtWeight").attr("data-initial");

        var Lavado = $("#cboLavado").val();
        var LavadoIV = $("#cboLavado").attr("data-initial");

        var Status = $("#cboStatus").val();
        var StatusIV = $("#cboStatus").attr("data-initial");

        var Comments = $("#txtComents").val();
        var CommentsIV = $("#txtComents").attr("data-initial");

        var DyeProcess = $('#cboDyeProcess').val();
        var DyeProcessIV = $("#cboDyeProcess").attr("data-initial");

        if (Weight == "") {
            Weight = 0
        }

        FabricProject = {
            IdProyectoTela: IdProyectoTela,
            IdCliente: 0,
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

        if (FabricProject.IdTemporada == "") {
            cont++;
        }

        if ((IdTemporada != IdTemporadaIV) || (IdProveedor != IdProveedorIV) || (Construction != ConstructionIV) || (Yarn != YarnIV) || (Content != ContentIV) || (Weight != WeightIV) || (Lavado != LavadoIV) || (Status != StatusIV) || (Comments != CommentsIV) || (DyeProcess != DyeProcessIV)) {
            FabricProject.Cambio = 1;
            contCambio++;
        }


        var LabDipLen = $("#tblLabDip tbody").length;

        if (LabDipLen > 0) {

            LabDip = new Array();
            LabDipStatusF = new Array();

            var Id = 1;
            var contLabdipNew = 0;
            var contLabdipOld = 0;
            $("#tblLabDip tbody tr").each(function () {

                var Status = $(this).attr("data-status");
                var grupo = $(this).attr("data-group");

                var IdProyectoTelaLabDip = parseInt($(this).attr("data-id"));

                var Color = $(this.cells[2]).find("input").val();
                var ColorIV = $(this.cells[2]).find("input").attr("data-initial");

                var Standard = $(this.cells[3]).find("input").val();
                var StandardIV = $(this.cells[3]).find("input").attr("data-initial");

                var TipoLab = $(this.cells[4])[0].children[0].value;
                var TipoLabIV = $(this.cells[4]).find("select").attr("data-initial");

                //var TipoLab = $(this.cells[4]).find("select").val();
                //var TipoLabIV = $(this.cells[4]).find("select").attr("data-initial");

                var Aprobacion = $(this.cells[5]).find("select").val();
                var AprobacionIV = $(this.cells[5]).find("select").attr("data-initial");

                var DyeingHouse = $(this.cells[6]).find("select").val();
                var DyeingHouseIV = $(this.cells[6]).find("select").attr("data-initial");

                var Proceso = $(this.cells[7]).find("select").val();
                var ProcesoIV = $(this.cells[7]).find("select").attr("data-initial");

                var Temporada = $(this.cells[8]).find("select").val();
                var TemporadaIV = $(this.cells[8]).find("select").attr("data-initial");


                if (Color == '' || TipoLab == '0' || Aprobacion == '0' || DyeingHouse == '0' || Temporada == '0') {
                    $(this).addClass('danger');
                } else {
                    $(this).removeClass('danger');
                }

                if (Status == "new") {
                    contLabdipNew++;
                    contCambio++;
                } else {
                    contLabdipOld++;
                }

                var objLabDip = {
                    Id: Id,
                    IdProyectoTelaLabDip: IdProyectoTelaLabDip,
                    Color: Color,
                    Standard:Standard,
                    Tipo: TipoLab,
                    Aprobacion: Aprobacion,
                    DyeingHouse: DyeingHouse,
                    Proceso: Proceso,
                    Temporada: Temporada,
                    Status: Status,
                    Cambio: 0,
                    contN: contLabdipNew,
                    contO: contLabdipOld,
                    grupo: grupo
                }

                var filtro = LabDipStatus.filter(function (e) { return (e.IdLabdip === IdProyectoTelaLabDip && e.Eliminado === 0 && e.Nuevo === 1) });
                var nfiltro = filtro.length;
                if (nfiltro > 0) {
                    contCambio++;
                    for (var i = 0; i < nfiltro; i++) {

                        var objLabdipStatus = {
                            Id: Id,
                            IdProyectoTelaLabDip: IdProyectoTelaLabDip,
                            IdEstado: filtro[i].IdEstado,
                            Fecha: filtro[i].Fecha,
                            LabDipRef: filtro[i].LabDipRef,
                            contN: contLabdipNew,
                            contO: contLabdipOld,
                            Alternativa: filtro[i].Alternativa,
                            DyeingHouseCode: filtro[i].DyeingHouseCode,
                            Comment: filtro[i].Comment,
                            solidezluz: filtro[i].solidezluz,
                            solidezhumedo: filtro[i].solidezhumedo,
                            solidezseco: filtro[i].solidezseco
                        }

                        LabDipStatusF.push(objLabdipStatus);
                    }
                }

                if ((Color != ColorIV) || (Standard != StandardIV) || (TipoLab != TipoLabIV) || (Aprobacion != AprobacionIV) || (Proceso != ProcesoIV) || (Temporada != TemporadaIV) || (DyeingHouse != DyeingHouseIV)) {
                    objLabDip.Cambio = 1;
                    contCambio++;
                    LabDip.push(objLabDip);
                }


                if (objLabDip.Color == "" || objLabDip.Tipo == '0' || objLabDip.Aprobacion == '0' || objLabDip.DyeingHouse == '0' || objLabDip.Temporada == '0') {
                    cont++;
                }

                Id++;

            });
        }

        let procesomodificado = _('tblprocesos').getAttribute('data-estadomodificado');
        if (procesomodificado == 1) {
            contCambio++;
        }
    } else {

        var IdFichaTecnica = $("#hfIdTela").val();

        var IdCliente = $("#cboCliente").val();
        var IdClienteIV = $("#cboCliente").attr("data-initial");

        var IdTemporada = $("#cboSeason").val();
        var IdTemporadaIV = $("#cboSeason").attr("data-initial");

        if (IdCliente != IdClienteIV || IdTemporada != IdTemporadaIV) {
            contCambio++;
            TelaSTR = IdFichaTecnica + "," + IdCliente + "," + IdTemporada;
        }

        var Cliente = $("#txtCliente").val();

        if ((IdCliente == "" && Cliente == "") || IdTemporada == "") {
            cont++;
        }

        var LabDipLen = $("#tblLabDip tbody").length;

        if (LabDipLen > 0) {

            LabDip = new Array();
            LabDipStatusF = new Array();

            var Id = 1;
            var contLabdipNew = 0;
            var contLabdipOld = 0;
            $("#tblLabDip tbody tr").each(function () {

                var Status = $(this).attr("data-status");
                var grupo = $(this).attr("data-group");

                var IdTelaLabDip = parseInt($(this).attr("data-id"));

                var Color = $(this.cells[1]).find("input").val();
                var ColorIV = $(this.cells[1]).find("input").attr("data-initial");

                var TipoLab = $(this.cells[4]).find("select").val();
                var TipoLabIV = $(this.cells[4]).find("select").attr("data-initial");


                var Aprobacion = $(this.cells[3]).find("select").val();
                var AprobacionIV = $(this.cells[3]).find("select").attr("data-initial");
                
                var Proceso = $(this.cells[4]).find("select").val();
                var ProcesoIV = $(this.cells[4]).find("select").attr("data-initial");

                var Temporada = $(this.cells[5]).find("select").val();
                var TemporadaIV = $(this.cells[5]).find("select").attr("data-initial");

                if (Status == "new") {
                    contLabdipNew++;
                    contCambio++;
                } else {
                    contLabdipOld++;
                }

                var objLabDip = {
                    Id: Id,
                    IdTela: IdFichaTecnica,
                    IdTelaLabDip: IdTelaLabDip,
                    Color: Color,
                    Tipo: TipoLab,
                    Aprobacion: Aprobacion,
                    //DyingHouse: DyingHouse,
                    Proceso: Proceso,
                    Temporada: Temporada,
                    Status: Status,
                    Cambio: 0,
                    contN: contLabdipNew,
                    contO: contLabdipOld,
                    grupo: grupo
                }

                var filtro = LabDipStatus.filter(function (e) { return (e.IdLabdip === IdTelaLabDip && e.Eliminado === 0 && e.Nuevo === 1) });
                var nfiltro = filtro.length;
                if (nfiltro > 0) {
                    contCambio++;
                    for (var i = 0; i < nfiltro; i++) {

                        var objLabdipStatus = {
                            Id: Id,
                            IdTela: IdFichaTecnica,
                            IdTelaLabDip: IdTelaLabDip,
                            IdEstado: filtro[i].IdEstado,
                            Fecha: filtro[i].Fecha,
                            LabDipRef: filtro[i].LabDipRef,
                            contN: contLabdipNew,
                            contO: contLabdipOld
                        }

                        LabDipStatusF.push(objLabdipStatus);
                    }
                }

                if ((Color != ColorIV) || (TipoLab != TipoLabIV) || (Aprobacion != AprobacionIV) || (Proceso != ProcesoIV) || (Temporada != TemporadaIV)) {
                    objLabDip.Cambio = 1;
                    contCambio++;
                    LabDip.push(objLabDip);
                }


                if (objLabDip.Color == "" || objLabDip.Temporada == "") {
                    cont++;
                }

                Id++;

            });
        }
    }

    if (cont > 0) {

        var objmensaje = { titulo: 'Alerta', mensaje: 'Please fill all required fields !!! (*)', estado: 'error' };
        _mensaje(objmensaje);

        return false;
    }


    var nLabDipEliminado = LabDipEliminado.length;
    var nLabDipStatusEliminado = LabDipStatusEliminado.length;

    if (nLabDipEliminado > 0 || nLabDipStatusEliminado > 0) {
        contCambio++;
    }

    if (contCambio == 0) {
        var objmensaje = { titulo: 'Alerta', mensaje: 'No changes to save !!!', estado: 'error' };
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

function llenartablaproceso_iniedit(data) {
    let odata = data != null ? data : null, tbl = _('tbody_process'), html = '';

    if (odata != null) {
        odata.forEach(x => {
            html += `<tr data-par='idproyectotelaxproceso:${x.idproyectotelaxproceso},idproceso:${x.idproceso}'>
                    <td class ='text-center'>
                        <button class ='btn btn-sm btn-danger cls_deleteproceso'>
                            <span class ='fa fa-trash-o'></span>
                        </button></td>
                    <td>${x.nombreproceso}</td>
                    <td><input type='text' value='${x.comentario}' class='form-control cls_comentario_proceso' /></td>
                </tr>
                `;
        });

        _('tbody_process').innerHTML = html;
        handler_deleteproceso_reqini();
    }
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
            <td><input type='text' value=''  onkeyup='Mayus(this)'  class ='form-control cls_comentario_proceso' /></td>
        </tr>`;
    $('#tbody_process').append(html);
    cambiar_a_estado_modificado_tblproceso();
    handler_deleteproceso_alagregar();
}

function cambiar_a_estado_modificado_tblproceso() {
    _('tblprocesos').setAttribute('data-estadomodificado', 1);
}

function handler_deleteproceso_reqini() {
    let tbl = _('tbody_process'), arraydelete = _Array(tbl.getElementsByClassName('cls_deleteproceso')), arraycomentario = _Array(tbl.getElementsByClassName('cls_comentario_proceso'));

    arraydelete.forEach(x => x.addEventListener('click', e => { ejecutardeleteproceso(e); }));
    arraycomentario.forEach(x => x.addEventListener('change', e => { ejecutarchangecomentario(e) }));
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
        //fila.parentNode.removeChild(fila);
        fila.classList.add('hide');
        cambiar_a_estado_modificado_tblproceso();
    }
}

function ejecutarchangecomentario(event) {
    cambiar_a_estado_modificado_tblproceso();
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

function generarListaProcesos_grabar() {
    let filas = _Array(_('tbody_process').rows), lista = [], obj = {};

    filas.forEach(x => {
        obj = {};
        let xd = x.classList.value.indexOf('hide');
        if (x.classList.value.indexOf('hide') < 0) {
            let par = x.getAttribute('data-par'), idproyectotelaxproceso = _par(par, 'idproyectotelaxproceso'), idproceso = _par(par, 'idproceso');

            obj.idproyectotelaxproceso = idproyectotelaxproceso;
            obj.idproceso = idproceso;
            obj.comentario = x.cells[2].children[0].value;

            lista.push(obj);
        }
    });

    return lista;
}

function generarListaProcesosEliminados_grabar() {
    let filas = _Array(_('tbody_process').rows), lista = [], obj = {};

    filas.forEach(x => {
        obj = {};
        let xd = x.classList.value.indexOf('hide');
        if (x.classList.value.indexOf('hide') >= 0) {
            let par = x.getAttribute('data-par'), idproyectotelaxproceso = _par(par, 'idproyectotelaxproceso'), idproceso = _par(par, 'idproceso');

            obj.idproyectotelaxproceso = idproyectotelaxproceso;

            lista.push(obj);
        }
    });

    return lista;
}

function req_ini() {
    let par = _('txtpar').value;
    let parametro = JSON.stringify({ id: _par(par, 'idtela'), idtipotela: _par(par, 'idtipotela'), idgrupocomercial: ovariables.idgrupocomercial });
    Get('GestionProducto/ProyectoTela/ObtenerProyectoTela?par=' + parametro, ObtenerProyectoTela);
}

(function ini() {
    load();
    req_ini();
})();

/* Luis */
function fn_open_labdipdetail(_idlabdip, _grupolabdip) {
    let par = _('txtpar').value;
    let idtela = _par(par, 'idtela'), idlabdip = _idlabdip, grupolabdip = _grupolabdip,
    idtipotela = _par(par, 'idtipotela'), idgrupocomercial = _par(par, 'idgrupocomercial');
    let _parametro = `idlabdip:${idlabdip},idtela:${idtela},idtipotela:${idtipotela},idgrupocomercial:${idgrupocomercial},grupolabdip:${grupolabdip}`;

    _modalBody({
        url: 'GestionProducto/ProyectoTela/LabdipDetails',
        ventana: 'LabdipDetails',
        titulo: 'Detail Labdip',
        parametro: `${_parametro}`,
        alto: '',
        ancho: '1400px',
        responsive: 'modal-lg'
    });
}

function fn_add_labdip() {
    let par = _('txtpar').value;
    let idtela = _par(par, 'idtela'), idlabdip = 0,
    idtipotela = _par(par, 'idtipotela'), idgrupocomercial = _par(par, 'idgrupocomercial');
    let param = `idlabdip:${idlabdip},idtela:${idtela},idtipotela:${idtipotela},idgrupocomercial:${idgrupocomercial}`;

    _modalBody({
        url: 'GestionProducto/ProyectoTela/LabdipAdditional',
        ventana: 'LabdipAdditional',
        titulo: 'Add Labdip',
        parametro: `${param}`,
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });
}

function limpiarstatus() {
    _('txtAlternativa').value = '';
    _('txtDyeingCode').value = '';
    _('txtComment').value = '';
    _('txtsolidezluz').value = '';
    _('txtsolidezfrotehumedo').value = '';
    _('txtsolidezfroteseco').value = '';
    _('txtAlternativa').parentNode.parentNode.classList.remove('has-error');
    _('txtDyeingCode').parentNode.parentNode.classList.remove('has-error');
    _('txtComment').parentNode.parentNode.classList.remove('has-error');
    _('txtsolidezluz').parentNode.parentNode.classList.remove('has-error');
    _('txtsolidezfrotehumedo').parentNode.parentNode.classList.remove('has-error');
    _('txtsolidezfroteseco').parentNode.parentNode.classList.remove('has-error');
}

function required_select2(oenty) {
    let divformulario = _(oenty.id), resultado = true;
    let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    let array = Array.prototype.slice.apply(elementsselect2); //elementsselect2
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode.parentNode, att = x.getAttribute('data-required');       
        if (att) {
            if (valor == '') { padre.classList.add('has-error'); resultado = false; }
            else { padre.classList.remove('has-error'); }
        }
        type = x.getAttribute('data-type');
        if (type == 'decimal') {
            if (valor > 5 || valor < 0) { padre.classList.add('has-error'); resultado = false; }
            else { padre.classList.remove('has-error'); }
        }
    })
    return resultado;
}
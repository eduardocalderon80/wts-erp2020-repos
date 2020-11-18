//Luis
var PoEstilo = null;
var EstiloPartida = null;
var PartidaRelacion = null;
var EstiloEliminado = null;
var PartidaRelacionEliminado = null;
var PoEstiloEliminado = null;
var Solicitud = null;
var oSolicitud = {
    setCodigoColor: function (code) {
        _('txtCodigoColor').value = code||'';        
    }
}
var oVariables = {
    Codigo_Partida: 0,
    arrCategoriaInstruccionCuidado: [],
    arrInstruccionCuidado: [],
    arrInstruccionCuidadoChk: []
}

Ini();

function Ini() {

    var par = parseInt($("#txtpar").val());
    oVariables.Codigo_Partida = par;
   
    PoEstilo = new Array();
    EstiloPartida = new Array();
    PartidaRelacion = new Array();
    EstiloEliminado = new Array();
    PartidaRelacionEliminado = new Array();
    PoEstiloEliminado = new Array();
    
    $("#btnSave").click(function () { Save(); });

    $("#cboCliente").change(function () {
        var codigo = $(this).val();
        Get('Laboratorio/Partida/GetTemporada?par=' + codigo, CargarTemporada);
    });

    $("#btnReturn").click(function () {
        let url = 'Laboratorio/Partida/Consulta';
        _Go_Url(url, url, "");
    });

    //Mostrar Modales
    $("#spnModalPO").click(function () { ShowModalPo(); });
    $("#spnModalPartida").click(function () { ShowModalPartida(); });
    $("#spnModalTela").click(function () { ShowModalTela(); });

    $("#spnModalCodigoColor").click(function () {
        _modalBody({
            url: 'GestionProducto/ProyectoTela/IndexBusquedaLabdip',
            ventana: 'IndexBusquedaLabdip',
            titulo: 'Busqueda',
            parametro: 'accion:out',
            alto: '',
            ancho: '',
            responsive: 'modal-lg'
        });
    });


    $("#dtFechaSolicitud").datepicker({
        dateFormat: 'mm/dd/yyyy',
        autoclose: true
    });
    
    $('#dtFechaSolicitud').datepicker('update', moment().format('MM/DD/YYYY'));
   
    req_InstruccionCuidado();

    if (par > 0) {
        $("#spnPageStatus").text("");
        $("#spnPageStatus").text("Editing");
        $("#txtTintoreria").show();
        $("#txtFabrica").show();
        $("#txtCliente").show();
              
        var obj = JSON.parse(par);
        var urlaccion = 'Laboratorio/Partida/Get?par=' + par;
        Get(urlaccion, LoadSolicitudPartida);

    } else {
        _('Div_ReporteTecnico').classList.add('hide');
        $("#cboFabrica").show();
        $("#cboCliente").show();
        $("#txtColor").show();
        $("#cboTintoreria").show();
        LoadInitialData();
    }

  
}

// Cargar Informacion de Solicitud de Partida
function LoadSolicitudPartida(data) {
    if (data !== "") {

        var html = "";
        var Data = JSON.parse(data)[0];

        //PO
        if (Data.Po != "") {
            var Po = JSON.parse(Data.Po);
            PoEstilo = Po;
            var nPo = Po.length;

            html = "";

            for (var i = 0; i < nPo; i++) {
                html += "<tr class='PoPartida' data-status='old' data-params='" + Po[i].CodigoPo + "," + Po[i].CodigoEstilo + "," + Po[i].Lote + "," + Po[i].CodigoTela + "'>";
                var params = 'this,"' + Po[i].CodigoPo + '","' + Po[i].CodigoEstilo + '","' + Po[i].Lote + '","' + Po[i].CodigoTela + '"';
                html += "<td><a data-status='old' onclick='DeletePoPartida(" + params + ")'>Delete</a></td>";
                html += "<td  class='CodigoPo'>" + Po[i].CodigoPo + "</td>";
                html += "<td  class='CodigoEstilo'>" + Po[i].CodigoEstilo + "</td>";
                html += "<td>" + Po[i].Lote + "</td>";
                if (Po[i].TieneComplemento.length > 0) {
                    html += "<td  class='Complemento'>" + "<strong><span style='color: #ff0000;'>Con Complemento</span></strong>" + "</td>";
                } else {
                    html += "<td  class='Complemento'>" + "" + "</td>";
                }                
                html += "</tr>";
            }
            $("#tbodyPO").append(html);
        }

        //Reportes Relacionados
        if (Data.Relacion != "") {
            var Relacion = JSON.parse(Data.Relacion);
            PartidaRelacion = Relacion;
            var nRelacion = Relacion.length;
            html = "";

            for (var i = 0; i < nRelacion; i++) {
                html += "<tr class='PartidaRelacion' data-status='old' data-id='" + Relacion[i].IdRelacion + "'>";
                html += "<td><a data-status='old' onclick='DeletePartidaRelacion(this," + Relacion[i].CodigoPartida + ")'>Delete</a></td>";
                html += "<td>" + Relacion[i].ReporteTecnico + "</td>";
                html += "<td>" + Relacion[i].NumeroPartida + "</td>";
                html += "<td>" + Relacion[i].Status + "</td>";
                html += "<td>" + Relacion[i].NombreFabrica + "</td>";
                html += "<td>" + Relacion[i].NombreCliente + "</td>";
                html += "</tr>";
            }
            $("#tbodyPartidaRelacion").append(html);
            _('cboReproceso').value = 'S';
        }
        else {
            _('cboReproceso').value = 'N';
        }

        //Estilos
        if (Data.Estilo != "") {
            var Estilo = JSON.parse(Data.Estilo);
            EstiloPartida = Estilo;
            var nEstilo = Estilo.length;
            html = "";

            for (var i = 0; i < nEstilo; i++) {
                html += "<tr class='EstiloPartida' data-status='old' data-id='" + Estilo[i].CodigoEstilo + "'>";
                html += "<td><a data-status='old' onclick=DeleteStyle(this,'" + Estilo[i].CodigoEstilo + "') >Delete</a></td>";
                html += "<td>" + Estilo[i].CodigoEstilo + "</td>";
                html += "</tr>";
            }

            $("#tbodyStyle").append(html);
        }

        //Familia
        if (Data.Familia != "") {
            var Familia = JSON.parse(Data.Familia);
            html = "";
            html = "<option value=''>Seleccione</option>" + _comboFromJSON(Familia, "CodigoFamilia", "NombreFamilia");
            FillSelect("cboFamilia", html);
        }

        //Color
        if (Data.Color != "") {
            var Color = JSON.parse(Data.Color);
            html = "";
            html = "<option value=''>Seleccione</option>" + _comboFromJSON(Color, "NombreColor", "NombreColor");
            FillSelect("cboColor", html);
            $("#cboColor").show();
        } else { $("#txtColor").show(); }

        //Instruccion Cuidado
        if (Data.InstruccionCuidado != '') {
            oVariables.arrInstruccionCuidadoChk = JSON.parse(Data.InstruccionCuidado);           
        }

        //Mostrar Instrucciones de Cuidado
        fn_CargarInstrucionCuidado();

        //Informacion General
        if (Data.SolicitudPartida != "") {
            var SolicitudPartida = JSON.parse(Data.SolicitudPartida)[0];
            Solicitud = SolicitudPartida;
            $("#hfCodigoPartida").val(SolicitudPartida.CodigoPartida);
            $("#hfCodigoCliente").val(SolicitudPartida.CodigoCliente);
            $("#hfCodigoFabrica").val(SolicitudPartida.CodigoFabrica);
            $("#hfCodigoTintoreria").val(SolicitudPartida.CodigoTintoreria);
            $("#hfCodigoTemporada").val(SolicitudPartida.CodigoTemporada);

            $("#txtReporteTecnico").val(SolicitudPartida.ReporteTecnico);
            $("#txtPartida").val(SolicitudPartida.NumeroPartida);
            $("#txtFechaSolicitud").val(SolicitudPartida.FechaIngreso);
            $("#cboPrueba").val(SolicitudPartida.TipoPrueba);
            $("#txtFabrica").val(SolicitudPartida.NombreFabrica);
            $("#txtTintoreria").val(SolicitudPartida.NombreTintoreria);
            $("#txtCliente").val(SolicitudPartida.NombreCliente);
            $("#cboColor").val(SolicitudPartida.NombreColor);
            $("#txtColor").val(SolicitudPartida.NombreColor);
            $("#txtCodigoColor").val(SolicitudPartida.CodigoColorTintoreria);
            $("#cboMaterial").val(SolicitudPartida.Material);
            $("#txtTela").val(SolicitudPartida.CodigoTela);
            $("#txtWeight").val(SolicitudPartida.GramajeAcabado);
            $("#cboProceso").val(SolicitudPartida.Proceso);
            $("#cboLavado").val(SolicitudPartida.Lavado);
            $("#cboComplemento").val(SolicitudPartida.Complemento);
            $("#cboTemporada").val(SolicitudPartida.CodigoTemporada);            
            $("#txtDescripcionTela").val(SolicitudPartida.DescripcionTela);
            $("#txtComentarios").val(SolicitudPartida.ComentarioSolicitud);                      
            /* Luis */
            //$("#txtInstruccionesCuidadoAsignada").val(SolicitudPartida.InstruccionCuidadoSolicitud);
            $("#txt_InstruccionesCuidadoFabrica").val(SolicitudPartida.InstruccionCuidadoSolicitud);

            if (SolicitudPartida.CodigoTela != "") {
                $("#txtDescripcionTela").prop("readonly", true);
                $("#txtWeight").prop("readonly", true);
            }

            fn_ini_setear_segun_sincodigotela(SolicitudPartida);

            Get('Laboratorio/Partida/GetTemporada?par=' + SolicitudPartida.CodigoCliente, CargarTemporada);
        }
    }
}

function fn_ini_setear_segun_sincodigotela(odata_solicitudpartida) {
    if (odata_solicitudpartida !== null) {
        if (odata_solicitudpartida.sincodigotela === 1 && odata_solicitudpartida.estadoesdesarrollotela === 1) {
            _('div_po').classList.add('hide');
            _('div_estilo').classList.add('hide');
        }
    }
}

//Cargar Temporada
function CargarTemporada(data) {
    var Temporada = JSON.parse(data);
    var html = "<option value=''>Seleccione</option>" + _comboFromJSON(Temporada, "Codigo", "Nombre");
    $("#cboTemporada").empty();
    FillSelect("cboTemporada", html);
    var CodigoTemporada = $("#hfCodigoTemporada").val();
    $("#cboTemporada").val(CodigoTemporada);
}

function Load() {
    GetLoadData();
}

function LoadClientSupplier(data) {
    var Data = JSON.parse(data);
    var Cliente = JSON.parse(Data[0].Cliente);
    var Proveedor = JSON.parse(Data[0].Fabrica);
    var Familia = JSON.parse(Data[0].Familia);
    var html = "<option value=''>Seleccione</option>" + _comboFromJSON(Cliente, "CodigoCliente", "NombreCliente");
    FillSelect("cboCliente", html);
    html = "<option value=''>Seleccione</option>" + _comboFromJSON(Proveedor, "CodigoFabrica", "NombreFabrica");
    FillSelect("cboFabrica", html);
    html = "<option value=''>Seleccione</option>" + _comboFromJSON(Familia, "CodigoFamilia", "NombreFamilia");
    FillSelect("cboFamilia", html);

    html = "<option value=''>Seleccione</option>" + _comboFromJSON(Proveedor, "CodigoFabrica", "NombreFabrica");
    FillSelect("cboTintoreria", html);
}

function LoadInitialData() {
    Get('Laboratorio/Partida/GetDatosCarga', LoadClientSupplier);
}

/*
//function DeletePoPartida(obj, CodigoPo, CodigoEstilo, Lote, CodigoTela) {

//    var Status = $(obj).attr("data-status");
//    $(obj).closest("tr").remove();

//    //if (Status == "old") {
//    //    var objPo = {
//    //        CodigoPo: CodigoPo,
//    //        CodigoEstilo: CodigoEstilo,
//    //        Lote: Lote,
//    //        CodigoTela: CodigoTela,
//    //        Eliminado: 1,
//    //        EstadoRegistro: "old"
//    //    }

//    //    PoEstiloEliminado.push(objPo);

//    //}

//    var index = PoEstilo.findIndex(x => x.CodigoPo === CodigoPo && x.CodigoEstilo === CodigoEstilo && x.Lote === Lote);

//    if (index >= 0) {
//        PoEstilo[index].Eliminado = 1;
//    }

//    ObtenerColorPo();

//    var nPo = $(".PoPartida").length;
//    if (nPo == 0) {
//        $("#txtDescripcionTela").prop("readonly", false);
//        $("#txtWeight").prop("readonly", false);
//    }
//}
*/

function DeletePartidaRelacion(obj, CodigoPartida) {
    var Status = $(obj).attr("data-status");
    $(obj).closest("tr").remove();

    //if (Status == "old") {
    //    var objP = {
    //        IdRelacion: 0,
    //        CodigoPartida: CodigoPartida,                        
    //        ReporteTecnico: "",
    //        NumeroPartida: "",
    //        Status: "",
    //        NombreFabrica: "",
    //        NombreCliente: "",
    //        EstadoRegistro: "old",
    //        Eliminado: 1

    //    }

    //    PartidaRelacionEliminado.push(objP);
    //}

    var index = PartidaRelacion.findIndex(x => x.CodigoPartida === CodigoPartida);
    if (index >= 0) {
        PartidaRelacion[index].Eliminado = 1;
    }

}

/*
//function SearchPo() {

//    var CodigoPo = $("#txtNumeroPO").val();
//    if (CodigoPo == "") {
//        swal("Alert!", "Ingrese un numero de PO", "warning");
//        return false;
//    }

//    var CodigoPartida = parseInt($("#hfCodigoPartida").val());

//    var CodigoCliente = "";
//    var CodigoFabrica = "";

//    if (CodigoPartida == 0) {
//        CodigoFabrica = $("#cboFabrica").val();
//        CodigoCliente = $("#cboCliente").val();
//    } else {
//        CodigoFabrica = $("#hfCodigoFabrica").val();
//        CodigoCliente = $("#hfCodigoCliente").val();
//    }


//    var par = CodigoCliente + "," + CodigoFabrica + "," + $("#txtNumeroPO").val();

//    Get('Laboratorio/Partida/SearchPo?par=' + par, LoadPo);


//    //var urla = 'Laboratorio/Partida/SearchPo?par=' + par;

//    //$.ajax({
//    //    type: 'GET',
//    //    url: urlBase() + urla ,
//    //    data: null,
//    //    async: false
//    //}).done(function (data) {
//    //    LoadPo(data);
//    //});


//}
*/

/*
//function ShowModalPo() {
//    $("#mdPo").modal("show");
//}
*/

function ShowModalTela() {
    $("#mdTela").modal("show");
}

function LoadPartidaRelacionada(data) {
    if (data != "[]") {
        var PartidaRelacion = JSON.parse(data);
        var nPartidaRelacion = PartidaRelacion.length;
        var html = "";
        html += "<table id='tblPartidaRelacion' class='table table-bordered table-hover'><thead><tr><th>Seleccione</th><th>Reporte Tecnico</th><th>Partida</th><th>Status</th><th>Fabrica</th><th>Cliente</th></tr></thead>";
        for (var i = 0; i < nPartidaRelacion; i++) {
            html += "<tr>";
            html += "<td><input type='checkbox' class='chkSelectedPartida' data-params='" + PartidaRelacion[i].CodigoPartida + "," + PartidaRelacion[i].ReporteTecnico + "," + PartidaRelacion[i].NumeroPartida + "," + PartidaRelacion[i].Status + "," + PartidaRelacion[i].NombreFabrica + "," + PartidaRelacion[i].NombreCliente + "'></td>";
            html += "<td>" + PartidaRelacion[i].ReporteTecnico + "</td>";
            html += "<td>" + PartidaRelacion[i].NumeroPartida + "</td>";
            html += "<td>" + PartidaRelacion[i].Status + "</td>";
            html += "<td>" + PartidaRelacion[i].NombreFabrica + "</td>";
            html += "<td>" + PartidaRelacion[i].NombreCliente + "</td>";
            html += "</tr>";
        }
        $("#divPartidaRelacionada").empty();
        $("#divPartidaRelacionada").append(html);

        //$("#tblPartidaRelacion").dataTable();

        $('#tblPartidaRelacion').DataTable({
            "pageLength": 5,
            "searching": false,
            "info": false,
            "lengthChange": false
        });

        $("#mdPartida").modal("show");
    } else {
        swal("Alert!", "No se han encontrando coincidencias con otras partidas", "warning");
        return false;
    }
}

/*
function LoadPo(data) {

    if (data != "[]") {
        var Lotes = JSON.parse(data);
        var nLotes = Lotes.length;
        var html = "";
        html += "<table id='tblPO' class='table table-bordered'><thead><tr><th>Select</th><th>CodigoPo</th><th>CodigoEstilo</th><th>Lote</th><th>Tela</th><th>Descripcion Tela</th><th>Weight</th></tr></thead>";
        for (var i = 0; i < nLotes; i++) {
            html += "<tr>";
            html += "<td><input type='checkbox' class='chkSelectedPO' data-destela='" + Lotes[i].DescripcionTela + "' data-gramaje = '" + Lotes[i].GramajeAcabado + "' data-params='" + Lotes[i].CodigoPo + "," + Lotes[i].CodigoEstilo + "," + Lotes[i].Lote + "," + Lotes[i].CodigoTela + "'></td>";
            html += "<td>" + Lotes[i].CodigoPo + "</td>";
            html += "<td>" + Lotes[i].CodigoEstilo + "</td>";
            html += "<td>" + Lotes[i].Lote + "</td>";
            html += "<td>" + Lotes[i].CodigoTela + "</td>";
            html += "<td>" + Lotes[i].DescripcionTela + "</td>";
            html += "<td>" + Lotes[i].GramajeAcabado + "</td>";
            html += "</tr>";
        }

        html += "</table>";

        $("#divModalPo").empty();
        $("#divModalPo").append(html);

        //$("#tblPObody").empty();
        //$("#tblPObody").append(html);

        //$("#tblPO").dataTable();

        $('#tblPO').DataTable({
            "pageLength": 5,
            "searching": false,
            "info": false,
            "lengthChange": false
        });

    } else {
        swal("Alert!", "No se han encontrando la PO, verifique el cliente y fabrica seleccionado", "warning");
        return false;
    }
}
*/

/*
function LoadSelectedPos() {
    var nSelected = 0;

    var PoEstiloNew = new Array();

    $(".chkSelectedPO").each(function () {

        if (this.checked) {
            var params = $(this).attr("data-params").split(',');
            var Descripcion = $(this).attr("data-destela");
            var GramajeAcabado = parseFloat($(this).attr("data-gramaje"));
            var obj = {
                CodigoPo: params[0],
                CodigoEstilo: params[1],
                Lote: params[2],
                CodigoTela: params[3],
                Descripcion: Descripcion,
                GramajeAcabado: GramajeAcabado,
                Eliminado: 0,
                EstadoRegistro: "new"
            }

            PoEstiloNew.push(obj);
            nSelected++;
        }


    });

    if (nSelected == 0) {
        swal("Alert!", "Por favor seleccione al menos una PO", "warning");
        return false;
    } else {
        if (PoEstiloNew.length > 0) {

            var GroupTela = GroupBy(PoEstiloNew, "CodigoTela", "");
            if (GroupTela.length > 1) {
                swal("Alert!", "Debe seleccionar POs con la misma Tela", "warning");
                return false;
            }

            var nPoEstiloNew = PoEstiloNew.length;
            for (var i = 0; i < nPoEstiloNew; i++) {
                if (PoEstilo.some(x => x.CodigoPo === PoEstiloNew[i].CodigoPo && x.CodigoEstilo === PoEstiloNew[i].CodigoEstilo && x.Lote === PoEstiloNew[i].Lote)) {
                    PoEstiloNew[i].EstadoRegistro = "repetido";
                }
            }
            var Po = PoEstiloNew.filter(x => x.EstadoRegistro === "new");
            var nPo = Po.length;
            if (nPo > 0) {

                var html = "";
                for (var i = 0; i < nPo; i++) {
                    html += "<tr class='PoPartida' data-status='new' data-params='" + Po[i].CodigoPo + "','" + Po[i].CodigoEstilo + "," + Po[i].Lote + "'>";
                    var params = 'this,"' + Po[i].CodigoPo + '","' + Po[i].CodigoEstilo + '","' + Po[i].Lote + '","' + Po[i].CodigoTela + '"';
                    html += "<td><a data-status='old' onclick='DeletePoPartida(" + params + ")'>Delete</a></td>";
                    html += "<td class='CodigoPo'>" + Po[i].CodigoPo + "</td>";
                    html += "<td class='CodigoEstilo'>" + Po[i].CodigoEstilo + "</td>";
                    html += "<td>" + Po[i].Lote + "</td>";
                    html += "</tr>";
                    PoEstilo.push(Po[i]);
                }

                $("#tbodyPO").append(html);

                $("#txtTela").val(Po[0].CodigoTela);
                $("#txtDescripcionTela").val(Po[0].Descripcion);
                $("#txtWeight").val(Po[0].GramajeAcabado);

                ObtenerColorPo();

            }
            $("#mdPo").modal("hide");
            // $("#btnCloseModalPO").trigger("click");

            $(document.body).removeAttr("style");

        }
    }
}
*/

function LoadSelectedPartidas() {
    var nSelected = 0;

    var PartidaRelacionadaNew = new Array();

    $(".chkSelectedPartida").each(function () {

        if (this.checked) {
            var params = $(this).attr("data-params").split(',');
            var obj = {
                IdRelacion: 0,
                CodigoPartida: params[0],
                ReporteTecnico: params[1],
                NumeroPartida: params[2],
                Status: params[3],
                NombreFabrica: params[4],
                NombreCliente: params[5],
                EstadoRegistro: "new",
                Eliminado: 0

            }

            PartidaRelacionadaNew.push(obj);
            nSelected++;
        }
    });

    if (nSelected == 0) {
        swal("Alert!", "Por favor seleccione al menos una Partida", "warning");
        return false;
    } else {
        if (PartidaRelacionadaNew.length > 0) {

            var nPartidaRelacionadaNew = PartidaRelacionadaNew.length;
            for (var i = 0; i < nPartidaRelacionadaNew; i++) {
                if (PartidaRelacion.some(x => x.CodigoPartida === PartidaRelacionadaNew[i].CodigoPartida)) {
                    PartidaRelacionadaNew[i].EstadoRegistro = "repetido";
                }
            }

            var Relacion = PartidaRelacionadaNew.filter(x => x.EstadoRegistro === "new");
            var nRelacion = Relacion.length;
            if (nRelacion > 0) {

                var html = "";

                for (var i = 0; i < nRelacion; i++) {
                    html += "<tr class='PartidaRelacion' data-status='new' data-id='" + Relacion[i].IdRelacion + "'>";
                    html += "<td><a data-status='new' onclick='DeletePartidaRelacion(this," + Relacion[i].CodigoPartida + ")'>Delete</a></td>";
                    html += "<td>" + Relacion[i].ReporteTecnico + "</td>";
                    html += "<td>" + Relacion[i].NumeroPartida + "</td>";
                    html += "<td>" + Relacion[i].Status + "</td>";
                    html += "<td>" + Relacion[i].NombreFabrica + "</td>";
                    html += "<td>" + Relacion[i].NombreCliente + "</td>";
                    html += "</tr>";
                    PartidaRelacion.push(Relacion[i]);
                }

                $("#tbodyPartidaRelacion").append(html);
                // Cargar combo de colores                                
            }
            $("#mdPartida").modal("hide");
        }
    }
}

/*
//function ObtenerColorPo() {

//    var PoStr = "";
//    var EstiloStr = "";

//    var PoArray = new Array();
//    var EstilloArray = new Array();

//    $(".CodigoPo").each(function () {

//        var CodigoPo = $(this).text();
//        var index = PoArray.indexOf(CodigoPo);
//        if (index < 0) {
//            PoStr += CodigoPo + "*";
//            PoArray.push(CodigoPo);
//        }
//    });

//    $(".CodigoEstilo").each(function () {

//        var CodigoEstilo = $(this).text();
//        var index = EstilloArray.indexOf(CodigoEstilo);
//        if (index < 0) {
//            EstiloStr += CodigoEstilo + "*";
//            EstilloArray.push(CodigoEstilo);
//        }
//    });


//    PoStr = PoStr.substring(0, PoStr.length - 1);
//    EstiloStr = EstiloStr.substring(0, EstiloStr.length - 1);

//    var par = PoStr + "," + EstiloStr;
//    var urlaccion = 'Laboratorio/Partida/GetPoColor?par=' + par;
//    Get(urlaccion, CargarComboColor);

//}
*/

/*
//function CargarComboColor(data) {
//    if (data != "[]") {
//        var Color = JSON.parse(data);
//        $("#cboColor").empty();
//        var html = "";
//        html = "<option value=''>Seleccione</option>" + _comboFromJSON(Color, "NombreColor", "NombreColor");
//        FillSelect("cboColor", html);

//        if (Solicitud != null) {
//            $("#cboColor").val(Solicitud.NombreColor);
//        }

//        $("#cboColor").show();
//        $("#txtColor").hide();

//    } else {
//        $("#cboColor").empty();
//        $("#cboColor").hide();
//        $("#txtColor").show();
//    }
//}
*/

function AddStyle() {
    var CodigoEstilo = $("#txtCodigoEstilo").val();
    if (CodigoEstilo == "") {
        swal("Alert!", "Por favor ingrese un codigo de estilo", "warning");
        return false;
    }

    if (EstiloPartida.some(x => x.CodigoEstilo === CodigoEstilo)) {
        swal("Alert!", "La partida ya contiene relacionado el estilo " + CodigoEstilo, "warning");
        return false;
    }

    var obj = {
        CodigoPartida: 0,
        CodigoEstilo: CodigoEstilo,
        EstadoRegistro: "new",
        Eliminado: 0
    }

    EstiloPartida.push(obj);

    var html = "";

    html += "<tr class='EstiloPartida' data-status='new' data-id='" + CodigoEstilo + "'>";
    html += "<td><a data-status='new' onclick=DeleteStyle(this,'" + CodigoEstilo + "')>Delete</a></td>";
    html += "<td>" + CodigoEstilo + "</td>";
    html += "</tr>";

    $("#tbodyStyle").append(html)

}

function DeleteStyle(obj, CodigoEstilo) {

    var Status = $(obj).attr("data-status");
    $(obj).closest("tr").remove();

    //if (Status == "old") {
    //    var objEstilo = {
    //        CodigoPartida: 0,
    //        CodigoEstilo: CodigoEstilo,
    //        Eliminado: 1,
    //        EstadoRegistro: "old"
    //    }        
    //    EstiloEliminado.push(objEstilo);
    //}
    var index = EstiloPartida.findIndex(x => x.CodigoEstilo === CodigoEstilo);
    if (index >= 0) {
        EstiloPartida[index].Eliminado = 1;
    }

}

function SearchTela() {

    var CodigoTela = $("#txtCodigoTelaMD").val();
    var CodigoFamilia = $("#cboFamilia").val();
    var Mensaje = "";
    if (CodigoTela == "") {
        Mensaje += "Por favor ingrese un codigo de tela </br>";
    }

    if (CodigoFamilia == "") {
        Mensaje += "Por favor seleccione una familia de tela</br>";
    }

    if (Mensaje != "") {

        swal({
            title: "Alert!",
            html: true,
            text: Mensaje,
            type: "warning",
        });

        return false;
    }

    var par = CodigoFamilia + "," + CodigoTela;

    Get('Laboratorio/Partida/SearchTela?par=' + par, LoadTela);

}

function LoadTela(data) {
    if (data != "[]") {
        var Telas = JSON.parse(data);
        var nTelas = Telas.length;
        var html = "";
        html += "<table id='tblTela' class='table table-bordered table-hover'><thead><tr><th>Codigo Tela</th><th>Descripcion</th><th>Familia</th><th>Weight</th></tr></thead>";
        for (var i = 0; i < nTelas; i++) {
            html += "<tr style='cursor:pointer' ondblclick='SelectTela(this)' data-param='" + Telas[i].CodigoTela + "," + Telas[i].DescripcionTela + "," + Telas[i].GramajeAcabado + "'>";
            html += "<td>" + Telas[i].CodigoTela + "</td>";
            html += "<td>" + Telas[i].DescripcionTela + "</td>";
            html += "<td>" + Telas[i].NombreFamilia + "</td>";
            html += "<td>" + Telas[i].GramajeAcabado + "</td>";
            html += "</tr>";
        }
        $("#divModalTela").empty();
        $("#divModalTela").append(html);


        //$("#tblTela").dataTable();

        $('#tblTela').DataTable({
            "pageLength": 5,
            "searching": false,
            "info": false,
            "lengthChange": false
        });
    }
}

function SelectTela(obj) {
    var ParamsArr = $(obj).attr("data-param").split(',');
    $("#txtTela").val(ParamsArr[0]);
    $("#txtDescripcionTela").val(ParamsArr[1]);
    $("#txtWeight").val(ParamsArr[2]);

    $("#txtDescripcionTela").prop("readonly", true);
    $("#txtWeight").prop("readonly", true);


    $("#mdTela").modal("hide");
}

function Save() {

    var Mensaje = '', CodigoFabrica = '', CodigoTintoreria = '', CodigoCliente = '';

    var CodigoPartida = parseInt($("#hfCodigoPartida").val());
    var nPo = $(".PoPartida").length;
    var nPartidaRelacion = $(".PartidaRelacion").length;

     var Reproceso = $("#cboReproceso").val();
     var NumeroPartida = $("#txtPartida").val();
     var FechaIngreso = $("#txtFechaSolicitud").val();
     var TipoPrueba = $("#cboPrueba").val();
     if (CodigoPartida == 0) {
         CodigoFabrica = $("#cboFabrica").val();
         CodigoTintoreria = $("#cboTintoreria").val();
         CodigoCliente = $("#cboCliente").val();
     } else {
         CodigoFabrica = $("#hfCodigoFabrica").val();
         CodigoTintoreria = $("#hfCodigoTintoreria").val();
         CodigoCliente = $("#hfCodigoCliente").val();
     }

     var NombreColor = "";
     if (nPo > 0) { NombreColor = $("#cboColor").val(); } else { NombreColor = $("#txtColor").val(); }

     var CodigoColorTintoreria = $("#txtCodigoColor").val().trim();
     var Material = $("#cboMaterial").val();
     var CodigoTela = $("#txtTela").val();
     var GramajeAcabado = $("#txtWeight").val();
     var Proceso = $("#cboProceso").val();
     var Lavado = $("#cboLavado").val();
     var Complemento = $("#cboComplemento").val();
     var CodigoTemporada = $("#cboTemporada").val();
     var DescripcionTela = $("#txtDescripcionTela").val();
     var ComentarioSolicitud = $("#txtComentarios").val();
     var InstruccionCuidadoSolicitud = $("#txt_InstruccionesCuidadoFabrica").val();

     if (Reproceso == '') { Mensaje += "<tr><td>Seleccionar si la solicitud de partida es un reproceso o no.</td></tr>"; }
     if (Reproceso == 'S') {       
         if (nPartidaRelacion == 0) { Mensaje += "<tr><td>Si la solicitud de partida es un reproceso ingresar una partida.</td></tr>"; }
     }
    
     if (NumeroPartida === '') { Mensaje += "<tr><td>Número de Partida</td></tr>"; }
     if (FechaIngreso === '') { Mensaje += "<tr><td>Fecha de Ingreso</td></tr>>"; }
     if (TipoPrueba === '') { Mensaje += "<tr><td>Tipo de Prueba</td></tr>"; }
     if (CodigoFabrica === '') { Mensaje += "<tr><td>Fábrica</td></tr>"; }
     if (CodigoTintoreria === '') { Mensaje += "<tr><td>Tintoreria</td></tr>"; }
     if (CodigoCliente === '') { Mensaje += "<tr><td>Cliente</td></tr>"; }
     if (NombreColor === '') { Mensaje += "<tr><td>Color</td></tr>"; }
     //if (CodigoColorTintoreria === '') { Mensaje += "<tr><td>Código de Color Tintoreria</td></tr>"; }
     
     if (CodigoTela == "") {
         if (DescripcionTela === '') { Mensaje += "<tr><td>Descripción de Tela</td></tr>"; }
         if (GramajeAcabado === '') { Mensaje += "<tr><td>Peso de Tela (Weight)</td></tr>"; }
         CodigoTela = "000000000";
     }    

    if ((TipoPrueba == 'gf' || TipoPrueba == 'gp' || TipoPrueba == 'pp' || TipoPrueba == 'f' || TipoPrueba == 'p') && CodigoCliente != '00001' && CodigoCliente != '00209' && CodigoCliente != '00250') {        
        if (nPo == 0) { Mensaje += "<tr><td>Este tipo de prueba para este cliente requiere que ingrese PO's. </td></tr>"; }
    }

    if (TipoPrueba == 'gp' || TipoPrueba == 'gf' || TipoPrueba == 'p' || TipoPrueba == 'pp' || TipoPrueba == 'f') {
        let req = required_instruccioncuidado({ id: 'tabla_content_instruccioncuidado', clase: '_enty' });
        Mensaje += req;
    }

    required_formulario({ id: 'formulario', clase: '_enty' });
        
    if (Mensaje != "") {
        MensajeTotal = '<table><thead><th><b>Debe tener en cuenta los siguientes campos requeridos</th></thead><tbody style="text-align:left">' + Mensaje + '</tbody></table>';
        swal({
            title: "Alert!",
            html: true,
            text: MensajeTotal,
            type: "warning",
        });
        return false;
    }

    FechaIngreso = FechaIngreso.split('/')[2] + FechaIngreso.split('/')[0] + FechaIngreso.split('/')[1];
     
    var objPartida = {
        CodigoPartida: CodigoPartida,
        NumeroPartida: NumeroPartida,
        FechaIngreso: FechaIngreso,
        TipoPrueba: TipoPrueba,
        CodigoFabrica: CodigoFabrica,
        CodigoTintoreria: CodigoTintoreria,
        CodigoCliente: CodigoCliente,
        NombreColor: NombreColor,
        CodigoTela: CodigoTela,
        DescripcionTela: DescripcionTela,
        GramajeAcabado: GramajeAcabado,
        Material: Material,
        Proceso: Proceso,
        Lavado: Lavado,
        Complemento: Complemento,
        InstruccionCuidadoSolicitud: InstruccionCuidadoSolicitud,
        ComentarioSolicitud: ComentarioSolicitud,
        CodigoTemporada: CodigoTemporada,        
        CodigoColorTintoreria: CodigoColorTintoreria
    };


    var PoEstiloArr = new Array();
    var PartidaRelacionadaArr = new Array();
    var EstiloArr = new Array();

    PoEstilo.filter(x => x.EstadoRegistro === "new").forEach(x => { PoEstiloArr.push(x); })
    PoEstilo.filter(x => x.Eliminado === 1).forEach(x => { PoEstiloArr.push(x); })

    PartidaRelacion.filter(x => x.EstadoRegistro === "new").forEach(x => { PartidaRelacionadaArr.push(x); })
    PartidaRelacion.filter(x => x.Eliminado === 1).forEach(x => { PartidaRelacionadaArr.push(x); })

    EstiloPartida.filter(x => x.EstadoRegistro === "new").forEach(x => { EstiloArr.push(x); })
    EstiloPartida.filter(x => x.Eliminado === 1).forEach(x => { EstiloArr.push(x); })


    var frm = new FormData();
    frm.append("parHead", JSON.stringify(objPartida));

    if (PoEstiloArr.length > 0) {
        frm.append("parDetail", JSON.stringify(PoEstiloArr));
    } else {
        frm.append("parDetail", "");
    }
    
    if (EstiloArr.length > 0) {
        frm.append("parSubDetail", JSON.stringify(EstiloArr));
    } else {
        frm.append("parSubDetail", "");
    }

    if (PartidaRelacionadaArr.length > 0) {
        frm.append("parFoot", JSON.stringify(PartidaRelacionadaArr));
    } else {
        frm.append("parFoot", "");
    }

    if (oVariables.arrInstruccionCuidadoChk.length > 0) { frm.append('parSubFoot', JSON.stringify(oVariables.arrInstruccionCuidadoChk)); }
    else { frm.append('parSubFoot', ''); }


    Post('Laboratorio/Partida/Save', frm, Alerta);
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

function DigitosEnteroBlur(obj) {
    var value = obj.value;
    if (isNaN(value)) {
        obj.value = "0";
        return;
    }
}

function GroupBy(data, toGroup, toSum) {
    var cont = 1;
    var ArrayGroup = new Array();
    var ntoGroup = 0;
    var ntoSum = 0;
    var toGroupArr = null;
    var toSumArr = null;

    var result = data.reduce(function (res, obj) {

        if (toGroup != "") {
            toGroupArr = toGroup.split(',');
            ntoGroup = toGroupArr.length;
        }

        if (toSum != "") {
            toSumArr = toSum.split(',');
            ntoSum = toSumArr.length;
        }

        var objGroup = new Object();

        for (i = 0; i < ntoGroup; i++) {
            objGroup[toGroupArr[i]] = obj[toGroupArr[i]];
        }

        var index = ArrayGroup.findIndex(function (item, i) {
            return JSON.stringify(objGroup) == JSON.stringify(item);
        });

        var objGroupTotal = new Object();

        if (index < 0) {

            ArrayGroup.push(objGroup);

            for (i = 0; i < ntoGroup; i++) {
                objGroupTotal[toGroupArr[i]] = obj[toGroupArr[i]];
            }

            for (i = 0; i < ntoSum; i++) {
                objGroupTotal[toSumArr[i]] = obj[toSumArr[i]];
            }

            res.__array.push(objGroupTotal);
        } else {
            for (i = 0; i < ntoSum; i++) {
                res.__array[index][toSumArr[i]] += obj[toSumArr[i]];
            }
        }

        cont++;

        return res;

    }, { __array: [] })

    return result.__array;
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

function FillSelect(id, html) {
    $("#" + id).append(html);
}

/* Luis : Reproceso */
//function ShowModalPartida() {

//    var par = $("#hfCodigoPartida").val() + "," + $("#txtPartida").val();

//    Get('Laboratorio/Partida/SearchPartidaRelacion?par=' + par, LoadPartidaRelacionada);

//    //$("#mdPartida").modal("show");
//}

function ShowModalPartida() {    

    var par = $("#hfCodigoPartida").val() + "," + $("#txtPartida").val() + "," + $("#hfCodigoFabrica").val();

    Get('Laboratorio/Partida/SearchPartidaRelacion?par=' + par, LoadPartidaRelacionada);

    //$("#mdPartida").modal("show");
}

/* Luis : Po */
//Abrir Modal de Po
function ShowModalPo() {
    $("#mdPo").modal("show");
}

//Buscar PO
function SearchPo() {
    var CodigoPo = $("#txtNumeroPO").val();
    if (CodigoPo == "") {
        swal("Alert!", "Ingrese un numero de PO", "warning");
        return false;
    }

    var CodigoPartida = parseInt($("#hfCodigoPartida").val());
    var CodigoCliente = "";
    var CodigoFabrica = "";

    if (CodigoPartida == 0) {
        CodigoFabrica = $("#cboFabrica").val();
        CodigoCliente = $("#cboCliente").val();
    } else {
        CodigoFabrica = $("#hfCodigoFabrica").val();
        CodigoCliente = $("#hfCodigoCliente").val();
    }

    var par = CodigoCliente + "," + CodigoFabrica + "," + $("#txtNumeroPO").val();
    Get('Laboratorio/Partida/SearchPo?par=' + par, LoadPo);
}

//Cargar PO Resultado en Modal
function LoadPo(data) {
    if (data != "[]") {
        var Lotes = JSON.parse(data);
        var nLotes = Lotes.length;
        var html = "";
        /* Luis */
        html += "<table id='tblPO' class='table table-bordered'><thead><tr><th></th><th>CodigoPo</th><th>CodigoEstilo</th><th>Lote</th><th>Tela</th><th>Descripcion Tela</th><th>Weight</th><th>Color</th></tr></thead>";
        //html += "<table id='tblPO' class='table table-bordered'><thead><tr><th>Select</th><th>CodigoPo</th><th>CodigoEstilo</th><th>Lote</th><th>Tela</th><th>Descripcion Tela</th><th>Weight</th></tr></thead>";
        for (var i = 0; i < nLotes; i++) {
            html += "<tr>";
            html += "<td><input type='checkbox' class='chkSelectedPO' data-destela='" + Lotes[i].DescripcionTela + "' data-gramaje = '" + Lotes[i].GramajeAcabado + "' data-params='" + Lotes[i].CodigoPo + "," + Lotes[i].CodigoEstilo + "," + Lotes[i].Lote + "," + Lotes[i].CodigoTela + "," + Lotes[i].TieneComplemento + "'></td>";
            html += "<td>" + Lotes[i].CodigoPo + "</td>";
            html += "<td>" + Lotes[i].CodigoEstilo + "</td>";
            html += "<td>" + Lotes[i].Lote + "</td>";
            html += "<td>" + Lotes[i].CodigoTela + "</td>";
            html += "<td>" + Lotes[i].DescripcionTela + "</td>";
            html += "<td>" + Lotes[i].GramajeAcabado + "</td>";
            html += "<td>" + Lotes[i].Color + "</td>";
            html += "</tr>";
        }

        html += "</table>";
        $("#divModalPo").empty();
        $("#divModalPo").append(html);

        $('#tblPO').DataTable({
            "pageLength": 5,
            "searching": false,
            "info": false,
            "lengthChange": false
        });
    } else {
        swal("Alert!", "No se han encontrando la PO, verifique el cliente y fabrica seleccionado", "warning");
        return false;
    }
}

//Obtener las PO seleccionadas
function LoadSelectedPos() {
    var nSelected = 0;
    var PoEstiloNew = new Array();

    $(".chkSelectedPO").each(function () {
        if (this.checked) {
            var params = $(this).attr("data-params").split(',');
            var Descripcion = $(this).attr("data-destela");
            var GramajeAcabado = parseFloat($(this).attr("data-gramaje"));
            var obj = {
                CodigoPo: params[0],
                CodigoEstilo: params[1],
                Lote: params[2],
                CodigoTela: params[3],
                Descripcion: Descripcion,
                GramajeAcabado: GramajeAcabado,
                Eliminado: 0,
                EstadoRegistro: "new",
                TieneComplemento: params[4]
            }
            PoEstiloNew.push(obj);
            nSelected++;
        }
    });

    if (nSelected == 0) {
        swal("Alert!", "Por favor seleccione al menos una PO", "warning");
        return false;
    } else {
        if (PoEstiloNew.length > 0) {

            var GroupTela = GroupBy(PoEstiloNew, "CodigoTela", "");
            if (GroupTela.length > 1) {
                swal("Alert!", "Debe seleccionar POs con la misma Tela", "warning");
                return false;
            }

            var nPoEstiloNew = PoEstiloNew.length;
            /* Luis */
            //for (var i = 0; i < nPoEstiloNew; i++) {
            //    if (PoEstilo.some(x => x.CodigoPo === PoEstiloNew[i].CodigoPo && x.CodigoEstilo === PoEstiloNew[i].CodigoEstilo && x.Lote === PoEstiloNew[i].Lote)) {
            //        PoEstiloNew[i].EstadoRegistro = "repetido";
            //    }
            //}

            for (var i = 0; i < nPoEstiloNew; i++) {
                if (PoEstilo.some(x => x.CodigoPo === PoEstiloNew[i].CodigoPo && x.CodigoEstilo === PoEstiloNew[i].CodigoEstilo && x.Lote === PoEstiloNew[i].Lote && x.Eliminado === 0)) {
                    PoEstiloNew[i].EstadoRegistro = "repetido";
                }
            }

            var Po = PoEstiloNew.filter(x => x.EstadoRegistro === "new");
            var nPo = Po.length;
            if (nPo > 0) {

                var html = "";
                /* Luis */
                //for (var i = 0; i < nPo; i++) {
                //    html += "<tr class='PoPartida' data-status='new' data-params='" + Po[i].CodigoPo + "','" + Po[i].CodigoEstilo + "," + Po[i].Lote + "'>";
                //    var params = 'this,"' + Po[i].CodigoPo + '","' + Po[i].CodigoEstilo + '","' + Po[i].Lote + '","' + Po[i].CodigoTela + '"';
                //    html += "<td><a data-status='old' onclick='DeletePoPartida(" + params + ")'>Delete</a></td>";
                //    html += "<td class='CodigoPo'>" + Po[i].CodigoPo + "</td>";
                //    html += "<td class='CodigoEstilo'>" + Po[i].CodigoEstilo + "</td>";
                //    html += "<td>" + Po[i].Lote + "</td>";
                //    html += "</tr>";
                //    PoEstilo.push(Po[i]);
                //}

                for (var i = 0; i < nPo; i++) {
                    html += "<tr class='PoPartida' data-status='new' data-params='" + Po[i].CodigoPo + "','" + Po[i].CodigoEstilo + "," + Po[i].Lote + "'>";
                    var params = 'this,"' + Po[i].CodigoPo + '","' + Po[i].CodigoEstilo + '","' + Po[i].Lote + '","' + Po[i].CodigoTela + '"';
                    html += "<td><a data-status='old' onclick='DeletePoPartida(" + params + ")'>Delete</a></td>";
                    html += "<td class='CodigoPo'>" + Po[i].CodigoPo + "</td>";
                    html += "<td class='CodigoEstilo'>" + Po[i].CodigoEstilo + "</td>";
                     html += "<td class='CodigoLote'>" + Po[i].Lote + "</td>";
                    if (Po[i].TieneComplemento.length > 0) {
                        html += "<td  class='Complemento'>" + "<strong><span style='color: #ff0000;'>Con Complemento</span></strong>" + "</td>";
                    } else {
                        html += "<td  class='Complemento'>" + "" + "</td>";
                    }                   
                    html += "</tr>";
                    PoEstilo.push(Po[i]);
                }

                $("#tbodyPO").append(html);

                $("#txtTela").val(Po[0].CodigoTela);
                $("#txtDescripcionTela").val(Po[0].Descripcion);
                $("#txtWeight").val(Po[0].GramajeAcabado);
                ObtenerColorPo();
            }
            $("#mdPo").modal("hide");
            $(document.body).removeAttr("style");
        }
    }
}

//Obtener los colores de las PO seleccionadas
function ObtenerColorPo() {
    var PoStr = "";
    var EstiloStr = "";
    var PoArray = new Array();
    var EstilloArray = new Array();

    $(".CodigoPo").each(function () {
        var CodigoPo = $(this).text();
        var index = PoArray.indexOf(CodigoPo);
        if (index < 0) {
            PoStr += CodigoPo + "*";
            PoArray.push(CodigoPo);
        }
    });

    $(".CodigoEstilo").each(function () {
        var CodigoEstilo = $(this).text();
        var index = EstilloArray.indexOf(CodigoEstilo);
        if (index < 0) {
            EstiloStr += CodigoEstilo + "*";
            EstilloArray.push(CodigoEstilo);
        }
    });

    var LoteStr = "";
    var LoteArray = new Array();

    $(".CodigoLote").each(function () {
        var CodigoLote = $(this).text();
        var index = LoteArray.indexOf(CodigoLote);
        if (index < 0) {
            LoteStr += CodigoLote + "*";
            LoteArray.push(CodigoLote);
        }
    });

    PoStr = PoStr.substring(0, PoStr.length - 1);
    EstiloStr = EstiloStr.substring(0, EstiloStr.length - 1);
    LoteStr = LoteStr.substring(0, LoteStr.length - 1);

    //var par = PoStr + "," + EstiloStr + "," + LoteStr;
    var par = PoStr + "," + EstiloStr;
    var urlaccion = 'Laboratorio/Partida/GetPoColor?par=' + par;
    Get(urlaccion, CargarComboColor);
}

//Cargar los colores de las PO en el combo
function CargarComboColor(data) {
    if (data != "[]") {
        var Color = JSON.parse(data);
        $("#cboColor").empty();
        var html = "";
        html = "<option value=''>Seleccione</option>" + _comboFromJSON(Color, "NombreColor", "NombreColor");
        FillSelect("cboColor", html);

        if (Solicitud != null) { $("#cboColor").val(Solicitud.NombreColor); }

        $("#cboColor").show();
        $("#txtColor").hide();

    } else {
        $("#cboColor").empty();
        $("#cboColor").hide();
        $("#txtColor").show();
    }
}

//Eliminar las PO
function DeletePoPartida(obj, CodigoPo, CodigoEstilo, Lote, CodigoTela) {

    var Status = $(obj).attr("data-status");
    $(obj).closest("tr").remove();

    /* Luis */
    //var index = PoEstilo.findIndex(x => x.CodigoPo === CodigoPo && x.CodigoEstilo === CodigoEstilo && x.Lote === Lote);
    var index = PoEstilo.findIndex(x => x.CodigoPo === CodigoPo && x.CodigoEstilo === CodigoEstilo && x.Lote === Lote && x.Eliminado === 0);

    if (index >= 0) { PoEstilo[index].Eliminado = 1; }

    ObtenerColorPo();

    var nPo = $(".PoPartida").length;
    if (nPo == 0) {
        $("#txtDescripcionTela").prop("readonly", false);
        $("#txtWeight").prop("readonly", false);
    }
}

//Obtener las Instrucciones de Cuidado
function req_InstruccionCuidado() {
    const parametroJSON = { flg_vista: 0 };
    const url = 'Laboratorio/Partida/Get_InstruccionCuidado?par=' + JSON.stringify(parametroJSON);
    Get(url, fn_ObtenerInstruccionCuidado);
}

//Obtener Instrucciones de Cuidado
function fn_ObtenerInstruccionCuidado(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].categoriainstruccioncuidado != '') { oVariables.arrCategoriaInstruccionCuidado = orpta[0].categoriainstruccioncuidado; } else { oVariables.arrCategoriaInstruccionCuidado = []; }
        if (orpta[0].instruccioncuidado != '') { oVariables.arrInstruccionCuidado = orpta[0].instruccioncuidado; } else { oVariables.arrInstruccionCuidado = []; }
        if (oVariables.Codigo_Partida <= 0) { fn_CargarInstrucionCuidado(); }
    }
}

//Cargar Instruccones de Cuidado
function fn_CargarInstrucionCuidado() {
    let arrHeader = oVariables.arrCategoriaInstruccionCuidado.length > 0 ? JSON.parse(oVariables.arrCategoriaInstruccionCuidado) : [];
    let arrBody = oVariables.arrInstruccionCuidado.length > 0 ? JSON.parse(oVariables.arrInstruccionCuidado) : [];

    if (arrHeader.length > 0) {
        if (oVariables.Codigo_Partida <= 0) {
            arrHeader = arrHeader.filter(x=> x.estado === 0);
            arrBody = arrBody.filter(y=> y.estado === 0);
        }
        load_table(arrHeader, arrBody);
    }
}

//Mostrar Instrucciones de Cuidado
function load_table(_arrHeader, _arrBody) {
    let html = '', htmlini = '', htmlfin = '', htmlheader = '', htmlbody = '';
    let cont = 0, conttotal = 0;

    let cantidadmaxima = _arrHeader.length;

    _arrHeader.forEach(x=> {
        conttotal++, cont++;
        htmlheader += `
                     <div class ='col-sm-3'>
                            <table id='${x.categoriainstruccioncuidado}' class ='table table-bordered table-hover ${x.clase}'>
                                <thead>
                                    <th colspan='2'>${x.categoriainstruccioncuidado}</th>
                                </thead>
                                <tbody>
                    `;

        let arric = _arrBody.filter(y=> y.idcategoriainstruccioncuidado === x.idcategoriainstruccioncuidado);
        arric.forEach(y=> {
            htmlbody += `
                        <tr data-par='idinstruccioncuidado:${y.idinstruccioncuidado},idcategoriainstruccioncuidado:${y.idcategoriainstruccioncuidado},instruccioncuidadoingles:${y.instruccioncuidadoingles}'>
                            <td class='col-sm-1'>
                                <div  class ='i-checks _clsdivlabdip'>
                                    <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                        <label>
                                            <input type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td class='col-sm-11'>${y.instruccioncuidadoingles}</td>
                        </tr>
                        `;
        });

        htmlheader += htmlbody + `</tbody></table></div>`;
        htmlbody = '';

        if (cont == 1) { htmlini = `<div class="form-group"><div class ="form-horizontal row"><div class="col-sm-12">`; }
        if (cont == 4 || cantidadmaxima == conttotal) {
            htmlfin = `</div></div></div>`;
            html += htmlini + htmlheader + htmlfin;
            cont = 0, htmlini = '', htmlheader = '', htmlfin = '';
        }
    });

    _('tabla_content_instruccioncuidado').innerHTML += html;

    let divtablas = _('tabla_content_instruccioncuidado');
    let arrchk = Array.from(divtablas.getElementsByClassName('_chkitem'));

    if (arrchk.length > 0) {
        arrchk.forEach(x=> {
            let m = x;
            let h = "";
            if (oVariables.arrInstruccionCuidadoChk.length > 0) {
                let fila = x.parentNode.parentNode.parentNode;
                let m = fila.getAttribute('data-par');
                let chk = x.children[0].children[0];
                if (chk != undefined) {
                    chk.checked = oVariables.arrInstruccionCuidadoChk.some(y=> {
                        return (y.idcategoriainstruccioncuidado.toString() === _par(m, 'idcategoriainstruccioncuidado') && y.idinstruccioncuidado.toString() === _par(m, 'idinstruccioncuidado'))
                    });
                }

            }
        });
    }

    handler_check();

}

//Obtener Instrucciones de Cuidado Seleccionadas
function handler_check() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let arrtemp = [], obj = {};
        let x = e.currentTarget;
        let chk = x.checked;
        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let par = fila.getAttribute('data-par');
        let idinstruccioncuidado = _par(par, 'idinstruccioncuidado');
        let idcategoriainstruccioncuidado = _par(par, 'idcategoriainstruccioncuidado');
        let instruccioncuidadoingles = _par(par, 'instruccioncuidadoingles');
        obj.idinstruccioncuidado = parseInt(idinstruccioncuidado);
        obj.idcategoriainstruccioncuidado = parseInt(idcategoriainstruccioncuidado);
        obj.instruccioncuidadoingles = instruccioncuidadoingles;
        if (chk) { oVariables.arrInstruccionCuidadoChk.push(obj); }
        else {
            arrchk = oVariables.arrInstruccionCuidadoChk.filter(y=>y.idinstruccioncuidado + '¬' + y.idcategoriainstruccioncuidado !== idinstruccioncuidado + '¬' + idcategoriainstruccioncuidado);
            oVariables.arrInstruccionCuidadoChk = arrchk;
        }

        let text = '';

        //oVariables.arrInstruccionCuidadoChk.sort(function (a, b) {
        //    if (a.idcategoriainstruccioncuidado > b.idcategoriainstruccioncuidado) { return 1; }
        //    if (a.idcategoriainstruccioncuidado < b.idcategoriainstruccioncuidado) { return -1; }
        //    if (a.instruccioncuidadoingles > b.instruccioncuidadoingles) return 1;
        //    if (a.instruccioncuidadoingles < b.instruccioncuidadoingles) return -1;
        //    return 0;
        //});
        oVariables.arrInstruccionCuidadoChk.forEach(h=> { text += h.instruccioncuidadoingles + ' / '; });
        _('txt_InstruccionesCuidadoFabrica').value = text.slice(0, -3);;
    });
}

//Validar que hallan sido seleccionadas las instrucciones de cuidado
function required_instruccioncuidado(oenty) {
    let divformulario = _(oenty.id), resultado = '', pruebas = '';
    let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    let array = Array.prototype.slice.apply(elementsselect2);
    array.forEach(x=> {
        let nombretabla = x.getAttribute('id');
        let tablebody = x.tBodies[0],
            arrchk = [...tablebody.getElementsByClassName('checked')];
        if (arrchk.length == 0) { pruebas += nombretabla + ' / '; }
    })
    if (pruebas != '') { resultado = '<tr><td>Instrucción de Cuidado de las Categorias: ' + pruebas.slice(0, -3) + '</tr></td>'; }
    return resultado;
}

function required_formulario(oenty) {
    let divformulario = _(oenty.id), resultado = true;
    let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    let array = Array.prototype.slice.apply(elementsselect2);
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode.parentNode, att = x.getAttribute('data-required'), display = x.style.display;
        if (att && display != 'none') {
            if (valor == '') { padre.classList.add('has-error'); resultado = false; }
            else { padre.classList.remove('has-error'); }
        }
    });
}



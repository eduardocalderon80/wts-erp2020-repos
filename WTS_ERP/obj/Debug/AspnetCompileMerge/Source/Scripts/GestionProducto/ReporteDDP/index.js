 var ovariables = {
    idgrupocomercial: ''
 }

function load() {
    let par = _('txtpar').getAttribute('data-par')
    
    _('btnExport').addEventListener('click', Exportar);
    _('btnSearch').addEventListener('click', Buscar);

    _('cboCliente').addEventListener('change', GetDatabyClient);

    $('#divPadreFechaInicio1 .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
    });
    $('#divPadreFechaInicio2 .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
    });

    var elem = document.querySelector('.js-switch');
    var init = new Switchery(elem);
     
    _('chk').addEventListener('change', ChangeCombo);

    $('.clscbostatus').select2();
    //Buscar();
}
 
function ChangeCombo(e) {   
    if (e.target.checked) {
        $('#lbl').text('All')
    } else {
        $('#lbl').text('Pending')
    }
}

function GetDatabyClient(event) {
    var frm = new FormData();
    let par = { idcliente: $("#cboCliente").val(), idgrupocomercial: ovariables.idgrupocomercial }
    //frm.append("par", JSON.stringify(par));
    //Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, ObtenerDatosCargaPorCliente);
}

function ObtenerDatosCargaPorCliente(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        if (JSONdata[0].Temporada != null) {
            var Temporada = JSON.parse(JSONdata[0].Temporada);
            $("#cboclientetemporada").empty();
            var htmlTemporada = "<option value='0'>ALL</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
            $("#cboclientetemporada").append(htmlTemporada);
        }

        if (JSONdata[0].Division != null) {
            var Division = JSON.parse(JSONdata[0].Division);
            $("#cboclientedivision").empty();
            var htmlDivision = "<option value='0'>ALL</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
            $("#cboclientedivision").append(htmlDivision);
        }

        //_('cboProgram').innerHTML = "<option value='0'>Select One</option>";
        //if (JSONdata[0].Programa != null) {
        //    var programa = JSON.parse(JSONdata[0].Programa);
        //    var htmlDivision = "<option value='0'>Select One</option>" + _comboFromJSON(programa, "IdPrograma", "Nombre");
        //    _('cboProgram').innerHTML = htmlDivision;
        //}    

    }
}
 
function Exportar() {
    let fechainicio = _convertDate_ANSI(_('txtFechaInicio').value), fechafin = _convertDate_ANSI(_('txtFechaFin').value), Cliente = $("#cboCliente").val(), Season = $("#cboclientetemporada").val(), Division = $("#cboclientedivision").val(),
        Fabrica = $("#cboProveedor").val(), estado = getCheck(), estadorequerimiento = getestadorequerimiento();

    parametro = { idcliente: Cliente, idclientetemporada: Season, idclientedivision: Division, fechainicio: fechainicio, fechafin: fechafin, Fabrica: Fabrica, estado: estado, estadorequerimiento: estadorequerimiento };

    let urlaccion = urlBase() + "GestionProducto/ReporteDDP/Export_ReporteDDP?par=" + JSON.stringify(parametro);
    $.ajax({
        type: 'GET',
        url: urlaccion,
        dataType: 'json',
        async: false,
        //data: { idfacturav: idfacturav }
    }).done(function (data) {
        if (data.Success) {
            urlaccion = urlBase() + 'GestionProducto/ReporteDDP/descargarexcel';
            window.location.href = urlaccion;
        }
    });
}

function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var Proveedor = JSON.parse(JSONdata[0].Proveedor);
    var estadorequerimiento = JSON.parse(JSONdata[0].estadorequerimiento);

    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);
 
    var htmlProveedor = _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
    $("#cboProveedor").append(htmlProveedor);

    var xestadorequerimiento = _comboFromJSON(estadorequerimiento, "valorestado", "nombreestado");
    $("#cbostatus").append(xestadorequerimiento);
}

function getCheck() {
    let check = $('#chk'), estado = 0;
    if (check[0].checked) {
        estado = 2
    }
    return estado;
}

function getestadorequerimiento() {
    let estreq = $('#cbostatus').val(), retornar = '';
    if (estreq !== null) {
        cantidad = estreq.length;
        for (i = 0; i < cantidad; i++) {
            if (i === 0) {
                retornar = estreq[i];
            } else {
                retornar += ',' + estreq[i];
            }           
        }
    }
    return retornar;
}

function Buscar(event) {
    let fechainicio= _convertDate_ANSI(_('txtFechaInicio').value),fechafin= _convertDate_ANSI(_('txtFechaFin').value), Cliente = $("#cboCliente").val(),Season = $("#cboclientetemporada").val(), Division = $("#cboclientedivision").val(),
        Fabrica = $("#cboProveedor").val(), estado = getCheck(), estadorequerimiento = getestadorequerimiento();

    _('tbody_index').innerHTML = '';
    parametro = { idcliente: Cliente, idclientetemporada: Season, idclientedivision: Division, fechainicio: fechainicio, fechafin: fechafin, Fabrica: Fabrica, estado: estado, estadorequerimiento: estadorequerimiento };
    urlaccion = 'GestionProducto/ReporteDDP/getData?par=' + JSON.stringify(parametro);
    Get(urlaccion, LLenarTabla);
}

function LLenarTabla(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(data), html = '', tbl = _('tbody_index');
    if (rpta != null) {
        if (dataparse != null) {
            let oData = CSVtoJSON(dataparse[0].Muestra, '¬', '^');
            if (oData != null && oData.length > 0) {
                tbl.innerHTML = '';

                let totalfilas = oData.length;
                for (let i = 0; i < totalfilas; i++) {
                  
                    html += `<tr data-par=''>
                                <td>${oData[i].Req}</td>
                                <td>${oData[i].Submit}</td>
                                <td>${oData[i].Type}</td>
                                <td>${oData[i].Team}</td>
                                <td>${oData[i].Client}</td>
                                <td>${oData[i].Season}</td>
                                <td>${oData[i].Division}</td>
                                <td>${oData[i].Style}</td>                              
                                <td>${oData[i].Fabric1}</td>
                                <td>${oData[i].Factory}</td>
                                <td>${oData[i].Color}</td>
                                <td>${oData[i].Size}</td>
                                <td>${oData[i].Qty}</td>
                                <td>${oData[i].CM}</td>
                                <td>${oData[i].RQty}</td>
                                <td>${oData[i].RCM}</td>
                                <td>${oData[i].ExFactory}</td>
                                <td>${oData[i].ExClient}</td>
                                <td>${oData[i].fechaftymax}</td>
                                <td>${oData[i].RegisterDate}</td>
                                <td>${oData[i].Week}</td>
                                <td>${oData[i].estado}</td>
                                <td>${oData[i].estadorequerimiento}</td>
                                <td>${oData[i].today}</td>
                            </tr>
                        `;
                }
                tbl.innerHTML = html;
            }
        }
    }
}

function req_ini() {
    Get('GestionProducto/Estilo/ObtenerDatosCarga', ObtenerDatosCarga);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
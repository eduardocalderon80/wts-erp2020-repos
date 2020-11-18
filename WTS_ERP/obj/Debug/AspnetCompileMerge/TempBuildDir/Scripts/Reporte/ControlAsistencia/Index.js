/// <reference path="../../home/util.js" />
var lstListaHoras = "", lstHijos = "", aCabeceras = [], lstPadres = [], aHorasPersonal = [], aPadres = [], aHijos = [];
var lstFeriado, aFeriados = [], lstAreas, aAreas = [];
var aMeses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var TipoBusqueda = 0;

$(document).ready(function () {

    //Initialize chosen
    $(".chosen-select").chosen({ disable_search_threshold: 10 });

    //datetimepicker({
    $("#dtFI .input-group.date").datepicker({
        //dateFormat: 'mm/dd/yyyy',
        format: 'dd M, yyyy',
        autoclose: true,       
        onSelect: function (date) {
            //defined your own method here
            alert(date);
        }
    });

    //datetimepicker({
    $("#dtFF .input-group.date").datepicker({
        //dateFormat: 'mm/dd/yyyy',
        format: 'dd M, yyyy',        
        autoclose: true
    }).datepicker("setDate", new Date());


    $('#dtFI .input-group.date').datepicker('update', moment().subtract(1, 'month').format('d M, yyyy'));
    //$('#dtFI .input-group.date').datepicker('setDate', '01 Mar, 2019');
    //$('#dtFI .input-group.date').datepicker('update', moment().subtract(1, 'month').dateFormat('d M, y'));
    //$('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('MM/DD/YYYY'));
    //$('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('d M, yyyy'));


    $("#btnSearch").click(function () {
        Search();
    });

    $("#txtNombre").keyup(function (e) {
        var code = e.which;
        if (code == 13) {
            if ($(this).val() == "") {
                swal({ title: "Advertencia", text: "Tienes que ingresar un nombre y/o apellido", type: "warning" });
            } else {
                Search();
            }
        }
    });

    $("#btnExportarReporteLaboratorio").click(function () {
        //ExportarReporteLaboratorio();
    });

    Search();
});

function LoadInitialData() {
    Get('Reporte/ControlAsistencia/GetDatosCarga', LoadListaControlAsistencia);
}

function Search() {
    //lstListaHoras = "", lstPersonal = "", aCabeceras = [], lstDepartamentos = [], aHorasPersonal = [], aPersonal = [], aDepartamentos = [];
    lstListaHoras = "", lstHijos = "", aCabeceras = [], lstPadres = [], aHorasPersonal = [], aPadres = [], aHijos = [];
    //Feriados y Areas
    lstFeriado = "", aFeriados = [], lstAreas = "", aAreas = [];
    var xFechaInicio = ConvertirFecha(document.getElementById("txtFI").value);
    var xFechaFin = ConvertirFecha(document.getElementById("txtFF").value);
    var txtNombre = document.getElementById("txtNombre").value;
    if (_isnotEmpty(txtNombre)) { TipoBusqueda = 1 }
    var par = xFechaInicio + "^" + xFechaFin + "^" + txtNombre;
    Get('Reporte/ControlAsistencia/GetDatosCarga?par=' + par, LoadListaControlAsistencia);
}

function LoadComboArea() {
    //console.log(aAreas);
    var cboaHijo = "";
    if (aAreas.length > 0) {
        for (var i = 0; i < aAreas.length; i++) {
            cboaHijo += '<option value=' + aAreas[i][0] + '>' + aAreas[i][1] + '</option>'
        }
    }
    _('cboArea').innerHTML = cboaHijo;
    //Update chosen
    $(".chosen-select").trigger('chosen:updated');
    _('cboArea_chosen').style.width = '220px';
}

$('#cboArea').chosen().change(function () {
    var cboArea = $("#cboArea").chosen().val();
    if (cboArea != null && cboArea != "") {
        var objPadres = [], objHijos = [];
        for (var i = 0; i < cboArea.length; i++) {
            var padreFilter = aPadres.filter(s => s.IdArea == cboArea[i]);
            if (padreFilter != "undefined" && padreFilter.length > 0) {
                objPadres.push(padreFilter[0]);
            }
        }
        for (var j = 0; j < cboArea.length; j++) {
            var hijoFilter = aHijos.filter(s => s.IdArea == cboArea[j]);
            if (hijoFilter != "undefined" && hijoFilter.length > 0) {
                objHijos.push(hijoFilter[0]);
            }
        }

        //console.log(objPadres);
        //console.log(objHijos);
        document.getElementById("divContent").innerHTML = "";
        CrearTabla(objPadres, objHijos, 1);
    } else {
        document.getElementById("divContent").innerHTML = "";
        CrearTabla(aPadres, aHijos);
    }
});

function LoadListaControlAsistencia(xData) {
    if (xData != "") {
        //console.log(xData.split("_"));
        aCabeceras = xData.split("_")[0].split("|");
        lstListaHoras = xData.split("_")[1].split(";");
        lstPadres = xData.split("_")[2] == "" ? "" : xData.split("_")[2].split(";");
        lstHijos = xData.split("_")[3] == "" ? "" : xData.split("_")[3].split(";");
        lstFeriado = xData.split("_")[4] == "" ? "" : xData.split("_")[4].split("¬");
        lstAreas = xData.split("_")[5] == "" ? "" : xData.split("_")[5].split("¬");

        var aCampos = [], aCamposPH = [], aObjeto = {}, aData = {}, lstListaPH, aObjetoHP = [];

        for (var i = 0; i < lstListaHoras.length; i++) {
            aCampos = lstListaHoras[i].split("|");
            aObjeto = { "codDepartamento": aCampos[0], "IdUsuarioMarcador": aCampos[1], "FechaOrden": aCampos[2], "Fecha": aCampos[3], "Entrada": aCampos[4], "Salida": aCampos[5], "Color": aCampos[6], "Total": +aCampos[7] };
            aHorasPersonal.push(aObjeto);
        }

        /* Feriados */
        var feriados = lstFeriado[0].split("|");
        var nFeriados = feriados.length;
        for (var i = 1; i < lstFeriado.length; i++) {
            feriados = lstFeriado[i].split("|");
            var obj = [];
            for (var j = 0; j < nFeriados; j++) {
                obj[j] = feriados[j];
                if (j == nFeriados - 1) {
                    aFeriados.push(obj);
                    obj = [];
                }
            }
        }

        /* Areas */
        var areas = lstAreas[0].split("|");
        var nAreas = areas.length;
        for (var i = 1; i < lstAreas.length; i++) {
            areas = lstAreas[i].split("|");
            var obj = [];
            for (var j = 0; j < nAreas; j++) {
                obj[j] = areas[j];
                if (j == nAreas - 1) {
                    aAreas.push(obj);
                    obj = [];
                }
            }
        }

        for (var k = 0; k < lstPadres.length; k++) {
            aCampos = lstPadres[k].split("|");
            lstListaPH = aCampos[2].split("¬");
            aData = [];
            aObjetoHP = [];
            for (var l = 0; l < lstListaPH.length; l++) {
                aCamposPH = lstListaPH[l].split("*");
                aData = {
                    "IdArea": aCamposPH[0], "IdUsuarioMarcador": aCamposPH[1], "NombreCompleto": aCamposPH[2], "lUsuarioAsistencia": aCamposPH[3]
                };
                aObjetoHP.push(aData);
            }

            aObjeto = {
                "IdArea": aCampos[0], "NombreArea": aCampos[1], "aData": aObjetoHP
            };
            aPadres.push(aObjeto);
        }
        aObjetoHP = [];
        lstListaPH = "";
        for (var m = 0; m < lstHijos.length; m++) {
            aCampos = lstHijos[m].split("|");
            lstListaPH = aCampos[3].split("¬");
            aData = [];
            aObjetoHP = [];
            for (var l = 0; l < lstListaPH.length; l++) {
                aCamposPH = lstListaPH[l].split("*");
                aData = {
                    "IdArea": aCamposPH[0], "IdUsuarioMarcador": aCamposPH[1], "NombreCompleto": aCamposPH[2], "lUsuarioAsistencia": aCamposPH[3]
                };
                aObjetoHP.push(aData);
            }
            aObjeto = { "IdPadre": aCampos[0], "IdArea": aCampos[1], "NombreArea": aCampos[2], "aData": aObjetoHP };
            aHijos.push(aObjeto);
        }

        CrearTabla(aPadres, aHijos, TipoBusqueda);
        TipoBusqueda = 0;
        LoadComboArea();
    } else {
        document.getElementById("divContent").innerHTML = "";
    }
}

function CrearTabla(aPadres, aHijos, aTipo) {
    var html = "", iPrimeraFila = 0, iRegistrosHoras = 0, iRegistrosTardanzas = 0, xWidth = "", iTamano = 0;

    //if (aCabeceras.length < 10) {
    //    iTamaño = 100;
    //    xWidth = iTamano + "%";
    //} else {
    for (var i = 0; i < (aCabeceras.length + 1); i++) {
        switch (i) {
            case 0:
                iTamano += 120;
                break;
            case (aCabeceras.length):
                iTamano += 60;
                break;
        }

        if (i > 1 && i < (aCabeceras.length - 1)) {
            iTamano += 60;
        }
        //xWidth = (iTamano * 2) + "px";
        xWidth = (iTamano + 400) + "px";
    }
    //}

    //html += "<table id='tblControlAsistencia' class='footable table table-stripped table-bordered footable-loaded' cellspacing='0' style='height:600px; display: block;overflow: scroll;'>";
    html += "<table id='tblControlAsistencia' class='table-stripped table-bordered footable-loaded' width='" + (xWidth) + "' cellspacing='0'>";
    html += "<thead>";
    html += "<tr>";
    for (var i = 0; i < aCabeceras.length; i++) {
        html += "<th ";
        if (i == 0) {
            html += "  rowspan='2' class='text-center col-200 sticky-col left-col'";
        }
        if (i > 0 && i < (aCabeceras.length - 1)) {
            //html += "  colspan='2' class='text-center col-100'>";
            html += "  colspan='2' class='text-center'>";
        } else if (i == (aCabeceras.length - 1)) {
            html += "  rowspan='2' class='text-center col-80'>";
        } else {
            html += " class='text-center'>";
        }
        html += aCabeceras[i];
        html += "</th>";
    }
    html += "</tr>";
    html += "<tr>";
    //html += "<th class='text-center col-200'></th>";
    for (var i = 1; i < aCabeceras.length - 1; i++) {
        html += "<th class='text-center col-60'>Ingreso</th>";
        html += "<th class='text-center col-60'>Salida</th>";
    }
    //html += "<th class='text-center col-20'></th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody class='tbodyNegri'>";
    if (aPadres.length != 0) {
        if (aTipo == 1) {
            for (var p = 0; p < aPadres.length; p++) {
                html += "<tr>";
                html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aPadres[p].NombreArea + "</th>";
                for (var i = 1; i < aCabeceras.length - 1; i++) {
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                }
                html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                html += "</tr>";
                for (var n = 0; n < aPadres[p].aData.length; n++) {
                    html += "<tr>";
                    if (aPadres[p].aData[n].lUsuarioAsistencia == "1") {
                        html += "<td class='col-200 sticky-col left-col'>";
                    } else {
                        html += "<td class='col-200 color-Asistencia'>";
                    }
                    html += aPadres[p].aData[n].NombreCompleto;
                    html += "</td>";
                    iRegistrosTardanzas = 0;
                    for (var l = 1; l < (aCabeceras.length - 1); l++) {
                        iRegistrosHoras = 0;
                        for (var u = 0; u < aHorasPersonal.length; u++) {
                            if (aHorasPersonal[u].IdUsuarioMarcador == aPadres[p].aData[n].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aPadres[p].aData[n].lUsuarioAsistencia == "1") {
                                html += "<td  class='text-center col-60'  ";
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Entrada;
                                //html += aHorasPersonal[u].Entrada.split(".")[0];
                                html += "</td>";
                                html += "<td class='text-center col-60'  ";
                                if (aHorasPersonal[u].Salida > '18:40') {
                                    html += "style='color: red;' >";
                                    html += aHorasPersonal[u].Salida;
                                } else {
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Salida;
                                }
                                //html += aHorasPersonal[u].Salida.split(".")[0];
                                html += "</td>";
                                iRegistrosHoras++;

                                if (aHorasPersonal[u].Color == "red") {
                                    iRegistrosTardanzas++;
                                }
                                break;
                            }
                        }
                        /* Feriados */
                        if (iRegistrosHoras == 0) {
                            var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                            if (feriado.length > 0) {
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                            } else {
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                            }
                        }
                    }
                    html += "<td class='text-center col-20'>";
                    html += iRegistrosTardanzas;
                    html += "</td>";
                    html += "</tr>";
                }
            }
            for (var k = 0; k < aHijos.length; k++) {
                html += "<tr>";
                html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aHijos[k].NombreArea + "</th>";
                for (var i = 1; i < aCabeceras.length - 1; i++) {
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                }
                html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                html += "</tr>";

                for (var m = 0; m < aHijos[k].aData.length; m++) {
                    html += "<tr>";
                    if (aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                        html += "<td class='col-200 headcol sticky-col left-col'>";
                    } else {
                        html += "<td class='col-200 color-Asistencia'>";
                    }
                    html += aHijos[k].aData[m].NombreCompleto;
                    html += "</td>";
                    iRegistrosTardanzas = 0;
                    for (var l = 1; l < (aCabeceras.length - 1); l++) {
                        iRegistrosHoras = 0;
                        for (var u = 0; u < aHorasPersonal.length; u++) {
                            if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                html += "<td  class='text-center col-60'  ";
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Entrada.split(".")[0];
                                html += "</td>";
                                html += "<td class='text-center col-60'  ";
                                if (aHorasPersonal[u].Salida > '18:40') {
                                    html += "style='color: red;' >";
                                    html += aHorasPersonal[u].Salida;
                                } else {
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Salida;
                                }
                                //html += aHorasPersonal[u].Salida.split(".")[0];
                                html += "</td>";
                                iRegistrosHoras++;

                                if (aHorasPersonal[u].Color == "red") {
                                    iRegistrosTardanzas++;
                                }
                                break;
                            }
                        }
                        /* Feriados */
                        if (iRegistrosHoras == 0) {
                            var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                            if (feriado.length > 0) {
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                            } else {
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                            }
                        }
                    }
                    html += "<td class='text-center' >";
                    html += iRegistrosTardanzas;
                    html += "</td>";
                    html += "</tr>";
                }
            }
        }
        else {
            for (var p = 0; p < aPadres.length; p++) {
                html += "<tr>";
                html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aPadres[p].NombreArea + "</th>";
                for (var i = 1; i < aCabeceras.length - 1; i++) {
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                }
                html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                html += "</tr>";
                for (var n = 0; n < aPadres[p].aData.length; n++) {
                    html += "<tr>";
                    if (aPadres[p].aData[n].lUsuarioAsistencia == "1") {
                        html += "<td class='col-200 sticky-col left-col'>";
                    } else {
                        html += "<td class='col-200 color-Asistencia'>";
                    }
                    html += aPadres[p].aData[n].NombreCompleto;
                    html += "</td>";
                    iRegistrosTardanzas = 0;
                    for (var l = 1; l < (aCabeceras.length - 1); l++) {
                        iRegistrosHoras = 0;
                        for (var u = 0; u < aHorasPersonal.length; u++) {
                            if (aHorasPersonal[u].IdUsuarioMarcador == aPadres[p].aData[n].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aPadres[p].aData[n].lUsuarioAsistencia == "1") {
                                html += "<td  class='text-center col-60'  ";
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Entrada;
                                //html += aHorasPersonal[u].Entrada.split(".")[0];
                                html += "</td>";
                                html += "<td class='text-center col-60'  ";
                                if (aHorasPersonal[u].Salida > '18:40') {
                                    html += "style='color: red;' >";
                                    html += aHorasPersonal[u].Salida;
                                } else {
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Salida;
                                }
                                //html += aHorasPersonal[u].Salida.split(".")[0];
                                html += "</td>";
                                iRegistrosHoras++;

                                if (aHorasPersonal[u].Color == "red") {
                                    iRegistrosTardanzas++;
                                }
                                break;
                            }
                        }
                        /* Feriados */
                        if (iRegistrosHoras == 0) {
                            var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                            if (feriado.length > 0) {
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                                html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                            } else {
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                                html += "<td  class='text-center col-60' >";
                                html += "</td>";
                            }
                        }
                    }
                    html += "<td class='text-center'>";
                    html += iRegistrosTardanzas;
                    html += "</td>";
                    html += "</tr>";
                }

                for (var k = 0; k < aHijos.length; k++) {
                    if (aPadres[p].IdArea == aHijos[k].IdPadre) {
                        html += "<tr>";
                        //html += "<th class='col-200 headcol'></th>";
                        //html += "<th colspan='" + ((aCabeceras.length * 2) - 3) + "' class='color-Area'>";
                        //html += aHijos[k].NombreArea;
                        //html += "</th>";
                        html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aHijos[k].NombreArea + "</th>";
                        for (var i = 1; i < aCabeceras.length - 1; i++) {
                            html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                            html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                        }
                        html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                        html += "</tr>";

                        for (var m = 0; m < aHijos[k].aData.length; m++) {
                            html += "<tr>";
                            if (aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                html += "<td class='col-200 headcol sticky-col left-col'>";
                            } else {
                                html += "<td class='col-200 color-Asistencia'>";
                            }
                            html += aHijos[k].aData[m].NombreCompleto;
                            html += "</td>";
                            iRegistrosTardanzas = 0;
                            for (var l = 1; l < (aCabeceras.length - 1); l++) {
                                iRegistrosHoras = 0;
                                for (var u = 0; u < aHorasPersonal.length; u++) {
                                    if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                        html += "<td  class='text-center col-60'  ";
                                        html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                        html += aHorasPersonal[u].Entrada.split(".")[0];
                                        html += "</td>";
                                        html += "<td class='text-center col-60'  ";
                                        if (aHorasPersonal[u].Salida > '18:40') {
                                            html += "style='color: red;' >";
                                            html += aHorasPersonal[u].Salida;
                                        } else {
                                            html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                            html += aHorasPersonal[u].Salida;
                                        }
                                        //html += aHorasPersonal[u].Salida.split(".")[0];
                                        html += "</td>";
                                        iRegistrosHoras++;

                                        if (aHorasPersonal[u].Color == "red") {
                                            iRegistrosTardanzas++;
                                        }
                                        break;
                                    }
                                }
                                /* Feriados */
                                if (iRegistrosHoras == 0) {
                                    var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                                    if (feriado.length > 0) {
                                        html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                        html += "Feriado</td>";
                                        html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                        html += "Feriado</td>";
                                    } else {
                                        html += "<td  class='text-center col-60' >";
                                        html += "</td>";
                                        html += "<td  class='text-center col-60' >";
                                        html += "</td>";
                                    }
                                }
                            }
                            html += "<td class='text-center' >";
                            html += iRegistrosTardanzas;
                            html += "</td>";
                            html += "</tr>";
                        }
                    }
                }
            }
            // FIX SOLO PARA TIC - JACOB
            for (var k = 0; k < aHijos.length; k++) {
                if (aHijos[k].IdPadre == '13') {
                    html += "<tr>";
                    //html += "<th class='col-200 headcol'></th>";
                    //html += "<th colspan='" + ((aCabeceras.length * 2) - 3) + "' class='color-Area'>";
                    //html += aHijos[k].NombreArea;
                    //html += "</th>";
                    html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aHijos[k].NombreArea + "</th>";
                    for (var i = 1; i < aCabeceras.length - 1; i++) {
                        html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                        html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                    }
                    html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                    html += "</tr>";

                    for (var m = 0; m < aHijos[k].aData.length; m++) {
                        html += "<tr>";
                        if (aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                            html += "<td class='col-200 headcol sticky-col left-col'>";
                        } else {
                            html += "<td class='col-200 color-Asistencia'>";
                        }
                        html += aHijos[k].aData[m].NombreCompleto;
                        html += "</td>";
                        iRegistrosTardanzas = 0;
                        for (var l = 1; l < (aCabeceras.length - 1); l++) {
                            iRegistrosHoras = 0;
                            for (var u = 0; u < aHorasPersonal.length; u++) {
                                if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                    html += "<td  class='text-center col-60'  ";
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Entrada.split(".")[0];
                                    html += "</td>";
                                    html += "<td class='text-center col-60'  ";
                                    if (aHorasPersonal[u].Salida > '18:40') {
                                        html += "style='color: red;' >";
                                        html += aHorasPersonal[u].Salida;
                                    } else {
                                        html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                        html += aHorasPersonal[u].Salida;
                                    }
                                    //html += aHorasPersonal[u].Salida.split(".")[0];
                                    html += "</td>";
                                    iRegistrosHoras++;

                                    if (aHorasPersonal[u].Color == "red") {
                                        iRegistrosTardanzas++;
                                    }
                                    break;
                                }
                            }
                            /* Feriados */
                            if (iRegistrosHoras == 0) {
                                var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                                if (feriado.length > 0) {
                                    html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                    html += "Feriado</td>";
                                    html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                                    html += "Feriado</td>";
                                } else {
                                    html += "<td  class='text-center col-60' >";
                                    html += "</td>";
                                    html += "<td  class='text-center col-60' >";
                                    html += "</td>";
                                }
                            }
                        }
                        html += "<td class='text-center' >";
                        html += iRegistrosTardanzas;
                        html += "</td>";
                        html += "</tr>";
                    }
                }
            }
        }
    } else {
        for (var k = 0; k < aHijos.length; k++) {
            //if (aPadres[p].IdArea == aHijos[k].IdPadre) {
            html += "<th class='col-200 headcol color-Area center-vertical sticky-col left-col'>" + aHijos[k].NombreArea + "</th>";
            for (var i = 1; i < aCabeceras.length - 1; i++) {
                html += "<th class='text-center col-60 color-Area center-vertical'></th>";
                html += "<th class='text-center col-60 color-Area center-vertical'></th>";
            }
            html += "<th class='text-center col-60 color-Area center-vertical'></th>";
            html += "</tr>";
            for (var m = 0; m < aHijos[k].aData.length; m++) {
                html += "<tr>";
                if (aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                    html += "<td class='col-200 headcol sticky-col left-col'>";
                } else {
                    html += "<td class='col-200 color-Asistencia'>";
                }
                html += aHijos[k].aData[m].NombreCompleto;
                html += "</td>";
                iRegistrosTardanzas = 0;
                for (var l = 1; l < (aCabeceras.length - 1); l++) {
                    iRegistrosHoras = 0;
                    for (var u = 0; u < aHorasPersonal.length; u++) {
                        if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                            html += "<td  class='text-center col-60'  ";
                            html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                            html += aHorasPersonal[u].Entrada.split(".")[0];
                            html += "</td>";
                            html += "<td class='text-center col-60'  ";
                            if (aHorasPersonal[u].Salida > '18:40') {
                                html += "style='color: red;' >";
                                html += aHorasPersonal[u].Salida;
                            } else {
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Salida;
                            }
                            //html += aHorasPersonal[u].Salida.split(".")[0];
                            html += "</td>";
                            iRegistrosHoras++;

                            if (aHorasPersonal[u].Color == "red") {
                                iRegistrosTardanzas++;
                            }
                            break;
                        }
                    }

                    /* Feriados */
                    if (iRegistrosHoras == 0) {
                        var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                        if (feriado.length > 0) {
                            html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                            html += "Feriado</td>";
                            html += "<td  class='text-center col-60' style='background: #b8b8b8'>";
                            html += "Feriado</td>";
                        } else {
                            html += "<td  class='text-center col-60' >";
                            html += "</td>";
                            html += "<td  class='text-center col-60' >";
                            html += "</td>";
                        }
                    }
                }
                html += "<td class='text-center' style='overflow: hidden' >";
                html += iRegistrosTardanzas;
                html += "</td>";
                html += "</tr>";
            }
            // }            
        }
    }

    html += "</tbody>";
    html += "</table>";

    document.getElementById("divContent").innerHTML = html;
    //$("#divContent").css({ 'overflow': 'auto', 'max-height': '500px' });
    formatTable();
    //Fix para ultima columna jquery datatable
    //$(".DTFC_RightBodyLiner").css({
    //    'overflow-y': '',
    //    'width': ''
    //});
    //_promise(5).then(function () {
    //    document.getElementById("divContent").innerHTML = html;
    //}).then(function () {
    //    formatTable();
    //})
}

function formatTable() {
    if (aCabeceras.length > 8) {
        $('#tblControlAsistencia').DataTable({
            scrollY: "500px",
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            search: true,
            "bSort": false,
            "bInfo": false,
            fixedColumns: {
                leftColumns: 1,
                rightColumns: 1
            }
        });
    } else {
        $('#tblControlAsistencia').DataTable({
            scrollY: "500px",
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            search: true,
            "bSort": false,
            "bInfo": false
        });
    }
}

var excelExportar = "";
var tablaExportar = "";

var ListasExportar = function () {

    var contenidoExportar = "";
    var html = "", iPrimeraFila = 0, iRegistrosHoras = 0, iTardanzas = 0;
    var fechaReporte = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');

    var nRegistros = 1;
    var Total = 0;
    if (nRegistros > 0) {
        html += "<div>";
        html += "<table border='1'>";
        html += "<tr>";
        html += "<td colspan='" + ((aCabeceras.length * 2) - 2) + "' style='background: #A4A4A4; color: #FFFFFF;font-weight: bold;font-size:20px;'>REPORTE DE ASISTENCIA</td>";
        html += "</tr>";
        html += "<thead>";
        html += "<tr>";
        for (var i = 0; i < aCabeceras.length; i++) {
            html += "<th ";
            if (i == 0) {
                html += " rowspan='2' style='height:30px;background: #A4A4A4; color: #FFFFFF;'";
            }
            if (i > 0 && i < (aCabeceras.length - 1)) {
                html += " style='height:15px;background: #A4A4A4; color: #FFFFFF;' colspan='2'>";
            } else if (i == (aCabeceras.length - 1)) {
                html += " rowspan='2' style='height:30px;background: #A4A4A4; color: #FFFFFF;'>";
            } else {
                html += " >";
            }
            html += aCabeceras[i];
            html += "</th>";
        }
        html += "</tr>";
        html += "<tr>";
        for (var i = 0; i < aCabeceras.length; i++) {
            if (i > 0 && i < (aCabeceras.length - 1)) {
                html += "<th style='height:15px;background: #A4A4A4; color: #FFFFFF;' >Ingreso</th>";
                html += "<th style='height:15px;background: #A4A4A4; color: #FFFFFF;' >Salida</th>";
            }
        }
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        if (aPadres.length != 0) {
            for (var p = 0; p < aPadres.length; p++) {
                html += "<tr>";
                html += "<th colspan='" + ((aCabeceras.length * 2) - 2) + "' style='background: #f5f5f5;'>";
                html += aPadres[p].NombreArea;
                html += "</th>";
                html += "</tr>";
                for (var n = 0; n < aPadres[p].aData.length; n++) {
                    html += "<tr>";
                    if (aPadres[p].aData[n].lUsuarioAsistencia == "0") {
                        html += "<td style='background-color: #afe8dd;'>";
                    } else {
                        html += "<td>";
                    }
                    html += aPadres[p].aData[n].NombreCompleto;
                    html += "</td>";
                    iRegistrosTardanzas = 0;
                    for (var l = 1; l < (aCabeceras.length - 1); l++) {
                        iRegistrosHoras = 0;
                        for (var u = 0; u < aHorasPersonal.length; u++) {
                            if (aHorasPersonal[u].IdUsuarioMarcador == aPadres[p].aData[n].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aPadres[p].aData[n].lUsuarioAsistencia == "1") {
                                html += "<td ";
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Entrada.split(".")[0];
                                html += "</td>";
                                html += "<td ";
                                if (aHorasPersonal[u].Salida > '18:40') {
                                    html += "style='color: red;' >";
                                    html += aHorasPersonal[u].Salida;
                                } else {
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Salida;
                                }
                                //html += aHorasPersonal[u].Salida.split(".")[0];
                                html += "</td>";
                                iRegistrosHoras++;

                                if (aHorasPersonal[u].Color == "red") {
                                    iRegistrosTardanzas++;
                                }
                                break;
                            }
                        }
                        /*Feriados*/
                        if (iRegistrosHoras == 0) {
                            var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                            if (feriado.length > 0) {
                                html += "<td style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                                html += "<td style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                            } else {
                                html += "<td>";
                                html += "</td>";
                                html += "<td>";
                                html += "</td>";
                            }
                        }
                    }
                    html += "<td>";
                    html += iRegistrosTardanzas;
                    html += "</td>";
                    html += "</tr>";
                }

                for (var k = 0; k < aHijos.length; k++) {
                    if (aPadres[p].IdArea == aHijos[k].IdPadre) {
                        html += "<tr>";
                        html += "<th colspan='" + ((aCabeceras.length * 2) - 2) + "' style='background: #f5f5f5;'>";
                        html += aHijos[k].NombreArea;
                        html += "</th>";
                        html += "</tr>";
                        for (var m = 0; m < aHijos[k].aData.length; m++) {
                            html += "<tr>";
                            if (aHijos[k].aData[m].lUsuarioAsistencia == "0") {
                                html += "<td style='background-color: #afe8dd;'>";
                            } else {
                                html += "<td>";
                            }
                            html += aHijos[k].aData[m].NombreCompleto;
                            html += "</td>";
                            iRegistrosTardanzas = 0;
                            for (var l = 1; l < (aCabeceras.length - 1); l++) {
                                iRegistrosHoras = 0;
                                for (var u = 0; u < aHorasPersonal.length; u++) {
                                    if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                        html += "<td   ";
                                        html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                        html += aHorasPersonal[u].Entrada.split(".")[0];
                                        html += "</td>";
                                        html += "<td ";
                                        if (aHorasPersonal[u].Salida > '18:40') {
                                            html += "style='color: red;' >";
                                            html += aHorasPersonal[u].Salida;
                                        } else {
                                            html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                            html += aHorasPersonal[u].Salida;
                                        }
                                        //html += aHorasPersonal[u].Salida.split(".")[0];
                                        html += "</td>";
                                        iRegistrosHoras++;

                                        if (aHorasPersonal[u].Color == "red") {
                                            iRegistrosTardanzas++;
                                        }
                                        break;
                                    }
                                }
                                /*Feriados*/
                                if (iRegistrosHoras == 0) {
                                    var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                                    if (feriado.length > 0) {
                                        html += "<td style='background: #b8b8b8'>";
                                        html += "Feriado</td>";
                                        html += "<td style='background: #b8b8b8'>";
                                        html += "Feriado</td>";
                                    } else {
                                        html += "<td>";
                                        html += "</td>";
                                        html += "<td>";
                                        html += "</td>";
                                    }
                                }
                            }
                            html += "<td>";
                            html += iRegistrosTardanzas;
                            html += "</td>";
                            html += "</tr>";
                        }
                    }
                }
            }

            //FIX SOLO PARA TIC
            for (var k = 0; k < aHijos.length; k++) {
                if (aHijos[k].IdPadre == '13') {
                    html += "<tr>";
                    html += "<th colspan='" + ((aCabeceras.length * 2) - 2) + "' style='background: #f5f5f5;'>";
                    html += aHijos[k].NombreArea;
                    html += "</th>";
                    html += "</tr>";
                    for (var m = 0; m < aHijos[k].aData.length; m++) {
                        html += "<tr>";
                        if (aHijos[k].aData[m].lUsuarioAsistencia == "0") {
                            html += "<td style='background-color: #afe8dd;'>";
                        } else {
                            html += "<td>";
                        }
                        html += aHijos[k].aData[m].NombreCompleto;
                        html += "</td>";
                        iRegistrosTardanzas = 0;
                        for (var l = 1; l < (aCabeceras.length - 1); l++) {
                            iRegistrosHoras = 0;
                            for (var u = 0; u < aHorasPersonal.length; u++) {
                                if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                    html += "<td   ";
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Entrada.split(".")[0];
                                    html += "</td>";
                                    html += "<td ";
                                    if (aHorasPersonal[u].Salida > '18:40') {
                                        html += "style='color: red;' >";
                                        html += aHorasPersonal[u].Salida;
                                    } else {
                                        html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                        html += aHorasPersonal[u].Salida;
                                    }
                                    //html += aHorasPersonal[u].Salida.split(".")[0];
                                    html += "</td>";
                                    iRegistrosHoras++;

                                    if (aHorasPersonal[u].Color == "red") {
                                        iRegistrosTardanzas++;
                                    }
                                    break;
                                }
                            }
                            /*Feriados*/
                            if (iRegistrosHoras == 0) {
                                var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                                if (feriado.length > 0) {
                                    html += "<td style='background: #b8b8b8'>";
                                    html += "Feriado</td>";
                                    html += "<td style='background: #b8b8b8'>";
                                    html += "Feriado</td>";
                                } else {
                                    html += "<td>";
                                    html += "</td>";
                                    html += "<td>";
                                    html += "</td>";
                                }
                            }
                        }
                        html += "<td>";
                        html += iRegistrosTardanzas;
                        html += "</td>";
                        html += "</tr>";
                    }
                }
            }
        } else {
            for (var k = 0; k < aHijos.length; k++) {
                //if (aPadres[p].IdArea == aHijos[k].IdPadre) {
                html += "<tr>";
                html += "<th colspan='" + ((aCabeceras.length * 2) - 2) + "' style='background: #f5f5f5;'>";
                html += aHijos[k].NombreArea;
                html += "</th>";
                html += "</tr>";
                for (var m = 0; m < aHijos[k].aData.length; m++) {
                    html += "<tr>";
                    if (aHijos[k].aData[m].lUsuarioAsistencia == "0") {
                        html += "<td style='background-color: #afe8dd;'>";
                    } else {
                        html += "<td>";
                    }
                    html += aHijos[k].aData[m].NombreCompleto;
                    html += "</td>";
                    iRegistrosTardanzas = 0;
                    for (var l = 1; l < (aCabeceras.length - 1); l++) {
                        iRegistrosHoras = 0;
                        for (var u = 0; u < aHorasPersonal.length; u++) {
                            if (aHorasPersonal[u].IdUsuarioMarcador == aHijos[k].aData[m].IdUsuarioMarcador && aHorasPersonal[u].Fecha == aCabeceras[l] && aHijos[k].aData[m].lUsuarioAsistencia == "1") {
                                html += "<td   ";
                                html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                html += aHorasPersonal[u].Entrada.split(".")[0];
                                html += "</td>";
                                html += "<td ";
                                if (aHorasPersonal[u].Salida > '18:40') {
                                    html += "style='color: red;' >";
                                    html += aHorasPersonal[u].Salida;
                                } else {
                                    html += aHorasPersonal[u].Color == "red" ? "style='color: red;' >" : "' >";
                                    html += aHorasPersonal[u].Salida;
                                }
                                //html += aHorasPersonal[u].Salida.split(".")[0];
                                html += "</td>";
                                iRegistrosHoras++;

                                if (aHorasPersonal[u].Color == "red") {
                                    iRegistrosTardanzas++;
                                }
                                break;
                            }
                        }
                        /*Feriados*/
                        if (iRegistrosHoras == 0) {
                            var feriado = aFeriados.filter(s => s.includes(aCabeceras[l]));
                            if (feriado.length > 0) {
                                html += "<td style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                                html += "<td style='background: #b8b8b8'>";
                                html += "Feriado</td>";
                            } else {
                                html += "<td>";
                                html += "</td>";
                                html += "<td>";
                                html += "</td>";
                            }
                        }
                    }
                    html += "<td>";
                    html += iRegistrosTardanzas;
                    html += "</td>";
                    html += "</tr>";
                }
            }
            //}
        }
        html += "</tbody>";
        html += "</table>";

        html += "</div>";


        excelExportar = "<html><head><meta charset='utf-8'/></head>";
        tablaExportar = html + "</html>";
        excelExportar += tablaExportar;
    }
}

function ExportarXl(href) {
    var nRegistros = 1;
    if (nRegistros > 0) {
        ListasExportar();
        var d = new Date();
        var fecha = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        var blob = new Blob([excelExportar], { type: 'application/vnd.ms-excel' });
        if (navigator.appVersion.toString().indexOf('.NET') > 0)
            window.navigator.msSaveBlob(blob, "Asistencia" + fecha + ".xls");
        else {
            var a = document.createElement('a');
            a.setAttribute("href", window.URL.createObjectURL(blob));
            a.setAttribute("download", "Asistencia" + fecha + ".xls");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        sweetAlert({ title: "Atención", text: "No se encontraron resultados.", html: true, type: "warning" });
    }
}

function ConvertirFecha(Fecha) {
    var Fecha1 = Fecha.replace(" ", "-");
    //console.log(Fecha1);
    var date = (Fecha1.replace(", ", "-")).split("-");
    //console.log(date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var formattedDate = "";
    for (var j = 0; j < months.length; j++) {
        if (date[1] == months[j]) {
            date[1] = months.indexOf(months[j]) + 1;
        }
    }
    if (date[1] < 10) { date[1] = '0' + date[1]; }
    return formattedDate = date[1] + "/" + date[0] + "/" + date[2];
}


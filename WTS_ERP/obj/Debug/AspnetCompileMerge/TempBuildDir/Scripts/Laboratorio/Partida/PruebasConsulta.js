
Ini();

function Ini() {

    $("#btnSave").click(function () {
        Save();
    });

    $("#btnReturn").click(function () {
        let url = 'Laboratorio/Partida/ConsultaPartidas';
        _Go_Url(url, url, "");
    });

    var par = parseInt($("#txtpar").val());

    if (par > 0) {

        $("#spnPageStatus").text("");
        $("#spnPageStatus").text("Editing");

        $("#txtFabrica").show();
        $("#txtCliente").show();

        var urlaccion = 'Laboratorio/Partida/GetTest?par=' + par;
        Get(urlaccion, LoadTestPartida);

    } else {
        $("#cboFabrica").show();
        $("#cboCliente").show();
        LoadInitialData();
    }

}

function ShowEstabilidadDimensionalMetodos() {
    $("#mdEstabilidadMetodos").modal("show");
}

function ShowSolidezLavadoMetodos() {
    $("#mdSolidezLavadoMetodos").modal("show");
}

function Load() {
    //var par = _('txtpar').value;
    //var objPar = JSON.parse(par);
    GetLoadData();
}

function GetLoadData() {
    var urlaccion = 'PO/POSample/GetLoadData';
    Get(urlaccion, LoadData);
}

function LoadData(data) {

    if (data != "") {
        var Data = JSON.parse(data)[0];

        if (Data.Client != "") {
            var Client = JSON.parse(Data.Client);
            var selectClient = "<option value='0'>Select one</option>" + _comboFromJSON(Client, "IdCliente", "NombreCliente");
            $("#cboClient").append(selectClient);
        }
        if (Data.Supplier != "") {
            var Supplier = JSON.parse(Data.Supplier);
            var selectProveedor = "<option value='0'>Select one</option>" + _comboFromJSON(Supplier, "IdProveedor", "NombreProveedor");
            $("#cboSupplier").append(selectProveedor);
        }
    }
}

function CalcularSeamResultado(flg) {
    var resultado = 0;

    if (flg == "Before") {
        var AA = parseFloat($("#txtAABefore").val());
        var AB = parseFloat($("#txtABBefore").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtSeamResultadoBefore").val(resultado.toFixed(1));
        } else {
            $("#txtSeamResultadoBefore").val("0");
        }
    } else {
        var AA = parseFloat($("#txtAAAfter").val());
        var AB = parseFloat($("#txtABAfter").val());

        resultado = (AA / AB) * 100;

        if (!isNaN(resultado)) {
            $("#txtSeamResultadoAfter").val(resultado.toFixed(1)); 
        } else {
            $("#txtSeamResultadoAfter").val("0");
        }
    }

    var txtSeamResultadoBefore = parseFloat($("#txtSeamResultadoBefore").val());
    var txtSeamResultadoAfter = parseFloat($("#txtSeamResultadoAfter").val());

    if (!isNaN(txtSeamResultadoBefore) && !isNaN(txtSeamResultadoAfter)) {
        resultado = txtSeamResultadoAfter - txtSeamResultadoBefore;
        $("#txtSeamChange").val(resultado.toFixed(1));
    }
   


}

function CalcularDesviacion() {


    var GramajeAcabado = $("#hdGramajeAcabado").val() == "" ? 0 : parseFloat($("#hdGramajeAcabado").val());
    var Densidad = $("#txtDensidad").val();

    if (Densidad != "") {
        Densidad = parseFloat(Densidad);
        var Desviacion = (((Densidad - GramajeAcabado) / GramajeAcabado) * 100).toFixed(1);

        if (!isNaN(Desviacion)) {
            $("#txtDesviacion").val(Desviacion);
        }

    } else {
        $("#txtDesviacion").val("");
    }

}

/* Luis */

function CalcularEncogimientoAncho(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {
            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoAncho = 0;
        var lavadofiltro = "";
        if (Resultados.some(x => x.Lavado === "5")) { lavadofiltro = "5"; }
        else if (Resultados.some(x => x.Lavado === "3")) { lavadofiltro = "3"; }
        else { lavadofiltro = "1"; }

        let filtro = Resultados.filter(x=>x.Lavado === lavadofiltro);
        let contador = 0, suma = 0;

        filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });
        EncogimientoAncho = suma / contador;

        if (!isNaN(EncogimientoAncho)) {
            _(target).value = EncogimientoAncho.toFixed(1);
        }

    } else { _(target).value = 0; }
}

function CalcularEncogimientoLargo(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {
            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoLargo = 0;
        if (Resultados.some(x => x.Lavado === "5")) { lavadofiltro = "5"; }
        else if (Resultados.some(x => x.Lavado === "3")) { lavadofiltro = "3"; }
        else { lavadofiltro = "1"; }

        let filtro = Resultados.filter(x => x.Lavado === lavadofiltro);
        let contador = 0, suma = 0;
        filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });
        EncogimientoLargo = suma / contador;

        if (!isNaN(EncogimientoLargo)) {
            _(target).value = EncogimientoLargo.toFixed(1);
        }

    } else { _(target).value = 0; }
}

function CalcularRevirado(contenedor, clase) {

    var Resultados = new Array();
    $("." + clase).each(function () {
        var Valor = $(this).val();
        var Muestra = $(this).attr("data-muestra");
        var Lavado = $(this).attr("data-lavado");
        var Campo = $(this).attr("data-par");

        if (Valor == "") { Valor = 0; }
        //if (Valor != 0) {
        var obj = {
            Lavado: Lavado,
            Campo: Campo,
            Valor: Valor,
            Muestra: Muestra
        }
        Resultados.push(obj);
        //}
    });

    if (Resultados.length > 0) {

        let Revirado = 0, lavadofiltro = '';

        if (Resultados.some(x => x.Lavado === '5' && x.Valor > 0)) { lavadofiltro = '5'; }
        else if (Resultados.some(x => x.Lavado === '3' && x.Valor > 0)) { lavadofiltro = '3'; }
        else { lavadofiltro = '1'; }

        let filtrobusqueda = Resultados.filter(x => x.Lavado === lavadofiltro);

        // Muestra A
        let AC_MA = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'AC' && x.Muestra === 'A')[0].Valor);
        let BD_MA = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'BD' && x.Muestra === 'A')[0].Valor);
        let R1_MA = AC_MA - BD_MA, R2_MA = AC_MA + BD_MA, R3_MA = 0;

        if (R2_MA > 0) { R3_MA = (R1_MA / R2_MA) * 200; }

        // Muestra B
        let AC_MB = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'AC' && x.Muestra === 'B')[0].Valor);
        let BD_MB = parseFloat(filtrobusqueda.filter(x=> x.Campo === 'BD' && x.Muestra === 'B')[0].Valor);
        let R1_MB = AC_MB - BD_MB, R2_MB = AC_MB + BD_MB, R3_MB = 0;

        if (R2_MB > 0) { R3_MB = (R1_MB / R2_MB) * 200; }

        if (R3_MA < 0 && R3_MB > 0) { Revirado = R3_MA.toFixed(1) + '/' + R3_MB.toFixed(1); }
        else if (R3_MA > 0 && R3_MB < 0) { Revirado = R3_MA.toFixed(1) + '/' + R3_MB.toFixed(1); }
        else { Revirado = (R3_MA + R3_MB) / 2; }

        if (!isNaN(Revirado)) { _(contenedor).value = Revirado.toFixed(1); }
        else { _(contenedor).value = Revirado; }

    } else {
        _(contenedor).value = 0;
    }
}

function Save() {

    var objPartida = {
        CodigoPartida: $("#hfCodigoPartida").val(),
        StatusPartida: $("#cboPartidaStatus").val(),
        ComentarioColor: $("#txtComentarioColor").val(),
        ComentarioTesting: $("#txtComentarioTesting").val(),
        InstruccionCuidado: $("#txtInstruccionesCuidado").val(),

        /* Estabilidad Dimensional - Tela - Luis */

        MuestraA_Ancho_1erLav_1: $("#txtMuestraA_Ancho_1erLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_1erLav_1").val(),
        MuestraA_Ancho_3erLav_1: $("#txtMuestraA_Ancho_3erLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_3erLav_1").val(),
        MuestraA_Ancho_5toLav_1: $("#txtMuestraA_Ancho_5toLav_1").val() == '' ? 0 : $("#txtMuestraA_Ancho_5toLav_1").val(),
        MuestraA_Largo_1erLav_1: $("#txtMuestraA_Largo_1erLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_1erLav_1").val(),
        MuestraA_Largo_3erLav_1: $("#txtMuestraA_Largo_3erLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_3erLav_1").val(),
        MuestraA_Largo_5toLav_1: $("#txtMuestraA_Largo_5toLav_1").val() == '' ? 0 : $("#txtMuestraA_Largo_5toLav_1").val(),
        MuestraB_Ancho_1erLav_1: $("#txtMuestraB_Ancho_1erLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_1erLav_1").val(),
        MuestraB_Ancho_3erLav_1: $("#txtMuestraB_Ancho_3erLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_3erLav_1").val(),
        MuestraB_Ancho_5toLav_1: $("#txtMuestraB_Ancho_5toLav_1").val() == '' ? 0 : $("#txtMuestraB_Ancho_5toLav_1").val(),
        MuestraB_Largo_1erLav_1: $("#txtMuestraB_Largo_1erLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_1erLav_1").val(),
        MuestraB_Largo_3erLav_1: $("#txtMuestraB_Largo_3erLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_3erLav_1").val(),
        MuestraB_Largo_5toLav_1: $("#txtMuestraB_Largo_5toLav_1").val() == '' ? 0 : $("#txtMuestraB_Largo_5toLav_1").val(),

        MuestraA_Ancho_1erLav_2: $("#txtMuestraA_Ancho_1erLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_1erLav_2").val(),
        MuestraA_Ancho_3erLav_2: $("#txtMuestraA_Ancho_3erLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_3erLav_2").val(),
        MuestraA_Ancho_5toLav_2: $("#txtMuestraA_Ancho_5toLav_2").val() == '' ? 0 : $("#txtMuestraA_Ancho_5toLav_2").val(),
        MuestraA_Largo_1erLav_2: $("#txtMuestraA_Largo_1erLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_1erLav_2").val(),
        MuestraA_Largo_3erLav_2: $("#txtMuestraA_Largo_3erLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_3erLav_2").val(),
        MuestraA_Largo_5toLav_2: $("#txtMuestraA_Largo_5toLav_2").val() == '' ? 0 : $("#txtMuestraA_Largo_5toLav_2").val(),
        MuestraB_Ancho_1erLav_2: $("#txtMuestraB_Ancho_1erLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_1erLav_2").val(),
        MuestraB_Ancho_3erLav_2: $("#txtMuestraB_Ancho_3erLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_3erLav_2").val(),
        MuestraB_Ancho_5toLav_2: $("#txtMuestraB_Ancho_5toLav_2").val() == '' ? 0 : $("#txtMuestraB_Ancho_5toLav_2").val(),
        MuestraB_Largo_1erLav_2: $("#txtMuestraB_Largo_1erLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_1erLav_2").val(),
        MuestraB_Largo_3erLav_2: $("#txtMuestraB_Largo_3erLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_3erLav_2").val(),
        MuestraB_Largo_5toLav_2: $("#txtMuestraB_Largo_5toLav_2").val() == '' ? 0 : $("#txtMuestraB_Largo_5toLav_2").val(),

        MuestraA_Ancho_1erLav_3: $("#txtMuestraA_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3").val(),
        MuestraA_Ancho_3erLav_3: $("#txtMuestraA_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3").val(),
        MuestraA_Ancho_5toLav_3: $("#txtMuestraA_Ancho_5toLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_5toLav_3").val(),
        MuestraA_Largo_1erLav_3: $("#txtMuestraA_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3").val(),
        MuestraA_Largo_3erLav_3: $("#txtMuestraA_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3").val(),
        MuestraA_Largo_5toLav_3: $("#txtMuestraA_Largo_5toLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_5toLav_3").val(),
        MuestraB_Ancho_1erLav_3: $("#txtMuestraB_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3").val(),
        MuestraB_Ancho_3erLav_3: $("#txtMuestraB_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3").val(),
        MuestraB_Ancho_5toLav_3: $("#txtMuestraB_Ancho_5toLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_5toLav_3").val(),
        MuestraB_Largo_1erLav_3: $("#txtMuestraB_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3").val(),
        MuestraB_Largo_3erLav_3: $("#txtMuestraB_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3").val(),
        MuestraB_Largo_5toLav_3: $("#txtMuestraB_Largo_5toLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_5toLav_3").val(),


        /* Revirado - Luis*/

        MuestraA_1erLav_AC: $("#txtMuestraA_1erLav_AC").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC").val(),
        MuestraA_1erLav_BD: $("#txtMuestraA_1erLav_BD").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD").val(),
        MuestraA_3erLav_AC: $("#txtMuestraA_3erLav_AC").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC").val(),
        MuestraA_3erLav_BD: $("#txtMuestraA_3erLav_BD").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD").val(),
        MuestraA_5toLav_AC: $("#txtMuestraA_5toLav_AC").val() == "" ? 0 : $("#txtMuestraA_5toLav_AC").val(),
        MuestraA_5toLav_BD: $("#txtMuestraA_5toLav_BD").val() == "" ? 0 : $("#txtMuestraA_5toLav_BD").val(),
        MuestraB_1erLav_AC: $("#txtMuestraB_1erLav_AC").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC").val(),
        MuestraB_1erLav_BD: $("#txtMuestraB_1erLav_BD").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD").val(),
        MuestraB_3erLav_AC: $("#txtMuestraB_3erLav_AC").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC").val(),
        MuestraB_3erLav_BD: $("#txtMuestraB_3erLav_BD").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD").val(),
        MuestraB_5toLav_AC: $("#txtMuestraB_5toLav_AC").val() == "" ? 0 : $("#txtMuestraB_5toLav_AC").val(),
        MuestraB_5toLav_BD: $("#txtMuestraB_5toLav_BD").val() == "" ? 0 : $("#txtMuestraB_5toLav_BD").val(),



        MuestraA_Ancho_1erLav_1_EP: $("#txtMuestraA_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_EP").val(),
        MuestraA_Ancho_3erLav_1_EP: $("#txtMuestraA_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_EP").val(),
        MuestraA_Ancho_1erLav_2_EP: $("#txtMuestraA_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_EP").val(),
        MuestraA_Ancho_3erLav_2_EP: $("#txtMuestraA_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_EP").val(),
        MuestraA_Ancho_1erLav_3_EP: $("#txtMuestraA_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_EP").val(),
        MuestraA_Ancho_3erLav_3_EP: $("#txtMuestraA_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_EP").val(),
        MuestraA_Largo_1erLav_1_EP: $("#txtMuestraA_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_EP").val(),
        MuestraA_Largo_3erLav_1_EP: $("#txtMuestraA_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_EP").val(),
        MuestraA_Largo_1erLav_2_EP: $("#txtMuestraA_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_EP").val(),
        MuestraA_Largo_3erLav_2_EP: $("#txtMuestraA_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_EP").val(),
        MuestraA_Largo_1erLav_3_EP: $("#txtMuestraA_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_EP").val(),
        MuestraA_Largo_3erLav_3_EP: $("#txtMuestraA_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_EP").val(),

        MuestraA_1erLav_AC_EP: $("#txtMuestraA_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_EP").val(),
        MuestraA_1erLav_BD_EP: $("#txtMuestraA_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_EP").val(),
        MuestraA_3erLav_AC_EP: $("#txtMuestraA_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_EP").val(),
        MuestraA_3erLav_BD_EP: $("#txtMuestraA_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_EP").val(),

        MuestraB_Ancho_1erLav_1_EP: $("#txtMuestraB_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_EP").val(),
        MuestraB_Ancho_3erLav_1_EP: $("#txtMuestraB_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_EP").val(),
        MuestraB_Ancho_1erLav_2_EP: $("#txtMuestraB_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_EP").val(),
        MuestraB_Ancho_3erLav_2_EP: $("#txtMuestraB_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_EP").val(),
        MuestraB_Ancho_1erLav_3_EP: $("#txtMuestraB_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_EP").val(),
        MuestraB_Ancho_3erLav_3_EP: $("#txtMuestraB_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_EP").val(),
        MuestraB_Largo_1erLav_1_EP: $("#txtMuestraB_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_EP").val(),
        MuestraB_Largo_3erLav_1_EP: $("#txtMuestraB_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_EP").val(),
        MuestraB_Largo_1erLav_2_EP: $("#txtMuestraB_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_EP").val(),
        MuestraB_Largo_3erLav_2_EP: $("#txtMuestraB_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_EP").val(),
        MuestraB_Largo_1erLav_3_EP: $("#txtMuestraB_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_EP").val(),
        MuestraB_Largo_3erLav_3_EP: $("#txtMuestraB_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_EP").val(),

        MuestraB_1erLav_AC_EP: $("#txtMuestraB_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_EP").val(),
        MuestraB_1erLav_BD_EP: $("#txtMuestraB_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_EP").val(),
        MuestraB_3erLav_AC_EP: $("#txtMuestraB_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_EP").val(),
        MuestraB_3erLav_BD_EP: $("#txtMuestraB_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_EP").val(),

        // HW 

        MuestraA_Ancho_1erLav_1_HW: $("#txtMuestraA_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_HW").val(),
        MuestraA_Ancho_3erLav_1_HW: $("#txtMuestraA_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_HW").val(),
        MuestraA_Ancho_1erLav_2_HW: $("#txtMuestraA_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_HW").val(),
        MuestraA_Ancho_3erLav_2_HW: $("#txtMuestraA_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_HW").val(),
        MuestraA_Ancho_1erLav_3_HW: $("#txtMuestraA_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_HW").val(),
        MuestraA_Ancho_3erLav_3_HW: $("#txtMuestraA_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_HW").val(),
        MuestraA_Largo_1erLav_1_HW: $("#txtMuestraA_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_HW").val(),
        MuestraA_Largo_3erLav_1_HW: $("#txtMuestraA_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_HW").val(),
        MuestraA_Largo_1erLav_2_HW: $("#txtMuestraA_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_HW").val(),
        MuestraA_Largo_3erLav_2_HW: $("#txtMuestraA_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_HW").val(),
        MuestraA_Largo_1erLav_3_HW: $("#txtMuestraA_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_HW").val(),
        MuestraA_Largo_3erLav_3_HW: $("#txtMuestraA_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_HW").val(),

        MuestraA_1erLav_AC_HW: $("#txtMuestraA_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_HW").val(),
        MuestraA_1erLav_BD_HW: $("#txtMuestraA_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_HW").val(),
        MuestraA_3erLav_AC_HW: $("#txtMuestraA_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_HW").val(),
        MuestraA_3erLav_BD_HW: $("#txtMuestraA_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_HW").val(),

        MuestraB_Ancho_1erLav_1_HW: $("#txtMuestraB_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_HW").val(),
        MuestraB_Ancho_3erLav_1_HW: $("#txtMuestraB_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_HW").val(),
        MuestraB_Ancho_1erLav_2_HW: $("#txtMuestraB_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_HW").val(),
        MuestraB_Ancho_3erLav_2_HW: $("#txtMuestraB_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_HW").val(),
        MuestraB_Ancho_1erLav_3_HW: $("#txtMuestraB_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_HW").val(),
        MuestraB_Ancho_3erLav_3_HW: $("#txtMuestraB_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_HW").val(),
        MuestraB_Largo_1erLav_1_HW: $("#txtMuestraB_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_HW").val(),
        MuestraB_Largo_3erLav_1_HW: $("#txtMuestraB_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_HW").val(),
        MuestraB_Largo_1erLav_2_HW: $("#txtMuestraB_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_HW").val(),
        MuestraB_Largo_3erLav_2_HW: $("#txtMuestraB_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_HW").val(),
        MuestraB_Largo_1erLav_3_HW: $("#txtMuestraB_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_HW").val(),
        MuestraB_Largo_3erLav_3_HW: $("#txtMuestraB_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_HW").val(),

        MuestraB_1erLav_AC_HW: $("#txtMuestraB_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_HW").val(),
        MuestraB_1erLav_BD_HW: $("#txtMuestraB_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_HW").val(),
        MuestraB_3erLav_AC_HW: $("#txtMuestraB_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_HW").val(),
        MuestraB_3erLav_BD_HW: $("#txtMuestraB_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_HW").val(),


        /* Estabilidad Dimensional - Prenda - Luis */

        AcrossChestOriginal: $("#txtAcrossChestOriginal").val(),
        AcrossChestOneCyle: $("#txtAcrossChestOneCyle").val(),
        AcrossChestOneCycleChange: $("#txtAcrossChestOneCyleChange").val(),
        AcrossChestThreeCyles: $("#txtAcrossChestThreeCyles").val(),
        AcrossChestThreeCycleChange: $("#txtAcrossChestThreeCylesChange").val(),
        AcrossChestFiveCycle: $("#txtAcrossChestFiveCycle").val(),
        AcrossChestFiveCycleChange: $("#txtAcrossChestFiveCycleChange").val(),

        BottomWidthOriginal: $("#txtBottomWidthOriginal").val(),
        BottomWidthOneCyle: $("#txtBottomWidthOneCyle").val(),
        BottomWidthtOneCycleChange: $("#txtBottomWidthOneCyleChange").val(),
        BottomWidthThreeCyles: $("#txtBottomWidthThreeCyles").val(),
        BottomWidthThreeCycleChange: $("#txtBottomWidthThreeCylesChange").val(),
        BottomWidthFiveCycle: $("#txtBottomWidthFiveCycle").val(),
        BottomWidthtFiveCycleChange: $("#txtBottomWidthFiveCycleChange").val(),

        BodyFromLenOriginal: $("#txtBodyFromLenOriginal").val(),
        BodyFromLeOneCyle: $("#txtBodyFromLeOneCyle").val(),
        BodyFromLenOneCycleChange: $("#txtBodyFromLeOneCyleChange").val(),
        BodyFromLeThreeCyles: $("#txtBodyFromLeThreeCyles").val(),
        BodyFromLenThreeCycleChange: $("#txtBodyFromLeThreeCylesChange").val(),
        BodyFromLeFiveCycle: $("#txtBodyFromLeFiveCycle").val(),
        BodyFromLenFiveCycleChange: $("#txtBodyFromLeFiveCycleChange").val(),

        SleeveLenOriginal: $("#txtSleeveLenOriginal").val(),
        SleeveLenOneCyle: $("#txtSleeveLenOneCyle").val(),
        SleeveLenOneCycleChange: $("#txtSleeveLenOneCyleChange").val(),
        SleeveLenThreeCyles: $("#txtSleeveLenThreeCyles").val(),
        SleeveLenThreeCycleChange: $("#txtSleeveLenThreeCylesChange").val(),
        SleeveLenFiveCycle: $("#txtSleeveLenFiveCycle").val(),
        SleeveLenFiveCycleChange: $("#txtSleeveLenFiveCycleChange").val(),

        WaistbandWidthHalfOriginal: $("#txtWaistbandWidthHalfOriginal").val(),
        WaistbandWidthHalfOneCyle: $("#txtWaistbandWidthHalfOneCyle").val(),
        WaistbandWidthHalfOneCycleChange: $("#txtWaistbandWidthHalfOneCyleChange").val(),
        WaistbandWidthHalfThreeCyles: $("#txtWaistbandWidthHalfThreeCyles").val(),
        WaistbandWidthHalfThreeCycleChange: $("#txtWaistbandWidthHalfThreeCylesChange").val(),
        WaistbandWidthHalfFiveCycle: $("#txtWaistbandWidthHalfFiveCycle").val(),
        WaistbandWidthHalfFiveCycleChange: $("#txtWaistbandWidthHalfFiveCycleChange").val(),

        LegOpeningHalfOriginal: $("#txtLegOpeningHalfOriginal").val(),
        LegOpeningHalfOneCyle: $("#txtLegOpeningHalfOneCyle").val(),
        LegOpeningHalfOneCycleChange: $("#txtLegOpeningHalfOneCyleChange").val(),
        LegOpeningHalfThreeCyles: $("#txtLegOpeningHalfThreeCyles").val(),
        LegOpeningHalfThreeCycleChange: $("#txtLegOpeningHalfThreeCylesChange").val(),
        LegOpeningHalfFiveCycle: $("#txtLegOpeningHalfFiveCycle").val(),
        LegOpeningHalfFiveCycleChange: $("#txtLegOpeningHalfFiveCycleChange").val(),

        OutseambelowOriginal: $("#txtOutseambelowOriginal").val(),
        OutseambelowOneCyle: $("#txtOutseambelowOneCyle").val(),
        OutseambelowOneCycleChange: $("#txtOutseambelowOneCyleChange").val(),
        OutseambelowThreeCyles: $("#txtOutseambelowThreeCyles").val(),
        OutseambelowThreeCycleChange: $("#txtOutseambelowThreeCylesChange").val(),
        OutseambelowFiveCycle: $("#txtOutseambelowFiveCycle").val(),
        OutseambelowFiveCycleChange: $("#txtOutseambelowFiveCycleChange").val(),

        InseamLenOriginal: $("#txtInseamLenOriginal").val(),
        InseamLenOneCyle: $("#txtInseamLenOneCyle").val(),
        InseamLenOneCycleChange: $("#txtInseamLenOneCyleChange").val(),
        InseamLenThreeCyles: $("#txtInseamLenThreeCyles").val(),
        InseamLenThreeCycleChange: $("#txtInseamLenThreeCylesChange").val(),
        InseamLenFiveCycle: $("#txtInseamLenFiveCycle").val(),
        InseamLenFiveCycleChange: $("#txtInseamLenFiveCycleChange").val(),





        EncogimientoLargo: $("#txtEncogimientoLargo").val(),
        EncogimientoAncho: $("#txtEncogimientoAncho").val(),
        Revirado: $("#txtRevirado").val(),
        Apariencia: $("#txtApariencia").val(),
        Pilling: $("#txtPilling").val(),
        EncogimientoStatus: $("#cboEncogimientoStatus").val(),
        ReviradoStatus: $("#cboReviradoStatus").val(),
        AparienciaStatus: $("#cboAparienciaStatus").val(),


        // EP 

        EncogimientoLargo_EP: $("#txtEncogimientoLargo_EP").val(),
        EncogimientoAncho_EP: $("#txtEncogimientoAncho_EP").val(),
        Revirado_EP: $("#txtRevirado_EP").val(),
        Apariencia_EP: $("#txtApariencia_EP").val(),
        Pilling_EP: $("#txtPilling_EP").val(),
        EncogimientoStatus_EP: $("#cboEncogimientoStatus_EP").val(),
        ReviradoStatus_EP: $("#cboReviradoStatus_EP").val(),

        EncogimientoLargo_HW: $("#txtEncogimientoLargo_HW").val(),
        EncogimientoAncho_HW: $("#txtEncogimientoAncho_HW").val(),
        Revirado_HW: $("#txtRevirado_HW").val(),
        Apariencia_HW: $("#txtApariencia_HW").val(),
        Pilling_HW: $("#txtPilling_HW").val(),
        EncogimientoStatus_HW: $("#cboEncogimientoStatus_HW").val(),
        ReviradoStatus_HW: $("#cboReviradoStatus_HW").val(),

        // FIN EP NUEVOS

        Densidad: $("#txtDensidad").val(),
        AnchoAcabado: $("#txtAnchoAcabado").val(),
        DensidadStatus: $("#cboDensidadStatus").val(),

        Seco: $("#txtSeco").val(),
        Humedo: $("#txtHumedo").val(),
        SolidezFroteStatus: $("#cboSolidezFroteStatus").val(),

        CambioColorSL: $("#txtCambioColorSL").val(),
        AcetatoSL: $("#txtAcetatoSL").val(),
        AlgodonSL: $("#txtAlgodonSL").val(),
        NylonSL: $("#txtNylonSL").val(),
        PoliesterSL: $("#txtPoliesterSL").val(),
        AcrilicoSL: $("#txtAcrilicoSL").val(),
        LanaSL: $("#txtLanaSL").val(),
        SilkSL: $("#txtSilkSL").val(),
        ViscosaSL: $("#txtViscosaSL").val(),
        EvaluacionAparienciaSL: $("#cboEvaluacionApariencia").val(),
        SolidezLavadoStatus: $("#cboSolidezLavadoStatus").val(),


        PillingResultado: $("#txtPillingResultado").val(),
        PillingMin: $("#txtPillingMin").val(),
        ResumenTestingPilling: $("#cboPillingStatus").val(),

        BurstingResultado: $("#txtBurstingResultado").val(),
        BurstingMin: $("#txtBurstingMin").val(),
        BurstingStatus: $("#cboBurstingStatus").val(),

        CambioColorST: $("#txtCambioColorST").val(),
        AcetatoST: $("#txtAcetatoST").val(),
        AlgodonST: $("#txtAlgodonST").val(),
        NylonST: $("#txtNylonST").val(),
        PoliesterST: $("#txtPoliesterST").val(),
        AcrilicoST: $("#txtAcrilicoST").val(),
        LanaST: $("#txtLanaST").val(),
        SilkST: $("#txtSilkST").val(),
        ViscosaST: $("#txtViscosaST").val(),
        SolidezTranspiracionStatus: $("#cboSolidezTranspiracionStatus").val(),

        CambioColorSA: $("#txtCambioColorSA").val(),
        AcetatoSA: $("#txtAcetatoSA").val(),
        AlgodonSA: $("#txtAlgodonSA").val(),
        NylonSA: $("#txtNylonSA").val(),
        PoliesterSA: $("#txtPoliesterSA").val(),
        AcrilicoSA: $("#txtAcrilicoSA").val(),
        LanaSA: $("#txtLanaSA").val(),
        SilkSA: $("#txtSilkSA").val(),
        ViscosaSA: $("#txtViscosaSA").val(),
        SolidezAguaStatus: $("#cboSolidezAguaStatus").val(),

        CambioColorBlanqueadorSinCloroSodiumPerborate: $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(),
        CambioColorBlanqueadorSinCloroHydrogenPeroxide: $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(),
        BlanqueadorSinClaroStatus: $("#cboBlanqueadorSinClaroStatus").val(),

        CambioColorBlanqueadorConCloro: $("#txtCambioColorBlanqueadorConCloro").val(),
        BlanqueadorConCloroStatus: $("#cboBlanqueadorConCloroStatus").val(),

        ResultadoPH: $("#txtResultadoPH").val(),
        RequeridoPH: $("#txtRequeridoPH").val(),
        PHStatus: $("#cboPHStatus").val(),

        WikingPulgadas: $("#txtWikingPulgadas").val(),
        WikingMinutes: $("#txtWikingMinutes").val(),
        WikingMin30Wales: $("#txtWikingMin30Wales").val(),
        WikingMin30Courses: $("#txtWikingMin30Courses").val(),
        WikingStatus: $("#cboWikingStatus").val(),

        // Almacenamiento

        CambioColorAlmacenamiento: $("#txtCambioColorAlmacenamiento").val(),
        AcetatoAlmacenamiento: $("#txtAcetatoAlmacenamiento").val(),
        AlgodonAlmacenamiento: $("#txtAlgodonAlmacenamiento").val(),
        NylonAlmacenamiento: $("#txtNylonAlmacenamiento").val(),
        SilkAlmacenamiento: $("#txtSilkAlmacenamiento").val(),
        PoliesterAlmacenamiento: $("#txtPoliesterAlmacenamiento").val(),
        AcrilicoAlmacenamiento: $("#txtAcrilicoAlmacenamiento").val(),
        LanaAlmacenamiento: $("#txtLanaAlmacenamiento").val(),
        ViscoseAlmacenamiento: $("#txtViscosaAlmacenamiento").val(),
        StainingWhiteCloth: $("#txtStainingWhiteCloth").val(),
        AlmacenamientoStatus: $("#cboAlmacenamientoStatus").val(),

        // Wicking Requerido

        //WickingRequerido: $("#txtWickingRequerido").val(),

        // Densidad y Ancho

        Muestra1Densidad: $("#txtMuestra1Densidad").val(),
        Muestra2Densidad: $("#txtMuestra2Densidad").val(),
        Muestra3Densidad: $("#txtMuestra3Densidad").val(),

        Muestra1Ancho: $("#txtMuestra1Ancho").val(),
        Muestra2Ancho: $("#txtMuestra2Ancho").val(),
        Muestra3Ancho: $("#txtMuestra3Ancho").val(),
        AprobadoComercial: $("#cboAprobadoComercial").val(),



        CicloLavadora: $("input:radio[name ='radCicloLavadora']:checked").val(),
        TemperaturaLavado: $("input:radio[name ='radTemperaturaLavado']:checked").val(),
        ProcedimientoSecado: $("input:radio[name ='radProcedimientoSecado']:checked").val(),
        ProcedimientoSecadoTipo: $("input:radio[name ='radProcedimientoSecadoA']:checked").val(),
        SolidezLavadoCondiciones: $("input:radio[name ='radSolidezLavadoMetodos']:checked").val(),

        SeamTwistAA: $("#txtAABefore").val(),
        SeamTwistAB: $("#txtABBefore").val(),
        SeamTwistResultado: $("#txtSeamResultadoBefore").val(),

        SeamTwistAAAfter: $("#txtAAAfter").val(),
        SeamTwistABAfter: $("#txtABAfter").val(),
        SeamTwistResultadoAfter: $("#txtSeamResultadoAfter").val(),

        SeamTwistChange: $("#txtSeamChange").val(),


        SeamTwistStatus: $("#cboSeamTwistStatus").val(),

        UOM: $("#cboUOM").val(),

        GradeSA: $("#txtGradoSA").val(),

        EncogimientoStatusGarment: $("#cboEncogimientoGarmentStatus").val(),

        StatusTono: $("#cboStatusTono").val()

    };

    var frm = new FormData();

    var JsonString = JSON.stringify(objPartida).replace(/undefined/g, '');


    var ReporteTecnico = $("#txtReporteTecnico").val();
    var NumeroPartida = $("#txtPartida").val();
    var IdClienteERP = $("#hfIdClienteERP").val();
    var IdProveedor = $("#hfIdProveedor").val();

    var NombreEstado = $("#cboPartidaStatus option:selected").attr('name');

    var Cliente = $("#txtCliente").val();
    var Fabrica = $("#txtFabrica").val();
    var Tipoprueba = $("#hfTipoPrueba").val();

    frm.append("par", JsonString);
    frm.append("status", objPartida.StatusPartida);
    frm.append("statustono", objPartida.StatusTono);
    frm.append("reportetecnico", ReporteTecnico);
    frm.append("partida", NumeroPartida);
    frm.append("idclienteerp", IdClienteERP);
    frm.append("idproveedor", IdProveedor);
    frm.append("idpartida", $("#hfCodigoPartida").val());
    frm.append("cliente", Cliente);
    frm.append("fabrica", Fabrica);
    frm.append("tipoprueba", Tipoprueba);



    Post('Laboratorio/Partida/SaveTest', frm, Alerta);
}

function LoadTestPartida(data) {

    if (data !== "") {

        var Data = JSON.parse(data)[0];
        if (Data.SolicitudPartida != "") {
            var Partida = JSON.parse(Data.SolicitudPartida)[0];

        //var Partida = JSON.parse(data)[0];

        //if (Partida != "") {

            $("#hfCodigoPartida").val(Partida.CodigoPartida);

            $("#txtReporteTecnico").val(Partida.ReporteTecnico);
            $("#txtPartida").val(Partida.NumeroPartida);
            $("#txtReporteTecnico").val(Partida.ReporteTecnico);
            $("#txtCodigoTela").val(Partida.CodigoTela);
            $("#txtFabrica").val(Partida.NombreFabrica);
            $("#txtTintoreria").val(Partida.NombreTintoreria);
            $("#txtCliente").val(Partida.NombreCliente);
            $("#txtColor").val(Partida.NombreColor);
            $("#hfTipoPrueba").val(Partida.TipoPrueba);
            $("#cboPartidaStatus").val(Partida.StatusPartida);

            // Comentarios
            $("#txtInstruccionCuidadoSolicitud").val(Partida.InstruccionCuidadoSolicitud);
            $("#txtComentarioColorExterno").val(Partida.ComentarioColorExterno);

            $("#txtComentarioColor").val(Partida.ComentarioColor);
            $("#txtComentarioTesting").val(Partida.ComentarioTesting);
            $("#txt_InstruccionesCuidado").val(Partida.InstruccionCuidado);

            //Estabilidad Dimensional 

            if (Partida.TipoPrueba == "f" || Partida.TipoPrueba == "p" || Partida.TipoPrueba == "d" || Partida.TipoPrueba == "m" || Partida.TipoPrueba == "pp" || Partida.TipoPrueba == "a") {
                $("#divEstabilidadDimensional").show();
                $("#divEstabilidadDimensionalGarment").hide();
            } else {
                $("#divEstabilidadDimensional").hide();
                $("#divEstabilidadDimensional_EP").hide();
                $("#divEstabilidadDimensional_HW").hide();

            }


            // Ocultando Pruebas segun Tipo de Prueba

            if (Partida.TipoPrueba == "p" || Partida.TipoPrueba == "gp") { // Produccion Tela o Produccion Prenda
                $("#divResistenciaPilling").remove();
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "m") {  // Muestra Tela              
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "d") { // Desarrollo Tela  
                $("#divSolidezFrote").remove();
                $("#divSolidezLavado").remove();
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }


            if (Partida.TipoPrueba == "pp") {
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }


            // Falta Garment Instruccion de Cuidado

            $("#txtEncogimientoLargo").val(Partida.EncogimientoLargo);
            $("#txtEncogimientoAncho").val(Partida.EncogimientoAncho);
            $("#txtRevirado").val(Partida.Revirado);
            $("#txtApariencia").val(Partida.Apariencia);
            $("#txtPilling").val(Partida.GradoPilling);
            $("#cboEncogimientoStatus").val(Partida.EncogimientoStatus.toString());
            $("#cboReviradoStatus").val(Partida.ReviradoStatus.toString());
            $("#cboAparienciaStatus").val(Partida.AparienciaStatus.toString());

            //Densidad de Tela

            $("#txtDensidad").val(Partida.Densidad);
            $("#txtAnchoAcabado").val(Partida.AnchoAcabado);


            if (Partida.GramajeAcabado != "") {
                $("#hdGramajeAcabado").val(Partida.GramajeAcabado);
            }

            if (Partida.Densidad != "") {
                var Densidad = parseFloat(Partida.Densidad);
                var GramajeAcabado = parseFloat(Partida.GramajeAcabado);
                var Desviacion = (((Densidad - GramajeAcabado) / GramajeAcabado) * 100).toFixed(1);

                if (Desviacion != "NaN") {
                    $("#txtDesviacion").val(Desviacion);
                }

            }
            $("#cboDensidadStatus").val(Partida.DensidadStatus.toString());

            //Solidez al frote

            $("#txtSeco").val(Partida.Seco);
            $("#txtHumedo").val(Partida.Humedo);
            $("#cboSolidezFroteStatus").val(Partida.SolidezFroteStatus.toString());

            // Solidez al lavado

            $("#txtCambioColorSL").val(Partida.CambioColorSL);
            $("#txtNylonSL").val(Partida.NylonSL);
            $("#txtAcrilicoSL").val(Partida.AcrilicoSL);

            $("#txtAcetatoSL").val(Partida.AcetatoSL);
            $("#txtSilkSL").val(Partida.SilkSL);
            $("#txtLanaSL").val(Partida.LanaSL);

            $("#txtAlgodonSL").val(Partida.AlgodonSL);
            $("#txtPoliesterSL").val(Partida.PoliesterSL);
            $("#txtViscosaSL").val(Partida.ViscosaSL);

            $("#cboEvaluacionApariencia").val(Partida.EvaluacionAparienciaSL);
            $("#cboSolidezLavadoStatus").val(Partida.SolidezLavadoStatus.toString());


            /* Solidez al Lavado Modificado*/
            $("#txtCambioColorSLM").val(Partida.CambioColorSLM);
            $("#txtAcetatoSLM").val(Partida.AcetatoSLM);
            $("#txtAlgodonSLM").val(Partida.AlgodonSLM);
            $("#txtNylonSLM").val(Partida.NylonSLM);
            $("#txtSilkSLM").val(Partida.SilkSLM);
            $("#txtPoliesterSLM").val(Partida.PoliesterSLM);
            $("#txtAcrilicoSLM").val(Partida.AcrilicoSLM);
            $("#txtLanaSLM").val(Partida.LanaSLM);
            $("#txtViscosaSLM").val(Partida.ViscosaSLM);
            $("#cboSolidezLavadoModificadoStatus").val(Partida.SolidezLavadoModificado.toString());

            //Resistencia al Pilling

            $("#txtPillingResultado").val(Partida.PillingResultado);
            $("#txtPillingMin").val(Partida.PillingMin);
            $("#cboPillingStatus").val(Partida.ResistenciaPillingStatus.toString());

            //Bursting

            $("#txtBurstingResultado").val(Partida.BurstingResultado);
            $("#txtBurstingMin").val(Partida.BurstingMin);
            $("#cboBurstingStatus").val(Partida.BurstingStatus.toString());

            //Solidez a la Transpiracion

            $("#txtCambioColorST").val(Partida.CambioColorST);
            $("#txtNylonST").val(Partida.NylonST);
            $("#txtAcrilicoST").val(Partida.AcrilicoST);

            $("#txtAcetatoST").val(Partida.AcetatoST);
            $("#txtSilkST").val(Partida.SilkST);
            $("#txtLanaST").val(Partida.LanaST);

            $("#txtAlgodonST").val(Partida.AlgodonST);
            $("#txtPoliesterST").val(Partida.PoliesterST);
            $("#txtViscosaST").val(Partida.ViscosaST);

            $("#cboSolidezTranspiracionStatus").val(Partida.SolidezTranspiracionStatus.toString());

            //Solidez al Agua

            $("#txtCambioColorSA").val(Partida.CambioColorSA);
            $("#txtNylonSA").val(Partida.NylonSA);
            $("#txtAcrilicoSA").val(Partida.AcrilicoSA);

            $("#txtAcetatoSA").val(Partida.AcetatoSA);
            $("#txtSilkSA").val(Partida.SilkSA);
            $("#txtLanaSA").val(Partida.LanaSA);

            $("#txtAlgodonSA").val(Partida.AlgodonSA);
            $("#txtPoliesterSA").val(Partida.PoliesterSA);
            $("#txtViscosaSA").val(Partida.ViscosaSA);

            $("#cboSolidezAguaStatus").val(Partida.SolidezAguaStatus.toString());


            //Blanqueador sin Cloro

            $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(Partida.CambioColorBlanqueadorSinCloroSodiumPerborate);
            $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(Partida.CambioColorBlanqueadorSinCloroHydrogenPeroxide);
            $("#cboBlanqueadorSinClaroStatus").val(Partida.BlanqueadorSinClaroStatus.toString());

            //Blanqueador con Cloro

            $("#txtCambioColorBlanqueadorConCloro").val(Partida.CambioColorBlanqueadorConCloro);
            $("#cboBlanqueadorConCloroStatus").val(Partida.BlanqueadorConCloroStatus.toString());

            //PH Value
            $("#txtResultadoPH").val(Partida.ResultadoPH);
            $("#txtRequeridoPH").val(Partida.RequeridoPH);
            $("#cboPHStatus").val(Partida.PHStatus.toString());

            //Wicking

            $("#txtWikingPulgadas").val(Partida.WikingPulgadas);
            $("#txtWikingMin30Wales").val(Partida.Wales30Wiking);
            $("#txtWikingMinutes").val(Partida.WikingMinutos);
            $("#txtWikingMin30Courses").val(Partida.Courses30Wiking);
            $("#cboWikingStatus").val(Partida.WikingStatus.toString());


            /* Estabilidad Dimensional - Tela - Luis */

            $("#txtMuestraA_Ancho_1erLav_1").val(Partida.MuestraA_Ancho_1erLav_1);
            $("#txtMuestraA_Ancho_3erLav_1").val(Partida.MuestraA_Ancho_3erLav_1);
            _('txtMuestraA_Ancho_5toLav_1').value = Partida.MuestraA_Ancho_5toLav_1;
            $("#txtMuestraA_Largo_1erLav_1").val(Partida.MuestraA_Largo_1erLav_1);
            $("#txtMuestraA_Largo_3erLav_1").val(Partida.MuestraA_Largo_3erLav_1);
            _('txtMuestraA_Largo_5toLav_1').value = Partida.MuestraA_Largo_5toLav_1;
            $("#txtMuestraB_Ancho_1erLav_1").val(Partida.MuestraB_Ancho_1erLav_1);
            $("#txtMuestraB_Ancho_3erLav_1").val(Partida.MuestraB_Ancho_3erLav_1);
            _('txtMuestraB_Ancho_5toLav_1').value = Partida.MuestraB_Ancho_5toLav_1;
            $("#txtMuestraB_Largo_1erLav_1").val(Partida.MuestraB_Largo_1erLav_1);
            $("#txtMuestraB_Largo_3erLav_1").val(Partida.MuestraB_Largo_3erLav_1);
            _('txtMuestraB_Largo_5toLav_1').value = Partida.MuestraB_Largo_5toLav_1;

            $("#txtMuestraA_Ancho_1erLav_2").val(Partida.MuestraA_Ancho_1erLav_2);
            $("#txtMuestraA_Ancho_3erLav_2").val(Partida.MuestraA_Ancho_3erLav_2);
            _('txtMuestraA_Ancho_5toLav_2').value = Partida.MuestraA_Ancho_5toLav_2;
            $("#txtMuestraA_Largo_1erLav_2").val(Partida.MuestraA_Largo_1erLav_2);
            $("#txtMuestraA_Largo_3erLav_2").val(Partida.MuestraA_Largo_3erLav_2);
            _('txtMuestraA_Largo_5toLav_2').value = Partida.MuestraA_Largo_5toLav_2;
            $("#txtMuestraB_Ancho_1erLav_2").val(Partida.MuestraB_Ancho_1erLav_2);
            $("#txtMuestraB_Ancho_3erLav_2").val(Partida.MuestraB_Ancho_3erLav_2);
            _('txtMuestraB_Ancho_5toLav_2').value = Partida.MuestraB_Ancho_5toLav_2;
            $("#txtMuestraB_Largo_1erLav_2").val(Partida.MuestraB_Largo_1erLav_2);
            $("#txtMuestraB_Largo_3erLav_2").val(Partida.MuestraB_Largo_3erLav_2);
            _('txtMuestraB_Largo_5toLav_2').value = Partida.MuestraB_Largo_5toLav_2;

            $("#txtMuestraA_Ancho_1erLav_3").val(Partida.MuestraA_Ancho_1erLav_3);
            $("#txtMuestraA_Ancho_3erLav_3").val(Partida.MuestraA_Ancho_3erLav_3);
            _('txtMuestraA_Ancho_5toLav_3').value = Partida.MuestraA_Ancho_5toLav_3;
            $("#txtMuestraA_Largo_1erLav_3").val(Partida.MuestraA_Largo_1erLav_3);
            $("#txtMuestraA_Largo_3erLav_3").val(Partida.MuestraA_Largo_3erLav_3);
            _('txtMuestraA_Largo_5toLav_3').value = Partida.MuestraA_Largo_5toLav_3;
            $("#txtMuestraB_Ancho_1erLav_3").val(Partida.MuestraB_Ancho_1erLav_3);
            $("#txtMuestraB_Ancho_3erLav_3").val(Partida.MuestraB_Ancho_3erLav_3);
            _('txtMuestraB_Ancho_5toLav_3').value = Partida.MuestraB_Ancho_5toLav_3;
            $("#txtMuestraB_Largo_1erLav_3").val(Partida.MuestraB_Largo_1erLav_3);
            $("#txtMuestraB_Largo_3erLav_3").val(Partida.MuestraB_Largo_3erLav_3);
            _('txtMuestraB_Largo_5toLav_3').value = Partida.MuestraB_Largo_5toLav_3;

            /* Estabilidad Dimensional - Prenda - Luis */

            $("#txtAcrossChestOriginal").val(Partida.AcrossChestOriginal);
            $("#txtAcrossChestOneCyle").val(Partida.AcrossChestOneCyle);
            $("#txtAcrossChestOneCyleChange").val(Partida.AcrossChestOneCyleChange); //Aplicar Formula
            $("#txtAcrossChestThreeCyles").val(Partida.AcrossChestThreeCyles);
            $("#txtAcrossChestThreeCylesChange").val(Partida.AcrossChestThreeCylesChange); //Aplicar Formula
            _('txtAcrossChestFiveCycle').value = Partida.AcrossChestFiveCycle;
            _('txtAcrossChestFiveCycleChange').value = Partida.AcrossChestFiveCycleChange; //Aplicar Formula

            $("#txtBottomWidthOriginal").val(Partida.BottomWidthOriginal);
            $("#txtBottomWidthOneCyle").val(Partida.BottomWidthOneCyle);
            $("#txtBottomWidthOneCyleChange").val(Partida.BottomWidthOneCyleChange); //Aplicar Formula
            $("#txtBottomWidthThreeCyles").val(Partida.BottomWidthThreeCyles);
            $("#txtBottomWidthThreeCylesChange").val(Partida.BottomWidthThreeCylesChange); //Aplicar Formula
            _('txtBottomWidthFiveCycle').value = Partida.BottomWidthFiveCycle;
            _('txtBottomWidthFiveCycleChange').value = Partida.BottomWidthtFiveCycleChange; //Aplicar Formula

            $("#txtBodyFromLenOriginal").val(Partida.BodyFromLenOriginal);
            $("#txtBodyFromLeOneCyle").val(Partida.BodyFromLeOneCyle);
            $("#txtBodyFromLeOneCyleChange").val(Partida.BodyFromLeOneCyleChange); //Aplicar Formula
            $("#txtBodyFromLeThreeCyles").val(Partida.BodyFromLeThreeCyles);
            $("#txtBodyFromLeThreeCylesChange").val(Partida.BodyFromLeThreeCylesChange); //Aplicar Formula
            _('txtBodyFromLeFiveCycle').value = Partida.BodyFromLeFiveCycle;
            _('txtBodyFromLeFiveCycleChange').value = Partida.BodyFromLenFiveCycleChange; //Aplicar Formula

            $("#txtSleeveLenOriginal").val(Partida.SleeveLenOriginal);
            $("#txtSleeveLenOneCyle").val(Partida.SleeveLenOneCyle);
            $("#txtSleeveLenOneCyleChange").val(Partida.SleeveLenOneCyleChange); //Aplicar Formula
            $("#txtSleeveLenThreeCyles").val(Partida.SleeveLenThreeCyles);
            $("#txtSleeveLenThreeCylesChange").val(Partida.SleeveLenThreeCylesChange); //Aplicar Formula
            _('txtSleeveLenFiveCycle').value = Partida.SleeveLenFiveCycle;
            _('txtSleeveLenFiveCycleChange').value = Partida.SleeveLenFiveCycleChange; //Aplicar Formula

            $("#txtWaistbandWidthHalfOriginal").val(Partida.WaistbandWidthHalfOriginal);
            $("#txtWaistbandWidthHalfOneCyle").val(Partida.WaistbandWidthHalfOneCyle);
            $("#txtWaistbandWidthHalfOneCyleChange").val(Partida.WaistbandWidthHalfOneCyleChange); //Aplicar Formula
            $("#txtWaistbandWidthHalfThreeCyles").val(Partida.WaistbandWidthHalfThreeCyles);
            $("#txtWaistbandWidthHalfThreeCylesChange").val(Partida.WaistbandWidthHalfThreeCylesChange); //Aplicar Formula
            _('txtWaistbandWidthHalfFiveCycle').value = Partida.WaistbandWidthHalfFiveCycle;
            _('txtWaistbandWidthHalfFiveCycleChange').value = Partida.WaistbandWidthHalfFiveCycleChange; //Aplicar Formula

            $("#txtLegOpeningHalfOriginal").val(Partida.LegOpeningHalfOriginal);
            $("#txtLegOpeningHalfOneCyle").val(Partida.LegOpeningHalfOneCyle);
            $("#txtLegOpeningHalfOneCyleChange").val(Partida.LegOpeningHalfOneCyleChange); //Aplicar Formula
            $("#txtLegOpeningHalfThreeCyles").val(Partida.LegOpeningHalfThreeCyles);
            $("#txtLegOpeningHalfThreeCylesChange").val(Partida.LegOpeningHalfThreeCylesChange); //Aplicar Formula
            _('txtLegOpeningHalfFiveCycle').value = Partida.LegOpeningHalfFiveCycle;
            _('txtLegOpeningHalfFiveCycleChange').value = Partida.LegOpeningHalfFiveCycleChange; //Aplicar Formula

            $("#txtOutseambelowOriginal").val(Partida.OutseambelowOriginal);
            $("#txtOutseambelowOneCyle").val(Partida.OutseambelowOneCyle);
            $("#txtOutseambelowOneCyleChange").val(Partida.OutseambelowOneCyleChange); //Aplicar Formula
            $("#txtOutseambelowThreeCyles").val(Partida.OutseambelowThreeCyles);
            $("#txtOutseambelowThreeCylesChange").val(Partida.OutseambelowThreeCylesChange); //Aplicar Formula
            _('txtOutseambelowFiveCycle').value = Partida.OutseambelowFiveCycle;
            _('txtOutseambelowFiveCycleChange').value = Partida.OutseambelowFiveCycleChange; //Aplicar Formula

            $("#txtInseamLenOriginal").val(Partida.InseamLenOriginal);
            $("#txtInseamLenOneCyle").val(Partida.InseamLenOneCyle);
            $("#txtInseamLenOneCyleChange").val(Partida.InseamLenOneCyleChange); //Aplicar Formula
            $("#txtInseamLenThreeCyles").val(Partida.InseamLenThreeCyles);
            $("#txtInseamLenThreeCylesChange").val(Partida.InseamLenThreeCylesChange); //Aplicar Formula
            _('txtInseamLenFiveCycle').value = Partida.InseamLenFiveCycle;
            _('txtInseamLenFiveCycleChange').value = Partida.InseamLenFiveCycleChange; //Aplicar Formula

            /* Revirado - Luis */

            $("#txtMuestraA_1erLav_AC").val(Partida.MuestraA_1erLav_AC);
            $("#txtMuestraA_1erLav_BD").val(Partida.MuestraA_1erLav_BD);
            $("#txtMuestraA_3erLav_AC").val(Partida.MuestraA_3erLav_AC);
            $("#txtMuestraA_3erLav_BD").val(Partida.MuestraA_3erLav_BD);
            $("#txtMuestraA_5toLav_AC").val(Partida.MuestraA_5toLav_AC);
            $("#txtMuestraA_5toLav_BD").val(Partida.MuestraA_5toLav_BD);

            $("#txtMuestraB_1erLav_AC").val(Partida.MuestraB_1erLav_AC);
            $("#txtMuestraB_1erLav_BD").val(Partida.MuestraB_1erLav_BD);
            $("#txtMuestraB_3erLav_AC").val(Partida.MuestraB_3erLav_AC);
            $("#txtMuestraB_3erLav_BD").val(Partida.MuestraB_3erLav_BD);
            $("#txtMuestraB_5toLav_AC").val(Partida.MuestraB_5toLav_AC);
            $("#txtMuestraB_5toLav_BD").val(Partida.MuestraB_5toLav_BD);

            // EP Estabilidad 

            $("#txtMuestraA_Ancho_1erLav_1_EP").val(Partida.MuestraA_Ancho_1erLav_1_EP);
            $("#txtMuestraA_Ancho_3erLav_1_EP").val(Partida.MuestraA_Ancho_3erLav_1_EP);
            $("#txtMuestraA_Largo_1erLav_1_EP").val(Partida.MuestraA_Largo_1erLav_1_EP);
            $("#txtMuestraA_Largo_3erLav_1_EP").val(Partida.MuestraA_Largo_3erLav_1_EP);

            $("#txtMuestraA_1erLav_AC_EP").val(Partida.MuestraA_1erLav_AC_EP);
            $("#txtMuestraA_1erLav_BD_EP").val(Partida.MuestraA_1erLav_BD_EP);
            $("#txtMuestraA_3erLav_AC_EP").val(Partida.MuestraA_3erLav_AC_EP);
            $("#txtMuestraA_3erLav_BD_EP").val(Partida.MuestraA_3erLav_BD_EP);

            $("#txtMuestraB_Ancho_1erLav_1_EP").val(Partida.MuestraB_Ancho_1erLav_1_EP);
            $("#txtMuestraB_Ancho_3erLav_1_EP").val(Partida.MuestraB_Ancho_3erLav_1_EP);
            $("#txtMuestraB_Largo_1erLav_1_EP").val(Partida.MuestraB_Largo_1erLav_1_EP);
            $("#txtMuestraB_Largo_3erLav_1_EP").val(Partida.MuestraB_Largo_3erLav_1_EP);

            $("#txtMuestraB_1erLav_AC_EP").val(Partida.MuestraB_1erLav_AC_EP);
            $("#txtMuestraB_1erLav_BD_EP").val(Partida.MuestraB_1erLav_BD_EP);
            $("#txtMuestraB_3erLav_AC_EP").val(Partida.MuestraB_3erLav_AC_EP);
            $("#txtMuestraB_3erLav_BD_EP").val(Partida.MuestraB_3erLav_BD_EP);

            $("#txtMuestraA_Ancho_1erLav_2_EP").val(Partida.MuestraA_Ancho_1erLav_2_EP);
            $("#txtMuestraA_Ancho_3erLav_2_EP").val(Partida.MuestraA_Ancho_3erLav_2_EP);
            $("#txtMuestraA_Largo_1erLav_2_EP").val(Partida.MuestraA_Largo_1erLav_2_EP);
            $("#txtMuestraA_Largo_3erLav_2_EP").val(Partida.MuestraA_Largo_3erLav_2_EP);

            $("#txtMuestraB_Ancho_1erLav_2_EP").val(Partida.MuestraB_Ancho_1erLav_2_EP);
            $("#txtMuestraB_Ancho_3erLav_2_EP").val(Partida.MuestraB_Ancho_3erLav_2_EP);
            $("#txtMuestraB_Largo_1erLav_2_EP").val(Partida.MuestraB_Largo_1erLav_2_EP);
            $("#txtMuestraB_Largo_3erLav_2_EP").val(Partida.MuestraB_Largo_3erLav_2_EP);


            $("#txtMuestraA_Ancho_1erLav_3_EP").val(Partida.MuestraA_Ancho_1erLav_3_EP);
            $("#txtMuestraA_Ancho_3erLav_3_EP").val(Partida.MuestraA_Ancho_3erLav_3_EP);
            $("#txtMuestraA_Largo_1erLav_3_EP").val(Partida.MuestraA_Largo_1erLav_3_EP);
            $("#txtMuestraA_Largo_3erLav_3_EP").val(Partida.MuestraA_Largo_3erLav_3_EP);

            $("#txtMuestraB_Ancho_1erLav_3_EP").val(Partida.MuestraB_Ancho_1erLav_3_EP);
            $("#txtMuestraB_Ancho_3erLav_3_EP").val(Partida.MuestraB_Ancho_3erLav_3_EP);
            $("#txtMuestraB_Largo_1erLav_3_EP").val(Partida.MuestraB_Largo_1erLav_3_EP);
            $("#txtMuestraB_Largo_3erLav_3_EP").val(Partida.MuestraB_Largo_3erLav_3_EP);

            $("#txtEncogimientoLargo_EP").val(Partida.EncogimientoLargo_EP);
            $("#txtEncogimientoAncho_EP").val(Partida.EncogimientoAncho_EP);
            $("#txtRevirado_EP").val(Partida.Revirado_EP);
            $("#txtApariencia_EP").val(Partida.Apariencia_EP);
            $("#txtPilling_EP").val(Partida.Pilling_EP);
            $("#cboEncogimientoStatus_EP").val(Partida.EncogimientoStatus_EP.toString());
            $("#cboReviradoStatus_EP").val(Partida.ReviradoStatus_EP.toString());


            // Fin EP

            // HW Estabilidad 

            $("#txtMuestraA_Ancho_1erLav_1_HW").val(Partida.MuestraA_Ancho_1erLav_1_HW);
            $("#txtMuestraA_Ancho_3erLav_1_HW").val(Partida.MuestraA_Ancho_3erLav_1_HW);
            $("#txtMuestraA_Largo_1erLav_1_HW").val(Partida.MuestraA_Largo_1erLav_1_HW);
            $("#txtMuestraA_Largo_3erLav_1_HW").val(Partida.MuestraA_Largo_3erLav_1_HW);

            $("#txtMuestraA_1erLav_AC_HW").val(Partida.MuestraA_1erLav_AC_HW);
            $("#txtMuestraA_1erLav_BD_HW").val(Partida.MuestraA_1erLav_BD_HW);
            $("#txtMuestraA_3erLav_AC_HW").val(Partida.MuestraA_3erLav_AC_HW);
            $("#txtMuestraA_3erLav_BD_HW").val(Partida.MuestraA_3erLav_BD_HW);

            $("#txtMuestraB_Ancho_1erLav_1_HW").val(Partida.MuestraB_Ancho_1erLav_1_HW);
            $("#txtMuestraB_Ancho_3erLav_1_HW").val(Partida.MuestraB_Ancho_3erLav_1_HW);
            $("#txtMuestraB_Largo_1erLav_1_HW").val(Partida.MuestraB_Largo_1erLav_1_HW);
            $("#txtMuestraB_Largo_3erLav_1_HW").val(Partida.MuestraB_Largo_3erLav_1_HW);

            $("#txtMuestraB_1erLav_AC_HW").val(Partida.MuestraB_1erLav_AC_HW);
            $("#txtMuestraB_1erLav_BD_HW").val(Partida.MuestraB_1erLav_BD_HW);
            $("#txtMuestraB_3erLav_AC_HW").val(Partida.MuestraB_3erLav_AC_HW);
            $("#txtMuestraB_3erLav_BD_HW").val(Partida.MuestraB_3erLav_BD_HW);

            $("#txtMuestraA_Ancho_1erLav_2_HW").val(Partida.MuestraA_Ancho_1erLav_2_HW);
            $("#txtMuestraA_Ancho_3erLav_2_HW").val(Partida.MuestraA_Ancho_3erLav_2_HW);
            $("#txtMuestraA_Largo_1erLav_2_HW").val(Partida.MuestraA_Largo_1erLav_2_HW);
            $("#txtMuestraA_Largo_3erLav_2_HW").val(Partida.MuestraA_Largo_3erLav_2_HW);

            $("#txtMuestraB_Ancho_1erLav_2_HW").val(Partida.MuestraB_Ancho_1erLav_2_HW);
            $("#txtMuestraB_Ancho_3erLav_2_HW").val(Partida.MuestraB_Ancho_3erLav_2_HW);
            $("#txtMuestraB_Largo_1erLav_2_HW").val(Partida.MuestraB_Largo_1erLav_2_HW);
            $("#txtMuestraB_Largo_3erLav_2_HW").val(Partida.MuestraB_Largo_3erLav_2_HW);


            $("#txtMuestraA_Ancho_1erLav_3_HW").val(Partida.MuestraA_Ancho_1erLav_3_HW);
            $("#txtMuestraA_Ancho_3erLav_3_HW").val(Partida.MuestraA_Ancho_3erLav_3_HW);
            $("#txtMuestraA_Largo_1erLav_3_HW").val(Partida.MuestraA_Largo_1erLav_3_HW);
            $("#txtMuestraA_Largo_3erLav_3_HW").val(Partida.MuestraA_Largo_3erLav_3_HW);

            $("#txtMuestraB_Ancho_1erLav_3_HW").val(Partida.MuestraB_Ancho_1erLav_3_HW);
            $("#txtMuestraB_Ancho_3erLav_3_HW").val(Partida.MuestraB_Ancho_3erLav_3_HW);
            $("#txtMuestraB_Largo_1erLav_3_HW").val(Partida.MuestraB_Largo_1erLav_3_HW);
            $("#txtMuestraB_Largo_3erLav_3_HW").val(Partida.MuestraB_Largo_3erLav_3_HW);

            $("#txtEncogimientoLargo_HW").val(Partida.EncogimientoLargo_HW);
            $("#txtEncogimientoAncho_HW").val(Partida.EncogimientoAncho_HW);
            $("#txtRevirado_HW").val(Partida.Revirado_HW);
            $("#txtApariencia_HW").val(Partida.Apariencia_HW);
            $("#txtPilling_HW").val(Partida.Pilling_HW);
            $("#cboEncogimientoStatus_HW").val(Partida.EncogimientoStatus_HW.toString());
            $("#cboReviradoStatus_HW").val(Partida.ReviradoStatus_HW.toString());

            // Fin HW





            // Almacenamiento

            $("#txtCambioColorAlmacenamiento").val(Partida.CambioColorAlmacenamiento);
            $("#txtNylonAlmacenamiento").val(Partida.NylonAlmacenamiento);
            $("#txtAcrilicoAlmacenamiento").val(Partida.AcrilicoAlmacenamiento);

            $("#txtAcetatoAlmacenamiento").val(Partida.AcetatoAlmacenamiento);
            $("#txtSilkAlmacenamiento").val(Partida.SilkAlmacenamiento);
            $("#txtLanaAlmacenamiento").val(Partida.LanaAlmacenamiento);

            $("#txtAlgodonAlmacenamiento").val(Partida.AlgodonAlmacenamiento);
            $("#txtPoliesterAlmacenamiento").val(Partida.PoliesterAlmacenamiento);
            $("#txtViscosaAlmacenamiento").val(Partida.ViscoseAlmacenamiento);
            $("#txtStainingWhiteCloth").val(Partida.StainingWhiteCloth);

            $("#cboAlmacenamientoStatus").val(Partida.AlmacenamientoStatus.toString());

            //$("#txtWickingRequerido").val(Partida.WickingRequerido);


            $("#txtMuestra1Densidad").val(Partida.Muestra1Densidad);
            $("#txtMuestra2Densidad").val(Partida.Muestra2Densidad);
            $("#txtMuestra3Densidad").val(Partida.Muestra3Densidad);

            $("#txtMuestra1Ancho").val(Partida.Muestra1Ancho);
            $("#txtMuestra2Ancho").val(Partida.Muestra2Ancho);

            $("#txtMuestra3Ancho").val(Partida.Muestra3Ancho);


            $("#cboAprobadoComercial").val(Partida.AprobadoComercial);

            $("#txtDescripcionTela").val(Partida.DescripcionTela);


            //Prendas y Metodos

            $("#txtAcrossChestOneCyleChange").val(Partida.AcrossChestOneCycleChange);
            $("#txtAcrossChestThreeCylesChange").val(Partida.AcrossChestThreeCycleChange);

            $("#txtBottomWidthOneCyleChange").val(Partida.BottomWidthtOneCycleChange);
            $("#txtBottomWidthThreeCylesChange").val(Partida.BottomWidthThreeCycleChange);

            $("#txtBodyFromLeOneCyleChange").val(Partida.BodyFromLenOneCycleChange);
            $("#txtBodyFromLeThreeCylesChange").val(Partida.BodyFromLenThreeCycleChange);

            $("#txtSleeveLenOneCyleChange").val(Partida.SleeveLenOneCycleChange);
            $("#txtSleeveLenThreeCylesChange").val(Partida.SleeveLenThreeCycleChange);

            $("#txtWaistbandWidthHalfOneCyleChange").val(Partida.WaistbandWidthHalfOneCycleChange);
            $("#txtWaistbandWidthHalfThreeCylesChange").val(Partida.WaistbandWidthHalfThreeCycleChange);

            $("#txtLegOpeningHalfOneCyleChange").val(Partida.LegOpeningHalfOneCycleChange);
            $("#txtLegOpeningHalfThreeCylesChange").val(Partida.LegOpeningHalfThreeCycleChange);

            $("#txtOutseambelowOneCyleChange").val(Partida.OutseambelowOneCycleChange);
            $("#txtOutseambelowThreeCylesChange").val(Partida.OutseambelowThreeCycleChange);

            $("#txtInseamLenOneCyleChange").val(Partida.InseamLenOneCycleChange);
            $("#txtInseamLenThreeCylesChange").val(Partida.InseamLenThreeCycleChange);

            $("input:radio[name ='radCicloLavadora']").each(function () {
                if ($(this).val() == Partida.CicloLavadora) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radTemperaturaLavado']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radProcedimientoSecado']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radProcedimientoSecadoA']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radSolidezLavadoMetodos']").each(function () {
                if ($(this).val() == Partida.SolidezLavadoCondiciones) {
                    this.checked = true;
                    return false;
                }
            });

            $("#txtAABefore").val(Partida.SeamTwistAA);
            $("#txtABBefore").val(Partida.SeamTwistAB);
            $("#txtSeamResultadoBefore").val(Partida.SeamTwistResultado);


            $("#txtAAAfter").val(Partida.SeamTwistAAAfter);
            $("#txtABAfter").val(Partida.SeamTwistABAfter);
            $("#txtSeamResultadoAfter").val(Partida.SeamTwistResultadoAfter);

            $("#txtSeamChange").val(Partida.SeamTwistChange);

            $("#cboSeamTwistStatus").val(Partida.SeamTwistStatus.toString());


            $("#cboUOM").val(Partida.UOM);

            $("#txtGradoSA").val(Partida.GradeSA);

            $("#cboEncogimientoGarmentStatus").val(Partida.EncogimientoStatusGarment.toString());

            // IdClienteERP

            $("#hfIdClienteERP").val(Partida.IdClienteERP);

            //IdProveedor
            $("#hfIdProveedor").val(Partida.IdProveedor);


            $("#cboStatusTono").val(Partida.StatusTono);

        }
    }

}

/*
function CalcularEncogimientoAncho(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {

            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoAncho = 0;

        if (Resultados.some(x => x.Lavado === "3")) { // Si hay algun valor en tercer lavado ya no se toma en cuenta el primer lavado
            var filtro = Resultados.filter(x => x.Lavado === "3");
            var contador = 0;
            var suma = 0;
            filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });

            EncogimientoAncho = suma / contador;

            $("#" + target).val(EncogimientoAncho.toFixed(1));
        } else {
            var filtro = Resultados.filter(x => x.Lavado === "1");
            var contador = 0;
            var suma = 0;
            filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });

            EncogimientoAncho = suma / contador;

            if (!isNaN(EncogimientoAncho)) {
                $("#" + target).val(EncogimientoAncho.toFixed(1));
            }



        }
    } else {
        $("#" + target).val(0);
    }


}
*/

/*
function CalcularEncogimientoLargo(clase, target) {

    var Resultados = new Array();

    $("." + clase).each(function () {
        var Valor = $(this).val();
        Valor = parseFloat(Valor);
        var Lavado = $(this).attr("data-lavado");
        var Muestra = $(this).attr("data-muestra");
        if (!isNaN(Valor)) {
            if (Valor != 0) {
                var obj = {
                    Lavado: Lavado,
                    Muestra: Muestra,
                    Valor: Valor
                }
                Resultados.push(obj);
            }
        }
    });

    if (Resultados.length > 0) {
        var EncogimientoLargo = 0;

        if (Resultados.some(x => x.Lavado === "3")) { // Si hay algun valor en tercer lavado ya no se toma en cuenta el primer lavado
            var filtro = Resultados.filter(x => x.Lavado === "3");
            var contador = 0;
            var suma = 0;
            filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });

            EncogimientoLargo = suma / contador;

            $("#" + target).val(EncogimientoLargo.toFixed(1));
        } else {
            var filtro = Resultados.filter(x => x.Lavado === "1");
            var contador = 0;
            var suma = 0;
            filtro.forEach(x => { suma += x.Valor; contador = contador + 1; });

            EncogimientoLargo = suma / contador;

            if (!isNaN(EncogimientoLargo)) {
                $("#" + target).val(EncogimientoLargo.toFixed(1));
            }

        }
    } else {
        $("#" + target).val(0);
    }


}
*/

/*
function CalcularRevirado(contenedor, clase) {

    var Resultados = new Array();
    $("." + clase).each(function () {
        var Valor = $(this).val();
        var Muestra = $(this).attr("data-muestra");
        var Lavado = $(this).attr("data-lavado");
        var Campo = $(this).attr("data-par");

        if (Valor == "") {
            Valor = 0;
        }

        //if (Valor != 0) {
        var obj = {
            Lavado: Lavado,
            Campo: Campo,
            Valor: Valor,
            Muestra: Muestra
        }
        Resultados.push(obj);
        //}
    });
    if (Resultados.length > 0) {
        var Revirado = 0;

        if (Resultados.some(x => x.Lavado === "3" && x.Valor > 0)) { // Si hay algun valor en tercer lavado ya no se toma en cuenta el primer lavado
            var filtro = Resultados.filter(x => x.Lavado === "3");

            // Muestra A
            var AC_A = parseFloat(filtro.filter(x => x.Campo === "AC" && x.Muestra === "A")[0].Valor);
            var BD_A = parseFloat(filtro.filter(x => x.Campo === "BD" && x.Muestra === "A")[0].Valor);

            var R1_A = AC_A - BD_A;
            var R2_A = AC_A + BD_A;

            var R3_A = 0;

            if (R2_A > 0) {
                R3_A = (R1_A / R2_A) * 200;

            }

            // Muestra B
            var AC_B = parseFloat(filtro.filter(x => x.Campo === "AC" && x.Muestra === "B")[0].Valor);
            var BD_B = parseFloat(filtro.filter(x => x.Campo === "BD" && x.Muestra === "B")[0].Valor);

            var R1_B = AC_B - BD_B;
            var R2_B = AC_B + BD_B;

            var R3_B = 0;

            if (R2_B > 0) {
                R3_B = (R1_B / R2_B) * 200;
            }

            // Resultado de las dos muestras es el promedio 

            var Revirado = 0;

            //Revirado = (R3_A + R3_B) / 2;


            if (R3_A < 0 && R3_B > 0) {
                Revirado = R3_A.toFixed(1) + '/' + R3_B.toFixed(1);
            } else if (R3_A > 0 && R3_B < 0) {
                Revirado = R3_A.toFixed(1) + '/' + R3_B.toFixed(1);
            } else {
                Revirado = (R3_A + R3_B) / 2;
            }

            if (!isNaN(Revirado)) {
                $("#" + contenedor).val(Revirado.toFixed(1));
            } else {
                $("#" + contenedor).val(Revirado);
            }

        } else {
            var filtro = Resultados.filter(x => x.Lavado === "1");

            // Muestra A
            var AC_A = parseFloat(filtro.filter(x => x.Campo === "AC" && x.Muestra === "A")[0].Valor);
            var BD_A = parseFloat(filtro.filter(x => x.Campo === "BD" && x.Muestra === "A")[0].Valor);

            var R1_A = AC_A - BD_A;
            var R2_A = AC_A + BD_A;

            var R3_A = (R1_A / R2_A) * 200;

            // Muestra B
            var AC_B = parseFloat(filtro.filter(x => x.Campo === "AC" && x.Muestra === "B")[0].Valor);
            var BD_B = parseFloat(filtro.filter(x => x.Campo === "BD" && x.Muestra === "B")[0].Valor);

            var R1_B = AC_B - BD_B;
            var R2_B = AC_B + BD_B;

            var R3_B = (R1_B / R2_B) * 200;

            // Resultado de las dos muestras es el promedio 

            //var Revirado = (R3_A + R3_B) / 2;

            var Revirado = 0;

            //Revirado = (R3_A + R3_B) / 2;


            if (R3_A < 0 && R3_B > 0) {
                Revirado = R3_A.toFixed(1) + '/' + R3_B.toFixed(1);
            } else if (R3_A > 0 && R3_B < 0) {
                Revirado = R3_A.toFixed(1) + '/' + R3_B.toFixed(1);
            } else {
                Revirado = (R3_A + R3_B) / 2;
            }

            if (!isNaN(Revirado)) {
                $("#" + contenedor).val(Revirado.toFixed(1));
            }

            else {
                if (Revirado != "NaN") {
                    $("#" + contenedor).val(Revirado);
                }


            }

        }
    } else {
        $("#" + contenedor).val(0);
    }
}

*/

/*
function Save() {


    var objPartida = {
        CodigoPartida: $("#hfCodigoPartida").val(),
        StatusPartida: $("#cboPartidaStatus").val(),
        ComentarioColor: $("#txtComentarioColor").val(),
        ComentarioTesting: $("#txtComentarioTesting").val(),
        InstruccionCuidado: $("#txtInstruccionesCuidado").val(),

        MuestraA_Ancho_1erLav_1: $("#txtMuestraA_Ancho_1erLav_1").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1").val(),
        MuestraA_Ancho_3erLav_1: $("#txtMuestraA_Ancho_3erLav_1").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1").val(),
        MuestraA_Ancho_1erLav_2: $("#txtMuestraA_Ancho_1erLav_2").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2").val(),
        MuestraA_Ancho_3erLav_2: $("#txtMuestraA_Ancho_3erLav_2").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2").val(),
        MuestraA_Ancho_1erLav_3: $("#txtMuestraA_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3").val(),
        MuestraA_Ancho_3erLav_3: $("#txtMuestraA_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3").val(),
        MuestraA_Largo_1erLav_1: $("#txtMuestraA_Largo_1erLav_1").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1").val(),
        MuestraA_Largo_3erLav_1: $("#txtMuestraA_Largo_3erLav_1").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1").val(),
        MuestraA_Largo_1erLav_2: $("#txtMuestraA_Largo_1erLav_2").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2").val(),
        MuestraA_Largo_3erLav_2: $("#txtMuestraA_Largo_3erLav_2").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2").val(),
        MuestraA_Largo_1erLav_3: $("#txtMuestraA_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3").val(),
        MuestraA_Largo_3erLav_3: $("#txtMuestraA_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3").val(),

        MuestraA_1erLav_AC: $("#txtMuestraA_1erLav_AC").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC").val(),
        MuestraA_1erLav_BD: $("#txtMuestraA_1erLav_BD").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD").val(),
        MuestraA_3erLav_AC: $("#txtMuestraA_3erLav_AC").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC").val(),
        MuestraA_3erLav_BD: $("#txtMuestraA_3erLav_BD").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD").val(),

        MuestraB_Ancho_1erLav_1: $("#txtMuestraB_Ancho_1erLav_1").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1").val(),
        MuestraB_Ancho_3erLav_1: $("#txtMuestraB_Ancho_3erLav_1").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1").val(),
        MuestraB_Ancho_1erLav_2: $("#txtMuestraB_Ancho_1erLav_2").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2").val(),
        MuestraB_Ancho_3erLav_2: $("#txtMuestraB_Ancho_3erLav_2").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2").val(),
        MuestraB_Ancho_1erLav_3: $("#txtMuestraB_Ancho_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3").val(),
        MuestraB_Ancho_3erLav_3: $("#txtMuestraB_Ancho_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3").val(),
        MuestraB_Largo_1erLav_1: $("#txtMuestraB_Largo_1erLav_1").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1").val(),
        MuestraB_Largo_3erLav_1: $("#txtMuestraB_Largo_3erLav_1").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1").val(),
        MuestraB_Largo_1erLav_2: $("#txtMuestraB_Largo_1erLav_2").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2").val(),
        MuestraB_Largo_3erLav_2: $("#txtMuestraB_Largo_3erLav_2").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2").val(),
        MuestraB_Largo_1erLav_3: $("#txtMuestraB_Largo_1erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3").val(),
        MuestraB_Largo_3erLav_3: $("#txtMuestraB_Largo_3erLav_3").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3").val(),

        MuestraB_1erLav_AC: $("#txtMuestraB_1erLav_AC").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC").val(),
        MuestraB_1erLav_BD: $("#txtMuestraB_1erLav_BD").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD").val(),
        MuestraB_3erLav_AC: $("#txtMuestraB_3erLav_AC").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC").val(),
        MuestraB_3erLav_BD: $("#txtMuestraB_3erLav_BD").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD").val(),


        MuestraA_Ancho_1erLav_1_EP: $("#txtMuestraA_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_EP").val(),
        MuestraA_Ancho_3erLav_1_EP: $("#txtMuestraA_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_EP").val(),
        MuestraA_Ancho_1erLav_2_EP: $("#txtMuestraA_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_EP").val(),
        MuestraA_Ancho_3erLav_2_EP: $("#txtMuestraA_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_EP").val(),
        MuestraA_Ancho_1erLav_3_EP: $("#txtMuestraA_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_EP").val(),
        MuestraA_Ancho_3erLav_3_EP: $("#txtMuestraA_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_EP").val(),
        MuestraA_Largo_1erLav_1_EP: $("#txtMuestraA_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_EP").val(),
        MuestraA_Largo_3erLav_1_EP: $("#txtMuestraA_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_EP").val(),
        MuestraA_Largo_1erLav_2_EP: $("#txtMuestraA_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_EP").val(),
        MuestraA_Largo_3erLav_2_EP: $("#txtMuestraA_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_EP").val(),
        MuestraA_Largo_1erLav_3_EP: $("#txtMuestraA_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_EP").val(),
        MuestraA_Largo_3erLav_3_EP: $("#txtMuestraA_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_EP").val(),

        MuestraA_1erLav_AC_EP: $("#txtMuestraA_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_EP").val(),
        MuestraA_1erLav_BD_EP: $("#txtMuestraA_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_EP").val(),
        MuestraA_3erLav_AC_EP: $("#txtMuestraA_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_EP").val(),
        MuestraA_3erLav_BD_EP: $("#txtMuestraA_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_EP").val(),

        MuestraB_Ancho_1erLav_1_EP: $("#txtMuestraB_Ancho_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_EP").val(),
        MuestraB_Ancho_3erLav_1_EP: $("#txtMuestraB_Ancho_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_EP").val(),
        MuestraB_Ancho_1erLav_2_EP: $("#txtMuestraB_Ancho_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_EP").val(),
        MuestraB_Ancho_3erLav_2_EP: $("#txtMuestraB_Ancho_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_EP").val(),
        MuestraB_Ancho_1erLav_3_EP: $("#txtMuestraB_Ancho_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_EP").val(),
        MuestraB_Ancho_3erLav_3_EP: $("#txtMuestraB_Ancho_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_EP").val(),
        MuestraB_Largo_1erLav_1_EP: $("#txtMuestraB_Largo_1erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_EP").val(),
        MuestraB_Largo_3erLav_1_EP: $("#txtMuestraB_Largo_3erLav_1_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_EP").val(),
        MuestraB_Largo_1erLav_2_EP: $("#txtMuestraB_Largo_1erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_EP").val(),
        MuestraB_Largo_3erLav_2_EP: $("#txtMuestraB_Largo_3erLav_2_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_EP").val(),
        MuestraB_Largo_1erLav_3_EP: $("#txtMuestraB_Largo_1erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_EP").val(),
        MuestraB_Largo_3erLav_3_EP: $("#txtMuestraB_Largo_3erLav_3_EP").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_EP").val(),

        MuestraB_1erLav_AC_EP: $("#txtMuestraB_1erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_EP").val(),
        MuestraB_1erLav_BD_EP: $("#txtMuestraB_1erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_EP").val(),
        MuestraB_3erLav_AC_EP: $("#txtMuestraB_3erLav_AC_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_EP").val(),
        MuestraB_3erLav_BD_EP: $("#txtMuestraB_3erLav_BD_EP").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_EP").val(),

        // HW 

        MuestraA_Ancho_1erLav_1_HW: $("#txtMuestraA_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_1_HW").val(),
        MuestraA_Ancho_3erLav_1_HW: $("#txtMuestraA_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_1_HW").val(),
        MuestraA_Ancho_1erLav_2_HW: $("#txtMuestraA_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_2_HW").val(),
        MuestraA_Ancho_3erLav_2_HW: $("#txtMuestraA_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_2_HW").val(),
        MuestraA_Ancho_1erLav_3_HW: $("#txtMuestraA_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_1erLav_3_HW").val(),
        MuestraA_Ancho_3erLav_3_HW: $("#txtMuestraA_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Ancho_3erLav_3_HW").val(),
        MuestraA_Largo_1erLav_1_HW: $("#txtMuestraA_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_1_HW").val(),
        MuestraA_Largo_3erLav_1_HW: $("#txtMuestraA_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_1_HW").val(),
        MuestraA_Largo_1erLav_2_HW: $("#txtMuestraA_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_2_HW").val(),
        MuestraA_Largo_3erLav_2_HW: $("#txtMuestraA_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_2_HW").val(),
        MuestraA_Largo_1erLav_3_HW: $("#txtMuestraA_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_1erLav_3_HW").val(),
        MuestraA_Largo_3erLav_3_HW: $("#txtMuestraA_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraA_Largo_3erLav_3_HW").val(),

        MuestraA_1erLav_AC_HW: $("#txtMuestraA_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_AC_HW").val(),
        MuestraA_1erLav_BD_HW: $("#txtMuestraA_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_1erLav_BD_HW").val(),
        MuestraA_3erLav_AC_HW: $("#txtMuestraA_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_AC_HW").val(),
        MuestraA_3erLav_BD_HW: $("#txtMuestraA_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraA_3erLav_BD_HW").val(),

        MuestraB_Ancho_1erLav_1_HW: $("#txtMuestraB_Ancho_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_1_HW").val(),
        MuestraB_Ancho_3erLav_1_HW: $("#txtMuestraB_Ancho_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_1_HW").val(),
        MuestraB_Ancho_1erLav_2_HW: $("#txtMuestraB_Ancho_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_2_HW").val(),
        MuestraB_Ancho_3erLav_2_HW: $("#txtMuestraB_Ancho_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_2_HW").val(),
        MuestraB_Ancho_1erLav_3_HW: $("#txtMuestraB_Ancho_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_1erLav_3_HW").val(),
        MuestraB_Ancho_3erLav_3_HW: $("#txtMuestraB_Ancho_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Ancho_3erLav_3_HW").val(),
        MuestraB_Largo_1erLav_1_HW: $("#txtMuestraB_Largo_1erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_1_HW").val(),
        MuestraB_Largo_3erLav_1_HW: $("#txtMuestraB_Largo_3erLav_1_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_1_HW").val(),
        MuestraB_Largo_1erLav_2_HW: $("#txtMuestraB_Largo_1erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_2_HW").val(),
        MuestraB_Largo_3erLav_2_HW: $("#txtMuestraB_Largo_3erLav_2_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_2_HW").val(),
        MuestraB_Largo_1erLav_3_HW: $("#txtMuestraB_Largo_1erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_1erLav_3_HW").val(),
        MuestraB_Largo_3erLav_3_HW: $("#txtMuestraB_Largo_3erLav_3_HW").val() == "" ? 0 : $("#txtMuestraB_Largo_3erLav_3_HW").val(),

        MuestraB_1erLav_AC_HW: $("#txtMuestraB_1erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_AC_HW").val(),
        MuestraB_1erLav_BD_HW: $("#txtMuestraB_1erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_1erLav_BD_HW").val(),
        MuestraB_3erLav_AC_HW: $("#txtMuestraB_3erLav_AC_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_AC_HW").val(),
        MuestraB_3erLav_BD_HW: $("#txtMuestraB_3erLav_BD_HW").val() == "" ? 0 : $("#txtMuestraB_3erLav_BD_HW").val(),

        AcrossChestOriginal: $("#txtAcrossChestOriginal").val(),
        AcrossChestOneCyle: $("#txtAcrossChestOneCyle").val(),
        AcrossChestThreeCyles: $("#txtAcrossChestThreeCyles").val(),
        BottomWidthOriginal: $("#txtBottomWidthOriginal").val(),
        BottomWidthOneCyle: $("#txtBottomWidthOneCyle").val(),
        BottomWidthThreeCyles: $("#txtBottomWidthThreeCyles").val(),
        BodyFromLenOriginal: $("#txtBodyFromLenOriginal").val(),
        BodyFromLeOneCyle: $("#txtBodyFromLeOneCyle").val(),
        BodyFromLeThreeCyles: $("#txtBodyFromLeThreeCyles").val(),
        SleeveLenOriginal: $("#txtSleeveLenOriginal").val(),
        SleeveLenOneCyle: $("#txtSleeveLenOneCyle").val(),
        SleeveLenThreeCyles: $("#txtSleeveLenThreeCyles").val(),
        WaistbandWidthHalfOriginal: $("#txtWaistbandWidthHalfOriginal").val(),
        WaistbandWidthHalfOneCyle: $("#txtWaistbandWidthHalfOneCyle").val(),
        WaistbandWidthHalfThreeCyles: $("#txtWaistbandWidthHalfThreeCyles").val(),
        LegOpeningHalfOriginal: $("#txtLegOpeningHalfOriginal").val(),
        LegOpeningHalfOneCyle: $("#txtLegOpeningHalfOneCyle").val(),
        LegOpeningHalfThreeCyles: $("#txtLegOpeningHalfThreeCyles").val(),
        OutseambelowOriginal: $("#txtOutseambelowOriginal").val(),
        OutseambelowOneCyle: $("#txtOutseambelowOneCyle").val(),
        OutseambelowThreeCyles: $("#txtOutseambelowThreeCyles").val(),
        InseamLenOriginal: $("#txtInseamLenOriginal").val(),
        InseamLenOneCyle: $("#txtInseamLenOneCyle").val(),
        InseamLenThreeCyles: $("#txtInseamLenThreeCyles").val(),

        EncogimientoLargo: $("#txtEncogimientoLargo").val(),
        EncogimientoAncho: $("#txtEncogimientoAncho").val(),
        Revirado: $("#txtRevirado").val(),
        Apariencia: $("#txtApariencia").val(),
        Pilling: $("#txtPilling").val(),
        EncogimientoStatus: $("#cboEncogimientoStatus").val(),
        ReviradoStatus: $("#cboReviradoStatus").val(),
        AparienciaStatus: $("#cboAparienciaStatus").val(),


        // EP 

        EncogimientoLargo_EP: $("#txtEncogimientoLargo_EP").val(),
        EncogimientoAncho_EP: $("#txtEncogimientoAncho_EP").val(),
        Revirado_EP: $("#txtRevirado_EP").val(),
        Apariencia_EP: $("#txtApariencia_EP").val(),
        Pilling_EP: $("#txtPilling_EP").val(),
        EncogimientoStatus_EP: $("#cboEncogimientoStatus_EP").val(),
        ReviradoStatus_EP: $("#cboReviradoStatus_EP").val(),

        EncogimientoLargo_HW: $("#txtEncogimientoLargo_HW").val(),
        EncogimientoAncho_HW: $("#txtEncogimientoAncho_HW").val(),
        Revirado_HW: $("#txtRevirado_HW").val(),
        Apariencia_HW: $("#txtApariencia_HW").val(),
        Pilling_HW: $("#txtPilling_HW").val(),
        EncogimientoStatus_HW: $("#cboEncogimientoStatus_HW").val(),
        ReviradoStatus_HW: $("#cboReviradoStatus_HW").val(),

        // FIN EP NUEVOS

        Densidad: $("#txtDensidad").val(),
        AnchoAcabado: $("#txtAnchoAcabado").val(),
        DensidadStatus: $("#cboDensidadStatus").val(),

        Seco: $("#txtSeco").val(),
        Humedo: $("#txtHumedo").val(),
        SolidezFroteStatus: $("#cboSolidezFroteStatus").val(),

        CambioColorSL: $("#txtCambioColorSL").val(),
        AcetatoSL: $("#txtAcetatoSL").val(),
        AlgodonSL: $("#txtAlgodonSL").val(),
        NylonSL: $("#txtNylonSL").val(),
        PoliesterSL: $("#txtPoliesterSL").val(),
        AcrilicoSL: $("#txtAcrilicoSL").val(),
        LanaSL: $("#txtLanaSL").val(),
        SilkSL: $("#txtSilkSL").val(),
        ViscosaSL: $("#txtViscosaSL").val(),
        EvaluacionAparienciaSL: $("#cboEvaluacionApariencia").val(),
        SolidezLavadoStatus: $("#cboSolidezLavadoStatus").val(),


        PillingResultado: $("#txtPillingResultado").val(),
        PillingMin: $("#txtPillingMin").val(),
        ResumenTestingPilling: $("#cboPillingStatus").val(),

        BurstingResultado: $("#txtBurstingResultado").val(),
        BurstingMin: $("#txtBurstingMin").val(),
        BurstingStatus: $("#cboBurstingStatus").val(),

        CambioColorST: $("#txtCambioColorST").val(),
        AcetatoST: $("#txtAcetatoST").val(),
        AlgodonST: $("#txtAlgodonST").val(),
        NylonST: $("#txtNylonST").val(),
        PoliesterST: $("#txtPoliesterST").val(),
        AcrilicoST: $("#txtAcrilicoST").val(),
        LanaST: $("#txtLanaST").val(),
        SilkST: $("#txtSilkST").val(),
        ViscosaST: $("#txtViscosaST").val(),
        SolidezTranspiracionStatus: $("#cboSolidezTranspiracionStatus").val(),

        CambioColorSA: $("#txtCambioColorSA").val(),
        AcetatoSA: $("#txtAcetatoSA").val(),
        AlgodonSA: $("#txtAlgodonSA").val(),
        NylonSA: $("#txtNylonSA").val(),
        PoliesterSA: $("#txtPoliesterSA").val(),
        AcrilicoSA: $("#txtAcrilicoSA").val(),
        LanaSA: $("#txtLanaSA").val(),
        SilkSA: $("#txtSilkSA").val(),
        ViscosaSA: $("#txtViscosaSA").val(),
        SolidezAguaStatus: $("#cboSolidezAguaStatus").val(),

        CambioColorBlanqueadorSinCloroSodiumPerborate: $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(),
        CambioColorBlanqueadorSinCloroHydrogenPeroxide: $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(),
        BlanqueadorSinClaroStatus: $("#cboBlanqueadorSinClaroStatus").val(),

        CambioColorBlanqueadorConCloro: $("#txtCambioColorBlanqueadorConCloro").val(),
        BlanqueadorConCloroStatus: $("#cboBlanqueadorConCloroStatus").val(),

        ResultadoPH: $("#txtResultadoPH").val(),
        RequeridoPH: $("#txtRequeridoPH").val(),
        PHStatus: $("#cboPHStatus").val(),

        WikingPulgadas: $("#txtWikingPulgadas").val(),
        WikingMinutes: $("#txtWikingMinutes").val(),
        WikingMin30Wales: $("#txtWikingMin30Wales").val(),
        WikingMin30Courses: $("#txtWikingMin30Courses").val(),
        WikingStatus: $("#cboWikingStatus").val(),

        // Almacenamiento

        CambioColorAlmacenamiento: $("#txtCambioColorAlmacenamiento").val(),
        AcetatoAlmacenamiento: $("#txtAcetatoAlmacenamiento").val(),
        AlgodonAlmacenamiento: $("#txtAlgodonAlmacenamiento").val(),
        NylonAlmacenamiento: $("#txtNylonAlmacenamiento").val(),
        SilkAlmacenamiento: $("#txtSilkAlmacenamiento").val(),
        PoliesterAlmacenamiento: $("#txtPoliesterAlmacenamiento").val(),
        AcrilicoAlmacenamiento: $("#txtAcrilicoAlmacenamiento").val(),
        LanaAlmacenamiento: $("#txtLanaAlmacenamiento").val(),
        ViscoseAlmacenamiento: $("#txtViscosaAlmacenamiento").val(),
        StainingWhiteCloth: $("#txtStainingWhiteCloth").val(),
        AlmacenamientoStatus: $("#cboAlmacenamientoStatus").val(),

        // Wicking Requerido

        //WickingRequerido: $("#txtWickingRequerido").val(),

        // Densidad y Ancho

        Muestra1Densidad: $("#txtMuestra1Densidad").val(),
        Muestra2Densidad: $("#txtMuestra2Densidad").val(),
        Muestra3Densidad: $("#txtMuestra3Densidad").val(),

        Muestra1Ancho: $("#txtMuestra1Ancho").val(),
        Muestra2Ancho: $("#txtMuestra2Ancho").val(),
        Muestra3Ancho: $("#txtMuestra3Ancho").val(),
        AprobadoComercial: $("#cboAprobadoComercial").val(),

        AcrossChestOneCycleChange: $("#txtAcrossChestOneCyleChange").val(),
        AcrossChestThreeCycleChange: $("#txtAcrossChestThreeCylesChange").val(),

        BottomWidthtOneCycleChange: $("#txtBottomWidthOneCyleChange").val(),
        BottomWidthThreeCycleChange: $("#txtBottomWidthThreeCylesChange").val(),

        BodyFromLenOneCycleChange: $("#txtBodyFromLeOneCyleChange").val(),
        BodyFromLenThreeCycleChange: $("#txtBodyFromLeThreeCylesChange").val(),

        SleeveLenOneCycleChange: $("#txtSleeveLenOneCyleChange").val(),
        SleeveLenThreeCycleChange: $("#txtSleeveLenThreeCylesChange").val(),

        WaistbandWidthHalfOneCycleChange: $("#txtWaistbandWidthHalfOneCyleChange").val(),
        WaistbandWidthHalfThreeCycleChange: $("#txtWaistbandWidthHalfThreeCylesChange").val(),

        LegOpeningHalfOneCycleChange: $("#txtLegOpeningHalfOneCyleChange").val(),
        LegOpeningHalfThreeCycleChange: $("#txtLegOpeningHalfThreeCylesChange").val(),

        OutseambelowOneCycleChange: $("#txtOutseambelowOneCyleChange").val(),
        OutseambelowThreeCycleChange: $("#txtOutseambelowThreeCylesChange").val(),

        InseamLenOneCycleChange: $("#txtInseamLenOneCyleChange").val(),
        InseamLenThreeCycleChange: $("#txtInseamLenThreeCylesChange").val(),

        CicloLavadora: $("input:radio[name ='radCicloLavadora']:checked").val(),
        TemperaturaLavado: $("input:radio[name ='radTemperaturaLavado']:checked").val(),
        ProcedimientoSecado: $("input:radio[name ='radProcedimientoSecado']:checked").val(),
        ProcedimientoSecadoTipo: $("input:radio[name ='radProcedimientoSecadoA']:checked").val(),
        SolidezLavadoCondiciones: $("input:radio[name ='radSolidezLavadoMetodos']:checked").val(),

        SeamTwistAA: $("#txtAABefore").val(),
        SeamTwistAB: $("#txtABBefore").val(),
        SeamTwistResultado: $("#txtSeamResultadoBefore").val(),

        SeamTwistAAAfter: $("#txtAAAfter").val(),
        SeamTwistABAfter: $("#txtABAfter").val(),
        SeamTwistResultadoAfter: $("#txtSeamResultadoAfter").val(),

        SeamTwistChange: $("#txtSeamChange").val(),


        SeamTwistStatus: $("#cboSeamTwistStatus").val(),

        UOM: $("#cboUOM").val(),

        GradeSA: $("#txtGradoSA").val(),

        EncogimientoStatusGarment: $("#cboEncogimientoGarmentStatus").val()

    };

    var frm = new FormData();

    var JsonString = JSON.stringify(objPartida).replace(/undefined/g, '');

    frm.append("par", JsonString);


    Post('Laboratorio/Partida/SaveTest', frm, Alerta);
}
*/

/*
function LoadTestPartida(data) {

    if (data != "") {

        var Partida = JSON.parse(data)[0];

        if (Partida != "") {

            $("#hfCodigoPartida").val(Partida.CodigoPartida);

            $("#txtReporteTecnico").val(Partida.ReporteTecnico);
            $("#txtPartida").val(Partida.NumeroPartida);
            $("#txtReporteTecnico").val(Partida.ReporteTecnico);
            $("#txtCodigoTela").val(Partida.CodigoTela);
            $("#txtFabrica").val(Partida.NombreFabrica);
            $("#txtCliente").val(Partida.NombreCliente);
            $("#txtColor").val(Partida.NombreColor);
            $("#cboPrueba").val(Partida.TipoPrueba);
            $("#cboPartidaStatus").val(Partida.StatusPartida);

            // Comentarios
            $("#txtComentarioColor").val(Partida.ComentarioColor);
            $("#txtComentarioTesting").val(Partida.ComentarioTesting);
            $("#txtInstruccionesCuidado").val(Partida.InstruccionCuidado);

            //Estabilidad Dimensional 

            if (Partida.TipoPrueba == "f" || Partida.TipoPrueba == "p" || Partida.TipoPrueba == "d" || Partida.TipoPrueba == "m" || Partida.TipoPrueba == "pp") {
                $("#divEstabilidadDimensional").show();
                $("#divEstabilidadDimensionalGarment").hide();
            } else {
                $("#divEstabilidadDimensional").hide();
                $("#divEstabilidadDimensional_EP").hide();
                $("#divEstabilidadDimensional_HW").hide();

            }


            // Ocultando Pruebas segun Tipo de Prueba

            if (Partida.TipoPrueba == "p" || Partida.TipoPrueba == "gp") { // Produccion Tela o Produccion Prenda
                $("#divResistenciaPilling").remove();
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "m") {  // Muestra Tela              
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }

            if (Partida.TipoPrueba == "d") { // Desarrollo Tela  
                $("#divSolidezFrote").remove();
                $("#divSolidezLavado").remove();
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }


            if (Partida.TipoPrueba == "pp") {
                $("#divSolidezTranspiracion").remove();
                $("#divSolidezAgua").remove();
                $("#divAlmacenamiento").remove();
                $("#divBlanqueadorSinCloro").remove();
                $("#divBlanqueadorConCloro").remove();
                $("#divPHValue").remove();
                $("#divWicking").remove();
            }


            // Falta Garment Instruccion de Cuidado

            $("#txtEncogimientoLargo").val(Partida.EncogimientoLargo);
            $("#txtEncogimientoAncho").val(Partida.EncogimientoAncho);
            $("#txtRevirado").val(Partida.Revirado);
            $("#txtApariencia").val(Partida.Apariencia);
            $("#txtPilling").val(Partida.GradoPilling);
            $("#cboEncogimientoStatus").val(Partida.EncogimientoStatus.toString());
            $("#cboReviradoStatus").val(Partida.ReviradoStatus.toString());
            $("#cboAparienciaStatus").val(Partida.AparienciaStatus.toString());

            //Densidad de Tela

            $("#txtDensidad").val(Partida.Densidad);
            $("#txtAnchoAcabado").val(Partida.AnchoAcabado);


            if (Partida.GramajeAcabado != "") {
                $("#hdGramajeAcabado").val(Partida.GramajeAcabado);
            }

            if (Partida.Densidad != "") {
                var Densidad = parseFloat(Partida.Densidad);
                var GramajeAcabado = parseFloat(Partida.GramajeAcabado);
                var Desviacion = (((Densidad - GramajeAcabado) / GramajeAcabado) * 100).toFixed(1);

                if (Desviacion != "NaN") {
                    $("#txtDesviacion").val(Desviacion);
                }

            }
            $("#cboDensidadStatus").val(Partida.DensidadStatus.toString());

            //Solidez al frote

            $("#txtSeco").val(Partida.Seco);
            $("#txtHumedo").val(Partida.Humedo);
            $("#cboSolidezFroteStatus").val(Partida.SolidezFroteStatus.toString());

            // Solidez al lavado

            $("#txtCambioColorSL").val(Partida.CambioColorSL);
            $("#txtNylonSL").val(Partida.NylonSL);
            $("#txtAcrilicoSL").val(Partida.AcrilicoSL);

            $("#txtAcetatoSL").val(Partida.AcetatoSL);
            $("#txtSilkSL").val(Partida.SilkSL);
            $("#txtLanaSL").val(Partida.LanaSL);

            $("#txtAlgodonSL").val(Partida.AlgodonSL);
            $("#txtPoliesterSL").val(Partida.PoliesterSL);
            $("#txtViscosaSL").val(Partida.ViscosaSL);

            $("#cboEvaluacionApariencia").val(Partida.EvaluacionAparienciaSL);
            $("#cboSolidezLavadoStatus").val(Partida.SolidezLavadoStatus.toString());

            //Resistencia al Pilling

            $("#txtPillingResultado").val(Partida.PillingResultado);
            $("#txtPillingMin").val(Partida.PillingMin);
            $("#cboPillingStatus").val(Partida.ResistenciaPillingStatus.toString());

            //Bursting

            $("#txtBurstingResultado").val(Partida.BurstingResultado);
            $("#txtBurstingMin").val(Partida.BurstingMin);
            $("#cboBurstingStatus").val(Partida.BurstingStatus.toString());

            //Solidez a la Transpiracion

            $("#txtCambioColorST").val(Partida.CambioColorST);
            $("#txtNylonST").val(Partida.NylonST);
            $("#txtAcrilicoST").val(Partida.AcrilicoST);

            $("#txtAcetatoST").val(Partida.AcetatoST);
            $("#txtSilkST").val(Partida.SilkST);
            $("#txtLanaST").val(Partida.LanaST);

            $("#txtAlgodonST").val(Partida.AlgodonST);
            $("#txtPoliesterST").val(Partida.PoliesterST);
            $("#txtViscosaST").val(Partida.ViscosaST);

            $("#cboSolidezTranspiracionStatus").val(Partida.SolidezTranspiracionStatus.toString());

            //Solidez al Agua

            $("#txtCambioColorSA").val(Partida.CambioColorSA);
            $("#txtNylonSA").val(Partida.NylonSA);
            $("#txtAcrilicoSA").val(Partida.AcrilicoSA);

            $("#txtAcetatoSA").val(Partida.AcetatoSA);
            $("#txtSilkSA").val(Partida.SilkSA);
            $("#txtLanaSA").val(Partida.LanaSA);

            $("#txtAlgodonSA").val(Partida.AlgodonSA);
            $("#txtPoliesterSA").val(Partida.PoliesterSA);
            $("#txtViscosaSA").val(Partida.ViscosaSA);

            $("#cboSolidezAguaStatus").val(Partida.SolidezAguaStatus.toString());


            //Blanqueador sin Cloro

            $("#txtCambioColorBlanqueadorSinCloroSodiumPerborate").val(Partida.CambioColorBlanqueadorSinCloroSodiumPerborate);
            $("#txtCambioColorBlanqueadorSinCloroHydrogenPeroxide").val(Partida.CambioColorBlanqueadorSinCloroHydrogenPeroxide);
            $("#cboBlanqueadorSinClaroStatus").val(Partida.BlanqueadorSinClaroStatus.toString());

            //Blanqueador con Cloro

            $("#txtCambioColorBlanqueadorConCloro").val(Partida.CambioColorBlanqueadorConCloro);
            $("#cboBlanqueadorConCloroStatus").val(Partida.BlanqueadorConCloroStatus.toString());

            //PH Value
            $("#txtResultadoPH").val(Partida.ResultadoPH);
            $("#txtRequeridoPH").val(Partida.RequeridoPH);
            $("#cboPHStatus").val(Partida.PHStatus.toString());

            //Wicking

            $("#txtWikingPulgadas").val(Partida.WikingPulgadas);
            $("#txtWikingMin30Wales").val(Partida.Wales30Wiking);
            $("#txtWikingMinutes").val(Partida.WikingMinutos);
            $("#txtWikingMin30Courses").val(Partida.Courses30Wiking);
            $("#cboWikingStatus").val(Partida.WikingStatus.toString());

            $("#txtMuestraA_Ancho_1erLav_1").val(Partida.MuestraA_Ancho_1erLav_1);
            $("#txtMuestraA_Ancho_3erLav_1").val(Partida.MuestraA_Ancho_3erLav_1);
            $("#txtMuestraA_Largo_1erLav_1").val(Partida.MuestraA_Largo_1erLav_1);
            $("#txtMuestraA_Largo_3erLav_1").val(Partida.MuestraA_Largo_3erLav_1);

            $("#txtMuestraA_1erLav_AC").val(Partida.MuestraA_1erLav_AC);
            $("#txtMuestraA_1erLav_BD").val(Partida.MuestraA_1erLav_BD);
            $("#txtMuestraA_3erLav_AC").val(Partida.MuestraA_3erLav_AC);
            $("#txtMuestraA_3erLav_BD").val(Partida.MuestraA_3erLav_BD);

            $("#txtMuestraB_Ancho_1erLav_1").val(Partida.MuestraB_Ancho_1erLav_1);
            $("#txtMuestraB_Ancho_3erLav_1").val(Partida.MuestraB_Ancho_3erLav_1);
            $("#txtMuestraB_Largo_1erLav_1").val(Partida.MuestraB_Largo_1erLav_1);
            $("#txtMuestraB_Largo_3erLav_1").val(Partida.MuestraB_Largo_3erLav_1);

            $("#txtMuestraB_1erLav_AC").val(Partida.MuestraB_1erLav_AC);
            $("#txtMuestraB_1erLav_BD").val(Partida.MuestraB_1erLav_BD);
            $("#txtMuestraB_3erLav_AC").val(Partida.MuestraB_3erLav_AC);
            $("#txtMuestraB_3erLav_BD").val(Partida.MuestraB_3erLav_BD);



            $("#txtMuestraA_Ancho_1erLav_2").val(Partida.MuestraA_Ancho_1erLav_2);
            $("#txtMuestraA_Ancho_3erLav_2").val(Partida.MuestraA_Ancho_3erLav_2);
            $("#txtMuestraA_Largo_1erLav_2").val(Partida.MuestraA_Largo_1erLav_2);
            $("#txtMuestraA_Largo_3erLav_2").val(Partida.MuestraA_Largo_3erLav_2);

            $("#txtMuestraB_Ancho_1erLav_2").val(Partida.MuestraB_Ancho_1erLav_2);
            $("#txtMuestraB_Ancho_3erLav_2").val(Partida.MuestraB_Ancho_3erLav_2);
            $("#txtMuestraB_Largo_1erLav_2").val(Partida.MuestraB_Largo_1erLav_2);
            $("#txtMuestraB_Largo_3erLav_2").val(Partida.MuestraB_Largo_3erLav_2);


            $("#txtMuestraA_Ancho_1erLav_3").val(Partida.MuestraA_Ancho_1erLav_3);
            $("#txtMuestraA_Ancho_3erLav_3").val(Partida.MuestraA_Ancho_3erLav_3);
            $("#txtMuestraA_Largo_1erLav_3").val(Partida.MuestraA_Largo_1erLav_3);
            $("#txtMuestraA_Largo_3erLav_3").val(Partida.MuestraA_Largo_3erLav_3);

            $("#txtMuestraB_Ancho_1erLav_3").val(Partida.MuestraB_Ancho_1erLav_3);
            $("#txtMuestraB_Ancho_3erLav_3").val(Partida.MuestraB_Ancho_3erLav_3);
            $("#txtMuestraB_Largo_1erLav_3").val(Partida.MuestraB_Largo_1erLav_3);
            $("#txtMuestraB_Largo_3erLav_3").val(Partida.MuestraB_Largo_3erLav_3);

            // EP Estabilidad 

            $("#txtMuestraA_Ancho_1erLav_1_EP").val(Partida.MuestraA_Ancho_1erLav_1_EP);
            $("#txtMuestraA_Ancho_3erLav_1_EP").val(Partida.MuestraA_Ancho_3erLav_1_EP);
            $("#txtMuestraA_Largo_1erLav_1_EP").val(Partida.MuestraA_Largo_1erLav_1_EP);
            $("#txtMuestraA_Largo_3erLav_1_EP").val(Partida.MuestraA_Largo_3erLav_1_EP);

            $("#txtMuestraA_1erLav_AC_EP").val(Partida.MuestraA_1erLav_AC_EP);
            $("#txtMuestraA_1erLav_BD_EP").val(Partida.MuestraA_1erLav_BD_EP);
            $("#txtMuestraA_3erLav_AC_EP").val(Partida.MuestraA_3erLav_AC_EP);
            $("#txtMuestraA_3erLav_BD_EP").val(Partida.MuestraA_3erLav_BD_EP);

            $("#txtMuestraB_Ancho_1erLav_1_EP").val(Partida.MuestraB_Ancho_1erLav_1_EP);
            $("#txtMuestraB_Ancho_3erLav_1_EP").val(Partida.MuestraB_Ancho_3erLav_1_EP);
            $("#txtMuestraB_Largo_1erLav_1_EP").val(Partida.MuestraB_Largo_1erLav_1_EP);
            $("#txtMuestraB_Largo_3erLav_1_EP").val(Partida.MuestraB_Largo_3erLav_1_EP);

            $("#txtMuestraB_1erLav_AC_EP").val(Partida.MuestraB_1erLav_AC_EP);
            $("#txtMuestraB_1erLav_BD_EP").val(Partida.MuestraB_1erLav_BD_EP);
            $("#txtMuestraB_3erLav_AC_EP").val(Partida.MuestraB_3erLav_AC_EP);
            $("#txtMuestraB_3erLav_BD_EP").val(Partida.MuestraB_3erLav_BD_EP);

            $("#txtMuestraA_Ancho_1erLav_2_EP").val(Partida.MuestraA_Ancho_1erLav_2_EP);
            $("#txtMuestraA_Ancho_3erLav_2_EP").val(Partida.MuestraA_Ancho_3erLav_2_EP);
            $("#txtMuestraA_Largo_1erLav_2_EP").val(Partida.MuestraA_Largo_1erLav_2_EP);
            $("#txtMuestraA_Largo_3erLav_2_EP").val(Partida.MuestraA_Largo_3erLav_2_EP);

            $("#txtMuestraB_Ancho_1erLav_2_EP").val(Partida.MuestraB_Ancho_1erLav_2_EP);
            $("#txtMuestraB_Ancho_3erLav_2_EP").val(Partida.MuestraB_Ancho_3erLav_2_EP);
            $("#txtMuestraB_Largo_1erLav_2_EP").val(Partida.MuestraB_Largo_1erLav_2_EP);
            $("#txtMuestraB_Largo_3erLav_2_EP").val(Partida.MuestraB_Largo_3erLav_2_EP);


            $("#txtMuestraA_Ancho_1erLav_3_EP").val(Partida.MuestraA_Ancho_1erLav_3_EP);
            $("#txtMuestraA_Ancho_3erLav_3_EP").val(Partida.MuestraA_Ancho_3erLav_3_EP);
            $("#txtMuestraA_Largo_1erLav_3_EP").val(Partida.MuestraA_Largo_1erLav_3_EP);
            $("#txtMuestraA_Largo_3erLav_3_EP").val(Partida.MuestraA_Largo_3erLav_3_EP);

            $("#txtMuestraB_Ancho_1erLav_3_EP").val(Partida.MuestraB_Ancho_1erLav_3_EP);
            $("#txtMuestraB_Ancho_3erLav_3_EP").val(Partida.MuestraB_Ancho_3erLav_3_EP);
            $("#txtMuestraB_Largo_1erLav_3_EP").val(Partida.MuestraB_Largo_1erLav_3_EP);
            $("#txtMuestraB_Largo_3erLav_3_EP").val(Partida.MuestraB_Largo_3erLav_3_EP);

            $("#txtEncogimientoLargo_EP").val(Partida.EncogimientoLargo_EP);
            $("#txtEncogimientoAncho_EP").val(Partida.EncogimientoAncho_EP);
            $("#txtRevirado_EP").val(Partida.Revirado_EP);
            $("#txtApariencia_EP").val(Partida.Apariencia_EP);
            $("#txtPilling_EP").val(Partida.Pilling_EP);
            $("#cboEncogimientoStatus_EP").val(Partida.EncogimientoStatus_EP.toString());
            $("#cboReviradoStatus_EP").val(Partida.ReviradoStatus_EP.toString());


            // Fin EP

            // HW Estabilidad 

            $("#txtMuestraA_Ancho_1erLav_1_HW").val(Partida.MuestraA_Ancho_1erLav_1_HW);
            $("#txtMuestraA_Ancho_3erLav_1_HW").val(Partida.MuestraA_Ancho_3erLav_1_HW);
            $("#txtMuestraA_Largo_1erLav_1_HW").val(Partida.MuestraA_Largo_1erLav_1_HW);
            $("#txtMuestraA_Largo_3erLav_1_HW").val(Partida.MuestraA_Largo_3erLav_1_HW);

            $("#txtMuestraA_1erLav_AC_HW").val(Partida.MuestraA_1erLav_AC_HW);
            $("#txtMuestraA_1erLav_BD_HW").val(Partida.MuestraA_1erLav_BD_HW);
            $("#txtMuestraA_3erLav_AC_HW").val(Partida.MuestraA_3erLav_AC_HW);
            $("#txtMuestraA_3erLav_BD_HW").val(Partida.MuestraA_3erLav_BD_HW);

            $("#txtMuestraB_Ancho_1erLav_1_HW").val(Partida.MuestraB_Ancho_1erLav_1_HW);
            $("#txtMuestraB_Ancho_3erLav_1_HW").val(Partida.MuestraB_Ancho_3erLav_1_HW);
            $("#txtMuestraB_Largo_1erLav_1_HW").val(Partida.MuestraB_Largo_1erLav_1_HW);
            $("#txtMuestraB_Largo_3erLav_1_HW").val(Partida.MuestraB_Largo_3erLav_1_HW);

            $("#txtMuestraB_1erLav_AC_HW").val(Partida.MuestraB_1erLav_AC_HW);
            $("#txtMuestraB_1erLav_BD_HW").val(Partida.MuestraB_1erLav_BD_HW);
            $("#txtMuestraB_3erLav_AC_HW").val(Partida.MuestraB_3erLav_AC_HW);
            $("#txtMuestraB_3erLav_BD_HW").val(Partida.MuestraB_3erLav_BD_HW);

            $("#txtMuestraA_Ancho_1erLav_2_HW").val(Partida.MuestraA_Ancho_1erLav_2_HW);
            $("#txtMuestraA_Ancho_3erLav_2_HW").val(Partida.MuestraA_Ancho_3erLav_2_HW);
            $("#txtMuestraA_Largo_1erLav_2_HW").val(Partida.MuestraA_Largo_1erLav_2_HW);
            $("#txtMuestraA_Largo_3erLav_2_HW").val(Partida.MuestraA_Largo_3erLav_2_HW);

            $("#txtMuestraB_Ancho_1erLav_2_HW").val(Partida.MuestraB_Ancho_1erLav_2_HW);
            $("#txtMuestraB_Ancho_3erLav_2_HW").val(Partida.MuestraB_Ancho_3erLav_2_HW);
            $("#txtMuestraB_Largo_1erLav_2_HW").val(Partida.MuestraB_Largo_1erLav_2_HW);
            $("#txtMuestraB_Largo_3erLav_2_HW").val(Partida.MuestraB_Largo_3erLav_2_HW);


            $("#txtMuestraA_Ancho_1erLav_3_HW").val(Partida.MuestraA_Ancho_1erLav_3_HW);
            $("#txtMuestraA_Ancho_3erLav_3_HW").val(Partida.MuestraA_Ancho_3erLav_3_HW);
            $("#txtMuestraA_Largo_1erLav_3_HW").val(Partida.MuestraA_Largo_1erLav_3_HW);
            $("#txtMuestraA_Largo_3erLav_3_HW").val(Partida.MuestraA_Largo_3erLav_3_HW);

            $("#txtMuestraB_Ancho_1erLav_3_HW").val(Partida.MuestraB_Ancho_1erLav_3_HW);
            $("#txtMuestraB_Ancho_3erLav_3_HW").val(Partida.MuestraB_Ancho_3erLav_3_HW);
            $("#txtMuestraB_Largo_1erLav_3_HW").val(Partida.MuestraB_Largo_1erLav_3_HW);
            $("#txtMuestraB_Largo_3erLav_3_HW").val(Partida.MuestraB_Largo_3erLav_3_HW);

            $("#txtEncogimientoLargo_HW").val(Partida.EncogimientoLargo_HW);
            $("#txtEncogimientoAncho_HW").val(Partida.EncogimientoAncho_HW);
            $("#txtRevirado_HW").val(Partida.Revirado_HW);
            $("#txtApariencia_HW").val(Partida.Apariencia_HW);
            $("#txtPilling_HW").val(Partida.Pilling_HW);
            $("#cboEncogimientoStatus_HW").val(Partida.EncogimientoStatus_HW.toString());
            $("#cboReviradoStatus_HW").val(Partida.ReviradoStatus_HW.toString());

            // Fin HW



            $("#txtAcrossChestOriginal").val(Partida.AcrossChestOriginal);
            $("#txtAcrossChestOneCyle").val(Partida.AcrossChestOneCyle);
            $("#txtAcrossChestOneCyleChange").val(Partida.AcrossChestOneCyleChange); //Aplicar Formula
            $("#txtAcrossChestThreeCyles").val(Partida.AcrossChestThreeCyles);
            $("#txtAcrossChestThreeCylesChange").val(Partida.AcrossChestThreeCylesChange); //Aplicar Formula


            $("#txtBottomWidthOriginal").val(Partida.BottomWidthOriginal);
            $("#txtBottomWidthOneCyle").val(Partida.BottomWidthOneCyle);
            $("#txtBottomWidthOneCyleChange").val(Partida.BottomWidthOneCyleChange); //Aplicar Formula
            $("#txtBottomWidthThreeCyles").val(Partida.BottomWidthThreeCyles);
            $("#txtBottomWidthThreeCylesChange").val(Partida.BottomWidthThreeCylesChange); //Aplicar Formula


            $("#txtBodyFromLenOriginal").val(Partida.BodyFromLenOriginal);
            $("#txtBodyFromLeOneCyle").val(Partida.BodyFromLeOneCyle);
            $("#txtBodyFromLeOneCyleChange").val(Partida.BodyFromLeOneCyleChange); //Aplicar Formula
            $("#txtBodyFromLeThreeCyles").val(Partida.BodyFromLeThreeCyles);
            $("#txtBodyFromLeThreeCylesChange").val(Partida.BodyFromLeThreeCylesChange); //Aplicar Formula


            $("#txtSleeveLenOriginal").val(Partida.SleeveLenOriginal);
            $("#txtSleeveLenOneCyle").val(Partida.SleeveLenOneCyle);
            $("#txtSleeveLenOneCyleChange").val(Partida.SleeveLenOneCyleChange); //Aplicar Formula
            $("#txtSleeveLenThreeCyles").val(Partida.SleeveLenThreeCyles);
            $("#txtSleeveLenThreeCylesChange").val(Partida.SleeveLenThreeCylesChange); //Aplicar Formula


            $("#txtWaistbandWidthHalfOriginal").val(Partida.WaistbandWidthHalfOriginal);
            $("#txtWaistbandWidthHalfOneCyle").val(Partida.WaistbandWidthHalfOneCyle);
            $("#txtWaistbandWidthHalfOneCyleChange").val(Partida.WaistbandWidthHalfOneCyleChange); //Aplicar Formula
            $("#txtWaistbandWidthHalfThreeCyles").val(Partida.WaistbandWidthHalfThreeCyles);
            $("#txtWaistbandWidthHalfThreeCylesChange").val(Partida.WaistbandWidthHalfThreeCylesChange); //Aplicar Formula


            $("#txtLegOpeningHalfOriginal").val(Partida.LegOpeningHalfOriginal);
            $("#txtLegOpeningHalfOneCyle").val(Partida.LegOpeningHalfOneCyle);
            $("#txtLegOpeningHalfOneCyleChange").val(Partida.LegOpeningHalfOneCyleChange); //Aplicar Formula
            $("#txtLegOpeningHalfThreeCyles").val(Partida.LegOpeningHalfThreeCyles);
            $("#txtLegOpeningHalfThreeCylesChange").val(Partida.LegOpeningHalfThreeCylesChange); //Aplicar Formula


            $("#txtOutseambelowOriginal").val(Partida.OutseambelowOriginal);
            $("#txtOutseambelowOneCyle").val(Partida.OutseambelowOneCyle);
            $("#txtOutseambelowOneCyleChange").val(Partida.OutseambelowOneCyleChange); //Aplicar Formula
            $("#txtOutseambelowThreeCyles").val(Partida.OutseambelowThreeCyles);
            $("#txtOutseambelowThreeCylesChange").val(Partida.OutseambelowThreeCylesChange); //Aplicar Formula


            $("#txtInseamLenOriginal").val(Partida.InseamLenOriginal);
            $("#txtInseamLenOneCyle").val(Partida.InseamLenOneCyle);
            $("#txtInseamLenOneCyleChange").val(Partida.InseamLenOneCyleChange); //Aplicar Formula
            $("#txtInseamLenThreeCyles").val(Partida.InseamLenThreeCyles);
            $("#txtInseamLenThreeCylesChange").val(Partida.InseamLenThreeCylesChange); //Aplicar Formula


            // Almacenamiento

            $("#txtCambioColorAlmacenamiento").val(Partida.CambioColorAlmacenamiento);
            $("#txtNylonAlmacenamiento").val(Partida.NylonAlmacenamiento);
            $("#txtAcrilicoAlmacenamiento").val(Partida.AcrilicoAlmacenamiento);

            $("#txtAcetatoAlmacenamiento").val(Partida.AcetatoAlmacenamiento);
            $("#txtSilkAlmacenamiento").val(Partida.SilkAlmacenamiento);
            $("#txtLanaAlmacenamiento").val(Partida.LanaAlmacenamiento);

            $("#txtAlgodonAlmacenamiento").val(Partida.AlgodonAlmacenamiento);
            $("#txtPoliesterAlmacenamiento").val(Partida.PoliesterAlmacenamiento);
            $("#txtViscosaAlmacenamiento").val(Partida.ViscoseAlmacenamiento);
            $("#txtStainingWhiteCloth").val(Partida.StainingWhiteCloth);

            $("#cboAlmacenamientoStatus").val(Partida.AlmacenamientoStatus.toString());

            //$("#txtWickingRequerido").val(Partida.WickingRequerido);


            $("#txtMuestra1Densidad").val(Partida.Muestra1Densidad);
            $("#txtMuestra2Densidad").val(Partida.Muestra2Densidad);
            $("#txtMuestra3Densidad").val(Partida.Muestra3Densidad);

            $("#txtMuestra1Ancho").val(Partida.Muestra1Ancho);
            $("#txtMuestra2Ancho").val(Partida.Muestra2Ancho);

            $("#txtMuestra3Ancho").val(Partida.Muestra3Ancho);


            $("#cboAprobadoComercial").val(Partida.AprobadoComercial);

            $("#txtDescripcionTela").val(Partida.DescripcionTela);


            //Prendas y Metodos

            $("#txtAcrossChestOneCyleChange").val(Partida.AcrossChestOneCycleChange);
            $("#txtAcrossChestThreeCylesChange").val(Partida.AcrossChestThreeCycleChange);

            $("#txtBottomWidthOneCyleChange").val(Partida.BottomWidthtOneCycleChange);
            $("#txtBottomWidthThreeCylesChange").val(Partida.BottomWidthThreeCycleChange);

            $("#txtBodyFromLeOneCyleChange").val(Partida.BodyFromLenOneCycleChange);
            $("#txtBodyFromLeThreeCylesChange").val(Partida.BodyFromLenThreeCycleChange);

            $("#txtSleeveLenOneCyleChange").val(Partida.SleeveLenOneCycleChange);
            $("#txtSleeveLenThreeCylesChange").val(Partida.SleeveLenThreeCycleChange);

            $("#txtWaistbandWidthHalfOneCyleChange").val(Partida.WaistbandWidthHalfOneCycleChange);
            $("#txtWaistbandWidthHalfThreeCylesChange").val(Partida.WaistbandWidthHalfThreeCycleChange);

            $("#txtLegOpeningHalfOneCyleChange").val(Partida.LegOpeningHalfOneCycleChange);
            $("#txtLegOpeningHalfThreeCylesChange").val(Partida.LegOpeningHalfThreeCycleChange);

            $("#txtOutseambelowOneCyleChange").val(Partida.OutseambelowOneCycleChange);
            $("#txtOutseambelowThreeCylesChange").val(Partida.OutseambelowThreeCycleChange);

            $("#txtInseamLenOneCyleChange").val(Partida.InseamLenOneCycleChange);
            $("#txtInseamLenThreeCylesChange").val(Partida.InseamLenThreeCycleChange);

            $("input:radio[name ='radCicloLavadora']").each(function () {
                if ($(this).val() == Partida.CicloLavadora) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radTemperaturaLavado']").each(function () {
                if ($(this).val() == Partida.TemperaturaLavado) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radProcedimientoSecado']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecado) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radProcedimientoSecadoA']").each(function () {
                if ($(this).val() == Partida.ProcedimientoSecadoTipo) {
                    this.checked = true;
                    return false;
                }
            });

            $("input:radio[name ='radSolidezLavadoMetodos']").each(function () {
                if ($(this).val() == Partida.SolidezLavadoCondiciones) {
                    this.checked = true;
                    return false;
                }
            });

            $("#txtAABefore").val(Partida.SeamTwistAA);
            $("#txtABBefore").val(Partida.SeamTwistAB);
            $("#txtSeamResultadoBefore").val(Partida.SeamTwistResultado);


            $("#txtAAAfter").val(Partida.SeamTwistAAAfter);
            $("#txtABAfter").val(Partida.SeamTwistABAfter);
            $("#txtSeamResultadoAfter").val(Partida.SeamTwistResultadoAfter);

            $("#txtSeamChange").val(Partida.SeamTwistChange);

            $("#cboSeamTwistStatus").val(Partida.SeamTwistStatus.toString());


            $("#cboUOM").val(Partida.UOM);

            $("#txtGradoSA").val(Partida.GradeSA);

            $("#cboEncogimientoGarmentStatus").val(Partida.EncogimientoStatusGarment.toString());

        }
    }

}
*/

function CalcularPorcentajeCambioPrenda(target, id_valor1, id_valor2) {


    var valor1 = $("#" + id_valor1).val();
    var valor2 = $("#" + id_valor2).val();


    var valor1_number = 0.00;
    var valor2_number = 0.00;

    valor1_number = math.fraction(valor1);
    valor2_number = math.fraction(valor2);

    if (!isNaN(valor1_number) && !isNaN(valor2_number)) {
        valor1_number = ((valor2_number - valor1_number) / valor1_number) * 100;


        $("#" + target).val(valor1_number.toFixed(1));
    }



}

function CalcularDensidad() {

    var Muestra1 = $("#txtMuestra1Densidad").val();
    var Muestra2 = $("#txtMuestra2Densidad").val();
    var Muestra3 = $("#txtMuestra3Densidad").val();

    var Densidad = (parseFloat(Muestra1) + parseFloat(Muestra2) + parseFloat(Muestra3)) / 3;

    if (!isNaN(Densidad)) {
        $("#txtDensidad").val(Densidad.toFixed(1));
        CalcularDesviacion();
    }

}

function CalcularAncho() {

    var Muestra1 = $("#txtMuestra1Ancho").val();
    var Muestra2 = $("#txtMuestra2Ancho").val();
    var Muestra3 = $("#txtMuestra3Ancho").val();

    var Ancho = (parseFloat(Muestra1) + parseFloat(Muestra2) + parseFloat(Muestra3)) / 3;

    if (!isNaN(Ancho)) {
        $("#txtAnchoAcabado").val(Ancho.toFixed(2));
    }

}

function DigitosEnteroBlur(obj) {
    var value = obj.value;
    if (isNaN(value)) {
        obj.value = "0";
        return;
    }
}

//function ObtenerMetodo() {
//    alert($("input:radio[name ='radCicloLavadora']:checked").val());
//    alert($("input:radio[name ='radTemperaturaLavado']:checked").val());
//    alert($("input:radio[name ='radProcedimientoSecado']:checked").val());
//    alert($("input:radio[name ='radProcedimientoSecadoA']:checked").val());
//}

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

function DigitimosDecimalesConNegativo(e, field) {

    key = e.keyCode ? e.keyCode : e.which

    // backspace
    if (key == 8) return true
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value))
    }
    // .
    if (key == 46) {
        regexp = /^[0-9]+$/

        if (field.value.includes(".")) {
            return false;
        } else {
            return true;
        }
    }
    // -
    if (key == 45) {
        return true;
    }

    // other key
    return false;
}

function DigitosFracciones(e, field) {
    key = e.keyCode ? e.keyCode : e.which;
    //alert(key);
    // backspace
    if (key == 8) return true;
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value));
    }
    // .
    if (key == 46) {
        regexp = /^[0-9]+$/
        return regexp.test(field.value);
    }
    // -
    if (key == 45) {
        return true;
    }

    // space 
    if (key == 32) {
        return true;
    }

    // slash /
    if (key == 47) {
        return true;
    }



    return false;
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
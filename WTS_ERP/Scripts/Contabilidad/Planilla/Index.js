var ovariables = {
    strJSONData: '',
    document: '',
    period: '',
    iddocument: '1'
}

function load() {
    $('.footable').footable();
    _('btnNew').addEventListener('click', fn_new);
    _('cboDocumento').addEventListener('change', fn_load_period);
}

//Generales

function fn_refresh() {
    let urlaccion = 'Contabilidad/Planilla/Index',
        urljs = 'Contabilidad/Planilla/Index';
    _Go_Url(urlaccion, urljs);
}

// Nueva Planilla
function fn_new() {

    let array = ovariables.period;
    let regExist = false;

    if (array != '') {
        regExist = array.some(x=> {
            if (x.archivoPDF !== 2) {
                return true;
            }
        });
    }

    if (regExist) {
        swal({ title: "Message", text: "There are data without upload", type: "warning" });
    }
    else {
        let urlaccion = 'Contabilidad/Planilla/New',
            urljs = 'Contabilidad/Planilla/New';
        _Go_Url(urlaccion, urljs);
    }
}

//Eliminar Planilla del mes y año

function load_question_delete(_iddetalleperiodo, _iddocumento, _mes, _anio) {
    swal({
        title: "Delete Data",
        text: "Are you sure delete this data?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_delete(_iddetalleperiodo, _iddocumento, _mes, _anio);
        return;
    });
}

function req_delete(_iddetalleperiodo, _iddocumento, _mes, _anio) {
    ovariables.iddocument = _('cboDocumento').value;
    let urlaccion = 'Contabilidad/Planilla/Planilla_Delete';
    let par = { IdDetallePeriodo: _iddetalleperiodo, IdDocumento: _iddocumento, Mes: _mes, Anio: _anio },
    frm = new FormData();
    frm.append("par", JSON.stringify(par));
    Post(urlaccion, frm, res_delete);
}

function res_delete(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good job!", text: "You have delete with success", type: "success" });
            req_ini();
            return;
        }
        if (orpta.estado === 'error') { swal({ title: "There are a problem!", text: "Please, comunicate with administrador TIC", type: "error" }); }                
    }
    return;
}

//Edit Periodo
function load_question_edit(_iddetalleperiodo, _estado, _mes, _anio) {
    let mail = '', title;
    if (_estado == "0") { title = 'Send Mail'; mail = 'Are you sure send email to proceed with the electronic signature?'; }
    if (_estado == "1") { title = 'Upload PDF'; mail = 'Are you sure proceed with upload PDF?' }
    swal({
        title: title,
        text: mail,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_edit(_iddetalleperiodo, _estado, _mes, _anio);
        return;
    });
}

function req_edit(_iddetalleperiodo, _estado, _mes, _anio) {

    let id = _iddetalleperiodo;
    let estado = _estado;
    let document = _('cboDocumento').options[_('cboDocumento').selectedIndex].text;
    ovariables.iddocument = _('cboDocumento').value;
    let anio = _anio;
    var month = _mes;
    let url = 'Contabilidad/Planilla/Planilla_Update';
    let par = { IdDetallePeriodo: id, Estado: estado, IdDocumento: ovariables.iddocument, Documento: document, Mes: month, Anio: anio },
    frm = new FormData();
    frm.append("par", JSON.stringify(par));
    Post(url, frm, res_edit);
}

function res_edit(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            req_ini();
            swal({ title: "Good job!", text: "You have complete with success", type: "success" });
            return;
        }
        if (orpta.estado === 'error') { swal({ title: "There are a problem!", text: "Please, comunicate with administrador TIC", type: "error" });  }
       
    }
    return false;
}

//Send Email
function load_question_email(_documento, _mes, _anio, _estado) {
    let mail = '', title;
    swal({
        title: "Send Email",
        text: "Are you sure send email to WT Sourcing PERU S.A.C?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_email(_documento, _mes, _anio, _estado);
        return;
    });
}

function req_email(_documento, _mes, _anio, _estado) {
    let url = 'Contabilidad/Planilla/Planilla_Email';
    let par = { Documento: _documento, Mes: _mes, Anio: _anio, Estado: _estado },
        frm = new FormData();
    frm.append("par", JSON.stringify(par));
    Post(url, frm, res_email);
    
}

function res_email(response) {
    let orpta = response !== '' ? response : null;
    if (orpta != null) {
        swal({ title: "Good job!", text: "You have send email to WT Sourcing PERU S.A.C", type: "success"});
        return;    
    } else {
        swal({ title: "There are a problem!", text: "Please, comunicate with administrador TIC", type: "error" });
    }
    return;
}

// Listar Pantalla Principal

function req_ini() {
    let urlaccion = 'Contabilidad/Planilla/Planilla_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.document = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.period = JSON.parse(orpta[1]); } else { ovariables.period = ''; }
        fn_load_document(ovariables.document);
        fn_load_period();
    }
}

function fn_load_period() {
    if (ovariables.period != '') {
        let array = ovariables.period;
        let document = _('cboDocumento').value;
        let textdocument = _('cboDocumento').options[_('cboDocumento').selectedIndex].text;
        let table = ''
        let result = array.filter(x=> x.IdDocumento.toString() === document);
        result.forEach(x=> {
            let a = x.archivoPDF;
            if (a === 0) { table += `<tr ><td class='text-center col-sm-2'><button class='text-center btn btn-outline btn-primary' onclick="load_question_edit('${x.IdDetallePeriodo}','${x.archivoPDF}','${x.Mes}','${x.Anio}')"><span class='fa fa-envelope-o'></span></button>` }
            if (a === 1) { table += `<tr><td class='text-center col-sm-2'><button class='text-center btn btn-outline btn-warning' onclick="load_question_edit('${x.IdDetallePeriodo}','${x.archivoPDF}','${x.Mes}','${x.Anio}')"><span class='fa fa-sort-amount-desc'></span></button>` }
            if (a === 2) { table += `<tr><td class='text-center col-sm-2'><button class='text-center btn btn-outline btn-success' onclick="load_question_email('${textdocument}','${x.Mes}','${x.Anio}','${x.archivoPDF}')"><span class='fa fa-check-circle'></span></button>` }
            table += `
                <button class ='text-center btn btn-outline btn-danger' onclick="load_question_delete('${x.IdDetallePeriodo}','${x.IdDocumento}','${x.Mes}','${x.Anio}')"><span class ='fa fa-trash-o'></span></button>
                <button class ='text-center btn btn-outline btn-info' onclick="req_details('${x.IdDocumento}','${x.Mes}','${x.Anio}','${x.Documento}','${x.TotalEmpleados}','${x.TotalDescuentos}','${x.NetoPagar}','${x.archivoPDF}')"><span class ='fa fa-list'></span></button></td>
                <td class ='col-sm-2'>${x.Anio}</td>
                <td class ='col-sm-2'>${x.Mes}</td>
                <td class ='col-sm-2'>${x.TotalEmpleados}</td>
                <td class ='col-sm-2'>${x.TotalDescuentos}</td>
                <td class ='col-sm-2'>${x.NetoPagar}</td>
            </tr>
            `
        });
        _('contenTableDetails').tBodies[0].innerHTML = table;
        $('.footable').trigger('footable_resize');
    } else {        
        _('contenTableDetails').tBodies[0].innerHTML = '';
        $('.footable').trigger('footable_resize');
    }
}

function fn_load_document(_arrdocument) {
    let array = _arrdocument;
    let cbodocument = '';
    array.forEach(x=> { cbodocument += `<option value = '${x.IdDocumento}'>${x.Documento}</option>` });
    _('cboDocumento').innerHTML = cbodocument;
    _('cboDocumento').value = ovariables.iddocument;
}

(function ini() {
    load();
    req_ini();
})();

// Mostrar detalles
function req_details(_iddocumento, _mes, _anio, _documento, _totalempleados, _totaldescuentos, _netopagar, _estado) {
    let par = _iddocumento + '¬' + _mes + '¬' + _anio + '¬' + _documento + '¬' + _totalempleados + '¬' + _totaldescuentos + '¬' + _netopagar + '¬' + _estado;
    let urlaccion = 'Contabilidad/Planilla/Detail';
    _Go_Url(urlaccion, urlaccion, par);
}


/*
var oruta = { path: '' };
//var urlbase = $("#urlbase").val();


$(document).ready(function () {

    document.getElementById("periodo").value = fechaActual();
    loadPlanilla();
    $('.footable').footable();

});

//carga la planilla registrada
function loadPlanilla() {
    let url = "Contabilidad/Planilla/Load_Planilla";

    frm = new FormData();
    Post(url, frm, function (resultado) {
        let oresultado = JSON.parse(resultado);
        mostrarTabla('planilla', JSON.parse(oresultado.data));
    });

}


// 1er paso agrega el excel y una nueva fila

//carga el excel y agrega fila
function checkfile(sender) {
    var validExts = new Array(".xlsx", ".xls", ".XLSX", ".XLS");
    var fileExt = sender.value;
    var fileName = inputFile.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
        swal("Error...!", "Invalid file selected, valid files are of " +
                 validExts.toString() + " types.", "error");
        return false;
    }
    else {
        var ruta = String(document.getElementById("inputFile").files[0].name);
        document.getElementById("fileSelected").value = "C:/" + ruta;
        var periodoSelected = document.getElementById("periodo").value;
        fnClickAddRow();
        return true;
    }
}

function fnClickAddRow() {
    var periodoSelected = document.getElementById("periodo").value.split('/');
    var mesPeriodo = periodoSelected[0];
    var anioPeriodo = periodoSelected[2];
    switch (mesPeriodo) {
        case '01':
            mesPeriodo = 'ENERO'
            break;
        case '02':
            mesPeriodo = 'FEBRERO'
            break;
        case '03':
            mesPeriodo = 'MARZO'
            break;
        case '04':
            mesPeriodo = 'ABRIL'
            break;
        case '05':
            mesPeriodo = 'MAYO'
            break;
        case '06':
            mesPeriodo = 'JUNIO'
            break;
        case '07':
            mesPeriodo = 'JULIO'
            break;
        case '08':
            mesPeriodo = 'AGOSTO'
            break;
        case '09':
            mesPeriodo = 'SEPTIEMBRE'
            break;
        case '10':
            mesPeriodo = 'OCTUBRE'
            break;
        case '11':
            mesPeriodo = 'NOVIEMBRE'
            break;
        default:
            mesPeriodo = 'DICIEMBRE'
            break;

    }
    var newRow = "<tr class='gradeX'><td>" + anioPeriodo + "</td><td>" + mesPeriodo + "</td><td></td><td class='center'></td><td class='center'></td><td class='center' ></td></tr>";
    document.getElementById("editableTable").innerHTML = newRow + document.getElementById("editableTable").innerHTML;

}


//2do graba el periodo
//Pregunta
function savePlanilla() {

    if (!doSearchTable()) {
        swal({
            title: "¿Desea guardar los valores insertados?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            if (document.getElementById("fileSelected").value != "") {
                crearPlanilla();
                swal({ title: "Buen Trabajo!", text: "Ha ingresado una nueva planilla", type: "success" });
                return;
            }
            else {
                swal("Error...!", "file not selected, selected valid files ", "error");
                return;
            }
        });
    }
    else {
        swal("Error...!", "Period selected invalid, the period has already been registered", "error");

    }
}

//valida si ese periodo ya se encuentra en la tabla registrada
function doSearchTable() {
    var tableReg = document.getElementById('editableTable');
    var mesText = mesSelected();
    var anioText = anioSelected();
    var cellsOfRow = "";
    var mes_found = false;
    var anio_found = false;
    var compareWithAnio = "";
    var compareWithMes = "";
    var result = false;

    // Recorremos todas las filas con contenido de la tabla
    for (var i = 1; i < tableReg.rows.length; i++) {
        cellsOfRow = tableReg.rows[i].getElementsByTagName('td');

        compareWithAnio = cellsOfRow[0].innerHTML.toUpperCase();
        compareWithMes = cellsOfRow[1].innerHTML.toUpperCase();

        // Buscamos el texto en el contenido de la celda
        if ((anioText.length == 0 || (compareWithAnio.indexOf(anioText) > -1)) && (mesText.length == 0 || (compareWithMes.indexOf(mesText) > -1))) {
            anio_found = true;
            mes_found = true;
        }

    }

    if (mes_found && anio_found) result = true;
    else result = false;

    return result;

}

//Guarda en Base de datos Periodo y Boletas
function crearPlanilla() {
    let url = "Contabilidad/Planilla/Upload_Planilla",
    fupArchivo = _("fuArchivo"),
    file = document.getElementById("inputFile").files[0],
    data = file.name.split("."),
    n = data.length,
    frm = new FormData();
    if (n > 1) {


        _('fileSelected').value = file.name;

        let par = { mes: mesSelected(), anio: anioSelected() },
            frm = new FormData();        
        frm.append("archivo", file);
            frm.append("par", JSON.stringify(par));
            frm.append("path", oruta.path);
        Post(url, frm, function (resultado) {
                let oresultado = JSON.parse(resultado);
                mostrarTabla('planilla', JSON.parse(oresultado.data));

            });  
    }
    return;
}

//muestra en la grilla lo creado
function mostrarTabla(idtabla, arrlista) {
    let contenido = '';
    if (arrlista != '') {
        document.getElementById("editableTable").innerHTML = "";
        let x = 0, nfilas = arrlista.length;

        for (x = 0; x < nfilas; x++) {
            contenido += "<tr class='gradeX footable-even'>";
            contenido += "  <td>" + arrlista[x].Anio + "</td>";
            contenido += "  <td>" + arrlista[x].Mes + "</td>";
            contenido += "  <td class='center'>" + arrlista[x].qreg + "</td>";
            contenido += "  <td class='center'>" + _number_format(arrlista[x].dscto, 2) + "</td>";
            contenido += "  <td class='center'>" + _number_format(arrlista[x].npago, 2) + "</td>";
            if (arrlista[x].archivoPDF == "0")
                contenido += "  <td class='center' id='" + arrlista[x].IdPeriodo + "' onclick='crearPlanillaPDF(" + arrlista[x].IdPeriodo + ",\"" + arrlista[x].Mes + "\")'><i class='fa fa-sort-amount-desc'></i></td>";
            if (arrlista[x].archivoPDF == "1")
                contenido += "  <td class='center' id='" + arrlista[x].IdPeriodo + "' onclick='moverPlanillaPDF(" + arrlista[x].IdPeriodo + ")'><i class='fa fa-reply-all'></i></td>";
            if (arrlista[x].archivoPDF == "2")
                contenido += "  <td class='center' id='" + arrlista[x].IdPeriodo + "' onclick='viewPeriodo(" + arrlista[x].IdPeriodo + ")'><i class='fa fa-check-square-o'></i></td>";
            contenido += "</tr>";
        }
        document.getElementById("editableTable").innerHTML = contenido;
    }
}

//3er paso 
// Despues de agregar se tiene que crear y enviar correo
function crearPlanillaPDF(IdPeriodo, Mes) {
    let urla = "Contabilidad/Planilla/Create_PlanillaPDF";
    let urlb = "Contabilidad/Planilla/actualizaPeriodo";
    let urlc = "Contabilidad/Planilla/enviarMail";
    frm = new FormData();

    //$('#myModalSpinner').modal('show');

    $.ajax({
        type: 'GET',
        url: urlBase() + urla + "?idperiodo=" + IdPeriodo,
        data: null,
        async: false
    }).done(function (resultado) {
        let oresultado = JSON.parse(resultado);
        for (var i = 0; i < oresultado.length; i++) {
            let item = oresultado[i];
            contruyePDF(item);
        }
    });

    $.ajax({
        type: 'GET',
        url: urlBase() + urlb + "?valor=1&idperiodo=" + IdPeriodo,
        data: null,
        async: false
    }).done(function (resultado) {
        loadPlanilla();

    });

    $.ajax({
        type: 'GET',
        url: urlBase() + urlc + "?mes=" + Mes,
        data: null,
        async: false
    }).done(function (resultado) {
        swal({ title: "Good job!", text: "You have created the PDF files", type: "success" });
    });


}

//Construye PDF, 3.1.1
function contruyePDF(jsonObject) {

    let mesBoleta, anioBoleta, dniNumero, trabajadorBoleta, ocupacionBoleta, Sexo, areaBoleta, Seccion = '';
    let fechaingreso, diasTrabajados, diasVacaciones, totalDias, afpBoleta, Sueldo, tipoAsiento, ceseBoleta = '';
    let centroCosto, bancoCtaSueldo, numeroCtaSueldo, noDiasTrabajados, Dominical, Feriado, diasLibres, horasTrabajadas, heSimples = '';
    let heSegundas, heDobles, horasNocturno, horasNocturnoFeriado, horasNocturnoSimple, horasNocturnoSegundas, horasNocturnoDoble = '';
    let diasDescanzoMedico, feriadoDomingoLaborado, diasSubsidioEnf, diasSubsidioMaternidad, diasSubsidioPaternidad, diasFalta, horasTardanza = '';
    let horasDescuento, diasSuspencionPerfecta, dVacaciones, heDomingoFeriadoSimple, heDomingoFeriadoSegundas, heDomingoFeriadoDoble = '';
    let licenciaSinGoce, licenciaConGoce, vacacionesDesde, vacacionesHasta, vacacionesDesde2, vacacionesHasta2, carnetEssalud, numCUSPP = '';

    let montoSubsidioMaternidad, HE1, HEDoble, montoDescanzoMedico, montoVacaciones, montoCompraVacaciones, montoBonificacion, HE2 = '';
    let Subsidio, remuneracionBasica, asignacionFamiliar, valeConsumo, movilidadPago, totalIngresos = '';

    let totalDescuentoHoras, SeguroRimac, DescuentoONP, DescuentoAFP, seguroAFP, comisionAFP, descQuinta, adelantos, totalDescuentos = '';

    let aporteEssalud, totalAportes, utilidades, adelaUtilidades = '';

    let netoRecibir = ''

    let urla = "Contabilidad/Planilla/Create_FilePDF";
    frm = new FormData();
    frm.append("mesBoleta", jsonObject.mesBoleta);
    frm.append("anioBoleta", jsonObject.anioBoleta);
    frm.append("dniNumero", jsonObject.dniNumero);
    frm.append("trabajadorBoleta", jsonObject.trabajadorBoleta);
    frm.append("ocupacionBoleta", jsonObject.ocupacionBoleta);
    frm.append("Sexo", jsonObject.Sexo);
    frm.append("areaBoleta", jsonObject.areaBoleta);
    frm.append("Seccion", jsonObject.Seccion);
    frm.append("fechaingreso", jsonObject.fechaingreso);
    frm.append("diasTrabajados", jsonObject.diasTrabajados);
    frm.append("diasVacaciones", jsonObject.diasVacaciones);
    frm.append("totalDias", jsonObject.totalDias);
    frm.append("afpBoleta", jsonObject.afpBoleta);
    frm.append("Sueldo", jsonObject.Sueldo);
    frm.append("tipoAsiento", jsonObject.tipoAsiento);
    frm.append("ceseBoleta", jsonObject.ceseBoleta);
    frm.append("centroCosto", jsonObject.centroCosto);
    frm.append("bancoCtaSueldo", jsonObject.bancoCtaSueldo);
    frm.append("numeroCtaSueldo", jsonObject.numeroCtaSueldo);
    frm.append("noDiasTrabajados", jsonObject.noDiasTrabajados);
    frm.append("Dominical", jsonObject.Dominical);
    frm.append("Feriado", jsonObject.Feriado);
    frm.append("diasLibres", jsonObject.diasLibres);
    frm.append("horasTrabajadas", jsonObject.horasTrabajadas);
    frm.append("heSimples", jsonObject.heSimples);
    frm.append("heSegundas", jsonObject.heSegundas);
    frm.append("heDobles", jsonObject.heDobles);
    frm.append("horasNocturno", jsonObject.horasNocturno);
    frm.append("horasNocturnoFeriado", jsonObject.horasNocturnoFeriado);
    frm.append("horasNocturnoSimple", jsonObject.horasNocturnoSimple);
    frm.append("horasNocturnoSegundas", jsonObject.horasNocturnoSegundas);
    frm.append("horasNocturnoDoble", jsonObject.horasNocturnoDoble);
    frm.append("diasDescanzoMedico", jsonObject.diasDescanzoMedico);
    frm.append("feriadoDomingoLaborado", jsonObject.feriadoDomingoLaborado);
    frm.append("diasSubsidioEnf", jsonObject.diasSubsidioEnf);
    frm.append("diasSubsidioMaternidad", jsonObject.diasSubsidioMaternidad);
    frm.append("diasSubsidioPaternidad", jsonObject.diasSubsidioPaternidad);
    frm.append("diasFalta", jsonObject.diasFalta);
    frm.append("horasTardanza", jsonObject.horasTardanza);
    frm.append("horasDescuento", jsonObject.horasDescuento);
    frm.append("diasSuspencionPerfecta", jsonObject.diasSuspencionPerfecta);
    frm.append("dVacaciones", jsonObject.dVacaciones);
    frm.append("heDomingoFeriadoSimple", jsonObject.heDomingoFeriadoSimple);
    frm.append("heDomingoFeriadoSegundas", jsonObject.heDomingoFeriadoSegundas);
    frm.append("heDomingoFeriadoDoble", jsonObject.heDomingoFeriadoDoble);
    frm.append("licenciaSinGoce", jsonObject.licenciaSinGoce);
    frm.append("licenciaConGoce", jsonObject.licenciaConGoce);
    frm.append("vacacionesDesde", jsonObject.vacacionesDesde);
    frm.append("vacacionesHasta", jsonObject.vacacionesHasta);
    frm.append("vacacionesDesde2", jsonObject.vacacionesDesde2);
    frm.append("vacacionesHasta2", jsonObject.vacacionesHasta2);
    frm.append("carnetEssalud", jsonObject.carnetEssalud);
    frm.append("numCUSPP", jsonObject.numCUSPP);

    frm.append("montoSubsidioMaternidad", jsonObject.montoSubsidioMaternidad);
    frm.append("HE1", jsonObject.HE1);
    frm.append("HEDoble", jsonObject.HEDoble);
    frm.append("montoDescanzoMedico", jsonObject.montoDescanzoMedico);
    frm.append("montoVacaciones", jsonObject.montoVacaciones);
    frm.append("montoCompraVacaciones", jsonObject.montoCompraVacaciones);
    frm.append("montoBonificacion", jsonObject.montoBonificacion);
    frm.append("HE2", jsonObject.HE2);
    frm.append("Subsidio", jsonObject.Subsidio);
    frm.append("remuneracionBasica", jsonObject.remuneracionBasica);
    frm.append("asignacionFamiliar", jsonObject.asignacionFamiliar);
    frm.append("valeConsumo", jsonObject.valeConsumo);
    frm.append("movilidadPago", jsonObject.movilidadPago);
    frm.append("PresNavidad1", jsonObject.PresNavidad1);
    frm.append("totalIngresos", jsonObject.totalIngresos);

    frm.append("totalDescuentoHoras", jsonObject.totalDescuentoHoras);
    frm.append("EPS", jsonObject.EPS);
    frm.append("SeguroRimac", jsonObject.SeguroRimac);
    frm.append("DescuentoONP", jsonObject.DescuentoONP);
    frm.append("DescuentoAFP", jsonObject.DescuentoAFP);
    frm.append("seguroAFP", jsonObject.seguroAFP);
    frm.append("comisionAFP", jsonObject.comisionAFP);
    frm.append("descQuinta", jsonObject.descQuinta);
    frm.append("adelantos", jsonObject.Adelanto);
    frm.append("PresNavidad2", jsonObject.PresNavidad2);
    frm.append("Prestamos", jsonObject.Prestamos);
    frm.append("RetJudicial", jsonObject.RetJudicial);
    frm.append("OtrosDescuentos", jsonObject.OtrosDescuentos);
    frm.append("totalDescuentos", jsonObject.totalDescuentos);

    frm.append("aporteEssalud", jsonObject.aporteEssalud);
    frm.append("totalAportes", jsonObject.totalAportes);

    frm.append("netoRecibir", jsonObject.netoRecibir);

    frm.append("utilidades", jsonObject.Utilidades);
    frm.append("adelaUtilidades", jsonObject.AdelaUtilidades);

    Post(urla, frm, function (resultado) { });


}

//4to paso 

function moverPlanillaPDF(IdPeriodo) {
    let urla = "Contabilidad/Planilla/pdfCreateFileMovePath";
    //$('#myModalSpinner').modal('show');
    $.ajax({
        type: 'GET',
        url: urlBase() + urla + "?idperiodo=" + IdPeriodo,
        data: null,
        async: false
    }).done(function (resultado) {
        loadPlanilla();
        swal({ title: "Good job!", text: "You have posted the PDFs of the Payment Ballots", type: "success" });
        //alert(resultado);
    });


}


function fechaActual() {
    var today = new Date();
    var dd = '01';
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    return mm + "/" + dd + "/" + yyyy;

        }
        
function mesSelected() {
    var periodoSelected = document.getElementById("periodo").value.split('/');
    var mesPeriodo = periodoSelected[0];
    switch (mesPeriodo) {
        case '01':
            mesPeriodo = 'ENERO'
            break;
        case '02':
            mesPeriodo = 'FEBRERO'
            break;
        case '03':
            mesPeriodo = 'MARZO'
            break;
        case '04':
            mesPeriodo = 'ABRIL'
            break;
        case '05':
            mesPeriodo = 'MAYO'
            break;
        case '06':
            mesPeriodo = 'JUNIO'
            break;
        case '07':
            mesPeriodo = 'JULIO'
            break;
        case '08':
            mesPeriodo = 'AGOSTO'
            break;
        case '09':
            mesPeriodo = 'SEPTIEMBRE'
            break;
        case '10':
            mesPeriodo = 'OCTUBRE'
            break;
        case '11':
            mesPeriodo = 'NOVIEMBRE'
            break;
        default:
            mesPeriodo = 'DICIEMBRE'
            break;

    }

    return mesPeriodo;
}


function anioSelected() {
    var periodoSelected = document.getElementById("periodo").value.split('/');
    var anioPeriodo = periodoSelected[2];

    return anioPeriodo;
}

$('#data_4 .input-group.date').datepicker({
    minViewMode: 1,
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    todayHighlight: true
});


function viewPeriodo(IdPeriodo) {
    alert(IdPeriodo);
    }    

    */


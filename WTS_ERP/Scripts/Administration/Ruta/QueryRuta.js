/// <reference path="../../Home/Util.js" />

var oVariables = {
    FechaDesde: '',
    FechaHasta: '',
    TipoMensajeria: '',
    strJSONDetails: ''
}



function load() {

    //_validConexion();

    $('.footable').footable();

    var f = new Date();

    oVariables.FechaDesde = moment().subtract(30, 'days').format('MM/DD/YYYY');
    oVariables.FechaHasta = moment().format('MM/DD/YYYY');
    oVariables.TipoMensajeria = $("#cboTipoMensajeria").val();

    _('btnCancel').addEventListener('click', fn_Return);
    _('btnView').addEventListener('click', req_ini);
    _('btnReportPDF').addEventListener('click', fn_ReportToPDF);
    _('cboTipoMensajeria').addEventListener('change', fn_GetType);

    $('#reportrange span').html(moment().subtract(30, 'days').format('MM/DD/YYYY') + ' - ' + moment().format('MM/DD/YYYY'));

    $('#reportrange').daterangepicker({
        format: 'MM/DD/YYYY',
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        minDate: oVariables.FechaDesde,
        maxDate: oVariables.FechaHasta,
        dateLimit: { days: 90 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Accept',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        oVariables.FechaDesde = start.format('MM/DD/YYYY');
        oVariables.FechaHasta = end.format('MM/DD/YYYY');
        $('#reportrange span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    });

    $('.footable').trigger('footable_resize');

    hideForm();
    fn_TitleList();
}

function hideForm() {

    $('#tableNormal').hide();
    $('#tableEmergency').show();
}

function fn_GetType() {
    oVariables.TipoMensajeria = $("#cboTipoMensajeria").val();
}

function fn_TitleList() {
    if (oVariables.TipoMensajeria == "1") {
        _('TitleList').innerHTML = "Routes";
    }
    else {
        _('TitleList').innerHTML = "Emergency Routes";
    }
}

function fn_Return() {

    var url = 'Administration/Ruta/NewRuta';
    _Go_Url(url, url, '');
    return;
}

function fn_ReportToPDF() {

    //_validConexion();

    let urlaccion = urlBase() + "Administration/Ruta/getReporte?fi=" + oVariables.FechaDesde + "&ff=" + oVariables.FechaHasta + "&TipoMensajeria=" + oVariables.TipoMensajeria;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    req_ini();
    return;

}

function req_ini() {

    //_validConexion();

    fn_TitleList();

    let urlaccion = "Administration/Ruta/load_ReportData?FechaDesde=" + oVariables.FechaDesde.replace("/", "_").replace("/", "_") + "&FechaHasta=" + oVariables.FechaHasta.replace("/", "_").replace("/", "_") + "&TipoMensajeria=" + oVariables.TipoMensajeria;
    Get(urlaccion, res_ini);
}

function res_ini(response) {

    oVariables.strJSONDetails = response;
    var arrData = {};

    if (oVariables.strJSONDetails != '') {
        arrData = JSON.parse(oVariables.strJSONDetails);
        fn_LoadDetails(arrData);
    }
    else {
        arrData = [];
        _('contentTableNormal').tBodies[0].innerHTML = arrData;
        _('contentTableEmergency').tBodies[0].innerHTML = arrData;
    }


}

function fn_LoadDetails(_arrayData) {

    if (oVariables.TipoMensajeria == "1") {
        arrData = [];
        _('contentTableEmergency').tBodies[0].innerHTML = arrData;
        $('#tableNormal').show();
        $('#tableEmergency').hide();
        let tableDetails = _arrayData.map(x => {
            return `
            <tr>
                <td>${x.Fecha}</td>
                <td>${x.Destino}</td>
                <td>${x.Cliente}</td>
                <td>${x.Envia}</td>
                <td>${x.Servicio}</td>
                <td>${x.Movilidad}</td>
                <td>${x.Estado}</td>
                

            </tr>            `
        }).join('');

        _('contentTableNormal').tBodies[0].innerHTML = tableDetails;
    }
    else {
        arrData = [];
        _('contentTableNormal').tBodies[0].innerHTML = arrData;
        $('#tableNormal').hide();
        $('#tableEmergency').show();
        let tableDetails = _arrayData.map(x => {
            return `
            <tr>
                <td>${x.Fecha}</td>
                <td>${x.Destino}</td>
                <td>${x.Cliente}</td>
                <td>${x.Envia}</td>
                <td>${x.Servicio}</td>
                <td>${x.Movilidad}</td>
                <td>${x.Estado}</td>
                <td><a href="#" class="btn btn-xs btn-outline btn-primary" onclick="EditarEmergencia(${x.IdEmergencia});">Edit</a></td>
            </tr>            `
        }).join('');

        _('contentTableEmergency').tBodies[0].innerHTML = tableDetails;
    }


    $('.footable').trigger('footable_resize');
}


function EditarEmergencia(id) {
    let urlaccion = 'Administration/Ruta/UrgentRutaBef',
        urljs = 'Administration/Ruta/UrgentRutaBef';
    _Go_Url(urlaccion, urljs, id);
}

(function ini() {
    load();
    req_ini();
})();



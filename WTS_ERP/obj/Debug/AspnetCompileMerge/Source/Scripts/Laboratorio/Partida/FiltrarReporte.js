var ovariables = {
    par: '',
    fabrica: '',
    cliente: '',
    fechadesde: '',
    fechahasta: '',
    statusfinal: '',
    tipoprueba: '',
    arrreportes: [],
    idreporte: 0,
    idsubreporte: 0,
}

function load() {
    ovariables.par = _('txtpar_reportes').value;

    _('btnaceptar').addEventListener('click', req_export);

    load_mes();
    load_anio();
}

function load_mes() {
    let cbomes = `
        <option value=1>Enero</option>
        <option value=2>Febrero</option>
        <option value=3>Marzo</option>
        <option value=4>Abril</option>
        <option value=5>Mayo</option>
        <option value=6>Junio</option>
        <option value=7>Julio</option>
        <option value=8>Agosto</option>
        <option value=9>Septiembre</option>
        <option value=10>Octubre</option>
        <option value=11>Noviembre</option>
        <option value=12>Diciembre</option>
        `;
    _('cboMes').innerHTML = cbomes;
}

function load_anio() {
    let cboanio = `
        <option value=2019>2019</option>
        <option value=2020 selected>2020</option>
        `;
    _('cboAnio').innerHTML = cboanio;
}

function req_export() {
    if (ovariables.idreporte != 0) {
        let urlaccion = '';
        if (ovariables.idreporte == '1') {
            urlaccion = urlBase() + 'Laboratorio/Partida/Laboratorio_Reporte_Export_Pruebas?par=' + ovariables.par;
        }
        else if (ovariables.idreporte == '2') {
            urlaccion = urlBase() + 'Laboratorio/Partida/Laboratorio_Reporte_Export_LeadTime?par=' + ovariables.par;
        }
        else if (ovariables.idreporte == '3' && ovariables.idsubreporte == 0) {
            let mes = _('cboMes').value, anio = _('cboAnio').value;
            let par = `mes:${mes},anio:${anio}`;
            urlaccion = urlBase() + 'Laboratorio/Partida/Laboratorio_Reporte_Export_LeadTimeKPI?par=' + par;
           
        }
        else if (ovariables.idreporte == '3' && ovariables.idsubreporte == 1) {
            reporte_KPI();            
        }
        else if (ovariables.idreporte == '4') {
            urlaccion = urlBase() + 'Laboratorio/Partida/Laboratorio_Reporte_Export_TestSummay?par=' + ovariables.par;
        }

        $.ajax({
            type: 'GET',
            url: urlaccion,
            dataType: 'json',
            async: false,
        }).done(function (data) {
            if (data.Success) {
                urlaccion = urlBase() + 'Laboratorio/Partida/descargarexcel_reporte';
                window.location.href = urlaccion;
                ovariables.idsubreporte = 1;
            }
        });
    }
    else {
        swal({ title: 'Alert!', text: 'You have to select a report', type: 'warning' }); return;
    }
}

function reporte_KPI() {
    let mes = _('cboMes').value, anio = _('cboAnio').value;
    let par = `mes:${mes},anio:${anio}`;
    urlaccion = urlBase() + 'Laboratorio/Partida/Laboratorio_Reporte_Export_KPI?par=' + par;
    ovariables.idsubreporte = 0;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
    return;
}

function req_ini(){
    let urlaccion = `Laboratorio/Partida/Laboratorio_Reporte_List`;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : '';
    if (orpta != '') {
        if (orpta[0].reportes != '') { ovariables.arrreportes = orpta[0].reportes; }
        fn_load_reportes();
    }
}

function fn_load_reportes() {
    let arr = JSON.parse(ovariables.arrreportes), htmlbody='';
    if (arr.length > 0) {
        arr.forEach(x=> {
            htmlbody += `
                <tr data-par='id:'${x.id}'>
                    <td class ='text-center'>
                        <div id='${x.id}' class ='i-checks _radbtn'>
                            <div class ='iradio_square-green' style='position: relative;'>
                                <label>
                                    <input value=${x.id} id='square-radio-${x.id}' name='radiobutton' type='radio' class ='i-checks _radbtn' style='position: absolute; opacity: 0;'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                </label>
                            </div>
                        </div>
                    </td>
                    <td>${x.reporte}</td>
                    <td>${x.descripcion}</td>
                </tr>
                `;
        })
    }

    _('tablereports').tBodies[0].innerHTML = htmlbody;
    handler_table();
}

function handler_table() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let x = e.currentTarget;
        ovariables.idreporte = x.value;
        if (ovariables.idreporte == 3) { _('divmes').classList.remove('hide'); _('divanio').classList.remove('hide'); }
        else { _('divmes').classList.add('hide'); _('divanio').classList.add('hide'); }
        ovariables.idsubreporte = 0;
    });
}

(function ini() {
    load();
    req_ini();
})();
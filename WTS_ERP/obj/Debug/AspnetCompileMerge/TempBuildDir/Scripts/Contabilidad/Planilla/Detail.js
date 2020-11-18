var ovariables = {
    data: '',
    detail: '',
    estado: '',
    iddocumento: ''
}

function load() {
    var txtpar = _('txtpar'), par = txtpar.value;
    var x = txtpar.value.split('¬');

    $('.footable').footable();
    
    var param = { IdDocumento: x[0], Mes: x[1], Anio: x[2], TipoDocumento: x[3], Empleado: x[4], Descuento: x[5], Neto: x[6], Estado: x[7] };
    if (!_isEmpty(par)) {
        ovariables.data = JSON.stringify(param);
        let data = JSON.parse(ovariables.data);
        _('txtDocumento').value = data.TipoDocumento;
        _('txtMes').value = data.Mes;
        _('txtAnio').value = data.Anio;
        _('txtEmpleado').value = data.Empleado;
        _('txtTotalDescuento').value = data.Descuento;
        _('txtTotalNeto').value = data.Neto;
        ovariables.estado = data.Estado;
        ovariables.iddocumento = data.IdDocumento;
    }

    _('btnReturn').addEventListener('click', fn_return);
}

function fn_return() {
    let urlaccion = 'Contabilidad/Planilla/Index',
        urljs = 'Contabilidad/Planilla/Index';
    _Go_Url(urlaccion, urljs);
}

function req_ini() {
    let urlaccion = 'Contabilidad/Planilla/Planilla_Get?par=' + ovariables.data;
    Get(urlaccion,res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        ovariables.detail = JSON.parse(orpta[0]);
        fn_load_detail(ovariables.detail);
    }
}

function fn_load_detail(_array) {

    let moneda ='S/. ';
    let tablebody = '';
    let descuento = 'S/. 0.00';
    
    _array.forEach(x=> {
        let totdesc = parseFloat(x.QuintaCategoria) + parseFloat(x.OtrosDecuento);
        let a = x.IdDocumento;
        tablebody += `
             <tr>
                <td class ='text-center col-sm-1'><button class ='text-center btn btn-outline btn-warning' onclick="req_download('${x.nombrePDF}')"><span class ='fa fa-download'></span></button></td>
                <td class ='col-sm-4'>${x.Trabajador}</td>
                <td class ='col-sm-2'>${x.Codigo}</td>
                `
        ;
        if (a === 1 || a === 2) { tablebody += `<td class ='col-sm-2'>${moneda}${x.TotalDescuentos}</td><td class ='col-sm-2'>${moneda}${x.NetoPagar}</td><tr>`; }
        if (a === 3) { tablebody += `<td class ='col-sm-2'>${descuento}</td><td class ='col-sm-2'>${moneda}${x.ImpCTS}</td><tr>`; }
        if (a === 4) { tablebody += `<td class ='col-sm-2'>${moneda}${totdesc}</td><td class ='col-sm-2'>${moneda}${x.TotalPagar}</td><tr>`; }
    });

    _('contenTableDetails').tBodies[0].innerHTML = tablebody;
    $('.footable').trigger('footable_resize');
}

function req_download(_nombre) {
    if (ovariables.estado != "2") {
        let urlaccion = '../Contabilidad/Planilla/Planilla_Download?nameFile=' + _nombre;
        var link = document.createElement("a");
        link.href = urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;

        return;
    }
}

function res_download(response) {

}

(function ini() {
    load();
    req_ini();
})();
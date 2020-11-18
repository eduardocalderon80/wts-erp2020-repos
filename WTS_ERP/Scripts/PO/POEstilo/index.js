/// <reference path="../home/util.js" />

var ovariables = {
    urlbase: _('urlBase').value
}

function load() {
    _('btnSearch').addEventListener('click', ejecutarbuscarpo, false);
    _('btnOpenAddPo').addEventListener('click', ejecutarnewpo, false);
    _('btnOpenAddBuy').addEventListener('click', ejecutarnewbuy, false);

    $('#divPadreFechaInicio .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
    });

    $('#divpadrefechafin .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
    });

}

function ejecutarbuscarpo() {
    if ($.trim(_convertDate_ANSI(_('txtFechaInicio').value)) != '' && $.trim(_convertDate_ANSI(_('txtFechaFin').value)) != '') {
        let fechas = (_('txtFechaInicio').value.trim().length > 0 && _('txtFechaFin').value.trim().length > 0);
        if (!fechas) { _mensaje({ estado: 'error', mensaje: 'enter correct dates' }); }
    }
    
    let combocliente = _('cboCliente'),
        comboproveedor = _('cboFabrica'),
        parametro = JSON.stringify({
            idcliente: combocliente.options.selectedIndex > 0 ? combocliente.value : 0,
            idproveedor: comboproveedor.options.selectedIndex > 0 ? comboproveedor.value : 0,
            codigopowts: _('txtNumeroPoWTS').value,
            codigopocliente: $.trim(_('txtCodigoPoClienteIndex').value),
            codigoproducto: _('txtCodigoProducto').value,
            //idusuario: 0,
            idempresa: 1,  // :edu 20171031 DATO HARDCODEADO LUEGO CAMBIAR CUANDO FUNCIONE SEGURIDAD
            idgrupopersonal: 8,
            fechainicio: _convertDate_ANSI(_('txtFechaInicio').value),
            fechafin: _convertDate_ANSI(_('txtFechaFin').value),
            idtipopo: _('cboTipoPo_BuyIndex').value
        });
    Get('PO/POEstilo/getData_byParamaters?par=' + parametro, mostrardata);
}

function mostrardata(orespuesta) {
    $("#tbodyConsultaIndex").html("");
    if (orespuesta !== "") {
        let data = JSON.parse(orespuesta);
        llenartablaindex(data);
    }
}

function llenartablaindex(data) {
    let html = '', totalfila = 0, i = 0;
    if (data !== null && data.length > 0) {
        totalfila = data.length;
        for (i = 0; i < totalfila; i++) {
            html += `<tr>`;
            html += `<td class="text-center" style="vertical-align: middle;" data-par="idpoclienteproducto:${data[i].idpoclienteestilo},idpo:${data[i].idpo},idpocliente:${data[i].idpocliente},tipopo:${data[i].tipopo}" data-idpo=${data[i].idpo} data-idpocliente=${data[i].idpocliente}>`;
            html += `<span class='input-group-btn'>`;
            html += `<button class='btn btn-primary btn-sm _edit' type='button' title='edit'>`;
            html += `   <i class='fa fa-pencil-square-o'></i>`;
            html += `</button>`;
            html += `<button class='btn btn-success btn-sm _pdf' type='button' title='pdf'>`;
            html += `   <i class='fa fa-file-pdf-o'></i>`;
            html += `</button>`;
            html += `</span>`;
            html += `</td>`;
            html += `<td class="text-center">${data[i].idpoclienteestilo}</td>`;
            html += `<td class="text-center">${data[i].codigopo}</td>`;
            html += `<td class="text-center">${data[i].codigopocliente}</td>`;
            html += `<td class="text-center">${data[i].codigoestilo}</td>`;
            html += `<td class="text-center">${data[i].nombretipopo}</td>`;
            html += `<td class="text-center">${data[i].nombrecliente}</td>`;
            html += `<td class="text-center">${data[i].nombreproveedor}</td>`;
            html += `<td class="text-center">${data[i].arrivalpo}</td>`;
            html += `<td class="text-center">${data[i].preciocliente}</td>`;
            html += `<td class="text-center">${data[i].preciofabrica}</td>`;
            html += `<td class="text-center">${data[i].cantidadrequerida}</td>`;
            html += `<td class="text-center">${data[i].monto}</td>`;
            html += `<td class="text-center">${data[i].costo}</td>`;
            html += `<td class="text-center">${data[i].margen}</td>`;
            html += `<td class="text-center">${data[i].fechadespachofabrica}</td>`;
            html += `<td class="text-center">${data[i].fechadespachocliente}</td>`;
            html += `<td class="text-center">${data[i].fechaentregacliente}</td>`;//${data[i].fechaentregacliente}            
            html += `</tr>`;
        }
        $("#tbodyConsultaIndex").html(html);
        if (html !== '') { accion_grilla(); } //:sam
    }
    html = null; totalfila = null; i = null;
}

function ejecutarnewpo() {
    let urlaccion = 'PO/POEstilo/addPOEstilo',
        urljs = 'PO/POEstilo/addPOEstilo';
    _Go_Url(urlaccion, urljs, 'accion:new');
}

function ejecutarnewbuy() {
    let urlaccion = 'PO/POEstilo/addPOEstilo',
        urljs = 'PO/POEstilo/addPOEstilo';
    _Go_Url(urlaccion, urljs, 'accion:new,tipopo:buy');
}



// :2
function req_ini() {
    let par = JSON.stringify({ codigoestado: 1004 }), form = new FormData();
    form.append("par", par);
    Post('PO/POEstilo/getData_ClienteProveedor', form, res_ini);
}

// :3
function res_ini(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores !== null) {
        _('cboCliente').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromCSV(ores.clientes);
        _('cboFabrica').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromCSV(ores.proveedores);
    }
}

//:sam
function accion_grilla() {
    let tbl = _('tbodyConsultaIndex'),
        abotonedit = tbl !== null ? _Array(tbl.getElementsByClassName('_edit')) : null,
        abotonpdf = tbl !== null ? _Array(tbl.getElementsByClassName('_pdf')) : null;
    if (abotonedit !== null) { abotonedit.forEach(x=>x.addEventListener('click', e=> { controlador(e, 'edit'); })); }
    if (abotonpdf !== null) { abotonpdf.forEach(x=>x.addEventListener('click', e=> { controlador(e, 'pdf'); })); }
}



// :edu 20171017 exportar a pdf
function controlador(event, accion) {
    let o = event.target,
        tag = o.tagName,
        par = '', dataidpo = '', dataidpocliente = '';
    switch (tag) {
        case 'BUTTON':
            par = o.parentNode.parentNode.getAttribute('data-par');
            dataidpo = o.parentNode.parentNode.getAttribute('data-idpo')
            dataidpocliente = o.parentNode.parentNode.getAttribute('data-idpocliente')
            break;
        case 'SPAN':
            par = o.parentNode.parentNode.parentNode.getAttribute('data-par');
            dataidpo = o.parentNode.parentNode.parentNode.getAttribute('data-idpo');
            dataidpocliente = o.parentNode.parentNode.parentNode.getAttribute('data-idpocliente');
            break;
        case 'I':
            par = o.parentNode.parentNode.parentNode.getAttribute('data-par');
            dataidpo = o.parentNode.parentNode.parentNode.getAttribute('data-idpo');
            dataidpocliente = o.parentNode.parentNode.parentNode.getAttribute('data-idpocliente');
            break;
        default:
            break;
    }
    if (par !== '' && accion !== null) {
        evento(par, accion, dataidpo, dataidpocliente)
    }
}


function evento(parametro, accion, dataidpo, dataidpocliente) {
    let urlaccion = 'PO/POEstilo/addPOEstilo',
        urljs = 'PO/POEstilo/addPOEstilo';
    if (accion === 'edit') {
        _Go_Url(urlaccion, urljs, 'accion:edit,' + parametro);
    } else if (accion === 'pdf') {
        savepotopdf(dataidpo, dataidpocliente);
    }
}

function savepotopdf(idpo, idpocliente) {
    urlaccion = ovariables.urlbase + `PO/POEstilo/SavePoToPdf?pidpo=${idpo}&pidpocliente=${idpocliente}`;
    var link = document.createElement("a");
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

// :ini
(
function ini() {
    load();
    req_ini();
}
)();

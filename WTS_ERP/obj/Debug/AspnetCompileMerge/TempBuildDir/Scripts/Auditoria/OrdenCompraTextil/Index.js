var ovariables = {
    arrfabrica: [],
    arcliente: [],
    arrpos: [],
    arrdata:[],
}

function load() {

    $('#divfechadesde .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#divfechahasta .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#divfechaoc .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    fn_getDate();
    fn_load_oc();
    
    $('#cbofabrica').on('change', req_data);
    $('#cbocliente').on('change', req_data);
    $('#cbo_oc').on('change', req_data);
}

/* Generales */
function fn_getDate() {
    let odate = new Date();
    let mes = odate.getMonth() + 1;
    let day = odate.getDate();
    let anio = odate.getFullYear();
    if (day < 10) { day = '0' + day }
    if (mes < 10) { mes = '0' + mes }
    let desde = `${mes}/01/${(anio)}`;
    _('txtfechadesde').value = desde;
    let hasta = `${mes}/${day}/${anio}`;
    _('txtfechahasta').value = hasta;
}

function event_search(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        req_load_pos();
    }
}

function fn_load_oc() {
    let cbooc = `
        <option value=0>Sin O/C Textil</option>
        <option value=1>Con O/C Textil</option>
        `;
    _('cbo_oc').innerHTML = cbooc;
    $('#cbo_oc').select2();
}

/* Index */
function req_ini() {
    let urlaccion = `Auditoria/OrdenCompraTextil/OrdenCompraTextil_Master`;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : '';
    if (orpta != '') {
        if (orpta[0].fabrica != '') { ovariables.arrfabrica = orpta[0].fabrica; }
        if (orpta[0].cliente != '') { ovariables.arrcliente = orpta[0].cliente; }
        fn_load_fabrica();
        fn_load_cliente();
        req_data();
    }
}

function fn_load_fabrica() {
    let arrfabrica = JSON.parse(ovariables.arrfabrica);
    let cbofabricahtml = `<option value='0'>All Factory</option>`;
    if (arrfabrica.length > 0) {
        arrfabrica.forEach(x=> { cbofabricahtml += `<option value='${x.codigofabrica}'>${x.nombrefabrica}</option>`; });
    }
    _('cbofabrica').innerHTML = cbofabricahtml;
    $('#cbofabrica').select2();
}

function fn_load_cliente() {
    let arrcliente = JSON.parse(ovariables.arrcliente);
    let cboclientehtml = `<option value='0'>All Client</option>`;
    if (arrcliente.length > 0) {
        arrcliente.forEach(x=> { cboclientehtml += `<option value='${x.codigocliente}'}>${x.nombrecliente}</option>`; });
    }
    _('cbocliente').innerHTML = cboclientehtml;
    $('#cbocliente').select2();
}

function req_data() {
    let par = _getParameter({ id: 'formbusqueda', clase: '_enty' });
    let urlaccion = 'Auditoria/OrdenCompraTextil/OrdenCompraTextil_List?par=' + JSON.stringify(par);
    Get(urlaccion, res_data);
}

function res_data(response) {
    let orpta = response != null ? JSON.parse(response) : '';
    if (orpta != '') {
        if (orpta[0].resultado != '') { ovariables.arrpos = orpta[0].resultado } else { ovariables.arrpos = [] }
        req_load_pos();
    }
}

function req_load_pos() {
    let arrpos = ovariables.arrpos.length > 0 ? JSON.parse(ovariables.arrpos) : [];
    let po = _('txtpo').value, estilo = _('txtestilo').value;
    let result = arrpos.filter(x=>
        (x.po.indexOf(po) > -1 || x.po.toLowerCase().indexOf(po) > -1) &&
        (x.estilo.indexOf(estilo) > -1 || x.estilo.toLowerCase().indexOf(estilo) > -1)
     );

    if (result.length > 0) {
        _('datos').classList.add('hide');
        fn_load_pos(result);
    }
    else {
        _('datos').classList.remove('hide');
        let divtabla = _('tablecontentpos'), tabla = divtabla.children[0];
        if (tabla != undefined) { divtabla.children[0].remove(divtabla); }
    }
}

function fn_load_pos(_result) {
    let resultadopo = _result, html = '', htmlbody = '';

    html = `<table id='tblpos' class='stripe row-border order-column' style='width: 200%; max-width: 200%; padding-right: 0px;'>
         <thead>
            <tr>               
                <th style='width:7%'>PO</th>
                <th style='width:7%'>Estilo</th>
                <th style='width:2%'>Lote</th>
                <th style='width:7%'>Color</th>
                <th style='width:2%'>Cantidad</th>
                <th style='width:5%'>Fecha Creacion</th>
                <th style='width:5%'>Días sin O/C</th>
                <th style='width:5%'>Fecha Fab Orig</th>
                <th style='width:5%'>LeadTime Fab</th>
                <th style='width:15%'>Fabrica</th>
                <th style='width:15%'>Cliente</th>
                <th style='width:10%'>Vendor</th>
                <th style='width:5%'>División</th>
                <th style='width:5%'>Temporada</th>
                <th style='width:15%'>Tela</th>
                <th style='width:15%'>Descripcion</th>
                <th style='width:10%'>Controller</th>
                <th style='width:5%'>Ship By</th>
                <th style='width:5%'>O/C</th>
                <th style='width:5%'>Proveedor</th>
                <th style='width:5%'>Fecha O/C</th>
            </tr>
         </thead>
         <tbody>
        `;

    resultadopo.forEach(x=> {
        let oc = _('cbo_oc').value, dias_sinoct = '-';
        if (oc == 0) { dias_sinoct = x.dias_sinoct; }

        htmlbody += `
                <tr data-par='po:${x.po},estilo:${x.estilo},lote:${x.lote},color:${x.color},cantidad:${x.cantidad},codfabrica:${x.codfabrica},codcliente:${x.codcliente}' onclick='event_rows(event)'>
                    <td>${x.po}</td>
                    <td>${x.estilo}</td>
                    <td >${x.lote}</td>
                    <td>${x.color}</td>
                    <td class ='text-center'>${x.cantidad}</td>
                    <td>${x.fecha_creacion}</td>
                    <td class ='text-center'>${dias_sinoct}</td>
                    <td>${x.fecha_fab_original}</td>
                    <td class ='text-center'>${x.leadtime_fabrica}</td>
                    <td>${x.fabrica}</td>
                    <td>${x.cliente}</td>
                    <td>${x.vendedor}</td>
                    <td>${x.division}</td>
                    <td>${x.temporada}</td>
                    <td>${x.tela}</td>
                    <td>${x.descripcion}</td>
                    <td>${x.controller}</td>
                    <td>${x.envio}</td>
                    <td>${x.oc}</td>
                    <td>${x.proveedortela}</td>
                    <td>${x.fechaoc}</td>
                </tr>
            `;
    });
    
    html += htmlbody + '</tbody></table>';
    _('tablecontentpos').innerHTML = html;

    let table = _('tblpos'), arr = Array.from(table.tBodies[0].rows);
    if (arr.length > 0) {
        arr.forEach(x=> {
            if (ovariables.arrdata.length > 0) {
                let par = x.getAttribute('data-par');
                let val = ovariables.arrdata.some(y=> { return (y === par) });
                if (val) { x.classList.add('row-selected'); }
            }
        })
    }

    format_table();
}

function event_rows(e) {
    let o = e.currentTarget, row = o;
    if (row.classList.contains('row-selected')) {
        row.classList.remove('row-selected');
        let par = row.getAttribute('data-par');
        let arr = ovariables.arrdata.filter(x=>par !== x);
        ovariables.arrdata = arr;
    }
    else {
        row.classList.add('row-selected');
        let par = row.getAttribute('data-par');
        ovariables.arrdata.push(par);
    }
}

function format_table() {
    $('#tblpos').DataTable({
        scrollY: "500px",
        scrollX: true,
        scrollCollapse: true,
        searching: false,
        ordering: false,
        info: false,        
        "pageLength": 100
        //bPaginate: false,
        //lengthChange: false,
    });
}

function handler_table() {
    $('.i-checks._clsdivpo').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {


    });
}

function req_new() {  
    let table = _('tblpos');
    let array = Array.from(table.getElementsByClassName('row-selected'));
    let resultado = [];
    if (array.length > 0) {
        _('div_listado').classList.add('hide');
        _('div_envio').classList.remove('hide');
        
        array.forEach(x=> {
            let par = x.getAttribute('data-par');
            po = _par(par, 'po');
            estilo = _par(par, 'estilo');
            lote = _par(par, 'lote');
            color = _par(par, 'color');
            cantidad = _par(par, 'cantidad');
            codfabrica = _par(par, 'codfabrica');
            codcliente = _par(par, 'codcliente');

            let fil = JSON.parse(ovariables.arrpos).filter(x=>
                x.po === po && x.estilo === estilo &&
                    x.lote === lote && x.color === color &&
                     x.cantidad === cantidad && x.codfabrica === codfabrica &&
                     x.codcliente === codcliente
                );
            resultado.push(fil);
        })

        fn_send(resultado);
    }
    else { swal({ title: "Alert!", text: "You have to select some registers", type: "warning" }); }
   
}

function fn_send(_arr) {
    let html = '', htmlbody = '';
    html = `<table id='tbldetails' class='stripe row-border order-column' style='width: 200%; max-width: 200%; padding-right: 0px;'>
         <thead>
            <tr>
                 <th style='width:2%'></th>
                <th style='width:7%'>PO</th>
                <th style='width:7%'>Estilo</th>
                <th style='width:2%'>Lote</th>
                <th style='width:7%'>Color</th>
                <th style='width:2%'>Cantidad</th>
                <th style='width:5%'>Fecha Creacion</th>
                <th style='width:5%'>Días sin O/C</th>
                <th style='width:5%'>Fecha Fab Orig</th>
                <th style='width:5%'>LeadTime Fab</th>
                <th style='width:15%'>Fabrica</th>
                <th style='width:15%'>Cliente</th>
                <th style='width:10%'>Vendor</th>
                <th style='width:5%'>División</th>
                <th style='width:5%'>Temporada</th>
                <th style='width:15%'>Tela</th>
                <th style='width:15%'>Descripcion</th>
                <th style='width:10%'>Controller</th>
                <th style='width:5%'>Ship By</th>
                <th style='width:5%'>O/C</th>
                <th style='width:5%'>Proveedor</th>
                <th style='width:5%'>Fecha O/C</th>
            </tr>
         </thead>
         <tbody>
        `;

    _arr.forEach(x=> {
        htmlbody += `
                <tr data-par='po:${x[0].po},estilo:${x[0].estilo},lote:${x[0].lote},color:${x[0].color},cantidad:${x[0].cantidad},codfabrica:${x[0].codfabrica},codcliente:${x[0].codcliente}'>
                    <td class ='text-center'><button class ='text-center btn btn-outline btn-danger' onclick='req_remove(this)'><span class ='fa fa-close'></span></button></td>
                    <td>${x[0].po}</td>
                    <td>${x[0].estilo}</td>
                    <td >${x[0].lote}</td>
                    <td>${x[0].color}</td>
                    <td class ='text-center'>${x[0].cantidad}</td>
                    <td>${x[0].fecha_creacion}</td>
                    <td class ='text-center'>${x[0].dias_sinoct}</td>
                    <td>${x[0].fecha_fab_original}</td>
                    <td class ='text-center'>${x[0].leadtime_fabrica}</td>
                    <td>${x[0].fabrica}</td>
                    <td>${x[0].cliente}</td>
                    <td>${x[0].vendedor}</td>
                    <td>${x[0].division}</td>
                    <td>${x[0].temporada}</td>
                    <td>${x[0].tela}</td>
                    <td>${x[0].descripcion}</td>
                    <td>${x[0].controller}</td>
                    <td>${x[0].envio}</td>
                    <td>${x[0].oc}</td>
                    <td>${x[0].proveedortela}</td>
                    <td>${x[0].fechaoc}</td>
                </tr>
            `;
    });
    html += htmlbody + '</tbody></table>';
    _('tabledetails').innerHTML = html;

    $('#tbldetails').DataTable({
        scrollY: "500px",
        scrollX: true,
        scrollCollapse: true,
        searching: false,
        ordering: false,
        info: false,
        "pageLength": 100
    });
}

function req_remove(event) {
    let e = event.parentNode.parentNode;
    let par = e.getAttribute('data-par');
    let arr = ovariables.arrdata.filter(x=>par !== x);
    ovariables.arrdata = arr;
    e.remove();
    if (ovariables.arrdata.length == 0) { fn_return(); }
}

function fn_return() {
    _('div_listado').classList.remove('hide');
    _('div_envio').classList.add('hide');
    _('txtoc').value = '';
    _('txtproveedor').value = '';
    _('txtfechaoc').value = '';
    var tbl = _('tabledetails');
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
    tbl.children[0].remove(tbl);
    req_ini();
}

function required_form(oenty) {
    let divformulario = _(oenty.id), resultado = true;
    let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    let array = Array.prototype.slice.apply(elementsselect2); //elementsselect2
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode, att = x.getAttribute('data-required');
        if (att) {
            if (valor == '') { padre.classList.add('has-error'); resultado = false; }
            else { padre.classList.remove('has-error'); }
        }
    })
    return resultado;
}

function req_insert() {
    let req = required_form({ id: 'form_insert', clase: '_enty' });
    if (req) {
        swal({
            title: "Save Data",
            text: "Are you sure save these values?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            let par = _getParameter({ id: 'form_insert', clase: '_enty' });
            let urlaccion = 'Auditoria/OrdenCompraTextil/OrdenCompraTextil_Insert';
            let arrdata = JSON.stringify(fn_get_po('tbldetails'));
            form = new FormData();
            form.append('parhead', JSON.stringify(par));
            form.append('pardetail', arrdata);
            Post(urlaccion, form, res_insert);
        });
    }
    else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    }
}

function res_insert(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good Job!", text: "You have registered new Data", type: "success" });
            ovariables.arrdata = [];
            fn_return();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}

function fn_get_po(_idtabla) {
    let arr = Array.from(_(_idtabla).tBodies[0].rows), resultado = [];
    if (arr.length > 0) {
        arr.forEach(x=> {
            obj = {};
            let par = x.getAttribute('data-par');
            obj.po = _par(par, 'po');
            obj.estilo = _par(par, 'estilo');
            obj.lote = _par(par, 'lote');
            obj.color = _par(par, 'color');
            obj.cantidad = _par(par, 'cantidad');
            obj.codfabrica = _par(par, 'codfabrica');
            obj.codcliente = _par(par, 'codcliente');
            resultado.push(obj);
        })
    }
    return resultado;
}

(function ini() {
    load();
    req_ini();
})()
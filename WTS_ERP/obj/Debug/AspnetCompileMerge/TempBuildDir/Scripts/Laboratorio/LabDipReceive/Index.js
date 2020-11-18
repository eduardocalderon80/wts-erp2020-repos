//Laboratorio
var ovariables_labdipre = {
    idgrupopersonal: '',
    arrcliente: '',
    arrlabdip: '',
    idcliente: '',
    arrcheckeados: [],
}

function load() {

    
    $(".select2_estadolab").select2();
    $('#cbocliente').on('change', fn_change_cbo);
    $('#cboestadolab').on('change', fn_change_cbo);
    //_('cbocliente').addEventListener('change', fn_change_cbo);
    //_('cboestadolab').addEventListener('change', fn_change_cbo);


    _('btnreceive').addEventListener('click', fn_receive_labdip);    
    _('btnexport').addEventListener('click', req_export_labdip);
    _('btnrejected').addEventListener('click', fn_rejected_labdip);  
    _('btnedit').addEventListener('click', fn_edit_labdip);
    _('btndelete').addEventListener('click', fn_delete_labdip);
    
}

function req_export_labdip() { 
    let idcliente = _('cbocliente').value;
    let estadolab = _('cboestadolab').value;
    var par = `idcliente:${idcliente},estadolab:${estadolab}`;


    let urlaccion = urlBase() + "Laboratorio/LabDipReceive/LabDipReceive_Export?par=" + par;
    $.ajax({
        type: 'GET',
        url: urlaccion,
        dataType: 'json',
        async: false,
    }).done(function (data) {
        if (data.Success) {
            urlaccion = urlBase() + 'Laboratorio/LabDipReceive/descargarexcel_reporte';
            window.location.href = urlaccion;
            //ovariables.idsubreporte = 1;
        }
    });
}


function fn_rejected_labdip() {
    let pantalla = 3, text = 'REJECT';
    req_receive_reject(pantalla, text);
}

function fn_receive_labdip() {
    let pantalla = 2, text = 'RECEIVE';
    req_receive_reject(pantalla, text);
}

function fn_edit_labdip() {
    let pantalla = 5, text = 'EDIT';
    req_receive_reject(pantalla, text);
}

function fn_delete_labdip() {
    let pantalla = 6, text = 'REMOVE';
    req_receive_reject(pantalla, text);
}

function req_receive_reject(_pantalla, _text) {
    let divtabla = _('tablelabdipcontent'), tabla = divtabla.children[0];
    if (tabla != undefined) {
        let labdipsend = fn_get_labdip('tablelabdip');
        if (labdipsend.length > 0) {
            swal({
                title: 'Save Data',
                text: 'Are you sure ' + _text + ' these register?',
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                req_insert(_pantalla);
            });
        } else { swal({ title: 'Alert', text: 'You have to select a register', type: 'warning' }); }
    }
    else { swal({ title: 'Alert', text: 'There are not data to ' + _text, type: "warning" }); }
}

function fn_get_labdip(_idtabla) {
    let table = _(_idtabla) == null ? '' : _(_idtabla);
    let arrlabdip = []
    if (table != '') {
        let tablebody = table.tBodies[0], arrchklabdip = [...tablebody.getElementsByClassName('checked')], obj = {};
        if (arrchklabdip.length > 0) {
            arrchklabdip.forEach(x=> {
                obj = {};
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');
                obj.idlabdip = _par(par, 'idlabdip');
                arrlabdip.push(obj);
            })
        }
    }
    return arrlabdip;
}

function req_insert(_pantalla) {
    let urlaccion = 'Laboratorio/LabDipReceive/LabDipReceive_Insert';
    let obotones = { idpantalla: _pantalla },
        arrdata = JSON.stringify(fn_get_labdip('tablelabdip')),
        form = new FormData();
    form.append('parhead', JSON.stringify(obotones));
    form.append('pardetail', arrdata);
    Post(urlaccion, form, res_insert);
}

function res_insert(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            ovariables_labdipre.arrcliente = '';
            ovariables_labdipre.labdip = '';
            swal({ title: "Good Job!", text: "You have sent new registers", type: "success" });
            req_ini();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}

/* General */
function fn_cleand_chk(_res) {
    //let valor = _res != undefined ? _res : true;
    let table = _('tablelabdipcontent'), arrchk = Array.from(table.getElementsByClassName('_chkitem'));
    arrchk.forEach(x=> {
        let fila = x.children[0].children[0];
        fila.children[0].checked = false;
        fila.classList.remove('checked');
    });
}

function fn_valid_combo(_val) {
    let idestadolab = _('cboestadolab').value;
    if (_val) {
        if (idestadolab == '1') {
            _('btnreceive').classList.remove('hide');
            _('btnexport').classList.add('hide');
            _('btnrejected').classList.add('hide');
            _('btnedit').classList.add('hide');
            _('btndelete').classList.add('hide');
        }
        else if (idestadolab == '2') {
            _('btnreceive').classList.add('hide');
            _('btnexport').classList.remove('hide');
            _('btnrejected').classList.remove('hide');
            _('btnedit').classList.remove('hide');           
            _('btndelete').classList.remove('hide');
        }
        else {
            _('btnreceive').classList.add('hide');
            _('btnexport').classList.add('hide');
            _('btnrejected').classList.add('hide');
            _('btnedit').classList.add('hide');         
            _('btndelete').classList.add('hide');
        }
    }
    else {
        _('btnreceive').classList.add('hide');
         _('btnrejected').classList.add('hide');
        _('btnexport').classList.add('hide');
        _('btnedit').classList.add('hide');       
        _('btndelete').classList.add('hide');
    }
}

function event_search(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        req_search();
    }
}

function req_search() {
   
    req_load_labdip();
}

/* Inicial */
function req_ini() {
    let par = JSON.stringify({ idgrupopersonal: 0, idactive: 3 });
    let urlaccion = 'Laboratorio/LabDipReceive/LabDipReceive_List?par=' + par;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].cliente != '') { ovariables_labdipre.arrcliente = orpta[0].cliente; }
        if (orpta[0].labdip != '') { ovariables_labdipre.arrlabdip = orpta[0].labdip; }
        fn_load_cliente();

        req_load_labdip();
    }
}

function fn_load_cliente() {
    let arrcliente = JSON.parse(ovariables_labdipre.arrcliente);
    let cbocliente = `<option value='0'>All Client</option>`;
    arrcliente.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('cbocliente').innerHTML = cbocliente;
    $('#cbocliente').select2();
}

function fn_change_cbo() {
    fn_cleand_chk();
    ovariables_labdipre.arrcheckeados = [];
    req_load_labdip();
}

function req_load_labdip() {
    let arrlabdip = JSON.parse(ovariables_labdipre.arrlabdip);
    let idcliente = _('cbocliente').value, idestadolab = _('cboestadolab').value
    codigo = _('txtfilter').value, estadolabdip = 1;
    if (idestadolab == '1') { estadolabdip = 0; }

    let result = arrlabdip.filter(x=>
        (idcliente === '0' || x.idcliente.toString() === idcliente) &&
              (idestadolab === '' || x.idestadolab.toString() === idestadolab) &&
               (estadolabdip === 1 || x.estadolabdip === estadolabdip) &&
            ((x.codigocolor.indexOf(codigo) > -1 || x.codigocolor.toLowerCase().indexOf(codigo) > -1) ||
             (x.color.indexOf(codigo) > -1 || x.color.toLowerCase().indexOf(codigo) > -1) ||
                 (x.fabric.indexOf(codigo) > -1 || x.fabric.toLowerCase().indexOf(codigo) > -1))
       );

    if (result.length > 0) {
        _('datos').classList.add('hide');
        fn_valid_combo(true);
        fn_load_data(result);
    }
    else {
        _('datos').classList.remove('hide');
        fn_valid_combo(false);
        let divtabla = _('tablelabdipcontent'), tabla = divtabla.children[0];
        if (tabla != undefined) { divtabla.children[0].remove(divtabla); }
    }
}

function fn_load_data(result) {
    let resultadolabdip = result, html = '', htmlbody = '';
    let estadolaboratorio = _('cboestadolab').value;

    html = `
        <table id='tablelabdip'  class ='stripe row-border order-column' style='width: 100%; max-width: 100%;  padding-right: 0px;'>
            <thead>
               <th style='width:2%'><div  class ='i-checks _clsdivall'>
                        <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkall' style='position: absolute; opacity: 0;'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                            </label>
                        </div>
                         <i></i>All
                    </div>
                </th>
                <th style='width:3%'>Status Final</th>
                <th style='width:3%'>Status Lab</th>
                <th style='width:10%'>Color</th>
                <th style='width:11%'>Code Dyeing House</th>
                <th style='width:6%'>Season</th>
                <th style='width:6%'>Type</th>
                <th style='width:17%'>Fabric</th>
                <th style='width:14%'>Client</th>
                <th style='width:10%'>Dyeing House</th>
                <th style='width:10%'>Origin</th>
                <th style='width:4%'>Numero Partida</th>
            </thead>
            <tbody>
        `;

    //let pending = '-';
    //let received = '-';
    //if (x.idestadolab == 1) {
    //    pending = `<button class='text-center btn btn-outline btn-primary'><span class='fa fa-check-circle'></span></button>`;
    //}
    //if (x.idestadolab == 2) {
    //    pending = `<button class='text-center btn btn-outline btn-primary' ><span class='fa fa-check-circle'></span></button>`;
    //    if (x.habilitado == 1) {
    //        received = `<button class='text-center btn btn-outline btn-primary'><span class='fa fa-check-circle'></span></button>`;
    //    }
    //    else { received = `<button class='text-center btn btn-outline btn-warning'><span class='fa fa-check-circle'></span></button>`; }
    //}
    //if (x.idestadolab == 3) {
    //    pending = `<button class='text-center btn btn-outline btn-primary'><span class='fa fa-check-circle'></span></button>`;
    //    received = `<button class='text-center btn btn-outline btn-danger'><span class='fa fa-ban'></span></button>`;
    //}
    //if (x.estadolabdip == 0) {
    //    statusfinal = `<button class='text-center btn btn-outline btn-success' onclick="req_info(${x.idlabdip})"><span class='fa fa-check'></span></button>`;
    //} else {
    //    statusfinal = `<button class='text-center btn btn-outline btn-danger' ><span class='fa fa-power-off'></span></button>`;
    //}

    resultadolabdip.forEach(x=> {
        let estadolab = '-';        
        if (x.idestadolab == 1) {
            estadolab = `<button class='text-center btn btn-outline btn-primary'  onclick="req_info(${x.idlabdip})"><span class='fa fa-send'></span></button>`;
        }
        if (x.idestadolab == 2) {          
            if (x.habilitado == 1) {
                estadolab = `<button class='text-center btn btn-outline btn-primary'  onclick="req_info(${x.idlabdip})"><span class='fa fa-check-circle'></span></button>`;
            }
            else { estadolab = `<button class='text-center btn btn-outline btn-warning'  onclick="req_info(${x.idlabdip})"><span class='fa fa-check-circle'></span></button>`; }
        }
        if (x.idestadolab == 3) {
            estadolab = `<button class='text-center btn btn-outline btn-danger'  onclick="req_info(${x.idlabdip})"><span class='fa fa-ban'></span></button>`;
        }

        if (x.estadolabdip == 0) {
            statusfinal = `<button class='text-center btn btn-outline btn-success' onclick="req_info(${x.idlabdip})"><span class='fa fa-check'></span></button>`;
        } else {
            statusfinal = `<button class='text-center btn btn-outline btn-danger'  onclick="req_info(${x.idlabdip})"><span class='fa fa-power-off'></span></button>`;
        }

        if (estadolaboratorio == 2) {
            numeropartida = `<td class ='text-center' onclick="fn_alert(${x.idlabdip},'${x.codigocolor}','${x.color}')">
                  <input type="text" id="txtfilter" disabled name="status" value='${x.numeropartida}' class ="form-control">
                </td>`;
        }
        else {
        
            numeropartida = `<td class ='text-center'>${x.numeropartida}</td>`;
        }

        htmlbody += `
            <tr data-par='idlabdip:${x.idlabdip},idestadolab:${x.idestadolab}' id="${x.idlabdip}">
                <td class ='text-center'>
                    <div  class ='i-checks _clsdivlabdip'>
                        <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;' id='chklabdip' data-labdip='${x.idlabdip}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                            </label>
                        </div>
                    </div>
                </td>
                <td class ='text-center'>${statusfinal}</td>
                <td class ='text-center'>${estadolab}</td>
                <td>${x.color}</td>
                <td>${x.codigocolor}</td>
                <td>${x.temporada}</td>
                <td>${x.tipo}</td>
                <td>${x.fabric}</td>
                 <td>${x.cliente}</td>
                <td>${x.tintoreria}</td>
                 <td class='text-center'>${x.labdippadre}</td>
                 ${numeropartida}
            </tr>
            `;
    });

    html += htmlbody + `</tbody></table>`;
    _('tablelabdipcontent').innerHTML = html;

    let table = _('tablelabdip');
    let arrchk = Array.from(table.getElementsByClassName('_chkitem'));
    let x = "";
    if (arrchk.length > 0) {
        arrchk.forEach(x=> {
            if (ovariables_labdipre.arrcheckeados.length > 0) {
                let fila = x.parentNode.parentNode.parentNode;
                let m = fila.getAttribute('data-par');
                let chk = x.children[0].children[0];
                if (chk != undefined) {
                    chk.checked = ovariables_labdipre.arrcheckeados.some(y=> {
                        return (y.idlabdip.toString() === _par(m, 'idlabdip'))
                    });
                }
            }
        })
    }

    handler_table('tablelabdip');
    formatTable();

}

function fn_alert(_id, _codtinto, _color) {
    let opar = `idlabdip:${_id},codtinto:${_codtinto},color:${_color}`;
    fn_partida(opar);

}

function fn_partida(par) {

    _modalBody({
        url: 'Laboratorio/LabDipReceive/_partida',
        ventana: '_partida',
        titulo: 'Partida',
        parametro: par,
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });
}


/*
function fn_load_cliente() {
    let arrcliente = JSON.parse(ovariables_labdipre.arrcliente);
    let cbocliente = `<option value='0'>All Client</option>`;
    arrcliente.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('cbocliente').innerHTML = cbocliente;
    if (ovariables_labdipre.idcliente != '') {
        _('cbocliente').value = ovariables_labdipre.idcliente;
    }
    fn_load_labdip();
}
*/

/*
function fn_change_client() {
    ovariables_labdipre.idcliente = _('cbocliente').value;
    req_ini();
}
*/

/*
function fn_load_labdip() {
    let idcliente = _('cbocliente').value;
    let arrlabdip = JSON.parse(ovariables_labdipre.arrlabdip);
    let result = arrlabdip.filter(x=>   (idcliente === '0' || x.idcliente.toString() === idcliente) && x.idestadolab === 1);
    //let result = arrlabdip.filter(x=>   (idcliente === '0' || x.idcliente.toString() === idcliente));
    if (result.length > 0) { fn_load_data(result) }
    else {
        let divtabla = _('tablelabdipcontent'), tabla = divtabla.children[0];
        if (tabla != undefined) { divtabla.children[0].remove(divtabla); }
    }
}
*/

/*
function fn_load_data(result) {
    let resultadolabdip = result, html = '', htmlbody = '';

    html = `
        <table id='tablelabdip'  class ='stripe row-border order-column' style='width:100%'>
            <thead>
                <th><div  class ='i-checks _clsdivall'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkall' style='position: absolute; opacity: 0;'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                            </label>
                        </div>
                         <i></i>All
                    </div>
                </th>
                <th>Color</th>
                <th>Standard</th>
                <th>Season</th>
                <th>Type</th>
                <th>Code Dyeing House</th>
                <th>Alternative</th>
                <th>Cliente</th>
                <th>Dyeing House</th>
            </thead>
            <tbody>
        `;

    resultadolabdip.forEach(x=> {
        htmlbody += `
            <tr data-par='idlabdip:${x.idlabdip},idestadolab:${x.idestadolab}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsdivlabdip'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;' id='chklabdip' data-labdip='${x.idlabdip}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.color}</td>
                <td>${x.standard}</td>
                <td>${x.temporada}</td>
                <td>${x.tipo}</td>
                <td>${x.codigocolor}</td>
                <td>${x.alternativa}</td>
                <td>${x.cliente}</td>
                <td>${x.tintoreria}</td>

            </tr>
            `;
    })

    html += htmlbody + `</tbody></table>`;
    _('tablelabdipcontent').innerHTML = html;

    handler_table('tablelabdip');
    //formatTable();
}
*/

function formatTable() {
    $('#tablelabdip').DataTable({
        scrollY: "455px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        searching: false,
        info: false,
        bPaginate: false
        //"pageLength": 50
    });
}

function handler_table(_idtable) {  
    $('.i-checks._clsdivlabdip').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let m = e.currentTarget, arrchk = [], obj = {};
        let x = m.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let par = x.getAttribute('data-par');
        let idlabdip = _par(par, 'idlabdip');
        obj.idlabdip = idlabdip;
        if (ovariables_labdipre.arrcheckeados.length > 0) {
            arrchk = ovariables_labdipre.arrcheckeados.filter(x=> x.idlabdip.toString() !== idlabdip);
            ovariables_labdipre.arrcheckeados = arrchk;
        }

        if (m.checked) { ovariables_labdipre.arrcheckeados.push(obj); }
    });
    

    $('.i-checks._clsdivall').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let m = e.currentTarget, arrchk = [], obj = {};
        let filas = Array.from(document.getElementById('tablelabdip').tBodies[0].rows);
        filas.forEach(x=> {
            obj = {};
            let par = x.getAttribute('data-par');
            let idlabdip = _par(par, 'idlabdip');
            obj.idlabdip = idlabdip;
            let fila = x.children[0].children[0].children[0].children[0].children[0].children[0];
           
            if (ovariables_labdipre.arrcheckeados.length > 0) {
                arrchk = ovariables_labdipre.arrcheckeados.filter(x=> x.idlabdip.toString() !== idlabdip);
                ovariables_labdipre.arrcheckeados = arrchk;
            }

            if (m.checked) { ovariables_labdipre.arrcheckeados.push(obj); fila.checked = true; }
            else { fila.checked = false; }
        });
        handler_table('tablelabdip');
    });
}

/* Detalle */

function req_info(_idlabdip) {
    let opar = `idlabdip:${_idlabdip}`;

    _modalBody({
        url: 'Laboratorio/LabDipReceive/_Detalle',
        ventana: '_Detalle',
        titulo: 'Detalle Labdip',
        parametro: opar,
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });
}



(function ini() {
    load();
    req_ini();
})()
var ovariables_labdip_temp = {
    idgrupopersonal: '',
    arrcliente: '',
    arrlabdip: '',
    idcliente:''
}

function load() {
    _('btnlabdipsend_temp').addEventListener('click', (x) => { fn_send_labdip_temp('1') });
    _('btnlabdipsticker_temp').addEventListener('click', (x) => { fn_send_labdip_temp('ListarLabdipPDF') });
    _('btnlabdipdocumento_temp').addEventListener('click', (x) => { fn_send_labdip_temp('ListarLabdipResumenPDF') });

    _('cboclientetemp').addEventListener('change', fn_change_cbotemp);
 
}

function cleandata() {
    ovariables_labdip_temp.arrcliente = '';
    ovariables_labdip_temp.arrlabdip = '';
}

function fn_change_cbotemp() {
    req_load_labdip_temp();
}

function fn_send_labdip_temp(_metodoPDF) {
    let divtabla = _('tablelabdipcontenttemp'), tabla = divtabla.children[0];
    if (tabla != undefined) {
        let labdipsend = fn_get_labdip_temp('tablelabdiptemp');
        if (labdipsend.length > 0) {
            if (_metodoPDF == '1') {
                swal({
                    title: "Save Data",
                    text: "Are you sure send these register?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    req_insert_temp();
                });
            }
            else {

                let urlaccion = urlBase() + `GestionProducto/LabDip/${_metodoPDF}?par=${JSON.stringify(labdipsend)}`;
                _getFile(urlaccion, 100);
            }
          
        } else { swal({ title: "Alert", text: "You have to select a register", type: "warning" }); }
    }
    else { swal({ title: "Alert", text: "You have to search data", type: "warning" }); }
}

function fn_get_labdip_temp(_idtabla) {
    let table = _(_idtabla).tBodies[0], arrchklabdip = [...table.getElementsByClassName('checked')], obj = {}, arrlabdip = [];
    if (arrchklabdip.length > 0) {
        arrchklabdip.forEach(x=> {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.idlabdip = _par(par, 'idlabdip');
            arrlabdip.push(obj);
        })
    }
    return arrlabdip;
}

function _getFile(_urlaccion, tiempo) {
    tiempo = tiempo || 100;
    _promise(tiempo)
    .then(() => {
        var link = document.createElement('a');
        link.href = _urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    })
}



function req_insert_temp() {
    let urlaccion = 'GestionProducto/Labdip/Labdip_Insert';
    let obotones = { idpantalla: 1 },
        arrdata = JSON.stringify(fn_get_labdip('tablelabdiptemp')),
        form = new FormData();
    form.append('parhead', JSON.stringify(obotones));
    form.append('pardetail', arrdata);
    Post(urlaccion, form, res_insert_temp);
}

function res_insert_temp(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good Job!", text: "You have sent new registers", type: "success" });
            cleandata();
            req_ini_temp();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}


function req_ini_temp() {
    let urlaccion = 'GestionProducto/LabDip/LabDip_List?idgrupopersonal=' + ovariables_labdip.idgrupopersonal;
    Get(urlaccion, res_ini_temp);
}

function res_ini_temp(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].cliente != '') { ovariables_labdip_temp.arrcliente = orpta[0].cliente; }
        if (orpta[0].labdip != '') { ovariables_labdip_temp.arrlabdip = orpta[0].labdip; }
        fn_load_cliente_temp();
        req_load_labdip_temp();
    }
}

function fn_load_cliente_temp() {
    let arrcliente = JSON.parse(ovariables_labdip_temp.arrcliente);
    let cbocliente = `<option value='0'>All Client</option>`;
    arrcliente.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('cboclientetemp').innerHTML = cbocliente;
}

function req_load_labdip_temp() {
    let arrlabdip = JSON.parse(ovariables_labdip_temp.arrlabdip);
    let idcliente = _('cboclientetemp').value;
    let result = arrlabdip.filter(x=> (idcliente === '0' || x.idcliente.toString() === idcliente) && x.idestadolab === 0);

    if (result.length > 0) { fn_load_data_temp(result) }
    else {
        let divtabla = _('tablelabdipcontenttemp'), tabla = divtabla.children[0];
        if (tabla != undefined) { divtabla.children[0].remove(divtabla); }
    }
}

function fn_load_data_temp(result) {
    let resultadolabdip = result, html = '', htmlbody = '';

    html = `
        <table id='tablelabdiptemp'  class ='stripe row-border order-column' style='width: 100%; max-width: 100%;  padding-right: 0px;'>
            <thead>
                <th><div  class ='i-checks _clsdivalltemp'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkalltemp' style='position: absolute; opacity: 0;'>
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
                <th>Client</th>
                <th>Alternative</th>
                <th>Dyeing House</th>
            </thead>
            <tbody>
        `;

    resultadolabdip.forEach(x=> {
        htmlbody += `
            <tr data-par='idlabdip:${x.idlabdip},idestadolab:${x.idestadolab}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsdivlabdiptemp'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschklabdiptemp' style='position: absolute; opacity: 0;' id='chklabdip' data-labdiptemp='${x.idlabdip}'>
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
                <td>${x.cliente}</td>
                <td>${x.alternativa}</td>
                <td>${x.tintoreria}</td>

            </tr>
            `;
    })

    html += htmlbody + `</tbody></table>`;
    _('tablelabdipcontenttemp').innerHTML = html;

    handler_table_temp('tablelabdiptemp');
    formatTable_temp();
}

function handler_table_temp(_idtable) {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

     $('.i-checks._clsdivalltemp').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let m = e.currentTarget;
        let filas = Array.from(document.getElementById('tablelabdiptemp').tBodies[0].rows);
        filas.forEach(x=> {
            let fila = x.children[0].children[0].children[0].children[0].children[0].children[0];
            if (m.checked) {
                fila.checked = true;
            } else {
                fila.checked = false;
            }
        });
        handler_table_temp('tablelabdiptemp');
    });
}

function formatTable_temp() {
    $('#tablelabdiptemp').DataTable({
        scrollY: "455px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        searching: false,
        info: false,
        bPaginate: false
    });
}


(function ini() {
    load();
    req_ini_temp();
})();
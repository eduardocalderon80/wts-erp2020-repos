//Gestion Producto
var ovariables_labdip = {
    idgrupopersonal: '',
    arrcliente: '',
    arrlabdip: '',
    arrcheckeados: '',
    idcliente: '',
    idestadolab: '',
    idactive: 0,
}

function load() {


    let par = _('txtpar').getAttribute('data-par');
    ovariables_labdip.idgrupopersonal = _par(par, 'idgrupocomercial');

    _('btnlabdipsend').addEventListener('click', (x) => { fn_send_labdip('send') });
    _('btnlabdipsticker').addEventListener('click', (x) => { fn_send_labdip('ListarLabdipPDF') });
    _('btnlabdipdocumento').addEventListener('click', (x) => { fn_send_labdip('ListarLabdipResumenPDF') });

    $(".select2_estadolab").select2();
    $('#cbocliente').on('change', fn_change_cbo);
    $('#cboestadolab').on('change', fn_change_cbo);
    //_('cbocliente').addEventListener('change', fn_change_cbo);
    //_('cboestadolab').addEventListener('change', fn_change_cbo);
    
    var elem = document.querySelector('.js-switch');
    var init = new Switchery(elem);
    elem.onchange = function () {
        if (elem.checked) {
            ovariables_labdip.idactive = 1;
            ovariables_labdip.arrcheckeados = '';
            fn_cleand_chk();
            req_ini();
            //ovariables.allclientes = 1;
            //fn_loadcliente(ovariables.cliente);
            //fn_cleandata();

        } else {
            ovariables_labdip.arrcheckeados = '';
            ovariables_labdip.idactive = 0;
            fn_cleand_chk();
            req_ini();
            //ovariables.allclientes = 0;
            //fn_loadcliente(ovariables.clientepersonal);
            //fn_cleandata();
        };
        //req_info();
    };
}


function event_search(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        req_search();
    }
}

function req_search() {

    let table = _('tablelabdip') == null ? '' : 'ok';
    if (table == 'ok') {
        if (ovariables_labdip.arrcheckeados == '') {
            ovariables_labdip.arrcheckeados = fn_get_labdip('tablelabdip');
        } else {
            let news = fn_get_labdip('tablelabdip'), obj = {}, arr = [];
            ovariables_labdip.arrcheckeados = (ovariables_labdip.arrcheckeados.concat(news));
        }
    } else { ovariables_labdip.arrcheckeados = ''; }

    req_load_labdip();
}

function fn_send_labdip(_metodo) {

    let divtabla = _('tablelabdipcontent'), tabla = divtabla.children[0];
    if (tabla != undefined) {
        let idcliente = _('cbocliente').value, idestadolab = _('cboestadolab').value;

        if (idcliente == '0' || idestadolab == '') {
            swal({ title: "Alert", text: "You have to select only a client and status", type: "warning" });
        }
        else {
            let labdipsend = fn_get_labdip('tablelabdip');

            if (labdipsend.length > 0) {
                if (_metodo == 'send') {
                    let pending = _('cboestadolab').value;
                    if (pending == '0') {
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
                            req_insert();
                        });
                    }
                    else { swal({ title: "Alert", text: "You can send only pending labdip", type: "warning" }); }
                }
                else {

                    let urlaccion = urlBase() + `GestionProducto/LabDip/${_metodo}?par=${JSON.stringify(labdipsend)}`;
                    _getFile(urlaccion, 100);
                }

            } else {
                swal({ title: "Alert", text: "You have to select a register", type: "warning" });
            }
        }
    }
    else {
        swal({ title: "Alert", text: "You have to search data", type: "warning" });
    }

}

function fn_get_labdip(_idtabla) {
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

function fn_change_cbo() {
    let res = fn_valid_combo();
    _('txtcodigocolor').value = '';
    fn_cleand_chk(res);
    ovariables_labdip.arrcheckeados = '';
    req_load_labdip();
}

function fn_cleand_chk(_res) {
    let valor = _res != undefined ? _res : true;
    let table = _('tablelabdipcontent'), arrchk = Array.from(table.getElementsByClassName('_chkitem'));
    arrchk.forEach(x=> {
        let fila = x.children[0].children[0];
        fila.children[0].checked = !valor;
        fila.classList.remove('checked');
    });
}

function fn_valid_combo() {
    let idcliente = _('cbocliente').value, idestadolab = _('cboestadolab').value, resultado = false;
    if (idcliente == '0' || idestadolab == '') { resultado = true; }
    else { resultado = false; }
    return resultado;
}

function valid_botones(_val) {
    let idcliente = _('cbocliente').value, idestadolab = _('cboestadolab').value;
    if (_val == 'ok') {
        if (idcliente == '0' || idestadolab == '3') {
            _('btnlabdipsend').classList.add('hide');
            _('btnlabdipsticker').classList.add('hide');
            _('btnlabdipdocumento').classList.add('hide');
        }
        else if (idestadolab == '1' || idestadolab == '2') {
            _('btnlabdipsend').classList.add('hide');
            _('btnlabdipsticker').classList.remove('hide');
            _('btnlabdipdocumento').classList.remove('hide');
        }
        else {
            if (_val == 'ok') {
                _('btnlabdipsend').classList.remove('hide');
                _('btnlabdipsticker').classList.remove('hide');
                _('btnlabdipdocumento').classList.remove('hide');
            } else {
                _('btnlabdipsend').classList.add('hide');
                _('btnlabdipsticker').classList.add('hide');
                _('btnlabdipdocumento').classList.add('hide');
            }
        }
    } else {
        _('btnlabdipsend').classList.add('hide');
        _('btnlabdipsticker').classList.add('hide');
        _('btnlabdipdocumento').classList.add('hide');
    }
}

function req_insert() {
    let urlaccion = 'GestionProducto/Labdip/Labdip_Insert';
    let obotones = { idpantalla: 1 },
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
            ovariables_labdip.idcliente = _('cbocliente').value;
            ovariables_labdip.idestadolab = _('cboestadolab').value;
            swal({ title: "Good Job!", text: "You have sent new registers", type: "success" });

            req_ini();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}

function req_ini() {
    let par = JSON.stringify({ idgrupopersonal: ovariables_labdip.idgrupopersonal, idactive: ovariables_labdip.idactive });
    let urlaccion = 'GestionProducto/LabDip/LabDip_List?par=' + par;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].cliente != '') { ovariables_labdip.arrcliente = orpta[0].cliente; }
        if (orpta[0].labdip != null) { ovariables_labdip.arrlabdip = orpta[0].labdip; }
        fn_load_cliente();
        if (ovariables_labdip.idcliente != '') { _('cbocliente').value = ovariables_labdip.idcliente; ovariables_labdip.idcliente = ''; }
        if (ovariables_labdip.idestadolab != '') { _('cboestadolab').value = ovariables_labdip.idestadolab; ovariables_labdip.idestadolab = ''; }
        req_load_labdip();
        fn_cleand_chk();
    }
}

function fn_load_cliente() {
    let arrcliente = JSON.parse(ovariables_labdip.arrcliente);
    let cbocliente = `<option value='0'>All Client</option>`;
    arrcliente.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('cbocliente').innerHTML = cbocliente;
    $('#cbocliente').select2();
}

function req_load_labdip() {
    let arrlabdip = ovariables_labdip.arrlabdip;
    let idcliente = _('cbocliente').value, idestadolab = _('cboestadolab').value
    codigo = _('txtcodigocolor').value, estadolabdip = 1;
    if (idestadolab == '0' || idestadolab == '1') { estadolabdip = 0; }
    let result = [];

    if (arrlabdip != '') {
        let arr = JSON.parse(arrlabdip);
        result = arr.filter(x=>
            (idcliente === '0' || x.idcliente.toString() === idcliente) &&
                  (idestadolab === '' || x.idestadolab.toString() === idestadolab) &&
                   (estadolabdip === 1 || x.estadolabdip === estadolabdip) &&
                ((x.codigocolor.indexOf(codigo) > -1 || x.codigocolor.toLowerCase().indexOf(codigo) > -1) ||
                (x.color.indexOf(codigo) > -1 || x.color.toLowerCase().indexOf(codigo) > -1) ||
                 (x.fabric.indexOf(codigo) > -1 || x.fabric.toLowerCase().indexOf(codigo) > -1))
           );
    }

    if (result.length > 0) {
        _('datos').classList.add('hide');
        valid_botones('ok');
        fn_load_data(result)
    }
    else {
        _('datos').classList.remove('hide');
        valid_botones('no');
        let divtabla = _('tablelabdipcontent'), tabla = divtabla.children[0];
        if (tabla != undefined) {
            divtabla.children[0].remove(divtabla);
        }
    }
}

function fn_load_data(result) {
    let resultadolabdip = result, html = '', htmlbody = '';

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
                <th style='width:14%'>Color</th>
                <th style='width:9%'>Code Dyeing House</th>
                <th style='width:7%'>Season</th>
                <th style='width:7%'>Type</th>
                <th style='width:21%'>Fabric</th>
                <th style='width:12%'>Client</th>
                <th style='width:12%'>Dyeing House</th>
                <th style='width:10%'>Origin</th>
            </thead>
            <tbody>
        `;

    //let pending = '-';
    //let received = '-';
    //if (x.idestadolab == 1) {
    //    pending = `<button class='text-center btn btn-outline btn-primary'><span class='fa fa-check-circle'></span></button>`;
    //}
    //if (x.idestadolab == 2) {
    //    pending = `<button class='text-center btn btn-outline btn-primary'><span class='fa fa-check-circle'></span></button>`;
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
    //    statusfinal = `<button class='text-center btn btn-outline btn-success'><span class='fa fa-check'></span></button>`;
    //} else {
    //    statusfinal = `<button class='text-center btn btn-outline btn-danger'><span class='fa fa-power-off'></span></button>`;
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

        htmlbody += `
            <tr data-par='idlabdip:${x.idlabdip},idestadolab:${x.idestadolab}'>
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
                <td class ='text-center'>${x.labdippadre}</td>
            </tr>
            `;
    })

    html += htmlbody + `</tbody></table>`;
    _('tablelabdipcontent').innerHTML = html;

    let table = _('tablelabdip');
    let arrchk = Array.from(table.getElementsByClassName('_chkitem'));
    let x = "";
    if (arrchk.length > 0) {
        arrchk.forEach(x=> {
            if (ovariables_labdip.arrcheckeados.length > 0) {
                let fila = x.parentNode.parentNode.parentNode;
                let m = fila.getAttribute('data-par');
                let chk = x.children[0].children[0];
                if (chk != undefined) {
                    chk.checked = ovariables_labdip.arrcheckeados.some(y=> {
                        return (y.idlabdip.toString() === _par(m, 'idlabdip'))
                    });
                }
            }
        })
    }

    handler_table('tablelabdip');
    formatTable();

}

function handler_table(_idtable) {
    $('.i-checks._clsdivlabdip').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let m = e.currentTarget;
        let tr = m.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let data = tr.getAttribute('data-par');
        let par = _par(data, 'idlabdip');
        if (ovariables_labdip.arrcheckeados != '') {
            let arr = ovariables_labdip.arrcheckeados;
            ovariables_labdip.arrcheckeados = arr.filter(x=> x.idlabdip.toString() !== par);

        }
        handler_table('tablelabdip');
    });




    $('.i-checks._clsdivall').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let m = e.currentTarget;
        let filas = Array.from(document.getElementById('tablelabdip').tBodies[0].rows);
        filas.forEach(x=> {
            let fila = x.children[0].children[0].children[0].children[0].children[0].children[0];
            if (m.checked) {
                fila.checked = true;
            } else {
                fila.checked = false;
            }
        });
        handler_table('tablelabdip');
    });

}

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
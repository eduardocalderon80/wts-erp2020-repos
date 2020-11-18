var ovariables = {
    par: '',
    parurl: '',
    idlabdip: '',
    idtela: '',
    idtipotela: '',
    idgrupocomercial: '',
    grupolabdip:'',
    arrtipo: '',
    arraprobacion: '',
    arrdyeinghouse: '',
    arrtemporada: '',
    arrlabdips: '',
    tipoingreso:'0',
}

function load() {
    ovariables.par = _('txtpar_labdipdetail').value;
    ovariables.idlabdip = _par(ovariables.par, 'idlabdip');
    ovariables.idtela = _par(ovariables.par, 'idtela');
    ovariables.idtipotela = _par(ovariables.par, 'idtipotela');
    ovariables.idgrupocomercial = _par(ovariables.par, 'idgrupocomercial');
    ovariables.grupolabdip = _par(ovariables.par, 'grupolabdip');
    ovariables.parurl = { idlabdip: ovariables.idlabdip, idtela: ovariables.idtela, grupolabdip: ovariables.grupolabdip };

    _('btnadd').addEventListener('click', fn_add);
    _('btnsave').addEventListener('click', fn_save);
    _('btnclean').addEventListener('click', fn_clean_return); 
}

function required_radiobutton(oenty) {
    let divformulario = _(oenty.id), resultado = true;
    let elementsselect2 = divformulario.getElementsByClassName(oenty.clase);
    let array = Array.prototype.slice.apply(elementsselect2);
    array.forEach(x=> {
        valor = x.value, padre = x.parentNode;
        if (oenty.tipo == '0') { resultado = false; padre.classList.add('text-danger'); }
        else { padre.classList.remove('text-danger'); }

    });
    return resultado;
}

function required_select2(oenty) {
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

function get_maxidlabdip() {
    let idlabdipmax = 0;
    let filas = Array.from(document.getElementById('tablelabdipdetail').tBodies[0].rows);
    
    filas.forEach(x=> {
        let max = parseInt(_par((x.getAttribute('data-par')), 'idlabdip'));
        if (max > idlabdipmax) {
            idlabdipmax = max;
        }
    });
    return idlabdipmax + 1;
}

function fn_add() {
    let result = required_radiobutton({ id: 'formulario', clase: '_rad', tipo: ovariables.tipoingreso });
    if (result) {
        let req = required_select2({ id: 'formulario', clase: '_enty' });
        if (req) {
            let idlabdipmax = 0, idlabdipcreador = 0, idlabdippadre = 0, idlabdip = 0;
            let labdippadre = '-', fechaprobacion = '-', statuslabdip = '-', rownew = 0;
            let color = _('txtcolor').value, standar = _('txtstandard').value;
            let idtipo = _('cbotipo').value, type = _('cbotipo').options[_('cbotipo').selectedIndex].text;
            let idaprobacion = _('cboaprobacion').value, aprobado = _('cboaprobacion').options[_('cboaprobacion').selectedIndex].text;
            let idtintoreria = _('cbotintoreria').value, tintoreria = _('cbotintoreria').options[_('cbotintoreria').selectedIndex].text;
            let idtemporada = _('cbotemporada').value, temporada = _('cbotemporada').options[_('cbotemporada').selectedIndex].text;

            if (ovariables.tipoingreso == '1') {
                let arrchk = _('tablatemp').getElementsByClassName('row-selected');
                if (arrchk.length > 0) {
                    let par = arrchk[0].getAttribute('data-par');
                    idlabdipcreador = _par(par, 'idlabdipcreador');
                    idlabdippadre = _par(par, 'idlabdippadre');
                    labdippadre = _par(par, 'labdippadre');
                    rownew = _par(par, 'row');
                    idlabdip = get_maxidlabdip();
                    fn_clean_return();
                }
                else { swal({ title: 'Alert!', text: 'You have to select a register', type: 'warning' }); return; }
            }
            else {

                idlabdipmax = get_maxidlabdip();
                idlabdipcreador = idlabdipmax, idlabdip = idlabdipmax;
            }

            let htmlbodytemp = `<tr data-par='idlabdipcreador:${idlabdipcreador},idlabdip:${idlabdip},idlabdippadre:${idlabdippadre},idestadorelacion:0,idtipo:${idtipo},idaprobacion:${idaprobacion},idtintoreria:${idtintoreria},idtemporada:${idtemporada},statuslabdip:0,registro:0'>
                    <td class ='text-center'>
                        <div  class ='i-checks _clsdivlabdip'>
                            <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                <label>
                                    <input value=${idlabdip} type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                </label>
                            </div>
                        </div>
                    </td>
                    <td>${color}</td>
                    <td>${standar}</td>
                    <td>${type}</td>
                    <td>${aprobado}</td>
                    <td></td>
                    <td>${tintoreria}</td>
                    <td>${temporada}</td>
                    <td class ='text-center'>${labdippadre}</td>
                    <td class ='text-center'>${statuslabdip}</td>
                    <td class ='text-center'>${fechaprobacion}</td>
                </tr>`

            if (ovariables.tipoingreso == '1') {
                _('tablelabdipdetail').tBodies[0].rows[rownew].insertAdjacentHTML('afterend', htmlbodytemp);
                let trnew = _('tablelabdipdetail').tBodies[0].rows[parseInt(rownew) + 1];
                trnew.children[0].children[0].children[0].children[0].children[0].checked = true;
                let trold = _('tablelabdipdetail').tBodies[0].rows[parseInt(rownew)];
                trold.children[0].children[0].children[0].children[0].children[0].checked = false;
                trold.children[0].children[0].children[0].children[0].children[0].children[0].checked = false;
                let m = "";
            } else {
                _('tablelabdipdetail').tBodies[0].insertAdjacentHTML('beforeend', htmlbodytemp);
                let filas = _('tablelabdipdetail').tBodies[0].rows, ultimafila = _('tablelabdipdetail').tBodies[0].rows.length - 1;
                filas[ultimafila].cells[0].children[0].children[0].children[0].children[0].checked = true;
            }

            handler_check();
            clean_form();

        } else { swal({ title: 'Alert!', text: 'You have to complete data required', type: 'warning' }); }
    } else { swal({ title: 'Alert!', text: 'You have to select "LINK" or "LAST VERSION"', type: 'warning' }); }
}

function fn_clean_return() {
    view_items(0);
    _('tablelabdiptempview').tBodies[0].innerHTML = '';   
}

function view_items(_val) {
    if (_val == 1) {
        _('btnsave').classList.add('hide');
        //_('btnadd').classList.add('hide');       
        //_('btnclean').classList.remove('hide');
        _('tablageneral').classList.add('hide');
        _('tablatemp').classList.remove('hide');
        //_('idlink').classList.add('hide');
    } else {
        _('btnsave').classList.remove('hide');
        //_('btnadd').classList.remove('hide');
        //_('btnclean').classList.add('hide');
        _('tablageneral').classList.remove('hide');
        _('tablatemp').classList.add('hide');
        //_('idlink').classList.remove('hide');
    }  
}

function clean_form() {
    _('txtcolor').value='';
    _('txtstandard').value = '';
    $('#cbotipo').select2('val', '');
    $('#cboaprobacion').select2('val', '');
    $('#cbotintoreria').select2('val', '');
    $('#cbotemporada').select2('val', '');
    ovariables.tipoingreso = '0';
    let arrbtn = Array.prototype.slice.apply(_('formulario').getElementsByClassName('_rad'));
    arrbtn.forEach(x=> {
        let y = x.parentNode.children[0].children[0].children[0].children[0];
        y.checked = false;
    });
    handler_check();
}

function fn_return() {
    let urlaccion = 'GestionProducto/ProyectoTela/Edit';
    let par = 'idtipotela:' + ovariables.idtipotela + ',idtela:' + ovariables.idtela + ',idgrupocomercial:' + ovariables.idgrupocomercial;
    _Go_Url(urlaccion, urlaccion, par);
}




function fn_save() {
    swal({
        title: "Are you sure save these values?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_new();
    });
}

function req_new() {
    let urlaccion = 'GestionProducto/ProyectoTela/LabdipDetails_Insert';
    let arrdata = JSON.stringify(fn_getdata('tablelabdipdetail'));
    form = new FormData();
    form.append('parhead', JSON.stringify(ovariables.parurl));
    form.append('pardetail', arrdata);
    Post(urlaccion, form, res_new);
}

function res_new(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good Job!", text: "You have registered new Data", type: "success", closeOnConfirm: true });
            $('#modal_LabdipDetails').modal('hide');
            fn_return();
        };
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
        }
    }
}

function fn_getdata(_idtable) {
    let table = _(_idtable),
        array = table.tBodies[0].rows,
        array2 = [...table.tBodies[0].rows],
        arrayresult = [], obj = {};
    if (array2.length > 0) {
        array2.forEach(x=> {
            obj = {};
            let par = x.getAttribute('data-par');
            if (par != null) {
                let chk = x.cells[0].children[0].children[0].children[0].children[0].children[0].checked;
                if (chk) { idestado = 0 } else { idestado = 1 }
                idlabdipcreador = _par(par, 'idlabdipcreador');
                idlabdip = _par(par, 'idlabdip');
                idlabdippadre = _par(par, 'idlabdippadre');
                idtipo = _par(par, 'idtipo');
                idaprobacion = _par(par, 'idaprobacion');
                idtintoreria = _par(par, 'idtintoreria');
                idtemporada = _par(par, 'idtemporada');
                registro = _par(par, 'registro');
                
                obj.idlabdipcreador = idlabdipcreador;
                obj.idlabdip = idlabdip;
                obj.idlabdippadre = idlabdippadre;
                obj.labdip = x.cells[1].innerHTML;
                obj.standard = x.cells[2].innerHTML;
                obj.idtipo = idtipo;
                obj.idaprobacion = idaprobacion;
                obj.idtintoreria = idtintoreria;
                obj.idtemporada = idtemporada;
                obj.registro = registro;
                obj.idestadorelacion = idestado;
                arrayresult.push(obj);
            }
        });
    }
    return arrayresult;
}

function fn_clean() {
    valid_form(true);
}

function valid_form(_tipo) {
    let controles = _('formulario').getElementsByClassName('_enty');
    let arr = Array.from(controles);
    arr.forEach(x=> { x.disabled = _tipo; });

    if (_tipo == false) { _tipo = true; } else { _tipo = false; }
    
    let filas = _('tablelabdipdetail').tBodies[0];
    let det = Array.from(filas.getElementsByClassName('_chkitem'));
    det.forEach(x=> {
        x.children[0].children[0].children[0].disabled = _tipo;
    });
}

function chk_delete() {
    let filas = _('tablelabdipdetail').tBodies[0];
    let det = Array.from(filas.getElementsByClassName('_chkitem'));
    det.forEach(x=> {
        let chk = x.children[0].children[0].children[0];
        if (chk != undefined) {
            chk.checked = false;
        }
        else { x.children[0].children[0].checked = false; }
       
    });
}

/*
function fn_add() {
    








    let table = _('tablelabdipdetail');
    let chk = table.getElementsByClassName('checked');
    let tr = chk[0].parentNode.parentNode.parentNode.parentNode.parentNode;    
    let par = tr.getAttribute('data-par');
    let idlabdipcreador = _par(par, 'idlabdipcreador');
    let idlabdippadre = _par(par, 'idlabdip');

    if (idlabdippadre != 0) {
        let req = _required({ id: 'formulario', clase: '_enty' });
        if (req) {
            let labdippadre = tr.cells[1].innerHTML;
            let color = _('txtcolor').value;
            let standar = _('txtstandard').value;
            let idtipo = _('cbotipo').value, type = _('cbotipo').options[_('cbotipo').selectedIndex].text;
            let idaprobacion = _('cboaprobacion').value, aprobado = _('cboaprobacion').options[_('cboaprobacion').selectedIndex].text;
            let idtintoreria = _('cbotintoreria').value, tintoreria = _('cbotintoreria').options[_('cbotintoreria').selectedIndex].text;
            let idtemporada = _('cbotemporada').value, temporada = _('cbotemporada').options[_('cbotemporada').selectedIndex].text;

            let htmlbodytemp = `<tr data-par='idlabdipcreador:${idlabdipcreador},idlabdip:0,idlabdippadre:${idlabdippadre},idestadorelacion:0,idtipo:${idtipo},idaprobacion:${idaprobacion},idtintoreria:${idtintoreria},idtemporada:${idtemporada},registro:0'>
                    <td class ='text-center'>
                        <div  class ='i-checks _clsdivlabdip'>
                            <div class ='iradio_square-green _chkitem' style='position: relative;' >
                                <label>
                                    <input value='0' name='radiobutton' type='radio' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                </label>
                            </div>
                        </div>
                    </td>
                    <td>${color}</td>
                    <td>${standar}</td>
                    <td>${type}</td>
                    <td>${aprobado}</td>
                    <td>${tintoreria}</td>
                    <td>${temporada}</td>
                    <td>${labdippadre}</td>
                </tr>`

            _('tablelabdipdetail').tBodies[0].insertAdjacentHTML('beforeend', htmlbodytemp);
            chk_delete();
            let filas = table.tBodies[0].rows, ultimafila = table.tBodies[0].rows.length - 1;
            filas[ultimafila].cells[0].children[0].children[0].children[0].children[0].checked = true;
            handler_table_temp('tablelabdipdetail');
        }
        else {
            swal({ title: "Alert", text: "You have to write a color", type: "warning" });
        }
    }
    else {
        swal({ title: "Observation!", text: "You haven't to select a new register", type: "warning" });
    }
}

*/

function req_ini() {
    if (!_isEmpty(ovariables.par)) {
        let urlaccion = `GestionProducto/ProyectoTela/LabdipDetails_Get?par=${JSON.stringify(ovariables.parurl)}`;
        Get(urlaccion, res_ini);
    }
}

function res_ini(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].tipo != '') { ovariables.arrtipo = orpta[0].tipo; }
        if (orpta[0].aprobacion != '') { ovariables.arraprobacion = orpta[0].aprobacion; }
        if (orpta[0].dyeinghouse != '') { ovariables.arrdyeinghouse = orpta[0].dyeinghouse; }
        if (orpta[0].temporada != '') { ovariables.arrtemporada = orpta[0].temporada; }
        if (orpta[0].labdips != '') { ovariables.arrlabdips = orpta[0].labdips; }
        fn_load_tipo();
        fn_load_aprobacion();
        fn_load_dyeinghouse();
        fn_load_temporada();
        fn_load_labdips();
    }
}

function fn_load_tipo() {
    let cbotipohtml = `<option value=''>Select</option>`;
    if (ovariables.arrtipo != '') {
        let arr = JSON.parse(ovariables.arrtipo);
        arr.forEach(x=> { cbotipohtml += `<option value='${x.idtipo}'>${x.tipo}</option>`; })
    }  
    _('cbotipo').innerHTML = cbotipohtml;
    _('cbotipo').value = '';
    $('#cbotipo').select2();
}

function fn_load_aprobacion() {
    let cboaprohtml = `<option value=''>Select</option>`;
    if (ovariables.arraprobacion != '') {
        let arr = JSON.parse(ovariables.arraprobacion);
        arr.forEach(x=> { cboaprohtml += `<option value='${x.idaprobacion}'>${x.aprobacion}</option>`; })
    }
    _('cboaprobacion').innerHTML = cboaprohtml;
    _('cboaprobacion').value = '';
    $('#cboaprobacion').select2();
}

function fn_load_dyeinghouse() {
    let cbotintohtml = `<option value=''>Select</option>`;
    if (ovariables.arrdyeinghouse != '') {
        let arr = JSON.parse(ovariables.arrdyeinghouse);
        arr.forEach(x=> { cbotintohtml += `<option value='${x.idtintoreria}'>${x.tintoreria}</option>`; })
    }
    _('cbotintoreria').innerHTML = cbotintohtml;
    _('cbotintoreria').value = '';
    $('#cbotintoreria').select2();
}

function fn_load_temporada() {
    let cbotempohtml = `<option value=''>Select</option>`;
    if (ovariables.arrtemporada != '') {
        let arr = JSON.parse(ovariables.arrtemporada);
        arr.forEach(x=> { cbotempohtml += `<option value='${x.idtemporada}'>${x.temporada}</option>`; })
    }
    _('cbotemporada').innerHTML = cbotempohtml;
    _('cbotemporada').value = '';
    $('#cbotemporada').select2();
}

function fn_load_labdips() {
    if (ovariables.arrlabdips.length > 0) {
        let arrlabdip = JSON.parse(ovariables.arrlabdips);
        let resultadolabdip = arrlabdip, html = '', htmlbody = '';

        html = `
        <table id='tablelabdipdetail'  class ='footable table table-stripped table-bordered'>
            <thead>
                <tr>
                   <th></th>
                    <th class ='text-center'>Color</th>
                    <th class ='text-center'>Standard</th>
                    <th class ='text-center'>Type</th>
                    <th class ='text-center'>Approval By</th>
                    <th class ='text-center'>Code DH</th>
                    <th class ='text-center'>Dyeing House</th>
                    <th class ='text-center'>Season</th>
                    <th class ='text-center'>Origin</th>
                    <th class ='text-center'>Status</th>
                    <th class ='text-center'>Date Approved</th>
                </tr>
            </thead>
            <tbody>
        `;

        resultadolabdip.forEach(x=> {
            htmlbody += `
            <tr data-par='idlabdipcreador:${x.idlabdipcreador},idlabdip:${x.idlabdip},idlabdippadre:${x.idlabdippadre},idestadorelacion:${x.estadorelacion},idtipo:${x.idtipo},idaprobacion:${x.idaprobacion},idtintoreria:${x.idtintoreria},idtemporada:${x.idtemporada},statuslabdip:${x.statuslabdip},registro:1'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsdivlabdip'>
                        <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                            <label>
                                <input value='${x.idlabdip}' type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.color}</td>
                <td>${x.standard}</td>
                <td>${x.tipo}</td>
                <td>${x.aprobacion}</td>
                <td>${x.codigocolortintoreria}</td>
                <td>${x.tintoreria}</td>
                <td>${x.temporada}</td>
                <td class ='text-center'>${x.labdippadre}</td>
                <td>${x.infostatuslabdip}</td>
                <td class ='text-center'>${x.fechaprobacion}</td>
            </tr>
            `;
        })
        html += htmlbody + `</tbody></table>`;
        _('tablecontaintlabdipdetailstempo').innerHTML = html;
        let table = _('tablelabdipdetail');
        let arrchk = Array.from(table.getElementsByClassName('_chkitem'));
        if (arrchk.length > 0) {
            arrchk.forEach(x=> {
                let fila = x.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');
                let estadorelacion = _par(par, 'idestadorelacion');
                if (estadorelacion == '0') {
                    fila.children[0].children[0].children[0].children[0].children[0].checked = true;
                }
            })
        }

        handler_check();
    }
}

function handler_check() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let x = e.currentTarget;
        let chk = x.checked;
        if (x.type == 'radio') {
            ovariables.tipoingreso = x.value;
            let id = (x.parentNode.parentNode.parentNode.parentNode).id;
            if (id == 'idchildren') {
                view_labdips_children();
                view_items(1);
            }
            else { fn_clean_return(); }
        }
        else {
            let tr = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            let idlabdipcreadorini = _par((tr.getAttribute('data-par')), 'idlabdipcreador');
            let idlabdipini = _par((tr.getAttribute('data-par')), 'idlabdip');

            let filas = Array.from(document.getElementById('tablelabdipdetail').tBodies[0].rows);
            let result = filas.filter(h=>(_par((h.getAttribute('data-par')), 'idlabdipcreador')).toString() === idlabdipcreadorini);
            
            if (result.length > 1) {
                result.forEach(p=> {
                    let fila = p.children[0].children[0].children[0].children[0].children[0].children[0];
                    let idlabdipcreador = _par((p.getAttribute('data-par')), 'idlabdipcreador');
                    let idlabdip = _par((p.getAttribute('data-par')), 'idlabdip');

                    if (idlabdipcreadorini == idlabdipcreador && idlabdipini == idlabdip) {
                        if (x.checked == false) {
                            x.checked = true;
                        }
                    }
                    else {
                        if (x.checked == true) {
                            fila.checked = false;
                        }
                    }

                });
            }           
        }
        handler_check();
    });
}

function view_labdips_children() {
    let tbody = '', arrchk = Array.from(_('tablelabdipdetail').getElementsByClassName('checked'));

    arrchk.forEach(x=> {
        let tr = x.parentNode.parentNode.parentNode.parentNode.parentNode;
        let row = tr.rowIndex - 1;
        let par = tr.getAttribute('data-par');        
        let statuslabdip = _par(par, 'statuslabdip');
        if (statuslabdip == '5') {
            let idlabdipcreador = _par(par, 'idlabdipcreador');
            let idlabdippadre = _par(par, 'idlabdip');
            let color = tr.cells[1].innerText;
            let standard = tr.cells[2].innerText;
            let type = tr.cells[3].innerText;
            let aprobacion = tr.cells[4].innerText;
            let codigo = tr.cells[5].innerText;
            let tintoreria = tr.cells[6].innerText;
            let temporada = tr.cells[7].innerText;
            let origen = tr.cells[8].innerText;
            let statuslabdip = tr.cells[9].innerText;
            let fecha = tr.cells[10].innerText;

            tbody += `<tr data-par='idlabdipcreador:${idlabdipcreador},idlabdippadre:${idlabdippadre},labdippadre:${color},row:${row}'>
                            <td>${color}</td>
                            <td>${standard}</td>
                            <td>${type}</td>
                            <td>${aprobacion}</td>
                             <td>${codigo}</td>
                            <td>${tintoreria}</td>
                            <td>${temporada}</td>
                            <td>${origen}</td>
                            <td>${statuslabdip}</td>
                            <td>${fecha}</td>
                        </tr>
                        `;
        }
    });

    _('tablelabdiptempview').tBodies[0].innerHTML = tbody;
    let tbl = _('tablelabdiptempview').tBodies[0], total = tbl.rows.length;
    handlertable_selected(total);
}

function handlertable_selected(indice) {
    let tbl = _('tablelabdiptempview').tBodies[0], rows = tbl.rows, row = rows[indice];
    let array = Array.from(rows);
    array.forEach(x=> { x.addEventListener('click', event_rows); });
}

function event_rows(e) {
    let o = e.currentTarget, row = o, tbl = _('tablelabdiptempview'), rows = tbl.rows;
    fn_clean_rows(rows);
    row.classList.add('row-selected');
}

function fn_clean_rows(rows) {
    let array = Array.from(rows);
    array.some(x=> {
        if (x.classList.contains('row-selected')) {
            x.classList.remove('row-selected');
            return true;
        }
    });
}


(function ini() {
    load();
    req_ini();
    handler_check();
})();

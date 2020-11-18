/// <reference path="../../Home/Util.js" />

var ovariables = {
    strJSNClientDivision: '',
    accionform: '0',
    arrClientDivision: '',
    arrClient: '',
    arrDivision: '',
    idgrupocomercial: '',
    intidcliente: '',
    arrPersonal:[]
}

function load() {
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');

    $(".select2_Cliente").select2({
        placeholder: "Select Client",
        allowClear: false
    });

    $(".select2_marca").select2({
        allowClear: false
    });

    $('.footable').footable();
    $('.footable').trigger('footable_resize');

    _('btnNew').addEventListener('click', req_new);
    _('btnReturn').addEventListener('click', return_form);
    _('btnSave').addEventListener('click', save_form);
    
    $('#cboClient').on('change', function () {
        if (ovariables.accionform == "1") {
            let valor = _('cboClient').value;
            if (valor != "") {               
                load_division_list();
            }
        }
    });

    $('#cboMarca').on('change', function () {
        req_load_divisionMarca();
    });
    

    hide_form();
}

function hide_form() {
    $('#formMante').hide();
    $('#btnSave').hide();
    $('#btnReturn').hide();
    $('#formList').show();
    $('#btnNew').show();
    $('#btnExportPDF').show();
    $('#btnExportExcel').show();
}

function show_form() {
    $('#formMante').show();
    $('#btnSave').show();
    $('#btnReturn').show();
    $('#formList').hide();
    $('#btnNew').hide();
    $('#btnExportPDF').hide();
    $('#btnExportExcel').hide();
}

function return_form() {
    clear_form();
    hide_form();
}

function clear_form() {
    ovariables.accionform = "0";
    $("#cboClient").select2("val", "0");
    _('filterDivision').value = "";
    let arrLimpiar = [];
    _('contentTableDivision').tBodies[0].innerHTML = arrLimpiar;
    $('.footable').trigger('footable_resize');
}

var save_form = async() => {

    let req = _required({ id: 'formMante', clase: '_enty' });

    if (req) {
        
            swal({
                title: "Desea Guardar la realacion de Cliente, marca y division?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false
            }, function (result) {
                    if (result) {
                        fn_ActualizarCliente_Division_Compartido();
                    }
            });
        
        
    }   
    else {
        swal({ title: "Alert", text: "You have to select some Client or Marca", type: "warning" });
    }
}

function obtenerlista(select) {

    let td = select.parentElement;
    let _arrli = Array.from(td.getElementsByTagName('li'));
    let strList = '';
    let optionList = '';

    _arrli.forEach(x => {
        let title = x.getAttribute('title');
        if (title != '' && title !== null) {
            strList += title + ',';
            optionList += `<option value="${title}">${title}</option>`
        }
    })

    strList = strList.length > 0 ? strList.slice(0, -1) : strList;

    let objNumeros = {};
    objNumeros.strList = strList;
    objNumeros.optionList = optionList;

    return objNumeros;
}

function fn_ActualizarCliente_Division_Compartido() {

    let Idcliente = _('cboClient').value;
    let IdMarca= _('cboMarca').value;   

    let table = _('contentTableDivision');
    let bValidacion = true;
    let arrchkselect = Array.from(table.getElementsByClassName('checked'))
        .filter(x => x.classList.value.indexOf('disabled') < 0)
        .map(x => {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            let IdDivision = _par(par, 'IdDivision');
            let IdGrupo = _('IdGrupo_' + IdDivision).value;
            let arrPersonal = $('#IdPersonal_' + IdDivision).val();
            //let Personal = JSON.stringify(arrPersonal);
            let Personal = '';
            if (arrPersonal.length > 0) { 
                arrPersonal.forEach(x => { Personal += x+','  });
                Personal = Personal.slice(0, -1);
            }

            if (bValidacion == true && IdGrupo == 0) { bValidacion = false }
            if (bValidacion == true && IdMarca == 0) { bValidacion = false }

            return {
                IdCliente: Idcliente,
                IdMarca: IdMarca,
                IdDivision: IdDivision,
                IdGrupo: IdGrupo,
                personal: Personal
            }
        });
   

    let objsave = {}
        objsave.listaclientedivision = arrchkselect

    let form = new FormData();
    form.append('parHead', JSON.stringify(objsave));

    if (bValidacion) {

        if (arrchkselect.length > 0) {
            _Post('Maestra/ClientDivision/ActualizarCliente_Division_Compartido_JSON', form)
                .then((rpta) => {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                    _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                    res_post(orpta.data);
                });
        } else {
            swal({ title: "Alert", text: "Select Division.", type: "warning" });
        }
    } else {
        swal({ title: "Alert", text: "You have to select some Group Commercial or marca", type: "warning" });
    }
}

function res_post(sdata) {
   
    swal({ title: "Good job!", text: "You Have registered new Data", type: "success" });
}

function fn_load_client(_arrclient) {
    let array = _arrclient;
    let cboclient = '<option></option>'
    array.forEach(x=> {
        cboclient += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>`
    });
    _('cboClient').innerHTML = cboclient;
}

function handlerDivision(_idtable) {
    $('.i-checks._clsDivDivision').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_get_division(_idtable) {
    let table = _(_idtable), arrCheckDivision = [...table.getElementsByClassName('checked')], obj = {}, arrDivision = [];
    if (arrCheckDivision.length > 0) {
        arrCheckDivision.forEach(x=> {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            let IdDivision =  _par(par, 'IdDivision');
            obj.IdDivision = IdDivision;
            obj.IdGrupo = _('IdGrupo_' + IdDivision);
            
            arrDivision.push(obj);
        });
    }
    return arrDivision;
}

/*** Insert ***/

function req_new() {
    ovariables.accionform = "1";
    _('cboClient').disabled = false;
    show_form();
    fn_load_client(ovariables.arrClient);
}

function req_load_division() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'Maestra/ClientDivision/DivisionClient_List?par=' + par;
    Get(urlaccion, res_load_division);
}

function load_division_list() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'Maestra/ClientDivision/Division_List?par=' + par;
    Get(urlaccion, res_load_division_list);
}

function res_load_division_list(response) {

    let data = response.split('¬');
    let arrayRespuesta = [];
    if (data[0].length > 0) {
        arrayRespuesta = JSON.parse(data[0]);
    }
    
    let arrayResultado = arrayRespuesta;

    let ListMarca = [];
    let comboMarca = '';
    let ListGrupoComercial = [];
    let comboGrupoComercial = '';
    let comboPersonal = '<option value="0">----Seleccione----</option>';

    if (data[1].length > 0) {
        ListMarca = JSON.parse(data[1]);
        comboMarca = ListMarca.map(x => { return `<option value="${x.IdMarca}">${x.NombreMarca}</option>` }).join('');
        _('cboMarca').innerHTML = '<option value="0">----Seleccione----</option>' + comboMarca;
    }

    if (data[2].length > 0) {
        ListGrupoComercial = JSON.parse(data[2]);
        comboGrupoComercial = ListGrupoComercial.map(x => { return `<option value="${x.idGrupoPersonal}">${x.NombreGrupoPersonal}</option>` }).join('');
        comboGrupoComercial = '<option value="0">----Seleccione----</option>' + comboGrupoComercial
    }

    if (data[3].length > 0) {
        ovariables.arrPersonal = JSON.parse(data[3]);
    }

    $('#cboMarca').select2("val", '0');

    let table = arrayResultado.map(x => {
        return `<tr id="${x.IdDivision}" data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision_${x.IdDivision}'data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
                <td><select class="select2_Grupo form-control _enty" name = "IdGrupo_${x.IdDivision}" id ="IdGrupo_${x.IdDivision}" style = "width:100%" data-min="1" onchange="cargarPersonal(this);">${comboGrupoComercial}</select></td>
                <td>
                 <select id="IdPersonal_${x.IdDivision}"  class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                            ${comboPersonal}
                                        </select>
                </td>
            </tr>
            `
    }).join('');

    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    handlerDivision('contentTableDivision');

    $(".select-multiple").select2({
        width: '100%'
    });
}

function cargarPersonal(control) {

    let IdGrupoPersonal = control.value;
    let idControl = control.getAttribute("id");
    let selectPersonal = idControl.replace("IdGrupo_", "IdPersonal_");
    let arrPersonal = ovariables.arrPersonal;
    let filter = arrPersonal.filter(x => _parseInt(x.IdGrupoPersonal) === _parseInt(IdGrupoPersonal));
    let comboPersonal = filter.map(x => { return `<option value="${x.IdPersonal}">${x.NombrePersonal}</option>` }).join('');
    _(selectPersonal).innerHTML = comboPersonal;

    forzarOnchange(selectPersonal);
    //$(".select-multiple").select2({
    //    width: '100%'
    //});
}

function res_load_division(response) {
    
    let data = response.split('¬');
    let arrayRespuesta = [];
    if (data[0].length > 0) {
        arrayRespuesta = JSON.parse(data[0]);
    }    
    let arrayDivision = ovariables.arrDivision;

    let arrayResultado = arrayDivision.filter(x=> {
        return !arrayRespuesta.some(y=> y.IdDivision === x.IdDivision);
    });

    let ListMarca = [];
    let comboMarca = '';
    let ListGrupoComercial = [];
    let comboGrupoComercial = '';
    let comboPersonal = '<option value="0">----Seleccione----</option>';

    if (data[1].length > 0) {
        ListMarca = JSON.parse(data[1]);
        comboMarca = ListMarca.map(x => { return `<option value="${x.IdMarca}">${x.NombreMarca}</option>` }).join('');
        _('cboMarca').innerHTML = '<option value="0">----Seleccione----</option>' + comboMarca;
    }

    if (data[2].length > 0) {
        ListGrupoComercial = JSON.parse(data[2]);
        comboGrupoComercial = ListGrupoComercial.map(x => { return `<option value="${x.idGrupoPersonal}">${x.NombreGrupoPersonal}</option>` }).join('');
        comboGrupoComercial = '<option value="0">----Seleccione----</option>' + comboGrupoComercial
    }

    if (data[3].length > 0) {
        ovariables.arrPersonal = JSON.parse(data[3]);       
    }


    $('#cboMarca').select2("val", '0');

    let table = arrayResultado.map(x=> {
        return `<tr id="${x.IdDivision}" data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision_${x.IdDivision}'data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
                <td><select class="select2_Grupo form-control _enty" name = "IdGrupo_${x.IdDivision}" id ="IdGrupo_${x.IdDivision}" style = "width:100%" data-min="1" onchange="cargarPersonal(this);" >${comboGrupoComercial}</select></td>
                <td>
                      <select id="IdPersonal_${x.IdDivision}"  class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                            ${comboPersonal}
                                        </select>
                </td>
            </tr>
            `
    }).join('');

    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    handlerDivision('contentTableDivision');

    $(".select-multiple").select2({
        width: '100%'
    });
}

function req_save_new() {
    let url = 'Maestra/ClientDivision/ClientDivision_Insert';
    let par = { idgrupocomercial: ovariables.idgrupocomercial };

    let oclidiv = _getParameter({ id: 'formMante', clase: '_enty' }),
        oclientdivision = JSON.stringify(fn_get_division('contentTableDivision')),
        form = new FormData();

    form.append('par', JSON.stringify(par));
    form.append('par_CliDiv', JSON.stringify(oclidiv));
    form.append('par_CliDivision', oclientdivision);

    Post(url, form, res_post);
}

/*** Edit ***/
function req_load_divisionMarca() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'Maestra/ClientDivision/DivisionClientMarca_List?par=' + par;
    Get(urlaccion, res_marcarFila);
}

function res_marcarFila(response) {

    let getResult = response.split('¬');

    let divpadredivision = _('tableDivision');
    let arrdivision_selected = [...divpadredivision.getElementsByClassName("_clschkDivision")];
    arrdivision_selected.forEach(x => {
        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let id = fila.getAttribute("id");
        _('IdGrupo_' + id).value = '0';
        _('IdPersonal_' + id).value = '0';
        x.checked = false;
    });

    if (response != '') {        

        let strResult = getResult[0]

        let arrayResult = JSON.parse(getResult[0]);
        arrayResult.forEach(x => {

            _('chkDivision_' + x.IdDivision).checked = true;
            _('IdGrupo_' + x.IdDivision).value = x.IdGrupoPersonal;
            forzarOnchange('IdGrupo_' + x.IdDivision)

            if (x.Personal !== '') {
                let arr = (x.Personal).split(',');
                $('#IdPersonal_' + x.IdDivision).val(arr)
                forzarOnchange('IdPersonal_' + x.IdDivision)
            }
        });
    } 

    handlerDivision('contentTableDivision');
}

function forzarOnchange(controlId) {

    var element = document.getElementById(controlId);
    var event = new Event('change');
    element.dispatchEvent(event);
}



function req_edit(_IdCliente) {
    ovariables.intidcliente = _IdCliente;
    let par = JSON.stringify({ IdCliente: ovariables.intidcliente });
    let urlaccion = 'Maestra/ClientDivision/DivisionClient_List?par=' + par;
    Get(urlaccion, res_edit);
}

function res_edit(response) {
    ovariables.accionform = "2";
    _('cboClient').disabled = true;
    show_form();
    fn_load_client(ovariables.arrClient);
    $('#cboClient').select2("val", ovariables.intidcliente);

    let getResult = response.split('¬');
    let arrayResult = JSON.parse(getResult[0]);
    let arrayDivision = ovariables.arrDivision;

    let ListMarca = [];
    let comboMarca = '';
    let ListGrupoComercial = [];
    let comboGrupoComercial = '';
    let comboPersonal = '<option value="0">----Seleccione----</option>';

    if (getResult[1].length > 0) {
        ListMarca = JSON.parse(getResult[1]);
        comboMarca = ListMarca.map(x => { return `<option value="${x.IdMarca}">${x.NombreMarca}</option>` }).join('');
        _('cboMarca').innerHTML = '<option value="0">----Seleccione----</option>' + comboMarca;       
    }

    if (getResult[2].length > 0) {
        ListGrupoComercial = JSON.parse(getResult[2]);
        comboGrupoComercial = ListGrupoComercial.map(x => { return `<option value="${x.idGrupoPersonal}">${x.NombreGrupoPersonal}</option>` }).join(''); 
        comboGrupoComercial = '<option value="0">----Seleccione----</option>' + comboGrupoComercial
    }

    if (getResult[3].length > 0) {
        ovariables.arrPersonal = JSON.parse(getResult[3]);
    }

    $('#cboMarca').select2("val", '0');
  

    let table = arrayDivision.map(x=> {
        return `<tr id="${x.IdDivision}" data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox'  class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision_${x.IdDivision}' data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
                <td><select class="select2_Grupo form-control _enty" name = "IdGrupo_${x.IdDivision}" id ="IdGrupo_${x.IdDivision}" style = "width:100%" data-min="1" onchange="cargarPersonal(this);">${comboGrupoComercial}</select></td>
                <td>
                    <select id="IdPersonal_${x.IdDivision}"  class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
	                    ${comboPersonal}
                    </select>
                </td>
            </tr>
            `
            
    }).join('');
    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');

    $(".select-multiple").select2({
        width: '100%'
    });

    let divpadredivision = _('tableDivision');
    let arrdivision_selected = [...divpadredivision.getElementsByClassName("_clschkDivision")];

    if (arrayResult.length > 0) {
        arrdivision_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            x.checked = arrayResult.some(y=> {
                return (y.IdDivision.toString() === x.getAttribute("data-IdDivision"))
            });
            //if (x.checked) {
            //    x.disabled = true;
            //}
        });
    }
    handlerDivision('contentTableDivision');
}

function req_save_edit() {
    let url = 'Maestra/ClientDivision/ClientDivision_Update';
    let par = { idgrupocomercial: ovariables.idgrupocomercial };

    let oCliDiv = _getParameter({ id: 'formMante', clase: '_enty' }),
        oClientDivision = JSON.stringify(fn_get_division('contentTableDivision')),
        form = new FormData();
    form.append('par_CliDiv', JSON.stringify(oCliDiv));
    form.append('par_CliDivision', oClientDivision);
    form.append('par', JSON.stringify(par));

    Post(url, form, res_post);
}


/*** Load ***/

function req_ini() {
    let urlaccion = 'Maestra/ClientDivision/ClientDivision_List?idgrupocomercial=' + ovariables.idgrupocomercial;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    ovariables.strJSNClientDivision = response;
    let strData = ovariables.strJSNClientDivision.split('¬');
    ovariables.arrClient = JSON.parse(strData[0]);
    ovariables.arrClientDivision = JSON.parse(strData[1]);
    ovariables.arrDivision = JSON.parse(strData[2]);
    fn_load_ini(ovariables.arrClientDivision);
}

function fn_load_ini(_array) {
    let table = _array.map(x=> {
        return `
            <tr>            
                <td>${x.NombreCliente}</td>
                <td>${x.GrupoPersonal}</td>
                <td>${x.Marca}</td>
                <td>${x.Division}</td>
                <td class='text-center'>
                    <i class='fa fa-pencil' onclick='req_edit(${x.IdCliente})'></i>
                </td>
            </tr>
            `
    }).join('');

    _('contenTableClientDivision').tBodies[0].innerHTML = table;
    _('numRegistros').innerHTML = _('contenTableClientDivision').tBodies[0].rows.length;
    $('.footable').trigger('footable_resize');
}

/*** Initial  ***/
(function ini() {
    load();
    req_ini();
})();
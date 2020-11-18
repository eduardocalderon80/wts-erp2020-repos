/// <reference path="../../Home/Util.js" />

var ovariables = {
    strJSNAnalystClient: '',
    accionform: '0',
    arrAnalystClient: '',
    arrTeam: '',
    arrClient: '',
    arrManager: '',
    arrAnalyst: '',
    idgrupocomercial: '',
    idanalistaxcliente: '',
    idteam: '',
    idcliente: '',
    idmanager: ''
}

function load() {
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');

    $('.footable').footable();

    $(".select2_Team").select2({
        placeholder: "Select Team",
        allowClear: false
    });

    $(".select2_Client").select2({
        placeholder: "Select Client",
        allowClear: false
    });

    $(".select2_Manager").select2({
        placeholder: "Select Manager",
        allowClear: false
    });

    _('btnNew').addEventListener('click', req_new);
    _('btnSave').addEventListener('click', save_form);
    _('btnReturn').addEventListener('click', return_form);
        
    $('#cboTeam').on('change', function () {
        if (ovariables.accionform == "1") {
            let idgrupopersonal = _('cboTeam').value;
            $("#cboClient").select2("val", "0");
            fn_load_client(idgrupopersonal);
            let arrLimpiar = [];
            _('contentTableAnalyst').tBodies[0].innerHTML = arrLimpiar;
        }
    });

    $('#cboClient').on('change', function () {
        if (ovariables.accionform == "1") {
            let valor = _('cboClient').value;
            if (valor != "") {
                req_load_analyst();
            }
        }
    });

    $('#cboManager').on('change', function () {
        if (ovariables.accionform == "1") {
            req_load_analyst();
        }
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
    _("hf_IdAnalistaxCliente").value = "";
    $("#cboTeam").select2("val", "0");
    $("#cboClient").select2("val", "0");
    $("#cboManager").select2("val", "0");
    let arrLimpiar = [];
    _('contentTableAnalyst').tBodies[0].innerHTML = arrLimpiar;
    $('.footable').trigger('footable_resize');
}

function res_post(sdata) {
    return_form();
    res_ini(sdata);
    swal({ title: "Good job!", text: "You Have registered new Data", type: "success" }); 
}

function handlerAnalyst(_idtable) {
    $('.i-checks._clsDivAnalyst').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function save_form() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    if (req) {
        let arrtovalid = fn_get_analyst('contentTableAnalyst');
        if (arrtovalid.length > 0) {
            swal({
                title: "Do you want to save the inserted values?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                if (ovariables.accionform == "1") {
                    req_save_new();
                }
                else {
                    req_save_edit();
                }
                return;
            });
        } else {
            swal({ title: "Alert", text: "You have to select some Analyst", type: "warning" });
        }
    }
    else {
        swal({ title: "Alert", text: "You have to select data required", type: "warning" });
    }
}

function fn_get_analyst(_idtable) {
    let table = _(_idtable), arrCheckAnalyst = [...table.getElementsByClassName('checked')], obj = {}, arrAnalyst = [];
    if (arrCheckAnalyst.length > 0) {
        arrCheckAnalyst.forEach(x=>{
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.IdAnalyst = _par(par, 'IdAnalyst');
            arrAnalyst.push(obj);
        });
    }
    return arrAnalyst;
}

/*** Insert ***/

function req_new() {
    ovariables.accionform = "1";
    _('cboTeam').disabled = false;
    _('cboClient').disabled = false;
    _('cboManager').disabled = false;
    show_form();


    fn_load_team(ovariables.arrTeam);
    fn_load_manager(ovariables.arrManager)
}

function fn_load_team(_arrteam) {
    let array = _arrteam;
    let cboTeam = '<option></option>';

    array.forEach(x=> {
        cboTeam += `<option value='${x.IdGrupoPersonal}'>${x.NombreGrupoPersonal}</option>`
    });

    _('cboTeam').innerHTML = cboTeam;
}

function fn_load_client(_idgrupopersonal) {
    let arrayClient = ovariables.arrClient;
    let arrayresultado = [];
    let cboClient = '<option></option>';

    arrayresultado = arrayClient.filter(x=>x.IdGrupoPersonal.toString() === _idgrupopersonal.toString());
    arrayresultado.forEach(x=> {
        cboClient += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>`
    });
    _('cboClient').innerHTML = cboClient;
}

function fn_load_manager(_arrmanager) {
    let array = _arrmanager;
    let cboManager = '<option></option>'

    array.forEach(x=> {
        cboManager += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`
    });
    _('cboManager').innerHTML = cboManager;
}

function req_save_new() {
    let url = 'GestionProducto/AnalistaxCliente/AnalistaCliente_Insert';

    let odata = _getParameter({ id: 'formMante', clase: '_enty' }),
        arrdata = JSON.stringify(fn_get_analyst('contentTableAnalyst')),
        form = new FormData();
    form.append('pardata', JSON.stringify(odata));
    form.append('pararray', arrdata);

    Post(url, form, res_post);
}

function req_load_analyst() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'GestionProducto/AnalistaxCliente/AnalistaCliente_Get?par=' + par;
    Get(urlaccion, res_load_analyst);
}

function res_load_analyst(response) {
    let data = response.split('¬');
    let idjefe = _('cboManager').value;
    let arrRespuesta = [];
    if (data[0].length > 0) {
        arrRespuesta = JSON.parse(data[0]);
    }
    let arrAnalyst = ovariables.arrAnalyst;

    let arrfilter = arrAnalyst.filter(x=> x.IdJefatura.toString() === idjefe);

    let arrResultado = arrfilter.filter(x=> {
        return !arrRespuesta.some(y=> y.IdAnalista === x.IdPersonal);
    });

    let table = arrResultado.map(x=> {
        return `<tr data-par='IdAnalyst:${x.IdPersonal}'>
             <td class ='text-center'>
                    <div  class ='i-checks _clsDivAnalyst'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkAnalyst' style='position: absolute; opacity: 0;' id='chkAnalyst' data-IdAnalyst='${x.IdPersonal}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
            <td>${x.NombrePersonal}</td>
            </tr>
            `
    }).join('');
    _('contentTableAnalyst').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    handlerAnalyst('contentTableAnalyst');
}

/*** Edit ***/
function req_edit(_IdAnalistaxCliente,_IdTeam, _IdCliente, _IdManager) {
    ovariables.idteam = _IdTeam;
    ovariables.idcliente = _IdCliente;
    ovariables.idmanager = _IdManager;
    ovariables.idanalistaxcliente = _IdAnalistaxCliente;

    let par = JSON.stringify({ IdTeam: _IdTeam, IdCliente: _IdCliente, IdManager: _IdManager });
    let urlaccion = 'GestionProducto/AnalistaxCliente/AnalistaCliente_Get?par=' + par;
    Get(urlaccion, res_edit);
}

function res_edit(response) {
    ovariables.accionform = "2";
    show_form();
    _('cboTeam').disabled = true;
    _('cboClient').disabled = true;
    _('cboManager').disabled = true;

    fn_load_team(ovariables.arrTeam);
    fn_load_client(ovariables.idteam);
    fn_load_manager(ovariables.arrManager);
    $('#cboTeam').select2("val", ovariables.idteam);
    $('#cboClient').select2("val", ovariables.idcliente);
    $('#cboManager').select2("val", ovariables.idmanager);
    _("hf_IdAnalistaxCliente").value = ovariables.idanalistaxcliente;

    let result = response.split('¬');
    let arrResultado = JSON.parse(result[0]);
    let arrAnalyst = ovariables.arrAnalyst;

    let arrfilter = arrAnalyst.filter(x=> x.IdJefatura === ovariables.idmanager);

    let table = arrfilter.map(x=> {
        return `<tr data-par='IdAnalyst:${x.IdPersonal}'>
             <td class ='text-center'>
                    <div  class ='i-checks _clsDivAnalyst'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkAnalyst' style='position: absolute; opacity: 0;' id='chkAnalyst' data-IdAnalyst='${x.IdPersonal}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
            <td>${x.NombrePersonal}</td>
            </tr>
            `
    }).join('');
    
    _('contentTableAnalyst').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    
    let divpadreanalista = _('contentTableAnalyst');
    let arranalista_selected = [...divpadreanalista.getElementsByClassName("_clschkAnalyst")];

    if (arrResultado.length > 0) {
        arranalista_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            x.checked = arrResultado.some(y=> {
                return (y.IdAnalista.toString() === x.getAttribute("data-IdAnalyst"))
            });
            if (x.checked) {
                x.disabled = true;
            }
        });
    }
    handlerAnalyst('contentTableAnalyst');
}

function req_save_edit() {
    let url = 'GestionProducto/AnalistaxCliente/AnalistaCliente_Update';
   
    let odata = _getParameter({ id: 'formMante', clase: '_enty' }),
        arrdata = JSON.stringify(fn_get_analyst('contentTableAnalyst')),
        form = new FormData();
    form.append('pardata', JSON.stringify(odata));
    form.append('pararray', arrdata);

    Post(url, form, res_post);
}

/*** Delete ***/
function delete_register(_idanalistaxcliente, _idanalista) {
    swal({
        title: "Do you want to deleted this register?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_delete(_idanalistaxcliente, _idanalista);
        return;
    });
}

function req_delete(_idanalistaxcliente, _idanalista) {
    let par = JSON.stringify({ IdAnalistaxCliente: _idanalistaxcliente, IdAnalista: _idanalista });
    let urlaccion = 'GestionProducto/AnalistaxCliente/AnalistaCliente_Delete?par=' + par;
    Get(urlaccion, res_delete);
}

function res_delete(response) {
    if (response != null) {
        swal({ title: "Good job!", text: "You Have deleted this register", type: "success" });
        res_ini(response);
    }
}

/*** Load ***/

function req_ini() {
    let urlaccion = 'GestionProducto/AnalistaxCliente/AnalistaCliente_List?idgrupocomercial=' + ovariables.idgrupocomercial;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    ovariables.strJSNAnalystClient = response;
    let strData = ovariables.strJSNAnalystClient.split('¬');
    ovariables.arrTeam = JSON.parse(strData[0]);
    ovariables.arrClient = JSON.parse(strData[1]);
    ovariables.arrManager = JSON.parse(strData[2]);
    ovariables.arrAnalyst = JSON.parse(strData[3]);
    if (strData[4]!='') {
        ovariables.arrAnalystClient = JSON.parse(strData[4]);
        fn_load_ini(ovariables.arrAnalystClient);
    }
}

function fn_load_ini(_array) {
    let table = _array.map(x=> {
        return `
            <tr>
                <td>${x.NombreCliente}</td>
                <td>${x.Equipo}</td>
                <td>${x.Manager}</td>
                <td>${x.Analista}</td>
                <td>${x.UsuarioRegistro}</td>
                <td class ='text-center'>
                    <i class ='fa fa-pencil' onclick='req_edit(${x.IdAnalistaxCliente},${x.IdTeam},${x.IdCliente},${x.IdManager})'></i>
                    <i class ='fa fa-trash' onclick='delete_register(${x.IdAnalistaxCliente},${x.IdAnalyst})'></i>
                </td>
            <tr>
            `
    }).join('');
    _('contenTableAnalystClient').tBodies[0].innerHTML = table;
    _('numRegistros').innerHTML = _array.length;
    $('.footable').trigger('footable_resize');
}


/*** Initial ***/
(function ini() {
    load();
    req_ini();
})();
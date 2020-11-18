/// <reference path="../../Home/Util.js" />

var ovariables = {
    strJSNClientDivision: '',
    accionform: '0',
    arrClientDivision: '',
    arrClient: '',
    arrDivision: '',
    idgrupocomercial: '',
    intidcliente: ''
}

function load() {

    /*capturamos parametros iniciares: inicio*/
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
    /*capturamos parametros iniciares: fin*/

    /*inicializando las librerias: inicio*/
        $(".select2_Cliente").select2({
            placeholder: "Select Client",
            allowClear: false
        });

        $('.footable').footable();
        $('.footable').trigger('footable_resize');

    /*inicializando las librerias: fin*/

   /*asigancion de eventos a los botones: inicio*/
    _('btnNew').addEventListener('click', req_new);
    _('btnReturn').addEventListener('click', return_form);
    _('btnSave').addEventListener('click', save_form);
    /*asigancion de eventos a los botones: fin*/

    /*asignacion de evento change :inicio*/

    $('#cboClient').on('change', function () {
        if (ovariables.accionform == "1") {
            let valor = _('cboClient').value;
            if (valor != "") {
                let Client = $("#cboClient").val();
                cargarMarcaDivision();
            }
        }
    });
    /*asignacion de evento change :fin*/

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
        let idcliente = _('cboClient').value;
        let resultado = await fn_validar_si_existedivisioncompartida();
        let arrtovalid = fn_get_division('contentTableDivision');

        if (resultado.length > 0) {
            let table = _('contentTableDivision');
            let arrchkselect = Array.from(table.getElementsByClassName('checked'))
                .filter(x => x.classList.value.indexOf('disabled') < 0);

            arrchkselect.forEach(x => {
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');
                let IdDivision = _par(par, 'IdDivision');
                let filter = resultado.filter(y => parseInt(y.IdDivision) === parseInt(IdDivision));
                if (filter.length > 0) {
                    fila.setAttribute('data-idclientedivision', filter[0].IdClienteDivision);
                    fila.setAttribute('data-idclienteactual', filter[0].IdCliente);
                }
                else {
                    fila.setAttribute('data-idclientedivision', 0);
                    fila.setAttribute('data-idclienteactual', 0);
                }
            });
            let idcliente_resultado = resultado[0].IdCliente;
            if (parseInt(idcliente) !== parseInt(idcliente_resultado)) {
                var mensajeConfirmacion = "<div class='row'><strong>La division pertenece al cliente " + resultado[0].NombreCliente + " , desea reemplazarlo?</strong></div>";
                swal({
                    title: "La division pertenece al cliente " + resultado[0].NombreCliente + " , desea reemplazarlo?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: false
                }, function (result) {
                        if (result) {
                            fn_ActulizarCliente_Division_Compartido();
                        }
                });
            }
        } else {
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
            }
            else {
                swal({ title: "Alert", text: "You have to select some division", type: "warning" });
            }
        }

        
    }   
    else {
        swal({ title: "Alert", text: "You have to select some Client", type: "warning" });
    }
}

function fn_ActulizarCliente_Division_Compartido() {
    let idcliente_select = _('cboClient').value;
    let objsave = {}
    let table = _('contentTableDivision');
    let arrchkselect = Array.from(table.getElementsByClassName('checked'))
        .filter(x => x.classList.value.indexOf('disabled') < 0)
        .map(x => {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            let IdDivision = _par(par, 'IdDivision');
            return { IdCliente_new: idcliente_select, IdClienteDivision: fila.getAttribute('data-idclientedivision'), IdClienteOrigen: fila.getAttribute('data-idclienteactual'), IdDivision: IdDivision }
        });
    let form = new FormData();

    objsave.listaclientedivision = arrchkselect
    form.append('parHead', JSON.stringify(objsave));

    _Post('Maestra/ClientDivisionPersonal/ActulizarCliente_Division_Compartido_JSON', form)
        .then((rpta) => {
            let orpta = rpta !== '' ? JSON.parse(rpta) : null;
            _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
            res_post(orpta.data);
        });
}

function res_post(sdata) {
    return_form();
    res_ini(sdata);
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
            obj.IdDivision = _par(par, 'IdDivision');
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
    let urlaccion = 'Maestra/ClientDivisionPersonal/DivisionClient_List?par=' + par;
    Get(urlaccion, res_load_division);
}

function cargarMarcaDivision() {

    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'Maestra/ClientDivisionPersonal/CargarClienteMarcaDivision?par=' + par;
    Get(urlaccion, dibujarMarcaDivision);
}

function dibujarMarcaDivision(response) {

    _('contentTableDivision').tBodies[0].innerHTML = '';

    let data = response.split('¬');
    let arrayRespuesta = [];
    if (data[0].length > 0) {
        arrayRespuesta = JSON.parse(data[0]);
    }
    let arrayDivision = ovariables.arrDivision;

    let arrayResultado = arrayDivision.filter(x => {
        return !arrayRespuesta.some(y => y.IdDivision === x.IdDivision);
    });

    let table = arrayResultado.map(x => {
        return `<tr data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision' data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
                <td>${x.NombreDivision}</td>
            </tr>
            `
    }).join('');

    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    handlerDivision('contentTableDivision');

}

function res_load_division(response) {

    _('contentTableDivision').tBodies[0].innerHTML = '';

    let data = response.split('¬');
    let arrayRespuesta = [];
    if (data[0].length > 0) {
        arrayRespuesta = JSON.parse(data[0]);
    }    
    let arrayDivision = ovariables.arrDivision;

    let arrayResultado = arrayDivision.filter(x=> {
        return !arrayRespuesta.some(y=> y.IdDivision === x.IdDivision);
    });

    let table = arrayResultado.map(x=> {
        return `<tr data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision' data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
            </tr>
            `
    }).join('');

    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');
    handlerDivision('contentTableDivision');
}

function req_save_new() {
    let url = 'Maestra/ClientDivisionPersonal/ClientDivision_Insert';
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
function req_edit(_IdCliente) {

    ovariables.intidcliente = _IdCliente;
    let par = JSON.stringify({ IdCliente: ovariables.intidcliente });
    let urlaccion = 'Maestra/ClientDivisionPersonal/DivisionClient_List?par=' + par;
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

    let table = arrayDivision.map(x=> {
        return `<tr data-par='IdDivision:${x.IdDivision}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDivision'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDivision' style='position: absolute; opacity: 0;' id='chkDivision' data-IdDivision='${x.IdDivision}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.CodigoDivision}</td>
                <td>${x.NombreDivision}</td>
            </tr>
            `
    }).join('');
    _('contentTableDivision').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');

    let divpadredivision = _('tableDivision');
    let arrdivision_selected = [...divpadredivision.getElementsByClassName("_clschkDivision")];

    if (arrayResult.length > 0) {
        arrdivision_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            x.checked = arrayResult.some(y=> {
                return (y.IdDivision.toString() === x.getAttribute("data-IdDivision"))
            });
            if (x.checked) {
                x.disabled = true;
            }
        });
    }
    handlerDivision('contentTableDivision');
}

function req_save_edit() {
    let url = 'Maestra/ClientDivisionPersonal/ClientDivision_Update';
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
    cargarDatosIniciales();
}

function cargarDatosIniciales() {

    let parametro = {
        idgrupo: ovariables.idgrupocomercial
    };

    let urlaccion = 'Maestra/ClientDivisionPersonal/ClientDivisionLoad_List?par=' + JSON.stringify(parametro) ;
    Get(urlaccion, res_ini);
}

function res_ini(resultado) {

    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
    if (rpta !== null) {
        
        ovariables.arrClient = rpta.ListaCliente !== '' ? JSON.parse(rpta.ListaCliente) : [];
        let ClienteDivision = (rpta.ListaClienteDivision.length > 0) ? JSON.parse(rpta.ListaClienteDivision) : [];
        fn_load_ini(ClienteDivision);
    }
}

var fn_validar_si_existedivisioncompartida = async () => {
    let oresult = '';
    let idcliente = _('cboClient').value;
    let table = _('contentTableDivision');
    let arrchkselect = Array.from(table.getElementsByClassName('checked'))
        .filter(x => x.classList.value.indexOf('disabled') < 0)
        .map(x => {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            let IdDivision = _par(par, 'IdDivision');
            return ({ IdDivision: IdDivision, IdCliente: idcliente } )
        });
        //Array.from(document.getElementsByClassName('cls_chk_division_select'))
        //.filter(x => x.checked)
        //.map(x => {
        //    return ({ IdDivision: x.getAttribute('id'), IdCliente: idcliente })
        //}
        //);

    await _Get('Maestra/ClientDivisionPersonal/GetListaCliente_DivisionCompartida_JSON?par=' + JSON.stringify(arrchkselect))
        .then((rpta) => {
            let orpta = rpta !== '' ? JSON.parse(rpta) : null;
            let odata = [];
            if (orpta) {
                odata = orpta[0].ClienteDivision !== '' ? JSON.parse(orpta[0].ClienteDivision) : [];
            }

            oresult = odata;
        });

    return oresult;
}

function fn_load_ini(_array) {

    let table = _array.map(x=> {
        return `
            <tr>
                <td>${x.NombreCliente}</td>
                <td>${x.NombreMarca}</td>   
                <td>${x.NombreDivision}</td>                
                <td>${x.NombreGrupoPersonal}</td>
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
/// <reference path="../../Home/Util.js" />

var oVariables = {
    strJSNClientSeason: '',
    accionForm: '0',
    arrClientSeason: '',
    arrClient: '',
    arrSeason: '',
    arrTemporal: '',
    intIdCliente: 0,
    strAnio: '',
    idgrupocomercial: ''
}

function load() {

    let par = _('txtpar').getAttribute('data-par');
    oVariables.idgrupocomercial = _par(par, 'idgrupocomercial');

    $(".select2_Cliente").select2({
        placeholder: "Select Client",
        allowClear: false
    });

    $('.footable').footable();
    $('.footable').trigger('footable_resize');

    _('btnNew').addEventListener('click', fn_NewClientSeason);
    _('btnReturn').addEventListener('click', returnForm);
    _('btnSave').addEventListener('click', saveForm);

    $('#cboClient').on('change', function () {
        if (oVariables.accionForm == "1")
        {
            let valor = _('cboClient').value;
            if (valor != "") {
                let Client = $("#cboClient").val();
                fn_GetSeason();
            }
        }   
    });

    $('#txtYear').on('change', function () {
        fn_GetSeason();
        /*let IdClient = _('cboClient').value;
        fn_LoadMatchTableSeason(IdClient);*/
    });

    hideForm();
}

function hideForm() {

    $('#formMante').hide();
    $('#btnSave').hide();
    $('#btnReturn').hide();
    $('#formList').show();
    $('#btnNew').show();
    $('#btnExportPDF').show();
    $('#btnExportExcel').show();

}

function showForm() {

    $('#formMante').show();
    $('#btnSave').show();
    $('#btnReturn').show();
    $('#formList').hide();
    $('#btnNew').hide();
    $('#btnExportPDF').hide();
    $('#btnExportExcel').hide();   

    if (oVariables.accionForm == "1") {
        _('cboClient').disabled = false;
        _('txtYear').disabled = false;
    } else {
        _('cboClient').disabled = true;
        _('txtYear').disabled = true;
    }
}

function returnForm() {
    _('cboClient').disabled = false;
    _('txtYear').disabled = false;
    clearForm();
    hideForm();
}

function clearForm() {
    
    oVariables.accionForm = "1";
    $("#cboClient").select2("val", "0");
    _('filterSeason').value = "";
    let arrLimpiar = [];
    _('contentTableSeason').tBodies[0].innerHTML = arrLimpiar;
    $('.footable').trigger('footable_resize');
}

function saveForm() {
    
    let arraycontent = fn_aClientSeason('contentTableSeason');

    if (arraycontent.length > 0) {
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
            if (oVariables.accionForm == "1") {
                fn_InsertClientSeason();
            }
            else {
                fn_UpdateClientSeason();
            }
            return;
        });
    } else {
        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
}

function res_post(sdata) {
    returnForm();
    res_ini(sdata);
    swal({ title: "Good job!", text: "You Have registered new Data", type: "success" });
}

/*** Insert ***/
function fn_NewClientSeason() {
    oVariables.accionForm = "1";
    showForm();
    let hoy = new Date();
    _('txtYear').value = hoy.getFullYear();
    fn_LoadClient(oVariables.arrClient);
}

function fn_LoadClient(_arrayClient) {
    let arrayTemp = _arrayClient;
    let cboClient = '<option></option>';

    arrayTemp.forEach(x=> {
        cboClient += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>`
    });
    _('cboClient').innerHTML = cboClient;

}

function fn_GetSeason() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));    
    let urlaccion = 'Maestra/ClientSeason/SeasonClient_List?par=' + par;
    Get(urlaccion, fn_LoadTableSeason);
}

function fn_LoadTableSeason(response) {    
    
    var strAnio = _('txtYear').value.substr(2, 2);
    let arrSeasonOn = response;
    let tempSeason = oVariables.arrSeason;
    var getSeason = arrSeasonOn.split('¬');
    var arrDataSeason = [];

    if (getSeason[0].length > 0) {
        arrDataSeason = JSON.parse(getSeason[0]);
    }

    let result = tempSeason.filter(x=> {
        return !arrDataSeason.some(y=> y.IdTemporada === x.IdTemporada);
    });
    
    let tableSeason = result.map(x=> {
        return `<tr data-par='IdTemporada:${x.IdTemporada}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivSeason'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkSeason' style='position: absolute; opacity: 0;' id='chkSeason' data-IdTemporada='${x.IdTemporada}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <input type='text' disabled class ='form-control' value='${x.CodigoTemporada}${strAnio}'>
                    </div>
                </td>
                <td>${x.NombreTemporada}</td>
            </tr>
            `
    }).join('');
    
    _('contentTableSeason').tBodies[0].innerHTML = tableSeason;
    $('.footable').trigger('footable_resize');
    handlerSeason('contentTableSeason');   
}

function handlerSeason(_IdTable) {
    $('.i-checks._clsDivSeason').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let x = e.currentTarget;
        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let habilitado = fila.children[1].children[0].children[0].disabled;
        if (habilitado) {
            fila.children[1].children[0].children[0].disabled = false;
        }
        else {
            fila.children[1].children[0].children[0].disabled = true;
        }
    });
}

function fn_InsertClientSeason()
{
    let url = "Maestra/ClientSeason/ClientSeason_Insert";
    let par = { idgrupocomercial: oVariables.idgrupocomercial };

    let oCliSe = _getParameter({ id: 'formMante', clase: '_enty' }),
        oClientSeason = JSON.stringify(fn_aClientSeason('contentTableSeason')),
        form = new FormData();

    form.append('par_CliSe', JSON.stringify(oCliSe));
    form.append('par_CliSeason', oClientSeason);
    form.append('par', JSON.stringify(par));
    Post(url,form,res_post);
}

function fn_aClientSeason(_IdTable) {
    let table = _(_IdTable),
        arrCheckSeason = [...table.getElementsByClassName('checked')], obj = {}, arrSeason = [];

    if (arrCheckSeason.length > 0) {
        arrCheckSeason.forEach(x=> {
                obj = {};
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');

                let texto = fila.children[1].children[0].children[0].value;

                obj.IdTemporada = _par(par, 'IdTemporada');
                obj.CodigoClienteTemporada = texto;
                arrSeason.push(obj);
            
        });
    }
    return arrSeason; 
}

/*** Update ***/
function fn_EditClientSeason(_IdCliente, _Anio)
{
    oVariables.intIdCliente = _IdCliente;
    oVariables.strAnio = _Anio;
    let par = JSON.stringify({ IdCliente: oVariables.intIdCliente, Year: oVariables.strAnio });
    let urlaccion = 'Maestra/ClientSeason/SeasonClient_List?par=' + par;
    Get(urlaccion, res_Edit)
}

function res_Edit(responseEdit) {
    oVariables.accionForm = "2";
    showForm();
    fn_LoadClient(oVariables.arrClient);
    let arrDataMain = oVariables.arrClientSeason;
    let oClientSeason = arrDataMain.find(x=>x.IdCliente.toString() === oVariables.intIdCliente && x.Anio == oVariables.strAnio);
    $('#cboClient').select2("val", oClientSeason.IdCliente);
    _('txtYear').value = oClientSeason.Anio;
    var strAnio = _('txtYear').value.substr(2, 2);

    let getResult = responseEdit.split('¬');    
    let arrayResult = JSON.parse(getResult[0]);
    let arrayResultAll = JSON.parse(getResult[1]);
    
    let result = arrayResultAll.map(x=> {
        
        return `<tr data-par='IdTemporada:${x.IdTemporada}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivSeason'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkSeason' style='position: absolute; opacity: 0;' id='chkProfile' data-IdPerfil='${x.IdTemporada}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <input type='text' class ='form-control' disabled value='${x.CodigoClienteTemporada}'>
                    </div>
                </td>
                <td>${x.NombreTemporada}</td>
            </tr>
            `
    }).join('');
    
    _('contentTableSeason').tBodies[0].innerHTML = result;
    $('.footable').trigger('footable_resize');

    let divpadreseason = _('tableSeason');
    let arrseason_selected = [...divpadreseason.getElementsByClassName("_clschkSeason")];

    if (arrayResult.length > 0) {
        arrseason_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;

            x.checked = arrayResult.some(y=> {
                return (y.IdTemporada.toString() === x.getAttribute("data-IdPerfil"))
            });
            if (x.checked)
            {
                fila.children[1].children[0].children[0].disabled = false;
                x.disabled = true;
            }
        });
    }

    handlerSeason('contentTableSeason');

    //$('.i-checks._clsDivSeason').iCheck({
    //    checkboxClass: 'icheckbox_square-green',
    //    radioClass: 'iradio_square-green',
    //}).on('ifChanged', function (e) {
    //    let x = e.currentTarget;
    //    let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    //    let habilitado = fila.children[1].children[0].children[0].disabled;
    //    if (habilitado) {
    //        fila.children[1].children[0].children[0].disabled = false;
    //    }
    //    else {
    //        fila.children[1].children[0].children[0].disabled = true;
    //    }
    //});
     
}

function fn_UpdateClientSeason()
{

    let url = "Maestra/ClientSeason/ClientSeason_Update";
    let par = { idgrupocomercial: oVariables.idgrupocomercial };

    let oCliSe = _getParameter({ id: 'formMante', clase: '_enty' }),
        oClientSeason = JSON.stringify(fn_aClientSeason('contentTableSeason')),
        form = new FormData();

    form.append('par_CliSe', JSON.stringify(oCliSe));
    form.append('par_CliSeason', oClientSeason);
    form.append('par', JSON.stringify(par));

    Post(url, form, res_post);
}


/*
function fn_LoadMatchTableSeason(_IdClient) {

    var Anio = _('txtYear').value;
    var strAnio = Anio.substr(2, 2);
    let tempClientSeason = oVariables.arrClientSeason;
    let tempSeason = oVariables.arrSeason;
   

    let filterClientSeason = tempClientSeason.filter(x=>x.IdCliente.toString() === _IdClient && x.Anio.toString() == Anio);
        
    let result = tempSeason.filter(x=> {
        return !filterClientSeason.some(y=> y.IdTemporada === x.IdTemporada);
    });

  
    let tableSeason = result.map(x=> {
        return `
            <tr data-par='IdTemporada:${x.IdTemporada}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivSeason'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkSeason' style='position: absolute; opacity: 0;' id='chkProfile' data-IdPerfil='${x.IdTemporada}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <input type='text' class ='form-control' value='${x.CodigoTemporada}${strAnio}'>
                    </div>
                </td>
                <td>${x.NombreTemporada}</td>
            </tr>
            `
    }).join('');

    _('contentTableSeason').tBodies[0].innerHTML = tableSeason;
    $('.footable').trigger('footable_resize');

    $('.i-checks._clsDivSeason').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}
*/

/*** Load ***/

function req_ini() {
    //let urlaccion = 'Maestra/ClientSeason/ClientSeason_List';
    let urlaccion = 'Maestra/ClientSeason/ClientSeason_List?idgrupocomercial=' + oVariables.idgrupocomercial;
    Get(urlaccion,res_ini);
}

function res_ini(response) {
    oVariables.strJSNClientSeason = response;
    let strData = oVariables.strJSNClientSeason.split('¬');
    oVariables.arrClient = JSON.parse(strData[0]);
    oVariables.arrClientSeason = JSON.parse(strData[1]);
    oVariables.arrSeason = JSON.parse(strData[2]);
    fn_LoadTableClientSeason(oVariables.arrClientSeason);
}

function fn_LoadTableClientSeason(_arrayClientSeason) {
       
    let arrayTemp = _arrayClientSeason;

    let tableClientSeason = arrayTemp.map(x => {
        return `
            <tr>
                <td>${x.CodigoClienteTemporada}</td>
                <td>${x.NombreTemporada}</td>
                <td>${x.Anio}</td>
                <td>${x.NombreCliente}</td>
                <td class ='text-center'>
                        <i class ='fa fa-pencil' onclick="fn_EditClientSeason('${x.IdCliente}','${x.Anio}')"></i>
                </td>
        </tr>`
    }).join('');
    
    _('contentTableClientSeason').tBodies[0].innerHTML = tableClientSeason;
    _('NumRegistros').innerHTML = _('contentTableClientSeason').tBodies[0].rows.length;
    $('.footable').trigger('footable_resize');

}


/*** Initial ***/
(function ini() {
    load();
    req_ini();
})();





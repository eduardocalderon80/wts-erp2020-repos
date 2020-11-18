/// <reference path="../../Home/Util.js" />

var ovariables = {
    strJSNClientPersonal: '',
    arrClient: '',
    arrPersonal: '',
    idgrupopersonal: '',
    accionform: '0',
}

function load() {
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupopersonal = _par(par, 'idgrupocomercial');

    $('.footable').footable();
    $('.footable').trigger('footable_resize');

    $(".select2_Personal").select2({
        placeholder: "Select Personal",
        allowClear: false
    });
    
    _('btnsave').addEventListener('click', save_form);

    $('#cboPersonal').on('change', function () {        
        req_load_client();  
    });
}

function save_form() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    if (req) {
        let arrtovalid = fn_get_client('contentTableClient');
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
                    req_save_new();
                return;
            });
        } else {
            swal({ title: "Alert", text: "You have to select some Client", type: "warning" });
        }
    }
    else {
        swal({ title: "Alert", text: "You have to select data required", type: "warning" });
    }
}

function fn_get_client(_idtable) {

    let divpadrecliente = _('contentTableClient');
    let arrcliente_selected = [...divpadrecliente.getElementsByClassName("_clschkClient")];
    let arrresultado = [], obj={};
    arrcliente_selected.forEach(x=> {        
        if (x.checked) {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            let des = fila.children[2].children[0].children[0].children[0].children[0].children[0].checked;
            let pro = fila.children[3].children[0].children[0].children[0].children[0].children[0].checked;

            obj.IdClientexGrupoPersonal = _par(par, 'IdClientexGrupoPersonal');
            obj.IdCliente = _par(par, 'IdCliente');            
            obj.Desarrollo = des == true ? 0 : 1;            
            obj.Produccion = pro == true ? 0 : 1;
            arrresultado.push(obj);
        }
    });
    return arrresultado;
}

function res_post(respuesta) {
    let arrLimpiar = [];
    _('contentTableClient').tBodies[0].innerHTML = arrLimpiar;
    req_load_client();
    swal({ title: "Good job!", text: "You Have registered new Data", type: "success" });
}

/*** Insert ***/

function req_load_client() {
    let par = JSON.stringify(_getParameter({ id: 'formMante', clase: '_enty' }));
    let urlaccion = 'Maestra/ClientPersonal/ClientPersonal_Get?par=' + par;
    Get(urlaccion, res_load_client)
}

function res_load_client(response) {
    _('contentTableClient').tBodies[0].innerHTML = '';
    let orpta = response != '' ? response.split('¬') : null;    

    let arrRespuesta = orpta != null ? JSON.parse(orpta[0]) : '';
        let arrClient = ovariables.arrClient;
        let table = arrClient.map(x=> {
            return `<tr data-par='IdClientexGrupoPersonal:${x.IdClientexGrupoPersonal},IdCliente:${x.IdCliente}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivClient'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkClient' style='position: absolute; opacity: 0;' id='chkAnalyst' data-IdClientexGrupoPersonal='${x.IdClientexGrupoPersonal}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td >${x.NombreCliente}</td>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivDesarrollo'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkDesarrollo' style='position: absolute; opacity: 0;' id='chkdesarrollo' data-IdClientexGrupoPersonal='${x.IdClientexGrupoPersonal}' value='${x.Desarrollo}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                 <td class='text-center'>
                        <div  class ='i-checks _clsDivProduccion'>
                            <div class ='icheckbox_square-green' style='position: relative;' >
                                <label>
                                    <input type='checkbox' class ='i-checks _clschkProduccion' style='position: absolute; opacity: 0;' id='chkproduccion' data-IdClientexGrupoPersonal='${x.IdClientexGrupoPersonal}' value='${x.Produccion}'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                                </label>
                            </div>
                        </div>
                </td>
            <tr>
            `
        }).join('');

        _('contentTableClient').tBodies[0].innerHTML = table;
        $('.footable').trigger('footable_resize');

        let divpadrecliente = _('contentTableClient');
        let arrcliente_selected = [...divpadrecliente.getElementsByClassName("_clschkClient")];
        let arrdesarrollo_selected = [...divpadrecliente.getElementsByClassName("_clschkDesarrollo")];
        let arrproduccion_selected = [...divpadrecliente.getElementsByClassName("_clschkProduccion")];

        if (arrRespuesta.length > 0) {
         
            arrdesarrollo_selected.forEach(x=> {
                x.checked = arrRespuesta.some(y=> {
                    return (y.Desarrollo.toString() === '0' && y.IdClientexGrupoPersonal.toString() === x.getAttribute("data-IdClientexGrupoPersonal"))
                });
            });

            arrproduccion_selected.forEach(x=> {
               
                x.checked = arrRespuesta.some(y=> {
                    return (y.Produccion.toString() === '0' && y.IdClientexGrupoPersonal.toString() === x.getAttribute("data-IdClientexGrupoPersonal"))
                });
            });

            arrcliente_selected.forEach(x=> {
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                x.checked = arrRespuesta.some(y=> {
                    return (y.IdClientexGrupoPersonal.toString() === x.getAttribute("data-IdClientexGrupoPersonal") && y.Eliminado === 0)
                });

                if (!x.checked) {
                    fila.children[2].children[0].children[0].children[0].children[0].disabled = true;
                    fila.children[3].children[0].children[0].children[0].children[0].disabled = true;                  
                }
            });
        }

        handlerTable('contentTableClient');

    //}

    /*
    let data = response.split('¬');
    let arrRespuesta = [];
    if (data[0].length > 0) {
        arrRespuesta = JSON.parse(data[0]);
    }

    let arrClient = ovariables.arrClient;    
    let arrResultado = arrClient;
    let table = arrResultado.map(x=> {
        return `<tr data-par='IdClientexGrupoPersonal:${x.IdClientexGrupoPersonal},IdCliente:${x.IdCliente}'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsDivClient'>
                        <div class ='icheckbox_square-green' style='position: relative;' >
                            <label>
                                <input type='checkbox' class ='i-checks _clschkClient' style='position: absolute; opacity: 0;' id='chkAnalyst' data-IdClientexGrupoPersonal='${x.IdClientexGrupoPersonal}'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.NombreCliente}</td>
            <tr>
            `
    }).join('');
    _('contentTableClient').tBodies[0].innerHTML = table;
    $('.footable').trigger('footable_resize');

    let divpadrecliente = _('contentTableClient');
    let arrcliente_selected = [...divpadrecliente.getElementsByClassName("_clschkClient")];

    if (arrRespuesta.length > 0) {
        arrcliente_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            x.checked = arrRespuesta.some(y=> {
                return (y.IdClientexGrupoPersonal.toString() === x.getAttribute("data-IdClientexGrupoPersonal"))
            });
        });
    }

    handlerPersonal('contentTableClient');*/

}

function handlerTable(_idtable) {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $('.i-checks._clsDivClient').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let x = e.currentTarget;
        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        let habilitado = fila.children[0].children[0].children[0].children[0].children[0].children[0].checked;
        if (habilitado) {
            fila.children[2].children[0].children[0].children[0].children[0].children[0].disabled = false;
            fila.children[3].children[0].children[0].children[0].children[0].children[0].disabled = false;
        }
        else {
            fila.children[2].children[0].children[0].children[0].children[0].children[0].disabled = true;
            fila.children[3].children[0].children[0].children[0].children[0].children[0].disabled = true;
        }
        handlerTable('contentTableClient');
    });
}

function req_save_new() {
    let url = 'Maestra/ClientPersonal/ClientPersonal_Insert';
    let par = { IdGrupoPersonal: ovariables.idgrupopersonal };
    let id = _('cboPersonal').value;

    let opersonal = ovariables.arrPersonal.find(x=>x.IdPersonalxGrupoPersonal.toString() === id);
    let data = opersonal.IdPersonal;

    let odata = _getParameter({ id: 'formMante', clase: '_enty' }),
        arrdata = JSON.stringify(fn_get_client('contentTableClient')),
        form = new FormData();
    odata["IdGrupoPersonal"] = ovariables.idgrupopersonal;
    odata["IdPersonal"] = data;

    form.append('par', JSON.stringify(par));
    form.append('pardata', JSON.stringify(odata));
    form.append('pararray', arrdata);

    Post(url, form, res_post);
}

/*** Load ***/
function req_ini() {
    let urlaccion = 'Maestra/ClientPersonal/ClientPersonal_List?idgrupopersonal=' + ovariables.idgrupopersonal;
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != '' ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) {
            ovariables.arrPersonal = JSON.parse(orpta[0]);
            fn_load_personal(ovariables.arrPersonal);
        }
        if (JSON.parse(orpta[1] != '')) { ovariables.arrClient = JSON.parse(orpta[1]); }        
    }
}

function fn_load_personal(_arrpersonal) {
    let array = _arrpersonal;
    let cbopersonal = '<option></option>';
    array.forEach(x=> { cbopersonal += `<option value='${x.IdPersonalxGrupoPersonal}'>${x.NombrePersonal}</option>` });
    _('cboPersonal').innerHTML = cbopersonal;
}

/*** Initial ***/
(function ini() {
    load();
    req_ini();
})();
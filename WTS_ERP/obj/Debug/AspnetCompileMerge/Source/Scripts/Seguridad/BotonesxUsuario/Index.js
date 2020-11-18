var ovariables = {
    arrusuarios: '',
    arrbotones: '',
    arrventana: '',
    arrfuncion: '',
    arrbotonesusuario: '',
    idusuario:'',
    idventana: '',
    idfuncion: '',
    estado:'0'
}

function load() {
    $('.footable').footable();

    _('cboUsuario').addEventListener('change', fn_load_check_botones);
    _('cboVentana').addEventListener('change', fn_change_ventana);
    _('cboFuncion').addEventListener('change', fn_load_botones);

    _('btnSave').addEventListener('click', req_save);
}

function req_save() {
    let req = _required({ id: 'idformulario', clase: '_enty' });
    if (req) {
        let table = _('tblbotones').tBodies[0].rows.length;
        if (table > 0) {
            swal({
                title: "Esta seguro de guardar los datos ingresados?",
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
        } else {
            swal({ title: "Alert", text: "No hay botones que asignar", type: "warning" });
        }
    }
    else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    }
}

function req_new() {
    let urlaccion = 'Seguridad/BotonesxUsuario/BotonexUsuario_Insert_Update';    
    let opar = _getParameter({ id: 'idformulario', clase: '_enty' }),
        arrbotones_active = JSON.stringify(fn_get_botones_active('tblbotones')),
        arrbotones_desactive = JSON.stringify(fn_get_botones_desactive('tblbotones'));
    form = new FormData();
    form.append('par', JSON.stringify(opar));
    form.append('pardetail', arrbotones_active);
    form.append('parsubdetail', arrbotones_desactive);

    Post(urlaccion, form, res_new);
}

function res_new(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha registrado una nueva solicitud correctamente", type: "success" });
            ovariables.idusuario = _('cboUsuario').value;
            ovariables.idventana = _('cboVentana').value;
            ovariables.idfuncion = _('cboFuncion').value;
            ovariables.estado = '1';
            req_ini();
        };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
    }
}

function fn_get_botones_active(_table) {
    let arr_result = [], divpadre = _('divContentTBL');
    var achk = Array.from(divpadre.getElementsByClassName('_clschkBoton'));
    if (achk.length > 0) {
        achk.filter(x=>x.checked).forEach(x=> {
            obj = {};
            obj.IdBotonFuncionVentana = parseInt(x.value);
            arr_result.push(obj);
        });
    }
     
    //let table = _(_table), arr_checked = [...table.getElementsByClassName('checked')],
    //    obj = {}, arr_result = [];
    //if (arr_checked.length > 0) {
    //    arr_checked.forEach(x=> {
    //        obj = {
    //        };
    //        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
    //        let par = fila.getAttribute('data-par');
    //        obj.IdBotonFuncionVentana = _par(par, 'IdBotonFuncionVentana');
    //        arr_result.push(obj);
    //    });
    //}
    return arr_result;
}

function fn_get_botones_desactive(_table) {

    let arr_result = [], divpadre = _('divContentTBL');
    var achk = Array.from(divpadre.getElementsByClassName('_clschkBoton'));
    if (achk.length > 0) {
        achk.filter(x=>x.checked==false).forEach(x=> {
            obj = {};
            obj.IdBotonFuncionVentana = parseInt(x.value);
            arr_result.push(obj);
        });
    }

    //let table = _(_table).tBodies[0], totalfilas = table.rows.length,
    //    row = null, arr_result = [];

    //for (let i = 0; i < totalfilas; i++) {
    //    row = table.rows[i];
    //    let fila = row.children[0].children[1].children[0].children[0].children[0];
    //    let par = row.getAttribute('data-par'), clsrow = fila.classList[1];

    //    if (clsrow == undefined) {
    //        let obj = {
    //            IdBotonFuncionVentana: parseInt(_par(par, 'IdBotonFuncionVentana'))
    //        }
    //        arr_result.push(obj);
    //    }
    //}
    return arr_result;
}

function req_ini() {
    let urlaccion = 'Seguridad/BotonesxUsuario/BotonesxUsuario_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.arrusuarios = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.arrbotones = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.arrventana = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables.arrfuncion = JSON.parse(orpta[3]); }
        if (JSON.parse(orpta[4] != '')) { ovariables.arrbotonesusuario = JSON.parse(orpta[4]); }

        fn_load_usuario();
        fn_load_ventana();
        fn_load_funcion();
        //fn_load_botones();
    }
}

function fn_load_usuario() {
    let arrusuarios = ovariables.arrusuarios;
    let cbousuario = '<option value>-- Seleccione Usuario  --</option>';
    arrusuarios.forEach(x=> { cbousuario += `<option value='${x.IdUsuario}'>${x.NombrePersonal}</option>` })
    _('cboUsuario').innerHTML = cbousuario;
    _('cboUsuario').value = ovariables.idusuario;
}

function fn_load_ventana() {
    let arrventana = ovariables.arrventana;
    let cboventana = '<option value>-- Seleccione Ventana --</option>';
    arrventana.forEach(x=> { cboventana += `<option value='${x.IdVentana}'>${x.Nombre}</option>` })
    _('cboVentana').innerHTML = cboventana;
    _('cboVentana').value = ovariables.idventana;
}

function fn_change_ventana() {
    fn_load_funcion();
    fn_load_botones();
}

function fn_load_funcion() {
    ovariables.idventana = _('cboVentana').value;
    let arrfuncion = ovariables.arrfuncion.filter(x=> x.idventana.toString() === ovariables.idventana.toString());
    let cbofuncion = '<option value>-- Seleccione Función --</option>';
    if (arrfuncion.length > 0) { arrfuncion.forEach(x=> { cbofuncion += `<option value='${x.idfuncion}'>${x.funcion}</option>` }) }
    _('cboFuncion').innerHTML = cbofuncion;
    if (arrfuncion.some(x=> { return (x.idfuncion.toString() === ovariables.idfuncion) })) {
        _('cboFuncion').value = ovariables.idfuncion;
    }
}

function fn_load_botones() {
    let idventana = parseInt(_('cboVentana').value);
    let idfuncion = parseInt(_('cboFuncion').value);
    //ovariables.idventana = parseInt(_('cboVentana').value);
    //ovariables.idfuncion = parseInt(_('cboFuncion').value);
    let html = '', item = 0;
    let result = ovariables.arrbotones.filter(x=>x.IdVentana === idventana && x.IdFuncion === idfuncion && x.Estado === 0);
    //let result = ovariables.arrbotones.filter(x=>x.IdVentana === ovariables.idventana && x.IdFuncion === ovariables.idfuncion && x.Estado === 0);
    if (result.length > 0) {
        result.forEach(x=> {
            item++;
            let preview = `<button id='${x.IdBoton}' class='${x.Clase}'>
                            <span class ='${x.Icono}'></span>
                            ${x.Nombre}
                        </button>`;
            html += `
            <tr  data-par='IdBotonFuncionVentana:${x.IdBotonFuncionVentana}'>
                <td class ='text-center'>
                        <div  class ='i-checks _clsDivBoton'>
                            <div class ='icheckbox_square-green' style='position: relative;' >
                                <label>
                                    <input type='checkbox' class ='i-checks _clschkBoton' style='position: absolute; opacity: 0;' id='IdBotonFuncionVentana' data-IdBotonFuncionVentana='${x.IdBotonFuncionVentana}' value='${x.IdBotonFuncionVentana}'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                                </label>
                            </div>
                        </div>
                    </td>
                <td class ='col-sm-1 text-center'>${preview}</td>
                <td class ='col-sm-1'>${x.IdBoton}</td>
                <td class ='col-sm-2'>${x.Agrupador}</td>
                <td class ='col-sm-1'>${x.Accion}</td>
                <td class ='col-sm-2'>${x.Metodo}</td>
                <td class ='col-sm-2'>${x.Ubicacion}</td>
            </tr>
            `
        });
    } else {
        html = '';
    }

    _('tblbotones').tBodies[0].innerHTML = html;
    let tbl = _('tblbotones').tBodies[0], total = tbl.rows.length;
    $('.footable').trigger('footable_resize');
    fn_load_check_botones();
}

function fn_load_check_botones() {
    let divpadre = _('tblbotones'),
        arr_selected = [...divpadre.getElementsByClassName("_clschkBoton")];
    let idusuario = _('cboUsuario').value;
    //if (ovariables.arrbotonesusuario.length > 0) {
    let arrbotonesusuariobloq = ovariables.arrbotonesusuario != '' ? ovariables.arrbotonesusuario.filter(x=>x.IdUsuario.toString() === idusuario && x.Estado === 0) : 0;
        if (arrbotonesusuariobloq.length > 0) {
            arr_selected.forEach(x=> {
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                x.checked = !arrbotonesusuariobloq.some(y=> {
                    return (x.getAttribute("data-IdBotonFuncionVentana") === y.IdBotonFuncionVentana.toString())
                });
            })
        }
        else {
            arr_selected.forEach(x=> {
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                x.checked = true;
            })
        }
    //}
    handlerModulo('tblbotones');
}

function handlerModulo(_idtable) {
    $('.i-checks._clsDivBoton').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

(function ini() {
    load();
    req_ini();
})()



//function load() {
//    $('.footable').footable();
//    _('btnNew').addEventListener('click', req_new);
//    _('cboEstadoSolicitud').addEventListener('change', fn_load_botones);
//}

//function req_new() {
//    let urlaccion = 'Seguridad/BotonesxUsuario/New', urljs = 'Seguridad/BotonesxUsuario/New';
//    _Go_Url(urlaccion, urljs);
//}

//function req_ini() {
//    let urlaccion = 'Seguridad/BotonesxUsuario/BotonesxUsuario_List';
//    Get(urlaccion, res_ini);
//}

//function res_ini(response) {
//    let orpta = response != null ? response.split('¬') : null;
//    if (orpta != null) {
//        if (JSON.parse(orpta[0] != '')) { ovariables.arrbotones = JSON.parse(orpta[0]); }
//        if (JSON.parse(orpta[1] != '')) { }
//        if (JSON.parse(orpta[2] != '')) { }

//        fn_load_botones();
//    }
//}

//function fn_load_botones() {
//    let arrbotones = ovariables.arrbotones;
//    let estado = _parseInt(_('cboEstadoSolicitud').value);
//    let result = arrbotones.filter(x=>x.Estado === estado);
//    let html = '';
//    result.forEach(x=> {
//        let preview = `<button id='${x.IdBoton}' class='${x.Clase}'>
//                            <span class ='${x.Icono}'></span>
//                            ${x.Nombre}
//                        </button>`;
//        html += `
//            <tr ondblclick='req_edit("${x.IdBotonFuncionVentana}","${x.Estado}")'>
//                <td class ='col-sm-1 text-center'>${preview}</td>
//                <td class ='col-sm-1'>${x.IdBoton}</td>
//                <td class ='col-sm-2'>${x.Agrupador}</td>
//                <td class ='col-sm-1'>${x.Accion}</td>
//                <td class ='col-sm-2'>${x.Titulo}</td>
//                <td class ='col-sm-2'>${x.ventana}</td>
//                <td class ='col-sm-2'>${x.funcion}</td>
//            </tr>
//            `
//    });
//    _('contentBotones').tBodies[0].innerHTML = html;
//    $('.footable').trigger('footable_resize');
//}

//function req_edit(_id, _estado) {
//    let urlaccion = 'Seguridad/BotonesxUsuario/Edit', urljs = urlaccion;
//    if (_estado == '0') {
//        _Go_Url(urlaccion, urljs, 'id:' + _id);
//    }
//}

//(function ini() {
//    load();
//    req_ini();
//})()
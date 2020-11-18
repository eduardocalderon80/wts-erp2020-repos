var ovariables = {
    accion_categoria: 'listar',
    idequipotic: '',
    idtiposolicitud: '',
    arrcategoria: '',
    arrequipotic: '',
    arrtiposolicitud: '',

    accion_aprobador: 'listar',
    arraprobador: '',
    arrpersonal: '',
    arrarea: '',
    arrmodulo: '',
    arraprobarea: '',
    arraprobmodulo: '',
}

function load() {

    fn_form_botones();
    fn_form_valid(true);
    fn_load_equipotic();
    fn_load_tiposolicitud();

    fn_form_botones_aprobador();
    fn_form_valid_aprobador(true);

    $('.footable').footable();
    $('.footable').trigger('footable_resize');

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('.footable').footable();
        $('.footable').trigger('footable_resize');
    })

    _('btnNuevo').addEventListener('click', fn_new_categoria);
    _('btnEditar').addEventListener('click', fn_edit_categoria);
    _('btnRetonar').addEventListener('click', fn_return_categoria)
    _('btnGuardar').addEventListener('click', fn_request_categoria);
    _('cboEstado').addEventListener('change', fn_load_categoria);

    _('btnNuevoAprobador').addEventListener('click', fn_new_aprobador);
    _('btnEditarAprobador').addEventListener('click', fn_edit_aprobador);
    _('btnRetonarAprobador').addEventListener('click', fn_return_aprobador);
    _('btnGuardarAprobador').addEventListener('click', fn_request_aprobador);
    _('cboPersonal').addEventListener('change', fn_load_infopersonal);
    _('cboEstadoAprobador').addEventListener('change', fn_load_aprobador);

    _('cboEquipoTIC').addEventListener('change', fn_change_tiposolicitud);
    _('cboTipoSolicitud').addEventListener('change', fn_change_tiposolicitud);

    handlercheck();  
}

/*** Categoria ***/
function fn_request_categoria() {
    let req = _required({ id: 'tab-categoria', clase: '_enty' });
    if (req) {
        swal({
            title: "Esta seguro de guardar los datos?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_save_categoria();
        });
    }
    else { swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" }); }
}

function req_save_categoria() {
    let aprobacion = 1;
    let checked = _('divAprobacion').children[0].children[0].classList.contains('checked');
    if (checked) { aprobacion = 2 } else { aprobacion = 1 }
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Categoria_Insert';
    if (ovariables.accion_categoria == 'editar') { urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Categoria_Update'; }
        
    let oCategoria = _getParameter({ id: 'tab-categoria', clase: '_enty' }),
        form = new FormData();
    oCategoria['IdCategoria'] = _('hf_IdCategoria').value;
    oCategoria['Aprobacion'] = aprobacion;
    form.append('par', JSON.stringify(oCategoria));
    
    Post(urlaccion, form, res_save_categoria);
}

function res_save_categoria(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado == 'success') {
            swal({ title: 'Buen Trabajo', text: 'Usted ha registrado una nueva categoria correctamente', type: 'success' });
            fn_return_categoria();
            req_ini();
        }
        if (orpta.estado == 'error') { swal({ title: 'Existe un problema!', text: 'Debe comunicarse con el administrador TIC', type: 'error' }); }
    }
}

function fn_form_botones() {
    if (ovariables.accion_categoria == 'listar') {
        _('btnNuevo').classList.remove('hide');
        _('btnRetonar').classList.remove('hide');
        _('btnEditar').classList.add('hide');
        _('btnGuardar').classList.add('hide');
    }
    else if (ovariables.accion_categoria == 'nuevo' || ovariables.accion_categoria == 'editar') {
        _('btnGuardar').classList.remove('hide');
        _('btnRetonar').classList.remove('hide');
        _('btnNuevo').classList.add('hide');
        _('btnEditar').classList.add('hide');
    }
    else if (ovariables.accion_categoria == 'load') {
        _('btnEditar').classList.remove('hide');
        _('btnRetonar').classList.remove('hide');
        _('btnNuevo').classList.add('hide');
        _('btnGuardar').classList.add('hide'); 
    }
}

function fn_form_valid(_bool) {
    _('txtCategoria').disabled = _bool;
    _('cboEquipoTIC').disabled = _bool;
    _('cboTipoSolicitud').disabled = _bool;
    _('txtDescripcion').disabled = _bool;
    _('IdAprobacion').disabled = _bool;   
}

function handlercheck() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_clean_form() {
    ovariables.accion_categoria = 'listar';
    _('hf_IdCategoria').value = '0';
    _('txtCategoria').value = '';
    _('txtDescripcion').value = '';
    _('divAprobacion').children[0].children[0].classList.remove('checked');
    fn_clean_required();
    fn_load_equipotic();
    fn_load_tiposolicitud();
}

function fn_new_categoria() {
    fn_form_valid(false);
    fn_clean_form();
    ovariables.accion_categoria = 'nuevo';
    fn_form_botones();
    handlercheck();
    fn_change_tiposolicitud();
    //_('IdAprobacion').disabled = false;
}

function fn_edit_categoria() {
    let idcategoria = _('hf_IdCategoria').value;
    if (idcategoria != '0') {
        ovariables.accion_categoria = 'editar';
        fn_form_botones();
        fn_form_valid(false);
        _('cboEquipoTIC').disabled = true;
        _('cboTipoSolicitud').disabled = true;
        handlercheck();
        fn_change_tiposolicitud();
    }
    else { swal({ title: 'Alert', text: 'Debe seleccionar una categoria a modificar', type: 'warning' }); return; }  
}

function fn_change_tiposolicitud() {
    let idequipotic = _('cboEquipoTIC').value,
        idtiposolicitud = _('cboTipoSolicitud').value;
    if (idtiposolicitud == '2') {
        //if (idequipotic == '2') {
        //    _('divAprobacion').children[0].children[0].classList.remove('disabled');
        //    _('IdAprobacion').disabled = false;
        //}
        //else {
        //    _('IdAprobacion').disabled = true;
        //}

        if (ovariables.accion_categoria == 'nuevo') {
            //_('IdAprobacion').disabled = true;
            _('divAprobacion').children[0].children[0].classList.add('checked');
            
        }
    }
    else {
        //_('IdAprobacion').disabled = true;
        _('divAprobacion').children[0].children[0].classList.remove('checked');
    }
    //handlercheck();
}

function fn_return_categoria() {
    ovariables.accion_categoria = 'listar';
    fn_form_botones();
    fn_form_valid(true);
    fn_clean_form();
}

function fn_load_edit(_idcategoria, _nombre, _idequipotic, _idtiposolicitud, _descripcion, _aprobacion) {
    fn_clean_form();
    ovariables.accion_categoria = 'load'
    fn_form_botones();
    fn_form_valid(true);
    _('hf_IdCategoria').value = _idcategoria;
    _('txtCategoria').value = _nombre;
    _('cboEquipoTIC').value = _idequipotic;
    _('cboTipoSolicitud').value = _idtiposolicitud;
    _('txtDescripcion').value = _descripcion;
    _('divAprobacion').children[0].children[0].classList.add('disabled');
    //_('IdAprobacion').disabled = true;
    //fn_change_tiposolicitud();
    if (_aprobacion == 1) {
        _('divAprobacion').children[0].children[0].classList.remove('checked');
    }
    else {
        _('divAprobacion').children[0].children[0].classList.add('checked');
    }
}

function fn_load_equipotic() {
    let cboequipotic = `<option value='1'>Aplicaciones</option><option value='2'>Infraestructura</option>`
    _('cboEquipoTIC').innerHTML = cboequipotic;
}

function fn_load_tiposolicitud() {
    let cbotiposolicitud = `<option value='1'>Incidencia</option><option value='2'>Requerimiento</option>`
    _('cboTipoSolicitud').innerHTML = cbotiposolicitud;
}

function fn_load_categoria() { 
    let arrcategoria = ovariables.arrcategoria;
    let html = '', estado = _('cboEstado').value;
    if (arrcategoria.length > 0) {
        let result = arrcategoria.filter(x=>x.Estado.toString() === estado);
        result.forEach(x=> {            
            if (x.Estado.toString() == '1') {
                html += `
                    <tr>
                        <td class ='text-center col-sm-2'>
                            <button class ='btn btn-outline btn-primary' onclick="fn_request_estado('${x.IdCategoria}','${x.Estado}')">
                                <span class ='fa fa-check-circle'></span>
                            </button>
                        </td>`;
            } else {
                html += `
                    <tr>
                        <td class ='text-center col-sm-2'>
                            <button class ='btn btn-outline btn-danger' onclick="fn_request_estado('${x.IdCategoria}','${x.Estado}')">
                                <span class ='fa fa-trash-o'></span>
                            </button>
                            <button class ='btn btn-outline btn-success' onclick="fn_load_edit('${x.IdCategoria}','${x.Categoria}','${x.IdEquipoTIC}','${x.IdTipoSolicitud}', '${x.Descripcion}', '${x.Aprobacion}')">
                                <span class ='fa fa-edit'></span>
                            </button>
                        </td>`;
            }
            html += `
                    <td>${x.Categoria}</td>
                    <td>${x.EquipoTIC}</td>
                    <td>${x.TipoSolicitud}</td>
                    <td class='hide'>${x.Descripcion}</td>
                   </tr>
                `;
        });
        _('tblcategoria').tBodies[0].innerHTML = html;
        $('.footable').trigger('footable_resize');
    }
}

function fn_request_estado(idcategoria, estado) {
    let title='';
    if (estado == 0) { title = 'Esta seguro de deshabilitar este registro?' } else { title = 'Esta seguro de habilitar este registro?' }
    swal({
        title: title,
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_delete_categoria(idcategoria, estado);
    });    
}

function req_delete_categoria(_idcategoria, _estado) {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Categoria_Delete';
    let oCategoria = _getParameter({ id: 'tab-categoria', clase: '_enty' }),
        form = new FormData();
    oCategoria['IdCategoria'] = _idcategoria;
    oCategoria['Estado'] = _estado;
    form.append('par', JSON.stringify(oCategoria));
    Post(urlaccion, form, res_delete_categoria);
}

function res_delete_categoria(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado == 'success') {
            swal({ title: 'Buen Trabajo', text: 'Usted ha modificado el estado de esta categoria correctamente', type: 'success' });
            fn_return_categoria();
            req_ini();
        }
        if (orpta.estado == 'error') { swal({ title: 'Existe un problema!', text: 'Debe comunicarse con el administrador TIC', type: 'error' }); }
    }
}

/*** Aprobador ***/

function fn_form_botones_aprobador() {
    if (ovariables.accion_aprobador == 'listar' || ovariables.accion_aprobador == 'view') {
        _('btnNuevoAprobador').classList.remove('hide');
        _('btnRetonarAprobador').classList.remove('hide');
        _('btnGuardarAprobador').classList.add('hide');
        _('btnEditarAprobador').classList.add('hide');
    }
    else if (ovariables.accion_aprobador == 'nuevo' || ovariables.accion_aprobador == 'editar') {
        _('btnGuardarAprobador').classList.remove('hide');
        _('btnRetonarAprobador').classList.remove('hide');
        _('btnNuevoAprobador').classList.add('hide');
        _('btnEditarAprobador').classList.add('hide');
    }
    else if (ovariables.accion_aprobador == 'load') {
        _('btnEditarAprobador').classList.remove('hide');
        _('btnRetonarAprobador').classList.remove('hide');
        _('btnNuevoAprobador').classList.add('hide');
        _('btnGuardarAprobador').classList.add('hide');
    }
}

function fn_form_valid_aprobador(_bool) {
    _('cboPersonal').disabled = _bool;
    _('txtCorreo').disabled = _bool;   
}

function fn_clean_form_aprobador() {
    ovariables.accion_aprobador = 'listar';
    _('hf_IdAprobador').value = '0';
    _('cboPersonal').value = '';
    _('txtCorreo').value = '';
    fn_clean_required();  
}

function fn_load_check_area() {
    let divpadre = _('tblarea');
    let arr_selected = [...divpadre.getElementsByClassName("_clschkArea")];
    let idaprobador = _('hf_IdAprobador').value;
    let resultaprobadorarea = ovariables.arraprobarea.filter(x=>x.IdAprobador.toString() === idaprobador && x.Estado === 0);
    if (ovariables.arrarea.length > 0) {
        arr_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            if (ovariables.accion_aprobador == 'listar') {
                x.disabled = true;
                x.checked = false;
            }
            else if (ovariables.accion_aprobador == 'nuevo') {
                x.disabled = false;
            }
            else if (ovariables.accion_aprobador == 'editar') {
                x.disabled = false;
            }
            else if (ovariables.accion_aprobador == 'load' || ovariables.accion_aprobador == 'view') {
                x.disabled = true;
                x.checked = resultaprobadorarea.some(y=> {
                    return (y.IdArea.toString() === x.getAttribute("data-IdArea"))
                });
            }          
        });
    }
    handlerArea('tblarea');
}

function fn_load_check_modulo() {
    let divpadre_modulo = _('tblmodulo');
    let arrmodulo_selected = [...divpadre_modulo.getElementsByClassName("_clschkModulo")];
    let idaprobador = _('hf_IdAprobador').value;
    let resultaprobadormodulo = ovariables.arraprobmodulo.filter(x=>x.IdAprobador.toString() === idaprobador && x.Estado === 0);
    if (ovariables.arrmodulo.length > 0) {
        arrmodulo_selected.forEach(x=> {
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            if (ovariables.accion_aprobador == 'listar') {
                x.disabled = true;
                x.checked = false;
            }
            else if (ovariables.accion_aprobador == 'nuevo') {
                x.disabled = false;
                //x.checked = false;
            }
            else if (ovariables.accion_aprobador == 'editar') {
                x.disabled = false;
            }
            else if (ovariables.accion_aprobador == 'load' || ovariables.accion_aprobador == 'view') {
                x.disabled = true;
                x.checked = resultaprobadormodulo.some(y=> {
                    return (y.IdModulo.toString() === x.getAttribute("data-IdModulo"))
                });
            }
        });
    }
    handlerModulo('tblmodulo');
}

function fn_new_aprobador() {
    fn_clean_form_aprobador();
    ovariables.accion_aprobador = 'nuevo';
    fn_form_botones_aprobador();
    fn_form_valid_aprobador(false);
    fn_load_personal();
    fn_load_area();
    fn_load_modulo();
}

function fn_edit_aprobador() {
    let idaprobador = _('hf_IdAprobador').value;
    let idpersonal = _('hf_IdPersonal').value;
    if (idaprobador != '0') {
        ovariables.accion_aprobador = 'editar';
        fn_form_botones_aprobador();
        fn_form_valid_aprobador(true);
        fn_load_check_area();
        fn_load_check_modulo();
    }
    else { swal({ title: 'Alert', text: 'Debe seleccionar una categoria a modificar', type: 'warning' }); return; }  
}

function fn_return_aprobador() {
    ovariables.accion_aprobador = 'listar';
    fn_clean_form_aprobador();
    fn_form_botones_aprobador();
    fn_form_valid_aprobador(true);
    fn_load_personal();
    fn_load_area();
    fn_load_modulo();
}

function fn_request_aprobador() {
    let req = _required({ id: 'tab-aprobador', clase: '_enty' });
    if (req) {
        swal({
           title: "Esta seguro de guardar los datos del aprobador?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_save_aprobador();
        });
    }
    else { swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" }); }
}

function req_save_aprobador() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Aprobador_Insert';
    if (ovariables.accion_aprobador == 'editar') { urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Aprobador_Update'; }

    let oAprobador = _getParameter({ id: 'tab-aprobador', clase: '_enty' }),
        oArea = JSON.stringify(fn_get_area('tblarea')),
    oModulo = JSON.stringify(fn_get_modulo('tblmodulo'));
    form = new FormData();
    oAprobador['IdAprobador'] = _('hf_IdAprobador').value;
    //oAprobador['IdPersonal'] = _('hf_IdPersonal').value;
    form.append('par', JSON.stringify(oAprobador));
    form.append('par_area', oArea);
    form.append('par_modulo', oModulo);

    Post(urlaccion, form, res_save_aprobador);
}

function fn_get_area(_table) {
    let table = _(_table), arr_checked = [...table.getElementsByClassName('checked')], obj = {}, arr_result = [];
    if (arr_checked.length > 0) {
        arr_checked.forEach(x=> {
            obj = {
            };
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.IdArea = _par(par, 'IdArea');
            arr_result.push(obj);
        });
    }
    return arr_result;
}

function fn_get_modulo(_table) {
    let table = _(_table), arr_checked = [...table.getElementsByClassName('checked')], obj = {}, arr_result = [];
    if (arr_checked.length > 0) {
        arr_checked.forEach(x=> {
            obj = {
            };
            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj = {
                IdModulo: _par(par, 'IdModulo'),
                IdSistema: _par(par, 'IdSistema')
            }
            arr_result.push(obj);
        });
    }
    return arr_result;
}

function res_save_aprobador(response) {
    let orpta = response != '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado == 'success') {
            swal({ title: 'Buen Trabajo', text: 'Usted ha registrado un nuevo aprobador correctamente', type: 'success' });
            fn_return_aprobador();
            req_ini();
        }
        if (orpta.estado == 'error') {
            swal({ title: 'Existe un problema!', text: 'Debe comunicarse con el administrador TIC', type: 'error' });
        }
    }
}

function fn_load_aprobador() {
    let arraprobador = ovariables.arraprobador;
    let html = '', estado = _('cboEstadoAprobador').value;
    if (arraprobador.length > 0) {
        let result = arraprobador.filter(x=>x.Estado.toString() === estado);
        result.forEach(x=> {
            if (x.Estado.toString() == '1') {
                html += `
                    <tr>
                        <td class ='text-center col-sm-2'>
                            <button class ='btn btn-outline btn-primary' onclick="fn_request_estado_aprobador('${x.IdAprobador}','${x.IdPersonal}','${x.Estado}')">
                                <span class ='fa fa-check-circle'></span>
                            </button>
                            <button class ='btn btn-outline btn-info' onclick="fn_load_edit_aprobador('${x.IdAprobador}','${x.IdPersonal}','${x.Correo}','${x.Estado}')">
                                <span class ='fa fa-list'></span>
                            </button>
                        </td>`;
            } else {
                html += `
                    <tr>
                        <td class ='text-center col-sm-2'>
                            <button class ='btn btn-outline btn-danger' onclick="fn_request_estado_aprobador('${x.IdAprobador}','${x.IdPersonal}','${x.Estado}')">
                                <span class ='fa fa-trash-o'></span>
                            </button>
                            <button class ='btn btn-outline btn-success' onclick="fn_load_edit_aprobador('${x.IdAprobador}','${x.IdPersonal}','${x.Correo}','${x.Estado}')">
                                <span class ='fa fa-edit'></span>
                            </button>
                        </td>`;
            }
            html += `
                    <td>${x.NombrePersonal}</td>
                    <td>${x.Correo}</td>
                   </tr>
                `;
        });
        _('tblaprobador').tBodies[0].innerHTML = html;
        $('.footable').trigger('footable_resize');
    }
}

function fn_load_edit_aprobador(_idaprobador, _idpersonal, _correo, _estado) {
    fn_clean_form_aprobador();
    if (_estado == 1) { ovariables.accion_aprobador = 'view' }
    else {
        ovariables.accion_aprobador = 'load'
    }
    fn_form_botones_aprobador();
    fn_form_valid_aprobador(true);
    fn_load_personal();
    _('hf_IdAprobador').value = _idaprobador;
    _('hf_IdPersonal').value = _idpersonal;
    _('cboPersonal').value = _idpersonal;
    _('txtCorreo').value = _correo;
    fn_load_area();
    fn_load_modulo();
}

function fn_load_personal() {
    let arrpersonal = ovariables.arrpersonal;
    let cbopersonal = `<option value=''>-- Seleccione Personal --</option>`;
    if (arrpersonal.length > 0) {
        if (ovariables.accion_aprobador == 'nuevo') {
            let resactivo = arrpersonal.filter(x=> x.Estado === 0 && x.Eliminado === 0);
            let result = resactivo.filter(x=> {
                return !ovariables.arraprobador.some(y=>y.IdPersonal === x.IdPersonal);
            });

            result.forEach(z=> {
                cbopersonal += `<option value='${z.IdPersonal}'>${z.NombrePersonal}</option>`;
            });
        }
        else {
            arrpersonal.forEach(x=> {
                cbopersonal += `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`;
            });
        }
        _('cboPersonal').innerHTML = cbopersonal;
        fn_load_infopersonal();
    }
}

function fn_load_infopersonal() {
    let idpersonal = _('cboPersonal').value;
    if (idpersonal != '') {
        let result = ovariables.arrpersonal.filter(x=>x.IdPersonal.toString() === idpersonal);
        result.forEach(y=> {
            _('txtCorreo').value = y.CorreoElectronico;
        });
    }
    else {
        _('txtCorreo').value = '';
    }
}

function fn_load_area() {
    let arrarea = ovariables.arrarea;
    let array = '';

    if (arrarea.length > 0) {
        if (ovariables.accion_aprobador == 'nuevo') { array = ovariables.arrarea.filter(x=> x.Eliminado === 0); }
        else {
            array = arrarea;
        }

        let table = array.map(x=> {
            return `<tr data-par='IdArea:${x.IdArea}'>
                     <td class ='text-center'>
                        <div  class ='i-checks _clsDivArea'>
                            <div class ='icheckbox_square-green' style='position: relative;' >
                                <label>
                                    <input type='checkbox' class ='i-checks _clschkArea' style='position: absolute; opacity: 0;' id='chkArea' data-IdArea='${x.IdArea}'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                                </label>
                            </div>
                        </div>
                    </td>
                    <td>${x.NombreArea}</td>
                <tr>`
        }).join('');
        _('tblarea').tBodies[0].innerHTML = table;
        $('.footable').trigger('footable_resize');
        fn_load_check_area();
        //handlerArea('tblarea');
    }
}

function handlerArea(_idtable) {
    $('.i-checks._clsDivArea').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_load_modulo() {
    let arrmodulo = ovariables.arrmodulo;
    let array = '';

    if (arrmodulo.length > 0) {
        if (ovariables.accion_aprobador == 'nuevo') { array = ovariables.arrmodulo.filter(x=> x.Estado === 0); }
        else {
            array = arrmodulo;
        }
        let table = array.map(x=> {
            return `<tr data-par='IdModulo:${x.IdModulo},IdSistema:${x.IdSistema}'>
                     <td class ='text-center'>
                        <div  class ='i-checks _clsDivModulo'>
                            <div class ='icheckbox_square-green' style='position: relative;' >
                                <label>
                                    <input type='checkbox' class ='i-checks _clschkModulo' style='position: absolute; opacity: 0;' id='chkModulo' data-IdModulo='${x.IdModulo}'>
                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>

                                </label>
                            </div>
                        </div>
                    </td>
                    <td>${x.Sistema}</td>
                    <td>${x.Modulo}</td>
                <tr>`
        }).join('');
        _('tblmodulo').tBodies[0].innerHTML = table;
        $('.footable').trigger('footable_resize');
        fn_load_check_modulo();
        //handlerModulo('tblmodulo');
    }
}

function handlerModulo(_idtable) {
    $('.i-checks._clsDivModulo').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_request_estado_aprobador(idaprobador, idpersonal, estado) {
    let title = '';
    if (estado == 0) { title = 'Esta seguro de deshabilitar este registro?' } else {
        title = 'Esta seguro de habilitar este registro?'
    }
    swal({
        title: title,
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        req_delete_aprobador(idaprobador, idpersonal, estado);
    });
}

function req_delete_aprobador(_idaprobador, _idpersonal, _estado) {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Aprobador_Delete';
    let oCategoria = _getParameter({ id: 'tab-aprobador', clase: '_enty' }),
        form = new FormData();
    oCategoria['IdAprobador'] = _idaprobador;
    oCategoria['IdPersonal'] = _idpersonal;
    oCategoria['Estado'] = _estado;
    form.append('par', JSON.stringify(oCategoria));
    Post(urlaccion, form, res_delete_aprobador);
}

function res_delete_aprobador(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado == 'success') {
            swal({ title: 'Buen Trabajo', text: 'Usted ha modificado el estado de este aprobador correctamente', type: 'success' });
            fn_return_aprobador();
            req_ini();
        }
        if (orpta.estado == 'error') {
            swal({ title: 'Existe un problema!', text: 'Debe comunicarse con el administrador TIC', type: 'error' });
        }
    }
}

function fn_clean_required() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Configuration_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) {
            ovariables.arrcategoria = JSON.parse(orpta[0]); fn_load_categoria();
        }
        if (JSON.parse(orpta[1] != '')) {
            ovariables.arrequipotic = JSON.parse(orpta[1]);
        }
        if (JSON.parse(orpta[2] != '')) {
            ovariables.arrtiposolicitud = JSON.parse(orpta[2]);
        }
        if (JSON.parse(orpta[3] != '')) {
            ovariables.arraprobador = JSON.parse(orpta[3]);
        }
        if (JSON.parse(orpta[4] != '')) {
            ovariables.arrpersonal = JSON.parse(orpta[4]);
        }
        if (JSON.parse(orpta[5] != '')) {
            ovariables.arrarea = JSON.parse(orpta[5]);
        }
        if (JSON.parse(orpta[6] != '')) {
            ovariables.arrmodulo = JSON.parse(orpta[6]);
        }

        if (JSON.parse(orpta[7] != '')) {
            ovariables.arraprobarea = JSON.parse(orpta[7]);
        }
        if (JSON.parse(orpta[8] != '')) {
            ovariables.arraprobmodulo = JSON.parse(orpta[8]);
        }

        fn_load_aprobador();
        fn_load_personal();
        fn_load_area();
        fn_load_modulo();
    }
}

(function ini() {
    load();
    req_ini();
})();
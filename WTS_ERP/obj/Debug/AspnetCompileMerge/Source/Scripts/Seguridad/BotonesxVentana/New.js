var ovariables = {
    arrgeneral:'',
    arrventana: '',
    arrfuncion:'',
    idfuncionventana: '',
    item:'0'
}

function load() { 
    _('btnSave').addEventListener('click', req_save);
    _('btnReturn').addEventListener('click', fn_return);

    //_('btnAgregar').addEventListener('click', fn_valid_new);
    //_('btnEditar').addEventListener('click', fn_valid_edit);
    _('btnAgregar').addEventListener('click', req_add);
    _('btnEditar').addEventListener('click', req_edit);
    _('btnEliminar').addEventListener('click', req_delete);
    _('btnLimpiar').addEventListener('click', req_clean);

    _('cboVentana').addEventListener('change', fn_change_ventana);
    _('cboFuncion').addEventListener('change', fn_change_funcion);

}

//General
function fn_return() {
    let urlaccion = 'Seguridad/BotonesxVentana/Index',
        urljs = 'Seguridad/BotonesxVentana/Index';
    _Go_Url(urlaccion, urljs);
}

function req_clean() {
    fn_load_ventana();
    fn_change_ventana();
    CleanRequired();
    fn_clean();
    _('txtAgrupador').value = '';
    ovariables.idfuncionventana = '';
}

function fn_clean() {
    ovariables.item = '0';
    _('txtIdBoton').value='';
    _('txtMetodo').value = '';
    _('txtTitulo').value = '';
    _('txtNombre').value = '';
    _('txtAccion').value = '';
    _('txtClase').value = '';
    _('txtIcono').value = '';
    _('txtUbicacion').value = '';
    _('txtRegla').value = '';
    _('txtOrden').value = '';
    let rows = _('contentTable').rows;
    fn_clean_rows(rows);
}

function CleanRequired() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

//Insertar
function req_save() {
    let table = _('contentTable').tBodies[0].rows.length;
    if (table > 0) {
        swal({
            title: "Save Data",
            text: "Are you sure save these values?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_insert();
            return;
        });
    }
    else { swal({ title: "Alert", text: "Debe Ingresar un registro", type: "warning" }); }
}

function req_insert() {
    let idventana = _('cboVentana').value;
    let idfuncion = _('cboFuncion').value;
    let resultado = ovariables.arrfuncion.filter(x=> x.idventana.toString() === idventana.toString() && x.idfuncion.toString() === idfuncion.toString());
    let idfuncionventana = resultado[0].idfuncionventana;

    let urlaccion = 'Seguridad/BotonesxVentana/BotonesxVentana_Insert';
    let obotones = { IdFuncionVentana: idfuncionventana },
        arrbotones = JSON.stringify(fn_get_table('contentTable'));
    form = new FormData();
    form.append('par', JSON.stringify(obotones));
    form.append('pardetail', arrbotones);

    Post(urlaccion, form, res_insert);
}

function fn_get_table(_idtable) {
    let table = _(_idtable).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];

    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList[0];
        if (clsrow == undefined || clsrow == 'row-selected') {
            let obj = {
                IdFuncionVentana: parseInt(_par(par, 'IdFuncionVentana')),
                IdVentana: parseInt(_par(par, 'IdVentana')),
                IdFuncion: parseInt(_par(par, 'IdFuncion')),
                IdBoton: row.cells[1].innerText,
                Agrupador: row.cells[2].innerText,
                Accion: row.cells[3].innerText,
                Titulo: row.cells[4].innerText,
                Metodo: row.cells[7].innerText,
                Nombre: row.cells[8].innerText,
                Clase: row.cells[9].innerText,
                Icono: row.cells[10].innerText,
                Ubicacion: row.cells[11].innerText,
                Regla: row.cells[12].innerText,
                Orden: row.cells[13].innerText,
            }
            arrayresult.push(obj);
        }
    }
    
    return arrayresult;
}

function res_insert(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha registrado una nueva solicitud correctamente", type: "success" });
            fn_return();
        };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
    }
}

//Validar
function fn_valid_data(_accion) {
    var resultado = 0, existe = 0;
    var req = _required({ id: 'idformulario', clase: '_enty' });
    if (req) {
        
        let idfuncionventana = ovariables.idfuncionventana;
        let idventana = _('cboVentana').value;
        let idfuncion = _('cboFuncion').value;
        let idboton = _('txtIdBoton').value.trim();

        if (ovariables.arrgeneral.length > 0) {
            existe =
            ovariables.arrgeneral.filter(x=>
                x.IdVentana.toString() === idventana
                && x.IdFuncion.toString() === idfuncion
                && x.IdBoton === idboton
                && x.Estado === 0);
        }
        if (existe.length > 0) {
            swal({ title: "Alert", text: "Ya existe en BD.", type: "warning" });
            resultado = 1;
        }
        else {
            let array = Array.from(_('contentTable').tBodies[0].rows);

            if (_accion == 'new') {
                existe = array.filter(x=>
                    _par(x.getAttribute('data-par'), 'IdVentana').toString() == idventana
                    && _par(x.getAttribute('data-par'), 'IdFuncion').toString() == idfuncion
                    && x.cells[1].innerText.trim() === idboton
                    && (x.classList[0] === undefined || x.classList[0] === 'row-selected')
               );
            }
            else {
                existe = array.filter(x=>
                    _par(x.getAttribute('data-par'), 'IdVentana').toString() == idventana
                    && _par(x.getAttribute('data-par'), 'IdFuncion').toString() == idfuncion
                    && x.cells[1].innerText.trim() === idboton
                    && (x.classList[0] === undefined)
               );
            }

            if (existe.length > 0) {
                swal({ title: "Alert", text: "Ya existe en Grilla", type: "warning" });
                resultado = 1;
            }
        }
    } else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
        resultado = 1;
    }
    return resultado;
}

//Agregar item
function req_add() {
    let result = fn_valid_data('new');
    if (result == 0) {
        let rows = _('contentTable').tBodies[0].rows.length + 1;
        let idfuncionventana = ovariables.idfuncionventana;
        let idventana = _('cboVentana').value;
        let idfuncion = _('cboFuncion').value;
        let ventana = _('cboVentana').options[_('cboVentana').selectedIndex].text;
        let funcion = _('cboFuncion').options[_('cboFuncion').selectedIndex].text;
        let idboton = _('txtIdBoton').value;
        let agrupador = _('txtAgrupador').value.trim();
        let metodo = _('txtMetodo').value.trim();
        let titulo = _('txtTitulo').value.trim();
        let nombre = _('txtNombre').value.trim();
        let accion = _('txtAccion').value.trim();
        let clase = _('txtClase').value.trim();
        let icono = _('txtIcono').value.trim();
        let ubicacion = _('txtUbicacion').value.trim();
        let regla = _('txtRegla').value.trim();
        let orden = _('txtOrden').value.trim();
        let preview = `<button id='${idboton}' class='${clase}'>
                            <span class ='${icono}'></span>
                            ${nombre}
                        </button>`;

        let html = `<tr data-par='Item:${rows},IdFuncionVentana:${idfuncionventana},IdVentana:${idventana},IdFuncion:${idfuncion}'>
                        <td class ='col-sm-1 text-center' style='background-color:white'>${preview}</td>
                        <td class ='col-sm-1'>${idboton}</td>
                        <td class ='col-sm-2'>${agrupador}</td>
                        <td class ='col-sm-1'>${accion}</td>
                        <td class ='col-sm-2'>${titulo}</td>
                        <td class ='col-sm-2'>${ventana}</td>
                        <td class ='col-sm-2'>${funcion}</td>
                        <td class ='col-sm-2 hide'>${metodo}</td>
                        <td class ='col-sm-2 hide'>${nombre}</td>
                        <td class ='col-sm-2 hide'>${clase}</td>
                        <td class ='col-sm-2 hide'>${icono}</td>
                        <td class ='col-sm-2 hide'>${ubicacion}</td>
                        <td class ='col-sm-2 hide'>${regla}</td>
                        <td class ='col-sm-2 hide'>${orden}</td>
                        <td class ='col-sm-2 hide'>${idventana}</td>
                        <td class ='col-sm-2 hide'>${idfuncion}</td>
                    </tr>`;
        _('contentTable').tBodies[0].insertAdjacentHTML('beforeend', html);
        fn_clean();
        let tbl = _('contentTable').tBodies[0], total = tbl.rows.length;
        handlertable(total);
    }
}

function handlertable(indice) {
    let tbl = _('contentTable'), rows = tbl.rows, row = rows[indice];
    row.addEventListener('click', e => {
        event_rows(row, rows);
    });
}

function event_rows(row, rows) {
    fn_clean_rows(rows);
    row.classList.add('row-selected');
    fn_load_detail(row);
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

function fn_load_detail(row) {
    let par = row.getAttribute('data-par');
    ovariables.item = _par(par, 'Item');
    ovariables.idfuncionventana = _par(par, 'IdFuncionVentana');
    let idventana = _par(par, 'IdVentana');
    let idfuncion = _par(par, 'IdFuncion');
    _('cboVentana').value = idventana;
    fn_change_ventana();
    _('cboFuncion').value = idfuncion;

    _('txtIdBoton').value = row.cells[1].innerText.trim();
    _('txtAgrupador').value = row.cells[2].innerText.trim();
    _('txtMetodo').value = row.cells[7].innerText.trim();
    _('txtTitulo').value = row.cells[4].innerText.trim();
    _('txtNombre').value = row.cells[8].innerText.trim();
    _('txtAccion').value = row.cells[3].innerText.trim();
    _('txtClase').value = row.cells[9].innerText.trim();
    _('txtIcono').value = row.cells[10].innerText.trim();
    _('txtUbicacion').value = row.cells[11].innerText.trim();
    _('txtRegla').value = row.cells[12].innerText.trim();
    _('txtOrden').value = row.cells[13].innerText.trim();
}

//Editar item
function req_edit() {
    if (ovariables.item == '0') {
        swal({ title: "Alert", text: "Debe Seleccionar un registro para editar", type: "warning" });
        CleanRequired();
    } else {
        let result = fn_valid_data('edit');
        if (result == 0) {
            let item = ovariables.item;
            let idfuncionventana = ovariables.idfuncionventana;
            let idventana = _('cboVentana').value;
            let idfuncion = _('cboFuncion').value;
            let ventana = _('cboVentana').options[_('cboVentana').selectedIndex].text;
            let funcion = _('cboFuncion').options[_('cboFuncion').selectedIndex].text;
            let idboton = _('txtIdBoton').value;
            let agrupador = _('txtAgrupador').value;
            let metodo = _('txtMetodo').value;
            let titulo = _('txtTitulo').value;
            let nombre = _('txtNombre').value;
            let accion = _('txtAccion').value;
            let clase = _('txtClase').value;
            let icono = _('txtIcono').value;
            let ubicacion = _('txtUbicacion').value;
            let regla = _('txtRegla').value;
            let orden = _('txtOrden').value;
            let preview = `<button id='${idboton}' class='${clase}'>
                            <span class ='${icono}'></span>
                            ${nombre}
                        </button>`;

            let par = `Item:${item},IdFuncionVentana:${idfuncionventana},IdVentana:${idventana},IdFuncion:${idfuncion}`;
            let array = Array.from(_('contentTable').rows);
            let result = array.filter(x=>x.classList.contains('row-selected'));
            result[0].setAttribute('data-par', par);
            result[0].cells[0].innerHTML = preview;
            result[0].cells[1].innerHTML = idboton;
            result[0].cells[2].innerHTML = agrupador;
            result[0].cells[3].innerHTML = accion;
            result[0].cells[4].innerHTML = titulo;
            result[0].cells[5].innerHTML = ventana;
            result[0].cells[6].innerHTML = funcion;
            result[0].cells[7].innerHTML = metodo;
            result[0].cells[8].innerHTML = nombre;
            result[0].cells[9].innerHTML = clase;
            result[0].cells[10].innerHTML = icono;
            result[0].cells[11].innerHTML = ubicacion;
            result[0].cells[12].innerHTML = regla;
            result[0].cells[13].innerHTML = orden;
            fn_clean();
        }
    }

    //    } else {
    //        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    //    }
    //} else {
    //    swal({ title: "Alert", text: "Debe Seleccionar un registro para editar", type: "warning" });
    //}
}

//Eliminar item
function req_delete() {
    if (ovariables.item != '0') {
        let item = ovariables.item;
        let fila = _('contentTable').rows[item];
        fila.classList.add('hide');
        fn_clean();
    } else {
        swal({ title: "Alert", text: "Debe Seleccionar un registro para eliminar", type: "warning" });
        CleanRequired();
    }
}

//Cargar Datos

function req_ini() {
    let urlaccion = 'Seguridad/BotonesxVentana/BotonesxVentana_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.arrgeneral = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.arrventana = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.arrfuncion = JSON.parse(orpta[2]); }

        fn_load_ventana();        
        fn_load_funcion();
    }
}

function fn_load_ventana() {
    let arrventana = ovariables.arrventana;
    let cboventana = '<option value>-- Seleccione Ventana --</option>';
    arrventana.forEach(x=> { cboventana += `<option value='${x.IdVentana}'>${x.Nombre}</option>` })
    _('cboVentana').innerHTML = cboventana;
}

function fn_change_ventana() {
    fn_load_controlador();
    fn_load_funcion();
}

function fn_load_controlador() {
    let arrventana = ovariables.arrventana;
    let idventana = _('cboVentana').value;
    let result = arrventana.filter(y=>y.IdVentana.toString() === idventana.toString());
    if (result != '') { _('txtControlador').value = result[0].Identificador; }
    else { _('txtControlador').value = '' }
}

function fn_load_funcion() {
    let idventana = _('cboVentana').value;
    let arrfuncion = ovariables.arrfuncion.filter(x=> x.idventana.toString() === idventana.toString() && x.Eliminado ===0);
    let cbofuncion = '<option value>-- Seleccione Función --</option>';
    if (arrfuncion.length > 0) { arrfuncion.forEach(x=> { cbofuncion += `<option value='${x.idfuncion}'>${x.funcion}</option>` }) }
    _('cboFuncion').innerHTML = cbofuncion;
}

function fn_change_funcion() {
    let idventana = _('cboVentana').value;
    let idfuncion = _('cboFuncion').value;
    let arr = ovariables.arrfuncion.filter(x=> x.idventana.toString() === idventana.toString() && x.idfuncion.toString() === idfuncion.toString());
    ovariables.idfuncionventana = arr[0].idfuncionventana;
}


(function ini() {
    load();
    req_ini();
})()
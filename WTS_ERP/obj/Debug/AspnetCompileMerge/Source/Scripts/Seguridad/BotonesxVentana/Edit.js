var ovariables_detail = {
    item:'0',
    idbotonfuncionventana: '',
    idfuncionventana: '',
    idfuncionventanachange: '',
    idventana: '',
    idfuncion: '',
    arrbotones: '',
    arrventana: '',
    arrfuncion: '',
}

function load() {
    let par = _('txtpar').value;
    if (!_isEmpty(par)) {
        ovariables_detail.idbotonfuncionventana = _par(par, 'id');
    }
    
    _('btnSave').addEventListener('click', req_save);
    _('btnReturn').addEventListener('click', fn_return);

    _('btnAgregar').addEventListener('click', req_add);
    _('btnEditar').addEventListener('click', req_edit);
    _('btnEliminar').addEventListener('click', req_delete);
    _('btnLimpiar').addEventListener('click', fn_clean);

    _('cboVentana').addEventListener('change', fn_change_ventana);
    _('cboFuncion').addEventListener('change', fn_change_funcion);
}

//General
function fn_return() {
    let urlaccion = 'Seguridad/BotonesxVentana/Index',
        urljs = 'Seguridad/BotonesxVentana/Index';
    _Go_Url(urlaccion, urljs);
}

function fn_clean() {
    ovariables_detail.item = '0';
    //ovariables.idfuncionventana = '';
    _('txtAgrupador').value = '';
    _('txtIdBoton').value = '';
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
    CleanRequired();
}

function CleanRequired() {
    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x=>x.classList.remove('has-error'));
}

//Validar
function fn_valid_data(_accion) {
    var resultado = 0, existe = 0;
    var req = _required({ id: 'idformulario', clase: '_enty' });
    if (req) {

        let idfuncionventana = ovariables_detail.idfuncionventana;
        let idventana = _('cboVentana').value;
        let idfuncion = _('cboFuncion').value;
        let idboton = _('txtIdBoton').value.trim();
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
        /*else {
            existe =
            ovariables_detail.arrbotones.filter(x=>
                x.IdVentana.toString() === idventana
                && x.IdFuncion.toString() === idfuncion
                && x.IdBoton.trim() === idboton
                && x.Estado === 0);

            if (existe.length > 0) {
                swal({ title: "Alert", text: "Ya existe en BD.", type: "warning" });
                resultado = 1;
            }
        }*/
    } else {
        swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
        resultado = 1;
    }
    return resultado;
}

//Agregar item
function req_add() {
    //let req = _required({ id: 'idformulario', clase: '_enty' });
    //if (req) {

    let result = fn_valid_data('new');
    if (result == 0) {

        let rows = _('contentTable').tBodies[0].rows.length + 1;
        let idfuncionventana = ovariables_detail.idfuncionventanachange;
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

        let html = `<tr data-par='Item:${rows},IdBotonFuncionVentana:${0},IdFuncionVentana:${idfuncionventana},IdVentana:${idventana},IdFuncion:${idfuncion}'>
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
                    </tr>`;
        _('contentTable').tBodies[0].insertAdjacentHTML('beforeend', html);
        fn_clean();
        let tbl = _('contentTable').tBodies[0], total = tbl.rows.length;
        handlertable_new(total);

    }
    //else {
    //    swal({ title: "Alert", text: "Debe Ingresar los datos requeridos", type: "warning" });
    //}
}

function handlertable_new(indice) {
    let tbl = _('contentTable'), rows = tbl.rows, row = rows[indice];
    row.addEventListener('click', e => {
        event_rows_new(row, rows);
    });
}

function event_rows_new(row, rows) {
    fn_clean_rows(rows);
    row.classList.add('row-selected');
    fn_load_detail(row);
}

//Editar item
function req_edit() {
    if (ovariables_detail.item == '0') {
        swal({ title: "Alert", text: "Debe Seleccionar un registro para editar", type: "warning" });
        CleanRequired();
    } else {
        let result = fn_valid_data('edit');
        if (result == 0) {
            let idventana = _('cboVentana').value;
            let idfuncion = _('cboFuncion').value;

            if (ovariables_detail.idventana.toString() === idventana
                && ovariables_detail.idfuncion.toString() === idfuncion
                && ovariables_detail.idfuncionventana == ovariables_detail.idfuncionventanachange) {

                let array = Array.from(_('contentTable').rows);
                let result = array.filter(x=>x.classList.contains('row-selected'));

                result[0].cells[1].innerHTML = _('txtIdBoton').value;
                result[0].cells[2].innerHTML = _('txtAgrupador').value;
                result[0].cells[3].innerHTML = _('txtAccion').value;
                result[0].cells[4].innerHTML = _('txtTitulo').value;
                result[0].cells[7].innerHTML = _('txtMetodo').value;
                result[0].cells[8].innerHTML = _('txtNombre').value;
                result[0].cells[9].innerHTML = _('txtClase').value;
                result[0].cells[10].innerHTML = _('txtIcono').value;
                result[0].cells[11].innerHTML = _('txtUbicacion').value;
                result[0].cells[12].innerHTML = _('txtRegla').value;
                result[0].cells[13].innerHTML = _('txtOrden').value;
                result[0].cells[0].innerHTML = `<button id='${_('txtIdBoton').value}' class='${_('txtClase').value}'>
                                                    <span class ='${_('txtIcono').value}'></span>
                                                    ${_('txtNombre').value}
                                                </button>`;
                //alert('Iguales');
            } else {
                req_add();
                //alert('No son Iguales');
            }
            fn_clean();
        }
    }
}

//Eliminar item
function req_delete() {
    if (ovariables_detail.item != '0') {
        let item = ovariables_detail.item;
        let fila = _('contentTable').rows[item];
        fila.classList.add('hide');
        fn_clean();
    } else {
        swal({ title: "Alert", text: "Debe Seleccionar un registro para eliminar", type: "warning" });
        CleanRequired();
    }
}

//Insertar
function req_save() {
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
            req_update();
            return;
        });
}

function req_update() {
    let idventana = _('cboVentana').value;
    let idfuncion = _('cboFuncion').value;
    let idfuncionventana = ovariables_detail.idfuncionventana;

    let urlaccion = 'Seguridad/BotonesxVentana/BotonesxVentana_Update';
    let obotones = { IdFuncionVentana: idfuncionventana },
        arrbotones = JSON.stringify(fn_get_table_active('contentTable')),
        arrbotones_inactive = JSON.stringify(fn_get_table_inactive('contentTable'));
    form = new FormData();
    form.append('par', JSON.stringify(obotones));
    form.append('pardetail', arrbotones);
    form.append('parsubdetail', arrbotones_inactive);

    Post(urlaccion, form, res_update);
}

function fn_get_table_active(_idtable) {
    let table = _(_idtable).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];

    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList[0];
        if (clsrow == undefined || clsrow == 'row-selected') {
            let obj = {
                IdBotonFuncionVentana: parseInt(_par(par, 'IdBotonFuncionVentana')),
                IdFuncionVentana: parseInt(_par(par, 'IdFuncionVentana')),
                IdVentana: parseInt(_par(par, 'IdVentana')),
                IdFuncion: parseInt(_par(par, 'IdFuncion')),
                IdBoton: row.cells[1].innerText.trim(),
                Agrupador: row.cells[2].innerText.trim(),
                Accion: row.cells[3].innerText.trim(),
                Titulo: row.cells[4].innerText.trim(),
                Metodo: row.cells[7].innerText.trim(),
                Nombre: row.cells[8].innerText.trim(),
                Clase: row.cells[9].innerText.trim(),
                Icono: row.cells[10].innerText.trim(),
                Ubicacion: row.cells[11].innerText.trim(),
                Regla: row.cells[12].innerText.trim(),
                Orden: row.cells[13].innerText.trim(),
            }
            arrayresult.push(obj);
        }
    }

    return arrayresult;
}

function fn_get_table_inactive(_idtable) {
    let table = _(_idtable).tBodies[0], totalfilas = table.rows.length, row = null, arrayresult = [];

    for (let i = 0; i < totalfilas; i++) {
        row = table.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList[0],
            id = parseInt(_par(par, 'IdBotonFuncionVentana'));
        if (clsrow == 'hide' && id !== 0) {
            let obj = {
                IdBotonFuncionVentana: parseInt(_par(par, 'IdBotonFuncionVentana')),
                IdFuncionVentana: parseInt(_par(par, 'IdFuncionVentana')),
                IdVentana: parseInt(_par(par, 'IdVentana')),
                IdFuncion: parseInt(_par(par, 'IdFuncion')),
                IdBoton: row.cells[1].innerText.trim()
            }
            arrayresult.push(obj);
        }
    }

    return arrayresult;
}

function res_update(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha actualizado correctamente", type: "success" });
            fn_return();
        };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
    }
}


//Cargar data
function req_ini() {
    let urlaccion = 'Seguridad/BotonesxVentana/BotonesxVentana_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables_detail.arrbotones = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables_detail.arrventana = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables_detail.arrfuncion = JSON.parse(orpta[2]); }

        fn_load_ventana();        
        fn_load_funcion();
        fn_load_data();
        fn_load_botones();
        fn_get_data();
    }
}

function fn_load_ventana() {
    let arrventana = ovariables_detail.arrventana;
    let cboventana = '<option value>-- Seleccione Ventana --</option>';
    arrventana.forEach(x=> { cboventana += `<option value='${x.IdVentana}'>${x.Nombre}</option>` })
    _('cboVentana').innerHTML = cboventana;
}

function fn_change_ventana() {
    fn_load_controlador();
    fn_load_funcion();
}

function fn_load_controlador() {
    let arrventana = ovariables_detail.arrventana;
    let idventana = _('cboVentana').value;
    let result = arrventana.filter(y=>y.IdVentana.toString() === idventana.toString());
    if (result != '') { _('txtControlador').value = result[0].Identificador; }
    else { _('txtControlador').value = '' }
}

function fn_load_funcion() {
    let idventana = _('cboVentana').value;
    let arrfuncion = ovariables_detail.arrfuncion.filter(x=> x.idventana.toString() === idventana.toString());
    let cbofuncion = '<option value>-- Seleccione Función --</option>';
    if (arrfuncion.length > 0) { arrfuncion.forEach(x=> { cbofuncion += `<option value='${x.idfuncion}'>${x.funcion}</option>` }) }
    _('cboFuncion').innerHTML = cbofuncion;
}

function fn_load_data() {
    let array = ovariables_detail.arrbotones;
    let result = array.filter(x=>x.IdBotonFuncionVentana.toString() === ovariables_detail.idbotonfuncionventana);
    ovariables_detail.idfuncionventana = result[0].IdFuncionVentana;
    ovariables_detail.idventana = result[0].IdVentana;
    ovariables_detail.idfuncion = result[0].IdFuncion;
}

function fn_change_funcion() {
    let idventana = _('cboVentana').value;
    let idfuncion = _('cboFuncion').value;
    let arr = ovariables_detail.arrfuncion.filter(x=> x.idventana.toString() === idventana.toString() && x.idfuncion.toString() === idfuncion.toString());
    ovariables_detail.idfuncionventanachange = arr[0].idfuncionventana;
}

function fn_load_botones() {
    let idventana = ovariables_detail.idventana;
    let idfuncion = ovariables_detail.idfuncion;
    let html = '', item = 0;
    let result = ovariables_detail.arrbotones.filter(x=>x.IdVentana === idventana && x.IdFuncion === idfuncion && x.Estado === 0);
    result.forEach(x=> {
        item ++;
        let preview = `<button id='${x.IdBoton}' class='${x.Clase}'>
                            <span class ='${x.Icono}'></span>
                            ${x.Nombre}
                        </button>`;
        html += `
            <tr data-par='Item:${item},IdBotonFuncionVentana:${x.IdBotonFuncionVentana},IdFuncionVentana:${x.IdFuncionVentana},IdVentana:${x.IdVentana},IdFuncion:${x.IdFuncion}'>
                <td class ='col-sm-1 text-center' style='background-color:white'>${preview}</td>
                <td class ='col-sm-1'>${x.IdBoton}</td>
                <td class ='col-sm-2'>${x.Agrupador}</td>
                <td class ='col-sm-1'>${x.Accion}</td>
                <td class ='col-sm-2'>${x.Titulo}</td>
                <td class ='col-sm-2'>${x.ventana}</td>
                <td class ='col-sm-2'>${x.funcion}</td>
                <td class ='col-sm-2 hide'>${x.Metodo}</td>
                <td class ='col-sm-2 hide'>${x.Nombre}</td>
                <td class ='col-sm-2 hide'>${x.Clase}</td>
                <td class ='col-sm-2 hide'>${x.Icono}</td>
                <td class ='col-sm-2 hide'>${x.Ubicacion}</td>
                <td class ='col-sm-2 hide'>${x.Regla}</td>
                <td class ='col-sm-2 hide'>${x.Orden}</td>
            </tr>
            `
    });
    _('contentTable').tBodies[0].innerHTML = html;
    let tbl = _('contentTable').tBodies[0], total = tbl.rows.length;
    handlertable(total);
}

function handlertable(indice) {
    let tbl = _('contentTable').tBodies[0], rows = tbl.rows, row = rows[indice];
    let array = Array.from(rows);
    array.forEach(x=> { x.addEventListener('click', event_rows); });
}

function event_rows(e) {
    let o = e.currentTarget, row = o, tbl = _('contentTable'), rows = tbl.rows;
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
    ovariables_detail.item = _par(par, 'Item');
    ovariables_detail.idbotonfuncionventana = _par(par, 'IdBotonFuncionVentana');
    ovariables_detail.idfuncionventana = _par(par, 'IdFuncionVentana');
    ovariables_detail.idfuncionventanachange = _par(par, 'IdFuncionVentana');
    ovariables_detail.idventana = _par(par, 'IdVentana');
    ovariables_detail.idfuncion = _par(par, 'IdFuncion');

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

function fn_get_data() {
    let tbl = _('contentTable'), rows = tbl.rows;
    let array = Array.from(rows);
    array.forEach(x=> {
        let par = x.getAttribute('data-par');
        let id = _par(par, 'IdBotonFuncionVentana');
        if (id === ovariables_detail.idbotonfuncionventana) {
            x.classList.add('row-selected');
            fn_load_detail(x);
        }
    });

}



(function ini() {
    load();
    req_ini();
})()
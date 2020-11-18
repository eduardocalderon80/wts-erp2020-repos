var oVariables = {
    idgrupocomercial: ''
}

var oUtil = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    idtable: 'tblgridbuybuscar'
}

function load() {
    oVariables.idgrupocomercial = _par(_('txtpar').value, 'idgrupocomercial');
    _('btnSave').addEventListener('click', save_new_update);
    _('btnSearch').addEventListener('click', search_proveedorcliente);
    _('cboGrupoComercial').addEventListener('change', function (e) {
            let valoridcliente = _('cboCliente').value;
            if (valoridcliente != '') {
                search_proveedorcliente();
            }
        }
    );
    _('cboCliente').addEventListener('change', function () {
            let valoridgrupocomercial = _('cboGrupoComercial').value;
            if (valoridgrupocomercial != '') {
                search_proveedorcliente();
            }
        }
    );
}

function loadTablaProveedor(odataproveedor) {
    let html = '', odata = odataproveedor != null ? odataproveedor : null;

    //_('tbodyfactory').innerHTML = '';
    if (odata != null) {
        odata.forEach(x => {
            html += `<tr data-par='idproveedor:${x.idproveedor}'>
               <td class='text-center'>
                    <button class='btn btn-sm btn-success _clsbtnaddproveedor'>Add</button>
               </td>
               <td>${x.nombreproveedor}</td>
        </tr>
        `;
        });
        
        _('tbodyfactory').innerHTML = html;
        handler_filter_tblproveedor();
    }
}

function handler_filter_tblproveedor() {
    let clsfilter = '_clsfilterproveedor', arrayfilter = _Array(document.getElementsByClassName(clsfilter)), arrayadd = _Array(document.getElementsByClassName('_clsbtnaddproveedor'));
    arrayfilter.forEach(x => {
        if (x.type === 'text') {
            //x.value = '';
            x.onkeyup = function () {
                oUtil.adataresult = event_header_filter(clsfilter);
                loadTablaProveedor(oUtil.adataresult);
            }
        }
    });

    arrayadd.forEach(x => x.addEventListener('click', e => { handleradd(e) }));
}

function handleradd(e) {
    let o = e.target, tag = o.tagName, fila = null, indexfila = null;
    fila = o.parentNode.parentNode;
    if (fila != null) {
        indexfila = fila.rowIndex - 2;
        addProveedor(indexfila);
    }
}

function addProveedor(_indexfila) {
    // VALIDAR ANTES DE AGREGAR
    let pasavalidacion = true;
    if (_('cboGrupoComercial').value === '') {
        _('div_cbogrupocomercial').classList.add('has-error');
        pasavalidacion = false;
    }
    if (_('cboCliente').value === '') {
        _('div_cbocliente').classList.add('has-error');
        pasavalidacion = false;
    }
    if (pasavalidacion === false) {
        return false;
    }

    let idgrupocomercial = _('cboGrupoComercial').value, idcliente = _('cboCliente').value, tbody_proveedor = _('tbodyfactory'), datapar_tabla = tbody_proveedor.rows[_indexfila].getAttribute('data-par'),
        idproveedor = _par(datapar_tabla, 'idproveedor'), nombregrupocomercial = _('cboGrupoComercial').options[_('cboGrupoComercial').options.selectedIndex].text,
        nombrecliente = _('cboCliente').options[_('cboCliente').options.selectedIndex].text, nombreproveedor = tbody_proveedor.rows[_indexfila].cells[1].innerText;
    let html = `<tr data-par='idproveedorxclientexgrupocomercial:0,idgrupocomercial:${idgrupocomercial},idcliente:${idcliente},idproveedor:${idproveedor}'>
                    <td class='text-center'>
                        <button class='btn btn-sm btn-danger clsbtneliminartablaprincipal'>
                            <span class='fa fa-times'></span>
                        </button>
                    </td>
                    <td>${nombregrupocomercial}</td>
                    <td>${nombrecliente}</td>
                    <td>${nombreproveedor}</td>
                    <td class='text-center'>
                        <label>
                            <div class='icheckbox_square-green' style='position: relative;'>
                                <input type='checkbox' class='i-checks _chkdevelop' style='position: absolute; opacity: 0;' checked>
                                    <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                            </div> 
                        </label>
                    </td>
                    <td class='text-center'>
                        <label>
                            <div class='icheckbox_square-green' style='position: relative;'>
                                <input type='checkbox' class='i-checks _chkproduccion' style='position: absolute; opacity: 0;' checked>
                                    <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                            </div> 
                        </label>
                    </td>
        </tr>
        `;
    _('tbodyproveedorcliente').insertAdjacentHTML('beforeend', html);
    handler_tablaproveedorcliente_add();

    // ELIMINAR ITEM PROVEEDOR
    let resultfilterproveedor = oUtil.adata.filter(x => x.idproveedor == idproveedor);
    resultfilterproveedor[0].habilitado = '0';
    tbody_proveedor.deleteRow(_indexfila);
}

function llenarTablaProveedorCliente(odata_proveedorcliente) {
    let odata = odata_proveedorcliente != null ? odata_proveedorcliente : null, html = '';

    odata_proveedorcliente.forEach(x => {
        let strchecked_develop = x.flgdevelop == 1 ? 'checked' : '';
        let strchecked_produccion = x.flgproduction == 1 ? 'checked' : '';

        html += `<tr data-par='idproveedorxclientexgrupocomercial:${x.idproveedorxclientexgrupocomercial},idgrupocomercial:${x.idgrupocomercial},idcliente:${x.idcliente},idproveedor:${x.idproveedor}'>
                    <td class='text-center'>
                        <button class='btn btn-sm btn-danger clsbtneliminartablaprincipal'>
                            <span class='fa fa-times'></span>
                        </button>
                    </td>
                    <td>${x.nombregrupocomercial}</td>
                    <td>${x.nombrecliente}</td>
                    <td>${x.nombreproveedor}</td>
                    <td class='text-center'>
                        <label>
                            <div class='icheckbox_square-green' style='position: relative;'>
                                <input type='checkbox' class='i-checks _chkdevelop' style='position: absolute; opacity: 0;' ${strchecked_develop}>
                                    <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                            </div> 
                        </label>
                    </td>
                    <td class='text-center'>
                        <label>
                            <div class='icheckbox_square-green' style='position: relative;'>
                                <input type='checkbox' class='i-checks _chkproduccion' style='position: absolute; opacity: 0;' ${strchecked_produccion}>
                                    <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                            </div> 
                        </label>
                    </td>
        </tr>
        `; 
    });
    _('tbodyproveedorcliente').innerHTML = html;
    handler_tablaproveedorcliente_al_llenar();
}

function handler_tablaproveedorcliente_al_llenar() {
    let arrayeleiminar = _Array(document.getElementsByClassName('clsbtneliminartablaprincipal'));
    if (arrayeleiminar.length > 0) {
        arrayeleiminar.forEach((x, indice) => {
            x.addEventListener('click', eliminarItem_tblproveedorcliente);    
        });
    }

    // FORMATO PARA LOS CHECKBOX; PARA QUE FUNCION EL QUITAR Y SELECCIONAR EL CHECK
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function handler_tablaproveedorcliente_add() {
    let arrayeleiminar = _Array(document.getElementsByClassName('clsbtneliminartablaprincipal')), ultimafila = arrayeleiminar.length - 1;
    if (arrayeleiminar.length > 0) {
        arrayeleiminar[ultimafila].addEventListener('click', eliminarItem_tblproveedorcliente);
    }

    // FORMATO PARA LOS CHECKBOX; PARA QUE FUNCION EL QUITAR Y SELECCIONAR EL CHECK
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function eliminarItem_tblproveedorcliente(e) {
    let o = e.target, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        // eliminar la fila
        fila.parentNode.removeChild(fila);
    }
}

function select_row() {
    let tbl = _('tbodyfactory'),
        rows = _Array(tbl.rows),
        txts = _Array(tbl.getElementsByClassName('_txt'));
    if (rows !== null && rows.length > 0) { rows.forEach(x=> x.addEventListener("click", e=> { fn_addproveedor(e); })); }
    //txts.forEach(y=>y.addEventListener("dblclick", e=> { fn_txt_buy(e); }));
}

function fn_addproveedor(_row) {
    // PENDIENTE A IMPLEMENTAR; SE EJECUTA PARA AGREGAR PROVEEDOR
}

function event_header_filter(fields_input) {
    var adataResult = [], adata = oUtil.adata;
    if (adata.length > 0) {
        
        let fields = document.getElementsByClassName(fields_input);
        if (fields != null && fields.length > 0) {
            let valor = fields[0].value.toLowerCase().trim();
            adataResult = oUtil.adata.filter(x => x.nombreproveedor.toLowerCase().indexOf(valor) >= 0 && x.habilitado === '1');
        }

        //if (fields != null && fields.length > 0) {
        //    var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
        //    var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
        //    var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
        //    var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

        //    acampos_name = _oreflector.getProperties(adata[0]);

        //    for (i = 0; i < nreg; i++) {
        //        exito = true;
        //        for (x = 0; x < nfields; x++) {
        //            ofield = fields[x];
        //            value = ofield.value.toLowerCase();
        //            field = ofield.getAttribute("data-field");

        //            if (ofield.type == "text") {
        //                //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);

        //                if (exito) {
        //                    if (value !== '') {
        //                        valor = adata[i][field];
        //                        _y = adata[i][field].toLowerCase().indexOf(value);
        //                        exito = (y > -1);
        //                    }
        //                }
        //                exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
        //            }
        //            else {
        //                exito = exito && (value == "" || value == adata[i][field]);
        //            }
        //            if (!exito) break;
        //        }
        //        if (exito) {
        //            acampos_value = _oreflector.getValues(adata[i]);
        //            adataResult[c] = _setfield(acampos_name, acampos_value);
        //            c++;
        //        }
        //    }
        //}
    }
    return adataResult;
}

function save_new_update() {
    // VALIDAR ANTES DE GRABAR
    let pasavalidacion = validarantesgrabar();
    if (pasavalidacion === false) {
        return false;
    }

    let arrproveedorcliente = get_proveedorcliente_grabar(), par = '';
    let frm = new FormData(), url = 'Maestra/ProveedorxClientexProveedor/Save_New_Update';

    let idgrupocomercial = arrproveedorcliente[0].idgrupocomercial;
    let idcliente = arrproveedorcliente[0].idcliente;
    par = { idgrupocomercial: idgrupocomercial, idcliente: idcliente }

    frm.append('par', JSON.stringify(par));
    frm.append('pardetail', JSON.stringify(arrproveedorcliente));

    Post(url, frm, res_savenewupdate)
}

function res_savenewupdate(respuesta) {
    let orpta = respuesta != null ? JSON.parse(respuesta) : null;
    if (orpta !== null) {
        let orpta_parseada = JSON.parse(orpta.data);

        let odata_proveedor = orpta_parseada[0].proveedor != null ? CSVtoJSON(orpta_parseada[0].proveedor) : null;
        let odata_proveedorcliente = orpta_parseada[0].proveedorclientegrupocomercial != null ? CSVtoJSON(orpta_parseada[0].proveedorclientegrupocomercial) : null;

        oUtil.adata = odata_proveedor;
        oUtil.adataresult = oUtil.adata;

        _('tbodyfactory').innerHTML = '';
        loadTablaProveedor(oUtil.adata);
        _('tbodyproveedorcliente').innerHTML = '';
        llenarTablaProveedorCliente(odata_proveedorcliente);
    }
    
}

function get_proveedorcliente_grabar() {
    let tbody = _('tbodyproveedorcliente'), totalfilas = tbody.rows.length, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        let row = tbody.rows[i];
        let dataparrow = row.getAttribute('data-par'), idproveedorclientegrupocomercial = _par(dataparrow, 'idproveedorxclientexgrupocomercial'), 
            idgrupocomercial = _par(dataparrow, 'idgrupocomercial'), idcliente = _par(dataparrow, 'idcliente'), idproveedor = _par(dataparrow, 'idproveedor'),
            valorcheckdevelop = row.cells[4].querySelector('._chkdevelop').checked, valorcheckproduccion = row.cells[5].querySelector('._chkproduccion').checked;

        let valorchkdevelop = valorcheckdevelop === true ? 1 : 0;
        let valorchkproduccion = valorcheckproduccion === true ? 1 : 0;
        
        let obj = {
            idproveedorxclientexgrupocomercial: idproveedorclientegrupocomercial,
            idgrupocomercial: idgrupocomercial,
            idcliente: idcliente,
            idproveedor: idproveedor,
            flgdevelop: valorchkdevelop,
            flgproduction: valorchkproduccion
        };

        arr.push(obj);
    }

    return arr;
}

function search_proveedorcliente() {
    let url = 'Maestra/ProveedorxClientexProveedor/Search_ProveedorClienteGrupoComercial', par = { idgrupocomercial: _('cboGrupoComercial').value, idcliente: _('cboCliente').value };
    url += '?par=' + JSON.stringify(par);
    Get(url, res_search);
}

function res_search(respuesta) {
    let orpta = respuesta !== null ? JSON.parse(respuesta) : null;

    let odata_proveedor = orpta[0].proveedor != null ? CSVtoJSON(orpta[0].proveedor) : null;
    let odata_proveedorcliente = orpta[0].proveedorclientegrupocomercial != null ? CSVtoJSON(orpta[0].proveedorclientegrupocomercial) : null;

    oUtil.adata = odata_proveedor;
    oUtil.adataresult = oUtil.adata;

    _('tbodyfactory').innerHTML = '';
    loadTablaProveedor(oUtil.adata);
    _('tbodyproveedorcliente').innerHTML = '';
    llenarTablaProveedorCliente(odata_proveedorcliente);
}

function validarantesgrabar() {
    let tbody = _('tbodyproveedorcliente'), totalfilas = tbody.rows.length, pasavalidacion = true, mensaje = '';

    if (totalfilas <= 0) {
        pasavalidacion = false;
        mensaje += 'Falta agregar detalle';
    }

    if (pasavalidacion === false) {
        _swal({ estado: 'error', mensaje: mensaje });
    }

    return pasavalidacion;
}

function res_ini(respuesta) {
    let orpta = respuesta != null ? JSON.parse(respuesta) : null;
    let combo= _comboFromCSV(orpta[0].grupocomercial)
    _('cboGrupoComercial').innerHTML = combo !== '' ? _comboFromCSV(orpta[0].grupocomercial) : _comboItem({ value: '', text: 'Select' });
    _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].cliente);
    
    let idgrupocomercial = _par(_('txtpar').value, 'idgrupocomercial');
    if (idgrupocomercial === '') {
        _('txtpar').value = 'idgrupocomercial:' + orpta[0].idgrupocomercial;
        oVariables.idgrupocomercial = orpta[0].idgrupocomercial;
    }

    let odata_proveedor = orpta[0].proveedor != null ? CSVtoJSON(orpta[0].proveedor) : null;
    oUtil.adata = odata_proveedor;
    oUtil.adataresult = oUtil.adata;

    loadTablaProveedor(oUtil.adata);
    //handler_filter_tblproveedor();
    //select_row();
}

function req_ini() {
    Get('Maestra/ProveedorxClientexProveedor/getData_IndexInit?par=' + oVariables.idgrupocomercial, res_ini);
}

(
    function init() {
        load();
        req_ini();
    }
)();

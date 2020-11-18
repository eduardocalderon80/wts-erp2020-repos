var ovariables_trim = {
    data_clientedivision: '',
    data_cliente: '',
    filtro_index: '',
    idcliente_filtro: '',
    idclientedivision_filtro: ''
}

var oUtil_trim = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
}

function load() {
    filter_header_trim();
    _('cbo_cliente_trim').addEventListener('change', fn_change_cliente_trim);
    _('btnsearch_filter_index_trim').addEventListener('click', function () {
        buscar_trim();
    });
    _('_btn_new_trims').addEventListener('click', open_new_trims);
}

function fn_change_cliente_trim(event) {
    let id = event.currentTarget.value;
    fn_filtrar_clientedivisionbyidcliente(id);
}

function fn_filtrar_clientedivisionbyidcliente(idcliente) {
    let id = idcliente;
    let arr = ovariables_trim.data_clientedivision.filter(x => x.idcliente == id);

    _('cbo_clientedivision_trim').innerHTML = '';
    _('cbo_clientedivision_trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr, 'idclientedivision', 'nombredivision');
}

function llenartabla_index_trim(odatatrim, indice) {
    let html = '';
    if (indice === undefined) {
        indice = 0;
    }

    if (odatatrim !== null) {
        let inicio = oUtil_trim.indiceactualpagina * oUtil_trim.registrospagina;
        let fin = inicio + oUtil_trim.registrospagina, x = odatatrim.length;

        const datatrim = odatatrim;
        if (x > 0) {
            html = '';
            for (let i = inicio; i < fin; i++) {
                if (i < x) {
                    html += `
                            <tr data-par='idtrim:${datatrim[i].idtrim}'>
                                <td class='text-center' style='vertical-align: middle;'>
                                    <div class='btn-group'>
                                        <button type='button' class ='btn btn-xs btn-outline btn-success cls_edit_trim' title='Edit'>
                                            <span class='fa fa-pencil-square-o'></span>
                                        </button>
                                        <button type='button' class ='btn btn-xs btn-outline btn-primary cls_copy_trim' title='Copy'>
                                            <span class ='fa fa-files-o'></span>
                                        </button>
                                    </div>
                                </td>
                                <td>${datatrim[i].codigo}</td>
                                <td>${datatrim[i].descripcion}</td>
                                <td>${datatrim[i].placement}</td>
                                <td>${datatrim[i].proveedor}</td>
                                <td>${datatrim[i].status}</td>
                                <td>${datatrim[i].incoterm}</td>
                                <td>${datatrim[i].costo}</td>
                                <td>${datatrim[i].nombrecliente}</td>
                                <td>${datatrim[i].nombredivision}</td>
                            </tr>
                        `;
                } else {
                    break;
                }
            }

            _('tbody_index_trim').innerHTML = html;
            _('foot_paginacion_index_trim').innerHTML = page_result_trim(odatatrim, indice);
            handler_tbl_index_init();
        }
    }
}

/* : EDU TODO SOBRE PAGINAR INICIO*/
function page_result_trim(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil_trim.registrospagina);
        if (nregistros % oUtil_trim.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil_trim.registrospagina * oUtil_trim.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil_trim.indiceactualbloque > 0) {
            contenido += "<li data-indice='-1'> <a onclick='paginar_trim(-1, llenartabla_index_trim);' > << </a></li>";
            contenido += "<li data-indice='-2'> <a onclick='paginar_trim(-2, llenartabla_index_trim);' > < </a></li>";
        }
        var inicio = oUtil_trim.indiceactualbloque * oUtil_trim.paginasbloques;
        var fin = inicio + oUtil_trim.paginasbloques;
        let clsactivo = '';
        for (let i = inicio; i < fin; i++) {
            if (i <= indiceultimapagina) {
                if (indice == i) {
                    clsactivo = 'active_paginacion'
                } else {
                    clsactivo = ''
                }
                if (indice == -1) {
                    if (i == 0) {
                        clsactivo = 'active_paginacion';
                    }
                } else if (indice == -4) {
                    if (i == indiceultimapagina) {
                        clsactivo = 'active_paginacion';
                    }
                } else if (indice == -2 || indice == -3) {
                    if (i == inicio) {
                        clsactivo = 'active_paginacion'
                    }
                }
                contenido += `<li class='${clsactivo}' data-indice='${i}'>`;
                contenido += `<a class='${clsactivo}' onclick='paginar_trim(`;
                contenido += i.toString();
                contenido += `, llenartabla_index_trim);'>`;
                contenido += (i + 1).toString();
                contenido += `</a>`;
                contenido += `</li>`;
            }
            else break;
        }
        if (oUtil_trim.indiceactualbloque < indiceultimobloque) {
            contenido += "<li data-indice='-3'> <a onclick='paginar_trim(-3, llenartabla_index_trim);' > > </a></li>";
            contenido += "<li data-indice='-4'> <a onclick='paginar_trim(-4, llenartabla_index_trim);' > >> </a></li>";
        }
    }

    let foot = `<nav>
                    ${contenido}
                </nav>
        `;
    return foot;
}

function paginar_trim(indice, callback_pintartabla) {
    if (indice > -1) {
        oUtil_trim.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil_trim.indiceactualbloque = 0;
                oUtil_trim.indiceactualpagina = 0;
                break;
            case -2:
                oUtil_trim.indiceactualbloque--;
                oUtil_trim.indiceactualpagina = oUtil_trim.indiceactualbloque * oUtil_trim.paginasbloques;
                break;
            case -3:
                oUtil_trim.indiceactualbloque++;
                oUtil_trim.indiceactualpagina = oUtil_trim.indiceactualbloque * oUtil_trim.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil_trim.adataresult.length;
                var registrosbloque = oUtil_trim.registrospagina * oUtil_trim.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil_trim.indiceactualbloque = indiceultimobloque;
                oUtil_trim.indiceactualpagina = oUtil_trim.indiceactualbloque * oUtil_trim.paginasbloques;
                break;
        }
    }

    callback_pintartabla(oUtil_trim.adataresult, indice);
}

function event_header_filter_trim(fields_input) {
    let adataResult = [], adata = oUtil_trim.adata;
    if (adata.length > 0) {
        var fields = _('tbl_index_trim').getElementsByClassName(fields_input);
        if (fields != null && fields.length > 0) {
            var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
            var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
            var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
            var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

            acampos_name = _oreflector.getProperties(adata[0]);

            for (i = 0; i < nreg; i++) {
                exito = true;
                for (x = 0; x < nfields; x++) {
                    ofield = fields[x];
                    value = ofield.value.toLowerCase();
                    field = ofield.getAttribute("data-field");

                    if (ofield.type == "text") {
                        //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);

                        if (exito) {
                            if (value !== '') {
                                valor = adata[i][field];
                                _y = adata[i][field].toLowerCase().indexOf(value);
                                exito = (y > -1);
                            }
                        }
                        exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
                    }
                    else {
                        exito = exito && (value == "" || value == adata[i][field]);
                    }
                    if (!exito) break;
                }
                if (exito) {
                    acampos_value = _oreflector.getValues(adata[i]);
                    adataResult[c] = _setfield(acampos_name, acampos_value);
                    c++;
                }
            }
        }
    }
    return adataResult;
}

function filter_header_trim() {
    var name_filter = "_clsfilter";
    var filters = _('tbl_index_trim').getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (let i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type === "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil_trim.adataresult = event_header_filter_trim(name_filter);
                llenartabla_index_trim(oUtil_trim.adataresult, 0); //:desactivate                
            }
        }
    }
}
/* : FIN*/

function handler_tbl_index_init() {
    let tbl = _('tbody_index_trim'), arredit = Array.from(tbl.getElementsByClassName('cls_edit_trim')),
        arrcopy = Array.from(tbl.getElementsByClassName('cls_copy_trim'));
    arredit.forEach(x => x.addEventListener('click', e => { evento_tbl_trim(e, 'edit') }));
    arrcopy.forEach(x => x.addEventListener('click', e => { evento_tbl_trim(e, 'copy') }));
}

function evento_tbl_trim(event, accion) {
    let fila, o = event.currentTarget, tag = o.tagName;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }
    if (fila !== null) {
        let par = fila.getAttribute('data-par');
        evento_accion_tbl_trim(par, accion);
    }
}

function evento_accion_tbl_trim(par, accion) {
    if (accion === 'edit') {
        let idtrim = _par(par, 'idtrim'), url = 'Maestra/ClienteDivisionTrim/New_Trim', par_index = _('txtpar_index_trims').value, idgrupocomercial = _par(par_index, 'idgrupocomercial'),
            idcliente = _('cbo_cliente_trim').value, idclienteestilo = _('cbo_clientedivision_trim').value,
            filtro_index = `idcliente=${idcliente}¬idclientedivision=${idclienteestilo}`;

        ovariables_trim.filtro_index = filtro_index;
        
        _Go_Url(url, url, `accion:edit,idgrupocomercial:${idgrupocomercial},idtrim:${idtrim},filtro_index:${filtro_index}`);
    }
    if (accion === 'copy') {
        let idtrim = _par(par, 'idtrim'), url = 'Maestra/ClienteDivisionTrim/New_Trim', par_index = _('txtpar_index_trims').value, idgrupocomercial = _par(par_index, 'idgrupocomercial'),
            idcliente = _('cbo_cliente_trim').value, idclienteestilo = _('cbo_clientedivision_trim').value,
            filtro_index = `idcliente=${idcliente}¬idclientedivision=${idclienteestilo}`;

        ovariables_trim.filtro_index = filtro_index;

        _Go_Url(url, url, `accion:copy,idgrupocomercial:${idgrupocomercial},idtrim:${idtrim},filtro_index:${filtro_index}`);
    }
}

function res_ini(rpta) {
    let odata = rpta !== '' ? JSON.parse(rpta) : null;
    if (odata !== null) {
        ovariables_trim.data_clientedivision = odata[0].clientedivision !== '' ? CSVtoJSON(odata[0].clientedivision) : null;
        ovariables_trim.data_cliente = odata[0].clientes !== '' ? CSVtoJSON(odata[0].clientes) : null;
        _('cbo_cliente_trim').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_trim.data_cliente, 'idcliente', 'nombrecliente');

        odata_trim = odata[0].trim !== '' ? CSVtoJSON(odata[0].trim) : null;
        oUtil_trim.adata = odata_trim;
        oUtil_trim.adataresult = oUtil_trim.adata;
        llenartabla_index_trim(odata_trim);

        SiYaExisteFiltroCargarCombosDeFiltrosYSetear();
        MarcarFilaTablaParaIndicarRegistroNuevo_o_Editado();
    }
}

function SiYaExisteFiltroCargarCombosDeFiltrosYSetear() {
    if (ovariables_trim.idclientedivision_filtro !== '' || ovariables_trim.idcliente_filtro !== '') {
        if (ovariables_trim.idcliente_filtro !== '') {
            _('cbo_cliente_trim').value = ovariables_trim.idcliente_filtro;
            fn_filtrar_clientedivisionbyidcliente(ovariables_trim.idcliente_filtro);
            if (ovariables_trim.idclientedivision_filtro !== '') {
                _('cbo_clientedivision_trim').value = ovariables_trim.idclientedivision_filtro;
            }
        } 
    }
}

function res_buscar(rpta) {
    let odata = rpta !== '' ? JSON.parse(rpta) : null, odatatrim = null;

    if (odata !== null) {
        if (odata[0].trim !== '') {
            odatatrim = odata[0].trim !== '' ? CSVtoJSON(odata[0].trim) : null;
            oUtil_trim.adata = odatatrim;
            oUtil_trim.adataresult = oUtil_trim.adata;
            llenartabla_index_trim(odatatrim);
        } else {
            _('tbody_index_trim').innerHTML = '';
            _('foot_paginacion_index_trim').innerHTML = page_result_trim(odatatrim);
        }
    } else {
        _('tbody_index_trim').innerHTML = '';
        _('foot_paginacion_index_trim').innerHTML = page_result_trim(odatatrim);
    }
}


function buscar_trim() {
    let par = _('txtpar_index_trims').value;
    let parametro = { idgrupocomercial: _par(par, 'idgrupocomercial'), idcliente: _('cbo_cliente_trim').value, idclientedivision: _('cbo_clientedivision_trim').value }
    let err = function (__err) { console.log("error", __err) };
    _Get('Maestra/ClienteDivisionTrim/GetDataBuscarTrim?par=' + JSON.stringify(parametro))
        .then((datarpta) => { 
            res_buscar(datarpta);
        }, (p) => {
            err(p);
        });
}

function open_new_trims() {
    let url = 'Maestra/ClienteDivisionTrim/New_Trim', par = _('txtpar_index_trims').value, idgrupocomercial = _par(par, 'idgrupocomercial'),idcliente=_('cbo_cliente_trim').value,
        idclientedivision = _('cbo_clientedivision_trim').value, filtro_index = `idcliente=${idcliente}¬idclientedivision=${idclientedivision}`;

    _Go_Url(url, url, `accion:new,idgrupocomercial:${idgrupocomercial},filtro_index:${filtro_index}`);
}

function MarcarFilaTablaParaIndicarRegistroNuevo_o_Editado() {
    try {
        if (ovariables_trim_new.idtrim_edit_pamarcar_tablaindex !== '') {
            let tbl = _('tbody_index_trim'), arr_rows = Array.from(tbl.rows);

            arr_rows.some(x => {
                let par = x.getAttribute('data-par'), idtrim = _par(par, 'idtrim');
                if (idtrim == ovariables_trim_new.idtrim_edit_pamarcar_tablaindex) {
                    x.classList.add('bg-info');
                    return true;
                }
            });
        }
    } catch (e) {

    }
    
}

function req_ini() {
    let par = _('txtpar_index_trims').value;
    let parametro = { idgrupocomercial: _par(par, 'idgrupocomercial'), idcliente: _('cbo_cliente_trim').value === '' ? 0 : _('cbo_cliente_trim').value, idclientedivision: _('cbo_clientedivision_trim').value === '' ? 0 : _('cbo_clientedivision_trim').value };
    try {
        if (ovariables_trim_new.filtro_index !== '') {
            ovariables_trim_new.filtro_index = ovariables_trim_new.filtro_index.replace(/=/gi, ':');
            let arr = ovariables_trim_new.filtro_index.split('¬');
            let idcliente = _par(arr[0], 'idcliente'), idclientedivision = _par(arr[1], 'idclientedivision');
            ovariables_trim.idcliente_filtro = idcliente;
            ovariables_trim.idclientedivision_filtro = idclientedivision;

            parametro = { idgrupocomercial: _par(par, 'idgrupocomercial'), idcliente: idcliente === '' ? 0 : idcliente, idclientedivision: idclientedivision === '' ? 0 : idclientedivision }
        }
    } catch (e) {
        ////console.log(e.toString() + 'error de filtro index');
    }
        
    let err = function (__err) { console.log("error", __err) };
    _Get('Maestra/ClienteDivisionTrim/GetDataTrim_iniindex?par=' + JSON.stringify(parametro))
        .then((odata_rpta) => {
            res_ini(odata_rpta);
        }, (p) => { err(p) });
}

(
function init() {
    load();
    req_ini();
}
)();
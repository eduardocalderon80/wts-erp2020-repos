var ovariables_req = {
    idgrupocomercial: '',
    filtro_index: '',
    idcliente_filtro: '',
    idclientetemporada_filtro: '',
    idproveedor_filtro: '',
    estado_filtro: '',
    style_filtro: '',
    idtipomuestra_filtro: ''
}

var oUtil_req = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0
}

function load() {
    let par = _('txtpar').getAttribute('data-par'), idrequerimiento = _par(par, 'idrequerimiento');
    ovariables_req.idgrupocomercial = _par(par, 'idgrupocomercial');

    _('btnNewRequerimiento').addEventListener('click', newrequerimiento);
    _('btnSearch').addEventListener('click', buscarRequerimiento);
    _('btnSendMail').addEventListener('click', GoSendMail);
    _('cboCliente').addEventListener('change', getDataCombosByCliente);

    //if (idrequerimiento != '') {
    //    buscarRequerimientoById(idrequerimiento);
    //}

    _('txt_codigoestilo').addEventListener('keypress', function (event) {
        if (event.keyCode == 13) {
            buscarRequerimiento();
        }
    });

    //$(".cboCliente").select2();
}

function newrequerimiento() {
    let idcliente = _('cboCliente').value, style = _('txt_codigoestilo').value, idclientetemporada = _('cboClienteTemporada').value, idproveedor = _('cboProveedor').value, estado = _('cboEstado').value, idtipomuestra = _('cboTipoMuestra').value,
        urlaccion = 'GestionProducto/Requerimiento/New', urljs = 'GestionProducto/Requerimiento/New'
        , filtro_index = `idcliente=${idcliente}¬idclientetemporada=${idclientetemporada}¬idproveedor=${idproveedor}¬estado=${estado}¬style=${style}¬idtipomuestra=${idtipomuestra}`;
    _Go_Url(urlaccion, urljs, 'accion:new,idgrupocomercial:' + ovariables_req.idgrupocomercial + ',filtro_index:' + filtro_index);
}

function GoSendMail() {
    let idcliente = _('cboCliente').value, style = _('txt_codigoestilo').value, idclientetemporada = _('cboClienteTemporada').value, idproveedor = _('cboProveedor').value, estado = _('cboEstado').value, idtipomuestra = _('cboTipoMuestra').value,
        urlAccion = 'GestionProducto/Requerimiento/CorreoMasivo'
        , filtro_index = `idcliente=${idcliente}¬idclientetemporada=${idclientetemporada}¬idproveedor=${idproveedor}¬estado=${estado}¬style=${style}¬idtipomuestra=${idtipomuestra}`;
    _Go_Url(urlAccion, urlAccion, 'idgrupocomercial:' + ovariables_req.idgrupocomercial + ',filtro_index:' + filtro_index);
}

function getDataCombosByCliente(event) {
    //let idcliente = _('cboCliente').value, urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + idcliente;
    //Get(urlaccion, res_datacliente);

    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(),
        parametro = { idcliente: idcliente, perfil: perfil, idgrupocomercial: ovariables_req.idgrupocomercial },
        urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_datacliente);
}

function res_datacliente(data) {
    let rpta = data != "" ? JSON.parse(data) : null;
    if (rpta != null) {
        _('cboTipoMuestra').innerHTML = '';
        _('cboClienteTemporada').innerHTML = '';
        _('cboProveedor').innerHTML = '';

        _('cboTipoMuestra').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(rpta[0].tipomuestraxcliente);
        _('cboClienteTemporada').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(rpta[0].temporaxcliente);
        _('cboProveedor').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(rpta[0].proveedor);
    }
}

function buscarRequerimiento() {
    let idcliente = _('cboCliente').value, idproveedor = _('cboProveedor').value, idclientetemporada = _('cboClienteTemporada').value,
        idtipomuestraxcliente = _('cboTipoMuestra').value, idestado = _('cboEstado').value, codigoestilo = _('txt_codigoestilo').value;

    idcliente = idcliente == '' ? 0 : idcliente;
    idproveedor = idproveedor == '' ? 0 : idproveedor;
    idclientetemporada = idclientetemporada == '' ? 0 : idclientetemporada;
    idtipomuestraxcliente = idtipomuestraxcliente == '' ? 0 : idtipomuestraxcliente;
    idestado = idestado == '' ? 0 : idestado;

    oUtil_req.adata = [];
    oUtil_req.adataresult = [];
    oUtil_req.indiceactualpagina = 0;
    oUtil_req.registrospagina = 10;
    oUtil_req.paginasbloques = 3;
    oUtil_req.indiceactualbloque = 0;

    let parametro = JSON.stringify({ idcliente: idcliente, idproveedor: idproveedor, idclientetemporada: idclientetemporada, idestado: idestado, idtipomuestraxcliente: idtipomuestraxcliente, codigoestilo: codigoestilo })
    let urlaccion = 'GestionProducto/Requerimiento/getData_requerimientoIndexSearch?par=' + parametro;
    Get(urlaccion, pintartablaindex);
}

function buscarRequerimientoById(idrequerimiento) {
    let urlaccion = 'GestionProducto/Requerimiento/getData_requerimientoIndexSearchById?par=' + idrequerimiento;
    Get(urlaccion, pintartablaindex);
}

function pintartablaindex(rpta, indice) {
    _('tbody_requerimiento_index').innerHTML = '';
    if (rpta != '') {
        let data = CSVtoJSON(rpta, '¬', '^');
        if (data != null) {
            llenartablaindex(data, indice);
        } else {
            _('foot_paginacion').innerHTML = '';
        }
    }
}

function llenartablaindex(data, indice) {

    if (indice == undefined) {
        indice = 0;
    }
    oUtil_req.adata = data;
    oUtil_req.adataresult = oUtil_req.adata;
    let inicio = oUtil_req.indiceactualpagina * oUtil_req.registrospagina;
    let fin = inicio + oUtil_req.registrospagina, i = 0, x = data.length;

    let tbl = _('tbody_requerimiento_index'), html = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = inicio; i < fin; i++) {
            if (i < totalfilas) {
                html += `<tr data-par='idrequerimiento: ${data[i].idrequerimiento}'>
                        <td>${data[i].codigo_requerimiento}</td>
                        <td>${data[i].codigoestilo}</td>
                        <td>${data[i].version}</td>
                        <td>${data[i].tela}</td>
                        <td>${data[i].nombrecliente}</td>
                        <td>${data[i].nombreproveedor}</td>
                        <td>${data[i].nombretemporada}</td>
                        <td>${data[i].nombreestado}</td>
                        <td>${data[i].nombretipomuestra}</td>
                        <td class='text-center'>
                            <div class='btn-group'>
                                <button type='button' class='btn btn-success _edit' title='Edit'>
                                    <span class ='fa fa-pencil-square-o'></span>
                                </button>
                                 <button type='button' class ='btn btn-danger _delete' title='Delete'>
                                    <span class ='fa fa-remove'></span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                break;
            }
        }
        tbl.innerHTML = html;
        _('foot_paginacion').innerHTML = page_result_req(data, indice);
        handlertabla();
    }
}

function page_result_req(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil_req.registrospagina);
        if (nregistros % oUtil_req.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil_req.registrospagina * oUtil_req.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil_req.indiceactualbloque > 0) {
            contenido += "<li data-indice='-1'> <a onclick='paginar_req(-1, llenartablaindex);' > << </a></li>";
            contenido += "<li data-indice='-2'> <a onclick='paginar_req(-2, llenartablaindex);' > < </a></li>";
        }
        var inicio = oUtil_req.indiceactualbloque * oUtil_req.paginasbloques;
        var fin = inicio + oUtil_req.paginasbloques;
        let clsactivo = '';
        for (var i = inicio; i < fin; i++) {
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
                contenido += `<a class='${clsactivo}' onclick='paginar_req(`;
                contenido += i.toString();
                contenido += `, llenartablaindex);'>`;
                contenido += (i + 1).toString();
                contenido += `</a>`;
                contenido += `</li>`;
            }
            else break;
        }
        if (oUtil_req.indiceactualbloque < indiceultimobloque) {
            contenido += "<li data-indice='-3'> <a onclick='paginar_req(-3, llenartablaindex);' > > </a></li>";
            contenido += "<li data-indice='-4'> <a onclick='paginar_req(-4, llenartablaindex);' > >> </a></li>";
        }
    }

    let foot = `<nav>
                    ${contenido}
                </nav>
        `;
    return foot;
}

function paginar_req(indice, callback_pintartabla) {
    if (indice > -1) {
        oUtil_req.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil_req.indiceactualbloque = 0;
                oUtil_req.indiceactualpagina = 0;
                break;
            case -2:
                oUtil_req.indiceactualbloque--;
                oUtil_req.indiceactualpagina = oUtil_req.indiceactualbloque * oUtil_req.paginasbloques;
                break;
            case -3:
                oUtil_req.indiceactualbloque++;
                oUtil_req.indiceactualpagina = oUtil_req.indiceactualbloque * oUtil_req.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil_req.adataresult.length;
                var registrosbloque = oUtil_req.registrospagina * oUtil_req.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil_req.indiceactualbloque = indiceultimobloque;
                oUtil_req.indiceactualpagina = oUtil_req.indiceactualbloque * oUtil_req.paginasbloques;
                break;
        }
    }
    callback_pintartabla(oUtil_req.adataresult, indice);
}

function handlertabla() {
    let tbl = _('tbl_requerimiento_index'), arrayEdit = _Array(tbl.getElementsByClassName('_edit')), arrayDelete = _Array(tbl.getElementsByClassName('_delete'));

    arrayEdit.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'edit'); }));
    arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'delete'); }));
}

function controladoracciontabla(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        par = fila.getAttribute('data-par');
        evento(par, accion, fila);
    }
}

function evento(par, accion, fila) {
    switch (accion) {
        case 'edit':
            let idcliente = _('cboCliente').value, style = _('txt_codigoestilo').value, idclientetemporada = _('cboClienteTemporada').value, idproveedor = _('cboProveedor').value, estado = _('cboEstado').value, idtipomuestra = _('cboTipoMuestra').value,
                urlaccion = 'GestionProducto/Requerimiento/New', idrequerimiento = _par(par, 'idrequerimiento')
                , filtro_index = `idcliente=${idcliente}¬idclientetemporada=${idclientetemporada}¬idproveedor=${idproveedor}¬estado=${estado}¬style=${style}¬idtipomuestra=${idtipomuestra}`;
            _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables_req.idgrupocomercial + ',idrequerimiento:' + idrequerimiento + ',filtro_index:' + filtro_index);
            break;
        case 'delete':
            let id = _par(par, 'idrequerimiento');
            MostrarVentanaEliminar(id);
            //  urlaccion = 'GestionProducto/Requerimiento/Eliminar', idrequerimiento = _par(par, 'idrequerimiento');
            //_Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables.idgrupocomercial + ',idrequerimiento:' + idrequerimiento);
            break;
    }
}

function MostrarVentanaEliminar(Id) {
    swal({
        title: "Are you sure to delete?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        EliminarTela(Id)
        return;
    });
}

function EliminarTela(Id) {
    let form = new FormData()
    let urlaccion = 'GestionProducto/Requerimiento/EliminarReq', parametro = { idrequerimiento: Id };
    form.append('par', JSON.stringify(parametro));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            _swal({ estado: 'success', mensaje: 'Requirement was deleted' });
            buscarRequerimiento();
            //return;
        }
        else {
            _swal({ estado: 'error', mensaje: 'Requirement could not delete' });
        }
    });
    return;
}

function res_ini(respuesta) {
    let orpta = respuesta != null ? JSON.parse(respuesta) : null;

    if (orpta != null) {
        _('cboCliente').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(orpta[0].clientes);
        _('cboEstado').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(orpta[0].estados);
        let idgrupocomercial = _par(_('txtpar').getAttribute('data-par'), 'idgrupocomercial');
        if (idgrupocomercial === '') {
            _('txtpar').value = 'idgrupocomercial:' + orpta[0].idgrupocomercial;
            _('txtpar').setAttribute('data-par', _('txtpar').value);
            ovariables_req.idgrupocomercial = orpta[0].idgrupocomercial;
        }
        //_('cboProveedor').innerHTML = _comboItem({ value: '', text: 'All' }) + _comboFromCSV(orpta[0].proveedor);
    }

    if (ovariables_req.idcliente_filtro !== '' || ovariables_req.idclientetemporada_filtro !== '' || ovariables_req.idproveedor_filtro !== '' || ovariables_req.estado_filtro !== '' || ovariables_req.style_filtro !== '' || ovariables_req.idtipomuestra_filtro !== '') {
        _promise()
            .then(() => {
                if (ovariables_req.idcliente_filtro !== '0') {
                    _('cboCliente').value = ovariables_req.idcliente_filtro;
                    let par = JSON.stringify({ idcliente: ovariables_req.idcliente_filtro, idgrupocomercial: ovariables_req.idgrupocomercial, perfil: $('#txtperfil').val() });
                    return _Get('GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + par)
                }

            })
            .then((data) => {
                res_datacliente(data);
            })
            .then(() => {
                _('cboClienteTemporada').value = ovariables_req.idclientetemporada_filtro;
                _('cboTipoMuestra').value = ovariables_req.idtipomuestra_filtro;
                _('cboProveedor').value = ovariables_req.idproveedor_filtro;
                _('cboEstado').value = ovariables_req.estado_filtro;
                _('txt_codigoestilo').value = ovariables_req.style_filtro;
            })
            .then(() => {
                buscarRequerimiento();
            });
    }
    //else {
    //    buscarRequerimiento();
    //}
}

function req_ini() {
    try {
        if (ovariables_req_new.filtro_index !== '') {
            ovariables_req_new.filtro_index = ovariables_req_new.filtro_index.replace(/=/gi, ':');
            let arr = ovariables_req_new.filtro_index.split('¬');
            let idcliente = _par(arr[0], 'idcliente'), idclientetemporada = _par(arr[1], 'idclientetemporada'), idproveedor = _par(arr[2], 'idproveedor'), estado = _par(arr[3], 'estado'), style = _par(arr[4], 'style'), idtipomuestra = _par(arr[5], 'idtipomuestra');
            ovariables_req.idcliente_filtro = idcliente;
            ovariables_req.idclientetemporada_filtro = idclientetemporada;
            ovariables_req.idproveedor_filtro = idproveedor;
            ovariables_req.estado_filtro = estado;
            ovariables_req.style_filtro = style;
            ovariables_req.idtipomuestra_filtro = idtipomuestra;
        }
    } catch (e) {
        ////console.log(e.toString() + 'error de filtro index');
    }

    let urlaccion = 'GestionProducto/Requerimiento/getData_combosIndIndex', par = JSON.stringify({ xd: 1 });

    urlaccion = urlaccion + '?par=' + par;
    Get(urlaccion, res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
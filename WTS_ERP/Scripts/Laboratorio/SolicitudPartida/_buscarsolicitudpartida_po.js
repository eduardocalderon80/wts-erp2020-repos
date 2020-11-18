var oUtil_buscarpo = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    //idtable: 'tblestilo_index'
}

function load() {
    filter_header_po();
    _('_btnAceptar_po').addEventListener('click', _fn_aceptar_po);
}

function res_ini(respuesta) {
    debugger;
    let orpta = respuesta !== '' ? JSON.parse(respuesta) : null;
    if (orpta !== null) {
        let _odata = orpta[0].pocliente !== null ? CSVtoJSON(orpta[0].pocliente) : null;
        oUtil_buscarpo.adata = _odata;
        oUtil_buscarpo.adataresult = oUtil_buscarpo.adata;
        pintartablaindex_po(_odata, 0);
    }
}

function pintartablaindex_po(data_parse, indice) {
    let html = '';
    if (indice == undefined) {
        indice = 0;
    }

    let inicio = oUtil_buscarpo.indiceactualpagina * oUtil_buscarpo.registrospagina;
    let fin = inicio + oUtil_buscarpo.registrospagina, i = 0, x = data_parse.length;

    if (data_parse != null) {
        let Style = data_parse, nStyle = Style.length;
        if (nStyle > 0) {
            let html = "";
            for (i = inicio; i < fin; i++) { //for (var i = 0; i < nStyle; i++) {
                if (i < x) {
                    html += `<tr data-par='idpocliente:${Style[i].idpocliente},codigopocliente:${Style[i].codigopocliente},codigoestilo:${Style[i].codigoestilo}'>
                                <td class='text-center' sytle='vertical-align: middle;'>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdivcheckpo' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheckpo' style='position: absolute; opacity: 0;' name='_check_pocliente' />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                                <td>${Style[i].codigopocliente}</td>
                                <td>${Style[i].codigoestilo}</td>
                            </tr>`;
                } else {
                    break;
                }
            }
            _('tbody_buscar_po').innerHTML = html;
            handlertrbuscar_po('tbody_buscar_po');
        }
    }
}

/* : EDU TODO SOBRE PAGINAR INICIO*/
function event_header_filter_po(fields_input) {
    let adataResult = [], adata = oUtil_buscarpo.adata;
    if (adata.length > 0) {
        var fields = document.getElementsByClassName(fields_input);
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

function filter_header_po() {
    var name_filter = "_clsfilter";
    var filters = _('_tbl_buscar_po').getElementsByClassName(name_filter); //document.getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (let i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type == "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil_buscarpo.adataresult = event_header_filter_po(name_filter);
                pintartablaindex_po(oUtil_buscarpo.adataresult, 0); //:desactivate                

            }
        }
    }
}
/* : FIN*/

function getEstilos() {
    let tbodyestilo = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar'), arr = [...tbodyestilo.rows], lstestilos = [];
    arr.forEach(x => {
        let par = x.getAttribute('data-par');
        let idestilo = _par(par, 'idestilo');
        let obj = { idestilo: idestilo };
        lstestilos.push(obj);
    });
    return lstestilos;
}

function handlertrbuscar_po(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            //let tbl = _(idtbody), arrtbl = [...tbl.rows];
            //arrtbl.forEach((xy, indice) => {
            //    xy.bgColor = "white";
            //});

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clscheckpo'), divchecked = o.cells[0].querySelector('._clsdivcheckpo');
            ocheckbox.checked = ocheckbox.checked ? false : true;
            if (ocheckbox.checked) { // CUANDO SE USA I-CHECK SE ASIGNA DINAMICAMENTE AL DIV CONTENEDOR LA CLASE CHECKED
                divchecked.children[0].classList.add('checked');
            } else {
                divchecked.children[0].classList.remove('checked');
            }

            //o.bgColor = "#ccd1d9";
        });
    });

    // FORMATO PARA LOS CHECKBOX; PARA QUE FUNCION EL QUITAR Y SELECCIONAR EL CHECK
    $('.i-checks._clscheckpo').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function _fn_aceptar_po() {
    let resultadovalidacion = validarantes_aceptar();  // ESTA FUNCION TAMBIEN ME DEVUELVE LA LOS ESTILOS SELECCIOADOS, PERO COMO PARAM = DATA-PAR
    if (resultadovalidacion.pasalavalidacion) {
        // LLENAR TABLA ESTILOS CON LOS SELECCIONADOS
        let arrpo = resultadovalidacion.listaestilosseleccionados;
        pintardatos_po_desde_modal(arrpo);
        $('#modal__BuscarSolicitudPartidaPo').modal('hide');
    }
}

function validarantes_aceptar() {
    let tabla = _('tbody_buscar_po'), arrcheckseleccionados = [...tabla.getElementsByClassName('checked')], obj = {}, arrCodigos = [],
        pasalavalidacion = false, mensaje = '', objReturn = {}, arrGruposCodigo = [];
    if (arrcheckseleccionados.length > 0) {
        pasalavalidacion = true;
        arrcheckseleccionados.forEach(x => {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.idpocliente = _par(par, 'idpocliente');
            obj.codigopocliente = _par(par, 'codigopocliente');
            obj.codigoestilo = _par(par, 'codigoestilo');
            obj.par = par;
            arrCodigos.push(obj);
        });
    } else {
        mensaje = `Missing the po`;
    }

    if (pasalavalidacion == false) {
        _swal({ mensaje: mensaje, estado: 'error' });
    }

    objReturn.listaestilosseleccionados = arrCodigos;
    objReturn.pasalavalidacion = pasalavalidacion;

    return objReturn;
}

function pintardatos_po_desde_modal(arrpo) {
    let tbodypo = _('_tbodyGridSolicitudPartidaPoEditar'), html = '';
    arrpo.forEach(x => {
        html += `<tr data-par='idsolicitudpartidapo:0,idpocliente:${x.idpocliente},codigopocliente:${x.codigopocliente}'>
                        <td class ='text-center'>
                            <button class ='btn btn-sm btn-danger _cls_delete_po' title='Delete'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>${x.codigopocliente}</td>
                        <td>${x.codigoestilo}</td>
                    </tr>
                `;
    });
    tbodypo.innerHTML = html;
    handlertbl_po_solicitudpartida_al_loadeditar();
}

function req_ini() {
    debugger;
    let idtela = _('hf_idtela').value, idcliente = _('cbo_idcliente').value, idproveedor = _('cbo_idfabrica').value,
        estilos = getEstilos();
    let parametro = { idtela: idtela, idcliente: idcliente, idproveedor: idproveedor, estilos: estilos };
    Get('Laboratorio/SolicitudPartida/getData_buscarpocliente_load?par=' + JSON.stringify(parametro), res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }

)();
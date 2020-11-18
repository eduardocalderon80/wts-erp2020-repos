var oUtil = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    //idtable: 'tblestilo_index'
}

function load() {
    filter_header();
    _('btnAceptar_tela').addEventListener('click', ejecutaraceptar);
}

function pintartablaindex(data_parse, indice) {
    let html = '';
    if (indice == undefined) {
        indice = 0;
    }

    let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
    let fin = inicio + oUtil.registrospagina, i = 0, x = data_parse.length;

    if (data_parse != null) {
        let Style = data_parse, nStyle = Style.length;
        if (nStyle > 0) {
            let html = "";
            for (i = inicio; i < fin; i++) { //for (var i = 0; i < nStyle; i++) {
                if (i < x) {
                    html += `<tr data-par='idtela:${Style[i].idfichatecnica},codigotela:${Style[i].codigotela},descripciontela:${Style[i].nombretela},titulo:${Style[i].titulo},composicion:${Style[i].composicion},densidad:${Style[i].densidad},lavado:${Style[i].lavado}'>
                                <td class='hide'>
                                    <input type='radio' value='' class='_clschecktela' name='_rad_tela' />
                                </td>
                                <td>${Style[i].codigotela}</td>
                                <td>${Style[i].nombretela}</td>
                                <td>${Style[i].titulo}</td>
                                <td>${Style[i].composicion}</td>
                                <td>${Style[i].nombrefamilia}</td>
                            </tr>`;
                } else {
                    break;
                }

            }
            _('tbody_tela_buscar').innerHTML = html;
            _('foot_paginacion').innerHTML = page_result(data_parse, indice);
            handlertrbuscartela('tbody_tela_buscar');
        }
    }
}

function handler_filter_campos() {
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

/* : EDU TODO SOBRE PAGINAR INICIO*/
function page_result(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil.registrospagina);
        if (nregistros % oUtil.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil.indiceactualbloque > 0) {
            contenido += "<li data-indice='-1'> <a onclick='paginar(-1, pintartablaindex);' > << </a></li>";
            contenido += "<li data-indice='-2'> <a onclick='paginar(-2, pintartablaindex);' > < </a></li>";
        }
        var inicio = oUtil.indiceactualbloque * oUtil.paginasbloques;
        var fin = inicio + oUtil.paginasbloques;
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
                contenido += `<a class='${clsactivo}' onclick='paginar(`;
                contenido += i.toString();
                contenido += `, pintartablaindex);'>`;
                contenido += (i + 1).toString();
                contenido += `</a>`;
                contenido += `</li>`;
            }
            else break;
        }
        if (oUtil.indiceactualbloque < indiceultimobloque) {
            contenido += "<li data-indice='-3'> <a onclick='paginar(-3, pintartablaindex);' > > </a></li>";
            contenido += "<li data-indice='-4'> <a onclick='paginar(-4, pintartablaindex);' > >> </a></li>";
        }
    }

    let foot = `<nav>
                    ${contenido}
                </nav>
        `;
    return foot;
}

function paginar(indice, callback_pintartabla) {
    if (indice > -1) {
        oUtil.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil.indiceactualbloque = 0;
                oUtil.indiceactualpagina = 0;
                break;
            case -2:
                oUtil.indiceactualbloque--;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -3:
                oUtil.indiceactualbloque++;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil.adataresult.length;
                var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil.indiceactualbloque = indiceultimobloque;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
        }
    }

    ////pintartablaindex(oUtil.adataresult, indice);
    callback_pintartabla(oUtil.adataresult, indice);
}

function event_header_filter(fields_input) {
    let adataResult = [], adata = oUtil.adata;
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

function filter_header() {
    var name_filter = "_clsfilter";
    var filters = document.getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (let i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type == "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil.adataresult = event_header_filter(name_filter);
                pintartablaindex(oUtil.adataresult, 0); //:desactivate                
                
            }
        }
    }
}
/* : FIN*/

function handlertrbuscartela(idtbody) {
    //$("#" + idtbody)[0]
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) { 
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });
            
            let o = e.currentTarget;
            o.cells[0].children[0].checked = true;
            o.bgColor = "#ccd1d9";
        });
    });
}

function ejecutaraceptar() {
    let tabla = _('tbody_tela_buscar'), arrFilas = [...tabla.rows];
    let estaseleccionadolafila = false;

    arrFilas.some(x => {
        if (x.cells[0].children[0].checked) {
            let par = x.getAttribute('data-par');
            estaseleccionadolafila = true;

            _('hf_idtela').value = _par(par, 'idtela');
            _('txt_codigotela').value = _par(par, 'codigotela');
            _('txt_descripciontela').value = _par(par, 'descripciontela');
            _('txt_titulotela').value = _par(par, 'titulo');
            _('txt_composiciontela').value = _par(par, 'composicion');
            _('txt_densidadestandard').value = _par(par, 'densidad');

            let valorlavado = _par(par, 'lavado');
            let arrlavado = Array.from(_('div_grupo_lavado').getElementsByClassName('clslavado'));
            arrlavado.some(x => {
                x.parentNode.classList.remove('checked');
                if (x.value == valorlavado) {
                    x.checked = true;
                    x.parentNode.classList.add('checked');
                    return true;
                }
            });

            // QUITAR LOS MARCADORES DE ERROR
            _('div_grupo_codigotela').classList.remove('has-error');
            _('div_grupo_descripciontela').classList.remove('has-error');
            _('div_grupo_titulotela').classList.remove('has-error');
            _('div_grupo_composiciontela').classList.remove('has-error');
            // LIMPIAR LA TABLA DE ESTILOS y PO
            _('_tbodyGridSolicitudPartidaEstiloxTelaEditar').innerHTML = '';
            _('_tbodyGridSolicitudPartidaPoEditar').innerHTML = '';

            $("#modal__BuscarTela").modal('hide');
            return true;
        }
    });
    if (estaseleccionadolafila) {
        //_swal({ mensaje: 'Select the fabric', 'error' }, 'Error');
        return false;
    }
}

function res_ini(data) {
    let orpta = data !== '' ? JSON.parse(data) : null, odata = null;
    if (orpta !== null) {
        let odatatelas = orpta[0].telas !== null ? CSVtoJSON(orpta[0].telas) : null;
        oUtil.adata = odatatelas;
        oUtil.adataresult = oUtil.adata;
        pintartablaindex(odatatelas, 0);
        //filter_header();
        //select_row();
    }
}

function req_ini() {
    let idfamilia = _('cbo_idfamilia').value;
    Get('Laboratorio/SolicitudPartida/getData_telas_buscar?par=' + idfamilia, res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
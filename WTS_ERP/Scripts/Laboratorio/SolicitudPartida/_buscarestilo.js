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

    _('_btnAceptar_estilo').addEventListener('click', aceptarestiloseleccionados);
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
                    let esprincipal = Style[i].principal == 1 ? 'checked' : '';
                    
                    html += `<tr data-par='idestilo:${Style[i].idestilo},codigoestilo:${Style[i].codigoestilo},idtela:${Style[i].idtela},codigotela:${Style[i].codigotela},descripciontela:${Style[i].nombretela},titulo:${Style[i].titulo},composicion:${Style[i].composicion},idfamilia:${Style[i].idfamilia},densidad:${Style[i].densidad},lavado:${Style[i].lavado},principal:${Style[i].principal}'>
                                <td>

                                    <label>
                                        <div class ='icheckbox_square-green _clsdivcheckestilo' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheckestilo' style='position: absolute; opacity: 0;' name='_chk_estilo' />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                                <td>${Style[i].codigoestilo}</td>
                                <td>${Style[i].descripcion_estilo}</td>
                                <td class='_clscodigotela'>${Style[i].codigotela}</td>
                                <td>${Style[i].nombretela}</td>
                                <td>${Style[i].nombrefamilia}</td>
                                <td class='text-center'>${Style[i].version}</td>
                                <td><input type='checkbox' ${esprincipal} disabled='disabled' /></td>
                            </tr>`;
                } else {
                    break;
                }

            }
            _('tbody_estilo_buscar').innerHTML = html;
            _('foot_paginacion_estilo').innerHTML = page_result(data_parse, indice);
            handlertrbuscarestilo('tbody_estilo_buscar');
        }
    }
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

function handlertrbuscarestilo(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clscheckestilo'), divchecked = o.cells[0].querySelector('._clsdivcheckestilo');
            ocheckbox.checked = ocheckbox.checked ? false : true;
            if (ocheckbox.checked) { // CUANDO SE USA I-CHECK SE ASIGNA DINAMICAMENTE AL DIV CONTENEDOR LA CLASE CHECKED
                divchecked.children[0].classList.add('checked');
            } else {
                divchecked.children[0].classList.remove('checked');
            }
            
            o.bgColor = "#ccd1d9";
        });
    });

    // FORMATO PARA LOS CHECKBOX; PARA QUE FUNCION EL QUITAR Y SELECCIONAR EL CHECK
    $('.i-checks._clscheckestilo').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function aceptarestiloseleccionados() {
    // PRIMERO VALIDAR QUE SEAN DEL MISMO CODIGO DE TELA
    let resultadovalidacion = validarantes_aceptar();  // ESTA FUNCION TAMBIEN ME DEVUELVE LA LOS ESTILOS SELECCIOADOS, PERO COMO PARAM = DATA-PAR
    if (resultadovalidacion.pasalavalidacion) {
        // LLENAR TABLA ESTILOS CON LOS SELECCIONADOS
        let arrestilos = resultadovalidacion.listaestilosseleccionados;
        pintardatos_estilo_telas_desde_modal(arrestilos);
        $('#modal__BuscarEstilo').modal('hide');
    }
}

function pintardatos_estilo_telas_desde_modal(arrestilos) {
    // datos de la tela
    let par_tela = arrestilos[0].par, html = '';
    let idtela = _par(par_tela, 'idtela'), codigotela = _par(par_tela, 'codigotela'), nombretela = _par(par_tela, 'descripciontela'), titulotela = _par(par_tela, 'titulo'),
        composicion = _par(par_tela, 'composicion'), idfamilia = _par(par_tela, 'idfamilia'), densidad = _par(par_tela, 'densidad'), lavado = _par(par_tela, 'lavado'),
        principal = _par(par_tela, 'principal');

    arrestilos.forEach(x => {
        let par = x.par, codigoestilo = _par(par, 'codigoestilo'), idestilo = _par(par, 'idestilo');

        html += `<tr data-par='idsolicitudpartidaestiloxtela:0,idestilo:${idestilo},idtela:${idtela},principal:${principal}'>
                        <td class ='text-center'>
                            <button class ='btn btn-sm btn-danger _cls_deleteestilo' title='Delete'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>${codigoestilo}</td>
                        <td>${codigotela}</td>
                        <td>${nombretela}</td>
                    </tr>
                `;
    });

    _('_tbodyGridSolicitudPartidaEstiloxTelaEditar').innerHTML = html;
    handlertblestilos_solicitudpartida_al_loadeditar();
    // PINTAR DATOS DE LA TELA
    _('hf_idtela').value = idtela;
    _('txt_codigotela').value = codigotela;
    _('txt_descripciontela').value = nombretela;
    _('txt_titulotela').value = titulotela;
    _('txt_composiciontela').value = composicion;
    _('cbo_idfamilia').value = idfamilia;
    _('txt_densidadestandard').value = densidad;

    // QUITAR LOS MARCADORES DE ERROR
    _('div_grupo_codigotela').classList.remove('has-error');
    _('div_grupo_descripciontela').classList.remove('has-error');
    _('div_grupo_titulotela').classList.remove('has-error');
    _('div_grupo_composiciontela').classList.remove('has-error');
    // LIMPIAR LA TABLA DE ESTILOS y PO
    _('_tbodyGridSolicitudPartidaPoEditar').innerHTML = '';

    let divchklavado = document.getElementsByClassName('_group_lavado'), arrchklavado = [...divchklavado[0].getElementsByClassName('clslavado')];
    arrchklavado.forEach(x => {
        x.parentNode.classList.remove('checked');
        if (lavado == 1) {
            if (x.value == 1) {
                x.checked = true;
                x.parentNode.classList.add('checked');
            }
        } else if (lavado == 2) {
            if (x.value == 2) {
                x.parentNode.classList.add('checked');
                x.checked = true;
            }
        }
    });
}

function validarantes_aceptar() {
    let tabla = _('tbody_estilo_buscar'), arrcheckseleccionados = [...tabla.getElementsByClassName('checked')], obj = {}, arrCodigosTela = [],
        arrGruposCodigoTela = [], pasalavalidacion = true, mensaje = '', objReturn = {};
    if (arrcheckseleccionados.length > 0) {
        arrcheckseleccionados.forEach(x => {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.codigotela = _par(par, 'codigotela'); //fila.querySelector('._clscodigotela').innerText;
            obj.par = par;
            arrCodigosTela.push(obj);
        });
        if (arrCodigosTela.length > 0) {
            if (arrCodigosTela.length > 1) {  // agrupar
                arrGruposCodigoTela = [...new Set(arrCodigosTela.map(x => x.codigotela))]
            } else {
                arrGruposCodigoTela = arrCodigosTela;
            }
        }

        if (arrGruposCodigoTela.length > 1) {
            pasalavalidacion = false;
            mensaje = 'You have selected styles with different fabric codes.';
        }
    }
    
    if (pasalavalidacion == false) {
        _swal({ mensaje: mensaje, estado: 'error' });
    }

    objReturn.listaestilosseleccionados = arrCodigosTela;
    objReturn.pasalavalidacion = pasalavalidacion;
    
    return objReturn;
}

function res_ini(data) {
    let orpta = data !== '' ? JSON.parse(data) : null, odata = null;
    if (orpta !== null) {
        odatatelas = orpta[0].estilos !== null ? CSVtoJSON(orpta[0].estilos) : null;
        oUtil.adata = odatatelas;
        oUtil.adataresult = oUtil.adata;
        pintartablaindex(odatatelas, 0);  // LUEGO REEMPLAZAR ESTE NOMBRE DE FUNCION
    }
}

function req_ini() {
    let idcliente = _('cbo_idcliente').value, idtela = _('hf_idtela').value, url = 'Laboratorio/SolicitudPartida/getData_estilos_buscar',
        parametro = { idcliente: idcliente, idtela: idtela };
    console.log(idcliente);
    Get(url + '?par=' + JSON.stringify(parametro), res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
var oUtil_buscartrim = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
}

function load() {
    filter_header_buscartrim();
    let par = _('txtpar_buscartrim').value;
    _('_txtcliente_buscartrim').value = _par(par, 'nombrecliente');
    _('_txtidclientedivision_buscartrim').value = _par(par, 'nombreclientedivision');

    _('_btnAceptar_trim').addEventListener('click', aceptar_buscartrim);
}

function llenartablabuscartrim(odatatrim, indice) {
    let html = '';
    if (indice === undefined) {
        indice = 0;
    }

    if (odatatrim !== null) {
        let inicio = oUtil_buscartrim.indiceactualpagina * oUtil_buscartrim.registrospagina;
        let fin = inicio + oUtil_buscartrim.registrospagina, x = odatatrim.length;

        const datatrim = odatatrim;
        if (x > 0) {
            html = '';
            for (let i = inicio; i < fin; i++) {
                if (i < x) {
                    html += `
                            <tr data-par='idtrim:${datatrim[i].idtrim}'>
                                <td>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdivchecktrim' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clschecktrim' style='position: absolute; opacity: 0;' name='_chk_trim' />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                                <td>${datatrim[i].codigo}</td>
                                <td>${datatrim[i].descripcion}</td>
                                <td>${datatrim[i].placement}</td>
                                <td>${datatrim[i].proveedor}</td>
                                <td>${datatrim[i].status}</td>
                                <td>${datatrim[i].incoterm}</td>
                            </tr>
                        `;
                } else {
                    break;
                }
            }

            _('tbody_buscar_trim').innerHTML = html;
            _('foot_paginacion_buscartrim').innerHTML = page_result_buscartrim(odatatrim, indice);
            handler_tbl_buscartrim('tbody_buscar_trim');
        }
    }
}

function handler_tbl_buscartrim(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clschecktrim'), divchecked = o.cells[0].querySelector('._clsdivchecktrim');
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
    $('.i-checks._clschecktrim').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

/* : EDU TODO SOBRE PAGINAR INICIO*/
function page_result_buscartrim(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil_buscartrim.registrospagina);
        if (nregistros % oUtil_buscartrim.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil_buscartrim.registrospagina * oUtil_buscartrim.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil_buscartrim.indiceactualbloque > 0) {
            contenido += "<li data-indice='-1'> <a onclick='paginar_buscartrim(-1, llenartablabuscartrim);' > << </a></li>";
            contenido += "<li data-indice='-2'> <a onclick='paginar_buscartrim(-2, llenartablabuscartrim);' > < </a></li>";
        }
        var inicio = oUtil_buscartrim.indiceactualbloque * oUtil_buscartrim.paginasbloques;
        var fin = inicio + oUtil_buscartrim.paginasbloques;
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
                contenido += `<a class='${clsactivo}' onclick='paginar_buscartrim(`;
                contenido += i.toString();
                contenido += `, llenartablabuscartrim);'>`;
                contenido += (i + 1).toString();
                contenido += `</a>`;
                contenido += `</li>`;
            }
            else break;
        }
        if (oUtil_buscartrim.indiceactualbloque < indiceultimobloque) {
            contenido += "<li data-indice='-3'> <a onclick='paginar_buscartrim(-3, llenartablabuscartrim);' > > </a></li>";
            contenido += "<li data-indice='-4'> <a onclick='paginar_buscartrim(-4, llenartablabuscartrim);' > >> </a></li>";
        }
    }

    let foot = `<nav>
                    ${contenido}
                </nav>
        `;
    return foot;
}

function paginar_buscartrim(indice, callback_pintartabla) {
    if (indice > -1) {
        oUtil_buscartrim.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil_buscartrim.indiceactualbloque = 0;
                oUtil_buscartrim.indiceactualpagina = 0;
                break;
            case -2:
                oUtil_buscartrim.indiceactualbloque--;
                oUtil_buscartrim.indiceactualpagina = oUtil_buscartrim.indiceactualbloque * oUtil_buscartrim.paginasbloques;
                break;
            case -3:
                oUtil_buscartrim.indiceactualbloque++;
                oUtil_buscartrim.indiceactualpagina = oUtil_buscartrim.indiceactualbloque * oUtil_buscartrim.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil_buscartrim.adataresult.length;
                var registrosbloque = oUtil_buscartrim.registrospagina * oUtil_buscartrim.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil_buscartrim.indiceactualbloque = indiceultimobloque;
                oUtil_buscartrim.indiceactualpagina = oUtil_buscartrim.indiceactualbloque * oUtil_buscartrim.paginasbloques;
                break;
        }
    }

    callback_pintartabla(oUtil_buscartrim.adataresult, indice);
}

function event_header_filter_buscartrim(fields_input) {
    let adataResult = [], adata = oUtil_buscartrim.adata;
    if (adata.length > 0) {
        var fields = _('_tbl_buscar_trim').getElementsByClassName(fields_input);
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

function filter_header_buscartrim() {
    var name_filter = "_clsfilter";
    var filters = _('_tbl_buscar_trim').getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (let i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type === "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil_buscartrim.adataresult = event_header_filter_buscartrim(name_filter);
                llenartablabuscartrim(oUtil_buscartrim.adataresult, 0); //:desactivate                
            }
        }
    }
}
/* : FIN*/

function aceptar_buscartrim() {
    let resultadovalidacion = validarantes_aceptar_buscartrim();
    if (resultadovalidacion.pasalavalidacion) {
        let arrlistaseleccionados = resultadovalidacion.listaseleccionados;
        GetTrimsSeleccionados(arrlistaseleccionados);
    }
}

function GetTrimsSeleccionados(arrtrims_seleccionado) {
    let arrtrims = JSON.stringify({ idtrims: arrtrims_seleccionado });
    let err = function (__err) { console.log("err", __err) };
    _Get('GestionProducto/Estilo/GetTrimsMasivoSeleccionados_BuscarTrim?par=' + arrtrims)
        .then((odatarpta) => {
            let odata = odatarpta !== '' ? JSON.parse(odatarpta) : null;
            pintar_trims_seleccionados_buscartrim(odata);
            $('#modal__BuscarTrim').modal('hide');
        }, (p) => {
            err(p);
        });
}


function validarantes_aceptar_buscartrim() {
    let tabla = _('tbody_buscar_trim'), arrcheckseleccionados = [...tabla.getElementsByClassName('checked')], obj = {}, arridtrim = [],
        arrGruposCodigoTela = [], pasalavalidacion = true, mensaje = '', objReturn = {}, pasavalidaciondeseleccionados = true;
    if (arrcheckseleccionados.length > 0) {
        arrcheckseleccionados.forEach(x => {
            obj = {};
            let fila = x.parentNode.parentNode.parentNode.parentNode;
            let par = fila.getAttribute('data-par');
            obj.idtrim = _par(par, 'idtrim'); //fila.querySelector('._clscodigotela').innerText;
            //obj.par = par;
            arridtrim.push(obj);
        });
    } else {
        pasalavalidacion = false;
        pasavalidaciondeseleccionados = false;
    }
    
    if (pasavalidaciondeseleccionados === false) {
        mensaje += 'There is no selection. \n';
    }

    if (pasalavalidacion == false) {
        _swal({ mensaje: mensaje, estado: 'error' });
    }

    objReturn.listaseleccionados = arridtrim;
    objReturn.pasalavalidacion = pasalavalidacion;
    
    return objReturn;
}

function res_ini(odatarpta) {
    let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null;
    if (rpta !== null) {
        let odata_trim = rpta[0].trim !== '' ? CSVtoJSON(rpta[0].trim) : null;
        if (odata_trim !== null) {
            oUtil_buscartrim.adata = odata_trim;
            oUtil_buscartrim.adataresult = oUtil_buscartrim.adata;
            llenartablabuscartrim(odata_trim);
        }
    }
}

function req_ini() {
    let par = _('txtpar_buscartrim').value;
    let parametro = { idcliente: _par(par, 'idcliente'), idclientedivision: _par(par, 'idclientedivision') };
    let err = function (__err) { console.log('err', __err) };
    _Get('GestionProducto/Estilo/GetBuscarTrimFromEstilos?par=' + JSON.stringify(parametro))
        .then((odatarpta) => {
            res_ini(odatarpta);
        }, (p) => { err(p); });
}

(
    function init() {
        load();
        req_ini();
    }
)();
var appBuscarReferenciaComplemento = (
    function (d, idpadre) {
        var ovariables = {
            codigotelacliente: ''

        }

        var oUtil = {
            adata: [],
            adataresult: [],
            indiceactualpagina: 0,
            registrospagina: 10,
            paginasbloques: 3,
            indiceactualbloque: 0
        }

        function load() {
            filter_header();
            let par = _('txtpar_buscardesarrollo').value, codigotelacliente = _par(par, 'codigotelacliente');
            ovariables.codigotelacliente = codigotelacliente;

            _('_btnAceptar_buscardesarrollo').addEventListener('click', fn_aceptar_desarrollo, false);
        }

        function fn_aceptar_desarrollo() {
            //_('txtnombretelacliente_telaprincipal').value = "MXMJERSEY";
            //$("#modal__BuscarDesarrollo").modal("hide");


            let tbody = _('tbody_desarrollo'), arr_row = Array.from(tbody.rows), hayseleccionados = true;
            arr_row.some((x) => {
                let chk = x.getElementsByClassName('_cls_chk_selected')[0];
                if (chk.checked) {
                    let fila = chk.parentNode.parentNode, datapar = x.getAttribute('data-par'), idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                        nombretela = _par(datapar, 'nombretela'), idcliente = _par(datapar, 'idcliente'), idclientetemporada = _par(datapar, 'idclientetemporada'),
                        cbocliente = _('tab_usu_comercial').getElementsByClassName('cls_cbocliente')[0];

                    hayseleccionados = true;

                    //_('txtnombretelacliente').value = nombretela;
                    _('txtnombretelacliente_telaprincipal').value = nombretela;
                    _('hf_idsolicituddesarrollotela_padre').value = idsolicituddesarrollotela;
                    _('div_cuerpoprincipal').getElementsByClassName('cls_nombretelacliente')[0].value = nombretela;
                    //_('div_cuerpoprincipal').getElementsByClassName('cls_cliente')[0].value = idcliente;
                    cbocliente.value = idcliente;
                    appNewSDT.fn_cargartemporadaxcliente(cbocliente, idclientetemporada);
                    //_('tab_usu_comercial').getElementsByClassName('cls_clientetemporada')[0].value = idclientetemporada;  //div_cuerpoprincipal
                    _('txtnombretelacliente_telaprincipal').value = nombretela;

                    //appNewSDT.fn_change_chknoexistebddesarrollotela(false);
                    //appNewSDT.set_chk_icheck('_clscheck_noexistebddesarrollotela', false);

                    $("#modal__BuscarDesarrollo").modal('hide');

                    return true;
                }
            });

            if (hayseleccionados === false) {
                _swal({ estado: 'error', mensaje: 'Falta seleccionar el desarrollo...!' });
                return false;
            }
        }

        function llenartabla(odata, indice) {
            let html = '', tbody = _('tbody_desarrollo');

            if (indice == undefined) {
                indice = 0;
            }

            /* :edu inicio funcionalidad de paginacion*/
            //oUtil.adata = odata;
            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `
                                <tr data-par='idsolicituddesarrollotela:${odata[i].idsolicituddesarrollotela},nombretela:${odata[i].nombretela},idcliente:${odata[i].idcliente},idclientetemporada:${odata[i].idclientetemporada}'>
                                    <td class='hide'><input type='checkbox' class='_cls_chk_selected' /></td>
                                    <td>${odata[i].idsolicituddesarrollotela}</td>
                                    <td>${odata[i].nombrecliente}</td>
                                    <td>${odata[i].nombretela}</td>
                                    <td>${odata[i].codigo}</td>
                                </tr>
                        `;
                    }
                }
                //odata.forEach((x) => {
                //    html += `
                //                <tr data-par='idsolicituddesarrollotela:${x.idsolicituddesarrollotela},nombretela:${x.nombretela},idcliente:${x.idcliente},idclientetemporada:${x.idclientetemporada}'>
                //                    <td class='hide'><input type='checkbox' class='_cls_chk_selected' /></td>
                //                    <td>${x.idsolicituddesarrollotela}</td>
                //                    <td>${x.nombrecliente}</td>
                //                    <td>${x.nombretela}</td>
                //                    <td>${x.codigo}</td>
                //                </tr>
                //    `;
                //});
                tbody.innerHTML = html;
                let htmlfoot = page_result(odata, indice);
                _('foot_paginacion').innerHTML = page_result(odata, indice);
                handler_tbl_ini();
            } else {
                tbody.innerHTML = '';
            }

        }

        function handler_tbl_ini() {
            let tbody = _('tbody_desarrollo'), arr_rows = Array.from(tbody.rows);
            arr_rows.forEach((x) => {
                x.addEventListener('click', fn_seleccionar_fila, false)
            });
        }

        function fn_seleccionar_fila(e) {
            let tbody = _('tbody_desarrollo'), arr_rows = Array.from(tbody.rows), fila = e.currentTarget;
            arr_rows.forEach(x => {
                x.getElementsByClassName('_cls_chk_selected')[0].checked = false;
                x.bgColor = "white";
            });

            fila.getElementsByClassName('_cls_chk_selected')[0].checked = true;
            fila.bgColor = "#ccd1d9";
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
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarReferenciaComplemento.paginar(-1, appBuscarReferenciaComplemento.llenartabla);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarReferenciaComplemento.paginar(-2, appBuscarReferenciaComplemento.llenartabla);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appBuscarReferenciaComplemento.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarReferenciaComplemento.llenartabla);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarReferenciaComplemento.paginar(-3, appBuscarReferenciaComplemento.llenartabla);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarReferenciaComplemento.paginar(-4, appBuscarReferenciaComplemento.llenartabla);' > >> </a></li>";
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
            oUtil.indiceactualpagina = 0;
            oUtil.indiceactualbloque = 0;
            if (adata.length > 0) {
                var fields = _('panelencabezado_buscardesarrollo').getElementsByClassName(fields_input);
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
            var filters = _('panelencabezado_buscardesarrollo').getElementsByClassName(name_filter);
            var nfilters = filters.length, filter = {};

            for (let i = 0; i < nfilters; i++) {
                filter = filters[i];
                if (filter.type == "text") {
                    filter.value = '';
                    filter.onkeyup = function () {
                        oUtil.adataresult = event_header_filter(name_filter);
                        //pintartablaindex(oUtil.adataresult, 0); //:desactivate                
                        llenartabla(oUtil.adataresult, oUtil.indiceactualpagina);
                    }
                }
            }
        }
        /* : FIN*/

        function req_ini() {
            //par = { codigotelacliente: ovariables.codigotelacliente }
            let par = { codigotelacliente: '' },
                url = 'DesarrolloTextil/SolicitudDesarrolloTela/Get_DesarrolloTela_PaReferenciaComplemento?par=' + JSON.stringify(par);

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    oUtil.adata = odata;
                    oUtil.adataresult = oUtil.adata;
                    llenartabla(odata);
                });
        }

        return {
            load: load,
            req_ini: req_ini,
            llenartabla: llenartabla,
            paginar: paginar
        }
    }
)(_('panelencabezado_buscardesarrollo'), 'panelencabezado_buscardesarrollo');

(
    function init() {
        appBuscarReferenciaComplemento.load();
        appBuscarReferenciaComplemento.req_ini();
    }
)();
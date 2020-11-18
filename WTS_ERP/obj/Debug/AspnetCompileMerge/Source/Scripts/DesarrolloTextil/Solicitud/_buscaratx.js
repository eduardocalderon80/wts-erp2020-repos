var appBuscarAtx = (
        function (d, idpadre) {
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
                _('_btnbuscaratx').addEventListener('click', fn_buscaratx_modal, false);

                $('#div_grupofechainicio .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                    let fecha = e.target.value;
                    $('#txtfechainicio_buscadoratx').val(fecha).datepicker('update');
                });

                $('#div_grupofechafin .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
                    let fecha = e.target.value;
                    $('#txtfechafin_buscadoratx').val(fecha).datepicker('update');
                });

                //fechainicio = fechainicio !== '' ? _convertANSItoMMDDYYYY(fechainicio) : '';
                //fechafin = fechafin !== '' ? _convertANSItoMMDDYYYY(fechafin) : '';

                //if (fechainicio !== '') {
                //    $('#div_grupofechainicio .input-group.date').datepicker('update', fechainicio);
                //}
                //if (fechafin !== '') {
                //    $('#div_grupofechafin .input-group.date').datepicker('update', fechafin);
                //}
            }

            function err(__err){
                console.log('err', __err);
            }

            function fn_buscaratx_modal() {
                let req = _required({ clase: '_enty', id: 'panelencabezado_buscaratx' });

                let fechainicio = _convertDate_ANSI(_('txtfechainicio_buscadoratx').value), fechafin = _convertDate_ANSI(_('txtfechafin_buscadoratx').value),
                                cboproveedor = _('_cboproveedor_filtrobuscador'), cbocliente = _('_cbocliente_filtrobuscador'),
                                idproveedor = cboproveedor.value, idcliente = cbocliente.value, proveedor = cboproveedor.selectedIndex > 0 ? cboproveedor.options[cboproveedor.selectedIndex].text : '',
                                cliente = cbocliente.selectedIndex > 0 ? cbocliente.options[cbocliente.selectedIndex].text : '';
                let parametro = {
                    idproveedor: idproveedor, idcliente: idcliente, fechainicio: fechainicio, fechafin: fechafin, conrangofecha: 'si', proveedor: proveedor, cliente: cliente,
                    label_fechainicio: _convertANSItoMMDDYYYY(fechainicio), label_fechafin: _convertANSItoMMDDYYYY(fechafin)
                };

                if (req) {
                    let url = 'DesarrolloTextil/Solicitud/GetBuscarAtx?par=' + JSON.stringify(parametro);
                    //limpiar_filtros_tbl();
                    _Get(url)
                        .then((odata) => {
                            let data = odata !== '' ? JSON.parse(odata) : null;
                            if (data !== null) {
                                let atx = data[0].atx !== '' ? CSVtoJSON(data[0].atx) : null;
                                oUtil.adata = atx;
                                oUtil.adataresult = oUtil.adata;

                                pintartablaindex(atx);
                            } else {
                                //_swal({ mensaje: 'No se encontraron registros', estado: 'error' });
                                let tbody = _('tbody_buscaratx');
                                tbody.innerHTML = '';
                                swal({
                                    title: '',
                                    text: 'No se encontraron registros',
                                    type: 'warning'
                                });
                            }

                            //pintar_label_filtro(_param);
                        })
                        .catch((e) => {
                            err(e);
                        });
                }
            }

            function req_ini() {
                let parametro = { fechainicio: '', fechafin: '', conrangofecha: 'no' };

                //_Get('DesarrolloTextil/Solicitud/GetBuscarAtx?par=' + JSON.stringify(parametro), true)
                _Get('DesarrolloTextil/Solicitud/GetLoadIni_BuscarAtx?par=' + JSON.stringify(parametro), true)
                    .then((adata) => {
                        let rpta = adata !== '' ? JSON.parse(adata) : null;
                        if (rpta !== null) {
                            res_ini(rpta);
                            //let atx = rpta[0].atx !== '' ? CSVtoJSON(rpta[0].atx) : null;
                            //if (atx !== null) {
                            //    pintartablaindex(atx);
                            //}
                        }
                    }, (p) => { err(p) });
            }

            function pintartablaindex(data) {
                let tbody = _('tbody_buscaratx'), html = '';
                if (data !== null) {
                    data.forEach(x => {
                        html += `
                            <tr>
                                <td>${x.codigo}</td>
                                <td></td>
                                <td>${x.codigotela}</td>
                                <td>${x.codigolaboratorio}</td>
                                <td>${x.fechaactualizacion}</td>
                                <td>${x.nombrecliente}</td>
                                <td>${x.nombrefamilia}</td>
                                <td>${x.codigofabrica}</td>
                                <td>${x.nombresolicitante}</td>
                                <td>${x.nombreoperador}</td>
                                <td>${x.partidalote}</td>
                                <td>${x.anchoabiertoutil}</td>
                                <td>${x.nombregalga}</td>
                                <td>${x.diametro}</td>
                                <td>${x.densidad}</td>
                                <td>${x.lavado}</td>
                                <td>${x.titulo}</td>
                                <td>${x.descripcionporcentajecontenidotela}</td>
                                <td>${x.columnasporpulgada}</td>
                                <td>${x.cursasporpulgada}</td>
                                <td>${x.nombreproveedor}</td>
                                <td>${x.idsolicitud}</td>
                                <td>${x.nombrecomercial}</td>
                            </tr>
                        `;
                    });
                }
                
                tbody.innerHTML = html;
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
                        contenido += "<li data-indice='-1'> <a onclick='appBuscadorAtx.paginar(-1, appBuscadorAtx.pintartablaindex);' > << </a></li>";
                        contenido += "<li data-indice='-2'> <a onclick='appBuscadorAtx.paginar(-2, appBuscadorAtx.pintartablaindex);' > < </a></li>";
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
                            contenido += `<a class='${clsactivo}' onclick='appBuscadorAtx.paginar(`;
                            contenido += i.toString();
                            contenido += `, appBuscadorAtx.pintartablaindex);'>`;
                            contenido += (i + 1).toString();
                            contenido += `</a>`;
                            contenido += `</li>`;
                        }
                        else break;
                    }
                    if (oUtil.indiceactualbloque < indiceultimobloque) {
                        contenido += "<li data-indice='-3'> <a onclick='appBuscadorAtx.paginar(-3, appBuscadorAtx.pintartablaindex);' > > </a></li>";
                        contenido += "<li data-indice='-4'> <a onclick='appBuscadorAtx.paginar(-4, appBuscadorAtx.pintartablaindex);' > >> </a></li>";
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

            function res_ini(odata) {
                let proveedor = CSVtoJSON(odata[0].proveedor), cliente = CSVtoJSON(odata[0].cliente), atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null;
                _('_cboproveedor_filtrobuscador').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(proveedor, 'idproveedor', 'nombreproveedor');
                _('_cbocliente_filtrobuscador').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cliente, 'idcliente', 'nombrecliente');

                //_('_cboproveedor_filtrobuscador').value = idproveedor !== '' ? idproveedor : '';
                //_('_cbocliente_filtrobuscador').value = idcliente !== '' ? idcliente : '';

                oUtil.adata = atx;
                oUtil.adataresult = oUtil.adata;
                if (atx !== null) {
                    pintartablaindex(atx);
                }
            }

            return {
                load: load,
                req_ini: req_ini
            }
        }
    )(document, 'panelencabezado_buscaratx');

    (
        function ini() {
            appBuscarAtx.load();
            appBuscarAtx.req_ini();
        }
    )();
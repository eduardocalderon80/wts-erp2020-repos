var appBuscarAtxEstandar = (
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
            _('_btnAceptar_buscaratxestandar').addEventListener('click', fn_aceptar, false);
      
        }

        var err_xhr = (err) => { console.log('err', err); }

        function fn_aceptar() {
            let tbody = _('tbody_buscaratxestandar'), arr_rows = Array.from(tbody.rows), codigoatx = '', hayseleccionados = false, idsolicituddesarrollotela = '',
                idsolicituddetalledesarrollotela = '', idcliente = '', anio = '', contador = '', escomplemento = '',
                nombretelacliente_padre = '', nombretelacliente_complemento = '', proveedortela = '', requiereanalisislaboratorio = '';
            arr_rows.some(x => {
                if (x.getElementsByClassName('_cls_chk_atxestandar')[0].checked === true) {
                    hayseleccionados = true;
                    let par = x.getAttribute('data-par');
                    codigoatx = _par(par, 'codigo');
                    idsolicituddesarrollotela = _par(par, 'idsolicituddesarrollotela');
                    idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela');
                    idcliente = _par(par, 'idcliente');
                    anio = _par(par, 'anio');
                    contador = _par(par, 'contador');
                    escomplemento = _par(par, 'escomplemento');
                    nombretelacliente_padre = x.getElementsByClassName('_cls_nombretelacliente_padre')[0].innerText + ' - ' + idsolicituddesarrollotela; //// SE HACE ESTO POR QUE EN EL COMPLEMENTO YA VIENE CON EL IDSOLICITUD DESARROLLOTELA
                    nombretelacliente_complemento = x.getElementsByClassName('_cls_nombretelacliente_complemento')[0].innerText;
                    proveedortela = _par(par, 'proveedortela');
                    requiereanalisislaboratorio = _par(par, 'requiereanalisis');
                    return true;
                }
            });

            if (hayseleccionados === false) {
                _swal({ mensaje: 'Falta seleccionar el Atx', estado: 'error' });
                return false;
            }

            _('txtanio_atx_estandar').value = anio;
            _('txtcontador_atx_estandar').value = contador; //numero;
            _('txtcodigoreporteatxestandar').value = codigoatx;
            _('hf_idsolicituddesarrollotela').value = idsolicituddesarrollotela;
            _('hf_idsolicituddetalledesarrollotela').value = idsolicituddetalledesarrollotela;
            _('cboCliente').value = idcliente;
            _('txtProveedorFabrica').value = proveedortela;
            if (escomplemento === '1') {
                _('txtsolicituddesarrollotela').value = nombretelacliente_complemento;
            } else {
                _('txtsolicituddesarrollotela').value = nombretelacliente_padre;
            }
            _('hf_escomplemento').value = escomplemento;
            if (requiereanalisislaboratorio === '1') {
                appNewSolicitudAtx.fn_set_checked_requiereanalisislaboratorio(true, 'div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
            } else {
                appNewSolicitudAtx.fn_set_checked_requiereanalisislaboratorio(false, 'div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
            }
            
            $("#modal__BuscarAtxEstandar").modal('hide');
        }

        function res_ini(odata) {
            //// LO COMENTE PARA LA ADECUACION DE ATX SIN SDT
            //if (odata !== null) {
            //    pintartablaindex(odata);
            //}

            oUtil.adata = odata;
            oUtil.adataresult = oUtil.adata;
            if (odata !== null) {
                pintartablaindex(odata);
            }
        }

        function pintartablaindex(odata, indice) {
            //// LO COMENTE PARA LA ADECUACION DE ATX SIN SDT
            //if (odata !== null) {
            //    let tbody = _('tbody_buscaratxestandar'), html = '';
            //    odata.forEach(x => {
            //        html += `<tr data-par='codigo:${x.codigo},idsolicitud:${x.idsolicitud},idsolicituddesarrollotela:${x.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${x.idsolicituddetalledesarrollotela},idcliente:${x.idcliente},anio:${x.anio},contador:${x.contador},escomplemento:${x.escomplemento},proveedortela:${x.proveedortela},requiereanalisis:${x.requiereanalisis}'>
            //                    <td class ='hide'><input type="checkbox" class ="_cls_chk_atxestandar" name="_chkatxestandar" /></td>
            //                    <td class='_cls_idsolicituddesarrollotela'>${x.idsolicituddesarrollotela}</td>
            //                    <td>${x.codigo}</td>
            //                    <td class='_cls_nombretelacliente_padre'>${x.nombretela}</td>
            //                    <td class='_cls_nombretelacliente_complemento'>${x.nombretelacliente_complemento}</td>
            //                    <td>${x.descripcionporcentajecontenidotela}</td>
            //                    <td>${x.nombrecliente}</td>
            //                    <td>${x.nombreproveedor}</td>
            //                </tr>
            //            `;
            //    });
            //    tbody.innerHTML = html;
            //    handler_tbl_ini();
            //}

            //// YA QUE EL ATX SE PASA SIN SDT SE HACE TEMPORALMENTE PARA BUSCAR LOS ATX SIN SDT
            let tbody = _('tbody_buscaratxestandar'), html = '';

            if (indice == undefined) {
                indice = 0;
            }

            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        //// hide_por_atx_sin_sdt
                        html += `<tr data-par='codigo:${odata[i].codigo},idsolicitud:${odata[i].idsolicitud},idsolicituddesarrollotela:${odata[i].idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${odata[i].idsolicituddetalledesarrollotela},idcliente:${odata[i].idcliente},anio:${odata[i].anio},contador:${odata[i].contador},escomplemento:${odata[i].escomplemento},proveedortela:${odata[i].proveedortela},requiereanalisis:${odata[i].requiereanalisis}'>
                                <td class ='hide'><input type="checkbox" class ="_cls_chk_atxestandar" name="_chkatxestandar" /></td>
                                <td class='_cls_idsolicituddesarrollotela hide hide_por_atx_sin_sdt'>${odata[i].idsolicituddesarrollotela}</td>
                                <td>${odata[i].codigo}</td>
                                <td class='_cls_nombretelacliente_padre hide hide_por_atx_sin_sdt'>${odata[i].nombretela}</td>
                                <td class='_cls_nombretelacliente_complemento hide hide_por_atx_sin_sdt'>${odata[i].nombretelacliente_complemento}</td>
                                <td>${odata[i].descripcionporcentajecontenidotela}</td>
                                <td>${odata[i].nombrecliente}</td>
                                <td class='hide hide_por_atx_sin_sdt'>${odata[i].nombreproveedor}</td>
                            </tr>
                        `;
                    }
                }

                tbody.innerHTML = html;
                _('foot_paginacion').innerHTML = page_result(odata, indice);
                handler_tbl_ini();
            }
        }

        function handler_tbl_ini() {
            let tbody = _('tbody_buscaratxestandar'), arr_rows = Array.from(tbody.rows);
            arr_rows.forEach((x) => {
                x.addEventListener('click', fn_seleccionar_fila, false)
            });
        }

        function fn_seleccionar_fila(e) {
            let tbody = _('tbody_buscaratxestandar'), arr_rows = Array.from(tbody.rows), fila = e.currentTarget;
            arr_rows.forEach(x => {
                x.getElementsByClassName('_cls_chk_atxestandar')[0].checked = false;
                x.bgColor = "white";
            });

            fila.getElementsByClassName('_cls_chk_atxestandar')[0].checked = true;
            fila.bgColor = "#ccd1d9";
        }

        //// ESTE CAMBIO ES PARA LA ADECUACION DE ATX SIN SDT
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
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarAtxEstandar.paginar(-1, appBuscarAtxEstandar.pintartablaindex);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarAtxEstandar.paginar(-2, appBuscarAtxEstandar.pintartablaindex);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appBuscarAtxEstandar.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarAtxEstandar.pintartablaindex);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarAtxEstandar.paginar(-3, appBuscarAtxEstandar.pintartablaindex);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarAtxEstandar.paginar(-4, appBuscarAtxEstandar.pintartablaindex);' > >> </a></li>";
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
            oUtil.indiceactualpagina = 0;
            oUtil.indiceactualbloque = 0;
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

        function req_ini() {

            let parametro = { xd: 1 }, url = 'DesarrolloTextil/Solicitud/GetData_SolicitudDesarrolloTela_AtxEstandar?par=' + JSON.stringify(parametro);
            _Get(url)
                .then((result) => {
                    //// LO COMENTE PARA LA ADECUACION DE ATX SIN SDT
                    //let rpta = result !== '' ? CSVtoJSON(result) : null;
                    //res_ini(rpta);

                    let odata = result !== '' ? CSVtoJSON(result) : null;
                    if (odata !== null) {
                        //// PINTAR TABLA 
                        res_ini(odata);
                    }
                })
                .catch((e) => { err_xhr(e); });
        }

        return {
            load: load,
            req_ini: req_ini,
            pintartablaindex: pintartablaindex,
            paginar: paginar
        }
    }
)(document, 'panelencabezado_buscaratxestandar');

(
    function () {
        appBuscarAtxEstandar.load();
        appBuscarAtxEstandar.req_ini();
    }
)();
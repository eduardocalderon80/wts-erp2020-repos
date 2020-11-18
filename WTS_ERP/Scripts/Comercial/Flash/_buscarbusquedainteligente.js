var appBuscarBusquedaInteligenteFlashCost = (
    function (d, idpadre) {
        var ovariables = {
            lstunidadmedida: []
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
            _('_btnAceptar_busquedainteligenteflashcost').addEventListener('click', fn_aceptar, false);
        }

        function fn_aceptar(e) {
            let tbody = _('tbody_busquedainteligenteflashcost'), checked = tbody.getElementsByClassName('checked')[0];

            if (checked !== null && checked !== undefined) {

                let divobj = checked.parentNode;
                let _id = divobj.id;
                let atx = _('atx_' + _id).innerHTML;
                let estructura = _('estructura_' + _id).innerHTML;
                let cod_tela = _('cod_tela_' + _id).innerHTML;
                let cost = _('cost_' + _id).innerHTML;
                let unid_cost = _('unid_cost_' + _id).innerHTML;
                let densidad = _('densidad_' + _id).innerHTML;
                let ancho = _('ancho_' + _id).innerHTML;
                let cbo_ancho = _('cbo_ancho_' + _id).value;
                let content = _('content_' + _id).innerHTML;
                let wash = _('wash_' + _id).innerHTML;
                let stock = _('stock_' + _id).innerHTML;
                let tenido = _('tenido_' + _id).innerHTML;
                let comentario = _('comentario_' + _id).innerHTML;

                let objTela = {
                    atx: atx,
                    cod_tela: cod_tela,
                    estructura : estructura,
                    costo : cost,
                    unid_cost : unid_cost,
                    peso : densidad,
                    ancho : ancho,
                    unicosto : cbo_ancho,
                    content : content,
                    wash : wash,
                    stock : stock,
                    tenido : tenido,
                    observa : comentario
                }

                appNewFlash.llenarDatosFabric(objTela);
                $("#modal__BuscarBusquedaInteligente").modal("hide");
                let fila = checked.parentNode.parentNode.parentNode.parentNode.parentNode;

            } else {
                _swal({ mensaje: 'Seleccione una tela', estado: 'error' });
                return false;
            }
        }

        function pintartablaindex(odata, indice) {
            let html = '';

            if (indice == undefined) {
                indice = 0;
            }

            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        //junior
                        html += `
                            <tr id="${odata[i].idanalisistextil}" data-par='idanalisistextil:${odata[i].idanalisistextil},idunidadmedida:${odata[i].idunidadmedida}'>
                                <td class='text-center'>
                                    <div class="i-checks _group_1 _group_check_tbl">
                                        <label class=""> <div id="${odata[i].idanalisistextil}" class="iradio_square-green" style="position: relative;"><input type="radio" class="_clschk_buscar_tbl" name="name_chk_buscar" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> <i></i></label>
                                    </div>
                                </td>
                                <td id="cod_tela_${odata[i].idanalisistextil}" >${odata[i].codigotela}</td>
                                <td id="atx_${odata[i].idanalisistextil}" >${odata[i].codigo}</td>
                                <td id="estructura_${odata[i].idanalisistextil}" >${odata[i].nombrefamilia}</td>
                                <td id="cost_${odata[i].idanalisistextil}" ></td>
                                <td id="unid_cost_${odata[i].idanalisistextil}" ></td>
                                <td id="densidad_${odata[i].idanalisistextil}" >${odata[i].densidad}</td>
                                <td >gr/m2</td>
                                <td id="ancho_${odata[i].idanalisistextil}" >${odata[i].anchoabiertoutil}</td>
                                <td>
                                    <select id="cbo_ancho_${odata[i].idanalisistextil}"  class='form-control _cls_unidadmedida' data-idunidadmedida='${odata[i].idunidadmedida}'></select>
                                </td>
                                <td id="content_${odata[i].idanalisistextil}">${odata[i].descripcionporcentajecontenidotela}</td>
                                <td id="wash_${odata[i].idanalisistextil}">${odata[i].tipoancho}</td>
                                <td id="stock_${odata[i].idanalisistextil}">0</td>
                                <td id="tenido_${odata[i].idanalisistextil}">${odata[i].nombretipotenido}</td>
                                <td id="comentario_${odata[i].idanalisistextil}">${odata[i].comentario}</td>
                            </tr>
                        `;
                    }
                }

                //odata.forEach(x => {
                //    html += `
                //        <tr data-par='idanalisistextil:${x.idanalisistextil},idunidadmedida:${x.idunidadmedida}'>
                //            <td class='text-center'>
                //                <div class="i-checks _group_1 _group_check_tbl">
                //                    <label class=""> <div class="iradio_square-green" style="position: relative;"><input type="radio" class="_clschk_buscar_tbl" checked="checked" name="name_chk_buscar" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> <i></i></label>
                //                </div>
                //            </td>
                //            <td>${x.codigotela}</td>
                //            <td>${x.nombrefamilia}</td>
                //            <td></td>
                //            <td></td>
                //            <td>${x.densidad}</td>
                //            <td></td>
                //            <td>${x.anchoabiertoutil}</td>
                //            <td>
                //                <select class='form-control _cls_unidadmedida' data-idunidadmedida='${x.idunidadmedida}'></select>
                //            </td>
                //            <td>${x.descripcionporcentajecontenidotela}</td>
                //            <td>${x.tipoancho}</td>
                //            <td>0</td>
                //            <td>${x.nombretipotenido}</td>
                //            <td>${x.comentario}</td>
                //        </tr>
                //    `;
                //});
                
                _('tbody_busquedainteligenteflashcost').innerHTML = html;
                _('foot_paginacion').innerHTML = page_result(odata, indice);
                llenar_combos_tbl();
                handler_tbl();
            }
        }

        function llenar_combos_tbl() {
            let tbody = _('tbody_busquedainteligenteflashcost'), arr_cmb_unidadmedida = Array.from(tbody.getElementsByClassName('_cls_unidadmedida'));

            arr_cmb_unidadmedida.forEach(x => {
                let idunidadmedida = x.getAttribute('data-idunidadmedida');
                x.innerHTML = _comboFromJSON(ovariables.lstunidadmedida, 'idunidadmedida', 'nombreunidadmedida');
                if (idunidadmedida.trim() !== '') {
                    x.value = idunidadmedida;
                }
            });
        }

        function handler_tbl() {
            // RADIO BUTTON
            $('.i-checks._group_check_tbl').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                
            });
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
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarBusquedaInteligenteFlashCost.paginar(-1, appBuscarBusquedaInteligenteFlashCost.pintartablaindex);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarBusquedaInteligenteFlashCost.paginar(-2, appBuscarBusquedaInteligenteFlashCost.pintartablaindex);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appBuscarBusquedaInteligenteFlashCost.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarBusquedaInteligenteFlashCost.pintartablaindex);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarBusquedaInteligenteFlashCost.paginar(-3, appBuscarBusquedaInteligenteFlashCost.pintartablaindex);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarBusquedaInteligenteFlashCost.paginar(-4, appBuscarBusquedaInteligenteFlashCost.pintartablaindex);' > >> </a></li>";
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

        function res_ini(odata) {
            oUtil.adata = odata;
            oUtil.adataresult = oUtil.adata;
            if (odata !== null) {
                pintartablaindex(odata);
            }
        }

        function req_ini() {
            let par = _('txtpar_busquedainteligenteflashcost').value, parjson = _parameterUncodeJSON(par),
                url = 'Comercial/Flash/GetFiltroTelaFlashCost?par=' + parjson;

            _Get(url, true)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata !== null) {
                        ovariables.lstunidadmedida = odata[0].unidadmedida !== '' ? CSVtoJSON(odata[0].unidadmedida) : [];
                        //// PINTAR TABLA 
                        let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null;
                        if (atx !== null) {
                            res_ini(atx);
                        }
                    }
                });
        }

        return {
            load: load,
            req_ini: req_ini,
            pintartablaindex: pintartablaindex,
            paginar: paginar
        }
    }
)(document, 'panelencabezado_busquedainteligenteflashcost');

(
    function init() {
        appBuscarBusquedaInteligenteFlashCost.load();
        appBuscarBusquedaInteligenteFlashCost.req_ini();
    }
)();
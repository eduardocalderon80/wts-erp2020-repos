var appBuscarFacturaBol = (
    function (d, idpadre) {
    var ovariables_FacturaBolt = {
        arrtipoDoc: '',
        arrnroDoc: '',
        adata: [],
        adataresult: []
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
         $('#filearchivo').on('change', changeFile);
         _('btneliminararchivo').addEventListener('click', EliminarArchivo); 
         _('btnGuardararchivo').addEventListener('click', guardarArchivoResumen);
        $(".select_document").select2({
            placeholder: "Select Document",
            allowClear: false
        }); 

        _('btnnew').addEventListener('click', req_new);
        _('btnnew').addEventListener('click', req_new);
        d.getElementById('span_filtro').addEventListener('click', buscarFacturaPoBol);
        filter_header();
    }

    function req_ini() {
        let urlaccion = 'Facturacion/FacturaBolt/BoltFiltro_List';
        Get(urlaccion, res_ini);
        buscarFacturaPoBol();
  
    }

    function res_ini(response) {
        let orpta = response != null ? response.split('¬') : null;
        if (orpta != null) {
            if (JSON.parse(orpta[0] != '')) { ovariables_FacturaBolt.arrtipoDoc = JSON.parse(orpta[0]); }   
            load_tipo();        
        }
    }

    function load_tipo() {
        let arrtipo = ovariables_FacturaBolt.arrtipoDoc ;
        let cbotipo = ``;

        if (arrtipo.length > 0) {
            arrtipo.forEach(x => { cbotipo += `<option value ='${x.IdTipoDoc}'>${x.NombreDoc}</option>`; });
        }
        _('cboTipoDoc').innerHTML = cbotipo;
        //$("#cboTipoDoc").select2("val", "0");
    }


        function req_new() {
  
            let urlaccion = 'Facturacion/FacturaBolt/New';
            let urljs = 'Facturacion/FacturaBolt/New';            
            let parametro = `0`;
             _Go_Url(urlaccion, urljs, parametro);
        }

        function buscarFacturaPoBol() {

            let tipodocumento = _('cboTipoDoc').value;
            let nrodocumento = _('txtnrodoc').value;
            let par = { TipoDocumento: tipodocumento, NroDocumento: nrodocumento },
                url = 'Facturacion/FacturaBolt/Get_FacturaPoBolList?par=' + JSON.stringify(par);

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    oUtil.adata = odata;
                    oUtil.adataresult = oUtil.adata;
                    llenartabla(odata);
                });
        }

        function changeFile(e) {
            let archivo = this.value;
            let ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            ext = ext.toLowerCase();
            let nombre = e.target.files[0].name, html = '';
            let file = e.target.files;
            _('txtArchivoSeleccionado').value = nombre;

            if (ext === 'txt' || ext === 'csv') {
                document.getElementById('btnGuardararchivo').style.display = "";
                document.getElementById('btneliminararchivo').style.display = "";
                document.getElementById('btncargar').style.display = "none";
            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Formato incorrecto!!'
                });
                EliminarArchivo();
            }

        }

        function EliminarArchivo() {
            $('#filearchivo').val('');
            $('#txtArchivoSeleccionado').val('');
            document.getElementById('btnGuardararchivo').style.display = "none";
            document.getElementById('btneliminararchivo').style.display = "none";
            document.getElementById('btncargar').style.display = "";
        }

        function guardarArchivoResumen() {
            let form = new FormData();
            let urlaccion = 'Facturacion/FacturaBolt/Save_FileResumen';
            form.append("filearchivo", $("#filearchivo")[0].files[0]);

            _Post(urlaccion, form,true)
                .then((rpta) => {
                   
                    if (rpta === '1') {

                        swal({
                            title: 'Message',
                            text: "Archivo de resumen se guardo con exito !!!",
                            type: 'success'
                        })

                        EliminarArchivo();

                    } else {
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Error!!'
                        })
                    }
                }, (p) => {
                    err(p);
                });

        }


        function llenartabla(odata, indice) {
            let html = '';
            let tbody = _('tbody_bolList');

            if (indice == undefined) {
                indice = 0;
            }

            /* funcionalidad de paginacion*/
          
            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;           

            if (odata !== null) {

                let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;
                let styleTD = 'style="width:10%;text-align:center"';

                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `
                                <tr data-par='CodigoBol:${odata[i].CodigoBol}}'>
                                <td class='hide'><input type='checkbox' class='_cls_chk_selected' /></td>                                       
                                <td class='text-center' style='vertical-align: middle;'>
                                    <button type='button' class='btn btn-xs btn-primary cls_edit_FacturaBol' data-idFacturaBol='${odata[i].CodigoBol}' title='editar'>
                                        <span class='fa fa-edit'></span>
                                    </button>
                                </td>
                                <td ${styleTD} >${odata[i].CodigoBol}</td>
                                <td >${odata[i].FechaCrea}</td>
                                <td ${styleTD} >${odata[i].Total}</td>
                                <td ${styleTD} >${odata[i].Enviado}</td>    
                                <td ${styleTD} >${odata[i].Correcto}</td>    
                                <td ${styleTD} >${odata[i].Rechazado}</td>    
                                <td ${styleTD} >${odata[i].Pendiente}</td>    
                                <td ${styleTD} >${odata[i].Expirado}</td>    
                                </tr>
                                `;
                    }
                }

                tbody.innerHTML = html;
                let htmlfoot = page_result(odata, indice);
                _('foot_paginacion').innerHTML = page_result(odata, indice);
         
            } else {
                tbody.innerHTML = '';
            }

            handler_tbl();

        }

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
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarFacturaBol.paginar(-1, appBuscarFacturaBol.llenartabla);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarFacturaBol.paginar(-2, appBuscarFacturaBol.llenartabla);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appBuscarFacturaBol.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarFacturaBol.llenartabla);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarFacturaBol.paginar(-3, appBuscarFacturaBol.llenartabla);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarFacturaBol.paginar(-4, appBuscarFacturaBol.llenartabla);' > >> </a></li>";
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
            var fields = _('panelencabezado_buscarBol').getElementsByClassName(fields_input);
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
                                    _y = adata[i][field].indexOf(value);
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
        var filters = _('panelencabezado_buscarBol').getElementsByClassName(name_filter);
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

        function handler_tbl() {
            let tbody = _('tbody_bolList');
            let arr = Array.from(tbody.rows);
            if (tbody.rows.length > 0) {
                arr.forEach(x => {
                    let btnedit = x.getElementsByClassName('cls_edit_FacturaBol')[0];
                    btnedit.addEventListener('click', fn_edit_facturaBol, false);
                });
            }
        }

        function fn_edit_facturaBol(e) {
            let o = e.currentTarget;
            let idfacturaBol = o.getAttribute('data-idFacturaBol'),
                parametro = `${idfacturaBol}`,
                url = 'Facturacion/FacturaBolt/New';
            _Go_Url(url, url, parametro);          
        }

        return {
            load: load,
            req_ini: req_ini,
            llenartabla: llenartabla,
            paginar: paginar
        }

    }

)(document, 'panelencabezado_buscarBol');
(function ini() {
    appBuscarFacturaBol.load();
    appBuscarFacturaBol.req_ini();
})()
var appBuscadorAtx = (
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
            //_('btnfiltro_buscadoratx').addEventListener('click', fn_abrir_filtrobuscadoratx, false);
            _('btn_BuscarATX').addEventListener('click', fn_BuscarATX); // Jacob

            $('.date-es').eq(0).datepicker('setDate', moment().subtract(1, 'months').format('MM/DD/YYYY'));
            $('.date-es').eq(1).datepicker('setDate', moment().format('MM/DD/YYYY'));

            req_GetDataCombos(); // Jacob
        }

        function err(__err) {
            console.log('err', __err);
        }

        function req_ini() {
            let parametro = {
                fechainicio: _convertDate_ANSI(_('txtFechaInicio').value), // Jacob
                fechafin: _convertDate_ANSI(_('txtFechaFin').value), // Jacob
                idproveedor: _('cboproveedor').value !== '' ? _('cboproveedor').value : 0, // Jacob
                idcliente: _('cbocliente').value !== '' ? _('cbocliente').value : 0, // Jacob
                conrangofecha: 'si'
            };
            $('#myModalSpinner').modal('show');
            _Get('DesarrolloTextil/Solicitud/GetBuscarAtx?par=' + JSON.stringify(parametro), true)
                .then((adata) => {
                    $('#myModalSpinner').modal('hide');
                    let rpta = adata !== '' ? JSON.parse(adata) : null, param = {};
                    if (rpta !== null) {
                        let atx = rpta[0].atx !== '' ? CSVtoJSON(rpta[0].atx) : [], filtro = CSVtoJSON(rpta[0].filtro_default);
                        oUtil.adata = atx;
                        oUtil.adataresult = oUtil.adata;
                        //pintartablaindex(atx);
                        fn_CrearTablaBuscarATX(atx);
                        param.proveedor = '';
                        param.cliente = '';
                        param.label_fechainicio = filtro[0].fechainicio;
                        param.label_fechafin = filtro[0].fechafin;
                    } else {
                        param.proveedor = '';
                        param.cliente = '';
                        param.label_fechainicio = '';
                        param.label_fechafin = '';
                    }

                    //pintar_label_filtro(param);
                }, (p) => { err(p) });
        }

        // Jacob
        function req_GetDataCombos() {
            _Get('DesarrolloTextil/Atx/GetData_LoadIni_BuscadorAtx')
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata !== null) {
                        let proveedor = CSVtoJSON(odata[0].proveedor), cliente = CSVtoJSON(odata[0].cliente);
                        _('cboproveedor').innerHTML = _comboItem({ value: 0, text: 'Select' }) + _comboFromJSON(proveedor, 'idproveedor', 'nombreproveedor');
                        _('cbocliente').innerHTML = _comboItem({ value: 0, text: 'Select' }) + _comboFromJSON(cliente, 'idcliente', 'nombrecliente');
                    }
                })
                .catch((e) => {
                    err(e);
                });
        }

        // Jacob 
        function fn_BuscarATX() {
            if (_isnotEmpty(_('txtFechaInicio').value) && _isnotEmpty(_('txtFechaFin').value)) {
                req_ini();
            } else {
                swal({ title: "Advertencia", text: "Los campos fecha inicio y fecha fin no pueden estar vacios", type: "warning" });
            }
        }

        function fn_CrearTablaBuscarATX(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_buscadoratx" class ="table table-bordered table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th data-width="100px">ATX Code</th>
                                <th class="no-sort" data-width="100px" data-search="false"></th>
                                <th data-width="100px">Request Number</th>
                                <th data-width="100px">Date Update</th>
                                <th data-width="100px">WTS Fabric Code</th>
                                <th data-width="100px">Testing Code</th>
                                <th data-width="100px">Tradename</th>
                                <th data-width="100px">Knit Type</th>
                                <th data-width="100px">Yarn Size</th>
                                <th data-width="100px">Content</th>
                                <th data-width="100px">Density</th>
                                <th data-width="100px">Client Name</th>   
                                <th data-width="100px">Applicant Name</th>   
                                <th data-width="100px">Operator Name</th>
                                <th data-width="100px">Cuttable Width</th>
                                <th data-width="100px">Galga</th>
                                <th data-width="100px">Diameter</th>
                                <th data-width="100px">Warp/Wales</th>
                                <th data-width="100px">Weft/Courses</th> 
                                <th data-width="100px">Supplier</th>
                                <th data-width="100px">Mill Code</th>
                                <th data-width="100px">Batch</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_buscaratx">`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                        <td>${x.codigo}</td>
                                        <td><a href='javascript:void(0)'><span class ='fa fa-file-pdf-o cls_print_atx' data-idatx='${x.idanalisistextil}' data-idsolicitud='${x.idsolicitud}' title='Print atx'></span></a></td>
                                        <td>${x.idsolicitud}</td>
                                        <td>${x.fechaactualizacion}</td>
                                        <td>${x.codigotela}</td>                                  
                                        <td>${x.codigolaboratorio}</td>
                                        <td>${x.nombrecomercial}</td>
                                        <td>${x.nombrefamilia}</td>
                                        <td>${x.titulo}</td>
                                        <td>${x.descripcionporcentajecontenidotela}</td>
                                        <td>${x.densidad}</td>
                                        <td>${x.nombrecliente}</td>
                                        <td>${x.nombresolicitante}</td>
                                        <td>${x.nombreoperador}</td>
                                        <td>${x.anchoabiertoutil}</td>
                                        <td>${x.nombregalga}</td>
                                        <td>${x.diametro}</td>
                                        <td>${x.columnasporpulgada}</td>
                                        <td>${x.cursasporpulgada}</td>
                                        <td>${x.nombreproveedor}</td>                                  
                                        <td>${x.codigofabrica}</td>
                                        <td>${x.partidalote}</td>
                                    </tr>`;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_buscaratx').innerHTML = html;
            handler_tbl();
            fn_FormatTableBuscarATX();
        }

        function fn_FormatTableBuscarATX() {
            // Crea footer
            _('tbl_buscadoratx').createTFoot();
            _('tbl_buscadoratx').tFoot.innerHTML = _('tbl_buscadoratx').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_buscadoratx tfoot th').each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                let element = $(this).data("search");
                let width = $(this).data("width");
                if (element === false) {
                    $(this).html('');
                } else {
                    $(this).html(`<input type="text" placeholder="Buscar" ${width !== undefined ? 'style="width:' + width + '"' : ''} />`);
                }
            });

            // DataTable
            var table = $('#tbl_buscadoratx').DataTable({
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar"
                },
                order: [0, 'desc'],
                info: false,
                lengthChange: false,
                pageLength: 10,
            });

            // Buscar en keyup
            table.columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });

            $("#tbl_buscadoratx tfoot tr").appendTo("#tbl_buscadoratx thead");
            $("#tbl_buscadoratx tfoot").remove();

            // Paginate in diferent div
            $("#div_tbl_buscaratx_pagination").children().remove();
            $("#tbl_buscadoratx_paginate").parent().parent().appendTo("#div_tbl_buscaratx_pagination");
            $("#tbl_buscadoratx_paginate").css({
                'text-align': 'right',
                'margin': '2px 0'
            });
            $("#tbl_buscadoratx_wrapper").css("padding", "0");

            // Hide table general search
            $('#tbl_buscadoratx_filter').hide();
        }
        // Fin

        function pintartablaindex(data, indice) {
            let tbody = _('tbody_buscaratx'), html = '';

            if (data !== null) {
                data.forEach(x => {
                    //<td class='hide'>${x.lavado}</td>
                    html += `
                                <tr>
                                    <td>${x.codigo}</td>
                                    <td><a href='javascript:void(0)'><span class ='fa fa-file-pdf-o cls_print_atx' data-idatx='${x.idanalisistextil}' data-idsolicitud='${x.idsolicitud}' title='Print atx'></span></a></td>
                                    <td>${x.idsolicitud}</td>
                                    <td>${x.fechaactualizacion}</td>
                                    <td>${x.codigotela}</td>                                  
                                    <td>${x.codigolaboratorio}</td>
                                    <td>${x.nombrecomercial}</td>
                                    <td>${x.nombrefamilia}</td>
                                    <td>${x.titulo}</td>
                                    <td>${x.descripcionporcentajecontenidotela}</td>
                                    <td>${x.densidad}</td>
                                    <td>${x.nombrecliente}</td>
                                    <td>${x.nombresolicitante}</td>
                                    <td>${x.nombreoperador}</td>
                                    <td>${x.anchoabiertoutil}</td>
                                    <td>${x.nombregalga}</td>
                                    <td>${x.diametro}</td>
                                    <td>${x.columnasporpulgada}</td>
                                    <td>${x.cursasporpulgada}</td>
                                    <td>${x.nombreproveedor}</td>                                  
                                    <td>${x.codigofabrica}</td>
                                    <td>${x.partidalote}</td>
                                </tr>
                            `;
                });
            }

            tbody.innerHTML = html;
            handler_tbl();
            //if (indice == undefined) {
            //    indice = 0;
            //}

            //let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            //let fin = inicio + oUtil.registrospagina, x = data.length;

            //if (data.length > 0) {
            //    for (let i = inicio; i < fin; i++) {
            //        if (i < x) {
            //            html += `
            //                <tr>
            //                    <td>${data[i].codigo}</td>
            //                    <td></td>
            //                    <td>${data[i].codigotela}</td>
            //                    <td>${data[i].codigolaboratorio}</td>
            //                    <td>${data[i].fechaactualizacion}</td>
            //                    <td>${data[i].nombrecliente}</td>
            //                    <td>${data[i].nombrefamilia}</td>
            //                    <td>${data[i].codigofabrica}</td>
            //                    <td>${data[i].nombresolicitante}</td>
            //                    <td>${data[i].nombreoperador}</td>
            //                    <td>${data[i].partidalote}</td>
            //                    <td>${data[i].anchoabiertoutil}</td>
            //                    <td>${data[i].nombregalga}</td>
            //                    <td>${data[i].diametro}</td>
            //                    <td>${data[i].densidad}</td>
            //                    <td>${data[i].lavado}</td>
            //                    <td>${data[i].titulo}</td>
            //                    <td>${data[i].descripcionporcentajecontenidotela}</td>
            //                    <td>${data[i].columnasporpulgada}</td>
            //                    <td>${data[i].cursasporpulgada}</td>
            //                    <td>${data[i].nombreproveedor}</td>
            //                    <td>${data[i].idsolicitud}</td>
            //                    <td>${data[i].nombrecomercial}</td>
            //                </tr>
            //            `;
            //        } else {
            //            break;
            //        }
            //    }


            //tbody.innerHTML = html;
            //_('foot_paginacion').innerHTML = page_result(data, indice);
            //}
        }

        function handler_tbl() {
            let tbody = _('tbody_buscaratx'), arr = Array.from(tbody.rows);
            arr.forEach(x => {
                let btnprint = x.getElementsByClassName('cls_print_atx')[0];
                btnprint.addEventListener('click', fn_print_atx, false);
            });
        }

        function fn_print_atx(e) {
            let o = e.currentTarget, idatx = o.getAttribute('data-idatx'), idsolicitud = o.getAttribute('data-idsolicitud'),
                parametro = `idsolicitud:${idsolicitud},idatx:${idatx}`,
                url = urlBase() + 'DesarrolloTextil/Atx/AnalisisTextilImprimir?par=' + parametro;
            window.open(url);
        }

        function fn_abrir_filtrobuscadoratx() {
            _modalBody({
                url: 'DesarrolloTextil/Atx/_FiltroBuscadorAtx',
                ventana: '_FiltroBuscadorAtx',
                titulo: 'Filtro',
                parametro: '',
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        function filtrar_busqueda(_param) {
            let url = 'DesarrolloTextil/Solicitud/GetBuscarAtx?par=' + JSON.stringify(_param);
            limpiar_filtros_tbl();
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

                    pintar_label_filtro(_param);
                })
                .catch((e) => {
                    err(e);
                });
        }

        function pintar_label_filtro(_param) {
            let html = `<h3 class='text-navy col-sm-2'>Proveedor: <small class='text-success _small'>${_param.proveedor}</small></h3>   <h3 class='text-navy col-sm-2'>Cliente: <small class='text-success _small'>${_param.cliente}</small></h3>  <h3 class='text-navy col-sm-2'>Fec Ini: <small class='text-success _small'>${_param.label_fechainicio}</small></h3>  <h3 class='text-navy col-sm-2'>Fec Fin: <small class='text-success _small'>${_param.label_fechafin}</small></h3>`;
            let div = _('div_cuerpoprincipal').getElementsByClassName('cls_titulo_filtro_buscadoratx')[0];
            //let html = `${_param.proveedor}  ${_param.cliente}  ${_param.fechainicio}  ${_param.fechafin}`;
            div.innerHTML = '';
            div.innerHTML = html;
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

        function limpiar_filtros_tbl() {
            let arrinputs = Array.from(_('tbl_buscadoratx').getElementsByClassName('_clsfilter'));
            arrinputs.forEach(x => {
                x.value = '';
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            filtrar_busqueda: filtrar_busqueda,
            paginar: paginar,
            pintartablaindex: pintartablaindex
        }
    }
)(document, 'panelencabezado_buscaratx');

(
    function ini() {
        appBuscadorAtx.load();
        appBuscadorAtx.req_ini();
    }
)();
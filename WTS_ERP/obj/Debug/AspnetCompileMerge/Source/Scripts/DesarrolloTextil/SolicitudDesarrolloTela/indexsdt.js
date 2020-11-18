var ovariablesdesarrollo_tela = {
    desarrollotela: [],
    aListaFiltrada: [],
    roles: [],
    registrosPagina: 10,
    indiceActualPagina: 0,
    paginasBloque: 4,
    indiceActualBloque: 0,
    indice: 0, 
}

var ovariables_leadtimes = {
    leadtimes: [],
}

var appIndexSDT = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial: '',
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

        var err_xhr = (__err) => {
            console.log('err', __err);
        }

        function load() {
            let par = _('txtpar_indexsdt').value;

            filter_header();
            
            ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
            d.getElementById('tabsolicituddesarrollotela').click();
            d.getElementById('btn_new_indexsdt').addEventListener('click', function (e) { let o = e.currentTarget; fn_nuevosolicitud(o); });
            //d.getElementById('btn_new_indexsdt_1').addEventListener('click', function (e) { let o = e.currentTarget; fn_nuevosolicitud_cristina(o); });
            //d.getElementById('btn_new_indexsdt_2').addEventListener('click', function (e) { let o = e.currentTarget; fn_nuevosolicitud_cristina(o); });
            d.getElementById('btn_new_aprobarsdt').addEventListener('click', fn_modalaprobarsolicitud);
            d.getElementById('btnSearch').addEventListener('click', req_ini);

            d.getElementById('tabsolicituddesarrollotela').addEventListener('click', fn_tabsolicituddesarrollotela);
            d.getElementById('tabdprocesospendientes').addEventListener('click', fn_tabdprocesospendientes);

            d.getElementById('btnExportar').addEventListener('click', fn_download_excel_leadtimes, false);

            $("#dtFI .input-group.date").datepicker({
                dateFormat: 'dd/mm/yyyy',                
                autoclose: true,                
            });

            $("#dtFF .input-group.date").datepicker({
                dateFormat: 'dd/mm/yyyy',                
                autoclose: true
            });
            
            $('#dtFI .input-group.date').datepicker('update', moment().subtract(2, 'month').format('MM/DD/YYYY'));
            $('#dtFF .input-group.date').datepicker('update', moment().add(1, 'days').format('MM/DD/YYYY'));         


        }

        function fn_nuevosolicitud(o) {
            let urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
            _Go_Url(urlAccion, urlAccion, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial);
        }

        //function fn_nuevosolicitud_cristina(o) {
        //    let urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT_CRISTINA', dataestado = o.getAttribute('data-estado');
        //    if (dataestado === 'new') {
        //        _Go_Url(urlAccion, urlAccion, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial);
        //    } else if (dataestado === 'new_actualizar'){
        //        _Go_Url(urlAccion, urlAccion, 'accion:new_actualizar,idgrupocomercial:' + ovariables.idgrupocomercial);
        //    }
            
        //}

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },                
                parametro = { x: 1, fechainicio: _("txtFI").value, fechafin: _("txtFF").value };

            _Get('DesarrolloTextil/SolicitudDesarrolloTela/GetSolicitudDesarrollo?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;                    
                    if (rpta !== null) {
                        let desarrollotela = rpta[0].desarrollotela !== '' ? CSVtoJSON(rpta[0].desarrollotela) : null;
                        ovariablesdesarrollo_tela.desarrollotela = desarrollotela;
                        let isproveedor = rpta[0].isproveedor;
                        ovariables.adata = desarrollotela;
                        ovariablesdesarrollo_tela.roles = (rpta[0].roles.split(','));     
                        if (rpta[0].isproveedor == "no") {
                            _("tabdprocesospendientes").style.display = "block";
                        }
                        cargartabla(desarrollotela);
                        hide_button_isProveedor(isproveedor);
                        show_button_isAprobador();
                    }
                }, (p) => { err(p); });
        }


        function hide_button_isProveedor(isproveedor) {
            if (isproveedor === 'si') {
                _('btn_new_indexsdt').classList.add('hide');
                _('btn_new_aprobarsdt').classList.add('hide');
            }
        }

        function show_button_isAprobador() {
            var navheader = document.querySelector('.nav-header').innerText;
            var texto = navheader.toUpperCase().trim().split('\n').join('');
            var exito = texto.indexOf('RLINES') >= 0;
            var btnaprobar = _('btn_new_aprobarsdt');
            if (!btnaprobar.classList.contains('hide')) btnaprobar.classList.add('hide');
            if (exito) btnaprobar.classList.remove('hide');            
        }
            

        function cargartabla(data, indice) {
            let div = _('div_tbl_indexsdt'), html = '';

            html = `<table class="table table-bordered" id="tbl_indexsdt">
                    <thead>
                        <tr>
                            <th style="width:3%" class="no-sort"></th>
                            <th style="width:7%"># Solicitud</th>
                            <th style="width:10%">ATX</th>
                            <th style="width:15%">Tela</th>
                            <th style="width:10%">Cliente</th>
                            <th style="width:5%">Es Complemento</th>
                            <th style="width:10%">Nombre Tela Cliente Cuerpo</th>
                            <th style="width:10%">Nombre Tela Cliente Complemento</th>
                            <th style="width:10%">Referencia Solicitud Tela Cuerpo</th>
                            <th style="width:5%">Temporada</th>
                            <th style="width:15%">Estado</th>
                        </tr>                
                    </thead><tbody id="tbody_indexsdt">`;

            if (data !== null) {
                //data.forEach(x => {
                //    let arr_proveedor_estado = x.estado.split('~'), cadena_estado = '', total_arr = arr_proveedor_estado.length;
                //        //, estado = x.estado.replace(/~/gi, '</br>');

                //    if (arr_proveedor_estado.length > 1) {
                //        arr_proveedor_estado.forEach((x, i) => {
                //            let arr_estado = x.split(':');
                //            if ((i + 1) < total_arr) {
                //                cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' + '</br>'
                //            } else {
                //                cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>';
                //            }

                //        });
                //    } else {
                //        let arr_estado = x.estado.split(':');
                //        if (arr_estado.length > 1) {
                //            cadena_estado = arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' //x.estado;
                //        } else {
                //            cadena_estado = x.estado;
                //        }
                //    }

                //    html += `
                //                <tr>                                  
                //                    <td class="text-center"><a href='javascript:void(0)'><span class ='fa fa-edit cls_edit_desarrollotela' data-idsolicituddesarrollotela='${x.idsolicituddesarrollotela}' title='editar'></span></a></td>
                //                    <td>${x.idsolicituddesarrollotela}</td>
                //                    <td>${x.codigo}</td>
                //                    <td>${x.tela}</td>
                //                    <td>${x.cliente}</td>
                //                    <td>${x.temporada}</td>
                //                    <td>${cadena_estado}</td>
                //                </tr>
                //            `;
                //});
                //crearlistafiltrada();
                //mostrarlistafiltrada();
                //configurarfiltro();       

                data.forEach((x) => {
                    let arr_proveedor_estado = x.estado.split('~'), cadena_estado = '', total_arr = arr_proveedor_estado.length;
                        
                    if (arr_proveedor_estado.length > 1) {
                        arr_proveedor_estado.forEach((x, i) => {
                            let arr_estado = x.split(':');
                            if ((i + 1) < total_arr) {
                                cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' + '</br>'
                            } else {
                                cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>';
                            }

                        });
                    } else {
                        let arr_estado = x.estado.split(':');
                        if (arr_estado.length > 1) {
                            cadena_estado = arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' //x.estado;
                        } else {
                            cadena_estado = x.estado;
                        }
                    }
                    //<a href='javascript:void(0)'><span class='fa fa-edit cls_edit_desarrollotela' data-idsolicituddesarrollotela='${x.idsolicituddesarrollotela}' title='editar'></span></a>
                    html+=  `<tr>
                                    <td class='text-center' style='vertical-align: middle;'>
                                        <button type='button' class='btn btn-xs btn-primary cls_edit_desarrollotela' data-idsolicituddesarrollotela='${x.idsolicituddesarrollotela}' title='editar'>
                                            <span class='fa fa-edit'></span>
                                        </button>
                                    </td>
                                    <td>
                                        ${x.idsolicituddesarrollotela}
                                    </td>
                                    <td>
                                        ${x.codigo}
                                    </td>
                                    <td>
                                        ${x.tela}
                                    </td>
                                    <td>
                                        ${x.cliente}
                                    </td>
                                    <td>
                                        ${x.escomplemento}
                                    </td>
                                    <td>
                                        ${x.nombretelacliente_padre}
                                    </td>
                                    <td>
                                        ${x.nombretelacliente_complemento}
                                    </td>
                                    <td>
                                        ${x.referencia_solicitud_padre}
                                    </td>
                                    <td>
                                        ${x.temporada}
                                    </td>
                                    <td>
                                        ${cadena_estado}
                                    </td>
                                </tr>`;
                });
                html += `</tbody></table>`;
                div.innerHTML = html;
                handler_tbl();
                formatTable_SolicitudTela();                
            } else {
                html += `</tbody><tr><td colspan="11" class="text-center">Sin Resultados.</td></tr></table>`;
                div.innerHTML = html;                  
            }            
        }

        function formatTable_SolicitudTela() {

            let iListLength = (jQuery.fn.dataTableExt.oPagination.iFullNumbersShowPage < 6 ? jQuery.fn.dataTableExt.oPagination.iFullNumbersShowPage : 6);

            $('#tbl_indexsdt thead tr').clone(true).appendTo('#tbl_indexsdt thead');
            $('#tbl_indexsdt thead tr:eq(1) th').each(function (i) {
                var title = $(this).text();
                i == 0 ? " " : $(this).html('<input type="text" placeholder="Search" style="width:100%" />');

                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                });
            });

            var table = $('#tbl_indexsdt').DataTable({
                sPaginationType: "full_numbers",
                iDisplayLength: 5,
                //pageLength: 5,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,    
                //"dom": '<"row"<"col-sm-4"l><"col-sm-4 text-center"p><"col-sm-4"f>>tip'
            });

            $('#tbl_indexsdt').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_indexsdt_filter').hide();
        }

        function handler_tbl() {
            let tbody = _('tbody_indexsdt'), arr = Array.from(tbody.rows);
            if (tbody.rows.length > 0) {
                arr.forEach(x => {
                    let btnedit = x.getElementsByClassName('cls_edit_desarrollotela')[0];
                    btnedit.addEventListener('click', fn_edit_desarrollotela, false);
                }); 
            }                                       
        }

        function fn_edit_desarrollotela(e) {
            let o = e.currentTarget, idsolicituddesarrollotela = o.getAttribute('data-idsolicituddesarrollotela'),
            parametro = `idsolicituddesarrollotela:${idsolicituddesarrollotela},accion:edit`,
            url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
            _Go_Url(url, url, parametro);
        }

        function fn_modalaprobarsolicitud() {
            _modalBody({
                url: 'DesarrolloTextil/SolicitudDesarrolloTela/_AprobarSDT',
                ventana: '_AprobarSDT',
                titulo: 'Aprobar Solicitud Desarrollo Tela',
                parametro: ``,
                ancho: '1200',
                alto: '',
                responsive: ''
            });
        }

        //function filter_header() {
        //    var name_filter = "_clsfilter";
        //    var filters = document.getElementsByClassName(name_filter);
        //    var nfilters = filters.length, filter = {};

        //    for (let i = 0; i < nfilters; i++) {
        //        filter = filters[i];
        //        if (filter.type == "text") {
        //            filter.value = '';
        //            filter.onkeyup = function () {
        //                ovariables.adataresult = event_header_filter(name_filter);
        //                cargartabla(ovariables.adataresult, 0); //:desactivate                
        //            }
        //        }
        //    }
        //}

        //function event_header_filter(fields_input) {
        //    let adataResult = [], adata = ovariables.adata;
        //    if (adata.length > 0) {
        //        var fields = document.getElementsByClassName(fields_input);
        //        if (fields != null && fields.length > 0) {
        //            var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
        //            var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
        //            var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
        //            var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

        //            acampos_name = _oreflector.getProperties(adata[0]);

        //            for (i = 0; i < nreg; i++) {
        //                exito = true;
        //                for (x = 0; x < nfields; x++) {
        //                    ofield = fields[x];
        //                    value = ofield.value.toLowerCase();
        //                    field = ofield.getAttribute("data-field");
        //                    if (ofield.type == "text") {
        //                        //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
        //                        if (exito) {
        //                            if (value !== '') {
        //                                valor = adata[i][field];
        //                                _y = adata[i][field].toLowerCase().indexOf(value);
        //                                exito = (y > -1);
        //                            }
        //                        }
        //                        exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
        //                    }
        //                    else {
        //                        exito = exito && (value == "" || value == adata[i][field]);
        //                    }
        //                    if (!exito) break;
        //                }
        //                if (exito) {
        //                    acampos_value = _oreflector.getValues(adata[i]);
        //                    adataResult[c] = _setfield(acampos_name, acampos_value);
        //                    c++;
        //                }
        //            }
        //        }
        //    }
        //    return adataResult;
        //}

        function crearlistafiltrada() {
            ovariablesdesarrollo_tela.aListaFiltrada = [];
            let nRegistros = ovariablesdesarrollo_tela.desarrollotela == undefined ? 0 : ovariablesdesarrollo_tela.desarrollotela.length;
            let campos;
            let nCampos;
            let exito;
            let textos = document.getElementsByName("inputbuscar");
            let nTextos = textos.length;
            let texto;
            let c = 0;

            for (let i = 0; i < nRegistros; i++) {
                campos = Object.values(ovariablesdesarrollo_tela.desarrollotela[i]);
                nCampos = campos.length;
                exito = true;
                for (let j = 0; j < nTextos; j++) {
                    texto = textos[j];
                    exito = exito && campos[j].toLowerCase().indexOf(texto.value.toLowerCase()) > -1;
                    if (!exito) {
                        break;
                    } 
                }
                if (exito) {
                    ovariablesdesarrollo_tela.aListaFiltrada.push(ovariablesdesarrollo_tela.desarrollotela[i]);
                }
            }
        }

        function mostrarlistafiltrada() {
            let contenido = "";
            let nRegistros = ovariablesdesarrollo_tela.aListaFiltrada.length;
            if (nRegistros > 0) {
                let inicio = ovariablesdesarrollo_tela.registrosPagina * ovariablesdesarrollo_tela.indiceActualPagina;
                let fin = Math.min(inicio + ovariablesdesarrollo_tela.registrosPagina, nRegistros);
                for (let i = inicio; i < fin; i++) {                
                    contenido += `<tr>
                                    <td>
                                        <a href='javascript:void(0)'><span class ='fa fa-edit cls_edit_desarrollotela' data-idsolicituddesarrollotela='${ovariablesdesarrollo_tela.aListaFiltrada[i].idsolicituddesarrollotela}' title='editar'></span></a>
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].idsolicituddesarrollotela}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].codigo}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].tela}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].cliente}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].escomplemento}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].nombretelacliente_padre}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].nombretelacliente_complemento}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].referencia_solicitud_padre}
                                    </td>
                                    <td>
                                        ${ovariablesdesarrollo_tela.aListaFiltrada[i].temporada}
                                    </td>
                                    <td>
                                        ${estadostrong(ovariablesdesarrollo_tela.aListaFiltrada[i].estado)}
                                    </td>
                                </tr>`;
                }                             
            } else {
                contenido += "<tr><td class='text-center' colspan='11'>Sin Resultados</td></tr>";
            }

            crearbotonespaginas();

            document.getElementById("tbody_indexsdt").innerHTML = contenido;
            if (document.getElementById("tbody_indexsdt").rows.length > 0 && nRegistros > 0) {                
                click_paginacion();  
                handler_tbl();
            }            
        }

        function configurarfiltro() {
            let textos = document.getElementsByName("inputbuscar");
            let texto;
            let nTextos = textos.length;
            for (let i = 0; i < nTextos; i++) {
                texto = textos[i];
                texto.onkeyup = function (event) {
                    ovariablesdesarrollo_tela.indiceActualPagina = 0;
                    ovariablesdesarrollo_tela.indiceActualBloque = 0;
                    ovariablesdesarrollo_tela.indice = 0;
                    crearlistafiltrada();
                    mostrarlistafiltrada();
                }
            }
        }

        function crearbotonespaginas() {
            let contenido = "";
            let nRegistros = ovariablesdesarrollo_tela.aListaFiltrada.length;
            if (nRegistros > 0) {
                var indiceUltimaPagina = Math.floor(nRegistros / ovariablesdesarrollo_tela.registrosPagina);
                if (nRegistros % ovariablesdesarrollo_tela.registrosPagina == 0) indiceUltimaPagina--;
                if (ovariablesdesarrollo_tela.indiceActualBloque > 0) {
                    contenido += "<ul class='pagination'>";
                    contenido += "<li><a href='javascript:void(0)' data-hint='Primera Página' data-value='-1' onclick='paginar(-1);'><<</a></li>";
                    contenido += "<li><a href='javascript:void(0)' data-hint='Atras' data-value='-2' onclick='paginar(-2);'><</a></li>";
                }
                var inicio = ovariablesdesarrollo_tela.indiceActualBloque * ovariablesdesarrollo_tela.paginasBloque;
                var fin = inicio + ovariablesdesarrollo_tela.paginasBloque;
                var iPagina = 0;
                contenido += "<ul class='pagination'>";
                for (var i = inicio; i < fin; i++) {
                    if (i <= indiceUltimaPagina) {
                        contenido += "<li><a href='#' name='nPaginacion' data-value='" + (i) + "'>" + (i + 1).toString() + "</a></li>";
                    }
                    else break;
                }
                var paginas = indiceUltimaPagina + 1;
                var indiceUltimoBloque = Math.floor(paginas / ovariablesdesarrollo_tela.paginasBloque);
                if (paginas % ovariablesdesarrollo_tela.paginasBloque == 0) indiceUltimoBloque--;
                if (ovariablesdesarrollo_tela.indiceActualBloque < indiceUltimoBloque) {
                    contenido += "<li><a href='javascript:void(0)' data-hint='Adelante' data-value='-3' onclick='paginar(-3);'>></a></li>";
                    contenido += "<li><a href='javascript:void(0)' data-hint='Ultima Página' data-value='-4' onclick='paginar(-4);'>>></a></li>";
                    contenido += "</ul>";
                }
            }
            document.getElementById("tdPaginacion").innerHTML = contenido;
            for (var i = 0, l = document.getElementsByName("nPaginacion").length; i < l; i++) {
                if ((document.getElementsByName("nPaginacion")[i].getAttribute("data-value") + 1) == (ovariablesdesarrollo_tela.indiceActualPagina + 1)) {
                    document.getElementsByName("nPaginacion")[i].className = "active";
                }
            }                    
        }

        function click_paginacion() {
            let element = document.getElementsByName("nPaginacion");
            let texto;
            let nTextos = element.length;
            let indicePagina = "";
            for (let i = 0; i < nTextos; i++) {
                texto = element[i];                                
                texto.addEventListener("click", function (e) {
                    indicePagina = e.target.getAttribute("data-value");
                    paginar(indicePagina);                          
                });
            }
        }

        //function paginar(indicePagina) {                        
        //    let nRegistros = ovariablesdesarrollo_tela.aListaFiltrada.length;
        //    if (indicePagina < 0) {
        //        var indiceUltimaPagina = Math.floor(nRegistros / ovariablesdesarrollo_tela.registrosPagina);
        //        if (nRegistros % ovariablesdesarrollo_tela.registrosPagina == 0) indiceUltimaPagina--;
        //        var paginas = indiceUltimaPagina + 1;
        //        var indiceUltimoBloque = Math.floor(paginas / ovariablesdesarrollo_tela.paginasBloque);
        //        if (paginas % ovariablesdesarrollo_tela.paginasBloque == 0) indiceUltimoBloque--;
        //        switch (indicePagina) {
        //            case -1:
        //                ovariablesdesarrollo_tela.indiceActualBloque = 0;
        //                indicePagina = 0;
        //                break;
        //            case -2:
        //                if (ovariablesdesarrollo_tela.indiceActualBloque > 0) {
        //                    ovariablesdesarrollo_tela.indiceActualBloque--;
        //                    indicePagina = ovariablesdesarrollo_tela.indiceActualBloque * ovariablesdesarrollo_tela.paginasBloque;
        //                }
        //                break;
        //            case -3:
        //                if (ovariablesdesarrollo_tela.indiceActualBloque < indiceUltimoBloque) {
        //                    ovariablesdesarrollo_tela.indiceActualBloque++;
        //                    indicePagina = ovariablesdesarrollo_tela.indiceActualBloque * ovariablesdesarrollo_tela.paginasBloque;
        //                }
        //                break;
        //            case -4:
        //                ovariablesdesarrollo_tela.indiceActualBloque = indiceUltimoBloque;
        //                indicePagina = indiceUltimaPagina;
        //                break;
        //        }
        //    }
        //    ovariablesdesarrollo_tela.indiceActualPagina = indicePagina;
        //    mostrarlistafiltrada();            
        //}

        function estadostrong(estado) {            
            let arr_proveedor_estado = estado.split('~'), cadena_estado = '', total_arr = arr_proveedor_estado.length;            
            if (arr_proveedor_estado.length > 1) {
                arr_proveedor_estado.forEach((x, i) => {
                    let arr_estado = x.split(':');
                    if ((i + 1) < total_arr) {
                        cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' + '</br>'
                    } else {
                        cadena_estado += arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>';
                    }
                });
            } else {
                let arr_estado = estado.split(':');
                if (arr_estado.length > 1) {
                    cadena_estado = arr_estado[0] + '<strong>' + arr_estado[1] + '</strong>' //x.estado;
                } else {
                    cadena_estado = estado;
                }
            }            
            return cadena_estado;
        }

        function fn_tabsolicituddesarrollotela() {
            _('divsolicituddesarrollotela').style.display = "block";
            _('divprocesopendiente').classList.add('hide'); //style.display = "none";
        }

       
        function fn_tabdprocesospendientes() {
            _('divsolicituddesarrollotela').style.display = "none";
            _('divprocesopendiente').classList.remove('hide');
            let parametro = { x: 1 };
            _Get('DesarrolloTextil/SolicitudDesarrolloTela/GetAllData_LeadTime?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables_leadtimes.leadtimes = rpta;
                        fn_CrearTablaLeadTime(ovariables_leadtimes.leadtimes);
                    }
                }, (p) => { err_xhr(p); });
        }

        function fn_CrearTablaLeadTime(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_indexleadtimes" class ="table table-bordered table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th data-width="90px"># Solicitud</th>
                                <th data-width="90px">ATX</th>
                                <th data-width="130px">Solicitante</th>
                                <th data-width="90px">Fabrica</th>
                                <th data-width="90px">Es Complemento</th>
                                <th data-width="90px">Nombre Tela Cliente Cuerpo</th>
                                <th data-width="90px">Nombre Tela Cliente Complemento</th>
                                <th data-width="90px">Referencia Tela Cliente Cuerpo</th>
                                <th data-width="90px">TEJIDO</th>
                                <th data-width="120px">TEÑIDO/LAVADO</th>
                                <th data-width="120px">LAVADO/PAÑOS</th>
                                <th data-width="110px">HILADO</th>   
                                <th data-width="90px">ACABADO</th>   
                                <th data-width="90px">TERMOFIJADO</th>
                                <th data-width="90px">LABDIPS</th>
                                <th data-width="90px">Fecha Entrega</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td>${x.IdSolicitudDesarrolloTela}</td>
                                    <td>${x.Codigo}</td>
                                    <td>${x.NombrePersonal}</td>
                                    <td>${x.NombreProveedor}</td>
                                    <td>${x.EsComplemento}</td>
                                    <td>${x.NombreTelaCuerpo}</td>
                                    <td>${x.NombreTelaComplemento}</td>
                                    <td>${x.ReferenciaTelaCuerpo}</td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:TEJIDO,fechafinproceso:${x.Tejido},diasfaltantes:${x.DiasTejido}">
                                        <div style="display: inline-flex;">
                                            <span>${x.Tejido}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasTejido)}">${x.DiasTejido}</span></div>
                                        </div>
                                    </td>   
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:TEÑIDO/LAVADO,fechafinproceso:${x.TenidoLavado},diasfaltantes:${x.DiasTenidoLavado}">
                                        <div style="display: inline-flex;">
                                            <span>${x.TenidoLavado}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasTenidoLavado)}">${x.DiasTenidoLavado}</span></div>
                                        </div>
                                    </td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:LAVADO/PAÑOS,fechafinproceso:${x.LavadoPanos},diasfaltantes:${x.DiasLavadoPanos}">
                                        <div style="display: inline-flex;">
                                            <span>${x.LavadoPanos}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasLavadoPanos)}">${x.DiasLavadoPanos}</span></div>
                                        </div>
                                    </td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:HILADO,fechafinproceso:${x.Hilado},diasfaltantes:${x.DiasHilado}">
                                        <div style="display: inline-flex;">
                                            <span>${x.Hilado}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasHilado)}">${x.DiasHilado}</span></div>
                                        </div>
                                    </td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:ACABADO,fechafinproceso:${x.Acabado},diasfaltantes:${x.DiasAcabado}">
                                        <div style="display: inline-flex;">
                                            <span>${x.Acabado}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasAcabado)}">${x.DiasAcabado}</span></div>
                                        </div>
                                    </td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:TERMOFIJADO,fechafinproceso:${x.Termofijado},diasfaltantes:${x.DiasTermofijado}">
                                        <div style="display: inline-flex;">
                                            <span>${x.Termofijado}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasTermofijado)}">${x.DiasTermofijado}</span></div>
                                        </div>
                                    </td>
                                    <td class="text-center" data-par="idcliente:${x.IdCliente},idproveedor:${x.IdProveedor},idgrupocomercial:${x.IdGrupoPersonal},idsolicituddesarrollotela:${x.IdSolicitudDesarrolloTela},nombreproveedor:${x.NombreProveedor},nombreproceso:LABDIPS,fechafinproceso:${x.Labdips},diasfaltantes:${x.DiasLabdips}">
                                        <div style="display: inline-flex;">
                                            <span>${x.Labdips}</span>
                                            <div style="width: 50px;"><div class="infont col-md-3 col-sm-4"><a href="#" onclick="appIndexSDT.fn_EnviarNotificacionLeadTime(this)"><i class="fa fa-calendar"></i></a></div><span class="${fn_ClassDiasFaltantes(x.DiasLabdips)}">${x.DiasLabdips}</span></div>
                                        </div>
                                    </td>
                                    <td>${x.FechaEntrega}</td>
                                </tr>`;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_indexleadtimes').innerHTML = html;

            fn_FormatTablaLeadTime();
        }

        function fn_FormatTablaLeadTime() {
            // Crea footer
            _('tbl_indexleadtimes').createTFoot();
            _('tbl_indexleadtimes').tFoot.innerHTML = _('tbl_indexleadtimes').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_indexleadtimes tfoot th').each(function () {
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
            var table = $('#tbl_indexleadtimes').DataTable({
                "lengthMenu": [10, 25, 50, 100],
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

            $("#tbl_indexleadtimes tfoot tr").appendTo("#tbl_indexleadtimes thead");
            $("#tbl_indexleadtimes tfoot").remove();

            // Paginate in diferent div
            $("#div_tbl_Items_pagination").children().remove();
            $("#tbl_indexleadtimes_paginate").parent().parent().appendTo("#div_tbl_Items_pagination");
            $("#tbl_indexleadtimes_paginate").css({
                'text-align': 'right',
                'margin': '2px 0'
            });
            $("#tbl_indexleadtimes_wrapper").css("padding", "0");

            // Hide table general search
            $('#tbl_indexleadtimes_filter').hide();  
        }

        function fn_ClassDiasFaltantes(diasfaltantes) {
            let class_dias_faltantes = '';
            if ((diasfaltantes * 1) < 0) {
                class_dias_faltantes = "badge badge-danger";
            } else if ((diasfaltantes * 1) == 0) {
                class_dias_faltantes = "badge badge-warning";
            } else if ((diasfaltantes * 1) > 0) {
                class_dias_faltantes = "badge badge-primary";
            }

            return class_dias_faltantes
        }

        var fn_EnviarNotificacionLeadTime = async (e) => {
            let fila = e.parentNode.parentNode.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                idcliente = _par(datapar, 'idcliente'), idproveedor = _par(datapar, 'idproveedor'), idgrupocomercial = _par(datapar, 'idgrupocomercial'),
                idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'), nombreproveedor = _par(datapar, 'nombreproveedor'), nombreproceso = _par(datapar, 'nombreproceso'),
                fechafinproceso = _par(datapar, 'fechafinproceso'), diasfaltantes = _par(datapar, 'diasfaltantes');
                parametro = { 
                    idcliente: idcliente,
                    idproveedor: idproveedor,
                    idgrupocomercial: idgrupocomercial,
                    idsolicituddesarrollotela: idsolicituddesarrollotela,
                    nombreproveedor: nombreproveedor,
                    nombreproceso: nombreproceso,
                    fechafinproceso: fechafinproceso,
                    diasfaltantes: diasfaltantes
                },
                url_validacion = 'DesarrolloTextil/SolicitudDesarrolloTela/ValidarSiExistenCorreosFabrica?par=' + JSON.stringify(parametro);

            const validarsiexistecorreofabrica = await _Get(url_validacion);
            if (validarsiexistecorreofabrica !== '') {
                let mensaje = 'Esta seguro de enviar la notificación?';
                swal({
                    title: mensaje,
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                }, function (result) {
                    if (result) {
                        ejecutar_enviar_notificacion(JSON.stringify(parametro));
                        return;
                    }
                });
            } else {
                _swal({ mensaje: 'No existen correos de fabrica, porfavor configure las cuentas de correo para fabrica. \n Ir a la opción del menu [Mail Factory by Client].', estado: 'error' });
            }
        }
   
        function handler_tblleadtimes() {
            //let element = document.getElementsByName("enviar_notificacion");
            let arr_btn_notificacion = Array.from(_('tbody_indexleadtimes').getElementsByClassName('cls_btn_enviar_notificacion'));
            arr_btn_notificacion.forEach(x => { x.addEventListener('click', e => { fn_enviar_notificacion(e); }); })
            //let texto;
            //let nTextos = element.length;
            //let idsolicituddesarrollotelaLeadtimes = "";
            //for (let i = 0; i < nTextos; i++) {
            //    texto = element[i];
            //    texto.addEventListener("click", function (e) {
            //        idsolicituddesarrollotelaLeadtimes = e.target.getAttribute("data-idsolicituddesarrollotelaLeadtimes");
            //        fn_enviar_notificacion(idsolicituddesarrollotelaLeadtimes);
            //    });
            //}
        }

        function cargartabla_leadtimes(odata, indice) {
            let tbody = _('tbody_indexleadtimes'), html = '';

            if (indice == undefined) {
                indice = 0;
            }

            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
            let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

            if (odata !== null) {
                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        let class_dias_faltantes = '', diasfaltantes = odata[i].diasfaltantes, cadena_datapar = JSON.stringify(odata[i]);

                        if ((diasfaltantes * 1) < 0) {
                            class_dias_faltantes = "badge badge-danger";
                        } else if ((diasfaltantes * 1) == 0) {
                            class_dias_faltantes = "badge badge-warning";
                        } else if ((diasfaltantes * 1) > 0) {
                            class_dias_faltantes = "badge badge-primary";
                        }
                        //<a href='javascript:void(0)'><span class='fa fa-send-o cls_btn_enviar_notificacion' name='enviar_notificacion' title='enviar notificacion'></span></a> 
                        html += `
                                <tr data-par='${cadena_datapar}' data-pardos='idcliente:${odata[i].idcliente},idproveedor:${odata[i].idproveedor},idgrupocomercial:${odata[i].idgrupopersonal}'>
                                    <td class="text-center">
                                        <button type='button' class='btn btn-sm btn-primary cls_btn_enviar_notificacion' title='enviar notificacion'>
                                            <span class='fa fa-send'></span>
                                        </button>
                                    </td>
                                    <td>${odata[i].idsolicituddesarrollotela}</td>
                                    <td>${odata[i].codigoatx}</td>
                                    <td>${odata[i].solicitante}</td>
                                    <td>${odata[i].nombreproveedor}</td>
                                    <td>${odata[i].escomplemento}</td>
                                    <td>${odata[i].nombretelacliente_padre}</td>
                                    <td>${odata[i].nombretelacliente_complemento}</td>
                                    <td>${odata[i].referencia_solicitud_padre}</td>
                                    <td>${odata[i].nombreproceso}</td>
                                    <td>${odata[i].fechafinproceso}</td>
                                    <td><div class="infont col-md-3 col-sm-4"><a href="#"><i class="fa fa-calendar"></i></a></div><span class='${class_dias_faltantes}'>${odata[i].diasfaltantes}</span></td>                                    
                                </tr>                            
                            `;
                    }
                }

                tbody.innerHTML = html;
                _('foot_paginacion').innerHTML = page_result(odata, indice);
                handler_tblleadtimes();
                //formatTable();
            } else {
                html = "<tr><td colspan='12' class='text-center'>Sin Resultados</td></tr>";
                tbody.innerHTML = html;
            }
        }

        var fn_enviar_notificacion = async (e) => {
            let frm = new FormData(), o = e.currentTarget, fila = o.parentNode.parentNode,
                datapar = fila.getAttribute('data-par'), datapar2 = fila.getAttribute('data-pardos'),
                idcliente = _par(datapar2, 'idcliente'), idproveedor = _par(datapar2, 'idproveedor'), idgrupocomercial = _par(datapar2, 'idgrupocomercial'),
                parvalidacion_correo = { idcliente: idcliente, idproveedor: idproveedor, idgrupocomercial: idgrupocomercial },
                url_validacion = 'DesarrolloTextil/SolicitudDesarrolloTela/ValidarSiExistenCorreosFabrica?par=' + JSON.stringify(parvalidacion_correo);
            //let parhead = idsolicituddesarrollotelaLeadtimes;

            const validarsiexistecorreofabrica = await _Get(url_validacion);
            if (validarsiexistecorreofabrica !== '') {
                let mensaje = 'Esta seguro de enviar la notificación?';
                swal({
                    title: mensaje,
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                }, function (result) {
                    if (result) {
                        ejecutar_enviar_notificacion(datapar);
                        return;
                    }
                });
            } else {
                _swal({ mensaje: 'No existen correos de fabrica, porfavor configure las cuentas de correo para fabrica. \n Ir a la opción del menu [Mail Factory by Client].', estado: 'error' });
            }
        }

        var ejecutar_enviar_notificacion = async (datapar) => {
            frm = new FormData();
            frm.append('par', datapar);

            let grabar = await _promise(5)
                .then(() => {
                    let rpta = _Post('DesarrolloTextil/SolicitudDesarrolloTela/Enviar_notificacion_leadtime', frm);
                    return rpta;
                })
                .then((odata) => {
                    let rpta = odata !== '' ? JSON.parse(odata) : null;

                    _swal({
                        mensaje: rpta.mensaje, estado: rpta.estado
                    });
                })
                .catch((e) => {
                    _swal({
                        mensaje: e.toString(), estado: 'error'
                    });
                });
            //_Post('DesarrolloTextil/SolicitudDesarrolloTela/Enviar_notificacion_leadtime', frm)
            //    .then((odata) => {
            //        let rpta = odata !== '' ? JSON.parse(odata) : null;

            //        _swal({
            //            mensaje: rpta.mensaje, estado: rpta.estado
            //        });


            //        //if (rpta.estado === "success") {
            //        //    console.log(rpta);
            //        //}
            //    }, (p) => {
            //        err_xhr(p);
            //    });
        }

        function formatTable() {       

            $('#tbl_indexleadtimes thead tr').clone(true).appendTo('#tbl_indexleadtimes thead');
            $('#tbl_indexleadtimes thead tr:eq(1) th').each(function (i) {
                var title = $(this).text();                
                i == 0 ? " " : $(this).html('<input type="text" placeholder="Search" />');

                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                });
            });

            var table = $('#tbl_indexleadtimes').DataTable({
                sPaginationType: "full_numbers",
                iDisplayLength: 15,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,    
            });



            $('#tbl_indexleadtimes').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_indexleadtimes_filter').hide();            
        }

        function fn_ColorCeldasExcel(diasfaltantes) {
            let color = '';
            if ((diasfaltantes * 1) < 0) {
                color = "#ed5565";
            } else if ((diasfaltantes * 1) == 0) {
                color = "#ffc107";
            } else if ((diasfaltantes * 1) > 0) {
                color = "#1ab394";
            }
            return color;
        }

        function fn_download_excel_leadtimes(e) {
            let cantidadregistros = ovariables_leadtimes.leadtimes.length;
            let par ='N°¬ATX¬Solicitante¬Fabrica¬Tejido¬Teñido/Lavado¬Lavado/Paños¬Hilado¬Acabado¬Termofijado¬Labdips¬Fecha Fin Proceso';
            let pardetail = '';
            for (let i = 0; i < cantidadregistros; i++) {
                pardetail += ovariables_leadtimes.leadtimes[i].IdSolicitudDesarrolloTela + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Codigo + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].NombrePersonal + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].NombreProveedor + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Tejido + ' (' + ovariables_leadtimes.leadtimes[i].DiasTejido + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].TenidoLavado + ' (' + ovariables_leadtimes.leadtimes[i].DiasTenidoLavado + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].LavadoPanos + ' (' + ovariables_leadtimes.leadtimes[i].DiasLavadoPanos + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Hilado + ' (' + ovariables_leadtimes.leadtimes[i].DiasHilado + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Acabado + ' (' + ovariables_leadtimes.leadtimes[i].DiasAcabado + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Termofijado + ' (' + ovariables_leadtimes.leadtimes[i].DiasTermofijado + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].Labdips + ' (' + ovariables_leadtimes.leadtimes[i].DiasLabdips + ')' + '¬';
                pardetail += ovariables_leadtimes.leadtimes[i].FechaEntrega + '^';
            }
            let parfoot = '';
            for (let i = 0; i < cantidadregistros; i++) {
                parfoot += 'none' + '¬';
                parfoot += 'none' + '¬';
                parfoot += 'none' + '¬';
                parfoot += 'none' + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasTejido) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasTenidoLavado) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasLavadoPanos) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasHilado) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasAcabado) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasTermofijado) + '¬';
                parfoot += fn_ColorCeldasExcel(ovariables_leadtimes.leadtimes[i].DiasLabdips) + '¬';
                parfoot += 'none' + '^';
            }

            let frm = new FormData();            
            frm.append('par', par);
            frm.append('pardetail', pardetail);
            frm.append('parfoot', parfoot);

            _Post('DesarrolloTextil/SolicitudDesarrolloTela/DownloadFile_Excel_leaddtime', frm)
                .then((odata) => {
                    var xExcel = odata;
                    var d = new Date();
                    //var fecha = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
                    var adlnk = document.createElement("a"), name = "Procesos Pendiente Fabricas " + _getDate() + ".xlsx";
                    adlnk.style = "display: none";
                    var pdf = 'data:application/vnd.ms-excel;base64,' + xExcel;
                    adlnk.href = pdf;
                    adlnk.download = name;
                    adlnk.click();

                    delete adlnk;
                    
                }, (p) => {
                    err_xhr(p);
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
                    contenido += "<li data-indice='-1'> <a onclick='appIndexSDT.paginar(-1, appIndexSDT.cargartabla_leadtimes);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appIndexSDT.paginar(-2, appIndexSDT.cargartabla_leadtimes);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appIndexSDT.paginar(`;
                        contenido += i.toString();
                        contenido += `, appIndexSDT.cargartabla_leadtimes);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appIndexSDT.paginar(-3, appIndexSDT.cargartabla_leadtimes);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appIndexSDT.paginar(-4, appIndexSDT.cargartabla_leadtimes);' > >> </a></li>";
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
                        cargartabla_leadtimes(oUtil.adataresult, 0); //:desactivate                
                    }
                }
            }
        }
        /* : FIN*/

    

        return {
            load: load,
            req_ini: req_ini,
            fn_edit_desarrollotela: fn_edit_desarrollotela,
            cargartabla_leadtimes: cargartabla_leadtimes,
            paginar: paginar,
            fn_EnviarNotificacionLeadTime: fn_EnviarNotificacionLeadTime
        }
    }
)(document, 'panelEncabezado_index_SDT');

(
    function ini() {
        appIndexSDT.load();
        appIndexSDT.req_ini();
    }
)();
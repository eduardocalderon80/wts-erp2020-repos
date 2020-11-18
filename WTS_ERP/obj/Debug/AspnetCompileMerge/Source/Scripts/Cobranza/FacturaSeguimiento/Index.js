/// <reference path="../../home/util.js" />

!function (r) { r.fn.multiSelect = function (t) { r.fn.multiSelect.init(r(this), t) }, r.extend(r.fn.multiSelect, { defaults: { actcls: "active", selector: "tbody tr", except: ["tbody"], statics: [".static"], callback: !1 }, first: null, last: null, init: function (t, e) { this.scope = t, this.options = r.extend({}, this.defaults, e), this.initEvent() }, checkStatics: function (t) { for (var e in this.options.statics) if (t.is(this.options.statics[e])) return !0 }, initEvent: function () { var c = this, n = c.scope, o = c.options, l = o.callback, a = o.actcls; n.on("click.mSelect", o.selector, function (t) { if (t.shiftKey || !c.checkStatics(r(this))) { if (r(this).hasClass(a) ? r(this).removeClass(a) : r(this).addClass(a), t.shiftKey && c.last) { c.first || (c.first = c.last); var e = c.first.index(), i = r(this).index(); if (i < e) { var s = e; e = i, i = s } r(o.selector, n).removeClass(a).slice(e, i + 1).each(function () { c.checkStatics(r(this)) || r(this).addClass(a) }), window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty() } else t.ctrlKey || t.metaKey || r(this).siblings().removeClass(a); c.last = r(this), r.isFunction(l) && l(r(o.selector + "." + a, n)) } }), r(document).on("click.mSelect", function (t) { for (var e in o.except) { var i = o.except[e]; if (r(t.target).is(i) || r(t.target).parents(i).size()) return } n.find(o.selector).each(function () { c.checkStatics(r(this)) || r(this).removeClass(a) }), r.isFunction(l) && l(r(o.selector + "." + a, n)) }), r(document).on("keydown.mSelect", function (t) { if (65 == t.keyCode && (t.metaKey || t.ctrlKey)) return r(o.selector, n).each(function () { c.checkStatics(r(this)) || r(this).addClass(a) }), r.isFunction(l) && l(r(o.selector + "." + a, n)), t.preventDefault(), !1 }), r(document).on("keyup.mSelect", function (t) { 16 == t.keyCode && (c.first = null) }) } }) }(jQuery);
$(function () {
    $('#tblSeguimiento').multiSelect({
        actcls: 'bg-primary',
        selector: 'tbody tr',
        except: ['tbody'],
        statics: ['.danger', '[data-no="1"]'],
        callback:false        
    });
})


var appBuscarSeguimiento = (
    function (d, idpadre) {
       
        var oUtil = {
            adata: [],
            adatalistoperacion: [],
            adataresult: [],
            indiceactualpagina: 0,
            registrospagina: 30,
            paginasbloques: 4,
            indiceactualbloque: 0,
            tableExport: '',
            estadosDefault: 'PENDING-PARTIAL',
            FacFactorizadas: '',
            FacNoFactorizadas: '',
            defectoTipoFactura: '',
            strFiltros:''
        }

        function load() {         
            _('btnBuscarFactura').addEventListener('click', listarFacturas);     
            _('btnExportar').addEventListener('click', exportarExcel);
            _('btnSeguimiento').addEventListener('click', seguimientoFactura,false);
            _('cbotipo').addEventListener('change', cambiarCombotipoFactura);
         }       

        function req_ini() {          
            _promise()
                .then(obtenerFiltros())
                .then(listarFacturas())
        }

        function obtenerFiltros() {
            var urlaccion = 'Cobranza/FacturaSeguimiento/listFiltroIndex';
            Get(urlaccion, llenarCombo)
        }

    /*INICIO EXPORTACION EXCEL */

        function exportarExcel() {
            let parametro = oUtil.strFiltros;               
            let urlaccion = '../Cobranza/FacturaSeguimiento/ExportarExcel?par=' + parametro;
            window.location.href = urlaccion
        }

      
        /*FIN EXPORTACION EXCEL */        
        function llenarCombo(data) {
            let oData = !_aisEmpty(data) ? JSON.parse(data)[0] : null;
             if (oData !== null) {
                _('cboestado').innerHTML = _comboFromCSV(oData.listEstado);
                _('cbocliente').innerHTML = _comboFromCSV(oData.listCliente);
                _('cbotipo').innerHTML = _comboFromCSV(oData.listTipoReporte);
                oUtil.FacFactorizadas = _comboFromCSV(oData.listTipoFacturaFactorizada);                
                oUtil.FacNoFactorizadas = _comboFromCSV(oData.listTipoFactura);   
                _('cboestado').value = oData.defectoEstado;
                _('cbotipo').value = oData.defectoTipoReporte;
                oUtil.defectoTipoFactura = oData.defectoTipoFactura;  
                cambiarCombotipoFactura();
            }
        }

        function cambiarCombotipoFactura() {

            let tipoReporte = _('cbotipo').value;
            let datatipoReporte = tipoReporte == 'FACTORIZADAS' || '' ? oUtil.FacFactorizadas : oUtil.FacNoFactorizadas;
            _('cbotipofactura').innerHTML = datatipoReporte;
            _('cbotipofactura').value = oUtil.defectoTipoFactura;
        }

        function retornarlista() {
            let array = oUtil.adatalistoperacion;
            return array;
        }

        function listarFacturas() {

            $('#myModalSpinner').modal('show'); 
            let estadoFacturas = oUtil.estadosDefault !== '' ? oUtil.estadosDefault : '';            
            let cboEstado = _('cboestado');            
            let codcliente = _('cbocliente').value;
            let tipoReporte = _('cbotipo').value == '' ? 'FACTORIZADAS' : _('cbotipo').value;           
            let facturatipo = _('cbotipofactura').value == '' ? 'P' : _('cbotipofactura').value;
            let estado = !_isEmpty(estadoFacturas)
                ? estadoFacturas
                        : (cboEstado.selectedIndex === 0
                            ? 'ALL'
                    : cboEstado.options[cboEstado.selectedIndex].text);

            let factura = (_('txtfactura').value).replace(/ /g, "");
            let numeroOperacion = (_('txtoperacion').value).replace(/ /g, ""); 

            _('txtfactura').value = factura;
            _('txtoperacion').value = numeroOperacion;

            let par = {
                estado: estado,
                factura: factura,
                codcliente: codcliente,
                tipoReporte: tipoReporte,
                numeroOperacion: numeroOperacion,
                tipoFactura: facturatipo,
                exportacion: 'NO'
            };

            let parExport = {
                estado: estado,
                factura: factura,
                codcliente: codcliente,
                tipoReporte: tipoReporte,
                numeroOperacion: numeroOperacion,
                tipoFactura: facturatipo,
                exportacion:'SI'
            };

            oUtil.strFiltros = JSON.stringify(parExport);
            let url = 'Cobranza/FacturaSeguimiento/Get_InvoiceList?par=' + JSON.stringify(par);

                _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    oUtil.adata = odata;
                    oUtil.adatacsv = rpta;
                    oUtil.adataresult = oUtil.adata;                                
                   
                    _promise()
                        .then(llenartabla(odata))
                        .then($('#myModalSpinner').modal('hide'))
                                      
                });

            oUtil.estadosDefault = '';
        }

        function llenartabla(odata, indice) {

            let html = '';
            let tbody = _('tbody_vaucherList');
            if (indice == undefined) {indice = 0;}

            /* funcionalidad de paginacion*/
            oUtil.adataresult = odata;            
    
            if (odata !== null) {
                let arrNumOperacion = odata.filter(el => el.NumOperacion !== '').map(x => x.NumOperacion);
                oUtil.adatalistoperacion = Array.from(new Set(arrNumOperacion));
                               
                let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
                let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;              

                for (let i = inicio; i <= fin; i++) {
                    if (i < x) {

                        html += `<tr data-par='IdFC:${odata[i].IdFC}' data-id='${odata[i].IdFC}' data-typo='${odata[i].TipoFactura}' data-fac='${odata[i].WtsInvoice}'>                                                                                
                                            <td align="left" class='cls_contacto pointer'  data-codcl='${odata[i].CodCliente}' data-descl='${odata[i].Cliente}' >${odata[i].Cliente}</td>
                                            <td align="center">${odata[i].TipoFactura}</td>
                                            <td align="center"><a  class='cls_historico'  data-codcl='${odata[i].CodCliente}' data-descl='${odata[i].Cliente}' >${odata[i].WtsInvoice}</a></td>
                                            <td align="center">${odata[i].NumOperacion}</td>
                                            <td align="right">${odata[i].WtsInvoiceAmount}</td>
                                            <td align="right">${odata[i].InvoiceBalance}</td>
                                            <td align="center">${odata[i].WtsInvoiceDate}</td>
                                            <td align="center">${odata[i].Via}</td>
                                            <td align="center">${odata[i].POD}</td>
                                            <td align="center">${odata[i].EstadoPOD}</td>
                                            <td align="center">${odata[i].DueDate}</td>
                                            <td align="center">${odata[i].FechaInicioFactor}</td>
                                            <td align="center" class='cls_insert_fechafactor pointer'  data-ope='${odata[i].NumOperacion}' >${odata[i].FechaPagoFactor}</td>
                                            <td align="right">${odata[i].Tardanza}</td>
                                            <td align="right">${odata[i].TardanzaFactor}</td>
                                            <td align="center" class='cls_insert_seguimiento pointer' data-idFc='${odata[i].IdFC}' data-tipo='${odata[i].TipoFactura}'>${odata[i].UltimoSeguimiento}</td>
                                            <td align="center">${odata[i].FechaDePago}</td>`;
                    }
                }
                tbody.innerHTML = html;
                let htmlfoot = page_result(odata, indice);
                _('foot_paginacion').innerHTML = htmlfoot;  

                handler_tbl();

            } else {
                tbody.innerHTML = '';
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro ningun Registro!'
                });
            }         
         }      


        // :seguimiento
        function seguimientoFactura() {            
            const arr = Array.from(_('tblSeguimiento').tBodies[0].getElementsByClassName('bg-primary'));
            
            if (arr.length > 0) {
                //const parametro = '';
                const parametro = arr.map(x => {
                    const idFC = (x.getAttribute("data-id")).replace(/ /g, "");
                    const tipFC = (x.getAttribute("data-typo")).replace(/ /g, "");
                    const numFC = (x.getAttribute("data-fac")).replace(/ /g, "");                   
                    return idFC + '|' + tipFC+'|' + numFC
                    
                }).join('^');

                _modalBody_new({
                    url: 'Cobranza/FacturaSeguimiento/_Seguimiento',
                    ventana: '_Seguimiento',
                    titulo: 'Seguimiento',
                    parametro: parametro,
                    alto: '450',
                    ancho: '1000',
                    responsive: 'modal-lg'
                });


            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe elegir un documento.'
                });
            }

        }

        function handler_tbl() {

            let tbody = _('tbody_vaucherList');
            let arr = Array.from(tbody.rows).filter((el) => el.bgColor ==='');

                arr.forEach(x => {
                    //let btnedit = x.getElementsByClassName('cls_insert_seguimiento')[0];
                    //btnedit.addEventListener('click', fn_insertSeguimiento, false);

                    let btnfecfactor = x.getElementsByClassName('cls_insert_fechafactor')[0];
                    btnfecfactor.addEventListener('click', fn_insertfechaFactor, false); 

                    let btnhistorico = x.getElementsByClassName('cls_historico')[0];
                    btnhistorico.addEventListener('click', fn_Historico, false);                

                    let btncontacto = x.getElementsByClassName('cls_contacto')[0];
                    btncontacto.addEventListener('click', fn_Contacto, false); 
                
                });
            
        }

        function fn_Contacto(e) {
            let o = e.currentTarget;
            let codCliente = o.getAttribute('data-codcl');
            let desCliente = o.getAttribute('data-descl');
            let params = codCliente + '|' + desCliente;

            _modalBody_new({
                url: 'Cobranza/FacturaSeguimiento/_Contacto',
                ventana: '_Contacto',
                titulo: 'Contacto',
                parametro: params,
                alto: '320',
                ancho: '1000',
                responsive: 'modal-lg'
            });

        }

        function fn_Historico(e) {
            let o = e.currentTarget;
            let codCliente = o.getAttribute('data-codcl');
            let desCliente = o.getAttribute('data-descl');
            let params = codCliente + '|' + desCliente;

            _modalBody_new({
                url: 'Cobranza/FacturaSeguimiento/_Historico',
                ventana: '_Historico',
                titulo: 'Historico',
                parametro: params,
                alto: '420',
                ancho: '1000',
                responsive: 'modal-lg'
            });

        }



        // :seguimiento
        function fn_insertSeguimiento(e) {
            let o = e.currentTarget;
            let idFactura = o.getAttribute('data-idFc');       
            let tipo = o.getAttribute('data-tipo');   
            let params = idFactura + '|' + tipo;       

            _modalBody_new({
                url: 'Cobranza/FacturaSeguimiento/_Seguimiento',
                ventana: '_Seguimiento',
                titulo: 'Seguimiento',
                parametro: params,
                alto: '450',
                ancho: '1000',
                responsive: 'modal-lg'
            });
      
        }

        function fn_insertfechaFactor(e) {
            let o = e.currentTarget;
            let numoperacion = o.getAttribute('data-ope');
            let params2 = numoperacion;

            if (numoperacion != '') {
                _modalBody_new({
                    url: 'Cobranza/FacturaSeguimiento/_FechaPagoFactor',
                    ventana: '_FechaPagoFactor',
                    titulo: 'Fecha Pago Factor',
                    parametro: params2,
                    alto: '365',
                    ancho: '800',
                    responsive: 'modal-lg'
                });
            }

        }

  
    function page_result(padata, indice) {
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
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarSeguimiento.paginar(-1, appBuscarSeguimiento.llenartabla);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarSeguimiento.paginar(-2, appBuscarSeguimiento.llenartabla);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appBuscarSeguimiento.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarSeguimiento.llenartabla);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarSeguimiento.paginar(-3, appBuscarSeguimiento.llenartabla);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarSeguimiento.paginar(-4, appBuscarSeguimiento.llenartabla);' > >> </a></li>";
                }
            }

            let foot = `<nav>${contenido}</nav>`;
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
        return {
            load: load,
            paginar: paginar,
            req_ini: req_ini,
            llenartabla: llenartabla,
            listarFacturas: listarFacturas,
            retornarlista: retornarlista,
            exportarExcel: exportarExcel
        }
    }

)(document, 'panelencabezado_seguimiento');
(function ini() {
    appBuscarSeguimiento.load();
    appBuscarSeguimiento.req_ini();
  
})()
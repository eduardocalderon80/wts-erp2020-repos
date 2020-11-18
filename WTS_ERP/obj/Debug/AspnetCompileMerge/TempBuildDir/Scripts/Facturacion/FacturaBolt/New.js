
!function (r) { r.fn.multiSelect = function (t) { r.fn.multiSelect.init(r(this), t) }, r.extend(r.fn.multiSelect, { defaults: { actcls: "active", selector: "tbody tr", except: ["tbody"], statics: [".static"], callback: !1 }, first: null, last: null, init: function (t, e) { this.scope = t, this.options = r.extend({}, this.defaults, e), this.initEvent() }, checkStatics: function (t) { for (var e in this.options.statics) if (t.is(this.options.statics[e])) return !0 }, initEvent: function () { var c = this, n = c.scope, o = c.options, l = o.callback, a = o.actcls; n.on("click.mSelect", o.selector, function (t) { if (t.shiftKey || !c.checkStatics(r(this))) { if (r(this).hasClass(a) ? r(this).removeClass(a) : r(this).addClass(a), t.shiftKey && c.last) { c.first || (c.first = c.last); var e = c.first.index(), i = r(this).index(); if (i < e) { var s = e; e = i, i = s } r(o.selector, n).removeClass(a).slice(e, i + 1).each(function () { c.checkStatics(r(this)) || r(this).addClass(a) }), window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty() } else t.ctrlKey || t.metaKey || r(this).siblings().removeClass(a); c.last = r(this), r.isFunction(l) && l(r(o.selector + "." + a, n)) } }), r(document).on("click.mSelect", function (t) { for (var e in o.except) { var i = o.except[e]; if (r(t.target).is(i) || r(t.target).parents(i).size()) return } n.find(o.selector).each(function () { c.checkStatics(r(this)) || r(this).removeClass(a) }), r.isFunction(l) && l(r(o.selector + "." + a, n)) }), r(document).on("keydown.mSelect", function (t) { if (65 == t.keyCode && (t.metaKey || t.ctrlKey)) return r(o.selector, n).each(function () { c.checkStatics(r(this)) || r(this).addClass(a) }), r.isFunction(l) && l(r(o.selector + "." + a, n)), t.preventDefault(), !1 }), r(document).on("keyup.mSelect", function (t) { 16 == t.keyCode && (c.first = null) }) } }) }(jQuery);
$(function () {
    $('#tblPoBol').multiSelect({
        actcls: 'bg-primary',
        selector: 'tbody tr',
        except: ['tbody'],
        statics: ['.danger', '[data-no="1"]'],
        callback: false
    });
})


var appNewFacturaBolt = (

    function (d, idpadre) {
        var ovariables = {
            idBol:'',
            lstFacturaPo: '',
            arrtipoDocument: '',
            arrDocument: '',
            disable:''
        }

        function load() {

            _('btnreturn').addEventListener('click', fn_return);
            _('btnaddPo').addEventListener('click', fn_addPo);
            _('btnSave').addEventListener('click', fn_save_new); 
            _('btnSend').addEventListener('click', fn_sendConfirm_document); 
            _('btndateFactor').addEventListener('click', updateFechaFactor, false);
            _('btndeleteBol').addEventListener('click', deleteBol, false);

            let IdBol = _('txtpar_new').value;
            fn_validarExistenciaBol(IdBol);

            if (IdBol != '0')
                fn_obtenerFacturaBol(IdBol);
          
        }

        function updateFechaFactor() {
            const arr = Array.from(_('tblPoBol').tBodies[0].getElementsByClassName('bg-primary'));

            if (arr.length > 0) {
                
                const listCodigos = arr.map(x => {
                    
                    const serie = (x.getAttribute("serFactura")).replace(/ /g, "");
                    const correlativo = (x.getAttribute("codFactura")).replace(/ /g, "");
                    return serie + '-' + correlativo

                }).join(',');

                const ListId = arr.map(x => {

                    const idDetalle = (x.getAttribute("IdFactura")).replace(/ /g, "");                    
                    return idDetalle

                }).join(',');

                const parametro = listCodigos + '|' + ListId

                _modalBody({
                    url: 'Facturacion/FacturaBolt/_FechaBol',
                    ventana: '_FechaBol',
                    titulo: 'Date Bol',
                    parametro: parametro,
                    alto: '450',
                    ancho: '1000',
                    responsive: 'modal-lg'
                });

            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe elegir al menos un registro.'
                });
            }
        }

        function deleteBol() {

            const arr = Array.from(_('tblPoBol').tBodies[0].getElementsByClassName('bg-primary'));

            if (arr.length > 0) {

                const listCodigos = arr.map(x => {
                    const serie = (x.getAttribute("serFactura")).replace(/ /g, "");
                    const correlativo = (x.getAttribute("codFactura")).replace(/ /g, "");
                    return serie + '-' + correlativo
                }).join(',');

                const ListId = arr.map(x => {

                    const idDetalle = (x.getAttribute("IdDetalle")).replace(/ /g, "");
                    return idDetalle

                }).join(',');

                const parametro = listCodigos + '|' + ListId

                //mensaje de confirmacion
                    swal({
                        title: "Desea Eliminarlos siguientes documentos: " + listCodigos,
                        text: '',
                        type: "warning",
                        //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "Si",
                        cancelButtonText: "No",
                        closeOnConfirm: true
                    }, function (rpta_confirmacion) {
                            if (rpta_confirmacion) {
                                $.when(EliminarDetalleBD(ListId)).then(EliminarFacturaBoldetalle(ListId));                          
                        }
                        return;
                    });  

                //fin de mensaje de confirmacion 

            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe elegir al menos un registro.'
                });
            }
        }


        function fn_validarExistenciaBol(IdBol) {

            if (IdBol != '0')
                document.getElementById('btnSend').style.display = '';
            else
                document.getElementById('btnSend').style.display = 'none';
        }

        function fn_save_new(bConfirm=true) {

            let atx = _getParameter({ id: 'panelEncabezado_Bolt', clase: '_enty_grabar' })
            let arr_PoBol = null;           
            let form = new FormData();
            let urlaccion = 'Facturacion/FacturaBolt/Save_New';                                     
           
            if (_('tbody_PoBol').rows.length > 0) {

                arr_PoBol = ObtenerPoBol();  
                form.append('par', JSON.stringify(atx));
                form.append('pardetalle', JSON.stringify(arr_PoBol));

                _Post(urlaccion, form, true)
                    .then((rpta) => {

                        if (bConfirm) {
                            let orpta = rpta !== '' ? JSON.parse(rpta) : null;

                            if (orpta !== null) {

                                let IdBol = orpta.id;
                                let odata = orpta.data !== '' ? JSON.parse(orpta.data) : null;
                                let dataBol = null;
                                let odataBolDetalle = null;
                                _('_title').innerText = 'Group Nro #' + IdBol;
                                fn_validarExistenciaBol(IdBol);

                                if (odata !== null) {

                                    dataBol = odata[0].BOL !== '' ? JSON.parse(odata[0].BOL) : null;

                                    if (dataBol !== null) {

                                        _('hf_idPoBol').value = dataBol.IdBol;
                                        odataBolDetalle = odata[0].BOLDETALLE;
                                        ejecutarDespuesGrabar(IdBol, odataBolDetalle);

                                        if (bConfirm)
                                            _swal(orpta);


                                    } else {
                                        swal({
                                            type: 'error',
                                            title: 'Oops...',
                                            text: 'Error!!'
                                        });
                                    }
                                } else {
                                    swal({
                                        type: 'error',
                                        title: 'Oops...',
                                        text: 'Error!!'
                                    })
                                }
                            }
                        }
                    }, (p) => {
                        err(p);
                    });
            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe ingrear al menos una factura!!'
                });
            }
        }

        function fn_sendConfirm_document() {

            let strHtml = ObtenerHtmlPoBol();

            if (strHtml !== '') {

                swal({
                    title: "Deseas enviar los documentos al cliente?",
                    text: '',
                    type: "warning",
                    //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: true
                }, function (rpta_confirmacion) {
                    if (rpta_confirmacion) {
                        fn_send_document();
                    } 
                    return;
                });              

            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'El codigo Bol de es obligatorio para el envio de la información.'
                });
            }
          
        }

        function fn_send_document() {
            generarEnvioFactura();            
            //$.when(fn_save_new(false)).then(generarEnvioFactura());

        }

        function generarEnvioFactura() {

            let IdBol = _getParameter({ id: 'panelEncabezado_Bolt', clase: '_enty_grabar' })
            let arr_PoBol = ObtenerIdFacturaEnvio();
            let form = new FormData();
            let urlaccion = 'Facturacion/FacturaBolt/Send_BolFtp';        
            let arr_PoBol_ = ObtenerPoBolSend();

            form.append('par', IdBol.hf_IdPolBol);
            form.append('pardetalle', JSON.stringify(arr_PoBol));
            form.append('par_', JSON.stringify(IdBol));
            form.append('pardetalle_', JSON.stringify(arr_PoBol_));

            _Post(urlaccion, form, true)
                .then((rpta) => {
                    $('#myModalSpinner').modal('show');

                    let errores = rpta.split('||')

                    if (errores.length == 1) { 
                        let orpta = rpta !== '' ? JSON.parse(rpta) : null;

                        if (orpta !== null) {

                            let IdBol = orpta.id
                            let odata = orpta.data !== '' ? JSON.parse(orpta.data) : null;
                            let dataBol = null;
                            let odataBolDetalle = null;

                            if (odata !== null) {

                                dataBol = odata[0].BOL !== '' ? JSON.parse(odata[0].BOL) : null;

                                if (dataBol !== null) {

                                    _('hf_idPoBol').value = dataBol.IdBol;
                                    fn_validarEnvio(dataBol.Enviado);
                                    odataBolDetalle = odata[0].BOLDETALLE;
                                    ejecutarDespuesGrabar(IdBol, odataBolDetalle);
                                    $('#myModalSpinner').modal('hide');
                                    _swal(orpta);


                                } else {
                                    swal({
                                        type: 'error',
                                        title: 'Oops...',
                                        text: 'Error!!'
                                    });
                                }
                            } else {
                                swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Error!!'
                                })
                            }
                        }

                    } else {

                        let msg = '';
                        let ErrorEstructura = (errores[1].toString()).split('|')
                        ErrorEstructura.forEach(function (error) {
                            msg += error +'-------';
                        });

                        swal({
                            type: 'error',
                            title: 'Oops...',
                            text: msg
                        });

                    }
                }, (p) => {
                    err(p);
                });
        }

        function fn_obtenerFacturaBol(IdBol) {

            let form = new FormData();
            let urlaccion = 'Facturacion/FacturaBolt/Get_FacturaPoBolInd';

            form.append('par', IdBol);        

            _Post(urlaccion, form)
                .then((rpta) => {

                    let orpta = rpta !== '' ? JSON.parse(rpta) : null;

                    if (orpta !== null) {

                        let IdBol = orpta.id
                        _('_title').innerText = 'Documento Nro #' + IdBol;

                        let odata = orpta.data !== '' ? JSON.parse(orpta.data) : null;
                        let dataBol = null;
                        let odataBolDetalle = null;

                        if (odata !== null) {

                            dataBol = odata[0].BOL !== '' ? JSON.parse(odata[0].BOL) : null;

                            if (dataBol !== null) {

                                _('hf_idPoBol').value = dataBol.IdBol;
                                fn_validarEnvio(dataBol.Enviado);
                                odataBolDetalle = odata[0].BOLDETALLE;

                                ejecutarDespuesGrabar(IdBol, odataBolDetalle);                              

                            } else {
                                swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Error!!'
                                });
                            }
                        } else {
                            swal({
                                type: 'error',
                                title: 'Oops...',
                                text: 'Error!!'
                            })
                        }
                    }

                }, (p) => {
                    err(p);
                });
        }

        function fn_validarEnvio(estadoControl) {

            ovariables.disable = estadoControl;
     
            if (estadoControl === 'disabled') {
                //document.getElementById('btnSave').style.display = 'none';
                //document.getElementById('btnSend').style.display = 'none';
                document.getElementById('divBuscador').style.display = 'none';
            }
        }

        function ejecutarDespuesGrabar(IdBol, odataBolDetalle) {
            let oDetalle = null;
            switch (IdBol) {
                case '0':
                    oDetalle = CSVtoJSON(odataBolDetalle, '¬', '^');
                    res_DibujarFacturaPo('', oDetalle);                 
                    break;

                default:
                   
                    oDetalle = CSVtoJSON(odataBolDetalle, '¬', '^');
                    $("#tbody_PoBol").empty();
                    res_DibujarFacturaPo('', oDetalle);                   
                    break;
                
            }
        }

        function _swal(orespuesta, titulo, fun) {
            let tipo = !_isEmpty(orespuesta.estado) ? (orespuesta.estado === 'success' ? 'success' : 'error') : 'error',
                title = !_isEmpty(titulo) ? titulo : 'Message',
                mensaje = !_isEmpty(orespuesta.mensaje) ? orespuesta.mensaje : 'Pending Message?',
                fn = (fun !== null && fun !== undefined) ? fun : null;

            swal({
                title: title,
                text: mensaje,
                type: tipo
            })
        }
        
        function ObtenerIdFacturaEnvio() {
            const arrRows = Array.from(_('tblPoBol').tBodies[0].rows);
            const facturas = arrRows
                .filter(x => x.cells[0].getElementsByClassName("_bol")[0].checked)
                .map(x => {                    
                    let IdFactura = x.getAttribute('IdFactura').replace('"', '').replace('"', '');
                    return `${IdFactura}`;
                }).join(',')
            return facturas;
        }

        function ObtenerPoBolSend() {

            const arrRows = Array.from(_('tblPoBol').tBodies[0].rows);            
            const arr = arrRows
                .filter(x => x.cells[0].getElementsByClassName("_bol")[0].checked )
                .map(x => {
                    let IdDetalle = x.getAttribute('IdDetalle');
                    let IdFactura = x.getAttribute('IdFactura');
                    let CodFactura = x.getAttribute('codFactura');
                    let CodCliente = x.getAttribute('codCliente');
                    let CodPo = x.getAttribute('codPo');
                    let estado = x.getAttribute('estado');
                    let CodBol = x.cells[3].children[0].value;
                    let strBol = _('txtfecha_' + IdFactura).value;
                    let codfecha = '';
                    if (strBol != '') {
                        let DateBol = (strBol).split("/");
                        codfecha = DateBol[2] + DateBol[0] + DateBol[1];
                    }
                    return ({
                        IdDetalle: IdDetalle,
                        IdFactura: IdFactura,
                        CodFactura: CodFactura,
                        CodCliente: CodCliente,
                        CodPo: CodPo,
                        CodBol: CodBol,
                        DateBol: codfecha
                    })
            })
            return arr;
        }

        function ObtenerPoBol() {

            let tbl = _('tbody_PoBol');
            let totalFilas = tbl.rows.length;
            let arr = [];

            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];           

                let IdDetalle = row.getAttribute('IdDetalle');
                let IdFactura = row.getAttribute('IdFactura');
                let CodFactura = row.getAttribute('codFactura');
                let CodCliente = row.getAttribute('codCliente');
                let CodPo = row.getAttribute('codPo');
                let estado = row.getAttribute('estado');
                let CodBol = row.cells[3].children[0].value;
                let strBol = _('txtfecha_'+IdFactura).value;
                let codfecha = '';
                if (strBol != '') {
                    let DateBol = (strBol).split("/");
                    codfecha = DateBol[2] + DateBol[0] + DateBol[1];
                }

                

                //let CodBol = _('txt_' + IdFactura).textContent;
                if (estado != 'A') {
                    obj = {
                        IdDetalle: IdDetalle,
                        IdFactura: IdFactura,
                        CodFactura: CodFactura,
                        CodCliente: CodCliente,
                        CodPo: CodPo,
                        CodBol: CodBol,
                        DateBol: codfecha
                    }

                    arr[i] = obj;
                }
            }
            return arr;
        }

        function ObtenerHtmlPoBol() {

            let tbl = _('tbody_PoBol');
            let totalFilas = tbl.rows.length;
            let strHtml = '';
            let strHtmlTotal = '';
            let bValidacion = true;

            for (i = 0; i < totalFilas; i++) {

                row = tbl.rows[i];
                
                let CodFactura = row.getAttribute('codFactura');
                let CodPo = row.getAttribute('codPo');
                let CodBol = row.cells[3].children[0].value;                     

                strHtml += '<tr>'
                strHtml += '<td>' + CodPo + '</td>';
                strHtml += '<td>' + CodFactura + '</td>';            
                strHtml += '<td>' + CodBol + '</td>';
                strHtml += '</tr>'               

                if (CodBol.trim() === '' || CodBol.trim() === '0')
                    bValidacion = false;
             
            }

            strHtmlTotal += '<table class="table table-bordered">'
            strHtmlTotal += '<thead>'
            strHtmlTotal += '<tr>'
            strHtmlTotal += '<th class="col-sm-4">Factura</th>'
            strHtmlTotal += '<th class="col-sm-4">Pedido</th>'
            strHtmlTotal += '<th class="col-sm-2">Bol</th>'
            strHtmlTotal += '</tr>'
            strHtmlTotal += '</thead>'
            strHtmlTotal += '<tbody>'
            strHtmlTotal +=  strHtml
            strHtmlTotal += '</tbody>'
            strHtmlTotal += '</table>'


            if (!(bValidacion))
                strHtmlTotal = ''

            return strHtmlTotal;
        }

        function fn_return() {
            let urlaccion = 'Facturacion/FacturaBolt/Index',
                urljs = 'Facturacion/FacturaBolt/Index';
            _Go_Url(urlaccion, urljs);
        }
       
        function fn_addPo() {
          
            let txtnroPo = _("txtnrodoc").value;            
      
            if (fn_ValidarPoVacio(txtnroPo)) {
                fn_BuscarPo(txtnroPo);
            }
        }     
         
        function fn_BuscarPo(nroPo) {

            let bValida = true;
            if (fn_ValidarPoGrilla(nroPo)) {
                const par = nroPo;
                const urlaccion = 'Facturacion/FacturaBolt/GetData_FacturaPo?par=' + par;
                Get(urlaccion, fn_evaluarRespuesta);
            }
        }

        function fn_ValidarPoGrilla(nroPo) {

            let mensaje = "";
            let bValida = true;
            let tbl = _('tbody_PoBol');
            let totalFilas = tbl.rows.length;

            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
                let nroPoGrilla = row.getAttribute('codPo');
                nroPo = nroPo.trim();
                if (nroPo == nroPoGrilla) {
                    mensaje += "El numero de PO ya existe, ingrese PO valido";
                }
            }

            if (mensaje.length > 0) {
                bValida = false;
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: mensaje
                });
            }
            return bValida;
        }        

        function fn_evaluarRespuesta(respuesta) {

            let objRespuesta;

            if (respuesta != "") {
                objRespuesta = JSON.parse(respuesta);
                res_DibujarFacturaPo(respuesta, objRespuesta);
                _("txtnrodoc").value = '';
            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Po.'
                });
            }
        }

        function res_DibujarFacturaPo(respuesta, objRespuesta) {

            if (respuesta != "" || objRespuesta !== null) {

                ovariables.lstFacturaPo = objRespuesta; 
                
                let vbutton  = "<button class ='btn btn-danger btn-sm _eliminarPo' title='Delete'>";
                    vbutton += "<span class='fa fa-trash'></span>";
                    vbutton += " </button>";
                let style = 'style="text-align:center"';
                if (ovariables.disable === 'disabled') { vbutton = '' };
                let IdBol = (ovariables.lstFacturaPo[0]["Bol"]).toString();
                let IdBolPagina = _('hf_idPoBol').value;

                if (IdBol === IdBolPagina || IdBol === '0') {

                    ovariables.lstFacturaPo.forEach(x => {

                        html = `<tr id="tr_${x.BolDetalle}" data-par='${x.Bol}'  IdDetalle='${x.BolDetalle}' codCliente='${x.Cod_Cliente}'  IdFactura='${x.Factura}' serFactura='${x.Serie}' codFactura='${x.cod_factura}' codPo= '${x.Po}' estado= '${x.estado}'>                                    
                                    <td class='text-center'>
                                        <div class='btn-group'>
                                            <div class="i-checks _divgroup_busqueda">
                                                <input type="checkbox" id='chk_${x.BolDetalle}' checked class="i-checks _bol" value="1" data-valor="0" style="position: absolute; opacity: 0;">
                                            </div>                                       
                                        </div>
                                    </td>
                                    <td ${style}>${x.Po}</td> 
                                    <td ${style}>${x.Serie}-${x.cod_factura}</td>                                
                                    <td ${style}>
                                        <input type='text' id='txt_${x.Factura}' placeholder='' value='${x.codBol}' class ='form-control _clsBol text-right' data-type='text' data-min='1' data-max='3' data-required="true"  />
                                    </td>
                                    <td ${style} >
                                          <input id="txtfecha_${x.Factura}" type='text' disabled class='form-control _enty' value="${x.dateBol}"  data-type="date" data-min="10" data-max="10" data-level="true" data-id="fechacese">
                                    </td> 
                                    <td ${style} >${x.fechaEnvio}</td> 
                                    <td ${style} >${x.fechaRecepcion}</td> 
                                    <td ${style} >${x.fechaRespuesta}</td> 
                                    <td ${style} >${x.estadoRespuesta}</td> 
                                </tr>`;
                        $('#tbody_PoBol').append(html);
                    });

                    $('.i-checks._bol').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    }).on('ifChanged', function (e) {
                        let dom = e.currentTarget;
                    });                    
                    //handlerAccionTblPo();
                } else {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Po ya se encuentra registrado en el Bol: "' + IdBol+'".'
                    });
                }

            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Po.'
                });
            }
        }

        function fn_ValidarPoVacio(nroPo) {

            let bValida = true;
            let mensaje = '';   

            if (_isEmpty(nroPo)) {
                mensaje = "Ingrese un numero de pedido.";
                bValida = false;
            };

            if (mensaje.length > 0) {
                bValida = false;
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: mensaje
                });
            }
            return bValida;
        }

        function handlerAccionTblPo() {

            let tbl = _('tblPoBol');
            let arrayDelete = _Array(tbl.getElementsByClassName('_eliminarPo'));
            arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'drop'); }));
        }

        function controladoracciontabla(event, accion) {

            let o = event.target;
            let tag = o.tagName;
            let fila = null;
            let par = '';
            let IdBol = _('txtpar_new').value;

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {

                if (_('tbody_PoBol').rows.length > 1 || IdBol === '0') {
                    par = fila.getAttribute('iddetalle');
                    if (par != null && par != '0' && IdBol !='0') {
                        $.when(EliminarDetalleBD(par)).then(EliminarFacturaBol(fila, par));
                    } else {
                        EliminarFacturaBol(fila, par);
                    }
                } else {
                    fn_ConfirmEliminar_document();
                }
            }
        }

        function EliminarDetalleBD(idDetalle) {

            let parametro = { idDetalle: idDetalle };
            let url = 'Facturacion/FacturaBolt/EliminarDetalleBol';
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));

            _Post(url, frm)
                .then((rpta) => {
                   
                    return true;
                })
                .catch((e) => {
                    err_xhr(e);
                });
        }

        function fn_ConfirmEliminar_document() {            

            swal({
                title: "Desea Eliminar el documento de envio de facturas al cliente?",
                text: '',
                type: "warning",
                //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (rpta_confirmacion) {
                if (rpta_confirmacion) {
                    fn_Eliminar_Bol();
                }
                return;
            });           

        }

        function fn_Eliminar_Bol() {

            let bol = _getParameter({ id: 'panelEncabezado_Bolt', clase: '_enty_grabar' })
            let form = new FormData();
            let urlaccion = 'Facturacion/FacturaBolt/EliminarBol';            

            form.append('par', JSON.stringify(bol));
            
            _Post(urlaccion, form, true)
                .then((rpta) => {
                    req_Index();
                }, (p) => {
                    err(p);
                });
            
        }

        function req_Index() {

            let urlaccion = 'Facturacion/FacturaBolt/Index';
            let urljs = 'Facturacion/FacturaBolt/Index';
            let parametro = `0`;
           
            _Go_Url(urlaccion, urljs, parametro);
        }

        function EliminarFacturaBol(fila, par) {
            fila.parentNode.removeChild(fila);
        }

        function EliminarFacturaBoldetalle(ListId) {

            let arrId = ListId.split(',')

            arrId.forEach(
                id => $("#tr_"+id).remove()              
            );         
            //fila.parentNode.removeChild(fila);
        }

        return {
            load: load,
            ObtenerPoBolSend: ObtenerPoBolSend
           
        }
    }
)(document, 'panelEncabezado_Bolt');

(
    function ini() {
        appNewFacturaBolt.load();
       
    }
)();
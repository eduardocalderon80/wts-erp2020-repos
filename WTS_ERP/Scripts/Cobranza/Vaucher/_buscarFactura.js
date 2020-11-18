var appPopupVaucher = (
    function (d, idpadre) {
        var ovariables = {
            idFactura:'',
            listFactura: '',
            codCliente: '',
            Cliente: '',
            codFecBusqueda: '',
            FecBusqueda: '',
            fecha: '',
            disable:''
        }

        function load() {

            _('btnSaveFacturas').addEventListener('click', guardarFacturasVaucher);

            $("#divTablaDetalle  .i-checks._cls_criterio_cabecera").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), estado = dom.checked;
                seleccionar_all_chk_criterio(estado);
            });            
            req_ini();
            filter_header();
        }   

        function seleccionar_all_chk_criterio(estado) {
     
            let tbody = _('tbody_FacVaucher'), arr_rows = Array.from(tbody.rows);

            arr_rows.forEach(x => {

                let chk = x.getElementsByClassName('_group_busqueda')[0];
                chk.checked = estado;

                if (estado === true) {
                    chk.parentNode.classList.add('checked');
                } else {
                    chk.parentNode.classList.remove('checked');
                }
            });
        }

        function listarFacturas() {

            let params = $('#valorParams').val();
            let arrParams = params.split("_");
            let cliente = arrParams[0];//$('#cboCliente').val();
            let fecha = arrParams[1];//$('#cboFecha').val();
            let par = { codCliente: cliente, fecha: fecha };
            const urlaccion = 'Cobranza/vaucher/Get_FacturaList?par=' + JSON.stringify(par);

            Get(urlaccion, fn_evaluarRespuesta);
        }

        function fn_evaluarRespuesta(respuesta) {

            if (respuesta != "") {              
                let objRespuesta = CSVtoJSON(respuesta, '¬', '^');                        
                res_DibujarFacturaList(respuesta, objRespuesta);
            } else {

                document.getElementById("modal__buscarFactura").style.display = "none";   

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Documentos.'
                });
            }
        }

        function res_DibujarFacturaList(respuesta, objRespuesta) {

            if (respuesta != "" || objRespuesta !== null) {

                ovariables.listFactura = objRespuesta;
                dibujarTabla(objRespuesta);               
                  
            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Po.'
                });
            }
        }

        function dibujarTabla(objRespuesta) {

            let html = '';
            let tbody = _('tbody_FacVaucher');
            objRespuesta.forEach(x => {

                let ctrlCheck = `<input type="checkbox" id='chk_${x.Id_FacturaUsa}_${x.Id_Pago_FC}' class="i-checks _group_busqueda" value="1" name="name_chk_busqueda" data-valor="0" style="position: absolute; opacity: 0;">`

                html += `<tr IdPago='${x.Id_Pago_FC}' IdFactura='${x.Id_FacturaUsa}' Factor='${x.Factor}'  codCliente='${x.codCliente}'  Cliente='${x.Cliente}'  Factura='${x.Factura}'  IdCredit='${x.Id_Credit}'  Credit='${x.Credit}'  Monto='${x.Monto}' Comentario='${x.Comentario}' FechaFactura='${x.FechaFactura}'  FecBusqueda='${x.FecBusqueda}'  codFecBusqueda='${x.codFecBusqueda}'      >
                                    <td class ='text-center'>
                                        <div class="i-checks _divgroup_busqueda">
                                           `+ ctrlCheck + `
                                        </div>
                                    </td>
                                    <td>${x.Cliente}</td> 
                                    <td>${x.Factura}</td>                                
                                    <td>${x.Credit}</td>  
                                    <td>${x.FechaFactura}</td>  
                                    <td>${x.Monto}</td>  
                                    <td>${x.Comentario}</td>   
                              </tr>`;               
            });

            tbody.innerHTML = html;

            $('.i-checks._group_busqueda').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget;
            });
        }

        function filter_header() {
            var name_filter = "_clsfilter";
            var filters = _('panelPopup_Vaucher').getElementsByClassName(name_filter);
            var nfilters = filters.length, filter = {};

            for (let i = 0; i < nfilters; i++) {
                filter = filters[i];
                if (filter.type == "text") {
                    filter.value = '';
                    filter.onkeyup = function () {
                        let objRespuesta = event_header_filter(name_filter);

                        dibujarTabla(objRespuesta)

                    }
                }
            }
        }

        function event_header_filter(fields_input) {
            let adataResult = [], adata = ovariables.listFactura;

            if (adata.length > 0) {
                var fields = _('panelPopup_Vaucher').getElementsByClassName(fields_input);
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

                                let valorstr1 = adata[i][field].toString().toLowerCase();
                                exito = exito && (value == "" || valorstr1.indexOf(value) > -1);
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

        function obtenerFacturasVaucher() {

            let tbl = _('tbody_FacVaucher');
            let totalFilas = tbl.rows.length;
            let arr = [];

            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
           
                let Idpago = row.getAttribute('IdPago');
                let IdFactura = row.getAttribute('IdFactura');
                let Id = 'chk_'+IdFactura + '_' + Idpago;
                if ($('#' + Id).is(':checked')) {

                    let Factor = row.getAttribute('Factor');
                    let codCliente = row.getAttribute('codCliente');
                    let Cliente = row.getAttribute('Cliente');
                    let Factura = row.getAttribute('Factura');
                    let IdCredit = row.getAttribute('IdCredit');
                    let Credit = row.getAttribute('Credit');
                    let Monto = row.getAttribute('Monto');
                    let Comentario = row.getAttribute('Comentario');
                    let FechaFactura = row.getAttribute('FechaFactura'); 
                    let FecBusqueda = row.getAttribute('FecBusqueda');
                    let codFecBusqueda = row.getAttribute('codFecBusqueda');

                    ovariables.codCliente = codCliente;
                    ovariables.Cliente = Cliente;
                    ovariables.codFecBusqueda = codFecBusqueda;
                    ovariables.FecBusqueda = FecBusqueda;

                    obj = {
                        Factor: Factor,
                        Idpago: Idpago,
                        IdFactura: IdFactura,
                        codCliente: codCliente,
                        Cliente: Cliente,
                        Factura: Factura,
                        IdCredit: IdCredit,
                        Credit: Credit,
                        Monto: Monto,
                        Comentario: Comentario,
                        FechaFactura: FechaFactura,
                        FecBusqueda: FecBusqueda
                    }                 
                    arr.push(obj);
                }
                //let CodBol = _('txt_' + IdFactura).textContent;                
            }
            return arr;
            //let Id;
            //let valor = '';
            //$('input[name="name_chk_busqueda"]').each(function () {
            //    Id = $(this).attr("id")
            //    if ($('#' + Id).is(':checked')) {
            //        cboFabric = ($("#cboFabric_" + Id).data("kendoComboBox")).text();
            //        var txtFabric = $("#txtFabric_" + Id).val();
            //        Fabric = Fabric + cboFabric + ',' + txtFabric + ';';
            //    }
                
            //});
        }

        function guardarFacturasVaucher(bConfirm = true) {

            let atx = _getParameter({ id: 'panelPopup_Vaucher', clase: '_enty_grabar' })
            let arr_Factura = obtenerFacturasVaucher();
            let form = new FormData();
            let urlaccion = 'Cobranza/Vaucher/Save_New';
            let tmpidVaucher = _('hf_IdVaucher').value;
            if (_('tbody_FacVaucher').rows.length > 0 && arr_Factura!='') {
                
                form.append('par', JSON.stringify(atx));
                form.append('pardetalle', JSON.stringify(arr_Factura));

                _Post(urlaccion, form, true)
                    .then((rpta) => {

                        let idVaucher = rpta;
                        let codCliente = ovariables.codCliente;
                        let Cliente = ovariables.Cliente;
                        let codFecBusqueda = ovariables.codFecBusqueda;
                        let FecBusqueda = ovariables.FecBusqueda;
                        document.getElementById("modal__buscarFactura").style.display = "none"; 
                        let mensaje = 'se modificó el vaucher con exito.';

                        if (tmpidVaucher === '0') {
                            mensaje = 'Se creo el Vaucher con exito';
                        }

                        swal({
                            title: 'Message',
                            text: mensaje,
                            type: 'success'
                        })

                        let params = idVaucher + '_' + codCliente + '_' + codFecBusqueda + '_' + Cliente + '_' + FecBusqueda;
                        req_new(params);
                     
                    }, (p) => {
                        err(p);
                    });
            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Debe agregar al menos un documento!!'
                });
            }
        }

        function req_new(idVaucher) {

            let urlaccion = 'Cobranza/Vaucher/New';
            let urljs = 'Cobranza/Vaucher/New';
            let parametro = idVaucher;
            _Go_Url(urlaccion, urljs, parametro);
        }
                
        function req_ini() {

            let params = $('#valorParams').val();
            let arrParams = params.split("_");
            _('hf_IdVaucher').value = arrParams[2];
            listarFacturas();
        }

        return {
            load: load           
        }
    }
)(document, 'panelPopup_Vaucher');

(
    function ini() {
        appPopupVaucher.load();       
    }
)();
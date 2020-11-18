var appNewVaucher = (
    function (d, idpadre) {
        var ovariables = {
            idVaucher:'',
            lstFacturaPo: '',
            idCliente: '',
            Idfecha: '',
            disable:''
        }

        function load() {
            _('btnreturn').addEventListener('click', fn_return);   
            _('btnBuscarFactura').addEventListener('click', buscarFacturas);   
            _('btnBuscarFactura1').addEventListener('click', buscarFacturas);   
            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            req_ini();
            fn_getDate();
        }         

        function fn_getDate() {

            let odate = new Date();
            let mes = odate.getMonth() + 1;
            let day = odate.getDate();
            let anio = odate.getFullYear();
            if (day < 10) { day = '0' + day }
            if (mes < 10) { mes = '0' + mes }           
            let hasta = `${mes}/${day}/${anio}`;           
            _('txtfechahasta').value = hasta;
        }

        function fn_return() {
            let urlaccion = 'Cobranza/Vaucher/Index',
                urljs = 'Cobranza/Vaucher/Index';
            _Go_Url(urlaccion, urljs);
        }       

        function req_ini() {
            obtenerFiltros();
            validarExistencia();
        }

        function validarExistencia() {

            let Params = _('txtpar_new').value;

            if (Params != '0') {
                let arrParams = Params.split("_");
                let IdVaucher = arrParams[0];//$('#cboCliente').val();
                let codCliente = arrParams[1];
                let codFecha = arrParams[2];
                let cliente = arrParams[3];
                let fecha = arrParams[4];
                ovariables.idCliente = codCliente;
                ovariables.Idfecha = codFecha;
                fn_obtenerFacturaVaucher(IdVaucher);
                _('txtCliente').value = cliente;
                _('txtFecha').value = fecha;
                _('hf_idVaucher').value = IdVaucher;
                document.getElementById("divBuscador").style.display = "none";
                document.getElementById("divBuscadorEdit").style.display = "";
                _('_title').innerText = 'Voucher Nro #' + IdVaucher;                           

            }               
        }
        
        function fn_obtenerFacturaVaucher(IdVaucher) {               
          
            const urlaccion = 'Cobranza/vaucher/Get_vaucherInd?par=' + IdVaucher;
            Get(urlaccion, fn_evaluarRespuestaVaucher);
        }

        function fn_evaluarRespuestaVaucher(respuesta) {

            let objRespuesta;
            if (respuesta != "") {
                objRespuesta = CSVtoJSON(respuesta, '¬', '^');
                res_DibujarFacturaVaucher(respuesta, objRespuesta);
                fn_SumarTotales();
            } else {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Voucher.'
                });
            }
        }

        function fn_SumarTotales() {
            let tbl = _('tbody_Vaucher');
            let totalFilas = tbl.rows.length;
            let montoTotal = 0.00;
            let DocTotal = 0;
            let monto = 0.00;

            for (i = 0; i < totalFilas; i++) {
               
                row = tbl.rows[i];
                monto = parseFloat(row.getAttribute('MontoM'));
                montoTotal += monto;
                DocTotal++;
              
            }
            let newTotal = Number.parseFloat(montoTotal).toFixed(2)
            _('txtDocTotal').value = DocTotal;
            _('txtMontoTotal').value = '$ ' + format(newTotal);
   
        }

        function format(n) {
            n = n.toString()
            while (true) {
                var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
                if (n == n2) break
                n = n2
            }
            return n
        }


        function res_DibujarFacturaVaucher(respuesta, objRespuesta) {

            if (respuesta != "" || objRespuesta !== null) {

                    ovariables.listFactura = objRespuesta;

                let vbutton = "<button class ='btn btn-danger btn-sm _eliminarFac' title='Delete'>";
                    vbutton += "<span class='fa fa-trash'></span>";
                    vbutton += "</button>";

                if (ovariables.disable === 'disabled') { vbutton = '' };

                
                let tbody = _('tbody_Vaucher');
                let html = '';

                objRespuesta.forEach(x => {

                    html += `<tr IdPago='${x.Id_Pago_FC}' IdFactura='${x.Id_FacturaUsa}' IdFactura='${x.Id_FacturaUsa}' IdDetalle='${x.IdDetalle}'  codCliente='${x.codCliente}'  Cliente='${x.Cliente}' Factura='${x.Factura}'  IdCredit='${x.Id_Credit}' Credit='${x.Credit}'  Monto='${x.Monto}'  MontoM='${x.MontoM}' Comentario='${x.Comentario}' FechaFactura='${x.FechaFactura}'   >
                                <td class ='text-center'>
                                <div class ='btn-group'>
                                `+ vbutton + `
                                </div>
                                </td>
                               
                                <td>${x.Factura}</td>                                
                                <td>${x.Credit}</td>  
                                <td>${x.FechaFactura}</td>  
                                <td style="text-align:right">${x.Monto}</td>  
                                <td>${x.Comentario}</td>   
                            </tr>`;                   
                });

                tbody.innerHTML = html;
                handlerAccionTblPo();

            

            } else {

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro Po.'
                });
            }
        }

        function handlerAccionTblPo() {

            let tbl = _('tblVaucher');
            let arrayDelete = _Array(tbl.getElementsByClassName('_eliminarFac'));
            arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'drop'); }));
        }

        function controladoracciontabla(event, accion) {

            let o = event.target;
            let tag = o.tagName;
            let fila = null;
            let par = '';
            
            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {

                if (_('tbody_Vaucher').rows.length > 1) {
                    par = fila.getAttribute('iddetalle');
                    $.when(EliminarDetalleBD(par)).then(EliminarFila(fila, par));

                } else {
                    fn_ConfirmEliminar_document();
                }
            }
        }

        function fn_ConfirmEliminar_document() {  

            swal({
                title: "Desea Eliminar el Voucher?",
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
                    fn_Eliminar_vaucher();
                }
                return;
            });

        }

        function fn_Eliminar_vaucher() {

            let vaucher = _getParameter({ id: 'panelEncabezado_Vaucher', clase: '_enty_grabar' })
            let form = new FormData();
            let urlaccion = 'Cobranza/Vaucher/EliminarVaucher';
            form.append('par', JSON.stringify(vaucher));

            _Post(urlaccion, form, true)
                .then((rpta) => {
                    req_Index();
                }, (p) => {
                    err(p);
                });
        }

        function req_Index() {

            let urlaccion = 'Cobranza/Vaucher/Index';
            let urljs = 'Cobranza/Vaucher/Index';
            let parametro = `0`;

            _Go_Url(urlaccion, urljs, parametro);
        }

        function EliminarDetalleBD(idDetalle) {

            let parametro = { idDetalle: idDetalle };
            let url = 'Cobranza/Vaucher/EliminarDetalle';
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

        function EliminarFila(fila, par) {
            fila.parentNode.removeChild(fila);
            fn_SumarTotales();
        }

        function obtenerFiltros() {
            var urlaccion = 'Cobranza/Vaucher/listFiltroInicial';
            Get(urlaccion, llenarCombo)
        }

        function llenarCombo(data) {
            let rpta = data != null ? JSON.parse(data) : null, html = '';
            if (rpta != null) {                
                _('cboCliente').innerHTML = _comboFromCSV(rpta[0].listCliente);     
                         
            }
        }

        function buscarFacturas() {

            let codCliente = _('cboCliente').value;
            let fecFin = (_('txtfechahasta').value).split("/");
            let codfecha = fecFin[2] + fecFin[0] + fecFin[1];
            let valor = _('hf_idVaucher').value;

            if (valor != '0') {
                codCliente = ovariables.idCliente;
                codfecha = ovariables.Idfecha;               
            }

            let params = codCliente + '_' + codfecha + '_' + valor;

            _modalBody({
                url: 'Cobranza/Vaucher/_buscarFactura',
                ventana: '_buscarFactura',
                titulo: 'Seleccionar Documentos',
                parametro: params,
                alto: '',
                ancho: '800',
                responsive: 'modal-lg'
            });
        }      

        return {
            load: load           
        }
    }
)(document, 'panelEncabezado_Vaucher');

(
    function ini() {
        appNewVaucher.load();       
    }
)();
var Seguimiento = (
    function (d, idpadre) {

        function load() {   
            _('btnsaveseguimiento').addEventListener('click', guardarSeguimiento);
            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();
        }  
             
        function _ini() {
            let params = _('valorParamsSeguimiento').value
            let aData = params.split('^');

            const list = aData.map(x => {
                let arrDatos = x.split('|');
                return arrDatos[2]                
            }).join(';');

            _('txtinvoice').value = list;

            if (aData.length == 1) { 
                listarSeguimiento();
            }
        }

        function listarSeguimiento() {
            let idFactura = _('valorParamsSeguimiento').value; 
            
            let par = {                
                factura: idFactura
            },

                url = 'Cobranza/FacturaSeguimiento/Get_SeguimientoList?par=' + JSON.stringify(par);

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;                  
                    llenartabla(odata);
                });
        }

        function guardarSeguimiento() {

            if (validarSeguimiento()) { 

                let fechaPago = retornarFormatoFecha('txtfechapago');
                let Fechaproxseguimiento = retornarFormatoFecha('txtfechaseguimiento');
                let contacto = _('txtcontacto').value;
                let comentario = _('txtcomentario').value;
                let idFactura = _('valorParamsSeguimiento').value; 

                let objpar = {
                    IdFactura: idFactura,
                    FechaProximoPago: fechaPago,
                    FechaProximoSeguimiento: Fechaproxseguimiento,
                    Contacto: contacto,
                    Comentario: comentario
                }

                let par = JSON.stringify(objpar);
                let urlaccion = 'Cobranza/FacturaSeguimiento/GuardarSeguimiento';
                let form = new FormData();
                form.append('par', par);

                _Post(urlaccion, form, true)
                    .then((rpta) => {

                        let params = _('valorParamsSeguimiento').value
                        let aData = params.split('^');
                        if (aData.length == 1) {
                            listarSeguimiento();
                        }
                       
                        let mensaje = 'Se guardo un nuevo registro.';
                        _('txtcontacto').value='';
                        _('txtcomentario').value='';
                        swal({
                            title: 'Message',
                            text: mensaje,
                            type: 'success'
                        })
                        appBuscarSeguimiento.listarFacturas();
                
                    }, (p) => {
                        err(p);
                    });
            }
        }

        function retornarFormatoFecha(nombreFecha) {

            let fecFin = (_(nombreFecha).value).split("/");
            let codfecha = fecFin[2] + fecFin[0] + fecFin[1];

            return codfecha;
        }

        function validarSeguimiento() {

            let validacion = true;
            let contacto = (_('txtcontacto').value).replace(/ /g, "");
            let comentario = (_('txtcontacto').value).replace(/ /g, "");
            if (contacto == '' || comentario == '') {

                validacion = false;
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'los campos contacto y comentario son obligatorios.'
                });

            }

            return validacion
        }

        function llenartabla(odata, indice) {

            let html = '';
            let tbody = _('tbody_Seguimiento');

            if (indice == undefined) { indice = 0; }
           
            if (odata !== null && odata != '') {
                
                let fin = odata.length, i = 0, x = odata.length;

                for (let i = 0; i <= fin; i++) {
                    if (i < x) {

                        html += `<tr data-par='CodigoFlash:${odata[i].IdFC}}'>                                                                                
                                            <td align="center">${odata[i].Fecha}</td>
                                            <td align="center">${odata[i].ProximoPago}</td>
                                            <td align="center">${odata[i].ProximoSeguimiento}</td>
                                            <td align="left">${odata[i].Contacto}</td>
                                            <td align="left">${odata[i].Comentario}</td></tr>`;
                    }
                }
                tbody.innerHTML = html;            
               
            } else {
                tbody.innerHTML = '';               
            }
        }

        function fn_getDate() {

            let odate = new Date();
            let mes = odate.getMonth() + 1;
            let day = odate.getDate();
            let anio = odate.getFullYear();
            if (day < 10) { day = '0' + day }
            if (mes < 10) { mes = '0' + mes }
            let desde = `01/01/${(anio - 1)}`;
            let hasta = `${mes}/${day}/${anio}`;           
            _('txtfechapago').value = hasta;
            _('txtfechaseguimiento').value = hasta;
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_Seguimiento');

(
    function ini() {
        Seguimiento.load();  
        Seguimiento._ini();    
    }
)();
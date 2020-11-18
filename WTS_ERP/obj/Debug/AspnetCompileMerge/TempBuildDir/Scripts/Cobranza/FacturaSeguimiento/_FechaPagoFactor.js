var appFechaPagoFactor = (
    function (d, idpadre) {

        var oUtil = {           
            adatalistoperacion: []
        }

        function load() {   
            _('btnsavefactor').addEventListener('click', guardarFechaFactor);
            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();
            oUtil.adatalistoperacion = appBuscarSeguimiento.retornarlista();
        }  
             
        function _ini() {
           
            _('txtoperacionpop').value = _('valorParamsFecha').value; 
                     
        }
       
        function guardarFechaFactor() {

            if (validarFechaFactor()) { 

                let fechaPagoFactor = retornarFormatoFecha('txtfechafactor');                
                let operacion = _('txtoperacionpop').value; 

                let objpar = {
                    operacion: operacion,
                    fechaPagoFactor: fechaPagoFactor
                }

                let par = JSON.stringify(objpar);
                let urlaccion = 'Cobranza/FacturaSeguimiento/GuardarFechaPagoFactor';
                let form = new FormData();
                form.append('par', par);

                _Post(urlaccion, form, true)
                    .then((rpta) => {                        

                       
                        let mensaje = 'se actualizo la fecha de pago.';
                        swal({
                            title: 'Message',
                            text: mensaje,
                            type: 'success'
                        })

                        appBuscarSeguimiento.listarFacturas();
                        $("#modal__FechaPagoFactor").modal("hide");
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

        function validarFechaFactor() {

            let validacion = true;
            let msgError = '';

            if (_('txtoperacionpop').value != '') {
                let ListOperacion = (_('txtoperacionpop').value).split(",");
                let array = oUtil.adatalistoperacion;

                let fin = ListOperacion.length, i = 0;

                for (let i = 0; i < fin; i++) {

                    if (array.indexOf(ListOperacion[i]) < 0) {
                        validacion = false;
                        msgError += ListOperacion[i] + ',';
                    }
                }

                if (msgError != '') 
                    msgError = 'las siguientes operaciones no existen: ' + msgError.slice(0, -1) + '.'

            } else {
                validacion = false;
                msgError = 'Debe ingresar al menos un numero de operación.'
            }

            if (msgError != '') {               

                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: msgError
                });
            }
             

            return validacion
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
            _('txtfechafactor').value = hasta;
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_fechaPagoFactor');

(
    function ini() {
        appFechaPagoFactor.load();  
        appFechaPagoFactor._ini();    
    }
)();
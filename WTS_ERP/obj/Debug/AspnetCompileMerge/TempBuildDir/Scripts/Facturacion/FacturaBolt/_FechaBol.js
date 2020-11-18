var _FechaBol = (
    function (d, idpadre) {

        function load() {   
            _('btnsavefechaBol').addEventListener('click', guardarFechaBol);
            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();
        }  
             
        function _ini() {
            let params = _('valorParamsFecha').value
            let aData = params.split('|');
            let listFacturas = aData[0];
            _('txtfacturapop').value = listFacturas;
        }        

        function guardarFechaBol() {           

            let fechaBol = _('txtfechabol').value;
            let params = _('valorParamsFecha').value
            let aData = params.split('|');
            let listidFacturas = aData[1];
            let listId = listidFacturas.split(',');

            let total = listId.length;
            
            for (i = 0; i < total; i++) {               

                _('txtfecha_' + listId[i]).value = fechaBol;
            }  

            $("#modal__FechaBol").modal("hide");
            let mensaje = 'Se modificó las fechas para su actualización.';
            swal({
                title: 'Message',
                text: mensaje,
                type: 'success'
            })
          
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
            _('txtfechabol').value = hasta;
            
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_FechaBol');

(
    function ini() {
        _FechaBol.load();  
        _FechaBol._ini();    
    }
)();
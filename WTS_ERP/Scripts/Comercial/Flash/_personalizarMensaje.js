var personalizarMensaje = (
    function (d, idpadre) {

        var ovariables = {
           
        }

        function load() {        
            _('btnsaveperso').addEventListener('click', guardarMensajePerso);
            _('btncloseperso').addEventListener('click', ocultarPantalla);
        }  
             
        function _ini() {

            let mensaje = appNewFlash.ovariables.msg_tmp;
            let aData = mensaje.split('\n');
            let titulo2 = '';          
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let y = x + 1;
                let linea = aData[x];
                if (linea != '') {
                    titulo2 += '*' + linea +'\n';
                }
            }

            _('txtmensaje').value = titulo2;
        }

        function guardarMensajePerso() {
            
            let mensaje = _('txtmensaje').value;
            let strId = _('valorParamsMensaje').value; 
          
            let aData = mensaje.split('\n');
            let strMensaje = '';
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let y = x + 1;
                let linea = aData[x];
                if (linea != '') {
                    strMensaje +=  linea ;
                }
            }

            let objpar = {
                strId: strMensaje
            }

            let par = JSON.stringify(objpar);
            let urlaccion = 'Comercial/Flash/GuardarMensajeFlash';
            let form = new FormData();
            form.append('par', par);
            form.append('pardetalle', strId);

            _Post(urlaccion, form, true)
                .then((rpta) => {

                    appNewFlash.cargarmensaje(strId, strMensaje)
                    let mensajeStr = 'Se guardo el mensaje.';

                    swal({
                        title: 'Message',
                        text: mensajeStr,
                        type: 'success'
                    })

                    $("#modal__personalizarMensaje").modal("hide");
                }, (p) => {
                    err(p);
                    });           

        }
        
        function ocultarPantalla() {
            $("#modal__personalizarMensaje").modal("hide");
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_mensaje');

(
    function ini() {
        personalizarMensaje.load();  
        personalizarMensaje._ini();    
    }
)();
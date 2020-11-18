var personalizarMargin = (
    function (d, idpadre) {

        var ovariables = {
            marginGarment: 0.00,
            marginGarmentCompl: 0.00,
            marginSummaryCostFact: 0.00,
            marginSummaryCostWts: 0.00
        }

        function load() {        
            _('btnsavepersoMargin').addEventListener('click', guardarMarginPerso);
            _('btnclosepersoMargin').addEventListener('click', ocultarPantalla);
        }  
             
        function _ini() {

            ovariables.marginGarment = appNewFlash.ovariables.marginGarment;
            ovariables.marginGarmentCompl = appNewFlash.ovariables.marginGarmentCompl;
            ovariables.marginSummaryCostFact = appNewFlash.ovariables.marginSummaryCostFact;
            ovariables.marginSummaryCostWts = appNewFlash.ovariables.marginSummaryCostWts;
           
            setearCampos();                
        }

        function setearCampos() {

            _('txt_marginFabric').value = ovariables.marginGarment;
            _('txt_marginComple').value = ovariables.marginGarmentCompl;
            _('txt_marginFactory').value = ovariables.marginSummaryCostFact;
            _('txt_marginWts').value = ovariables.marginSummaryCostWts;

            if (appNewFlash.ovariables.flgbloqueoMargin) {
                document.getElementById('txt_marginFabric').disabled = true;
                document.getElementById('txt_marginComple').disabled = true;               
            }
        }             

        function guardarMarginPerso() {

            let marginFabric = _('txt_marginFabric').value;
            let marginComple = _('txt_marginComple').value;
            let marginFactory = _('txt_marginFactory').value;
            let marginWts = _('txt_marginWts').value;

            appNewFlash.ovariables.marginGarment = marginFabric;
            appNewFlash.ovariables.marginGarmentCompl = marginComple;
            appNewFlash.ovariables.marginSummaryCostFact = marginFactory;
            appNewFlash.ovariables.marginSummaryCostWts = marginWts;
            
            let objpar = {
                marginGarment: marginFabric,
                marginComple: marginComple,
                marginFactory: marginFactory,
                marginWts: marginWts
            }

            let par = JSON.stringify(objpar);
            let urlaccion = 'Comercial/Flash/GuardarMargenFlash';
            let form = new FormData();
            form.append('par', par);

            _Post(urlaccion, form, true)
                .then((rpta) => {

                    appNewFlash.asignarMarginGeneral();

                    $("#modal__personalizarMargin").modal("hide");
                    let mensaje = 'se modificó los margenes a utilizar.';
                    swal({
                        title: 'Message',
                        text: mensaje,
                        type: 'success'
                    })

                    $("#modal__personalizarMensaje").modal("hide");
                }, (p) => {
                    err(p);
                });
        }

        function ocultarPantalla() {
            $("#modal__personalizarMargin").modal("hide");
        }

        return {
            load: load,           
            _ini: _ini        
        }
    }
)(document, 'panelPopup_Margin');

(
    function ini() {
        personalizarMargin.load();  
        personalizarMargin._ini();    
    }
)();
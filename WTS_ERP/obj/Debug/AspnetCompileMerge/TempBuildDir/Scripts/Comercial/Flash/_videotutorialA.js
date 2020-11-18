var _videotutorialA = (
    function (d, idpadre) {

        var ovariables = {
            listCampos: '',
            listCamposPerso: ''
        }

        function load() {   
            _('btncloseTutorial').addEventListener('click', ocultarPantalla);
            let video = appNewFlash.ovariables.link_video;
            document.getElementById('videoflashA').src = video;
        } 

        function ocultarPantalla() {

            $("#modal__videotutorialA").modal("hide");
        }
      
        return {
            load: load           
         
        }
    }
)(document, 'panelPopup_videoflashA');

(
    function ini() {
        _videotutorialA.load();  
      
    }
)();
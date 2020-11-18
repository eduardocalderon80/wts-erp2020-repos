var app_verfotocolgador = (
    function () {
        var ovariables = {
            
        }

        function load() {
            let par = _('txtpar_verfotocolgador').value;
            if (!_isEmpty(par)) {
                //ovariables.ruta_foto = _par(par, 'src');
                let width = _par(par, 'width_img'), height = _par(par, 'height_img'), img = _('img_foto_colgador_preview'),
                    src = _subparameterUncode(_par(par, 'src'));

                img.setAttribute('src', src);
                img.style.width = width + 'px';
                img.style.height = height + 'px';
            }
        }

        function req_ini() {
            
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_verfotocolgador');

(
    function init() {
        app_verfotocolgador.load();
        app_verfotocolgador.req_ini();
    } 
)();
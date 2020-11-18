var app_AddDescription = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            let par = _('adddescription_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');

                _("btnModalCreate").addEventListener("click", function () {
                    if (ovariables.accion === 'newdescription') {
                        const _json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_AddDescription' });
                        let objDescriptionTrim = {
                            description_name: _json.DescripcionNameAvio,
                            description_model: _json.DescripcionModelAvio,
                            description_size: _json.DescripcionSizeAvio,
                            description_color: _json.DescripcionColorAvio
                        } 
                        app_NewTrim.fn_adddescriptionavio(objDescriptionTrim);
                    }
                });
            }
        }

        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_AddDescription');
(
    function ini() {
        app_AddDescription.load();
        app_AddDescription.req_ini();
    }
)();
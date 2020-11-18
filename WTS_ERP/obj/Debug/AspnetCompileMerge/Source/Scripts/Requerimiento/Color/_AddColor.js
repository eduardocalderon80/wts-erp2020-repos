var app_AddColor = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            let par = _('addcolor_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');

                _('txtColorName').addEventListener("keypress", function (e) {
                    if (e.keyCode === 13) {
                        _("btnModalCreate").click();
                    }
                });

                _("btnModalCreate").addEventListener("click", function () {
                    if (ovariables.accion === 'newcolor') {
                        let existe = 0;
                        let existeTipo = 1;
                        [...document.querySelectorAll(".colornameCOLOR table tbody tr")].forEach(x => {
                            const par = x.getAttribute("data-par");
                            if (_par(par, 'colorname') === _('txtColorName').value) {
                                existe = 1;
                            }
                        });

                        if (_('IdTipoProducto').value == '0') {
                            existeTipo = 0;
                        }

                        if (existe == 1 || existeTipo == 0) {

                            if (existe == 1)
                                swal({ title: "Warning", text: "The Combo Name already exists in the list", type: "warning", timer: 5000 });

                            if (existe == 0 || existeTipo == 0)
                                swal({
                                    title: "Warning", text: "You must select a product type", type: "warning", timer: 5000 });

                        } else {
                            app_NewColor.fn_addcomboitem();
                        }
                    } else if (ovariables.accion === 'newornament') {
                        let existe = false;
                        [...document.querySelectorAll(".colornameArt table tbody tr")].forEach(x => {
                            const par = x.getAttribute("data-par");
                            if (_par(par, 'colorname') === _('txtColorName').value) {
                                existe = true;
                            }
                        });
                        if (existe) {
                            swal({ title: "Warning", text: "The Combo Name already exists in the list", type: "warning", timer: 5000 });
                        } else {
                            app_NewOrnament.fn_addcomboitem();
                        }
                    }
                });
            }

            $('#modal_AddColor').on('shown.bs.modal', function () {
                $('#txtColorName').trigger('focus')
            });
        }

        function req_ini() {

            if (ovariables.accion === 'newcolor') {
                _('IdTipoProducto').innerHTML = app_NewColor.ovariables.ListaTipoProductoComboStr;
            } else if (ovariables.accion === 'newornament') {
                _('IdTipoProducto').innerHTML = app_NewOrnament.ovariables.ListaTipoProductoComboStr;
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_AddColor');
(
    function ini() {
        app_AddColor.load();
        app_AddColor.req_ini();
    }
)();
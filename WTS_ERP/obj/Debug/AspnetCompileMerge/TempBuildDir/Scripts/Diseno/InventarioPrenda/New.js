var app_DisenoNew = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {
            _('btnRegresar').addEventListener('click', fn_return);
            _('btnAddRazon').addEventListener('click', fn_reason);
            _('btnBuscarCodigo').addEventListener('click', fn_add);
        }

        function req_ini() {

        }

        function fn_reason() {
            _modalBody_Backdrop({
                url: 'Diseno/InventarioPrenda/_Reason',
                idmodal: 'NewReason',
                paremeter: 'accion:new,id:0',
                title: 'Create/Edit Reason',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearteclado: false,
            });
        }

        function fn_add() {
            _modalBody_Backdrop({
                url: 'Diseno/InventarioPrenda/_Search',
                idmodal: 'SearchCode',
                paremeter: 'accion:new,id:0',
                title: 'Search Code',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearteclado: false,
            });
        }

        function fn_return() {
            const urlAccion = 'Diseno/InventarioPrenda/Index';
            _Go_Url(urlAccion, urlAccion);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_DisenoNew');
(
    function ini() {
        app_DisenoNew.load();
        app_DisenoNew.req_ini();
    }
)();
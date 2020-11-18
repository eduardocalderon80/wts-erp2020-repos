var app_FabricReqAdvance = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {

        }

        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_FabricReqAdvance');
(
    function ini() {
        app_FabricReqAdvance.load();
        app_FabricReqAdvance.req_ini();
    }
)();
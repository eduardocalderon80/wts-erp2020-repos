var app_FabricReqSimple = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: ''
        }

        function load() {

        }

        function req_ini() {

        }

        function fn_remove(e) {
            const tr = e.parentElement.parentElement;
            tr.remove();
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_remove: fn_remove
        }
    }
)(document, 'panelEncabezado_FabricReqSimple');
(
    function ini() {
        app_FabricReqSimple.load();
        app_FabricReqSimple.req_ini();
    }
)();
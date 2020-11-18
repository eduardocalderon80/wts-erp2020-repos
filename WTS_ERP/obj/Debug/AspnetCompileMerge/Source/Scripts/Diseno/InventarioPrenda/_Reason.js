var app_Reason = (
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
)(document, 'panelEncabezado_Reason');
(
    function ini() {
        app_Reason.load();
        app_Reason.req_ini();
    }
)();
var app_NewFabric = (
    function (d, idpadre) {


        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_NewFabric');
    (
        function ini() {
            app_NewFabric.load();
            app_NewFabric.req_ini();
        }
    )();
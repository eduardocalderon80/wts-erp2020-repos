var app_SolicitudPedido_New = (
    function (d, idpadre) {

        function load() {
            _initializeIboxTools();
            //$('#div_datos').slimScroll({
            //    height: '420px',
            //    width: '100%',
            //    railOpacity: 0.9
            //});

            //$('#div_tbl_ic').slimScroll({
            //    height: '310px',
            //    width: '100%',
            //    railOpacity: 0.9
            //});

            $('.footable').footable();
            $('.footable').trigger('footable_resize');
                       
            _('btn_visualizar_items').addEventListener('click', fn_calcular);

        }

        function fn_calcular() {
            $("#modal_calcular").modal("show");
        }

    /* Funciones */

   

    function req_ini(){

    }

    return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'panel_Solicitud_Pedido_New');

(function ini() {
    app_SolicitudPedido_New.load();
    app_SolicitudPedido_New.req_ini();
})();

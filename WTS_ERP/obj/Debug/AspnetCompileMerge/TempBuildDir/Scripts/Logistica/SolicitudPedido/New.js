var app_SolicitudPedido_New = (
    function (d, idpadre) {

        function load() {

            _initializeIboxTools();

            _('txt_fecha_solicitud').value = _getDate103();

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




            //$('#div_fecha_solicitud .input-group.date').datepicker({
            //    //autoclose: true,
            //    dateFormat: 'mm/dd/yyyy',
            //    //monthNames: ['Enero', 'Febreo', 'Marzo',
            //    //     'Abril', 'Mayo', 'Junio',
            //    //     'Julio', 'Agosto', 'Septiembre',
            //    //     'Octubre', 'Noviembre', 'Diciembre'],
            //    //monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            //    //'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            //    //dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            //    ////clearBtn: true,
            //    ////firstDay: 1,
            //    ////language: "es",
            //    //todayHighlight: true
            //}).datepicker("setDate", new Date());

            $('.footable').footable();
            $('.footable').trigger('footable_resize');

            _('btn_visualizar_items').addEventListener('click', fn_calcular);

        }

        function fn_calcular() {
            $("#modal_calcular").modal("show");
        }

        /* Funciones */



        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idrequerimiento: ovariables.id };

            _Get('Logistica/SolicitudPedido/GetInfo_SolicitudPedido?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                    }
                }, (p) => { err(p); });
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

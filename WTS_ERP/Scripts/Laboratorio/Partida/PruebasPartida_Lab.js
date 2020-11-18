var app_Pruebas_Partida_Lab_Edit = (
    function (d, idpadre) {

        function load() {
            $('#div_row').slimScroll({
                height: '750px',
                width: '100%',
                railOpacity: 0.9
            });


            let panel_view = _('pnl_pruebas_partida_lab_edit');
            let arr_item_data = Array.from(panel_view.getElementsByClassName('_data'));
            arr_item_data.forEach(x => x.addEventListener('keyup', e => { fn_movilizar_item(e); }));

            let arr_item_req = Array.from(panel_view.getElementsByClassName('_req'));
            arr_item_req.forEach(x => x.addEventListener('keyup', e => { fn_movilizar_item(e); }));

            let arr_item_data_tbl = Array.from(panel_view.getElementsByClassName('_data_tbl'));
            arr_item_data_tbl.forEach(x => x.addEventListener('keyup', e => { fn_movilizar_item_tbl(e); }));

            _('btn_modal').addEventListener('click', fn_open_modal);
        }

        function fn_open_modal() {
            _modalBody_Backdrop({
                url: 'Laboratorio/Partida/PruebasPartida',
                idmodal: 'Test',
                paremeter: ``,
                title: 'Test',
                width: '',
                height: '570',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        //function fn_newfabric() {
        //    _modalBody_Backdrop({
        //        url: 'Requerimiento/Tela/_NewFabric',
        //        idmodal: 'NewFabric',
        //        paremeter: `id:0,accion:new,idcliente:${ovariables.idcliente}`,
        //        title: 'New Fabric',
        //        width: '',
        //        height: '570',
        //        backgroundtitle: 'bg-green',
        //        animation: 'none',
        //        responsive: 'width-modal-req',
        //        bloquearteclado: false,
        //    });
        //}

        /* Funciones */

        function fn_movilizar_item(e) {
            let o = e.target;
            if (e.keyCode === 13) {
                let div = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let item_data = o.classList.contains('_data');

                let array_item = [];
                if (item_data) { array_item = Array.from(div.getElementsByClassName('_data')); }
                else { array_item = Array.from(div.getElementsByClassName('_req')); }

                let array_item_length = array_item.length;

                let tabini = o.tabIndex, tabnext = tabini + 1;
                let tabtot = 5000 + array_item_length - 1;

                if (tabini == tabtot) { tabnext = tabtot - array_item_length + 1; }

                array_item.forEach(x=> {
                    if (x.tabIndex == tabnext) {
                        x.focus();
                        x.select();
                    }
                });

            }
        }

        function fn_movilizar_item_tbl(e) {
            let o = e.target;
            if (e.keyCode === 13) {
                let div = o.parentNode.parentNode.parentNode.parentNode;
                let item_data = o.classList.contains('_data_tbl');

                let array_item = [];
                if (item_data) { array_item = Array.from(div.getElementsByClassName('_data_tbl')); }
                else { array_item = Array.from(div.getElementsByClassName('_req')); }

                let array_item_length = array_item.length;

                let tabini = o.tabIndex, tabnext = tabini + 1;
                let tabtot = 5000 + array_item_length - 1;

                if (tabini == tabtot) { tabnext = tabtot - array_item_length + 1; }

                array_item.forEach(x=> {
                    if (x.tabIndex == tabnext) {
                        x.focus();
                        x.select();
                    }
                });

            }
        }



        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_pruebas_partida_lab_edit');

(function ini() {
    app_Pruebas_Partida_Lab_Edit.load();
    app_Pruebas_Partida_Lab_Edit.req_ini();
})();

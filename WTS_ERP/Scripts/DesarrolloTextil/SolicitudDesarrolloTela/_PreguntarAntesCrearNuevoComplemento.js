var appPreguntarAntesCrearComplemento = (
    function (d, idpadre) {
        function load() {
            _('_btn_aceptar').addEventListener('click', fn_aceptar, false);

            $('.i-checks._group_pregunta').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {

            });

            //$('.i-checks._group_sub_pregunta').iCheck({
            //    checkboxClass: 'icheckbox_square-green',
            //    radioClass: 'iradio_square-green',
            //}).on('ifChanged', function (e) {

            //});

        }

        function fn_aceptar() {
            _('tab_a_solicitante').innerText = "Complemento",
                arr_opcion_principal = Array.from(_('panelEncabezado_preguntarantescrearcomplemento').getElementsByClassName('_clschk_pregunta')),
                arr_subopcion_principal = Array.from(_('panelEncabezado_preguntarantescrearcomplemento').getElementsByClassName('_clschk_sub_pregunta')),
                opt_valor_seleccionado = null, opcion_seleccionado_paracomplemento = '', escomplemento_peroreferenciapadremuyantiguo = '0',
                escomplemento_peroreferenciapadrehistorico = '0';

            arr_opcion_principal.some(x => {
                if (x.checked) {
                    opt_valor_seleccionado = x.value;
                }
            });

            if (opt_valor_seleccionado === '1') {
                //let opt_subopcion_seleccionado = null;
                //arr_subopcion_principal.some(x => {
                //    if (x.checked) {
                //        opt_subopcion_seleccionado = x.value;
                //    }
                //});

                //if (opt_subopcion_seleccionado === null) {
                //    _swal({ mensaje: 'Falta indicar si la tela principal es Nueva o Historica', estado: 'error' });
                //    return false;
                //}

                //if (opt_subopcion_seleccionado === '1') {
                //    _('tab_usu_comercial').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.add('hide');
                //    appNewSDT.ovariables.opcion_seleccionado_paracomplemento = 'contelaprincipal_nuevo';
                //} else if (opt_subopcion_seleccionado === '2') {
                //    _('lbl_codigotela_o_codigotelaprincipal').innerText = "Nombre Tela Cliente Historico";
                //    _('tab_principal').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.remove('hide')
                //    appNewSDT.ovariables.opcion_seleccionado_paracomplemento = 'contelaprincipal_historico';
                //}

                _('lbl_codigotela_o_codigotelaprincipal').innerText = "Nombre Tela Cliente Historico";
                _('tab_principal').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.remove('hide')
                //appNewSDT.ovariables.opcion_seleccionado_paracomplemento = 'contelaprincipal_historico';
                opcion_seleccionado_paracomplemento = 'contelaprincipal_historico';
                escomplemento_peroreferenciapadrehistorico = '1';
            } else if (opt_valor_seleccionado === '2') {
                _('lbl_codigotela_o_codigotelaprincipal').innerText = "Código Tela";
                _('tab_principal').getElementsByClassName('cls_nombre_telacliente_manual')[0].classList.remove('hide');
                //appNewSDT.ovariables.opcion_seleccionado_paracomplemento = 'concodigotela';
                opcion_seleccionado_paracomplemento = 'concodigotela';
                escomplemento_peroreferenciapadremuyantiguo = '1';
            }

            let arr_tab = Array.from(_('tab_principal').getElementsByClassName('cls_tab_principal')),
                arr_div_nuevocomplementos = Array.from(_('tab_principal').getElementsByClassName('cls_nuevo_complemento'));

            arr_tab.forEach((x, index) => {
                if (index > 0) {
                    x.classList.add('hide');
                }
            });

            arr_div_nuevocomplementos.forEach(x => {
                x.classList.add('hide');
            });

            _('div_chk_contela').classList.remove('hide');
            //_('txtnombretela').value = "";
            //_('cbocliente').options[1].selected = true;
            //_('div_tbl_complementos').classList.add('hide');

            let urlAccion = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT', idsolicituddesarrollotela = _('hf_idsolicituddesarrollotela').value;
            _Go_Url(urlAccion, urlAccion, `accion:new,idgrupocomercial:${appNewSDT.ovariables.idgrupocomercial},idsolicituddesarrollotela_telaprincipal:0,escomplemento_paracrear:1,opcion_seleccionado_paracomplemento:${opcion_seleccionado_paracomplemento},escomplemento_peroreferenciapadremuyantiguo:${escomplemento_peroreferenciapadremuyantiguo},escomplemento_peroreferenciapadrehistorico:${escomplemento_peroreferenciapadrehistorico}`);

            $("#modal__PreguntarAntesCrearNuevoComplemento").modal("hide");
        }

        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)();

(
    function init() {
        appPreguntarAntesCrearComplemento.load();
        appPreguntarAntesCrearComplemento.req_ini();
    }
)();
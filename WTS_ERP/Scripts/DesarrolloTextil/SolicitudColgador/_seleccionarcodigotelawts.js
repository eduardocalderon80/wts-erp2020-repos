var app_seleccionarcodigotelawts = (
    function () {
        var ovariables = {
            invocadopor: '',
            arr_codigotelaseleccionados: []
        }

        function load() {
            let par = _('txtpar_seleccionarcodigotelawts').value;

            if (!_isEmpty(par)) {
                ovariables.invocadopor = _par(par, 'invocadopor');
                ovariables.arr_codigotelaseleccionados = _par(par, 'arr_codigotelaseleccionados') !== undefined ? _par(par, 'arr_codigotelaseleccionados').split('¬') : [];
            }

            _('_btnAceptar_seleccionarcodigotelawts').addEventListener('click', fn_aceptar_tela, false);
        }

        function fn_aceptar_tela() {
            let tbody = _('tbody_seleccionarcodigotelawts'), arr_chk = Array.from(tbody.getElementsByClassName('_clscheck_tela')), arr_codigotela = [],
                hayseleccionados = false, txtpar = _('txtpar_seleccionarcodigotelawts').value;
            
            arr_chk.forEach((x) => {
                if (x.checked) {
                    let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode, datapar = fila.getAttribute('data-par'), codigotela = _par(datapar, 'codigotela'),
                        nombretela = _par(datapar, 'nombretela'), idanalisistextil = _par(datapar, 'idanalisistextil'),
                        obj = { codigotela: codigotela, nombretela: nombretela, idanalisistextil: idanalisistextil };

                    hayseleccionados = true;

                    arr_codigotela.push(obj);
                };
            });

            if (hayseleccionados === false) {
                _swal({ estado: 'error', mensaje: 'Seleccione al menos un codigo de tela...!' });
                return false;
            } else {
                //// VALIDAR
                if (ovariables.invocadopor === undefined || ovariables.invocadopor === '') {
                    if (appSolicitudColgador.validar_antes_agregar_tela(arr_codigotela) === false) {
                        return false;
                    }

                    appSolicitudColgador.llenartabla_codigotela_new(arr_codigotela);
                } else if (ovariables.invocadopor === 'index') {
                    if (appSolicitudAtx.validar_antes_agregar_tela(arr_codigotela) === false) {
                        return false;
                    }

                    appSolicitudAtx.llenartabla_codigotela_new(arr_codigotela);
                }
                
                $('#modal__SeleccionarCodigoTela').modal('hide');
            }
        }

        function res_ini(odata) {
            let html = '', tbody = _('tbody_seleccionarcodigotelawts'), html_true = true;
            odata.forEach((x) => {
                if (ovariables.arr_codigotelaseleccionados.length > 0) {
                    let existe_codigo = false;
                    ovariables.arr_codigotelaseleccionados.some(y => {
                        if (x.codigotela.trim() === y.trim()) {
                            existe_codigo = true;
                            return true;
                        }
                    });

                    if (existe_codigo === false) {
                        html += `
                                <tr data-par='codigotela:${x.codigotela},nombretela:${x.nombretela},idanalisistextil:${x.idanalisistextil}'>
                                    <td>
                                        <label>
                                            <div class ='icheckbox_square-green _clsdiv_chk_tela' style='position: relative;'>
                                                <input type='checkbox' class ='i-checks _clscheck_tela _cls_tela' style='position: absolute; opacity: 0;' name='_chk_tela' value="" data-valor="" />&nbsp
                                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                            </div>
                                        </label>
                                    </td>
                                    <td>${x.codigotela}</td>
                                    <td>${x.nombretela}</td>
                                    <td>${x.stock}</td>
                                    <td>${x.usuario_solicitante}</td>
                                </tr>
                            `;
                    }
                } else {
                    html += `
                            <tr data-par='codigotela:${x.codigotela},nombretela:${x.nombretela},idanalisistextil:${x.idanalisistextil}'>
                                <td>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_tela' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_tela _cls_tela' style='position: absolute; opacity: 0;' name='_chk_tela' value="" data-valor="" />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                                <td>${x.codigotela}</td>
                                <td>${x.nombretela}</td>
                                <td>${x.stock}</td>
                                <td>${x.usuario_solicitante}</td>
                            </tr>
                    `;
                }
            });

            tbody.innerHTML = html;
            handler_tbl();
        }

        function handler_tbl() {
            //// PARA LOS CHECKBOX - I-CHECKS
            $("#panelencabezado_seleccionarcodigotelawts .i-checks._clscheck_tela").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        function req_ini() {
            let txtpar = _('txtpar_seleccionarcodigotelawts').value, codigotela_o_descripcion = _par(txtpar, 'codigotela_o_descripcion'),
                parametro = { codigotela_o_descripcion: codigotela_o_descripcion }
            url = 'DesarrolloTextil/SolicitudColgador/GetCodigoTelaWts?par=' + JSON.stringify(parametro);

            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : null;
                    if (odata !== null) {
                        res_ini(odata);
                    }
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelencabezado_seleccionarcodigotelawts');

(
    function init() {
        app_seleccionarcodigotelawts.load();
        app_seleccionarcodigotelawts.req_ini();
    }
)();
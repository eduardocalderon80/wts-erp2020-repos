var appEnviarCorreo = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial: '',
            idsolicituddesarrollotela: ''
        }

        function load() {
            let par = _('txtpar_enviarcorreofabrica').value;
            if (!_isEmpty(par)) {
                ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
                ovariables.idsolicituddesarrollotela = _par(par, 'idsolicituddesarrollotela');
            }

            _('_btn_enviarcorreo').addEventListener('click', fn_enviarcorreo, false);

            //// PARA LOS CHECKBOX - I-CHECKS
            $("#div_sub_enviarcorreofabrica .i-checks._clscheck_allenviarcorreo_cabecera").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.getAttribute('data-valor'), estado = dom.checked;
                seleccionar_all_chk_enviarcorreo(estado);
            });

        }

        function seleccionar_all_chk_enviarcorreo(estado) {
            let tbody = _('tblbodyenviarcorreofabrica'), arr_rows = Array.from(tbody.rows);

            arr_rows.forEach(x => {
                let chk = x.getElementsByClassName('_clscheck_selectcorreo')[0];
                chk.checked = estado;
                if (estado === true) {
                    chk.parentNode.classList.add('checked');
                } else {
                    chk.parentNode.classList.remove('checked');
                }
            });
        }

        function fn_enviarcorreo() {
            let validar_antesenviar = validar_antes_enviar();

            if (validar_antesenviar) {
                swal({
                    title: "¿Está seguro de enviar el correo?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"
                }, function (rpta) {
                    if (rpta) {
                        enviar_correo_fabrica();
                    }
                });
            }
        }

        function enviar_correo_fabrica() {
            let cbocliente = _('div_cuerpoprincipal').getElementsByClassName('cls_cbocliente')[0],
                idcliente = cbocliente.value,
                nombrecliente = cbocliente.options[cbocliente.selectedIndex].text,
                cbotemporada = _('div_cuerpoprincipal').getElementsByClassName('cls_clientetemporada')[0],
                clientetemporada = cbotemporada.selectedIndex > 0 ? cbotemporada.options[cbotemporada.selectedIndex].text : '',
                url = 'DesarrolloTextil/SolicitudDesarrolloTela/Enviar', frm = new FormData(),
                parametro = { idcliente: idcliente, nombrecliente: nombrecliente, temporada: clientetemporada };

            let arr_telaprincipal_complementos = get_arr_solicitud_telaprincipal_complementos();

            parametro.solicitud_telaprincipal = arr_telaprincipal_complementos.arr_telaprincipal;
            parametro.solicitud_complementos = arr_telaprincipal_complementos.arr_complementos;

            frm.append('parHead', JSON.stringify(parametro));

            _Post(url, frm)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata.estado === 'success') {
                        _swal({ mensaje: odata.mensaje, estado: odata.estado });

                        parametro = `idsolicituddesarrollotela:${appNewSDT.ovariables.idsolicituddesarrollotela},accion:edit`,
                            url = 'DesarrolloTextil/SolicitudDesarrolloTela/NewSDT';
                        _Go_Url(url, url, parametro);

                        $('#modal__EnviarCorreoFabricaSolicitudDesarrollotela').modal('hide');
                    }
                });
        }

        function get_arr_solicitud_telaprincipal_complementos() {
            let tbody = _('tblbodyenviarcorreofabrica'), arr_filas = Array.from(tbody.rows),
                arr_telaprincipal = [], arr_complementos = [], obj_return = {};
            arr_filas.forEach((x) => {
                let chk = x.getElementsByClassName('_clscheck_selectcorreo')[0], seleccionado = chk.checked;
                if (seleccionado) {
                    let datapar = x.getAttribute('data-par'),
                        idsolicituddesarrollotela = _par(datapar, 'idsolicituddesarrollotela'),
                        idsolicituddetalledesarrollotela = _par(datapar, 'idsolicituddetalledesarrollotela'),
                        idproveedor = _par(datapar, 'idproveedor'),
                        referencia_nombretelacliente_padre = _par(datapar, 'referencia_nombretelacliente_padre'),
                        idsolicituddesarrollotela_padre = _par(datapar, 'idsolicituddesarrollotela_padre'),
                        nombretela = x.getElementsByClassName('_cls_nombretela')[0].innerText,
                        estructura = x.getElementsByClassName('_cls_estructura')[0].innerText,
                        fechasolicitud = x.getElementsByClassName('_cls_fechasolicitud')[0].innerText,
                        nombreproveedor = x.getElementsByClassName('_cls_proveedor')[0].innerText,
                        fecharequerida = x.getElementsByClassName('_cls_fecharequerida')[0].innerText,
                        tipo = x.getElementsByClassName('_cls_tipo')[0].innerText,
                        obj = {
                            idsolicituddesarrollotela: idsolicituddesarrollotela,
                            nombretela: nombretela,
                            estructura: estructura,
                            fechasolicitud: fechasolicitud,
                            nombreproveedor: nombreproveedor,
                            fecharequerida: fecharequerida,
                            idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                            tipo: tipo,
                            idproveedor: idproveedor,
                            referencia_nombretelacliente_padre: referencia_nombretelacliente_padre,
                            idsolicituddesarrollotela_padre: idsolicituddesarrollotela_padre
                        };

                    if (tipo === 'telaprincipal') {
                        arr_telaprincipal.push(obj);
                    } else if (tipo === 'complementos') {
                        arr_complementos.push(obj);
                    }
                }
                
            });

            obj_return.arr_telaprincipal = arr_telaprincipal;
            obj_return.arr_complementos = arr_complementos;

            return obj_return;
        }

        function validar_antes_enviar() {
            let arr_chk_seleccionados = Array.from(_('tblbodyenviarcorreofabrica').getElementsByClassName('_clscheck_selectcorreo')),
                hayseleccionados = false, mensaje = '', pasavalidacion = true;

            if (arr_chk_seleccionados.length > 0) {
                arr_chk_seleccionados.some((x) => {
                    if (x.checked) {
                        hayseleccionados = true;
                        return true;
                    }
                });

                if (hayseleccionados) {
                    //// VALIDAR SI EXISTEN CORREOS
                    arr_chk_seleccionados.forEach((x, indice) => {
                        if (x.checked) {
                            let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                                correos = _par(datapar, 'correos').trim(), proveedor = fila.getElementsByClassName('_cls_proveedor')[0].innerText;

                            if (correos === '') {
                                mensaje += `No existe correo para enviar a la fábrica ${proveedor} \n por favor validar información de correo en la opcion [Mail Factory By Client]`;
                                pasavalidacion = false;
                            }
                        }
                    });
                } else {
                    mensaje += 'Falta seleccionar el desarrollo para enviar el correo.';
                    pasavalidacion = false;
                }
            } else {
                mensaje += 'No existe correo para enviar a la fábrica.';
                pasavalidacion = false;
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado:'error' });
            }

            return pasavalidacion;
        }

        function req_ini() {
            let parametro = { idsolicituddesarrollotela: ovariables.idsolicituddesarrollotela, idgrupocomercial: ovariables.idgrupocomercial }, url = 'DesarrolloTextil/SolicitudDesarrolloTela/GetListaFabrica_TelaPrincipal_Complementos_EnviarCorreo?par=' + JSON.stringify(parametro);
            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : null;
                    llenartabla(odata);
                });
        }

        function llenartabla(odata) {
            let html = '';
            if (odata !== null) {
                odata.forEach((x) => {
                    html += `<tr data-par='idsolicituddesarrollotela:${x.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${x.idsolicituddetalledesarrollotela},correos:${x.correos_porproveedor},idproveedor:${x.idproveedor},idsolicituddesarrollotela_padre:${x.idsolicituddesarrollotela_padre},referencia_nombretelacliente_padre:${x.referencia_nombretelacliente_padre}'>
                                <td>
                                    <label>
                                        <div class='icheckbox_square-green _clsdiv_chk_selectcorreo' style='position: relative;'>
                                            <input type='checkbox' class='i-checks _clscheck_selectcorreo _cls_selectcorreo' style='position: absolute; opacity: 0;' name='_chk_selectcorreo' value="" data-valor="" />&nbsp
                                            <ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                                <td>${x.idsolicituddesarrollotela}</td>
                                <td class='_cls_tipo'>${x.tipo}</td>
                                <td class='_cls_estructura'>${x.estructura}</td>
                                <td class='_cls_fechasolicitud'>${x.fechasolicitud}</td>
                                <td class='_cls_proveedor'>${x.nombreproveedor}</td>
                                <td class='_cls_nombretela'>${x.nombretela}</td>
                                <td class='_cls_fecharequerida'>${x.fecharequerida}</td>
                            </tr>
                    `;
                });

                _('tblbodyenviarcorreofabrica').innerHTML = html;
                handler_tabla();
            }
        }

        function handler_tabla() {
            $("#tblbodyenviarcorreofabrica ._clscheck_selectcorreo").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            validar_antes_enviar: validar_antes_enviar
        }
    }    
)();

(
    function init() {
        appEnviarCorreo.load();
        appEnviarCorreo.req_ini();
    }    
)();
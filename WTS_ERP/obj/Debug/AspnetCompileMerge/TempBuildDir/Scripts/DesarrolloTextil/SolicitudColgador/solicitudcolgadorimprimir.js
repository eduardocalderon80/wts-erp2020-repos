var appSolicitudColgadorImprimir = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud: 0,
        }
        function load() {
            let par = _('hf_parametro').value;
            if (!_isEmpty(par)) {
                

            }
        }
        function req_ini() {
            let par = _('hf_parametro').value, idsolicitud = _par(par, 'idsolicitud'), idcolgadorsolicitud = _par(par, 'idcolgadorsolicitud'),
                parametro = { idsolicitud: idsolicitud, idcolgadorsolicitud: idcolgadorsolicitud },
                url = 'DesarrolloTextil/SolicitudColgador/GetSolicitudColgadorImprimir?par=' + JSON.stringify(parametro);

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? JSON.parse(rpta) : null;
                    res_ini(odata);
                })
                .catch((e) => {
                    console.log('error', e);
                });
        }

        function drawBarcode39(divID, value) {
            $("#" + divID).kendoBarcode({
                value: value,
                type: "Code39",
                background: "transparent",
                renderAs: "svg"
            });
        }

        function llenardatos_reporte(odata) {
            if (odata) {
                let solicitud = odata.solicitud !== '' ? CSVtoJSON(odata[0].solicitud) : null,
                    solicituddetalle = odata.colgadordetalle !== '' ? CSVtoJSON(odata[0].colgadordetalle) : null;

                if (solicitud) {
                    _('td_idsolicitud').innerText = solicitud[0].idsolicitud;
                    _('td_fechasolicitud').innerText = solicitud[0].fecha;
                    _('td_nombrecliente').innerText = solicitud[0].cliente;
                    _('td_nombre_usuario_solicitante').innerText = solicitud[0].solicitante;
                    _('td_comentario').innerText = solicitud[0].comentario;
                    _('td_busqueda_x_descripciontela').innerText = solicitud[0].descripciontela;
                    drawBarcode39('divcodigobarra_idsolicitud', solicitud[0].idsolicitud);
                }

                if (solicituddetalle) {
                    let busqueda_x_codigo = solicituddetalle.filter(x => x.tipobusqueda === 'codigotela'),
                        armado_colgadores = solicituddetalle.filter(x => x.tipobusqueda === 'armado'),
                        html = '', html_detalle = '';
                    if (busqueda_x_codigo.length > 0) {
                        busqueda_x_codigo.forEach(x => {
                            html_detalle += `
                                <tr>
                                    <td>${x.codigotela}</td>
                                    <td>${x.descripciontela}</td>
                                </tr>
                            `;
                        });

                        html = `
                            <thead>
                                <tr>
                                    <th>Código Tela</th>
                                    <th>Nombre Tela</th>
                                </tr>
                            </thead>
                            <tbody id="tbody_busqueda_x_codigotela">
                                ${html_detalle}
                            </tbody>
                        `;

                        _('tbl_busqueda_x_codigotela').innerHTML = html;
                    }

                    if (armado_colgadores.length > 0) {
                        html = '';
                        html_detalle = '';

                        armado_colgadores.forEach(x => {
                            html_detalle += `
                                <tr>
                                    <td>${x.nombreproveedor}</td>
                                    <td align="center">${x.nrocolgadores}</td>
                                    <td>${x.comentario}</td>
                                </tr>
                            `;
                        });

                        html += `
                            <thead>
                                <tr>
                                    <th>Fábrica</th>
                                    <th>N° Colgadores</th>
                                    <th>Comentario</th>
                                </tr>
                            </thead>
                            <tbody id="tbody_armado_colgadores">
                                ${html_detalle}
                            </tbody>
                        `;
                        
                        _('tbl_armadocolgadores').innerHTML = html;
                    }
                }
                //handler_div_print();
            }
        }

        //function handler_div_print() {
        //    let arr_div_codigobarra_all = Array.from(_('div_principal_print_all').getElementsByClassName('cls_div_codigobarra'));
        //    arr_div_codigobarra_all.forEach(x => {
        //        let datapar = x.getAttribute('data-par'), codigotela = _par(datapar, 'codigotela');
        //        drawBarcode39(x, codigotela);
        //    });
        //}

        function res_ini(odata) {
            if (odata) {
                llenardatos_reporte(odata);

                setTimeout(() => {
                    window.print();
                }, 1000);
            }
        }
        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'div_imprimir_solicitud');
(
    function () {
        appSolicitudColgadorImprimir.load();
        appSolicitudColgadorImprimir.req_ini();
    }
)();
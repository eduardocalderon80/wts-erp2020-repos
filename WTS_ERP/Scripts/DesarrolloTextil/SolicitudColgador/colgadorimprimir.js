var appColgadorImprimir = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud: 0,
        }
        function load() {
            let par = _('hf_parametro').value;
            if (!_isEmpty(par)) {
                ovariables.idsolicitud = _par(par, 'idsolicitud');
                
            }
        }
        function req_ini() {
            let par = _('hf_parametro').value, idsolicitud = _par(par, 'idsolicitud'), idcolgadorsolicituddetalle_codigogenerado = _par(par, 'idcolgadorsolicituddetalle_codigogenerado'),
                tipobusqueda = _par(par, 'tipobusqueda'), parametro = {
                    idsolicitud: idsolicitud, tipobusqueda: tipobusqueda,
                    idcolgadorsolicituddetalle_codigogenerado: idcolgadorsolicituddetalle_codigogenerado
                },
                //, tipobusqueda: tipobusqueda
                url = 'DesarrolloTextil/SolicitudColgador/GetColgadores_Armado_Para_Imprimir?par=' + JSON.stringify(parametro);
            
            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    res_ini(odata);
                })
                .catch((e) => {
                    console.log('error', e);
                });
        }

        function drawBarcode39(divID, value) {
            //$("#" + divID).kendoBarcode({
            //    value: value,
            //    type: "Code39",
            //    background: "transparent",
            //    renderAs: "svg"
            //});
            $(divID).kendoBarcode({
                value: value,
                type: "Code39",
                background: "transparent",
                renderAs: "svg"
            });
        }

        function llenardatos_reporte(odata) {
            let html = '', arr_registros_a_imprimir = [];
            if (odata) {
                odata.forEach(x => {
                    let total_copias_imprimir = parseInt(x.cantidadcolgadoresfisicosgenerados);
                    for (let i = 0; i < total_copias_imprimir; i++) {
                        arr_registros_a_imprimir.push(x);    
                    }

                    //if (arr_registros_a_imprimir.length > 0) {
                    //}
                    //if (x.idtipocolgador === '1') {  //// BASICO
                    //} else if (x.idtipocolgador === '2') {
                    //    //total_copias_imprimir = parseInt(x.cantidadcolgadoresfisicosgenerados);
                    //    //for (let i = 0; i < total_copias_imprimir; i++) {
                    //    //    arr_registros_a_imprimir.push(x);
                    //    //    //html_interno = pintar_colgador_intermedio(x);
                    //    //    //html += html_interno;
                    //    //}
                    //}
                });

                arr_registros_a_imprimir.forEach(x => {
                    let html_interno = '';
                    if (x.idtipocolgador === '1') {
                        html_interno = pintar_colgador_basico(x);
                        html += html_interno;
                    } else if (x.idtipocolgador === '2') {
                        html_interno = pintar_colgador_intermedio(x);
                        html += html_interno;
                    }
                }); 
                _('div_principal_print_all').innerHTML = html;
                handler_div_print();
            }
        }

        function handler_div_print() {
            let arr_div_codigobarra_all = Array.from(_('div_principal_print_all').getElementsByClassName('cls_div_codigobarra'));
            arr_div_codigobarra_all.forEach(x => {
                let datapar = x.getAttribute('data-par'), codigotela = _par(datapar, 'codigotela');
                drawBarcode39(x, codigotela);
            });
        }

        function pintar_colgador_basico(odata) {
            let html = `
                <div class="Sheet">
                    <div class="CartonSize">
                        <div class="Colgador row">
                            <div style="height:70%;">
                                <div id="divPadreTablaCabeceraIntermedio" style="text-align:left;width:100%;float:left;">
                                    <div id="divHijoTablaCabeceraIntermedio">
                                        <table cellpadding="0" cellspacing="0" class="tblColgador">
                                            <tbody>
                                                <tr class="altoFila">
                                                    <td style="width: 58px; height: 21px;">Knit Type:</td>
                                                    <td style="width: 267px; height: 21px;">${odata.nombrefamilia}</td>
                                                </tr>
                                                <tr class="altoFila">
                                                    <td style="width: 58px; height: 21px;">Tradename:</td>
                                                    <td style="width: 267px; height: 21px;">${odata.nombrecomercial}</td>
                                                </tr>
                                                <tr class="altoFila">
                                                    <td style="width: 58px; height: 21px;">Yarn Size:</td>
                                                    <td style="width: 267px; height: 21px;">${odata.titulo}</td>
                                                </tr>
                                                <tr class="altoFila">
                                                    <td style="width: 58px; height: 21px;">Density:</td>
                                                    <td style="width: 267px; height: 21px;">${odata.weight}</td>
                                                </tr>
                                                <tr class="altoFila">
                                                    <td style="width: 58px; height: 26px;">Content:</td>
                                                    <td style="width: 267px; height: 26px;">${odata.descripcionporcentajecontenidotela}</td>
                                                </tr>
                                                <tr class="altoFila">
                                                    <td>Comments:</td>
                                                    <td colspan="3" style="vertical-align: top;">${odata.carelabel}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div style="height:30%;" class='cls_div_codigobarra' data-par='codigotela:${odata.codigotela}'>
                                
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
            `;

            return html;
        }

        function pintar_colgador_intermedio(odata) {
            let html = `
                <div class="Sheet">
                    <div class="CartonSize">
                        <div class="Colgador row">
                            <div style="height:70%;">
                                <div id="divPadreTablaCabeceraIntermedio" style="text-align:left;width:100%;float:left;">
                                    <div id="divHijoTablaCabeceraIntermedio">
                                        <table cellpadding="0" cellspacing="0" class="tblColgador">
                                            <tbody>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Knit Type:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.nombrefamilia}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Tradename:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.nombrecomercial}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Yarn Size:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.titulo}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Density:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.weight}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Content:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.descripcionporcentajecontenidotela}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Width:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.anchoabiertoutilenmetroscadena}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Stich Count:</td>
                                                    <td colspan="3" class="paddingColumnasCabeceraIntermedio">${odata.stichcount_cadena}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Report Code:</td>
                                                    <td style="width: 91px;" class="paddingColumnasCabeceraIntermedio">${odata.codigoreporte}</td>
                                                    <td style="width: 68px;">Mill Code:</td>
                                                    <td style="width: 103px;" class="paddingColumnasCabeceraIntermedio">${odata.codigofabrica}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Testing Code:</td>
                                                    <td style="width: 91px;" class="paddingColumnasCabeceraIntermedio">${odata.testingcode}</td>
                                                    <td style="width: 68px;">Batch:</td>
                                                    <td style="width: 103px;" class="paddingColumnasCabeceraIntermedio">${odata.partidalote}</td>
                                                </tr>
                                                <tr class="altoFilaCabeceraIntermedio">
                                                    <td style="width: 80px;">Comments:</td>
                                                    <td colspan="3" style="vertical-align: top;" class="paddingColumnasCabeceraIntermedio">${odata.carelabel}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div style="height:30%;" class='cls_div_codigobarra' data-par='codigotela:${odata.codigotela}'>
                                
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
            `;

            return html;
        }

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
)(document, 'div_principal_print_all');
(
    function () {
        appColgadorImprimir.load();
        appColgadorImprimir.req_ini();
    }
)();
var appSolicitudImprimir = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial : 0,
            idsolicitud: 0,
            idanalisistextilsolicitud: 0
        }
        function load() {
            let par = _('hf_parametro').value;
            if (!_isEmpty(par)) {
              
                ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
                ovariables.idsolicitud = _par(par, 'idsolicitud');
                ovariables.idanalisistextilsolicitud = _par(par, 'idanalisistextilsolicitud');
                
            }
            //window.print();
        }
        function req_ini() {         
            parametro = { idgrupocomercial: ovariables.idgrupocomercial, idsolicitud: ovariables.idsolicitud, idanalisistextilsolicitud: ovariables.idanalisistextilsolicitud };
            urlaccion = 'DesarrolloTextil/Solicitud/obtenerdata_print?par=' +JSON.stringify(parametro);

            _Get(urlaccion,false)
                .then((data) => {
                    return data;
                }, (p) => {
                    console.log(p);
                })
                .then((data) => {
                    let rpta = data != null ? JSON.parse(data) : null, html = '';
                    if (rpta !== null) {
                        res_ini(rpta[0]);

                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    }
                })
        }

        function drawBarcode39(divID, value) {
            $("#" + divID).kendoBarcode({
                value: value,
                type: "Code39",
                background: "transparent",
                renderAs: "svg"
            });
        }

        function res_ini(data) {
            //console.log(data)
            let oATX = JSON.parse(data.ATX), ocontenido = data.ATXMateriaPrima !== '' ? CSVtoJSON(data.ATXMateriaPrima) : null, html = '',
                criterios_comparacion = data.criterios_comparacion !== '' ? CSVtoJSON(data.criterios_comparacion) : null, idmotivosolicitud = 0;

            //console.log(oATX)

            if (oATX != null) {                 
                divsolicitudatx = _('divsolicitudimprimir');
                divsolicitudatx.getElementsByClassName('cls_sol_codigoreq')[0].innerText = oATX.codigo;
                divsolicitudatx.getElementsByClassName('cls_sol_numerosolicitud')[0].innerText = oATX.idsolicitud;
                divsolicitudatx.getElementsByClassName('cls_sol_dessolicitud')[0].innerText = oATX.codigo;
                divsolicitudatx.getElementsByClassName('cls_sol_fechasolicitud')[0].innerText = oATX.fecha;
                divsolicitudatx.getElementsByClassName('cls_sol_solicitadosolicitud')[0].innerText = oATX.usuario_solicitante; //oATX.nombrepersonal;
                divsolicitudatx.getElementsByClassName('cls_sol_origensolicitud')[0].innerText = oATX.nombreorigen;
                divsolicitudatx.getElementsByClassName('cls_sol_motivosolicitud')[0].innerText = oATX.nombreestado;
                divsolicitudatx.getElementsByClassName('cls_sol_clientesolicitud')[0].innerText = oATX.nombrecliente;
                divsolicitudatx.getElementsByClassName('cls_sol_codigotelasolicitud')[0].innerText = oATX.codigotela;
                divsolicitudatx.getElementsByClassName('cls_sol_estructurasolicitud')[0].innerText = oATX.estructura;  
                divsolicitudatx.getElementsByClassName('cls_sol_titulosolicitud')[0].innerText = oATX.titulo;
                divsolicitudatx.getElementsByClassName('cls_sol_densidadsolicitud')[0].innerText = oATX.densidad;
                divsolicitudatx.getElementsByClassName('cls_sol_lavadosolicitud')[0].innerText = oATX.lavadopanos;
                divsolicitudatx.getElementsByClassName('cls_sol_colorsolicitud')[0].innerText = oATX.color;
                divsolicitudatx.getElementsByClassName('cls_sol_nombreproveedor')[0].innerText = oATX.proveedorfabrica;
                divsolicitudatx.getElementsByClassName('cls_sol_codigotelaproveedorsolicitud')[0].innerText = oATX.codigotelaproveedor;
                divsolicitudatx.getElementsByClassName('cls_sol_partidasolicitud')[0].innerText = oATX.partida;
                divsolicitudatx.getElementsByClassName('cls_sol_evaluacionsolicitud')[0].innerText = oATX.evaluacionlaboratorio;
                divsolicitudatx.getElementsByClassName('cls_sol_nombrearchivosolicitud')[0].innerText = oATX.nombrearchivooriginal;
                divsolicitudatx.getElementsByClassName('cls_sol_codigoreporteexistentesolicitud')[0].innerText = oATX.codigoatx_delamuestrafisica; 
                //divsolicitudatx.getElementsByClassName('cls_sol_numerosolicitudestandar')[0].innerText = oATX.codigosolicitudanalisistextil; 
                divsolicitudatx.getElementsByClassName('cls_sol_codigoreporteestandarsolicitud')[0].innerText = oATX.codigoreporte;
                divsolicitudatx.getElementsByClassName('cls_sol_comentariosolicitud')[0].innerText = oATX.comentario;
                idmotivosolicitud = oATX.idmotivosolicitud;

                if (ocontenido != null) {
                    ocontenido.forEach(x => {
                        html += `
                            <tr>
                                <td style='vertical-align:middle;text-align:center;border: 1px solid;' width="70%">
                                    ${x.materiaprima}
                                </td>
                                <td style='vertical-align:middle;text-align:center;border: 1px solid;' width="30%">
                                    ${x.porcentaje}
                                </td>
                            </tr>
                            `;
                    });
                    _('tbody_solicitudatx_contenido').innerHTML = html;
                } else {
                    _('divSolicitudDetalleComposicionImprimir').style.display = "none";
                }

                if (idmotivosolicitud === '2') {
                    let arr_obj_compararatx = Array.from(_('divsolicitudimprimir').getElementsByClassName('cls_motivo_compararatx'));
                    arr_obj_compararatx.forEach(x => {
                        x.classList.remove('hide');
                    });

                    html = '';
                    let tbody_criterio = _('tbody_solicitudatx_CriterioAprobacion');
                    if (criterios_comparacion) {
                        criterios_comparacion.forEach(x => {
                            html += `
                                <tr>
                                    <td>${x.nombreestado}</td>
                                    <td>${x.descripcioncriterio}</td>
                                </tr>
                            `;
                        });
                    }
                    if (tbody_criterio) {
                        tbody_criterio.innerHTML = html;
                    }
                }

                drawBarcode39('divcodigobarra', ovariables.idsolicitud);
            }
        }
        return {
            load: load,
            req_ini:req_ini
        }
    }
)(document, 'divsolicitudimprimir');
(
    function () {
        appSolicitudImprimir.load();
        appSolicitudImprimir.req_ini();        
    }
)();
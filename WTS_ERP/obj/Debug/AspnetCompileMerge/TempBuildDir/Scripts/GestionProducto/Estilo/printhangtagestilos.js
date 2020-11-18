var printhangtabestilos = (
    function (d, idpadre) {
        var ovariables = {

        }

        function load() {

        }

        function pintarDatos(odata) {
            let data = odata !== '' ? CSVtoJSON(odata) : null, html = '';
            if (data !== null) {
                //// PARA HOJAS PUNTEADAS

                //<tr class="altoFilaCabeceraIntermedio">
                //    <td style="width: 80px;">COMMENTS:</td>
                //    <td style="width: 91px;" class="paddingColumnasCabeceraIntermedio cls_comentariotela">${item.carelabel}</td>
                //</tr>
                //<tr class="altoFilaCabeceraIntermedio">
                //    <td colspan='2'>
                //        <div style='width:100%;' class='container'>
                //            <img src='${urlimg}' width='100' height='40'>
                //                                                </div>
                //                                            </td>
                //                                        </tr>

                let urlimg = urlBase() + 'images/logowts2019.png';

                data.forEach((item, indice) => {
                    html += `<div class="Sheet">
                                <div class="CartonSize">
                                    <div class="Colgador row">
                                        <div style="height:80%;">
                                            <div id="divPadreTablaCabeceraIntermedio" style="text-align:left;width:100%;float:left;">
                                                <div id="divHijoTablaCabeceraIntermedio">
                                                    <table cellpadding="0" cellspacing="0" class="tblColgador espacio_entrefilas">
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">DATE:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_date">${item.fechaactualizacion}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">FACTORY:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_proveedor">${item.nombreproveedor}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">DIVISION:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_division">${item.nombredivision}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">SEASON:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_temporada">${item.codigoclientetemporada}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">STYLE N°:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_codigoestilo">${item.codigoestilo}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">DESCRIPTION:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_descripcionestilo">${item.descripcion}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">FABRIC N°:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_codigotela">${item.codigotela}</td>
                                                        </tr>
                                                        
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">FABRIC:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_contenidotela">${item.contenidotela}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">WEIGHT:</td>
                                                            <td style="width: 91px;" class="paddingColumnasCabeceraIntermedio cls_peso">${item.peso}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td colspan='2'>COMMENTS:</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td colspan='2' class="paddingColumnasCabeceraIntermedio cls_comentariotela">${item.carelabel}</td>
                                                        </tr>
                                                        <tr class="altoFilaCabeceraIntermedio">
                                                            <td style="width: 80px;">Notes:</td>
                                                            <td class="paddingColumnasCabeceraIntermedio cls_notas_hangtag">${item.notas_hangtag}</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div style="height:20%;">
                                            <div id='codigobarra_${indice}' class='cls_codigodebarra' data-codigotela='${item.codigotela}'>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                });

                let divprincipal = _('div_printhangtabestilos');
                divprincipal.innerHTML = html;
                pintar_codigobarra();

                setTimeout(() => {
                    window.print();
                }, 50);
            }
        }

        function pintar_codigobarra() {
            let divprincipal = _('div_printhangtabestilos'), arr_codigotela = Array.from(divprincipal.getElementsByClassName('cls_codigodebarra'));
            arr_codigotela.forEach((x, indice) => {
                let id = x.getAttribute('id'), codigotela = x.getAttribute('data-codigotela');
                drawBarcode39(id, codigotela);
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

        function req_ini() {
            let par = _('hf_parametro').value;

            let obj = JSON.parse(par); 

            let url = 'GestionProducto/Estilo/GetData_PrintEstilosHangTag?par=' + JSON.stringify(obj);
            _Get(url)
                .then((respuesta) => {
                    pintarDatos(respuesta);
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'div_printhangtabestilos');

(
    function init() {
        printhangtabestilos.load();
        printhangtabestilos.req_ini();
    }
)();
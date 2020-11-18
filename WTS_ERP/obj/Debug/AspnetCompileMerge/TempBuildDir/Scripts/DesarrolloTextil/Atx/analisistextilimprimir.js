//$(document).ready(function () {
//    window.print();
//});

var app_analisistextilimprimir = (
    function (d, idpadre) {
        var ovariables = {
            fileserver: '',
            urlbase: '',
            el_atx_es_comparativo: 'no',  // si/no
            zoom: ''
        }

        function load() {
            ovariables.urlbase = _('urlBase').value;
        }

        function res_ini(odata) {
            if (odata !== null) {
                ovariables.zoom = getZoomValues();
                llenardatos_reporte(odata);
                //let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null;
                //if (atx[0].filaestructura > 18) {
                //    llenardatos_reporte_mayor18filas(odata);
                //} else {
                //    llenardatos_reporte(odata);
                //}
                                
                setTimeout(() => {
                    window.print();
                }, 1000);
            }
        }

        function llenardatos_reporte_mayor18filas(odata) {
            let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null,
                hilados = odata[0].hilados !== '' ? CSVtoJSON(odata[0].hilados) : null, html = '';
            if (atx !== null) {
                llenar_datos_cabecera_report_atx(atx, odata);
            }

        }

        function llenar_datos_cabecera_report_atx(atx, odata) {
            let comentario_atx_kendo = odata[0].comentario_atx;
            let div_tituloprincipal = _('divCabeceraPrincipal'), div_data_atx = _('div_report_datosatx');
            div_tituloprincipal.getElementsByClassName('_cls_report_codigoatx')[0].innerText = atx[0].codigo;
            div_tituloprincipal.getElementsByClassName('_cls_report_fechaatx')[0].innerText = atx[0].fecha;
            div_tituloprincipal.getElementsByClassName('_cls_report_cliente')[0].innerText = atx[0].cliente;
            div_tituloprincipal.getElementsByClassName('_cls_report_idsolicitud')[0].innerText = atx[0].idsolicitud;
            div_tituloprincipal.getElementsByClassName('_cls_report_solicitante')[0].innerText = atx[0].solicitante;
            div_tituloprincipal.getElementsByClassName('_cls_report_nombreoperadoratx')[0].innerText = atx[0].analista;

            div_data_atx.getElementsByClassName('_cls_report_familia')[0].innerText = atx[0].nombrefamilia;
            div_data_atx.getElementsByClassName('_cls_report_columnas_porpulgada')[0].innerText = atx[0].cadenacolumnasporpulgada;
            div_data_atx.getElementsByClassName('_cls_report_nombrecomercial')[0].innerText = atx[0].nombrecomercial;
            div_data_atx.getElementsByClassName('_cls_report_cursas_porpulgada')[0].innerText = atx[0].cadenacursasporpulgada;
            div_data_atx.getElementsByClassName('_cls_report_titulo_tela')[0].innerText = atx[0].titulo;
            div_data_atx.getElementsByClassName('_cls_report_codigotela')[0].innerText = atx[0].codigotela;
            div_data_atx.getElementsByClassName('_cls_report_contenidotela')[0].innerText = atx[0].descripcionporcentajecontenidotela;
            div_data_atx.getElementsByClassName('_cls_report_codigolaboratorio')[0].innerText = atx[0].codigolaboratorio;
            div_data_atx.getElementsByClassName('_cls_report_peso')[0].innerText = atx[0].cadenadensidad;
            div_data_atx.getElementsByClassName('_cls_report_proveedor')[0].innerText = atx[0].nombreproveedor;
            div_data_atx.getElementsByClassName('_cls_report_anchototal')[0].innerText = atx[0].cadenaanchoabiertototal;
            div_data_atx.getElementsByClassName('_cls_report_anchoutil')[0].innerText = atx[0].cadenaanchoabiertoutil;
            div_data_atx.getElementsByClassName('_cls_report_codigotelafabrica')[0].innerText = atx[0].codigotelafabrica;
            div_data_atx.getElementsByClassName('_cls_report_galga')[0].innerText = atx[0].nombregalga;
            div_data_atx.getElementsByClassName('_cls_report_partidalote')[0].innerText = atx[0].partidalote;
            div_data_atx.getElementsByClassName('_cls_report_diametro')[0].innerText = atx[0].diametro;

            //
            let div_muestrafisica = _('div_report_img_muestrafisica'), html_img_muestrafisica = '';
            if (atx[0].imagenwebnombremuestrafisica !== '') {
                //let img_muestrafisica = ovariables.fileserver + 'erp/textileanalysis/muestrasfisicas/original/' + atx[0].imagenwebnombremuestrafisica;
                let img_muestrafisica = ovariables.fileserver + 'erp/textileanalysis/muestrasfisicas/original/' + atx[0].imagenwebnombremuestrafisica;
                html_img_muestrafisica = `
                        <div style="width:100%; height: 100%; text-align:center;vertical-align:middle;">
                            <ul style="padding: 5px; margin: 0; position: relative;">
                                <li class ='col-sx-4' style="display: inline; list-style: none;">
                                    <a class ='thumbnail'>
                                        <img id="imgMuestraFisica" class ="img-responsive" style="width: 100%; height: 92%;" src='${img_muestrafisica}' />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    `;
            } else {
                html_img_muestrafisica = `
                        <div style="width:100%; height:100%; text-align:center;vertical-align:middle;">
                            <div id="divImagenCuadroBordeGrueso" style="width:50%;height:92%;border:4px solid;margin-left: 24%;margin-top: 5px;">
                            </div>
                        </div>
                    `;
            }

            div_muestrafisica.innerHTML = html_img_muestrafisica;

            // PARA EL COMENTARIO
            _('divComentario').getElementsByClassName('_cls_report_comentario_pretratamiento')[0].innerText = atx[0].cadena_pretratamiento_metodo_tipo !== '' ? atx[0].cadena_pretratamiento_metodo_tipo : '';
            _('divComentario').getElementsByClassName('_cls_report_comentario_acabadofisicoquimico')[0].innerText = atx[0].cadena_union_af_aq !== '' ? atx[0].cadena_union_af_aq : '';
            _('divComentario').getElementsByClassName('_cls_report_comentario_kendo')[0].innerHTML = comentario_atx_kendo.replace(/~/g, '"').replace(/¬/g, '+');
        }

        function llenardatos_reporte(odata) {
            let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null,
                hilados = odata[0].hilados !== '' ? CSVtoJSON(odata[0].hilados) : null, html = '', 
                total_pasadas = atx !== null ? atx[0].filaestructura : 0,
                criterios_atxaprobacion = odata[0].aprobacion_atxcomparativo !== '' ? CSVtoJSON(odata[0].aprobacion_atxcomparativo) : null,
                idmotivosolicitud = '';
            if (atx !== null) {
                idmotivosolicitud = atx[0].idmotivosolicitud;
                llenar_datos_cabecera_report_atx(atx, odata);

                //// LIGAMENTOS
                if (atx[0].imagenwebnombre_ligamentos !== '') {
                    //// SOLO VA IMAGEN DE LA ESTRUCTURA DE LOS LIGAMENTOS
                    _('div_img_estructura_ligamento').style.display = 'block';
                    let url_img_estructura_ligamento = ovariables.urlbase + `images/structuraimport/original/${atx[0].imagenwebnombre_ligamentos}`;
                    _('img_report_estructura_ligamento').setAttribute('src', url_img_estructura_ligamento);
                } else {
                    if (total_pasadas > 18){
                        dibujar_matriz_ligamentos_mayor_18pasadas(odata);
                    } else {
                        dibujar_matriz_ligamentos_menor_18pasadas(odata, atx);
                    }
                }
            } 

            // HILADOS
            if (hilados !== null) {
                hilados.forEach(x => {
                    html += `
                        <tr>
                            <td style='vertical-align:middle;text-align:center; border:1px solid;' width="5%">
                                ${x.orden}
                            </td>
                            <td style='vertical-align:middle;text-align:center; border:1px solid;' width="10%">
                                ${x.titulo}
                            </td>
                            <td style='vertical-align:middle;text-align:center; border:1px solid;' width="70%">
                                ${x.contenido}
                            </td>
                            <td style='vertical-align:middle;text-align:center; border:1px solid;' width="15%">
                                ${x.porcentaje}
                            </td>
                        </tr>
                    `;
                });
            }
            _('tbody_report_hilado').innerHTML = html;

            //// COMENTAR POR EL MOMENTO POR EL ATX SIN SDT //// INI
            //if (idmotivosolicitud === '2') {
            //    let div_principal = _('div_contenedor_principal'), arr_div_criterios = Array.from(div_principal.getElementsByClassName('cls_div_criterio_aprobacion_atx'));

            //    ovariables.el_atx_es_comparativo = 'si';

            //    arr_div_criterios.forEach(x => {
            //        x.style.display = "";
            //    });

            //    cargar_datos_criterios_aprobacion_atx(atx, criterios_atxaprobacion);
            //}
            //// COMENTAR POR EL MOMENTO POR EL ATX SIN SDT //// FIN
            
            if (ovariables.el_atx_es_comparativo === 'no') {
                calcularaltoparacuadroimagen(atx);
            } else {
                calcularaltoparacuadroimagen_comparativo(atx);
            }
        }

        function cargar_datos_criterios_aprobacion_atx(atx, criterios_atxaprobacion) {
            let tbody = _('tbody_print_resumen_aprobacion'), html = '', div_resultado_resumen_aprobacion = _('div_resultado_resumen_criterioaprobacion');
            if (criterios_atxaprobacion !== null) {
                criterios_atxaprobacion.forEach(x => {
                    let comentario_criterio = x.observacion.trim() === '' ? '-' : x.observacion.trim();
                    html += `
                        <tr>
                            <td style='border-bottom:1px solid;border-left:1px solid; border-right:1px solid;'>${x.nombreestado}</td>
                            <td style='border-bottom:1px solid;border-left:1px solid; border-right:1px solid;'>${comentario_criterio}</td>
                            <td style='border-bottom:1px solid;border-left:1px solid; border-right:1px solid;'>${x.estado_aprobrech}</td>
                        </tr>
                    `;
                });

                tbody.innerHTML = html;
            }
            
            if (atx !== null) {
                let tbody_conclusion_tela = _('tbody_print_conclusion_tela'), strong_conclusion = tbody_conclusion_tela.getElementsByClassName('_cls_strong_texto_conclusion')[0],
                    codigoatxestandar = atx[0].codigo_atxestandar;
                if (atx[0].atxestado_aprobado_rechazado === 'APRO') {
                    strong_conclusion.innerText = 'APROBADO';
                } else if (atx[0].atxestado_aprobado_rechazado === 'RECH') {
                    strong_conclusion.innerText = 'RECHAZADO';
                }

                //comentario_conclusion_atx_aprobado_rechazado¬atxestado_aprobado_porconsignacion¬comentario_aprobacion_porconsignacion¬usuario_consignador_atx
                //// PARA EL COMENTARIO DEL OPERADOR
                let tbl_comentario_operador = _('tbl_print_comentario_final_criterioaprobacion_atx_operador'), tbody_datos_consignador = _('tbody_print_datos_consignador'),
                    tbl_comentario_consignador = _('tbl_print_comentario_final_criterioaprobacion_atx_consignador'), div_principal_criterioaprobacion = _('div_principal_criterioaprobacion');

                //// PINTAR EL CODIGO ATX ESTANDAR
                div_principal_criterioaprobacion.getElementsByClassName('spn_text_atxestandar')[0].innerText = ` - ATX STANDARD: ${codigoatxestandar}`;

                tbl_comentario_operador.getElementsByClassName('_cls_td_comentario_final_operador')[0].innerText = atx[0].comentario_conclusion_atx_aprobado_rechazado;
                if (atx[0].atxestado_aprobado_porconsignacion !== '') {
                    let descripcion_estado_consignacion = atx[0].atxestado_aprobado_porconsignacion === 'APRO' ? 'APROBADO' : 'RECHAZADO';
                    html = '';
                    let arr_div_datos_consignador = Array.from(div_principal_criterioaprobacion.getElementsByClassName('_cls_print_consignador'));

                    arr_div_datos_consignador.forEach(x => {
                        x.style.display = "";
                    });

                    html = `
                            <tr>
                                <td style='text-align:center;border-bottom:1px solid;'>${atx[0].usuario_consignador_atx}</td>
                                <td style='text-align:center;border-bottom:1px solid;'>${descripcion_estado_consignacion}</td>
                            </tr>
                        `;

                    tbody_datos_consignador.innerHTML = html;
                    
                    tbl_comentario_consignador.getElementsByClassName('_cls_td_comentario_final_consignador')[0].innerText = atx[0].comentario_aprobacion_porconsignacion;
                }
            }
        }

        function dibujar_matriz_ligamentos_mayor_18pasadas(odata) {
            let atx = odata[0].atx !== '' ? CSVtoJSON(odata[0].atx) : null, repeticiones = odata[0].repeticiones !== '' ? CSVtoJSON(odata[0].repeticiones) : null,
                cont_filas = 0, totalpasadas = odata[0].total_pasadas, nrofila_pasada = 0, html = '', html2damitad = '', filas_ligamentos = atx[0].filaestructura, 
                columnas_ligamentos = atx[0].columnaestructura, urlbase = _('urlBase').value, 
                lst_imagen_ligamentos = odata[0].estructura_img_ligamentos !== '' ? CSVtoJSON(odata[0].estructura_img_ligamentos) : null,
                lst_hiladosporpasadas = odata[0].hiladosporpasada !== '' ? CSVtoJSON(odata[0].hiladosporpasada) : null, 
                maximo_columnas_hiladopasada = odata[0].maximo_columnas_hiladopasada, totalfias_mitad = Math.round(totalpasadas / 2),
                total_delaotra_mitad = totalpasadas - totalfias_mitad, // ejemplo; si es 21 redondeo 11 y la otra mitad a 10;
                contador_pasadas_limite_mitad = 0; 

            _('div_ligamentos_menor_18pasadas').style.display = 'block';
            _('div_ligamentos_menor_18pasadas').getElementsByClassName('_cls_ligamentos_columna1_18pasadas')[0].style.display = 'inline-block';
            _('div_ligamentos_menor_18pasadas').getElementsByClassName('_cls_ligamentos_columna2_18pasadas')[0].style.display = 'inline-block';
            
            let contador_pasadas_limite_mitad_temp = 0;
            repeticiones.some((x, i) => {
                //// PRIMERO CALCULAR SI SE ROMPLE O NO EN LA MITAD
                //// ESTO SIRVE
                //let limite_filas = totalfias_mitad
                let limite_filas = 18;
                let arrfilas = x.filas.split(',');
                
                contador_pasadas_limite_mitad_temp+=arrfilas.length;
                let arrfilas_2 = repeticiones[i + 1].filas.split(',');
                let filas_2 = arrfilas_2.length;
                if ((contador_pasadas_limite_mitad_temp + filas_2) > limite_filas) {
                    if (arrfilas.length > 1) {
                        contador_pasadas_limite_mitad += arrfilas.length;
                    } else {
                        contador_pasadas_limite_mitad += 1;
                    }
                    return true;
                } else {
                    if (arrfilas.length > 1) {
                        contador_pasadas_limite_mitad += arrfilas.length;
                    } else {
                        contador_pasadas_limite_mitad += 1;
                    }
                }

                //if (arrfilas.length > 1) {
                //    contador_pasadas_limite_mitad += arrfilas.length;
                //} else {
                //    contador_pasadas_limite_mitad += 1;
                //}
                if (contador_pasadas_limite_mitad >= limite_filas) {
                    //// se llego al limite
                    return true;
                }
            });

            total_delaotra_mitad = totalpasadas - contador_pasadas_limite_mitad;

            let temp_num = 0, temp_ini = 0;
            //// NUMERO DE PASADAS
            repeticiones.forEach(x => {
                nrofila_pasada++;
                temp_num++;
                let nfilas = x.filas.split(',').length, altifila = 30 * nfilas, numerorepeticiones = parseInt(x.numerorepeticiones), 
                    calculo_numeracion_pasada = (temp_num - 1) + (nfilas * numerorepeticiones),
                    cadena_numeracion = '';
                
                temp_ini = temp_num + 1;
                temp_num = calculo_numeracion_pasada; //nfilas > 1 ? calculo_numeracion_pasada : nrofila_pasada;
                cadena_numeracion = nfilas > 1 ? (temp_ini - 1) + ' - ' + calculo_numeracion_pasada : numerorepeticiones > 1 ? (temp_ini - 1) + ' - ' + calculo_numeracion_pasada : temp_num;
                
                cont_filas += nfilas;

                if (cont_filas <= contador_pasadas_limite_mitad) {
                    // la primera mitad
                    html += `
                        <tr class ="page-break" style="height:${altifila}px;">
                            <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;background-color: #D9D9D9 !important;font-size:6px; font-weight:bold">${cadena_numeracion}</td>
                        </tr>`;
                } else {
                    html2damitad += `
                            <tr class ="page-break" style="height:${altifila}px;">
                                <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;background-color: #D9D9D9 !important;font-size:6px; font-weight:bold">${cadena_numeracion}</td>
                            </tr>`;
                        
                }
            });
            _('tbodyImprimiDetalleTejidoEstructuraNumeracion').insertAdjacentHTML('beforeend', html);
            _('tbodyImprimiDetalleTejidoEstructuraNumeracionColumna2').insertAdjacentHTML('beforeend', html2damitad);

            //// MATRIZ LIGAMENTOS
            let fn_matriz2 = (ligamentos) => {
                let html = '', html2damitad = '', htmlestilo = '', contador = 0, alineacionverticalimg = '', obj_html_return = {}, contador_por_cada_mitad = 0;
                for (let i = 1; i <= filas_ligamentos; i++) { // NRO DE PASADAS
                    htmlestilo = '';
                    if (contador_por_cada_mitad === 0){
                        contador_por_cada_mitad = 1;
                    } else {
                        contador_por_cada_mitad++;
                    }
                    for (let k = 1; k <= 2; k++) {
                        // PISTAS: 1 Y 2
                        if (k === 1) {
                            if (contador_por_cada_mitad === 1) {
                                htmlestilo = 'border-top: 1px solid;';  // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            }
                            alineacionverticalimg = 'bottom';
                        }
                        else {
                            htmlestilo = 'border-bottom: 1px solid;'; // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            alineacionverticalimg = 'top';
                        }
                        contador++;
                        if (i <= contador_pasadas_limite_mitad){
                            if (i === contador_pasadas_limite_mitad){
                                contador_por_cada_mitad = 0;  // SE REINICIALIZA EL CONTADOR POR CADA MITAD
                            }
                            html += `<tr class="page-break" style="${htmlestilo}" data-numerofilageneral='${contador}' data-nropasada='${i}' data-filadivision='${k}'>`;
                            for (let j = 1; j <= columnas_ligamentos; j++) {
                                let lst = ligamentos.filter(l => parseInt(l.pista) === k && parseInt(l.columna) === j && parseInt(l.nropasada) === i);
                                if (lst.length > 0) {
                                    let ruta_img_ligamento = urlbase + lst[0].rutaimagen + lst[0].imagenwebnombre;
                                    //let imagenbase64 = lst[0].base64imagenligamento;
                                    //<img src="data:image/png;base64,${imagenbase64}" height='13' width='13' />
                                    html += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                    <img src="${ruta_img_ligamento}" height='13' width='13' />
                                </td>`;
                                } else {
                                    html += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                </td>`;
                                }
                            
                            }
                            html += `</tr>`;
                        } else {
                            html2damitad += `<tr class="page-break" style="${htmlestilo}" data-numerofilageneral='${contador}' data-nropasada='${i}' data-filadivision='${k}'>`;
                            for (let j = 1; j <= columnas_ligamentos; j++) {
                                let lst = ligamentos.filter(l => parseInt(l.pista) === k && parseInt(l.columna) === j && parseInt(l.nropasada) === i);
                                if (lst.length > 0) {
                                    let ruta_img_ligamento = urlbase + lst[0].rutaimagen + lst[0].imagenwebnombre;
                                    html2damitad += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                    <img src="${ruta_img_ligamento}" height='13' width='13' />
                                </td>`;
                                } else {
                                    html2damitad += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                </td>`;
                                }
                            
                            }
                            html2damitad += `</tr>`;    
                        }
                        
                    }
                }

                obj_html_return.html_mitad1 = html;
                obj_html_return.html_mitad2 = html2damitad;

                return obj_html_return;
            }

            let fn_matriz3 = (repeticiones) => {
                let nrofila_pasada = 0, html1 = '', html2 = '', acum = 0, obj_return = {};
                repeticiones.forEach(x => {
                    nrofila_pasada++;
                    let nfilas = x.filas.split(',').length, altifila = 30 * nfilas;

                    acum += nfilas;

                    if (acum <= contador_pasadas_limite_mitad) {
                        // la primera mitad
                        html1 += `
                            <tr class ="page-break" style="height:${altifila}px;">
                                <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;">x ${x.numerorepeticiones}</td>
                            </tr>`;
                    } else {
                        html2 += `
                            <tr class ="page-break" style="height:${altifila}px;">
                                <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;">x ${x.numerorepeticiones}</td>
                            </tr>`;
                    }

                });

                obj_return.html1 = html1;
                obj_return.html2 = html2;

                return obj_return
            }

            let fn_matriz4 = (hiladosporpasadas) => {
                let html_head_row1 = '', html_head_row2 = '', html_hilado_pasada = '', html1 = '', html2 = '';
                for (let i = 0; i < maximo_columnas_hiladopasada; i++) {
                    html_head_row1 += `
                        <th rowspan="2" style="border:1px solid;vertical-align:middle;">DESC</th>
                        <th colspan="2" style="border:1px solid">Lm (mm) </th>
                    `;
                }

                for (let i = 0; i < maximo_columnas_hiladopasada; i++) {
                    html_head_row2 += `
                        <th width="7px" style="border:1px solid">G</th>
                        <th width="7px" style="border:1px solid">F</th>
                    `;
                }

                for (let i = 1; i <= filas_ligamentos; i++) { // NRO DE PASADAS
                    let hiladopasada_filter = hiladosporpasadas.filter(f => parseInt(f.numeropasada) === i);

                    html_hilado_pasada += `
                        <tr class ="page-break" style="height:30px;">
                    `;
                    for (let c = 0; c < maximo_columnas_hiladopasada; c++) {
                        if (hiladopasada_filter.length > 0) {
                            let dato_hiladoporpasada = hiladopasada_filter[c];
                            if (c < maximo_columnas_hiladopasada) {
                                if (dato_hiladoporpasada !== undefined) {
                                    html_hilado_pasada += `
                                        <td style="border-bottom:1px solid; border-right:1px solid; width: 50px; font-size: 5px;">
                                            ${dato_hiladoporpasada.titulo} <br />
                                            ${dato_hiladoporpasada.contenido} <br />
                                            ${dato_hiladoporpasada.nombreposicion}
                                        </td>
                                        <td style="border-bottom:1px solid; border-right:1px solid">${dato_hiladoporpasada.largomallacrudo}</td>
                                        <td style="border-bottom:1px solid; border-right:1px solid">${dato_hiladoporpasada.largomallaacabado}</td>
                                    `;
                                } else {
                                    html_hilado_pasada += `
                                        <td style="border-bottom:1px solid; border-right:1px solid; width: 50px;"></td>
                                        <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                        <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                    `;
                                }
                            }
                        } else {
                            html_hilado_pasada += `
                                <td style="border-bottom:1px solid; border-right:1px solid; width: 50px;"></td>
                                <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                <td style="border-bottom:1px solid; border-right:1px solid"></td>
                            `;
                        }
                    }
                    html_hilado_pasada += `</tr>`;

                    if (i === contador_pasadas_limite_mitad) {
                        html1 = html_hilado_pasada;
                        html_hilado_pasada = '';
                    } else if (i === parseInt(filas_ligamentos)) {
                        html2 = html_hilado_pasada;
                    }
                }


                let obj_return = {
                    headrow1: html_head_row1,
                    headrow2: html_head_row2,
                    html1: html1,
                    html2: html2
                }

                return obj_return;
            }

            let obj_html_ligamento = fn_matriz2(lst_imagen_ligamentos);
            let obj_html_repeticiones = fn_matriz3(repeticiones);
            let obj_matriz_hiladosporpasadas = fn_matriz4(lst_hiladosporpasadas);
            _('tbodyImprimiDetalleTejidoEstructuraImagen').insertAdjacentHTML('beforeend', obj_html_ligamento.html_mitad1);
            _('tbodyImprimiDetalleTejidoEstructuraImagenColumna2').insertAdjacentHTML('beforeend', obj_html_ligamento.html_mitad2);
            _('tbodyImprimiDetalleTejidoEstructuraRepeticiones').insertAdjacentHTML('beforeend', obj_html_repeticiones.html1);
            _('tbodyImprimiDetalleTejidoEstructuraRepeticionesColumna2').insertAdjacentHTML('beforeend', obj_html_repeticiones.html2);

            let tbl_matriz_hiladosporpasadas = _('tblImprimiDetalleTejidoEstructuraFilaAdicional'),
                tbl_matriz_hiladosporpasadas2 = _('tblImprimiDetalleTejidoEstructuraFilaAdicional2');
            tbl_matriz_hiladosporpasadas.getElementsByClassName('_cls_filahead1_report_hiladoporpasada')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow1;
            tbl_matriz_hiladosporpasadas.getElementsByClassName('_cls_filahead2_report_hiladoporpasada')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow2;
            _('tbodyImprimiDetalleTejidoEstructuraFilaAdicional').innerHTML = obj_matriz_hiladosporpasadas.html1;

            tbl_matriz_hiladosporpasadas2.getElementsByClassName('_cls_filahead1_report_hiladoporpasada2')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow1;
            tbl_matriz_hiladosporpasadas2.getElementsByClassName('_cls_filahead2_report_hiladoporpasada2')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow2;
            _('tbodyImprimiDetalleTejidoEstructuraFilaAdicionalColumna2').innerHTML = obj_matriz_hiladosporpasadas.html2;
        }

        function dibujar_matriz_ligamentos_menor_18pasadas(odata, atx) {
            let repeticiones = odata[0].repeticiones !== '' ? CSVtoJSON(odata[0].repeticiones) : null,
                cont_filas = 0, totalpasadas = odata[0].total_pasadas, nrofila_pasada = 0, html = '', filas_ligamentos = atx[0].filaestructura, columnas_ligamentos = atx[0].columnaestructura,
                urlbase = _('urlBase').value, lst_imagen_ligamentos = odata[0].estructura_img_ligamentos !== '' ? CSVtoJSON(odata[0].estructura_img_ligamentos) : null,
                lst_hiladosporpasadas = odata[0].hiladosporpasada !== '' ? CSVtoJSON(odata[0].hiladosporpasada) : null, maximo_columnas_hiladopasada = odata[0].maximo_columnas_hiladopasada;

            _('div_ligamentos_menor_18pasadas').style.display = 'block';
            _('div_ligamentos_menor_18pasadas').getElementsByClassName('_cls_ligamentos_columna1_18pasadas')[0].style.display = 'inline-block';

            let temp_num = 0, temp_ini = 0;
            if (repeticiones !== null) {
                repeticiones.forEach(x => {
                    nrofila_pasada++;
                    temp_num++;
                    // cadena_numeracion = nfilas > 1 ? nrofila_pasada + ' - ' + calculo_numeracion_pasada : nrofila_pasada
                    let nfilas = x.filas.split(',').length, altifila = 30 * nfilas, numerorepeticiones = parseInt(x.numerorepeticiones),
                        calculo_numeracion_pasada = (temp_num - 1) + (nfilas * numerorepeticiones), cadena_numeracion = '';

                    temp_ini = temp_num + 1;
                    temp_num = calculo_numeracion_pasada;
                    cadena_numeracion = nfilas > 1 ? (temp_ini - 1) + ' - ' + calculo_numeracion_pasada : numerorepeticiones > 1 ? (temp_ini - 1) + ' - ' + calculo_numeracion_pasada : temp_num;
                    cont_filas += nfilas;

                    html += `
                    <tr class ="page-break" style="height:${altifila}px;">
                        <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;background-color: #D9D9D9 !important;font-size:6px; font-weight:bold">${cadena_numeracion}</td>
                    </tr>
                `;

                });
                _('tbodyImprimiDetalleTejidoEstructuraNumeracion').insertAdjacentHTML('beforeend', html);
            }
            
            let fn_matriz2 = (ligamentos) => {
                let html = '', htmlestilo = '', contador = 0, alineacionverticalimg = '';
                for (let i = 1; i <= filas_ligamentos; i++) { // NRO DE PASADAS
                    htmlestilo = '';
                    for (let k = 1; k <= 2; k++) {
                        // PISTAS: 1 Y 2
                        if (k === 1) {
                            if (i === 1) {
                                htmlestilo = 'border-top: 1px solid;';  // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            }
                            alineacionverticalimg = 'bottom';
                        }
                        else {
                            htmlestilo = 'border-bottom: 1px solid;'; // border-right: 1px solid #ddd; border-left: 1px solid #ddd;
                            alineacionverticalimg = 'top';
                        }
                        contador++;
                        html += `<tr class="page-break" style="${htmlestilo}" data-numerofilageneral='${contador}' data-nropasada='${i}' data-filadivision='${k}'>`;
                        for (let j = 1; j <= columnas_ligamentos; j++) {
                            let lst = ligamentos.filter(l => parseInt(l.pista) === k && parseInt(l.columna) === j && parseInt(l.nropasada) === i);
                            if (lst.length > 0) {
                                let ruta_img_ligamento = urlbase + lst[0].rutaimagen + lst[0].imagenwebnombre;
                                //let imagenbase64 = lst[0].base64imagenligamento;
                                //<img src="data:image/png;base64,${imagenbase64}" height='13' width='13' />
                                html += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                    <img src="${ruta_img_ligamento}" height='13' width='13' />
                                </td>`;
                            } else {
                                html += `<td width="14" height="15" style="vertical-align:${alineacionverticalimg};" data-numerocolumna='${j}'>
                                </td>`;
                            }
                            
                        }
                        html += `</tr>`;
                        
                    }
                }
                return html;
            }

            let fn_matriz3 = (repeticiones) => {
                let nrofila_pasada = 0, html = '';
                if (repeticiones !== null) {
                    repeticiones.forEach(x => {
                        nrofila_pasada++;
                        let nfilas = x.filas.split(',').length, altifila = 30 * nfilas, numerorepeticiones = parseInt(x.numerorepeticiones);

                        html += `
                        <tr class ="page-break" style="height:${altifila}px;">
                            <td width="18" style="border:1px solid; text-align:center; vertical-align:middle;">x ${x.numerorepeticiones}</td>
                        </tr>
                    `;
                    });
                }
                
                return html;
            }

            let fn_matriz4 = (hiladosporpasadas) => {
                let html_head_row1 = '', html_head_row2 = '', html = '';
                for (let i = 0; i < maximo_columnas_hiladopasada; i++) {
                    html_head_row1 += `
                        <th rowspan="2" style="border:1px solid;vertical-align:middle;">DESC</th>
                        <th colspan="2" style="border:1px solid">Lm (mm) </th>
                    `;
                }

                for (let i = 0; i < maximo_columnas_hiladopasada; i++) {
                    html_head_row2 += `
                        <th width="7px" style="border:1px solid">G</th>
                        <th width="7px" style="border:1px solid">F</th>
                    `;
                }
                if (hiladosporpasadas !== null) {
                    for (let i = 1; i <= filas_ligamentos; i++) { // NRO DE PASADAS
                        let hiladopasada_filter = hiladosporpasadas.filter(f => parseInt(f.numeropasada) === i);
                        html += `
                            <tr class ="page-break" style="height:30px;">
                        `;
                        for (let c = 0; c < maximo_columnas_hiladopasada; c++) {
                            if (hiladopasada_filter.length > 0) {
                                let dato_hiladoporpasada = hiladopasada_filter[c];
                                if (c < maximo_columnas_hiladopasada) {
                                    if (dato_hiladoporpasada !== undefined) {
                                        html += `
                                        <td style="border-bottom:1px solid; border-right:1px solid; width: 50px; font-size: 5px;">
                                            ${dato_hiladoporpasada.titulo} <br />
                                            ${dato_hiladoporpasada.contenido} <br />
                                            ${dato_hiladoporpasada.nombreposicion}
                                        </td>
                                        <td style="border-bottom:1px solid; border-right:1px solid">${dato_hiladoporpasada.largomallacrudo}</td>
                                        <td style="border-bottom:1px solid; border-right:1px solid">${dato_hiladoporpasada.largomallaacabado}</td>
                                    `;
                                    } else {
                                        html += `
                                        <td style="border-bottom:1px solid; border-right:1px solid; width: 50px;"></td>
                                        <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                        <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                    `;
                                    }
                                }
                            } else {
                                html += `
                                <td style="border-bottom:1px solid; border-right:1px solid; width: 50px;"></td>
                                <td style="border-bottom:1px solid; border-right:1px solid"></td>
                                <td style="border-bottom:1px solid; border-right:1px solid"></td>
                            `;
                            }
                        }
                        html += `</tr>`;
                    }
                }
                
                let obj_return = {
                    headrow1: html_head_row1,
                    headrow2: html_head_row2,
                    html_filas_hiladoporpasada: html
                }

                return obj_return;
            }

            let html_ligamento = fn_matriz2(lst_imagen_ligamentos);
            let html_repeticiones = fn_matriz3(repeticiones);
            let obj_matriz_hiladosporpasadas = fn_matriz4(lst_hiladosporpasadas);

            _('tbodyImprimiDetalleTejidoEstructuraImagen').insertAdjacentHTML('beforeend', html_ligamento);
            _('tbodyImprimiDetalleTejidoEstructuraRepeticiones').insertAdjacentHTML('beforeend', html_repeticiones);
            let tbl_matriz_hiladosporpasadas = _('tblImprimiDetalleTejidoEstructuraFilaAdicional');
            tbl_matriz_hiladosporpasadas.getElementsByClassName('_cls_filahead1_report_hiladoporpasada')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow1;
            tbl_matriz_hiladosporpasadas.getElementsByClassName('_cls_filahead2_report_hiladoporpasada')[0].innerHTML = obj_matriz_hiladosporpasadas.headrow2;
            _('tbodyImprimiDetalleTejidoEstructuraFilaAdicional').innerHTML = obj_matriz_hiladosporpasadas.html_filas_hiladoporpasada;
        }

        function req_ini() {
            let par = _('hf_parametro').value, idsolicitud = _par(par, 'idsolicitud'), idatx = _par(par, 'idatx'), parametro = { idsolicitud: idsolicitud, idatx: idatx },
                url = 'DesarrolloTextil/Atx/GetData_PrintAtx?par=' + JSON.stringify(parametro);
            ovariables.fileserver = _par(par, 'fileserver')
            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? JSON.parse(rpta) : null;
                    res_ini(odata);
                })
                .catch((e) => {
                    console.log('error', e);
                });
        }

        function calcularaltoparacuadroimagen(atx) {
            // para vertical el valor total es: 1013.75; para horizontal es: 658.19
            let cantidadcolumnas = atx !== null ? parseInt(atx[0].columnaestructura) : 0, cantidadfilas = atx !== null ? parseInt(atx[0].filaestructura) : 0, valoaturatotal = 0,
                margenerrorporcentaje = 0, divtitulo = _('divTituloFabricAnalisis'), divcabecera = _('divCabeceraPrincipal'),
                divdetallehilado = _('divDetalleHiladoResumen'), divestructuratejido = _('divPrincipalEstructura'), divobservacion = _('divComentario'),
                // a este colocar su altura
                divcuadroimagen = _('divMuestraFisica'),
                // estos son 5 div; multiplicarlo x 5
                alturadivtitulo = divtitulo.clientHeight, alturadivcabecera = divcabecera.clientHeight, alturadivdetallehilado = divdetallehilado.clientHeight,
                alturadivestructuratejido = divestructuratejido.clientHeight, alturadivobservacion = divobservacion.clientHeight,
                divcuadroimagenbordegrueso = _('divImagenCuadroBordeGrueso'), imagenmuestrafisica = _('imgMuestraFisica');

            if (cantidadcolumnas < 55) { // vertical
                valoaturatotal = 1090 ////1031.81;  //// 1085 ESTA EN PIXELES Y EQUIVALE A 28.71 CM
                margenerrorporcentaje = 4.7; //3.8; // restar este margen al calculo
            } else if (cantidadcolumnas > 54) { // horizontal
                valoaturatotal = 702.99;
                margenerrorporcentaje = 7; //19.2; // restar este margen al calculo
            }

            let sumatotalalturastemp = parseInt(alturadivtitulo) * 5 + parseInt(alturadivcabecera) + parseInt(alturadivdetallehilado) + parseInt(alturadivestructuratejido) + parseInt(alturadivobservacion),
                calcularequivalentepocentajealturastemp = parseFloat((sumatotalalturastemp * 100) / valoaturatotal).toFixed(2),
                porcentajefaltante = parseFloat(98 - calcularequivalentepocentajealturastemp).toFixed(2);

            porcentajefaltante -= margenerrorporcentaje;
            //divcuadroimagen.css("height", porcentajefaltante + "%");
            divcuadroimagen.style.height = porcentajefaltante + "%";

            let alturacuadroimagenpadre = divcuadroimagen.clientHeight, valordiferenciaarestar = 15, //15.608;
                valoralturacuadrobordegrueso = parseFloat(alturacuadroimagenpadre) - parseFloat(valordiferenciaarestar),
                calculoalturacuadroborde = (valoralturacuadrobordegrueso * 100) / alturacuadroimagenpadre;

            //divcuadroimagenbordegrueso.css("height", calculoalturacuadroborde + "%");
            if (divcuadroimagenbordegrueso) {
                divcuadroimagenbordegrueso.style.height = calculoalturacuadroborde + "%";
            }
            //imagenmuestrafisica.css("height", calculoalturacuadroborde + "%");
            if (imagenmuestrafisica) {
                imagenmuestrafisica.style.height = calculoalturacuadroborde + "%";
            }
        }

        function calcularaltoparacuadroimagen_comparativo(atx) {
            // para vertical el valor total es: 1013.75; para horizontal es: 658.19
            let cantidadcolumnas = atx !== null ? parseInt(atx[0].columnaestructura) : 0, cantidadfilas = atx !== null ? parseInt(atx[0].filaestructura) : 0, valoaturatotal = 0,
                margenerrorporcentaje = 0, divtitulo = _('divTituloFabricAnalisis'), divcabecera = _('divCabeceraPrincipal'),
                divdetallehilado = _('divDetalleHiladoResumen'), divestructuratejido = _('divPrincipalEstructura'), divobservacion = _('divComentario'),
                divprincipal_criterioaprobacion = _('div_principal_criterioaprobacion'),
                // a este colocar su altura
                divcuadroimagen = _('divMuestraFisica'),
                // estos son 5 div; multiplicarlo x 6
                alturadivtitulo = divtitulo.clientHeight, alturadivcabecera = divcabecera.clientHeight, alturadivdetallehilado = divdetallehilado.clientHeight,
                alturadivestructuratejido = divestructuratejido.clientHeight, alturadivobservacion = divobservacion.clientHeight,
                divcuadroimagenbordegrueso = _('divImagenCuadroBordeGrueso'), imagenmuestrafisica = _('imgMuestraFisica'),
                altura_div_criterioaprobacion = divprincipal_criterioaprobacion.clientHeight;

            if (cantidadcolumnas < 55) { // vertical
                if (ovariables.zoom === "0.90") { //// BROWSER AL 90% DEL ZOOM
                    valoaturatotal = 1090; ////1031.81;  //// 1085 ESTA EN PIXELES Y EQUIVALE A 28.71 CM
                } else if (ovariables.zoom === "1.00") { //// BROWSER AL 100% DEL ZOOM
                    valoaturatotal = 1031.81;
                }
                //valoaturatotal = 1090; ////1031.81;  //// 1085 ESTA EN PIXELES Y EQUIVALE A 28.71 CM
                margenerrorporcentaje = 4.7; //3.8; // restar este margen al calculo
            } else if (cantidadcolumnas > 54) { // horizontal
                valoaturatotal = 702.99;
                margenerrorporcentaje = 7; //19.2; // restar este margen al calculo
            }

            let sumatotalalturastemp = parseInt(alturadivtitulo) * 6 + parseInt(alturadivcabecera) + parseInt(alturadivdetallehilado) + parseInt(alturadivestructuratejido) + parseInt(alturadivobservacion) + altura_div_criterioaprobacion,
                calcularequivalentepocentajealturastemp = parseFloat((sumatotalalturastemp * 100) / valoaturatotal).toFixed(2),
                porcentajefaltante = parseFloat(98 - calcularequivalentepocentajealturastemp).toFixed(2);

            if (imagenmuestrafisica === null) {
                sumatotalalturastemp = parseInt(alturadivtitulo) * 3 + parseInt(alturadivcabecera) + parseInt(alturadivdetallehilado) + parseInt(alturadivestructuratejido);
            } else {

            }

            

            porcentajefaltante -= margenerrorporcentaje;
            //divcuadroimagen.css("height", porcentajefaltante + "%");
            divcuadroimagen.style.height = porcentajefaltante + "%";

            let alturacuadroimagenpadre = divcuadroimagen.clientHeight, valordiferenciaarestar = 15, //15.608;
                valoralturacuadrobordegrueso = parseFloat(alturacuadroimagenpadre) - parseFloat(valordiferenciaarestar),
                calculoalturacuadroborde = (valoralturacuadrobordegrueso * 100) / alturacuadroimagenpadre;

            //divcuadroimagenbordegrueso.css("height", calculoalturacuadroborde + "%");
            if (divcuadroimagenbordegrueso) {
                divcuadroimagenbordegrueso.style.height = calculoalturacuadroborde + "%";
            }
            //imagenmuestrafisica.css("height", calculoalturacuadroborde + "%");
            if (imagenmuestrafisica) {
                imagenmuestrafisica.style.height = calculoalturacuadroborde + "%";
            }
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'div_printatx');

(
    function init() {
        app_analisistextilimprimir.load();
        app_analisistextilimprimir.req_ini();
    }
)();
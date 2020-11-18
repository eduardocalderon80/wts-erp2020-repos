

function _parameterEncodeJSON(par) {    
    let p1 = par.replace(/{/g, "~").replace(/}/g, "┬");
    let p2 = p1.replace(/\"/g, "┼");  //alt + 197 = ┼
    return p2;
}

function _parameterUncodeJSON(par) {
    let p1 = par.replace(/~/g, "{").replace(/┬/g, "}");
    let p2 = p1.replace(/┼/g, "\"");  //alt + 197 = ┼
    return p2;
}

/*
"nombre"
" => _
{  => ~         126
}  => ┬         194
*/


var appViewHiladoPorPasada = (
    function (d, idpadre) {
        var ovariables = {
            lstcbohilado: [],
            fila_matrizligamento_editar: null
        }

        function load() {
            
            _('btnagregarhiladoporpasada').addEventListener('click', fn_agregarhilado, false);
            _('_btnAceptar_viewhiladoporpasada').addEventListener('click', fn_aceptar_hiladoporpasada, false);

        }

        function llenartabla_ini(odata) {
            let html = '';
            odata.forEach(x => {
                html += `<tr data-par='nrohilado:${x.nrohilado},idposicion:${x.idposicion},idanalisistextilhilado:${x.idanalisistextilhilado},idhilado:${x.idhilado},guid_hilado:${x.guid_hilado},idanalisistextilhiladoporpasada:${x.idanalisistextilhiladoporpasada}'>
                            <td class ='text-center' style='vertical-align:middle;'>
                                <button type='button' class ='btn btn-sm btn-danger _cls_eliminar_hiladoporpasada'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td>
                                <select class ='form-control cls_cbo_nrohilado'></select>
                                <span class ='spn_error_hilado has-error hide'>Seleccione el hilado</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_txt_largomallacrudo' value='${x.largomallacrudo}' />
                                <span class ='spn_error_largomallacrudo has-error hide'>Seleccione el largo malla crudo o largo malla acabado</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_txt_largomallaacabado' value='${x.largomallaacabado}' />
                                <span class ='spn_error_largomallaacabado has-error hide'>Seleccione el largo malla crudo o largo malla acabado</span>
                            </td>
                            <td>
                                <select class ='form-control cls_cbo_posicion'></select>
                            </td>
                        </tr>
                    `;
            });
            _('tbody_viewhiladoporpasada').innerHTML = html;
            fn_cargarcombos_ini();
            handler_tabla_ini();
        }

        function handler_tabla_ini() {
            let tbl = _('tbody_viewhiladoporpasada'), arrdel = Array.from(tbl.getElementsByClassName('_cls_eliminar_hiladoporpasada'));
            arrdel.forEach(x => {
                x.addEventListener('click', fn_del_hiladoporpasada, false);
            });
        }

        function handler_tabla_add(rowindex) {
            let tbody = _('tbody_viewhiladoporpasada'), btn = tbody.rows[rowindex].getElementsByClassName('_cls_eliminar_hiladoporpasada')[0];
            btn.addEventListener('click', fn_del_hiladoporpasada, false);
        }

        function fn_del_hiladoporpasada(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;

            fila.parentNode.removeChild(fila);
        }

        function fn_agregarhilado() {
            let html = `<tr>
                            <td class='text-center' style='vertical-align:middle;'>
                                <button type='button' class ='btn btn-sm btn-danger _cls_eliminar_hiladoporpasada'>
                                    <span class='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td>
                                <select class ='form-control cls_cbo_nrohilado'></select>
                                <span class='spn_error_hilado has-error hide'>Seleccione el hilado</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_txt_largomallacrudo' value='' />
                                <span class ='spn_error_largomallacrudo has-error hide'>Seleccione el largo malla crudo o largo malla acabado</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_txt_largomallaacabado' value='' />
                                <span class ='spn_error_largomallaacabado has-error hide'>Seleccione el largo malla crudo o largo malla acabado</span>
                            </td>
                            <td>
                                <select class ='form-control cls_cbo_posicion'></select>
                            </td>
                        </tr>
                `;
            _('tbody_viewhiladoporpasada').insertAdjacentHTML('beforeend', html);
            let indexfila = parseInt(_('tbody_viewhiladoporpasada').rows.length) - 1;
            fn_cargarcombos_add(indexfila);
            handler_tabla_add(indexfila);
        }

        function fn_cargarcombos_add(indexfila) {
            let tbody = _('tbody_viewhiladoporpasada');

            tbody.rows[indexfila].getElementsByClassName('cls_cbo_nrohilado')[0].innerHTML = _comboItem({ text: 'Select', value: '' }) + _comboFromJSON(ovariables.lstcbohilado, 'guid_hilado', 'descripcion'); //nrohilado
            tbody.rows[indexfila].getElementsByClassName('cls_cbo_posicion')[0].innerHTML = _comboItem({ text: 'Select', value: '' }) + _comboFromJSON(appAtxView.ovariables.lstcbo_posicionligamento, 'valorestado', 'nombreestado');
        }

        function fn_cargarcombos_ini() {
            let tbody = _('tbody_viewhiladoporpasada'), arrfilas = Array.from(tbody.rows);
            arrfilas.forEach(x => {
                let par = x.getAttribute('data-par'), nrohilado = _par(par, 'nrohilado'), idposicion = _par(par, 'idposicion'), cbonrohilado = x.getElementsByClassName('cls_cbo_nrohilado')[0],
                    cboposicion = x.getElementsByClassName('cls_cbo_posicion')[0], guid_hilado = _par(par, 'guid_hilado');
                cbonrohilado.innerHTML = _comboItem({ text: 'Select', value: '' }) + _comboFromJSON(ovariables.lstcbohilado, 'guid_hilado', 'descripcion'); //nrohilado
                cbonrohilado.value = guid_hilado; ///nrohilado;
                cboposicion.innerHTML = _comboItem({ text: 'Select', value: '' }) + _comboFromJSON(appAtxView.ovariables.lstcbo_posicionligamento, 'valorestado', 'nombreestado');
                cboposicion.value = idposicion;
            });
        }

        function fn_aceptar_hiladoporpasada(e) {
            let tbody = _('tbody_viewhiladoporpasada'), arrfilas = Array.from(tbody.rows), totalfilas = arrfilas.length, lstgrabar = [], strjson = '',
                descripcion_completa_hiladopasada = '';

            let pasavalidacion = validar_antes_grabar()
            if (pasavalidacion === false) {
                return false;
            }

            arrfilas.forEach((x, index) => {
                let par = x.getAttribute('data-par'), idanalisistextilhilado = _par(par, 'idanalisistextilhilado'), cbohilado_pasada = x.getElementsByClassName('cls_cbo_nrohilado')[0],
                    guid_hilado_cbo = cbohilado_pasada.value,
                    idanalisistextilhiladoporpasada= _par(par, 'idanalisistextilhiladoporpasada'),
                    nrohilado = x.getElementsByClassName('cls_cbo_nrohilado')[0].value, largomallacrudo = x.getElementsByClassName('cls_txt_largomallacrudo')[0].value,
                    largomallaacabado = x.getElementsByClassName('cls_txt_largomallaacabado')[0].value, cboposicion = x.getElementsByClassName('cls_cbo_posicion')[0], 
                    idposicion = cboposicion.value, descripcionposicion = cboposicion.value !== '' ? cboposicion.options[cboposicion.selectedIndex].text : '';

                let arrfilter_hiladocompleto = ovariables.lstcbohilado.filter(x => x.guid_hilado === guid_hilado_cbo); //x => x.nrohilado === nrohilado
                //let idhilado = arrfilter_hiladocompleto[0].idhilado;  /// guid_hilado = arrfilter_hiladocompleto[0].guid_hilado, 
                
                let obj = {
                    idanalisistextilhiladoporpasada: idanalisistextilhiladoporpasada === '' ? '0' : idanalisistextilhiladoporpasada,
                    idanalisistextilhilado: idanalisistextilhilado === '' ? 0 : idanalisistextilhilado,
                    largomallacrudo: largomallacrudo !== '' ? largomallacrudo : 0,
                    largomallaacabado: largomallaacabado !== '' ? largomallaacabado : 0,
                    idposicion: idposicion,
                    guid_hilado: guid_hilado_cbo,
                    filapasada: (ovariables.fila_matrizligamento_editar + 1).toString(),
                    idhilado: arrfilter_hiladocompleto[0].idhilado
                }
                lstgrabar.push(obj);
                
                descripcion_completa_hiladopasada += `<li class='cls_li_nombrehilado_completo' data-par='guid_hilado:${guid_hilado_cbo}'>
                                                        <span class='cls_spn_nombrehilado_li'>${arrfilter_hiladocompleto[0].descripcionhilado_masadicional}</span> LM. C=${largomallacrudo} LM. A=${largomallaacabado} (${descripcionposicion})
                                                    </li>`;
            });

            strjson = JSON.stringify(lstgrabar);
            //ovariables.fila_matrizligamento_editar
            let tbody_matriz4_hiladoporpasada = _('div_principal_matrizligamentos').getElementsByClassName('cls_tbody_matriz4_hiladoporpasada')[0];
            tbody_matriz4_hiladoporpasada.rows[ovariables.fila_matrizligamento_editar].setAttribute('data-table', strjson);
            //let lst = JSON.parse(strjson), cadenahtml = '';
            //lst.forEach(x => {
            //    cadenahtml += `${x.descripcion_completa_hiladopasada}`;
            //});
            tbody_matriz4_hiladoporpasada.rows[ovariables.fila_matrizligamento_editar].getElementsByClassName('cls_pasada_col1')[0].innerHTML = descripcion_completa_hiladopasada;
            $('#modal__ViewHiladoPorPasada').modal('hide');
        }

        function validar_antes_grabar(){
            let arrfilas = Array.from(_('tbody_viewhiladoporpasada').rows), pasavalidacion = true;
            if (arrfilas.length > 0) {
                arrfilas.forEach(x => {
                    x.getElementsByClassName('spn_error_hilado')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_largomallacrudo')[0].classList.add('hide');
                    x.getElementsByClassName('spn_error_largomallaacabado')[0].classList.add('hide');
                });
                arrfilas.forEach(x => {
                    let cbohilado = x.getElementsByClassName('cls_cbo_nrohilado')[0], txtlmc = x.getElementsByClassName('cls_txt_largomallacrudo')[0],
                        txtlma = x.getElementsByClassName('cls_txt_largomallaacabado')[0],
                        idhilado = cbohilado.selectedIndex > 0 ? cbohilado.value : '',
                        valor_lmc = txtlmc.value !== '' ? parseFloat(txtlmc.value) : 0, valor_lma = txtlma.value !== '' ? parseFloat(txtlma.value) : 0;

                    if (idhilado === '') {
                        x.getElementsByClassName('spn_error_hilado')[0].classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (valor_lmc === 0 && valor_lma === 0) {
                        x.getElementsByClassName('spn_error_largomallacrudo')[0].classList.remove('hide');
                        x.getElementsByClassName('spn_error_largomallaacabado')[0].classList.remove('hide');
                        pasavalidacion = false;
                    }
                });
            } else {
                _swal({ mensaje: 'Agregue al menos un hilado...!', estado: 'error' });
                pasavalidacion = false;
            }
            
            return pasavalidacion;
        }

        function req_ini() {
            let par = _('txtpar_viewhiladoporpasada').value, paruncode = _parameterUncodeJSON(par), parjson = JSON.parse(paruncode), partabla = parjson.tabla !== '' ? JSON.parse(parjson.tabla) : null;
            let tblhilados = _('tbody_yarndetail'), arrfilas = Array.from(tblhilados.rows), cadena = '';

            ovariables.lstcbohilado = [];
            ovariables.fila_matrizligamento_editar = parjson.fila;

            ///  ESTE ES EL RECORRIDO DE LA TABLA DE HILADOS
            arrfilas.forEach(x => {
                let nrohilado = x.getElementsByClassName('cls_hilado_nro')[0].innerText.trim(), descripcionnrohilado = 'Hilado' + x.getElementsByClassName('cls_hilado_nro')[0].innerText.trim(),
                    cbohilado = x.getElementsByClassName('cls_yarn')[0], idhilado = cbohilado.value, descripcionhilado = cbohilado.options[cbohilado.selectedIndex].text,
                    cbosistema = x.getElementsByClassName('cls_system')[0], descripcionsistema = cbosistema.options[cbosistema.selectedIndex].text,
                    cboformahilado = x.getElementsByClassName('cls_shapedyarn')[0]
                    , descripcionformahilado = cboformahilado.value //cboformahilado.selectedIndex > 0 ? cboformahilado.options[cboformahilado.selectedIndex].text : ''
                    , cbotitulo = x.getElementsByClassName('cls_title')[0]
                    , descripciontitulo = cbotitulo.value //cbotitulo.options[cbotitulo.selectedIndex].text
                    , par_tblhilado = x.getAttribute('data-par'), guid_hilado = _par(par_tblhilado, 'guid_hilado'),
                    datatable = x.getAttribute('data-table'), lst_mp = datatable !== '' ? JSON.parse(datatable) : null;

                let cadena_nombrecolor = lst_mp !== null ? lst_mp.map(x => x.nombrecolor).join(' ') : '';
                let arrfilter_hilado = appAtxView.ovariables.lstcbohilado.filter(x => x.idhilado === cbohilado.value);
                let strhilado = descripciontitulo + ' ' + descripcionsistema + ' ' + arrfilter_hilado[0].contenido + ' ' + descripcionformahilado;
                cadena = descripcionnrohilado + ' - ' + descripcionhilado + ' ' + cadena_nombrecolor + ' ' + descripcionsistema + ' ' + descripcionformahilado;
                obj = { nrohilado: nrohilado, descripcion: cadena, descripcionhilado_masadicional: strhilado, guid_hilado: guid_hilado, idhilado: idhilado };
                ovariables.lstcbohilado.push(obj);
            });

            if (partabla !== null) {
                llenartabla_ini(partabla);
            }
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
    
)(document, 'panelEncabezado_viewhiladoporpasada');

(
    function init(){
        appViewHiladoPorPasada.load();
        appViewHiladoPorPasada.req_ini();
    }
)();
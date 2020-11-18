var appViewMateriaPrimaAtx = (
    function (d, idpadre) {
        ovariables = {
            fila_hilado_editar: null,
            datatable_from_gridhilado: '',
            guid_hilado: '',
            idhilado: ''
        }

        function load() {
            _('_btnAceptar_viewhiladomateriaprima').addEventListener('click', fn_aceptar_materiaprima, false);
        }

        function fn_aceptar_materiaprima() {

            let tbody = _('tbody_vermateriaprima_hilado'), arrfilas = Array.from(tbody.rows), lst = [], guid_hilado = '', pasavalidacion = true, contenido = '', totalfilas = arrfilas.length;
            //// VALIDAR TIPO COLOR
                arrfilas.forEach(x => {
                let cbo_estado_tipocolor = x.getElementsByClassName('cls_cbo_estadotipocolor')[0];
                let spnerror = x.getElementsByClassName('spn_error_estadotipocolor')[0];
                spnerror.classList.add('hide');
                if (cbo_estado_tipocolor.value === '' || cbo_estado_tipocolor.selectedIndex <= 0) {
                    spnerror.classList.remove('hide');
                    pasavalidacion = false;
                }
            });

            if (!pasavalidacion) {
                return false;
            }

            if (ovariables.datatable_from_gridhilado !== '') {
                arrfilas.forEach((x, i) => {
                    let par = x.getAttribute('data-par'), idanalisistextilhiladocontenido = _par(par, 'idanalisistextilhiladocontenido'), idanalisistextilhilado = _par(par, 'idanalisistextilhilado'),
                        idmateriaprima = _par(par, 'idmateriaprima'), porcentaje = _par(par, 'porcentaje'), cbo_estado_tipocolor = x.getElementsByClassName('cls_cbo_estadotipocolor')[0],
                        idestadotextilhilado = cbo_estado_tipocolor.value, //_par(par, 'idestadotextilhilado'),
                        nombremateriaprima = _par(par, 'nombremateriaprima'), nombreestado = cbo_estado_tipocolor.options[cbo_estado_tipocolor.selectedIndex].text.trim(), //_par(par, 'nombreestado'),
                        cbocolor = x.getElementsByClassName('cls_cbo_colormateriaprima')[0], dl_color = x.getElementsByClassName('cls_cbo_colormateriaprima')[1],
                        idcolor = _getValueDataList(cbocolor.value, dl_color) //cbocolor.value
                        , nombrecolor = idcolor !== '' ? cbocolor.value.trim() : ''; //cbocolor.selectedIndex > 0 ? cbocolor.options[cbocolor.selectedIndex].text.trim() : '';

                    guid_hilado = _par(par, 'guid_hilado');

                    let obj = {
                        idanalisistextilhiladocontenido: idanalisistextilhiladocontenido,
                        idanalisistextilhilado: idanalisistextilhilado,
                        idmateriaprima: idmateriaprima,
                        porcentaje: porcentaje,
                        idestadotextilhilado: idestadotextilhilado,
                        idcolortextilhilado: idcolor,
                        guid_hilado: guid_hilado,
                        nombremateriaprima: nombremateriaprima,
                        nombreestado: nombreestado,
                        nombrecolor: nombrecolor
                    }

                    let arrnumber = porcentaje.split('.');
                    if (parseInt(arrnumber[1]) > 0) {
                        porcentaje = parseFloat(porcentaje).toFixed(2);
                    } else {
                        porcentaje = parseInt(porcentaje);
                    }
                    if ((i + 1) < totalfilas) {
                        contenido += porcentaje + '% ' + nombremateriaprima + ' ' + nombrecolor + ','
                    } else {
                        contenido += porcentaje + '% ' + nombremateriaprima + ' ' + nombrecolor
                    }
                    
                    lst.push(obj);
                });
            } else {
                arrfilas.forEach((x, i) => {
                    let par = x.getAttribute('data-par'),
                        idmateriaprima = _par(par, 'idmateriaprima'), porcentaje = _par(par, 'porcentaje'), cbo_estado_tipocolor = x.getElementsByClassName('cls_cbo_estadotipocolor')[0],
                        idestadotextilhilado = cbo_estado_tipocolor.value,
                        nombremateriaprima = _par(par, 'nombremateriaprima'), nombreestado = cbo_estado_tipocolor.options[cbo_estado_tipocolor.selectedIndex].text.trim(), //_par(par, 'nombreestado'),
                        cbocolor = x.getElementsByClassName('cls_cbo_colormateriaprima')[0], dl_color = x.getElementsByClassName('cls_cbo_colormateriaprima')[1],
                        idcolor = _getValueDataList(cbocolor.value, dl_color) //cbocolor.value
                        , nombrecolor = idcolor !== '' ? cbocolor.value.trim() : ''; //cbocolor.selectedIndex > 0 ? cbocolor.options[cbocolor.selectedIndex].text.trim() : '';

                    guid_hilado = _par(par, 'guid_hilado')

                    let obj = {
                        idanalisistextilhiladocontenido: 0,
                        idanalisistextilhilado: 0,
                        idmateriaprima: idmateriaprima,
                        porcentaje: porcentaje,
                        idestadotextilhilado: idestadotextilhilado,
                        idcolortextilhilado: idcolor,
                        guid_hilado: guid_hilado,
                        nombremateriaprima: nombremateriaprima,
                        nombreestado: nombreestado,
                        nombrecolor: nombrecolor
                    }

                    let arrnumber = porcentaje.split('.');
                    if (parseInt(arrnumber[1]) > 0) {
                        porcentaje = parseFloat(porcentaje).toFixed(2);
                    } else {
                        porcentaje = parseInt(porcentaje);
                    }
                    if ((i + 1) < totalfilas) {
                        contenido += porcentaje + '% ' + nombremateriaprima + ' ' + nombrecolor + ','
                    } else {
                        contenido += porcentaje + '% ' + nombremateriaprima + ' ' + nombrecolor
                    }

                    lst.push(obj);
                });
            }
            
            let tbody_hilado = _('tbody_yarndetail');
            tbody_hilado.rows[ovariables.fila_hilado_editar].setAttribute('data-table', JSON.stringify(lst));
            tbody_hilado.rows[ovariables.fila_hilado_editar].getElementsByClassName('cls_linkfiberyarn')[0].innerText = contenido;
            $('#modal__ViewMateriaPrima_Hilado').modal('hide');
        }

        function res_ini(rpta) {
            let orpta = rpta != '' ? CSVtoJSON(rpta) : null, html = '';

            if (orpta != null) {
                orpta.forEach((x, i) => {
                    //${x.estado}
                    // <select class='form-control cls_cbo_colormateriaprima'></select>
                    html += `<tr data-par='idanalisistextilhiladocontenido:0,idanalisistextilhilado:0,guid_hilado:${ovariables.guid_hilado},idcolortextilhilado:${x.idcolortextilhilado},idmateriaprima:${x.idmateriaprima},porcentaje:${x.porcentaje},idestadotextilhilado:${x.idestadotextilhilado},nombremateriaprima:${x.nombremateriaprima},nombreestado:${x.estado}'>
                            <td>${x.nombremateriaprima}</td>
                            <td>${x.porcentaje}</td>
                            <td>
                                <select class ='form-control cls_cbo_estadotipocolor'></select>
                                <span class='spn_error_estadotipocolor has-error hide'>Falta seleccionar el tipo color</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_cbo_colormateriaprima' list='_dl_color_viewmateriaprima_${(i + 1)}'/>
                                <datalist class ='cls_cbo_colormateriaprima' id='_dl_color_viewmateriaprima_${(i + 1)}'></datalist>
                            </td>
                </tr>
                `;
                });
                _('tbody_vermateriaprima_hilado').innerHTML = html;
                cargar_combo_tbl_materiaprima_ini();
            }
        }

        function llenartabla_materiaprima_jsondatatable(data) {
            let html = '', tbody = _('tbody_vermateriaprima_hilado');
            //${x.nombreestado}
            // <select class='form-control cls_cbo_colormateriaprima'></select>
            data.forEach((x, i) => {
                html += `<tr data-par='idanalisistextilhiladocontenido:${x.idanalisistextilhiladocontenido},idanalisistextilhilado:${x.idanalisistextilhilado},guid_hilado:${x.guid_hilado},idcolortextilhilado:${x.idcolortextilhilado},idmateriaprima:${x.idmateriaprima},porcentaje:${x.porcentaje},idestadotextilhilado:${x.idestadotextilhilado},nombremateriaprima:${x.nombremateriaprima},nombreestado:${x.nombreestado}'>
                            <td>${x.nombremateriaprima}</td>
                            <td>${x.porcentaje}</td>
                            <td>
                                <select class ='form-control cls_cbo_estadotipocolor'></select>
                                <span class ='spn_error_estadotipocolor has-error hide'>Falta seleccionar el tipo color</span>
                            </td>
                            <td>
                                <input type='text' class ='form-control cls_cbo_colormateriaprima' list='_dl_color_viewmateriaprima_${(i + 1)}'/>
                                <datalist class ='cls_cbo_colormateriaprima' id='_dl_color_viewmateriaprima_${(i + 1)}'></datalist>
                            </td>
                </tr>`;
            });
            tbody.innerHTML = html;
            cargar_combo_tbl_materiaprima_ini();
        }

        function cargar_combo_tbl_materiaprima_ini() {
            let tbody = _('tbody_vermateriaprima_hilado'), arrfilas = Array.from(tbody.rows);
            arrfilas.forEach(x => {
                let par = x.getAttribute('data-par'), cbocolor = x.getElementsByClassName('cls_cbo_colormateriaprima')[0], 
                    dl_color = x.getElementsByClassName('cls_cbo_colormateriaprima')[1],
                    idcolor = _par(par, 'idcolortextilhilado'),
                    cboestado_tipocolor = x.getElementsByClassName('cls_cbo_estadotipocolor')[0], idestadomateriaprima = _par(par, 'idestadotextilhilado'), 
                    options_color = _comboDataListFromJSON(appAtxView.ovariables.lst_pobuycolor_materiaprima, 'idcolor', 'nombrecolor');

                dl_color.innerHTML = options_color; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(appAtxView.ovariables.lst_pobuycolor_materiaprima, 'idcolor', 'nombrecolor');
                //cbocolor.value = idcolor;
                _setValueDataList(idcolor, dl_color, cbocolor);

                cboestado_tipocolor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(appAtxView.ovariables.lstestados_tipocolor_materiaprima, 'idestadomateriaprima', 'estadomateriaprima');
                cboestado_tipocolor.value = idestadomateriaprima;
            });
        }

        function req_ini() {
            let par = _('txtpar_viewmateriaprima').value, paruncode = appAtxView._parameterUncodeJSON(par),
                parjson = JSON.parse(paruncode), partabla = parjson.tabla !== '' ? JSON.parse(parjson.tabla) : null,
                idhilado = parjson.idhilado, datatable = parjson.tabla;

            ovariables.guid_hilado = parjson.guid_hilado;
            ovariables.fila_hilado_editar = parjson.fila;
            ovariables.idhilado = idhilado;

            if (datatable !== '') {
                let obj_datatable = JSON.parse(datatable);
                ovariables.datatable_from_gridhilado = datatable;
                llenartabla_materiaprima_jsondatatable(obj_datatable);
            } else {
                let parametro = JSON.stringify({ idhilado: idhilado });
                Get('DesarrolloTextil/Atx/getData_viewMateriaprima_hilado?par=' + parametro, res_ini)
            }

        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_vermateriaprima');


(
    function ini() {
        appViewMateriaPrimaAtx.req_ini();
        appViewMateriaPrimaAtx.load();
    }
)();
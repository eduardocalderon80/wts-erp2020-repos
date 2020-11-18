var appInstruccionCuidadoModal = (
    function (d, idpadre) {
        
        var ovariables = {
            accion: '',
            lstinstruccionescuidado_seleccionados: []
        }

        function load() {
            let par = _('txtpar_instruccioncuidado').value;

            if (!_isEmpty(par)) {
                ovariables.accion = _par(par, 'accion');
            }

            if (appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar.length > 0) {
                ovariables.lstinstruccionescuidado_seleccionados = JSON.parse(JSON.stringify(appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar));
                _('_txt_cadena_instrucciones_seleccionada').value = _('panelEncabezado_atxsolicitud').getElementsByClassName('cls_txt_comentario_instruccioncuidado')[0].value;
            }
            
            _('_btn_aceptar_instruccioncuidado').addEventListener('click', fn_aceptar, false);
        }

        function fn_aceptar() {
            let result_valid = validar_antes_aceptar(), obj_return = {}, arr_return_instruccioncuidado = [];

            if (result_valid) {
                _('panelEncabezado_atxsolicitud').getElementsByClassName('cls_txt_comentario_instruccioncuidado')[0].value = _('_txt_cadena_instrucciones_seleccionada').value;
                appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar = [];  //// LIMPIO EL ARRAY
                appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar = JSON.parse(JSON.stringify(ovariables.lstinstruccionescuidado_seleccionados)); //arr_return_instruccioncuidado;

                $('#modal__SeleccionarInstruccionCuidado').modal('hide');
            }
        }

        //function fn_getcadena_instruccioncuidad_seleccionados() {
        //    let arr_checked = _('div_detalle_instruccioncuidado').querySelectorAll('div.checked'), cadena_instruccion = '', totalchecked = 0;
        //    if (arr_checked.length > 0) {
        //        totalchecked = arr_checked.length;
        //        arr_checked.forEach((x, index) => {
        //            let fila = x.parentNode.parentNode.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
        //                instruccioncuidadoingles = _par(datapar, 'instruccioncuidadoingles');
        //            if ((index + 1) < totalchecked) {
        //                cadena_instruccion += instruccioncuidadoingles + ' / ';
        //            } else {
        //                cadena_instruccion += instruccioncuidadoingles;
        //            }
        //        });
        //    }

        //    return cadena_instruccion;
        //}

        function validar_antes_aceptar() {
            let arr_cheched = _('div_detalle_instruccioncuidado').querySelectorAll('div.checked'),
                mensaje = '', pasavalidacion = true;
            if (arr_cheched.length <= 0) {
                pasavalidacion = false;
                mensaje = 'Seleccionar al menos una instruccion de cuidado';
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return pasavalidacion;
        }

        function PintarDataNew(odata) {
            let html = '';
            if (odata !== null) {
                let divdetalleinstruccioncuidado = _('div_detalle_instruccioncuidado'),
                    arr_categoriainstruccion = odata[0].categoria_instruccioncuidado !== '' ? CSVtoJSON(odata[0].categoria_instruccioncuidado) : null,
                    arr_detalleinstruccion = odata[0].instruccioncuidado !== '' ? CSVtoJSON(odata[0].instruccioncuidado) : null;

                let fn_gethtml_detalleinstruccion = (idcategoria) => {
                    let html_detalle = '', arrfilter_detalleinstruccion = arr_detalleinstruccion.filter(x => x.idcategoriainstruccioncuidado === idcategoria);

                    arrfilter_detalleinstruccion.forEach((x) => {
                        let cadena_checked = '', cadena_cls_checked = '';
                        if (appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar.length > 0) {
                            let lstfilter = appNewSolicitudAtx.ovariables.lstinstruccioncuidado_grabar.filter(y => y.idcategoriainstruccioncuidado === x.idcategoriainstruccioncuidado && y.idinstruccioncuidado === x.idinstruccioncuidado);
                            if (lstfilter.length > 0) {
                                cadena_checked = 'checked="checked"';
                                //cadena_cls_checked = 'checked';
                            }
                        }
                        html_detalle += `
                                    <tr data-par='idinstruccioncuidado:${x.idinstruccioncuidado},idcategoriainstruccioncuidado:${x.idcategoriainstruccioncuidado},instruccioncuidadoingles:${x.instruccioncuidadoingles}'>
                                        <td class='col-sm-12'>
                                            <label>
                                                <div class ='icheckbox_square-green _clsdiv_chk_instruccion' style='position: relative;'>
                                                    <input type='checkbox' class ='i-checks _clscheck_instruccion' style='position: absolute; opacity: 0;' name='_chk_instruccion' value="" data-valor="" ${cadena_checked} />&nbsp
                                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                                </div>
                                                ${x.instruccioncuidadoingles}
                                            </label>
                                        </td>
                                    </tr>
                                `;
                    });

                    return html_detalle;
                }

                if (arr_categoriainstruccion !== null) {
                    arr_categoriainstruccion.forEach((x) => {
                        let htmldetalle = fn_gethtml_detalleinstruccion(x.idcategoriainstruccioncuidado);
                        html += `
                            <div class='col-sm-4'>
                                <table class='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th class='col-sm-12'>${x.categoriainstruccioncuidado}</th>
                                        </tr>
                                    </thead>
                                    <tbody class='cls_tbody_detalleinstruccioncuidado'>
                                        ${htmldetalle} 
                                    </tbody>
                                </table>
                            </div>
                        `;
                    });
                }

                divdetalleinstruccioncuidado.innerHTML = html;
                handler_tbl_instruccioncuidado();
            }

        }

        function handler_tbl_instruccioncuidado() {
            //// PARA LOS CHECKBOX - I-CHECKS
            $("#panelEncabezado_instruccioncuidado .i-checks").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on("ifChanged", function (e) {
                let chk = e.currentTarget, fila = chk.parentNode.parentNode.parentNode.parentNode.parentNode,
                    datapar = fila.getAttribute('data-par'), idinstruccioncuidado = _par(datapar, 'idinstruccioncuidado'),
                    idcategoriainstruccioncuidado = _par(datapar, 'idcategoriainstruccioncuidado'), instruccioncuidadoingles = _par(datapar, 'instruccioncuidadoingles');
                if (chk.checked) {
                    let obj = {
                        idsolicitudpartidaporinstruccioncuidado: '0',
                        idinstruccioncuidado: idinstruccioncuidado,
                        idcategoriainstruccioncuidado: idcategoriainstruccioncuidado,
                        instruccioncuidadoingles: instruccioncuidadoingles
                    }

                    ovariables.lstinstruccionescuidado_seleccionados.push(obj);
                } else {
                    ovariables.lstinstruccionescuidado_seleccionados = ovariables.lstinstruccionescuidado_seleccionados.filter((x) => { return (x.idinstruccioncuidado + x.idcategoriainstruccioncuidado !== idinstruccioncuidado + idcategoriainstruccioncuidado) });
                }
                let arr_nombres = ovariables.lstinstruccionescuidado_seleccionados.map((m) => { return m.instruccioncuidadoingles; });
                let cadena = arr_nombres.join(" / ");
                _('_txt_cadena_instrucciones_seleccionada').value = cadena;
            });
        }

        function req_ini() {
            _Get('DesarrolloTextil/Solicitud/Get_IniNew_InstruccionCuidadoSolicitudAtx')
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    PintarDataNew(odata);
                });
            //if (ovariables.accion === 'new') {
            //    _Get('DesarrolloTextil/Solicitud/Get_IniNew_InstruccionCuidadoSolicitudAtx')
            //        .then((data) => {
            //            let odata = data !== '' ? JSON.parse(data) : null;
            //            PintarDataNew(odata);
            //        });
            //} else if (ovariables.accion === 'edit') {

            //}
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_instruccioncuidado');

(
    function () {
        appInstruccionCuidadoModal.load();
        appInstruccionCuidadoModal.req_ini();
    }    
)();
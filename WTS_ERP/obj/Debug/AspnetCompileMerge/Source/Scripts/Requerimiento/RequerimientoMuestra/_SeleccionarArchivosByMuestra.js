var appSeleccionarArchivosByMuestra = (
    function (d, idpadre) {
        ovariables = {
            idestilo: '',
            idrequerimiento: ''
        }
        function load() {
            let txtpar = _('txtpar_seleccionararchivocorreo').value;
            ovariables.idestilo = _par(txtpar, 'idestilo')
            ovariables.idrequerimiento = _par(txtpar, 'idrequerimiento');

            _('_btnAceptar_seleccionararchivocorreo').addEventListener('click', fn_seleccionar_archivo, false);
        }

        function fn_validar_antes_aceptar() {
            let pasavalidacion = true;
            let arr_filas = Array.from(_('tbody_seleccionararchivocorreo').rows);
            
            if (arr_filas.length > 0) {
                let chk_select = Array.from(_('tbody_seleccionararchivocorreo').getElementsByClassName('_cls_chk_file_sendcorreo')).filter(x => x.checked === true);
                if (chk_select <= 0) {
                    pasavalidacion = false;
                    _swal({ mensaje: 'Falta seleccionar al menos un archivo...!', estado: 'error' }, 'Advertencia');
                }
            } else {
                pasavalidacion = false;
                _swal({ mensaje: 'No hay archivos para seleccionar...!', estado: 'error' }, 'Advertencia');
            }

            return pasavalidacion;
        }

        function fn_seleccionar_archivo() {
            let validacion = fn_validar_antes_aceptar();
            if (validacion) {
                let arr_seleccionados = Array.from(_('tbody_seleccionararchivocorreo').getElementsByClassName('_cls_chk_file_sendcorreo')).filter(x => x.checked === true)
                    .map(x => {
                        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                        let datapar = fila.getAttribute('data-par');
                        
                        return {
                            IdRequerimiento: _par(datapar, 'idrequerimiento'),
                            IdArchivo: _par(datapar, 'idarchivo'),
                            NombreArchivoOriginal: _par(datapar, 'nombrearchivooriginal'),
                            Usuario_Area: _par(datapar, 'usuario_area'),
                            NombreTipoArchivo: _par(datapar, 'nombretipoarchivo'),
                            NombreTipoMuestra: _par(datapar, 'nombretipomuestra'),
                            FechaActualizacion: _par(datapar, 'fechaactualizacion').replace(/~/g, ':'),
                            NombreArchivo: _par(datapar, 'nombrearchivo'),
                            IdTipoArchivo: _par(datapar, 'idtipoarchivo'),
                            IdTipoMuestraxCliente: _par(datapar, 'idtipomuestraxcliente')
                        }
                    });

                app_RequerimientoDetalleDDP.fn_llenar_tbl_archivos_seleccionados_from_modal(arr_seleccionados)
                $("#modal__SeleccionarArchivosByMuestra").modal('hide');
            }
        }

        function res_ini(odata) {
            if (odata) {
                let txtpar = _('txtpar_seleccionararchivocorreo').value;
                let cadena_idarchivos = _par(txtpar, 'cadena_idarchivos');
                let arr_idarchivos = (cadena_idarchivos !== null) ? cadena_idarchivos.split('~') : [];
                let arr_archivos = [];
                if (arr_idarchivos.length > 0) {
                    arr_archivos = odata.filter(x => x.IdRequerimiento === ovariables.idrequerimiento)
                        .filter(x => {
                            return arr_idarchivos.indexOf(x.IdArchivo) === -1
                        });
                } else {
                    arr_archivos = odata.filter(x => x.IdRequerimiento === ovariables.idrequerimiento);
                }
                let html = arr_archivos.map((x, indice) => {
                    //// EN LA FECHA CAMBIO : POR | PRA PODER USAR LA FUNCION _PAR
                    let fecha = x.FechaActualizacion.replace(/:/g, '~')
                    return `
                        <tr data-par='idrequerimiento:${x.IdRequerimiento},idarchivo:${x.IdArchivo},nombrearchivooriginal:${x.NombreArchivoOriginal},nombrearchivo:${x.NombreArchivo},usuario_area:${x.Usuario_Area},nombretipoarchivo:${x.NombreTipoArchivo},nombretipomuestra:${x.NombreTipoMuestra},fechaactualizacion:${fecha},idtipoarchivo:${x.IdTipoArchivo},idtipomuestraxcliente:${x.IdTipoMuestraxCliente}'>
                            <td class='text-center' style='vertical-align:middle;'>
                                <div class='col-sm-12'>
                                    <div class='col-sm-1'>
                                        <div class="checkbox checkbox-green col-sm-1">
                                            <input type="checkbox" id='chk_${indice}' class='_cls_chk_file_sendcorreo' name="chk_file_sendcorreo">
                                            <label for="chk_${indice}"></label>
                                        </div>
                                    </div>
                                    <div class='col-sm-1'>
                                        <button class='btn btn-xs btn-info cls_btn_downloadarchivo_correo'>
                                            <span class='fa fa-download'></span>
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td>${x.NombreArchivoOriginal}</td>
                            <td>${x.Usuario_Area}</td>
                            <td>${x.NombreTipoArchivo}</td>
                            <td>${x.NombreTipoMuestra}</td>
                            <td>${x.FechaActualizacion}</td>
                        </tr>
                    `
                }).join('');

                _('tbody_seleccionararchivocorreo').innerHTML = html;
                fn_handler_tabla_archivos_correo();
            }
        }

        function fn_handler_tabla_archivos_correo() {
            Array.from(_('tbody_seleccionararchivocorreo').getElementsByClassName('cls_btn_downloadarchivo_correo'))
                .forEach(x => x.addEventListener('click', e => { fn_download_file_correo(e.currentTarget); }, false));
        }

        function fn_download_file_correo(o) {
            let fila = o.parentNode.parentNode.parentNode.parentNode;
            let datapar = fila.getAttribute('data-par');
            let nombrearchivo = _par(datapar, 'nombrearchivo');
            let nombrearchivooriginal = _par(datapar, 'nombrearchivooriginal');
            let link = document.createElement('a');
            link.href = urlBase() + `Requerimiento/RequerimientoMuestra/DownLoadFileTechkPack?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        function req_ini() {
            _Get('Requerimiento/RequerimientoMuestra/GetListaArchivoByIdRequerimiento_or_IdEstilo?IdEstilo=' + ovariables.idestilo)
                .then((datacsv) => {
                    let odata = datacsv !== '' ? CSVtoJSON(datacsv) : null;
                    res_ini(odata);
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelencabezado_SeleccionarArchivosByMuestra');

(
    function init() {
        appSeleccionarArchivosByMuestra.load();
        appSeleccionarArchivosByMuestra.req_ini();
    }
)();
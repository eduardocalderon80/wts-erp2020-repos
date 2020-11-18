var appModalSolicitudCotizar = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud: 0,
            id: 0,
            tipo: 0,
            boton: 0,
            estado: ''
        }

        function load() {
            _('btnAprobarCotizacion').addEventListener('click', fn_Aprobar);
            _('btnRechazarCotizacion').addEventListener('click', fn_Rechazar);

            let par = _('txtparametro').value;
            if (!_isEmpty(par)) {
                ovariables.idsolicitud = _parseInt(_par(par, 'idsolicitud'));
                ovariables.id = _parseInt(_par(par, 'id'));
                ovariables.boton = _parseInt(_par(par, 'boton'));
                ovariables.estado = _par(par, 'estado');

                // En caso se cruce nombres txtparametro
                if (appSolicitudAtx.ovariables.lstSolicitud.Estado.trim() === 'PAP' || appSolicitudAtx.ovariables.lstSolicitud.Estado.trim() === 'PAR') {
                    ovariables.estado = appSolicitudAtx.ovariables.estados.PORASIGNAR;
                } else if (appSolicitudAtx.ovariables.lstSolicitud.Estado.trim() === 'PR' || appSolicitudAtx.ovariables.lstSolicitud.Estado.trim() === 'PRR') {
                    ovariables.estado = appSolicitudAtx.ovariables.estados.FINALIZADO;
                }

                if (ovariables.boton === 0) {
                    _('btnAprobarCotizacion').classList.remove("hide");
                } else {
                    _('btnRechazarCotizacion').classList.remove("hide");
                }

                if (ovariables.estado === 'F' || ovariables.estado === 'POR') {
                    ovariables.tipo = 1;
                    //_('modal_title_AprobarRechazarCotizacion').innerHTML = 'Revisar Solicitud';
                    //_('modal__AprobarRechazarCotizacion').children[0].children[0].children[0].style.background = '#337ab7';
                    //_('btnAprobarCotizacion').style.background = '#337ab7';
                    //_('btnAprobarCotizacion').style.border = '#2e6da4';
                    //_('btnAprobarCotizacion').innerHTML = `<span class="fa fa-check"></span> Finalizar`;
                }
            }

            // hidden.bs.modal - shown.bs.modal
            $('.modal').on('hidden.bs.modal', function () {
                $('#modal__AprobarRechazarCotizacion').remove();
                //removejscssfile('_AprobarRechazarCotizacion', 'js');
            });
        }

        function req_ini() {

        }

        function req_CambiarEstado() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    idsolicitud: ovariables.idsolicitud,
                    idcotizacion: ovariables.id,
                    estado: ovariables.estado,
                    comentario: _('txtComentarioCotizacion').value,
                    tipo: ovariables.tipo
                }, frm = new FormData();
            frm.append('par', JSON.stringify(parametro));
            _Post('DesarrolloTextil/CotizarTela/GetData_CambiarEstado', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        $('#modal__AprobarRechazarCotizacion').modal('hide');
                        swal({ title: "¡Buen Trabajo!", text: "Se Actualizo con exito", type: "success" });
                        if (ovariables.estado !== 'F') {
                            appSolicitudAtx.fn_RefreshAndSelect(ovariables.idsolicitud);
                        } else {
                            appSolicitudAtx.refrescarsolicitud_index();
                        }
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_Aprobar() {
            swal({
                html: true,
                title: 'Aprobar Solicitud',
                text: '¿Estas Seguro/a que deseas aprobar la solicitud #' + ovariables.idsolicitud + '?',
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                req_CambiarEstado();
            });
        }

        function fn_Rechazar() {
            swal({
                html: true,
                title: 'Rechazar Solicitud',
                text: '¿Estas Seguro/a que deseas rechazar la solicitud #' + ovariables.idsolicitud + '?',
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                req_CambiarEstado();
            });
        }
        
        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezadoModalCotizacion');
(
    function ini() {
        appModalSolicitudCotizar.load();
        appModalSolicitudCotizar.req_ini();
    }
)();
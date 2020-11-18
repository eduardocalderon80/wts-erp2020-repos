var appModalSolicitudAsignar = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud: 0,
            id: 0,
            estado: '',
            idoperador: 0,
            operador: '',
            lstOperadores: [],
            idprocesorutatela: '',
            nombreproceso: '',
            idsolicituddesarrollotelaLeadtimes: '',
            estadowts: '',
            fabrica: ''
        }

        function load() {
            _('btnAceptarCotizacion').addEventListener('click', fn_Asignar);

            let par = _('txtparametro').value;
            if (!_isEmpty(par)) {
                ovariables.idsolicitud = _parseInt(_par(par, 'idsolicitud'));
                ovariables.id = _parseInt(_par(par, 'id'));
                ovariables.estado = _par(par, 'estado');

                // Si es desarrollo de tela
                ovariables.idprocesorutatela = _par(par, 'idprocesorutatela') !== '' ? _parseInt(_par(par, 'idprocesorutatela')) : null;
                ovariables.nombreproceso = _par(par, 'nombreproceso') !== '' ? _par(par, 'nombreproceso') : null;
                ovariables.idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes') !== '' ? _parseInt(_par(par, 'idsolicituddesarrollotelaLeadtimes')) : null;
                ovariables.estadowts = _par(par, 'estadowts') !== '' ? _par(par, 'estadowts') : null;
                ovariables.fabrica = _par(par, 'fabrica') !== '' ? _par(par, 'fabrica') : 0;
                if (ovariables.idprocesorutatela !== null) {
                    _('btnAceptarCotizacion').addEventListener('click', fn_AsignarDesarrollo);
                }
            }

            //// hidden.bs.modal - shown.bs.modal
            $('.modal').on('hidden.bs.modal', function () {
                $('#modal__AsignarCotizacion').remove();
                //removejscssfile("_AsignarCotizacion", "js");
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { IdPerfil: 3 };
            _Get('DesarrolloTextil/Solicitud/ObtenerAnalista?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? CSVtoJSON(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstOperadores = rpta;
                        fn_crearTabla(rpta);
                    }
                }, (p) => { err(p); });
        }

        function fn_crearTabla(_json) {
            let html = ``;
            if (_json.length > 0) {
                _json.forEach(x => {
                    html += `<tr data-par='idusuario:${x.IdAnalista},usuario:${x.usuario}'>
                                <td class="text-center">
                                    <input class="i-check" type="radio" data-id="${x.IdAnalista}" name="radio_operador" />
                                </td>
                                <td>${x.Analista}</td>
                                <td class="no-required">${x.NroPendiente}</td>
                             </tr>`;
                });
            }
            _('tbody_Analista').innerHTML = html;

            if (ovariables.idprocesorutatela !== null) {
                $('.no-required').remove();
            }

            $('.i-check').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                ovariables.idoperador = $(this).data('id');
                ovariables.operador = ovariables.lstOperadores.filter(x => _parseInt(x.IdAnalista) === $(this).data('id'))[0].Analista
            });
        }

        function req_CambiarEstado() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    idsolicitud: ovariables.idsolicitud,
                    idcotizacion: ovariables.id,
                    estado: ovariables.estado,
                    idoperador: ovariables.idoperador
                }, frm = new FormData();
            frm.append('par', JSON.stringify(parametro));
            _Post('DesarrolloTextil/CotizarTela/GetData_CambiarEstado', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        $('#modal__AsignarCotizacion').modal('hide');
                        swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                        appSolicitudAtx.fn_RefreshAndSelect(ovariables.idsolicitud);
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_Asignar() {
            if (ovariables.idoperador !== 0) {
                swal({
                    html: true,
                    title: 'Asignar Solicitud',
                    text: '¿Estas Seguro/a que deseas asignar la solicitud #' + ovariables.idsolicitud + ' al usuario ' + ovariables.operador + '?',
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    req_CambiarEstado();
                });
            } else {
                swal({ title: "Advertencia", text: "Tienes que seleccionar un Analista", type: "warning" });
            }
        }

        function req_CambiarEstadoDesarrollo() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    idprocesorutatela: ovariables.idprocesorutatela,
                    idsolicituddesarrollotelaLeadtimes: ovariables.idsolicituddesarrollotelaLeadtimes,
                    idoperador: ovariables.idoperador,
                    estadowts: ovariables.estadowts,
                    fabrica: ovariables.fabrica
                }, frm = new FormData(), div_checked = _('tbody_Analista').getElementsByClassName('checked')[0],
                fila = div_checked.parentNode.parentNode, datapar = fila.getAttribute('data-par'), usuario = _par(datapar, 'usuario').trim();
            frm.append('par', JSON.stringify(parametro));
            _Post('DesarrolloTextil/SolicitudDesarrolloTela/UpdateData_LeadTime', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        $('#modal__AsignarCotizacion').modal('hide');
                        //// NOTIFICAR AL OPERADOR
                        let obj_mensaje = {
                            plataforma: 'todas',
                            tipomensaje: 'notificar',
                            usuario_destino: usuario,
                            //mensaje: "El usuario " + window.utilindex.usuario + " te asignó \n el seguimiento del desarrollo " + appNewSDT.ovariables.idsolicituddesarrollotela + ". \n Proceso Tela",
                            mensaje_para_app: "Proceso Tela: " + ovariables.nombreproceso,
                            usuario_origen: window.utilindex.usuario,
                            titulo_mensaje: "Asignación Desarrollo " + appNewSDT.ovariables.idsolicituddesarrollotela,
                            mensaje_para_erp: "Asignación Desarrollo " + appNewSDT.ovariables.idsolicituddesarrollotela + "\n Proceso Tela: " + ovariables.nombreproceso
                        };

                        ////erpwtshub_principal.server.sendMessage(window.utilindex.usuario, JSON.stringify(obj_mensaje)); //"Has sido asignado al seguimiento de tela"
                        notificacion_erp(window.utilindex.usuario, JSON.stringify(obj_mensaje));
                        swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" }, function () {
                            appNewSDT.req_ini();
                        });
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_AsignarDesarrollo() {
            if (ovariables.idoperador !== 0) {
                swal({
                    html: true,
                    title: 'Asignar Proceso',
                    text: '¿Estas Seguro/a que deseas asignar el proceso ' + ovariables.nombreproceso + ' al usuario ' + ovariables.operador + '?',
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    req_CambiarEstadoDesarrollo();
                });
            } else {
                swal({ title: "Advertencia", text: "Tienes que seleccionar un Analista", type: "warning" });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezadoModalCotizacionAsignar');
(
    function ini() {
        appModalSolicitudAsignar.load();
        appModalSolicitudAsignar.req_ini();
    }
)();
var appLeadTimeTerminar = (
    function (d, idpadre) {
        var ovariables = {
            idprocesorutatela: '',
            nombreproceso: '',
            idsolicituddesarrollotelaLeadtimes: '',
            estadowts: '',
            fabrica: ''
        }

        function load() {
            _('btnTerminarProceso').addEventListener('click', fn_TerminarDesarrollo);

            let par = _('txtparametro').value;
            if (!_isEmpty(par)) {
                // Si es desarrollo de tela
                ovariables.idprocesorutatela = _par(par, 'idprocesorutatela') !== '' ? _parseInt(_par(par, 'idprocesorutatela')) : null;
                ovariables.nombreproceso = _par(par, 'nombreproceso') !== '' ? _par(par, 'nombreproceso') : null;
                ovariables.idsolicituddesarrollotelaLeadtimes = _par(par, 'idsolicituddesarrollotelaLeadtimes') !== '' ? _parseInt(_par(par, 'idsolicituddesarrollotelaLeadtimes')) : null;
                ovariables.estadowts = _par(par, 'estadowts') !== '' ? _par(par, 'estadowts') : null;
                ovariables.fabrica = _par(par, 'fabrica') !== '' ? _par(par, 'fabrica') : 0;
                _('txtObservacionLeadTime').value = _par(par, 'texto');
            }

            // hidden.bs.modal - shown.bs.modal
            $('.modal').on('hidden.bs.modal', function () {
                $('#modal__TerminarProcesoLeadTime').remove();
                removejscssfile("_TerminarProcesoLeadTime", "js");
            });
        }

        function req_ini() {

        }

        function req_CambiarEstadoDesarrollo() {
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    idprocesorutatela: ovariables.idprocesorutatela,
                    idsolicituddesarrollotelaLeadtimes: ovariables.idsolicituddesarrollotelaLeadtimes,
                    observacion: _('txtObservacionLeadTime').value,
                    estadowts: ovariables.estadowts,
                    fabrica: ovariables.fabrica
                }, frm = new FormData();
            frm.append('par', JSON.stringify(parametro));
            _Post('DesarrolloTextil/SolicitudDesarrolloTela/UpdateData_LeadTime', frm)
                .then((resultado) => {
                    if (resultado !== null) {
                        $('#modal__AsignarCotizacion').modal('hide');
                        swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" }, function () {
                            appNewSDT.req_ini();
                        });
                    } else {
                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function fn_TerminarDesarrollo() {
            if (ovariables.idoperador !== 0) {
                swal({
                    html: true,
                    title: 'Terminar Proceso',
                    text: '¿Estas Seguro/a que deseas terminar el proceso ' + ovariables.nombreproceso + '?',
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
)(document, 'panelEncabezadoLeadTimeTerminar');
(
    function ini() {
        appLeadTimeTerminar.load();
        appLeadTimeTerminar.req_ini();
    }
)();
var appRecibirSolicitudDesarrolloFabrica = (
    function (d, idpadre) {
        var ovariables = {
            idsolicituddetalledesarrollotela: ''
        }
        function load() {
            let par = _('hf_parametro').value, idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela');

            ovariables.idsolicituddetalledesarrollotela = idsolicituddetalledesarrollotela;
        }

        function req_ini() {
            let url = 'DesarrolloTextil/SolicitudDesarrolloTela/ActualizarRecibidoConformeSolicitudDesarrolloFabrica',
                frm = new FormData(), parametro = { idsolicituddetalledesarrollotela: ovariables.idsolicituddetalledesarrollotela, estado_recibido: 1 };

            frm.append("par", JSON.stringify(parametro));
            _Post(url, frm)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;

                    if (odata !== null) {
                        _('div_mensaje_recibirconforme').value = 'Recibido Conforme';
                        _swal({ mensaje: 'Recibido Conforme', estado: 'success' });
                    }
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
    
)(document, 'div_principal');

(
    function init() {
        appRecibirSolicitudDesarrolloFabrica.load();
        appRecibirSolicitudDesarrolloFabrica.req_ini();
    }    
)();
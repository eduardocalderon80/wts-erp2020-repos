var appRecibirSolicitudAtxComercial = (
    function (d, idpadre) {
        var ovariables = {
            idsolicituddetalledesarrollotela: '',
            idanalisistextilsolicitud: ''
        }
        function load() {
            let par = _('hf_parametro').value, idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'),
                idanalisistextilsolicitud = _par(par, 'idanalisistextilsolicitud');

            ovariables.idsolicituddetalledesarrollotela = idsolicituddetalledesarrollotela;
            ovariables.idanalisistextilsolicitud = idanalisistextilsolicitud;
        }

        function req_ini() {
            let url = 'DesarrolloTextil/SolicitudDesarrolloTela/ActualizarConformeRecibidoComercialSolicitudAtxMuestraFisica',
                frm = new FormData(), parametro = {
                    idsolicituddetalledesarrollotela: ovariables.idsolicituddetalledesarrollotela,
                    idanalisistextilsolicitud: ovariables.idanalisistextilsolicitud,
                    estado_recibido: 1
                };

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
        appRecibirSolicitudAtxComercial.load();
        appRecibirSolicitudAtxComercial.req_ini();
    }
)();
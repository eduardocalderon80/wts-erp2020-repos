var appEntregableAtxAprobacion = (
        function (d, idpadre){
            var ovariables = {
                estadoenviar: '',
                estadobotonstr: '',
                estadobotonbool: '',
                idsolicitud: '',
                idanalisistextilsolicitud: '',
                idanalisistextil: 0,
                idmotivosolicitud: ''
            }

            function load(){
                let par = _('txtpar_aprobarrechazar_entregableatx').value, estadobotonbool = _par(par, 'estadobotonbool'), estadobotonstr = _par(par, 'estadobotonstr'), estadoenviar = _par(par, 'estadoenviar'),
                    idsolicitud = _par(par, 'idsolicitud'), idanalisistextilsolicitud = _par(par, 'idanalisistextilsolicitud'), idanalisistextil = _par(par, 'idanalisistextil'),
                    idmotivosolicitud = _par(par, 'idmotivosolicitud');
                ovariables.estadoenviar = estadoenviar;
                ovariables.estadobotonstr = estadobotonstr;
                ovariables.estadobotonbool = estadobotonbool;
                ovariables.idsolicitud = idsolicitud;
                ovariables.idanalisistextilsolicitud = idanalisistextilsolicitud;  
                ovariables.idanalisistextil = idanalisistextil;
                ovariables.idmotivosolicitud = idmotivosolicitud;

                if (estadobotonbool === "1") {
                    _('_btn_aprobar_entregableatx').classList.remove('hide');
                } else if (estadobotonbool === "0") {
                    _('_btn_rechazar_entregableatx').classList.remove('hide');
                }

                _('_btn_aprobar_entregableatx').addEventListener('click', fn_aprobar);
                _('_btn_rechazar_entregableatx').addEventListener('click', fn_rechazar);
            }

            var err = (__err) => {
                console.log('err', __err);
            }

            function fn_aprobar() {
                let parametro = {
                    estado: appEntregableAtxAprobacion.ovariables.estadoenviar,
                    idsolicitud: appEntregableAtxAprobacion.ovariables.idsolicitud,
                    estadobotonbool: appEntregableAtxAprobacion.ovariables.estadobotonbool,
                    idanalisistextilsolicitud: appEntregableAtxAprobacion.ovariables.idanalisistextilsolicitud,
                    comentario: _('_txta_comentario_aprobarrechazar_entregableatx').value,
                    idanalisistextil: appEntregableAtxAprobacion.ovariables.idanalisistextil,
                    idmotivosolicitud: appEntregableAtxAprobacion.ovariables.idmotivosolicitud
                }, frm = new FormData();

                frm.append('par', JSON.stringify(parametro));

                _Post('DesarrolloTextil/Solicitud/AprobarRechazarEntregableAtx', frm)
                    .then((respuesta) => {
                        let rpta = JSON.parse(respuesta);
                        swal({
                            title: 'Message',
                            text: rpta.mensaje,
                            type: rpta.estado
                        }, function (result) {
                            if (result) {
                                if (rpta.id > 0) {                                                                   
                                    $('#modal__AprobarRechazarEntregableAtx').modal('hide');
                                    ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', appEntregableAtxAprobacion.ovariables.idsolicitud, 'divcontenedor_breadcrum');
                                }
                            }
                        });

                    }, (p) => { appEntregableAtxAprobacion.err(p) });
            }

            function fn_rechazar() {
                let comentario = _('_txta_comentario_aprobarrechazar_entregableatx').value, parametro = {
                    estado: appEntregableAtxAprobacion.ovariables.estadoenviar,
                    idsolicitud: appEntregableAtxAprobacion.ovariables.idsolicitud,
                    estadobotonbool: appEntregableAtxAprobacion.ovariables.estadobotonbool,
                    idanalisistextilsolicitud: appEntregableAtxAprobacion.ovariables.idanalisistextilsolicitud,
                    comentario: comentario,
                    idanalisistextil: appEntregableAtxAprobacion.ovariables.idanalisistextil,
                    idmotivosolicitud: appEntregableAtxAprobacion.ovariables.idmotivosolicitud
                }, frm = new FormData();

                // VALIDAR ANTES DE GRABAR
                if (comentario === '') {
                    _('div_grupo_comentario_aprobarrechazar_entregableatx').classList.add('has-error');
                    return false;
                } else {
                    _('div_grupo_comentario_aprobarrechazar_entregableatx').classList.remove('has-error');
                }

                frm.append('par', JSON.stringify(parametro));

                _Post('DesarrolloTextil/Solicitud/AprobarRechazarEntregableAtx', frm)
                    .then((respuesta) => {
                        let rpta = JSON.parse(respuesta);
                        swal({
                            title: 'Message',
                            text: rpta.mensaje,
                            type: rpta.estado
                        }, function (result) {
                            if (result) {
                                if (rpta.id > 0) {
                                    $('#modal__AprobarRechazarEntregableAtx').modal('hide');
                                    ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', appEntregableAtxAprobacion.ovariables.idsolicitud, 'divcontenedor_breadcrum');
                                }
                            }
                        });

                    }, (p) => { appEntregableAtxAprobacion.err(p) });
            }

            function req_ini(){
            
            }

            return {
                load: load,
                req_ini: req_ini,
                ovariables: ovariables,
                err: err
            }
        }
    
)(document, 'panelEncabezado_aprobarrechazar_entregableatx');

(
    function(){
        appEntregableAtxAprobacion.load();
        appEntregableAtxAprobacion.req_ini();
    }
)();
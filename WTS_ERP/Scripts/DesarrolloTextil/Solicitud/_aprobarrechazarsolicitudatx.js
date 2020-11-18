var appSolicitudAtxAprobacion = (
    function (d, idpadre) {
        var ovariables = {
            estadoenviar: '',
            estadobotonstr: '',
            estadobotonbool: '',
            idsolicitud: '',
            idanalisistextilsolicitud: '',
            motivorechazo: '',
            idservicio: '',
            idcolgadorsolicitud: ''
        }

        function load(){
            let par = _('txtpar_aprobarrechazar_solicitudatx').value, estadobotonbool = _par(par, 'estadobotonbool'), estadobotonstr = _par(par, 'estadobotonstr'), estadoenviar = _par(par, 'estadoenviar'),
                idsolicitud = _par(par, 'idsolicitud'), idanalisistextilsolicitud = _par(par, 'idanalisistextilsolicitud'), idcolgadorsolicitud = _par(par, 'idcolgadorsolicitud');
            ovariables.estadoenviar = estadoenviar;
            ovariables.estadobotonstr = estadobotonstr;
            ovariables.estadobotonbool = estadobotonbool;
            ovariables.idsolicitud = idsolicitud;
            ovariables.idanalisistextilsolicitud = idanalisistextilsolicitud;
            ovariables.idcolgadorsolicitud = idcolgadorsolicitud;
            ovariables.idservicio = _par(par, 'idservicio');

            //if (estadobotonbool === "1") {  // APROBAR
            //    _('_btn_aprobar_solicitudatx').classList.remove('hide');
            //    if (_('hf_esnecesario_recibirsolicitud').value === '') {
            //        _('div_grupo_recibirsolicitud').classList.remove('hide');
            //    }
            //} else if (estadobotonbool === "0") { // RECHAZAR
            //    _('_btn_rechazar_solicitudatx').classList.remove('hide');
            //    _('div_grupo_recibirsolicitud').classList.add('hide');
            //}

            _('_btn_aprobar_solicitudatx').addEventListener('click', fn_aprobar);
            _('_btn_rechazar_solicitudatx').addEventListener('click', fn_rechazar);

            _('panelEncabezado_aprobarrechazar_solicitudatx').getElementsByClassName('_titulo_aprobarrechazarsolicitud')[0].innerText = 'Solicitud #' + ovariables.idsolicitud;
            handler_scanner_barcode();
        }

        function handler_scanner_barcode() {
            ////preventDefault: true,  // LE QUITE ESTO PORQUE ME BLOQUEABA TODOS LOS INPUTS
            $(document).scannerDetection({
                timeBeforeScanTest: 200, // wait for the next character for upto 200ms
                avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
                minLength: 4,  // POR DEFECTO SI NO SE PONE ESTA CONFIGURACION ES DE 6 DIGITOS
                onComplete: function (barcode, qty) {
                    _('txtbarcode').value = barcode;
                    if (ovariables.idsolicitud !== barcode) {
                        _('hf_chk_solicitudrecibida').value = '0';
                        _('_btn_check_solicitudrecibida').classList.remove('btn-success');
                        _('_span_check_solicitudrecibida').classList.remove('fa-check');
                        _('_btn_check_solicitudrecibida').classList.add('btn-danger');
                        _('_span_check_solicitudrecibida').classList.add('fa-remove');
                        swal({
                            text: 'El documento no corresponde con la solicitud seleccionada',
                            type: 'warning',
                            title: ''
                        }, function (result) {
                            if (result) {
                                _('txtbarcode').value = '';
                            }
                        });
                    } else {
                        _('hf_chk_solicitudrecibida').value = '1';
                        _('_btn_check_solicitudrecibida').classList.remove('btn-danger');
                        _('_span_check_solicitudrecibida').classList.remove('fa-remove');
                        _('_btn_check_solicitudrecibida').classList.add('btn-success');
                        _('_span_check_solicitudrecibida').classList.add('fa-check');
                    }
                    
                }
                //,
                //onError: function (string, qty) {
                //    console.log('Error', string);
                //}
            });
        }

        var err = (__err) => {
            console.log('err', __err);
        }

        function fn_aprobar() {
            let txthide_chksolicitudrecibir = _('hf_chk_solicitudrecibida');
            if (_('hf_esnecesario_recibirsolicitud').value === 'si') {
                if (txthide_chksolicitudrecibir.value === '0' || txthide_chksolicitudrecibir.value === '') {
                    swal({
                        title: "Está seguro de aprobar sin recibir la solicitud?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Si",
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            aceptar_ok_aprobarsolicitud();
                            ////swal("Deleted!", "Your imaginary file has been deleted.", "success");
                            //swal({
                            //    title: 'Message',
                            //    text: 'DEMO',
                            //    type: 'info'
                            //});
                        }
                    });
                } else {
                    aceptar_ok_aprobarsolicitud();
                }
            } else {
                aceptar_ok_aprobarsolicitud();
            }
        }

        function aceptar_ok_aprobarsolicitud() {
            let parametro = {
                estado: appSolicitudAtxAprobacion.ovariables.estadoenviar,
                idsolicitud: appSolicitudAtxAprobacion.ovariables.idsolicitud,
                estadobotonbool: appSolicitudAtxAprobacion.ovariables.estadobotonbool,
                idanalisistextilsolicitud: appSolicitudAtxAprobacion.ovariables.idanalisistextilsolicitud,
                comentario: _('_txta_comentario_aprobarrechazar_solicitudatx').value,
                idservicio: ovariables.idservicio,
                idcolgadorsolicitud: ovariables.idcolgadorsolicitud
            }, frm = new FormData();

            if (_('hf_esnecesario_recibirsolicitud').value === 'si') {
                parametro['solicitudrecibida'] = _('hf_chk_solicitudrecibida').value;
            } else {
                parametro['solicitudrecibida'] = '';
            }

            frm.append('par', JSON.stringify(parametro));

            _Post('DesarrolloTextil/Solicitud/Save_AprobarRechazarSolicitudAtx', frm)
                .then((respuesta) => {
                    let rpta = JSON.parse(respuesta);
                    swal({
                        title: '',
                        text: rpta.mensaje,
                        type: rpta.estado
                    });
                    $('#modal__AprobarRechazarSolicitudAtx').modal('hide');
                    appSolicitudAtx.return_bandeja(appSolicitudAtxAprobacion.ovariables.estadoenviar, appSolicitudAtxAprobacion.ovariables.idsolicitud);
                }, (p) => { appSolicitudAtxAprobacion.err() });
        }

        function fn_rechazar() {
            let comentario = _('_txta_comentario_aprobarrechazar_solicitudatx').value, cbo = _('_cbomotivorechazo'), idmotivorechazo = cbo.value,
                motivorechazo = cbo.options[cbo.selectedIndex].text,
            parametro = {
                estado: appSolicitudAtxAprobacion.ovariables.estadoenviar,
                idsolicitud: appSolicitudAtxAprobacion.ovariables.idsolicitud,
                estadobotonbool: appSolicitudAtxAprobacion.ovariables.estadobotonbool,
                idanalisistextilsolicitud: appSolicitudAtxAprobacion.ovariables.idanalisistextilsolicitud,
                comentario: motivorechazo,
                idmotivorechazo: idmotivorechazo,
                idservicio: ovariables.idservicio,
                idcolgadorsolicitud: ovariables.idcolgadorsolicitud
            }, frm = new FormData();

            // VALIDAR ANTES DE GRABAR
            //if (comentario === '') {
            //    _('div_grupo_comentario_aprobarrechazar_solicitudatx').classList.add('has-error');
            //    return false;
            //} else {
            //    _('div_grupo_comentario_aprobarrechazar_solicitudatx').classList.remove('has-error');
            //}

            if (idmotivorechazo === '') {
                _('div_grupo_motivo').classList.add('has-error');
                return false;
            } else {
                _('div_grupo_motivo').classList.remove('has-error');
            }

            frm.append('par', JSON.stringify(parametro));

            _Post('DesarrolloTextil/Solicitud/Save_AprobarRechazarSolicitudAtx', frm)
                .then((respuesta) => {
                    let rpta = JSON.parse(respuesta);
                    swal({
                        title: 'Message',
                        text: rpta.mensaje,
                        type: rpta.estado
                    }, function (result) {
                        if (result) {
                            if (rpta.id > 0) {                             
                                $('#modal__AprobarRechazarSolicitudAtx').modal('hide');
                                //ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', appSolicitudAtxAprobacion.ovariables.idsolicitud, 'divcontenedor_breadcrum');
                                appSolicitudAtx.return_bandeja(appSolicitudAtxAprobacion.ovariables.estadoenviar, appSolicitudAtxAprobacion.ovariables.idsolicitud);
                            }
                        }
                    });

                }, (p) => { appSolicitudAtxAprobacion.err() });
        }

        function res_ini(odata) {
            if (odata !== null) {
                _('hf_esnecesario_recibirsolicitud').value = odata;
            }

            if (ovariables.estadobotonbool === "1") {  // APROBAR
                _('_btn_aprobar_solicitudatx').classList.remove('hide');
                if (_('hf_esnecesario_recibirsolicitud').value === 'si') {
                    _('div_grupo_recibirsolicitud').classList.remove('hide');
                }
            } else if (ovariables.estadobotonbool === "0") { // RECHAZAR
                _('_btn_rechazar_solicitudatx').classList.remove('hide');
                _('div_grupo_recibirsolicitud').classList.add('hide');  
                _('div_grupo_comentario_aprobarrechazar_solicitudatx').classList.add('hide');
                _('div_grupo_motivo').classList.remove('hide');
                ovariables.motivorechazo = appSolicitudAtx.ovariables.motivorechazo;
                _('_cbomotivorechazo').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(ovariables.motivorechazo);
            }
        }

        function req_ini() {
            let param = { idsolicitud: ovariables.idsolicitud };
            _Get('DesarrolloTextil/Solicitud/GetData_ValidacionSiEsNecesario_RecibirSolicitud?par=' + JSON.stringify(param))
                .then((rpta) => { 
                    //let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    res_ini(rpta);
                });
           
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            err: err
        }
    }
    
)(document, 'panelEncabezado_aprobarrechazar_solicitudatx');

(
    function () {
        appSolicitudAtxAprobacion.load();
        appSolicitudAtxAprobacion.req_ini();
    }
)();
var appSendMailTechpack = (
    function (d, idpadre) {
        var ovariables = {
            nombrearchivooriginal: '',
            nombrearchivogenerado: ''
        }

        function load(){
            _('btnEnviarCorreo').addEventListener('click', fn_aceptarenviocorreo);
            
        }

        function fn_aceptarenviocorreo(e) {
            let req = _required({
                id: 'div_cuerpoprincipal_estilotechpack', clase: '_enty'
            });

            if (req) {
                let validacionCorrecta = validarFormatoCorreos_correo();
                if (validacionCorrecta == false) {
                    return false;
                }

                let frm = new FormData(), par = {};

                parametro = {
                    to_address_mail: _('txtTo').value, subject_mail: _('txtSubject').value, body_mail: _('txt_bodymail_estilotechpack').value,
                    copy_recipients_mail: _('txtCC').value, nombrearchivooriginal: ovariables.nombrearchivooriginal,
                    nombrearchivogenerado: ovariables.nombrearchivogenerado
                };

                frm.append('par', JSON.stringify(parametro));

                _Post('GestionProducto/Estilo/SendMailTechpack', frm, true)
                    .then((respuesta) => {
                        let rpta = JSON.parse(respuesta);
                        let tipo = rpta.estado ? 'success' : 'error';
                        swal({
                            title: "Message",
                            text: rpta.mensaje,
                            type: tipo
                        }, function (accion) {
                            //oculta mensaje
                            if (accion) {
                                $('#modal__EnviarCorreoTechpack').modal('hide');
                            }
                        });
                    }, (p) => { err(p) });
            }
            
        }

        var llenartabla = (nombrearchivooriginal) => {
            let html = '';
            html = `<tr>
                                        <td>${nombrearchivooriginal}</td>
                                    </tr>
                                `;
            let tbody = _('tbody_correo_estilotechpack');
            tbody.innerHTML = html;
        }

        var err = (__err) => {
            console.log('err', __err);
        }

        function req_ini() {
            let par = _('txtpar_correotechpack').value, idcliente = _par(par, 'idcliente'), idproveedor = _par(par, 'idproveedor'),
                idgrupocomercial = _par(par, 'idgrupocomercial'), idestilotechpack = _par(par, 'idestilotechpack'), nombrearchivooriginal = _par(par, 'nombrearchivooriginal'),
                nombrearchivogenerado = _par(par, 'nombrearchivogenerado'), 
                parametro = { idcliente: idcliente, idproveedor: idproveedor, idgrupocomercial: idgrupocomercial, idestilotechpack: idestilotechpack };

            ovariables.nombrearchivooriginal = nombrearchivooriginal;
            ovariables.nombrearchivogenerado = nombrearchivogenerado;

            _Get('GestionProducto/Estilo/GetDataCorreoTechpackIni?par=' + JSON.stringify(parametro))
                .then((respuesta) => {
                    let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;
                    if (rpta !== null) {
                        let odata_techpack = rpta[0].techpack !== '' ? CSVtoJSON(rpta[0].techpack) : null;
                        _('txtTo').value = rpta[0].correopara;
                        _('txtCC').value = rpta[0].correoCC;
                        _('txt_bodymail_estilotechpack').value = odata_techpack[0].comentario;

                        llenartabla(nombrearchivooriginal);
                    }
                }, (p) => {
                    err(p);
                });
        }

        function validarFormatoCorreos_correo() {
            let divprincipal = _('div_cuerpoprincipal_estilotechpack'), arrayCamposCorreo = _Array(divprincipal.getElementsByClassName('validarCorreo')), validacionFormatoCorreo = false,
                valorInput = "", arrayCorreos = [], mensajeErrorValidacionCorreo = '', pasolavalidacionformatocorreo = true,
                arraydiv_error = _Array(divprincipal.getElementsByClassName('error_correo'));

            arraydiv_error.forEach(x => {
                x.classList.add('hide');
            });

            let totalCamposCorreo = arrayCamposCorreo.length;
            for (let i = 0; i < totalCamposCorreo; i++) {
                arrayCorreos = [];
                valorInput = arrayCamposCorreo[i].value;
                let idCampo = arrayCamposCorreo[i].getAttribute('id');
                // SI LOS CORREOS ESTAN SEPARADOS POR COMA(,) REEMPLAZARLO POR PUNTO Y COMA(;)
                valorInput = valorInput.replace(",", ";");
                arrayCamposCorreo[i].value = valorInput;

                arrayCorreos = valorInput.split(';');
                let totalArray = arrayCorreos.length;
                if (totalArray > 0) {
                    for (let j = 0; j < totalArray; j++) {
                        valorInput = arrayCorreos[j].trim();
                        validacionFormatoCorreo = _validateEmail(valorInput);  // ESTA FUNCION validateEmail ESTA EN UTIL.JS
                        if (validacionFormatoCorreo == false) {
                            let idspan = '_error_estilotechpack_' + idCampo;
                            _(idspan).classList.remove('hide');
                            mensajeErrorValidacionCorreo += "- Error in mail format in";
                            pasolavalidacionformatocorreo = false;
                            break;
                        }
                    }
                }
            }
            return pasolavalidacionformatocorreo;
        }

        return {
            load: load,
            req_ini: req_ini
            
        }
    }
)();

(
    function init(){
        appSendMailTechpack.load();
        appSendMailTechpack.req_ini();
        _rules({ id: 'div_cuerpoprincipal_estilotechpack', clase: '_enty' });
    }
)();
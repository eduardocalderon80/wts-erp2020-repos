var appcambiarestadosolicitud = (
    function (d, idpadre) {
        var ovariables = {}

        function load() {
            _('_btnaprobar_cambiarestado').addEventListener('click', fn_aprobar);
            _('_btnbuscarsolicitud').addEventListener('click', fn_getvalidarsolicitud);
            _('_txtnumerosolicitud').addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    fn_getvalidarsolicitud();
                }
            });
            _('_txtnumerosolicitud').addEventListener('blur', fn_getvalidarsolicitud);

            $('.i-checks._group_busqueda').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget;

                if (e.currentTarget.getAttribute("data-valor") === "0") {
                    _("lblbusqueda").innerHTML = "N° Solicitud";
                    _("divsolicitud").classList.remove('hide');  //style.display = "block";
                    _("divatx").classList.add('hide');  //style.display = "none";
                    _("_txtnumerosolicitud").value = "0";
                    _("_txtestadonumerosolicitud").value = "";
                } else {
                    _("lblbusqueda").innerHTML = "Código ATX";
                    _("divsolicitud").classList.add('hide');  //style.display = "none";
                    _("divatx").classList.remove('hide');  //style.display = "block";
                    _("_txtnumerosolicitud").value = "0";
                    _("_txtestadonumerosolicitud").value = "";
                }
                });

            $('#chk_solicitud').prop('checked', true).iCheck('update');
        }

        function fn_getvalidarsolicitud() {           
            let idsolicitud = _('_txtnumerosolicitud').value, anio = _('_txtanio').value, contador = _('_txtcontador').value, par = { idsolicitud: idsolicitud, anio: anio, contador: contador };
            if (idsolicitud !== "" || anio !== "") {
                _Get('DesarrolloTextil/Solicitud/getsolicitudcambiarestado?par=' + JSON.stringify(par))
               .then((data) => {
                   let rpta = data !== '' ? JSON.parse(data)[0] : null;
                   if (rpta.solicitud !== "") {
                       let jsonsol = CSVtoJSON(rpta.solicitud)
                       _('_txtnumerosolicitud').value = jsonsol[0].idsolicitud
                       _('_txtestadonumerosolicitud').value = jsonsol[0].nombreestado
                       _('_cbostatus').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta.estado);
                   } else {
                       swal({
                           type: 'error',
                           title: 'Oops...',
                           text: 'El número de solicitud no existe o está eliminado!!'
                       });
                       _('_txtnumerosolicitud').value = "";
                       _('_txtestadonumerosolicitud').value = "";
                       _('_cbostatus').innerHTML = "";
                   }
               }, (p) => { err(p) });
            }                
        }

        function fn_aprobar() {
            let idsolicitud = _('_txtnumerosolicitud').value, idestado = _('_cbostatus').value, comentario = _('_txtcomentario').value,
                frm = new FormData(), req = _required({ clase: '_enty', id: 'panelencabezado_cambiarestado' }), par = { idsolicitud: idsolicitud, idestado: idestado, comentario: comentario };

            if (req) {
                frm.append('par', JSON.stringify(par));
                _Post('DesarrolloTextil/Solicitud/AceptarCambiarEstado', frm)
                    .then((respuesta) => {
                        let rpta = JSON.parse(respuesta);
                        swal({
                            title: 'Message',
                            text: rpta.mensaje,
                            type: rpta.estado
                        }, function (result) {
                            if (result) {
                                if (rpta.id > 0) {
                                    $('#modal__CambiarEstado').modal('hide');
                                    ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', idsolicitud, 'divcontenedor_breadcrum');
                                }
                            }
                        });
                    }, (p) => { err(p) })
            }             
        }

        var err = (__err) => {
            console.log('err', __err);
        }
        function req_ini() {

        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            err: err
        }
    }
)(document, 'panelencabezado_cambiarestado');

(
    function () {
        appcambiarestadosolicitud.load();
        appcambiarestadosolicitud.req_ini();
        _rules({ clase: '_enty', id: 'panelencabezado_cambiarestado' });
    }
)();
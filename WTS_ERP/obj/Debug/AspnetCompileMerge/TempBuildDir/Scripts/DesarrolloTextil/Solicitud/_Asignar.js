var appAsignarOperador = (
    function (d, idpadre) {
        var ovariables = {
            idsolicitud_asignar: '',
            idanalisistextilsolicitud_asignar: '',
            estadonuevo: '',
            idservicio: ''
        }

        function load() {

            let par = _('txtpar_asignar').value;
            if (!_isEmpty(par)) {
                ovariables.idsolicitud_asignar = _par(par, 'idsolicitud').trim();
                ovariables.idanalisistextilsolicitud_asignar = _par(par, 'idanalisistextilsolicitud').trim();
                ovariables.estadonuevo = _par(par, 'estadonuevo');
                ovariables.idservicio = _par(par, 'idservicio');
            }

            _('_btnAceptar_Asignar').addEventListener('click', AceptarAsignar);
        }
        function req_ini() {
            let par = { IdPerfil: 3 }, urlaccion = 'DesarrolloTextil/Solicitud/ObtenerAnalista?par=' + JSON.stringify(par);
            Get(urlaccion, LlenarTablaAnalista);
        }
        function LlenarTablaAnalista(rpta) {
            let data = rpta !== '' ? CSVtoJSON(rpta) : null;
            let tbl = _('tblBodyAnalista'), html = '';
            tbl.innerHTML = '';
            if (data != null && data.length > 0) {
                let totalfilas = data.length;
                for (let i = 0; i < totalfilas; i++) {
                    html += `<tr data-par='idanalista:${data[i].IdAnalista}'>
                                <td class ='text-center'>
                                    <div class ="radio i-checks rbAnalista"> <input type="radio" value=${data[i].IdAnalista} name="rbAnalista"> <i></i></div>
                                </td>
                                <td>${data[i].Analista}</td>
                                <td class="text-right">${data[i].NroPendiente}</td>
                            </tr>`;
                }
                tbl.innerHTML = html;
            }
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        }

        function AceptarAsignar() {
            let value = 0, par = {}, urlaccion = 'DesarrolloTextil/Solicitud/AsignarAnalista', form = new FormData();

            if (ValidarAsignar()) {
                value = getanalistaseleccionado(); //$("input[name=rbAnalista]:checked").val();

                if (value > 0) {
                    par = {
                        idanalista: value, IdSolicitud: ovariables.idsolicitud_asignar, IdAnalisisTextilSolicitud: ovariables.idanalisistextilsolicitud_asignar,
                        idservicio: ovariables.idservicio
                    }
                    form.append('par', JSON.stringify(par));

                    Post(urlaccion, form, function (rpta) {
                        if (rpta > 0) {
                            $('#modal__Asignar').modal('hide');
                            swal({
                                type: 'success',
                                title: 'Good Job!!',
                                text: ''
                            }, function (result) {
                                if (result) {
                                    //ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', ovariables.idsolicitud_asignar, 'divcontenedor_breadcrum');
                                    appSolicitudAtx.return_bandeja(ovariables.estadonuevo, ovariables.idsolicitud_asignar);
                                }
                            });
                        } else {
                            swal({
                                type: 'error',
                                title: 'Oops...',
                                text: 'Error!!'
                            });
                        }
                    });
                }
            }
        }

        function getanalistaseleccionado() {
            let div = _('div_asignaranalista'), div_checked = div.getElementsByClassName("iradio_square-green checked")[0],
                fila = div_checked.parentNode.parentNode.parentNode, idanalista = null, par = fila.getAttribute('data-par');
            idanalista = _par(par, 'idanalista');
            return idanalista;
        }

        function ValidarAsignar() {
            let rbAnalista = $("input[name=rbAnalista]:checked").val(), bValida = true
            if (rbAnalista == undefined) {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Selecciona a un analista!!'
                });
                bValida = false
            }
            return bValida
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'div_asignaroperador');


(
    function init() {
        appAsignarOperador.load();
        appAsignarOperador.req_ini();
    }
)();
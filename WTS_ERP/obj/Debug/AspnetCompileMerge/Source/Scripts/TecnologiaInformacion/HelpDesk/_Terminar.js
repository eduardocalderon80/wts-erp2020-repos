var app_Ticket_Terminar = (
    function (d, idpadre) {

        var ovariables_info = {
            arr_tipovalorizacion: []
        }

        var ovariables = {
            idticket: 0
            , accion: ''
            , idsolicitante: 0
            , idtipovalorizacion: 0
        }

        function load() {
            let par = _('txtpar_ticket_terminar').value;
            if (!_isEmpty(par)) {
                ovariables.idticket = _par(par, 'idticket');
                ovariables.accion = _par(par, 'accion');
                ovariables.idsolicitante = _par(par, 'idsolicitante');
            }

            _('btn_guardar_terminar').addEventListener('click', req_guardar);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { accion: 'terminar' };
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Get_Usuario_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.arr_tipovalorizacion = rpta[0].tipovalorizacion != '' ? JSON.parse(rpta[0].tipovalorizacion) : '';
                    }
                    fn_load_tipovalorizacion();
                }, (p) => { err(p); });
        }

        function fn_load_tipovalorizacion() {
            let arr_tipovalorizacion = ovariables_info.arr_tipovalorizacion
            , html = '';

            if (arr_tipovalorizacion.length > 0) {
                arr_tipovalorizacion.forEach(x=> {
                    html+=
                        `<tr data-par='idtipovalorizacion:${x.idtipovalorizacion}'>
                             <td class ='text-left'>
                                <div id="idlink" class="i-checks _radbtn">
                                    <div class="iradio_square-green" style="position: relative;">
                                        <label>
                                            <div class="iradio_square-green" style="position: relative;"><input id="link" value="2" name="radiobutton" type="radio" class="i-checks _radbtn" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>
                                            <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;"></ins>
                                        </label>                               
                                    </div>
                                    <label class ="_rad">${x.tipovalorizacion}</label>
                                </div>                                
                            </td>
                        </tr>`;
                    //html +=
                    //    `<tr data-par='idtipovalorizacion:${x.idtipovalorizacion}'>
                    //        <td class ='text-left'>
                    //            <div id='${x.idtipovalorizacion}' class ='iradio_square-green _cls_tipovalorizacion' style='position: relative;' >
                    //                <label>
                    //                    <input id='square-radio-${x.idtipovalorizacion}' name="square-radio" type='radio' style='position: absolute; opacity: 0;'>
                    //                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                    //                </label>
                    //            </div>
                    //            <label for="square-radio-${x.idtipovalorizacion}" class ="">${x.tipovalorizacion}</label>
                    //            </label>
                    //        </td>
                    //    </tr>`;
                });
            }           

            _('tbl_tipo_valorizacion').tBodies[0].innerHTML = html;

            handler_table();
        }

        function handler_table() {
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget;
                let fila = dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let g = fila.getAttribute('data-par');
                let x = _par(g, 'idtipovalorizacion');
                let idtipovalorizacion = _parseInt(x);
                let isChecked = dom.checked;
                ovariables.idtipovalorizacion = idtipovalorizacion;
            });
        }

        function req_guardar() {

            if (ovariables.idtipovalorizacion != 0) {
                swal({
                    title: "Esta seguro de guardar los datos ingresados?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () { fn_guardar(); });
            } else { swal({ title: "Alert", text: 'Debe seleccionar una calificación', type: "warning" }); return; }
        }

        function fn_guardar() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Update_Estado_Motivo';
            let oticket = _getParameter({ id: 'pnl_ticket_terminar', clase: '_enty' });
            form = new FormData();
            oticket['idticket'] = ovariables.idticket;
            oticket['accion'] = ovariables.accion;
            oticket['idsolicitante'] = ovariables.idsolicitante;
            oticket['idtipovalorizacion'] = ovariables.idtipovalorizacion;
            form.append('par', JSON.stringify(oticket));
            Post(urlaccion, form, res_guardar);
        }

        function res_guardar(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_retornar();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_retornar() {
            $('#modal_Terminar').modal('hide');
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Editar', urljs = urlaccion;
            _Go_Url(urlaccion, urljs, 'idticket:' + ovariables.idticket);
        }

        return {
            load: load
          , req_ini: req_ini
        }

    }
)(document, 'pnl_ticket_detener');

(function ini() {
    app_Ticket_Terminar.load();
    app_Ticket_Terminar.req_ini();
})();
var app_Ticket_Rechazar = (
    function (d, idpadre) {

        var ovariables = {
            idticket: 0
            , accion: ''
            , idsolicitante: 0
            , idtipovalorizacion: 0
        }

        function load() {
            let par = _('txtpar_ticket_rechazar').value;
            if (!_isEmpty(par)) {
                ovariables.idticket = _par(par, 'idticket');
                ovariables.accion = _par(par, 'accion');
                ovariables.idsolicitante = _par(par, 'idsolicitante');
            }

            _('btn_guardar_rechazar').addEventListener('click', req_guardar);
        }

        function required_item_class(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, //att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = x.parentNode.parentNode.parentNode;
                //if (att) {
                if ((valor == '') || (valor == '0' && cls_select2 == true))
                { padre.classList.add('has-error'); resultado = false; }
                else { padre.classList.remove('has-error'); }
                //}
            });
            return resultado;
        }

        function req_guardar() {
            let requerido = required_item_class({ id: 'pnl_ticket_rechazar', clase: '_enty' });

            if (requerido) {
                swal({
                    title: "Esta seguro de guardar los datos ingresados?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    fn_guardar();
                });
            }
            else {
                swal({ title: "Alert", text: 'Debe ingresar un motivo', type: "warning" }); return;
            }
        }

        function fn_guardar() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Update_Estado_Motivo';
            let oticket = _getParameter({ id: 'pnl_ticket_rechazar', clase: '_enty' });
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
            $('#modal_Rechazar').modal('hide');
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Editar', urljs = urlaccion;
            _Go_Url(urlaccion, urljs, 'idticket:' + ovariables.idticket);
        }

        return {
            load: load
        }

    }
)(document, 'pnl_ticket_rechazar');

(function ini() {
    app_Ticket_Rechazar.load();
})();
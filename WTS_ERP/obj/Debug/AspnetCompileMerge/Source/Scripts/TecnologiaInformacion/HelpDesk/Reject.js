var ovariables = {
    arrtipovalorizacion: '',
    idtipovalorizacion: '',
}

function load() {
    fn_load_update();

}

function fn_load_update() {
    let html = `
          <div id='formReject' class ='ibox white-bg'>
                <div class ='ibox-title'>
                    <div class ='form-horizontal'>
                         <div id ="divBotones" class ="text-right">
                            <button type="button" class ="btn btn-info" id="btnTerminar" onclick="req_request()">
                                <span class ="fa fa-save"></span>
                                Guardar
                            </button>
                            <button type="button" class ="btn btn-default" id="btnReturn" onclick="fn_close_modal()">
                                <span class ="fa fa-reply-all"></span>
                                Retornar
                            </button>
                        </div>
                     </div>
                </div>
                <div class ='ibox-content'>
                    <div class ='form-horizontal'>
                        <div class ='form-group'>
                            <div class ='col-sm-12'>
                                <label class ='control-label'>Coloque un motivo por el cual va a rechazar esta solicitud: </label>
                            </div>
                         </div>
                    </div>
                    <div class ='form-horizontal'>
                        <div class ='form-group'>
                            <div class ='col-sm-12'>
                                <textarea id='txtComentario' class ='form-control col-sm-12 _enty' name="Descripcion" rows="6" style="resize:none" placeholder="Ingresar motivo de rechazo" data-id="Comentario" data-min="1" data-max="200" maxlength="200" data-required='true'></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    _('formReject').innerHTML = html;
}

function req_request() {

    let req = _required({ id: 'formReject', clase: '_enty' });
    if (req) {
        swal({
            title: "Esta seguro de Rechazar esta solicitud?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_cancel();
        });
    } else {
        swal({ title: "Alert", text: "Debe Ingresar un motivo de Rechazo", type: "warning" });
    }
}

function req_cancel() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Update';
    let IdResponsable = 0;
    let IdNivelAtencion = 0;

    let comentario = _('txtComentario').value;
    let idsolicitud = _("hf_IdSolicitud").value;
    let idpersonal = _("hf_IdPersonal").value;

    let par = JSON.stringify({ IdSolicitud: parseInt(idsolicitud), IdPersonal: idpersonal, IdAccion: 8 });
    let oRegister = _getParameter({ id: 'tab-registro', clase: '_enty' });
    let oTic = _getParameter({ id: 'tab-tic', clase: '_enty' });
    oTic['IdNivelAtencion'] = IdNivelAtencion;
    oTic['IdResponsable'] = IdResponsable;
    oTic['IdTipoValorizacion'] = ovariables.idtipovalorizacion;
    oTic['Comentario'] = comentario;
    form = new FormData();
    form.append('par', par);
    form.append('pardetail', JSON.stringify(oRegister));
    form.append('parsubdetail', JSON.stringify(oTic));
    Post(urlaccion, form, res_cancel);
}

function res_cancel(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Buen Trabajo!", text: "Usted ha Rechazado esta solicitud correctamente", type: "success" });
            fn_close_modal();
            fn_return();
        }
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
    }
}

function fn_close_modal() {
    $('#modal_reject').modal('hide');
}

function fn_return() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Index';
    _Go_Url(urlaccion, urlaccion);
}

(function ini() {
    load();
})();
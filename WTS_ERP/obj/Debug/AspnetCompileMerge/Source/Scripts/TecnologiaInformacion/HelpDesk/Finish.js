var ovariables = {
    arrtipovalorizacion: '',
    idtipovalorizacion:'',
}

function load() {
   
}
function req_request() {
    
    //let req = _required({ id: 'formTerminar', clase: '_enty' });
    if (ovariables.idtipovalorizacion == '') {
        swal({ title: "Alert", text: "Debe selecionar una calificación", type: "warning" });
    }
    else {
        swal({
            title: "Esta seguro de terminar esta solicitud?",
            text: "",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {
            req_finish();
        });

    }
}

function req_finish() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Update';
    let IdResponsable = 0;
    let IdNivelAtencion = 0;

    let comentario = _('txtComentario').value;
    let idsolicitud = _("hf_IdSolicitud").value;
    let idpersonal = _("hf_IdPersonal").value;
    
    let par = JSON.stringify({ IdSolicitud: parseInt(idsolicitud), IdPersonal: idpersonal, IdAccion: 7 });
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
    Post(urlaccion, form, res_finish);
}

function res_finish(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') { swal({ title: "Buen Trabajo!", text: "Usted ha terminado esta solicitud", type: "success" }) };
        if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
        fn_close_modal();
        fn_return();
    }
}

function fn_close_modal() {
    $('#modal_finish').modal('hide');
}

function fn_return() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Inicio';
    _Go_Url(urlaccion, urlaccion);
}

function fn_load_update() {

    let html = `
            <div id='formTerminar' class ="ibox white-bg">
                <div class ="ibox-title">
                    <div class ="form-horizontal">
                         <div id ="divBotones" class ="text-right">
                            <button type="button" class ="btn btn-info" id="btnTerminar" onclick="req_request()">
                                <span class ="fa fa-save"></span>
                                Guardar
                            </button>
                            <button type="button" class ="btn btn-default" id="btnReturn" onclick="fn_close_modal()">
                            <span class ="fa fa-reply-all"></span>
                            Return
                            </button>
                        </div>
                     </div>
                 </div>
            
           
                <div class ="ibox-content">
                     <div class ="form-horizontal ">
                        <div class ="form-group">
                            <div class ="col-sm-12">
                                <label class ="control-label text-navy">Como calificaría nuestra atención brindada:</label>
                            </div>
                         </div>
                     </div>
                     <div class ="form-horizontal">
                        <div class ="form-group">
                            <div class ="col-sm-12">
                                 <div class ="table-responsive">
                                    <table class ="footable table table-stripped table-bordered" data-page-size="15" data-filter=#filterAnalyst id="contentTableValorizacion">
                                        <thead>
                                        </thead>
                                        <tbody>
                        `;


    ovariables.arrtipovalorizacion.forEach(x=>{

        html += `<tr data-par='IdTipoValorizacion:${x.IdTipoValorizacion}'>
                 <td class ='text-left'>
                    <div id='${x.IdTipoValorizacion}' class ='iradio_square-green _clsDivAnalyst' style='position: relative;' >
                        <label>
                        <input id='square-radio-${x.IdTipoValorizacion}' name="square-radio" type='radio' style='position: absolute; opacity: 0;'>
                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>                       
                        </label>                        
                    </div>
                    <label for="square-radio-${x.IdTipoValorizacion}" class ="">${x.TipoValorizacion}</label>
                </label>
                 </td>
                 </tr>
                `;
    });
    
        html += `                       </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class ="form-horizontal">
                        <div class ="form-group">
                            <div class ="col-sm-12">
                                <label class ="control-label">Brindenos sus comentarios para poder mejorar nuestra atención: </label>
                            </div>
                         </div>
                     </div>
                    <div class ="form-horizontal">                        
                        <div class ="form-group">
                            <div class ="col-sm-12">                            
                                <textarea id="txtComentario" class ="form-control col-sm-12 _enty" name="Descripcion" rows="6" style="resize:none" placeholder="Ingresar comentarios" data-id="Comentario" data-min="1" data-max="200" maxlength="200"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        `;
     
    _('formFinish').innerHTML = html;
    
    $('.iradio_square-green._clsDivAnalyst').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let dom = e.currentTarget;
        let fila = dom.parentNode.parentNode.parentNode.parentNode.parentNode;
        let g = fila.getAttribute('data-par');
        let x = _par(g, 'IdTipoValorizacion');
        let idPerfil = _parseInt(x);
        let isChecked = dom.checked;
        ovariables.idtipovalorizacion = idPerfil;
    });
    $('#4').iCheck('check');
}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Master';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[9] != '')) { ovariables.arrtipovalorizacion = JSON.parse(orpta[9]); }
        fn_load_update();
    }
}


(function ini() {
    load();
    req_ini();
})();
var ovariables = {
    idgrupocomercial: ''
}
function load() {
    _('_btn_aceptarnewreq').addEventListener('click', aceptarnewreq_modal);
    let par = _('txtpar').value;    
    if (!_isEmpty(par)) {        
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');        
    }
    let ComentarioEstado = $('#txta_comentario_estado').val();
    $('#_txtCommentNew').val(ComentarioEstado);
}

function Mostrar(e) {
    let Id = e.value;
    if (Id == 0) {
        $('#divLblRBCopy').removeClass('hide');
        $('#divLblRBNext').addClass('hide');      
        $('#_txtCommentNew').val('');
    } else if (Id == 1) {
        $('#divLblRBCopy').removeClass('hide');
        $('#divLblRBNext').addClass('hide');
        let ComentarioEstado = $('#txta_comentario_estado').val();
        $('#_txtCommentNew').val(ComentarioEstado);
    }
}
 
function getDataByCliente() {
    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(),
           parametro = { idcliente: idcliente, perfil: perfil },
           urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_datacliente_modal);
}

function getdata() {
    parametro = { xd: 1, idgrupocomercial: ovariables.idgrupocomercial };
    urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosNew?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_ini);
}

function res_datacliente_modal(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    if (rpta != null) {
        _('cboTipoMuestranewreq').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].tipomuestraxcliente);        
    }
}
 
function res_ini(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data);
    if (rpta != null) {
        if (dataparse != null) {           
            _('cboVersionnewreq').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].version);
            _('cboTeam_newreq').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].team);

            let idgrupocomercial_new = $('#cboTeam').val();
            if (idgrupocomercial_new != "") {
                _('cboTeam_newreq').value = idgrupocomercial_new;
            }
        }      
    }
}

function validar() {
    let idtipomuestra = _('cboTipoMuestranewreq').value, version = _('cboVersionnewreq').value, idgrupopersonal = _('cboTeam_newreq').value , pasalavalidacion = true    
    if (idtipomuestra == 0) {
        $('#_div_TipoMuestra').addClass('has-error');
        $('#_span_error_TipoMuestranewreq').removeClass('hide');
        pasalavalidacion = false;
    }
    if (version == 0) {
        $('#_div_Version').addClass('has-error');
        $('#_span_error_Versionnewreq').removeClass('hide');
        pasalavalidacion = false;
    }
    if (idgrupopersonal == 0) {
        $('#_div_team_newreq').addClass('has-error');
        $('#_span_error_team_newreq').removeClass('hide');
        pasalavalidacion = false;
    }
    return pasalavalidacion;
}
  
function GetValueRB() {
    let opt = document.getElementsByName('option'), opt_val;
    for (var i = 0; i < opt.length; i++) {
        if (opt[i].checked) {
            opt_val = opt[i].value;
        }
    }
    return opt_val;
}
 
function aceptarnewreq_modal() {   
    if (validar()) {
        let idtipomuestraxcliente = _('cboTipoMuestranewreq').value, version = _('cboVersionnewreq').value, form = new FormData(); idrequerimiento = _('hf_idrequerimiento').value, comentarioEstado = $('#_txtCommentNew').val(),
        rb = GetValueRB(), idgrupopersonal = ovariables.idgrupocomercial, idgrupocomercial = _('cboTeam_newreq').value ;
        let urlaccion = 'GestionProducto/Requerimiento/NuevoReq',
            parametro = { idrequerimiento: idrequerimiento, idtipomuestraxcliente: idtipomuestraxcliente, version: version, comentarioEstado: comentarioEstado, rb: rb, idgrupopersonal: idgrupopersonal, idgrupocomercial: idgrupocomercial };
        form.append('par', JSON.stringify(parametro));
        Post(urlaccion, form, function (rpta) {
            if (rpta != 0) {
                console.log(ovariables.idgrupocomercial)
                let urlaccion = 'GestionProducto/Requerimiento/New', idrequerimientonuevo = rpta;
                _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables.idgrupocomercial + ',idrequerimiento:' + idrequerimientonuevo);
                $('#modal_newreq').modal('hide');

                if (rb == 0) {
                    Mensaje = 'Copy Requirement'
                } else if (rb == 1) {
                    Mensaje = 'New Requirement'
                }

                _swal({ estado: 'success', mensaje: Mensaje });
            }
            else {
                _swal({ estado: 'error', mensaje: 'No se completó el nuevo requerimiento' });
            }
        });
    }         
}
 
function req_ini() {
    getDataByCliente()
    getdata()
}

(
    function ini() {
        load();
        req_ini();
    }
)();
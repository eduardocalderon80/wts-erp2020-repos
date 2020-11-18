var ovariables = {
    idgrupocomercial: ''
}
function load() {
    _('_btn_aceptarreq').addEventListener('click', aceptarReq_modal);

    let par = _('txtpar').value;
    
    if (!_isEmpty(par)) {        
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');        
    }
}
function getDataByCliente() {
    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(),
           parametro = { idcliente: idcliente, perfil: perfil, idgrupocomercial: ovariables.idgrupocomercial },
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
        _('cboTipoMuestra').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].tipomuestraxcliente);
        _('cboFabrica').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].proveedor);
    }
}

function res_ini(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data);
    if (rpta != null) {
        if (dataparse != null) {
            _('cboVersion').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].version);
            //_('cboFabrica').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].proveedor);
            _('cboTeam_newreq').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].team);
            if (ovariables.idgrupocomercial != '') {
                _('cboTeam_newreq').value = ovariables.idgrupocomercial;
            }
        }
    }
}

function validarCampos() {
    let idtipomuestra = _('cboTipoMuestra').value, version = _('cboVersion').value, idfabrica = _('cboFabrica').value, idgrupopersonal = _('cboTeam_newreq').value, pasalavalidacion = true
    
    if (idtipomuestra == 0) {
        $('#_div_TipoMuestra').addClass('has-error');
        $('#_span_error_TipoMuestra').removeClass('hide');
        pasalavalidacion = false;
    }
    if (version == 0) {
        $('#_div_Version').addClass('has-error');
        $('#_span_error_Version').removeClass('hide');
        pasalavalidacion = false;
    }
    if (idfabrica == 0) {
        $('#_div_Factory').addClass('has-error');
        $('#_span_error_Factory').removeClass('hide');
        pasalavalidacion = false;
    }
    if (idgrupopersonal == 0) {
        $('#_div_team_newreq').addClass('has-error');
        $('#_span_error_team_newreq').removeClass('hide');
        pasalavalidacion = false;
    }
    return pasalavalidacion;
}

function Validar() {
    let idcliente = _('cboCliente').value, idtipomuestraxcliente = _('cboTipoMuestra').value, submit = $('#cboVersion').val(), idestilo = $('#hf_idestilo').val(), obj = { idcliente: idcliente, idtipomuestraxcliente: idtipomuestraxcliente, submit: submit, idestilo: idestilo }, form = new FormData(),
        urlaccion = "GestionProducto/Requerimiento/Validar";

    form.append("par", JSON.stringify(obj));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            swal({
                title: "Are you sure to save?",
                text: "<strong>Tener en cuenta:</strong> Ya existe un requerimiento para este cliente, tipo de muestra y submit",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false
            }, function () {
                Guardar();
                return;
            });
        }
        else {
            Guardar();
        }
    });
}
  
function aceptarReq_modal() {  
    if (validarCampos()) {
        Validar();
    }         
}
 
function Guardar() {
    let idtipomuestraxcliente = _('cboTipoMuestra').value, version = _('cboVersion').value, idproveedor = _('cboFabrica').value, idcliente = _('cboCliente').value, idgrupopersonal = ovariables.idgrupocomercial,
        idestilo = _('hf_idestilo').value, idgrupocomercial = _('cboTeam_newreq').value ,       form = new FormData();
    let urlaccion = 'GestionProducto/Estilo/NuevoReq', parametro = { idestilo: idestilo, idtipomuestraxcliente: idtipomuestraxcliente, version: version, idproveedor: idproveedor, idcliente: idcliente, idgrupopersonal: idgrupopersonal, idgrupocomercial: idgrupocomercial };
    form.append('par', JSON.stringify(parametro));
    Post(urlaccion, form, function (rpta) {
        if (rpta != 0) {
            let urlaccion = 'GestionProducto/Requerimiento/New', idrequerimiento = rpta;
            _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables.idgrupocomercial + ',idrequerimiento:' + idrequerimiento);
            $('#modal_newreq').modal('hide');
            _swal({ estado: 'success', mensaje: 'New requirement' });
        }
        else {
            _swal({ estado: 'error', mensaje: 'No se completó el nuevo requerimiento' });
        }
    });
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
var ovariables = {
    idgrupocomercial: '',
    flgVersion: 0
}
function load() {
 
    _('_btn_aceptarnewversion').addEventListener('click', aceptarnewversion_modal);
    $('#txtNewVersionCode').prop('disabled', 'disabled')

    let par = _('txtpar').value;

    if (!_isEmpty(par)) {
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
    }
}
 
function MostrarLeyenda(e) {
    let Id = e.value;
    if (Id == 0) {
        $('#divLblRBCS').removeClass('hide');
        $('#divLblRBNS').addClass('hide');
        $('#txtNewVersionCode').prop('disabled', '')

    } else if (Id == 1) {
        $('#divLblRBNS').removeClass('hide');
        $('#divLblRBCS').addClass('hide');
        $('#txtNewVersionCode').prop('disabled', 'disabled')
    }
}


function ValidarCodigo() {
    let idcliente = _('cboCliente').value, idclientetemporada = _('cboSeason').value, codigo = $('#txtNewVersionCode').val(), obj = { idcliente: idcliente, idclientetemporada: idclientetemporada, codigo: codigo }, form = new FormData(),
        urlaccion = "GestionProducto/Estilo/ValidarCodigo";

    form.append("par", JSON.stringify(obj));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            //Asigno el valor a variable global, para identificar que es nueva version del estilo
            ovariables.flgVersion = 1;

            let check = '<div class="form-group" style="color:red"><label> Si aceptas, este estilo será una versión del estilo original </label></div>',
              body = '<div class="row"><div class="form-group"><strong>Nota:</strong> El estilo ya existe para esta temporada</div>'+ check +'</div>';
            swal({
                title: "Are you sure to save?",
                text: body,
                html: true,
                input: "checkbox",
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
 

function validar() {
    let IdClienteTemporada = _('cboTemporadaversion').value, IdClienteDivision = _('cboDivisionversion').value, Callout = _('txtCalloutversion').value, NuevoCodigo = $('#txtNewVersionCode').val(), pasalavalidacion = true;
    
    if (IdClienteTemporada == 0) {
        $('#_div_Season').addClass('has-error');
        $('#_span_error_Seasonversion').removeClass('hide');
        pasalavalidacion = false;
    }
    if (IdClienteDivision == 0) {
        $('#_div_Division').addClass('has-error');
        $('#_span_error_Divisionversion').removeClass('hide');
        pasalavalidacion = false;
    }
    
    let rb = GetValueRB();
    if (rb == 0) {
      if   (NuevoCodigo.trim().length == 0){
          $('#_div_NewVersionCopy').addClass('has-error');
          $('#_span_error_NewVersionCode').removeClass('hide');
            pasalavalidacion = false;
        }       
    }
    
    //if (Callout.trim().length == 0) {
    //    $('#_div_Calloutversion').addClass('has-error');
    //    $('#_span_error_Calloutversion').removeClass('hide');
    //    pasalavalidacion = false;
    //}

    return pasalavalidacion;
}
  
function aceptarnewversion_modal() {    
    if (validar()) {
        let rb = GetValueRB();
        if (rb == 0) {
            ValidarCodigo();
        } else if (rb == 1) {
            Guardar();
        }        
    }         
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

function Guardar() {    
    let IdClienteTemporada = _('cboTemporadaversion').value, IdClienteDivision = _('cboDivisionversion').value, Callout = _('txtCalloutversion').value, form = new FormData(), idestilo = _('hf_idestilo').value, Codigo = _('txtNewVersionCode').value,rb = GetValueRB();
    let urlaccion = 'GestionProducto/Estilo/NewVersion', parametro = { idestilo: idestilo, IdClienteTemporada: IdClienteTemporada, IdClienteDivision: IdClienteDivision, Callout: Callout, Codigo: Codigo, rb: rb,flg: ovariables.flgVersion };

    form.append('par', JSON.stringify(parametro));
        Post(urlaccion, form, function (rpta) {
            if (rpta != 0) {
            let urlaccion = 'GestionProducto/Estilo/New', idestilonuevo = rpta, Mensaje = '';
            _Go_Url(urlaccion, urlaccion, 'accion:edit,idestilo:' + idestilonuevo + ',idgrupocomercial:'+ ovariables.idgrupocomercial);
                $('#modal_newversion').modal('hide');
            
            if (rb == 0) {
                Mensaje = 'Copy Style'
            } else if (rb == 1) {
                Mensaje = 'New Version'
            }

            _swal({ estado: 'success', mensaje: Mensaje });
            }
            else {
            _swal({ estado: 'error', mensaje: 'Error' });
            }
        });
    }         

function ObtenerDatosCargaPorCliente(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        if (JSONdata[0].Temporada != null) {
            var Temporada = JSON.parse(JSONdata[0].Temporada);
            $("#cboTemporadaversion").empty();
            var htmlTemporada = "<option value='0'>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
            $("#cboTemporadaversion").append(htmlTemporada);
        }
        if (JSONdata[0].Division != null) {
            var Division = JSON.parse(JSONdata[0].Division);
            $("#cboDivisionversion").empty();
            var htmlDivision = "<option value='0'>Select One</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
            $("#cboDivisionversion").append(htmlDivision);
        }
    }
}
 
function req_ini() {
    //var frm = new FormData();
    //let par = { idcliente: _('cboCliente').value, idgrupocomercial: ovariables.idgrupocomercial }
    //frm.append("par", JSON.stringify(par));
    //Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);    
    GetDatabyClient('');
}

function GetDatabyClient(event) {
    var frm = new FormData();
    let par = { idcliente: $("#cboCliente").val(), idgrupocomercial: ovariables.idgrupocomercial }
    //frm.append("par", JSON.stringify(par));
    //Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, ObtenerDatosCargaPorCliente);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
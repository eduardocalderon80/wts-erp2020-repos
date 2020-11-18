var ovariables = {
    idgrupocomercial: ''
}

$(document).ready(function () {
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');

    $("#cboFamilia").prop('disabled', true);
    $("#cboCliente").prop('disabled', true);
    $("#txtCode").prop('disabled', true);
    $("#btnSearch").prop('disabled', true);

    $("#btnNewStyle").click(function () {
        let urlaccion = 'GestionProducto/ProyectoTela/New',
            urljs = 'GestionProducto/ProyectoTela/New';
        _Go_Url(urlaccion, urljs, 'accion:new');
    });
 
    $("#btnSearch").click(function () {
        var Tipo = parseInt($("#cboTipo").val());
        var Familia = $("#cboFamilia").val();
        var Code = $("#txtCode").val();
        if (Tipo == 2 && (Familia == "" && Code.length == 0)) {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please select a Family or Code !!', estado: 'error' };
            _mensaje(objmensaje);
            return false;
        } 
        var par = Tipo + "," + $("#cboCliente").val() + "," + $("#txtCode").val() + "," + Familia + "," + $("#txtFabric").val();
        var frm = new FormData();
        frm.append("par", par);
        Post('GestionProducto/ProyectoTela/Buscar', frm, BuscarProyectoTela);
    });
     
    $("#cboTipo").change(function () {
        var valor = $(this).val();
        //if (valor != "") {
            if (valor == "1") {
                $("#cboFamilia").prop('disabled', true);
                $("#cboCliente").prop('disabled', false);
                $("#txtCode").prop('disabled', false);
            } else {
                $("#cboFamilia").prop('disabled', false);
                $("#cboCliente").prop('disabled', true);
                $("#txtCode").prop('disabled', false);
            }
            $("#btnSearch").prop('disabled', false);
            $("#divContentTBL").empty();
    //    } else {
    //        $("#cboFamilia").prop('disabled', true);
    //        $("#cboCliente").prop('disabled', true);
    //        $("#txtCode").prop('disabled', true);
    //        $("#btnSearch").prop('disabled', true);
    //        $("#divContentTBL").empty();
    //    }
    });

    $("#cboTipo").trigger("change")
    Get('GestionProducto/ProyectoTela/ObtenerDatosCarga', ObtenerDatosCarga);     
});
 
function BuscarProyectoTela(data) {
    $("#tblTela").remove();
    if (data != null) {
        var Tipo = $("#cboTipo").val();
        $("#hfTipo").val(Tipo);
        if (Tipo == "1") {

            var ProyectoTela = JSON.parse(data);
            var nProyectoTela = ProyectoTela.length;
            if (nProyectoTela > 0) {
                var html = "";

                html += "<table id='tblTela' class='table table-bordered table-hover'><thead><tr><th>Code</th><th>Client</th><th>Supplier</th><th>Season</th><th>Fabric</th><th></th></tr></thead><tbody>";
                for (var i = 0; i < nProyectoTela; i++) {
                    html += "<tr>";
                   // html += "<td>" + ProyectoTela[i].IdProyectoTela + "</td>";
                    html += "<td>" + ProyectoTela[i].Codigo + "</td>";
                    html += "<td>" + ProyectoTela[i].NombreCliente + "</td>";
                    html += "<td>" + ProyectoTela[i].NombreProveedor + "</td>";
                    html += "<td>" + ProyectoTela[i].CodigoClienteTemporada + "</td>";
                    html += "<td>" + ProyectoTela[i].Construction + " " + ProyectoTela[i].Yarn + " " + ProyectoTela[i].Content + " " + ProyectoTela[i].Weight + " " + ProyectoTela[i].DyeingProcess + "</td>";
                    html += "<td class='text-center'><span class='btn-group  btn-group-md pull-center'><button title='Edit' type='button' onclick='Editar(" + ProyectoTela[i].IdProyectoTela + ");' class='btn btn-default'><span class='fa fa-edit'></span></button><button title='Delete' type='button' class='btn btn-default hide'><span class='fa fa-remove'></span><button title='Copy' onclick='Copiar(" + ProyectoTela[i].IdProyectoTela + ");'  type='button' class='btn btn-default'><span class='fa fa-folder-open'></span></button></span></button></span></td>";
                    html += "</tr>";
                }
                html += "</tbody></table>";
                $("#divContentTBL").empty();
                $("#divContentTBL").append(html);

                $('#tblProyectoTela').DataTable({
                    paging: true,
                    "scrollY": 500
                });
            }
        } else {
            var Tela = JSON.parse(data);
            var nTela = Tela.length;
            if (nTela > 0) {
                var html = "";

                html += "<table id='tblTela' class='table table-bordered table-hover'><thead><tr><th>Id</th><th>Code</th><th>Family</th><th>Description</th><th></th></tr></thead><tbody>";
                for (var i = 0; i < nTela; i++) {
                    html += "<tr>";
                    html += "<td>" + Tela[i].IdFichaTecnica + "</td>";
                    html += "<td>" + Tela[i].CodigoTela + "</td>";
                    html += "<td>" + Tela[i].NombreFamilia + "</td>";
                    html += "<td>" + Tela[i].NombreTela + "</td>";
                    html += "<td class='text-center'><span class='btn-group  btn-group-md pull-center'><button title='Edit' type='button' onclick='Editar(" + Tela[i].IdFichaTecnica + ");' class='btn btn-default hide'><span class='fa fa-edit'></span></button><button title='Delete' type='button' class='btn btn-default hide'><span class='fa fa-remove'><button title='Copy' onclick='Copiar(" + Tela[i].IdFichaTecnica + ");'  type='button' class='btn btn-default'><span class='fa fa-folder-open'></span></button></span></button></span></td>";
                    html += "</tr>";
                }
                html += "</tbody></table>";
                $("#divContentTBL").empty();
                $("#divContentTBL").append(html);

                $('#tblTela').DataTable({
                    paging: true,
                    "scrollY": 500
                });
            }
        }
    }
}

function Editar(id) {
    let urlaccion = 'GestionProducto/ProyectoTela/Edit',
            urljs = 'GestionProducto/ProyectoTela/Edit';
    //var par = $("#hfTipo").val() + "," + id;
    let par = 'idtipotela:' + _('hfTipo').value + ',idtela:' + id + ',idgrupocomercial:' + ovariables.idgrupocomercial;
    _Go_Url(urlaccion, urljs, par);
}

function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var Familia = JSON.parse(JSONdata[0].Familia);
    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);
    var htmlFamilia = _comboFromJSON(Familia, "IdFamilia", "NombreFamilia");
    $("#cboFamilia").append(htmlFamilia);

    let idgrupocomercial = _par(_('txtpar').getAttribute('data-par'), 'idgrupocomercial');
    if (idgrupocomercial === '') {
        _('txtpar').value = 'idgrupocomercial:' + JSONdata[0].idgrupocomercial;
        _('txtpar').setAttribute('data-par', _('txtpar').value);
        ovariables.idgrupocomercial = JSONdata[0].idgrupocomercial;
    }
}

function Copiar(id) {
    let tipo = $("#cboTipo").val();
    let titulo = "";
    if (tipo == 1) {
        titulo = "Do you want to copy?"
    } else {
        titulo = "Do you want to transform to fabric project?"
    }
    
    let combo = `<div class='row'>
                    <div id='_divCliente' class='col-sm-12'>
                        <div class='form-group'>
                            <label class='control-label col-sm-4'>Customer</label>
                            <div class='col-sm-8'>
                                <select class='form-control' id='_cboCliente'></select>
                            </div>
                        </div>
                    </div>
                </div>`;

    swal({
        title: titulo,
        text: combo,
        html: true,
         
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true
    }, function (rpta) {
            if (rpta) {
                let valor_cbocliente = _('_cboCliente').value;
                if (valor_cbocliente === '') {
                    alert('Seleccione el cliente...!');
                } else {
                    copiarTela(id, $('#_cboCliente').val())
                }
            }
        return;
    });

    var first = document.getElementById('cboCliente');
    var options = first.innerHTML;

    var second = document.getElementById('_cboCliente');
    var options = second.innerHTML + options;

    second.innerHTML = options;
    var x = document.getElementById("_cboCliente");
    x.remove(0);
    let opt = document.createElement('option');
    opt.value = '';
    opt.selected = true;
    opt.innerHTML = 'Select';
    x.prepend(opt);
    //let arroptions = Array.from(x.options);
    //arroptions.unshift('<option value="">Select</option>');
}

function copiarTela(idtela, idcliente) {      
    let   tipo = $("#cboTipo").val();
    let   form = new FormData()
    let urlaccion = 'GestionProducto/ProyectoTela/CopiarTela', parametro = { idtela: idtela, idcliente: idcliente,tipo:tipo };

    form.append('par', JSON.stringify(parametro));

    Post(urlaccion, form, function (rpta) {
        if (rpta != 0) {            
            let urlaccion = 'GestionProducto/ProyectoTela/Edit',
            urljs = 'GestionProducto/ProyectoTela/Edit';
            
            if (tipo == 2) {
                tipo = 1
            }

            let par = 'idtipotela:' + tipo + ',idtela:' + rpta + ',idgrupocomercial:' + ovariables.idgrupocomercial;
            _Go_Url(urlaccion, urljs, par);
            return;
        }
        else {
            _swal({ estado: 'error', mensaje: '' });
        }
    });
    return;
}

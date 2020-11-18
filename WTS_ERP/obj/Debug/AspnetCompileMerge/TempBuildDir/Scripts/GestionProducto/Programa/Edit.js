$(document).ready(function () {

    var IdPrograma = $("#txtpar").val();
    $("#hfIdPrograma").val(IdPrograma),

    $("#btnSave").click(function () {
        Guardar();
    });

    $("#btnCancel").click(function () {
        let urlaccion = 'GestionProducto/Programa/Index',
            urljs = 'GestionProducto/Programa/Index';
        _Go_Url(urlaccion, urljs, '');
    });

    Get('GestionProducto/Programa/ObtenerPrograma?par=' + IdPrograma, ObtenerPrograma);

    $('#cboCliente').prop('disabled', 'true')

});

function ObtenerPrograma(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        if (JSONdata[0].Programa != "") {
            var Programa = JSON.parse(JSONdata[0].Programa);
            var Cliente = JSON.parse(JSONdata[0].Cliente);

            var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
            $("#cboCliente").append(htmlCliente);

            $("#cboCliente").val(Programa[0].IdCliente)
            $("#cboCliente").attr("data-initial",Programa[0].IdCliente)
            $("#txtName").val(Programa[0].Nombre)
            $("#txtName").attr("data-initial", Programa[0].Nombre)

        }
    }
}
 
function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);

    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);

}
 
function Guardar() {

    var Cliente = $("#cboCliente").val();
    var ClienteIV = $("#cboCliente").attr("data-initial");

    var Name = $("#txtName").val();
    var NameIV = $("#txtName").attr("data-initial");

    var contCambio = 0;

    if (Cliente == "" || Name == "") {
       
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
        return false;
    }

    if (Cliente != ClienteIV || Name != NameIV) {
        contCambio++;
    }

    var objPrograma = {
        IdPrograma: $("#hfIdPrograma").val(),
        IdCliente: Cliente,
        Nombre: Name
    }

    if (contCambio > 0) {
        var ProgramaJSON = JSON.stringify(objPrograma);
        var frm = new FormData();
        frm.append("Programa", ProgramaJSON);
        Post('GestionProducto/Programa/Save', frm, Alerta);
    } else {
        
        var objmensaje = { titulo: 'Alerta', mensaje: 'No changes to save !!!', estado: 'error' };
        _mensaje(objmensaje);
        return false;
    }
}

function Alerta(data) {
    var rpta = JSON.parse(data);
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;

    if (objmensaje.estado != "error") {
        let urlaccion = 'GestionProducto/Programa/Index',
            urljs = 'GestionProducto/Programa/Index';
        _Go_Url(urlaccion, urljs, '');
        return false;
    }

    _mensaje(objmensaje);
}

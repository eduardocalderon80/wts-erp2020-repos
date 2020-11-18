$(document).ready(function () {
    $("#btnNewStyle").click(function () {
        let urlaccion = 'GestionProducto/Programa/New',
            urljs = 'GestionProducto/Programa/New';
        _Go_Url(urlaccion, urljs, 'accion:new');
    });
    $("#btnSearch").click(function () {
        var par = $("#cboCliente").val() + "," + $("#txtName").val();
        var frm = new FormData();
        frm.append("par", par);
        Post('GestionProducto/Programa/Buscar', frm, BuscarPrograma);
    });
    Get('GestionProducto/Programa/ObtenerDatosCarga', ObtenerDatosCarga);       
});

function BuscarPrograma(data) {    
    $("#tblPrograma").remove();
    if (data != null) {
        var Programa = JSON.parse(data);
        var nPrograma = Programa.length;
        if (nPrograma > 0) {
            var html = "";
            
            html += "<table id='tblPrograma' class='table table-bordered table-hover'><thead><tr><th>Id</th><th>Name</th><th>Client</th><th></th></tr></thead><tbody>";
            for (var i = 0; i < nPrograma; i++) {
                html += "<tr>";                
                html += "<td>" + Programa[i].IdPrograma + "</td>";
                html += "<td>" + Programa[i].Nombre + "</td>";
                html += "<td>" + Programa[i].NombreCliente + "</td>";
                html += "<td class='text-center'><span class='btn-group  btn-group-md pull-center'><button title='Edit' type='button' onclick='Editar(" + Programa[i].IdPrograma + ");' class='btn btn-default'><span class='fa fa-edit'></span></button><button title='Delete' type='button' class='btn btn-default' onclick='Eliminar(" + Programa[i].IdPrograma + ");'><span class='glyphicon glyphicon-remove'></span></button></span></td>";
                html += "</tr>";
            }
            html += "</tbody></table>";
            $("#divContentTBL").empty();
            $("#divContentTBL").append(html);
                        
        }
    }
}

function Editar(id) {
    let urlaccion = 'GestionProducto/Programa/Edit',
            urljs = 'GestionProducto/Programa/Edit';
    _Go_Url(urlaccion, urljs, id);
}

function Eliminar(id) {
    var frm = new FormData();
    par = id;
    frm.append("par", par);
    Post('GestionProducto/Programa/Eliminar', frm, Alerta);
}

function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);
}
 
function Alerta(data) {
    var rpta = JSON.parse(data);
    
    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo eliminar', estado: 'error' };
    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    if (objmensaje.estado != "error") {
        $("#btnSearch").trigger("click");
        return false;
    }
    _mensaje(objmensaje);
}
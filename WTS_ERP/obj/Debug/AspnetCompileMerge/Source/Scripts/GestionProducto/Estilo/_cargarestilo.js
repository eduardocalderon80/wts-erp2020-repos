var ovariable = {
    strJSON: '',
    strDetails: '',
    cliente: '',
    season: '',
    division: ''
}

function load() {
    _('_cboCliente').addEventListener('change', load_dataclient);
    //_('_btnAceptarUpload').addEventListener('click', Guardar); 
    fn_cleandata();
}

function fn_cleandata() {
    _('_cboSeason').innerHTML = '<option value="0">Select Season</option>';
    _('_cboDivision').innerHTML = '<option value="0">Select Division</option>';
}

function load_dataclient() {
    let idcliente = _('_cboCliente').value;
    if (idcliente != 0) { req_dataclient(idcliente); }
    else { fn_cleandata(); }
}

function req_dataclient(_idcliente) {

    let par = { idcliente: _idcliente, idgrupocomercial: ovariables.idgrupocomercial },
        frm = new FormData();
    let urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, res_dataclient);
}

function res_dataclient(response) {
    fn_cleandata();
    if (response != null || response != '') {
        ovariable.strDetails = response;
        let strdataclient = JSON.parse(ovariable.strDetails);
        if (strdataclient[0].Temporada != null) {
            ovariable.season = JSON.parse(strdataclient[0].Temporada);
            let cboseason = '';
            ovariable.season.forEach(x=> { cboseason += `<option value='${x.IdClienteTemporada}'>${x.CodigoClienteTemporada}</option>` })
            _('_cboSeason').innerHTML = cboseason;
        }
        if (strdataclient[0].Division != null) {
            ovariable.division = JSON.parse(strdataclient[0].Division);
            let cbodivision = '';
            ovariable.division.forEach(x=> { cbodivision += `<option value='${x.IdClienteDivision}'>${x.NombreDivision}</option>` })
            _('_cboDivision').innerHTML = cbodivision;
        }
    }
}

function req_ini() {
    Get('GestionProducto/Estilo/ObtenerDatosCarga', res_ini);
}

function res_ini(response) {
    ovariable.strJSON = response;
    let strdata = JSON.parse(ovariable.strJSON);
    if (strdata[0].Cliente != null) { ovariable.cliente = JSON.parse(strdata[0].Cliente); };
    fn_loadcliente(ovariable.cliente);
}

function fn_loadcliente(_cliente) {
    let array = _cliente;
    let cbocliente = '<option value="0">Select Client</option>';
    array.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('_cboCliente').innerHTML = cbocliente;
}

(function ini() {
    load();
    req_ini();
})();

function validar() {
    let IdClienteTemporada = _('_cboSeason').value, IdClienteDivision = _('_cboDivision').value, IdCliente = _('_cboCliente').value, pasalavalidacion = true

    if (IdCliente == 0) {
        $('#_div_Client').addClass('has-error');
        $('#_span_error_Client').removeClass('hide');
        pasalavalidacion = false;
    }
    if (IdClienteTemporada == 0) {
        $('#_div_Season').addClass('has-error');
        $('#_span_error_Season').removeClass('hide');
        pasalavalidacion = false;
    }
    //if (IdCliente == 0) {
    //    $('#_div_Division').addClass('has-error');
    //    $('#_span_error_Division').removeClass('hide');
    //    pasalavalidacion = false;
    //}

    return pasalavalidacion;
}

function Load(obj) {
    var archivo = obj.value;
    var ultimopunto = archivo.lastIndexOf(".");
    var ext = archivo.substring(ultimopunto + 1);
    ext = ext.toLowerCase();

    var ruta = document.getElementById("inputFile").files[0].name;

    switch (ext) {
        case 'xlsx':
            $("#_btnAceptarUpload").attr('disabled', false);
            $('#fileSelect').val(ruta);
            AceptarCarga()
            break;
        default:
            $("#_btnAceptarUpload").attr('disabled', true);
            alert('Solo puede subir archivo (xlsx).');
            $('#fileSelect').val('')

            obj.value = '';
    }
}

function AceptarCarga() {
    file = document.getElementById("inputFile").files[0],
    data = file.name.split("."),
    n = data.length,
    frm = new FormData();
    if (n > 1) {

        let IdClienteTemporada = _('_cboSeason').value, IdClienteDivision = _('_cboDivision').value, IdCliente = _('_cboCliente').value

        _('fileSelect').value = file.name;

        let par = { idcliente: IdCliente, idclientetemporada: IdClienteTemporada, idclientedivision: IdClienteDivision },
            form = new FormData();
        form.append("archivo", file);
        form.append("par", JSON.stringify(par));
        url = "GestionProducto/Estilo/UploadStyle"

        Post(url, form, function (rpta) {
            if (rpta.length > 0) {
                PintarTabla(rpta)
            }
        });
    }
}

function PintarTabla(data) {

    $('#divTableUpload').css('display', '');
    _('_TableUpload_Body').innerHTML = '';
    _('_TableUpload_Body').innerHTML = data;

    ValidarTabla();
}

function BloqearControles() {
    $("#_cboCliente").attr('disabled', true)
    $("#_cboSeason").attr('disabled', true)
    $("#_cboDivision").attr('disabled', true)
}

function ValidarTabla() {
    Codigo = JSON.stringify(get_Table('_TableUpload_Body', 0));

    urlaccion = 'GestionProducto/Estilo/ValidarMasivo?par=' + Codigo;
    Get(urlaccion, PintarValidar);

}

function PintarValidar(rpta) {
    _('_TableUpload_Body').innerHTML = '';

    if (rpta != '') {
        let data = CSVtoJSON(rpta, '¬', '^');
        llenartablaValidar(data);
    }
}

function llenartablaValidar(data) {
    let tbl = _('_TableUpload_Body'), html = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        BloqearControles();
        for (let i = 0; i < totalfilas; i++) {
            let ClaseRed = '';
            if (data[i].estado == 1) {
                ClaseRed = 'red-bg p-lg ';
                $('#_divError_filas').css('display', '');
            }
            html += `<tr data-par='estado: ${data[i].estado}' class="${ClaseRed}" >

                        <td>${data[i].codigoestilo}</td>
                        <td>${data[i].descripcion}</td>
                        <td>${data[i].codigotela}</td>
                        <td>${data[i].obs}</td>

                    </tr>
                `;
        }
        tbl.innerHTML = html;

    }
}

function get_Table(idtabla, oparameter) {

    let tbl = document.getElementById(idtabla), totalfilas = tbl.rows.length, row = null, arr = [];
    let IdClienteTemporada = _('_cboSeason').value, IdClienteDivision = _('_cboDivision').value, IdCliente = _('_cboCliente').value;
    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        //
        if (oparameter == 0) {
            let obj = {
                idcliente: IdCliente,
                idclientetemporada: IdClienteTemporada,
                idclientedivision: IdClienteDivision,
                codigoestilo: row.cells[0].innerText,
                descripcion: row.cells[1].innerText,
                codigotela: row.cells[2].innerText
            }
            arr[i] = obj;
        } else if (oparameter == 1) {

            let obj = {
                estado: _par(row.getAttribute('data-par'), 'estado'),
                codigoestilo: row.cells[0].innerText,
                descripcion: row.cells[1].innerText,
                codigotela: row.cells[2].innerText
            }

            arr[i] = obj;
        }
    }
    return arr;
}

function ValidarGuardar() {
    let tbl = _('_TableUpload_Body'), pasavalidacion = true, totalfilas = tbl.rows.length, mensaje = '', tieneregistros = true;
    if (totalfilas <= 0) {
        pasavalidacion = false;
        tieneregistros = false;
        mensaje += '- No existen registro para guardar los estilos';
    }
    if (totalfilas > 0) {
        let estado = 0;
        for (let i = 0; i < totalfilas; i++) {
            row = tbl.rows[i];
            let par = (row.getAttribute('data-par'));
            estado += parseInt(_par(par, 'estado'));
        }
        if (totalfilas == estado) {
            pasavalidacion = false;
            tieneregistros = false;
            mensaje += '- Todos los estilos tienen observaciones ';
        }
    }

    if (mensaje != '') {
        _swal({ estado: 'error', mensaje: mensaje });
    }
    return pasavalidacion;
}

function Guardar() {
    if (validar()) {
        if (ValidarGuardar()) {
            let detalle = JSON.stringify(get_Table('_TableUpload_Body', 1)), IdClienteTemporada = _('_cboSeason').value, IdClienteDivision = _('_cboDivision').value, IdCliente = _('_cboCliente').value,

                par = JSON.stringify({ idcliente: IdCliente, idclientetemporada: IdClienteTemporada, idclientedivision: IdClienteDivision });
            let form = new FormData();
            form.append("par", par);
            form.append("pardetalle", detalle);

            Post('GestionProducto/Estilo/GuardarMasivo', form, function (rpt) {
                //let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
                //    data = orpta !== null && orpta.data !== null ? orpta.data : '',
                //    adata = [];
                //if (data !== '') {

                $("#btnSearch").trigger("click");
                $('#modal_cargarestilo').modal('hide');
                let mensaje = "Style was saved";
                _swal({ estado: 'success', mensaje: mensaje });
            });

        }
    }  
}

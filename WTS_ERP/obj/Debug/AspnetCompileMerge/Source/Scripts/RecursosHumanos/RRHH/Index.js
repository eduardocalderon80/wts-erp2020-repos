/// <reference path="../../Home/Graph.js" />
/// <reference path="../../Home/Util.js" />

var oVariables = {
    oruta: { path: '' },
    accion: '',
    strJSNPersonal: '',
    idcargo: '',
    verForm: "0",
    Area: "0",
    Cargo: "0",
    Estado: "0",
    CodPersonal: "0"
}


function load() {

    $('.footable').footable();

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $(".select2_AreaL").select2({
        placeholder: "Selection Area",
        allowClear: false
    });

    $(".select2_CargoL").select2({
        placeholder: "Selection Job Position",
        allowClear: false
    });

    _('btnNew').addEventListener('click', fn_NewPersonal);

    $('#div_FechaInicio .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#div_FechaCese .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });

    $('#selectArea').on('change', function () {
        let area = '';
        let estado = '';
        if ($("#selectArea").val() != "0") {
            area = $("#selectArea").val();
            estado = $("#cboEstado").val();
            res_LoadFormCargo(area, estado);
        }
        else {
            res_LoadFormPersonal();

        }
    });

    $('#selectCargo').on('change', function () {

        let area = $("#selectArea").val();
        let cargo = $("#selectCargo").val();
        let estado = $("#cboEstado").val();
        fn_cargarPersonal(area, cargo, estado)
    });

    $('#cboEstado').on('change', function () {

        let cargo = $("#selectCargo").val();
        let area = $("#selectArea").val();
        let estado = $("#cboEstado").val();
        fn_cargarPersonal(area, cargo, estado)
    });

    $('#cboArea').on('change', function () {
        let area = $("#cboArea").val();
        $('#cboCargo').select2("val", "");
        fn_cargaComboCargo(area);
    });

    LoadFormPersonal();
    hideForm();

    $("#fupArchivo").change(function () {
        var archivo = this.value;
        var ultimopunto = archivo.lastIndexOf(".");
        var ext = archivo.substring(ultimopunto + 1);
        ext = ext.toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                $('#uploadButton').attr('disabled', false);
                MostrarImagen(this);
                break;
            default:
                alert('Upload Images (png, jpg, jpeg).');
                this.value = '';
        }
    });

    document.getElementById('pasteArea').onpaste = function (event) {

        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items));
        var blob = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                blob = items[i].getAsFile();
            }
        }
        if (blob !== null) {
            var reader = new FileReader();
            reader.onload = function (event) {
                console.log(event.target.result);
                document.getElementById("imgEstilo").src = event.target.result;
                _('hf_estado_actualizarimagen').value = '1';
            };
            reader.readAsDataURL(blob);
        }
        $('#pasteArea').val('');
    }

    $('#btnImagenEliminar').click(function () {
        /* reset($('#fupArchivo'));
         $('#imgEstilo').attr('src', '');
         _('hf_estado_actualizarimagen').value = '1';
         */
        let urlbase = urlBase();

        let ruta = urlbase + "Content/img/RRHH/personal/default.jpg";

        $("#imgEstilo").attr("src", ruta);
        $("#imgEstilo").attr("data-initial", ruta);
    });

    _('btnPrint').addEventListener('click', function () {

        var url = urlBase() + "RecursosHumanos/RRHH/Personal_ReportPDF?IdArea=" + $("#selectArea").val() + "&IdCargo=" + $("#selectCargo").val() + "&Estado=" + $("#cboEstado").val();

        var link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;

        return;
    });

    _('btnExport').addEventListener('click', savePoToPdf_FacturaV);

}

function MostrarImagen(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgEstilo').attr('src', e.target.result);
            _('hf_estado_actualizarimagen').value = "1";
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function LimpiarArea() {
    $('#pasteArea').val('');
}

function savePoToPdf_FacturaV() {
    let urlaccion = urlBase() + "RecursosHumanos/RRHH/Personal_ReportExcel?IdArea=" + $("#selectArea").val() + "&IdCargo=" + $("#selectCargo").val() + "&Estado=" + $("#cboEstado").val();
    $.ajax({
        type: 'GET',
        url: urlaccion,
        dataType: 'json',
        async: false,
    }).done(function (data) {
        if (data.Success) {
            urlaccion = urlBase() + 'RecursosHumanos/RRHH/descargarexcel_facturav';
            window.location.href = urlaccion;
        }
    });
}

/*** FUNCIONES GLOBALES ***/


function hideForm() {

    $('#formMante').hide();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#btnExport').show();
    $('#btnPrint').show();
}

function ShowForm() {

    $('#formMante').show();
    $('#formList').hide();
    $('#btnNew').hide();
    $('#btnSave').show();
    $('#btnCancel').show();
    $('#btnExport').hide();
    $('#btnPrint').hide();
}

function ReturnForm() {

    $('#formMante').hide();
    $('#formList').show();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#btnExport').show();
    $('#btnPrint').show();

    CleanData();
    CleanRequired();
}

function CleanData() {

    _("txtFirstName").value = "";
    _("txtSecondName").value = "";
    _("txtLastName1").value = "";
    _("txtLastName2").value = "";
    _("txtDNI").value = "";
    _("txtEmail").value = "";
    _("hf_IdPersonal").value = "";

    $('#Laptop').iCheck('uncheck');
    $('#Celular').iCheck('uncheck');
    $('#Estado').iCheck('uncheck');

    $("#cboArea").select2("val", "");
    $("#cboCargo").select2("val", "");

    _("txt_Fecha_Inicio").value = "";
    _("txt_Fecha_Cese").value = "";

    $("#Cont_FechaInicio *").prop('disabled', false);
    $('#div_CalendarInicio').show();

}

function SavePersonal() {

    let req = _required({ id: 'formMante', clase: '_enty' });

    if (req) {

        let dniValid = _("txtDNI").value.trim();
        let Idusuario = _("hf_IdPersonal").value.trim();
        let strDatos = oVariables.strJSNPersonal.split('¬');
        let aValoresPersonal = JSON.parse(strDatos[2]);
        let estadoReg = '';
        let regExist = false;


        regExist = aValoresPersonal.some(x => {

            if (x.Dni === dniValid) {
                if (x.Estado == "0") {
                    estadoReg = "Enable";
                }
                else {
                    estadoReg = "Disable";
                }
                oVariables.CodPersonal = x.IdPersonal;
                return true;
            }

        })


        if (regExist) {
            if (oVariables.CodPersonal != Idusuario) {
                if (estadoReg == "Enable") {
                    swal({ title: "Alert", text: "El personal con DNI " + dniValid + " se encuentra registrado con estado activo", type: "warning" });
                }
                else {
                    swal({
                        title: "Alert", text: "El personal con DNI " + dniValid + " se encuentra registrado con estado Inactivo, desea activar el registro ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        UpdatePersonal();
                        oVariables.CodPersonal;
                    });
                }
            }
            else {
                swal({
                    title: "Do you want to save the inserted values?",
                    text: "",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    if (oVariables.verForm == "1") {
                        InsertPersonal();
                    }
                    else {
                        UpdatePersonal();
                        oVariables.CodPersonal;
                    }
                    return;
                });
            }
        }
        else {
            swal({
                title: "Do you want to save the inserted values?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                if (oVariables.verForm == "1") {
                    InsertPersonal();
                }
                else {
                    UpdatePersonal();
                    oVariables.CodPersonal;
                }
                return;
            });
        }
    }
    else {
        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    dniValid = '';
    estadoReg = '';
    regExist = false;
    strContentModalEmergency = '';
    return;
}

function CleanRequired() {

    var arr2 = [...document.getElementsByClassName('has-error')]
    arr2.forEach(x => x.classList.remove('has-error'));

}

function aMayusculas(e) {

    e.value = e.value.toUpperCase();

}

function fn_cargaComboArea() {

    _('cboArea').innerHTML = '';
    let strDatos = oVariables.strJSNPersonal.split('¬');
    let oValoresArea = JSON.parse(strDatos[0]);
    let strSelectArea = '    <option></option>';
    var i;

    for (i = 0; i < oValoresArea.length; i++) {
        strSelectArea = strSelectArea + '<option value="' + oValoresArea[i]['IdArea'] + '">' + oValoresArea[i]['NombreArea'] + '</option>';
    }
    _('cboArea').innerHTML = strSelectArea;

}

function fn_cargaComboCargo(area) {

    let strDatos = oVariables.strJSNPersonal.split('¬');
    let oValoresCargo = JSON.parse(strDatos[1]);
    let strSelectCombo = '    <option></option>';
    var i;

    for (i = 0; i < oValoresCargo.length; i++) {
        if (oValoresCargo[i]['IdArea'] == area)
            strSelectCombo = strSelectCombo + '<option value="' + oValoresCargo[i]['IdCargo'] + '">' + oValoresCargo[i]['NombreCargo'] + '</option>';
    }
    _('cboCargo').innerHTML = strSelectCombo;

}


/*** CARGAR EL LISTADO - AREA, CARGO Y PERSONAL  ***/

function LoadFormPersonal() {

    let url = "RecursosHumanos/RRHH/LoadPersonal";

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        oVariables.strJSNPersonal = sdata;
        res_LoadFormPersonal();
        $('#selectArea').select2("val", "0");
        $('#selectCargo').select2("val", "0");
        //$('#cboArea').select2("val", "0");

    });

}

function res_LoadFormCargo(area, estado) {
    let strDatos = oVariables.strJSNPersonal.split('¬');
    let oValoresPersonal = JSON.parse(strDatos[2]);
    let oValoresCargo = JSON.parse(strDatos[1]);
    let strGrid = ''
    var i;

    strGrid = '<option value="0">-- All Job Positions --</option>';
    for (i = 0; i < oValoresCargo.length; i++) {
        if (oValoresCargo[i]['IdArea'] == area)
            strGrid = strGrid + '<option value="' + oValoresCargo[i]['IdCargo'] + '">' + oValoresCargo[i]['NombreCargo'] + '</option>';
    }
    _('selectCargo').innerHTML = strGrid;

    strGrid = '';

    for (i = 0; i < oValoresPersonal.length; i++) {

        if (oValoresPersonal[i]['IdArea'] == area) {
            if (estado == oValoresPersonal[i]['Estado']) {
                strGrid = strGrid +
                    '<tr>' +
                    '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                    '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                    '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                    '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                    '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                    '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                    '</tr>'
            }
        }
    }

    _('contentTablePersonal').innerHTML = strGrid;

    var strState = '';

    if (estado == "0") {
        strState = " Enable ";
    }
    else {
        strState = " Disable ";
    }

    var yea = document.getElementById("contentTablePersonal").rows.length;
    _('NumRegistros').innerHTML = "Personal" + strState + yea;

    $('.footable').trigger('footable_resize');

}

function res_LoadFormPersonal() {

    let strDatos = oVariables.strJSNPersonal.split('¬');
    let oValoresArea = JSON.parse(strDatos[0]);
    let oValoresCargo = JSON.parse(strDatos[1]);
    let oValoresPersonal = JSON.parse(strDatos[2]);
    let strEstado = $("#cboEstado").val();
    let strGrid = '';
    var i;

    strGrid = '<option value="0">-- All Areas --</option>';
    for (i = 0; i < oValoresArea.length; i++)
        strGrid = strGrid + '<option value="' + oValoresArea[i]['IdArea'] + '">' + oValoresArea[i]['NombreArea'] + '</option>';
    _('selectArea').innerHTML = strGrid;

    strGrid = '<option value="0">-- All Job Positions --</option>';
    for (i = 0; i < oValoresCargo.length; i++)
        strGrid = strGrid + '<option value="' + oValoresCargo[i]['IdCargo'] + '">' + oValoresCargo[i]['NombreCargo'] + '</option>';
    _('selectCargo').innerHTML = strGrid;

    strGrid = '';

    for (i = 0; i < oValoresPersonal.length; i++) {
        if (oValoresPersonal[i]['Estado'] == strEstado) {
            strGrid = strGrid +
                '<tr>' +
                '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                '</tr>'
        }
    }

    _('contentTablePersonal').innerHTML = strGrid;

    var strState = '';

    if (strEstado == "0") {
        strState = " Enable ";
    }
    else {
        strState = " Disable ";
    }

    var yea = document.getElementById("contentTablePersonal").rows.length;
    _('NumRegistros').innerHTML = "Personal" + strState + yea;

    $('.footable').trigger('footable_resize');
}

function fn_cargarPersonal(area, cargo, estado) {

    let strDatos = oVariables.strJSNPersonal.split('¬');
    let oValoresPersonal = JSON.parse(strDatos[2]);
    let strGrid = ''
    var i;

    for (i = 0; i < oValoresPersonal.length; i++) {

        if (area == "0") {
            if (cargo == "0") {
                if (estado == oValoresPersonal[i]['Estado']) {
                    strGrid = strGrid +
                        '<tr>' +
                        '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                        '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                        '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                        '</tr>'
                }
            }
            {
                if (estado == oValoresPersonal[i]['Estado'] && cargo == oValoresPersonal[i]['IdCargo']) {
                    strGrid = strGrid +
                        '<tr>' +
                        '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                        '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                        '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                        '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                        '</tr>'
                }
            }

        }
        else {

            if (cargo == "0") {
                if (oValoresPersonal[i]['IdArea'] == area) {
                    if (estado == oValoresPersonal[i]['Estado']) {
                        strGrid = strGrid +
                            '<tr>' +
                            '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                            '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                            '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                            '</tr>'
                    }
                }
            }
            else {
                if (oValoresPersonal[i]['IdArea'] == area && oValoresPersonal[i]['IdCargo'] == cargo) {
                    if (estado == oValoresPersonal[i]['Estado']) {
                        strGrid = strGrid +
                            '<tr>' +
                            '<td >' + oValoresPersonal[i]['NombrePersonal'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['Dni'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['NombreArea'] + '</td>' +
                            '<td >' + oValoresPersonal[i]['NombreCargo'] + '</td>' +
                            '<td style="text-align:center" onclick="EditPersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-pencil"></i></td>' +
                            '<td style="text-align:center" onclick="DeletePersonal(\'' + oValoresPersonal[i]['IdPersonal'] + '\')"><i class="fa fa-trash"></i></td>' +
                            '</tr>'
                    }
                }
            }
        }
    }

    _('contentTablePersonal').innerHTML = strGrid;

    var strState = '';

    if (estado == "0") {
        strState = " Enable ";
    }
    else {
        strState = " Disable ";
    }

    var yea = document.getElementById("contentTablePersonal").rows.length;
    _('NumRegistros').innerHTML = "Personal" + strState + yea;


    $('.footable').trigger('footable_resize');
}


/*** INSERTAR PERSONAL ***/

function fn_NewPersonal() {

    ShowForm();
    fn_cargaComboArea();

    oVariables.verForm = "1";

    $('#Estado').hide();

    $('#Cont_FechaCese').hide();

    _("NomPersonal").innerHTML = "";

    let urlbase = urlBase();

    let ruta = urlbase + "Content/img/RRHH/personal/default.jpg";

    $("#imgEstilo").attr("src", ruta);
    $("#imgEstilo").attr("data-initial", ruta);


}

function ValidToInsert() {
    var strContentModalEmergency = '';
    let personal = $("#txtFirstName").val() + ' ' + $("#txtSecondName").val() + ' ' + $("#txtLastName1").val() + ' ' + $("#txtLastName2").val();
    let dni = $("#txtDNI").val();
    let comboArea = document.getElementById("cboArea");
    let area = comboArea.options[comboArea.selectedIndex].text;
    let comboCargo = document.getElementById("cboCargo");
    let cargo = comboCargo.options[comboCargo.selectedIndex].text;

    strContentModalEmergency = strContentModalEmergency + getModalRuta(personal, dni, area, cargo);
    document.getElementById("modalEmergency").innerHTML = strContentModalEmergency;
}

function InsertPersonal() {

    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Personal_Insert";
    let par = "";
    let laptop = "0";
    let celular = "0";

    if (req) {

        var valorLaptop = $("#chkLaptop").prop("checked");

        if (valorLaptop == false) {
            laptop = "0";
        }
        else {
            laptop = "1";
        }

        var valorCelular = $("#chkCelular").prop("checked");

        if (valorCelular == false) {
            celular = "0";
        }
        else {
            celular = "1";
        }

        let fechaInicio = $("#txt_Fecha_Inicio").val();
        let fechaCese = $("#txt_Fecha_Cese").val();


        let oPersonal = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdArea = $("#cboArea").val(),
            IdCargo = $("#cboCargo").val();
        oPersonal["IdArea"] = IdArea;
        oPersonal["IdCargo"] = IdCargo;
        oPersonal["IdLaptop"] = laptop;
        oPersonal["IdCelular"] = celular;
        oPersonal["FechaInicio"] = _convertDate_ANSI(fechaInicio);
        oPersonal["FechaCese"] = _convertDate_ANSI(fechaCese);

        form.append('par', JSON.stringify(oPersonal));
        form.append('parimagen', $("#fupArchivo")[0].files[0]);

        let strJson = JSON.stringify(oPersonal);
        Post(url, form, res_post);
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}

function res_post(sdata) {
    oVariables.strJSNPersonal = sdata;


    let datCorreo = oVariables.strJSNPersonal.split('¬');
    let infoCorreo = JSON.parse(datCorreo[3]);

    let strPersonal = "";
    let strUsuario = "";
    let strArea = "";
    let strCargo = "";

    infoCorreo.map(x => {
        strPersonal = x.NombrePersonal;
        strUsuario = x.Usuario;
        strArea = x.NombreArea;
        strCargo = x.NombreCargo;
    })

    let urlCorreo = "RecursosHumanos/RRHH/Personal_EnvioCorreo?param=";
    let param = '{"Personal":"' + strPersonal + '","Usuario":"' + strUsuario + '","Area":"' + strArea + '","Cargo":"' + strCargo + '"}';

    urlCorreo = urlCorreo + param;

    _Get(urlCorreo).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1", reason);
    }).then(function (data) {
        res_LoadFormPersonal();
        $('#selectArea').select2("val", "0");
        $('#selectCargo').select2("val", "0");
        swal({ title: "Good job!", text: "You Have Created New Personal", type: "success" });
        ReturnForm();
    });





    //res_LoadFormPersonal();
    //$('#selectArea').select2("val", "0");
    //$('#selectCargo').select2("val", "0");
    //swal({ title: "Good job!", text: "You Have Created New Personal", type: "success" });
}

/*** ACTUALIZAR PERSONAL ***/

function EditPersonal(idPersonal) {

    let strDatos = oVariables.strJSNPersonal.split('¬');
    let odata = JSON.parse(strDatos[2]);
    var ruta = "";
    var NomPersonal = "";

    fn_cargaComboArea();

    for (var i = 0; i < odata.length; i++) {

        if (odata[i]['IdPersonal'] == idPersonal) {
            NomPersonal = odata[i]['NombrePersonal'];
            _("txtFirstName").value = odata[i]['PrimerNombre'];
            _("txtSecondName").value = odata[i]['SegundoNombre'];
            _("txtLastName1").value = odata[i]['PrimerApellido'];
            _("txtLastName2").value = odata[i]['SegundoApellido'];
            _("txtDNI").value = odata[i]['Dni'];
            _("txtEmail").value = odata[i]['CorreoElectronico'];
            _("hf_IdPersonal").value = idPersonal;

            $('#cboArea').select2("val", odata[i]['IdArea'].toString());
            fn_cargaComboCargo(odata[i]['IdArea'].toString())
            $('#cboCargo').select2("val", odata[i]['IdCargo'].toString());

            var urlbase = urlBase();

            if (odata[i]['ImagenWebNombre'].toString() != "") {
                ruta = urlbase + $("#txtRutaFileServer").val() + odata[i]['ImagenWebNombre'].toString();
                $("#imgEstilo").attr("src", ruta);
                $("#imgEstilo").attr("data-initial", ruta);
            }
            else {
                ruta = urlbase + "Content/img/RRHH/personal/default.jpg";

                $("#imgEstilo").attr("src", ruta);
                $("#imgEstilo").attr("data-initial", ruta);
            }

            if (odata[i]['FechaInicio'] != "") {
                _("txt_Fecha_Inicio").value = odata[i]['FechaInicio'];
            }
            else {
                _("txt_Fecha_Inicio").value = "";
            }

            if (odata[i]['FechaCese'] != "") {
                _("txt_Fecha_Cese").value = odata[i]['FechaCese'];
            }
            else {
                _("txt_Fecha_Cese").value = "";
            }


            if (odata[i]['Estado'] == "0") {
                $('#Estado').hide();
                $('#Estado').iCheck('check');
                $('#Cont_FechaCese').hide();
                $("#Cont_FechaInicio *").prop('disabled', false);
                $('#div_CalendarInicio').show();
            }
            else {
                $('#Estado').show();
                $('#Estado').iCheck('uncheck');
                $('#Cont_FechaCese').show();
                $("#Cont_FechaInicio *").prop('disabled', true);
                $('#div_CalendarInicio').hide();
            }

            if (odata[i]['IdLaptop'] == "1") {
                $('#Laptop').iCheck('check');
            }
            else {
                $('#Laptop').iCheck('uncheck');
            }

            if (odata[i]['IdCelular'] == "1") {
                $('#Celular').iCheck('check');
            }
            else {
                $('#Celular').iCheck('uncheck');
            }
        }
    }

    _("NomPersonal").innerHTML = " - " + NomPersonal;

    oVariables.verForm = "2";
    ShowForm();
}


function UpdatePersonal() {
    let req = _required({ id: 'formMante', clase: '_enty' });
    let url = "RecursosHumanos/RRHH/Personal_Update?par=";
    let par = "";
    var estado = "0";
    let laptop = "0";
    let celular = "0";
    let codigo = "0";

    if (req) {

        var valorLaptop = $("#chkLaptop").prop("checked");

        if (valorLaptop == false) {
            laptop = "0";
        }
        else {
            laptop = "1";
        }

        var valorCelular = $("#chkCelular").prop("checked");

        if (valorCelular == false) {
            celular = "0";
        }
        else {
            celular = "1";
        }

        var valorEstado = "";

        if (oVariables.verForm == "1") {
            estado = "0";
            codigo = oVariables.CodPersonal;
        }
        else {
            valorEstado = $("#chkEstado").prop("checked");

            if (valorEstado == false) {
                estado = "1";
            }
            else {
                estado = "0";
            }
        }

        let oPersonal = _getParameter({ id: 'formMante', clase: '_enty' }),
            form = new FormData(),
            urlaccion = '',
            IdArea = $("#cboArea").val(),
            IdCargo = $("#cboCargo").val();
        if (oVariables.verForm == "1") {
            IdPersonal = codigo;
            oPersonal["IdPersonal"] = IdPersonal;
        }
        else {
            oPersonal["IdPersonal"] = _("hf_IdPersonal").value;
        }

        oPersonal["IdArea"] = IdArea;
        oPersonal["IdCargo"] = IdCargo;
        oPersonal["IdLaptop"] = laptop;
        oPersonal["IdCelular"] = celular;
        oPersonal["Estado"] = estado;

        form.append('par', JSON.stringify(oPersonal));
        form.append('parimagen', $("#fupArchivo")[0].files[0]);

        let strJson = JSON.stringify(oPersonal);
        Post(url, form, res_postEdit);
    }
    else {

        swal({ title: "Alert", text: "Enter the data required", type: "warning" });
    }
    return;
}


function res_postEdit(sdata) {
    oVariables.strJSNPersonal = sdata;
    ReturnForm();
    res_LoadFormPersonal();
    $('#selectArea').select2("val", "0");
    $('#selectCargo').select2("val", "0");
    swal({ title: "Good job!", text: "You Have Created New Personal", type: "success" });
}

/*** ELIMINAR PERSONAL ***/

function DeletePersonal(personal) {
    swal({
        title: "Do you want to delete this register?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
    }, function () {
        $('#formulario').hide();
        $('#btnNew').show();
        $('#btnSave').hide();
        DeleteConfirmPersonal(personal);
        return;

    });
}

function DeleteConfirmPersonal(personal) {

    let url = "RecursosHumanos/RRHH/Personal_Delete?par=";
    let par = '{"idpersonal":"' + personal + '"}';

    url = url + par;

    _Get(url).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        oVariables.strJSNPersonal = sdata;
        res_LoadFormPersonal();
        $('#selectArea').select2("val", "0");
        $('#selectCargo').select2("val", "0");
        swal({ title: "Good job!", text: "You deleted this register", type: "success" });


    });

}


/*** MODAL ***/

function getModalRuta(_Personal, _Dni, _Area, _Cargo) {


    var strModalWindow = '';
    var strResult = '';


    strModalWindow =
        '<div class="modal inmodal" id="myModal_Emergency" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content animated flipInY">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<h4 class="modal-title">DETAILS PERSON</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<table class="table ">' +
        '<tbody>' +
        '<tr>' +
        '<td class="desc">'
    strModalWindow =
        strModalWindow + '     <dl class="text-success">   ' +
        '<dd><b>Personal:&nbsp;</b> ' + _Personal + '</dd>' +
        '<dd><b>Dni:&nbsp;</b> ' + _Dni + '</dd>' +
        '<dd><b>Area:&nbsp;</b>' + _Area + '</dd>' +
        '<dd><b>Cargo:&nbsp;</b>  ' + _Cargo + '</dd>' +
        '<dd></td>' +
        '</dl>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';


    strModalWindow = strModalWindow + ' <div class="modal-footer">' +
        '<button id="btnApprove" type="button" class="btn btn-success"  onclick="Insert">Approve</button>' +
        '<button type="button" class="btn btn-warning" data-dismiss="modal">Return</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    return strModalWindow;
}



(function ini() {
    load();
}
)();

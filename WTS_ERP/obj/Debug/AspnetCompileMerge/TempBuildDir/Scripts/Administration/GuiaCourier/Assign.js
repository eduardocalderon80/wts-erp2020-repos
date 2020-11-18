// Variables globales
var objectGeneral = [], cboCourier = [], cboTipoEnvio = [], cboSubResponsable = [], tdSubRes = [];
var objFiltrado = [];

// Funcion inicial setea valores y data por defecto
function Cargar() {
    // Configuracion del datepicker en español
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        clear: "Limpiar",
        format: "dd/mm/yyyy",
    };
    // Asigna configuracion a etiquetas
    $('.date').datepicker({
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: "es"
    });
    // Asigna fecha actual
    let date = new Date();
    $('.date').eq(0).datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), 1));
    $('.date').eq(1).datepicker('setDate', new Date());
    // Genera request inicial y guarda data en memoria
    req_Habilitado();
    // Click Botones
    fn_BotonesClick();
}

/* FUNCIONES */
// Obtiene fecha actual en formato dd/mm/yyyy
function fn_ObtenerFecha(fecha) {
    let hoy;
    if (fecha == null) {
        hoy = new Date();
    } else {
        hoy = new Date(fecha);
    }
    let dia = String(hoy.getDate()).padStart(2, '0');
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let anio = hoy.getFullYear();

    hoy = dia + '/' + mes + '/' + anio;
    return hoy;
}
// Scroll al id brindado o hasta el final del documento
function fn_ScrollTo(element) {
    let html = document.documentElement;
    html.style.scrollBehavior = "smooth";

    if (element) {
        element.scrollIntoView();
    } else {
        html.scrollTop += document.body.scrollHeight;
    }
}
// Botonos
function fn_BotonesClick() {
    _("btnSearch").onclick = function () {
        req_Habilitado();
        // Limpia campos
        _("txtNumeroGuia").value = "";
        //_("txtFechaDesde").value = "";
        //_("txtFechaHasta").value = "";
    }
    _("btnReturn").onclick = function () {
        let urlaccion = 'Administration/GuiaCourier/Index',
            urljs = 'Administration/GuiaCourier/Index';
        _Go_Url(urlaccion, urljs);
        removejscssfile("Assign", "js");
    }
    _("btnAdd").onclick = function () {
        let urlaccion = 'Administration/GuiaCourier/Add',
            urljs = 'Administration/GuiaCourier/Add';
        _Go_Url(urlaccion, urljs);
        removejscssfile("Assign", "js");
    }
    _("btnAgregarSubRes").onclick = function () {
        fn_AgregarSubTabla();
    }
    //_("btnCancelarSubRes").onclick = function () {
    //    //_("AgregarSubRes").style.display = "none";
    //    //$('#AgregarSubRes').modal('hide');
    //    _("btnGrabarSubRes").setAttribute("onclick", "");
    //    //fn_ScrollTo(_("content_form"));
    //    // Desmarcar todos los checkboxs
    //    $("input[type='checkbox']").prop("checked", false);
    //    // Limpia Sub Tabla
    //    _("tbodySubResponsable").innerHTML = "";
    //}
    //_("btnDismissModal").onclick = function () {
    //    _("btnGrabarSubRes").setAttribute("onclick", "");
    //    //fn_ScrollTo(_("content_form"));
    //    // Desmarcar todos los checkboxs
    //    $("input[type='checkbox']").prop("checked", false);
    //    // Limpia Sub Tabla
    //    _("tbodySubResponsable").innerHTML = "";
    //}
    $('#AgregarSubRes').on('hidden.bs.modal', function () {
        // Borrar Attribute con Id
        _("btnGrabarSubRes").setAttribute("onclick", "");
        // Desmarcar todos los checkboxs
        $("input[type='checkbox']").prop("checked", false);
        // Limpia Sub Tabla
        _("tbodySubResponsable").innerHTML = "";
    });
}
// Setea opciones jquery Datatable
function fn_formatTable() {
    $('#tablaGuiaCourier').DataTable({
        scrollY: "455px",
        scrollX: true,
        scrollCollapse: true,
        ordering: false,
        searching: false,
        info: false,
        //"pageLength": 25,
        drawCallback: function () {
            $('[data-toggle="popover"]').popover({
                placement: 'right',
                trigger: 'hover',
                html: true
            });
        },
        bPaginate: false

        ////"columndefs": [
        ////    { "width": "5%", "targets": 0 }
        ////],
        //"language": {
        //    "lengthMenu": "Mostrar _MENU_ registros",
        //    "zeroRecords": "No se encontraron registros",
        //    "info": "Pagina _PAGE_ de _PAGES_",
        //    "infoEmpty": "No se encontraron registros",
        //    "paginate": {
        //        "next": "Siguiente",
        //        "previous": "Anterior"
        //    },
        //}
    });

    // Fix datatable bug
    //setTimeout(function () {
    //    $('#tablaGuiaCourier').DataTable().columns.adjust().draw();
    //}, 1000);


    $('#tablaGuiaCourier').DataTable().columns.adjust().draw();



    //$('#tablaGuiaCourier').DataTable().columns.adjust().draw();
    //$($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}
//NO SE USA - SE HIZO CON CSS PURO
function fn_formatRadio() {
    //<td><input type="radio" name="tb_radio" value="`+ x.IdGuia +`" class="i-check" onclick="fn_OnClickRadio(this)"></td>
    $('.i-check').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}
function fn_ToolTip(id) {
    let IdGuia = id, arr = [], cadena = "", resultado = "";
    let filtrado = tdSubRes.filter(x => x.IdGuia == IdGuia);
    if (filtrado.length > 0) {
        filtrado.forEach(x => {
            let personal = cboSubResponsable.filter(j => j.IdResponsable == x.IdPersonal)[0];
            arr.push(personal.NombrePersonal);
        });
        cadena = arr.join("<br/>");
        resultado = '<span class="label label-info cursor-pointer" data-toggle="popover" data-content="' + cadena + '"><i class="fa fa-eye"></i></span>';
    } else {
        cadena = "NO SE ENCONTRO DATOS";
        resultado = '<span class="label label-default cursor-pointer" data-toggle="popover" data-content="' + cadena + '"><i class="fa fa-eye"></i></span>';
    }
    return resultado;
}
// Crea tabla, recibe json
function fn_CrearTabla(_json) {
    let data = _json, html = '', htmlbody = '';
    html = `
        <table id="tablaGuiaCourier" class ="stripe row-border order-column" style="width: 100%; max-width: 100%; padding-right: 0px;">
            <thead>
                <tr>
                    <th></th>
                    <th>Courier</th>
                    <th>No. Guia</th>
                    <th>Tipo Envio</th>
                    <th>Responsable</th>
                    <th>Sub Responsable</th>
                    <th>Fecha Envio</th>
                    <th>Fecha Registro</th>
                    <th>Factura</th>
                </tr>
            </thead>
            <tbody>
        `;
    if (data.length > 0) {
        data.forEach(x => {
            htmlbody += `
            <tr>
                <td><label class="check_cont"><input type="checkbox" name="tb_check" value="`+ x.IdGuia + `" onclick="fn_OnClickCheck(this)"><span class="check_mark"></span></label></td>
                <td>${x.NombreCourier}</td>
                <td>${x.NumeroGuia}</td>
                <td>${x.TipoEnvio}</td>
                <td>${x.Reponsable}</td>
                <td class="view-details">`+ fn_ToolTip(x.IdGuia) + `</td>
                <td>${fn_ObtenerFecha(x.FechaEnvioEntrega)}</td>
                <td>${fn_ObtenerFecha(x.FechaCreacion)}</td>
                <td>${x.Factura}</td>
            </tr>
            `;
        });
    }

    //<label class="check_cont"><input type="checkbox" name="tb_check" value="`+ x.IdGuia +`" onclick="fn_OnClickCheck(this)"><span class="check_mark"></span></label>
    //<label class="radio_cont"><input type="radio" name="tb_radio" value="`+ x.IdGuia +`" onclick="fn_OnClickRadio(this)"><span class="radio_mark"></span></label>
    html += htmlbody + '</tbody></table>';

    _('divGuiaCourier').innerHTML = html;
    //fn_formatRadio();
    fn_formatTable();

    // Activa tooltip
    //$('[data-toggle="popover"]').popover({
    //    placement: 'right',
    //    trigger: 'hover',
    //    html: true
    //});
}

function fn_CrearCombos() {
    let htmlCourier = `<option value='0'>Todos los Couriers</option>`,
        htmlTipo = `<option value='0'>Todos los Tipos de Envio</option>`,
        htmlSubResponsable = `<option value='0'>Asignar Sub Responsable</option>`;
    if (cboCourier.length > 0) {
        cboCourier.forEach(x => { htmlCourier += `<option value ='${x.IdCourier}'>${x.NombreCourier}</option>`; });
    }
    if (cboTipoEnvio.length > 0) {
        cboTipoEnvio.forEach(x => { htmlTipo += `<option value ='${x.IdTipoEnvio}'>${x.NombreEnvio}</option>`; });
    }
    if (cboSubResponsable.length > 0) {
        cboSubResponsable.forEach(x => { htmlSubResponsable += `<option value ='${x.IdResponsable}'>${x.NombrePersonal}</option>`; });
    }
    _('cboCourier').innerHTML = htmlCourier;
    _('cboTipoEnvio').innerHTML = htmlTipo;
    _('cboSubResponsable').innerHTML = htmlSubResponsable;

    $("#cboCourier, #cboTipoEnvio, #cboSubResponsable").select2({
        containerCssClass: "CustomSizeSelect2"
    });
}

function fn_OnClickCheck(element) {
    //let radio = document.querySelector('input[name="tb_radio"]:checked').value;
    //$("input[type='checkbox']").prop("checked", false);
    // Limpia Sub Tabla
    _("tbodySubResponsable").innerHTML = "";
    // Habilita todas las opciones del select
    $('#cboSubResponsable option').prop('disabled', false);
    // Bind select2
    $("#cboSubResponsable").select2({
        containerCssClass: "CustomSizeSelect2"
    });

    if (element.checked == true) {
        //_("AgregarSubRes").style.display = "block";
        $('#AgregarSubRes').modal('show');
        fn_LlenarSubTabla(element.value);
        _("btnGrabarSubRes").setAttribute("onclick", "req_GrabarDatos(" + element.value + ")");
        //fn_ScrollTo();
    } else {
        //_("AgregarSubRes").style.display = "none";
        $('#AgregarSubRes').modal('hide');
        _("btnGrabarSubRes").setAttribute("onclick", "");
    }
    $("input[type='checkbox']").change(function () {
        $("input[type='checkbox']").not(this).prop('checked', false);
    });
    //console.log(element.value);
}

function fn_LlenarSubTabla(idValue) {
    if (tdSubRes.length > 0) {
        let filtrado = tdSubRes.filter(x => x.IdGuia == idValue), html = '';
        if (filtrado.length > 0) {
            filtrado.forEach(x => {
                let personal = cboSubResponsable.filter(j => j.IdResponsable == x.IdPersonal)[0];
                html += `<tr>
                        <input class="inputId" type="hidden" value="${x.IdPersonal}">
                        <td class="text-center">
                            <button class="btn btn-sm btn-danger" onclick="fn_EliminarCampo(this)">
                                <span class="fa fa-trash-o"></span>
                            </button>
                        </td>
                        <td>${personal.NombrePersonal}</td>
                    </tr>`;

                // Deshabilita opcion agregada
                $('#cboSubResponsable option[value="' + x.IdPersonal + '"]').prop('disabled', true);
            });
            _('tbodySubResponsable').innerHTML += html;

            // Bind select2
            $("#cboSubResponsable").select2({
                containerCssClass: "CustomSizeSelect2"
            });
        }
    }
}

function fn_AgregarSubTabla() {
    let cboValue = _("cboSubResponsable").value, html = '', filterValue;
    if (cboValue != 0) {
        filterValue = cboSubResponsable.filter(x => x.IdResponsable == cboValue)[0];
        html = `<tr>
                    <input class="inputId" type="hidden" value="${filterValue.IdResponsable}">
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger" onclick="fn_EliminarCampo(this)">
                            <span class="fa fa-trash-o"></span>
                        </button>
                    </td>
                    <td>${filterValue.NombrePersonal}</td>
                </tr>`;
        _('tbodySubResponsable').innerHTML += html;

        // Setea value 0 luego de haber seleccionado
        _("cboSubResponsable").value = 0;
        // Deshabilita opcion agregada
        $('#cboSubResponsable option[value="' + cboValue + '"]').prop('disabled', true);
        // Bind select2
        $("#cboSubResponsable").select2({
            containerCssClass: "CustomSizeSelect2"
        });
    } else {
        swal({ title: "Advertencia", text: "Debes seleccionar un Sub Responsable", type: "warning" });
    }
}

function fn_EliminarCampo(element) {
    let cboValue = $(element).parent().prev(".inputId").val();
    $(element).parent().parent().remove();

    // Setea value 0 por defecto
    _("cboSubResponsable").value = 0;
    // Habilita opcion eliminada
    $('#cboSubResponsable option[value="' + cboValue + '"]').prop('disabled', false);
    // Bind select2
    $("#cboSubResponsable").select2({
        containerCssClass: "CustomSizeSelect2"
    });
}

function fn_FiltrarTabla() {
    let NroGuia = _('txtNumeroGuia').value, IdCourier = _('cboCourier').value, IdTipoEnvio = _('cboTipoEnvio').value;
    //let FechaDesde = _("txtFechaDesde").value, FechaHasta = _("txtFechaHasta").value;

    // Limpia campos fecha si no esta rango
    //if (FechaDesde != "" && FechaHasta == "" || FechaHasta != "" && FechaDesde == "") {
    //    _("txtFechaDesde").value = "";
    //    _("txtFechaHasta").value = "";
    //}

    //if (NroGuia == "" && IdCourier == 0 && IdTipoEnvio == 0) {
    //    objFiltrado = objectGeneral;
    //} else {

    //    if (NroGuia != "" && IdCourier == 0 && IdTipoEnvio == 0) {
    //        objFiltrado = objectGeneral.filter(x => x.NumeroGuia.indexOf(NroGuia) > - 1);
    //    } else if (NroGuia != "" && IdCourier != 0 || NroGuia != "" && IdTipoEnvio != 0) {
    //        objFiltrado = objFiltrado.filter(x => x.NumeroGuia.indexOf(NroGuia) > - 1);
    //    }

    //    if (IdCourier != 0 && IdTipoEnvio == 0 && NroGuia == "") {
    //        objFiltrado = objectGeneral.filter(x => x.IdCourier == IdCourier);
    //    } else if (IdCourier != 0 && IdTipoEnvio != 0 || IdCourier != 0 && NroGuia != ""){
    //        objFiltrado = objFiltrado.filter(x => x.IdCourier == IdCourier);
    //    }

    //    if (IdTipoEnvio != 0 && IdCourier == 0 && NroGuia == "") {
    //        objFiltrado = objectGeneral.filter(x => x.IdTipoEnvio == IdTipoEnvio);
    //    } else if (IdTipoEnvio != 0 && IdCourier != 0 || IdTipoEnvio != 0 && NroGuia != ""){
    //        objFiltrado = objFiltrado.filter(x => x.IdTipoEnvio == IdTipoEnvio);
    //    }

    //    //objectGeneral.filter(x => fn_ObtenerFecha(x.FechaCreacion) >= "04/02/2019" && fn_ObtenerFecha(x.FechaCreacion) <= "04/02/2019");
    //    //if ((FechaDesde != "" && FechaHasta != "") && NroGuia == "" && IdCourier == 0 && IdTipoEnvio == 0) {
    //    //    objFiltrado = objectGeneral.filter(x => fn_ObtenerFecha(x.FechaCreacion) >= FechaDesde && fn_ObtenerFecha(x.FechaCreacion) <= FechaHasta);
    //    //} else if ((FechaDesde != "" && FechaHasta != "") && NroGuia == "" || (FechaDesde != "" && FechaHasta != "") && IdCourier == 0 || (FechaDesde != "" && FechaHasta != "") && IdTipoEnvio == 0){
    //    //    objFiltrado = objFiltrado.filter(x => fn_ObtenerFecha(x.FechaCreacion) >= FechaDesde && fn_ObtenerFecha(x.FechaCreacion) <= FechaHasta);
    //    //}
    //}

    let resultado = objectGeneral.filter(x =>
        (NroGuia === '' || x.NumeroGuia.indexOf(NroGuia) > -1) &&
        (IdCourier === '0' || x.IdCourier.toString() === IdCourier) &&
        (IdTipoEnvio === '0' || x.IdTipoEnvio.toString() === IdTipoEnvio)
    );

    console.log(1);

    fn_CrearTabla(resultado);
}

/* REQUESTS */
// Verifica si el usuario se encuentra habilitado para usar esta vista y 
// Obtiene datos por id de db para realizar operaciones desconectado
function req_Habilitado() {
    let fechaDesde = _("txtFechaDesde").value, fechaHasta = _("txtFechaHasta").value;
    if (fechaDesde != "" && fechaHasta == "" || fechaHasta != "" && fechaDesde == "" || fechaDesde == "" && fechaHasta == "") {
        swal({ title: "Advertencia", text: "Debes seleccionar un rango de fechas", type: "warning" });
    } else {
        let data = fechaDesde + "|" + fechaHasta;
        let urlaccion = 'Administration/GuiaCourier/GuiaCourier_ObtenerPorId?par=' + data;
        Get(urlaccion, res_Habilitado);
    }
}

function req_GrabarDatos(idGuia) {
    let inputId = document.getElementsByClassName("inputId");
    swal({
        title: "Grabar Datos",
        text: "¿Estas seguro/a que deseas guardar estos datos?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        let campos = [], data;
        for (let i = 0; i < inputId.length; i++) {
            campos.push(inputId[i].value);
        }
        if (campos.length > 0) {
            data = idGuia + "¬";
            data += campos.join("|");
        } else {
            data = idGuia;
        }
        //console.log(data);

        //let urlaccion = 'Administration/GuiaCourier/GuiaCourier_SubResponsable_Insertar';
        //form = new FormData();
        //form.append('data', JSON.stringify(data));
        //Post(urlaccion, form, res_GrabarDatos);
        Get('Administration/GuiaCourier/GuiaCourier_SubResponsable_Insertar?par=' + data, res_GrabarDatos);
    });
}

/* RESPONSES */
function res_Habilitado(respuesta) {
    if (respuesta != 0) {
        if (respuesta.split("_")[0] != "") {
            objectGeneral = JSON.parse(respuesta.split("_")[0]);
        }
        cboCourier = JSON.parse(respuesta.split("_")[1]);
        cboTipoEnvio = JSON.parse(respuesta.split("_")[2]);
        cboSubResponsable = JSON.parse(respuesta.split("_")[3]);
        if (respuesta.split("_")[4] != "") {
            tdSubRes = JSON.parse(respuesta.split("_")[4]);
        }
        fn_CrearTabla(objectGeneral);
        fn_CrearCombos();
        // Filtrado de tabla
        objFiltrado = objectGeneral;
        //$('#cboCourier').on('change', fn_FiltrarTabla(objectGeneral));

        $('#txtNumeroGuia').keyup(function (e) {
            var code = e.which;
            if (code == 13) {
                fn_FiltrarTabla();
            }
        });
        $("#cboCourier, #cboTipoEnvio").change(function () {
            fn_FiltrarTabla();
        });

        //$("#btnBuscarFecha").click(function () {
        //    // Limpia campos fecha si no esta rango, muestra msj error
        //    let FechaDesde = _("txtFechaDesde").value, FechaHasta = _("txtFechaHasta").value;
        //    if (FechaDesde != "" && FechaHasta == "" || FechaHasta != "" && FechaDesde == "" || FechaDesde == "" && FechaHasta == "") {
        //        _("txtFechaDesde").value = "";
        //        _("txtFechaHasta").value = "";
        //        swal({ title: "Advertencia", text: "Debes seleccionar un rango de fechas", type: "warning" });
        //    } else {
        //        fn_FiltrarTabla();
        //    }
        //});
    } else {
        console.log("Este usuario no tiene la opcion 'Asignar Sub Responsable' activada!");
    }
}

function res_GrabarDatos(respuesta) {
    if (respuesta != 0) {
        swal({ title: "¡Buen Trabajo!", text: "Haz registrado nuevos datos", type: "success" });
        req_Habilitado();

        //_("AgregarSubRes").style.display = "none";
        $('#AgregarSubRes').modal('hide');
        _("btnGrabarSubRes").setAttribute("onclick", "");
        //fn_ScrollTo(_("content_form"));
        // Desmarcar todos los checkboxs
        $("input[type='checkbox']").prop("checked", false);
        // Limpia Sub Tabla
        _("tbodySubResponsable").innerHTML = "";
    } else {
        swal({ title: "¡Ha surgido un problema!", text: "Por favor, comunicate con el administrador TIC", type: "error" });
    }
}

// Funcion auto-invocada
(function () {
    Cargar();
})();
window.reset = function (e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

var ovariables_estilo_new = {
    accion: '',
    idgrupocomercial: '',
    flgVersion: 0,
    datalst_estados_combo: '',
    datalst_unidadmedida_combo: '',  // se usa en cboProcessUnidadMedida y cboTrimUnidadMedida
    datalst_tipomoneda_combo: '' , // se uda en cboProcessMoneda, cboArtworkMoneda, cboTrimMoneda
    filtro_index: '',
    estilointranet: '',
    colorintranet: '',
    imagen:'',
    telaprincipal: ''
}

function load() {
    // MODAL
    _modal('buscartela', 1000);
    $('#modal_buscartela').on('show.bs.modal', ejecutarmodalbuscartela);

    _modal('newversion', 1000);
    $('#modal_newversion').on('show.bs.modal', ejecutarmodalnewversion);

    let par = _('txtpar').value;
    if (!_isEmpty(par)) {
        ovariables_estilo_new.accion = _par(par, 'accion');
        ovariables_estilo_new.idgrupocomercial = _par(par, 'idgrupocomercial');
        ovariables_estilo_new.filtro_index = _par(par, 'filtro_index');
    }

    switch (ovariables_estilo_new.accion) {
        case 'new':
            $('#btnUpdate').addClass('hide');
            $('#btnDDP').addClass('hide');
            $('#btnNewVersion').addClass('hide');
            $('#btnColor').addClass('hide');            
            $('#btnMigrar').addClass('hide');
            break;
        case 'edit':
            $('#btnSave').addClass('hide');
            $('#btnDDP').remove('hide');
            $('#btnNewVersion').remove('hide');
            $('#cboCliente').prop('disabled', true), 
            //$('#txtCode_estilo').prop('disabled', true);
            //_('div_callout_boton').classList.remove('hide');
            //_('div_callout_tabla').classList.remove('hide');
            _('div_callout').classList.remove('hide');
            break;
    }

    _modal('newreq', 1000);
    $('#modal_newreq').on('show.bs.modal', ejecutarmodalnewreq);

    _modal('color', 1000);
    $('#modal_color').on('show.bs.modal', ejecutarmodalcolor);

    _('btnMigrar').addEventListener('click', migrarerp);
    _('btnColor').addEventListener('click', color);

    _('btnDDP').addEventListener('click', newreq);
    _('btnNewVersion').addEventListener('click', newversion);

    _('btnBuscarTela').addEventListener('click', openModalBuscarTela);
    _('btnUpdate').addEventListener('click', save_edit_estilo);
    _('btnCancel').addEventListener('click', retornar_index);

    _('btn_addestilotechpack').addEventListener('change', fn_addestilotechpack);
    ////$("#cboFabricSupplier").hide();
  
    $(".cboSupplier").select2();

    //$(".cboProcessSupplier").select2(); // VER ESTO ?? MALOGRA AL CONTROL
    //$(".cboArtworkSupplier").select2();  // VER ESTO ?? MALOGRA AL CONTROL

    $("#btnAddFabricProject").click(function () {
        //AgregarFabricProject();
        AbrirModalFabricProject();
    });

    $("#btnAddFabricCombo").click(function () {
        AgregarFabricCombo();
    });

    $("#btnAddCombo").click(function () {
        AgregarCombo();
    });

    $("#btnAddProcess").click(function () {
        AgregarProceso();
    });
    $("#btnAddArtwork").click(function () {
        AgregarArtwork();
    });
    $("#btnAddTrim").click(function () {
        AgregarTrim();
    });
    $("#btnAddFabricCode").click(function () {
        AbrirModalFabricCode();
    });

    $("#btnAddCallout").click(function () {
        AgregarCallout();
    });

    _('cboCliente').addEventListener('change', GetDatabyClient);

    //$("#cboCliente").change(function () {
    //    var frm = new FormData();
    //    //frm.append("par", $(this).val());
    //    let par = { idcliente: $(this).val(), idgrupocomercial: ovariables.idgrupocomercial }
    //    //frm.append("par", $(this).val());
    //    frm.append("par", JSON.stringify(par));

    //    Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    //});

    $('#btnImagenEliminar').click(function () {
        reset($('#fupArchivo'));
        $('#imgEstilo').attr('src', '');
        _('hf_estado_actualizarimagen').value = '1';
    });

    $('#btnImagenFabricComboEliminar').click(function () {
        reset($('#fupArchivo_fabric'));
        $('#imgEstilo_fabric').attr('src', '');
        _('hf_estado_actualizarimagenFabricCombo').value = '1';
    });

    $("#btnSave").click(function () {
        //save_new_estilo();
        Validar();
    });

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

    $("#fupArchivo_fabric").change(function () {
        var archivo = this.value;
        var ultimopunto = archivo.lastIndexOf(".");
        var ext = archivo.substring(ultimopunto + 1);
        ext = ext.toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                $('#uploadButton').attr('disabled', false);
                MostrarImagen_combo(this);
                break;
            default:
                alert('Upload Images (png, jpg, jpeg).');
                this.value = '';
        }
    });

    //$('#btnImagenEliminar').click(function () {
    //    reset($('#fupArchivo'));
    //    $('#imgEstilo').attr('src', '');
    //});

    $("#cboFamilia").change(function () {
        var value = $(this).val();
        if (value != "") {
            var frm = new FormData();
            frm.append("par", value);
            Post('GestionProducto/Estilo/BuscarTelasPorFamilia', frm, BuscarTelasPorFamilia);
        }
    });

    document.getElementById('pasteArea').onpaste = function (event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
       
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

    document.getElementById('pasteAreaFabric').onpaste = function (event) {
        console.log(event)
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;     
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
                document.getElementById("imgEstilo_fabric").src = event.target.result;
                _('hf_estado_actualizarimagenFabricCombo').value = '1';
            };
            reader.readAsDataURL(blob);
        }
        $('#pasteAreaFabric').val('');
    }

}

function migrarerp() {
    let par = _('txtpar').value, idestilo = _par(par, 'idestilo'), intranet = ovariables_estilo_new.estilointranet  ;

    _modalBody({
        url: 'GestionProducto/Estilo/_Migrar',
        ventana: '_migrar',
        titulo: 'Migrar Estilo a intranet',
        parametro: `idestilo:${idestilo},imagen:${ovariables_estilo_new.imagen}`,
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });
}
 
function retornar_index() {
    _ruteo_masgeneral('GestionProducto/Estilo/Index')
           .then((rpta) => {
               // nada
           }).catch(function (e) {
               console.log(e);
           });
}

function GetDatabyClient(event) {
    var frm = new FormData();
    let par = { idcliente: $("#cboCliente").val(), idgrupocomercial: ovariables_estilo_new.idgrupocomercial }
    //frm.append("par", JSON.stringify(par));
    //Post('GestionProducto/Estilo/ObtenerDatosCargaPorCliente', frm, ObtenerDatosCargaPorCliente);
    urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + JSON.stringify(par);
    Get(urlaccion, ObtenerDatosCargaPorCliente);
}

function ValidarCodigo() {
    let idcliente = _('cboCliente').value, idclientetemporada = _('cboSeason').value, codigo = $('#txtCode_estilo').val(), obj = { idcliente: idcliente, idclientetemporada: idclientetemporada, codigo: codigo }, form = new FormData(),
        urlaccion = "GestionProducto/Estilo/ValidarCodigo";

    form.append("par", JSON.stringify(obj));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {

            //Asigno el valor a variable global, para identificar que es nueva version del estilo
            ovariables_estilo_new.flgVersion = 1;
            let check = '<div class="form-group" style="color:red"><label> Si aceptas, este estilo será una versión del estilo original </label></div>',
            body = '<div class="row"><div class="form-group"><strong>Nota:</strong> El estilo ya existe para esta temporada</div>' + check + '</div>';
            swal({
                title: "Are you sure to save?",
                text: body,
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false
            }, function () {
                save_new_estilo();
                return;
            });
        }
        else {
            save_new_estilo();
        }
    });
}
 
function ejecutarmodalbuscartela() {
    let modal = $(this);
    modal.find('.modal-title').text('Search fabric');
    let urlaccion = 'GestionProducto/Estilo/_BuscarTela';
    _Get(urlaccion).then(function (vista) { $('#modal_bodybuscartela').html(vista) }, function (reason) { console.log('error', reason) }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function openModalBuscarTela() {
    let idcliente = _('cboCliente').value;
    if (idcliente == '') {
        _swal({ estado: 'error', mensaje: 'Seleccione al cliente.' });
        return false;
    }

    _('hf_accion_editartela').value = 'new';
    $('#modal_buscartela').modal('show');
}

function ejecutarmodalnewreq() {
    let modal = $(this);

    modal.find('.modal-title').text('New Requirement');

    let urlaccion = 'GestionProducto/Estilo/_NewReq';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodynewreq').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Estilo/_NewReq');
    });
}
function newreq() {
    //let idcliente = _('cboCliente').value;
    //if (idcliente == '' || parseInt(idcliente) <= 0) {
    //    _swal({ estado: 'error', mensaje: 'Seleccione el cliente.' });
    //    return false;
    //}
    $('#modal_newreq').modal('show');
}

function ejecutarmodalnewversion() {
    let modal = $(this);

    modal.find('.modal-title').text('New Version');

    let urlaccion = 'GestionProducto/Estilo/_Newversion';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodynewversion').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Estilo/_Newversion');
    });
}
function newversion() {   
    $('#modal_newversion').modal('show');
}
function ejecutarmodalcolor() {
    let modal = $(this);

    modal.find('.modal-title').text('Color');

    let urlaccion = 'GestionProducto/Estilo/_Color';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodycolor').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Estilo/_color');
    });
}
function color() {
    $('#modal_color').modal('show');
}

function AgregarCallout() {
    //var html = "<tr data-status='new'><td><textarea class='form-control CalloutComment' data-initial=''></textarea></td><td></td><td></td><td class='text-center'><span class='glyphicon glyphicon-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarCallout(this);'></span></td></tr>";

    ////<span class ="fa fa-times" title='Delete item' style="cursor:pointer;font-size:15px;color:red;" onclick="EliminarCallout(this);"></span>
    let html = `
        <tr data-status="new" data-id='0'>
            <td>
                <textarea class ="form-control CalloutComment"  data-initial=""></textarea>
            </td>
            <td></td>
            <td></td>
            <td class ="text-center" style='vertical-align: middle;'>
                <span class ="fa fa-times btn btn-sm btn-danger" title='Delete item' style="cursor:pointer;" onclick="EliminarCallout(this);"></span>
            </td>
        </tr>
    `;
    $("#tblCallout tbody").append(html);
}

function ValidarCallout() {
    var cont = 0;
    $("#tblCallout tbody tr").each(function () {
        var CalloutComment = $(this).find(".CalloutComment")[0].value;
        if (CalloutComment == "") {
            cont++;
        }
    });
    if (cont > 0) {
        return false;
    }
    return true;
}

function LimpiarArea() {
    $('#pasteArea').val('');
}
function LimpiarAreaFabric() {
    $('#pasteAreaFabric').val('');
}
function EliminarCallout(obj) {
    $(obj).closest('tr').remove();
}
function EliminarProcessColor(obj) {
    $(obj).closest('tr').remove();
}
function EliminarFabricProcess(obj) {
    $(obj).closest('tr').remove();
}
function EliminarTrimColor(obj) {
    $(obj).closest('tr').remove();
    let divtrimcontenedorprincipal = obj.getAttribute('data-divtrimcontenedorprincipal')
    validarsihaycoloresparagrabar(divtrimcontenedorprincipal);
}

function validarsihaycoloresparagrabar(iddivtrim) {
    let divtrimsecundario = document.getElementById(iddivtrim), tblcolor = divtrimsecundario.getElementsByClassName('cls_tbody_color')[0],
            arr_rows = Array.from(tblcolor.rows), idtrim = divtrimsecundario.getAttribute('data-idtrim'), estatdo_grabartrimcolor = false;

    arr_rows.forEach(x => {
        let idtrimcolor = x.getAttribute('data-idtrimcolor'); // SI LA FILA DE COLOR NO TIENE EL IDTRIMCOLOR ENTONCES ES NUEVO, SE DEBE GRABAR A LA MAESTRA
        if (idtrimcolor == 0) {
            estatdo_grabartrimcolor = true;
            //return true;
        } else {
            let btndel = x.getElementsByClassName('cls_btn_deletecolor')[0];
            if (btndel) {
                btndel.classList.add('hide');
            }
        }
    });
    if (estatdo_grabartrimcolor === false) {  // SI NO HAY COLORES PARA AGREGAR AL TRIM ESCONDER EL BOTON SAVE TRIM
        _(iddivtrim).getElementsByClassName('cls_btn_save_trim_color')[0].classList.add('hide');
    }
    return estatdo_grabartrimcolor;
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
function MostrarImagen_combo(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgEstilo_fabric').attr('src', e.target.result);
            _('hf_estado_actualizarimagenFabricCombo').value = "1";
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function AbrirModalFabricProject() {
    var nFabric = $(".divFabric").length;
    if (nFabric == 1 && ValidarFabricProjectSinDatos()) {
        $('#mdFabricProject').modal('show');

    } else {
        if (ValidarFabricProject()) {
            $('#mdFabricProject').modal('show');

        } else {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
        }
    }
}
function AbrirModalFabricCode() {
    var nFabric = $(".divFabric").length;
    if (nFabric == 1 && ValidarFabricProjectSinDatos()) {
        $('#mdFabricCode').modal('show');
    } else {
        if (ValidarFabricProject()) {
            $('#mdFabricCode').modal('show');
        } else {
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
        }
    }
}
function BuscarTelasPorFamilia(data) {
    if (data != null) {
        var Tela = JSON.parse(data);
        var nTela = Tela.length;
        if (nTela > 0) {
            $("#divtblFabricCode").remove();
            var html = "<div id='divtblFabricCode'><table id='tblFabricCode' class='table table-bordered table-hover'><thead><tr><th>Id</th><th>Code</th><th>Family</th><th>Title</th><th>Content</th><th>Weight</th><th>Wash</th><th>Supplier</th></tr></thead><tbody>";
            for (var i = 0; i < nTela; i++) {
                html += "<tr ondblclick='AgregarCodigoTela(this)'>";
                html += "<td>" + Tela[i].IdFichaTecnica + "</td>";
                html += "<td>" + Tela[i].CodigoTela + "</td>";
                html += "<td>" + Tela[i].NombreFamilia + "</td>";
                html += "<td>" + Tela[i].Titulo + "</td>";
                html += "<td>" + Tela[i].DescripcionPorcentajeContenidoTela + "</td>";
                html += "<td>" + Tela[i].Weight + "</td>";
                html += "<td>" + Tela[i].Lavado + "</td>";
                html += "<td>" + Tela[i].NombreProveedor + "</td>";
                html += "</tr>";
            }
            html += "</tbody></table></div>";
            $("#divFabricCode").append(html);

            $('#tblFabricCode').DataTable({
                paging: true,
                fixedHeader: true,
                "scrollY": 300,
                "scrollX": true,
                scrollCollapse: true//,
            });
        }
    }
}

function ValidarFabricProject() {
    var cont = 0;
    var contFabric = 0;
    var ndivFabric = $(".divFabric").length;
    $(".divFabric").each(function () {
        var FabricId = $(this).find(".FabricId")[0].value;
        var FabricReference = $(this).find(".FabricReference")[0].value; // Puede estar vacio FabricId
        var FabricPlacement = $(this).find(".FabricPlacement")[0].value;
        var FabricConstruction = $(this).find(".FabricConstruction")[0].value;
        var FabricYarn = $(this).find(".FabricYarn")[0].value;
        var FabricContent = $(this).find(".FabricContent")[0].value;
        var Fabricweight = $(this).find(".Fabricweight")[0].value;
        var FabricLavado = $(this).find(".FabricLavado")[0].value;
        var FabricStatus = $(this).find(".FabricStatus")[0].value;
        var FabricComent = $(this).find(".FabricComent")[0].value;
        var FabricSupplierCBO = $(this).find(".FabricSupplierCBO")[0].value;
        var FabricSupplierTXT = $(this).find(".FabricSupplierTXT")[0].value;

        if (contFabric == 0 && FabricId == 0) {// Si es Tela 1 y es Fabric Project
            // Campos requeridos para la Tela 1 
            if (FabricPlacement == "" || FabricConstruction == "" || FabricYarn == "" || FabricContent == "" || Fabricweight == "" || (FabricSupplierCBO == "" && FabricSupplierTXT == "")) {
                cont++;
            }
        } else {
            // Si todo esta vacio o por default
            if ((FabricPlacement == "") && (FabricConstruction == "") && (FabricYarn == "") && (FabricContent == "") && (Fabricweight == "") && (FabricLavado == "AW") && (FabricStatus == "P") && (FabricComent == "") && (FabricSupplierCBO == "" || FabricSupplierTXT == "")) {
                cont++;
            }
        }
        contFabric++;
    });

    if (ndivFabric == cont) {
        return 1;
    }
    if (cont > 0) {
        return 2;
    }
    return 3;
}

function ValidarFabricProjectSinDatos() {
    var cont = 0;
    $(".divFabric").each(function () {
        var FabricReference = $(this).find(".FabricReference")[0].value;
        var FabricPlacement = $(this).find(".FabricPlacement")[0].value;
        var FabricConstruction = $(this).find(".FabricConstruction")[0].value;
        var FabricYarn = $(this).find(".FabricYarn")[0].value;
        var FabricContent = $(this).find(".FabricContent")[0].value;
        var Fabricweight = $(this).find(".Fabricweight")[0].value;
        var FabricLavado = $(this).find(".FabricLavado")[0].value;

        var FabricStatus = $(this).find(".FabricStatus")[0].value;
        var FabricComent = $(this).find(".FabricComent")[0].value;
        var FabricSupplierCBO = $(this).find(".FabricSupplierCBO")[0].value;
        var FabricSupplierTXT = $(this).find(".FabricSupplierTXT")[0].value;
        if (FabricReference == "" && (FabricPlacement == "" || FabricPlacement == "Body") && FabricConstruction == "" && FabricYarn == "" && FabricContent == "" && Fabricweight == "" && FabricComent == "" && FabricSupplierCBO == "" && FabricSupplierTXT == "") {
            cont++;
        }
        var divProcess = $(this).attr("data-divProcess");
        var nProcess = $("#" + divProcess + " table >tbody >tr").length;
        if (nProcess > 0) {
            $("#" + divProcess + " table >tbody >tr").each(function () {
                var Process = $(this.cells[0]).find("select")[0].value;
                var Comment = $(this.cells[1]).find("input")[0].value;
                if (Process == "" && Comment == "") {
                    cont++;
                }
            });
        }
        //return false;
    });
    if (cont > 0) {
        return true;
    }
    return false;
}

function AgregarFabric() {
    var html = $("#divFabric1").html();
    var contadorFabric = parseInt($("#hfFabricContador").val()) + 1;
    $("#hfFabricContador").val(contadorFabric);
    var divId = "divFabric" + contadorFabric;
    var divFabricProcess = "divFabricProcess" + contadorFabric;
    html = html.replace('value="Body" readonly', "");
    html = html.replace('data-div=""', 'data-div="' + divId + '"');
    html = html.replace(/divFabricProcess1/g, divFabricProcess);
    html = "<div id='" + divId + "' class='form-horizontal divFabric' data-id='0' data-divProcess='" + divFabricProcess + "'  style='float:left;margin-top:15px;margin-left:15px;width:60%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
    $("#divFabric").append(html);
    return divId;
}

function AgregarCodigoTela(obj) {
    var row = obj;
    var IdFichaTecnica = $(row.cells[0]).text();
    var FabricReference = $(row.cells[1]).text();
    var FabricConstruction = $(row.cells[2]).text();
    var FabricYarn = $(row.cells[3]).text();
    var FabricContent = $(row.cells[4]).text();
    var Fabricweight = $(row.cells[5]).text();
    var FabricLavado = $(row.cells[6]).text();
    var FabricSupplier = $(row.cells[7]).text();

    var divId = "";
    var nFabric = $(".divFabric").length;

    if (nFabric == 1 && ValidarTela1SinDatos()) {
        divId = "divFabric1";
    } else if (ValidarFabricProject()) {
        divId = AgregarFabric();
    }

    if (divId != "") {
        $("#" + divId).find(".FabricId")[0].value = IdFichaTecnica;
        $("#" + divId).find(".FabricReference")[0].value = FabricReference;
        $("#" + divId).find(".FabricConstruction")[0].value = FabricConstruction;
        $("#" + divId).find(".FabricYarn")[0].value = FabricYarn;
        $("#" + divId).find(".FabricContent")[0].value = FabricContent;
        $("#" + divId).find(".Fabricweight")[0].value = Fabricweight;
        $("#" + divId).find(".FabricLavado")[0].value = FabricLavado;
        $("#" + divId).find(".FabricSupplierTXT").show();
        $("#" + divId).find(".FabricSupplierTXT")[0].value = FabricSupplier;
        $("#" + divId).find(".FabricSupplierCBO").hide();
        $("#" + divId).find(".FabricSupplierCBO").val("");
        // Setting readonly
        $("#" + divId).find(".FabricConstruction").prop('readonly', true);
        $("#" + divId).find(".FabricYarn").prop('readonly', true);
        $("#" + divId).find(".FabricContent").prop('readonly', true);
        $("#" + divId).find(".Fabricweight").prop('readonly', true);
        $("#" + divId).find(".FabricLavado").prop('disabled', 'disabled');

        $("#" + divId).find(".FabricProcessContent").hide();

        $("#" + divId + " .lblSupplierReq").hide();
        $("#" + divId + " .lblPlacementReq").hide();
        $("#" + divId + " .lblConstructionReq").hide();
        $("#" + divId + " .lblYarnReq").hide();
        $("#" + divId + " .lblContentReq").hide();
        $("#" + divId + " .lblWeightReq").hide();

        $("#btnCloseFabricCode").trigger("click");
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function AgregarFabricProject() {
    if (ValidarFabricProject()) {
        var divId = AgregarFabric();
        $("#" + divId + " .FabricId").val("0");
        $("#" + divId + " .FabricConstruction").prop('readonly', false);
        $("#" + divId + " .FabricYarn").prop('readonly', false);
        $("#" + divId + " .FabricContent").prop('readonly', false);
        $("#" + divId + " .Fabricweight").prop('readonly', false);
        $("#" + divId + " .FabricLavado").removeAttr('disabled');

        $("#" + divId + " .FabricSupplierCBO").show();
        $("#" + divId + " .FabricSupplierCBO").val("");
        $("#" + divId + " .FabricSupplierTXT").hide();
        $("#" + divId + " .FabricSupplierTXT").val("");
        $("#" + divId + " .lblSupplierReq").hide();
        $("#" + divId + " .lblPlacementReq").hide();
        $("#" + divId + " .lblConstructionReq").hide();
        $("#" + divId + " .lblYarnReq").hide();
        $("#" + divId + " .lblContentReq").hide();
        $("#" + divId + " .lblWeightReq").hide();
        $("#" + divId + " .FabricProcessContent").show();
        var divFabricProcess = $("#" + divId).attr("data-divProcess");
        $("#" + divFabricProcess).find("table tbody").empty();
    } else {
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
    }
}

function ValidarCombo() {
    var cont = 0;    
    let nCombo = 0;    
    $(".divCombo").each(function () {
        let divsinhide = this.classList.value.indexOf('hidecombo');
        if (divsinhide < 0) {
            var ComboDescription = $(this).find(".ComboDescription")[0].value;
          
            if (ComboDescription == "") {
                this.getElementsByClassName('clsgrupodescripcion_combo')[0].classList.add('has-error');
                cont++;
            } else {
                this.getElementsByClassName('clsgrupodescripcion_combo')[0].classList.remove('has-error');
            }

            var divColor = $(this).attr("data-divcolor");
            var nColor = $("#" + divColor + " table >tbody >tr").length;
            if (nColor > 0) {
                $("#" + divColor + " table >tbody >tr").each(function () {
                    var Color = $(this.cells[2]).find("input")[0].value;                   
                    if (Color == "") {
                        cont++;
                    }
                });
            }
        }
    });   
    if (cont > 0) {
        return 2;
    }
    return 3;
}
function ValidarFabricCombo() {
    var cont = 0;
    let nCombo = 0;
    $(".divFabricCombo").each(function () {
        let divsinhide = this.classList.value.indexOf('hideFabriccombo');
        if (divsinhide < 0) {
            var ComboDescription = $(this).find(".ComboFabricDescription")[0].value;

            if (ComboDescription == "") {
                this.getElementsByClassName('clsgrupodescripcion_Fabriccombo')[0].classList.add('has-error');
                cont++;
            } else {
                this.getElementsByClassName('clsgrupodescripcion_Fabriccombo')[0].classList.remove('has-error');
            }

            var divColor = $(this).attr("data-divcolor");
            var nColor = $("#" + divColor + " table >tbody >tr").length;
            if (nColor > 0) {
                $("#" + divColor + " table >tbody >tr").each(function () {
                    var Color = $(this.cells[0]).find("input")[0].value;
                    if (Color == "") {
                        cont++;
                    }
                });
            }
        }
    });
    if (cont > 0) {
        return 2;
    }
    return 3;
}
function AgregarFabricCombo() {
    var Validar = ValidarFabricCombo();
    switch (Validar) {
        case 1:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 2:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 3:

            let divCombo = _('divFabricCombo');
            let html = divCombo.getElementsByClassName('hideFabriccombo')[0].outerHTML;
            let totaldivhijos = divCombo.getElementsByClassName('_clsdivFabricCombo').length;

            var contadorProcess = parseInt($("#hfFabricComboContador").val()) + 1;
            $("#hfFabricComboContador").val(contadorProcess);
            var divId = "divFabricCombo" + contadorProcess;
            var divComboColor = "divFabricComboColor" + contadorProcess;
            var txt = "txtDescriptionFabric" + contadorProcess;
            var idbtn = "btnFCombo" + contadorProcess;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace('data-btn=""', 'data-btn="' + contadorProcess + '"');
            html = html.replace(/divFabricComboColor1/g, divComboColor);
            html = html.replace(/txtDescriptionFabric1/g, txt);
            html = html.replace(/btnFCombo1/g, idbtn);
            $("#divFabricCombo").append(html);
            let ultimodiv = _('divFabricCombo').lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hideFabriccombo');
            let eleh = ultimodiv.getElementsByTagName('h3')[0];
            eleh.innerText = 'Fabric Combo ' + totaldivhijos;
            $("#" + divComboColor).find("table tbody").empty();
            break;
    }
}

function AgregarCombo() {
    var Validar = ValidarCombo();
    switch (Validar) {
        case 1:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 2:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 3:
           
            let divCombo = _('divCombo');
            let html = divCombo.getElementsByClassName('hidecombo')[0].outerHTML;
            let totaldivhijos = divCombo.getElementsByClassName('_clsdivCombo').length;

            var contadorProcess = parseInt($("#hfComboContador").val()) + 1;
            $("#hfComboContador").val(contadorProcess);
            var divId = "divCombo" + contadorProcess;
            var divComboColor = "divComboColor" + contadorProcess;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace(/divComboColor1/g, divComboColor);
            $("#divCombo").append(html);
            let ultimodiv = _('divCombo').lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hidecombo');
            let eleh = ultimodiv.getElementsByTagName('h3')[0];
            eleh.innerText = 'Combo ' + totaldivhijos;
            $("#" + divComboColor).find("table tbody").empty();            
            break;
    }
}
 
function ValidarProceso() {
    var cont = 0;
    //var nProceso = $('#divProcess').not('.hideproceso').length; //$(".divProcess").length;
    let nProceso = 0;
    //let divpadrecontenedor = _('divProcess'), arraydivhijo = _Array(divpadrecontenedor.getElementsByClassName('_clsdivproceso'));

    //arraydivhijo.forEach(x => {
    //    if (x.classList.value.indexOf('hideproceso') < 0) {
    //        nProceso++;
    //    }
    //});

    $(".divProcess").each(function () {
        let divsinhide = this.classList.value.indexOf('hideproceso');
        if (divsinhide < 0) {
            var ProcessDescription = $(this).find(".ProcessDescription")[0].value;
            var ProcessSupplier = $(this).find(".ProcessSupplier")[0].value;
            var ProcessStatus = $(this).find(".ProcessStatus")[0].value;
            var ProcessComment = $(this).find(".ProcessComment")[0].value;
            var ProcessCost = $(this).find(".ProcessCost")[0].value;
            var ProcessCostType = $(this).find(".ProcessCostType")[0].value;

            //if (nProceso > 1) {
            //    if (ProcessDescription == "" /*&& ProcessSupplier == "" && ProcessComment == "" && ProcessCost == ""*/) {
            //        this.getElementsByClassName('clsgrupodescripcion_proceso')[0].classList.add('has-error');
            //        cont++;
            //    }
            //}

            if (ProcessDescription == "" /*&& ProcessSupplier == "" && ProcessComment == "" && ProcessCost == ""*/) {
                this.getElementsByClassName('clsgrupodescripcion_proceso')[0].classList.add('has-error');
                cont++;
            } else {
                this.getElementsByClassName('clsgrupodescripcion_proceso')[0].classList.remove('has-error');
            }

            var divColor = $(this).attr("data-divcolor");
            var nColor = $("#" + divColor + " table >tbody >tr").length;
            if (nColor > 0) {
                $("#" + divColor + " table >tbody >tr").each(function () {
                    var Color = $(this.cells[0]).find("input")[0].value;
                    var Status = $(this.cells[1]).find("select")[0].value;
                    var Comment = $(this.cells[2]).find("input")[0].value;
                    if (Color == "") {
                        cont++;
                    }
                });
            }
        }
    });
    //if (nProceso == cont) {
    //    return 1;
    //}
    if (cont > 0) {
        return 2;
    }
    return 3;
}

function AgregarProceso() {
    var Validar = ValidarProceso();
    switch (Validar) {
        case 1:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 2:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 3:
            //var html = $("#divProcess").html();
            let divproceso = _('divProcess');
            let html = divproceso.getElementsByClassName('hideproceso')[0].outerHTML;
            let totaldivhijos = divproceso.getElementsByClassName('_clsdivproceso').length;

            var contadorProcess = parseInt($("#hfProcesoContador").val()) + 1;
            $("#hfProcesoContador").val(contadorProcess);
            var divId = "divProcess" + contadorProcess;
            var divProcessColor = "divProcesoColor" + contadorProcess;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace(/divProcesoColor1/g, divProcessColor);
            //html = "<div id='" + divId + "' class='form-horizontal divProcess' style='float:left;margin-top:15px;margin-left:15px;width:60%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
            // ya no va html = "<div id='" + divId + "'>" + html + "</div>";
            $("#divProcess").append(html);
            let ultimodiv = _('divProcess').lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hideproceso');
            let eleh = ultimodiv.getElementsByTagName('h3')[0];
            eleh.innerText = 'Process ' + totaldivhijos;

            $("#" + divProcessColor).find("table tbody").empty();
            $("#" + divId + " #cboProcessSupplier").select2();
            break;
    }
}

function ValidarArtWork() {
    var cont = 0;
    //var nArtwork = $('#divArtwork').not('.hideatwork').length; //$(".divArtwork").length;
    let nArtwork = 0;
    //let divpadrecontenedor = _('divArtwork'), arraydivhijo = _Array(divpadrecontenedor.getElementsByClassName('_clsdivatwork'));

    //arraydivhijo.forEach(x => {
    //    if (x.classList.value.indexOf('hideatwork') < 0) {
    //        nArtwork++;
    //    }
    //});

    $(".divArtwork").each(function () {
        let divshide = this.classList.value.indexOf('hideatwork');
        if (divshide < 0) {
            var ArtworkDescription = $(this).find(".ArtworkDescription")[0].value;
            var ArtworkTechnique = $(this).find(".ArtworkTechnique")[0].value;
            var ArtworkPlacement = $(this).find(".ArtworkPlacement")[0].value;
            var ArtworkSupplier = $(this).find(".ArtworkSupplier")[0].value;
            var ArtworkStatus = $(this).find(".ArtworkStatus")[0].value;
            var ArtworkComment = $(this).find(".ArtworkComment")[0].value;
            var ArtworkCost = $(this).find(".ArtworkCost")[0].value;

            //if (nArtwork > 1) {
            //    if (ArtworkDescription == "" /* && ArtworkTechnique == "" && ArtworkPlacement == "" && ArtworkSupplier == "" && ArtworkComment == "" && ArtworkCost == ""*/) {
            //        this.getElementsByClassName('clsgrupodescripcion_artwork')[0].classList.add('has-error');
            //        cont++;
            //    }
            //}
            if (ArtworkDescription == "" /* && ArtworkTechnique == "" && ArtworkPlacement == "" && ArtworkSupplier == "" && ArtworkComment == "" && ArtworkCost == ""*/) {
                this.getElementsByClassName('clsgrupodescripcion_artwork')[0].classList.add('has-error');
                cont++;
            } else {
                this.getElementsByClassName('clsgrupodescripcion_artwork')[0].classList.remove('has-error');
            }

            var divColor = $(this).attr("data-divcolor");
            var nColor = $("#" + divColor + " table >tbody >tr").length;
            if (nColor > 0) {
                $("#" + divColor + " table >tbody >tr").each(function () {
                    var Color = $(this.cells[0]).find("input")[0].value;
                    var Status = $(this.cells[1]).find("select")[0].value;
                    var Comment = $(this.cells[2]).find("input")[0].value;
                    if (Color == "" /*&& Comment == ""*/) {
                        cont++;
                    }
                });
            }
        }
    });
    //if (nArtwork == cont) {
    //    return 1;
    //}
    if (cont > 0) {
        return 2;
    }
    return 3;
}

function AgregarArtwork() {
    var Validar = ValidarArtWork();
    switch (Validar) {
        case 1:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 2:
            var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
            _mensaje(objmensaje);
            break;
        case 3:
            //var html = $("#divArtwork1").html();
            let divatwork = _('divArtwork');
            let html = divatwork.getElementsByClassName('hideatwork')[0].outerHTML;
            let totaldivhijos = divatwork.getElementsByClassName('_clsdivatwork').length;


            var contadorArtwork = parseInt($("#hfArtworkContador").val()) + 1;
            $("#hfArtworkContador").val(contadorArtwork);
            var divId = "divArtwork" + contadorArtwork;
            var divArtworkColor = "divArtworkColor" + contadorArtwork;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace(/divArtworkColor1/g, divArtworkColor);
            //html = "<div id='" + divId + "' class='form-horizontal divArtwork' data-divcolor='" + divArtworkColor + "' style='float:left;margin-top:15px;margin-left:15px;width:60%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
            $("#divArtwork").append(html);

            let ultimodiv = _('divArtwork').lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hideatwork');
            let eleh = ultimodiv.getElementsByTagName('h3')[0];
            eleh.innerText = 'Artwork ' + totaldivhijos;

            $("#" + divArtworkColor).find("table tbody").empty();
            $("#" + divId + " #cboArtworkSupplier").select2();
            break;
    }
}
function ValidarTrim() {
    var cont = 0, pasavalidacion = true, pasavalidacion_trimporgrabar = true, mensaje = '', contador = 0, pasavalidacionrequeridos = true,
        pasavalidacion_requeridos_color = true;
    //var nTrim = $('#divTrim').not('.hidetrim').length; //$(".divTrim").length;
    let nTrim = 0;
    //let divpadrecontenedor = _('divTrim'), arraydivhijo = _Array(divpadrecontenedor.getElementsByClassName('_clsdivtriim'));

    //arraydivhijo.forEach(x => {
    //    if (x.classList.value.indexOf('hidetrim') < 0) {
    //        nTrim++;
    //    }
    //});

    $(".divTrim").each(function () {
        contador++;
        let divshide = this.classList.value.indexOf('hidetrim');
        if (divshide < 0) {
            let TrimCode = $(this).find(".TrimCode")[0].value, TrimDescription = $(this).find(".TrimDescription")[0].value,
                TrimPlacement = $(this).find(".TrimPlacement")[0].value, TrimSupplier = $(this).find(".TrimSupplier")[0].value,
                TrimStatus = $(this).find(".TrimStatus")[0].value, TrimComment = $(this).find(".TrimComment")[0].value, 
                TrimCost = $(this).find(".TrimCost")[0].value, TrimCostType = $(this).find(".TrimCostType")[0].value,
                TrimIncoterm = $(this).find(".TrimIncoterm")[0].value;

            
            if (TrimDescription == ""/* && TrimDescription == "" && TrimPlacement == "" && TrimSupplier == "" && TrimComment == "" && TrimCost == "" && TrimIncoterm == "" */) {
                this.getElementsByClassName('clsgrupodescripcion_trim')[0].classList.add('has-error');
                pasavalidacion = false;
                pasavalidacionrequeridos = false;
                mensaje += '- La descripción es obligatorio. \n';
                cont++;
            } else {
                this.getElementsByClassName('clsgrupodescripcion_trim')[0].classList.remove('has-error');
            }

            var divColor = $(this).attr("data-divcolor");
            var nColor = $("#" + divColor + " table >tbody >tr").length;
            if (nColor > 0) {
                $("#" + divColor + " table >tbody >tr").each(function () {
                    var Color = $(this.cells[0]).find("input")[0].value;
                    var Status = $(this.cells[1]).find("select")[0].value;
                    var Comment = $(this.cells[2]).find("input")[0].value;
                    if (Color == "" && Comment == "") {
                        pasavalidacion = false;
                        pasavalidacion_requeridos_color = false;
                        mensaje += '- Falta el color y el comentario de colores. \n';
                        cont++;
                    }
                });
            }

            let arr_botonvisibles = Array.from(this.getElementsByClassName('cls_btn_save_trim_color hide'));
            if (arr_botonvisibles.length <= 0) {  // ENCONTRO BOTON GRABAR TRIM VISBLE
                pasavalidacion_trimporgrabar = false;
                pasavalidacion = false;
                mensaje += '- Falta grabar el trim #' + contador + ' \n';
        }
        }
        
    });
    
    if (mensaje !== '') {
        swal({ type:'error', title:'Message', text: mensaje });
    }
    
    return pasavalidacion;
    }

function AgregarTrim() {
    //// ACA BUSCAR EL TRIM 
    let cbocliente = _('cboCliente'), cboclientedivision = _('cboDivision'), idcliente = cbocliente.value, idclientedivision = cboclientedivision.value, nombrecliente = cbocliente.options[cbocliente.selectedIndex].text,
        nombreclientedivision = cboclientedivision.options[cboclientedivision.selectedIndex].text;

    if (idcliente <= 0 || idcliente == '') {
        swal({ title: 'Message', text: 'Falta seleccionar al cliente', type: 'erro' });
        return false;
    }

    _modalBody({
        url: 'GestionProducto/Estilo/_BuscarTrim',
        ventana: '_BuscarTrim',
        titulo: 'Search trim',
        parametro: `idcliente:${idcliente},idclientedivision:${idclientedivision},nombrecliente:${nombrecliente},nombreclientedivision:${nombreclientedivision}`,
        ancho: '1000',
        alto: ''
    });

    
    }

function pintar_trims_seleccionados_buscartrim(odatatrims) {
    if (odatatrims !== null) {
        let trims = JSON.parse(odatatrims[0].trims), trimscolor = CSVtoJSON(odatatrims[0].colorestrim), html = '', elementiddivtrim = _('divTrim'),
            arrdivtrim = Array.from(elementiddivtrim.getElementsByClassName('divTrim')), totaldivstrimprincipales = arrdivtrim.length, contador = totaldivstrimprincipales,
            lsttemp_div = [];
        trims.forEach((dtrim, i) => {
            contador = contador + 1;
            let iddivtrim = `divTrim${contador}`, iddivtrimcolor = `divTrimColor${contador}`;
            let objtemp_div = { iddivtrim: iddivtrim };
            lsttemp_div.push(objtemp_div);
            html += `
                    <div class ="col-sm-6 _clsdivtriim divTrim" id="${iddivtrim}" data-divcolor="${iddivtrimcolor}" data-idtrim='${dtrim.idtrim}' data-id='0'>
                        <div class ="panel panel-default">
                            <div class ="panel-heading">
                                <div class ="row" style="vertical-align: middle;">
                                    <div class ="col-sm-6">
                                        <h3>Trim ${contador}</h3>
                                    </div>
                                    <div class ="col-sm-6 text-right">
                                        <button class ='btn btn-info btn-sm cls_btn_editar_trim_color' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class ='fa fa-pencil-square-o'></span>
                                            Edit
                                        </button>
                                        <button class ='btn btn-default btn-sm cls_btn_cancelar_trim_color hide' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class =''></span>
                                            Cancel
                                        </button>
                                        <button class ='btn btn-primary btn-sm cls_btn_save_trim_color hide' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class ='fa fa-floppy-o'></span>
                                            Save
                                        </button>
                                        <button class ="btn btn-danger btn-sm" type="button" onclick='EliminarTrim(this)'>
                                            <span class ="fa fa-trash-o"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class ="panel-body">
                                <div class ="form-horizontal" data-type="">
                                    <div class ="form-group clsgrupodescripcion_trim">
                                        <div class ="col-sm-3 control-label">
                                            <label>*Description: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <textarea name="txtDescription" onkeyup="Mayus(this)"  class ="form-control TrimDescription _enty_trim" rows="2" disabled='disabled' data-initial='${dtrim.descripcion}' data-required='true' data-min='1' data-max='8000' data-id='descripcion'>${dtrim.descripcion}</textarea>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Code: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <textarea name="txtCode" onkeyup="Mayus(this)"  class ="form-control TrimCode _enty_trim" rows="2" disabled='disabled' data-initial='${dtrim.codigo}' data-required='false' data-min='1' data-max='300' data-id='codigo'>${dtrim.codigo}</textarea>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Placement: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtPlacement" onkeyup="Mayus(this)"  class ="form-control TrimPlacement _enty_trim" value='${dtrim.placement}' data-initial='${dtrim.placement}' data-required='false' data-min='1' data-max='300' data-id='placement'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Supplier: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input type="text" onkeyup="Mayus(this)"   class ="form-control TrimSupplier _enty_trim" value='${dtrim.proveedor}' disabled='disabled' data-initial='${dtrim.proveedor}' data-required='false' data-min='1' data-max='300' data-id='proveedor'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Type provider: </label>
                                        </div>
                                        <div class ="col-sm-8 cls_div_trim_tipoproveedor" data-idtipoproveedor='${dtrim.tipoproveedor}'>
                                            <select class ="form-control _enty_trim cls_tipoproveedor_trim" id="cbo_tipoproveedor" data-required="false" data-min="1" data-max="20" data-id="tipoproveedor" disabled='disabled'>
                                                <option value=" ">Select</option>
                                                <option value="Local">Local</option>
                                                <option value="Importado">Importado</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Status: </label>
                                        </div>
                                        <div class ="col-sm-8 cls_div_trim_idstatus" data-idstatus='${dtrim.status}'>
                                            <select id="cboStatusTrim" class ="form-control TrimStatus _enty_trim" disabled='disabled' data-initial='${dtrim.status}' data-required='false' data-min='1' data-max='100' data-id='status'>

                                            </select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Incoterm: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtIncoterm" onkeyup="Mayus(this)"  class ="form-control TrimIncoterm _enty_trim" value='${dtrim.incoterm}' disabled='disabled' data-initial='${dtrim.incoterm}' data-required='false' data-min='1' data-max='300' data-id='incoterm'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Comment: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtComent" onkeyup="Mayus(this)"  class ="form-control TrimComment _enty_trim" value='${dtrim.comment}' disabled='disabled' data-initial='${dtrim.comment}' data-required='false' data-min='1' data-max='300' data-id='comment'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Cost: </label>
                                        </div>
                                        <div class ="col-sm-3">
                                            <input name="txtCost" value="0" onkeypress="return DigitimosDecimales(event,this)" onblur="ValidarNumero(this);" class ="form-control TrimCost _enty_trim" value='${dtrim.costo}' disabled='disabled' data-initial='${dtrim.costo}' data-required='false' data-min='1' data-max='18' data-id='costo' data-type='dec'/>
                                        </div>
                                        <div class ="col-sm-3 cls_div_trim_idunidadmedida" data-idunidadmedida='${dtrim.costouom}'>
                                            <select id="cboTrimUnidadMedida" class ="form-control TrimCostType _enty_trim" disabled='disabled' data-initial='${dtrim.costouom}' data-required='false' data-min='1' data-max='20' data-id='costouom'></select>
                                        </div>
                                        <div class ="col-sm-2 cls_div_trim_idmoneda" data-idmoneda='${dtrim.costomoneda}'>
                                            <select id="cboTrimMoneda" class ="form-control TrimMoneda _enty_trim" disabled='disabled' data-initial='${dtrim.costomoneda}' data-required='false' data-min='1' data-max='20' data-id='costomoneda'></select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-offset-2 col-sm-10">
                                            <button type="button" class ="btn btn-primary" name="btnAddTrimColor" data-divcolor="${iddivtrimcolor}" data-divtrimcontenedorprincipal='${iddivtrim}' onclick="AgregarColorTrim(this);">Add Color</button>
                                        </div>
                                    </div>
                                    <div id="${iddivtrimcolor}">
                                        <table class ="table table-hover table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Color (*) </th>
                                                    <th>Status</th>
                                                    <th>Comment </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody class ='cls_tbody_color'>
                                                `;

            // BOTON DEL COLOR
            //<button type='button' class ='btn btn-xs btn-outline btn-danger' data-divcolor="${iddivtrimcolor}" data-divtrimcontenedorprincipal='${iddivtrim}' onclick="EliminarTrimColor(this);">
            //    <span class ='fa fa-trash-o'></span>
            //</button>
            let coloresfiltrados = trimscolor.filter(xf => xf.idtrim == dtrim.idtrim );
            if (coloresfiltrados.length > 0) {
                coloresfiltrados.forEach((dcolor, xi) => {
                    let idtrimcolor = dcolor.idtrimcolor;
                    html += `
                            <tr data-status="old" data-id="0" data-idestadocolor='${dcolor.status}' data-idtrim='${dtrim.idtrim}' data-idtrimcolor='${dcolor.idtrimcolor}'>
                                <td>
                                    <input type="text" class ="form-control Color" value="${dcolor.color}" data-initial="${dcolor.color}" disabled='disabled'>
                                </td>
                                <td>
                                    <select data-initial="${dcolor.status}" class ="form-control StatusColor" disabled='disabled'>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class ="form-control cls_comentario" data-initial="${dcolor.comentario}" value="${dcolor.comentario}" disabled='disabled'/>
                                </td>
                                <td class ="text-center" style='vertical-align: middle;'>
                                    <div class='input-group'>
                                        <span class='input-group-addon'>
                                            <input type='checkbox' class ='cls_chk_trim_colorselect' style='width: 20px; height:20px;' value=''/>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        `;
                });
}

            html +=
                                                `
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        });
        _('divTrim').insertAdjacentHTML('beforeend', html);
        cargargarcombos_cuandoseagrega(lsttemp_div);
        handler_divtrim_add(lsttemp_div);
    }
}

function cargargarcombos_cuandoseagrega(listatemp_iddivtrim_agregados) {
    listatemp_iddivtrim_agregados.forEach((x, i) => {
        let divtrim = _('divTrim'), divtrimsecundario = document.getElementById(x.iddivtrim), cboestado = divtrimsecundario.getElementsByClassName('TrimStatus')[0],
            cbounidadmedida = divtrimsecundario.getElementsByClassName('TrimCostType')[0],
            cbotipomoneda = divtrimsecundario.getElementsByClassName('TrimMoneda')[0],
            cbotipoproveedor = divtrimsecundario.getElementsByClassName('cls_tipoproveedor_trim')[0],
            idestado = divtrimsecundario.getElementsByClassName('cls_div_trim_idstatus')[0].getAttribute('data-idstatus'),
            idunidadmedida = divtrimsecundario.getElementsByClassName('cls_div_trim_idunidadmedida')[0].getAttribute('data-idunidadmedida'),
            idtipomoneda = divtrimsecundario.getElementsByClassName('cls_div_trim_idmoneda')[0].getAttribute('data-idmoneda'),
            idtipoproveedor = divtrimsecundario.getElementsByClassName('cls_div_trim_tipoproveedor')[0].getAttribute('data-idtipoproveedor');;

        cboestado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_estados_combo, 'ValorEstado', 'NombreEstado');
        cboestado.value = idestado;
        cbounidadmedida.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_unidadmedida_combo, 'IdUnidadMedida', 'Simbolo');
        cbounidadmedida.value = idunidadmedida;
        cbotipomoneda.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_tipomoneda_combo, 'IdMoneda', 'Codigo');
        cbotipomoneda.value = idtipomoneda;
        cbotipoproveedor.value = idtipoproveedor;

        // combo estado color
        let tblcolor = divtrimsecundario.getElementsByClassName('cls_tbody_color')[0], arrrows = Array.from(tblcolor.rows);
        arrrows.forEach((ele, row) => {
            let cboestadocolor = ele.getElementsByClassName('StatusColor')[0], idestadocolor = ele.getAttribute('data-idestadocolor');
            cboestadocolor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_estados_combo, 'ValorEstado', 'NombreEstado');
            cboestadocolor.value = idestadocolor;
        });
    });
}

function cargargarcomboTablaColor_add(fila, iddivtrim) {
    let divtrimsecundario = document.getElementById(iddivtrim);
    let tblcolor = divtrimsecundario.getElementsByClassName('cls_tbody_color')[0],
        idestadocolor = tblcolor.rows[fila].getAttribute('data-idestadocolor'),
        cboestadocolor = tblcolor.rows[fila].getElementsByClassName('StatusColor')[0];

    cboestadocolor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_estados_combo, 'ValorEstado', 'NombreEstado');
    cboestadocolor.value = idestadocolor;
}

function cargargarcombos_iniedit(listatemp_iddivtrim_agregados) {
    listatemp_iddivtrim_agregados.forEach((x, i) => {
        let divtrim = _('divTrim'), divtrimsecundario = document.getElementById(x.iddivtrim), cboestado = divtrimsecundario.getElementsByClassName('TrimStatus')[0],
            cbounidadmedida = divtrimsecundario.getElementsByClassName('TrimCostType')[0],
            cbotipomoneda = divtrimsecundario.getElementsByClassName('TrimMoneda')[0],
            cbotipoproveedor = divtrimsecundario.getElementsByClassName('cls_tipoproveedor_trim')[0],
            idestado = divtrimsecundario.getElementsByClassName('cls_div_trim_idstatus')[0].getAttribute('data-idstatus'),
            idunidadmedida = divtrimsecundario.getElementsByClassName('cls_div_trim_idunidadmedida')[0].getAttribute('data-idunidadmedida'),
            idtipomoneda = divtrimsecundario.getElementsByClassName('cls_div_trim_idmoneda')[0].getAttribute('data-idmoneda'),
            idtipoproveedor = divtrimsecundario.getElementsByClassName('cls_div_trim_tipoproveedor')[0].getAttribute('data-idtipoproveedor');

        cboestado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_estados_combo, 'ValorEstado', 'NombreEstado');
        cboestado.value = idestado;
        cbounidadmedida.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_unidadmedida_combo, 'IdUnidadMedida', 'Simbolo');
        cbounidadmedida.value = idunidadmedida;
        cbotipomoneda.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_tipomoneda_combo, 'IdMoneda', 'Codigo');
        cbotipomoneda.value = idtipomoneda;
        cbotipoproveedor.value = idtipoproveedor;

        // combo estado color
        let tblcolor = divtrimsecundario.getElementsByClassName('cls_tbody_color')[0], arrrows = Array.from(tblcolor.rows);
        arrrows.forEach((ele, row) => {
            let cboestadocolor = ele.getElementsByClassName('StatusColor')[0], idestadocolor = ele.getAttribute('data-idestadocolor');
            cboestadocolor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables_estilo_new.datalst_estados_combo, 'ValorEstado', 'NombreEstado');
            cboestadocolor.value = idestadocolor;
        });
    });
}

function pintar_trims_iniedit(odatatrims, odatatrims_color, trimscolor_maestra) {
    if (odatatrims !== null) {
        let trims = odatatrims, trimscolor = odatatrims_color !== '' ? odatatrims_color : null, html = '', elementiddivtrim = _('divTrim'),
            arrdivtrim = Array.from(elementiddivtrim.getElementsByClassName('divTrim')), totaldivstrimprincipales = arrdivtrim.length, contador = totaldivstrimprincipales,
            lsttemp_div = [];
        trims.forEach((dtrim, i) => {
            contador = contador + 1;
            let iddivtrim = `divTrim${contador}`, iddivtrimcolor = `divTrimColor${contador}`;
            let objtemp_div = { iddivtrim: iddivtrim };
            lsttemp_div.push(objtemp_div);
            html += `
                    <div class ="col-sm-6 _clsdivtriim divTrim" id="${iddivtrim}" data-divcolor="${iddivtrimcolor}" data-status='old' data-id='${dtrim.idestilotrim}' data-idtrim='${dtrim.idtrim}'>
                        <div class ="panel panel-default">
                            <div class ="panel-heading">
                                <div class ="row" style="vertical-align: middle;">
                                    <div class ="col-sm-6">
                                        <h3>Trim ${contador}</h3>
                                    </div>
                                    <div class ="col-sm-6 text-right">
                                        <button class ='btn btn-info btn-sm cls_btn_editar_trim_color' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class ='fa fa-pencil-square-o'></span>
                                            Edit
                                        </button>
                                        <button class ='btn btn-default btn-sm cls_btn_cancelar_trim_color hide' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class =''></span>
                                            Cancel
                                        </button>
                                        <button class ='btn btn-primary btn-sm cls_btn_save_trim_color hide' data-divtrimcontenedorprincipal='${iddivtrim}'>
                                            <span class ='fa fa-floppy-o'></span>
                                            Save
                                        </button>
                                        <button class ="btn btn-danger btn-sm" type="button" onclick='EliminarTrim(this)'>
                                            <span class ="fa fa-trash-o"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class ="panel-body">
                                <div class ="form-horizontal" data-type="">
                                    <div class ="form-group clsgrupodescripcion_trim">
                                        <div class ="col-sm-3 control-label">
                                            <label>*Description: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <textarea name="txtDescription" onkeyup="Mayus(this)"  class ="form-control TrimDescription _enty_trim" rows="2" data-initial='${dtrim.descripcion}' disabled='disabled' data-required='true' data-min='1' data-max='8000' data-id='descripcion'>${dtrim.descripcion}</textarea>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Code: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <textarea name="txtCode" onkeyup="Mayus(this)"  class ="form-control TrimCode _enty_trim" rows="2" data-initial='${dtrim.codigo}' disabled='disabled' data-required='false' data-min='1' data-max='300' data-id='codigo'>${dtrim.codigo}</textarea>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Placement: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtPlacement" onkeyup="Mayus(this)"  class ="form-control TrimPlacement _enty_trim" data-initial='${dtrim.placement}' value='${dtrim.placement}' data-required='false' data-min='1' data-max='300' data-id='placement'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Supplier: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input type="text" onkeyup="Mayus(this)"   class ="form-control TrimSupplier _enty_trim" data-initial='${dtrim.proveedor}' value='${dtrim.proveedor}' disabled='disabled' data-required='false' data-min='1' data-max='300' data-id='proveedor'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Type provider: </label>
                                        </div>
                                        <div class ="col-sm-8 cls_div_trim_tipoproveedor" data-idtipoproveedor='${dtrim.tipoproveedor}'>
                                            <select class ="form-control _enty_trim cls_tipoproveedor_trim" id="cbo_tipoproveedor" data-required="false" data-min="1" data-max="20" data-id="tipoproveedor" disabled='disabled'>
                                                <option value=" ">Select</option>
                                                <option value="Local">Local</option>
                                                <option value="Importado">Importado</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Status: </label>
                                        </div>
                                        <div class ="col-sm-8 cls_div_trim_idstatus" data-idstatus = '${dtrim.status}'>
                                            <select id="cboStatusTrim" class ="form-control TrimStatus _enty_trim" data-initial='${dtrim.status}' disabled='disabled' data-required='false' data-min='1' data-max='100' data-id='status'>

                                            </select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Incoterm: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtIncoterm" onkeyup="Mayus(this)"  class ="form-control TrimIncoterm _enty_trim" data-initial='${dtrim.incoterm}' value='${dtrim.incoterm}' disabled='disabled' data-required='false' data-min='1' data-max='300' data-id='incoterm'/>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Comment: </label>
                                        </div>
                                        <div class ="col-sm-8">
                                            <input name="txtComent" onkeyup="Mayus(this)"  class ="form-control TrimComment _enty_trim" data-initial='${dtrim.comment}' value='${dtrim.comment}' disabled='disabled' data-required='false' data-min='1' data-max='300' data-id='comment' />
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-3 control-label">
                                            <label>Cost: </label>
                                        </div>
                                        <div class ="col-sm-3">
                                            <input name="txtCost" onkeypress="return DigitimosDecimales(event,this)" onblur="ValidarNumero(this);" class ="form-control TrimCost _enty_trim" data-initial='${dtrim.costo}' value='${dtrim.costo}' disabled='disabled' data-required='false' data-min='1' data-max='18' data-id='costo' data-type='dec'/>
                                        </div>
                                        <div class ="col-sm-3 cls_div_trim_idunidadmedida" data-idunidadmedida='${dtrim.costouom}'>
                                            <select id="cboTrimUnidadMedida" class ="form-control TrimCostType _enty_trim" data-initial='${dtrim.costouom}' disabled='disabled' data-required='false' data-min='1' data-max='20' data-id='costouom'></select>
                                        </div>
                                        <div class ="col-sm-2 cls_div_trim_idmoneda" data-idmoneda='${dtrim.costomoneda}'>
                                            <select id="cboTrimMoneda" class ="form-control TrimMoneda _enty_trim" data-initial='${dtrim.costomoneda}' disabled='disabled' data-required='false' data-min='1' data-max='20' data-id='costomoneda'></select>
                                        </div>
                                    </div>
                                    <div class ="form-group">
                                        <div class ="col-sm-offset-2 col-sm-10">
                                            <button type="button" class ="btn btn-primary" name="btnAddTrimColor" data-divcolor="${iddivtrimcolor}" data-divtrimcontenedorprincipal='${iddivtrim}' onclick="AgregarColorTrim(this);">Add Color</button>
                                        </div>
                                    </div>
                                    <div id="${iddivtrimcolor}">
                                        <table class ="table table-hover table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Color (*) </th>
                                                    <th>Status</th>
                                                    <th>Comment </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody class ='cls_tbody_color'>
                                                `;

            // DE LA TABLA COLORES
            //<button type='button' class ='btn btn-xs btn-outline btn-danger' data-divcolor="${iddivtrimcolor}" data-divtrimcontenedorprincipal='${iddivtrim}' onclick="EliminarTrimColor(this);">
            //    <span class ='fa fa-trash-o'></span>
            //</button>
            //trimscolor
            
            if (trimscolor_maestra !== null) {
                //let colormaestra = trimscolor.filter(xf => xf.idestilotrim == dtrim.idestilotrim);
                let colormaestra =  trimscolor_maestra.filter(xf => xf.idtrim == dtrim.idtrim); //trimscolor.filter(xf => xf.idtrim == dtrim.idtrim);
                if (colormaestra.length > 0) {
                    colormaestra.forEach((dcolor, xi) => {
                        let idtrimcolor = dcolor.idtrimcolor, strchecked = '';
                        let lstcolor_maestraconestilo = trimscolor !== null ? trimscolor.filter(xf => xf.idestilotrim == dtrim.idestilotrim && xf.idtrimcolor == dcolor.idtrimcolor) : [];
                        if (lstcolor_maestraconestilo.length > 0){
                            strchecked = "checked";
                            
                            html += `
                            <tr data-status="old" data-id="${lstcolor_maestraconestilo[0].idestilotrimcolor}" data-idestadocolor='${lstcolor_maestraconestilo[0].status}' data-idtrim='${dtrim.idtrim}' data-idtrimcolor='${dcolor.idtrimcolor}'>
                                <td>
                                    <input type="text" class ="form-control Color" value="${lstcolor_maestraconestilo[0].color}" data-initial="${lstcolor_maestraconestilo[0].color}" disabled='disabled' />
                                </td>
                                <td>
                                    <select data-initial="${lstcolor_maestraconestilo[0].status}" class ="form-control StatusColor" data-initial='${lstcolor_maestraconestilo[0].status}' disabled='disabled'>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class ="form-control cls_comentario" data-initial="${lstcolor_maestraconestilo[0].comentario}" data-initial='${lstcolor_maestraconestilo[0].comentario}' value="${lstcolor_maestraconestilo[0].comentario}" disabled='disabled'/>
                                </td>
                                <td class ="text-center" style='vertical-align: middle;'>
                                    <div class ='input-group'>
                                        <span class ='input-group-addon'>
                                            <input type='checkbox' class ='cls_chk_trim_colorselect' value='' style='width: 20px; height: 20px;' ${strchecked}  />
                                        </span>
                                    </div>
                                </td>
                            </tr>`;
                        } else{
                            html += `
                            <tr data-status="old" data-id="" data-idestadocolor='${dcolor.status}' data-idtrim='${dtrim.idtrim}' data-idtrimcolor='${dcolor.idtrimcolor}'>
                                <td>
                                    <input type="text" class ="form-control Color" value="${dcolor.color}" data-initial="${dcolor.color}" disabled='disabled'/>
                                </td>
                                <td>
                                    <select data-initial="${dcolor.status}" class ="form-control StatusColor" data-initial='${dcolor.status}' disabled='disabled'>
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class ="form-control cls_comentario" data-initial="${dcolor.comentario}" data-initial='${dcolor.comentario}' value="${dcolor.comentario}" disabled='disabled' />
                                </td>
                                <td class ="text-center" style='vertical-align: middle;'>
                                    <div class ='input-group'>
                                        <span class ='input-group-addon'>
                                            <input type='checkbox' class ='cls_chk_trim_colorselect' style='width: 20px; height: 20px;' value='' />
                                        </span>
                                    </div>
                                </td>
                            </tr>`;
                        }
                        
                        
                    });
                }
            }
            
            html +=
                                                `
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        });
        _('divTrim').innerHTML = html;
        cargargarcombos_iniedit(lsttemp_div);
        handler_divtrim_add(lsttemp_div);
    }
}

function AgregarFabricColorCombo(obj) {
    let divId = $(obj).attr("data-divcolor");
    let options = $("#cboFabricProjectColorGeneral").html();
    let htmlColor = "<select id='fabriccombocolor' class='form-control fabriccombocolor'>" + options + "</select>";
 
    let htmlDescription = "<input type='text' onkeyup='Mayus(this)' class='form-control Description' />";
    html = "<tr>";
    html += "<td>" + htmlDescription + "</td>";
    html += "<td>" + htmlColor + "</td>";
    html += "<td class='text-center' style='vertical-align: middle;'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarProcessColor(this);'></span></td>";
    html += "</tr>";
    $("#" + divId).find("table").append(html);
    $("#" + divId + " #fabriccombocolor").select2();
}
function AgregarColorCombo(obj) {
    var divId = $(obj).attr("data-divcolor");
    var htmlColor = "<input type='text' onkeyup='Mayus(this)' class='form-control Color' />";
    let htmlDescription = "<input type='text' onkeyup='Mayus(this)' class='form-control Description' />";
    html = "<tr>";
    html += "<td></td>"
    html += "<td>" + htmlDescription + "</td>";
    html += "<td>" + htmlColor + "</td>";
    html += "<td class='text-center' style='vertical-align: middle;'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarProcessColor(this);'></span></td>";
    html += "</tr>";
    $("#" + divId).find("table").append(html);
}
function AgregarColorProceso(obj) {
    var divId = $(obj).attr("data-divcolor");
    var htmlColor = "<input type='text' onkeyup='Mayus(this)'  class='form-control Color' />"; // "<select class='form-control ClienteColor'>" + $("#cboClienteColor").html() + "</select>";
    var htmlStatus = "<select class='form-control StatusColor'>" + $("#cboStatusColor").html() + "</select>";
    html = "<tr>";
    html += "<td>" + htmlColor + "</td>";
    html += "<td>" + htmlStatus + "</td>";
    html += "<td><input type='text' onkeyup='Mayus(this)' class='form-control'></td>";
    html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarProcessColor(this);'></span></td>";
    html += "</tr>";
    $("#" + divId).find("table").append(html);
}
function AgregarColorArtwwork(obj) {
    var divId = $(obj).attr("data-divcolor");
    var htmlColor = "<input type='text' onkeyup='Mayus(this)' class='form-control Color' />"; // "<select class='form-control ClienteColor'>" + $("#cboClienteColor").html() + "</select>";
    var htmlStatus = "<select class='form-control StatusColor'>" + $("#cboStatusColor").html() + "</select>";
    html = "<tr>";
    html += "<td>" + htmlColor + "</td>";
    html += "<td>" + htmlStatus + "</td>";
    html += "<td><input type='text' onkeyup='Mayus(this)' class='form-control'></td>";
    html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarArtworkColor(this);'></span></td>";
    html += "</tr>";
    $("#" + divId).find("table").append(html);
}
function AgregarColorTrim(obj) {
    let html = '';
    let divId = obj.getAttribute('data-divcolor'), iddivtrimcontenedorprincipal = obj.getAttribute('data-divtrimcontenedorprincipal'); //$(obj).attr("data-divcolor");
    let htmlColor = "<input type='text' onkeyup='Mayus(this)' class='form-control Color' />" // "<select class='form-control ClienteColor'>" + $("#cboClienteColor").html() + "</select>";
    let htmlStatus = "<select class='form-control StatusColor'>" + $("#cboStatusColor").html() + "</select>";
    
    html = `<tr data-id="0" data-idtrim='0' data-idtrimcolor='0'>
                <td>
                    ${htmlColor}
                </td>
                <td>
                    ${htmlStatus}
                </td>
                <td><input type='text' class ='form-control cls_comentario'></td>
                <td class ='text-center' style='vertical-align: middle;'>
                    <div class ='input-group'>
                        <span class ='input-group-addon'>
                            <input type='checkbox' class ='cls_chk_trim_colorselect' style='width:20px; height:20px;' value='' />
                        </span>
                        <span class ='input-group-addon'>
                            <button type='button' class ='btn btn-xs btn-outline btn-danger cls_btn_deletecolor' data-divcolor="${divId}" data-divtrimcontenedorprincipal='${iddivtrimcontenedorprincipal}' onclick="EliminarTrimColor(this);">
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </span>
                        
                    </div>
                </td>
            </tr>`;
    _(divId).getElementsByClassName('cls_tbody_color')[0].insertAdjacentHTML('beforeend', html);
    _(iddivtrimcontenedorprincipal).getElementsByClassName('cls_btn_save_trim_color')[0].classList.remove('hide');
}

function EliminarFabric(obj) {
    var divId = $(obj).attr("data-div");
    if (divId != "") {
        $("#" + divId).remove();
    } else {
        var ndivFabric = $(".divFabric").length;
        if (ndivFabric == 1) {
            $(".divFabric").each(function () {
                $(this).find(".FabricReference").val("");
                $(this).find(".FabricConstruction").val("");
                $(this).find(".FabricYarn").val("");
                $(this).find(".FabricContent").val("");
                $(this).find(".Fabricweight").val("");
                $(this).find(".FabricLavado").val("AW");

                $(this).find(".FabricStatus").val("P");
                $(this).find(".FabricComent").val("");
                $(this).find(".FabricSupplierCBO").val("");
                $(this).find(".FabricSupplierTXT").val("");
                $(this).find(".FabricSupplierTXT").hide();
                $(this).find(".FabricSupplierCBO").show();
                $(this).find(".FabricId").val("0");
                $(this).find(".FabricConstruction").prop('readonly', false);
                $(this).find(".FabricYarn").prop('readonly', false);
                $(this).find(".FabricContent").prop('readonly', false);
                $(this).find(".Fabricweight").prop('readonly', false);
                $(this).find(".FabricLavado").removeAttr('disabled');

                $(this).find(".FabricProcessContent").show();
                $(this).find(".lblSupplierReq").show();
                $(this).find(".lblPlacementReq").show();
                $(this).find(".lblConstructionReq").show();
                $(this).find(".lblYarnReq").show();
                $(this).find(".lblContentReq").show();
                $(this).find(".lblWeightReq").show();

                var divProcess = $(this).attr("data-divProcess");
                $("#" + divProcess + " table >tbody").empty();
            });
        }
    }
}

function EliminarProceso(obj) {
    let tag = obj.tagName, divpadre = null;
    switch (tag) {
        case 'BUTTON':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (divpadre != null) {
        _('divProcess').removeChild(divpadre)
    }
    //var divId = $(obj).attr("data-div");
    //if (divId != "") {
    //    $("#" + divId).remove();
    //} else {
    //    var ndivProcess = $(".divProcess").length;
    //    if (ndivProcess == 1) {
    //        $(".divProcess").each(function () {
    //            $(this).find(".ProcessDescription").val("");
    //            $(this).find(".ProcessSupplier").val("");
    //            $(this).find(".ProcessStatus").val("P");
    //            $(this).find(".ProcessComment").val("");
    //            $(this).find(".ProcessCost").val("");
    //            $(this).find(".ProcessCostType").val("1");
    //            $(this).find(".ProcessMoneda").prop('selectedIndex', 0);
    //            var divColor = $(this).attr("data-divcolor");
    //            $("#" + divColor + " table >tbody").empty();
    //        });
    //    }
    //}
}

function EliminarArtwork(obj) {
    let tag = obj.tagName, divpadre = null;
    switch (tag) {
        case 'BUTTON':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (divpadre != null) {
        _('divArtwork').removeChild(divpadre)
    }

    //var divId = $(obj).attr("data-div");
    //if (divId != "") {
    //    $("#" + divId).remove();
    //} else {
    //    var ndivArtwork = $(".divArtwork").length;
    //    if (ndivArtwork == 1) {
    //        $(".divArtwork").each(function () {
    //            $(this).find(".ArtworkDescription").val("");
    //            $(this).find(".ArtworkTechnique").val("");
    //            $(this).find(".ArtworkPlacement").val("");
    //            $(this).find(".ArtworkSupplier").val("");
    //            $(this).find(".ArtworkStatus").val("P");
    //            $(this).find(".ArtworkComment").val("");
    //            $(this).find(".ArtworkCost").val("");
    //            $(this).find(".ArtworkMoneda").prop('selectedIndex', 0);
    //            $(this).find(".ArtworkFile").val("");
    //            var divColor = $(this).attr("data-divcolor");
    //            $("#" + divColor + " table >tbody").empty();
    //        });
    //    }
    //}
}

function EliminarTrim(obj) {
    let tag = obj.tagName, divpadre = null;
    switch (tag) {
        case 'BUTTON':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (divpadre != null) {
        _('divTrim').removeChild(divpadre)
    }

    //var divId = $(obj).attr("data-div");
    //if (divId != "") {
    //    $("#" + divId).remove();
    //} else {
    //    var ndivTrim = $(".divTrim").length;
    //    if (ndivTrim == 1) {
    //        $(".divTrim").each(function () {

    //            $(this).find(".TrimDescription").val("");
    //            $(this).find(".TrimPlacement").val("");
    //            $(this).find(".TrimSupplier").val("");
    //            $(this).find(".TrimStatus").val("P");
    //            $(this).find(".TrimComment").val("");
    //            $(this).find(".TrimCost").val("");
    //            $(this).find(".TrimCostType").val("1");
    //            $(this).find(".TrimCode").val("");
    //            $(this).find(".TrimIncoterm").val("");
    //            $(this).find(".TrimMoneda").prop('selectedIndex', 0);
    //            var divColor = $(this).attr("data-divcolor");
    //            $("#" + divColor + " table >tbody").empty();
    //        });
    //    }
    //}
}

function ObtenerDatosCarga(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var Familia = JSON.parse(JSONdata[0].Familia);
    var Proveedor = JSON.parse(JSONdata[0].Proveedor);
    var UnidadMedida = JSON.parse(JSONdata[0].UnidadMedida)
    var Moneda = JSON.parse(JSONdata[0].Moneda)
    var FabricProcess = JSON.parse(JSONdata[0].FabricProcess)
    var StatusEstilo = JSON.parse(JSONdata[0].StatusEstilo)
    var StatusTabs = JSON.parse(JSONdata[0].StatusTabs)
    //let FabricProjectColor = JSON.parse(JSONdata[0].FabricProjectColor)    

    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);
    var htmlFamilia = _comboFromJSON(Familia, "IdFamilia", "NombreFamilia");
    $("#cboFamilia").append(htmlFamilia);
    var htmlProveedor = _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
    $("#cboProcessSupplier").append(htmlProveedor);
    
    $("#cboArtworkSupplier").append(htmlProveedor);

    ////$("#cboFabricSupplier").append(htmlProveedor);
    var htmlUnidadMedida = _comboFromJSON(UnidadMedida, "IdUnidadMedida", "Simbolo");
    $("#cboProcessUnidadMedida").append(htmlUnidadMedida);
    //$("#cboTrimUnidadMedida").append(htmlUnidadMedida);
    ovariables_estilo_new.datalst_unidadmedida_combo = UnidadMedida;

    var htmlMoneda = _comboFromJSON(Moneda, "IdMoneda", "Codigo");
    $("#cboProcessMoneda").append(htmlMoneda);
    $("#cboArtworkMoneda").append(htmlMoneda);
    //$("#cboTrimMoneda").append(htmlMoneda);
    ovariables_estilo_new.datalst_tipomoneda_combo = Moneda;

    var htmlFabricProcess = _comboFromJSON(FabricProcess, "ValorEstado", "NombreEstado");
    $("#cboFabricProcess").append(htmlFabricProcess);

    //var htmlFabricProjectColor = _comboFromJSON(FabricProjectColor, "IdColor", "color");
    //$("#cboFabricProjectColorGeneral").append(htmlFabricProjectColor);

    var htmlStatusEstilo = _comboFromJSON(StatusEstilo, "ValorEstado", "NombreEstado");
    $("#cboStatus").append(htmlStatusEstilo);

    var htmlStatusTab = _comboFromJSON(StatusTabs, "ValorEstado", "NombreEstado");
    $("#cboStatusFabric").append(htmlStatusTab);
    $("#cboStatusProcess").append(htmlStatusTab);
    $("#cboStatusArtwork").append(htmlStatusTab);
    $("#cboStatusTrim").append(htmlStatusTab);
    ovariables_estilo_new.datalst_estados_combo = StatusTabs;
    $("#cboStatusColor").append(htmlStatusTab);
}

function ObtenerDatosCargaPorCliente(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        if (JSONdata[0].Temporada != null) {
            var Temporada = JSON.parse(JSONdata[0].Temporada);
            $("#cboSeason").empty();
            var htmlTemporada = "<option value='0'>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
            $("#cboSeason").append(htmlTemporada);
        }
        if (JSONdata[0].Division != null) {
            var Division = JSON.parse(JSONdata[0].Division);
            $("#cboDivision").empty();
            var htmlDivision = "<option value='0'>Select One</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
            $("#cboDivision").append(htmlDivision);
        }
        _('cboProgram').innerHTML = "<option value='0'>Select One</option>";
        if (JSONdata[0].Programa != null) {
            var programa = JSON.parse(JSONdata[0].Programa);
            var htmlDivision = "<option value='0'>Select One</option>" + _comboFromJSON(programa, "IdPrograma", "Nombre");
            _('cboProgram').innerHTML = htmlDivision;
        }
          
        _('cboSupplier').innerHTML = '';
        _('cboSupplier').innerHTML = "<option value='0'>Select</option>" + _comboFromCSV(JSONdata[0].proveedor);

    }
}

function Validar(){
    let req = _required({ id: 'tab-style', clase: '_enty' });
    if (ValidarCallout() && req) {
        ValidarCodigo()

    } else {
        $("#panStyle").click();
        var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        _mensaje(objmensaje);
        return false;
    }
}

function save_new_estilo() {
    // Tab Style
    let Cliente = $("#cboCliente").val(), Codigo = $("#txtCode_estilo").val(), Descripcion = $("#txtStyleDescription").val(), Temporada = $("#cboSeason").val(),
        Division = $("#cboDivision").val(), Status = $("#cboStatus").val(), Programa = $('#cboProgram').val(), idestilo = _('hf_idestilo').value,
        minutaje = _('txtminutaje').value, FitStatus = _('txtFitStatus').value,
        factory = _('cboSupplier').value, DescriptionFabricCombo = $("#txtFabricCombo").val();
    let notas_hangtag = _('txta_notashangtag').value;

    let objtelas = getArrayTelas('div_principal_paneltelas');
    let telasJson = JSON.stringify(objtelas.arraytelas);
    let estiloTechpack = JSON.stringify(getArrayEstiloTechpack('new')), estilotechpack_edit = getArrayEstiloTechpack('new');
    
    //telasJson = telasJson == '[]' ? '' : telasJson;    
    // Cliente != "" && Codigo != "" && Descripcion != ""
        var frm = new FormData();
        var FilesArtwork = "";
        var objEstilo = {
            IdEstilo: idestilo,
            IdCliente: Cliente,
            Codigo: Codigo,
            Descripcion: Descripcion,
            Temporada: Temporada,
            Division: Division,
            Status: Status,
            Cambio: 0,
            Imagen: 0,
            Programa: Programa,
            minutaje: minutaje,
            idproveedor: factory,
            DescriptionFabricCombo: DescriptionFabricCombo,
            flg: ovariables_estilo_new.flgVersion,
            FitStatus: FitStatus,
            notas_hangtag: notas_hangtag
        }
        // Callout
        var nCallout = $("#");
        var Callout = new Array();
        var CurrentUser = $("#txtUsuario").val();
        $("#tblCallout tbody tr").each(function () {
            var CalloutComment = $(this).find(".CalloutComment")[0].value;
            var Usuario = CurrentUser;
            var Fecha = moment().format('DD/MM/YYYY');
            var objCallout = {
                CalloutComment: CalloutComment,
                CalloutUsuario: Usuario,
                CalloutFecha: Fecha
            }
            Callout.push(objCallout);
        });

        //Process

        var nProcess = $('#divProcess').not('.hideproceso').length; //$(".divProcess").length;
        var Process = new Array();
        var ProcessColor = new Array();
        var contProcess = 1;

        var ValProceso = ValidarProceso();
        switch (ValProceso) {
            case 2:
                $("#panProcess").click();
                var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
                _mensaje(objmensaje);
                return false;
                break;
            case 3:
                $(".divProcess").each(function () {
                    let divsinhide = this.classList.value.indexOf('hideproceso');  // SOLO LOS VISIBLES 
                    if (divsinhide < 0) {
                        var ProcessDescription = $(this).find(".ProcessDescription")[0].value;
                        var ProcessSupplier = $(this).find(".ProcessSupplier")[0].value;
                        var ProcessStatus = $(this).find(".ProcessStatus")[0].value;
                        var ProcessComment = $(this).find(".ProcessComment")[0].value;
                        var ProcessCost = $(this).find(".ProcessCost")[0].value;
                        var ProcessCostType = $(this).find(".ProcessCostType")[0].value;
                        var ProcessMoneda = $(this).find(".ProcessMoneda")[0].value;
                        if (ProcessCost == "") {
                            ProcessCost = "0";
                        }
                        var objProcess = {
                            ProcessDescription: ProcessDescription,
                            ProcessSupplier: ProcessSupplier,
                            ProcessStatus: ProcessStatus,
                            ProcessComment: ProcessComment,
                            ProcessCost: ProcessCost,
                            ProcessCostType: ProcessCostType,
                            ProcessMoneda: ProcessMoneda,
                            ProcessReference: contProcess
                        }
                        Process.push(objProcess);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                                var Color = $(this.cells[0]).find("input")[0].value;
                                var Status = $(this.cells[1]).find("select")[0].value;
                                var Comment = $(this.cells[2]).find("input")[0].value;

                                var objProcessColor = {
                                    Reference: contProcess,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment
                                }
                                ProcessColor.push(objProcessColor);
                            });
                        }

                        contProcess++;
                    }
                });
                break;
        }

        //Artwork

        var nArtwork = $('#divArtwork').not('.hideatwork').length; //$(".divArtwork").length;
        var Artwork = new Array();
        var ArtworkColor = new Array();
        var contArtwork = 1;

        var ValArtwork = ValidarArtWork();
        switch (ValArtwork) {
            case 2:
                $("#panArtwork").click();
                var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
                _mensaje(objmensaje);
                return false;
                break;
            case 3:

                $(".divArtwork").each(function () {
                    let divsinhide = this.classList.value.indexOf('hideatwork');  // SOLO LOS VISIBLES 
                    if (divsinhide < 0) {
                        var ArtworkDivid = $(this).attr("id");
                        var ArtworkDescription = $(this).find(".ArtworkDescription")[0].value;
                        var ArtworkTechnique = $(this).find(".ArtworkTechnique")[0].value;
                        var ArtworkPlacement = $(this).find(".ArtworkPlacement")[0].value;
                        var ArtworkSupplier = $(this).find(".ArtworkSupplier")[0].value;
                        var ArtworkStatus = $(this).find(".ArtworkStatus")[0].value;
                        var ArtworkComment = $(this).find(".ArtworkComment")[0].value;
                        var ArtworkCost = $(this).find(".ArtworkCost")[0].value;
                        var ArtworkFile = $(this).find(".ArtworkFile")[0].files[0];
                        var ArtworkMoneda = $(this).find(".ArtworkMoneda")[0].value;
                        if (ArtworkFile != null) {
                            ArtworkDivid = ArtworkDivid + "_" + contArtwork;
                            frm.append(ArtworkDivid, ArtworkFile);
                            FilesArtwork += ArtworkDivid + ",";
                        }
                        if (ArtworkCost == "") {
                            ArtworkCost = "0";
                        }
                        var objArtwork = {
                            ArtworkDescription: ArtworkDescription,
                            ArtworkTechnique: ArtworkTechnique,
                            ArtworkPlacement: ArtworkPlacement,
                            ArtworkSupplier: ArtworkSupplier,
                            ArtworkStatus: ArtworkStatus,
                            ArtworkComment: ArtworkComment,
                            ArtworkCost: ArtworkCost,
                            ArtworkMoneda: ArtworkMoneda,
                            ArtworkReference: contArtwork
                        }
                        Artwork.push(objArtwork);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                                var Color = $(this.cells[0]).find("input")[0].value;
                                var Status = $(this.cells[1]).find("select")[0].value;
                                var Comment = $(this.cells[2]).find("input")[0].value;
                                var objArtworkColor = {
                                    Reference: contArtwork,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment
                                }
                                ArtworkColor.push(objArtworkColor);
                            });
                        }
                        contArtwork++;
                    }
                });
                break;
        }
        // Trim

        var nTrim = $('#divTrim').not('.hidetrim').length; //$(".divTrim").length;
        var Trim = new Array();
        var TrimColor = new Array();
        var contTrim = 1;

        var ValTrim = ValidarTrim();
        if (!ValTrim) {
                return false;
        }
        if (ValTrim) {
                $(".divTrim").each(function () {
                    let divsinhide = this.classList.value.indexOf('hidetrim');  // SOLO LOS VISIBLES 
                    if (divsinhide < 0) {
                    let TrimDivid = $(this).attr("id"), TrimCode = $(this).find(".TrimCode")[0].value, TrimDescription = $(this).find(".TrimDescription")[0].value,
                        TrimPlacement = $(this).find(".TrimPlacement")[0].value, TrimSupplier = $(this).find(".TrimSupplier")[0].value, TrimStatus = $(this).find(".TrimStatus")[0].value,
                        TrimComment = $(this).find(".TrimComment")[0].value, TrimCost = $(this).find(".TrimCost")[0].value, TrimCostType = $(this).find(".TrimCostType")[0].value,
                        TrimMoneda = $(this).find(".TrimMoneda")[0].value, TrimIncoterm = $(this).find(".TrimIncoterm")[0].value, idtrim_maestra = this.getAttribute('data-idtrim'),
                        tipoproveedor = this.getElementsByClassName('cls_tipoproveedor_trim')[0].value;

                        if (TrimCost == "") {
                            TrimCost = "0";
                        }
                        var objTrim = {
                            TrimCode: TrimCode,
                            TrimReference: contTrim,
                            TrimDescription: TrimDescription,
                            TrimPlacement: TrimPlacement,
                            TrimSupplier: TrimSupplier,
                            TrimStatus: TrimStatus,
                            TrimComment: TrimComment,
                            TrimCost: TrimCost,
                            TrimCostType: TrimCostType,
                            TrimMoneda: TrimMoneda,
                        TrimIncoterm: TrimIncoterm,
                        idtrim: idtrim_maestra,
                        tipoproveedor: tipoproveedor
                        }

                        Trim.push(objTrim);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                            let Color = $(this.cells[0]).find("input")[0].value, Status = $(this.cells[1]).find("select")[0].value, Comment = $(this.cells[2]).find("input")[0].value,
                                idtrim = this.getAttribute('data-idtrim'), idtrimcolor = this.getAttribute('data-idtrimcolor');

                            if (this.cells[3].getElementsByClassName('cls_chk_trim_colorselect')[0].checked) {
                                var objTrimColor = {
                                    Reference: contTrim,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment,
                                    idtrim: idtrim,
                                    idtrimcolor: idtrimcolor
                                }
                                TrimColor.push(objTrimColor);
                            }
                            });
                        }
                        contTrim++;
                    }
                });
        }
        
        
        
        let objFabricCombo = getCadenaJson_FabricCombo();

        let objCombination = getCadenaJson_Combination_PaGrabar();

        var ProcessJSON = "";
        if (Process.length > 0) {
            ProcessJSON = JSON.stringify(Process);
        }

        var ArtworkJSON = "";
        if (Artwork.length > 0) {
            ArtworkJSON = JSON.stringify(Artwork);
        }

        var TrimJSON = "";
        if (Trim.length > 0) {
            TrimJSON = JSON.stringify(Trim);
        }

        var ArtworkColorJSON = "";
        if (ArtworkColor.length > 0) {
            ArtworkColorJSON = JSON.stringify(ArtworkColor);
        }

        var TrimColorJSON = "";
        if (TrimColor.length > 0) {
            TrimColorJSON = JSON.stringify(TrimColor);
        }

        var ProcessColorJSON = "";
        if (ProcessColor.length > 0) {
            ProcessColorJSON = JSON.stringify(ProcessColor);
        }

        var CalloutJSON = "";
        if (Callout.length > 0) {
            CalloutJSON = JSON.stringify(Callout);
        }

        //var FabricProcesJSON = "";
        //if (FabricProcess.length > 0) {
        //    FabricProcesJSON = JSON.stringify(FabricProcess);
        //}

        frm.append("EstiloImagen", $("#fupArchivo")[0].files[0]);       
        var variable = $("#fupArchivo")[0].files[0];       
        var _bImagen
        var _Nombre = "";
        var _strSrc = document.getElementById("imgEstilo").src;
        var _copyImagen = false;
        var _bActualizarImage = false
        if (typeof variable === "undefined" && _strSrc != '') {
            var v1 = _strSrc.split(";");
            var v2 = _strSrc.split(",");
            var _extension = (v1[0]).substr(-3);
            var _bytes = v2[1];
            if (!(typeof _bytes === "undefined")) {
                _copyImagen = true;
                _bActualizarImage = true;
                _bImagen = _bytes;
                _Nombre = "Image." + _extension;
                frm.append("ImagenNombre", _Nombre);
                frm.append("ImagenWebCopy", _bImagen);
            }
        }
        
        _bImagen;
        _Nombre = "";
        _copyImagen = false;
        _bActualizarImage = false;
        frm.append("ImageFabricCombo", $("#fupArchivo_fabric")[0].files[0]);
        var ImageFabricCombo = $("#fupArchivo_fabric")[0].files[0];
        _strSrc = document.getElementById("imgEstilo_fabric").src;
        if (typeof ImageFabricCombo === "undefined" && _strSrc != '') {
              v1 = _strSrc.split(";");
              v2 = _strSrc.split(",");
              _extension = (v1[0]).substr(-3);
              _bytes = v2[1];
              if (!(typeof _bytes === "undefined")) {
                  _copyImagen = true;
                  _bActualizarImage = true;
                  _bImagen = _bytes;
                _Nombre = "ImageFabricCombo." + _extension;
                frm.append("ImagenNombreFabricCombo", _Nombre);
                frm.append("ImagenWebFabricCombo", _bytes);
            }
        }

        frm.append("Estilo", JSON.stringify(objEstilo));
        frm.append("Callout", CalloutJSON);
        frm.append("Fabric", telasJson);
        frm.append("Process", ProcessJSON);
        frm.append("Artwork", ArtworkJSON);
        frm.append("Trim", TrimJSON);
        frm.append("ProcessColor", ProcessColorJSON);
        frm.append("ArtworkColor", ArtworkColorJSON);
        frm.append("TrimColor", TrimColorJSON);
        frm.append("ArtworkfileStr", FilesArtwork);
        frm.append("ProcessE", "");
        frm.append("ArtworkE", "");
        frm.append("TrimE", "");
        frm.append("ProcessColorE", "");
        frm.append("ArtworkColorE", "");
        frm.append("TrimColorE", "");
        frm.append("estiloxcombojson", objCombination.estiloxcombo);
        frm.append("estiloxcombocolorjson", objCombination.estiloxcombocolor);
        frm.append("estiloxfabriccombojson", objFabricCombo.estilofabricxcombo);
        frm.append("estiloxfabriccombocolorjson", objFabricCombo.estilofabricxcombocolor);
        frm.append("estilotechkpack", estiloTechpack);
  
        let tblbody_estilotechpack = _('tbody_tableestilotechpack'), arrrows_estilotechpack = Array.from(tblbody_estilotechpack.rows), contador = 0;
        arrrows_estilotechpack.forEach(x => {
            if (x.classList.value.indexOf('hide') < 0) {
                let inputfile = x.getElementsByClassName('cls_tbl_estilotechpack_file')[0], arrfiles = inputfile !== undefined ? Array.from(inputfile.files) : null;
                if (arrfiles !== null) {
                    arrfiles.forEach(f => {
                        contador++;
                        frm.append('fileestiloarchivo' + contador, f);
                    });
                }
            }
        });
  
        Post('GestionProducto/Estilo/Save_new_estilo', frm, Alerta);     
}

function save_edit_estilo() {
    // Tab Style
    let Cliente = $("#cboCliente").val(), Codigo = $("#txtCode_estilo").val(), Descripcion = $("#txtStyleDescription").val(), Temporada = $("#cboSeason").val(),
        Division = $("#cboDivision").val(), Status = $("#cboStatus").val(), Programa = $('#cboProgram').val(), idestilo = _('hf_idestilo').value,
        DescripcionInitialValue = $("#txtStyleDescription").attr("data-initial"), TemporadaInitialValue = $("#cboSeason").attr("data-initial"), 
        DivisionInitialValue = $("#cboDivision").attr("data-initial"), StatusInitialValue = $("#cboStatus").attr("data-initial"), estado_actualizarimagen = _('hf_estado_actualizarimagen').value, 
        minutaje = _('txtminutaje').value, factory = _('cboSupplier').value, estado_actualizarimagenFabricCombo = _('hf_estado_actualizarimagenFabricCombo').value,
        DescriptionFabricCombo = $("#txtFabricCombo").val(), FitStatus = _('txtFitStatus').value;
    let notas_hangtag = _('txta_notashangtag').value;

    let req = _required({ id: 'tab-style', clase: '_enty' });
    let ValTrim = ValidarTrim();

    if (ValidarCallout() && req) { // Cliente != "" && Codigo != "" && Descripcion != ""
        if (!ValTrim) {
            return false;
        }
        let objtelas = getArrayTelas('div_principal_paneltelas');
        let telasJson = JSON.stringify(objtelas.arraytelas), telascolorJson = JSON.stringify(objtelas.arraytelascolor);
        let estiloTechpack = JSON.stringify(getArrayEstiloTechpack('new')), estilotechpack_edit = getArrayEstiloTechpack('edit');

        //telasJson = telasJson == '[]' ? '' : telasJson;
        //telascolorJson = telascolorJson == '[]' ? '' : telascolorJson;

        var contCambiosStyle = 0;

        if ((Descripcion != DescripcionInitialValue) || (Temporada != TemporadaInitialValue) || (Division != DivisionInitialValue) || (Status != StatusInitialValue)) {
            contCambiosStyle++;
        }
 
        var frm = new FormData();
        var FilesArtwork = "";
        var objEstilo = {
            IdEstilo: idestilo,
            IdCliente: Cliente,
            Codigo: Codigo,
            Descripcion: Descripcion,
            Temporada: Temporada,
            Division: Division,
            Status: Status,
            Cambio: 0,
            Imagen: estado_actualizarimagen,
            Programa: Programa,
            minutaje: minutaje,
            idproveedor: factory,
            bImagenFabricCombo: estado_actualizarimagenFabricCombo,
            DescriptionFabricCombo: DescriptionFabricCombo,
            FitStatus: FitStatus,
            estilotechpackedit: estilotechpack_edit,
            notas_hangtag: notas_hangtag
        }
        
        var nCallout = _('tbody_callout').rows.length; //$("#tblCallout tbody tr").length;
        var Callout = new Array();

        if (nCallout > 0) {
            var trStatus = "";
            var contCambiosCallout = 0;

            var CurrentUser = $("#txtUsuario").val();

            $("#tblCallout tbody tr").each(function () {
                let idestilocallout = this.getAttribute('data-id');
                idestilocallout = (idestilocallout == '' || idestilocallout) == null ? 0 : idestilocallout

                trStatus = $(this).attr("data-status");
                var CalloutComment = $(this).find(".CalloutComment")[0];//CalloutComment
                var CalloutFecha = $(this).find(".CalloutFecha")[0];//CalloutFecha
                var CalloutUsuario = $(this).find(".CalloutUsuario")[0];//CalloutUsuario

                var Usuario = $(CalloutUsuario).text().trim();
                if (Usuario == "") {
                    Usuario = CurrentUser;
                }

                var Fecha = _convertDate_ANSI($(CalloutFecha).text().trim());
                if (Fecha == " ") {
                    Fecha = moment().format('DD/MM/YYYY');
                }

                var CalloutCommentValue = $(CalloutComment).val().trim();
                var CalloutCommentInitialValue = $(CalloutComment).attr("data-initial").trim();

                if ((CalloutCommentValue != CalloutCommentInitialValue) || (trStatus == "new")) {
                    contCambiosCallout++;
                }

                var objCallout = {
                    idestilocallout: idestilocallout,
                    CalloutComment: CalloutCommentValue,
                    CalloutUsuario: Usuario,
                    CalloutFecha: Fecha
                }
                Callout.push(objCallout);
            });
            if (contCambiosCallout == 0) {
                while (Callout.length > 0) {
                    Callout.pop();
                }
            }
        }

        //Process

        var nProcess = $('#divProcess').not('.hideproceso').length; //$(".divProcess").length;
        var Process = new Array();
        var ProcessColor = new Array();
        var contProcess = 1;

        var ValProceso = ValidarProceso();
        switch (ValProceso) {
            case 2:
                $("#panProcess").click();
                var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
                _mensaje(objmensaje);
                return false;
                break;
            case 3:
                $(".divProcess").each(function () {
                    let divsinhide = this.classList.value.indexOf('hideproceso');
                    if (divsinhide < 0) {
                        let idestiloproceso = this.getAttribute('data-id');
                        idestiloproceso = (idestiloproceso == '' || idestiloproceso == null) ? 0 : idestiloproceso;

                        var ProcessDescription = $(this).find(".ProcessDescription")[0].value;
                        var ProcessSupplier = $(this).find(".ProcessSupplier")[0].value;
                        var ProcessStatus = $(this).find(".ProcessStatus")[0].value;
                        var ProcessComment = $(this).find(".ProcessComment")[0].value;
                        var ProcessCost = $(this).find(".ProcessCost")[0].value;
                        var ProcessCostType = $(this).find(".ProcessCostType")[0].value;
                        var ProcessMoneda = $(this).find(".ProcessMoneda")[0].value;
                        if (ProcessCost == "") {
                            ProcessCost = "0";
                        }
                        var objProcess = {
                            idestiloproceso: idestiloproceso,
                            ProcessDescription: ProcessDescription,
                            ProcessSupplier: ProcessSupplier,
                            ProcessStatus: ProcessStatus,
                            ProcessComment: ProcessComment,
                            ProcessCost: ProcessCost,
                            ProcessCostType: ProcessCostType,
                            ProcessMoneda: ProcessMoneda,
                            ProcessReference: contProcess
                        }
                        Process.push(objProcess);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                                let idestiloprocesocolor = this.getAttribute('data-id');
                                idestiloprocesocolor = (idestiloprocesocolor == '' || idestiloprocesocolor == null) ? 0 : idestiloprocesocolor;
                                var Color = $(this.cells[0]).find("input")[0].value;
                                var Status = $(this.cells[1]).find("select")[0].value;
                                var Comment = $(this.cells[2]).find("input")[0].value;

                                var objProcessColor = {
                                    idestiloprocesocolor: idestiloprocesocolor,
                                    Reference: contProcess,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment
                                }
                                ProcessColor.push(objProcessColor);
                            });
                        }

                        contProcess++;
                    }
                });
                break;
        }

        //Artwork

        var nArtwork = $('#divArtwork').not('.hideatwork').length; //$(".divArtwork").length;
        var Artwork = new Array();
        var ArtworkColor = new Array();
        var contArtwork = 1;

        var ValArtwork = ValidarArtWork();
        switch (ValArtwork) {
            case 2:
                $("#panArtwork").click();
                var objmensaje = { titulo: 'Alerta', mensaje: 'Please enter information (*) !!!', estado: 'error' };
                _mensaje(objmensaje);
                return false;
                break;
            case 3:

                $(".divArtwork").each(function () {
                    let divsinhide = this.classList.value.indexOf('hideatwork');
                    if (divsinhide < 0) {
                        let idestiloarte = this.getAttribute('data-id');
                        idestiloarte = (idestiloarte == '' || idestiloarte == null) ? 0 : idestiloarte;
                        var ArtworkDivid = $(this).attr("id");
                        var ArtworkDescription = $(this).find(".ArtworkDescription")[0].value;
                        var ArtworkTechnique = $(this).find(".ArtworkTechnique")[0].value;
                        var ArtworkPlacement = $(this).find(".ArtworkPlacement")[0].value;
                        var ArtworkSupplier = $(this).find(".ArtworkSupplier")[0].value;
                        var ArtworkStatus = $(this).find(".ArtworkStatus")[0].value;
                        var ArtworkComment = $(this).find(".ArtworkComment")[0].value;
                        var ArtworkCost = $(this).find(".ArtworkCost")[0].value;
                        var ArtworkFile = $(this).find(".ArtworkFile")[0].files[0];
                        var ArtworkMoneda = $(this).find(".ArtworkMoneda")[0].value;
                        if (ArtworkFile != null) {
                            ArtworkDivid = ArtworkDivid + "_" + contArtwork;
                            frm.append(ArtworkDivid, ArtworkFile);
                            FilesArtwork += ArtworkDivid + ",";
                        }
                        if (ArtworkCost == "") {
                            ArtworkCost = "0";
                        }
                        var objArtwork = {
                            idestiloarte: idestiloarte,
                            ArtworkDescription: ArtworkDescription,
                            ArtworkTechnique: ArtworkTechnique,
                            ArtworkPlacement: ArtworkPlacement,
                            ArtworkSupplier: ArtworkSupplier,
                            ArtworkStatus: ArtworkStatus,
                            ArtworkComment: ArtworkComment,
                            ArtworkCost: ArtworkCost,
                            ArtworkMoneda: ArtworkMoneda,
                            ArtworkReference: contArtwork
                        }
                        Artwork.push(objArtwork);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                                let idestiloartecolor = this.getAttribute('data-id');
                                idestiloartecolor = (idestiloartecolor == '' || idestiloartecolor == null) ? 0 : idestiloartecolor;
                                var Color = $(this.cells[0]).find("input")[0].value;
                                var Status = $(this.cells[1]).find("select")[0].value;
                                var Comment = $(this.cells[2]).find("input")[0].value;
                                var objArtworkColor = {
                                    idestiloartecolor: idestiloartecolor,
                                    Reference: contArtwork,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment
                                }
                                ArtworkColor.push(objArtworkColor);
                            });
                        }
                        contArtwork++;
                    }
                    
                });
                break;
        }
        // Trim
        var nTrim = $('#divTrim').not('.hidetrim').length; //$(".divTrim").length;
        var Trim = new Array();
        var TrimColor = new Array();
        var contTrim = 1;

        //var ValTrim = ValidarTrim();

        if (ValTrim) {
                $(".divTrim").each(function () {
                    let divsinhide = this.classList.value.indexOf('hidetrim');
                    if (divsinhide < 0) {
                        let idestilotrim = this.getAttribute('data-id');
                        idestilotrim = (idestilotrim == '' || idestilotrim == null) ? 0 : idestilotrim;
                    let TrimDivid = $(this).attr("id"), TrimCode = $(this).find(".TrimCode")[0].value, TrimDescription = $(this).find(".TrimDescription")[0].value,
                        TrimPlacement = $(this).find(".TrimPlacement")[0].value, TrimSupplier = $(this).find(".TrimSupplier")[0].value, TrimStatus = $(this).find(".TrimStatus")[0].value,
                        TrimComment = $(this).find(".TrimComment")[0].value, TrimCost = $(this).find(".TrimCost")[0].value, TrimCostType = $(this).find(".TrimCostType")[0].value,
                        TrimMoneda = $(this).find(".TrimMoneda")[0].value, TrimIncoterm = $(this).find(".TrimIncoterm")[0].value, idtrim_maestra = this.getAttribute('data-idtrim'),
                        tipoproveedor = this.getElementsByClassName('cls_tipoproveedor_trim')[0].value;

                        if (TrimCost == "") {
                            TrimCost = "0";
                        }
                        var objTrim = {
                            idestilotrim: idestilotrim,
                            TrimCode: TrimCode,
                            TrimReference: contTrim,
                            TrimDescription: TrimDescription,
                            TrimPlacement: TrimPlacement,
                            TrimSupplier: TrimSupplier,
                            TrimStatus: TrimStatus,
                            TrimComment: TrimComment,
                            TrimCost: TrimCost,
                            TrimCostType: TrimCostType,
                            TrimMoneda: TrimMoneda,
                        TrimIncoterm: TrimIncoterm,
                        idtrim: idtrim_maestra,
                        tipoproveedor: tipoproveedor
                        }

                        Trim.push(objTrim);
                        var divColor = $(this).attr("data-divcolor");
                        var nColor = $("#" + divColor + " table >tbody >tr").length;
                        if (nColor > 0) {
                            $("#" + divColor + " table >tbody >tr").each(function () {
                                let idestilotrimcolor = this.getAttribute('data-id');
                                idestilotrimcolor = (idestilotrimcolor == '' || idestilotrimcolor == null) ? 0 : idestilotrimcolor;
                            let Color = $(this.cells[0]).find("input")[0].value, Status = $(this.cells[1]).find("select")[0].value, Comment = $(this.cells[2]).find("input")[0].value,
                                idtrim = this.getAttribute('data-idtrim'), idtrimcolor = this.getAttribute('data-idtrimcolor');
                            if (this.cells[3].getElementsByClassName('cls_chk_trim_colorselect')[0].checked) { // SI EL CHECK ESTA SELECCIONADO AGREGAR AL ARRAY
                                var objTrimColor = {
                                    idestilotrimcolor: idestilotrimcolor,
                                    Reference: contTrim,
                                    Color: Color,
                                    Status: Status,
                                    Comment: Comment,
                                    idtrim: idtrim,
                                    idtrimcolor: idtrimcolor
                                }
                                TrimColor.push(objTrimColor);
                            }
                            });
                        }
                        contTrim++;
                    }

                });
        }
        

        let objFabricCombo = getCadenaJson_FabricCombo();

        let objCombination = getCadenaJson_Combination_PaGrabar();

        var ProcessJSON = "";
        if (Process.length > 0) {
            ProcessJSON = JSON.stringify(Process);
        }

        var ArtworkJSON = "";
        if (Artwork.length > 0) {
            ArtworkJSON = JSON.stringify(Artwork);
        }

        var TrimJSON = "";
        if (Trim.length > 0) {
            TrimJSON = JSON.stringify(Trim);
        }

        var ArtworkColorJSON = "";
        if (ArtworkColor.length > 0) {
            ArtworkColorJSON = JSON.stringify(ArtworkColor);
        }

        var TrimColorJSON = "";
        if (TrimColor.length > 0) {
            TrimColorJSON = JSON.stringify(TrimColor);
        }

        var ProcessColorJSON = "";
        if (ProcessColor.length > 0) {
            ProcessColorJSON = JSON.stringify(ProcessColor);
        }

        var CalloutJSON = "";
        if (Callout.length > 0) {
            CalloutJSON = JSON.stringify(Callout);
        }

        //var FabricProcesJSON = "";
        //if (FabricProcess.length > 0) {
        //    FabricProcesJSON = JSON.stringify(FabricProcess);
        //}

        frm.append("EstiloImagen", $("#fupArchivo")[0].files[0]);

        var variable = $("#fupArchivo")[0].files[0]
        var _bImagen
        var _Nombre = "";
        var _strSrc = document.getElementById("imgEstilo").src;
        var _copyImagen = false;
        var _bActualizarImage = false
        if (typeof variable === "undefined" && _strSrc != '') {
            var v1 = _strSrc.split(";");
            var v2 = _strSrc.split(",");
            var _extension = (v1[0]).substr(-3);
            var _bytes = v2[1];
            if (!(typeof _bytes === "undefined")) {
                _copyImagen = true;
                _bActualizarImage = true;
                _bImagen = _bytes;
                _Nombre = "Image." + _extension;
                frm.append("ImagenNombre", _Nombre);
                frm.append("ImagenWebCopy", _bImagen);
            }
        }

        frm.append("ImageFabricCombo", $("#fupArchivo_fabric")[0].files[0]);

        var ImageFabricCombo = $("#fupArchivo_fabric")[0].files[0];
     
        _strSrc = document.getElementById("imgEstilo_fabric").src;
        _copyImagen = false;
        _bActualizarImage = false;
        _Nombre = "",_bImagen="";
        if (typeof ImageFabricCombo === "undefined" && _strSrc != '') {
            v1 = _strSrc.split(";");
            v2 = _strSrc.split(",");
            _extension = (v1[0]).substr(-3);
            _bytes = v2[1];
           
            if (!(typeof _bytes === "undefined")) {
                _copyImagen = true;
                _bActualizarImage = true;
                _bImagen = _bytes;
                _Nombre = "ImageFabricCombo." + _extension;
                frm.append("ImagenNombreFabricCombo", _Nombre);
                frm.append("ImagenWebFabricCombo", _bImagen);
            }
        }

        // ARCHIVOS PARA ESTILOS

        if ((contCambiosStyle > 0) || (CalloutJSON != "") || (telasJson != "") || (ProcessJSON != "") || (ArtworkJSON != "") || (TrimJSON != "") || (CalloutEliminadoJSON != "") || (FabricProjectEliminadoJSON != "") || (FabricCodeEliminadoJSON != "")
        || (ProcesoEliminadoJSON != "") || (ArtworkEliminadoJSON != "") || (TrimEliminadoJSON != "") || (TrimColorEliminadoJSON != "") || (ArtworkColorEliminadoJSON != "") || (FabricProcesJSON != "") || (ProcessColorJSON != "") || (ProcessColorEliminadoJSON != "") || (FabricProcessEliminadoJSON != "") || (objEstilo.Imagen == 1)) {
            frm.append("Estilo", JSON.stringify(objEstilo));
            frm.append("Callout", CalloutJSON);
            frm.append("Fabric", telasJson);
            frm.append("telascolor", telascolorJson); //
            frm.append("Process", ProcessJSON);
            frm.append("Artwork", ArtworkJSON);
            frm.append("Trim", TrimJSON);
            frm.append("ProcessColor", ProcessColorJSON);
            frm.append("ArtworkColor", ArtworkColorJSON);
            frm.append("TrimColor", TrimColorJSON);
            frm.append("ArtworkfileStr", FilesArtwork);
            frm.append("ProcessE", "");
            frm.append("ArtworkE", "");
            frm.append("TrimE", "");
            frm.append("ProcessColorE", "");
            frm.append("ArtworkColorE", "");
            frm.append("TrimColorE", "");
            frm.append("estiloxcombojson", objCombination.estiloxcombo);
            frm.append("estiloxcombocolorjson", objCombination.estiloxcombocolor);
            frm.append("estiloxfabriccombojson", objFabricCombo.estilofabricxcombo);
            frm.append("estiloxfabriccombocolorjson", objFabricCombo.estilofabricxcombocolor);
            frm.append("estilotechkpack", estiloTechpack);

            let tblbody_estilotechpack = _('tbody_tableestilotechpack'), arrrows_estilotechpack = Array.from(tblbody_estilotechpack.rows), contador = 0;
            arrrows_estilotechpack.forEach(x => {
                if (x.classList.value.indexOf('hide') < 0) {
                    let inputfile = x.getElementsByClassName('cls_tbl_estilotechpack_file')[0], arrfiles = inputfile !== undefined ? Array.from(inputfile.files) : null;
                    if (arrfiles !== null) {
                        arrfiles.forEach(f => {
                            contador++;
                            frm.append('fileestiloarchivo' + contador, f);
                        });
                    }
                }
            });

            Post('GestionProducto/Estilo/Save_edit_estilo', frm, Alerta);
        } else {
            $("#panStyle").click();
            var objmensaje = { mensaje: 'No changes to save !!!', estado: 'error' };
            //_mensaje(objmensaje);
            _swal(objmensaje, 'Alerta');
            return false;
        }
    } else {
        $("#panStyle").click();
        var objmensaje = { mensaje: 'Please enter all required fields (*) !!!', estado: 'error' };
        //_mensaje(objmensaje);
        _swal(objmensaje, 'Alerta');
        return false;
    }
}

function Alerta(data) {
    var rpta = JSON.parse(data);

    var objmensaje = { titulo: 'Alerta', mensaje: 'no se pudo registrar', estado: 'error' };

    objmensaje.mensaje = rpta.mensaje;
    objmensaje.estado = rpta.estado;
    let idestilo = rpta.id;

    if (objmensaje.estado != "error") {
        _swal({ estado: 'success', mensaje: 'Style was saved' });
        let urlaccion = 'GestionProducto/Estilo/New', urljs = 'GestionProducto/Estilo/New';
        switch (ovariables_estilo_new.accion) {
            case 'new':
                _Go_Url(urlaccion, urljs, 'accion:edit,idestilo:' + idestilo + ',idgrupocomercial:' + ovariables_estilo_new.idgrupocomercial);
                break;
            case 'edit':
                let par = _('txtpar').value;
                idestilo = _par(par, 'idestilo');
                _Go_Url(urlaccion, urljs, 'accion:edit,idestilo:' + idestilo + ',idgrupocomercial:' + ovariables_estilo_new.idgrupocomercial);
                break;
        }
        
        return false;
    }

    _mensaje(objmensaje);
}

function ValidarNumero(obj) {
    var value = $(obj).val();
    if (isNaN(value)) {
        $(obj).val("");
        return false;
    }
    return true;
}

function getArrayTelas(divtelas) {
    let contenedorTelas = _(divtelas), arrayDivTelas = _Array(contenedorTelas.getElementsByClassName('_clsdivtela')), contador = 0, orden = 0, arr = [],
        listacolor = [], objcolor = {}, objreturn = {};

    arrayDivTelas.forEach((x, index) => {
        let tienehide = x.classList.value.indexOf('hide');  // SI NO EXISTE EL HIDE SERA -1
        if (tienehide < 0) {  // SI TIEMNE HIDE ESTA ELIMINADO
            let par = x.getElementsByClassName('_clspar_tela')[0].value;
            let placement = x.getElementsByClassName('_clsPlacement')[0].value;
            let comentario = x.getElementsByClassName('_clsComentario')[0].value;
            let descripciontela = x.getElementsByClassName('_clsContenido')[0].value;
            // :NOTA: idestiloxtela este id se usa tanto para fichatecnica y proyectotela
            let idtela = _par(par, 'idtela'), origen = _par(par, 'origen'), idestiloxtela = _par(par, 'idestiloxtela'), 
                principal = 0;

            orden++;

            if (contador == 0) {
                principal = 1;
            }

            let obj = {
                idestiloxtela:idestiloxtela,
                idtela: idtela,
                orden: orden,
                placement: placement,
                comentario: comentario,
                origen: origen,
                principal: principal,
                descripciontela: descripciontela,
                idreferencia: index + 1
            };
            arr[contador] = obj;

            // COLOR
            let tbodytelacolor = x.getElementsByClassName('clstbodytelacolor')[0];
            if (tbodytelacolor != undefined) {
                let totalfilas = tbodytelacolor.rows.length;
                for (let i = 0; i < totalfilas; i++) {
                    let seleccionado = tbodytelacolor.rows[i].cells[5].children[0].checked;
                    if (seleccionado) {
                        let par_color = tbodytelacolor.rows[i].getAttribute('data-par');
                        let idtelalabdip = _par(par_color, 'idtelalabdip');
                        idtelalabdip = idtelalabdip == null ? 0 : idtelalabdip;
                        objcolor = {};
                        objcolor.idtelalabdip = idtelalabdip;
                        objcolor.idreferencia = index + 1;
                        objcolor.origen = origen;
                        listacolor.push(objcolor);
                    }
                }
            }
            
            contador++;
        }
    });

    objreturn.arraytelas = arr;
    objreturn.arraytelascolor = listacolor;
    return objreturn;
}

// SCRIPT DESDE EDIT
function ObtenerEstilo(data) {
    if (data != "") {
        var JSONdata = JSON.parse(data);
        ovariables_estilo_new.idgrupocomercial = JSONdata[0].idgrupocomercial;
        if (JSONdata[0].Estilo != "") {
            var Estilo = JSON.parse(JSONdata[0].Estilo), estilotechpack = JSONdata[0].estilotechpack !== '' ? CSVtoJSON(JSONdata[0].estilotechpack) : null;

            var Callout = "";
            var Fabric = "";
            var FabricProcess = "";
            var Proceso = "";
            var Artwork = "";
            var Trim = "";
            var ProcessColor = "";
            var ArtworkColor = "";
            var TrimColor = "";
            var Temporada = "";
            var Division = "";

            let trimscolor_maestra = JSONdata[0].trimscolor_maestra !== '' ? JSON.parse(JSONdata[0].trimscolor_maestra) : null;

            if (JSONdata[0].Temporada != "") {
                Temporada = JSON.parse(JSONdata[0].Temporada)
                $("#cboSeason").empty();
                var htmlTemporada = "<option value=''>Select One</option>" + _comboFromJSON(Temporada, "IdClienteTemporada", "CodigoClienteTemporada");
                $("#cboSeason").append(htmlTemporada);
            }

            if (JSONdata[0].Division != "") {
                Division = JSON.parse(JSONdata[0].Division)
                $("#cboDivision").empty();
                var htmlDivision = "<option value=''>Select One</option>" + _comboFromJSON(Division, "IdClienteDivision", "NombreDivision");
                $("#cboDivision").append(htmlDivision);
            }

            if (JSONdata[0].Programa != "") {
                Programa = JSON.parse(JSONdata[0].Programa)
                $("#cboProgram").empty();
                var htmlPrograma = "<option value=''>Select One</option>" + _comboFromJSON(Programa, "IdPrograma", "Nombre");
                $("#cboProgram").append(htmlPrograma);
            }

            if (JSONdata[0].Fabrica != "") {
                Fabrica = JSON.parse(JSONdata[0].Fabrica)
                $("#cboSupplier").empty();
                var htmlFabrica = "<option value='0'>Select One</option>" + _comboFromJSON(Fabrica, "IdProveedor", "NombreProveedor");
                $("#cboSupplier").append(htmlFabrica);
            }

            if (JSONdata[0].FabricProjectColor != "") {
                FabricProjectColor = JSON.parse(JSONdata[0].FabricProjectColor)
                $("#cboFabricProjectColorGeneral").empty();
                var htmlFabricProjectColor = "<option value='0'>Select One</option>" + _comboFromJSON(FabricProjectColor, "IdColor", "Color");
                $("#cboFabricProjectColorGeneral").append(htmlFabricProjectColor);
            }
            
            if (JSONdata[0].Callout != "") {
                Callout = JSON.parse(JSONdata[0].Callout)
            }

            if (JSONdata[0].Proceso != "") {
                Proceso = JSON.parse(JSONdata[0].Proceso)
            }

            if (JSONdata[0].Artwork != "") {
                Artwork = JSON.parse(JSONdata[0].Artwork)
            }

            if (JSONdata[0].Trim != "") {
                Trim = JSON.parse(JSONdata[0].Trim)
            }

            if (JSONdata[0].TrimColor != "") {
                TrimColor = JSON.parse(JSONdata[0].TrimColor)
            }

            if (JSONdata[0].ArtworkColor != "") {
                ArtworkColor = JSON.parse(JSONdata[0].ArtworkColor)
            }

            if (JSONdata[0].ProcesoColor != "") {
                ProcessColor = JSON.parse(JSONdata[0].ProcesoColor)
            }

            // Estilo
            //console.log(Estilo[0].IdCliente)
            _('hf_idestilo').value = Estilo[0].IdEstilo;
            //$("#hf_IdCliente").val(Estilo[0].IdCliente);
            //$("#txtCliente").val(Estilo[0].NombreCliente);
            $("#txtCode_estilo").val(Estilo[0].CodigoEstilo);
            $("#txtStyleDescription").val(Estilo[0].Descripcion);

            //version
            $('#txtVersion').val(Estilo[0].Version)
            //// NOTAS_HANGTAG
            _('txta_notashangtag').value = Estilo[0].notas_hangtag;

            //FItStatus
            $('#txtFitStatus').val(Estilo[0].FitStatus)

            $("#txtStyleDescription").attr("data-initial", Estilo[0].Descripcion);
            if (Estilo[0].IdClienteTemporada == 0) {
                _('cboSeason').selectedIndex = 0;
            } else {
                $("#cboSeason").val(Estilo[0].IdClienteTemporada);
                $("#cboSeason").attr("data-initial", Estilo[0].IdClienteTemporada);
            }
            
            if (Estilo[0].IdDivision == 0) {
                _('cboDivision').selectedIndex = 0;
            } else {
                $("#cboDivision").val(Estilo[0].IdDivision);
                $("#cboDivision").attr("data-initial", Estilo[0].IdDivision);
            }
            
            if (Estilo[0].Status == 0) {
                _('cboStatus').selectedIndex = 0;
            } else {
                $("#cboStatus").val(Estilo[0].Status);
                $("#cboStatus").attr("data-initial", Estilo[0].Status);
            }
            
            if (Estilo[0].IdPrograma == 0) {
                _('cboProgram').selectedIndex = 0;
            } else {
                $("#cboProgram").val(Estilo[0].IdPrograma);
                $("#cboProgram").attr("data-initial", Estilo[0].IdPrograma);
            }

            if (Estilo[0].IdProveedor == 0) {
                _('cboSupplier').selectedIndex = 0;
            } else {                 
                $("#cboSupplier").val(Estilo[0].IdProveedor).trigger('change');
                $("#cboSupplier").attr("data-initial", Estilo[0].IdProveedor);
            }
             
            // :EDU
            _('cboCliente').value = Estilo[0].IdCliente;

            if (Estilo[0].ImagenWebNombre != "") {
                var ruta = $("#txtRutaFileServer").val() + Estilo[0].ImagenWebNombre;
                $("#imgEstilo").attr("src", ruta);
                $("#imgEstilo").attr("data-initial", ruta);
                ovariables_estilo_new.imagen = Estilo[0].ImagenWebNombre;
            }

            // MINUTAJE
            _('txtminutaje').value = Estilo[0].minutaje;
            
            // IMAGE FABRIC COMBO
            if (Estilo[0].ImageFabricCombo != "") {
                var ruta = $("#txtFabricComboFileServer").val() + Estilo[0].ImageFabricCombo;
                $("#imgEstilo_fabric").attr("src", ruta);
                $("#imgEstilo_fabric").attr("data-initial", ruta);
            }
            _('txtFabricCombo').value = Estilo[0].DescriptionFabricCombo;
            // Callout
            if (Callout != "") {
                let nCallout = Callout.length, html = "";
                for (let i = 0; i < nCallout; i++) {
                    //html += "<tr data-status='old' data-id='" + Callout[i].IdEstiloCallout + "'><td><textarea class='form-control CalloutComment' data-initial='" + Callout[i].Comentario + "'>" + Callout[i].Comentario + "</textarea></td><td class='CalloutFecha'>" + Callout[i].Fecha + "</td><td class='CalloutUsuario'>" + Callout[i].Usuario + "</td><td class='text-center'><span class='glyphicon glyphicon-remove' style='display:none;cursor:pointer;font-size:15px;color:red;' onclick='EliminarCallout(this);'></span></td></tr>";
                    html += `
                        <tr data-status='old' data-id='${Callout[i].IdEstiloCallout}'>
                            <td>
                                <textarea class ='form-control CalloutComment' data-initial='${Callout[i].Comentario}'>${Callout[i].Comentario}</textarea>
                            </td>
                            <td class ='CalloutFecha'>${Callout[i].Fecha}</td>
                            <td class ='CalloutUsuario'>${Callout[i].Usuario}</td>
                            <td class ='text-center' style='vertical-align: middle;'>
                                <span class ='fa fa-times btn btn-sm btn-danger' title='Delete item' style='display:none;cursor:pointer;' onclick='EliminarCallout(this);'></span>
                            </td>
                        </tr>
                    `;
                }
                //$("#tblCallout tbody").append(html);
                _('tbody_callout').innerHTML = html
            }

            if (Proceso != "") {
                var nProceso = Proceso.length;
                var divId = "divProcess1";

                if (nProceso > 0) {
                    for (var i = 0; i < nProceso; i++) {

                        divId = AgregarProcesoE();
                        
                        let eleh = _(divId).getElementsByTagName('h3')[0];
                        eleh.innerText = 'Process ' + (i + 1);
                        $("#" + divId).attr("data-status", "old");
                        $("#" + divId).attr("data-id", Proceso[i].IdEstiloProceso);

                        var ProcessDescription = $("#" + divId).find(".ProcessDescription")[0];
                        var ProcessSupplier = $("#" + divId).find(".ProcessSupplier")[0];
                        var ProcessStatus = $("#" + divId).find(".ProcessStatus")[0];
                        var ProcessComment = $("#" + divId).find(".ProcessComment")[0];
                        var ProcessCost = $("#" + divId).find(".ProcessCost")[0];
                        var ProcessCostType = $("#" + divId).find(".ProcessCostType")[0];
                        var ProcessMoneda = $("#" + divId).find(".ProcessMoneda")[0];

                        $(ProcessDescription).val(Proceso[i].Descripcion);
                        $(ProcessDescription).attr("data-initial", Proceso[i].Descripcion);

                        if (Proceso[i].IdProveedor == 0) {
                            ProcessSupplier.selectedIndex = 0;
                        } else {
                            $(ProcessSupplier).val(Proceso[i].IdProveedor);
                            $(ProcessSupplier).attr("data-initial", Proceso[i].IdProveedor);
                        }
                        $(ProcessSupplier).trigger('change');
                        
                        $(ProcessStatus).val(Proceso[i].Status);
                        $(ProcessStatus).attr("data-initial", Proceso[i].Status);

                        $(ProcessComment).val(Proceso[i].Comentario);
                        $(ProcessComment).attr("data-initial", Proceso[i].Comentario);

                        $(ProcessCost).val(Proceso[i].Costo);
                        $(ProcessCost).attr("data-initial", Proceso[i].Costo);

                        $(ProcessCostType).val(Proceso[i].CostoUOM);
                        $(ProcessCostType).attr("data-initial", Proceso[i].CostoUOM);

                        $(ProcessMoneda).val(Proceso[i].CostoMoneda);
                        $(ProcessMoneda).attr("data-initial", Proceso[i].CostoMoneda);

                        var divColor = $("#" + divId).attr("data-divcolor");
                        
                        if (ProcessColor != "") {
                            var nProcessColor = ProcessColor.length;
                            if (nProcessColor > 0) {
                                var Filtro = ProcessColor.filter(function (e) { return (e.IdEstiloProceso === Proceso[i].IdEstiloProceso) });
                                var nFiltro = Filtro.length;
                                if (nFiltro > 0) {

                                    for (var x = 0; x < nFiltro; x++) {
                                        var idStatus = "StatusColor" + (x + 1);
                                        var htmlColor = "<input type='text' class='form-control Color' value='" + Filtro[x].Color + "' data-initial='" + Filtro[x].Color + "' />";
                                        var htmlStatus = "<select id='" + idStatus + "' data-initial='" + Filtro[x].Status + "' class='form-control StatusColor'>" + $("#cboStatusColor").html() + "</select>";
                                        html = "<tr data-status='old' data-id='" + Filtro[x].IdEstiloProcesoColor + "' >";
                                        html += "<td>" + htmlColor + "</td>";
                                        html += "<td>" + htmlStatus + "</td>";
                                        html += "<td><input type='text' class='form-control' data-initial='" + Filtro[x].Comentario + "' value='" + Filtro[x].Comentario + "'></td>";
                                        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarProcessColor(this);'></span></td>";
                                        html += "</tr>";
                                        $("#" + divId).find("table").append(html);
                                        $("#" + divId + " #" + idStatus).val(Filtro[x].Status);
                                    }
                                }
                            }
                        }

                    }
                }
            }

            if (Artwork != "") {
                var nArtwork = Artwork.length;
                var divId = "divArtwork1";
                if (nArtwork > 0) {
                    for (var i = 0; i < nArtwork; i++) {
                        divId = AgregarArtworkE();
                        //if (i > 0) {
                        //    divId = divId = AgregarArtworkE();
                        //}

                        let eleh = _(divId).getElementsByTagName('h3')[0];
                        eleh.innerText = 'Artwork ' + (i + 1);

                        $("#" + divId).attr("data-status", "old");
                        $("#" + divId).attr("data-id", Artwork[i].IdEstiloArte);

                        var ArtworkDescription = $("#" + divId).find(".ArtworkDescription")[0];
                        var ArtworkTechnique = $("#" + divId).find(".ArtworkTechnique")[0];
                        var ArtworkPlacement = $("#" + divId).find(".ArtworkPlacement")[0];
                        var ArtworkSupplier = $("#" + divId).find(".ArtworkSupplier")[0];
                        var ArtworkStatus = $("#" + divId).find(".ArtworkStatus")[0];
                        var ArtworkComment = $("#" + divId).find(".ArtworkComment")[0];
                        var ArtworkCost = $("#" + divId).find(".ArtworkCost")[0];
                        var ArtworkFileD = $("#" + divId).find(".ArtworkFileD")[0];
                        var ArtworkMoneda = $("#" + divId).find(".ArtworkMoneda")[0];


                        $(ArtworkDescription).val(Artwork[i].Descripcion);
                        $(ArtworkDescription).attr("data-initial", Artwork[i].Descripcion);

                        $(ArtworkTechnique).val(Artwork[i].Technique);
                        $(ArtworkTechnique).attr("data-initial", Artwork[i].Technique);

                        $(ArtworkPlacement).val(Artwork[i].Placement);
                        $(ArtworkPlacement).attr("data-initial", Artwork[i].Placement);
                        
                        if (Artwork[i].IdProveedor == 0) {
                            ArtworkSupplier.selectedIndex = 0;
                        } else {
                            $(ArtworkSupplier).val(Artwork[i].IdProveedor);
                            $(ArtworkSupplier).attr("data-initial", Artwork[i].IdProveedor);
                        }
                        $(ArtworkSupplier).trigger('change');
                    
                        $(ArtworkStatus).val(Artwork[i].Status);
                        $(ArtworkStatus).attr("data-initial", Artwork[i].Status);

                        $(ArtworkComment).val(Artwork[i].Comment);
                        $(ArtworkComment).attr("data-initial", Artwork[i].Comment);

                        $(ArtworkCost).val(Artwork[i].Costo);
                        $(ArtworkCost).attr("data-initial", Artwork[i].Costo);

                        $(ArtworkMoneda).val(Artwork[i].CostoMoneda);
                        $(ArtworkMoneda).attr("data-initial", Artwork[i].CostoMoneda);

                        if (Artwork[i].FileName != "") {
                            $(ArtworkFileD).text(Artwork[i].OriginalFileName);
                            $(ArtworkFileD).attr("data-file", Artwork[i].FileName);
                            $(ArtworkFileD).attr("data-fileo", Artwork[i].OriginalFileName);
                            _(divId).getElementsByClassName('ArtworkFileD')[0].classList.remove('hide');
                            //$(ArtworkFileD).show();
                        }
                        //else {
                            //$(ArtworkFileD).hide();
                        //}

                        var divColor = $("#" + divId).attr("data-divcolor");

                        if (ArtworkColor != "") {
                            var nArtworkColor = ArtworkColor.length;
                            if (nArtworkColor > 0) {
                                var Filtro = ArtworkColor.filter(function (e) { return (e.IdEstiloArte === Artwork[i].IdEstiloArte) });
                                var nFiltro = Filtro.length;
                                if (nFiltro > 0) {

                                    for (var x = 0; x < nFiltro; x++) {
                                        var idStatus = "StatusColor" + (x + 1);
                                        var htmlColor = "<input type='text' class='form-control Color' value='" + Filtro[x].Color + "' data-initial='" + Filtro[x].Color + "' />";
                                        var htmlStatus = "<select id='" + idStatus + "' data-initial='" + Filtro[x].Status + "' class='form-control StatusColor'>" + $("#cboStatusColor").html() + "</select>";
                                        html = "<tr data-status='old' data-id='" + Filtro[x].IdEstiloArteColor + "' >";
                                        html += "<td>" + htmlColor + "</td>";
                                        html += "<td>" + htmlStatus + "</td>";
                                        html += "<td><input type='text' class='form-control' data-initial='" + Filtro[x].Comentario + "' value='" + Filtro[x].Comentario + "'></td>";
                                        html += "<td class='text-center'><span class='fa fa-remove' style='cursor:pointer;font-size:15px;color:red;' onclick='EliminarArtworkColor(this);'></span></td>";
                                        html += "</tr>";
                                        $("#" + divId).find("table").append(html);
                                        $("#" + divId + " #" + idStatus).val(Filtro[x].Status);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (Trim != "") {
                pintar_trims_iniedit(Trim, TrimColor, trimscolor_maestra);

            }

            // :EDU TELAS
            if (JSONdata[0].telas != '') {
                let dataTelas = JSON.parse(JSONdata[0].telas), datacolortelafichatecnica = CSVtoJSON(JSONdata[0].colorfichatecnica), datacolorproyectotela = CSVtoJSON(JSONdata[0].colorproyectotela),
                    dataproyectotelaxproceso = JSONdata[0].proyectotelaproceso != '' ? CSVtoJSON(JSONdata[0].proyectotelaproceso) : null;

                pintarDivTela_iniedit(dataTelas, datacolortelafichatecnica, datacolorproyectotela, dataproyectotelaxproceso);
            }
            //  FABRIC COMBO
            //if (JSONdata[0].estiloxFabricCombo != '') {
            //    let dataestiloxcombo = JSON.parse(JSONdata[0].estiloxFabriccombo), dataestiloxcombocolor = CSVtoJSON(JSONdata[0].estiloxcombocolor);
            //    pintarDivEstiloxCombo(dataestiloxcombo, dataestiloxcombocolor);
            //}
            // :EDU COMBINATION
            if (JSONdata[0].estiloxcombo != '') {
                let dataestiloxcombo = JSON.parse(JSONdata[0].estiloxcombo), dataestiloxcombocolor = CSVtoJSON(JSONdata[0].estiloxcombocolor);
                pintarDivEstiloxCombo(dataestiloxcombo, dataestiloxcombocolor);
            }

            if (JSONdata[0].estiloxfabriccombo != '') {
                let dataestiloxcombo = JSON.parse(JSONdata[0].estiloxfabriccombo), dataestiloxcombocolor = CSVtoJSON(JSONdata[0].estiloxfabriccombocolor);
                pintarDivEstiloxfabricCombo(dataestiloxcombo, dataestiloxcombocolor);
            }

            // CREAR TABLE SAMPLE
            if (JSONdata[0].Sample != '') {                
                sample = CSVtoJSON(JSONdata[0].Sample)            
                llentarTablaSample(sample);
            }

            //intranet
            if (JSONdata[0].estilointranet != '') {
                ovariables_estilo_new.estilointranet = JSON.parse(JSONdata[0].estilointranet);              
            }
            if (JSONdata[0].colorintranet != '') {
                ovariables_estilo_new.colorintranet = CSVtoJSON(JSONdata[0].colorintranet);
            }            

            // LLENAR TABLA ESTILO TECHPACK
            if (estilotechpack !== null) {
                llenartablaestilotechpack_ini(estilotechpack);
            }
        }
    }
}

function llenartablaestilotechpack_ini(odata) {
    let html = '';
    odata.forEach(x => {
        let disabled = '', hide = '';
        if (x.origen === 'requerimiento') {
            hide = 'hide';
        }
        html += `
            <tr data-par='accion:edit,idestilotechpack:${x.idestilotechpack},nombrearchivogenerado:${x.nombrearchivo},nombrearchivooriginal:${x.nombrearchivooriginal},origen:${x.origen}' data-estado=''>
                <td class ='text-center cls_td_estilotechpack_botones' style='vertical-align: middle;'>
                    <button class ='btn btn-sm btn-danger cls_delete_estilotechpack ${hide}'>
                        <span class ='fa fa-trash-o'></span>
                    </button>
                </td>
                <td class ='text-center cls_estilotechpack_nombrefile' style='vertical-align: middle;'>
                    <div class ='input-group'>
                        ${x.nombrearchivooriginal}
                        <span type='button' class ='btn btn-sm bg-success cls_btn_estilotechpack_download input-group-addon' title='download'>
                            <span class ='fa fa-download'></span>
                        </span>
                    </div>

                </td>
                <td style='vertical-align: middle;'>${x.usuario}</td>
                <td class ='text-center' style='vertical-align: middle;'> ${x.fecha} </td>`;
        disabled = '';
        hide = '';
        if (x.origen === 'requerimiento') {
            disabled = 'disabled';
            hide = 'hide';
        }
        html += `
                <td><textarea class ='form-control cls_estilotechpack_comentario' rows='2' ${disabled} data-inicial='${x.comentario}'>${x.comentario}</textarea></td>
                <td class ='text-center' style='vertical-align: middle;'>
                    <button class ='btn btn-sm btn-primary cls_tbl_estilotechpack_send ${hide}'>
                        <span class ='fa fa-paper-plane-o'></span>
                    </button>
                </td>
            </tr>
        `;
    });
    _('tbody_tableestilotechpack').innerHTML = html;
    handler_tbl_estilotechpack_ini();
}

function handler_tbl_estilotechpack_ini() {
    let tblbody = _('tbody_tableestilotechpack'), arrrows = Array.from(tblbody.rows);
    arrrows.forEach(x => {
        let txtcomentario = x.getElementsByClassName('cls_estilotechpack_comentario')[0];
        txtcomentario.addEventListener('blur', fn_blur_comentario_estilotechpack);

        let btndelete = x.getElementsByClassName('cls_delete_estilotechpack')[0];
        btndelete.addEventListener('click', fn_delete_estilotechpack_file);

        let btndownload = x.getElementsByClassName('cls_btn_estilotechpack_download')[0];
        btndownload.addEventListener('click', fn_download_estilotechpack);

        let btnenviarcorreo = x.getElementsByClassName('cls_tbl_estilotechpack_send')[0];
        btnenviarcorreo.addEventListener('click', fn_enviarcorreo_estilotechpack);
    });
}

function fn_enviarcorreo_estilotechpack(e) {
    let o = e.currentTarget, fila = o.parentNode.parentNode, par = fila.getAttribute('data-par'),
        nombrearchivogenerado = _par(par, 'nombrearchivogenerado'), nombrearchivooriginal = _par(par, 'nombrearchivooriginal'), par_estilo = _('txtpar').value,
        idgrupocomercial = _par(par_estilo, 'idgrupocomercial'), idcliente = _('cboCliente').value, idproveedor = _('cboSupplier').value, 
        idestilotechpack = _par(par, 'idestilotechpack');

    _modalBody({
        url: 'GestionProducto/Estilo/_EnviarCorreoTechpack',
        ventana: '_EnviarCorreoTechpack',
        titulo: 'Send mail',
        parametro: `nombrearchivogenerado:${nombrearchivogenerado},nombrearchivooriginal:${nombrearchivooriginal},idgrupocomercial:${idgrupocomercial},idcliente:${idcliente},idproveedor:${idproveedor},idestilotechpack:${idestilotechpack}`,
        ancho: '',
        alto: '',
        responsive: 'modal-lg'
    });
}

function fn_download_estilotechpack(e) {
    let link = document.createElement('a'), o = e.currentTarget, fila = o.parentNode.parentNode.parentNode,
        par = fila.getAttribute('data-par'), nombrearchivooriginal = _par(par, 'nombrearchivooriginal'), nombrearchivogenerado = _par(par, 'nombrearchivogenerado'), origen = _par(par, 'origen');
    link.href = urlBase() + 'GestionProducto/Estilo/DownloadFileEstiloTechpack?nombrearchivogenerado=' + nombrearchivogenerado + '&nombrearchivooriginal=' + nombrearchivooriginal + '&origen=' + origen;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
        }

function fn_blur_comentario_estilotechpack(e){
    let o = e.currentTarget, datainicial = o.getAttribute('data-inicial'), fila = null;
    fila = o.parentNode.parentNode;
    if (datainicial !== o.value) {
        fila.setAttribute('data-estado', 'edit');
    } else {
        fila.setAttribute('data-estado', '');
    }
}

function ObtenerDatosCarga_edit(data) {
    var JSONdata = JSON.parse(data);
    var Cliente = JSON.parse(JSONdata[0].Cliente);
    var Familia = JSON.parse(JSONdata[0].Familia);
    var Proveedor = JSON.parse(JSONdata[0].Proveedor);
    var UnidadMedida = JSON.parse(JSONdata[0].UnidadMedida);
    var Moneda = JSON.parse(JSONdata[0].Moneda);
    var FabricProcess = JSON.parse(JSONdata[0].FabricProcess);
    var StatusEstilo = JSON.parse(JSONdata[0].StatusEstilo);
    var StatusTabs = JSON.parse(JSONdata[0].StatusTabs);

    var htmlCliente = _comboFromJSON(Cliente, "IdCliente", "NombreCliente");
    $("#cboCliente").append(htmlCliente);
    var htmlFamilia = _comboFromJSON(Familia, "IdFamilia", "NombreFamilia");
    $("#cboFamilia").append(htmlFamilia);
    var htmlProveedor = _comboFromJSON(Proveedor, "IdProveedor", "NombreProveedor");
    $("#cboProcessSupplier").append(htmlProveedor);
    $("#cboArtworkSupplier").append(htmlProveedor);

    ////$("#cboFabricSupplier").append(htmlProveedor);

    var htmlUnidadMedida = _comboFromJSON(UnidadMedida, "IdUnidadMedida", "Simbolo");
    $("#cboProcessUnidadMedida").append(htmlUnidadMedida);
    //$("#cboTrimUnidadMedida").append(htmlUnidadMedida);
    ovariables_estilo_new.datalst_unidadmedida_combo = UnidadMedida;

    var htmlMoneda = _comboFromJSON(Moneda, "IdMoneda", "Codigo");
    $("#cboProcessMoneda").append(htmlMoneda);
    $("#cboArtworkMoneda").append(htmlMoneda);
    //$("#cboTrimMoneda").append(htmlMoneda);
    ovariables_estilo_new.datalst_tipomoneda_combo = Moneda;

    var htmlFabricProcess = _comboFromJSON(FabricProcess, "ValorEstado", "NombreEstado");
    $("#cboFabricProcess").append(htmlFabricProcess);

    var htmlStatusEstilo = _comboFromJSON(StatusEstilo, "ValorEstado", "NombreEstado");
    $("#cboStatus").append(htmlStatusEstilo);

    // COMBOS ESTADOS
    var htmlStatusTab = _comboFromJSON(StatusTabs, "ValorEstado", "NombreEstado");
    $("#cboStatusColor").append(htmlStatusTab);
    $("#cboStatusArtwork").append(htmlStatusTab);
    $("#cboStatusProcess").append(htmlStatusTab);
    $("#cboStatusTrim").append(htmlStatusTab);
    ovariables_estilo_new.datalst_estados_combo = StatusTabs;
}

function pintarDivTela_iniedit(data, datacolorfichatecnica, datacolorproyectotela, dataproyectotelaxproceso) {
    let orpta = data != null ? data : null, html = '', numeradordiv = 0;
    if (orpta != null) {
        orpta.forEach(x => {
            numeradordiv++;
            // DATOS DE LA TELA
            let nombreproveedor = x.nombreproveedor, codigotela = x.codigotela, descripcionbody = '',
                familia = x.nombrefamilia, titulo = x.titulo, descripciontela = x.nombretela, peso = x.peso, lavado = x.lavado,
                idtela = x.idfichatecnica, strdisable = '', origen = x.origen, idestiloxtela = x.idestiloxtela, comentario = x.comentario, placement = x.placement, ocultardeletetela = '',
                    estadotela = x.estadotela, dyeingprocess = x.dyeingprocess;

            if (numeradordiv == 1) {
                descripcionbody = 'Body';
                strdisable = 'disabled';
                ocultardeletetela = 'hide';
                ovariables_estilo_new.telaprincipal = origen == 'fichatecnica' ? codigotela : ''
                //ovariables_estilo_new.telaprincipal = codigotela;
            }

            html += `
                <div class ="col-sm-6 _clsdivtela _eliminado">
                                                <div class ="panel panel-default">
                                                    <div class ="panel-heading">
                                                        <div class ="row" style="vertical-align: middle;">
                                                            <div class ="col-sm-6">
                                                                <h3>fabric ${numeradordiv}</h3>
                                                            </div>
                                                            <div class ="col-sm-6 text-right">
                                                                <button type="button" class ="btn btn-primary btn-sm _clsedittela">
                                                                    <span class ="fa fa-edit"></span>
                                                                    edit
                                                                </button>
                                                                <button class ="btn btn-danger btn-sm _clsdeletetela ${ocultardeletetela}" type="button">
                                                                    <span class ="fa fa-trash-o"></span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class ="panel-body">
                                                        <div class ='hide'>
                                                            //<input type='text' id='hf_idtela' value='${idtela}' />
                                                            //<input type='text' id='hf_origen' value='${origen}' />
                                                            <input type='text' class ='_clspar_tela' id='txtpar_tela' value='idtela:${idtela},origen:${origen},idestiloxtela:${idestiloxtela}' />
                                                        </div>
                                                        <div id="divFabric" class ="form-horizontal divFabric">
                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Fabric Reference: </label>
                                                                <div class ="col-sm-10">
                                                                    <input type='text' name="txtFabricReference" class ="form-control _clscodigotela" disabled="disabled" value='${codigotela}' />
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Supplier: </label>
                                                                <div class ="col-sm-10">
                                                                    <input id="txtFabricSupplier" class ="form-control _clsnombreproveedor" disabled="disabled" value='${nombreproveedor}' />
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Placement: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtPlacement" class ="form-control _clsPlacement" ${strdisable} value='${placement}' />
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Construction: </label>
                                                                <div class ="col-sm-10">
                                                                    <textarea name="txtConstruction" disabled="disabled" class ="form-control _clsnombrefamilia" rows="2" cols="8">${familia}</textarea>
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Yarn: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtYarn" disabled="disabled" class ="form-control _clstitulo" value='${titulo}' />
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="col-sm-2 control-label">Content: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtContent" disabled="disabled" class ="form-control _clsContenido" value='${descripciontela}' />
                                                                </div>
                                                            </div>

                                                            <div class ="form-group">
                                                                <label class ="control-label col-sm-2">Weight: </label>
                                                                <div class ="col-sm-5">
                                                                    <input name="txtWeight" class ="form-control _clspeso" disabled="disabled" value="${peso}" type="text"  />
                                                                </div>
                                                                <div class ="col-sm-3">
                                                                    <input name="txtLavado" disabled="disabled" class ="form-control _clslavado" value='${lavado}' />
                                                                </div>
                                                            </div>

                                                            <div class ="form-group">
                                                                <label class ="col-sm-2 control-label">Status: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtStatus" disabled="disabled" class ="form-control FabricStatus" value='${estadotela}' />
                                                                </div>
                                                            </div>
                                                            <div class ="form-group">
                                                                <label class ="col-sm-2 control-label">Comments: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtComents"  onkeyup='Mayus(this)' class ="form-control _clsComentario" value='${comentario}' />
                                                                </div>
                                                            </div>
                                                             <div class ="form-group">
                                                                <label class ="col-sm-2 control-label">Dyeing Process: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtDyeingProcess" disabled="disabled" class ="form-control _clsDyeingProcess" value='${dyeingprocess}' />
                                                                </div>
                                                            </div>
                                                        </div>`;

            // ACA INICIO LA TABLA DE PROYECTO TELA PROCESO
            let htmlproceso = crearcadenahtml_tabladetalleproyectostelaproceso_x_tela(dataproyectotelaxproceso, origen, idtela);
            html += htmlproceso;
            //  FIN DIV PROYECTO TELA X PROCESO

                                                        // ACA INICIO DE LA TABLA DE COLORES
            let htmlcolores = crearcadenahtml_tabladetallecolores_x_tela(datacolorfichatecnica, datacolorproyectotela, origen, idtela, x);
            html += htmlcolores;
                                                        // ACA FIN DE LA TABLA DE COLORES
                                                        
                                                        html +=
                                                        `
                                                    </div>
                                                </div>
                                            </div>
            `;
        });
        _('div_principal_paneltelas').innerHTML = html;
        handlerDivTelas();
    }
}

function pintarDivEstiloxfabricCombo(data, datacolor) {
    let orpta = data != null ? data : null, html = '', numeradordiv = 0, contador = 1, orptacolor = datacolor != null ? datacolor : null;
    if (orpta != null) {
        orpta.forEach((x, index) => {
            contador++;
            let divfabriccombo = _('divFabricCombo');
            let html = divfabriccombo.getElementsByClassName('hideFabriccombo')[0].outerHTML;

            //var contadorArtwork = parseInt($("#hfArtworkContador").val()) + 1;
            $("#hfFabricComboContador").val(contador);
            var divId = "divFabricCombo" + contador;
            var divfabriccomboColor = "divFabricComboColor" + contador;
            var txt = "txtDescriptionFabric" + contador;
            var idbtn = "btnFCombo" + contador;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace('data-btn=""', 'data-btn="' + contador + '"');
            html = html.replace(/divFabricComboColor1/g, divfabriccomboColor);
            html = html.replace(/txtDescriptionFabric1/g, txt);
            html = html.replace(/btnFCombo1/g, idbtn);
            $("#divFabricCombo").append(html);
            let ultimodiv = divfabriccombo.lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hideFabriccombo');

            $("#" + divfabriccomboColor).find("table tbody").empty();
            
            //
            let eleh = _(divId).getElementsByTagName('h3')[0];
            eleh.innerText = 'Combo ' + (index + 1);
            _(divId).setAttribute('data-id', x.idestilofabriccombo);
            _(divId).getElementsByClassName('ComboFabricDescription')[0].value = x.descripcion;

            let listacolor = [], html_color = '';
            if (orptacolor != null) {
                listacolor = orptacolor.filter(y => y.idestilofabriccombo == x.idestilofabriccombo);
                let options = $('#cboFabricProjectColorGeneral').html();
                if (listacolor.length > 0) {
                    listacolor.forEach(y => {
                        html_color += `<tr data-id='id:${y.idestilofabriccombocolor},idcolor:${y.idcolor}'>
                                    <td><input onkeyup='Mayus(this)' type='text' class ='form-control' value='${y.position}' /></td>
                                    <td><select id='fabriccombocolor' class ='form-control fabriccombocolor'>${options}</select></td>
                                    <td class='text-center' style='vertical-align: middle;'><span class ="fa fa-remove" style="cursor:pointer;font-size:15px;color:red;" onclick="EliminarProcessColor(this);"></span></td>
                        </tr>
                        `;
                        //value='${y.idcolor}'
                        

                        //if (y.idcolor == 0) {
                        //    y.idcolor.selectedIndex = 0;
                        //} else {
                        //    $("#fabriccombocolor").val(y.idcolor);
                        //}
                        //$("#fabriccombocolor").trigger('change');
                    });
                    //$(".fabriccombocolor").select2();
                  
                    _(divId).getElementsByClassName('clstbodyFabriccombocolor')[0].innerHTML = html_color;
                    
                    let tblbody = _(divId).getElementsByClassName('clstbodyFabriccombocolor')[0], arrfilas = [...tblbody.rows];
                    arrfilas.forEach(x => {
                        let par = x.getAttribute('data-id');
                        x.getElementsByClassName('fabriccombocolor')[0].value = _par(par, 'idcolor');
                    });
                    $("#" + divId + " #fabriccombocolor").select2();
                   
                }
            }
        });
    }
}

function pintarDivEstiloxCombo(data, datacolor) {
    let orpta = data != null ? data : null, html = '', numeradordiv = 0, contador = 1, orptacolor = datacolor != null ? datacolor : null;
    if (orpta != null) {
        orpta.forEach((x, index) => {
            contador++;
            let divproceso = _('divCombo');
            let html = divproceso.getElementsByClassName('hidecombo')[0].outerHTML;

            //var contadorArtwork = parseInt($("#hfArtworkContador").val()) + 1;
            $("#hfComboContador").val(contador);
            var divId = "divCombo" + contador;
            var divArtworkColor = "divComboColor" + contador;
            html = html.replace('data-div=""', 'data-div="' + divId + '"');
            html = html.replace(/divComboColor1/g, divArtworkColor);
            $("#divCombo").append(html);
            let ultimodiv = divproceso.lastChild;
            ultimodiv.setAttribute('id', divId);
            ultimodiv.classList.remove('hidecombo');

            $("#" + divArtworkColor).find("table tbody").empty();

            //
            let eleh = _(divId).getElementsByTagName('h3')[0];
            eleh.innerText = 'Combo ' + (index + 1);
            _(divId).setAttribute('data-id', x.idestilocombo);
            _(divId).getElementsByClassName('ComboDescription')[0].value = x.descripcion;

            let listacolor = [], html_color = '';
            if (orptacolor != null) {
                listacolor = orptacolor.filter(y => y.idestilocombo == x.idestilocombo);
                if (listacolor.length > 0) {
                    listacolor.forEach(y => {
                        html_color += `<tr data-id='${y.idestilocombocolor}'>
                                    <td><button type="button" onclick="ConfColorName(this,1)" class ="btn btn-success btn-xs">Color Name</button></td>
                                    <td><input type='text' onkeyup='Mayus(this)' class ='form-control gcbomboComentario' value='${y.comentario}' /></td>
                                    <td><input type='text' onkeyup='Mayus(this)' class ='form-control gcbomboColor' value='${y.color}' /></td>
                                    <td class='text-center' style='vertical-align: middle;'><span class ="fa fa-remove" style="cursor:pointer;font-size:15px;color:red;" onclick="EliminarProcessColor(this);"></span></td>
                        </tr>
                        `;
                    });
                    _(divId).getElementsByClassName('clstbodycombocolor')[0].innerHTML = html_color;
                }
            }
        });
    }
}
 

function handlerDivTelas() {
    let divtelas = _('div_principal_paneltelas'), arrayDivTelas = _Array(divtelas.getElementsByClassName('_clsedittela')),
        arrayDeleteTelas = _Array(divtelas.getElementsByClassName('_clsdeletetela'));

    arrayDivTelas.forEach((x, ind) => x.addEventListener('click', e => {
        eventoDivTelas(e, 'edit', ind);
    }));

    arrayDeleteTelas.forEach((x, ind) => x.addEventListener('click', e => {
        eventoDivTelas(e, 'delete', ind);
    }));
}

function handlerDivTelas_new() {
    let divtelas = _('div_principal_paneltelas'), arrayDivTelas = _Array(divtelas.getElementsByClassName('_clsedittela')), totaldivs = arrayDivTelas.length,
        index = totaldivs - 1, arrayDeleteTelas = _Array(divtelas.getElementsByClassName('_clsdeletetela'));

    arrayDivTelas[index].addEventListener('click', function (e) {
        eventoDivTelas(e, 'edit', index);
    });

    arrayDeleteTelas.forEach((x, ind) => x.addEventListener('click', e => {
        eventoDivTelas(e, 'delete', ind);
    }));
}

function eventoDivTelas(event, accion, indice) {
    let o = event.target, tag = o.tagName, divpadre_tela = null;
    if (accion == 'edit' || accion == 'delete') {
        switch (tag) {
            case 'BUTTON':
                divpadre_tela = o.parentNode.parentNode.parentNode.parentNode.parentNode;
                break;
            case 'SPAN':
                divpadre_tela = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                break;
        }

        if (accion == 'edit') {
            if (divpadre_tela != null) {
                editarTela(divpadre_tela, indice);
            }
        } else if (accion == 'delete') {
            if (divpadre_tela != null) {
                eliminarTela(divpadre_tela);
            }
        }
    }
}

function editarTela(divpadretela, indice) {
    let idtela = divpadretela.getElementsByClassName('_clspar_tela')[0];
    _('hf_accion_editartela').value = 'edit';
    _('hf_idtela_editando').value = idtela;
    _('hf_indice_divtela_editando').value = indice;
    $('#modal_buscartela').modal('show');
}

function eliminarTela(divpadretela) {
    divpadretela.classList.add('hide');
}

function AgregarProcesoE() {
    let divproceso = _('divProcess');
    let html = divproceso.getElementsByClassName('hideproceso')[0].outerHTML;

    var contadorProcess = parseInt($("#hfProcesoContador").val()) + 1;
    $("#hfProcesoContador").val(contadorProcess);
    var divId = "divProcess" + contadorProcess;
    var divProcessColor = "divProcesoColor" + contadorProcess;
    html = html.replace('data-div=""', 'data-div="' + divId + '"');
    html = html.replace(/divProcesoColor1/g, divProcessColor);
    html = html.replace(/hideproceso/g, '');
    //html = "<div id='" + divId + "' class='form-horizontal divProcess' style='float:left;margin-top:15px;margin-left:15px;width:48%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
    // ya no va html = "<div id='" + divId + "'>" + html + "</div>";
    $("#divProcess").append(html);
    let ultimodiv = _('divProcess').lastChild;
    ultimodiv.setAttribute('id', divId);
    ultimodiv.classList.remove('hideproceso');
    $("#" + divId + " #cboProcessSupplier").select2();
    if (screen.width == 1366 || screen.width == 1360) { // CAMBIO DE ANCHO DEL COMBO PROVEEDOR POR USAR LIBRERIA DE INSPINIA
        _(divId).getElementsByClassName('select2-container')[0].style.width = "290px";
    } else {
    _(divId).getElementsByClassName('select2-container')[0].style.width = "470px";
    }        
    return divId;
}

function AgregarArtworkE() {
    //var html = $("#divArtwork1").html();
    let divproceso = _('divArtwork');
    let html = divproceso.getElementsByClassName('hideatwork')[0].outerHTML;

    var contadorArtwork = parseInt($("#hfArtworkContador").val()) + 1;
    $("#hfArtworkContador").val(contadorArtwork);
    var divId = "divArtwork" + contadorArtwork;
    var divArtworkColor = "divArtworkColor" + contadorArtwork;
    html = html.replace('data-div=""', 'data-div="' + divId + '"');
    html = html.replace(/divArtworkColor1/g, divArtworkColor);
    //html = "<div id='" + divId + "' class='form-horizontal divArtwork' data-divcolor='" + divArtworkColor + "' style='float:left;margin-top:15px;margin-left:15px;width:60%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
    $("#divArtwork").append(html);
    let ultimodiv = divproceso.lastChild;
    ultimodiv.setAttribute('id', divId);
    ultimodiv.classList.remove('hideatwork');

    $("#" + divArtworkColor).find("table tbody").empty();
    $("#" + divId + " #cboArtworkSupplier").select2();
    if (screen.width == 1366 || screen.width == 1360) { // CAMBIO DE ANCHO DEL COMBO PROVEEDOR POR USAR LIBRERIA DE INSPINIA
        _(divId).getElementsByClassName('select2-container')[0].style.width = "290px";
    } else {
    _(divId).getElementsByClassName('select2-container')[0].style.width = "470px";
    }
    
    return divId;
}

function AgregarTrimE() {
    //var html = $("#divTrim1").html();
    let divtrim = _('divTrim');
    let html = divtrim.getElementsByClassName('hidetrim')[0].outerHTML;

    var contadorTrim = parseInt($("#hfTrimContador").val()) + 1;
    $("#hfTrimContador").val(contadorTrim);
    var divId = "divTrim" + contadorTrim;
    var divTrimColor = "divTrimColor" + contadorTrim;
    html = html.replace('data-div=""', 'data-div="' + divId + '"');
    html = html.replace(/divTrimColor1/g, divTrimColor);
    //html = "<div id='" + divId + "' class='form-horizontal divTrim' data-divcolor='" + divTrimColor + "' style='float:left;margin-top:15px;margin-left:15px;width:60%;border:1px solid #e7eaec;padding:15px;'>" + html + "</div>";
    $("#divTrim").append(html);
    
    let ultimodiv = divtrim.lastChild;
    ultimodiv.setAttribute('id', divId);
    ultimodiv.classList.remove('hidetrim');

    $("#" + divTrimColor).find("table tbody").empty();
    return divId;
}

function EliminarArtworkColor(obj) {
    //var tr = $(obj).closest('tr');
    //var ArtworkColorId = $(tr).attr("data-id");

    //if (ArtworkColorId > 0) {
    //    var objArtworkColorEliminado = {
    //        Id: ArtworkColorId
    //    }
    //    ArtworkColorEliminado.push(objArtworkColorEliminado);
    //}

    $(obj).closest('tr').remove();
}

function DescargarArtworkFile(obj) {
    var filename = $(obj).attr("data-file");
    var OriginalFileName = $(obj).attr("data-fileo");

    var url = urlBase() + "GestionProducto/Estilo/Descargar?filename=" + filename + "&originalfilename=" + OriginalFileName;

    var link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function crearcadenahtml_tabladetallecolores_x_tela(datacolorfichatecnica, datacolorproyectotela, origen, idtela, dataestiloxtela) {
    let html = '';
    // ACA INICIO DE LA TABLA DE COLORES
    html += `
        <div class ='col-sm-12'>
            <table class='table table-bordered'>
                <thead>
                    <tr>
                        <th style="width:10%"></th>
                        <th style="width:20%">Color</th>
                        <th style="width:20%">Type</th>
                        <th style="width:10%">Approval by</th>
                        <th style="width:30%">Status</th>
                        <th style="width:5%"></th>
                    </tr>
                </thead>
                <tbody class='clstbodytelacolor'>
        `;


    let htmlcolor = '', miarray = [];
    if (origen == 'fichatecnica') {
        miarray = datacolorfichatecnica.filter(y => y.idfichatecnica == idtela && y.idestiloxtela == dataestiloxtela.idestiloxtela)
        for (let i = 0; i < miarray.length; i++) {
            let cadenacheckcolor = parseInt(miarray[i].tieneestiloxtela_labdip) == 0 ? '' : 'checked';
            htmlcolor += `<tr data-par='idtelalabdip:${miarray[i].idtelalabdip}'>
                            <td><button type="button" onclick="ConfColorName(this,2)" class ="btn btn-xs btn-success">Color Name</button></td>
                            <td>${miarray[i].color}</td>
                            <td>${miarray[i].tipolabdip}</td>
                            <td>${miarray[i].aprobadopor}</td>
                            <td>${miarray[i].estadolabdip}</td>
                            <td class='text-center'>
                                <input type='checkbox' name='selectcolortela' class ='clsselectcolortela' ${cadenacheckcolor} style='width: 20px; height: 20px;' />
                            </td>
                        </tr>
            `
        }
    }

    if (origen == 'proyecto') {
        miarray = datacolorproyectotela.filter(y => y.idproyectotela == idtela && y.idestiloxtela == dataestiloxtela.idestiloxtela)
        for (let i = 0; i < miarray.length; i++) {
            let cadenacheckcolor = parseInt(miarray[i].tieneestiloxtela_labdip) == 0 ? '' : 'checked';
            htmlcolor += `<tr data-par='idtelalabdip:${miarray[i].idtelalabdip}'>
                            <td><button type="button"  onclick="ConfColorName(this,2)" title= "add color to style" class ="btn btn-xs  btn-success">Color Name</button></td>
                            <td>${miarray[i].color}</td>
                            <td>${miarray[i].tipolabdip}</td>
                            <td>${miarray[i].aprobadopor}</td>
                            <td>${miarray[i].estadolabdip}</td>
                            <td class='text-center'>
                                <input type='checkbox' name='selectcolortela' class ='clsselectcolortela' ${cadenacheckcolor} style='width: 20px; height: 20px;' />
                            </td>
                        </tr>
            `
        }
    }
    html += htmlcolor;

    html += `
                </tbody>
            </table>
        </div>`;
    // ACA FIN DE LA TABLA DE COLORES
    return html;
}

function crearcadenahtml_tabladetalleproyectostelaproceso_x_tela(dataproyectotelaxproceso, origen, idtela) {
    let html = '';
    // ACA INICIO LA TABLA DE PROYECTO TELA PROCESO
    html += `<div class ='col-sm-12'>
                <table class='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Process</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody class='clstbodytelaproyectoxproceso'>
            `;

    let htmlproyectotelaproceso = '', miarray = [];
    if (origen == 'proyecto') {
        miarray = [];
        if (dataproyectotelaxproceso != null) {
            miarray = dataproyectotelaxproceso.filter(y => y.idproyectotela == idtela);
            miarray.forEach(z => {
                htmlproyectotelaproceso += `<tr>
                                                <td>${z.nombreproceso}</td>
                                                <td>${z.comentario}</td>
                                        </tr>
                                        `;
            });
        }
    }
    html += htmlproyectotelaproceso;
    html += `   </tbody>
            </table>
        </div>`;
    //  FIN DIV PROYECTO TELA X PROCESO

    return html;
}

function getCadenaJson_Combination_PaGrabar() {
    let arraydivs = _Array(document.getElementsByClassName('_clsdivCombo')), objEstiloxCombo = {}, listaEstiloxCombo = [], jsonreturn = '', objreturn = {}, contador = 0, 
        objcolor = {}, listacolor = [], jsoncombocolor = '';
    arraydivs.forEach(x => {
        let tieneclasshide = x.classList.value.indexOf('hidecombo');
        if (tieneclasshide < 0) {
            contador++;
            let id = x.getAttribute('id'), valordescripcion = _(id).getElementsByClassName('ComboDescription')[0].value, idestiloxcombo = x.getAttribute('data-id');
            idestiloxcombo = idestiloxcombo == null ? 0 : idestiloxcombo;
            objEstiloxCombo = {};
            objEstiloxCombo.idestilocombo = idestiloxcombo;
            objEstiloxCombo.descripcion = valordescripcion;
            objEstiloxCombo.idreferencia = contador;
            listaEstiloxCombo.push(objEstiloxCombo);

            let tbodycombocolor = _(id).getElementsByClassName('clstbodycombocolor')[0];
            let totalfilas = tbodycombocolor.rows.length;
            for (let i = 0; i < totalfilas; i++) {
                let idestilocombocolor = tbodycombocolor.rows[i].getAttribute('data-id');
                idestilocombocolor = idestilocombocolor == null ? 0 : idestilocombocolor;
                objcolor = {};
                objcolor.idestilocombocolor = idestilocombocolor;
                objcolor.comentario = tbodycombocolor.rows[i].cells[1].children[0].value;
                objcolor.color = tbodycombocolor.rows[i].cells[2].children[0].value;
                objcolor.idreferencia = contador;
                listacolor.push(objcolor);
            }
        }
    });

    if (listaEstiloxCombo.length > 0) {
        jsonreturn = JSON.stringify(listaEstiloxCombo);
    }
    if (listacolor.length > 0) {
        jsoncombocolor = JSON.stringify(listacolor);
    }

    objreturn.estiloxcombo = jsonreturn;
    objreturn.estiloxcombocolor = jsoncombocolor;
    return objreturn;
}

function getCadenaJson_FabricCombo() {
    let arraydivs = _Array(document.getElementsByClassName('_clsdivFabricCombo')), objEstiloxCombo = {}, listaEstiloFabricxCombo = [], jsonfabricreturn = '', objreturn = {}, contador = 0,
         listafabriccombocolor = [], jsonfabriccombocolor = '';
    arraydivs.forEach(x => {
        let tieneclasshide = x.classList.value.indexOf('hideFabriccombo');
        if (tieneclasshide < 0) {
            contador++;
            let id = x.getAttribute('id'), valordescripcion = _(id).getElementsByClassName('ComboFabricDescription')[0].value, idestilofabricxcombo = x.getAttribute('data-id');
            idestilofabricxcombo = idestilofabricxcombo == null ? 0 : idestilofabricxcombo
            objEstiloFabricxCombo = {};
            objEstiloFabricxCombo.idestilofabriccombo = idestilofabricxcombo;
            objEstiloFabricxCombo.descripcion = valordescripcion.trim();
            objEstiloFabricxCombo.idreferencia = contador;
            listaEstiloFabricxCombo.push(objEstiloFabricxCombo);

            let tbodycombocolor = _(id).getElementsByClassName('clstbodyFabriccombocolor')[0];
            let totalfilas = tbodycombocolor.rows.length;
            for (let i = 0; i < totalfilas; i++) {
                let par = tbodycombocolor.rows[i].getAttribute('data-id'),idestilofabriccombocolor = _par(par, 'id') ;
                idestilofabriccombocolor = idestilofabriccombocolor == null ? 0 : idestilofabriccombocolor;
                objfabriccolor = {};
                objfabriccolor.idestilofabriccombocolor = idestilofabriccombocolor;
                objfabriccolor.position = tbodycombocolor.rows[i].cells[0].children[0].value.trim();
                objfabriccolor.idcolor = tbodycombocolor.rows[i].cells[1].children[0].value.trim();
                objfabriccolor.idreferencia = contador;
                listafabriccombocolor.push(objfabriccolor);
            }
        }
    });

    if (listaEstiloFabricxCombo.length > 0) {
        jsonfabricreturn = JSON.stringify(listaEstiloFabricxCombo);
    }
    if (listafabriccombocolor.length > 0) {
        jsonfabriccombocolor = JSON.stringify(listafabriccombocolor);
    }

    objreturn.estilofabricxcombo = jsonfabricreturn;
    objreturn.estilofabricxcombocolor = jsonfabriccombocolor;
    return objreturn;
}

function EliminarEstiloxCombo(obj) {
    let tag = obj.tagName, divpadre = null;
    switch (tag) {
        case 'BUTTON':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (divpadre != null) {
        _('divCombo').removeChild(divpadre)
    }    
}

function EliminarEstiloxFabricCombo(obj) {
    let tag = obj.tagName, divpadre = null;
    switch (tag) {
        case 'BUTTON':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            divpadre = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (divpadre != null) {
        _('divFabricCombo').removeChild(divpadre)
    }
}

function ConfColorName(e, Tipo) {
    //_modalConfirm("<strong>Are you sure to save color to style?</strong>", function () {
    //    ColorName(e, Tipo)
    //});

    swal({
        title: "Are you sure to save color to style?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        ColorName(e,Tipo)
        return;
    });
}

function ColorName(e, Tipo) {
    let  urlaccion = 'GestionProducto/Estilo/CrearColor', form = new FormData(),idestilo = _par(_('txtpar').value, 'idestilo');
    let color;
    if (Tipo == 1) {        
        let tr = $(e).closest('tr'), Id = $(tr).attr("data-id");
        color = tr.find('.gcbomboColor').val();       
    } else if (Tipo == 2) {
        let tr = $(e).closest('tr');
        color = $(e).closest('td').next().text();
        
    } else if (Tipo == 3) {
        let cont = e.getAttribute('data-btn');
        color = $('#txtDescriptionFabric' + cont).val();      
    }
    var obj = { idestilo: idestilo, color: color.trim() };
    if (color.trim().length > 0) {           
            form.append('par', JSON.stringify(obj));
            Post(urlaccion, form, function (rpta) {
                if (rpta > 0) {
                    swal({ type: 'success', title: 'Se agregó el color al estilo',text:"" });
                }
                else {
                    _swal({ estado: 'error', mensaje: 'No se guardó el color' });
                }
                $("#modalConfirm").modal('hide');
            });

        } else {
            _swal({ estado: 'error', mensaje: 'Color is empty' });
            $("#modalConfirm").modal('hide');
        }   
}

function llentarTablaSample(data) {
    let tbody = $('#tbody_tableSample')[0], html = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='${data[i].IdRequerimiento}' ondblclick='GoSample(this)' title='Hacer doble clic, para ir al requerimiento'>
                <td>${data[i].NombreTipoMuestra}</td>
                <td>${data[i].Codigo}</td>
                <td>${data[i].Status}</td>
                <td>${data[i].Fabrica}</td>
                <td>${data[i].Comentario}</td>
              </tr>`;
        }
        tbody.innerHTML = html;
    }
}

function GoSample(e) {   
    let urlaccion = 'GestionProducto/Requerimiento/New', idrequerimiento = e.getAttribute('data-par');
    _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables_estilo_new.idgrupocomercial + ',idrequerimiento:' + idrequerimiento);
}

function handler_divtrim_add(listatemp_iddivtrim_agregados) {
    listatemp_iddivtrim_agregados.forEach((x, i) => {
        let divtrimsecundario = document.getElementById(x.iddivtrim), btnsavetrimcolor = divtrimsecundario.getElementsByClassName('cls_btn_save_trim_color')[0],
            btneditartrim = divtrimsecundario.getElementsByClassName('cls_btn_editar_trim_color')[0],
            btncancelartrim = divtrimsecundario.getElementsByClassName('cls_btn_cancelar_trim_color')[0];
        btnsavetrimcolor.addEventListener('click', e => { fn_save_trimcolor(e, x.iddivtrim) });
        btneditartrim.addEventListener('click', e => { fn_editar_trimcolor(e, x.iddivtrim) });
        btncancelartrim.addEventListener('click', e => { fn_cancelar_trimcolor(e, x.iddivtrim) });
    });
}

function fn_save_trimcolor(e, iddivtrim) {
    let o = e.currentTarget, iddivtrimcontenedor = o.getAttribute('data-divtrimcontenedorprincipal'), divtrimcontenedor = document.getElementById(iddivtrimcontenedor), 
        tblcolor = divtrimcontenedor.getElementsByClassName('cls_tbody_color')[0], arr_rows = Array.from(tblcolor.rows), lstcolores = [], objtrim_grabar = {},
        idtrim = '', idestilo = '', par = _('txtpar').value;

    let valid = validarantesgrabartrim(iddivtrimcontenedor);
    if (!valid) {  // SI HAY ERRORES RETORNA
        return false;
    }

    swal({
        title: 'Confirm...!',
        text: 'Are you sure to record?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    }, function () {
        // AQUI VALIDAR SI AFECTA A OTROS ESTILOS 
        _promise()
            .then(inicio => {
                let divtrimcontenedor = document.getElementById(iddivtrimcontenedor),
                    tblcolor = divtrimcontenedor.getElementsByClassName('cls_tbody_color')[0], arr_rows = Array.from(tblcolor.rows), lstcolores = [], objtrim_grabar = {}; // pasavalidacion = true;
                
                    idtrim = divtrimcontenedor.getAttribute('data-idtrim');
                    idestilo = _par(par, 'idestilo');
                    let parametro = { idtrim: idtrim, idestilo: idestilo };
                    return _Get('GestionProducto/Estilo/ValidarTrimSiAfecta_OtrosEstilos?par=' + JSON.stringify(parametro));
            }).then(odatarpta => {
                let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null, pasavalidacion = true;
                if (rpta !== null) {
                    if (rpta[0].afectaaotrosestilos === 'si') {
                        pasavalidacion = false;
                        // MOSATRAR MODAL PARA SELECCIONAR A LOS ESTILOS AFECTADOS
                        _modalBody({
                            url: 'GestionProducto/Estilo/_EstilosAfectadosCambioTrim',
                            ventana: '_EstilosAfectadosCambioTrim',
                            titulo: 'Affected styles',
                            parametro: `idtrim:${idtrim},idestilo:${idestilo},iddivtrimcontenedor:${iddivtrimcontenedor}`,
                            ancho: '800',
                            alto: ''
                        });
                    }
                    return pasavalidacion;
                }
            }).then(validacion => {
                if (!validacion) {
                    return false;
                }

                save_add_trim_color_aceptado(iddivtrimcontenedor, [], idestilo);
            });
    });
}

function save_add_trim_color_aceptado(iddivtrimcontenedor, lstidestilos_afectados_seleccionados, idestilo_editado, ejecutadodesdemodal_estilosafectados) {
    let divtrimcontenedor = document.getElementById(iddivtrimcontenedor),
        tblcolor = divtrimcontenedor.getElementsByClassName('cls_tbody_color')[0], arr_rows = Array.from(tblcolor.rows), lstcolores = [], objtrim_grabar = {},
        idtrim = '', idestilo = idestilo_editado, par = _('txtpar').value;

    //let valid = validarantesgrabartrim(iddivtrimcontenedor);
    //if (!valid) {  // SI HAY ERRORES RETORNA
    //    return false;
    //}
    if (idestilo !== 0 || idestilo !== '') {
        lstidestilos_afectados_seleccionados.push({ idestilo: idestilo });
    }
    
    //objtrim_grabar.idtrim = divtrimcontenedor.getAttribute('data-idtrim');
    objtrim_grabar = _getParameter({ id: iddivtrimcontenedor, clase: '_enty_trim' });
    objtrim_grabar['estilosafectados'] = lstidestilos_afectados_seleccionados;
    objtrim_grabar['idtrim'] = divtrimcontenedor.getAttribute('data-idtrim');
    arr_rows.forEach(x => {
        let obj = {
            idtrimcolor: x.getAttribute('data-idtrimcolor'),
            color: x.cells[0].children[0].value,
            status: x.cells[1].children[0].value,
            comentario: x.cells[2].children[0].value
        };
        lstcolores.push(obj);
        
    });

    objtrim_grabar['colores'] = lstcolores;
    let parametro = JSON.stringify(objtrim_grabar);
    let form = new FormData();
    form.append('par', parametro);

    let err = function (__err) {
        console.log('err', __err);
    };
    _Post('GestionProducto/Estilo/Save_add_trim_color', form)
        .then((odatarpta) => {
            if (ejecutadodesdemodal_estilosafectados !== undefined) {
                if (ejecutadodesdemodal_estilosafectados === 'si') {
                    $('#modal__EstilosAfectadosCambioTrim').modal('hide');
                }
            }
            
            res_save_add_trim_color(odatarpta, iddivtrimcontenedor);
        }, (p) => { err(p); });
}

function fn_editar_trimcolor(e, iddivtrim) {
    let o = e.currentTarget, iddivtrimcontenedor = o.getAttribute('data-divtrimcontenedorprincipal'), divtrimcontenedor = document.getElementById(iddivtrimcontenedor),
        arrinputs = Array.from(divtrimcontenedor.getElementsByClassName('form-control'));
    // habilitar los campos del trim
    arrinputs.forEach(x => {
        x.disabled = false;
    });
    let btncancel = divtrimcontenedor.getElementsByClassName('cls_btn_cancelar_trim_color')[0], 
        btnsave_trim = divtrimcontenedor.getElementsByClassName('cls_btn_save_trim_color')[0];

    btncancel.classList.remove('hide');
    btnsave_trim.classList.remove('hide');
}
 
function fn_cancelar_trimcolor(e, iddivtrim) {
    let o = e.currentTarget, iddivtrimcontenedor = o.getAttribute('data-divtrimcontenedorprincipal');

    cancelareditar_trimcolor(iddivtrimcontenedor);
    
}

function cancelareditar_trimcolor(iddivtrimcontenedor) {
    let divtrimcontenedor = document.getElementById(iddivtrimcontenedor),
        arrinputs = Array.from(divtrimcontenedor.getElementsByClassName('form-control'));
    // habilitar los campos del trim
    arrinputs.forEach(x => {
        x.disabled = true;
    });
    //o.classList.add('hide');
    divtrimcontenedor.getElementsByClassName('cls_btn_cancelar_trim_color')[0].classList.add('hide');
    divtrimcontenedor.getElementsByClassName('cls_btn_save_trim_color')[0].classList.add('hide');
    divtrimcontenedor.getElementsByClassName('TrimPlacement')[0].disabled = false;
}

function validartrim_siafecta_otrosestilos(iddivtrimcontenedor) {
    let divtrimcontenedor = document.getElementById(iddivtrimcontenedor),
        tblcolor = divtrimcontenedor.getElementsByClassName('cls_tbody_color')[0], arr_rows = Array.from(tblcolor.rows), lstcolores = [], objtrim_grabar = {},
        idtrim = divtrimcontenedor.getAttribute('data-idtrim'), par = _('txtpar').value, idestilo = _par(par, 'idestilo'), pasavalidacion = true;

    let parametro = { idtrim:idtrim, idestilo:idestilo };
    _Get('GestionProducto/Estilo/ValidarTrimSiAfecta_OtrosEstilos?par=' + JSON.stringify(parametro))
        .then((odatarpta) => {
            let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null;
            if (rpta !== null) {
                if (rpta[0].afectaaotrosestilos === 'si') {
                    pasavalidacion = false;
                    // MOSATRAR MODAL PARA SELECCIONAR A LOS ESTILOS AFECTADOS
                    _modalBody({
                        url: 'GestionProducto/Estilo/_EstilosAfectadosCambioTrim',
                        ventana: '_EstilosAfectadosCambioTrim',
                        titulo: 'Affected styles',
                        parametro: `idtrim:${idtrim},idestilo:${idestilo}`,
                        ancho: '800',
                        alto: ''
                    });
                }
                return pasavalidacion;
            }
        }, (p) => { err(p); });
}

function res_save_add_trim_color(odatarpta, iddivtrim) {
    let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null;
    if (rpta !== null) {
        let data = rpta.data;
        swal({
            title: 'Message',
            text: rpta.mensaje,
            type: rpta.estado
        }, function(result) {
            if (result) {
                if (rpta.id > 0) {
                    cancelareditar_trimcolor(iddivtrim);
                    // ACTUALIZAR LOS IDTRIM DE LA TABLA COLORES DE TRIM
                    actualizaridtrimtblcolor_despuesdegrabar(iddivtrim, data);
                }
            }
        });
    }
}

function actualizaridtrimtblcolor_despuesdegrabar(iddivtrim, data) {
    let divtrimsecundario = document.getElementById(iddivtrim), tblcolor = divtrimsecundario.getElementsByClassName('cls_tbody_color')[0],
            arr_rows = Array.from(tblcolor.rows), idtrim = divtrimsecundario.getAttribute('data-idtrim'), contador = 0,
            arr_divs_trim = Array.from(_('divTrim').getElementsByClassName('_clsdivtriim')), html = '';

    let odata = data !== '' ? JSON.parse(data) : null;
    if (odata !== null) {
        let trim = odata[0].trim !== '' ? JSON.parse(odata[0].trim)[0] : null, trimcolor = odata[0].trimcolor !== '' ? CSVtoJSON(odata[0].trimcolor) : null;
        if (trim !== null) {

            arr_divs_trim.forEach(div => {
                let idtrim_arr = div.getAttribute('data-idtrim'), iddivtrim_each = div.getAttribute('id');
                if (idtrim_arr == idtrim) {
                    if (iddivtrim_each == iddivtrim) {
                        div.getElementsByClassName('TrimDescription')[0].value = trim.descripcion;
                        div.getElementsByClassName('TrimCode')[0].value = trim.codigo;
                        div.getElementsByClassName('TrimSupplier')[0].value = trim.proveedor;
                        div.getElementsByClassName('TrimStatus')[0].value = trim.status;
                        div.getElementsByClassName('TrimIncoterm')[0].value = trim.incoterm;
                        div.getElementsByClassName('TrimComment')[0].value = trim.comment;
                        div.getElementsByClassName('TrimCost')[0].value = trim.costo;
                        div.getElementsByClassName('TrimCostType')[0].value = trim.costouom;
                        div.getElementsByClassName('TrimMoneda')[0].value = trim.costomoneda;
                        div.getElementsByClassName('cls_tipoproveedor_trim')[0].value = trim.tipoproveedor;

                        if (trimcolor !== null) {
                            tblcolor = div.getElementsByClassName('cls_tbody_color')[0];
                            arr_rows = Array.from(tblcolor.rows);
                            trimcolor.forEach(color => {
                                arr_rows.some(t => {
                                    let idtrimcolor_tbl = t.getAttribute('data-idtrimcolor');
                                    if (idtrimcolor_tbl > 0) {
                                        if (color.idtrimcolor == idtrimcolor_tbl) {
                                            let colorfilter = trimcolor.filter(f => f.idtrimcolor == idtrimcolor_tbl);
                                            if (colorfilter.length > 0) {
                                                t.getElementsByClassName('Color')[0].value = colorfilter[0].color;
                                                t.getElementsByClassName('StatusColor')[0].value = colorfilter[0].status;
                                                t.getElementsByClassName('cls_comentario')[0].value = colorfilter[0].comentario;
                                                return true;
                                            }
                                        }
                                    } 
                                });
                            });
                            //2
                            let contador = 0;
                            trimcolor.forEach(color => {
                                contador = 0;
                                arr_rows.some(t => {
                                    let idtrimcolor_tbl = t.getAttribute('data-idtrimcolor');
                                    if (idtrimcolor_tbl == color.idtrimcolor) {
                                        contador++;
                                        return true;
                                    }
                                });
                                if (contador == 0) {
                                    arr_rows.some(t => {
                                        let idtrimcolor_tbl = t.getAttribute('data-idtrimcolor');
                                        if (idtrimcolor_tbl == 0) {
                                            t.setAttribute('data-idtrimcolor', color.idtrimcolor);
                                            t.setAttribute('data-idtrim', idtrim);
                                            t.getElementsByClassName('Color')[0].value = color.color;
                                            t.getElementsByClassName('StatusColor')[0].value = color.status;
                                            t.getElementsByClassName('cls_comentario')[0].value = color.comentario;
                                            return true;
                                        }
                                    });
                                }
                            });

                        }
                    } else {
                        div.getElementsByClassName('TrimDescription')[0].value = trim.descripcion;
                        div.getElementsByClassName('TrimCode')[0].value = trim.codigo;
                        div.getElementsByClassName('TrimSupplier')[0].value = trim.proveedor;
                        div.getElementsByClassName('TrimStatus')[0].value = trim.status;
                        div.getElementsByClassName('TrimIncoterm')[0].value = trim.incoterm;
                        div.getElementsByClassName('TrimComment')[0].value = trim.comment;
                        div.getElementsByClassName('TrimCost')[0].value = trim.costo;
                        div.getElementsByClassName('TrimCostType')[0].value = trim.costouom;
                        div.getElementsByClassName('TrimMoneda')[0].value = trim.costomoneda;
                        div.getElementsByClassName('cls_tipoproveedor_trim')[0].value = trim.tipoproveedor;

                        if (trimcolor !== null) {
                            tblcolor = div.getElementsByClassName('cls_tbody_color')[0];
                            arr_rows = Array.from(tblcolor.rows);
                            trimcolor.forEach(color => {
                                arr_rows.some(t => {
                                    let idtrimcolor_tbl = t.getAttribute('data-idtrimcolor');
                                    if (idtrimcolor_tbl > 0) {
                                        if (color.idtrimcolor == idtrimcolor_tbl) {
                                            let colorfilter = trimcolor.filter(f => f.idtrimcolor == idtrimcolor_tbl);
                                            if (colorfilter.length > 0) {
                                                t.getElementsByClassName('Color')[0].value = colorfilter[0].color;
                                                t.getElementsByClassName('StatusColor')[0].value = colorfilter[0].status;
                                                t.getElementsByClassName('cls_comentario')[0].value = colorfilter[0].comentario;
                                                return true;
                                            }
                                        }
                                    }
                                });
                            });
                            //2
                            let contador = 0;
                            trimcolor.forEach(color => {
                                contador = 0;
                                arr_rows.some(t => {
                                    let idtrimcolor_tbl = t.getAttribute('data-idtrimcolor');
                                    if (idtrimcolor_tbl == color.idtrimcolor) {
                                        contador++;
                                        return true;
                                    }
                                });
                                if (contador == 0) {
                                    // AGREGAR FILA A LA TABLA COLOR
                                    html = `
                                        <tr data-status="old" data-id="0" data-idestadocolor='${color.status}' data-idtrim='${idtrim}' data-idtrimcolor='${color.idtrimcolor}'>
                                            <td>
                                                <input type="text" class ="form-control Color" value="${color.color}" data-initial="${color.color}">
                                            </td>
                                            <td>
                                                <select data-initial="${color.status}" class ="form-control StatusColor">
                                                </select>
                                            </td>
                                            <td>
                                                <input type="text" class ="form-control cls_comentario" data-initial="${color.comentario}" value="${color.comentario}">
                                            </td>
                                            <td class ="text-center" style='vertical-align: middle;'>
                                                <div class ='input-group'>
                                                    <span class ='input-group-addon'>
                                                        <input type='checkbox' class ='cls_chk_trim_colorselect' style='width: 20px; height:20px;' value=''/>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    `;
                                    tblcolor.insertAdjacentHTML('beforeend', html);
                                    let fila = tblcolor.rows.length - 1;
                                    cargargarcomboTablaColor_add(fila, iddivtrim_each);
                                    return true;
                                }
                            });

                        }

                    }
                }

            });
        }
    }

    
    validarsihaycoloresparagrabar(iddivtrim);
}

function validarantesgrabartrim(iddivtrim) {
    let pasavalidacion = true, mensaje = '', pasavalidacionrequeridos = true;
    let descripcion = _(iddivtrim).getElementsByClassName('TrimDescription')[0].value, tblcolor = _(iddivtrim).getElementsByClassName('cls_tbody_color')[0],
        arr_rows = Array.from(tblcolor.rows);

    if (descripcion === '') {
        mensaje += '- La descripción es obligatorio. \n';
        pasavalidacionrequeridos = false;
        pasavalidacion = false;
    }
    arr_rows.forEach(x => {
        let color = x.getElementsByClassName('Color')[0].value.trim(), comentario = x.getElementsByClassName('cls_comentario')[0].value.trim();
        if (color === '' && comentario === '') {
            mensaje += '- Falta el color o el comentario de colores. \n';
            pasavalidacionrequeridos = false;
            pasavalidacion = false;
        }
    });

    swal({
        type: 'error',
        text: mensaje,
        title: 'Message'
    });

    return pasavalidacion;
}

function fn_addestilotechpack(e) {
    let files = Array.from(e.currentTarget.files), html = '', fila = null, tblbody = _('tbody_tableestilotechpack'),
        inputfile = null, pasavalidacion = true, mensaje = '', arrrows = Array.from(tblbody.rows), lstfiles_tbl = [];
    
    arrrows.forEach(x => {
        if (x.classList.value.indexOf('hide') < 0) {  // las filas solo visibles
        let file = x.getElementsByClassName('cls_estilotechpack_nombrefile')[0].innerText.trim(), obj = { file: file };
        lstfiles_tbl.push(obj);
        }
    });

    // VALIDAR SI EXISTE ARCHIVO
    files.forEach(x => {
        let filter = lstfiles_tbl.filter(f => f.file === x.name);
        if (filter.length > 0) {
            pasavalidacion = false;
            mensaje += 'The ' + x.name + ' file has already been added \n';
        }
        
    });

    if (mensaje !== '') {
        _swal({
            estado: 'error',
            mensaje: mensaje,
            titulo: 'Message'
        });
        return false;
    }

    files.forEach((x, i) => {
        fila = null;
        if (i === 0) {
            inputfile = _('btn_addestilotechpack').cloneNode(true);
            inputfile.classList.add('cls_tbl_estilotechpack_file');
            inputfile.classList.add('hide');
        }
        
        html = `
            <tr data-par='accion:new' data-estado=''>
                <td class='text-center cls_td_estilotechpack_botones' style='vertical-align: middle;'>
                    <button class ='btn btn-sm btn-danger cls_delete_estilotechpack'>
                        <span class ='fa fa-trash-o'></span>
                    </button>
                </td>
                <td class='text-center cls_estilotechpack_nombrefile' style='vertical-align: middle;'>${x.name}</td>
                <td></td>
                <td></td>
                <td><textarea class ='form-control cls_estilotechpack_comentario' rows='2'></textarea></td>
                <td class='text-center' style='vertical-align: middle;'>
                    
                </td>
            </tr>
        `;
        tblbody.insertAdjacentHTML('beforeend', html);
        fila = tblbody.rows.length - 1;
        if (fila !== null) {
            handler_tblestilotechpack_add(fila);
        }
    });
    fila = null;
    fila = tblbody.rows.length - 1;
    if (fila !== null) {
        //handler_tblestilotechpack_add(fila);
        if (inputfile !== null){
            let td = tblbody.rows[fila].getElementsByClassName('cls_td_estilotechpack_botones')[0];
            td.appendChild(inputfile);
        }
    }
}

function handler_tblestilotechpack_add(fila) {
    let tblbody = _('tbody_tableestilotechpack');
    tblbody.rows[fila].getElementsByClassName('cls_delete_estilotechpack')[0].addEventListener('click', e => { fn_delete_estilotechpack_file(e); });
}

function fn_delete_estilotechpack_file(e) {
    let o = e.currentTarget, fila = o.parentNode.parentNode;
    if (fila !== null) {
        //fila.parentNode.removeChild(fila);
        fila.classList.add('hide');
        fila.setAttribute('data-estado', 'delete');
    }
}

function getArrayEstiloTechpack(accion) {
    let tblbody = _('tbody_tableestilotechpack'), arrrows = Array.from(tblbody.rows), arrreturn = [];
    arrrows.forEach(x => {
        let par = x.getAttribute('data-par'), nuevofile = _par(par, 'accion'), idestilotechpack = _par(par, 'idestilotechpack'), estado = x.getAttribute('data-estado');
        if (accion === 'new') {
            if (x.classList.value.indexOf('hide') < 0){
                if (nuevofile === 'new') {
                    let obj = {
                        archivo: x.getElementsByClassName('cls_estilotechpack_nombrefile')[0].innerText,
                        comentario: x.getElementsByClassName('cls_estilotechpack_comentario')[0].value
                    }
                    arrreturn.push(obj);
                }
            }
            
        } else {
            if (nuevofile === 'edit') {
                if (estado === 'edit' || estado === 'delete'){
                    let obj = {
                        idestilotechpack: idestilotechpack,
                        comentario: x.getElementsByClassName('cls_estilotechpack_comentario')[0].value,
                        estado: estado           
                    }
                    arrreturn.push(obj);
                }
            }
        }
        
    });
    return arrreturn;
}

function req_ini() {
    let par = _('txtpar').value, accion = _par(par, 'accion'), idestilo = _par(par, 'idestilo');

    switch (accion) {
        case 'new':
            // Cargar estados, fabricas ... 
            Get('GestionProducto/Estilo/ObtenerDatosCarga', ObtenerDatosCarga);
            break;
        case 'edit':
            var url = urlBase() + "GestionProducto/Estilo/ObtenerDatosCarga";

            $.ajax({
                type: 'GET',
                url: url,
                async: false
            }).done(function (data) {
                ObtenerDatosCarga_edit(data);
            });

            let parametro = { idestilo: idestilo, idgrupocomercial: ovariables_estilo_new.idgrupocomercial }
            url = urlBase() + "GestionProducto/Estilo/ObtenerEstilo?par=" + JSON.stringify(parametro)    ////+ idestilo + "," + ovariables.idgrupocomercial;

            $.ajax({
                type: 'GET',
                url: url,
                async: false
            }).done(function (data) {
                ObtenerEstilo(data);
            });
            break;
    }
}

(
    function ini() {
        load();
        req_ini();

        var close = window.swal.close;
        window.swal.close = function () {
            close();
            window.onkeydown = null;
        };

    }
)();
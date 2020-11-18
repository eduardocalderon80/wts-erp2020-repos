/// <reference path="../../Home/Util.js" />
var ovariables_req_new = {
    accion: '',
    idgrupocomercial: '',
    filtro_index:'',
    perfil:[],
    perfilcomercial: "2",
    perfilddp: "12",
    existeperfilcomercial :''
}

function load() {
    $(".cboFabrica").select2();    
    $(".cboDestinos").select2();    
    $(".cboColor").select2();

    let perfil = $('#txtperfil').val();
    ovariables_req_new.perfil = perfil.split(',') ;
    ovariables_req_new.existeperfilcomercial = ovariables_req_new.perfil.indexOf(ovariables_req_new.perfilcomercial);
    if (ovariables_req_new.existeperfilcomercial !== -1) {
        $('#cboTeam').prop('disabled', true);
    }

    let par = _('txtpar').value;
    if (!_isEmpty(par)) {
        ovariables_req_new.accion = _par(par, 'accion');
        ovariables_req_new.idgrupocomercial = _par(par, 'idgrupocomercial');
        _('hf_idrequerimiento').value = $.trim(_par(par, 'idrequerimiento'));
        ovariables_req_new.filtro_index = _par(par, 'filtro_index');
        //ovariables_req.filtro_index = _par(par, 'filtro_index');
    }

    _modal('buscarestilo', 1000);
    $('#modal_buscarestilo').on('show.bs.modal', ejecutarmodalbuscarestilo);
        
    _modal('newreq', 1000);
    $('#modal_newreq').on('show.bs.modal', ejecutarmodalnewreq)
    
    _modal('enviarcorreo', 1000, 900);
    $('#modal_enviarcorreo').on('show.bs.modal', ejecutarmodal_enviarcorreo);

    _modal('comentario', 1000,500);
    $('#modal_comentario').on('show.bs.modal', ejecutarmodal_comentario);

    //ENVIAR CORREO PARA LOS COMMENTS - SOLO PRUEBA
    _modal('enviarcorreocom', 1000, 900);
    $('#modal_enviarcorreocom').on('show.bs.modal', ejecutarmodal_enviarcorreocom);
    //

    _('cboCliente').addEventListener('change', getDataByCliente);
    _('btn_buscarestilo').addEventListener('click', buscarEstilo);
    
    _('btn_Despacho').addEventListener('click', ejecutarmodaldespacho);
    _('BtnAddCom').addEventListener('click', comentario);
     
    $('#div_grupofecha_exclientdate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
        let fecha = e.target.value;
        $('#txt_fechaexclientdate').val(fecha).datepicker('update');
    });
    $('#div_grupofecha_exftydate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true }).on('change', function (e) {
        let fecha = e.target.value;
        $('#txt_fecha_exactualdate').val(fecha).datepicker('update');
    });;

    $('#div_grupofecha_exactualdate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#div_grupofecha_clientihd .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    _('btnAddTallaColor').addEventListener('click', addtallacolor);
    _('btnInsertRequerimiento').addEventListener('click', save_new_requerimiento);
    _('btnUpdateRequerimiento').addEventListener('click', save_edit_requerimiento);
    _('btnNewRequerimiento').addEventListener('click', new_requerimiento);
    _('btnUpdateTallacolor').addEventListener('click', aceptartallacolor);
    _('btnCancel').addEventListener('click', returnindex);
    _('btnSendMail').addEventListener('click', openmodal_enviarcorreo);
    _('btnSendMailComment').addEventListener('click', openmodal_enviarcorreocom);
    $('#filearchivo').on('change', changeFile);

        // FECHA PARA EL CAMBIO DE ESTADO
    $('#div_grupo_fechaestado .input-group.date').datepicker({
            autoclose: true, dateFormat: 'mm/dd/yyyy'
    });

    $('#div_gral_cid .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' }).datepicker("setDate", new Date());
    $('#div_gral_efd .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' }).datepicker("setDate", new Date());

    switch (ovariables_req_new.accion) {
        case 'new':
            $('#btnInsertRequerimiento').removeClass('hide');
            $('#btnUpdateRequerimiento').addClass('hide');
            $('#btnNewRequerimiento').addClass('hide');
            $('#btnSendMail').addClass('hide');
            $('#btn_Despacho').addClass('hide');
            break;
        case 'edit':
            MostrarEditar();
            break;
    }

    $("#chkcid").change(function () {
        var checked = $(this).is(':checked');
        if (checked) {
            $(".chk_cid").each(function () {
                $(this).prop("checked", true);
                changechkcid(this)
            });
        } else {
            $(".chk_cid").each(function () {
                $(this).prop("checked", false);
            });
    }
    });

    $("#chkefd").change(function () {
        var checked = $(this).is(':checked');
        if (checked) {
            $(".chk_efd").each(function () {
                $(this).prop("checked", true);
                changechkefd(this)
            });
        } else {
            $(".chk_efd").each(function () {
                $(this).prop("checked", false);
            });
    }
    });

    $('#div_grupo_date_maxexfty .input-group.date').datepicker({
            autoclose: true, dateFormat: 'mm/dd/yyyy', todayHighlight: true
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        let fecha = e.target.value;
        $('#txt_fecha_exftydatemax').val(fecha).datepicker('update');
    });
}

function changechkcid(e) {
    if ($(e).is(':checked')) {
        let fila = $(e).closest('tr')
        , celda = fila.find('._clsfechacliente_tallacolor')
        , fecha = _('txt_gral_cid').value;       
        celda.text(fecha)
    }
}
function changechkefd(e) {
    if ($(e).is(':checked')) {
        let fila = $(e).closest('tr')
        , celda = fila.find('._clsfechafabrica_tallacolor')
        , fecha = _('txt_gral_efd').value;
        console.log(celda)
        celda.text(fecha)
    }
}

function MostrarEditar() {
            $('#btnInsertRequerimiento').addClass('hide');
            $('#btnUpdateRequerimiento').removeClass('hide');
            $('#btnNewRequerimiento').removeClass('hide');
            $('#btnSendMail').removeClass('hide');
            $('#btn_Despacho').removeClass('hide');
            $('#btn_buscarestilo').addClass('hide');
            $('#cboCliente').prop('disabled', true);     
            _('div_estados').classList.remove('hide');
            _('div_li_tabcontent').classList.remove('hide');
            _('div_li_tabStatus').classList.remove('hide');
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
                GuardarNuevo();
                return;
            });
        }
        else {
            GuardarNuevo();
        }
    });
}
 
function getDataByCliente(event) {
    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(), idestilo = $('#hf_idestilo').val(),
        parametro = { idcliente: idcliente, perfil: perfil, idgrupocomercial: ovariables_req_new.idgrupocomercial, idestilo: idestilo },
        urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
        Get(urlaccion, res_datacliente);
}

function res_datacliente(data) {
    let rpta = data != null ? JSON.parse(data) : null;

    _('cboTipoMuestra').innerHTML = '';
    _('cboColor').innerHTML = '';
    _('cboTalla').innerHTML = '';
    _('cboFabrica').innerHTML = '';

    limpiar_divdatosestilos('div_datosestilo', '_data');

    if (rpta != null) {
        _('cboTipoMuestra').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].tipomuestraxcliente);
        _('cboColor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientecolor);
        _('cboTalla').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientetalla);
        _('cboFabrica').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].proveedor);

        //if (ovariables_req_new.existeperfilcomercial == -1) {
        //    _('cboTeam').innerHTML = '';
        //    _('cboTeam').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].teamddp);
        //}
    }
}

function TraerDatosCliente(){
    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(), idestilo = $('#hf_idestilo').val(),
        parametro = { idcliente: idcliente, perfil: perfil, idgrupocomercial: ovariables_req_new.idgrupocomercial, idestilo: idestilo },
        urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
        Get(urlaccion, CargarColor);
}

function CargarColor(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    _('cboColor').innerHTML = '';
    if (rpta != null) {
        _('cboColor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientecolor);
    }
}

function limpiar_divdatosestilos(iddiv, clsname) {
    _SS(iddiv, clsname).forEach(function (item, index) {
        let tipodato = item.getAttribute('data-type');

        if (tipodato == 'text') {
            item.value = '';
        } else if (tipodato == 'img') {
            item.src = '';
        } else if (tipodato == 'combo') {
            item.value = 0;
        } else if (tipodato == 'date') {
            //item.value;
            $(item).val('').datepicker('update');
        } else if (tipodato == 'int') {
            item.value = ''
        }
    });

    //$('#cboColor').val('');
    $("#cboColor > option").removeAttr("selected");
    $("#cboColor").trigger("change");
}
 
function res_ini(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data);
    if (rpta != null) {
        if (dataparse != null) {
            _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].clientes);
            _('cboDestinos').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].destinos);
            //_('cboFabrica').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].proveedor);
            _('cboVersion').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].version);
            _('cboTeam').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].team);
            if (ovariables_req_new.idgrupocomercial != 0) {
                _('cboTeam').value = ovariables_req_new.idgrupocomercial;
            }
        }
        _('hf_rutafileserver_imgestilo').value = rpta.Message;
    }
}

//  :EDU ZONA MODAL
function ejecutarmodalbuscarestilo() {
    let modal = $(this);

    modal.find('.modal-title').text('Search style');

    let urlaccion = 'GestionProducto/Requerimiento/_BuscarEstilo';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodybuscarestilo').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Requerimiento/_buscarestilo');
    });
}

function ejecutarmodal_enviarcorreo() {
    let modal = $(this);
    modal.find('.modal-title').text('Send mail');
    let urlaccion = 'GestionProducto/Requerimiento/_EnviarCorreoRequerimiento';
    _Get(urlaccion).then(function (vista) {
            $('#modal_bodyenviarcorreo').html(vista);
        }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function comentario() {   
    $('#modal_comentario').modal('show');
}

function ejecutarmodal_comentario() {
    let modal = $(this);
    modal.find('.modal-title').text('Add Comment');
    let urlaccion = 'GestionProducto/Requerimiento/_Comentario';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodycomentario').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}
 
function ejecutarmodal_enviarcorreocom() {
    let modal = $(this);
    modal.find('.modal-title').text('Send Mail Comment');
    let urlaccion = 'GestionProducto/Requerimiento/_EnviarCorreoRequerimientoCom';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyenviarcorreocom').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function buscarEstilo() {
    let idcliente = _('cboCliente').value;
    if (idcliente == '' || parseInt(idcliente) <= 0) {
        _swal({ estado:'error', mensaje: 'Select Client.' });
        return false;
    }
    $('#modal_buscarestilo').modal('show');
}

function ejecutarmodaldespacho() {   
    let cbocliente = document.getElementById('cboCliente');
    let opar = {
        cliente: cbocliente.options[cbocliente.selectedIndex].text,
        estilo: _('txt_codigoestilo').value.trim(),
        temporada: _('txt_temporada').value.trim()
    }

    _modalBody({
        url: 'GestionProducto/Requerimiento/_Despacho',
        ventana: '_Despacho',
        titulo: 'Despacho',
        parametro: `cliente:${opar.cliente},estilo:${opar.estilo},temporada:${opar.temporada}`,
        ancho: '',
        alto: '',
        responsive:'modal-lg'
    });
}
 
function openmodal_enviarcorreo(event) {
    save_edit_requerimiento(event);    
}

function openmodal_enviarcorreocom(event) {
    $('#modal_enviarcorreocom').modal('show');
}

function addtallacolor() {
    let tbody = _('tbody_tallacolor')[0], idclientecolor = _('cboColor').value, idclientetalla = _('cboTalla').value, nombrecolor = $('#cboColor option:selected').text(),
        nombretalla = $('#cboTalla option:selected').text(), cantidad = _('txt_cantidad').value, cantidadContraMuestra = _('txt_cantidad_contramuestra').value == '' ? '0' : _('txt_cantidad_contramuestra').value,
        exclientdate = _('txt_fechaexclientdate').value, exftydate = _('txt_fecha_exftydate').value, exactualdate = _('txt_fecha_exactualdate').value,
        clientihd = _('txt_fecha_clientihd').value, html = '', exftydatemax = _('txt_fecha_exftydatemax').value;

    let req = validarAddTallaColor();
    if (req == false) {
        return false;
    }

    // VALIDAR FECHAS
    if (_convertDate_ANSI(exftydatemax) < _convertDate_ANSI(exftydate)) {
        _swal({
            estado: 'error',
            titulo: 'Invalid dates',
            mensaje: 'The MAX EX FTY date must be greater than or equal to the date EX FTY'
        });
        return false;
    }

    html = `<tr data-par='idclientecolor:${idclientecolor},idclientetalla:${idclientetalla},idrequerimientodetalle:0,estado:0,cantdespacho:0,cantcmdespacho:0'>
                <td class ='text-center'>
                    <div class ='btn-group'>
                        <button class ='btn btn-danger btn-sm _delete_tallacolor' title='Delete'>
                            <span class='fa fa-trash'></span>
                        </button>
                        <button class ='btn btn-success btn-sm _edit_tallacolor' title='Edit'>
                            <span class ='fa fa-pencil-square-o'></span>
                        </button>
                      
                    </div>
                </td>
                <td>${nombrecolor}</td>
                <td>${nombretalla}</td>
                <td>
                    <input type='text' value='${cantidad}' class ='form-control _clscantidad_tallacolor text-right' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td>
                    <input type='text' value='${cantidadContraMuestra}' class ='form-control _clscantidadcontramuestra_tallacolor text-right' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td style="vertical-align:middle;">
                    <div class ='col-sm-2 form-check' >
                        <input type='checkbox' class ='form-check-input chk_cid' name='chkcid' onchange='changechkcid(this)' />
                    </div>
                    <div class ='col-sm-10'>
                        <label class ='_clsfechacliente_tallacolor'>${exclientdate}</label>
                    </div>
                </td>
                <td style="vertical-align:middle;">
                   <div class ='col-sm-2 form-check' >
                       <input type='checkbox' class ='form-check-input chk_efd' name='chkefd' onchange='changechkefd(this)' />
                   </div>
                   <div class ='col-sm-10'>
                       <label class ='_clsfechafabrica_tallacolor'> ${exftydate} </label>
                   </div>
                </td>
                <td class='clsfechaftymax text-center' style="vertical-align:middle;">${exftydatemax}</td>
                <td class ='hide'>${exactualdate}</td>
                <td class='hide'>${clientihd}</td>
            </tr>`;
    $('#tbody_tallacolor').append(html);
    handlerAccionTblTallaColor();
}

function CompararFecha() {
    let mensaje = "",
        result = true,        
        FechaCliente = _convertDate_ANSI(_('txt_fechaexclientdate').value),
        FechaFty = _convertDate_ANSI(_('txt_fecha_exftydate').value),
        fechaactual = new Date(),   
        anio = fechaactual.getFullYear(),
        mes = fechaactual.getMonth(),
        dia = fechaactual.getDate(),
        strfechaActual = anio.toString() + ('0' + (mes + 1).toString()).slice(-2) + ('0' + dia.toString()).slice(-2);

    if (FechaCliente < strfechaActual) {
        mensaje += "- Client in house date es menor que la fecha actual \n";
    }
    if (FechaFty < strfechaActual) {
        mensaje += "- Ex Fty Date es menor que la fecha actual \n";
    }

    if (mensaje !== '') {        
        //_mensaje({ mensaje: mensaje ,titulo:'Aviso!!!',estado:'error'});
        _swal({
            estado: 'error',
            titulo: 'Aviso!!!',
            mensaje: mensaje
        });
    }
    return mensaje!=='';
}

function aceptartallacolor() {
    let tbody = _('tbody_tallacolor'), idclientecolor = _('cboColor').value, idclientetalla = _('cboTalla').value, nombrecolor = $('#cboColor option:selected').text(),
        nombretalla = $('#cboTalla option:selected').text(), cantidad = _('txt_cantidad').value, cantidadContraMuestra = _('txt_cantidad_contramuestra').value,
        exclientdate = _('txt_fechaexclientdate').value, exftydate = _('txt_fecha_exftydate').value, exactualdate = _('txt_fecha_exactualdate').value,
        clientihd = _('txt_fecha_clientihd').value, fila = _('hf_fila_tallacolor').value, idrequerimientodetalle = _('hf_idrequerimientodetalle').value,
        estado = _('hf_estadodetalle').value, cantdespacho = _('hf_cantidaddespachodetalle').value,cantidadcmdespacho = _('hf_cantidadcmdespachodetalle').value,
        exftydatemax = _('txt_fecha_exftydatemax').value;
    CompararFecha()
    let req = validarAddTallaColor()   ;
    if (req == false) {
        return false;
    }

    // VALIDAR FECHAS
    if (_convertDate_ANSI(exftydatemax) < _convertDate_ANSI(exftydate)) {
        _swal({
            estado: 'error',
            titulo: 'Invalid dates',
            mensaje: 'The MAX EX FTY date must be greater than or equal to the date EX FTY'
        });
        return false;
    }

    let par = `idclientecolor:${idclientecolor},idclientetalla:${idclientetalla},idrequerimientodetalle:${idrequerimientodetalle},estado:${estado},cantdespacho:${cantdespacho},cantcmdespacho:${cantidadcmdespacho}`;
    tbody.rows[fila].setAttribute('data-par', par);
    tbody.rows[fila].cells[1].innerText = nombrecolor;
    tbody.rows[fila].cells[2].innerText = nombretalla;
    tbody.rows[fila].cells[3].children[0].value = cantidad;
    tbody.rows[fila].cells[4].children[0].value = cantidadContraMuestra;
   // tbody.rows[fila].cells[5].innerText = exclientdate;
    tbody.rows[fila].cells[5].children[1].innerHTML = "<label class ='_clsfechacliente_tallacolor'> " + exclientdate + " </label> ";
    //tbody.rows[fila].cells[6].innerText = exftydate;
    tbody.rows[fila].cells[6].children[1].innerHTML = "<label class ='_clsfechafabrica_tallacolor'> " + exftydate + " </label> ";
    tbody.rows[fila].cells[7].innerText = exactualdate;
    tbody.rows[fila].cells[8].innerText = clientihd;
    tbody.rows[fila].getElementsByClassName('clsfechaftymax')[0].innerText = exftydatemax;

    $('#btnUpdateTallacolor').addClass('hide');
    limpiar_divdatosestilos('div_datos_tallacolor', '_datatallacolor');
}

function handlerAccionTblTallaColor() {
    let tbl = _('tblTallaColor'), arrayDelete = _Array(tbl.getElementsByClassName('_delete_tallacolor')), arrayEdit = _Array(tbl.getElementsByClassName('_edit_tallacolor'));        
    arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'drop'); }));
    arrayEdit.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'edit'); }));
}

function controladoracciontabla(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        par = fila.getAttribute('data-par');
        evento(par, accion, fila);
    }
}

function evento(par, accion, fila) {
    switch (accion) {
        case 'drop':
            EliminarTallaColor(fila, par)
            break;
        case 'edit':
            cargarDatosSeccionTallaColor(fila, par);
            break;
    }
}

function EliminarTallaColor(fila, par) {
    let estado = _par(par, 'estado'), cantidaddespacho = _par(par, 'cantdespacho'), cantidadcmdespacho = _par(par, 'cantcmdespacho'), mensaje = '', bValida =  true;
    if (estado != 0) {
        bValida = false;
        mensaje += '- No se puede eliminar porque tiene despacho cerrado </br>';
    } else if (cantidaddespacho > 0) {
        bValida = false;
        mensaje += '- No se puede eliminar porque tiene cantidad requerida despachada </br>';     
    } else if (cantidadcmdespacho > 0) {
        bValida = false;
        mensaje += '- No se puede eliminar porque tiene contramuestra despachada </br>';
    }
    if (bValida) {
        swal({
            title: "Are you sure to delete?",
            text: "",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: false
        }, function () {
            fila.parentNode.removeChild(fila);
            _swal({
                        estado: 'success', mensaje: 'Deleted!!'
                });
            return;
        });
    } else {
        if (mensaje.length > 0) {
            swal({
                type: 'error',
                title: 'Oops...',
                html: true,
                text: mensaje
            });
        }
    }
}

function cargarDatosSeccionTallaColor(fila, par) {
    let idclientecolor = _par(par, 'idclientecolor'), idclientetalla = _par(par, 'idclientetalla'), idrequerimientodetalle = _par(par, 'idrequerimientodetalle'),
        estado = _par(par, 'estado'), cantidaddespacho = _par(par, 'cantdespacho'), cantidadcmdespacho = _par(par, 'cantcmdespacho'),
        cantidad = fila.cells[3].children[0].value,
        cantidadContraMuestra = fila.cells[4].children[0].value, exclientdate = fila.getElementsByClassName('_clsfechacliente_tallacolor')[0].innerText.trim(),
        exftydate = fila.getElementsByClassName('_clsfechafabrica_tallacolor')[0].innerText.trim(), exactualdate = fila.cells[7].innerText,
        clientihd = fila.cells[8].innerText, fechaftymax = fila.getElementsByClassName('clsfechaftymax')[0].innerText.trim();

    _('hf_idrequerimientodetalle').value = idrequerimientodetalle;
    _('hf_fila_tallacolor').value = parseInt(fila.rowIndex) - 1;
    _('hf_estadodetalle').value = estado;
    _('hf_cantidaddespachodetalle').value = cantidaddespacho;
    _('hf_cantidadcmdespachodetalle').value = cantidadcmdespacho;
    $("#cboColor").val(idclientecolor).trigger("change");

    _('cboTalla').value = idclientetalla;
    _('txt_cantidad').value = cantidad;
    _('txt_cantidad_contramuestra').value = cantidadContraMuestra;

    // FECHAS
    //$('#txt_fechaexclientdate').val(exclientdate).datepicker('update');
    $('#div_grupofecha_exclientdate .input-group.date').datepicker('update', exclientdate);
    //$('#txt_fecha_exftydate').val(exftydate).datepicker('update');
    $('#div_grupofecha_exftydate .input-group.date').datepicker('update', exftydate);
    //$('#txt_fecha_exactualdate').val(exactualdate).datepicker('update');
    $('#div_grupofecha_exactualdate .input-group.date').datepicker('update', exactualdate);
    //$('#txt_fecha_clientihd').val(clientihd).datepicker('update');
    $('div_grupofecha_clientihd .input-group.date').datepicker('update', clientihd);
    $('#btnUpdateTallacolor').removeClass('hide');
    //$('#txt_fecha_exftydatemax').val(fechaftymax).datepicker('update');
    $('#div_grupo_date_maxexfty .input-group.date').datepicker('update', fechaftymax);
}

function validarAddTallaColor() {
    let req =_required({ id: 'div_datos_tallacolor', clase: '_datatallacolor' });
    return req;
}

function save_new_requerimiento() {
    let req = _required({ id: 'panelgeneral_requerimiento', clase: '_enty' });
    let pasavalidacion = validarDetalleAntesGrabar();

    if (req && pasavalidacion) {
        Validar();
    }
}

function GuardarNuevo() {
    let orequerimiento = _getParameter({ id: 'panelEncabezado', clase: '_enty' }), idrequerimiento = _('hf_idrequerimiento').value,
           requerimientodetalle = JSON.stringify(getArrayRequerimientoDetalle('tbody_tallacolor', { idrequerimiento: idrequerimiento })),
           requerimientoarchivo = JSON.stringify(getArrayRequerimientoArchivo('tbody_tabla_archivos')),
           urlaccion = 'GestionProducto/Requerimiento/save_new_Requerimiento', form = new FormData(), tabla = _('tbody_tabla_archivos');

    orequerimiento["comentario"] = _('txta_comentario').value;

    form.append('par', JSON.stringify(orequerimiento));
    form.append('parDetail', requerimientodetalle);
    form.append('parfoot', requerimientoarchivo);

    let totalarchivos = tabla.rows.length;
    let arrfile = [];
    for (let i = 0; i < totalarchivos; i++) {
        let archivo = tabla.rows[i].cells[3].children[0].files[0];
        archivo.modificado = 1;
        form.append('file' + i, archivo);
    }

    Post(urlaccion, form, function (rpta) {
        let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null,
            data = JSON.parse(orpta.data)[0].result != '' ? JSON.parse(JSON.parse(orpta.data)[0].result) : null,
            odataRequerimientoDetalle = JSON.parse(orpta.data)[0].requerimientodetalle,
            odataArchivos = JSON.parse(orpta.data)[0].archivos;
        if (data != null) {
            ovariables_req_new.accion = 'edit';
            _('hf_idrequerimiento').value = data.idrequerimiento;
            _('txt_Codigo').value = data.codigo;
            ejecutarDespuesGrabar(ovariables_req_new.accion, odataRequerimientoDetalle, odataArchivos);
            _swal(orpta);
        }
    });    
}

function save_edit_requerimiento(event) {
    let o = event.target, tag = o.getAttribute('data-boton');
    let req = _required({ id: 'panelgeneral_requerimiento', clase: '_enty' }), idrequerimiento = _('hf_idrequerimiento').value;
    let pasavalidacion = validarDetalleAntesGrabar();
    if (req && pasavalidacion) {
        let orequerimiento = _getParameter({ id: 'panelEncabezado', clase: '_enty' }),
            requerimientodetalle = JSON.stringify(getArrayRequerimientoDetalle('tbody_tallacolor', { idrequerimiento: idrequerimiento })),
            requerimientoarchivo = JSON.stringify(getArrayRequerimientoArchivo('tbody_tabla_archivos')),
            requerimientoarchivoeliminados = JSON.stringify(getArrayRequerimientoArchivo_eliminados('tbody_tabla_archivos')),           
            urlaccion = 'GestionProducto/Requerimiento/save_edit_requerimiento',
            form = new FormData(),
            tabla = _('tbody_tabla_archivos');

        orequerimiento["comentario"] = _('txta_comentario').value;
        orequerimiento["comentarioestado"] = _('txta_comentario_estado').value;
        orequerimiento['idestado'] = _('cboEstado').value;
        orequerimiento['fechaestado'] = _convertDate_ANSI(_('txt_fechaestado').value);

        form.append('par', JSON.stringify(orequerimiento));
        form.append('parDetail', requerimientodetalle);        
        form.append('parfoot', requerimientoarchivo);
        form.append('parsubfoot', requerimientoarchivoeliminados);

        let totalarchivos = tabla.rows.length, arrfile = [], contador = 0;
        for (let i = 0; i < totalarchivos; i++) {
            let par = tabla.rows[i].getAttribute('data-par'), estamodificado = _par(par, 'modificado');
            
            if (estamodificado == 1) {
                let archivo = tabla.rows[i].cells[3].children[0].files[0];
                form.append('file' + contador, archivo);
                contador++;
            }
        }

        Post(urlaccion, form, function (rpta) {
            let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null,
                odataRequerimientoDetalle = JSON.parse(orpta.data)[0].requerimientodetalle,
                odataArchivos = JSON.parse(orpta.data)[0].archivos;

            if (orpta != null) {
                if (tag == 'update') {
                    ejecutarDespuesGrabar(ovariables_req_new.accion, odataRequerimientoDetalle, odataArchivos);
                    _swal(orpta);
                } else if (tag == 'sendmail') {
                    $('#modal_enviarcorreo').modal('show');
                }
                
            }
        });
    }
}

function ejecutarDespuesGrabar(accion, dataDetalleRequerimiento, dataArchivos) {
    let odataDetalle = null, odataArchivos = null;
    switch (accion) {
        case 'new':
            // ACTUALIZAR TABLA DETALLE REQUERIMIENTO
            odataDetalle = CSVtoJSON(dataDetalleRequerimiento, '¬', '^');
            llenartabladetalle(odataDetalle);
            handlerAccionTblTallaColor();

            // LLENAR GRID ARCHIVO
            odataArchivos = CSVtoJSON(dataArchivos, '¬', '^');
            llenartablaarchivos(odataArchivos);
            handlerAccionTblArchivos();

            break;
        case 'edit':
            MostrarEditar();
            // ACTUALIZAR TABLA DETALLE REQUERIMIENTO
            odataDetalle = CSVtoJSON(dataDetalleRequerimiento, '¬', '^');
            llenartabladetalle(odataDetalle);
            handlerAccionTblTallaColor();

            // LLENAR GRID ARCHIVO
            odataArchivos = CSVtoJSON(dataArchivos, '¬', '^');
            llenartablaarchivos(odataArchivos);
            handlerAccionTblArchivos();

            break;
        default:
    }
}

function getArrayRequerimientoDetalle(tbl_tbody, oparametro) {
    let tbl = document.getElementById(tbl_tbody), totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par');
        let obj = {
            idrequerimientodetalle: _par(par, 'idrequerimientodetalle'),
            idrequerimiento: oparametro.idrequerimiento,
            idclientecolor: _par(par, 'idclientecolor'),
            idclientetalla: _par(par, 'idclientetalla'),
            cantidad: row.cells[3].children[0].value,
            cantidadcm: row.cells[4].children[0].value,
            fechacliente: row.cells[5].children[1].innerText.trim(),
            fechafty: row.cells[6].children[1].innerText.trim(),
            fechaactual: row.cells[7].innerText,
            fechaclientihd: row.cells[8].innerText,
            fechaftymax: _convertDate_ANSI(row.getElementsByClassName('clsfechaftymax')[0].innerText.trim())
        }
        arr[i] = obj;
    }

    return arr;
}

function getArrayRequerimientoArchivo(tbl_tbody) {
    let tbl = document.getElementById(tbl_tbody), totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

        if (estamodificado == 1 && clsrow == undefined) {
            let obj = {
                idarchivo: parseInt(_par(par, 'idarchivo')),
                nombrearchivooriginal: row.cells[1].innerText,
                modificado: parseInt(_par(par, 'modificado'))
            }
            arr.push(obj);
        }
    }

    return arr;
}

function getArrayRequerimientoArchivo_eliminados(tbl_tbody) {
    let tbl = document.getElementById(tbl_tbody), totalfilas = tbl.rows.length, row = null, arr = [];

    for (let i = 0; i < totalfilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par'), clsrow = row.classList[0], idarchivo = parseInt(_par(par, 'idarchivo'));

        if (clsrow == 'hide' && idarchivo > 0) {
            let obj = {
                idarchivo: idarchivo,
                nombrearchivooriginal: row.cells[1].innerText,
                modificado: parseInt(_par(par, 'modificado'))
            }
            arr.push(obj);
        }
    }
    return arr;
}

function getArrayComentario(tbl_body) {
    let tbl = document.getElementById(tbl_body), totalFilas = tbl.rows.length, row = null, arr = [];
    for (let i = 0; i < totalFilas; i++) {
        row = tbl.rows[i];
        let par = row.getAttribute('data-par');
        let obj = {
            comentario : row.cells[1].children[0].value
        }
        arr[i] = obj;
    }  
    return arr;   
}

function llenartablaComentario(data) {
    let tbl = _('tBody_Com'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {            
            html += `<tr style='vertical-align:middle;' data-par='idcomentario:${data[i].idcomentario},nombrearchivo:${data[i].nombrearchivo},nombrearchivoweb:${data[i].nombrearchivoweb}'>
                    <td style='vertical-align:middle;' class ='text-center'>
                        <div class ='btn-group'>
                            <button class ='btn btn-danger btn-sm _deletefile'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </div>
                    </td>
                    <td><textarea rows='5' disabled="disabled" class ='form-control newcomentario'>${data[i].comentario}</textarea> </td>
                    <td style='vertical-align:middle;' class ='text-center'>
                        <div class='btn-group'>
                            <button type='button' title='Download File' class ='btn btn-link _download'>${data[i].nombrearchivo}</button>
                        </div>
                    </td>
                    <td style='vertical-align:middle;text-align:center;'>${data[i].Usuario}</td>
                    <td style='vertical-align:middle;text-align:center;'>${data[i].Fecha}</td>
                </tr>
            `;         
        }
        tbl.innerHTML = html;
    }
    //NewComentarioHtml()
}

//function NewComentarioHtml() {
//    $(".newcomentario").kendoEditor({
//        resizable: {
//            content: true,
//        },
//        tools: [
//            "bold",
//            "italic",
//            "underline",
//            "strikethrough",
//            "justifyLeft",
//            "justifyCenter",
//            "justifyRight",
//            "justifyFull",
//            "insertUnorderedList",
//            "insertOrderedList",
//            "indent",
//            "outdent",
//            "subscript",
//            "superscript",
//            "formatting",
//            "fontName",
//            "fontSize",
//            "foreColor",
//            "backColor",
//            "cleanFormatting"
//        ]
//    });
//}
 
function handlerAccionTblCom() {
    let tbl = _('tBody_Com'),
        arrayDelete = _Array(tbl.getElementsByClassName('_deletefile')),
        arrayDownload = _Array(tbl.getElementsByClassName('_download'));

    arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontblcom(e, 'drop'); }));
    arrayDownload.forEach(x => x.addEventListener('click', e => { controladoracciontblcom(e, 'download'); }));
}

function controladoracciontblcom(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        par = fila.getAttribute('data-par');
        eventotblcom(par, accion, fila);
    }
}

function eventotblcom(par, accion, fila) {
    switch (accion) {
        case 'drop':
            MostrarConfElimCom(fila);
            break;
        case 'download':
            downloadFileCom(fila);
            break;
    }
}

function MostrarConfElimCom(fila) {
    swal({
        title: "Are you sure to delete this comment?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        eliminarCom(fila)
        return;
    });
}

function eliminarCom(fila){
    let par = fila.getAttribute('data-par'),
        idcomentario = _par(par, 'idcomentario'),
        obj = { idcomentario: idcomentario },
        urlAccion = "GestionProducto/requerimiento/EliminarComentario",
        form = new FormData();

    form.append('par', JSON.stringify(obj));

    Post(urlAccion, form, function (rpt) {
        if (rpt > 0) {

            swal({
                title: "Deleted!",
                text: "",
                icon: "success",
            });

            parametro = JSON.stringify({ idrequerimiento: _('hf_idrequerimiento').value });
            urlaccion = 'GestionProducto/Requerimiento/getData_requerimiento_foredit?par=' + parametro;            
            Get(urlaccion, CargarComentario);
        }
    });
}

function CargarComentario(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data), html = '';
    if (rpta != null) {
        if (dataparse != null) {
            let odataComentario = CSVtoJSON(dataparse[0].comentario, '¬', '^');
            llenartablaComentario(odataComentario);
            handlerAccionTblCom();
        }
    }
}

function downloadFileCom(fila) {
    let par = fila.getAttribute('data-par');
    let nombrearchivo = fila.cells[2].innerText, nombrearchivoweb = _par(par, 'nombrearchivoweb');
    let urlaccion = '../GestionProducto/Requerimiento/DescargaArchivoCom?pNombreArchivo=' + nombrearchivo + '&pNombreArchivoWeb=' + nombrearchivoweb;

    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function res_ini_edit(data) { 
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data), html = '';

    if (rpta != null) {
        _('hf_rutafileserver_imgestilo').value = rpta.Message;
        if (dataparse != null) {
            let orequerimiento = JSON.parse(dataparse[0].requerimiento);

            // DATOS CABECERA
            _('txt_Codigo').value = orequerimiento.codigo;
            _('hf_idestilo').value = orequerimiento.idestilo;
            _('hf_idrequerimiento').value = orequerimiento.idrequerimiento;
            _('txta_comentario').value = orequerimiento.comentario;
            _('txta_codigotela').innerHTML = orequerimiento.nombretela;

            // DATOS DEL CAMBIO DE ESTADO
            _('txta_comentario_estado').innerHTML = orequerimiento.comentarioestado;
            $('#txt_fechaestado').val(orequerimiento.fechaestado).datepicker('update');
            
            // LLENAR COMBOS
            _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].clientes);
            _('cboDestinos').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].destinos);
            _('cboFabrica').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].proveedor);
            _('cboVersion').innerHTML = _comboFromCSV(dataparse[0].version);
            _('cboTipoMuestra').innerHTML =  _comboFromCSV(dataparse[0].tipomuestraxcliente);
            _('cboColor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].clientecolor);
            _('cboTalla').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].clientetalla);
            _('cboEstado').innerHTML = _comboFromCSV(dataparse[0].estados);

            _('cboCliente').value = orequerimiento.idcliente;
            
            $("#cboFabrica").val(orequerimiento.idproveedor).trigger("change");

            _('cboTipoMuestra').value = orequerimiento.idtipomuestraxcliente;
            _('cboVersion').value = orequerimiento.version;
            _('cboEstado').value = orequerimiento.estado;

            //if (ovariables_req_new.existeperfilcomercial == -1) {
            //    _('cboTeam').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].teamddp);
            //} else {
            //    _('cboTeam').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].team);
            //}
            _('cboTeam').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(dataparse[0].team);
            _('cboTeam').value = orequerimiento.idgrupocomercial;
            //if (ovariables_req_new.idgrupocomercial != 0) {
            //    //_('cboTeam').value = ovariables_req_new.idgrupocomercial
            //    _('cboTeam').value = orequerimiento.idgrupocomercial;
            //}

            // DATOS DEL ESTILO
            let rutafileserver = _('hf_rutafileserver_imgestilo').value;
            _('imgEstilo').src = rutafileserver + orequerimiento.imagenwebnombre;
            _('txt_temporada').value = orequerimiento.nombretemporada;
            _('txt_codigoestilo').value = orequerimiento.codigoestilo;
            _('txta_descripcionestilo').value = orequerimiento.descripcionestilo;
            _('txt_division').value = orequerimiento.nombredivision;
            
            // LLENAR GRID DETALLE
            let odataDetalle = CSVtoJSON(dataparse[0].requerimientodetalle, '¬', '^');
            llenartabladetalle(odataDetalle);
            handlerAccionTblTallaColor();

            // LLENAR GRID ARCHIVO
            let odataArchivos = CSVtoJSON(dataparse[0].archivos, '¬', '^');
            llenartablaarchivos(odataArchivos);
            handlerAccionTblArchivos();

            // LLENAR COMENTARIOS
            let odataComentario = CSVtoJSON(dataparse[0].comentario, '¬', '^');
            llenartablaComentario(odataComentario);
            handlerAccionTblCom();

        }
    }   
}

function llenartabladetalle(data) {
    let tbl = _('tbody_tallacolor'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            let style = '';
            if (data[i].estado == 1) {
                style = 'background-color:#B2E8A8'
            }else if (data[i].estado == 0){
                if (data[i].cantdespacho > 0 || data[i].cantcmdespacho > 0) {
                    style = 'background-color:#FAFAC3'
                }
            }
            
            html += `<tr style='${style}' data-par='idclientecolor:${data[i].idclientecolor},idclientetalla:${data[i].idclientetalla},idrequerimientodetalle:${data[i].idrequerimientodetalle},estado:${data[i].estado},cantdespacho:${data[i].cantdespacho},cantcmdespacho:${data[i].cantcmdespacho}'>
                <td class ='text-center'>
                    <div class ='btn-group'>
                        <button class ='btn btn-danger btn-sm _delete_tallacolor'>
                            <span class='fa fa-trash'></span>
                        </button>
                        <button class ='btn btn-success btn-sm _edit_tallacolor'>
                            <span class ='fa fa-pencil-square-o'></span>
                        </button>
                          
                    </div>
                </td>
                <td>${data[i].nombreclientecolor}</td>
                <td>${data[i].nombreclientetalla}</td>
                <td>
                    <input type='text' value='${data[i].cantidad}' class ='form-control _clscantidad_tallacolor text-right' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td>
                    <input type='text' value='${data[i].cantidadcm}' class ='form-control _clscantidadcontramuestra_tallacolor text-right' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td style="vertical-align:middle;">
                    <div class='col-sm-2 form-check' >
                        <input type='checkbox' class ='form-check-input chk_cid' name='chkcid' onchange='changechkcid(this)' />
                    </div>
                    <div class ='col-sm-10'>
                        <label class='_clsfechacliente_tallacolor'> ${data[i].fechacliente} </label>
                    </div>                  
                </td>
                <td style="vertical-align:middle;">
                    <div class ='col-sm-1 form-check' >
                        <input type='checkbox' class ='form-check-input chk_efd' name='chkefd' onchange='changechkefd(this)' />
                    </div>
                    <div class ='col-sm-9'>
                        <label class ='_clsfechafabrica_tallacolor'> ${data[i].fechafty} </label>
                    </div>
                </td>
                <td class ='clsfechaftymax text-center'>${data[i].fechaftymax}</td>
                <td class='hide'>${data[i].fechaactual}</td>
                <td class='hide'>${data[i].fechaclienteihd}</td>
            </tr>`;
        }
        tbl.innerHTML = html;       
    }   
}

function ejecutarmodalnewreq() {
    let modal = $(this);

    modal.find('.modal-title').text('New');

    let urlaccion = 'GestionProducto/Requerimiento/_newreq';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodynewreq').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs('GestionProducto/Requerimiento/_newreq');
    });
}

function new_requerimiento() {
    $('#modal_newreq').modal('show');
}

function changeFile(e) {
    let archivo = this.value;
    let ultimopunto = archivo.lastIndexOf(".");
    let ext = archivo.substring(ultimopunto + 1);
    ext = ext.toLowerCase();
    let nombre = e.target.files[0].name, html = '';
    let file = e.target.files;
    
    html = `<tr data-par='idarchivo:0,modificado:1'>
            <td class='text-center'>
                <div class ='btn-group'>
                    <button class ='btn btn-danger btn-sm _deletefile'>
                        <span class ='fa fa-trash-o'></span>
                    </button>
                </div>
            </td>
            <td>${nombre}</td>
            <td class ='text-center'>
                <div class='btn-group'>
                    <button type='button' class ='btn btn-link _download hide'>Downlad</button>
                </div>
            </td>
            <td class='hide'></td>
        </tr>
    `;    
    _('tbody_tabla_archivos').insertAdjacentHTML('beforeend', html);

    let tbl = _('tbody_tabla_archivos'), total = tbl.rows.length;
    let filexd = _('filearchivo').cloneNode(true);
    filexd.setAttribute('id', 'file' + (total - 1));
    tbl.rows[total - 1].cells[3].appendChild(filexd);
    handlerAccionTblArchivos_add(total);
}

function llenartablaarchivos(data) {
    let tbl = _('tbody_tabla_archivos'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='idarchivo:${data[i].idarchivo},modificado:0,nombrearchivogenerado:${data[i].nombrearchivo}'>
                    <td class='text-center'>
                        <div class ='btn-group'>
                            <button class ='btn btn-danger btn-sm _deletefile'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </div>
                    </td>
                    <td>${data[i].nombrearchivooriginal}</td>
                    <td class ='text-center'>
                        <div class='btn-group'>
                            <button type='button' class ='btn btn-link _download'>Downlad</button>
                        </div>
                    </td>
                    <td class='hide'></td>
                </tr>
            `;
        }
        tbl.innerHTML = html;
    }
}

function handlerAccionTblArchivos() {
    let tbl = _('tbl_archivos'), arrayDelete = _Array(tbl.getElementsByClassName('_deletefile')), arrayDownload = _Array(tbl.getElementsByClassName('_download'));

    arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontblarchivos(e, 'drop'); }));
    arrayDownload.forEach(x => x.addEventListener('click', e => { controladoracciontblarchivos(e, 'download'); }));
}

function handlerAccionTblArchivos_add(indice) {
    let tbl = _('tbl_archivos'), rows = tbl.rows[indice];
    rows.getElementsByClassName('_deletefile')[0].addEventListener('click', e => {
        controladoracciontblarchivos(e, 'drop');
    });
    rows.getElementsByClassName('_download')[0].addEventListener('click', e => {
        controladoracciontblarchivos(e, 'download');
    });
}

function controladoracciontblarchivos(event, accion) {
    let o = event.target, tag = o.tagName, fila = null, par = '';

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        par = fila.getAttribute('data-par');
        eventotblarchivos(par, accion, fila);
    }
}

function eventotblarchivos(par, accion, fila) {
    switch (accion) {
        case 'drop':            
            fila.classList.add('hide');
            break;
        case 'download':
            downloadFile(fila);
            break;
    }
}

function downloadFile(fila) {
    let par = fila.getAttribute('data-par');
    let nombrearchivooriginal = fila.cells[1].innerText,
        nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
    let urlaccion = '../GestionProducto/Requerimiento/DescargaArchivo?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivoGenerado=' + nombrearchivogenerado;

    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

function validarDetalleAntesGrabar(){
    let tbl = _('tbody_tallacolor'), pasavalidacion = true, totalfilas = tbl.rows.length, mensaje = '', tieneregistros = true;

    if (totalfilas <= 0) {
        pasavalidacion = false;
        tieneregistros = false;
        mensaje += '- Falta ingresar el detalle';
    }
    if (mensaje != '') {
        _swal({ estado: 'error', mensaje: mensaje });
    }
    return pasavalidacion;
}

function returnindex() {
    //let urlaccion = 'GestionProducto/Requerimiento/Index', idrequerimiento = _('hf_idrequerimiento').value, idgrupocomercial = ovariables_req_new.idgrupocomercial.trim();
    //_Go_Url(urlaccion, urlaccion, `idgrupocomercial:${idgrupocomercial},idrequerimiento:${idrequerimiento}`);
    _ruteo_masgeneral('GestionProducto/Requerimiento/index')
         .then((rpta) => {
             // nada
         }).catch(function (e) {
             console.log(e);
         });
}
 
function GoEstilo(){
    IdEstilo = $('#hf_idestilo').val();
    let urlaccion = 'GestionProducto/Estilo/New',
            urljs = 'GestionProducto/Estilo/New';
    _Go_Url(urlaccion, urljs, 'accion:edit,idestilo:' + IdEstilo + ',idgrupocomercial:' + ovariables_req_new.idgrupocomercial);
}

function req_ini() {
    let accion = ovariables_req_new.accion, urlaccion = '', parametro = {};
    switch (accion) {
        case 'new':
            parametro = { xd: 1, idgrupocomercial: ovariables_req_new.idgrupocomercial , perfil : $('#txtperfil').val()  };
            urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosNew?par=' + JSON.stringify(parametro);
            Get(urlaccion, res_ini);
            break;
        case 'edit':
            parametro = JSON.stringify({ idrequerimiento: _('hf_idrequerimiento').value });
            urlaccion = 'GestionProducto/Requerimiento/getData_requerimiento_foredit?par=' + parametro;
            Get(urlaccion, res_ini_edit);
            break;
        default:
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
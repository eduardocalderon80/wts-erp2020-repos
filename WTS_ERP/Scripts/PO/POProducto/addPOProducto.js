/// <reference path="../home/util.js" />

// :0 :variable principal
var oproducto = {
    accion: '',
    idpo: '',
    idpocliente: '',
    idpoclienteproducto: '',
    tipopo: '',
    arrdirecciones: [],
    accionbuy: ''
}

// variable para grilla consumir
var oUtil = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    idtable: 'tblgridbuybuscar'
}

var ovariables = {
    adata: [],
    adataresult: [],
    idtable: '',
    cadenalistaclientedireccion: '',
    listapoclienteproductodestino: [],
    po: {},
    pocliente: [],
    poclienteproducto: [],
    poclienteproductodestino: []

}

// :1
function load() {
    // :edu /*seccion modal*/
    _modal("buscarproducto");
    
    // => carga de parametros
    let txtpar = _('txtpar'), par = '';
    if (txtpar !== null && !_isEmpty(txtpar.value)) {
        par = txtpar.value;
        oproducto.accion = _par(par, 'accion');
        oproducto.idpo = _par(par, 'idpo');
        oproducto.idpoclienteproducto = _par(par, 'idpoclienteproducto');
        oproducto.tipopo = _par(par, 'tipopo');
    }

    // => buy
    if (oproducto.tipopo === 'buy') { _('cboTipoPo').innerHTML = _comboItem({ value: '1', text: 'buy' }); }
    else { _('btnConsumirBuy').classList.remove('hide'); }


    // => carga de eventos
    _('cboClientePo').addEventListener('change', carga_camposxcliente);
    _('cboTipoPrecio').addEventListener('change', setear_xtipoprecio);
    _('btnnext1').addEventListener('click', next);
    _('btnnext2').addEventListener('click', next);
    _('btnAddDestination').addEventListener('click', add_itemdestination);
    _('btnAddPo').addEventListener('click', grabarnuevopo);
    _('btnUpdataPo').addEventListener('click', updatepo, false);
    _('btnNewPO').addEventListener('click', carga_nuevapo, false);
    _('btnAdd').addEventListener('click', grabarpo_add, false);
    _('btnCancelarUpdate').addEventListener('click', cancelarupdate, false);
    _('btnCleanDestination').addEventListener('click', limpiartabladestinos, false);

    //fechas
    $('#grupoFechaArrivalPO .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtArrivalPO').value.length == 0) { padre.classList.add('has-error'); }
    });

    $('#grupoFechaFactory .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtFechaDespachoFabrica').value.length == 0) { padre.classList.add('has-error'); }
    });

    $('#grupoFechaCliente1 .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtFechaDespachoCliente').value.length == 0) { padre.classList.add('has-error'); }
    });

    $('#grupoFechaCliente2 .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtFechaEntregaCliente').value.length == 0) { padre.classList.add('has-error'); }
    });

    //numericos
    $('#txtPrecioFabrica').autoNumeric('init');
    $('#txtPrecioCliente').autoNumeric('init');
    $('#txtCantidadRequerida').autoNumeric('init');

    // :modal con tamaño
    _('btnbuscarproducto').addEventListener('click', function () { _modal_open("buscarproducto", 900); }, false);
    _('btnConsumirBuy').addEventListener('click', x=> {
        if (controlador_buscar('buscar_buy')) {
            fn_activar_botones_next(false);
            _modalVentanaGeneral2(900);
        }
    }, false);


    // :modal
    $("#modal_buscarproducto").on("show.bs.modal", ejecutarmodalbuscarproducto);
    $("#modal_buscarproducto").on("hidden.bs.modal", function () { });
    $("#modal_ventanaGeneral2").on("show.bs.modal", ejecutarmodalconsumirbuy);
    $("#modal_ventanaGeneral2").on("hidden.bs.modal", function () { });

    // :accion
    switch (oproducto.accion) {
        case 'new':
            _('btnnext1').classList.remove('hide');
            _('panelDetalle').classList.add('hide');
            _('panelResult').classList.add('hide');
            _('btnConsumirBuy').classList.remove('hidden');
            fn_activar_botones_next(true);
            break;
        case 'edit':
            _('btnAddPo').classList.add('hidden');
            _('btnUpdataPo').classList.remove('hidden');
            _('btnCancelarUpdate').classList.remove('hidden');
            $('#txtPoCliente').prop("disabled", true);
            _('btnConsumirBuy').classList.add('hidden');
            fn_activar_botones_next(false);
            $('#cboClientePo').prop("disabled", true);
            $('#spanRefrescarCboCliente').hide();
            break;
        default:
            _('panelDetalle').classList.remove('hide');
            _('panelFechas').classList.remove('hide');
            break;
    }

    // :refresh
    _S('._refresh').forEach(btn=>btn.addEventListener('click', e=> { controlador_update(e) }));

    // evento para refresh combo direccion
    _('arefrescardireccion').addEventListener('click', ejecutarrefreshdireccion, false);
}

// :2
function req_ini() {
    let accion = oproducto.accion,
        idcliente = 0,
        par = '';
    switch (accion) {
        case 'new':
            Get('PO/POProducto/getData_ClienteProveedor?par=', res_ini);
            break;
        case 'edit':
            par = _parToJSON(_('txtpar').value);
            Get('PO/POProducto/getData_byPOProducto?par=' + par, res_edit);
            break;
        default:
            break;
    }
}


function res_edit(orespuesta) {
    //alert(oresp);
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores != null) {
        _('cboClientePo').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientes);
        _('cboProveedor').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.proveedores);

        let datapo = JSON.parse(ores.po)[0],
            datapocliente = JSON.parse(ores.pocliente)[0],
            datapoclienteproducto = JSON.parse(ores.poclienteproducto),
            datapoclienteproductodestino = JSON.parse(ores.poclienteproductodestino),
            idcliente = datapo.idcliente, idproveedor = 0,
            idclientetemporada = datapo.idclientetemporada, iddivisioncliente = 0,
            iddivisionasociado = 0, cartonlabel = 0, idtipoprecio, idflete = 0, idformaenvio = 0,
            cantidadrequerida = 0,
            arrayentypaneldata = $("#panelData ._enty"), totalarrayentypaneldata = arrayentypaneldata.length,
            arrayentypanelfechas = $("#panelFechas ._enty"), totalarrayentypanelfechas = arrayentypanelfechas.length,
            arrayentypaneldata2_comemtarios = $("#panelData2 ._enty"), totalarrayentypaneldata2 = arrayentypaneldata2_comemtarios.length,
            tipoinput = '', dataid = '', valordata = '', codigopocliente = '', arrivalpo = '',
            idpocliente = 0, idpoclienteproducto = 0,
            fechadespachofabrica = '', fechadespachocliente = '', fechaentregacliente = '',
            tituloprincipal = '<h2>PO-Producto | ' + datapo.codigo + '</h2>';

        _('divtituloprincipal').innerHTML = tituloprincipal;
        _('hf_IdPo').value = datapo.idpo;

        let listapoclienteproducto = datapoclienteproducto.filter(function (el) {
            return el.idpoclienteproducto == oproducto.idpoclienteproducto
        });

        let listapoclienteproductodestino = datapoclienteproductodestino.filter(function (el) {
            return el.idpoclienteproducto == oproducto.idpoclienteproducto;
        });

        idproveedor = listapoclienteproducto[0].idproveedor;

        _('cboClientePo').value = idcliente > 0 ? idcliente : '';
        _('cboProveedor').value = idproveedor > 0 ? idproveedor : '';


        // datos de pocliente
        arrivalpo = datapocliente.arrivalpo;
        codigopocliente = datapocliente.codigolst;
        idpocliente = datapocliente.idpocliente;

        _('hf_IdPoCliente').value = idpocliente;
        $('#grupoFechaArrivalPO .input-group.date').datepicker('update', arrivalpo);
        _('txtPoCliente').value = codigopocliente;

        // input de poclienteproducto
        iddivisioncliente = listapoclienteproducto[0].iddivisioncliente
        iddivisionasociado = listapoclienteproducto[0].iddivisionasociado;
        idtipoprecio = listapoclienteproducto[0].idtipoprecio;
        idflete = listapoclienteproducto[0].idflete;
        idformaenvio = listapoclienteproducto[0].idformaenvio;
        cartonlabel = listapoclienteproducto[0].cartonlabel;
        cantidadrequerida = listapoclienteproducto[0].cantidadrequeridalst;
        idpoclienteproducto = listapoclienteproducto[0].idpoclienteproducto;
        fechadespachofabrica = listapoclienteproducto[0].fechadespachofabrica;
        fechadespachocliente = listapoclienteproducto[0].fechadespachocliente;
        fechaentregacliente = listapoclienteproducto[0].fechaentregacliente;


        _('hf_IdProducto').value = listapoclienteproducto[0].idproducto;
        _('hf_IdPoClienteProducto').value = idpoclienteproducto;
        _('cboDivision').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientedivision);
        _('cboDivisionAsociado').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientedivisionasociado);
        _('cboTemporadaCliente').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientetemporada);
        _('cboTemporadaCliente').value = idclientetemporada > 0 ? idclientetemporada : '';
        _('cboDivision').value = iddivisioncliente > 0 ? iddivisioncliente : '';
        _('cboDivisionAsociado').value = iddivisionasociado > 0 ? iddivisionasociado : '';
        _('chkCartonLabel').checked = cartonlabel === 1;
        _('cboTipoPrecio').value = idtipoprecio; // harcodeados
        _('cboFlete').value = idflete;// harcodeados
        _('cboFormaEnvio').value = idformaenvio;// harcodeados
        _('txtCantidadRequerida').value = cantidadrequerida;
        $('#grupoFechaFactory .input-group.date').datepicker('update', fechadespachofabrica);
        $('#grupoFechaCliente1 .input-group.date').datepicker('update', fechadespachocliente);
        $('#grupoFechaCliente2 .input-group.date').datepicker('update', fechaentregacliente);

        // automatizando carga de input
        if (totalarrayentypaneldata > 0) {
            for (i = 0; i < totalarrayentypaneldata; i++) {
                tipoinput = arrayentypaneldata[i].getAttribute('type');
                dataid = arrayentypaneldata[i].getAttribute('data-id');
                if (tipoinput === 'text') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata !== undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                } else if (tipoinput === 'hidden') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata !== undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                }
            }
        }
  
        // comentarios
        if (totalarrayentypaneldata2 > 0) {
            for (i = 0; i < totalarrayentypaneldata2; i++) {
                tipoinput = arrayentypaneldata2_comemtarios[i].classList.toString();
                dataid = arrayentypaneldata2_comemtarios[i].getAttribute('data-id');
                let indiceclassname = tipoinput.indexOf('_textarea');

                if (indiceclassname >= 0) {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata !== undefined) {
                        arrayentypaneldata2_comemtarios[i].value = valordata;
                    }
                }
            }
        }

        ovariables.cadenalistaclientedireccion = ores.clientedireccion;
        generartablapoclienteestilodestinofromloadeditar(oproducto.idpoclienteproducto, listapoclienteproductodestino);
        let agrilla = CSVtoJSON(ores.grilla, '¬', '^');
        if (agrilla.length > 0) { loadgrilla(agrilla); }
    }
}

// :3
function res_ini(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores !== null) {
        _('cboClientePo').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientes);
        _('cboProveedor').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.proveedores);
    }
}

// :funciones
function carga_camposxcliente(event) {
    let codcliente = event.target.value, valoranterior = event.target.getAttribute('data-valor'), totalfilasdestinos = _('tbodyClienteDireccionDestino').rows.length;

    if (valoranterior == null) {
        event.target.setAttribute('data-valor', codcliente);
        if (codcliente !== '') {
            codcliente = parseInt(codcliente);
        }

        if (codcliente !== '') {

            Get('PO/POProducto/getData_byCliente?par=' + codcliente, res_carga_camposxcliente);
        }
        else { res_carga_camposxcliente('') }
    } else {
        if (totalfilasdestinos > 0) {
            let html = '<strong>if the customer changes, the information entered will be lost. </br> are you sure to change?</strong>';
            _modalConfirm(html, respuestasicambiarcliente, function () {
                respuestanocambiarcliente(valoranterior, event.target);
            });
        } else {
            if (codcliente !== '') {
                codcliente = parseInt(codcliente);
            }

            if (codcliente !== '') {

                Get('PO/POProducto/getData_byCliente?par=' + codcliente, res_carga_camposxcliente);
            }
            else { res_carga_camposxcliente('') }
        }
    }

}

function res_carga_camposxcliente(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null, existedata = false, item = _comboItem({ value: '', text: '--Select--' });

    if (ores !== null) {
        if ($.trim(ores) != '') {
            existedata = true;
        }
    }

    _('cboDivision').innerHTML = item + (existedata ? _comboFromCSV(ores.clientedivision) : '');
    _('cboDivisionAsociado').innerHTML = item + (existedata ? _comboFromCSV(ores.clientedivisionasociado) : '');
    _('cboTemporadaCliente').innerHTML = item + (existedata ? _comboFromCSV(ores.clientetemporada) : '');
    oproducto.arrdirecciones = existedata ? CSVtoJSON(ores.clientedireccion, '¬', '^') : [];
    ovariables.cadenalistaclientedireccion = ores.clientedireccion;
}

function setear_xtipoprecio(event) {
    let indice = event.target.value,
        valor = indice == '1' ? 'ddp' : (indice == '2' ? 'fob' : ''),
        flete = _('cboFlete'),
        padre = flete.parentNode.parentNode.parentNode;
    switch (valor) {
        case '':
            flete.selectedIndex = 0;
            flete.disabled = true;
            padre.classList.remove('has-error');
            break;
        case 'fob':
            flete.selectedIndex = 0;
            flete.disabled = true;
            padre.classList.remove('has-error');
            break;
        case 'ddp':
            flete.disabled = false;
            break;
    }
}

function newproducto() {
    //:new
    let req = _required({ id: 'poproducto', clase: '_enty' });
    alert(req);
}


function ejecutarmodalbuscarproducto(event) {
    let modal = $(this);
    modal.find(".modal-title").text("search product");
    Get('PO/POProducto/_BuscarProducto', mostrar_ventana);
}

function mostrar_ventana(vistahtml) {
    var html = vistahtml;
    $("#modal_bodybuscarproducto").html(html);
    popbuscarproducto();
}

// funciones para modal buscar producto
function getlistaproducto() {
    let codigoproducto = _('txtCodigoProductoBuscarPartial').value,
        nombreproducto = _('txtNombreProductoBuscarPartial').value,
        parametro = JSON.stringify({ 'codigoproducto': codigoproducto, 'nombreproducto': nombreproducto });
    Get('PO/POProducto/getData_Productos?par=' + parametro, mostrar_data);
}

function mostrar_data(orespuesta) {
    var data = $.trim(orespuesta).length > 0 ? JSON.parse(orespuesta) : null;
    if (data != null) {
        mostrargrillamodalbuscarproducto(data);
    }
}

function mostrargrillamodalbuscarproducto(data) {
    ovariables.adata = data;
    ovariables.adataresult = data;
    pintargrilla(ovariables.adata);
}

function pintargrilla(data) {
    var html = '', totalfilas = 0, i = 0;
    if (data != null && data.length > 0) {
        totalfilas = data.length;
        for (i = 0; i < totalfilas; i++) {
            html += '<tr>';
            html += '   <td class="text-center alineacionVertical hidden">';
            html += '       <input type="radio" name="rbSeleccionarProducto" id="rbSeleccionarProducto" value="' + data[i].codigoproducto + '" />';
            html += '   </td>';
            html += '   <td class="text-center">';
            html += '       <div style="display: none">';
            html += '           <input type="text" value="' + data[i].idproducto + '" />';
            html += '           <input type="text" value="' + data[i].preciocliente + '" />';
            html += '           <input type="text" value="' + data[i].preciofabrica + '" />';
            html += '       </div>';
            html += '       <div class="classcodigoproducto">';
            html += data[i].codigoproducto;
            html += '       </div>';
            html += '   </td>';
            html += '   <td>';
            html += data[i].nombreproducto
            html += '   </td>';
            html += '</tr>';
        }
        $("#tbodyGridBuscarProducto").html(html);

        handlertrbuscarproducto("tbodyGridBuscarProducto");
    } else {
        $("#tbodyGridBuscarProducto").html('');
    }
    html = null;
    totalfilas = null;
    i = null;
}

function popbuscarproducto() {
    $("#btnBuscarProductoPartial").on("click", function () { getlistaproducto(); });
    $("#btnAceptarProductoBuscar").on("click", function () { popasignarproducto(); });
}

function popasignarproducto() {
    let tbl = _('tbodyGridBuscarProducto'),
        x = 0, q = tbl !== null ? tbl.rows.length : 0,
        row = null;
    if (q > 0) {
        for (x = 0; x < q; x++) {
            if (tbl.rows[x].cells[0].children[0].checked) { row = tbl.rows[x]; break; }
        }
        if (row !== null) {
            let idproducto = row.cells[1].children[0].children[0].value;
            let precioclienteproducto = row.cells[1].children[0].children[1].value;
            let preciofabricaproducto = row.cells[1].children[0].children[2].value;
            let codigoproducto = row.cells[1].children[1].innerText.trim();
            let nombreproducto = row.cells[1].innerText.trim();
            let nombreproductodescripcion = row.cells[2].innerText.trim();

            _('hf_IdProducto').value = idproducto;
            _('txtCodigoEstiloProducto').value = codigoproducto;
            _('txtdescription').value = nombreproductodescripcion;
            _('txtPrecioCliente').value = parseFloat(precioclienteproducto).toFixed(2);
            _('txtPrecioFabrica').value = parseFloat(preciofabricaproducto).toFixed(2);
            _('hf_PopRespuesta').value = '1';//0 => return y 1 => grabar

            var codproducto = _('txtCodigoEstiloProducto').parentNode.parentNode.parentNode;
            var txtPrecioFabrica = _('txtPrecioFabrica').parentNode.parentNode;
            var txtPrecioCliente = _('txtPrecioCliente').parentNode.parentNode;
            codproducto.classList.remove('has-error');
            txtPrecioFabrica.classList.remove('has-error');
            txtPrecioCliente.classList.remove('has-error');

            $("#modal_buscarproducto").modal("hide");

        } else { alert('seleccione un producto'); }
    }
    x = null; q = null; totalfilas = null;
}


// :add destination
// :edu 20171015
function add_itemdestination() {
    let cadenahtml = "", totalfila = 0, indicefila = 0,
        hf_POClienteDestino_Contador = _('hf_POClienteDestino_Contador'),
        contador = hf_POClienteDestino_Contador.value !== '' ? parseInt(hf_POClienteDestino_Contador.value) + 1 : 1;
    options = oproducto.arrdirecciones.length > 0 ? _comboItem({ value: '', text: '--Select--' }) + _comboFromJSON(oproducto.arrdirecciones, 'id', 'direccion') : '';

    cadenahtml += '<tr>';
    cadenahtml += '     <td style="vertical-align: middle; text-align: center">';
    cadenahtml += '         <a id="aEliminarClienteDireccionDestino" name="aEliminarClienteDireccionDestino" data-idpoclienteestilodestino = "' + contador + '" class="fa fa-remove punteromouse btn btn-danger btn-sm" title="delete"></a>';
    cadenahtml += '     </td>';
    cadenahtml += '     <td style="vertical-align: middle; text-align: center" data-registroexistente="0">';
    cadenahtml += '         <div style="display: none;">';
    cadenahtml += '             <input id="txtIdPoClienteEstiloDestinoGrid" value="' + contador + '" />';
    cadenahtml += '         </div>';
    cadenahtml += '         <select class="form-control _combodireccion" id="cboClienteDireccionDestino" >';
    //cadenahtml += options;
    cadenahtml += '         </select>';
    cadenahtml += '     </td>';
    cadenahtml += '     <td style="vertical-align: middle; text-align: center">';
    cadenahtml += '         <input class="form-control text-center _inputtrcantidadrequerida" value="0" />';
    cadenahtml += '     </td>';
    cadenahtml += '</tr>';

    $("#tbodyClienteDireccionDestino").append(cadenahtml);

    totalfila = $("#tbodyClienteDireccionDestino > tr").length;
    hf_POClienteDestino_Contador.value = contador;
    //evento_removerdestino();
    crearhandlerparagridclientedestino();
    indicefila = parseInt(totalfila) - 1;
    cargarcomboclientedirecciondestino(indicefila);
    autonumericcantidadrequeridatabla();
    cadenahtml = null; contador = null;
}

function evento_removerdestino() {
    $('#tblClienteDireccionDestino').off('click');
    $('#tblClienteDireccionDestino').on('click', '._a', function (event) {
        var idpoclienteestilodestino = $(event)[0].currentTarget.getAttribute("data-idpoclienteestilodestino");
        $(this).closest('tr').remove();
    });
}




function next(event) {
    let btn = event.target.getAttribute('data-next') != null ? event.target.getAttribute('data-next') : null;
    if (btn !== null) {
        switch (btn) {
            case '1':
                valida_grupo(1);
                break;
            case '2':
                valida_grupo(2);
                break;
            default:
                break;
        }

    }
}

function valida_grupo(idnext) {
    if (idnext === 1) {
        var reqencabezado = _required({ id: 'panelEncabezado', clase: '_enty' });
        //alert(reqencabezado);
        if (reqencabezado) {
            _('btnnext1').classList.add('hide');
            _('btnnext2').classList.remove('hide');
            _('panelDetalle').classList.remove('hide');
            _('panelFechas').classList.add('hide');
            _('panelDestinos').classList.add('hide');
        }
    } else if (idnext === 2) {
        let reqdata = _required({ id: 'panelData', clase: '_enty' });
        //alert(reqdata);
        if (reqdata) {
            _('btnnext2').classList.add('hide');
            _('panelFechas').classList.remove('hide');
            _('panelDestinos').classList.remove('hide');
            _('panelResult').classList.remove('hide');
        }
    }
}


function get_poclienteproducto() {
    let obj = {
        idpoclienteproducto: _('hf_IdPoClienteProducto').value,
        idpocliente: _('hf_IdPoCliente').value,
        idpo: 0,
        idproducto: _('hf_IdProducto').value,
        idproveedor: _('cboProveedor').value,
        idtipoprecio: _('cboTipoPrecio').value,
        idflete: _('cboFlete').value,
        idformaenvio: _('cboFormaEnvio').value,
        iddivisioncliente: _('cboDivision').value,
        iddivisionasociado: _('cboDivisionAsociado').value,
        fechadespachofabrica: _convertDate_ANSI(_('txtFechaDespachoFabrica').value),
        fechadespachocliente: _convertDate_ANSI(_('txtFechaDespachoCliente').value),
        fechaentregacliente: _convertDate_ANSI(_('txtFechaEntregaCliente').value),
        preciocliente: _('txtPrecioCliente').value,
        preciofabrica: _('txtPrecioFabrica').value,
        cantidadrequerida: _('txtCantidadRequerida').value,
        comentariofabrica: _('txtComentarioFabrica').value,
        instruccionempaque: _('txtInstruccionEmpaque').value,
        hts: _('txtHTS').value,
        idtipopo: _('cboTipoPo').value,
        estadopo: 0,  // 0: abierto
        saldocantidadrequerida: 0.0,
        codigoproducto: _('txtCodigoEstiloProducto').value,
        nombreproveedor: $("#cboProveedor option:selected").text(),
        nombretipopoclienteproducto: $("#cboTipoPo option:selected").text(),
        cartonlabel: _('chkCartonLabel').checked ? 1 : 0,
        monto: 0,
        costo: 0,

        idpo_buy: _('hf_IdPo_Buy').value,	//:add :16
        idpocliente_buy: _('hf_IdPoCliente_Buy').value,
        idpoclienteproducto_buy: _('hf_IdPoClienteProducto_Buy').value,
        idproducto_buy: _('hf_IdProducto_Buy').value,
        codigopocliente_buy: _('hf_CodigoPoCliente_Buy').value,
        nombreproducto_buy: _('hf_NobreProducto_Buy').value,
        cantidadconsumida_buy: _('txtCantidadRequerida').value, // :edu 20171026 la cantidad consumida es la cantidad requerida
        estadocerrar_buy: _('hf_estadocerrar_buy').value
    },
    arr = [];
    arr.push(obj);
    return arr;
}





function loadgrilla(adata) {
    let sresult = '';
    if (adata !== null) {
        adata.forEach(x=> {
            sresult += `<tr>`;
            sresult += `<td class='text-center' style='vertical-align=middle;'><span class='input-group-btn'>`;
            sresult += `<button class='btn btn-info _edit' type='button' title='edit'><span class='fa fa-pencil'></span></button>`;
            sresult += `<button class='btn btn-danger _drop' type='button' title='drop'><span class='fa fa-times'></span></button>`;
            sresult += `<button class='btn btn-warning _copy' type='button' title='copy'><span class='fa fa-files-o'></span></button>`;
            sresult += `</span></td>`;
            sresult += `<td class='hide'>${x.idpo}</td>`;
            sresult += `<td class='hide'>${x.idpocliente}</td>`;
            sresult += `<td class='hide'>${x.idpoclienteproducto}</td>`;
            sresult += `<td>${x.po}</td>`;
            sresult += `<td>${x.producto}</td>`;
            sresult += `<td>${x.proveedor}</td>`;
            sresult += `<td>${x.fechafabrica}</td>`;
            sresult += `<td>${x.fechamaximafabrica}</td>`;
            sresult += `<td>${x.fechacliente}</td>`;
            sresult += `<td>${x.tipoprecio}</td>`;
            sresult += `<td>${x.preciofabrica}</td>`;
            sresult += `<td>${x.preciocliente}</td>`;
            sresult += `<td>${x.cantidad}</td>`;
            sresult += `</tr>`;
        });
    }
    _('tblpodetalle').innerHTML = sresult;
    oproducto.accion = 'add';//:accion x defecto
    accion_grilla();
}


//:sam
function accion_grilla() {
    let tbl = _('tblpodetalle'),
        abotonedit = tbl !== null ? _Array(tbl.getElementsByClassName('_edit')) : null,
        abotoncopy = tbl !== null ? _Array(tbl.getElementsByClassName('_copy')) : null,
        abotondrop = tbl !== null ? _Array(tbl.getElementsByClassName('_drop')) : null;
    if (abotonedit !== null) { abotonedit.forEach(x=>x.addEventListener('click', e=> { controlador(e, 'edit'); })); }
    if (abotoncopy !== null) { abotoncopy.forEach(x=>x.addEventListener('click', e=> { controlador(e, 'copy'); })); }
    if (abotondrop !== null) { abotondrop.forEach(x=>x.addEventListener('click', e=> { controlador(e, 'drop'); })); }
}


function controlador(event, accion) {
    let o = event.target,
        tag = o.tagName,
        fila = null,
        opar = {};
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
        default:
            break;
    }
    if (fila !== null) {
        opar = { idpo: `${fila.cells[1].innerHTML}`, idpocliente: `${fila.cells[2].innerHTML}`, idpoclienteproducto: `${fila.cells[3].innerHTML}` };
        evento(opar, accion)
    }
}

function evento(oparametro, accion) {
    let urlaccion = 'PO/POProducto/getData_byPOProducto';
    oproducto.accion = 'add';

    if (accion === 'edit') {
        urlaccion = 'PO/POProducto/getData_forEdit';
        _Get(urlaccion + '?par=' + JSON.stringify(oparametro)).then(function (value) { return value; }, function (reason) { alert('error:', reason); }
            ).then(function (data) {
                oproducto.accion = 'edit';
                mostrarpoproducto(data);
                visualizarbotongrabarbyaccion();
            });
    } else if (accion === 'copy') {
        _Get(urlaccion + '?par=' + JSON.stringify(oparametro)).then(function (value) { return value; }, function (reason) { alert('error:', reason); }
            ).then(function (data) {
                oproducto.accion = 'add';
                mostrarpoproducto(data);
                visualizarbotongrabarbyaccion();
            });
    } else if (accion === 'drop') {
        let mensajealerta = '<strong>are you sure to delete?</strong>';
        _modalConfirm(mensajealerta, function () {
            respuestasieliminarpoclienteproducto(oparametro);
        });
    }

}

// :edit 20171015 editar po
function mostrarpoproducto(orespuesta) {
    //alert('mostrar po-producto: '+rpta);
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;

    if (ores != null) {
        let datapo = JSON.parse(ores.po)[0],
            datapocliente = JSON.parse(ores.pocliente)[0],
            datapoclienteproducto = JSON.parse(ores.poclienteproducto),
            datapoclienteproductodestino = JSON.parse(ores.poclienteproductodestino),
            idcliente = datapo.idcliente, idproveedor = 0,
            idclientetemporada = datapo.idclientetemporada, iddivisioncliente = 0,
            iddivisionasociado = 0, cartonlabel = 0, idtipoprecio, idflete = 0, idformaenvio = 0,
            cantidadrequerida = 0,
            arrayentypaneldata = $("#panelData ._enty"), totalarrayentypaneldata = arrayentypaneldata.length,
            arrayentypanelfechas = $("#panelFechas ._enty"), totalarrayentypanelfechas = arrayentypanelfechas.length,
            arrayentypaneldata2_comemtarios = $("#panelData2 ._enty"), totalarrayentypaneldata2 = arrayentypaneldata2_comemtarios.length,
            tipoinput = '', dataid = '', valordata = '', codigopocliente = '', arrivalpo = '',
            idpocliente = 0, idpoclienteproducto = 0,
            fechadespachofabrica = '', fechadespachocliente = '', fechaentregacliente = '';

        let listapoclienteproducto = datapoclienteproducto;

        let listapoclienteproductodestino = datapoclienteproductodestino;

        //ini
        idproveedor = listapoclienteproducto[0].idproveedor;

        if (idcliente > 0) {
            _('cboClientePo').value = idcliente;
        }

        if (idproveedor > 0) {
            _('cboProveedor').value = idproveedor;
        }

        // datos de pocliente
        arrivalpo = datapocliente.arrivalpo;
        codigopocliente = datapocliente.codigo;
        idpocliente = datapocliente.idpocliente;

        _('hf_IdPoCliente').value = idpocliente;
        $('#grupoFechaArrivalPO .input-group.date').datepicker('update', arrivalpo);
        _('txtPoCliente').value = codigopocliente;

        // input de poclienteproducto
        iddivisioncliente = listapoclienteproducto[0].iddivisioncliente
        iddivisionasociado = listapoclienteproducto[0].iddivisionasociado;
        idtipoprecio = listapoclienteproducto[0].idtipoprecio;
        idflete = listapoclienteproducto[0].idflete;
        idformaenvio = listapoclienteproducto[0].idformaenvio;
        cartonlabel = listapoclienteproducto[0].cartonlabel;
        cantidadrequerida = listapoclienteproducto[0].cantidadrequeridalst;
        idpoclienteproducto = listapoclienteproducto[0].idpoclienteproducto;
        fechadespachofabrica = listapoclienteproducto[0].fechadespachofabrica;
        fechadespachocliente = listapoclienteproducto[0].fechadespachocliente;
        fechaentregacliente = listapoclienteproducto[0].fechaentregacliente;

        _('hf_IdProducto').value = listapoclienteproducto[0].idproducto;
        _('hf_IdPoClienteProducto').value = idpoclienteproducto;

        if (idclientetemporada > 0) {
            _('cboTemporadaCliente').value = idclientetemporada;
        }
        if (iddivisioncliente > 0) {
            _('cboDivision').value = iddivisioncliente;
        }
        if (iddivisionasociado > 0) {
            _('cboDivisionAsociado').value = iddivisionasociado;
        }

        if (cartonlabel == 1) {
            $('#chkCartonLabel').prop('checked', true);
        } else {
            $('#chkCartonLabel').prop('checked', false);
        }

        // para los harcodeados
        _('cboTipoPrecio').value = idtipoprecio;
        _('cboFlete').value = idflete;
        _('cboFormaEnvio').value = idformaenvio;

        _('txtCantidadRequerida').value = cantidadrequerida;
        // automatizando carga de input
        if (totalarrayentypaneldata > 0) {
            for (i = 0; i < totalarrayentypaneldata; i++) {
                tipoinput = arrayentypaneldata[i].getAttribute('type');
                dataid = arrayentypaneldata[i].getAttribute('data-id');
                if (tipoinput == 'text') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                } else if (tipoinput == 'hidden') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                }
            }
        }
        if (totalarrayentypanelfechas > 0) {
            for (i = 0; i < totalarrayentypanelfechas; i++) {
                tipoinput = arrayentypanelfechas[i].getAttribute('type');
                dataid = arrayentypanelfechas[i].getAttribute('data-id');
                if (tipoinput == 'text') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypanelfechas[i].value = valordata;
                    }
                }
            }
        }
        $('#grupoFechaFactory .input-group.date').datepicker('update', fechadespachofabrica);
        $('#grupoFechaCliente1 .input-group.date').datepicker('update', fechadespachocliente);
        $('#grupoFechaCliente2 .input-group.date').datepicker('update', fechaentregacliente);

        // comentarios
        if (totalarrayentypaneldata2 > 0) {
            for (i = 0; i < totalarrayentypaneldata2; i++) {
                tipoinput = arrayentypaneldata2_comemtarios[i].classList.toString();
                dataid = arrayentypaneldata2_comemtarios[i].getAttribute('data-id');
                let indiceclassname = tipoinput.indexOf('_textarea');

                if (indiceclassname >= 0) {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata2_comemtarios[i].value = valordata;
                    }
                }
            }
        }
        // fin

        //ovariables.cadenalistaclientedireccion = ores.clientedireccion; // aqui ya esta asignado
        generartablapoclienteestilodestinofromloadeditar(oproducto.idpoclienteproducto, listapoclienteproductodestino);

        accionesfinalesdellenarinputeditar();
    }
}

function eliminarpoproducto(rpta) {
    //:pendiente
    alert('eliminar po-producto');
}

/* :sam */
function get_arrproductodestino(idtabla, oparameter) {
    let arr = [],
        tbl = document.getElementById(idtabla),
        x = 0, q = (tbl !== null) ? tbl.rows.length : 0,
        row = null;
    if (q > 0) {
        for (x = 0; x < q; x++) {
            row = tbl.rows[x];
            let obj = {
                idpo: oparameter.idpo,
                idpocliente: oparameter.idpocliente,
                idpoclienteproducto: oparameter.idpoclienteproducto,
                idpoclienteproductodestino: 0, //row.cells[0].children[0].getAttribute('data-idpoclienteestilodestino'),
                idclientedireccion: row.cells[1].children[1].value,
                cantidadrequerida: row.cells[2].children[0].value
            }
            arr[x] = obj;
        }
    }
    return arr;
}

function generartablapoclienteestilodestinofromloadeditar(idpoclienteproducto, listapoclienteproductodestino) {
    let cadenahtml = '', totalfilas = listapoclienteproductodestino.length, i = 0;

    if (totalfilas > 0) {
        $("#tbodyClienteDireccionDestino").html('');
        for (i = 0; i < totalfilas; i++) {
            cadenahtml = '';
            cadenahtml += `<tr>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <a id="aEliminarClienteDireccionDestino" name="aEliminarClienteDireccionDestino" data-idpoclienteestilodestino = ' ${listapoclienteproductodestino[i].idpoclienteestilodestino}' class="fa fa-remove punteromouse btn btn-danger btn-sm" title="delete"></a>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <div style="display: none;">`;
            cadenahtml += `             <input id="txtIdPoClienteEstiloDestinoGrid" value=' ${listapoclienteproductodestino[i].idpoclienteestilodestino}' />`;
            cadenahtml += `         </div>`;
            cadenahtml += `         <select class="form-control _combodireccion" id="cboClienteDireccionDestino" name="cboClienteDireccionDestino">`;
            cadenahtml += `         </select>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <input class="form-control text-center _inputtrcantidadrequerida" name="txtcantidadrequeridaclientedireccion" value='${listapoclienteproductodestino[i].cantidadrequerida}' />`; // onkeypress="return pojs.digitimosenteros(event, this)"
            cadenahtml += '     </td>';

            cadenahtml += `</tr>`;

            $("#tbodyClienteDireccionDestino").append(cadenahtml);
            cargarcomboclientedirecciondestino(i, listapoclienteproductodestino[i].idclientedireccion);
            crearhandlerparagridclientedestino();
        }
        autonumericcantidadrequeridatabla(); // :??
    }

}


function fn_evento_q(idtabla) {
    var tbl = _(idtabla),
         atxt = _Array(tbl.getElementsByClassName('_inputtrcantidadrequerida'));

    atxt.forEach(function (txt) {
        txt.addEventListener("keypress", function (event) {
            let keyCode = (event.keyCode ? event.keyCode : event.which), tbl = _('tbodyClienteDireccionDestino'),
                atxt = _Array(tbl.getElementsByClassName('_inputtrcantidadrequerida')), totalfilas = tbl.rows.length,
                miscope = event, filaactual = miscope.currentTarget.parentNode.parentNode.rowindex, indexactual = filaactual - 1;
            if (keyCode == 13) {
                let atxt2 = _Array(tbl.getElementsByClassName('_inputtrcantidadrequerida'));
                if (filaactual < totalfilas) {
                    indexactual++;
                    atxt2.forEach(function (txt, index) {
                        if (indexactual == index) {
                            txt.focus();
                        }
                    });

                }
            }
        })
    });

}




function cargarcomboclientedirecciondestino(fila, idclientedireccion) {
    "use strict";

    var tablaclientedireccion = $("#tbodyClienteDireccionDestino"), totalfilas = $("#tbodyClienteDireccionDestino > tr").length,
        i = 0, j = 0, list, comboclientedireccion, filasclientedireccion = [], listacadenaclientedireccion = ovariables.cadenalistaclientedireccion;

    if (listacadenaclientedireccion != "") {
        filasclientedireccion = listacadenaclientedireccion.split('^');
    }

    list = filasclientedireccion; //direccion;

    for (i = 0; i < totalfilas; i++) {
        if (fila == i) {
            comboclientedireccion = $(tablaclientedireccion[0].rows[i].cells[1].children[1]);

            var len = list.length;
            var optionhtml = "";
            if (len > 0) {
                //if (selectoption) {
                optionhtml = "<option>select</option>";
                //}
                for (j = 0; j < len; j++) {
                    var rowobj = list[j].split('¬');// indice 0 = idclientedireccion; 1 = direccioncompleta
                    if (idclientedireccion != undefined) {
                        if (rowobj[0] == idclientedireccion) {
                            // opcion seleccionado
                            optionhtml += "<option value='" + rowobj[0] + "' selected>" + rowobj[1] + "</option>";
                        } else {
                            optionhtml += "<option value='" + rowobj[0] + "'>" + rowobj[1] + "</option>";
                        }
                    } else {
                        optionhtml += "<option value='" + rowobj[0] + "'>" + rowobj[1] + "</option>";
                    }
                }
                if (optionhtml != "") {
                    comboclientedireccion.empty();
                    comboclientedireccion.append(optionhtml);
                }
            } else {
                optionhtml = "<option>select</option>";
                comboclientedireccion.empty();
                comboclientedireccion.append(optionhtml);
            }
        }
    }
    i = null;
    j = null;
    list = null;
}

function crearhandlerparagridclientedestino() {
    crearhandlereliminarclientedestino();
    fn_evento_q('tbodyClienteDireccionDestino');
}

function crearhandlereliminarclientedestino() {
    $('#tblClienteDireccionDestino').off('click');
    $('#tblClienteDireccionDestino').on('click', '#aEliminarClienteDireccionDestino', function (event) {
        var idpoclienteestilodestino = $(event)[0].currentTarget.getAttribute("data-idpoclienteestilodestino");

        $(this).closest('tr').remove();
    });
}

function updatepo() {
    let req = _required({ id: 'poproducto', clase: '_enty' });
    if (req) {
        validacionfechas = validarantesgrabar();
        if (validacionfechas == false) {
            return false;
        }
        var idpo = _('hf_IdPoCliente').value, idpocliente = _('hf_IdPoCliente').value,
            idpoclienteproducto = _('hf_IdPoClienteProducto').value,
            po = JSON.stringify(_getParameter({ id: 'panelEncabezado', clase: '_enty' })),
            pocliente = JSON.stringify({
                idpocliente: _('hf_IdPoCliente').value,
                codigo: _("txtPoCliente").value,
                arrivalpo: _convertDate_ANSI(_("txtArrivalPO").value),
                codigolst: "",
                monto: 0,
                costo: 0,
                idtipopo: _("cboTipoPo").value,
                estadopo: 0,
                cantidadrequerida: 0,
                saldocantidadrequerida: 0
            }),
            poclienteproducto = JSON.stringify(get_poclienteproducto()),
            poclienteproductodestino = JSON.stringify(get_arrproductodestino('tbodyClienteDireccionDestino', { idpo: idpo, idpocliente: idpocliente, idpoclienteproducto: idpoclienteproducto }));

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);

        Post('PO/POProducto/save_PoProudcto_update', form, function (rpt) {
            let orpta = (rpt !== null && rpt !== '') ? JSON.parse(rpt) : null,
                    data = orpta !== null && orpta.data !== null ? orpta.data : '',
                    adata = [];
            if (data !== '') {
                oproducto.accion = 'add';
                ejecutardespuesgrabar();
                adata = JSON.parse(data);
                loadgrilla(adata);
            }
            _mensaje(orpta);
        });
    }
}

function grabarpo_add() {
    let req = _required({ id: 'poproducto', clase: '_enty' }), validacionfechas = true;
    if (req) {
        validacionfechas = validarantesgrabar();
        if (validacionfechas == false) {
            return false;
        }
        var idpo = _('hf_IdPoCliente').value, idpocliente = _('hf_IdPoCliente').value,
                idpoclienteproducto = _('hf_IdPoClienteProducto').value,
                po = JSON.stringify(_getParameter({
                    id: 'panelEncabezado', clase: '_enty'
                })),
                pocliente = JSON.stringify({
                    idpocliente: _('hf_IdPoCliente').value,
                    codigo: _("txtPoCliente").value,
                    arrivalpo: _convertDate_ANSI(_("txtArrivalPO").value),
                    codigolst: "",
                    monto: 0,
                    costo: 0,
                    idtipopo: _("cboTipoPo").value,
                    estadopo: 0,
                    cantidadrequerida: 0,
                    saldocantidadrequerida: 0
                }),
                poclienteproducto = JSON.stringify(get_poclienteproducto()),
                poclienteproductodestino = JSON.stringify(get_arrproductodestino('tbodyClienteDireccionDestino', { idpo: idpo, idpocliente: idpocliente, idpoclienteproducto: idpoclienteproducto }));

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);

        Post('PO/POProducto/save_PoProducto_Add', form, function (rpt) {
            let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
                data = orpta !== null && orpta.data !== null ? orpta.data : '',
                adata = [];
            if (data !== '') {
                oproducto.accion = 'add';
                ejecutardespuesgrabar();
                adata = JSON.parse(data);
                loadgrilla(adata);
            }
            _mensaje(orpta);
        });
    }
}

/* :sam */
function grabarnuevopo() {
    let req = _required({ id: 'poproducto', clase: '_enty' }), validacionfechas = true;
    if (req) {
        validacionfechas = validarantesgrabar();
        if (validacionfechas == false) {
            return false;
        }

        var po = JSON.stringify(_getParameter({ id: 'panelEncabezado', clase: '_enty' })),
            pocliente = JSON.stringify({
                idpocliente: _('hf_IdPoCliente').value,
                codigo: _("txtPoCliente").value,
                arrivalpo: _convertDate_ANSI(_("txtArrivalPO").value),
                codigolst: "",
                monto: 0,
                costo: 0,
                idtipopo: _("cboTipoPo").value,
                estadopo: 0,
                cantidadrequerida: 0,
                saldocantidadrequerida: 0
            });
        poclienteproducto = JSON.stringify(get_poclienteproducto()),
        poclienteproductodestino = JSON.stringify(get_arrproductodestino('tbodyClienteDireccionDestino', { idpo: '0', idpocliente: '0', idpoclienteproducto: '0' }));

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);

        Post('PO/POProducto/Save_POProducto_new', form, function (rpt) {

            let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
                data = orpta !== null && orpta.data !== null ? orpta.data : '',
                adata = [];
            if (data !== '') {
                oproducto.accion = 'add';
                adata = JSON.parse(data);
                ejecutardespuesgrabar();
                _('hf_IdPo').value = orpta.id;
                loadgrilla(adata);
            }
            _mensaje(orpta);

        });
    }
}


function ejecutardespuesgrabar() {
    visualizarbotongrabarbyaccion();
    limpiarhidden_buy();
    habilitardeshabilitarinputbyaccion();
}

function ejecutardespueseliminar() {
    visualizarbotongrabarbyaccion();
    limpiarhidden_buy();
    habilitardeshabilitarinputbyaccion();
}

function limpiarhidden_buy() {
    _('hf_IdPo_Buy').value = 0;	//:add :16
    _('hf_IdPoCliente_Buy').value = 0;
    _('hf_IdPoClienteProducto_Buy').value = 0;
    _('hf_IdProducto_Buy').value = 0;
    _('hf_CodigoPoCliente_Buy').value = ' ';
    _('hf_NobreProducto_Buy').value = ' ';
}


function visualizarbotongrabarbyaccion() {
    // :accion
    switch (oproducto.accion) {
        case 'new':
            _('btnAddPo').classList.remove('hidden');
            _('btnUpdataPo').classList.add('hidden');
            _('btnAdd').classList.add('hidden');
            _('btnCancelarUpdate').classList.add('hidden');
            _('btnConsumirBuy').classList.remove('hidden');
            break;
        case 'edit':
            _('btnAddPo').classList.add('hidden');
            _('btnUpdataPo').classList.remove('hidden');
            _('btnAdd').classList.add('hidden');
            _('btnCancelarUpdate').classList.remove('hidden');
            _('btnConsumirBuy').classList.add('hidden');
            break;
        case 'add':
            _('btnAddPo').classList.add('hidden');
            _('btnUpdataPo').classList.add('hidden');
            _('btnAdd').classList.remove('hidden');
            _('btnCancelarUpdate').classList.add('hidden');
            _('btnConsumirBuy').classList.remove('hidden');
            break;
        default:

            break;
    }
}

// :modal consumir buy
function ejecutarmodalconsumirbuy(event) {
    let modal = $(this);
    modal.find(".modal-title").text("Buy");
    Get('PO/POProducto/_ConsumirBuy', mostrar_ventana_consumirbuy);
}

function mostrar_ventana_consumirbuy(vistahtml) {
    var html = vistahtml;
    $("#modal_bodyVentanaGeneral2").html(html);
    popconsumirbuy();
}

function popconsumirbuy() {
    _('btnAceptarBuyBuscar').addEventListener('click', function () { aceptarbuyconsumir(); });
    getlistabuyporconsumir();
}

function getlistabuyporconsumir() {
    let parametro = JSON.stringify({ codigopocliente: ' ', idcliente: _('cboClientePo').value });
    Get('PO/POProducto/getData_ConsumirBuy?par=' + parametro, mostrardatabuyconsumir);
}

function aceptarbuyconsumir() {
    let tbl = _('tbodygridbuscarbuy'),
        totalfilas = tbl.rows.length,
        i = 0,
        seleccionado = false,
        idpo_buy = 0, idpocliente_buy = 0, idpoclienteproducto_buy = 0, idproducto_buy = 0, codigopocliente_buy = '', nombreproducto_buy = '', txt = null, cantidad_buy = 0, row = null, par = '',
        estadocerrar_buy = 0, valorchkbox = false;

    for (i = 0; i < totalfilas; i++) {
        seleccionado = tbl.rows[i].cells[0].children[0].checked;
        if (seleccionado) { row = tbl.rows[i]; break;}
    }
    if (row !== null) {
        par = row.getAttribute('data-par');
        txt = row.cells[5].childNodes[0];
        valorchkbox = row.cells[6].children[0].checked;
        cantidad_buy = txt.value !== '' ? parseFloat(txt.value) : 0;
        if (par !== null && cantidad_buy > 0) {
            idpo_buy = _par(par, 'idpo');
            idpocliente_buy = _par(par, 'idpocliente');
            idpoclienteproducto_buy = _par(par, 'idpoclienteproducto');
            idproducto_buy = _par(par, 'idproducto');
            codigopocliente_buy = _par(par, 'codigopocliente');
            nombreproducto_buy = _par(par, 'nombreproducto');
            estadocerrar_buy = valorchkbox ? 1 : 0;
            ejecutaraceptarmodalconsumir(idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidad_buy, estadocerrar_buy);
        } else {alert('Quantity: Required');}
    }
}

function ejecutaraceptarmodalconsumir(idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidad_buy, estadocerrar_buy) {
    let urlaccion = 'PO/POProducto/getData_forConsumirBuy', parametro = { idpo: idpo_buy, idpocliente: idpocliente_buy, idpoclienteproducto: idpoclienteproducto_buy };
    _Get(urlaccion + '?par=' + JSON.stringify(parametro)).then(
        function (value) { return value; },
        function (reason) { alert('error:', reason); }
    ).then(function (data) {
        mostrarpobuyforconsumir(data, idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy,cantidad_buy, estadocerrar_buy);
        $("#modal_ventanaGeneral2").modal("hide");
    });
}

function mostrardatabuyconsumir(orespuesta) {
    let data = $.trim(orespuesta).length > 0 ? JSON.parse(orespuesta) : null;
    mostrar_grilla(data);
}


function handlertrbuscarproducto(idtbody) {
    let tabla = $("#" + idtbody)[0], totalfilas = tabla.rows.length, i = 0;
    if (totalfilas > 0) {

        for (i = 0; i < totalfilas; i++) {
            tabla.rows[i].addEventListener('click', function (e) {
                let tabla = $("#" + idtbody)[0], totalfilas = tabla.rows.length, i = 0;
                for (i = 0; i < totalfilas; i++) {
                    tabla.rows[i].bgColor = "white";
                }

                let filatr = $(this).closest('tr')[0];
                filatr.children[0].children[0].checked = true;
                filatr.bgColor = "#ccd1d9"; //#a0d468
            }, false);

        }
    }
}


function mostrarpobuyforconsumir(orespuesta, idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidad_buy, estadocerrar_buy) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;

    if (ores != null) {
        let datapo = JSON.parse(ores.po)[0],
            datapocliente = JSON.parse(ores.pocliente)[0],
            datapoclienteproducto = JSON.parse(ores.poclienteproducto),
            datapoclienteproductodestino = JSON.parse(ores.poclienteproductodestino),
            idcliente = datapo.idcliente, idproveedor = 0,
            idclientetemporada = datapo.idclientetemporada, iddivisioncliente = 0,
            iddivisionasociado = 0, cartonlabel = 0, idtipoprecio, idflete = 0, idformaenvio = 0,
            cantidadrequerida = 0,
            arrayentypaneldata = $("#panelData ._enty"), totalarrayentypaneldata = arrayentypaneldata.length,
            arrayentypanelfechas = $("#panelFechas ._enty"), totalarrayentypanelfechas = arrayentypanelfechas.length,
            arrayentypaneldata2_comemtarios = $("#panelData2 ._enty"), totalarrayentypaneldata2 = arrayentypaneldata2_comemtarios.length,
            tipoinput = '', dataid = '', valordata = '', codigopocliente = '', arrivalpo = '',
            idpocliente = 0, idpoclienteproducto = 0,
            fechadespachofabrica = '', fechadespachocliente = '', fechaentregacliente = '';

        if (oproducto.accion == 'new') {
            _('panelDetalle').classList.remove('hide');
            _('panelFechas').classList.remove('hide');
            _('panelDestinos').classList.remove('hide');
            _('panelResult').classList.remove('hide');
        } else if (oproducto.accion == 'add') {

        }

        let listapoclienteproducto = datapoclienteproducto;

        let listapoclienteproductodestino = datapoclienteproductodestino;

        _('hf_IdPo_Buy').value = datapo.idpo;
        _('hf_IdPoCliente_Buy').value = datapocliente.idpocliente;
        _('hf_IdPoClienteProducto_Buy').value = listapoclienteproducto[0].idpoclienteproducto;
        _('hf_IdProducto_Buy').value = listapoclienteproducto[0].idproducto;
        _('hf_CodigoPoCliente_Buy').value = datapocliente.codigo;
        _('hf_NobreProducto_Buy').value = listapoclienteproducto[0].nombreproducto;
        _('hf_estadocerrar_buy').value = estadocerrar_buy;
        
        //ini
        idproveedor = listapoclienteproducto[0].idproveedor;

        if (idcliente > 0) {
            _('cboClientePo').value = idcliente;
        }

        if (idproveedor > 0) {
            _('cboProveedor').value = idproveedor;
        }

        // datos de pocliente
        arrivalpo = datapocliente.arrivalpo;
        codigopocliente = datapocliente.codigo;
        idpocliente = datapocliente.idpocliente;

        _('hf_IdPoCliente').value = idpocliente;
        
        $('#grupoFechaArrivalPO .input-group.date').datepicker('update', arrivalpo);
        _('txtPoCliente').value = codigopocliente;

        // input de poclienteproducto
        iddivisioncliente = listapoclienteproducto[0].iddivisioncliente
        iddivisionasociado = listapoclienteproducto[0].iddivisionasociado;
        idtipoprecio = listapoclienteproducto[0].idtipoprecio;
        idflete = listapoclienteproducto[0].idflete;
        idformaenvio = listapoclienteproducto[0].idformaenvio;
        cartonlabel = listapoclienteproducto[0].cartonlabel;
        cantidadrequerida = listapoclienteproducto[0].cantidadrequerida;
        idpoclienteproducto = listapoclienteproducto[0].idpoclienteproducto;
        fechadespachofabrica = listapoclienteproducto[0].fechadespachofabrica;
        fechadespachocliente = listapoclienteproducto[0].fechadespachocliente;
        fechaentregacliente = listapoclienteproducto[0].fechaentregacliente;

        _('hf_IdProducto').value = listapoclienteproducto[0].idproducto;
        _('hf_IdPoClienteProducto').value = 0;

        if (idclientetemporada > 0) {
            _('cboTemporadaCliente').value = idclientetemporada;
        }
        if (iddivisioncliente > 0) {
            _('cboDivision').value = iddivisioncliente;
        }
        if (iddivisionasociado > 0) {
            _('cboDivisionAsociado').value = iddivisionasociado;
        }

        if (cartonlabel == 1) {
            $('#chkCartonLabel').prop('checked', true);
        } else {
            $('#chkCartonLabel').prop('checked', false);
        }

        // para los harcodeados
        _('cboTipoPrecio').value = idtipoprecio;
        _('cboFlete').value = idflete;
        _('cboFormaEnvio').value = idformaenvio;

        //_('txtCantidadRequerida').value = cantidadrequerida;
        _('txtCantidadRequerida').value = cantidad_buy;
        // automatizando carga de input
        if (totalarrayentypaneldata > 0) {
            for (i = 0; i < totalarrayentypaneldata; i++) {
                tipoinput = arrayentypaneldata[i].getAttribute('type');
                dataid = arrayentypaneldata[i].getAttribute('data-id');
                if (tipoinput == 'text') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                } else if (tipoinput == 'hidden') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata[i].value = valordata;
                    }
                }
            }
        }
        if (totalarrayentypanelfechas > 0) {
            for (i = 0; i < totalarrayentypanelfechas; i++) {
                tipoinput = arrayentypanelfechas[i].getAttribute('type');
                dataid = arrayentypanelfechas[i].getAttribute('data-id');
                if (tipoinput == 'text') {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypanelfechas[i].value = valordata;
                    }
                }
            }
        }
        $('#grupoFechaFactory .input-group.date').datepicker('update', fechadespachofabrica);
        $('#grupoFechaCliente1 .input-group.date').datepicker('update', fechadespachocliente);
        $('#grupoFechaCliente2 .input-group.date').datepicker('update', fechaentregacliente);

        // comentarios
        if (totalarrayentypaneldata2 > 0) {
            for (i = 0; i < totalarrayentypaneldata2; i++) {
                tipoinput = arrayentypaneldata2_comemtarios[i].classList.toString();
                dataid = arrayentypaneldata2_comemtarios[i].getAttribute('data-id');
                let indiceclassname = tipoinput.indexOf('_textarea');

                if (indiceclassname >= 0) {
                    valordata = listapoclienteproducto[0][dataid];
                    if (valordata != undefined) {
                        arrayentypaneldata2_comemtarios[i].value = valordata;
                    }
                }
            }
        }
        // fin

        //ovariables.cadenalistaclientedireccion = ores.clientedireccion; // aqui ya esta asignado
        generartablapoclienteestilodestinofromloadeditar(oproducto.idpoclienteproducto, listapoclienteproductodestino);
    }
}


function fn_activar_botones_next(accion) {
    let anext = _Array(document.getElementsByClassName('_next'));
    if (!accion) { anext.forEach(x=>x.classList.add('hide')); }
    else { anext.forEach(x=>x.classList.remove('hide')); }
}


function carga_nuevapo() {
    let urlaccion = 'PO/POProducto/addPOProducto', urljs = 'PO/POProducto/addPOProducto';
    _Go_Url(urlaccion, urljs, 'accion:new');
}

function controlador_buscar(tipo) {
    let estado = false;
    switch (tipo) {
        case 'buscar_buy':
            estado = fn_validar_busquedabuy();
            break;
        default:
            break;
    }
    return estado;
}

function fn_validar_busquedabuy() {
    let cliente = _('cboClientePo'), padrenivel = cliente.parentNode.parentNode.parentNode;
    padrenivel.classList.remove('has-error');
    if (cliente.value === '') { padrenivel.classList.add('has-error'); }
    return cliente.value.length > 0;
}




/*grilla buy*/
function mostrar_grilla(oresult) {
    oUtil.adata = oresult;
    oUtil.adataresult = oUtil.adata;
    listar_grilla(oUtil.adata);
    filter_header();
    select_row();

}
function listar_grilla(adata) {
    let rsta = '';
    if (adata != null && adata.length > 0) {
        let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
        let fin = inicio + oUtil.registrospagina, i = 0, x = adata.length;

        for (i = inicio; i < fin; i++) {
            if (i < x) {
                rsta += `<tr  data-par='idpo:${adata[i].idpo},idpocliente:${adata[i].idpocliente},idpoclienteproducto:${adata[i].idpoclienteproducto},idproducto:${adata[i].idproducto},codigopocliente:${adata[i].codigopocliente},nombreproducto:${adata[i].nombreproducto}'>`;
                rsta += `<td class='hide'><input type='checkbox'> </td>`;
                rsta += `<td class='align-center'>${adata[i].nombrecliente}</td>`;
                rsta += `<td class='align-center'>${adata[i].codigopocliente}</td>`;
                rsta += `<td class='align-center'>${adata[i].nombreproducto}</td>`;
                rsta += `<td class='align-center'>${adata[i].cantidadrequerida}</td>`;
                rsta += `<td class='align-center'><input type='text' class='form-control _txt' readonly data-value='${adata[i].saldocantidadrequerida}' value='${adata[i].saldocantidadrequerida}'/></td>`;
                rsta += `<td class='text-center' style='vertical-align: middle;'>`;
                rsta += `   <input type='checkbox'>`;
                rsta += `</td>`;
                rsta += `</tr>`;
            } else {
                break;
            }
        }
    }
    _('tbodygridbuscarbuy').innerHTML = rsta;
    _('tfoot_buy').innerHTML = page_result(adata);
}

function filter_header() {
    var name_filter = "filter";
    var filters = document.getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type == "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil.adataresult = event_header_filter(name_filter);
                listar_grilla(oUtil.adataresult); //:desactivate                
            }
        }
    }
}

function event_header_filter(fields_input) {
    var adataResult = [], adata = oUtil.adata;
    if (adata.length > 0) {
        var fields = document.getElementsByClassName(fields_input);
        if (fields != null && fields.length > 0) {
            var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
            var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
            var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
            var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

            acampos_name = _oreflector.getProperties(adata[0]);

            for (i = 0; i < nreg; i++) {
                exito = true;
                for (x = 0; x < nfields; x++) {
                    ofield = fields[x];
                    value = ofield.value.toLowerCase();
                    field = ofield.getAttribute("data-field");

                    if (ofield.type == "text") {
                        //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);

                        if (exito) {
                            if (value !== '') {
                                valor = adata[i][field];
                                _y = adata[i][field].toLowerCase().indexOf(value);
                                exito = (y > -1);
                            }
                        }
                        exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
                    }
                    else {
                        exito = exito && (value == "" || value == adata[i][field]);
                    }
                    if (!exito) break;
                }
                if (exito) {
                    acampos_value = _oreflector.getValues(adata[i]);
                    adataResult[c] = _setfield(acampos_name, acampos_value);
                    c++;
                }
            }
        }
    }
    return adataResult;
}

function page_result(padata) {
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil.registrospagina);
        if (nregistros % oUtil.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil.indiceactualbloque > 0) {
            contenido += "<li> <a onclick='paginar(-1);' > << </a></li>";
            contenido += "<li> <a onclick='paginar(-2);' > < </a></li>";
        }
        var inicio = oUtil.indiceactualbloque * oUtil.paginasbloques;
        var fin = inicio + oUtil.paginasbloques;
        for (var i = inicio; i < fin; i++) {
            if (i <= indiceultimapagina) {
                contenido += "<li>";
                contenido += "<a onclick='paginar(";
                contenido += i.toString();
                contenido += ");'>";
                contenido += (i + 1).toString();
                contenido += "</a>";
                contenido += "</li>";
            }
            else break;
        }
        if (oUtil.indiceactualbloque < indiceultimobloque) {
            contenido += "<li> <a onclick='paginar(-3);' > > </a></li>";
            contenido += "<li> <a onclick='paginar(-4);' > >> </a></li>";
        }
    }
    var qcell = document.getElementById(oUtil.idtable).rows[0].cells.length.toString();
    var foot = "<tr><td id='tdpie' style='text-align:center' colspan='";
    foot += qcell;
    foot += "'>";
    foot += contenido;
    foot += "</td></tr>";
    return foot;
}
function paginar(indice) {
    if (indice > -1) {
        oUtil.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil.indiceactualbloque = 0;
                oUtil.indiceactualpagina = 0;
                break;
            case -2:
                oUtil.indiceactualbloque--;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -3:
                oUtil.indiceactualbloque++;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil.adataresult.length;
                var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil.indiceactualbloque = indiceultimobloque;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
        }
    }
}


function select_row() {
    let tbl = _('tbodygridbuscarbuy'),
        rows = _Array(tbl.rows),
        txts = _Array(tbl.getElementsByClassName('_txt'));
    if (rows !== null && rows.length > 0) { rows.forEach(x=> x.addEventListener("click", e=> { fn_row_buy(e); })); }
    txts.forEach(y=>y.addEventListener("dblclick", e=> { fn_txt_buy(e); }));    
}

function fn_txt_buy(_txt) {
    let row = _txt.target.parentNode.parentNode,
       chk = row.cells[0].childNodes[0],
       tbl = _('tbodygridbuscarbuy'),
       rows = _Array(tbl.rows),
       activo = chk.checked ? false : true,
       txt = _txt.target,
       valorQ = txt.value;

    rows.forEach(x=> {
        x.classList.remove('rowselect');
        x.cells[0].childNodes[0].checked = false;
        let otxt = x.cells[5].childNodes[0];
        otxt.value = otxt.getAttribute('data-value');
        otxt.setAttribute('readonly', 'readonly');
    });

    if (activo) {
        row.classList.add('rowselect');
        chk.checked = true;
        txt.removeAttribute('readonly');
        txt.focus();
        txt.setSelectionRange(txt.value.length, txt.value.length);
    }
}


// :samuel
function fn_row_buy(_row) {        
    let celda = _row.target.toString().indexOf('Input') > 0;
    if (celda > 0) return false;

    let onodo = _row.target.parentNode,        
       esrow = onodo.toString().indexOf('Row') > 0,
       row = esrow ? onodo : onodo.parentNode,
       chk = row.cells[0].childNodes[0],
       tbl = _('tbodygridbuscarbuy'),
       rows = _Array(tbl.rows),
       activo = chk.checked ? false : true,
       txt = row.cells[5].childNodes[0],
       valorQ = txt.value;
       
    rows.forEach(x=> {
        x.classList.remove('rowselect');
        x.cells[0].childNodes[0].checked = false;
        let otxt = x.cells[5].childNodes[0];
        otxt.value = otxt.getAttribute('data-value');
        otxt.setAttribute('readonly', 'readonly');
        
    });

    if (activo) {
        row.classList.add('rowselect');
        chk.checked = true;
        txt.removeAttribute('readonly');
        txt.focus();       
        txt.setSelectionRange(txt.value.length, txt.value.length);
        
    }
}
function accionesfinalesdellenarinputeditar() {
    habilitardeshabilitarinputbyaccion();
}

function habilitardeshabilitarinputbyaccion() {
    switch (oproducto.accion) {
        case 'new':
            $("#txtPoCliente").prop("disabled", false);
            break;
        case 'edit':
            $("#txtPoCliente").prop("disabled", true);
            break;
        case 'add':
            $("#txtPoCliente").prop("disabled", false);
            break;
        default:
    }
}

function respuestasicambiarcliente() {
    // limpiar destinos
    $('#modalConfirm').modal('hide');
    carga_nuevapo();
}

function respuestanocambiarcliente(idcliente, combo) {
    combo.value = idcliente;
    $('#modalConfirm').modal('hide');
}

function validarantesgrabar() {
    let fechafabrica = _convertDate_ANSI(_('txtFechaDespachoFabrica').value), fechaclientedelivery = _convertDate_ANSI(_('txtFechaDespachoCliente').value), fechaclientewhs = _convertDate_ANSI(_('txtFechaEntregaCliente').value),
        valid = true, cadenamensaje = '', objmensaje = { titulo: 'mensaje', mensaje: 'no se pudo registrar', estado: 'error' }, totalfilasdestinos = _('tbodyClienteDireccionDestino').rows.length,
        tabla = _('tbodyClienteDireccionDestino'), totalcantidadrequerida = 0, cantidadrequerida = parseFloat(_('txtCantidadRequerida').value).toFixed(2),
        existedestinosseleccionados = true, requiredcantidadrequeridaddestinos = false,
        fechaactual = new Date(), fechaatras = fechaactual.addDays(-15),
        anio = fechaatras.getFullYear(), mes = fechaatras.getMonth(), dia = fechaatras.getDate(), fechaatras2 = anio.toString() + ('0' + (mes + 1).toString()).slice(-2) + ('0' + dia.toString()).slice(-2);  //dia = fechaactual.getDate() - 16

    if (fechafabrica < fechaatras2) {
        cadenamensaje += '- The factory delivery date exceeds the limit date of 15 days ago. </br>';
        _('grupoFechaFactory').classList.add('has-error');
    }

    if (fechafabrica >= fechaclientedelivery) {
        cadenamensaje += '- the factory delivery date must be less than the client delivery date. </br>';
        _('grupoFechaFactory').classList.add('has-error');
    }
    if (fechaclientedelivery > fechaclientewhs) {
        cadenamensaje += '- the client delivery date must be less than or equal to the client in whs date. </br>'
        _('grupoFechaCliente1').classList.add('has-error');
    }

    // validacion cantidadrequerida
    if (totalfilasdestinos > 0) {
        for (let i = 0; i < totalfilasdestinos; i++) {
            let valorcantidad = tabla.rows[i].cells[2].children[0].value, indexSelectCombo = $(tabla.rows[i].cells[1].children[1])[0].options.selectedIndex;

            if (indexSelectCombo <= 0) {
                cadenamensaje += '- in row ' + (parseInt(i) + 1) + ', the destination is missing </br>';
                existedestinosseleccionados = false;
            }

            if ($.trim(valorcantidad) == '' || valorcantidad == 0) {
                valorcantidad = 0;
                requiredcantidadrequeridaddestinos = true;
                cadenamensaje += "- In row " + (parseInt(i) + 1).toString() + " of destination, the quantity must be entered. <br/>";
            }
            totalcantidadrequerida = parseFloat(totalcantidadrequerida) + parseFloat(valorcantidad);
        }

        totalcantidadrequerida = parseFloat(totalcantidadrequerida).toFixed(2);
        if (cantidadrequerida != totalcantidadrequerida) {
            cadenamensaje += '- the quantity required must be equal to the total quantity of destinations.</br>';
            _('divCantidadRequerida').classList.add('has-error');
        }
    } else {
        cadenamensaje += '- enter at least one destination. </br>';
        existedestinosseleccionados = false;
    }

    if (existedestinosseleccionados) {
        // validar destinos repetidos
        let mensajeduplicados = validarDuplicadosDireccionDestino();
        if (mensajeduplicados != "") {
            cadenamensaje += mensajeduplicados;
        }
    }

    if (cadenamensaje != '') {
        valid = false;
        objmensaje.mensaje = cadenamensaje;
        _mensaje(objmensaje);
    }

    return valid;
}

function cancelarupdate() {
    oproducto.accion = 'add';
    visualizarbotongrabarbyaccion();
    habilitardeshabilitarinputbyaccion();
}

function autonumericcantidadrequeridatabla() {
    let tabla = _('tbodyClienteDireccionDestino'), arrayinput = _Array(tabla.getElementsByClassName('_inputtrcantidadrequerida'));
    arrayinput.forEach(function (txt, index) {
        $(txt).autoNumeric('init');
    });
}

function limpiartabladestinos() {
    _('tbodyClienteDireccionDestino').innerHTML = '';
}

function respuestasieliminarpoclienteproducto(oparametro) {
    urlaccion = 'PO/POProducto/eliminarPoClienteProductoById';
    let form = new FormData();
    form.append("par", JSON.stringify(oparametro));

    Post(urlaccion, form, function (rpt) {
        let orpta = (rpt != null && rpt != '') ? JSON.parse(rpt) : null,
            data = (orpta !== null && orpta.data !== null) ? orpta.data : '', adata = [];
        if (data != '') {
            if (oproducto.accion == 'edit') {
                oproducto.accion = 'add';
            }
            ejecutardespueseliminar();
            adata = JSON.parse(data);
            loadgrilla(adata);
            $("#modalConfirm").modal('hide');
            _mensaje(orpta);
        }
    });
}


//methods update
function controlador_update(event) {
    let obj = event.target,
        par = obj.getAttribute("data-method") !== null ? obj.getAttribute("data-method")
            : (obj.parentNode.getAttribute("data-method") !== null ? obj.parentNode.getAttribute("data-method") : null);
    if (par !== null) {
        if (_('cboClientePo').selectedIndex > 0) {
            let opar = { method: _par(par, 'name'), id: _par(par, 'id'), idcliente: _('cboClientePo').value },
            frm = _setFormData('par', JSON.stringify(opar));
            Post('PO/POProducto/getControl', frm, cargarControl);
        } else {
            _mensaje({ estado: 'error', mensaje: 'Client: Required' });
        }
    }
}

function cargarControl(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores !== null && ores.data!=='') {
        _(ores.id).innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.data);
    }
}

function ejecutarrefreshdireccion() {
    if (_('cboClientePo').selectedIndex > 0) {
        let datametodo = 'name:clientedireccion,id:cboClientePo', opar = { method: _par(datametodo, 'name'), id: _par(datametodo, 'id'), idcliente: _('cboClientePo').value },
            frm = _setFormData('par', JSON.stringify(opar));
        Post('PO/POProducto/getControl', frm, actualizardireccion);
    }
}

function actualizardireccion(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores !== null && ores.data !== '') {
        ovariables.cadenalistaclientedireccion = ores.data;
        //_(ores.id).innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.data);
        let elementos = document.getElementsByClassName('_combodireccion'), arrcombo = _Array(elementos),
            totallista = arrcombo.length;
        for (let i = 0; i < totallista; i++) {
            let indexcombo = arrcombo[i].options.selectedIndex, valorcombo = arrcombo[i].options[indexcombo].value;
            cargarcomboclientedirecciondestino(i, valorcombo);
        }
    }
}

function validarDuplicadosDireccionDestino() {
    "use strict";
        
    var tabla = $("#tbodyClienteDireccionDestino"), totalFilas = $("#tbodyClienteDireccionDestino > tr").length, i = 0,
        valorIdDireccion = 0, descripcionDireccion = '', listaDireccionDestino = [], dataDireccionDestino = {}, listaDireccionDestinoFiltrado = [],
        totalListaDireccionDestino = 0, mensajeError = "", comboDireccionDestino, indiceComboSeleccionado = 0, listaIdDireccionComoDuplicados = [],
        listaIdDireccionComoDuplicadosTemporal = [];

    if (totalFilas > 1) {
        for (i = 0; i < totalFilas; i++) {
            dataDireccionDestino = {};
            comboDireccionDestino = null;
            comboDireccionDestino = $(tabla[0].rows[i].cells[1].children[1]);
            indiceComboSeleccionado = comboDireccionDestino[0].options.selectedIndex;
            valorIdDireccion = comboDireccionDestino[0].value;
            descripcionDireccion = comboDireccionDestino[0].options[indiceComboSeleccionado].text;
            //valorIdDireccion = tabla[0].rows[i].cells[1].children[1].value;
            //descripcionDireccion = tabla[0].rows[i].cells[1].children[1].text;

            dataDireccionDestino.IdDireccion = valorIdDireccion;
            dataDireccionDestino.DescripcionDireccion = descripcionDireccion;
            listaDireccionDestino.push(dataDireccionDestino);
        }

        for (i = 0; i < totalFilas; i++) {
            listaDireccionDestinoFiltrado = [];
            comboDireccionDestino = null;
            comboDireccionDestino = $(tabla[0].rows[i].cells[1].children[1]);
            indiceComboSeleccionado = comboDireccionDestino[0].options.selectedIndex;
            valorIdDireccion = comboDireccionDestino[0].value;
            descripcionDireccion = comboDireccionDestino[0].options[indiceComboSeleccionado].text;

            if (listaIdDireccionComoDuplicados.length > 0) {
                listaIdDireccionComoDuplicadosTemporal = listaIdDireccionComoDuplicados.filter(function (el) {
                    return el == valorIdDireccion;
                });
            }


            if (listaIdDireccionComoDuplicadosTemporal.length <= 0) {
                listaDireccionDestinoFiltrado = listaDireccionDestino.filter(function (el) {
                    return el.IdDireccion == valorIdDireccion;
                });

                totalListaDireccionDestino = listaDireccionDestinoFiltrado.length;
                if (totalListaDireccionDestino > 0) {
                    if (totalListaDireccionDestino > 1) {
                        listaIdDireccionComoDuplicados.push(valorIdDireccion);
                        mensajeError += "- The " + descripcionDireccion + " address repeats itself. <br/>";
                    }
                }
            }

        }
    }

    i = null;
    valorIdDireccion = null;
    descripcionDireccion = null;
    listaDireccionDestino = null
    dataDireccionDestino = null
    listaDireccionDestinoFiltrado = null;
    totalListaDireccionDestino = null;
    comboDireccionDestino = null;

    return mensajeError;
}

// :x :ini
(function ini() {
    load();
    _rules({ id: 'poproducto', clase: '_enty' });
    req_ini();
})();

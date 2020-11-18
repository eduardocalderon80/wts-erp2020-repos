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
    poclienteproductodestino: [],
    cadenalistaclientetalla: '',
    cadenalistatipocolor: '',
    listaTemporalGeneralPoClienteEstiloDestinoTallaColor: [],
    resultadoRetornoPopupTallaColor: false,
    clientetallajson: []
}

// :1
function load() {
    // :edu /*seccion modal*/
    _modal("buscarestilo");

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
    _('btnbuscarproducto').addEventListener('click', function () { _modal_open('buscarestilo', 900); }, false);
    _('btnConsumirBuy').addEventListener('click', x=> {
        if (controlador_buscar('buscar_buy')) {
            fn_activar_botones_next(false);
            _modalVentanaGeneral2(900);
        }
    }, false);


    // :modal
    $("#modal_buscarestilo").on("show.bs.modal", ejecutarmodalbuscarproducto);  // modal_ventanaGeneral
    $("#modal_buscarestilo").on("hidden.bs.modal", function () { });


    $("#modal_ventanaGeneral2").on("show.bs.modal", ejecutarmodalconsumirbuy);
    $("#modal_ventanaGeneral2").on("hidden.bs.modal", function () { });
    $("#modal_ventanaGeneral3").on("show.bs.modal", ejecutarmodaltallacolor);
    $("#modal_ventanaGeneral3").on("hidden.bs.modal", function () {
        if (ovariables.resultadoRetornoPopupTallaColor == true) {
            let idpoclienteestilodestino_hidden = _('hf_IdPoClienteEstiloDestino_PopupTallaColor').value;
            actualizarCantidadEnTablaDestinos(idpoclienteestilodestino_hidden);  // pojs.actualizarCantidadEnTablaDestinos
            generarTablaMatrizTallaColor_principal(); //PoJS.generarTablaMatrizTallaColor(); // HACER DESPUES
            contarCantidadesSimple(); // HACER DESPUES
            // :edu setear otravez la cantidad a consumir
            let idpobuyconsumir = _('hf_IdPo_Buy').value;
            if (idpobuyconsumir != 0 && idpobuyconsumir != '') {
                _('txtCantidadRequerida').value = _('hf_cantidadconsumir_buy').value;
            }
            $("#modal_bodyVentanaGeneral3").html('');
        }
    });

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
        par = JSON.stringify({ codigoestado: 1004 }), form = new FormData();

    form.append("par", par);

    switch (accion) {
        case 'new':
            Post('PO/POEstilo/getData_ClienteProveedor', form, res_ini);
            break;
        case 'edit':
            par = _parToJSON(_('txtpar').value);
            Get('PO/POEstilo/getData_byPOProducto?par=' + par, res_edit);
            break;
        default:
            break;
    }
}


function res_edit(orespuesta) {
    //alert(oresp);
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores != null) {
        ovariables.cadenalistatipocolor = ores.tipocolor;
        ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor = JSON.parse(ores.poclienteproductodestinotallacolor);
        ovariables.cadenalistaclientedireccion = ores.clientedireccion;
        ovariables.cadenalistaclientetalla = ores.clientetalla;
        _('cboClientePo').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.clientes);
        _('cboProveedor').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromCSV(ores.proveedores);

        // convertir a json las tallas
        //let cabeceraclientetalla = `idclientetalla¬nombreclientetalla`, dataclientetalla = '', clientetallajson = '';
        //dataclientetalla = cabeceraclientetalla + '^' + ores.clientetalla;
        //ovariables.clientetallajson = CSVtoJSON(dataclientetalla, '¬', '^');
        setearlistaclientetallaconvertcsvtojson(ores.clientetalla);

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
            tituloprincipal = '<h2>PO-Style | ' + datapo.codigo + '</h2>';

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

        //ovariables.cadenalistaclientedireccion = ores.clientedireccion;
        generartablapoclienteestilodestinofromloadeditar(oproducto.idpoclienteproducto, listapoclienteproductodestino);
        generarTablaMatrizTallaColor_principal();

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
        ovariables.cadenalistatipocolor = ores.tipocolor;
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

            Get('PO/POEstilo/getData_byCliente?par=' + codcliente, res_carga_camposxcliente);
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

                Get('PO/POEstilo/getData_byCliente?par=' + codcliente, res_carga_camposxcliente);
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
    ovariables.cadenalistaclientetalla = ores.clientetalla;

    // convertir a json las tallas
    //let cabeceraclientetalla = `idclientetalla¬nombreclientetalla`, dataclientetalla = '', clientetallajson = '';
    //dataclientetalla = cabeceraclientetalla + '^' + ores.clientetalla;
    //ovariables.clientetallajson = CSVtoJSON(dataclientetalla, '¬', '^');
    setearlistaclientetallaconvertcsvtojson(ores.clientetalla);
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
    modal.find(".modal-title").text("Search style");
    Get('PO/POEstilo/_BuscarEstilo', mostrar_ventana);
}

function mostrar_ventana(vistahtml) {
    var html = vistahtml;
    $("#modal_bodybuscarestilo").html(html);
    popbuscarproducto();
}

// funciones para modal buscar producto
function getlistaproducto() {
    let codigoproducto = _('txtCodigoEstiloBuscarPartial').value,
        codigotela = _('txtCodigoTelaBuscarPartial').value,
        descripcionestilo = _('txtDescripcionEstiloBuscarPartial').value,
        idcliente = _('cboClientePo').value,
        soloprincipal = '1',
        parametro = JSON.stringify({ 'codigoestilo':codigoproducto, 'codigotela': codigotela,
        'descripcionestilo': descripcionestilo, 'idcliente': idcliente, 'soloprincipal': soloprincipal});
    
    Get('PO/POEstilo/getData_Productos?par=' + parametro, mostrar_data);
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
            html += `<tr data-idproducto='${data[i].idestilo}'>`;
            html += `   <td class="text-center alineacionVertical hidden">`;
            html += `       <input type="radio" name="rbSeleccionarProducto" id="rbSeleccionarProducto" value="' + data[i].codigoestilo + '" />`;
            html += '   </td>';
            html += `   <td class="text-center">`;
            html += `       <div class="classcodigoproducto">`;
            html +=             data[i].codigoestilo;
            html += `       </div>`;
            html += `   </td>`;
            html += `   <td>`;
            html +=         data[i].descripcionestilo
            html += `   </td>`;
            html += `   <td>`;
            html += data[i].codigotela
            html += `   </td>`;
            html += `   <td>`;
            html += data[i].nombretela
            html += `   </td>`;
            html += `   <td>`;
            html += data[i].nombrefamilia
            html += `   </td>`;
            html += `   <td>`;
            html += data[i].version
            html += `   </td>`;
            html += `   <td>`;
            //html += data[i].principal
            if (data[i].principal == 1) {
                html += `   <input type="checkbox" name="chkPrincipalStiloxTelaBuscar" checked="checked" disabled="disabled" />`;
            } else {
                html += `   <input type="checkbox" name="chkPrincipalStiloxTelaBuscar" disabled="disabled" />`;
            }
            
            html += `</td>`;

            html += `</tr>`;
        }
        $("#tbodyGridBuscarEstilo").html(html);

        handlertrbuscarproducto("tbodyGridBuscarEstilo");
    } else {
        $("#tbodyGridBuscarEstilo").html('');
    }
    html = null;
    totalfilas = null;
    i = null;
}

function popbuscarproducto() {
    $("#btnBuscarEstiloPartial").on("click", function () { getlistaproducto(); });
    $("#btnAceptarEstiloBuscar").on("click", function () { popasignarproducto(); });
}

function popasignarproducto() {
    let tbl = _('tbodyGridBuscarEstilo'),
        x = 0, q = tbl !== null ? tbl.rows.length : 0,
        row = null;
    if (q > 0) {
        for (x = 0; x < q; x++) {
            if (tbl.rows[x].cells[0].children[0].checked) { row = tbl.rows[x]; break; }
        }
        if (row !== null) {
            let idproducto = row.getAttribute('data-idproducto');
            
            let codigoproducto = row.cells[1].children[0].innerText.trim();
            //let nombreproducto = row.cells[2].innerText.trim();
            let nombreproductodescripcion = row.cells[2].innerText.trim();

            _('hf_IdProducto').value = idproducto;
            _('txtCodigoEstiloProducto').value = codigoproducto;
            _('txtdescription').value = nombreproductodescripcion;
            _('hf_PopRespuesta').value = '1';//0 => return y 1 => grabar

            var codproducto = _('txtCodigoEstiloProducto').parentNode.parentNode.parentNode;
            codproducto.classList.remove('has-error');
            

            $("#modal_buscarestilo").modal("hide");

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

    cadenahtml += `<tr data-idpoclienteestilodestino=${contador}>`;
    cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
    cadenahtml += `         <a id="aEliminarClienteDireccionDestino" name="aEliminarClienteDireccionDestino" data-idpoclienteestilodestino = '${contador}' class="fa fa-remove punteromouse btn btn-danger btn-sm" title="delete"></a>`;
    cadenahtml += `         <a href="javascript:void(0)" class="fa fa-plus-circle btn btn-info btn-sm _tallacolor" title="add color size" data-idpoclientedestino='${contador}'></a>`;
    cadenahtml += `     </td>`;
    cadenahtml += `     <td style="vertical-align: middle; text-align: center" data-registroexistente="0">`;
    cadenahtml += `         <div style="display: none;">`;
    cadenahtml += `             <input id="txtIdPoClienteEstiloDestinoGrid" value='${contador}' />`;
    cadenahtml += `         </div>`;
    cadenahtml += `         <select class="form-control _combodireccion" id="cboClienteDireccionDestino">`;
    //cadenahtml += options;
    cadenahtml += `         </select>`;
    cadenahtml += `     </td>`;
    cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
    cadenahtml += `         <input class="form-control text-center _inputtrcantidadrequerida" value="0" disabled />`;
    cadenahtml += `     </td>`;
    cadenahtml += `</tr>`;

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
    let urlaccion = 'PO/POEstilo/getData_byPOProducto';
    oproducto.accion = 'add';

    if (accion === 'edit') {
        urlaccion = 'PO/POEstilo/getData_forEdit';
        _Get(urlaccion + '?par=' + JSON.stringify(oparametro)).then(function (value) { return value; }, function (reason) { alert('error:', reason); }
            ).then(function (data) {
                oproducto.accion = 'edit';
                mostrarpoproducto(data);
                visualizarbotongrabarbyaccion();
            });
    } else if (accion === 'copy') {
        urlaccion = 'PO/POEstilo/getData_forEdit';
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
        ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor = JSON.parse(ores.poclienteproductodestinotallacolor);
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
        //if (totalarrayentypanelfechas > 0) {
        //    for (i = 0; i < totalarrayentypanelfechas; i++) {
        //        tipoinput = arrayentypanelfechas[i].getAttribute('type');
        //        dataid = arrayentypanelfechas[i].getAttribute('data-id');
        //        if (tipoinput == 'text') {
        //            valordata = listapoclienteproducto[0][dataid];
        //            if (valordata != undefined) {
        //                arrayentypanelfechas[i].value = valordata;
        //            }
        //        }
        //    }
        //}
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
        generarTablaMatrizTallaColor_principal();

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
                cantidadrequerida: row.cells[2].children[0].value,
                idpoclienteproductodestino: row.getAttribute('data-idpoclienteestilodestino')
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
            cadenahtml += `<tr data-idpoclienteestilodestino='${listapoclienteproductodestino[i].idpoclienteproductodestino}'>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <a id="aEliminarClienteDireccionDestino" name="aEliminarClienteDireccionDestino" data-idpoclienteestilodestino = ' ${listapoclienteproductodestino[i].idpoclienteproductodestino}' class="fa fa-remove punteromouse btn btn-danger btn-sm" title="delete"></a>`;
            cadenahtml += `         <a href="javascript:void(0)" class="fa fa-plus-circle btn btn-info btn-sm _tallacolor" title="add color size" data-idpoclientedestino='${listapoclienteproductodestino[i].idpoclienteproductodestino}'></a>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <div style="display: none;">`;
            cadenahtml += `             <input id="txtIdPoClienteEstiloDestinoGrid" value=' ${listapoclienteproductodestino[i].idpoclienteproductodestino}' />`;
            cadenahtml += `         </div>`;
            cadenahtml += `         <select class="form-control _combodireccion" id="cboClienteDireccionDestino" name="cboClienteDireccionDestino">`;
            cadenahtml += `         </select>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <input class="form-control text-center _inputtrcantidadrequerida" name="txtcantidadrequeridaclientedireccion" value='${listapoclienteproductodestino[i].cantidadrequerida}' disabled />`; // onkeypress="return pojs.digitimosenteros(event, this)"
            cadenahtml += `     </td>`;
            cadenahtml += `</tr>`;

            $("#tbodyClienteDireccionDestino").append(cadenahtml);
            cargarcomboclientedirecciondestino(i, listapoclienteproductodestino[i].idclientedireccion);
            crearhandlerparagridclientedestino();
        }
        autonumericcantidadrequeridatabla();
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

    let tbl = _('tbodyClienteDireccionDestino'), abtn = _Array(tbl.getElementsByClassName('_tallacolor'));
    abtn.forEach(function (btn) {
        $(btn).off('click');
        btn.addEventListener("click", function (event) {
            let idpoclienteestilodestino = event.currentTarget.getAttribute('data-idpoclientedestino');
            _modalVentanaGeneral3(1000);
            _('hf_IdPoClienteEstiloDestino_PopupTallaColor').value = idpoclienteestilodestino;
            
        }, false);
    });
}

function crearhandlereliminarclientedestino() {
    $('#tblClienteDireccionDestino').off('click');
    $('#tblClienteDireccionDestino').on('click', '#aEliminarClienteDireccionDestino', function (event) {
        var idpoclienteestilodestino = $(event)[0].currentTarget.getAttribute("data-idpoclienteestilodestino");

        $(this).closest('tr').remove();

        eliminarItemPoClienteEstiloDestinoTallaColor();
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
            poclienteproductodestino = JSON.stringify(get_arrproductodestino('tbodyClienteDireccionDestino', { idpo: idpo, idpocliente: idpocliente, idpoclienteproducto: idpoclienteproducto })),
            poclienteproductodestinotallacolor = JSON.stringify(ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor);

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);
        form.append("parSubFoot", poclienteproductodestinotallacolor);

        Post('PO/POEstilo/save_PoProudcto_update', form, function (rpt) {
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
                poclienteproductodestino = JSON.stringify(get_arrproductodestino('tbodyClienteDireccionDestino', { idpo: idpo, idpocliente: idpocliente, idpoclienteproducto: idpoclienteproducto })),
                poclienteproductodestinotallacolor = JSON.stringify(ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor);

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);
        form.append("parSubFoot", poclienteproductodestinotallacolor);

        Post('PO/POEstilo/save_PoProducto_Add', form, function (rpt) {
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
        poclienteproductodestinotallacolor = JSON.stringify(ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor);

        let form = new FormData();
        form.append("par", po);
        form.append("parDetail", pocliente);
        form.append("parSubDetail", poclienteproducto);
        form.append("parFoot", poclienteproductodestino);
        form.append("parSubFoot", poclienteproductodestinotallacolor);

        Post('PO/POEstilo/Save_POProducto_new', form, function (rpt) {

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
    _('hf_cantidadconsumir_buy').value = 0;
    _('hf_estadocerrar_buy').value = 0;
    _('hf_cantidadrequerida_original_buy').value = 0;
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
    Get('PO/POEstilo/_ConsumirBuy', mostrar_ventana_consumirbuy);
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
    let parametro = JSON.stringify({ codigopocliente: '', idcliente: _('cboClientePo').value });
    Get('PO/POEstilo/getData_ConsumirBuy?par=' + parametro, mostrardatabuyconsumir);
}

function aceptarbuyconsumir() {
    let tbl = _('tbodygridbuscarbuy'),
            totalfilas = tbl.rows.length,
            i = 0,
            seleccionado = false,
            idpo_buy = 0, idpocliente_buy = 0, idpoclienteproducto_buy = 0, idproducto_buy = 0, codigopocliente_buy = '', nombreproducto_buy = '', txt = null, cantidadconsumir_buy = 0, row = null, par = ''
            iscerrar_buy = false, estadocerrar_buy = 0, valorchkbox = false;

    for (i = 0; i < totalfilas; i++) {
        seleccionado = tbl.rows[i].cells[0].children[0].checked;
        if (seleccionado) { row = tbl.rows[i]; break; }
    }
    if (row !== null) {
        par = row.getAttribute('data-par');
        txt = row.cells[5].childNodes[0];
        valorchkbox = row.cells[6].children[0].checked;
        cantidadconsumir_buy = txt.value !== '' ? parseFloat(txt.value) : 0;
        if (par !== null && cantidadconsumir_buy > 0) {
            idpo_buy = _par(par, 'idpo');
            idpocliente_buy = _par(par, 'idpocliente');
            idpoclienteproducto_buy = _par(par, 'idpoclienteproducto');
            idproducto_buy = _par(par, 'idproducto');
            codigopocliente_buy = _par(par, 'codigopocliente');
            nombreproducto_buy = _par(par, 'nombreproducto');
            estadocerrar_buy = valorchkbox ? 1 : 0;
            ejecutaraceptarmodalconsumir(idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidadconsumir_buy, estadocerrar_buy);// **            
        } else { alert('Quantity: Required'); }
    }

    //let tbl = _('tbodygridbuscarbuy'), totalfilas = tbl.rows.length, i = 0, seleccionado = false,
    //    idpo_buy = 0, idpocliente_buy = 0, idpoclienteproducto_buy = 0, idproducto_buy = 0, codigopocliente_buy = '', nombreproducto_buy = '';
    //for (i = 0; i < totalfilas; i++) {
    //    seleccionado = tbl.rows[i].cells[0].children[0].checked;
    //    if (seleccionado) {
    //        let datapar = tbl.rows[i].getAttribute("data-par");
    //        idpo_buy = tbl.rows[i].cells[0].getAttribute("data-idpo");
    //        idpocliente_buy = tbl.rows[i].cells[0].getAttribute("data-idpocliente");
    //        idpoclienteproducto_buy = tbl.rows[i].cells[0].getAttribute("data-idpoclienteproducto");
    //        idproducto_buy = tbl.rows[i].cells[0].getAttribute("data-idproducto");
    //        codigopocliente_buy = tbl.rows[i].cells[0].getAttribute("data-codigopocliente");
    //        nombreproducto_buy = tbl.rows[i].cells[0].getAttribute("data-nombreproducto");

    //        ejecutaraceptarmodalconsumir(idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy);
    //    }
    //}
}

function ejecutaraceptarmodalconsumir(idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidadconsumir_buy, estadocerrar_buy) {
    let urlaccion = 'PO/POEstilo/getData_forConsumirBuy', parametro = { idpo: idpo_buy, idpocliente: idpocliente_buy, idpoclienteproducto: idpoclienteproducto_buy };
    _Get(urlaccion + '?par=' + JSON.stringify(parametro)).then(
        function (value) { return value; },
        function (reason) { alert('error:', reason); }
    ).then(function (data) {
        mostrarpobuyforconsumir(data, idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidadconsumir_buy, estadocerrar_buy);
        $("#modal_ventanaGeneral2").modal("hide");
    });
}

function mostrardatabuyconsumir(orespuesta) {
    let data = $.trim(orespuesta).length > 0 ? CSVtoJSON(orespuesta,'¬','^') : null;    
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


function mostrarpobuyforconsumir(orespuesta, idpo_buy, idpocliente_buy, idpoclienteproducto_buy, idproducto_buy, codigopocliente_buy, nombreproducto_buy, cantidadconsumir_buy, estadocerrar_buy) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;

    if (ores != null) {
        ovariables.cadenalistatipocolor = ores.tipocolor;
        ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor = JSON.parse(ores.poclienteproductodestinotallacolor);
        //ovariables.cadenalistaclientedireccion = ores.clientedireccion;
        //ovariables.cadenalistaclientetalla = ores.clientetalla;

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
        _('hf_cantidadconsumir_buy').value = cantidadconsumir_buy;
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
        _('hf_cantidadrequerida_original_buy').value = cantidadrequerida;
        _('txtCantidadRequerida').value = cantidadconsumir_buy;
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
        if (cantidadrequerida != cantidadconsumir_buy) {
            generartabladestinos_cantidadrequeridadiferentes(oproducto.idpoclienteproducto, listapoclienteproductodestino);
        } else {
            generartablapoclienteestilodestinofromloadeditar(oproducto.idpoclienteproducto, listapoclienteproductodestino);
            generarTablaMatrizTallaColor_principal();
        }
        
    }
}


function fn_activar_botones_next(accion) {
    let anext = _Array(document.getElementsByClassName('_next'));
    if (!accion) { anext.forEach(x=>x.classList.add('hide')); }
    else { anext.forEach(x=>x.classList.remove('hide')); }
}


function carga_nuevapo() {
    let urlaccion = 'PO/POEstilo/addPOEstilo', urljs = 'PO/POEstilo/addPOEstilo';
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
                rsta += `<tr data-par='idpo:${adata[i].idpo},idpocliente:${adata[i].idpocliente},idpoclienteproducto:${adata[i].idpoclienteproducto},idproducto:${adata[i].idproducto},codigopocliente:${adata[i].codigopocliente},nombreproducto:${adata[i].nombreproducto}'>`;
                rsta += `<td class='hide'><input type='checkbox'> </td>`;
                rsta += `<td class='align-center'>${adata[i].nombrecliente}</td>`;
                rsta += `<td class='align-center'>${adata[i].codigopocliente}</td>`;
                rsta += `<td class='align-center'>${adata[i].nombreproducto}</td>`;
                rsta += `<td class='align-center'>${adata[i].cantidadrequerida}</td>`;
                rsta += `<td class='align-center'><input type='text' class='form-control _txt' readonly data-value='${adata[i].saldocantidadrequerida}' value='${adata[i].saldocantidadrequerida}'/></td>`;
                rsta += `<td class='text-center' style='vertical-align: middle;'><input type='checkbox'></td>`;
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
            //valorClienteDireccion = tabla.rows[i].cells[1].children[1].value

            //!$.isNumeric(valorClienteDireccion)
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
            cadenamensaje += '- the quantity required must be equal to the total quantity of destinations. </br>';
            _('divCantidadRequerida').classList.add('has-error');
        }
    } else {
        cadenamensaje += '- enter at least one destination.';
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
    urlaccion = 'PO/POEstilo/eliminarPoClienteProductoById';
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

// :edu todo sobre modal tallacolor
function ejecutarmodaltallacolor(event) {
    let modal = $(this);
    modal.find(".modal-title").text("Color size");
    Get("PO/POEstilo/_TallaColor", mostrar_ventana_tallacolor);
}

function mostrar_ventana_tallacolor(vistahtml) {
    var html = vistahtml;
    $("#modal_bodyVentanaGeneral3").html(html);
    
    par = _parToJSON('idcliente:' + _('cboClientePo').value);
    Get('PO/POEstilo/getdata_opentallacolor?par=' + par, res_ini_tallacolor);
    //popuptallacolor();
}

function popuptallacolor() {
    _('btnCancelar_PopupTallaColor').addEventListener('click', function () { 
        $("#modal_ventanaGeneral3").modal('hide');
    }, false);

    _('btnAceptar_PopupTallaColor').addEventListener('click', aceptarPopupTallaColor, false);

    cargarComboClienteTalla();
    cargarcombotipocolor();
    
    // eventos
    //_('cboTipoColor').addEventListener('change', changecombocolor, false);
    $("#cboTipoColor").on("change", changecombocolor );

    $('#cboClienteTalla').multiselect({
        enableFiltering: true,
        buttonWidth: '100%',
        maxHeight: 210,
        enableCaseInsensitiveFiltering: true,
        onChange: function (element, checked) {
            if (checked) {
                generarMatrizTallaColor(element, "Talla");
            } else {
                eliminarTallaColorMatriz(element, "Talla");
            }
        }
    });

    $("#cboClienteColor").multiselect({
        enableFiltering: true,
        buttonWidth: '100%',
        maxHeight: 210,
        enableCaseInsensitiveFiltering: true,
        onChange: function (element, checked) {
            if (checked) {
                generarMatrizTallaColor(element, "Color");
            } else {
                eliminarTallaColorMatriz(element, "Color");
            }
        }
    });

    init_iniciar_modaltallacolor();

    // sale error demo
    //$('#FechaPago').datetimepicker({
    //    format: 'DD/MM/YYYY',
    //    locale: 'es'
    //});
}

function cargarComboClienteTalla() {
    "use strict";
    let existedata = false, item = '';
        //, item = _comboItem({ value: '', text: '--Select--' });

    _('cboClienteTalla').innerHTML = item + (ovariables.cadenalistaclientetalla != '' ? _comboFromCSV(ovariables.cadenalistaclientetalla) : '');
}

function cargarcombotipocolor() {
    "use strict";
    let existedata = false, item = _comboItem({ value: '', text: '--Select--' });

    _('cboTipoColor').innerHTML = item + (ovariables.cadenalistatipocolor != '' ? _comboFromCSV(ovariables.cadenalistatipocolor) : '');
}

function cargarColor(idcliente, idtipocolor) {
    "use strict";
    let urlaccion = 'PO/POEstilo/getData_colorbyidcliente_tipocolor', form = new FormData(), parametro = JSON.stringify({ idcliente: idcliente, idtipocolor: idtipocolor });
    
    $('#cboClienteColor').empty();
    $('#cboClienteColor').multiselect('rebuild');

    form.append("par", parametro);

    Post(urlaccion, form, res_cargarcolor);
}

function res_cargarcolor(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores != null) {
        //_comboItem({ value: '', text: '--Select--' }) + 
        _('cboClienteColor').innerHTML = _comboFromCSV(ores.clientecolor);
        $('#cboClienteColor').multiselect('rebuild');
    }
}

function changecombocolor() {
    let idtipocolor = $(this).val(), idcliente = _('cboClientePo').value, objmensaje = { titulo: 'mensaje', mensaje: '', estado: 'error' };

    if ($.isNumeric(idcliente)) {
        if (parseInt(idcliente) <= 0) {
            objmensaje.mensaje = 'Customer needs to be selected';
            _mensaje(objmensaje);
            $("#cboTipoColor").val("");
            return false;
        }
    } else {
        objmensaje.mensaje = 'Customer needs to be selected';
        _mensaje(objmensaje);
        $("#cboTipoColor").val("");
        return false;
    }

    if ($.isNumeric(idtipocolor)) {
        if (parseInt(idtipocolor) <= 0) {
            $("#cboClienteColor").empty();
            $('#cboClienteColor').multiselect('rebuild');
            return false;
        }
    } else {
        $("#cboClienteColor").empty();
        $('#cboClienteColor').multiselect('rebuild');
        return false;
    }

    $("#cboClienteColor").empty();
    $('#cboClienteColor').multiselect('rebuild');
    cargarColor(idcliente, idtipocolor);
    //$('#cboClienteColor').multiselect('rebuild');
}

function generarMatrizTallaColor(item, tipo) {
    var i = 0, IdTipoColor = $("#cboTipoColor").val(), NombreClienteColor = "", NombreTipoColor = "", colorExiste = false,
        registroExistente = 0, resultaExisteColumna_o_filaSubTotal = {}, idPoClienteEstiloDestino = $("#hf_IdPoClienteEstiloDestino_PopupTallaColor").val(),
        objmensaje = { titulo: 'mensaje', mensaje: '', estado: 'error' }, tblTallaColorPopup = _('tbdoyMatrizTallaColor_Popup'),
            totalFilasTblTallaColorPopup = tblTallaColorPopup.rows.length;

    if (tipo == "Color") {
        var IdClienteColor = $(item).val();
        colorExiste = validarSiExisteColorEnLaTabla(item);
        if (colorExiste) {
            $("#cboClienteColor").multiselect('deselect', IdClienteColor);
            objmensaje.mensaje = 'Color already exists.';
            _mensaje(objmensaje);
            return false;
        }

        var Table = document.getElementById("tblMatrizTallaColor_Popup");
        var LastRow = Table.rows[0].length;
        var ColumnLen = Table.rows[0].cells.length;
        LastRow++;
        var cboColorMatrizID = "cboColoMatriz" + LastRow;
        var Html = "";
        //var IdTipoColor = $("#cboTipoColor").val();
        NombreTipoColor = $("#cboTipoColor").find(":selected").text();
        
        NombreClienteColor = $(item).text();
        var RowId = "rowColorPopup" + IdClienteColor;

        Html += "<tr id='" + RowId + "' data-id='" + IdClienteColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-idtipocolor = '" + IdTipoColor + "' >";
        Html += "<td style='text-align:center;vertical-align: middle;'><a onclick='eliminarColorMatriz(this);' class='btn btn-danger btn-sm' data-id='" + IdClienteColor + "' data-type='" + IdTipoColor + "' tabindex='-1' href='javascript:void(0)'><i class='fa fa-remove'></i></a></td>";
        Html += "<td class='text-center' data-id='" + IdTipoColor + "'>" + NombreTipoColor + "</td>";
        Html += "<td class='text-center' data-id='" + IdClienteColor + "'>" + NombreClienteColor + "</td>";
        Html += `<td class='text-center' data-id='${IdClienteColor}'>`;
        Html += `   <input type='date' class='_datepicker' data-date="" data-date-format="MM/DD/YYYY" value='' />`;
        //Html += `   <div class="input-group date _datepicker">`;
        //Html += `       <input type="text" class="form-control date _wipmodal" />`;
        //Html += `           <div class="input-group-addon">`;
        //Html += `               <i class="fa fa-calendar"></i>`;
        //Html += `           </div>`;
        //Html += `    </div>`
        Html += `</td>`;
        Html += "<td class='text-center' style='vertical-align: middle;'><div class='_subtotal_principal_popup'>0</div></td>";
        //if (totalFilasTblTallaColorPopup <= 0) {
        //    Html += "<td class='text-center'><div class='_subtotal_principal_popup'>0</div></td>";
        //}
        // :edu 20171026 ver mas adelante si puede ser dinamico en vez de poner fijo el indice inicio index columnas tallas
        if (ColumnLen > 5) {
            var ColumnLenAdd = ColumnLen - 5;
            var index = 5;
            var IdTallaCliente = 0;
            var Table = document.getElementById("tblMatrizTallaColor_Popup");
            for (i = 0; i < ColumnLenAdd; i++) {
                IdTallaCliente = $(Table.rows[0].cells[index]).attr("data-size");
                Html += "<td><input style='height: 100% !important;' data-color='" + IdClienteColor + "' data-size='" + IdTallaCliente + "' data-idtipocolor = '" + IdTipoColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-registroexistente = '" + registroExistente + "' data-idpoclienteestilodestino = '" + idPoClienteEstiloDestino + "' data-idpoclienteestilodestinotallacolor = '0'  class='form-control MatrizDetailPopup text-center' type='text' onkeyup = 'contarCantidades()' value='0' ></td>";  // :edu onkeypress='return PoJS.DigitimosEnteros(event, this)'
                index++;
            }
            i = null;
        }
        Html += "</tr>";
        $("#tblMatrizTallaColor_Popup tbody").append(Html)
        $("#" + cboColorMatrizID).val(IdClienteColor);
        crearhandlermodaltallacolor();

    } else {

        var LastRow = $("#tblMatrizTallaColor_Popup tbody tr").length;
        var ColumnLen = $("#tblMatrizTallaColor_Popup thead td").length;
        var cont = 0

        $("#tblMatrizTallaColor_Popup tr").each(function () {
            var Html = "";
            var IdClienteColor = $(this).attr("data-id");
            var IdTallaCliente = $(item).val();
            var NombreClienteTalla = $(item).text();
            NombreClienteColor = $(this).attr("data-nombrecolor");
            NombreTipoColor = $(this).attr("data-nombretipocolor");
            IdTipoColor = $(this).attr("data-idtipocolor");
            if (cont == 0) {
                Html = "<th data-size='" + IdTallaCliente + "' class='text-center'>" + NombreClienteTalla + "</th>";  // width='300'
            } else {
                
                Html = "<td><input style='height: 100% !important;' data-color='" + IdClienteColor + "' data-size='" + IdTallaCliente + "' data-idtipocolor = '" + IdTipoColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-registroexistente = '" + registroExistente + "' data-idpoclienteestilodestino = '" + idPoClienteEstiloDestino + "' data-idpoclienteestilodestinotallacolor = '0' class='form-control MatrizDetailPopup text-center' type='text' onkeyup = 'contarCantidades()' value='0' ></td>";  // :edu onkeypress='return PoJS.DigitimosEnteros(event, this)'
            }
            $(this).append(Html);
            cont++;
        });
    }

    generarTablaSubTotalesTallaColor();
}

function validarSiExisteColorEnLaTabla(opcionSeleccionadaComboClienteColor) {
    "use strict";
    var idClienteColorCombo = 0, tablaFilas = $("#tbdoyMatrizTallaColor_Popup"), totalFilasTabla = 0, i = 0,
        idClienteColorTabla = 0, colorExiste = false;
    idClienteColorCombo = $(opcionSeleccionadaComboClienteColor).val();
    totalFilasTabla = tablaFilas[0].rows.length;

    for (i = 0; i < totalFilasTabla; i++) {
        idClienteColorTabla = tablaFilas[0].rows[i].cells[2].getAttribute('data-id');
        if (idClienteColorTabla == idClienteColorCombo) {
            colorExiste = true;
        }
    }
    i = null;

    return colorExiste;
}

function generarTablaSubTotalesTallaColor() {
    "use strict";
    
    $("#tbodyTallaColorSubTotalFila_Popup").html('');
    $("#tbodyTallaColorSubTotalColumna_Popup").html('');
    var tieneTallaColor = 0, tablaCabecera = $("#theadMatrizTallaColor_Popup"), totalFilaCabecera = $("#theadMatrizTallaColor_Popup > tr").length,
        totalColumnas = 0, tablaTallaColor = $("#tbdoyMatrizTallaColor_Popup"), totalFilaCantidad = $("#tbdoyMatrizTallaColor_Popup > tr").length,
        tablaSubTotalFila = $("#tbodyTallaColorSubTotalFila_Popup"),
        i = 0, j = 0, idTallaColor = '', idClienteColor = 0, existeColumaTalla = false, posicionInicioTalla = 0, contarColumnasTallaColor = 0, contarFilasTallaColor = 0, cadenaHtml = '', valorCantidad = 0,
        listaCantidadPorIdTalla = [], listaIdClienteColorUnicos = [], dataCantidadPorIdTalla = {}, listaIdTallaColorUnicos = [], listaTemporal = [], cantidadListaTemporal = 0, valorSumaCantidad = 0,
        totalFilasSubTotalInferior = 0, anchoColumna = 0, altoFila = 0, listaAnchoColumnas = [], dataAnchoColumnas = {},
        tblTallaColorPopup = _('tbdoyMatrizTallaColor_Popup'),
            totalFilasTblTallaColorPopup = tblTallaColorPopup.rows.length,
            arrfilasubtotal = tblTallaColorPopup.getElementsByClassName('_filasubtotal_popup');
    

    if (totalFilaCabecera > 0) {
        totalColumnas = tablaCabecera[0].rows[0].cells.length;
        for (i = 0; i < totalColumnas; i++) {
            idTallaColor = tablaCabecera[0].rows[0].cells[i].getAttribute('data-size');
            anchoColumna = tablaCabecera[0].rows[0].cells[i].clientWidth;

            dataAnchoColumnas = {};
            dataAnchoColumnas.IndiceColumna = i;
            dataAnchoColumnas.Ancho = anchoColumna;
            listaAnchoColumnas.push(dataAnchoColumnas);
            if (idTallaColor != null) {
                contarColumnasTallaColor++;
                existeColumaTalla = true;
                listaIdTallaColorUnicos.push(idTallaColor);
                if (contarColumnasTallaColor == 1) {
                    posicionInicioTalla = i;
                }
            }
        }
    }

    //altoFila = tablaCabecera[0].rows[0].cells[posicionInicioTalla].clientHeight;
    if (totalFilaCantidad > 0) {
        altoFila = tablaTallaColor[0].rows[0].clientHeight;
        if (altoFila == 0) {
            altoFila = 32
        }
    } else {
        altoFila = 32
    }

    for (i = 0; i < totalFilaCantidad; i++) {
        for (j = 0; j < totalColumnas; j++) {
            try {
                idClienteColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-color');
                if (idClienteColor != null && idClienteColor != "undefined") {
                    contarFilasTallaColor++;
                    listaIdClienteColorUnicos.push(idClienteColor);
                    break;
                }
            } catch (e) {

            }
        }
    }

    if (totalFilaCantidad > 0) {
        for (i = 0; i < totalFilaCantidad; i++) {
            for (j = 0; j < totalColumnas; j++) {
                dataCantidadPorIdTalla = {};
                try {
                    idTallaColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-size');
                    idClienteColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-color');
                    if (idTallaColor != null) {
                        valorCantidad = tablaTallaColor[0].rows[i].cells[j].children[0].value;
                        dataCantidadPorIdTalla.IdTallaCliente = idTallaColor;
                        dataCantidadPorIdTalla.IdClienteColor = idClienteColor;
                        dataCantidadPorIdTalla.Cantidad = valorCantidad;

                        listaCantidadPorIdTalla.push(dataCantidadPorIdTalla);
                    }
                } catch (e) {

                }

            }
        }
    }

    if (arrfilasubtotal.length > 0) {
        // eliminar fila subtotal
        tblTallaColorPopup.rows[parseInt(arrfilasubtotal[0].rowIndex)-1].remove();
    }

    // PARA LA TABLA INFERIOR SUMA PARA LAS COLUMNAS
    cadenaHtml += '<tr class="_filasubtotal_popup">';
    cadenaHtml += '     <td></td>';
    cadenaHtml += '     <td></td>'; // tipo color
    cadenaHtml += '     <td class="text-center"></td>'; // color
    cadenaHtml += '     <td class="text-center"></td>'; // wip
    cadenaHtml += '     <td class="text-center"><div class="_subtotal_total_popup">0</div></td>';  // height=\"' + altoFila + '\" width=\"' + anchoColumna + '\"

    for (i = 0; i < contarColumnasTallaColor; i++) {
        valorSumaCantidad = 0;
        idTallaColor = listaIdTallaColorUnicos[i];

        listaTemporal = listaCantidadPorIdTalla.filter(function (el) {
            return el.IdTallaCliente == idTallaColor;
        });

        cantidadListaTemporal = listaTemporal.length;
        if (cantidadListaTemporal > 0) {
            // calcular suma
            for (j = 0; j < cantidadListaTemporal; j++) {
                if (!isNaN(parseInt(listaTemporal[j].Cantidad))) {
                    valorSumaCantidad += parseInt(listaTemporal[j].Cantidad);
                }
            }
        }

        cadenaHtml += '     <td class="text-center col-sm-1" style="vertical-align: middle;">';  //height="35";  height=\"' + altoFila + '\"
        cadenaHtml += valorSumaCantidad;
        cadenaHtml += '     </td>';
    }
    cadenaHtml += '</tr>';

    $("#tbdoyMatrizTallaColor_Popup").append(cadenaHtml);  // tbodyTallaColorSubTotalFila_Popup
    
    
    // PARA LA TABLA A LA DERECHA SUMA PARA LAS FILAS
    //cadenaHtml = '';
    let tblDestinos = _('tblMatrizTallaColor_Popup'), arrsubtotal = _Array(tblDestinos.getElementsByClassName('_subtotal_principal_popup')), totalArrSubTotal = arrsubtotal.length;
    if (contarFilasTallaColor > 0) {
        for (i = 0; i < contarFilasTallaColor; i++) {
            //cadenaHtml += '<tr>';

            valorSumaCantidad = 0;
            idClienteColor = listaIdClienteColorUnicos[i];

            listaTemporal = listaCantidadPorIdTalla.filter(function (el) {
                return el.IdClienteColor == idClienteColor;
            });

            cantidadListaTemporal = listaTemporal.length;
            if (cantidadListaTemporal > 0) {
                // calcular suma
                for (j = 0; j < cantidadListaTemporal; j++) {
                    if (!isNaN(parseInt(listaTemporal[j].Cantidad))) {
                        valorSumaCantidad += parseInt(listaTemporal[j].Cantidad);
                    }

                }
            }

            arrsubtotal[i].innerText = valorSumaCantidad;
            //cadenaHtml += '     <td class="text-center" style="vertical-align: middle;" width="50" height=\"' + altoFila + '\">';  // height="35"
            //cadenaHtml += valorSumaCantidad;
            //cadenaHtml += '     </td>';
            //cadenaHtml += '</tr>';
        }
    } else {
        //for (i = 0; i < totalFilaCantidad; i++) {
        //    cadenaHtml += '<tr>';
        //    cadenaHtml += '     <td class="text-center" style="vertical-align: middle;" width="50" height=\"' + altoFila + '\">';  // height="35"
        //    cadenaHtml += 0;
        //    cadenaHtml += '     </td>';
        //    cadenaHtml += '</tr>';
        //}
    }

    arrsubtotal = _Array(tblDestinos.getElementsByClassName('_subtotal_principal_popup'));
    totalArrSubTotal = arrsubtotal.length;
    let totalsubtotal_general = 0;
        arrsubtotal.forEach(function (div, index) {
            totalsubtotal_general += parseInt(div.innerText);
        });

        let subtotal_total = tblDestinos.getElementsByClassName('_subtotal_total_popup');
        subtotal_total[0].innerText = totalsubtotal_general;

    i = null;
    listaTemporal = null;
    cantidadListaTemporal = null;
    valorSumaCantidad = null;
    totalFilasSubTotalInferior = null;
    tablaSubTotalFila = null;
    listaAnchoColumnas = null;
    dataAnchoColumnas = null;
}

function eliminarTallaColorMatriz(item, tipo) {
    "use strict";
    var i = 0;
    if (tipo == "Color") {

        var RowId = "rowColorPopup" + $(item).val();
        $("#" + RowId).remove();

    } else {

        var IdClienteTalla = $(item).val();
        var StartedIndex = 2; // Cuenta el 0
        var Table = document.getElementById("tblMatrizTallaColor_Popup");
        var DeletedIndex = -1;
        var HeaderRow = Table.rows[0];
        var ColumnLen = Table.rows[0].cells.length;

        for (i = StartedIndex; i < ColumnLen; i++) {
            var IdClienteTallaHD = $(HeaderRow.cells[i]).attr("data-size");
            if (IdClienteTallaHD == IdClienteTalla) {

                DeletedIndex = i;
                break;
            }
        }
        i = null;
        if (DeletedIndex >= 0) {
            HeaderRow.deleteCell(DeletedIndex);
            $("#tblMatrizTallaColor_Popup tbody tr").each(function () {
                this.deleteCell(DeletedIndex);
            });
        }
    }
    contarCantidades(); // YA NO VA
}

function contarCantidades() {

    var Cantidad = 0, valorCantidad = 0;
    $(".MatrizDetailPopup").each(function () {
        valorCantidad = $(this).val();
        if (!$.isNumeric(valorCantidad)) {
            valorCantidad = 0;
        }

        Cantidad += parseInt(valorCantidad);
    });

    //$("#txtCantidadRequerida").val(Cantidad);
    $("#hf_hdnCantidadRequerida_PopupTallaColor").val(Cantidad);
    generarTablaSubTotalesTallaColor();
}

function eliminarColorMatriz(obj) {
    var IdTipoColor = $(obj).attr("data-type");
    var IdClienteColor = $(obj).attr("data-id");
    if (IdTipoColor == $("#cboTipoColor").val()) {
        $("#cboClienteColor").multiselect('deselect', IdClienteColor);
    }
    $(obj).closest('tr').remove();
    contarCantidades();
}

function aceptarPopupTallaColor() {
    "use strict";
    
    var totalCantidad = $("#hf_hdnCantidadRequerida_PopupTallaColor").val(), validacionCantidadTallas = false, 
        objmensaje = { titulo: 'mensaje', mensaje: 'no se pudo registrar', estado: 'error' };

    if (totalCantidad <= 0) {
        objmensaje.mensaje = 'Enter at least an amount';
        _mensaje(objmensaje);
        return false;
    }

    validacionCantidadTallas = validarCantidadTallaColorAntesGrabar();
    if (validacionCantidadTallas == false) {
        return false;
    }

    // AGREGAR A LA LISTA TEMPORAL 
    agregarAlaListaGeneralTemporalDeTallaColor();

    ovariables.resultadoRetornoPopupTallaColor = true;
    $("#modal_ventanaGeneral3").modal("hide");
}

function validarCantidadTallaColorAntesGrabar() {
    "use strict";
    var tabla = $("#tbdoyMatrizTallaColor_Popup"), totalFilas = $("#tbdoyMatrizTallaColor_Popup > tr").length, i = 0, j = 0
                , totalColumnas = tabla[0].rows[0].cells.length, totalClases = 0, k = 0, cadenaClases = "", indiceClase = 0,
                filaConCantidad = false, valorCampo = 0, totalColumnasCantidad = 0, indiceInicioColumnaCantidad = 0, mensajeError = "",
                validacion = false, contador = 0, objmensaje = { titulo: 'mensaje', mensaje: 'no se pudo registrar', estado: 'error' };
    totalFilas = parseInt(totalFilas) - 1;
    for (i = 0; i < totalFilas; i++) {
        if (i == 0) {
            for (j = 0; j < totalColumnas; j++) {
                var xd = tabla[0].rows[i].cells[j].children[0];
                if (xd != undefined) {
                    totalClases = xd.classList.length;
                    cadenaClases = xd.classList.toString();
                    indiceClase = cadenaClases.indexOf("MatrizDetailPopup");
                    if (indiceClase >= 0) {
                        totalColumnasCantidad++;
                        if (totalColumnasCantidad == 1) {
                            indiceInicioColumnaCantidad = j;
                        }
                    }
                }

            }
            break;
        }
    }

    for (i = 0; i < totalFilas; i++) {
        contador = indiceInicioColumnaCantidad;
        filaConCantidad = false;
        for (j = 0; j < totalColumnasCantidad; j++) {
            valorCampo = tabla[0].rows[i].cells[contador].children[0].value;

            if (parseInt(valorCampo) > 0) {
                filaConCantidad = true;
            }

            contador++;
        }
        if (filaConCantidad == false) {
            mensajeError += "- En la fila " + (parseInt(i) + 1).toString() + " falta ingresar al menos una cantidad. <br/>";
        }
    }

    if (mensajeError != "") {
        validacion = false;
        //mensajeAlertaBootbox(mensajeError);
        objmensaje.mensaje = mensajeError;
        _mensaje(objmensaje);
    } else {
        validacion = true;
    }
    i = null;
    j = null;

    return validacion;
}

function agregarAlaListaGeneralTemporalDeTallaColor() {
    "use strict";

    var cantidad = 0, listaTallaColor = [], idpoclienteestilodestinotallacolor = 0, idpoclienteestilodestino = $("#hf_IdPoClienteEstiloDestino_PopupTallaColor").val(), idclientetalla = 0,
        idclientecolor = 0, idtipocolor = 0, nombretipocolor = '', nombrecolor = '', registroexistente = false, listaTemporal = [],
        valorWip = '';

    if (ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.length > 0) {
        listaTemporal = jQuery.grep(ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor, function (value) {
            return value.idpoclienteestilodestino != idpoclienteestilodestino;
        });
        ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor = [];
        ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor = listaTemporal;
    } 
        
    $(".MatrizDetailPopup").each(function () {
        valorWip = '';
        idpoclienteestilodestinotallacolor = $(this).attr("data-idpoclienteestilodestinotallacolor");
        idpoclienteestilodestino = _('hf_IdPoClienteEstiloDestino_PopupTallaColor').value; //$(this).attr("data-idpoclienteestilodestino");
        //idPoClienteEstilo = $(this).attr("data-idpoclienteestilo");
        idclientetalla = $(this).attr("data-size");
        idclientecolor = $(this).attr("data-color");
        idtipocolor = $(this).attr("data-idtipocolor");
        nombretipocolor = $(this).attr("data-nombretipocolor");
        nombrecolor = $(this).attr("data-nombrecolor");
        cantidad = $(this).val();
        registroexistente = $(this).attr("data-registroexistente");
        // :edu 20171030 esta condicion es algo temporal ya que no puedo usa el datepicker
        if ($.trim(_convertDate_ANSI($(this)[0].parentNode.parentNode.cells[3].children[0].value)) == "") {
            if ($(this)[0].parentNode.parentNode.cells[3].children[0].value != "") {
                valorWip = $(this)[0].parentNode.parentNode.cells[3].children[0].value;
            }
        } else {
            valorWip = _convertDate_ANSI($(this)[0].parentNode.parentNode.cells[3].children[0].value);
        }
        
        if (cantidad > 0) {
            var opoclienteestilotallacolor = {
                idpoclienteestilodestinotallacolor: idpoclienteestilodestinotallacolor,
                idpoclienteestilodestino: idpoclienteestilodestino,  // con este id voy a filtrar
                //idpoclienteestilo: idpoclienteestilo,
                //idpocliente: idpocliente,
                idpo: 0,
                idclientecolor: idclientecolor,
                idclientetalla: idclientetalla,
                cantidad: cantidad,
                idtipocolor: idtipocolor,
                nombretipocolor: nombretipocolor,
                nombreclientecolor: nombrecolor,
                registroexistente: registroexistente,
                wip: valorWip
            }

            ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.push(opoclienteestilotallacolor);
            //oPoClienteEstilo.PoClienteEstiloTallaColor.push(oPoClienteEstiloTallaColor);
        }
    });
}

function init_iniciar_modaltallacolor() {
    "use strict";
    var listaTallaColor = [], cargarDatosCuandoNoExisteDatosTallaColor = false, cantidadOriginal = _('hf_cantidadrequerida_original_buy').value, cantidadConsumirBuy = _('hf_cantidadconsumir_buy').value;
    //popupTallaColorPorDestino.initPopup();
    if (ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.length == 0) {
        cargarDatosCuandoNoExisteDatosTallaColor = true;
    } else {
        listaTallaColor = ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.filter(function (el) {
            return el.idpoclienteestilodestino == _('hf_IdPoClienteEstiloDestino_PopupTallaColor').value;  //popupTallaColorPorDestino.idPoClienteEstiloDestino
        });

        if (listaTallaColor.length > 0) {
            if (cantidadOriginal != cantidadConsumirBuy) {
                generarTablaMatrizTallaColor_modaltallacolor_cantidadrequeridadiferentes();
            } else {
                generarTablaMatrizTallaColor_modaltallacolor();
            }
        } else {
            cargarDatosCuandoNoExisteDatosTallaColor = true;
        }
    }

    if (cargarDatosCuandoNoExisteDatosTallaColor) {
        //cargarComboClienteTalla();  // ver si es necesario
        //cargarcombotipocolor();

        //// CARGAR TIPO COLOR
        var idTipoColor = $("#cboTipoColor").val()
        if (idTipoColor == "") {
            $("#cboClienteColor").empty();
            $('#cboClienteColor').multiselect('rebuild');
        } else {
            //PoJS.CargarColor(IdCliente, idTipoColor);
            cargarColor(IdCliente, idTipoColor);
        }
        idTipoColor = null;
    }
}

function generarTablaMatrizTallaColor_modaltallacolor() {
    "use strict";
    var listaTallaColor = [], listaIdFilasColor = [], listaIdColumnasTallas = [],
        listaGrupoTipoColorTemp = [], columnas = 0, filas = 0, idPoClienteEstiloDestino = $("#hf_IdPoClienteEstiloDestino_PopupTallaColor").val();

    listaTallaColor = ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.filter(function (el) {
        return el.idpoclienteestilodestino == idPoClienteEstiloDestino;
    })

    listaIdFilasColor = GroupBy(listaTallaColor, 'idclientecolor');  // PARA LAS FILAS
    listaIdColumnasTallas = GroupBy(listaTallaColor, 'idclientetalla');  // PARA LAS COLUMNAS
    listaGrupoTipoColorTemp = GroupBy(listaTallaColor, 'idtipocolor');
    filas = listaIdFilasColor.length;
    columnas = listaIdColumnasTallas.length;
        
    var cadenaHtml = "", cboClienteTalla = $("#cboClienteTalla"), cboClienteColor = $("#cboClienteColor"), totalTallasCombo = 0, totalColorCombo = 0, i = 0, j = 0,
        k = 0, IdTallaCliente = 0, nombreTallaCombo = "", RowId = "", IdClienteColor = 0, IdTipoColor = 0, NombreTipoColor = "", NombreClienteColor = "",
        dataTallaColorFiltrada = {}, listaTallaColorTemp = [], cantidad = 0, IdCliente = $("#cboClientePo").val(), cboTipoColor = $("#cboTipoColor"),
        indexTipoColor = 0, totalTallas = 0, listaColumnasTallasTemp = [], contador = 0, registroExistente = 0, idPoClienteEstiloTallaColor = 0, idpoclienteestilodestinotallacolor = 0,
            valorwip = '';

    //$("#divMatrizTallaColor").html('');
    $("#divHijoMatrizTallaColor_Popup").html('');

    IdTipoColor = listaTallaColor[0].idtipocolor;

    cargarComboClienteTalla();


    cadenaHtml += "<table id='tblMatrizTallaColor_Popup' class='table table-bordered table-fixed'>";  //table table-bordered table-fixed
    cadenaHtml += "<thead id='theadMatrizTallaColor_Popup'>";
    cadenaHtml += " <tr>";
    cadenaHtml += "     <th class='text-center' width='50'></th>";
    cadenaHtml += "     <th class='text-center' width='200'>Color Type</th>";
    cadenaHtml += "     <th class='text-center' width='300'>Color</th>";
    cadenaHtml += "     <th class='text-center' width='200'>Wip</th>";  // wip
    cadenaHtml += "     <th class='text-center' width='50'>SubTotal</th>";
    
    totalTallasCombo = cboClienteTalla[0].options.length;
    // CABECERA
    totalTallas = ovariables.clientetallajson.length; //Talla.length;

    for (k = 0; k < totalTallas; k++) {
        listaColumnasTallasTemp = [];
        listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
            return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
        });

        if (listaColumnasTallasTemp.length > 0) {
            contador++;
            //IdTallaCliente = listaIdColumnasTallas[i].IdClienteTalla;
            IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
            nombreTallaCombo = $.trim(ovariables.clientetallajson[k].nombreclientetalla); //$.trim(Talla[k].NombreClienteTalla);
            cadenaHtml += "     <th data-size='" + IdTallaCliente + "' class='text-center col-sm-1'>" + nombreTallaCombo + "</th>"; // width='300'
        }
        if (contador == columnas) {
            break;
        }
    }

    cadenaHtml += " </tr>";
    cadenaHtml += "</thead>";
    cadenaHtml += "<tbody id='tbdoyMatrizTallaColor_Popup'>";

    // FILAS
    //totalColorCombo = cboClienteColor[0].options.length;
    contador = 0;
    for (i = 0; i < filas; i++) {
        contador = 0;
        IdClienteColor = listaIdFilasColor[i].idclientecolor;
        RowId = "rowColorPopup" + IdClienteColor;

        listaTallaColorTemp = [];
        listaTallaColorTemp = listaTallaColor.filter(function (el) {
            return el.idclientecolor == IdClienteColor;
        });

        NombreClienteColor = listaTallaColorTemp[0].nombreclientecolor;
        NombreTipoColor = listaTallaColorTemp[0].nombretipocolor;
        IdTipoColor = listaTallaColorTemp[0].idtipocolor;
        valorwip = listaTallaColorTemp[0].wip;

        cadenaHtml += "     <tr id='" + RowId + "' data-id='" + IdClienteColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-idtipocolor = '" + IdTipoColor + "' >";
        cadenaHtml += "         <td style='text-align:center;vertical-align: middle;'><a onclick='eliminarColorMatriz(this);' class='btn btn-danger btn-sm' data-id='" + IdClienteColor + "' data-type='" + IdTipoColor + "' tabindex='-1' href='javascript:void(0)'><i class='fa fa-remove'></i></a></td>";
        cadenaHtml += "         <td class='text-center' data-id='" + IdTipoColor + "'>" + NombreTipoColor + "</td>";
        cadenaHtml += "         <td class='text-center' data-id='" + IdClienteColor + "'>" + NombreClienteColor + "</td>";
        cadenaHtml += `         <td class='text-center' data-id='${IdClienteColor}'>`;
        cadenaHtml += `             <input type='date' class='_datepicker' data-date="" data-date-format="MM/DD/YYYY" value=${valorwip} />`;
        //cadenaHtml += `             <div class="input-group date _datepicker">`;
        //cadenaHtml += `                 <input type="text" class="form-control date _wipmodal" />`;
        //cadenaHtml += `                     <div class="input-group-addon">`;
        //cadenaHtml += `                         <i class="fa fa-calendar"></i>`;
        //cadenaHtml += `                     </div>`;
        //cadenaHtml += `             </div>`
        cadenaHtml += `         </td>`;
        cadenaHtml += "         <td class='text-center' style='vertical-align: middle;'><div class='_subtotal_principal_popup'>0</div></td>";

        for (k = 0; k < totalTallas; k++) {
            listaColumnasTallasTemp = [];
            listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
                return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
            });

            if (listaColumnasTallasTemp.length > 0) {
                contador++;
                //IdTallaCliente = listaIdColumnasTallas[i].IdClienteTalla;
                IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                listaTallaColorTemp = [];
                listaTallaColorTemp = listaTallaColor.filter(function (el) {
                    return el.idclientetalla == IdTallaCliente && el.idclientecolor == IdClienteColor;
                });

                if (listaTallaColorTemp.length > 0) {
                    cantidad = listaTallaColorTemp[0].cantidad;
                    IdTipoColor = listaTallaColorTemp[0].idtipocolor;
                    registroExistente = listaTallaColorTemp[0].registroexistente;
                    idPoClienteEstiloTallaColor = listaTallaColorTemp[0].idpoclienteestilotallacolor;
                    idpoclienteestilodestinotallacolor = listaTallaColorTemp[0].idpoclienteestilodestinotallacolor
                } else {
                    cantidad = 0;
                    IdTipoColor = IdTipoColor;
                    registroExistente = 0;
                    idPoClienteEstiloTallaColor = 0;
                    idpoclienteestilodestinotallacolor = 0;
                }
                //class='col-sm-1'
                cadenaHtml += "         <td><input style='height: 100% !important;' data-color='" + IdClienteColor + "' data-size='" + IdTallaCliente + "' data-idtipocolor = '" + IdTipoColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-registroexistente = '" + registroExistente + "' data-idpoclienteestilodestino = '" + idPoClienteEstiloDestino + "' data-idpoclienteestilodestinotallacolor = '" + idpoclienteestilodestinotallacolor + "' class='form-control MatrizDetailPopup text-center' type='text' onkeyup='contarCantidades()' value='" + cantidad + "' ></td>";  // onkeypress='return PoJS.DigitimosEnteros(event, this)'
            }
            if (contador == columnas) {
                break;
            }
        }

        cadenaHtml += "     </tr>";

    }
    cadenaHtml += "</tbody>";
    cadenaHtml += "</table>";

    listaTallaColorTemp = null;

    //$("#divMatrizTallaColor").html(cadenaHtml)
    $("#divHijoMatrizTallaColor_Popup").html(cadenaHtml);

    // handler fechas wip
    crearhandlermodaltallacolor();

    // VERIFICAR LOS COMBOS SELECCIONADOS
    llenarComboTallaClienteTemporal(listaIdColumnasTallas, columnas);  //popupTallaColorPorDestino.llenarComboTallaClienteTemporal
    llenarComboColorClienteTemporal(listaIdFilasColor, filas, listaGrupoTipoColorTemp);  // popupTallaColorPorDestino.llenarComboColorClienteTemporal
    i = null;
    k = null;
    j = null;

    // GENERAR SUBTOTALES
    //popupTallaColorPorDestino.generarTablaSubTotalesTallaColor();
    contarCantidades();  
}

function llenarComboTallaClienteTemporal(listaIdColumnasTallas, columnas) {
    "use strict";
    // VERIFICAR LOS COMBOS SELECCIONADOS
    var listaLi = $("#divCboClienteTalla").find("ul").find("li"), idTallaClienteCombo = 0, totalListaLi = 0,
        botonCombo = $("#divCboClienteTalla").find("button").find("span"), arrayNombreTalla = [], IdTallaCliente = 0, i = 0,
        j = 0, nombreTallaCombo = "";

    totalListaLi = listaLi.length;
    for (i = 0; i < columnas; i++) {
        IdTallaCliente = listaIdColumnasTallas[i].idclientetalla;

        for (j = 1; j < totalListaLi; j++) {
            idTallaClienteCombo = listaLi[j].children[0].children[0].children[0].value;
            if (IdTallaCliente == idTallaClienteCombo) {
                listaLi.eq(j).addClass("active");
                listaLi[j].children[0].children[0].children[0].checked = true;
                arrayNombreTalla.push(listaLi[j].textContent);
                break;
            }
        }
    }
    nombreTallaCombo = arrayNombreTalla.toString();
    botonCombo.text(nombreTallaCombo);
}

function llenarComboColorClienteTemporal(listaIdFilasColor, filas, listaGrupoTipoColor) {
    "use strict";
    
    // VERIFICAR LOS COMBOS SELECCIONADOS
    var listaLi = $("#divCboClienteColor").find("ul").find("li"), idColorClienteCombo = 0, totalListaLi = 0,
        botonCombo = $("#divCboClienteColor").find("button").find("span"), arrayNombreColor = [], IdColorCliente = 0, i = 0,
        j = 0, nombreColorCombo = "", totalGrupoTipoColor = 0, cboTipoColor = $("#cboTipoColor"), IdTipoColor = 0;

    totalGrupoTipoColor = listaGrupoTipoColor.length;

    if (totalGrupoTipoColor == 1) {
        IdTipoColor = listaGrupoTipoColor[0].idtipocolor;
        cboTipoColor.val(IdTipoColor);
        $("#cboTipoColor").trigger("change");

    } else {
        cboTipoColor[0].options[0].selected = true;
        $("#cboTipoColor").trigger("change");
    }

}

function actualizarCantidadEnTablaDestinos(pIdPoClienteEstiloDestino) {
    "use strict";
        
    var tablaDestinos = $("#tbodyClienteDireccionDestino")[0], totalFilas = tablaDestinos.rows.length, i = 0, idPoClienteEstiloDestinoGrid = 0, totalCantidad = 0;

    totalCantidad = calcularCantidadTallaColorByIdPoClienteEstiloDestino(pIdPoClienteEstiloDestino);  // PoJS.calcularCantidadTallaColorByIdPoClienteEstiloDestino

    if (totalFilas > 0) {
        for (i = 0; i < totalFilas; i++) {
            idPoClienteEstiloDestinoGrid = $.trim(tablaDestinos.rows[i].cells[1].children[0].children[0].value);
            if (pIdPoClienteEstiloDestino == idPoClienteEstiloDestinoGrid) {
                tablaDestinos.rows[i].cells[2].children[0].value = totalCantidad;
                break;
            }
        }
    }
}

function calcularCantidadTallaColorByIdPoClienteEstiloDestino(idPoClienteEstiloDestino) {
    var listaTeporal = obtenerListaFromListaTempGeneralTallaColor(idPoClienteEstiloDestino), i = 0, totalCantidad = 0;  // PoJS.obtenerListaFromListaTempGeneralTallaColor(idPoClienteEstiloDestino)

    if (listaTeporal.length > 0) {
        for (i = 0; i < listaTeporal.length; i++) {
            if (!isNaN(parseInt(listaTeporal[i].cantidad))) {
                totalCantidad = parseInt(totalCantidad) + parseInt(listaTeporal[i].cantidad)
            }
        }
    }

    return totalCantidad;
}

function obtenerListaFromListaTempGeneralTallaColor(pIdPoClienteEstiloDestino) {
    "use strict";
        
    var tablaDestinos = $("#tbodyClienteDireccionDestino"), totalFilasDestino = tablaDestinos[0].rows.length, i = 0, j = 0, idPoClienteEstiloDestino = 0,
        listaTempTallaColor = [], listaTempTallaColorFiltrada = [];

    if (pIdPoClienteEstiloDestino == undefined) {
        if (totalFilasDestino > 0) {
            for (i = 0; i < totalFilasDestino; i++) {
                idPoClienteEstiloDestino = tablaDestinos[0].rows[i].cells[1].children[0].children[0].value;
                listaTempTallaColorFiltrada = [];
                listaTempTallaColorFiltrada = ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.filter(function (el) {
                    return parseInt(el.idpoclienteestilodestino) == parseInt(idPoClienteEstiloDestino);
                });

                if (listaTempTallaColorFiltrada.length > 0) {
                    for (j = 0; j < listaTempTallaColorFiltrada.length; j++) {
                        listaTempTallaColor.push(listaTempTallaColorFiltrada[j]);
                    }

                }
            }
        }
    } else {
        listaTempTallaColorFiltrada = ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.filter(function (el) {
            return el.idpoclienteestilodestino == pIdPoClienteEstiloDestino;
        });

        if (listaTempTallaColorFiltrada.length > 0) {
            for (j = 0; j < listaTempTallaColorFiltrada.length; j++) {
                listaTempTallaColor.push(listaTempTallaColorFiltrada[j]);
            }

        }
    }

    return listaTempTallaColor;
}

function GroupBy(array, fields) {
    var Fields = fields.split(','), FieldsLen = Fields.length, ArrayLen = array.length,
        Group = new Array(), GroupLen = 0, Existe = false, cont = 0, i = 0, x = 0, z = 0;

    for (i = 0; i < ArrayLen; i++) {

        var RowObj = array[i];
        var Obj = {}

        if (i == 0) {
            for (x = 0; x < FieldsLen; x++) {
                Obj[Fields[x]] = RowObj[Fields[x]];
            }
            Group.push(Obj);

        } else {
            for (x = 0; x < FieldsLen; x++) {
                Obj[Fields[x]] = RowObj[Fields[x]];
            }
            GroupLen = Group.length;

            for (z = 0; z < GroupLen; z++) {
                var GroupRowObj = Group[z];
                cont = 0;
                for (x = 0; x < FieldsLen; x++) {
                    if (Obj[Fields[x]] == GroupRowObj[Fields[x]]) {
                        Existe = true;
                        cont++;
                    } else {
                        Existe = false;
                    }
                }
                if (Existe && FieldsLen == cont) {
                    break;
                } else {
                    Existe = false;
                }
            }
            if (!Existe) {
                Group.push(Obj);
            }
        }

    }
    i = null;
    x = null;
    z = null;
    return Group;
}

function contarCantidadesSimple() {
    var Cantidad = 0, valorCantidad = 0, tabla = _('tbodyClienteDireccionDestino'), arrtxt = _Array(tabla.getElementsByClassName('_inputtrcantidadrequerida'));

    arrtxt.forEach(function (txt, index) {
        valorCantidad = txt.value;
        if (!$.isNumeric(valorCantidad)) {
            valorCantidad = 0;
        }
        Cantidad += parseInt(valorCantidad);
    });
    $("#txtCantidadRequerida").val(Cantidad);
}

// :edu CREAR LA GRILLA INFERIOR POCLIENTE ESTILO TALLACOLOR
function generarTablaMatrizTallaColor_principal() { // NOTA: LA TABLA POCLIENTEESTILOTALLACOLOR SIEMPRE SE VA A GENERAR YA QUE DEPENDE DE LA LISTA GENERAL DE TALLACOLORDESTINO
        "use strict";
        
        var cadenaHtml = "", cboClienteTalla = $("#cboClienteTalla"), cboClienteColor = $("#cboClienteColor"), totalTallasCombo = 0, totalColorCombo = 0, i = 0, j = 0,
            k = 0, IdTallaCliente = 0, nombreTallaCombo = "", RowId = "", IdClienteColor = 0, IdTipoColor = 0, NombreTipoColor = "", NombreClienteColor = "",
            dataTallaColorFiltrada = {}, listaTallaColorTemp = [], cantidad = 0, IdCliente = $("#cboClientePo").val(), cboTipoColor = $("#cboTipoColor"),
            indexTipoColor = 0, totalTallas = 0, listaColumnasTallasTemp = [], contador = 0, registroExistente = 0, idPoClienteEstiloTallaColor = 0, columnas = 0, filas = 0,
            m = 0, listaTallaColor = [], listaIdFilasColor = [], listaIdColumnasTallas = [];

        //$("#divMatrizTallaColor").html('');
        //$("#divHijoMatrizTallaColor").html('');

        listaTallaColor = obtenerListaFromListaTempGeneralTallaColor();

        if (listaTallaColor.length > 0) {
            $("#divHijoMatrizTallaColor").html('');
            listaIdFilasColor = GroupBy(listaTallaColor, 'idclientecolor');  // PARA LAS FILAS
            listaIdColumnasTallas = GroupBy(listaTallaColor, 'idclientetalla');  // PARA LAS COLUMNAS
            columnas = listaIdColumnasTallas.length;
            filas = listaIdFilasColor.length;

            IdTipoColor = listaTallaColor[0].idtipocolor;

            //cargarComboTalla();  // ver si sirve

            cadenaHtml += "<table id='tblMatrizTallaColor' class='table table-bordered table-fixed'>";  //table table-bordered table-fixed
            cadenaHtml += "<thead id='theadMatrizTallaColor'>";
            cadenaHtml += " <tr>";
            cadenaHtml += "     <th class='text-center' width='1'></th>"; // width = '50'
            cadenaHtml += "     <th class='text-center' width='200'>Color Type</th>";
            cadenaHtml += "     <th class='text-center' width='300'>Color</th>";
            cadenaHtml += "     <th class='text-center' width='200'>Wip</th>";
            cadenaHtml += "     <th class='text-center' width='50'>SubTotal</th>";

            //totalTallasCombo = cboClienteTalla[0].options.length;
            // CABECERA
            totalTallas = ovariables.clientetallajson.length; //Talla.length;

            for (k = 0; k < totalTallas; k++) {
                listaColumnasTallasTemp = [];
                listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
                    return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                });

                if (listaColumnasTallasTemp.length > 0) {
                    contador++;
                    IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                    nombreTallaCombo = $.trim(ovariables.clientetallajson[k].nombreclientetalla);  // $.trim(Talla[k].NombreClienteTalla);
                    cadenaHtml += "     <th data-size='" + IdTallaCliente + "' class='text-center col-sm-1'>" + nombreTallaCombo + "</th>"; // width='300'
                }
                if (contador == columnas) {
                    break;
                }
            }

            cadenaHtml += " </tr>";
            cadenaHtml += "</thead>";
            cadenaHtml += "<tbody id='tbdoyMatrizTallaColor'>";

            // FILAS
            //totalColorCombo = cboClienteColor[0].options.length;
            contador = 0;
            for (i = 0; i < filas; i++) {
                contador = 0;
                IdClienteColor = listaIdFilasColor[i].idclientecolor;
                RowId = "rowColor" + IdClienteColor;

                listaTallaColorTemp = [];
                listaTallaColorTemp = listaTallaColor.filter(function (el) {
                    return el.idclientecolor == IdClienteColor;
                });

                NombreClienteColor = listaTallaColorTemp[0].nombreclientecolor;
                NombreTipoColor = listaTallaColorTemp[0].nombretipocolor;
                IdTipoColor = listaTallaColorTemp[0].idtipocolor;

                // :edu de esta lista obtener el grupo de fechas wip
                let listawiptemp = GroupBy(listaTallaColorTemp, 'wip'), cadenawip = '', totallistawip = listawiptemp.length, contadorwip = 0;
                if (totallistawip > 1) {
                    // fechas distintas
                    for (let j = 0; j < totallistawip; j++) {
                        contadorwip++;
                        if (contadorwip < totallistawip) {
                            cadenawip += listawiptemp[j].wip + " / ";
                        } else {
                            cadenawip += listawiptemp[j].wip;
                        }
                    }
                } else {
                    cadenawip = listaTallaColorTemp[0].wip;
                }

                cadenaHtml += "     <tr id='" + RowId + "' data-id='" + IdClienteColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "'>";
                //cadenaHtml += "         <td style='text-align:center;vertical-align: middle;'><a onclick='PoJS.EliminarColorMatriz(this);' data-id='" + IdClienteColor + "' data-type='" + IdTipoColor + "' tabindex='-1' href='javascript:void(0)'><i class='glyphicon glyphicon-remove'></i></a></td>";
                cadenaHtml += "         <td></td>";
                cadenaHtml += "         <td class='text-center' data-id='" + IdTipoColor + "'>" + NombreTipoColor + "</td>";
                cadenaHtml += "         <td class='text-center' data-id='" + IdClienteColor + "'>" + NombreClienteColor + "</td>";
                cadenaHtml += "         <td class='text-center'>" + cadenawip + "</td>";
                cadenaHtml += "         <td class='text-center'><div class='_subtotal_principal'>0</div></td>";

                for (k = 0; k < totalTallas; k++) {
                    cantidad = 0;
                    listaColumnasTallasTemp = [];
                    listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
                        return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                    });

                    if (listaColumnasTallasTemp.length > 0) {
                        contador++;
                        //IdTallaCliente = listaIdColumnasTallas[i].IdClienteTalla;
                        IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                        listaTallaColorTemp = [];
                        listaTallaColorTemp = listaTallaColor.filter(function (el) {
                            return el.idclientetalla == IdTallaCliente && el.idclientecolor == IdClienteColor;
                        });

                        if (listaTallaColorTemp.length > 1) {
                            for (m = 0; m < listaTallaColorTemp.length; m++) {
                                cantidad = parseInt(cantidad) + parseInt(listaTallaColorTemp[m].cantidad);
                            }
                            IdTipoColor = listaTallaColorTemp[0].idtipocolor;
                            registroExistente = 0; //listaTallaColorTemp[0].RegistroExistente;
                            idPoClienteEstiloTallaColor = 0; //listaTallaColorTemp[0].IdPoClienteEstiloTallaColor;
                        }
                        else if (listaTallaColorTemp.length == 1) {
                            cantidad = listaTallaColorTemp[0].cantidad;
                            IdTipoColor = listaTallaColorTemp[0].idtipocolor;
                            registroExistente = 0;
                            idPoClienteEstiloTallaColor = 0;
                        } else {
                            cantidad = 0;
                            IdTipoColor = IdTipoColor;
                            registroExistente = 0;
                            idPoClienteEstiloTallaColor = 0;
                        }

                        cadenaHtml += "         <td class='col-sm-1'><input style='height: 100% !important;' data-color='" + IdClienteColor + "' data-size='" + IdTallaCliente + "' data-idtipocolor = '" + IdTipoColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-registroexistente = '" + registroExistente + "' data-idpoclienteestilotallacolor = '" + idPoClienteEstiloTallaColor + "' class='form-control MatrizDetail text-center' type='text' value='" + cantidad + "' disabled='' ></td>";  // onkeyup='PoJS.ContarCantidades()' onkeypress='return PoJS.DigitimosEnteros(event, this)'
                    }
                    if (contador == columnas) {
                        break;
                    }
                }

                cadenaHtml += "     </tr>";

            }
            cadenaHtml += "</tbody>";
            cadenaHtml += "</table>";

            listaTallaColorTemp = null;

            $("#divHijoMatrizTallaColor").html(cadenaHtml)
            generarTablaSubTotalesTallaColor_principal();  // PoJS.generarTablaSubTotalesTallaColor ya no va
        } else {
            limpiarMatrizTablaTallaColor_VentanaPrincipal();
            generarTablaSubTotalesTallaColor_principal();  // PoJS.generarTablaSubTotalesTallaColor ya no va
        }
    
        i = null;
        k = null;
        j = null;
    
}

function generarTablaSubTotalesTallaColor_principal() {
    "use strict";
        
    $("#tbodyTallaColorSubTotalFila").html('');
    $("#tbodyTallaColorSubTotalColumna").html('');
    var tieneTallaColor = 0, tablaCabecera = $("#theadMatrizTallaColor"), totalFilaCabecera = $("#theadMatrizTallaColor > tr").length,
        totalColumnas = 0, tablaTallaColor = $("#tbdoyMatrizTallaColor"), totalFilaCantidad = $("#tbdoyMatrizTallaColor > tr").length,
        tablaSubTotalFila = $("#tbodyTallaColorSubTotalFila"),
        i = 0, j = 0, idTallaColor = '', idClienteColor = 0, existeColumaTalla = false, posicionInicioTalla = 0, contarColumnasTallaColor = 0, contarFilasTallaColor = 0, cadenaHtml = '', valorCantidad = 0,
        listaCantidadPorIdTalla = [], listaIdClienteColorUnicos = [], dataCantidadPorIdTalla = {}, listaIdTallaColorUnicos = [], listaTemporal = [], cantidadListaTemporal = 0, valorSumaCantidad = 0,
        totalFilasSubTotalInferior = 0, anchoColumna = 0, altoFila = 0, listaAnchoColumnas = [], dataAnchoColumnas = {};

    if (totalFilaCabecera > 0) {
        totalColumnas = tablaCabecera[0].rows[0].cells.length;
        for (i = 0; i < totalColumnas; i++) {
            idTallaColor = tablaCabecera[0].rows[0].cells[i].getAttribute('data-size');
            anchoColumna = tablaCabecera[0].rows[0].cells[i].clientWidth;

            dataAnchoColumnas = {};
            dataAnchoColumnas.IndiceColumna = i;
            dataAnchoColumnas.Ancho = anchoColumna;
            listaAnchoColumnas.push(dataAnchoColumnas);
            if (idTallaColor != null) {
                contarColumnasTallaColor++;
                existeColumaTalla = true;
                listaIdTallaColorUnicos.push(idTallaColor);
                if (contarColumnasTallaColor == 1) {
                    posicionInicioTalla = i;
                }
            }
        }
    }

    //altoFila = tablaCabecera[0].rows[0].cells[posicionInicioTalla].clientHeight;
    if (totalFilaCantidad > 0) {
        altoFila = tablaTallaColor[0].rows[0].clientHeight;
    } else {
        altoFila = 32
    }

    for (i = 0; i < totalFilaCantidad; i++) {
        for (j = 0; j < totalColumnas; j++) {
            try {
                idClienteColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-color');
                if (idClienteColor != null) {
                    contarFilasTallaColor++;
                    listaIdClienteColorUnicos.push(idClienteColor);
                    break;
                }
            } catch (e) {

            }
        }
    }

    if (totalFilaCantidad > 0) {
        for (i = 0; i < totalFilaCantidad; i++) {
            for (j = 0; j < totalColumnas; j++) {
                dataCantidadPorIdTalla = {};
                try {
                    idTallaColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-size');
                    idClienteColor = tablaTallaColor[0].rows[i].cells[j].children[0].getAttribute('data-color');
                    if (idTallaColor != null) {
                        valorCantidad = tablaTallaColor[0].rows[i].cells[j].children[0].value;
                        dataCantidadPorIdTalla.idtallacliente = idTallaColor;
                        dataCantidadPorIdTalla.idclientecolor = idClienteColor;
                        dataCantidadPorIdTalla.cantidad = valorCantidad;

                        listaCantidadPorIdTalla.push(dataCantidadPorIdTalla);
                    }
                } catch (e) {

                }

            }
        }
    }

    // :subtotal columna; PARA LA TABLA INFERIOR SUMA PARA LAS COLUMNAS
    cadenaHtml += `<tr>`;
    cadenaHtml += `     <td data-nocontar='1'></td>`;  // vacio
    cadenaHtml += `     <td data-nocontar='1'></td>`;  // 
    cadenaHtml += `     <td data-nocontar='1'></td>`; // color
    cadenaHtml += `     <td data-nocontar='1'></td>`; // wip
    cadenaHtml += `     <td data-nocontar='1' class='text-center'><div class='_subtotal_total'></div></td>`;  //  subtotal

    for (i = 0; i < contarColumnasTallaColor; i++) {
        valorSumaCantidad = 0;
        idTallaColor = listaIdTallaColorUnicos[i];

        listaTemporal = listaCantidadPorIdTalla.filter(function (el) {
            return el.idtallacliente == idTallaColor;
        });

        cantidadListaTemporal = listaTemporal.length;
        if (cantidadListaTemporal > 0) {
            // calcular suma
            for (j = 0; j < cantidadListaTemporal; j++) {
                if (!isNaN(parseInt(listaTemporal[j].cantidad))) {
                    valorSumaCantidad += parseInt(listaTemporal[j].cantidad);
                }
            }
        }

        cadenaHtml += `     <td class="text-center col-sm-1" style="vertical-align: middle;" data-nocontar='0'>`;  //height="35"
        cadenaHtml += valorSumaCantidad;
        cadenaHtml += `     </td>`;
    }
    cadenaHtml += `</tr>`;

    $("#tbdoyMatrizTallaColor").append(cadenaHtml);  // tbodyTallaColorSubTotalFila

// activar inicio
    //// :subtotal fila; PARA LA TABLA A LA DERECHA SUMA PARA LAS FILAS
    
    let tblDestinos = _('tblMatrizTallaColor'), arrsubtotal = _Array(tblDestinos.getElementsByClassName('_subtotal_principal')), totalArrSubTotal = arrsubtotal.length;
    if (contarFilasTallaColor > 0) {
        for (i = 0; i < contarFilasTallaColor; i++) {
            //cadenaHtml += '<tr>';
            //if (totalArrSubTotal > 0) {
            //    for (let j = 0; j < totalArrSubTotal; j++) {
            //        if (j == i) {
            //            miDiv = $(arrsubtotal);
            //        }
            //    }
            //}
            
            valorSumaCantidad = 0;
            idClienteColor = listaIdClienteColorUnicos[i];

            listaTemporal = listaCantidadPorIdTalla.filter(function (el) {
                return el.idclientecolor == idClienteColor;
            });

            cantidadListaTemporal = listaTemporal.length;
            if (cantidadListaTemporal > 0) {
                // calcular suma
                for (j = 0; j < cantidadListaTemporal; j++) {
                    if (!isNaN(parseInt(listaTemporal[j].cantidad))) {
                        valorSumaCantidad += parseInt(listaTemporal[j].cantidad);
                    }

                }
            }

            arrsubtotal[i].innerText = valorSumaCantidad;
            //cadenaHtml += '     <td class="text-center" style="vertical-align: middle;" width="50" height=\"' + altoFila + '\">';  // height="35"
            //cadenaHtml += valorSumaCantidad;
            //cadenaHtml += '     </td>';
            //cadenaHtml += '</tr>';
        }
    } else {
        //for (i = 0; i < totalFilaCantidad; i++) {
        //    cadenaHtml += '<tr>';
        //    cadenaHtml += '     <td class="text-center" style="vertical-align: middle;" width="50" height=\"' + altoFila + '\">';  // height="35"
        //    cadenaHtml += 0;
        //    cadenaHtml += '     </td>';
        //    cadenaHtml += '</tr>';
        //}
    }

    arrsubtotal = _Array(tblDestinos.getElementsByClassName('_subtotal_principal'));
    totalArrSubTotal = arrsubtotal.length;
    let totalsubtotal_general = 0;
    arrsubtotal.forEach(function (div, index) {
        totalsubtotal_general += parseInt(div.innerText);
    });

    let subtotal_total = tblDestinos.getElementsByClassName('_subtotal_total');
    subtotal_total[0].innerText = totalsubtotal_general;

    //valorSumaCantidad = 0;
    //totalFilasSubTotalInferior = $("#tbodyTallaColorSubTotalFila > tr").length;
    //if (totalFilasSubTotalInferior > 0) {
    //    for (i = 0; i < totalColumnas; i++) {
    //        let attrContar = tablaSubTotalFila[0].rows[0].cells[i].getAttribute('data-nocontar');
    //        if (attrContar == 0) {
    //            valorCantidad = tablaSubTotalFila[0].rows[0].cells[i].innerText;
    //            if ($.isNumeric(valorCantidad)) {
    //                if (!isNaN(parseInt(tablaSubTotalFila[0].rows[0].cells[i].innerText))) {
    //                    valorSumaCantidad += parseInt(tablaSubTotalFila[0].rows[0].cells[i].innerText);
    //                }
    //            }
    //        }
            
    //    }

    //    cadenaHtml += '<tr>';
    //    cadenaHtml += '     <td class="text-center" style="vertical-align: middle;" width="50" height=\"' + altoFila + '\">'; // height = "35"
    //    cadenaHtml += valorSumaCantidad;
    //    cadenaHtml += '     </td>';
    //    cadenaHtml += '</tr>';
    //}

    //$("#tbodyTallaColorSubTotalColumna").html(cadenaHtml);

// activar fin

    i = null;
    listaTemporal = null;
    cantidadListaTemporal = null;
    valorSumaCantidad = null;
    totalFilasSubTotalInferior = null;
    tablaSubTotalFila = null;
    listaAnchoColumnas = null;
    dataAnchoColumnas = null;
}

function limpiarMatrizTablaTallaColor_VentanaPrincipal() {
    $("#theadMatrizTallaColor").html('');
    $("#tbdoyMatrizTallaColor").html('');
    cadenaHtml = "<tr>";
    cadenaHtml += "  <th class='text-center' width='50'></th>";
    cadenaHtml += "  <th class='text-center' width='200'>Color Type</th>";
    cadenaHtml += "  <th class='text-center' width='300'>Color</th>";
    cadenaHtml += "  <th class='text-center' width='50'>SubTotal</th>";
    cadenaHtml += "</tr>";
    $("#theadMatrizTallaColor").html(cadenaHtml);

    $("#txtCantidadRequerida").val("");  // AL LIMPIAR LA TALLACOLOR SE DEBE LIMPIAR EL CAMPO DE CANTIDAD REQUERIDA
}

function eliminarItemPoClienteEstiloDestinoTallaColor() {  // eliminarItemPoClienteEstiloDestinoTallaColorByIdPoClienteEstiloDestino
    if (ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.length > 0) {  // PoJS.listaTemporalGeneralPoClienteEstiloDestinoTallaColor
        generarTablaMatrizTallaColor_principal();  // PoJS.generarTablaMatrizTallaColor();
    } else {
        limpiarMatrizTablaTallaColor_VentanaPrincipal(); // PoJS.limpiarMatrizTablaTallaColor_VentanaPrincipal();
        generarTablaSubTotalesTallaColor_principal();  // PoJS.generarTablaSubTotalesTallaColor();
    }

    contarCantidadesSimple();  // PoJS.ContarCantidadesSimple();
}

function generartabladestinos_cantidadrequeridadiferentes(idpoclienteproducto, listapoclienteproductodestino) {
    let cadenahtml = '', totalfilas = listapoclienteproductodestino.length, i = 0;

    if (totalfilas > 0) {
        $("#tbodyClienteDireccionDestino").html('');
        for (i = 0; i < totalfilas; i++) {
            cadenahtml = '';
            cadenahtml += `<tr data-idpoclienteestilodestino='${listapoclienteproductodestino[i].idpoclienteproductodestino}'>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <a id="aEliminarClienteDireccionDestino" name="aEliminarClienteDireccionDestino" data-idpoclienteestilodestino = ' ${listapoclienteproductodestino[i].idpoclienteproductodestino}' class="fa fa-remove punteromouse btn btn-danger btn-sm" title="delete"></a>`;
            cadenahtml += `         <a href="javascript:void(0)" class="fa fa-plus-circle btn btn-info btn-sm _tallacolor" title="add color size" data-idpoclientedestino='${listapoclienteproductodestino[i].idpoclienteproductodestino}'></a>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <div style="display: none;">`;
            cadenahtml += `             <input id="txtIdPoClienteEstiloDestinoGrid" value=' ${listapoclienteproductodestino[i].idpoclienteproductodestino}' />`;
            cadenahtml += `         </div>`;
            cadenahtml += `         <select class="form-control _combodireccion" id="cboClienteDireccionDestino" name="cboClienteDireccionDestino">`;
            cadenahtml += `         </select>`;
            cadenahtml += `     </td>`;
            cadenahtml += `     <td style="vertical-align: middle; text-align: center">`;
            cadenahtml += `         <input class="form-control text-center _inputtrcantidadrequerida" name="txtcantidadrequeridaclientedireccion" value='0' disabled placeholder='${listapoclienteproductodestino[i].cantidadrequerida}' />`; // onkeypress="return pojs.digitimosenteros(event, this)"
            cadenahtml += `     </td>`;
            cadenahtml += `</tr>`;

            $("#tbodyClienteDireccionDestino").append(cadenahtml);
            cargarcomboclientedirecciondestino(i, listapoclienteproductodestino[i].idclientedireccion);
            crearhandlerparagridclientedestino();
        }
        autonumericcantidadrequeridatabla();
    }

}

// :edu modaltallacolor
function generarTablaMatrizTallaColor_modaltallacolor_cantidadrequeridadiferentes() {
    "use strict";
    var listaTallaColor = [], listaIdFilasColor = [], listaIdColumnasTallas = [],
        listaGrupoTipoColorTemp = [], columnas = 0, filas = 0, idPoClienteEstiloDestino = $("#hf_IdPoClienteEstiloDestino_PopupTallaColor").val();

    listaTallaColor = ovariables.listaTemporalGeneralPoClienteEstiloDestinoTallaColor.filter(function (el) {
        return el.idpoclienteestilodestino == idPoClienteEstiloDestino;
    })

    listaIdFilasColor = GroupBy(listaTallaColor, 'idclientecolor');  // PARA LAS FILAS
    listaIdColumnasTallas = GroupBy(listaTallaColor, 'idclientetalla');  // PARA LAS COLUMNAS
    listaGrupoTipoColorTemp = GroupBy(listaTallaColor, 'idtipocolor');
    filas = listaIdFilasColor.length;
    columnas = listaIdColumnasTallas.length;

    var cadenaHtml = "", cboClienteTalla = $("#cboClienteTalla"), cboClienteColor = $("#cboClienteColor"), totalTallasCombo = 0, totalColorCombo = 0, i = 0, j = 0,
        k = 0, IdTallaCliente = 0, nombreTallaCombo = "", RowId = "", IdClienteColor = 0, IdTipoColor = 0, NombreTipoColor = "", NombreClienteColor = "",
        dataTallaColorFiltrada = {}, listaTallaColorTemp = [], cantidad = 0, IdCliente = $("#cboClientePo").val(), cboTipoColor = $("#cboTipoColor"),
        indexTipoColor = 0, totalTallas = 0, listaColumnasTallasTemp = [], contador = 0, registroExistente = 0, idPoClienteEstiloTallaColor = 0, idpoclienteestilodestinotallacolor = 0,
            valorwip = '';

    //$("#divMatrizTallaColor").html('');
    $("#divHijoMatrizTallaColor_Popup").html('');

    IdTipoColor = listaTallaColor[0].idtipocolor;

    cargarComboClienteTalla();


    cadenaHtml += "<table id='tblMatrizTallaColor_Popup' class='table table-bordered table-fixed'>";  //table table-bordered table-fixed
    cadenaHtml += "<thead id='theadMatrizTallaColor_Popup'>";
    cadenaHtml += " <tr>";
    cadenaHtml += "     <th class='text-center' width='50'></th>";
    cadenaHtml += "     <th class='text-center' width='200'>Color Type</th>";
    cadenaHtml += "     <th class='text-center' width='300'>Color</th>";
    cadenaHtml += "     <th class='text-center' width='200'>Wip</th>";
    cadenaHtml += "     <th class='text-center' width='50'>SubTotal</th>";

    totalTallasCombo = cboClienteTalla[0].options.length;
    // CABECERA
    totalTallas = ovariables.clientetallajson.length; //Talla.length;

    for (k = 0; k < totalTallas; k++) {
        listaColumnasTallasTemp = [];
        listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
            return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
        });

        if (listaColumnasTallasTemp.length > 0) {
            contador++;
            //IdTallaCliente = listaIdColumnasTallas[i].IdClienteTalla;
            IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
            nombreTallaCombo = $.trim(ovariables.clientetallajson[k].nombreclientetalla); //$.trim(Talla[k].NombreClienteTalla);
            cadenaHtml += "     <th data-size='" + IdTallaCliente + "' class='text-center col-sm-1'>" + nombreTallaCombo + "</th>"; // width='300'
        }
        if (contador == columnas) {
            break;
        }
    }

    cadenaHtml += " </tr>";
    cadenaHtml += "</thead>";
    cadenaHtml += "<tbody id='tbdoyMatrizTallaColor_Popup'>";

    // FILAS
    //totalColorCombo = cboClienteColor[0].options.length;
    contador = 0;
    for (i = 0; i < filas; i++) {
        contador = 0;
        IdClienteColor = listaIdFilasColor[i].idclientecolor;
        RowId = "rowColorPopup" + IdClienteColor;

        listaTallaColorTemp = [];
        listaTallaColorTemp = listaTallaColor.filter(function (el) {
            return el.idclientecolor == IdClienteColor;
        });

        NombreClienteColor = listaTallaColorTemp[0].nombreclientecolor;
        NombreTipoColor = listaTallaColorTemp[0].nombretipocolor;
        IdTipoColor = listaTallaColorTemp[0].idtipocolor;
        valorwip = listaTallaColorTemp[0].wip;

        cadenaHtml += "     <tr id='" + RowId + "' data-id='" + IdClienteColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-idtipocolor = '" + IdTipoColor + "' >";
        cadenaHtml += "         <td style='text-align:center;vertical-align: middle;'><a onclick='eliminarColorMatriz(this);' class='btn btn-danger btn-sm' data-id='" + IdClienteColor + "' data-type='" + IdTipoColor + "' tabindex='-1' href='javascript:void(0)'><i class='fa fa-remove'></i></a></td>";
        cadenaHtml += "         <td class='text-center' data-id='" + IdTipoColor + "'>" + NombreTipoColor + "</td>";
        cadenaHtml += "         <td class='text-center' data-id='" + IdClienteColor + "'>" + NombreClienteColor + "</td>";
        cadenaHtml += `         <td class='text-center' data-id='${IdClienteColor}'>`;
        cadenaHtml += `             <input type='date' class='_datapicker' data-date="" data-date-format="MM/DD/YYYY" ${valorwip} />`;
        //cadenaHtml += `             <div class="input-group date _datepicker">`;
        //cadenaHtml += `                 <input type="text" class="form-control date _wipmodal" />`;
        //cadenaHtml += `                     <div class="input-group-addon">`;
        //cadenaHtml += `                         <i class="fa fa-calendar"></i>`;
        //cadenaHtml += `                     </div>`;
        //cadenaHtml += `             </div>`
        cadenaHtml += `         </td>`;
        cadenaHtml += "         <td class='text-center' style='vertical-align: middle;'><div class='_subtotal_principal_popup'>0</div></td>";

        for (k = 0; k < totalTallas; k++) {
            listaColumnasTallasTemp = [];
            listaColumnasTallasTemp = listaIdColumnasTallas.filter(function (el) {
                return el.idclientetalla == ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
            });

            if (listaColumnasTallasTemp.length > 0) {
                contador++;
                //IdTallaCliente = listaIdColumnasTallas[i].IdClienteTalla;
                IdTallaCliente = ovariables.clientetallajson[k].idclientetalla; //Talla[k].IdClienteTalla;
                listaTallaColorTemp = [];
                listaTallaColorTemp = listaTallaColor.filter(function (el) {
                    return el.idclientetalla == IdTallaCliente && el.idclientecolor == IdClienteColor;
                });

                if (listaTallaColorTemp.length > 0) {
                    cantidad = listaTallaColorTemp[0].cantidad;
                    IdTipoColor = listaTallaColorTemp[0].idtipocolor;
                    registroExistente = listaTallaColorTemp[0].registroexistente;
                    idPoClienteEstiloTallaColor = listaTallaColorTemp[0].idpoclienteestilotallacolor;
                    idpoclienteestilodestinotallacolor = listaTallaColorTemp[0].idpoclienteestilodestinotallacolor
                } else {
                    cantidad = 0;
                    IdTipoColor = IdTipoColor;
                    registroExistente = 0;
                    idPoClienteEstiloTallaColor = 0;
                    idpoclienteestilodestinotallacolor = 0;
                }
                //class='col-sm-1'
                cadenaHtml += "         <td><input style='height: 100% !important;' data-color='" + IdClienteColor + "' data-size='" + IdTallaCliente + "' data-idtipocolor = '" + IdTipoColor + "' data-nombrecolor = '" + NombreClienteColor + "' data-nombretipocolor = '" + NombreTipoColor + "' data-registroexistente = '" + registroExistente + "' data-idpoclienteestilodestino = '" + idPoClienteEstiloDestino + "' data-idpoclienteestilodestinotallacolor = '" + idpoclienteestilodestinotallacolor + "' class='form-control MatrizDetailPopup text-center' type='text' onkeyup='contarCantidades()' value='' placeholder='" + cantidad + "' ></td>";  // onkeypress='return PoJS.DigitimosEnteros(event, this)'
            }
            if (contador == columnas) {
                break;
            }
        }

        cadenaHtml += "     </tr>";

    }
    cadenaHtml += "</tbody>";
    cadenaHtml += "</table>";

    listaTallaColorTemp = null;

    //$("#divMatrizTallaColor").html(cadenaHtml)
    $("#divHijoMatrizTallaColor_Popup").html(cadenaHtml);

    // handler fechas wip
    crearhandlermodaltallacolor();

    // VERIFICAR LOS COMBOS SELECCIONADOS
    llenarComboTallaClienteTemporal(listaIdColumnasTallas, columnas);  //popupTallaColorPorDestino.llenarComboTallaClienteTemporal
    llenarComboColorClienteTemporal(listaIdFilasColor, filas, listaGrupoTipoColorTemp);  // popupTallaColorPorDestino.llenarComboColorClienteTemporal
    i = null;
    k = null;
    j = null;

    // GENERAR SUBTOTALES
    //popupTallaColorPorDestino.generarTablaSubTotalesTallaColor();
    contarCantidades();
}

// :edu modal talla color
function crearhandlermodaltallacolor()
{
    $("._datepicker").on("change", function () {
        this.setAttribute(
            "data-date",
            moment(this.value, "YYYY/MM/DD")
            .format(this.getAttribute("data-date-format"))
        )
    }).trigger("change")

    //$('#tblMatrizTallaColor_Popup tbody').on('focus', "._wipmodal", function () {
    //    $(this).datepicker({
    //        beforeShow: function () {
    //            $(this).css("z-index", "1000000000");
    //        },
    //        startView: 0,
    //        forceParse: true,
    //        autoclose: true,
    //        format: "dd/mm/yyyy",
    //        todayHighlight: true,
    //    });
    //});

    // activar luego si funciona
    //$('._datepicker').datepicker({
    //    beforeShow: function () {
    //        $(this).css("z-index", "1000000000 !important");
    //    },
    //    autoclose: true, dateFormat: 'mm/dd/yyyy'
    //});

    //let tabla = _('tblMatrizTallaColor_Popup'), arrfecha = _Array(tabla.getElementsByClassName('input-group date')),
    //    totalarray = arrfecha.length;
    //for (let i = 0; i < totalarray; i++) {
    //    $(arrfecha[i]).datepicker({
    //        autoclose: true, dateFormat: 'mm/dd/yyyy'
    //    }).on('change', function (e) {
    //        //let padre = e.target.parentNode.parentNode.parentNode;
    //        //padre.classList.remove('has-error');
    //        //if (_('txtArrivalPO').value.length == 0) { padre.classList.add('has-error'); }
    //    });
    //}
}

//function crearhandlerfechawipth() {
//    $("._datepicker_th").on("change", function () {
//        this.setAttribute(
//            "data-date",
//            moment(this.value, "YYYY/MM/DD")
//            .format(this.getAttribute("data-date-format"))
//        );
        
//    }).trigger("change")

//}

//methods update
function controlador_update(event) {
    let obj = event.target,
        par = obj.getAttribute("data-method") !== null ? obj.getAttribute("data-method")
            : (obj.parentNode.getAttribute("data-method") !== null ? obj.parentNode.getAttribute("data-method") : null);
    if (par !== null) {
        if (_('cboClientePo').selectedIndex > 0) {
            let opar = { method: _par(par, 'name'), id: _par(par, 'id'), idcliente: _('cboClientePo').value },
            frm = _setFormData('par', JSON.stringify(opar));
            // :edu se esta reutilizando de producto ya que es el mismo
            Post('PO/POProducto/getControl', frm, cargarControl);
        } else {
            _mensaje({ estado: 'error', mensaje: 'Client: Required' });
        }
    }
}

function cargarControl(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores !== null && ores.data !== '') {
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

function res_ini_tallacolor(orespuesta) {
    let ores = !_isEmpty(orespuesta) ? JSON.parse(orespuesta)[0] : null;
    if (ores != null) {
        ovariables.cadenalistaclientetalla = ores.clientetalla;
        setearlistaclientetallaconvertcsvtojson(ovariables.cadenalistaclientetalla);

        // eventos y carga de datos
        _('btnCancelar_PopupTallaColor').addEventListener('click', function () { 
            $("#modal_ventanaGeneral3").modal('hide');
        }, false);

        _('btnAceptar_PopupTallaColor').addEventListener('click', aceptarPopupTallaColor, false);

        cargarComboClienteTalla();
        cargarcombotipocolor();
    
        // eventos
        //_('cboTipoColor').addEventListener('change', changecombocolor, false);
        $("#cboTipoColor").on("change", changecombocolor );

        $('#cboClienteTalla').multiselect({
            enableFiltering: true,
            buttonWidth: '100%',
            maxHeight: 210,
            enableCaseInsensitiveFiltering: true,
            onChange: function (element, checked) {
                if (checked) {
                    generarMatrizTallaColor(element, "Talla");
                } else {
                    eliminarTallaColorMatriz(element, "Talla");
                }
            }
        });

        $("#cboClienteColor").multiselect({
            enableFiltering: true,
            buttonWidth: '100%',
            maxHeight: 210,
            enableCaseInsensitiveFiltering: true,
            onChange: function (element, checked) {
                if (checked) {
                    generarMatrizTallaColor(element, "Color");
                } else {
                    eliminarTallaColorMatriz(element, "Color");
                }
            }
        });

        init_iniciar_modaltallacolor();
    }
}

function setearlistaclientetallaconvertcsvtojson(cadenalistaclientetalla) {
    // convertir a json las tallas
    let cabeceraclientetalla = `idclientetalla¬nombreclientetalla`, dataclientetalla = '', clientetallajson = '';
    dataclientetalla = cabeceraclientetalla + '^' + cadenalistaclientetalla;
    ovariables.clientetallajson = CSVtoJSON(dataclientetalla, '¬', '^');
}

// :x :ini
(function ini() {
    load();
    _rules({ id: 'poproducto', clase: '_enty' });
    req_ini();
})();

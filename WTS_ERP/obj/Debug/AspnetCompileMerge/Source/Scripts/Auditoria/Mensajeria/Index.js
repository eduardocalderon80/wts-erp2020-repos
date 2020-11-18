/// <reference path="../Home/Util.js" />

(function ini() {
    load();
    getData();
})();

function juegoBotones(buscar) {
    var mensaje = _('mensaje'),
        encabezado = _('encabezado'),
        detalle = _('detalle');

    mensaje.classList.remove('hide');
    encabezado.classList.remove('hide');
    detalle.classList.remove('hide');

    if (buscar) {
        detalle.classList.remove('hide');
        mensaje.classList.add('hide');
        encabezado.classList.remove('hide');
    } else {
        detalle.classList.add('hide');
        encabezado.classList.add('hide');
        mensaje.classList.remove('hide');
    }
}


function load() {
    $('#fecha .input-group.date').datepicker({
        todayBtn: "linked", keyboardNavigation: false, forceParse: false, calendarWeeks: true, autoclose: true, dateFormat: 'mm/dd/yyyy',
        onSelect: function (dateText, inst) { _('txtsemana').value = dateText; }
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtfecha').value.length == 0) { padre.classList.add('has-error'); }
    });

    _('btnnuevo').addEventListener('click', nuevoMensaje);
    _('btncerrar').addEventListener('click', cerrar);
    _('btngrabar').addEventListener('click', grabarMensaje);
    _('btnbuscar').addEventListener('click', traerMensajes);
    _('cbofabrica').addEventListener('change', (e) => {
        let fabrica = e.target,
            nomfabrica = _('txtnomfabrica'),
            texto = fabrica.options[fabrica.selectedIndex].text;
        nomfabrica.value = fabrica.selectedIndex === 0 ? '' : texto;
    });
    _rules({ id: 'mensaje', clase: '_enty' });
}

function nuevoMensaje() { juegoBotones(false); }

function cerrar() {
    juegoBotones(true);
    _('txttitulo').value = '';
    _('txtmensaje').value = '';
    _('txtfecha').value = '';
    _('cbofabrica').selectedIndex = 0;
}

function getData() { Get('Auditoria/Mensajeria/traerMensajes_Fabricas?par=' + '', mostrar_Data); }

function traerMensajes() {
    var par = _('txtsemanaweek').value;
    Get('Auditoria/Mensajeria/traerMensajes?par=' + par, mostrar_Mensajes);
}

function mostrar_Mensajes(orespuesta) {
    var mensajes = orespuesta.trim().length > 0 ? JSON.parse(orespuesta) : null;
    if (mensajes !== null) { mostrar_grilla(mensajes); } else {
        _mensaje({ titulo: 'Mensaje', estado: 'error', mensaje: 'No existe mensaje en la semana seleccionada' });
        _('tbody_detalle').innerHTML = '';
    }
}


function mostrar_Data(orespuesta) {
    var arespuesta = orespuesta.split('^');
    var mensajes = arespuesta[0].trim().length > 0 ? JSON.parse(arespuesta[0]) : null;
    var fabricas = JSON.parse(arespuesta[1]);
    _('cbofabrica').innerHTML = _comboItem({ value: ' ', text: '--Todos--' }) + _comboFromJSON(fabricas, 'cod', 'nom');
    if (mensajes !== null) { mostrar_grilla(mensajes); }
}

function mostrar_fabricas(orespuesta) {
    let aData = JSON.parse(orespuesta);
    _('cbofabrica').innerHTML = _comboItem({ value: ' ', text: '--Todos--' }) + _comboFromJSON(aData, 'cod', 'nom');

}

function grabarMensaje() {
    var exito_required = _required({ id: 'mensaje', clase: '_enty' });
    if (exito_required) {
        asignarSemana();
        var form = _getForm({ id: 'mensaje', clase: '_enty' });
        Post('Auditoria/Mensajeria/grabarMensaje', form, function (rsta) {
            var orsta = JSON.parse(rsta);
            _mensaje(orsta);
        });
    }
}

function asignarSemana() {
    var txtsemana = _('txtsemana'),
        d = new Date(txtsemana.value),
        y = d.getFullYear().toString(),
        semana = $.datepicker.iso8601Week(d);
    txtsemana.value = y + '-W' + semana.toString();
}

function mostrar_grilla(oresult) {
    oUtil.aData = oresult;
    oUtil.aDataResult = oUtil.aData;
    listar_grilla(oUtil.aData);
    sort_header_link();
    filter_header();
    //_row_event(seleccionar_trabajador, 'tbody_detalle');
}
function listar_grilla(adata) {
    let rsta = '';
    if (adata != null && adata.length > 0) {
        let inicio = oUtil.indiceActualPagina * oUtil.registrosPagina;
        let fin = inicio + oUtil.registrosPagina, i = 0, x = adata.length;

        for (i = inicio; i < fin; i++) {
            if (i < x) {
                rsta += `<tr class='tselect'>`;
                rsta += `<td class='align-center'>${adata[i].id}</td>`;
                rsta += `<td class='align-center'>${adata[i].fabrica}</td>`;
                rsta += `<td class='align-center'>${adata[i].titulo}</td>`;
                rsta += `<td class='align-center'>${adata[i].mensaje}</td>`;
                rsta += `<td class='align-center'>${adata[i].fecha}</td>`;
                rsta += `</tr>`;
            } else {
                break;
            }
        }
    }
    _('tbody_detalle').innerHTML = rsta;
    _('tfoot_detalle').innerHTML = page_result(adata);
    //_row_event(seleccionar_trabajador, 'tbody_detalle');
}
function filter_header() {
    var name_filter = "filter";
    var filters = document.getElementsByClassName(name_filter);
    var nFilters = filters.length, filter = {};

    for (i = 0; i < nFilters; i++) {
        filter = filters[i];
        if (filter.type == "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil.aDataResult = event_header_filter(name_filter);
                listar_grilla(oUtil.aDataResult); //:desactivate                
            }
        }
    }
}
function event_header_filter(fields_input) {
    var adataResult = [], adata = oUtil.aData;
    if (adata.length > 0) {
        var fields = document.getElementsByClassName(fields_input);
        if (fields != null && fields.length > 0) {
            var i = 0, x = 0, nfields = fields.length, ofield = {}, nReg = adata.length;
            var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
            var _setField = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
            var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

            acampos_name = _oreflector.getProperties(adata[0]);

            for (i = 0; i < nReg; i++) {
                exito = true;
                for (x = 0; x < nfields; x++) {
                    ofield = fields[x];
                    value = ofield.value.toLowerCase();
                    field = ofield.getAttribute("data-field");

                    if (ofield.type == "text") {
                        exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
                    }
                    else {
                        exito = exito && (value == "" || value == adata[i][field]);
                    }
                    if (!exito) break;
                }
                if (exito) {
                    acampos_value = _oreflector.getValues(adata[i]);
                    adataResult[c] = _setField(acampos_name, acampos_value);
                    c++;
                }
            }
        }
    }
    return adataResult;
}
function sort_header_link() {
    var enlaces = document.getElementsByClassName("header_link");
    var nEnlaces = enlaces.length, enlace = {};
    for (i = 0; i < nEnlaces; i++) {
        enlace = enlaces[i];
        enlace.onclick = event_header_link;
    }
}
function event_header_link(event) {
    var obj = event.target;
    var campo = '', posAsc = 0, posDesc = 0, i = 0, field = '', tipoOrden = '', sortAsc = '';
    field = obj.getAttribute("data-value");
    campo = obj.innerHTML;

    posAsc = campo.indexOf("▲");
    posDesc = campo.indexOf("▼");

    tipoOrden = (posAsc == -1 && posDesc == -1 ? 0 : (posAsc > -1 ? 1 : 0));
    sortAsc = tipoOrden == 1 ? 'asc' : 'desc';

    clear_header_link();
    if (tipoOrden == 0) { obj.innerHTML = campo.replace(" ▼", "") + " ▲"; }
    else { obj.innerHTML = campo.replace(" ▲", "") + " ▼"; }

    oUtil.aDataResult = _.orderBy(oUtil.aData, [field], [sortAsc]);
    listar_grilla(oUtil.aDataResult);
}
function clear_header_link() {
    var enlaces = document.getElementsByClassName("header_link");
    var nEnlaces = enlaces.length;
    var enlace;
    var campo;
    for (var i = 0; i < nEnlaces; i++) {
        enlace = enlaces[i];
        campo = enlace.innerHTML;
        enlace.innerHTML = campo.replace(" ▲", "").replace(" ▼", "");
    }
}
function page_result(paData) {
    var contenido = "";
    if (paData != null && paData.length > 0) {
        var nRegistros = paData.length;
        var indiceUltimaPagina = Math.floor(nRegistros / oUtil.registrosPagina);
        if (nRegistros % oUtil.registrosPagina == 0) indiceUltimaPagina--;

        var registrosBloque = oUtil.registrosPagina * oUtil.paginasBloques;
        var indiceUltimoBloque = Math.floor(nRegistros / registrosBloque);
        if (nRegistros % registrosBloque == 0) indiceUltimoBloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil.indiceActualBloque > 0) {
            contenido += "<li> <a onclick='paginar(-1);' > << </a></li>";
            contenido += "<li> <a onclick='paginar(-2);' > < </a></li>";
        }
        var inicio = oUtil.indiceActualBloque * oUtil.paginasBloques;
        var fin = inicio + oUtil.paginasBloques;
        for (var i = inicio; i < fin; i++) {
            if (i <= indiceUltimaPagina) {
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
        if (oUtil.indiceActualBloque < indiceUltimoBloque) {
            contenido += "<li> <a onclick='paginar(-3);' > > </a></li>";
            contenido += "<li> <a onclick='paginar(-4);' > >> </a></li>";
        }
    }
    var qcell = document.getElementById(oUtil.idtable).rows[0].cells.length.toString();
    var foot = "<tr><td id='tdPie' style='text-align:center' colspan='";
    foot += qcell;
    foot += "'>";
    foot += contenido;
    foot += "</td></tr>";
    return foot;
}
function paginar(indice) {
    if (indice > -1) {
        oUtil.indiceActualPagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil.indiceActualBloque = 0;
                oUtil.indiceActualPagina = 0;
                break;
            case -2:
                oUtil.indiceActualBloque--;
                oUtil.indiceActualPagina = oUtil.indiceActualBloque * oUtil.paginasBloques;
                break;
            case -3:
                oUtil.indiceActualBloque++;
                oUtil.indiceActualPagina = oUtil.indiceActualBloque * oUtil.paginasBloques;
                break;
            case -4:
                var nRegistros = oUtil.aDataResult.length;
                var registrosBloque = oUtil.registrosPagina * oUtil.paginasBloques;
                var indiceUltimoBloque = Math.floor(nRegistros / registrosBloque);
                if (nRegistros % registrosBloque == 0) indiceUltimoBloque--;
                oUtil.indiceActualBloque = indiceUltimoBloque;
                oUtil.indiceActualPagina = oUtil.indiceActualBloque * oUtil.paginasBloques;
                break;
        }
    }
    listar_grilla(oUtil.aDataResult);
}
var oUtil = {
    aData: [],
    aDataResult: [],
    indiceActualPagina: 0,
    registrosPagina: 10,
    paginasBloques: 3,
    indiceActualBloque: 0,
    idtable: 'tblMensajeria'
}
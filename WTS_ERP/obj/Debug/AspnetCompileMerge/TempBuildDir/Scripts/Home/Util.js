var UtilTime;
// todo el mallqui

function res_timeOut(res) {
    var tipo = res.trim();
    console.log(tipo);

    if (tipo.toUpperCase() === 'OK') 
        swal("Good job!", "OK", "success")
    else
        swal("Ups", "error", "error")
    
    // :inicio timeOute
    timeOut();
}

function timeOut() {
    
    //var _timeOut = document.getElementById('timeOut').value;
    //var _timeOutWarning = parseInt(document.getElementById('timeOutWarning').value);
    //clearInterval(UtilTime);

    //function funOut() {       
    //    alert('Expiro la session');
    //    //swal
    //    //    var form = new FormData();
    //    swal({
    //        title: "Session expirada",
    //        text: "Desea seguir en el sistema",
    //        type: "info",
    //        showCancelButton: true,
    //        closeOnConfirm: false,
    //        showLoaderOnConfirm: true
    //    }, function () {
    //        var form = new FormData();
    //        form.append("autenticacion", _('autenticacion').value);
    //        Post('Home/accesoERP_TimeOut', form, function (res) { res_timeOut(res); });

    //    });


        
    //};

    //function ini() {
    //    UtilTime = setInterval(funOut, _timeOutWarning);
    //}

    //ini();
}






$(document).ready(function () {
    $(document).ajaxStart(function () {
        $('#myModalSpinner').modal('show');
    });

    $(document).ajaxStop(function () {
        $('#myModalSpinner').modal('hide');
    });

});

window.oURL = {
    erp: {
        preproduccion: 'https://172.16.1.22/erp/',
        produccion: 'http://erp.wtsusa.us/',
        desarrollo: 'http://192.168.0.3/erpdesarrollo/',
        localhost: 'http://localhost:4012/'
    },
    erpnew: {
        preproduccion: 'http://preprod.wtsusa.us/erpnew/',
        produccion: 'http://erpnew.wtsusa.us/',
        desarrollo: 'http://192.168.0.3/erplaboratorio_new/',
        //localhost: 'http://localhost:55670/'
        localhost: 'http://localhost:55659/'
    }
}
// :app
window.appURL = {
    erp: window.oURL.erp.desarrollo,
    erpnew: window.oURL.erpnew.desarrollo
}

function notificacion_erp(usuario_origen, obj_mensaje) {
    erpwtshub_principal.server.sendMessage(usuario_origen, obj_mensaje);
}

function notificacion_erp_por_grupo(usuario_origen, obj_mensaje) {
    erpwtshub_principal.server.sendMessagePorGrupo(usuario_origen, obj_mensaje);
}

function Get(url, metodo, spinner) {
    var gif = (typeof spinner !== 'undefined' && spinner !== null) ? (spinner === true) : true;
    if (gif) {
        $('#myModalSpinner').modal('show');
        var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("get", url, !0);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                    setTimeout(function () {
                        $('#myModalSpinner').modal('hide');
                    }, 0 | Math.random() * 500);
                } else { // error
                    $('#myModalSpinner').modal('hide');
                }
            }
        }; xhr.send()
    } else {
        var xhr = new XMLHttpRequest();
        url = urlBase() + url;
        xhr.open("get", url, !0);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                }
            }
        }; xhr.send();
    }

}

function Post(url, _frm, metodo, spinner) {
    var frm = _frm;//formClean(_frm)
    var gif = (typeof spinner !== 'undefined' && spinner !== null) ? (spinner === true) : true;

    if (gif) {
        $('#myModalSpinner').modal('show');
        var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("post", url, !0); xhr.send(frm);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                    setTimeout(function () {
                        $('#myModalSpinner').modal('hide');
                    }, 0 | Math.random() * 500);
                } else {  // error
                    $('#myModalSpinner').modal('hide');
                }
            }
        }
    } else {

        var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("post", url, !0); xhr.send(frm);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                    setTimeout(function () {

                    }, 0 | Math.random() * 500);
                } else {  // error

                }
            }
        }
    }


}

function logOut() {
    var localhost = window.oURL.erpnew.localhost,
        app = window.appURL.erpnew;
    if (localhost === app) {
        window.location.href = urlBase() + "Home/LoginERP";
    } else {
        window.location.href = window.appURL.erp + "Login/CerrarSesion";
    }

}

function urlBase() {
    var url = document.getElementById("urlBase").value;
    url = _isEmpty(url) ? Url.Content("~/") : url;
    //url = url == '/' ? '' : url;
    return url;
}

function _Go(e) {
   let li = e.target.parentNode;
   let ul = li.parentNode;
    let nojs = (li.getAttribute("data-nojs") !== null && li.getAttribute("data-nojs") === 'true');    
    let url = `${li.getAttribute('data-nav')}`;
   let par = li.getAttribute('data-par') !== null && li.getAttribute('data-par').trim().length > 0 ? `${li.getAttribute('data-par')}` : '';
   let login = false;
   let contenido = '';
   let indiceclass = e.currentTarget.className.indexOf('erp1');
   
    if (indiceclass > 0) {
       // para regresar al erp1        
        let urlapp = window.appURL.erp + `Redireccionar/LoginRedireccionar?usuarioAD=${window.utilindex.usuarioAD}&password=${window.utilindex.password}&tipoaccesousuario=${window.utilindex.tipoaccesousuario}&url=${url}`;
        window.location.href = urlapp;
    } else {
        Get(url, (rsta) => {
           login = rsta.indexOf('Login') > 0;
           let urlB = urlBase();
           if (!login) {               
               contenido = (par !== '') ? rsta.replace('DATA-PARAMETRO', par) : rsta;
               _('divContenido').innerHTML = contenido;               
                if (!nojs) checkloadjscssfile(urlB + `Scripts/${url}.js`, "js");
            } else {
                window.location.href = window.appURL.erp + "Login/login";
            }
        });
    }
}

//: sam
function _Go_Url(urlAccion, urlJS, par) {
    let contenido = '', login = '',
        urlB = urlBase();
    Get(urlAccion, (rsta) => {
        login = rsta.indexOf('Login') > 0;
        if (!login) {
            contenido = (par !== null && par !== '') ? rsta.replace('DATA-PARAMETRO', par) : rsta;
            _('divContenido').innerHTML = contenido;
            checkloadjscssfile(urlB + `Scripts/${urlJS}.js`, "js");
        } else {
            window.location.href = urlB + "Home/LoginERP";
        }
    });
}


function _Getjs(urlJS) {
    let urlB = urlBase();
    checkloadjscssfile(urlB + `Scripts/${urlJS}.js`, "js");
}

function _Array(elements) { return Array.prototype.slice.apply(elements) };
function _(id) { return document.getElementById(id); }
function loadjscssfile(filename, filetype) {
    //filename = filename ? filename + '?v=' + Date.now() : ''; //:activar para :produccion
    var fileref;
    if (filetype == "js") {
        fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype == "css") {
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

var filesadded = "";
function checkloadjscssfile(filename, filetype) {
    if (filesadded.indexOf("[" + filename + "]") === -1) {
        loadjscssfile(filename, filetype);
        filesadded += "[" + filename + "]";
    } else {
        removejscssfile(filename, filetype);
        loadjscssfile(filename, filetype);
        filesadded += "[" + filename + "]";
    }
}


function removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype === "css") ? "link" : "none";
    var targetattr = (filetype == "js") ? "src" : (filetype === "css") ? "href" : "none";
    var allsuspects = document.getElementsByTagName(targetelement);    
    for (var i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(filename) !== -1) {
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
}

function _crearTabla(lista, idtabla) {
    let campos = lista[0].split('¬'), nCampos = campos.length, x = 0, y = 0, nfilas = lista.length - 1, fila = [], contenido = '';
    contenido += `<table id='table_${idtabla}' class='table table-striped table-bordered table-list'> <thead><tr>`;
    for (j = 0; j < nCampos; j++) {
        contenido += `<th>${campos[j]}</td>`
    } contenido += '</tr></thead>';
    contenido += `<tbody id='detail_${idtabla}'>`;
    for (x = 1; x < nfilas; x++) {
        contenido += "<tr>"; fila = lista[x].split('¬');
        for (y = 0; y < nCampos; y++) { contenido += `<td>${fila[y]}</td>`; }
        contenido += '</tr>';
    } contenido += '</tbody></table>';
    return contenido;
}

function _getDate() {
    let today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth() + 1,
        yyyy = today.getFullYear(),
        r = '';
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    r = `${mm}-${dd}-${yyyy}`;
    return r;
}


function getDelimitador(fecha) {
    let delimitador = fecha.indexOf('/') > 0
        ? '/' : fecha.indexOf('-')
            ? '-' : fecha.indexOf(':')
                ? ':' : ' ';
    return delimitador;
}


function getDateByFormat(adate, format) {
    let tipo = (format === 'DD/MM/YYYY') ? 'ES' : 'US';
    return tipo === 'US'
        ? `${adate[2]}${adate[0]}${adate[1]}`
        : `${adate[2]}${adate[1]}${adate[0]}`;
}

function _convertDate_ANSI(fecha_mmddyyy,formato_Fecha) {
    let retorno = ' ',
        afecha = [],
        delimitador = '';
    let formatoFecha = formato_Fecha || 'mm/dd/yyyy';
    if (fecha_mmddyyy !== null && fecha_mmddyyy.length > 0) {
        delimitador = getDelimitador(fecha_mmddyyy);
        afecha = fecha_mmddyyy.split(delimitador);
        if (afecha.length > 1) {
            retorno = getDateByFormat(afecha, formatoFecha.toUpperCase());
        }
    }
    return retorno;
}

function _convertANSItoMMDDYYYY(fechaansi) {
    let anio = fechaansi.substring(0, 4);
    let mes = fechaansi.substring(6, 4);
    let dia = fechaansi.substring(6, 8);
    return [mes, dia, anio].join('/');
}

function _convertDate(date) {
    let yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString(),
        mmChars = mm.split(''),
        ddChars = dd.split('');
    return yyyy + (mmChars[1] ? mm : "0" + mmChars[0]) + (ddChars[1] ? dd : "0" + ddChars[0]);
}

function _getDateOfWeek(pweek) {
    let delimit = pweek.indexOf('-') > 0 ? '-' : '/',
        item = pweek.split(delimit),
        weekNumber = parseInt(item[1].substring(1, 3)),
        year = parseInt(item[0]),
        fechaini = new Date(year, 0, 2 + ((weekNumber - 1) * 7)),
        fechafin = new Date(year, 0, 8 + ((weekNumber - 1) * 7)),
        obj = { fec_inicio: _convertDate(fechaini), fec_fin: _convertDate(fechafin), anio: year, semana: weekNumber, cod_semana: pweek };
    return obj;
}

// use datediff
function fecha_regla2(fechaInicial, fechaFin, opcion) {
    fechaInicial = _convertDate_ANSI(fechaInicial);
    fechaFin = _convertDate_ANSI(fechaFin);
    let diffdias = _datediff(fechaInicial, fechaFin);
    if (opcion === 'edit') {
        if (diffdias < -60) {
            return false;
        }
    }
    return true;
}


function _getDateAdd(days) {
    if (days === null) return '';
    let fecha = new Date(),
        tiempo = fecha.getTime(),
        milisegundos = parseInt(days * 24 * 60 * 60 * 1000),
        total = fecha.setTime(tiempo + milisegundos),
        day = fecha.getDate(),
        month = fecha.getMonth() + 1,
        year = fecha.getFullYear(),
        r = `${month}-${day}-${year}`;
    return r;
}

function _datediff(fechaInicial, fechaFinal) {
    let separadorFechaInicial = fechaInicial.indexOf('/') >= 0 ? "/" : "-";
    let separadorFechaFinal = fechaFinal.indexOf('/') >= 0 ? "/" : "-";

    let valuesStart = fechaInicial.split(separadorFechaInicial);
    let valuesEnd = fechaFinal.split(separadorFechaFinal);

    // Verificamos que la fecha no sea posterior a la actual
    let dateStart = new Date(valuesStart[0], (valuesStart[1] - 1), valuesStart[2]);
    let dateEnd = new Date(valuesEnd[0], (valuesEnd[1] - 1), valuesEnd[2]);

    let tiempo = dateEnd.getTime() - dateStart.getTime();
    let dias = Math.floor(tiempo / (1000 * 60 * 60 * 24));
    return dias;
}


function _comboFromJSON(aData, value, text) {
    let combo = '', qreg = aData.length, x = 0;
    if (qreg > 0) {
        for (x = 0; x < qreg; x++) {
            combo += `<option value='${aData[x][value]}'>${aData[x][text]}</option>`;
        }
    }
    return combo;
}

// :add
function _isEmpty(campo) { return (campo === null || typeof campo === 'undefined' || campo.toString().trim().length === 0); }
function _oisEmpty(campo) { return (campo === null || typeof campo === 'undefined' || Object.keys(campo).length == 0) };
function _aisEmpty(campo) { return (campo === null || typeof campo === 'undefined' || campo.length === 0) };


// :add
function _comboFromCSV(strData, odelimitador) {
    let combo = '', aData = [], reg = 0; x = 0, aitem = [];
    if (strData) {
        if (odelimitador != null && !_isEmpty(odelimitador.col) && !_isEmpty(odelimitador.row)) {
            aData = strData.split(odelimitador.row);
            reg = aData.length;
            for (x = 0; x < reg; x++) {
                aitem = aData[x].split(odelimitador.col);
                combo += `<option value='${aitem[0]}'>${aitem[1]}</option>`;
            }
        } else {
            aData = strData.split('^');
            reg = aData.length;
            for (x = 0; x < reg; x++) {
                aitem = aData[x].split('¬');
                combo += `<option value='${aitem[0]}'>${aitem[1]}</option>`;
            }
        }
        aData = null; reg = null; x = null; aitem = null;
    }
    return combo;
}

function _comboDataListFromCSV(strData, odelimitador) {
    let combo = '', aData = [], reg = 0; x = 0, aitem = [];
    if (strData) {
        if (odelimitador != null && !_isEmpty(odelimitador.col) && !_isEmpty(odelimitador.row)) {
            aData = strData.split(odelimitador.row);
            reg = aData.length;
            for (x = 0; x < reg; x++) {
                aitem = aData[x].split(odelimitador.col);
                combo += `<option value='${aitem[1]}' data-value='${aitem[0]}'>`;
            }
        } else {
            aData = strData.split('^');
            reg = aData.length;
            for (x = 0; x < reg; x++) {
                aitem = aData[x].split('¬');
                combo += `<option value='${aitem[1]}' data-value='${aitem[0]}'>`;
            }
        }
        aData = null; reg = null; x = null; aitem = null;
    }
    return combo;
}

function _comboDataListFromJSON(aData, value, text) {
    let combo = '', qreg = aData.length, x = 0;
    if (qreg > 0) {
        for (x = 0; x < qreg; x++) {
            combo += `<option value='${aData[x][text]}' data-value='${aData[x][value]}'>${aData[x][text]}</option>`;
        }
    }
    return combo;
}

function _setValueDataList(idvalor, dl, txtdl) {
    let opciones = Array.from(dl.options);
    if (opciones.length > 0) {
        opciones.some((x, i) => {
            let datavalue = parseInt(x.getAttribute('data-value'));
            if (datavalue === parseInt(idvalor)) {
                dl.selectedIndex = i;
                txtdl.value = x.value;
                return true;
            }
        });
    }
}

function _getValueDataList(valorinput, dl) {
    let opciones = Array.from(dl.options), return_valor = '';

    if (opciones.length > 0) {
        opciones.some((x, i) => {
            let datavalue = x.getAttribute('data-value');
            if (x.value === valorinput) {
                return_valor = datavalue;
                return true;
            }
        });
    }

    return return_valor;
}

function _comboItem(odata) {
    let item = '';
    if (odata !== null) {
        if (odata.value === '') {
            item = "<option value=''>" + odata.text + "</option>";
        } else {
            item = `<option value='${odata.value}'>${odata.text}</option>`;
        }

    }
    return item;
}

//agregar al siguiente elemento
function insertAfter(e, i) {
    if (e.nextSibling) {
        e.parentNode.insertBefore(i, e.nextSibling);
    } else {
        e.parentNode.appendChild(i);
    }
}

//eventos validadores
/* Validator */
function _rules(osimple) {
    var evento = '', grupotipo = '';

    _SS(osimple.id, osimple.clase).forEach(function (item, index) {
        if (item.type == 'text') {
            if (!item.readOnly) {
                item.onblur = validators_blur;
                item.onkeypress = validators_keypress;
                item.onkeyup = validator_keyup;
            }
        } else if (item.type === 'textarea') {
            item.onblur = validators_blur_textarea;
        } else if (item.type == 'select-one' || item.type == 'select-multiple') {
            evento = item.getAttribute("data-event");
            if (evento == null) {
                item.onchange = validators_change;
            }
        } else if (item.type == 'date' || item.type == 'week') {
            item.onchange = validators_change;
        } else if (item.type == 'email') {
            item.onchange = validators_change_email;
        } else if (item.tagName == 'DIV') {
            grupotipo = item.getAttribute('data-group-type');

            switch (grupotipo) {
                case 'date':
                    _rules_date(item);
                    break;
                case 'checkbox':
                    _rules_omultiple(item);
                    break;
                case 'radio':
                    _rules_omultiple(item);
                default:
                    break;
            }
        }
    });
    evento = null;
}


function _rules_date(dom) {
    var gruponombre = dom.getAttribute('data-group'),
        agrupofecha = gruponombre != '' ? Array.prototype.slice.apply(dom.getElementsByClassName(gruponombre)) : [],
        q = agrupofecha.length;
    if (q > 0) {
        agrupofecha[0].onchange = validators_change_groupdate;

        agrupofecha[1].onblur = validators_blur;
        agrupofecha[1].onkeypress = validators_keypress;
        agrupofecha[1].onkeyup = validator_keyup;

        agrupofecha[2].onblur = validators_blur;
        agrupofecha[2].onkeypress = validators_keypress;
        agrupofecha[2].onkeyup = validator_keyup;
    }
}

function _rules_omultiple(dom) {
    var grupo = dom.getAttribute('data-group'),
        a_radio_checbox = Array.prototype.slice.apply(dom.querySelectorAll("input[name=" + grupo + "]")),
        y = 0,
        q = a_radio_checbox.length;
    if (q > 0) {
        for (y = 0; y < q; y++) {
            a_radio_checbox[y].onclick = ischecked;
        }
    }
    y = null;
    grupo = null;
    q = null;
    a_radio_checbox = null;
}

function _SS(idDiv, class_Search) {
    var divPadre = document.getElementById(idDiv);
    if (divPadre != null) {
        var elements = divPadre.getElementsByClassName(class_Search);
        return Array.prototype.slice.apply(elements);
    }
    return null;
}
function _isnotEmpty(campo) { return (campo != null && campo != ''); }
function _min(valor, min) { return valor.length >= min; }
function _max(valor, max) { return valor.length <= max; }
function _minmax_between(valor, min, max, tiponumerico) {
    var _valor = tiponumerico != null && tiponumerico == 'float' ? parseFloat(valor) : parseInt(valor);
    return (_valor >= min && _valor <= max);
}
function indice_punto(valor, max) {
    var x = valor.indexOf('.'), decim = 0;
    if (x > 0) {
        decim = parseFloat(valor.split('.')[1]);
        if (decim > 0)
            max = parseInt(max) + 1;
        else {
            max = parseInt(max) + 3;
        }
        return max;
    }
    return max;
}

function _parseFloat(_valor) {
    if (!_isEmpty(_valor)) {
        let r = _valor.toString().trim().replace(/,/g, "");
        if (r.length > 0) {
            if (!isNaN(r)) {
                return parseFloat(r);
            }
        }
    }

    return 0.0;
}

function _parseInt(_valor) {
    if (!_isEmpty(_valor)) {
        let r = _valor.toString().trim().replace(/,/g, "");
        if (r.length > 0) {
            if (!isNaN(r)) {
                return parseInt(r);
            }
        }
    }

    return 0;
}

function _formatnumber(amount, decimals) {
    let guion = amount.toString().indexOf('-') >= 0 ? '-' : '';
    amount += '';
    amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));
    decimals = decimals || 0;
    if (isNaN(amount) || amount === 0) { return parseFloat(0).toFixed(decimals); }
    amount = '' + amount.toFixed(decimals);
    let amount_parts = amount.split('.'), regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0])) {
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    }
    return guion + amount_parts.join('.');
}

function validators_blur(e) {
    var input = e.target,
        required = input.getAttribute("data-required"),
        valor = input.value,
        min = input.getAttribute("data-min"), max = input.getAttribute("data-max"),
        accion_min = false, accion_max = false, esfecha = input.getAttribute("data-type") === 'date', esContenedor = esfecha || input.getAttribute("data-level") !== null ? true : false;

    if (required !== null) {
        valor = valor.replace(/,/g, "");
        max = indice_punto(valor, max);
        if (valor != '' && !esfecha) {
            if (min != null && min != '') {
                accion_min = _min(valor, min);
            }
            if (max != null && max != '') {
                accion_max = _max(valor, max);
            }

            if (esContenedor) {
                input.parentNode.parentNode.parentNode.classList.remove('has-error');
            } else {
                input.parentNode.parentNode.classList.remove('has-error');
            }

            if (!accion_min || !accion_max) {
                if (esContenedor) {
                    input.parentNode.parentNode.parentNode.classList.add('has-error');
                } else {
                    input.parentNode.parentNode.classList.add('has-error');
                }
            }
        }
    }
}


function validators_blur_textarea(e) {
    var input = e.target,
        required = input.getAttribute("data-required"),
        valor = input.value,
        min = input.getAttribute("data-min"),
        max = input.getAttribute("data-max"),
        accion_min = false,
        accion_max = false,
        esContenedor = input.getAttribute("data-level") !== null ? true : false;

    if (required !== null) {
        if (valor !== '') {
            if (min != null && min != '') {
                accion_min = _min(valor, min);
            }
            if (esContenedor) {
                input.parentNode.parentNode.parentNode.classList.remove('has-error');
            } else {
                input.parentNode.parentNode.classList.remove('has-error');
            }

            if (!accion_min) {
                if (esContenedor) {
                    input.parentNode.parentNode.parentNode.classList.add('has-error');
                } else {
                    input.parentNode.parentNode.classList.add('has-error');
                }
            }
        }
    }
}

function validator_keyup(e) {
    var dom = e.target,
        required = dom.getAttribute("data-required") != '',
        eslevel = dom.getAttribute("data-level") !== null,
        valor = dom.value,
        dec = 0,
        ent = 0,
        esfecha = (dom.getAttribute("data-type") === 'date'),
        esContenedor = dom.getAttribute("data-level") !== null ? true : false,
        tipo = dom.getAttribute("data-type") !== null ? dom.getAttribute("data-type") : '',
        estipo_entero = tipo == 'int',
        estipo_decimal = tipo == 'dec',
        min = dom.getAttribute("data-min"), max = dom.getAttribute("data-max"), accion_min = false, accion_max = false, accion_min_max = false,
        padre = eslevel ? dom.parentNode.parentNode.parentNode : dom.parentNode.parentNode;
    tieneError = padre.classList.contains('has-error');

    if (estipo_entero) {
        valor = (valor.length > 0) ? parseInt(valor) : 0;
        accion_min_max = _minmax_between(valor, parseInt(min), parseInt(max));
        padre.classList.remove('has-error');
        if (!accion_min_max) padre.classList.add('has-error');
    } else {
        if (tieneError && !esfecha) {
            valor = valor.replace(/,/g, "");
            ent = valor.indexOf('.') >= 0 ? parseInt(valor.split('.')[0]) : parseInt(valor);
            dec = valor.indexOf('.') >= 0 ? (valor.split('.')[1].length > 0 ? parseInt(valor.split('.')[1]) : 0) : 0;
            max = indice_punto(valor, max);// :validar
            if (min != null && min != '') {
                accion_min = _min(valor, min);
            }
            if (max != null && max != '') {
                accion_max = _max(valor, max);
            }
            padre.classList.remove('has-error');
            if (!accion_min || !accion_max) {
                padre.classList.add('has-error');
            }
        }
    }
}

function _validators_decimales(oparametro) {
    let idcontenedor = oparametro.idcontent || '',
        clase = oparametro.clase || '',
        qdecimales = oparametro.decimal || 2,
        arr = (idcontenedor !== '' && clase !== '') ? _Array(document.getElementById(idcontenedor).getElementsByClassName(clase)) : [];
    if (arr.length > 0) {
        if (qdecimales == 2) {
            arr.forEach(txt => {
                $(txt).autoNumeric('init');
            });
        } else {
            arr.forEach(txt => {
                $(txt).autoNumeric('init', { mDec: qdecimales });
            });
        }
    }
}

function validators_keypress(e) {
    var txt = e.target,
        eslevel = txt.getAttribute("data-level") !== null,
        ptype = txt.getAttribute("data-type"), charCode = '', id = txt.id, requirer = txt.getAttribute("data-required"), exito = false,
        padre = eslevel ? txt.parentNode.parentNode.parentNode : txt.parentNode.parentNode;
    if (ptype != null && ptype != '') {
        if (ptype == 'int') {
            charCode = (e.which) ? e.which : e.keyCode;
            exito = (charCode > 31 && (charCode < 48 || charCode > 57));
            if (exito) {
                return false;
            } else {
                padre.classList.remove('has-error');
            }

        } else if (ptype == 'let') {
            var regex = new RegExp("^[a-zA-Z ]+$"),
                key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        }
    }
}
function validators_change(e) {
    var input = e.target,
        valor = input.value,
        eslevel = input.getAttribute("data-level") !== null,
        min = input.getAttribute("data-min"),
        accion_min = true,
        padre = eslevel ? input.parentNode.parentNode.parentNode : input.parentNode.parentNode,
        select = input.type === "select-one" || input.type === 'select-multiple';

    if (select) {
        let _default = input.getAttribute('data-default') !== null ? input.getAttribute('data-default') : '',
            q = input.length,
            none = input.options[input.selectedIndex].text.toUpperCase().indexOf('NONE') >= 0,
            vacio_select = (q === 1 && _default === 'empty' && none);

        if (vacio_select) {
            accion_min = true;
        } else {
            if (min !== null && min !== '') {
                accion_min = _min(valor, min);
            }
        }
    } else {
        if (min !== null && min !== '') {
            accion_min = _min(valor, min);
        }
    }

    padre.classList.remove('has-error');
    if (!accion_min) {
        padre.classList.add('has-error');
    }
}


/* required */
function _required(oenty) {
    let req = '', valor = '', min = '', max = '', accion_min = true, accion_max = true, esDataLevel = true, estadoenty = true, estadoentyFinal = true, estadomultiple = true, grupo = '', tipo_grupo = '', estadogrupo = true, padre = null, padreNivel = null, tipo = '', oexcepion = null, ocontrol = null;
    _SS(oenty.id, oenty.clase).forEach(function (item, index) {
        req = item.getAttribute("data-required") == 'true';
        if (req) {
            valor = item.value;
            min = item.getAttribute("data-min");
            max = item.getAttribute("data-max");
            accion_min = false;
            accion_max = false;
            grupo = item.getAttribute("data-group");
            padre = item.parentNode.parentNode;
            padreNivel = padre.parentNode;
            esDataLevel = (item.getAttribute("data-level") !== null || item.getAttribute("data-date") !== null) ? true : false;
            estadoenty = true;
            tipo = item.getAttribute("data-type") !== null ? item.getAttribute("data-type") : '';
            exception = item.getAttribute("data-exception") !== null ? item.getAttribute("data-exception") : '';


            if (grupo !== null && grupo !== '') {
                tipo_grupo = item.getAttribute("data-group-type");

                switch (tipo_grupo) {
                    case 'date':
                        estadogrupo = _fn_valida_group_datatime(item);
                        break;
                    case 'checkbox':
                        estadogrupo = _required_omultiple(item);
                        break;
                    case 'radio':
                        estadogrupo = _required_omultiple(item);
                    default:
                        break;
                }
                padreNivel.classList.remove('has-error');
                if (!estadogrupo) {
                    padreNivel.classList.add('has-error');
                    estadomultiple = false;
                }
            } else {
                if (min !== null && min != '') {
                    accion_min = _min(valor, min);
                }
                if (max !== null && max != '') {
                    valor = tipo === 'dec' ? valor.replace(/,/g, "") : valor;
                    accion_max = _max(valor, max);
                    if (tipo === 'dec' || tipo === 'int') {
                        if (parseFloat(valor) === 0) {
                            accion_min = false;
                            accion_max = false;
                        }
                    }
                }

                if (esDataLevel) {
                    padreNivel.classList.remove('has-error');
                } else {
                    padre.classList.remove('has-error');
                }

                if (min != null && max != null) {
                    if (!accion_min || !accion_max) {
                        estadoenty = false;
                    }
                } else if (min != null && max == null) {
                    if (!accion_min) {
                        estadoenty = false;
                    }
                } else if (max != null && min == null) {
                    if (!accion_max) {
                        estadoenty = false;
                    }
                }
                //exception
                if (exception !== '') {
                    //var exception= 'cboTipoPrecio=2?empty';
                    var operatorIgual = exception.indexOf('=');
                    var pregunta = exception.indexOf('?');
                    if (operatorIgual > 0 && pregunta > 0) {
                        var idcontrol = exception.substring(0, operatorIgual); //"cboTipoPrecio"
                        var valorcomparador = exception.substring(operatorIgual + 1, pregunta); //"2"
                        var valordefault = exception.substring(pregunta + 1); //"empty"

                        var _valorControl = document.getElementById(idcontrol).value;//2:FOB
                        var _valorComparado = valor;

                        if (_valorControl == valorcomparador) {
                            estadoenty = true;
                            if (esDataLevel) { padreNivel.classList.remove('has-error'); }
                            else { padre.classList.remove('has-error'); }
                        }

                    }
                }

                if (esDataLevel && !estadoenty) {
                    padreNivel.classList.add('has-error'); estadoentyFinal = false;
                }
                if (!esDataLevel && !estadoenty) {
                    padre.classList.add('has-error'); estadoentyFinal = false;
                }
            }
        }
    });
    return (estadoentyFinal && estadomultiple);//:sam
}
//:disabled
function _fn_valida_group_datatime(dom) {
    var group = dom.getAttribute('data-group'),
        group_child = Array.prototype.slice.apply(dom.getElementsByClassName(group)),
        group_fecha = { fecha: '', hora: 00, minuto: 00, hora_estado: true, minuto_estado: true },
        tipo = '',
        esfechacorrecta = false,
        max = 0,
        min = 0,
        valor = 0;
    dom.classList.remove('required');
    if (group_child.length > 0) {
        group_child.forEach(function (_child) {
            tipo = _child.getAttribute('data-date');
            switch (tipo) {
                case 'date':
                    group_fecha.fecha = _child.value;
                    break;
                case 'hour':
                    max = _child.getAttribute('data-max') != null ? parseInt(_child.getAttribute('data-max')) : 0;
                    min = _child.getAttribute('data-min') != null ? parseInt(_child.getAttribute('data-min')) : 0;
                    valor = _child.value.length > 0 ? parseInt(_child.value) : 0;
                    group_fecha.hora_estado = (valor >= min) && (valor <= max);
                    group_fecha.hour = group_fecha.hora_estado ? valor : 0;
                    break;
                case 'minute':
                    max = _child.getAttribute('data-max') != null ? parseInt(_child.getAttribute('data-max')) : 0;
                    min = _child.getAttribute('data-min') != null ? parseInt(_child.getAttribute('data-min')) : 0;
                    valor = _child.value.length > 0 ? parseInt(_child.value) : 0;
                    group_fecha.minute_estado = (valor >= min) && (valor <= max);
                    group_fecha.minute = group_fecha.minute_estado ? valor : 0;
                    break;
                default:
                    break;
            }
        });
        esfechacorrecta = (group_fecha.fecha.length == 10 && group_fecha.hora_estado && group_fecha.minuto_estado);
        if (!esfechacorrecta) { dom.classList.add('required'); }
    }
    return esfechacorrecta;
}
//:disabled
function _required_omultiple(dom) {
    var group = dom.getAttribute("data-group"),
        radio_check = [],
        valor = '',
        qexito = 0,
        q = 0, exito = false;

    if (group != null) {
        radio_check = dom.querySelectorAll("input[name=" + group + "]");
        if (radio_check != null) {
            q = radio_check.length;
            dom.classList.add("required");
            for (x = 0; x < q; x++) {
                if (radio_check[x].checked) {
                    qexito++;
                    dom.classList.remove("required");
                    break;
                }
            }
        }
    }
    exito = (qexito > 0);
    return exito;
}

/* fin  validator */

/* parameter Objeto */
//obj:{id:iddivcontenedorPadre, clase:'_enty'}
function _getParameter(obj, toString) {
    let afields = _getFields(obj);
    let ofields = _getObject(afields);
    return toString ? JSON.stringify(ofields) : ofields;
}

//asignar una propiedad-valor a un Objeto
function _setProp(objParameter, nameParameter, valueParameter) {
    if (objParameter !== null && nameParameter !== null && valueParameter !== null) {
        objParameter[nameParameter] = valueParameter;
    }
}

/* parameter Form*/
function _getForm(obj) {
    let afields = _getFields(obj),
        ofields = _getObject(afields),
        sfields = JSON.stringify(ofields),
        form = _setFormData('par', sfields);
    return form;
}

function _getFields(obj) {
    var contenedor = document.getElementById(obj.id);
    return Array.prototype.slice.apply(contenedor.getElementsByClassName(obj.clase));
}
function _getObject(afields) {
    let obj = {}, id = '', valor = '', datadefault = '', esfecha = false,formatoFecha='',esnumerico = false;
    if (afields != null && afields.length > 0) {
        afields.forEach(function (field) {
            id = field.getAttribute('data-id');
            datadefault = (field.getAttribute('data-default') !== null) ? field.getAttribute('data-default') : '';
            valor = (field.value !== "" && typeof (field.value) !== 'undefined') ? field.value : (datadefault === 'empty' ? ' ' : datadefault); //datadefault
            esfecha = (field.getAttribute('data-type') === 'date');
            formatoFecha = (field.getAttribute('data-date-format') !== null) ? field.getAttribute('data-date-format') : '';
            esnumerico = (field.getAttribute('data-type') === 'dec' || field.getAttribute('data-type') === 'int');
            valor = esfecha ?
                _convertDate_ANSI(valor, formatoFecha) :
                    esnumerico ? valor.replace(/,/g, "") :
                        valor;
            obj[id] = valor;
        });
    }
    return obj;
}
// :arone


function _setFormData(nombreParametro, dataParametro) {
    var form = new FormData();
    form.append(nombreParametro, dataParametro);
    return form;
}

function _setFormParameter(form, objParameter, nameParameter) {
    if (form !== null && objParameter !== null && nameParameter !== null) {
        form.append(nameParameter, objParameter);
    }
}


/* parametros URL */
//parametro pasado desde la url y almacenada en un txt
//example: let txtparametro= "nombre:samuel,apellido:arone,dni:41435877" 
//obtenerlo => _par(txtparametro,'apellido')
//resultado => arone
function _par(ParametroPrincipal, nombreParametroBuscada) {
    let par = '';
    if (!_isEmpty(ParametroPrincipal) && !_isEmpty(nombreParametroBuscada)) {
        par = _getPar(ParametroPrincipal, nombreParametroBuscada);
    }
    return par;
}

function _parToJSON(parametro) {
    let obj = {},
        aparametro = parametro.split(','),
        afield = [];
    if (aparametro !== null && aparametro.length > 0) {
        aparametro.forEach(x => {
            afield = x.split(':');
            if (afield !== null && afield.length > 0) {
                obj[afield[0]] = afield[1];
            }
        });
    }
    return Object.keys(obj).length > 0 ? JSON.stringify(obj) : (parametro !== null ? parametro : '');
}

function _getPar(ParametroPrincipal, nombreParametroBuscada) {
    let apar = ParametroPrincipal.indexOf(',') > 0 ? ParametroPrincipal.split(',') : [ParametroPrincipal],
        par = [],
        valor = '';
    apar.some((x, ind) => {
        par = (apar[ind].indexOf(':') > 0) ? apar[ind].split(':') : null;
        if (par !== null && par[0] === nombreParametroBuscada) {
            valor = par[1];
            return true;
        }
    });
    return valor;
}





// :promise  :promises :promesa :promesas :example
function callFabrica() {
    let data = '';
    _Get('Auditoria/Mensajeria/traerFabricas?par=').then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        mostrar_fabricas(sdata);
    })
}



function promiseSqrt(value) {
    console.log('START execution with value =', value);
    return new Promise(function (fulfill, reject) {
        setTimeout(function () {
            fulfill({ value: value, result: value * value });
        }, 0 | Math.random() * 100);
    });
}

function _promise(t) {
    let ml = t | 100;
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ml);
    });
}



function Get(url, metodo, spinner) {
    var gif = (typeof spinner !== 'undefined' && spinner !== null) ? (spinner === true) : true;
    if (gif) {
        $('#myModalSpinner').modal('show');
        var xhr = new XMLHttpRequest(); url = urlBase() + url; xhr.open("get", url, !0);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                    setTimeout(function () {
                        $('#myModalSpinner').modal('hide');
                    }, 0 | Math.random() * 500);
                } else { // error
                    $('#myModalSpinner').modal('hide');
                }
            }
        }; xhr.send()
    } else {
        var xhr = new XMLHttpRequest();
        url = urlBase() + url;
        xhr.open("get", url, !0);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    metodo(xhr.responseText);
                }
            }
        }; xhr.send();
    }

}

// :promise
function _Get(url, spinner) {
    url = urlBase() + url;
    var gif = (typeof spinner !== undefined && spinner !== null) ? (spinner === true) : true;
    if (gif) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status === 200) {
                        resolve(request.response);
                    }
                    else {
                        $('#myModalSpinner').modal('hide');
                        reject(new Error(request.statusText));
                    }
                }
            };
            request.onerror = function () {
                reject(new Error(this.statusText));
                $('#myModalSpinner').modal('hide');
            };
            request.open('GET', url);
            request.send();
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status === 200) {
                        resolve(request.response);
                    }
                    else {
                        reject(new Error(request.statusText));
                    }
                }
            };
            request.onerror = function () {
                reject(new Error(this.statusText));
            };
            request.open('GET', url);
            request.send();
        });
    }
};

function _Post(url, _frm, spinner) {
    var frm = _frm;//formClean(_frm);
    var gif = (typeof spinner !== undefined && spinner !== null) ? (spinner === true) : true;

    if (gif) {
        $('#myModalSpinner').modal('show');
        url = urlBase() + url;
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("post", url, !0);
            request.send(frm);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status === 200) {
                        resolve(request.responseText);
                        setTimeout(function () {
                            $('#myModalSpinner').modal('hide');
                        }, 0 | Math.random() * 500);
                    }
                    else {
                        $('#myModalSpinner').modal('hide');
                        reject(new Error(request.statusText));
                    }
                }
            };
            request.onerror = function () {
                reject(new Error(this.statusText));
                $('#myModalSpinner').modal('hide');
            };
        });
    } else {
        url = urlBase() + url;
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("post", url, !0);
            request.send(frm);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status === 200) {
                        resolve(request.responseText);
                        setTimeout(function () {

                        }, 0 | Math.random() * 500);
                    }
                    else {

                        reject(new Error(request.statusText));
                    }
                }
            };
            request.onerror = function () {
                reject(new Error(this.statusText));
            };

        });
    }
}


// :mensaje
function _mensaje(omensaje) {
    omensaje = (omensaje !== null) ? omensaje : { titulo: 'Mensaje', mensaje: 'No se pudo registrar', estado: 'error' };
    let oiconos = { ok: 'fa-check-circle-o', error: 'fa-exclamation-triangle' },
        clase = `${(omensaje.estado === 'success') ? oiconos.ok : oiconos.error}`;
    _('modal_titulo').innerHTML = omensaje.titulo != null ? omensaje.titulo : 'Mensaje';
    _('modal_mensaje').innerHTML = omensaje.mensaje;
    _('modal_icono').classList.remove(oiconos.ok, oiconos.error);
    _('modal_icono').classList.add(clase);
    $("#modal").modal();
}

// :modal ventanageneral
// :edu 20171016 crear dinamicamente
function _modalVentanaGeneral(tamanioVentana) {
    document.getElementById("modal_dialogVentanaGeneral").style.width = tamanioVentana + 'px';
    $("#modal_ventanaGeneral").modal();
}

// :edu 20171016 crear dinamicamente
function _modal_open(idmodal, tamanioVentana) {
    document.getElementById("modal_dialog" + idmodal).style.width = tamanioVentana + 'px';
    $("#modal_" + idmodal).modal();
}

// :sam 20180201
function _modalBody(oparametro) {
    let url = oparametro.url,
        ventana = oparametro.ventana,
        ancho = oparametro.ancho || '',
        alto = oparametro.alto || '',
        _parametro = oparametro.parametro || '',
        fondotitulo = oparametro.fondotitulo || '',
        efecto = oparametro.efecto || '',
        claseResponsivo = oparametro.responsive || '', colocarmodalenestediv = oparametro.colocarmodalenestediv || '', bloquearpantallaprincipal = oparametro.bloquearpantallaprincipal || '';

    if (!_isEmpty(ventana)) {

        _promise().then(function () {
            _modal(ventana, ancho, alto, null, fondotitulo, efecto, claseResponsivo, colocarmodalenestediv, bloquearpantallaprincipal);
        }).then(function () {
            let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                titulo = _(`modal_title${ventana}`),
                body = _(`modal_body${ventana}`),
                _err = function (error) { console.log("error", error) }

            titulo.innerHTML = !_isEmpty(oparametro.titulo) ? oparametro.titulo : 'Titulo';
            $(`#modal_${ventana}`).modal({
                backdrop: false, show: true
            });
            $('#modal_dialog' + ventana).draggable({
                handle: '.modal-header'
            });

            _Get(url)
                .then((vista) => {
                    let contenido = (_parametro !== '') ? vista.replace('DATA-PARAMETRO', _parametro) : vista;
                    body.innerHTML = contenido;
                }, (p) => { _err(p) })
                .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
        })
    }
}

function _Body(oparametro) {
    let url = oparametro.url,
        ventana = oparametro.ventana,
        _parametro = oparametro.parametro || '',
        _body = oparametro.content_parent || 'divcontenedor_breadcrum',
        _titulo = oparametro.titulo || '',
        _divbefore = oparametro.content_begin || `<div class='wrapper wrapper-content gray-bg _body'><div id='body%' style='height:auto;max-height:auto; overflow:auto'>`,
        _divafter = oparametro.conten_end || `</div></div>`,
        _fn = oparametro.fn || function () { };

    _divbefore = _divbefore !== '' ? _divbefore.replace('%', ventana) : '';
    let getContenido = (__vista, __parametro, __titulo, __divafter, __divbefore) => {
        let contenido = (__parametro !== '')
            ? (__titulo !== '')
                ? __vista.replace('DATA-PARAMETRO', __parametro).replace('DATA-TITULO', __titulo)
                : __vista.replace('DATA-PARAMETRO', __parametro)
            : __vista;

        let resultado = (__divbefore !== '' && __divafter !== '')
            ? `${__divbefore}${contenido}${__divafter}`
            : `${contenido}`;
        return resultado;
    }

    if (!_isEmpty(ventana)) {
        let urlJS = !_isEmpty(oparametro.urljs) ? oparametro.urljs : url,
            body = _(`${_body}`),
            _err = function (error) { console.log("error", error) };
        _Get(url)
            .then((vista) => {
                let contenido = getContenido(vista, _parametro, _titulo, _divafter, _divbefore);
                let _bodyanterior = document.querySelector('._body');
                if (!_isEmpty(_bodyanterior)) { body.removeChild(_bodyanterior); }
                body.removeAttribute('style'); // se quita el style tempral mente para corregir el problema de desbordamiento de scroll en el contenedor divcontenedor_breadcrum; y luego lo vuelvo a poner el style max-heig
                body.insertAdjacentHTML('beforeend', contenido);
                _fn();
            }, (p) => { _err(p) })
            .then(() => { _Getjs(urlJS); })
    }
}

// :modal ventanageneral
// :edu 20171016 crear dinamicamente
function _modalVentanaGeneral2(tamanioVentana) {
    document.getElementById("modal_dialogVentanaGeneral2").style.width = tamanioVentana + 'px';
    $("#modal_ventanaGeneral2").modal();
}

// :modal ventanageneral
// :edu 20171024 crear dinamicamente
function _modalVentanaGeneral3(tamanioVentana) {
    document.getElementById("modal_dialogVentanaGeneral3").style.width = tamanioVentana + 'px';
    $("#modal_ventanaGeneral3").modal();
}

// :add destination
function DigitimosDecimales(e, field) {
    key = e.keyCode ? e.keyCode : e.which

    // backspace
    if (key == 8) return true
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value))
    }
    // .
    if (key == 46) {
        regexp = /^[0-9]+$/
        return regexp.test(field.value);
    }
    // other key
    return false;
}

function DigitosEnteros(e, field) {
    key = e.keyCode ? e.keyCode : e.which

    // backspace
    if (key == 8) return true
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{7}$/
        return !(regexp.test(field.value))
    }
    return false;
}

function DigitosEnterosFlash(e, field) {
    key = e.keyCode ? e.keyCode : e.which

    // backspace
    if (key == 8) return true
    // 0-9 --> 3 decimales
    if (key > 47 && key < 58) {
        regexp = /.[0-9]{4}$/
        return !(regexp.test(field.value))
    }
    return false;
}

function DigitimosDosDecimales(evt, input) {
    // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
    var key = window.Event ? evt.which : evt.keyCode;
    var chark = String.fromCharCode(key);
    var tempValue = input.value + chark;
    if (key >= 48 && key <= 57) {

        if (filter(tempValue) === false) {
            return false;
        } else {
            return true;
        }
    } else {
        if (key == 8 || key == 13 || key == 46 || key == 0) {
            return true;
        } else {
            return false;
        }

    }
}
function filter(__val__) {
    var preg = /^([0-9]+\.?[0-9]{0,2})$/;
    if (preg.test(__val__) === true) {
        return true;
    } else {
        return false;
    }

}

function FindIndexOfArrayObject(ArrayObject, FieldFilter, Value) {
    var Len = ArrayObject.length, i = 0;
    if (Len > 0) {
        try {
            for (i = 0; i < Len; i++) {
                var Row = ArrayObject[i];
                if (Row[FieldFilter] == Value) {
                    return i;
                }
            }
            i = null;
            return -1;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }
    return -1;
}


function _setField(afield_name, afield_value) {
    let x = 0, q_field = afield_name.length, item = '', obj = {};
    for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; }
    x = null; q_field = null;
    return obj;
}

//proveedor
//id,nombre,direccion 1ra fila
//sql: 2da: 1¬'tsc'¬'chincha'^2¬'tpm'¬'sta anita'^
function CSVtoJSON(data, delimitadorCampo, delimitadorFila) {
    let ajson = [], adata = [], item = [], x = 0, numregisro = 0, acampos_name = [], acampos_value = [];
    delimitadorCampo = !_isEmpty(delimitadorCampo) ? delimitadorCampo : '¬',
        delimitadorFila = !_isEmpty(delimitadorFila) ? delimitadorFila : '^';

    if (!_isEmpty(data)) {
        if (!_isEmpty(delimitadorFila) && !_isEmpty(delimitadorCampo)) {
            adata = data.split(delimitadorFila); numregisro = adata.length;
            acampos_name = adata[0].split(delimitadorCampo);// :1ra fila [nombre¬apellido¬edad¬]
            for (x = 1; x < numregisro; x++) {
                acampos_value = adata[x].split(delimitadorCampo);
                ajson[x - 1] = _setField(acampos_name, acampos_value);
            }
        }
    }
    adata = null; item = null; x = null; numregisro = null; acampos_name = null; acampos_value = null;
    return ajson;
}

function CSVtoJSON_B(data, delimitadorCampo, delimitadorFila) {
    let ajson = [], adata = [], item = [], x = 0, numregisro = 0, acampos_name = [], acampos_value = [];
    delimitadorCampo = !_isEmpty(delimitadorCampo) ? delimitadorCampo : '--',
        delimitadorFila = !_isEmpty(delimitadorFila) ? delimitadorFila : '|';

    if (!_isEmpty(data)) {
        if (!_isEmpty(delimitadorFila) && !_isEmpty(delimitadorCampo)) {
            adata = data.split(delimitadorFila); numregisro = adata.length;
            acampos_name = adata[0].split(delimitadorCampo);// :1ra fila [nombre¬apellido¬edad¬]
            for (x = 1; x < numregisro; x++) {
                acampos_value = adata[x].split(delimitadorCampo);
                ajson[x - 1] = _setField(acampos_name, acampos_value);
            }
        }
    }
    adata = null; item = null; x = null; numregisro = null; acampos_name = null; acampos_value = null;
    return ajson;
}


function _filter_simple(arr, criteria) {
    return arr.filter(function (obj) {
        return Object.keys(criteria).every(function (c) {
            return obj[c] == criteria[c];
        });
    });
}


function _filter_mulptile(alist, ofilter) {
    let x = 0, aresult = [],
        names = Object.keys(ofilter), count_filter = names != null ? names.length : 0, count_equal = 0;

    if (ofilter != null && (names != null && names.length > 0)) {
        alist.forEach(function (item) {
            count_equal = 0;
            names.some(function (name) {
                if (item[name].trim().toLowerCase() == ofilter[name].trim().toLowerCase()) {
                    count_equal++;
                    if (count_equal == count_filter) {
                        aresult.push(item);
                        return true;
                    }
                }
            });
        });
    }
    x = null; names = null; count_filter = null;
    return aresult;
}

// :sam
function _clase(cadenaIds, clase, accion) {
    if (accion === 'remove' || accion === 'add') {
        let arrIds = cadenaIds.split(',');
        if (arrIds !== null && arrIds.length > 0) {
            if (accion === 'add') {
                arrIds.forEach(x => {
                    document.getElementById(x).classList.add(clase);
                });
            } else if (accion === 'remove') {
                arrIds.forEach(x => {
                    document.getElementById(x).classList.remove(clase);
                });
            }

        }
    }
}

// :edu 20171019
function _modalConfirm(mensaje, callBackyes, callbackno) {
    _('modal_body_confirm').innerHTML = mensaje
    $('#btnYes_confirm').off('click');
    $('#btnYes_confirm').on('click', function () {
        callBackyes();
    });
    $('#btnNo_confirm').off('click');
    $('#btnNo_confirm').on('click', function () {
        if (callbackno != undefined) {
            callbackno();
        } else {
            $("#modalConfirm").modal('hide');
        }
    });

    $("#modalConfirm").modal();
}

function _S(q) { return Array.prototype.slice.apply(document.querySelectorAll(q)); }

// :edu 20171107
function _groupBy(array, fields) {
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

/*

_claseResponsive: [modal-lg,modal-xs,modal-m]
*/
function _modal(idmodal, ancho, alto, fun, _fondotitulo, animation, _claseResponsive, colocarmodalenestediv, bloquearpantallaprincipal) {
    let fondotitulo = _fondotitulo || ' bg-primary';
    let html = '',
        classmodal = 'class' + idmodal,
        size = !_isEmpty(_claseResponsive) ? '' : (!_isEmpty(ancho) ? `width:${ancho}px` : 'width:900px'), //(!_isEmpty(ancho) ? ancho : 900) + 'px',
        claseResponsive = _claseResponsive || '',
        fn = (fun !== null && typeof fun !== "undefined") ? fun : null,
        height = (!_isEmpty(alto)) ? alto.toString() + 'px' : 'auto',
        heightbody = (!_isEmpty(alto)) ? (parseInt(alto) - 80) + 'px' : 'auto',
        max_heightbody = heightbody,
        classtittle = !_isEmpty(fondotitulo)
            ? (fondotitulo.trim() === 'none' ? '' : ' ' + fondotitulo.trim())
            : ' bg-primary',
        classanimation = !_isEmpty(animation)
            ? (animation.trim() === 'none' ? '' : ' ' + ` animated ${animation.trim()}`)
            : '', strbackdrop = '';

    strbackdrop = (bloquearpantallaprincipal !== '' && bloquearpantallaprincipal !== undefined) ? `data-backdrop=${bloquearpantallaprincipal}` : 'data-backdrop="static"';

    if (screen.width === 1366 || screen.width === 1360) {
        height = 'auto';
        heightbody = 'auto';
        max_heightbody = '450px';
    }

    let modalinbody = document.getElementById(`modal_${idmodal}`);

    if (colocarmodalenestediv !== '' && colocarmodalenestediv !== undefined) {
        modalinbody = document.getElementById(`modal_${idmodal}`);
        if (modalinbody != null) {
            _('panelEncabezado_atx').removeChild(modalinbody);
        }
    } else {
        if (modalinbody != null) {
            document.body.removeChild(modalinbody);
        }
    }


    //wrapper wrapper-content gray-bg :add => 11-mayo-2018
    html += `<div class="modal fade ${classmodal}"  id="modal_${idmodal}" tabindex="-1" role="dialog" aria-labelledby="Titulo_" data-dismiss="modal" aria-hidden="true" ${strbackdrop}>`
    html += `   <div class="modal-dialog ${claseResponsive}" id="modal_dialog${idmodal}" style="${size};">`;
    html += `       <div class="modal-content" style='height:${height};'>`;
    html += `           <div class="modal-header${classtittle}">`;
    html += `               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
    html += `               <h4 class="modal-title" id="modal_title${idmodal}">New message</h4>`;
    html += `           </div>`;
    html += `           <div class="modal-body wrapper wrapper-content gray-bg">`;
    html += `               <div id="modal_body${idmodal}" style='height: ${heightbody}; max-height: ${max_heightbody}; overflow:auto;'>`;
    html += `                   <!--aqui va la pagina parcial-->`;
    html += `                   <div class="text-center">`;
    ////html += `                       @*<img src="~/Content/img/wait/wait30x30.gif" alt="Cargando..." />*@`;                
    html += `                   </div>`;
    html += `               </div>`;
    html += `           </div>`;
    html += `       </div>`;
    html += `   </div>`;
    html += `</div>`;

    if (colocarmodalenestediv !== '' && colocarmodalenestediv !== undefined) {
        _(colocarmodalenestediv).insertAdjacentHTML('beforeend', html);
    } else {
        $('body').append(html);
    }

    //evento  al cargar una pagina modal
    if (fn !== null) {
        $("#modal_`${idmodal}`").on("show.bs.modal", fn);
    }
    ////$("#modal_addpackinglist").on("hidden.bs.modal", function () { });
}


var _icon = {
    chk: function (id) {
        return `<label class=''><div class='icheckbox_square-green' style='position: relative;'><input type='checkbox' class='i-checks _chk' data-id='${id}' style='position: absolute; opacity: 0;'><ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins></div> </label>`
    },
    chkini: function (arr) {
        if (arr !== null && arr !== undefined && arr.length > 0) {
            $('.i-checks').iCheck({ checkboxClass: 'icheckbox_square-green', radioClass: 'iradio_square-green' });
        }
    }
}


Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

/* :FUNCION PARA AGREGAR EVENTOS A LA FILA AGREGADA EN UNA TABLA; EJEMPLO AL HACER CLICK EN ADDITEM */
function _fn_event_row(idtable, idrow, clase, fn) {
    "use strict";
    let tbl = _(idtable),
        abtn = _Array(tbl.rows[idrow].getElementsByClassName(clase));

    if (abtn !== null) {
        abtn.forEach(x => x.addEventListener('click', e => {
            fn(e);
        }));
    }
}

function _table_rows(idtablePadre) {
    let tbl = document.getElementById(idtablePadre);
    return (tbl !== null && tbl.tBodies[0] !== null && tbl.tBodies[0].rows.length > 0);
}

function _table_rows_getdataid(idtablePadre) {
    let tbl = document.getElementById(idtablePadre);
    if (tbl !== null && tbl.tBodies[0] !== null && tbl.tBodies[0].rows.length > 0) {
        let arows = _Array(tbl.tBodies[0].rows),
            aids = [];
        if (arows.length > 0 && arows[0].getAttribute('data-id') !== null) {
            arows.forEach(x => {
                aids.push(x.getAttribute('data-id'));
            })
            return aids.join(',');
        }
    }
    return '';
}

function _table_rows_getattribute(idtablePadre, dataatributo) {
    let tbl = document.getElementById(idtablePadre);
    if (tbl !== null && tbl.tBodies[0] !== null && tbl.tBodies[0].rows.length > 0) {
        let arows = _Array(tbl.tBodies[0].rows),
            aids = [];
        if (arows.length > 0 && arows[0].getAttribute(dataatributo) !== null) {
            arows.forEach(x => {
                aids.push(x.getAttribute(dataatributo));
            })
            return aids.join(',');
        }
    }
    return '';
}
//idtablePadre, clase,dataatributo
function _table_rows_getclaseattribute(oparametro) {
    let idtablePadre = oparametro.idtable,
        clase = oparametro.clase,
        dataatributo = oparametro.atributo;
    let tbl = document.getElementById(idtablePadre);
    if (tbl !== null && tbl.tBodies[0] !== null && tbl.tBodies[0].rows.length > 0) {
        let arows = _Array(tbl.tBodies[0].getElementsByClassName(clase)),
            aids = [],
            valor = '';
        arows.forEach(x => {
            aids.push(x.getAttribute(dataatributo));
        });
        return aids.length > 0 ? aids : [];
    }
    return [];
}


function _validatedetalle(idcontenedor, clase) {
    let doc = document.getElementById(idcontenedor);
    let adetalle = doc !== null ? _Array(doc.getElementsByClassName(clase)) : [];
    return adetalle.length > 0;
}


function _swal(orespuesta, titulo, fun) {
    let tipo = !_isEmpty(orespuesta.estado) ? (orespuesta.estado === 'success' ? 'success' : 'error') : 'error',
        title = !_isEmpty(titulo) ? titulo : 'Message',
        mensaje = !_isEmpty(orespuesta.mensaje) ? orespuesta.mensaje : 'Pending Message?',
        fn = (fun !== null && fun !== undefined) ? fun : null;

    swal({
        title: title,
        text: mensaje,
        type: tipo
    })
    //.then((result) => {
    //    if (result && fn) { fn() }
    //})
}

function Get_Open(url, metodo, urlbase) {
    //$('#myModalSpinner').modal('show');
    var xhr = new XMLHttpRequest(); url = urlbase + url; xhr.open("get", url, !0);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                metodo(xhr.responseText);
                //$('#myModalSpinner').modal('hide');
            } else { // error
                //$('#myModalSpinner').modal('hide');
            }
        }
    }; xhr.send()
}

// EDU: 20180220
function _validateEmail(email) {
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    return re.test(email);
}

//retorna string con formato currency
function _number_format(amount, decimals) {

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0)
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}

//retorna string con el numero de semana  y año de una fecha parametro 'dd/mm/yyyy'
function _semanadelano($fecha) {
    $const = [2, 1, 7, 6, 5, 4, 3];

    if ($fecha.match(/\//)) {
        $fecha = $fecha.replace(/\//g, "-", $fecha);
    };

    $fecha = $fecha.split("-");

    $dia = eval($fecha[0]);
    $mes = eval($fecha[1]);
    $ano = eval($fecha[2]);
    if ($mes != 0) {
        $mes--;
    };

    $dia_pri = new Date($ano, 0, 1);
    $dia_pri = $dia_pri.getDay();
    $dia_pri = eval($const[$dia_pri]);
    $tiempo0 = new Date($ano, 0, $dia_pri);
    $dia = ($dia + $dia_pri);
    $tiempo1 = new Date($ano, $mes, $dia);
    $lapso = ($tiempo1 - $tiempo0)
    $semanas = Math.floor($lapso / 1000 / 60 / 60 / 24 / 7);

    if ($dia_pri == 1) {
        $semanas++;
    };

    if ($semanas == 0) {
        $semanas = 52;
        $ano--;
    };

    if ($ano < 10) {
        $ano = '0' + $ano;
    };

    return $semanas;
}

function _nombremes($mes) {

    let mes = '';

    switch (parseInt($mes)) {
        case 1:
            mes = 'January'
            break;
        case 2:
            mes = 'February'
            break;
        case 3:
            mes = 'March'
            break;
        case 4:
            mes = 'April'
            break;
        case 5:
            mes = 'May'
            break;
        case 6:
            mes = 'June'
            break;
        case 7:
            mes = 'July'
            break;
        case 8:
            mes = 'August'
            break;
        case 9:
            mes = 'September'
            break;
        case 10:
            mes = 'October'
            break;
        case 11:
            mes = 'November'
            break;
        default:
            mes = 'December'
    }

    return mes;

}

function _getCleanedString(cadena) {
    // Definimos los caracteres que queremos eliminar
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
        cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toUpperCase();

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    //cadena = cadena.replace(/\s/gi, "");
    return cadena;
}
function Mayus(e) {
    e.value = e.value.toUpperCase();
}

function fn_colapsardivs(iddivcontenedor) {
    let d = _(iddivcontenedor);
    let fn_colapsardivs2 = (e) => {
        let o = e.currentTarget;
        let divpadre = o.parentNode.parentNode.parentNode, divcontent = divpadre.getElementsByClassName('ibox-content')[0], spntools = o.getElementsByClassName('icono_collapse')[0];
        let estaoculto = divcontent.classList.value.indexOf('hide');
        if (estaoculto < 0) {  //  ESTA VISIBLE
            divcontent.classList.add('hide');
            spntools.classList.remove('fa-chevron-up');
            spntools.classList.add('fa-chevron-down');
        } else { // ESTA OCULTO
            divcontent.classList.remove('hide');
            spntools.classList.remove('fa-chevron-down');
            spntools.classList.add('fa-chevron-up');
        }
    }

    let arrcollapse = Array.from(d.getElementsByClassName('collapse-link'));
    arrcollapse.forEach(x => x.addEventListener('click', e => { fn_colapsardivs2(e) }));
}

function fn_colapsardivs_circle(iddivcontenedor) {
    let d = _(iddivcontenedor);
    let fn_colapsardivs2 = (e) => {
        let o = e.currentTarget;
        let divpadre = o.parentNode.parentNode.parentNode, divcontent = divpadre.getElementsByClassName('ibox-content')[0], spntools = o.getElementsByClassName('icono_collapse')[0];
        let estaoculto = divcontent.classList.value.indexOf('hide');
        if (estaoculto < 0) {  //  ESTA VISIBLE
            divcontent.classList.add('hide');
            spntools.classList.remove('fa-chevron-circle-up');
            spntools.classList.add('fa-chevron-circle-down');
        } else { // ESTA OCULTO
            divcontent.classList.remove('hide');
            spntools.classList.remove('fa-chevron-circle-down');
            spntools.classList.add('fa-chevron-circle-up');
        }
    }

    let arrcollapse = Array.from(d.getElementsByClassName('collapse-link'));
    arrcollapse.forEach(x => x.addEventListener('click', e => { fn_colapsardivs2(e) }));
}

function crearCodigoGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}

function notifyMe(titulo, opciones) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(titulo, opciones);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(titulo, opciones);
            }
        });
    }
}

/* Jacob */
function _escapeXml(str) {
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function _capitalizeWord(str) {
    let string = '';
    if (_isnotEmpty(str)) {
        str = str.replace(/\s+/g, " ");
        str = str.trim();
        string = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return string;
}

//Anterior
//function _capitalizePhrase(str) {
//    str = str.split(" ");
//    for (let i = 0, x = str.length; i < x; i++) {
//        str[i] = str[i][0].toUpperCase() + str[i].substr(1).toLowerCase();
//    }
//    return str.join(" ");
//}

//ES6
function _capitalizePhrase(str) {
    let string = '';
    if (_isnotEmpty(str)) {
        str = str.replace(/\s+/g, " ");
        str = str.trim();
        str = str.split(" ")
        string = str.map(str => str[0].toUpperCase() + str.substr(1).toLowerCase()).join(" ");
    }
    return string;
}

//_scrollTo("#id") o _scrollTo(0) - Up / _scrollTo(1) Down
function _scrollTo(id) {
    let html = document.documentElement;
    html.style.scrollBehavior = "smooth";

    if (_(id)) {
        _(id).scrollIntoView();
    } else {
        if (id === 0) {
            html.scrollTop += -document.body.scrollHeight;
        } else {
            html.scrollTop += document.body.scrollHeight;
        }
    }
}

function _modalBody_new(oparametro) {// {url,idventana,urlJS}
    let url = oparametro.url,
        ventana = oparametro.ventana,
        ancho = oparametro.ancho || '',
        alto = oparametro.alto || '',
        _parametro = oparametro.parametro || '',
        fondotitulo = oparametro.fondotitulo || '',
        efecto = oparametro.efecto || '',
        claseResponsivo = oparametro.responsive || '', colocarmodalenestediv = oparametro.colocarmodalenestediv || '', bloquearpantallaprincipal = oparametro.bloquearpantallaprincipal || '';

    if (!_isEmpty(ventana)) {

        _promise().then(function () {
            _modal_new(ventana, ancho, alto, null, fondotitulo, efecto, claseResponsivo, colocarmodalenestediv, bloquearpantallaprincipal);
        }).then(function () {
            let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                titulo = _(`modal_title${ventana}`),
                body = _(`modal_body${ventana}`),
                _err = function (error) { console.log("error", error) }

            titulo.innerHTML = !_isEmpty(oparametro.titulo) ? oparametro.titulo : 'Titulo';
            $(`#modal_${ventana}`).modal({
                backdrop: false, show: true
            });
            $('#modal_dialog' + ventana).draggable({
                handle: '.modal-header'
            });

            _Get(url)
                .then((vista) => {
                    let contenido = (_parametro !== '') ? vista.replace('DATA-PARAMETRO', _parametro) : vista;
                    body.innerHTML = contenido;
                }, (p) => { _err(p) })
                .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
        })
    }
}

function _modal_new(idmodal, ancho, alto, fun, _fondotitulo, animation, _claseResponsive, colocarmodalenestediv, bloquearpantallaprincipal) {
    let fondotitulo = _fondotitulo || ' bg-primary';
    let html = '',
        classmodal = 'class' + idmodal,
        size = !_isEmpty(_claseResponsive) ? '' : (!_isEmpty(ancho) ? `width:${ancho}px` : 'width:900px'), //(!_isEmpty(ancho) ? ancho : 900) + 'px',
        claseResponsive = _claseResponsive || '',
        fn = (fun !== null && typeof fun !== "undefined") ? fun : null,
        height = (!_isEmpty(alto)) ? alto.toString() + 'px' : 'auto',
        width = (!_isEmpty(ancho)) ? ancho.toString() + 'px' : 'auto',
        heightbody = (!_isEmpty(alto)) ? (parseInt(alto)) + 'px' : 'auto',
        max_heightbody = heightbody,
        classtittle = !_isEmpty(fondotitulo)
            ? (fondotitulo.trim() === 'none' ? '' : ' ' + fondotitulo.trim())
            : ' bg-primary',
        classanimation = !_isEmpty(animation)
            ? (animation.trim() === 'none' ? '' : ' ' + ` animated ${animation.trim()}`)
            : '', strbackdrop = '';

    strbackdrop = (bloquearpantallaprincipal !== '' && bloquearpantallaprincipal !== undefined) ? `data-backdrop=${bloquearpantallaprincipal}` : 'data-backdrop="static"';

    if (screen.width === 1366 || screen.width === 1360) {
        height = 'auto';
        heightbody = 'auto';
        max_heightbody = '450px';
    }

    let modalinbody = document.getElementById(`modal_${idmodal}`);

    if (colocarmodalenestediv !== '' && colocarmodalenestediv !== undefined) {
        modalinbody = document.getElementById(`modal_${idmodal}`);
        if (modalinbody != null) {
            _('panelEncabezado_atx').removeChild(modalinbody);
        }
    } else {
        if (modalinbody != null) {
            document.body.removeChild(modalinbody);
        }
    }


    //wrapper wrapper-content gray-bg :add => 11-mayo-2018
    html += `<div class="modal fade ${classmodal}"  id="modal_${idmodal}" tabindex="-1" role="dialog" aria-labelledby="Titulo_" data-dismiss="modal" aria-hidden="true" ${strbackdrop}>`
    html += `   <div class="modal-dialog ${claseResponsive}" id="modal_dialog${idmodal}" style="${size};">`;
    html += `       <div class="modal-content" style='height:${height};width:${width};'>`;
    html += `           <div class="modal-header${classtittle}">`;
    html += `               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
    html += `               <h4 class="modal-title" id="modal_title${idmodal}">New message</h4>`;
    html += `           </div>`;
    html += `           <div class="modal-body wrapper wrapper-content gray-bg">`;
    html += `               <div id="modal_body${idmodal}" >`;
    html += `                   <!--aqui va la pagina parcial-->`;
    html += `                   <div class="text-center">`;
    ////html += `                       @*<img src="~/Content/img/wait/wait30x30.gif" alt="Cargando..." />*@`;                
    html += `                   </div>`;
    html += `               </div>`;
    html += `           </div>`;
    html += `       </div>`;
    html += `   </div>`;
    html += `</div>`;

    if (colocarmodalenestediv !== '' && colocarmodalenestediv !== undefined) {
        _(colocarmodalenestediv).insertAdjacentHTML('beforeend', html);
    } else {
        $('body').append(html);
    }

    //evento  al cargar una pagina modal
    if (fn !== null) {
        $("#modal_`${idmodal}`").on("show.bs.modal", fn);
    }
    ////$("#modal_addpackinglist").on("hidden.bs.modal", function () { });
}

function _getDate103(fecha) {
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

function _getDate101(fecha) {
    let hoy;
    if (fecha == null) {
        hoy = new Date();
    } else {
        hoy = new Date(fecha);
    }
    let dia = String(hoy.getDate()).padStart(2, '0');
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let anio = hoy.getFullYear();
    hoy = `${mes}/${dia}/${anio}`;
    return hoy;
}

function _getDate102(fecha) {
    let hoy;
    if (fecha == null) {
        hoy = new Date();
    } else {
        hoy = new Date(fecha);
    }
    let dia = String(hoy.getDate()).padStart(2, '0');
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let anio = hoy.getFullYear();
    hoy = `${anio}-${mes}-${dia}`;
    return hoy;
}

function _getDate102Full(fecha) {
    let hoy;
    if (fecha == null) {
        hoy = new Date();
    } else {
        hoy = new Date(fecha);
    }
    let dia = String(hoy.getDate()).padStart(2, '0');
    let mes = String(hoy.getMonth() + 1).padStart(2, '0');
    let anio = hoy.getFullYear();

    let horas = String(hoy.getHours()).padStart(2, '0');
    let minutos = hoy.getMinutes()
    hoy = `${anio}-${mes}-${dia} ${horas}:${minutos}:00`;
    return hoy;
}

// Configuracion Idioma Español Datepicker
// Para usar agregar language: "es"
function _initializeDatepicker() {
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
    // Init
    $('.date.date-es').datepicker({
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: "es"
    });
}

// Crear Excel en HTML5
//_createExcel({
//    worksheet: 'Nombre de pestaña',
//    style: '.th-text {background-color: #000000; color: white;}',
//    table: '<table border="1"></table>',
//    filename: 'Nombre de archivo'
//});
function _createExcel(_json) {
    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><style>{style}</style>{table}</body></html>';
    var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };

    var format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
        })
    };

    var ctx = {
        worksheet: _json.worksheet,
        style: _json.style,
        table: _json.table
    }

    var link = document.createElement("a");
    link.download = _json.filename + ".xls";
    link.href = uri + base64(format(template, ctx));
    link.click();
}

function _parameterEncodeJSON(par) {
    let p1 = par.replace(/{/g, "~").replace(/}/g, "┬");
    let p2 = p1.replace(/\"/g, "┼");  //alt + 197 = ┼
    return p2;
}

function _parameterUncodeJSON(par) {
    let p1 = par.replace(/~/g, "{").replace(/┬/g, "}");
    let p2 = p1.replace(/┼/g, "\"");  //alt + 197 = ┼
    return p2;
}

//// ESTA FUNCION USAR CUANDO SE NECESITA FORMATEAR UN SUB PARAMETRO PARA UNA VENTANA A PASAR; COMO POR EJEMPLO UN DATA DE IMAGE
function _subparameterEncode(par) {
    let p1 = par.replace(/{/g, "~").replace(/}/g, "┬");
    p1 = p1.replace(/\"/g, "┼");  //alt + 197 = ┼
    p1 = p1.replace(/,/g, "Ç"); //alt + 128 = Ç
    p1 = p1.replace(/:/g, "╔"); //alt + 457 = ╔
    return p1;
}

function _subparameterUncode(par) {
    let p1 = par.replace(/~/g, "{").replace(/┬/g, "}");
    p1 = p1.replace(/┼/g, "\"");  //alt + 197 = ┼
    p1 = p1.replace(/Ç/g, ",");  // alt + 128 = Ç
    p1 = p1.replace(/╔/g, ":");  // alt + 457 = ╔
    return p1;
}

// Jacob funciones para tabs
function _initializeIboxTools() {
    // Collapse
    $('.collapse-link').click(function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    });

    // Cerrar
    $('.close-link').click(function () {
        var content = $(this).closest('div.ibox');
        content.remove();
    });

    // Fullscreen
    $('.fullscreen-link').click(function () {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function () {
            $(window).trigger('resize');
        }, 100);
    });

    // Option pane
    $(".option-link").parent().click(function () {
        var id = $(this).find(".option-link").data("id");
        $(".option-tab").removeClass("active");
        $(id).addClass("active");
    });
}

//12/03/2010 09:55:35 - solo para español
function _strToDate(dtStr) {    
    let dateParts = dtStr.split("/");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], '00');
}

function _isEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function _getDatesBetween (start, end) {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
}

function _censorFirst(input, str) {
    return input.split("").map(function (char, index) {
        if (index === 0) {
            return char;
        } else {
            return str;
        }
    }).join("");
}

function _censorFirstLast(input, str) {
    return input.split("").map(function (char, index) {
        if (index === 0 || index === (input.length - 1)) {
            return char;
        } else {
            return str;
        }
    }).join("");
}

function _showSpinner() {
    $("#custom-spinner").addClass("show");
}

function _hideSpinner() {
    $("#custom-spinner").fadeOut(1000, function () {
        $(this).removeClass("show")
    });
}

/* New Modal (Con backdrop incluido) */
function _modalBody_Backdrop(oparametro) {
    let url = oparametro.url,
        idmodal = oparametro.idmodal,
        paremeter = oparametro.paremeter || '',
        title = oparametro.title,
        width = oparametro.width || '',
        height = oparametro.height || '',
        backgroundtitle = oparametro.backgroundtitle || '',
        classanimation = oparametro.animation || '',
        claseresponsive = oparametro.responsive || '',
        disabledkeyboard = oparametro.bloquearteclado || '';
        staticmodal = oparametro.modalfijo || '';
    if (!_isEmpty(idmodal)) {
        _promise().then(function () {
            _modal_Backdrop(idmodal, width, height, backgroundtitle, classanimation, claseresponsive, disabledkeyboard, staticmodal);
        }).then(function () {
            let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                modal_header = _(`modal_header_${idmodal}`),
                modal_title = _(`modal_title_${idmodal}`),
                modal_body = _(`modal_body_${idmodal}`),
                _err = function (error) { console.log("error", error) }

            modal_title.innerHTML = !_isEmpty(title) ? title : 'Titulo';
            $(`#modal_${idmodal}`).modal({ show: true });

            _Get(url)
                .then((vista) => {
                    let contenido = (paremeter !== '') ? vista.replace('DATA-PARAMETRO', paremeter) : vista;
                    modal_body.innerHTML = contenido;
                }, (p) => { _err(p) })
                .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
        });
    }
}

function _modal_Backdrop(_idmodal, _width, _height, _backgroundtitle, _classanimation, _claseresponsive, _disabledkeyboard, _static = false) {
    let classbackgroundtitle = _backgroundtitle || 'bg-primary';
    let html = '',
        classmodal = 'class' + _idmodal,
        width = !_isEmpty(_claseresponsive) ? '' : (!_isEmpty(_width) ? `width:${_width}px` : 'width:900px'),
        claseresponsive = _claseresponsive || '',
        height = (!_isEmpty(_height)) ? _height.toString() + 'px;' : 'auto;',
        heightbody = (!_isEmpty(_height)) ? (parseInt(_height) - 80) + 'px' : 'auto',
        max_heightbody = heightbody,
        classtittle = classbackgroundtitle,
        classanimation = !_isEmpty(_classanimation) ? (_classanimation.trim() === 'none' ? '' : ' ' + ` animated ${_classanimation.trim()}`) : '';
    disabledkeyboard = _isnotEmpty(_disabledkeyboard) ? true : false;

    let modalinbody = document.getElementById(`modal_${_idmodal}`);
    if (modalinbody != null) {
        document.body.removeChild(modalinbody);
    }
    let defaulttitle = 'New';

    html += `<div id='modal_${_idmodal}' class='modal_backdrop modal fade ${classmodal}' tabindex="-1" role='dialog' data-dismiss='modal' data-keyboard="${disabledkeyboard === false ? true : false}" ${_static === true ? "data-backdrop='static'" : ""}>`;
    html += `   <div id='modal_dialog_${_idmodal}' class='modal-dialog ${claseresponsive}'>`;
    html += `       <div id='modal_content_${_idmodal}' class='modal-content' style='height:${height}'>`;
    html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
    html += `               <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>`;
    html += `               <h4 id='modal_title_${_idmodal}' class='modal-title'>${defaulttitle}</h4>`;
    html += `           </div>`;
    html += `           <div id='modal_body_${_idmodal}' class='modal-body' style="padding: 10px 30px 30px 30px;">`;
    html += `           </div>`;
    html += `       </div>`;
    html += `   </div>`;
    html += `</div>`;

    $('body').append(html);
}

/* parameter Objeto */
//obj:{ id: "#iddivcontenedorPadre", array: ['#id1', '#id2'] }
function _required_arrayid(obj) {
    const idpadre = obj.id;
    let bool = true;
    // REMOVE HAS-ERROR
    $(`${idpadre} .form-group`).removeClass("has-error");
    // APPLY HAS ERROR AGAIN
    obj.array.forEach(x => {
        const tagname = $(`${idpadre} ${x}`).prop("tagName");
        const value = $(`${idpadre} ${x}`).val();
        if (tagname === 'TEXTAREA' || tagname === 'INPUT') {
            if (value === '' || value === null) {
                bool = false;
                $(`${idpadre} ${x}`).closest(".form-group").addClass("has-error");
                // EN CASO SEA FLOAT LABEL
                $(`${idpadre} ${x}`).closest(".has-float-label").addClass("has-error");
            }
        } else if (tagname === 'SELECT') {
            if (value === '0' || value === '' || value === null) {
                // NULL SI ES SELECT2 O CHOOSEN -- SOLO SE AGREGO CLASE HAS-ERROR PARA SELECT2
                bool = false;
                $(`${idpadre} ${x}`).closest(".form-group").addClass("has-error");
                // EN CASO SEA FLOAT LABEL
                $(`${idpadre} ${x}`).closest(".has-float-label").addClass("has-error");
            }
        }
    });
    return bool;
}

/* parameter Objeto */
//obj:{ id: "#iddivcontenedorPadre", array: ['#id1', '#id2'] }
function _getParameter_arrayid(obj) {
    const idpadre = obj.id;
    let json = {};
    obj.array.forEach(x => {
        const index = $(`${idpadre} ${x}`).data("id");
        const value = $(`${idpadre} ${x}`).val();
        json[index] = value;
    });
    return json;
}

function _truncateWithEllipses(text, max) {
    text = _removeAditionalSpaces(text);
    return text.substr(0, max - 1) + (text.length > max ? '...' : '');
}

function _removeAditionalSpaces(str) {
    return str.replace(/\s+/g, " ");
}

function _dispatchEvent(id, event) {
    const element = _(id);
    const _event = new Event(event);
    element.dispatchEvent(_event);
}

function _all(selector) {
    return [...document.querySelectorAll(selector)];
}

function _disableAutoComplete(id = null) {
    if (id !== null) {
        _(id).setAttribute("autocomplete", "off");
    } else {
        _all(".modal input").forEach(x => x.setAttribute("autocomplete", "off"));
        _all("#divContenido input").forEach(x => x.setAttribute("autocomplete", "off"));
    }
}

function _toastr(title, text) {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 5000
    };
    toastr.success(title, text);
}

function _collapseMenu() {
    $("body").addClass("mini-navbar");
    SmoothlyMenu();
}

/* PARA VALIDAR PERMISOS */
function _setUserInfo() {
    // Clean localstorage
    localStorage.removeItem("UserInfo");

    const err = function (__err) { console.log('err', __err) },
        parametro = { x: '' }
    _Get('Seguridad/Permisos/GetUserInfo?par=' + JSON.stringify(parametro))
        .then((r) => {
            const data = r !== '' ? JSON.parse(r) : null;
            if (data !== null) {
                localStorage.setItem("UserInfo", JSON.stringify(data));
            }
        }, (p) => { err(p); });
}

function _getUserInfo() {
    const data = localStorage.getItem("UserInfo");
    return data !== '' ? JSON.parse(data) : '';
}

function _setUserPermissions(Controller, View) {
    // Clean localstorage
    localStorage.removeItem("UserPermissions");

    const err = function (__err) { console.log('err', __err) },
        parametro = { Controller: Controller, View: View };
    _Get('Seguridad/Permisos/GetUserPermissions?par=' + JSON.stringify(parametro))
        .then((r) => {
            const data = r !== '' ? JSON.parse(r) : null;
            if (data !== null) {
                localStorage.setItem("UserPermissions", JSON.stringify(data));
            }
        }, (p) => { err(p); });
}

function _getUserPermissions() {
    const data = localStorage.getItem("UserPermissions");
    return data !== '' ? JSON.parse(data) : '';
}

function _checkPermissions(Type, Action) {
    let bool = false
    const data = _getUserPermissions();
    if (data !== null) {
        data.forEach(x => {
            if (x.Tipo === Type) {
                const json = x.Accion !== '' ? JSON.parse(x.Accion) : null;
                if (json !== null) {
                    const filter = json.filter(x => x.codigo === Action);
                    filter.length > 0 ? bool = true : null;
                }
            }
        });
    } else {
        bool = false;
    }
    return bool;
}

function _checkRowInfo(id, data, accion, hasuser = true) {
    let bool = false;
    const user = _getUserInfo();
    if (hasuser) {
        if (_isnotEmpty(id) && _isnotEmpty(data) && _isnotEmpty(accion)) {
            if (data.UsuarioCreacion === user.Usuario) {
                bool = true;
            } else {
                if (data.IdGrupoPersonal === user.IdGrupoPersonal.toString()) {
                    // OWNGROUP
                    bool = _checkPermissions('OWNGROUP', accion);
                } else {
                    // OTHERGROUP
                    bool = _checkPermissions('OTHERGROUP', accion);
                }
            }
        }
    } else {
        if (id === user.IdGrupoPersonal.toString()) {
            // OWNGROUP
            bool = _checkPermissions('OWNGROUP', accion);
        } else {
            // OTHERGROUP
            bool = _checkPermissions('OTHERGROUP', accion);
        }
    }
    return bool;
}


function LimpiarEspacio(valor) {
    if (valor.toString().length > 1) {
        return valor.toString().trim();
    }
    return valor;
}

function formClean(frm) {
    var frmRes = new FormData();
    [...frm].forEach(x => {
        frmRes.append(x[0], LimpiarEspacio(x[1]))
    });
    return frmRes;
}

function _jquery_confirm(title, content, fn) {
    const icon = 'fa fa-warning';
    const color = 'orange';
    $.confirm({
        title: title,
        content: content,
        icon: icon,
        type: color,
        typeAnimated: true,
        buttons: {
            confirm: {
                text: 'Ok',
                btnClass: 'btn-blue',
                action: function (e) {
                    $(e.el[0]).prop("disabled", true);
                    fn();
                }
            },
            cancel: function () { }
        }
    });
}

function _jquery_alert(title, content, type) {
    const icon = type === 'success' ? 'check' : type === 'warning' ? 'warning' : type === 'error' ? 'close' : '';
    const color = type === 'success' ? 'green' : type === 'warning' ? 'orange' : type === 'error' ? 'red' : '';
    $.alert({
        title: title,
        content: content,
        icon: icon !== '' ? `fa fa-${icon}` : '',
        type: color,
        typeAnimated: true
    });
}

function _jquery_alert_callback(title, content, type, fn = null) {
    const icon = type === 'success' ? 'check' : type === 'warning' ? 'warning' : type === 'error' ? 'close' : '';
    const color = type === 'success' ? 'green' : type === 'warning' ? 'orange' : type === 'error' ? 'red' : '';
    $.confirm({
        title: title,
        content: content,
        icon: icon !== '' ? `fa fa-${icon}` : '',
        type: color,
        typeAnimated: true,
        buttons: {
            confirm: {
                text: 'Ok',
                action: function (e) {
                    $(e.el[0]).prop("disabled", true);
                    fn !== null ? fn() : null;
                }
            }
        }
    });
}
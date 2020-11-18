function _(id) {
 return document.getElementById(id)
}  
function urlBase() {
    var url = document.getElementById("urlBase").value;
    url = _isEmpty(url) ? Url.Content("~/") : url;   
    return url;
}

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


function _Post(oParametros,spinner) {
    var url = oParametros.url || '', frm = oParametros.form || null, spinner = spinner || false;
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
};

function _Promise(t) {
    let ml = t | 100;
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ml);
    });
}

function getParameter(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function toObject(cadena) {
    if (cadena.trim().length > 0) {
        let delimitadorFila = cadena.indexOf(';') >= 0 ? ';'
                              : (cadena.indexOf(',') >= 0 ? ',' : '');
        if (delimitadorFila.length > 0) {
            let arr = cadena.split(delimitadorFila);
            if (arr.length > 0) {
                let obj = {};
                arr.forEach(x => {
                    const [_key, _value] = x.split(':');
                    obj[_key] = _value;
                })
                return obj;
            }
        }
    }
    return null;    
}

function getDelimitador(fecha) {
    let delimitador = fecha.indexOf('/') > 0
        ? '/' : fecha.indexOf('-')
            ? '-' : fecha.indexOf(':')
                ? ':' : ' ';
    return delimitador;
}

function toANSI(fecha_mmddyyy) {
    let retorno = ' ',
        afecha = [],
        delimitador = '';
    if (fecha_mmddyyy !== null && fecha_mmddyyy.length > 0) {
        delimitador = getDelimitador(fecha_mmddyyy);
        afecha = fecha_mmddyyy.split(delimitador);
        if (afecha.length > 1) {
            retorno = `${afecha[2]}${afecha[0]}${afecha[1]}`;
        }
    }
    return retorno;
}

function _isEmpty(campo) { return (campo === null || typeof campo === 'undefined' || campo.toString().trim().length === 0); }
function _oisEmpty(campo) { return (campo === null || typeof campo === 'undefined' || Object.keys(campo).length == 0) };
function _aisEmpty(campo) { return (campo === null || typeof campo === 'undefined' || campo.length === 0) };
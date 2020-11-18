var ovariables = {
    arrbotones: ''
}

function load() {
    $('.footable').footable();
    _('btnNew').addEventListener('click', req_new);
    _('cboEstadoSolicitud').addEventListener('change', fn_load_botones);
}

function req_new() {
    let urlaccion = 'Seguridad/BotonesxVentana/New', urljs = 'Seguridad/BotonesxVentana/New';
    _Go_Url(urlaccion, urljs);
}

function req_ini() {
    let urlaccion = 'Seguridad/BotonesxVentana/BotonesxVentana_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.arrbotones = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { }
        if (JSON.parse(orpta[2] != '')) { }

        fn_load_botones();
    }
}

function fn_load_botones() {
    let arrbotones = ovariables.arrbotones;
    let estado = _parseInt(_('cboEstadoSolicitud').value);
    if (arrbotones.length > 0) {
        let result = arrbotones.filter(x=>x.Estado === estado);
        let html = '';
        result.forEach(x=> {
            let preview = `<button id='${x.IdBoton}' class='${x.Clase}'>
                            <span class ='${x.Icono}'></span>
                            ${x.Nombre}
                        </button>`;
            html += `
            <tr ondblclick='req_edit("${x.IdBotonFuncionVentana}","${x.Estado}")'>
                <td class ='col-sm-1 text-center'>${preview}</td>
                <td class ='col-sm-1'>${x.IdBoton}</td>
                <td class ='col-sm-2'>${x.Agrupador}</td>
                <td class ='col-sm-1'>${x.Accion}</td>
                <td class ='col-sm-2'>${x.Titulo}</td>
                <td class ='col-sm-2'>${x.ventana}</td>
                <td class ='col-sm-2'>${x.funcion}</td>
            </tr>
            `
        });
        _('contentBotones').tBodies[0].innerHTML = html;
        $('.footable').trigger('footable_resize');
    }
}

function req_edit(_id, _estado) {
    let urlaccion = 'Seguridad/BotonesxVentana/Edit', urljs = urlaccion;
    if (_estado == '0') {
        _Go_Url(urlaccion, urljs, 'id:' + _id);
    }
}

(function ini() {
    load();
    req_ini();
})()
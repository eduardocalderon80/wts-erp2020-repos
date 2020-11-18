var ovariables = {
    equipotic: '',
    estado:'',
    tiposolicitud: '',
    arrsolicitud: '',
    arrequipotic: '',
    arrestado: '',
    infopersonal: '',
    infohelpdesk: '',
    infoaprobadorxmodulo: '',
    infoaprobadorxarea: '',

}

function load() {
    $('.footable').footable();
    _('btnNew').addEventListener('click', fn_new);

    _modal('selection', 'auto');
    $('#modal_selection').on('show.bs.modal', fn_executemodal);

    _('cboEquipoTIC').addEventListener('change', fn_load_solicitud);
    _('cboEstadoSolicitud').addEventListener('change', fn_load_solicitud);
}

function req_infouser() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Info';
    Get(urlaccion, res_infouser);
}

function res_infouser(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.infopersonal = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.infohelpdesk = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.infoaprobadorxmodulo = JSON.parse(orpta[2]); }
        if (JSON.parse(orpta[3] != '')) { ovariables.infoaprobadorxarea = JSON.parse(orpta[3]); }
        fn_getinfopersonal(ovariables.infopersonal, ovariables.infohelpdesk, ovariables.infoaprobadorxmodulo, ovariables.infoaprobadorxarea);       
        req_ini();
    }
}

function fn_getinfopersonal(_infopersonal, _infohelpdesk, _infoapromodulo, _infoaproarea) {
    let infopersonal = _infopersonal[0];
    ovariables.infopersonalidpersonal = infopersonal.IdPersonal;
    ovariables.infopersonalidarea = infopersonal.IdArea;
    _("hf_IdSolicitud").value = ovariables.idsolicitud;
    _("hf_IdPersonal").value = ovariables.infopersonalidpersonal;

    let infohelpdesk = _infohelpdesk[0] != null ? _infohelpdesk[0] : 0;
    ovariables.infohelpdeskejecutor = infohelpdesk.IdGrupoEjecutor != null ? infohelpdesk.IdGrupoEjecutor : infohelpdesk;
    ovariables.infohelpdeskequipotic = infohelpdesk.IdEquipoTIC != null ? infohelpdesk.IdEquipoTIC : infohelpdesk;
}

function fn_executemodal() {
    let modal = $(this);
    modal.find('.modal-title').text('Nueva Solicitud');

    let urlaccion = 'TecnologiaInformacion/HelpDesk/Select';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodyselection').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function fn_load_selection(_equipotic, _tiposolicitud) {
    let arrtic = _equipotic;
    let arrtipo = _tiposolicitud;
}

function fn_new() {
    $('#modal_selection').modal('show');
}

function _fn_modal(idmodal){
     let fondotitulo = ' bg-success';
    let fun;
    let html = '', fn = (fun !== null && typeof fun !== "undefined") ? fun : null;

    let modalinbody = document.getElementById(`modal_${idmodal}`);
    if (modalinbody != null) {
        document.body.removeChild(modalinbody);
    }

    html += `<div id="modal_${idmodal}"  class="modal fade" tabindex="-1" role="dialog" aria-labelledby="Titulo_" data-dismiss="modal" aria-hidden="true" data-backdrop="static">`
    html += `   <div id="modal_dialog${idmodal}" class="modal-dialog" style="widht:auto">`;
    html += `       <div class="modal-content" style="height:auto">`;
    html += `           <div class="modal-header${fondotitulo}">`;
    html += `               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
    html += `               <h4 id="modal_title${idmodal}" class="modal-title text-center"></h4>`;
    html += `           </div>`;
    html += `           <div class="modal-body wrapper wrapper-content gray-bg">`;
    html += `               <div id="modal_body${idmodal}" style='height:auto; max-height:auto;overflow:auto;'>`;
    html += `               </div>`;
    html += `           </div>`;
    html += `       </div>`;
    html += `   </div>`;
    html += `</div>`;

    $('body').append(html);

    if (fn !== null) {
        $("#modal_`${idmodal}`").on("show.bs.modal", fn);
    }
}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_List';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.arrsolicitud = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.arrequipotic = JSON.parse(orpta[1]); fn_load_equipotic(ovariables.arrequipotic); }
        if (JSON.parse(orpta[2] != '')) { ovariables.arrestado = JSON.parse(orpta[2]); fn_load_estado(ovariables.arrestado) }

        fn_load_filter();
        fn_load_solicitud();
    }
}

function fn_load_filter() {
    try {
        if (ovariables_detail.par_filter != '') {
            ovariables_detail.par_filter = ovariables_detail.par_filter.replace(/=/gi, ':');
            let arr = ovariables_detail.par_filter.split('¬');
            let idequipotic = _par(arr[0], 'idequipotic'), idestado = _par(arr[1], 'idestado');
            ovariables.equipotic = idequipotic;
            ovariables.estado = idestado;
            _('cboEquipoTIC').value = ovariables.equipotic;
            _('cboEstadoSolicitud').value = ovariables.estado;
        }
    } catch (e) { }
}

function fn_load_equipotic(_arrequipotic) {
    if (_arrequipotic.length > 0) {
        let html = `<option value='0'>Todos</option>`;
        _arrequipotic.forEach(x=> { html += `<option value=${x.IdEquipoTIC}>${x.EquipoTIC}</option>`; })
        _('cboEquipoTIC').innerHTML = html;
    }
}

function fn_load_estado(_arrestado) {
    if (_arrestado.length > 0) {
        let html = `<option value='0'>Todos</option>`;
        _arrestado.forEach(x=> { html += `<option value=${x.IdEstado}>${x.NombreEstado}</option>`; })
        _('cboEstadoSolicitud').innerHTML = html;
    }
}

function fn_load_solicitud() {
    let array = ovariables.arrsolicitud;
    let html = '';
    let result = '';
    let idequipotic = _('cboEquipoTIC').value;
    let idestado = _('cboEstadoSolicitud').value;  

    if (idequipotic == '0' && idestado == '0') { result = array; }
    else if (idequipotic != '0' && idestado == '0') {
        result = array.filter(x=> x.IdEquipoTIC.toString() === idequipotic);
    }
    else if (idequipotic == '0' && idestado != '0') {
        result = array.filter(x=> x.IdEstado.toString() === idestado);
    }
    else {
        result = array.filter(x=> x.IdEquipoTIC.toString() === idequipotic && x.IdEstado.toString() === idestado);
    }
    if (result.length > 0) {
        result.forEach(x=> {
            let estado = x.IdEstado;
            if (estado === 1) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-info btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 2) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-warning btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 3) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-white btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 4) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-primary btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 5) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-success btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 6) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-danger btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            if (estado === 7) { html += `<tr><td class='col-sm-1 text-center'><button class='text-center btn btn-outline btn-danger btn-block' onclick="req_detail('${x.IdSolicitud}')">${x.NombreEstado}</button></td>` }
            html += `
                <td class ='col-sm-1 text-center'>${x.NumeroSolicitud}</td>
                <td class ='col-sm-2'>${x.NombreSolicitante}</td>
                <td class ='col-sm-1'>${x.EquipoTIC}</td>
                <td class ='col-sm-1'>${x.TipoSolicitud}</td>
                <td class ='col-sm-2'>${x.Categoria}</td>
                <td class ='col-sm-2'>${x.NombreResponsable}</td>
                <td class ='col-sm-1'>${x.FechaInicio}</td>
                <td class ='col-sm-1'>${x.FechaPropuesta}</td>
                </tr>
            `
        });
    }
    _('contenTableDetails').tBodies[0].innerHTML = html;
    $('.footable').trigger('footable_resize');
}

function req_detail(_idsolicitud) {   
    let par_filter = 'idequipotic=' + _('cboEquipoTIC').value + '¬idestado=' + _('cboEstadoSolicitud').value;    
    let urlaccion = 'TecnologiaInformacion/HelpDesk/Detail';
    _Go_Url(urlaccion, urlaccion, 'idsolicitud:' + _idsolicitud + ',par_filter:' + par_filter);
}

(function ini() {
    load();
    req_infouser();
})();
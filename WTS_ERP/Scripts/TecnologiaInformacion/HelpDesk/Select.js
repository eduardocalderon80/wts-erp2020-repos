var ovariables = {
    equipotic: '',
    tiposolicitud: '',
    estado: '0',
}

function load() {

}

function fn_new(_equipotic, _tiposolicitud) {

    $('#modal_selection').modal('hide');
    let par = ovariables.estado + '¬' + _equipotic + '¬' + _tiposolicitud;
    let urlaccion = 'TecnologiaInformacion/HelpDesk/New';
    _Go_Url(urlaccion, urlaccion, par);
}

function fn_load_selection(_equipotic, _tiposolicitud) {
    let arrequipo = _equipotic;
    let arrtipo = _tiposolicitud;
    let html = '';

    arrequipo.forEach(x=> {
        html += `
            <div class ="col-lg-6">
                <div class ="ibox white-bg">
                    <div id='title' class ="ibox-title bg-success text-center" value='${x.IdEquipoTIC}'>
                        <h4>${x.EquipoTIC}</h4>
                    </div>
                    <div class ="ibox-content">
                        <div class ="text-center">
            `;

        arrtipo.forEach(y=> {
            html += `
                            <button id='btnTipo' class ='text-center btn btn-outline btn-success btn-block' onclick="fn_new('${x.IdEquipoTIC}', '${y.IdTipoSolicitud}')">
                                <span class ="fa fa-plus"></span>
                                ${y.TipoSolicitud}
                            </button>                   
                `;
        });

        html += `       </div>
                    </div>
                </div>
             </div>
            `;
    });
    
    _('formSelect').innerHTML = html;
}

function req_ini() {
    let urlaccion = 'TecnologiaInformacion/HelpDesk/HelpDesk_Master';
    Get(urlaccion, res_ini);
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) { ovariables.equipotic = JSON.parse(orpta[0]); }
        if (JSON.parse(orpta[1] != '')) { ovariables.tiposolicitud = JSON.parse(orpta[1]); }

        fn_load_selection(ovariables.equipotic, ovariables.tiposolicitud);
    }
}

(function ini() {
    load();
    req_ini();
})();
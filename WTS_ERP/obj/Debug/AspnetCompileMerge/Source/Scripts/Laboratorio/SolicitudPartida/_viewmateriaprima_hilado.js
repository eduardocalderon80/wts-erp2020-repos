function load() {

}

function res_ini(rpta) {
    let orpta = rpta != '' ? CSVtoJSON(rpta) : null, html = '';

    if (orpta != null) {
        orpta.forEach(x => {
            html += `<tr>
                        <td>${x.nombremateriaprima}</td>      
                        <td>${x.porcentaje}</td>
                        <td>${x.estado}</td>
                        <td>${x.color}</td>
            </tr>
            `;    
        });
        _('tbody_vermateriaprima_hilado').innerHTML = html;
    }
}

function req_ini() {
    let par = _('txtpar_viewmateriaprima').value, idsolicitudpartida = _par(par, 'idsolicitudpartida'), idhilado = _par(par, 'idhilado');

    let parametro = JSON.stringify({ idsolicitudpartida: idsolicitudpartida, idhilado: idhilado  });
    Get('Laboratorio/SolicitudPartida/getData_viewMateriaprima_hilado?par=' + parametro, res_ini)
}

(
    function ini() {
        req_ini();
        load();
    }
)();
var ovariables = {
    par: '',
    idlabdip: 0,
    arrinformacion: [],
    arrdetalle: []
}

function load() {
    ovariables.par = _('txtpar_labdipdetail').value;
    ovariables.idlabdip = _par(ovariables.par, 'idlabdip');
}

function req_ini_detail() {
    let par = JSON.stringify({ idlabdip: ovariables.idlabdip });
    let urlaccion = 'Laboratorio/LabDipReceive/LabDipReceive_Get?par=' + par;
    Get(urlaccion, res_ini_detail);
}

function res_ini_detail(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta[0].informacion != '') { ovariables.arrinformacion = orpta[0].informacion } else { ovariables.arrinformacion = [] }
        if (orpta[0].detalle != '') { ovariables.arrdetalle = orpta[0].detalle } else { ovariables.arrdetalle = [] }
        req_informacion_detail();
    }
}

function req_informacion_detail() {
    let informacion = ovariables.arrinformacion.length > 0 ? JSON.parse(ovariables.arrinformacion) : [];

    _('txt_color').innerHTML = informacion[0].color;
    _('txt_standard').value = informacion[0].standard;
    _('txt_tipo').value = informacion[0].tipo;
    _('txt_aprobadopor').value = informacion[0].aprobadopor;
    _('txt_temporada').value = informacion[0].temporada;    
    _('txt_codigotintoreria').value = informacion[0].codigotintoreria;
    _('txt_alternativa').value = informacion[0].alternativa;
    _('txt_comentario').value = informacion[0].comentario;

    let solidezluz = informacion[0].solidezluz == 0.00 ? '-' : informacion[0].solidezluz;
    let solidezhumedo = informacion[0].solidezhumedo == 0.00 ? '-' : informacion[0].solidezhumedo;
    let solidezseco = informacion[0].solidezseco == 0.00 ? '-' : informacion[0].solidezseco;

    //_('txt_luz').value = informacion[0].solidezluz;
    //_('txt_seco').value = informacion[0].solidezhumedo;
    //_('txt_humedo').value = informacion[0].solidezseco;

    _('txt_luz').value = solidezluz;
    _('txt_humedo').value = solidezhumedo;
    _('txt_seco').value = solidezseco;
    
    _('txt_cliente').value = informacion[0].cliente;   
    _('txt_tintoreria').value = informacion[0].tintoreria;
    _('txt_codefabric').value = informacion[0].codigotela;
    _('txt_fabric').value = informacion[0].fabric;
    fn_load_labdips();
}

function fn_load_labdips() {
    if (ovariables.arrdetalle.length > 0) {
        let arrlabdip = JSON.parse(ovariables.arrdetalle);
        let resultadolabdip = arrlabdip, html = '', htmlbody = '';

        html = `
        <table id='tablelabdipdetail'  class ='footable table table-stripped table-bordered'>
            <thead>
                <tr>
                   <th></th>
                    <th class ='text-center'>Color</th>
                    <th class ='text-center'>Standard</th>
                    <th class ='text-center'>Type</th>
                    <th class ='text-center'>Approval By</th>
                    <th class ='text-center'>Code DH</th>
                    <th class ='text-center'>Dyeing House</th>
                    <th class ='text-center'>Season</th>
                    <th class ='text-center'>Origin</th>
                    <th class ='text-center'>Status</th>
                    <th class ='text-center'>Date Approved</th>
                </tr>
            </thead>
            <tbody>
        `;

        resultadolabdip.forEach(x=> {
            htmlbody += `
            <tr data-par='idlabdipcreador:${x.idlabdipcreador},idlabdip:${x.idlabdip},idlabdippadre:${x.idlabdippadre},idestadorelacion:${x.estadorelacion},idtipo:${x.idtipo},idaprobacion:${x.idaprobacion},idtintoreria:${x.idtintoreria},idtemporada:${x.idtemporada},statuslabdip:${x.statuslabdip},registro:1'>
                <td class ='text-center'>
                    <div  class ='i-checks _clsdivlabdip'>
                        <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                            <label>
                                <input value='${x.idlabdip}' type='checkbox' class ='i-checks _clschklabdip' style='position: absolute; opacity: 0;'>
                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                            </label>
                        </div>
                    </div>
                </td>
                <td>${x.color}</td>
                <td>${x.standard}</td>
                <td>${x.tipo}</td>
                <td>${x.aprobacion}</td>
                <td>${x.codigocolortintoreria}</td>
                <td>${x.tintoreria}</td>
                <td>${x.temporada}</td>
                <td class ='text-center'>${x.labdippadre}</td>
                <td>${x.infostatuslabdip}</td>
                <td class ='text-center'>${x.fechaprobacion}</td>
            </tr>
            `;
        })
        html += htmlbody + `</tbody></table>`;
        _('tablecontaintlabdipdetailstempo').innerHTML = html;


        let table = _('tablelabdipdetail');
        let arrchk = Array.from(table.getElementsByClassName('_chkitem'));
        if (arrchk.length > 0) {
            arrchk.forEach(x=> {
                let fila = x.parentNode.parentNode.parentNode;
                let par = fila.getAttribute('data-par');
                let estadorelacion = _par(par, 'idestadorelacion');
                if (estadorelacion == '0') {
                    fila.children[0].children[0].children[0].children[0].children[0].checked = true;
                    fila.children[0].children[0].children[0].children[0].children[0].disabled = true;
                }
            })
        }
        handler_check();       
    }
}

function handler_check() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    })
}


(function ini() {
    load();
    req_ini_detail();
})();

function loadCartonLabelOrvis() {
    $('.footable').footable();    
}


function req_grilla_CartonLabelOrvis() {
    let urlaccion = 'PortalFabrica/CartonLabelOrvis/ListarCartonLabel';
    Get(urlaccion, grillaCartonLabelOrvis); 
}


function grillaCartonLabelOrvis(result) {
    let arr = JSON.parse(result);
    let html = arr.map(x=> {
        return (`<tr>                
                <td class ='col-sm-1 text-center'><button class='text-center btn btn-outline btn-info btn-block' type='button' onclick='ver_pdf_cartonlabel("${x.id}")'>Pdf</button></td>
                <td class ='col-sm-1'>${x.id}</td>
                <td class ='col-sm-1'>${x.po}</td>
                <td class ='col-sm-1'>${x.usuario}</td>
                <td class ='col-sm-1'>${x.fecha}</td>
                </tr>`)
    }).join('');
    _('tblcartonlabel').tBodies[0].innerHTML = html;
    $('.footable').trigger('footable_resize');
}

function ver_pdf_cartonlabel(_id) {
    let urlaccion = urlBase() + `PortalFabrica/CartonLabelOrvis/CartonLabelPDF?id=${_id}`;
    var link = document.createElement('a');
    link.href = urlaccion;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}





(function ini() {
    loadCartonLabelOrvis();
    req_grilla_CartonLabelOrvis();
})();
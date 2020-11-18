
function loadCartonLabelOrvis() {
    $('.footable').footable();
    document.getElementById('btnNew').addEventListener('click', fn_new);
}


function fn_new() {    
    
    _modalBody({
        url: 'PortalFabrica/CartonLabelOrvis/_New',
        ventana: '_New',
        titulo: 'New Carton Label',
        parametro: '',
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });

}

function req_grilla_CartonLabelOrvis() {
    let urlaccion = 'PortalFabrica/CartonLabelOrvis/ListarCartonLabel';
    Get(urlaccion, grillaCartonLabelOrvis);
    /*
    let arr = [{ id: '1', usuario: 'sarone', fecha: '10-09-2018', po: 'DEMO_PO', cantidad: '100' },
                { id: '2', usuario: 'sarone', fecha: '10-09-2018', po: 'DEMO_PO_2', cantidad: '150' }
    ];
    grilla(arr);
    */
}


function grillaCartonLabelOrvis(result) {
    let arr = JSON.parse(result);
    let html = arr.map(x=>
    {
        return (`<tr>
                <td class ='col-sm-1 text-center'><button class='text-center btn btn-outline btn-danger btn-block' type='button' onclick='drop_pdf_cartonlabel("${x.id}")'><span class='fa fa-trash'></span>  Remove</button></td>
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
    let urlaccion = urlBase()+`PortalFabrica/CartonLabelOrvis/CartonLabelPDF?id=${_id}`;
        var link = document.createElement('a');
        link.href = urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
}

function drop_pdf_cartonlabel(_id) {    

    swal({
        title: "Remove item?",
        text: "",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "OK",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {
        let form = new FormData();
        let par = {
            id: _id
        }
        form.append('par', JSON.stringify(par));

        _Post('PortalFabrica/CartonLabelOrvis/CartonLabelPDF_drop', form)
        .then((respuesta) => {
            let orespuesta = JSON.parse(respuesta);
            let estado = orespuesta.estado === "success";
            swal({ title: orespuesta.mensaje, text: '', type: orespuesta.estado }, function () {
                if (estado) {
                    req_grilla_CartonLabelOrvis();
                }
            })
        })
    });

}



(function ini() {
    loadCartonLabelOrvis();    
    req_grilla_CartonLabelOrvis();
})();
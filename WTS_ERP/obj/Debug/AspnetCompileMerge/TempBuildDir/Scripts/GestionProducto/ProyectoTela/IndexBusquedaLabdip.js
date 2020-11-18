var oIndexBusquedaLabdip = {
    accion:''
}

function buscarLabdipCodigoColor() {
    let codigocolor = _('txt_codigocolor').value;
    if (_isEmpty(codigocolor)) {
        _swal({ estado: 'error', mensaje: 'Ingrese el codigo del color' });
        return;
    }
    else {
        let _parurl = { codigocolor: codigocolor }
        _Get(`GestionProducto/ProyectoTela/ListarLabdipxCodigoColor?par=${JSON.stringify(_parurl)}`)
        .then(r=> {
            if (!_isEmpty(r)) {
                let result = JSON.parse(r);
                let html = result.map(x=> {
                    return (`<tr data-color='${x.codigocolor}' style='cursor:pointer' onclick='fn_selectRow(this)' >
                        <td class ='col-sm-1'>${x.tintoreria}</td>
                        <td class ='col-sm-1'>${x.cliente}</td>
                        <td class ='col-sm-1'>${x.color}</td>
                        <td class ='col-sm-1'>${x.codigocolor}</td>
                        <td class ='col-sm-1'>${x.codigotela}</td>
                        <td class ='col-sm-1'>${x.composicion}</td>
                        <td class ='col-sm-1'>${x.temporada}</td>
                        <td class ='col-sm-1'>${x.estado}</td>
                        </tr>`)
                }).join('');
                _('tbl_CodigoColor').tBodies[0].innerHTML = html;
            } else {
                _('tbl_CodigoColor').tBodies[0].innerHTML = '';
                _swal({ estado: 'error', mensaje: 'NO existe el codigo de color' });
            }            
        })
    }
    
}


function _load_labdip() {
    _("btnConsultarCodigoColor").addEventListener('click', buscarLabdipCodigoColor);
    _("txt_codigocolor").addEventListener('keypress', function(event) {        
        if (event.keyCode === 13) {
            _("btnConsultarCodigoColor").click();
        }
    })
    
    
}

function fn_selectRow(_tr) {    
    if (oIndexBusquedaLabdip.accion) {
        let codecolor = _tr.dataset.color;
        oSolicitud.setCodigoColor(codecolor);
        document.querySelector('#modal_dialogIndexBusquedaLabdip .close').click();        
    }
}


function _event_modal_busquedalabdip(idpar) {
    let par = _(idpar);
    let accion = _par(par.dataset.par, "accion");    
    oIndexBusquedaLabdip.accion = (accion === "out");
}




(function ini() {
    _load_labdip();
    _event_modal_busquedalabdip('txtparBusquedaLabdip');
})();
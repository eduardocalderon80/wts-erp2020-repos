var oCartonLabelOrvis = {
    data: '',
    adata: []    
}

function _loadNewCartonLabelOrvis() {
    $('.footable').footable();
    document.getElementById('_btnPreviewCartonLabelOrvis').addEventListener('click', fn_preview);
    document.getElementById('_btnSaveCartonLabelOrvis').addEventListener('click', fn_save);
}


function _removeLines(str) {
    str = str.replace(/\s{2,}/g, ' ');
    str = str.replace(/\t/g, ' ');
    str = str.toString().trim().replace(/(\r\n|\n|\r)/g, "");
    return str;
}

function validaArray(_array) {
    let exitoCode = _array.some(x=>typeof x.code === 'undefined');
    let exitoTalla = _array.some(x=>typeof x.talla === 'undefined');
    return (!exitoCode && !exitoTalla);
}


function fn_preview() {
    let txt = _('_txtdataCartonLabel').value;
    let arr = [];
    let i = 0;
    let sdata = _removeLines(txt);
    let y = sdata.split(' ');
    let l = y.length;
    for (i = 0; i < l; i += 3) {        
        arr.push({ 'color': y[i], 'code': y[i + 1], 'talla': y[i + 2] })
    }
        
    let arr_len = arr.length > 0;
    let exito_arr = validaArray(arr);

    if (arr_len) {
        if (!exito_arr) {
            swal({ title: 'Enter correct data', text: 'Error', type: 'error' }, function () {
                _grillaNewCartonLabelOrvis_Empty();
            });

        } else {
            let uniqueArray = (x) =>[...new Set(x.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
            let arrColor_distinct = uniqueArray(arr);

            let arrColor_group = [];
            arrColor_distinct.forEach(y=> {
                let q = arr.filter(x=>x.color === y.color && x.code === y.code && x.talla === y.talla).length;
                if (q > 0) {
                    arrColor_group.push({ color: y.color, code: y.code, talla: y.talla, q: q })
                }
            })
            oCartonLabelOrvis.data = '';
            if (arrColor_group.length > 0) {
                _grillaNewCartonLabelOrvis(arrColor_group);
                oCartonLabelOrvis.data = fn_dataToCSV(arrColor_group);
            }
        }
    } else {
        swal({ title: 'Enter correct data', text: 'Error', type: 'error' }, function () {
            _grillaNewCartonLabelOrvis_Empty();
        });

    }
    
}


function fn_dataToCSV(arr) {
    let csv = arr.map(x=> {
        return (`${x.color}¬${x.code}¬${x.talla}¬${x.q}`)
    }).join('^');
    return csv;
}

function fn_save() {
    let req = _required({ id: 'popCartonLabel', clase: '_enty' });
    let data = (oCartonLabelOrvis.data !== null && oCartonLabelOrvis.data.length > 0) ? oCartonLabelOrvis.data : null;
    let exito = req && data !== null;
    if (data===null) {
        swal({ title: 'Enter Data', text: 'Error', type: 'error' });
    }

    if (exito) {
        let btnRetorno = _('_btnCancelarCartonLavelOrvis');
        let form = new FormData();
        let par = {
            po: _('_txtpoCartonLabel').value,
            data: data
        }
        form.append('par', JSON.stringify(par));
        
        _Post('PortalFabrica/CartonLabelOrvis/InsertarCartonLabel', form)
        .then((respuesta) => {
            let orespuesta = JSON.parse(respuesta);
            let estado = orespuesta.estado === "success";
            swal({ title: orespuesta.mensaje, text: '', type: orespuesta.estado }, function () {
                if (estado) {
                    btnRetorno.click();
                    req_grilla_CartonLabelOrvis();
                }
            })
        })
    }
}

function _grillaNewCartonLabelOrvis_Empty() {
    oCartonLabelOrvis.data = '';
    _('_tblcartonlabel').tBodies[0].innerHTML = '';
    $('.footable').trigger('footable_resize');
}


function _grillaNewCartonLabelOrvis(result) {    
    let html = result.map(x=> {
        return (`<tr>
                <td class ='col-sm-1'>${x.color}</td>
                <td class ='col-sm-1'>${x.code}</td>
                <td class ='col-sm-1'>${x.talla}</td>
                <td class ='col-sm-1'>${x.q}</td>                
                </tr>`)
    }).join('');
    _('_tblcartonlabel').tBodies[0].innerHTML = html;
    $('.footable').trigger('footable_resize');
}


(function load() {
    _loadNewCartonLabelOrvis();
    _rules({ id: 'popCartonLabel', clase: '_enty' });
})();
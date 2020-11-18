var _icon = {
    chk: (arr) => {
        return arr.map(x=> {
            return `
<div class='i-checks ${x.clase}'><label class=''><div class='icheckbox_square-green' style='position: relative;'><input type='checkbox' class='i-checks _chk enty group' value='${x.valor}' data-id='${x.id}' style='position: absolute; opacity: 0;' data-group='chk${x.id}' data-group-type='checkbox' data-default='empty'><ins class='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins></div> <i></i>${x.texto}</label></div>`;
        }).join('');
    },
    chkevent: function () {        
        $('.i-checks').iCheck({ checkboxClass: 'icheckbox_square-green' });        
    }
}



function _check() {
    $('.i-checks._chkitem').iCheck({
        checkboxClass: 'icheckbox_square-green'
    }).on('ifChanged', function (e) {
        let estado = e.currentTarget.checked;
        if (estado === true || estado === false) {
            let chkall = _('_chkall');
            chkall.checked = true;
            chkall.parentNode.classList.remove('checked');
        }
    });

}


function _checkall(estado) {
    let container = _('_divlabdip');
    let achk = Array.from(container.getElementsByClassName('_chk'));
    if (estado) {
        achk.forEach(x=> {
            x.checked = estado;
            x.parentNode.classList.add('checked');
        });
    } else {
        achk.forEach(x=> {
            x.checked = estado;
            x.parentNode.classList.remove('checked');
        });
    }
}


function _reqResumen() {
    let par = _('txtpar_Lapdip').value;
    let cliente = _par(par, 'cliente');
    let tela = _par(par, 'tela');
    let _parurl = {idtela: _par(par, 'idtela')}

    if(!_isEmpty(par)){
        _Get(`GestionProducto/ProyectoTela/ListarLabdip?par=${JSON.stringify(_parurl)}`)
        .then(r=> {
            //let result = [{ code: 'AAA', color: 'White' }, { code: 'BBB', color: 'Black' }, { code: 'CCC', color: 'Red' }, { code: 'DDD', color: 'Blue' }]
            if (!_isEmpty(r)) {
                let result = JSON.parse(r);
                let html = result.map(x=> {
                    return (`<tr>
                        <td class ='col-sm-1'>
                            <div class='form-group'>
                               <label class='control-label col-sm-2'></label>
                               <div class='col-sm-1' data-group='group_lapdip'>
                               <div class='i-checks _chkitem'><label class=''><div class='icheckbox_square-green' style='position: relative;'>
                                <input type='checkbox' class='i-checks _chk group' value='${x.idlabdip}' style='position: absolute; opacity: 0;' data-group='group_lapdip' data-group-type='checkbox' data-default='empty'><ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins></div> <i></i></label>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td class ='col-sm-1'>${x.color}</td>
                        <td class ='col-sm-1'>${x.codigocolor}</td>
                        </tr>`)
                }).join('');
                _('_tbllabdip').tBodies[0].innerHTML = html;
                $('.footable').trigger('footable_resize');
                _check();
            }
        })
    }
    _('_txtClient').value = cliente;
    _('_txtCode').value = tela;
}


function _load_labdip() {
    _('_btnDescargarPDFLabdip_sticker').addEventListener('click', (x) => { fn_pdflabdip('ListarLabdipPDF') });
    _('_btnDescargarPDFLabdip_documento').addEventListener('click', (x) => { fn_pdflabdip('ListarLabdipResumenPDF') });

    $('.i-checks._chkall').iCheck({
        checkboxClass: 'icheckbox_square-green'        
    }).on('ifChanged', function (e) {
        let estado=e.currentTarget.checked;
        if (estado===true || estado===false) {
            _checkall(estado);
        }
    });        
}

function fn_pdflabdip(_metodoPDF) {
    let container = _('_divlabdip');
    let achk = Array.from(container.getElementsByClassName('_chk'));
    let idproyectotelalabdip = achk.filter(x=>x.checked).map(x=>x.value).join(',');
    if (!_isEmpty(idproyectotelalabdip)) {
        let par = _('txtpar_Lapdip').value;
        let idtela =  _par(par, 'idtela');
        let parurl = {
            idtela: idtela,
            idproyectotelalabdip: idproyectotelalabdip
        }
        let urlaccionSticker = urlBase() + `GestionProducto/ProyectoTela/${_metodoPDF}?par=${JSON.stringify(parurl)}`;
        _getFile(urlaccionSticker, 100);        
    }
}

function _getFile(_urlaccion, tiempo) {
    tiempo = tiempo || 100;
    _promise(tiempo)
    .then(()=> {
        var link = document.createElement('a');
        link.href = _urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    })    
}



(function ini() {
    _reqResumen();
    _load_labdip();
})();
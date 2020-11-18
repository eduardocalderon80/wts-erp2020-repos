var osemanal = { path: '' }

_('fuArchivo').addEventListener('change', (e) => {
    let archivo = e.target.value;
    let ultimopunto = archivo.lastIndexOf(".");
    let ext = archivo.substring(ultimopunto + 1);
    let nombre = e.target.files[0].name;
    ext = ext.toLowerCase();
    switch (ext) {
        case 'xlsx':
            btnUpload.click();
            break;
        default:            
            this.value = '';
            _mensaje({ titulo: 'Mensaje', estado: 'error', mensaje: 'Solo puede subir archivo Excel (xlsx).' });            
    }
});



function __Post(url, frm) {
    $('#myModalSpinner').modal('show');
    url = urlBase() + url;
    return new Promise((resolve, reject) => {
        return fetch(url, { method: 'POST', body: frm })
            .then(response => {
            if (response.ok) {                
                setTimeout(function () {
                    $('#myModalSpinner').modal('hide');
                    resolve(response.text());
                }, 0 | Math.random() * 500);
            } else {
                $('#myModalSpinner').modal('hide');
                reject(new Error('error'));                
            }
        }, error => {
            $('#myModalSpinner').modal('hide');
            reject(new Error(error.message))
        })
    })
};




_('btnSave').addEventListener('click', (e) => {

    let exito_required = _required({ id: 'programacionsemanal', clase: '_enty' });
    if (exito_required) {
        let par = _getParameter({ id: 'programacionsemanal', clase: '_enty' }),
            frm = new FormData();
        if (par !== null) {
            frm.append("par", JSON.stringify(par));
            frm.append("path", osemanal.path);
            
            __Post('Auditoria/Programacion/Save_Programacion', frm)
           .then(resultado => { _mensaje(JSON.parse(resultado)); clear_form() })
           .catch(error => clear_form());
        }
    }
});


function clear_form() {
    _('txtruta').value = '';
    _('dprogramacion').innerHTML = '';
    _('btnSave').classList.add('hide');
    $('#divfechainicio .input-group.date').datepicker('update', '');
    $('#divfechafin .input-group.date').datepicker('update', '');
    _('divfechainicio').classList.remove('has-error');
    _('divfechafin').classList.remove('has-error');

}

function file_clear() {
    let _file = _('fuArchivo');
    _file.value = null;
}



_('btnUpload').addEventListener('click', (e) => {
    let url = "Auditoria/Programacion/Upload_Programacion",
        fupArchivo = _("fuArchivo"),
        file = fupArchivo.files[0],
        data = file.name.split("."),
        n = data.length,
        frm = new FormData();
    if (n > 1) {
        _('txtruta').value = file.name;
        frm.append("archivo", file);

        __Post(url, frm)        
        .then(resultado => mostrarExcel(resultado))
        .catch(error => file_clear())
    }
});


function mostrarExcel(rpta) {
    if (rpta !== "" && typeof rpta !== undefined) {
        let orpta = JSON.parse(rpta),
            lista = orpta.data.split("^");
        osemanal.path = orpta.path;
        mostrarTabla(lista);        
    }
    file_clear();
}

function mostrarTabla(lista) {
    if (lista != '') {
        let divPreview = _("dprogramacion"),
            btnsave = _("btnSave");
        btnsave.classList.add('hide');
        divPreview.innerHTML = '';
        if (divPreview != null) { divPreview.innerHTML = _crearTabla(lista, 'programacion'); btnsave.classList.remove('hide'); }
    }
}


function load() {
    //fechas
    $('#divfechainicio .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtfechainicio').value.length == 0) { padre.classList.add('has-error'); }
    });

    $('#divfechafin .input-group.date').datepicker({
        autoclose: true, dateFormat: 'mm/dd/yyyy'
    }).on('change', function (e) {
        let padre = e.target.parentNode.parentNode.parentNode;
        padre.classList.remove('has-error');
        if (_('txtfechafin').value.length == 0) { padre.classList.add('has-error'); }
    });
}

(function ini() {
    _rules({ id: 'programacionsemanal', clase: '_enty' });
    load();
})();
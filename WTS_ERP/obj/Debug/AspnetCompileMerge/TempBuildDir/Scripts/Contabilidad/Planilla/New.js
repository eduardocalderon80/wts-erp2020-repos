var ovariables = {
    strJSONData: '',
    document: '',
    month: '',
    period: ''
}

function load() {
    _('btnReturn').addEventListener('click', fn_return);
    _('cboDocumento').addEventListener('change', fn_load_month);
    _('btnSave').addEventListener('click', fn_save_period);
          
    var d = new Date();
    var n = d.getFullYear();
    let html = '';

    for (var i = n; i >= 2015; i--) {
        html += '<option value=' + i + '>' + i + '</option>';
    }
    _('cboAnio').innerHTML = html;
}

function fn_return() {
    let urlaccion = 'Contabilidad/Planilla/Index',
        urljs = 'Contabilidad/Planilla/Index';
    _Go_Url(urlaccion, urljs);
}

//Add Period Temporal
function fn_validfile(sender) {
    let document = _('cboDocumento').value;
    let anio = _('cboAnio').value;
    let month = _('cboMes').options[_('cboMes').selectedIndex].text;
    let typefile = new Array(".xlsx", ".xls", ".XLSX", ".XLS");
    let file = sender.value;

    let filename = file.substring(file.lastIndexOf('.'));
    if (typefile.indexOf(filename) < 0) {
        swal({ title: "Incorrect Format ", text: "Please select a file with correct format.", type: "warning" });
        _('fileSelected').value = '';
        sender.value = '';
    } else {
        let arch = '';
        if (document == "1") { arch = 'PM' } if (document == "2") { arch = 'PG' } if (document == "3") { arch = 'CTS' } if (document == "4") { arch = 'Uti' }
        let name = _('inputFile').files[0].name;
        let x = name.substring(0, 3);

        if (arch == x.trim()) {
            let arrperiod = ovariables.period;
            let val = false;
            if (arrperiod != '') { val = arrperiod.some(x=> { return x.IdDocumento.toString() === document && x.Mes.toString() === month && x.Anio.toString() === anio }); }

            if (val) {
                swal({ title: "Data Exist", text: "There are registers with these Month, Year and Document", type: "warning" });
                _('fileSelected').value = '';
                sender.value = '';
            } else {
                let ruta = _('inputFile').files[0].name;
                //_('fileSelected').value = 'C:/' + ruta;
                _('fileSelected').value = '' + ruta;
                fn_addrowdata();
            }
        }
        else {
            swal({ title: "Incorrect Name", text: "Please select a file with correct name", type: "warning" });
            _('fileSelected').value = '';
            sender.value = '';
        }
    }
    return;
}

function fn_addrowdata() {
    let document = _('cboDocumento').value;
    let anio = _('cboAnio').value;
    let month = _('cboMes').value;
    let url = 'Contabilidad/Planilla/Planilla_Valid',
    file = _('inputFile').files[0];
    let par = { Documento: document, Mes: month, Anio: anio },
        frm = new FormData();
    frm.append("archivo", file);
    frm.append("par", JSON.stringify(par));
    Post(url, frm, fn_view_preview);
}

function fn_view_preview(response) {
    let orpta = response != null ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            var anio = _('cboAnio').value;
            var month = _('cboMes').options[_('cboMes').selectedIndex].text;
            var array = JSON.parse(orpta.data);
            let result = array.map(x=> {
                return `
                    <tr>
                        <td class ='text-center'><button class ='text-center btn btn-outline btn-danger' onclick='fn_disabled(false)'><span class ='fa fa-trash'></span></button></td>
                        <td>${anio}</td>
                        <td>${month}</td>
                        <td>${x.TotalEmpleados}</td>
                        <td>${x.TotalDescuentos}</td>
                        <td>${x.NetoPagar}</td>
                    </tr>
                    `
            }).join('');
            _('contenTableBoleta').tBodies[0].innerHTML = result;
            fn_disabled(true);
        }
        if (orpta.estado === 'error') {
            swal({ title: "There are a problem!", text: "Please, verify the file to upload", type: "error" });
            _('fileSelected').value = '';
            _('inputFile').value = '';
        }
    }
    return;
}

function fn_disabled(_val) {
    if (_val == false) {
        _('contenTableBoleta').tBodies[0].deleteRow(0);
        _('fileSelected').value = '';
        _('inputFile').value = '';
    }
    _('inputFile').disabled = _val;
    _('cboDocumento').disabled = _val;
    _('cboMes').disabled = _val;
    _('cboAnio').disabled = _val;
}

//Insert Period
function fn_save_period() {
    let val = _('contenTableBoleta').tBodies[0].rows.length;
    if (val > 0) {
        swal({
            title: "Save Data",
            text: "Are you sure save these values?",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "OK",
            cancelButtonText: "Cancelar",
            closeOnConfirm: true
        }, function () {
            req_insert();
            return;
        });
    }
    else {
        swal({
            title: "Data Incorrect",
            text: "Please upload a file to process",
            type: "warning"
        });
    }
    return;
}

function req_insert() {
    let url = 'Contabilidad/Planilla/Planilla_Insert';
    let document = _('cboDocumento').value;
    let anio = _('cboAnio').value;
    var month = _('cboMes').options[_('cboMes').selectedIndex].text;
    let par = { IdDocumento: document, Mes: month, Anio: anio },
        frm = new FormData();
    frm.append("par", JSON.stringify(par));
    Post(url, frm, res_insert);
}

function res_insert(response) {
    let orpta = response !== '' ? JSON.parse(response) : null;
    if (orpta != null) {
        if (orpta.estado === 'success') {
            swal({ title: "Good job!", text: "You have registered new Data", type: "success" }); 
        }
        if (orpta.estado === 'error') { swal({ title: "There are a problem!", text: "Please, comunicate with administrador TIC", type: "error" }); }
        fn_return();
    }
}

// Initial
function fn_load_month() {
    let array = ovariables.month;
    let document = _('cboDocumento').value;
    let cbomes = '';
    let result = array.filter(x=>x.IdDocumento.toString() === document);
    result.forEach(z=> { cbomes += `<option value='${z.NumeroMes}'>${z.Mes}</option>` });
    _('cboMes').innerHTML = cbomes;
}

function fn_load_document(_arrdocument) {
    let array = _arrdocument;
    let cbodocument = '';
    array.forEach(x=> { cbodocument += `<option value = '${x.IdDocumento}'>${x.Documento}</option>` });
    _('cboDocumento').innerHTML = cbodocument;
}

function res_ini(response) {
    let orpta = response != null ? response.split('¬') : null;
    if (orpta != null) {
        if (JSON.parse(orpta[0] != '')) {
            ovariables.document = JSON.parse(orpta[0]); fn_load_document(ovariables.document);
        }
        if (JSON.parse(orpta[1] != '')) { ovariables.period = JSON.parse(orpta[1]); }
        if (JSON.parse(orpta[2] != '')) { ovariables.month = JSON.parse(orpta[2]); fn_load_month(); }      
    }
}

function req_ini() {
    let urlaccion = 'Contabilidad/Planilla/Planilla_List';
    Get(urlaccion, res_ini);
}

(function ini() {
    load();
    req_ini();
})();
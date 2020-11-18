var ovariables = {
    idgrupocomercial: ''
}

function load() {
    let par = _('txtpar').getAttribute('data-par')

    if (!_isEmpty(par)) {       
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');        
    }

    _('btnSave').addEventListener('click', Guardar);
    _('btnSearch').addEventListener('click', Buscar);
    _('cboCliente').addEventListener('change', Buscar);
    _('cboTeam').addEventListener('change', BuscarCliente);
    GetData(1)
}

function Buscar(event) {
    if (Validar()) {
        GetData(3)
    }    
}

function BuscarCliente(event) {
    GetData(2)
}

function GetData(tipo) {
    _('tbody_sample_index').innerHTML = '';
    switch (tipo) {
        case 1:   parametro = { tipo:tipo, idgrupocomercial: _('cboTeam').value, idcliente: _('cboCliente').value };
                    urlaccion = 'GestionProducto/TipoMuestraxCliente/getData?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_team);
                    break;
        case 2: parametro = { tipo: tipo, idgrupocomercial: _('cboTeam').value, idcliente: _('cboCliente').value };
                    urlaccion = 'GestionProducto/TipoMuestraxCliente/getData?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_cliente);
                    break;
        case 3: parametro = { tipo: tipo, idgrupocomercial: _('cboTeam').value, idcliente: _('cboCliente').value };
            urlaccion = 'GestionProducto/TipoMuestraxCliente/getData?par=' + JSON.stringify(parametro);
            Get(urlaccion, LLenarTabla);
            break;
    }   
}

function res_team(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    _('cboTeam').innerHTML = '';        
    if (rpta != null) {
        _('cboTeam').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].GrupoPersonal);
    }
}

function res_cliente(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    _('cboCliente').innerHTML = '';
    if (rpta != null) {
        _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].Cliente);
    }
}

function LLenarTabla(data) {
  
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(data), html = '', tbl = _('tbody_sample_index');
      
    if (rpta != null) {
        if (dataparse != null) {
            let oData = CSVtoJSON(dataparse[0].TipoMuestra, '¬', '^');
            if (oData != null && oData.length > 0) {
                    tbl.innerHTML = '';
                    
                    let totalfilas = oData.length;
                    for (let i = 0; i < totalfilas; i++) {
                        // Llenar check
                        var check = "";
                        if (oData[i].Eliminado == 0 && oData[i].IdTipoMuestraxCliente > 0) {
                            check = "checked";
                        } 

                        html += `<tr data-par='IdTipoMuestra:${oData[i].IdTipoMuestra},IdTipoMuestraxCliente:${oData[i].IdTipoMuestraxCliente}'>
                                <td>${oData[i].NombreTipoMuestra}</td>
                                <td class ='text-center'>
                                  <input type="checkbox" class ="form-control _chk" id="checkMuestra" ${check}>                                  
                                </td>                                
                            </tr>
                        `;
                    }
                    tbl.innerHTML = html;
            }
        }
    }
}
 
function Validar() {
    let bValidar = true;

    let team = _('cboTeam').value;

    if (_('cboTeam').value === '') {
        _('div_cboTeam').classList.add('has-error');
        bValidar = false;
    }

    if (_('cboCliente').value === '') {
        _('div_cboCliente').classList.add('has-error');
        bValidar = false;
    }
    return bValidar;
}

function Guardar() {
 
    let bValidar = Validar();
    if (bValidar) {
        par = JSON.stringify({ cboCliente: _('cboCliente').value });
        let urlaccion = 'GestionProducto/TipoMuestraxCliente/Guardar', form = new FormData()
        let tbl = document.getElementById('tbody_sample_index'), totalfilas = tbl.rows.length, row = null, arr = [];

        for (let i = 0; i < totalfilas; i++) {
            row = tbl.rows[i];
            let par = row.getAttribute('data-par');
            var Value = row.cells[1].children[0].checked;

            let obj = {
                IdTipoMuestra: _par(par, 'IdTipoMuestra'),
                IdTipoMuestraxCliente: _par(par, 'IdTipoMuestraxCliente'),
                Check: Value == true ? 1 : 0,
            };
            arr[i] = obj;
        }

        parDetail = JSON.stringify(arr);

        form.append('par', par);
        form.append('parDetail', parDetail);
        form.append('parfoot', '');
        form.append('parsubfoot', '');

        Post(urlaccion, form, function (rpta) {
            let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;
            GetData(3)
            if (orpta != null) {
                _swal({ estado: 'success', mensaje: 'Success' });
            }
        });
    }  
}
 
(
    function ini() {
        load();        
}
)();

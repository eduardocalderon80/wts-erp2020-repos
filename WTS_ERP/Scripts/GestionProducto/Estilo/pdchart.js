var ovariables = {
    idgrupocomercial: ''
}

function load() {
    let par = _('txtpar').getAttribute('data-par');
    // ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
    if (!_isEmpty(par)) {
        ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
    }

    _('cbocliente').addEventListener('change', changecliente);
    _('btnexportarexcel').addEventListener('click', exportartoexcel);     
    _('btnSearch').addEventListener('click', Buscar);
}

function Buscar() {
    let req = _required({ id: 'div_body_filtro', clase: '_enty' });
    if (req) {
        _('tbody_index').innerHTML = '';  
        let par = $("#cbocliente").val() + ",,," + $("#cboclientetemporada").val() + "," + $("#cboclientedivision").val() + "," + $("#cboStatus").val();
        let frm = new FormData(), urlaccion = 'GestionProducto/Estilo/BuscarEstilo';
        frm.append("par", par);
        Post('GestionProducto/Estilo/BuscarEstilo', frm, BuscarEstilo);
    }
}

function BuscarEstilo(data) {
    let dataparse = data != null && data != '' ? JSON.parse(data) : null;
    if (dataparse != null) {
        let tbl = _('tbody_index'), html = '';
            style = dataparse;
            let totalfilas = style.length;
            for (let i = 0; i < totalfilas; i++) {
                html += `<tr data-par='idestilo: ${style[i].IdEstilo}'>                     
                            <td><div class='text-center form-check'><input type='checkbox' class='form-check-input chk' checked /></div>
                            </td>
                            <td>${ style[i].CodigoEstilo}</td>
                            <td>${ style[i].Descripcion}</td>
                            <td>${ style[i].Temporada}</td>
                            <td>${ style[i].Division}</td>
                            <td>${ style[i].Status}</td>                      
                        </tr>
                    `;
            }
            tbl.innerHTML = html;          
    }
}

function ExportarEstilo() {
    let tBody = _('tbody_index'), TotalFilas = tBody.rows.length, row = null, chk = false, idestilo = "";

    for (i = 0 ; i < TotalFilas ; i++) {
        row = tBody.rows[i];         
        chk = $(row.cells[0]).find('.chk').is(':checked');
        if (chk) {
            par = row.getAttribute('data-par'),
            idestilo += _par(par, 'idestilo') + ",";

        }
    }
    idestilo = idestilo.slice(0, -1);
    console.log(idestilo)
    return idestilo;
}
 
function changecliente(e) {
    let o = e.target, valor = o.value;

    if (valor != '') {
        let urlaccion = 'GestionProducto/Estilo/getdata_pdchart_dataxcliente?par=' + valor;
        Get(urlaccion, cargarcomboxcliente);
    } else {
        _('cboclientedivision').innerHTML = '';
        _('cboclientetemporada').innerHTML = '';
    }    
}

function cargarcomboxcliente(data) {
    let odata = data != null ? JSON.parse(data) : null;
    if (odata != null) {
        _('cboclientedivision').innerHTML = _comboItem({ value:'0', text:'All' }) + _comboFromCSV(odata[0].clientedivision);
        _('cboclientetemporada').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(odata[0].clientetemporada);
    }
}

function exportartoexcel() {
    let tBody = _('tbody_index'), TotalFilas = tBody.rows.length;
        //let parametro = JSON.stringify({ idcliente: _('cbocliente').value, idclientedivision: _('cboclientedivision').value, idclientetemporada: _('cboclientetemporada').value, estado: _('cboStatus').value });
        let nombrecliente = _('cbocliente').options[_('cbocliente').selectedIndex].text, nombredivision = _('cboclientedivision').options[_('cboclientedivision').selectedIndex].text,
            nombretemporada = _('cboclientetemporada').options[_('cboclientetemporada').selectedIndex].text;
        //let urlaccion = '../GestionProducto/Estilo/ExportarExcel_pdchart?par=' + parametro + '&nombrecliente=' + nombrecliente + '&nombredivision=' + nombredivision + '&nombretemporada=' + nombretemporada;
       // Get(urlaccion, res_excel);
    if (TotalFilas > 0) {
        let parametro = ExportarEstilo();
        let urlaccion = '../GestionProducto/Estilo/ExportarExcel_pdchart?par=' + parametro + '&nombrecliente=' + nombrecliente + '&nombredivision=' + nombredivision + '&nombretemporada=' + nombretemporada;

        var link = document.createElement('a');
        link.href = urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    } else {
        _swal({ estado: 'error', mensaje: 'No hay estilos para exportar' });
    }
}

function res_excel(data) {
    let odata = data != null ? JSON.parse(data) : null;
    return false;
}

function res_ini(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    if (rpta != null) {
        _('cbocliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientes);
        _('cboStatus').innerHTML = _comboItem({ value: '0', text: 'All' }) + _comboFromCSV(rpta[0].Estado);
    }
}

function req_ini() {
    let parametro = { xd: 1, idgrupocomercial: ovariables.idgrupocomercial };
    let urlaccion = 'GestionProducto/Estilo/getdata_pdchart_datacliente_ini?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_ini);    
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'div_body_filtro', clase: '_enty' });
    }
)();
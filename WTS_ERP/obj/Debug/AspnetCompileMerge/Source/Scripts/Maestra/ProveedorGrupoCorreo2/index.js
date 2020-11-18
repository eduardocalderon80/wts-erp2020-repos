var ovariables_proveedorgrupocorreo2 = {
    lstclients: [],
    lstgrupocomercial: []
}

function load() {
    _('cbo_proveedor_grupocorreo2').addEventListener('change', fn_cargargrupocomercial);
    _('cbo_grupocomercial_grupocorreo2').addEventListener('change', fn_cargarclientes);
    
}

function fn_cargargrupocomercial(e) {
    let idproveedor = e.currentTarget.value;
    let grupocomercial = ovariables_proveedorgrupocorreo2.lstgrupocomercial.filter(x => x.idproveedor == idproveedor);
    _('cbo_grupocomercial_grupocorreo2').innerHTML = _comboItem({ value:'', text:'Select' }) + _comboFromJSON(grupocomercial, 'idgrupocomercial', 'nombregrupocomercial');
}

function fn_cargarclientes(e) {
    let idgrupocomercial = e.currentTarget.value;
    let clientes = ovariables_proveedorgrupocorreo2.lstclients.filter(x => x.idgrupocomercial == idgrupocomercial);
    _('cbo_cliente_grupocorreo2').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(clientes, 'idcliente', 'nombrecliente');
}

function res_ini(rpta) {
    let orpta = rpta != '' ? JSON.parse(rpta) : null;
    if (orpta !== null) {
        ovariables_proveedorgrupocorreo2.lstclients = CSVtoJSON(orpta[0].clientes)
        ovariables_proveedorgrupocorreo2.lstgrupocomercial = CSVtoJSON(orpta[0].grupocomercial);
        _('cbo_proveedor_grupocorreo2').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].proveedores);
        

    }
}

function req_ini() {
    let par = { parametro:1 }
    Get('Maestra/ProveedorGrupoCorreo2/getData_index_combos?par=' + JSON.stringify(par), res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
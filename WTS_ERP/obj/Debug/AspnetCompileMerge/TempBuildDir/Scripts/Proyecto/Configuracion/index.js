var oVariable = {
    IdProyecto: 0
};
 
function req_ini() {
   
}
function load() {
    
    _('btnSearch').addEventListener('click', BuscarProyecto);
    _('btnSaveStatus').addEventListener('click', SaveStatus);
    _('btnSaveTeam').addEventListener('click', SaveTeam);

    _rules({ id: 'divStatus', clase: '_enty' });
    _rules({ id: 'divShared', clase: '_enty' });
}

function SaveStatus() {    
    let bVal = _required({ id: 'divStatus', clase: '_enty' });     
    if (bVal) {
        let oStatus = _getParameter({ id: 'divStatus', clase: '_enty' }),form = new FormData();
        let IdProyecto = _('txtIdProyecto').value, oParametro = { Tipo: 1, IdProyecto: IdProyecto };

        console.log(oStatus)

        form.append('par', JSON.stringify(oParametro));
        form.append('pardetalle', JSON.stringify(oStatus));

        Post('Proyecto/Configuracion/Guardar', form, function (rpt) {
            console.log(rpt)
            let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
                  data = orpta !== null && orpta.data !== null ? orpta.data : '';
            _swal(orpta);
            if (orpta.estado == "success") {
                BuscarProyecto();
                limpiar_div('divStatus', '_enty');
            } 
            
        });
    }
}
 
function SaveTeam() {
    let bVal = _required({ id: 'divShared', clase: '_enty' });
    if (bVal) {
        let oTeam = _getParameter({ id: 'divShared', clase: '_enty' }), form = new FormData();
        let IdProyecto = _('txtIdProyecto').value, oParametro = { Tipo: 2, IdProyecto: IdProyecto };
 
        form.append('par', JSON.stringify(oParametro));
        form.append('pardetalle', JSON.stringify(oTeam));

        Post('Proyecto/Configuracion/Guardar', form, function (rpt) {
            console.log(rpt)
            let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
                data = orpta !== null && orpta.data !== null ? orpta.data : '';
            _swal(orpta);
            if (orpta.estado == "success") {
                BuscarProyecto();
                limpiar_div('divShared', '_enty');
            }                        
        });
    }
}

function BuscarProyecto() {
    let Codigo = _('txtCodigo').value;

    let parametro = JSON.stringify({ Codigo: Codigo });

    let urlaccion = 'Proyecto/Configuracion/BuscarProyecto?par=' + parametro;

    Get(urlaccion, pintarCampos);
}

function pintarCampos(data) {
    let rpta = data != null ? JSON.parse(data) : null, dataparse = JSON.parse(rpta.Data), html = '';

    limpiar_div('divDatos', '_data');
    limpiar_div('divStatus', '_enty');
    limpiar_div('divShared', '_enty');

    _('cboTeam').innerHTML = '';
    _('cboStatus').innerHTML = '';
    if (rpta != null) {
        if (dataparse[0].Proyecto.length >0 ) {
            let oProyecto = JSON.parse(dataparse[0].Proyecto);
           
            _('txtDescription').value = oProyecto.Descripcion;
            _('txtCliente').value = oProyecto.NombreCliente;
            _('txtTeam').value = oProyecto.NombreGrupoPersonal;
            _('txtBudget').value = oProyecto.PresupuestoAprobado;
            _('txtStatus').value = oProyecto.NombreEstado;
            _('txtTeamShared').value = oProyecto.NombreGrupoPersonalDerivado;

            _('txtIdProyecto').value = oProyecto.IdProyecto;

            _('cboTeam').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].Grupo);
            _('cboStatus').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(dataparse[0].Estado);

        }
        else {
            var mensaje = "NO exists project";
            _swal({ estado: 'error', mensaje: mensaje });
         
        } 
    }
}

function limpiar_div(iddiv, clsname) {
    _SS(iddiv, clsname).forEach(function (item, index) {
        let tipodato = item.getAttribute('data-type');

        if (tipodato == 'text') {
            item.value = '';
        } else if (tipodato == 'img') {
            item.src = '';
        } else if (tipodato == 'combo') {
            item.value = 0;
        } else if (tipodato == 'date') {
            //item.value;
            $(item).val('').datepicker('update');
        } else if (tipodato == 'int') {
            item.value = ''
        }
    });
 
    $('#cboStatus').val('');
     
}
 
(function ini() {
    load();
    req_ini();
}
)();
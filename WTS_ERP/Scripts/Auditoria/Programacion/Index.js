(function ini() {
    _rules({ id: 'programacionsemanal_consulta', clase: '_enty' });
})();

_('btnConsultar_Programacion').addEventListener('click', (e) => {
    let exito_required = _required({ id: 'programacionsemanal_consulta', clase: '_enty' });
    if (exito_required) {
        let par = _('txtsemana').value;
        if (txtsemana.value !== '') { Get('Auditoria/Programacion/Consulta_Programacion?par=' + par, cargar_busqueda); }
    }
});

function cargar_busqueda(respuesta) {
    var lista = respuesta.split('^'),
        data = _crearTabla(lista, 'programacion');        

    if (lista.length === 1) {
        _mensaje({ titulo: 'Mensaje', estado: 'error', mensaje: 'No existe programación  en la semana seleccionada' });
        //_('detail_programacion').innerHTML = '';
        _('divProgramacion').innerHTML = '';
    } else {
        _('divProgramacion').innerHTML = data;
    }
}

_('btnNuevaProgramacion').addEventListener("click", function () {
    _Go_Url('Auditoria/Programacion/ProgramacionSemanal', 'Auditoria/Programacion/ProgramacionSemanal', '');
});
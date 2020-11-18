/// <reference path="funciones_solicitudpartida.js" />

function load() {
    let par = _('txtpar_aprobarrechazar').value, estado = _par(par, 'estado');
    switch (estado) {
        case 'AP':
            _('_btn_rechazar_solicitudpartida').classList.add('hide');
            break;
        case 'RJ':
            _('_btn_aprobar_solicitudpartida').classList.add('hide');
            break;
    }
    _('_btn_aprobar_solicitudpartida').addEventListener('click', fn_aprobar_solicitudpartida);
    _('_btn_rechazar_solicitudpartida').addEventListener('click', fn_rechazar_solicitudpartida);
}

function fn_aprobar_solicitudpartida() {
    let par = _('txtpar_aprobarrechazar').value, estado = _par(par, 'estado'), idsolicitudpartida = _par(par, 'idsolicitudpartida'),
        comentarrio_aprobar_rechazar = _('_txta_comentario_aprobarrechazar').value;

    cambiar_estado_solicitudpartida(estado, idsolicitudpartida, comentarrio_aprobar_rechazar);  // esta funcion esta en funciones_solicitudpartida.js
}

function fn_rechazar_solicitudpartida() {
    let par = _('txtpar_aprobarrechazar').value, estado = _par(par, 'estado'), idsolicitudpartida = _par(par, 'idsolicitudpartida'),
        comentarrio_aprobar_rechazar = _('_txta_comentario_aprobarrechazar').value;

    // VALIDAR ANTES DE RECHAZAR
    if (comentarrio_aprobar_rechazar.trim() === '') {
        _('div_grupo_comentario_aprobarrechazar').classList.add('has-error');
        _('div_grupo_comentario_aprobarrechazar').focus();
        return false;
    }     

    cambiar_estado_solicitudpartida(estado, idsolicitudpartida, comentarrio_aprobar_rechazar);  // esta funcion esta en funciones_solicitudpartida.js
}

function req_ini() {
    return true;
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: 'div_float_aprobarrechazar', clase: '_enty' });
    }
)();
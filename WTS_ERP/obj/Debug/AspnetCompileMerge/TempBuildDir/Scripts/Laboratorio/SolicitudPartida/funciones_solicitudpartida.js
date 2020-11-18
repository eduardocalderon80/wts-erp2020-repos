//funciones fn_metodo
//edit

function fn_nuevo() {    
    _Body({
        url: 'Laboratorio/SolicitudPartida/_EditPartida',
        ventana: '_NewPartida',
        titulo: 'New Departure',
        parametro: 'accion:nuevo',
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
    _('div_filtro_bandeja_solicitudpartida').classList.add('hide');
}


function fn_buscarTela() {
    if (_('cbo_idfamilia').value === '') {
        _swal({ estado: 'erro', mensaje: 'Select the family.' });
        return false;
    }

    //fondotitulo: 'none',
    //    efecto: 'none'
    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_BuscarTela',
        ventana: '_BuscarTela',
        titulo: 'Search fabric',
        parametro: '',
        ancho: '1000',
        alto: ''
    });
}

function fn_buscarEstilo() {
    if (_('hf_idtela').value === '') {
        _swal({ estado: 'error', mensaje: 'Select the fabric.' });
        return false;
    }

    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_BuscarEstilo',
        ventana: '_BuscarEstilo',
        titulo: 'Search style',
        parametro: '',
        ancho: '1000',
        alto: ''
    });
}

function fn_editar() {
    let idsolicitudpartida = _('hf_idsolicitudpartida_index').value;
    _Body({
        url: 'Laboratorio/SolicitudPartida/_EditPartida',
        ventana: '_NewPartida',
        titulo: 'Edit Departure',
        parametro: `accion:edicion,idsolicitudpartida:${idsolicitudpartida}`,
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
    _('div_filtro_bandeja_solicitudpartida').classList.add('hide');
}

function fn_viewmateriaprima_hilado(e) {
    let o = e.currentTarget,
        tag = o.tagName,
        fila = null,
        par_hilado = '',
        par_editar_solicitud = _('txtpar_editpartida').value, 
        idsolicitudpartida = _par(par_editar_solicitud, 'idsolicitudpartida'),
        idhilado = null;

    if (tag === 'A' || tag === 'SPAN') {
        fila = o.parentNode.parentNode.parentNode;
    }
    
    if (fila !== null) {
        par_hilado = fila.getAttribute('data-par');
        idhilado = _par(par_hilado, 'idhilado');
        if (idhilado == '') {
            idhilado = fila.getElementsByClassName('_cbo_hilado')[0].value;
        }

        _modalBody({
            url: 'Laboratorio/SolicitudPartida/_ViewMateriaPrima_Hilado',
            ventana: '_ViewMateriaPrima_Hilado',
            titulo: 'View raw material',
            parametro: `idsolicitudpartida:${idsolicitudpartida},idhilado:${idhilado}`,
            ancho: '800',
            alto: ''
        });
    }
}

function fn_view_crearhilado() {
    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_NewHilado',
        ventana: '_NewHilado',
        titulo: 'New yarn',
        parametro: `accion:new`,
        ancho: '900',
        alto: ''
    });
}

function fn_enviarsolicitudpartida(e) {
    let par_boton = e.currentTarget.getAttribute('data-par');
    let estado_accion = _par(par_boton, 'estado'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value;

    let html = '<strong>Está seguro de enviar la solicitud?</strong>';
    _modalConfirm(html, function () { cambiar_estado_solicitudpartida(estado_accion, idsolicitudpartida) }, function () {
        $('#modalConfirm').modal('hide');
    });
}

function fn_recibirsolicitudpartida(e) {
    let par_boton = e.currentTarget.getAttribute('data-par');
    let estado_accion = _par(par_boton, 'estado'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value;

    let html = '<strong>Está seguro de recibir la solicitud ?</strong>';
    _modalConfirm(html, function () { cambiar_estado_solicitudpartida(estado_accion, idsolicitudpartida) }, function () {
        $('#modalConfirm').modal('hide');
    });
}

function fn_aprobarsolicitudpartida(e) {
    let par_boton = e.currentTarget.getAttribute('data-par');
    let estado_accion = _par(par_boton, 'estado'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value;

    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_Aprobar_Rechazar_SolicitudPartida',
        ventana: '_Aprobar_Rechazar_SolicitudPartida',
        titulo: 'Approve departure request',
        parametro: `accion:edit,estado:${estado_accion},idsolicitudpartida:${idsolicitudpartida}`,
        ancho: '800',
        alto: ''
    });
}

function fn_rechazarsolicitudpartida(e) {
    let par_boton = e.currentTarget.getAttribute('data-par');
    let estado_accion = _par(par_boton, 'estado'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value;

    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_Aprobar_Rechazar_SolicitudPartida',
        ventana: '_Aprobar_Rechazar_SolicitudPartida',
        titulo: 'Reject departure request',
        parametro: `accion:edit,estado:${estado_accion},idsolicitudpartida:${idsolicitudpartida}`,
        ancho: '800',
        alto: ''
    });
}


/*Rules buttons*/
function fn_rules_buttons(_odata) {
    let arr_botonera_detalle = CSVtoJSON(_odata.botonescsv),
        estado = _odata.estado || '',
        estadopartida = _odata.estadopartida.toLowerCase() || '',
        perfil = (!_isEmpty(_odata.perfil))
                  ? (_odata.perfil.indexOf(',') > 0 ? _odata.perfil.split(',')[0].toUpperCase() : _odata.perfil.toUpperCase())
                  : '';
    
        oestados = {
            PE: 'pending',
            SE: 'send',
            RE: 'received',
            RJ: 'rejected',
            AP: 'approved',
            IP: 'inprocess',
            FI: 'finished'
        },
        operfiles = {
            FABRICA: 'fabrica',
            LABORATORIO: 'laboratorio',
            COMERCIAL: 'comercial',
        },
        arr = [];
        
    estado = oestados[estado] || '';
    perfil = operfiles[perfil] || '';

    if (perfil !== '' && estado !== '') {
        const arules_botones = __osolicitudpartida.rules;
        if (arules_botones.length > 0) {
            //let abotones =  arules_botones.filter(x=>x.origen === perfil && x.estado === estado)
            //                .map(x=>x.botones.toLowerCase());
            let abotones = [];
            if (estado == 'finished') {
                abotones = arules_botones.filter(x=>x.perfil === perfil && x.estadosolicitud === estado && x.estadopartida === estadopartida)
                            .map(x=>x.funciones.toLowerCase());
            } else {
                abotones = arules_botones.filter(x=>x.perfil === perfil && x.estadosolicitud === estado)
                            .map(x=>x.funciones.toLowerCase());
            }
            //let abotones = arules_botones.filter(x=>x.perfil === perfil && x.estadosolicitud === estado && x.estadopartida === estadopartida)
            //                .map(x=>x.funciones.toLowerCase());

            arr = arr_botonera_detalle.filter(x=> {
                    return abotones.some(y=>x.metodo.toLowerCase() === y)
                });
        }        
    }
    return arr;
}

function fn_busquedaavanzadaestados() {
    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_BusquedaAvanzadaEstados',
        ventana: '_BusquedaAvanzadaEstados',
        titulo: 'Advanced search',
        parametro: '',
        ancho: '800',
        alto: '',
        fondotitulo:'none',
        efecto:'none'
    });
}

function fn_busquedapocliente() {
    let tbodyestilo = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar'), totalestilos = tbodyestilo.rows.length;
    if (_('hf_idtela').value === '' && totalestilos <= 0) {
        _swal({ estado: 'error', mensaje: 'Select the fabric and style.' });
        return false;
    }

    _modalBody({
        url: 'Laboratorio/SolicitudPartida/_BuscarSolicitudPartida_Po',
        ventana: '_BuscarSolicitudPartidaPo',
        titulo: 'Search po',
        parametro: '',
        ancho: '800',
        alto: ''
        
    });
    //fondotitulo: 'none',
    //efecto: 'none'
}

function fn_iniciarsolicitudpartida() {
    let html = '<strong>Are you sure to start the departure?</strong>';
    _modalConfirm(html, function () {
        iniciar_partida();
    });
}

function fn_reproceso(e) {
    let o = e.currentTarget, par = o.getAttribute('data-par'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value, estado = _par(par, 'estado');
    _Body({
        url: 'Laboratorio/SolicitudPartida/_EditPartida',
        ventana: '_NewPartida',
        titulo: 'Edit Departure',
        parametro: `accion:edicion,idsolicitudpartida:${idsolicitudpartida},estado:${estado},reenviarsino:1`,
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
    _('div_filtro_bandeja_solicitudpartida').classList.add('hide');

}

function fn_reenviar(e) {
    let o = e.currentTarget, par = o.getAttribute('data-par'), idsolicitudpartida = _('hf_idsolicitudpartida_index').value, estado = _par(par, 'estado');
    _Body({
        url: 'Laboratorio/SolicitudPartida/_EditPartida',
        ventana: '_NewPartida',
        titulo: 'Edit Departure',
        parametro: `accion:edicion,idsolicitudpartida:${idsolicitudpartida},estado:${estado},reenviarsino:1`,
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
    _('div_filtro_bandeja_solicitudpartida').classList.add('hide');
}

function fn_downloadreportetecnico(e) {
    let idpartida = _('hf_idpartida_index').value;
    let data = Get('Laboratorio/Partida/GetData_ReportePartida?pidpartida=' + idpartida, res_getdatareporte);
}

function res_getdatareporte(respuesta) {
    let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;
    if (rpta !== null) {
        let idpartida = _('hf_idpartida_index').value;
        let urlaccion = __osolicitudpartida.urlbase + `Laboratorio/Partida/ExportarPartidaPDF?pidpartida=${idpartida}`;
        var link = document.createElement('a');
        link.href = urlaccion;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    } else {
        _swal({ mensaje: 'No data', estado: 'error' }, 'Message');
        return false;
    }
}
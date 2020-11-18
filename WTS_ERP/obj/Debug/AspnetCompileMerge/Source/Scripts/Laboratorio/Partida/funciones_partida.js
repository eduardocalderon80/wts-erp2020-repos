function fn_editarpartida(e) {
    let idpartida = _('hf_idpartida_index').value;

    _Body({
        url: 'Laboratorio/Partida/Editar_Partida',
        ventana: '_EditarPartida',
        titulo: 'Edit Departure',
        parametro: `accion:editar,idpartida:${idpartida}`,
        fn: function () {
            _('divmenu_breadcrum').classList.add('hide');
            _('divdetalle_breadcrum').classList.add('hide');
        }
    });
    _('div_filtro_bandeja_partida').classList.add('hide');
}

function fn_finalizarpartida() {
    let idpartida = _('hf_idpartida_index').value, html = '<strong>Está seguro de finalizar la partida?</strong>', estadopartida = _('hf_estadoactualbusqueda_partida_index').value;

    if (estadopartida === 'rejected') {
        // MODAL PARA REPROCESO
        _modalConfirm(html, function () {
            $("#modalConfirm").modal('hide');
            _modalBody({
                url: 'Laboratorio/Partida/_FinalizarConReproceso',
                ventana: '_FinalizarConReproceso',
                titulo: 'Finalizar partida',
                parametro: `accion:edit,idpartida:${idpartida},estado:${estadopartida}`,
                ancho: '800',
                alto: ''
            });
        });
    } else if (estadopartida === 'approved') {
        _modalConfirm(html, function () {
            $("#modalConfirm").modal('hide');
            _modalBody({
                url: 'Laboratorio/Partida/_FinalizarConReproceso',
                ventana: '_FinalizarConReproceso',
                titulo: 'Finalizar partida',
                parametro: `accion:edit,idpartida:${idpartida},estado:${estadopartida}`,
                ancho: '800',
                alto: ''
            });

            //_Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida)
            //    .then((odata_respuesta) => {
            //        res_getDataPartida_Parafinalizar(odata_respuesta);
            //    }, (p) => { _err(p) });

        });
    } else {  // AQUI ENTRA CUANDO ES ESTADO PENDIENTE
        html = '<strong>Está seguro de finalizar la partida en estado pending?</strong>'
        _modalConfirm(html, function () {
            $("#modalConfirm").modal('hide');
            _modalBody({
                url: 'Laboratorio/Partida/_FinalizarConReproceso',
                ventana: '_FinalizarConReproceso',
                titulo: 'Finalizar partida',
                parametro: `accion:edit,idpartida:${idpartida},estado:${estadopartida}`,
                ancho: '800',
                alto: ''
            });

            //_Get('Laboratorio/Partida/GetPartidaById_JSON?par=' + idpartida)
            //    .then((odata_respuesta) => {
            //        res_getDataPartida_Parafinalizar(odata_respuesta);
            //    }, (p) => { _err(p) });
        });
        //swal({
        //    title: "Message",
        //    text: "No se puede finalizar la partida en estado pendiente",
        //    type: "error"
        //}, function (accion) {
        //    //oculta mensaje
        //    return true;
        //});
    }
    
}

function fn_aprobarpartidacomercial(e) {
    let idpartida = _('hf_idpartida_index').value, estado_partida = _('hf_estadoactualbusqueda_partida_index').value;
    _modalBody({
        url: 'Laboratorio/Partida/_AprobacionComercial',
        ventana: '_AprobacionComercial',
        titulo: 'Approve',
        parametro: `accion:edit,idpartida:${idpartida},estado:${estado_partida}`,
        ancho: '800',
        alto: ''
    });
}

function fn_busquedaavanzadaestados_partida() {
    _modalBody({
        url: 'Laboratorio/partida/_BusquedaAvanzadaEstados_Partida',
        ventana: '_BusquedaAvanzadaEstados_Partida',
        titulo: 'Advanced search',
        parametro: '',
        ancho: '800',
        alto: '',
        fondotitulo: 'none',
        efecto: 'none'
    });
}

function fn_downloadreportetecnico_partida() {
    let idpartida = _('hf_idpartida_index').value;
    let data = Get('Laboratorio/Partida/GetData_ReportePartida?pidpartida=' + idpartida, res_getdatareporte_partida);
}

function res_getdatareporte_partida(respuesta) {
    let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;
    if (rpta !== null) {
        let idpartida = _('hf_idpartida_index').value;
        let urlaccion = __opartida.urlbase + `Laboratorio/Partida/ExportarPartidaPDF?pidpartida=${idpartida}`;
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
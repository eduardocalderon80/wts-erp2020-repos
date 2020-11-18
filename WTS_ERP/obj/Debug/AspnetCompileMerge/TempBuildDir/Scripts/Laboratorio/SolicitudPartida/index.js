var __osolicitudpartida = {
    urlbase: _('urlBase').value,
    rules:[],
    lstdata_bandejasolicitud: [],
    enumEstado_abreviado: {
        Pending: "PE",
        Sent: "SE",
        Received: "RE",
        Approved: "AP",
        Rejected: "RJ"
    },
    enumEstado_largo: {
        PE: 'Pending',
        SE: "Sent",
        RE: "Received",
        AP: "Approved",
        RJ: "Rejected"
    },
    perfil:''
}

function load() {
    [..._('submenuestado').getElementsByClassName('_submenu')].forEach(x=> { x.addEventListener("click", function (e) { req_load_menu_filter(e) }); })

    _('span_filtrobandeja_solicitudpartida').addEventListener('click', filtro_solicitudpartida_index);
    _('span_refresh_solicitudpartidaindex').addEventListener('click', refrescarsolicitudpartida_index);
    _('txtfiltrobandeja_solicitudpartida').addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            filtro_solicitudpartida_index();
        }
    });

    //_('btnReproceso_eliminar').addEventListener('click', fn_reproceso);
}

function fn_botonera_encabezado(_csv) {
    let arr = CSVtoJSON(_csv);
    let abotones = (arrbotones) => {
        return (
        arrbotones.map((x) => {
            return (`<button class="btn btn-white" data-toggle="tooltip" data-placement="left" title="${x.titulo}" onclick="fn_${x.metodo.toLowerCase()}()"><span class="${x.icon}"></span> </button>`);
        })).join('')
    }
    let botones = abotones(arr);
    _('divbotonera_encabezado').insertAdjacentHTML('beforeend', botones);
}

function fn_botonera_detalle(_odata) {
    let arr = fn_rules_buttons(_odata);

    let abotones = (arrbotones) => {
        return (
        arrbotones.map((x) => {
            return (`<button class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="left" data-par='${x.parametro}' title="${x.titulo}" onclick="fn_${x.metodo.toLowerCase()}(event)"><span class="${x.icon}"></span> </button>`);
        })).join('')
    }
    let botones = abotones(arr);

    if (   (_('hf_estadoactualbusqueda_index').value.toLowerCase() === 'approved' && _('hf_estadoactualbusqueda_index').value.toLowerCase() === 'fi') || (_('hf_estadoactualbusqueda_index').value.toLowerCase() === 'rejected' && _('hf_estadoactualbusqueda_index').value.toLowerCase() === 'fi')   ) {
        // VER EL BOTON DE DESCARGAR PDF
        botones += `<button class='btn btn-white btn-sm' data-toggle="tooltip" data-placement="left" data-par='DOWNLOADPDF' title='Download technical report' onclick='fn_downloadreportetecnico(event);'>
                <span class='fa fa-download'></span>
            </button>`;
    }
    _('divbotonera').innerHTML = botones;
}

function req_load_menu_filter(_submenu) {
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');
    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let estado = _submenu.target.getAttribute('data-estado'),
        url = 'Laboratorio/SolicitudPartida/getDataSolicitud', parindex = _('txtpar_solicitudpartida_index').value,
        idmodulo = _par(parindex, 'idmodulo'),
        par = { estado: estado, idmodulo: idmodulo },
        url_par = `${url}?par=${JSON.stringify(par)}`;

    _('hf_estadoactualbusqueda_index').value = estado;
    if (estado !== 'advanced') {
        _Get(url_par).then(function (value) {
            let odata = JSON.parse(value)[0];
            let adata = CSVtoJSON(odata.detalle);
            __osolicitudpartida.lstdata_bandejasolicitud = CSVtoJSON(odata.detalle);
            _('_menu').innerHTML = fn_load_menu(adata, estado);
        }, function (reason) { console.log("error 1 ", reason); })
        .then(function () {
            fn_clear_content();
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            aitem.forEach(x=> {
                x.addEventListener('click', function (y) {
                    let id = x.getAttribute('data-id');
                    req_load_content(id);
                })
            });
        })
    } else {
        // :pending
        //_('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
        fn_busquedaavanzadaestados(); //funciones en otro js
    }
}

function req_load_menu_filteravanzado(parametro) {
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');
    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let url = 'Laboratorio/SolicitudPartida/getDataSolicitud', parindex = _('txtpar_solicitudpartida_index').value,
        idmodulo = _par(parindex, 'idmodulo');

    parametro['idmodulo'] = idmodulo;

    let url_par = `${url}?par=${JSON.stringify(parametro)}`;
    let estado = parametro['estado'];
    _('hf_estadoactualbusqueda_index').value = estado;
    _Get(url_par).then(function (value) {
        let odata = JSON.parse(value)[0];
        let adata = CSVtoJSON(odata.detalle);
        if (adata.length > 0) {
            __osolicitudpartida.lstdata_bandejasolicitud = CSVtoJSON(odata.detalle);
            _('_menu').innerHTML = fn_load_menu(adata, estado);
            $('#modal__BusquedaAvanzadaEstados').modal('hide');
        }
        return adata;
    }, function (reason) { console.log("error 1 ", reason); })
        .then(function (odata) {
            if (odata.length > 0) {
                fn_clear_content();
                let menu = document.getElementById('_menu');
                let aitem = [...menu.getElementsByClassName('_item')];
                aitem.forEach(x=> {
                    x.addEventListener('click', function (y) {
                        let id = x.getAttribute('data-id');
                        req_load_content(id);
                    });
                });
            } else {
                _swal({ estado: 'error', mensaje: 'No data!' });
            }
        });
}

/*accion: cargar el menu, cargar la vista x el id */
function req_load_menu_filter_result(_estado, _id) {
    _('divmenu_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').classList.remove('hide');
    _('divdetalle_breadcrum').style.maxheight = '850px !important';
    let _bodyanterior = document.querySelector('._body');
    if (!_isEmpty(_bodyanterior)) { _('divcontenedor_breadcrum').removeChild(_bodyanterior); }

    let url = 'Laboratorio/SolicitudPartida/getDataSolicitud_Respuesta', parindex = _('txtpar_solicitudpartida_index').value,
        idmodulo = _par(parindex, 'idmodulo'), nombreventana = _par(parindex, 'nombreventana');

    nombreventana = nombreventana.toUpperCase() === 'SOLICITUD PARTIDA 2' ? 'Solicitud Partida' : nombreventana;

    let par = { estado: _estado, id: _id, idsolicitudpartida: _id, idmodulo: idmodulo, nombreventana: nombreventana },
        url_par = `${url}?par=${JSON.stringify(par)}`,
        vista = '';
    _('hf_estadoactualbusqueda_index').value = _estado;
    _Get(url_par, true).then(function (value) {
        let odata = JSON.parse(value)[0];
        let adata = CSVtoJSON(odata.menu);
        __osolicitudpartida.lstdata_bandejasolicitud = CSVtoJSON(odata.menu);
        _('_menu').innerHTML = fn_load_menu(adata, _estado);
        vista = odata.vista;
    }, function (reason) { console.log("error 1 ", reason); })
    .then(function () {
        fn_clear_content();
        let menu = document.getElementById('_menu');
        let aitem = [...menu.getElementsByClassName('_item')];
        aitem.forEach(x=> {
            let id = x.getAttribute('data-id');
            x.addEventListener('click', function (y) { req_load_content(id); })
        });
    })
    .then(function () {
        // :vista
        res_load_content(vista);
        return vista !== '';
    })
    .then(function (estado) {
        if (estado) {
            // :menu
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            let idsolicitudpartida = _id.toString();
            let exito = aitem.some(x=> {
                if (idsolicitudpartida === x.getAttribute("data-id")) {
                    x.classList.add("active");
                    return true;
                }
            })
        }
    })

}

// :sarone
function req_ini() {
    let url = 'Laboratorio/SolicitudPartida/getDataSolicitud', parindex = _('txtpar_solicitudpartida_index').value,
        idmodulo = _par(parindex, 'idmodulo'),
        par = { estado: 'pending', idmodulo: idmodulo },
        url_par = `${url}?par=${JSON.stringify(par)}`,
        _err = function (__error) { console.log("error", __error) };

    _Get(url_par)
    .then((vista) => {
        let odata = JSON.parse(vista)[0];
        let adata = CSVtoJSON(odata.detalle);
        __osolicitudpartida.lstdata_bandejasolicitud = CSVtoJSON(odata.detalle);
        let botoneras = odata.botones; //odata.botoneras;
        fn_botonera_encabezado(botoneras);
        __osolicitudpartida.rules = JSON.parse(odata.botoneras_rules);
        __osolicitudpartida.perfil = odata.perfil;
        _('_menu').innerHTML = fn_load_menu(adata, 'pending');
        _('hf_estadoactualbusqueda_index').value = 'pending';
    }, (p) => { _err(p) })
    .then(() => {
        _Getjs('Laboratorio/SolicitudPartida/funciones_solicitudpartida');
        let menu = document.getElementById('_menu');
        let aitem = [...menu.getElementsByClassName('_item')];
        aitem.forEach(x=> {
            x.addEventListener('click', function (y) {
                let id = x.getAttribute('data-id');
                req_load_content(id);
            })
        });
    })

}


function req_load_content(_id) {
    let parindex = _('txtpar_solicitudpartida_index').value, idmodulo = _par(parindex, 'idmodulo'), nombreventana = _par(parindex, 'nombreventana'),
        url = 'Laboratorio/SolicitudPartida/getDataSolicitudbyId';

    nombreventana = nombreventana.toUpperCase() === 'SOLICITUD PARTIDA 2' ? 'Solicitud Partida' : nombreventana;
    
    let par = { idsolicitudpartida: _id, idmodulo: idmodulo, nombreventana: nombreventana },
        url_par = `${url}?par=${JSON.stringify(par)}`;
    Get(url_par, res_load_content, true);
}


function res_load_content(respuesta) {
    let obj = JSON.parse(respuesta)[0];
    
    let titulo_1 = (_obj) => { return `<strong>Created:</strong>  <i class="fa fa-clock-o"></i> ${_obj.fecha}`; },
        titulo_2 = (_obj) => { return `<strong>Edited:</strong>       <i class="fa fa-clock-o"></i> ${_obj.fechaupdate}`; },
        titlehead = (_obj) => { return `${_obj.titlehead}`; },
        tienecodigotela = obj.tienecodigotela;
    let partida_row1 = (_obj) => {
        let _return = `<h4 class="text-navy"><strong>${_obj.factory}</strong></h4>
            <p><span><strong>Dry Cleaner: </strong> ${_obj.drycleaner}</span></p>
            <p><span><strong>Color: </strong> ${_obj.color}</span></p>
            <p><span><strong>Family: </strong> ${_obj.family}</span></p>
            <p><span><strong>With fabric Code: </strong> ${_obj.withfabriccode}</span></p>
            `;
        return _return;
    }

    // SE COMENTO ESTO POR QUE YA NO SE VA A GRABAR EL TIPO DE REPORTE TECNICO EN LA SOLICITUD DE PARTIDA; SINO EN LA PARTIDA
    //<p><span><strong>Technical Report Format: </strong> ${_obj.technicalreportformat}</span></p>
    //<p><span><strong>PO: </strong> ${_obj.po}</span></p>  // ya no se va a ver el label de po
    let partida_row1_1 = (_obj) => {
        let _return = `
            <br><br>
            <p><span><strong>Type of departure: </strong> ${_obj.tipopartida}</span></p>
            `;
        return _return;
    }

    let datatela = (_obj) => {
        let _return = `
        <p><span><strong>Fabric: </strong> ${_obj.fabric}</span></p>
        <p><span><strong>Description: </strong> ${_obj.description}</span></p>
        <p><span><strong>Title: </strong> ${_obj.title}</span></p>
        <p><span><strong>Composition Porcentaje: </strong> ${_obj.compositionporcentaje}</span></p>
        <br/>
        `
        return _return;
    }
    let partida_row3 = (_obj) => {
        let html_br = tienecodigotela === 1 ? '<br><br><br><br>' : '';
        let _return = `
        <p><span><strong>Density: </strong> ${_obj.density}</span></p>
        <p><span><strong>Standar Density: </strong> ${_obj.standarddensity}</span></p>
        <p><span><strong>Washing In Cloths: </strong> ${_obj.washingincloths}</span></p>
        <p><span><strong>Same Color: </strong> ${_obj.samecolor}</span></p>
        <p><span><strong>Comments: </strong> ${_obj.comments}</span></p>`;
        return html_br + _return;
    }

    let partida_details = (_obj) => {
        if (_obj.details === '') return '';
        let _ahead_name = _obj.details.split('^')[0].split('¬'),
            _arr = CSVtoJSON(_obj.details),
            _ahead_titulotabla = Object.values(_arr[0]),
            _abody = _arr.splice(1, _arr.length);

        let _return = (_obj, _ahead_name, _ahead_titulotabla) => {
            let _th = _ahead_titulotabla.map((x) => { return (`<th>${x}</th>`) }).join('');
            let _tr = (_abody) => {
                return (_abody.map((x) => { return (`</tr>${_ahead_name.map((y) => { return (`<td>${x[y]}</td>`) }).join('')}</tr>`) })).join('');
            }
            let _thead = `<thead><tr>${_th}</tr></thead>`;
            let _tbody = `<tbody>${_tr(_abody)}</tbody>`;
            return _thead + _tbody;
        };
        return _return(_obj, _ahead_name, _ahead_titulotabla);
    }
    let detalle = partida_details(obj);
    let perfil = !_isEmpty(__osolicitudpartida.perfil) ? __osolicitudpartida.perfil : obj.perfil;

    let detalle_po = (_obj) => {
        if (_obj.detalle_po === '') return '';
        let _ahead_name_po = _obj.detalle_po.split('^')[0].split('¬'),
            _arr_po = CSVtoJSON(_obj.detalle_po),
            _ahead_titulotabla_po = Object.values(_arr_po[0]),
            _abody_po = _arr_po.splice(1, _arr_po.length);

        let _return_po = (_obj, _ahead_name_po, _ahead_titulotabla_po) => {
            let _th_po = _ahead_titulotabla_po.map((x) => { return (`<th>${x}</th>`) }).join('');
            let _tr_po = (_abody_po) => {
                return (_abody_po.map((x) => { return (`<tr>${_ahead_name_po.map((y) => { 
                    return (`<td>${x[y]}</td>`) }).join('')}</tr>`) 
                })).join('');
            }
            let _thead_po = `<thead><tr>${_th_po}</tr></thead>`;
            let _tbody_po = `<tbody>${_tr_po(_abody_po)}</tbody>`;
            return _thead_po + _tbody_po;
        };
        return _return_po(_obj, _ahead_name_po, _ahead_titulotabla_po);
    }
    let detalle_po_html = detalle_po(obj);

    //let par_inicial = _('txtpar_solicitudpartida_index').value, paradicional = par_inicial + `,idsolicitudpartida:${obj.id}`;
    //_('txtpar_solicitudpartida_index').value = paradicional;
    _('hf_idsolicitudpartida_index').value = obj.id;
    _('hf_idpartida_index').value = obj.idpartida;

    _('titulo_tbl_strong').innerText = (tienecodigotela === 1) ? 'Style' : 'Yarn';
    (tienecodigotela === 1)
        ? _('div_padre_datostela').classList.remove('hide')
        : _('div_padre_datostela').classList.add('hide');

    _('divpartida_row1').innerHTML = partida_row1(obj);
    _('divpartida_row1_2').innerHTML = partida_row1_1(obj);
    _('div_data_tela').innerHTML = datatela(obj);
    _('divpartida_row3').innerHTML = partida_row3(obj);
    _('titulo_tela_strong').innerText = 'Fabric';
    _('divtitulo_1').innerHTML = titulo_1(obj);
    _('divtitulo_2').innerHTML = titulo_2(obj);
    _('titulo_2').innerHTML = titlehead(obj);

    (detalle === '') ? _('div_tbl_detalle').classList.add('hide') : _('div_tbl_detalle').classList.remove('hide');
    _('tabla_laboratorio_detalle').innerHTML = detalle;

    (detalle_po_html === '') ? _('div_tbl_po').classList.add('hide') : _('div_tbl_po').classList.remove('hide');
    _('tabla_laboratorio_po').innerHTML = detalle_po_html;

    fn_botonera_detalle({ botonescsv: obj.botones, perfil: perfil, estado: obj.estado_solicitudpartida, estadopartida: obj.estado_partida });
    //:add vista
    let tab = document.getElementById('tab-1');
    if (!tab.classList.contains('active')) tab.classList.add('active')
}


function fn_clear_content() {
    _('titulo_tbl_strong').innerText = '';
    _('div_padre_datostela').classList.add('hide');
    _('divpartida_row1').innerHTML = '';
    _('divpartida_row1_2').innerHTML = '';
    _('div_data_tela').innerHTML = '';
    _('divpartida_row3').innerHTML = '';
    _('titulo_tela_strong').innerText = '';
    _('divtitulo_1').innerHTML = '';
    _('titulo_2').innerHTML = '';
    _('div_tbl_detalle').classList.add('hide');
    _('tabla_laboratorio_detalle').innerHTML = '';
}


function fn_load_menu(adata, estado) {
    let items = '',
        oestado = {
            pending: 'warning',
            rejected: 'danger',
            approved: 'primary',
            defecto: 'info',
            PE: 'warning',
            SE: 'warning',
            RE: 'waring',
            AP: 'waring',
            IP: 'warning',
            RJ: 'danger',
            FI: 'primary'
        },
        clase = oestado[estado] || oestado.defecto,
        titulo = estado !== '' ? estado.toUpperCase() : '';

    adata.forEach(x=> {
        items += `<li class="list-group-item _item" data-id="${x.id}">
                    <a data-toggle="tab" href="#tab-1">
                        <small class ="pull-right text-muted">${x.fecha}</small>
                        <strong>${x.partida!==''?x.partida.toUpperCase():''}</strong>

                        <div class ="small m-t-xs">                            
                            <strong>${x.customer} - ${x.code}</strong>
                            <p>
                            <div><strong>PO: </strong> ${x.po!==''?x.po:'none'}</div>
                            <div><strong>Style: </strong> ${x.estilo!==''?x.estilo:'none'}</div>
                            </p>
                        </div>
                        <div class="small m-t-xs">
                            <div><strong>Color:</strong> ${x.color}</div>
                            <p>${x.family} -${x.fabriccode}</p>
                            <p class ="m-b-none">
                                <span class ='medium label pull-right label-${clase}' style='font-size:10px'>${x.estado}</span>
                                <i class ="fa fa-tag"></i>
                                ${x.tipopartida}
                            </p>
                        </div>
                    </a>
                </li>`;
    });
    return items;
}
// :menu


// edu: FUNCIONES DE CAMBIO DE ESTADO
function cambiar_estado_solicitudpartida(estado, idsolicitudpartida, comentario_aprobado_rechazado) {
    let comentario = comentario_aprobado_rechazado || '';
    let parametro = { idsolicitudpartida: idsolicitudpartida, estado: estado, comentarioaprobadorechazado: comentario };

    let frmdata = new FormData();
    frmdata.append('par', JSON.stringify(parametro));
    Post('Laboratorio/SolicitudPartida/cambiar_estado_solicitudpartida', frmdata, res_update_cambioestado);
}

function res_update_cambioestado(rpta) {
    let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;
    if (orpta !== null) {
        if (orpta.id > 0) {
            let odata = orpta.data !== '' ? JSON.parse(orpta.data)[0] : null;
            let idsolicitudpartida = odata.idsolicitudpartida,
                estado = odata.estado,
                mensaje = orpta.mensaje;

            let url = 'Laboratorio/SolicitudPartida/EnviarCorreo',
                url_par = `${url}?idsolicitudpartida=${idsolicitudpartida}&estado=${estado}`;

            _Get(url_par)
               .then(function (oresponse) {
                   let orespuesta = JSON.parse(oresponse);
                   if (orespuesta.Success) {
                       req_load_menu_filter_result('pending', idsolicitudpartida);
                   }
                   return orespuesta;
               }, function (reason) { console.log("error 1 ", reason); })
               .then(function (oresponse) {
                   let tipo = oresponse.Success ? 'success' : 'error';
                   //mensaje
                   swal({
                       title: "Message",
                       text: mensaje,
                       type: tipo
                   }, function (accion) {
                       //oculta mensaje
                       if (accion) {
                           if (estado === 'SE' || estado === 'RE') {
                               $('#modalConfirm').modal('hide');
                           } else if (estado === 'AP' || estado === 'RJ') {
                               $('#modal__Aprobar_Rechazar_SolicitudPartida').modal('hide');
                           }
                       }
                   });
               })
        }
    }
}


// :filter
function filtro_solicitudpartida_index() {
    let txtfilter = _('txtfiltrobandeja_solicitudpartida').value,
        estado = _('hf_estadoactualbusqueda_index').value,
        filtrado = __osolicitudpartida.lstdata_bandejasolicitud.filter(x => x.camposconcatenadosparafiltro.toLowerCase().indexOf(txtfilter) >= 0);

    _('_menu').innerHTML = fn_load_menu(filtrado, estado);
    let menu = document.getElementById('_menu'),
        aitem = [...menu.getElementsByClassName('_item')];

    aitem.forEach(x=> {
        x.addEventListener('click', function (y) {
            let id = x.getAttribute('data-id');
            req_load_content(id);
        })
    });
}

function refrescarsolicitudpartida_index() {
    let par = _('txtpar_solicitudpartida_index').value;
    _Go_Url('Laboratorio/SolicitudPartida/Index', 'Laboratorio/SolicitudPartida/Index', par);
}

function iniciar_partida() {
    let url = 'Laboratorio/SolicitudPartida/IniciarPartida', idsolicitudpartida = _('hf_idsolicitudpartida_index').value,
        parametro = { idsolicitudpartida: idsolicitudpartida }, idpartida = 0;

    let frmdata = new FormData();
    frmdata.append('par', JSON.stringify(parametro));
    Post(url, frmdata, function (respuesta) {
        let orespuesta = JSON.parse(respuesta);
        idpartida = orespuesta.id;
        swal({
            title: "Message",
            text: orespuesta.mensaje,
            type: orespuesta.estado
        }, function (result) {
            if (result) {
                // AQUI CARGAR LA VISTA DE PARTIDA
                $('#modalConfirm').modal('hide');

                ruteo_solicitudpartida_to_partida('Pending', idpartida);

                //redirect_bandeja_partida(idpartida);
            }
        });
    }, false);
}

(function ini() {
    load();
    req_ini();
})();
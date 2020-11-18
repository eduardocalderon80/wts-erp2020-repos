var appSolicitudAtx = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial: '',
            rolservicio: [],
            roles: '',
            estados: { SOLICITADO: 'S', CREADO: 'C', RECHAZADO: 'CR', PORAPROBAR: 'PAP', PORAPROBARCONRECHAZO: 'PAR', PORASIGNAR: 'PAS', POROPERAR: 'PO', ENPROCESO: 'EN', POROPERARCONRECHAZO: 'POR', PORREVISAR: 'PR', PORREVISARCONRECHAZAO: 'PRR', FINALIZADO: 'F' },
            lstdata_bandejasolicitud: [],
            estados_enum_retorno: {
                S: 'pendiente_solicitar', C: 'pendiente_solicitar', CR: 'pendiente_solicitar',
                PAP: 'solicitud_por_aprobar', PAR: 'solicitud_por_aprobar', PAS: 'solicitud_por_asignar', PO: 'atx_por_operar', EN: 'atx_en_proceso', POR: 'atx_por_operar', PR: 'atx_por_revisar', PRR: 'atx_por_revisar',
                F: 'finalizado'
            },
            rolesdtextil: '4,5,6,7',
            motivorechazo: [],
            obj_a_version: {},
            obj_b_version: {},
            obj_a_correlativo: {},
            obj_b_correlativo: {},
            enums_acabadofisico_validcodigotela: { Esmerilado: 3, Perchado: 5, Tundido: 6 },
            idproveedor: '',
            origenmuestra_colgador_generarcodigotela: '',  //// ESTO ES PARA SABER QUE HACER CAMBIAR ESTAO O NO
            origenmuestra: '',
            codigotela_colgadorwts: '',
            idoperador: '',
            estado_tabla_solicitudes: '',
            lstDetalle: [],
            lstSolicitud: [],
            lstOrden: [],
            lstAgregar: [],
            lstperfil: [],
            estadorecibidocolgador: ''
        }

        function getEstado() {
            var par = _('txtpar_solicitudatx_index').value, _estado = _par(par, 'estado_resumen');

            if (_estado === undefined) {
                _estado = 'init';
            }
            return _estado;
        }

        var err_xhr = (__err) => {
            console.log('err', __err);
        }

        function load() {
            let par = _('txtpar_solicitudatx_index').value;
            ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
            _('txtfiltrobandeja_solicitudatx').addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    filtro_solicitudatx_index();
                }
            });
            d.getElementById('span_filtrobandeja_solicitudatx').addEventListener('click', filtro_solicitudatx_index);
            d.getElementById('span_refresh_solicitudatxindex').addEventListener('click', refrescarsolicitud_index, false);

            ////d.getElementById('btnsolicitudimprimir').addEventListener('click',imprimirsolicitud);

            //d.getElementById('btncambiarestado').addEventListener('click',cambiarestado);

            _('divbotonera_encabezado').getElementsByClassName('dropdown-toggle')[0].addEventListener('click', vermenuestados_bandeja, false);
            let arrbtnsubmenu_estados = Array.from(_('divbotonera_encabezado').getElementsByClassName('_cls_submenu_estados'));
            arrbtnsubmenu_estados.forEach(x => {
                x.addEventListener('click', ver_submenu_estados, false);
            });

            let arrbtn_item_submenu_estados = Array.from(_('divbotonera_encabezado').getElementsByClassName('_cls_item_submenu_estados'));
            arrbtn_item_submenu_estados.forEach(x => {
                x.addEventListener('click', fn_filtrarbandeja_segunestado, false);
            });
            handler_scanner_barcode();
        }

        function fn_cambiarestado() {
            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_CambiarEstado',
                ventana: '_CambiarEstado',
                titulo: 'Cambiar estado de la solicitud',
                parametro: ``,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        //// YA NO SE ESTA USANDO
        function vermenuestados_bandeja() {
            //let btn_ver_submenu_estados = _('divbotonera_encabezado').getElementsByClassName('_ul_menu_estados_bandeja')[0];
            //if (btn_ver_submenu_estados.style.display === 'inline-block'){
            //    btn_ver_submenu_estados.style.display = 'none';
            //} else {
            //    btn_ver_submenu_estados.style.display = 'inline-block';
            //}
            ////_('divbotonera_encabezado').getElementsByClassName('_ul_menu_estados_bandeja')[0].style.display = 'inline-block';
        }

        function ver_submenu_estados(e) {
            let o = e.currentTarget, liparent = o.parentNode;
            //_('divbotonera_encabezado').getElementsByClassName('_submenu_estados')[0].style.display = 'block';
            liparent.getElementsByClassName('_submenu_estados')[0].style.display = 'block';
        }

        function fn_filtrarbandeja_segunestado(e) {
            //// GetBandejaSolicitud_Filtro_estado_CSV
            let o = e.currentTarget, estado = o.getAttribute('data-estado'), par = _('txtpar_solicitudatx_index').value, url = 'DesarrolloTextil/Solicitud/GetBandejaFiltro_CSV',
                parametro = { estado_resumen: estado };

            let arrpar = par.split(',');

            arrpar.some((x, index) => {
                if (x.indexOf('estado_resumen') !== -1) {
                    arrpar.splice(index, 1);
                    return true;
                }
            });

            let new_str_parametro = arrpar.join(',');
            new_str_parametro += ',estado_resumen:' + estado

            let url_vista = 'DesarrolloTextil/Solicitud/Index';

            let vista = fn_loadvista_index_bandeja(url_vista, new_str_parametro);
        }

        //// LE VOY A PASAR AL JS RUTEADOR
        //var fn_loadvista_index_bandeja = async (urlvista, par) => {
        //    let rpta = await _Get(urlvista);
        //    let contenido = '';

        //    if (rpta !== ''){
        //        contenido = (par !== '') ? rpta.replace('DATA-PARAMETRO', par) : rpta;
        //        _('divContenido').innerHTML = contenido;
        //        let urlB = urlBase();
        //        checkloadjscssfile(urlB + `Scripts/${urlvista}.js`, "js")
        //    }
        //}

        function refrescarsolicitud_index() {
            let par = _('txtpar_solicitudatx_index').value;
            _Go_Url('DesarrolloTextil/Solicitud/Index', 'DesarrolloTextil/Solicitud/Index', par);
        }

        function req_ini() {
            // CARGAR LA BANDEJA FILTRO
            //// parametro = { estado_resumen: 'init', estado_solicitud: '' }
            let err = function (__err) { console.log('err', __err) }, par = _('txtpar_solicitudatx_index').value, estadoresumen = _par(par, 'estado_resumen');

            let parametro = '';
            if (estadoresumen !== '') {
                //// SE HACE ESTO PORQUE SE RESUMIO EL FILTRO EN 3
                switch (estadoresumen) {
                    case 'solicitud_por_aprobar':
                    case 'solicitud_con_rechazo':
                    case 'solicitud_por_asignar':
                    case 'atx_por_operar':
                    case 'atx_en_proceso':
                    case 'atx_por_revisar':
                        estadoresumen = 'pendiente_finalizar';
                        break;
                }
                parametro = { estado_resumen: estadoresumen, estado_solicitud: '' }
            } else {
                parametro = { estado_resumen: 'init', estado_solicitud: '' }
            }

            _Get('DesarrolloTextil/Solicitud/GetBandejaFiltro_CSV?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let odata = rpta[0].solicitud !== '' ? CSVtoJSON(rpta[0].solicitud) : null;
                        ovariables.rolservicio = CSVtoJSON(rpta[0].rolservicio);
                        ovariables.roles = rpta[0].roles;
                        appSolicitudAtx.ovariables.lstdata_bandejasolicitud = odata;
                        ovariables.motivorechazo = rpta[0].motivorechazo;
                        ovariables.idproveedor = rpta[0].idproveedor;
                        ovariables.lstperfil = rpta[0].cadena_perfiles !== '' ? fn_convert_csvtojson(rpta[0].cadena_perfiles, '^') : [];
                        if (ovariables.rolservicio !== null) {
                            fn_botonera_encabezado(ovariables.rolservicio);
                        }
                        if (odata !== null) {
                            _('_menu').innerHTML = fn_load_menu(odata, '');
                            handler_menu_filter_init();
                        }

                    }
                }, (p) => { err(p); });
        }

        function fn_convert_csvtojson(cadena, delimitador) {
            let arr = cadena.split(delimitador);
            return arr;
        }

        function handler_menu_filter_init() {
            let menu = document.getElementById('_menu');
            let aitem = [...menu.getElementsByClassName('_item')];
            aitem.forEach(x => {
                x.addEventListener('click', function (y) {
                    // Jacob - Se agrego condicional para cotizacion
                    let data_par = x.getAttribute('data-par');
                    let idservicio = _parseInt(_par(data_par, 'idservicio'));
                    let id = x.getAttribute('data-id');
                    if (idservicio === 13) {
                        req_CargarCotizacion(id);
                    } else {
                        req_load_content_init(id);
                    }
                })
            });
        }

        function req_load_content_init(_id) {

            let parindex = _('txtpar_solicitudatx_index').value, idmodulo = _par(parindex, 'idmodulo'), nombreventana = _par(parindex, 'nombreventana'),
                url = 'DesarrolloTextil/Solicitud/getDataSolicitudAtxtbyId?par=' + JSON.stringify({ idsolicitud: _id });

            let err = function (__err) { console.log('err', __err) };

            _Get(url)
                .then((respuesta) => {
                    res_load_content_init(respuesta);
                }, (p) => { err(p) });
        }

        function res_load_content_init(respuesta) {
            // Jacob - Limpiar Botones
            _('divbotonera').innerHTML = '';

            let obj = JSON.parse(respuesta)[0], solicitud = obj.solicitud !== '' ? JSON.parse(obj.solicitud)[0] : null,
                origenmuestra_colgador_generarcodigotela = obj.origenmuestra_colgador_generarcodigotela;

            ovariables.origenmuestra_colgador_generarcodigotela = origenmuestra_colgador_generarcodigotela;
            ovariables.origenmuestra = solicitud.tipomuestra;
            ovariables.codigotela_colgadorwts = solicitud.codigotela_13_digitos;
            //// ESTOS DATOS ES PARA COLGADORES
            ovariables.idoperador = solicitud.idoperador;
            ovariables.estado_tabla_solicitudes = solicitud.estado;

            _('hf_idusuario').value = obj.idusuario;

            let titulo_1 = (_obj) => { return `<strong>Created:</strong>  <i class="fa fa-clock-o"></i> ${_obj.fecharegistra}`; },
                titulo_2 = (_obj) => { return `<strong>Edited:</strong>       <i class="fa fa-clock-o"></i> ${_obj.fechaedita}`; },
                titlehead = (_obj) => { return `${_obj.titlehead}`; };

            let subtitulo_1 = (_obj) => {
                let html = '', html_recibido = '';
                if (_obj.solicitudrecibida_desarrollotextil === 1) {
                    html = `
                        <p><span class='text-success'><strong>Solicitud Recibida </strong> <span class="fa fa-check-circle-o"></span></span></p>
                    `;
                }
                return html;
            }

            //// PINTAR DATOS COMUNES; A LAS SOLICITUDES DE ATX; COLGADOR
            _('divtitulo_1').innerHTML = titulo_1(solicitud);
            _('divtitulo_2').innerHTML = titulo_2(solicitud);
            _('titulo_2').innerHTML = titlehead(solicitud);
            _('div_subtitulo_1').innerHTML = subtitulo_1(solicitud);

            _('hf_idsolicitudatx_index').value = solicitud.idsolicitud;
            _('hf_idanalisistextilsolicitud_index').value = solicitud.idanalisistextilsolicitud !== undefined ? solicitud.idanalisistextilsolicitud : '';
            _('hf_idatx_index').value = solicitud.idanalisistextil !== undefined ? solicitud.idanalisistextil : '';
            _('hf_idmotivosolicitud').value = solicitud.idmotivosolicitud !== undefined ? solicitud.idmotivosolicitud : '';
            _('hf_idservicio').value = solicitud.idservicio;
            _('hf_idusuario_solicitante').value = solicitud.idusuario_solicitante !== undefined ? solicitud.idusuario_solicitante : '';
            
            /*PARA SOLICITUD DE COLGADORES*/
            _('hf_idcolgadorsolicitud_index').value = solicitud.idcolgadorsolicitud;
            ovariables.estadorecibidocolgador = solicitud.estado_pendienteentregarcolgadores !== undefined ? solicitud.estado_pendienteentregarcolgadores : '';

            //// A PARTIR DE AQUI ES SOLO DEL ATX; PASAR A UNA FUNCION
            if (solicitud.idservicio === 9) {
                pintar_cuerpo_atx(solicitud, obj);
            } else if (solicitud.idservicio === 12) {
                pintar_cuerpo_colgador(solicitud, obj);
            } else if ('cotizacion') {

            }

            fn_botonera_detalle(obj.botonera);
            //:add vista
            let tab = document.getElementById('tab-1');
            if (!tab.classList.contains('active')) tab.classList.add('active')
        }

        function fn_download_archivo_proveedor(o) {
            let nombre_archivo_generado = o.getAttribute('data-nombregenerado'), nombre_archivo_original = o.getAttribute('data-nombreoriginal'), link = document.createElement('a');

            link.href = urlBase() + `DesarrolloTextil/Solicitud/DownloadFile_Proveedor?nombrearchivo_original=${nombre_archivo_original}&nombrearchivo_generado=${nombre_archivo_generado}`
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }

        var fn_botonera_detalle = (_odata) => {
            let obotonera = _odata !== '' ? CSVtoJSON(_odata) : null, html = '';
            if (obotonera !== null) {
                obotonera.forEach(x => {
                    let cadena_clase_boton = x.clase !== '' ? x.clase : 'btn-white';
                    html += `
                            <button class ="btn btn-sm cls_${x.boton.toLowerCase()} ${cadena_clase_boton}" data-toggle="tooltip" data-placement="left" data-par='${x.parametro}' title="${x.titulo}" onclick="appSolicitudAtx.fn_${x.boton.toLowerCase()}(event)"><span class ="${x.icono}"></span> </button>
                        `;
                });
            }
            _('divbotonera').innerHTML = html;

            let estado = getEstado(), idservicio = _('hf_idservicio').value, idusuario_solicitante = _('hf_idusuario_solicitante').value, idusuario_logeado = _('hf_idusuario').value;

            //// PARA EL MOCKUP DE COTIZACION
            //if (idservicio === '12') {
            //    html = `
            //        <button class ="btn btn-sm cls_btn_cotizar_colgador btn-info" data-toggle="tooltip" data-placement="left" data-par='' title="Cotizar" onclick="appSolicitudAtx.fn_NuevaSolicitudCotizar_colgador(event)"><span class ="fa fa-usd"></span> </button>
            //    `;
            //    _('divbotonera').insertAdjacentHTML('beforeend', html);
            //}

            if (idservicio === '12' && estado === 'finalizado') {
                let btnrecibir_colgador = _('divbotonera').getElementsByClassName('cls_confirmar_recibircolgaodor')[0];
                if (idusuario_solicitante !== idusuario_logeado) {
                    if (btnrecibir_colgador) {
                        btnrecibir_colgador.classList.add('hide');
                    }
                } else if (ovariables.estadorecibidocolgador === 'ENTREGADO' || ovariables.estadorecibidocolgador === 'RECIBIDO'){
                    if (btnrecibir_colgador) {
                        btnrecibir_colgador.classList.add('hide');
                    }
                }
            }
        }

        function fn_botonera_encabezado(objbotonera) {
            let divbotonera = _('divbotonera_encabezado').value, caden_perfiles = ovariables.lstperfil.length > 0 ? ovariables.lstperfil.join(';') : '',
                cls_ocultar_para_fabrica = caden_perfiles.indexOf('fabrica') >= 0 ? 'hide' : '';
            let abotones = (arrbotones) => {
                return (
                    arrbotones.map((x) => {
                        if (x.ubicacionenlvista === 'cabecera') {
                            let boton = '', ul_menu_boton = '';
                            if (x.titulo.toLowerCase() === 'nuevo' || x.titulo.toLowerCase() === 'new') {
                                boton = `<button class="dropdown-toggle btn btn-white cls_btn_new_solicitudatx" data-toggle="dropdown" aria-expanded="false" title="${x.titulo}" onclick="appSolicitudAtx.fn_nuevasolicitud_from_button(this);">
                                                <span class="${x.icono}" ></span > 
                                            </button >`;
                                // Jacob - Se agrego boton para Nueva Solicitud Cotizacion
                                ul_menu_boton = `
                                <ul id="submenuestado" class="dropdown-menu dropdown-user">
                                    <li class="_submenu ${cls_ocultar_para_fabrica}">
                                        <a href="javascript:void(0)" data-estado="pendiente_solicitar" class="_cls_item_submenu_estados" onclick="appSolicitudAtx.fn_nuevasolicitud(this);">
                                            <i class='fa fa-file-pdf-o fa-fw'></i>
                                            Solicitud Atx
                                        </a>
                                    </li>
                                    <li class='divider ${cls_ocultar_para_fabrica}'></li>
                                    <li class="_submenu ${cls_ocultar_para_fabrica}">
                                        <a href="javascript:void(0)" data-estado="solicitud_por_aprobar" class="_cls_item_submenu_estados" onclick="appSolicitudAtx.fn_nuevasolicitudcolgador(this);">
                                            <i class='fa fa-barcode fa-fw'></i>
                                            Solicitud Colgador
                                        </a>
                                    </li>
                                    <li class='divider ${cls_ocultar_para_fabrica}'></li>
                                    <li class="_submenu ${cls_ocultar_para_fabrica}">
                                        <a href="javascript:void(0)" data-estado="solicitud_por_aprobar" class="_cls_item_submenu_estados" onclick="appSolicitudAtx.fn_NuevaSolicitudCotizar();">
                                            <i class='fa fa-files-o fa-fw'></i>
                                            Solicitud Cotización
                                        </a>
                                    </li>
                                </ul>
                            `;
                            } else {
                                boton = `<button class="btn btn-white" data-toggle="tooltip" data-placement="left" title="${x.titulo}" onclick="appSolicitudAtx.fn_${x.boton.toLowerCase()}()">
                                                <span class="${x.icono}"></span> 
                                        </button>`;
                            }
                            let html = `
                            <div style='display: inline;'>
                                ${boton} ${ul_menu_boton}
                            </div>
                        `;
                            //return (`<button class="btn btn-white" data-toggle="tooltip" data-placement="left" title="${x.titulo}" onclick="appSolicitudAtx.fn_${x.boton.toLowerCase()}()"><span class="${x.icono}"></span> </button>`);
                            return (html);
                        }
                    })).join('')
            }
            let botones = abotones(objbotonera);
            _('divbotonera_encabezado').insertAdjacentHTML('beforeend', botones);
        }

        function fn_load_menu(adata, estado) {
            let items = '',
                //// ESTOS ESTADOS NO SE ESTA USANDO
                oestado = {
                    pending: 'label-warning',
                    rejected: 'label-danger',
                    approved: 'label-primary',
                    defecto: 'label-info',
                    PE: 'label-warning',
                    SE: 'label-warning',
                    RE: 'label-waring',
                    AP: 'label-waring',
                    IP: 'label-warning',
                    RJ: 'label-danger',
                    FI: 'label-primary'
                }, clase = oestado[estado] || oestado.defecto,
                estado_recibido_colgador = '';

            adata.forEach(x => {
                let html_spn_recibido_colgador = '';
                clase = x.estado_color;
                if (parseInt(x.idservicio) === 12) {
                    if (x.estado_recibidocolgadores === 'RECIBIDO' || x.estado_recibidocolgadores === 'ENTREGADO') {
                        html_spn_recibido_colgador = `<span class ='medium label pull-right label-success' style='font-size: 10px'>${x.estado_recibidocolgadores}</span>`;
                    }
                }
                // Jacob - Se agrego condicional para cotizacion
                _parseInt(x.idservicio) === 13
                    ? items += `<li class="list-group-item _item" data-id="${x.idsolicitud}" data-par="estadosolicitud:${x.estado},idservicio:${x.idservicio}">
                                    <a data-toggle="tab" href="#tab-1">
                                        <small class ="pull-right text-muted">${x.fecharegistra}</small>
                                        <strong>${x.idsolicitud}</strong>

                                        <div class ="small m-t-xs">
                                            <strong></strong>
                                            <p>
                                            <div><strong>Solicitante: </strong> ${x.usuariosolicita !== '' ? x.usuariosolicita : 'none'}</div>
                                            <div><strong>Analista: </strong> ${x.usuarioanalista !== '' ? x.usuarioanalista : 'none'}</div>
                                            <div><strong>Observaciones: </strong> ${x.estructura}</div>
                                            <div><strong>Total Cotizaciones: </strong> ${x.proveedor}</div>
                                            </p>
                                        </div>
                                        <div class="small m-t-xs">
                                            <p class ="m-b-none">
                                                <span class ='medium label pull-right ${clase}' style='font-size:10px'>${x.estado}</span>
                                                <i class ="fa fa-tag"></i>
                                                ${x.tiposolicitud}
                                            </p>
                                        </div>
                                    </a>
                                </li>`
                    : items += `<li class="list-group-item _item" data-id="${x.idsolicitud}" data-par="estadosolicitud:${x.estado},idservicio:${x.idservicio}">
                                    <a data-toggle="tab" href="#tab-1">
                                        <small class ="pull-right text-muted">${x.fecharegistra}</small>
                                        <strong>${x.idsolicitud}</strong>

                                        <div class ="small m-t-xs">
                                            <strong>${x.cliente}</strong>
                                            <p>
                                            <div><strong>Estructura: </strong> ${x.estructura !== '' ? x.estructura : 'none'}</div>
                                            <div><strong>Titulo: </strong> ${x.titulo !== '' ? x.titulo : 'none'}</div>
                                            <div><strong>Solicitante: </strong> ${x.usuariosolicita !== '' ? x.usuariosolicita : 'none'}</div>
                                            <div><strong>Analista: </strong> ${x.usuarioanalista !== '' ? x.usuarioanalista : 'none'}</div>
                                            </p>
                                        </div>
                                        <div class="small m-t-xs">
                                            <p class ="m-b-none">
                                                <span class ='medium label pull-right ${clase}' style='font-size:10px'>${x.estado}</span>
                                                ${html_spn_recibido_colgador}
                                                <i class ="fa fa-tag"></i>
                                                ${x.tiposolicitud}
                                            </p>
                                        </div>
                                    </a>
                                </li>`;
            });
            return items;
        }

        function fn_nuevasolicitud_from_button() {
            let cadenaperfil = ovariables.lstperfil.join(';');
            if (cadenaperfil.indexOf('fabrica') >= 0) {
                let urlAccion = 'DesarrolloTextil/Solicitud/New';
                _Go_Url(urlAccion, urlAccion, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial);
            }
        }

        function fn_nuevasolicitud(e) {
            let urlAccion = 'DesarrolloTextil/Solicitud/New';
            _Go_Url(urlAccion, urlAccion, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial);
        }

        function fn_nuevasolicitudcolgador(e) {
            let urlAccion = 'DesarrolloTextil/SolicitudColgador/NewSolicitudColgador';
            _Go_Url(urlAccion, urlAccion, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial);
        }

        function fn_aprobaratx(e) {
            let o = e.currentTarget, idsolicitud = _('hf_idsolicitudatx_index').value, estadoenviar = '', par = o.getAttribute('data-par'), estado = _par(par, 'estado'),
                idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index').value, idanalisistextil = _('hf_idatx_index').value, idmotivosolicitud = _('hf_idmotivosolicitud').value;
            if (estado === 'PR' || estado === 'PRR') { // PRR = POR REVISAR CON RECHAZO
                estadoenviar = appSolicitudAtx.ovariables.estados.FINALIZADO;
            } else if (estado === 'PAR') {
                estadoenviar = appSolicitudAtx.ovariables.estados.FINALIZADO;
            }

            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_AprobarRechazarEntregableAtx',
                ventana: '_AprobarRechazarEntregableAtx',
                titulo: 'Aprobar Entregable ATX',
                parametro: `idsolicitud:${idsolicitud},estadoenviar:${estadoenviar},estadobotonstr:aprobaratx,estadobotonbool:1,idanalisistextilsolicitud:${idanalisistextilsolicitud},idanalisistextil:${idanalisistextil},idmotivosolicitud:${idmotivosolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }
        function fn_aprobarsolicitud(e) {
            let o = e.currentTarget, idsolicitud = _('hf_idsolicitudatx_index').value, estadoenviar = '', par = o.getAttribute('data-par'), estado = _par(par, 'estado'),
                hf_idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index'),
                idanalisistextilsolicitud = (hf_idanalisistextilsolicitud.value !== '' && hf_idanalisistextilsolicitud.value !== "undefined") ? hf_idanalisistextilsolicitud.value : '',
                idservicio = _('hf_idservicio').value,
                hf_idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index'),
                idcolgadorsolicitud = (hf_idcolgadorsolicitud.value !== '' && hf_idcolgadorsolicitud.value !== "undefined") ? hf_idcolgadorsolicitud.value : '';
            if (estado === 'PAP') {
                estadoenviar = appSolicitudAtx.ovariables.estados.PORASIGNAR;
            } else if (estado === 'PAR') {
                estadoenviar = appSolicitudAtx.ovariables.estados.PORASIGNAR;
            }

            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_AprobarRechazarSolicitudAtx',
                ventana: '_AprobarRechazarSolicitudAtx',
                titulo: 'Aprobar solicitud',
                parametro: `idsolicitud:${idsolicitud},estadoenviar:${estadoenviar},estadobotonstr:aprobarsolicitud,estadobotonbool:1,idanalisistextilsolicitud:${idanalisistextilsolicitud},idservicio:${idservicio},idcolgadorsolicitud:${idcolgadorsolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        function fn_asignarsolicitud() {
            let idsolicitud = $('#hf_idsolicitudatx_index').val(), idanalisistextilsolicitud = $('#hf_idanalisistextilsolicitud_index').val(),
                estadonuevo = appSolicitudAtx.ovariables.estados.POROPERAR, idservicio = _('hf_idservicio').value;
            let url = 'DesarrolloTextil/Solicitud/_Asignar'
            _modalBody({
                url: url,
                ventana: '_Asignar',
                titulo: 'Asignar',
                parametro: `idsolicitud:${idsolicitud},idanalisistextilsolicitud:${idanalisistextilsolicitud},estadonuevo:${estadonuevo},idservicio:${idservicio}`,
                ancho: '',
                alto: '',
                responsive: 'modal-md'
            });
        }

        function fn_editaratx(e) {
            let idsolicitud = $('#hf_idsolicitudatx_index').val(), idanalisistextilsolicitud = $('#hf_idanalisistextilsolicitud_index').val();
            let o = e.currentTarget, par = o.getAttribute('data-par'), estadoactual = _par(par, 'estado'), accion = null, idatx = _('hf_idatx_index').value,
                idservicio = _('hf_idservicio').value;

            if (estadoactual === 'EN') {
                if (idatx === '0') {
                    accion = 'new'
                } else {
                    accion = 'edit'
                }
                //let url = 'DesarrolloTextil/Atx/AtxView', parametro = `accion:${accion},idsolicitud:${idsolicitud},idanalisistextilsolicitud:${idanalisistextilsolicitud},idanalisistextil:${idatx},estadoactual:${estadoactual}`;
                //_Go_Url(url, url, parametro);
                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, '', '', '', '', idservicio, '');
            } else if (estadoactual === 'POR'){
                accion = 'edit';
                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, '', '', '', '', idservicio, '');
            }
        }

        // Jacob
        function fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, finalizaratx, txtpar_solicitudatx_index_fromeditatx, escolgador, idcolgadorsolicituddetalle_codigogenerado, idservicio, idsolicitud_cotizacion) {
            let url = 'DesarrolloTextil/Atx/AtxView',
                txtpar_solicitudatx_index = (txtpar_solicitudatx_index_fromeditatx === undefined || txtpar_solicitudatx_index_fromeditatx === '') ? _('txtpar_solicitudatx_index').value.replace(/,/g, '~').replace(/:/g, '▼') : txtpar_solicitudatx_index_fromeditatx,
                parametro = `accion:${accion},idsolicitud:${idsolicitud},idanalisistextilsolicitud:${idanalisistextilsolicitud},idanalisistextil:${idatx},estadoactual:${estadoactual},finalizaratx:${finalizaratx},txtpar_solicitudatx_index:${txtpar_solicitudatx_index},escolgador:${escolgador},idcolgadorsolicituddetalle_codigogenerado:${idcolgadorsolicituddetalle_codigogenerado},idservicio:${idservicio},idsolicitud_cotizacion:${idsolicitud_cotizacion}`;
            _Go_Url(url, url, parametro);
        }

        function fn_open_view_editaratx_colgador(param, txtpar_solicitudatx_index_fromeditatx) {
            let url = 'DesarrolloTextil/Atx/AtxView', accion = _par(param, 'accion'), idsolicitud = _par(param, 'idsolicitud'),
                idanalisistextilsolicitud = _par(param, 'idanalisistextilsolicitud'), idatx = _par(param, 'idatx'), estadoactual = _par(param, 'estadoactual'), finalizaratx = '',
                escolgador = _par(param, 'escolgador'),
                txtpar_solicitudatx_index = (txtpar_solicitudatx_index_fromeditatx === undefined || txtpar_solicitudatx_index_fromeditatx === '') ? _('txtpar_solicitudatx_index').value.replace(/,/g, '~').replace(/:/g, '▼') : txtpar_solicitudatx_index_fromeditatx,
                idcolgadorsolicituddetalle_codigogenerado = _par(param, 'idcolgadorsolicituddetalle_codigogenerado'),
                idservicio = _par(param, 'idservicio'),
                parametro = `accion:${accion},idsolicitud:${idsolicitud},idanalisistextilsolicitud:${idanalisistextilsolicitud},idanalisistextil:${idatx},estadoactual:${estadoactual},finalizaratx:${finalizaratx},txtpar_solicitudatx_index:${txtpar_solicitudatx_index},escolgador:${escolgador},idcolgadorsolicituddetalle_codigogenerado:${idcolgadorsolicituddetalle_codigogenerado},idservicio:${idservicio}`;
            _Go_Url(url, url, parametro);
        }

        function fn_editarsolicitud(e) {
            let urlaccion = '', idsolicitud = _('hf_idsolicitudatx_index').value, idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index').value,
                idservicio = _('hf_idservicio').value;
            //let urlaccion = 'DesarrolloTextil/Solicitud/New', idsolicitud = 5422, idanalisistextilsolicitud = 1944;
            if (idservicio === '9') {
                urlaccion = 'DesarrolloTextil/Solicitud/New';
                _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables.idgrupocomercial + ',idsolicitud:' + idsolicitud + ',idanalisistextilsolicitud:' + idanalisistextilsolicitud);
            } else if (idservicio === '12') {
                let idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index').value;
                urlaccion = 'DesarrolloTextil/SolicitudColgador/NewSolicitudColgador';
                _Go_Url(urlaccion, urlaccion, 'accion:edit,idgrupocomercial:' + ovariables.idgrupocomercial + ',idsolicitud:' + idsolicitud + ',idcolgadorsolicitud:' + idcolgadorsolicitud);
            }

        }

        function fn_iniciaratx(e) {  // ESTO ES EJECUTAR ATX
            let o = e.currentTarget, par = o.getAttribute('data-par'), estadoactual = _par(par, 'estado'), idsolicitud = _('hf_idsolicitudatx_index').value,
                estadonuevo = appSolicitudAtx.ovariables.estados.ENPROCESO, frm = new FormData(), parametro = '', idservicio = _('hf_idservicio').value;

            parametro = { idsolicitud: idsolicitud, estadonuevo: estadonuevo, estadoactual: estadoactual, idservicio: idservicio };
            frm.append('par', JSON.stringify(parametro));

            _Post('DesarrolloTextil/Solicitud/IniciarAtx', frm)
                .then((respuesta) => {
                    let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;

                    if (rpta !== null) {
                        swal({
                            title: 'Message',
                            text: rpta.mensaje,
                            type: rpta.estado
                        }, function (result) {
                            if (result) {
                                if (rpta.id > 0) {  // CANTIDAD DE REGISTROS
                                    return_bandeja(estadonuevo, idsolicitud);
                                    //ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', idsolicitud, 'divcontenedor_breadcrum');
                                }
                            }
                        });
                    }
                }, (p) => { err_xhr(p) });
        }

        function fn_eliminarsolicitud(e) {
            let idsolicitud = _('hf_idsolicitudatx_index').value, parametro = { idsolicitud: idsolicitud },
                url = 'DesarrolloTextil/Solicitud/EliminarSolicitudAtx', frm = new FormData();

            frm.append('par', JSON.stringify(parametro));

            swal({
                title: "Desea eliminar la solicitud?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function (result) {
                if (result) {
                    _Post(url, frm)
                        .then((rpta) => {
                            let orpta = JSON.parse(rpta);
                            _swal({ mensaje: orpta.mensaje, estado: orpta.estado });
                            ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', idsolicitud, 'divcontenedor_breadcrum');
                            return true;
                        })
                        .catch((e) => {
                            err_xhr(e);
                        });
                }
            });

        }

        function fn_enviarsolicitud(e) {  // ESTO ES EL INICIAR SOLICITUD
            let o = e.currentTarget, par = o.getAttribute('data-par'), estadoactual = _par(par, 'estado'), idsolicitud = _('hf_idsolicitudatx_index').value,
                estadonuevo = '', url = 'DesarrolloTextil/Solicitud/IniciarSolicitudAtx', frm = new FormData(), idservicio = _('hf_idservicio').value;

            if (estadoactual === 'C') {
                estadonuevo = appSolicitudAtx.ovariables.estados.PORAPROBAR
            } else if (estadoactual === 'CR') {
                estadonuevo = appSolicitudAtx.ovariables.estados.PORAPROBARCONRECHAZO
            }

            parametro = { idsolicitud: idsolicitud, estadonuevo: estadonuevo, estadoactual: estadoactual, idgrupopersonal: ovariables.idgrupocomercial, idservicio: idservicio };
            //// PARAMETROS ADICIONALES PARA LA NOTIFICACION
            parametro["url_modulo"] = 'DesarrolloTextil/Solicitud/Index';
            parametro["url_foto_perfil_usuario_origen"] = window.utilindex.ruta_imagen_foto_perfil;

            frm.append('par', JSON.stringify(parametro));

            let err = function (__err) { console.log('err', __err) };

            _Post(url, frm)
                .then((respuesta) => {
                    let rpta = JSON.parse(respuesta);
                    swal({
                        title: 'Message',
                        text: rpta.mensaje,
                        type: rpta.estado
                    }, function (result) {
                        if (result) {
                            if (rpta.id > 0) {  // CANTIDAD DE REGISTROS
                                //ruteo_bandejamodelo_correo('DesarrolloTextil/Solicitud/Index', idsolicitud, 'divcontenedor_breadcrum');
                                return_bandeja(estadonuevo, idsolicitud);
                                //// AQUI MANDAR LAS NOTIFICACIONES POR GRUPO
                                let odata = rpta.data !== '' ? JSON.parse(rpta.data) : null;
                                if (odata !== null) {
                                    let data_detalle = odata[0].data_detalle !== '' ? JSON.parse(odata[0].data_detalle) : null;
                                    let mensaje_notificacion = '';
                                    let url_modulo = '';
                                    let url_foto_perfil_usuario_origen = '';
                                    if (data_detalle) {
                                        mensaje_notificacion = data_detalle[0].mensajenotificacion;
                                        url_modulo = data_detalle[0].url_modulo;
                                        url_foto_perfil_usuario_origen = data_detalle[0].url_foto_perfil_usuario_origen;
                                    }
                                    
                                    let obj_mensaje = {
                                        plataforma: 'todas',
                                        tipomensaje: 'notificar',
                                        usuario_destino: '',
                                        mensaje_para_app: '',
                                        usuario_origen: window.utilindex.usuario,
                                        titulo_mensaje: '',
                                        mensaje_para_erp: mensaje_notificacion,
                                        arr_obj: odata,
                                        url_modulo: url_modulo, //'DesarrolloTextil/Solicitud/Index'
                                        url_foto_perfil_usuario_origen: url_foto_perfil_usuario_origen
                                    };

                                    notificacion_erp_por_grupo(window.utilindex.usuario, JSON.stringify(obj_mensaje));
                                }
                            }
                        }
                    });
                }, (p) => { err(p) });
        }

        function fn_rechazarsolicitud(e) {
            let o = e.currentTarget, idsolicitud = _('hf_idsolicitudatx_index').value, estadoenviar = '', par = o.getAttribute('data-par'), estado = _par(par, 'estado'),
                hf_idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index'),
                idanalisistextilsolicitud = (hf_idanalisistextilsolicitud.value !== '' && hf_idanalisistextilsolicitud.value !== "undefined") ? hf_idanalisistextilsolicitud.value : '',
                idservicio = _('hf_idservicio').value,
                hf_idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index'),
                idcolgadorsolicitud = (hf_idcolgadorsolicitud.value !== '' && hf_idcolgadorsolicitud.value !== "undefined") ? hf_idcolgadorsolicitud.value : '';
            if (estado === 'PAP') {
                estadoenviar = appSolicitudAtx.ovariables.estados.RECHAZADO;
            } else if (estado === 'PAR') {
                estadoenviar = appSolicitudAtx.ovariables.estados.RECHAZADO;
            }

            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_AprobarRechazarSolicitudAtx',
                ventana: '_AprobarRechazarSolicitudAtx',
                titulo: 'Rechazar solicitud',
                parametro: `idsolicitud:${idsolicitud},estadoenviar:${estadoenviar},estadobotonstr:rechazarsolicitud,estadobotonbool:0,idanalisistextilsolicitud:${idanalisistextilsolicitud},idservicio:${idservicio},idcolgadorsolicitud:${idcolgadorsolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        function fn_rechazartx(e) {
            let o = e.currentTarget, idsolicitud = _('hf_idsolicitudatx_index').value, estadoenviar = '', par = o.getAttribute('data-par'), estado = _par(par, 'estado'),
                idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index').value;
            if (estado === 'PR' || estado === 'PRR') {
                estadoenviar = appSolicitudAtx.ovariables.estados.POROPERARCONRECHAZO;
            } else if (estado === 'PAR') {
                estadoenviar = appSolicitudAtx.ovariables.estados.POROPERARCONRECHAZO;
            }

            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_AprobarRechazarEntregableAtx',
                ventana: '_AprobarRechazarEntregableAtx',
                titulo: 'Rechazar Entregable',
                parametro: `idsolicitud:${idsolicitud},estadoenviar:${estadoenviar},estadobotonstr:rechazaratx,estadobotonbool:0,idanalisistextilsolicitud:${idanalisistextilsolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        //// ASYNC - AWAIT; ES PARA APLICAR FUNCIONES SINCRONAS    
        var fn_finalizaratx = async (e) => {
            //// VALIDAR PRIMERO LOS DATOS OBLIGATORIOS
            let o = e.currentTarget,
                idservicio = _('hf_idservicio').value;
                //idatx = _('hf_idatx_index').value,
                //idsolicitud = _('hf_idsolicitudatx_index').value, 
                //parametro = { idanalisistextil: idatx },
                //url = 'DesarrolloTextil/Atx/get_validacion_finalizaratx?par=' + JSON.stringify(parametro),
                //par = o.getAttribute('data-par'), estadoactual = _par(par, 'estado'),
                
            if (idservicio === '9') {
                finalizar_solicitud_atx(o);
            } else if (idservicio === '12') {
                finalizar_solicitud_colgador(o);
            }
        };

        function finalizar_solicitud_colgador(o) {
            let url = 'DesarrolloTextil/Solicitud/FinalizarSolicitudColgador', frm = new FormData(),
                idsolicitud = _('hf_idsolicitudatx_index').value, idservicio = _('hf_idservicio').value,
                parametro = { idsolicitud: idsolicitud, idservicio: idservicio };

            let pasavalidacion = validar_antes_finalizar_solicitudcolgador();
            if (pasavalidacion === false) {
                return false;
            }

            frm.append("parhead", JSON.stringify(parametro));

            swal({
                title: "Está seguro de finalizar la solicitud?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function (result) {
                if (result) {
                    _Post(url, frm)
                        .then((data) => {
                            let odata = data !== '' ? JSON.parse(data) : null;

                            if (odata) {
                                swal({
                                    title: '',
                                    text: odata.mensaje,  // orpta.mensaje,
                                    type: odata.estado
                                });

                                if (odata.id > 0) {
                                    let url_index = 'DesarrolloTextil/Solicitud/Index'
                                    ruteo_bandejamodelo_correo(url_index, idsolicitud, 'divcontenedor_breadcrum');
                                }
                            }
                        });
                }
            });
        }

        function validar_antes_finalizar_solicitudcolgador() {
            let tbl_armado = _('tabla_composicion_detalle_armado'),
                tbody_armado = tbl_armado !== null ? tbl_armado.getElementsByClassName('cls_tbody_detalle_armado')[0] : null,
                arr_filas_armado = tbody_armado !== null ? Array.from(tbody_armado.rows) : [], pasavalidacion = true,
                tbl_telas_encontradas = _('tabla_composicion_detalle_encontrado_x_operador'),
                tbody_telas_encontradas = tbl_telas_encontradas !== null ? tbl_telas_encontradas.getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0] : null,
                arr_filas_encontradas = (tbody_telas_encontradas !== undefined && tbody_telas_encontradas !== null) ? Array.from(tbody_telas_encontradas.rows) : [];

            arr_filas_armado.forEach(x => {
                let sp_error_cantidad_entregar = x.getElementsByClassName('spn_error_cantidad_a_entregar')[0],
                    sp_error_cantidad_generada = x.getElementsByClassName('spn_error_cantidadcolgadoresgenerados')[0],
                    sp_error_codigogenerado = x.getElementsByClassName('spn_error_codigogenerado')[0],
                    sp_error_cantidad_recibida_por_eloperador = x.getElementsByClassName('spn_error_cantidad_recibida')[0];

                if (sp_error_cantidad_recibida_por_eloperador !== undefined) {
                    sp_error_cantidad_recibida_por_eloperador.classList.add('hide');
                }

                if (sp_error_codigogenerado !== undefined) {
                    sp_error_codigogenerado.classList.add('hide');
                }

                if (sp_error_cantidad_generada !== undefined) {
                    sp_error_cantidad_generada.classList.add('hide');
                }

                if (sp_error_cantidad_entregar !== undefined) {
                    sp_error_cantidad_entregar.classList.add('hide');
                }

            });

            arr_filas_encontradas.forEach(x => {
                let spn_error_cantidad_encontradas = x.getElementsByClassName('spn_error_cantidadcolgadores_encontrados')[0];
                spn_error_cantidad_encontradas.classList.add('hide');
            });

            arr_filas_armado.forEach(x => {
                let txt_cantidad_generados = x.getElementsByClassName('cls_txt_cantidad_colgadores_generados')[0],
                    txt_cantidad_a_entregar = x.getElementsByClassName('cls_txt_cantidad_entregar_comercial')[0],
                    spn_error_cantidad_generados = x.getElementsByClassName('spn_error_cantidadcolgadoresgenerados')[0],
                    sp_error_cantidad_entregar = x.getElementsByClassName('spn_error_cantidad_a_entregar')[0],
                    sp_error_codigogenerado = x.getElementsByClassName('spn_error_codigogenerado')[0],
                    pasavalidacion_cantidad_colgadores_generados = true, pasavalidacion_cantidad_colgadores_entregarcomercial = true,
                    q_ini_generados = '', q_ini_entregarcomercial = '',
                    sp_error_cantidad_recibida_por_eloperador = x.getElementsByClassName('spn_error_cantidad_recibida')[0],
                    txt_cantidad_recibidad_por_eloperador = x.getElementsByClassName('cls_cantidad_recibida')[0];

                if (txt_cantidad_recibidad_por_eloperador !== undefined) {
                    if (txt_cantidad_recibidad_por_eloperador.value.trim() === '' || txt_cantidad_recibidad_por_eloperador.value === '0') {
                        sp_error_cantidad_recibida_por_eloperador.classList.remove('hide');
                        pasavalidacion = false;
                    }
                }

                if (txt_cantidad_generados !== undefined) {
                    let datapar_fila = x.getAttribute('data-par'), codigogenerado = _par(datapar_fila, 'codigotela_generado');

                    q_ini_generados = _par(datapar_fila, 'cantidadcolgadoresfisicosgenerados');
                    q_ini_entregarcomercial = _par(datapar_fila, 'cantidadcolgadoresentregarcomercial');

                    if (codigogenerado === '') {
                        sp_error_codigogenerado.classList.remove('hide');
                        pasavalidacion = false;
                    }

                    if (txt_cantidad_generados.value.trim() === '' || txt_cantidad_generados.value === '0') {
                        spn_error_cantidad_generados.classList.remove('hide');
                        pasavalidacion = false;
                        pasavalidacion_cantidad_colgadores_generados = false;
                    }

                    if (pasavalidacion_cantidad_colgadores_generados) {
                        if (q_ini_generados !== txt_cantidad_generados.value.trim()) {
                            spn_error_cantidad_generados.classList.remove('hide');
                            spn_error_cantidad_generados.innerText = 'Los valores cambiaron, grabe porfavor';
                            pasavalidacion = false;
                        }
                    }
                }

                if (txt_cantidad_a_entregar !== undefined) {
                    if (txt_cantidad_a_entregar.value.trim() === '' || txt_cantidad_a_entregar.value === '0') {
                        sp_error_cantidad_entregar.classList.remove('hide');
                        pasavalidacion = false;
                        pasavalidacion_cantidad_colgadores_entregarcomercial = false;
                    }

                    if (pasavalidacion_cantidad_colgadores_entregarcomercial) {
                        if (q_ini_entregarcomercial !== txt_cantidad_a_entregar.value.trim()) {
                            sp_error_cantidad_entregar.classList.remove('hide');
                            sp_error_cantidad_entregar.innerText = 'Los valores cambiaron, grabe porfavor';
                            pasavalidacion = false;
                        }
                    }
                }
            });

            arr_filas_encontradas.forEach(x => {
                let txt_cantidad = x.getElementsByClassName('cls_txt_cantidadcolgadores')[0],
                    spn_error_cantidad_encontradas = x.getElementsByClassName('spn_error_cantidadcolgadores_encontrados')[0];

                if (txt_cantidad.value.trim() === '' || txt_cantidad.value === '0') {
                    spn_error_cantidad_encontradas.classList.remove('hide');
                    pasavalidacion = false;
                }
            });

            return pasavalidacion;
        }

        var finalizar_solicitud_atx = async(o) => {
            let idatx = _('hf_idatx_index').value, parametro = { idanalisistextil: idatx }, idsolicitud = _('hf_idsolicitudatx_index').value, 
                url = 'DesarrolloTextil/Atx/get_validacion_finalizaratx?par=' + JSON.stringify(parametro),
                par = o.getAttribute('data-par'), estadoactual = _par(par, 'estado'), idservicio = _('hf_idservicio').value;

            if (idatx === '0' || idatx === '') {
                _swal({ mensaje: 'La solicitud no tiene atx.', estado: 'error' });
                return false;
            }

            let mensaje_get = await _Get(url);
            if (mensaje_get !== '') {
                let data_validacion = JSON.parse(mensaje_get), mensaje_validacion = data_validacion[0].mensaje, es_con_pregunta = data_validacion[0].mensaje_con_pregunta_sino;
                if (mensaje_validacion !== '') {
                    if (es_con_pregunta === 'no') {
                        swal({
                            title: 'Message',
                            text: mensaje_validacion,
                            type: 'error'
                        }, function (result) {
                            if (result) {
                                let accion = 'edit', idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index').value;
                                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, 'si', '', '', '', idservicio, '');
                                /// ventana atx para validar
                            }
                        });
                    } else {
                        swal({
                            title: "Deseas grabar de todas maneras?",
                            text: mensaje_validacion,
                            type: "error",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "Si",
                            cancelButtonText: "No",
                            closeOnConfirm: true
                        }, function (rpta_confirmacion) {
                            if (rpta_confirmacion) {
                                fn_sub_metodo_finalizaratx();
                            } else {
                                let accion = 'edit', idanalisistextilsolicitud = _('hf_idanalisistextilsolicitud_index').value;
                                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, 'si', '', '', '', idservicio, '');
                            }
                            return;
                        });
                    }
                } else {
                    // FINALIZAR
                    fn_sub_metodo_finalizaratx();
                }
            } else {
                // FINALIZAR
                //// TODO ESTO LO PASE A UNA FUNCIO fn_sub_metodo_finalizaratx
                fn_sub_metodo_finalizaratx();
            }
        }

        var fn_sub_metodo_finalizaratx = async () => {
            // FINALIZAR

            //// VALIDAR SI ES NECESARIO COMPARAR EL ATX
            let idmotivosolicitud = _('hf_idmotivosolicitud').value, idsolicitud = _('hf_idsolicitudatx_index').value;
            //// FINALIZAR SIN GENERAR CODIGO DE TELA; PARA GENERAR EL CODIGO DE TELA, SE HARIA EN ERL ERP1
            //// SE AGREGO ESTA LINEA DE CODIGO PARA PODER IMPLEMENTAR EL MODULO DE REQUERIMIENTO SIN SDT
            ////let grabar = await _promise(50)
            ////    .then(() => {
            ////        // accion_new_edit_reenvio: para la replica de atx a fichatecnica; para saber cuando inserto, edito, reenvio o simplemente es la primera vez que se esta finalizando el atx
            ////        let frm = new formdata(), parametro = { idsolicitud: idsolicitud, reenviaratx: 'no' }, url = 'desarrollotextil/atx/operador_finaliza_atx';
            ////        frm.append('par', json.stringify(parametro));

            ////        let rpta = _post(url, frm);
            ////        return rpta
            ////    })
            ////    .then((rpta) => {
            ////        let orpta = json.parse(rpta), mensaje_finalizar = orpta.mensaje;

            ////        swal({
            ////            title: 'mensaje',
            ////            text: mensaje_finalizar,  // orpta.mensaje,
            ////            type: orpta.estado
            ////        }, function (result) {
            ////            if (result) {
            ////                let url_index = 'desarrollotextil/solicitud/index'
            ////                ruteo_bandejamodelo_correo(url_index, idsolicitud, 'divcontenedor_breadcrum');
            ////            }
            ////        });
            ////    })
            ////    .catch((e) => {
            ////        err_xhr(e);
            ////    })



            //// PARA LA VERSION SIN SDT; NO ES NECESARIO CREAR LA TELA POR EL MOMENTO YA QUE AUN NO SE HA IMPLEMENTADO LA NUEVA VERSION DE CODIGO DE TELA DE 13 O 10 DIGITOS
            //// SE COMENTA ESTE BLOQUE DE CODIGO PARA IMPLEMENTAR EL MODULO DE REQUERIMIENTO SIN SDT
            //// LA GENERACION DE CODIGO DE TELA SE HACE EN EL ERP1
            //// INI - PARA CODIGO DE TELA DE 13 O 10 DIGITOS
            //// COMPARA EL ATX
            let codigotela_generado = await _promise(50)
                .then(() => {
                    //// SIN SDT
                    return fn_save_codigotela_11digitos_sin_sdt();

                    //// SE COMENTO PORQUE AUN NO SE IMPLEMENTA LA NUEVA VERSION DEL CODIGODETELA 13 O 10 DIGITOS
                    ////return fn_save_codigotela_comparativo();
                });
            if (codigotela_generado !== '') {
                let grabar = await _promise(50)
                    .then(() => {
                        //// accion_new_edit_reenvio: PARA LA REPLICA DE ATX A FICHATECNICA; PARA SABER CUANDO INSERTO, EDITO, REENVIO O SIMPLEMENTE ES LA PRIMERA VEZ QUE SE ESTA FINALIZANDO EL ATX
                        let frm = new FormData(), parametro = { idsolicitud: idsolicitud, reenviaratx: 'no' }, url = 'DesarrolloTextil/Atx/operador_finaliza_atx';
                        frm.append('par', JSON.stringify(parametro));

                        let rpta = _Post(url, frm);
                        return rpta
                    })
                    .then((rpta) => {
                        let orpta = JSON.parse(rpta), mensaje_finalizar = orpta.mensaje;

                        if (idmotivosolicitud === '2' || idmotivosolicitud === '1' || idmotivosolicitud === '3') { // 1 = atx estandar; 2 = atx comparativo; 3 = ficha de inspiracion; /* Jacob */
                            if (codigotela_generado !== '') {
                                mensaje_finalizar += '\n Codigo Tela Generado: ' + codigotela_generado;
                            }
                        }
                        swal({
                            title: 'Mensaje',
                            text: mensaje_finalizar,  // orpta.mensaje,
                            type: orpta.estado
                        }, function (result) {
                            if (result) {
                                let url_index = 'DesarrolloTextil/Solicitud/Index'
                                ruteo_bandejamodelo_correo(url_index, idsolicitud, 'divcontenedor_breadcrum');
                            }
                        });
                    })
                    .catch((e) => {
                        err_xhr(e);
                    })
            } else {
                swal({
                    title: 'Mensaje',
                    text: 'No se pudo generar el codigo de tela',  // orpta.mensaje,
                    type: 'error'
                }, function (result) {
                    if (result) {

                    }
                });
            }
            //// FIN - PARA CODIGO DE TELA DE 13 O 10 DIGITOS
        }

        //// ESTA FUNCION ESTA REEMPLAZANDO A ESTA FUNCION : fn_save_codigotela_comparativo POR SIN SDT; YA QUE QUEDA PENDIENTE LA NUEVA VERSION DE CODIGO DE TELA DE 13 O 10 DIGITOS
        var fn_save_codigotela_11digitos_sin_sdt = async () => {
            let idatx = _('hf_idatx_index').value;
            let idsolicitud = _('hf_idsolicitudatx_index').value;
            let parametro = { idatx: idatx, idsolicitud: idsolicitud };
            let url_estados_solicitud_validacion = 'DesarrolloTextil/Solicitud/GetEstadosValidarAntesGenerarCodigoTela';
            let parametro_validacion_estados_solicitud = { idsolicitud: idsolicitud, idatx: idatx }
            url_estados_solicitud_validacion = url_estados_solicitud_validacion + '?par=' + JSON.stringify(parametro_validacion_estados_solicitud);
            let codigotela_existente = '';
            let existe_estado_finalizado = false

            let data_estados_solicitud = await _Get(url_estados_solicitud_validacion);
            if (data_estados_solicitud !== '') {
                let odata_estados = JSON.parse(data_estados_solicitud);
                let estados = odata_estados[0].estados;

                codigotela_existente = odata_estados[0].codigotela;

                if (estados.indexOf('F') !== -1) {
                    existe_estado_finalizado = true;
                }
            }
                        
            if (existe_estado_finalizado === false) {  //// AUN NO EXISTE FINALIZADO DEL ATX
                let formdata = new FormData();
                formdata.append('par', JSON.stringify(parametro));
                result_save = await _promise(30)
                    .then(() => {
                        let result = _Post('DesarrolloTextil/Atx/Save_CodigoTela_From_FinalizarAtx', formdata);
                        return result;
                    });
                return result_save;
            } else {
                return codigotela_existente;
            }
            
        }

        var fn_save_codigotela_comparativo = async () => {
            let idsolicitud = _('hf_idsolicitudatx_index').value, url = 'DesarrolloTextil/Atx/GetData_AtxEstandar_y_Atx_b_comparar?par=' + idsolicitud,
                idatx = _('hf_idatx_index').value, idmotivosolicitud = _('hf_idmotivosolicitud').value, result_save = '', cambio_correlativo_save = 0,
                cambio_version_save = 0, url_estados_solicitud_validacion = 'DesarrolloTextil/Solicitud/GetEstadosValidarAntesGenerarCodigoTela',
                parametro_validacion_estados_solicitud = { idsolicitud: idsolicitud, idatx: idatx }, existe_estado_finalizado = false, codigotela_existente = '';

            url_estados_solicitud_validacion = url_estados_solicitud_validacion + '?par=' + JSON.stringify(parametro_validacion_estados_solicitud);

            let data_estados_solicitud = await _Get(url_estados_solicitud_validacion);

            if (data_estados_solicitud !== '') {
                let odata_estados = JSON.parse(data_estados_solicitud),
                    estados = odata_estados[0].estados;

                codigotela_existente = odata_estados[0].codigotela;

                if (estados.indexOf('F') !== -1) {
                    existe_estado_finalizado = true;
                }
            }

            if (existe_estado_finalizado === false) {  //// AUN NO EXISTE FINALIZADO DEL ATX
                if (idmotivosolicitud === '2') {
                    let atx = await _promise(40)
                        .then(() => {
                            let data = _Get(url);
                            return data;
                        });


                    if (atx !== '') {
                        let rpta = JSON.parse(atx);
                        //// PARA LA GENERACION DE CODIGO DE TELA
                        let analisistextil = CSVtoJSON(rpta[0].atx), hilados = rpta[0].tblhilados !== '' ? CSVtoJSON(rpta[0].tblhilados) : null,
                            hiladocontenido = rpta[0].tbl_hilado_contenido !== '' ? CSVtoJSON(rpta[0].tbl_hilado_contenido) : null,
                            tblpasadas = rpta[0].tblpasadas !== '' ? CSVtoJSON(rpta[0].tblpasadas) : null,
                            tblimg_ligamentos = rpta[0].tblimg_ligamentos !== '' ? CSVtoJSON(rpta[0].tblimg_ligamentos) : null,
                            tblrepeticiones = rpta[0].tblrepeticiones !== '' ? CSVtoJSON(rpta[0].tblrepeticiones) : null,
                            tblhiladoporpasada = rpta[0].tblhiladoporpasada !== '' ? CSVtoJSON(rpta[0].tblhiladoporpasada) : null,
                            atx_acabadofisico = rpta[0].analisistextil_acabadofisico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadofisico) : null,
                            atx_acabadoquimico = rpta[0].analisistextil_acabadoquimico !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadoquimico) : null;

                        let analisistextil_b = CSVtoJSON(rpta[0].atx_b), hilados_b = rpta[0].tblhilados_b !== '' ? CSVtoJSON(rpta[0].tblhilados_b) : null,
                            hiladocontenido_b = rpta[0].tbl_hilado_contenido_b !== '' ? CSVtoJSON(rpta[0].tbl_hilado_contenido_b) : null,
                            tblpasadas_b = rpta[0].tblpasadas_b !== '' ? CSVtoJSON(rpta[0].tblpasadas_b) : null,
                            tblimg_ligamentos_b = rpta[0].tblimg_ligamentos_b !== '' ? CSVtoJSON(rpta[0].tblimg_ligamentos_b) : null,
                            tblrepeticiones_b = rpta[0].tblrepeticiones_b !== '' ? CSVtoJSON(rpta[0].tblrepeticiones_b) : null,
                            tblhiladoporpasada_b = rpta[0].tblhiladoporpasada_b !== '' ? CSVtoJSON(rpta[0].tblhiladoporpasada_b) : null,
                            atx_acabadofisico_b = rpta[0].analisistextil_acabadofisico_b !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadofisico_b) : null,
                            atx_acabadoquimico_b = rpta[0].analisistextil_acabadoquimico_b !== '' ? CSVtoJSON(rpta[0].analisistextil_acabadoquimico_b) : null;

                        crear_objeto_cambiaversion_correlativo_ini(analisistextil, hilados, hiladocontenido, tblpasadas, tblimg_ligamentos, tblrepeticiones, tblhiladoporpasada, atx_acabadofisico, atx_acabadoquimico, 'estandar');
                        crear_objeto_cambiaversion_correlativo_ini(analisistextil_b, hilados_b, hiladocontenido_b, tblpasadas_b, tblimg_ligamentos_b, tblrepeticiones_b, tblhiladoporpasada_b, atx_acabadofisico_b, atx_acabadoquimico_b, 'atx_b');

                        let result_cambia_version_correlativo = validar_siescambio_version_correlativo();
                        if (result_cambia_version_correlativo.cambia_correlativo === 1 || result_cambia_version_correlativo.cambia_version === 1) {
                            // ENTONCES LLAMAR A LA FUNCION SAVE_NEW
                            cambio_correlativo_save = result_cambia_version_correlativo.cambia_correlativo;
                            cambio_version_save = result_cambia_version_correlativo.cambia_version;
                        }

                        let parametro = { cambio_correlativo: cambio_correlativo_save, cambio_version: cambio_version_save, idatx: idatx, idsolicitud: idsolicitud };
                        let formdata = new FormData();
                        formdata.append('par', JSON.stringify(parametro));
                        result_save = await _promise(30)
                            .then(() => {
                                let result = _Post('DesarrolloTextil/Atx/Save_CodigoTela_From_FinalizarAtx', formdata);
                                return result;
                            });
                        //if (result_save === ''){
                        //    result_save = 'vacio';
                        //}
                        return result_save;
                    }
                } else if (idmotivosolicitud === '1') {  //// ES ATX ESTANDAR
                    let parametro = { cambio_correlativo: 1, cambio_version: 0, idatx: idatx, idsolicitud: idsolicitud };
                    let formdata = new FormData();

                    if (ovariables.origenmuestra === 3) {  //// SOLICITUD DE ORIGEN TIPO COLGADOR WTS
                        if (ovariables.codigotela_colgadorwts !== '') {  //// ESTE DATO LO SACO DE ATX; SI ESTA VACIO ES POR QUE NO EXISTE EL CODIGO DE TELA QUE PUSO COMERCIAL PARA UN COLGADOR WTS(ORIGEN DE LA MUESTRA)
                            //// ENTONCES SI NO EXISTE CODIGO DE TELA COLGADOR WTS; ENTONCES GENERAR EL CODIGO DE TELA NUEVO; EL CODIGO DEBERIA TENER LOS 13 DIGITOS
                            if (ovariables.origenmuestra_colgador_generarcodigotela === 'CAMBIAR_ESTADO') {
                                parametro.cambio_estado_y_datos_adicionales = 'CAMBIAR_ESTADO|' + ovariables.codigotela_colgadorwts;
                                parametro.cambio_correlativo = 0;
                            }
                        }
                    }

                    formdata.append('par', JSON.stringify(parametro));
                    result_save = await _promise(30)
                        .then(() => {
                            let result = _Post('DesarrolloTextil/Atx/Save_CodigoTela_From_FinalizarAtx', formdata);
                            return result;
                        });
                    //if (result_save === ''){
                    //    result_save = 'vacio';
                    //}
                    return result_save;
                } else if (idmotivosolicitud === '3') { // FICHA DE INSPIRACION /* Jacob */
                    let parametro = { cambio_correlativo: 1, cambio_version: 0, idatx: idatx, idsolicitud: idsolicitud };
                    let formdata = new FormData();

                    if (ovariables.origenmuestra === 3) {  //// SOLICITUD DE ORIGEN TIPO COLGADOR WTS
                        if (ovariables.origenmuestra_colgador_generarcodigotela === 'CAMBIAR_ESTADO') {
                            parametro.cambio_estado_y_datos_adicionales = 'CAMBIAR_ESTADO|' + ovariables.codigotela_colgadorwts;
                            parametro.cambio_correlativo = 0;
                        }
                    }

                    formdata.append('par', JSON.stringify(parametro));
                    result_save = await _promise(30)
                        .then(() => {
                            let result = _Post('DesarrolloTextil/Atx/Save_CodigoTela_From_FinalizarAtx', formdata);
                            return result;
                        });
                    return result_save;
                }
            } else {  //// SE TRAE SOLO EL CODIGO DE TELA EXISTENTE, YA NO SE VUELVE A GENERAR EL CODIGO DE TELA
                return codigotela_existente;
            }
        }

        function fn_grabarentregablecolgador(e) {
            let fn_sub_getarr_telasencontradas = () => {
                let tbl_telas_encontradas = _('tabla_composicion_detalle_encontrado_x_operador'),
                    tbody_descripcion_telas_encontradas = tbl_telas_encontradas !== null ? tbl_telas_encontradas.getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0] : null,
                    arr_filas_telas_encontradas = tbody_descripcion_telas_encontradas !== null ? Array.from(tbody_descripcion_telas_encontradas.rows) : [], arr_return = [];
                arr_filas_telas_encontradas.forEach(x => {
                    let datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                        nrocolgadores = x.getElementsByClassName('cls_txt_cantidadcolgadores')[0].value.replace(/,/gi, ''),
                        obj = { idcolgadorsolicituddetalle: idcolgadorsolicituddetalle, nrocolgadores: nrocolgadores };

                    arr_return.push(obj);
                });

                return arr_return;
            }

            let fn_sub_getarr_telasarmados = () => {
                let tbl_armado = _('tabla_composicion_detalle_armado'),
                    tbody_armado = tbl_armado !== null ? _('tabla_composicion_detalle_armado').getElementsByClassName('cls_tbody_detalle_armado')[0] : null,
                    arr_filas = tbody_armado !== null ? Array.from(tbody_armado.rows) : [], arr_return = [];
                arr_filas.forEach(x => {
                    let datapar = x.getAttribute('data-par'),
                        idcolgadorsolicituddetalle_codigogenerado = _par(datapar, 'idcolgadorsolicituddetalle_codigogenerado'),
                        idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                        txt_cantidad_colgadores_generados = x.getElementsByClassName('cls_txt_cantidad_colgadores_generados')[0],
                        cantidadcolgadoresfisicosgenerados = txt_cantidad_colgadores_generados !== undefined ? txt_cantidad_colgadores_generados.value.replace(/,/gi, '') : '',
                        td_stockalmacen_guardar = x.getElementsByClassName('cls_td_stockalmacen_guardar')[0],
                        cantidadcolgadoresguardaralmacen_stock = td_stockalmacen_guardar !== undefined ? td_stockalmacen_guardar.innerText : '',
                        txt_cantidad_entregar_comercial = x.getElementsByClassName('cls_txt_cantidad_entregar_comercial')[0],
                        cantidadcolgadoresentregarcomercial = txt_cantidad_entregar_comercial !== undefined ? txt_cantidad_entregar_comercial.value.replace(/,/gi, '') : '';
                    if (idcolgadorsolicituddetalle_codigogenerado !== null && idcolgadorsolicituddetalle_codigogenerado !== '') {
                        let obj = {
                            idcolgadorsolicituddetalle_codigogenerado: idcolgadorsolicituddetalle_codigogenerado,
                            idcolgadorsolicituddetalle: idcolgadorsolicituddetalle,
                            cantidadcolgadoresfisicosgenerados: cantidadcolgadoresfisicosgenerados,
                            cantidadcolgadoresguardaralmacen_stock: cantidadcolgadoresguardaralmacen_stock,
                            cantidadcolgadoresentregarcomercial: cantidadcolgadoresentregarcomercial
                        };

                        arr_return.push(obj);
                    }
                });

                return arr_return;
            }

            //// GRABAR
            let arr_telasencontradas = fn_sub_getarr_telasencontradas(), arr_armado = fn_sub_getarr_telasarmados(), frm = new FormData(),
                obj_save = { telas_encontradas: arr_telasencontradas, armado: arr_armado }, url = 'DesarrolloTextil/SolicitudColgador/ActualizarEntregableColgadorOperador';
            frm.append("parhead", JSON.stringify(obj_save)), estado = appSolicitudAtx.ovariables.estados.ENPROCESO, idsolicitud = _('hf_idsolicitudatx_index').value;

            _Post(url, frm)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata) {
                        _swal({ mensaje: odata.mensaje, estado: odata.estado });
                        if (odata.id > 0) {
                            return_bandeja(estado, idsolicitud);
                        }
                    }
                });
        }

        function validar_siescambio_version_correlativo() {
            let obj = { cambia_version: 0, cambia_correlativo: 0 };

            //// YA NO VA
            //crear_objeto_cambiarversion_correlativo_save();

            for (let x in ovariables.obj_a_version) {
                if (ovariables.obj_a_version[x] !== ovariables.obj_b_version[x]) {
                    obj.cambia_version = 1;
                    break;
                }
            }

            let hilado_ini = JSON.stringify(ovariables.obj_a_correlativo.hilado),
                hilado_vista = JSON.stringify(ovariables.obj_b_correlativo.hilado);

            if (hilado_ini !== hilado_vista) {
                obj.cambia_correlativo = 1;
            } else {
                // VALIDAR SI CAMBIA VERSION POR EL COLOR DEL HILO
                let hiladocontenido_ini = JSON.stringify(ovariables.obj_a_correlativo.hiladocontenido),
                    hiladocontenido_save = JSON.stringify(ovariables.obj_b_correlativo.hiladocontenido);

                if (hiladocontenido_ini !== hiladocontenido_save) {
                    obj.cambia_version = 1;
                }
            }

            let resultado_largomalla_cambiacorrelativo = false, resultado_largomalla_cambiaversion = false;
            ovariables.obj_a_correlativo.hiladoporpasada_solo_largomalla.forEach(x => {
                //let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.idanalisistextilhiladoporpasada === x.idanalisistextilhiladoporpasada);
                let filter = ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla.filter(y => y.filapasada === x.filapasada && y.idhilado === x.idhilado && y.idposicion === x.idposicion);
                if (filter.length > 0) {
                    filter.forEach(z => {
                        let diferencia_lmc = (z.lmc - x.lmc), diferencia_lma = (z.lma - x.lma);
                        diferencia_lmc = diferencia_lmc < 0 ? (diferencia_lmc * -1) : diferencia_lmc;
                        diferencia_lma = diferencia_lma < 0 ? (diferencia_lma * -1) : diferencia_lma
                        if (diferencia_lmc > 0 || diferencia_lma > 0) {
                            if (diferencia_lmc > 0.10 || diferencia_lma > 0.10) {
                                obj.cambia_correlativo = 1;
                                resultado_largomalla_cambiacorrelativo = true;
                            } else {
                                obj.cambia_version = 1;
                                resultado_largomalla_cambiaversion = true;
                            }
                        }
                    });
                }
            });

            if (resultado_largomalla_cambiacorrelativo === false) {
                //// si no paso el limite de 0.10mm en largo malla entonces validar por los demas campos del ligamento
                //// json
                let cadena_ligamentos_completo_ini = JSON.stringify(ovariables.obj_a_correlativo.pasadas) + JSON.stringify(ovariables.obj_a_correlativo.ligamentos) + JSON.stringify(ovariables.obj_a_correlativo.repeticiones) + JSON.stringify(ovariables.obj_a_correlativo.hiladoporpasada),
                    cadena_ligamentos_completo_save = JSON.stringify(ovariables.obj_b_correlativo.pasadas) + JSON.stringify(ovariables.obj_b_correlativo.ligamentos) + JSON.stringify(ovariables.obj_b_correlativo.repeticiones) + JSON.stringify(ovariables.obj_b_correlativo.hiladoporpasada);

                if (cadena_ligamentos_completo_ini !== cadena_ligamentos_completo_save) {
                    obj.cambia_correlativo = 1;
                }
            }

            //// VALIDAR SI EXISTE EN EL ACABADO FISICO LAS SIGUIENTES VARIABLES PARA VER SI SE MODIFICA CORRELATIVO O NO
            let existe_ini_af_enumaf = false, existe_save_af_enumaf = false;
            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_a_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_ini_af_enumaf = true;
                    break;
                }
            }

            for (let x in ovariables.enums_acabadofisico_validcodigotela) {
                let id = ovariables.enums_acabadofisico_validcodigotela[x];
                let filter = ovariables.obj_b_correlativo.acabadofisico.filter(x => parseInt(x.id) === id);
                if (filter.length > 0) {
                    existe_save_af_enumaf = true;
                    break;
                }
            }

            if (existe_ini_af_enumaf || existe_save_af_enumaf) {
                let cadena_af = ovariables.obj_a_correlativo.acabadofisico.map(x => x.id).join(','), cadena_aq = ovariables.obj_b_correlativo.acabadofisico.map(x => x.id).join(',');
                if (cadena_af !== cadena_aq) {
                    obj.cambia_correlativo = 1;
                }
            }

            let cadena_aq_ini = ovariables.obj_a_correlativo.acabadoquimico.map(x => x.id).join(','), cadena_aq_save = ovariables.obj_b_correlativo.acabadoquimico.map(x => x.id).join(',');
            if (cadena_aq_ini !== cadena_aq_save) {
                obj.cambia_version = 1;
            }

            let cadena_ofamilia_correlativo_ini = JSON.stringify(ovariables.obj_a_correlativo.ofamilia),
                cadena_ofamilia_correlativo_save = JSON.stringify(ovariables.obj_b_correlativo.ofamilia);

            if (cadena_ofamilia_correlativo_ini !== cadena_ofamilia_correlativo_save) {
                obj.cambia_correlativo = 1;
            }

            return obj;
        }

        function fn_imprimiratx() {
            let idsolicitud = _('hf_idsolicitudatx_index').value, idatx = _('hf_idatx_index').value, parametro = `idsolicitud:${idsolicitud},idatx:${idatx}`,
                url = urlBase() + 'DesarrolloTextil/Atx/AnalisisTextilImprimir?par=' + parametro;
            window.open(url);

            //let link = document.createElement('a');
            //link.href = url;
            //link.target = '_blank';
            //document.body.appendChild(link);
            //link.click();
            //document.body.removeChild(link);
            //delete link;
        }

        // :filter
        function filtro_solicitudatx_index() {
            let txtfilter = _('txtfiltrobandeja_solicitudatx').value,
                estado = d.getElementById('hf_estadoactualbusqueda_index').value,
                filtrado = appSolicitudAtx.ovariables.lstdata_bandejasolicitud.filter(x => x.datafiltrar.toLowerCase().indexOf(txtfilter) >= 0);

            _('_menu').innerHTML = fn_load_menu(filtrado, estado);
            let menu = document.getElementById('_menu'),
                aitem = [...menu.getElementsByClassName('_item')];

            aitem.forEach(x => {
                x.addEventListener('click', function (y) {
                    // Jacob - Se agrego condicional para cotizacion
                    let data_par = x.getAttribute('data-par');
                    let idservicio = _parseInt(_par(data_par, 'idservicio'));
                    let id = x.getAttribute('data-id');
                    if (idservicio === 13) {
                        req_CargarCotizacion(id);
                    } else {
                        req_load_content_init(id);
                    }
                })
            });
        }
        // :fin filter

        function return_bandeja(estado_a_retornar, idsolicitud) {
            let url = 'DesarrolloTextil/Solicitud/Index', txtpar_solicitudatx_index = _('txtpar_solicitudatx_index').value, estadoresumen = '', tieneestado_resumen = false;

            let arrpar = txtpar_solicitudatx_index.split(',');
            arrpar.some((x, indice) => {
                if (x.indexOf('estado_resumen') >= 0) {
                    tieneestado_resumen = true;
                    return true;
                }
            });

            if (estado_a_retornar !== undefined) {
                arrpar.some((x, indice) => {
                    if (x.indexOf('estado_resumen') !== -1) {
                        arrpar.splice(indice, 1);
                        return true;
                    }
                });
            }

            arrpar.some((x, indice) => {
                if (x.indexOf('idsolicitud') !== -1) {
                    arrpar.splice(indice, 1);
                    return true;
                }
            });

            txtpar_solicitudatx_index = arrpar.join(',');

            //// EL ESTADO NO LO VUELVO A PONER POR QUE EN LA BANDEJA LO SETEO CON LOS FILTROS DE ESTADO; AL IDSOLICITUD SI TENGO QUE QUITARLO Y VOLVERLO A SETEAR
            if (tieneestado_resumen === false && estado_a_retornar === undefined) {
                txtpar_solicitudatx_index += ',estado_resumen:' + ovariables.estados_enum_retorno[estado_a_retornar]
            } else if (estado_a_retornar !== undefined && estado_a_retornar !== '') {
                txtpar_solicitudatx_index += ',estado_resumen:' + ovariables.estados_enum_retorno[estado_a_retornar]
            }

            txtpar_solicitudatx_index += ',idsolicitud:' + idsolicitud;

            //ruteo_bandejamodelo_correo(url, ovariables.idsolicitud, 'divcontenedor_breadcrum');
            //POR = atx_por_operar; EN = atx_en_proceso
            fn_loadvista_index_bandeja(url, txtpar_solicitudatx_index, 'divcontenedor_breadcrum');
        }
        
        function fn_imprimirsolicitudatx(e){
            let  idsolicitud = _('hf_idsolicitudatx_index').value,idgrupocomercial= ovariables.idgrupocomercial, idanalisistextilsolicitud=  _('hf_idanalisistextilsolicitud_index').value,
                par = '', idservicio = _('hf_idservicio').value, url = '', idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index').value;

            if (parseInt(idsolicitud) > 0) {
                if (idservicio === '9') {
                    par = `idsolicitud:${idsolicitud},idgrupopersonal:${idgrupocomercial},idanalisistextilsolicitud:${idanalisistextilsolicitud}`
                    url = urlBase() + 'DesarrolloTextil/Solicitud/SolicitudImprimir?par=' + par
                } else if (idservicio === '12') {
                    par = `idsolicitud:${idsolicitud},idgrupopersonal:${idgrupocomercial},idcolgadorsolicitud:${idcolgadorsolicitud}`
                    url = urlBase() + 'DesarrolloTextil/SolicitudColgador/SolicitudColgadorImprimir?par=' + par
                }

                window.open(url);
            } else {
                _swal({ mensaje: 'No existe solicitud para imprimir...!', estado: 'error' });
            }
        }

        function crear_objeto_cambiaversion_correlativo_ini(analisistextil, hilados, hiladocontenido, data_tblpasadas, data_tblimg_ligamentos, data_tblrepeticiones, data_tblhiladoporpasada, data_acabadofisico, data_acabadoquimico, para_el_estandar_o_atx_b) {
            let arrhilado_valid_correlativo = [], arrhiladocontenido = [];
            let obj_version = {
                idpretratamiento: analisistextil[0].idpretratamiento === '0' ? "" : analisistextil[0].idpretratamiento,
                idmetodotenido: analisistextil[0].idmetodotenido === '0' ? "" : analisistextil[0].idmetodotenido,
                idtipotenido: analisistextil[0].idtipotenido === '0' ? "" : analisistextil[0].idtipotenido,
                lavado: analisistextil[0].lavado === '0' ? "" : analisistextil[0].lavado,
                metodo: analisistextil[0].metodo === '0' ? "" : analisistextil[0].metodo,
                area: analisistextil[0].area,
                peso: analisistextil[0].peso,
                densidad: analisistextil[0].densidad,
                idtipofontura: analisistextil[0].idtipofontura === '0' ? "" : analisistextil[0].idtipofontura,
                idgalga: analisistextil[0].idgalga === '0' ? "" : analisistextil[0].idgalga,
                idgalgadiametro: analisistextil[0].idgalgadiametro === '0' ? "" : analisistextil[0].idgalgadiametro,
                //numeroagujas: _('txtnumeroaguja').value,
                idproveedor: analisistextil[0].idproveedor,
                idcliente: analisistextil[0].idcliente
            }

            let obj_correlativo = {
                idfamilia: analisistextil[0].idfamilia === '0' ? '' : analisistextil[0].idfamilia
            }

            if (para_el_estandar_o_atx_b === 'estandar') {
                ovariables.obj_a_version = obj_version;
            } else if (para_el_estandar_o_atx_b === 'atx_b') {
                ovariables.obj_b_version = obj_version;
            }

            if (hilados !== null) {
                hilados.forEach((x, indice) => {
                    let obj = {
                        //idanalisistextilhilado: x.idanalisistextilhilado,
                        idtitulohiladotela: x.idtitulohiladotela,
                        idhilado: x.idhilado,
                        idformahilado: x.idformahilado === '0' ? '' : x.idformahilado,
                        porcentaje: x.porcentaje
                    };
                    arrhilado_valid_correlativo.push(obj);

                    //let obj = { hilado: x.concathilado }
                    //arrhilado_valid_correlativo.push(obj);
                });
            }

            if (para_el_estandar_o_atx_b === 'estandar') {
                ovariables.obj_a_correlativo.hilado = arrhilado_valid_correlativo;
            } else if (para_el_estandar_o_atx_b === 'atx_b') {
                ovariables.obj_b_correlativo.hilado = arrhilado_valid_correlativo;
            }

            if (hiladocontenido !== null) {
                hiladocontenido.forEach(x => {
                    let obj = {
                        //idanalisistextilhiladocontenido: x.idanalisistextilhiladocontenido,
                        //idanalisistextilhilado: x.idanalisistextilhilado,
                        idhilado: x.idhilado,
                        idcolortextilhilado: x.idcolortextilhilado === '0' ? '' : x.idcolortextilhilado
                    }
                    arrhiladocontenido.push(obj);
                });
            }

            if (para_el_estandar_o_atx_b === 'estandar') {
                ovariables.obj_a_correlativo.hiladocontenido = arrhiladocontenido; //// OJO: EN LA FUNCION DE VALIDACION SI LO VALIDO POR VERSION    
            } else if (para_el_estandar_o_atx_b === 'atx_b') {
                ovariables.obj_b_correlativo.hiladocontenido = arrhiladocontenido; //// OJO: EN LA FUNCION DE VALIDACION SI LO VALIDO POR VERSION    
            }

            // PARA LOS LIGAMENTOS
            let arrpasadas = [], arrligamentos = [], arrepeticiones = [], arrhiladoporpasada = [], arrhiladoporpasada_solo_largomalla = [];
            //// NRO PASADAS
            if (data_tblpasadas !== null) {
                data_tblpasadas.forEach(x => {
                    let obj = { numeropasada: x.numeropasada };
                    arrpasadas.push(obj);
                });
            }
            //// IMG - LIGAMENTOS
            if (data_tblimg_ligamentos !== null) {
                //// COLUMNAS
                data_tblimg_ligamentos.forEach(x => {
                    let obj = {};
                    obj = { numeropasada: x.numeropasada, pista: x.filapasada, columnapasada: x.columnapasada, idelementoestructura: x.idelementoestructura };
                    arrligamentos.push(obj);
                });
            }
            //// REPETICIONES
            if (data_tblrepeticiones !== null) {
                data_tblrepeticiones.forEach(x => {
                    let obj = {
                        //idanalisistextilestructuranumrepeticiones: x.idanalisistextilestructuranumrepeticiones,
                        orden: x.orden,
                        numerorepeticiones: x.numerorepeticiones,
                        filas: x.filas
                    };
                    arrepeticiones.push(obj);
                });
            }
            //// HILADO POR PASADA
            if (data_tblhiladoporpasada !== null) {
                arrpasadas.forEach((x, indice) => {
                    let numeropasada = x.numeropasada; //x.getAttribute('data-nropasada');
                    let lst = data_tblhiladoporpasada.filter(x => x.numeropasada === numeropasada);

                    if (lst.length > 0) {
                        lst.forEach(item => {
                            //// ARMAR OBJ HILADO POR PASADA
                            let obj_hiladoporpasada = {
                                idposicion: item.idposicion,
                                //guid_hilado: item.guid_hilado,
                                idhilado: item.idhilado,
                                filapasada: item.numeropasada
                            };

                            arrhiladoporpasada.push(obj_hiladoporpasada);

                            //let objlargomallas = { lmc: item.largomallacrudo, lma: item.largomallaacabado, guid_hilado: item.guid_hilado, filapasada: item.numeropasada, idanalisistextilhiladoporpasada: item.idanalisistextilhiladoporpasada };
                            let objlargomallas = { lmc: item.largomallacrudo, lma: item.largomallaacabado, idhilado: item.idhilado, filapasada: item.numeropasada, idposicion: item.idposicion };
                            arrhiladoporpasada_solo_largomalla.push(objlargomallas);
                        });
                    }
                });
            }

            //// ACABADO FISICO // NOTA - LOS ACABADOS FISICOS; SI CAMBIA CUALQUIERA DE ESTOS SE CAMBIA EL CORRELATIVO: Esmerilado, Perchado y Tundido
            let arr_idaf = [], arr_idaq = [];
            if (data_acabadofisico !== null) {
                data_acabadofisico.forEach(x => {
                    let obj = { id: x.idacabadofisico };
                    arr_idaf.push(obj);
                });
            }
            if (data_acabadoquimico !== null) {
                data_acabadoquimico.forEach(x => {
                    let obj = { id: x.idacabadoquimico };
                    arr_idaq.push(obj);
                });
            }

            if (para_el_estandar_o_atx_b === 'estandar') {
                ovariables.obj_a_correlativo.pasadas = arrpasadas;
                ovariables.obj_a_correlativo.ligamentos = arrligamentos;
                ovariables.obj_a_correlativo.repeticiones = arrepeticiones;
                ovariables.obj_a_correlativo.hiladoporpasada = arrhiladoporpasada;
                ovariables.obj_a_correlativo.hiladoporpasada_solo_largomalla = arrhiladoporpasada_solo_largomalla;
                ovariables.obj_a_correlativo.acabadofisico = arr_idaf;
                ovariables.obj_a_correlativo.acabadoquimico = arr_idaq;
                ovariables.obj_a_correlativo.ofamilia = obj_correlativo;
            } else if (para_el_estandar_o_atx_b === 'atx_b') {
                ovariables.obj_b_correlativo.pasadas = arrpasadas;
                ovariables.obj_b_correlativo.ligamentos = arrligamentos;
                ovariables.obj_b_correlativo.repeticiones = arrepeticiones;
                ovariables.obj_b_correlativo.hiladoporpasada = arrhiladoporpasada;
                ovariables.obj_b_correlativo.hiladoporpasada_solo_largomalla = arrhiladoporpasada_solo_largomalla;
                ovariables.obj_b_correlativo.acabadofisico = arr_idaf;
                ovariables.obj_b_correlativo.acabadoquimico = arr_idaq;
                ovariables.obj_b_correlativo.ofamilia = obj_correlativo;
            }

        }

        function pintar_cuerpo_atx(solicitud, obj) {
            let partida_row1 = (_obj) => {
                let _return = `<h4 class="text-navy"><strong>${_obj.nombrecliente}</strong></h4>
                        <p><span><strong>Origen Muestra: </strong> ${_obj.origenmuestra}</span></p>
                        <p><span><strong>Motivo Solicitud: </strong> ${_obj.motivosolicitud}</span></p>
                        <p><span><strong>Estructura: </strong> ${_obj.estructura}</span></p>
                        <p><span><strong>Titulo: </strong> ${_obj.titulo}</span></p>
                    `;

                return _return;
            }

            let partida_row1_2 = (_obj) => {
                let _return = '';

                _return = `
                    <p><span><strong>Densidad: </strong> ${_obj.densidad}</span></p>
                    <p><span><strong>Lavado: </strong> ${_obj.lavado}</span></p>
                    <p><span><strong>¿La muestra está siendo evaluada en Laboratorio?: </strong> ${_obj.evaluacionlaboratorio}</span></p>
                    <p><span><strong>Color: </strong> ${_obj.color}</span></p>
                    <p><span><strong>Cliente: </strong> ${_obj.nombrecliente}</span></p>
                `;

                return _return
            }

            let partida_row1_3 = (_obj) => {
                let _return = '';

                if (_obj.tipomuestra === 1) {  // CLIENTE

                } else if (_obj.tipomuestra === 2) { // PROVEEDOR
                    let hide_btn_download_file = '';
                    if (_obj.nombrearchivooriginal.trim() === '') {
                        hide_btn_download_file = 'hide';
                    }
                    _return += `
                            <p><span><strong>Fábrica: </strong> ${_obj.nombreproveedor}</span></p>    
                            <p><span><strong>Proveedor de Tela: </strong> ${_obj.proveedordefabrica}</span></p>
                            <p><span><strong>Cod Tela Proveedor: </strong> ${_obj.codigotelaproveedor}</span></p>
                            <p><span><strong>Partida: </strong> ${_obj.partida}</span></p>
                            <p><span><strong>Archivo: </strong> <button class='btn btn-link cls_btn_down_archivo_proveedor' data-nombregenerado='${_obj.nombrearchivogenerado}' data-nombreoriginal='${_obj.nombrearchivooriginal}'>${_obj.nombrearchivooriginal}</button>
                                <button class='btn btn-xs cls_btn_down_archivo_proveedor ${hide_btn_download_file}' data-nombregenerado='${_obj.nombrearchivogenerado}' data-nombreoriginal='${_obj.nombrearchivooriginal}'>
                                    <span class='fa fa-cloud-download'></span>
                                </button></span>
                            </p>
                        `;
                } else if (_obj.tipomuestra === 3) { // COLGADOR
                    _return += `
                        <p><span><strong>Cod Tela Wts: </strong> ${_obj.codigotela}</span></p>
                    `;
                } else if (_obj.tipomuestra === 4) {
                    _return += `
                        <p><span><strong>Buscar #Atx: </strong> ${_obj.anio} - ${_obj.contador} </span></p>
                    `;
                }

                return _return
            }

            let partida_details = (_obj) => {
                if (_obj.composiciontela === '') return '';
                let _ahead_name = _obj.composiciontela.split('^')[0].split('¬'),
                    _arr = CSVtoJSON(_obj.composiciontela),
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

            let objrechazo = (_obj) => {
                if (_obj.comentarioaprobacion === '') return '';
                let _ahead_name = _obj.comentarioaprobacion.split('^')[0].split('¬'),
                    _arr = CSVtoJSON(_obj.comentarioaprobacion),
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

            let objcomentregable = (_obj) => {
                if (_obj.comentarioentregable === '') return '';
                let _ahead_name = _obj.comentarioentregable.split('^')[0].split('¬'),
                    _arr = CSVtoJSON(_obj.comentarioentregable),
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

            let objatx = (_obj) => {
                if (_obj.atx === '') return '';
                let _ahead_name = _obj.atx.split('^')[0].split('¬'),
                    _arr = CSVtoJSON(_obj.atx),
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

            let detalle = partida_details(obj), html_cuerpo = '',
                html_divpartida_row1 = partida_row1(solicitud), html_divpartida_row1_2 = partida_row1_2(solicitud),
                html_divpartida_row1_3 = partida_row1_3(solicitud), html_tabla_composicion = '',
                html_tabla_comentario_aprobadorechazo_entregable = '', html_tabla_atx_entregable = '',
                comentarioentregable = objcomentregable(obj), atx = objatx(obj), html_tabla_comentario_aprobadorechazo_solicitud = '',
                rechazo = objrechazo(obj);

            if (detalle !== '') {
                html_tabla_composicion += `
                    <div class="table-responsive m-t" id="div_tbl_detalle">
                        <h4 class="text-navy"><strong id="titulo_tbl_strong">COMPOSICIÓN</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table invoice-table" id="tabla_composicion_detalle">
                            ${detalle}
                        </table>
                            
                        <br />
                    </div>
                `;
            }

            if (rechazo !== '') {
                html_tabla_comentario_aprobadorechazo_solicitud += `
                    <div class="table-responsive m-t" id="div_tbl_rechazo">
                        <h4 class="text-navy"><strong id="titulo_tbl_rechazo_strong">COMENTARIOS DE APROBACION</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table invoice-table" id="tabla_rechazo">
                            ${rechazo}
                        </table>
                        <br />
                    </div>
                `;
            }

            if (comentarioentregable !== '') {
                html_tabla_comentario_aprobadorechazo_entregable += `
                    <div class="table-responsive m-t" id="div_tblatx">
                        <h4 class="text-navy"><strong id="titulo_tbl_atx_strong">ATX</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table invoice-table" id="tabla_atx">
                            ${comentarioentregable}
                        </table>
                        <br />
                    </div>
                `;
            }

            if (atx !== '') {
                html_tabla_atx_entregable += `
                    <div class="table-responsive m-t" id="div_tbl_comentarioentregable">
                        <h4 class="text-navy"><strong id="titulo_tbl_entregable_strong">COMENTARIOS DE ENTREGABLE</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table invoice-table" id="tabla_comentarioentregable">
                            ${atx}
                        </table>
                        <br />
                    </div>
                `;
            }

            html_cuerpo += `
                    <div class="row">
                        <div class="col-sm-4 text-left" id="divpartida_row1">
                            ${html_divpartida_row1}
                        </div>
                        <div class="col-sm-4 text-left" id="divpartida_row1_2">
                            ${html_divpartida_row1_2}
                        </div>
                        <div class="col-sm-4 text-left" id="divpartida_row1_3">
                            ${html_divpartida_row1_3}
                        </div>
                    </div>
                    ${html_tabla_composicion}
                    ${html_tabla_comentario_aprobadorechazo_solicitud}
                    ${html_tabla_comentario_aprobadorechazo_entregable}
                    ${html_tabla_atx_entregable}
            `;
            _('div_contenido_cuerpo_solicitud').innerHTML = html_cuerpo;

            //// PARA LA DESCARGA DEL ARCHIVO DE PROVEEDOR
            let arr_btn_download = Array.from(_('divdetalle_breadcrum').getElementsByClassName('cls_btn_down_archivo_proveedor'));
            arr_btn_download.forEach(x => x.addEventListener('click', e => { let o = e.currentTarget; fn_download_archivo_proveedor(o) }));
        }

        //// ESTO ERA UNA SUB FUNCION DE OTRA LO SAQUE PARA PODER REUTILIZARLO; LO SAQUE DE LA FUNCION: pintar_cuerpo_colgador
        function sub_fn_details_codigotelagenerado(_obj, pidsolicitudcolgadordetalle, estadocantidadcolgadoresrecibidos_confirmados) {
            let _arr = _obj.detalle_solicitud_colgador_codigogenerado !== '' ? CSVtoJSON(_obj.detalle_solicitud_colgador_codigogenerado) : null,
                html_fn = '', cadena_disabled_confirmar_cantidad = estadocantidadcolgadoresrecibidos_confirmados === '1' ? '' : 'disabled';

            if (_arr) {
                let arr_codigotelagenerado = _arr.filter(x => x.idcolgadorsolicituddetalle === pidsolicitudcolgadordetalle);
                if (arr_codigotelagenerado.length > 0) {
                    arr_codigotelagenerado.forEach(x => {
                        let cadena_link_editar_atx = 'New';
                        if (x.idanalisistextil_idtela !== '') {
                            cadena_link_editar_atx = 'Edit';
                        }
                        html_fn += `
                                <tr data-par='idcolgadorsolicituddetalle_codigogenerado:${x.idcolgadorsolicituddetalle_codigogenerado},idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idanalisistextil_idtela:${x.idanalisistextil_idtela},codigotela_generado:${x.codigotela_generado},cantidadcolgadoresfisicosgenerados:${x.cantidadcolgadoresfisicosgenerados},cantidadcolgadoresentregarcomercial:${x.cantidadcolgadoresentregarcomercial}'>
                                    <td></td>
                                    <td>1</td>
                                    <td></td>
                                    <td class='text-center'></td>
                                    <td class='text-center'>
                                        <a href=javascript:void(0) class='cls_new_colgador' data-par='disabled:${ cadena_disabled_confirmar_cantidad}'>${cadena_link_editar_atx}</a> 
                                        ${x.codigotela_generado}
                                        <br/>
                                        <span class="spn_error_codigogenerado has-error hide">Falta Crear el Colgador</span>
                                    </td>
                                    <td>
                                        <input type='text' class='form-control cls_txt_cantidad_colgadores_generados cls_para_el_operador cls_inputs_soloenteros' value='${x.cantidadcolgadoresfisicosgenerados}' ${cadena_disabled_confirmar_cantidad} onkeypress='return DigitosEnteros(event, this)' />
                                        <span class="spn_error_cantidadcolgadoresgenerados has-error hide">Falta Ingresar la Cantidad de Colgadores</span>
                                    </td>
                                    <td class='cls_td_stockalmacen_guardar'>${x.cantidadcolgadoresguardaralmacen_stock}</td>
                                    <td>
                                        <input type='text' class='cls_txt_cantidad_entregar_comercial form-control cls_para_el_operador cls_inputs_soloenteros' value='${x.cantidadcolgadoresentregarcomercial}' ${cadena_disabled_confirmar_cantidad} onkeypress='return DigitosEnteros(event, this)' />
                                        <span class="spn_error_cantidad_a_entregar has-error hide">Falta Ingresar la Cantidad de Colgadores a Entregar</span>
                                    </td>
                                    <td class='text-center'>${x.fechaactualizacion_operador}</td>
                                    <td class='text-center'>
                                        <button type='button' class='btn btn-xs btn-success cls_btn_print cls_para_el_operador' title='Imprimir colgador'>
                                            <span class='fa fa-print'></span>
                                        </button>
                                    </td>
                                </tr>  
                            `;
                    });

                }
            }

            return html_fn;
        }

        function pintar_cuerpo_colgador(solicitud, obj) {
            let html_tabla = '', html_cuerpo;
        
            let sub_fn_details = (_obj, tipobusqueda) => {
                if (_obj.detalle_solicitud_colgador === '') return '';
                let _arr = CSVtoJSON(_obj.detalle_solicitud_colgador), html_fn = '', html_head = '', html_body = '';

                arr_filtrado = _arr.filter(x => x.tipobusqueda === tipobusqueda);

                if (tipobusqueda === 'codigotela') {
                    if (arr_filtrado.length > 0) {
                        html_head = `
                            <thead>
                                <tr>
                                    <th class='col-sm-1'>Foto</th>
                                    <th class='col-sm-1'>Código Tela</th>
                                    <th class='col-sm-10'>Descripción Tela</th>
                                    <th class='col-sm-1'>Existe</th>
                                </tr>
                            </thead>
                        `;
                        arr_filtrado.forEach(x => {
                            //// /Content/upload/
                            let valor_existe = x.existetela, chk_checked = x.existetela === '1' ? 'checked' : '',
                                ruta_imagen = x.imagenwebcolgador !== '' ? 'http://wts-fileserver/erp/textileanalysis/SolicitudColgador/FotosColgador/' + x.imagenwebcolgador : 'http://WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg';
                            html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idanalisistextil:${x.idanalisistextil}'>
                                    <td class='cls_td_imagencolgador'>
                                        <div style='width:100%;'>
                                            <img class='img-thumbnail cls_img_imagen_colgador' src='${ruta_imagen}' width='100' height='80'/>
                                            <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto' style='cursor:pointer !important;'></span>
                                        </div>
                                    </td>
                                    <td class='cls_td_codigotela'>${x.codigotela}</td>
                                    <td class='cls_td_nombretela'>${x.descripciontela}</td>
                                    <td class='text-center'>
                                        <label>
                                            <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                                <input type='checkbox' class ='i-checks _clscheck_estado_existe cls_para_el_operador' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="${valor_existe}" data-valor="" ${chk_checked} />&nbsp
                                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            `;
                        });
                        html_fn = `
                            ${html_head}
                            <tbody class='cls_tbody_colgadordetalle_codigotela'>
                                ${html_body}
                            </tbody>
                        `;
                    }
                } else if (tipobusqueda === 'descripcion') {
                    //// ACA SOLO ARMAR LAS FILAS; LA CABECERA DEBERIA ESTAR YA ARMADA
                    arr_filtrado.forEach(x => {
                        let valor_existe = '0';
                        html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idanalisistextil:${x.idanalisistextil}'>
                                    <td class='text-center'>
                                        <button type='button' class='btn btn-xs btn-danger btn_delete cls_para_el_operador' title='Eliminar'>
                                            <span class='fa fa-trash'></span>
                                        </button>
                                    </td>
                                    <td class='cls_td_codigotela'>${x.codigotela}</td>
                                    <td class='cls_td_nombretela'>${x.descripciontela}</td>
                                    <td>
                                        <input type='text' class='form-control cls_txt_cantidadcolgadores cls_para_el_operador cls_inputs_soloenteros' value='${x.nrocolgadores}' />
                                        <span class="spn_error_cantidadcolgadores_encontrados has-error hide">Falta Ingresar la Cantidad de Colgadores</span>
                                    </td>
                                    <td class='text-center'>
                                        <label>
                                            <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                                <input type='checkbox' class ='i-checks _clscheck_estado_existe cls_para_el_operador' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="1" data-valor="" checked="checked" disabled="disabled" />&nbsp
                                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            `;
                    });
                    html_fn = `
                            <tbody class='cls_tbody_telas_encontradas_x_operador'>
                                ${html_body}
                            </tbody>
                        `;
                }
                else if (tipobusqueda === 'armado') {
                    if (arr_filtrado.length > 0) {
                        html_head = `
                            <thead class='cls_thead_detalle_armado'>
                                <tr>
                                    <th colspan='3' class='text-center'>COMERCIAL</th>
                                    <th colspan='7' class='text-center'>DESARROLLO TEXTIL</th>
                                </tr>
                                <tr>
                                    <th class='col-sm-2'>Proveedor</th>
                                    <th class='col-sm-1'>Nro Colgadores</th>
                                    <th class='col-sm-2'>Comentario</th>
                                    <th class='col-sm-2'>Cantidad Recibida</th>
                                    <th class='col-sm-1'>Codigo Tela Generado</th>
                                    <th class='col-sm-1'>Cantidad Colgadores Generados</th>
                                    <th class='col-sm-1'>Stock Almacen</th>
                                    <th class='col-sm-1'>Cantidad Entregar Comercial</th>
                                    <th class='col-sm-1'>Operador</th>
                                    <th class='col-sm-1'>
                                        <button type='button' class='btn btn-xs btn-primary cls_btn_print_all cls_para_el_operador' title='Imprimir Todos los colgadores'>
                                            <span class='fa fa-print'></span>
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                        `;

                        arr_filtrado.forEach(x => {
                            let html_codigotelagenerado = sub_fn_details_codigotelagenerado(_obj, x.idcolgadorsolicituddetalle, x.estadocantidadcolgadoresrecibidos_confirmados),
                                cadena_disabled_confirmar_cantidad = x.estadocantidadcolgadoresrecibidos_confirmados === '1' ? 'disabled' : '';
                            html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle}'>
                                    <td>${x.nombreproveedor}</td>
                                    <td class='cls_td_nrocolgadores'>${x.nrocolgadores}</td>
                                    <td class='text-center'>${x.comentario}</td>
                                    <td class='text-center'>
                                        <div class='input-group'>
                                            <input type='text' class='form-control cls_cantidad_recibida cls_para_el_operador cls_inputs_soloenteros' value='${x.resumen_cantidadcolgadoresrecibidos}' ${cadena_disabled_confirmar_cantidad} />
                                            <div class='input-group-btn'>
                                                <button type='button' class='btn btn-primary cls_btn_cantidad_recibida cls_para_el_operador' ${cadena_disabled_confirmar_cantidad}>
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                        <span class="spn_error_cantidad_recibida has-error hide">Falta confirmar la cantidad recibida</span>
                                    </td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>${x.usuarioactualizacionoperador}</td>
                                    <td class='text-center'></td>
                                </tr>
                                ${html_codigotelagenerado}
                            `;
                        });

                        html_fn = `
                            ${html_head}
                            <tbody class='cls_tbody_detalle_armado'>
                                ${html_body}
                            </tbody>
                        `;
                    }
                }

                return html_fn;
            }
            let sub_fn_html_fotos_descripcion = (imagenescolgadoresparadescripcion_json) => {
                let odata_json_fotos_descripcion = imagenescolgadoresparadescripcion_json !== '' ? JSON.parse(imagenescolgadoresparadescripcion_json) : null,
                    html_fotos_descripcion = '', html_return = '';

                if (odata_json_fotos_descripcion) {
                    odata_json_fotos_descripcion.forEach(x => {
                        //// /Content/upload/
                        let numero_aleatorio = Math.floor(Math.random() * 100), clase_generada = 'cls_foto_descripcion_' + numero_aleatorio,
                            rutafoto = 'http://wts-fileserver/erp/textileanalysis/SolicitudColgador/FotosColgador/' + x.imagenwebcolgador;
                        html_fotos_descripcion += `
                            <div class="col-sm col-sm-1 cls_div_foto_descripcion ${clase_generada}" data-nombreclasegenerada='${clase_generada}' data-par='imagenoriginalcolgador:${x.imagenoriginalcolgador},imagenwebcolgador:${x.imagenwebcolgador}' data-estadofoto='edit'>
                                <img src="${ rutafoto}" class="img-responsive" style="width:90px; height:80px;">
                                <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto' style='cursor:pointer !important;'></span>
                            </div>
                        `;
                    });

                    html_return = `
                        <br />
                        <div class='col-sm-12'>
                            <div class="panel panel-default" style="height: 140px; max-height:134px; overflow-y: auto;">
                                <div class="panel-body">
                                    <div class="form-horizontal">
                                        <div class="">
                                            <div class="row" id="div_contenedordetalle_fotos_descripcion">
                                                ${html_fotos_descripcion}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } 

                return html_return;
            }

            let tabla_busqueda_x_codigotela = sub_fn_details(obj, 'codigotela'), tabla_armado_colgadores = sub_fn_details(obj, 'armado');
            tabla_busqueda_x_descripcion = sub_fn_details(obj, 'descripcion');

            if (tabla_busqueda_x_codigotela !== '') {
                html_tabla += `
                    <div class="table-responsive m-t cls_div_tbl_buscar_codigotela">
                        <h4 class="text-navy"><strong id="titulo_tbl_strong">BUSCAR POR COLGADOR</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table table-bordered" id="tabla_composicion_detalle">
                            ${tabla_busqueda_x_codigotela}
                        </table>
                            
                        <br />
                    </div>
                `;
            }

            if (solicitud.descripciontela !== '') {
                if (tabla_busqueda_x_descripcion === '') {
                    tabla_busqueda_x_descripcion = `
                        <tbody class="cls_tbody_telas_encontradas_x_operador"></tbody>
                    `;
                }

                let html_fotos_descripcion = sub_fn_html_fotos_descripcion(solicitud.imagenescolgadoresparadescripcion_json);

                html_tabla += `
                    <div class="table-responsive m-t cls_div_tbl_buscar_descripcion">
                        <h4 class="text-navy"><strong id="titulo_tbl_strong">BUSCAR POR DESCRIPCION</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <p><span><strong>Descripción: </strong>${solicitud.descripciontela}</span></p>
                        ${html_fotos_descripcion}
                        <br/>
                        <div class='col-sm-12'>
                            <div class='form-group'>
                                <label class='control-label col-sm-2 text-right'>Código Tela WTS</label>
                                <div class='col-xs-4 col-sm-4'>
                                    <input type='text' class='form-control cls_txt_codigotela_wts_encontrado_x_operador cls_para_el_operador' value = '' />
                                </div>
                            </div>
                        </div>
                        <br/> <br/> <br/>
                        <table class="table table-bordered" id="tabla_composicion_detalle_encontrado_x_operador">
                            <thead>
                                <tr>
                                    <th class='col-sm-1'></th>
                                    <th class='col-sm-1'>Código Tela</th>
                                    <th class='col-sm-8'>Descripción Tela</th>
                                    <th class='col-sm-1'>Cantidad</th>
                                    <th class='col-sm-1'>Existe</th>
                                </tr>
                            </thead>
                            ${tabla_busqueda_x_descripcion}
                        </table>
                    </div>
                `;
            }
            
            if (tabla_armado_colgadores !== '') {
                html_tabla += `
                    <div class="table-responsive m-t cls_div_tbl_armadocolgadores">
                        <h4 class="text-navy"><strong id="titulo_tbl_strong">ARMADO DE COLGADORES</strong></h4>
                        <hr class="hr-primary hr-line-dashed">
                        <table class="table table-bordered" id="tabla_composicion_detalle_armado">
                            ${tabla_armado_colgadores}
                        </table>
                        <br />
                    </div>
                `;
            }

            //// ESTO VALE; ACTIVAR LUEGO
            html_cuerpo = `
                    ${html_tabla}
            `;

            //_('div_contenido_cuerpo_solicitud').innerHTML = html_en_duro; //html_cuerpo;
            _('div_contenido_cuerpo_solicitud').innerHTML = html_cuerpo;
            fn_handler_tablas_colgador();
            setear_valores_por_defecto_cuerpo_colgador();
        }

        function setear_valores_por_defecto_cuerpo_colgador() {
            let idusuario_logeado = _('hf_idusuario').value;
            //// ACTIVAR O DESACTIVAR SEGUN EL ESTADO
            if (ovariables.estado_tabla_solicitudes.trim() !== 'EN' || ovariables.idoperador !== parseInt(idusuario_logeado)) {
                //// DESACTIVAR
                let arr_inputs = Array.from(_('div_padre_index_solicitudatx_1').getElementsByClassName('cls_para_el_operador'));

                arr_inputs.forEach(x => {
                    x.disabled = true;
                });
            }
        }

        function fn_handler_tablas_colgador() {
            $("#div_contenido_cuerpo_solicitud .i-checks._clscheck_estado_entregado").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#tabla_composicion_detalle .i-checks._clscheck_estado_existe").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on("ifChanged", function (e) {
                let o = e.currentTarget, fila = o.parentNode.parentNode.parentNode.parentNode.parentNode,
                    datapar = fila.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle');
                if (e.currentTarget.checked === true) {
                    grabar_telas_marcadas_existentes_x_operador(true, idcolgadorsolicituddetalle);
                } else {
                    grabar_telas_marcadas_existentes_x_operador(false, idcolgadorsolicituddetalle);
                }
            });

            $("#tabla_composicion_detalle_encontrado_x_operador .i-checks._clscheck_estado_existe").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#div_contenido_cuerpo_solicitud .i-checks._clscheck_estado_recibido_todos").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let dom = e.currentTarget, valor = dom.checked;
                seleccionar_todos_colgadores_recibidos(valor);
            });

            $("#div_contenido_cuerpo_solicitud .i-checks._clscheck_estado_recibido").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            let arr_new_colgador = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_new_colgador')),
                arr_txt_cantidad_colgadores_generados = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_cantidad_colgadores_generados')),
                arr_txt_cantidad_entregar_comercial = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_cantidad_entregar_comercial')),
                array_txt_codigotela_x_operador = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_codigotela_wts_encontrado_x_operador')),
                tbody_telas_encontradas = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0],
                arr_btn_delete_telas_encontradas = tbody_telas_encontradas !== undefined ? Array.from(tbody_telas_encontradas.getElementsByClassName('btn_delete')) : [],
                tbl_armado = _('tabla_composicion_detalle_armado'),
                tbody_detalle_armado = tbl_armado !== null ? tbl_armado.getElementsByClassName('cls_tbody_detalle_armado')[0] : null,
                arr_btn_confirmar_cantidad_recibida = tbody_detalle_armado !== null ? Array.from(tbody_detalle_armado.getElementsByClassName('cls_btn_cantidad_recibida')) : [],
                btn_print_all_colgador = tbl_armado !== null ? tbl_armado.getElementsByClassName('cls_btn_print_all')[0] : null,
                arr_btn_print_colgador = tbl_armado !== null ? Array.from(tbl_armado.getElementsByClassName('cls_btn_print')) : [],
                arr_txt_cantidad_encontrados = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_inputs_soloenteros')),
                tbody_colgadordetalle_codigotela = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_colgadordetalle_codigotela')[0],
                arr_btn_verfoto_codigotela = (tbody_colgadordetalle_codigotela !== undefined && tbody_colgadordetalle_codigotela !== null) ? Array.from(tbody_colgadordetalle_codigotela.getElementsByClassName('cls_btn_ver_foto')) : [],
                div_contendor_fotos_descripcion = _('div_contenedordetalle_fotos_descripcion'),
                arr_btn_verfoto_descripcion = (div_contendor_fotos_descripcion !== undefined && div_contendor_fotos_descripcion !== null) ? Array.from(div_contendor_fotos_descripcion.getElementsByClassName('cls_btn_ver_foto')) : [];

            //// autoNumeric = ESTA FUNCION INVALIDA EL EVENTO CHANGE POR ESO NO LO USE AQUI
            arr_new_colgador.forEach(x => x.addEventListener('click', e => { fn_new_colgador(e); }));
            arr_txt_cantidad_colgadores_generados.forEach(x => x.addEventListener('change', e => { fn_tbl_change_calculo_stockalmacen(e); }));
            arr_txt_cantidad_entregar_comercial.forEach(x => x.addEventListener('change', e => { fn_tbl_change_calculo_stockalmacen(e); }));
            array_txt_codigotela_x_operador.forEach(x => x.addEventListener('keypress', e => {
                if (e.keyCode === 13) {
                    let o = e.currentTarget;
                    fn_keypress_codigotela_encontrado_x_operador(o);
                }
            }));
            arr_btn_delete_telas_encontradas.forEach(x => {
                x.addEventListener('click', fn_delete_codigotelawts, false);
            });
            arr_btn_confirmar_cantidad_recibida.forEach(x => x.addEventListener('click', e => { fn_confirmar_cantidad_recibida(e); }));
            if (btn_print_all_colgador !== null) {
                btn_print_all_colgador.addEventListener('click', e => { let o = e.currentTarget; fn_print_colgadores(o, 'all'); });
            }
            
            arr_btn_print_colgador.forEach(x => {
                x.addEventListener('click', e => { let o = e.currentTarget; fn_print_colgadores(o, 'one'); });
            });

            if (arr_btn_verfoto_codigotela.length > 0) {
                arr_btn_verfoto_codigotela.forEach(x => x.addEventListener('click', e => { fn_ver_foto_x_item_codigotela(e); }));
            }

            if (arr_btn_verfoto_descripcion.length > 0) {
                arr_btn_verfoto_descripcion.forEach(x => x.addEventListener('click', e => { fn_ver_foto_descripcion(e); }));
            }
        }

        function fn_ver_foto_descripcion(e) {
            let o = e.currentTarget, div_img = o.parentNode, img = div_img.getElementsByClassName('img-responsive')[0], src = img.getAttribute('src'),
                width = 900, height = 403, width_img = '', height_img = '';

            if (screen.width === 800 && screen.height === 600) {
                width = 900;
                height = 450;
                width_img = 550;
                height_img = 260;
            } else if (screen.width === 1024 && screen.height === 768) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1152 && screen.height === 864) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1280 && screen.height === 600) {
                width = 700;
                height = 400;
                width_img = 600;
                height_img = 230;
            } else if (screen.width === 1280 && screen.height === 720) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 768) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 800) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 430;
            } else if (screen.width === 1280 && screen.height === 960) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1280 && screen.height === 1024) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1360 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1366 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1400 && screen.height === 1050) {
                width = 800;
                height = 800;
                width_img = 700;
                height_img = 610;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1600 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;

            } else if (screen.width === 1680 && screen.height === 1050) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1920 && screen.height === 1080) {
                width = 900;
                height = 800;
                width_img = 800;
                height_img = 630;
            }

            let par_src = _subparameterEncode(src);

            _modalBody({
                url: 'DesarrolloTextil/SolicitudColgador/_VerFotoColgador',
                ventana: '_VerFotoColgador',
                titulo: 'Ver Foto',
                parametro: `src:${par_src},width_img:${width_img},height_img:${height_img}`,
                ancho: width,
                alto: height,
                responsive: 'modal-lg'
            });
        }

        function fn_ver_foto_x_item_codigotela(e) {
            let o = e.currentTarget, div_img = o.parentNode, img = div_img.getElementsByClassName('cls_img_imagen_colgador')[0], src = img.getAttribute('src'),
                width = 900, height = 403, width_img = '', height_img = '';

            if (screen.width === 800 && screen.height === 600) {
                width = 900;
                height = 450;
                width_img = 550;
                height_img = 260;
            } else if (screen.width === 1024 && screen.height === 768) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1152 && screen.height === 864) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1280 && screen.height === 600) {
                width = 700;
                height = 400;
                width_img = 600;
                height_img = 230;
            } else if (screen.width === 1280 && screen.height === 720) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 768) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 800) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 430;
            } else if (screen.width === 1280 && screen.height === 960) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1280 && screen.height === 1024) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1360 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1366 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1400 && screen.height === 1050) {
                width = 800;
                height = 800;
                width_img = 700;
                height_img = 610;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1600 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;

            } else if (screen.width === 1680 && screen.height === 1050) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1920 && screen.height === 1080) {
                width = 900;
                height = 800;
                width_img = 800;
                height_img = 630;
            }

            let par_src = _subparameterEncode(src);

            _modalBody({
                url: 'DesarrolloTextil/SolicitudColgador/_VerFotoColgador',
                ventana: '_VerFotoColgador',
                titulo: 'Ver Foto',
                parametro: `src:${par_src},width_img:${width_img},height_img:${height_img}`,
                ancho: width,
                alto: height,
                responsive: 'modal-lg'
            });
        }

        function fn_print_colgadores(o, print_all) {
            let idsolicitud = _('hf_idsolicitudatx_index').value,
                parametro = `idsolicitud:${idsolicitud},tipobusqueda:armado`, url = '',
                fila = o.parentNode.parentNode,
                datapar = fila.getAttribute('data-par'), idcolgadorsolicituddetalle_codigogenerado = _par(datapar, 'idcolgadorsolicituddetalle_codigogenerado');
            if (print_all === 'all') {
                url = urlBase() + 'DesarrolloTextil/SolicitudColgador/ColgadorImprimir?par=' + parametro
                window.open(url);
            } else {
                parametro = `idsolicitud:${idsolicitud},tipobusqueda:armado,idcolgadorsolicituddetalle_codigogenerado:${idcolgadorsolicituddetalle_codigogenerado}`
                url = urlBase() + 'DesarrolloTextil/SolicitudColgador/ColgadorImprimir?par=' + parametro
                window.open(url);
            }
        }

        function fn_handler_tabla_armado_despues_confirmar_cantidad_recibida() {
            
            let arr_new_colgador = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_new_colgador')),
                arr_txt_cantidad_colgadores_generados = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_cantidad_colgadores_generados')),
                arr_txt_cantidad_entregar_comercial = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_cantidad_entregar_comercial')),
                tbody_detalle_armado = _('tabla_composicion_detalle_armado').getElementsByClassName('cls_tbody_detalle_armado')[0],
                arr_btn_confirmar_cantidad_recibida = Array.from(tbody_detalle_armado.getElementsByClassName('cls_btn_cantidad_recibida')); //cls_btn_cantidad_recibida;

            arr_new_colgador.forEach(x => x.addEventListener('click', e => { fn_new_colgador(e); }));
            arr_txt_cantidad_colgadores_generados.forEach(x => x.addEventListener('change', e => { fn_tbl_change_calculo_stockalmacen(e); }));
            arr_txt_cantidad_entregar_comercial.forEach(x => x.addEventListener('change', e => { fn_tbl_change_calculo_stockalmacen(e); }));
            arr_btn_confirmar_cantidad_recibida.forEach(x => x.addEventListener('click', e => { fn_confirmar_cantidad_recibida(e); }));
        }

        function fn_confirmar_cantidad_recibida(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode.parentNode.parentNode, txtcantidad_recibida = fila.getElementsByClassName('cls_cantidad_recibida')[0],
                datapar = fila.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                url = 'DesarrolloTextil/SolicitudColgador/ConfirmarCantidadRecibida_Colgadores', frm = new FormData(),
                idsolicitud = _('hf_idsolicitudatx_index').value, nrocolgadores = fila.getElementsByClassName('cls_td_nrocolgadores')[0].innerText,
                resumen_cantidadcolgadoresrecibidos = txtcantidad_recibida.value.replace(/,/gi, ''),
                parametro = { idsolicitud: idsolicitud, idcolgadorsolicituddetalle: idcolgadorsolicituddetalle, nrocolgadores: nrocolgadores, resumen_cantidadcolgadoresrecibidos: resumen_cantidadcolgadoresrecibidos };

            frm.append("parhead", JSON.stringify(parametro));

            swal({
                title: "Está seguro de confirmar la cantidad de colgadores?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function (result) {
                if (result) {
                    _Post(url, frm, true)
                        .then((data) => {
                            let odata = data !== '' ? JSON.parse(data) : null;
                            if (odata) {
                                let odata_data = odata.data !== '' ? JSON.parse(odata.data) : null;
                                cargar_tabla_armado_despues_confirmar_cantidadrecibida(odata_data);
                            }
                        });
                }
            });
        }

        function cargar_tabla_armado_despues_confirmar_cantidadrecibida(odata) {
            let html_body = '', detalle_solicitud_colgador = odata[0].detalle_solicitud_colgador !== '' ? CSVtoJSON(odata[0].detalle_solicitud_colgador) : null,
                tbl_armado = _('tabla_composicion_detalle_armado'),
                tbody = tbl_armado !== null ? tbl_armado.getElementsByClassName('cls_tbody_detalle_armado')[0] : null;

            if (detalle_solicitud_colgador) {
                if (tbody !== null) {
                    tbody.innerHTML = '';
                    detalle_solicitud_colgador.forEach(x => {
                        let html_codigotelagenerado = sub_fn_details_codigotelagenerado(odata[0], x.idcolgadorsolicituddetalle, x.estadocantidadcolgadoresrecibidos_confirmados),
                            cadena_disabled_confirmar_cantidad = x.estadocantidadcolgadoresrecibidos_confirmados === '1' ? 'disabled' : '';
                        html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle}'>
                                    <td>${x.nombreproveedor}</td>
                                    <td class='cls_td_nrocolgadores'>${x.nrocolgadores}</td>
                                    <td class='text-center'>${x.comentario}</td>
                                    <td class='text-center'>
                                        <div class='input-group'>
                                            <input type='text' class='form-control cls_cantidad_recibida' value='${x.resumen_cantidadcolgadoresrecibidos}' ${cadena_disabled_confirmar_cantidad}/>
                                            <div class='input-group-btn'>
                                                <button type='button' class='btn btn-primary cls_btn_cantidad_recibida' ${cadena_disabled_confirmar_cantidad}>
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                        <span class="spn_error_cantidad_recibida has-error hide">Falta confirmar la cantidad recibida</span>
                                    </td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>-</td>
                                    <td class='text-center'>${x.usuarioactualizacionoperador}</td>
                                </tr>
                                ${html_codigotelagenerado}
                            `;
                    });
                    tbody.innerHTML = html_body;
                    fn_handler_tabla_armado_despues_confirmar_cantidad_recibida();
                }
            }
        }

        function grabar_telas_marcadas_existentes_x_operador(existetela, pidcolgadorsolicituddetalle) {
            let arr_filas = Array.from(_('tabla_composicion_detalle').rows), url = 'DesarrolloTextil/SolicitudColgador/grabar_telas_encontradas_x_operador',
                idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index').value, idsolicitud = _('hf_idsolicitudatx_index').value;

            let fn_arr_colgadordetalle = (parr_filas) => {
                let arr_colgadores_return = [];
                parr_filas.some(x => {
                    let datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle');
                    if (idcolgadorsolicituddetalle === pidcolgadorsolicituddetalle) {
                        let obj = {}, datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                            codigotela = x.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(),
                            descripciontela = x.getElementsByClassName('cls_td_nombretela')[0].innerText.trim(),
                            nrocolgadores = 1;
                        obj.idcolgadorsolicituddetalle = idcolgadorsolicituddetalle;
                        obj.codigotela = codigotela;
                        obj.descripciontela = descripciontela;
                        obj.nrocolgadores = nrocolgadores;
                        obj.tipobusqueda = 'codigotela';
                        obj.existetela = existetela === true ? '1' : '0';

                        arr_colgadores_return.push(obj);

                        return true;
                    }
                });

                return arr_colgadores_return;
            }

            let arr_colgadores_parametro = fn_arr_colgadordetalle(arr_filas), par = { idcolgadorsolicitud: idcolgadorsolicitud, idsolicitud: idsolicitud, tipobusqueda: 'codigotela', colgadores: arr_colgadores_parametro },
                frm = new FormData();

            frm.append("parhead", JSON.stringify(par));

            _Post(url, frm, true)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata) {
                        //// REFRESCAR LA TABLA DE DESCRIPCION
                        let odata_data = odata.data !== '' ? CSVtoJSON(odata.data) : null;
                        fn_refrescar_tabla_colgadordetalle_codigotela(odata_data);
                    }
                });
        }

        function fn_refrescar_tabla_colgadordetalle_codigotela(odata) {
            let html_body = '',
                tbody = _('tabla_composicion_detalle').getElementsByClassName('cls_tbody_colgadordetalle_codigotela')[0];

            //// LIMPIAMOS PARA VOLVER A CARGAR LA TABLA DESPUES DE GRABAR
            tbody.innerHTML = '';

            if (odata) {
                odata.forEach(x => {
                    //// /Content/upload/
                    let valor_existe = x.existetela, chk_checked = valor_existe === '1' ? 'checked' : '',
                        ruta_imagen = x.imagenwebcolgador !== '' ? 'http://wts-fileserver/erp/textileanalysis/SolicitudColgador/FotosColgador/' + x.imagenwebcolgador : 'http://WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg';
                    html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle}'>
                                    <td class='cls_td_imagencolgador'>
                                        <div style='width:100%;'>
                                            <img class='img-thumbnail cls_img_imagen_colgador' src='${ruta_imagen}' width='100' height='80'/>
                                            <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto' style='cursor:pointer !important;'></span>
                                        </div>
                                    </td>
                                    <td class='cls_td_codigotela'>${x.codigotela}</td>
                                    <td class='cls_td_nombretela'>${x.descripciontela}</td>
                                    <td class='text-center'>
                                        <label>
                                            <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                                <input type='checkbox' class ='i-checks _clscheck_estado_existe' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="${valor_existe}" data-valor="" ${chk_checked} />&nbsp
                                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            `;
                });

                tbody.innerHTML = html_body;
                handler_tbl_telas_existe_despues_de_actualizar_codigotela();
            }
        }

        function handler_tbl_telas_existe_despues_de_actualizar_codigotela() {
            let tbody = _('tabla_composicion_detalle').getElementsByClassName('cls_tbody_colgadordetalle_codigotela')[0];

            $("#tabla_composicion_detalle .i-checks._clscheck_estado_existe").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on("ifChanged", function (e) {
                let o = e.currentTarget, fila = o.parentNode.parentNode.parentNode.parentNode.parentNode,
                    datapar = fila.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle');
                if (e.currentTarget.checked === true) {
                    grabar_telas_marcadas_existentes_x_operador(true, idcolgadorsolicituddetalle);
                } else {
                    grabar_telas_marcadas_existentes_x_operador(false, idcolgadorsolicituddetalle);
                }
            });

            let tbody_colgadordetalle_codigotela = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_colgadordetalle_codigotela')[0],
                arr_btn_verfoto_codigotela = (tbody_colgadordetalle_codigotela !== undefined && tbody_colgadordetalle_codigotela !== null) ? Array.from(tbody_colgadordetalle_codigotela.getElementsByClassName('cls_btn_ver_foto')) : [];

            if (arr_btn_verfoto_codigotela.length > 0) {
                arr_btn_verfoto_codigotela.forEach(x => x.addEventListener('click', e => { fn_ver_foto_x_item_codigotela(e); }));
            }
        }

        function fn_keypress_codigotela_encontrado_x_operador(o) {
            //let o = e.currentTarget;

            let html = '', tbody = _('tbody_codigotela'), txtcodigotela = o, codigotela = txtcodigotela.value,
                parametro = { codigotela_o_descripcion: codigotela },
                url = 'DesarrolloTextil/SolicitudColgador/GetCodigoTelaWts?par=' + JSON.stringify(parametro);

            if (codigotela.length < 5) {
                _swal({ estado: 'error', mensaje: 'Ingrese al menos 4 digitos para seleccionar la tela...!' });
                return false;
            }

            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : null;
                    if (odata) {
                        if (odata.length > 1) {
                            // VER VENTANA DE CODIGOS DE TELAS COINCIDENTES
                            _modalBody({
                                url: 'DesarrolloTextil/SolicitudColgador/_SeleccionarCodigoTelaWts',
                                ventana: '_SeleccionarCodigoTela',
                                titulo: 'Seleccionar Codigo Tela',
                                parametro: `codigotela_o_descripcion:${codigotela},invocadopor:index`,
                                ancho: '',
                                alto: '',
                                responsive: 'modal-lg'
                            });
                        } else {
                            // PINTAR LA TABLA DE CODIGOS DE TELAS WTS
                            llenartabla_codigotela_new(odata);
                        }
                    }
                });
        }

        function llenartabla_codigotela_new(data) {
            let tbody = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0],
                txtcodigotela = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_codigotela_wts_encontrado_x_operador')[0],
                html = '', arr_filas = (tbody !== undefined && tbody !== null) ? Array.from(tbody.rows) : [];
            
            //// VALIDAR
            //if (validar_antes_agregar_tela(data) === false) {
            //    return false;
            //}

            let rpta_validacion = validar_antes_agregar_tela(data);

            if (rpta_validacion.existen_codigotela_repetidos) {
                swal({
                    title: "Existen códigos de tela ya agregados, \n Deseas agregar de todos modos?",
                    text: rpta_validacion.mensaje,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true
                }, function (result) {
                        if (result) {
                            //// EXISTENTES
                            if (rpta_validacion.arr_codigos_existentes.length > 0) {
                                rpta_validacion.arr_codigos_existentes.forEach(x => {
                                    arr_filas.some(y => {
                                        let codigotela_tbl = y.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(), codigotela_data = x.codigotela;
                                        if (codigotela_tbl.trim() === codigotela_data.trim()) {
                                            //// AUMENTAR NRO COLGADORES
                                            let txtnrocolgadores = y.getElementsByClassName('cls_txt_cantidadcolgadores')[0],
                                                nrocolgadores = txtnrocolgadores.value !== '' ? parseInt(txtnrocolgadores.value) : 0,
                                                nuevovalor_nrocolgadores = nrocolgadores + 1;
                                            txtnrocolgadores.value = nuevovalor_nrocolgadores;
                                            return true;
                                        }
                                    });
                                });
                            }
                            //// NUEVOS
                            if (rpta_validacion.arr_codigos_nuevos.length > 0) {
                                rpta_validacion.arr_codigos_nuevos.forEach(x => {
                                    html += `
                                        <tr data-par='idcolgadorsolicituddetalle:0,idanalisistextil:${x.idanalisistextil}'>
                                            <td class='text-center' style='vertical-align: middle;'>
                                                <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                                    <span class='fa fa-trash-o'></span>
                                                </button>
                                            </td>
                                            <td class='cls_td_codigotela'>
                                                ${x.codigotela}
                                            </td>
                                            <td class='cls_td_nombretela'>
                                                ${x.nombretela}
                                            </td>
                                            <td>
                                                <input type='text' class='form-control cls_txt_cantidadcolgadores' value='1' />
                                                <span class="spn_error_cantidadcolgadores_encontrados has-error hide">Falta Ingresar la Cantidad de Colgadores</span>
                                            </td>
                                            <td class=''>
                                                <label>
                                                    <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                                        <input type='checkbox' class ='i-checks _clscheck_estado_existe' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="1" data-valor="" checked />&nbsp
                                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                                    </div>
                                                </label>
                                            </td>
                                        </tr>
                                    `;
                                });
                                
                                tbody.insertAdjacentHTML('beforeend', html);
                                let indicefila = tbody.rows.length - 1;
                                handler_tbl_codigotela_new(indicefila, tbody);
                            }

                            //// ACA GRABAR Y REFRESCAR LOS COLGADORES ENCONTRADOS POR EL OPERADOR
                            grabar_telas_encontradas_x_operador()
                            txtcodigotela.value = '';
                            txtcodigotela.focus();
                    }
                });
            } else {
                //// AGREGAR A LA TABLA
                //// NUEVOS
                if (rpta_validacion.arr_codigos_nuevos.length > 0) {
                    rpta_validacion.arr_codigos_nuevos.forEach(x => {
                        html += `
                            <tr data-par='idcolgadorsolicituddetalle:0,idanalisistextil:${x.idanalisistextil}'>
                                <td class='text-center' style='vertical-align: middle;'>
                                    <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td class='cls_td_codigotela'>
                                    ${x.codigotela}
                                </td>
                                <td class='cls_td_nombretela'>
                                    ${x.nombretela}
                                </td>
                                <td>
                                    <input type='text' class='form-control cls_txt_cantidadcolgadores' value='1' />
                                    <span class="spn_error_cantidadcolgadores_encontrados has-error hide">Falta Ingresar la Cantidad de Colgadores</span>
                                </td>
                                <td class=''>
                                    <label>
                                        <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                            <input type='checkbox' class ='i-checks _clscheck_estado_existe' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="1" data-valor="" checked />&nbsp
                                                <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                        </div>
                                    </label>
                                </td>
                            </tr>
                        `;
                    });
                    

                    tbody.insertAdjacentHTML('beforeend', html);
                    let indicefila = tbody.rows.length - 1;
                    handler_tbl_codigotela_new(indicefila, tbody);
                }

                //// ACA GRABAR Y REFRESCAR LOS COLGADORES ENCONTRADOS POR EL OPERADOR
                grabar_telas_encontradas_x_operador()
                txtcodigotela.value = '';
                txtcodigotela.focus();
            }
        }

        function grabar_telas_encontradas_x_operador() {
            let tbody = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0],
                arr_filas = Array.from(tbody.rows), url = 'DesarrolloTextil/SolicitudColgador/grabar_telas_encontradas_x_operador',
                idcolgadorsolicitud = _('hf_idcolgadorsolicitud_index').value, idsolicitud = _('hf_idsolicitudatx_index').value;

            let fn_arr_colgadordetalle = (parr_filas) => {
                let arr_colgadores_return = [];
                parr_filas.forEach(x => {
                    let obj = {}, datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                        codigotela = x.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(),
                        descripciontela = x.getElementsByClassName('cls_td_nombretela')[0].innerText.trim(),
                        nrocolgadores = x.getElementsByClassName('cls_txt_cantidadcolgadores')[0].value, idanalisistextil = _par(datapar, 'idanalisistextil');
                    obj.idcolgadorsolicituddetalle = idcolgadorsolicituddetalle;
                    obj.codigotela = codigotela;
                    obj.descripciontela = descripciontela;
                    obj.nrocolgadores = nrocolgadores;
                    obj.tipobusqueda = 'descripcion';
                    obj.existetela = '1';
                    obj.idanalisistextil = idanalisistextil;

                    arr_colgadores_return.push(obj);
                });

                return arr_colgadores_return;
            }

            let arr_colgadores_parametro = fn_arr_colgadordetalle(arr_filas), par = { idcolgadorsolicitud: idcolgadorsolicitud, idsolicitud: idsolicitud, tipobusqueda: 'descripcion', colgadores: arr_colgadores_parametro },
                frm = new FormData();

            frm.append("parhead", JSON.stringify(par));

            _Post(url, frm, true)
                .then((data) => {
                    let odata = data !== '' ? JSON.parse(data) : null;
                    if (odata) {
                        //// REFRESCAR LA TABLA DE DESCRIPCION
                        let odata_data = odata.data !== '' ? CSVtoJSON(odata.data) : null;
                        fn_refrescar_tabla_colgadordetalle_descripcion(odata_data);
                    }
                });
        }

        function fn_refrescar_tabla_colgadordetalle_descripcion(odata) {
            let html_body = '',
                tbody = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0];

            //// LIMPIAMOS PARA VOLVER A CARGAR LA TABLA DESPUES DE GRABAR
            tbody.innerHTML = '';

            if (odata) {
                odata.forEach(x => {
                    html_body += `
                                <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idanalisistextil:${x.idanalisistextil}'>
                                    <td class='text-center'>
                                        <button type='button' class='btn btn-xs btn-danger btn_delete' title='Eliminar'>
                                            <span class='fa fa-trash'></span>
                                        </button>
                                    </td>
                                    <td class='cls_td_codigotela'>${x.codigotela}</td>
                                    <td class='cls_td_nombretela'>${x.descripciontela}</td>
                                    <td>
                                        <input type='text' class='form-control cls_txt_cantidadcolgadores' value='${x.nrocolgadores}' />
                                        <span class="spn_error_cantidadcolgadores_encontrados has-error hide">Falta Ingresar la Cantidad de Colgadores</span>
                                    </td>
                                    <td class='text-center'>
                                        <label>
                                            <div class ='icheckbox_square-green _clsdiv_chk_estado_existe' style='position: relative;'>
                                                <input type='checkbox' class ='i-checks _clscheck_estado_existe' style='position: absolute; opacity: 0;' name='_chk_estado_existe' value="1" data-valor="" checked="checked" disabled="disabled" />&nbsp
                                                    <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                            </div>
                                        </label>
                                    </td>
                                </tr>
                            `;
                });

                tbody.innerHTML = html_body;
                handler_tbl_telas_encontradas_x_operador();
            }
        }

        function handler_tbl_telas_encontradas_x_operador() {
            let tbody = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0],
                arr_btn_delete = Array.from(tbody.getElementsByClassName('btn_delete'));

            $("#tabla_composicion_detalle_encontrado_x_operador .i-checks._clscheck_estado_existe").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            arr_btn_delete.forEach(x => {
                x.addEventListener('click', fn_delete_codigotelawts, false);
            });
        }

        function handler_tbl_codigotela_new(indicefila, tbody) {
            let fila = tbody.rows[indicefila];
            fila.getElementsByClassName('cls_btn_delete')[0].addEventListener('click', fn_delete_codigotelawts, false);
        }

        function fn_delete_codigotelawts(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);

            //// GRABAR Y REFRESCAR LA TABLA DE COLGADORES ENCONTRADOS
            grabar_telas_encontradas_x_operador();
        }

        function validar_antes_agregar_tela(data) {
            let tbody = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_tbody_telas_encontradas_x_operador')[0],
                arr_codigotela_tbl = [], mensaje = '', arr_filas = (tbody !== undefined && tbody !== null) ? Array.from(tbody.rows) : [],
                pasavalidacion = true, existen_codigotela_repetidos = false,
                obj_rpta = { existen_codigotela_repetidos: false, mensaje: '' }, arr_codigos_existentes = [], arr_codigos_nuevos = [];
            arr_filas.forEach((x) => {
                let codigotela = x.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(), obj = { codigotela: codigotela };
                arr_codigotela_tbl.push(obj);
            });

            // VALIDAR 
            if (arr_codigotela_tbl.length > 0) {
                data.forEach((x) => {
                    let filter = arr_codigotela_tbl.filter((i) => i.codigotela.trim() === x.codigotela.trim());
                    if (filter.length > 0) {
                        existen_codigotela_repetidos = true;
                        mensaje += `- El codigo de tela ${x.codigotela} ya se agrego. \n`;
                        arr_codigos_existentes.push({ codigotela: x.codigotela.trim() });
                    } else {
                        arr_codigos_nuevos.push(x);
                    }
                });
            } else {
                data.forEach((x) => {
                    arr_codigos_nuevos.push(x);
                });
            }

            if (existen_codigotela_repetidos) {
                obj_rpta.existen_codigotela_repetidos = existen_codigotela_repetidos;
                obj_rpta.mensaje = mensaje;
            }

            obj_rpta.arr_codigos_existentes = arr_codigos_existentes;
            obj_rpta.arr_codigos_nuevos = arr_codigos_nuevos;
            //if (mensaje !== '') {
            //    pasavalidacion = false;
            //    _swal({ estado: 'error', mensaje: mensaje });
            //}

            return obj_rpta;
        }

        function fn_tbl_change_calculo_stockalmacen(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode,
                txtcantidadcolgadoresgenerados = fila.getElementsByClassName('cls_txt_cantidad_colgadores_generados')[0],
                txt_cantidad_entregar_comercial = fila.getElementsByClassName('cls_txt_cantidad_entregar_comercial')[0],
                valor_q_colgadores_generados = txtcantidadcolgadoresgenerados.value !== '' ? parseInt(txtcantidadcolgadoresgenerados.value.replace(/,/gi, '')) : 0,
                valor_q_colgadores_entregar_comercial = txt_cantidad_entregar_comercial.value !== '' ? parseInt(txt_cantidad_entregar_comercial.value.replace(/,/gi, '')) : 0,
                total_stock = valor_q_colgadores_generados - valor_q_colgadores_entregar_comercial,
                td_stock_almacen = fila.getElementsByClassName('cls_td_stockalmacen_guardar')[0];

            td_stock_almacen.innerText = total_stock;
        }

        function seleccionar_todos_colgadores_recibidos(checked) {
            let arr_chk = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('_clscheck_estado_recibido'));
            arr_chk.forEach(x => {
                x.checked = checked;
                if (checked) {
                    x.parentNode.classList.add('checked');
                } else {
                    x.parentNode.classList.remove('checked');
                }
            });
        }

        function fn_new_colgador(e) {
            let o = e.currentTarget, idsolicitud = $('#hf_idsolicitudatx_index').val(), idanalisistextilsolicitud = $('#hf_idanalisistextilsolicitud_index').val(),
                estadoactual = 'EN', accion = null, fila = o.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                idatx = _par(datapar, 'idanalisistextil_idtela'), codigotela_generado = _par(datapar, 'codigotela_generado'),
                idcolgadorsolicituddetalle_codigogenerado = _par(datapar, 'idcolgadorsolicituddetalle_codigogenerado'), idservicio = _('hf_idservicio').value,
                finalizaratx = '',
                txtpar_solicitudatx_index = _('txtpar_solicitudatx_index').value.replace(/,/g, '~').replace(/:/g, '▼'),
                escolgador = 'escolgador',
                datapar_link = o.getAttribute('data-par'), disabled_link = _par(datapar_link, 'disabled');

            if (disabled_link === 'disabled') {
                _swal({ mensaje: 'Confirme primero la cantidad recibida', estado: 'error' });
                return false;
            }

            idatx = idatx === '' ? '0' : idatx;

            if (estadoactual === 'EN') {
                if (idatx === '0') {
                    accion = 'new'
                } else {
                    accion = 'edit'
                }
                //let parametro = `accion:${accion},idsolicitud:${idsolicitud},idanalisistextilsolicitud:0,idatx:${idatx},estadoactual:${estadoactual},escolgador:si,idcolgadorsolicituddetalle_codigogenerado:${idcolgadorsolicituddetalle_codigogenerado},idservicio:${idservicio}`;
                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, finalizaratx, txtpar_solicitudatx_index, escolgador, idcolgadorsolicituddetalle_codigogenerado, idservicio, '');
                //fn_open_view_editaratx_colgador(parametro);
            }
        }

        function handler_scanner_barcode() {
            ////preventDefault: true,  // LE QUITE ESTO PORQUE ME BLOQUEABA TODOS LOS INPUTS
            $(document).scannerDetection({
                timeBeforeScanTest: 200, // wait for the next character for upto 200ms
                avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
                minLength: 4,  // POR DEFECTO SI NO SE PONE ESTA CONFIGURACION ES DE 6 DIGITOS
                onComplete: function (barcode, qty) {
                    let txt_codigotela_encontrado_x_operador = _('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_txt_codigotela_wts_encontrado_x_operador')[0];
                    txt_codigotela_encontrado_x_operador.value = barcode;
                    fn_keypress_codigotela_encontrado_x_operador(txt_codigotela_encontrado_x_operador);
                    ////_('txtbarcode').value = barcode;
                    //if (ovariables.idsolicitud !== barcode) {
                    //    _('hf_chk_solicitudrecibida').value = '0';
                    //    _('_btn_check_solicitudrecibida').classList.remove('btn-success');
                    //    _('_span_check_solicitudrecibida').classList.remove('fa-check');
                    //    _('_btn_check_solicitudrecibida').classList.add('btn-danger');
                    //    _('_span_check_solicitudrecibida').classList.add('fa-remove');
                    //    swal({
                    //        text: 'El documento no corresponde con la solicitud seleccionada',
                    //        type: 'warning',
                    //        title: ''
                    //    }, function (result) {
                    //        if (result) {
                    //            _('txtbarcode').value = '';
                    //        }
                    //    });
                    //} else {
                    //    _('hf_chk_solicitudrecibida').value = '1';
                    //    _('_btn_check_solicitudrecibida').classList.remove('btn-danger');
                    //    _('_span_check_solicitudrecibida').classList.remove('fa-remove');
                    //    _('_btn_check_solicitudrecibida').classList.add('btn-success');
                    //    _('_span_check_solicitudrecibida').classList.add('fa-check');
                    //}
                }
            });
        }

        /*/////////////////////////////////*/
        /*// Jacob - Funciones agregadas //*/
        /*/////////////////////////////////*/

        function fn_NuevaSolicitudCotizar() {
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:new,vista:1');
        }

        //// SOLO ES PARA EL MOCKUP COTIZACION
        function fn_NuevaSolicitudCotizar_colgador() {
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:new,vista:1,cotizar_colgador:1');
        }

        function fn_NuevaCotizacion(_id) {
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:new,vista:1,id:' + _id);
        }

        function fn_EditarCotizacion(_id) {
            let filter = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === _id)[0];
            let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,vista:1,id:' + _id + ',idaux:' + filter.IdSolicitudCotizar);
        }

        function fn_ProcesarCotizacion(_id) {
            //let rowIndex = ovariables.lstDetalle.findIndex(x => x.IdSolicitudDetalle === _id);
            //let rowData = _('tbl_solicitud_cotizar').children[1].children[rowIndex].children[4].getAttribute("data-par");
            let rowData = '';
            let arr = Array.from(_('tbl_solicitud_cotizar').children[1].children);
            arr.forEach(x => {
                let data = x.children[4].getAttribute("data-par");
                if (_parseInt(_par(data, 'idsolicitud_cotizacion')) === _id) {
                    rowData = data;
                }
            });

            let CodigoTela = _par(rowData, 'codigo_tela');
            if (CodigoTela !== '') {
                let urlAccion = 'DesarrolloTextil/CotizarTela/New';
                _Go_Url(urlAccion, urlAccion, 'accion:new2,vista:1,id:' + _id + ',idaux:' + ovariables.lstSolicitud.IdSolicitudCotizar);
            } else {
                swal({ title: "Advertencia", text: "Tienes que crear el Codigo de Tela para poder continuar", type: "warning" });
            }
        }

        function fn_EditarOrdenCotizacion(_id) {
            let IdOrden = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === _id)[0].IdOrden
            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,vista:1,idorden:' + IdOrden);
        }

        function fn_VerOrdenCotizacion(_id) {
            let IdOrden = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === _id)[0].IdOrden
            let urlAccion = 'DesarrolloTextil/CotizarTela/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,vista:1,idorden:' + IdOrden + ',estado:1');
        }

        function fn_HistorialSolicitudCotizar(_id) {
            let urlAccion = 'DesarrolloTextil/CotizarTela/Historial';
            _Go_Url(urlAccion, urlAccion, 'idcotizar:' + _id + ',idsolicitud:' + ovariables.lstSolicitud.IdSolicitud);
        }

        function fn_EnviarSolicitudCotizar(_id) {
            let estado = '';
            if (appSolicitudAtx.ovariables.lstSolicitud.Estado.trim() === 'CR') {
                estado = ovariables.estados.PORAPROBARCONRECHAZO;
            } else {
                estado = ovariables.estados.PORAPROBAR;
            }

            swal({
                html: true,
                title: "Enviar Cotizaciones",
                text: "¿Estas seguro/a que deseas enviar TODAS las Cotizaciones de la Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al enviar las cotizaciones, estas no podran ser editadas o eliminadas</span>",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.lstSolicitud.IdSolicitud,
                        idcotizacion: _id,
                        estado: estado
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('DesarrolloTextil/CotizarTela/GetData_CambiarEstado', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Haz enviado las Cotizaciones con exito", type: "success" });
                            fn_RefreshAndSelect(ovariables.lstSolicitud.IdSolicitud);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_EliminarSolicitudCotizar(_id) {
            swal({
                html: true,
                title: "Eliminar Solicitud",
                text: "¿Estas seguro/a que deseas eliminar Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al eliminar la solicitud, tambien eliminaras todos las cotizaciones relacionadas</span>",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idsolicitud: _id, tipo: 0 };
                _Get('DesarrolloTextil/CotizarTela/Delete_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });
                            fn_RefreshAndSelect(ovariables.lstSolicitud.IdSolicitud);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_EliminarCotizacion(_id) {
            swal({
                html: true,
                title: "Eliminar Cotización",
                text: "¿Estas seguro/a que deseas eliminar la Cotización N°" + _id + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idsolicitud: _id, tipo: 1 };
                _Get('DesarrolloTextil/CotizarTela/Delete_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });
                            fn_RefreshAndSelect(ovariables.lstSolicitud.IdSolicitud);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_AprobarSolicitudCotizar(_id) {
            let estadosolicitud = '';
            if (ovariables.lstSolicitud.Estado.trim() === 'PAP' || ovariables.lstSolicitud.Estado.trim() === 'PAR') {
                estadosolicitud = ovariables.estados.PORASIGNAR;
            } else if (ovariables.lstSolicitud.Estado.trim() === 'PR' || ovariables.lstSolicitud.Estado.trim() === 'PRR') {
                estadosolicitud = ovariables.estados.FINALIZADO;
            }
            _modalBody({
                url: 'DesarrolloTextil/CotizarTela/_AprobarRechazarCotizacion',
                ventana: '_AprobarRechazarCotizacion',
                titulo: 'Aprobar Solicitud',
                parametro: `idsolicitud:${ovariables.lstSolicitud.IdSolicitud},id:${_id},boton:0,estado:${estadosolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        function fn_RechazarSolicitudCotizar(_id) {
            let estadosolicitud = '';
            if (ovariables.lstSolicitud.Finalizar === 1) {
                estadosolicitud = ovariables.estados.POROPERARCONRECHAZO;
            } else {
                estadosolicitud = ovariables.estados.RECHAZADO;
            }
            _modalBody({
                url: 'DesarrolloTextil/CotizarTela/_AprobarRechazarCotizacion',
                ventana: '_AprobarRechazarCotizacion',
                titulo: 'Rechazar Solicitud',
                parametro: `idsolicitud:${ovariables.lstSolicitud.IdSolicitud},id:${_id},boton:1,estado:${estadosolicitud}`,
                alto: '',
                ancho: '',
                responsive: 'modal-lg'
            });
        }

        function fn_AsignarSolicitudCotizar(_id) {
            _modalBody({
                url: 'DesarrolloTextil/CotizarTela/_AsignarCotizacion',
                ventana: '_AsignarCotizacion',
                titulo: 'Asignar Solicitud',
                parametro: `idsolicitud:${ovariables.lstSolicitud.IdSolicitud},id:${_id},estado:${ovariables.estados.POROPERAR}`,
                ancho: '',
                alto: '',
                responsive: 'modal-md'
            });
        }

        function fn_ProcesarSolicitudCotizar(_id) {
            swal({
                html: true,
                title: "Procesar Cotizaciones",
                text: "¿Estas seguro/a que deseas procesar TODAS las cotizaciones de la Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idsolicitud: ovariables.lstSolicitud.IdSolicitud,
                        idcotizacion: _id,
                        estado: ovariables.estados.ENPROCESO
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('DesarrolloTextil/CotizarTela/GetData_CambiarEstado', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                            fn_RefreshAndSelect(ovariables.lstSolicitud.IdSolicitud);
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_FinalizarSolicitudCotizar(_id) {
            if (ovariables.lstSolicitud.Finalizar !== 0) {
                let estadosolicitud = '';
                if (ovariables.lstSolicitud.Rechazado === 2) {
                    estadosolicitud = ovariables.estados.PORREVISARCONRECHAZAO;
                } else {
                    estadosolicitud = ovariables.estados.PORREVISAR;
                }

                swal({
                    html: true,
                    title: "Finalizar Solicitud",
                    text: "¿Estas seguro/a que deseas finalizar la Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idsolicitud: ovariables.lstSolicitud.IdSolicitud,
                            idcotizacion: _id,
                            estado: estadosolicitud
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('DesarrolloTextil/CotizarTela/GetData_CambiarEstado', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                                //refrescarsolicitud_index();
                                fn_RefreshAndSelect(ovariables.lstSolicitud.IdSolicitud);
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "Debes completar completar las Cotizaciones asignadas", type: "warning" });
            }
        }

        // Jacob - DataTable
        function fn_FormatCotizacion() {
            if ($(".no-need").children().children().length === 0) {
                $(".no-need").remove();
            }

            $('#tbl_cotizacion table').DataTable({
                info: false,
                searching: false,
                ordering: false,
                pageLength: 3,
                lengthChange: false,
                "drawCallback": function () {
                    // Solo para finalizados (Reproceso y Duplicado)
                    fn_iCheckCotizacion();
                },
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                }
            });
        }

        // Jacob - Funciones para carga de cotizacion
        function req_CargarCotizacion(_id) {
            let par = _('txtpar_solicitudatx_index').value, estadoresumen = _par(par, 'estado_resumen');
            estadoresumen !== 'finalizado' ? estadoresumen = 3 : estadoresumen = '';
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: _id, estado: estadoresumen };
            _Get('DesarrolloTextil/CotizarTela/Get_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        res_CargarCotizacion(rpta);
                    }
                }, (p) => { err(p); });
        }
        // Jacob - Response
        function res_CargarCotizacion(_json) {
            // Limpiamos ovariables
            ovariables.lstDetalle = [];
            ovariables.lstSolicitud = [];
            ovariables.lstOrden = [];
            ovariables.lstAgregar = [];

            let _jsonSolicitud = _json[0].solicitud !== '' ? JSON.parse(_json[0].solicitud)[0] : [];
            let _jsonDetalle = _json[0].detalle !== '' ? JSON.parse(_json[0].detalle) : [];
            let _jsonOrden = _json[0].orden !== '' ? JSON.parse(_json[0].orden) : [];
            let _jsonBotones = _json[0].botones !== '' ? JSON.parse(_json[0].botones) : [];

            //console.log(_jsonBotones);

            // Guardar en ovariables
            ovariables.lstSolicitud = _jsonSolicitud;
            ovariables.lstDetalle = _jsonDetalle;
            ovariables.lstOrden = _jsonOrden;

            //let btnCabecera = _jsonBotones.filter(x => x.Estado === _jsonSolicitud.Estado.trim() && _parseInt(x.Ubicacion) === 0);
            let btnCabecera = _jsonBotones.filter(x => _parseInt(x.Ubicacion) === 0);

            let creado = '', editado = '', titulo = '', row1 = '', row2 = '', tablaHTML = '', cuerpoHTML = '';

            creado = `<strong>Created: </strong><i class="fa fa-clock-o"></i> ${_jsonSolicitud.FechaCreacion}`;
            editado = `<strong>Edited: </strong><i class="fa fa-clock-o"></i> ${_jsonSolicitud.FechaActualizacion}`;

            titulo = `Solicitud #${_jsonSolicitud.IdSolicitud}`;

            row1 = `<p><span><strong>Solicitante: </strong> ${_jsonSolicitud.UserSolicitante}</span></p>
                    <p><span><strong>Observaciones: </strong> ${_jsonSolicitud.Observaciones}</span></p>`;

            row2 = `<p><span><strong>Analista: </strong> ${_jsonSolicitud.UserOperador}</span></p>
                    <p><span><strong>Total Cotizaciones: </strong> ${_jsonSolicitud.TotalCotizaciones}</span></p>`;

            let botones = (_json, _id, _isTooltip) => {
                let html = '';
                if (_json.length > 0) {
                    _json.forEach(x => {
                        if (_isTooltip === true) {
                            //html += `<button class="btn btn-sm ${x.Clase} custom-tooltip" onclick="appSolicitudAtx.${x.Funcion}(${_id})" style="margin-right: 5px;">
                            //            <span class="data-placement" style="left: 100%; width: 70px;">${x.Titulo}</span>
                            //            <span class="${x.Icono}"></span>
                            //        </button>`;
                            html += `<button class="btn btn-sm ${x.Clase}" onclick="appSolicitudAtx.${x.Funcion}(${_id})" title="${x.Titulo}" style="margin-right: 5px;">
                                        <span class="${x.Icono}"></span>
                                    </button>`;
                        } else {
                            html += `<button class="btn btn-sm ${x.Clase}" onclick="appSolicitudAtx.${x.Funcion}(${_id})" title="${x.Titulo}" style="margin-right: 5px;">
                                        <span class="${x.Icono}"></span>
                                    </button>`;
                        }
                    });
                }
                return html;
            }

            tablaHTML = `<table id="tbl_solicitud_cotizar" class="table table-hover">
                             <thead>
                                <tr>
                                    <th class="no-need"></th>
                                    <th>N°</th>
                                    <th>Cliente</th>
                                    <th>Cliente Temporada</th>
                                    <th>Codigo Tela</th>
                                    <th>N° ATX</th>
                                    <th>Descripción</th>
                                    <th>Trade Name</th>
                                    <th>Division</th>
                                    <th>Rango KG</th>
                                    <th>Modalidad</th>
                                    <th>Comentario</th>
                                </tr>
                             </thead>
                             <tbody>`;
            if (_jsonDetalle.length > 0) {
                _jsonDetalle.forEach(x => {
                    //let btnDetalle = _jsonBotones.filter(y => y.Estado === _jsonSolicitud.Estado.trim() && _parseInt(y.Ubicacion) === 1 && _parseInt(y.Aux) === x.Estado);
                    let btnDetalle = _jsonBotones.filter(y => _parseInt(y.Ubicacion) === 1 && _parseInt(y.Aux) === x.Estado);
                    tablaHTML += `<tr>
                                    <td class="text-center no-need">
                                        <div style="display: flex; width: 70px; margin: 0 20px 0 20px;">
                                            ${botones(btnDetalle, x.IdSolicitudDetalle, true)}
                                        </div>
                                    </td>
                                    <td>${x.IdSolicitudDetalle}</td>
                                    <td>${x.NombreCliente}</td>
                                    <td>${x.CodigoClienteTemporada}</td>
                                    <td class="text-center" data-par="idanalisistextil:${x.IdAnalisisTextil},idsolicitud_cotizacion:${x.IdSolicitudDetalle},codigo_tela:${x.CodigoTela},escodigo_generado:${x.EsCodigoGenerado}">${fn_EnlaceCodigoTelaCotizacion(x.CodigoTela, x.EsCodigoGenerado)}</td>
                                    <td class="text-center">${x.NroATX !== '' ? x.NroATX : '-'}</td>
                                    <td>${x.Descripcion}</td>
                                    <td>${x.TradeName}</td>
                                    <td>${x.Division}</td>
                                    <td>${x.Rango}</td>
                                    <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td>${x.Comentario}</td>
                                </tr>`;
                });
            }
            tablaHTML = tablaHTML + '</tbody></table>';

            cuerpoHTML += `<div class="row">
                                <div class="col-sm-4 text-left" id="divpartida_row1">
                                    ${row1}
                                </div>
                                <div class="col-sm-4 text-left" id="divpartida_row1_2">
                                    ${row2}
                                </div>
                                <div class="col-sm-4 text-left" id="divpartida_row1_3">
                                </div>
                            </div>
                            <div class="table-responsive m-t" id="div_tbl_cotizacion">
                                <h4 class="text-navy"><strong>COTIZACIONES</strong></h4>
                                <hr class="hr-primary hr-line-dashed">
                                <div id="tbl_cotizacion">
                                    ${tablaHTML}
                                </div>
                                <br />
                            </div>`;

            _('div_contenido_cuerpo_solicitud').innerHTML = cuerpoHTML;

            _('divtitulo_1').innerHTML = creado;
            _('divtitulo_2').innerHTML = editado;
            _('titulo_2').innerHTML = titulo;
            _('divbotonera').innerHTML = botones(btnCabecera, _jsonSolicitud.IdSolicitudCotizar, false);

            // Click New Codigo Tela
            let arr_new_codigotela = Array.from(_('div_contenido_cuerpo_solicitud').getElementsByClassName('cls_new_codigotela_cotizacion'));
            arr_new_codigotela.forEach(x => x.addEventListener('click', e => { fn_NuevoCodigoTelaCotizacion(e); }));

            // Datatable
            fn_FormatCotizacion();
        }

        function fn_EnlaceCodigoTelaCotizacion(CodigoTela, EsCodigoGenerado) {
            let html = '', _jsonSolicitud = ovariables.lstSolicitud;
            if (_jsonSolicitud.Estado.trim() === 'EN') {
                if (EsCodigoGenerado === 'SI') {
                    html = CodigoTela + ' <a class="cls_new_codigotela_cotizacion">Edit</a>';
                } else {
                    html = CodigoTela !== '' ? CodigoTela : '<a class="cls_new_codigotela_cotizacion">New</a>';
                }
            } else {
                html = CodigoTela !== '' ? CodigoTela : '-';
            }
            return html;
        }

        function fn_NuevoCodigoTelaCotizacion(e) {
            let o = e.currentTarget,
                idsolicitud = ovariables.lstSolicitud.IdSolicitud,
                idanalisistextilsolicitud = '',
                estadoactual = 'EN',
                accion = null,
                fila = o.parentNode,
                datapar = fila.getAttribute('data-par'),
                idatx = _par(datapar, 'idanalisistextil'),
                idsolicitud_cotizacion = _par(datapar, 'idsolicitud_cotizacion'),
                idcolgadorsolicituddetalle_codigogenerado = _par(datapar, 'idsolicitud_cotizacion'),
                idservicio = ovariables.lstSolicitud.IdServicio,
                finalizaratx = '',
                txtpar_solicitudatx_index = _('txtpar_solicitudatx_index').value.replace(/,/g, '~').replace(/:/g, '▼'),
                escolgador = 'escotizacion';

            idatx = idatx === '' ? '0' : idatx;

            if (estadoactual === 'EN') {
                if (idatx === '0') {
                    accion = 'new'
                } else {
                    accion = 'edit'
                }
                fn_open_view_editaratx(accion, idsolicitud, idanalisistextilsolicitud, idatx, estadoactual, finalizaratx, txtpar_solicitudatx_index, escolgador, idcolgadorsolicituddetalle_codigogenerado, idservicio, idsolicitud_cotizacion);
            }
        }

        function fn_EnviarReproceso() {
            if (ovariables.lstAgregar.length > 0) {
                swal({
                    html: true,
                    title: "Reprocesar Solicitud",
                    text: "¿Estas seguro/a que deseas Reprocesar los registros seleccionados en la Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al reprocesar la solicitud, esta cambiara de estado FINALIZADO a POR ASIGNAR y se guardara los registros anteriores en historial</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            idsolicitud: ovariables.lstSolicitud.IdSolicitud,
                            idcotizacion: ovariables.lstSolicitud.IdSolicitudCotizar,
                            estado: ovariables.estados.PORASIGNAR,
                            reproceso: ovariables.lstAgregar
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('DesarrolloTextil/CotizarTela/EditData_CotizarTelaReprocesar', frm)
                        .then((resultado) => {
                            if (resultado !== '') {
                                swal({ title: "¡Buen Trabajo!", text: "Haz reprocesado la Orden de Cotizacion N°" + ovariables.lstSolicitud.IdSolicitud, type: "success" });
                                refrescarsolicitud_index();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar al menos un registro", type: "warning" });
            }
        }

        function fn_EnviarDuplicado() {
            if (ovariables.lstAgregar.length > 0) {
                swal({
                    html: true,
                    title: "Duplicar Solicitud",
                    text: "¿Estas seguro/a que deseas Duplicar los registros seleccionados de la Solicitud N°" + ovariables.lstSolicitud.IdSolicitud + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al duplicar los registros, se creara una nueva solicitud tomando como base los seleccionados</span>",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let arreglo = 'id';
                    ovariables.lstAgregar.forEach(x => {
                        arreglo += `^${x.id}`;
                    });

                    swal({ title: "¡Buen Trabajo!", text: "Se duplico con exito", type: "success" });

                    let urlAccion = 'DesarrolloTextil/CotizarTela/NuevaSolicitud';
                    _Go_Url(urlAccion, urlAccion, 'accion:duplicate,vista:1,lista:' + arreglo);
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar al menos un registro", type: "warning" });
            }
        }

        function fn_LimpiarBtnsFinalizado() {
            if (_('btnSolicitud_Aceptar')) {
                $('#tbl_cotizacion table').DataTable().destroy();

                _('divbotonera').children[2].disabled = false;
                _('divbotonera').children[3].disabled = false;

                _('btnSolicitud_Cancelar').remove();
                _('btnSolicitud_Aceptar').remove();

                $('.no-need').remove();

                // Se limpia arreglo
                ovariables.lstAgregar = [];

                fn_FormatCotizacion();
            }
        }

        function fn_ReprocesarSolicitudCotizar(_id) {
            // Limpia btns si existe
            fn_LimpiarBtnsFinalizado();

            // Se desactiva Boton Reprocesar
            _('divbotonera').children[0].disabled = true;
            fn_AgregarBtnsFinalizado('Reproceso');
        }

        function fn_DuplicarSolicitudCotizar(_id) {
            // Limpia btns si existe
            fn_LimpiarBtnsFinalizado();

            // Se desactiva Boton Duplicar
            _('divbotonera').children[1].disabled = true;
            fn_AgregarBtnsFinalizado('Duplicado');
        }

        function fn_AgregarBtnsFinalizado(_id) {
            $('#tbl_cotizacion table').DataTable().destroy();

            let tblRows = _('tbl_cotizacion').children[0].children[1].rows.length;
            let thead = _('tbl_cotizacion').children[0].children[0];
            let tbody = _('tbl_cotizacion').children[0].children[1];

            // Se agrega Boton
            _('divbotonera').insertAdjacentHTML('afterbegin', `<button id="btnSolicitud_Cancelar" class="btn btn-sm btn-danger" onclick="appSolicitudAtx.fn_LimpiarBtnsFinalizado()" title="Cancelar">
                                                                <span class="fa fa-ban"></span>
                                                               </button>
                                                               <button id="btnSolicitud_Aceptar" class="btn btn-sm btn-warning" onclick="appSolicitudAtx.fn_Enviar${_id}()" title="Aceptar" style="margin-right: 5px;">
                                                                <span class="fa fa-check"></span>
                                                               </button>`);

            thead.children[0].insertAdjacentHTML('afterbegin', '<th class="no-need"></th>');
            for (let i = 0; i < tblRows; i++) {
                let IdHide = appSolicitudAtx.ovariables.lstDetalle[i].IdSolicitudDetalle;
                // Se agrega Checkbox
                tbody.children[i].insertAdjacentHTML('afterbegin', `<td class="text-center no-need">
                                                                        <div>
                                                                            <input class="i-check" type="checkbox" data-id="${IdHide}" name="radio_cotizacion" />
                                                                        </div>
                                                                    </td>`);
            }

            fn_FormatCotizacion();
        }

        function fn_iCheckCotizacion() {
            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let bool = ovariables.lstAgregar.filter(x => x.id === $(this).data('id')).length;
                if (bool === 0) {
                    let IdHidden = { id: $(this).data('id') };
                    ovariables.lstAgregar.push(IdHidden);
                } else {
                    let filter = ovariables.lstAgregar.filter(x => x.id !== $(this).data('id'));
                    ovariables.lstAgregar = filter;
                }
            });
        }

        function fn_ReporteSolicitudCotizar(_id) {
            let html = '';
            html = `<table border="1">
                        <thead>
                            <tr>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N°</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cliente</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cliente Temporada</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Codigo Tela</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N° ATX</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">% Tela</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Densidad</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Lavado</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">TradeName</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Division</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Modalidad</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Rango</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Familia</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (ovariables.lstDetalle.length > 0) {
                let aux = 0;
                ovariables.lstDetalle.forEach(x => {
                    if (aux === 0) {
                        aux++;
                        html += `<tr>
                                    <td align="center" style="background: #ffffff;">${x.IdSolicitudDetalle}</td>
                                    <td align="center" style="background: #ffffff;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #ffffff;">${x.NroATX}</td>
                                    <td align="left" style="background: #ffffff;">${x.PorcentajeTela}</td>
                                    <td align="left" style="background: #ffffff;">${x.Densidad}</td>   
                                    <td align="left" style="background: #ffffff;">${x.Lavado}</td>
                                    <td align="left" style="background: #ffffff;">${x.TradeName}</td>
                                    <td align="left" style="background: #ffffff;">${x.Division}</td>
                                    <td align="left" style="background: #ffffff;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #ffffff;">${x.Rango}</td>
                                    <td align="left" style="background: #ffffff;">${x.Familia}</td>
                                    <td align="left" style="background: #ffffff;">${x.Descripcion}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td align="center" style="background: #d9d9d9;">${x.IdSolicitudDetalle}</td>
                                    <td align="center" style="background: #d9d9d9;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.NroATX}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.PorcentajeTela}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Densidad}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.Lavado}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.TradeName}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Division}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Rango}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Familia}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Descripcion}</td>
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Solicitud Nro ' + ovariables.lstSolicitud.IdSolicitud,
                style: '',
                table: html,
                filename: 'Reporte Solicitud Nro ' + ovariables.lstSolicitud.IdSolicitud
            });
        }

        function fn_ReporteCotizaciones(_id) {
            let html = '';
            html = `<table border="1">
                        <thead>
                            <tr>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N°</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha de Cotizacion</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cliente</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Temporada</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Titulo</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">N° ATX</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Codigo Tela</th>   
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Familia</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Densidad (oz./Yd.²)</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Ancho Util</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Modalidad</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">RENDIMIENTO m/Kg</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">RENDIMIENTO Yd/Kg</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">PRECIO RESULTANTE US$/Kg.</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">PRECIO RESULTANTE $/m</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">PRECIO RESULTANTE $/Yd</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Dias</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA / ORDEN Kg</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA / ORDEN m</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA/ ORDEN Yd</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA / COLOR Kg</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA/ COLOR m</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">CANTIDAD MÍNIMA / COLOR Yd</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Observaciones</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Recordar</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (ovariables.lstOrden.length > 0) {
                let aux = 0;
                ovariables.lstOrden.forEach(x => {
                    if (aux === 0) {
                        aux++;
                        html += `<tr>
                                    <td align="center" style="background: #ffffff;">${x.IdOrden}</td>
                                    <td align="center" style="background: #ffffff;">${x.FechaCotizacion}</td>
                                    <td align="left" style="background: #ffffff;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #ffffff;">${x.Titulo}</td>
                                    <td align="left" style="background: #ffffff;">${x.ATX}</td>
                                    <td align="left" style="background: #ffffff;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #ffffff;">${x.Familia}</td>   
                                    <td align="left" style="background: #ffffff;">${x.DensidadOzYd}</td>
                                    <td align="left" style="background: #ffffff;">${x.AnchoUtil}</td>
                                    <td align="left" style="background: #ffffff;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #ffffff;">${x.RendimientoMKG}</td>
                                    <td align="left" style="background: #ffffff;">${x.RendimientoYdKg}</td>
                                    <td align="left" style="background: #ffffff;">${x.PrecioResultanteKg}</td>
                                    <td align="left" style="background: #ffffff;">${x.PrecioResultanteM}</td>
                                    <td align="left" style="background: #ffffff;">${x.PrecioResultanteYd}</td>
                                    <td align="left" style="background: #ffffff;">${x.Dias}</td>
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaOrdenKg}</td>
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaOrdenM}</td>
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaOrdenYd}</td>
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaColorKg}</td>
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaColorM}</td>   
                                    <td align="left" style="background: #ffffff;">${x.CantidadMinimaColorYd}</td>
                                    <td align="left" style="background: #ffffff;">${x.Observaciones}</td>   
                                    <td align="left" style="background: #ffffff;">${x.Recordar}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td align="center" style="background: #d9d9d9;">${x.IdOrden}</td>
                                    <td align="center" style="background: #d9d9d9;">${x.FechaCotizacion}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.NombreCliente}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoClienteTemporada}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Titulo}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.ATX}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CodigoTela}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Familia}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.DensidadOzYd}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.AnchoUtil}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.RendimientoMKG}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.RendimientoYdKg}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.PrecioResultanteKg}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.PrecioResultanteM}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.PrecioResultanteYd}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Dias}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaOrdenKg}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaOrdenM}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaOrdenYd}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaColorKg}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaColorM}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.CantidadMinimaColorYd}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.Observaciones}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.Recordar}</td>
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Ordenes - Solicitud Nro ' + ovariables.lstSolicitud.IdSolicitud,
                style: '',
                table: html,
                filename: 'Reporte Ordenes - Solicitud Nro ' + ovariables.lstSolicitud.IdSolicitud
            });
        }

        function fn_RefreshAndSelect(_id) {
            refrescarsolicitud_index();
            setTimeout(function () {
                document.querySelector('li[data-id="' + _id + '"]').click();
                _('tab-1').classList.add('active');
            }, 1000);
        }

        function fn_confirmar_recibircolgaodor(e) {
            let url = 'DesarrolloTextil/SolicitudColgador/GrabarEstadoRecibirColgadores', frm = new FormData(),
                idsolicitud = _('hf_idsolicitudatx_index').value,
                parametro = { idsolicitud: idsolicitud, estado: 'RECIBIDO', idusuario_querecibe: _('hf_idusuario').value };

            frm.append("par", JSON.stringify(parametro));

            swal({
                title: "Está seguro recibir los colgadores?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (result) {
                    if (result) {
                        _Post('DesarrolloTextil/SolicitudColgador/GrabarEstadoRecibirColgadores', frm)
                            .then((rpta) => {
                                let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                                if (orpta) {
                                    _swal({ estado: orpta.estado, mensaje: orpta.mensaje });

                                    if (orpta.id > 0) {
                                        let url_index = 'DesarrolloTextil/Solicitud/Index'
                                        ruteo_bandejamodelo_correo(url_index, idsolicitud, 'divcontenedor_breadcrum');
                                    }
                                }
                            });
                    }
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            req_load_content_init: req_load_content_init,
            fn_editarsolicitud: fn_editarsolicitud,
            fn_enviarsolicitud: fn_enviarsolicitud,
            fn_eliminarsolicitud: fn_eliminarsolicitud,
            fn_nuevasolicitud: fn_nuevasolicitud,
            fn_aprobarsolicitud: fn_aprobarsolicitud,
            fn_rechazarsolicitud: fn_rechazarsolicitud,
            fn_aprobaratx: fn_aprobaratx,
            fn_rechazartx: fn_rechazartx,
            fn_iniciaratx: fn_iniciaratx,
            fn_editaratx: fn_editaratx,
            fn_finalizaratx: fn_finalizaratx,
            fn_imprimiratx: fn_imprimiratx,
            fn_imprimirsolicitudatx: fn_imprimirsolicitudatx,
            fn_cambiarestado: fn_cambiarestado,
            fn_grabarentregablecolgador: fn_grabarentregablecolgador,
            ovariables: ovariables,
            fn_asignarsolicitud: fn_asignarsolicitud,
            fn_open_view_editaratx: fn_open_view_editaratx,
            return_bandeja: return_bandeja,
            getEstado: getEstado,
            fn_nuevasolicitudcolgador: fn_nuevasolicitudcolgador,
            llenartabla_codigotela_new: llenartabla_codigotela_new,
            validar_antes_agregar_tela: validar_antes_agregar_tela,
            fn_confirmar_recibircolgaodor: fn_confirmar_recibircolgaodor,
            //fn_NuevaSolicitudCotizar_colgador: fn_NuevaSolicitudCotizar_colgador,  //// SOLO ES PARA EL MOCKUP DE COTIZACION
            // Jacob
            fn_NuevaSolicitudCotizar: fn_NuevaSolicitudCotizar,
            fn_NuevaCotizacion: fn_NuevaCotizacion,
            fn_EditarCotizacion: fn_EditarCotizacion,
            fn_EliminarCotizacion: fn_EliminarCotizacion,
            fn_EliminarSolicitudCotizar: fn_EliminarSolicitudCotizar,
            fn_EnviarSolicitudCotizar: fn_EnviarSolicitudCotizar,
            fn_AprobarSolicitudCotizar: fn_AprobarSolicitudCotizar,
            fn_RechazarSolicitudCotizar: fn_RechazarSolicitudCotizar,
            fn_AsignarSolicitudCotizar: fn_AsignarSolicitudCotizar,
            fn_ProcesarSolicitudCotizar: fn_ProcesarSolicitudCotizar,
            fn_ProcesarCotizacion: fn_ProcesarCotizacion,
            fn_EditarOrdenCotizacion: fn_EditarOrdenCotizacion,
            fn_FinalizarSolicitudCotizar: fn_FinalizarSolicitudCotizar,
            fn_VerOrdenCotizacion: fn_VerOrdenCotizacion,
            fn_ReprocesarSolicitudCotizar: fn_ReprocesarSolicitudCotizar,
            fn_DuplicarSolicitudCotizar: fn_DuplicarSolicitudCotizar,
            fn_EnviarReproceso: fn_EnviarReproceso,
            fn_EnviarDuplicado: fn_EnviarDuplicado,
            fn_LimpiarBtnsFinalizado: fn_LimpiarBtnsFinalizado,
            fn_HistorialSolicitudCotizar: fn_HistorialSolicitudCotizar,
            fn_ReporteSolicitudCotizar: fn_ReporteSolicitudCotizar,
            fn_ReporteCotizaciones: fn_ReporteCotizaciones,
            fn_RefreshAndSelect: fn_RefreshAndSelect,
            refrescarsolicitud_index: refrescarsolicitud_index,
            fn_nuevasolicitud_from_button: fn_nuevasolicitud_from_button
        }
    }

)(document, 'div_padre_index_solicitudatx_1');

(
    function init() {
        appSolicitudAtx.load();
        appSolicitudAtx.req_ini();
    }
)();
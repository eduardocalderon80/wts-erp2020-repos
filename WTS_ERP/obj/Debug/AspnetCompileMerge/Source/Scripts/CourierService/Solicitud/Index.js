var app_Solicitud_Index = (

    function (d, idpadre) {

        var ovariables_informacion = {
            informacion_usuario: '',
            idusuario: '',
            nivel: 0,
            informacion_horario: '',
            listado_usuarios: []
        }

        var ovariables_data = {
            arr_vehiculo: [],
            arr_programacion: [],
            arr_solicitud: []
        }

        function load() {
            _('btn_visualizar').addEventListener('click', req_visualizar);
            _('btn_reprogramar').addEventListener('click', req_reprogramar);
            _('btn_new').addEventListener('click', req_new);
        }

        function req_visualizar() {
            let urlaccion = 'CourierService/Solicitud/List',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function req_reprogramar() {
            let urlaccion = 'CourierService/Solicitud/Program',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function req_new() {
            let urlaccion = 'CourierService/Solicitud/New',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }
        
        /*Informacion*/
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: 1 };
            let urlaccion = 'CourierService/Solicitud/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.informacion_horario = rpta[0].informacion_horario != '' ? JSON.parse(rpta[0].informacion_horario) : '';
                    }
                    fn_load_informacion();
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;

            if (ovariables_informacion.nivel == 1 || ovariables_informacion.nivel == 2) {
                _('btn_reprogramar').classList.remove('hide');
            }
        }             
                
        /* Data */
        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: 0 };
            let urlaccion = 'CourierService/Solicitud/List_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_vehiculo = rpta[0].vehiculo != '' ? JSON.parse(rpta[0].vehiculo) : '';
                        ovariables_data.arr_programacion = rpta[0].programacion != '' ? JSON.parse(rpta[0].programacion) : '';
                        ovariables_data.arr_solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : '';
                    }
                    fn_load_programacion();
                   
                }, (p) => { err(p); });
        }

        function fn_load_programacion() {
            let arr_vehiculo = ovariables_data.arr_vehiculo;
            let arr_programacion = ovariables_data.arr_programacion;
            let arr_solicitud = ovariables_data.arr_solicitud;

            let html_total = '',  cont = 0;

            let btn_asignar_chofer_estandar = `<button type='button' class ='btn btn-outline btn-warning _asignar_chofer'>Asignar Chofer</button>`;
            
            arr_vehiculo.forEach(x => {
                cont++;
                let idprogramacion = 0;
                let idvehiculo = x.idvehiculo, vehiculo = x.vehiculo, externo = x.externo;
                let idbuscador = (idvehiculo + '_' + vehiculo).replace(' ', '');


                let res_solicitud = [];
                if (arr_solicitud.length > 0) { res_solicitud = arr_solicitud.filter(m=> m.idvehiculo === x.idvehiculo); }

                /* TITLE */
                let btn_asignar_chofer = '', btn_visualizar_mapa = '';
                let res_programacion = [], estado_programacion = '', chofer_programacion = '', clase_estado_programacion='';

                if (arr_programacion.length > 0) { res_programacion = arr_programacion.filter(y=> y.idvehiculo === x.idvehiculo); }

                if (res_programacion.length > 0) {
                    idprogramacion = res_programacion[0].idprogramacion;
                    estado_programacion = res_programacion[0].estado;
                    chofer_programacion = res_programacion[0].chofer;

                    if (ovariables_informacion.nivel == 1 || ovariables_informacion.nivel == 2) { btn_asignar_chofer = chofer_programacion != '' ? `<button id= type='button' class ='btn btn-outline btn-success _asignar_chofer'>${chofer_programacion}</button>` : btn_asignar_chofer_estandar; }
                    else { btn_asignar_chofer = chofer_programacion != '' ? `<label class="control-label">${chofer_programacion}</label>` : ''; }

                    clase_estado_programacion = res_programacion[0].clasecolor !== '' ? 'text-' + res_programacion[0].clasecolor : '';

                    if ((externo == 'S') || (res_solicitud.length == 0)) { btn_asignar_chofer = ''; clase_estado_programacion = ''; estado_programacion = ''; }
                }

                let html_title =
                    `<div class='ibox-title'>
                        <div class='form-horizontal row'>
                            <div class='col-sm-2 text-left'>
                                <label class ='control-label'>${vehiculo}:</label>
                            </div>
                            <div class ='col-sm-7 text-left'>
                               ${btn_asignar_chofer}
                            </div>
                            <div class='col-sm-3 text-right'>
                               <label class ='control-label ${clase_estado_programacion}'>${estado_programacion}</label>
                            </div>
                        </div>
                    </div>`;
                    

                /* CONTENT */
             
                let btn_estado_solicitud = `<button type='button' class ='btn btn-outline btn-__clasecolor btn-sm btn-block _ver_detalle'>__estado</span></button>`;
                let html_tabla_ini = '', html_tabla_contenido = '', html_tabla_fin = `</tbody></table></div></div></div>`;
                

                html_tabla_ini =
                        `<div class ='ibox-content'>
                            <div class ='form-horizontal row'>
                                <div class ='table-responsive'>
                                   <table id='${idbuscador}' class ="stripe row-border order-column _tablita" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                                        <thead>
                                            <tr>
                                                <th>Destino</th>
                                                <th>Contacto</th>
                                                <th>Turno</th>
                                                <th>Hora</th>
                                                <th>Enviado Por</th>
                                                <th class ='col-sm-1'>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                           `;

                if (res_solicitud.length > 0) {
                    res_solicitud.forEach(s=> {
                        let estado_solicitud = '';
                        estado_solicitud = btn_estado_solicitud.replace('__clasecolor', s.clasecolor).replace('__estado', s.estado);

                        let clasefila = s.clasefila !== '' ? 'text-' + s.clasefila : '';

                        html_tabla_contenido +=
                            `<tr data-par='idsolicitud:${s.idsolicitud},codigoestado:${s.codigoestado},estado:${s.estado},clasecolor:${s.clasecolor}' class='${clasefila}'>
                                    <td class ='small'>${s.destino}</td>
                                    <td class ='small'>${s.contacto}</td>
                                    <td class ='small'>${s.turno}</td>
                                    <td class ='small'>${s.hora}</td>
                                    <td class ='small'>${s.usuario}</td>
                                    <td class ='text-center'>${estado_solicitud}</td>
                                </tr>`
                        ;
                    });
                }

                /* FOOTER */                               
                let btn_ver_mapa = externo == 'N' ? `<button type='button' class ='btn btn-outline btn-primary _ver_mapa'><span class ='fa fa-${x.clase}'></span> - Ver Mapa</button>` : '';
                btn_ver_mapa = res_solicitud.length > 0 ? (chofer_programacion != '' ? btn_ver_mapa : '') : '';
                
                let html_footer =
                    `<div class ='ibox-footer'>
                        <div class='form-horizontal row '>
                            <div id='div_botones_primarios' class='col-sm-12 text-left'>
                              ${btn_ver_mapa}
                            </div>
                        </div>
                    </div>`;

                /* HTML */
                let html_row_ini = ``, html_row_fin = '';
                let html_ibox_ini = `<div class='col-lg-6'><div data-par='idprogramacion:${idprogramacion}' class ='ibox'>`,
                   html_ibox_fin = `</div></div>`;

                if (cont % 2 != 0) { html_row_ini = `<div class='row'>` }
                else { html_row_fin = `</div>`; }

                html_total += html_row_ini + html_ibox_ini
                    + html_title
                    + html_tabla_ini + html_tabla_contenido + html_tabla_fin
                    + html_footer
                    + html_ibox_fin + html_row_fin;

            });

            _('pnl_courier_service_data').innerHTML = html_total;

            let panel_data = _('pnl_courier_service_data');

            //Agregar Diseño Tabla
            let arr_tablas = Array.from(panel_data.getElementsByClassName('_tablita'));
            arr_tablas.forEach(x => { let tabla = x.id; format_table(tabla) });

            //Agregar evento de asignar chofer
            let arr_item_asignar_chofer = Array.from(panel_data.getElementsByClassName('_asignar_chofer'));
            arr_item_asignar_chofer.forEach(x => x.addEventListener('click', e => { fn_asignar_chofer(e) }));

            //Agregar evento de ver detalle
            let arr_item_ver_detalle = Array.from(panel_data.getElementsByClassName('_ver_detalle'));
            arr_item_ver_detalle.forEach(x => x.addEventListener('click', e => { fn_ver_detalle(e) }));

            //Agregar evento de ver mapa
            let arr_item_ver_mapa = Array.from(panel_data.getElementsByClassName('_ver_mapa'));
            arr_item_ver_mapa.forEach(x => x.addEventListener('click', e => { fn_ver_mapa(e) }));
           
        }

        function format_table(_idtabla) {
            $('#' + _idtabla).DataTable({
                scrollY: "300px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                //searching: false,
                info: false,
                bPaginate: false,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros"
                }
            });
        }

                         
        /* Asignar Chofer */
        function fn_asignar_chofer(e) {
            let o = e.currentTarget;
            let div = o.parentNode.parentNode.parentNode.parentNode;
            let par = div.getAttribute('data-par');
            fn_view_modal_asignar_chofer(par);          
        }

        function fn_view_modal_asignar_chofer(_parametro) {
            let urlaccion = 'CourierService/Solicitud/_AssignDriver';
            _modalBody_Opacity({
                url: urlaccion,
                idmodal: 'AssignDriver',
                paremeter: _parametro,
                title: 'Asignar Chofer',
                width: '',
                height: '',
                backgroundtitle: 'bg-success',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        /* Ver Detalle */
        function fn_ver_detalle(e) {
            let o = e.currentTarget;
            let tr = o.parentNode.parentNode;
            let par = tr.getAttribute('data-par');
            fn_view_modal_ver_detalle(par);
        }

        function fn_view_modal_ver_detalle(_parametro) {
            let estado = _getPar(_parametro, 'estado').toUpperCase();
            let clasecolor = 'bg-' + _getPar(_parametro, 'clasecolor');
            let urlaccion = 'CourierService/Solicitud/_ViewDetail';
            _modalBody_Opacity({
                url: urlaccion,
                idmodal: 'ViewDetail',
                paremeter: _parametro,
                title: estado,
                width: '',
                height: '',
                backgroundtitle: clasecolor,
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });
        }

        /* Ver Mapa */

        function fn_ver_mapa(e) {
            let o = e.currentTarget;
            let div = o.parentNode.parentNode.parentNode.parentNode;
            let par = div.getAttribute('data-par');
            fn_view_modal_ver_mapa(par);
        }

        function fn_view_modal_ver_mapa(_parametro) {
            _modalBody_Opacity({
                url: 'CourierService/Solicitud/_ViewMap',
                idmodal: 'ViewMap',
                paremeter: _parametro,
                title: 'Ubicación',
                width: '',
                height: '',
                backgroundtitle: 'bg-primary',
                animation: 'none',
                responsive: 'modal-lg',
                bloquearpantallaprincipal: true
            });

        }
        
        /* Funcion Modal */
        function _modalBody_Opacity(oparametro) {
            let url = oparametro.url,
                idmodal = oparametro.idmodal,
                paremeter = oparametro.paremeter || '',
                title = oparametro.title,
                width = oparametro.width || '',
                height = oparametro.height || '',
                backgroundtitle = oparametro.backgroundtitle || '',
                classanimation = oparametro.animation || '',
                claseresponsive = oparametro.responsive || '',
                disabledmainscreen = oparametro.bloquearpantallaprincipal || '';
            if (!_isEmpty(idmodal)) {
                _promise().then(function () {
                    _modal_Opacity(idmodal, width, height, backgroundtitle, classanimation, claseresponsive, disabledmainscreen);
                }).then(function () {
                    let urlJS = (!_isEmpty(oparametro.urljs)) ? oparametro.urljs : url,
                        modal_header = _(`modal_header_${idmodal}`),
                        modal_title = _(`modal_title_${idmodal}`),
                        modal_body = _(`modal_body_${idmodal}`),
                        _err = function (error) { console.log("error", error) }

                    //modal_header.classList.add(backgroundtitle);
                    modal_title.innerHTML = !_isEmpty(title) ? title : 'Titulo';                   
                    $(`#modal_${idmodal}`).modal({ show: true });

                    /*Para que sea arrastable*/
                    //$(`#modal_dialog_${idmodal}`).draggable({
                    //    handle: '.modal-content'
                    //});

                    _Get(url)
                        .then((vista) => {
                            let contenido = (paremeter !== '') ? vista.replace('DATA-PARAMETRO', paremeter) : vista;
                            modal_body.innerHTML = contenido;
                        }, (p) => { _err(p) })
                        .then(() => { _Getjs(urlJS) }, (p) => { _err(p) })
                })
            }
        }

        function _modal_Opacity(_idmodal, _width, _height, _backgroundtitle, _classanimation, _claseresponsive, _disabledmainscreen) {
            let classbackgroundtitle = _backgroundtitle || 'bg-primary';
            let html = '',
                classmodal = 'class' + _idmodal,
                width = !_isEmpty(_claseresponsive) ? '' : (!_isEmpty(_width) ? `width:${_width}px` : 'width:900px'), // ??
                claseresponsive = _claseresponsive || '',
                height = (!_isEmpty(_height)) ? _height.toString() + 'px;' : 'auto;', // ??
                heightbody = (!_isEmpty(_height)) ? (parseInt(_height) - 80) + 'px' : 'auto', // ??
                max_heightbody = heightbody,
                classtittle = classbackgroundtitle,
                classanimation = !_isEmpty(_classanimation) ? (_classanimation.trim() === 'none' ? '' : ' ' + ` animated ${_classanimation.trim()}`) : '';

            let modalinbody = document.getElementById(`modal_${_idmodal}`);
            if (modalinbody != null) {
                document.body.removeChild(modalinbody);
            }
            let defaulttitle = 'New';

            html += `<div id='modal_${_idmodal}' class='modal fade ${classmodal}' role='dialog' data-dismiss='modal' data-backdrop='static'>`;
            html += `   <div id='modal_dialog_${_idmodal}' class='modal-dialog ${claseresponsive}'>`; //falta clase responsiva
            html += `       <div id='modal_content_${_idmodal}' class='modal-content' style='height:${height}'>`; //falta estilo height            
            html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            //html += `           <div id='modal_header_${_idmodal}' class='modal-header ${classtittle}'>`;
            //html += `               <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span class='fa fa-close' aria-hidden='true'></span></button>`;
            html += `               <h4 id='modal_title_${_idmodal}' class='modal-title'>${defaulttitle}</h4>`;
            html += `           </div>`;
            html += `           <div id='modal_body_${_idmodal}' class='modal-body wrapper wrapper-content gray-bg'>`; //falta agregar class wrapper
            html += `           </div>`;
            html += `       </div>`;
            html += `   </div>`;
            html += `</div>`;

            $('body').append(html);
        }
        

        //Mapa
        function countdown(_id) {
            let fecha_actual = new Date();
            let anio_actual = fecha_actual.getFullYear();
            let mes_actual = fecha_actual.getMonth() + 1;
            let diames_actual = fecha_actual.getDate();
            let diasemana_actual = fecha_actual.getDay();
            let hora_actual = fecha_actual.getHours() < 10 ? '0' + fecha_actual.getHours() : fecha_actual.getHours();
            let minuto_actual = fecha_actual.getMinutes() < 10 ? '0' + fecha_actual.getMinutes() : fecha_actual.getMinutes();
            let segundo_actual = fecha_actual.getSeconds() < 10 ? '0' + fecha_actual.getSeconds() : fecha_actual.getSeconds();
            _(_id).innerHTML = hora_actual + 'h :' + minuto_actual + 'm :' + segundo_actual;

            setTimeout(function () { countdown(_id); }, 1000);
        }


        return {
            load: load,
            req_ini: req_ini
        }

    }

)(document, 'pnl_courier_service_index');

//function initMap() {
//    var uluru = { lat: -12.130514, lng: -76.983499 };
//    // The map, centered at Uluru
//    var map1 = new google.maps.Map(
//        document.getElementById('map1'), { zoom: 16, center: uluru });
//    // The marker, positioned at Uluru
//    var marker = new google.maps.Marker({
//        position: uluru, map: map1
//    });
//}


(function ini() {
    //initMap();
    app_Solicitud_Index.load();
    app_Solicitud_Index.req_ini();
})();

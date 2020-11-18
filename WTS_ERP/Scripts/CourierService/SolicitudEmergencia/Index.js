var app_Solicitud_Emergencia_Index = (
    function (d, idpadre) {

        var ovariables_informacion = {
            idtipoenvio: 3,
            informacion_usuario: '',
            idusuario: 0,
            idusuarioaprobador: 0,
            nivel: 0,
            informacion_horario: '',
            listado_usuarios: [],
        }

        var ovariables_data = {
            arr_grafico: [],
            suma_total_mensual: [],           
            arr_tabla: [],
            arr_solicitud: []
        }

        function load() {
            $('.footable').footable();

            _('btn_new_emergencia').addEventListener('click', req_new);
        }

        function req_new() {
            let urlaccion = 'CourierService/SolicitudEmergencia/New',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        /* Informacion */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.informacion_horario = rpta[0].informacion_horario != '' ? JSON.parse(rpta[0].informacion_horario) : '';
                        ovariables_informacion.listado_usuarios = rpta[0].listado_usuarios != '' ? JSON.parse(rpta[0].listado_usuarios) : '';
                    }
                    fn_load_informacion();
                    req_detalle();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.idusuarioaprobador = informacion_usuario[0].idusuarioaprobador;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;           
        }
               
        /* Detalle */
        function req_detalle(){
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/Get_Suma_Total?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_grafico = rpta[0].solicitud_grafico != '' ? JSON.parse(rpta[0].solicitud_grafico) : '';
                        ovariables_data.suma_total_mensual = rpta[0].suma_total_mensual != '' ? JSON.parse(rpta[0].suma_total_mensual) : '';
                        ovariables_data.arr_tabla = rpta[0].solicitud_emergencia != '' ? JSON.parse(rpta[0].solicitud_emergencia) : '';
                       
                    }
                    fn_load_suma_total_mensual();
                    fn_load_tabla_detalle();
                    req_load_cantidadtotalmensual();
                    req_data();
                }, (p) => { err(p); });
        }

        function req_load_cantidadtotalmensual() {
            var arr = ovariables_data.arr_grafico;

            //var arr = `[{"Area":"Administración","Resumen":"ADM","Total": 10, "Color":"#FF0F00"}, {"Area":"Comercial","Resumen":"COM","Total": 4, "Color":"#1c84c6"}
            //    , {"Area": "Contabilidad", "Resumen": "CON", "Total": 12, "Color": "#7F8104"}, {"Area": "Diseño", "Resumen": "DIS", "Total": 5, "Color": "#FF0F00"}
            //    , {"Area": "G. General", "Resumen": "G.G", "Total": 11, "Color": "#1c84c6"}, {"Area": "Legal", "Resumen": "LEG", "Total": 2, "Color": "#7F8104"}
            //    , {"Area": "Operaciones", "Resumen": "OPE", "Total": 12, "Color": "#AE4423"}, {"Area": "Talento y Desarrollo Organizacional", "Resumen": "TDO", "Total": 8, "Color": "#2325AE"}
            //    , {"Area": "Tecnica Textil", "Resumen": "TCT", "Total": 3, "Color": "#2325AE"},  {"Area": "Tecnologia e Información", "Resumen": "TIC", "Total": 5, "Color": "#2325AE"}]`;

            var chartData = arr;

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "dataProvider": chartData,
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "[[Area]]: <b>[[value]]</b>",
                    "fillColorsField": "Color",
                    "fillAlphas": 0.8,
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "Total"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "Resumen",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "tickPosition": "start"
                },
                "titles": [{
                    "text": "Cantidad de Emergencias por Mes"
                }, {
                    "text": "",
                    "bold": false
                }],
               
            });

            //var chart2 = AmCharts.makeChart("chartdiv2", {
            //    "theme": "light",
            //    "type": "serial",
            //    "dataProvider": chartData,
            //    "categoryField": "Mes",
            //    "depth3D": 20,
            //    "angle": 30,
            //    "categoryAxis": {
            //        "labelRotation": 0,
            //        "gridPosition": "start"
            //    },
            //    "titles": [{
            //        "text": "Cantidad de Pruebas por Mes"
            //    }, {
            //        "text": "",
            //        "bold": false
            //    }],
            //    "graphs": [{
            //        "valueField": "Total",
            //        "colorField": "Color",
            //        "type": "column",
            //        "lineAlpha": 0.1,
            //        "fillAlphas": 1
            //    }],
            //    /**
            //     * Now let's use the AmCharts.exportCFG we modified
            //     */
            //    "export": {
            //        "enabled": true
            //    }
            //});

        }

        function fn_load_suma_total_mensual() {
            let suma_total_mensual = ovariables_data.suma_total_mensual;
            _('lbl_costo_mensual').innerText = 'S/. ' + suma_total_mensual[0].suma_mensual;
        }

        function fn_load_tabla_detalle() {
            let arr_informacion_suma_total = ovariables_data.arr_tabla;
            let html = '', html_body = '';

            html = `
                <table id="tbl_solicitud_emergencia_suma_total" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>
                            <th>Jefe</th>
                            <th>Sin Costo</th>
                            <th>Con Costo</th>
                            <th>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
            if (arr_informacion_suma_total.length > 0) {
                arr_informacion_suma_total.forEach(x=> {
                    html_body +=
                         `<tr>
                            <td>${x.usuario}</td>
                            <td class='text-center'>${x.sincosto}</td>
                            <td class ='text-center'>${x.concosto}</td>
                            <td class ='text-center'>${x.costo}</td>
                        </tr>`
                    ;
                });
            }

            html += html_body + '</tbody></table>';

            _('div_tbl_solicitud_emergencia_costo_mensual').innerHTML = html;
            format_table_solicitud_emergencia_costo_mensual();
        }

        function format_table_solicitud_emergencia_costo_mensual() {
            $('#tbl_solicitud_emergencia_suma_total').DataTable({
                scrollY: "300px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
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
        

        /* Data */
        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: ovariables_informacion.idtipoenvio };
            let urlaccion = 'CourierService/SolicitudEmergencia/List_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : [];
                    }
                    fn_load_solicitud();
                }, (p) => { err(p); });
        }
        
        function fn_load_solicitud() {
            let arr_solicitud = ovariables_data.arr_solicitud;

            let html = '', html_body = '',
                btn_estado_solicitud = `<button type='button' class ='btn btn-outline btn-__clasecolor btn-sm btn-block _ver_detalle'>__estado</span></button>`;

            html = `
                <table id="tbl_solicitud_emergencia" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                        <thead>
                            <tr>
                                <th>Destino</th>
                                <th>Turno</th>
                                <th>Hora</th>
                                <th>Enviado Por</th>
                                <th>Costo</th>
                                <th>Movilidad</th>
                                <th class='col-sm-1'>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

            arr_solicitud.forEach(x=> {
                let estado_solicitud = btn_estado_solicitud.replace('__clasecolor', x.clasecolor).replace('__estado', x.estado);

                html_body +=
                    `<tr data-par='idsolicitud:${x.idsolicitud},codigoestado:${x.codigoestado},estado:${x.estado},clasecolor:${x.clasecolor}'>
                            <td>${x.destino}</td>
                            <td>${x.turno}</td>
                            <td>${x.hora}</td>
                            <td>${x.usuario}</td>
                            <td>${x.costo}</td>
                            <td>${x.vehiculo}</td>
                            <td class ='text-center'>${estado_solicitud}</td>
                        </tr>`
                ;
            });

            html += html_body + '</tbody></table>';

            _('div_tbl_solicitud_emergencia').innerHTML = html;
            format_table_solicitud_emergencia();

            let panel_data = _('pnl_solicitud_emergencia_body');
            //Agregar evento de ver detalle
            let arr_item_ver_detalle = Array.from(panel_data.getElementsByClassName('_ver_detalle'));
            arr_item_ver_detalle.forEach(x => x.addEventListener('click', e => { fn_ver_detalle(e) }));

        }

        function format_table_solicitud_emergencia() {
            $('#tbl_solicitud_emergencia').DataTable({
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
            let urlaccion = 'CourierService/SolicitudEmergencia/_ViewDetailEmergency';
            _modalBody_Opacity({
                url: urlaccion,
                idmodal: 'ViewDetailEmergency',
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
            html += `               <h4 id='modal_title_${_idmodal}' class='modal-title'>${defaulttitle}</h4>`;
            html += `           </div>`;
            html += `           <div id='modal_body_${_idmodal}' class='modal-body wrapper wrapper-content gray-bg'>`; //falta agregar class wrapper
            html += `           </div>`;
            html += `       </div>`;
            html += `   </div>`;
            html += `</div>`;

            $('body').append(html);
        }



        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_solicitud_emergencia_index');


(function ini() {
    app_Solicitud_Emergencia_Index.load();
    app_Solicitud_Emergencia_Index.req_ini();
})();
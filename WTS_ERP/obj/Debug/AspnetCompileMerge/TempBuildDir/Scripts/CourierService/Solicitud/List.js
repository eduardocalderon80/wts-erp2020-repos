var app_Solicitud_List = (

    function (d, idpadre) {

        var ovariables_informacion = {
            informacion_usuario: ''
            , arr_ruta: ''
            , idusuario: ''
            , nivel: 0
            , lst_vehiculo: []
            , lst_estado: []
        }

        var ovariables_data = {
            arr_solicitud: []
        }

        function load(){
            _('btn_new_solicitud_list').addEventListener('click', req_new);
            _('btn_return_solicitud_list').addEventListener('click', fn_return);
            _('btn_search_solicitud_list').addEventListener('click', req_data);

            
            $('#div_fecha_desde .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            $('#div_fecha_hasta .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();

            _('txt_destino_solicitud_list').addEventListener('keyup', event_load_solicitud);

            $('.footable').footable();
            $('.footable').trigger('footable_resize');
        }

        function fn_getDate() {
            let odate = new Date();
            let mes = odate.getMonth() + 1;
            let day = odate.getDate();
            let anio = odate.getFullYear();
            if (day < 10) { day = '0' + day }
            if (mes < 10) { mes = '0' + mes }
            let fecha = `${mes}/${day}/${anio}`;
            _('txt_fecha_desde').value = fecha;
            _('txt_fecha_hasta').value = fecha;
        }

        function req_new() {
            let urlaccion = 'CourierService/Solicitud/New',
                urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function fn_return() {
            let urlaccion = 'CourierService/Solicitud/Index',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function event_load_solicitud() {
            event.preventDefault();
            if (event.keyCode === 13) {
                req_load_solicitud();
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idtipoenvio: 0 };
            let urlaccion = 'CourierService/Solicitud/Get_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_informacion.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_informacion.lst_vehiculo = rpta[0].vehiculo != '' ? JSON.parse(rpta[0].vehiculo) : '';
                        ovariables_informacion.lst_estado = rpta[0].estado != '' ? JSON.parse(rpta[0].estado) : '';
                    }
                    fn_load_informacion();
                    fn_load_vehiculo();
                    fn_load_estado();
                    req_data();
                }, (p) => { err(p); });
        }

        function fn_load_informacion() {
            let informacion_usuario = ovariables_informacion.informacion_usuario;
            ovariables_informacion.idusuario = informacion_usuario[0].idusuario;
            ovariables_informacion.nivel = informacion_usuario[0].nivel;
        }

        function fn_load_vehiculo() {
            let lst_vehiculo = ovariables_informacion.lst_vehiculo
                , cbo_vehiculo = `<option value='0'>Todos</option>`

            if (lst_vehiculo.length > 0) {
                lst_vehiculo.forEach(x=> { cbo_vehiculo += `<option value='${x.idvehiculo}'>${x.vehiculo}</option>`; });
            }
            _('cbo_vehiculo').innerHTML = cbo_vehiculo;

        }

        function fn_load_estado() {
            let lst_estado = ovariables_informacion.lst_estado
               , cbo_estado = `<option value='0'>Todos</option>`

            if (lst_estado.length > 0) {
                lst_estado.forEach(x=> { cbo_estado += `<option value='${x.codigoestado}'>${x.estado}</option>`; });
            }
            _('cbo_estado').innerHTML = cbo_estado;
        }

        function req_data() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = _getParameter({ id: 'div_items_busqueda', clase: '_enty' });
            let urlaccion = 'CourierService/Solicitud/List_Solicitud?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.arr_solicitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : '';
                    }
                    req_load_solicitud();

                }, (p) => { err(p); });
        }

        function req_load_solicitud() {
            let arr_solicitud = ovariables_data.arr_solicitud, resultado_solicitud = [];
            let destino = _('txt_destino_solicitud_list').value;

            if (arr_solicitud.length > 0) {
                resultado_solicitud = arr_solicitud.filter(x=>
                    (x.destino.toLowerCase().indexOf(destino.toLowerCase) > -1 || x.destino.toLowerCase().indexOf(destino.toLowerCase()) > -1)
                );
            }

            fn_load_solicitud(resultado_solicitud);
        }

        function fn_load_solicitud(_resultado_solicitud) {
            let resultado_solicitud = _resultado_solicitud,
                html = '', htmlheader = '', htmlbody = '',
                btn_estado_solicitud = `<button type='button' class ='btn btn-outline btn-__clasecolor btn-sm btn-block _ver_detalle'>__estado</span></button>`;
                
            resultado_solicitud.forEach(x=> {
                let estado_solicitud = btn_estado_solicitud.replace('__clasecolor', x.clasecolor).replace('__estado', x.estado);

                htmlbody +=
                    `<tr data-par='idsolicitud:${x.idsolicitud},codigoestado:${x.codigoestado},estado:${x.estado},clasecolor:${x.clasecolor}'>
                            <td>${x.destino}</td>
                            <td>${x.fecha}</td>
                            <td>${x.turno}</td>
                            <td>${x.hora}</td>
                            <td>${x.usuario}</td>
                            <td>${x.vehiculo}</td>
                            <td class ='text-center'>${estado_solicitud}</td>
                        </tr>`
                ;
            });

            _('tbl_solicitud').tBodies[0].innerHTML = htmlbody;
            $('.footable').trigger('footable_resize');

            let panel_data = _('pnl_solicitud_list_body');
            //Agregar evento de ver detalle
            let arr_item_ver_detalle = Array.from(panel_data.getElementsByClassName('_ver_detalle'));
            arr_item_ver_detalle.forEach(x => x.addEventListener('click', e => { fn_ver_detalle(e) }));

        }

        function format_table_solicitud() {
            $('#tbl_solicitud_list').DataTable({
                scrollY: "450px",
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


        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_solicitud_list');

(function ini() {
    app_Solicitud_List.load();
    app_Solicitud_List.req_ini();
})();
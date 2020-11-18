var app_HelpDesk_Inicio = (
    function (d, idpadre) {

        var ovariables_info = {
            informacion_usuario: [],
            arr_equipotic: [],
            arr_tiposolicitud: [],
            arr_estado: [],
            arr_estado_primario: [],
            arr_estado_secundario: [],
            arr_estado_leyenda: [],
            arr_ticket: []
        }

        var ovariables = {
            idusuario: 0,
            idtiporol: 0,
            agrupador: '',
            nivel: 0,
            codigoestado: 'PA'
        }

        function load() {
            _('btn_nuevo').addEventListener('click', req_new);
            _('btn_buscar').addEventListener('click', req_search);

            $('#div_fecha_solicitud_desde .input-group.date, #div_fecha_solicitud_hasta .input-group.date').datepicker({
                autoclose: true,
                dateFormat: 'dd/mm/yyyy',
                clearBtn: false,
                //firstDay: 1,
                //defaultDate: new Date(),
                todayHighlight: true
            }).datepicker("setDate", new Date());

            $('#div_fecha_solicitud_desde .input-group.date').datepicker('update', moment().subtract(2, 'month').format('MM/DD/YYYY'));
            $('#div_fecha_solicitud_hasta .input-group.date').datepicker('update', moment().format('MM/DD/YYYY'));

            _('cbo_equipotic').addEventListener('change', req_search);
            _('cbo_tiposolicitud').addEventListener('change', req_search);
            _('cbo_estado').addEventListener('change', req_search);
            _('txt_buscador').addEventListener('keyup', event_load_ticket);

            _initializeIboxTools();
            $('#leyenda .collapse-link').click();
        }

        function event_load_ticket() {
            event.preventDefault();
            if (event.keyCode === 13) {
                req_load_ticket();
            }
        }

        function req_search() {
            req_info();
        }

        function req_new() {
            let arr_ticket = ovariables_info.arr_ticket;

            if (arr_ticket.length > 0) {
                //--x.codigoestado === 'AT' && 
                let arr_ticket_atendido = arr_ticket.filter(x=> x.idsolicitante === ovariables.idusuario && x.codigoestado === 'AT' && x.version === 2);

                if (arr_ticket_atendido.length >= 3) {
                    swal({
                        title: "Tiene " + arr_ticket_atendido.length+ " ticket que debe terminar",
                        text: "",
                        type: "info",
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function () {
                        let urlaccion = 'TecnologiaInformacion/HelpDesk/Nuevo', urljs = urlaccion;
                        _Go_Url(urlaccion, urljs);
                    });
                }
                else {
                    let urlaccion = 'TecnologiaInformacion/HelpDesk/Nuevo', urljs = urlaccion;
                    _Go_Url(urlaccion, urljs);
                }
            }
            else {
                let urlaccion = 'TecnologiaInformacion/HelpDesk/Nuevo', urljs = urlaccion;
                _Go_Url(urlaccion, urljs);
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { accion: 'nuevo' };
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Get_Usuario_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';                        
                        ovariables_info.arr_equipotic = rpta[0].equipotic != '' ? JSON.parse(rpta[0].equipotic) : [];
                        ovariables_info.arr_tiposolicitud = rpta[0].tiposolicitud != '' ? JSON.parse(rpta[0].tiposolicitud) : [];
                        ovariables_info.arr_estado = rpta[0].estado != '' ? JSON.parse(rpta[0].estado) : [];
                        ovariables_info.arr_estado_primario = rpta[0].estado_primario != '' ? JSON.parse(rpta[0].estado_primario) : [];
                        ovariables_info.arr_estado_secundario = rpta[0].estado_secundario != '' ? JSON.parse(rpta[0].estado_secundario) : [];
                        ovariables_info.arr_estado_leyenda = rpta[0].estado_leyenda != '' ? JSON.parse(rpta[0].estado_leyenda) : [];
                    }
                    fn_load_informacion_usuario();
                    fn_load_equipotic();
                    fn_load_tiposolicitud();
                    fn_load_estado();
                    fn_load_leyenda();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_informacion_usuario() {
            let informacion_usuario = ovariables_info.informacion_usuario;

            ovariables.idusuario = informacion_usuario[0].idusuario;
            ovariables.idtiporol = informacion_usuario[0].idtiporol;
            ovariables.agrupador = informacion_usuario[0].agrupador;
            ovariables.nivel = informacion_usuario[0].nivel;
        }

        function fn_load_equipotic() {
            let arr_equipotic = ovariables_info.arr_equipotic
                , cbo_equipotic = `<option value='0'>Todo Equipo TIC</option>`;

            if (arr_equipotic.length > 0) { arr_equipotic.forEach(x=> { cbo_equipotic += `<option value='${x.idequipotic}'>${x.equipotic}</option>`; }); }

            _('cbo_equipotic').innerHTML = cbo_equipotic;
        }

        function fn_load_tiposolicitud() {
            let arr_tiposolicitud = ovariables_info.arr_tiposolicitud
               , cbo_tiposolicitud = `<option value='0'>Todo Tipo Solicitud</option>`;

            if (arr_tiposolicitud.length > 0) { arr_tiposolicitud.forEach(x=> { cbo_tiposolicitud += `<option value='${x.idtiposolicitud}'>${x.tiposolicitud}</option>`; }); }

            _('cbo_tiposolicitud').innerHTML = cbo_tiposolicitud;
        }

        function fn_load_estado() {
            let arr_estado_primario = ovariables_info.arr_estado_primario
               //, cbo_estado = `<option value='0'>Todo Estado</option>`;
                , cbo_estado = '';

            if (arr_estado_primario.length > 0) { arr_estado_primario.forEach(x=> { cbo_estado += `<option value='${x.codigoestado}'>${x.estado}</option>`; }); }

            _('cbo_estado').innerHTML = cbo_estado;
        }

        function fn_load_leyenda() {
            let arr_estado = ovariables_info.arr_estado
                , html = '', htmlheader = '', htmlbody = '';

            htmlheader = `
                <table id="tbl_leyenda" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Estado</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                `
            ;

            if (arr_estado.length > 0) {
                arr_estado.forEach(x=> {
                    htmlbody += `
                        <tr data-par='codigoestado:${x.codigoestado}'>
                            <td class ='text-center'><span class ='fa fa-${x.icono}' title='${x.estado}' style='color:${x.color};font-size:13pt;'></span></td>
                            <td>${x.estado}</td>
                            <td>${x.descripcion}</td>
                        </tr>
                    `;
                });
            }

            html += htmlheader + htmlbody + '</tbody></table>';
            _('div_tabla_leyenda').innerHTML = html;
            format_table_leyenda();

        }
        
        function req_info() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = _getParameter({ id: 'pnl_helpdesk_inicio_buscador', clase: '_enty' });
            let urlaccion = 'TecnologiaInformacion/HelpDesk/List_Ticket?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.arr_ticket = rpta[0].ticket != '' ? JSON.parse(rpta[0].ticket) : [];
                    }
                    req_load_ticket();
                }, (p) => { err(p); });
        }

        function req_load_ticket(){
            let arr_ticket = ovariables_info.arr_ticket,
                resultado_ticket = [], txt_buscador = _('txt_buscador').value;

            if (arr_ticket.length > 0) {
                resultado_ticket = arr_ticket.filter(x=>
                    (x.numeroticket.toLowerCase().indexOf(txt_buscador.toLowerCase) > -1 || x.numeroticket.toLowerCase().indexOf(txt_buscador.toLowerCase()) > -1) ||
                        (x.solicitante.toLowerCase().indexOf(txt_buscador.toLowerCase) > -1 || x.solicitante.toLowerCase().indexOf(txt_buscador.toLowerCase()) > -1) ||
                        (x.categoria.toLowerCase().indexOf(txt_buscador.toLowerCase) > -1 || x.categoria.toLowerCase().indexOf(txt_buscador.toLowerCase()) > -1)
                    );
            }

            fn_load_ticket(resultado_ticket);
        }

        function fn_load_ticket(_resultado_ticket) {
            let resultado_ticket = _resultado_ticket, html = ''
                , htmlheader = '', htmlbody = '';

            htmlheader = `
                <table id="tbl_ticket" class ="table table-striped table-bordered table-hover dataTable">
                    <thead>
                        <tr>
                            <th>Estado</th>
                            <th># Ticket</th>
                            <th>Solicitante</th>
                            <th>Área</th>
                            <th>Equipo TIC</th>
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Responsable</th>
                            <th>Fecha Solicitud</th>
                            <th>Inicio Tentativo</th>
                            <th>Fin Tentativo</th>
                            <th>Incio Real</th>
                            <th>Fin Real</th>
                        </tr>
                    </thead>
                    <tbody>
                `
            ;
            //<td class ='text-center' title='${x.estado}'><span class ='fa fa-flag' style='color:${x.color}'></span></td>
            //<span class ='fa fa-circle' title='${x.prioridad}' style='color:${x.colorprioridad}'></span>
                       
            resultado_ticket.forEach(x=> {
                htmlbody += `
                    <tr data-par='idticket:${x.idticket},version:${x.version},codigoestado:${x.codigoestado}' class='${x.leadtime}'>
                        <td class='text-center'><span class ='fa fa-${x.icono}' title='${x.estado}' style='color:${x.color};font-size:13pt;'></span></td>
                        <td>${x.numeroticket}
                        <span class ='fa fa-circle' title='${x.prioridad}' style='color:${x.colorprioridad}'></span></td>
                        <td>${x.solicitante}</td>
                        <td>${x.area}</td>
                        <td title='${x.equipotic}'>${x.equipoticresumido}</td>
                        <td title='${x.tiposolicitud}'>${x.tiposolicitudresumido}</td>
                        <td title='${x.descripcion}'>${x.categoria}</td>
                        <td>${x.responsable}</td>
                        <td title='${x.fechadetalle}'>${x.fechasolicitud}</td>
                        <td>${x.fechainiciotentativo}</td>
                        <td>${x.fechafintentativo}</td>
                        <td>${x.fechainicioreal}</td>
                        <td>${x.fechafinreal}</td>
                    </tr>
                `;
            });

            html += htmlheader + htmlbody + '</tbody></table>';
            _('div_tabla_ticket').innerHTML = html;
                    
            handler_table();
            format_table();
        }

        function handler_table() {
            let tbl = _('tbl_ticket').tBodies[0], rows = tbl.rows;
            let array = Array.from(rows);
            array.forEach(x=> { x.addEventListener('dblclick', event_rows); });
        }

        function event_rows(e) {
            let o = e.currentTarget, row = o;
            let par = row.getAttribute('data-par')
            let idticket = parseInt(_getPar(par, 'idticket'))
                , version = parseInt(_getPar(par, 'version'))
                , codigoestado = _getPar(par, 'codigoestado');

            if (version == 1) {
                let arr_estado = ovariables_info.arr_estado.filter(x=>x.codigoestado === codigoestado);
                let idestado = arr_estado[0].idestado;

                let par_filter = 'idequipotic=' + _('cbo_equipotic').value + '¬idestado=' + idestado;
                let urlaccion = 'TecnologiaInformacion/HelpDesk/Detail';
                _Go_Url(urlaccion, urlaccion, 'idsolicitud:' + idticket + ',par_filter:' + par_filter);
            }
            else {
                let urlaccion = 'TecnologiaInformacion/HelpDesk/Editar', urljs = urlaccion;
                _Go_Url(urlaccion, urljs, 'idticket:' + idticket);
            }

            //alert(idticket);
        }

        function format_table() {
            //$('#tbl_ticket').DataTable({
            //    scrollY: "455px",
            //    scrollX: true,
            //    scrollCollapse: true,
            //    ordering: true,
            //    searching: false,
            //    info: false,
            //    "pageLength": 50
            //});

            var table = $('#tbl_ticket').DataTable({
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar"
                },
                info: false,
                lengthChange: false,
                pageLength: 15,
                scrollCollapse: true,
                ordering: true,
                searching: false,
                info: false,
            });

            $("#tbl_solicitudes tfoot tr td").children().remove();
            $("#tbl_solicitudes_paginate").appendTo("#tbl_solicitudes tfoot tr td");
        }

        function format_table_leyenda() {
            $('#tbl_leyenda').DataTable({
                scrollY: "455px",
                scrollX: true,
                scrollCollapse: true,
                ordering: false,
                searching: false,
                info: false,
                bPaginate: false,
                "pageLength": 50
            });
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_helpdesk_inicio');

(function ini() {
    app_HelpDesk_Inicio.load();
    app_HelpDesk_Inicio.req_ini();
})();

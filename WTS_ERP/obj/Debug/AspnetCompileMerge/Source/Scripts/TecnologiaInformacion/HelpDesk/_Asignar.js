var app_Ticket_Asignar = (
    function (d, idpadre) {

        var ovariables_info = {
            arr_usuariotic: []
            , arr_ticketresponsable: []
            , idtiporol: 0
        }

        var ovariables = {
            idticket: 0
            , accion: ''
            , idsolicitante: 0
            , idtipovalorizacion: 0

            , arr_responsable_temp:[]
            , idresponsable_temp: 0
            , arr_sub_responsable_temp: []
        }

        function load() {
            let par = _('txtpar_ticket_asignar').value;
            if (!_isEmpty(par)) {
                ovariables.idticket = _par(par, 'idticket');
                ovariables.accion = _par(par, 'accion');
                ovariables.idsolicitante = _par(par, 'idsolicitante');
            }

            _('cbo_responsable').addEventListener('change', req_change_responsable);
            _('btn_agregar').addEventListener('click', fn_agregar_sub_responsable);

            _('btn_guardar_responsable').addEventListener('click', req_guardar);

        }

        function req_guardar() {
            swal({
                title: "Esta seguro de guardar los datos ingresados?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_guardar();
            });
        }

        function fn_guardar() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Update_Estado_Motivo';
            let oticket = _getParameter({ id: 'pnl_ticket_asignar', clase: '_enty' })
            , arr_sub_responsable = fn_obtener_sub_responsable('tbl_temp_subresponsable');
            form = new FormData();
            oticket['idticket'] = ovariables.idticket;
            oticket['accion'] = ovariables.accion;
            oticket['idsolicitante'] = ovariables.idsolicitante;
            oticket['idtipovalorizacion'] = ovariables.idtipovalorizacion;
            form.append('par', JSON.stringify(oticket));
            form.append('pardetail', JSON.stringify(arr_sub_responsable));
            Post(urlaccion, form, res_guardar);
        }

        function fn_obtener_sub_responsable(_tabla) {
            let tbl = _(_tabla), arr = [...tbl.tBodies[0].rows], obj = {}, arr_result = [];
            if (arr.length > 0) {
                arr.forEach(x=> {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    idresponsable = _par(par, 'idsubresponsable');
                    obj.idresponsable = idresponsable;
                    arr_result.push(obj);
                });
            }
            return arr_result;
        }

        function res_guardar(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success" });
                    fn_retornar();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_retornar() {
            $('#modal_Asignar').modal('hide');
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Editar', urljs = urlaccion;
            _Go_Url(urlaccion, urljs, 'idticket:' + ovariables.idticket);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { accion: 'terminar' };
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Get_Usuario_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_info.arr_usuariotic = rpta[0].usuariotic != '' ? JSON.parse(rpta[0].usuariotic) : '';
                    }
                    fn_load_info_usuario();
                }, (p) => { err(p); })
                .then(() => {
                    req_info();
                });
        }

        function fn_load_info_usuario() {
            let informacion_usuario = ovariables_info.informacion_usuario;
            ovariables.idtiporol = informacion_usuario[0].idtiporol;

            if (ovariables.idtiporol == 3) {
                _('cbo_responsable').disabled = true;
            }

        }

        function req_info() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = {
                idticket: ovariables.idticket
            }
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Get?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) { ovariables_info.arr_ticketresponsable = rpta[0].ticketresponsable != '' ? JSON.parse(rpta[0].ticketresponsable) : []; }
                    fn_load_responsable();
                    fn_load_sub_responsable();
                }, (p) => { err(p); });
        }

        function fn_load_responsable() {
            let arr_usuariotic = ovariables_info.arr_usuariotic
                , arr_ticketresponsable = ovariables_info.arr_ticketresponsable
                , responsable = arr_ticketresponsable.filter(x=>x.responsable === 'S')
                , arr_subresponsable = arr_ticketresponsable.filter(x=>x.responsable === 'N')
            , cbo_responsable = `<option value='0'>Seleccione Responsable</option>`;

            if (arr_usuariotic.length > 0) {
                arr_usuariotic.forEach(x=> { cbo_responsable += `<option value='${x.idusuario}'>${x.usuario}</option>`; });
            }

            _('cbo_responsable').innerHTML = cbo_responsable;
            
            if (responsable.length > 0) {
                _('cbo_responsable').value = responsable[0].idresponsable;
            }

            if (arr_subresponsable.length > 0) {
                let html = '';
                arr_subresponsable.forEach(x=> {
                    html += `<tr data-par='idsubresponsable:${x.idresponsable}'>
                    <td class ='text-center'><button class ="btn btn-outline btn-danger _drop"><span class ="fa fa-close"></span></button></td>
                    <td>${x.nombreresponsable}</td>
                </tr>`;
                });

                _('tbl_temp_subresponsable').tBodies[0].innerHTML = html;
                fn_tabla_agregar_evento();
            }

        }

        function req_change_responsable() {
            let idresponsable = _('cbo_responsable').value;

            fn_load_sub_responsable();
            
            if (idresponsable != '0') {
                let tabla = [..._('tbl_temp_subresponsable').tBodies[0].rows];

                if (tabla.length > 0) {
                    tabla.forEach(x=> {
                        let par = x.getAttribute('data-par');
                        par_idresponsable = _par(par, 'idsubresponsable');
                        if (par_idresponsable == idresponsable) { x.remove(); }                        
                        fn_eliminar_option(par_idresponsable);    
                    });                    
                }
            }
            else { _('tbl_temp_subresponsable').tBodies[0].innerHTML = ''; }                       
        }

        function fn_load_sub_responsable() {
            let arr_usuariotic = ovariables_info.arr_usuariotic
                , idresponsable = _('cbo_responsable').value
                , cbo_sub_responsable = `<option value='0'>Seleccione Sub Responsable</option>`;

            if (idresponsable != '0') {

                let arr_sub_responsable = arr_usuariotic.filter(x=>x.idusuario.toString() !== idresponsable);

                let tabla = [..._('tbl_temp_subresponsable').tBodies[0].rows];

                if (tabla.length > 0) {
                    tabla.forEach(x=> {
                        let par = x.getAttribute('data-par');
                        par_idresponsable = _par(par, 'idsubresponsable');
                        arr_sub_responsable = arr_sub_responsable.filter(m=> m.idusuario.toString() !== par_idresponsable);
                    });
                }

                if (arr_sub_responsable.length > 0) { arr_sub_responsable.forEach(x=> { cbo_sub_responsable += `<option value='${x.idusuario}'>${x.usuario}</option>`; }); }
            }

            _('cbo_sub_responsable').innerHTML = cbo_sub_responsable;
        }

        function fn_agregar_sub_responsable() {
            let idsubresponsable = _('cbo_sub_responsable').value, html='';
            let sub_responsable = ovariables_info.arr_usuariotic.filter(x=>x.idusuario.toString() === idsubresponsable);

            if (idsubresponsable != '0') {
                let id = sub_responsable[0].idusuario
                    , nombre = sub_responsable[0].usuario;

                html = `<tr data-par='idsubresponsable:${id}'>
                    <td class ='text-center'><button class ="btn btn-outline btn-danger _drop"><span class ="fa fa-close"></span></button></td>
                    <td>${nombre}</td>
                </tr>`;

                _('tbl_temp_subresponsable').tBodies[0].insertAdjacentHTML('beforeend', html);

                fn_tabla_agregar_evento();
                fn_eliminar_option(id);
            }
        }

        function fn_tabla_agregar_evento() {
            let tbl = _('tbl_temp_subresponsable'), arr_drop = _Array(tbl.getElementsByClassName('_drop'));

            if (arr_drop.length > 0) { arr_drop.forEach(x => x.addEventListener('click', e => { fn_tabla_controlar_eventos(e, 'drop'); })); }

        }

        function fn_tabla_controlar_eventos(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
            }            
            par = fila.getAttribute('data-par');
            fila.remove();
            fn_load_sub_responsable();
        }
        
        function fn_eliminar_option(_id) {
            let arr_select = Array.from(_('cbo_sub_responsable').options);
            arr_select.forEach(x=> { if (x.value == _id) { x.remove(); } });
        }        

        return {
            load: load
          , req_ini: req_ini
        }

    }
)(document, 'pnl_ticket_asignar');

(function ini() {
    app_Ticket_Asignar.load();
    app_Ticket_Asignar.req_ini();
})();
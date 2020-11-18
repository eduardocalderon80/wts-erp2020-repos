var app_Ticket_Nuevo = (
    function (d, idpadre) {

        var ovariables_info = {
            informacion_usuario: [],
            arr_solicitante: [],
            arr_aprobadorarea: [],
            arr_aprobadormodulo: [],
            arr_equipotic: [],
            arr_tiposolicitud: [],
            arr_prioridad: [],
            arr_categoria: [],
            arr_sistema: [],
            arr_modulo: []
        }

        var ovariables = {
            idusuario: 0,
            idtiporol: 0,
            agrupador: '',
            nivel: 0,
            codigoestado: 'PA'
        }

        function load() {

            //$('#div_fecha_solicitud .input-group.date').datepicker({
            //    autoclose: true,
            //    dateFormat: 'dd/mm/yyyy',
            //    //clearBtn: true,
            //    //firstDay: 1,
            //    todayHighlight: true
            //}).datepicker("setDate", new Date());

            fn_getDate();

            //$('#div_fecha_solicitud .input-group.date').datepicker('update', moment().format('MM/DD/YYYY'));
            
            _('btn_guardar').addEventListener('click', req_save);
            _('btn_retornar').addEventListener('click', fn_return);

            _('cbo_solicitante').addEventListener('change', req_change_solicitante);
            _('cbo_equipotic').addEventListener('change', req_change_equipotic);
            _('cbo_tiposolicitud').addEventListener('change', req_change_tiposolicitud);
            _('cbo_categoria').addEventListener('change', req_change_categoria);
            _('cbo_sistema').addEventListener('change', req_change_sistema);
            _('cbo_modulo').addEventListener('change', req_change_modulo);

            _('div_descripcion_categoria').addEventListener('click', fn_view_descripcion_categoria);
            _('file_user').addEventListener('change', fn_load_file_user);
        }

        function fn_getDate() {
            let odate = new Date();
            let mes = odate.getMonth() + 1;
            let day = odate.getDate();
            let anio = odate.getFullYear();

            if (day < 10) { day = '0' + day }
            if (mes < 10) { mes = '0' + mes }
            resultado = `${mes}/${day}/${anio}`;
            _('txt_fecha_solicitud').value = resultado;
        }

        /* Archivo */
        function fn_load_file_user(e) {
            let archivo = this.value;
            if (archivo != '') {
                let contador = fn_get_file_user('tbl_file_user');
                if (contador.length < 2) {
                    let ultimopunto = archivo.lastIndexOf(".");
                    let ext = archivo.substring(ultimopunto + 1);
                    ext = ext.toLowerCase();
                    let nombre = e.target.files[0].name, html = '';
                    let file = e.target.files;

                    html = `<tr data-par='idarchivo:0,tipoarchivo:1,modificado:1'>
                        <td class='text-center'>
                            <div class ='btn-group'>
                                <button class ='btn btn-outline btn-danger btn-sm _deletefile'>
                                    <span class ='fa fa-trash-o'></span>
                                </button>
                            </div>
                        </td>
                        <td>${nombre}</td>
                        <td class ='text-center'>
                            <div class='btn-group'>
                                <button type='button' class ='btn btn-link _download hide'>Download</button>
                            </div>
                        </td>
                        <td class='hide'></td>
                    </tr>`;

                    _('tbl_file_user').tBodies[0].insertAdjacentHTML('beforeend', html);

                    let tbl = _('tbl_file_user').tBodies[0], total = tbl.rows.length;
                    let filexd = _('file_user').cloneNode(true);
                    filexd.setAttribute('id', 'file' + (total - 1));
                    tbl.rows[total - 1].cells[3].appendChild(filexd);
                    handler_table_file_user(total);
                }
                else { swal({ title: 'Alert', text: 'Usted puede cargar como máximo 2 archivos', type: 'warning' }); }
            }
        }

        function handler_table_file_user(indice) {
            let tbl = _('tbl_file_user'), rows = tbl.rows[indice];
            rows.getElementsByClassName('_deletefile')[0].addEventListener('click', e => { controlador_table_file_user(e, 'drop'); });
            rows.getElementsByClassName('_download')[0].addEventListener('click', e => { controlador_table_file_user(e, 'download'); });
        }

        function controlador_table_file_user(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';

            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                event_tablefile_user(par, accion, fila);
            }
        }

        function event_tablefile_user(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    fila.classList.add('hide');
                    break;
                case 'download':
                    download_file_user(fila);
                    break;
            }
        }
        
        function download_file_user(fila) {
            /*
            let par = fila.getAttribute('data-par');
            let nombrearchivooriginal = fila.cells[1].innerText, nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
            let urlaccion = '../GestionProducto/Requerimiento/DescargaArchivo?pNombreArchivoOriginal=' + nombrearchivooriginal + '&pNombreArchivoGenerado=' + nombrearchivogenerado;
        
            var link = document.createElement('a');
            link.href = urlaccion;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;*/
        }

        /* General */
        function fn_return() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Inicio',
               urljs = urlaccion;
            _Go_Url(urlaccion, urljs);
        }

        function req_change_solicitante() {
            fn_load_area_solicitante();
            fn_load_aprobador();
        }

        function req_change_equipotic() {
            let idequipotic = _('cbo_equipotic').value
                , idtiposolicitud = _('cbo_tiposolicitud').value; 

            if (idequipotic == '1') {
                _('div_sistema').classList.remove('hide');
                _('div_modulo').classList.remove('hide');        
            } else {
                _('div_sistema').classList.add('hide');
                _('div_modulo').classList.add('hide');
            }
           
            fn_load_categoria();
            fn_load_sistema();
            fn_load_aprobador();
        }

        function req_change_tiposolicitud() {
            fn_load_categoria();
            fn_load_aprobador();
        }

        function req_change_categoria() {
            fn_load_aprobador();
        }

        function req_change_sistema() {
            fn_load_modulo();
            fn_load_aprobador();
        }

        function req_change_modulo() {
            fn_load_aprobador();
        }
                
        function fn_view_descripcion_categoria() {
            let idcategoria = _('cbo_categoria').value;
            if (idcategoria != '0') {
                let result = ovariables_info.arr_categoria.filter(z=>z.idcategoria.toString() === idcategoria);
                let categoria = _('cbo_categoria').options[_('cbo_categoria').selectedIndex].text;
                let descripcion = result[0].descripcion;
                swal({ title: categoria, text: descripcion });
            }
        }

        function required_item(oenty) {
            let divformulario = _(oenty.id), resultado = true;
            let item_clase = divformulario.getElementsByClassName(oenty.clase);
            let arr_item = Array.prototype.slice.apply(item_clase);
            arr_item.forEach(x=> {
                valor = x.value, att = x.getAttribute('data-required'),
                cls_select2 = x.classList.contains('_select2'),
                padre = x.parentNode.parentNode;
                if (!padre.classList.contains('hide')) {
                    if (att) {
                        if ((valor == '') || (valor == '0' && cls_select2 == true))
                        { padre.classList.add('has-error'); resultado = false; }
                        else { padre.classList.remove('has-error'); }
                    }
                }
            })
            return resultado;
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { accion: 'nuevo' };
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Get_Usuario_Informacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_info.informacion_usuario = rpta[0].informacion_usuario != '' ? JSON.parse(rpta[0].informacion_usuario) : '';
                        ovariables_info.arr_solicitante = rpta[0].solicitante != '' ? JSON.parse(rpta[0].solicitante) : '';
                        ovariables_info.arr_aprobadorarea = rpta[0].aprobadorarea != '' ? JSON.parse(rpta[0].aprobadorarea) : [];
                        ovariables_info.arr_aprobadormodulo = rpta[0].aprobadormodulo != '' ? JSON.parse(rpta[0].aprobadormodulo) : [];
                        ovariables_info.arr_equipotic = rpta[0].equipotic != '' ? JSON.parse(rpta[0].equipotic) : [];
                        ovariables_info.arr_tiposolicitud = rpta[0].tiposolicitud != '' ? JSON.parse(rpta[0].tiposolicitud) : [];
                        ovariables_info.arr_prioridad = rpta[0].prioridad != '' ? JSON.parse(rpta[0].prioridad) : [];
                        ovariables_info.arr_categoria = rpta[0].categoria != '' ? JSON.parse(rpta[0].categoria) : [];
                        ovariables_info.arr_sistema = rpta[0].sistema != '' ? JSON.parse(rpta[0].sistema) : [];
                        ovariables_info.arr_modulo = rpta[0].modulo != '' ? JSON.parse(rpta[0].modulo) : [];
                    }
                    fn_load_informacion_usuario();
                    fn_load_solicitante();
                    fn_load_area_solicitante();
                    fn_load_equipotic();
                    fn_load_tiposolicitud();
                    fn_load_prioridad();
                    fn_load_categoria();
                    fn_load_sistema();
                    fn_load_modulo();
                }, (p) => { err(p); });
        }

        function fn_load_informacion_usuario() {
            let informacion_usuario = ovariables_info.informacion_usuario;

            ovariables.idusuario = informacion_usuario[0].idusuario;
            ovariables.idtiporol = informacion_usuario[0].idtiporol;
            ovariables.agrupador = informacion_usuario[0].agrupador;
            ovariables.nivel = informacion_usuario[0].nivel;
        }

        function fn_load_solicitante() {
            let arr_solicitante = ovariables_info.arr_solicitante,
                resultado_solicitante = [], cbo_solicitante = '';

            if (ovariables.nivel == 0) { _('cbo_solicitante').disabled = true; }

            resultado_solicitante = arr_solicitante.filter(x=> x.idsolicitante === ovariables.idusuario);

            arr_solicitante.forEach(x=> { cbo_solicitante += `<option value='${x.idsolicitante}'>${x.solicitante}</option>`; });
            _('cbo_solicitante').innerHTML = cbo_solicitante;

            if (resultado_solicitante.length > 0) {
                _('cbo_solicitante').value = resultado_solicitante[0].idsolicitante;
            }

        }

        function fn_load_area_solicitante() {
            let arr_solicitante = ovariables_info.arr_solicitante
                , idsolicitante = _('cbo_solicitante').value;

            let resultado_solicitante = arr_solicitante.filter(x=> x.idsolicitante.toString() === idsolicitante );
            let idarea = resultado_solicitante[0].idarea,
                area_solicitante = resultado_solicitante[0].areasolicitante;

            let cbo_area_solicitante = `<option value='${idarea}'>${area_solicitante}</option>`;

            _('cbo_area_solicitante').innerHTML = cbo_area_solicitante;
        }

        function fn_load_equipotic() {
            let arr_equipotic = ovariables_info.arr_equipotic
                , cbo_equipotic = `<option value='0'>Seleccione</option>`;

            if (arr_equipotic.length > 0) { arr_equipotic.forEach(x=> { cbo_equipotic += `<option value='${x.idequipotic}'>${x.equipotic}</option>`; }); }

            _('cbo_equipotic').innerHTML = cbo_equipotic;
        }

        function fn_load_tiposolicitud() {
            let arr_tiposolicitud = ovariables_info.arr_tiposolicitud
               , cbo_tiposolicitud = `<option value='0'>Seleccione</option>`;

            if (arr_tiposolicitud.length > 0) { arr_tiposolicitud.forEach(x=> { cbo_tiposolicitud += `<option value='${x.idtiposolicitud}'>${x.tiposolicitud}</option>`; }); }

            _('cbo_tiposolicitud').innerHTML = cbo_tiposolicitud;
        }

        function fn_load_prioridad() {
            let arr_prioridad = ovariables_info.arr_prioridad,
                cbo_prioridad = ``;

            if (arr_prioridad.length > 0) { arr_prioridad.forEach(x=> { cbo_prioridad += `<option value='${x.idprioridad}'>${x.prioridad}</option>`; }); }

            _('cbo_prioridad').innerHTML = cbo_prioridad;
        }

        function fn_load_categoria() {
            let arr_categoria = ovariables_info.arr_categoria
                , idequipotic = _('cbo_equipotic').value, idtiposolicitud = _('cbo_tiposolicitud').value
                , resultado_categoria = [], cbo_categoria = `<option value='0'>Seleccione Categoria</option>`;

            if (ovariables.idtiporol > 0 && ovariables.agrupador == 'N') { resultado_categoria = arr_categoria.filter(x=>x.idequipotic.toString() === idequipotic && x.idtiposolicitud.toString() === idtiposolicitud); }
            else { resultado_categoria = arr_categoria.filter(x=>x.idequipotic.toString() === idequipotic && x.idtiposolicitud.toString() === idtiposolicitud && x.visualizacion === 'S'); }

            if (resultado_categoria.length > 0) { resultado_categoria.forEach(x => { cbo_categoria += `<option value='${x.idcategoria}'>${x.categoria}</option>` }); }

            _('cbo_categoria').innerHTML = cbo_categoria;
        }

        function fn_load_sistema() {
            let arr_sistema = ovariables_info.arr_sistema,
              cbo_sistema = ``;

            if (arr_sistema.length > 0) { arr_sistema.forEach(x=> { cbo_sistema += `<option value='${x.idsistema}'>${x.sistema}</option>`; }); }

            _('cbo_sistema').innerHTML = cbo_sistema;
        }

        function fn_load_modulo() {
            let arr_modulo = ovariables_info.arr_modulo
                , idsistema = _('cbo_sistema').value, resultado_modulo = []
                , cbo_modulo = `<option value='0'>Seleccione Modulo</option>`;

            resultado_modulo = arr_modulo.filter(x=> x.idsistema.toString() === idsistema);
            if (resultado_modulo.length > 0) { resultado_modulo.forEach(x=> { cbo_modulo += `<option value='${x.idmodulo}'>${x.modulo}</option>`; }); }

            _('cbo_modulo').innerHTML = cbo_modulo;
        }

        function fn_load_aprobador() {
            let arr_aprobadorarea = ovariables_info.arr_aprobadorarea
                , arr_aprobadormodulo = ovariables_info.arr_aprobadormodulo
                , arr_categoria = ovariables_info.arr_categoria
                , idsolicitante = _('cbo_solicitante').value
                , idareasolicitante = _('cbo_area_solicitante').value
                , idequipotic = _('cbo_equipotic').value
                , idtiposolicitud = _('cbo_tiposolicitud').value
                , idcategoria = _('cbo_categoria').value
                , idmodulo = _('cbo_modulo').value
                , resultado_aprobador = [], resultado_categoria = [];

            let html = '', firmado, btn_estado = '';

            if (idequipotic == '1') {
                resultado_aprobador = arr_aprobadormodulo.filter(x=> x.idmodulo.toString() === idmodulo);
            }
            else {
                resultado_aprobador = arr_aprobadorarea.filter(x=> x.idarea.toString() === idareasolicitante);
            }

            resultado_categoria = arr_categoria.filter(x=>x.idcategoria.toString() === idcategoria);
            categoriaaprobacion = resultado_categoria.length > 0 && idcategoria != '0' ? resultado_categoria[0].aprobacion : 'S';

            resultado_aprobador.forEach(x=> {
                if (x.idusuario.toString() == idsolicitante || idtiposolicitud == '1' || categoriaaprobacion == 'N') {
                    firmado = 'S';
                    btn_estado = `<button class='btn btn-outline btn-primary'><span class ='fa fa-check-circle'></span></button>`
                }
                else {
                    firmado = 'N';
                    btn_estado = `<button class='btn btn-outline btn-danger'><span class ='fa fa-clock-o'></span></button>`;
                }

                html += `<tr data-par='idaprobador:${x.idaprobador},firmado:${firmado}'>
                        <td class ='cols-sm-2 text-center'>${btn_estado}</td>
                        <td class ='cols-sm-5'>${x.aprobador}</td>
                        <td class ='cols-sm-4'>${x.correoaprobador}</td>
                    <tr>`
            });

            _('tbl_aprobador').tBodies[0].innerHTML = html;

            if (idtiposolicitud == '2') {
                _('div_tabla_aprobador').classList.remove('hide');
            }
            else{
                _('div_tabla_aprobador').classList.add('hide');
            }

        }

        /* Save */
        function req_save(){
            let req = required_item({ id: 'pnl_ticket_nuevo_formulario', clase: '_enty' });
            if (req) {
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
                    req_insert();
                });
            }
            else { swal({ title: "Advertencia!!", text: "Debe ingresar los campos requeridos", type: "warning" }); }
        }

        function req_insert() {
            let urlaccion = 'TecnologiaInformacion/HelpDesk/Ticket_Insert';

            let oticket = _getParameter({ id: 'tab-registro', clase: '_enty' })
                , arr_aprobador = fn_get_aprobador('tbl_aprobador')
                , arr_file_user = fn_get_file_user('tbl_file_user');
            form = new FormData();
            oticket['codigoestado'] = ovariables.codigoestado;
            form.append('par', JSON.stringify(oticket));
            form.append('pardetail', JSON.stringify(arr_aprobador));
            form.append('parsubdetail', JSON.stringify(arr_file_user));

            tabla = _('tbl_file_user').tBodies[0];

            let totalarchivos = tabla.rows.length, arrFile = [];
            for (let i = 0; i < totalarchivos; i++) {
                let row = tabla.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];
                if (estamodificado == 1 && clsrow == undefined) {
                    let archivo = tabla.rows[i].cells[3].children[0].files[0];
                    archivo.modificado = 1;
                    form.append('file' + i, archivo);
                }
            }

            Post(urlaccion, form, res_insert);
        }

        function res_insert(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Buen Trabajo!", text: "Usted ha actualizado este registro correctamente", type: "success", timer: 2000, });
                    fn_return();
                };
                if (orpta.estado === 'error') { swal({ title: "Existe un problema!", text: "Debe comunicarse con el administrador TIC", type: "error" }); }
            }
        }

        function fn_get_aprobador(_idtable) {
            let table = _(_idtable), array = [...table.tBodies[0].rows], arr_result = [], obj = {};
            if (array.length > 0) {
                array.forEach(x=> {
                    obj = {};
                    let par = x.getAttribute('data-par');
                    if (par != null) {
                        idaprobador = _par(par, 'idaprobador'),
                        firmado = _par(par, 'firmado');
                        obj.idaprobador = idaprobador;
                        obj.firmado = firmado;
                        arr_result.push(obj);
                    }
                });
            }

            if (arr_result.length > 0) {
                let codigoestado = arr_result.some(x=> { if (x.firmado === 'N') { return true } });
                if (codigoestado) { ovariables.codigoestado = 'PP'; } else { ovariables.codigoestado = 'PA'; }
            }
            else { ovariables.codigoestado = 'PA'; }

            return arr_result;
        }

        function fn_get_file_user(table) {
            let tbl = _(table).tBodies[0], totalfilas = tbl.rows.length, row = null, arr = [];

            for (let i = 0; i < totalfilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), estamodificado = _par(par, 'modificado'), clsrow = row.classList[0];

                if (estamodificado == 1 && clsrow == undefined) {
                    let obj = {
                        idarchivo: parseInt(_par(par, 'idarchivo')),
                        tipoarchivo: parseInt(_par(par, 'tipoarchivo')),
                        nombrearchivooriginal: row.cells[1].innerText,
                        modificado: parseInt(_par(par, 'modificado'))
                    }
                    arr.push(obj);
                }
            }
            return arr;
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_ticket_nuevo');

(function ini() {
    app_Ticket_Nuevo.load();
    app_Ticket_Nuevo.req_ini();
})();

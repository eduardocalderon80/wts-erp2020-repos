var app_Destino_New = (
    function (d, idpadre) {

        var ovariables_info = {
            arr_cliente: []
            , arr_anio: []
            , arr_cliente_temporada: []
            , arr_cliente_temporada_actual: []
        }

        var ovariables = {
            accion: 'nuevo'
        }

        function load() {
            $('.footable').footable();
            $('.footable').trigger('footable_resize');

            _('btn_agregar').addEventListener('click', fn_agregar);
            _('btn_guardar').addEventListener('click', fn_agregar);

        }

        function req_ini() {
           
        }

        function fn_agregar() {
            let item = _('txt_descripcion').value
            , tipounidad = _('cbo_tipounidad').value
            , cantidad = _('txt_cantidad').value;

            //<td>
            //    <button title="Eliminar" type="button" class ="btn btn-outline btn-danger _delete_direccion">
            //        <span class ="fa fa-remove _delete_direccion"></span>
            //    </button>
            //</td>

            //<span class ='fa fa-remove _delete_direccion' title='Eliminar' style='color:red;font-size:13pt;'></span>

            let html = `<tr>
                            <td class ='text-center m-t-md'>                                 
                                <button title="Eliminar" type="button" class ="btn btn-outline btn-danger _delete_item">
                                    <span class ="fa fa-remove _delete_item"></span>
                                </button>
                            </td>
                            </td>
                            <td>${item}</td>
                            <td>${tipounidad}</td>
                            <td><input type="text" name="status" class ="form-control _enter_item text-right" value="${cantidad}"></td>
                        </tr>`

            _('tbl_detalle').tBodies[0].insertAdjacentHTML('afterbegin', html);
            //_('tbl_detalle').tBodies[0].insertAdjacentHTML('beforeend', html);

            handler_table();

            _('txt_descripcion').value = ''
            _('cbo_tipounidad').value = 1
            _('txt_cantidad').value = ''

        }

        function handler_table() {
            let tbl = _('tbl_detalle'), arr_edit = _Array(tbl.getElementsByClassName('_enter_item')),
            arr_delete = _Array(tbl.getElementsByClassName('_delete_item'));

            arr_delete.forEach(x => x.addEventListener('click', e => { control_accion(e, 'delete'); }));
            arr_edit.forEach(x => x.addEventListener('click', e => { control_accion(e, 'enter'); }));

        }

        function control_accion(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';
            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode;
                    break;
                case 'INPUT':
                    fila = o.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
            }

            if (fila != null) {
                par = fila.getAttribute('data-par');
                control_event(par, accion, fila);
            }
        }

        function control_event(par, accion, fila) {
            let numrow = fila.rowIndex;
            switch (accion) {
                case 'delete':
                    _('tbl_detalle').deleteRow(numrow);
                    break;
                case 'enter':
                    //_(tbl_detalle).
                    //let row = fila.rowIndex
                    break;
            }
        }

        return {
            load: load,
            req_ini: req_ini
        }

    }
)(document, 'pnl_client_season_new_formulario');


(function ini() {
    app_Destino_New.load();
    app_Destino_New.req_ini();
})();
var appCreartipotenido = (
    function (d, idpadre) {

        var ovariables = {
           
        }

        function load() {
            _('_btn_addtipotenido').addEventListener('click', fn_addtipotenido);
            _('_btnSave_creartipotenido').addEventListener('click', save_new_tipotenido);
        }

        function fn_addtipotenido() {
            let html = '';
            html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_tipotenido'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>           
                <td>
                    <input type='text' class ='_cls_nombretipotenido form-control'/>
                </td>              
                </tr>`;
            _('tblBody_tipotenido').insertAdjacentHTML('beforeend', html);
            let ultimafila = _('tblBody_tipotenido').rows.length;
            handler_tbl_tipotenido(ultimafila - 1);            
        }

        function validar_tipotenido() {
            let tblbody = _('tblBody_tipotenido'), mensaje = '', pasalavalidacion = true, totalfilas = tblbody.rows.length;

            if (totalfilas <= 0) {
                pasalavalidacion = false;             
                mensaje += '- No exists row \n';
            }

            let arrfilas = [...tblbody.rows];
            arrfilas.forEach(x => {              
                let nombre = x.getElementsByClassName('_cls_nombretipotenido')[0], fila= x.rowIndex;
              
                if (nombre.value == '') {
                    mensaje += '- You must write a name in row ' + fila + '\n';
                    pasalavalidacion = false;
                }
            });

            if (pasalavalidacion == false) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return pasalavalidacion;
        }

        function save_new_tipotenido() {
            let bValida = validar_tipotenido();
            if (bValida) {
                let tipotenido = getarray_tipotenido(), data = {x:1};

                let frmData = new FormData();
                frmData.append('par', JSON.stringify(data));
                frmData.append('pardetail', JSON.stringify(tipotenido));
                
                Post('DesarrolloTextil/Atx/save_tipotenido', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? JSON.parse(orpta.data) : null;
                    if (odata !== null) {                        
                        cbotipotenido = CSVtoJSON(odata[0].tipotenido);
                        //_('cbotipotenido').innerHTML = '';
                        //_('cbotipotenido').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cbotipotenido, 'idtipotenido', 'nombretipotenido');
                        appAtxView.ovariables.lsttipotenido = cbotipotenido;
                        appAtxView.refrescar_combo_af_aq_despues_crear('cbotipotenido', cbotipotenido,'tt');
                        _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                        $('#modal__Creartipotenido').modal('hide');
                    }
                });
            }
        }

        function getarray_tipotenido() {
            let tblbody = _('tblBody_tipotenido'), arrfilas = [...tblbody.rows], arrdata = [];
            arrfilas.forEach(x => {
                let nombre = x.getElementsByClassName('_cls_nombretipotenido')[0].value;
                let obj = {
                    nombre: nombre                    
                }
                arrdata.push(obj);
            });
            return arrdata;
        }

        function handler_tbl_tipotenido(indexfila) {
            let tblbody = _('tblBody_tipotenido'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_tipotenido')[0];
            btndelete.addEventListener('click', _fn_deletetipotenido);
        }

        function _fn_deletetipotenido(e) {
            let o = e.currentTarget, tag = o.tagName, fila = null;
            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
            }
            if (fila !== null) {
                fila.parentNode.removeChild(fila);
            }
        }

        function err(__err) {
            console.log('err', __err);
        }

        function req_ini() {
         
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_creartipotenido');

(
    function init() {
        appCreartipotenido.load();
        appCreartipotenido.req_ini();
    }
)();
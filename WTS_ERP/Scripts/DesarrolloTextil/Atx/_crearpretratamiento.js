var appCrearpretratamiento = (
    function (d, idpadre) {

        var ovariables = {
           
        }

        function load() {
            _('_btn_addpretratamiento').addEventListener('click', fn_addpretratamiento);
            _('_btnSave_crearpretratamiento').addEventListener('click', save_new_pretratamiento);
        }

        function fn_addpretratamiento() {
            let html = '';
            html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_pretratamiento'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>           
                <td>
                    <input type='text' class ='_cls_nombrepretratamiento form-control'/>
                </td>              
                </tr>`;
            _('tblBody_pretratamiento').insertAdjacentHTML('beforeend', html);
            let ultimafila = _('tblBody_pretratamiento').rows.length;
            handler_tbl_pretratamiento(ultimafila - 1);            
        }

        function validar_pretratamiento() {
            let tblbody = _('tblBody_pretratamiento'), mensaje = '', pasalavalidacion = true, totalfilas = tblbody.rows.length;

            if (totalfilas <= 0) {
                pasalavalidacion = false;             
                mensaje += '- No exists row \n';
            }

            let arrfilas = [...tblbody.rows];
            arrfilas.forEach(x => {              
                let nombre = x.getElementsByClassName('_cls_nombrepretratamiento')[0], fila= x.rowIndex;
              
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

        function save_new_pretratamiento() {
            let bValida = validar_pretratamiento();
            if (bValida) {
                let pretratamiento = getarray_pretratamiento(), data = {x:1};

                let frmData = new FormData();
                frmData.append('par', JSON.stringify(data));
                frmData.append('pardetail', JSON.stringify(pretratamiento));
                
                Post('DesarrolloTextil/Atx/save_pretratamiento', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? JSON.parse(orpta.data) : null;
                    if (odata !== null) {                        
                        cbopretratamiento = CSVtoJSON(odata[0].pretratamiento);
                        //_('cbopretratamiento').innerHTML = '';
                        //_('cbopretratamiento').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cbopretratamiento, 'idpretratamiento', 'nombrepretratamiento');
                        appAtxView.ovariables.lstpretratamiento = cbopretratamiento;
                        appAtxView.refrescar_combo_af_aq_despues_crear('cbopretratamiento', cbopretratamiento,'pr');
                        _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                        $('#modal__CrearPretratamiento').modal('hide');
                    }
                });
            }
        }

        function getarray_pretratamiento() {
            let tblbody = _('tblBody_pretratamiento'), arrfilas = [...tblbody.rows], arrdata = [];
            arrfilas.forEach(x => {
                let nombre = x.getElementsByClassName('_cls_nombrepretratamiento')[0].value;
                let obj = {
                    nombre: nombre                    
                }
                arrdata.push(obj);
            });
            return arrdata;
        }

        function handler_tbl_pretratamiento(indexfila) {
            let tblbody = _('tblBody_pretratamiento'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_pretratamiento')[0];
            btndelete.addEventListener('click', _fn_deletepretratamiento);
        }

        function _fn_deletepretratamiento(e) {
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
)(document, 'panelEncabezado_crearpretratamiento');

(
    function init() {
        appCrearpretratamiento.load();
        appCrearpretratamiento.req_ini();
    }
)();
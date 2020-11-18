var appCrearAcabadoFisico = (
    function (d, idpadre) {

        var ovariables = {
           
        }

        function load() {
            _('_btn_addacabadofisico').addEventListener('click', fn_addacabadofisico);
            _('_btnSave_crearacabadofisico').addEventListener('click', save_new_acabadofisico);
        }

        function fn_addacabadofisico() {
            let html = '';
            html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_acabadofisico'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>           
                <td>
                    <input type='text' class ='_cls_nombreacabadofisico form-control'/>
                </td>              
                </tr>`;
            _('tblBody_acabadofisico').insertAdjacentHTML('beforeend', html);
            let ultimafila = _('tblBody_acabadofisico').rows.length;
            handler_tbl_acabadofisico(ultimafila - 1);            
        }

        function validar_acabadofisico() {
            let tblbody = _('tblBody_acabadofisico'), mensaje = '', pasalavalidacion = true, totalfilas = tblbody.rows.length;

            if (totalfilas <= 0) {
                pasalavalidacion = false;             
                mensaje += '- No exists row \n';
            }

            let arrfilas = [...tblbody.rows];
            arrfilas.forEach(x => {              
                let nombre = x.getElementsByClassName('_cls_nombreacabadofisico')[0], fila= x.rowIndex;
              
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

        function save_new_acabadofisico() {
            let bValida = validar_acabadofisico();
            if (bValida) {
                let acabadofisico = getarray_acabadofisico(), data = {x:1};

                let frmData = new FormData();
                frmData.append('par', JSON.stringify(data));
                frmData.append('pardetail', JSON.stringify(acabadofisico));
                
                Post('DesarrolloTextil/Atx/save_acabadofisico', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? JSON.parse(orpta.data) : null;
                    if (odata !== null) {                        
                        cboacabadofisico = CSVtoJSON(odata[0].acabadofisico);
                        //_('cboacabadofisico').innerHTML = '';
                        //_('cboacabadofisico').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cboacabadofisico, 'idacabadofisico', 'nombreacabadofisico');
                        appAtxView.ovariables.lstacabadofisico = cboacabadofisico;
                        appAtxView.refrescar_combo_af_aq_despues_crear('cboacabadofisico', cboacabadofisico, 'af');
                        _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                        $('#modal__CrearAcabadoFisico').modal('hide');
                    }
                });
            }
        }

        function getarray_acabadofisico() {
            let tblbody = _('tblBody_acabadofisico'), arrfilas = [...tblbody.rows], arrdata = [];
            arrfilas.forEach(x => {
                let nombre = x.getElementsByClassName('_cls_nombreacabadofisico')[0].value;
                let obj = {
                    nombre: nombre                    
                }
                arrdata.push(obj);
            });
            return arrdata;
        }

        function handler_tbl_acabadofisico(indexfila) {
            let tblbody = _('tblBody_acabadofisico'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_acabadofisico')[0];
            btndelete.addEventListener('click', _fn_deleteacabadofisico);
        }

        function _fn_deleteacabadofisico(e) {
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
)(document, 'panelEncabezado_crearacabadofisico');

(
    function init() {
        appCrearAcabadoFisico.load();
        appCrearAcabadoFisico.req_ini();
    }
)();
var appCrearAcabadoQuimico = (
    function (d, idpadre) {

        var ovariables = {
           
        }

        function load() {
            _('_btn_addacabadoquimico').addEventListener('click', fn_addacabadoquimico);
            _('_btnSave_crearacabadoquimico').addEventListener('click', save_new_acabadoquimico);
        }

        function fn_addacabadoquimico() {
            let html = '';
            html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class ='btn btn-xs btn-danger _cls_delete_acabadoquimico'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>           
                <td>
                    <input type='text' class ='_cls_nombreacabadoquimico form-control'/>
                </td>              
                </tr>`;
            _('tblBody_acabadoquimico').insertAdjacentHTML('beforeend', html);
            let ultimafila = _('tblBody_acabadoquimico').rows.length;
            handler_tbl_acabadoquimico(ultimafila - 1);
        }

        function handler_tbl_acabadoquimico(indexfila) {
            let tblbody = _('tblBody_acabadoquimico'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_acabadoquimico')[0];
            btndelete.addEventListener('click', _fn_deleteacabadoquimico);
        }

        function _fn_deleteacabadoquimico(e) {
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

        function validar_acabadoquimico() {
            let tblbody = _('tblBody_acabadoquimico'), mensaje = '', pasalavalidacion = true, totalfilas = tblbody.rows.length;

            if (totalfilas <= 0) {
                pasalavalidacion = false;
                mensaje += '- No exists row \n';
            }

            let arrfilas = [...tblbody.rows];
            arrfilas.forEach(x => {
                let nombre = x.getElementsByClassName('_cls_nombreacabadoquimico')[0], fila = x.rowIndex;

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

        function save_new_acabadoquimico() {
            let bValida = validar_acabadoquimico();
            if (bValida) {
                let acabadoquimico = getarray_acabadoquimico(), data = { x: 1 };

                let frmData = new FormData();
                frmData.append('par', JSON.stringify(data));
                frmData.append('pardetail', JSON.stringify(acabadoquimico));

                Post('DesarrolloTextil/Atx/save_acabadoquimico', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null , odata = orpta !== null ? JSON.parse(orpta.data) : null;
                    if (odata !== null) {                         
                        cboacabadoquimico = CSVtoJSON(odata[0].acabadoquimico);
                        //_('cboacabadoquimico').innerHTML = '';
                        //_('cboacabadoquimico').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(cboacabadoquimico, 'idacabadoquimico', 'nombreacabadoquimico');
                        appAtxView.ovariables.lstacabadoquimico = cboacabadoquimico;
                        appAtxView.refrescar_combo_af_aq_despues_crear('cboacabadoquimico', cboacabadoquimico, 'aq');
                        _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                        $('#modal__CrearAcabadoQuimico').modal('hide');
                    }
                });
            }
        }

        function getarray_acabadoquimico() {
            let tblbody = _('tblBody_acabadoquimico'), arrfilas = [...tblbody.rows], arrdata = [];
            arrfilas.forEach(x => {
                let nombre = x.getElementsByClassName('_cls_nombreacabadoquimico')[0].value;
                let obj = {
                    nombre: nombre
                }
                arrdata.push(obj);
            });
            return arrdata;
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
)(document, 'panelEncabezado_crearacabadoquimico');

(
    function init() {
        appCrearAcabadoQuimico.load();
        appCrearAcabadoQuimico.req_ini();
    }
)();
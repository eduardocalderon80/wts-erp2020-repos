var appCrearGalgaDiametro = (
    function (d, idpadre) {
        var ovariables = {
           idgalga:0
        }

        function load() {
            _('_btn_addgalgadiametro').addEventListener('click', fn_addgalgadiametro);
            _('_btnSave_creargalgadiametro').addEventListener('click', save_new_galgadiametro);
        }

        function fn_addgalgadiametro() {
            let html = '';
            html = `<tr data-par='idgalgadiametro:0'>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_galgadiametro'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>           
                <td>
                    <input type='text' class ='_cls_diametro form-control' placeholder='0' onkeypress='return DigitimosDecimales(event, this)'/>
                </td>
                <td>
                    <input type='text' class ='_cls_numeroagujas form-control' placeholder='0' onkeypress='return DigitimosDecimales(event, this)'/>
                </td>
                </tr>`;
            _('tblBody_galgadiametro').insertAdjacentHTML('beforeend', html);
            let ultimafila = _('tblBody_galgadiametro').rows.length;
            handler_tbl_galgadiametro(ultimafila - 1);            
        }

        function validar_galgadiametro() {
            let tblbody = _('tblBody_galgadiametro'), mensaje = '', pasalavalidacion = true, totalfilas = tblbody.rows.length, galga = $('#txtGalga').val();
            if ($.trim(galga).length <= 0 || galga == 0) {
                pasalavalidacion = false;             
                mensaje += '- You must register gauge \n';
            }
            if (totalfilas <= 0) {
                pasalavalidacion = false;
                mensaje += '- No exists row \n';
            }
            let arrfilas = [...tblbody.rows];
                arrfilas.forEach(x => {              
                let diametro = x.getElementsByClassName('_cls_diametro')[0], fila = x.rowIndex, agujas = x.getElementsByClassName('_cls_numeroagujas')[0];
              
                if (diametro.value == '') {
                    mensaje += '- review diameter in row ' + fila + '\n';
                    pasalavalidacion = false;
                }
                if (agujas.value == '') {
                    mensaje += '- review agujas in row ' + fila + '\n';
                    pasalavalidacion = false;
                }
            });
            if (pasalavalidacion == false) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }
            return pasalavalidacion;
        }

        function save_new_galgadiametro() {
            let bValida = validar_galgadiametro();
            if (bValida) {
                let galga = $('#txtGalga').val(), galgadiametro = getarray_galgadiametro(), data = { idgalga: ovariables.idgalga, galga: galga };

                let frmData = new FormData();
                frmData.append('par', JSON.stringify(data));
                frmData.append('pardetail', JSON.stringify(galgadiametro));
                
                Post('DesarrolloTextil/Atx/save_galgadiametro', frmData, function (rpta) {
                    let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? JSON.parse(orpta.data) : null;
                    if (odata !== null) {                    
                       galga = CSVtoJSON(odata[0].galga);
                       _('cbogalga').innerHTML = '';
                       _('cbogalga').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(galga, 'idgalga', 'nombregalga');
                       
                       diametrogalga = CSVtoJSON(odata[0].diametrogalga);
                       appAtxView.ovariables.lst_cbo_diametrogalga = diametrogalga;
                       _('cbodiameter').innerHTML = '';
                       
                       if (ovariables.idgalga > 0) {
                           _('cbogalga').value = ovariables.idgalga;
                           let lst = appAtxView.ovariables.lst_cbo_diametrogalga.filter(x => x.idgalga === ovariables.idgalga);
                           if (lst.length > 0) {
                               _('cbodiameter').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lst, 'idgalgadiametro', 'diametro');
                               _('txtnumeroaguja').value = '';
                           }                          
                       }

                       _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                       $('#modal__CrearGalgaDiametro').modal('hide');
                    }
                });
            }
        }

        function getarray_galgadiametro() {
            let tblbody = _('tblBody_galgadiametro'), arrfilas = [...tblbody.rows], arrdata = [];
            arrfilas.forEach(x => {
                let diametro = x.getElementsByClassName('_cls_diametro')[0].value, agujas = x.getElementsByClassName('_cls_numeroagujas')[0].value, par = x.getAttribute('data-par'), idgalgadiametro = _par(par, 'idgalgadiametro');
                let obj = {
                    idgalgadiametro:idgalgadiametro,
                    diametro: diametro,
                    agujas: agujas
                }
                arrdata.push(obj);
            });
            return arrdata;
        }

        function handler_tbl_galgadiametro(indexfila) {
            let tblbody = _('tblBody_galgadiametro'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_galgadiametro')[0];
            btndelete.addEventListener('click', _fn_deletegalgadiametro);
        }

        function _fn_deletegalgadiametro(e) {
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
            let par = _('txtpar_creargalgadiametro').value, paruncode = appAtxView._parameterUncodeJSON(par), parjson = JSON.parse(paruncode);
                ovariables.idgalga = parjson.idgalga, galga = parjson.galga;
                if (ovariables.idgalga > 0) {
                    _('txtGalga').value = galga;
                    $("#txtGalga").prop("disabled", true);
                    Get('DesarrolloTextil/Atx/getDataGalgaDiametro', res_ini)
                }             
        }

        function res_ini(rpta) {
            let orpta = rpta != '' ? JSON.parse(rpta) : null, lst_galgadiametro =[],  html = '';
             diametrogalga = CSVtoJSON(orpta[0].diametrogalga)
            lst_galgadiametro = diametrogalga.filter(x => x.idgalga === ovariables.idgalga);
            console.log(lst_galgadiametro)
            if (lst_galgadiametro != null) {
                lst_galgadiametro.forEach(x => {
                    html += `<tr  data-par='idgalgadiametro:${x.idgalgadiametro}'>
                            <td></td>
                            <td>
                                <input type='text' class ='_cls_diametro form-control' value='${x.diametro}' disabled />
                            </td>
                            <td>
                                <input type='text' class ='_cls_numeroagujas form-control'value='${x.agujas}' disabled/>
                            </td>
                </tr>
                `;
                });
                _('tblBody_galgadiametro').innerHTML = html;               
            }
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_creargalgadiametro');
(
    function init() {
        appCrearGalgaDiametro.load();
        appCrearGalgaDiametro.req_ini();
    }
)();
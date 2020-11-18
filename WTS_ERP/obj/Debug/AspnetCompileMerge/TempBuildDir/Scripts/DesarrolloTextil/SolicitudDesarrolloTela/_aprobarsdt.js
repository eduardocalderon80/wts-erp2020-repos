var appAprobarSDT = (
    function (d, idpadre) {
        var ovariables = {
                idgrupocomercial: ''
        }
        var err_xhr = (__err) => {
            console.log('err', __err);
        }

        function load() {
            let par = _('txtpar_aprobarsdt').value;
            ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
            
            d.getElementById('_btn_aprobarsdt').addEventListener('click', function () {
                fn_aprobar(1);
            });
            d.getElementById('_btn_rechazarsdt').addEventListener('click', function(){
                fn_aprobar(0);
             });
            d.getElementById('chktable').addEventListener('change', marcarchecktable);
        }
        
        function marcarchecktable(e) {
            if (e.target.checked) {
                $("._clschk").each(function () {
                    $(this).prop("checked", true);
                });
            } else {
                $("._clschk").each(function () {
                    $(this).prop("checked", false);
                });
            }
        }

        function fn_aprobar(val) {
            let mensaje = '', msjaprrech = val === 1 ? 'aprobar' : 'rechazar' 
                validar = validarantesgrabar();
            if (validar.pasavalidacion == true) {
                let aprobar = () => {
                    let par = { x: 1 , value:val}, detalle = getchk()
                           frm = new FormData();
                            
                    frm.append('par', JSON.stringify(par));
                    frm.append('pardetalle', JSON.stringify(detalle));

                    _Post('DesarrolloTextil/SolicitudDesarrolloTela/AprobarSDT', frm)
                      .then((odata) => {
                          let rpta = odata !== '' ? JSON.parse(odata) : null;
                          _swal({ mensaje: rpta.mensaje, estado: rpta.estado });
                          if (rpta.estado = 'success') {
                              $('#modal__AprobarSDT').modal('hide');
                          }
                          
                      }, (p) => {
                          err(p);
                      });
                }

                swal({
                    title: "¿Estás seguro de "+ msjaprrech +" la solicitud?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No"

                }, function (rpta) {
                    if (rpta) {
                        aprobar()
                    }
                    return;
                });
            } else {
                mensaje += validar.mensaje;
            }

            if (mensaje.length > 0) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }
        }
         
        function validarantesgrabar() {
            let arrfilas = Array.from(_('tblbodyaprobar').rows), totalfilas = arrfilas.length, existefilas = true, pasavalidacion = true, contadorchkmarcado = 0, mensaje = '', obj = {};

            if (totalfilas === 0) {
                mensaje = '- No existen registros \n';
                existefilas = false;
                pasavalidacion = false;
            }

            if (existefilas) {
                arrfilas.forEach((x, indice) => {                 
                    let chk = x.getElementsByClassName('_clschk')[0];
                    if (chk.checked === true) {
                        contadorchkmarcado++
                    }                    
                });
                if (contadorchkmarcado === 0) {
                    mensaje += '- No ha seleccionado ninguna fila \n';
                    pasavalidacion = false;
                }
            }

            obj.mensaje = mensaje;
            obj.pasavalidacion = pasavalidacion;
            return obj;
        }

        function getchk() {
            let arrfilas = Array.from(_('tblbodyaprobar').rows), totalfilas = arrfilas.length,  arr=[];
            
            arrfilas.forEach((x, indice) => {
                let par = x.getAttribute('data-par'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'), idsolicituddesarrollotela = _par(par, 'idsolicituddesarrollotela'), obj = {}, chkaprobado = 0;                    
                    let chk = x.getElementsByClassName('_clschk')[0];
                    if (chk.checked === true) {
                        chkaprobado = 1;
                    }
                        obj = {
                            idsolicituddesarrollotela:idsolicituddesarrollotela,
                            idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela,
                            chkaprobado:chkaprobado
                          }
                          arr[indice] = obj;
                            
                });
            return arr;
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            parametro = {x:1}
            _Get('DesarrolloTextil/SolicitudDesarrolloTela/GetDataAprobar?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                 
                    if (rpta !== null) {
                        let data = rpta[0].aprobar !== '' ? CSVtoJSON(rpta[0].aprobar) : null
                        cargartabla(data)
                    }
                }, (p) => { err(p); });
        }
        
        function cargartabla(data){
            let tbody = _('tblbodyaprobar'), html = '';
            if (data !== null) {
                data.forEach(x => {
                    html += `
                                <tr data-par='idsolicituddesarrollotela:${x.idsolicituddesarrollotela},idsolicituddetalledesarrollotela:${x.idsolicituddetalleesarrollotela}'>
                                    <td>${x.idsolicituddesarrollotela}</td>
                                    <td>${x.cliente}</td>
                                    <td>${x.fabrica}</td>
                                    <td>${x.tela}</td>
                                    <td>${x.usuario}</td>
                                    <td>${x.fecharequerida}</td>
                                    <td><div class="text-center form-check"><input type="checkbox" checked class="form-check-input _clschk" /></div></td>
                                </tr>
                            `;
                });
            }
            tbody.innerHTML = html;            
        }

        function getcheckbox()
        {
            let tbl = _('tblbodyaprobar'), totalFilas = tbl.rows.length, arr = [];
            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), idsolicituddesarrollotela = _par(par, 'idsolicituddesarrollotela'), idsolicituddetalledesarrollotela = _par(par, 'idsolicituddetalledesarrollotela'),
                 obj = {                    
                     idsolicituddetalledesarrollotela: idsolicituddetalledesarrollotela
                 }
                arr[i] = obj;
            }
            return arr;
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_aprobarsdt');

(
    function ini() {
        appAprobarSDT.load();
        appAprobarSDT.req_ini();
    }
)();
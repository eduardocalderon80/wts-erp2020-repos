var consultahangtagestilos = (
    function (d, idpadre) {
        function load() {
            _('_btnPrint_hangtag').addEventListener('click', fn_printhangtag, false);
        }

        function fn_printhangtag(e) {
            let tbl = _('tbody_printhangtagestilos'), arr_checkseleccionados = Array.from(tbl.getElementsByClassName('_clscheck_seleccionado')),
                arr_par = [], hayseleccionados = false;
            arr_checkseleccionados.forEach(x => {
                if (x.checked) {
                    hayseleccionados = true;
                    let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode, datapar = fila.getAttribute('data-par'),
                        idestilo = _par(datapar, 'idestilo'), idtela = _par(datapar, 'idfichatecnica'), obj = { idestilo: idestilo, idtela: idtela };
                    arr_par.push(obj);
                }
            });

            if (hayseleccionados === false) {
                _swal({ estado: 'error', mensaje: 'Seleccione los estilos a imprimir...!' });
            } else {
                let parametro = JSON.stringify(arr_par),
                    url = urlBase() + 'GestionProducto/Estilo/PrintHangTagEstilo?par=' + parametro;
                window.open(url);
            }

        }

        function llenarTabla(data) {
            if (data !== null) {
                let html = '', rutafileserver = _('txtRutaFileServer').value, rutaconimagen = '';

                data.forEach(x => {
                    if (x.imagenwebnombre !== '') {
                        rutaconimagen = rutafileserver + x.imagenwebnombre;
                    } else {
                        rutaconimagen = '';
                    }

                    html += `
                        <tr data-par='idestilo:${x.idestilo},idfichatecnica:${x.idfichatecnica}'>
                            <td style='vertical-align: middle;'>
                                <label>
                                    <div class ='icheckbox_square-green _clsdiv_chk_seleccionado' style='position: relative;'>
                                        <input type='checkbox' class ='i-checks _clscheck_seleccionado _cls_seleccionado' style='position: absolute; opacity: 0;' name='_chk_seleccionado' value="" data-valor="" />&nbsp
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                    </div>
                                </label>
                            </td>
                            <td class='text-center'>
                                <div style='width:100%;' class='container'>
                                    <img src='${rutaconimagen}' width='100' height='80'>
                                </div>
                            </td>
                            <td>${x.nombrecliente}</td>
                            <td>${x.codigoestilo}</td>
                            <td>${x.version}</td>
                            <td>${x.descripcion}</td>
                            <td>${x.tela}</td>
                            <td>${x.temporada}</td>
                            <td>${x.division}</td>
                            <td>${x.status}</td>
                        </tr>
                `;
                });
                
                _('tbody_printhangtagestilos').innerHTML = html;

                handler_tabla_ini();
            }
        }

        function handler_tabla_ini() {
            //// PARA LOS CHECKBOX - I-CHECKS
            $("#tbody_printhangtagestilos .i-checks._clscheck_seleccionado").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        function res_ini(data) {
            let odata = data !== '' ? CSVtoJSON(data) : null;
            if (odata !== null) {
                llenarTabla(odata);
            } 
        }

        function req_ini() {
            let cliente = _('cboCliente').value;
            let style = _('txtStyle').value;
            let fabric = '';
            let season = _('cboSeason').value;
            let division = _('cboDivision').value;
            let status = _('cboStatus').value;
            let allclientes = ovariables.allclientes;
            let urlaccion = 'GestionProducto/Estilo/BuscarEstilos_HangTag';
            let par = cliente + "," + style + "," + fabric + "," + season + "," + division + "," + status + "," + allclientes;
            let frm = new FormData();
            frm.append("par", par);

            oUtil.adata = [];
            oUtil.adataresult = [];
            oUtil.indiceactualpagina = 0;
            oUtil.registrospagina = 10;
            oUtil.paginasbloques = 3;
            oUtil.indiceactualbloque = 0;
            _Post(urlaccion, frm)
                .then((result) => {
                    res_ini(result);
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }    
)(document, 'panelEncabezado_printhangtagestilos');

(
    function () {
        consultahangtagestilos.load();
        consultahangtagestilos.req_ini();
    }    
)();
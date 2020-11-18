var appEditInventarioColgador = (
    function (d, idpadre) {
        var ovariables = {
            idinventario: 0,
            accion: "",
            inventario: [],
            lstinventariomovimientos: [],
        }

        function load() {
            d.getElementById('_title').innerHTML = "Inventario";
            d.getElementById('btnReturn').addEventListener('click', fn_return);
            d.getElementById('btnSave').addEventListener('click', fn_save);

            let par = _('txtpar_new').value;
            if (!_isEmpty(par)) {
                ovariables.accion = _par(par, 'accion');
                ovariables.idinventario = _par(par, 'idinventario');
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idinventario: ovariables.idinventario };
            _Get('DesarrolloTextil/InventarioColgador/GetDataInventarioColgadorMovimiento?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.inventario = rpta[0].inventario !== '' ? JSON.parse(rpta[0].inventario) : [];
                        ovariables.lstinventariomovimientos = rpta[0].lstinventariomovimiento !== '' ? CSVtoJSON(rpta[0].lstinventariomovimiento) : [];
                        let lstperiodoinventario = rpta[0].lstperiodoinventario !== '' ? JSON.parse(rpta[0].lstperiodoinventario) : [];
                        let lstalmacen = rpta[0].lstalmacen !== '' ? JSON.parse(rpta[0].lstalmacen) : [];

                        _('txtcodigotela').value = ovariables.inventario[0].codigotela;
                        _('txtanaquel').value = ovariables.inventario[0].anaquel;
                        _('txtdescripcion').value = ovariables.inventario[0].descripcion;
                        _('txtfecharegistro').value = ovariables.inventario[0].fechacreacion;
                        _('_cbo_Estado').value = ovariables.inventario[0].estado;
                        _('cboPeriodo').innerHTML = _comboFromJSON(lstperiodoinventario, 'idperiodo', 'periodo'); //html;
                        _('cboPeriodo').value = ovariables.inventario[0].idperiodo;
                        _('cboAlmacen').innerHTML = _comboFromJSON(lstalmacen, 'idalmacen', 'alias'); //html;
                        _('cboAlmacen').value = ovariables.inventario[0].idalmacen;

                        cargartablamovimientos(ovariables.lstinventariomovimientos);
                        fn_Saldos();
                    }
                }, (p) => { err(p); });
        }

        function fn_Saldos() {
            let html = '';

            html = `
                                <table class="table table-bordered" style="width: 100%; padding-right: 0px;">                            
                                    <thead>
                                        <tr>
                                            <th style="width:10%" class="text-center">Saldo Inicial</th>
                                            <th style="width:10%" class="text-center">Saldo Disponible</th>
                                            <th style="width:10%" class="text-center">Entradas</th> 
                                            <th style="width:10%" class="text-center">Salidas</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="width:10%" class="text-center">${ovariables.inventario[0].saldoinicial}</td>
                                            <td style="width:10%" class="text-center">${ovariables.inventario[0].saldodisponible}</td>
                                            <td style="width:10%" class="text-center">${ovariables.inventario[0].ingresos}</td> 
                                            <td style="width:10%" class="text-center">${ovariables.inventario[0].salidas}</td> 
                                        </tr>
                                    </tbody>
                                </table>
                        `; 
            _('divdetallInventario').innerHTML = html;
            html = "";
        }

        function cargartablamovimientos(data) {
            let html = '', tbodymovimiento = _('tbody_indexinventario');
            tbodymovimiento.innerHTML = "";
            if (data !== null) {
                html = data.map(x => {
                    return `
                        <tr class="${x.eliminado === '1' ? 'text-danger' : ''}">
                            <td class="text-center" class="no-sort">
                                ${ (x.motivo !== 'Por Solicitud' && x.eliminado === '0') ? `<button class='btn btn-xs btn-danger' data-toggle='tooltip' name='ver_movimientos' onclick = 'appEditInventarioColgador.fn_Swal_Eliminarmovimiento(this)' data-idkardexdetalle='${x.idkardexdetalle}' data-idinventario='${x.idinventario}' title = 'Dar de baja Colgador'><span class='fa fa-trash' style='cursor:pointer;'></span></button >` : '' }
                            </td>
                            <td>${x.usuariosolicitante}</td>
                            <td>${x.tipomovimiento}</td>
                            <td class="text-center">${x.motivo}</td>
                            <td class="text-center">${x.cantidad}</td>
                            <td class="text-center">${x.fechacreacion}</td>
                            <td>${x.observacion}</td>
                            <td>${x.comentarioestado}</td>
                        </tr>
                    `
                }).join('');
                
                tbodymovimiento.innerHTML = html;
                formatTable();
            } else {
                html += "<tr><td colspan='7' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                tbodymovimiento.innerHTML = html;
                formatTable();
            }
        }

        function formatTable() {
            //"order": [[0, "desc"]],
            var table = $('#tbl_indexinventario_movimiento').DataTable({
                sPaginationType: "full_numbers", //// full_numbers
                iDisplayLength: 10, 
                bDestroy: true,  //// true
                info: false,
                bLengthChange: false,
                retrieve: true,  //// true
                orderCellsTop: true,  ////true
                fixedHeader: true, //// true
                searching: false,
                "order": [[5, "desc"]],
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 de 0 registros",
                    "infoEmpty": "No se encontraron registros",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar:",
                },
            });

            $('#tbl_indexinventario_movimiento').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_indexinventario_movimientoo_filter').hide();
        }

        function fn_return(e) {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/Index';
            _Go_Url(urlAccion, urlAccion, 'accion:index');
        }

        function fn_Swal_Eliminarmovimiento(button) {            
            swal({
                title: "¿Estás seguro de eliminar?",
                text: "<strong>Tener en cuenta:</strong> Si eliminas este movimiento, no podrás recuperarlo",
                html: true,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false
            }, function () {
                fn_EliminarMovimiento(button)
                return;
            });
        }

        function fn_EliminarMovimiento(button) {            
            let idkardexdetalle = button.getAttribute('data-idkardexdetalle');
            let idinventario = button.getAttribute('data-idinventario');
            swal({
                title: "Ingrese un comentario",
                //text: "Ingrese un comentario:",
                type: "input",
                confirmButtonColor: "#1c84c6",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Comentario"
            }, function (inputValue) {
                if (inputValue === false) return false;
                    if (inputValue === "" || inputValue.trim().length < 5) {
                        swal.showInputError("Ingrese un motivo, minimo de caracteres 5 dígitos...!");
                        return false
                    } else {
                        let form = new FormData();
                        let urlaccion = 'DesarrolloTextil/InventarioColgador/EliminarMovimiento', parametro = { idkardexdetalle: idkardexdetalle, comentarioestado: inputValue, idinventario: idinventario};
                        form.append('par', JSON.stringify(parametro));
                        Post(urlaccion, form, function (rpta) {                               
                        if (rpta !== '') {
                            let jrpta = JSON.parse(rpta);    
                            ovariables.lstinventariomovimientos = jrpta[0].lstinventariomovimiento !== '' ? CSVtoJSON(jrpta[0].lstinventariomovimiento) : null;

                            cargartablamovimientos(ovariables.lstinventariomovimientos);

                            let colgador = jrpta[0].colgador !== '' ? JSON.parse(jrpta[0].colgador) : null;

                            ovariables.inventario[0].saldoinicial = colgador[0].saldoinicial;
                            ovariables.inventario[0].saldodisponible = colgador[0].saldodisponible;
                            ovariables.inventario[0].ingresos = colgador[0].ingresos;
                            ovariables.inventario[0].salidas = colgador[0].salidas;

                            fn_Saldos();

                            _swal({ estado: 'success', mensaje: 'El movimiento fue eliminado' });
                            
                            return;
                        }
                        else {
                            _swal({ estado: 'error', mensaje: 'No se pudo eliminar' });
                        }
                    });
                    return;
                }              
            });
        }

        function fn_save() {
            let form = new FormData();
            let urlaccion = 'DesarrolloTextil/InventarioColgador/Save_Edit_Colgador', parametro = { idinventario: ovariables.idinventario, estado: _('_cbo_Estado').value, anaquel: _('txtanaquel').value };
            form.append('par', JSON.stringify(parametro));
            Post(urlaccion, form, function (rpta) {
                if (rpta !== '') {
                    swal({
                        title: "¡Buen Trabajo!",
                        text: "Se actualizo con exito",
                        type: "success",
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    fn_return();
                    //_swal({ estado: 'success', mensaje: 'OK' });
                    return;
                }
                else {
                    swal({
                        title: "Ha surgido un problema",
                        text: "Por favor, comunicate con el administrador TIC",
                        type: "error",
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    fn_return();
                    //_swal({ estado: 'error', mensaje: 'No se pudo eliminar' });
                }
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_Swal_Eliminarmovimiento: fn_Swal_Eliminarmovimiento,
        }
    }
)(document, 'panelEncabezado_inventarioEditar');
(
    function ini() {
        appEditInventarioColgador.load();
        appEditInventarioColgador.req_ini();        
    }
)();


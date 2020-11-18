var appNewInventarioColgador = (
    function (d, idpadre) {
        var ovariables = {
            lsttipomotivos: [],
            lstItems: [],
            idalmacen: 0,
            lstSeleccionados: [],
            lstCodigosTelas: [],
            interval: '',
            lstpersonal: [],
            lstalmacen: []
        }

        function load() {
            _('_title').innerHTML = "Registrar Movimiento";
            _('btnReturn').addEventListener('click', fn_return);
            _('btnAgregarItem').addEventListener('click', fn_agregaritem);
            _('btnBuscarCodigoTela').addEventListener('click', fn_buscar_codigo_filter);
            _('btnInterval').addEventListener('click', fn_Interval);
            _('btnAgregarItemsModal').addEventListener('click', fn_agregar_codigos_lista_principal);
            _('txtcodigotela').addEventListener('keypress', fn_pressenter);
            _('txtcodigotela').addEventListener('keyup', fn_cuandocopia_quitar_espaciosblanco, false);
            _('btnSave').addEventListener('click', fn_save);
            _('_cbo_Almacen').addEventListener('change', fn_cambiaralmacen);
            _('_btn_crear_motivo').addEventListener('click', fn_agregarmotivo);

            _('txtfecharegistro').value = _getDate103();

            // Fix initialised in a hidden element
            $('.modal').on('shown.bs.modal', function () {
                $('#tbl_codigo_agregar').DataTable().columns.adjust().draw();
            });
            $('.modal').on('hidden.bs.modal', function () {
                $("#div_tbl_Items input").prop("checked", false).iCheck("update");
                ovariables.lstSeleccionados = [];
            });

            // Scanner BarCode
            handler_scanner_barcode_inventario();

            // Se oculta interval ya que se añadio evento que detecta scanner
            _('btnInterval').classList.add('hide');
        }

        function fn_cuandocopia_quitar_espaciosblanco() {
            let input_txt = _('txtcodigotela'), texto = input_txt.value;
            arr_cadena = texto.charCodeAt(0) === 9 ? texto.split(texto.charAt(0)) : [];
            if (arr_cadena.length > 0) {
                input_txt.value = arr_cadena[1];
            }
        }

        function fn_Interval() {
            if (_('btnInterval').classList[1] === 'btn-warning') {
                _('btnInterval').classList.remove("btn-warning");
                _('btnInterval').classList.add("btn-danger");
                _('btnInterval').innerHTML = `<span class="fa fa-refresh fa-spin"></span> Detener`;
                // Deshabilita
                _('btnAgregarItem').disabled = true;
                _('btnBuscarCodigoTela').disabled = true;
                // Inicia intervalo
                ovariables.interval = setInterval(function () {
                    fn_agregaritem();
                }, 2000);
            } else {
                _('btnInterval').classList.remove("btn-danger");
                _('btnInterval').classList.add("btn-warning");
                _('btnInterval').innerHTML = `<span class="fa fa-refresh"></span> Iniciar`;
                // Deshabilita
                _('btnAgregarItem').disabled = false;
                _('btnBuscarCodigoTela').disabled = false;
                // Detiene intervalo
                clearInterval(ovariables.interval);
            }
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('DesarrolloTextil/InventarioColgador/GetDataInicialInventario?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let lstperiodoinventario = rpta[0].lstperiodoinventario !== '' ? JSON.parse(rpta[0].lstperiodoinventario) : [];
                        let lstalmacen = rpta[0].lstalmacen !== '' ? JSON.parse(rpta[0].lstalmacen) : [];
                        let lstmovimientos = rpta[0].lsttipomovimientos !== '' ? JSON.parse(rpta[0].lsttipomovimientos) : [];
                        let lstpersonal = rpta[0].lstpersonal != '' ? JSON.parse(rpta[0].lstpersonal) : [];
                        //let lstPresentacion = rpta[0].lstpresentacion != '' ? JSON.parse(rpta[0].lstpresentacion) : [];
                        ovariables.lsttipomotivos = rpta[0].lsttipomotivos !== '' ? JSON.parse(rpta[0].lsttipomotivos) : [];

                        // Usuarios
                        let cbo_usuarios = ``;
                        if (lstpersonal.length > 0) {
                            lstpersonal.forEach(x => {
                                cbo_usuarios += `<option value='${x.idusuario}'>${x.nombrepersonal}</option>`
                            });
                        }
                        _('_cbo_usuario_solicitante').innerHTML = cbo_usuarios;

                        //Presentacion
                        let cbo_presentacion = `<option value='0'>--</option>`;
                        //if (lstPresentacion.length > 0) {
                        //    lstPresentacion.forEach(x => {
                        //        cbo_presentacion += `<option value='${x.IdPresentacion}'>${x.Nombre}</option>`
                        //    });
                        //}
                        _('_cbo_Presentacion').innerHTML = cbo_presentacion;

                        let cbo_periodoinventario = '';
                        if (lstperiodoinventario.length > 0) {
                            lstperiodoinventario.forEach(x => {
                                if (x.estado === "1") {
                                    cbo_periodoinventario += `<option value='${x.idperiodo}' selected>${x.periodo}</option>`
                                } else {
                                    cbo_periodoinventario += `<option value='${x.idperiodo}'>${x.periodo}</option>`
                                }
                            });
                        }
                        _('_cbo_periodo').innerHTML = cbo_periodoinventario;

                        _('_cbo_Almacen').innerHTML = _comboFromJSON(lstalmacen, 'idalmacen', 'alias'); //cbo_almacen;
                        _('_cbo_AlmacenDestino').innerHTML = _comboFromJSON(lstalmacen, 'idalmacen', 'alias'); //cbo_almacen_destino
                        _('_cbo_movimiento').innerHTML = lstmovimientos.length > 0 ? _comboFromJSON(lstmovimientos, 'idtipomovimiento', 'tipomovimiento') : ''; //cbo_movimiento;
                        _('_cbo_movimiento').addEventListener('change', fn_motivos);

                        let arr_personal_lista = rpta[0].personal !== '' ? CSVtoJSON(rpta[0].personal) : null;
                        ovariables.lstpersonal = arr_personal_lista !== null ? arr_personal_lista : [];
                        if (arr_personal_lista) {
                            _('dl_entregadoa').innerHTML = _comboDataListFromJSON(arr_personal_lista, 'idpersonal', 'nombrepersonal');
                        }

                        fn_motivos();

                        ovariables.idalmacen = _('_cbo_Almacen').value;
                        ovariables.lstalmacen = lstalmacen;

                        fn_buscar_codigo();
                        //fn_mostrar_presentacion();
                        fn_mostrardestino();

                        // ocultar options
                        const filter_lstalmacen = ovariables.lstalmacen.filter(x => x.idalmacen !== _parseInt(_('_cbo_Almacen').value));
                        _('_cbo_AlmacenDestino').innerHTML = _comboFromJSON(filter_lstalmacen, 'idalmacen', 'alias');
                    }
                }, (p) => { err(p); });
        }

        function fn_motivos() {
            let cbotipomovimiento = _('_cbo_movimiento'), idtipomovimiento = cbotipomovimiento.value,
                nombre_tipo_movimiento = cbotipomovimiento.options[cbotipomovimiento.selectedIndex].text;
            let cbo_motivo = '';
            if (ovariables.lsttipomotivos.length > 0) {
                ovariables.lsttipomotivos.forEach(x => {
                    if (x.idtipomovimiento == idtipomovimiento) {
                        cbo_motivo += `<option value='${x.idtipomotivo}'>${x.motivo}</option>`
                    }
                })
            }
            _('_cbo_motivo').innerHTML = cbo_motivo;

            if (nombre_tipo_movimiento.toLowerCase().indexOf('entrada') >= 0) {
                let usuario_filter = ovariables.lstpersonal.filter(x => x.usuario === window.utilindex.usuario);
                if (usuario_filter.length > 0) {
                    _setValueDataList(usuario_filter[0].idpersonal, _('dl_entregadoa'), _('txtentregadoa'));
                }

                //// QUITAR EL FONDO ROJO DE NEGATIVOS
                let arr_rows = Array.from(_('tbody_indexinventario').rows);
                arr_rows.forEach(x => {
                    let saldodisponible = x.getElementsByClassName('_cls_td_saldodisponible')[0];

                    saldodisponible.classList.remove('bg-danger');
                });
            } else {
                _('txtentregadoa').value = '';

                //// PINTAR EL FONDO ROJO DE NEGATIVOS
                let arr_rows = Array.from(_('tbody_indexinventario').rows);
                arr_rows.forEach(x => {
                    let saldodisponible = x.getElementsByClassName('_cls_td_saldodisponible')[0], cantidad_ingresada = x.getElementsByClassName('_cls_txt_cantidad_movimiento')[0],
                        valor_saldodisponible = saldodisponible.innerText.trim() !== '' ? saldodisponible.innerText : 0,
                        valor_cantidad_ingresada = cantidad_ingresada.value !== '' ? cantidad_ingresada.value : 0;
                    if (parseInt(valor_saldodisponible) - parseInt(valor_cantidad_ingresada) <= 0) {
                        saldodisponible.classList.add('bg-danger');
                    }
                });
            }
        }

        function fn_mostrar_presentacion() {
            _('_cbo_movimiento').onchange =
                _('_cbo_motivo').onchange = function () {
                    // Para presentacion
                    if (_('_cbo_motivo').value === "6") { // 6 => Por presentacion
                        _('div_presentacion').classList.remove('hide');
                    } else {
                        _('_cbo_Presentacion').value = 0
                        _('div_presentacion').classList.add('hide');
                    }
                }
        }

        function fn_mostrardestino() {
            _('_cbo_movimiento').onchange = function (e) {
                const sel = e.currentTarget;
                const text = sel.options[sel.selectedIndex].text;
                if (text === "Salida y Entrada") {
                    const filter_lstalmacen = ovariables.lstalmacen.filter(x => x.idalmacen !== _parseInt(_('_cbo_Almacen').value));
                    _('_cbo_AlmacenDestino').innerHTML = _comboFromJSON(filter_lstalmacen, 'idalmacen', 'alias');
                    _('div_destino').classList.remove('hide');
                } else {
                    _('div_destino').classList.add('hide');
                }
            }
            _('_cbo_Almacen').onchange = function () {
                const filter_lstalmacen = ovariables.lstalmacen.filter(x => x.idalmacen !== _parseInt(_('_cbo_Almacen').value));
                _('_cbo_AlmacenDestino').innerHTML = _comboFromJSON(filter_lstalmacen, 'idalmacen', 'alias');
            }
        }

        function fn_agregaritem() {
            let codigotela = _('txtcodigotela').value;
            let err = function (__err) { console.log('err', __err) },
                parametro = { codigotela: codigotela, idalmacen: _('_cbo_Almacen').value };
            if (codigotela !== "") {
                _Get('DesarrolloTextil/InventarioColgador/GetData_InventarioCodigoTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta[0].colgador !== '') {

                            let colgador = JSON.parse(rpta[0].colgador);
                            let filter_colgador_inactivo = colgador.filter(x => x.estado === 0);  //// 0 ES INACTIVO
                            if (filter_colgador_inactivo.length > 0) {
                                swal({
                                    title: 'Alerta',
                                    text: 'La tela está en estado Inactivo...!',
                                    type: 'warning',
                                    timer: 2000,
                                    showCancelButton: false,
                                    showConfirmButton: false
                                });
                                return false;
                            }

                            let tbody = _('tbody_indexinventario');
                            let cantidadfilas = tbody.rows.length;
                            let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;
                            for (let i = 0; i < cantidadfilas; i++) {
                                if (tbody.rows[i].children[5].children[0].getAttribute('data-idanalisistextil') == colgador[0].idanalisisTextil) {
                                    inputCantidad = tbody.rows[i].cells[5].children[0];
                                    cantidadSolicitada = (inputCantidad.value * 1) + 1;
                                    inputCantidad.value = cantidadSolicitada;

                                    lEncontrado = true;
                                }
                            }

                            if (lEncontrado === false) {
                                let idanaquel = _('_cbo_Anaquel').value; // data-required="false"
                                let html = `
                                    <tr id="${colgador[0].idinventario}">
                                        <td>${colgador[0].almacen}</td>
	                                    <td>${colgador[0].codigoTela}</td>
	                                    <td>${colgador[0].descripcion}</td>
	                                    <td>${colgador[0].anaquel !== 'No Asignado' ? colgador[0].anaquel : idanaquel}</td>
                                        <td class='_cls_td_saldodisponible'>${colgador[0].saldodisponible}</td>
	                                    <td>
                                            <input type="text" class="form-control _enty_grabar _cls_txt_cantidad_movimiento" data-idanalisistextil="${colgador[0].idanalisisTextil}" data-required="true" data-min="1" value="1" data-type="int" data-max="9999999"/>
                                        </td>
	                                    <td>
                                            <input type="text" class="form-control _enty_observacion" />
                                        </td>
	                                    <td>
                                            <button class="btn btn-sm btn-danger" data-toggle="tooltip" name="ver_movimientos" data-idinventario="${colgador[0].idinventario}" 
		                                        onclick="appNewInventarioColgador.fn_Swal_Eliminarmovimiento(this)" title="Dar de baja Colgador">
			                                    <span class="fa fa-trash" style="cursor:pointer;"></span>
                                            </button>
	                                    </td>
                                    </tr>
                                `;
                                tbody.insertAdjacentHTML('beforeend', html);
                                let indicefila = tbody.rows.length - 1;
                                handler_tbl_inventario_add(indicefila);
                            }

                            _('txtcodigotela').value = "";

                        } else {
                            swal({
                                title: "Advertencia",
                                text: "El Codigo de Tela ingresado no existe",
                                type: "warning",
                                timer: 2000,
                                showCancelButton: false,
                                showConfirmButton: false
                            });
                            _('txtcodigotela').value = "";
                        }
                    }, (p) => { err(p); });
            }
        }

        function fn_buscar_codigo() {
            _Get('DesarrolloTextil/InventarioColgador/GetAllData_InventarioCodigoTela')
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        //console.log(rpta);
                        ovariables.lstCodigosTelas = rpta;
                        let table = _('div_tbl_Items'), html = '';
                        table.innerHTML = "";
                        html = `
                        <table id="tbl_codigo_agregar" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                            <thead>
                                <tr>
                                    <th class="text-center no-sort"></th>
                                    <th class="text-center">Año</th>
                                    <th class='text-center'>Código Tela</th>
                                    <th class='text-center'>Descripcion de Tela</th>
                                    <th class='text-center'>Saldo Disponible</th>     
                                    <th class='text-center'>Locación</th>
                                    <th class='text-center'>Anaquel</th>
                                </tr>
                            </thead>
                            <tbody>
                        `;
                        if (rpta !== null) {
                            rpta.forEach(x => {
                                html += `
                                <tr>    
                                    <td class="text-center">                                        
                                        <input class="i-check" type="checkbox" data-id='${x.idanalisisTextil}' name="codigo_agregar" />
                                    </td>
                                    <td>${x.anio}</td>
                                    <td class='text-center'>${x.codigoTela}</td>
                                    <td>${x.descripcion}</td>
                                    <td class='text-center'>${x.saldodisponible}</td>  
                                    <td class='text-center'>${x.almacen}</td>
                                    <td class='text-center'>${x.anaquel}</td>
                                </tr>
                            `;
                            });

                            html += "</tbody></table>";
                            table.innerHTML = html;
                            formatTableCodigoAgregar();
                        }
                    }
                }, (p) => { err(p); });
        }

        function fn_buscar_codigo_filter() {
            $("#modal_items").modal("show");
        }

        function formatTableCodigoAgregar() {
            var table = $('#tbl_codigo_agregar').DataTable({
                paging: true,
                pageLength: 15,
                bPaginate: true,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,
                //scrollY: "500px",
                //scrollCollapse: true,
                //scrollX: true,
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Pagina _PAGE_ de _PAGES_",
                    "infoEmpty": "No se encontraron registros",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar:",
                },
                "drawCallback": function () {
                    $('.i-check').iCheck({
                        checkboxClass: 'iradio_square-green',
                        radioClass: 'iradio_square-green',
                    }).on('ifChanged', function () {
                        let bool = ovariables.lstSeleccionados.filter(x => x.idanalisisTextil === $(this).data('id')).length;
                        if (bool === 0) {
                            let IdHidden = { idanalisisTextil: $(this).data('id') };
                            ovariables.lstSeleccionados.push(IdHidden);
                        } else {
                            let filter = ovariables.lstSeleccionados.filter(x => x.idanalisisTextil !== $(this).data('id'))
                            ovariables.lstSeleccionados = filter;
                        }
                    });
                }
            });

            $('#tbl_codigo_agregar').removeClass('display').addClass('table table-bordered table-hover');
        }

        function fn_agregar_codigos_lista_principal() {
            if (ovariables.lstSeleccionados.length > 0) {
                ovariables.lstSeleccionados.forEach(x => {
                    let colgador = ovariables.lstCodigosTelas.filter(y => y.idanalisisTextil == x.idanalisisTextil);
                    let tbody = _('tbody_indexinventario');
                    let cantidadfilas = tbody.rows.length;
                    let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;
                    for (let i = 0; i < cantidadfilas; i++) {
                        if (tbody.rows[i].children[5].children[0].getAttribute('data-idanalisistextil') == colgador[0].idanalisisTextil) {
                            inputCantidad = tbody.rows[i].cells[5].children[0];
                            cantidadSolicitada = (inputCantidad.value * 1) + 1;
                            inputCantidad.value = cantidadSolicitada;

                            lEncontrado = true;
                        }
                    }

                    if (lEncontrado === false) {
                        let idanaquel = _('_cbo_Anaquel').value;  //data-required="false"
                        let html = `
                                    <tr id="${colgador[0].idinventario}">
                                        <td>${colgador[0].almacen}</td>
	                                    <td>${colgador[0].codigoTela}</td>
	                                    <td>${colgador[0].descripcion}</td>
	                                    <td>${colgador[0].anaquel !== 'No Asignado' ? colgador[0].anaquel : idanaquel}</td>
                                        <td class='_cls_td_saldodisponible'>${colgador[0].saldodisponible}</td>
	                                    <td>
                                            <input type="text" class='form-control _enty_grabar _cls_txt_cantidad_movimiento' data-idanalisistextil="${colgador[0].idanalisisTextil}" 
                                                data-required="true" data-min="1" class="form-control _enty_grabar" value="1" data-type="int" data-max="9999999"
                                                onkeypress="return DigitosEnteros(event, this)" />
                                        </td>
	                                    <td>
                                            <input type="text" class="form-control _enty_observacion"/>
                                        </td>
	                                    <td>
                                            <button class="btn btn-sm btn-danger" data-toggle="tooltip" name="ver_movimientos" data-idinventario="${colgador[0].idinventario}" 
		                                        onclick="appNewInventarioColgador.fn_Swal_Eliminarmovimiento(this)" title="Dar de baja Colgador">
			                                    <span class="fa fa-trash" style="cursor:pointer;"></span>
                                            </button>
	                                    </td>
                                    </tr>
                                `;
                        tbody.insertAdjacentHTML('beforeend', html);
                        let indicefila = tbody.rows.length - 1;
                        handler_tbl_inventario_add(indicefila);
                    }
                });
            }
        }

        function handler_tbl_inventario_add(indice_fila) {
            let tbody = _('tbody_indexinventario'), txtcantidad = tbody.rows[indice_fila].getElementsByClassName('_cls_txt_cantidad_movimiento')[0];
            ['keyup', 'change'].forEach((event) => {
                txtcantidad.addEventListener(event, fn_change_cantidad_inventario, false);
            });
        }

        function fn_change_cantidad_inventario(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode, td_saldodisponible = fila.getElementsByClassName('_cls_td_saldodisponible')[0],
                saldodisponible = td_saldodisponible.innerText,
                cantidad_inventario = fila.getElementsByClassName('_cls_txt_cantidad_movimiento')[0].value, cbomovimiento = _('_cbo_movimiento'),
                essalida = cbomovimiento.options[cbomovimiento.selectedIndex].text.toLowerCase().indexOf('salida') >= 0;

            if (essalida) {
                if (parseInt(saldodisponible) - parseInt(cantidad_inventario) <= 0) {
                    td_saldodisponible.classList.add('bg-danger');
                } else {
                    td_saldodisponible.classList.remove('bg-danger');
                }
            } else {
                td_saldodisponible.classList.remove('bg-danger');
            }
        }

        function fn_agregarmotivo() {
            //// AGREGAR MODAL PARA CREAR MOTIVO
            _modalBody({
                url: 'DesarrolloTextil/InventarioColgador/_AgregarMotivo',
                ventana: '_AgregarMotivo',
                titulo: 'Crear/Editar Motivo',
                parametro: '',
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function fn_pressenter(e) {
            if (e.keyCode === 13) {
                fn_agregaritem();
            }
        }

        function fn_Swal_Eliminarmovimiento(button) {
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_indexinventario_movimiento').deleteRow(i);
        }

        function fn_save() {
            let items = "", req_enty = '';
            let tbody = _('tbody_indexinventario');
            req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_inventarioEditar' });

            //let cantidadfilas = tbody.rows.length;
            let arr_row = Array.from(tbody.rows);

            let pasavalidacion = validar_antes_grabar();

            let cantidad_bool = true;
            if (req_enty && pasavalidacion) {
                let inputCantidad = 0, inputobservacion = "", cantidad = 0, idinventario = 0, idanalisistextil = 0, observacion = "", anaquel = "", disponible = 0;
                arr_row.forEach((x, i) => {
                    inputCantidad = x.cells[5].children[0];
                    inputobservacion = x.cells[6].children[0];
                    idinventario = x.id;
                    cantidad = inputCantidad.value;
                    disponible = x.cells[4].textContent;
                    idanalisistextil = inputCantidad.getAttribute('data-idanalisistextil');
                    observacion = inputobservacion.value;
                    anaquel = x.cells[3].textContent;

                    items += idinventario + '¬' + cantidad + '¬' + idanalisistextil + '¬' + observacion + '¬' + anaquel + '^';

                    // False si cantidad es mayor a saldo disponible
                    if (_parseInt(cantidad) > _parseInt(disponible)) {
                        cantidad_bool = false;
                    }
                });

                //// TIPOMOVIMIENTO = 2 = SALIDA; 1 = ENTRADA
                if (_("_cbo_movimiento").value === "2" && cantidad_bool === false) {
                    swal({ title: "Advertencia", text: "La cantidad ingresada no puede ser mayor a la disponible", type: "warning" });
                } else {
                    let form = new FormData();
                    let urlaccion = '';
                    if (_('_cbo_movimiento').options[_('_cbo_movimiento').selectedIndex].text === 'Salida y Entrada') {
                        urlaccion = 'DesarrolloTextil/InventarioColgador/Save_Registrar_MovimientosSalida';
                    } else {
                        urlaccion = 'DesarrolloTextil/InventarioColgador/Save_Registrar_Movimientos';
                    }
                    let parametro = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_inventarioEditar' });
                    parametro['idpersonal_entregado_a'] = _getValueDataList(_('txtentregadoa').value, _('dl_entregadoa'));
                    parametro['lstkardexdetalle'] = items;

                    form.append('par', JSON.stringify(parametro));
                    Post(urlaccion, form, function (rpta) {
                        if (rpta !== '') {
                            swal({
                                title: "¡Buen Trabajo!",
                                text: "Se registro con exito",
                                type: "success",
                                timer: 1000,
                                showCancelButton: false,
                                showConfirmButton: false
                            });
                            // REGRESA A INDEX
                            fn_return();
                            return;
                        }
                        else {
                            _swal({ estado: 'error', mensaje: 'Ha surgido un problema. \n Por favor, comunicate con el administrador TIC' });
                        }
                    });
                }
            }
        }

        function validar_antes_grabar() {
            let presentacion_is_bool = false, pasa_validacion = true, tbody = _('tbody_indexinventario'),
                cantidadfilas = tbody.rows.length, mensaje = '', tieneitems = true;

            _('div_contenedor_entregado_a').classList.remove('has-error');

            if ($("#div_presentacion").hasClass('hide')) {
                _('_cbo_Presentacion').style.borderColor = "";
                presentacion_is_bool = true;
            } else {
                _('_cbo_Presentacion').style.borderColor = "red";
                if (_('_cbo_Presentacion').value !== '0') {
                    presentacion_is_bool = true;
                }
            }

            if (cantidadfilas <= 0) {
                pasa_validacion = false;
                tieneitems = false;
                mensaje += 'Ingrese Items'
            }

            let txtentregado_a = _('txtentregadoa');
            let identregado_a = _getValueDataList(txtentregado_a.value, _('dl_entregadoa'));

            if (identregado_a === '') {
                if (txtentregado_a.value !== '') {
                    mensaje += '- Seleccione entregado a porfavor...!';
                }
                pasa_validacion = false;
                _('div_contenedor_entregado_a').classList.add('has-error');
            }

            //// VALIDAR SALDOS NEGATIVOS
            if (tieneitems) {
                let cbomovimiento = _('_cbo_movimiento');
                let essalida = cbomovimiento.options[cbomovimiento.selectedIndex].text.toLowerCase().indexOf('salida') >= 0;

                //// VALIDAR REQUIRE DETALLE
                let require_cantidad_inventario = Array.from(tbody.rows).some(x => { return (x.getElementsByClassName('_cls_txt_cantidad_movimiento')[0].value === '' || x.getElementsByClassName('_cls_txt_cantidad_movimiento')[0].value === '0') });
                if (require_cantidad_inventario) {
                    pasa_validacion = false;
                    if (mensaje !== '') {
                        mensaje += '\n - Falta ingresar la cantidad del inventario...!';
                    } else {
                        mensaje += '- Falta ingresar la cantidad del inventario...!';
                    }
                }
                if (essalida) {
                    let tiene_saldosnegativos = Array.from(tbody.rows).some(x => {
                        return (parseInt(x.getElementsByClassName('_cls_td_saldodisponible')[0].innerText) - parseInt(x.getElementsByClassName('_cls_txt_cantidad_movimiento')[0].value)) < 0
                    });

                    if (tiene_saldosnegativos) {
                        pasa_validacion = false;
                        if (mensaje !== '') {
                            mensaje += '\n - Existe saldos negativos...!';
                        } else {
                            mensaje += '- Existe saldos negativos...!';
                        }
                    }
                }
            }

            if (mensaje !== '') {
                _swal({ estado: 'error', mensaje: mensaje });
            }

            return (pasa_validacion && presentacion_is_bool);
        }

        function fn_cambiaralmacen() {
            let tbody = _('tbody_indexinventario');
            let idalmacen = ovariables.idalmacen;
            if (tbody.rows.length > 0) {
                swal({
                    title: "Esta seguro que desea cambiar de almacen?",
                    text: "<strong>Tener en cuenta:</strong> Si cambias de almacen, puedes perder los item ingresados.",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        _swal({ estado: 'success', mensaje: 'OK' });
                        ovariables.idalmacen = _('_cbo_Almacen').value;
                        tbody.innerHTML = "";
                    } else {
                        _('_cbo_Almacen').value = idalmacen;
                        ovariables.idalmacen = _('_cbo_Almacen').value;
                    }
                });
            }
        }

        function fn_return(e) {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/Index';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function handler_scanner_barcode_inventario() {
            $("#txtcodigotela").scannerDetection({
                timeBeforeScanTest: 200, // wait for the next character for upto 200ms
                avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
                minLength: 4,  // POR DEFECTO SI NO SE PONE ESTA CONFIGURACION ES DE 6 DIGITOS
                onComplete: function (barcode, qty) {
                    _('txtcodigotela').focus();
                    _('txtcodigotela').value = barcode;
                    fn_agregaritem();
                    //console.log(barcode);
                }
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_Swal_Eliminarmovimiento: fn_Swal_Eliminarmovimiento,
            ovariables: ovariables,
            fn_agregar_codigos_lista_principal: fn_agregar_codigos_lista_principal,
            fn_agregaritem: fn_agregaritem
        }
    }
)(document, 'panelEncabezado_inventarioRegistrarSolicitud');
(
    function ini() {
        appNewInventarioColgador.load();
        appNewInventarioColgador.req_ini();
        _rules({ id: 'panelEncabezado_inventarioEditar', clase: '_enty_grabar' });
    }
)();
var appNewCotizacion = (
    function (d, idpadre) {
        var ovariables = {
            id: '',
            idaux: 0,
            accion: '',
            estado: '',
            cbo_temporadas: [],
            idanalisistextil: '',
            proveedores: [],
            precio_resultante_yd: 0.9144,
            densidad: 0.02949,
            anchototal: 39.3701,
            rendimiento_yd: 0.9144,
            decimales: 5,
            decimales_medidas: 4,
            decimales_dos: 2,
            idorden: 0,
            lstDetalle: [],
            lstTodosATX: [],
            lstComboATX: [],
            lstHilado: [],
            codigotelaATX: 0
        }

        function load() {
            _('btnFinalizar').style.display = 'none';
            _('btnReturn').addEventListener('click', fn_return);
            _('btnSave').addEventListener('click', fn_save);
            _('btnBuscarxCodigoTela').addEventListener('click', fn_buscarxCodigoTela);
            _('btnBuscarxATX').addEventListener('click', fn_buscarxATX);
            _('btnAgregarServicio').addEventListener('click', fn_agregar_servicio);
            _('txtcantidad_minima_kg').addEventListener('keyup', fn_calcular_cantidad_minima_orden);
            _('txtcantidad_minima_color_kg').addEventListener('keyup', fn_calcular_cantidad_minima_color);
            _('txtstock_kg').addEventListener('keyup', fn_calcular_stock);
            _('btnBuscarItemsModal').addEventListener('click', fn_buscar_codigotela_enlista);
            _('btnAgregarItemsModal').addEventListener('click', fn_agregar_codigos_lista_principal);
            _('btnFinalizar').addEventListener('click', fn_FinalizarOrden);

            // Se deshabilita btnClean ya no es necesario
            _('btnClean').style.display = 'none';
            _('btnFinalizar').style.display = 'none';

            //Limpiar
            _('btnClean').onclick = function () {
                swal({
                    title: "Limpiar Campos",
                    text: "¿Estas seguro/a que deseas limpiar los campos?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: true
                }, function () {
                    fn_limpiar_todos_loscampos();
                });
            }
           
            // Fecha por defecto
            _('txtfechainicio').value = _getDate103();

            // Scroll top
            _scrollTo(0);

            //Keyups
            fn_CalculosKeyUp();

            //Agregar Yarn
            fn_Yarn();

            let par = _('txtpar_new').value;
            if (!_isEmpty(par)) {
                ovariables.idorden = _par(par, 'idorden');
                ovariables.accion = _par(par, 'accion');
                ovariables.id = _par(par, 'id');
                ovariables.idaux = _par(par, 'idaux') !== '' ? _parseInt(_par(par, 'idaux')) : 0;
                ovariables.vista = _par(par, 'vista') !== '' ? _parseInt(_par(par, 'vista')) : 0;
                ovariables.estado = _par(par, 'estado');

                if (ovariables.accion === "new") {
                    _('_title').innerHTML = "Orden de Cotizacion";
                    _('div_solicitud').style.display = "none";
                } else if (ovariables.accion === "new2") {
                    _('_title').innerHTML = "Orden de Cotizacion";
                } else {
                    _('_title').innerHTML = "Orden de Cotizacion #" + ovariables.idorden;
                    _('div_solicitud').style.display = "none";
                    _('btnFinalizar').style.display = "initial";

                    let html = '<span class="fa fa-refresh"></span> Actualizar';
                    _('btnSave').innerHTML = html;

                    fn_disabledAll();
                }               
            }

            // Fix initialised in a hidden element
            $('.modal').on('shown.bs.modal', function () {
                $('#tbl_codigo_agregar').DataTable().columns.adjust().draw();
            });
            $('.modal').on('hidden.bs.modal', function () {
                $('.i-check').prop("checked", false).iCheck("update");
            });

            // iCheck Lavado
            $('.i-check-lavado').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        }

        function fn_disabledAll(tipo) {
            if (_parseInt(ovariables.estado) === 1) {
                $("#panelEncabezado_cotizartela :input").prop("disabled", true);
                _('btnFinalizar').style.display = 'none';
                _('btnSave').style.display = 'none';
                _('btnClean').style.display = 'none';
                _('btnReturn').disabled = false;
                
                $('._viewOnly .input-group-btn').css('display', 'none');
                $('._viewOnly').css('display', 'block');
                $('._viewOnly-hide').css('display', 'none');

                if (tipo === 1) {
                    $('#tbl_servicios th').eq(0).remove();
                    $('#tbl_servicios tbody .text-center').remove();
                    $('#tbl_servicios tfoot td').eq(0).attr('colspan', '4');
                }

                $("#txtfechainicio").prev().css({
                    'pointer-events': 'none',
                    'background-color': '#eee',
                    'border': '1px solid #e5e6e7'
                });

                $('#txtyarn').next().next().css({
                    'pointer-events': 'none',
                    'background-color': '#eee',
                    'border': '1px solid #e5e6e7'
                });
            }
        }

        function fn_CalculosKeyUp() {
            $("#txtdensidad").keyup(function () {
                _('txtdensidad_oz').value = ((_parseFloat(_('txtdensidad').value) * 1) * ovariables.densidad).toFixed(ovariables.decimales_dos);
                $("input[name='precio']").keyup();
                $("input[name='precio_servicio']").keyup();
                fn_calcular_cantidad_minima_orden();
                fn_calcular_cantidad_minima_color();
                fn_calcular_stock();
            });
            $("#txtanchototal").keyup(function () {
                _('txtancho_util').value = ((_parseFloat(_('txtanchototal').value) * 1) * ovariables.anchototal).toFixed(ovariables.decimales_dos);
                $("input[name='precio']").keyup();
                $("input[name='precio_servicio']").keyup();
                fn_calcular_cantidad_minima_orden();
                fn_calcular_cantidad_minima_color();
                fn_calcular_stock();
            });
            $("#txtanchototal, #txtdensidad").keyup(function () {
                let rendimiento_m = (1000 / (_parseFloat(_('txtdensidad').value) * _parseFloat(_('txtanchototal').value))).toFixed(ovariables.decimales);
                let rendimiento_yd = (rendimiento_m / ovariables.rendimiento_yd).toFixed(ovariables.decimales);
                _("txtrendimiento_m").value = isFinite(rendimiento_m) ? rendimiento_m : 0.00;
                _("txtrendimiento_yd").value = isFinite(rendimiento_yd) ? rendimiento_m : 0.00;
                $("input[name='precio']").keyup();
                $("input[name='precio_servicio']").keyup();
                fn_calcular_cantidad_minima_orden();
                fn_calcular_cantidad_minima_color();
                fn_calcular_stock();
            });
        }

        function fn_Yarn() {
            // New
            _('txtyarn').parentNode.children[2].onclick = function () {
                _('txtnewyarn').parentNode.parentNode.parentNode.parentNode.style.display = "block";
            }
            // Hide
            _('txtnewyarn').nextElementSibling.nextElementSibling.onclick = function () {
                _('txtnewyarn').parentNode.parentNode.parentNode.parentNode.style.display = "none";
            }
            // Save
            _('txtnewyarn').nextElementSibling.onclick = function () {
                if (_isnotEmpty(_('txtnewyarn').value)) {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = { nombreformahilado: _('txtnewyarn').value };
                    _Get('DesarrolloTextil/CotizarTela/SaveData_FormaHilado?par=' + JSON.stringify(parametro))
                        .then((resultado) => {
                            let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (rpta !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });

                                _('txtnewyarn').value = "";
                                _('txtnewyarn').parentNode.parentNode.parentNode.parentNode.style.display = "none";

                                ovariables.lstHilado = rpta;
                                fn_FillYarn();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                } else {
                    swal({ title: "Advertencia", text: "Debes ingresar un Nombre de Forma de Hilo", type: "warning" });
                }
            }
        }

        function fn_FillYarn() {
            let html = '';
            if (ovariables.lstHilado !== null) {
                ovariables.lstHilado.forEach(x => {
                    html += `<option value="${_escapeXml(x.NombreFormaHilado)}"></option>`;
                });
            }
            _('lstYarn').innerHTML = html;
        }

        function req_ini() {
            fn_getdatainicial();
            fn_buscar_codigotela_enlista();
        }

        function fn_getdataeditar() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idorden: ovariables.idorden };
            _Get('DesarrolloTextil/CotizarTela/GetData_Edit_Cotizar_Tela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let orden = JSON.parse(rpta[0].orden);
                        let hilado = CSVtoJSON(rpta[0].hilado);
                        let servicio = CSVtoJSON(rpta[0].servicio);

                        ovariables.idanalisistextil = orden[0].idanalisistextil;
                        ovariables.id = orden[0].IdSolicitudDetalle;
                        ovariables.idaux = orden[0].IdSolicitudCotizar;

                        if (ovariables.id !== '') {
                            req_CargarCotizacion();
                            _('div_solicitud').style.display = "block";
                            _('btnFinalizar').style.display = "initial";

                            // Se oculta si es Vista 1
                            if (ovariables.vista === 1) {
                                _('btnFinalizar').style.display = "none";
                            }
                        }

                        _('cbo_clientes').value = orden[0].idcliente;

                        fn_temporadas();

                        _('cbo_temporada').value = orden[0].idclientetemporada;
                        _('txttesting').value = orden[0].testingcode;
                        _('txtmillcode').value = orden[0].millcode;
                        _('txtbatch').value = orden[0].batch;
                        _('txtfamilia').value = orden[0].nombrefamilia;
                        _('txtespecificacion').value = orden[0].especificacion;
                        _('txtporcentaje_contenido_tela').value = orden[0].contenidotela;
                        _('txttenido').value = orden[0].tenido !== undefined ? orden[0].tenido : '';
                        _('txtdensidad').value = orden[0].densidad;
                        //_('txtlavado').value = orden[0].lavado;
                        if (orden[0].lavado === 'BW') {
                            $('.i-check-lavado').prop("checked", false).iCheck("update");
                            $('.i-check-lavado').eq(0).prop("checked", true).iCheck("update");
                        } else {
                            $('.i-check-lavado').prop("checked", false).iCheck("update");
                            $('.i-check-lavado').eq(1).prop("checked", true).iCheck("update");
                        }
                        _('txtgalga').value = orden[0].galga;
                        _('txtdiametro').value = orden[0].diametro;
                        _('txtanchototal').value = orden[0].anchototal;
                        _('txtnumero_reporteatx').value = orden[0].codigo;
                        _('txtCodigoTela').value = orden[0].codigotela;
                        _('txtdensidad_oz').value = parseFloat(orden[0].densidadozyd).toFixed(ovariables.decimales_dos);
                        _('txtancho_util').value = parseFloat(orden[0].anchoutil).toFixed(ovariables.decimales_dos);
                        _('txtrendimiento_m').value = parseFloat(orden[0].rendimientomkg).toFixed(ovariables.decimales);
                        _('txtrendimiento_yd').value = parseFloat(orden[0].rendimientoydkg).toFixed(ovariables.decimales);
                        _('txtprecio_kg').value = parseFloat(orden[0].precioresultantekg).toFixed(ovariables.decimales_dos);
                        _('txtprecio_m').value = parseFloat(orden[0].precioresultantem).toFixed(ovariables.decimales);
                        _('txtprecio_yd').value = parseFloat(orden[0].precioresultanteyd).toFixed(ovariables.decimales);
                        _('txtdias').value = orden[0].dias;
                        _('txtcantidad_minima_kg').value = parseFloat(orden[0].cantidadminimaordenkg).toFixed(ovariables.decimales_dos);
                        _('txtcantidad_minima_m').value = parseFloat(orden[0].cantidadminimaordenm).toFixed(ovariables.decimales);
                        _('txtcantidad_minima_yd').value = parseFloat(orden[0].cantidadminimaordenyd).toFixed(ovariables.decimales);
                        _('txtcantidad_minima_color_kg').value = parseFloat(orden[0].cantidadminimacolorkg).toFixed(ovariables.decimales_dos);
                        _('txtcantidad_minima_color_m').value = parseFloat(orden[0].cantidadminimacolorm).toFixed(ovariables.decimales);
                        _('txtcantidad_minima_color_yd').value = parseFloat(orden[0].cantidadminimacoloryd).toFixed(ovariables.decimales);
                        _('txtstock').value = parseFloat(orden[0].stockcolor).toFixed(ovariables.decimales);
                        _('txtstock_kg').value = parseFloat(orden[0].stockcolorkg).toFixed(ovariables.decimales);
                        _('txtstock_m').value = parseFloat(orden[0].stockcolorm).toFixed(ovariables.decimales);
                        _('txtstock_yd').value = parseFloat(orden[0].stockcoloryd).toFixed(ovariables.decimales);
                        _('cbo_modalidad').value = orden[0].modalidad;
                        _('cbo_semaforo').value = orden[0].semaforo;
                        _('txta_observaciones').value = orden[0].observaciones;
                        _('txta_recordar').value = orden[0].comentariorecordar;
                        _('txtyarn').value = orden[0].yarn;

                        if (hilado !== '') {

                            let cbo_proveedor = '';

                            let html = '', precio = 0, preciototal = 0;


                            hilado.forEach(x => {

                                precio = parseFloat(x.precio).toFixed(ovariables.decimales_dos);
                                preciototal = parseFloat(x.preciototal).toFixed(ovariables.decimales_dos);

                                cbo_proveedor = '<option value="0">Seleccione...</option>';

                                ovariables.proveedores.forEach(p => {
                                    if (x.idproveedor == p.idproveedor) {
                                        cbo_proveedor += `<option value='${p.idproveedor}' selected="selected">${p.nombreproveedor}</option>`;
                                    }
                                    else {
                                        cbo_proveedor += `<option value='${p.idproveedor}'>${p.nombreproveedor}</option>`;
                                    }
                                });

                                html += `<tr id="${x.idanalisistextilhilado}">
                                                <td>${x.titulo}</td>
                                                <td>${x.porcentaje}</td>
                                                <td>${x.contenido}</td>
                                                <td>${x.porcentaje}</td>
                                                <td>
                                                    <select class="form-control _enty_grabar" data-min="1" data-max="20" data-required="false">
                                                          ${cbo_proveedor}                              
                                                     </select>
                                                </td>
                                                <td>
                                                    <input type='text' class='form-control _enty_grabar' name="precio" data-required="true" data-min="1" data-type="int" data-max="254" value="${precio}" onkeyup="appNewCotizacion.fn_calcula_hilado(this)"></input>
                                                </td>
                                                <td>
                                                    <label name="lbl_precio_hilo">${preciototal}</label>
                                                </td>
                                             </tr> `;
                            });
                            _('tbody_index_contenido').innerHTML = html;
                            fn_sumar_total_hilado();
                        }

                        if (servicio !== '') {
                            let html = '', isDisabled = '', isBool, merma = 0, precio = 0, preciototal = 0;

                            servicio.forEach(x => {
                                cbo_proveedor = '<option value="0">Seleccione...</option>';

                                ovariables.proveedores.forEach(p => {
                                    if (x.idproveedor == p.idproveedor) {
                                        cbo_proveedor += `<option value='${p.idproveedor}' selected="selected">${p.nombreproveedor}</option>`;
                                    }
                                    else {
                                        cbo_proveedor += `<option value='${p.idproveedor}'>${p.nombreproveedor}</option>`;
                                    }
                                });

                                merma = parseFloat(x.merma).toFixed(ovariables.decimales_dos);
                                precio = parseFloat(x.precio).toFixed(ovariables.decimales_dos);
                                preciototal = parseFloat(x.preciototal).toFixed(ovariables.decimales_dos);

                                isDisabled = x.nombre === 'REENCONADO' ? 'disabled' : '';
                                isBool = x.nombre === 'REENCONADO' ? false : true;

                                html += `<tr id="${x.idservicio}">
                                                <td  class="text-center">
                                                    <button class="btn btn-sm btn-danger" data-toggle="tooltip" data-idservicio='${x.idservicio}' onclick="appNewCotizacion.fn_Eliminar(this)"  title='Eliminar'>
                                                       <span class="fa fa-trash" style="cursor:pointer;"></span>
                                                    </button>
                                                </td>
                                                <td>${x.nombre}</td>
                                                <td>
                                                    <select class="form-control _enty_grabar" data-min="1" data-type="int" data-max="20" data-required="false">
                                                          ${cbo_proveedor}                              
                                                     </select>
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control _enty_grabar" name="merma" ${isDisabled} data-input="merma" value="${merma}" data-required="${isBool}" data-min="1" data-type="int" data-max="254" onkeyup="appNewCotizacion.fn_calcula_servicio(this)"></input>
                                                </td>                                                
                                                <td>
                                                    <input type="text" class="form-control _enty_grabar" name="precio_servicio"  data-required="true" data-min="1" data-type="int" data-max="254"  value="${precio}" data-input="precioservicio" onkeyup="appNewCotizacion.fn_calcula_servicio(this)"></input>
                                                </td>
                                                <td>
                                                    <label name="lbl_precio_total_servicio">${preciototal}</label>
                                                </td>
                                            </tr>
                                              `;
                            });
                            _('tbody_servicios_proveedor').innerHTML = html;
                            //_rules({ clase: '_enty_grabar', id: 'panelEncabezado_cotizartela' });
                            fn_disabledAll(1);

                        }

                    }
                }, (p) => { err(p); });    
        }

        function fn_getdatainicial() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('DesarrolloTextil/CotizarTela/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.cbo_clientes = rpta[0].clientes !== '' ? CSVtoJSON(rpta[0].clientes) : null;
                        ovariables.cbo_temporadas = rpta[0].temporadas !== '' ? CSVtoJSON(rpta[0].temporadas) : null;
                        ovariables.proveedores = rpta[0].proveedores !== '' ? CSVtoJSON(rpta[0].proveedores) : null;
                        ovariables.lstHilado = rpta[0].formahilado !== '' ? JSON.parse(rpta[0].formahilado) : null;
                        let lstAnio = rpta[0].anio !== '' ? JSON.parse(rpta[0].anio) : [];
                        let servicios = rpta[0].servicios !== '' ? CSVtoJSON(rpta[0].servicios) : null;

                        //Llena datalist de Hilado
                        fn_FillYarn();

                        let cbo_Anio = '';
                        lstAnio.forEach(x => {
                            cbo_Anio += `<option value ='${x.Anio}'>${x.Anio}</option>`;
                        });
                        _('cboAnioATX').innerHTML = cbo_Anio;

                        let cbo_clientes = "";
                        cbo_clientes = `<option value='0'>Seleccione...</option>`;
                        ovariables.cbo_clientes.forEach(x => {
                            cbo_clientes += `<option value='${x.idcliente}'>${x.nombrecliente}</option>`;
                        });

                        _('cbo_clientes').innerHTML = cbo_clientes;
                        _('cbo_clientes').addEventListener('change', fn_temporadas);                       

                        let cbo_servicios = '<option value="0">Seleccione...</option>';

                        servicios.forEach(x => {
                            cbo_servicios += `<option value='${x.idservicio}'>${x.nombre}</option>`;
                        });

                        _('cbo_servicio').innerHTML = cbo_servicios;

                        if (ovariables.accion === 'new2') {
                            req_CargarCotizacion();
                        } else if (ovariables.accion === 'edit') {
                            fn_getdataeditar();
                        }
                    }
                }, (p) => { err(p); });

        }

        function fn_temporadas() {
            let idcliente = _('cbo_clientes').value, cbo_temporadas = '';

            cbo_temporadas = `<option value='0'>Seleccione...</option>`;

            ovariables.cbo_temporadas.forEach(x => {
                if (idcliente == x.idcliente) {
                    cbo_temporadas += `<option value='${x.idclientetemporada}'>${x.temporada}</option>`;
                }
            });

            _('cbo_temporada').innerHTML = cbo_temporadas;
        }

        function fn_buscarxCodigoTela() {
            let codigotela = _('txtCodigoTela').value;
            ovariables.codigotelaATX = codigotela;
            parametro = { codigotela: codigotela, codigoatx: '' };
            fn_buscar(parametro);
        }

        function fn_buscarxATX() {
            let codigoatx = _('txtnumero_reporteatx').value;
            parametro = { codigotela: '', codigoatx: codigoatx };
            fn_buscar(parametro);
        }

        function req_CargarCotizacion() {
            if (ovariables.idaux !== 0) {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idsolicitud: ovariables.idaux };
                _Get('DesarrolloTextil/CotizarTela/Get_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lstDetalle = JSON.parse(rpta[0].detalle);
                            res_CargarCotizacion();
                        }
                    }, (p) => { err(p); });
            }
        }

        function res_CargarCotizacion() {
            let filter = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === _parseInt(ovariables.id))[0];
            let html = '';
            if (_isnotEmpty(filter)) {
                html = `<tr>
                            <td>${filter.IdSolicitudDetalle}</td>
                            <td>${filter.NombreCliente}</td>
                            <td>${filter.CodigoClienteTemporada}</td>
                            <td>${filter.CodigoTela}</td>
                            <td>${filter.NroATX}</td>
                            <td>${filter.Descripcion}</td>
                            <td>${filter.TradeName}</td>
                            <td>${filter.Division}</td>
                            <td>${filter.Rango}</td>
                            <td>${filter.Modalidad === `M` ? `Muestra` : filter.Modalidad === `P` ? `Produccion` : ``}</td>
                            <td>${filter.Comentario}</td>
                        </tr>`;
                _('tbody_tbl_solicitud').innerHTML = html;

                if (ovariables.accion === 'new2') {
                    // Search codigo tela
                    parametro = { codigotela: filter.CodigoTela, codigoatx: filter.NroATX };
                    fn_buscar(parametro);

                    // Combos
                    _('cbo_clientes').value = filter.IdCliente;
                    fn_temporadas();
                    _('cbo_temporada').value = filter.IdClienteTemporada;
                    _('cbo_modalidad').value = filter.Modalidad;
                }
            }
        }

        function fn_buscar_codigotela_enlista() {
            let parametro = _('cboAnioATX').value !== '' ? _('cboAnioATX').value : '2019';
            $('#myModalSpinner').modal('show');
            //$('#divContenido .modal').addClass('no-z-index');
            _Get('DesarrolloTextil/CotizarTela/GetData_ListaATXCodigoTela?par=' + parametro)
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        $('#myModalSpinner').modal('hide');
                        //$('#divContenido .modal').removeClass('no-z-index');
                        //console.log(rpta);

                        ovariables.lstTodosATX = {
                            analisistextil: rpta[0].analisistextil !== '' ? JSON.parse(rpta[0].analisistextil) : null,
                            contenido: rpta[0].contenido !== '' ? JSON.parse(rpta[0].contenido) : null
                        };
                        let table = _('div_tbl_Items'), html = '';
                        table.innerHTML = "";
                        html = `
                        <table id="tbl_codigo_agregar" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                            <thead>
                                <tr>
                                    <th class="text-center no-sort" data-search="false"></th>
                                    <th>Codigo Tela</th>
                                    <th>N° Reporte ATX</th>
                                    <th>Testing</th>
                                    <th>Mill Code</th>
                                    <th>Batch</th>
                                    <th>Familia</th>
                                    <th>Especificacion</th>
                                    <th>% Contenido de Tela</th>
                                    <th>Teñido</th>
                                    <th>Densidad(g./m.²)</th>
                                    <th>BW/AW</th>
                                    <th>Galga</th>
                                    <th>Diametro</th>
                                    <th>Ancho Total (m.)</th>
                                </tr>
                            </thead>
                            <tbody>
                        `;
                        if (ovariables.lstTodosATX.analisistextil !== null) {
                            ovariables.lstTodosATX.analisistextil.forEach(x => {
                                html += `
                                <tr>    
                                    <td class="text-center">                                        
                                        <input class="i-check" type="radio" data-codigotela='${x.codigotela}' name="codigo_agregar" />
                                    </td>
                                    <td>${x.codigotela}</td>
                                    <td>${x.codigo}</td>
                                    <td>${x.testingcode}</td>
                                    <td>${x.millcode}</td>
                                    <td>${x.batch}</td>    
                                    <td>${x.nombrefamilia}</td>
                                    <td></td>
                                    <td>${x.contenidotela}</td>
                                    <td>${x.tenido}</td>
                                    <td>${x.densidad}</td>
                                    <td>${x.lavado}</td>
                                    <td>${x.galga}</td>
                                    <td>${x.diametro}</td>
                                    <td>${x.anchototal}</td>
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

        function formatTableCodigoAgregar() {
            // Crea footer
            _('tbl_codigo_agregar').createTFoot();
            _('tbl_codigo_agregar').tFoot.innerHTML = _('tbl_codigo_agregar').tHead.innerHTML;

            // Añade input text en footer por cada celda
            $('#tbl_codigo_agregar tfoot th').each(function () {
                //var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Buscar ' + title + '" />');

                let element = $(this).data("search");
                let width = $(this).data("width");
                if (element === false) {
                    $(this).html('');
                } else {
                    $(this).html(`<input type="text" placeholder="Buscar" ${width !== undefined ? 'style="width:' + width + '"' : ''} />`);
                }
            });

            // DataTable
            var table = $('#tbl_codigo_agregar').DataTable({
                "language": {
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "zeroRecords": "No se encontraron registros",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "paginate": {
                        "next": "&#8250;",
                        "previous": "&#8249;",
                        "first": "&#171;",
                        "last": "&#187;"
                    },
                    "search": "Buscar"
                },
                drawCallback: function () {
                    $('.i-check').iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green',
                    }).on('ifChanged', function () {
                        ovariables.codigotelaATX = $(this).data('codigotela');
                    });
                },
                info: false,
                lengthChange: false,
                pageLength: 5,
            });

            // Buscar en keyup
            table.columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });

            $("#tbl_codigo_agregar tfoot tr").appendTo("#tbl_codigo_agregar thead");
            $("#tbl_codigo_agregar tfoot").remove();

            // Paginate in diferent div
            $("#tbl_codigo_agregar_paginate").parent().parent().appendTo("#div_tbl_Items_pagination");
            $("#tbl_codigo_agregar_paginate").css({
                'text-align': 'right',
                'margin': '2px 0'
            });
            $("#tbl_codigo_agregar_wrapper").css("padding", "0");

            // Hide table general search
            $('#tbl_codigo_agregar_filter').hide();
        }

        function fn_agregar_codigos_lista_principal() {
            _('txtCodigoTela').value = ovariables.codigotelaATX;
            $("#btnBuscarxCodigoTela").click();
        }

        function fn_buscar(parametro) {
            let err = function (__err) { console.log('err', __err) };
            _Get('DesarrolloTextil/CotizarTela/GetData_BuscarATX?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        if (rpta[0].analisistextil !== '') {
                            let analisistextil = JSON.parse(rpta[0].analisistextil);
                            ovariables.idanalisistextil = analisistextil[0].idanalisistextil;
                            _('txttesting').value = analisistextil[0].testingcode;
                            _('txtmillcode').value = analisistextil[0].millcode;
                            _('txtbatch').value = analisistextil[0].batch;
                            _('txtfamilia').value = analisistextil[0].nombrefamilia;
                            _('txtespecificacion').value = '';
                            _('txtporcentaje_contenido_tela').value = analisistextil[0].contenidotela;
                            _('txttenido').value = analisistextil[0].tenido !== undefined ? analisistextil[0].tenido : '';
                            _('txtdensidad').value = analisistextil[0].densidad;
                            //_('txtlavado').value = analisistextil[0].lavado;
                            if (analisistextil[0].lavado === 'BW') {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(0).prop("checked", true).iCheck("update");
                            } else {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(1).prop("checked", true).iCheck("update");
                            }
                            _('txtgalga').value = analisistextil[0].galga;
                            _('txtdiametro').value = analisistextil[0].diametro;
                            _('txtanchototal').value = _parseFloat(analisistextil[0].anchototal).toFixed(ovariables.decimales_dos);
                            _('txtnumero_reporteatx').value = analisistextil[0].codigo;
                            _('txtCodigoTela').value = analisistextil[0].codigotela;

                            let cbo_proveedor = '<option value="0">Seleccione...</option>';

                            ovariables.proveedores.forEach(x => {
                                cbo_proveedor += `<option value='${x.idproveedor}'>${x.nombreproveedor}</option>`;
                            });

                            if (analisistextil[0].densidad !== '') {
                                let densidad = analisistextil[0].densidad;
                                _('txtdensidad_oz').value = ((densidad * 1) * ovariables.densidad).toFixed(ovariables.decimales_dos);
                            }

                            if (analisistextil[0].anchototal !== '') {
                                let anchototal = analisistextil[0].anchototal;
                                _('txtancho_util').value = ((anchototal * 1) * ovariables.anchototal).toFixed(ovariables.decimales_dos);
                            }

                            if (rpta[0].contenido !== '') {
                                let hilado = JSON.parse(rpta[0].contenido);
                                let html = '';
                                hilado.forEach(x => {
                                    html += `<tr id="${x.idanalisistextilhilado}">
                                                <td>${x.titulo}</td>
                                                <td>${x.porcentaje}</td>
                                                <td>${x.contenido}</td>
                                                <td>${x.porcentajetela}</td>
                                                <td>
                                                    <select class="form-control _enty_grabar" data-min="1" data-max="20" data-required="false">
                                                          ${cbo_proveedor}                              
                                                     </select>
                                                </td>
                                                <td>
                                                    <input type='text' class='form-control _enty_grabar' name="precio" data-required="true" data-min="1" data-type="int" data-max="254" value="${0.00}" onkeyup="appNewCotizacion.fn_calcula_hilado(this)"></input>
                                                </td>
                                                <td>
                                                    <label name="lbl_precio_hilo">0.00</label>
                                                </td>
                                             </tr> `
                                });
                                _('tbody_index_contenido').innerHTML = html;
                            }

                            let txtrendimiento_m = (1000 / (analisistextil[0].densidad * analisistextil[0].anchototal)).toFixed(ovariables.decimales);
                            let txtrendimiento_yd = (txtrendimiento_m / ovariables.rendimiento_yd).toFixed(ovariables.decimales);
                            _("txtrendimiento_m").value = isFinite(txtrendimiento_m) ? txtrendimiento_m : 0.00;
                            _("txtrendimiento_yd").value = isFinite(txtrendimiento_yd) ? txtrendimiento_yd : 0.00;

                            fn_limpiar_cajar_cotizacion();

                        } else {
                            _('txttesting').value = '';
                            _('txtmillcode').value = '';
                            _('txtbatch').value = '';
                            _('txtfamilia').value = '';
                            _('txtespecificacion').value = '';
                            _('txtporcentaje_contenido_tela').value = '';
                            _('txttenido').value = '';
                            _('txtdensidad').value = '';
                            //_('txtlavado').value = '';
                            $('.i-check-lavado').prop("checked", false).iCheck("update");
                            _('txtgalga').value = '';
                            _('txtdiametro').value = '';
                            _('txtanchototal').value = '';
                            _('txtnumero_reporteatx').value = '';
                            _('txtCodigoTela').value = '';
                            _('txtdensidad_oz').value = '0.00';
                            _('txtancho_util').value = '0.00';
                            _('tbody_index_contenido').innerHTML = '';

                            _('txtrendimiento_m').value = '0.00';
                            _('txtrendimiento_yd').value = '0.00';

                            fn_limpiar_cajar_cotizacion();
                        }

                    }
                }, (p) => { err(p); });
        }

        function fn_limpiar_cajar_cotizacion() {
            _('txtprecio_kg').value = '0.00';
            _('txtprecio_m').value = '0.00';
            _('txtprecio_yd').value = '0.00';
            _('txtdias').value = '0';
            _('txtcantidad_minima_kg').value = '0.00';
            _('txtcantidad_minima_m').value = '0.00';
            _('txtcantidad_minima_yd').value = '0.00';
            _('txtcantidad_minima_color_kg').value = '0.00';
            _('txtcantidad_minima_color_m').value = '0.00';
            _('txtcantidad_minima_color_yd').value = '0.00';
            _('txtstock').value = '0';
            _('txtstock_kg').value = '0.00';
            _('txtstock_m').value = '0.00';
            _('txtstock_yd').value = '0.00';

            _('tbody_servicios_proveedor').innerHTML = '';

            _('td_total_precio_hilos').innerHTML = '0.00';
            _('td_total_precio_servicio').innerHTML = '0.00';
        }

        function fn_limpiar_todos_loscampos() {
            _('txttesting').value = '';
            _('txtmillcode').value = '';
            _('txtbatch').value = '';
            _('txtfamilia').value = '';
            _('txtespecificacion').value = '';
            _('txtporcentaje_contenido_tela').value = '';
            _('txttenido').value = '';
            _('txtdensidad').value = '';
            //_('txtlavado').value = '';
            $('.i-check-lavado').prop("checked", false).iCheck("update");
            _('txtgalga').value = '';
            _('txtdiametro').value = '';
            _('txtanchototal').value = '';
            _('txtnumero_reporteatx').value = '';
            _('txtCodigoTela').value = '';
            _('txtdensidad_oz').value = '0.00';
            _('txtancho_util').value = '0.00';
            _('tbody_index_contenido').innerHTML = '';

            _('txtrendimiento_m').value = '0.00';
            _('txtrendimiento_yd').value = '0.00';

            //Combos
            _('cbo_clientes').value = 0;
            _('cbo_temporada').value = 0;
            _('cbo_modalidad').value = 0;
            _('cbo_semaforo').value = 0;
            _('cbo_servicio').value = 0;

            //Obs
            _('txta_observaciones').value = '';
            _('txta_recordar').value = '';

            //Limpiar checkbox
            $("#div_tbl_Items input").prop("checked", false).iCheck("update");

            fn_limpiar_cajar_cotizacion();
        }

        function fn_agregar_servicio() {
            let cbo_servicio = _('cbo_servicio');            

            if (cbo_servicio.value !== 0) {
                let nombreservicio = cbo_servicio.options[cbo_servicio.selectedIndex].text;

                let tbody = _('tbody_servicios_proveedor');
              
                let lencontrado = false;

                for (let i = 0; i < tbody.rows.length; i++) {
                    if (nombreservicio === tbody.rows[i].cells[1].innerHTML) {                        
                        lencontrado = true;
                        break;
                    }
                }

                let isDisabled = nombreservicio === 'REENCONADO' ? 'disabled' : '';
                let isBool = nombreservicio === 'REENCONADO' ? false : true;
                
                if (lencontrado === false) {
                    // 0 al inicio -1 al final de la tabla
                    let row = tbody.insertRow(-1);

                    let cbo_proveedor = '<option value="0">Seleccione...</option>';

                    ovariables.proveedores.forEach(x => {
                        cbo_proveedor += `<option value='${x.idproveedor}'>${x.nombreproveedor}</option>`;
                    });

                    row.id = cbo_servicio.value;

                    let html = `
                                                <td  class="text-center">
                                                    <button class="btn btn-sm btn-danger" data-toggle="tooltip" data-idservicio='${cbo_servicio.value}' onclick="appNewCotizacion.fn_Eliminar(this)"  title='Eliminar'>
                                                       <span class="fa fa-trash" style="cursor:pointer;"></span>
                                                    </button>
                                                </td>
                                                <td>${nombreservicio}</td>
                                                <td>
                                                    <select class="form-control _enty_grabar" data-min="1" data-type="int" data-max="20" data-required="false">
                                                          ${cbo_proveedor}                              
                                                     </select>
                                                </td>
                                                <td>
                                                    <input type="text" class="form-control _enty_grabar" name="merma" ${isDisabled} data-input="merma" value="${0.00}" data-required="${isBool}" data-min="1" data-type="int" data-max="254" onkeyup="appNewCotizacion.fn_calcula_servicio(this)"></input>
                                                </td>                                                
                                                <td>
                                                    <input type="text" class="form-control _enty_grabar" name="precio_servicio"  data-required="true" data-min="1" data-type="int" data-max="254" value="${"0.00"}" data-input="precioservicio" onkeyup="appNewCotizacion.fn_calcula_servicio(this)"></input>
                                                </td>
                                                <td>
                                                    <label name="lbl_precio_total_servicio">0.00</label>
                                                </td>
                                              `;
                    row.innerHTML = html;
                    fn_calcula_servicio();
                    //_rules({ clase: '_enty_grabar', id: 'panelEncabezado_cotizartela' });
                } else {
                    _swal({ estado: 'warning', mensaje: 'El servicio se encuentra seleccionado.' });                           
                }              
            } else {
                _swal({ estado: 'warning', mensaje: 'Seleccione por lo menos 1 servicio.' });                           
            }
        }

        function fn_calcula_servicio(input) {
            if (input != null) {
                let tipo = input.getAttribute("data-input");
                if (tipo === 'merma') {
                    if (Number(input.value) > 100) {
                        input.value = 100
                    }
                }
            }

            for (let i = 0; i < _('tbody_servicios_proveedor').rows.length; i++) {
                //let position = input.parentNode.parentNode.rowIndex - 1;
                let position = i;
                let merma = _parseFloat(_('tbody_servicios_proveedor').rows[position].children[3].children[0].value);
                let precio = _parseFloat(_('tbody_servicios_proveedor').rows[position].children[4].children[0].value);
                let resultado = _('tbody_servicios_proveedor').rows[position].children[5].children[0];
                let servicio = _('tbody_servicios_proveedor').rows[position].children[1].textContent;
                let total_hilado = parseFloat(_('td_total_precio_hilos').textContent);
                let total = '';

                if (position === 0) {
                    if (servicio === 'REENCONADO') {
                        total = (precio + total_hilado).toFixed(ovariables.decimales_dos);
                    } else {
                        total = ((((precio + total_hilado) * merma) / 100) + (precio + total_hilado)).toFixed(ovariables.decimales_dos);
                    }
                } else {
                    let total_anterior = _parseFloat(_('tbody_servicios_proveedor').rows[position - 1].children[5].children[0].textContent)
                    if (servicio === 'REENCONADO') {
                        total = (precio + total_anterior).toFixed(ovariables.decimales_dos);
                    } else {
                        total = ((((precio + total_anterior) * merma) / 100) + (precio + total_anterior)).toFixed(ovariables.decimales_dos);
                    }
                }
                resultado.innerHTML = total;
                _('txtprecio_kg').value = total;
                fn_precioresultante_kg();
            }
        }

        function fn_calcula_hilado(input) {
            let preciohilo = _parseFloat(input.value == '' || input.value == '.' ? 0 : input.value);
            let porcentaje_hilado = _parseFloat(input.parentNode.parentNode.children[1].innerHTML);
            let precio_total_hilado = input.parentNode.parentNode.children[6].children[0];

            precio_total_hilado.innerHTML = ((preciohilo * porcentaje_hilado) / 100).toFixed(ovariables.decimales_dos);

            fn_sumar_total_hilado();
            fn_calcula_servicio();
        }

        function fn_sumar_total_hilado() {
            let lbl_precio_hilo = document.getElementsByName("lbl_precio_hilo");
            let sumatotal = 0;

            for (let i = 0; i < lbl_precio_hilo.length; i++) {
                sumatotal += (lbl_precio_hilo[i].innerHTML * 1);
            }

            _('td_total_precio_hilos').innerHTML = (sumatotal).toFixed(ovariables.decimales_dos);
        }

        function fn_Eliminar(button) {
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_servicios').deleteRow(i);       
            fn_calcula_servicio();
        }

        function fn_precioresultante_kg() {
            let precio_resultante_kg = _parseFloat(_('txtprecio_kg').value);
            let rendimiento_mkg = _parseFloat(_('txtrendimiento_m').value);

            let precio_resultante_m = isFinite(precio_resultante_kg / rendimiento_mkg) ? precio_resultante_kg / rendimiento_mkg : 0;
            _('txtprecio_m').value = precio_resultante_m.toFixed(ovariables.decimales);

            _('txtprecio_yd').value = (precio_resultante_m * ovariables.precio_resultante_yd).toFixed(ovariables.decimales);
        }

        function fn_calcular_cantidad_minima_orden() {
            let rendimiento_m = _parseFloat(_('txtrendimiento_m').value);
            let cantidad_minima_kg = _parseFloat(_('txtcantidad_minima_kg').value);
            let rendimiento_yd = _parseFloat(_('txtrendimiento_yd').value);

            _('txtcantidad_minima_m').value = (cantidad_minima_kg * rendimiento_m).toFixed(ovariables.decimales);

            _('txtcantidad_minima_yd').value = (cantidad_minima_kg * rendimiento_yd).toFixed(ovariables.decimales);
        }

        function fn_calcular_cantidad_minima_color() {
            let rendimiento_m = _parseFloat(_('txtrendimiento_m').value);
            let cantidad_minima_color_kg = _parseFloat(_('txtcantidad_minima_color_kg').value);
            let rendimiento_yd = _parseFloat(_('txtrendimiento_yd').value);
        
            _('txtcantidad_minima_color_m').value = (cantidad_minima_color_kg * rendimiento_m).toFixed(ovariables.decimales);

            _('txtcantidad_minima_color_yd').value = (cantidad_minima_color_kg * rendimiento_yd).toFixed(ovariables.decimales);
        }

        function fn_calcular_stock() {
            let rendimiento_m = _parseFloat(_('txtrendimiento_m').value);
            let stock_kg = _parseFloat(_('txtstock_kg').value);
            let rendimiento_yd = _parseFloat(_('txtrendimiento_yd').value);

            _('txtstock_m').value = (stock_kg * rendimiento_m).toFixed(ovariables.decimales);

            _('txtstock_yd').value = (stock_kg * rendimiento_yd).toFixed(ovariables.decimales);
        }

        function fn_return() {
            //let urlAccion = 'DesarrolloTextil/CotizarTela/Index';
            //_Go_Url(urlAccion, urlAccion, 'accion:index');
            if (ovariables.vista === 1) {
                let urlAccion = 'DesarrolloTextil/Solicitud/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'DesarrolloTextil/CotizarTela/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function fn_FinalizarOrden() {
            swal({
                html: true,
                title: "Finalizar Orden",
                text: "¿Estas seguro/a que deseas finalizar la Orden? <br /> <span style='font-weight: 400; font-size: 14px;'>Al finalizar la orden, esta no podra ser editada o eliminada y pasara a modo de solo vista</span>",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                ovariables.estado = 1;
                fn_save();
            });
        }

        function fn_save() {
            let req_enty = '';
            let tbody_servicios = _('tbody_servicios_proveedor');
            let tbody_hilos = _('tbody_index_contenido');
            
            req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_cotizartela' });
            let cantidadfilas_servicios = tbody_servicios.rows.length;
            let validar_antesgrabar = () => {
                _().rows
            }

            //$("#tbl_style_agregar input, #tbl_servicios input").each(function () {
            //    if ($(this).val() == '') {
            //        $(this).addClass('error-empty');
            //    } else {
            //        $(this).removeClass('error-empty');
            //    }
            //});

            //$("#tbl_style_agregar select, #tbl_servicios select").each(function () {
            //    if ($(this).val() == 0) {
            //        $(this).addClass('error-empty');
            //    } else {
            //        $(this).removeClass('error-empty');
            //    }
            //});
            //&& !$("._enty_grabar").hasClass("error-empty")

            //Fix _required
            $("#tbody_index_contenido select").css("border", "inherit");
            $("#tbody_servicios_proveedor select").css("border", "inherit");

            //Fix de Merma
            let arr = Array.from(_('tbody_servicios_proveedor').children);
            arr.forEach(x => {
                let input = x.children[3].children[0];
                let texto = x.children[3].children[0].value;
                if (texto === '' || _parseInt(texto) < 1) {
                    input.style.borderColor = "red";
                }
            });

            if (req_enty && (cantidadfilas_servicios > 0)) {

                let par = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_cotizartela' });
                let hilado = '', servicio = '';
                let idanalisistextilhilado = '', porcentajehilado = '', idproveedorhilo = '', preciohilo = '', preciototal = '';               

                for (let i = 0; i < tbody_hilos.rows.length; i++) {
                    idanalisistextilhilado = tbody_hilos.rows[i].id;
                    porcentajehilado = tbody_hilos.rows[i].cells[1].innerHTML;
                    idproveedorhilo = tbody_hilos.rows[i].cells[4].children[0].value;
                    preciohilo = tbody_hilos.rows[i].cells[5].children[0].value;
                    preciototal = tbody_hilos.rows[i].cells[6].children[0].innerHTML;

                    hilado += idanalisistextilhilado + '¬' + porcentajehilado + '¬' + idproveedorhilo + '¬' + preciohilo + '¬' + preciototal + '^';
                }

                let idservicio = '', idproveedorservicio = '', merma = '', precioservicio = '', preciototalservicio = '';

                for (let i = 0; i < tbody_servicios.rows.length; i++) {
                    idservicio = tbody_servicios.rows[i].id;
                    idproveedorservicio = tbody_servicios.rows[i].cells[2].children[0].value;
                    merma = tbody_servicios.rows[i].cells[3].children[0].value;
                    precioservicio = tbody_servicios.rows[i].cells[4].children[0].value;
                    preciototalservicio = tbody_servicios.rows[i].cells[5].children[0].innerHTML;

                    servicio += idservicio + '¬' + idproveedorservicio + '¬' + merma + '¬' + precioservicio + '¬' + preciototalservicio + '^';
                }

                par['hilado'] = hilado;
                par['servicio'] = servicio;
                par['idanalisistextil'] = ovariables.idanalisistextil;
                par['idsolicitud'] = ovariables.id;
                par['finalizado'] = ovariables.estado;
                par['lavado'] = $("input[name='tipo_lavado']:checked").val() !== undefined ? $("input[name='tipo_lavado']:checked").val() : '';

                let form = new FormData();
                let urlaccion = '';

                if (ovariables.accion === "new" || ovariables.accion === "new2") {
                    urlaccion = 'DesarrolloTextil/CotizarTela/Save_New_CotizarTela';
                    form.append('par', JSON.stringify(par));
                    Post(urlaccion, form, function (rpta) {
                        if (rpta !== '') {
                            let data = rpta !== '' ? JSON.parse(rpta) : null;
                            //_swal({ mensaje: data.mensaje, estado: data.estado });
                            swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });
                            fn_return();
                            //if (ovariables.accion === "new") {                        
                            //    let idorden = data.id;
                            //    let urlAccion = 'DesarrolloTextil/CotizarTela/New';
                            //    _Go_Url(urlAccion, urlAccion, 'accion:edit,idorden:' + idorden);
                            //}
                        }
                        else {
                            _swal({ estado: 'error', mensaje: 'Could not delete' });
                        }
                    });
                } else {
                    urlaccion = 'DesarrolloTextil/CotizarTela/Save_Edit_CotizarTela';
                    par['idorden'] = ovariables.idorden;
                    form.append('par', JSON.stringify(par));
                    Post(urlaccion, form, function (rpta) {
                        if (rpta !== '') {

                            let data = rpta !== '' ? JSON.parse(rpta) : null;
                            //_swal({ mensaje: data.mensaje, estado: data.estado });
                            swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                            fn_return();
                        }
                        else {
                            _swal({ estado: 'error', mensaje: 'Could not delete' });
                        }
                    });
                }
            } else {
                if (cantidadfilas_servicios === 0) {
                    _swal({ estado: 'warning', mensaje: 'Seleccione por lo menos 1 servicio.' });                    
                }                
            }
        }

        function formatFields() {
            _rules({ clase: '_enty_grabar', id: 'panelEncabezado_cotizartela' });
            $('#txtcantidad_minima_kg').autoNumeric('init', { mDec: 2 });
            $('#txtcantidad_minima_color_kg').autoNumeric('init', { mDec: 2 });
            $('#txtstock_kg').autoNumeric('init', { mDec: 2 });
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_Eliminar: fn_Eliminar,
            fn_calcula_hilado: fn_calcula_hilado,
            fn_calcula_servicio: fn_calcula_servicio,
            ovariables: ovariables,
            formatFields: formatFields
        }
    }
)(document, 'panelEncabezado_presentacionEditar');
(
    function ini() {
        appNewCotizacion.load();
        appNewCotizacion.req_ini();
        appNewCotizacion.formatFields();
    }
)();
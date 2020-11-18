var app_IndexDDP = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            odelimitador: {
                col: '¬',
                row: '^'
            },
            options_clientes: [],
            options_responsables: [],
            ListaFiltro: [],
            ListaEstadosRequerimiento: [],
            ListaEstadosActividad: [],
            ListaJefeEquipos: [],
            ListaTipoProveedor: [],
            ListaProveedor: [],
            ListaActividadAll: [],
            ListaClienteMarca: [],
            ListaClienteDivision: [],
            ListaClienteTemporada: [],
            ListaTipoMuestraxCliente: [],
            ListaEstilosxCliente: [],
            ListaClientesTodo: [],
            Requerimiento: {},
            listaFiltroExportacion:'',
            parametroFiltroExportarExcel: null
        }

        const _inicioComboClientes = () => {
            //$("#cboClientes.chosen-select").chosen("destroy");
            $('#cboClientes.chosen-select').chosen()
                .change(function (obj, result) {
                    //console.debug("changed: %o", arguments);
                    //console.log("selected: " + result.selected);
                    let combo = obj.currentTarget;
                    ovariables.options_cliente = [];
                    //cundo se escoja la opcion "Todos"
                    if (result.selected === "0") {
                        $(combo).children("option[value!='0']").each(function (index, valor) {
                            ovariables.options_clientes.push(valor);
                        });

                        //$(combo).children("option[value!='0']").remove();
                        //$(combo).trigger("chosen:updated");
                        $(combo).val("0").trigger("chosen:updated");
                        GetCombosFiltroDespachoByIdsClientes_JSON_change($(combo).val());
                    } else if ($(this)[0].value === "0") {
                        if (parseInt(result.selected) > 0) {
                            $("#cboClientes.chosen-select").chosen("destroy");
                            $('#cboClientes.chosen-select').chosen();

                            //$("#cboClientes").val("0")
                            //$(combo).trigger("chosen:updated");
                            $(combo).val("");
                            $(combo).val(result.selected).trigger("chosen:updated");
                        }
                    }
                    else if (parseInt(result.selected) > 0) {
                        let valorCombo = $(combo).val();
                        if (valorCombo === '' || valorCombo === null) {
                            fn_resetCombosxCliente();
                        } else {
                            GetCombosFiltroDespachoByIdsClientes_JSON_change($(combo).val());
                        }
                    }
                    else if (result.deselected === "0") {
                        ovariables.options_clientes.forEach((x) => {
                            $(combo).append(x);
                        });
                        ovariables.options_clientes = [];
                        $(combo).trigger("chosen:updated");
                        fn_resetCombosxCliente();
                    } else if (parseInt(result.deselected) > 0) {
                        let valorCombo = $(combo).val();
                        if (valorCombo === '' || valorCombo === null) {
                            fn_resetCombosxCliente();
                        } else {
                            GetCombosFiltroDespachoByIdsClientes_JSON_change($(combo).val());
                        }
                    }

                });
        }
        const _comboClientes = () => {
            $("#cboClientes.chosen-select").chosen("destroy");
            $('#cboClientes.chosen-select').chosen();

            // POR DEFECTO TODOS LOS CLIENTES            
            $("#cboClientes").val("0");
            $("#cboClientes").trigger("chosen:updated");
            $("#cboClientes").trigger("chosen:activate");
                        

            //const cbocliente = _('cboClientes');
            //$(cbocliente).val("0");
            ////$(cbocliente).trigger("chosen:updated");
            //$(cbocliente).trigger("chosen:activate");
            //$(cbocliente).trigger("chosen:updated");

            /*Fix for choosen js*/
            $('.chosen-choices').click(function () {
                $(this).children().children().eq(0).focus()
            });

        }
        const _inicioComboResponsables = () => {
            $('#cboResponsables.chosen-select').chosen()
                .change(function (obj, result) {
                    //console.debug("changed: %o", arguments);
                    //console.log("selected: " + result.selected);
                    let combo = obj.currentTarget;
                    //cundo se escoja la opcion "Todos"
                    if (result.selected == "0") {
                        $(combo).children("option[value!='0']").each(function (index, valor) {
                            ovariables.options_responsables.push(valor);
                        });
                       
                        $(combo).val("0").trigger("chosen:updated");
                    } else if ($(this)[0].value === "0") {
                        if (parseInt(result.selected) > 0) {
                            $(combo).chosen("destroy");
                            $(combo).chosen();

                            $(combo).val("");
                            $(combo).val(result.selected).trigger("chosen:updated");                       
                        }
                    }
                    else if (result.deselected == "0") {
                        ovariables.options_responsables.forEach((x) => {
                            $(combo).append(x);
                        });
                        $(combo).trigger("chosen:updated");
                    }
                });

            /*Fix for choosen js*/
            $('.chosen-choices').click(function () {
                $(this).children().children().eq(0).focus()
            });
        }
        const _comboResponsables = (arrResponsables,NombrePersonal) => {
            $("#cboResponsables.chosen-select").chosen("destroy");
            $('#cboResponsables.chosen-select').chosen();

            const arrpersonal = arrResponsables.filter(x => x.IdPersonal === utilindex.idpersonal);
            const npersonal = arrpersonal.length > 0 ? arrpersonal[0].NombrePersonal : '';
            const filtrado = arrResponsables.filter(x => x.NombrePersonal.toUpperCase() === (npersonal !== '' ? npersonal : NombrePersonal));
            let existeOptionTodos = filtrado.length > 0 ? true : false;
            let idpersonal = filtrado[0].IdPersonal;

            if (existeOptionTodos) {
                $("#cboResponsables").val(idpersonal)
                $("#cboResponsables").trigger("chosen:updated")
            }

            const jefe_ddp = ovariables.ListaJefeEquipos.filter(x => x.IdPersonal === utilindex.idpersonal);
            if (npersonal !== '' && jefe_ddp.length === 0) {
                $('#cboResponsables').prop('disabled', true).trigger("chosen:updated");
            }
        }
      
        const event_rows = (e) => {

            let o = e.currentTarget, row = o, tbl = document.getElementById('tblrequerimiento'), rows = tbl.rows;
            fn_clean_rows(rows);
            row.classList.add('row-selected');
            let par = row.getAttribute('data-par')
            ovariables.codWTS = parseInt(_getPar(par, 'idequipo'));
        }
        const fn_clean_rows = (rows) => {
            let array = Array.from(rows);
            array.some(x => { if (x.classList.contains('row-selected')) { x.classList.remove('row-selected'); return true; } });
        }

        function load() {
            // Ibox tools
            _initializeIboxTools();
            _inicioComboResponsables();
       
            // Events
            _("btnBuscar").addEventListener("click", GetListaFiltroRequerimientoDespachoDDP_JSON);
            _("btnBuscarexportar").addEventListener("click", GetListaFiltroRequerimientoDespachoDDP_JSON_Exportar);
            _("cboEquipos").addEventListener("change", GetListaClientesDDP_ListaResponsables);
            _("cboTiposProveedor").addEventListener("change", GetListaProveedorByTipoProveedorCSV);
           

            $('#txt_fecha_inicial').datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            }).datepicker("setDate", new Date())
                .next().on('click', function (e) { $(this).prev().focus(); })

            $('#txt_fecha_fin').datepicker({
                autoclose: true,
                clearBtn: true,
                todayHighlight: true
            });
        //    .datepicker("setDate", new Date())
        //.next().on('click', function (e) { $(this).prev().focus(); })
           
            //$('#div_fecha_fin .input-group.date').datepicker({
            //    autoclose: true,
            //    clearBtn: true,
            //    todayHighlight: true
            //})
         
            // Functions
            fn_formattable();
        }
        function req_ini() {
            _("div_tbl_requerimientos").innerHTML = '<div class="loading-icon"></div>';
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('Requerimiento/RequerimientoMuestra/GetLoadIndexRequerimientoDespachoDDP_JSON')
                .then((resultado) => {
                    let rpta = (resultado !== '') ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        _promise()
                            .then(fn_inicializarcombos(rpta))
                            .then(GetListaClientesDDP_ListaResponsables())
                            .then(GetCombosFiltroDespachoByIdsClientes_JSON("0"))

                        _creartabla('');
                    }
                }, (p) => { err(p); });
        }

        function fn_inicializarcombos(rpta) {

            ovariables.ListaEstadosActividad = rpta.ListaEstadosActividadCSV !== '' ? CSVtoJSON(rpta.ListaEstadosActividadCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaEstadosRequerimiento = rpta.ListaEstadosEstiloCSV !== '' ? CSVtoJSON(rpta.ListaEstadosEstiloCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaClientes = rpta.ListaClientesCSV !== '' ? CSVtoJSON(rpta.ListaClientesCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaJefeEquipos = rpta.ListaJefeEquiposCSV !== '' ? CSVtoJSON(rpta.ListaJefeEquiposCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaJefeEquipos = rpta.ListaJefeEquiposCSV !== '' ? CSVtoJSON(rpta.ListaJefeEquiposCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaTipoProveedor = rpta.ListaTipoProveedorCSV !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
            ovariables.ListaActividadAll = rpta.ListaActividadAllCSV !== '' ? CSVtoJSON(rpta.ListaActividadAllCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];

            _('cboEstadosActividad').innerHTML = '';
            _('cboEstadosRequerimiento').innerHTML = '';
            _('cboClientes').innerHTML = '';
            _('cboEquipos').innerHTML = '';
            _('cboTiposProveedor').innerHTML = '';
            

            // Crea options para EstadoActividad
            _('cboEstadosActividad').innerHTML = Set_OptionsEstadosActividad();
            // Crea options para EstadoEstilo
            _('cboEstadosRequerimiento').innerHTML = Set_OptionsEstadosRequerimiento();
            // Crea options para Clientes
            _('cboClientes').innerHTML = Set_OptionsClientes();
            _inicioComboClientes();

            // Crea options para Equipos
            let arrEquipos = Set_OptionsEquipos();
            let cboEquipos = _('cboEquipos');
            cboEquipos.innerHTML = arrEquipos.join('');
            // Crea options para Proveedor
            _('cboTiposProveedor').innerHTML = Set_OptionsTipoProveedor();
            _dispatchEvent("cboTiposProveedor", "change");
            // Crea options para Actividades
            _('cboActividades').innerHTML = Set_OptionsTipoActividades();

            cboEquipos.value = selectEquipoByCondicion(arrEquipos, window.utilindex.idpersonal, cboEquipos.options[0].value);

            // Se bloquea en caso no sea jefe de equipo
            if (ovariables.ListaJefeEquipos.length > 0) {
                const jefe_ddp = ovariables.ListaJefeEquipos.filter(x => x.IdPersonal === utilindex.idpersonal);
                if (jefe_ddp.length > 0) {
                    _('cboEquipos').removeAttribute("disabled");
                } else {
                    const idjefe = ovariables.ListaJefeEquipos.filter(x => x.IdPersonal !== "0")[0].IdPersonal;
                    _('cboEquipos').value = idjefe;
                    _('cboEquipos').setAttribute("disabled", "disabled");
                }
            }
        }

        function selectEquipoByCondicion(arrEquipos,idpersonal,idPersonalDefault) {
            const valor = (arrEquipos.length > 1) 
                ? idpersonal
                : idPersonalDefault;
            return valor;
        }


        function fn_formattable() {
            $('#tblrequerimiento').DataTable({
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
                info: false,
                lengthChange: false,
                pageLength: 15,
                order: [2, 'desc'],
                ordering: true,
                searching: false
            });
            // Move paginate
            $(".dataTables_empty").addClass("text-center").children().remove();
            $("#tblrequerimiento_paginate").appendTo("#tblrequerimiento tfoot tr td");
        }
        function fn_viewdetails(id) {
            _modalBody_Backdrop({
                url: 'Requerimiento/RequerimientoMuestra/_RequerimientoDetalleDDP',
                idmodal: 'DetalleRequerimiento',
                paremeter: `id:${id},accion:edit`,
                title: `Detalle del Requerimiento ID:${id}`,
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        function fn_resetCombosxCliente() {
            ovariables.ListaClienteMarca = [];
            ovariables.ListaClienteDivision = [];
            ovariables.ListaClienteTemporada = [];
            ovariables.ListaTipoMuestraxCliente = [];
            ovariables.ListaEstilosxCliente = [];
            _('cboMarca').innerHTML = Set_OptionsMarcas();
            // Crea options para Cliente Marca
            _('IdClienteDivision').innerHTML = Set_OptionsDivisiones();
            // Crea options para Cliente Marca
            _('IdClienteTemporada').innerHTML = Set_OptionsTemporadas();
            // Crea options para Cliente Marca
            _('IdTipoMuestraxCliente').innerHTML = Set_OptionsTiposMuestraxCliente();
            // Crea options para Cliente Marca
            _('IdEstilo').innerHTML = Set_OptionsoEstilosxCliente();
        }
        //inicio region de metodos LA

        const Set_OptionsEstadosActividad = () => {
            //Crea combo EstadoActividad
            let optionsEstadosActividad = '<option value="0">Todos</option>';
            optionsEstadosActividad += ovariables.ListaEstadosActividad.map(x => {
                return `<option value ='${x.IdCatalogo}'>${x.NombreCatalogo}</option>`;
            }).join('');
            return optionsEstadosActividad;
        }
        const Set_OptionsEstadosRequerimiento = () => {
            //// ACA SE CAMBIO DE ORIGEN DE TABLA BD YA QUE LOS ESTADOS SERAN DEL ESTILO DE LA TABLA REQUERIMIENTO.REQUERIMIENTO
            // Crea combo EstadoActividad
            //let cboEstadosRequerimiento = '<option value="0">Todos</option>';
            //cboEstadosRequerimiento += ovariables.ListaEstadosRequerimiento.map(x => {
            //    return `<option value ='${x.ValorEstado}'>${x.NombreEstado}</option>`;
            //}).join('');

            const filter = ovariables.ListaEstadosRequerimiento.filter(x => x.NombreCatalogo !== 'CREATED');

            let cboEstadosRequerimiento = '<option value="0">Todos</option>';
            cboEstadosRequerimiento += filter.map(x => {
                return `<option value ='${x.IdCatalogo}'>${x.NombreCatalogo}</option>`;
            }).join('');
            
            return cboEstadosRequerimiento;
        }
        const Set_OptionsClientes = () => {
            // Crea combo EstadoActividad
            _("cboClientes").options.length = 0;
            let cboClientes = '<option value="0">Todos</option>';
            cboClientes += ovariables.ListaClientes.map(x => {
                return `<option value ='${x.IdCliente}'>${x.NombreCliente}</option>`;
            }).join('');

            ovariables.ListaClientesTodo = ovariables.ListaClientes.map(x => {
                return x.IdCliente
            }).join(',');

            return cboClientes;
        }
        const Set_OptionsEquipos = () => {
            // Crea combo EstadoActividad
            let arrEquipos = ovariables.ListaJefeEquipos.map(x => {
                return `<option value ='${x.IdPersonal}' data-par='${x.IdJefe}'>${x.NombrePersonal}</option>`;
            });
            return arrEquipos;
        }
        const Set_OptionsTipoProveedor = () => {
            // Crea combo EstadoActividad
            let cboTipoProveedores = '<option value="0">Todos</option>';
            cboTipoProveedores += ovariables.ListaTipoProveedor.map(x => {
                return `<option value ='${x.IdTipoProveedor}'>${x.NombreTipoProveedor}</option>`;
            }).join('');
            return cboTipoProveedores;
        }
        const Set_OptionsProveedores = () => {
            // Crea combo EstadoActividad
            _("cboProveedores").options.length = 0;
            let cboProveedores = '<option value="0">Todos</option>';
            cboProveedores += ovariables.ListaProveedor.map(x => {
                return `<option value ='${x.IdProveedor}'>${x.NombreProveedor}</option>`;
            }).join('');
            return cboProveedores;
        }
        const Set_OptionsTipoActividades = () => {
            // Crea combo EstadoActividad
            let cboTipoActividades = '<option value="0">Todos</option>';
            cboTipoActividades += ovariables.ListaActividadAll.map(x => {
                return `<option value ='${x.IdActividad}'>${x.NombreActividad}</option>`;
            }).join('');
            return cboTipoActividades;
        }

        const Set_OptionsMarcas = () => {
            // Crea combo EstadoActividad
            let optionsMarcas = '<option value="0">Todos</option>';
            optionsMarcas += ovariables.ListaClienteMarca.map(x => {
                return `<option value ='${x.IdClienteMarca}'>${x.NombreMarca}</option>`;
            }).join('');
            return optionsMarcas;
        }
        const Set_OptionsDivisiones = () => {
            // Crea combo EstadoActividad
            let optionsDivisiones = '<option value="0">Todos</option>';
            optionsDivisiones += ovariables.ListaClienteDivision.map(x => {
                return `<option value ='${x.IdClienteDivision}'>${x.NombreDivision}</option>`;
            }).join('');
            return optionsDivisiones;
        }
        const Set_OptionsTemporadas = () => {
            // Crea combo EstadoActividad
            let Set_OptionsTemporadas = '<option value="0">Todos</option>';
            Set_OptionsTemporadas += ovariables.ListaClienteTemporada.map(x => {
                return `<option value ='${x.IdClienteTemporada}'>${x.NombreTemporada}</option>`;
            }).join('');
            return Set_OptionsTemporadas;
        }
        const Set_OptionsTiposMuestraxCliente = () => {
            // Crea combo EstadoActividad
            let Set_OptionsTiposMuestraxCliente = '<option value="0">Todos</option>';
            Set_OptionsTiposMuestraxCliente += ovariables.ListaTipoMuestraxCliente.map(x => {
                return `<option value ='${x.IdTipoMuestraxCliente}'>${x.NombreTipoMuestra}</option>`;
            }).join('');
            return Set_OptionsTiposMuestraxCliente;
        }
        const Set_OptionsoEstilosxCliente = () => {
            // Crea combo EstadoActividad
            let Set_OptionsEstilosxCliente = '<option value="0">Todos</option>';
            Set_OptionsEstilosxCliente += ovariables.ListaEstilosxCliente.map(x => {
                return `<option value ='${x.IdEstilo}'>${x.CodigoEstilo}</option>`;
            }).join('');
            return Set_OptionsEstilosxCliente;
        }
        const Set_OptionsResponsables = () => {
            // Crea combo EstadoActividad
            //_("cboResponsables").options.length = 0;
            let options = ovariables.ListaResponsables.map(x => {
                return `<option value='${x.IdPersonal}'>${x.NombrePersonal}</option>`;
            }).join('');
            return options;
        }

        function fn_get_todos_los_reponsables() {
            return ovariables.ListaResponsables.map(x => x.IdPersonal).join(',');
        }

        function fn_validar_inputs_basicos_para_buscar() {
            let mensaje = '';
            let pasavalidacion = true;
            let cboequipo = _('cboEquipos');
            if (cboequipo.value === '' || cboequipo.value === '0') {
                mensaje = 'Falta seleccionar el equipo...!'
                pasavalidacion = false;
            }
            if (_('cboResponsables').value === '') {
                if (mensaje !== '') {
                    mensaje += '\n - Falta seleccionar el responsable...!'
                } else {
                    mensaje += '- Falta seleccionar el responsable...!'
                }
                
                pasavalidacion = false;
            }
            if (_('cboClientes').value === '') {
                if (mensaje !== '') {
                    mensaje += '\n - Falta seleccionar el cliente...!'
                } else {
                    mensaje += '- Falta seleccionar el cliente...!'
                }

                pasavalidacion = false;
            }

            if (!pasavalidacion) {
                _swal({ mensaje: mensaje, estado: 'error' }, 'Advertencia');
            }

            return pasavalidacion;
        }

        //metodos de carga de controles
        const GetListaFiltroRequerimientoDespachoDDP_JSON = () => {
            let pasavalidacion = fn_validar_inputs_basicos_para_buscar();
            if (!pasavalidacion) {
                return false;
            }

            $('#myModalSpinner').modal('show');
            _("div_tbl_requerimientos").innerHTML = '<div class="loading-icon"></div>';
            let json = _getParameter({ clase: '_enty_buscar', id: 'panelEncabezado_IndexDDP' });
            let err = function (__err) { console.log('err', __err) };
            let strclientes = json.IdsClientes;
            let paramsclientes = strclientes === '0' ? ovariables.ListaClientesTodo : strclientes;
            let strreponsables = json.IdsAnalistasResponsables;
            let lista_cadena_responsables_todos = '';
            if (strreponsables === '0') {
                lista_cadena_responsables_todos = fn_get_todos_los_reponsables();
            } 
            
            let paramsresponsables = strreponsables === '0' ? lista_cadena_responsables_todos : json.IdsAnalistasResponsables;

            let parametro = {
                IdEstadoEstilo_Status: parseInt(json.IdEstadoEstilo_Status, 10),
                IdEstadoActividad_IdCatalogo: parseInt(json.IdEstadoActividad_IdCatalogo, 10),
                IdsClientes: paramsclientes,
                IdClienteMarca: parseInt(json.IdClienteMarca, 10),
                IdClienteDivision: parseInt(json.IdClienteDivision, 10),
                IdClienteTemporada: parseInt(json.IdClienteTemporada, 10),
                IdEstilo: parseInt(json.IdEstilo, 10),
                IdTipoMuestraxCliente: parseInt(json.IdTipoMuestraxCliente, 10),
                IdActividad: parseInt(json.IdActividad, 10),
                IdTipoProveedor: (json.IdTipoProveedor !== null && json.IdTipoProveedor !== '') ? parseInt(json.IdTipoProveedor, 10) : -1,
                IdProveedor: parseInt(json.IdProveedor, 10),
                FechaProgramadaInicio: json.FechaProgramadaInicio,
                FechaProgramadaFin: json.FechaProgramadaFin,
                IdsAnalistasResponsables: paramsresponsables, ////json.IdsAnalistasResponsables,
                exportacionExcel:'no'
            };

            //let parametroExport = parametro;
            //parametroExport.exportacionExcel = 'si';
            //ovariables.listaFiltroExportacion = JSON.stringify(parametroExport);
            ovariables.parametroFiltroExportarExcel = null;
            ovariables.parametroFiltroExportarExcel = parametro;

            _Get('Requerimiento/RequerimientoMuestra/GetListaFiltroRequerimientoDespachoDDP_JSON?RequerimientoJSON=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado;
                    if (rpta !== null && rpta !== '') {
                        ovariables.ListaFiltro = (rpta !== '') ? CSVtoJSON(rpta, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        _creartabla(ovariables.ListaFiltro);
                    }

                    $('#myModalSpinner').modal('hide')
                }, (p) => { err(p); });
        }

        const GetListaFiltroRequerimientoDespachoDDP_JSON_Exportar = () => {

            if (ovariables.parametroFiltroExportarExcel) {
                ovariables.parametroFiltroExportarExcel.exportacionExcel = 'si';
                ovariables.listaFiltroExportacion = JSON.stringify(ovariables.parametroFiltroExportarExcel);
                $('#myModalSpinner').modal('show');          
               
                let urlaccion = '../Requerimiento/RequerimientoMuestra/GetListaFiltroRequerimientoDespachoDDP_JSON_excel?RequerimientoJSON=' + ovariables.listaFiltroExportacion;
                    window.location.href = urlaccion;
                $('#myModalSpinner').modal('hide');
            }
            
        }

        const GetCombosFiltroDespachoByIdsClientes_JSON = (idsClientes) => {

            let json = _getParameter({ clase: '_enty_buscar', id: 'panelEncabezado_IndexDDP' });
            let err = function (__err) { console.log('err', __err) };
            let paramsclientes = idsClientes == '0' || idsClientes == '' || idsClientes === undefined ? ovariables.ListaClientesTodo : idsClientes;
     
            _Get('Requerimiento/RequerimientoMuestra/GetCombosFiltroDespachoByIdsClientes_JSON?IdsClientes=' + paramsclientes)
                .then((resultado) => {
                    let rpta = (resultado !== '') ? JSON.parse(resultado) : [];
                    if (rpta !== null && rpta !== '') {
                        ovariables.ListaClienteMarca = (rpta !== '') ? CSVtoJSON(rpta.ListaClienteMarcaCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        ovariables.ListaClienteDivision = (rpta !== '') ? CSVtoJSON(rpta.ListaClienteDivisionCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        ovariables.ListaClienteTemporada = (rpta !== '') ? CSVtoJSON(rpta.ListaClienteTemporadaCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        ovariables.ListaTipoMuestraxCliente = (rpta !== '') ? CSVtoJSON(rpta.ListaTipoMuestraxClienteCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        ovariables.ListaEstilosxCliente = (rpta !== '') ? CSVtoJSON(rpta.ListaEstilosxClienteCSV, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];

                        // Crea options para Cliente Marca
                        _('cboMarca').innerHTML = Set_OptionsMarcas();
                        // Crea options para Cliente Marca
                        _('IdClienteDivision').innerHTML = Set_OptionsDivisiones();
                        // Crea options para Cliente Marca
                        _('IdClienteTemporada').innerHTML = Set_OptionsTemporadas();
                        // Crea options para Cliente Marca
                        _('IdTipoMuestraxCliente').innerHTML = Set_OptionsTiposMuestraxCliente();
                        // Crea options para Cliente Marca

                        _('IdEstilo').innerHTML = Set_OptionsoEstilosxCliente();
                    }
                }, (p) => { err(p); });
        }
        const GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON = () => {

            fn_resetCombosxCliente();

            let json = _getParameter({ id: 'panelEncabezado_IndexDDP', clase: '_enty_buscar' });
            let err = function (__err) { console.log('err', __err) };
            let parametro = json.cboEquipos;

            _Get('Requerimiento/RequerimientoMuestra/GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON?IdPersonal=' + parametro)
                .then((resultado) => {
                    let rpta = resultado;
                    if (rpta !== null && rpta !== '') {
                        ovariables.ListaClientes = (rpta !== '') ? CSVtoJSON(rpta, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        _("cboClientes").innerHTML = Set_OptionsClientes();
                        _comboClientes();
                    }
                }, (p) => { err(p); });
        }
        const GetCombosFiltroDespachoByIdsClientes_JSON_change = () => {
            const idsCli = $("#cboClientes").val();
            let idsClientes = '';
            if (idsCli !== null && idsCli !== '') {
                idsClientes = idsCli.map(x => {
                    return x;
                }).join(',');
            }

            const params = idsClientes;

            GetCombosFiltroDespachoByIdsClientes_JSON(params);
        }
        const GetListaProveedorByTipoProveedorCSV = () => {

            let json = _getParameter({ clase: '_enty_buscar', id: 'panelEncabezado_IndexDDP' });
            let err = function (__err) { console.log('err', __err) };
            let parametro = parseInt(json.IdTipoProveedor, 10);

            _Get('Maestra/Proveedor/GetListaProveedorByTipoProveedorCSV?IdTipoProveedor=' + parametro)
                .then((resultado) => {
                    let rpta = resultado;
                    if (rpta !== null && rpta !== '') {
                        ovariables.ListaProveedor = (rpta !== '') ? CSVtoJSON(rpta, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        _("cboProveedores").innerHTML = Set_OptionsProveedores();
                    }
                }, (p) => { err(p); });
        }
        const GetListaResponsablesAnalistasDDP_JSON = () => {
            let json = _getParameter({ clase: '_enty_buscar', id: 'panelEncabezado_IndexDDP' });
            let err = function (__err) { console.log('err', __err) };
            let parametro = json.cboEquipos;

            _Get('Requerimiento/RequerimientoMuestra/GetListaResponsablesAnalistasDDP_JSON?IdPersonalJefaDDP_EquipoDDP=' + parametro)
                .then((resultado) => {
                    let rpta = resultado;
                    if (rpta !== null && rpta !== '') {
                        ovariables.ListaResponsables = (rpta !== '') ? CSVtoJSON(rpta, ovariables.odelimitador.col, ovariables.odelimitador.row) : [];
                        _("cboResponsables").innerHTML = Set_OptionsResponsables();
                        _comboResponsables(ovariables.ListaResponsables, 'TODOS');

                        /*Fix for choosen js*/
                        $('.chosen-choices').click(function () {
                            $(this).children().children().eq(0).focus()
                        });
                    }
                }, (p) => { err(p); });
        }
        const GetListaClientesDDP_ListaResponsables = () => {

            GetListaResponsablesAnalistasDDP_JSON();
            GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON();

        }
        //metodo para pintar la tabla
        const _creartabla = (_json) => {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tblrequerimiento" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="no-sort">Cod WTS</th>
                                <th class='text-center'>Fecha Prog.</th>
                                <th class='text-center'>Fecha Real</th>
                                <th class=''>Cliente</th>
                                <th class=''>Marca</th>
                                <th class=''>Temporada</th>
                                <th class=''>Estilo</th>
                                <th class=''>Muestra</th>
                                <th class=''>Actividad</th>
                                <th class='text-center'>Estado Actividad</th>
                                <th class='text-center'>Proveedor</th>
                                <th class='text-center'>Responsable</th>
                            </tr>
                        </thead>
                        <tbody id='tblrequerimiento_tbody'>${(data.length > 0) ?
                    data.map(x => {
                        return `<tr data-par='${x.IdEstilo}'>                           
                                <td class='text-center'>${x.IdEstilo}</td>
                                <td class='text-center'>${x.FechaProgramada}</td>
                                <td class='text-center'>${x.FechaReal}</td>
                                <td class=''>${x.NombreCliente}</td>
                                <td>${x.NombreMarca}</td>
                                <td>${x.NombreTemporada}</td>
                                <td>${x.CodigoEstilo}</td>
                                <td>${x.NombreTipoMuestra}</td>
                                <td>${x.NombreActividad}</td>
                                <td>${x.EstadoActividad_CodCatalogo}</td>
                                <td>${x.NombreProveedor}</td>
                                <td>${x.Responsable}</td>
                                </tr>`;
                    }).join('')
                    : ''
                }</tbody>`;

            html += '</table>';
            _('div_tbl_requerimientos').innerHTML = html;
            $(".loading-icon").addClass("hide");
            if (data.length > 0) {
                [..._('tblrequerimiento_tbody').children].forEach(x => {
                    x.addEventListener('dblclick', function () {
                        let id = $(x).attr("data-par");
                        fn_viewdetails(id);
                    });
                    x.addEventListener('click', event_rows);
                    x.style = "cursor: pointer";
                });
            }

            fn_formattable();
        }

        //fin region metodos LA
        

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_IndexDDP');
(
    function ini() {
        app_IndexDDP.load();
        app_IndexDDP.req_ini();
    }
)();
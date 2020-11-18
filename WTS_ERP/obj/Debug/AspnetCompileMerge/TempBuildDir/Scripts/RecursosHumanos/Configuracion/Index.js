var appConfiguracionIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lstpersonal: [],
            lstpersonalaux: [],
            lstareas: [],
            lstferiados: [],
            lstusuarios: [],
            lstusuariosreportes: [],
            configvacaciones: [],
            configpermisos: [],
            configdescansomedico: [],
            configlicencias: [],
            configcumpleanios: [],
            configusuarios: [],
            configusuariosreportes: [],
            json_guardar: [],
            json_guardar_per: [],
            json_guardar_vaca: [],
            tabla_personal: '',
            tabla_permisos: '',
            tabla_vacaciones: ''
        }

        function load() {
            _initializeIboxTools();

            // Mostrar motivo
            _('txtMotivo').value = 'ASIGNACION MASIVA';
            _('txtMotivoPermiso').value = 'INGRESO MASIVO PERMISO POR TDO';
            _('txtMotivoVacaciones').value = 'INGRESO MASIVO VACACIONES POR TDO';

            // Eventos
            _('btnAddGolden').addEventListener('click', fn_save_golden);
            _('btnSavePermiso').addEventListener('click', fn_save_masivo_permiso);
            _('btnSaveVacaciones').addEventListener('click', fn_save_masivo_vacaciones);
            _('btnSaveConfigVaca').addEventListener('click', fn_save_config_vacaciones);
            _('btnSaveConfigPermi').addEventListener('click', fn_save_config_permisos);
            _('btnSaveConfigDescMed').addEventListener('click', fn_save_config_descansomedico);
            _('btnSaveConfigLice').addEventListener('click', fn_save_config_licencias);
            _('btnSaveConfigCumple').addEventListener('click', fn_save_config_cumpleanios);
            _('cboTipo').addEventListener('change', fn_cambiarmotivo);
            _('btnAddFeriado').addEventListener('click', fn_save_holiday);
            _('btnSaveModalUsuario').addEventListener('click', fn_new_user);
            _('btnSaveModalUsuarioReportes').addEventListener('click', fn_new_userreport);

            // Para select2
            _('btnSelectAll').addEventListener('click', fn_select2_checkall);
            _('btnRemoveAll').addEventListener('click', fn_select2_removeall);

            // Validar solo numeros enteros regex
            $('input.allow-int').on('input', function () {
                //this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                this.value = this.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
            });

            // Inicia Datepicker
            _initializeDatepicker();

            // Limpia modal Feriado
            $('#modal_feriado').on('hidden.bs.modal', function () {
                _('txtDescripcionModal').value = '';
                _('txtFechaModal').value = '';
                ovariables.id = 0;
            });

            $('#txtFechaVacaciones').datepicker({
                autoclose: false,
                //clearBtn: true,
                todayHighlight: true,
                language: "es",
                daysOfWeekDisabled: [0],
                weekStart: 1,
                multidate: true
            }).next().on('click', function (e) {
                $(this).prev().focus();
            });

        }

        function fn_select2_checkall() {
            $("#cboArea > option").prop("selected", "selected");
            $("#cboArea").select2({ width: '100%' });
        }

        function fn_select2_removeall() {
            $("#cboArea > option").removeAttr("selected");
            $("#cboArea").select2({ width: '100%' });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            _Get('RecursosHumanos/Configuracion/GetAllData_Configuracion')
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        ovariables.lstpersonal = rpta[0].lstpersonal !== '' ? JSON.parse(rpta[0].lstpersonal) : [];
                        ovariables.lstareas = rpta[0].lstareas !== '' ? JSON.parse(rpta[0].lstareas) : [];
                        ovariables.lstferiados = rpta[0].lstferiados !== '' ? JSON.parse(rpta[0].lstferiados) : [];
                        ovariables.configvacaciones = rpta[0].configvacaciones !== '' ? JSON.parse(rpta[0].configvacaciones) : [];
                        ovariables.configpermisos = rpta[0].configpermisos !== '' ? JSON.parse(rpta[0].configpermisos) : [];
                        ovariables.configdescansomedico = rpta[0].configdescansomedico !== '' ? JSON.parse(rpta[0].configdescansomedico) : [];
                        ovariables.configlicencias = rpta[0].configlicencias !== '' ? JSON.parse(rpta[0].configlicencias) : [];
                        ovariables.configcumpleanios = rpta[0].configcumpleanios !== '' ? JSON.parse(rpta[0].configcumpleanios) : [];
                        ovariables.configusuarios = rpta[0].configusuarios !== '' ? JSON.parse(rpta[0].configusuarios) : [];
                        ovariables.lstusuarios = rpta[0].lstusuarios !== '' ? JSON.parse(rpta[0].lstusuarios) : [];
                        ovariables.configusuariosreportes = rpta[0].configusuariosreportes !== '' ? JSON.parse(rpta[0].configusuariosreportes) : [];
                        ovariables.lstusuariosreportes = rpta[0].lstusuariosreportes !== '' ? JSON.parse(rpta[0].lstusuariosreportes) : [];
                        // Cargar Configuracion Vacaciones
                        fn_configvacaciones(ovariables.configvacaciones);

                        //Cargar configuracion Permisos
                        fn_configpermisos(ovariables.configpermisos);

                        //Cargar configuracion Descanso Médico
                        fn_configdescansomedico(ovariables.configdescansomedico);

                        //Cargar configuracion Licencias
                        fn_configlicencias(ovariables.configlicencias);

                        //Cargar configuracion Licencias
                        fn_configcumpleanios(ovariables.configcumpleanios);

                        // Combo Areas
                        let cboarea = '';//'<option value="">Todas</option>';
                        ovariables.lstareas.forEach(x => {
                            cboarea += `<option value ='${x.nombrearea}'>${x.nombrearea}</option>`;
                        });
                        _('cboArea').innerHTML = cboarea;
                        _('cboArea2').innerHTML = `<option value="">TODOS</option>${cboarea}`;
                        _('cboArea3').innerHTML = `<option value="">TODOS</option>${cboarea}`;
                        $("#cboArea, #cboArea2, #cboArea3").select2({ width: '100%' });

                        // Combo Usuario
                        let cboUsuario = `<option value=''>--</option>`;
                        ovariables.lstpersonal.forEach(x => {
                            let json = ovariables.configusuarios.filter(y => _parseInt(y.idusuario) === x.idusuario).length;
                            if (json > 0) {
                                cboUsuario += `<option value='${x.idusuario}' disabled>${x.nombrepersonal}</option>`;
                            } else {
                                cboUsuario += `<option value='${x.idusuario}'>${x.nombrepersonal}</option>`;
                            }
                        });
                        _('cboUsuarioModal').innerHTML = cboUsuario;
                        $("#cboUsuarioModal").select2({ width: '100%' });

                        // Combo Usuario
                        let cboUsuarioReportes = `<option value=''>--</option>`;
                        ovariables.lstpersonal.forEach(x => {
                            let json = ovariables.configusuariosreportes.filter(y => _parseInt(y.idusuario) === x.idusuario).length;
                            if (json > 0) {
                                cboUsuarioReportes += `<option value='${x.idusuario}' disabled>${x.nombrepersonal}</option>`;
                            } else {
                                cboUsuarioReportes += `<option value='${x.idusuario}'>${x.nombrepersonal}</option>`;
                            }
                        });

                        _('cboUsuarioModalReportes').innerHTML = cboUsuarioReportes;                       
                        $("#cboUsuarioModalReportes").select2({ width: '100%' });

                        // Se crea tabla
                        fn_creartablapersonal(ovariables.lstpersonal);
                        fn_creartablapermisos(ovariables.lstpersonal);
                        fn_creartablavacaciones(ovariables.lstpersonal);
                        fn_creartablaferiado(ovariables.lstferiados);
                        fn_creartablausuario(ovariables.lstusuarios);
                        fn_creartablausuarioreportes(ovariables.lstusuariosreportes);
                    }
                }, (p) => { err(p); });
        }

        function fn_cambiarmotivo(e) {
            if (e.target.value === 'ASIGNAR') {
                _('txtMotivo').value = 'ASIGNACION MASIVA';
            } else {
                _('txtMotivo').value = 'QUITAR POR ERROR';
            }
        }

        function fn_creartablausuario(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_usuario" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th style="width: 100px;"></th>
                                <th>Usuario</th>
                                <th>Nombre Personal</th>
                                <th>Cargo</th>
                                <th>Area/SubArea</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-danger" onclick="appConfiguracionIndex.fn_remove_usuario(${x.idusuario})">
                                            <span class="fa fa-trash"></span>
                                        </button>
                                    </td>
                                    <td>${x.usuario}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.cargo}</td>
                                    <td>${x.nombrearea}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="5"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_usuario').innerHTML = html;

            fn_formattableusuario();
        }

        function fn_creartablausuarioreportes(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_usuario_reportes" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th style="width: 100px;"></th>
                                <th>Usuario</th>
                                <th>Nombre Personal</th>
                                <th>Cargo</th>
                                <th>Area/SubArea</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-danger" onclick="appConfiguracionIndex.fn_remove_usuario_reportes(${x.idusuario})">
                                            <span class="fa fa-trash"></span>
                                        </button>
                                    </td>
                                    <td>${x.usuario}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.cargo}</td>
                                    <td>${x.nombrearea}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="5"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_usuario_reportes').innerHTML = html;

            fn_formattableusuarioreportes();
        }

        function fn_formattableusuario() {
            var table = $('#tbl_usuario').DataTable({
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
                //order: [1, 'asc'],
                ordering: false
            });

            // Move paginate
            $("#tbl_usuario tfoot tr td").children().remove();
            $("#tbl_usuario_paginate").appendTo("#tbl_usuario tfoot tr td");

            // Custom Search
            $('#txtBuscarUsuario').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_usuario_filter').hide();
        }

        function fn_formattableusuarioreportes() {
            var table = $('#tbl_usuario_reportes').DataTable({
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
                //order: [1, 'asc'],
                ordering: false
            });

            // Move paginate
            $("#tbl_usuario_reportes tfoot tr td").children().remove();
            $("#tbl_usuario_reportes_paginate").appendTo("#tbl_usuario_reportes tfoot tr td");

            // Custom Search
            $('#txtBuscarUsuarioReportes').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_usuario_reportes_filter').hide();
        }

        function fn_configvacaciones(_json) {
            if (_json != '') {
                _('txtplazominimolaborado').value = _json.plazo_minimo;
                _('txtdiasvacacionesanio').value = _json.vacaciones_por_anio;
                _('txtdiasxmes').value = _json.dias_por_mes;
                _('txtdiasxanio').value = _json.dias_por_anio;
                _('txtusominimo').value = _json.uso_minimo;

                _('txtcondicionminimo').value = _json.condicion_dias_minimo;
                //_('txtcondicionminimo').nextElementSibling.innerHTML = `Si previamente han gozado de los primeros (${_json.condicion_dias_minimo}) día(s) de vacaciones`;

                //_('txtcondicionminimo1a2dias').value = _json.condicion_dias_minimo;
                //_('txtcondicionminimo1a2dias').nextElementSibling.innerHTML = `Si previamente han gozado de los primeros (${_json.condicion_dias_minimo}) día(s) de vacaciones`;                

                _('txtplazominimo').value = _json.plazo_minimo_especial;
                //_('txtplazominimo').nextElementSibling.innerHTML = `Si el colaborador solicita (${_json.uso_minimo}) día(s) de vacaciones`;

                _('txtplazonormal').value = _json.plazo_minimo_normal;
                //_('txtplazonormal').nextElementSibling.innerHTML = `Si el colaborador solicita mas de (${_parseInt(_json.uso_minimo) + 1}) día(s) de vacaciones`;

                _('txtnotificacion').value = _json.notificacion;

                // Formula
                _('txtformula').value = `Dias Laborados * ${_json.vacaciones_por_anio} / ${_json.dias_por_anio}`;
            }
        }

        function fn_configpermisos(_json) {
            if (_json != '') {
                _('txthoraminimopermiso').value = _json.hora_minimo;
                _('txthoramaximopermiso').value = _json.hora_maximo;               
            }
        }

        function fn_configdescansomedico(_json) {
            if (_json != '') {
                _('txtdiassubsidio').value = _json.dias_minimo;               
            }
        }

        function fn_configlicencias(_json) {
            if (_json != '') {
                _('txtpaternidad').value = _json.paternidad;
                _('txtmaternidad').value = _json.maternidad;
                _('txtmaternidadespecial').value = _json.maternidad_especial;
                _('txtfallecimientolima').value = _json.fallecimiento_lima;
                _('txtfallecimientoprovincia').value = _json.fallecimiento_provincia;
                _('txtestadograve').value = _json.estadograve;
            }
        }

        function fn_configcumpleanios(_json) {
            if (_json != '') {
                _('txtdiasminimo').value = _json.dias_minimo;
                _('txtdiasmaximo').value = _json.dias_maximo;               
            }
        }

        function fn_creartablaferiado(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_feriado" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th style="width: 100px;"></th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Año</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-sm btn-info" onclick="appConfiguracionIndex.fn_edit_holiday(${x.idferiado})">
                                            <span class="fa fa-edit"></span>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-danger" onclick="appConfiguracionIndex.fn_remove_holiday(${x.idferiado})">
                                            <span class="fa fa-trash"></span>
                                        </button>
                                    </td>
                                    <td>${x.descripcion}</td>
                                    <td>${x.fecha}</td>
                                    <td>${x.anio}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="4"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_feriado').innerHTML = html;

            fn_formattableferiado();
        }

        function fn_formattableferiado() {
            var table = $('#tbl_feriado').DataTable({
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
                //order: [1, 'asc'],
                ordering: false
            });

            // Move paginate
            $("#tbl_feriado tfoot tr td").children().remove();
            $("#tbl_feriado_paginate").appendTo("#tbl_feriado tfoot tr td");

            // Custom Search
            $('#txtBuscarFeriado').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_feriado_filter').hide();
        }

        function fn_creartablapermisos(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_permisos" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="text-center">
                                    <input class="i-check-permisos" type="checkbox" data-id="todos" name="check_personal">
                                </th>
                                <th>Personal</th>
                                <th>Area/SubArea</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <input class="i-check-permisos" type="checkbox" data-id="${x.idpersonal}" name="check_personal">
                                    </td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.nombrearea}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="3"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_permisos').innerHTML = html;

            fn_formattablepermisos();
        }

        function fn_formattablepermisos() {
            var table = $('#tbl_permisos').DataTable({
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
                "drawCallback": function () {
                    // Para duplicar
                    fn_iCheckPermisos();
                },
                info: false,
                lengthChange: false,
                pageLength: 15,
                //order: [1, 'asc'],
                ordering: false
            });

            // Save ovariables
            ovariables.tabla_permisos = table;

            // Move paginate
            $("#tbl_permisos tfoot tr td").children().remove();
            $("#tbl_permisos_paginate").appendTo("#tbl_permisos tfoot tr td");

            // Custom Search
            $('#txtBuscar2').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Filter change
            $('#cboArea2').on('change', function () {
                table.column(2).search($(this).val()).draw();
            });

            // Hide table general search
            $('#tbl_permisos_filter').hide();
        }

        function fn_iCheckPermisos() {
            $('.i-check-permisos').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let iddata = $(this).data('id');
                if (iddata === 'todos') {
                    if ($(this).prop("checked") == true) {
                        $('.i-check-permisos').prop('checked', true);
                        $('input', ovariables.tabla_permisos.cells({ filter: 'applied' }).nodes()).prop('checked', true);
                        $('.i-check-permisos').iCheck('update');
                        ovariables.json_guardar_per = ovariables.lstpersonal.map(x => {
                            return { idpersonal: x.idpersonal };
                        });
                    } else {
                        $('.i-check-permisos').prop('checked', false);
                        $('input', ovariables.tabla_permisos.cells().nodes()).prop('checked', false);
                        $('.i-check-permisos').iCheck('update');
                        ovariables.json_guardar_per = [];
                    }
                } else {
                    let bool = ovariables.json_guardar_per.filter(x => x.idpersonal === $(this).data('id')).length;
                    if (bool === 0) {
                        let json = ovariables.lstpersonal.filter(x => x.idpersonal === $(this).data('id'))[0];
                        ovariables.json_guardar_per.push({ idpersonal: json.idpersonal });
                    } else {
                        let filter = ovariables.json_guardar_per.filter(x => x.idpersonal !== $(this).data('id'));
                        ovariables.json_guardar_per = filter;
                    }
                }
            });
        }

        function fn_creartablavacaciones(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_vacaciones" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="text-center">
                                    <input class="i-check-vacaciones" type="checkbox" data-id="todos" name="check_personal">
                                </th>
                                <th>Personal</th>
                                <th>Area/SubArea</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <input class="i-check-vacaciones" type="checkbox" data-id="${x.idpersonal}" name="check_personal">
                                    </td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.nombrearea}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="3"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_vacaciones').innerHTML = html;

            fn_formattablevacaciones();
        }

        function fn_formattablevacaciones() {
            var table = $('#tbl_vacaciones').DataTable({
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
                "drawCallback": function () {
                    // Para duplicar
                    fn_iCheckVacaciones();
                },
                info: false,
                lengthChange: false,
                pageLength: 15,
                //order: [1, 'asc'],
                ordering: false
            });

            // Save ovariables
            ovariables.tabla_vacaciones = table;

            // Move paginate
            $("#tbl_vacaciones tfoot tr td").children().remove();
            $("#tbl_vacaciones_paginate").appendTo("#tbl_vacaciones tfoot tr td");

            // Custom Search
            $('#txtBuscar3').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Filter change
            $('#cboArea3').on('change', function () {
                table.column(2).search($(this).val()).draw();
            });

            // Hide table general search
            $('#tbl_vacaciones_filter').hide();
        }

        function fn_iCheckVacaciones() {
            $('.i-check-vacaciones').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let iddata = $(this).data('id');
                if (iddata === 'todos') {
                    if ($(this).prop("checked") == true) {
                        $('.i-check-vacaciones').prop('checked', true);
                        $('input', ovariables.tabla_vacaciones.cells({ filter: 'applied' }).nodes()).prop('checked', true);
                        $('.i-check-vacaciones').iCheck('update');
                        ovariables.json_guardar_vaca = ovariables.lstpersonal.map(x => {
                            return { idpersonal: x.idpersonal };
                        });
                    } else {
                        $('.i-check-vacaciones').prop('checked', false);
                        $('input', ovariables.tabla_vacaciones.cells().nodes()).prop('checked', false);
                        $('.i-check-vacaciones').iCheck('update');
                        ovariables.json_guardar_vaca = [];
                    }
                } else {
                    let bool = ovariables.json_guardar_vaca.filter(x => x.idpersonal === $(this).data('id')).length;
                    if (bool === 0) {
                        let json = ovariables.lstpersonal.filter(x => x.idpersonal === $(this).data('id'))[0];
                        ovariables.json_guardar_vaca.push({ idpersonal: json.idpersonal });
                    } else {
                        let filter = ovariables.json_guardar_vaca.filter(x => x.idpersonal !== $(this).data('id'));
                        ovariables.json_guardar_vaca = filter;
                    }
                }
            });
        }

        function fn_creartablapersonal(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_area" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="text-center">
                                    <input class="i-check" type="checkbox" data-id="todos" name="check_personal">
                                </th>
                                <th>Personal</th>
                                <th>Cantidad</th>
                                <th>Area/SubArea</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <input class="i-check" type="checkbox" data-id="${x.idpersonal}" name="check_personal">
                                    </td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.cantidad}</td>
                                    <td>${x.nombrearea}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="4"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_area').innerHTML = html;

            fn_formattablepersonal();
        }

        function fn_formattablepersonal() {
            var table = $('#tbl_area').DataTable({
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
                "drawCallback": function () {
                    // Para duplicar
                    fn_iCheck();
                },
                info: false,
                lengthChange: false,
                pageLength: 15,
                //order: [1, 'asc'],
                ordering: false
            });

            // Save ovariables
            ovariables.tabla_personal = table;

            // Move paginate
            $("#tbl_area tfoot tr td").children().remove();
            $("#tbl_area_paginate").appendTo("#tbl_area tfoot tr td");

            // Custom Search
            $('#txtBuscar').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_area_filter').hide();

            // Filter change
            $('#cboArea').on('change', function () {
                // Se agrega join para multiple option
                let option = $(this).val() != null ? $(this).val().join('|') : '';
                //table.column(3).search(option).draw();
                table.column(3).search(option, true, false).draw();
            });

            $('#cboArea').on('select2:unselecting', function (e) {
                if ($(".i-check[data-id='todos']").prop("checked")) {
                    //if ($('#cboArea').val().length > 1) {
                    //    let data = e.params.args.data.text;
                    //    console.log(data);
                    //    let filter = ovariables.json_guardar.filter(x => x.nombrearea !== data);
                    //    ovariables.json_guardar = filter;
                    //}
                    $(".i-check[data-id='todos']").prop("checked", false);
                    $('input', ovariables.tabla_personal.cells().nodes()).prop('checked', false);
                    ovariables.json_guardar = [];
                    //$('input', ovariables.tabla_personal.cells({ filter: 'applied' }).nodes()).prop('checked', true);
                }
            });

            $('#cboArea').on('select2:selecting', function (e) {
                if ($(".i-check[data-id='todos']").prop("checked")) {
                    //if ($('#cboArea').val().length > 1) {
                    //    let data = e.params.args.data.text;
                    //    console.log(data);
                    //    let filter = ovariables.json_guardar.filter(x => x.nombrearea !== data);
                    //    ovariables.json_guardar = filter;
                    //}
                    $(".i-check[data-id='todos']").prop("checked", false);
                    $('input', ovariables.tabla_personal.cells().nodes()).prop('checked', false);
                    ovariables.json_guardar = [];
                    //$('input', ovariables.tabla_personal.cells({ filter: 'applied' }).nodes()).prop('checked', true);
                }
            });
        }

        function fn_select2_obtenerdata() {
            let _jsonfiltrado = [];
            if ($(".i-check[data-id='todos']").prop("checked")) {
                let array = $('#cboArea').val() != null ? $('#cboArea').val() : [];
                if (array.length > 0) {
                    for (let i = 0; i < array.length; i++) {
                        let _json = ovariables.lstpersonal.filter(x => x.nombrearea === array[i]);
                        _jsonfiltrado = _jsonfiltrado.concat(_json);
                    }
                } else {
                    _jsonfiltrado = ovariables.lstpersonal;
                }
            }
            return _jsonfiltrado;
        }

        function fn_iCheck() {
            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                let iddata = $(this).data('id');
                if (iddata === 'todos') {
                    if ($(this).prop("checked") == true) {
                        $('.i-check').prop('checked', true);
                        $('input', ovariables.tabla_personal.cells({ filter: 'applied' }).nodes()).prop('checked', true);
                        $('.i-check').iCheck('update');

                        ovariables.json_guardar = fn_select2_obtenerdata();
                    } else {
                        $('.i-check').prop('checked', false);
                        $('input', ovariables.tabla_personal.cells().nodes()).prop('checked', false);
                        $('.i-check').iCheck('update');
                        ovariables.json_guardar = [];
                    }
                } else {
                    let bool = ovariables.json_guardar.filter(x => x.idpersonal === $(this).data('id')).length;
                    if (bool === 0) {
                        let json = ovariables.lstpersonal.filter(x => x.idpersonal === $(this).data('id'))[0];
                        ovariables.json_guardar.push(json);
                    } else {
                        let filter = ovariables.json_guardar.filter(x => x.idpersonal !== $(this).data('id'));
                        ovariables.json_guardar = filter;
                    }
                }
            });
        }

        function fn_new_user() {
            if (_isnotEmpty(_('cboUsuarioModal').value)) {
                // Actualiza arreglo
                let _json = {};
                _json['idusuario'] = _('cboUsuarioModal').value;
                ovariables.configusuarios.push(_json);

                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para visualización?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: JSON.stringify(ovariables.configusuarios),
                            codigo: 'USUARIOS'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                $('#modal_usuario').modal('hide');
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar un usuario", type: "warning" });
            }
        }

        function fn_new_userreport() {
            if (_isnotEmpty(_('cboUsuarioModalReportes').value)) {
                // Actualiza arreglo
                let _json = {};
                _json['idusuario'] = _('cboUsuarioModalReportes').value;
                ovariables.configusuariosreportes.push(_json);

                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para visualización de Reportes?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: JSON.stringify(ovariables.configusuariosreportes),
                            codigo: 'REPORTES'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                $('#modal_usuario_reportes').modal('hide');
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Advertencia", text: "Debes seleccionar un usuario", type: "warning" });
            }
        }

        function fn_remove_usuario(id) {
            // Se reemplaza con valir eliminado
            ovariables.configusuarios = ovariables.configusuarios.filter(x => _parseInt(x.idusuario) != id);

            swal({
                html: true,
                title: "Eliminar Usuario",
                text: "¿Estas seguro/a que deseas eliminar el usuario?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        jsoninfo: JSON.stringify(ovariables.configusuarios),
                        codigo: 'USUARIOS'
                    },
                    frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_usuario').modal('hide');
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino correctamente", type: "success" });
                            req_ini();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_remove_usuario_reportes(id) {
            // Se reemplaza con valir eliminado
            ovariables.configusuariosreportes = ovariables.configusuariosreportes.filter(x => _parseInt(x.idusuario) != id);

            swal({
                html: true,
                title: "Eliminar Usuario",
                text: "¿Estas seguro/a que deseas eliminar el usuario de reportes?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        jsoninfo: JSON.stringify(ovariables.configusuariosreportes),
                        codigo: 'REPORTES'
                    },
                    frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            $('#modal_usuario_reportes').modal('hide');
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino correctamente", type: "success" });
                            req_ini();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_save_config_vacaciones() {
            let req_enty = _required({ clase: '_enty_vacaciones', id: 'panelEncabezado_ConfiguracionIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para vacaciones?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: _getParameter({ clase: '_enty_vacaciones', id: 'panelEncabezado_ConfiguracionIndex' }),
                            codigo: 'VACACIONES'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_save_config_permisos() {
            let req_enty = _required({ clase: '_enty_permisos', id: 'panelEncabezado_ConfiguracionIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para permisos?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: _getParameter({ clase: '_enty_permisos', id: 'panelEncabezado_ConfiguracionIndex' }),
                            codigo: 'PERMISOS'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_save_config_descansomedico() {
            let req_enty = _required({ clase: '_enty_descansomedico', id: 'panelEncabezado_ConfiguracionIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para descanso médico?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: _getParameter({ clase: '_enty_descansomedico', id: 'panelEncabezado_ConfiguracionIndex' }),
                            codigo: 'DESCANSOMEDICO'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_save_config_licencias() {
            let req_enty = _required({ clase: '_enty_licencias', id: 'panelEncabezado_ConfiguracionIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para licencias?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: _getParameter({ clase: '_enty_licencias', id: 'panelEncabezado_ConfiguracionIndex' }),
                            codigo: 'LICENCIAS'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_save_config_cumpleanios() {
            let req_enty = _required({ clase: '_enty_cumpleanios', id: 'panelEncabezado_ConfiguracionIndex' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Guardar Configuracion",
                    text: "¿Estas seguro/a que deseas guardar la configuracion para cumpleaños?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            jsoninfo: _getParameter({ clase: '_enty_cumpleanios', id: 'panelEncabezado_ConfiguracionIndex' }),
                            codigo: 'CUMPLEANIOS'
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('RecursosHumanos/Configuracion/SaveData_Configuracion', frm)
                        .then((resultado) => {
                            if (resultado !== null) {
                                swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                req_ini();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_swal_msg() {
            let json = {};
            if (_('cboTipo').value === 'ASIGNAR') {
                json.title = 'Asignar Golden Tickets';
                json.text = `¿Estas seguro/a que deseas asignar ${_('txtCantidadGolden').value} golden tickets a los usuario(s) seleccionados?`;
                json.cantidad = _('txtCantidadGolden').value;
            } else {
                json.title = 'Quitar Golden Tickets';
                json.text = `¿Estas seguro/a que deseas quitar ${_('txtCantidadGolden').value} golden tickets a los usuario(s) seleccionados? 
                            <br /> <span style='font-weight: 400; font-size: 14px;'>En caso la cantidad ingresada exceda la del usuario esta pasará a ser cero</span>`;
                json.cantidad = _('txtCantidadGolden').value;
            }
            return json;
        }

        function fn_calcular_golden() {
            let _jsonfiltrado = ovariables.json_guardar.map(x => {
                let obj = {};
                obj["idpersonal"] = x.idpersonal;
                obj["cantidad"] = x.cantidad;
                return obj;
            });

            let calculo = _jsonfiltrado.map(x => {
                let obj = {};
                obj["idpersonal"] = x.idpersonal;
                if (_('cboTipo').value === 'ASIGNAR') {
                    let cantidad = (x.cantidad + parseInt(_('txtCantidadGolden').value));
                    obj["cantidad"] = cantidad < 0 ? 0 : cantidad;
                } else {
                    let cantidad = (x.cantidad - parseInt(_('txtCantidadGolden').value));
                    obj["cantidad"] = cantidad < 0 ? 0 : cantidad;
                }
                return obj;
            });

            return calculo;
        }

        function fn_save_golden() {
            let mensaje = fn_swal_msg();
            if (mensaje.cantidad !== '') {
                if (mensaje.cantidad > 0) {
                    if (ovariables.json_guardar.length > 0) {
                        swal({
                            html: true,
                            title: mensaje.title,
                            text: mensaje.text,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false
                        }, function () {
                            let err = function (__err) { console.log('err', __err) },
                                parametro = {
                                    jsonpersonal: fn_calcular_golden(),
                                    motivo: _('txtMotivo').value,
                                    tipo: _('cboTipo').value,
                                    cantidad: _('txtCantidadGolden').value
                                }, frm = new FormData();
                            frm.append('par', JSON.stringify(parametro));
                            _Post('RecursosHumanos/Configuracion/SaveData_GoldenTicketAsignar', frm)
                                .then((resultado) => {
                                    if (resultado !== null) {
                                        swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                        _('txtCantidadGolden').value = '';
                                        req_ini();
                                        ovariables.json_guardar = [];
                                        _('txtBuscar').value = '';
                                    } else {
                                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                    }
                                }, (p) => { err(p); });
                        });
                    } else {
                        swal({ title: "Advertencia", text: "Debes seleccionar por lo menos 1 colaborador", type: "warning" });
                    }
                } else {
                    swal({ title: "Advertencia", text: "La cantidad debe ser mayor a 0", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "Tienes que ingresar la cantidad", type: "warning" });
            }
        }

        function fn_save_masivo_permiso() {
            if (_isnotEmpty(_('txtFechaPermiso').value)) {
                if (ovariables.json_guardar_per.length > 0) {
                    swal({
                        html: true,
                        title: "Asignar Permisos",
                        text: "¿Estas seguro/a que deseas asignar la fecha a los usuario(s) seleccionados?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        const json = ovariables.json_guardar_per.map(x => {
                            return { idpersonal: x.idpersonal, fechainicio: _('txtFechaPermiso').value + ' ' + _('txtHoraInicio').value, fechafin: _('txtFechaPermiso').value + ' ' + _('txtHoraFin').value }
                        });
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                jsonpersonal: json,
                                otros: _('txtMotivoPermiso').value
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('RecursosHumanos/Configuracion/SaveData_PermisosAsignar', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                    _('txtFechaPermiso').value = '';
                                    ovariables.json_guardar_per = [];
                                    _('txtBuscar2').value = '';
                                    req_ini();
                                } else {
                                    swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Advertencia", text: "Debes seleccionar por lo menos 1 colaborador", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "Tienes que ingresar una fecha", type: "warning" });
            }
        }

        function fn_save_masivo_vacaciones() {
            if (_isnotEmpty(_('txtFechaVacaciones').value)) {
                if (ovariables.json_guardar_vaca.length > 0) {
                    swal({
                        html: true,
                        title: "Asignar Vacaciones",
                        text: "¿Estas seguro/a que deseas asignar la fecha a los usuario(s) seleccionados?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        const json = ovariables.json_guardar_vaca.map(x => {
                            return { idpersonal: x.idpersonal, fecha: _('txtFechaVacaciones').value }
                        });
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                jsonpersonal: json,
                                otros: _('txtMotivoVacaciones').value
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('RecursosHumanos/Configuracion/SaveData_VacacionesAsignar', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                    _('txtFechaVacaciones').value = '';
                                    ovariables.json_guardar_vaca = [];
                                    _('txtBuscar3').value = '';
                                    req_ini();
                                } else {
                                    swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Advertencia", text: "Debes seleccionar por lo menos 1 colaborador", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "Tienes que ingresar una fecha", type: "warning" });
            }
        }

        function fn_save_holiday() {
            _('modal_titleferiado').innerHTML = 'Guardar Feriado';
            _('btnSaveModal').addEventListener('click', fn_save_holiday_req);
            $('#modal_feriado').modal('show');
        }

        function fn_save_holiday_req() {
            let fecha_existente = ovariables.lstferiados.filter(x => x.fecha === _('txtFechaModal').value).length;
            if (_isnotEmpty(_('txtDescripcionModal').value)) {
                if (_isnotEmpty(_('txtFechaModal').value)) {
                    if (fecha_existente < 1) {
                        swal({
                            html: true,
                            title: "Guardar Feriado",
                            text: "¿Estas seguro/a que deseas guardar el feriado ingresado?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            cancelButtonText: "Cancelar",
                            closeOnConfirm: false
                        }, function () {
                            let err = function (__err) { console.log('err', __err) },
                                parametro = {
                                    descripcion: _('txtDescripcionModal').value,
                                    fecha: _('txtFechaModal').value,
                                    accion: 'new'
                                }, frm = new FormData();
                            frm.append('par', JSON.stringify(parametro));
                            _Post('RecursosHumanos/Configuracion/SaveData_Feriado', frm)
                                .then((resultado) => {
                                    if (resultado !== null) {
                                        $('#modal_feriado').modal('hide');
                                        swal({ title: "¡Buen Trabajo!", text: "Se guardo correctamente", type: "success" });
                                        _('txtDescripcionModal').value = '';
                                        _('txtFechaModal').value = '';
                                        req_ini();
                                    } else {
                                        swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                    }
                                }, (p) => { err(p); });
                        });
                    } else {
                        swal({ title: "Advertencia", text: "La fecha ya existe", type: "warning" });
                    }
                } else {
                    swal({ title: "Advertencia", text: "La fecha no puede estar vacia", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "La descripcion no puede estar vacia", type: "warning" });
            }
        }

        function fn_edit_holiday(id) {
            console.log(id);
            _('modal_titleferiado').innerHTML = 'Editar Feriado';
            _('btnSaveModal').addEventListener('click', fn_edit_holiday_req);
            $('#modal_feriado').modal('show');

            let _json = ovariables.lstferiados.filter(x => x.idferiado === id)[0];
            _('txtDescripcionModal').value = _json.descripcion;
            _('txtFechaModal').value = _json.fecha;
            ovariables.id = _json.idferiado;
        }

        function fn_edit_holiday_req() {
            if (_isnotEmpty(_('txtDescripcionModal').value)) {
                if (_isnotEmpty(_('txtFechaModal').value)) {
                    swal({
                        html: true,
                        title: "Actualizar Feriado",
                        text: "¿Estas seguro/a que deseas actualizar el feriado seleccionado?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancelar",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                idferiado: ovariables.id,
                                descripcion: _('txtDescripcionModal').value,
                                fecha: _('txtFechaModal').value,
                                accion: 'edit'
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('RecursosHumanos/Configuracion/SaveData_Feriado', frm)
                            .then((resultado) => {
                                if (resultado !== null) {
                                    $('#modal_feriado').modal('hide');
                                    swal({ title: "¡Buen Trabajo!", text: "Se actualizo correctamente", type: "success" });
                                    _('txtDescripcionModal').value = '';
                                    _('txtFechaModal').value = '';
                                    req_ini();
                                } else {
                                    swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Advertencia", text: "La fecha no puede estar vacia", type: "warning" });
                }
            } else {
                swal({ title: "Advertencia", text: "La descripcion no puede estar vacia", type: "warning" });
            }
        }

        function fn_remove_holiday(id) {
            swal({
                html: true,
                title: "Eliminar Feriado",
                text: "¿Estas seguro/a que deseas eliminar el feriado seleccionado?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        idferiado: id,
                        accion: 'delete'
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('RecursosHumanos/Configuracion/SaveData_Feriado', frm)
                    .then((resultado) => {
                        if (resultado !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino correctamente", type: "success" });
                            req_ini();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_edit_holiday: fn_edit_holiday,
            fn_remove_holiday: fn_remove_holiday,
            fn_remove_usuario: fn_remove_usuario,
            fn_remove_usuario_reportes: fn_remove_usuario_reportes,
            fn_select2_obtenerdata: fn_select2_obtenerdata
        }
    }
)(document, 'panelEncabezado_ConfiguracionIndex');
(
    function ini() {
        appConfiguracionIndex.load();
        appConfiguracionIndex.req_ini();
    }
)();
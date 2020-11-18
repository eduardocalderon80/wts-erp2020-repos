var appSolicitudCotizar = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            idaux: 0,
            accion: '',
            vista: 0,
            cbo_clientes: [],
            cbo_temporadas: [],
            idanalisistextil: '',
            lstSolicitud: [],
            lstDetalle: [],
            lstTodosATX: [],
            lstComboATX: [],
            JSONGuardar: [],
            lstDuplicados: [],
            auxorden: 0,
            //cotizar_colgador: ''  // PARA EL MOCKUP DE COTIZACION
        }

        function load() {
            _('btnReturn').addEventListener('click', fn_return);
            _('btnSave').addEventListener('click', fn_save);
            _('btnBuscarxCodigoTela').addEventListener('click', fn_buscarxCodigoTela);
            _('btnBuscarxATX').addEventListener('click', fn_buscarxATX);
            //_('btnBuscarCodigoEnLista').addEventListener('click', fn_buscar_codigotela_enlista);
            //_('btnBuscarATXEnLista').addEventListener('click', fn_buscar_codigotela_enlista);
            _('btnBuscarItemsModal').addEventListener('click', fn_buscar_codigotela_enlista);
            _('btnAgregarItemsModal').addEventListener('click', fn_agregar_codigos_lista_principal);
            _('btnAgregarTela').addEventListener('click', fn_agregar_tela);

            // Rango KG
            _('btnNuevoRangoKG').addEventListener('click', fn_agregar_rangokg);

            // Limpiar
            _('btnClean').addEventListener('click', fn_limpiar_campos);
            _('btnCleanItemsTbl').addEventListener('click', fn_limpiar_tbl);

            // Fecha por defecto
            _('txtfechainicio').value = _getDate103();

            //Auto generacion de descripcion
            fn_keyUpDescripcion();

            // Scroll top
            _scrollTo(0);

            let par = _('txtparametro').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id');
                ovariables.idaux = _par(par, 'idaux') !== '' ? _parseInt(_par(par, 'idaux')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.vista = _par(par, 'vista') !== '' ? _parseInt(_par(par, 'vista')) : 0;
                //// PARA EL MOCKUP DE COTIZACION
                //ovariables.cotizar_colgador = _par(par, 'cotizar_colgador');

                if (ovariables.accion === "new") {
                    if (ovariables.id !== '') {
                        _('_title').innerHTML = "Solicitud de Cotizacion #" + ovariables.id;
                        _('divRegistrados').style.display = "block";
                        _('titleTelas').innerHTML = "Telas Nuevas";
                        req_CargarCotizacion(ovariables.id);
                    } else {
                        _('_title').innerHTML = "Crear Solicitud de Cotizacion";
                        _('divRegistrados').style.display = "none";
                    }
                }
                else if (ovariables.accion === "duplicate") {
                    _('_title').innerHTML = "Crear Solicitud de Cotizacion";
                    let duplicados = _par(par, 'lista');
                    ovariables.lstDuplicados = CSVtoJSON(duplicados);
                    req_cargarDuplicados();
                }
                else {
                    req_CargarCotizacion(ovariables.idaux);
                    _('_title').innerHTML = "Editar Detalle de Cotizacion #" + ovariables.id;
                    $(".hide-if-no-required").css("display", "none");
                }

                //// PARA EL MOCKUP DE COTIZACION
                //if (ovariables.cotizar_colgador === '1') {
                //    let html = `
                //        <tr>    
                //            <td class="text-center">                                  
                //                <button class="btn btn-sm btn-danger" onclick="appSolicitudCotizar.fn_eliminar_tela(this)" data-orden="1">
                //                    <span class="fa fa-trash-o"></span>
                //                </button>
                //            </td>
                //            <td>Academy</td>
                //            <td></td>
                //            <td>1900002DFA301</td>    
                //            <td>ATX19 - 00003</td>
                //            <td>Double Face 71.25% Cotton 12.5% Polyester 16.25% Modal, 219 gr/m2 AW</td>
                //            <td></td>
                //            <td></td>
                //            <td>1000</td>
                //            <td>Muestra</td>
                //            <td></td>
                //        </tr>
                //        <tr>    
                //            <td class="text-center">                                  
                //                <button class="btn btn-sm btn-danger" onclick="appSolicitudCotizar.fn_eliminar_tela(this)" data-orden="1">
                //                    <span class="fa fa-trash-o"></span>
                //                </button>
                //            </td>
                //            <td>Academy</td>
                //            <td></td>
                //            <td>1900003RVA301</td>    
                //            <td>ATX19 - 00001</td>
                //            <td>Rib Varigated 40% Cotton 50% Polyester 10% Linen, 168 gr/m2 AW</td>
                //            <td></td>
                //            <td></td>
                //            <td>1000</td>
                //            <td>Muestra</td>
                //            <td></td>
                //        </tr>
                //    `;
                //    _('tbody_solicitud').innerHTML = html;
                //}
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

            // iCheck Modalidad
            $('.i-check-modalidad').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        }

        function fn_return() {
            if (ovariables.vista === 2) {
                let urlAccion = 'DesarrolloTextil/CotizarTela/BuscadorCotizacion';
                _Go_Url(urlAccion, urlAccion);
            } else if (ovariables.vista === 1) {
                let urlAccion = 'DesarrolloTextil/Solicitud/Index';
                _Go_Url(urlAccion, urlAccion);
            } else {
                let urlAccion = 'DesarrolloTextil/CotizarTela/Index';
                _Go_Url(urlAccion, urlAccion);
            }
        }

        function req_ini() {
            fn_getdatainicial();
            fn_buscar_codigotela_enlista();
        }

        function fn_keyUpDescripcion() {
            _('txtfamilia').onkeyup =
            _('txtdensidad').onkeyup =
            _('txtporcentaje_contenido_tela').onkeyup = function () {
                let familia = _('txtfamilia').value !== '' ? _capitalizePhrase(_('txtfamilia').value) : '',
                    contenido = _('txtporcentaje_contenido_tela').value !== '' ? _capitalizePhrase(_('txtporcentaje_contenido_tela').value + ',') : '',
                    lavado = $("input[name='tipo_lavado']:checked").val(),
                    densidad = _('txtdensidad').value !== '' ? _('txtdensidad').value + ' gr/m2' : '';
                let txtdescripcion = familia + ' ' + contenido + ' ' + densidad + ' ' + lavado;
                _('txtdescripcion').value = txtdescripcion;
            }
        }

        function req_cargarDuplicados() {
            let err = function (__err) { console.log('err', __err) };
            _Get('DesarrolloTextil/CotizarTela/GetData_CotizarDuplicados?par=' + JSON.stringify(ovariables.lstDuplicados))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstDuplicados = rpta;
                        res_cargarDuplicados();
                    }
                }, (p) => { err(p); });
        }

        function res_cargarDuplicados() {
            if (ovariables.lstDuplicados.length > 0) {
                // Elimina row inicial si existe
                _('row_initial') ? _('row_initial').style.display = 'none' : null
                let html = '';

                ovariables.lstDuplicados.forEach(x => {
                    // Almacena posicion (orden) en aux
                    ovariables.auxorden++;
                    let json = {
                        auxorden: ovariables.auxorden,
                        codigotela: x.CodigoTela,
                        comentario: x.Comentario,
                        contenido: x.PorcentajeTela,
                        densidad: x.Densidad,
                        descripcion: x.Descripcion,
                        division: x.Division,
                        familia: x.Familia,
                        idanalisistextil: x.IdAnalisisTextil,
                        idcliente: x.IdCliente,
                        idclientetemporada: x.IdClienteTemporada,
                        lavado: x.Lavado,
                        modalidad: x.Modalidad,
                        nroatx: x.NroATX,
                        rango: x.Rango,
                        tradename: x.TradeName
                    };
                    ovariables.JSONGuardar.push(json);

                    html += `<tr>    
                                <td class="text-center">                                  
                                    <button class="btn btn-sm btn-danger" onclick="appSolicitudCotizar.fn_eliminar_tela(this)" data-orden="${ovariables.auxorden}">
                                        <span class="fa fa-trash-o"></span>
                                    </button>
                                </td>
                                <td>${x.NombreCliente}</td>
                                <td>${x.CodigoClienteTemporada}</td>
                                <td>${x.CodigoTela}</td>    
                                <td>${x.NroATX}</td>
                                <td>${x.Descripcion}</td>
                                <td>${x.TradeName}</td>
                                <td>${x.Division}</td>
                                <td>${x.Rango}</td>
                                <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                <td>${x.Comentario}</td>
                            </tr>`;
                });
                _('tbody_solicitud').innerHTML += html;
            }
        }

        function req_CargarCotizacion(_id) {
            let err = function (__err) { console.log('err', __err) },
                parametro = { idsolicitud: _id };
            _Get('DesarrolloTextil/CotizarTela/Get_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstSolicitud = JSON.parse(rpta[0].solicitud)[0];
                        ovariables.lstDetalle = rpta[0].detalle !== '' ? JSON.parse(rpta[0].detalle) : [];
                        res_CargarCotizacion();
                    }
                }, (p) => { err(p); });
        }

        function res_CargarCotizacion() {
            let html = '';
            if (ovariables.lstDetalle.length > 0) {
                ovariables.lstDetalle.forEach(x => {
                    html += `<tr>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-danger" style="margin-right: 5px;" data-type="1" data-id="${x.IdSolicitudDetalle}" onclick="appSolicitudCotizar.fn_EliminarCotizacion(this)">
                                        <span class="fa fa-trash-o"></span>
                                    </button>
                                </td>
                                <td>${x.NombreCliente}</td>
                                <td>${x.CodigoClienteTemporada}</td>
                                <td>${x.CodigoTela}</td>    
                                <td>${x.NroATX}</td>
                                <td>${x.Descripcion}</td>
                                <td>${x.TradeName}</td>
                                <td>${x.Division}</td>
                                <td>${x.Rango}</td>
                                <td>${x.Modalidad === `M` ? `Muestra` : x.Modalidad === `P` ? `Produccion` : ``}</td>
                                <td>${x.Comentario}</td>
                            </tr>`;
                });
            }
            _('tbody_registrados').innerHTML = html;
            _('txta_observaciones').value = ovariables.lstSolicitud.Observaciones;

            // Cuando Vista es 1 (Requerimiento)
            if (ovariables.vista === 1) {
                _('_title').innerHTML = "Solicitud de Cotizacion #" + ovariables.lstSolicitud.IdSolicitud;
            }
        }

        function fn_EliminarCotizacion(button) {
            let type = button.getAttribute("data-type");
            let id = button.getAttribute("data-id");
            let title = "", text = "";
            if (_parseInt(type) === 1) {
                title = "Eliminar Detalle";
                text = "¿Estas seguro/a que deseas eliminar Detalle N°" + id + "?";
            } else {
                title = "Eliminar Solicitud";
                text = "¿Estas seguro/a que deseas eliminar Solicitud N°" + id + "? <br /> <span style='font-weight: 400; font-size: 14px;'>Al eliminar la solicitud, tambien eliminaras todos los detalles relacionados</span>";
            }
            swal({
                html: true,
                title: title,
                text: text,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idsolicitud: id, tipo: type };
                _Get('DesarrolloTextil/CotizarTela/Delete_SolicitudCotizarTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            swal({ title: "¡Buen Trabajo!", text: "Se elimino con exito", type: "success" });
                            req_CargarCotizacion();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
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
                        let lstAnio = rpta[0].anio !== '' ? JSON.parse(rpta[0].anio) : [];

                        let cbo_Anio = '';
                        lstAnio.forEach(x => {
                            cbo_Anio += `<option value ='${x.Anio}'>${x.Anio}</option>`;
                        });
                        _('cboAnioATX').innerHTML = cbo_Anio;

                        let cbo_clientes = "";
                        cbo_clientes = `<option value=''>Seleccione...</option>`;
                        ovariables.cbo_clientes.forEach(x => {
                            cbo_clientes += `<option value='${x.idcliente}'>${x.nombrecliente}</option>`;
                        });

                        _('cbo_clientes').innerHTML = cbo_clientes;
                        _('cbo_clientes').addEventListener('change', fn_temporadas);

                        if (ovariables.accion === "edit") {
                            let filter = ovariables.lstDetalle.filter(x => x.IdSolicitudDetalle === _parseInt(ovariables.id))[0];
                            ovariables.idanalisistextil = filter.IdAnalisisTextil;
                            _('txtCodigoTela').value = filter.CodigoTela;
                            _('txtnumero_reporteatx').value = filter.NroATX;
                            _('txtfamilia').value = filter.Familia;
                            _('txtporcentaje_contenido_tela').value = filter.PorcentajeTela;
                            _('txtdensidad').value = filter.Densidad;
                            if (filter.Lavado === 'BW') {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(0).prop("checked", true).iCheck("update");
                            } else {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(1).prop("checked", true).iCheck("update");
                            }
                            _('txtradename').value = filter.TradeName;
                            _('txtdivision').value = filter.Division;
                            $('.txtrango').val(filter.Rango);
                            _('txtdescripcion').value = filter.Descripcion;
                            _('txtcomentario').value = filter.Comentario;

                            // Combos
                            _('cbo_modalidad').value = filter.Modalidad;
                            _('cbo_clientes').value = filter.IdCliente;
                            fn_temporadas();
                            _('cbo_temporada').value = filter.IdClienteTemporada;
                        }
                    }
                }, (p) => { err(p); });
        }

        function fn_temporadas() {
            let idcliente = _('cbo_clientes').value, cbo_temporadas = '';

            cbo_temporadas = `<option value=''>Seleccione...</option>`;

            ovariables.cbo_temporadas.forEach(x => {
                if (idcliente == x.idcliente) {
                    cbo_temporadas += `<option value='${x.idclientetemporada}'>${x.temporada}</option>`;
                }
            });

            _('cbo_temporada').innerHTML = cbo_temporadas;
        }

        function fn_buscarxCodigoTela() {
            let codigotela = _('txtCodigoTela').value;
            if (codigotela !== '') {
                parametro = { codigotela: codigotela, codigoatx: '' };
                fn_buscar(parametro);
            } else {
                swal({ title: "Advertencia", text: "Debes ingresar un Codigo de Tela", type: "warning" });
            }
        }

        function fn_buscarxATX() {
            let codigoatx = _('txtnumero_reporteatx').value;
            if (codigoatx !== '') {
                parametro = { codigotela: '', codigoatx: codigoatx };
                fn_buscar(parametro);
            } else {
                swal({ title: "Advertencia", text: "Debes ingresar un N° Reporte ATX", type: "warning" });
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

            // Clean Paginate
            $("#div_tbl_Items_pagination").html("");

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
                            _('txtCodigoTela').value = analisistextil[0].codigotela;
                            _('txtnumero_reporteatx').value = analisistextil[0].codigo;
                            _('txtfamilia').value = analisistextil[0].nombrefamilia;
                            _('txtporcentaje_contenido_tela').value = analisistextil[0].contenidotela;
                            _('txtdensidad').value = analisistextil[0].densidad;
                            if (analisistextil[0].lavado === 'BW') {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(0).prop("checked", true).iCheck("update");
                            } else {
                                $('.i-check-lavado').prop("checked", false).iCheck("update");
                                $('.i-check-lavado').eq(1).prop("checked", true).iCheck("update");
                            }
                            let txtdescripcion = _capitalizePhrase(analisistextil[0].nombrefamilia) + ' ' + _capitalizePhrase(analisistextil[0].contenidotela) + ', ' + analisistextil[0].densidad + ' gr/m2 ' + analisistextil[0].lavado.toUpperCase();
                            _('txtdescripcion').value = txtdescripcion;
                            fn_enabled_disabled_buscar_x_tela_atx(true);
                        } else {
                            swal({ title: "Advertencia", text: "No se encontraron datos", type: "warning" });
                        }
                    }
                }, (p) => { err(p); });
        }

        function fn_enabled_disabled_buscar_x_tela_atx(bhabilitar) {
            let arr_inputs_filtro_tela_atx = Array.from(_('div_datos').getElementsByClassName('cls_filtro_tela_atx'));
            arr_inputs_filtro_tela_atx.forEach(x => {
                x.disabled = bhabilitar;
            });
        }

        function fn_limpiar_campos() {
            _('txtCodigoTela').value = '';
            _('txtnumero_reporteatx').value = '';
            _('txtfamilia').value = '';
            _('txtporcentaje_contenido_tela').value = '';
            _('txtdensidad').value = '';
            //$('.i-check-lavado').prop("checked", false).iCheck("update");
            _('txtdescripcion').value = '';
            _('txtcomentario').value = '';
            _('txtradename').value = '';
            _('txtdivision').value = '';
            $(".txtrango").val("");
            // Combos - limpiar combos cliente
            _('cbo_clientes').value = '';
            fn_temporadas();
            // Reset idanalisistextil
            ovariables.idanalisistextil = '';
            // Reset Range
            _('div_rangokg').innerHTML = '';
            fn_agregar_rangokg();
            //Limpiar checkbox
            $("#div_tbl_Items input").prop("checked", false).iCheck("update");

            fn_enabled_disabled_buscar_x_tela_atx(false);
        }

        function fn_agregar_rangokg() {
            let html = `<div class="input-group" style="margin-bottom: 2px;">
                            <input class="form-control _enty_grabar txtrango" type="number" min="0" data-required="true" data-min="1" data-max="254" data-id="rango">
                            <div class="input-group-btn">
                                <button type="button" class="btn btn-danger" onclick="appSolicitudCotizar.fn_eliminar_rangokg(this)">
                                    <span class="fa fa-trash"></span>
                                </button>
                            </div>
                        </div>`;
            _('div_rangokg').insertAdjacentHTML('beforeend', html);
        }

        function fn_eliminar_rangokg(e) {
            if (_('div_rangokg').children.length > 1) {
                e.parentElement.parentElement.remove();
            } else {
                swal({ title: "Advertencia", text: "Debes tener por lo menos un Rango x KG", type: "warning" });
            }
        }

        function fn_agregar_tela() {
            let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_solicitudcotizar' });
            if (req_enty) {
                let txtcodigotela = _('txtCodigoTela').value;
                let txtatx = _('txtnumero_reporteatx').value.replace(/ /g, "");
                //let codigotela = ovariables.lstTodosATX.analisistextil.filter(x => x.codigo.replace(/ /g, "") === txtatx && x.codigotela === txtcodigotela)
                if (parseInt(ovariables.idanalisistextil) > 0 || (_('txtCodigoTela').value === '' && _('txtnumero_reporteatx').value === '')) {
                    let cantidad_modalidad = $("input[name='check-modalidad']:checked").length;
                    if (cantidad_modalidad > 0) {
                        let cantidad_rango = $('.txtrango').length;
                        for (let j = 0; j < cantidad_rango; j++) {
                            let txt_rango = $('.txtrango').eq(j).val();
                            for (let i = 0; i < cantidad_modalidad; i++) {
                                // Almacena posicion (orden) en aux
                                ovariables.auxorden++;
                                // Elimina row inicial si existe
                                _('row_initial') ? _('row_initial').style.display = 'none' : null
                                let tbody = _('tbody_solicitud');
                                let json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_solicitudcotizar' });
                                json.auxorden = ovariables.auxorden;
                                json.idanalisistextil = _('txtCodigoTela').value !== '' ? ovariables.idanalisistextil : '';
                                json.lavado = $("input[name='tipo_lavado']:checked").val() !== undefined ? $("input[name='tipo_lavado']:checked").val() : '';
                                json.modalidad = $("input[name='check-modalidad']:checked").eq(i).val();
                                json.rango = txt_rango;
                                ovariables.JSONGuardar.push(json);
                                let html = '';
                                html += `<tr>    
                                        <td class="text-center">                                  
                                            <button class="btn btn-sm btn-danger" onclick="appSolicitudCotizar.fn_eliminar_tela(this)" data-orden="${ovariables.auxorden}">
                                                <span class="fa fa-trash-o"></span>
                                            </button>
                                        </td>
                                        <td>${ovariables.cbo_clientes.filter(x => x.idcliente == json.idcliente)[0].nombrecliente}</td>
                                        <td>${json.idclientetemporada !== '' ? ovariables.cbo_temporadas.filter(x => x.idclientetemporada == json.idclientetemporada)[0].temporada : ''}</td>
                                        <td>${json.codigotela}</td>    
                                        <td>${json.nroatx}</td>
                                        <td>${json.descripcion}</td>
                                        <td>${json.tradename}</td>
                                        <td>${json.division}</td>
                                        <td>${json.rango}</td>
                                        <td>${json.modalidad === `M` ? `Muestra` : json.modalidad === `P` ? `Produccion` : ``}</td>
                                        <td>${json.comentario}</td>
                                     </tr>`;
                                tbody.innerHTML += html;
                            }
                        }
                        //fn_limpiar_campos(); -- se retira a pedido de danae
                    } else {
                        swal({ title: "Advertencia", text: "Tienes que seleccionar una modalidad", type: "warning" });
                    }
                } else {
                    swal({ title: "Advertencia", text: "El Codigo de Tela o el Nro de ATX no coinciden entre si y/o no existen", type: "warning" });
                }
            }
        }

        function fn_limpiar_tbl() {
            swal({
                title: "Eliminar Telas",
                text: "¿Estas seguro/a que deseas eliminar todas las telas?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function () {
                _('tbody_solicitud').innerHTML = '';
                _('row_initial').style.display = '';
                ovariables.JSONGuardar = [];
                ovariables.auxorden = 0;
            });
        }

        function fn_eliminar_tela(button) {
            swal({
                title: "Eliminar Tela",
                text: "¿Estas seguro/a que deseas eliminar esta tela?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true
            }, function () {
                let i = button.parentNode.parentNode.rowIndex;
                //let codigo = _('tbl_solicitud').rows[i].cells[3].innerHTML;
                let orden = button.getAttribute('data-orden');
                ovariables.JSONGuardar = ovariables.JSONGuardar.filter(x => x.auxorden !== _parseInt(orden))
                _('tbl_solicitud').deleteRow(i);
            });
        }

        function fn_save() {
            if (ovariables.accion === "new") {
                if (ovariables.id === '') {
                    let tbody_solicitud = _('tbody_solicitud').rows.length;
                    if (tbody_solicitud > 0) {
                        const url = 'DesarrolloTextil/CotizarTela/SaveData_SolicitudCotizarTela';
                        const parametro = { solicitudes: ovariables.JSONGuardar, observaciones: _('txta_observaciones').value, id: ovariables.id };
                        parametro.accion = ovariables.accion;
                        //console.log(parametro);
                        //console.log(JSON.stringify(parametro));
                        const form = new FormData();
                        form.append('par', JSON.stringify(parametro));
                        Post(url, form, function (rpta) {
                            if (rpta !== '') {
                                swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        });
                    } else {
                        swal({ title: "Advertencia", text: "Debes ingresar por lo menos una tela", type: "warning" });
                    }
                } else {
                    const url = 'DesarrolloTextil/CotizarTela/SaveData_SolicitudCotizarTela';
                    const parametro = { solicitudes: ovariables.JSONGuardar, observaciones: _('txta_observaciones').value, id: ovariables.id };
                    parametro.accion = ovariables.accion;
                    //console.log(parametro);
                    //console.log(JSON.stringify(parametro));
                    const form = new FormData();
                    form.append('par', JSON.stringify(parametro));
                    Post(url, form, function (rpta) {
                        if (rpta !== '') {
                            swal({ title: "¡Buen Trabajo!", text: "Se registro con exito", type: "success" });
                            fn_return();
                        } else {
                            swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                        }
                    });
                }
            } else {
                let req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_solicitudcotizar' });
                if (req_enty) {
                    let txtcodigotela = _('txtCodigoTela').value;
                    let txtatx = _('txtnumero_reporteatx').value.replace(/ /g, "");
                    let codigotela = ovariables.lstTodosATX.analisistextil.filter(x => x.codigo.replace(/ /g, "") === txtatx && x.codigotela === txtcodigotela);
                    if (codigotela.length > 0 || (_('txtCodigoTela').value === '' && _('txtnumero_reporteatx').value === '')) {
                        const url = 'DesarrolloTextil/CotizarTela/SaveData_SolicitudCotizarTela';
                        const parametro = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_solicitudcotizar' });
                        parametro.idsolicitud = ovariables.id;
                        parametro.accion = ovariables.accion;
                        parametro.lavado = $("input[name='tipo_lavado']:checked").val() !== undefined ? $("input[name='tipo_lavado']:checked").val() : '';
                        const form = new FormData();
                        form.append('par', JSON.stringify(parametro));
                        Post(url, form, function (rpta) {
                            if (rpta !== '') {
                                swal({ title: "¡Buen Trabajo!", text: "Se actualizo con exito", type: "success" });
                                fn_return();
                            } else {
                                swal({ title: "Ha surgido un problema", text: "Por favor, comunicate con el administrador TIC", type: "error" });
                            }
                        });
                    } else {
                        swal({ title: "Advertencia", text: "El Codigo de Tela o el Nro de ATX no coinciden entre si y/o no existen", type: "error" });
                    }
                }
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_eliminar_tela: fn_eliminar_tela,
            ovariables: ovariables,
            fn_EliminarCotizacion: fn_EliminarCotizacion,
            fn_eliminar_rangokg: fn_eliminar_rangokg
        }
    }
)(document, 'panelEncabezado_solicitudcotizar');
(
    function ini() {
        appSolicitudCotizar.load();
        appSolicitudCotizar.req_ini();
    }
)();
var appInventarioColgador = (
    function (d, idpadre) {
        var ovariables = {
            lstAnterior: [],
            lstInventario: []            
        }

        function load() {
            d.getElementById('btnSearch').addEventListener('click', fn_buscar);
            d.getElementById('btnRegistrarMovimiento').addEventListener('click', fn_new);
            d.getElementById('btnCerrarPeriodo').addEventListener('click', fn_cerrar_periodo);
            _('btnReporteExcel').addEventListener('click', fn_exportToExcel);
            //_('btnCandado').addEventListener('click', fn_candado);
        }

        function fn_candado(e) {
            let boton = _('btnCandado');
            let clase = boton.children[0].getAttribute('class');
            console.log(clase);
            if (clase === 'fa fa-unlock') {
                boton.innerHTML = '<span class="fa fa-lock"> </span>';
                $(".btnDarBaja").prop("disabled", false);
            } else {
                boton.innerHTML = '<span class="fa fa-unlock"> </span>';
                $(".btnDarBaja").prop("disabled", true);
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
                       
                        let cboperiodoinventario = '';
                        if (lstperiodoinventario.length > 0) {
                            lstperiodoinventario.forEach(x => {                                
                                if (x.estado === "1") {
                                    cboperiodoinventario += `<option value='${x.idperiodo}' selected>${x.periodo}</option>`
                                } else {
                                    cboperiodoinventario += `<option value='${x.idperiodo}'>${x.periodo}</option>`
                                }  
                            })
                        }
                        _('_cboperiodo_colgador').innerHTML = cboperiodoinventario;
                        _('_cbolocacion_colgador').innerHTML = _comboFromJSON(lstalmacen, 'idalmacen', 'alias'); //cboperialmacen;
                        fn_buscar();
                    }
                }, (p) => { err(p); });
        }

        //fn_Signo(x.salidas, 0)
        function fn_Signo(data, tipo) {
            if (data > 0) {
                if (tipo == 0) {
                    return '<span style="color: red">-' + data +'</span>';
                } else {
                    return '<span style="color: green">+' + data +'</span>';
                }
            } else {
                return '0';
            }
        }

        function fn_SignLastMove(data, tipo) {
            if (data > 0) {
                if (tipo == 'Salida') {
                    return '<span style="color: red">-' + data + '</span>';
                } else {
                    return '<span style="color: green">+' + data + '</span>';
                }
            } else {
                return '0';
            }
        }

        function fn_buscar() {
            ovariables.lstInventario = "";
            let err = function (__err) { console.log('err', __err) },
                parametro = {
                    codigotela: _('txtcodigotela').value,
                    idperiodo: _('_cboperiodo_colgador').value,
                    descripcion: _('txtdescripcion').value,
                    idalmacen: _('_cbolocacion_colgador').value,
                    estado: _('_cboperiodo_Estado').value
                };
            $('#myModalSpinner').modal('show');
            _Get('DesarrolloTextil/InventarioColgador/GetDataInventarioColgador?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        $('#myModalSpinner').modal('hide');
                        let inventariocolgador = rpta[0].inventariocolgador !== '' ? JSON.parse(rpta[0].inventariocolgador) : [];
                        ovariables.lstInventario = inventariocolgador;
                        ovariables.lstAnterior = rpta[0].anterior !== '' ? JSON.parse(rpta[0].anterior) : [];
                        if (ovariables.lstAnterior.length > 0) {
                            fn_CrearTablaAnterior(ovariables.lstAnterior);
                            _('_cboperiodo_Estado').disabled = true;
                            _('btnReporteExcel').style.display = "initial";
                        } else {
                            fn_CrearTablaActual(ovariables.lstInventario);
                            ovariables.lstInventario
                            _('_cboperiodo_Estado').disabled = false;
                            _('btnReporteExcel').style.display = "none";
                        }           
                    }
                }, (p) => { err(p); });
        }

        function fn_CrearTablaAnterior(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `
                <table id="tbl_anterior" class ="table table-bordered table-hover" style="width:100%">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Código Tela</th>
                            <th>Período</th>
                            <th>Descripción</th>
                            <th>Saldo Inicial</th>
                            <th>Entradas</th>   
                            <th>Salidas</th>   
                            <th>Stock Contado</th>
                            <th>Stock Cierre</th>
                            <th>Diferencia</th>
                            <th>Anaquel</th>
                            <th>Almacen</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `
                        <tr>
                            <td>${x.IdInventario}</td>
                            <td>${x.CodigoTela}</td>
                            <td>${x.Periodo}</td>
                            <td>${x.Descripcion}</td>
                            <td>${x.SaldoInicial}</td>
                            <td>${fn_Signo(x.Ingresos, 1)}</td>
                            <td>${fn_Signo(x.Salidas, 0)}</td>   
                            <td>${x.StockContado}</td>   
                            <td>${x.StockCierre}</td>
                            <td>${x.Diferencia}</td>
                            <td>${x.Anaquel}</td>
                            <td>${x.Almacen}</td>
                        </tr>
                    `;
                });
            }
            html += htmlbody + '</tbody></table>';
            _('div_tbl_indexinventario').innerHTML = html;

            fn_formatTableAnterior();
        }

        function fn_formatTableAnterior() {
            var table = $('#tbl_anterior').DataTable({
                "lengthMenu": [10, 20, 30, 50],
                pageLength: 10,
                scrollY: "500px",
                scrollX: true,
                scrollCollapse: true,
                searching: true,
                lengthChange: true,
                ordering: true,
                info: true,
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
        }

        function fn_CrearTablaActual(data) {
            let table = _('div_tbl_indexinventario'), botones = '', estado = '', html = '';
            
            table.innerHTML = "";
            html = `<table id="tbl_indexinventario" class ="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                        <thead>
                            <tr>
                                <th class="no-sort"></th>
                                <th style="width:6%;">Estado</th>
                                <th class='text-center'>Código Tela</th>
                                <th class='text-center'>Período</th>
                                <th>Descripción de Tela</th>
                                <th class="text-center">Saldo Disponible</th>
                                <th class="text-center">Ultimo Movimiento</th>
                                <th class="text-center">Fecha de Ultimo Movimiento</th>
                                <th class="text-center">Motivo</th>
                                <th class="text-center" style="width:6%;">Anaquel</th>
                                <th style="width:6%;">Locación</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                                <th><input type="text" class='cls_txtfilter' placeholder="Buscar" /></th>
                            </tr>
                        </thead>
                        <tbody id="tbody_indexinventario">`;
            if (data !== null) {
                data.forEach(x => {
                    if (_parseInt(x.estado) === 1) {
                        estado = '<span class="badge badge-primary">ACTIVO</span>';
                        botones = `<button class="btn btn-sm btn-info" data-toggle="tooltip" name="ver_movimientos" onclick="appInventarioColgador.fn_movimientosinventario(this)" data-idinventario="${x.idinventario}" title="Informacion Colgador" style="margin-right: 5px;">
                                        <span class="fa fa-edit" style="cursor:pointer;"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger btnDarBaja" data-toggle="tooltip" name="ver_movimientos" onclick="appInventarioColgador.fn_cambiar_estado_inventariocolgador(this)" data-idinventario="${x.idinventario}" title="Dar de baja Colgador">
                                        <span class="fa fa-ban" style="cursor:pointer;"></span>
                                    </button>`;
                    } else if (_parseInt(x.estado) === 0) {
                        estado = '<span class="badge badge-default">INACTIVO</span>';
                        botones = `<button class="btn btn-sm btn-info" data-toggle="tooltip" name="ver_movimientos" onclick="appInventarioColgador.fn_movimientosinventario(this)" data-idinventario="${x.idinventario}" title="Informacion Colgador" style="margin-right: 5px;">
                                        <span class="fa fa-edit" style="cursor:pointer;"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger" data-toggle="tooltip" name="ver_movimientos" title="Dar de baja Colgador" disabled>
                                        <span class="fa fa-ban" style="cursor:pointer;"></span>
                                    </button>`;
                    } else {
                        estado = '<span class="badge badge-warning">PENDIENTE</span>';
                        botones = `<button class="btn btn-sm btn-info" data-toggle="tooltip" name="ver_movimientos" title="Informacion Colgador" style="margin-right: 5px;" disabled>
                                        <span class="fa fa-edit" style="cursor:pointer;"></span>
                                    </button>
                                    <button class="btn btn-sm btn-danger" data-toggle="tooltip" name="ver_movimientos" title="Dar de baja Colgador" disabled>
                                        <span class="fa fa-ban" style="cursor:pointer;"></span>
                                    </button>`;
                    }

                    html += `<tr>                                              
                                <td class="text-center">
                                    <div style="display: flex; width: 70px; margin: 0 auto 0 auto;">
                                        ${botones}
                                    </div>
                                </td>
                                <td class="text-center">${estado}</td>
                                <td class='text-center'>${x.codigotela}</td>
                                <td class="text-center">${x.periodo}</td>
                                <td>${x.descripcion}</td>
                                <td class="text-center">${x.saldodisponible}</td>
                                <td class="text-center">${fn_SignLastMove(x.ultimomovimiento, x.tipoultimomovimiento)}</td>
                                <td class="text-center">${x.fechaultimomovimiento}</td>
                                <td class="text-center">${x.motivoultimomovimiento}</td>
                                <td class="text-center">${x.anaquel}</td>
                                <td class="text-center">${x.almacen}</td>
                            </tr>
                        `;
                });
                html += "</tbody></table>";

                table.innerHTML = html;
                fn_formatTableActual();
            } else {
                html += "<tr><td colspan='11' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                table.innerHTML = html;
            }
        }

        function fn_formatTableActual() {   
            let table = $('#tbl_indexinventario').DataTable({
                sPaginationType: "full_numbers",
                iDisplayLength: 10,
                bDestroy: true,                                                                                                
                info: false,
                bLengthChange: false,                       
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,
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
                },
                order: [[7, "desc"]]
            });

            let arr_txtfilter = Array.from(_('tbl_indexinventario').getElementsByClassName('cls_txtfilter'));
            arr_txtfilter.forEach(x => {
                ['change', 'keyup'].forEach((event) => {
                    x.addEventListener(event, e => { let o = e.currentTarget; fn_search(o, table); }, false);
                });
            });

            $('#tbl_indexinventario').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_indexinventario_filter').hide();           
        }

        function fn_search(o, table) {
            let i = o.parentNode.cellIndex;
            table
                .column(i)
                .search(o.value)
                .draw();
        }

        function fn_movimientosinventario(e) {
            let idinventario = e.getAttribute("data-idinventario");
            let urlAccion = 'DesarrolloTextil/InventarioColgador/Edit';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,idinventario:' + idinventario);
        }

        function fn_new(e) {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/New';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function fn_cerrar_periodo(e) {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/CerrarPeriodo';
            _Go_Url(urlAccion, urlAccion, 'accion:cerrar');
        }

        function fn_cambiar_estado_inventariocolgador(button) {            
            let ididventario = button.getAttribute('data-idinventario');            
                swal({
                    title: "Esta seguro que desea pasar este colgador a estado Inactivo?",
                    text: " ",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: false,                    
                }, function (isConfirm) {
                    if (isConfirm) {
                        let form = new FormData();
                        let urlaccion = 'DesarrolloTextil/InventarioColgador/Cambiar_Estado_Inventario_Colgador', parametro = { ididventario: ididventario };
                        form.append('par', JSON.stringify(parametro));
                        Post(urlaccion, form, function (rpta) {
                            if (rpta !== '') {                                                                
                                _swal({ estado: 'success', mensaje: 'OK' });
                                fn_buscar();
                                return;
                            }
                            else {
                                _swal({ estado: 'error', mensaje: 'Could not delete' });
                            }
                        });
                        return;                        
                    } else {
                        
                    }
                });            
        }

        function fn_createHtmlExcel() {
            let html = '';
            html = `<thead>
                        <tr>
                            <th x:autofilter="all" class="th-text">Código Tela</th>
                            <th x:autofilter="all" class="th-text">Período</th>
                            <th x:autofilter="all" class="th-text">Descripción</th>
                            <th x:autofilter="all" class="th-text">Saldo Inicial</th>
                            <th x:autofilter="all" class="th-text">Entradas</th>   
                            <th x:autofilter="all" class="th-text">Salidas</th>   
                            <th x:autofilter="all" class="th-text">Stock Contado</th>
                            <th x:autofilter="all" class="th-text">Stock Cierre</th>
                            <th x:autofilter="all" class="th-text">Diferencia</th>
                            <th x:autofilter="all" class="th-text">Anaquel</th>
                            <th x:autofilter="all" class="th-text">Almacen</th>
                        </tr>
                    </thead>
                    <tbody>`;
            if (ovariables.lstAnterior.length > 0) {
                let aux = 0;
                ovariables.lstAnterior.forEach(x => {
                    if (aux === 0) {
                        aux++;
                        html += `<tr>
                                    <td align="center" class="white">${x.CodigoTela}</td>
                                    <td align="center" class="white">${x.Periodo}</td>
                                    <td align="left" class="white">${x.Descripcion}</td>
                                    <td align="left" class="white">${x.SaldoInicial}</td>
                                    <td align="left" class="white">${x.Ingresos}</td>
                                    <td align="left" class="white">${x.Salidas}</td>
                                    <td align="left" class="white">${x.StockContado}</td>   
                                    <td align="left" class="white">${x.StockCierre}</td>
                                    <td align="left" class="white">${x.Diferencia}</td>
                                    <td align="left" class="white">${x.Anaquel}</td>
                                    <td align="left" class="white">${x.Almacen}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td align="center" class="gray">${x.CodigoTela}</td>
                                    <td align="center" class="gray">${x.Periodo}</td>
                                    <td align="left" class="gray">${x.Descripcion}</td>
                                    <td align="left" class="gray">${x.SaldoInicial}</td>
                                    <td align="left" class="gray">${x.Ingresos}</td>
                                    <td align="left" class="gray">${x.Salidas}</td>
                                    <td align="left" class="gray">${x.StockContado}</td>   
                                    <td align="left" class="gray">${x.StockCierre}</td>
                                    <td align="left" class="gray">${x.Diferencia}</td>
                                    <td align="left" class="gray">${x.Anaquel}</td>
                                    <td align="left" class="gray">${x.Almacen}</td>
                                </tr>`;
                    }
                });
            }

            return html + '</tbody>';
        }

        function fn_exportToExcel() {
            let uri = 'data:application/vnd.ms-excel;base64,';
            let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><style>{style}</style><table border="1">{table}</table></body></html>';
            let base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            };

            let format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };

            let periodo = _('_cboperiodo_colgador').options[_('_cboperiodo_colgador').selectedIndex].text;

            let ctx = {
                worksheet: 'Reporte Periodo ' + periodo,
                style: '.th-text {background-color: #000000; color: white;} .blue{background-color: #2f74b5; color: white;} .green {background-color: #34b050; color: white;} .yellow{background-color: #ffff03;} .red{background-color: #f80200; color: white;} .white{background: #ffffff;} .gray{background: #d9d9d9;}',
                table: fn_createHtmlExcel()
            }

            let link = document.createElement("a");
            link.download = "Reporte Periodo " + periodo +".xls";
            link.href = uri + base64(format(template, ctx));
            link.click();
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_movimientosinventario: fn_movimientosinventario,
            fn_cambiar_estado_inventariocolgador: fn_cambiar_estado_inventariocolgador,
            ovariables: ovariables,
            fn_createHtmlExcel: fn_createHtmlExcel
        }
    }
)(document, 'panelEncabezado_index_IC');
(
    function ini() {
        appInventarioColgador.load();
        appInventarioColgador.req_ini();       
    }
)();


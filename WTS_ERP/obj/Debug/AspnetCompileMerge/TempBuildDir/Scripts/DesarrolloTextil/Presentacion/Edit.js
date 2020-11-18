var appEditPresentacion = (
    function (d, idpadre) {
        var ovariables = {
            idpresentacion: 0,
            clientes: [],
            estilos: [],
            cbo_clientes: [],
            cbo_temporadas: [],
            styleItems: [],
            accion: '',
            lstCodigosTelas: [],
            lstSeleccionados: [],
            lstMovimientos: []
        }

        function load() {            
            _('btnReturn').addEventListener('click', fn_return);
            _('btnSave').addEventListener('click', fn_save);
            //_('cbo_clientes').addEventListener('change', fn_temporadas);
            _('btnAgregarCliente').addEventListener('click', fn_agregarcliente);
            _('btnBuscar').addEventListener('click', fn_buscar_style);
            //_('txtCodigostyle').addEventListener('keypress', fn_agregaritem_stylo_codigo);
            _('btnAgregarItemStylo').addEventListener('click', fn_agregaritem_stylo_codigo);
            _('txtCodigostyle').addEventListener('keypress', fn_PressEnterCodigoStyle);
            _('btnAgregarCodigoTela').addEventListener('click', fn_agregaritem_codigo_tela);
            _('txtCodigoTela').addEventListener('keypress', fn_PressEnterCodigoTela);

            _('btnBuscar').onclick = function () {
                _('div_tbl_Telas').classList.add('hide');
                _('div_tbl_Items').classList.remove('hide');
                _('btnAgregarItemsModal').addEventListener('click', fn_agregar_stylos_principal);
            }
            _('btnBuscarCodigoTela').onclick = function () {
                _('div_tbl_Items').classList.add('hide');
                _('div_tbl_Telas').classList.remove('hide');
                _('btnAgregarItemsModal').addEventListener('click', fn_agregar_codigos_lista_principal);
            }

            $("#ddfechainicio .input-group.date").datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
            });

            $("#ddfechafin .input-group.date").datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true
            });
        
            let par = _('txtpar_new').value;
            if (!_isEmpty(par)) {
                ovariables.idpresentacion = _par(par, 'idpresentacion');
                ovariables.accion = _par(par, 'accion');
            }

            // Titulo presentacion
            if (_parseInt(ovariables.idpresentacion) !== 0) {
                _('_title').innerHTML = "Editar Presentacion #" + ovariables.idpresentacion;
            } else {
                _('_title').innerHTML = "Registrar Presentación";
            }

            // Fix initialised in a hidden element
            $('.modal').on('shown.bs.modal', function () {
                $('#tbl_style_agregar').DataTable().columns.adjust().draw();
                $('#tbl_codigo_agregar').DataTable().columns.adjust().draw();
            });
            $('.modal').on('hidden.bs.modal', function () {
                $("#div_tbl_Telas input").prop("checked", false).iCheck("update");
                ovariables.lstSeleccionados = [];
            });

            if (ovariables.accion === 'new') {
                _('div_Movimientos').classList.add("hide");
            } else {
                _('div_Movimientos').classList.remove("hide");
            }

            // Scanner BarCode
            handler_scanner_barcode_presentacion();
        }

        function fn_PressEnterCodigoStyle(e) {
            if (e.keyCode === 13) {
                fn_agregaritem_stylo_codigo();
            }
        }

        function fn_PressEnterCodigoTela(e) {
            if (e.keyCode === 13) {
                fn_agregaritem_codigo_tela();
            }
        }

        function req_ini() {

            fn_getdatainicial();
            fn_buscar_codigo();

            if (ovariables.accion == 'edit') {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idpresentacion: ovariables.idpresentacion };
                _Get('DesarrolloTextil/Presentacion/GetDataPresentaciones_Listar_Detalle?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            let presentacion = rpta[0].presentacion !== '' ? JSON.parse(rpta[0].presentacion) : null;
                            ovariables.clientes = rpta[0].clientes !== '' ? CSVtoJSON(rpta[0].clientes) : null;
                            ovariables.estilos = rpta[0].estilos !== '' ? CSVtoJSON(rpta[0].estilos) : null;
                            ovariables.lstMovimientos = rpta[0].movimientos !== '' ? JSON.parse(rpta[0].movimientos) : [];

                            _('txtevento').value = presentacion[0].evento;
                            _('txtfechainicio').value = presentacion[0].fechainicio;
                            _('txtfechafin').value = presentacion[0].fechafin;
                            _('txtdescripcion').value = presentacion[0].descripcion;
                            _('_cbo_Estado').value = presentacion[0].estado;

                            fn_cargar_tabla_clientes(ovariables.clientes);
                            fn_cargar_tabla_estilos(ovariables.estilos);
                            fn_cargartablamovimientos(ovariables.lstMovimientos);
                        }
                    }, (p) => { err(p); });
            }            
        }

        function fn_cargartablamovimientos(data) {
            let table = _('div_tbl_Movimientos'), html = '', buttonHtml = '';
            table.innerHTML = "";
            if (data !== null) {
                html = `<table id="tbl_indexinventario_movimiento" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                                    <thead>
                                        <tr>
                                            <th style="width:2%">N°</th>
                                            <th style="width:10%">Código Tela</th>
                                            <th style="width:10%">UsuarioSolicitante</th>
                                            <th style="width:10%">Movimiento</th>
                                            <th class="text-center" style="width:10%">Motivo</th>
                                            <th class="text-center" style="width:10%">Cantidad</th>
                                            <th class="text-center" style="width:10%">F.Registro</th>
                                            <th class="text-center" style="width:10%">Almacen</th>
                                            <th style="width:20%">Observación</th>
                                            <th class="no-sort" style="width:3%"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_indexinventario">`;
                data.forEach(x => {
                    if (x.motivo !== 'Por Solicitud') {
                        buttonHtml = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' onclick="appEditPresentacion.fn_Swal_EliminarmovimientoDB(this)" data-idkardexdetalle='${x.IdKardexDetalle}' data-idinventario='${x.IdInventario}' title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;
                    } else {
                        buttonHtml = '';
                    }
                    html += `<tr>                                                                      
                                <td>${x.IdKardexDetalle}</td>
                                <td>${x.CodigoTela}</td>
                                <td>${x.NombrePersonal}</td>
                                <td>${x.TipoMovimiento}</td>
                                <td class="text-center">${x.Motivo}</td>
                                <td class="text-center">${x.Cantidad}</td>
                                <td class="text-center">${x.FechaCreacion}</td>
                                <td class="text-center">${x.Almacen}</td>
                                <td>${x.Observacion}</td>
                                <td class="text-center" class="no-sort">  
                                    ${buttonHtml}
                                </td>
                            </tr>`;
                });

                html += "</tbody></table>";
                table.innerHTML = html;
                formatTableMovimientos();
            }
        }

        function formatTableMovimientos() {
            var table = $('#tbl_indexinventario_movimiento').DataTable({
                sPaginationType: "full_numbers",
                iDisplayLength: 10,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,
                searching: false,
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

        function fn_Swal_EliminarmovimientoDB(button) {
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
                if (inputValue === "") {
                    swal.showInputError("Ingrese un motivo!");
                    return false
                } else {
                    let form = new FormData();
                    let urlaccion = 'DesarrolloTextil/InventarioColgador/EliminarMovimiento', parametro = { idkardexdetalle: idkardexdetalle, comentarioestado: inputValue, idinventario: idinventario };
                    form.append('par', JSON.stringify(parametro));
                    Post(urlaccion, form, function (rpta) {
                        if (rpta !== '') {
                            let jrpta = JSON.parse(rpta);
                            req_ini();
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

        function fn_cargar_tabla_clientes(data) {
            let table = _('div_tbl_Clientes'), html = '';
            table.innerHTML = "";

            html = `
                        <table id="tbl_clientes" class ="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                                    <thead>
                                        <tr>                                            
                                            <th style="width:10%">Cliente</th>                                            
                                            <th style="width:10%">Contacto</th>
                                            <th class="text-center" style="width:10%">Correo</th>
                                            <th class="text-center" style="width:10%">Telefono</th>                                            
                                            <th class="no-sort" style="width:6%"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_indexclientes">
                        `;

            if (data !== null) {
                data.forEach(x => {
                    html += `
                                <tr id='${x.idpresentacioncliente}'>                                                                                                          
                                    <td>${x.nombrecliente}</td>                                    
                                    <td>${x.nombrecontacto}</td>
                                    <td class="text-center">${x.correoelectronico}</td>
                                    <td class="text-center">${x.telefono}</td>                                                                        
                                    <td class="text-center">                                        
                                        <button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' data-idcliente='${x.idcliente}' onclick="appEditPresentacion.fn_Swal_Eliminarcliente(this)" data-idpresentacioncliente='${x.idpresentacioncliente}' title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>
                                    </td>
                                </tr>
                            `;
                });

                html += "</tbody></table>";
                table.innerHTML = html;
                               
            } else {
                html += "<tr><td colspan='6' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                table.innerHTML = html;               
            }                          
        }
       
        function fn_cargar_tabla_estilos(data) {
            let table = _('div_tbl_stylos'), html = '';
            table.innerHTML = "";
            html = `
                        <table id="tbl_stylos" class ="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                                    <thead>
                                        <tr>                                            
                                            <th style="width:10%">Sketch</th>
                                            <th style="width:10%">Cliente</th>
                                            <th style="width:10%">Style</th>
                                            <th style="width:5%">Version</th>
                                            <th class="text-center" style="width:15%">Descripcion</th>
                                            <th class="text-center" style="width:10%">Season</th>                                            
                                            <th class="text-center" style="width:10%">Division</th>
                                            <th class="text-center" style="width:5%">Cantidad</th>
                                            <th class="text-center no-sort" style="width:6%"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_indexstylos">
                        `;
            if (data !== null) {
                data.forEach(x => {
                    html += `
                                <tr>                                                                                                          
                                    <td class="text-center"><img class="img-thumbnail" src="http://WTS-FILESERVER/erp/style/thumbnail/${x.imagen}" width="60" height="50"></td>
                                    <td>${x.nombrecliente}</td>
                                    <td>${x.codigoestilo}</td>
                                    <td class="text-center">${x.version}</td>
                                    <td class="text-center">${x.descripcion}</td>                                                                        
                                    <td class="text-center">${x.nombretemporada}</td>                                                                        
                                    <td class="text-center">${x.nombredivision}</td>
                                    <td><input type='text' class='form-control' value='${x.cantidad}' /></td>
                                    <td class="text-center">                                        
                                        <button class="btn btn-sm btn-danger" data-toggle="tooltip"  data-idcliente='${x.idcliente}' data-idestilo='${x.idestilo}' onclick="appEditPresentacion.fn_Swal_Eliminar_stylo(this)"  title='Eliminar'><span class="fa fa-trash" style="cursor:pointer;"></span></button>
                                    </td>
                                </tr>
                            `;
                });

                html += "</tbody></table>";
                table.innerHTML = html;                
               
            } else {
                html += "</tbody></table>";
                table.innerHTML = html;                 
            }                          
        }
        
        function fn_return(e) {
            let urlAccion = 'DesarrolloTextil/Presentacion/Index';
            _Go_Url(urlAccion, urlAccion, 'accion:index');
        }

        function fn_getdatainicial() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1};
            _Get('DesarrolloTextil/Presentacion/GetData_Inicial?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.cbo_clientes = rpta[0].clientes !== '' ? CSVtoJSON(rpta[0].clientes) : null;                        
                        ovariables.cbo_temporadas = rpta[0].temporadas !== '' ? CSVtoJSON(rpta[0].temporadas) : null;

                        //let cbo_clientes = "";
                        //cbo_clientes = `<option value='0'>Seleccione...</option>`;
                        //ovariables.cbo_clientes.forEach(x => {
                        //    cbo_clientes += `<option value='${x.idcliente}'>${x.nombrecliente}</option>`;
                        //});
                        _('cbo_clientes').innerHTML = _comboItem({ text: 'Seleccione...', value:'' }) + _comboFromJSON(ovariables.cbo_clientes, 'idcliente', 'nombrecliente'); //cbo_clientes;
                    }
                }, (p) => { err(p); });

        }

        function fn_temporadas() {
            let idcliente = _('cbo_clientes').value, cbo_temporadas = '';

            cbo_temporadas = `<option value='0'>Seleccione...</option>`;

            ovariables.cbo_temporadas.forEach(x => {
                if (idcliente == x.idcliente) {
                    cbo_temporadas += `<option value='${x.idtemporada}'>${x.temporada}</option>`;
                }
            });

            _('cbo_temporada').innerHTML = cbo_temporadas;
        }

        function fn_agregarcliente() {
            let idcliente = _('cbo_clientes').value;
            
            /* idtemporada = select_temporada.value;
             * let select_temporada = _('cbo_temporada');
            if (idtemporada !== "0" && idcliente !== "0") {*/
            if (idcliente !== "0") {
                //let temporada = select_temporada.options[select_temporada.selectedIndex].text;

                if (_('tbody_indexclientes') === null) {
                    let div = _('div_tbl_Clientes'), html = '';
                     html = `
                        <table id="tbl_clientes" class ="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                                    <thead>
                                        <tr>                                            
                                            <th style="width:10%">Cliente</th>                                            
                                            <th style="width:10%">Contacto</th>
                                            <th class="text-center" style="width:10%">Correo</th>
                                            <th class="text-center" style="width:10%">Telefono</th>                                            
                                            <th class="no-sort" style="width:6%"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_indexclientes">
                                    </tbody></table>
                        `;                           
                        div.innerHTML = html;
                }

                let tbody = _('tbody_indexclientes');

                
                
                let cantidadfilas = tbody.rows.length;
                let lEncontrado = false;
                for (let i = 0; i < cantidadfilas; i++) {
                    //if (tbody.rows[i].cells[5].children[0].getAttribute("data-idcliente") == idcliente && tbody.rows[i].cells[5].children[0].getAttribute("data-idtemporada") == idtemporada) {                        
                    if (tbody.rows[i].cells[4].children[0].getAttribute("data-idcliente") == idcliente) {                        
                        lEncontrado = true;
                        break;
                    }
                }        

                if (!lEncontrado) {
                    let row = tbody.insertRow(0);
                    let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3), cell5 = row.insertCell(4);
                    cell5.className = "text-center";

                    ovariables.cbo_clientes.forEach(x => {
                        if (idcliente == x.idcliente) {
                            cell1.innerHTML = x.nombrecliente;
                            //cell2.innerHTML = temporada;
                            cell2.innerHTML = x.nombrecontacto;
                            cell3.innerHTML = x.correoelectronico;
                            cell4.innerHTML = x.telefono;
                            cell5.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' data-idcliente='${idcliente}' onclick="appEditPresentacion.fn_Swal_Eliminarcliente(this)"  title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;
                        }
                    });
                } else {
                    _swal({ estado: 'info', mensaje: 'Seleccione un cliente.' });
                }                
            } else {                
                _swal({ estado: 'info', mensaje: 'Seleccione un cliente.' });                                
            }
        }

        function fn_buscar_style() {            
            let tbody = _('tbody_indexclientes'), tbody_estilos = _('tbody_indexstylos');
            let cantidadfilas = tbody.rows.length;
            let clientes = '', estilos = '';
            for (let i = 0; i < cantidadfilas; i++) {
                clientes += tbody.rows[i].cells[4].children[0].getAttribute("data-idcliente") +'¬';               
            }  
            cantidadfilas = tbody_estilos.rows.length;
            for (let i = 0; i < cantidadfilas; i++) {                
                estilos += tbody_estilos.rows[i].cells[8].children[0].getAttribute("data-idestilo") + '¬';
            }  

            let err = function (__err) { console.log('err', __err) },
                //parametro = { clientes: clientes, temporadas: temporadas };
                parametro = { clientes: clientes, estilos: estilos };

            _Get('DesarrolloTextil/Presentacion/GetData_ListaEstilosClienteTemporada?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.styleItems = [];

                        let stylos = rpta[0].estilos !== '' ? CSVtoJSON(rpta[0].estilos) : null;

                        let table = _('div_tbl_Items'), html = '';
                        table.innerHTML = "";
                        html = `
                        <table id="tbl_style_agregar" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;" >                            
                                    <thead>
                                        <tr>
                                            <th class="text-center no-sort-lista">                                                       
                                                
                                            </th>
                                            <th>Sketch</th>
                                            <th>Cliente</th>
                                            <th>Style</th>
                                            <th>Version</th>
                                            <th class="text-center" style="width: 10%;">Descripcion</th>
                                            <th class="text-center" >Season</th>                                            
                                            <th class="text-center" >Division</th>                                            
                                            
                                        </tr>
                                    </thead>
                                    <tbody id="tbody_index_styles_buscar" >
                        `;
                        if (stylos !== null) {
                            stylos.forEach(x => {
                                html += `
                                <tr>    
                                    <td class="text-center">                                        
                                        <input  class="i-check" type="checkbox" onclick="appEditPresentacion.fn_agregar_estilos_lista_principal(this)" data-idcliente='${x.idcliente}' data-idestilo=${x.idestilo} name="styles"/>
                                    </td>
                                    <td class="text-center"><img class="img-thumbnail" src="http://WTS-FILESERVER/erp/style/thumbnail/${x.imagen}" width="60" height="50"></td>
                                    <td>${x.nombrecliente}</td>
                                    <td>${x.codigoestilo}</td>
                                    <td class="text-center">${x.version}</td>
                                    <td class="text-center" style="width: 10%;">${x.descripcion}</td>                                                                        
                                    <td class="text-center">${x.nombretemporada}</td>                                                                        
                                    <td class="text-center">${x.nombredivision}</td>                                                                        
                                </tr>
                            `;
                            });
                        }
                        html += "</tbody></table>";
                        table.innerHTML = html;
                        formatTablestylesAgregar();
                    }
                }, (p) => { err(p); });         
        }

        function formatTablestylesAgregar() {
            if (_("tbl_style_agregar").rows.length > 1) {
                $('#tbl_style_agregar thead tr').clone(true).appendTo('#tbl_style_agregar thead');
                $('#tbl_style_agregar thead tr:eq(1) th').each(function (i) {
                    var title = $(this).text();
                    //i == 0 ? $(this).html("<input  class='i-check' type='checkbox' id='check-padre'/>") : $(this).html('<input type="text" placeholder="Search" />');
                    i == 0 ? "" : $(this).html('<input type="text" placeholder="Buscar" />');

                    $('input', this).on('keyup change', function () {
                        if (table.column(i).search() !== this.value) {
                            table
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    });
                });
            }

            var table = $('#tbl_style_agregar').DataTable({
                paging: false,
                bPaginate: false,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,
                scrollY: "500px",
                scrollCollapse: true,
                scrollX: true,
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
                }
            });
      
            $('#tbl_style_agregar').removeClass('display').addClass('table table-bordered table-hover');           
            $('#tbl_style_agregar_filter').hide();

            document.getElementsByClassName('table table-bordered table-hover dataTable no-footer')[0].style.width = '819px';

            $('.i-check').iCheck({
                checkboxClass: 'iradio_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                var isChecked = e.currentTarget.checked;

                if (isChecked == true) {
                    fn_agregar_estilos_lista_principal(e);
                } else {
                    fn_eliminar_estilos_lista_principal(e);
                }
            });
        }


        function fn_pressenter(e) {
            if (e.keyCode === 13) {
                fn_agregaritem_stylo_codigo();
            }
        }        

        function fn_agregaritem_stylo_codigo() {
            let err = function (__err) { console.log('err', __err) }, codigoestilo = _('txtCodigostyle').value,
                parametro = { codigoestilo: codigoestilo};
            if (codigoestilo !== "") {
                _Get('DesarrolloTextil/Presentacion/GetData_BuscarStyloCodigo?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta[0].estilos !== '') {

                            let estilo = CSVtoJSON(rpta[0].estilos);

                            let cliente, codigostylo, version, division, season;

                            cliente = estilo[0].nombrecliente;
                            codigostylo = estilo[0].codigoestilo;
                            version = estilo[0].version;
                            division = estilo[0].nombredivision;
                            season = estilo[0].nombretemporada;

                            let tbody = _('tbody_indexstylos');
                            let cantidadfilas = tbody.rows.length;
                            let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;

                            let tbl_cliente, tbl_codigostylo, tbl_version, tbl_division, tbl_season;

                            for (let i = 0; i < cantidadfilas; i++) {

                                tbl_cliente = tbody.rows[i].cells[1].innerHTML;
                                tbl_codigostylo = tbody.rows[i].cells[2].innerHTML;
                                tbl_version = tbody.rows[i].cells[3].innerHTML;
                                tbl_division = tbody.rows[i].cells[6].innerHTML;
                                tbl_season = tbody.rows[i].cells[5].innerHTML;

                                if (tbl_cliente === cliente && tbl_codigostylo === codigostylo && tbl_version === version && tbl_division === division && tbl_season === season) {
                                    inputCantidad = tbody.rows[i].cells[7].children[0];
                                    cantidadSolicitada = (inputCantidad.value * 1) + 1;
                                    inputCantidad.value = cantidadSolicitada;

                                    lEncontrado = true;
                                }
                            }

                            if (lEncontrado === false) {
                                let row = tbody.insertRow(0);                                
                                let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3),
                                    cell5 = row.insertCell(4), cell6 = row.insertCell(5), cell7 = row.insertCell(6), cell8 = row.insertCell(7),
                                    cell9 = row.insertCell(8);

                                cell1.className = 'text-center';
                                cell4.className = 'text-center';
                                cell6.className = 'text-center';
                                cell7.className = 'text-center';
                                cell8.className = 'text-center';
                                cell9.className = 'text-center';

                                cell1.innerHTML = `<img class="img-thumbnail" src="http://WTS-FILESERVER/erp/style/thumbnail/${estilo[0].imagen}" width="60" height="50">`;
                                cell2.innerHTML = cliente;
                                cell3.innerHTML = codigostylo;
                                cell4.innerHTML = version;
                                cell5.innerHTML = estilo[0].descripcion;
                                cell6.innerHTML = season;
                                cell7.innerHTML = division;
                                cell8.innerHTML = `<td class="text-center"><input type='text' class='form-control' value='1' /></td>`;
                                cell9.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" data-idcliente='${estilo[0].idcliente}' data-idestilo='${estilo[0].idestilo}' onclick="appEditPresentacion.fn_Swal_Eliminar_stylo(this)"  title='Eliminar'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;                               

                            }

                        } else {
                            _swal({ estado: 'warning', mensaje: 'Colgador no encontrado.' });
                        }
                    }, (p) => { err(p); });
            }
        }

        // Jacob
        function fn_buscar_codigo() {
            let err = function (__err) { console.log('err', __err) }, parametro = { Existentes: "SI" };
            _Get('DesarrolloTextil/InventarioColgador/GetAllData_InventarioCodigoTela?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstCodigosTelas = rpta;
                        let table = _('div_tbl_Telas'), html = '';
                        table.innerHTML = "";
                        html = `
                        <table id="tbl_codigo_agregar" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                            <thead>
                                <tr>
                                    <th class="text-center no-sort"></th>
                                    <th>Código Tela</th>
                                    <th>Descripcion</th>
                                    <th>Cantidad Disponible</th>                                            
                                </tr>
                            </thead>
                            <tbody>
                        `;
                        if (rpta !== null) {
                            rpta.forEach(x => {
                                html += `
                                <tr>    
                                    <td class="text-center">                                        
                                        <input class="i-check-tela" type="checkbox" data-id='${x.idanalisisTextil}' name="codigo_agregar" />
                                    </td>
                                    <td>${x.codigoTela}</td>
                                    <td>${x.descripcion}</td>
                                    <td>${x.saldodisponible}</td>                                                                     
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
                    $('.i-check-tela').iCheck({
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
                    let tbody = _('tbody_colgadores');
                    let cantidadfilas = tbody.rows.length;
                    let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;
                    for (let i = 0; i < cantidadfilas; i++) {
                        if (tbody.rows[i].children[3].children[0].getAttribute('data-idanalisistextil') == colgador[0].idanalisisTextil) {
                            inputCantidad = tbody.rows[i].cells[3].children[0];
                            cantidadSolicitada = (inputCantidad.value * 1) + 1;
                            inputCantidad.value = cantidadSolicitada;

                            lEncontrado = true;
                        }
                    }

                    if (lEncontrado === false) {
                        let row = tbody.insertRow(-1);
                        row.id = colgador[0].idinventario;
                        let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3), cell5 = row.insertCell(4), cell6 = row.insertCell(5);

                        cell1.innerHTML = colgador[0].codigoTela;
                        cell2.innerHTML = colgador[0].descripcion;
                        cell3.innerHTML = colgador[0].saldodisponible;
                        cell3.id = "txtDisponible";
                        cell4.innerHTML = `<input type='text' data-idanalisistextil='${colgador[0].idanalisisTextil}' data-required="true" data-min="1" class='form-control _enty_grabar' value='1' data-type='int' data-max='9999999' id='txtCantidad'></input>`;
                        cell5.innerHTML = `<input type='text' class='form-control _enty_observacion' data-required="false"></input>`;
                        cell6.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' data-idinventario='${colgador[0].idinventario}' onclick="appEditPresentacion.fn_Swal_Eliminarmovimiento(this)"  title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;
                    }
                });
            }

            //$('.close').click();
        }

        function fn_agregaritem_codigo_tela() {
            let err = function (__err) { console.log('err', __err) }, codigotela = _('txtCodigoTela').value,
                parametro = { codigotela: codigotela };
            if (codigotela !== "") {
                _Get('DesarrolloTextil/InventarioColgador/GetData_InventarioCodigoTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta[0].colgador !== '') {

                            let colgador = JSON.parse(rpta[0].colgador);

                            let tbody = _('tbody_colgadores');
                            let cantidadfilas = tbody.rows.length;
                            let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;
                            for (let i = 0; i < cantidadfilas; i++) {
                                if (tbody.rows[i].children[3].children[0].getAttribute('data-idanalisistextil') == colgador[0].idanalisisTextil) {
                                    inputCantidad = tbody.rows[i].cells[3].children[0];
                                    cantidadSolicitada = (inputCantidad.value * 1) + 1;
                                    inputCantidad.value = cantidadSolicitada;

                                    lEncontrado = true;
                                }
                            }

                            if (lEncontrado === false) {
                                let row = tbody.insertRow(-1);
                                row.id = colgador[0].idinventario;
                                let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3), cell5 = row.insertCell(4), cell6 = row.insertCell(5);

                                cell1.innerHTML = colgador[0].codigoTela;
                                cell2.innerHTML = colgador[0].descripcion;
                                cell3.innerHTML = colgador[0].saldodisponible;
                                cell4.innerHTML = `<input type='text' data-idanalisistextil='${colgador[0].idanalisisTextil}' data-required="true" data-min="1" class='form-control _enty_grabar' value='1' data-type='int' data-max='9999999'></input>`;
                                cell5.innerHTML = `<input type='text' class='form-control _enty_observacion' data-required="false"></input>`;
                                cell6.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' data-idinventario='${colgador[0].idinventario}' onclick="appEditPresentacion.fn_Swal_Eliminarmovimiento(this)"  title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;
                            }

                            _('txtCodigoTela').value = "";

                        } else {
                            swal({ title: "Advertencia", text: "El Codigo de Tela ingresado no existe o no tiene inventario", type: "warning" }, function () {
                                _('txtCodigoTela').value = "";
                            });
                        }
                    }, (p) => { err(p); });
            }
        }

        //function fn_agregaritem_codigo_tela() {
        //    let colgador = ovariables.lstCodigosTelas.filter(x => x.codigoTela == _('txtCodigoTela').value);
        //    if (colgador.length > 0) {
        //        let tbody = _('tbody_colgadores');
        //        let cantidadfilas = tbody.rows.length;
        //        let lEncontrado = false, cantidadSolicitada = 0, inputCantidad = 0;
        //        for (let i = 0; i < cantidadfilas; i++) {
        //            if (tbody.rows[i].children[3].children[0].getAttribute('data-idanalisistextil') == colgador[0].idanalisisTextil) {
        //                inputCantidad = tbody.rows[i].cells[3].children[0];
        //                cantidadSolicitada = (inputCantidad.value * 1) + 1;
        //                inputCantidad.value = cantidadSolicitada;

        //                lEncontrado = true;
        //            }
        //        }

        //        if (lEncontrado === false) {
        //            let row = tbody.insertRow(-1);
        //            row.id = colgador[0].idinventario;
        //            let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3), cell5 = row.insertCell(4), cell6 = row.insertCell(5);

        //            cell1.innerHTML = colgador[0].codigoTela;
        //            cell2.innerHTML = colgador[0].descripcion;
        //            cell3.innerHTML = colgador[0].saldodisponible;
        //            cell3.id = "txtDisponible";
        //            cell4.innerHTML = `<input type='text' data-idanalisistextil='${colgador[0].idanalisisTextil}' data-required="true" data-min="1" class='form-control _enty_grabar' value='1' data-type='int' data-max='9999999' id='txtCantidad'></input>`;
        //            cell5.innerHTML = `<input type='text' class='form-control _enty_observacion' data-required="false"></input>`;
        //            cell6.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" name='ver_movimientos' data-idinventario='${colgador[0].idinventario}' onclick="appNewInventarioColgador.fn_Swal_Eliminarmovimiento(this)"  title='Dar de baja Colgador'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;
        //        }
        //        _('txtCodigoTela').value = "";
        //    }
        //}

        function fn_Swal_Eliminarmovimiento(button) {
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_colgadores').deleteRow(i);
        }

        function fn_ObtenerCodigosTela() {
            let items = "";
            let tbody = _('tbody_colgadores');
            let cantidadfilas = tbody.rows.length;
            let cantidad_bool = true;
            if (cantidadfilas > 0) {
                let inputCantidad = 0, inputobservacion = "", cantidad = 0, idinventario = 0, idanalisistextil = 0, observacion = "", disponible = 0;
                for (let i = 0; i < cantidadfilas; i++) {
                    inputCantidad = tbody.rows[i].cells[3].children[0];
                    inputobservacion = tbody.rows[i].cells[4].children[0];
                    idinventario = tbody.rows[i].id;
                    cantidad = inputCantidad.value;
                    disponible = tbody.rows[i].cells[2].textContent;
                    idanalisistextil = inputCantidad.getAttribute('data-idanalisistextil');
                    observacion = inputobservacion.value;

                    items += idinventario + '¬' + cantidad + '¬' + idanalisistextil + '¬' + observacion + '^';

                    // False si cantidad es mayor a saldo disponible
                    if (_parseInt(cantidad) > _parseInt(disponible)) {
                        cantidad_bool = false;
                    }
                }
            }

            if (cantidad_bool === false) {
                return { bool: cantidad_bool, items: '' };
            } else {
                return { bool: cantidad_bool, items: items };
            }
        }

        function fn_save() {
            let items_clientes = "", items_stylos = "", req_enty = '';
            let tbody_clientes = _('tbody_indexclientes');
            let tbody_stylos = _('tbody_indexstylos');
            req_enty = _required({ clase: '_enty_grabar', id: 'panelEncabezado_presentacionEditar' });
            let cantidadfilas_clientes = tbody_clientes.rows.length;
            let cantidadfilas_stylos = tbody_stylos.rows.length;
            let json_codigo_tela = fn_ObtenerCodigosTela();
            let codigos_tela = json_codigo_tela.items;

            let boolAux = false;
            if (codigos_tela !== '') {
                boolAux = true;
            }
            if (ovariables.accion == 'edit') {
                boolAux = true;
            }

            if (req_enty && (cantidadfilas_clientes > 0) && (cantidadfilas_stylos > 0) && boolAux) {
                let idcliente, idestilo, cantidad;

                for (let i = 0; i < cantidadfilas_clientes; i++) {
                    idcliente = tbody_clientes.rows[i].cells[4].children[0].getAttribute("data-idcliente");                    
                    items_clientes += idcliente +'¬';
                }

                for (let i = 0; i < cantidadfilas_stylos; i++) {
                    idcliente = tbody_stylos.rows[i].cells[8].children[0].getAttribute('data-idcliente');
                    idestilo = tbody_stylos.rows[i].cells[8].children[0].getAttribute('data-idestilo');
                    cantidad = tbody_stylos.rows[i].cells[7].children[0].value;

                    items_stylos += idcliente + '¬' + idestilo + '¬' + cantidad + '^';
                }

                let form = new FormData();
                let urlaccion = '';

                if (ovariables.accion == 'edit') {
                    urlaccion = 'DesarrolloTextil/Presentacion/Save_Edit_Presentacion';
                } else {
                    urlaccion = 'DesarrolloTextil/Presentacion/Save_New_Presentacion';
                }
                
                let parametro = {
                    idpresentacion: ovariables.idpresentacion, evento: _('txtevento').value, fechainicio: _('txtfechainicio').value, fechafin: _('txtfechafin').value,
                    estado: _('_cbo_Estado').value, descripcion: _('txtdescripcion').value, clientes: items_clientes, estilos: items_stylos, codigostela: codigos_tela
                };    

                form.append('par', JSON.stringify(parametro));
                Post(urlaccion, form, function (rpta) {
                    if (rpta !== '') {
                        let respuesta = JSON.parse(rpta);
                        
                        if (ovariables.accion == 'new') {
                            _swal({ estado: 'success', mensaje: 'OK' });
                            //_('btnSave').classList.add('hide');
                            //let idpresentacion = respuesta.id;
                            //let urlAccion = 'DesarrolloTextil/Presentacion/Edit';
                            //_Go_Url(urlAccion, urlAccion, 'accion:edit,idpresentacion:' + idpresentacion);
                            fn_return();
                        } else {
                            _swal({ estado: 'success', mensaje: 'OK' });
                            //_('btnSave').classList.add('hide');
                            //req_ini();
                            //_('tbody_colgadores').innerHTML = '';
                            fn_return();
                        }
                        return;
                    }
                    else {
                        _swal({ estado: 'error', mensaje: 'Error' });
                    }
                });
            } else {
                if (json_codigo_tela.bool === false && json_codigo_tela.items === '') {
                    swal({ title: "Advertencia", text: "La cantidad ingresada no puede ser mayor a la disponible", type: "warning" });
                }
                if (json_codigo_tela.bool === true && json_codigo_tela.items === '') {
                    swal({ title: "Advertencia", text: "Debes ingresar por le menos 1 codigo de tela", type: "warning" });
                }
                if (cantidadfilas_stylos == 0) {
                    _swal({ estado: 'info', mensaje: 'Ingrese Items.' });
                }
            }               
        }

        function fn_Swal_Eliminarcliente(button) {            
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_clientes').deleteRow(i);

            //Eliminar estilo si es = al cliente eliminado
            //let cliente = button.getAttribute('data-idcliente');
            //let tbody_stylos = _('tbody_indexstylos');
            //let cantidadfilas_stylos = tbody_stylos.rows.length;
            //if (cantidadfilas_stylos > 0) {
            //    for (let i = 0; i < cantidadfilas_stylos; i++) {
            //        let idcliente = tbody_stylos.rows[i].cells[8].children[0].getAttribute('data-idcliente');
            //        if (idcliente == cliente) {
            //            tbody_stylos.deleteRow(i);
            //        }
            //    }
            //}

            let cliente = button.getAttribute('data-idcliente');
            $("#tbody_indexstylos button[data-idcliente='" + cliente +"']").parent().parent().remove();
        }

        function fn_DeleteCells(cantidad, idcliente) {

        }

        function fn_Swal_Eliminar_stylo(button) {
            var i = button.parentNode.parentNode.rowIndex;
            _('tbl_stylos').deleteRow(i);            
        }

        function fn_agregar_estilos_lista_principal(input) {
            let tr = input.currentTarget.parentNode.parentNode.parentNode;
            let html = "", idcliente = 0, idestilo = 0;

            idcliente = tr.cells[0].children[0].children[0].getAttribute('data-idcliente');
            idestilo = tr.cells[0].children[0].children[0].getAttribute('data-idestilo');

            for (let i = 1; i < tr.cells.length; i++) {
                html += (tr.cells[i].outerHTML);                              
            }

            ovariables.styleItems.push({ idcliente: idcliente, idestilo: idestilo, html: html });
        }

        function fn_eliminar_estilos_lista_principal(input) {
            
            let indice = 0, idcliente = 0, idestilo = 0;
            let tr = input.currentTarget.parentNode.parentNode.parentNode;

            idcliente = tr.cells[0].children[0].children[0].getAttribute('data-idcliente');
            idestilo = tr.cells[0].children[0].children[0].getAttribute('data-idestilo');


            for (let i = 0; i < ovariables.styleItems.length; i++) {
                if (idcliente == ovariables.styleItems[i].idcliente && idestilo == ovariables.styleItems[i].idestilo) {                    
                    indice = i;
                    break;
                }
            }
            
            ovariables.styleItems.splice(indice, 1);
        }

        function fn_agregar_stylos_principal() {
            let tbody = _('tbody_indexstylos');
            let row = "";

            ovariables.styleItems.forEach(x => {

                row = tbody.insertRow(0);
                row.innerHTML = x.html;

                cell8 = row.insertCell(7);
                cell9 = row.insertCell(8);

                cell8.className = 'text-center';
                cell9.className = 'text-center';

                cell8.innerHTML = `<td class="text-center"><input type='text' class='form-control' value='1' /></td>`;
                cell9.innerHTML = `<button class="btn btn-sm btn-danger" data-toggle="tooltip" data-idcliente='${x.idcliente}' data-idestilo='${x.idestilo}' onclick="appEditPresentacion.fn_Swal_Eliminar_stylo(this)"  title='Eliminar'><span class="fa fa-trash" style="cursor:pointer;"></span></button>`;        

            });       

            //$('.close').click();
        }

        function handler_scanner_barcode_presentacion() {
            $(document).scannerDetection({
                timeBeforeScanTest: 200, // wait for the next character for upto 200ms
                avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
                minLength: 4,  // POR DEFECTO SI NO SE PONE ESTA CONFIGURACION ES DE 6 DIGITOS
                onComplete: function (barcode, qty) {
                    _('txtCodigoTela').value = barcode;
                    fn_agregaritem_codigo_tela();
                    //console.log(barcode);
                }
            });
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_Swal_Eliminarcliente: fn_Swal_Eliminarcliente,
            fn_Swal_Eliminar_stylo: fn_Swal_Eliminar_stylo,
            fn_agregar_estilos_lista_principal: fn_agregar_estilos_lista_principal,
            ovariables: ovariables,
            fn_Swal_Eliminarmovimiento: fn_Swal_Eliminarmovimiento,
            fn_ObtenerCodigosTela: fn_ObtenerCodigosTela,
            fn_Swal_EliminarmovimientoDB: fn_Swal_EliminarmovimientoDB
        }
    }
)(document, 'panelEncabezado_presentacionEditar');
(
    function ini() {
        appEditPresentacion.load();
        appEditPresentacion.req_ini();
    }
)();


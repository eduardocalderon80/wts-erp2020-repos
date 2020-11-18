var appTesoreriaIndex = (
    function (d, idpadre) {
        var ovariables = {
            listClientes: [],
            listEstadoEnvio: [],
            listTipoFecha: [],
            listInvoice: [],
            strFiltros:''
        }

        function load() {

            _('btnUpdate').addEventListener('click', buscarfacturas);          
            _('btnExportar').addEventListener('click', ExportarFacturas);
            
        }

        function req_ini() {            

            obtenemosFecha();
            obtenemosFiltros();         
            buscarfacturas();
        }

        function obtenemosFiltros() {

            let err = function (__err) { console.log('err', __err) },
                parametro = { Id: 0 };
            _Get('Facturacion/TesoreriaBol/GetListaTesoreriaBolIndex_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;

                    if (rpta !== null) {

                        ovariables.listClientes = rpta.ListaClienteCSV !== '' ? CSVtoJSON(rpta.ListaClienteCSV) : [];
                        ovariables.listEstadoEnvio = rpta.ListaEstadoEnvioCSV !== '' ? CSVtoJSON(rpta.ListaEstadoEnvioCSV) : [];
                        ovariables.listTipoFecha = rpta.ListaTipoFechaCSV !== '' ? CSVtoJSON(rpta.ListaTipoFechaCSV) : [];

                        llenarComboCsv('cboCliente', ovariables.listClientes, 0, 0)
                        llenarComboCsv('cboEstado', ovariables.listEstadoEnvio, 1, 0)
                        llenarComboCsv('cboFecha', ovariables.listTipoFecha, 0, 0)
                       

                    }
                }, (p) => { err(p); });
        }

        function obtenemosFecha() {

            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            let dateFin = new Date()
            let dateIni = new Date()
                dateIni.setMonth(dateFin.getMonth() - 3);
          
            _('txtfechadesde').value = retornarformatofecha(dateIni);
            _('txtfechahasta').value = retornarformatofecha(dateFin);
        }

        function retornarformatofecha(date){

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            let strfecha = '';

            day = day.length < 2 ? '0' + day : day;

            if (month < 10) {
                strfecha = `0${month}/${day}/${year}`;
            } else {
                strfecha = `${month}/${day}/${year}`;
            }

            return strfecha
        }

        function retornarFecha(strfecha) {

            let fecha = (strfecha).split("/");
            let anio = fecha[2];
            let mes = fecha[0].length < 2 ? '0' + fecha[0] : fecha[0];
            let dia = fecha[1].length < 2 ? '0' + fecha[1] : fecha[1];

            let codfecha = anio + mes + dia;

            return codfecha;
        }

        function llenarComboCsv(control, listCsv,flgTodos=0, flgSeleccione=0) {

            let optionTodos = flgTodos == 1 ?'<option value="">-----All-----</option>':'';
            let optionSeleccione = flgSeleccione == 1 ? '<option value="">-----Select-----</option>' : '';
            
            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>`}).join('');
            _(control).innerHTML = optionTodos + optionSeleccione + cbolist;
        }

        function buscarfacturas() {
            _('divInvoice').innerHTML = '';

            let err = function (__err) { console.log('err', __err) }
            let parametro = { 
                    codCliente: _('cboCliente').value !== '' ? _('cboCliente').value : 0,
                    codEstado: _('cboEstado').value !== '' ? _('cboEstado').value : 0,
                    tipoFecha: _('cboFecha').value !== '' ? _('cboFecha').value : 1,
                    fechaIni: retornarFecha(_('txtfechadesde').value),
                    fechaFin: retornarFecha(_('txtfechahasta').value),
                    exportacionExcel:'no'
            };

            ovariables.strFiltros = JSON.stringify(parametro);

            _Get('Facturacion/TesoreriaBol/GetListaInvoice_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? CSVtoJSON(resultado) : null;
                    if (rpta !== null) {
                        dibujarlista(rpta);
                        ovariables.listInvoice = rpta;                       
                       
                    }
                }, (p) => { err(p); });
        }

        // :excel
        function ExportarFacturas() {            
            let oparametro = JSON.parse(ovariables.strFiltros);
            oparametro.exportacionExcel = 'si';
            let urlaccion = '../Facturacion/TesoreriaBol/GetListaInvoice_Excel?par=' + JSON.stringify(oparametro);
            window.location.href = urlaccion;
        }

        function dibujarlista(data) {
            let tbody = '';
            const thead = `<thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Id Bol</th>
                                    <th>Date Bol</th>
                                    <th>Invoice</th>
                                    <th>Date Emision</th>

                                    <th>Amount</th>
                                    <th>PO</th>
                                    <th>Date send</th>
                                    <th>Status</th>
                                                              
                                </tr>
                            </thead>`;
            if (data.length > 0) {
                tbody = data.map(x => {
                    return `<tr>
                                <td class="text-left">${x.cliente}</td>
                                <td align="center">${x.idbol}</td>
                                <td align="center">${x.fechabol}</td>
                                <td align="center">${x.factura}</td>
                                <td align="center">${x.fechaemision}</td>

                                <td align="right">${x.monto}</td>
                                <td align="center">${x.po}</td>
                                <td align="center">${x.fechaenvio}</td>                                
                                <td align="center"><span class="label label-${x.icon}">${x.estado}</span></td>
                            </tr>`;
                }).join('');
            }

            let table = `<table class="table table-center table-striped table-hover" id="tbl_invoice">${thead}<tbody>${tbody}</tbody></table>`;
           
            _('divInvoice').innerHTML = table;

            fn_formattable();
        }

        function fn_labelstatus(status) {
            let html = ``;
            if (status === 'Pending') {
                html = `<span class="label label-warning">Pending</span>`;
            } else if (status === 'Rejected') {
                html = `<span class="label label-danger">Rejected</span>`;
            } else if (status === 'Approved') {
                html = `<span class="label label-success">Aceptado</span>`;
            }
            return html;
        } 

        function fn_formattable() {
            let table = $('#tbl_invoice').DataTable({
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
                order: [0, 'asc'],
                columnDefs: [
                    { targets: 'no-sort', orderable: false }
                ],
                ordering: true,
                drawCallback: function () {
                   
                    $("#tbl_invoice tbody tr").css("cursor", "pointer");
                    $("#tbl_invoice tbody tr").removeClass("row-selected");
                    $("#tbl_invoice tbody tr").click(function (e) {
                        if ($(this).hasClass("row-selected")) {
                            const par = $(this).data("par");
                            const id = _par(par, 'id');
                            const nombre = _par(par, 'nombre');
                            const idcliente = _par(par, 'idcliente');
                            const cliente = _par(par, 'cliente');
                            const temporada = _par(par, 'temporada');
                            const division = _par(par, 'division');
                            fn_viewstages(id, nombre, idcliente, cliente, temporada, division);
                        } else {
                            $("#tbl_invoice tbody tr").removeClass("row-selected");
                            $(this).addClass("row-selected");
                        }
                        e.stopImmediatePropagation();
                    });
                }
            });

            // Move paginate
            $("#tbl_invoice tfoot tr td").children().remove();
            $("#tbl_invoice_paginate").appendTo("#tbl_invoice tfoot tr td");            
            // Hide table general search
            $('#tbl_invoice_filter').hide();
            //// Filter by default
            //table.column(2).search($('#cboGroup').val()).draw();
            //table.column(9).search($('#cboEstado').val()).draw();

            //// Filter change
            //$('#cboGroup').on('change', function () {
            //    table.column(2).search($(this).val()).draw();
            //});
            //$('#cboEstado').on('change', function () {
            //    table.column(9).search($(this).val()).draw();
            //});

            // Change length
            $('.fullscreen-link').on('click', function () {
                let icon = $(this).children().eq(0).attr("class");
                if (icon === 'fa fa-compress') {
                    table.page.len(10).draw();
                } else {
                    table.page.len(4).draw();
                }
            });

            // Fix Padding
            $('#tbl_invoice_wrapper').css('padding-bottom', '0');

            // Add Overflow
            $("#tbl_invoice").parent().css("overflow-x", 'auto');
        }
      
        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
        }

)(document, 'panelEncabezado_TesoreriaIndex');
(
    function ini() {
        appTesoreriaIndex.load();
        appTesoreriaIndex.req_ini();
    }
)();
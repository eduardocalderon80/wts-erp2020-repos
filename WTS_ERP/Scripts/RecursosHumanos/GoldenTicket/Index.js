var appGoldenTicketIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            estados: [],
            obj_estados: [],
            lstsolicitudes: [],
            lstwts: [],
            lstmeses: [],
            lstsolicitudes_filter: [],            
            tabs: '',
            lsttopwts: [],
            lsttopgerentes: []
        }

        function load() {
            _initializeIboxTools();

            _('btnSearch').addEventListener('click', req_ini);
            _('btnNew').addEventListener('click', fn_new);
            _('btnReporte').addEventListener('click', fn_report);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('RecursosHumanos/GoldenTicket/GetAllData_GoldenTicket?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {

                        ovariables.esgerenteingreso = rpta[0].esgerenteingreso;
                        ovariables.esjefeingreso = rpta[0].esjefeingreso;
                        ovariables.tabs = rpta[0].tabs;

                        // Se guarda estados
                        ovariables.obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        ovariables.obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        // Ocultar btnNew (SOLO TEMPORAL HASTA QUE SE PERMITE REGISTRO A USUARIOS)
                        if (rpta[0].aux === 0) {
                            _('btnReporte').remove();
                        }

                        // Crea combo estado
                        let cboEstado = '<option value="">Todos</option>';
                        ovariables.obj_estados.forEach(x => {
                            cboEstado += `<option value ='${x.completo}'>${x.completo}</option>`;
                        });
                        _('cboEstado').innerHTML = cboEstado;

                        // Se crea tabla
                        ovariables.lstsolicitudes = rpta[0].lsttodos !== '' ? JSON.parse(rpta[0].lsttodos) : [];
                        ovariables.lstmeses = rpta[0].lstmeses !== '' ? JSON.parse(rpta[0].lstmeses) : [];

                        fn_creartabsfiltros();
                        // Validacion
                        ovariables.lstsolicitudes_filter = ovariables.lstsolicitudes.filter(x => x.idpersonal === parseInt(window.utilindex.idpersonal, 10));
                        ovariables.lstwts = rpta[0].lstwts !== '' ? JSON.parse(rpta[0].lstwts) : [];
                        _("ibox-graficobar").classList.add("hide");
                        _("ibox-graficopie").classList.add("hide");
                        fn_cargartodo("1", ovariables, ovariables.lstsolicitudes_filter);
                        //fn_creartabla(ovariables.lstsolicitudes);
                        //// Se crea chart
                        //fn_crearpiechart(obj_estados);
                        //fn_crearbarchart(ovariables.lstmeses);
                        $("#option_missolicitudes,#option_misjefes,#option_miscolaboradores,#option_todos").on('change', function () {
                            selectedtabs($(this).val(), ovariables.lstsolicitudes);
                        });
                    }
                }, (p) => { err(p); });
        }

        function fn_creartabsfiltros() {
            let tabs = ovariables.tabs;
            _("div_colaboradores").innerHTML = `<div class="form-group white-bg" style="margin-bottom:0px">
                            <div class="form-horizontal gray-bg">
                                <div data-toggle="buttons" class="btn-group text-center" style="margin-bottom:10px" id="divbotonesgrafico">
                                    ${tabs}                                     
                                </div>
                            </div>
                        </div>`;
        }

        function selectedtabs(tipo, lstsolicitudes) {
            if (tipo === '1') {
                ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.idpersonal === parseInt(window.utilindex.idpersonal, 10));
                _("ibox-graficobar").classList.add("hide");
                _("ibox-graficopie").classList.add("hide");
            } else if (tipo === '2') {
                if (ovariables.esgerentegeneralingreso === '1') {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '1' && x.esjefe === '0' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                } else {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '0' && x.esjefe === '1' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                }
                //ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '0' && x.esjefe === '1');
                _("ibox-graficobar").classList.remove("hide");
                _("ibox-graficopie").classList.remove("hide");
            } else if (tipo === '3') {
                ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10) && x.esjefe === '0');
                _("ibox-graficobar").classList.remove("hide");
                _("ibox-graficopie").classList.remove("hide");
            } else if (tipo === '4') {
                ovariables.lstsolicitudes_filter = ovariables.lstwts.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                _("ibox-graficobar").classList.remove("hide");
                _("ibox-graficopie").classList.remove("hide");
            }

            fn_cargartodo(tipo, ovariables, ovariables.lstsolicitudes_filter);

            //if (ovariables.lstsolicitudes_filter.length > 0) {
            //    console.log(ovariables.lstsolicitudes_filter);
            //}
        }

        function fn_cargartodo(tipo, vari, lstsolfilter) {
            let esjefe;
            if (lstsolfilter.length > 0) {
                esjefe = lstsolfilter[0].esjefe;
            }
            // Validacion EsJefe
            if (tipo === "4") {
                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);
            }
            else if (tipo === "3") {

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);

            } else if (tipo === "2") {

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);


            } else if (tipo === "1") {

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 0, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 0, lstsolfilter);
            }
        }

        function fn_creartabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_solicitudes" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="no-sort"></th>
                                <th class='text-center'>Fecha Solicitud</th>
                                <th class='text-center'>Fechas</th>
                                <th class='text-center'>Cantidad</th>
                                <th class='text-center'>Nombre</th>
                                <th class='text-center'>Cargo</th>
                                <th class='text-center'>Jefe Inmediato</th>
                                <th class='text-center'>Área</th>
                                <th class='text-center'>Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                data.forEach(x => {
                    htmlbody += `<tr>
                                    <td class="text-center">
                                        <div class="btn-group">
                                            <button class="btn btn-sm btn-outline btn-primary" onclick="appGoldenTicketIndex.fn_edit(${x.idsolicitud})">
                                                <span class="fa fa-pencil"></span> ${x.idsolicitud}
                                            </button>
                                        </div>
                                    </td>
                                    <td class='text-center'>${x.fechasolicitud}</td>
                                    <td class='text-center'>${fn_crear_fechas(0, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td class='text-center'>${fn_crear_fechas(1, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.nombrecargo}</td>
                                    <td>${x.nombrejefe}</td>
                                    <td>${x.nombrearea}</td>
                                    <td>${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                });
            }

            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="9"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_solicitudes').innerHTML = html;

            fn_formattable();
        }

        function fn_crear_fechas(type, json) {
            let html = '';
            if (json.length > 0) {
                let _json = JSON.parse(json);
                if (type === 0) {
                    html = _json.map(x => x.fecha).join('<br>');
                } else if (type === 1) {
                    html = _json.map(x => x.cantidad).reduce((a, b) => a + b);
                }
            }
            return html;
        }

        function fn_crearlabel(codigo) {
            let html = '';
            if (codigo === ovariables.estados.PORAPROBAR) {
                html = '<span class="label label-warning">Por Aprobar</span>';
            } else if (codigo === ovariables.estados.APROBADO) {
                html = '<span class="label label-primary">Aprobado</span>';
            } else if (codigo === ovariables.estados.CANCELADO) {
                html = '<span class="label label-default">Cancelado</span>';
            } else if (codigo === ovariables.estados.RECHAZADO) {
                html = '<span class="label label-danger">Rechazado</span>';
            }
            return html;
        }

        function fn_formattable() {
            var table = $('#tbl_solicitudes').DataTable({
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
                ordering: true
            });

            // Move paginate
            $("#tbl_solicitudes tfoot tr td").children().remove();
            $("#tbl_solicitudes_paginate").appendTo("#tbl_solicitudes tfoot tr td");

            // Custom Search
            $('#txtBuscar').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Hide table general search
            $('#tbl_solicitudes_filter').hide();

            // Filter change
            $('#cboEstado').on('change', function () {
                //console.log($(this).val());
                table.column(8).search($(this).val()).draw();
            });
        }

        function fn_crearpiechart(_json, esjefe, lstsolicfilter) {
            
            document.getElementById(`ibox-content-ibox-graficopie`).innerHTML = '<canvas id="doughnutChart" height="140"></canvas>'; 
            //crear le canvas con el piechar
            if (esjefe === 1) {

            } else {
                _("h5-ibox-graficopie").innerText = "Número de Solicitudes por Estado";
            }
            let estados = _json.map(x => x.completo);
            let color = _json.map(x => x.color);
            let codigo = _json.map(x => x.codigo);
            let datos = [];
            for (let i = 0; i < codigo.length; i++) {
                let cantidad = lstsolicfilter.filter(x => x.codigo === codigo[i]).length;
                datos.push(cantidad);
            }

            // Se crea pie chart
            let doughnutCanvas = document.getElementById('doughnutChart').getContext('2d');
            let doughnutChart = new Chart(doughnutCanvas, {
                type: 'pie',
                data: {
                    labels: estados,
                    datasets: [
                        {
                            data: datos,
                            backgroundColor: color
                        }
                    ]
                },
                options: {
                    segmentShowStroke: true,
                    segmentStrokeColor: "#fff",
                    segmentStrokeWidth: 2,
                    percentageInnerCutout: 45, // This is 0 for Pie charts
                    animationSteps: 100,
                    animationEasing: "easeOutBounce",
                    animateRotate: true,
                    animateScale: true,
                    responsive: true,
                }
            });
        }

        function fn_crearbarchart(_json, esjefe, lstsolicfilter) {
            //crear le canvas con el piechar
            document.getElementById(`ibox-content-ibox-graficobar`).innerHTML = '<canvas id="barChart" height="140"></canvas>'; 
            if (esjefe === 1) {
            } else {
                const date_year = new Date().getFullYear();
                _("h5-ibox-graficobar").innerText = "Días de Golden Tickets por Año (" + date_year +")";
            }
            const date_year = new Date().getFullYear();
            let meses = _json.map(x => x.Mes);
            let nromeses = _json.map(x => x.NroMes);
            let datos = [];
            //for (let i = 0; i < nromeses.length; i++) {
            //    let cantidad = lstsolicfilter.filter(x => (_strToDate(x.fechasolicitud + ' 0:00').getMonth() + 1) === nromeses[i]).length;
            //    datos.push(cantidad);
            //}
            nromeses.forEach(x => {
                let cantidad = 0;
                ovariables.lstsolicitudes_filter.forEach(y => {
                    const dias = y.fechas !== undefined ? JSON.parse(y.fechas) : [];
                    dias.forEach(z => {
                        const mes = _strToDate(`${z.fecha.substring(0, 10)} 0:00`);
                        if (mes.getMonth() + 1 === x && mes.getFullYear() === date_year) {
                            cantidad++;
                        }
                    });
                });
                datos.push(cantidad);
            });

            let max_value = Math.max(...datos) > 50 ? _censorFirst(Math.max(...datos).toString(), '0') * 2 : 50; 

            let barCanvas = document.getElementById('barChart').getContext('2d');
            let barChart = new Chart(barCanvas, {
                type: 'bar',
                data: {
                    labels: meses,
                    datasets: [
                        {
                            label: "",
                            backgroundColor: "rgba(26,179,148,0.5)",
                            borderColor: "rgba(26,179,148,0.8)",
                            borderWidth: 1,
                            data: datos
                        }
                    ]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                fontSize: 10
                            }
                        }],
                        yAxes: [{
                            display: true,
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                                max: max_value,
                                callback: function (value) {
                                    return (value).toFixed(0);
                                },
                            }
                        }]
                    },
                    //scaleBeginAtZero: true,
                    scaleBeginAtZero: true,
                    scaleShowGridLines: true,
                    scaleGridLineColor: "rgba(0,0,0,.05)",
                    scaleGridLineWidth: 1,
                    barShowStroke: true,
                    barStrokeWidth: 2,
                    barValueSpacing: 5,
                    barDatasetSpacing: 1,
                    responsive: true
                }
            });
        }

        function fn_ReporteSolicitud(_json) {
            let data = _json, html = '';
            html = `<table border="1">
                        <thead>                            
                            <tr>
<th x:autofilter="all" style="background-color: #000000; color: white;">Id Solicitud</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Solicitud</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fechas</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cantidad</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Nombre</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Cargo</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Jefe Inmediato</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Área</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;
            if (data.length > 0) {
                let aux = 0;
                data.forEach(x => {
                    if (aux === 0) {
                        aux++;
                        html += `<tr>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${x.idsolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${x.fechasolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${fn_crear_fechas(0, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${fn_crear_fechas(1, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td valign="vertical" style="background: #ffffff;">${x.nombrepersonal}</td>
                                    <td valign="vertical" style="background: #ffffff;">${x.nombrecargo}</td>
                                    <td valign="vertical" style="background: #ffffff;">${x.nombrejefe}</td>
                                    <td valign="vertical" style="background: #ffffff;">${x.nombrearea}</td>
                                    <td valign="vertical" style="background: #ffffff;">${fn_crearlabel(x.codigo)}</td>                                   
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${x.idsolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${x.fechasolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${fn_crear_fechas(0, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${fn_crear_fechas(1, ((x.fechas !== undefined) ? x.fechas : ''))}</td>
                                    <td valign="vertical" style="background: #d9d9d9;">${x.nombrepersonal}</td>
                                    <td valign="vertical" style="background: #d9d9d9;">${x.nombrecargo}</td>
                                    <td valign="vertical" style="background: #d9d9d9;">${x.nombrejefe}</td>
                                    <td valign="vertical" style="background: #d9d9d9;">${x.nombrearea}</td>
                                    <td valign="vertical" style="background: #d9d9d9;">${fn_crearlabel(x.codigo)}</td>    
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Golden Tickets',
                style: '',
                table: html,
                filename: 'Reporte Golden Tickets'
            });
        }

        function fn_report() {
            fn_ReporteSolicitud(ovariables.lstsolicitudes_filter);
        }

        function fn_new() {
            let urlAccion = 'RecursosHumanos/GoldenTicket/New';
            _Go_Url(urlAccion, urlAccion);
        }

        function fn_edit(_id) {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            let urlAccion = 'RecursosHumanos/GoldenTicket/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,id:' + _id);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_edit: fn_edit
        }
    }
)(document, 'panelEncabezado_GoldenTicketIndex');
(
    function ini() {
        appGoldenTicketIndex.load();
        appGoldenTicketIndex.req_ini();
    }
)();
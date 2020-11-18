var appDescansoMedicoIndex = (
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
            lsttop: [],
            lsttopjefes: [],
            lsttopwts:[],
            lsttopgerentes: []
        }

        function load() {
            _initializeIboxTools();

            _('btnSearch').addEventListener('click', req_ini);
            _('btnNew').addEventListener('click', fn_new);
            _('btnReporte').addEventListener('click', fn_report);

            $('#div_grafico_tabla').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });

            $(".gbar").click(function () {
                _("gbar").classList.remove("hide");
                _("gpie").classList.add("hide");
            });
            $(".gpie").click(function () {
                _("gpie").classList.remove("hide");
                _("gbar").classList.add("hide");
            });
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('RecursosHumanos/DescansoMedico/GetAllData_DescansoMedico?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {

                        ovariables.esgerenteingreso = rpta[0].esgerenteingreso;
                        ovariables.esjefeingreso = rpta[0].esjefeingreso;                        
                        ovariables.esgerentegeneralingreso = rpta[0].esgerentegeneralingreso;
                        ovariables.tabs = rpta[0].tabs;
                        // Se guarda estados
                        ovariables.obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        ovariables.obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        ovariables.lstsolicitudes = rpta[0].lsttodos !== '' ? JSON.parse(rpta[0].lsttodos) : [];
                        ovariables.lstwts = rpta[0].lstwts !== '' ? JSON.parse(rpta[0].lstwts) : [];
                        ovariables.lstmeses = rpta[0].lstmeses !== '' ? JSON.parse(rpta[0].lstmeses) : [];

                        // Ocultar btnNew (SOLO TEMPORAL HASTA QUE SE PERMITE REGISTRO A USUARIOS)
                        if (rpta[0].aux === 0) {
                            //_('btnNew').remove();
                            //_('btnReporte').remove();
                        }

                        // Crea combo estado
                        let cboEstado = '<option value="">Todos</option>';
                        ovariables.obj_estados.forEach(x => {
                            cboEstado += `<option value ='${x.completo}'>${x.completo}</option>`;
                        });
                        _('cboEstado').innerHTML = cboEstado;

                        ovariables.esjefe = rpta[0].esjefe !== '' ? rpta[0].esjefe : 0;

                        let objTop = rpta[0].lsttop !== '' ? JSON.parse(rpta[0].lsttop) : [];
                        ovariables.lsttop = objTop.filter(x => x.esgerente === '0' && x.esjefe === '0');
                        ovariables.lsttopjefes = objTop.filter(x => x.esgerente === '0' && x.esjefe === '1');
                        ovariables.lsttopgerentes = objTop.filter(x => x.esgerente === '1' && x.esjefe === '0' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));

                        ovariables.lsttopwts = rpta[0].lsttopwts !== '' ? JSON.parse(rpta[0].lsttopwts) : [];

                        fn_creartabsfiltros();
                        // Validacion
                        ovariables.lstsolicitudes_filter = ovariables.lstsolicitudes.filter(x => x.idpersonal === parseInt(window.utilindex.idpersonal, 10));
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

            } else if (tipo === '2') {
                if (ovariables.esgerentegeneralingreso === '1') {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '1' && x.esjefe === '0' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                } else {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '0' && x.esjefe === '1' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                }
                //ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '0' && x.esjefe === '1');

            } else if (tipo === '3') {
                ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10) && x.esjefe === '0');
            } else if (tipo === '4') {
                ovariables.lstsolicitudes_filter = ovariables.lstwts.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
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
                _("ibox-graficopie").classList.add("hide");
                _("ibox-graficobar").classList.add("hide");

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);
                // Para crear top 10               
                fn_creartop(vari.lsttopwts, 1);
            }
            else if (tipo === "3") {
                _("ibox-graficopie").classList.add("hide");
                _("ibox-graficobar").classList.add("hide");

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);
                // Para crear top 10               
                fn_creartop(vari.lsttop, 1);
            } else if (tipo === "2") {
                _("ibox-graficopie").classList.add("hide");
                _("ibox-graficobar").classList.add("hide");

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 1, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 1, lstsolfilter);
                // Para crear top 10     
                if (ovariables.esgerentegeneralingreso === '1') {
                    fn_creartop(vari.lsttopgerentes, 1);
                } else {
                    fn_creartop(vari.lsttopjefes, 1);
                }
                //fn_creartop(vari.lsttopjefes, 1);

            } else if (tipo === "1") {
                _("ibox-topten").classList.add("hide");
                _("ibox-todosgraficos").classList.add("hide");

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 0, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 0, lstsolfilter);
                _('title_grafico_tabla').innerHTML = 'Cantidad de vacaciones por mes (Últimos 6 meses).';
            }
        }

        function fn_creartop(_json, esjefe) {
            _("ibox-topten").classList.remove("hide");
            _('title_grafico_tabla').innerHTML = 'Dias de Descansos Medicos acumulados por colaborador';

            let data = _json, htmlbody = '', count = 0;
            if (data.length > 0) {
                data.forEach(x => {
                    count++;
                    htmlbody += `<tr>
                                    <td class="text-center">${count}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td class="text-center">${fn_crearlabeltop(parseInt(x.totaldescansomedico))}</td>
                                </tr>`;
                });
            }
            _('tbody_top').innerHTML = htmlbody;
        }

        function fn_crearlabeltop(cantidad) {
            let label = '';
            if (cantidad > 0 && cantidad < 10) {
                label = `<span class=" ">${cantidad}</span>`
            } else if (cantidad >= 10 && cantidad < 15) {
                label = `<span class=" ">${cantidad}</span>`
            } else if (cantidad >= 15) {
                label = `<span class=" ">${cantidad}</span>`;
            }
            return label;
        }

        function fn_creartabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_solicitudes" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class='text-center no-sort'></th>
                                <th class='text-center'>Fecha Solicitud</th>
                                <th class='text-center'>Fecha Inicio</th>
                                <th class='text-center'>Fecha Fin</th>
                                <th class='text-center'>Días Solicitados</th>
                                <th class='text-center'>Días Acumulados<br>de SubSidio</th>
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
                                            <button class="btn btn-sm btn-outline btn-primary" onclick="appDescansoMedicoIndex.fn_edit(${x.idsolicitud})">
                                                <span class="fa fa-pencil"></span> ${x.idsolicitud}
                                            </button>
                                        </div>
                                    </td>
                                    <td class='text-center'>${x.fechasolicitud}</td>
                                    <td class='text-center'>${x.fechainicio}</td>
                                    <td class='text-center'>${x.fechafin}</td>
                                    <td class='text-center'>${x.cantidaddiasdescansomedico}</td>
                                    <td class='text-center'>${x.diasacumuladossubsidio }</td>
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
                                <td colspan="11"></td>
                            </tr>
                        </tfoot>`;

            html += htmlbody + '</tbody>' + tfoot + '</table>';
            _('div_tbl_solicitudes').innerHTML = html;

            fn_formattable();
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
            let namefile = 'Reporte_DescansoMedico_' + new Date().getDate().toString() + (new Date().getMonth() + 1).toString() + new Date().getFullYear().toString();
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
                //dom: '<"html5buttons"B>lTfgitp',
                //buttons: [
                //    { extend: 'csv' },
                //    { extend: 'excel', title: namefile, className: 'btn btn-primary' },
                //    { extend: 'pdf', title: namefile, orientation: 'landscape', pageSize: 'LEGAL', className: 'btn btn-danger' }
                //],
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
                table.column(9).search($(this).val()).draw();
            });
        }

        function fn_crearpiechart(_json, esjefe, lstsolicfilter) {
            //crear le canvas con el piechar
            document.getElementById(`gpie`).innerHTML = '<canvas id="doughnutChartJefe" height="140"></canvas>';
            document.getElementById(`ibox-content-ibox-graficopie`).innerHTML = '<canvas id="doughnutChart" height="140"></canvas>'; 
            if (esjefe === 1) {
                _("ibox-todosgraficos").classList.remove("hide");
                _("ibox-graficopie").classList.add("hide");
            } else {
                _("ibox-graficopie").classList.remove("hide");
                _("h5-ibox-graficopie").innerText = "Número de Solicitudes por estado";
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
            let doughnutCanvas = document.getElementById(`doughnutChart${(esjefe === 1) ? 'Jefe' : ''}`).getContext('2d');
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
            document.getElementById(`gbar`).innerHTML = '<canvas id="barChartJefe" height="140"></canvas>';
            document.getElementById(`ibox-content-ibox-graficobar`).innerHTML = '<canvas id="barChart" height="140"></canvas>'; 
            if (esjefe === 1) {
                _("ibox-graficobar").classList.add("hide");
            } else {
                _("ibox-graficobar").classList.remove("hide");
                const date_year = new Date().getFullYear();
                _("h5-ibox-graficobar").innerText = "Días de Descanso Medico por Año (" + date_year + ")";

                // Para año solo
                $(".actual_year").html(`(${date_year})`);
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
                    const dias = _getDatesBetween(_strToDate(`${y.fechainicio} 0:00`), _strToDate(`${y.fechafin} 0:00`));
                    dias.forEach(z => {
                        if (z.getMonth() + 1 === x && z.getFullYear() === date_year) {
                            cantidad++;
                            if (x === 9) {
                                //console.log(cantidad);
                            }
                        }
                    });
                });
                datos.push(cantidad);
            });

            let max_value = Math.max(...datos) > 50 ? _censorFirst(Math.max(...datos).toString(), '0') * 2 : 50; 

            let barCanvas = document.getElementById(`barChart${(esjefe === 1) ? 'Jefe' : ''}`).getContext('2d');
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
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Inicio</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Fin</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Días Solicitados</th>
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
                                    <td align="center" style="background: #ffffff;">${x.idsolicitud}</td>
                                    <td align="center" style="background: #ffffff;">${x.fechasolicitud}</td>
                                    <td align="center" style="background: #ffffff;">${x.fechainicio}</td>
                                    <td align="left" style="background: #ffffff;">${x.fechafin}</td>
                                    <td align="left" style="background: #ffffff;">${x.cantidaddiasdescansomedico}</td>
                                    <td align="left" style="background: #ffffff;">${x.nombrepersonal}</td>
                                    <td align="left" style="background: #ffffff;">${x.nombrecargo}</td>
                                    <td align="left" style="background: #ffffff;">${x.nombrejefe}</td>   
                                    <td align="left" style="background: #ffffff;">${x.nombrearea}</td>
                                    <td align="left" style="background: #ffffff;">${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr>
                                    <td align="center" style="background: #d9d9d9;">${x.idsolicitud}</td>
                                    <td align="center" style="background: #d9d9d9;">${x.fechasolicitud}</td>
                                    <td align="center" style="background: #d9d9d9;">${x.fechainicio}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.fechafin}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.cantidaddiasdescansomedico}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.nombrepersonal}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.nombrecargo}</td>
                                    <td align="left" style="background: #d9d9d9;">${x.nombrejefe}</td>   
                                    <td align="left" style="background: #d9d9d9;">${x.nombrearea}</td>
                                    <td align="left" style="background: #d9d9d9;">${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Descanso Medico',
                style: '',
                table: html,
                filename: 'Reporte Descanso Medico'
            });
        }

        function fn_report() {
            fn_ReporteSolicitud(ovariables.lstsolicitudes_filter);
        }

        function fn_new() {
            let urlAccion = 'RecursosHumanos/DescansoMedico/New';
            _Go_Url(urlAccion, urlAccion);
        }

        function fn_edit(_id) {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            let urlAccion = 'RecursosHumanos/DescansoMedico/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,id:' + _id);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_edit: fn_edit
        }
    }
)(document, 'panelEncabezado_DescansoMedicoIndex');
(
    function ini() {
        appDescansoMedicoIndex.load();
        appDescansoMedicoIndex.req_ini();
    }
)();
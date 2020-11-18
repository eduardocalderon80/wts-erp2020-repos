var appVacacionesIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            esjefe: '',
            estados: [],
            obj_estados: [],
            lstsolicitudes: [],
            lstwts: [],
            lstmeses: [],
            lsttop: [],
            lsttopwts: [],
            totalvacaciones: 0,
            totalvacacionesusadas: 0,
            nombrepersonal: '',
            fechaincorporacion: '',
            configuracionvacaciones: [],
            configuracionvacaciones_vacacionesporanio: 0,
            configuracionvacaciones_diasporanio: 0,
            configuracionvacaciones_diaspormes: 0,
            lstsolicitudes_filter: [],
            lstsolicitudes_filter_gantt: [],
            lstgerentes: [],
            esgerentegeneralingreso: '',
            esgerenteingreso: '',
            esjefeingreso: '',
            tabs: '',
            lsttopjefes: [],
            lsttopgerentes: [],
            chartgantt: am4core.create("chart_gantt", am4charts.XYChart),
            datagantt: []
        }

        function load() {
            _initializeIboxTools();

            _('btnSearch').addEventListener('click', req_ini);
            _('btnNew').addEventListener('click', fn_new);
            _('btnCalc').addEventListener('click', fn_calcular);
            _('btnReporte').addEventListener('click', fn_report);

            $('#div_grafico_tabla').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });

            $.fn.datepicker.dates['es'] = {
                days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                today: "Hoy",
                clear: "Limpiar",
                format: "dd/mm/yyyy"
            };

            $('#txtFechaInicioCalcular').datepicker({
                autoclose: true,
                //clearBtn: true,
                todayHighlight: true,
                language: "es",
                daysOfWeekDisabled: [0, 6],
                weekStart: 1,
                multidate: false
            }).on('changeDate', function (e) {
                let fechaevaluar = e.date;

                //let fechaincorporacion = new Date(parseInt(ovariables.fechaincorporacion.split('/')[2], 10), parseInt(ovariables.fechaincorporacion.split('/')[1], 10) - 1, parseInt(ovariables.fechaincorporacion.split('/')[0]));
                //let diastrabajados = parseFloat(moment(fechaevaluar).diff(fechaincorporacion, 'days')).toFixed(2);
                //let diasvacaciones = parseFloat((moment(fechaevaluar).diff(fechaincorporacion, 'days') * ovariables.configuracionvacaciones_diaspormes) / ovariables.configuracionvacaciones_diasporanio).toFixed(2);
                //diasvacaciones = diasvacaciones - ovariables.totalvacacionesusadas;
                //let conversionexacta = Math.round(parseFloat((diasvacaciones * ovariables.configuracionvacaciones_vacacionesporanio) / ovariables.configuracionvacaciones_diaspormes).toFixed(2));


                fn_totalvacacionesfuturas(e.date.getDate().toString() + '/' + (e.date.getMonth() + 1).toString() + '/' + e.date.getFullYear().toString());
            })
                .next().on('click', function (e) {
                    $(this).prev().focus();
                });

            $("#txtFechaInicioCalcular").datepicker("setStartDate", moment(new Date()).add(1, 'days').toDate());

            $("#modal_calcular").on("shown.bs.modal", function () {
                $("#lblsaldoactual").text($("#lblSaldoVacaciones").text());
            });

            $(".gbar").click(function () {
                _("gbar").classList.remove("hide");
                _("gpie").classList.add("hide");
            });
            $(".gpie").click(function () {
                _("gpie").classList.remove("hide");
                _("gbar").classList.add("hide");
            });

            fn_creargantt4(ovariables.datagantt);
        }

        function fn_creargantt4(objamchart) {
            ////_('chart_gantt').innerHTML = '';
            //let chart = am4core.create("chart_gantt", am4charts.XYChart)
            //// creacion del chart gantt

            //am4core.useTheme(am4themes_animated);
            //// Themes end
            //chart.language.locale = am4lang_es_ES;
            //chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            //chart.paddingRight = 30;
            //chart.dateFormatter.inputDateFormat = "dd/MM/yyyy HH:mm";

            //let colorSet = new am4core.ColorSet();
            //colorSet.saturation = 0.4;

            //chart.data = objamchart;

            //chart.dateFormatter.dateFormat = "dd/MM/yyyy";
            //chart.dateFormatter.inputDateFormat = "dd/MM/yyyy";

            //let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            //categoryAxis.renderer.minGridDistance = 70;
            //categoryAxis.dataFields.category = "nombre";
            //categoryAxis.renderer.grid.template.location = 0;
            //categoryAxis.renderer.inversed = true;
            ////categoryAxis.fontSize = 9;

            //let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            ////dateAxis.renderer.minGridDistance = 70;
            //dateAxis.baseInterval = { count: 3, timeUnit: "day" };            
            //dateAxis.renderer.tooltipLocation = 0;
            ////dateAxis.fontSize =9;

            //let series1 = chart.series.push(new am4charts.ColumnSeries());
            //series1.columns.template.height = am4core.percent(70);
            ////series1.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";
            //series1.columns.template.tooltipHTML = '{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]';
            //    //`<div><center><strong><p style="color:#ffffff!important;text-transform:uppercase;">{task}</p></strong></center>                
            //    //<table border='0' cellspacing='1' cellspadding='1'>
            //    //<tr>
            //    //  <th style="text-align:left;color:#ffffff!important">Inicio:&nbsp;&nbsp;</th>
            //    //  <td style="color:#ffffff!important; font-size:11pt"> {openDateX}</td>
            //    //</tr>
            //    //<tr>
            //    //  <th style="text-align:left;color:#ffffff!important">Fin:&nbsp;&nbsp;</th>
            //    //  <td style="color:#ffffff!important; font-size:11pt"> {dateX}</td>
            //    //</tr>                
            //    //</table></div>
            //    //`;

            //series1.dataFields.openDateX = "start";
            //series1.dataFields.dateX = "end";
            //series1.dataFields.categoryY = "nombre";
            //series1.columns.template.propertyFields.fill = "color"; // get color from data
            //series1.columns.template.propertyFields.stroke = "color";
            //series1.columns.template.strokeOpacity = 1;

            //chart.scrollbarX = new am4core.Scrollbar();
            //chart.cursor = new am4charts.XYCursor();
            ////chart.scrollbarY = new am4core.Scrollbar();

            ////let _cellSize = 20;
            ////chart.events.on("datavalidated", function (ev) {
            ////    if (objamchart.length > 0) {
            ////        // Get objects of interest
            ////        let chart = ev.target;

            ////        let categoryAxis = chart.yAxes.getIndex(0);
            ////        let filteredCategories = [];
            ////        chart.data.forEach(category => {
            ////            if (!filteredCategories.find(cat => cat.nombre == category.nombre)) {
            ////                filteredCategories.push(category.nombre);
            ////            }
            ////        });

            ////        // Calculate how we need to adjust chart height
            ////        let adjustHeight = ([...new Set(filteredCategories)].length+4) * _cellSize - categoryAxis.pixelHeight;

            ////        // get current chart height                    
            ////        let targetHeight = chart.pixelHeight + adjustHeight;

            ////        // Set it on chart's container
            ////        chart.svgContainer.htmlElement.style.height = targetHeight + "px";

            ////    }
            ////});


            am4core.useTheme(am4themes_animated)
            let chart = am4core.create("chart_gantt", am4charts.XYChart)
            chart.language.locale = am4lang_es_ES;
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.paddingRight = 30;
            chart.dateFormatter.inputDateFormat = "dd/MM/yyyy HH:mm";

            var colorSet = new am4core.ColorSet();
            colorSet.saturation = 0.4;

            chart.data = objamchart;

            chart.dateFormatter.dateFormat = "dd/MM/yyyy";
            chart.dateFormatter.inputDateFormat = "dd/MM/yyyy";

            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "nombre";
            categoryAxis.renderer.minGridDistance = 50;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.inversed = true;

            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 20;
            dateAxis.baseInterval = { count: 3, timeUnit: "day" };
            // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
            //dateAxis.strictMinMax = true;
            dateAxis.renderer.tooltipLocation = 0;

            var series1 = chart.series.push(new am4charts.ColumnSeries());
            series1.columns.template.height = am4core.percent(70);
            series1.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

            series1.dataFields.openDateX = "start";
            series1.dataFields.dateX = "end";
            series1.dataFields.categoryY = "nombre";
            series1.columns.template.propertyFields.fill = "color"; // get color from data
            series1.columns.template.propertyFields.stroke = "color";
            series1.columns.template.strokeOpacity = 1;

            chart.scrollbarX = new am4core.Scrollbar();
        }

        function fn_creargantt3(objamchart) {
            AmCharts.addInitHandler(function (chart) {
                // set base values
                let categoryWidth = 30;

                // calculate bottom margin based on number of data points
                let chartHeight = (categoryWidth * chart.dataProvider.length) + 60;

                // set the value
                chart.div.style.height = chartHeight + 'px';

            }, ['gantt']);

            if (objamchart.length > 0) {
                // Add css
                _('chart_gantt').style = 'width: 100%; max-height:500px!important';

                var chart = AmCharts.makeChart("chart_gantt", {
                    "type": "gantt",
                    "theme": "none",
                    "marginRight": 70,
                    "period": "DD",
                    "dataDateFormat": "YYYY-MM-DD",
                    "columnWidth": 0.5,
                    "valueAxis": {
                        "type": "date"
                    },
                    "brightnessStep": 7,
                    "graph": {
                        "fillAlphas": 1,
                        "lineAlpha": 1,
                        "lineColor": "#fff",
                        "fillAlphas": 0.85,
                        "balloonText": "<b>[[task]]</b>:<br />[[open]] -- [[value]]"
                    },
                    "rotate": true,
                    "categoryField": "category",
                    "segmentsField": "segments",
                    "colorField": "color",
                    "startDateField": "start",
                    "endDateField": "end",
                    "dataProvider": objamchart,
                    "valueScrollbar": {
                        "autoGridCount": true
                    },
                    "chartCursor": {
                        "cursorColor": "#1ab394",
                        "valueBalloonsEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.5,
                        "valueLineBalloonEnabled": true,
                        "valueLineEnabled": true,
                        "zoomable": false,
                        "valueZoomable": true
                    },
                    "export": {
                        "enabled": false
                    }
                });
            } else {
                // Delete css
                _('chart_gantt').style = '';
                _('chart_gantt').innerHTML = '<p class="text-center">No se encontraron Solicitudes Aprobadas</p>';
            }
        }

        function fn_calcular() {
            $("#modal_calcular").modal("show");
        }

        function fn_totalvacacionesfuturas(dia) {
            let redondeo;
            if (dia !== "") {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { fecha: dia };
                _Get('RecursosHumanos/Vacaciones/GetAllData_FechasFuturas?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        rpta = resultado !== '' ? JSON.parse(resultado) : [];
                        redondeo = rpta[0].redondeo;
                        _("lblsaldocalculado").innerText = redondeo;
                    }, (p) => { err(p); });

            } else {
                _("lblsaldocalculado").innerText = "";
            }
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

                if (ovariables.esgerenteingreso === '1') {
                    _("h5_gantt").innerText = "Itinerario de vacaciones programadas";
                    _('div_gantt').classList.remove("hide");
                    ovariables.lstsolicitudes_filter_gantt = ovariables.lstgerentes.filter(x => x.esgerente === '1' && x.esjefe === '0' && (x.codigo === 'APR' || x.codigo === 'PAP'));
                    fn_creategantt(ovariables.lstsolicitudes_filter_gantt);
                }
                //else if (ovariables.esjefeingreso === '1') {
                //    _("h5_gantt").innerText = "Itinerario de vacaciones programadas con mis pares"
                //    _('div_gantt').classList.remove("hide");
                //    ovariables.lstsolicitudes_filter_gantt = ovariables.lstgerentes.filter(x => x.esgerente === '1' && x.esjefe === '0' && (x.codigo === 'APR' || x.codigo === 'PAP'));
                //    fn_creategantt(ovariables.lstsolicitudes_filter_gantt);
                //}
                else {
                    _('div_gantt').classList.add("hide");
                    fn_creategantt([]);
                }
            } else if (tipo === '2') {
                if (ovariables.esgerentegeneralingreso === '1') {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '1' && x.esjefe === '0' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                } else {
                    ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.esgerente === '0' && x.esjefe === '1' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                }

                // Cargar gantt
                _('div_gantt').classList.remove("hide");
                fn_creategantt([]);
            } else if (tipo === '3') {
                ovariables.lstsolicitudes_filter = lstsolicitudes.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10) && x.esjefe === '0');
                // Cargar gantt
                _('div_gantt').classList.remove("hide");
                fn_creategantt([]);
            } else if (tipo === '4') {
                ovariables.lstsolicitudes_filter = ovariables.lstwts.filter(x => x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));
                // Cargar gantt
                _('div_gantt').classList.remove("hide");
                fn_creategantt([]);
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

            } else if (tipo === "1") {
                _("ibox-topten").classList.add("hide");
                _("ibox-todosgraficos").classList.add("hide");

                fn_creartabla(lstsolfilter);
                fn_crearpiechart(vari.obj_estados, 0, lstsolfilter);
                fn_crearbarchart(vari.lstmeses, 0, lstsolfilter);
                _('title_grafico_tabla').innerHTML = 'Cantidad de vacaciones por mes (Últimos 6 meses).';
            }
        }

        function req_ini() {
            debugger;
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('RecursosHumanos/Vacaciones/GetAllData_Vacaciones?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        // Se guarda estados
                        ovariables.nombrepersonal = rpta[0].nombrepersonal !== '' ? rpta[0].nombrepersonal : '';
                        ovariables.fechaincorporacion = rpta[0].fechaincorporacion !== '' ? rpta[0].fechaincorporacion : '';
                        ovariables.configuracionvacaciones = rpta[0].configuracionvacaciones !== '' ? JSON.parse(rpta[0].configuracionvacaciones) : [];
                        ovariables.totalvacaciones = rpta[0].totalvacaciones !== '' ? rpta[0].totalvacaciones : 0;
                        ovariables.totalvacacionesusadas = rpta[0].totalvacacionesusadas !== '' ? rpta[0].totalvacacionesusadas : 0;
                        ovariables.esjefe = rpta[0].esjefe;
                        ovariables.esgerentegeneralingreso = rpta[0].esgerentegeneralingreso;
                        ovariables.esgerenteingreso = rpta[0].esgerenteingreso;
                        ovariables.esjefeingreso = rpta[0].esjefeingreso;
                        ovariables.tabs = rpta[0].tabs;

                        ovariables.obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];
                        let json_estados = {};
                        ovariables.obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });
                        ovariables.estados = json_estados;

                        // Crea combo estado
                        let cboEstado = '<option value="">Todos</option>';
                        ovariables.obj_estados.forEach(x => {
                            cboEstado += `<option value ='${x.completo}'>${x.completo}</option>`;
                        });
                        _('cboEstado').innerHTML = cboEstado;

                        //cargar variables de configuracion de vacaciones
                        ovariables.configuracionvacaciones_vacacionesporanio = ovariables.configuracionvacaciones.vacaciones_por_anio;
                        ovariables.configuracionvacaciones_diasporanio = ovariables.configuracionvacaciones.dias_por_anio;
                        ovariables.configuracionvacaciones_diaspormes = ovariables.configuracionvacaciones.dias_por_mes;

                        ovariables.lstgerentes = rpta[0].lstgerentes !== '' ? JSON.parse(rpta[0].lstgerentes) : [];
                        ovariables.lstsolicitudes = rpta[0].lsttodos !== '' ? JSON.parse(rpta[0].lsttodos) : [];
                        ovariables.lstwts = rpta[0].lstwts !== '' ? JSON.parse(rpta[0].lstwts) : [];
                        ovariables.saldovacaciones = rpta[0].saldovacaciones !== '' ? parseInt(rpta[0].saldovacaciones, 10) : 0;

                        _('lblSaldoVacaciones').textContent = ovariables.totalvacaciones;
                        _('fecha_hoy').textContent = _getDate103();

                        ovariables.lstmeses = rpta[0].lstmeses !== '' ? JSON.parse(rpta[0].lstmeses) : [];

                        _("lblPersonal").innerText = ovariables.nombrepersonal;

                        let objTop = rpta[0].lsttop !== '' ? JSON.parse(rpta[0].lsttop) : [];
                        ovariables.lsttop = objTop.filter(x => x.esgerente === '0' && x.esjefe === '0');
                        ovariables.lsttopjefes = objTop.filter(x => x.esgerente === '0' && x.esjefe === '1');
                        ovariables.lsttopgerentes = objTop.filter(x => x.esgerente === '1' && x.esjefe === '0' && x.idpersonal !== parseInt(window.utilindex.idpersonal, 10));

                        ovariables.lsttopwts = rpta[0].lsttopwts !== '' ? JSON.parse(rpta[0].lsttopwts) : [];

                        fn_creartabsfiltros();

                        // Validacion                        
                        ovariables.lstsolicitudes_filter = ovariables.lstsolicitudes.filter(x => x.idpersonal === parseInt(window.utilindex.idpersonal, 10));

                        selectedtabs("1", ovariables.lstsolicitudes)
                        //fn_cargartodo("1", ovariables, ovariables.lstsolicitudes_filter);

                        //if (ovariables.esjefe === 1) {
                        //    fn_creartabla(ovariables.lstsolicitudes);
                        //    fn_crearpiechart(ovariables.obj_estados, ovariables.esjefe);
                        //    fn_crearbarchart(ovariables.lstmeses, ovariables.esjefe);
                        //    // Para crear top 10

                        //    fn_creartop(ovariables.lsttop, ovariables.esjefe);

                        //    _("div_colaboradores").innerHTML = `<div class="form-group white-bg" style="margin-bottom:0px">
                        //        <div class="form-horizontal gray-bg">
                        //            <div data-toggle="buttons" class="btn-group text-center" style="margin-bottom:10px" id="divbotonesgrafico">
                        //                <span class="btn btn-sm btn-white gbar active"><i class="fa fa-user"></i> <input type="radio" id="option_missolicitudes" name="_options" value="1"> Mis Solicitudes </span>
                        //                <span class="btn btn-sm btn-white gpie"><i class="fa fa-users"></i> <input type="radio" id="option_misjefes" name="_options" value="2"> Mis Jefes </span>
                        //                <span class="btn btn-sm btn-white gpie"><i class="fa fa-users"></i> <input type="radio" id="option_miscolaboradores" name="_options" value="3"> Mis Colaboradores </span>
                        //            </div>
                        //        </div>
                        //    </div>`;



                        //} else {
                        //    fn_creartabla(ovariables.lstsolicitudes);
                        //    fn_crearpiechart(ovariables.obj_estados, ovariables.esjefe);
                        //    fn_crearbarchart(ovariables.lstmeses, ovariables.esjefe);

                        //    _('title_grafico_tabla').innerHTML = 'Cantidad de vacaciones por mes (Últimos 6 meses).';
                        //}

                        $("#option_missolicitudes,#option_misjefes,#option_miscolaboradores,#option_todos").on('change', function () {
                            selectedtabs($(this).val(), ovariables.lstsolicitudes);
                        });
                    }
                }, (p) => { err(p); });
        }

        function fn_creartop(_json, esjefe) {
            // Titulo

            _("ibox-topten").classList.remove("hide");
            _('title_grafico_tabla').innerHTML = 'Dias de Vacaciones acumuladas por colaborador';

            let data = _json, htmlbody = '', count = 0;
            if (data.length > 0) {
                data.forEach(x => {
                    count++;
                    htmlbody += `<tr>
                                    <td class="text-center">${count}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td class="text-center">${fn_crearlabeltop(parseInt(x.totalvacaciones))}</td>
                                </tr>`;
                });
            }
            _('tbody_top').innerHTML = htmlbody;
            _("ibox-topten").height = _("ibox-todosgraficos").height;

        }

        function fn_crearlabeltop(cantidad) {
            let label = '';
            if (cantidad > 0 && cantidad < 10) {
                label = `<span class="label label-primary">${cantidad}</span>`
            } else if (cantidad >= 10 && cantidad < 15) {
                label = `<span class="label label-warning">${cantidad}</span>`
            } else if (cantidad >= 15) {
                label = `<span class="label label-danger">${cantidad}</span>`;
            }
            return label;
        }

        function fn_creartabla(_json) {
            let data = _json, html = '', htmlbody = '';
            html = `<table id="tbl_solicitudes" class="table table-striped table-bordered table-hover dataTable">
                        <thead>
                            <tr>
                                <th class="no-sort"></th>                                
                                <th class='text-center'>Fecha Solicitud</th>
                                <th class='text-center'>Fecha Inicio</th>
                                <th class='text-center'>Fecha Fin</th>
                                <th class='text-center'>Dias Solicitados</th>
                                <th class='text-center'>Nombre</th>
                                <th class='text-center'>Cargo</th>
                                <th class='text-center'>Jefe Inmediato</th>
                                <th class='text-center'>Área</th>
                                <th class='text-center'>Estado</th>
                            </tr>
                        </thead>
                        <tbody>`;
            //<th class='text-center'>Saldo Dias</th>
            if (data.length > 0) {
                data.forEach(x => {
                    let arrfechassueltas = x.fechas.split(',');
                    let fechassueltasmap;
                    let objresultado_fechassueltas = [];

                    if (x.fechas !== '' && x.fechas !== undefined) {
                        fechassueltasmap = arrfechassueltas.map((fecha) => {
                            let objfechassueltas = { fechainicio: '', fechafin: '' };
                            objfechassueltas.fechainicio = fecha;
                            objfechassueltas.fechafin = fecha;
                            objresultado_fechassueltas.push(objfechassueltas);
                        });
                    }

                    //<td>${(x.fechainicio !== undefined) ? x.fechainicio :''}</td>
                    //<td>${(x.fechafin !== undefined) ? x.fechafin : ''}</td>  

                    let fechainicio = objresultado_fechassueltas.map((y) => { return $.trim(y.fechainicio) }).join('<br/>');
                    let fechafin = objresultado_fechassueltas.map((y) => { return $.trim(y.fechafin) }).join('<br/>');
                    htmlbody += `<tr>
                                    <td class ="text-center">
                                        <div class="btn-group">
                                            <button class="btn btn-sm btn-outline btn-primary" onclick="appVacacionesIndex.fn_edit(${x.idsolicitud})">
                                                <span class="fa fa-pencil"></span> ${x.idsolicitud}
                                            </button>
                                        </div>
                                    </td>                                    
                                    <td class='text-center'>${x.fechasolicitud}</td>
                                    <td class='text-center'>${(x.fechainicio !== undefined && x.fechainicio !== '01/01/1900') ? x.fechainicio : fechainicio}</td>
                                    <td class='text-center'>${(x.fechafin !== undefined && x.fechafin !== '01/01/1900') ? x.fechafin : fechafin}</td>
                                    <td class='text-center'>${x.cantidaddias}</td>
                                    <td>${x.nombrepersonal}</td>
                                    <td>${x.nombrecargo}</td>
                                    <td>${x.nombrejefe}</td>
                                    <td>${x.nombrearea}</td>
                                    <td>${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                });
            }
            //<td class='text-center'>${x.totalvacaciones}</td>
            let tfoot = `<tfoot>
                            <tr>
                                <td colspan="10"></td>
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

        function fn_ReporteSolicitud(_json) {
            let data = _json, html = '';
            html = `<table border="1">
                        <thead>                            
                            <tr>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Id Solicitud</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Solicitud</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Inicio</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Fecha Fin</th>
                                <th x:autofilter="all" style="background-color: #000000; color: white;">Dias Solicitados</th>
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

                    let arrfechassueltas = x.fechas.split(',');
                    let fechassueltasmap;
                    let objresultado_fechassueltas = [];

                    if (x.fechas !== '' && x.fechas !== undefined) {
                        fechassueltasmap = arrfechassueltas.map((fecha) => {
                            let objfechassueltas = { fechainicio: '', fechafin: '' };
                            objfechassueltas.fechainicio = fecha;
                            objfechassueltas.fechafin = fecha;
                            objresultado_fechassueltas.push(objfechassueltas);
                        });
                    }

                    let fechainicio = objresultado_fechassueltas.map((y) => { return $.trim(y.fechainicio) }).join('<br/>');
                    let fechafin = objresultado_fechassueltas.map((y) => { return $.trim(y.fechafin) }).join('<br/>');

                    if (aux === 0) {
                        aux++;
                        html += `<tr>                                   
                                    <td valign="vertical" align="center" style="background: #ffffff;">${x.idsolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${x.fechasolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${(x.fechainicio !== undefined && x.fechainicio !== '01/01/1900') ? x.fechainicio : fechainicio}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${(x.fechafin !== undefined && x.fechafin !== '01/01/1900') ? x.fechafin : fechafin}</td>
                                    <td valign="vertical" align="center" style="background: #ffffff;">${x.cantidaddias}</td>
                                    <td valign="vertical" align="left" style="background: #ffffff;">${x.nombrepersonal}</td>
                                    <td valign="vertical" align="left" style="background: #ffffff;">${x.nombrecargo}</td>
                                    <td valign="vertical" align="left" style="background: #ffffff;">${x.nombrejefe}</td>
                                    <td valign="vertical" align="left" style="background: #ffffff;">${x.nombrearea}</td>
                                    <td valign="vertical" align="left" style="background: #ffffff;">${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                    } else {
                        aux = 0;
                        html += `<tr> 
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${x.idsolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${x.fechasolicitud}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${(x.fechainicio !== undefined && x.fechainicio !== '01/01/1900') ? x.fechainicio : fechainicio}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${(x.fechafin !== undefined && x.fechafin !== '01/01/1900') ? x.fechafin : fechafin}</td>
                                    <td valign="vertical" align="center" style="background: #d9d9d9;">${x.cantidaddias}</td>
                                    <td valign="vertical" align="left" style="background: #d9d9d9;">${x.nombrepersonal}</td>
                                    <td valign="vertical" align="left" style="background: #d9d9d9;">${x.nombrecargo}</td>
                                    <td valign="vertical" align="left" style="background: #d9d9d9;">${x.nombrejefe}</td>
                                    <td valign="vertical" align="left" style="background: #d9d9d9;">${x.nombrearea}</td>
                                    <td valign="vertical" align="left" style="background: #d9d9d9;">${fn_crearlabel(x.codigo)}</td>
                                </tr>`;
                    }
                });
            }

            html = html + '</tbody></table>';

            _createExcel({
                worksheet: 'Reporte Vacaciones',
                style: '',
                table: html,
                filename: 'Reporte Vacaciones'
            });
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
                table.column(9).search($(this).val()).draw();
            });
        }

        function fn_crearpiechart(_json, esjefe, lstsolicfilter) {
            document.getElementById(`gpie`).innerHTML = '<canvas id="doughnutChartJefe" height="140"></canvas>';
            document.getElementById(`ibox-content-ibox-graficopie`).innerHTML = '<canvas id="doughnutChart" height="140"></canvas>';
            //crear le canvas con el piechar
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
                    responsive: true
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
                _("h5-ibox-graficobar").innerText = "Días de vacaciones por Año (" + date_year + ")";

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
                    if (y.fechas != '') {
                        const dias = y.fechas.split(',');
                        dias.forEach(z => {
                            const fecha = _strToDate(`${z} 0:00`);
                            if (fecha.getMonth() + 1 === x && fecha.getFullYear() === date_year) {
                                cantidad++;
                            }
                        });
                    } else {
                        const dias = _getDatesBetween(_strToDate(`${y.fechainicio} 0:00`), _strToDate(`${y.fechafin} 0:00`));
                        dias.forEach(z => {
                            if (z.getMonth() + 1 === x && z.getFullYear() === date_year) {
                                cantidad++;
                            }
                        });
                    }
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
                                    //return (value / this.max * 100).toFixed(0);
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

        function fn_creategantt(solicitudes_filter_gantt) {
            let lenfiltergantt = solicitudes_filter_gantt.length;
            let objamchart = [];
            const solicitudes_apr = (lenfiltergantt > 0) ? solicitudes_filter_gantt.filter(x => x.codigo === 'APR' || x.codigo === 'PAP') : ovariables.lstsolicitudes_filter.filter(x => x.codigo === 'APR');
            const objsolicitudes = solicitudes_apr.map(x => {
                return x.nombrepersonal
            });
            const arr = [...new Set(objsolicitudes)];
            let objaux = [];
            let array = [];
            arr.forEach(x => {
                if (lenfiltergantt > 0) {
                    array = solicitudes_filter_gantt.filter(y => y.nombrepersonal === x);
                } else {
                    array = ovariables.lstsolicitudes_filter.filter(y => y.nombrepersonal === x && y.codigo === 'APR');
                }

                array.forEach(z => {
                    if (z.fechas !== '') {
                        const dias = z.fechas.split(',');
                        dias.forEach(d => {
                            const json = {
                                //nombre: x,
                                start: _getDate102(_strToDate(`${d} 08:30`)),
                                end: _getDate102(moment(_strToDate(`${d} 18:30`)).add(1, 'day').toDate()),
                                color: '#1ab394',
                                task: 'Vacaciones Solicitadas'
                            }
                            objaux.push(json);
                        });
                    } else {
                        if (z.fechainicio === z.fechafin) {
                            const json = {
                                //nombre: x,
                                start: _getDate102(_strToDate(`${z.fechainicio} 08:30`)),
                                end: _getDate102(moment(_strToDate(`${z.fechafin} 18:30`)).add(1, 'day').toDate()),
                                color: '#1ab394',
                                task: 'Vacaciones Solicitadas'
                            }
                            objaux.push(json);
                        } else {
                            const json = {
                                //nombre: x,
                                start: _getDate102(_strToDate(`${z.fechainicio} 08:30`)),
                                end: _getDate102(_strToDate(`${z.fechafin} 18:30`)),
                                color: '#1ab394',
                                task: 'Vacaciones Solicitadas'
                            }
                            objaux.push(json);
                        }                        
                    }
                });

                let arrobj = {};
                arrobj["category"] = x;
                arrobj["segments"] = objaux;
                objamchart.push(arrobj);
                objaux = [];
            });

            //let arrobj = {};
            //arrobj["category"] = x;
            //arrobj["segments"] = objaux;

            //objamchart = objaux;
            //objaux = [];

            _("chart_gantt").innerHTML = '';
            _("chart_gantt").style = '';
            ovariables.datagantt = objamchart;
            if (objamchart.length > 0) {
                fn_creargantt3(ovariables.datagantt);
            } else {
                _('chart_gantt').innerHTML = '<p class="text-center">No se encontraron Solicitudes Aprobadas</p>';
            }
            //_("chart_gantt").style = '';
        }

        function fn_report() {
            fn_ReporteSolicitud(ovariables.lstsolicitudes_filter);
        }

        function fn_new() {
            let urlAccion = 'RecursosHumanos/Vacaciones/New';
            _Go_Url(urlAccion, urlAccion);
        }

        function fn_edit(_id) {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            let urlAccion = 'RecursosHumanos/Vacaciones/New';
            _Go_Url(urlAccion, urlAccion, 'accion:edit,id:' + _id);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_edit: fn_edit,
            selectedtabs: selectedtabs
        }
    }
)(document, 'panelEncabezado_VacacionesIndex');
(
    function ini() {
        appVacacionesIndex.load();
        appVacacionesIndex.req_ini();
    }
)();
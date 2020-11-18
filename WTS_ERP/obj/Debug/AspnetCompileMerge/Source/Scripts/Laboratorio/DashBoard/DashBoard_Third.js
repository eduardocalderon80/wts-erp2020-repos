var app_DashBoard_Third = (

    function (d, idpadre) {

        var ovariables = {
            titulo_pruebas_dentro_leadtime_mensual: '',
            arr_pruebas_dentro_leadtime_mensual: [],

            titulo_pruebas_fabric_development_production_dentro_leadtime:'',
            arr_pruebas_fabric_development_production_dentro_leadtime:[]

            //titulo_leadtime_fabric_production_mensual: '',
            //arr_leadtime_fabric_production_mensual: []
        }

        function load() {
            initializeIboxTools();
        }

        function initializeIboxTools() {
            // Collapse
            $('.collapse-link').click(function () {
                var ibox = $(this).closest('div.ibox');
                var button = $(this).find('i');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            });

            // Cerrar
            $('.close-link').click(function () {
                var content = $(this).closest('div.ibox');
                content.remove();
            });

            // Fullscreen
            $('.fullscreen-link').click(function () {
                var ibox = $(this).closest('div.ibox');
                var button = $(this).find('i');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 100);
            });
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let urlaccion = 'Laboratorio/DashBoard/Get_Pruebas_Dentro_LeadTime_Mensual'
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.titulo_pruebas_dentro_leadtime_mensual = rpta[0].titulo_pruebas_dentro_leadtime_mensual != '' ? rpta[0].titulo_pruebas_dentro_leadtime_mensual : '';
                        ovariables.arr_pruebas_dentro_leadtime_mensual = rpta[0].pruebas_dentro_leadtime_mensual != '' ? JSON.parse(rpta[0].pruebas_dentro_leadtime_mensual) : [];
                        ovariables.titulo_pruebas_fabric_development_production_dentro_leadtime = rpta[0].titulo_pruebas_fabric_development_production_dentro_leadtime != '' ? rpta[0].titulo_pruebas_fabric_development_production_dentro_leadtime : '';
                        ovariables.arr_pruebas_fabric_development_production_dentro_leadtime = rpta[0].pruebas_fabric_development_production_dentro_leadtime != '' ? JSON.parse(rpta[0].pruebas_fabric_development_production_dentro_leadtime) : [];
                    }
                    fn_load_cumplimiento_leadtime_mensual();
                    fn_load_cumplimiento_leadtime_paquete_prueba_mensual();
                }, (p) => { err(p); });
        }

        function fn_load_cumplimiento_leadtime_mensual() {

            let titulo_pruebas_dentro_leadtime_mensual = ovariables.titulo_pruebas_dentro_leadtime_mensual;
            let arr_pruebas_dentro_leadtime_mensual = ovariables.arr_pruebas_dentro_leadtime_mensual;

            let chartTitulo = titulo_pruebas_dentro_leadtime_mensual;
            let chartData = arr_pruebas_dentro_leadtime_mensual;

            AmCharts.addInitHandler(function (chart) {

                //function handleCustomMarkerToggle(legendEvent) {
                //    let mes = '';
                //    var titulo = legendEvent.dataItem.title;
                //    var contiene = titulo.includes(":");

                //    if (contiene) { mes = titulo.split(":")[0]; }
                //    else { mes = titulo; }
                //    req_cantidad_pruebas_paqueteprueba_mes(mes);
                //}

                if (!chart.legend || !chart.legend.enabled || !chart.legend.generateFromData) { return; }

                var categoryField = chart.categoryField;
                var colorField = chart.graphs[0].lineColorField || chart.graphs[0].fillColorsField || chart.graphs[0].colorField;
                var legendData = chart.dataProvider.map(function (data, idx) {
                    var markerData = {
                        "title": data.mes + ": " + data.total + "%",
                        "color": data[colorField],
                        "dataIdx": idx
                    };
                    if (!markerData.color) { markerData.color = chart.graphs[0].lineColor; }
                    data.dataIdx = idx;
                    return markerData;
                });

                chart.legend.data = legendData;
                //chart.legend.switchable = true;
                //chart.legend.addListener("clickMarker", handleCustomMarkerToggle);
            }, ["serial"]);

            var chart = AmCharts.makeChart("chartdiv_cumplimiento_leadtime_mensual", {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "legend": {
                    "generateFromData": true
                },
                "addClassNames": true,
                "dataProvider": chartData,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",//color de linea horizontal del grafico
                    "gridAlpha": 0,
                    "minimum": 0,
                    "maximum": 100,
                    //"minMaxMultiplier": 1.1,
                    "dashLength": 0,
                    "guides": [{
                        "value": 90,
                        "lineColor": "#cc0000",
                        "tickLength": 15,
                        "lineAlpha": 1,
                        "lineThickness": 2
                    }]
                }],
                "gridAboveGraphs": true,
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "[[mes]]: <b>[[porcentaje]]</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 0.9,
                    "labelText": "[[porcentaje]]",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "labelOffset":1,
                    "valueField": "total",
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "mesgrafico",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "position": "left"
                    //"tickPosition": "start",
                    //"tickLength": 20
                },
                "titles": [{
                    "text": chartTitulo
                }, {
                    "text": "",
                    "bold": false                    
                }],
            });

        }

        function fn_load_cumplimiento_leadtime_paquete_prueba_mensual() {
            let titulo_pruebas_fabric_development_production_dentro_leadtime = ovariables.titulo_pruebas_fabric_development_production_dentro_leadtime;
            let arr_pruebas_fabric_development_production_dentro_leadtime = ovariables.arr_pruebas_fabric_development_production_dentro_leadtime;

            let chartTitulo = titulo_pruebas_fabric_development_production_dentro_leadtime;
            let chartData = arr_pruebas_fabric_development_production_dentro_leadtime;
            var obj= { };

           
            AmCharts.addInitHandler(function (chart) {

                if (chart.sortColumns !== true)
                    return;

                /**
                 * Iterate through data
                 */
                for (var i = 0; i < chart.dataProvider.length; i++) {

                    // Collect all values for all graphs in this data point
                    var row = chart.dataProvider[i];
                    var values = [];
                    for (var g = 0; g < chart.graphs.length; g++) {
                        var graph = chart.graphs[g];
                        values.push({
                            "value": row[graph.valueField],
                            "graph": graph
                        });
                    }

                    // Sort by value
                    values.sort(function (a, b) {
                        return a.value - b.value;
                    });

                    // Apply `columnIndexField`
                    for (var x = 0; x < values.length; x++) {
                        var graph = values[x].graph;
                        graph.columnIndexField = graph.valueField + "_index";
                        row[graph.columnIndexField] = x;
                    }
                }

            }, ["serial"]);

            var chart = AmCharts.makeChart("chartdiv_cumplimiento_leadtime_paqueteprueba_mensual", {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "sortColumns": true,
                "legend": {
                    "horizontalGap": 10,
                    "maxColumns": 2,
                    "position": "bottom",
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "addClassNames": true,
                "dataProvider": chartData,
                "valueAxes": [{
                    "gridColor": "#FFFFFF", //color de linea horizontal del grafico
                    //"axisAlpha": 0, //ancho de linea de la regla
                    "gridAlpha": 0,
                    "minimum": 0,
                    "maximum": 100,
                    "dashLength": 0,                 
                    "guides": [{
                        "value": 90,
                        "lineColor": "#cc0000",
                        "tickLength": 15,
                        "lineAlpha": 1,
                        "lineThickness": 2
                    }]
                }],
                "gridAboveGraphs": true,
                "startDuration": 1, //tiempo para cargar el grafico
                "graphs": [{
                    "balloonText": "<b>[[title]]</b><br>[[category]]: <b>[[value]]" + " % </b>",
                    "fillAlphas": 0.9,
                    "labelText": "[[desarrollo]]" + "%",
                    "lineAlpha": 0.2,
                    "title": "Desarrollo",
                    "type": "column",
                    "color": "#000000",
                    "labelOffset": 1,
                    "labelPosition": "bottom",
                    "valueField": "desarrollo",
                }, {
                    "balloonText": "<b>[[title]]</b><br>[[category]]: <b>[[value]]" + " % </b>",
                    "fillAlphas": 0.9,
                    "labelText": "[[produccion]]" + "%",
                    "lineAlpha": 0.2,
                    "title": "Producción",
                    "type": "column",
                    "color": "#fffff",
                    "labelOffset": 1,
                    "labelPosition": "bottom",
                    "valueField": "produccion"
                }],
                "categoryField": "mes",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "position": "left"
                },
                "titles": [{
                    "text": chartTitulo,
                    "borderAlpha": 1,
                }
                , {
                    "text": "",
                    "bold": false,
                    "borderAlpha": 1,
                }
                ],

            });

        }







        function fn_load_cumplimiento_leadtime_paqueteprueba_mensual() {

            //let arr_leadtime_fabric_development = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":3.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Junio","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Julio","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Agosto","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Septiembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Octubre","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Noviembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Diciembre","Total":2.2,"Color":"#045FB4"}]`);
            //let arr_leadtime_fabric_production = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":2.4,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.4,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":1.8,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":1.7,"Color":"#F2F2F2"}]`);
            //let chartTitulo = 'Lead Time Fabric - Production';

            //let titulo_leadtime_fabric_production_mensual = ovariables.titulo_leadtime_fabric_production_mensual;
            //let arr_leadtime_fabric_production_mensual = ovariables.arr_leadtime_fabric_production_mensual;

            //let chartTitulo = titulo_leadtime_fabric_production_mensual;
            //let chartData = arr_leadtime_fabric_production_mensual;

            AmCharts.addInitHandler(function (chart) {

                function handleCustomMarkerToggle(legendEvent) {
                    let mes = '';
                    var titulo = legendEvent.dataItem.title;
                    var contiene = titulo.includes(":");

                    if (contiene) { mes = titulo.split(":")[0]; }
                    else { mes = titulo; }
                    req_cantidad_pruebas_paqueteprueba_mes(mes);
                }

                if (!chart.legend || !chart.legend.enabled || !chart.legend.generateFromData) { return; }

                var categoryField = chart.categoryField;
                var colorField = chart.graphs[0].lineColorField || chart.graphs[0].fillColorsField || chart.graphs[0].colorField;
                var legendData = chart.dataProvider.map(function (data, idx) {
                    var markerData = {
                        "title": data.mes + ": " + data.leadtime,
                        "color": data[colorField],
                        "dataIdx": idx
                    };
                    if (!markerData.color) { markerData.color = chart.graphs[0].lineColor; }
                    data.dataIdx = idx;
                    return markerData;
                });

                chart.legend.data = legendData;
                //chart.legend.switchable = true;
                //chart.legend.addListener("clickMarker", handleCustomMarkerToggle);
            }, ["serial"]);

            var chart = AmCharts.makeChart("chartdiv_leadtime_fabric_production_mensual", {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "legend": {
                    "generateFromData": true
                },
                "addClassNames": true,
                "dataProvider": chartData,
                "valueAxes": [{
                    "gridColor": "#FFFFFF",
                    "gridAlpha": 0.2,
                    "minimum": 0,
                    "dashLength": 0,
                    "guides": [{
                        "value": 2,
                        "lineColor": "#cc0000",
                        "tickLength": 15,
                        "lineAlpha": 1,
                        "lineThickness": 2
                    }]
                }],
                "gridAboveGraphs": true,
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "[[mes]]: <b>[[value]]</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 0.9,
                    "labelText": "[[leadtime]]",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "leadtime"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "mesgrafico",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    //"tickPosition": "start",
                    //"tickLength": 20
                },
                "titles": [{
                    "text": chartTitulo
                }, {
                    "text": "",
                    "bold": false
                }],
            });

        }

        return {
            load: load,
            req_ini: req_ini
        }
    }

)(document, 'pnl_dashboard_third');

(function ini() {
    app_DashBoard_Third.load();
    app_DashBoard_Third.req_ini();
})();

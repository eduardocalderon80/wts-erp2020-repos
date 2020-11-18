var app_DashBoard_Second = (

    function (d, idpadre) {

        var ovariables = {
            titulo_leadtime_fabric_development_mensual: '',
            arr_leadtime_fabric_development_mensual: [],

            titulo_leadtime_fabric_production_mensual: '',
            arr_leadtime_fabric_production_mensual: []
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
            let urlaccion = 'Laboratorio/DashBoard/Get_Leadtime_Paqueteprueba_Mensual'
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.titulo_leadtime_fabric_development_mensual = rpta[0].titulo_leadtime_fabric_development_mensual != '' ? rpta[0].titulo_leadtime_fabric_development_mensual : '';
                        ovariables.arr_leadtime_fabric_development_mensual = rpta[0].leadtime_fabric_development_mensual != '' ? JSON.parse(rpta[0].leadtime_fabric_development_mensual) : [];
                        ovariables.titulo_leadtime_fabric_production_mensual = rpta[0].titulo_leadtime_fabric_production_mensual != '' ? rpta[0].titulo_leadtime_fabric_production_mensual : '';
                        ovariables.arr_leadtime_fabric_production_mensual = rpta[0].leadtime_fabric_production_mensual != '' ? JSON.parse(rpta[0].leadtime_fabric_production_mensual) : [];
                    }
                    fn_load_leadtime_fabric_development_mensual();
                    fn_load_leadtime_fabric_production_mensual();
                }, (p) => { err(p); });
        }

        function fn_load_leadtime_fabric_development_mensual() {

            //let arr_leadtime_fabric_development = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":3.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Junio","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Julio","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Agosto","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Septiembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Octubre","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Noviembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Diciembre","Total":2.2,"Color":"#045FB4"}]`);
            //let arr_leadtime_fabric_development = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":3.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":2.2,"Color":"#F2F2F2"}]`);
            //let chartTitulo = 'Lead Time Fabric - Development';
            let titulo_leadtime_fabric_development_mensual = ovariables.titulo_leadtime_fabric_development_mensual;
            let arr_leadtime_fabric_development_mensual = ovariables.arr_leadtime_fabric_development_mensual;
            
            let chartTitulo = titulo_leadtime_fabric_development_mensual;
            let chartData = arr_leadtime_fabric_development_mensual;

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

            var chart = AmCharts.makeChart("chartdiv_leadtime_fabric_development_mensual", {
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
                    "labelOffset": 1,
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
        
        function fn_load_leadtime_fabric_production_mensual() {

            //let arr_leadtime_fabric_development = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":3.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.6,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Junio","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Julio","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Agosto","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Septiembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Octubre","Total":2.2,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Noviembre","Total":2.2,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Diciembre","Total":2.2,"Color":"#045FB4"}]`);
            //let arr_leadtime_fabric_production = JSON.parse(`[{"MesGrafico":"","Mes":"Enero","Total":2.4,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Febrero","Total":2.3,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Marzo","Total":2.4,"Color":"#F2F2F2"},{"MesGrafico":"","Mes":"Abril","Total":1.8,"Color":"#045FB4"},{"MesGrafico":"","Mes":"Mayo","Total":1.7,"Color":"#F2F2F2"}]`);
            //let chartTitulo = 'Lead Time Fabric - Production';
                        
            let titulo_leadtime_fabric_production_mensual = ovariables.titulo_leadtime_fabric_production_mensual;
            let arr_leadtime_fabric_production_mensual = ovariables.arr_leadtime_fabric_production_mensual;
            
            let chartTitulo = titulo_leadtime_fabric_production_mensual;
            let chartData = arr_leadtime_fabric_production_mensual;

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
                    "labelOffset": 1,
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

)(document, 'pnl_dashboard_second');

(function ini() {
    app_DashBoard_Second.load();
    app_DashBoard_Second.req_ini();
})();

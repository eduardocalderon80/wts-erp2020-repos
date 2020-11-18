var app_DashBoard_Primary = (

    function (d, idpadre) {

        var ovariables = {
            arr_titulo_cantidad_pruebas_mensual: [],
            arr_cantidad_pruebas_mensual: [],

            arr_titulo_cantidad_pruebas_paqueteprueba_mes: [],
            arr_cantidad_pruebas_paqueteprueba_mes: []
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
            let urlaccion = 'Laboratorio/DashBoard/Get_Cantidad_Pruebas_Mensual'
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_titulo_cantidad_pruebas_mensual = rpta[0].titulo_cantidad_pruebas_mensual != '' ? rpta[0].titulo_cantidad_pruebas_mensual : '';
                        ovariables.arr_cantidad_pruebas_mensual = rpta[0].cantidad_pruebas_mensual != '' ? JSON.parse(rpta[0].cantidad_pruebas_mensual) : [];
                    }
                    fn_load_cantidad_pruebas_mensual();
                    req_cantidad_pruebas_paqueteprueba_mes('');
                }, (p) => { err(p); });
        }

        function fn_load_cantidad_pruebas_mensual() {
            let arr_cantidad_pruebas_mensual = ovariables.arr_cantidad_pruebas_mensual;
            let chartTitulo = ovariables.arr_titulo_cantidad_pruebas_mensual;
            var chartData = arr_cantidad_pruebas_mensual;

            AmCharts.addInitHandler(function (chart) {

                function handleCustomMarkerToggle(legendEvent) {
                    let mes = '';
                    var titulo = legendEvent.dataItem.title;
                    var contiene = titulo.includes(":");

                    if (contiene) { mes = titulo.split(":")[0]; }
                    else { mes = titulo; }
                    app_DashBoard_Primary.req_cantidad_pruebas_paqueteprueba_mes(mes);
                }

                if (!chart.legend || !chart.legend.enabled || !chart.legend.generateFromData) { return; }

                var categoryField = chart.categoryField;
                var colorField = chart.graphs[0].lineColorField || chart.graphs[0].fillColorsField || chart.graphs[0].colorField;
                var legendData = chart.dataProvider.map(function (data, idx) {
                    var markerData = {
                        "title": data.Mes + ": " + data.Total,
                        "color": data[colorField],
                        "dataIdx": idx
                    };
                    if (!markerData.color) { markerData.color = chart.graphs[0].lineColor; }
                    data.dataIdx = idx;
                    return markerData;
                });

                chart.legend.data = legendData;
                //chart.legend.switchable = true;
                chart.legend.addListener("clickMarker", handleCustomMarkerToggle);                
            }, ["serial"]);

            var chart = AmCharts.makeChart("chartdiv_cantidad_pruebas_mensual", {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "legend": {
                    "generateFromData": true
                },
                "dataProvider": chartData,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "minimum": 0,
                    "minMaxMultiplier": 1.1,
                }],
                "startDuration": 1,
                "id": "Mes",
                "graphs": [{
                    "id": "Mes",
                    "balloonText": "[[Mes]]: <b>[[value]]</b>",
                    "fillColorsField": "Color",
                    "fillAlphas": 0.9,
                    "labelText": "[[Total]]",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "labelOffset": 1,
                    "valueField": "Total"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "MesGrafico",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "position": "left"
                },
                "titles": [{
                    "text": chartTitulo
                }, {
                    "text": "",
                    "bold": false
                }],
            });

        }

        function req_cantidad_pruebas_paqueteprueba_mes(_mes) {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { mes: _mes };
            let urlaccion = 'Laboratorio/DashBoard/Get_Cantidad_Pruebas_PaquetePrueba_Mes?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_titulo_cantidad_pruebas_paqueteprueba_mes = rpta[0].titulo_cantidad_pruebas_paqueteprueba_mes != '' ? JSON.parse(rpta[0].titulo_cantidad_pruebas_paqueteprueba_mes) : [];
                        ovariables.arr_cantidad_pruebas_paqueteprueba_mes = rpta[0].cantidad_pruebas_paqueteprueba_mes != '' ? JSON.parse(rpta[0].cantidad_pruebas_paqueteprueba_mes) : [];
                    }
                    fn_load_cantidad_pruebas_paqueteprueba_mes();
                }, (p) => { err(p); });
        }

        function fn_load_cantidad_pruebas_paqueteprueba_mes() {
            let arr_titulo_cantidad_pruebas_paqueteprueba_mes = ovariables.arr_titulo_cantidad_pruebas_paqueteprueba_mes;
            let chartTitulo = arr_titulo_cantidad_pruebas_paqueteprueba_mes[0].titulo;
            let arr_cantidad_pruebas_paqueteprueba_mes = ovariables.arr_cantidad_pruebas_paqueteprueba_mes;

            var chartData = arr_cantidad_pruebas_paqueteprueba_mes;

            AmCharts.addInitHandler(function (chart) {

                function handleCustomMarkerToggle(legendEvent) {
                    var dataProvider = legendEvent.chart.dataProvider;
                    var itemIndex;
                    legendEvent.chart.toggleLegend = true;

                    if (undefined !== legendEvent.dataItem.hidden && legendEvent.dataItem.hidden) {
                        legendEvent.dataItem.hidden = false;
                        dataProvider.push(legendEvent.dataItem.storedObj);
                        legendEvent.dataItem.storedObj = undefined;
                        dataProvider.sort(function (lhs, rhs) { return lhs.dataIdx - rhs.dataIdx; });
                    } else {
                        legendEvent.dataItem.hidden = true;

                        for (var i = 0; i < dataProvider.length; ++i) { if (dataProvider[i].dataIdx === legendEvent.dataItem.dataIdx) { itemIndex = i; break; } }

                        legendEvent.dataItem.storedObj = dataProvider[itemIndex];
                        dataProvider.splice(itemIndex, 1);
                    }
                    legendEvent.chart.validateData();
                }

                if (!chart.legend || !chart.legend.enabled || !chart.legend.generateFromData) { return; }

                var categoryField = chart.categoryField;
                var colorField = chart.graphs[0].lineColorField || chart.graphs[0].fillColorsField || chart.graphs[0].colorField;
                var legendData = chart.dataProvider.map(function (data, idx) {
                    var markerData = {
                        "title": data.PaquetePrueba + ": " + data.Total,
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

            var chart = AmCharts.makeChart("chartdiv_cantidad_pruebas_paqueteprueba_mes", {
                "type": "serial",
                "theme": "light",
                "marginRight": 70,
                "legend": {
                    "generateFromData": true
                },
                "dataProvider": chartData,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "minimum": 0,
                    "minMaxMultiplier": 1.1,
                }],
                "startDuration": 1,
                "graphs": [{
                    "balloonText": "[[PaquetePrueba]]: <b>[[value]]</b>",
                    "fillColorsField": "Color",
                    "fillAlphas": 0.9,
                    "labelText": "[[Total]]",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "labelOffset": 1,
                    "valueField": "Total",
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "PaquetePruebaGrafico",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0,
                    "position": "left"
                },
                "titles": [{
                    "text": chartTitulo
                }, {
                    "text": "",
                    "bold": false
                }],
                //"export": {
                //    "enabled": true,
                //}
            });

        }


        return {
            load: load
            , req_ini: req_ini
            , req_cantidad_pruebas_paqueteprueba_mes: req_cantidad_pruebas_paqueteprueba_mes
        }
    }

)(document, 'pnl_dashboard_primary');

(function ini() {
    app_DashBoard_Primary.load();
    app_DashBoard_Primary.req_ini();
})();

//function handleCustomMarkerToggle(legendEvent) {
//    //var dataProvider = legendEvent.chart.dataProvider;
//    //var itemIndex;
//    //legendEvent.chart.toggleLegend = true;

//    let mes = '';
//    var titulo = legendEvent.dataItem.title;
//    var contiene = titulo.includes(":");

//    if (contiene) { mes = titulo.split(":")[0]; }
//    else { mes = titulo; }
//    req_cantidad_pruebas_paqueteprueba_mes(mes);

//    //if (undefined !== legendEvent.dataItem.hidden && legendEvent.dataItem.hidden) {
//    //    legendEvent.dataItem.hidden = false;
//    //    dataProvider.push(legendEvent.dataItem.storedObj);
//    //    legendEvent.dataItem.storedObj = undefined;
//    //    dataProvider.sort(function (lhs, rhs) { return lhs.dataIdx - rhs.dataIdx; });
//    //} else {
//    //    legendEvent.dataItem.hidden = true;

//    //    for (var i = 0; i < dataProvider.length; ++i) { if (dataProvider[i].dataIdx === legendEvent.dataItem.dataIdx) { itemIndex = i; break; } }

//    //    legendEvent.dataItem.storedObj = dataProvider[itemIndex];
//    //    dataProvider.splice(itemIndex, 1);
//    //}
//    //legendEvent.chart.validateData();
//}
var app_DashBoard_Initial = (

    function (d, idpadre) {

        var ovariables = {
            arr_titulo_cantidad_total_pruebas_mensual:[],
            arr_cantidad_total_pruebas_mensual: [],

            arr_titulo_cantidad_pruebas_paqueteprueba_mes: [],
            arr_cantidad_pruebas_paqueteprueba_mes: []

            //arr_cantidad_pruebas_ultimo_mes: [],
            //arr_cantidad_paquetepruebas_total: []
        }

        function load() {
            //fn_crearcharts();
            _initializeIboxTools();
        }

        /* Inicial */
        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let urlaccion = 'Laboratorio/DashBoard/DashBoard_List'
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables.arr_titulo_cantidad_total_pruebas_mensual = rpta[0].titulo_cantidad_total_pruebas_mensual != '' ? rpta[0].titulo_cantidad_total_pruebas_mensual : '';
                        ovariables.arr_cantidad_total_pruebas_mensual = rpta[0].cantidad_total_pruebas_mensual != '' ? JSON.parse(rpta[0].cantidad_total_pruebas_mensual) : [];
                    }
                    fn_load_cantidad_total_pruebas_mensual();
                    req_cantidad_pruebas_paqueteprueba_mes('');
                }, (p) => { err(p); });
        }

        function fn_load_cantidad_total_pruebas_mensual() {
            let arr_cantidad_total_pruebas_mensual = ovariables.arr_cantidad_total_pruebas_mensual;
            let chartTitulo = ovariables.arr_titulo_cantidad_total_pruebas_mensual;
            var chartData = arr_cantidad_total_pruebas_mensual;


            AmCharts.addInitHandler(function (chart) {

                function handleCustomMarkerToggle(legendEvent) {
                    //var dataProvider = legendEvent.chart.dataProvider;
                    //var itemIndex;
                    //legendEvent.chart.toggleLegend = true;
                    
                    let mes='';
                    var titulo = legendEvent.dataItem.title;
                    var contiene = titulo.includes(":");
                    
                    if (contiene) {
                        mes = titulo.split(":")[0];
                    }
                    else { mes = titulo; }
                    req_cantidad_pruebas_paqueteprueba_mes(mes);

                    //if (undefined !== legendEvent.dataItem.hidden && legendEvent.dataItem.hidden) {
                    //    legendEvent.dataItem.hidden = false;
                    //    dataProvider.push(legendEvent.dataItem.storedObj);
                    //    legendEvent.dataItem.storedObj = undefined;
                    //    dataProvider.sort(function (lhs, rhs) { return lhs.dataIdx - rhs.dataIdx; });
                    //} else {
                    //    legendEvent.dataItem.hidden = true;

                    //    for (var i = 0; i < dataProvider.length; ++i) { if (dataProvider[i].dataIdx === legendEvent.dataItem.dataIdx) { itemIndex = i; break; } }

                    //    legendEvent.dataItem.storedObj = dataProvider[itemIndex];
                    //    dataProvider.splice(itemIndex, 1);
                    //}
                    //legendEvent.chart.validateData();
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
                chart.legend.switchable = true;
                chart.legend.addListener("clickMarker", handleCustomMarkerToggle);
                //chart.legend.addListener("clickMarker", req_cantidad_pruebas_paqueteprueba_mes);
            }, ["serial"]);

            var chart = AmCharts.makeChart("chartdiv_cantidad_total_pruebas_mensual", {
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
            let urlaccion = 'Laboratorio/DashBoard/Get_Pruebas_PaquetePrueba_Mes?par=' + JSON.stringify(parametro);
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
                chart.legend.switchable = true;
                chart.legend.addListener("clickMarker", handleCustomMarkerToggle);
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
                }],
                "graphs": [{
                    "balloonText": "[[PaquetePrueba]]: <b>[[value]]</b>",
                    "fillColorsField": "Color",
                    "fillAlphas": 0.9,
                    "labelText": "[[Total]]",
                    "lineAlpha": 0.2,
                    "type": "column",
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

        function fn_crearcharts() {
            let barCanvas = document.getElementById('barChart').getContext('2d');
            let barChart = new Chart(barCanvas, {
                type: 'bar',
                data: {
                    labels: ["Enero"],//, "Febreo", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    datasets: [
                        {
                            label: "",
                            backgroundColor: ["#F2F2F2"], //"#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", ],
                            borderColor: ["#F2F2F2"],// "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", "#F2F2F2", "#045FB4", ],
                            borderWidth: 1,
                            data: [1061]//, 1234, 1097, 1246, 1167, 962, 787, 895, 1041, 1120, 1053, 980]
                        },
                    ]
                },
                options: {
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

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'pnl_dashboard_initial');

(function ini() {
    app_DashBoard_Initial.load();
    app_DashBoard_Initial.req_ini();
})();


//function fn_load_cantidad_total_pruebas_mensual() {
//    let arr_cantidad_total_pruebas_mensual = ovariables.arr_cantidad_total_pruebas_mensual;
//    let chartTitulo = ovariables.arr_titulo_cantidad_total_pruebas_mensual;
//    var chartData = arr_cantidad_total_pruebas_mensual;
    
//    var chart = AmCharts.makeChart("chartdiv_cantidad_total_pruebas_mensual", {
//        "type": "serial",
//        "theme": "light",
//        "marginRight": 70,
//        "dataProvider": chartData,
//        "valueAxes": [{
//            "axisAlpha": 0,
//            "minimum": 0,
//        }],
//        "startDuration": 1,
//        "id": "Mes",
//        "graphs": [{
//            "id": "Mes",
//            "balloonText": "[[category]]: <b>[[value]]</b>",
//            "fillColorsField": "Color",
//            "fillAlphas": 0.9,
//            "labelText": "[[Total]]",
//            "lineAlpha": 0.2,
//            "type": "column",
//            "valueField": "Total",
//            "columnWidth": 0.8
//        }],
//        "chartCursor": {
//            "categoryBalloonEnabled": false,
//            "cursorAlpha": 0,
//            "zoomable": false
//        },
//        "categoryField": "Mes",
//        "categoryAxis": {
//            "gridPosition": "start",
//            "gridAlpha": 0,
//            "autoWrap": true,
//            "autoRotateCount": 5,
//            "autoRotateAngle": 45,
//            "listeners": [{
//                "event": "clickItem",
//                "method": function (e) {
//                    let mes = e.value;
//                    req_cantidad_pruebas_paqueteprueba_mes(mes);
//                }
//            }]
//        },
//        "titles": [{
//            "text": "Total de Pruebas Realizadas por Mes"
//        }, {
//            "text": "",
//            "bold": false
//        }],
//        "export": {
//            "enabled": true,
//        }
//    });
//}
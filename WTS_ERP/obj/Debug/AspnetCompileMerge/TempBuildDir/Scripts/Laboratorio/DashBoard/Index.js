var app_Laboratorio_DashBoard_Index = (

function (d, idpadre) {

    var ovariables = {
        arr_cantidad_total_pruebas_mensual: [],

        arr_titulo_cantidad_pruebas_paqueteprueba_mes:[],
        arr_cantidad_pruebas_paqueteprueba_mes: []

        //arr_cantidad_pruebas_ultimo_mes: [],
        //arr_cantidad_paquetepruebas_total: []
    }

    function load() {
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
                    ovariables.arr_cantidad_total_pruebas_mensual = rpta[0].cantidad_total_pruebas_mensual != '' ? JSON.parse(rpta[0].cantidad_total_pruebas_mensual) : [];
                }
                fn_load_cantidad_total_pruebas_mensual();
                req_cantidad_pruebas_paqueteprueba_mes('');
            }, (p) => { err(p); });
    }

    function fn_load_cantidad_total_pruebas_mensual() {
        let arr_cantidad_total_pruebas_mensual = ovariables.arr_cantidad_total_pruebas_mensual;

        var chartData = arr_cantidad_total_pruebas_mensual;

        var chart = AmCharts.makeChart("chartdiv_cantidad_total_pruebas_mensual", {
            "type": "serial",
            "theme": "light",
            "marginRight": 70,
            "dataProvider": chartData,
            "valueAxes": [{
                "axisAlpha": 0,
                "minimum": 0,
            }],
            "startDuration": 1,
            "id": "Mes",
            "graphs": [{
                "id": "Mes",
                "balloonText": "[[category]]: <b>[[value]]</b>",
                "fillColorsField": "Color",
                "fillAlphas": 0.9,
                "labelText": "[[Total]]",
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "Total",
                "columnWidth": 0.8
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "Mes",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                "autoWrap":true,
                "autoRotateCount": 5,
                "autoRotateAngle":45,
                "listeners": [{
                    "event": "clickItem",
                    "method": function (e) {
                        let mes = e.value;
                        req_cantidad_pruebas_paqueteprueba_mes(mes);
                    }
                }]
            },
            "titles": [{
                "text": "Total de Pruebas Realizadas por Mes"
            }, {
                "text": "",
                "bold": false
            }],
            "export": {
                "enabled": true,
            }
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






    function req_load_cantidad_pruebas_utlimo_mes() {
        let arr_cantidad_pruebas_ultimo_mes = ovariables.arr_cantidad_pruebas_ultimo_mes;

        var chartData = arr_cantidad_pruebas_ultimo_mes;

        AmCharts.addInitHandler(function (chart) {

            //method to handle removing/adding columns when the marker is toggled
            function handleCustomMarkerToggle(legendEvent) {
                var dataProvider = legendEvent.chart.dataProvider;
                var itemIndex; //store the location of the removed item

                //Set a custom flag so that the dataUpdated event doesn't fire infinitely, in case you have
                //a dataUpdated event of your own
                legendEvent.chart.toggleLegend = true;
                // The following toggles the markers on and off.
                // The only way to "hide" a column and reserved space on the axis is to remove it
                // completely from the dataProvider. You'll want to use the hidden flag as a means
                // to store/retrieve the object as needed and then sort it back to its original location
                // on the chart using the dataIdx property in the init handler
                if (undefined !== legendEvent.dataItem.hidden && legendEvent.dataItem.hidden) {
                    legendEvent.dataItem.hidden = false;
                    dataProvider.push(legendEvent.dataItem.storedObj);
                    legendEvent.dataItem.storedObj = undefined;
                    //re-sort the array by dataIdx so it comes back in the right order.
                    dataProvider.sort(function (lhs, rhs) {
                        return lhs.dataIdx - rhs.dataIdx;
                    });
                } else {
                    // toggle the marker off
                    legendEvent.dataItem.hidden = true;
                    //get the index of the data item from the data provider, using the 
                    //dataIdx property.
                    for (var i = 0; i < dataProvider.length; ++i) {
                        if (dataProvider[i].dataIdx === legendEvent.dataItem.dataIdx) {
                            itemIndex = i;
                            break;
                        }
                    }
                    //store the object into the dataItem
                    legendEvent.dataItem.storedObj = dataProvider[itemIndex];
                    //remove it
                    dataProvider.splice(itemIndex, 1);
                }
                legendEvent.chart.validateData(); //redraw the chart
            }

            //check if legend is enabled and custom generateFromData property
            //is set before running
            if (!chart.legend || !chart.legend.enabled || !chart.legend.generateFromData) {
                return;
            }

            var categoryField = chart.categoryField;
            var colorField = chart.graphs[0].lineColorField || chart.graphs[0].fillColorsField || chart.graphs[0].colorField;
            var legendData = chart.dataProvider.map(function (data, idx) {
                var markerData = {
                    "title": data[categoryField] + ": " + data[chart.graphs[0].valueField],
                    "color": data[colorField],
                    "dataIdx": idx //store a copy of the index of where this appears in the dataProvider array for ease of removal/re-insertion
                };
                if (!markerData.color) {
                    markerData.color = chart.graphs[0].lineColor;
                }
                data.dataIdx = idx; //also store it in the dataProvider object itself
                return markerData;
            });

            chart.legend.data = legendData;

            //make the markers toggleable
            chart.legend.switchable = true;
            chart.legend.addListener("clickMarker", handleCustomMarkerToggle);

        }, ["serial"]);


        var chart = AmCharts.makeChart("chartdiv_cantidad_pruebas_ultimo_mes", {
            "type": "serial",
            "theme": "light",
            "marginRight": 70,
            "legend": {
                "generateFromData": true
            },
            "dataProvider": chartData,
            "valueAxes": [{
                "axisAlpha": 0,
                //"position": "top",
                //"title": "Visitors from country",
                "minimum": 0,
                //"minMaxMultiplier": 1.2
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "[[category]]: <b>[[value]]</b>",
                "fillColorsField": "Color",
                "fillAlphas": 0.9,
                "labelText": "[[Total]]",
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "Total",
                //"columnWidth": 0.8
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "PaquetePrueba",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
            },
            "titles": [{
                "text": "Cantidad de Paquete de Pruebas realizadas en Junio"
            }, {
                "text": "",
                "bold": false
            }],
            "export": {
                "enabled": true,
                //"divId": "exportdiv"
            }
        });
    }

    function req_load_cantidad_paquetepruebas_total() {
        let arr_cantidad_paquetepruebas_total = ovariables.arr_cantidad_paquetepruebas_total;
        let m = '';

        arr_cantidad_paquetepruebas_total.forEach(x=> {

        });
    }


    return {
        load: load,
        req_ini: req_ini
    }

}
)(document, 'pnl_laboratorio_dashboard');

(
    function ini() {
        app_Laboratorio_DashBoard_Index.load();
        app_Laboratorio_DashBoard_Index.req_ini();
    }
)();



var appCourierService_ViewMap = (

    function (d, idpadre) {

        var ovariables_informacion = {
            idprogramacion: 0
        }

        var ovariables_data = {
            programacion: ''
            , arr_chofer: []
            , arr_solcitud: []
        }

        function load() {
            let par = _('txtpar_viewmap').value;
            if (!_isEmpty(par)) { ovariables_informacion.idprogramacion = _par(par, 'idprogramacion'); }

        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) };
            let parametro = { idprogramacion: ovariables_informacion.idprogramacion };
            let urlaccion = 'CourierService/Solicitud/Get_Programacion?par=' + JSON.stringify(parametro);
            _Get(urlaccion)
                .then((response) => {
                    let rpta = response !== '' ? JSON.parse(response) : null;
                    if (rpta !== null) {
                        ovariables_data.programacion = rpta[0].programacion != '' ? JSON.parse(rpta[0].programacion) : '';
                        ovariables_data.arr_chofer = rpta[0].chofer != '' ? JSON.parse(rpta[0].chofer) : [];
                        ovariables_data.arr_solcitud = rpta[0].solicitud != '' ? JSON.parse(rpta[0].solicitud) : [];
                    }
                    fn_load_programacion();
                }, (p) => { err(p); })
             .then(() => {
                 initMap();
             });
        }

        function fn_load_programacion() {
            let programacion = ovariables_data.programacion;    
            let resultado = ovariables_data.arr_chofer.filter(x=>x.idchofer === programacion[0].idchofer)
            _('txt_vehiculo_mapa').value = programacion[0].vehiculo;
            _('txt_chofer_mapa').value = resultado[0].chofercompleto;
        }
      
        function initMap() {
            //var uluru = { lat: -12.130514, lng: -76.983499 };


            let programacion = ovariables_data.programacion;
            let solicitud = ovariables_data.arr_solcitud;
                       
            var uluru = { lat: _parseFloat(programacion[0].latitud), lng: _parseFloat(programacion[0].longitud) };
            let icono = programacion[0].icono;
            let chofer = programacion[0].chofer;
            let vehiculo = programacion[0].vehiculo;
            //let imagenfabrica = 'factory.jpg'
            //let url_imagenfabrica = urlBase() + 'Content/img/' + imagenfabrica;
            let colormarket_fabrica = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

            //Cargar el mapa con el tamaño y la ubicacion
            var map2 = new google.maps.Map(
                document.getElementById('map2'), { zoom: 16, center: uluru });


            if (solicitud.length > 0) {
                solicitud.forEach(x=> {
                    let url_imagenfabrica = urlBase() + 'Content/img/' + x.imagen;

                    content = `
                        <div id='content' style='width:380px'>
                            <span style='float:left'><img src=${url_imagenfabrica} style='width:380px;height:180px'></span><br>
                            <span style='float:right'><b>${vehiculo}</b></span><br>
                            <span style='width=100%'><b>${x.destino}</b></span><br>
                            <span style='width=100%'>${x.direccion}</span>
                        </div>
                        `;

                    uluru_fab = { lat: _parseFloat(x.latitud), lng: _parseFloat(x.longitud) };

                    window["info" + x.idsolicitud] = new google.maps.InfoWindow({
                        content: content
                    });

                    window["marker" + x.idsolicitud] = new google.maps.Marker({
                        position: uluru_fab,
                        map: map2,
                        icon: colormarket_fabrica

                    });

                    let infosol = window["info" + x.idsolicitud];
                    let markersol = window["marker" + x.idsolicitud];

                    markersol.addListener('click', function () {
                        infosol.open(map2, markersol);
                    });

                });

            }



            // The marker, positioned at Uluru
            var marker = new google.maps.Marker({
                position: uluru,
                map: map2,
                icon: urlBase() + 'Content/img/' + icono
            });
            
            var info = new google.maps.InfoWindow({
                content: vehiculo + ' - ' + chofer
            });

            marker.addListener('click', function () {
                info.open(map2, marker);
            });
                       
        }      

        return {
            load: load,
            req_ini: req_ini,
            //initMap: initMap
        }

    }

)(document, 'pnl_courier_service_viewmap');

(function ini() {
    //initMap();
    appCourierService_ViewMap.load();
    appCourierService_ViewMap.req_ini();
    //appCourierService_ViewMap.initMap();
})();
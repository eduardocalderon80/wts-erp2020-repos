var appCalendarioIndex = (
    function (d, idpadre) {
        var ovariables = {
            estados: [],
            lstcalendario: [],
            auxiliar: [],
            objcalendar: [],
            usuarios: [],
            esjefe: '',
            lstferiados: [],
            lstusuariossabados: []
        }

        function load() {
            _initializeIboxTools();
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('RecursosHumanos/Calendario/GetAllData_Calendario?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    debugger;
                    let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                    if (rpta !== null) {
                        debugger;
                        // Se guarda estados
                        ovariables.usuarios = rpta[0].usuarios !== '' ? JSON.parse(rpta[0].usuarios) : [];
                        ovariables.esjefe = rpta[0].esjefe !== '' ? rpta[0].esjefe : '0';
                        ovariables.lstusuariossabados = rpta[0].configuracionusuariossabados !== '' ? JSON.parse(rpta[0].configuracionusuariossabados) : [];
                        let obj_estados = rpta[0].estado !== '' ? JSON.parse(rpta[0].estado) : [];

                        let json_estados = {};
                        obj_estados.forEach(x => {
                            json_estados[x.nombre] = x.codigo;
                        });

                        let obj_feriados = rpta[0].lstferiados !== '' ? JSON.parse(rpta[0].lstferiados) : [];
                        obj_feriados.forEach(x => {
                            ovariables.lstferiados.push(moment(x.fecha, 'DD/MM/YYYY').toDate());
                        });

                        ovariables.estados = json_estados;
                        ovariables.lstcalendario = rpta[0].lsttodos !== '' ? JSON.parse(rpta[0].lsttodos) : [];
                        ovariables.auxiliar = rpta[0].auxiliar !== '' ? JSON.parse(rpta[0].auxiliar) : [];

                        fn_createdragdrop(ovariables.auxiliar);
                        fn_createarraycalendar(ovariables.lstcalendario);
                    }
                }, (p) => { err(p); });
        }

        function fn_createdragdrop(_json) {
            let divDrag = '<p>Arrastrar al calendario para agregar:</p>';
            if (_json.length > 0) {
                _json.forEach(x => {
                    // Condicional para 
                    let usuarioentrante = window.utilindex.idusuario;
                    let usuariospermitidos = ovariables.usuarios.filter(x => x.idusuario === usuarioentrante);

                    if (usuariospermitidos.length === 0) {
                        if (x.flag === 'descanso' || x.flag === 'licencia') {
                            divDrag += `<div class="external-event ${x.clase}" data-color="${x.color}" data-flag="${x.flag}" style="pointer-events: none;">${x.icon}${x.categoria}</div>`;
                        } else {
                            if (x.flag === 'viajes' && ovariables.esjefe === 1) {
                                divDrag += `<div class="external-event ${x.clase}" data-color="${x.color}" data-flag="${x.flag}">${x.icon}${x.categoria}</div>`;
                            } else if (x.flag === 'viajes' && ovariables.esjefe === 0) {
                                divDrag += `<div class="external-event ${x.clase}" data-color="${x.color}" data-flag="${x.flag}" style="pointer-events: none;">${x.icon}${x.categoria}</div>`;
                            } else {
                                divDrag += `<div class="external-event ${x.clase}" data-color="${x.color}" data-flag="${x.flag}">${x.icon}${x.categoria}</div>`;
                            }
                        }
                    } else {
                        divDrag += `<div class="external-event ${x.clase}" data-color="${x.color}" data-flag="${x.flag}">${x.icon}${x.categoria}</div>`;
                    }
                });
                //divDrag += '<div class="external-event navy-bg" style="background-image: linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b); pointer-events: none;">Cumpleaños</div>';
            }
            _('external-events').innerHTML = divDrag;
        }

        function fn_createarraycalendar(_json) {
            debugger;
            let objcalendario = [];
            if (_json.length > 0) {
                _json.forEach(x => {

                    let fechasseleccionadas = [];
                    let newarrayfechasseleccionadas = [];
                    //validando si tiene vacaciones con fechas sueltas
                    if (x.fechainicio === undefined && x.fechafin === undefined) {
                        if (x.flag === 'golden') {
                            fechasseleccionadas = x.fechasseleccionadas.split(',');                           
                            let arrSoloFechas = []
                            fechasseleccionadas.forEach(y => {
                                let fechagolden = y.split(' ')[0];

                                let dia = fechagolden.substring(0, 2);
                                let mes = fechagolden.substring(3, 5);
                                let ano = fechagolden.substring(6, 10);
                                arrSoloFechas.push(`${dia}/${mes}/${ano}`);
                            });

                            arrSoloFechas = [...new Set(arrSoloFechas)];

                            arrSoloFechas.forEach(m => {
                                let dia = m.substring(0, 2);
                                let mes = m.substring(3, 5);
                                let ano = m.substring(6, 10);

                                let start;
                                let end;
                                let datoFechas;

                                let fecha = m;
                                let filter = fechasseleccionadas.filter(y => y.split(' ')[0] === m );
                                if (filter.length > 1) {
                                    start = `${ano}-${mes}-${dia} ${filter[0].split(' ')[1]}`;
                                    end = `${ano}-${mes}-${dia} ${filter[1].split(' ')[1]}`;
                                }
                                else if (filter.length === 1) {
                                    start = `${ano}-${mes}-${dia} ${filter[0].split(' ')[1]}`;
                                    end = `${ano}-${mes}-${dia} ${filter[0].split(' ')[1]}`;
                                }
                                
                                let data = {};
                                data["id"] = x.idsolicitud;
                                data["parameter"] = '';
                                data["flag"] = x.flag;
                                data["title"] = x.titulo;
                                data["start"] = moment(start);
                                data["end"] = moment(end);
                                data["color"] = x.color;
                                data["aprobado"] = x.codigoestado === 'APR' ? true : false;
                                data["accion"] = 'edit';
                                data["editable"] = false;
                                objcalendario.push(data);

                            });

                            //fechasseleccionadas.forEach(y => {
                                                                                           

                            //    let dia = y.substring(0, 2);
                            //    let mes = y.substring(3, 5);
                            //    let ano = y.substring(6, 10);

                            //    let z_inicio = `${ano}-${mes}-${dia} ${fechagolden[1]}:00`;
                            //    let data = {};
                            //    data["id"] = x.idsolicitud;
                            //    data["parameter"] = '';
                            //    data["flag"] = x.flag;
                            //    data["title"] = x.titulo;
                            //    data["start"] = moment(z);
                            //    data["end"] = moment(z);
                            //    data["color"] = x.color;
                            //    data["aprobado"] = x.codigoestado === 'APR' ? true : false;
                            //    data["accion"] = 'edit';
                            //    data["editable"] = false;
                            //    objcalendario.push(data);
                            //});
                        } else {
                            fechasseleccionadas = x.fechasseleccionadas.split(',');

                            fechasseleccionadas.forEach(y => {

                                let dia = y.substring(0, 2);
                                let mes = y.substring(3, 5);
                                let ano = y.substring(6, 10);

                                let z = ano + '-' + mes + '-' + dia + ' 00:00:00';
                                let data = {};
                                data["id"] = x.idsolicitud;
                                data["parameter"] = '';
                                data["flag"] = x.flag;
                                data["title"] = x.titulo;
                                data["start"] = moment(z);
                                data["end"] = moment(z);
                                data["color"] = x.color;
                                data["aprobado"] = x.codigoestado === 'APR' ? true : false;
                                data["accion"] = 'edit';
                                data["editable"] = false;
                                objcalendario.push(data);
                            });
                        }


                    } else {
                        let data = {};
                        data["id"] = x.idsolicitud;
                        data["parameter"] = '';
                        data["flag"] = x.flag;
                        data["title"] = x.titulo;
                        data["start"] = moment(x.fechainicio);
                        data["end"] = moment(x.fechafin).set('hour', 15).toDate();
                        data["color"] = x.color;
                        data["aprobado"] = x.codigoestado === 'APR' ? true : false;
                        data["accion"] = 'edit';
                        data["editable"] = false;
                        objcalendario.push(data);
                    }
                });
            }
            fn_createcalendar(objcalendario);
        }

        function fn_createcalendar(objcalendario) {
            $('#external-events div.external-event').each(function () {
                $(this).data('event', {
                    id: Math.random(),
                    title: $.trim($(this).text()),
                    stick: true,
                    color: $(this).data('color'),
                    flag: $(this).data('flag'),
                    accion: 'new',
                    editable: true
                });

                $(this).draggable({
                    zIndex: 999,
                    revert: true,
                    revertDuration: 0
                });
            });

            $('#calendar').fullCalendar({
                lang: 'es',
                defaultView: 'month',
                //hiddenDays: [0],
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'year,month,agendaWeek,agendaDay'
                },
                editable: true,
                //minTime: "08:00:00",
                //maxTime: "20:00:00",
                eventResize: function (event, delta, revertFunc) {
                    // Event resize
                },
                eventDrop: function (event, delta, revertFunc) {
                    // Event drop
                    //console.log(event);
                },
                droppable: true,
                drop: function (event, delta, ev, resourceId, res) {
                    // Aqui se puede habilitar para efecutar creacion directamente en ves de dar click
                    //$(this).remove();                   
                },
                eventDragStart: function (event) {
                    // Event drag start
                },
                eventDragStop: function (event) {
                    // Event drag stop
                    //console.log('dragstop', event);
                },
                defaultDate: moment(new Date),
                events: objcalendario,
                //events: [
                //    {
                //        id: 1,
                //        parameter: 1,
                //        flag: 'descanso',
                //        title: 'Descanso Medico - Jacob Valdez',
                //        description: '',
                //        start: moment('2019-08-01'),
                //        end: moment('2019-08-03'),
                //        //rendering: 'background',
                //        color: '#1c84c6',
                //        allDay: true,
                //    },
                //    {
                //        id: 2,
                //        parameter: 2,
                //        flag: 'permiso',
                //        title: 'Permiso - Luis Rojas',
                //        start: moment('2019-07-31'),
                //        end: moment('2019-08-02'),
                //        color: '#1ab394',
                //        allDay: true
                //    },
                //    {
                //        id: 3,
                //        parameter: 3,
                //        flag: 'golden',
                //        title: 'Golden Ticket - Eduardo Calderon',
                //        start: moment('2019-08-05'),
                //        end: moment('2019-08-07'),
                //        color: '#f8ac59',
                //        allDay: true
                //    },
                //    {
                //        id: 4,
                //        parameter: 4,
                //        flag: 'permiso',
                //        title: 'Permiso - Luis Albarracin',
                //        start: moment('2019-08-08'),
                //        end: moment('2019-08-10'),
                //        color: '#1ab394',
                //        allDay: true
                //    },
                //    {
                //        id: 5,
                //        parameter: 5,
                //        title: 'Mi Cumpleaños',
                //        start: moment('2019-08-15'),
                //        end: moment('2019-08-15'),
                //        color: '#23c6c8',
                //        allDay: true
                //    },
                //    {
                //        id: 6,
                //        parameter: 6,
                //        flag: 'vacaciones',
                //        title: 'Mis Vacaciones',
                //        start: moment('2019-08-19'),
                //        end: moment('2019-08-31'),
                //        color: '#23c6c8',
                //        allDay: true
                //    },
                //    {
                //        id: 7,
                //        parameter: 7,
                //        flag: 'vacaciones',
                //        title: 'Vacaciones - Eduardo Calderon',
                //        start: moment('2019-08-28'),
                //        end: moment('2019-09-03'),
                //        color: '#23c6c8',
                //        allDay: true
                //    },
                //    {
                //        id: 8,
                //        parameter: 8,
                //        flag: 'golden',
                //        title: 'Golden Ticket - Samuel Arone',
                //        start: moment('2019-08-12'),
                //        end: moment('2019-08-14'),
                //        color: '#1ab394',
                //        allDay: true
                //    },
                //],
                eventRender: function (event, element) {
                    ////console.log(event);
                    //console.log(element);

                    //let fechasconsecutivas = [];

                    //let diffdays = (event.end._d - event.start._d);
                    //for (let cntfecha = 0; cntfecha <= diffdays; cntfecha++) {
                    //    fechasconsecutivas.push(event.start._d.getDate() + 1);
                    //}


                    //console.log(fechasconsecutivas);

                    //if (ovariables.lstferiados.filter(x => (x.getMonth() === event.start._d.getMonth()) && x.getDate() === event.start._d.getDate()).length > 0) {
                    //    $(element).remove();
                    //    return false;
                    //}

                    //if (ovariables.lstusuariossabados.filter(x => (parseInt(x.idpersonal, 10) === parseInt(window.utilindex.idpersonal, 10)) && (x.trabajasabado === 1)).length > 0) {
                    //    if (event.start._d.getDay() === 0) {
                    //        $(element).remove();
                    //        return false;
                    //    }
                    //} else {
                    //    if (event.start._d.getDay() === 6 || event.start._d.getDay() === 7) {
                    //        $(element).remove();
                    //        return false;
                    //    }
                    //}            


                    if (event.accion === 'new') {
                        element.find('.fc-content').append('<span class="removeEvent fa fa-close float-right" id="Eliminar"></span>');
                        element.find(".removeEvent").click(function () {
                            $('#calendar').fullCalendar('removeEvents', event.id);
                            //element.remove();
                            $(".popover").remove();
                        });
                    }

                    if (event.flag !== 'cumple') {
                        let categoria = ovariables.auxiliar.filter(x => x.flag === event.flag)[0].categoria;
                        let fechainicio = moment(event.start).format('DD/MM/YYYY');
                        let fechafin = moment(event.end).format('DD/MM/YYYY') !== 'Invalid date' ? ` - ${moment(event.end).format('DD/MM/YYYY')}` : '';
                        $(".popover").remove();
                        element.popover({
                            //title: eventObj.title,
                            //content: eventObj.description,
                            content: categoria + ' - ' + event.title + ' ' + fechainicio + fechafin,
                            trigger: 'hover',
                            placement: 'top',
                            container: 'body'
                        });
                    }
                    //element.attr("data-id", event.id);
                    //element.attr("data-par", event.parameter);

                    // Le asigna opacity a solicitudes no aprobadas
                    if (event.aprobado === false) {
                        element.css("opacity", "0.5");
                    }

                    // Buscar por id
                    if (event.flag === 'cumple') {
                        element.css("background-image", "linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b)");
                        element.css("border-color", "initial");
                        element.css("opacity", "1");
                        //$("a[data-id='5']").css("background-image", "linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b)");
                        //$("a[data-id='5']").css("border-color", "initial");
                    }
                },
                dayRender: function (date, cell) {
                    //if (ovariables.lstferiados.filter(x => (x.getMonth() === date._d.getMonth()) && x.getDate() === date._d.getDate()).length > 0) {
                    //    $(cell).addClass('disabled');
                    //}

                    //if (ovariables.lstusuariossabados.filter(x => (parseInt(x.idpersonal, 10) === parseInt(window.utilindex.idpersonal, 10)) && (x.trabajasabado === 1)).length > 0) {
                    //    if (date._d.getDay() === 0) {
                    //        $(cell).addClass('disabled');
                    //    }
                    //} else {
                    //    if (date._d.getDay() === 0 || date._d.getDay() === 6) {
                    //        $(cell).addClass('disabled');
                    //    }
                    //}                   
                },
                eventClick: function (event, element) {
                    // Dia y hora general
                    let fechainicio = '', fechafin = '', horainicio = '', horafin = '';
                    fechainicio = moment(event.start).format('DD/MM/YYYY');
                    horainicio = moment(event.start).format('HH:mm') !== '00:00' ? moment(event.start).format('HH:mm') : '08:30';
                    fechafin = event.end === null ? moment(event.start).format('DD/MM/YYYY') : moment(event.end).format('HH:mm') === '00:00'
                        ? moment(event.end).subtract(1, "days").format('DD/MM/YYYY') : moment(event.end).format('DD/MM/YYYY');
                    horafin = event.end === null ? '18:30' : moment(event.end).format('HH:mm') === '00:00' ? '18:30' : moment(event.end).format('HH:mm');

                    horainicio = horainicio.replace(":", ".");
                    horafin = horafin.replace(":", ".");
                    let event_id = event.id === undefined ? '' : event.id;

                    // Por si se queda pegado
                    $(".popover").remove();
                    if (event.flag === "vacaciones") {
                        let controller = 'Vacaciones';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "descanso") {
                        let controller = 'DescansoMedico';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "permiso") {
                        let controller = 'Permisos';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "golden") {
                        let controller = 'GoldenTicket';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "licencia") {
                        let controller = 'Licencias';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "viajes") {
                        let controller = 'Viajes';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "cumpleanos") {
                        let controller = 'Cumpleanos';
                        fn_go_solicitud(controller, event.accion, event_id, fechainicio, fechafin, horainicio, horafin);
                    } else if (event.flag === "cumple") {
                        let titulo = ovariables.lstcalendario.filter(x => x.flag === 'cumple')[0].titulo;
                        $("body").addClass("pyro");
                        $("body").prepend('<div class="before" style="z-index: 999;"></div><div class="after" style="z-index: 999;"></div>');
                        initBalloons();
                        $("#wrapper").css("opacity", "0.8");
                        $("#wrapper").css("pointer-events", "none");
                        $("#wrapper").before('<a class="close-animation"><i class="fa fa-times"></i></a>');
                        $("#wrapper").before(`<h1 id="birthday-title" class="birthday-text2" data-heading="${titulo}" style="display: none;">${titulo}</h1>`);
                        $("#birthday-title").fadeIn('slow');
                        $(".close-animation").click(function () {
                            $(".pyro .before").remove();
                            $(".pyro .after").remove();
                            $("body").removeClass("pyro");
                            $("#wrapper").css("opacity", "");
                            $("#wrapper").css("pointer-events", "");
                            $(".bc").remove();
                            $("#birthday-title").remove();
                            $(this).remove();
                        });
                    }
                }
            });
        }

        function fn_go_solicitud(controller, accion, id, fechainicio, fechafin, horainicio, horafin) {
            let urlAccion = `RecursosHumanos/${controller}/New`;
            _Go_Url(urlAccion, urlAccion, `accion:${accion},id:${id},ruta:calendario,fechainicio:${fechainicio},fechafin:${fechafin},horainicio:${horainicio},horafin:${horafin}`);
        }

        // Funciones para globos
        function random(min = 0, max = 10) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function build(className = "", type = "div") {
            let el = document.createElement(type);
            if (className) el.className = className;
            return el;
        }

        function addStyles(element, styles = {}) {
            Object.assign(element.style, styles);
        }

        function initBalloons() {
            const container = document.querySelector("body");
            const palette = ["#eb4d4b", "#badc58", "#f9ca24", "#22a6b3"];

            document.querySelectorAll(".bc").forEach(e => e.parentNode.removeChild(e));

            for (var i = 0; i < 50; i++) {
                let balloon = build("balloon");
                let knot = build("knot");
                let string = build("string");
                let bc = build("bc");

                let thisColor = palette[random(0, palette.length - 1)];

                let rotate = `rotate(${Math.floor(random(-7, 7) * 1.25)}deg)`;
                let translateX = `translateX(${random(0, 100) * 20}px)`;
                let translateY = `translateY(${random(-2, i) * 2}px)`;

                addStyles(bc, { transform: `${rotate} ${translateX} ${translateY}` });
                addStyles(balloon, { background: thisColor });
                addStyles(knot, { borderBottomColor: thisColor });

                balloon.addEventListener("click", () => balloon.parentNode.remove());

                knot.append(string);
                balloon.append(knot);
                bc.appendChild(balloon);
                container.prepend(bc);
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_CalendarioIndex');
(
    function ini() {
        appCalendarioIndex.load();
        appCalendarioIndex.req_ini();
    }
)();
var appReporteAsistenciaIndex = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lstmarcacion: [],
            lstpersonal: [],
            lstareas: [],
            lstsubareas: [],
            lstequipos: [],
            lstfechas: [],
            lstferiados: [],
            lstsolicitudes: []
        }

        function load() {
            _initializeIboxTools();
            _initializeDatepicker();

            _('btnSearch').addEventListener('click', req_ini);
            _('btnReport').addEventListener('click', fn_report);

            // Setea 1 mes x defecto
            $('.date.date-es').eq(0).datepicker('setDate', moment().subtract(1, 'month').format('YY/MM/YYYY'));
            $('.date.date-es').eq(1).datepicker("setDate", new Date());
            //_('txtFechaInicio').value = '01/07/2019';
            //_('txtFechaFin').value = '02/07/2019';
        }

        function req_ini() {
            let txtFechaInicio = _('txtFechaInicio').value, txtFechaFin = _('txtFechaFin').value;
            if (_isnotEmpty(txtFechaInicio) && _isnotEmpty(txtFechaFin)) {
                // Loader begin
                $('#myModalSpinner').modal('show');
                let err = function (__err) { console.log('err', __err) },
                    parametro = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_ReporteAsistenciaIndex' });
                _Get('RecursosHumanos/ReporteAsistencia/GetAllData_ReporteAsistencia?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        // Loader end
                        $('#myModalSpinner').modal('hide');
                        let rpta = resultado !== '' ? JSON.parse(resultado) : [];
                        if (rpta !== null) {
                            debugger;
                            // Se guarda estados
                            ovariables.lstmarcacion = rpta[0].lstmarcacion !== '' ? JSON.parse(rpta[0].lstmarcacion) : [];
                            ovariables.lstpersonal = rpta[0].lstpersonal !== '' ? JSON.parse(rpta[0].lstpersonal) : [];
                            ovariables.lstareas = rpta[0].lstareas !== '' ? JSON.parse(rpta[0].lstareas) : [];
                            ovariables.lstsubareas = rpta[0].lstsubareas !== '' ? JSON.parse(rpta[0].lstsubareas) : [];
                            ovariables.lstequipos = rpta[0].lstequipos !== '' ? JSON.parse(rpta[0].lstequipos) : [];
                            ovariables.lstfechas = rpta[0].lstfechas !== '' ? JSON.parse(rpta[0].lstfechas) : [];
                            ovariables.lstferiados = rpta[0].lstferiados !== '' ? CSVtoJSON(rpta[0].lstferiados) : [];
                            ovariables.lstsolicitudes = rpta[0].lstsolicitudes !== '' ? JSON.parse(rpta[0].lstsolicitudes) : [];

                            // Se crea tabla   
                            let listapersonal = ovariables.lstpersonal;
                            let data = fn_ordenarareas();
                            _('div_tbl_asistencia').innerHTML = fn_creartabla(data);

                            // Crea Combo
                            let cboArea = ``;
                            data.forEach(x => {
                                cboArea += `<option value="${x.Nombre}" data-id="${x.IdArea}" data-eq="${x.IdEquipo}">${x.Nombre}</option>`;
                            });
                            _('cboArea').innerHTML = cboArea;
                            $("#cboArea").select2({ width: '100%' });

                            $('#cboArea').on('change', function () {
                                let cboArea = $(this).val();
                                let arrFilter = [];
                                if (cboArea !== null) {
                                    for (let i = 0; i < cboArea.length; i++) {
                                        let json = data.filter(x => x.Nombre === cboArea[i])[0];
                                        arrFilter.push(json);
                                    }
                                    _('div_tbl_asistencia').innerHTML = fn_creartabla(arrFilter);
                                } else {
                                    _('div_tbl_asistencia').innerHTML = fn_creartabla(data);
                                }
                            });

                            // Busca en lista
                            let txtNombre = document.getElementById("txtNombre");
                            txtNombre.addEventListener("keyup", function (event) {
                                if (event.keyCode === 13) {
                                    if (txtNombre.value !== '') {
                                        // Limpia cboArea
                                        $("#cboArea").select2("val", "");

                                        let arrFilter = [];
                                        ovariables.lstpersonal = listapersonal.filter(x => x.NombrePersonal.toLowerCase().includes(txtNombre.value.toLowerCase()));
                                        for (let i = 0; i < ovariables.lstpersonal.length; i++) {
                                            let json = data.filter(x => x.IdArea === ovariables.lstpersonal[i].IdArea && x.IdEquipo === ovariables.lstpersonal[i].IdEquipo)[0];
                                            arrFilter.push(json);
                                        }
                                        // Filter duplicates
                                        arrFilter = arrFilter.filter((arr, index, self) => index === self.findIndex((t) => (t.Nombre === arr.Nombre)));

                                        _('div_tbl_asistencia').innerHTML = fn_creartabla(arrFilter);
                                    } else {
                                        ovariables.lstpersonal = listapersonal;
                                        _('div_tbl_asistencia').innerHTML = fn_creartabla(data);
                                    }
                                }
                            });
                            _('btnSearchList').onclick = function () {
                                if (txtNombre.value !== '') {
                                    // Limpia cboArea
                                    $("#cboArea").select2("val", "");

                                    let arrFilter = [];
                                    ovariables.lstpersonal = listapersonal.filter(x => x.NombrePersonal.toLowerCase().includes(txtNombre.value.toLowerCase()));
                                    for (let i = 0; i < ovariables.lstpersonal.length; i++) {
                                        let json = data.filter(x => x.IdArea === ovariables.lstpersonal[i].IdArea && x.IdEquipo === ovariables.lstpersonal[i].IdEquipo)[0];
                                        arrFilter.push(json);
                                    }
                                    // Filter duplicates
                                    arrFilter = arrFilter.filter((arr, index, self) => index === self.findIndex((t) => (t.Nombre === arr.Nombre)));

                                    _('div_tbl_asistencia').innerHTML = fn_creartabla(arrFilter);
                                } else {
                                    ovariables.lstpersonal = listapersonal;
                                    _('div_tbl_asistencia').innerHTML = fn_creartabla(data);
                                }
                            }
                        }
                        fn_crear_datatable_asitsencia();
                    }, (p) => { err(p); });
            } else {
                swal({ title: "Advertencia", text: "Los campos fecha inicio y fin no pueden estar vacios", type: "warning", timer: 1000, showCancelButton: false, showConfirmButton: false });
            }
        }

        function fn_crear_datatable_asitsencia() {
            $('#tbl_asistencia').DataTable({
                scrollY: "400px",
                scrollX: true,
                scrollCollapse: false,
                "ordering": false,
                paging: false,
                fixedColumns: {
                    leftColumns: 1
                }
            });
            $("#tbl_asistencia_filter").remove();
        }

        function fn_ordenarareas() {
            let arr = [];
            if (ovariables.lstareas.length > 0) {
                ovariables.lstareas.forEach(x => {
                    let json = { IdArea: x.IdArea, IdEquipo: 0, Nombre: x.NombreArea }
                    arr.push(json);
                    ovariables.lstsubareas.forEach(y => {
                        if (y.IdPadre === x.IdArea) {
                            let json = { IdArea: y.IdArea, IdEquipo: 0, Nombre: y.NombreArea }
                            arr.push(json);
                            ovariables.lstequipos.forEach(z => {
                                if (z.IdArea === y.IdArea) {
                                    let json = { IdArea: z.IdArea, IdEquipo: z.IdEquipoTrabajo, Nombre: z.EquipoTrabajo }
                                    arr.push(json);
                                }
                            });
                        }
                    });
                    ovariables.lstequipos.forEach(z => {
                        if (z.IdArea === x.IdArea) {
                            let json = { IdArea: z.IdArea, IdEquipo: z.IdEquipoTrabajo, Nombre: z.EquipoTrabajo }
                            arr.push(json);
                        }
                    });
                });
            } else if (ovariables.lstsubareas.length > 0) {
                ovariables.lstsubareas.forEach(y => {
                    let json = { IdArea: y.IdArea, IdEquipo: 0, Nombre: y.NombreArea }
                    arr.push(json);
                    ovariables.lstequipos.forEach(z => {
                        if (z.IdArea === y.IdArea) {
                            let json = { IdArea: z.IdArea, IdEquipo: z.IdEquipoTrabajo, Nombre: z.EquipoTrabajo }
                            arr.push(json);
                        }
                    });
                });
            } else {
                ovariables.lstequipos.forEach(z => {
                    let json = { IdArea: z.IdArea, IdEquipo: z.IdEquipoTrabajo, Nombre: z.EquipoTrabajo }
                    arr.push(json);
                });
            }
            return arr;
        }

        function fn_creartabla(lstcabeceras) {
            let html = ``;
            html += `<table id="tbl_asistencia" class="table-stripped table-bordered">`;
            html += `<thead>`;
            html += `<tr>`;
            html += `<th rowspan="2" class="text-center col-200">Nombre - Area</th>`;
            ovariables.lstfechas.forEach(x => {
                html += `<th colspan="2" class="text-center col-120">${x.Fecha}</th>`;
            });
            html += `<th rowspan="2" class="text-center col-80">Total Tardanzas</th>`;
            html += `</tr>`;
            html += `<tr>`;
            ovariables.lstfechas.forEach(x => {
                html += `<th class="text-center col-60">Ingreso</th>`;
                html += `<th class="text-center col-60">Salida</th>`;
            });
            html += `</tr>`;
            html += `<tbody>`;
            if (lstcabeceras.length > 0) {
                lstcabeceras.forEach(x => {
                    html += `<tr>`;
                    html += `<th class="col-200 headcol color-Area center-vertical">${x.Nombre}</th>`;
                    ovariables.lstfechas.forEach(p => {
                        html += `<th class="text-center col-60 color-Area center-vertical"></th>`;
                        html += `<th class="text-center col-60 color-Area center-vertical"></th>`;
                    });
                    html += `<th class="text-center col-60 color-Area center-vertical"></th>`;
                    html += `</tr>`;
                    ovariables.lstpersonal.forEach(y => {
                        if (y.IdArea === x.IdArea && y.IdEquipo === x.IdEquipo) {
                            html += `<tr>`;
                            html += `<td class="col-200">${y.NombrePersonal}</td>`;
                            let nrotardanzas = 0;
                            ovariables.lstfechas.forEach(z => {
                                let registroshoras = 0;
                                if (ovariables.lstmarcacion.length > 0) {
                                    ovariables.lstmarcacion.forEach(c => {
                                        if (c.IdUsuarioMarcador === y.IdUsuarioMarcador && c.Fecha === z.Fecha) {

                                            //ovariables.lstsolicitudes.forEach(p => {
                                            //    if (p.IdPersonal === y.IdPersonal) {
                                            //        let ajson = JSON.parse(p.FechasSeleccionadas);
                                            //        ajson.forEach(u => {
                                            //            if (u.fecha === z.Fecha) {
                                            //                registroshoras++;
                                            //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;${c.ColorEntrada === 'red' ? 'color: red' : ''}">${c.Entrada}</td>`;
                                            //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;${c.ColorSalida === 'red' ? 'color: red' : ''}">${c.Salida}</td>`;
                                            //            }
                                            //        });
                                            //    }
                                            //});

                                            let estilo_back = fn_obtener_solicitud(ovariables.lstsolicitudes, y.IdPersonal, z.Fecha);
                                            if (estilo_back !== '') {
                                                registroshoras++;
                                                html += `<td class="text-center col-60" style="${estilo_back} ${c.ColorEntrada === 'red' ? 'color: red' : ''}">${c.Entrada}</td>`;
                                                html += `<td class="text-center col-60" style="${estilo_back} ${c.ColorSalida === 'red' ? 'color: red' : ''}">${c.Salida}</td>`;
                                            }

                                            if (registroshoras === 0) {
                                                html += `<td class="text-center col-60" style="${c.ColorEntrada === 'red' ? 'color: red' : ''}">${c.Entrada}</td>`;
                                                html += `<td class="text-center col-60" style="${c.ColorSalida === 'red' ? 'color: red' : ''}">${c.Salida}</td>`;
                                            }

                                            //html += `<td class="text-center col-60" style="${c.ColorEntrada === 'red' ? 'color: red' : ''}">${c.Entrada}</td>`;
                                            //html += `<td class="text-center col-60" style="${c.ColorSalida === 'red' ? 'color: red' : ''}">${c.Salida}</td>`;
                                            registroshoras++;
                                            // Cuenta Tardanzas
                                            if (c.ColorEntrada === 'red') {
                                                nrotardanzas++;
                                            }
                                        }
                                    });
                                    if (registroshoras === 0) {
                                        // Para feriados
                                        // Para Solicitudes (Golden, DM, Vacaciones, Licencia, Cumple)
                                        let feriado = ovariables.lstferiados.filter(s => s.Fecha === z.Fecha);
                                        if (feriado.length > 0) {
                                            html += `<td class="text-center col-60" style="background: #b8b8b8">Feriado</td>`;
                                            html += `<td class="text-center col-60" style="background: #b8b8b8">Feriado</td>`;
                                        } else {

                                            //ovariables.lstsolicitudes.forEach(p => {
                                            //    if (p.IdPersonal === y.IdPersonal) {
                                            //        let ajson = JSON.parse(p.FechasSeleccionadas);
                                            //        ajson.forEach(u => {
                                            //            if (u.fecha === z.Fecha) {
                                            //                registroshoras++;
                                            //                //html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;">${p.Categoria}</td>`;
                                            //                //html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;">${p.Categoria}</td>`;
                                            //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;"></td>`;
                                            //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;"></td>`;
                                            //            }
                                            //        });
                                            //    }
                                            //});

                                            let estilo_back = fn_obtener_solicitud(ovariables.lstsolicitudes, y.IdPersonal, z.Fecha);
                                            if (estilo_back !== '') {
                                                registroshoras++;
                                                html += `<td class="text-center col-60" style="${estilo_back}"></td>
                                                         <td class="text-center col-60" style="${estilo_back}"></td>`;
                                            }

                                            if (registroshoras === 0) {
                                                html += `<td class="text-center col-60"></td>`;
                                                html += `<td class="text-center col-60"></td>`;
                                            }
                                        }
                                    }
                                } else {
                                    // Para feriados
                                    // Para Solicitudes (Golden, DM, Vacaciones, Licencia, Cumple)
                                    let feriado = ovariables.lstferiados.filter(s => s.Fecha === z.Fecha);
                                    if (feriado.length > 0) {
                                        html += `<td class="text-center col-60" style="background: #b8b8b8">Feriado</td>`;
                                        html += `<td class="text-center col-60" style="background: #b8b8b8">Feriado</td>`;
                                    } else {
                                        //ovariables.lstsolicitudes.forEach(p => {
                                        //    if (p.IdPersonal === y.IdPersonal) {
                                        //        let ajson = JSON.parse(p.FechasSeleccionadas);
                                        //        ajson.forEach(u => {
                                        //            if (u.fecha === z.Fecha) {
                                        //                registroshoras++;
                                        //                //html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;">${p.Categoria}</td>`;
                                        //                //html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;">${p.Categoria}</td>`;
                                        //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;"></td>`;
                                        //                html += `<td class="text-center col-60" style="background-color: ${p.Color}; color: #ffffff;"></td>`;
                                        //            }
                                        //        });
                                        //    }
                                        //});

                                        let estilo_back = fn_obtener_solicitud(ovariables.lstsolicitudes, y.IdPersonal, z.Fecha);
                                        if (estilo_back !== '') {
                                            registroshoras++;
                                            html += `<td class="text-center col-60" style="${estilo_back}"></td>
                                                     <td class="text-center col-60" style="${estilo_back}"></td>`;
                                        }

                                        if (registroshoras === 0) {
                                            html += `<td class="text-center col-60"></td>`;
                                            html += `<td class="text-center col-60"></td>`;
                                        }
                                    }
                                }
                            });
                            html += `<td class="text-center col-20">${nrotardanzas}</td>`;
                            html += `</tr>`;
                        }
                    });
                });
            }
            html += `</tbody>`;
            html += `</table>`;

            return html;
        }

        function fn_obtener_solicitud(_json, _idpersonal, _fecha) {
            let arr = [];
            const arrfilter = _json.filter(x => x.IdPersonal === _idpersonal);
            arrfilter.forEach(x => {
                const json = JSON.parse(x.FechasSeleccionadas);
                const jsonfilter = json.filter(y => y.fecha === _fecha);
                if (jsonfilter.length > 0) {
                    arr.push(x.Color);
                }
            });

            let html = '';
            let result = '';
            const arrlength = arr.length;
            const valor = parseInt(100 / arrlength);
            let count = 0;
            if (arrlength > 0) {
                for (let i = 0; i < arrlength; i++) {
                    if (i === 0) {
                        html += `, ${arr[i]} 0%, ${arr[i]} ${valor}%`;
                    } else if (i === arrlength - 1) {
                        html += `, ${arr[i]} ${count}%, ${arr[i]} 100%`;
                    } else {
                        html += `, ${arr[i]} ${count}%, ${arr[i]} ${count * 2}%`;
                    }
                    count += valor;
                }
                //result = `<td class="text-center col-60" style="background: linear-gradient(to right${html});"></td>
                //          <td class="text-center col-60" style="background: linear-gradient(to right${html});"></td>`;
                
                //result = `background: linear-gradient(to right${html});-moz-linear-gradient(to right${html});`;  //comentado por LA, el gradient no se exporta correctamente en el reporte a excel
                result = `background-color: ${arr[0]};`;
            }
            return result;
        }

        function fn_ReporteAsistencia(_json) {
            let fecha = _getDate103().replace(/[/]/g, '');
            let data = fn_ordenarareas();
            let html = document.createElement("div");
            html.innerHTML = fn_creartabla(data);

            // Set color
            [...html.getElementsByTagName('th')].forEach(x => {
                x.style.backgroundColor = '#206590';
                x.style.color = '#ffffff';
                // Filters
                if (x.textContent === 'Nombre - Area') {
                    x.setAttribute("x:autofilter", "all");
                }
            });

            // Set align center
            [...html.getElementsByClassName('text-center')].forEach(x => {
                x.style.textAlign = 'center';
            });

            // Exporta excel
            _createExcel({
                worksheet: 'Reporte Asistencia ' + fecha,
                style: '',
                table: html.innerHTML,
                filename: 'Reporte Asistencia ' + fecha
            });
        }

        function fn_report() {
            fn_ReporteAsistencia(ovariables.lstmarcacion);
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_ordenarareas: fn_ordenarareas,
            fn_obtener_solicitud: fn_obtener_solicitud
        }
    }
)(document, 'panelEncabezado_ReporteAsistenciaIndex');
(
    function ini() {
        appReporteAsistenciaIndex.load();
        appReporteAsistenciaIndex.req_ini();
    }
)();
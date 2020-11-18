var appInventarioColgadorCerrarPeriodo = (
    function (d, idpadre) {
        var ovariables = {
            lstInventario: [],
        }

        function load() {
            d.getElementById('btnSave').addEventListener('click', fn_save);
            d.getElementById('btnReturn').addEventListener('click', fn_return);
            d.getElementById('_cbolocacion_colgador').addEventListener('change', fn_buscar);
        }

        function req_ini() {
            let err = function (__err) { console.log('err', __err) },
                parametro = { x: 1 };
            _Get('DesarrolloTextil/InventarioColgador/GetDataInicialInventario?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let lstperiodoinventario = rpta[0].lstperiodoinventario !== '' ? JSON.parse(rpta[0].lstperiodoinventario) : null;
                        let lstalmacen = rpta[0].lstalmacen !== '' ? JSON.parse(rpta[0].lstalmacen) : null;

                        let cboperiodoinventario = '';
                        if (lstperiodoinventario.length > 0) {
                            lstperiodoinventario.forEach(x => {
                                if (x.estado === "1") {
                                    cboperiodoinventario += `<option value='${x.idperiodo}' selected>${x.periodo}</option>`
                                } else {
                                    cboperiodoinventario += `<option value='${x.idperiodo}'>${x.periodo}</option>`
                                }
                            });
                        }
                        _('_cboperiodo_colgador').innerHTML = cboperiodoinventario;
                        _('_cbolocacion_colgador').innerHTML = _comboFromJSON(lstalmacen, 'idalmacen', 'alias');

                    }
                }, (p) => { err(p); });

            fn_buscar();
        }

        function fn_buscar() {
            ovariables.lstInventario = "";
            let err = function (__err) { console.log('err', __err) },
                parametro = { idperiodo: _('_cboperiodo_colgador').value, idalmacen: _('_cbolocacion_colgador').value, estado: 1 };

            _Get('DesarrolloTextil/InventarioColgador/GetDataInventarioColgador?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        let inventariocolgador = rpta[0].inventariocolgador !== '' ? JSON.parse(rpta[0].inventariocolgador) : null;
                        ovariables.lstInventario = inventariocolgador;
                        cargartabla(ovariables.lstInventario);
                    }
                }, (p) => { err(p); });
        }

        function cargartabla(data) {
            let table = _('div_tbl_indexinventario'), html = '';
            table.innerHTML = "";
            html = `<table id="tbl_indexinventario" class="table table-bordered table-hover" style="width: 100%; max-width: 100%;  padding-right: 0px;">                            
                        <thead>
                            <tr>
                                <th style="width:2%">N°</th>
                                <th style="width:10%">Código Tela</th>
                                <th style="width:5%">Período</th>
                                <th style="width:15%">Descripción de Tela</th>
                                <th style="width:5%">Locacion</th>
                                <th style="width:5%">Anaquel</th>
                                <th class="text-center" style="width:5%">Saldo Inicial del Periodo</th>                                            
                                <th class="text-center" style="width:5%">Salidas</th>
                                <th class="text-center" style="width:5%">Entradas</th> 
                                <th class="text-center" style="width:5%">Saldo a la Fecha</th>
                                <th class="text-center no-sort" style="width:5%">Saldo Contabilizado</th>
                                <th class="text-center" style="width:5%">Saldo Cierre</th>
                                <th class="text-center" style="width:5%">Diferencia</th>                                            
                            </tr>
                        </thead>
                        <tbody id="tbody_indexinventario">`;
            if (data !== null) {              
                data.forEach(x => {
                    html += `<tr id='${x.idinventario}'>                                                                      
                                <td>${x.idinventario}</td>
                                <td>${x.codigotela}</td>
                                <td>${x.periodo}</td>
                                <td>${x.descripcion}</td>
                                <td>${x.almacen}</td>
                                <td>${x.anaquel}</td>
                                <td class="text-center">${x.saldoinicial}</td>                                    
                                <td class="text-center">${x.salidas}</td>
                                <td class="text-center">${x.ingresos}</td>    
                                <td class="text-center">${x.saldodisponible}</td>
                                <td class="text-center"><input type='text' data-required="true" data-min="1" data-max="254" onkeyup="appInventarioColgadorCerrarPeriodo.fn_calcularSaldos(this)" data-idinventario='${x.idinventario}' data-idanalisistextil='${x.idanalisistextil}' class='form-control _enty_grabar' value='${x.saldodisponible}'/></td>
                                <td class="text-center">${x.saldodisponible}</td>
                                <td class="text-center">0</td>
                            </tr>`;
                });

                html += "</tbody></table>";
                table.innerHTML = html;
                formatTable();
            } else {
                html += "<tr><td colspan='13' class='text-center'>Sin Resultados</td></tr></tbody></table>";
                table.innerHTML = html;
                //formatTable();
            }
        }

        function formatTable() {
            $('#tbl_indexinventario thead tr').clone(true).appendTo('#tbl_indexinventario thead');
            $('#tbl_indexinventario thead tr:eq(1) th').each(function (i) {
                var title = $(this).text();
                //$(this).html('<input type="text" placeholder="Search" />');
                i == 10 ? $(this).html("") : $(this).html('<input type="text" placeholder="Search" />');

                $('input', this).on('keyup change', function () {
                    if (table.column(i).search() !== this.value) {
                        table
                            .column(i)
                            .search(this.value)
                            .draw();
                    }
                });
            });

            var table = $('#tbl_indexinventario').DataTable({
                paging: false,
                bPaginate:false,
                bDestroy: true,
                info: false,
                bLengthChange: false,
                retrieve: true,
                orderCellsTop: true,
                fixedHeader: true,    
                scrollY: "500px",
                scrollX: true,
                scrollCollapse: true,                             
            });

            $('#tbl_indexinventario').removeClass('display').addClass('table table-bordered table-hover');
            $('#tbl_indexinventario_filter').hide();
        }

        function fn_return(e) {
            let urlAccion = 'DesarrolloTextil/InventarioColgador/Index';
            _Go_Url(urlAccion, urlAccion, 'accion:new');
        }

        function fn_save() {
            let tbody = _('tbody_indexinventario');
            let req_enty = '', cantidadfilas = tbody.rows.length;;            
            req_enty = _required({ clase: '_enty_grabar', id: 'tbl_indexinventario' });
            
            if (req_enty) {
                let idinventario = 0, idanalisistextil = 0, idperiodo = 0, idalmacen = 0, anaquel = '', ingresos = 0, salidas = 0,
                    saldoinicial = 0, stockfecha = 0, stockcontado = 0, stockcierre = 0, diferencia = 0, datacsv = '';


                swal({
                    title: "Esta seguro que desea cerrar el periodo de inventario?",
                    text: "",
                    html: true,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: false,                    
                }, function (isConfirm) {
                    if (isConfirm) {
                        for (let i = 0; i < cantidadfilas; i++) {
                            idinventario = tbody.rows[i].id;
                            idanalisistextil = tbody.rows[i].children[10].children[0].getAttribute('data-idanalisistextil');
                            idperiodo = _('_cboperiodo_colgador').value;
                            idalmacen = _('_cbolocacion_colgador').value;
                            anaquel = tbody.rows[i].children[5].innerHTML;
                            ingresos = tbody.rows[i].children[8].innerHTML;
                            salidas = tbody.rows[i].children[7].innerHTML;
                            saldoinicial = tbody.rows[i].children[6].innerHTML;
                            stockfecha = tbody.rows[i].children[9].innerHTML;
                            stockcontado = tbody.rows[i].children[10].children[0].value;
                            stockcierre = tbody.rows[i].children[11].innerHTML;
                            diferencia = (tbody.rows[i].children[12].innerHTML).indexOf("span") == -1 ? tbody.rows[i].children[12].innerHTML : tbody.rows[i].children[12].children[0].innerHTML;

                            datacsv += idinventario + '¬' + idanalisistextil + '¬' + idperiodo + '¬' + idalmacen + '¬' + anaquel + '¬' + ingresos + '¬' + salidas + '¬' + saldoinicial + '¬' + stockfecha + '¬' + stockcontado + '¬' + stockcierre + '¬' + diferencia + '^';
                        }

                        let form = new FormData();
                        let urlaccion = 'DesarrolloTextil/InventarioColgador/Cierre_Inventario_Colgador',
                            parametro = {
                                datacsv: datacsv, idperiodo: _('_cboperiodo_colgador').value
                            };
                        form.append('par', JSON.stringify(parametro));
                        Post(urlaccion, form, function (rpta) {
                            if (rpta !== '') {
                                _swal({ estado: 'success', mensaje: 'OK' });
                                _('btnSave').classList.add('hide');
                                return;
                            }
                            else {
                                _swal({ estado: 'error', mensaje: 'Error' });
                            }
                        });                     
                    } else {
                                         
                    }
                });           

                
            } else {
                if (cantidadfilas == 0) {
                    _swal({ estado: 'info', mensaje: 'Ingrese Items.' });
                }
            }        
        }

        function fn_calcularSaldos(button) {
            let tr = button.parentNode.parentNode;
            let stockfecha = tr.children[9].innerHTML;
            let stockcontado = button.value;
            let stockcierre = tr.children[11];
            let diferencia = tr.children[12];
            let spancierrre = [];
            let resultdiferencia = 0;

            stockcierre.innerHTML = stockcontado !== '' ? stockcontado : 0;
            resultdiferencia = (stockcontado * 1) - (stockfecha * 1);
            spancierrre = resultdiferencia < 0 ? `<span style='color:red'>${resultdiferencia}</span>` : resultdiferencia;            
            diferencia.innerHTML = spancierrre;            
        }

        return {
            load: load,
            req_ini: req_ini,
            fn_calcularSaldos: fn_calcularSaldos,
            ovariables: ovariables
        }
    }
)(document, 'panelEncabezado_index_IC');
(
    function ini() {
        appInventarioColgadorCerrarPeriodo.load();
        appInventarioColgadorCerrarPeriodo.req_ini();
    }
)();


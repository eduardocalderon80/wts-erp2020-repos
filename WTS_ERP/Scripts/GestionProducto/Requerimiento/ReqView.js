var app_Requerimiento_View = (

     function (d, idpadre) {

         var ovariables = {
             arr_cliente: [],
             arr_id_cliente: [],
             arr_id_cliente_selection: [],
             arr_temporada: [],
             arr_temporadacliente: [],
             arr_fabrica: [],
             arr_fabricacliente: [],
             arr_tipomuestra: [],
             arr_tipomuestracliente: [],
             arr_estilo: [],
             arr_id_estilo: [],
             arr_id_estilo_selection: [],
             arr_estiloclientetemporadafabrica: [],
             arr_actividad: [],
             arr_estado: [],
             chkfecha: 0,
             arr_requerimiento: []
         }

         function load() {
             initializeIboxTools();
             handler_check();

             $('#div_fecha_inicial .input-group.date, #div_fecha_fin .input-group.date').datepicker({
                 autoclose: true,
                 dateFormat: 'dd/mm/yyyy',
                 //clearBtn: true,
                 //firstDay: 1,
                 todayHighlight: true
             }).datepicker("setDate", new Date());

             $('#div_fecha_inicial .input-group.date').datepicker('update', moment().subtract(1, 'month').format('MM/DD/YYYY'));
             $('#div_fecha_fin .input-group.date').datepicker('update', moment().format('MM/DD/YYYY'));

             //$(".chosen-select").chosen({ width: "100%", placeholder_text_multiple: 'Seleccione Cliente' });
             $(".chosen-select").chosen({ width: "100%" });
             /* Fix */
             $(".chosen-container").css("pointer-events", "none");
             $(".chosen-choices").css("background-color", "#eee");
             $(".chosen-choices input").css("height", "28px");
             $('#cbo_cliente').chosen().change(function () {
                 let cbo_cliente = $("#cbo_cliente").chosen().val() == null ? "0" : $("#cbo_cliente").chosen().val();
                 ovariables.arr_id_cliente_selection = [];

                 if (cbo_cliente != '0') {
                     cbo_cliente.forEach(x=> {
                         obj = {},
                         obj.idcliente = parseInt(x);
                         ovariables.arr_id_cliente_selection.push(obj);
                     })
                 }
                 else { ovariables.arr_id_cliente_selection = ovariables.arr_id_cliente; }

                 fn_load_temporada();
                 fn_load_fabrica();
                 fn_load_tipomuestra();
                 fn_load_estilo();
                 fn_load_actividad();
                 fn_load_estado();
             });

             $('#cbo_temporada').on('change', fn_load_estilo);
             $('#cbo_fabrica').on('change', fn_load_estilo);

             _('btn_search').addEventListener('click', req_search);
         }

         /* General */
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

         function handler_check() {
             $('.i-checks').iCheck({
                 checkboxClass: 'icheckbox_square-green',
                 radioClass: 'iradio_square-green',
             }).on('ifChanged', function (e) {
                 let x = e.currentTarget;
                 if (x.checked) { ovariables.chkfecha = 1 }
                 else { ovariables.chkfecha = 0 }
             });
         }

         function req_search() {
             req_info();
         }

         /* Inicial */
         function req_ini() {
             let err = function (__err) { console.log('err', __err) };
             let parametro = { estado: 0 };
             let urlaccion = 'GestionProducto/Requerimiento/Requerimiento_GetDataCombos?par=' + JSON.stringify(parametro);
             _Get(urlaccion)
                 .then((response) => {
                     let rpta = response !== '' ? JSON.parse(response) : null;
                     if (rpta !== null) {
                         ovariables.arr_cliente = rpta[0].cliente != '' ? JSON.parse(rpta[0].cliente) : [];
                         ovariables.arr_temporada = rpta[0].temporada != '' ? JSON.parse(rpta[0].temporada) : [];
                         ovariables.arr_temporadacliente = rpta[0].temporadacliente != '' ? JSON.parse(rpta[0].temporadacliente) : [];
                         ovariables.arr_fabrica = rpta[0].fabrica != '' ? JSON.parse(rpta[0].fabrica) : [];
                         ovariables.arr_fabricacliente = rpta[0].fabricacliente != '' ? JSON.parse(rpta[0].fabricacliente) : [];
                         ovariables.arr_tipomuestra = rpta[0].tipomuestra != '' ? JSON.parse(rpta[0].tipomuestra) : [];
                         ovariables.arr_tipomuestracliente = rpta[0].tipomuestracliente != '' ? JSON.parse(rpta[0].tipomuestracliente) : [];
                         ovariables.arr_estilo = rpta[0].estilo != '' ? JSON.parse(rpta[0].estilo) : [];
                         ovariables.arr_estiloclientetemporadafabrica = rpta[0].estiloclientetemporadafabrica != '' ? JSON.parse(rpta[0].estiloclientetemporadafabrica) : [];
                         ovariables.arr_actividad = rpta[0].actividad != '' ? JSON.parse(rpta[0].actividad) : [];
                         ovariables.arr_estado = rpta[0].estado != '' ? JSON.parse(rpta[0].estado) : [];
                     }

                     fn_load_cliente();
                     fn_load_temporada();
                     fn_load_fabrica();
                     fn_load_tipomuestra();
                     fn_load_estilo();
                     fn_load_actividad();
                     fn_load_estado();

                 }, (p) => { err(p); })
                 .then(() => {
                     req_info();
                 })
             ;
         }

         function fn_load_cliente() {
             let arr_cliente = ovariables.arr_cliente,
                 cbo_cliente = '';

             if (arr_cliente.length > 0) {
                 arr_cliente.forEach(x=> {
                     obj = {},
                     obj.idcliente = x.idcliente;
                     ovariables.arr_id_cliente.push(obj);
                     cbo_cliente += `<option value='${x.idcliente}'>${x.cliente}</option>`;
                 });

                 $(".chosen-container").css("pointer-events", "");
                 $(".chosen-choices").css("background-color", "");
             }
             else { ovariables.arr_id_cliente = []; }

             ovariables.arr_id_cliente_selection = ovariables.arr_id_cliente;
             _('cbo_cliente').innerHTML = cbo_cliente;
             $(".chosen-select").trigger('chosen:updated');

         }

         function fn_load_temporada() {
             let arr_id_cliente_selection = ovariables.arr_id_cliente_selection,
                 arr_temporada = ovariables.arr_temporada,
                 arr_temporadacliente = ovariables.arr_temporadacliente,
                 cbo_temporada = `<option value='0'>Seleccione Temporada</option>`;

             let resultado_temporadacliente = [],
                 resultado_temporada = [];

             resultado_temporadacliente = arr_temporadacliente.filter(m=> arr_id_cliente_selection.some(y=> { return (y.idcliente === m.idcliente) }));
             resultado_temporada = arr_temporada.filter(n=> resultado_temporadacliente.some(w=> { return (w.codigoclientetemporada === n.codigoclientetemporada) }));

             if (resultado_temporada.length > 0) { resultado_temporada.forEach(x=> { cbo_temporada += `<option value='${x.codigoclientetemporada}'>${x.clientetemporada}</option>`; }); }

             _('cbo_temporada').innerHTML = cbo_temporada;
             $('#cbo_temporada').select2();
         }

         function fn_load_fabrica() {
             let arr_id_cliente_selection = ovariables.arr_id_cliente_selection,
                 arr_fabrica = ovariables.arr_fabrica,
                 arr_fabricacliente = ovariables.arr_fabricacliente,
                 cbo_fabrica = `<option value='0'>Seleccione Fabrica</option>`;

             let resultado_fabricacliente = [],
                resultado_fabrica = [];

             resultado_fabricacliente = arr_fabricacliente.filter(l=> arr_id_cliente_selection.some(u=> { return (u.idcliente === l.idcliente) }));
             resultado_fabrica = arr_fabrica.filter(o=>resultado_fabricacliente.some(z=> { return (z.idproveedor === o.idproveedor) }));
             if (resultado_fabrica.length > 0) { resultado_fabrica.forEach(x=> { cbo_fabrica += `<option value='${x.idproveedor}'>${x.proveedor}</option>`; }); }

             _('cbo_fabrica').innerHTML = cbo_fabrica;
             $('#cbo_fabrica').select2();
         }

         function fn_load_tipomuestra() {
             let arr_id_cliente_selection = ovariables.arr_id_cliente_selection,
                 arr_tipomuestra = ovariables.arr_tipomuestra,
                 arr_tipomuestracliente = ovariables.arr_tipomuestracliente,
                 cbo_tipomuestra = `<option value='0'>Seleccione Tipo Muestra</option>`;

             let resultado_tipomuestracliente = [],
                resultado_tipomuestra = [];

             resultado_tipomuestracliente = arr_tipomuestracliente.filter(l=> arr_id_cliente_selection.some(u=> { return (u.idcliente === l.idcliente) }));
             resultado_tipomuestra = arr_tipomuestra.filter(o=> resultado_tipomuestracliente.some(z=> { return (z.idtipomuestra === o.idtipomuestra) }));
             if (resultado_tipomuestra.length > 0) { resultado_tipomuestra.forEach(x=> { cbo_tipomuestra += `<option value='${x.idtipomuestra}'>${x.tipomuestra}</option>`; }); }

             _('cbo_tipomuestra').innerHTML = cbo_tipomuestra;
             $('#cbo_tipomuestra').select2();
         }

         function fn_load_estilo() {
             let arr_id_cliente_selection = ovariables.arr_id_cliente_selection,
                 codigoclientetemporada = _('cbo_temporada').value,
                 idproveedor = _('cbo_fabrica').value,
                 arr_estilo = ovariables.arr_estilo,
                 arr_estiloclientetemporadafabrica = ovariables.arr_estiloclientetemporadafabrica,
                 cbo_estilo = '';

             let resultado_estilocliente = [],
                 resultado_estilocliente_temporadafabrica = [],
                 resultado_estilo = [];

             resultado_estilocliente = arr_estiloclientetemporadafabrica.filter(j=> arr_id_cliente_selection.some(t=> { return (t.idcliente === j.idcliente) }));
             resultado_estilocliente_temporadafabrica = resultado_estilocliente.filter(k=>
                 (codigoclientetemporada === '0' || k.codigoclientetemporada === codigoclientetemporada) &&
                 (idproveedor.toString() === '0' || k.idproveedor.toString() === idproveedor.toString())
                 );
             resultado_estilo = arr_estilo.filter(i=> resultado_estilocliente_temporadafabrica.some(s=> { return (s.codigoestilo === i.codigoestilo) }));

             if (resultado_estilo.length > 0) {
                 resultado_estilo.forEach(x=> {
                     obj = {},
                     obj.codigoestilo = x.codigoestilo;
                     ovariables.arr_id_estilo.push(obj);
                     cbo_estilo += `<option value='${x.codigoestilo}'>${x.estilo}</option>`;
                 });

                 $(".chosen-container").css("pointer-events", "");
                 $(".chosen-choices").css("background-color", "");
             }
             else { ovariables.arr_id_estilo = []; }

             ovariables.arr_id_estilo_selection = ovariables.arr_id_estilo;
             _('cbo_estilo').innerHTML = cbo_estilo;
             $(".chosen-select").trigger('chosen:updated');
         }

         function fn_load_actividad() {
             let arr_actividad = ovariables.arr_actividad,
                 cbo_actividad = `<option value='0'>Seleccione Actividad</option>`;

             if (arr_actividad.length > 0) {
                 arr_actividad.forEach(x=> { cbo_actividad += `<option value='${x.idactividad}'>${x.actividad}</option>`; });
             }

             _('cbo_actividad').innerHTML = cbo_actividad;
             $('#cbo_actividad').select2();
         }

         function fn_load_estado() {
             let arr_estado = ovariables.arr_estado,
                 cbo_estado = `<option value='0'>Seleccione Estado</option>`;

             if (arr_estado.length > 0) {
                 arr_estado.forEach(x=> { cbo_estado += `<option value='${x.codigoestado}'>${x.estado}</option>`; });
             }

             _('cbo_estado').innerHTML = cbo_estado;
             $('#cbo_estado').select2();
         }

         function req_info() {
             let err = function (__err) { console.log('err', __err) };
             let codigoclientetemporada = _('cbo_temporada').value,
                 idproveedor = _('cbo_fabrica').value,
                 idtipomuestra = _('cbo_tipomuestra').value,
                 idactividad = _('cbo_actividad').value,
                 codigoestado = _('cbo_estado').value,
                 fechainicio = _('txt_fecha_inicial').value,
                 fechafin = _('txt_fecha_fin').value,
                 chkfecha = ovariables.chkfecha;

             let cliente = '';
             ovariables.arr_id_cliente_selection.forEach(x=> { cliente += x.idcliente + ','; });
             cliente = cliente.slice(0, -1);

             //let estilo = '';
             //ovariables.arr_id_estilo_selection.forEach(x=> { estilo += x.codigoestilo + ','; });
             //estilo = estilo.slice(0, -1);

             let parametro = { codigoclientetemporada: codigoclientetemporada, idproveedor: idproveedor, idtipomuestra: idtipomuestra, idactividad: idactividad, codigoestado: codigoestado, fechainicio: fechainicio, fechafin: fechafin, chkfecha: chkfecha, cliente: cliente };
             let urlaccion = 'GestionProducto/Requerimiento/Requerimiento_List?par=' + JSON.stringify(parametro);
             _Get(urlaccion)
                 .then((response) => {
                     let rpta = response !== '' ? JSON.parse(response) : null;
                     if (rpta !== null) { ovariables.arr_requerimiento = rpta[0].requerimiento != '' ? JSON.parse(rpta[0].requerimiento) : []; }
                     req_load_requerimiento();
                 }, (p) => { err(p); });
         }

         function req_load_requerimiento() {
             let arr_requerimiento = ovariables.arr_requerimiento,
                 arr_id_estilo_selection = ovariables.arr_id_estilo_selection,
                 resultado_requerimiento = [];

             resultado_requerimiento = arr_requerimiento.filter(j=> arr_id_estilo_selection.some(t=> { return (t.codigoestilo === j.codigoestilo) }));

             fn_load_requerimiento(resultado_requerimiento);
         }

         function fn_load_requerimiento(_resultado_requerimiento) {
             let resultado_requerimiento = _resultado_requerimiento,
              html = '', htmlheader = '', htmlbody = '';

             htmlheader = `
                <table id="tbl_requerimiento" class ="stripe row-border order-column" style="width: 100%; max-width: 100%;  padding-right: 0px;">
                    <thead>
                        <tr>
                            <th># Req.</th>
                            <th>F. Prog</th>
                            <th>F. Real</th>
                            <th>Estatus</th>
                            <th>Cliente</th>
                            <th>Fábrica</th>
                            <th>Temporada</th>
                            <th>Estilo</th>
                            <th>Muestra</th>
                            <th>Actividad</th>
                        </tr>
                    </thead>
                    <tbody>
                `
             ;

             resultado_requerimiento.forEach(x=> {
                 htmlbody += `
                    <tr>
                        <td>${x.codigo_requerimiento}</td>
                        <td>${x.fechaprogramacion}</td>
                        <td>${x.fechareal}</td>
                        <td>${x.estado}</td>
                        <td>${x.cliente}</td>
                        <td>${x.proveedor}</td>
                        <td>${x.clientetemporada}</td>
                        <td>${x.estilo}</td>
                        <td>${x.tipomuestra}</td>
                        <td>${x.actividad}</td>
                    </tr>
                `;
             });

             html += htmlheader + htmlbody + '</tbody></table>';
             _('div_tabla_requerimiento').innerHTML = html;

             let tbl = _('tbl_requerimiento').tBodies[0], total = tbl.rows.length;
             //handler_table(total);
             format_table();
         }

         function format_table() {
             $('#tbl_requerimiento').DataTable({
                 scrollY: "455px",
                 scrollX: true,
                 scrollCollapse: true,
                 ordering: false,
                 searching: false,
                 info: false,
                 bPaginate: false
                 //"pageLength": 50
             });
         }

         return {
             load: load,
             req_ini: req_ini
         }
     }

)(document, 'pnl_requerimiento_view');

(function ini() {
    app_Requerimiento_View.load();
    app_Requerimiento_View.req_ini();
})();

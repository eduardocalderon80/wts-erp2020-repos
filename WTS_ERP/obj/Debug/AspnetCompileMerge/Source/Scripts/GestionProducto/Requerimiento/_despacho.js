function load() {
    _('_btn_aceptardespacho').addEventListener('click', aceptardespacho_modal);
    $('#div_general_exactualdate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' }).datepicker("setDate", new Date());
    carga_encabezado();
    
    $("#chkDespacho").change(function () {
        var checked = $(this).is(':checked');
        if (checked) {
            $(".chk_despacho").each(function () {              
                $(this).prop("checked", true);
                changechkdespacho(this)
             });
        } else {
            $(".chk_despacho").each(function () {
                $(this).prop("checked", false);
            });
        }
    });
}

function changechkdespacho(e) {     
    if ($(e).is(':checked')) {
        let fila = $(e).closest('tr')
        , celda = fila.find('._clsactualdatedespacho')
        , fecha = _('txt_general_exactualdate_despacho').value;
        celda.val(fecha).datepicker('update')
    }    
}
 
function carga_encabezado() {
    let parametro = document.getElementById('txtparDespacho').value;
    let cliente = _getPar(parametro, 'cliente');
    let temporada= _getPar(parametro, 'temporada');
    let estilo= _getPar(parametro, 'estilo');

    _('_despacho_cliente').innerHTML = cliente;
    _('_despacho_temporada').innerHTML = temporada;
    _('_despacho_estilo').innerHTML = estilo;
}

function obtenerdespacho_modal() {
        //let idrequerimiento = 3, // _('cboTemporadaxCliente').value,
        let idrequerimiento = _('hf_idrequerimiento').value,
        urlaccion = 'GestionProducto/Requerimiento/ObtenerDespacho',
        parametros = JSON.stringify({ idrequerimiento: idrequerimiento });
     
        urlaccion += '?par=' + parametros;
        Get(urlaccion, pintartabla_despacho);
}
  
function pintartabla_despacho(data) {
    let rpta = data != null ? JSON.parse(data) : null //, dataparse = JSON.parse(rpta.Data)

    $('#_tbody_tbl_despacho').html('');
    if (rpta != '') {
        // LLenar despacho 
        let requerimientodetalle = CSVtoJSON(rpta[0].requerimientodetalle, '¬', '^');
        llenartabla_despacho(requerimientodetalle);

        // LLenar history 
        let history = CSVtoJSON(rpta[0].despacho, '¬', '^');
        llenartabla_history(history);       
    }
}

function llenartabla_history(data) {
    let tbody = $('#_tbody_tbl_history')[0], html = '';
        tbody.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='idrequerimientodetalle:${data[i].idrequerimientodetalle},estado:${data[i].estado},iddespachodetalle:${data[i].iddespachodetalle}'>
                <td class="text-center">
                   <div class='btn-group'>
                        <button class='btn btn-danger btn-sm' onclick='VentanaEliminar(${data[i].idrequerimientodetalle},${data[i].iddespachodetalle})' >
                            <span class='fa fa-trash'></span>
                        </button>                       
                    </div>
                </td>
                <td>${data[i].nombreclientecolor}</td>
                <td>${data[i].nombreclientetalla}</td>
                <td class="text-right">${data[i].rejected}</td>
                <td class="text-right">${data[i].cantidad}</td>
                <td class="text-right">${data[i].cantidadcm}</td>
                <td class="text-center">${data[i].actualdate}</td>
                <td class="text-center">
                    ${data[i].usuario}
                </td>
                <td class="text-center" >
                   ${data[i].fecha}
                </td>                
              </tr>`;
        }
        tbody.innerHTML = html;         
    }
}

function VentanaEliminar(idrequerimientodetalle, iddespachodetalle) {       
    swal({
        title: "Are you sure to delete?",
        text: "",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        EliminarDespacho(idrequerimientodetalle, iddespachodetalle)
        return;
    });
}
    
function EliminarDespacho(idrequerimientodetalle, iddespachodetalle) {
    let form = new FormData()
    let urlaccion = 'GestionProducto/Requerimiento/EliminarDespacho',
        parametro = { idrequerimientodetalle: idrequerimientodetalle, iddespachodetalle: iddespachodetalle };

    form.append('par', JSON.stringify(parametro));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            _swal({ estado: 'success', mensaje: 'Shipment was deleted' });
            
            _promise()
                .then(() => {
                    obtenerdespacho_modal();
                })
                .then(() => {
                    parametro = _('hf_idrequerimiento').value;
                    urlaccion = 'GestionProducto/Requerimiento/getRequerimientobyId?par=' + parametro;
                    return _Get(urlaccion)
                })
             .then((rpta) => {
                 let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;

                 odataDetalle = CSVtoJSON(orpta[0].requerimientodetalle, '¬', '^');
                 llenartabladetalle(odataDetalle);
                 handlerAccionTblTallaColor();
             })
        }
        else {
            _swal({ estado: 'error', mensaje: 'Shipment could not delete' });
        }
    });
    return;
}

function llenartabla_despacho(data) {
    let tbody = $('#_tbody_tbl_despacho')[0], html = '';
    tbody.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {            
            html += `<tr data-par='idrequerimientodetalle:${data[i].idrequerimientodetalle},estado:${data[i].estado}'>              
                <td>${data[i].nombreclientecolor}</td>
                <td>${data[i].nombreclientetalla}</td>
                <td class ="text-right" title='Cantidad requerida por el cliente'>${data[i].cantidadreq}</td>
                <td class ="text-right" title='Cantidad contramuestra requerida por el cliente'>${data[i].cantidadcmreq}</td>
                <td class ="text-right" title='Cantidad despachada'>${data[i].cantidaddesp}</td>
                <td class ="text-right" title='Cantidad contramuestra despachada'>${data[i].cantidadcmdesp}</td>
                <td class ="text-right" title='Cantidad de rechazo'>${data[i].rejected}</td>
                <td title='Conteo de rechazo'>
                    <input type='text' value='0' class='form-control text-right _clsrejected_despacho' data-type='int' maxlength="2" data-min='1' data-max='2' data-value='0'  onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td title='Cantidad por despachar'>
                    <input type='text' value='${data[i].cantidad}' class='form-control text-right _clscantidad_despacho' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td title='Cantidad contramuestra por despachar'>
                    <input type='text' value='${data[i].cantidadcm}' class='form-control text-right _clscantidadcontramuestra_despacho' data-type='int' data-min='1' data-max='7' data-required="true" onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)" />
                </td>
                <td title='Actual date' style='vertical-align:middle;'>
             
                   <div class ='col-sm-1 text-center form-check' >
                        <input type='checkbox' class ='form-check-input chk_despacho' name='chkDespacho' onchange='changechkdespacho(this)' />
                   </div>
                   <div class='col-sm-9' id='div_despacho_exactualdate' style='padding:0px;'>
                        <div class='input-group date'>
                               <input type='text' style='padding:0px;' class ='form-control _clsactualdatedespacho'  data-type='date' data-min='10' data-max='10' data-required='true' data-level='true'>
                               <div class ='input-group-addon'>
                                     <span class ='fa fa-calendar'></span>
                               </div>
                        </div>
                   </div>
          
                </td>
                <td title='' >
                    <input type='checkbox' class='js-switch' checked onchange='ValidarSwitch(this)' />
                </td>             
              </tr>`;
        }
        tbody.innerHTML = html;
    
            $('#div_despacho_exactualdate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' }).datepicker("setDate", new Date());
        
         
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

        elems.forEach(function (html) {
            var switchery = new Switchery(html);
        });

        let table = _('_tbody_tbl_despacho'), filas = table.rows.length;
        let ocampos = {
            rejectedoriginal: 6,
            rejectedactual: 7,
            cantidad: 8,
            cantidadcm: 9,            
            fecha: 10,
            controlswich: 11
        }

        for (let i = 0; i < filas; i++) {
            let row = table.rows[i];                  
            par = row.getAttribute("data-par"), idrequerimientodetalle = _par(par, 'idrequerimientodetalle'), estado = _par(par, 'estado');
            if (estado == 1) {
                row.cells[ocampos.rejectedactual].children[0].setAttribute('disabled', false);
                row.cells[ocampos.cantidad].children[0].setAttribute('disabled',false);//6
                row.cells[ocampos.cantidadcm].children[0].setAttribute('disabled', false);//7
                row.cells[ocampos.fecha].children[0].children[0].setAttribute('disabled', false);
                row.cells[ocampos.fecha].children[1].children[0].children[0].setAttribute('disabled', false);
            } else if (estado == 0) {
                let switc = row.cells[ocampos.controlswich].children[0];
                $(switc).trigger("click")            
            }
        }
    }
}

function ValidarSwitch(e) {
    let fila = $(e).closest('tr'),
        par = $(fila).attr("data-par"),
        idrequerimientodetalle = _par(par, 'idrequerimientodetalle'),
        estado = _par(par, 'estado');
     
    if (e.checked) {
        fila.find('._clsrejected_despacho').prop('disabled', 'disabled'),
        fila.find('._clscantidad_despacho').prop('disabled', 'disabled'),
        fila.find('._clscantidadcontramuestra_despacho').prop('disabled', 'disabled');
        fila.find('.chk_despacho').prop('disabled', 'disabled');
        fila.find('._clsactualdatedespacho').prop('disabled', 'disabled');
    }
    else
    {
        fila.find('._clsrejected_despacho').prop('disabled', ''),
        fila.find('._clscantidad_despacho').prop('disabled', ''),
        fila.find('._clscantidadcontramuestra_despacho').prop('disabled', '');
        fila.find('.chk_despacho').prop('disabled', '');
        fila.find('._clsactualdatedespacho').prop('disabled', '');
    }     
}

function get_despachodetalle(idtabla, oparameter) {
    let arr = [],
        tbl = document.getElementById(idtabla),
        x = 0, q = (tbl !== null) ? tbl.rows.length : 0,
        row = null;
    if (q > 0) {
        let ocampos = {
            rejectedoriginal: 6,
            rejectedactual:7,
            cantidad: 8,    //ok
            cantidadcm: 9,  //ok
            fecha:10,
            controlswich: 11    //ok
        }

        for (x = 0; x < q; x++) {
            row = tbl.rows[x];
            let par = row.getAttribute('data-par')
            , valorEstado = 0
            , ControlSwitch = row.cells[ocampos.controlswich].children[0];
            if (ControlSwitch.checked) { valorEstado = 1 }
            let rejectedactual = row.cells[ocampos.rejectedactual].children[0].value,
            actualdate = row.cells[ocampos.fecha].children[1].children[0].children[0].value;

            let obj = {
                idrequerimientodetalle: _par(par, 'idrequerimientodetalle'),
                cantidad: row.cells[ocampos.cantidad].children[0].value,
                cantidadcm: row.cells[ocampos.cantidadcm].children[0].value,
                estado: valorEstado,
                rejectedoriginal: parseInt(row.cells[ocampos.rejectedoriginal].innerHTML),
                rejectedactual: rejectedactual.length > 0 ? parseInt(rejectedactual) : 0,
                fecha: _convertDate_ANSI(actualdate)
            }
            arr[x] = obj;
        }
    }  
    return arr;
}

function validarfechadespacho() {
    let mensaje = "",fechaactual = new Date(), anio = fechaactual.getFullYear(), mes = fechaactual.getMonth(), dia = fechaactual.getDate(), strfechaActual = anio.toString() + ('0' + (mes + 1).toString()).slice(-2) + ('0' + dia.toString()).slice(-2);
       
    $('._clsactualdatedespacho').each(function () {
        let fecha = this.value
        , fila = $(this).closest('tr').index() + 1
        , actualdate = _convertDate_ANSI(fecha)
        if (actualdate > strfechaActual) {
            mensaje += "- En la fila " + fila + ", Actual Date " + fecha + " es mayor que la fecha de hoy </br>";
        }
    });
    return mensaje;
}

function aceptardespacho_modal() {
    _promise()
    .then(() => {
        return validarfechadespacho();
    })
    .then((mensaje) => {        
        swal({
            title: "Are you sure to save?",
            text: mensaje,
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: false
        }, function () {           
            let arr = get_despachodetalle('_tbody_tbl_despacho', {});
            let arrDespacho = arr.map(x=> {
                return ({
                    idrequerimientodetalle: x.idrequerimientodetalle,
                    cantidad: x.cantidad,
                    cantidadcm: x.cantidadcm,
                    estado: x.estado,
                    fecha: x.fecha
                })
            });
            let arrRechazados = arr.filter(x=> x.rejectedactual > 0)
                .map(x=> {
                    return ({
                        idrequerimientodetalle: x.idrequerimientodetalle,
                        rejectedoriginal: x.rejectedoriginal,
                        rejectedactual: x.rejectedactual,
                        estado: x.estado,
                        fecha: x.fecha
                    })
                });
            let idrequerimiento = _('hf_idrequerimiento').value;
            let par = JSON.stringify({ idrequerimiento: idrequerimiento });

            let form = new FormData();
            form.append("par", par);
            form.append("pardetalle", JSON.stringify(arrDespacho));
            form.append("parsubdetalle", JSON.stringify(arrRechazados));

            Post('GestionProducto/Requerimiento/InsertarDespacho', form, function (respuesta) {
                let orespuesta = JSON.parse(respuesta);
                let estado = orespuesta.estado;
                let data = orespuesta.data;
                let mensaje = estado === 'success' ? 'Se registro los cambios' : 'No se realizo cambios';

                swal({
                    title: 'Mensaje',
                    text: mensaje,
                    type: estado
                }, function () {
                    _promise()
                        .then(() =>{
                            pintartabla_despacho(data);
                        })
                        .then(() => {
                            parametro = _('hf_idrequerimiento').value;
                            urlaccion = 'GestionProducto/Requerimiento/getRequerimientobyId?par=' + parametro;
                            return _Get(urlaccion)
                        })
                        .then((rpta) =>{
                            let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null;
                           
                            odataDetalle = CSVtoJSON(orpta[0].requerimientodetalle, '¬', '^');
                            llenartabladetalle(odataDetalle);
                            handlerAccionTblTallaColor();
                            $('#chkDespacho').prop("checked", false);
                            $('#div_general_exactualdate .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' }).datepicker("setDate", new Date());
                        })
                })                          
            });
            return;
        });
    })
     
    //Post('GestionProducto/Requerimiento/InsertarDespacho', form, function (rpt) {
    //    let orpta = !_isEmpty(rpt) ? JSON.parse(rpt) : null,
    //        data = orpta !== null && orpta.data !== null ? orpta.data : '',
    //        adata = [];
    //    if (data !== '') {            
    //        $('#modal_despacho').modal('hide');
    //    }
    //   // _mensaje(orpta);
    //});   
}

    (
    function ini() {
        load();
        obtenerdespacho_modal();
    }
)();
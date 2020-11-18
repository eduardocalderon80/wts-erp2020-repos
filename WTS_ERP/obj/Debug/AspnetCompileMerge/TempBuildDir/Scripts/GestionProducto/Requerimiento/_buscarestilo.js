function load() {
    _('_btn_searchestilo').addEventListener('click', buscarEstilo_modal);
    _('_btn_aceptarestilo').addEventListener('click', aceptarEstilo_modal);
    _('_txt_estilo').addEventListener('keypress', function (event) {
        if (event.keyCode == 13) {
            buscarEstilo_modal();
        }
    });
}

function res_datacliente_modal(data) {
    let rpta = data != null ? JSON.parse(data) : null;

    if (rpta != null) {
        _('cboTemporadaxCliente').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].temporaxcliente);
        _('cboDivisionxCliente').innerHTML = _comboItem({ value: '0', text: 'Select' }) + _comboFromCSV(rpta[0].clientedivision);
    }
}

function buscarEstilo_modal() {
    let idclientetemporada = _('cboTemporadaxCliente').value, codigoestilo = _('_txt_estilo').value, idclientedivision = _('cboDivisionxCliente').value,
        idcliente = _('cboCliente').value,
        urlaccion = 'GestionProducto/Requerimiento/getData_filtroestilos',
        parametros = JSON.stringify({ idclientetemporada: idclientetemporada, idclientedivision: idclientedivision, codigoestilo: codigoestilo, idcliente: idcliente});

    // VALIDAR ANTES DE BUSCAR
    let pasalavalidacion = validarAntesBuscar();
    if (!pasalavalidacion) {
        return false;
    }

    urlaccion += '?par=' + parametros;

    Get(urlaccion, pintartabla_estilos);
}

function validarAntesBuscar() {
    let idclientetemporada = _('cboTemporadaxCliente').value, codigoestilo = _('_txt_estilo').value, idclientedivision = _('cboDivisionxCliente').value, pasalavalidacion = true
    
    if (codigoestilo.trim() == '') {
        $('#_div_grupo_estilo').addClass('has-error');
        $('#_span_error_codigoestilo').removeClass('hide');
        pasalavalidacion = false;
    } else {
        if (codigoestilo.trim().length <= 2) {
            $('#_div_grupo_estilo').addClass('has-error');
            $('#_span_error_codigoestilo').removeClass('hide');
            pasalavalidacion = false;
        } else {
            $('#_div_grupo_estilo').removeClass('has-error');
            $('#_span_error_codigoestilo').addClass('hide');
        }
    }
    
    return pasalavalidacion;
}

function pintartabla_estilos(rpta) {
    $('#_tbody_tbl_estilos').html('');
    if (rpta != '') {
        let data = CSVtoJSON(rpta, '¬', '^');
        llenartabla_estilos(data);
    }
}

function llenartabla_estilos(data) {
    let tbody = $('#_tbody_tbl_estilos')[0], html = '', rutafileserver_estilo = _('hf_rutafileserver_imgestilo').value;
    //console.log(data)
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='idestilo:${data[i].idestilo},nombretemporada:${data[i].nombretemporada},nombredivision:${data[i].nombredivision},imagenwebnombre:${data[i].imagenwebnombre},nombretela:${data[i].nombretela}'>
                <td class='hide'>
                    <input type='radio' class ='_cls_seleccionarestilos' name='radseleccionarestilo' />
                </td>
                <td class ="text-center"><img class ='img-thumbnail' src='${rutafileserver_estilo + data[i].imagenwebnombre}' alt='${data[i].imagen}' width='100' height='90' /></td>
                <td>${data[i].codigoestilo}</td>
                <td>${data[i].descripcionestilo}</td>
              </tr>`;
        }
        tbody.innerHTML = html;
        handlertrbuscar("_tbody_tbl_estilos");
    }
}

function aceptarEstilo_modal() {
    let tbody = $('#_tbody_tbl_estilos')[0], totalfilas = tbody.rows.length, seleccionado = false;
    
    for (let i = 0; i < totalfilas; i++) {
        seleccionado = tbody.rows[i].cells[0].children[0].checked;
        if (seleccionado) {
           
            let parametro = tbody.rows[i].getAttribute('data-par');
            _('hf_idestilo').value = _par(parametro, 'idestilo');
            _('txt_temporada').value = _par(parametro, 'nombretemporada');
            _('txt_codigoestilo').value = tbody.rows[i].cells[2].innerText;
            _('txta_descripcionestilo').value = tbody.rows[i].cells[3].innerText;
            _('txt_division').value = _par(parametro, 'nombredivision');
            _('hf_nombreimagenestilo').value = _par(parametro, 'imagenwebnombre');
            _('txta_codigotela').innerHTML = _par(parametro, 'nombretela');

            //  PINTAR IMAGEN ESTILO
            let rutafileserver = _('hf_rutafileserver_imgestilo').value;
            _('imgEstilo').src = rutafileserver + _('hf_nombreimagenestilo').value;

            //Cargar color del estilo
            TraerDatosCliente();

            break;
        }
    }

    if (seleccionado == false) {
        _swal({ estado: 'error', mensaje: 'Seleccione el estilo.' });
        return false;
    }

    $('#modal_buscarestilo').modal('hide');
}

function handlertrbuscar(idtbody) {
    let tabla = $("#" + idtbody)[0], totalfilas = tabla.rows.length, i = 0;
    if (totalfilas > 0) {

        for (i = 0; i < totalfilas; i++) {
            tabla.rows[i].addEventListener('click', function (e) {
                let tabla = $("#" + idtbody)[0], totalfilas = tabla.rows.length, i = 0;
                for (i = 0; i < totalfilas; i++) {
                    tabla.rows[i].bgColor = "white";
                }

                let filatr = $(this).closest('tr')[0];
                filatr.children[0].children[0].checked = true;
                filatr.bgColor = "#ccd1d9"; //#a0d468
            }, false);
        }
    }
}

function req_ini() {
    let idcliente = _('cboCliente').value, perfil = $('#txtperfil').val(),
         parametro = { idcliente: idcliente, perfil: perfil },
         urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_datacliente_modal);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
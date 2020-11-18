function load() {
    _('_btn_aceptar_sendemailcom_req').addEventListener('click', fn_enviarCorreo);
}

function fn_enviarCorreo() {
    let req = _required({ id: '_div_body_correo_com', clase: '_enty' });
  
    $('#tblestiloprint_correo ._comentario')[0].innerText = _('_txta_descripcionestilo_com').value;

    if (req) {
        let validacionCorrecta = validarFormatoCorreos();
        if (validacionCorrecta == false) {
            return false;
        }

        let body = $('#_txtCuerpo_com').val(), divBody_oculto = _('_divtxtBody_com_oculto');

        divBody_oculto.getElementsByClassName('_clstxtBody_com_oculto')[0].innerText = body;
      
        let nombreImagenGenerado = _('hf_imagenwebnombre_estilo_com').value, arrayImagenGenerado = nombreImagenGenerado.split('.');
        let concatenarNombreImagen_extension = arrayImagenGenerado[0] + arrayImagenGenerado[1], correoAsunto = _('_txtSubject_sendmail_com').value,
            correoTo = _('_txtTo_sendmail_com').value, correoCC = _('_txtCC_sendmail_com').value, correoCuerpo = '';

        let tbodyComentario = _('_tblBody_Comment'), totalFilasComment = tbodyComentario.rows.length;
 
        // Table de los comentarios ocultos para enviar en el correo
        tbodyComentario_oculto = $("#_divTablaComentarioForCorreo > table > tbody")[0], totalFilasCommentOculto = tbodyComentario_oculto.rows.length;
 
        for (let i = 0; i < totalFilasComment; i++) {
            let row = tbodyComentario.rows[i];
            let par = row.getAttribute('data-par'),  idComentario = _par(par,'idcomentario');

            let chk = $(row.cells[0]).find('.chk').is(':checked');
            
            if (!chk) {
                for (let i = 0; i < totalFilasCommentOculto; i++) {
                    let row = tbodyComentario_oculto.rows[i];
                    let par = row.getAttribute('data-par'), idComentario_oculto = _par(par, 'idcomentario');

                    if (idComentario == idComentario_oculto) {

                        tbodyComentario_oculto.rows[i].style.display = "none";

                    }
                }
            }              
        }

        let html = $("#_div_ParaImprimirCorreoCom_oculto").html(), cadenaListaImagen = concatenarNombreImagen_extension + '¬' + _('hf_imagenwebnombre_estilo_com').value,
            tbodyarchivos = _('_tbody_tbl_archivos_sendmail_com'), totalfilas = tbodyarchivos.rows.length, cadenaListaArchivos = '';
            correoCuerpo = html;

        for (let i = 0; i < totalfilas; i++) {
            let row = tbodyarchivos.rows[i];
            let par = row.getAttribute('data-par');
            let nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
            if ((i + 1) < totalfilas) {
                cadenaListaArchivos += nombrearchivogenerado + '¬' + row.cells[1].innerHTML + '^';
            } else {
                cadenaListaArchivos += nombrearchivogenerado + '¬' + row.cells[1].innerHTML;
            }
        }
        
        let urlbase = _('urlBase').value;
         
        $.ajax({
            type: 'POST',
            url: urlbase + 'GestionProducto/Requerimiento/EnviarCorreCom',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ pCorreoAsunto: correoAsunto, pCorreosTo: correoTo, pCorreosCC: correoCC, pCorreoCuerpo: correoCuerpo, pListaimagen: cadenaListaImagen, pCadenaListaArchivosAdjunto: cadenaListaArchivos })
        }).done(function (resultado) {
            alFinalizarEnviarCorreoMuestra(resultado);
        });
    }
}

function alFinalizarEnviarCorreoMuestra(resultado) {
    let orpta = resultado, estado = '';
    if (orpta.Success == true) {
        estado = 'success';
    } else {
        estado = 'error';
    }
    _swal({ estado: estado, mensaje: orpta.Message });
    if (orpta.Success == true) {
        $('#modal_enviarcorreocom').modal('hide');
    }
}

function res_ini(data) {
    let orpta = data != null ? JSON.parse(data) : null;
    if (orpta != null) {
        let correoto = orpta[0].correopara, correocc = orpta[0].correocc, orequerimiento = JSON.parse(orpta[0].requerimiento),
            orequerimientodetalle = CSVtoJSON(orpta[0].requerimientodetalle), orequerimientoarchivo = CSVtoJSON(orpta[0].archivos), odataComentario = CSVtoJSON(orpta[0].comentario, '¬', '^');

        _('_txtTo_sendmail_com').value = correoto;
        _('_txtCC_sendmail_com').value = correocc;
        _('_txt_client_com').value = orequerimiento.nombrecliente;
        _('_txt_tipomuestra_com').value = orequerimiento.nombretipomuestra;
        _('_txt_temporada_com').value = orequerimiento.nombretemporada;
        _('_txt_division_com').value = orequerimiento.nombredivision;
        _('_txt_codigoestilo_com').value = orequerimiento.codigoestilo;
        //_('_txta_comentario').value = orequerimiento.comentario;
        _('_txtSubject_sendmail_com').value = 'WTS-RDP:' + orequerimiento.nombrecliente + '/' + orequerimiento.nombretemporada + '/' + orequerimiento.nombredivision + '/' + orequerimiento.codigoestilo + '/' + orequerimiento.nombretipomuestra;
        _('hf_imagenwebnombre_estilo_com').value = orequerimiento.imagenwebnombre;
        _('_txta_descripcionestilo_com').innerHTML = orequerimiento.nombretela;

        let rutafileserver = _('hf_rutafileserver_imgestilo').value;
        _('_imgEstilo_com').src = rutafileserver + orequerimiento.imagenwebnombre;

        llenarTablaComentario(odataComentario);
        llenartablaarchivos(odataComentario);
        generarTablaEstiloForCorreo(orequerimiento);
    }
}
 
function llenarTablaComentario(data) {
    let tbl = _('_tblBody_Comment'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr  data-par='idcomentario:${data[i].idcomentario}'>
                <td class ='text-center'><input type='checkbox' class ='chk' checked name='chkMostrar' /></td>
                <td>   ${data[i].comentario}   </td>
                <td>${data[i].Usuario}</td>
                <td>${data[i].Fecha}</td>
                
            </tr>`;
        }
        tbl.innerHTML = html;
    }
}

function llenartablaarchivos(data) {
    let tbl = _('_tbody_tbl_archivos_sendmail_com'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {

            if (data[i].nombrearchivo.length > 0) {
                html += `<tr data-par='idarchivo:${data[i].idcomentario},modificado:0,nombrearchivogenerado:${data[i].nombrearchivoweb}'>
                    <td class='text-center'>
                        <div class ='btn-group'>
                            <button class ='btn btn-danger btn-sm _deletefile'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </div>
                    </td>
                    <td>${data[i].nombrearchivo}</td>
                </tr>
            `;
            }          
        }

        tbl.innerHTML = html;
        handlerTblArchivos();

        // PARA COMENTARIO
        let htmlTablaTallaColor = _('_div_gridestilo_com').innerHTML;
  
            _('_divTablaComentarioForCorreo').innerHTML = htmlTablaTallaColor;
            let tabla2 = $("#_divTablaComentarioForCorreo > table")[0], totalFilas = tabla2.rows.length, i = 0, tablaHeader = $("#_divTablaComentarioForCorreo > table > thead")[0],
                        totalColumnasHeader = tablaHeader.rows[0].cells.length, tablaBody = $("#_divTablaComentarioForCorreo > table > tbody")[0], totalColumnasBody = tablaBody.rows[0].cells.length, totalFilasBody = tablaBody.rows.length;

            tabla2.style.border = "1px solid #ccc";
            tabla2.style.borderColor = "black";
            tabla2.style.cellpadding = '0';
            tabla2.style.cellspacing = '0';
            tabla2.style.borderCollapse = 'collapse';
            // PARA EL HEADER
            for (i = 0; i < totalColumnasHeader; i++) {
                tabla2.rows[0].cells[i].style.verticalAlign = 'middle';
                tabla2.rows[0].cells[i].style.background = '#4682B4';
                tabla2.rows[0].cells[i].style.fontWeight = 'bold';
                tabla2.rows[0].cells[i].style.textAlign = 'center';
                tabla2.rows[0].cells[i].style.color = "#FFFFFF";
                tabla2.rows[0].cells[i].style.padding = "2px 2px 2px 2px";
                tabla2.rows[0].cells[i].style.borderCollapse = 'collapse';
                tabla2.rows[0].cells[i].style.border = "1px solid black";

                if (i == 0) {
                    tabla2.rows[0].cells[i].style.display = 'none';
                }
                if (i == 1) {
                    tabla2.rows[0].cells[i].style.width = '400px';
                } else {
                    tabla2.rows[0].cells[i].style.width = '50px';
                }
            }

            for (j = 0; j < totalFilasBody; j++) {
                for (i = 0; i < totalColumnasBody; i++) {
                    tablaBody.rows[j].cells[i].style.verticalAlign = 'middle';
                    tablaBody.rows[j].cells[i].style.fontWeight = 'normal';
                    tablaBody.rows[j].cells[i].style.borderCollapse = 'collapse';
                    tablaBody.rows[j].cells[i].style.padding = "2px 2px 2px 2px";
                    tablaBody.rows[j].cells[i].style.border = "1px solid black";
                    if (i == 0) {
                        tablaBody.rows[j].cells[i].style.display = 'none';
                    } if (i == 1) {
                        tablaBody.rows[j].cells[i].style.width = '400px';
                    }
                    else {
                        tablaBody.rows[j].cells[i].style.width = '50px';
                    }
                }
            }
     

    }
}

function handlerTblArchivos() {
    let tbl = _('_tbody_tbl_archivos_sendmail_com'), arrayDelete = _Array(tbl.getElementsByClassName('_deletefile'));
    arrayDelete.forEach(x => x.addEventListener('click', e => { evento_archivos_sendmail(e) }));
}

function evento_archivos_sendmail(event) {
    let o = event.target, tag = o.tagName, fila = null;

    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode.parentNode;
            break;
    }

    if (fila != null) {
        let filaIndex = parseInt(fila.rowIndex) - 1;
        let tbl = _('_tbody_tbl_archivos_sendmail_com');
        tbl.deleteRow(filaIndex);
    }
}

function generarTablaEstiloForCorreo(orequerimiento) {
    _('divTablaEstiloCorreoCom').innerHTML = '';
    let rutafileserver = _('hf_rutafileserver_imgestilo').value, rutaimagen = rutafileserver + orequerimiento.imagenwebnombre, nombreimagengenerado = orequerimiento.imagenwebnombre;
    let array_nombreimagen = nombreimagengenerado.split('.');
    let nombreimagenconcatenado = array_nombreimagen[0] + array_nombreimagen[1];

    //<img src='${rutaimagen}' style='height: 100px; width: 80px; border-color: black;' />
    let html = `<table style="border: 1px solid #ccc; border-color: black;" cellpadding="0" cellspacing="0" id="tblestiloprint_correo">
        <tr>
            <td rowspan="7" style='width:150px; text-align:center;'>
                <img src='cid:${nombreimagenconcatenado}' height=150 width=100 style='height: 80%; width: 80%; border-color: black; display:block;' />
            </td>
            <td style='width:150px;padding-left: 10px;'>
                    <strong>Client:</strong>
            </td>
            <td style='width:532px;'>
                ${orequerimiento.nombrecliente}
            </td>
        </tr>
        <tr>
            <td style='padding-left: 10px;'>
                <strong>Type:</strong>
            </td>
            <td>
                ${orequerimiento.nombretipomuestra}
            </td>
        </tr>
        <tr>
            <td style='padding-left: 10px;'>
                    <strong>Season:</strong>
            </td>
            <td>
                ${orequerimiento.nombretemporada}
            </td>
        </tr>
        <tr>
            <td style='padding-left: 10px;'>
                    <strong>Division:</strong>
            </td>
            <td>
                ${orequerimiento.nombredivision}
            </td>
        </tr>
        <tr>
            <td style='padding-left: 10px;'>
                <strong>Style:</strong>
            </td>
            <td>
                ${orequerimiento.codigoestilo}
            </td>
        </tr>
        <tr>
            <td style='padding-left: 10px;'>
                <strong>Fabric:</strong>
            </td>
            <td style='padding-left: 10px;' class ='_comentario'>
            </td>
        </tr>     
    </table>`;
    _('divTablaEstiloCorreoCom').innerHTML = html;

    //// PARA COMENTARIOS
    //html = '';
    //html = `
    //    <div>
    //        <label><strong>Additional Instruction</strong></label>
    //    </div>
    //    <table id="tblComentario" style="border: 1px solid #ccc; border-color: black;" cellpadding="0" cellspacing="0">
    //        <tbody><tr>
    //            <td class='_clscomentarioadicional_sendmail' style="width: 832px; height: 100px; text-align: start; vertical-align: top; padding-top: 5px; padding-left: 10px;">
    //                ${orequerimiento.comentario}
    //            </td>
    //        </tr>
    //    </tbody></table>
    //    `;
    //_('_divComentarioFor_Correo_oculto').innerHTML = html;
}

function validarFormatoCorreos() {
    let divprincipal = _('_div_body_correo_com'), arrayCamposCorreo = _Array(divprincipal.getElementsByClassName('validarCorreo')), validacionFormatoCorreo = false,
        valorInput = "", arrayCorreos = [], mensajeErrorValidacionCorreo = '', pasolavalidacionformatocorreo = true;

    let totalCamposCorreo = arrayCamposCorreo.length;
    for (i = 0; i < totalCamposCorreo; i++) {
        arrayCorreos = [];
        //dataName = camposCorreo[i].getAttribute("data-name");
        valorInput = arrayCamposCorreo[i].value;
        let idCampo = arrayCamposCorreo[i].getAttribute('id');
        // SI LOS CORREOS ESTAN SEPARADOS POR COMA(,) REEMPLAZARLO POR PUNTO Y COMA(;)
        valorInput = valorInput.replace(";", ",");
        arrayCamposCorreo[i].value = valorInput;

        arrayCorreos = valorInput.split(',');
        let totalArray = arrayCorreos.length;
        if (totalArray > 0) {
            for (j = 0; j < totalArray; j++) {
                valorInput = $.trim(arrayCorreos[j]);
                validacionFormatoCorreo = _validateEmail(valorInput);  // ESTA FUNCION validateEmail ESTA EN UTIL.JS
                if (validacionFormatoCorreo == false) {
                    //_('_span_error' + idCampo).removeClass('hide');
                    let idspan = '_span_error' + idCampo;
                    $('#' + idspan).removeClass('hide');
                    mensajeErrorValidacionCorreo += "- Error in mail format in";
                    pasolavalidacionformatocorreo = false;
                    break;
                }
            }
        }
    }
    return pasolavalidacionformatocorreo;
}

function req_ini() {
    let idrequerimiento = _('hf_idrequerimiento').value, parametro = JSON.stringify({ idrequerimiento: idrequerimiento });
    let urlaccion = 'GestionProducto/Requerimiento/getData_requerimientoParaEnviarCorreo?par=' + parametro;
    Get(urlaccion, res_ini);
}

(
    function ini() {
        load();
        req_ini();
        _rules({ id: '_div_body_correo_com', clase: '_enty' });
    }

)();
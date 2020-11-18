function load() {
    _('_btn_aceptar_sendemail_req').addEventListener('click', fn_enviarCorreo);
}

function fn_enviarCorreo() {
    let req = _required({ id: '_div_body_correo', clase: '_enty' });
    //let divprincipal = _('_div_body_correo'), arrayCamposCorreo = _Array(divprincipal.getElementsByClassName('validarCorreo')), validacionFormatoCorreo = false,
    //    valorInput = "", arrayCorreos = [], mensajeErrorValidacionCorreo = '';

    $('#tblestiloprint_correo ._comentario')[0].innerText = _('_txta_descripcionestilo').value;

    if (req) {
        let validacionCorrecta = validarFormatoCorreos();
        if (validacionCorrecta == false) {
            return false;
        }

        let body = $('#_txtCuerpo').val(), divBody_oculto = _('_divtxtBody_oculto');

        divBody_oculto.getElementsByClassName('_clstxtBody_oculto')[0].innerText = body;

        // ACTUALIZAR COMENTARIO
        let divcomentarioadicional = _('_div_sendmail_requermiento'), valorcomentarioadicional = divcomentarioadicional.getElementsByClassName('_clscomentarioadicional_sendmail_visible')[0].value,
            tblcomentarioadicional_oculto = _('tblComentario');
        
        // REEMPLAZAR EL COMENTARIO ACIONAL DEL VISIBLE AL OCULTO
        tblcomentarioadicional_oculto.getElementsByClassName('_clscomentarioadicional_sendmail')[0].innerText = valorcomentarioadicional;

        let nombreImagenGenerado = _('hf_imagenwebnombre_estilo').value, arrayImagenGenerado = nombreImagenGenerado.split('.');
        let concatenarNombreImagen_extension = arrayImagenGenerado[0] + arrayImagenGenerado[1], correoAsunto = _('_txtSubject_sendmail').value,
            correoTo = _('_txtTo_sendmail').value, correoCC = _('_txtCC_sendmail').value, correoCuerpo = '';

        let html = $("#_div_ParaImprimirEnCorreo_oculto").html(), cadenaListaImagen = concatenarNombreImagen_extension + '¬' + _('hf_imagenwebnombre_estilo').value,
            tbodyarchivos = _('_tbody_tbl_archivos_sendmail'), totalfilas = tbodyarchivos.rows.length, cadenaListaArchivos = '';
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

        //console.log({ pCorreoAsunto: correoAsunto, pCorreosTo: correoTo, pCorreosCC: correoCC, pCorreoCuerpo: correoCuerpo, pListaimagen: cadenaListaImagen, pCadenaListaArchivosAdjunto: cadenaListaArchivos });
        //$.ajax({
        //    type: 'POST',
        //    url: urlbase + 'GestionProducto/Requerimiento/EnviarCorreoMuestra',
        //    contentType: 'application/json; charset=utf-8',
        //    dataType: 'json',
        //    data: JSON.stringify({ pCorreoAsunto: correoAsunto, pCorreosTo: correoTo, pCorreosCC: correoCC, pCorreoCuerpo: correoCuerpo, pListaimagen: cadenaListaImagen, pCadenaListaArchivosAdjunto: cadenaListaArchivos })
        //}).done(function (resultado) {
        //    alFinalizarEnviarCorreoMuestra(resultado);
        //});

        // Jacob - Armar Correo
        let pCorreoAsunto = _('_txtSubject_sendmail').value;
        let pCorreoPara = _('_txtTo_sendmail').value.replace(/,/g, ';');
        let pCorreosCopia = _('_txtCC_sendmail').value.replace(/,/g, ';');

        // Cambiar /n x <br>
        let observacionFormat = JSON.stringify(_('_txtCuerpo').value).replace(/['"]+/g, '').replace(/\\n/g, "¬");
        let comentarioFormat = JSON.stringify(_('_txta_comentario').value).replace(/['"]+/g, '').replace(/\\n/g, "¬");

        let pCorreoCuerpo = {
            observacion: observacionFormat,
            cliente: _('_txt_client').value,
            tipo: _('_txt_tipomuestra').value,
            temporada: _('_txt_temporada').value,
            division: _('_txt_division').value,
            estilo: _('_txt_codigoestilo').value,
            fabric: _('_txta_descripcionestilo').value,
            detalle: [],
            comentario: comentarioFormat
        };
        for (let i = 0; i < _('_tbody_tbl_tallacolor_sendmail').rows.length; i++) {
            let json = {
                Color: _('_tbody_tbl_tallacolor_sendmail').rows[i].children[0].textContent.trim(),
                Size: _('_tbody_tbl_tallacolor_sendmail').rows[i].children[1].textContent.trim(),
                Quantity: _('_tbody_tbl_tallacolor_sendmail').rows[i].children[2].textContent.trim(),
                Counter: _('_tbody_tbl_tallacolor_sendmail').rows[i].children[3].textContent.trim(),
                Ex: _('_tbody_tbl_tallacolor_sendmail').rows[i].children[4].textContent.trim()
            }
            pCorreoCuerpo.detalle.push(json);
        }
        let pImagenCID = _('hf_imagenwebnombre_estilo').value;
        let files_requerimientos = '';
        for (let i = 0; i < _('_tbody_tbl_archivos_sendmail').rows.length; i++) {
            let row = _('_tbody_tbl_archivos_sendmail').rows[i];
            let par = row.getAttribute('data-par');
            let nombrearchivogenerado = _par(par, 'nombrearchivogenerado');
            if ((i + 1) < _('_tbody_tbl_archivos_sendmail').rows.length) {
                files_requerimientos += row.cells[1].innerHTML + '|' + nombrearchivogenerado + ';';
            } else {
                files_requerimientos += row.cells[1].innerHTML + '|' + nombrearchivogenerado;
            }
        }

        let err = function (__err) { console.log('err', __err) },
            parametro = {
                pCorreoAsunto: pCorreoAsunto,
                pCorreoPara: pCorreoPara,
                pCorreosCopia: pCorreosCopia,
                pCorreoCuerpo: pCorreoCuerpo,
                pImagenCID: pImagenCID,
                files_requerimientos: files_requerimientos
            }, frm = new FormData();
        frm.append('par', JSON.stringify(parametro));
        $('#myModalSpinner').modal('show');
        _Post('GestionProducto/Requerimiento/SaveData_CorreoRequerimiento', frm)
            .then((resultado) => {
                $('#myModalSpinner').modal('hide');
                let orpta = '', estado = '';
                if (resultado === 'OK') {
                    estado = 'success';
                    orpta = 'Mail successfully sent.';
                    $('#modal_enviarcorreo').modal('hide');
                } else {
                    estado = 'error';
                    //orpta = 'Mail could not be sent';
                    orpta = 'El tamaño excede los 18MB';
                }
                _swal({ estado: estado, mensaje: orpta });
                
            }, (p) => { err(p); });
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
        $('#modal_enviarcorreo').modal('hide');
    }
}

function res_ini(data) {
    let orpta = data != null ? JSON.parse(data) : null;
    if (orpta != null) {
        let correoto = orpta[0].correopara, correocc = orpta[0].correocc, orequerimiento = JSON.parse(orpta[0].requerimiento),
            orequerimientodetalle = CSVtoJSON(orpta[0].requerimientodetalle), orequerimientoarchivo = CSVtoJSON(orpta[0].archivos);

        _('_txtTo_sendmail').value = correoto;
        _('_txtCC_sendmail').value = correocc;
        _('_txt_client').value = orequerimiento.nombrecliente;
        _('_txt_tipomuestra').value = orequerimiento.nombretipomuestra;
        _('_txt_temporada').value = orequerimiento.nombretemporada;
        _('_txt_division').value = orequerimiento.nombredivision;
        _('_txt_codigoestilo').value = orequerimiento.codigoestilo;
        _('_txta_comentario').value = orequerimiento.comentario;
        _('_txtSubject_sendmail').value = 'WTS-RDP:' + orequerimiento.nombrecliente + '/' + orequerimiento.nombretemporada + '/' + orequerimiento.nombredivision + '/' + orequerimiento.codigoestilo + '/' + orequerimiento.nombretipomuestra;
        _('hf_imagenwebnombre_estilo').value = orequerimiento.imagenwebnombre;
        _('_txta_descripcionestilo').innerHTML = orequerimiento.nombretela;

        let rutafileserver = _('hf_rutafileserver_imgestilo').value;
        _('_imgEstilo').src = rutafileserver + orequerimiento.imagenwebnombre;

        llenarTablaTallaColor(orequerimientodetalle);
        llenartablaarchivos(orequerimientoarchivo);
        generarTablaEstiloForCorreo(orequerimiento);
    }
}

function llenarTablaTallaColor(data) {
    let tbl = _('_tbody_tbl_tallacolor_sendmail'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr>
                <td>${data[i].nombreclientecolor}</td>
                <td>${data[i].nombreclientetalla}</td>
                <td>${data[i].cantidad}</td>
                <td>${data[i].cantidadcm}</td>
                <td>${data[i].fechafty}</td>
            </tr>`;
        }
        tbl.innerHTML = html;
    }
}

function llenartablaarchivos(data) {
    let tbl = _('_tbody_tbl_archivos_sendmail'), html = '';
    tbl.innerHTML = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='idarchivo:${data[i].idarchivo},modificado:0,nombrearchivogenerado:${data[i].nombrearchivo}'>
                    <td class='text-center'>
                        <div class ='btn-group'>
                            <button class ='btn btn-danger btn-sm _deletefile'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </div>
                    </td>
                    <td>${data[i].nombrearchivooriginal}</td>
                </tr>
            `;
        }
        tbl.innerHTML = html;
        handlerTblArchivos();
    }
}

function handlerTblArchivos() {
    let tbl = _('_tbody_tbl_archivos_sendmail'), arrayDelete = _Array(tbl.getElementsByClassName('_deletefile'));
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
        let tbl = _('_tbody_tbl_archivos_sendmail');
        tbl.deleteRow(filaIndex);
    }
}

function generarTablaEstiloForCorreo(orequerimiento) {
    _('divTablaEstiloForCorreo').innerHTML = '';
    let rutafileserver = _('hf_rutafileserver_imgestilo').value, rutaimagen = rutafileserver + orequerimiento.imagenwebnombre, nombreimagengenerado = orequerimiento.imagenwebnombre;
    let array_nombreimagen = nombreimagengenerado.split('.');
    //let nombreimagenconcatenado = array_nombreimagen[0] + array_nombreimagen[1];
    // Jacob cid
    let nombreimagenconcatenado = _('hf_imagenwebnombre_estilo').value;

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
    _('divTablaEstiloForCorreo').innerHTML = html;

    // PARA TALLA COLOR
    let htmlTablaTallaColor = _('_div_gridestilo').innerHTML;
    _('_divTablaTallaColorForCorreo').innerHTML = htmlTablaTallaColor;
    let tabla2 = $("#_divTablaTallaColorForCorreo > table")[0], totalFilas = tabla2.rows.length, i = 0, tablaHeader = $("#_divTablaTallaColorForCorreo > table > thead")[0],
                totalColumnasHeader = tablaHeader.rows[0].cells.length, tablaBody = $("#_divTablaTallaColorForCorreo > table > tbody")[0], totalColumnasBody = tablaBody.rows[0].cells.length, totalFilasBody = tablaBody.rows.length;

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
        if (i == 0) {
            tabla2.rows[0].cells[i].style.width = '200px';
            tabla2.rows[0].cells[i].style.border = "1px solid black";
        } else {
            tabla2.rows[0].cells[i].style.width = '150px';
            tabla2.rows[0].cells[i].style.border = "1px solid black";
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
                tablaBody.rows[j].cells[i].style.width = '200px';
            } else {
                tablaBody.rows[j].cells[i].style.width = '120px';
            }
        }
    }
    
    // PARA COMENTARIOS
    html = '';
    html = `
        <div>
            <label><strong>Additional Instruction</strong></label>
        </div>
        <table id="tblComentario" style="border: 1px solid #ccc; border-color: black;" cellpadding="0" cellspacing="0">
            <tbody><tr>
                <td class='_clscomentarioadicional_sendmail' style="width: 832px; height: 100px; text-align: start; vertical-align: top; padding-top: 5px; padding-left: 10px;">
                    ${orequerimiento.comentario}
                </td>
            </tr>
        </tbody></table>
        `;
    _('_divComentarioFor_Correo_oculto').innerHTML = html;
}

function validarFormatoCorreos() {
    let divprincipal = _('_div_body_correo'), arrayCamposCorreo = _Array(divprincipal.getElementsByClassName('validarCorreo')), validacionFormatoCorreo = false,
        valorInput = "", arrayCorreos = [], mensajeErrorValidacionCorreo = '', pasolavalidacionformatocorreo = true;

    let totalCamposCorreo = arrayCamposCorreo.length;
    for (let i = 0; i < totalCamposCorreo; i++) {
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
            for (let j = 0; j < totalArray; j++) {
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
        _rules({ id: '_div_body_correo', clase: '_enty' });
    }

)();
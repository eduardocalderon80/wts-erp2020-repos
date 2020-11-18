var ovariables_correomasivo = {
    accion: '',
    idgrupocomercial: '',
    lstrequerimientosseleccionados: [],
    configuracion_sizemaximoarchivo: 0,
    sizemaximoarchivo: 0
}

function load() {
    let par = _('txtpar').value;

    if (!_isEmpty(par)) {
        ovariables_correomasivo.idgrupocomercial = _par(par, 'idgrupocomercial');
    }

    //_modal('buscarreq', 1000);
    //$('#modal_buscarreq').on('show.bs.modal', ejecutarmodalnewreq)
    _('btnBuscarReq').addEventListener('click', ModalBuscarReq);
    _('cboCliente').addEventListener('change', getDataCombosByCliente);
    /// ESTE EVENTO ES TEMPORAL
    _('btnEnviarCorreo').addEventListener('click', sendmail_requerimientomasivo);
    //_('txtSubject').value = 'demoxd';
    _('btnGenerarArchivoRequerimiento_masivo').addEventListener('click', fn_generararchivorequerimientos_correomasivo);

    _('btnCancelarCorreo').addEventListener('click', retornar_index_requerimiento);
    $('#cboTipoMuestra').select2();
}

//function previewFile(file) {
//    var xhr = new XMLHttpRequest();
//    ////   /favicon.png
//    xhr.open("GET", "//wts-fileserver/erp/style/thumbnail/2016071818595858.png");  // /Content/img/logos/WTSLogo2.png
//    //although we can get the remote data directly into an arraybuffer using the string "arraybuffer" assigned to responseType property. For the sake of example we are putting it into a blob and then copying the blob data into an arraybuffer.
//    xhr.responseType = "blob";
//    //xhr.setRequestHeader("Content-Type", "image/png;charset=UTF-8");  // image/png  application/xml
//    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type")
//    xhr.setRequestHeader("Access-Control-Allow-Methods", "GET, POST");
//    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

//    function analyze_data(blob) {
//        var mf = new File([blob], 'xd.png', { type: "image/png" });

//        var myReader = new FileReader();

//        myReader.addEventListener("load", function (e) {  // loadend

//            //var buffer = e.srcElement.result;//arraybuffer object
//            let xd = Array.from(_('divCorreo').getElementsByClassName('img-thumbnail'))[0];
//            xd.setAttribute('src', myReader.result);
//        });

//        //myReader.readAsArrayBuffer(mf) //blob
//        myReader.readAsDataURL(mf) //blob
//    }

//    xhr.onload = function () {
//        analyze_data(xhr.response);
//    }
//    xhr.send();

//    //var reader = new FileReader();
//    //reader.onloadend = function () {
//    //    let xd = Array.from(_('divCorreo').getElementsByClassName('img-thumbnail'))[0];
//    //    xd.setAttribute('src', reader.result);
//    //    alert(reader.result);
//    //    //console.log(reader.result);
//    //    //this is an ArrayBuffer 
//    //}
//    //reader.readAsArrayBuffer(file);
//}

function bloquear() {
    $('#cboCliente').prop('disabled', true)
    $('#cboTipoMuestra').prop('disabled', true)
    $('#cboClienteTemporada').prop('disabled', true)
    $('#cboProveedor').prop('disabled', true)
    $('#cboEstado').prop('disabled', true)
}

function ModalBuscarReq() {
    //$('#modal_buscarreq').modal('show');
    let req = _required({
        id: 'div_filtro_req_correomasivo', clase: '_enty'
    });

    if (req) {
        _modalBody({
            url: 'GestionProducto/Requerimiento/_BuscarReq',
            ventana: '_BuscarReq',
            titulo: 'Search requirement',
            parametro: ''
        });
    }
}

function ejecutarmodalnewreq() {
    let modal = $(this);
    modal.find('.modal-title').text('Find Req');
    let urlaccion = 'GestionProducto/Requerimiento/_BuscarReq';
    _Get(urlaccion).then(function (vista) {
        //$('#modal_bodybuscarreq').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        //_Getjs('GestionProducto/Requerimiento/_buscarreq');
    });
}

function GetReq(Idreq) {
    let req = Idreq, parametro = { req: req }, urlaccion = 'GestionProducto/Requerimiento/GetReqCorreoMasivo?par=' + JSON.stringify(parametro);
    Get(urlaccion, PintarDiv)
}

function PintarDiv(data) {
    let odata = data != null ? JSON.parse(data) : null;
    if (odata != null) {
        let orequerimiento = JSON.parse(odata[0].Requerimiento), totalReq = orequerimiento.length; //, odetalle = JSON.parse(odata[0].Detalle), oarchivo = JSON.parse(odata[0].Archivo), totalReq = orequerimiento.length;
        console.log(orequerimiento)


        let div = ''
        for (i = 0; i < totalReq; i++) {
            div = '<div name="divTable" data-id=' + orequerimiento[i].idrequerimiento + '>'
            div += '<table><tbody>'
            div += '<tr>'
            div += '    <td rowspan="3">'
            div += '        <div class="container" style="width:100px;height:80px;">'
            div += '            <img class="img-thumbnail" src="//WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg" width="100" height="80">'
            div += '        </div>'
            div += '    </td>'
            div += '    <td>'
            div += '        <label>Style </label>'
            div += '    </td>'
            div += '</tr>'
            div += '<tr><td><label>Description </label></td></tr>'
            div += '<tr><td><label>Fabric </label></td></tr>'
            div += '<tr><td><label>Additional instruction</label></td>'
            div += '</tr></tbody></table></div>'
            $('#divCorreo').append(div)
        }

    }
}

function getDataCombosByCliente(event) {
    let idcliente = _('cboCliente').value, perfil = _('txtperfil').value,
        parametro = { idcliente: idcliente, perfil: perfil, idgrupocomercial: ovariables_correomasivo.idgrupocomercial },
        urlaccion = 'GestionProducto/Requerimiento/getData_iniCombosByCliente?par=' + JSON.stringify(parametro);
    Get(urlaccion, res_datacliente);
}

function res_datacliente(data) {
    let rpta = data != null ? JSON.parse(data) : null;
    _('cboTipoMuestra').innerHTML = '';
    _('cboClienteTemporada').innerHTML = '';
    _('cboProveedor').innerHTML = '';
    _('cboClienteDivision').innerHTML = '';
    if (rpta != null) {
        _('cboTipoMuestra').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].tipomuestraxcliente);
        _('cboClienteTemporada').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].temporaxcliente);
        _('cboProveedor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].proveedor);
        _('cboClienteDivision').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientedivision);
    }
    $('#cboTipoMuestra').trigger('change');
}

function res_ini(respuesta) {
    let orpta = respuesta != null ? JSON.parse(respuesta) : null;
    if (orpta != null) {
        _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].clientes);
        _('cboEstado').innerHTML = _comboFromCSV(orpta[0].estados);
        _('txtperfil').value = orpta[0].perfiles;
        _('txtRuta').value = orpta[0].rutafileserver;
        ovariables_correomasivo.configuracion_sizemaximoarchivo = orpta[0].sizemaximoarchivo;
    }
}

function getrequerimientos_masivo(data) {
    let param = '', objparam = {}, frm = new FormData();
    ovariables_correomasivo.lstrequerimientosseleccionados = [];
    if (data.length > 0) {
        ovariables_correomasivo.lstrequerimientosseleccionados = data;
        objparam.requerimientos = data;
        objparam.idcliente = _('cboCliente').value;
        objparam.idproveedor = _('cboProveedor').value;
        let par_view = _('panelEncabezado_correomasivo').getElementsByClassName('cls_par_correomasivo')[0].value;
        objparam.idgrupocomercial = _par(par_view, 'idgrupocomercial');
        param = JSON.stringify(objparam);
        frm.append('par', param);

        let err = function (__err) { console.log('error', __err); }

        _Post('GestionProducto/Requerimiento/GetRequerimientosMasivoForEnvioCorreo', frm)
            .then((rpta) => {
                let odata = rpta !== '' ? JSON.parse(rpta) : null;
                if (odata !== null) {
                    const reqs = odata[0].requerimiento !== '' ? JSON.parse(odata[0].requerimiento) : null, archivos = odata[0].archivos !== '' ? JSON.parse(odata[0].archivos) : null,
                        req_colores = odata[0].req_colores !== '' ? CSVtoJSON(odata[0].req_colores) : null, correopara = odata[0].correopara, correocc = odata[0].correocc, 
                        size_totalarchivos_req = odata[0].size_totalarchivosadjuntos;

                    if (reqs !== null) {
                        cargarrequerimientosmasivo(reqs, archivos, req_colores, correopara, correocc, size_totalarchivos_req);
                        // GENERAR ARCHIVO DE REQUERIMIENTOS MASIVO
                        exportarpdf_req();
                    }
                }
            }, (p) => {
                err(p);
            });
    }

}

function cargarrequerimientosmasivo(reqs, archivos, req_colores, correopara, correocc, size_totalarchivos_req) {
    let html = '', asunto = '';
    _('divCorreo').innerHTML = '';
    _('divCorreo2').innerHTML = '';

    _('txtTo').value = correopara;
    _('txtCC').value = correocc;
    if (reqs.length > 0) {
        //style = "font-size:7px;" de la tabla
        asunto = 'WTS-RDP:' + reqs[0].nombrecliente + '/' + reqs[0].nombretemporada + '/' + reqs[0].nombredivision;
        let size_KB = parseFloat(size_totalarchivos_req / 1024).toFixed(2), size_MB = parseFloat(size_KB / 1024).toFixed(2), semaforo_size = '';
        ovariables_correomasivo.sizemaximoarchivo = size_MB;

        if (parseFloat(size_MB) > parseFloat(ovariables_correomasivo.configuracion_sizemaximoarchivo)) {
            semaforo_size = 'color: red;'
        } else {
            semaforo_size = 'color: green;'
        }

        let html_sizefile = `Total Tamaño de archivos adjuntos: <strong style='${semaforo_size}'>${size_KB} KB(${size_MB} MB)<br/></strong>`;
        _('panelbody_req_mail').getElementsByClassName('cls_lbl_sizetotalarchivo')[0].innerHTML = html_sizefile;
        reqs.forEach((x, indice) => {
            const filterarchivos = archivos !== null ? archivos.filter(arch => arch.idrequerimiento == x.idrequerimiento) : null;
            const filtercolores = req_colores !== null ? req_colores.filter(col => col.idrequerimiento == x.idrequerimiento) : null;
            const ind = indice + 1;
            
            asunto += '/' + x.codigoestilo + '/' + x.nombretipomuestra;
            let nombreimagenestilo = '';


            html += `
                <div id="divReq${ind}" style="overflow:auto;" class='cls_divReqCorreo'>
                        <table class ="table table-bordered tbl_principal_correo _cls_correomasivo">
                            <tbody>
                                <tr>
                                    <td colspan="2" style='background-color: #4682B4; color: white'>${x.codigo}</td>
                                </tr>
                                <tr>
                                    <td style="width:50%;">
                                        <table class ="table _cls_correomasivo">
                                            <tbody>
                                                <tr>
                                                    <td rowspan="3" style="width:90px;">
                                                        <div style="width:80px;height:80px;">
                                                            <img class ="img-thumbnail" src="data:image/png;base64,${x.base64imagenestilo}" width="80" height="80">
                                                        </div>
                                                    </td>
                                                    <td style='width:80px;'><strong>Style:</strong></td>
                                                    <td>${x.codigoestilo}</td>
                                                </tr>
                                                <tr>
                                                    <td style='width:80px;'><strong>Description: </strong></td>
                                                    <td>${x.descripcion_estilo}</td>
                                                </tr>
                                                <tr>
                                                    <td style='width:80px;'><strong>Fabric: </strong></td>
                                                    <td>${x.nombretela}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan='3'>Additional instruction: </td>
                                                </tr>
                                                <tr>
                                                    <td colspan='3'>${x.comentario_additionalinstruction}</td>
                                                </tr>
                                            </tbody>
                                        </table>`;
            html += `

                                        <table class ="table _cls_tblfile_correomasivo _cls_correomasivo">
                                            <thead>
                                                <tr>
                                                    <th style='width: 50px;'></th>
                                                    <th>Files </th>
                                                </tr>
                                            </thead>
                                            <tbody class ='_cls_tbodyfile_correomasivo'>`;
            if (filterarchivos !== null) {
                filterarchivos.forEach(file => {
                    html += `
                                                <tr data-par='nombrearchivooriginal:${file.nombrearchivooriginal},nombrearchivo:${file.nombrearchivo},size:${file.size}' class='_cls_rowfile_mailmasivo'>
                                                    <td>
                                                        <span style="color:red;cursor:pointer;" class ="fa fa-trash-o cls_filereq_correomasivo"></span>
                                                    </td>
                                                    <td>
                                                        ${file.nombrearchivooriginal}
                                                    </td>
                                                </tr>`;
                });
            }

            html += `

                                            </tbody>
                                        </table>
                                    </td>
                                    <td style="width:50%;">
                                        <table class ="table table-condensed _cls_correomasivo">
                                            <thead>
                                                <tr>
                                                    <th class ="text-center" style="width:40%;">Color</th>
                                                    <th class ="text-center" style="width:20%;">Size</th>
                                                    <th class ="text-center" style="width:15%;">Quantity <br /> for Client </th>
                                                    <th class ="text-center" style="width:15%;">Counter <br /> Sample WTS</th>
                                                    <th class ="text-center" style="width:15%;">EX Factory</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;

            if (filtercolores !== null) {
                filtercolores.forEach(colores => {
                    html += `
                                                <tr>
                                                    <td>${colores.nombreclientecolor}</td>
                                                    <td>${colores.nombreclientetalla}</td>
                                                    <td>${colores.cantidad}</td>
                                                    <td>${colores.cantidadcm}</td>
                                                    <td>${colores.fechafty}</td>
                                                </tr>`;
                });
            }

            html += `

                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            `;
        });
        _('divCorreo').insertAdjacentHTML('beforeend', html);
        _('txtSubject').value = asunto;
        handler_tblcorreomasivo_requerimientos();
    }
}

function handler_tblcorreomasivo_requerimientos() {
    let arrtbls_principales = Array.from(_('divCorreo').getElementsByClassName('tbl_principal_correo '));
    arrtbls_principales.forEach(x => {
        let arrtbls_body_file = Array.from(x.getElementsByClassName('_cls_tbodyfile_correomasivo'))[0], arrdelete_file = Array.from(arrtbls_body_file.getElementsByClassName('cls_filereq_correomasivo'));
        arrdelete_file.forEach(btn => btn.addEventListener('click', e => { fn_eliminarfile_correomasivo(e) }));
    });
}

function fn_eliminarfile_correomasivo(event) {
    let o = event.currentTarget, fila = null;
    fila = o.parentNode.parentNode;
    if (fila !== null) {
        swal({
            text: 'Are you sure to eliminate?',
            title: 'Confirm...!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function () {
            fila.parentNode.removeChild(fila);
            sessionStorage.clear();
            _('btnGenerarArchivoRequerimiento_masivo').classList.remove('hide');
            recalcular_sizetotalarchivos_adjuntos_req();
        })
        
    }
}

function recalcular_sizetotalarchivos_adjuntos_req() {
    let arrtbody_principales = Array.from(_('divCorreo').getElementsByClassName('_cls_tbodyfile_correomasivo ')),
        size_totalarchivos_req = 0, html = '', size_KB = 0, size_MB = 0, semaforo_size = '';

    arrtbody_principales.forEach(x => {
        let arrfilas = Array.from(x.getElementsByClassName('_cls_rowfile_mailmasivo'));
        arrfilas.forEach((f) => {
            let par = f.getAttribute('data-par'), size = _par(par, 'size');
            size_totalarchivos_req += parseInt(size);
        });
        
    });

    size_KB = parseFloat(size_totalarchivos_req / 1024).toFixed(2), size_MB = parseFloat(size_KB / 1024).toFixed(2);
    ovariables_correomasivo.sizemaximoarchivo = size_MB

    if (size_MB > ovariables_correomasivo.configuracion_sizemaximoarchivo) {
        semaforo_size = 'color: red;'
    } else {
        semaforo_size = 'color: green;'
    }

    html = `Total Tamaño de archivos adjuntos: <strong style='${semaforo_size}'>${size_KB} KB(${size_MB} MB)<br/></strong>`;
    _('panelbody_req_mail').getElementsByClassName('cls_lbl_sizetotalarchivo')[0].innerHTML = html;
}

function exportarpdf_req() {
    sessionStorage.clear();
    const divcorreo = _('divCorreo');
    if (divcorreo.innerHTML !== '') {
        
        // ACTIVAR LUEGO TODO ESTO
        let html_copy = divcorreo.innerHTML, divcorreo2 = _('divCorreo2');

        divcorreo2.innerHTML = html_copy;
        limpiarobjetos_div_exportarpdf();

        let arr_req = Array.from(divcorreo2.getElementsByClassName('cls_divReqCorreo'));
        if (arr_req.length > 0) {
            arr_req.forEach(x => {
                let tbl = x.getElementsByClassName('tbl_principal_correo')[0];
                tbl.style.fontSize = '7px';
            });
        }

        _('divCorreo2').classList.remove('hide');
        
        kendo.drawing.drawDOM("#divCorreo2",
            {
                forcePageBreak: ".page-break",
                paperSize: "A4",
                margin: { top: "0.5cm", bottom: "0.5cm", left: "0.5cm", right: "0.5cm" },
                scale: 0.8,
                height: 500
            }
            ).then(function (group) {
                return kendo.drawing.exportPDF(group);
            }).done(function (data) {
                //Save the PDF file
                // GENERARL EL NOMBRE DEL ARCHIVO
                let fecha = new Date(), numaleatorio = aleatorio(1, 1000), nombrearchivo = '';
                nombrearchivo = 'Requerimientos_' + fecha.getFullYear() + ("0" + (fecha.getMonth() + 1)).slice(-2) + ("0" + fecha.getDate()).slice(-2) + ("0" + fecha.getHours()).slice(-2) + ("0" + fecha.getMinutes()).slice(-2) + ("0" + fecha.getSeconds()).slice(-2) + numaleatorio + '.pdf';
                sessionStorage.setItem('nombrearchivo', nombrearchivo);
                kendo.saveAs({
                    dataURI: data,
                    fileName: nombrearchivo,
                    proxyURL: _('urlBase').value + "GestionProducto/Requerimiento/Pdf_Export_Save",
                    forceProxy: true
                });
                _('divCorreo2').classList.add('hide');
            });
    }

}

function limpiarobjetos_div_exportarpdf() {
    let arrtbls_principales = Array.from(_('divCorreo2').getElementsByClassName('tbl_principal_correo '));
    arrtbls_principales.forEach(x => {
        let arrtbls_body_file = Array.from(x.getElementsByClassName('_cls_tbodyfile_correomasivo'))[0], arrdelete_file = Array.from(arrtbls_body_file.getElementsByClassName('cls_filereq_correomasivo'));
        arrdelete_file.forEach(x => {
            x.classList.add('hide');
        });
    });
}

function aleatorio(a, b) {
    return Math.round(Math.random() * (b - a) + parseInt(a));
}

function sendmail_requerimientomasivo() {
    let req = _required({
        id: 'div_cuerpoprincipal_req_correomasivo', clase: '_enty'
    });

    if (!sessionStorage.getItem('nombrearchivo')) {
        swal({
            text: 'Please generate the requirements file.',
            title: 'Information',
            type: 'info'
        });
        return false;
    }

    if (parseFloat(ovariables_correomasivo.sizemaximoarchivo) > parseFloat(ovariables_correomasivo.configuracion_sizemaximoarchivo)) {
        swal({
            text: 'Maximum of attachments up to ' + ovariables_correomasivo.configuracion_sizemaximoarchivo + ' megabytes',
            title: 'Information',
            type: 'error'
        });
        return false;
    }

    if (req) {
        
        let validacionCorrecta = validarFormatoCorreos_correomasivo();
        if (validacionCorrecta == false) {
            return false;
        }

        let filerequerimientos = getListaArchivosRequerimientos_paracorreomasivo();

        let html_req_seleccionados = get_strhtml_correomasivo(ovariables_correomasivo.lstrequerimientosseleccionados);

        let parametros = _getParameter({ id: 'div_cuerpoprincipal_req_correomasivo', clase: '_enty' }), frm = new FormData();
        //parametros['file_attachments_mail'] = sessionStorage.getItem('nombrearchivo');
        let parfileadjunto = {
            fileadjunto: sessionStorage.getItem('nombrearchivo')
        };
        let html_registros = {
            html_req: html_req_seleccionados
        }
        parametros['files_requerimientos'] = filerequerimientos;
        parametros['html_req_seleccionados'] = escape(html_req_seleccionados);
        parametros['nombrearchivorequerimiento'] = parfileadjunto.fileadjunto;

        frm.append('par', JSON.stringify(parametros));
        frm.append('fileadjunto_generadopdf', JSON.stringify(parfileadjunto));
        
        _Post('GestionProducto/Requerimiento/EnviarCorreoRequerimientoMasivo', frm)
            .then(respuesta => {
                let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;
                if (rpta !== null) {
                    _swal({
                        estado: rpta.estado, mensaje: rpta.mensaje
                    });

                }
            });
    }
}

function get_strhtml_correomasivo(lstrequerimientos) {
    let html = '';
    if (lstrequerimientos.length > 0) {
        html += `<table style='border: 1px solid #ccc; border-color: black; border-collapse:collapse;' cellpadding='0' cellspacing='0'><thead><tr><th style='border: 1px solid #ccc; background-color: #4682B4; color: white;width: 110px;'>Requeriment</th><th style='border: 1px solid #ccc; background-color: #4682B4; color: white;width: 110px;'>Style</th><th style='border: 1px solid #ccc; background-color: #4682B4; color: white;width: 200px;'>Style description</th><th style='border: 1px solid #ccc; background-color: #4682B4; color: white;width: 250px;'>Fabric</th></tr></thead><tbody>`;
        lstrequerimientos.forEach(x => {
            let par = x.parametro_req_seleccionados, req = _par(par, 'codigorequerimiento'),
                estilo = _par(par, 'codigoestilo'), descripcionestilo = _par(par, 'descripcionestilo'), tela = _par(par, 'tela');
            html += `<tr><td style='border: 1px solid #ccc;'>${req}</td><td style='border: 1px solid #ccc;'>${estilo}</td><td style='border: 1px solid #ccc;'>${descripcionestilo}</td><td style='border: 1px solid #ccc;'>${tela}</td></tr>`;
        });

        html += `</tbody></table>`;
    }

    return html;
}

function validarFormatoCorreos_correomasivo() {
    let divprincipal = _('div_cuerpoprincipal_req_correomasivo'), arrayCamposCorreo = _Array(divprincipal.getElementsByClassName('validarCorreo')), validacionFormatoCorreo = false,
        valorInput = "", arrayCorreos = [], mensajeErrorValidacionCorreo = '', pasolavalidacionformatocorreo = true;

    let totalCamposCorreo = arrayCamposCorreo.length;
    for (let i = 0; i < totalCamposCorreo; i++) {
        arrayCorreos = [];
        valorInput = arrayCamposCorreo[i].value;
        let idCampo = arrayCamposCorreo[i].getAttribute('id');
        // SI LOS CORREOS ESTAN SEPARADOS POR COMA(,) REEMPLAZARLO POR PUNTO Y COMA(;)
        valorInput = valorInput.replace(",", ";");
        arrayCamposCorreo[i].value = valorInput;

        arrayCorreos = valorInput.split(';');
        let totalArray = arrayCorreos.length;
        if (totalArray > 0) {
            for (let j = 0; j < totalArray; j++) {
                valorInput = arrayCorreos[j].trim();
                validacionFormatoCorreo = _validateEmail(valorInput);  // ESTA FUNCION validateEmail ESTA EN UTIL.JS
                if (validacionFormatoCorreo == false) {
                    let idspan = '_error_correomasivo_' + idCampo;
                    _(idspan).classList.remove('hide');
                    mensajeErrorValidacionCorreo += "- Error in mail format in";
                    pasolavalidacionformatocorreo = false;
                    break;
                }
            }
        }
    }
    return pasolavalidacionformatocorreo;
}

function getListaArchivosRequerimientos_paracorreomasivo() {
    let divprincipal = _('divCorreo'), arr_div = Array.from(divprincipal.getElementsByClassName('cls_divReqCorreo')), cadena_files = '',
        obj_file = {
        };

    arr_div.forEach(x => {
        let divfile = x.getElementsByClassName('_cls_tblfile_correomasivo')[0];
        let arr_divrowfile = Array.from(divfile.getElementsByClassName('_cls_rowfile_mailmasivo')), total = arr_divrowfile.length;
        arr_divrowfile.forEach((r, index) => {
            let par = r.getAttribute('data-par');
            if (index < total) {
                cadena_files += _par(par, 'nombrearchivooriginal') + '|' + _par(par, 'nombrearchivo') + ';';
            } else {
                cadena_files += _par(par, 'nombrearchivooriginal') + '|' + _par(par, 'nombrearchivo');
            }

            //obj_file.nombrearchivooriginal = _par(par, 'nombrearchivooriginal');
            //obj_file.nombrearchivo = _par(par, 'nombrearchivo');
            //arr_namefiles.push(obj_file);
        });
    });

    return cadena_files;
}

function fn_generararchivorequerimientos_correomasivo() {
    exportarpdf_req();
}

function retornar_index_requerimiento() {
    _ruteo_masgeneral('GestionProducto/Requerimiento/index')
        .then((rpta) => {
            // nada
        }).catch(function (e) {
            console.log(e);
        });
}

function req_ini() {
    let urlaccion = 'GestionProducto/Requerimiento/getData_combosIndIndex', par = JSON.stringify({
        xd: 1
    });
    urlaccion = urlaccion + '?par=' + par;
    Get(urlaccion, res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
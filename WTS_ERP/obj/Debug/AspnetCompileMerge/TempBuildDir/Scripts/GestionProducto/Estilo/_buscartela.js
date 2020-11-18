function load() {
    _('_cboOrigen').addEventListener('change', changeOrigen);
    _('_btn_searchtela').addEventListener('click', fn_buscartela);
    _('_btn_aceptartela').addEventListener('click', aceptarTela_modal);
    _('_txt_codigotela').addEventListener('keypress', fn_buscartela_key);
}

function changeOrigen(event) {
    let o = event.target;
    if (o.value == 'proyecto') {
        $('#_div_grupo_temporada').removeClass('hide');
        $('#_div_grupo_familia').addClass('hide');
    } else {
        $('#_div_grupo_temporada').addClass('hide');
        $('#_div_grupo_familia').removeClass('hide');
    }
}

function fn_buscartela() {
    let urlaccion = 'GestionProducto/Estilo/getData_buscarEstilo', idtemporada = _('_cboTemporadaxCliente').value, idfamilia = _('_cboFamilia').value, codigotela = _('_txt_codigotela').value, parametro = '',
        origen = _('_cboOrigen').value, idcliente = _('cboCliente').value;
    parametro = JSON.stringify({ origen: origen, idfamilia: idfamilia, idclientetemporada: idtemporada, codigotela: codigotela, idcliente: idcliente });
    urlaccion += '?par=' + parametro;

    let pasalavalidacion = validarAntesBuscar();
    if (!pasalavalidacion) {
        return false;
    }

    Get(urlaccion, res_buscartela);

}

function fn_buscartela_key(event) {
    if (event.keyCode == 13) {
        fn_buscartela();
    }
}

function aceptarTela_modal() {
    let tbody = $('#_tbody_tbl_tela')[0], totalfilas = tbody.rows.length, seleccionado = false, filaseleccionada = null, accioneditartela = _('hf_accion_editartela').value;

    for (let i = 0; i < totalfilas; i++) {
        seleccionado = tbody.rows[i].cells[0].children[0].checked;
        if (seleccionado) {
            filaseleccionada = tbody.rows[i];
            let parametro = tbody.rows[i].getAttribute('data-par');
            //_('hf_idestilo').value = _par(parametro, 'idtela');
            break;
        }
    }

    if (seleccionado == false) {
        _swal({ estado: 'error', mensaje: 'Seleccione la tela.' });
        return false;
    }

    if (accioneditartela == 'new') {
        pintarDivTela(filaseleccionada);
    } else {
        let indice_divtela_editar = _('hf_indice_divtela_editando').value;
        pintarDivTela_editar(filaseleccionada, indice_divtela_editar);
    }
    
    $('#modal_buscartela').modal('hide');
}

function res_buscartela(data) {
    _('_tbody_tbl_tela').innerHTML = '';
    let orpta = data != null ? CSVtoJSON(data) : null, html = '';
    if (orpta != null) {
        orpta.forEach(x => {
            html += `<tr data-par='idfichatecnica:${x.idfichatecnica},origen:${x.origen},nombreproveedor:${x.nombreproveedor},titulo:${x.titulo},peso:${x.peso},lavado:${x.lavado},dyeingprocess:${x.dyeingprocess}'>
                    <td class='hide'>
                        <input type='radio' class='_clsSelecionarTela' name='rbSeleccionarTela' />
                    </td>
                    <td>${x.codigotela}</td>
                    <td>${x.descripciontela}</td>
                    <td>${x.nombrefamilia}</td>
                </tr>
                `;
        });
        _('_tbody_tbl_tela').innerHTML = html;
        handlertrbuscar('_tbody_tbl_tela');
    }
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

function pintarDivTela(fila) {
    let divprincipal = _('div_principal_paneltelas'), arraydivstelas = _Array(divprincipal.getElementsByClassName('_clsdivtela'));
    let totaldivs = arraydivstelas.length, numeradordiv = totaldivs + 1;
    // DATOS DE LA TELA
    let par = fila.getAttribute('data-par'), nombreproveedor = _par(par, 'nombreproveedor'), codigotela = fila.cells[1].innerText, descripcionbody = '',
        familia = fila.cells[3].innerText, titulo = _par(par, 'titulo'), descripciontela = fila.cells[2].innerText, peso = _par(par, 'peso'), lavado = _par(par, 'lavado'), dyeingprocess = _par(par, 'dyeingprocess'),
        idtela = _par(par, 'idfichatecnica'), strdisable = '', origen = _par(par, 'origen');

    if (numeradordiv == 1) {
        descripcionbody = 'Body';
        strdisable = 'disabled';
    }

    let html = `
        <div class ="col-sm-6 _clsdivtela">
                                        <div class ="panel panel-default">
                                            <div class ="panel-heading">
                                                <div class ="row" style="vertical-align: middle;">
                                                    <div class ="col-sm-6">
                                                        <h3>Fabric ${numeradordiv}</h3>
                                                    </div>
                                                    <div class ="col-sm-6 text-right">
                                                        <button type="button" class ="btn btn-primary btn-sm _clsedittela">
                                                            <span class ="fa fa-edit"></span>
                                                            Edit
                                                        </button>
                                                        <button class ="btn btn-danger btn-sm _clsdeletetela" type="button">
                                                            <span class ="fa fa-trash-o"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class ="panel-body">
                                                <div class='hide'>
                                                    //<input type='text' id='hf_idtela' value='${idtela}' />
                                                    //<input type='text' id='hf_origen' value='${origen}' />
                                                    <input type='text' class ='_clspar_tela' id='txtpar_tela' value='idtela:${idtela},origen:${origen},idestiloxtela:0' />
                                                </div>
                                                <div id="divFabric" class ="form-horizontal divFabric">
                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Fabric Reference: </label>
                                                        <div class ="col-sm-10">
                                                            <input type='text' name="txtFabricReference" class="form-control _clscodigotela" disabled="disabled" value='${codigotela}' />
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Supplier: </label>
                                                        <div class ="col-sm-10">
                                                            <input id="txtFabricSupplier" class="form-control _clsnombreproveedor" disabled="disabled" value='${nombreproveedor}' />
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Placement: </label>
                                                        <div class ="col-sm-10">
                                                            <input name="txtPlacement" class ="form-control _clsPlacement" ${strdisable} value='${descripcionbody}' />
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Construction: </label>
                                                        <div class ="col-sm-10">
                                                            <textarea name="txtConstruction" disabled="disabled" class ="form-control _clsnombrefamilia" rows="2" cols="8">${familia}</textarea>
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Yarn: </label>
                                                        <div class ="col-sm-10">
                                                            <input name="txtYarn" disabled="disabled" class ="form-control _clstitulo" value='${titulo}' />
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="col-sm-2 control-label">Content: </label>
                                                        <div class ="col-sm-10">
                                                            <input name="txtContent" disabled="disabled" class ="form-control _clsContenido" value='${descripciontela}' />
                                                        </div>
                                                    </div>

                                                    <div class ="form-group">
                                                        <label class ="control-label col-sm-2">Weight: </label>
                                                        <div class ="col-sm-5">
                                                            <input name="txtWeight" class ="form-control _clspeso" disabled="disabled" value="${peso}" type="text"  />
                                                        </div>
                                                        <div class ="col-sm-3">
                                                            <input name="txtLavado" disabled="disabled" class ="form-control _clslavado" value='${lavado}' />
                                                        </div>
                                                    </div>

                                                    <div class ="form-group">
                                                        <label class ="col-sm-2 control-label">Status: </label>
                                                        <div class ="col-sm-10">
                                                            <input name="txtStatus" disabled="disabled" class ="form-control FabricStatus" />
                                                        </div>
                                                    </div>
                                                    <div class ="form-group">
                                                        <label class ="col-sm-2 control-label">Comments: </label>
                                                        <div class ="col-sm-10">
                                                            <input name="txtComents"  onkeyup='Mayus(this)'  class ="form-control _clsComentario" />
                                                        </div>
                                                    </div>
                                                       <div class ="form-group">
                                                                <label class ="col-sm-2 control-label">Dyeing Process: </label>
                                                                <div class ="col-sm-10">
                                                                    <input name="txtDyeingProcess" disabled="disabled" class ="form-control _clsDyeingProcess" value='${dyeingprocess}' />
                                                                </div>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    `;
    $('#div_principal_paneltelas').append(html);
    handlerDivTelas_new();
}

function pintarDivTela_editar(fila, indice_divtela) {
    let divprincipal = _('div_principal_paneltelas'), arraydivstelas = _Array(divprincipal.getElementsByClassName('_clsdivtela')), divtela_editar = arraydivstelas[indice_divtela];
    //let totaldivs = arraydivstelas.length, numeradordiv = totaldivs + 1;
    // DATOS DE LA TELA
    let par = fila.getAttribute('data-par'), nombreproveedor = _par(par, 'nombreproveedor'), codigotela = fila.cells[1].innerText, descripcionbody = '',
        familia = fila.cells[3].innerText, titulo = _par(par, 'titulo'), descripciontela = fila.cells[2].innerText, peso = _par(par, 'peso'), lavado = _par(par, 'lavado'),
        idtela = _par(par, 'idfichatecnica'), strdisable = '', origen = _par(par, 'origen');

    let pardivtela_antesdemodificar = divtela_editar.getElementsByClassName('_clspar_tela')[0].value
    let idtela_divtela_antesdemodificar = _par(pardivtela_antesdemodificar, 'idtela');

    if (idtela_divtela_antesdemodificar != idtela) {
        divtela_editar.getElementsByClassName('clstbodytelacolor')[0].innerHTML = '';
    }
    

    let pardivtela = 'idtela:' + idtela + ',origen:' + origen;
    divtela_editar.getElementsByClassName('_clspar_tela')[0].value = pardivtela;
    divtela_editar.getElementsByClassName('_clscodigotela')[0].value = codigotela;
    divtela_editar.getElementsByClassName('_clsnombreproveedor')[0].value = nombreproveedor;
    divtela_editar.getElementsByClassName('_clsnombrefamilia')[0].value = familia;
    divtela_editar.getElementsByClassName('_clstitulo')[0].value = titulo;
    divtela_editar.getElementsByClassName('_clsContenido')[0].value = descripciontela;
    divtela_editar.getElementsByClassName('_clspeso')[0].value = peso;
    divtela_editar.getElementsByClassName('_clslavado')[0].value = lavado;
    
}

function validarAntesBuscar() {
    let codigotela = _('_txt_codigotela').value, pasalavalidacion = true, origen = _('_cboOrigen').value, idfamilia = _('_cboFamilia').value,
        idtemporada = _('_cboTemporadaxCliente').value;

    if (origen == 'fichatecnica') {
        if (idfamilia == '') {
            $('#_div_grupo_familia').addClass('has-error');
            $('#_div_grupo_temporada').removeClass('has-error');
            pasalavalidacion = false;
        }
    } else {
        if (idtemporada == '') {
            $('#_div_grupo_temporada').addClass('has-error');
            $('#_div_grupo_familia').removeClass('has-error');
            pasalavalidacion = false;
        }
    }

    //if (codigotela.trim() == '') {
    //    $('#_div_grupo_codigotela').addClass('has-error');
    //    $('#_span_error_codigotela').removeClass('hide');
    //    pasalavalidacion = false;
    //}
    //else {
    //    if (codigotela.trim().length < 4) {
    //        $('#_div_grupo_codigotela').addClass('has-error');
    //        $('#_span_error_codigotela').removeClass('hide');
    //        pasalavalidacion = false;
    //    } else {
    //        $('#_div_grupo_codigotela').removeClass('has-error');
    //        $('#_span_error_codigotela').addClass('hide');
    //    }
    //}

    return pasalavalidacion;
}

function res_ini(data) {
    let orpta = data != null ? JSON.parse(data) : null;

    _('_cboTemporadaxCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].clientetemporada);
    _('_cboFamilia').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(orpta[0].familia);

    let valorOrigen = _('_cboOrigen').value;
    if (valorOrigen == 'proyecto') {
        $('#_div_grupo_temporada').removeClass('hide');
    } else {
        $('#_div_grupo_familia').removeClass('hide');
    }

}

function req_ini() {
    let urlaccion = 'GestionProducto/Estilo/getData_iniCombosBuscarTela', idcliente = _('cboCliente').value;
    urlaccion += '?par=' + idcliente;
    Get(urlaccion, res_ini);
}

(
    function ini() {
        load();
        req_ini();
    }
)();
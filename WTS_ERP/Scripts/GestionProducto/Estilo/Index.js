var ovariables = {
    JSONData: '',
    JSONDataclient:'',
    idgrupocomercial: '',
    cliente: '',
    clientepersonal:'',
    season:'',
    division:'',
    status:'',
    allclientes: 0,
    filtro_index: '',   
    idcliente_filtro: '',
    idclientetemporada_filtro: '',
    idclientedivision_filtro: '',
    status_filtro: '',
    style_filtro: '',
    allclientes_filtro: '',
}

var oUtil = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    idtable: 'tblestilo_index'
}

function load() {
    let par = _('txtpar').getAttribute('data-par');
    ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');

    _modal('cargarestilo', 1000);
    $('#modal_cargarestilo').on('show.bs.modal', ejecutarmodalcargarestilo);

    var elem = document.querySelector('.js-switch');
    var init = new Switchery(elem);
    elem.onchange = function () {
        if (elem.checked) {
            ovariables.allclientes = 1;
            fn_loadcliente(ovariables.cliente);
            fn_cleandata();

        } else {
            ovariables.allclientes = 0;
            fn_loadcliente(ovariables.clientepersonal);
            fn_cleandata();
        };
        //req_info();
    };

    _('btnSearch').addEventListener('click', req_info);
    _('cboCliente').addEventListener('change', req_dataclient);   
    _('btnNew').addEventListener('click', fn_newstyle);
    _('btnUpload').addEventListener('click', cargarestilo);
    _('txtStyle').addEventListener('keypress', function (event) {
        if (event.keyCode == 13) {
            $("#btnSearch").trigger("click");
        }
    });
    _('btnPrintHangTag').addEventListener('click', fn_view_consultaprinthangtag, false);
    
    fn_cleandata();
    //req_info();
}

function cargarestilo() {
    $('#modal_cargarestilo').modal('show');
}

function ejecutarmodalcargarestilo() {
    let modal = $(this);

    modal.find('.modal-title').text('Upload');

    let urlaccion = 'GestionProducto/Estilo/_CargarEstilo';
    _Get(urlaccion).then(function (vista) {
        $('#modal_bodycargarestilo').html(vista);
    }, function (reason) { console.log('error', reason); }
    ).then(function (sdata) {
        _Getjs(urlaccion);
    });
}

function req_info() {
    let cliente = _('cboCliente').value;
    let style = _('txtStyle').value;
    let fabric = '';
    let season = _('cboSeason').value;
    let division = _('cboDivision').value;
    let status = _('cboStatus').value;
    let allclientes = ovariables.allclientes;
    let urlaccion = 'GestionProducto/Estilo/BuscarEstilo';
    let par = cliente + "," + style + "," + fabric + "," + season + "," + division + "," + status + "," + allclientes;
    let frm = new FormData();
    frm.append("par", par);

    oUtil.adata = [];
    oUtil.adataresult = [];
    oUtil.indiceactualpagina = 0;
    oUtil.registrospagina = 10;
    oUtil.paginasbloques = 3;
    oUtil.indiceactualbloque = 0;
    Post(urlaccion, frm, res_info);
}

function res_info(data, indice) {
    let dataparse = data != null && data != '' ? JSON.parse(data) : null;
    _('tbody_estilo_index').innerHTML = '';
    if (dataparse != null) {
        pintartablaindex(dataparse, indice);
    } else {
        _('foot_paginacion').innerHTML = '';
    }
}

function pintartablaindex(data, indice) {  // AQUI LA DATA YA ESTA PARSEADA
    if (indice == undefined) {
        indice = 0;
    }

    /* :edu inicio funcionalidad de paginacion*/
    oUtil.adata = data;
    oUtil.adataresult = oUtil.adata;
    //listar_grilla(oUtil.adata);
    //filter_header();
    //select_row();
    let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
    let fin = inicio + oUtil.registrospagina, i = 0, x = data.length;
    /* :edu fin funcionalidad de paginacion*/

    //var ruta = '//WTS-FILESERVER/erp/style/thumbnail/';
    var ruta = $("#txtRutaFileServer").val()
    //// YA NO VA
    ////$("#tblStyle").remove();
    if (data != null) {
        var Style = data;
        var nStyle = Style.length;
        if (nStyle > 0) {
            var html = "";
            for (i = inicio; i < fin; i++) { //for (var i = 0; i < nStyle; i++) {
                if (i < x) {
                    html += "<tr ondblclick='fn_editstyle(" + Style[i].IdEstilo + ")' title='Hacer doble clic'>";
                    html += "<td class='hide'>" + Style[i].IdEstilo + "</td>";

                    if (Style[i].ImagenWebNombre != "") {
                        // YA NO VA
                        //html += "<td><div style='width:100%;' class='container'><img class='img-responsive' src='" + ruta + Style[i].ImagenWebNombre + "' ></div></td>";
                        html += "<td class='text-center'><div style='width:100%;' class='container'><img class='img-thumbnail' src='" + ruta + Style[i].ImagenWebNombre + "' width='100' height='80'></div></td>";
                    } else {
                        html += "<td class='text-center'></td>";
                    }
                    html += "<td>" + Style[i].NombreCliente + "</td>";
                    html += "<td>" + Style[i].CodigoEstilo + "</td>";
                    html += "<td>" + Style[i].Version + "</td>";
                    html += "<td>" + Style[i].Descripcion + "</td>";
                    html += "<td>" + Style[i].Tela + "</td>";
                    html += "<td>" + Style[i].Temporada + "</td>";
                    html += "<td>" + Style[i].Division + "</td>";
                    html += "<td>" + Style[i].Status + "</td>";
                    html += "<td class='text-center' style='vertical-align: middle;'><span class='btn-group  btn-group-md pull-center'><button title='Edit' type='button' onclick='fn_editstyle(" + Style[i].IdEstilo + ");' class='btn btn-success'><span class='fa fa-pencil-square-o'></span></button><button title='Copy' style='display:none;' type='button' class='btn btn-default'><span class='fa fa-files-o'></span></button><button title='Delete' style='' type='button' onclick='fn_deletestyle(" + Style[i].IdEstilo + ");' class='btn btn-danger'><span class='fa fa-trash-o'></span></button></span></td>";
                    html += "</tr>";
                } else {
                    break;
                }

            }
            _('tbody_estilo_index').innerHTML = html;
            _('foot_paginacion').innerHTML = page_result(Style, indice);
        }
    }
}

function page_result(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
    var contenido = "";
    if (padata != null && padata.length > 0) {
        var nregistros = padata.length;
        var indiceultimapagina = Math.floor(nregistros / oUtil.registrospagina);
        if (nregistros % oUtil.registrospagina == 0) indiceultimapagina--;

        var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
        var indiceultimobloque = Math.floor(nregistros / registrosbloque);
        if (nregistros % registrosbloque == 0) indiceultimobloque--;

        contenido += "<ul class='pagination'>";
        if (oUtil.indiceactualbloque > 0) {
            contenido += "<li data-indice='-1'> <a onclick='paginar(-1, pintartablaindex);' > << </a></li>";
            contenido += "<li data-indice='-2'> <a onclick='paginar(-2, pintartablaindex);' > < </a></li>";
        }
        var inicio = oUtil.indiceactualbloque * oUtil.paginasbloques;
        var fin = inicio + oUtil.paginasbloques;
        let clsactivo = '';
        for (var i = inicio; i < fin; i++) {
            if (i <= indiceultimapagina) {
                if (indice == i) {
                    clsactivo = 'active_paginacion'
                } else {
                    clsactivo = ''
                }
                if (indice == -1) {
                    if (i == 0) {
                        clsactivo = 'active_paginacion';
                    }
                } else if (indice == -4) {
                    if (i == indiceultimapagina) {
                        clsactivo = 'active_paginacion';
                    }
                } else if (indice == -2 || indice == -3) {
                    if (i == inicio) {
                        clsactivo = 'active_paginacion'
                    }
                }
                contenido += `<li class='${clsactivo}' data-indice='${i}'>`;
                contenido += `<a class='${clsactivo}' onclick='paginar(`;
                contenido += i.toString();
                contenido += `, pintartablaindex);'>`;
                contenido += (i + 1).toString();
                contenido += `</a>`;
                contenido += `</li>`;
            }
            else break;
        }
        if (oUtil.indiceactualbloque < indiceultimobloque) {
            contenido += "<li data-indice='-3'> <a onclick='paginar(-3, pintartablaindex);' > > </a></li>";
            contenido += "<li data-indice='-4'> <a onclick='paginar(-4, pintartablaindex);' > >> </a></li>";
        }
    }

    let foot = `<nav>
                    ${contenido}
                </nav>
        `;
    return foot;
}

function paginar(indice, callback_pintartabla) {
    if (indice > -1) {
        oUtil.indiceactualpagina = indice;
    }
    else {
        switch (indice) {
            case -1:
                oUtil.indiceactualbloque = 0;
                oUtil.indiceactualpagina = 0;
                break;
            case -2:
                oUtil.indiceactualbloque--;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -3:
                oUtil.indiceactualbloque++;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
            case -4:
                var nregistros = oUtil.adataresult.length;
                var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;
                oUtil.indiceactualbloque = indiceultimobloque;
                oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                break;
        }
    }

    ////pintartablaindex(oUtil.adataresult, indice);
    callback_pintartabla(oUtil.adataresult, indice);
}

function fn_cleandata() {
    _('cboSeason').innerHTML = '<option value="0">All Season</option>';
    _('cboDivision').innerHTML = '<option value="0">All Division</option>';
    //let array = [];
    //_('tblestilo_index').tBodies[0].innerHTML = array;
}
 
function fn_newstyle() {
    let idcliente = _('cboCliente').value, style = _('txtStyle').value, season = _('cboSeason').value, idclientedivision = _('cboDivision').value, status = _('cboStatus').value, allclientes = ovariables.allclientes,
     urlaccion = 'GestionProducto/Estilo/New', urljs = 'GestionProducto/Estilo/New', filtro_index = `idcliente=${idcliente}¬idclientetemporada=${season}¬idclientedivision=${idclientedivision}¬status=${status}¬style=${style}¬allclientes=${allclientes}`;
    _Go_Url(urlaccion, urljs, 'accion:new,idgrupocomercial:' + ovariables.idgrupocomercial+ ',filtro_index:' + filtro_index);
}

function fn_editstyle(id) {
    let idcliente = _('cboCliente').value, style = _('txtStyle').value, season = _('cboSeason').value, idclientedivision = _('cboDivision').value, status = _('cboStatus').value, allclientes = ovariables.allclientes,
    urlaccion = 'GestionProducto/Estilo/New', urljs = 'GestionProducto/Estilo/New',filtro_index = `idcliente=${idcliente}¬idclientetemporada=${season}¬idclientedivision=${idclientedivision}¬status=${status}¬style=${style}¬allclientes=${allclientes}`;
    _Go_Url(urlaccion, urljs, 'accion:edit,idestilo:' + id + ',idgrupocomercial:' + ovariables.idgrupocomercial+ ',filtro_index:' + filtro_index );
}

function fn_deletestyle(_id) {
    swal({
        title: "Are you sure to delete?",
        text: "<strong>Tener en cuenta:</strong> si eliminas el estilo, no podrás recuperarlo",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1c84c6",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false
    }, function () {
        EliminarEstilo(_id)
        return;
    });
}

function EliminarEstilo(Id) {
    let form = new FormData()
    let urlaccion = 'GestionProducto/Estilo/Eliminar', parametro = { idestilo: Id };
    form.append('par', JSON.stringify(parametro));
    Post(urlaccion, form, function (rpta) {
        if (rpta > 0) {
            _swal({ estado: 'success', mensaje: 'Style was deleted' });
            $("#btnSearch").trigger("click")
            return;
        }
        else {
            _swal({ estado: 'error', mensaje: 'Style could not delete' });
        }
    });
    return;
}

function req_ini() {    
    try {
        if (ovariables_estilo_new.filtro_index !== '') {
            ovariables_estilo_new.filtro_index = ovariables_estilo_new.filtro_index.replace(/=/gi, ':');
            let arr = ovariables_estilo_new.filtro_index.split('¬');
            let idcliente = _par(arr[0], 'idcliente'), idclientetemporada = _par(arr[1], 'idclientetemporada'), idclientedivision = _par(arr[2], 'idclientedivision'), status = _par(arr[3], 'status'), style = _par(arr[4], 'style'), allclientes = _par(arr[5], 'allclientes');
            ovariables.idcliente_filtro = idcliente;
            ovariables.idclientetemporada_filtro = idclientetemporada;
            ovariables.idclientedivision_filtro = idclientedivision;
            ovariables.status_filtro = status;
            ovariables.style_filtro = style;
            ovariables.allclientes_filtro = allclientes; 
        }
    } catch (e) {
        ////console.log(e.toString() + 'error de filtro index');
    }

    Get('GestionProducto/Estilo/ObtenerDatosCarga', res_ini);
}

function res_ini(response) {
    //_('cboCliente').value = '';
    //_('cboStatus').value = '';
    ovariables.JSONData = response;
    var strData = JSON.parse(ovariables.JSONData);
    if (strData[0].Cliente != null) { ovariables.cliente = JSON.parse(strData[0].Cliente); }
    if (strData[0].ClientePersonal != null) { ovariables.clientepersonal = JSON.parse(strData[0].ClientePersonal); }
    if (strData[0].StatusEstilo != null) { ovariables.status = JSON.parse(strData[0].StatusEstilo); }
        
    fn_loadcliente(ovariables.clientepersonal);
    fn_loadstatus(ovariables.status);

    _promise()
        .then(() => {
            if (ovariables.idcliente_filtro !== '' || ovariables.idclientetemporada_filtro !== '' || ovariables.idclientedivision_filtro !== '' || ovariables.status_filtro !== '' || ovariables.style_filtro !== '' || ovariables.allclientes_filtro !== '') {
                if (ovariables.allclientes_filtro == 1) {                    
                    $('.js-switch').trigger('click');
                }
                if (ovariables.idcliente_filtro !== '0') {
                    _('cboCliente').value = ovariables.idcliente_filtro;
                }
                        let par = JSON.stringify({ idcliente: ovariables.idcliente_filtro, idgrupocomercial: ovariables.idgrupocomercial });
                        return  _Get('GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + par)
                        .then((data) => {
                            res_dataclient(data);
                        })
                        .then(() => {
                            _('cboSeason').value = ovariables.idclientetemporada_filtro;
                            _('cboDivision').value = ovariables.idclientedivision_filtro;
                            _('cboStatus').value = ovariables.status_filtro;
                            _('txtStyle').value = ovariables.style_filtro;
                        });                           
            }
        })
        .then(() => {
            req_info();
        });   
}

function CargarFiltro() {
    if (ovariables.idcliente_filtro !== '' || ovariables.idclientetemporada_filtro !== '' || ovariables.idclientedivision_filtro !== '' || ovariables.status_filtro !== '' || ovariables.style_filtro !== '' || ovariables.allclientes_filtro !== '') {
        if (ovariables.allclientes_filtro == 1) {
            var elem = document.querySelector('.js-switch');
            $('.js-switch').trigger('click');
        }
        if (ovariables.idcliente_filtro !== '0') {            
            _('cboCliente').value = ovariables.idcliente_filtro;         

            let par = JSON.stringify({ idcliente: ovariables.idcliente_filtro, idgrupocomercial: ovariables.idgrupocomercial });            
            _Get('GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + par)
                .then((data) => {
                    res_dataclient(data);
                })
                .then(() => {
                    _('cboSeason').value = ovariables.idclientetemporada_filtro;
                    _('cboDivision').value = ovariables.idclientedivision_filtro;
                });                
        }
        _('cboStatus').value = ovariables.status_filtro;
        _('txtStyle').value = ovariables.style_filtro;
    }
}

function fn_loadcliente(_cliente) {
    let array = _cliente;
    let cbocliente = '<option value="0">All Client</option>';
    array.forEach(x=> { cbocliente += `<option value='${x.IdCliente}'>${x.NombreCliente}</option>` });
    _('cboCliente').innerHTML = cbocliente;
}

function fn_loadstatus(_status) {
    let array = _status;
    let cbostatus = '<option value="0">All Status</option>';
    array.forEach(x=> { cbostatus += `<option value='${x.ValorEstado}'>${x.NombreEstado}</option>` });
    _('cboStatus').innerHTML = cbostatus;
}

function req_dataclient() {
    let idcliente = _('cboCliente').value;
    let par = JSON.stringify({ idcliente: idcliente, idgrupocomercial: ovariables.idgrupocomercial });
    let urlaccion = 'GestionProducto/Estilo/ObtenerDatosCargaPorCliente?par=' + par;
    Get(urlaccion, res_dataclient);
}

function res_dataclient(response) {   
    fn_cleandata();
    if (response != null || response != '') {
        ovariables.JSONDataclient = response;
        let strdataclient = JSON.parse(ovariables.JSONDataclient);
        if (strdataclient[0].Temporada != null) {
            ovariables.season = JSON.parse(strdataclient[0].Temporada);
            fn_loadseason(ovariables.season);
        }
        if (strdataclient[0].Division != null) {
            ovariables.division = JSON.parse(strdataclient[0].Division);
            fn_loaddivision(ovariables.division);
        }
    }
}

function fn_loadseason(_season) {
    let array = _season;
    let cboseason = '<option value="0">All Season</option>';
    array.forEach(x=> { cboseason += `<option value='${x.IdClienteTemporada}'>${x.CodigoClienteTemporada}</option>` });
    _('cboSeason').innerHTML = cboseason;
}

function fn_loaddivision(_division) {
    let array = _division;
    let cbodivision = '<option value="0">All Division</option>';
    array.forEach(x=> { cbodivision += `<option value='${x.IdClienteDivision}'>${x.NombreDivision}</option>` })
    _('cboDivision').innerHTML = cbodivision;
}

function fn_view_consultaprinthangtag() {
    _modalBody({
        url: 'GestionProducto/Estilo/_consultahangtagestilos',
        ventana: '_ConsultaHangTagEstilos',
        titulo: 'Print Hanger',
        parametro: ``,
        alto: '',
        ancho: '',
        responsive: 'modal-lg'
    });
}

(function ini() {
    load();
    req_ini();
})();










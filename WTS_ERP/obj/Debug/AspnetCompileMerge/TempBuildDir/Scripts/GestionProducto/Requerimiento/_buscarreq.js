var oUtil = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
    //idtable: 'tblestilo_index'
}

function load() {
    _('_btn_searchReq').addEventListener('click', buscarReq_modal);
    _('_btn_aceptarreq').addEventListener('click', aceptarReq_modal);
    _('_txt_codigo').addEventListener('keypress', function (event) {
        if (event.keyCode == 13) {
            buscarReq_modal();
        }
    });

    filter_header_req();

    $('.i-checks._clscheck_reqall_header').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let dom = e.currentTarget;
        let checkeado = dom.parentNode.classList.contains('checked');
        if (checkeado) {  // se hace esto por que el check se pone despues de terminar el evento
            checkeado = false;
        } else {
            checkeado = true;
        }
        fn_change_chkall_reqall(checkeado);
    });
}

function aceptarReq_modal() {
    let tbody = _('_tbody_req'), rows = Array.from(tbody.getElementsByClassName('checked')), lstidreq = [];

    if (rows.length <= 0) {
        swal({
            title: 'Message',
            text: 'Select at least one requirement',
            type: 'warning'
        });
        return false;
    }

    rows.forEach(x => {
        let fila = x.parentNode.parentNode.parentNode.parentNode;
        let par = fila.getAttribute('data-par');
        let obj_idreq = {};
        obj_idreq.idrequerimiento = _par(par, 'idrequerimiento');
        obj_idreq.parametro_req_seleccionados = par;
        lstidreq.push(obj_idreq);
    });

    getrequerimientos_masivo(lstidreq);
    
    $('#modal__BuscarReq').modal('hide');
}

function buscarReq_modal() {
    let codigoestilo = _('_txt_codigo').value.toLowerCase();
    let odata = oUtil.adata.filter(x => x.codigoestilo.toLowerCase().indexOf(codigoestilo) > -1);
    llenarTabla(odata);
}

function llenarTabla(data) {
    _('_tbody_req').innerHTML = '';

    //let data = CSVtoJSON(rpta, '¬', '^');
    let tbl = _('_tbody_req'), html = '';
    if (data != null && data.length > 0) {
        let totalfilas = data.length;
        //<div class ='text-center'><input type='checkbox' class ='chk'  checked /></div>
        for (let i = 0; i < totalfilas; i++) {
            html += `<tr data-par='idrequerimiento:${data[i].idrequerimiento},codigorequerimiento:${data[i].codigo_requerimiento},codigoestilo:${data[i].codigoestilo},descripcionestilo:${data[i].descripcion},tela:${data[i].nombretela}'>
                         <td style='vertical-align: middle;'>
                            <label>
                                <div class ='icheckbox_square-green _clsdivcheckreq' style='position: relative;'>
                                    <input type='checkbox' class ='i-checks _clscheckreq' style='position: absolute; opacity: 0;' name='_chk_req' />&nbsp
                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                </div>
                            </label>
                         </td>
                        <td>${data[i].codigo_requerimiento}</td>
                        <td>${data[i].nombretipomuestra_version}</td>
                        <td>${data[i].codigoestilo}</td>
                        <td>${data[i].descripcion}</td>
                        <td>${data[i].nombretela}</td>
                        <td>${data[i].nombreestado}</td>
                    </tr>
                `;
        }
        tbl.innerHTML = html;
        handler_tbl_buscarreq('_tbody_req');
    }

}

function handler_tbl_buscarreq(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clscheckreq'), divchecked = o.cells[0].querySelector('._clsdivcheckreq');
            ocheckbox.checked = ocheckbox.checked ? false : true;
            if (ocheckbox.checked) { // CUANDO SE USA I-CHECK SE ASIGNA DINAMICAMENTE AL DIV CONTENEDOR LA CLASE CHECKED
                divchecked.children[0].classList.add('checked');
            } else {
                divchecked.children[0].classList.remove('checked');
            }

            o.bgColor = "#ccd1d9";
        });
    });

    // FORMATO PARA LOS CHECKBOX; PARA QUE FUNCION EL QUITAR Y SELECCIONAR EL CHECK
    $('.i-checks._clscheckreq').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function filter_header_req() {
    var name_filter = "_clsfilter_req";
    var filters = _('_div_gridReq').getElementsByClassName(name_filter); //document.getElementsByClassName(name_filter);
    var nfilters = filters.length, filter = {};

    for (let i = 0; i < nfilters; i++) {
        filter = filters[i];
        if (filter.type == "text") {
            filter.value = '';
            filter.onkeyup = function () {
                oUtil.adataresult = event_header_filter(name_filter);
                llenarTabla(oUtil.adataresult);
                //pintartablaindex(oUtil.adataresult, 0); //:desactivate                

            }
        }
    }
}

function event_header_filter(fields_input) {
    let adataResult = [], adata = oUtil.adata;
    if (adata.length > 0) {
        var fields = document.getElementsByClassName(fields_input);
        if (fields != null && fields.length > 0) {
            var i = 0, x = 0, nfields = fields.length, ofield = {}, nreg = adata.length, _valor = '', _y = 0;
            var value = '', field = '', exito = true, acampos_name = [], acampos_value = [], c = 0, y = 0, exito_filter = false;
            var _setfield = function setField(afield_name, afield_value) { var x = 0, q_field = afield_name.length, item = '', obj = {}; for (x = 0; x < q_field; x++) { obj[afield_name[x]] = afield_value[x]; } return obj; }
            var _oreflector = { getProperties: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(c); return b }, getValues: function (a) { var b = []; for (var c in a) "function" != typeof a[c] && b.push(a[c]); return b } };

            acampos_name = _oreflector.getProperties(adata[0]);

            for (i = 0; i < nreg; i++) {
                exito = true;
                for (x = 0; x < nfields; x++) {
                    ofield = fields[x];
                    value = ofield.value.toLowerCase();
                    field = ofield.getAttribute("data-field");

                    if (ofield.type == "text") {
                        //exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);

                        if (exito) {
                            if (value !== '') {
                                valor = adata[i][field];
                                _y = adata[i][field].toLowerCase().indexOf(value);
                                exito = (y > -1);
                            }
                        }
                        exito = exito && (value == "" || adata[i][field].toString().toLowerCase().indexOf(value) > -1);
                    }
                    else {
                        exito = exito && (value == "" || value == adata[i][field]);
                    }
                    if (!exito) break;
                }
                if (exito) {
                    acampos_value = _oreflector.getValues(adata[i]);
                    adataResult[c] = _setfield(acampos_name, acampos_value);
                    c++;
                }
            }
        }
    }
    return adataResult;
}

function fn_change_chkall_reqall(ischecked) {
    let tbl = _('_tbody_req'), arr_rows = Array.from(tbl.rows);

    arr_rows.forEach(x => {
        let chk = x.getElementsByClassName('_clscheckreq')[0];
        if (ischecked) {
            chk.parentNode.classList.add('checked');
            chk.checked = true;
        } else {
            chk.parentNode.classList.remove('checked');
            chk.checked = false;
        }
    });
}

function req_ini() {
    let idcliente = _('cboCliente').value, idproveedor = _('cboProveedor').value, idclientetemporada = _('cboClienteTemporada').value,
       idtipomuestraxcliente = $('#cboTipoMuestra').val().join()
       //_('cboTipoMuestra').value
       ,
       idestado = _('cboEstado').value, idclientedivision = _('cboClienteDivision').value;

    idcliente = idcliente == '' ? 0 : idcliente;
    idproveedor = idproveedor == '' ? 0 : idproveedor;
    idclientetemporada = idclientetemporada == '' ? 0 : idclientetemporada;
    idtipomuestraxcliente = idtipomuestraxcliente == '' ? 0 : idtipomuestraxcliente;
    idestado = idestado == '' ? 0 : idestado;
    idclientedivision = idclientedivision === '' ? 0 : idclientedivision;

    //, codigoestilo: codigoestilo
    let parametro = JSON.stringify({
        idcliente: idcliente, idproveedor: idproveedor, idclientetemporada: idclientetemporada, idestado: idestado,
        idtipomuestraxcliente: idtipomuestraxcliente, idclientedivision: idclientedivision
    })

    let urlaccion = 'GestionProducto/Requerimiento/getData_requerimientoModalSearch?par=' + parametro;
    _Get(urlaccion)
        .then(respuesta => {
            let odata = respuesta !== '' ? CSVtoJSON(respuesta) : null;
            if (odata !== null) {
                oUtil.adata = odata;
                oUtil.adataresult = oUtil.adata;
                llenarTabla(odata);
            }
        });
}

(
    function ini() {
        load()
        req_ini()
    }
)();
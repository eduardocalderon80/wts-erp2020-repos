var oUtil_estilosafectados_plantillatrim = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
}

function load() {
    _('_btnAceptar_estilosafectados_plantillatrim').addEventListener('click', fn_aceptar_estilosafectados_plantilla);
    _('_cbo_clientetemporada_estilosafectados_plantillatrim').addEventListener('change', fn_change_temporada_estilosafectados_plantillatrim);

    $('.i-checks._clscheck_estilosafectados_plantillatrim_header').iCheck({
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
        fn_change_chkall_estilosafectados_plantilla(checkeado);
    });
}

function fn_aceptar_estilosafectados_plantilla(e) {
    let tbl = _('tbody_estilosafectados_plantillatrim'), arrchk = Array.from(tbl.getElementsByClassName('checked')), lstestilosafectados = [],
        par = _('txtpar_estilosafectados_plantillatrim').value, iddivtrimcontenedor = _par(par, 'iddivtrimcontenedor'), idestilo = _par(par, 'idestilo');
    if (arrchk.length > 0) {
        arrchk.forEach(x => {
            let fila = x.parentNode.parentNode.parentNode.parentNode;
            let par_tbl = fila.getAttribute('data-par');
            let obj = { idestilo: _par(par_tbl, 'idestilo') }
            lstestilosafectados.push(obj);
        });
        save_edit_trim_aceptados(lstestilosafectados, 'si');
    } else {
        swal({
            title: "Confirm...!",
            text: "You have not selected any style \ n Are you sure to continue?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1c84c6",
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function () {
            //swal("OK!", "You have saved the changes.", "success");
            save_edit_trim_aceptados(lstestilosafectados, 'si');
        });
    }
}

function pintartablaestilosafectados_plantilla(odata) {
    let html = '';
    odata.forEach(x => {
        html += `<tr data-par='idestilo:${x.idestilo}'>
                            <td class ='text-center'>
                                <label>
                                    <div class ='icheckbox_square-green _clsdivcheck_estilosafectados_plantillatrim' style='position: relative;'>
                                        <input type='checkbox' class ='i-checks _clscheck_estilosafectados_plantillatrim' style='position: absolute; opacity: 0;' name='_chk_estilosafectadostrim' />&nbsp
                                            <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0'></ins>
                                    </div>
                                </label>
                            </td>
                            <td>${x.codigoestilo}</td>
                            <td>${x.descripcion}</td>
                            <td>${x.codigoclientetemporada}</td>
                            <td>${x.version}</td>
                        </tr>
                    `;
    });
    _('tbody_estilosafectados_plantillatrim').innerHTML = html;
    handlertblestilosafectados_plantillatrim('tbody_estilosafectados_plantillatrim');
}

function handlertblestilosafectados_plantillatrim(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clscheck_estilosafectados_plantillatrim'), divchecked = o.cells[0].querySelector('._clsdivcheck_estilosafectados_plantillatrim');
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
    // i-checks + la clase del input checkbox
    $('.i-checks._clscheck_estilosafectados_plantillatrim').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_change_chkall_estilosafectados_plantilla(ischecked) {
    let tbl = _('tbody_estilosafectados_plantillatrim'), arr_rows = Array.from(tbl.rows);

    arr_rows.forEach(x => {
        let chk = x.getElementsByClassName('_clscheck_estilosafectados_plantillatrim')[0];
        if (ischecked) {
            chk.parentNode.classList.add('checked');
            chk.checked = true;
        } else {
            chk.parentNode.classList.remove('checked');
            chk.checked = false;
        }
    });
}

function res_ini_plantillatrim(odata) {
    if (odata !== null) {
        _('_cbo_clientetemporada_estilosafectados_plantillatrim').innerHTML = _comboItem({ value:'', text:'All' })+_comboFromCSV(odata[0].clientetemporada);
        let estilos = odata[0].estilos !== '' ? CSVtoJSON(odata[0].estilos) : null;
        if (estilos !== null) {
            oUtil_estilosafectados_plantillatrim.adata = estilos;
            oUtil_estilosafectados_plantillatrim.adataresult = oUtil_estilosafectados_plantillatrim.adata;
            pintartablaestilosafectados_plantilla(oUtil_estilosafectados_plantillatrim.adataresult);
        }
    }
}

function fn_change_temporada_estilosafectados_plantillatrim(e) {
    let o = e.currentTarget, idclientetemporada = o.value;
    if (idclientetemporada !== '') {
        oUtil_estilosafectados_plantillatrim.adataresult = oUtil_estilosafectados_plantillatrim.adata.filter(x => x.idclientetemporada == idclientetemporada);
    } else {
        oUtil_estilosafectados_plantillatrim.adataresult = oUtil_estilosafectados_plantillatrim.adata;
    }

    pintartablaestilosafectados_plantilla(oUtil_estilosafectados_plantillatrim.adataresult);
}

function req_ini() {
    let par = _('txtpar_estilosafectados_plantillatrim').value;
    let parametro = { idtrim: _par(par, 'idtrim'), idestilo: _par(par, 'idestilo') };
    let err = function (__err) { console.log('err', __err) };
    _Get('Maestra/ClienteDivisionTrim/ValidarTrimSiAfecta_OtrosEstilos?par=' + JSON.stringify(parametro))
        .then((odatarpta) => {
            let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null;
            res_ini_plantillatrim(rpta);
        }, (p) => { err(p); });
}

(
    function init() {
        load();
        req_ini();
    }

)();
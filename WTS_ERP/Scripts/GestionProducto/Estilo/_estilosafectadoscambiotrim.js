var oUtil_estilosafectados = {
    adata: [],
    adataresult: [],
    indiceactualpagina: 0,
    registrospagina: 10,
    paginasbloques: 3,
    indiceactualbloque: 0,
}

function load() {
    _('_btnAceptar_estilos_afectados_trim').addEventListener('click', fn_aceptar_estilosafectados);
    _('_cbo_clientetemporada_estilosafectados').addEventListener('change', fn_change_temporada_estilosafectados);

    $('.i-checks._clscheck_estilosafectadostrim_header').iCheck({
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
        fn_change_chkall_estilosafectados(checkeado);
    });

}

function fn_aceptar_estilosafectados(e) {
    let tbl = _('tbody_estilosafectados_trim'), arrchk = Array.from(tbl.getElementsByClassName('checked')), lstestilosafectados = [],
        par = _('txtpar_estilosafectadostrim').value, iddivtrimcontenedor = _par(par, 'iddivtrimcontenedor'), idestilo = _par(par, 'idestilo');
    if (arrchk.length > 0) {
        arrchk.forEach(x => {
            let fila = x.parentNode.parentNode.parentNode.parentNode;
            let par_tbl = fila.getAttribute('data-par');
            let obj = { idestilo: _par(par_tbl, 'idestilo') }
            lstestilosafectados.push(obj);
        });
        save_add_trim_color_aceptado(iddivtrimcontenedor, lstestilosafectados, idestilo, 'si');
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
            save_add_trim_color_aceptado(iddivtrimcontenedor, lstestilosafectados, idestilo, 'si');
        });
    }
}

function pintartablaestilosafectados(odata) {
    let html = '';
    odata.forEach(x => {
        html += `<tr data-par='idestilo:${x.idestilo}'>
                            <td class ='text-center'>
                                <label>
                                    <div class ='icheckbox_square-green _clsdivcheck_estilosafectadostrim' style='position: relative;'>
                                        <input type='checkbox' class ='i-checks _clscheck_estilosafectadostrim' style='position: absolute; opacity: 0;' name='_chk_estilosafectadostrim' />&nbsp
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
    _('tbody_estilosafectados_trim').innerHTML = html;
    handlertblestilosafectadostrim('tbody_estilosafectados_trim');
}

function handlertblestilosafectadostrim(idtbody) {
    let tabla = _(idtbody);
    let arrayFilas = [...tabla.rows];

    arrayFilas.forEach((x, indice) => {
        x.addEventListener('click', function (e) {
            let tbl = _(idtbody), arrtbl = [...tbl.rows];
            arrtbl.forEach((xy, indice) => {
                xy.bgColor = "white";
            });

            let o = e.currentTarget;
            let ocheckbox = o.cells[0].querySelector('._clscheck_estilosafectadostrim'), divchecked = o.cells[0].querySelector('._clsdivcheck_estilosafectadostrim');
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
    $('.i-checks._clscheck_estilosafectadostrim').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_change_chkall_estilosafectados(ischecked) {
    let tbl = _('tbody_estilosafectados_trim'), arr_rows = Array.from(tbl.rows);

    arr_rows.forEach(x => {
        let chk = x.getElementsByClassName('_clscheck_estilosafectadostrim')[0];
        if (ischecked) {
            chk.parentNode.classList.add('checked');
            chk.checked = true;
        } else {
            chk.parentNode.classList.remove('checked');
            chk.checked = false;
        }
    });
}

function fn_change_temporada_estilosafectados(e) {
    let o = e.currentTarget, idclientetemporada = o.value;
    if (idclientetemporada !== '') {
        oUtil_estilosafectados.adataresult = oUtil_estilosafectados.adata.filter(x => x.idclientetemporada == idclientetemporada);
    } else {
        oUtil_estilosafectados.adataresult = oUtil_estilosafectados.adata;
    }

    pintartablaestilosafectados(oUtil_estilosafectados.adataresult);
}

function res_ini(odata) {
    if (odata !== null) {
        _('_cbo_clientetemporada_estilosafectados').innerHTML = _comboItem({ value:'', text:'All' })+_comboFromCSV(odata[0].clientetemporada);
        let estilos = odata[0].estilos !== '' ? CSVtoJSON(odata[0].estilos) : null;
        if (estilos !== null) {
            oUtil_estilosafectados.adata = estilos;
            oUtil_estilosafectados.adataresult = oUtil_estilosafectados.adata;
            pintartablaestilosafectados(oUtil_estilosafectados.adataresult);
        }

    }
}

function req_ini() {
    let par = _('txtpar_estilosafectadostrim').value;
    let parametro = { idtrim: _par(par, 'idtrim'), idestilo: _par(par, 'idestilo') };
    let err = function (__err) { console.log('err', __err) };
    _Get('GestionProducto/Estilo/ValidarTrimSiAfecta_OtrosEstilos?par=' + JSON.stringify(parametro))
        .then((odatarpta) => {
            let rpta = odatarpta !== '' ? JSON.parse(odatarpta) : null;
            res_ini(rpta);
        }, (p) => { err(p); });
}

(
    function init() {
        load();
        req_ini();
    }
    
)();
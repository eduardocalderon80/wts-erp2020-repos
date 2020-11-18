/// <reference path="../../Home/Util.js" />

var ovariable_partida = {
    arr_color: [],
    estado_pendiente: 'PE',
    estado_enviado: 'SE',
    estado_recibido: 'RE',
    estado_rechazado: 'RJ',
    estado_aprobado: 'AP',
    estado_finalizado: 'FI',
    lstsistematitulacion: [],
    lsttitulohilado: [],
    lsthilado: [],
    lstformahilado: [],
    enumEstado_abreviado: {
        Pending: "PE",
        Sent: "SE",
        Received: "RE",
        Approved: "AP",
        Rejected: "RJ"
    },
    enumEstado_largo: {
        PE: 'Pending',
        SE: "Sent",
        RE: "Received",
        AP: "Approved",
        RJ: "Rejected"
    }
};

function res_ini_edit(rsta) {
    let objPartida = rsta !== '' ? JSON.parse(rsta)[0] : {};
    let item = _comboItem({ value: '', text: '--Select--' });

    _('cbo_idcliente').innerHTML = item + _comboFromCSV(objPartida.cbo_idcliente);
    _('cbo_idfabrica').innerHTML = item + _comboFromCSV(objPartida.cbo_idfabrica);
    _('cbo_idtintoreria').innerHTML = item + _comboFromCSV(objPartida.cbo_idtintoreria);
    _('cbo_idcolor').innerHTML = item + _comboFromCSV(objPartida.cbo_idcolor);
    _('cbo_idfamilia').innerHTML = item + _comboFromCSV(objPartida.cbo_idfamilia);
    _('cbo_tipopartida').innerHTML = item + _comboFromCSV(objPartida.cbo_tipopartida);
    _('cbo_reproceso').innerHTML = item + _comboFromCSV(objPartida.cbo_reproceso);
    // _('cbo_formatoreportetecnico').innerHTML = item + _comboFromCSV(objPartida.cbo_formatoreportetecnico);
    ovariable_partida.lstsistematitulacion = CSVtoJSON(objPartida.cbo_sistematitulacion);
    ovariable_partida.lsttitulohilado = CSVtoJSON(objPartida.cbo_titulohilado);
    ovariable_partida.lsthilado = CSVtoJSON(objPartida.cbo_hilado);
    ovariable_partida.lstformahilado = CSVtoJSON(objPartida.cbo_formahilado);

    // LLENAR INPUTS SOBRE LA SOLICITUD
    let datasolicitudpartida = JSON.parse(objPartida.solicitudpartida)[0];
    _('hf_idsolicitudpartida').value = datasolicitudpartida.idsolicitudpartida;
    _('txt_codigo').value = datasolicitudpartida.codigo;
    _('cbo_idcliente').value = datasolicitudpartida.idcliente;
    _('cbo_idfabrica').value = datasolicitudpartida.idfabrica;
    _('cbo_idtintoreria').value = datasolicitudpartida.idtintoreria;
    _('cbo_idcolor').value = datasolicitudpartida.idcolor;
    _('cbo_idfamilia').value = datasolicitudpartida.idfamilia;
    _('cbo_tipopartida').value = datasolicitudpartida.tipopartida;
    if (datasolicitudpartida.estado === 'FI') {
        _('cbo_reproceso').value = datasolicitudpartida.tiporeproceso_desdepartida
    } else {
        _('cbo_reproceso').value = datasolicitudpartida.tiporeproceso;
    }
    
   // _('cbo_formatoreportetecnico').value = datasolicitudpartida.formatoreportetecnico;
    _('txt_densidad').value = datasolicitudpartida.densidad;
    _('txt_partida').value = datasolicitudpartida.partida;
    _('txt_comentario').value = datasolicitudpartida.comentario;


    // RADIO BUTTON LAVADO
    if (datasolicitudpartida.lavado == 1) {
        let arrradio_lavado = [...document.getElementsByClassName('_group_lavado')[0].getElementsByClassName('clslavado')];
        arrradio_lavado.some(x => {
            if (x.value == 1) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                return true;
            }
        });
    } else if (datasolicitudpartida.lavado == 2) {
        let arrradio_lavado = [...document.getElementsByClassName('_group_lavado')[0].getElementsByClassName('clslavado')];
        arrradio_lavado.some((x) => {
            if (x.value == 2) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                return true;
            }
        })
    }

    // RACIO BUTTON MISMO COLOR
    if (datasolicitudpartida.articulollevacomplementomismocolor == 1) {
        let arrradio_mismocolor = [...document.getElementsByClassName('_group_articulollevacomplementomismocolor')[0].getElementsByClassName('clsradmismocolor')];
        arrradio_mismocolor.some(x => {
            if (x.value == 1) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                return true;
            }
        });
    } else if (datasolicitudpartida.articulollevacomplementomismocolor == 0) {
        let arrradio_mismocolor = [...document.getElementsByClassName('_group_articulollevacomplementomismocolor')[0].getElementsByClassName('clsradmismocolor')];
        arrradio_mismocolor.some(x => {
            if (x.value == 0) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                return true;
            }
        });
    }
    // RADIO BUTTON CON O SIN TELA
    if (datasolicitudpartida.tienecodigotela == 1) {
        let arrradio_tienecodigotela = [...document.getElementsByClassName('_group_tienecodigotela')[0].getElementsByClassName('_clschk_tienecodigotela')];
        arrradio_tienecodigotela.some(x => {
            if (x.value == 1) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                let isChecked = true;
                esTela(isChecked);
                return true;
            }
        });
        llenardatos_cuandoes_contela(objPartida);
    } else if (datasolicitudpartida.tienecodigotela == 0) {
        let arrradio_tienecodigotela = [...document.getElementsByClassName('_group_tienecodigotela')[0].getElementsByClassName('_clschk_tienecodigotela')];
        arrradio_tienecodigotela.some(x => {
            if (x.value == 0) {
                x.checked = true;
                x.parentNode.classList.add('checked');
                let isChecked = false;
                esTela(isChecked);
                return true;
            }
        });
        llenardatos_cuandoes_sintela(objPartida);
    }
    _('txt_densidadestandard').value = datasolicitudpartida.densidadestandard;

    if (datasolicitudpartida.tiporeproceso != 0) {  // REPROCESO; EN ESTE NIVEL SIN EL ESTADO DE REPROCESO SIGNIFICA QUE ES SOLO EDITAR LA PARTIDA QUE YA TIENE REPROCESO
        _('div_reproceso').classList.remove('hide');
    }
}


function load_partida() {

    $('.i-checks._group_tienecodigotela').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let dom = e.currentTarget;
        _required_group(dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
        let isChecked = (dom.getAttribute('data-contienetela') === 'si');
        esTela(isChecked);
    })


    $('.i-checks._group_lavado').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let dom = e.currentTarget;
        _required_group(dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    })

    $('.i-checks._group_articulollevacomplementomismocolor').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    }).on('ifChanged', function (e) {
        let dom = e.currentTarget;
        _required_group(dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    })

    $('#txt_fechasolicitudpartida').val(_getDate()).trigger('change');
    _('cbo_idcliente').addEventListener('change', fn_cargacolorxcliente);

    $('#txt_densidad').autoNumeric('init', { mDec: 2 });
    $('#txt_densidadestandard').autoNumeric('init', { mDec: 2 });

    _('_btn_buscartela_solicitudpartida').addEventListener('click', fn_buscarTela);
    _('_btn_buscar_estilo').addEventListener('click', fn_buscarEstilo);
    _('_btn_save_new_partida').addEventListener('click', save_new_solicitudpartida)
    _('_btn_save_update_partida').addEventListener('click', save_edit_solicitudpartida);
    _('_btn_add_yarns').addEventListener('click', fn_addyarns);
    _('_lnk_view_crearhilado').addEventListener('click', fn_view_crearhilado)
    _('_btnreturn_solicitudpartida').addEventListener('click', _fn_retornaralindex);
    _('cbo_tipopartida').addEventListener('change', _fn_change_tipopartida);
    _('_btn_buscar_po').addEventListener('click', fn_busquedapocliente);
    
    $('#txt_densidad').autoNumeric('init', { mDec: 2 });
    $('#txt_densidadestandard').autoNumeric('init', { mDec: 2 });
}

function _required_group(dom) {
    let arr = [...dom.getElementsByTagName('input')];
    let isChecked = arr.some(x=> (x.checked));

    if (!isChecked) {
        dom.classList.add('has-error');
        arr.forEach(x=> {
            x.parentNode.parentNode.parentNode.classList.add('control-label');
        })
    } else {
        dom.classList.remove('has-error');
        arr.forEach(x=> {
            x.parentNode.parentNode.parentNode.classList.remove('control-label');
        })
    }
    return isChecked;
}

//function fn_grabarpartida() {
//    let req = _required({ id: 'modal_dialog_NewPartida', clase: '_enty' });
//    alert(req);
//}


function esTela(_estela) {
    let arr = _mapId('txt_codigotela,txt_descripciontela,txt_titulotela');
    let txt_densidadestandard = _('txt_densidadestandard');
    let padre_densidadestandard = txt_densidadestandard.parentNode.parentNode;
    if (_estela) {
        arr.forEach(x=> {
            x.value = '';
            let padre = x.parentNode.parentNode;
            padre.classList.remove('has-error');
        });
        _('hf_idtela').setAttribute("data-required", "true");
        _('txt_codigotela').setAttribute("data-required", "true");
        _('txt_descripciontela').setAttribute("data-required", "true");

        _('div_laboratorioestilo').classList.remove('hide');
        _('div_laboratorio_tela').classList.remove('hide');
        _('div_laboratoriopo').classList.remove('hide');
        _('div_laboratorio_hilados').classList.add('hide');

        txt_densidadestandard.value = '';
        txt_densidadestandard.removeAttribute("data-required");
        txt_densidadestandard.setAttribute("disabled", "disabled");
        padre_densidadestandard.classList.remove('has-error');
        _('hf_tienecodigotela').value = 1;
    } else {
        arr.forEach(x=> {
            x.value = '';
            //x.removeAttribute("data-required");
            let padre = x.parentNode.parentNode;
            padre.classList.remove('has-error');
        })

        _('hf_idtela').removeAttribute("data-required");
        _('txt_codigotela').removeAttribute("data-required");
        _('txt_descripciontela').removeAttribute("data-required");

        _('div_laboratorioestilo').classList.add('hide');
        _('div_laboratorio_tela').classList.add('hide');
        _('div_laboratoriopo').classList.add('hide');
        _('div_laboratorio_hilados').classList.remove('hide');
        
        txt_densidadestandard.value = '';
        txt_densidadestandard.setAttribute("data-required", "true");
        txt_densidadestandard.removeAttribute("disabled");
        padre_densidadestandard.classList.remove('has-error');
        _('hf_tienecodigotela').value = 0;
    }
}

function _mapId(_cadena_id) {
    let cadena = _cadena_id || '';
    if (cadena !== '') {
        let arrids = cadena.split(',');
        return (arrids.length >= 0)
            ? arrids.map(x=> document.getElementById(x))
            : [];
    }
    return [];
}


function fn_cargacolorxcliente(e) {
    let idcliente = e.target.value;
    const arr = ovariable_partida.arr_color;
    if (arr.length > 0) {
        let arrcliente = arr.filter(x=>  x.idcliente === idcliente);
        if (arrcliente.length < 0) return '';
        _('cbo_idcolor').innerHTML = _comboItem({ value: '', text: '--Select--' }) + _comboFromJSON(arrcliente, 'idclientecolor', 'nombreclientecolor');
    }
    return '';
}


function arrfilter(_arr) {
    return _arr.some(x => x.checked) ? _arr.filter(x=>x.checked)[0].value : "0";
}

function save_new_solicitudpartida() {
    let reqEncabezado = _required({ id: 'panelEncabezado', clase: '_enty' });
    if (reqEncabezado) {
        if (!validar_antes_grabar_solicitudpartida()) return false;

        let reqPartida = _required({ id: 'body_NewPartida', clase: '_enty' }), orespuesta = {}, _oresult = { estado: false }
        if (reqPartida) {
            let solicitupartida = _getParameter({ id: 'div_cuerpoprincipal', clase: '_enty' });
            let divchklavado = document.getElementsByClassName('_group_lavado'),
                arrchklavado = [...divchklavado[0].getElementsByClassName('clslavado')],
                divchkmismocolor = document.getElementsByClassName('_group_articulollevacomplementomismocolor'),
                arrchkmismocolor = [...divchkmismocolor[0].getElementsByClassName('clsradmismocolor')];

            solicitupartida['lavado'] = arrfilter(arrchklavado);
            solicitupartida['articulollevacomplementomismocolor'] = arrfilter(arrchkmismocolor);

            let estilosxtela = JSON.stringify(getArrayEstilos_save()),
                listahilados = JSON.stringify(getArrayHilado_save()), listapo = JSON.stringify(getArrayPo_save());
            let frmdata = new FormData();
            frmdata.append('par', JSON.stringify(solicitupartida));
            frmdata.append('pardetail', listahilados);
            frmdata.append('parsubdetail', '');
            frmdata.append('parfoot', estilosxtela);
            frmdata.append('parsubfoot', listapo);
        
            Post('Laboratorio/SolicitudPartida/save_new_solicitudpartida', frmdata, function (respuesta) {
                let orespuesta = JSON.parse(respuesta);
                swal({
                    title: "Message",
                    text: orespuesta.mensaje,
                    type: orespuesta.estado
                }, function (result) {                    
                    if (result) {
                        req_load_menu_filter_result('pending', orespuesta.id);
                        _('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
                    }
                });

            }, false)
        }
    }
}

function save_edit_solicitudpartida() {
    let reqEncabezado = _required({ id: 'panelEncabezado', clase: '_enty' });
    if (reqEncabezado) {
        if (!validar_antes_grabar_solicitudpartida()) return false;
        let reqPartida = _required({ id: 'body_NewPartida', clase: '_enty' }), orespuesta = {}, _oresult = { estado: false }
        if (reqPartida) {
            let par = _('txtpar_editpartida').value, estado = _par(par, 'estado');
            let solicitupartida = _getParameter({ id: 'div_cuerpoprincipal', clase: '_enty' });

            let divchklavado = document.getElementsByClassName('_group_lavado'),
                arrchklavado = [...divchklavado[0].getElementsByClassName('clslavado')];

            let divchkmismocolor = document.getElementsByClassName('_group_articulollevacomplementomismocolor'),
                arrchkmismocolor = [...divchkmismocolor[0].getElementsByClassName('clsradmismocolor')];

            solicitupartida['lavado'] = arrfilter(arrchklavado);
            solicitupartida['articulollevacomplementomismocolor'] = arrfilter(arrchkmismocolor);
            if (estado === 'RP') { // REPROCESO
                solicitupartida['estado'] = 'PE';
            }

            let estilosxtela = JSON.stringify(getArrayEstilos_save()),
                listahilados = JSON.stringify(getArrayHilado_save()), listapo = JSON.stringify(getArrayPo_save());

            let frmdata = new FormData();
            frmdata.append('par', JSON.stringify(solicitupartida));
            frmdata.append('pardetail', listahilados);
            frmdata.append('parsubdetail', '');
            frmdata.append('parfoot', estilosxtela);
            frmdata.append('parsubfoot', listapo);

            if (estado === 'RP') { // REPROCESO
                // SI ES REPROCESO ES : INSERT O NEW
                Post('Laboratorio/SolicitudPartida/save_new_solicitudpartida', frmdata, function (respuesta) {
                    let orespuesta = JSON.parse(respuesta);
                    swal({
                        title: "Message",
                        text: orespuesta.mensaje,
                        type: orespuesta.estado
                    }, function (result) {
                        if (result) {
                            req_load_menu_filter_result('pending', orespuesta.id);
                            _('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
                        }
                    });

                }, false)
            } else if (estado.toUpperCase() === 'RESEND') {  // estado; este dato se trae de la bd de la tabla funcion en el campo parametro
                // SI ES REENVIAR ES : INSERT O NEW
                Post('Laboratorio/SolicitudPartida/save_new_solicitudpartida', frmdata, function (respuesta) {
                    let orespuesta = JSON.parse(respuesta);
                    swal({
                        title: "Message",
                        text: orespuesta.mensaje,
                        type: orespuesta.estado
                    }, function (result) {
                        if (result) {
                            req_load_menu_filter_result('pending', orespuesta.id);
                            _('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
                        }
                    });

                }, false)
            } else { // SI NO ES REPROCESO SOLO ES UPDATE O EDIT
                Post('Laboratorio/SolicitudPartida/save_edit_solicitudpartida', frmdata, function (respuesta) {
                    let orespuesta = JSON.parse(respuesta);
                    swal({
                        title: "Message",
                        text: orespuesta.mensaje,
                        type: orespuesta.estado
                    }, function (result) {
                        if (result) {
                            req_load_menu_filter_result('pending', orespuesta.id);
                            _('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
                        }
                    });
                }, false);
            }
        }
    }
}

function getArrayEstilos_save() {
    let tabla = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar'), arrfilas = [...tabla.rows],
        arrdata = [];
    arrfilas.forEach(x => {
        let par = x.getAttribute('data-par');
        let obj = {
            idsolicitudpartidaestiloxtela: _par(par, 'idsolicitudpartidaestiloxtela'),
            idestilo: _par(par, 'idestilo'),
            idtela: _par(par, 'idtela'),
            principal: _par(par, 'principal')
        }
        arrdata.push(obj);
    });

    return arrdata;
}

function getArrayHilado_save() {
    let tblbody = _('tbodyHiladoEditarSolicitudPartida'),
        arrfilas = [...tblbody.rows],
        arrdata = [];
    arrfilas.forEach((x, indice) => {
        let par = x.getAttribute('data-par'),
            idsolicitudpartidahilado = _par(par, 'idsolicitudpartidahilado');
        let cbosistema = x.getElementsByClassName('_cbo_sistematitulacion')[0],
            cbotitulo = x.getElementsByClassName('_cbo_titulo')[0],
            cbohilado = x.getElementsByClassName('_cbo_hilado')[0],
            cboformahilado = x.getElementsByClassName('_cbo_formahilado')[0];
        let idsistematitulacion = cbosistema.value,
            idtitulo = cbotitulo.value,
            idhilado = cbohilado.value,
            idformahilado = cboformahilado.value,
            porcentajehilado = x.getElementsByClassName('_cls_porcentajehilado')[0].value;
        let nombretitulo = cbotitulo.options[cbotitulo.selectedIndex].text;
        //alert(x.getElementsByClassName('_cls_contenidohilado'));
        let contenido = x.getElementsByClassName('_cls_contenidohilado')[0].innerText;

        let obj = {
            idsolicitudpartidahilado: idsolicitudpartidahilado,
            idsistematitulacion: idsistematitulacion,
            idtitulohiladotela: idtitulo,
            idhilado: idhilado,
            idformahilado: idformahilado,
            titulo: nombretitulo,
            porcentaje: porcentajehilado,
            orden: (indice + 1),
            contenido: contenido
        }
        arrdata.push(obj);
    });

    return arrdata;
}

function getArrayPo_save() {
    let tbody = _('_tbodyGridSolicitudPartidaPoEditar'), arr = [...tbody.rows], lstpo = [];
    arr.forEach(x => {
        let par = x.getAttribute('data-par');
        let obj = {
            idsolicitudpartidapo: _par(par, 'idsolicitudpartidapo'),
            idpocliente: _par(par, 'idpocliente'),
            codigopocliente: _par(par, 'codigopocliente')
        }
        lstpo.push(obj);
    });
    return lstpo;
}

function res_ini_new(rsta) {
    let _obj = JSON.parse(rsta)[0];
    let item = _comboItem({ value: '', text: '--Select--' });
    ovariable_partida.arr_color = CSVtoJSON(_obj.cbo_idcolor) || [];

    _('cbo_idcliente').innerHTML = item + _comboFromCSV(_obj.cbo_idcliente);
    _('cbo_idfabrica').innerHTML = item + _comboFromCSV(_obj.cbo_idfabrica);
    _('cbo_idtintoreria').innerHTML = item + _comboFromCSV(_obj.cbo_idtintoreria);
    _('cbo_idcolor').innerHTML = item; //+ _comboFromCSV(_obj.cbo_idcolor);
    _('cbo_idfamilia').innerHTML = item + _comboFromCSV(_obj.cbo_idfamilia);
    _('cbo_tipopartida').innerHTML = item + _comboFromCSV(_obj.cbo_tipopartida);
    //_('cbo_formatoreportetecnico').innerHTML = item + _comboFromCSV(_obj.cbo_formatoreportetecnico);
    ovariable_partida.lstsistematitulacion = CSVtoJSON(_obj.cbo_sistematitulacion);
    ovariable_partida.lsttitulohilado = CSVtoJSON(_obj.cbo_titulohilado);
    ovariable_partida.lsthilado = CSVtoJSON(_obj.cbo_hilado);
    ovariable_partida.lstformahilado = CSVtoJSON(_obj.cbo_formahilado);
}


function fn_ini() {
    let par = _('txtpar_editpartida').value;
    let accion = _par(par, "accion"),
        idpartida = _par(par, "idpartida"), idsolicitudpartida = _par(par, 'idsolicitudpartida'), estadopartida = _par(par, 'estado'), 
        reenviarsino = _par(par, 'reenviarsino');

    let oestados = {
        nuevo: { estado: 'new', metodo: 'getDataNuevaSolicitud' },
        edicion: { estado: 'edit', metodo: 'getDataEditSolicitud' },
        error: { estado: '', metodo: '' }
    }

    let estado = oestados[accion].estado || oestados[error].estado,
        metodo = estado !== '' ? oestados[accion].metodo : '',
        obj = { idpartida: idpartida };
    let url = `Laboratorio/SolicitudPartida/${metodo}?par=${JSON.stringify(obj)}`;
    if (metodo !== '') {
        switch (estado) {
            case 'new':
                _('hf_estadosolicitudpartida').value = ovariable_partida.estado_pendiente;
                _('hf_reenviarsino').value = 0;
                _('_btn_save_update_partida').classList.add('hide');
                Get(url, res_ini_new);
                break;
            case 'edit':
                obj = { idsolicitudpartida: idsolicitudpartida }
                _('hf_estadosolicitudpartida').value = ovariable_partida.estado_pendiente;
                _('hf_reenviarsino').value = 0;
                _('_btn_save_new_partida').classList.add('hide');
                url = `Laboratorio/SolicitudPartida/${metodo}?par=${JSON.stringify(obj)}`;
                Get(url, res_ini_edit);
                break;
        }
    }

    if (estadopartida === 'RP') {  // REPROCESO; AHORA SOLO SE VA A VER EL COMBO REPROCESO SOLO SI ESTA RECHAZADDO LA PARTIDA Y QUE NO HAYA NINGUN ESTADO DE APROBACION COMERCIAL
        _('div_reproceso').classList.remove('hide');
    }
    if (reenviarsino == 1) {
        _('hf_reenviarsino').value = reenviarsino;
    }
}

function fn_checks() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
}

function fn_addyarns() {
    let html = '', tblbody = _('tbodyHiladoEditarSolicitudPartida'), totalfilas = tblbody.rows.length, nrofila = totalfilas + 1;
    html = `<tr data-par='idsolicitudpartidahilado:0'>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-sm btn-danger _clsdeleteyarns'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>
                <td class ='text-center' style='vertical-align: middle;'>${nrofila}</td>
                <td class ='text-center'>
                    <select class ='_cbo_sistematitulacion form-control'></select>
                    <div class ='hide text-danger _cls_error_sistema_hilado'>Missing select system</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_titulo form-control'></select>
                    <div class ='hide text-danger _cls_error_titulo_hilado'>Missing select title</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_hilado form-control'></select>
                    <div class ='hide text-danger _cls_error_nombrehilado_hilado'>Missing select yarn</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_formahilado form-control'></select>
                    <div class ='hide text-danger _cls_error_forma_hilado'>Missing select shapped yarn</div>
                </td>
                <td class ='text-center _cls_contenidohilado'title='fibra hilado'></td>
                <td class ='text-center'>
                    <input type='text' class ='_cls_porcentajehilado form-control' onkeypress='return DigitimosDecimales(event, this)'/>
                    <div class ='hide text-danger _cls_error_porcentaje_hilado'>Missing the percentage</div>
                </td>
            </tr>
        `;
    _('tbodyHiladoEditarSolicitudPartida').insertAdjacentHTML('beforeend', html);
    handler_combos_tblhilado_alagregaritem(nrofila - 1);
    llenarcombo_sistematitulacion_alagregaritem(nrofila - 1);
    llenarcombo_formahilado_alagregaritem(nrofila - 1);
}

function llenarcombo_sistematitulacion_alagregaritem(indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila];
    // COMBO HILADO
    let cbosistema = fila.getElementsByClassName('_cbo_sistematitulacion')[0];
    cbosistema.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariable_partida.lstsistematitulacion, 'idsistematitulacion', 'nombresistematitulacion');
}

function llenarcombos_tblhilado_load_editar(datahilado) {
    if (datahilado != null) {
        let tblbody = _('tbodyHiladoEditarSolicitudPartida'), arrFilas = [...tblbody.rows];
        arrFilas.forEach(xf => {
            let par = xf.getAttribute('data-par'), idsolicitudpartidahilado = _par(par, 'idsolicitudpartidahilado');
            let datafilter = datahilado.filter(y => y.idsolicitudpartidahilado == idsolicitudpartidahilado);

            let indexfila = xf.rowIndex - 1;
            let fila = xf;
            let cbosistema = fila.getElementsByClassName('_cbo_sistematitulacion')[0],
                cbotitulo = fila.getElementsByClassName('_cbo_titulo')[0],
                cbohilado = fila.getElementsByClassName('_cbo_hilado')[0],
                cboformahilado = fila.getElementsByClassName('_cbo_formahilado')[0];

            cbosistema.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariable_partida.lstsistematitulacion, 'idsistematitulacion', 'nombresistematitulacion');
            cbosistema.value = datafilter[0].idsistematitulacion;

            let listatitulos = ovariable_partida.lsttitulohilado.filter(x => x.idsistematitulacion == datafilter[0].idsistematitulacion);
            cbotitulo.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listatitulos, 'idtitulo', 'nombretitulo');
            cbotitulo.value = datafilter[0].idtitulohiladotela;

            let listahilados = ovariable_partida.lsthilado.filter(x => x.idsistematitulacion == datafilter[0].idsistematitulacion && x.idtitulo == datafilter[0].idtitulohiladotela);
            cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listahilados, 'idhilado', 'nombrehilado');
            cbohilado.value = datafilter[0].idhilado;

            cboformahilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariable_partida.lstformahilado, 'idformahilado', 'nombreformahilado');
            cboformahilado.value = datafilter[0].idformahilado;
        });

    }
}

function llenarcombo_titulohilado_alseleccionarsistematitulacion(idsistematitulacion, indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila],
        cbotitulo = fila.getElementsByClassName('_cbo_titulo')[0];
    // COMBO TITULO
    let listatitulos = ovariable_partida.lsttitulohilado.filter(x => x.idsistematitulacion == idsistematitulacion);
    cbotitulo.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listatitulos, 'idtitulo', 'nombretitulo');
}

function llenarcombo_hilado_alseleccionartitulo(idsistematitulacion, idtitulo, indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila],
        cbohilado = fila.getElementsByClassName('_cbo_hilado')[0];
    let listahilados = ovariable_partida.lsthilado.filter(x => x.idsistematitulacion == idsistematitulacion && x.idtitulo == idtitulo);
    cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listahilados, 'idhilado', 'nombrehilado');
}

function llenarcombo_formahilado_alagregaritem(indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila],
        cboformahilado = fila.getElementsByClassName('_cbo_formahilado')[0];
    cboformahilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariable_partida.lstformahilado, 'idformahilado', 'nombreformahilado');
}

function handler_combos_tblhilado_alagregaritem(indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila],
        cbosistema = fila.getElementsByClassName('_cbo_sistematitulacion')[0],
        cbotitulo = fila.getElementsByClassName('_cbo_titulo')[0],
        cbohilado = fila.getElementsByClassName('_cbo_hilado')[0],
        cboformahilado = fila.getElementsByClassName('_cbo_formahilado')[0];

    cbosistema.addEventListener('change', function (e) {
        let valor = e.currentTarget.value;
        llenarcombo_titulohilado_alseleccionarsistematitulacion(valor, indexfila);
        // LIMPIAR COMBO HILADO
        cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' });
    });

    cbotitulo.addEventListener('change', function (e) {
        let valor_idsistematitulacion = cbosistema.value;
        let valor = e.currentTarget.value;
        llenarcombo_hilado_alseleccionartitulo(valor_idsistematitulacion, valor, indexfila);
    });

    cbohilado.addEventListener('change', function (e) {
        let valor = e.currentTarget.value;
        let filterhilado = ovariable_partida.lsthilado.filter(x => x.idhilado == valor);
        cboformahilado.value = filterhilado[0].idformahilado; //valor;
        let html_contenido = `<div class ='input-group'>
                                        <a href='javascript:void(0)' class ='_cls_viewmateriaprima_hilado'>
                                            ${filterhilado[0].contenido}
                            </a>
                            <span type='button' class ='btn btn-xs input-group-addon bg-info _cls_viewmateriaprima_hilado_span'>
                                <span class ='fa fa-eye'></span>
                            </span>
                        </div>`;
        fila.getElementsByClassName('_cls_contenidohilado')[0].innerHTML = html_contenido;        
        handler_link_contenido_porfila(fila.rowIndex - 1);
    });

    // BOTON ELIMINAR
    let btndelete = fila.getElementsByClassName('_clsdeleteyarns')[0];
    btndelete.addEventListener('click', fn_delete_hilado);
}

function handler_link_contenido_porfila(indexfila) {
    let fila = _('tbodyHiladoEditarSolicitudPartida').rows[indexfila];

    let link_viewmateriaprima_hilado = fila.getElementsByClassName('_cls_viewmateriaprima_hilado')[0];
    link_viewmateriaprima_hilado.addEventListener('click', fn_viewmateriaprima_hilado);

    let link_viewmateriaprima_hilado_span = fila.getElementsByClassName('_cls_viewmateriaprima_hilado_span')[0];
    link_viewmateriaprima_hilado_span.addEventListener('click', fn_viewmateriaprima_hilado);
}


function handler_combos_tblhilado_load_editar(datahilado) {
    if (datahilado != null) {
        let tblbody = _('tbodyHiladoEditarSolicitudPartida'), arrFilas = [...tblbody.rows];
        arrFilas.forEach(x => {
            let indexfila = x.rowIndex - 1;
            let fila = x; //x.rows[indexfila]
            let cbosistema = fila.getElementsByClassName('_cbo_sistematitulacion')[0],
                cbotitulo = fila.getElementsByClassName('_cbo_titulo')[0],
                cbohilado = fila.getElementsByClassName('_cbo_hilado')[0],
                cboformahilado = fila.getElementsByClassName('_cbo_formahilado')[0];

            cbosistema.addEventListener('change', function (e) {
                let valor = e.currentTarget.value;
                llenarcombo_titulohilado_alseleccionarsistematitulacion(valor, indexfila);
                // LIMPIAR COMBO HILADO
                cbohilado.innerHTML = _comboItem({ value: '', text: 'Select' });
            });

            cbotitulo.addEventListener('change', function (e) {
                let valor_idsistematitulacion = cbosistema.value;
                let valor = e.currentTarget.value;
                llenarcombo_hilado_alseleccionartitulo(valor_idsistematitulacion, valor, indexfila);
            });

            cbohilado.addEventListener('change', function (e) {
                let valor = e.currentTarget.value;
                let filterhilado = ovariable_partida.lsthilado.filter(x => x.idhilado == valor);
                cboformahilado.value = filterhilado.idformahilado; //valor;
                fila.getElementsByClassName('_cls_contenidohilado')[0].innerHTML = `<a href='javascript:void(0)'>${filterhilado[0].contenido}</a>`;
            });

            let btneliminar = x.getElementsByClassName('_clsdeleteyarns')[0];
            btneliminar.addEventListener('click', fn_delete_hilado);

            let link_viewmateriaprima_hilado = x.getElementsByClassName('_cls_viewmateriaprima_hilado')[0];
            link_viewmateriaprima_hilado.addEventListener('click', fn_viewmateriaprima_hilado);

            let link_viewmateriaprima_hilado_span = x.getElementsByClassName('_cls_viewmateriaprima_hilado_span')[0];
            link_viewmateriaprima_hilado_span.addEventListener('click', fn_viewmateriaprima_hilado);
        });

    }


}

function llenardatos_cuandoes_contela(_obj) {
    let oestilos = _obj.estilos_solicitudpartida != '' ? CSVtoJSON(_obj.estilos_solicitudpartida, '¬', '^') : null, html = '',
        tblbody = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar');
    if (oestilos != null) {
        oestilos.forEach(x => {
            let idsolicitudpartidaestiloxtela = x.idsolicitudpartidaestiloxtela,
                idestilo = x.idestilo,
                idtela = x.idtela,
                principal = x.principal,
                codigoestilo = x.codigoestilo,
                codigotela = x.codigotela,
                nombretela = x.nombretela;
            html += `<tr data-par='idsolicitudpartidaestiloxtela:${idsolicitudpartidaestiloxtela},idestilo:${idestilo},idtela:${idtela},principal:${principal}'>
                        <td class ='text-center'>
                            <button class ='btn btn-sm btn-danger _cls_deleteestilo' title='Delete'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>${codigoestilo}</td>
                        <td>${codigotela}</td>
                        <td>${nombretela}</td>
                    </tr>
                `;
        });
        tblbody.innerHTML = html;
        handlertblestilos_solicitudpartida_al_loadeditar();
    }

    // DATOS DE LA PO
    html = '';
    let opo = _obj.po_solicitudpartida !== '' ? CSVtoJSON(_obj.po_solicitudpartida) : null, tbody_po = _('_tbodyGridSolicitudPartidaPoEditar');
    if (opo !== null) {
        opo.forEach(x => {
            html += `<tr data-par='idsolicitudpartidapo:${x.idsolicitudpartidapo},idpocliente:${x.idpocliente},codigopocliente:${x.codigopocliente}'>
                        <td class ='text-center'>
                            <button class ='btn btn-sm btn-danger _cls_delete_po' title='Delete'>
                                <span class ='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>${x.codigopocliente}</td>
                        <td>${x.codigoestilo}</td>
                    </tr>
                `;
        });
        tbody_po.innerHTML = html;
        handlertbl_po_solicitudpartida_al_loadeditar();
    }

    //  LLENAR DATOS DE LA TELA
    let data_solicitudpartida = JSON.parse(_obj.solicitudpartida)[0];
    _('hf_idtela').value = data_solicitudpartida.idtela;
    _('txt_codigotela').value = data_solicitudpartida.codigotela;
    _('txt_descripciontela').value = data_solicitudpartida.descripciontela;
    _('txt_titulotela').value = data_solicitudpartida.titulotela;
    _('txt_composiciontela').value = data_solicitudpartida.composicionporcentajetela;
}

function llenardatos_cuandoes_sintela(_obj) {
    let datahilado = _obj.detallehilado !== '' ? CSVtoJSON(_obj.detallehilado) : null, html = '';
    if (datahilado !== null) {
        datahilado.forEach(x => {
            html += `<tr data-par='idsolicitudpartidahilado:${x.idsolicitudpartidahilado},idhilado:${x.idhilado}'>
                <td class='text-center' style='vertical_align: middle;'>
                    <button type='button' class='btn btn-sm btn-danger _clsdeleteyarns'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>
                <td class ='text-center' style='vertical-align: middle;'>${x.orden}</td>
                <td class ='text-center'>
                    <select class ='_cbo_sistematitulacion form-control'></select>
                    <div class ='hide text-danger _cls_error_sistema_hilado'>Missing select system</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_titulo form-control'></select>
                    <div class ='hide text-danger _cls_error_titulo_hilado'>Missing select title</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_hilado form-control'></select>
                    <div class ='hide text-danger _cls_error_nombrehilado_hilado'>Missing select yarn</div>
                </td>
                <td class ='text-center'>
                    <select class ='_cbo_formahilado form-control'></select>
                    <div class ='hide text-danger _cls_error_forma_hilado'>Missing select shapped yarn</div>
                </td>
                <td class ='text-center _cls_contenidohilado'title='fibra hilado'>
                    <div class ='input-group'>
                        <a href='javascript:void(0)' class ='_cls_viewmateriaprima_hilado'>
                            ${x.contenido}
                        </a>
                        <span type='button' class ='btn btn-xs input-group-addon bg-info _cls_viewmateriaprima_hilado_span'>
                            <span class ='fa fa-eye'></span>
                        </span>
                    </div>

                </td>
                <td class ='text-center'>
                    <input type='text' class ='_cls_porcentajehilado form-control' value='${x.porcentaje}' onkeypress='return DigitimosDecimales(event, this)'/>
                    <div class ='hide text-danger _cls_error_porcentaje_hilado'>Missing the percentage</div>
                </td>
            </tr>
          `;
        });
        _('tbodyHiladoEditarSolicitudPartida').innerHTML = html;
        handler_combos_tblhilado_load_editar(datahilado);
        llenarcombos_tblhilado_load_editar(datahilado);
    }
}

function handlertblestilos_solicitudpartida_al_loadeditar() {
    let tblbody = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar'),
        arrdelete = _Array(tblbody.getElementsByClassName('_cls_deleteestilo'));

    arrdelete.forEach(x => x.addEventListener('click', e => {
        eliminarestilo_solicitudpartida(e);
    }));
}

function eliminarestilo_solicitudpartida(e) {
    let o = e.target, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }
    if (fila != null) {
        fila.parentNode.removeChild(fila);
    }
}

function fn_delete_hilado(e) {
    let o = e.currentTarget, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }
    if (fila !== null) {
        fila.parentNode.removeChild(fila);
    }
}

function validar_antes_grabar_solicitudpartida() {
    let pasalavalidacion = true;
    let div_opt_tienecodigotela_seleccionado = _('div_tienecodigotela').getElementsByClassName('iradio_square-green checked')[0];
    let opt_tienecodigotela_seleccionado = div_opt_tienecodigotela_seleccionado.getElementsByClassName('_clschk_tienecodigotela')[0]
    if (opt_tienecodigotela_seleccionado.value == 0) { // SIN CODIGO DE TELA
        let validacionhilado = validar_cuando_es_sincodigotela();
        if (validacionhilado === false) {
            pasalavalidacion = false;
        }
    } else if (opt_tienecodigotela_seleccionado.value == 1) {  // CON CODIGO DE TELA
        let validacionhilado = validar_cuando_es_contela();
        if (validacionhilado === false) {
            pasalavalidacion = false;
        }
    }
    //_group_tienecodigotela

    return pasalavalidacion;
}

function validar_cuando_es_sincodigotela() {
    let tblbody = _('tbodyHiladoEditarSolicitudPartida'),
        mensaje = '',
        pasalavalidacion = true,
        tienehilado = true,
        totalfilashilado = tblbody.rows.length,
        totalporcentaje = 0,
        pasavalidacion_requeridos = true,
        arrhilados_seleccionados = [],
        pasavalidacion_duplicados = true;

    if (totalfilashilado <= 0) {
        pasalavalidacion = false;
        tienehilado = false;
        mensaje += '- missing add yarn \n';
    }

    if (tienehilado) {
        let arrfilas = [...tblbody.rows];
        arrfilas.forEach(x => {
            let cbosistema = x.getElementsByClassName('_cbo_sistematitulacion')[0];
            let div_error_sistema = x.getElementsByClassName('_cls_error_sistema_hilado')[0];
            if (cbosistema.value == '') {                
                div_error_sistema.classList.remove('hide');
                pasalavalidacion = false;
                pasavalidacion_requeridos = false;
            } else {
                div_error_sistema.classList.add('hide');
            }

            let cbotitulo = x.getElementsByClassName('_cbo_titulo')[0];
            let div_error_titulo = x.getElementsByClassName('_cls_error_titulo_hilado')[0];
            if (cbotitulo.value == '') {                
                div_error_titulo.classList.remove('hide');
                pasalavalidacion = false;
                pasavalidacion_requeridos = false;
            } else {
                div_error_titulo.classList.add('hide');
            }

            let cbohilado = x.getElementsByClassName('_cbo_hilado')[0];
            let div_error_hilado = x.getElementsByClassName('_cls_error_nombrehilado_hilado')[0];
            if (cbohilado.value == '') {                
                div_error_hilado.classList.remove('hide');
                pasalavalidacion = false;
                pasavalidacion_requeridos = false;
            } else {
                div_error_hilado.classList.add('hide');
            }

            let cboformahilado = x.getElementsByClassName('_cbo_formahilado')[0];
            let div_error_formahilado = x.getElementsByClassName('_cls_error_forma_hilado')[0];
            if (cboformahilado.value == '') {                
                div_error_formahilado.classList.remove('hide');
                pasalavalidacion = false;
                pasavalidacion_requeridos = false;
            } else {
                div_error_formahilado.classList.add('hide');
            }

            let txtporcentaje = x.getElementsByClassName('_cls_porcentajehilado')[0];
            let div_error_porcentaje = x.getElementsByClassName('_cls_error_porcentaje_hilado')[0];
            if (txtporcentaje.value == '' || txtporcentaje.value == 0) {
                div_error_porcentaje.classList.remove('hide');
                pasalavalidacion = false;
                pasavalidacion_requeridos = false;
            } else {
                div_error_porcentaje.classList.add('hide');
            }

            totalporcentaje += parseFloat(txtporcentaje.value)
        });

        if (pasavalidacion_requeridos === true) {
            // VALIDACION DE SUMA DE PORCENTAJES
            totalporcentaje = parseFloat(totalporcentaje).toFixed(2)

            if (totalporcentaje != 100) {
                mensaje += '-The percentage total must be equal to 100%. \n';
                pasalavalidacion = false;
            }
        }
    }

    if (mensaje !== '') {
        _swal({ mensaje: mensaje, estado: 'error' });
    }

    return pasalavalidacion;
}

function validar_cuando_es_contela() {
    let tblestilo = _('_tbodyGridSolicitudPartidaEstiloxTelaEditar'), totalfilas = tblestilo.rows, pasalavalidacion = true, tblpo = _('_tbodyGridSolicitudPartidaPoEditar'),
        totalfilaspo = tblpo.rows, mensaje = '';
    if (totalfilas.length <= 0) {
        pasalavalidacion = false;
        mensaje = '- Missing styles. \n';
    }
    if (totalfilaspo.length <= 0) {
        pasalavalidacion = false;
        mensaje += '- Missing select po. \n';
    }
    if (pasalavalidacion === false) {
        _swal({ mensaje: mensaje, estado: 'error' });
    }
    return pasalavalidacion;
}

function _fn_retornaralindex() {
    let idsolicitudpartida = _('hf_idsolicitudpartida').value, estado = _('hf_estadoactualbusqueda_index').value; //_('hf_estadosolicitudpartida').value;
    //estado = estado === '' ? 'pending' : ovariable_partida.enumEstado_largo[estado].toLowerCase();
    idsolicitudpartida = idsolicitudpartida === '' ? 0 : idsolicitudpartida;
    if (idsolicitudpartida === 0) {
        refrescarsolicitudpartida_index();
    } else {
        req_load_menu_filter_result(estado, idsolicitudpartida);
    }
    _('div_filtro_bandeja_solicitudpartida').classList.remove('hide');
}

function _fn_change_tipopartida() {
    let cbo_tipopartida = _('cbo_tipopartida'),
        opcion = cbo_tipopartida.options[cbo_tipopartida.selectedIndex].text.toUpperCase(),
        obj = {
            PRODUCTION: "production",
            DEVELOPMENT: "development",
            SAMPLE: "sample",
            DEFAULT: ""
        },
        tipopartida = obj[opcion] || opcion.DEFAULT,
        div_tienecodigotela = _('div_tienecodigotela'),
        fun_checked = (compara) =>
        {
            let arr = [...div_tienecodigotela.getElementsByClassName('_clschk_tienecodigotela')], ischecked = false;
            if (compara !== "") {                
                arr.forEach(x=> {
                    x.parentNode.classList.remove('checked');
                    
                    if (x.getAttribute("data-contienetela") === compara) {
                        x.parentNode.classList.add('checked');
                        if (compara === 'si') { ischecked = true }
                        x.checked = true;
                    }
                });
                esTela(ischecked);
            } else {
                arr.forEach(x=> {x.parentNode.classList.remove('checked');x.checked = false;});

                _('div_laboratorioestilo').classList.add('hide');
                _('div_laboratorio_tela').classList.add('hide');
                _('div_laboratorio_hilados').classList.add('hide');
            }        
        }
    div_tienecodigotela.classList.remove('has-error');
    
    switch (tipopartida) {
        case "production":            
           fun_checked("si");
            break;
        case "development":            
            fun_checked("no");
            break;
        case "sample":
            fun_checked("no");
            break;
        default:
            fun_checked("");
            break;
    }
}

/*FUNCIONES PARA PO*/
function handlertbl_po_solicitudpartida_al_loadeditar() {
    let tblbody = _('_tbodyGridSolicitudPartidaPoEditar'),
        arrdelete = _Array(tblbody.getElementsByClassName('_cls_delete_po'));

    arrdelete.forEach(x => x.addEventListener('click', e => {
        eliminar_po_solicitudpartida(e);
    }));
}

function eliminar_po_solicitudpartida(e) {
    let o = e.target, tag = o.tagName, fila = null;
    switch (tag) {
        case 'BUTTON':
            fila = o.parentNode.parentNode;
            break;
        case 'SPAN':
            fila = o.parentNode.parentNode.parentNode;
            break;
    }
    if (fila != null) {
        fila.parentNode.removeChild(fila);
    }
}

(function ini() {
    fn_checks();
    fn_ini();
    load_partida();
    _rules({ id: 'body_NewPartida', clase: '_enty' });
})();
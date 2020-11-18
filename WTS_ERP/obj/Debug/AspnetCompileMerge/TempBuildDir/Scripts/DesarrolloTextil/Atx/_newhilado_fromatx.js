var appNewHiladoFromAtx = (
    function (d, idpadre) {
        var ovariables = {
            lstsistematitulacion: [],
            lsttitulohilado: [],
            lstformahilado: [],
            lstmateriaprima: [],
            lstestado: [],
            lstcolor: [],
            sistema: '',
            titulo: '',
            shapedyarn: ''
        }

        function load() {
            let par = _('txtpar_newhilado').value;
                ovariables.sistema = _par(par, 'sistema'), ovariables.titulo = _par(par, 'titulo'), ovariables.shapedyarn = _par(par, 'shapedyarn');

            _('_cbo_sistema_newhilado').addEventListener('change', fn_change_sistema_new_hilado);
            _('_btn_add_item_materiaprima_newhilado').addEventListener('click', fn_addmateriaprima_newhilado);
            _('_btnSave_newhilado').addEventListener('click', save_new_hilado);
            _('btnsave_new_titulo').addEventListener('click', save_new_titulo, false);
            _('btn_new_titulo_newhilado').addEventListener('click', function () { ver_input_save_newtitulo('titulo', 'view') }, false);
            _('btnsave_new_formahilado').addEventListener('click', save_new_formahilado, false);
            _('btn_new_formahilado_newhilado').addEventListener('click', function () { ver_input_save_newtitulo('formahilado', 'view') }, false);
            _('btncerrar_newtitulo').addEventListener('click', function () { ver_input_save_newtitulo('titulo', 'hide') }, false);
            _('btncerrar_newformahilado').addEventListener('click', function () { ver_input_save_newtitulo('formahilado', 'hide') }, false);
            
        }

        function fn_change_sistema_new_hilado(e) {
            let idsistematitulacion = e.currentTarget.value;
            llenar_combotitulo_newhilado(idsistematitulacion);
        }

        function llenar_combotitulo_newhilado(idsistematitulacion) {
            let listatitulos = ovariables.lsttitulohilado.filter(x => x.idsistematitulacion == idsistematitulacion);
            let options = _comboDataListFromJSON(listatitulos, 'idtitulo', 'nombretitulo');

            _('_txtinput_cbo_titulo_newhilado').value = '';
            _('_cbo_titulo_newhilado').innerHTML = '';

            _('_cbo_titulo_newhilado').insertAdjacentHTML('beforeend', options);
            //_('_cbo_titulo_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(listatitulos, 'idtitulo', 'nombretitulo');
        }

        function fn_addmateriaprima_newhilado() {
            let html = '', tbody = _('tbody_newhilado'), totalfilas = tbody.rows.length, fila_correlativo = totalfilas + 1;
            // <select class ='_cls_cbo_color_newhilado form-control'></select>
            // <select class='_cls_cbo_materiaprima_newhilado form-control'></select>
            html = `<tr>
                <td class='text-center' style='vertical-align: middle;'>
                    <button type='button' class='btn btn-xs btn-danger _cls_delete_materiaprima_newhilado'>
                        <span class='fa fa-trash-o'></span>
                    </button>
                </td>
                <td>
                    <input type='text' class='_cls_cbo_materiaprima_newhilado form-control' list='_dl_materiaprima_newhilado_${fila_correlativo}' />
                    <datalist id='_dl_materiaprima_newhilado_${fila_correlativo}' class='_cls_cbo_materiaprima_newhilado'></datalist>
                </td>
                <td>
                    <input type='text' class ='_cls_porcentaje_newhilado form-control' onkeypress='return DigitimosDecimales(event, this)' />
                </td>
                <td>
                    <select class ='_cls_cbo_estado_newhilado form-control'></select>
                </td>
                <td>
                    <input type='text' class='_cls_cbo_color_newhilado form-control' list='_dl_color_newhilado_${fila_correlativo}' />
                    <datalist id='_dl_color_newhilado_${fila_correlativo}' class='_cls_cbo_color_newhilado'></datalist>
                </td>
            </tr>`;
            tbody.insertAdjacentHTML('beforeend', html);
            let ultimafila = tbody.rows.length;
            handler_tbl_materiaprima_newhilado_alagregaritem(ultimafila - 1);
            llenarcombos_al_agregaritem_newhilado(ultimafila - 1);
        }

        function llenarcombos_al_agregaritem_newhilado(indexfila) {
            let fila = _('tbody_newhilado').rows[indexfila];
            let dl_materiaprima = fila.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[1], //cbomateriaprima = fila.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0], 
                options_materiaprima = _comboDataListFromJSON(ovariables.lstmateriaprima, 'idmateriaprima', 'nombremateriaprima');
            dl_materiaprima.innerHTML = options_materiaprima; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstmateriaprima, 'idmateriaprima', 'nombremateriaprima');

            let cboestado = fila.getElementsByClassName('_cls_cbo_estado_newhilado')[0];
            cboestado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstestado, 'idestado', 'nombreestado');

            let dl_color = fila.getElementsByClassName('_cls_cbo_color_newhilado')[1] //cbocolor = fila.getElementsByClassName('_cls_cbo_color_newhilado')[0], 
                , options_color = _comboDataListFromJSON(ovariables.lstcolor, 'idcolor', 'nombrecolor');
            dl_color.innerHTML = options_color; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstcolor, 'idcolor', 'nombrecolor');
        }

        function save_new_hilado() {
            let req = _required({ id: 'panelEncabezado_newhilado', clase: '_enty' }), 
                //indextituloseleccionado = _('_cbo_titulo_newhilado').selectedIndex, 
                titulo = _('_txtinput_cbo_titulo_newhilado').value; //_('_cbo_titulo_newhilado').options[indextituloseleccionado].text;
            if (req) {
                let validacion = validarantesgrabar_newhilado();
                if (validacion === false) {
                    return false;
                }

                let datahilado = _getParameter({ id: 'panelEncabezado_newhilado', clase: '_enty' });
                datahilado['CodigoHilado'] = '';
                datahilado['flgorigen'] = 'ATX';

                let dltitulo = _('_cbo_titulo_newhilado'), valor_dltitulo = _getValueDataList(_('_txtinput_cbo_titulo_newhilado').value, dltitulo),
                    dlformahilado = _('_cbo_formahilado_newhilado'), valor_dlformahilado = _getValueDataList(_('_txtinput_cbo_formahilado_newhilado').value, dlformahilado);
                datahilado['IdTituloHiladoTela'] = valor_dltitulo;
                datahilado['IdFormaHilado'] = valor_dlformahilado

                let contenido = generarcontenidohilado();
                datahilado['NombreHilado'] = titulo + '  ' + contenido.contenido_sin_coma;
                datahilado['Composicion'] = titulo + '  ' + contenido.contenido_sin_coma;
                datahilado['contenido'] = contenido.contenido_con_coma;
                let arrmateriaprima = getarr_materiaprima_newhilado();

                let idsistema = _('_cbo_sistema_newhilado').value == '' ? 0 : _('_cbo_sistema_newhilado').value,
                    idtitulo = _('_txtinput_cbo_titulo_newhilado').value == '' ? 0 : valor_dltitulo; //_('_cbo_titulo_newhilado').value,
                    idformahilado = _('_txtinput_cbo_formahilado_newhilado').value == '' ? 0 : valor_dlformahilado; //_('_cbo_formahilado_newhilado').value;

                let par_validacion = JSON.stringify({ sistema_titulo_formahilado: idsistema + '¬' + idtitulo + '¬' + idformahilado, contenido: contenido.contenido_sin_coma.replace(/%/g, 'xd'), tipohilo_color: contenido.estado_color });

                _Get('DesarrolloTextil/Atx/validarsiexistehilado?par=' + par_validacion)
                    .then((adata) => {
                        return adata;
                    }, (p) => {
                        err(p);
                    })
                    .then((rpta) => {
                        let orpta_validacion = rpta != '' ? rpta : null, existe = null;

                        if (orpta_validacion == 0) {
                            existe = false;
                        } else {
                            existe = true;
                            _swal({ mensaje: 'The fabric already exists', estado: 'Error' });
                            //return false;
                        }
                        return existe;
                    })
                    .then((existe) => {
                        if (existe === false) {
                            let frmData = new FormData();
                            frmData.append('par', JSON.stringify(datahilado));
                            frmData.append('pardetail', JSON.stringify(arrmateriaprima));
                            Post('DesarrolloTextil/Atx/save_new_hilado', frmData, function (rpta) {
                                let orpta = rpta !== '' ? JSON.parse(rpta) : null, odata = orpta !== null ? CSVtoJSON(orpta.data) : null;
                                if (odata !== null) {
                                    // ACTUALIZAR DATASET HILADO 
                                    appAtxView.ovariables.lstcbohilado = odata;
                                    setear_hilado_despues_de_grabar(orpta.id);
                                    //_mensaje(orpta);
                                    _swal({ estado: orpta.estado, mensaje: orpta.mensaje });
                                    $('#modal__NewHilado').modal('hide');
                                }
                            });
                        }
                    });
                
            }
        }

        function setear_hilado_despues_de_grabar(idhilado_nuevo) {
            let cbosistema = _('_cbo_sistema_newhilado'), cbotitulo = _('_cbo_titulo_newhilado'), txttitulo = _('_txtinput_cbo_titulo_newhilado'), cboformahilado = _('_cbo_formahilado_newhilado'),
                txtformahilado = _('_txtinput_cbo_formahilado_newhilado')
                idsistema = cbosistema.value
                , idtitulo = _getValueDataList(txttitulo.value, cbotitulo) //cbotitulo.value
                , idformahilado = _getValueDataList(txtformahilado.value, cboformahilado) //cboformahilado.value,
                fila = _('tbody_yarndetail').getElementsByClassName('rowselected')[0];

            //cboformahilado_tblhilado = fila.getElementsByClassName('cls_shapedyarn')[0];
            //cboformahilado_tblhilado.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');

            let cbosistema_tblhilado = fila.getElementsByClassName('cls_system')[0];
            cbosistema_tblhilado.value = idsistema;
            appAtxView.fn_change_system(cbosistema_tblhilado);

            let cbotiltulo_tblhilado = fila.getElementsByClassName('cls_title')[0], dl_titulo_tblhilado = fila.getElementsByClassName('cls_title')[1];
            //cbotiltulo_tblhilado.value = idtitulo;
            _setValueDataList(idtitulo, dl_titulo_tblhilado, cbotiltulo_tblhilado);
            appAtxView.fn_change_title(cbotiltulo_tblhilado);

            let cbohilado_tblhilado = fila.getElementsByClassName('cls_yarn')[0];
            cbohilado_tblhilado.value = idhilado_nuevo;
            appAtxView.fn_change_hilado(cbohilado_tblhilado);

            //cboformahilado_tblhilado = fila.getElementsByClassName('cls_shapedyarn')[0];
            //cboformahilado_tblhilado.value = idformahilado;
            //appAtxView.fn_change_formahilado(cboformahilado_tblhilado);
        }

        function getarr_materiaprima_newhilado() {
            let tblbody = _('tbody_newhilado'), arrfilas = [...tblbody.rows], arrpodata = [];
            arrfilas.forEach(x => {
                let porcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0].value, 
                    //indextituloseleccionado = _('_cbo_titulo_newhilado').selectedIndex, 
                    //titulo = _('_cbo_titulo_newhilado').options[indextituloseleccionado].text,
                    cbomateriaprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0], 
                    dl_materiaprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[1],
                    idmateriaprima = _getValueDataList(cbomateriaprima.value, dl_materiaprima),
                    cbotipohilado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0], 
                    cbocolor = x.getElementsByClassName('_cls_cbo_color_newhilado')[0], idcolor = _getValueDataList(cbocolor.value, x.getElementsByClassName('_cls_cbo_color_newhilado')[1]);
                let obj = {
                    idmateriaprima: idmateriaprima, //cbomateriaprima.value,
                    porcentajecomposicion: porcentaje,
                    idtipohilo: cbotipohilado.value,
                    idcolortextilhilado: idcolor //cbocolor.value
                }
                arrpodata.push(obj);
            });

            return arrpodata;
        }

        function generarcontenidohilado() {
            let tblbody = _('tbody_newhilado'), arrfilas = [...tblbody.rows], arrpodata = [], objretorno = {};
            arrfilas.forEach(x => {
                let porcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0].value,
                    cbomateriaprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0],
                    //indexmateriaprimaseleccionado = cbomateriaprima.selectedIndex,
                    materiaprima = cbomateriaprima.value, //cbomateriaprima.options[indexmateriaprimaseleccionado].text,
                    cboestado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0],
                    cbocolor = x.getElementsByClassName('_cls_cbo_color_newhilado')[0];

                let idestado = cboestado.value == '' ? 0 : cboestado.value, idcolor = cbocolor.value == '' ? 0 : cbocolor.value,
                    nombrecolor = cbocolor.value; //cbocolor.selectedIndex > 0 ? cbocolor.options[cbocolor.selectedIndex].text.trim() : '';

                let obj = {
                    porcentaje: porcentaje,
                    materiaprima: materiaprima,
                    idestado: idestado,
                    idcolor: idcolor,
                    nombrecolor: nombrecolor
                }
                arrpodata.push(obj);
            });

            let arrordenado = arrpodata.sort((x, y) => { return y.porcentaje - x.porcentaje });
            let retorno = arrordenado.map(x=>`${x.porcentaje.toString()}%${x.materiaprima}  `).join('');
            let retorno2 = arrordenado.map(x=>`${x.porcentaje.toString()}%${x.materiaprima} ${x.nombrecolor},`).join('');
            let estado_color = arrordenado.map(x => `${x.idestado}${x.idcolor}¬`).join('');
            objretorno.contenido_sin_coma = retorno;
            objretorno.contenido_con_coma = retorno2.substr(0, retorno2.length - 1);
            objretorno.estado_color = estado_color.substr(0, estado_color.length - 1);

            return objretorno;
        }

        function validarantesgrabar_newhilado() {
            let tblbody = _('tbody_newhilado'), mensaje = '', pasalavalidacion = true, tienemateriaprima = true, totalfilasmateriaprima = tblbody.rows.length, totalporcentaje = 0;

            if (totalfilasmateriaprima <= 0) {
                pasalavalidacion = false;
                tienemateriaprima = false;
                mensaje += '- Missing add raw material \n';
            }

            if (tienemateriaprima) {
                let arrfilas = [...tblbody.rows];
                arrfilas.forEach(x => {
                    let cbomateriapprima = x.getElementsByClassName('_cls_cbo_materiaprima_newhilado')[0];
                    if (cbomateriapprima.value == '') {
                        mensaje += '- Missing the raw material \n';
                        pasalavalidacion = false;
                    }

                    let cboestado = x.getElementsByClassName('_cls_cbo_estado_newhilado')[0];
                    if (cboestado.value == '') {
                        mensaje += '- Need to select the type of yarn \n';
                        pasalavalidacion = false;
                    }

                    let txtporcentaje = x.getElementsByClassName('_cls_porcentaje_newhilado')[0];
                    totalporcentaje += parseFloat(txtporcentaje.value)
                });

                totalporcentaje = parseFloat(totalporcentaje).toFixed(2)

                if (totalporcentaje != 100) {
                    mensaje += '- The raw material must be 100%. \n';
                    pasalavalidacion = false;
                }
            }

            if (pasalavalidacion == false) {
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return pasalavalidacion;
        }

        function handler_tbl_materiaprima_newhilado_alagregaritem(indexfila) {
            let tblbody = _('tbody_newhilado'), fila = tblbody.rows[indexfila];
            let btndelete = fila.getElementsByClassName('_cls_delete_materiaprima_newhilado')[0];
            btndelete.addEventListener('click', _fn_deletemateriaprima_newhilado);
        }

        function _fn_deletemateriaprima_newhilado(e) {
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

        function res_ini(rpta) {
            let orpta = rpta != '' ? JSON.parse(rpta) : null, html = '';

            if (orpta != null) {
                ovariables.lstsistematitulacion = CSVtoJSON(orpta[0].sistematitulacion);
                ovariables.lsttitulohilado = CSVtoJSON(orpta[0].titulohilado);
                ovariables.lstformahilado = CSVtoJSON(orpta[0].formahilado);
                ovariables.lstmateriaprima = CSVtoJSON(orpta[0].materiaprima);
                ovariables.lstestado = CSVtoJSON(orpta[0].estado);
                ovariables.lstcolor = CSVtoJSON(orpta[0].colorMateriaPrima);

                _('_cbo_sistema_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstsistematitulacion, 'idsistematitulacion', 'nombresistematitulacion');

                let options = _comboDataListFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');
                _('_cbo_formahilado_newhilado').insertAdjacentHTML('beforeend', options);
                //_('_cbo_formahilado_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');

                if (ovariables.sistema !== '')
                {
                    _('_cbo_sistema_newhilado').value = ovariables.sistema;
                    llenar_combotitulo_newhilado(ovariables.sistema);

                    if (ovariables.titulo != '') {                       
                        //_('_cbo_titulo_newhilado').value = ovariables.titulo;
                        _setValueDataList(ovariables.titulo, _('_cbo_titulo_newhilado'), _('_txtinput_cbo_titulo_newhilado'));
                    }

                    if (ovariables.shapedyarn != '') {                     
                        //_('_cbo_formahilado_newhilado').value = ovariables.shapedyarn;
                        _setValueDataList(ovariables.shapedyarn, _('_cbo_formahilado_newhilado'), _('_txtinput_cbo_formahilado_newhilado'));
                    }
                }
            }
        }
    
        function err(__err) {
            console.log('err', __err);
        }

        var save_new_titulo = async(e) => {
            let formdata = new FormData(), titulo = _('txtnombretitulo').value, idsistema = _('_cbo_sistema_newhilado').value, 
                par = { nombretitulohiladotela: titulo, idsistematitulacion: idsistema };

            let req = _required({ clase: '_enty_titulo', id: 'panelEncabezado_newhilado' });
            if (req) {
                let validacion = await _promise(50)
                    .then(()=>{
                        return validar_siexiste_titulo();
                    });

                if (validacion === false){  // NO EXISTE TITULO
                    formdata.append('par', JSON.stringify(par));

                    _Post('DesarrolloTextil/Atx/Save_New_Titulo_Hilado', formdata)
                        .then((respuesta) => {
                            let rpta = respuesta !=='' ? JSON.parse(respuesta) : null;
                            if (rpta !== null){
                                _swal({ estado: rpta.estado, mensaje: rpta.mensaje });
                                if (rpta.id > 0) {
                                    let lsttitulos = rpta.data !== '' ? CSVtoJSON(rpta.data) : null, id = rpta.id;
                                    if (lsttitulos !== null) {
                                        ovariables.lsttitulohilado = lsttitulos;
                                        appAtxView.ovariables.lstcbotitulo = lsttitulos;
                                        llenar_combotitulo_newhilado(idsistema);
                                        //_('_cbo_titulo_newhilado').value = id;
                                        _setValueDataList(id, _('_cbo_titulo_newhilado'), _('_txtinput_cbo_titulo_newhilado'));
                                    }
                                }
                                _('div_grupo_titulo_newhilado').classList.add('hide');
                                _('txtnombretitulo').value = '';
                            }
                        })
                        .catch((error) => { err(error); });
                }
            }
        }

        function ver_input_save_newtitulo(que_es, ocultar_ver) {
            if (que_es === 'titulo'){
                if (ocultar_ver === 'view') {
                    _('div_grupo_titulo_newhilado').classList.remove('hide');
                } else if (ocultar_ver === 'hide') {
                    _('div_grupo_titulo_newhilado').classList.add('hide');
                    _('txtnombretitulo').value = '';
                }
            } else if (que_es === 'formahilado'){
                if (ocultar_ver === 'view') {
                    _('div_grupo_formahilado_newhilado').classList.remove('hide');
                } else if (ocultar_ver === 'hide') {
                    _('div_grupo_formahilado_newhilado').classList.add('hide');
                    _('txtnombreformahilado').value = '';
                }
            }
        }

        var validar_siexiste_titulo = async(e) => {
            let nombretitulo = _('txtnombretitulo').value, idsistema = _('_cbo_sistema_newhilado').value,
                par = { nombretitulo: nombretitulo, idsistema: idsistema }, url = 'DesarrolloTextil/Atx/GetData_Buscar_TituloHilado?par=' + JSON.stringify(par), existe = false,
                mensaje = '';

            let respuesta = await _Get(url);

            let rpta = respuesta !== '' ? JSON.parse(respuesta) : null

            if (rpta === null) {
                existe = false;
            } else {
                existe = true;
                mensaje = 'Ya existe el título...!!';
            }

            if (mensaje !== '') {
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return existe;
        }

        var validarsiexiste_formahilado = async(e) => {
            let nombreformahilado = _('txtnombreformahilado').value, par = { nombreformahilado: nombreformahilado }, url = 'DesarrolloTextil/Atx/GetData_Buscar_FormaHilado?par=' + JSON.stringify(par),
                existe = false, mensaje = '';
            let respuesta = await _Get(url);

            let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;

            if (rpta === null){
                existe = false;
            } else{
                existe = true;
                mensaje = 'Ya existe Forma Hilado...!!';
            }

            if (mensaje !== ''){
                _swal({ mensaje: mensaje, estado: 'error' });
            }

            return existe;
        }

        var save_new_formahilado = async(e) => {
            let nombreformahilado = _('txtnombreformahilado').value, url = 'DesarrolloTextil/Atx/Save_New_FormaHilado', frmdata = new FormData(), 
                par = { nombreformahilado: nombreformahilado };

            let req = _required({ clase:'_enty_formahilado', id: 'div_grupo_formahilado_newhilado' });
            if (req){
                let validacion = await _promise(50)
                .then(()=>{
                    return validarsiexiste_formahilado();
                });

                if (validacion === false){
                    frmdata.append("par", JSON.stringify(par));            

                    _Post(url, frmdata)
                        .then((respuesta) => {
                            let rpta = respuesta !== '' ? JSON.parse(respuesta) : null;
                            if (rpta !== null){
                                _swal({ mensaje: rpta.mensaje, estado: rpta.estado });
                                if (rpta.id > 0){
                                    let lstformahilado = rpta.data !== '' ? CSVtoJSON(rpta.data) : null;
                                    if (lstformahilado !== null){
                                        ovariables.lstformahilado = lstformahilado;
                                        appAtxView.ovariables.lstcboformahilado = lstformahilado;  //// ESTO ES PARA ACTUALIZAR LA LISTA EN EL ATX
                                        //_('_cbo_formahilado_newhilado').innerHTML = '';
                                        //_('_cbo_formahilado_newhilado').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');
                                        //_('_cbo_formahilado_newhilado').value = rpta.id;
                                        //// FORMA DE HILADO CON DATALIS
                                        let dl_formahilado = _('_cbo_formahilado_newhilado'), txtformahilado = _('_txtinput_cbo_formahilado_newhilado'), options_formahilado = _comboDataListFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');
                                        _('_txtinput_cbo_formahilado_newhilado').value = '';
                                        dl_formahilado.innerHTML = '';
                                        dl_formahilado.insertAdjacentHTML('beforeend', options_formahilado);
                                        _setValueDataList(rpta.id, dl_formahilado, txtformahilado);
                                        
                                        let fila_tbl_hilado = _('tbody_yarndetail').getElementsByClassName('rowselected')[0], 
                                            cboformahilado_tblhilado = fila_tbl_hilado.getElementsByClassName('cls_shapedyarn')[0], dl_formahilado_tblhilado = fila_tbl_hilado.getElementsByClassName('cls_shapedyarn')[1];

                                        dl_formahilado_tblhilado.innerHTML = options_formahilado; //_comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstformahilado, 'idformahilado', 'nombreformahilado');
                                        //cboformahilado_tblhilado.value = rpta.id;
                                        _setValueDataList(rpta.id, dl_formahilado_tblhilado, cboformahilado_tblhilado);
                                    }
                            
                                    _('div_grupo_formahilado_newhilado').classList.add('hide');
                                    _('txtnombreformahilado').value = '';   
                                }
                            }
                        });
                }
            }

            
        }

        function req_ini() {
            _Get('DesarrolloTextil/Atx/getData_newhilado')
                .then((adata) => {
                    res_ini(adata);
                }, (p) => {
                    err(p);
                });
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'panelEncabezado_newhilado');

(
    function init() {
        appNewHiladoFromAtx.load();
        appNewHiladoFromAtx.req_ini();
    }
)();
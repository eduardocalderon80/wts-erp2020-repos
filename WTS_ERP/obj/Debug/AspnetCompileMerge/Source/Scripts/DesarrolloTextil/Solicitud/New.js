var appNewSolicitudAtx = (
    function (d, idpadre) {
        var ovariables = {
            idgrupocomercial: '',
            ATXEncriptado: '',
            idsolicitud: '',
            estado: '',
            nombreweb: '',
            atxañoantiguodesde: 11,
            atxañoantiguohasta: 16,
            atxcontadorantiguo: 1280,
            permitir_grabar_origen_colgador: '',
            mensaje_validacion_origen_colgador: '',
            perfil: [],
            lstproveedor: [],
            lstinstruccioncuidado_grabar: []
        }

        function load() {
            let par = _('txtpar_new').value;
            if (!_isEmpty(par)) {
                ovariables.accion = _par(par, 'accion');
                ovariables.idgrupocomercial = _par(par, 'idgrupocomercial');
                ovariables.idsolicitud = $.trim(_par(par, 'idsolicitud'));
                ovariables.idanalisistextilsolicitud = $.trim(_par(par, 'idanalisistextilsolicitud'));
                _('hf_idanalisistextilsolicitud').value = _par(par, 'idanalisistextilsolicitud');
                _('hf_idsolicitud').value = _par(par, 'idsolicitud');
            }
            _('btnReturn').addEventListener('click', returnIndex);
            _('btnAddMateriaPrima').addEventListener('click', AddMateriaPrima);
            _('btnSave').addEventListener('click', save_new); //SaveSolicitud
            _('btnUpdate').addEventListener('click', save_edit); // UpdateSolicitud
            $('#filearchivo').on('change', changeFile);
            _('btneliminararchivo').addEventListener('click', EliminarArchivo);
            _('btnBuscarAtx').addEventListener('click', buscaratx);
            _('btn_buscar_by_codigotela').addEventListener('click', fn_buscar_by_codigotela, false);
            _('txtcodigotela').addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    fn_buscar_by_codigotela();s
                }
            }, false);
            _('btnBuscarSolicitudDesarrollo_AtxEstandar').addEventListener('click', fn_buscaratxestandar, false);

            MostrarBtn(ovariables.accion)
           
            // MOSTRAR TITULO
            _('_title').innerText = 'SOLICITUD #' + ovariables.idsolicitud

            fn_colapsardivs('panelEncabezado_atxsolicitud');
            _('cboOrigen').addEventListener('change', function (e) { let o = e.currentTarget; fn_change_origenmuestra(o); });
            _('cboMotivoSolicitud').addEventListener('change', function (e) { let o = e.currentTarget; fn_change_motivosolicitud(o); }, false);
            _('btn_instruccioncuidado').addEventListener('click', fn_seleccionar_instruccioncuidado, false);

            // RADIO BUTTON
            $("#div_testlaboratorio ._cls_chk_requiereanalisislaboratorio").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                const chk = e.currentTarget;
                fn_set_checked_requiereanalisislaboratorio(chk.checked, 'div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
                fn_enabled_disabled_testlaboratorio(chk.checked);
            });
        }
 
        function fn_buscaratxestandar(e) {
            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_BuscarAtxEstandar',
                ventana: '_BuscarAtxEstandar',
                titulo: 'Buscar Atx',
                parametro: '',
                ancho: '',
                alto: '',
                responsive: 'modal-lg'
            });
        }

        function fn_seleccionar_instruccioncuidado() {
            
            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_SeleccionarInstruccionCuidado',
                ventana: '_SeleccionarInstruccionCuidado',
                titulo: 'Instrucción de Cuidado',
                parametro: `accion:${ovariables.accion}`,
                ancho: '1000',
                alto: '',
                responsive: ''
            });
        }

        function EliminarArchivo() {
            $('#filearchivo').val('');
            $('#txtArchivoSeleccionado').val('');
            $('#hf_actualizarArchivo').val(1);
        }
        function returnIndex() {
            let url = 'DesarrolloTextil/Solicitud/Index'
            //_ruteo_masgeneral(url)
            ruteo_bandejamodelo_correo(url, ovariables.idsolicitud, 'divcontenedor_breadcrum');
        }
        function MostrarBtn(accion) {
            switch (accion) {
                case 'new':
                    _('btnUpdate').classList.add('hide');
                    break;
                case 'edit':
                    _('btnSave').classList.add('hide');
                    _('btnUpdate').classList.remove('hide');
                    break;
            }
        }
        function SaveSolicitud() {
            ValidarATX(0)
        }

        function UpdateSolicitud() {
            ValidarATX(1)
        }

        function Validar() {
            // Validar Origen      
            let req = _required({ id: 'divDatosGenerales', clase: '_enty' }), bValida = true, mensaje = '';

            if (req) {

                $("#divcboProveedor").removeClass("has-error has-feedback");
                $("#divtxtCodigoTelaProveedor").removeClass("has-error has-feedback");
                $("#divtxtPartidaTela").removeClass("has-error has-feedback");
                $("#divtxtColorTela").removeClass("has-error has-feedback");
                $("#divtxtEstructura").removeClass("has-error has-feedback");
                $("#divtxtTitulo").removeClass("has-error has-feedback");
                $("#divtxtDensidad").removeClass("has-error has-feedback");
                $("#divcboCliente").removeClass("has-error has-feedback");
                $("#divrbLavado").removeClass("has-error has-feedback");
                $("#divtxtWeight").removeClass("has-error has-feedback");
                $("#divATX").removeClass("has-error has-feedback");

                let cboOrigen = $('#cboOrigen').val(), tbl = _('tbody_MateriaPrima'), totalFilas = tbl.rows.length;

                if (cboOrigen == 1) {
                    // Cliente
                    let cboCliente = $('#cboCliente').val();
                    if (cboCliente == 0) {
                        $("#divcboCliente").addClass("has-error has-feedback");
                        bValida = false;
                    }

                    // validar si tienes materia prima             
                    if (totalFilas > 0) {
                        let SumaMateriaPrima = ObtenerSumaPorcentaje();
                        if (SumaMateriaPrima != 100) {
                            mensaje += 'El porcentaje de composición(Materia Prima) debe sumar 100% </br>';
                            bValida = false;
                        }
                    }
                }
                else if (cboOrigen == 2) {
                    // Fabrica 

                    if (totalFilas == 0) {
                        mensaje += 'Debes agregar Contenidos(Materia Prima) </br>';
                        bValida = false;
                    }

                    //Valida Sumatoria          
                    if (totalFilas > 0) {
                        let SumaMateriaPrima = ObtenerSumaPorcentaje();
                        if (SumaMateriaPrima != 100) {
                            mensaje += 'El porcentaje de composición(Materia Prima) debe sumar 100% </br>';
                            bValida = false;
                        }
                    }

                    let cboProveedor = $('#cboProveedor').val(), txtCodigoTelaProveedor = $('#txtCodigoTelaProveedor').val(), txtPartidaTela = $('#txtPartidaTela').val(), txtColorTela = $('#txtColorTela').val(), txtEstructura = $('#txtEstructura').val()
                        , txtTitulo = $('#txtTitulo').val(), txtDensidad = $('#txtDensidad').val(), cboCliente = $('#cboCliente').val(), rbLavado = $("input[name=rbLavado]:checked").val(), txtWeight = $('#txtWeight').val()

                    if (cboProveedor == 0) {
                        $("#divcboProveedor").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtCodigoTelaProveedor == "") {
                        $("#divtxtCodigoTelaProveedor").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtPartidaTela == "") {
                        $("#divtxtPartidaTela").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtColorTela == "") {
                        $("#divtxtColorTela").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtEstructura == "") {
                        $("#divtxtEstructura").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtTitulo == "") {
                        $("#divtxtTitulo").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtDensidad == "") {
                        $("#divtxtDensidad").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (cboCliente == 0) {
                        $("#divcboCliente").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (rbLavado == undefined) {
                        $("#divrbLavado").addClass("has-error has-feedback");
                        bValida = false;
                    }
                    if (txtWeight == "") {
                        $("#divtxtWeight").addClass("has-error has-feedback");
                        bValida = false;
                    }

                }
                else if (cboOrigen == 3) {
                    // WTS -- Solo en caso que quieran un ATX antiguo - que no esté registrado 
                    let anio = $('#txtanio').val(), Correlativo = $('#txtCorrelativo').val()

                    if (anio == "" || Correlativo == "") {
                        $("#divATX").addClass("has-error has-feedback");
                        bValida = false;
                    }

                    // validar si tienes materia prima            
                    if (totalFilas > 0) {
                        let SumaMateriaPrima = ObtenerSumaPorcentaje();
                        if (SumaMateriaPrima != 100) {
                            mensaje += 'El porcentaje de composición(Materia Prima) debe sumar 100% </br>';
                            bValida = false;
                        }
                    }
                }

                if (mensaje.length > 0) {

                    swal({
                        type: 'error',
                        title: 'Oops...',
                        html: true,
                        text: mensaje
                    });

                }
            }
            return bValida;
        }
        function ValidarATX(Accion) {
            let par = { anio: $('#txtanio').val(), Correlativo: $('#txtCorrelativo').val() }, urlaccion = 'DesarrolloTextil/Solicitud/validarATX?par=' + JSON.stringify(par);
            //Get(urlaccion, res_atx);

            let err = function (__err) { console.log('err', _err) }
            _promise()
                .then(() => {
                    return _Get(urlaccion);
                })
                .then(data => {
                    let rpta = data !== '' ? CSVtoJSON(data) : null;
                    if (rpta !== null) {
                        let oData = rpta; //CSVtoJSON(rpta[0].atx, '¬', '^');
                        let par = { idanalisistextilsolicitud: oData[0].IdAnalisisTextil }, urlaccion = 'DesarrolloTextil/Solicitud/Codifica?par=' + JSON.stringify(par);
                        let err = function (__err) { console.log('err', _err) }
                        return _Get(urlaccion);
                    } else {
                        return '';
                    }
                })
                .then(adatav => {
                    if (adatav !== '') {
                        ovariables.ATXEncriptado = adatav;
                        return adatav;
                    } else {
                        return '';
                    }
                })
                .then(variable => {
                    if (variable !== '') {
                        let urlATX = "http://erp.wtsusa.us/DesarrolloTextil/AnalisisTextil/AnalisisTextilVer/" + ovariables.ATXEncriptado;
                        mensaje = "Ya existe un ATX, para visualizarlo, haz click <a target='_blank' href=" + urlATX + " >Aquí</a> "
                        swal({
                            type: 'error',
                            title: 'Oops...',
                            html: true,
                            text: mensaje
                        });
                        return false;
                    } else {
                        return true;
                    }
                })
                .then(bValida => {
                    if (bValida) {
                        if (Validar()) {
                            if (Accion == 0) {
                                // Guardar Solicitud
                                let cboProveedor = $('#cboProveedor').val(), txtCodigoTelaProveedor = $('#txtCodigoTelaProveedor').val(), txtPartidaTela = $('#txtPartidaTela').val(), txtColorTela = $('#txtColorTela').val(), txtEstructura = $('#txtEstructura').val()
                             , txtTitulo = $('#txtTitulo').val(), txtDensidad = $('#txtDensidad').val(), cboCliente = $('#cboCliente').val(), rbLavado = $("input[name=rbLavado]:checked").val(), txtWeight = $('#txtWeight').val(), txtComentario = $('#txtComentario').val()
                             , anio = $('#txtanio').val(), Correlativo = $('#txtCorrelativo').val(), cboOrigen = $('#cboOrigen').val(), rbEvaluacion = $("input[name=rbEvaluacion]:checked").val()
                                par = {
                                    idcliente: cboCliente, estructura: txtEstructura, idproveedorfabrica: cboProveedor, titulo: txtTitulo, densidad: txtDensidad, LavadoPanos: rbLavado, color: txtColorTela, partida: txtPartidaTela, comentario: txtComentario,
                                    TipoMuestra: cboOrigen, CodigoTela: txtCodigoTelaProveedor, anio: anio, Correlativo: Correlativo, Evaluacion: rbEvaluacion
                                }
                                urlaccion = 'DesarrolloTextil/Solicitud/Guardar', form = new FormData();

                                form.append('par', JSON.stringify(par));
                                form.append('pardetalle', JSON.stringify(ObtenerMateriaPrima()));
                                form.append("filearchivo", $("#filearchivo")[0].files[0]);

                                Post(urlaccion, form, function (rpta) {
                                    let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null,
                                        data = JSON.parse(orpta.data)[0].ATX != '' ? JSON.parse(JSON.parse(orpta.data)[0].ATX) : null,
                                        odataMP = JSON.parse(orpta.data)[0].ATXMateriaPrima

                                    if (data != null) {
                                        ovariables.accion = 'edit';
                                        ovariables.idsolicitud = data.IdSolicitud;
                                        ovariables.idanalisistextilsolicitud = data.IdAnalisisTextilSolicitud;
                                        ovariables.estado = data.Estado
                                        ejecutarDespuesGrabar(ovariables.accion, odataMP);
                                        _swal(orpta);
                                    } else {
                                        swal({
                                            type: 'error',
                                            title: 'Oops...',
                                            text: 'Error!!'
                                        });
                                    }
                                });
                            } else if (Accion == 1)
                                // Update Solicitud
                            {
                                let cboProveedor = $('#cboProveedor').val(), txtCodigoTelaProveedor = $('#txtCodigoTelaProveedor').val(), txtPartidaTela = $('#txtPartidaTela').val(), txtColorTela = $('#txtColorTela').val(), txtEstructura = $('#txtEstructura').val()
                                   , txtTitulo = $('#txtTitulo').val(), txtDensidad = $('#txtDensidad').val(), cboCliente = $('#cboCliente').val(), rbLavado = $("input[name=rbLavado]:checked").val(), txtWeight = $('#txtWeight').val(), txtComentario = $('#txtComentario').val()
                                   , anio = $('#txtanio').val(), Correlativo = $('#txtCorrelativo').val(), cboOrigen = $('#cboOrigen').val(), rbEvaluacion = $("input[name=rbEvaluacion]:checked").val(), nombrearchivo2 = $('#txtArchivoSeleccionado').val(), hf_actualizarArchivo = $('#hf_actualizarArchivo').val()
                                par = {
                                    idcliente: cboCliente, estructura: txtEstructura, idproveedorfabrica: cboProveedor, titulo: txtTitulo, densidad: txtDensidad, LavadoPanos: rbLavado, color: txtColorTela, partida: txtPartidaTela, comentario: txtComentario,
                                    TipoMuestra: cboOrigen, CodigoTela: txtCodigoTelaProveedor, IdSolicitud: ovariables.idsolicitud, IdAnalisisTextilSolicitud: ovariables.idanalisistextilsolicitud, anio: anio, Correlativo: Correlativo,
                                    Evaluacion: rbEvaluacion, hf_actualizarArchivo: hf_actualizarArchivo, estadoATXSolicitud: ovariables.estado
                                }
                                urlaccion = 'DesarrolloTextil/Solicitud/Update', form = new FormData();

                                form.append('par', JSON.stringify(par));
                                form.append('pardetalle', JSON.stringify(ObtenerMateriaPrima()));
                                form.append("filearchivo", $("#filearchivo")[0].files[0]);

                                Post(urlaccion, form, function (rpta) {
                                    let orpta = !_isEmpty(rpta) ? JSON.parse(rpta) : null,
                                       data = JSON.parse(orpta.data)[0].ATX != '' ? JSON.parse(JSON.parse(orpta.data)[0].ATX) : null,
                                       odataMP = JSON.parse(orpta.data)[0].ATXMateriaPrima

                                    if (data != null) {
                                        ovariables.idanalisistextilsolicitud = data.IdAnalisisTextilSolicitud;
                                        ovariables.estado = data.Estado
                                        ejecutarDespuesGrabar(ovariables.accion, odataMP);
                                        _swal(orpta);
                                    } else {
                                        swal({
                                            type: 'error',
                                            title: 'Oops...',
                                            text: 'Error!!'
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
        }

        function ejecutarDespuesGrabar(accion, odataMP) {
            let oMP = null;
            switch (accion) {
                case 'new':
                    oMP = CSVtoJSON(odataMP, '¬', '^');
                    LLenarMateriaPrima(oMP);
                    handlerAccionTblMateriaPrima();
                    break;
                case 'edit':
                    MostrarBtn(accion);
                    oMP = CSVtoJSON(odataMP, '¬', '^');
                    LLenarMateriaPrima(oMP);
                    handlerAccionTblMateriaPrima();
                    break;
                default:
            }
        }

        function res_ini(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {
                let cboproveedor = _('cboProveedor'), cboorigen = _('cboOrigen'), cbomotivosolicitud = _('cboMotivoSolicitud'),
                    cboprueba_laboratorio = _('cbo_prueba'), cboproceso_laboratorio = _('cbo_proceso');

                _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientes);
                //cboproveedor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].proveedor);
                cboorigen.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].ListaTipoMuestra);
                _('cboMateriaPrima').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].MateriaPrima)
                cbomotivosolicitud.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].motivosolicitud);

                ovariables.lstproveedor = rpta[0].proveedor !== '' ? CSVtoJSON(rpta[0].proveedor) : [];
                cboproveedor.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor');

                let option_tintoreria = _comboDataListFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor');
                _('dl_tintoreria').insertAdjacentHTML('beforeend', option_tintoreria);

                cboprueba_laboratorio.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].tipospruebas_laboratorio);
                cboproceso_laboratorio.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].procesos_laboratorio);

                ovariables.perfil = (rpta[0].perfil !== '' && rpta[0].perfil !== undefined) ? rpta[0].perfil.split('¬') : [];

                /* Jacob - Ficha de inspiracion - Se oculpa motivo de desarrollo */
                cbomotivosolicitud.options[3].style.display = 'none';

                ////  PARA CUANDO UN USUARIO DE FABRICA SE HA LOGEADO
                if (appSolicitudAtx.ovariables.idproveedor > 0) {
                    cboproveedor.value = appSolicitudAtx.ovariables.idproveedor;  //// SELECIONAMOS LA FABRICA
                    cboorigen.value = 2;  //// ORIGEN PROVEEDOR

                    fn_change_origenmuestra(cboorigen);  //// DENTRO DE ESTA FUNCION EJECUTA fn_change_motivosolicitud
                }
            }
        }

        function req_ini() {
            let accion = ovariables.accion, urlaccion = '', parametro = {};
            switch (accion) {
                case 'new':
                    parametro = { idgrupocomercial: ovariables.idgrupocomercial }
                   , urlaccion = 'DesarrolloTextil/Solicitud/GetDataInicial?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_ini);
                    break;
                case 'edit':
                    parametro = { idgrupocomercial: ovariables.idgrupocomercial, idsolicitud: ovariables.idsolicitud, idanalisistextilsolicitud: ovariables.idanalisistextilsolicitud };
                    urlaccion = 'DesarrolloTextil/Solicitud/GetData_foredit?par=' + JSON.stringify(parametro);
                    Get(urlaccion, res_ini_edit);
                    break;
                default:
            }
        }

        function res_ini_edit(data) {
            let rpta = data != null ? JSON.parse(data) : null, html = '';
            if (rpta != null) {

                let oATX = JSON.parse(rpta[0].ATX), cbomotivosolicitud = _('cboMotivoSolicitud'), cboorigen = _('cboOrigen'),
                    odatatestlaboratorio = rpta[0].testlaboratorio !== '' ? CSVtoJSON(rpta[0].testlaboratorio) : null;

                _('txtEstructura').value = oATX.estructura;
                _('txtTitulo').value = oATX.titulo;
                _('txtDensidad').value = oATX.densidad;
                _('txtCodigoTelaProveedor').value = oATX.codigotelaproveedor;
                _('txtPartidaTela').value = oATX.partida;
                _('txtColorTela').value = oATX.color;
                _('txtcodigoreporteanalisistextilexistente').value = oATX.codigoatx_delamuestrafisica; 
                _('txtComentario').value = oATX.comentario;
                _('cboCliente').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].clientes);

                ovariables.lstproveedor = rpta[0].proveedor !== '' ? CSVtoJSON(rpta[0].proveedor) : [];
                _('cboProveedor').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor'); //_comboFromCSV(rpta[0].proveedor);

                cboorigen.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].ListaTipoMuestra);
                _('cboMateriaPrima').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].MateriaPrima)
                _('cboCliente').value = oATX.idcliente;
                _('cboProveedor').value = oATX.idproveedorfabrica;
                cboorigen.value = oATX.origen;
                _('txtProveedorFabrica').value = oATX.proveedordefabrica;
                _('txtanio').value = oATX.anio;
                _('txtCorrelativo').value = oATX.contador;
                _('txtArchivoSeleccionado').value = oATX.nombrearchivooriginal;
                cbomotivosolicitud.innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].motivosolicitud);
                cbomotivosolicitud.value = oATX.idmotivosolicitud;

                /* Jacob - Ficha de inspiracion */
                if (cboorigen.value != "5") {
                    cbomotivosolicitud.options[3].style.display = 'none';
                }

                _('txtcodigoreporteatxestandar').value = oATX.codigoreporte;
                _('txtcodigosolicitudatxestandar').value = oATX.codigosolicitudanalisistextil;
                _('txtcodigotela').value = oATX.codigotela;
                _('txtanio_atx_estandar').value = oATX.anio_atx_estandar;
                _('txtcontador_atx_estandar').value = oATX.contador_atx_estandar;
                _('hf_idsolicituddesarrollotela').value = oATX.idsolicituddesarrollotela;
                _('hf_idsolicituddetalledesarrollotela').value = oATX.idsolicituddetalledesarrollotela;
                _('txtsolicituddesarrollotela').value = oATX.nombretelacliente_mas_id;
                _('hf_escomplemento').value = oATX.escomplemento;

                ovariables.nombreweb = oATX.nombrearchivogenerado;
                ovariables.estado = oATX.estado;
                ovariables.perfil = (rpta[0].perfil !== '' && rpta[0].perfil !== undefined) ? rpta[0].perfil.split('¬') : [];
                _('hf_estadosolicitud').value = oATX.estado;

                $("input[name=rbEvaluacion][value='" + oATX.evaluacionlaboratorio + "']").prop("checked", true);
                $("input[name=rbLavado][value='" + oATX.lavadopanos + "']").prop("checked", true);

                //// DATOS DEL TEST DE LABORATORIO
                if (odatatestlaboratorio !== null && odatatestlaboratorio.length > 0) {
                    let optproveedor = _comboDataListFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor');
                    _('dl_tintoreria').innerHTML = optproveedor;
                    _setValueDataList(odatatestlaboratorio[0].idproveedor_tintoreria, _('dl_tintoreria'), _('txt_tintoreria')); //odatatestlaboratorio[0].nombreproveedor;
                    _('txt_codigocolortintoreria').value = odatatestlaboratorio[0].cod_colortintoreria;
                    _('cbo_prueba').innerHTML = rpta[0].tipospruebas_laboratorio !== '' ? _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].tipospruebas_laboratorio) : _comboItem({ value: '', text: 'Select' });
                    _('cbo_prueba').value = odatatestlaboratorio[0].tipoprueba;
                    _('cbo_proceso').innerHTML = rpta[0].procesos_laboratorio !== '' ? _comboItem({ value: '', text: 'Select' }) + _comboFromCSV(rpta[0].procesos_laboratorio) : _comboItem({ value: '', text: 'Select' });
                    _('cbo_proceso').value = odatatestlaboratorio[0].proceso;
                    _('txta_comentario_instruccioncuidado').value = odatatestlaboratorio[0].instruccioncuidadosolicitud;
                    
                    ovariables.lstinstruccioncuidado_grabar = rpta[0].instruccionescuidado !== '' ? CSVtoJSON(rpta[0].instruccionescuidado) : [];
                }

                setear_valore_segun_origen_ini_edit(cboorigen);
                fn_set_checked_requiereanalisislaboratorio(oATX.desarrollotelarequiereanalisislaboratorio === '1' ? true : false, 'div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
                //fn_change_origenmuestra(cboorigen);

                // Llenar MP 
                if (rpta[0].ATXMateriaPrima != '') {
                    let oMP = CSVtoJSON(rpta[0].ATXMateriaPrima, '¬', '^');
                    LLenarMateriaPrima(oMP);
                    handlerAccionTblMateriaPrima();
                }
            }
        }

        function LLenarMateriaPrima(data) {
            let tbl = _('tbody_MateriaPrima'), html = '';
            tbl.innerHTML = '';
            // onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)"
            if (data != null && data.length > 0) {
                let totalfilas = data.length;
                for (let i = 0; i < totalfilas; i++) {
                    html += `<tr data-par='idMateriaPrima:${data[i].idMateriaPrima},IdDetalle:${data[i].IdDetalle},'>
                                <td class ='text-center'>
                                    <div class ='btn-group'>
                                        <button class ='btn btn-danger btn-sm _eliminarMateriaPrima' title='Delete'>
                                            <span class='fa fa-trash'></span>
                                        </button>
                                    </div>
                                </td>
                                <td class='cls_td_materiaprima'>${data[i].MateriaPrima}</td>
                                <td>
                                    <input type='text' value='${data[i].Porcentaje}' class ='form-control _clsCantidad text-right' data-type='int' data-min='1' data-max='3' data-required="true" onkeypress = 'return DigitimosDecimales(event, this)' />
                                </td>
                            </tr>`;
                }
                //$('#tbody_MateriaPrima').append(html);
                _('tbody_MateriaPrima').innerHTML = html;
            }
            handlerAccionTblMateriaPrima();
        }

        function AddMateriaPrima() {
            let txtMateriaPrima = $('#cboMateriaPrima option:selected').text(), idMateriaPrima = _('cboMateriaPrima').value;
            //onKeyPress="return validators_keypress(event)" onBlur="validators_blur(event)" onKeyUp="validator_keyup(event)"
            if (ValidarMateriaPrimaCombo()) {
                if (ValidarMateriaPrima(idMateriaPrima)) {
                    html = `<tr data-par='idMateriaPrima:${idMateriaPrima},IdDetalle:0'>
                                <td class ='text-center'>
                                    <div class ='btn-group'>
                                        <button class ='btn btn-danger btn-sm _eliminarMateriaPrima' title='Delete'>
                                            <span class='fa fa-trash'></span>
                                        </button>
                                    </div>
                                </td>
                                <td class='cls_td_materiaprima'>${txtMateriaPrima}</td>
                                <td>
                                    <input type='text' placeholder='0' class ='form-control _clsCantidad text-right' data-type='int' data-min='1' data-max='3' data-required="true" onkeypress='return DigitimosDecimales(event, this)' />
                                </td>
                            </tr>`;
                    $('#tbody_MateriaPrima').append(html);
                    handlerAccionTblMateriaPrima();
                }
            }
        }

        function ValidarMateriaPrima(id) {
            let mensaje = "", bValida = true, tbl = _('tbody_MateriaPrima'), totalFilas = tbl.rows.length;

            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), idMateriaPrima = _par(par, 'idMateriaPrima')
                if (idMateriaPrima == id) {
                    mensaje += "La materia prima ya existe, seleccione otra materia prima";
                }
            }

            if (mensaje.length > 0) {
                bValida = false;
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: mensaje
                });
            }
            return bValida;
        }

        function ValidarMateriaPrimaCombo() {
            let mensaje = "", bValida = true, idMateriaPrima = _('cboMateriaPrima').value;
            if (idMateriaPrima == 0) {
                mensaje += "Seleccione una Materia Prima";
            }
            if (mensaje.length > 0) {
                bValida = false;
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: mensaje
                });
            }
            return bValida;
        }

        function ObtenerSumaPorcentaje() {
            let sumaPorcentaje = 0;

            $("._clsCantidad").each(function () {
                sumaPorcentaje += parseFloat($(this).val())
            });

            return sumaPorcentaje.toFixed(2);
        }
        function changeFile(e) {
            let archivo = this.value;
            let ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            ext = ext.toLowerCase();
            let nombre = e.target.files[0].name, html = '';
            let file = e.target.files;
            _('txtArchivoSeleccionado').value = nombre;
            $('#hf_actualizarArchivo').val(1);
        }

        function ObtenerMateriaPrima() {
            let tbl = _('tbody_MateriaPrima'), totalFilas = tbl.rows.length, arr = [];
            for (i = 0; i < totalFilas; i++) {
                row = tbl.rows[i];
                let par = row.getAttribute('data-par'), IdDetalle = _par(par, 'IdDetalle'), idMateriaPrima = _par(par, 'idMateriaPrima'), valor = row.cells[2].children[0].value,
                 obj = {
                     IdDetalle: IdDetalle,
                     IdMateriaPrima: idMateriaPrima,
                     PorcentajeComposicion: valor,
                 }
                arr[i] = obj;
            }
            return arr;
        }

        function handlerAccionTblMateriaPrima() {
            let tbl = _('tblMateriaPrima'), arrayDelete = _Array(tbl.getElementsByClassName('_eliminarMateriaPrima'));
            arrayDelete.forEach(x => x.addEventListener('click', e => { controladoracciontabla(e, 'drop'); }));
        }
        function controladoracciontabla(event, accion) {
            let o = event.target, tag = o.tagName, fila = null, par = '';
            switch (tag) {
                case 'BUTTON':
                    fila = o.parentNode.parentNode.parentNode;
                    break;
                case 'SPAN':
                    fila = o.parentNode.parentNode.parentNode.parentNode;
                    break;
            }
            if (fila != null) {
                par = fila.getAttribute('data-par');
                evento(par, accion, fila);
            }
        }
        function evento(par, accion, fila) {
            switch (accion) {
                case 'drop':
                    EliminarMateriaPrima(fila, par)
                    break;
                case 'edit':
                    break;
            }
        }
        function EliminarMateriaPrima(fila, par) {
            fila.parentNode.removeChild(fila);
        }

        function save_edit() {
            let idorigensolicitud = _('cboOrigen').value, req = '', req_enty = '';

            req_enty = _required({ clase: '_enty', id:'panelEncabezado_atxsolicitud' });
            if (idorigensolicitud === "1") { // CLIENTE
                req = _required({ clase: '_enty_origencliente', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "2") {
                req = _required({ clase: '_enty_origenproveedor', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "3") {
                req = _required({ clase: '_enty_origencolgador', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "4") {
                req = _required({ clase: '_enty_origenatxantiguo', id: 'panelEncabezado_atxsolicitud'});
            } else if (idorigensolicitud === "5") { /* Jacob - Ficha de inspiracion */
                let bool = '', rowCount = '';
                bool = _required({ clase: '_enty_origenfichainspiracion', id: 'panelEncabezado_atxsolicitud' });
                rowCount = _('tblMateriaPrima').rows.length;
                if (rowCount > 1) {
                    if (bool === true && rowCount > 1) { req = true; }
                } else {
                    swal({ title: "Advertencia", text: "Debes añadir por lo menos un contenido de Fibra", type: "warning" });
                    req = false;
                }
            }

            if (req_enty && req) {
                let pasavalidacion = otras_validaciones_antesgrabar(idorigensolicitud);
                if (pasavalidacion === false) {
                    return false;
                }

                _('div_grupo_comparar_codigo_reporteatx_estandar').classList.remove('has-error');
                _('div_grupo_comparar_solicitudatx_estandar').classList.remove('has-error');

                let atx = _getParameter({ id: 'panelEncabezado_atxsolicitud', clase: '_enty_grabar' }), arr_materiaprima = ObtenerMateriaPrima(),
                    arrlavado = Array.from(_('panelEncabezado_atxsolicitud').getElementsByClassName('cls_lavado')), valorlavado = null, valorevaluacion = null,
                    arrevaluacion = Array.from(_('panelEncabezado_atxsolicitud').getElementsByClassName('cls_evaluacion')), urlaccion = '', form = new FormData();
                
                arrlavado.some(x => {
                    if (x.checked){
                        valorlavado = x.value;
                        return true;
                    }
                });

                arrevaluacion.some(x => {
                    if (x.checked){
                        valorevaluacion = x.value;
                        return true;
                    }
                });
                atx['LavadoPanos'] = valorlavado;
                atx['Evaluacion'] = valorevaluacion;
                let idtintorerita = _getValueDataList(_('txt_tintoreria').value, _('dl_tintoreria'));
                atx["idproveedortintoreria"] = _getValueDataList(_('txt_tintoreria').value, _('dl_tintoreria'));
                atx["lst_instruccionescuidad"] = ovariables.lstinstruccioncuidado_grabar;
                let descripcion_nombre_tela = fn_generar_descripcion_nombre_tela_para_laboratorio();
                atx["descripcion_nombre_tela"] = descripcion_nombre_tela;
                let requiereanalisislaboratorio = fn_get_chk_requiereanalisislaboratorio('div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
                atx["desarrollotelarequiereanalisislaboratorio"] = requiereanalisislaboratorio;
                //// PARA EL CODIGO DE REPORTE ATX ESTANDAR
                let txtanioatx = _('txtanio_atx_estandar');
                let txtnumeroatx = _('txtcontador_atx_estandar');
                if (txtanioatx.value.trim() !== '' && txtnumeroatx.value.trim() !== '') {
                    atx["codigoreporte"] = fn_crear_formato_codigoatx(txtanioatx.value.trim(), txtnumeroatx.value.trim());
                }
                
                urlaccion = 'DesarrolloTextil/Solicitud/Save_Edit';

                form.append('par', JSON.stringify(atx));
                form.append('pardetalle', JSON.stringify(arr_materiaprima));
                form.append("filearchivo", $("#filearchivo")[0].files[0]);

                let err = (__err) => { console.log('err', __err) }

                _Post(urlaccion, form)
                    .then((rpta) => {
                        let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                        if (orpta !== null) {
                            let odata = orpta.data !== '' ? JSON.parse(orpta.data) : null, dataatx = null, odataMP = null;
                            if (odata !== null) {
                                dataatx = odata[0].ATX !== '' ? JSON.parse(odata[0].ATX) : null;
                                if (dataatx !== null) {
                                    odataMP = odata[0].ATXMateriaPrima;
                                    ovariables.idanalisistextilsolicitud = dataatx.IdAnalisisTextilSolicitud;
                                    ovariables.estado = dataatx.Estado;
                                    //ejecutarDespuesGrabar(ovariables.accion, odataMP);

                                    let parametro = `idgrupocomercial:${ovariables.idgrupocomercial},idsolicitud:${ovariables.idsolicitud},idanalisistextilsolicitud:${ovariables.idanalisistextilsolicitud},accion:${ovariables.accion}`,
                                        url = 'DesarrolloTextil/Solicitud/New';
                                    _Go_Url(url, url, parametro);

                                    _swal(orpta);
                                } else {
                                    swal({
                                        type: 'error',
                                        title: 'Oops...',
                                        text: 'Error!!'
                                    });
                                }
                            } 
                             else {
                                    swal({
                                        type: 'error',
                                        title: 'Oops...',
                                        text: 'Error!!'
                                    });
                                }
                        }
                    }, (p) => {
                        err(p);
                    });
            }
        }

        function save_new() {
            let idorigensolicitud = _('cboOrigen').value, req = '', req_enty = '';

            req_enty = _required({ clase: '_enty', id:'panelEncabezado_atxsolicitud' });
            if (idorigensolicitud === "1") { // CLIENTE
                req = _required({ clase: '_enty_origencliente', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "2") {
                req = _required({ clase: '_enty_origenproveedor', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "3") {
                req = _required({ clase: '_enty_origencolgador', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "4") {
                req = _required({ clase: '_enty_origenatxantiguo', id: 'panelEncabezado_atxsolicitud' });
            } else if (idorigensolicitud === "5") { /* Jacob - Ficha de inspiracion */
                let bool = '', rowCount = '';
                bool = _required({ clase: '_enty_origenfichainspiracion', id: 'panelEncabezado_atxsolicitud' });
                rowCount = _('tblMateriaPrima').rows.length;
                if (rowCount > 1) {
                    if (bool === true && rowCount > 1) { req = true; }
                } else {
                    swal({ title: "Advertencia", text: "Debes añadir por lo menos un contenido de Fibra", type: "warning" });
                    req = false;
                }
            }

            if (req_enty && req) {
                let pasavalidacion = otras_validaciones_antesgrabar(idorigensolicitud);
                if (pasavalidacion === false) {
                    return false;
                }

                _('div_grupo_comparar_codigo_reporteatx_estandar').classList.remove('has-error');
                _('div_grupo_comparar_solicitudatx_estandar').classList.remove('has-error');

                let atx = _getParameter({ id: 'panelEncabezado_atxsolicitud', clase: '_enty_grabar' }), arr_materiaprima = ObtenerMateriaPrima(),
                    arrlavado = Array.from(_('panelEncabezado_atxsolicitud').getElementsByClassName('cls_lavado')), valorlavado = null, valorevaluacion = null,
                    arrevaluacion = Array.from(_('panelEncabezado_atxsolicitud').getElementsByClassName('cls_evaluacion')), urlaccion = '', form = new FormData();

                arrlavado.some(x => {
                    if (x.checked) {
                        valorlavado = x.value;
                        return true;
                    }
                });

                arrevaluacion.some(x => {
                    if (x.checked) {
                        valorevaluacion = x.value;
                        return true;
                    }
                });
                atx['LavadoPanos'] = valorlavado;
                atx['Evaluacion'] = valorevaluacion;
                let idtintorerita = _getValueDataList(_('txt_tintoreria').value, _('dl_tintoreria'));
                atx["idproveedortintoreria"] = _getValueDataList(_('txt_tintoreria').value, _('dl_tintoreria'));
                atx["lst_instruccionescuidad"] = ovariables.lstinstruccioncuidado_grabar;
                let descripcion_nombre_tela = fn_generar_descripcion_nombre_tela_para_laboratorio();
                atx["descripcion_nombre_tela"] = descripcion_nombre_tela;
                let requiereanalisislaboratorio = fn_get_chk_requiereanalisislaboratorio('div_testlaboratorio', '_cls_chk_requiereanalisislaboratorio');
                atx["desarrollotelarequiereanalisislaboratorio"] = requiereanalisislaboratorio;
                //// PARA EL CODIGO DE REPORTE ATX ESTANDAR
                let txtanioatx = _('txtanio_atx_estandar');
                let txtnumeroatx = _('txtcontador_atx_estandar');
                if (txtanioatx.value.trim() !== '' && txtnumeroatx.value.trim() !== '') {
                    atx["codigoreporte"] = fn_crear_formato_codigoatx(txtanioatx.value.trim(), txtnumeroatx.value.trim());
                }

                urlaccion = 'DesarrolloTextil/Solicitud/Save_New';

                form.append('par', JSON.stringify(atx));
                form.append('pardetalle', JSON.stringify(arr_materiaprima));
                form.append("filearchivo", $("#filearchivo")[0].files[0]);

                let err = (__err) => { console.log('err', __err) }

                _Post(urlaccion, form)
                    .then((rpta) => {
                        let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                        if (orpta !== null) {
                            _('_title').innerText = 'SOLICITUD #' + orpta.id;
                            let odata = orpta.data !== '' ? JSON.parse(orpta.data) : null, dataatx = null, odataMP = null;
                            if (odata !== null) {
                                dataatx = odata[0].ATX !== '' ? JSON.parse(odata[0].ATX) : null;
                                if (dataatx !== null) {
                                    ovariables.accion = 'edit';
                                    ovariables.idsolicitud = dataatx.IdSolicitud;
                                    _('hf_estadosolicitud').value = dataatx.Estado;
                                    _('hf_idsolicitud').value = dataatx.IdSolicitud;
                                    _('hf_idanalisistextilsolicitud').value = dataatx.IdAnalisisTextilSolicitud;
                                    odataMP = odata[0].ATXMateriaPrima;
                                    ovariables.idanalisistextilsolicitud = dataatx.IdAnalisisTextilSolicitud;
                                    ovariables.estado = dataatx.Estado
                                    //ejecutarDespuesGrabar(ovariables.accion, odataMP);

                                    let parametro = `idgrupocomercial:${ovariables.idgrupocomercial},idsolicitud:${ovariables.idsolicitud},idanalisistextilsolicitud:${ovariables.idanalisistextilsolicitud},accion:${ovariables.accion}`,
                                        url = 'DesarrolloTextil/Solicitud/New';
                                    _Go_Url(url, url, parametro);

                                    _swal(orpta);
                                } else {
                                    swal({
                                        type: 'error',
                                        title: 'Oops...',
                                        text: 'Error!!'
                                    });
                                }
                            } else {
                                swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Error!!'
                                })
                            }
                        }
                    }, (p) => {
                        err(p);
                    });
            }
        }

        function buscaratx() {
            _modalBody({
                url: 'DesarrolloTextil/Solicitud/_BuscarAtx',
                ventana: '_BuscarAtx',
                titulo: 'Buscar Atx',
                parametro: ``,
                ancho: '900',
                alto: ''
            });
        }

        function fn_change_origenmuestra(o) {
            //let o = e.currentTarget, cbomotivosolicitud = _('cboMotivoSolicitud');;
            let cbomotivosolicitud = _('cboMotivoSolicitud');

            // Muestra todos los motivos y oculta desarrollo (ficha de inspiracion) - Jacob
            for (var i = 0; i < _('cboMotivoSolicitud').length; i++) {
                _('cboMotivoSolicitud').options[i].style.display = 'block';
            }
            _('cboMotivoSolicitud').options[3].style.display = 'none';
            // Hasta aca

            if (o.value === '1') {
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                _('divATX').classList.add('hide');
                _('cboMotivoSolicitud').options[0].selected = true;
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "2"){  //// PROVEEDOR
                _('div_datosproveedor').classList.remove('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                cbomotivosolicitud.options[2].selected = true;
                _('divATX').classList.add('hide');
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.remove('hide');
            } else if (o.value === "3") {  // COLGADOR
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.remove('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                _('cboMotivoSolicitud').options[0].selected = true;
                _('divATX').classList.add('hide');
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "4") {
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');              
                $("#txtanio").prop("disabled", false);
                $("#txtCorrelativo").prop("disabled", false);
                _('cboMotivoSolicitud').options[0].selected = true;
                _('divATX').classList.remove('hide');
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "5") { // FICHA DE INSPIRACION /*Jacob*/
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                _('divATX').classList.add('hide');
                // Selecciona option ficha de inspiracion
                _('cboMotivoSolicitud').options[3].style.display = 'block';
                _('cboMotivoSolicitud').options[3].selected = true;
                // Oculta las demas
                for (var i = 0; i < _('cboMotivoSolicitud').length - 1; i++) {
                    _('cboMotivoSolicitud').options[i].style.display = 'none';
                }
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            }

            fn_change_motivosolicitud(cbomotivosolicitud);
        }

        function setear_valore_segun_origen_ini_edit(o) {
            let cbomotivosolicitud = _('cboMotivoSolicitud');;
            if (o.value === '1') {
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "2") {  //// PROVEEDOR
                _('div_datosproveedor').classList.remove('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.remove('hide');
            } else if (o.value === "3") {  // COLGADOR
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.remove('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "4") {
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", false);
                $("#txtCorrelativo").prop("disabled", false);
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            } else if (o.value === "5") { // FICHA DE INSPIRACION /*Jacob*/
                _('div_datosproveedor').classList.add('hide');
                _('divcodigocolgador').classList.add('hide');
                $("#txtanio").prop("disabled", true);
                $("#txtCorrelativo").prop("disabled", true);
                // ATX SIN SDT
                //_('div_testlaboratorio').classList.add('hide');
            }

            fn_change_motivosolicitud(cbomotivosolicitud);
        }

        function otras_validaciones_antesgrabar(idorigensolicitud)
        {
            let pasavalidacion = true, tbody = _('tbody_MateriaPrima'), arrfilas_contenido = Array.from(tbody.rows), totalfilas_contenido = arrfilas_contenido.length,
                mensaje = '', tiene_contenido = true, pasa_validacion_porcentaje = true, req_input_comparativo = true;

            let fn_local_sumar_porcentaje = () => {
                let sum = 0;
                arrfilas_contenido.forEach(x => {
                    let valor = parseFloat(x.getElementsByClassName('_clsCantidad')[0].value);
                    valor = valor === '' ? 0 : valor;
                    sum += valor;
                });
                return sum;
            }

            if (idorigensolicitud === "1") { // CLIENTE
                if (totalfilas_contenido > 0) {
                    let sum = fn_local_sumar_porcentaje();
                    if (sum !== 100) {
                        pasa_validacion_porcentaje = false
                        pasavalidacion = false;
                        mensaje += '- La suma del porcentaje de composición debe sumar el 100% \n';
                    }
                }
            } else if (idorigensolicitud === "2") {  // PROVEEDOR
                if (totalfilas_contenido === 0) {
                    pasavalidacion = false;
                    tiene_contenido = false;
                    mensaje += '- Falta ingresar el contenido de fibra \n';
                }

                if (tiene_contenido) {
                    let sum = fn_local_sumar_porcentaje();
                    //arrfilas_contenido.forEach(x => {
                    //    let valor = x.getElementsByClassName('_clsCantidad')[0].value;
                    //    valor = valor === '' ? 0 : valor;
                    //    sum += valor;
                    //});
                    if (sum !== 100) {
                        pasa_validacion_porcentaje = false
                        pasavalidacion = false;
                        mensaje += '- La suma del porcentaje de composición debe sumar el 100% \n';
                    }

                }
            } else if (idorigensolicitud === "3") {  // COLGADOR
                if (ovariables.permitir_grabar_origen_colgador === 'no') {
                    mensaje += ovariables.mensaje_validacion_origen_colgador + '\n';
                    pasavalidacion = false;
                }
                
                if (totalfilas_contenido > 0) {
                    let sum = fn_local_sumar_porcentaje();
                    if (sum !== 100) {
                        pasa_validacion_porcentaje = false
                        pasavalidacion = false;
                        mensaje += '- La suma del porcentaje de composición debe sumar el 100% \n';
                    }
                }
            } else if (idorigensolicitud === "4") {  // ATX ANTIGUOS
                if (totalfilas_contenido > 0) {
                    let sum = fn_local_sumar_porcentaje();
                    if (sum !== 100) {
                        pasa_validacion_porcentaje = false
                        pasavalidacion = false;
                        mensaje += '- La suma del porcentaje de composición debe sumar el 100% \n';
                    }
                }
                let anio = _('txtanio').value, contador = _('txtCorrelativo').value;
                if ((ovariables.atxañoantiguodesde > anio || anio > ovariables.atxañoantiguohasta) || (ovariables.atxañoantiguohasta == anio && ovariables.atxcontadorantiguo <= contador)) {
                    mensaje += '- El año o correlativo no corresponde \n';
                    pasavalidacion = false;
                }
            } else if (idorigensolicitud === "5") { // Jacob - Ficha de inspiracion
                if (totalfilas_contenido > 0) {
                    let sum = fn_local_sumar_porcentaje();
                    if (sum !== 100) {
                        pasa_validacion_porcentaje = false
                        pasavalidacion = false;
                        mensaje += '- La suma del porcentaje de composición debe sumar el 100% \n';
                    }
                }
            }

            if (_('cboMotivoSolicitud').value === '1') {
                let perfiles = ovariables.perfil.join(',');
                _('div_grupo_comparar_codigo_reporteatx_estandar').classList.remove('has-error');
                _('div_grupo_comparar_solicitudatx_estandar').classList.remove('has-error');
                if (perfiles.indexOf('fabrica') >= 0) {
                    //// PARA LA ADECUACION DE SOLICITUD DE ATX SIN SDT
                    //if (_('txtsolicituddesarrollotela').value.trim() === '') {
                    //    _('div_grupo_idsolicituddesarrollotela').classList.add('has-error');
                    //    mensaje += '- Falta seleccionar la Solicitud de Desarrollo de Tela \n';
                    //    pasavalidacion = false;
                    //}
                }
            } else if (_('cboMotivoSolicitud').value === '2') {
                /* ESTO ERA ANTERIOR
                ////&& _('txtcodigosolicitudatxestandar').value.trim() === ''
                if (_('txtcodigoreporteatxestandar').value.trim() === '') {
                    _('div_grupo_comparar_codigo_reporteatx_estandar').classList.add('has-error');
                    _('div_grupo_comparar_solicitudatx_estandar').classList.add('has-error');
                    req_input_comparativo = false;
                    pasavalidacion = false;
                }
                */
                let txtanioatx = _('txtanio_atx_estandar');
                let txtnumeroatx = _('txtcontador_atx_estandar');
                if (txtanioatx.value.trim() === '' || txtnumeroatx.value.trim() === '') {
                    _('div_grupo_comparar_codigo_reporteatx_estandar').classList.add('has-error');
                    _('div_grupo_comparar_solicitudatx_estandar').classList.add('has-error');
                    req_input_comparativo = false;
                    pasavalidacion = false;
                } else {
                    if (txtanioatx.value.length < 4) {
                        _('div_grupo_comparar_codigo_reporteatx_estandar').classList.add('has-error');
                        req_input_comparativo = false;
                        pasavalidacion = false;
                        mensaje += '- El año debe ser de 4 dígitos. \n';
                    }
                }

                //// PARA LA ADECUACION DE SOLICITUD DE ATX SIN SDT
                //if (_('txtsolicituddesarrollotela').value.trim() === '') {
                //    _('div_grupo_idsolicituddesarrollotela').classList.add('has-error');
                //    pasavalidacion = false;
                //}
            }

            if (mensaje !== '') {
                _swal({ estado: 'error', mensaje: mensaje });
            }

            return pasavalidacion;
        }

        function fn_crear_formato_codigoatx(anio, numero) {
            let anio_cadena = anio.substr(-2);
            let numero_cadena = ('00000' + numero).substr(-5);
            let codigoatx = 'ATX' + anio_cadena + ' - ' + numero_cadena;
            return codigoatx;
        }

        function fn_buscar_by_codigotela() {
            let codigotela = _('txtcodigotela').value;
            if (codigotela.trim() !== '') {
                let par = { codigotela: codigotela }
                _Get('DesarrolloTextil/Solicitud/GetData_FichaTecnica_ByCodigoTela?par=' + JSON.stringify(par))
                    .then((rpta) => {
                        let odata = rpta !== '' ? JSON.parse(rpta) : null;

                        if (odata !== null) {
                            let permitir_grabar = odata[0].permitir_grabar_solicitudatx, respuesta_mensaje_validacion = odata[0].respuesta_si_es_un_atx;
                            ovariables.permitir_grabar_origen_colgador = permitir_grabar;
                            ovariables.mensaje_validacion_origen_colgador = respuesta_mensaje_validacion;
                            if (permitir_grabar === 'no') {
                                _swal({ mensaje: respuesta_mensaje_validacion, estado:'error' });
                            }
                        }

                        if (odata[0].tela !== '') {
                            pintar_datos_by_codigotela(odata);
                        } else {
                            _('txtEstructura').value = "";
                            _('txtTitulo').value = "";
                            _('txtDensidad').value = "";
                            let tbody = _('tbody_MateriaPrima');
                            tbody.innerHTML = '';
                        }
                    });
            } else {
                swal({
                    text: 'Ingrese el código de tela',
                    title: '',
                    type: 'error'
                });
                _('txtEstructura').value = "";
                _('txtTitulo').value = "";
                _('txtDensidad').value = "";
                let tbody = _('tbody_MateriaPrima');
                tbody.innerHTML = '';
            }
        }

        function pintar_datos_by_codigotela(odata) {
            let tela = odata[0].tela !== '' ? CSVtoJSON(odata[0].tela) : null, mp = odata[0].materiaprima !== '' ? CSVtoJSON(odata[0].materiaprima) : null;
            _('txtEstructura').value = tela[0].nombrefamilia, 
            arrlavado = Array.from(_('panelEncabezado_atxsolicitud').getElementsByClassName('cls_lavado'));
            _('txtTitulo').value = tela[0].titulo;
            _('txtDensidad').value = tela[0].densidad;
            
            arrlavado.some(x => {
                if (tela[0].lavado === '1' && x.value === '1'){
                    x.checked = true;
                } else if (tela[0].lavado === '2' && x.value === '0'){
                    x.checked = true;
                }
            });
            
            let tbody = _('tbody_MateriaPrima'), html = '';
            if (mp !== null) {
                mp.forEach(x => {
                    html += `<tr data-par='idMateriaPrima:${x.idmateriaprima},IdDetalle:0'>
                                <td class ='text-center'>
                                    <div class ='btn-group'>
                                        <button class ='btn btn-danger btn-sm _eliminarMateriaPrima' title='Delete'>
                                            <span class='fa fa-trash'></span>
                                        </button>
                                    </div>
                                </td>
                                <td>${x.nombremateriaprima}</td>
                                <td>
                                    <input type='text' placeholder='0' class ='form-control _clsCantidad text-right' data-type='int' data-min='1' data-max='3' data-required="true" onkeypress='return DigitimosDecimales(event, this)' value='${x.porcentaje}' />
                                </td>
                            </tr>`;
                });

                tbody.innerHTML = html;
            }
        }

        function fn_change_motivosolicitud(o) {
            let arr_perfil = ovariables.perfil.filter(x => x.toLowerCase() === 'fabrica'), quienes = '';
            if (arr_perfil.length > 0) {
                quienes = 'fabrica';
            } 
            if (o.selectedIndex > 0) {
                if (quienes === 'fabrica') {
                    _('div_datostelaestandar').classList.remove('hide');
                } else {
                    if (o.value === '2') {
                        _('div_datostelaestandar').classList.remove('hide');
                    } else {
                        _('div_datostelaestandar').classList.add('hide');
                    }
                }
            } else {
                _('div_datostelaestandar').classList.add('hide');
            }
        }

        function fn_generar_descripcion_nombre_tela_para_laboratorio() {
            let descripcion_nombre_tela_return = '';
            let getlavado = () => {
                let arr = Array.from(_('divrbLavado').getElementsByClassName('cls_lavado')), descricion_tipo_lavado = '';

                arr.some(x => {
                    if (x.checked) {
                        if (x.value === '0') {
                            descricion_tipo_lavado = 'BW';
                        } else {
                            descricion_tipo_lavado = 'AW';
                        }
                        return true;
                    }
                });
                return descricion_tipo_lavado;
            }

            let getcadena_materiaprima = () => {
                let tbody = _('tbody_MateriaPrima'), arrfila = Array.from(tbody.rows), cadena_materiaprima = '',
                    totalfilas = arrfila.length;

                arrfila.forEach((x, index) => {
                    let porcentaje = 0, nombremateriaprima = '';
                    porcentaje = x.getElementsByClassName('_clsCantidad')[0].value;
                    nombremateriaprima = x.getElementsByClassName('cls_td_materiaprima')[0].innerText;

                    if ((index + 1) < totalfilas) {
                        cadena_materiaprima += porcentaje + '% ' + nombremateriaprima + ' ';
                    } else {
                        cadena_materiaprima += porcentaje + '% ' + nombremateriaprima;
                    }
                });

                return cadena_materiaprima;
            }

            let familia = _('txtEstructura').value, titulo = _('txtTitulo').value, densidad = _('txtDensidad').value,
                tipolavado = getlavado(), cadena_materia_prima = getcadena_materiaprima();

            descripcion_nombre_tela_return = familia + ' ' + titulo + ' ' + cadena_materia_prima + ' ' + densidad + ' ' + tipolavado;
            return descripcion_nombre_tela_return;
        }

        function fn_set_checked_requiereanalisislaboratorio(checked, div, clase) {
            let input_chk = _(div).getElementsByClassName(clase)[0];
            input_chk.checked = checked;
            if (checked) {
                input_chk.parentNode.classList.add('checked');
            } else {
                input_chk.parentNode.classList.remove('checked');
            }
            fn_enabled_disabled_testlaboratorio(checked);
        }

        function fn_enabled_disabled_testlaboratorio(requiereanalisislaboratorio) {
            let arr_inputs = Array.from(_('div_content_testlaboratorio').getElementsByClassName('_enty_origenproveedor'));
            arr_inputs.forEach(x => {
                if (requiereanalisislaboratorio) {
                    if (x.classList.value.indexOf('_enty_habilitar') > 0) {
                        x.disabled = false;
                    }
                    
                    x.setAttribute('data-required', true);
                } else {
                    if (x.classList.value.indexOf('_enty_habilitar') > 0) {
                        x.disabled = true;
                    }
                    
                    x.setAttribute('data-required', false);
                }
            });
        }

        function fn_get_chk_requiereanalisislaboratorio(div, clase) {
            let ischecked = _(div).getElementsByClassName(clase)[0].checked;
            return ischecked ? 1 : 0;
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_set_checked_requiereanalisislaboratorio: fn_set_checked_requiereanalisislaboratorio
        }
    }
)(document, 'panelEncabezado_atxsolicitud');

(
    function ini() {
        appNewSolicitudAtx.load();
        appNewSolicitudAtx.req_ini();
    }
)();
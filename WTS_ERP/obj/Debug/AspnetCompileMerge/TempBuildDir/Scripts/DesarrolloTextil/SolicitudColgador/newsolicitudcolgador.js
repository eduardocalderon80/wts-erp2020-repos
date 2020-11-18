var appSolicitudColgador = (
    function (d, idpadre) {
        var ovariables = {
            lstproveedor: [],
            accion: '',
            idgrupocomercial: '',
            idsolicitud: '',
            idcolgadorsolicitud: ''
        }

        function load() {
            let txtpar = _('txtpar_new').value, btn_save_new = _('btnSave'), btn_save_edit = _('btnUpdate');
            ovariables.accion = _par(txtpar, 'accion');
            ovariables.idgrupocomercial = _par(txtpar, 'idgrupocomercial');
            ovariables.idsolicitud = _par(txtpar, 'idsolicitud');
            ovariables.idcolgadorsolicitud = _par(txtpar, 'idcolgadorsolicitud');

            if (ovariables.accion === 'edit') {
                btn_save_new.classList.add('hide');
                btn_save_edit.classList.remove('hide');
            }

            _('hf_idsolicitud').value = ovariables.idsolicitud;
            _('hf_idcolgadorsolicitud').value = ovariables.idcolgadorsolicitud;

            _('_title').innerText = 'Solicitud';
            _('btnAgregarcodigotelawts').addEventListener('click', fn_addcodigotelawts, false);
            //_('btnagregar_descripcion').addEventListener('click', fn_adddescripciontela, false);
            _('btnagregar_armadocolgador').addEventListener('click', fn_addarmadocolgaor, false);
            btn_save_new.addEventListener('click', fn_save_new, false);
            btn_save_edit.addEventListener('click', fn_save_edit, false);
            _('btnReturn').addEventListener('click', returnIndex);
            _('txtcodigotelawts').addEventListener('keypress', function (e) {
                if (e.keyCode === 13) {
                    fn_addcodigotelawts();
                };
            }, false);
            _('btn_add_foto_colgador_descripcion').addEventListener('change', fn_add_foto_colgador_por_descripcion, false);

            //// PARA EL MOCKUP DE COTIZAR
            $("#div_cuerpoprincipal .cls_chk_cotizar_all").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let o = e.currentTarget, tbody = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    id_tabla = tbody.getAttribute('id'), estado = o.checked;

                fn_select_all_chk_cotizar(id_tabla, estado);
            });

            $("#div_cuerpoprincipal .cls_chk_muestra_all").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let o = e.currentTarget, tbody = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    id_tabla = tbody.getAttribute('id'), estado = o.checked, data_chk_clase = o.getAttribute('data-clase');

                fn_select_all_chk_modalidad(id_tabla, estado, data_chk_clase);
            });

            $("#div_cuerpoprincipal .cls_chk_produccion_all").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            }).on('ifChanged', function (e) {
                let o = e.currentTarget, tbody = o.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode,
                    id_tabla = tbody.getAttribute('id'), estado = o.checked, data_chk_clase = o.getAttribute('data-clase');

                fn_select_all_chk_modalidad(id_tabla, estado, data_chk_clase);
            });

            $("#chk_requiere_cotizar_descripcion").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#div_cuerpoprincipal .cls_chk_modalidad_cotizar_descripcion").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        //// PARA EL MOCKUP DE COTIZAR
        function fn_select_all_chk_modalidad(id_tabla, estado, chk_clase) {
            let arr_chk = Array.from(_(id_tabla).getElementsByClassName(chk_clase));

            arr_chk.forEach(x => {
                let div_chk = x.parentNode;
                x.checked = estado;
                if (estado) {
                    div_chk.classList.add('checked');
                } else {
                    div_chk.classList.remove('checked');
                }
            });
        }

        function fn_select_all_chk_cotizar(id_tabla, estado) {
            let arr_chk = Array.from(_(id_tabla).getElementsByClassName('_chkcotizar'));

            arr_chk.forEach(x => {
                let div_chk = x.parentNode;
                x.checked = estado;
                if (estado) {
                    div_chk.classList.add('checked');
                } else {
                    div_chk.classList.remove('checked');
                }
                
            });
        }

        function fn_add_foto_colgador_por_descripcion(e) {
            let o = e.currentTarget;
            if (o.files && o.files[0]) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    //// Math.floor(Math.random() * 100); //// NUMERO ALEATORIO ENTRE 0 A 99
                    let inputfile = _('btn_add_foto_colgador_descripcion').cloneNode(true),
                        numero_aleatorio = Math.floor(Math.random() * 100), clase_generada = 'cls_foto_descripcion_' + numero_aleatorio,
                        div_contenedor_foto = _('div_contenedordetalle_fotos_descripcion'); 

                    inputfile.classList.add('cls_inputfile_addfoto_descripcion');
                    inputfile.classList.add('hide');
                    inputfile.classList.add(clase_generada);
                    let html = `
                        <div class="col-sm col-sm-1 cls_div_foto_descripcion ${clase_generada}" data-nombreclasegenerada='${clase_generada}' data-par='' data-estadofoto='new'>
                            <img src="${ event.target.result }" class="img-responsive" style="width:90px; height:80px;">
                            <span type='button' class='btn btn-xs btn-danger fa fa-times cls_btn_delete_foto'></span>
                            <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto'></span>
                        </div>
                    `;
                    div_contenedor_foto.insertAdjacentHTML('beforeend', html);
                    div_contenedor_foto.getElementsByClassName(clase_generada)[0].appendChild(inputfile);
                    handler_add_foto_descripcion(clase_generada);
                }
                reader.readAsDataURL(o.files[0]);
            }
        }

        function handler_add_foto_descripcion(clasegenerada) {
            let div_contenedor_principal_todas_las_fotos = _('div_contenedordetalle_fotos_descripcion'),
                div_contenedor_foto_hijo = div_contenedor_principal_todas_las_fotos.getElementsByClassName(clasegenerada)[0];

            div_contenedor_foto_hijo.getElementsByClassName('cls_btn_delete_foto')[0].addEventListener('click', fn_delete_foto_descripcion, false)
            div_contenedor_foto_hijo.getElementsByClassName('cls_btn_ver_foto')[0].addEventListener('click', fn_verfoto_descripcion, false);
        }

        function fn_verfoto_descripcion(e) {
            let o = e.currentTarget, div_img = o.parentNode, img = div_img.getElementsByClassName('img-responsive')[0], src = img.getAttribute('src'),
                width = 900, height = 403, width_img = '', height_img = '';

            if (screen.width === 800 && screen.height === 600) {
                width = 900;
                height = 450;
                width_img = 550;
                height_img = 260;
            } else if (screen.width === 1024 && screen.height === 768) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1152 && screen.height === 864) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1280 && screen.height === 600) {
                width = 700;
                height = 400;
                width_img = 600;
                height_img = 230;
            } else if (screen.width === 1280 && screen.height === 720) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 768) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 800) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 430;
            } else if (screen.width === 1280 && screen.height === 960) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1280 && screen.height === 1024) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1360 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1366 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1400 && screen.height === 1050) {
                width = 800;
                height = 800;
                width_img = 700;
                height_img = 610;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1600 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;

            } else if (screen.width === 1680 && screen.height === 1050) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1920 && screen.height === 1080) {
                width = 900;
                height = 800;
                width_img = 800;
                height_img = 630;
            } 

            let par_src = _subparameterEncode(src);

            _modalBody({
                url: 'DesarrolloTextil/SolicitudColgador/_VerFotoColgador',
                ventana: '_VerFotoColgador',
                titulo: 'Ver Foto',
                parametro: `src:${par_src},width_img:${width_img},height_img:${height_img}`,
                ancho: width,
                alto: height,
                responsive: 'modal-lg'
            });
        }

        function fn_delete_foto_descripcion(e) {
            let o = e.currentTarget, divpadre_contenedor_todas_las_fotos = _('div_contenedordetalle_fotos_descripcion'),
                div_contenedor_foto = o.parentNode;
                //clasegenerada = div_contenedor_foto.getAttribute('data-nombreclasegenerada');
                
            divpadre_contenedor_todas_las_fotos.removeChild(div_contenedor_foto);
        }

        function fn_addarmadocolgaor() {
            let html = '', tbody = _('tbody_armadocolgadores'), totalfilas = tbody.rows.length;
            html = `
                    <tr data-par='idcolgadorsolicituddetalle:0'>
                        <td class='text-center' style='vertical-align: middle;'>
                            <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                <span class='fa fa-trash-o'></span>
                            </button>
                        </td>
                        <td>
                            <input type='text' class='cls_proveedor form-control' list='dl_proveedor_${totalfilas}' />
                            <datalist id='dl_proveedor_${totalfilas}' class='cls_dl_proveedor'></datalist>
                            <span class='hide has-error cls_error_proveedor'>Falta seleccioar el proveedor</span>
                        </td>
                        <td>
                            <input type='text' class='cls_txt_cantidad form-control' value='' />
                            <span class='hide has-error cls_error_cantidad'>Falta el nro de colgadores</span>
                        </td>
                        <td>
                            <textarea class='cls_txta_comentario form-control' rows=2></textarea>
                        </td>
                    </tr>
            `;
            //// LO SAQUE YA QUE NO ES NECESARIO COTIZAR TELA
            //<td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
            //    <label>
            //        <div class="icheckbox_square-green _div_chkcotizar _div_chkcotizar_tbl_armadocolgadores" style="position: relative;">
            //            <div class="icheckbox_square-green" style="position: relative;">
            //                <input type="checkbox" class="i-checks _chkcotizar _chkcotizar_tbl_armadocolgadores" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
            //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
            //        </div>
            //    </label>
            //</td>
            //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
            //        <label>
            //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_muestra_tbl_armadocolgadores" style="position: relative;">
            //                <div class="icheckbox_square-green" style="position: relative;">
            //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_muestra_tbl_armadocolgadores" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
            //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
            //            </div>
            //        </label>
            //    </td>
            //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
            //        <label>
            //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_produccion_tbl_armadocolgadores" style="position: relative;">
            //                <div class="icheckbox_square-green" style="position: relative;">
            //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_produccion_tbl_armadocolgadores" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
            //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
            //            </div>
            //        </label>
            //    </td>

            tbody.insertAdjacentHTML('beforeend', html);
            let indicefila = tbody.rows.length - 1;
            handler_tela_armadocolgador_add(indicefila);
        }

        function handler_tela_armadocolgador_add(indicefila) {
            let tbody = _('tbody_armadocolgadores'), fila = tbody.rows[indicefila];
            let ddl_proveedor = fila.getElementsByClassName('cls_dl_proveedor')[0];

            let options = _comboDataListFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor');
            ddl_proveedor.innerHTML = options;

            fila.getElementsByClassName('cls_btn_delete')[0].addEventListener('click', fn_delete_codigotelawts, false)

            //// PARA EL MOCKUP DE COTIZAR
            $("#div_cuerpoprincipal ._chkcotizar_tbl_armadocolgadores").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#div_cuerpoprincipal ._chkmodalidad").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        function handler_tela_armadocolgador_ini_edit() {
            let tbody = _('tbody_armadocolgadores'), arr_btn_delete = Array.from(tbody.getElementsByClassName('cls_btn_delete')),
                arr_rows = Array.from(tbody.rows), options_para_datalist = _comboDataListFromJSON(ovariables.lstproveedor, 'idproveedor', 'nombreproveedor');
            arr_btn_delete.forEach(x => x.addEventListener('click', e => { fn_delete_codigotelawts(e); }), false);

            //// SETEAR COMBO DATALIST PROVEEDOR
            arr_rows.forEach(x => {
                let datapar = x.getAttribute('data-par'), idproveedor = _par(datapar, 'idproveedor'), ddl_proveedor = x.getElementsByClassName('cls_dl_proveedor')[0];
                ddl_proveedor.innerHTML = options_para_datalist, txt_ddl_proveedor = x.getElementsByClassName('cls_proveedor')[0];
                _setValueDataList(idproveedor, ddl_proveedor, txt_ddl_proveedor);
            });
        }

        //function fn_adddescripciontela() {
        //    let hmtl = '', tbody = _('tbody_descripcion');

        //    html = `
        //            <tr data-par='idcolgadorsolicituddetalle:0'>
        //                <td>
        //                    <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
        //                        <span class='fa fa-trash-o'></span>
        //                    </button>
        //                </td>
        //                <td>
        //                    <textarea class='cls_txta_descripciontela form-control' rows=2 style='resize: none;'></textarea>
        //                    <span class='hide has-error cls_error_descripcion'>Falta la descripción de la tela</span>
        //                </td>
        //            </tr>
        //    `;

        //    tbody.insertAdjacentHTML('beforeend', html);
        //    let indicefila = tbody.rows.length - 1;
        //    handler_tbl_codigotela_new(indicefila, tbody);
        //}

        function fn_addcodigotelawts() {
            let html = '', tbody = _('tbody_codigotela'), txtcodigotela = _('txtcodigotelawts'), codigotela = txtcodigotela.value,
                parametro = { codigotela_o_descripcion: codigotela },
                url = 'DesarrolloTextil/SolicitudColgador/GetCodigoTelaWts?par=' + JSON.stringify(parametro);

            if (codigotela.length < 4) {
                _swal({ estado: 'error', mensaje: 'Ingrese al menos 4 digitos para seleccionar la tela...!' });
                return false;
            }

            _Get(url)
                .then((data) => {
                    let odata = data !== '' ? CSVtoJSON(data) : null;
                    if (odata) {
                        if (odata.length > 1) {

                            let arr_codigotela_ya_seleccionados = getarray_codigotelas_ya_seleccionados();
                            // VER VENTANA DE CODIGOS DE TELAS COINCIDENTES
                            _modalBody({
                                url: 'DesarrolloTextil/SolicitudColgador/_SeleccionarCodigoTelaWts',
                                ventana: '_SeleccionarCodigoTela',
                                titulo: 'Seleccionar Codigo Tela',
                                parametro: `codigotela_o_descripcion:${codigotela},arr_codigotelaseleccionados:${arr_codigotela_ya_seleccionados}`,
                                ancho: '',
                                alto: '',
                                responsive: 'modal-lg'
                            });
                        } else {
                            // PINTAR LA TABLA DE CODIGOS DE TELAS WTS
                            llenartabla_codigotela_new(odata);
                        }
                    } 
                });

            
        }

        function getarray_codigotelas_ya_seleccionados() {
            let tbody = _('tbody_codigotela'), arr_codigotela = Array.from(tbody.getElementsByClassName('cls_td_codigotela')),
                arr_return = [], cadena_codigotela = '';

            if (arr_codigotela) {
                arr_codigotela.forEach(x => {
                    arr_return.push(x.innerText.trim());
                });
            }

            if (arr_return.length > 0) {
                cadena_codigotela = arr_return.join('¬');
            }
            
            return cadena_codigotela;
        }
    
        function llenartabla_codigotela_new(data) {
            let tbody = _('tbody_codigotela'), txtcodigotela = _('txtcodigotelawts');
            //tbody_descripcion = _('tbody_descripciontela'), txtbuscar_por_descripcion = _('txtbuscar_por_descripcion')

            //// VALIDAR
            if (validar_antes_agregar_tela(data) === false) {
                return false;
            }

            data.forEach((x) => {
                html = `
                        <tr data-par='idcolgadorsolicituddetalle:0,idanalisistextil:${x.idanalisistextil}'>
                            <td class='text-center' style='vertical-align: middle;'>
                                <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                    <span class='fa fa-trash-o'></span>
                                </button>
                            </td>
                            <td class='cls_td_imagencolgador'>
                                <div style='width:100%;'>
                                    <img class='img-thumbnail cls_img_imagen_colgador' src='http://WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg' width='100' height='80'/>
                                    <span type='button' class='btn btn-xs btn-primary fa fa-plus-circle btn-file cls_btn_add_foto'>
                                        <input type='file' class='cls_inputfile_add_foto' accept='image/*' />
                                    </span>
                                    <span type='button' class='btn btn-xs btn-danger fa fa-times cls_btn_delete_foto'></span>
                                    <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto'></span>
                                </div>
                            </td>
                            <td class='cls_td_codigotela'>
                                ${x.codigotela}
                            </td>
                            <td class='cls_td_nombretela'>
                                ${x.nombretela}
                            </td>
                        </tr>
                    `;
                //// LO SAQUE YA QUE NO ES NECESARIO COTIZAR TELA
                //<td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                //    <label>
                //        <div class="icheckbox_square-green _div_chkcotizar _div_chkcotizar_tbl_codigotela" style="position: relative;">
                //            <div class="icheckbox_square-green" style="position: relative;">
                //                <input type="checkbox" class="i-checks _chkcotizar _chkcotizar_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                //        </div>
                //    </label>
                //</td>
                //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                //        <label>
                //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_muestra_tbl_codigotela" style="position: relative;">
                //                <div class="icheckbox_square-green" style="position: relative;">
                //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_muestra_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                //            </div>
                //        </label>
                //    </td>
                //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                //        <label>
                //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_produccion_tbl_codigotela" style="position: relative;">
                //                <div class="icheckbox_square-green" style="position: relative;">
                //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_produccion_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                //            </div>
                //        </label>
                //    </td>

                tbody.insertAdjacentHTML('beforeend', html);
                let indicefila = tbody.rows.length - 1;
                handler_tbl_codigotela_new(indicefila, tbody);
            });
            txtcodigotela.value = '';
        }

        function validar_antes_agregar_tela(data) {
            let tbody = _('tbody_codigotela'), arr_codigotela_tbl = [], mensaje = '', arr_filas = Array.from(tbody.rows), pasavalidacion = true;
            arr_filas.forEach((x) => {
                let codigotela = x.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(), obj = { codigotela: codigotela };
                arr_codigotela_tbl.push(obj);
            });

            // VALIDAR 
            if (arr_codigotela_tbl.length > 0) {
                data.forEach((x) => {
                    let filter = arr_codigotela_tbl.filter((i) => i.codigotela === x.codigotela);
                    if (filter.length > 0) {
                        mensaje += `- El codigo de tela ${x.codigotela} ya se agrego. \n`;
                    }
                });
            }

            if (mensaje !== '') {
                pasavalidacion = false;
                _swal({ estado: 'error', mensaje: mensaje });
            }

            return pasavalidacion;
        }

        function handler_tbl_codigotela_new(indicefila, tbody) {
            let fila = tbody.rows[indicefila];
            fila.getElementsByClassName('cls_btn_delete')[0].addEventListener('click', fn_delete_codigotelawts, false);
            fila.getElementsByClassName('cls_inputfile_add_foto')[0].addEventListener('change', function(e) { let o = e.target; fn_add_foto_colgador_x_item_tabla(o, 'tbody_codigotela', indicefila); }, false);
            fila.getElementsByClassName('cls_btn_delete_foto')[0].addEventListener('click', fn_delete_foto_colgador_x_item_tabla, false);
            fila.getElementsByClassName('cls_btn_ver_foto')[0].addEventListener('click', fn_verfoto_item_tabla, false);

            //// PARA EL MOCKUP DE COTIZAR
            $("#div_cuerpoprincipal ._chkcotizar_tbl_codigotela").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#div_cuerpoprincipal ._chkmodalidad_muestra_tbl_codigotela").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });

            $("#div_cuerpoprincipal ._chkmodalidad_produccion_tbl_codigotela").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green'
            });
        }

        function fn_verfoto_item_tabla(e) {
            let o = e.currentTarget, div_img = o.parentNode, img = div_img.getElementsByClassName('cls_img_imagen_colgador')[0], src = img.getAttribute('src'),
                width = 900, height = 403, width_img = '', height_img = '';

            if (screen.width === 800 && screen.height === 600) {
                width = 900;
                height = 450;
                width_img = 550;
                height_img = 260;
            } else if (screen.width === 1024 && screen.height === 768) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1152 && screen.height === 864) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1280 && screen.height === 600) {
                width = 700;
                height = 400;
                width_img = 600;
                height_img = 230;
            } else if (screen.width === 1280 && screen.height === 720) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 768) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 800) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 430;
            } else if (screen.width === 1280 && screen.height === 960) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1280 && screen.height === 1024) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1360 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1366 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1400 && screen.height === 1050) {
                width = 800;
                height = 800;
                width_img = 700;
                height_img = 610;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1600 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;

            } else if (screen.width === 1680 && screen.height === 1050) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1920 && screen.height === 1080) {
                width = 900;
                height = 800;
                width_img = 800;
                height_img = 630;
            }

            let par_src = _subparameterEncode(src);

            _modalBody({
                url: 'DesarrolloTextil/SolicitudColgador/_VerFotoColgador',
                ventana: '_VerFotoColgador',
                titulo: 'Ver Foto',
                parametro: `src:${par_src},width_img:${width_img},height_img:${height_img}`,
                ancho: width,
                alto: height,
                responsive: 'modal-lg'
            });
        }

        function fn_delete_foto_colgador_x_item_tabla(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode.parentNode, img = fila.getElementsByClassName('cls_img_imagen_colgador')[0];
            img.setAttribute('src', 'http://WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg');
            fila.setAttribute('data-keytablainputfile', '');
            fila.setAttribute('data-estadofoto', 'modificado');
            fila.setAttribute('data-confotosinfoto', 'sinfoto');
        }

        function fn_add_foto_colgador_x_item_tabla(o, tbody, indicefila) {
            let fila = _(tbody).rows[indicefila], img = fila.getElementsByClassName('cls_img_imagen_colgador')[0];

            if (o.files && o.files[0]) {
                var reader = new FileReader();

                fila.setAttribute('data-keytablainputfile', tbody + '_' + indicefila);
                fila.setAttribute('data-estadofoto', 'modificado');
                fila.setAttribute('data-confotosinfoto', 'confoto');
                reader.onload = function(e) {
                    img.setAttribute('src', e.target.result);
                }
                reader.readAsDataURL(o.files[0]);
            }
        }

        function fn_delete_codigotelawts(e) {
            let o = e.currentTarget, fila = o.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }

        function fn_save_new() {
            let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_solicitudcolgador' }), pardetail = getArray_detail(),
                nombrecliente = _('txtIdCliente').value, ddlcliente = _('ddl_cliente'), idcliente = _getValueDataList(nombrecliente, ddlcliente),
                parsubdetail = getobj_array_foto_descripcion_edit();

            parhead['idcliente'] = idcliente;

            let req = _required({ clase: '_enty', id: 'panelEncabezado_solicitudcolgador' });

            if (req) {
                let pasavalidacion = validarantesgrabar();
                if (pasavalidacion) {
                    parhead = JSON.stringify(parhead);
                    pardetail = JSON.stringify(pardetail);
                    parsubdetail = JSON.stringify(parsubdetail);

                    let frm = new FormData(), url = 'DesarrolloTextil/SolicitudColgador/SaveNew';
                    frm.append("parhead", parhead);
                    frm.append("pardetail", pardetail);
                    frm.append("parsubdetail", parsubdetail);
                    
                    let arr_filas_codigotela = Array.from(_('tbody_codigotela').rows);
                    arr_filas_codigotela.forEach(x => {
                        let inputfile = x.getElementsByClassName('cls_inputfile_add_foto')[0], datafile = x.getAttribute('data-keytablainputfile'),
                            file = inputfile.files[0];
                        frm.append(datafile, file);
                    });

                    let arr_inputfile_foto_descripcion = Array.from(_('div_contenedordetalle_fotos_descripcion').getElementsByClassName('cls_inputfile_addfoto_descripcion'));
                    if (arr_inputfile_foto_descripcion.length > 0) {
                        arr_inputfile_foto_descripcion.forEach(x => {
                            let file = x.files[0], div_contenedor = x.parentNode, key_value = div_contenedor.getAttribute('data-nombreclasegenerada'),
                                estadofoto = div_contenedor.getAttribute('data-estadofoto');
                            if (estadofoto === 'new') {
                                frm.append(key_value, file);
                            }
                        });
                    }

                    _Post(url, frm)
                        .then((rpta) => {
                            let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                            if (orpta) {
                                let idsolicitud_rpta = orpta.id, data_rpta = orpta.data !== '' ? JSON.parse(orpta.data) : null,
                                    idcolgadorsolicitud_rpta = '', parametro = '';
                                _swal({ estado: orpta.estado, mensaje: orpta.mensaje });

                                if (data_rpta !== null) {
                                    idcolgadorsolicitud_rpta = data_rpta[0].idcolgadorsolicitud;
                                    url = 'DesarrolloTextil/SolicitudColgador/NewSolicitudColgador',
                                        parametro = `accion:edit,idgrupocomercial:${ovariables.idgrupocomercial},idsolicitud:${idsolicitud_rpta},idcolgadorsolicitud:${idcolgadorsolicitud_rpta}`;
                                    _Go_Url(url, url, parametro);
                                }
                            }
                        });
                }
            }
        }

        function fn_save_edit() {
            let parhead = _getParameter({ clase: '_enty', id: 'panelEncabezado_solicitudcolgador' }), pardetail = getArray_detail(),
                nombrecliente = _('txtIdCliente').value, ddlcliente = _('ddl_cliente'), idcliente = _getValueDataList(nombrecliente, ddlcliente),
                parsubdetail = getobj_array_foto_descripcion_edit();

            parhead['idcliente'] = idcliente;

            let req = _required({ clase: '_enty', id: 'panelEncabezado_solicitudcolgador' });

            if (req) {
                let pasavalidacion = validarantesgrabar();
                if (pasavalidacion) {
                    parhead = JSON.stringify(parhead);
                    pardetail = JSON.stringify(pardetail);
                    parsubdetail = JSON.stringify(parsubdetail);

                    let frm = new FormData(), url = 'DesarrolloTextil/SolicitudColgador/SaveEdit';
                    frm.append("parhead", parhead);
                    frm.append("pardetail", pardetail);
                    frm.append("parsubdetail", parsubdetail);

                    let arr_filas_codigotela = Array.from(_('tbody_codigotela').rows);
                    arr_filas_codigotela.forEach(x => {
                        let estado_foto = x.getAttribute('data-estadofoto'), confotosinfoto = x.getAttribute('data-confotosinfoto');
                        if (estado_foto === 'modificado' && confotosinfoto === 'confoto') {
                            let inputfile = x.getElementsByClassName('cls_inputfile_add_foto')[0], datafile = x.getAttribute('data-keytablainputfile'),
                                file = inputfile.files[0];
                            frm.append(datafile, file);
                        }
                    });

                    let arr_inputfile_foto_descripcion = Array.from(_('div_contenedordetalle_fotos_descripcion').getElementsByClassName('cls_inputfile_addfoto_descripcion'));
                    if (arr_inputfile_foto_descripcion.length > 0) {
                        arr_inputfile_foto_descripcion.forEach(x => {
                            let file = x.files[0], div_contenedor = x.parentNode, key_value = div_contenedor.getAttribute('data-nombreclasegenerada'),
                                estadofoto = div_contenedor.getAttribute('data-estadofoto');
                            if (estadofoto === 'new') {
                                frm.append(key_value, file);
                            }
                        });
                    }

                    _Post(url, frm)
                        .then((rpta) => {
                            let orpta = rpta !== '' ? JSON.parse(rpta) : null;
                            if (orpta) {
                                let idsolicitud_rpta = orpta.id, data_rpta = orpta.data !== '' ? JSON.parse(orpta.data) : null,
                                    idcolgadorsolicitud_rpta = '', parametro = '';
                                _swal({ estado: orpta.estado, mensaje: orpta.mensaje });

                                if (data_rpta !== null) {
                                    idcolgadorsolicitud_rpta = data_rpta[0].idcolgadorsolicitud;
                                    url = 'DesarrolloTextil/SolicitudColgador/NewSolicitudColgador',
                                        parametro = `accion:edit,idgrupocomercial:${ovariables.idgrupocomercial},idsolicitud:${idsolicitud_rpta},idcolgadorsolicitud:${idcolgadorsolicitud_rpta}`;
                                    _Go_Url(url, url, parametro);
                                }
                            }
                        });
                }
            }
        }

        function validarantesgrabar() {
            let tbody_codigotelawts = _('tbody_codigotela'), tbody_armado = _('tbody_armadocolgadores'),
                pasavalidacion = true, existe_almenos_cargado_un_detalle = true, filas_codigotelawts = Array.from(tbody_codigotelawts.rows),
                filas_armado = Array.from(tbody_armado.rows), mensaje = '', pasa_validacion_armado = true,
                txtdescripcion_valor = _('txta_buscar_por_descripcion').value.trim(), existe_al_menos_una_cargadetalle_o_descripcion = true;

            //tbody_descripcion = _('tbody_descripcion'), pasa_validacion_descripcion = true, filas_descripcion = Array.from(tbody_descripcion.rows)

            //// VALIDAR SI SELECCIONE EL CLIENTE
            let cliente_text = _('txtIdCliente').value;
            let idcliente = _getValueDataList(cliente_text, _('ddl_cliente'));
            if (idcliente === '') {
                pasavalidacion = false;
                mensaje += '- Falta seleccionar al cliente. \n'
            }

            if (filas_codigotelawts.length <= 0 && filas_armado.length <= 0) {
                existe_almenos_cargado_un_detalle = false;
            }

            if (filas_codigotelawts.length <= 0 && filas_armado.length <= 0 && txtdescripcion_valor === '') {
                existe_al_menos_una_cargadetalle_o_descripcion = false;
                pasavalidacion = false;
                mensaje += '- No se ha ingresado ninguna información de búsqueda o armado. \n'
            }

            //filas_descripcion.forEach((x) => { x.getElementsByClassName('cls_error_descripcion')[0].classList.add('hide') });
            filas_armado.forEach((x) => {
                x.getElementsByClassName('cls_error_proveedor')[0].classList.add('hide');
                x.getElementsByClassName('cls_error_cantidad')[0].classList.add('hide');
            });

            if (existe_almenos_cargado_un_detalle) {
                //if (filas_descripcion.length > 0) {
                //    filas_descripcion.forEach((x, i) => {
                //        let valordescripcion = x.getElementsByClassName('cls_txta_descripciontela')[0].value;
                //        if (valordescripcion.trim() === '') {
                //            mensaje += `- Falta ingresar la descripcion de la tela en la fila ${(i + 1)} \n`;
                //            pasa_validacion_descripcion = false;
                //            let spnerror = x.getElementsByClassName('cls_error_descripcion')[0];
                //            spnerror.classList.remove('hide');
                //        }
                //    });
                //}
                if (filas_armado.length > 0) {
                    filas_armado.forEach((x, i) => {
                        let txtproveedor = x.getElementsByClassName('cls_proveedor')[0];
                        let dl_proveedor = x.getElementsByClassName('cls_dl_proveedor')[0];
                        let nombreproveedor = txtproveedor.value;
                        let nrocolgadores = x.getElementsByClassName('cls_txt_cantidad')[0].value;
                        let spn_error_proveedor = x.getElementsByClassName('cls_error_proveedor')[0];

                        if (nombreproveedor.trim() === '') {
                            mensaje += `- Falta seleccionar el proveedor en la fila ${(i + 1)} \n`;
                            pasa_validacion_armado = false;
                            
                            spn_error_proveedor.classList.remove('hide');
                        } else {
                            //// VALIDAR SI SELECCIONO AL PROVEEDOR
                            let idproveedor = _getValueDataList(nombreproveedor, dl_proveedor);
                            if (idproveedor === '') {
                                pasa_validacion_armado = false;
                                spn_error_proveedor.classList.remove('hide');
                                mensaje += `- Falta seleccionar el proveedor en la fila ${(i + 1)} \n`;
                            }
                        }
                        if (nrocolgadores.trim() === '') {
                            mensaje += `- Falta seleccionar el nro de colgadores en la fila ${(i + 1)} \n`;
                            pasa_validacion_armado = false;
                            let spn_error_nrocolgadores = x.getElementsByClassName('cls_error_cantidad')[0];
                            spn_error_nrocolgadores.classList.remove('hide');
                        }
                    });
                }
            } 

            if (mensaje !== '') {
                pasavalidacion = false;
                _swal({ estado: 'error', mensaje: mensaje });
            }

            return pasavalidacion;
        }

        function getArray_detail() {
            let tbody_codigotelawts = _('tbody_codigotela'), tbody_armado = _('tbody_armadocolgadores'),
                arr_filas_codigotelawts = Array.from(tbody_codigotelawts.rows),
                arr_filas_armado = Array.from(tbody_armado.rows), lstdetail = [];

            //tbody_descripcion = _('tbody_descripcion')

            arr_filas_codigotelawts.forEach((x) => {
                let datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                    codigotela = x.getElementsByClassName('cls_td_codigotela')[0].innerText.trim(),
                    descripciontela = x.getElementsByClassName('cls_td_nombretela')[0].innerText,
                    idanalisistextil = _par(datapar, 'idanalisistextil'),
                    data_keytablainputfile = x.getAttribute('data-keytablainputfile'),
                    data_estadofoto = x.getAttribute('data-estadofoto'),
                    data_confotosinfoto = x.getAttribute('data-confotosinfoto'),
                    obj = {
                        idcolgadorsolicituddetalle: idcolgadorsolicituddetalle, codigotela: codigotela, nrocolgadores: 1, comentario: '',
                        descripciontela: descripciontela, tipobusqueda: 'codigotela',
                        idanalisistextil: idanalisistextil,
                        data_keytablainputfile: data_keytablainputfile, 
                        estadofoto: data_estadofoto,
                        confotosinfoto: data_confotosinfoto
                    };
                lstdetail.push(obj);
            });

            //arr_filas_descripcion.forEach((x) => {
            //    let datapar = x.getAttribute('idcolgadorsolicituddetalle'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'), descripcion = x.getElementsByClassName('cls_txta_descripciontela')[0].value,
            //        obj = { idcolgadorsolicituddetalle: idcolgadorsolicituddetalle, codigotela: '', nrocolgadores: 1, comentario: '', descripciontela: descripcion, tipobusqueda: 'descripcion' };
            //    lstdetail.push(obj);
            //});

            arr_filas_armado.forEach((x) => {
                let datapar = x.getAttribute('data-par'), idcolgadorsolicituddetalle = _par(datapar, 'idcolgadorsolicituddetalle'),
                    ddlproveedor = x.getElementsByClassName('cls_dl_proveedor')[0], idproveedor = _getValueDataList(x.getElementsByClassName('cls_proveedor')[0].value, ddlproveedor),
                    nrocolgadores = x.getElementsByClassName('cls_txt_cantidad')[0].value, comentario = x.getElementsByClassName('cls_txta_comentario')[0].value,
                    obj = {
                        idcolgadorsolicituddetalle: idcolgadorsolicituddetalle,
                        codigotela: '',
                        nrocolgadores: nrocolgadores,
                        comentario: comentario,
                        descripciontela: '',
                        idproveedor: idproveedor,
                        tipobusqueda: 'armado',
                        idanalisistextil: '0',
                        data_keytablainputfile: '',
                        estadofoto: '',
                        confotosinfoto: ''
                    };

                lstdetail.push(obj);
            });

            return lstdetail;
        }

        function getobj_array_foto_descripcion_edit() {
            let arr_div_foto = Array.from(_('div_contenedordetalle_fotos_descripcion').getElementsByClassName('cls_div_foto_descripcion')), arr_fotos_existentes = [],
                objreturn = {}, arr_fotos_nuevas = [];

            if (arr_div_foto.length > 0) {
                arr_div_foto.forEach(x => {
                    let datapar = x.getAttribute('data-par'), estadofoto = x.getAttribute('data-estadofoto'), clasegenerada = x.getAttribute('data-nombreclasegenerada');
                    if (datapar !== '') {
                        let imagenoriginalcolgador = _par(datapar, 'imagenoriginalcolgador'), imagenwebcolgador = _par(datapar, 'imagenwebcolgador'),
                            obj = { imagenoriginalcolgador: imagenoriginalcolgador, imagenwebcolgador: imagenwebcolgador };

                        arr_fotos_existentes.push(obj);
                    }

                    if (estadofoto === 'new') {
                        let obj_new = { key_value: clasegenerada }
                        arr_fotos_nuevas.push(obj_new);
                    }
                });
            } 

            objreturn.arr_fotos_existentes = arr_fotos_existentes;
            objreturn.arr_fotos_new = arr_fotos_nuevas;

            return objreturn;
        }

        function res_ini(odata) {
            let proveedores = odata[0].proveedores !== '' ? CSVtoJSON(odata[0].proveedores) : [],
                clientes = odata[0].clientes !== '' ? CSVtoJSON(odata[0].clientes) : [], opt_clientes = _comboDataListFromJSON(clientes, 'idcliente', 'nombrecliente'),
                ddlcliente = _('ddl_cliente');

            ovariables.lstproveedor = proveedores;
            ddlcliente.innerHTML = opt_clientes;
        }

        function req_ini() {
            let txtpar = _('txtpar_new').value, url = '',
                parametro = '';

            switch (ovariables.accion) {
                case 'new':
                    url = 'DesarrolloTextil/SolicitudColgador/GetData?par=' + ovariables.idgrupocomercial;
                    _Get(url)
                        .then((data) => {
                            let odata = data !== '' ? JSON.parse(data) : null;
                            if (odata !== null) {
                                res_ini(odata);
                            }

                        });
                    break
                case 'edit':
                    parametro = { idsolicitud: ovariables.idsolicitud, idgrupopersonal: ovariables.idgrupocomercial };
                    url = 'DesarrolloTextil/SolicitudColgador/GetData_Edit?par=' + JSON.stringify(parametro);
                    _Get(url)
                        .then((data) => {
                            let odata = data !== '' ? JSON.parse(data) : null;
                            if (odata !== null) {
                                res_ini_edit(odata);
                            }

                        });
                    break;
            }
            
        }

        function res_ini_edit(odata) {
            let proveedores = odata[0].proveedores !== '' ? CSVtoJSON(odata[0].proveedores) : [],
                clientes = odata[0].clientes !== '' ? CSVtoJSON(odata[0].clientes) : [], opt_clientes = _comboDataListFromJSON(clientes, 'idcliente', 'nombrecliente'),
                ddlcliente = _('ddl_cliente'), solicitud = odata[0].solicitud !== '' ? CSVtoJSON(odata[0].solicitud) : null, txt_Cliente = _('txtIdCliente'),
                ddl_cliente = _('ddl_cliente'), fotos_descripcion_json = solicitud !== null ? solicitud[0].imagenescolgadoresparadescripcion_json : '';

            ovariables.lstproveedor = proveedores;
            ddlcliente.innerHTML = opt_clientes;

            if (solicitud) {
                _('_title').innerText = 'Solicitud #' + solicitud[0].idsolicitud;
                _('txtnrosolicitud').value = solicitud[0].idsolicitud;
                _setValueDataList(solicitud[0].idcliente, ddl_cliente, txt_Cliente)
                _('txta_comentario').value = solicitud[0].comentario;
                _('txta_buscar_por_descripcion').value = solicitud[0].descripciontela;
            }

            fn_llenartablas_ini_edit(odata);
            fn_pintarfotos_descripcion_ini(fotos_descripcion_json);
        }

        function fn_pintarfotos_descripcion_ini(cadena_json_fotos_descripcion) {
            if (cadena_json_fotos_descripcion !== '') {
                let odata = JSON.parse(cadena_json_fotos_descripcion), html = '', div_contenedor_foto = _('div_contenedordetalle_fotos_descripcion');
                odata.forEach(x => {
                    //// /Content/upload/
                    let numero_aleatorio = Math.floor(Math.random() * 100), clase_generada = 'cls_foto_descripcion_' + numero_aleatorio,
                        rutafoto = 'http://wts-fileserver/erp/textileanalysis/SolicitudColgador/FotosColgador/' + x.imagenwebcolgador;
                    html += `
                        <div class="col-sm col-sm-1 cls_div_foto_descripcion ${clase_generada}" data-nombreclasegenerada='${clase_generada}' data-par='imagenoriginalcolgador:${x.imagenoriginalcolgador},imagenwebcolgador:${x.imagenwebcolgador}' data-estadofoto='edit'>
                            <img src="${ rutafoto }" class="img-responsive" style="width:90px; height:80px;">
                            <span type='button' class='btn btn-xs btn-danger fa fa-times cls_btn_delete_foto'></span>
                            <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto'></span>
                        </div>
                    `;
                });

                div_contenedor_foto.innerHTML = html;
                handler_foto_descripcion_ini();
            }
        }

        function handler_foto_descripcion_ini() {
            let div_contenedor_foto = _('div_contenedordetalle_fotos_descripcion'), arr_divs = Array.from(div_contenedor_foto.getElementsByClassName('cls_div_foto_descripcion'));

            arr_divs.forEach(x => {
                x.getElementsByClassName('cls_btn_delete_foto')[0].addEventListener('click', fn_delete_foto_descripcion, false);
                x.getElementsByClassName('cls_btn_ver_foto')[0].addEventListener('click', fn_verfoto_descripcion, false);
            });
        }

        function fn_llenartablas_ini_edit(odata) {
            let solicitud_detalle = odata[0].solicitud_detalle !== '' ? CSVtoJSON(odata[0].solicitud_detalle) : null,
                html = '', tbody = _('tbody_codigotela');

            if (solicitud_detalle) {
                let busqueda_x_codigotela = solicitud_detalle.filter(x => x.tipobusqueda === 'codigotela'),
                    armado_colgadores = solicitud_detalle.filter(x => x.tipobusqueda === 'armado');

                if (busqueda_x_codigotela.length > 0) {
                    busqueda_x_codigotela.forEach(x => {
                        //let ruta_imagen = x.imagenwebcolgador !== '' ? '/Content/upload/' + x.imagenwebcolgador : '//WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg';
                        let ruta_imagen = x.imagenwebcolgador !== '' ? 'http://wts-fileserver/erp/textileanalysis/SolicitudColgador/FotosColgador/' + x.imagenwebcolgador : 'http://WTS-FILESERVER/erp/style/thumbnail/SinImagen.jpg';
                        
                        html += `
                            <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idanalisistextil:${x.idanalisistextil}'>
                                <td class='text-center' style='vertical-align: middle;'>
                                    <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td class='cls_td_imagencolgador'>
                                    <div style='width:100%;'>
                                        <img class='img-thumbnail cls_img_imagen_colgador' src='${ruta_imagen}' width='100' height='80'/>
                                        <span type='button' class='btn btn-xs btn-primary fa fa-plus-circle btn-file cls_btn_add_foto'>
                                            <input type='file' class='cls_inputfile_add_foto' accept='image/*' />
                                        </span>
                                        <span type='button' class='btn btn-xs btn-danger fa fa-times cls_btn_delete_foto'></span>
                                        <span type='button' class='btn btn-xs btn-success fa fa-eye cls_btn_ver_foto'></span>
                                    </div>
                                </td>
                                <td class='cls_td_codigotela'>
                                    ${x.codigotela}
                                </td>
                                <td class='cls_td_nombretela'>
                                    ${x.descripciontela}
                                </td>
                            </tr>
                        `;
                    });

                    //// LO SAQUE YA NO ES NECESARIO COTIZAR TELA
                    //<td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //    <label>
                    //        <div class="icheckbox_square-green _div_chkcotizar _div_chkcotizar_tbl_codigotela" style="position: relative;">
                    //            <div class="icheckbox_square-green" style="position: relative;">
                    //                <input type="checkbox" class="i-checks _chkcotizar _chkcotizar_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //        </div>
                    //    </label>
                    //</td>
                    //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //        <label>
                    //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_muestra_tbl_codigotela" style="position: relative;">
                    //                <div class="icheckbox_square-green" style="position: relative;">
                    //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_muestra_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //            </div>
                    //        </label>
                    //    </td>
                    //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //        <label>
                    //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_produccion_tbl_codigotela" style="position: relative;">
                    //                <div class="icheckbox_square-green" style="position: relative;">
                    //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_produccion_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //            </div>
                    //        </label>
                    //    </td>

                    tbody.innerHTML = html;
                    handler_tbl_codigotela_ini_edit();
                }

                if (armado_colgadores.length > 0) {
                    html = '';
                    armado_colgadores.forEach((x, indice) => {
                        html += `
                            <tr data-par='idcolgadorsolicituddetalle:${x.idcolgadorsolicituddetalle},idproveedor:${x.idproveedor}'>
                                <td class='text-center' style='vertical-align: middle;'>
                                    <button type='button' class='btn btn-xs cls_btn_delete btn-danger'>
                                        <span class='fa fa-trash-o'></span>
                                    </button>
                                </td>
                                <td>
                                    <input type='text' class='cls_proveedor form-control' list='dl_proveedor_${indice}' />
                                    <datalist id='dl_proveedor_${indice}' class='cls_dl_proveedor'></datalist>
                                    <span class='hide has-error cls_error_proveedor'>Falta seleccioar el proveedor</span>
                                </td>
                                <td>
                                    <input type='text' class='cls_txt_cantidad form-control' value='${x.nrocolgadores}' />
                                    <span class='hide has-error cls_error_cantidad'>Falta el nro de colgadores</span>
                                </td>
                                <td>
                                    <textarea class='cls_txta_comentario form-control' rows=2>${x.comentario}</textarea>
                                </td>
                            </tr>
                    `;
                    });

                    //// LO SAQUE YA NO ES NECESARIO COTIZAR TELA
                    //<td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //    <label>
                    //        <div class="icheckbox_square-green _div_chkcotizar _div_chkcotizar_tbl_codigotela" style="position: relative;">
                    //            <div class="icheckbox_square-green" style="position: relative;">
                    //                <input type="checkbox" class="i-checks _chkcotizar _chkcotizar_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //        </div>
                    //    </label>
                    //</td>
                    //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //        <label>
                    //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_muestra_tbl_codigotela" style="position: relative;">
                    //                <div class="icheckbox_square-green" style="position: relative;">
                    //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_muestra_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //            </div>
                    //        </label>
                    //    </td>
                    //    <td class='text-center' data-info='PARA EL MOCKUP DE COTIZACION' style='vertical-align: middle;'>
                    //        <label>
                    //            <div class="icheckbox_square-green _div_chkmodalidad _div_chkmodalidad_produccion_tbl_codigotela" style="position: relative;">
                    //                <div class="icheckbox_square-green" style="position: relative;">
                    //                    <input type="checkbox" class="i-checks _chkmodalidad _chkmodalidad_produccion_tbl_codigotela" style="position: absolute; opacity: 0;" /><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div>&nbsp;
                    //                        <ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0"></ins>
                    //            </div>
                    //        </label>
                    //    </td>

                    _('tbody_armadocolgadores').innerHTML = html;
                    handler_tela_armadocolgador_ini_edit();
                }
            }
        }

        function handler_tbl_codigotela_ini_edit() {
            let tbody = _('tbody_codigotela'), arr_btn_delete_codigotela = Array.from(tbody.getElementsByClassName('cls_btn_delete')),
                arrfilas = Array.from(_('tbody_codigotela').rows);

            arr_btn_delete_codigotela.forEach(x => x.addEventListener('click', e => { fn_delete_codigotelawts(e); }));

            arrfilas.forEach((x, indicefila) => {
                x.getElementsByClassName('cls_inputfile_add_foto')[0].addEventListener('change', function(e) { let o = e.target; fn_add_foto_colgador_x_item_tabla(o, 'tbody_codigotela', indicefila); }, false);
                x.getElementsByClassName('cls_btn_delete_foto')[0].addEventListener('click', fn_delete_foto_colgador_x_item_tabla, false);
                x.getElementsByClassName('cls_btn_ver_foto')[0].addEventListener('click', fn_verfoto_x_item_tabla, false);
            });
        }

        function fn_verfoto_x_item_tabla(e) {
            let o = e.currentTarget, div_img = o.parentNode, img = div_img.getElementsByClassName('cls_img_imagen_colgador')[0], src = img.getAttribute('src'),
                width = 900, height = 403, width_img = '', height_img = '';

            if (screen.width === 800 && screen.height === 600) {
                width = 900;
                height = 450;
                width_img = 550;
                height_img = 260;
            } else if (screen.width === 1024 && screen.height === 768) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1152 && screen.height === 864) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 420;
            } else if (screen.width === 1280 && screen.height === 600) {
                width = 700;
                height = 400;
                width_img = 600;
                height_img = 230;
            } else if (screen.width === 1280 && screen.height === 720) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 768) {
                width = 700;
                height = 500;
                width_img = 600;
                height_img = 330;
            } else if (screen.width === 1280 && screen.height === 800) {
                width = 700;
                height = 600;
                width_img = 600;
                height_img = 430;
            } else if (screen.width === 1280 && screen.height === 960) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1280 && screen.height === 1024) {
                width = 700;
                height = 700;
                width_img = 600;
                height_img = 530;
            } else if (screen.width === 1360 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1366 && screen.height === 768) {
                width = 700;
                height = 750;
                width_img = 600;
                height_img = 360;
            } else if (screen.width === 1400 && screen.height === 1050) {
                width = 800;
                height = 800;
                width_img = 700;
                height_img = 610;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1440 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1600 && screen.height === 900) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;

            } else if (screen.width === 1680 && screen.height === 1050) {
                width = 800;
                height = 700;
                width_img = 750;
                height_img = 510;
            } else if (screen.width === 1920 && screen.height === 1080) {
                width = 900;
                height = 800;
                width_img = 800;
                height_img = 630;
            }

            let par_src = _subparameterEncode(src);

            _modalBody({
                url: 'DesarrolloTextil/SolicitudColgador/_VerFotoColgador',
                ventana: '_VerFotoColgador',
                titulo: 'Ver Foto',
                parametro: `src:${par_src},width_img:${width_img},height_img:${height_img}`,
                ancho: width,
                alto: height,
                responsive: 'modal-lg'
            });
        }

        function returnIndex() {
            let url = 'DesarrolloTextil/Solicitud/Index'
            ruteo_bandejamodelo_correo(url, ovariables.idsolicitud, 'divcontenedor_breadcrum');
        }

        return {
            load: load,
            req_ini: req_ini,
            llenartabla_codigotela_new: llenartabla_codigotela_new,
            validar_antes_agregar_tela: validar_antes_agregar_tela
        }
    }
)(document, 'panelEncabezado_solicitudcolgador');

(
    function init() {
        appSolicitudColgador.load();
        appSolicitudColgador.req_ini();
    }
)();
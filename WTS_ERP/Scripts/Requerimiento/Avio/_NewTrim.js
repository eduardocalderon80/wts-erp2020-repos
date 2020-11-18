var app_NewTrim = (
    (d, idpadre) => {

        let ovariables = {
            id: 0,
            idavios: 0,
            accion: '',
            idcliente: parseInt(appStages.ovariables.idcliente),
            idprograma: appStages.ovariables.id,
            actualizarimagen: 0,
            codfase: 'DV',
            ListaTipoClienteFabricTrimCSV: [],
            ListaTipoProveedorCsv: [],
            ListaProveedorCsv: [],
            ListaEstadoCsv: [],
            ListaCategoriaEstadoCsv: [],
            ListaTipoTrimCsv: [],
            ListaTipoRequirementCsv: [],
            ListContact: [],
            ListRegistros: [],
            ListaStyles: [],
            ListaStylesCodes: [],
            ListaStyleCodeCsv: [],
            ListaAvios: [],
            tmpCboTipoFile: '',
            detailtrim: 0,
            rutaFileServer: '',
            codfase: appStages.ovariables.codfase,
            TipoSolicitud: 'SE',          
            IdRequerimientoPadre:0,
            IdRequerimientoCopia: 0
        }

          let load = () => {
            // Disable autocomplete by default
            _disableAutoComplete();
            // Events
            //[...document.querySelectorAll('input[name="detail_trim"]')].forEach(x => {
            //    x.addEventListener('click', fn_click_radio);
            //});
            _('btnTrimStyleCode').addEventListener("click", changeStyleCode);
            _("btnSaveSummary").addEventListener("click", guardarRequerimientoAvios);

            // Plugins
            $(".scroll-fieldset5").slimScroll({
                height: '380px',
                width: '100%',
                railOpacity: 0.9,
                alwaysVisible: true, // enables always-on mode for the scrollbar
                railVisible: true,
                railColor: '#333',// sets rail color
                railOpacity: 0.2,// sets rail opacity
                railDraggable: true,// whether  we should use jQuery UI Draggable to enable bar dragging
                railClass: 'slimScrollRail',// defautlt CSS class of the slimscroll rail
            });
            $(".scroll-fieldset4").slimScroll({
                height: '110px',
                width: '100%',
                railOpacity: 0.9
            });
            $(".scroll-fieldset2").slimScroll({
                height: '90px',
                width: '100%',
                railOpacity: 0.9
            });
            $(".scroll-fieldset3").slimScroll({
                height: '110px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#scrollSummary').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#div_tbl_files_trim').slimScroll({
                height: '430px',
                width: '100%',
                railOpacity: 0.9,
                alwaysVisible: true, // enables always-on mode for the scrollbar
                railVisible: true,
                railColor: '#333',// sets rail color
                railOpacity: 0.2,// sets rail opacity
                railDraggable: true,// whether  we should use jQuery UI Draggable to enable bar dragging
                railClass: 'slimScrollRail',// defautlt CSS class of the slimscroll rail
            });
            $('.feed-activity-list').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            // Summernote
            $(".summernote").summernote({
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    //['table', ['table']],
                    //['insert', ['link', 'picture', 'hr']],
                    //['view', ['fullscreen', 'codeview']],
                    //['help', ['help']]
                ]
            });

            //let elem = document.querySelector('.js-switch');
            //let switchery = new Switchery(elem, { color: '#1AB394', className: 'switchery', size: 'small', secondaryColor: '#fC73d0' });

            //$(".js-switch").on("change", function () {
            //    if ($(this).is(":checked")) {
            //        $(".sw-check").attr("style", "font-weight:bolder;text-decoration:underline;");
            //        $(".sw-uncheck").attr("style", "font-weight:normal;");
            //    } else {
            //        $(".sw-uncheck").attr("style", "font-weight:bolder;text-decoration:underline;");
            //        $(".sw-check").attr("style", "font-weight:normal;");
            //    }
            //});

            // Select2 multiple para combos
            $("#cboCorreosTrim").select2({
                width: '100%'
            });

            //$("#chkWtsCliStyleCode.js-switch").on("change", function () {
            //    if ($(this).is(":checked")) {
            //        $("#lblWtsCliStyleCode").text("WTS Style Code");
            //        $("#txtTrimStyleCode").attr("placeholder", "WTS Style Code");
            //    } else {
            //        $("#lblWtsCliStyleCode").text("Client Style Code");
            //        $("#txtTrimStyleCode").attr("placeholder", "Client Style Code");
            //    }
            //});

            $("input[id='radio1']").on("change", function () {
                if ($(this).is(":checked")) {
                    //$(".tabtrim-content2").removeClass("hide");
                    ovariables.detailtrim = 1;
                    $("#txtTrimCode").removeAttr("disabled").removeClass("disabled");
                    $("#txtTrimDes").removeAttr("disabled").removeClass("disabled");
                    $("#cboTrimType").removeAttr("disabled").removeClass("disabled");
                    $("#txtTrimLeadtime").removeAttr("disabled").removeClass("disabled");
                    $("#txtTrimMinima").removeAttr("disabled").removeClass("disabled");
                }
            });
            $("input[id='radio2']").on("change", function () {
                if ($(this).is(":checked")) {
                    //$(".tabtrim-content2").addClass("hide");
                    ovariables.detailtrim = 0;

                    $("#txtTrimCode").attr("disabled", "disabled").addClass("disabled");
                    $("#txtTrimDes").attr("disabled", "disabled").addClass("disabled");
                    $("#cboTrimType").attr("disabled", "disabled").addClass("disabled");
                    $("#txtTrimLeadtime").attr("disabled", "disabled").addClass("disabled");
                    $("#txtTrimMinima").attr("disabled", "disabled").addClass("disabled");
                    
                    _("txtTrimDes").value = '';
                    _("txtTrimLeadtime").value = '';
                    _("txtTrimMinima").value = '';
                    _("cboTrimType").selectedIndex = "0";

                }
            });

            $("input[id='radio2']").trigger("change");
            $("input[id='radio2']").trigger("click");

            const par = _('trim_txtpar').value;
            if (!_isEmpty(par)) {

                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                _('IdAvios').value = ovariables.id !== 0 ? ovariables.id : 0;
                ovariables.accion = _par(par, 'accion');
                if (ovariables.accion === 'edit' || ovariables.accion === 'copy') {
                    _('btnSaveSummary').innerHTML = `<span class="fa fa-save"></span> Update`;
                    ovariables.rutaFileServer = _('rutaFileServerAv').value;
                    if (ovariables.accion === 'copy') {
                        ovariables.IdRequerimientoCopia = ovariables.id;
                        ovariables.TipoSolicitud = "CO";
                        
                    }
                }
            }

            loadimage();
            loadFileRequerimentoAvio();
            //loadFileRequerimentoAvioSummary();
        }

        /********************************************************************************************************************
        * function:fn_search, esta funcion no se usa
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let fn_search = (e) => {
            const classname = e.getAttribute("class");
            const input = e.parentElement.previousElementSibling.children[0];
            if (classname === 'btn btn-primary') {
                e.innerHTML = `<span class="fa fa-eraser"></span>`;
                e.classList.remove('btn-primary');
                e.classList.add('btn-danger');
                input.setAttribute('disabled', 'disabled');
            } else {
                e.innerHTML = `<span class="fa fa-search"></span>`;
                e.classList.remove('btn-danger');
                e.classList.add('btn-primary');
                input.removeAttribute('disabled');
            }
        }

        /********************************************************************************************************************
        * function:fn_search_description, esta funcion no se usa
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let fn_search_description = () => {
            _modalBody_Backdrop({
                url: 'Requerimiento/Avio/_AddDescription',
                idmodal: 'AddDescription',
                paremeter: `id:0,accion:newdescription`,
                title: 'Add Descriptions',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false
            });
        }

        /********************************************************************************************************************
        * function:fn_click_radio, esta funcion no se usa
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let fn_click_radio = (e) => {
            const radio = e.currentTarget;
            const id = radio.getAttribute("id");
            if (id === 'radio1') {
                //[...document.getElementsByClassName('hide-trim-no')].forEach(x => {
                //    x.style = "display: none;";
                //});
                //[...document.getElementsByClassName('hide-trim-yes')].forEach(x => {
                //    x.style = "";
                //});                
            } else {
                //[...document.getElementsByClassName('hide-trim-yes')].forEach(x => {
                //    x.style = "display: none;";
                //});
                //[...document.getElementsByClassName('hide-trim-no')].forEach(x => {
                //    x.style = "";
                //});                
            }
        }
        /********************************************************************************************************************
        * function:req_ini, funcion que carga al inicio, cargara la data  si el REQ es nuevo o es para edicion
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let req_ini = () => {
            let err = (__err) => { console.log('err', __err) },
                parametro = { idsolicitud: ovariables.id };

            if (ovariables.accion === "edit" || ovariables.accion === 'copy') {
                let parametro = {
                    IdRequerimiento: ovariables.id,
                    IdCliente: ovariables.idcliente,
                    TipoSolicitud: ovariables.TipoSolicitud
                };
                _Get('Requerimiento/Avio/GetAvioLoadNew_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.id = ovariables.accion === 'copy' ? 0 : ovariables.id;
                            ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                            ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                            ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : [];
                            ovariables.ListaTipoTrimCsv = rpta.ListaTipoTrimCsv !== '' ? CSVtoJSON(rpta.ListaTipoTrimCsv) : [];
                            ovariables.ListaEstadoCsv = rpta.ListaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaEstadoCsv) : [];
                            ovariables.ListaCategoriaEstadoCsv = rpta.ListaCategoriaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaCategoriaEstadoCsv) : [];
                            ovariables.ListaTipoRequirementCsv = rpta.ListaTipoRequirementCsv !== '' ? CSVtoJSON(rpta.ListaTipoRequirementCsv) : [];
                            ovariables.ListaContactCsv = rpta.ListaContactCsv !== '' ? CSVtoJSON(rpta.ListaContactCsv) : [];
                            ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');


                            ovariables.IdRequerimientoPadre = rpta.IdRequerimientoPadre;
                            // Create combos                            
                            llenarComboCsv('cboTrimSupplierType', ovariables.ListaTipoProveedorCsv, 1, 0)
                            llenarComboCsv('cboTrimSupplierName', ovariables.ListaProveedorCsv, 1, 0)
                            llenarComboCsv('cboTrimStatus', ovariables.ListaCategoriaEstadoCsv, 1, 0)
                            llenarComboCsv('cboTrimType', ovariables.ListaTipoTrimCsv, 1, 0)
                            llenarComboCsv('cboTrimRequestType', ovariables.ListaTipoRequirementCsv, 1, 0)

                            let tiposolicitud_avio = rpta.TipoSolicitud;
                            if (ovariables.accion === 'copy') {
                                tiposolicitud_avio = ovariables.ListaTipoRequirementCsv.filter(x => x.descripcion.toLowerCase() === 'carry over')[0].codigo;
                            }
                            
                            // LLenar campos
                            _('cboTrimStatus').value = rpta.IdEstado;
                            _('cboTrimRequestType').value = tiposolicitud_avio; //rpta.TipoSolicitud;
                            _('cboTrimSupplierType').value = rpta.IdTipoProveedor;
                            _('cboTrimSupplierName').value = rpta.IdProveedor;
                            _('txtTrimNotes').value = rpta.Notas;
                            _('txtTrimComments').value = rpta.Comentario;
                            _('txtTrimLeadtime').value = rpta.TiempoEspera;
                            _('txtTrimMinima').value = rpta.CantidadMinima;
                            _('cboTrimType').value = rpta.TipoAvio;
                            _('txtTrimCode').value = rpta.CodigoAvio;
                            _('txtTrimDes').value = rpta.DescripcionName;
                            //_('hdnDescriptionName').value = `${rpta.DescripcionName}`;
                            //_('hdnDescriptionModel').value = `${rpta.DescripcionModel}`;
                            //_('hdnDescriptionSize').value = `${rpta.DescripcionSize}`;
                            //_('hdnDescriptionColor').value = `${rpta.DescripcionColor}`;
                            ovariables.detailtrim = rpta.DetailTrim;
                            if (ovariables.detailtrim === '1') {
                                $("input[id='radio1']").trigger("change");
                                $("input[id='radio1']").trigger("click");
                            } else {
                                $("input[id='radio2']").trigger("change");
                                $("input[id='radio2']").trigger("click");
                            }
                            // Llena foto
                            if (rpta.ImagenNombre !== '' && ovariables.accion !== 'copy') {
                                _('imgSketchTrim').src = 'http:' + `${ovariables.rutaFileServer}${rpta.ImagenNombre}`;
                            } else {
                                _('imgSketchTrim').src = 'http:' + `${ovariables.rutaFileServer}sinimagen.jpg`;
                            }

                            fn_req_correos();

                            //// Para archivos
                            //ovariables.lstarchivos = rpta.Requerimiento.ListaArchivosByIdEstiloCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaArchivosByIdEstiloCSV) : [];
                            //ovariables.lsttipoarchivo = rpta.Requerimiento.ListaTipoArchivosCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaTipoArchivosCSV) : [];

                            //// Llena tabla archivos
                            //fn_loadfiles(ovariables.lstarchivos);
                        }
                    }, (p) => { err(p); });

            } else {
                fn_mostrarheadtabs(ovariables.id);

                let parametro = { IdRequerimiento: ovariables.id, IdCliente: ovariables.idcliente, TipoSolicitud: ovariables.TipoSolicitud };
                _Get('Requerimiento/Avio/GetAvioLoadNew_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {

                            ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                            ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                            ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : [];
                            ovariables.ListaTipoTrimCsv = rpta.ListaTipoTrimCsv !== '' ? CSVtoJSON(rpta.ListaTipoTrimCsv) : [];
                            ovariables.ListaEstadoCsv = rpta.ListaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaEstadoCsv) : [];
                            ovariables.ListaCategoriaEstadoCsv = rpta.ListaCategoriaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaCategoriaEstadoCsv) : [];
                            ovariables.ListaTipoRequirementCsv = rpta.ListaTipoRequirementCsv !== '' ? CSVtoJSON(rpta.ListaTipoRequirementCsv) : [];
                            ovariables.ListaContactCsv = rpta.ListaContactCsv !== '' ? CSVtoJSON(rpta.ListaContactCsv) : [];

                            llenarComboCsv('cboTrimSupplierType', ovariables.ListaTipoProveedorCsv, 1, 0)
                            llenarComboCsv('cboTrimSupplierName', ovariables.ListaProveedorCsv, 1, 0)
                            llenarComboCsv('cboTrimStatus', ovariables.ListaCategoriaEstadoCsv, 1, 0)
                            llenarComboCsv('cboTrimType', ovariables.ListaTipoTrimCsv, 1, 0)
                            llenarComboCsv_selIndex('cboTrimRequestType', ovariables.ListaTipoRequirementCsv, 1, 0)

                            ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');

                        }
                    }, (p) => { err(p); });
            }

            //obtenerFiltros();
            listarFileRequerimiento();
            fn_getListaStyleCode();

            if (ovariables.id === 0) {
                $("label[for='inputTrimFileSummary'").attr("disabled", "disabled").addClass("disabled");
                $('#inputTrimFileSummary').attr("disabled", "disabled").addClass("disabled");

                $("label[for='inputFileRequerimientoAvio'").attr("disabled", "disabled").addClass("disabled");
                $('#inputFileRequerimientoAvio').attr("disabled", "disabled").addClass("disabled");
            }

        }
        /********************************************************************************************************************
        * function:fn_adddescriptionavio, cargar los hdn de descripcion al cargar un trim para editar
        * param  (objDescripcionAvio), obj que almacena la info a mostrar en el popup modal_AddDescription
        * return ()
        *********************************************************************************************************************/
        let fn_adddescriptionavio = (objDescripcionAvio) => {
            _("hdnDescriptionName").value = objDescripcionAvio.description_name;
            _("hdnDescriptionModel").value = objDescripcionAvio.description_model;
            _("hdnDescriptionSize").value = objDescripcionAvio.description_size;
            _("hdnDescriptionColor").value = objDescripcionAvio.description_color;
            _("txtTrimDes").value = `Name: ${objDescripcionAvio.description_name}\nModel: ${objDescripcionAvio.description_model}\nSize: ${objDescripcionAvio.description_size}\nColor: ${objDescripcionAvio.description_color}`;
            $("#modal_AddDescription").modal("hide");
        }

        /********************************************************************************************************************
        * function:obtenerFiltros, cargar inicial de controles en pantalla
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let obtenerFiltros = () => {

            let err = (__err) => { console.log('err', __err) };
            let parametro = { IdCliente: ovariables.idcliente };

            _Get('Requerimiento/Avio/GetAvioLoadNew_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {

                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        ovariables.ListaTipoClienteFabricTrimCSV = rpta.ListaTipoClienteFabricTrimCSV !== '' ? CSVtoJSON(rpta.ListaTipoClienteFabricTrimCSV) : [];
                        ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                        ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                        ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : [];
                        ovariables.ListaTipoTrimCsv = rpta.ListaTipoTrimCsv !== '' ? CSVtoJSON(rpta.ListaTipoTrimCsv) : [];
                        ovariables.ListaEstadoCsv = rpta.ListaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaEstadoCsv) : [];
                        ovariables.ListaTipoRequirementCsv = rpta.ListaTipoRequirementCsv !== '' ? CSVtoJSON(rpta.ListaTipoRequirementCsv) : [];
                        ovariables.ListaContactCsv = rpta.ListaContactCsv !== '' ? CSVtoJSON(rpta.ListaContactCsv) : [];

                        llenarComboCsv('cboTrimRequestType', ovariables.ListaTipoClienteFabricTrimCSV, 1, 0)
                        llenarComboCsv('cboTrimSupplierType', ovariables.ListaTipoProveedorCsv, 0, 0)
                        llenarComboCsv('cboTrimSupplierName', ovariables.ListaProveedorCsv, 0, 0)
                        llenarComboCsv('cboTrimStatus', ovariables.ListaEstadoCsv, 1, 0)
                        llenarComboCsv('cboTrimType', ovariables.ListaTipoTrimCsv, 1, 0)
                        llenarComboCsv_selIndex('cboTrimRequestType', ovariables.ListaTipoRequirementCsv, 1, 0)

                        ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                    }
                }, (p) => { err(p); });
        }

        /********************************************************************************************************************
        * function:llenarComboCsv, llena de manera generica cualquier control select
        * param  (select html control, arraydatos)
        * return ()
        *********************************************************************************************************************/
        let llenarComboCsv = (control, listCsv) => {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;
        }

        let llenarComboCsv_selIndex = (control, listCsv, indexsel = 0) => {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;
            if (cbolist.length > 0) {
                _(control).selectedIndex = `${indexsel}`;
            }
        }

        //FUNCIONALIDAD FILE REQUERIMIENTO:INICIO
        /********************************************************************************************************************
        * function:InicializarTablaFile, inicializa el pluggin DataTable en la tabla HTML #tbl_files_trim
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let InicializarTablaFile = () => {
            $("#tbl_files_trim").DataTable({
                info: false,
                lengthChange: false,
                ordering: true,
                //order: [1, 'asc'],
                paging: false,
                searching: false
            });
        }
        /********************************************************************************************************************
        * function:loadFileRequerimentoAvio, inicializa el fileUploadcontrol #inputFileRequerimientoAvio en su evento onchange
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let loadFileRequerimentoAvio = () => {
            _('inputFileRequerimientoAvio').onchange = function () {
              
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'pdf':
                    case 'doc':
                    case 'docx':
                    case 'txt':
                        guardarFileRequerimientoAvio(this);
                        break;
                    default:
                        swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                        input.value = '';
                }
            }
        }
        /********************************************************************************************************************
        * function:guardarFileRequerimientoAvio, guarda en BD los archivos seleccionados en el fileupload #inputFileRequerimientoAvio
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let guardarFileRequerimientoAvio = () => {
            let err = function (__err) { console.log('err', __err) }
            let IdRequerimiento = ovariables.id;
            let IdFile = '0';

            let objFileRequerimientoAvio = {
                IdRequerimiento: IdRequerimiento,
                IdFile: IdFile
            }

            let frm = new FormData();

            frm.append('requerimientoAvioJSON', JSON.stringify(objFileRequerimientoAvio));
            frm.append('archivoAvio', $("#inputFileRequerimientoAvio")[0].files[0]);

            _Post('Requerimiento/Avio/SaveFileRequerimiento', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {

                        listarFileRequerimiento();
                        swal({
                            title: "Good job!",
                            text: "The file was created successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });

                        //$("#modal_NewStyle").modal("hide");

                        _('btnUpdate').click();
                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        let fn_getDataFileRequerimiento = () => {
            let arrFileRequerimientoAvio = [];
            //recorrer todas las filas de filerequerimiento
            [...document.querySelectorAll("tbody[id='tbody_files_trim'] tr:not(.row_empty)")].forEach((x) => {
                let objFileRequerimientoAvio = {
                    IdFile: x.getAttribute("data-id"),
                    IdFileTipo: x.children[3].querySelectorAll("select")[0].value
                }
                arrFileRequerimientoAvio.push(objFileRequerimientoAvio);
            });
            return arrFileRequerimientoAvio;
        }

        /********************************************************************************************************************
        * function:updateFileRequerimientoAvio, actualiza en BD los tipos de los archivos seleccionados en el fileupload #inputFileRequerimientoAvio
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let updateFileRequerimientoAvio = () => {
            let err = function (__err) { console.log('err', __err) }
            let IdRequerimiento = ovariables.id;
            let IdFile = '0';

            let arrFileRequerimientoAvio = fn_getDataFileRequerimiento();
            if (arrFileRequerimientoAvio.length > 0) {
                let frm = new FormData();

                frm.append('requerimientoAvioJSON', JSON.stringify(arrFileRequerimientoAvio));

                _Post('Requerimiento/Avio/UpdateFileRequerimiento', frm, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {

                            listarFileRequerimiento();
                            // Doble swal
                            //swal({
                            //    title: "Good job!",
                            //    text: "The file was created successfully",
                            //    type: "success",
                            //    timer: 5000,
                            //    showCancelButton: false,
                            //    confirmButtonColor: "#1c84c6",
                            //    confirmButtonText: "OK",
                            //    closeOnConfirm: false
                            //});

                            //$("#modal_NewStyle").modal("hide");

                            _('btnUpdate').click();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            }
        }

        /********************************************************************************************************************
        * function:guardarFileRequerimientoAvio, guarda en BD los archivos seleccionados en el fileupload #inputFileRequerimientoAvio
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let listarFileRequerimiento = () => {

            dibujarTablaFile();
            let IdRequerimiento = ovariables.id;
            let IdFile = '0';
            let objRequerimientoAvio = {
                IdRequerimiento: IdRequerimiento,
                IdFile: IdFile
            }

            let frm = new FormData();
            frm.append('requerimientoAvioJSON', JSON.stringify(objRequerimientoAvio));

            _Post('Requerimiento/Avio/GetListaFileRequerimiento_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta !== null) {
                        ovariables.ListRegistros = orpta;
                        _promise()
                            .then(crearTablaFileRequerimiento(ovariables.ListRegistros))
                            .then(InicializarTablaFile())
                            .then(setearTipoFileRequerimiento(ovariables.ListRegistros))
                    } else {
                        if ($('#tbody_files_trim > tr').length === 0) {
                            $('#tbody_files_trim').append("<tr class='row_empty'><td colspan='5' class='text-center'>Not found rows.</td></tr>")
                        } else {
                            $('#tbody_files_trim').innerHTML = html;
                        }
                        //swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
        }
        /********************************************************************************************************************
        * function:dibujarTablaFile, dibuja en el html del documento una tablaHTML #tbl_files_trim, thead y tbody row_empty
        * param  ()
        * return ()
        *********************************************************************************************************************/
        let dibujarTablaFile = () => {

            document.getElementById("div_tbl_files_trim").innerHTML = "";
            document.getElementById("div_tbl_files_trim").innerHTML = `<table class="table table-hover table-bordered table-vertical" id="tbl_files_trim">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="no-sort text-center" width="6%">
                                                                                <label title="Upload image file" for="inputFileRequerimientoAvio" class="btn btn-xs btn-primary m-b-xxs">
                                                                                    <input type="file" accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.txt" id="inputFileRequerimientoAvio" style="display:none">
                                                                                    <span class="fa fa-upload"></span> Upload
                                                                                </label>
                                                                            </th>
                                                                            <th width="32%" class='text-center'>Name</th>
                                                                            <th width="20%" class='text-center'>User</th>
                                                                            <th width="22%" class='text-center'>Type</th>
                                                                            <th width="20%" class='text-center'>Upload Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="tbody_files_trim"></tbody>
                                                                </table>`;
            loadFileRequerimentoAvio();
        }
        /********************************************************************************************************************
        * function:crearTablaFileRequerimiento, carga de BD todos los registros de los archivos del requerimiento cargado
        * param  (data) , data es un array con los datos de los archivos guardados en BD
        * return ()
        *********************************************************************************************************************/
        let crearTablaFileRequerimiento = (data) => {

            const html = data.map(x => {
                return `<tr data-id="${x.IdFile}" data-req="${x.IdRequerimiento}">
                            <td class='text-center' style='width:6%'>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewTrim.deletefile(${x.IdFile},${x.IdRequerimiento})">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewTrim.downloadfile('${x.FileNombre}', '${x.FileOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.FileOriginal}</td>
                            <td class='text-center'>${_capitalizePhrase(x.UsuarioCreacion)}</td>
                            <td><select class="input-sm form-control no-borders" style="width: 100%;" id="cboTipoFile_${x.IdFile}">${ovariables.tmpCboTipoFile}</select></td>
                            <td class='text-center'>${x.FechaCreacion}</td>
                        </tr>`;
            }).join('');
            _('tbody_files_trim').innerHTML = '';
            _('tbody_files_trim').innerHTML = html;
        }
        /********************************************************************************************************************
        * function:setearTipoFileRequerimiento, despues de cargar la lista de archivos de BD en la tablaHTML #tbl_files_trim, setear
        * la columna tipo
        * param  (data) , data es un array con los datos de los archivos guardados en BD
        * return ()
        *********************************************************************************************************************/
        let setearTipoFileRequerimiento = (data) => {

            data.forEach(x => {
                _('cboTipoFile_' + x.IdFile).value = x.Tipo;
            });
        }
        /********************************************************************************************************************
        * function:downloadfile, funcion que se encarga de la descarga del archivo en la tablaHTML #tbl_files_trim
        * la columna tipo
        * param  (data) , data es un array con los datos de los archivos guardados en BD
        * return ()
        *********************************************************************************************************************/
        let downloadfile = (nombrearchivo, nombrearchivooriginal) => {

            let urlaccion = `../Requerimiento/Avio/DownLoadFile?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            window.location.href = urlaccion;
        }
        /********************************************************************************************************************
        * function:deletefile, funcion que se encarga de la eliminacion de los archivos en la tablaHTML #tbl_files_trim y de la BD
        * la columna tipo
        * param  (data) , data es un array con los datos de los archivos guardados en BD
        * return ()
        *********************************************************************************************************************/
        let deletefile = (idFile, iRequerimiento) => {
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this file",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },

                    parametro = {
                        IdFile: idFile,
                        IdRequerimiento: iRequerimiento

                    }, frm = new FormData();
                frm.append('requerimientoFileAvioJSON', JSON.stringify(parametro));
                _Post('Requerimiento/Avio/DeleteFileRequerimiento_jSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            listarFileRequerimiento();
                            swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }
        //FUNCIONALIDAD FILE REQUERIMIENTO:FIN


        //FUNCIONALIDAD DE IMAGEN:INICIO
        /********************************************************************************************************************
        * function:loadimage, funcion que inicializa el evento onchane del contriol #inputImageTrim
        * la columna tipo
        * param  () 
        * return ()
        *********************************************************************************************************************/
        let loadimage = () => {

            _('inputImageTrim').onchange = function () {

                ovariables.actualizarimagen = 1;
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                switch (ext) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                        showimage(this);
                        break;
                    default:
                        swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
                        this.value = '';
                        _('imgSketchTrim').src = '';
                }
            }

            //_('inputImageTrim').onclick = function () {
            //    document.body.onfocus = function () {
            //        if (_('inputImageTrim').value === '') {
            //            _('imgSketchTrim').src = '';
            //            swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
            //            document.body.onfocus = null;
            //        }
            //    }
            //}

            _('btnDeleteUpload').onclick = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                _('imgSketchTrim').src = '';
                _('inputImageTrim').value = '';
            }
        }
        /********************************************************************************************************************
        * function:showimage, funcion que inicializa el evento onchane del contriol #imgSketchTrim
        * la columna tipo
        * param  (input), input: control html de fileupload, que carga la imagen
        * return ()
        *********************************************************************************************************************/
        let showimage = (input) => {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('imgSketchTrim').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        //FUNCIONALIDAD DE IMAGEN: FIN

        // Summary detail trim  opcion NO : INICIO
        let InicializarTablaStyleCodeSummary = () => {
            $("#tbl_trim_stylecode").DataTable({
                info: false,
                lengthChange: false,
                ordering: true,
                //order: [1, 'asc'],
                paging: false,
                searching: false
            });
        }
        let fn_delete_stylecode = (button) => {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will delete the style link",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdGrupoAvio: id
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Avio/DeleteLinkAvioEstilo', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            swal({ title: "Good job!", text: "The link was deleted successfully", type: "success", timer: 5000 });
                            app_NewTrim.req_ini();
                        }
                    }, (p) => { err(p); });
            });
        }
        let changeStyleCode = () => {
            const idestilo = _('cboTrimStyleCode').value;
            if (idestilo !== '') {
                if ($(`tr[data-req='${idestilo}']`).length === 0) {
                    swal({
                        html: true,
                        title: "Are you sure?",
                        text: "You will link the style to this trim",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdAvio: ovariables.id,
                                IdEstilo: idestilo
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Avio/SaveLinkAvioEstilo', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The style was added successfully", type: "success", timer: 5000 });
                                    app_NewTrim.req_ini();
                                    console.log(orpta);
                                } else {
                                    swal({ title: "Unregistered Code", text: "You must enter an existing style code", type: "warning" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Code exists!", text: "The code that enter already exists", type: "warning" });
                }
            } else {
                swal({ title: "Empty code", text: "You must enter a style code", type: "warning" });
            }
        }
        //let listarStylesCodesAviosSummary = () => {
        //    dibujarTablaStyleCodeSummary();
        //    let html = ovariables.ListaStylesCodes.map((x) => {
        //        return `<tr data-par="wtsstylecode:${x.WtsStyleCode},clientstylecode:${x.ClientStyleCode},idaviostylecode:${x.IdAviosEstilo}">
        //            <td class='no-sort' style="font-size:13px!important; width:6%;">
        //                <button type="button" class="btn btn-xs btn-danger" onclick='app_NewTrim.fn_delete_stylecode(${x.IdAviosEstilo},this);'>
        //                    <i class="fa fa-trash"></i>
        //                </button>
        //            </td>
        //            <td style="font-size:13px!important;">${x.WtsStyleCode}</td>
        //            <td style="font-size:13px!important;">${x.ClientStyleCode}</td>
        //        </tr>`}).join('');

        //    _("tbody_trim_stylecode").innerHTML = '';
        //    if (ovariables.ListaStylesCodes.length === 0) {
        //        _("tbody_trim_stylecode").innerHTML = `<tr class='row_empty'><td colspan='3' style='font-size:13px!important;'> Not found rows.</td></tr>`;
        //    } else {
        //        _("tbody_trim_stylecode").innerHTML = html;
        //    }

        //}
        let listarCodigosEstilo = () => {
            const arr = ovariables.ListaStylesCodes;
            if (arr !== null) {
                _('cboTrimStyleCode').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(arr, 'IdRequerimiento', 'Codigo');
            }
        }
        let listarEstilosTabla = () => {
            const arr = ovariables.ListaStyles;

            // INNER TABLE
            _('div_tbl_trim_stylecode').innerHTML = `<table class="table table-vertical-center table-hover table-bordered" id="tbl_trim_stylecode" style="font-size:13px!important">
                                                        <thead>
                                                            <tr>
                                                                <th class="no-sort text-center" width="6%"></th>
                                                                <th class="text-center" style="font-size:13px!important">WTS Style Code</th>
                                                                <th class="text-center" style="font-size:13px!important">Client Style Code</th>
                                                                <th class="text-center" style="font-size:13px!important">Supplier Type</th>
                                                                <th class="text-center" style="font-size:13px!important">Supplier Name</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="tbody_trim_stylecode" style="font-size:13px!important"></tbody>
                                                    </table>`;

            if (arr !== null) {
                const html = arr.map((x) => {
                    return `<tr data-id="${x.IdGrupoAvio}" data-req="${x.IdRequerimiento}">
                                <td class='no-sort' style="font-size:13px!important; width:6%;">
                                    <button type="button" class="btn btn-xs btn-danger" onclick='app_NewTrim.fn_delete_stylecode(this);'>
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td style="font-size:13px!important;">${x.CodigoWTS}</td>
                                <td style="font-size:13px!important;">${x.CodigoEstilo}</td>
                                <td style="font-size:13px!important;">${x.TipoProveedor}</td>
                                <td style="font-size:13px!important;">${x.NombreProveedor}</td>
                            </tr>`}).join('');
                _("tbody_trim_stylecode").innerHTML = html;
            }
        }
        let fn_getListaStyleCode = () => {
            let objStyleAvio = {
                IdRequerimiento: ovariables.id
            }

            let frm = new FormData();
            frm.append('StyleCodeAvioJSON', JSON.stringify(objStyleAvio));

            _Post('Requerimiento/Avio/GetListaStyleCodeAvio_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta !== null) {
                        ovariables.ListaStylesCodes = orpta.LstCodigos !== '' ? JSON.parse(orpta.LstCodigos) : null;
                        ovariables.ListaStyles = orpta.LstEstilos !== '' ? JSON.parse(orpta.LstEstilos) : null;
                        _promise()
                            .then(listarCodigosEstilo())
                            .then(listarEstilosTabla())
                            .then(InicializarTablaStyleCodeSummary());
                    }
                    //console.log(orpta);
                }, (p) => { err(p); });
        }
        //let fn_getDataStyleCodes = () => {
        //    let listaStylesCodes = [];
        //    [...document.querySelectorAll('tbody[id="tbody_trim_stylecode"] tr:not(.row_empty)')].forEach(x => {
        //        let wtsstylecode = _par($(x).attr("data-par"), "wtsstylecode");
        //        let clientstylecode = _par($(x).attr("data-par"), "clientstylecode")
        //        let accion = _par($(x).attr("data-par"), "idaviostylecode")

        //        let objStylesCodes = {
        //            WtsStyleCode: wtsstylecode,
        //            ClientStyleCode: clientstylecode,
        //            IdAvioStyleCode: accion
        //        }
        //        listaStylesCodes.push(objStylesCodes);
        //    });
        //    return JSON.stringify(listaStylesCodes);
        //}
        // Summary detail trim  opcion NO : FIN

        let guardarRequerimientoAvios = () => {
            const req_enty = _required_arrayid({ id: '#panelEncabezado_NewTrim', array: ['#cboTrimSupplierType', '#cboTrimSupplierName'] });
            if (req_enty) {
                const _json = _getParameter({ clase: '_enty_grabar', id: 'panelEncabezado_NewTrim' });

                const parametro_detailtrim = {
                    DetailTrim: ($("input[id='radio1']").is(":checked")) ? 1 : 0
                }

                let objRequerimientoAvio = {
                    IdRequerimientoAvio: ovariables.id,
                    IdCliente: ovariables.idcliente,
                    IdPrograma: ovariables.idprograma,
                    DetailTrim: parametro_detailtrim.DetailTrim,
                    InputImageTrim: _json.inputImageTrim,
                    ActualizarImagen: ovariables.actualizarimagen,
                    TipoSolicitud: _json.TipoSolicitudAvio,
                    TipoAvio: _json.TipoAvio,
                    AvioCodigoWTS: _json.AvioCodigoWTS,
                    DescripcionName: _json.DescripcionAvio,
                    Notes: _json.NotesAvio,
                    IdTipoProveedor: _json.IdTipoProveedorAvio,
                    IdProveedor: _json.IdProveedorAvio,
                    Contacto: _json.ContactoAvio,
                    TiempoEspera: _json.TiempoEsperaAvio,
                    Minima: _json.MinimaAvio,
                    Comentario: _json.ComentarioAvio,
                    IdEstado: _json.IdEstadoAvio,
                    ListaStyleCode: '',
                    CodFase: ovariables.codfase,
                    Accion: ovariables.accion,
                    IdRequerimientoPadre :ovariables.IdRequerimientoPadre, 
                    IdRequerimientoCopia: ovariables.IdRequerimientoCopia
                }

                let frm = new FormData();
                frm.append('requerimientoAvioJSON', JSON.stringify(objRequerimientoAvio));
                frm.append('ImagenTrim', $("#inputImageTrim")[0].files[0]);

                _Post('Requerimiento/Avio/SaveRequerimientoAvio_JSON', frm, true)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            ovariables.id = orpta.id;
                            _('IdAvios').value = orpta.id;

                            fn_mostrarheadtabs(ovariables.id);
                            fn_habilitaruploadfile(ovariables.id);
                            fn_getListaStyleCode();

                            swal({
                                title: "Good job!",
                                text: "The style was created successfully",
                                type: "success",
                                timer: 5000,
                                showCancelButton: false,
                                confirmButtonColor: "#1c84c6",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });

                            //$("#modal_NewStyle").modal("hide");
                            _('btnUpdate').click();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
                ovariables.actualizarimagen = 0;

                if (ovariables.id > 0) {
                    updateFileRequerimientoAvio();
                }
            }
        }

        let fn_habilitaruploadfile = (id) => {
            if (id !== 0) {
                $("label[for='inputFileRequerimientoAvio'").removeAttr("disabled").removeClass("disabled");
                $('#inputFileRequerimientoAvio').removeAttr("disabled").removeClass("disabled");
            }
        }

        let fn_mostrarheadtabs = (id) => {
            if (id === 0) {
                $("#head-tabtrim-2").addClass("hide");
                $("#head-tabtrim-3").addClass("hide");
                $("#head-tabtrim-4").addClass("hide");
            } else {
                $("#head-tabtrim-2").removeClass("hide");
                $("#head-tabtrim-3").removeClass("hide");
                $("#head-tabtrim-4").removeClass("hide");
            }
        }

        let fn_supplier = (data) => {
            const cboData = data.map(x => {
                return `<option value="${x.IdProveedor}">${_capitalizePhrase(x.NombreProveedor)}</option>`
            }).join('');
            _('txtTrimSupplierName').innerHTML = `${cboData}`;
            _('txtTrimSupplierName2').innerHTML = `${cboData}`;
        }
        let fn_suppliertype = (data) => {
            const cboData = data.map(x => {
                return `<option value="${x.IdTipoProveedor}">${_capitalizePhrase(x.NombreTipoProveedorIngles)}</option>`
            }).join('');
            _('cboTrimSupplierType').innerHTML = `${cboData}`;
            _('cboTrimSupplierType2').innerHTML = `${cboData}`;
        }
        let fn_createreqtype = (data) => {
            const cboData = data.map(x => {
                return `<option value="${x.IdCatalogo}">${_capitalizePhrase(x.NombreCatalogo)}</option>`
            }).join('');
            _('cboTrimRequestType').innerHTML = `${cboData}`;
        }
        let fn_createstatus = (data) => {
            const cboData = data.map(x => {
                return `<option value="${x.ValorEstado}">${_capitalizePhrase(x.NombreEstado)}</option>`
            }).join('');
            _('cboTrimStatus').innerHTML = `${cboData}`;
            _('cboTrimStatus2').innerHTML = `${cboData}`;
        }

        let fn_reglascampo_RQStatus = () => {
            if (ovariables.id === 0) {
                $document
            }
        }

        /* CORREOS LISTAR BANDEJA AVIO */
        function fn_req_correos() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdRequerimiento: ovariables.id };
            _Get('Requerimiento/Programa/GetCorreoReq?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcorreos = rpta;
                        fn_create_mailbox(ovariables.lstcorreos);
                    }
                }, (p) => { err(p); });
        }

        function fn_create_mailbox(data) {
            if (data.length > 0) {
                const mail_header = _('mailbox_header_avio');
                const html = data.map(x => {
                    return `<div class="feed-element feed-cursor" data-id="${x.IdBandeja}" onclick="app_NewTrim.fn_load_mail(this)">
                                <div class="media-body">
                                    <strong>${_capitalizePhrase(x.NombreUsuario)}</strong> send a new email. <br>
                                    <strong>Subject</strong>: ${x.Titulo} <br>
                                    <small class="text-muted">${x.FechaRegistro}</small>
                                </div>
                            </div>`;
                }).join("");
                mail_header.innerHTML = html;
            }
        }

        function fn_load_mail(button) {
            const id = button.getAttribute("data-id");
            if (id !== "" && id !== null) {
                const mail_body = _('mailbox_body_avio');
                const filter = ovariables.lstcorreos.filter(x => x.IdBandeja === _parseInt(id))[0];
                const html = `<div class="mail-box-header" style="background: inherit !important;">
                                    <h2>${filter.NombreUsuario}</h2>
                                    <h3>${filter.Titulo}</h3>
                                    <h5>
                                        <span class="pull-right font-noraml">${filter.FechaRegistro}</span>
                                        <span class="font-noraml">To: </span>${filter.Para} <br />
                                        <span class="font-noraml">CC: </span>${filter.Copia}
                                    </h5>
                                </div>
                                <div class="mail-body">${filter.Contenido}</div>`;
                mail_body.innerHTML = html;
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_search: fn_search,
            fn_search_description: fn_search_description,
            deletefile: deletefile,
            downloadfile: downloadfile,
            fn_adddescriptionavio: fn_adddescriptionavio,
            changeStyleCode: changeStyleCode,
            fn_delete_stylecode: fn_delete_stylecode,
            updateFileRequerimientoAvio: updateFileRequerimientoAvio,
            fn_load_mail: fn_load_mail
        }
    }
)(document, 'panelEncabezado_NewTrim');
(
    function ini() {
        app_NewTrim.load();
        app_NewTrim.req_ini();
    }
)();
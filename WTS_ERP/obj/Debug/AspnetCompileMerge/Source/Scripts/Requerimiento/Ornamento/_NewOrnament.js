var app_NewOrnament = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: 0,
            idPrograma: 0,
            ListaEstadoCsv: [],
            ListaTestPacknameCsv: [],
            ListaTipoRequerimientoCsv: [],
            ListaTipoProveedorCsv: [],
            ListaProveedorCsv: [],
            ListaTipoTelaCsv: [],
            ListaTipoArteCsv: [],
            ListaTipoFileCsv: [],
            ListaTechniqueCsv: [],
            ListaTipoProductoCsv: [],
            ListaComboColorDetalleTestReportCsv: [],
            ListaColorTelaCsv: [],
            strColorTela: '',
            tmpCboTipoFile: '',
            tmpCboReportTestList: '',
            ListaReporteTestEstadotStr:'',
            ListaTipoProductoComboStr: '',
            tmpCboProvTest: '',
            tmpCboColorTest: '',
            tmpCboColorTestReport: '',
            rutaFileServer: '',
            flgCambioImagen: 0,
            codfase: appStages.ovariables.codfase,
            TipoSolicitud: 'SE',
            flgCopy: false,
            IdRequerimientoPadre: 0
        }
       
        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            //setear Parametros: ini
            const par = _('ParamsArte').value;
            _('IdRequerimientoDetalleAr').value = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
            ovariables.id = _par(par, 'Idrequerimiento') !== '' ? _parseInt(_par(par, 'Idrequerimiento')) : 0;
            ovariables.idPrograma = _par(par, 'Idprograma') !== '' ? _parseInt(_par(par, 'Idprograma')) : 0;
            ovariables.idcliente = _par(par, 'Idcliente') !== '' ? _parseInt(_par(par, 'Idcliente')) : 0;
            //setear Parametros: fin
            
            // Events
            _('btnAddNewArt').addEventListener('click', fn_new);
           _('btnAddNewPackNameOrnament').addEventListener('click', fn_addtests_list_item);
            _('cboArtTipo').addEventListener('change', filtrarTecnicaTipoArte);
            _('cboFabricTypeArt').addEventListener('change', validarTipoTela);
            _('btnArtBuscarTela').addEventListener('click', buscarTela); 
            _('btnSaveArt').addEventListener('click', fn_ejecutarbtnSave);
            _('btnEnviarTestArte').addEventListener('click', fn_ejecutarbtnEnvio);
            _('btnAddReportListArt').addEventListener('click', AddReportList); 
            

            loadimage();
            loadFileRequerimento();

            // Plugins
            $('#scrollSummaryArt').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $(".scroll-fieldset4").slimScroll({
                height: '230px',
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

            // Select2 multiple para combos
            $("#cboCorreosArt").select2({
                width: '100%'
            });
            $(".select-multiple").select2({
                width: '100%'
            });
            $('.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true
            });

        }

        function req_ini() {
            ovariables.rutaFileServer = _('rutaFileServerAr').value;

            _promise()
                .then(ValidarCarryOver())
                .then(cargarArteIni())
                .then(validarRequerimientoHabilitar())  
                .then(validarTipoTela())  


        }

        function ValidarCarryOver() {

            let IdRequerimientoDetalle = _('IdRequerimientoDetalleAr').value;

            if (IdRequerimientoDetalle < 0) {
                IdRequerimientoDetalle = IdRequerimientoDetalle * -1;
                _('IdRequerimientoDetalleAr').value = IdRequerimientoDetalle;
                ovariables.TipoSolicitud = 'CO';
                ovariables.flgCopy = true;
            } else {
                ovariables.flgCopy = false;
            }

            if (IdRequerimientoDetalle == 0) {
                ovariables.TipoSolicitud = 'SE';
            }
        }

        //FUNCIONALIDAD DE IMAGEN:INICIO

        function loadimage() {

            _('inputImageAr').onchange = function () {

                ovariables.actualizarimagen = 1;
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();

                if (ext != '') {
                    switch (ext) {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                            showimage(this);
                            break;
                        default:
                            swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
                            this.value = '';
                            _('imgSketchAr').src = '';
                    }
                }
            }

            //_('inputImage').onclick = function () {
            //    document.body.onfocus = function () {
            //        if (_('inputImage').value === '') {
            //            _('imgSketch').src = '';
            //            swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
            //            document.body.onfocus = null;
            //        }
            //    }
            //}

            _('btnDeleteUploadAr').onclick = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                _('imgSketchAr').src = '';
                _('inputImageAr').value = '';
            }
        }

        function showimage(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('imgSketchAr').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
                ovariables.flgCambioImagen = 1
            }
        }

        //FUNCIONALIDAD DE IMAGEN: FIN

        function cargarArteIni() {

            let err = function (__err) { console.log('err', __err) };
            let IdRequerimientoDetalle = _('IdRequerimientoDetalleAr').value;
            let parametro = {
                IdCliente: ovariables.idcliente,
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                 TipoSolicitud: ovariables.TipoSolicitud
            };

            _Get('Requerimiento/Ornamento/GetOrnamentLoadNew_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {

                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        let ListaReporteTestCboCsv = [];

                        ovariables.ListaEstadoCsv = rpta.ListaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaEstadoCsv) : [];
                        ovariables.ListaTipoRequerimientoCsv = rpta.ListaTipoRequerimientoCsv !== '' ? CSVtoJSON(rpta.ListaTipoRequerimientoCsv) : [];
                        ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : []; 
                        ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                        ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                        ovariables.ListaTipoTelaCsv = rpta.ListaTipoTelaCsv !== '' ? CSVtoJSON(rpta.ListaTipoTelaCsv) : [];
                        ovariables.ListaTipoArteCsv = rpta.ListaTipoArteCsv !== '' ? CSVtoJSON(rpta.ListaTipoArteCsv) : [];
                        ovariables.ListaTechniqueCsv = rpta.ListaTechniqueCsv !== '' ? CSVtoJSON(rpta.ListaTechniqueCsv) : []; 
                        ovariables.ListaTipoProductoCsv = rpta.ListaTipoProductoCsv !== '' ? CSVtoJSON(rpta.ListaTipoProductoCsv) : []; 
                        ovariables.ListaTestPacknameCsv = rpta.ListaTestPacknameCsv !== '' ? CSVtoJSON(rpta.ListaTestPacknameCsv) : [];
                        ovariables.ListaComboColorDetalleTestReportCsv = rpta.ListaComboColorDetalleTestReportCsv !== '' ? CSVtoJSON(rpta.ListaComboColorDetalleTestReportCsv) : [];
                        ListaReporteTestCboCsv = rpta.ListaReporteTestCboCsv !== '' ? CSVtoJSON(rpta.ListaReporteTestCboCsv) : [];
                        ovariables.ListaColorTelaCsv = rpta.ListaColorTelaCsv !== '' ? CSVtoJSON(rpta.ListaColorTelaCsv) : [];

                        ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                        ovariables.tmpCboReportTestList = (ListaReporteTestCboCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                        ovariables.strColorTela = ovariables.ListaColorTelaCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');

                        _promise()
                            .then(llenarControles(rpta))
                            .then(setearCampos(rpta))
                            .then(recargarCamposDependientes(rpta))
                    }
                    
                }, (p) => { err(p); });
        }

        function llenarControles(rpta) {

            ovariables.IdRequerimientoPadre = rpta.IdRequerimientoPadre;
            llenarComboCsv('cboArtStatus', ovariables.ListaEstadoCsv);
            llenarComboCsv('cboArtRequestType', ovariables.ListaTipoRequerimientoCsv);
            llenarComboCsv('cboArtSupplierType', ovariables.ListaTipoProveedorCsv);
            llenarComboCsv('cboArtSupplierName', ovariables.ListaProveedorCsv);
            llenarComboCsv('cboFabricTypeArt', ovariables.ListaTipoTelaCsv);
            llenarComboCsv('cboArtTipo', ovariables.ListaTipoArteCsv);  
            llenarComboCsv('cboArtPackName', ovariables.ListaTestPacknameCsv);

            let idRequerimiento = _('IdRequerimientoDetalleAr').value;

            if (parseInt(idRequerimiento) > 0) {

                _('cboFabricTypeArt').value = rpta.TipoTela;

                let ListaEstadoReporteTestCsv = [];

                ListaEstadoReporteTestCsv = rpta.ListaEstadoReporteTestCsv !== '' ? CSVtoJSON(rpta.ListaEstadoReporteTestCsv) : [];

                ovariables.tmpCboProvTest = CSVtoJSON(rpta.ListaProveedorTestCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.tmpCboColorTest = CSVtoJSON(rpta.ListaComboColorDetalleTestCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.ListaReporteTestEstadotStr = (ListaEstadoReporteTestCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.tmpCboColorTestReport = (ovariables.ListaComboColorDetalleTestReportCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');

                fn_req_correos();

            }

            filtrarTecnicaTipoArte();//inicializamos la tecnica
        }

        function llenarComboCsv(control, listCsv) {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;
        }

        function setearCampos(rpta) {

            let idRequerimiento = _('IdRequerimientoDetalleAr').value;

            _('cboArtRequestType').value = ovariables.TipoSolicitud;
            _('cboArtRequestType').disabled = true;

            if (parseInt(idRequerimiento) > 0) {
                _('cboArtTipo').value = rpta.ArteTipoWts;    
                forzarOnchange('cboArtTipo');

                _('cboArtStatus').value = rpta.IdEstado; 
                _('cboArtRequestType').value = ovariables.flgCopy == true ? ovariables.TipoSolicitud : rpta.TipoSolicitud;    
                _('cboArtSupplierType').value = rpta.IdTipoProveedor;    
                _('cboArtSupplierName').value = rpta.IdProveedor;    
                _('cboFabricTypeArt').value = rpta.TipoTela; 
                _('txtArtFabricCode').value = rpta.CodigoTelaWTS; 
                _('txtArtFabricDes').value = rpta.DescripcionTela; 
                _('cboArtReqDate').value = rpta.FechaRequerimientoCliente; 
                
                _('txtArtNotes').value = rpta.Notes;
                _('txtArtArtCode').value = rpta.ArteCodigoWts;
                
                _('cboArtTechnique').value = rpta.ArteTecnica;
                _('txtArtDes').value = rpta.ArteDescripcion; 

                if (rpta.ImagenNombre !== '' && flgCopy === false) {
                    _('imgSketchAr').src = 'http:' + ovariables.rutaFileServer + rpta.ImagenNombre;
                } else {
                    _('imgSketchAr').src = 'http:' + ovariables.rutaFileServer + 'sinimagen.jpg';
                }

                cargarComboColor(CSVtoJSON(rpta.ListaComboColorCsv));
                cargarComboColorDetalle(CSVtoJSON(rpta.ListaComboColorDetalleCsv));

                if (!(ovariables.flgCopy)) {

                    cargarTestColor(CSVtoJSON(rpta.ListaTestColorCsv));
                    cargarTestColorDetalle(CSVtoJSON(rpta.ListaTestColorDetalleCsv));

                    let ListaReporteTestCsv = rpta.ListaReporteTestCsv !== '' ? CSVtoJSON(rpta.ListaReporteTestCsv) : [];
                    cargarTestReport(ListaReporteTestCsv);

                    listarFileRequerimiento();
                }
            }
        }

        function validarRequerimientoHabilitar() {
            let idRequerimiento = _('IdRequerimientoDetalleAr').value;

            if (parseInt(idRequerimiento) > 0) {

                if (!(ovariables.flgCopy)) {

                _('modal_title_NewOrnament').innerText = 'Edit Ornament';
                _('litab-2').style.display = '';
                _('litab-3').style.display = '';
                //_('litab-4').style.display = '';
                _('litab-5').style.display = '';
                _('tabart-2').style.display = '';
                _('tabart-3').style.display = '';
                //_('tabart-4').style.display = '';
                _('tabart-5').style.display = '';

                _('cboFabricTypeArt').disabled = true;
                _('txtArtFabricCode').disabled = true;
                _('txtArtFabricDes').disabled = true;         
                _('btnArtBuscarTela').disabled = true;
                
                _('btnAddNewArt').disabled = false;
                _('cboArtTipo').disabled = true;
                _('cboArtTechnique').disabled = true;

                } else {

                    _('modal_title_NewOrnament').innerText = 'Copy Ornament';

                    _('cboFabricTypeArt').disabled = false;
                    _('txtArtFabricCode').disabled = false;
                    _('txtArtFabricDes').disabled = false;
                    _('btnArtBuscarTela').disabled = false;
                    _('btnAddNewArt').disabled = false;
                    _('cboArtTipo').disabled = true;
                    
                }     

            } else {

                _('btnAddNewArt').disabled = true;

            }
        }

        function forzarOnchange(controlId) {

            var element = document.getElementById(controlId);
            var event = new Event('change');
            element.dispatchEvent(event);
        }
               
        function filtrarTecnicaTipoArte() {

            var tipoArte = _('cboArtTipo').value;
            var objMetodos = ovariables.ListaTechniqueCsv.filter(function (number) { return number.Padre.includes(tipoArte); });
            var cbolist = objMetodos.map(x => { return `<option value='${x.codigo}'>${x.descripcion}</option>` }).join('');
            _('cboArtTechnique').innerHTML = cbolist;
            _('cboArtTechnique').value = '';
            filtrarTipoProducto();
        }

        function filtrarTipoProducto() {

            var tipoArte = _('cboArtTipo').value;
            var objTipoProducto = ovariables.ListaTipoProductoCsv.filter(function (number) { return number.Padre.includes(tipoArte); });
            var cbolist = objTipoProducto.map(x => { return `<option value='${x.codigo}'>${x.descripcion}</option>` }).join('');
            ovariables.ListaTipoProductoComboStr = cbolist;
            
        }

        function fn_replace_list(e) {
            const td = e.parentElement.parentElement.parentElement;
            td.innerHTML = `<div class="input-group">
                                <div class="has-float-label">
                                    <input type="text" class="input-sm form-control" style="width: 100%;" />
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-danger" onclick="app_NewOrnament.fn_replace_text(this)">
                                        <span class="fa fa-close"></span>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-success">
                                        <span class="fa fa-save"></span>
                                    </button>
                                </div>
                            </div>`;
        }

        function fn_replace_text(e) {
            const td = e.parentElement.parentElement.parentElement;
            td.innerHTML = `<div class="input-group">
                                <div class="has-float-label">
                                    <select class="input-sm form-control" style="width: 100%;">
                                        <option>Color 1</option>
                                        <option>Color 2</option>
                                    </select>
                                </div>
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-sm btn-primary" onclick="app_NewOrnament.fn_replace_list(this)">
                                        <span class="fa fa-plus"></span>
                                    </button>
                                </div>
                            </div>`;
        }

        function fn_new() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Color/_AddColor',
                idmodal: 'AddColor',
                paremeter: `id:0,accion:newornament`,
                title: 'Add Color Combo',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_concession(button) {

            let id = button.parentElement.parentElement.getAttribute("id");
           
            _modalBody_Backdrop({
                url: 'Requerimiento/Ornamento/_Concession',
                idmodal: 'RequestConcession',
                paremeter: `id:${id},accion:new`,
                title: 'Request Concession',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_delete_row(colorname) {
            $(`.colorname table tbody tr[data-par='colorname:${colorname}']`).remove();
        }

        //inicio LA - TAB SUMMARY
        const fn_addcomboitem = () => {

            const select = document.getElementById("IdTipoProducto"); 
            const colorname = _("txtColorName").value;
            const tipoProducto = _("IdTipoProducto").value;
            const tipoProductoName = select.options[select.selectedIndex].innerText;;
            const idcombo = 0;
            dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName);
        }

        function cargarComboColorDetalle(arrComboColorDetalle) {

            arrComboColorDetalle.forEach(x => {

                let idcombo = x.IdComboColor;
                let Comboname = x.ComboColor;
                let idColor = x.IdComboColorDetalle;

                let ColorCode = x.ColorCode;
                let ColorName = x.ColorName;
                let Pantone = x.Pantone;
                let Alternative = x.Alternative;
                let ClienteSelection = x.ClienteSelection;
                let Metodo = x.Metodo;
                let TipoTenido = x.TipoTenido;
                let WtsCode = x.WtsCode;
                let WtsDescripcion = x.WtsDescripcion;

                _promise()
                    .then(dibujarComboColorDetalle_consulta(idColor, idcombo,Alternative, ClienteSelection ))
                    .then(setComboColorDetalle(idColor, Metodo, WtsCode, WtsDescripcion, TipoTenido, ColorCode, ColorName, Pantone, Alternative, ClienteSelection))

            })
        }

        function dibujarComboColorDetalle_consulta(idColor, idcombo, Alternative, ClienteSelection) {

            const tr_main = _('trCombo_' + idcombo);
            const Comboname = tr_main.getAttribute("data-combo");
            const combotipoProducto = tr_main.getAttribute("data-idtipoproducto");
            const ComboDetalle = tr_main.getAttribute("data-comboDetalle");

            dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, Alternative, ClienteSelection);
        }

        function setComboColorDetalle(idColor, Metodo, WtsCode, WtsDescripcion, TipoTenido, ColorCode, ColorName, Pantone, Alternative, ClienteSelection) {
                      
            _('codColor_' + idColor).value = ColorCode;
            _('desColor_' + idColor).value = ColorName;
            _('pantColor_' + idColor).value = Pantone;
            //_('alternative_' + idColor).value = Alternative;
            //_('seleccion_' + idColor).value = ClienteSelection;
            //forzarOnchange('alternative_' + idColor);
            //forzarOnchange('seleccion_' + idColor);
            forzarOnchange('desColor_' + idColor);

        }

        function cargarComboColor(arrComboColor) {
            $(`.colorname table tbody tr`).remove(); 

            if (arrComboColor.length > 0) { $("#listComboColor").empty(); }

            arrComboColor.forEach(x => {
                let idcombo = x.IdComboColor;
                let colorname = x.ComboColor;
                let tipoProducto = x.idTipoProducto;
                let tipoProductoName = x.TipoProducto;

                dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName)
            })
        }

        function dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName) {

            _promise()
                 .then(setearComboColor(idcombo, colorname, tipoProducto, tipoProductoName))

        }

        function setearComboColor(idcombo, colorname, tipoProducto, tipoProductoName) {

            let count_comboitem = parseInt($(".combo-item").length, 10) + 1;
            const td_eliminar_colorname = `<td>
                                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewOrnament.deleteCombo(this)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                                <button class="btn btn-xs pull-right" onclick="app_NewOrnament.toogle_colorname_ocultar(this,'${colorname}');">
                                                    <i class="fa fa-angle-down"></i>
                                                </button>
                                            </td>`
            const td_colorname = `<td class="text-left">${colorname} <button class="btn btn-xs pull-right" onclick="app_NewOrnament.fn_add_items_colorname(this, 'dye_${count_comboitem}');"><i class="fa fa-plus"></i></button></td>`
            const td_after_colorname = `<td class="text-left" colspan="5"> <b>Type Product :</b>   ${tipoProductoName}</td>`;
            // para tabla colorname
            // SI NO EXISTE LA TABLA SE CREA
            if ($(".colorname table").length === 0) {
                const table_colorname = `<table class="table table-vertical-center table-hover table-bordered tablecolor${count_comboitem}" id="tb_${colorname}" style="margin-bottom: 0;">
                                                <thead>
                                                    <tr>
                                                        <th width="5%"></th>
                                                        <th width="12%">Combo Name</th>
                                                        <th width="10%">Color Code</th>
                                                        <th width="12%">Color Name</th>
                                                        <th width="10%"># Pantone</th>
                                                        <th width="15%">Alternative</th>
                                                        <th width="15%">Client Selection</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbodyColor" >
                                                    <tr id="trCombo_${idcombo}" data-par="colorname:${colorname}" data-comboid="${idcombo}" data-idTipoProducto="${tipoProducto}" data-comboDetalle="${ovariables.strComboDetalle}"  data-combo="${colorname}" data-control='combocolor'>
                                                        ${td_eliminar_colorname}
                                                        ${td_colorname}
                                                        ${td_after_colorname}
                                                    </tr>
                                                </tbody>
                                            </table>`;

                const div_comboitem = `<div class="combo-item" id="div_${colorname}">
                                        <div class="col-sm-12 "> 
                                            ${table_colorname}
                                        </div>
                                    </div>`

                $(".colorname").append(div_comboitem);
                $("#modal_AddColor").modal("hide");
            } else {
                // SI YA EXISTE SOLO AGREGA COLUMNA
                let tr = `<tr id="trCombo_${idcombo}" data-par="colorname:${colorname}"  data-comboid="${idcombo}" data-idTipoProducto="${tipoProducto}"   data-comboDetalle="${ovariables.strComboDetalle}"  data-combo="${colorname}" data-control='combocolor'>
                            ${td_eliminar_colorname}
                            ${td_colorname}
                            ${td_after_colorname}
                        </tr>`;
                $(".colorname table").children("tbody").append(tr);
                $("#modal_AddColor").modal("hide");
            }
        } 

        function cargarTestColor(arrTest) {

            arrTest.forEach(x => {
                let IdTest = x.IdTest;
                _('IdTest').value = IdTest;
            })
        }

        function cargarTestColorDetalle(arrTestColorDetalle) {

            $("#bodyListTestArte tr").remove();

            arrTestColorDetalle.forEach(x => {

                let IdTestDetalle = x.IdTestDetalle;
                let idTest = x.IdTest;
                let IdTipoProveedor = x.IdTipoProveedor;
                let idProveedor = x.IdProveedor;
                let testCode = x.TestCodigo;
                let testName = x.TestDescripcion;
                let Cost = x.CostTestDetalle;
                let Status = x.Estado;
                let wtscode = x.colorCode;
                let codEstado = x.codEstado;              

                dibujarTest(idTest, IdTestDetalle, testCode, testName, idProveedor, Cost, Status, wtscode, codEstado)

            })
        }


        const fn_add_items_colorname = (e, dying_clase) => {

            const tr_main = e.parentElement.parentElement;
            const idcombo = tr_main.getAttribute("data-comboid");
            const Comboname = tr_main.getAttribute("data-combo");
            const combotipoProducto = tr_main.getAttribute("data-idtipoproducto");
            const ComboDetalle = tr_main.getAttribute("data-comboDetalle");
            const idColor = 0;

            dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, '', '');
        }

        function retornarlistAlternative(Alternative) {

            let arr = (Alternative).split(',');
            let arr2 = ('1,2,3,4,5').split(',');
            let seleccionado = 'selected="selected"'
            let coleccion = `<option eleccion1 value="1">1</option>
                            <option eleccion2 value="2">2</option>
                            <option eleccion3 value="3">3</option>
                            <option eleccion4 value="4">4</option>
                            <option eleccion5 value="5">5</option>`


            arr.forEach(function (name) {
                if (name != '') {
                    let valor = 'eleccion' + name;
                    coleccion = remplazartodo(coleccion, valor, seleccionado)
                }
            });

            arr2.forEach(function (name2) {
                let valor = 'eleccion' + name2;
                coleccion = remplazartodo(coleccion, valor, '')
            });

            return coleccion;
        }

        function retornarlistSelectCliente(Alternative, ClienteSelection) {

            let arr = (Alternative).split(',');
            let arr2 = (ClienteSelection).split(',');
            let optionSelecCliente = '';
            let seleccionado = 'selected="selected"'

            arr.forEach(function (name) {
                if (name != '') {
                    optionSelecCliente += `<option eleccion${name} value="${name}">${name}</option>`;
                }
            });

            arr2.forEach(function (name2) {
                if (name2 != '') {
                    let valor = 'eleccion' + name2;
                    optionSelecCliente = remplazartodo(optionSelecCliente, valor, seleccionado)
                }
            });

            arr.forEach(function (name3) {
                if (name3 != '') {
                    let valor = 'eleccion' + name3;
                    optionSelecCliente = remplazartodo(optionSelecCliente, valor, '')
                }
            });

            return optionSelecCliente;
        }

        function dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, Alternative, ClienteSelection) {

            let listAlternative = retornarlistAlternative(Alternative);
            let listClienteSelection = retornarlistSelectCliente(Alternative, ClienteSelection);   

            const colorname_tr = `<tr data-par="colorname:${Comboname}"  data-comboid="${idcombo}"  data-combo="${Comboname}" data-combotipoproducto="${combotipoProducto}" data-idColor="${idColor}"  class="colorname-ocultar">
                                    <td colspan="2">
                                        <button type="button" class="btn btn-xs btn-danger pull-right" onclick="app_NewOrnament.deleteComboDetalle(this)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>                                   
                                    <td>
                                        <input id="codColor_${idColor}" type="text" class="input-sm form-control" value="Available" style="width: 100%;">
                                    </td>
                                    <td>
                                        <div class="text-left">
                                            <select class="form-control input-sm select2_tags" id="desColor_${idColor}">
                                                 ${ovariables.strColorTela}
                                            </select>                                                             
                                        </div>
                                    </td>
                                    <td>
                                        <input  id="pantColor_${idColor}"  type="text" class="input-sm form-control" value="" style="width: 100%;">
                                    </td>
                                    <td id="tdAlternative_${idColor}">
                                        <select id="alternative_${idColor}"  class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                              ${listAlternative}
                                        </select>
                                    </td>
                                    <td >
                                        <select  id="seleccion_${idColor}" class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                             ${listClienteSelection}
                                        </select>
                                    </td>
                                  </tr>`;


            $(`.colorname table tbody tr[data-par='colorname:${Comboname}']:last`).after(`${colorname_tr}`);

            $(".select-multiple").select2({
                width: '100%'
            });

            $(".select2_tags").select2({
                tags: true,
                width: '100%'
            });

        }

        const toogle_colorname_ocultar = (e, colorname) => {
            const icon = e.children[0].getAttribute("class");
            if (icon === "fa fa-angle-up") {
                e.children[0].setAttribute("class", "fa fa-angle-down");
                $(`.colorname table tbody tr[data-par='colorname:${colorname}'].colorname-ocultar`).removeClass("hide");;
            } else {
                e.children[0].setAttribute("class", "fa fa-angle-up");
                $(`.colorname table tbody tr[data-par='colorname:${colorname}'].colorname-ocultar`).addClass("hide");
            }
        }

        const toogle_colorname_ocultar_additem = (e) => {
            const tbody = e.parentElement.parentElement.parentElement;
            const jq_tbody = $(tbody);
            $(e.parentElement.parentElement.parentElement).children("tr.colorname-ocultar").removeClass("hide");            
        }
        //fin LA - TAB SUMMARY

        //inicio LA - TAB TESTS
        function fn_addtests_list_item() {

            if (_('cboArtPackName').value != '0') {

                var value = _('cboArtPackName').value;
                var select = document.getElementById("cboArtPackName");
                var IdTest = _('IdTest').value;
                var IdTestDetalle = 0;
                var desComboTest = select.options[select.selectedIndex].innerText;
                var wtscode = 0;
                var codEstado = '01'
                dibujarTest(IdTest, IdTestDetalle, value, desComboTest, 0, '', 'Create', wtscode, codEstado);
            }
        }

        function recargarCamposDependientes(rpta) {
            fn_add_suppliername_tosend();
        }

        function dibujarTest(idTest, IdTestDetalle, testCode, testName, idProveedor, Cost, Status, wtscode, codEstado) {


            let btnEliminar = `<button type="button" class="btn btn-xs btn-danger" onclick="app_NewOrnament.deleteTest(this)">
                                    <i class="fa fa-trash"></i>
                                </button>`
            let strDisable = ''

            if (codEstado == '02') {
                btnEliminar = '';
                strDisable = 'disabled="disabled"'
            }

            $("#bodyListTestArte > tr.row_empty").remove();

            const lenTableTest = parseInt($("#bodyListTestArte > tr").length, 10) + 1;

            const td_supplier = `<select class="input-sm form-control" style="width: 100%;" id="prov_${IdTestDetalle}" ${strDisable} onclick="app_NewOrnament.fn_add_suppliername_tosend();">
                                            ${ovariables.tmpCboProvTest}
                                 </select>`; 

            const td_color = `<select class="input-sm form-control" style="width: 100%;" id="color_${IdTestDetalle}"  ${strDisable} onclick="app_NewOrnament.fn_add_suppliername_tosend();">
                                            ${ovariables.tmpCboColorTest}
                                 </select>`;

            const table_testlist = `<tr class="test_${lenTableTest}" id="${idTest}" idTestDetalle="${IdTestDetalle}" estado="${codEstado}">
                                            <td>
                                                   ${btnEliminar}
                                            </td>
                                            <td>
                                                <input type="text" Id="tescode_${IdTestDetalle}" class="input-sm form-control" disabled style="width: 100%;" value="${testCode}">
                                            </td>
                                            <td>
                                                <input type="text" Id="tesname_${IdTestDetalle}" class="input-sm form-control" disabled style="width: 100%;" value="${testName}">
                                            </td>
                                            <td>
                                                ${td_color}
                                            </td>
                                            <td>
                                                ${td_supplier}
                                            </td>
                                            <td>
                                                <input type="text" class="input-sm form-control" style="width: 100%;" value="${Cost}" />
                                            </td>
                                            <td>
                                                <label class="control-label text-center" style="width: 100%;">${Status}</label>
                                            </td>
                                        </tr>`;

            $("#bodyListTestArte").append(table_testlist);

            if (idProveedor != 0)
                _('prov_' + IdTestDetalle).value = idProveedor;   

            if (wtscode != 0)
                _('color_' + IdTestDetalle).value = wtscode;

            fn_add_suppliername_tosend();

        }

        const fn_add_suppliername_tosend = () => {
            let array_options_table_test = [];
            let array_options_table_test_new = []

            Array.from($("#bodyListTestArte > tr")).map(x => {
                let el = $(x).children("td").eq(4).children("select").val();
                let obj = {
                    key: $(x).children("td").eq(4).children("select").val(),
                    text: $(x).children("td").eq(4).children(`select`).children(`option[value='${el}']`).text()
                }

                let estado = x.getAttribute('estado');
                if (estado == '01') {
                    array_options_table_test.push(obj);
                }

            });

            let set = new Set(array_options_table_test.map(JSON.stringify))
            array_options_table_test_new = Array.from(set).map(JSON.parse);
            
            let option = array_options_table_test_new.map(x => {
                return `<option value='${x.key}'>${x.text}</option>`;
            }).join('');

            $("#cboArtSupplierTest > option").remove();
            $("#cboArtSupplierTest").append(`<option value="0">select</option>${option}`);
        }
        const fn_remove_suppliername_tosend = (e) => {
            $(e).parent().parent().remove();
            fn_add_suppliername_tosend();
        }
        //fin LA - TAB TESTS

        function fn_fullscreen(e) {
            let element = $('#fullscreen_comboart');
            let button = $(e).find('i');
            $('body').toggleClass('fullscreen-ibox-mode');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            element.toggleClass('div_fullscreen2');
            setTimeout(function () {
                $(window).trigger('resize');
            }, 100);
        }


        //ELIMINACION DE REPORTE:INICIO
        function deleteReporte(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                let id = button.parentElement.parentElement.getAttribute("id");

                if (id != 0) {

                    let parametro = {
                        IdReportTest: id
                    }, frm = new FormData();

                    frm.append('paramsJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/Color/DeleteReport_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {

                                swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                $(button.parentElement.parentElement).remove()

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });
        }

        //ELIMINACION DE REPORTE: FIN

        //ELIMINACION DE TEST:INICIO
        function deleteTest(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                let id = button.parentElement.parentElement.getAttribute("id");

                if (id != 0) {

                    let parametro = {
                        IdTestDetalle: id
                    }, frm = new FormData();

                    frm.append('paramsJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/Color/DeleteTest_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {

                                swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                $(button.parentElement.parentElement).remove()

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });

        }

        //ELIMINACION DE TEST: FIN
        //seccion Validacion: inicio
        
        function validarTipoTela() {

            _('txtArtFabricCode').value = '';
            _('txtArtFabricDes').value = '';

            let tipoTela = _('cboFabricTypeArt').value;

            if (tipoTela == 'D') {
                _('txtArtFabricCode').disabled = false;
                _('txtArtFabricDes').disabled = false;
                _('btnArtBuscarTela').disabled = false;
            } else {
                _('txtArtFabricCode').disabled = true;
                _('txtArtFabricDes').disabled = true;
                _('btnArtBuscarTela').disabled = true;
            }

        }

        //seccion Validacion: fin

        //FUNCIONALIDAD GUARDADO:INICIO

        function fn_listCombo() {

            let arrRows = Array.from(_('tbodyColorArte').rows);
            let i = 0;
            let resultado = [];

            arrRows.forEach(x => {

                let cells = x.getElementsByTagName('td');
                let Inputs = x.getElementsByTagName('input');
                let selects = x.getElementsByTagName('select');               

                if (Inputs.length > 0) {

                    let IdComboColor = x.getAttribute('data-comboid');
                    let Combo = x.getAttribute('data-combo');
                    let IdComboColorDetalle = x.getAttribute('data-idcolor');
                    let IdComboColorTipoProducto = x.getAttribute('data-combotipoproducto');

                    let wtsCode = '';
                    let colorcode = Inputs[0].value;
                    let pantone = Inputs[1].value;

                    let metodTenido = '';
                    let tipoTenido = '';
                    let wtsdescripcion = '';
                    let color = selects[0].value;

                    let objAlternativa = obtenerlista(selects[1])
                    let alternative = objAlternativa.strList;
                    let objSelection = obtenerlista(selects[2])
                    let ClienteSelection = objSelection.strList;

                    //let alternative = selects[1].value;
                    //let ClienteSelection = selects[2].value;

                    let obj = {};

                    obj.IdComboColorDetalle = ovariables.flgCopy == true ? 0 : IdComboColorDetalle; 
                    obj.IdComboColor = ovariables.flgCopy == true ? 0 : IdComboColor;  
                    obj.DescCombo = Combo;
                    obj.IdComboColorTipoProducto = IdComboColorTipoProducto;
                    obj.Metodo = metodTenido;
                    obj.WtsCode = wtsCode;
                    obj.WtsDescripcion = wtsdescripcion;
                    obj.TipoTenido = tipoTenido;
                    obj.ColorCode = colorcode;
                    obj.ColorName = color;
                    obj.Pantone = pantone;
                    obj.Alternative = alternative;
                    obj.ClienteSelection = ClienteSelection;

                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function obtenerlista(select) {
            let td = select.parentElement;
            let _arrli = Array.from(td.getElementsByTagName('li'));
            let strList = '';
            let optionList = '';

            _arrli.forEach(x => {
                let title = x.getAttribute('title');
                if (title != '' && title !== null) {
                    strList += title + ',';
                    optionList += `<option value="${title}">${title}</option>`
                }
            })

            strList = strList.length > 0 ? strList.slice(0, -1) : strList;

            let objNumeros = {};
            objNumeros.strList = strList;
            objNumeros.optionList = optionList;

            return objNumeros;
        }

        function remplazartodo(cadena, buscar, reemplazar) {

            var replace = buscar;
            var re = new RegExp(replace, "g");
            cadena = cadena.replace(re, reemplazar);
            return cadena;
        }

        function fn_listTest() {

            let resultado = [];
            let arrRows = Array.from(_('bodyListTestArte').rows);

            let i = 0;
            arrRows.forEach(x => {

                let IdTest = x.getAttribute('id');
                let IdTestDetalle = x.getAttribute('idTestDetalle');
                let cells = x.getElementsByTagName('td');
                let Inputs = x.getElementsByTagName('input');
                let selects = x.getElementsByTagName('select');
                if (Inputs.length > 0) {

                    let testCode = Inputs[0].value;
                    let testname = Inputs[1].value;
                    let cost = Inputs[2].value == '' ? 0 : Inputs[2].value; 
                    let estado = cells[6].textContent.trim();
                    let ColorCode = selects[0].value;
                    let idProveedor = selects[1].value;

                    let obj = {};
                    obj.IdTestDetalle = IdTestDetalle;
                    obj.IdTest = IdTest;
                    obj.ColorCode = ColorCode;
                    obj.TestCodigo = testCode;
                    obj.TestDescripcion = testname;
                    obj.IdTipoProveedor = 0;
                    obj.IdProveedor = idProveedor;
                    obj.CostTestDetalle = cost;
                    obj.Estado = estado;
                    resultado.push(obj);
                }
            })

            return resultado;
        }


        function fn_listFileProperty() {

            let resultado = [];
            let arrRows = Array.from(_('tbody_files_orna').rows);

            let i = 0;
            arrRows.forEach(x => {

                let IdFile = x.getAttribute('data-id');
                let selects = x.getElementsByTagName('select');
                if (selects.length > 0) {

                    let Tipo = selects[0].value;

                    let obj = {};
                    obj.IdFile = IdFile;
                    obj.Tipo = Tipo;

                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function fn_listReportTest() {

            let resultado = [];
            let arrRows = Array.from(_('tbodyReportListArte').rows);
            arrRows.forEach(x => {

                let IdReportList = x.getAttribute('idreportlist');
                let selects = x.getElementsByTagName('select');

                if (selects.length > 0) {

                    let TestCode = selects[0].value;
                    let EstadoReportTest = selects[1].value;

                    let obj = {};
                    obj.IdReportTest = IdReportList;
                    obj.TestCode = TestCode;
                    obj.EstadoReportTest = EstadoReportTest;
                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function fn_ejecutarbtnSave() {

            fn_guardarRequerimiento(0);
        }

        function fn_ejecutarbtnEnvio() {

            if (validarEnvioTest()) {
                fn_guardarRequerimiento(1);
            }
        }

        function validarEnvioTest() {

            bResult = true;

            if (_('cboArtSupplierTest').value === '0') {
                swal({ title: "Alert", text: "Select Supplier Test.", type: "warning" });
                bResult = false;
            }

            return bResult
        }

        function GenerarConcesion() {

            var parametroJS = _getParameter({ id: 'tabart-1', clase: '_enty_buscar' });       
            parametroJS.IdReportTest = _('IdReportListConcesion').value;
            parametroJS.IdContacto = _('cboConParaArte').value;
            parametroJS.Nota = _('txtNotaConArte').value;

            var mensajeConfirmacion = "Sent Concession.";

            let frm = new FormData();

            frm.append('requerimientoJSON', JSON.stringify(parametroJS));

            _Post('Requerimiento/Ornamento/SaveRequerimientoConcesion_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {

                        _promise()
                            .then(cargarArteIni())
                            .then(validarRequerimientoHabilitar())

                        swal({
                            title: "Good job!",
                            text: mensajeConfirmacion,
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });

                        $("#modal_RequestConcession").modal("hide");

                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });

        }

        function fn_guardarRequerimiento(flgEnvioTest) {

            var resultado = fn_listCombo();
            var resultadoTest = fn_listTest();
            var resultadoTestReport = fn_listReportTest();
            var resultadoFileProp = fn_listFileProperty();
            var parametroJS = _getParameter({ id: 'tabart-1', clase: '_enty_buscar' });
            parametroJS.IdPrograma = ovariables.idPrograma;
            parametroJS.IdCliente = ovariables.idcliente;
            parametroJS.flgEnvioTest = flgEnvioTest;
            parametroJS.IdProveedorTest = _('cboArtSupplierTest').value; 
            parametroJS.flgCambioImagen = ovariables.flgCambioImagen;
            parametroJS.CodFase = ovariables.codfase;
            parametroJS.IdRequerimientoPadre = ovariables.IdRequerimientoPadre; 

            if (ovariables.flgCopy) {
                parametroJS.IdRequerimiento = 0;
                parametroJS.IdRequerimientoDetalle = 0;
            } 

            var mensajeConfirmacion = "The Requeriment was created successfully";

            if (flgEnvioTest === 1) {
                mensajeConfirmacion = "The Test Sent.";
            } else if (parseInt(_('IdRequerimientoDetalleAr').value) > 0) {
                mensajeConfirmacion = "The Requeriment was update successfully";
            }

            const req_enty = _required({ clase: '_enty_buscar', id: 'tabart-1' });

            if (req_enty) { 

                if (fn_validarRequerimiento(parametroJS, resultado, resultadoTest, resultadoTestReport, resultadoFileProp)) {

                    let frm = new FormData();

                    frm.append('requerimientoJSON', JSON.stringify(parametroJS));
                    frm.append('requerimientoComboColorJSON', JSON.stringify(resultado));
                    frm.append('requerimientoTestJSON', JSON.stringify(resultadoTest));
                    frm.append('requerimientoTestReportJSON', JSON.stringify(resultadoTestReport));
                    frm.append('requerimientoFilePropJSON', JSON.stringify(resultadoFileProp));
                    frm.append('Imagen', $("#inputImageAr")[0].files[0]);

                    _Post('Requerimiento/Ornamento/SaveRequerimiento_JSON', frm, true)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                _('IdRequerimientoDetalleAr').value = orpta.id;

                                ovariables.flgCopy = false;

                                _promise()
                                    .then(appStages.fn_arte())
                                    .then(ValidarCarryOver())
                                    .then(cargarArteIni())    
                                    .then(validarRequerimientoHabilitar())                        
                              

                                swal({
                                    title: "Good job!",
                                    text: mensajeConfirmacion,
                                    type: "success",
                                    timer: 5000,
                                    showCancelButton: false,
                                    confirmButtonColor: "#1c84c6",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });

                }

            } else {
                swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
            }
        }

        function fn_validarRequerimiento(parametroJS, resultado, resultadoTest, resultadoTestReport, resultadoFileProp) {

            var result = true;

            //validacion combo color : inicio
            //let ncomboColor = $(`.colornameCOLOR table tbody tr[data-control='combocolor']`).length;
            //let nCboColor = ([... new Set(resultado.map(x => x.DescCombo))]).length;

            //if (ncomboColor != nCboColor) {
            //    swal({ title: "Alert", text: "Color combo has no elements.", type: "warning" });
            //    result = false;
            //}

            //validacion combo color : fin 
            return result;
        }
        //FUNCIONALIDAD GUARDADO:FIN

        //FUNCIONALIDAD BUSCAR TELA : INICIO
        function buscarTela(e) {

            let err = function (__err) { console.log('err', __err) };
            let codigoTela = _('txtArtFabricCode').value;
            e = _('btnArtBuscarTela');

            if (codigoTela != '') {

                const classname = e.getAttribute("class");

                if (classname === 'btn btn-primary') {
                    _Get('Requerimiento/Color/GetBuscarTela_JSON?par=' + codigoTela)
                        .then((resultado) => {

                            let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (rpta !== null) {
                                _('txtArtFabricDes').value = rpta.Descripcion;

                                e.innerHTML = `<span class="fa fa-eraser"></span>`;
                                e.classList.remove('btn-primary');
                                e.classList.add('btn-danger');
                                _('txtArtFabricCode').setAttribute('disabled', 'disabled');
                                _('txtArtFabricDes').setAttribute('disabled', 'disabled');

                            } else {
                                swal({ title: "Warning", text: "Fabric not found.", type: "warning", timer: 5000 });
                                _('txtArtFabricCode').value = '';
                                _('txtArtFabricDes').value = '';
                                _('txtArtFabricCode').removeAttribute('disabled');
                            }
                        }, (p) => { err(p); });

                } else {

                    e.innerHTML = `<span class="fa fa-search"></span>`;
                    e.classList.remove('btn-danger');
                    e.classList.add('btn-primary');
                    _('txtArtFabricCode').removeAttribute('disabled');
                    _('txtArtFabricCode').value = '';
                    _('txtArtFabricDes').removeAttribute('disabled');
                    _('txtArtFabricDes').value = '';
                }

            } else {
                swal({ title: "Warning", text: "You must enter fabric code.", type: "warning", timer: 5000 });
            }
        }
        //FUNCIONALIDAD BUSCAR TELA : FIN

        //FUNCIONALIDAD CARGA REPORT LIST:INICIO

        function fn_listReportTest() {

            let resultado = [];
            let arrRows = Array.from(_('tbodyReportListArte').rows);
            arrRows.forEach(x => {

                let IdReportList = x.getAttribute('idreportlist');
                let selects = x.getElementsByTagName('select');

                if (selects.length > 0) {

                    let TestCode = selects[0].value;
                    let ColorCode = selects[1].value;
                    let EstadoReportTest = selects[2].value;

                    let obj = {};
                    obj.IdReportTest = IdReportList;
                    obj.TestCode = TestCode;
                    obj.ColorCode = ColorCode;
                    obj.EstadoReportTest = EstadoReportTest;
                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function cargarTestReport(arrTestReport) {

            $("#tbodyReportListArte tr").remove();

            arrTestReport.forEach(x => {

                let idReportList = x.IdReporte;
                let testCode = x.TestCode;
                let fechaCreacion = x.FechaCreacion;
                let Estado = x.Estado;
                let aprobador = x.Aprobador;
                let fechaAprobacion = x.FechaAprobacion;
                let colorCode = x.ColorCode;

                dibujarReporteList(idReportList, testCode, fechaCreacion, Estado, aprobador, fechaAprobacion, colorCode)
            })
        }

        function AddReportList() {
            dibujarReporteList(0, '', '', 0, '', '',0)
        }

        function dibujarReporteList(idReportList, testCode, fechaCreacion, Estado, aprobador, fechaAprobacion, colorCode) {

            let btnConsecion = '';
            let btnEliminar = ` <button type="button" class="btn btn-xs btn-danger" onclick="app_NewOrnament.deleteReporte(this)" >
                                    <i class="fa fa-trash"></i>
                                </button>`

            if (Estado == 'R' && aprobador == '') {
                btnConsecion = `<button type="button" class="btn btn-xs btn-primary" id="btnRequestConcessionColor"  onclick="app_NewOrnament.fn_concession(this)">
                                                        <i class="fa fa-plus"></i> Request
                                </button>`

            }

            let strDisable = ''
            if (aprobador != '') {
                btnConsecion = '';
                btnEliminar = '';
                strDisable = 'disabled="disabled"';
            }

            let table_testlist = `<tr class="test_${idReportList}" id="${idReportList}" idReportList="${idReportList}">
                                            <td>
                                                ${btnEliminar}
                                            </td>
                                            <td>
                                                <select class="input-sm form-control"  ${strDisable} style = "width: 100%;" id = "RptTestCode_${idReportList}" >
                                                ${ovariables.tmpCboReportTestList}
                                                 </select >
                                            </td> 
                                            <td>
                                                <select class="input-sm form-control"  ${strDisable} style = "width: 100%;" id = "RptColorCode_${idReportList}" >
                                                ${ovariables.tmpCboColorTestReport}
                                                 </select >
                                            </td> 
                                            <td>
                                                ${fechaCreacion}
                                            </td>
                                            <td>
                                               <select class="input-sm form-control" style = "width: 100%;"   ${strDisable}  id ="RptEstado_${idReportList}"  >
                                                ${ovariables.ListaReporteTestEstadotStr}
                                                </select >
                                            </td>
                                            <td>
                                                 ${btnConsecion}
                                            </td>
                                            <td>
                                                 ${aprobador}
                                            </td>
                                            <td>
                                                 ${fechaAprobacion}
                                            </td>
                                        </tr>`;

            $("#tbodyReportListArte").append(table_testlist);

            if (idReportList > 0) {

                _('RptTestCode_' + idReportList).value = testCode;
                _('RptEstado_' + idReportList).value = Estado;
                _('RptColorCode_' + idReportList).value = colorCode;
                
            }

        }

        //FUNCIONALIDAD CARGA REPORT LIST:FIN

        //FUNCIONALIDAD FILE REQUERIMIENTO:INICIO

        function InicializarTablaFile() {
            $("#tbl_files_orna").DataTable({
                info: false,
                lengthChange: false,
                ordering: true,
                order: [1, 'asc'],
                paging: false,
                searching: false
            });
        }

        function loadFileRequerimento() {
            _('inputFileRequerimiento_orna').onchange = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
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
                        guardarFileRequerimiento(this);
                        break;
                    default:
                        swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                        input.value = '';
                }
            }
        }

        function guardarFileRequerimiento() {

            let IdRequerimientoDetalle = _('IdRequerimientoDetalleAr').value;
            let IdFile = '0';

            let objRequerimientoTela = {
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                IdFile: IdFile
            }

            let frm = new FormData();

            frm.append('requerimientoFileJSON', JSON.stringify(objRequerimientoTela));
            frm.append('archivoFile', $("#inputFileRequerimiento_orna")[0].files[0]);

            _Post('Requerimiento/Ornamento/SaveFileRequerimiento', frm, true)
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

                        $("#modal_NewStyle").modal("hide");
                       
                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function listarFileRequerimiento() {

            dibujarTablaFile();
            let IdRequerimientoDetalle = _('IdRequerimientoDetalleAr').value;
            let IdFile = '0';
            let objRequerimientoTela = {
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                IdFile: IdFile
            }

            let frm = new FormData();
            frm.append('requerimientoFileJSON', JSON.stringify(objRequerimientoTela));

            _Post('Requerimiento/Ornamento/GetListaFileRequerimiento_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta !== null) {
                        ovariables.ListRegistros = orpta;
                        _promise()
                            .then(crearTablaFileRequerimiento(ovariables.ListRegistros))
                            .then(InicializarTablaFile())
                            .then(setearTipoFileRequerimiento(ovariables.ListRegistros))
                    }
                }, (p) => { err(p); });
        }

        function dibujarTablaFile() {

            document.getElementById("div_tbl_files_orna").innerHTML = "";
            document.getElementById("div_tbl_files_orna").innerHTML = `<table class="table table-hover table-bordered table-vertical" id="tbl_files_orna">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="no-sort" width="6%"></th>
                                                                            <th width="32%">Name</th>
                                                                            <th width="20%">User</th>
                                                                            <th width="22%">Type</th>
                                                                            <th width="20%">Upload Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="tbody_files_orna"></tbody>
                                                                </table>`;
        }

        function crearTablaFileRequerimiento(data) {

            const html = data.map(x => {
                return `<tr data-id="${x.IdFile}" data-req="${x.IdRequerimiento}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewOrnament.deletefile(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewOrnament.downloadfile('${x.FileNombre}', '${x.FileOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.FileOriginal}</td>
                            <td>${_capitalizePhrase(x.UsuarioCreacion)}</td>
                            <td><select class="input-sm form-control no-borders" style="width: 100%;" id="cboTipoFile_${x.IdFile}">${ovariables.tmpCboTipoFile}</select></td>
                            <td>${x.FechaCreacion}</td>
                        </tr>`;
            }).join('');
            _('tbody_files_orna').innerHTML = '';
            _('tbody_files_orna').innerHTML = html;
        }

        function setearTipoFileRequerimiento(data) {

            data.forEach(x => {
                _('cboTipoFile_' + x.IdFile).value = x.Tipo;
            });
        }

        function downloadfile(nombrearchivo, nombrearchivooriginal) {

            let urlaccion = `../Requerimiento/Ornamento/DownLoadFile?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            window.location.href = urlaccion;
        }

        function deletefile(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idreq = button.parentElement.parentElement.getAttribute("data-req");
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
                        IdFile: id,
                        IdRequerimiento: idreq

                    }, frm = new FormData();
                frm.append('requerimientoFileJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/Ornamento/DeleteFileRequerimiento_jSON', frm)
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

        //ELIMINACION DE COMBO DETALLE:INICIO
        function deleteComboDetalle(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                let id = button.parentElement.parentElement.getAttribute("data-idColor");

                if (id != 0) {

                    if (ovariables.flgCopy) {

                        $(button.parentElement.parentElement).remove();
                        swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                    } else {
                        let parametro = {
                            IdComboColorDetalle: id
                        }, frm = new FormData();

                        frm.append('paramsJSON', JSON.stringify(parametro));
                        _Post('Requerimiento/Ornamento/DeleteComboColorDetalle_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {

                                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                    $(button.parentElement.parentElement).remove()

                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    }

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });
        }

        function deleteCombo(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                let id = button.parentElement.parentElement.getAttribute("data-comboid");
                let nombreCombo = button.parentElement.parentElement.getAttribute("data-combo");

                if (id != 0) {

                    if (ovariables.flgCopy) {

                        swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                        fn_delete_row(nombreCombo);

                    } else {

                        let parametro = {
                            IdComboColor: id
                        }, frm = new FormData();

                        frm.append('paramsJSON', JSON.stringify(parametro));
                        _Post('Requerimiento/Ornamento/DeleteComboColor_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {

                                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                    fn_delete_row(nombreCombo);

                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    }

                } else {

                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                    fn_delete_row(nombreCombo);
                }

            });
        }

        function fn_delete_row(colorname) {
            $(`.colorname table tbody tr[data-par='colorname:${colorname}']`).remove();
        }


        //ELIMINACION DE COMBO DETALLE: FIN

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
                const mail_header = _('mailbox_header_art');
                const html = data.map(x => {
                    return `<div class="feed-element feed-cursor" data-id="${x.IdBandeja}" onclick="app_NewOrnament.fn_load_mail(this)">
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
                const mail_body = _('mailbox_body_art');
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
            fn_replace_list: fn_replace_list,
            fn_replace_text: fn_replace_text,
            fn_addcomboitem: fn_addcomboitem,
            fn_add_items_colorname: fn_add_items_colorname,
            toogle_colorname_ocultar: toogle_colorname_ocultar,            
            fn_addtests_list_item: fn_addtests_list_item,
            fn_add_suppliername_tosend: fn_add_suppliername_tosend,
            fn_remove_suppliername_tosend: fn_remove_suppliername_tosend,
            filtrarTecnicaTipoArte: filtrarTecnicaTipoArte,
            fn_fullscreen: fn_fullscreen,
            fn_delete_row: fn_delete_row,
            deleteReporte: deleteReporte,
            deleteTest: deleteTest,
            fn_concession: fn_concession,
             deleteComboDetalle: deleteComboDetalle,
            deleteCombo: deleteCombo,
            GenerarConcesion: GenerarConcesion,
            deletefile: deletefile,
            downloadfile: downloadfile,
            fn_load_mail: fn_load_mail
        }
    }
)(document, 'panelEncabezado_NewOrnament');
(
    function ini() {
        app_NewOrnament.load();
        app_NewOrnament.req_ini();
    }
)();